"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Drawer008Step = {
  title: string
  text: string
  options?: string[]
}

export type Drawer008Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  steps?: Drawer008Step[]
  finishLabel?: string
  /** Счётчик шагов: {step} — текущий, {total} — сколько всего. */
  stepTemplate?: string
  nextLabel?: string
  backLabel?: string
  closeLabel?: string
  /** Пусто — подложки нет, триггер лежит прямо на фоне страницы. */
  background?: string
  /** Открыть шторку сразу и без модального режима: она остаётся внутри блока. */
  defaultOpen?: boolean
  accent?: string
}

// Идея компонента: ящик с несколькими шагами вместо длинной формы. За раз
// виден один вопрос, полоса сверху показывает, сколько осталось, а «Назад»
// не закрывает панель, а возвращает на шаг: у мастера две разные операции
// отмены, и их нельзя вешать на одну кнопку.
const STYLES = `
:where([data-vibeui-block="drawer-008"]){
--vibeui-drawer-008-bg:transparent;
--vibeui-drawer-008-surface:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-drawer-008-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-drawer-008-muted:color-mix(in oklab,var(--vibeui-drawer-008-fg) 68%,transparent);
--vibeui-drawer-008-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-drawer-008-accent:light-dark(oklch(0.287 0 0),oklch(0.901 0 0));
--vibeui-drawer-008-on-accent:light-dark(oklch(0.99 0 265),oklch(0.17 0 265));
--vibeui-drawer-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="drawer-008"]{color-scheme:dark}
[data-vibeui-block="drawer-008"]{
display:inline-block;font-family:var(--vibeui-drawer-008-font);color:var(--vibeui-drawer-008-fg);
}
[data-vibeui-block="drawer-008"] [data-part="trigger"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-drawer-008-border);border-radius:0.625rem;
background:var(--vibeui-drawer-008-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="drawer-008"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-drawer-008-accent);outline-offset:2px}
[data-vibeui-block="drawer-008"] dialog{
position:fixed;inset:0 0 0 auto;margin:0;
width:min(25rem,100vw);max-width:100vw;height:100dvh;max-height:100dvh;
padding:0;border:0;background:var(--vibeui-drawer-008-surface);color:inherit;
box-shadow:-24px 0 60px -30px oklch(0.2 0 265 / 55%);
translate:100% 0;transition:translate .22s ease,overlay .22s allow-discrete,display .22s allow-discrete;
}
[data-vibeui-block="drawer-008"] dialog[open]{translate:0 0}
@starting-style{
[data-vibeui-block="drawer-008"] dialog[open]{translate:100% 0}
}
/* Затемнение позади ящика одно на обе темы: подложка гасит страницу, а не красится вместе с ней. */
[data-vibeui-block="drawer-008"] dialog::backdrop{background:oklch(0.19 0 265 / 45%)}
[data-vibeui-block="drawer-008"] [data-part="panel"]{display:flex;flex-direction:column;height:100%;box-sizing:border-box}
/* Полоса шагов: сегменты, а не проценты — шагов заведомо немного. */
[data-vibeui-block="drawer-008"] [data-part="progress"]{display:flex;gap:0.25rem;padding:0.875rem 1rem 0}
[data-vibeui-block="drawer-008"] [data-part="segment"]{
flex:1;height:0.25rem;border-radius:9999px;background:var(--vibeui-drawer-008-border);
transition:background-color .2s ease;
}
[data-vibeui-block="drawer-008"] [data-part="segment"][data-done="true"]{background:var(--vibeui-drawer-008-accent);color:oklch(from var(--vibeui-drawer-008-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="drawer-008"] [data-part="head"]{padding:0.75rem 1rem 0.5rem}
[data-vibeui-block="drawer-008"] [data-part="counter"]{
display:block;margin-bottom:0.25rem;
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-drawer-008-muted);
}
[data-vibeui-block="drawer-008"] [data-part="title"]{margin:0;font-size:1rem;font-weight:680;line-height:1.25}
[data-vibeui-block="drawer-008"] [data-part="body"]{flex:1;min-height:0;overflow-y:auto;padding:0.5rem 1rem 1rem}
[data-vibeui-block="drawer-008"] [data-part="text"]{margin:0 0 0.875rem;font-size:0.875rem;line-height:1.5;color:var(--vibeui-drawer-008-muted)}
[data-vibeui-block="drawer-008"] [data-part="options"]{display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="drawer-008"] [data-part="option"]{
display:flex;align-items:center;gap:0.625rem;cursor:pointer;
padding:0.625rem 0.75rem;border:1px solid var(--vibeui-drawer-008-border);border-radius:0.75rem;
font-size:0.875rem;
}
[data-vibeui-block="drawer-008"] [data-part="option"]:has(input:checked){
border-color:var(--vibeui-drawer-008-accent);
background:color-mix(in oklab,var(--vibeui-drawer-008-accent) 8%,transparent);
}
[data-vibeui-block="drawer-008"] [data-part="option"] input{
appearance:none;flex:none;width:1.0625rem;height:1.0625rem;margin:0;
border:1.5px solid var(--vibeui-drawer-008-border);border-radius:9999px;cursor:pointer;position:relative;
}
[data-vibeui-block="drawer-008"] [data-part="option"] input:checked{border-color:var(--vibeui-drawer-008-accent)}
[data-vibeui-block="drawer-008"] [data-part="option"] input:checked::after{
content:"";position:absolute;inset:0.1875rem;border-radius:9999px;background:var(--vibeui-drawer-008-accent);color:oklch(from var(--vibeui-drawer-008-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="drawer-008"] [data-part="option"] input:focus-visible{outline:2px solid var(--vibeui-drawer-008-accent);outline-offset:2px}
[data-vibeui-block="drawer-008"] [data-part="foot"]{
display:flex;gap:0.5rem;
padding:0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom,0px));
border-top:1px solid var(--vibeui-drawer-008-border);
}
[data-vibeui-block="drawer-008"] [data-part="foot"] button{
appearance:none;cursor:pointer;height:2.5rem;border-radius:0.625rem;
border:1px solid var(--vibeui-drawer-008-border);background:transparent;color:inherit;
font:inherit;font-size:0.875rem;font-weight:600;padding:0 1rem;
}
[data-vibeui-block="drawer-008"] [data-part="foot"] button[data-primary="true"]{
flex:1;border-color:transparent;background:var(--vibeui-drawer-008-accent);color:oklch(from var(--vibeui-drawer-008-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
[data-vibeui-block="drawer-008"] [data-part="foot"] button:focus-visible{outline:2px solid var(--vibeui-drawer-008-accent);outline-offset:2px}
/* Немодальный показ: шторка остаётся внутри блока, а не уходит в верхний
   слой поверх страницы. Так её показывают на витрине и в документации. */
[data-vibeui-block="drawer-008"]:has(dialog:not(:modal)[open]){
display:block;position:relative;width:100%;min-height:24rem;
}
[data-vibeui-block="drawer-008"] dialog:not(:modal){position:absolute;max-width:100%;max-height:100%;z-index:1}
[data-vibeui-block="drawer-008"]:has(dialog:not(:modal)[open]) [data-part="trigger"]{display:none}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="drawer-008"] *{animation:none!important;transition:none!important}
[data-vibeui-block="drawer-008"] dialog{translate:0 0}
}
`

const DEFAULT_STEPS: Drawer008Step[] = [
  {
    title: "Откуда берём код",
    text: "Подключим репозиторий, чтобы собирать проект после каждого коммита.",
    options: ["GitHub", "GitLab", "Загрузить архив"],
  },
  {
    title: "Как собирать",
    text: "Команда сборки определится сама, но её можно поменять позже в настройках.",
    options: ["Определить автоматически", "Задать вручную"],
  },
  {
    title: "Куда публиковать",
    text: "Адрес можно сменить в любой момент — старый продолжит работать месяц.",
    options: ["Домен проекта", "Свой домен"],
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Ящик с шагами: один вопрос за раз, полоса прогресса и раздельные «Назад»
 * и «Закрыть». Один файл, ноль зависимостей, собственная палитра.
 */
export function Drawer008({
  triggerLabel = "Подключить проект",
  title = "Подключение проекта",
  steps = DEFAULT_STEPS,
  finishLabel = "Готово",
  stepTemplate = "Шаг {step} из {total}",
  nextLabel = "Далее",
  backLabel = "Назад",
  closeLabel = "Закрыть",
  background = "",
  defaultOpen = false,
  accent,
  className,
  style,
  ...props
}: Drawer008Props) {
  const drawer = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!defaultOpen) {
      return
    }

    const active = document.activeElement

    // show() вместо showModal(): немодальная шторка живёт внутри своего блока
    // и не уводит страницу в верхний слой. Витрине нужна именно такая.
    drawer.current?.show()

    // show() уводит фокус внутрь панели. Для немодального показа это лишнее:
    // страница не должна прыгать к шторке просто потому, что та открыта.
    if (active instanceof HTMLElement && active !== document.body) {
      active.focus()
    } else if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [defaultOpen])
  const group = useId()
  const [step, setStep] = useState(0)

  const palette = {
    ...(accent ? { "--vibeui-drawer-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-drawer-008-bg": background,
          "--vibeui-drawer-008-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const current = steps[Math.min(step, steps.length - 1)]
  const last = step >= steps.length - 1
  const counter = stepTemplate
    .replace("{step}", String(step + 1))
    .replace("{total}", String(steps.length))

  function open() {
    setStep(0)
    drawer.current?.showModal()
  }

  return (
    <>
      <style href="vibeui-drawer-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="drawer"
        data-vibeui-block="drawer-008"
        className={className}
        style={palette}
      >
        <button type="button" data-part="trigger" onClick={open}>
          {triggerLabel}
        </button>
        <dialog
          ref={drawer}
          aria-label={title}
          onClick={(event) => {
            // щелчок мимо панели приходит самому <dialog>: закрываем
            if (event.target === event.currentTarget) {
              event.currentTarget.close()
            }
          }}
        >
          <div data-part="panel">
            <div
              data-part="progress"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={steps.length}
              aria-valuenow={step + 1}
              aria-label={counter}
            >
              {steps.map((item, index) => (
                <span
                  key={item.title}
                  data-part="segment"
                  data-done={index <= step}
                />
              ))}
            </div>
            <div data-part="head">
              <span data-part="counter">{counter}</span>
              <h2 data-part="title">{current.title}</h2>
            </div>
            <div data-part="body">
              <p data-part="text">{current.text}</p>
              {current.options ? (
                <div data-part="options">
                  {current.options.map((option, index) => (
                    <label key={option} data-part="option">
                      <input
                        type="radio"
                        name={`${group}-${step}`}
                        defaultChecked={index === 0}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              ) : null}
            </div>
            <div data-part="foot">
              {step > 0 ? (
                <button type="button" onClick={() => setStep(step - 1)}>
                  {backLabel}
                </button>
              ) : (
                <button type="button" onClick={() => drawer.current?.close()}>
                  {closeLabel}
                </button>
              )}
              <button
                type="button"
                data-primary="true"
                onClick={() =>
                  last ? drawer.current?.close() : setStep(step + 1)
                }
              >
                {last ? finishLabel : nextLabel}
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </>
  )
}

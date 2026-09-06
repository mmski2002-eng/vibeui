"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Drawer003Group = {
  title: string
  options: { label: string; count: number }[]
}

export type Drawer003Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  groups?: Drawer003Group[]
  applyLabel?: string
  /** Подпись сброса: компонент несёт русскую, проект подставляет свою. */
  resetLabel?: string
  /** Имя счётчика для скринридера, {count} — сколько условий выбрано. */
  selectedTemplate?: string
  /** Пусто — подложки нет, триггер лежит прямо на фоне страницы. */
  background?: string
  /** Открыть шторку сразу и без модального режима: она остаётся внутри блока. */
  defaultOpen?: boolean
  accent?: string
}

// Идея компонента: боковой ящик фильтров, который ничего не применяет сам.
// Выбор копится внутри и уходит одной кнопкой внизу — так список за спиной
// не перестраивается после каждой галочки. Счётчик выбранного виден на
// кнопке применения и на сбросе: сколько условий сейчас включено.
const STYLES = `
:where([data-vibeui-block="drawer-003"]){
--vibeui-drawer-003-bg:transparent;
--vibeui-drawer-003-surface:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-drawer-003-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-drawer-003-muted:color-mix(in oklab,var(--vibeui-drawer-003-fg) 68%,transparent);
--vibeui-drawer-003-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-drawer-003-accent:light-dark(oklch(0.55 0.17 265),oklch(0.73 0.15 265));
--vibeui-drawer-003-on-accent:light-dark(oklch(0.99 0 265),oklch(0.17 0 265));
--vibeui-drawer-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="drawer-003"]{color-scheme:dark}
[data-vibeui-block="drawer-003"]{
display:inline-block;font-family:var(--vibeui-drawer-003-font);color:var(--vibeui-drawer-003-fg);
}
[data-vibeui-block="drawer-003"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.5rem;
height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-drawer-003-border);border-radius:0.625rem;
background:var(--vibeui-drawer-003-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="drawer-003"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-drawer-003-accent);outline-offset:2px}
[data-vibeui-block="drawer-003"] [data-part="badge"]{
display:inline-flex;align-items:center;justify-content:center;
min-width:1.25rem;height:1.25rem;padding:0 0.375rem;border-radius:9999px;
background:var(--vibeui-drawer-003-accent);color:var(--vibeui-drawer-003-on-accent);
font-size:0.6875rem;font-weight:700;
}
/* Ящик справа: как и остальные шторки категории — фильтры выезжают с той
   же стороны, что и вся выдвижная навигация продукта. */
[data-vibeui-block="drawer-003"] dialog{
position:fixed;inset:0 0 0 auto;margin:0;
width:min(20rem,100vw);max-width:100vw;height:100dvh;max-height:100dvh;
padding:0;border:0;background:var(--vibeui-drawer-003-surface);color:inherit;
box-shadow:-24px 0 60px -30px oklch(0.2 0 265 / 55%);
translate:100% 0;transition:translate .22s ease,overlay .22s allow-discrete,display .22s allow-discrete;
}
[data-vibeui-block="drawer-003"] dialog[open]{translate:0 0}
@starting-style{
[data-vibeui-block="drawer-003"] dialog[open]{translate:100% 0}
}
/* Затемнение позади ящика одно на обе темы: подложка гасит страницу, а не красится вместе с ней. */
[data-vibeui-block="drawer-003"] dialog::backdrop{background:oklch(0.19 0 265 / 45%)}
[data-vibeui-block="drawer-003"] [data-part="panel"]{
display:flex;flex-direction:column;height:100%;box-sizing:border-box;
}
[data-vibeui-block="drawer-003"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:1rem 1rem 0.75rem;border-bottom:1px solid var(--vibeui-drawer-003-border);
}
[data-vibeui-block="drawer-003"] [data-part="title"]{margin:0;font-size:1rem;font-weight:680}
[data-vibeui-block="drawer-003"] [data-part="reset"]{
appearance:none;border:0;background:transparent;cursor:pointer;padding:0;
color:var(--vibeui-drawer-003-accent);font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="drawer-003"] [data-part="reset"]:disabled{cursor:default;color:var(--vibeui-drawer-003-muted);opacity:.6}
[data-vibeui-block="drawer-003"] [data-part="reset"]:focus-visible{outline:2px solid var(--vibeui-drawer-003-accent);outline-offset:2px;border-radius:0.25rem}
/* Прокручивается только середина: шапка и кнопка применения всегда на месте. */
[data-vibeui-block="drawer-003"] [data-part="body"]{
flex:1;min-height:0;overflow-y:auto;padding:0.25rem 1rem 1rem;
}
[data-vibeui-block="drawer-003"] fieldset{margin:0;padding:0.875rem 0 0;border:0}
[data-vibeui-block="drawer-003"] legend{
padding:0;font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-drawer-003-muted);
}
[data-vibeui-block="drawer-003"] [data-part="option"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.4375rem 0;cursor:pointer;font-size:0.875rem;
}
[data-vibeui-block="drawer-003"] [data-part="option"] input{
appearance:none;flex:none;width:1.125rem;height:1.125rem;margin:0;
border:1.5px solid var(--vibeui-drawer-003-border);border-radius:0.375rem;
background:var(--vibeui-drawer-003-surface);cursor:pointer;position:relative;
}
[data-vibeui-block="drawer-003"] [data-part="option"] input:checked{
background:var(--vibeui-drawer-003-accent);border-color:var(--vibeui-drawer-003-accent);
}
[data-vibeui-block="drawer-003"] [data-part="option"] input:checked::after{
content:"";position:absolute;left:0.3125rem;top:0.125rem;
width:0.25rem;height:0.5rem;border:solid var(--vibeui-drawer-003-on-accent);
border-width:0 2px 2px 0;transform:rotate(45deg);
}
[data-vibeui-block="drawer-003"] [data-part="option"] input:focus-visible{outline:2px solid var(--vibeui-drawer-003-accent);outline-offset:2px}
[data-vibeui-block="drawer-003"] [data-part="count"]{margin-left:auto;font-size:0.75rem;color:var(--vibeui-drawer-003-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="drawer-003"] [data-part="foot"]{
padding:0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom,0px));
border-top:1px solid var(--vibeui-drawer-003-border);
}
[data-vibeui-block="drawer-003"] [data-part="apply"]{
appearance:none;border:0;cursor:pointer;width:100%;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.75rem;padding:0.25rem 0.875rem;border-radius:0.75rem;
background:var(--vibeui-drawer-003-accent);color:var(--vibeui-drawer-003-on-accent);
font:inherit;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="drawer-003"] [data-part="apply"]:focus-visible{outline:2px solid var(--vibeui-drawer-003-accent);outline-offset:2px}
/* Немодальный показ: шторка остаётся внутри блока, а не уходит в верхний
   слой поверх страницы. Так её показывают на витрине и в документации. */
[data-vibeui-block="drawer-003"]:has(dialog:not(:modal)[open]){
display:block;position:relative;width:100%;min-height:24rem;
}
[data-vibeui-block="drawer-003"] dialog:not(:modal){position:absolute;max-width:100%;max-height:100%;z-index:1}
[data-vibeui-block="drawer-003"]:has(dialog:not(:modal)[open]) [data-part="trigger"]{display:none}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="drawer-003"] *{animation:none!important;transition:none!important}
[data-vibeui-block="drawer-003"] dialog{translate:0 0}
}
`

const DEFAULT_GROUPS: Drawer003Group[] = [
  {
    title: "Категория",
    options: [
      { label: "Кнопки", count: 24 },
      { label: "Формы", count: 18 },
      { label: "Таблицы", count: 12 },
    ],
  },
  {
    title: "Состояние",
    options: [
      { label: "Новые", count: 9 },
      { label: "Обновлённые", count: 14 },
    ],
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
 * Боковой ящик фильтров: выбор копится внутри и уходит одной кнопкой внизу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Drawer003({
  triggerLabel = "Фильтры",
  title = "Фильтры",
  groups = DEFAULT_GROUPS,
  applyLabel = "Показать результаты",
  resetLabel = "Сбросить",
  selectedTemplate = "выбрано {count}",
  background = "",
  defaultOpen = false,
  accent,
  className,
  style,
  ...props
}: Drawer003Props) {
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
  const [picked, setPicked] = useState<string[]>([])

  const palette = {
    ...(accent ? { "--vibeui-drawer-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-drawer-003-bg": background,
          "--vibeui-drawer-003-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  function toggle(label: string) {
    setPicked((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    )
  }

  return (
    <>
      <style href="vibeui-drawer-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="drawer"
        data-vibeui-block="drawer-003"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="trigger"
          onClick={() => drawer.current?.showModal()}
        >
          {triggerLabel}
          {picked.length ? (
            <span
              data-part="badge"
              aria-label={selectedTemplate.replace(
                "{count}",
                String(picked.length),
              )}
            >
              {picked.length}
            </span>
          ) : null}
        </button>
        <dialog
          ref={drawer}
          aria-label={title}
          onClick={(event) => {
            if (event.target === drawer.current) {
              drawer.current.close()
            }
          }}
        >
          <div data-part="panel">
            <div data-part="head">
              <h2 data-part="title">{title}</h2>
              <button
                type="button"
                data-part="reset"
                disabled={picked.length === 0}
                onClick={() => setPicked([])}
              >
                {resetLabel}
              </button>
            </div>
            <div data-part="body">
              {groups.map((group) => (
                <fieldset key={group.title}>
                  <legend>{group.title}</legend>
                  {group.options.map((option) => (
                    <label key={option.label} data-part="option">
                      <input
                        type="checkbox"
                        checked={picked.includes(option.label)}
                        onChange={() => toggle(option.label)}
                      />
                      <span>{option.label}</span>
                      <span data-part="count">{option.count}</span>
                    </label>
                  ))}
                </fieldset>
              ))}
            </div>
            <div data-part="foot">
              <button
                type="button"
                data-part="apply"
                onClick={() => drawer.current?.close()}
              >
                {applyLabel}
                {picked.length ? ` · ${picked.length}` : ""}
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </>
  )
}

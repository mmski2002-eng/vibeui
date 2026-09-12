"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Drawer007Section = {
  heading: string
  text: string
}

export type Drawer007Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  sections?: Drawer007Section[]
  agreeLabel?: string
  acceptLabel?: string
  /** Имя крестика для скринридера. */
  closeLabel?: string
  /** Пусто — подложки нет, триггер лежит прямо на фоне страницы. */
  background?: string
  /** Открыть шторку сразу и без модального режима: она остаётся внутри блока. */
  defaultOpen?: boolean
  accent?: string
}

// Идея компонента: ящик во всю высоту для длинного текста. Прокручивается
// только середина; заголовки разделов прилипают к верху колонки, а подвал с
// согласием и кнопкой стоит на месте — до действия не нужно доезжать до
// конца документа, и видно, в каком разделе сейчас находишься.
const STYLES = `
:where([data-vibeui-block="drawer-007"]){
--vibeui-drawer-007-bg:transparent;
--vibeui-drawer-007-surface:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-drawer-007-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-drawer-007-muted:color-mix(in oklab,var(--vibeui-drawer-007-fg) 68%,transparent);
--vibeui-drawer-007-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-drawer-007-accent:light-dark(oklch(0.287 0 0),oklch(0.901 0 0));
--vibeui-drawer-007-on-accent:light-dark(oklch(0.99 0 265),oklch(0.17 0 265));
--vibeui-drawer-007-hover:light-dark(oklch(0.96 0 265),oklch(0.29 0 265));
--vibeui-drawer-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="drawer-007"]{color-scheme:dark}
[data-vibeui-block="drawer-007"]{
display:inline-block;font-family:var(--vibeui-drawer-007-font);color:var(--vibeui-drawer-007-fg);
}
[data-vibeui-block="drawer-007"] [data-part="trigger"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-drawer-007-border);border-radius:0.625rem;
background:var(--vibeui-drawer-007-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="drawer-007"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-drawer-007-accent);outline-offset:2px}
[data-vibeui-block="drawer-007"] dialog{
position:fixed;inset:0 0 0 auto;margin:0;
width:min(30rem,100vw);max-width:100vw;height:100dvh;max-height:100dvh;
padding:0;border:0;background:var(--vibeui-drawer-007-surface);color:inherit;
box-shadow:-24px 0 60px -30px oklch(0.2 0 265 / 55%);
translate:100% 0;transition:translate .22s ease,overlay .22s allow-discrete,display .22s allow-discrete;
}
[data-vibeui-block="drawer-007"] dialog[open]{translate:0 0}
@starting-style{
[data-vibeui-block="drawer-007"] dialog[open]{translate:100% 0}
}
/* Затемнение позади ящика одно на обе темы: подложка гасит страницу, а не красится вместе с ней. */
[data-vibeui-block="drawer-007"] dialog::backdrop{background:oklch(0.19 0 265 / 45%)}
[data-vibeui-block="drawer-007"] [data-part="panel"]{display:flex;flex-direction:column;height:100%;box-sizing:border-box}
[data-vibeui-block="drawer-007"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:1rem 1.125rem 0.75rem;border-bottom:1px solid var(--vibeui-drawer-007-border);
}
[data-vibeui-block="drawer-007"] [data-part="title"]{margin:0;font-size:1rem;font-weight:680}
[data-vibeui-block="drawer-007"] [data-part="close"]{
appearance:none;border:0;cursor:pointer;background:transparent;flex:none;
display:flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:0.5rem;color:var(--vibeui-drawer-007-muted);
}
[data-vibeui-block="drawer-007"] [data-part="close"]:hover{background:var(--vibeui-drawer-007-hover);color:var(--vibeui-drawer-007-fg)}
[data-vibeui-block="drawer-007"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-drawer-007-accent);outline-offset:2px}
[data-vibeui-block="drawer-007"] [data-part="cross"]{position:relative;width:0.625rem;height:0.625rem}
[data-vibeui-block="drawer-007"] [data-part="cross"]::before,
[data-vibeui-block="drawer-007"] [data-part="cross"]::after{
content:"";position:absolute;left:0;top:50%;width:100%;height:1.5px;
margin-top:-0.75px;background:currentColor;border-radius:9999px;
}
[data-vibeui-block="drawer-007"] [data-part="cross"]::before{transform:rotate(45deg)}
[data-vibeui-block="drawer-007"] [data-part="cross"]::after{transform:rotate(-45deg)}
/* Единственная прокручиваемая область: min-height:0 обязателен во flex. */
[data-vibeui-block="drawer-007"] [data-part="body"]{
flex:1;min-height:0;overflow-y:auto;padding:0 1.125rem 1rem;
}
/* Заголовок раздела прилипает: видно, где ты, не поднимаясь наверх. */
[data-vibeui-block="drawer-007"] [data-part="heading"]{
position:sticky;top:0;z-index:1;margin:0;
padding:0.75rem 0 0.5rem;background:var(--vibeui-drawer-007-surface);
font-size:0.75rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-drawer-007-muted);
box-shadow:0 1px 0 var(--vibeui-drawer-007-border);
}
[data-vibeui-block="drawer-007"] [data-part="text"]{
margin:0.75rem 0 1.25rem;font-size:0.875rem;line-height:1.6;
}
[data-vibeui-block="drawer-007"] [data-part="foot"]{
display:flex;flex-direction:column;gap:0.625rem;
padding:0.875rem 1.125rem calc(0.875rem + env(safe-area-inset-bottom,0px));
border-top:1px solid var(--vibeui-drawer-007-border);background:var(--vibeui-drawer-007-surface);
}
[data-vibeui-block="drawer-007"] [data-part="agree"]{
display:flex;align-items:flex-start;gap:0.5rem;cursor:pointer;font-size:0.8125rem;line-height:1.4;
}
[data-vibeui-block="drawer-007"] [data-part="agree"] input{
appearance:none;flex:none;width:1.125rem;height:1.125rem;margin:0.0625rem 0 0;
border:1.5px solid var(--vibeui-drawer-007-border);border-radius:0.375rem;
background:var(--vibeui-drawer-007-surface);cursor:pointer;position:relative;
}
[data-vibeui-block="drawer-007"] [data-part="agree"] input:checked{
background:var(--vibeui-drawer-007-accent);border-color:var(--vibeui-drawer-007-accent);color:oklch(from var(--vibeui-drawer-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="drawer-007"] [data-part="agree"] input:checked::after{
content:"";position:absolute;left:0.3125rem;top:0.125rem;
width:0.25rem;height:0.5rem;border:solid var(--vibeui-drawer-007-on-accent);
border-width:0 2px 2px 0;transform:rotate(45deg);
}
[data-vibeui-block="drawer-007"] [data-part="agree"] input:focus-visible{outline:2px solid var(--vibeui-drawer-007-accent);outline-offset:2px}
[data-vibeui-block="drawer-007"] [data-part="accept"]{
appearance:none;border:0;cursor:pointer;width:100%;height:2.75rem;border-radius:0.75rem;
background:var(--vibeui-drawer-007-accent);color:oklch(from var(--vibeui-drawer-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font:inherit;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="drawer-007"] [data-part="accept"]:disabled{cursor:not-allowed;opacity:.45}
[data-vibeui-block="drawer-007"] [data-part="accept"]:focus-visible{outline:2px solid var(--vibeui-drawer-007-accent);outline-offset:2px}
/* Немодальный показ: шторка остаётся внутри блока, а не уходит в верхний
   слой поверх страницы. Так её показывают на витрине и в документации. */
[data-vibeui-block="drawer-007"]:has(dialog:not(:modal)[open]){
display:block;position:relative;width:100%;min-height:24rem;
}
[data-vibeui-block="drawer-007"] dialog:not(:modal){position:absolute;max-width:100%;max-height:100%;z-index:1}
[data-vibeui-block="drawer-007"]:has(dialog:not(:modal)[open]) [data-part="trigger"]{display:none}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="drawer-007"] *{animation:none!important;transition:none!important}
[data-vibeui-block="drawer-007"] dialog{translate:0 0}
}
`

const DEFAULT_SECTIONS: Drawer007Section[] = [
  {
    heading: "Что меняется",
    text: "С 1 апреля публикация проекта считается по числу активных адресов, а не по числу сборок. Старые проекты пересчитываются автоматически, доплачивать за прошедшие месяцы не нужно.",
  },
  {
    heading: "Хранение данных",
    text: "Исходники и журналы сборки хранятся 90 дней с момента последней публикации. После этого журналы удаляются, исходники остаются доступными для скачивания ещё год.",
  },
  {
    heading: "Доступ команды",
    text: "Приглашённый участник видит проекты, к которым его добавили, и историю их публикаций. Права владельца остаются у создателя пространства и передаются только вручную.",
  },
  {
    heading: "Отказ от условий",
    text: "Если новые условия не подходят, проект можно выгрузить одним архивом и удалить пространство. Выгрузка содержит исходники, настройки сборки и список адресов.",
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
 * Ящик во всю высоту: липкие заголовки разделов и подвал с согласием.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Drawer007({
  triggerLabel = "Читать условия",
  title = "Обновлённые условия",
  sections = DEFAULT_SECTIONS,
  agreeLabel = "Я прочитал условия и согласен с ними",
  acceptLabel = "Принять",
  closeLabel = "Закрыть панель",
  background = "",
  defaultOpen = false,
  accent,
  className,
  style,
  ...props
}: Drawer007Props) {
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
  const [agreed, setAgreed] = useState(false)

  const palette = {
    ...(accent ? { "--vibeui-drawer-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-drawer-007-bg": background,
          "--vibeui-drawer-007-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-drawer-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="drawer"
        data-vibeui-block="drawer-007"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="trigger"
          onClick={() => drawer.current?.showModal()}
        >
          {triggerLabel}
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
                data-part="close"
                aria-label={closeLabel}
                onClick={() => drawer.current?.close()}
              >
                <span data-part="cross" aria-hidden="true" />
              </button>
            </div>
            <div data-part="body">
              {sections.map((section) => (
                <section key={section.heading}>
                  <h3 data-part="heading">{section.heading}</h3>
                  <p data-part="text">{section.text}</p>
                </section>
              ))}
            </div>
            <div data-part="foot">
              <label data-part="agree">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(event) => setAgreed(event.target.checked)}
                />
                <span>{agreeLabel}</span>
              </label>
              <button
                type="button"
                data-part="accept"
                disabled={!agreed}
                onClick={() => drawer.current?.close()}
              >
                {acceptLabel}
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </>
  )
}

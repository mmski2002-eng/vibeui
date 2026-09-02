"use client"

import { useRef } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Drawer004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  status?: string
  fields?: { label: string; value: string }[]
  events?: { time: string; text: string }[]
  /** Подписи разметки: компонент несёт русские, проект подставляет свои. */
  historyLabel?: string
  closeLabel?: string
  dismissLabel?: string
  openLabel?: string
  /** Пусто — подложки нет, триггер лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: ящик деталей одной записи. Строку таблицы не нужно
// открывать на отдельной странице: детали приезжают сбоку, список остаётся
// на месте, и после закрытия человек продолжает с той же строки. Поля
// выложены словарём, история — списком с вертикальной линией.
const STYLES = `
:where([data-vibeui-block="drawer-004"]){
--vibeui-drawer-004-bg:transparent;
--vibeui-drawer-004-surface:light-dark(oklch(1 0 0),oklch(0.22 0.013 265));
--vibeui-drawer-004-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-drawer-004-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-drawer-004-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-drawer-004-accent:light-dark(oklch(0.55 0.17 265),oklch(0.73 0.15 265));
--vibeui-drawer-004-on-accent:light-dark(oklch(0.99 0.01 265),oklch(0.17 0.02 265));
--vibeui-drawer-004-hover:light-dark(oklch(0.96 0.004 265),oklch(0.29 0.013 265));
--vibeui-drawer-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="drawer-004"]{
display:inline-block;font-family:var(--vibeui-drawer-004-font);color:var(--vibeui-drawer-004-fg);
}
[data-vibeui-block="drawer-004"] [data-part="trigger"]{
appearance:none;cursor:pointer;
height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-drawer-004-border);border-radius:0.625rem;
background:var(--vibeui-drawer-004-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="drawer-004"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-drawer-004-accent);outline-offset:2px}
[data-vibeui-block="drawer-004"] dialog{
position:fixed;inset:0 0 0 auto;margin:0;
width:min(26rem,100vw);max-width:100vw;height:100dvh;max-height:100dvh;
padding:0;border:0;background:var(--vibeui-drawer-004-surface);color:inherit;
box-shadow:-24px 0 60px -30px oklch(0.2 0.02 265 / 55%);
translate:100% 0;transition:translate .22s ease,overlay .22s allow-discrete,display .22s allow-discrete;
}
[data-vibeui-block="drawer-004"] dialog[open]{translate:0 0}
@starting-style{
[data-vibeui-block="drawer-004"] dialog[open]{translate:100% 0}
}
[data-vibeui-block="drawer-004"] dialog::backdrop{background:oklch(0.19 0.02 265 / 45%)}
[data-vibeui-block="drawer-004"] [data-part="panel"]{display:flex;flex-direction:column;height:100%;box-sizing:border-box}
[data-vibeui-block="drawer-004"] [data-part="head"]{
display:flex;align-items:flex-start;gap:0.75rem;padding:1rem 1rem 0.875rem;
border-bottom:1px solid var(--vibeui-drawer-004-border);
}
[data-vibeui-block="drawer-004"] [data-part="mark"]{
flex:none;display:flex;align-items:center;justify-content:center;
width:2.5rem;height:2.5rem;border-radius:0.75rem;
background:color-mix(in oklab,var(--vibeui-drawer-004-accent) 14%,transparent);
color:var(--vibeui-drawer-004-accent);font-size:0.875rem;font-weight:700;
}
[data-vibeui-block="drawer-004"] [data-part="heading"]{display:flex;flex-direction:column;gap:0.25rem;min-width:0}
[data-vibeui-block="drawer-004"] [data-part="title"]{margin:0;font-size:1rem;font-weight:680;line-height:1.25}
[data-vibeui-block="drawer-004"] [data-part="status"]{
align-self:flex-start;padding:0.125rem 0.5rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-drawer-004-accent) 12%,transparent);
color:var(--vibeui-drawer-004-accent);font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="drawer-004"] [data-part="close"]{
appearance:none;border:0;cursor:pointer;background:transparent;margin-left:auto;flex:none;
display:flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:0.5rem;color:var(--vibeui-drawer-004-muted);
}
[data-vibeui-block="drawer-004"] [data-part="close"]:hover{background:var(--vibeui-drawer-004-hover);color:var(--vibeui-drawer-004-fg)}
[data-vibeui-block="drawer-004"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-drawer-004-accent);outline-offset:2px}
[data-vibeui-block="drawer-004"] [data-part="cross"]{position:relative;width:0.625rem;height:0.625rem}
[data-vibeui-block="drawer-004"] [data-part="cross"]::before,
[data-vibeui-block="drawer-004"] [data-part="cross"]::after{
content:"";position:absolute;left:0;top:50%;width:100%;height:1.5px;
margin-top:-0.75px;background:currentColor;border-radius:9999px;
}
[data-vibeui-block="drawer-004"] [data-part="cross"]::before{transform:rotate(45deg)}
[data-vibeui-block="drawer-004"] [data-part="cross"]::after{transform:rotate(-45deg)}
[data-vibeui-block="drawer-004"] [data-part="body"]{flex:1;min-height:0;overflow-y:auto;padding:1rem}
/* Пары «поле — значение» словарём: подписи слева узкой колонкой. */
[data-vibeui-block="drawer-004"] dl{
display:grid;grid-template-columns:8rem 1fr;gap:0.5rem 0.75rem;margin:0;font-size:0.8125rem;
}
[data-vibeui-block="drawer-004"] [data-part="row"]{display:contents}
[data-vibeui-block="drawer-004"] dt{color:var(--vibeui-drawer-004-muted)}
[data-vibeui-block="drawer-004"] dd{margin:0;font-weight:600;overflow-wrap:anywhere}
[data-vibeui-block="drawer-004"] [data-part="section"]{
margin:1.25rem 0 0;padding-top:0.875rem;border-top:1px solid var(--vibeui-drawer-004-border);
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-drawer-004-muted);
}
/* История — вертикальная линия с точками: порядок событий виден сразу. */
[data-vibeui-block="drawer-004"] [data-part="events"]{
list-style:none;margin:0.625rem 0 0;padding:0 0 0 1rem;
border-left:1.5px solid var(--vibeui-drawer-004-border);
}
[data-vibeui-block="drawer-004"] [data-part="event"]{position:relative;padding:0 0 0.75rem}
[data-vibeui-block="drawer-004"] [data-part="event"]:last-child{padding-bottom:0}
[data-vibeui-block="drawer-004"] [data-part="event"]::before{
content:"";position:absolute;left:-1.4375rem;top:0.3125rem;
width:0.5rem;height:0.5rem;border-radius:9999px;
background:var(--vibeui-drawer-004-surface);border:1.5px solid var(--vibeui-drawer-004-accent);
}
[data-vibeui-block="drawer-004"] [data-part="time"]{display:block;font-size:0.6875rem;color:var(--vibeui-drawer-004-muted)}
[data-vibeui-block="drawer-004"] [data-part="text"]{font-size:0.8125rem}
[data-vibeui-block="drawer-004"] [data-part="foot"]{
display:flex;gap:0.5rem;padding:0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom,0px));
border-top:1px solid var(--vibeui-drawer-004-border);
}
[data-vibeui-block="drawer-004"] [data-part="foot"] button{
appearance:none;cursor:pointer;flex:1;height:2.375rem;border-radius:0.625rem;
border:1px solid var(--vibeui-drawer-004-border);background:transparent;color:inherit;
font:inherit;font-size:0.875rem;font-weight:600;
}
[data-vibeui-block="drawer-004"] [data-part="foot"] button[data-primary="true"]{
border-color:transparent;background:var(--vibeui-drawer-004-accent);color:var(--vibeui-drawer-004-on-accent);
}
[data-vibeui-block="drawer-004"] [data-part="foot"] button:focus-visible{outline:2px solid var(--vibeui-drawer-004-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="drawer-004"] *{animation:none!important;transition:none!important}
[data-vibeui-block="drawer-004"] dialog{translate:0 0}
}
`

const DEFAULT_FIELDS = [
  { label: "Номер", value: "ORD-2481" },
  { label: "Покупатель", value: "Анна Ковалёва" },
  { label: "Сумма", value: "11 670 ₽" },
  { label: "Способ оплаты", value: "Карта •• 4417" },
  { label: "Создан", value: "12 марта, 14:08" },
]

const DEFAULT_EVENTS = [
  { time: "14:08", text: "Заказ создан" },
  { time: "14:11", text: "Оплата подтверждена" },
  { time: "15:40", text: "Передан в доставку" },
]

function initials(value: string) {
  return value
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

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
 * Ящик деталей записи: поля словарём и история событий рядом со списком.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Drawer004({
  triggerLabel = "Открыть заказ",
  title = "Заказ ORD-2481",
  status = "Оплачен",
  fields = DEFAULT_FIELDS,
  events = DEFAULT_EVENTS,
  historyLabel = "История",
  closeLabel = "Закрыть детали",
  dismissLabel = "Закрыть",
  openLabel = "Открыть целиком",
  background = "",
  accent,
  className,
  style,
  ...props
}: Drawer004Props) {
  const drawer = useRef<HTMLDialogElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-drawer-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-drawer-004-bg": background,
          "--vibeui-drawer-004-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-drawer-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="drawer-004"
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
              <span data-part="mark" aria-hidden="true">
                {initials(title)}
              </span>
              <span data-part="heading">
                <h2 data-part="title">{title}</h2>
                <span data-part="status">{status}</span>
              </span>
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
              <dl>
                {fields.map((field) => (
                  <div key={field.label} data-part="row">
                    <dt>{field.label}</dt>
                    <dd>{field.value}</dd>
                  </div>
                ))}
              </dl>
              <p data-part="section">{historyLabel}</p>
              <ul data-part="events">
                {events.map((event) => (
                  <li key={event.time} data-part="event">
                    <span data-part="time">{event.time}</span>
                    <span data-part="text">{event.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div data-part="foot">
              <button type="button" onClick={() => drawer.current?.close()}>
                {dismissLabel}
              </button>
              <button type="button" data-primary="true">
                {openLabel}
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </>
  )
}

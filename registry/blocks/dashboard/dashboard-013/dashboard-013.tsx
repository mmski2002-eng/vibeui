"use client"

import { useRef } from "react"
import type { CSSProperties } from "react"

export type Dashboard013Props = {
  triggerLabel?: string
  title?: string
  subtitle?: string
  facts?: { label: string; value: string }[]
  events?: { time: string; text: string }[]
  primary?: string
  secondary?: string
  closeLabel?: string
  historyLabel?: string
  accent?: string
  /** Подложка панели; пусто — цвет из палитры блока. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: панель подробностей, выезжающая справа. Она собрана на нативном
// <dialog>: ловушка фокуса, закрытие по Escape и затемнение достаются от
// браузера, а своя реализация чинится месяцами. Панель прижата к правому краю
// через margin, а не transform, поэтому она не ломает прокрутку внутри себя.
// Появление анимировано @starting-style с allow-discrete — без него панель
// возникает рывком. Кнопка закрытия стоит первой в разметке: с клавиатуры до
// неё добираются раньше содержимого.
const STYLES = `
:where([data-vibeui-block="dashboard-013"]){
--vibeui-dashboard-013-bg:light-dark(oklch(1 0 0),oklch(0.23 0.013 265));
--vibeui-dashboard-013-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-dashboard-013-muted:light-dark(oklch(0.55 0.014 265),oklch(0.69 0.012 265));
--vibeui-dashboard-013-border:light-dark(oklch(0.91 0.006 265),oklch(0.35 0.012 265));
--vibeui-dashboard-013-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.15 262));
--vibeui-dashboard-013-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.02 265));
--vibeui-dashboard-013-scrim:light-dark(oklch(0.2 0.02 265 / 40%),oklch(0.1 0.015 265 / 62%));
--vibeui-dashboard-013-shadow:light-dark(oklch(0.2 0.03 265 / 45%),oklch(0.04 0.01 265 / 72%));
--vibeui-dashboard-013-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="dashboard-013"]{
box-sizing:border-box;
font-family:var(--vibeui-dashboard-013-sans);color:var(--vibeui-dashboard-013-fg);
}
[data-vibeui-block="dashboard-013"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-013"] [data-part="open"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-dashboard-013-accent);color:var(--vibeui-dashboard-013-on-accent);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="dashboard-013"] [data-part="open"]:focus-visible{outline:2px solid var(--vibeui-dashboard-013-accent);outline-offset:2px}
/* Панель прижата margin, а не transform: прокрутка внутри остаётся живой. */
[data-vibeui-block="dashboard-013"] dialog{
width:min(22rem,100vw);max-width:none;height:100dvh;max-height:none;
margin:0 0 0 auto;padding:0;border:0;
background:var(--vibeui-dashboard-013-bg);color:var(--vibeui-dashboard-013-fg);
box-shadow:-24px 0 60px -30px var(--vibeui-dashboard-013-shadow);
opacity:0;translate:1.5rem 0;
transition:opacity .18s ease,translate .18s ease,display .18s allow-discrete,overlay .18s allow-discrete;
}
[data-vibeui-block="dashboard-013"] dialog[open]{opacity:1;translate:0 0}
@starting-style{[data-vibeui-block="dashboard-013"] dialog[open]{opacity:0;translate:1.5rem 0}}
[data-vibeui-block="dashboard-013"] dialog::backdrop{background:var(--vibeui-dashboard-013-scrim)}
[data-vibeui-block="dashboard-013"] [data-part="panel"]{display:flex;flex-direction:column;height:100%}
[data-vibeui-block="dashboard-013"] [data-part="head"]{
display:flex;align-items:flex-start;gap:0.75rem;
padding:0.875rem 1rem;border-bottom:1px solid var(--vibeui-dashboard-013-border);
}
[data-vibeui-block="dashboard-013"] h2{margin:0;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="dashboard-013"] [data-part="subtitle"]{margin:0.125rem 0 0;font-size:0.75rem;color:var(--vibeui-dashboard-013-muted)}
/* Кнопка закрытия первой в разметке: с клавиатуры до неё доходят раньше. */
[data-vibeui-block="dashboard-013"] [data-part="close"]{
order:-1;flex:none;appearance:none;border:0;background:none;cursor:pointer;
width:2rem;height:2rem;border-radius:0.5rem;
color:var(--vibeui-dashboard-013-muted);font:inherit;font-size:1rem;line-height:1;
}
[data-vibeui-block="dashboard-013"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-dashboard-013-accent);outline-offset:1px}
[data-vibeui-block="dashboard-013"] [data-part="body"]{flex:1 1 auto;overflow-y:auto;padding:0.875rem 1rem}
[data-vibeui-block="dashboard-013"] dl{display:grid;grid-template-columns:auto 1fr;gap:0.375rem 0.75rem;margin:0 0 1rem;font-size:0.75rem}
[data-vibeui-block="dashboard-013"] [data-part="row"]{display:contents}
[data-vibeui-block="dashboard-013"] dt{color:var(--vibeui-dashboard-013-muted)}
[data-vibeui-block="dashboard-013"] dd{margin:0}
[data-vibeui-block="dashboard-013"] h3{margin:0 0 0.375rem;font-size:0.75rem;font-weight:650;letter-spacing:0.02em;text-transform:uppercase;color:var(--vibeui-dashboard-013-muted)}
[data-vibeui-block="dashboard-013"] ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="dashboard-013"] li{
display:grid;grid-template-columns:auto 1fr;gap:0.5rem;
font-size:0.75rem;line-height:1.45;
}
[data-vibeui-block="dashboard-013"] [data-part="time"]{color:var(--vibeui-dashboard-013-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="dashboard-013"] [data-part="foot"]{
display:flex;gap:0.5rem;padding:0.75rem 1rem;
border-top:1px solid var(--vibeui-dashboard-013-border);
}
[data-vibeui-block="dashboard-013"] [data-part="foot"] button{
flex:1 1 0;appearance:none;cursor:pointer;height:2.25rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="dashboard-013"] [data-part="primary"]{border:0;background:var(--vibeui-dashboard-013-accent);color:var(--vibeui-dashboard-013-on-accent)}
[data-vibeui-block="dashboard-013"] [data-part="secondary"]{
border:1px solid var(--vibeui-dashboard-013-border);background:none;color:inherit;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="dashboard-013"] dialog{transition:none;opacity:1;translate:0 0}
[data-vibeui-block="dashboard-013"] *{animation:none!important}
}
`

const DEFAULT_FACTS = [
  { label: "Счёт", value: "№ 300" },
  { label: "Заказчик", value: "ООО «Полёт»" },
  { label: "Сумма", value: "24 000 ₽" },
  { label: "Срок", value: "до 20 марта" },
]

const DEFAULT_EVENTS = [
  { time: "12 марта", text: "Счёт выставлен и отправлен на почту бухгалтерии" },
  { time: "13 марта", text: "Письмо открыто, вложение скачано" },
  { time: "14 марта", text: "Напоминание отправлено автоматически" },
]

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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
 * Панель подробностей справа на нативном dialog: фокус и Escape от браузера.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard013({
  triggerLabel = "Открыть подробности",
  title = "Счёт № 300",
  subtitle = "ООО «Полёт» · ожидает оплаты",
  facts = DEFAULT_FACTS,
  events = DEFAULT_EVENTS,
  primary = "Отправить повторно",
  secondary = "Скачать PDF",
  closeLabel = "Закрыть",
  historyLabel = "История",
  accent,
  background = "",
  className,
  style,
}: Dashboard013Props) {
  const panel = useRef<HTMLDialogElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-dashboard-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-013" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="dashboard-013"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="open"
          onClick={() => panel.current?.showModal()}
        >
          {triggerLabel}
        </button>

        <dialog ref={panel} aria-label={title}>
          <div data-part="panel">
            <header data-part="head">
              <button
                type="button"
                data-part="close"
                aria-label={closeLabel}
                onClick={() => panel.current?.close()}
              >
                ×
              </button>
              <div>
                <h2>{title}</h2>
                <p data-part="subtitle">{subtitle}</p>
              </div>
            </header>

            <div data-part="body">
              <dl>
                {facts.map((fact) => (
                  <div key={fact.label} data-part="row">
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <h3>{historyLabel}</h3>
              <ul>
                {events.map((event) => (
                  <li key={event.time}>
                    <span data-part="time">{event.time}</span>
                    <span>{event.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <footer data-part="foot">
              <button type="button" data-part="secondary">
                {secondary}
              </button>
              <button type="button" data-part="primary">
                {primary}
              </button>
            </footer>
          </div>
        </dialog>
      </div>
    </>
  )
}

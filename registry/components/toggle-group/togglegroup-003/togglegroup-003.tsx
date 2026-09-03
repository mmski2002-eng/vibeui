"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Togglegroup003Props = Omit<
  ComponentProps<"section">,
  "children" | "onChange"
> & {
  label?: string
  defaultValue?: string
  /** Заголовок над списком. */
  heading?: string
  items?: string[]
  /** Подписи кнопок по идентификатору вида: компонент несёт русские. */
  viewText?: Record<string, string>
  onChange?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: группа переключателей вместе с тем, чем она управляет.
// aria-controls связывает её со списком, и вид меняется в той же разметке —
// видно, что группа выбирает состояние вида, а не запускает действие.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте панель темнеет, а границы становятся светлее фона.
const STYLES = `
:where([data-vibeui-block="togglegroup-003"]){
--vibeui-togglegroup-003-bg:transparent;
--vibeui-togglegroup-003-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-togglegroup-003-muted:color-mix(in oklab,var(--vibeui-togglegroup-003-fg) 68%,transparent);
--vibeui-togglegroup-003-border:light-dark(oklch(0.9 0.006 265),oklch(0.35 0.012 265));
--vibeui-togglegroup-003-surface:light-dark(oklch(0.97 0.004 265),oklch(0.26 0.01 265));
--vibeui-togglegroup-003-raised:light-dark(oklch(1 0 0),oklch(0.34 0.012 265));
--vibeui-togglegroup-003-shadow:light-dark(oklch(0.2 0.02 265 / 14%),oklch(0 0 0 / 45%));
--vibeui-togglegroup-003-accent:light-dark(oklch(0.52 0.15 195),oklch(0.76 0.13 195));
--vibeui-togglegroup-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="togglegroup-003"]{color-scheme:dark}
[data-vibeui-block="togglegroup-003"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:26rem;padding:0.875rem;
border:1px solid var(--vibeui-togglegroup-003-border);border-radius:0.875rem;
background:var(--vibeui-togglegroup-003-bg);color:var(--vibeui-togglegroup-003-fg);
font-family:var(--vibeui-togglegroup-003-font);
}
[data-vibeui-block="togglegroup-003"] *{box-sizing:border-box}
[data-vibeui-block="togglegroup-003"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;flex-wrap:wrap;
}
[data-vibeui-block="togglegroup-003"] h3{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="togglegroup-003"] [data-part="group"]{
display:inline-flex;gap:0.125rem;padding:0.1875rem;
border-radius:0.625rem;background:var(--vibeui-togglegroup-003-surface);
}
[data-vibeui-block="togglegroup-003"] button{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;gap:0.375rem;
height:2rem;padding:0 0.5625rem;border:0;border-radius:0.4375rem;
background:transparent;color:var(--vibeui-togglegroup-003-muted);
font-size:0.75rem;font-weight:600;line-height:1;
transition:background-color .15s ease,color .15s ease;
}
[data-vibeui-block="togglegroup-003"] button svg{width:0.875rem;height:0.875rem}
[data-vibeui-block="togglegroup-003"] button:focus-visible{
outline:2px solid var(--vibeui-togglegroup-003-accent);outline-offset:1px;
}
[data-vibeui-block="togglegroup-003"] button[aria-pressed="true"]{
background:var(--vibeui-togglegroup-003-raised);color:var(--vibeui-togglegroup-003-accent);
box-shadow:0 1px 2px var(--vibeui-togglegroup-003-shadow);
}
[data-vibeui-block="togglegroup-003"] ul{
list-style:none;margin:0;padding:0;display:grid;gap:0.375rem;
}
[data-vibeui-block="togglegroup-003"] li{
display:flex;align-items:center;gap:0.5rem;
padding:0.5rem 0.625rem;border-radius:0.5rem;
background:var(--vibeui-togglegroup-003-surface);
font-size:0.8125rem;line-height:1.3;
}
[data-vibeui-block="togglegroup-003"] li::before{
content:"";flex:none;width:1.5rem;height:1.5rem;border-radius:0.375rem;
background:color-mix(in oklab,var(--vibeui-togglegroup-003-accent) 22%,var(--vibeui-togglegroup-003-raised));
}
/* Три вида — три набора правил над одной и той же разметкой: список не
   пересобирается, поэтому переключение не теряет прокрутку и фокус. */
[data-vibeui-block="togglegroup-003"][data-view="grid"] ul{grid-template-columns:repeat(2,minmax(0,1fr))}
[data-vibeui-block="togglegroup-003"][data-view="grid"] li{
flex-direction:column;align-items:flex-start;gap:0.4375rem;padding:0.625rem;
}
[data-vibeui-block="togglegroup-003"][data-view="grid"] li::before{width:100%;height:2.25rem}
[data-vibeui-block="togglegroup-003"][data-view="compact"] ul{gap:0}
[data-vibeui-block="togglegroup-003"][data-view="compact"] li{
padding:0.3125rem 0.5rem;border-radius:0;background:transparent;
border-bottom:1px solid var(--vibeui-togglegroup-003-border);font-size:0.75rem;
}
[data-vibeui-block="togglegroup-003"][data-view="compact"] li::before{width:0.375rem;height:0.375rem;border-radius:50%}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="togglegroup-003"] *{animation:none!important;transition:none!important}}
`

const VIEWS = [
  { id: "list", d: "M2 4h10M2 7h10M2 10h10" },
  {
    id: "grid",
    d: "M2 2.5h4v4H2zM8 2.5h4v4H8zM2 8.5h4v4H2zM8 8.5h4v4H8z",
  },
  { id: "compact", d: "M2 3h10M2 5.5h10M2 8h10M2 10.5h10" },
]

const VIEW_TEXT: Record<string, string> = {
  list: "Список",
  grid: "Сетка",
  compact: "Компактно",
}

const DEFAULT_ITEMS = [
  "Бриф для дизайнера",
  "Смета на печать",
  "Договор подряда",
  "Отчёт за квартал",
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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
 * Стрелки водят фокус внутри группы: до дальней кнопки не нужно дожимать
 * Tab через все предыдущие, а Home и End бросают на края.
 */
function moveFocus(event: KeyboardEvent<HTMLDivElement>) {
  const step =
    event.key === "ArrowRight" || event.key === "ArrowDown"
      ? 1
      : event.key === "ArrowLeft" || event.key === "ArrowUp"
        ? -1
        : 0

  if (step === 0 && event.key !== "Home" && event.key !== "End") {
    return
  }

  const buttons = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>("button"),
  )
  const from = buttons.indexOf(document.activeElement as HTMLButtonElement)

  if (from === -1) {
    return
  }

  const last = buttons.length - 1
  const next =
    event.key === "Home" ? 0 : event.key === "End" ? last : from + step

  event.preventDefault()
  buttons[next < 0 ? last : next > last ? 0 : next].focus()
}

/**
 * Группа выбора вида списка, связанная со списком через aria-controls:
 * вид меняется правилами над одной разметкой. Один файл, ноль зависимостей.
 */
export function Togglegroup003({
  label = "Вид списка",
  defaultValue = "list",
  heading = "Документы",
  items = DEFAULT_ITEMS,
  viewText = VIEW_TEXT,
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Togglegroup003Props) {
  const [value, setValue] = useState(defaultValue)
  const listId = useId()

  const palette = {
    ...(accent ? { "--vibeui-togglegroup-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-togglegroup-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-togglegroup-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="toggle-group"
        data-vibeui-block="togglegroup-003"
        data-view={value}
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3>{heading}</h3>
          <div
            data-part="group"
            role="group"
            aria-label={label}
            onKeyDown={moveFocus}
          >
            {VIEWS.map((view) => (
              <button
                key={view.id}
                type="button"
                aria-pressed={value === view.id}
                aria-controls={listId}
                onClick={() => {
                  setValue(view.id)
                  onChange?.(view.id)
                }}
              >
                <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d={view.d}
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
                {viewText[view.id] ?? VIEW_TEXT[view.id]}
              </button>
            ))}
          </div>
        </div>
        <ul id={listId}>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </>
  )
}

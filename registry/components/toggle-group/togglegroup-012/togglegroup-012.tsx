"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Togglegroup012Props = Omit<
  ComponentProps<"section">,
  "children" | "onChange"
> & {
  label?: string
  defaultValue?: string
  /** Подписи кнопок по идентификатору периода. */
  periodText?: Record<string, string>
  /** Подписи оси по идентификатору точки. */
  tickText?: Record<string, string>
  /** Итог с подстановками {period} и {count}. */
  summaryText?: string
  onChange?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: переключатель периода графика одиночным выбором. Смена
// периода не перекрашивает старые столбцы — под каждым периодом свой набор
// точек с собственными подписями оси, поэтому график пересобирается целиком,
// а не растягивает прежние данные на новый масштаб.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте панель темнеет, а границы становятся светлее фона.
const STYLES = `
:where([data-vibeui-block="togglegroup-012"]){
--vibeui-togglegroup-012-bg:transparent;
--vibeui-togglegroup-012-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-togglegroup-012-muted:color-mix(in oklab,var(--vibeui-togglegroup-012-fg) 68%,transparent);
--vibeui-togglegroup-012-border:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-togglegroup-012-surface:light-dark(oklch(0.97 0 265),oklch(0.25 0 265));
--vibeui-togglegroup-012-raised:light-dark(oklch(1 0 0),oklch(0.33 0 265));
--vibeui-togglegroup-012-shadow:light-dark(oklch(0.2 0 265 / 14%),oklch(0 0 0 / 45%));
--vibeui-togglegroup-012-accent:light-dark(oklch(0.6 0.15 165),oklch(0.74 0.14 165));
--vibeui-togglegroup-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="togglegroup-012"]{color-scheme:dark}
[data-vibeui-block="togglegroup-012"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:24rem;padding:0.875rem;
border:1px solid var(--vibeui-togglegroup-012-border);border-radius:0.875rem;
background:var(--vibeui-togglegroup-012-bg);color:var(--vibeui-togglegroup-012-fg);
font-family:var(--vibeui-togglegroup-012-font);
}
[data-vibeui-block="togglegroup-012"] *{box-sizing:border-box}
[data-vibeui-block="togglegroup-012"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="togglegroup-012"] [data-part="group"]{
display:inline-flex;gap:0.125rem;padding:0.1875rem;
border-radius:0.625rem;background:var(--vibeui-togglegroup-012-surface);
}
[data-vibeui-block="togglegroup-012"] button{
appearance:none;cursor:pointer;font:inherit;
height:1.75rem;padding:0 0.625rem;border:0;border-radius:0.4375rem;
background:transparent;color:var(--vibeui-togglegroup-012-muted);
font-size:0.75rem;font-weight:600;line-height:1;
transition:background-color .15s ease,color .15s ease;
}
[data-vibeui-block="togglegroup-012"] button:focus-visible{
outline:2px solid var(--vibeui-togglegroup-012-accent);outline-offset:1px;
}
[data-vibeui-block="togglegroup-012"] button[aria-pressed="true"]{
background:var(--vibeui-togglegroup-012-raised);color:var(--vibeui-togglegroup-012-accent);
box-shadow:0 1px 2px var(--vibeui-togglegroup-012-shadow);
}
[data-vibeui-block="togglegroup-012"] [data-part="chart"]{
display:flex;align-items:flex-end;gap:0.5rem;height:6rem;
padding:0.5rem 0.25rem 0;border-bottom:1px solid var(--vibeui-togglegroup-012-border);
}
[data-vibeui-block="togglegroup-012"] [data-part="col"]{
flex:1;display:flex;flex-direction:column;align-items:center;gap:0.375rem;height:100%;
justify-content:flex-end;
}
[data-vibeui-block="togglegroup-012"] [data-part="bar"]{
width:100%;max-width:1.5rem;border-radius:0.25rem 0.25rem 0 0;
background:var(--vibeui-togglegroup-012-accent);
transition:height .2s ease;
}
[data-vibeui-block="togglegroup-012"] [data-part="tick"]{
font-size:0.625rem;color:var(--vibeui-togglegroup-012-muted);
}
[data-vibeui-block="togglegroup-012"] [data-part="summary"]{
margin:0;font-size:0.75rem;color:var(--vibeui-togglegroup-012-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="togglegroup-012"] *{animation:none!important;transition:none!important}}
`

const PERIODS = [
  {
    id: "day",
    points: [
      { id: "06", value: 18 },
      { id: "09", value: 42 },
      { id: "12", value: 65 },
      { id: "15", value: 58 },
      { id: "18", value: 80 },
      { id: "21", value: 36 },
    ],
  },
  {
    id: "week",
    points: [
      { id: "mon", value: 30 },
      { id: "tue", value: 52 },
      { id: "wed", value: 45 },
      { id: "thu", value: 70 },
      { id: "fri", value: 88 },
      { id: "sat", value: 40 },
    ],
  },
  {
    id: "month",
    points: [
      { id: "w1", value: 40 },
      { id: "w2", value: 62 },
      { id: "w3", value: 55 },
      { id: "w4", value: 90 },
    ],
  },
  {
    id: "year",
    points: [
      { id: "q1", value: 48 },
      { id: "q2", value: 66 },
      { id: "q3", value: 58 },
      { id: "q4", value: 82 },
    ],
  },
]

const PERIOD_TEXT: Record<string, string> = {
  day: "День",
  week: "Неделя",
  month: "Месяц",
  year: "Год",
}

const TICK_TEXT: Record<string, string> = {
  "06": "06",
  "09": "09",
  "12": "12",
  "15": "15",
  "18": "18",
  "21": "21",
  mon: "Пн",
  tue: "Вт",
  wed: "Ср",
  thu: "Чт",
  fri: "Пт",
  sat: "Сб",
  w1: "1н",
  w2: "2н",
  w3: "3н",
  w4: "4н",
  q1: "Кв1",
  q2: "Кв2",
  q3: "Кв3",
  q4: "Кв4",
}

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
 * Переключатель периода графика одиночным выбором: под каждым периодом
 * собственный набор точек и подписей оси. Один файл, ноль зависимостей.
 */
export function Togglegroup012({
  label = "Период графика",
  defaultValue = "week",
  periodText = PERIOD_TEXT,
  tickText = TICK_TEXT,
  summaryText = "Период: {period}, точек на графике: {count}.",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Togglegroup012Props) {
  const [value, setValue] = useState(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-togglegroup-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-togglegroup-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const period = PERIODS.find((entry) => entry.id === value) ?? PERIODS[1]

  return (
    <>
      <style href="vibeui-togglegroup-012" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="toggle-group"
        data-vibeui-block="togglegroup-012"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <div
            data-part="group"
            role="group"
            aria-label={label}
            onKeyDown={moveFocus}
          >
            {PERIODS.map((entry) => (
              <button
                key={entry.id}
                type="button"
                aria-pressed={value === entry.id}
                onClick={() => {
                  setValue(entry.id)
                  onChange?.(entry.id)
                }}
              >
                {periodText[entry.id] ?? PERIOD_TEXT[entry.id]}
              </button>
            ))}
          </div>
        </div>
        <div data-part="chart" aria-hidden="true">
          {period.points.map((point) => (
            <div key={point.id} data-part="col">
              <span data-part="bar" style={{ height: `${point.value}%` }} />
              <span data-part="tick">
                {tickText[point.id] ?? TICK_TEXT[point.id]}
              </span>
            </div>
          ))}
        </div>
        <p data-part="summary" role="status">
          {summaryText
            .replace(
              "{period}",
              periodText[period.id] ?? PERIOD_TEXT[period.id],
            )
            .replace("{count}", String(period.points.length))}
        </p>
      </section>
    </>
  )
}

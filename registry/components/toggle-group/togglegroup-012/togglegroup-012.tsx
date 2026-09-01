"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Togglegroup012Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onChange"
> & {
  label?: string
  defaultValue?: string
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: переключатель периода графика одиночным выбором. Смена
// периода не перекрашивает старые столбцы — под каждым периодом свой набор
// точек с собственными подписями оси, поэтому график пересобирается целиком,
// а не растягивает прежние данные на новый масштаб.
const STYLES = `
:where([data-vibeui-block="togglegroup-012"]){
--vibeui-togglegroup-012-bg:oklch(1 0 0);
--vibeui-togglegroup-012-fg:oklch(0.22 0.014 265);
--vibeui-togglegroup-012-muted:oklch(0.55 0.014 265);
--vibeui-togglegroup-012-border:oklch(0.9 0.006 265);
--vibeui-togglegroup-012-surface:oklch(0.97 0.004 265);
--vibeui-togglegroup-012-accent:oklch(0.6 0.15 165);
--vibeui-togglegroup-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
background:var(--vibeui-togglegroup-012-bg);color:var(--vibeui-togglegroup-012-accent);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 14%);
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
    label: "День",
    points: [
      { tick: "06", value: 18 },
      { tick: "09", value: 42 },
      { tick: "12", value: 65 },
      { tick: "15", value: 58 },
      { tick: "18", value: 80 },
      { tick: "21", value: 36 },
    ],
  },
  {
    id: "week",
    label: "Неделя",
    points: [
      { tick: "Пн", value: 30 },
      { tick: "Вт", value: 52 },
      { tick: "Ср", value: 45 },
      { tick: "Чт", value: 70 },
      { tick: "Пт", value: 88 },
      { tick: "Сб", value: 40 },
    ],
  },
  {
    id: "month",
    label: "Месяц",
    points: [
      { tick: "1н", value: 40 },
      { tick: "2н", value: 62 },
      { tick: "3н", value: 55 },
      { tick: "4н", value: 90 },
    ],
  },
  {
    id: "year",
    label: "Год",
    points: [
      { tick: "Кв1", value: 48 },
      { tick: "Кв2", value: 66 },
      { tick: "Кв3", value: 58 },
      { tick: "Кв4", value: 82 },
    ],
  },
]

/**
 * Переключатель периода графика одиночным выбором: под каждым периодом
 * собственный набор точек и подписей оси. Один файл, ноль зависимостей.
 */
export function Togglegroup012({
  label = "Период графика",
  defaultValue = "week",
  onChange,
  accent,
  className,
  style,
  ...props
}: Togglegroup012Props) {
  const [value, setValue] = useState(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-togglegroup-012-accent": accent } : null),
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
        data-vibeui-block="togglegroup-012"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <div data-part="group" role="group" aria-label={label}>
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
                {entry.label}
              </button>
            ))}
          </div>
        </div>
        <div data-part="chart" aria-hidden="true">
          {period.points.map((point) => (
            <div key={point.tick} data-part="col">
              <span data-part="bar" style={{ height: `${point.value}%` }} />
              <span data-part="tick">{point.tick}</span>
            </div>
          ))}
        </div>
        <p data-part="summary" role="status">
          Период: {period.label}, точек на графике: {period.points.length}.
        </p>
      </section>
    </>
  )
}

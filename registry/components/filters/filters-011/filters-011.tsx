"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Filters011Preset = {
  label: string
  days: number
}

export type Filters011Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  title?: string
  presets?: Filters011Preset[]
  onChange?: (range: { from: string; to: string }) => void
  accent?: string
}

function toISODate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function daysAgo(days: number) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return toISODate(date)
}

// Идея компонента: диапазон дат остаётся двумя настоящими полями всегда —
// пресеты «неделя / месяц / квартал» лишь подставляют в них готовые значения,
// а не прячут поля за радиокнопкой. Отредактировать подставленное можно сразу
// же, а перевёрнутые границы меняются местами по уходу фокуса, а не ошибкой.
const STYLES = `
:where([data-vibeui-block="filters-011"]){
--vibeui-filters-011-surface:oklch(1 0 0);
--vibeui-filters-011-fill:oklch(0.975 0.004 265);
--vibeui-filters-011-fg:oklch(0.23 0.014 265);
--vibeui-filters-011-muted:oklch(0.55 0.014 265);
--vibeui-filters-011-border:oklch(0.89 0.008 265);
--vibeui-filters-011-shell:oklch(0.91 0.006 265);
--vibeui-filters-011-accent:oklch(0.53 0.15 235);
--vibeui-filters-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: фильтр показывают поверх любого фона. */
[data-vibeui-block="filters-011"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-filters-011-surface);
border:1px solid var(--vibeui-filters-011-shell);border-radius:0.875rem;
font-family:var(--vibeui-filters-011-font);color:var(--vibeui-filters-011-fg);
}
[data-vibeui-block="filters-011"] *{box-sizing:border-box}
[data-vibeui-block="filters-011"] h3{margin:0;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="filters-011"] [data-part="presets"]{
display:flex;flex-wrap:wrap;gap:0.3125rem;
}
[data-vibeui-block="filters-011"] [data-part="preset"]{
appearance:none;cursor:pointer;
padding:0.25rem 0.625rem;border-radius:9999px;
border:1px solid var(--vibeui-filters-011-border);
background:var(--vibeui-filters-011-fill);color:inherit;
font:inherit;font-size:0.6875rem;font-weight:600;
transition:border-color .16s ease,color .16s ease,background-color .16s ease;
}
[data-vibeui-block="filters-011"] [data-part="preset"]:hover{border-color:var(--vibeui-filters-011-accent)}
[data-vibeui-block="filters-011"] [data-part="preset"]:focus-visible{outline:2px solid var(--vibeui-filters-011-accent);outline-offset:2px}
[data-vibeui-block="filters-011"] [data-part="preset"][aria-pressed="true"]{
border-color:var(--vibeui-filters-011-accent);
color:var(--vibeui-filters-011-accent);
background:color-mix(in oklab,var(--vibeui-filters-011-accent) 10%,oklch(1 0 0));
}
[data-vibeui-block="filters-011"] [data-part="pair"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
}
[data-vibeui-block="filters-011"] [data-part="cell"]{
flex:1;min-width:8rem;display:flex;flex-direction:column;gap:0.1875rem;
}
[data-vibeui-block="filters-011"] [data-part="cell"] span{
font-size:0.6875rem;color:var(--vibeui-filters-011-muted);
}
[data-vibeui-block="filters-011"] input{
width:100%;height:2.375rem;padding:0 0.5rem;box-sizing:border-box;
border:1px solid var(--vibeui-filters-011-border);border-radius:0.625rem;
background:var(--vibeui-filters-011-surface);color:inherit;
font:inherit;font-size:0.8125rem;font-variant-numeric:tabular-nums;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="filters-011"] input:focus-visible{
outline:none;border-color:var(--vibeui-filters-011-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-filters-011-accent) 16%,transparent);
}
[data-vibeui-block="filters-011"] [data-part="summary"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-filters-011-muted);
}
[data-vibeui-block="filters-011"] [data-part="summary"] b{color:var(--vibeui-filters-011-fg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="filters-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PRESETS: Filters011Preset[] = [
  { label: "Неделя", days: 7 },
  { label: "Месяц", days: 30 },
  { label: "Квартал", days: 90 },
]

/**
 * Диапазон дат двумя полями и быстрыми пресетами «неделя / месяц / квартал»,
 * подставляющими готовые значения. Один файл, ноль зависимостей, своя палитра.
 */
export function Filters011({
  title = "Период",
  presets = DEFAULT_PRESETS,
  onChange,
  accent,
  className,
  style,
  ...props
}: Filters011Props) {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")

  const palette = {
    ...(accent ? { "--vibeui-filters-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  const push = (next: { from: string; to: string }) => {
    setFrom(next.from)
    setTo(next.to)
    onChange?.(next)
  }

  // Перевёрнутые границы меняются местами по уходу фокуса: человек уже
  // видит, что перепутал «с» и «по», и лишний шаг с ошибкой ему не нужен.
  const settle = () => {
    if (!from || !to || from <= to) return
    push({ from: to, to: from })
  }

  const applyPreset = (preset: Filters011Preset) =>
    push({ from: daysAgo(preset.days), to: toISODate(new Date()) })

  return (
    <>
      <style href="vibeui-filters-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="filters-011"
        className={className}
        style={palette}
      >
        <h3>{title}</h3>

        <div data-part="presets">
          {presets.map((preset) => {
            const pressed =
              from === daysAgo(preset.days) && to === toISODate(new Date())
            return (
              <button
                key={preset.label}
                type="button"
                data-part="preset"
                aria-pressed={pressed}
                onClick={() => applyPreset(preset)}
              >
                {preset.label}
              </button>
            )
          })}
        </div>

        <div data-part="pair">
          <label data-part="cell">
            <span>С</span>
            <input
              type="date"
              value={from}
              aria-label={`${title}: начало периода`}
              onChange={(event) => push({ from: event.target.value, to })}
              onBlur={settle}
            />
          </label>
          <label data-part="cell">
            <span>По</span>
            <input
              type="date"
              value={to}
              aria-label={`${title}: конец периода`}
              onChange={(event) => push({ from, to: event.target.value })}
              onBlur={settle}
            />
          </label>
        </div>

        <p data-part="summary" role="status">
          {from && to ? (
            <>
              Период: <b>{from}</b> — <b>{to}</b>
            </>
          ) : (
            "Период не задан — выберите пресет или даты."
          )}
        </p>
      </div>
    </>
  )
}

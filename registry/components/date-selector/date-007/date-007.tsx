"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Date007Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  defaultValue?: string
  fromYear?: number
  toYear?: number
  accent?: string
}

// Идея компонента: дата рождения тремя селектами. Календарь тут вредит:
// долистать до 1987 года — это сорок нажатий на стрелку, а маска ввода требует
// помнить порядок «день-месяц-год». Три списка спрашивают ровно то, что человек
// и так называет вслух. Число дней пересчитывается по месяцу и году, поэтому
// 31 февраля выбрать нельзя; если день выпал из месяца, он подтягивается к
// последнему существующему, а не молча обнуляется.
const STYLES = `
:where([data-vibeui-block="date-007"]){
--vibeui-date-007-surface:oklch(1 0 0);
--vibeui-date-007-field:oklch(1 0 0);
--vibeui-date-007-shell:oklch(0.9 0.006 265);
--vibeui-date-007-fg:oklch(0.23 0.014 265);
--vibeui-date-007-muted:oklch(0.55 0.014 265);
--vibeui-date-007-border:oklch(0.88 0.008 265);
--vibeui-date-007-accent:oklch(0.53 0.16 25);
--vibeui-date-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: поле показывают поверх любого фона. */
[data-vibeui-block="date-007"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-date-007-surface);
border:1px solid var(--vibeui-date-007-shell);border-radius:0.875rem;
font-family:var(--vibeui-date-007-font);color:var(--vibeui-date-007-fg);
}
/* legend во float даёт обтекание: clear возвращает нормальный поток. */
[data-vibeui-block="date-007"] legend{
float:left;width:100%;padding:0;margin-bottom:0.5rem;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="date-007"] [data-part="row"]{clear:both;display:flex;gap:0.375rem}
/* Ширины разные: день короче месяца, год длиннее дня — так поля не врут. */
[data-vibeui-block="date-007"] [data-part="cell"]{display:flex;flex-direction:column;gap:0.25rem;min-width:0}
[data-vibeui-block="date-007"] [data-part="cell"][data-role="day"]{flex:0 1 4.5rem}
[data-vibeui-block="date-007"] [data-part="cell"][data-role="month"]{flex:1 1 8rem}
[data-vibeui-block="date-007"] [data-part="cell"][data-role="year"]{flex:0 1 5.5rem}
[data-vibeui-block="date-007"] label{
font-size:0.625rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-date-007-muted);
}
[data-vibeui-block="date-007"] select{
width:100%;min-width:0;box-sizing:border-box;height:2.625rem;
padding:0 0.5rem;appearance:none;
background:var(--vibeui-date-007-field);color:inherit;
border:1px solid var(--vibeui-date-007-border);border-radius:0.625rem;
font:inherit;font-size:0.875rem;font-weight:600;
}
[data-vibeui-block="date-007"] select:focus-visible{
outline:2px solid var(--vibeui-date-007-accent);outline-offset:1px;border-color:var(--vibeui-date-007-accent);
}
[data-vibeui-block="date-007"] [data-part="echo"]{
margin:0;font-size:0.75rem;color:var(--vibeui-date-007-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="date-007"] [data-part="echo"] b{color:var(--vibeui-date-007-fg);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="date-007"] *{animation:none!important;transition:none!important}}
`

const MONTHS = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
]

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

/**
 * Дата рождения тремя селектами: день, месяц и год без календаря.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Date007({
  legend = "Дата рождения",
  defaultValue = "1987-04-12",
  fromYear = 1940,
  toYear = 2010,
  accent,
  className,
  style,
  ...props
}: Date007Props) {
  const id = useId()
  const [year, setYear] = useState(Number(defaultValue.slice(0, 4)))
  const [month, setMonth] = useState(Number(defaultValue.slice(5, 7)))
  const [day, setDay] = useState(Number(defaultValue.slice(8, 10)))

  const total = daysInMonth(year, month)
  // День подтягивается к последнему существующему: 31 февраля не бывает.
  const safeDay = Math.min(day, total)
  const years = Array.from(
    { length: toYear - fromYear + 1 },
    (_, index) => toYear - index,
  )

  const palette = {
    ...(accent ? { "--vibeui-date-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-date-007" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="date-007"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <div data-part="row">
          <div data-part="cell" data-role="day">
            <label htmlFor={`${id}-day`}>День</label>
            <select
              id={`${id}-day`}
              value={safeDay}
              onChange={(event) => setDay(Number(event.target.value))}
            >
              {Array.from({ length: total }, (_, index) => index + 1).map(
                (value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ),
              )}
            </select>
          </div>
          <div data-part="cell" data-role="month">
            <label htmlFor={`${id}-month`}>Месяц</label>
            <select
              id={`${id}-month`}
              value={month}
              onChange={(event) => setMonth(Number(event.target.value))}
            >
              {MONTHS.map((name, index) => (
                <option key={name} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div data-part="cell" data-role="year">
            <label htmlFor={`${id}-year`}>Год</label>
            <select
              id={`${id}-year`}
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
            >
              {years.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p data-part="echo" aria-live="polite">
          Выбрано:{" "}
          <b>
            {safeDay} {MONTHS[month - 1]} {year}
          </b>
        </p>
      </fieldset>
    </>
  )
}

"use client"

import { useId, useMemo, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Calendar024Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "onChange"
> & {
  label?: string
  /** Начальное значение строкой YYYY-MM-DD или пустая строка. */
  defaultValue?: string
  minAge?: number
  maxAge?: number
  today?: string
  locale?: string
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: дату рождения выбирают не в сетке месяца — до 1985 года
// из неё листать двадцать раз. Три поля вводятся с клавиатуры за секунду,
// а вся сложность уезжает в проверку: 31 февраля, будущее и возрастной ценз
// разбираются отдельными сообщениями, а не одним «неверная дата».
const STYLES = `
:where([data-vibeui-block="calendar-024"]){
--vibeui-calendar-024-bg:oklch(1 0 0);
--vibeui-calendar-024-fg:oklch(0.23 0.014 275);
--vibeui-calendar-024-muted:oklch(0.56 0.014 275);
--vibeui-calendar-024-border:oklch(0.9 0.008 275);
--vibeui-calendar-024-field:oklch(0.985 0.004 275);
--vibeui-calendar-024-accent:oklch(0.51 0.13 275);
--vibeui-calendar-024-ok:oklch(0.5 0.11 155);
--vibeui-calendar-024-bad:oklch(0.55 0.18 25);
--vibeui-calendar-024-radius:0.625rem;
--vibeui-calendar-024-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="calendar-024"]{
display:flex;flex-direction:column;gap:0.6rem;
width:100%;max-width:23rem;box-sizing:border-box;
margin:0;padding:1rem;
background:var(--vibeui-calendar-024-bg);
border:1px solid var(--vibeui-calendar-024-border);
border-radius:calc(var(--vibeui-calendar-024-radius) + 0.25rem);
color:var(--vibeui-calendar-024-fg);
font-family:var(--vibeui-calendar-024-font);
}
[data-vibeui-block="calendar-024"] legend{
padding:0;font-size:0.9rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="calendar-024"] [data-part="row"]{
display:grid;grid-template-columns:4.5rem 1fr 5.5rem;gap:0.4rem;align-items:end;
}
[data-vibeui-block="calendar-024"] [data-part="cell"]{
display:flex;flex-direction:column;gap:0.2rem;min-width:0;
}
[data-vibeui-block="calendar-024"] [data-part="cell"] label{
font-size:0.7rem;font-weight:600;letter-spacing:0.03em;text-transform:uppercase;
color:var(--vibeui-calendar-024-muted);
}
[data-vibeui-block="calendar-024"] input,
[data-vibeui-block="calendar-024"] select{
box-sizing:border-box;width:100%;height:2.4rem;padding:0 0.55rem;
border:1px solid var(--vibeui-calendar-024-border);
border-radius:var(--vibeui-calendar-024-radius);
background:var(--vibeui-calendar-024-field);
color:inherit;font:inherit;font-size:0.875rem;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-024"] select{text-transform:capitalize}
[data-vibeui-block="calendar-024"] input:focus-visible,
[data-vibeui-block="calendar-024"] select:focus-visible{
outline:2px solid var(--vibeui-calendar-024-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="calendar-024"][data-state="bad"] input,
[data-vibeui-block="calendar-024"][data-state="bad"] select{
border-color:var(--vibeui-calendar-024-bad);
}
[data-vibeui-block="calendar-024"] [data-part="note"]{
margin:0;display:flex;align-items:center;gap:0.35rem;
min-height:1.15rem;font-size:0.8125rem;color:var(--vibeui-calendar-024-muted);
}
[data-vibeui-block="calendar-024"][data-state="bad"] [data-part="note"]{color:var(--vibeui-calendar-024-bad)}
[data-vibeui-block="calendar-024"][data-state="ok"] [data-part="note"]{color:var(--vibeui-calendar-024-ok)}
[data-vibeui-block="calendar-024"] [data-part="dot"]{
width:0.45rem;height:0.45rem;border-radius:50%;flex:none;background:currentColor;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-024"] *{animation:none!important;transition:none!important}}
`

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

function pluralize(count: number, forms: [string, string, string]) {
  const tens = count % 100
  const ones = count % 10

  if (tens > 10 && tens < 20) return forms[2]
  if (ones === 1) return forms[0]
  if (ones > 1 && ones < 5) return forms[1]

  return forms[2]
}

/**
 * Дата рождения тремя полями с разбором ошибок и подсчётом возраста.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar024({
  label = "Дата рождения",
  defaultValue = "1994-07-19",
  minAge = 18,
  maxAge = 120,
  today = "2026-04-15",
  locale = "ru-RU",
  onChange,
  accent,
  className,
  style,
  ...props
}: Calendar024Props) {
  const id = useId()
  const parts = defaultValue.split("-")
  const [year, setYear] = useState(parts[0] ?? "")
  const [month, setMonth] = useState(parts[1] ?? "")
  const [day, setDay] = useState(parts[2] ?? "")

  const months = useMemo(() => {
    const format = new Intl.DateTimeFormat(locale, { month: "long" })

    return Array.from({ length: 12 }, (_, index) => ({
      value: String(index + 1).padStart(2, "0"),
      title: format.format(new Date(2024, index, 1)),
    }))
  }, [locale])

  const check = useMemo(() => {
    if (!year || !month || !day) {
      return { state: "idle", note: "Введите день, месяц и год" }
    }

    const numbers = {
      year: Number(year),
      month: Number(month),
      day: Number(day),
    }

    if (numbers.year < 1000) {
      return { state: "idle", note: "Год из четырёх цифр" }
    }

    if (
      numbers.day < 1 ||
      numbers.day > daysInMonth(numbers.year, numbers.month)
    ) {
      return {
        state: "bad",
        note: `В этом месяце ${daysInMonth(numbers.year, numbers.month)} дней`,
      }
    }

    const born = new Date(numbers.year, numbers.month - 1, numbers.day)
    const now = new Date(`${today}T00:00:00`)

    if (born.getTime() > now.getTime()) {
      return { state: "bad", note: "Дата в будущем" }
    }

    let age = now.getFullYear() - born.getFullYear()
    const passed =
      now.getMonth() > born.getMonth() ||
      (now.getMonth() === born.getMonth() && now.getDate() >= born.getDate())

    if (!passed) age -= 1

    if (age < minAge) {
      return { state: "bad", note: `Нужно не меньше ${minAge} лет` }
    }

    if (age > maxAge) {
      return { state: "bad", note: "Проверьте год: возраст слишком большой" }
    }

    return {
      state: "ok",
      note: `${age} ${pluralize(age, ["год", "года", "лет"])}`,
    }
  }, [year, month, day, today, minAge, maxAge])

  const push = (next: { year: string; month: string; day: string }) => {
    onChange?.(
      next.year && next.month && next.day
        ? `${next.year}-${next.month.padStart(2, "0")}-${next.day.padStart(2, "0")}`
        : "",
    )
  }

  const palette = {
    ...(accent ? { "--vibeui-calendar-024-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-024" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="calendar-024"
        data-state={check.state}
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <div data-part="row">
          <div data-part="cell">
            <label htmlFor={`${id}-day`}>День</label>
            <input
              id={`${id}-day`}
              inputMode="numeric"
              autoComplete="bday-day"
              maxLength={2}
              aria-invalid={check.state === "bad"}
              aria-describedby={`${id}-note`}
              value={day}
              onChange={(event) => {
                const next = event.target.value.replace(/\D/g, "").slice(0, 2)
                setDay(next)
                push({ year, month, day: next })
              }}
            />
          </div>
          <div data-part="cell">
            <label htmlFor={`${id}-month`}>Месяц</label>
            <select
              id={`${id}-month`}
              autoComplete="bday-month"
              aria-invalid={check.state === "bad"}
              aria-describedby={`${id}-note`}
              value={month}
              onChange={(event) => {
                const next = event.target.value
                setMonth(next)
                push({ year, month: next, day })
              }}
            >
              <option value="">—</option>
              {months.map((entry) => (
                <option key={entry.value} value={entry.value}>
                  {entry.title}
                </option>
              ))}
            </select>
          </div>
          <div data-part="cell">
            <label htmlFor={`${id}-year`}>Год</label>
            <input
              id={`${id}-year`}
              inputMode="numeric"
              autoComplete="bday-year"
              maxLength={4}
              aria-invalid={check.state === "bad"}
              aria-describedby={`${id}-note`}
              value={year}
              onChange={(event) => {
                const next = event.target.value.replace(/\D/g, "").slice(0, 4)
                setYear(next)
                push({ year: next, month, day })
              }}
            />
          </div>
        </div>
        <p id={`${id}-note`} data-part="note" aria-live="polite">
          <span data-part="dot" aria-hidden="true" />
          {check.note}
        </p>
      </fieldset>
    </>
  )
}

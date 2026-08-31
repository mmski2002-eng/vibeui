"use client"

import { useId, useMemo, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Calendar026Frequency = "daily" | "weekly" | "monthly"

export type Calendar026Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onChange"
> & {
  label?: string
  startDate?: string
  defaultFrequency?: Calendar026Frequency
  defaultInterval?: number
  /** Дни недели правила, где 0 — понедельник. */
  defaultWeekdays?: number[]
  occurrences?: number
  locale?: string
  onChange?: (rule: string) => void
  accent?: string
}

// Идея компонента: правило повтора нельзя проверить по форме — его проверяют
// по фразе и по ближайшим датам. Поэтому форма собирает RRULE, а под ней
// живут две вещи: человеческая формулировка и список следующих повторов.
// Ошибку «каждые 2 недели» вместо «каждую неделю» видно сразу по датам.
const STYLES = `
:where([data-vibeui-block="calendar-026"]){
--vibeui-calendar-026-bg:oklch(1 0 0);
--vibeui-calendar-026-fg:oklch(0.23 0.014 300);
--vibeui-calendar-026-muted:oklch(0.56 0.014 300);
--vibeui-calendar-026-border:oklch(0.91 0.008 300);
--vibeui-calendar-026-field:oklch(0.985 0.004 300);
--vibeui-calendar-026-soft:oklch(0.96 0.02 300);
--vibeui-calendar-026-accent:oklch(0.5 0.14 300);
--vibeui-calendar-026-radius:0.625rem;
--vibeui-calendar-026-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-calendar-026-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}
[data-vibeui-block="calendar-026"]{
display:flex;flex-direction:column;gap:0.7rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:1rem;
background:var(--vibeui-calendar-026-bg);
border:1px solid var(--vibeui-calendar-026-border);
border-radius:calc(var(--vibeui-calendar-026-radius) + 0.3rem);
color:var(--vibeui-calendar-026-fg);
font-family:var(--vibeui-calendar-026-font);
}
[data-vibeui-block="calendar-026"] [data-part="title"]{
margin:0;font-size:0.95rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="calendar-026"] [data-part="row"]{
display:grid;grid-template-columns:4.5rem 1fr;gap:0.4rem;
}
[data-vibeui-block="calendar-026"] [data-part="cell"]{display:flex;flex-direction:column;gap:0.2rem;min-width:0}
[data-vibeui-block="calendar-026"] [data-part="cell"] label{
font-size:0.7rem;font-weight:600;letter-spacing:0.03em;text-transform:uppercase;
color:var(--vibeui-calendar-026-muted);
}
[data-vibeui-block="calendar-026"] input,
[data-vibeui-block="calendar-026"] select{
box-sizing:border-box;width:100%;height:2.35rem;padding:0 0.5rem;
border:1px solid var(--vibeui-calendar-026-border);
border-radius:var(--vibeui-calendar-026-radius);
background:var(--vibeui-calendar-026-field);
color:inherit;font:inherit;font-size:0.875rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-026"] input:focus-visible,
[data-vibeui-block="calendar-026"] select:focus-visible{
outline:2px solid var(--vibeui-calendar-026-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="calendar-026"] [data-part="days"]{display:flex;gap:0.25rem;flex-wrap:wrap}
[data-vibeui-block="calendar-026"] [data-part="day"]{
appearance:none;cursor:pointer;font:inherit;
width:2rem;height:2rem;border-radius:50%;
border:1px solid var(--vibeui-calendar-026-border);
background:var(--vibeui-calendar-026-field);
color:var(--vibeui-calendar-026-muted);
font-size:0.72rem;font-weight:700;text-transform:capitalize;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="calendar-026"] [data-part="day"][aria-pressed="true"]{
background:var(--vibeui-calendar-026-accent);border-color:transparent;
color:var(--vibeui-calendar-026-bg);
}
[data-vibeui-block="calendar-026"] [data-part="day"]:focus-visible{
outline:2px solid var(--vibeui-calendar-026-accent);outline-offset:2px;
}
[data-vibeui-block="calendar-026"] [data-part="phrase"]{
margin:0;padding:0.55rem 0.7rem;border-radius:var(--vibeui-calendar-026-radius);
background:var(--vibeui-calendar-026-soft);
font-size:0.875rem;font-weight:600;line-height:1.35;
}
[data-vibeui-block="calendar-026"] [data-part="next"]{
margin:0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:0.3rem;
}
[data-vibeui-block="calendar-026"] [data-part="next"] li{
padding:0.2rem 0.5rem;border-radius:999px;
border:1px dashed var(--vibeui-calendar-026-border);
font-size:0.75rem;color:var(--vibeui-calendar-026-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-026"] [data-part="rrule"]{
margin:0;padding-top:0.6rem;border-top:1px solid var(--vibeui-calendar-026-border);
font-family:var(--vibeui-calendar-026-mono);font-size:0.72rem;
color:var(--vibeui-calendar-026-muted);word-break:break-all;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-026"] *{animation:none!important;transition:none!important}}
`

const BYDAY = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"]

/** Строка RRULE из состояния формы: её же отдаёт onChange. */
function ruleOf(
  frequency: Calendar026Frequency,
  interval: number,
  weekdays: number[],
  monthDay: number,
) {
  const parts = [`FREQ=${frequency.toUpperCase()}`, `INTERVAL=${interval}`]

  if (frequency === "weekly" && weekdays.length) {
    parts.push(`BYDAY=${weekdays.map((day) => BYDAY[day]).join(",")}`)
  }

  if (frequency === "monthly") {
    parts.push(`BYMONTHDAY=${monthDay}`)
  }

  return parts.join(";")
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
 * Правило повтора: форма, фраза словами, ближайшие даты и строка RRULE.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar026({
  label = "Повтор события",
  startDate = "2026-04-14",
  defaultFrequency = "weekly",
  defaultInterval = 2,
  defaultWeekdays = [1, 3],
  occurrences = 3,
  locale = "ru-RU",
  onChange,
  accent,
  className,
  style,
  ...props
}: Calendar026Props) {
  const id = useId()
  const [frequency, setFrequency] =
    useState<Calendar026Frequency>(defaultFrequency)
  const [interval, setInterval] = useState(defaultInterval)
  const [weekdays, setWeekdays] = useState(defaultWeekdays)

  const names = useMemo(() => {
    const short = new Intl.DateTimeFormat(locale, { weekday: "short" })
    const long = new Intl.DateTimeFormat(locale, { weekday: "long" })

    return Array.from({ length: 7 }, (_, index) => ({
      short: short.format(new Date(2024, 0, 1 + index)),
      long: long.format(new Date(2024, 0, 1 + index)),
    }))
  }, [locale])

  const start = new Date(`${startDate}T00:00:00`)

  const dates = useMemo(() => {
    const result: Date[] = []
    const cursor = new Date(start)

    if (frequency === "monthly") {
      for (let step = 0; step < occurrences; step += 1) {
        const date = new Date(start)
        date.setMonth(start.getMonth() + step * interval)
        result.push(date)
      }

      return result
    }

    if (frequency === "daily") {
      for (let step = 0; step < occurrences; step += 1) {
        const date = new Date(start)
        date.setDate(start.getDate() + step * interval)
        result.push(date)
      }

      return result
    }

    const wanted = weekdays.length ? weekdays : [(start.getDay() + 6) % 7]

    for (let step = 0; step < 400 && result.length < occurrences; step += 1) {
      const weekday = (cursor.getDay() + 6) % 7
      const weekIndex = Math.floor(
        (cursor.getTime() -
          start.getTime() +
          ((start.getDay() + 6) % 7) * 86400000) /
          (7 * 86400000),
      )

      if (wanted.includes(weekday) && weekIndex % interval === 0) {
        result.push(new Date(cursor))
      }

      cursor.setDate(cursor.getDate() + 1)
    }

    return result
  }, [frequency, interval, weekdays, occurrences, startDate])

  const rule = ruleOf(frequency, interval, weekdays, start.getDate())

  const phrase = useMemo(() => {
    if (frequency === "daily") {
      return interval === 1
        ? "Каждый день"
        : `Каждые ${interval} ${pluralize(interval, ["день", "дня", "дней"])}`
    }

    if (frequency === "monthly") {
      const head =
        interval === 1
          ? "Каждый месяц"
          : `Каждые ${interval} ${pluralize(interval, ["месяц", "месяца", "месяцев"])}`

      return `${head}, ${start.getDate()}-го числа`
    }

    const head =
      interval === 1
        ? "Каждую неделю"
        : `Каждые ${interval} ${pluralize(interval, ["неделю", "недели", "недель"])}`

    if (!weekdays.length) {
      return `${head} — день недели не выбран`
    }

    const list = weekdays.map((day) => names[day].long.toLowerCase()).join(", ")

    return `${head} по дням: ${list}`
  }, [frequency, interval, weekdays, names, startDate])

  const toggle = (index: number) => {
    const next = weekdays.includes(index)
      ? weekdays.filter((day) => day !== index)
      : [...weekdays, index].sort((left, right) => left - right)

    setWeekdays(next)
    onChange?.(ruleOf(frequency, interval, next, start.getDate()))
  }

  const stamp = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    weekday: "short",
  })

  const palette = {
    ...(accent ? { "--vibeui-calendar-026-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-026" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="calendar-026"
        className={className}
        style={palette}
      >
        <h3 data-part="title">{label}</h3>
        <div data-part="row">
          <div data-part="cell">
            <label htmlFor={`${id}-interval`}>Каждые</label>
            <input
              id={`${id}-interval`}
              inputMode="numeric"
              value={interval}
              onChange={(event) => {
                const next = Math.min(
                  30,
                  Math.max(
                    1,
                    Number(event.target.value.replace(/\D/g, "")) || 1,
                  ),
                )
                setInterval(next)
                onChange?.(ruleOf(frequency, next, weekdays, start.getDate()))
              }}
            />
          </div>
          <div data-part="cell">
            <label htmlFor={`${id}-freq`}>Единица</label>
            <select
              id={`${id}-freq`}
              value={frequency}
              onChange={(event) => {
                const next = event.target.value as Calendar026Frequency
                setFrequency(next)
                onChange?.(ruleOf(next, interval, weekdays, start.getDate()))
              }}
            >
              <option value="daily">дней</option>
              <option value="weekly">недель</option>
              <option value="monthly">месяцев</option>
            </select>
          </div>
        </div>
        {frequency === "weekly" ? (
          <div data-part="days" role="group" aria-label="Дни недели">
            {names.map((name, index) => (
              <button
                key={name.long}
                type="button"
                data-part="day"
                aria-pressed={weekdays.includes(index)}
                aria-label={name.long}
                onClick={() => toggle(index)}
              >
                <span aria-hidden="true">{name.short.slice(0, 2)}</span>
              </button>
            ))}
          </div>
        ) : null}
        <p data-part="phrase" aria-live="polite">
          {phrase}
        </p>
        <ul data-part="next" aria-label="Ближайшие повторы">
          {dates.map((date) => (
            <li key={date.getTime()}>{stamp.format(date)}</li>
          ))}
        </ul>
        <p data-part="rrule">RRULE:{rule}</p>
      </section>
    </>
  )
}

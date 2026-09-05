"use client"

import { useId, useMemo, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Calendar026Frequency = "daily" | "weekly" | "monthly"

export type Calendar026Props = Omit<
  ComponentProps<"section">,
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
  /** Подпись поля интервала. */
  intervalLabel?: string
  /** Подпись поля единицы повтора. */
  unitLabel?: string
  /** Пункты списка единиц: компонент несёт русские, проект подставляет свои. */
  unitText?: Record<Calendar026Frequency, string>
  /** Три формы склонения единицы для фразы: 1 / 2 / 5. */
  unitForms?: Record<Calendar026Frequency, [string, string, string]>
  /**
   * Фраза правила. {count} — интервал, {unit} — единица, {head} — начало
   * фразы, {days} — список дней, {day} — число месяца.
   */
  phraseText?: Record<string, string>
  /** Подпись группы кнопок дней недели. */
  weekdaysLabel?: string
  /** Подпись списка ближайших дат. */
  nextLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  onChange?: (rule: string) => void
  accent?: string
}

// Идея компонента: правило повтора нельзя проверить по форме — его проверяют
// по фразе и по ближайшим датам. Поэтому форма собирает RRULE, а под ней
// живут две вещи: человеческая формулировка и список следующих повторов.
// Ошибку «каждые 2 недели» вместо «каждую неделю» видно сразу по датам.
const STYLES = `
:where([data-vibeui-block="calendar-026"]){
--vibeui-calendar-026-bg:transparent;
--vibeui-calendar-026-fg:light-dark(oklch(0.23 0.014 300),oklch(0.94 0.005 300));
--vibeui-calendar-026-muted:color-mix(in oklab,var(--vibeui-calendar-026-fg) 68%,transparent);
--vibeui-calendar-026-border:light-dark(oklch(0.91 0.008 300),oklch(0.35 0.014 300));
--vibeui-calendar-026-field:light-dark(oklch(0.985 0.004 300),oklch(0.26 0.012 300));
--vibeui-calendar-026-soft:light-dark(oklch(0.96 0.02 300),oklch(0.3 0.03 300));
--vibeui-calendar-026-accent:light-dark(oklch(0.5 0.14 300),oklch(0.74 0.13 300));
--vibeui-calendar-026-onaccent:light-dark(oklch(0.99 0 0),oklch(0.18 0.02 300));
--vibeui-calendar-026-radius:0.625rem;
--vibeui-calendar-026-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-calendar-026-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="calendar-026"]{color-scheme:dark}
[data-vibeui-block="calendar-026"]{
display:flex;flex-direction:column;gap:0.6875rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-calendar-026-bg);
border:1px solid var(--vibeui-calendar-026-border);
border-radius:calc(var(--vibeui-calendar-026-radius) + 0.3125rem);
color:var(--vibeui-calendar-026-fg);
font-family:var(--vibeui-calendar-026-font);
}
[data-vibeui-block="calendar-026"] [data-part="title"]{
margin:0;font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="calendar-026"] [data-part="row"]{
display:grid;grid-template-columns:4.5rem 1fr;gap:0.375rem;
}
[data-vibeui-block="calendar-026"] [data-part="cell"]{display:flex;flex-direction:column;gap:0.1875rem;min-width:0}
[data-vibeui-block="calendar-026"] [data-part="cell"] label{
font-size:0.6875rem;font-weight:600;letter-spacing:0.03em;text-transform:uppercase;
color:var(--vibeui-calendar-026-muted);
}
[data-vibeui-block="calendar-026"] input,
[data-vibeui-block="calendar-026"] select{
box-sizing:border-box;width:100%;height:2.375rem;padding:0 0.5rem;
border:1px solid var(--vibeui-calendar-026-border);
border-radius:var(--vibeui-calendar-026-radius);
background:var(--vibeui-calendar-026-field);
color:inherit;font:inherit;font-size:0.9375rem;font-variant-numeric:tabular-nums;
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
font-size:0.6875rem;font-weight:700;text-transform:capitalize;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="calendar-026"] [data-part="day"][aria-pressed="true"]{
background:var(--vibeui-calendar-026-accent);border-color:transparent;
color:var(--vibeui-calendar-026-onaccent);
}
[data-vibeui-block="calendar-026"] [data-part="day"]:focus-visible{
outline:2px solid var(--vibeui-calendar-026-accent);outline-offset:2px;
}
[data-vibeui-block="calendar-026"] [data-part="phrase"]{
margin:0;padding:0.5625rem 0.6875rem;border-radius:var(--vibeui-calendar-026-radius);
background:var(--vibeui-calendar-026-soft);
font-size:0.875rem;font-weight:600;line-height:1.35;
}
[data-vibeui-block="calendar-026"] [data-part="next"]{
margin:0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:0.3125rem;
}
[data-vibeui-block="calendar-026"] [data-part="next"] li{
padding:0.1875rem 0.5rem;border-radius:999px;
border:1px dashed var(--vibeui-calendar-026-border);
font-size:0.75rem;color:var(--vibeui-calendar-026-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-026"] [data-part="rrule"]{
margin:0;padding-top:0.625rem;border-top:1px solid var(--vibeui-calendar-026-border);
font-family:var(--vibeui-calendar-026-mono);font-size:0.75rem;
color:var(--vibeui-calendar-026-muted);word-break:break-all;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-026"] *{animation:none!important;transition:none!important}}
`

const BYDAY = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"]

const UNIT_TEXT: Record<Calendar026Frequency, string> = {
  daily: "дней",
  weekly: "недель",
  monthly: "месяцев",
}

const UNIT_FORMS: Record<Calendar026Frequency, [string, string, string]> = {
  daily: ["день", "дня", "дней"],
  weekly: ["неделю", "недели", "недель"],
  monthly: ["месяц", "месяца", "месяцев"],
}

const PHRASE_TEXT: Record<string, string> = {
  singleDaily: "Каждый день",
  singleWeekly: "Каждую неделю",
  singleMonthly: "Каждый месяц",
  every: "Каждые {count} {unit}",
  monthDay: "{head}, {day}-го числа",
  byDays: "{head} по дням: {days}",
  noDays: "{head} — день недели не выбран",
}

/** Подстановка {placeholder} в шаблон фразы. */
function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in values ? values[key] : whole,
  )
}

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
 * Дата и локаль из пропов или дефолты компонента. Чужая страница не должна
 * падать из-за опечатки в значении: Intl бросает RangeError и на Invalid Date,
 * и на нераспознанной локали, а это белый экран вместо всего сайта.
 */
function safeDate(value: string, fallback: string) {
  return Number.isNaN(new Date(`${value}T00:00:00`).getTime())
    ? fallback
    : value
}

function safeLocale(value: string, fallback: string) {
  try {
    Intl.DateTimeFormat.supportedLocalesOf(value)
    return value
  } catch {
    return fallback
  }
}

/**
 * Правило повтора: форма, фраза словами, ближайшие даты и строка RRULE.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar026({
  label = "Повтор события",
  startDate: startDateProp = "2026-04-14",
  defaultFrequency = "weekly",
  defaultInterval = 2,
  defaultWeekdays = [1, 3],
  occurrences = 3,
  locale: localeProp = "ru-RU",
  intervalLabel = "Каждые",
  unitLabel = "Единица",
  unitText = UNIT_TEXT,
  unitForms = UNIT_FORMS,
  phraseText = PHRASE_TEXT,
  weekdaysLabel = "Дни недели",
  nextLabel = "Ближайшие повторы",
  background = "",
  onChange,
  accent,
  className,
  style,
  ...props
}: Calendar026Props) {
  const startDate = safeDate(startDateProp, "2026-04-14")
  const locale = safeLocale(localeProp, "ru-RU")
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

  const start = useMemo(
    () => new Date(`${startDate}T00:00:00`),
    [startDate],
  )

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
  }, [frequency, interval, weekdays, occurrences, start])

  const rule = ruleOf(frequency, interval, weekdays, start.getDate())

  const phrase = useMemo(() => {
    const single = {
      daily: "singleDaily",
      weekly: "singleWeekly",
      monthly: "singleMonthly",
    }[frequency]
    const head =
      interval === 1
        ? (phraseText[single] ?? PHRASE_TEXT[single])
        : fill(phraseText.every ?? PHRASE_TEXT.every, {
            count: String(interval),
            unit: pluralize(interval, unitForms[frequency]),
          })

    if (frequency === "daily") {
      return head
    }

    if (frequency === "monthly") {
      return fill(phraseText.monthDay ?? PHRASE_TEXT.monthDay, {
        head,
        day: String(start.getDate()),
      })
    }

    if (!weekdays.length) {
      return fill(phraseText.noDays ?? PHRASE_TEXT.noDays, { head })
    }

    return fill(phraseText.byDays ?? PHRASE_TEXT.byDays, {
      head,
      days: weekdays.map((day) => names[day].long.toLowerCase()).join(", "),
    })
  }, [frequency, interval, weekdays, names, start, phraseText, unitForms])

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
    ...(background
      ? {
          "--vibeui-calendar-026-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-026" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="calendar"
        data-vibeui-block="calendar-026"
        className={className}
        style={palette}
      >
        <h3 data-part="title">{label}</h3>
        <div data-part="row">
          <div data-part="cell">
            <label htmlFor={`${id}-interval`}>{intervalLabel}</label>
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
            <label htmlFor={`${id}-freq`}>{unitLabel}</label>
            <select
              id={`${id}-freq`}
              value={frequency}
              onChange={(event) => {
                const next = event.target.value as Calendar026Frequency
                setFrequency(next)
                onChange?.(ruleOf(next, interval, weekdays, start.getDate()))
              }}
            >
              {(["daily", "weekly", "monthly"] as Calendar026Frequency[]).map(
                (unit) => (
                  <option key={unit} value={unit}>
                    {unitText[unit] ?? UNIT_TEXT[unit]}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>
        {frequency === "weekly" ? (
          <div data-part="days" role="group" aria-label={weekdaysLabel}>
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
        <ul data-part="next" aria-label={nextLabel}>
          {dates.map((date) => (
            <li key={date.getTime()}>{stamp.format(date)}</li>
          ))}
        </ul>
        <p data-part="rrule">RRULE:{rule}</p>
      </section>
    </>
  )
}

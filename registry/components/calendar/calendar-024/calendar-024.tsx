"use client"

import { useId, useMemo, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Calendar024Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "onChange"
> & {
  label?: string
  /** Начальное значение строкой YYYY-MM-DD или пустая строка. */
  defaultValue?: string
  minAge?: number
  maxAge?: number
  today?: string
  locale?: string
  /** Подписи полей: day, month, year. */
  fieldLabels?: Record<string, string>
  /** Сообщения под полями. {days} и {minAge} подставляются. */
  noteText?: Record<string, string>
  /** Формы возраста по категориям Intl.PluralRules. {count} подставляется. */
  ageText?: Record<string, string>
  onChange?: (value: string) => void
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: дату рождения выбирают не в сетке месяца — до 1985 года
// из неё листать двадцать раз. Три поля вводятся с клавиатуры за секунду,
// а вся сложность уезжает в проверку: 31 февраля, будущее и возрастной ценз
// разбираются отдельными сообщениями, а не одним «неверная дата».
const STYLES = `
:where([data-vibeui-block="calendar-024"]){
--vibeui-calendar-024-bg:transparent;
--vibeui-calendar-024-fg:light-dark(oklch(0.23 0 275),oklch(0.93 0 275));
--vibeui-calendar-024-muted:color-mix(in oklab,var(--vibeui-calendar-024-fg) 68%,transparent);
--vibeui-calendar-024-border:light-dark(oklch(0.9 0 275),oklch(0.35 0 275));
--vibeui-calendar-024-field:light-dark(oklch(0.985 0 275),oklch(0.28 0 275));
--vibeui-calendar-024-accent:light-dark(oklch(0.277 0 0),oklch(0.899 0 0));
--vibeui-calendar-024-ok:light-dark(oklch(0.5 0.11 155),oklch(0.74 0.11 155));
--vibeui-calendar-024-bad:light-dark(oklch(0.55 0.18 25),oklch(0.74 0.15 25));
--vibeui-calendar-024-radius:0.625rem;
--vibeui-calendar-024-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="calendar-024"]{color-scheme:dark}
[data-vibeui-block="calendar-024"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:23rem;box-sizing:border-box;
margin:0;padding:0.9375rem;
background:var(--vibeui-calendar-024-bg);
border:1px solid var(--vibeui-calendar-024-border);
border-radius:calc(var(--vibeui-calendar-024-radius) + 0.25rem);
color:var(--vibeui-calendar-024-fg);
font-family:var(--vibeui-calendar-024-font);
}
[data-vibeui-block="calendar-024"] legend{
padding:0;font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="calendar-024"] [data-part="row"]{
display:grid;grid-template-columns:4.5rem 1fr 5.5rem;gap:0.375rem;align-items:end;
}
[data-vibeui-block="calendar-024"] [data-part="cell"]{
display:flex;flex-direction:column;gap:0.1875rem;min-width:0;
}
[data-vibeui-block="calendar-024"] [data-part="cell"] label{
font-size:0.6875rem;font-weight:600;letter-spacing:0.03em;text-transform:uppercase;
color:var(--vibeui-calendar-024-muted);
}
[data-vibeui-block="calendar-024"] input,
[data-vibeui-block="calendar-024"] select{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.5625rem;
border:1px solid var(--vibeui-calendar-024-border);
border-radius:var(--vibeui-calendar-024-radius);
background:var(--vibeui-calendar-024-field);
color:inherit;font:inherit;font-size:0.9375rem;
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
margin:0;display:flex;align-items:center;gap:0.375rem;
min-height:1.125rem;font-size:0.875rem;color:var(--vibeui-calendar-024-muted);
}
[data-vibeui-block="calendar-024"][data-state="bad"] [data-part="note"]{color:var(--vibeui-calendar-024-bad)}
[data-vibeui-block="calendar-024"][data-state="ok"] [data-part="note"]{color:var(--vibeui-calendar-024-ok)}
[data-vibeui-block="calendar-024"] [data-part="dot"]{
width:0.4375rem;height:0.4375rem;border-radius:50%;flex:none;background:currentColor;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-024"] *{animation:none!important;transition:none!important}}
`

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

const DEFAULT_FIELD_LABELS: Record<string, string> = {
  day: "День",
  month: "Месяц",
  year: "Год",
}

const DEFAULT_NOTE_TEXT: Record<string, string> = {
  empty: "Введите день, месяц и год",
  shortYear: "Год из четырёх цифр",
  daysInMonth: "В этом месяце {days} дней",
  future: "Дата в будущем",
  tooYoung: "Нужно не меньше {minAge} лет",
  tooOld: "Проверьте год: возраст слишком большой",
}

const DEFAULT_AGE_TEXT: Record<string, string> = {
  one: "{count} год",
  few: "{count} года",
  many: "{count} лет",
  other: "{count} лет",
}

function fillText(template: string, values: Record<string, string | number>) {
  return template.replace(
    /\{(\w+)\}/g,
    (match, key) => `${values[key] ?? match}`,
  )
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
 * Дата рождения тремя полями с разбором ошибок и подсчётом возраста.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar024({
  label = "Дата рождения",
  defaultValue = "1994-07-19",
  minAge = 18,
  maxAge = 120,
  today: todayProp = "2026-04-15",
  locale: localeProp = "ru-RU",
  fieldLabels = DEFAULT_FIELD_LABELS,
  noteText = DEFAULT_NOTE_TEXT,
  ageText = DEFAULT_AGE_TEXT,
  onChange,
  accent,
  background = "",
  className,
  style,
  ...props
}: Calendar024Props) {
  const today = safeDate(todayProp, "2026-04-15")
  const locale = safeLocale(localeProp, "ru-RU")
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

  const fields = { ...DEFAULT_FIELD_LABELS, ...fieldLabels }

  const check = useMemo(() => {
    const notes = { ...DEFAULT_NOTE_TEXT, ...noteText }

    if (!year || !month || !day) {
      return { state: "idle", note: notes.empty }
    }

    const numbers = {
      year: Number(year),
      month: Number(month),
      day: Number(day),
    }

    if (numbers.year < 1000) {
      return { state: "idle", note: notes.shortYear }
    }

    if (
      numbers.day < 1 ||
      numbers.day > daysInMonth(numbers.year, numbers.month)
    ) {
      return {
        state: "bad",
        note: fillText(notes.daysInMonth, {
          days: daysInMonth(numbers.year, numbers.month),
        }),
      }
    }

    const born = new Date(numbers.year, numbers.month - 1, numbers.day)
    const now = new Date(`${today}T00:00:00`)

    if (born.getTime() > now.getTime()) {
      return { state: "bad", note: notes.future }
    }

    let age = now.getFullYear() - born.getFullYear()
    const passed =
      now.getMonth() > born.getMonth() ||
      (now.getMonth() === born.getMonth() && now.getDate() >= born.getDate())

    if (!passed) age -= 1

    if (age < minAge) {
      return { state: "bad", note: fillText(notes.tooYoung, { minAge }) }
    }

    if (age > maxAge) {
      return { state: "bad", note: notes.tooOld }
    }

    // Форма возраста выбирается по правилам самого языка, а не по русским:
    // словарь приходит пропсом, а категорию называет Intl.
    const category = new Intl.PluralRules(locale).select(age)

    return {
      state: "ok",
      note: fillText(
        ageText[category] ?? ageText.other ?? DEFAULT_AGE_TEXT.other,
        { count: age },
      ),
    }
  }, [year, month, day, today, minAge, maxAge, locale, ageText, noteText])

  const push = (next: { year: string; month: string; day: string }) => {
    onChange?.(
      next.year && next.month && next.day
        ? `${next.year}-${next.month.padStart(2, "0")}-${next.day.padStart(2, "0")}`
        : "",
    )
  }

  const palette = {
    ...(accent ? { "--vibeui-calendar-024-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-calendar-024-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-024" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="calendar"
        data-vibeui-block="calendar-024"
        data-state={check.state}
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <div data-part="row">
          <div data-part="cell">
            <label htmlFor={`${id}-day`}>{fields.day}</label>
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
            <label htmlFor={`${id}-month`}>{fields.month}</label>
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
            <label htmlFor={`${id}-year`}>{fields.year}</label>
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

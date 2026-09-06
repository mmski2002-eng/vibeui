"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Date009Unit = "week" | "month" | "quarter"

export type Date009Props = Omit<ComponentProps<"div">, "children"> & {
  /** Сокращение дней в подписи отрезка. */
  daysSuffix?: string
  /** Названия месяцев в родительном падеже: «14 сентября». */
  months?: string[]
  label?: string
  /** Какой отрезок выбирают: неделя, месяц или квартал. */
  defaultUnit?: Date009Unit
  /** Значение поля: неделя как 2026-W38, месяц как 2026-09, квартал как 2026-Q3. */
  defaultValue?: string
  /** Подписи переключателя отрезков. */
  unitText?: Record<Date009Unit, string>
  /** Пояснение под полем. */
  hint?: string
  accent?: string
  /** Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: отчёт спрашивают не за «с первого по тридцатое», а за
// месяц, неделю или квартал — и выбирать это удобнее целым отрезком, а не
// двумя датами. Неделя и месяц берутся нативными полями: браузер сам знает
// нумерацию недель и не даёт выбрать сорок вторую в году, где её нет.
// Квартала нативного типа нет, поэтому он собран списком: изобретать для
// него календарь незачем. Под полем всегда написано, какие именно дни в
// него попали, — «неделя 38» без дат не говорит человеку ничего.
const STYLES = `
:where([data-vibeui-block="date-009"]){
--vibeui-date-009-bg:transparent;
--vibeui-date-009-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-date-009-muted:color-mix(in oklab,var(--vibeui-date-009-fg) 62%,transparent);
--vibeui-date-009-border:light-dark(oklch(0.86 0 265),oklch(0.38 0 265));
--vibeui-date-009-field:light-dark(oklch(1 0 0),oklch(1 0 0 / 6%));
--vibeui-date-009-strip:light-dark(oklch(0 0 0 / 5%),oklch(1 0 0 / 7%));
--vibeui-date-009-chip:light-dark(oklch(1 0 0),oklch(1 0 0 / 14%));
--vibeui-date-009-accent:light-dark(oklch(0.5 0.16 39.8),oklch(0.78 0.12 39.8));
--vibeui-date-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="date-009"]{color-scheme:dark}
[data-vibeui-block="date-009"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:20rem;box-sizing:border-box;
font-family:var(--vibeui-date-009-font);color:var(--vibeui-date-009-fg);
}
[data-vibeui-block="date-009"] *{box-sizing:border-box}
[data-vibeui-block="date-009"] [data-part="label"]{font-size:0.8125rem;font-weight:650}
/* Переключатель отрезка на радиокнопках в собственной форме: одинаковое имя
   в двух блоках на странице иначе объединило бы их в одну группу. */
[data-vibeui-block="date-009"] [data-part="units"]{
display:flex;gap:0.125rem;padding:0.125rem;border-radius:0.5rem;
background:var(--vibeui-date-009-strip);
}
[data-vibeui-block="date-009"] [data-part="units"] label{
flex:1;text-align:center;cursor:pointer;
padding:0.25rem 0.5rem;border-radius:0.375rem;
font-size:0.75rem;font-weight:600;color:var(--vibeui-date-009-muted);
}
[data-vibeui-block="date-009"] [data-part="units"] input{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;
}
[data-vibeui-block="date-009"] [data-part="units"] label:has(input:checked){
background:var(--vibeui-date-009-chip);color:var(--vibeui-date-009-fg);
box-shadow:0 1px 2px light-dark(oklch(0 0 0 / 12%),oklch(0 0 0 / 40%));
}
[data-vibeui-block="date-009"] [data-part="units"] label:has(input:focus-visible){
outline:2px solid var(--vibeui-date-009-accent);outline-offset:2px;
}
[data-vibeui-block="date-009"] input[type="week"],
[data-vibeui-block="date-009"] input[type="month"],
[data-vibeui-block="date-009"] select{
width:100%;min-height:2.5rem;padding:0.4375rem 0.625rem;
border:1px solid var(--vibeui-date-009-border);border-radius:0.625rem;
background:var(--vibeui-date-009-field);color:inherit;
font:inherit;font-size:0.9375rem;
}
[data-vibeui-block="date-009"] input:focus-visible,
[data-vibeui-block="date-009"] select:focus-visible{
outline:2px solid var(--vibeui-date-009-accent);outline-offset:1px;
border-color:var(--vibeui-date-009-accent);
}
[data-vibeui-block="date-009"] [data-part="range"]{
margin:0;font-size:0.8125rem;color:var(--vibeui-date-009-muted);
}
[data-vibeui-block="date-009"] [data-part="days"]{color:var(--vibeui-date-009-fg);font-weight:600}
[data-vibeui-block="date-009"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-date-009-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="date-009"] *{animation:none!important;transition:none!important}}
`

const UNIT_TEXT: Record<Date009Unit, string> = {
  week: "Неделя",
  month: "Месяц",
  quarter: "Квартал",
}

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

/** Человеческая запись дня: «14 сентября 2026». */
function human(date: Date, months: string[]): string {
  return `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

/**
 * Границы выбранного отрезка. Считаются в UTC: местная полночь на границе
 * месяца легко уезжает на сутки назад.
 */
function bounds(unit: Date009Unit, value: string): [Date, Date] | null {
  if (unit === "month") {
    const [year, month] = value.split("-").map(Number)

    if (!year || !month) {
      return null
    }

    return [
      new Date(Date.UTC(year, month - 1, 1)),
      new Date(Date.UTC(year, month, 0)),
    ]
  }

  if (unit === "quarter") {
    const [year, quarter] = value.split("-Q").map(Number)

    if (!year || !quarter) {
      return null
    }

    const first = (quarter - 1) * 3

    return [
      new Date(Date.UTC(year, first, 1)),
      new Date(Date.UTC(year, first + 3, 0)),
    ]
  }

  const [year, week] = value.split("-W").map(Number)

  if (!year || !week) {
    return null
  }

  // Неделя по ISO: первая та, в которой лежит четвёртое января.
  const fourth = new Date(Date.UTC(year, 0, 4))
  const shift = (fourth.getUTCDay() + 6) % 7
  const monday = new Date(fourth)
  monday.setUTCDate(fourth.getUTCDate() - shift + (week - 1) * 7)
  const sunday = new Date(monday)
  sunday.setUTCDate(monday.getUTCDate() + 6)

  return [monday, sunday]
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
 * Выбор периода отчёта: неделя, месяц или квартал целиком.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Date009({
  daysSuffix = "дн.",
  months = MONTHS,
  label = "Период отчёта",
  defaultUnit = "month",
  defaultValue = "2026-09",
  unitText = UNIT_TEXT,
  hint = "Отчёт соберётся по полным дням отрезка.",
  accent,
  background = "",
  className,
  style,
  ...props
}: Date009Props) {
  const id = useId().replace(/:/g, "")
  const [unit, setUnit] = useState<Date009Unit>(defaultUnit)
  const [values, setValues] = useState<Record<Date009Unit, string>>({
    week: "2026-W38",
    month: "2026-09",
    quarter: "2026-Q3",
    ...(defaultUnit ? { [defaultUnit]: defaultValue } : null),
  })

  const palette = {
    ...(accent ? { "--vibeui-date-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-date-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const value = values[unit]
  const span = bounds(unit, value)
  const days = span
    ? Math.round((span[1].getTime() - span[0].getTime()) / 86400000) + 1
    : 0

  const set = (next: string) =>
    setValues((current) => ({ ...current, [unit]: next }))

  return (
    <>
      <style href="vibeui-date-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="date-selector"
        data-vibeui-block="date-009"
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={`${id}-field`}>
          {label}
        </label>

        <form data-part="units" role="group" aria-label={label}>
          {(["week", "month", "quarter"] as const).map((item) => (
            <label key={item}>
              <input
                type="radio"
                name={`${id}-unit`}
                checked={unit === item}
                onChange={() => setUnit(item)}
              />
              {unitText[item] ?? UNIT_TEXT[item]}
            </label>
          ))}
        </form>

        {/* Неделя и месяц — нативные поля: браузер знает нумерацию недель и
            не даст выбрать несуществующую. Квартала такого типа нет. */}
        {unit === "quarter" ? (
          <select
            id={`${id}-field`}
            value={value}
            onChange={(event) => set(event.target.value)}
          >
            {[2025, 2026].flatMap((year) =>
              [1, 2, 3, 4].map((quarter) => (
                <option
                  key={`${year}-Q${quarter}`}
                  value={`${year}-Q${quarter}`}
                >
                  {`${quarter} квартал ${year}`}
                </option>
              )),
            )}
          </select>
        ) : (
          <input
            id={`${id}-field`}
            type={unit}
            value={value}
            onChange={(event) => set(event.target.value)}
          />
        )}

        {/* Границы отрезка выписаны словами: «неделя 38» сама по себе не
            говорит человеку, какие это дни. */}
        <p data-part="range" aria-live="polite">
          {span ? (
            <>
              {human(span[0], months)} — {human(span[1], months)}
              {", "}
              <span data-part="days">
                {days} {daysSuffix}
              </span>
            </>
          ) : (
            "Период не выбран"
          )}
        </p>

        <p data-part="hint">{hint}</p>
      </div>
    </>
  )
}

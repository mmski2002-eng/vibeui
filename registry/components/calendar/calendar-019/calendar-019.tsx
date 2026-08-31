"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Calendar019Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange" | "defaultValue"
> & {
  year?: number
  month?: number
  /** Базовая цена ночи: выходные и волна спроса считаются от неё. */
  basePrice?: number
  nights?: number
  currency?: string
  soldOut?: number[]
  locale?: string
  onChange?: (iso: string) => void
  accent?: string
}

// Идея компонента: цена стоит в клетке, а не открывается после выбора.
// Календарь бронирования отвечает на вопрос «когда дешевле», поэтому самые
// дешёвые дни помечены отдельно, а занятые показывают перечёркнутую клетку,
// а не исчезают: пропавший день читается как ошибка загрузки.
const STYLES = `
:where([data-vibeui-block="calendar-019"]){
--vibeui-calendar-019-bg:oklch(1 0 0);
--vibeui-calendar-019-fg:oklch(0.24 0.014 265);
--vibeui-calendar-019-muted:oklch(0.62 0.014 265);
--vibeui-calendar-019-border:oklch(0.91 0.006 265);
--vibeui-calendar-019-hover:oklch(0.96 0.004 265);
--vibeui-calendar-019-accent:oklch(0.5 0.14 175);
--vibeui-calendar-019-cheap:oklch(0.52 0.15 145);
--vibeui-calendar-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="calendar-019"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:1rem;
background:var(--vibeui-calendar-019-bg);
border:1px solid var(--vibeui-calendar-019-border);border-radius:1rem;
color:var(--vibeui-calendar-019-fg);font-family:var(--vibeui-calendar-019-font);
}
[data-vibeui-block="calendar-019"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="calendar-019"] [data-part="title"]{
margin:0;font-size:0.9375rem;font-weight:700;text-transform:capitalize;letter-spacing:-0.01em;
}
[data-vibeui-block="calendar-019"] [data-part="from"]{
font-size:0.75rem;color:var(--vibeui-calendar-019-muted);
}
[data-vibeui-block="calendar-019"] [data-part="from"] b{color:var(--vibeui-calendar-019-cheap);font-variant-numeric:tabular-nums}
[data-vibeui-block="calendar-019"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(7,1fr);gap:0.1875rem;
}
[data-vibeui-block="calendar-019"] [data-part="wd"]{
padding-bottom:0.125rem;text-align:center;
font-size:0.6875rem;font-weight:600;text-transform:capitalize;
color:var(--vibeui-calendar-019-muted);
}
[data-vibeui-block="calendar-019"] [data-part="grid"] button{
appearance:none;cursor:pointer;
display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.0625rem;
min-height:3rem;padding:0.25rem 0.125rem;border-radius:0.5rem;
border:1px solid transparent;background:transparent;color:inherit;font:inherit;
}
[data-vibeui-block="calendar-019"] [data-part="grid"] button:hover:not(:disabled){background:var(--vibeui-calendar-019-hover)}
[data-vibeui-block="calendar-019"] [data-part="grid"] button:focus-visible{outline:2px solid var(--vibeui-calendar-019-accent);outline-offset:-2px}
[data-vibeui-block="calendar-019"] [data-part="day"]{font-size:0.8125rem;line-height:1;font-variant-numeric:tabular-nums}
[data-vibeui-block="calendar-019"] [data-part="price"]{
font-size:0.625rem;line-height:1.1;font-variant-numeric:tabular-nums;
color:var(--vibeui-calendar-019-muted);
}
[data-vibeui-block="calendar-019"] [data-part="grid"] button[data-cheap="true"] [data-part="price"]{
color:var(--vibeui-calendar-019-cheap);font-weight:700;
}
[data-vibeui-block="calendar-019"] [data-part="grid"] button[data-cheap="true"]{border-color:color-mix(in oklab,var(--vibeui-calendar-019-cheap) 45%,transparent)}
[data-vibeui-block="calendar-019"] [data-part="grid"] button:disabled{
cursor:not-allowed;color:var(--vibeui-calendar-019-muted);opacity:.45;
}
[data-vibeui-block="calendar-019"] [data-part="grid"] button:disabled [data-part="day"]{text-decoration:line-through}
[data-vibeui-block="calendar-019"] [data-part="grid"] button[aria-pressed="true"]{
background:var(--vibeui-calendar-019-accent);border-color:var(--vibeui-calendar-019-accent);
color:oklch(0.99 0.01 175);
}
[data-vibeui-block="calendar-019"] [data-part="grid"] button[aria-pressed="true"] [data-part="price"]{color:oklch(0.99 0.01 175);font-weight:650}
[data-vibeui-block="calendar-019"] [data-part="total"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding-top:0.75rem;border-top:1px solid var(--vibeui-calendar-019-border);
font-size:0.8125rem;color:var(--vibeui-calendar-019-muted);
}
[data-vibeui-block="calendar-019"] [data-part="sum"]{
font-size:1.125rem;font-weight:700;color:var(--vibeui-calendar-019-fg);
font-variant-numeric:tabular-nums;letter-spacing:-0.01em;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-019"] *{animation:none!important;transition:none!important}}
`

function priceOf(base: number, date: Date) {
  const weekday = date.getDay()
  const bump = weekday === 5 || weekday === 6 ? 1.35 : weekday === 0 ? 1.15 : 1
  // Волна спроса детерминирована числом месяца: случайность сломала бы
  // совпадение серверного и клиентского рендера.
  const wave = ((date.getDate() * 37) % 11) - 5

  return Math.round((base * bump + wave * 80) / 50) * 50
}

function pluralize(count: number, forms: [string, string, string]) {
  const tens = count % 100
  const ones = count % 10

  if (tens > 10 && tens < 20) {
    return forms[2]
  }

  if (ones === 1) {
    return forms[0]
  }

  if (ones > 1 && ones < 5) {
    return forms[1]
  }

  return forms[2]
}

/**
 * Календарь бронирования с ценой ночи в каждой клетке и итогом за срок.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar019({
  year = 2026,
  month = 4,
  basePrice = 4200,
  nights = 2,
  currency = "₽",
  soldOut = [9, 10, 22],
  locale = "ru-RU",
  onChange,
  accent,
  className,
  style,
  ...props
}: Calendar019Props) {
  const first = new Date(year, month - 1, 1)
  const lead = (first.getDay() + 6) % 7
  const length = new Date(year, month, 0).getDate()

  const days = Array.from({ length }, (_, index) => {
    const date = new Date(year, month - 1, index + 1)

    return {
      day: index + 1,
      date,
      price: priceOf(basePrice, date),
      sold: soldOut.includes(index + 1),
    }
  })

  const cheapest = Math.min(
    ...days.filter((entry) => !entry.sold).map((entry) => entry.price),
  )

  const [selected, setSelected] = useState(
    () =>
      days.find((entry) => !entry.sold && entry.price === cheapest)?.day ?? 1,
  )

  const money = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 })
  const weekdayName = new Intl.DateTimeFormat(locale, { weekday: "short" })
  const weekdays = Array.from({ length: 7 }, (_, index) =>
    weekdayName.format(new Date(2026, 0, 5 + index)),
  )
  const title = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(first)
  const long = new Intl.DateTimeFormat(locale, { dateStyle: "long" })

  const palette = {
    ...(accent ? { "--vibeui-calendar-019-accent": accent } : null),
    ...style,
  } as CSSProperties

  const current = days.find((entry) => entry.day === selected) ?? days[0]
  const total = current.price * nights

  const pick = (day: number) => {
    setSelected(day)
    onChange?.(
      `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    )
  }

  return (
    <>
      <style href="vibeui-calendar-019" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="calendar-019"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <p data-part="title">{title}</p>
          <p data-part="from">
            от{" "}
            <b>
              {money.format(cheapest)} {currency}
            </b>{" "}
            за ночь
          </p>
        </div>
        <div data-part="grid" role="group" aria-label="Даты заезда и цены">
          {weekdays.map((label) => (
            <span key={label} data-part="wd" aria-hidden="true">
              {label}
            </span>
          ))}
          {Array.from({ length: lead }, (_, index) => (
            <span key={`lead-${index}`} />
          ))}
          {days.map((entry) => (
            <button
              key={entry.day}
              type="button"
              aria-pressed={entry.day === selected}
              disabled={entry.sold}
              data-cheap={!entry.sold && entry.price === cheapest}
              aria-label={
                entry.sold
                  ? `${long.format(entry.date)} — мест нет`
                  : `${long.format(entry.date)} — ${money.format(entry.price)} ${currency} за ночь`
              }
              onClick={() => pick(entry.day)}
            >
              <span data-part="day">{entry.day}</span>
              <span data-part="price">
                {entry.sold ? "нет" : money.format(entry.price)}
              </span>
            </button>
          ))}
        </div>
        <div data-part="total">
          <span>
            Заезд {long.format(current.date)}, {nights}{" "}
            {pluralize(nights, ["ночь", "ночи", "ночей"])}
          </span>
          <span data-part="sum">
            {money.format(total)} {currency}
          </span>
        </div>
      </div>
    </>
  )
}

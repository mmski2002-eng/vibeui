"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Calendar019Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange" | "defaultValue"
> & {
  year?: number
  month?: number
  /** Базовая цена ночи: выходные и волна спроса считаются от неё. */
  basePrice?: number
  nights?: number
  currency?: string
  soldOut?: number[]
  /** Строка «от … за ночь» в шапке. {price} подставляется и выделяется жирным. */
  fromText?: string
  /** Подпись сетки для скринридера. */
  groupLabel?: string
  /** Подпись доступного дня. {date}, {price} и {currency} подставляются. */
  priceLabelText?: string
  /** Подпись занятого дня. {date} подставляется. */
  soldOutLabelText?: string
  /** Короткая подпись цены в занятой клетке. */
  soldOutText?: string
  /** Формы счётчика ночей по категориям Intl.PluralRules. {count} подставляется. */
  nightsText?: Record<string, string>
  /** Строка подвала. {date} и {nights} подставляются. */
  checkInText?: string
  locale?: string
  onChange?: (iso: string) => void
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: цена стоит в клетке, а не открывается после выбора.
// Календарь бронирования отвечает на вопрос «когда дешевле», поэтому самые
// дешёвые дни помечены отдельно, а занятые показывают перечёркнутую клетку,
// а не исчезают: пропавший день читается как ошибка загрузки.
const STYLES = `
:where([data-vibeui-block="calendar-019"]){
--vibeui-calendar-019-bg:transparent;
--vibeui-calendar-019-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-calendar-019-muted:color-mix(in oklab,var(--vibeui-calendar-019-fg) 68%,transparent);
--vibeui-calendar-019-border:light-dark(oklch(0.91 0 265),oklch(0.35 0 265));
--vibeui-calendar-019-hover:light-dark(oklch(0.96 0 265),oklch(0.31 0 265));
--vibeui-calendar-019-accent:light-dark(oklch(0.275 0 0),oklch(0.899 0 0));
--vibeui-calendar-019-cheap:light-dark(oklch(0.28 0 0),oklch(0.903 0 0));
--vibeui-calendar-019-on-accent:light-dark(oklch(0.99 0.01 175),oklch(0.2 0.03 175));
--vibeui-calendar-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="calendar-019"]{color-scheme:dark}
[data-vibeui-block="calendar-019"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-calendar-019-bg);
border:1px solid var(--vibeui-calendar-019-border);border-radius:1rem;
color:var(--vibeui-calendar-019-fg);font-family:var(--vibeui-calendar-019-font);
}
[data-vibeui-block="calendar-019"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="calendar-019"] [data-part="title"]{
margin:0;font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
}
/* Заглавная только первая буква: capitalize поднимает и «г.» в «январь 2026 г.». */
[data-vibeui-block="calendar-019"] [data-part="title"]::first-letter{text-transform:uppercase}
[data-vibeui-block="calendar-019"] [data-part="from"]{
font-size:0.875rem;color:var(--vibeui-calendar-019-muted);
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
font-size:0.6875rem;line-height:1.1;font-variant-numeric:tabular-nums;
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
color:oklch(from var(--vibeui-calendar-019-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
[data-vibeui-block="calendar-019"] [data-part="grid"] button[aria-pressed="true"] [data-part="price"]{color:var(--vibeui-calendar-019-on-accent);font-weight:650}
[data-vibeui-block="calendar-019"] [data-part="total"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding-top:0.75rem;border-top:1px solid var(--vibeui-calendar-019-border);
font-size:0.875rem;color:var(--vibeui-calendar-019-muted);
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

const DEFAULT_NIGHTS_TEXT: Record<string, string> = {
  one: "{count} ночь",
  few: "{count} ночи",
  many: "{count} ночей",
  other: "{count} ночей",
}

function fillText(template: string, values: Record<string, string | number>) {
  return template.replace(
    /\{(\w+)\}/g,
    (match, key) => `${values[key] ?? match}`,
  )
}

// Стрелки водят фокус по сетке. Без них до нужного дня приходится жать Tab
// столько раз, сколько до него дней.
function moveFocus(event: KeyboardEvent<HTMLElement>, columns: number) {
  const steps: Record<string, number> = {
    ArrowLeft: -1,
    ArrowRight: 1,
    ArrowUp: -columns,
    ArrowDown: columns,
  }
  const step = steps[event.key]

  if (step === undefined) {
    return
  }

  const buttons = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>("button"),
  )
  const from = buttons.indexOf(document.activeElement as HTMLButtonElement)

  if (from < 0) {
    return
  }

  let index = from + step

  while (buttons[index]?.disabled) {
    index += step
  }

  if (!buttons[index]) {
    return
  }

  event.preventDefault()
  buttons[index].focus()
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
 * Месяц и локаль из пропов или дефолты компонента. Чужая страница не должна
 * падать из-за неверного значения: NaN даёт Invalid Date, а Intl бросает
 * RangeError и на нём, и на нераспознанной локали — белый экран вместо сайта.
 */
function safeMonth(year: number, month: number, fallback: number[]) {
  return Number.isNaN(new Date(year, month - 1, 1).getTime())
    ? fallback
    : [year, month]
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
 * Календарь бронирования с ценой ночи в каждой клетке и итогом за срок.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar019({
  year: yearProp = 2026,
  month: monthProp = 4,
  basePrice = 4200,
  nights = 2,
  currency = "₽",
  soldOut = [9, 10, 22],
  fromText = "от {price} за ночь",
  groupLabel = "Даты заезда и цены",
  priceLabelText = "{date} — {price} {currency} за ночь",
  soldOutLabelText = "{date} — мест нет",
  soldOutText = "нет",
  nightsText = DEFAULT_NIGHTS_TEXT,
  checkInText = "Заезд {date}, {nights}",
  locale: localeProp = "ru-RU",
  onChange,
  accent,
  background = "",
  className,
  style,
  ...props
}: Calendar019Props) {
  const [year, month] = safeMonth(yearProp, monthProp, [2026, 4])
  const locale = safeLocale(localeProp, "ru-RU")
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

  // Ровно одна кнопка сетки в табуляции: выбранный день, иначе первый свободный.
  const stop =
    days.find((entry) => entry.day === selected && !entry.sold)?.day ??
    days.find((entry) => !entry.sold)?.day

  const money = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 })
  const weekdayName = new Intl.DateTimeFormat(locale, { weekday: "short" })
  const weekdays = Array.from({ length: 7 }, (_, index) =>
    weekdayName.format(new Date(2026, 0, 5 + index)),
  )
  const title = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(first)
  // В сетке нет <th scope="col">, поэтому день недели звучит в подписи дня.
  const long = new Intl.DateTimeFormat(locale, { dateStyle: "full" })

  // Формы счётчика выбираются по правилам самого языка, а не по русским:
  // словарь приходит пропсом, а категорию называет Intl.
  const plural = new Intl.PluralRules(locale)
  const nightsLabel = fillText(
    nightsText[plural.select(nights)] ??
      nightsText.other ??
      DEFAULT_NIGHTS_TEXT.other,
    { count: nights },
  )
  const [fromBefore, fromAfter = ""] = fromText.split("{price}")

  const palette = {
    ...(accent ? { "--vibeui-calendar-019-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-calendar-019-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        data-slot="calendar"
        data-vibeui-block="calendar-019"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <p data-part="title">{title}</p>
          <p data-part="from">
            {fromBefore}
            <b>
              {money.format(cheapest)} {currency}
            </b>
            {fromAfter}
          </p>
        </div>
        <div
          data-part="grid"
          role="group"
          aria-label={groupLabel}
          onKeyDown={(event) => moveFocus(event, 7)}
        >
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
              tabIndex={entry.day === stop ? 0 : -1}
              aria-pressed={entry.day === selected}
              disabled={entry.sold}
              data-cheap={!entry.sold && entry.price === cheapest}
              aria-label={
                entry.sold
                  ? fillText(soldOutLabelText, {
                      date: long.format(entry.date),
                    })
                  : fillText(priceLabelText, {
                      date: long.format(entry.date),
                      price: money.format(entry.price),
                      currency,
                    })
              }
              onClick={() => pick(entry.day)}
            >
              <span data-part="day">{entry.day}</span>
              <span data-part="price">
                {entry.sold ? soldOutText : money.format(entry.price)}
              </span>
            </button>
          ))}
        </div>
        <div data-part="total">
          <span>
            {fillText(checkInText, {
              date: long.format(current.date),
              nights: nightsLabel,
            })}
          </span>
          <span data-part="sum">
            {money.format(total)} {currency}
          </span>
        </div>
      </div>
    </>
  )
}

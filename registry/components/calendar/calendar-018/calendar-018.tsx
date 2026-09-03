"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Calendar018Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange" | "defaultValue"
> & {
  defaultValue?: string[]
  year?: number
  month?: number
  /** Сколько дат можно выбрать одновременно. */
  max?: number
  emptyHint?: string
  /** Подпись сетки для скринридера. */
  groupLabel?: string
  /** Подпись чипа снятия. {date} подставляется. */
  removeLabelText?: string
  locale?: string
  onChange?: (dates: string[]) => void
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: выбор нескольких несмежных дат. Диапазон здесь не
// подходит — смены выпадают на вторник, четверг и субботу. Каждая выбранная
// дата дублируется чипом со снятием: снять дату в сетке из тридцати клеток
// труднее, чем в коротком списке под ней.
const STYLES = `
:where([data-vibeui-block="calendar-018"]){
--vibeui-calendar-018-bg:transparent;
--vibeui-calendar-018-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-calendar-018-muted:color-mix(in oklab,var(--vibeui-calendar-018-fg) 68%,transparent);
--vibeui-calendar-018-border:light-dark(oklch(0.91 0.006 265),oklch(0.35 0.012 265));
--vibeui-calendar-018-hover:light-dark(oklch(0.96 0.004 265),oklch(0.31 0.012 265));
--vibeui-calendar-018-accent:light-dark(oklch(0.52 0.16 300),oklch(0.74 0.14 300));
--vibeui-calendar-018-on-accent:light-dark(oklch(0.99 0.01 300),oklch(0.2 0.04 300));
--vibeui-calendar-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="calendar-018"]{color-scheme:dark}
[data-vibeui-block="calendar-018"]{
display:flex;flex-direction:column;gap:0.6875rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-calendar-018-bg);
border:1px solid var(--vibeui-calendar-018-border);border-radius:1rem;
color:var(--vibeui-calendar-018-fg);font-family:var(--vibeui-calendar-018-font);
}
[data-vibeui-block="calendar-018"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="calendar-018"] [data-part="title"]{
margin:0;font-size:0.9375rem;font-weight:650;
}
/* Заглавная только первая буква: capitalize поднимает и «г.» в «январь 2026 г.». */
[data-vibeui-block="calendar-018"] [data-part="title"]::first-letter{text-transform:uppercase}
[data-vibeui-block="calendar-018"] [data-part="counter"]{
font-size:0.75rem;font-variant-numeric:tabular-nums;color:var(--vibeui-calendar-018-muted);
}
[data-vibeui-block="calendar-018"] [data-part="counter"][data-full="true"]{
color:var(--vibeui-calendar-018-accent);font-weight:650;
}
[data-vibeui-block="calendar-018"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(7,1fr);gap:0.1875rem;
}
[data-vibeui-block="calendar-018"] [data-part="wd"]{
text-align:center;font-size:0.6875rem;font-weight:600;
color:var(--vibeui-calendar-018-muted);text-transform:capitalize;
}
[data-vibeui-block="calendar-018"] [data-part="grid"] button{
appearance:none;cursor:pointer;
aspect-ratio:1;padding:0;border:0;border-radius:0.5rem;
background:transparent;color:inherit;
font:inherit;font-size:0.8125rem;font-variant-numeric:tabular-nums;
transition:background-color .14s ease;
}
[data-vibeui-block="calendar-018"] [data-part="grid"] button:hover:not([aria-disabled="true"]){background:var(--vibeui-calendar-018-hover)}
[data-vibeui-block="calendar-018"] [data-part="grid"] button:focus-visible{outline:2px solid var(--vibeui-calendar-018-accent);outline-offset:-2px}
[data-vibeui-block="calendar-018"] [data-part="grid"] button[aria-pressed="true"]{
background:var(--vibeui-calendar-018-accent);color:var(--vibeui-calendar-018-on-accent);font-weight:700;
}
/* Лимит не прячет кнопку: она остаётся видимой и приглушённой, иначе
   исчезающие клетки читаются как ошибка вёрстки. */
[data-vibeui-block="calendar-018"] [data-part="grid"] button[aria-disabled="true"]{
color:var(--vibeui-calendar-018-muted);opacity:.45;cursor:not-allowed;
}
[data-vibeui-block="calendar-018"] [data-part="chips"]{
display:flex;flex-wrap:wrap;gap:0.3125rem;margin:0;padding:0;list-style:none;min-height:1.75rem;
}
[data-vibeui-block="calendar-018"] [data-part="chips"] li{display:flex}
[data-vibeui-block="calendar-018"] [data-part="chip"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.375rem;
height:1.75rem;padding:0 0.5rem 0 0.625rem;border-radius:0.875rem;
border:1px solid var(--vibeui-calendar-018-border);
background:transparent;color:inherit;
font:inherit;font-size:0.75rem;
}
[data-vibeui-block="calendar-018"] [data-part="chip"]:hover{background:var(--vibeui-calendar-018-hover)}
[data-vibeui-block="calendar-018"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-calendar-018-accent);outline-offset:2px}
[data-vibeui-block="calendar-018"] [data-part="chip"] i{
position:relative;width:0.625rem;height:0.625rem;flex:none;opacity:.65;
}
[data-vibeui-block="calendar-018"] [data-part="chip"] i::before,
[data-vibeui-block="calendar-018"] [data-part="chip"] i::after{
content:"";position:absolute;inset:45% 0 auto;height:1.25px;background:currentColor;
}
[data-vibeui-block="calendar-018"] [data-part="chip"] i::before{transform:rotate(45deg)}
[data-vibeui-block="calendar-018"] [data-part="chip"] i::after{transform:rotate(-45deg)}
[data-vibeui-block="calendar-018"] [data-part="hint"]{
margin:0;font-size:0.875rem;color:var(--vibeui-calendar-018-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-018"] *{animation:none!important;transition:none!important}}
`

function iso(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
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
 * Даты, месяц и локаль из пропов или дефолты компонента. Чужая страница не
 * должна падать из-за опечатки в значении: Intl бросает RangeError и на
 * Invalid Date, и на нераспознанной локали — белый экран вместо всего сайта.
 */
function safeDates(values: string[]) {
  return values.filter(
    (value) => !Number.isNaN(new Date(`${value}T00:00:00`).getTime()),
  )
}

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
 * Мультивыбор несмежных дат: сетка месяца плюс чипы со снятием.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar018({
  defaultValue: defaultValueProp = ["2026-03-03", "2026-03-12", "2026-03-21"],
  year: yearProp = 2026,
  month: monthProp = 3,
  max = 5,
  emptyHint = "Отметьте дни смен — подряд идти не обязано",
  groupLabel = "Выбор нескольких дат",
  removeLabelText = "Убрать {date}",
  locale: localeProp = "ru-RU",
  onChange,
  accent,
  background = "",
  className,
  style,
  ...props
}: Calendar018Props) {
  const [year, month] = safeMonth(yearProp, monthProp, [2026, 3])
  const locale = safeLocale(localeProp, "ru-RU")
  const [selected, setSelected] = useState(() => safeDates(defaultValueProp))

  const first = new Date(year, month - 1, 1)
  const lead = (first.getDay() + 6) % 7
  const length = new Date(year, month, 0).getDate()

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
  const chipLabel = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  })

  const palette = {
    ...(accent ? { "--vibeui-calendar-018-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-calendar-018-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const toggle = (value: string) => {
    const next = selected.includes(value)
      ? selected.filter((entry) => entry !== value)
      : selected.length >= max
        ? selected
        : [...selected, value].sort()

    setSelected(next)
    onChange?.(next)
  }

  const full = selected.length >= max
  // Ровно одна кнопка сетки в табуляции: первая отмеченная, иначе первое число.
  const stop = selected[0] ?? iso(year, month, 1)

  return (
    <>
      <style href="vibeui-calendar-018" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="calendar"
        data-vibeui-block="calendar-018"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <p data-part="title">{title}</p>
          <span data-part="counter" data-full={full}>
            {selected.length} / {max}
          </span>
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
          {Array.from({ length }, (_, index) => {
            const day = index + 1
            const value = iso(year, month, day)
            const active = selected.includes(value)

            return (
              <button
                key={value}
                type="button"
                tabIndex={value === stop ? 0 : -1}
                aria-pressed={active}
                aria-disabled={!active && full}
                aria-label={long.format(new Date(year, month - 1, day))}
                onClick={() => toggle(value)}
              >
                {day}
              </button>
            )
          })}
        </div>
        {selected.length > 0 ? (
          <ul data-part="chips">
            {selected.map((value) => (
              <li key={value}>
                <button
                  type="button"
                  data-part="chip"
                  onClick={() => toggle(value)}
                  aria-label={fillText(removeLabelText, {
                    date: long.format(new Date(`${value}T00:00:00`)),
                  })}
                >
                  {chipLabel.format(new Date(`${value}T00:00:00`))}
                  <i aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p data-part="hint">{emptyHint}</p>
        )}
      </div>
    </>
  )
}

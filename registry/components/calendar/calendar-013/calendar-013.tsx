"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Calendar013Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange" | "defaultValue"
> & {
  /** Опорный «сегодня» в ISO: строкой, чтобы серверный и клиентский рендер совпали. */
  today?: string
  defaultValue?: string
  reason?: string
  /** Подпись закрытого дня для скринридера. {date} и {reason} подставляются. */
  unavailableText?: string
  /** Строка отказа под сеткой. {date} и {reason} подставляются. */
  deniedText?: string
  /** Строка выбранной даты под сеткой. {date} подставляется. */
  selectedText?: string
  /** Слово к сегодняшней дате: рамка видна глазом, но не слышна скринридеру. */
  todayLabel?: string
  locale?: string
  onChange?: (iso: string) => void
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: закрытая дата отвечает, а не молчит. Прошедшие дни
// помечены aria-disabled, а не disabled: они принимают фокус и нажатие, и
// вместо пустого клика показывают подписанную причину отказа.
const STYLES = `
:where([data-vibeui-block="calendar-013"]){
--vibeui-calendar-013-bg:transparent;
--vibeui-calendar-013-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-calendar-013-muted:color-mix(in oklab,var(--vibeui-calendar-013-fg) 68%,transparent);
--vibeui-calendar-013-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-calendar-013-hover:light-dark(oklch(0.96 0 265),oklch(0.31 0 265));
--vibeui-calendar-013-note:light-dark(oklch(0.97 0 265),oklch(0.28 0 265));
--vibeui-calendar-013-accent:light-dark(oklch(0.53 0.15 39.8),oklch(0.76 0.13 39.8));
--vibeui-calendar-013-on-accent:light-dark(oklch(0.99 0.01 165),oklch(0.2 0.04 39.8));
--vibeui-calendar-013-locked:light-dark(oklch(0.55 0.16 25),oklch(0.74 0.14 25));
--vibeui-calendar-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="calendar-013"]{color-scheme:dark}
[data-vibeui-block="calendar-013"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:19rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-calendar-013-bg);
border:1px solid var(--vibeui-calendar-013-border);border-radius:0.875rem;
color:var(--vibeui-calendar-013-fg);font-family:var(--vibeui-calendar-013-font);
}
[data-vibeui-block="calendar-013"] [data-part="title"]{
margin:0;font-size:0.9375rem;font-weight:650;
}
/* Заглавная только первая буква: capitalize поднимает и «г.» в «январь 2026 г.». */
[data-vibeui-block="calendar-013"] [data-part="title"]::first-letter{text-transform:uppercase}
[data-vibeui-block="calendar-013"] table{width:100%;border-collapse:collapse;table-layout:fixed}
[data-vibeui-block="calendar-013"] th{
padding:0.25rem 0;font-size:0.6875rem;font-weight:600;
color:var(--vibeui-calendar-013-muted);text-transform:capitalize;
}
[data-vibeui-block="calendar-013"] td{padding:0.0625rem;text-align:center}
[data-vibeui-block="calendar-013"] td button{
appearance:none;cursor:pointer;position:relative;
display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;padding:0;border:0;border-radius:0.5rem;
background:transparent;color:inherit;
font:inherit;font-size:0.8125rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-013"] td button:hover{background:var(--vibeui-calendar-013-hover)}
[data-vibeui-block="calendar-013"] td button:focus-visible{outline:2px solid var(--vibeui-calendar-013-accent);outline-offset:-2px}
[data-vibeui-block="calendar-013"] td button[data-outside="true"]{color:var(--vibeui-calendar-013-muted);opacity:.5}
/* Закрытый день перечёркнут, а не только приглушён: одной бледностью
   «недоступно» от «другой месяц» не отличить. */
[data-vibeui-block="calendar-013"] td button[aria-disabled="true"]{
color:var(--vibeui-calendar-013-muted);cursor:not-allowed;
text-decoration:line-through;text-decoration-color:var(--vibeui-calendar-013-locked);
}
[data-vibeui-block="calendar-013"] td button[aria-disabled="true"]:hover{background:transparent}
[data-vibeui-block="calendar-013"] td button[data-today="true"]{box-shadow:inset 0 0 0 1px var(--vibeui-calendar-013-accent);font-weight:650}
[data-vibeui-block="calendar-013"] td button[aria-pressed="true"]{
background:var(--vibeui-calendar-013-accent);color:var(--vibeui-calendar-013-on-accent);font-weight:650;
}
[data-vibeui-block="calendar-013"] [data-part="status"]{
display:flex;align-items:flex-start;gap:0.4375rem;min-height:2.25rem;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font-size:0.875rem;line-height:1.35;
background:var(--vibeui-calendar-013-note);color:var(--vibeui-calendar-013-muted);
}
[data-vibeui-block="calendar-013"] [data-part="status"][data-tone="locked"]{
background:color-mix(in oklab,var(--vibeui-calendar-013-locked) 12%,var(--vibeui-calendar-013-note));
color:var(--vibeui-calendar-013-locked);
}
[data-vibeui-block="calendar-013"] [data-part="status"][data-tone="ok"]{
background:color-mix(in oklab,var(--vibeui-calendar-013-accent) 12%,var(--vibeui-calendar-013-note));
color:var(--vibeui-calendar-013-accent);
}
[data-vibeui-block="calendar-013"] [data-part="mark"]{
flex:none;width:0.875rem;height:0.875rem;margin-top:0.0625rem;border-radius:50%;
border:1.5px solid currentColor;
}
[data-vibeui-block="calendar-013"] [data-part="status"][data-tone="locked"] [data-part="mark"]{
background:currentColor;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-013"] *{animation:none!important;transition:none!important}}
`

const DAY = 86400000

function iso(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function parse(value: string) {
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, month - 1, day)
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

function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match)
}

/**
 * Дата и локаль из пропов или дефолты компонента. Чужая страница не должна
 * падать из-за опечатки в значении: Intl бросает RangeError и на Invalid Date,
 * и на нераспознанной локали, а это белый экран вместо всего сайта.
 */
function safeDate(value: string, fallback: string) {
  return Number.isNaN(parse(value).getTime()) ? fallback : value
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
 * Месяц с закрытым прошлым: недоступный день объясняет отказ подписью.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar013({
  today: todayProp = "2026-03-14",
  defaultValue: defaultValueProp = "2026-03-18",
  reason = "Запись закрывается за сутки: прошедшие дни выбрать нельзя",
  unavailableText = "{date} — недоступно. {reason}",
  deniedText = "{date} — {reason}",
  selectedText = "Выбрано: {date}",
  todayLabel = "Сегодня",
  locale: localeProp = "ru-RU",
  onChange,
  accent,
  background = "",
  className,
  style,
  ...props
}: Calendar013Props) {
  const today = safeDate(todayProp, "2026-03-14")
  const defaultValue = safeDate(defaultValueProp, "2026-03-18")
  const locale = safeLocale(localeProp, "ru-RU")
  const [selected, setSelected] = useState(defaultValue)
  const [denied, setDenied] = useState<string | null>(null)

  const anchor = parse(today)
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1)
  const start = new Date(first.getTime() - ((first.getDay() + 6) % 7) * DAY)
  const cells = Array.from(
    { length: 42 },
    (_, index) => new Date(start.getTime() + index * DAY),
  )

  const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" })
  const long = new Intl.DateTimeFormat(locale, { dateStyle: "long" })
  const title = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(first)

  const palette = {
    ...(accent ? { "--vibeui-calendar-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-calendar-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  // Ровно одна кнопка сетки в табуляции: выбранный день, иначе сегодняшний.
  const stop = cells.some((date) => iso(date) === selected) ? selected : today

  const press = (date: Date, locked: boolean) => {
    if (locked) {
      setDenied(long.format(date))
      return
    }

    setDenied(null)
    setSelected(iso(date))
    onChange?.(iso(date))
  }

  return (
    <>
      <style href="vibeui-calendar-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="calendar"
        data-vibeui-block="calendar-013"
        className={className}
        style={palette}
      >
        <p data-part="title">{title}</p>
        <table>
          <thead>
            <tr>
              {cells.slice(0, 7).map((date) => (
                <th key={iso(date)} scope="col">
                  {weekday.format(date)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody onKeyDown={(event) => moveFocus(event, 7)}>
            {Array.from({ length: 6 }, (_, row) => (
              <tr key={row}>
                {cells.slice(row * 7, row * 7 + 7).map((date) => {
                  const value = iso(date)
                  const locked = value < today
                  const named =
                    value === today
                      ? `${long.format(date)}, ${todayLabel}`
                      : long.format(date)

                  return (
                    <td key={value}>
                      <button
                        type="button"
                        tabIndex={value === stop ? 0 : -1}
                        aria-disabled={locked}
                        aria-pressed={!locked && value === selected}
                        aria-label={
                          locked
                            ? fill(unavailableText, {
                                date: named,
                                reason,
                              })
                            : named
                        }
                        data-outside={date.getMonth() !== first.getMonth()}
                        data-today={value === today}
                        onClick={() => press(date, locked)}
                      >
                        {date.getDate()}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p
          data-part="status"
          data-tone={denied ? "locked" : "ok"}
          role="status"
          aria-live="polite"
        >
          <span data-part="mark" aria-hidden="true" />
          <span>
            {denied
              ? fill(deniedText, { date: denied, reason })
              : fill(selectedText, { date: long.format(parse(selected)) })}
          </span>
        </p>
      </div>
    </>
  )
}

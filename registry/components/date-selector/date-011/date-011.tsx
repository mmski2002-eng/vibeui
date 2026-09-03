"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Date011Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  /** Занятые дни в формате ГГГГ-ММ-ДД: их выбрать нельзя. */
  busy?: string[]
  /** Выходные считаются занятыми: суббота и воскресенье. */
  skipWeekend?: boolean
  defaultValue?: string
  /** Подпись отказа. {date} подставляется человеческой записью. */
  busyTemplate?: string
  /** Подпись подсказки о ближайшем свободном дне. {date} подставляется. */
  nearestTemplate?: string
  takeLabel?: string
  hint?: string
  accent?: string
  /** Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: поле даты, у которого часть дней занята. Нативный input
// умеет только границы min и max, поэтому «занято двенадцатого и
// пятнадцатого» он принимает молча, а отказ приходит уже с сервера — после
// отправки формы. Здесь занятость проверяется на месте, и вместо «дата
// недоступна» компонент предлагает ближайший свободный день кнопкой:
// человек пришёл записаться, а не изучать чужое расписание. Выходные
// выключаются одним переключателем — это самая частая разновидность занятости.
const STYLES = `
:where([data-vibeui-block="date-011"]){
--vibeui-date-011-bg:transparent;
--vibeui-date-011-fg:light-dark(oklch(0.25 0.014 265),oklch(0.95 0.005 265));
--vibeui-date-011-muted:color-mix(in oklab,var(--vibeui-date-011-fg) 62%,transparent);
--vibeui-date-011-border:light-dark(oklch(0.86 0.008 265),oklch(0.38 0.012 265));
--vibeui-date-011-field:light-dark(oklch(1 0 0),oklch(1 0 0 / 6%));
--vibeui-date-011-accent:light-dark(oklch(0.5 0.16 265),oklch(0.78 0.12 265));
--vibeui-date-011-ok:light-dark(oklch(0.45 0.13 152),oklch(0.82 0.13 152));
--vibeui-date-011-busy:light-dark(oklch(0.53 0.19 25),oklch(0.79 0.15 25));
--vibeui-date-011-busy-soft:color-mix(in oklab,var(--vibeui-date-011-busy) 12%,transparent);
--vibeui-date-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="date-011"]{color-scheme:dark}
[data-vibeui-block="date-011"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:21rem;box-sizing:border-box;
font-family:var(--vibeui-date-011-font);color:var(--vibeui-date-011-fg);
}
[data-vibeui-block="date-011"] *{box-sizing:border-box}
[data-vibeui-block="date-011"] [data-part="label"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="date-011"] input[type="date"]{
width:100%;min-height:2.5rem;padding:0.4375rem 0.625rem;
border:1px solid var(--vibeui-date-011-border);border-radius:0.625rem;
background:var(--vibeui-date-011-field);color:inherit;
font:inherit;font-size:0.9375rem;
}
[data-vibeui-block="date-011"] input[type="date"]:focus-visible{
outline:2px solid var(--vibeui-date-011-accent);outline-offset:1px;
border-color:var(--vibeui-date-011-accent);
}
[data-vibeui-block="date-011"][data-busy="true"] input[type="date"]{
border-color:var(--vibeui-date-011-busy);
}
/* Отказ и выход из него стоят рядом: человек пришёл записаться, а не
   изучать расписание. */
[data-vibeui-block="date-011"] [data-part="busy"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
margin:0;padding:0.4375rem 0.625rem;border-radius:0.5rem;
background:var(--vibeui-date-011-busy-soft);
color:var(--vibeui-date-011-busy);
font-size:0.8125rem;line-height:1.4;
}
[data-vibeui-block="date-011"] [data-part="take"]{
appearance:none;cursor:pointer;
min-height:1.75rem;padding:0.1875rem 0.625rem;border-radius:0.4375rem;
border:1px solid currentColor;background:transparent;color:inherit;
font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="date-011"] [data-part="free"]{
margin:0;font-size:0.8125rem;color:var(--vibeui-date-011-ok);font-weight:600;
}
[data-vibeui-block="date-011"] [data-part="weekend"]{
display:inline-flex;align-items:center;gap:0.4375rem;cursor:pointer;
font-size:0.75rem;color:var(--vibeui-date-011-muted);
}
[data-vibeui-block="date-011"] [data-part="weekend"] input{
width:0.875rem;height:0.875rem;margin:0;accent-color:var(--vibeui-date-011-accent);
}
[data-vibeui-block="date-011"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-date-011-muted);
}
[data-vibeui-block="date-011"] :focus-visible{outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="date-011"] *{animation:none!important;transition:none!important}}
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

const DEFAULT_BUSY = ["2026-09-15", "2026-09-16", "2026-09-22"]

/** Человеческая запись дня: «15 сентября». */
function human(value: string): string {
  const [year, month, day] = value.split("-").map(Number)

  if (!year || !month || !day) {
    return value
  }

  return `${day} ${MONTHS[month - 1]}`
}

/** Дата в формате поля по местным часам. */
function iso(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${date.getFullYear()}-${month}-${day}`
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
 * Поле даты с занятыми днями: отказ на месте и ближайший свободный день рядом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Date011({
  label = "День визита",
  busy = DEFAULT_BUSY,
  skipWeekend = true,
  defaultValue = "2026-09-15",
  busyTemplate = "{date} уже занято",
  nearestTemplate = "Ближайший свободный: {date}",
  takeLabel = "Взять",
  hint = "Занятые дни приходят с сервера; проверка идёт до отправки формы.",
  accent,
  background = "",
  className,
  style,
  ...props
}: Date011Props) {
  const id = useId().replace(/:/g, "")
  const [value, setValue] = useState(defaultValue)
  const [weekend, setWeekend] = useState(skipWeekend)

  const palette = {
    ...(accent ? { "--vibeui-date-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-date-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const taken = (day: string) => {
    if (busy.includes(day)) {
      return true
    }

    if (!weekend) {
      return false
    }

    const week = new Date(`${day}T00:00:00`).getDay()

    return week === 0 || week === 6
  }

  const occupied = value !== "" && taken(value)

  // Ближайший свободный ищется вперёд и не дальше двух месяцев: если и там
  // пусто, честнее промолчать, чем перебирать календарь вечно.
  const nearest = (() => {
    if (!occupied) {
      return ""
    }

    const cursor = new Date(`${value}T00:00:00`)

    for (let step = 0; step < 60; step += 1) {
      cursor.setDate(cursor.getDate() + 1)
      const day = iso(cursor)

      if (!taken(day)) {
        return day
      }
    }

    return ""
  })()

  return (
    <>
      <style href="vibeui-date-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="date-selector"
        data-vibeui-block="date-011"
        data-busy={occupied || undefined}
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={`${id}-field`}>
          {label}
        </label>

        <input
          id={`${id}-field`}
          type="date"
          value={value}
          aria-invalid={occupied || undefined}
          aria-describedby={occupied ? `${id}-busy` : undefined}
          onChange={(event) => setValue(event.target.value)}
        />

        {occupied ? (
          <p data-part="busy" id={`${id}-busy`} role="status">
            {busyTemplate.replace("{date}", human(value))}
            {nearest ? (
              <>
                {" · "}
                {nearestTemplate.replace("{date}", human(nearest))}
                <button
                  type="button"
                  data-part="take"
                  onClick={() => setValue(nearest)}
                >
                  {takeLabel}
                </button>
              </>
            ) : null}
          </p>
        ) : value ? (
          <p data-part="free">{human(value)} — свободно</p>
        ) : null}

        <label data-part="weekend">
          <input
            type="checkbox"
            checked={weekend}
            onChange={(event) => setWeekend(event.target.checked)}
          />
          Выходные считать занятыми
        </label>

        <p data-part="hint">{hint}</p>
      </div>
    </>
  )
}

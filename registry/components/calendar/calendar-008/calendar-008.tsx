"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Calendar008Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  defaultYear?: number
  defaultMonth?: number
  locale?: string
  onChange?: (value: { year: number; month: number }) => void
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  /** Подпись стрелки. {year} подставляется числом. */
  yearLabel?: string
  /** Подпись под сеткой. {month} подставляется названием месяца. */
  pickedText?: string
  /** Слово к текущему месяцу: рамка видна глазом, но не слышна скринридеру. */
  currentLabel?: string
}

// Идея компонента: выбор месяца без дней. Отчёты, зарплата и планы живут
// месяцами, и пролистывать для этого сетку из тридцати чисел — лишний шаг.
// Год переключается стрелками рядом, а не отдельным списком: между «март
// 2025» и «март 2026» человек ходит чаще, чем между произвольными годами.
const STYLES = `
:where([data-vibeui-block="calendar-008"]){
--vibeui-calendar-008-bg:transparent;
--vibeui-calendar-008-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-calendar-008-muted:color-mix(in oklab,var(--vibeui-calendar-008-fg) 68%,transparent);
--vibeui-calendar-008-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-calendar-008-hover:light-dark(oklch(0.96 0 265),oklch(0.29 0 265));
--vibeui-calendar-008-accent:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.15 265));
--vibeui-calendar-008-on-accent:light-dark(oklch(0.99 0 265),oklch(0.19 0 265));
--vibeui-calendar-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="calendar-008"]{color-scheme:dark}
[data-vibeui-block="calendar-008"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:17rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-calendar-008-bg);
border:1px solid var(--vibeui-calendar-008-border);border-radius:0.875rem;
color:var(--vibeui-calendar-008-fg);font-family:var(--vibeui-calendar-008-font);
}
[data-vibeui-block="calendar-008"] [data-part="head"]{display:flex;align-items:center;justify-content:space-between;gap:0.5rem}
[data-vibeui-block="calendar-008"] [data-part="year"]{font-size:0.9375rem;font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="calendar-008"] [data-part="nav"]{display:flex;gap:0.25rem}
[data-vibeui-block="calendar-008"] [data-part="nav"] button{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;padding:0;
border:1px solid var(--vibeui-calendar-008-border);border-radius:0.5rem;
background:transparent;color:inherit;
}
[data-vibeui-block="calendar-008"] [data-part="nav"] button:hover{background:var(--vibeui-calendar-008-hover)}
[data-vibeui-block="calendar-008"] [data-part="nav"] button:focus-visible{outline:2px solid var(--vibeui-calendar-008-accent);outline-offset:2px}
[data-vibeui-block="calendar-008"] [data-part="arrow"]{
width:0.375rem;height:0.375rem;
border-left:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg) translate(0.0625rem,-0.0625rem);
}
[data-vibeui-block="calendar-008"] [data-part="arrow"][data-dir="next"]{transform:rotate(-135deg) translate(0.0625rem,-0.0625rem)}
/* Три колонки на четыре строки: месяцы читаются кварталами. */
[data-vibeui-block="calendar-008"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(3,1fr);gap:0.375rem;
}
[data-vibeui-block="calendar-008"] [data-part="grid"] button{
appearance:none;cursor:pointer;
height:2.25rem;padding:0;border-radius:0.5rem;
border:1px solid transparent;background:transparent;color:inherit;
font:inherit;font-size:0.8125rem;text-transform:capitalize;
}
[data-vibeui-block="calendar-008"] [data-part="grid"] button:hover{background:var(--vibeui-calendar-008-hover)}
[data-vibeui-block="calendar-008"] [data-part="grid"] button:focus-visible{outline:2px solid var(--vibeui-calendar-008-accent);outline-offset:-2px}
[data-vibeui-block="calendar-008"] [data-part="grid"] button[data-current="true"]{border-color:var(--vibeui-calendar-008-border);font-weight:650}
[data-vibeui-block="calendar-008"] [data-part="grid"] button[aria-pressed="true"]{
border-color:transparent;background:var(--vibeui-calendar-008-accent);color:var(--vibeui-calendar-008-on-accent);font-weight:650;
}
[data-vibeui-block="calendar-008"] [data-part="picked"]{font-size:0.875rem;color:var(--vibeui-calendar-008-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-008"] *{animation:none!important;transition:none!important}}
`

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
 * Выбор месяца и года без сетки дней.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar008({
  defaultYear: defaultYearProp = 2026,
  defaultMonth: defaultMonthProp = 3,
  locale: localeProp = "ru-RU",
  onChange,
  accent,
  background = "",
  yearLabel = "Год {year}",
  pickedText = "Выбрано: {month}",
  currentLabel = "Текущий месяц",
  className,
  style,
  ...props
}: Calendar008Props) {
  const [defaultYear, defaultMonth] = safeMonth(
    defaultYearProp,
    defaultMonthProp,
    [2026, 3],
  )
  const locale = safeLocale(localeProp, "ru-RU")
  const [year, setYear] = useState(defaultYear)
  const [value, setValue] = useState({
    year: defaultYear,
    month: defaultMonth,
  })

  const short = new Intl.DateTimeFormat(locale, { month: "short" })
  const long = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  })
  const now = new Date()
  // Выбранный месяц — единственная кнопка сетки в табуляции; если выбран
  // месяц другого года, ход в сетку даёт январь показанного.
  const inYear = value.year === year

  const palette = {
    ...(accent ? { "--vibeui-calendar-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-calendar-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="calendar"
        data-vibeui-block="calendar-008"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <span data-part="year">{year}</span>
          <span data-part="nav">
            <button
              type="button"
              aria-label={yearLabel.replace("{year}", String(year - 1))}
              onClick={() => setYear(year - 1)}
            >
              <span data-part="arrow" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={yearLabel.replace("{year}", String(year + 1))}
              onClick={() => setYear(year + 1)}
            >
              <span data-part="arrow" data-dir="next" aria-hidden="true" />
            </button>
          </span>
        </div>
        <div data-part="grid" onKeyDown={(event) => moveFocus(event, 3)}>
          {Array.from({ length: 12 }, (_, index) => {
            const date = new Date(year, index, 1)
            const selected = value.year === year && value.month === index + 1
            const current =
              now.getFullYear() === year && now.getMonth() === index

            return (
              <button
                key={index}
                type="button"
                tabIndex={selected || (!inYear && index === 0) ? 0 : -1}
                aria-pressed={selected}
                aria-label={
                  current
                    ? `${long.format(date)}, ${currentLabel}`
                    : long.format(date)
                }
                data-current={current}
                onClick={() => {
                  const next = { year, month: index + 1 }
                  setValue(next)
                  onChange?.(next)
                }}
              >
                {short.format(date)}
              </button>
            )
          })}
        </div>
        <p data-part="picked">
          {pickedText.replace(
            "{month}",
            long.format(new Date(value.year, value.month - 1, 1)),
          )}
        </p>
      </div>
    </>
  )
}

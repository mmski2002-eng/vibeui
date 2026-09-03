"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Calendar029Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange" | "defaultValue"
> & {
  label?: string
  defaultValue?: string
  neighbours?: string[]
  locale?: string
  /** Значение фишки при снятом фильтре. */
  anyText?: string
  /** Подпись кнопки сброса фильтра. */
  clearLabel?: string
  /** Подписи кнопок перелистывания месяца. */
  prevLabel?: string
  nextLabel?: string
  /** Пусто — подложки нет, строка фильтров лежит прямо на фоне страницы. */
  background?: string
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: в строке фильтров дате нельзя занимать поле в половину
// экрана. Поэтому дата здесь — такая же фишка, как «Статус» рядом: она
// показывает выбранное значение текстом, а сетка месяца открывается панелью
// поверх и закрывается сразу после выбора. Крестик снимает фильтр, не открывая
// панель, — это отдельная кнопка внутри фишки.
const STYLES = `
:where([data-vibeui-block="calendar-029"]){
--vibeui-calendar-029-bg:transparent;
--vibeui-calendar-029-panel:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-calendar-029-shadow:light-dark(oklch(0.2 0.02 265 / 14%),oklch(0 0 0 / 50%));
--vibeui-calendar-029-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-calendar-029-muted:color-mix(in oklab,var(--vibeui-calendar-029-fg) 68%,transparent);
--vibeui-calendar-029-border:light-dark(oklch(0.9 0.008 265),oklch(0.35 0.014 265));
--vibeui-calendar-029-soft:light-dark(oklch(0.97 0.006 265),oklch(0.28 0.01 265));
--vibeui-calendar-029-accent:light-dark(oklch(0.5 0.14 265),oklch(0.74 0.13 265));
--vibeui-calendar-029-accentsoft:light-dark(oklch(0.94 0.04 265),oklch(0.31 0.05 265));
--vibeui-calendar-029-onaccent:light-dark(oklch(0.99 0 0),oklch(0.18 0.02 265));
--vibeui-calendar-029-radius:0.625rem;
--vibeui-calendar-029-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="calendar-029"]{color-scheme:dark}
[data-vibeui-block="calendar-029"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-calendar-029-bg);
border:1px solid var(--vibeui-calendar-029-border);
border-radius:calc(var(--vibeui-calendar-029-radius) + 0.375rem);
color:var(--vibeui-calendar-029-fg);
font-family:var(--vibeui-calendar-029-font);
}
[data-vibeui-block="calendar-029"] [data-part="chip"]{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;gap:0.3125rem;
height:2rem;padding:0 0.625rem;border-radius:999px;
border:1px solid var(--vibeui-calendar-029-border);
background:var(--vibeui-calendar-029-soft);
color:var(--vibeui-calendar-029-muted);
font-size:0.8125rem;font-weight:600;white-space:nowrap;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="calendar-029"] [data-part="chip"]:hover{border-color:var(--vibeui-calendar-029-accent)}
[data-vibeui-block="calendar-029"] [data-part="chip"]:focus-visible{
outline:2px solid var(--vibeui-calendar-029-accent);outline-offset:2px;
}
[data-vibeui-block="calendar-029"] [data-part="anchor"]{position:relative;display:inline-flex;align-items:center;gap:0.125rem}
[data-vibeui-block="calendar-029"] [data-part="date"][data-set="true"]{
background:var(--vibeui-calendar-029-accentsoft);
border-color:var(--vibeui-calendar-029-accent);
color:var(--vibeui-calendar-029-fg);
}
[data-vibeui-block="calendar-029"] [data-part="clear"]{
appearance:none;cursor:pointer;font:inherit;border:0;background:transparent;color:inherit;
display:inline-flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;border-radius:999px;font-size:0.875rem;line-height:1;
color:var(--vibeui-calendar-029-muted);
}
[data-vibeui-block="calendar-029"] [data-part="clear"]:hover{background:var(--vibeui-calendar-029-soft)}
[data-vibeui-block="calendar-029"] [data-part="clear"]:focus-visible{
outline:2px solid var(--vibeui-calendar-029-accent);outline-offset:1px;
}
[data-vibeui-block="calendar-029"] [data-part="panel"]{
position:absolute;top:calc(100% + 0.375rem);left:0;z-index:20;
width:15.5rem;box-sizing:border-box;padding:0.625rem;
background:var(--vibeui-calendar-029-panel);
border:1px solid var(--vibeui-calendar-029-border);
border-radius:0.75rem;
box-shadow:0 12px 28px var(--vibeui-calendar-029-shadow);
}
[data-vibeui-block="calendar-029"] [data-part="nav"]{
display:flex;align-items:center;justify-content:space-between;gap:0.3125rem;margin-bottom:0.375rem;
}
[data-vibeui-block="calendar-029"] [data-part="nav"] strong{
font-size:0.9375rem;font-weight:700;text-transform:capitalize;
}
[data-vibeui-block="calendar-029"] [data-part="step"]{
appearance:none;cursor:pointer;font:inherit;
width:1.625rem;height:1.625rem;border-radius:0.375rem;
border:1px solid var(--vibeui-calendar-029-border);
background:var(--vibeui-calendar-029-soft);color:inherit;line-height:1;
}
[data-vibeui-block="calendar-029"] [data-part="step"]:focus-visible{
outline:2px solid var(--vibeui-calendar-029-accent);outline-offset:2px;
}
[data-vibeui-block="calendar-029"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(7,1fr);gap:0.125rem;
}
[data-vibeui-block="calendar-029"] [data-part="dow"]{
text-align:center;font-size:0.6875rem;font-weight:700;text-transform:uppercase;
color:var(--vibeui-calendar-029-muted);padding-bottom:0.125rem;
}
[data-vibeui-block="calendar-029"] [data-part="day"]{
appearance:none;cursor:pointer;font:inherit;
height:1.875rem;border:0;border-radius:0.375rem;
background:transparent;color:inherit;
font-size:0.8125rem;font-variant-numeric:tabular-nums;
transition:background-color .16s ease;
}
[data-vibeui-block="calendar-029"] [data-part="day"]:hover{background:var(--vibeui-calendar-029-soft)}
[data-vibeui-block="calendar-029"] [data-part="day"]:focus-visible{
outline:2px solid var(--vibeui-calendar-029-accent);outline-offset:-2px;
}
[data-vibeui-block="calendar-029"] [data-part="day"][data-outside="true"]{color:var(--vibeui-calendar-029-muted);opacity:.6}
[data-vibeui-block="calendar-029"] [data-part="day"][aria-pressed="true"]{
background:var(--vibeui-calendar-029-accent);color:var(--vibeui-calendar-029-onaccent);font-weight:700;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-029"] *{animation:none!important;transition:none!important}}
`

function stamp(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

/**
 * Стрелки водят фокус по сетке. Без них до нужного дня приходится жать Tab
 * столько раз, сколько до него дней.
 */
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
 * Дата и локаль из пропов или дефолты компонента. Чужая страница не должна
 * падать из-за опечатки в значении: Intl бросает RangeError и на Invalid Date,
 * и на нераспознанной локали, а это белый экран вместо всего сайта. Пустая
 * строка — законное «фильтр снят», её не трогаем.
 */
function safeDate(value: string, fallback: string) {
  if (!value) {
    return value
  }

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
 * Компактный выбор даты фишкой в строке фильтров.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar029({
  label = "Дата",
  defaultValue: defaultValueProp = "2026-04-15",
  neighbours = ["Статус: в работе", "Автор: любой"],
  locale: localeProp = "ru-RU",
  anyText = "любая",
  clearLabel = "Снять фильтр по дате",
  prevLabel = "Предыдущий месяц",
  nextLabel = "Следующий месяц",
  background = "",
  onChange,
  accent,
  className,
  style,
  ...props
}: Calendar029Props) {
  const defaultValue = safeDate(defaultValueProp, "2026-04-15")
  const locale = safeLocale(localeProp, "ru-RU")
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() => {
    const base = new Date(`${defaultValue || "2026-04-01"}T00:00:00`)

    return new Date(base.getFullYear(), base.getMonth(), 1)
  })

  const first = new Date(view.getFullYear(), view.getMonth(), 1)
  const offset = (first.getDay() + 6) % 7
  const cells = Array.from(
    { length: 42 },
    (_, index) =>
      new Date(view.getFullYear(), view.getMonth(), 1 - offset + index),
  )

  const weekdays = Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" })
      .format(new Date(2024, 0, 1 + index))
      .slice(0, 2),
  )

  const short = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  })
  // В сетке нет <th scope="col">, поэтому день недели звучит в подписи дня.
  const long = new Intl.DateTimeFormat(locale, { dateStyle: "full" })
  // Ровно одна кнопка сетки в табуляции: выбранный день, иначе первое число
  // показанного месяца.
  const stop = cells.some((date) => stamp(date) === value)
    ? value
    : stamp(first)

  const commit = (date: Date) => {
    const next = stamp(date)

    setValue(next)
    setOpen(false)
    onChange?.(next)
  }

  const palette = {
    ...(accent ? { "--vibeui-calendar-029-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-calendar-029-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-029" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="calendar"
        data-vibeui-block="calendar-029"
        className={className}
        style={palette}
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            event.stopPropagation()
            setOpen(false)
          }
        }}
      >
        {neighbours.map((title) => (
          <button key={title} type="button" data-part="chip">
            {title}
          </button>
        ))}
        <span data-part="anchor">
          <button
            type="button"
            data-part="chip"
            data-set={Boolean(value)}
            aria-expanded={open}
            aria-controls={`${id}-panel`}
            onClick={() => setOpen(!open)}
          >
            {label}:{" "}
            {value ? short.format(new Date(`${value}T00:00:00`)) : anyText}
            <span aria-hidden="true">▾</span>
          </button>
          {value ? (
            <button
              type="button"
              data-part="clear"
              aria-label={clearLabel}
              onClick={() => {
                setValue("")
                onChange?.("")
              }}
            >
              ×
            </button>
          ) : null}
          {open ? (
            <div id={`${id}-panel`} data-part="panel">
              <div data-part="nav">
                <button
                  type="button"
                  data-part="step"
                  aria-label={prevLabel}
                  onClick={() =>
                    setView(
                      new Date(view.getFullYear(), view.getMonth() - 1, 1),
                    )
                  }
                >
                  ‹
                </button>
                <strong>
                  {new Intl.DateTimeFormat(locale, {
                    month: "long",
                    year: "numeric",
                  }).format(view)}
                </strong>
                <button
                  type="button"
                  data-part="step"
                  aria-label={nextLabel}
                  onClick={() =>
                    setView(
                      new Date(view.getFullYear(), view.getMonth() + 1, 1),
                    )
                  }
                >
                  ›
                </button>
              </div>
              <div data-part="grid" onKeyDown={(event) => moveFocus(event, 7)}>
                {weekdays.map((name) => (
                  <span key={name} data-part="dow">
                    {name}
                  </span>
                ))}
                {cells.map((date) => (
                  <button
                    key={date.getTime()}
                    type="button"
                    data-part="day"
                    data-outside={date.getMonth() !== view.getMonth()}
                    tabIndex={stamp(date) === stop ? 0 : -1}
                    aria-label={long.format(date)}
                    aria-pressed={stamp(date) === value}
                    onClick={() => commit(date)}
                  >
                    {date.getDate()}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </span>
      </div>
    </>
  )
}

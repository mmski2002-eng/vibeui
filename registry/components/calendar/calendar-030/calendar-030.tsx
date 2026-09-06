"use client"

import { Fragment, useState } from "react"
import type {
  ComponentProps,
  CSSProperties,
  ReactNode,
  KeyboardEvent,
} from "react"

export type Calendar030Props = Omit<
  ComponentProps<"section">,
  "children" | "onChange"
> & {
  month?: string
  maxDays?: number
  defaultFrom?: string
  defaultTo?: string
  locale?: string
  /**
   * Подписи: компонент несёт русские, проект подставляет свои.
   * {max}, {count} и {unit} подставляются при сборке строки.
   */
  text?: Record<string, string>
  /** Три формы склонения слова «день»: 1 / 2 / 5. */
  dayForms?: [string, string, string]
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  onChange?: (from: string, to: string) => void
  accent?: string
}

// Идея компонента: ограничение «не больше N дней» нельзя объяснять ошибкой
// после отправки формы. Здесь после выбора первой даты недоступные дни
// физически гаснут: правило видно как форма сетки, а счётчик снизу говорит,
// сколько дней ещё осталось в лимите.
const STYLES = `
:where([data-vibeui-block="calendar-030"]){
--vibeui-calendar-030-bg:transparent;
--vibeui-calendar-030-fg:light-dark(oklch(0.23 0.014 165),oklch(0.94 0.005 165));
--vibeui-calendar-030-muted:color-mix(in oklab,var(--vibeui-calendar-030-fg) 68%,transparent);
--vibeui-calendar-030-faint:light-dark(oklch(0.82 0.01 165),oklch(0.43 0.012 165));
--vibeui-calendar-030-border:light-dark(oklch(0.91 0.008 165),oklch(0.34 0.014 165));
--vibeui-calendar-030-soft:light-dark(oklch(0.97 0.008 165),oklch(0.27 0.012 165));
--vibeui-calendar-030-accent:light-dark(oklch(0.48 0.11 39.8),oklch(0.72 0.12 39.8));
--vibeui-calendar-030-accentsoft:light-dark(oklch(0.94 0.05 39.8),oklch(0.31 0.05 39.8));
--vibeui-calendar-030-onaccent:light-dark(oklch(0.99 0 0),oklch(0.17 0.02 165));
--vibeui-calendar-030-radius:0.75rem;
--vibeui-calendar-030-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="calendar-030"]{color-scheme:dark}
[data-vibeui-block="calendar-030"]{
display:flex;flex-direction:column;gap:0.6875rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-calendar-030-bg);
border:1px solid var(--vibeui-calendar-030-border);
border-radius:calc(var(--vibeui-calendar-030-radius) + 0.25rem);
color:var(--vibeui-calendar-030-fg);
font-family:var(--vibeui-calendar-030-font);
}
[data-vibeui-block="calendar-030"] [data-part="title"]{
margin:0;font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;text-transform:capitalize;
}
[data-vibeui-block="calendar-030"] [data-part="rule"]{
margin:0.125rem 0 0;font-size:0.875rem;color:var(--vibeui-calendar-030-muted);
}
[data-vibeui-block="calendar-030"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(7,1fr);gap:0.125rem;
}
[data-vibeui-block="calendar-030"] [data-part="dow"]{
text-align:center;font-size:0.6875rem;font-weight:700;text-transform:uppercase;
color:var(--vibeui-calendar-030-muted);padding-bottom:0.1875rem;
}
[data-vibeui-block="calendar-030"] [data-part="day"]{
appearance:none;cursor:pointer;font:inherit;
height:2.125rem;border:0;border-radius:0.4375rem;
background:var(--vibeui-calendar-030-soft);color:inherit;
font-size:0.8125rem;font-variant-numeric:tabular-nums;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="calendar-030"] [data-part="day"]:hover:not(:disabled){
background:var(--vibeui-calendar-030-accentsoft);
}
[data-vibeui-block="calendar-030"] [data-part="day"]:focus-visible{
outline:2px solid var(--vibeui-calendar-030-accent);outline-offset:2px;
}
[data-vibeui-block="calendar-030"] [data-part="day"]:disabled{
cursor:not-allowed;background:transparent;color:var(--vibeui-calendar-030-faint);
}
[data-vibeui-block="calendar-030"] [data-part="day"][data-inside="true"]{
background:var(--vibeui-calendar-030-accentsoft);
}
[data-vibeui-block="calendar-030"] [data-part="day"][data-edge="true"]{
background:var(--vibeui-calendar-030-accent);color:var(--vibeui-calendar-030-onaccent);font-weight:700;
}
[data-vibeui-block="calendar-030"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding-top:0.625rem;border-top:1px solid var(--vibeui-calendar-030-border);
}
[data-vibeui-block="calendar-030"] [data-part="count"]{
margin:0;font-size:0.875rem;color:var(--vibeui-calendar-030-muted);
}
[data-vibeui-block="calendar-030"] [data-part="count"] b{
color:var(--vibeui-calendar-030-fg);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-030"] [data-part="reset"]{
appearance:none;cursor:pointer;font:inherit;flex:none;
padding:0.375rem 0.6875rem;border-radius:0.5rem;
border:1px solid var(--vibeui-calendar-030-border);
background:transparent;color:var(--vibeui-calendar-030-muted);
font-size:0.875rem;font-weight:600;
}
[data-vibeui-block="calendar-030"] [data-part="reset"]:focus-visible{
outline:2px solid var(--vibeui-calendar-030-accent);outline-offset:2px;
}
[data-vibeui-block="calendar-030"] [data-part="bar"]{
height:0.3125rem;border-radius:999px;overflow:hidden;background:var(--vibeui-calendar-030-soft);
}
[data-vibeui-block="calendar-030"] [data-part="bar"] i{
display:block;height:100%;border-radius:inherit;
width:calc(var(--vibeui-calendar-030-fill,0) * 1%);
background:var(--vibeui-calendar-030-accent);
transition:width .2s ease;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-030"] *{animation:none!important;transition:none!important}}
`

const DAY = 86400000

const TEXT: Record<string, string> = {
  rule: "Не больше {max} {unit} подряд",
  empty: "Выберите первый день",
  picking: "Начало выбрано, осталось до {count} {unit}",
  chosen: "Выбрано {count} из {max} {unit}",
  reset: "Сбросить",
}

/**
 * Подстановка {placeholder} в шаблон подписи. Значением может быть узел,
 * поэтому числа остаются в <b>, а порядок слов задаёт перевод.
 */
function fill(template: string, values: Record<string, ReactNode>) {
  return template.split(/(\{\w+\})/).map((piece, index) => {
    const key = /^\{(\w+)\}$/.exec(piece)?.[1]

    return (
      <Fragment key={index}>
        {key && key in values ? values[key] : piece}
      </Fragment>
    )
  })
}

function stamp(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function pluralize(count: number, forms: [string, string, string]) {
  const tens = count % 100
  const ones = count % 10

  if (tens > 10 && tens < 20) return forms[2]
  if (ones === 1) return forms[0]
  if (ones > 1 && ones < 5) return forms[1]

  return forms[2]
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
 * Дата, месяц и локаль из пропов или дефолты компонента. Чужая страница не
 * должна падать из-за опечатки в значении: Intl бросает RangeError и на
 * Invalid Date, и на нераспознанной локали — белый экран вместо всего сайта.
 * Пустая граница диапазона законна, её не трогаем.
 */
function safeDate(value: string, fallback: string) {
  if (!value) {
    return value
  }

  return Number.isNaN(new Date(`${value}T00:00:00`).getTime())
    ? fallback
    : value
}

function safeMonth(value: string, fallback: string) {
  return Number.isNaN(new Date(`${value}-01T00:00:00`).getTime())
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
 * Диапазон с потолком в N дней: лишние дни гаснут сразу после первой даты.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar030({
  month: monthProp = "2026-04",
  maxDays = 14,
  defaultFrom: defaultFromProp = "2026-04-06",
  defaultTo: defaultToProp = "2026-04-12",
  locale: localeProp = "ru-RU",
  text = TEXT,
  dayForms = ["дня", "дней", "дней"],
  background = "",
  onChange,
  accent,
  className,
  style,
  ...props
}: Calendar030Props) {
  const month = safeMonth(monthProp, "2026-04")
  const locale = safeLocale(localeProp, "ru-RU")
  const [from, setFrom] = useState(() =>
    safeDate(defaultFromProp, "2026-04-06"),
  )
  const [to, setTo] = useState(() => safeDate(defaultToProp, "2026-04-12"))

  const [year, index] = month.split("-").map(Number)
  const first = new Date(year, index - 1, 1)
  const offset = (first.getDay() + 6) % 7
  const total = new Date(year, index, 0).getDate()
  const cells = Array.from(
    { length: Math.ceil((offset + total) / 7) * 7 },
    (_, step) => new Date(year, index - 1, 1 - offset + step),
  )

  const weekdays = Array.from({ length: 7 }, (_, day) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" })
      .format(new Date(2024, 0, 1 + day))
      .slice(0, 2),
  )

  const start = from ? new Date(`${from}T00:00:00`).getTime() : 0
  const finish = to ? new Date(`${to}T00:00:00`).getTime() : 0
  const picking = Boolean(from) && !to

  const blocked = (date: Date) => {
    if (!picking) return false

    const distance = (date.getTime() - start) / DAY

    return distance < 0 || distance > maxDays - 1
  }

  const choose = (date: Date) => {
    const value = stamp(date)

    if (picking && date.getTime() >= start) {
      setTo(value)
      onChange?.(from, value)

      return
    }

    setFrom(value)
    setTo("")
    onChange?.(value, "")
  }

  const length =
    from && to ? Math.round((finish - start) / DAY) + 1 : from ? 1 : 0

  const heading = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(first)

  // В сетке нет <th scope="col">, поэтому день недели звучит в подписи дня.
  const long = new Intl.DateTimeFormat(locale, { dateStyle: "full" })
  // Ровно одна кнопка сетки в табуляции: начало диапазона, иначе первое
  // доступное число месяца.
  const stop =
    from ||
    stamp(
      cells.find((date) => date.getMonth() === index - 1 && !blocked(date)) ??
        first,
    )

  const palette = {
    "--vibeui-calendar-030-fill": Math.min(
      100,
      Math.round((length / maxDays) * 100),
    ),
    ...(accent ? { "--vibeui-calendar-030-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-calendar-030-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-030" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="calendar"
        data-vibeui-block="calendar-030"
        className={className}
        style={palette}
      >
        <header>
          <h3 data-part="title">{heading}</h3>
          <p data-part="rule">
            {fill(text.rule ?? TEXT.rule, {
              max: maxDays,
              unit: pluralize(maxDays, dayForms),
            })}
          </p>
        </header>
        <div data-part="grid" onKeyDown={(event) => moveFocus(event, 7)}>
          {weekdays.map((name) => (
            <span key={name} data-part="dow">
              {name}
            </span>
          ))}
          {cells.map((date) => {
            const time = date.getTime()
            const edge = stamp(date) === from || stamp(date) === to
            const inside = Boolean(to) && time > start && time < finish
            const off = blocked(date) || date.getMonth() !== index - 1

            return (
              <button
                key={time}
                type="button"
                data-part="day"
                data-edge={edge}
                data-inside={inside}
                disabled={off}
                tabIndex={stamp(date) === stop ? 0 : -1}
                aria-label={long.format(date)}
                aria-pressed={edge || inside}
                onClick={() => choose(date)}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
        <div data-part="bar" aria-hidden="true">
          <i />
        </div>
        <div data-part="foot">
          <p data-part="count" aria-live="polite">
            {length === 0
              ? (text.empty ?? TEXT.empty)
              : picking
                ? fill(text.picking ?? TEXT.picking, {
                    count: <b>{maxDays - 1}</b>,
                    unit: pluralize(maxDays - 1, dayForms),
                  })
                : fill(text.chosen ?? TEXT.chosen, {
                    count: <b>{length}</b>,
                    max: <b>{maxDays}</b>,
                    unit: pluralize(maxDays, dayForms),
                  })}
          </p>
          <button
            type="button"
            data-part="reset"
            onClick={() => {
              setFrom("")
              setTo("")
              onChange?.("", "")
            }}
          >
            {text.reset ?? TEXT.reset}
          </button>
        </div>
      </section>
    </>
  )
}

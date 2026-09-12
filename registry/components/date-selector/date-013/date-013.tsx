"use client"

import { useId, useMemo, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Date013Nights = {
  one: string
  few: string
  many: string
}

export type Date013Props = Omit<ComponentProps<"div">, "children"> & {
  /**
   * Показать календарь раскрытым в потоке страницы: витрина, скриншот,
   * отладка. В этом режиме popover не используется, поэтому Esc и клик мимо
   * не закрывают панель.
   */
  open?: boolean
  legend?: string
  fromLabel?: string
  toLabel?: string
  /** Границы диапазона в формате ГГГГ-ММ-ДД. */
  defaultFrom?: string
  defaultTo?: string
  name?: string
  locale?: string
  hint?: string
  /** Склонения ночей: {count} подставляется. */
  nightsText?: Date013Nights
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  emptyText?: string
  clearLabel?: string
  todayLabel?: string
  previousLabel?: string
  nextLabel?: string
  accent?: string
  /** Пусто — подложки нет, поля лежат прямо на фоне страницы. */
  background?: string
}

// Идея компонента: связка «два поля диапазона + одна сетка». Главное здесь
// поля «с» и «по»: они видны всегда, показывают выбранное и говорят, какой
// конец сейчас правится. Календарь пристёгнут к ним — открывается тем полем,
// которое нажали, и после второго клика возвращает диапазон в поля и
// закрывается. Одна сетка на оба конца, а не две: диапазон читается полосой,
// а не двумя одинокими датами, и ночи считаются тут же.
//
// Панель живёт в нативном popover: верхний слой, закрытие по Esc и по клику
// мимо достаются от браузера. Позиция берётся из CSS anchor positioning там,
// где он есть, а где нет — панель остаётся карточкой по центру экрана.
const STYLES = `
:where([data-vibeui-block="date-013"]){
--vibeui-date-013-surface:transparent;
--vibeui-date-013-field:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-date-013-shell:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-date-013-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-date-013-muted:color-mix(in oklab,var(--vibeui-date-013-fg) 68%,transparent);
--vibeui-date-013-border:light-dark(oklch(0.88 0 265),oklch(0.42 0 265));
--vibeui-date-013-panel:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-date-013-hover:light-dark(oklch(0.96 0 265),oklch(0.3 0 265));
--vibeui-date-013-shadow:light-dark(oklch(0.2 0 265 / 55%),oklch(0 0 0 / 70%));
--vibeui-date-013-accent:light-dark(oklch(0.28 0 0),oklch(0.906 0 0));
/* Текст на заливке выводится из светлоты акцента: пользовательский цвет
   приходит один на обе ветки темы, и фиксированный белый однажды окажется
   белым на жёлтом. */
--vibeui-date-013-on-accent:oklch(from var(--vibeui-date-013-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-date-013-soft:color-mix(in oklab,var(--vibeui-date-013-accent) 18%,transparent);
--vibeui-date-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="date-013"]{color-scheme:dark}
[data-vibeui-block="date-013"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-date-013-surface);
border:1px solid var(--vibeui-date-013-shell);border-radius:0.875rem;
font-family:var(--vibeui-date-013-font);color:var(--vibeui-date-013-fg);
}
[data-vibeui-block="date-013"] *{box-sizing:border-box}
[data-vibeui-block="date-013"] [data-part="legend"]{font-size:0.8125rem;font-weight:650;color:var(--vibeui-date-013-fg)}
[data-vibeui-block="date-013"] [data-part="fields"]{display:flex;gap:0.5rem;align-items:stretch}
/* Поле диапазона — кнопка, а не input: значение сюда кладёт сетка, и
   вручную набирать «с 14 по 21» никто не станет. */
[data-vibeui-block="date-013"] [data-part="field"]{
appearance:none;cursor:pointer;text-align:left;
flex:1 1 0;min-inline-size:0;
display:flex;flex-direction:column;gap:0.0625rem;
min-height:2.875rem;padding:0.3125rem 0.625rem;
border:1px solid var(--vibeui-date-013-border);border-radius:0.625rem;
background:var(--vibeui-date-013-field);color:var(--vibeui-date-013-fg);
font:inherit;
transition:border-color .14s ease,box-shadow .14s ease;
}
[data-vibeui-block="date-013"] [data-part="field"]:hover{border-color:var(--vibeui-date-013-accent)}
[data-vibeui-block="date-013"] [data-part="field"]:focus-visible{outline:2px solid var(--vibeui-date-013-accent);outline-offset:1px}
/* Правится один конец за раз, и видно какой: без этой отметки второй клик
   уходит непонятно куда. */
[data-vibeui-block="date-013"] [data-part="field"][aria-pressed="true"]{
border-color:var(--vibeui-date-013-accent);
box-shadow:inset 0 0 0 1px var(--vibeui-date-013-accent);
}
[data-vibeui-block="date-013"] [data-part="caption"]{font-size:0.6875rem;font-weight:600;color:var(--vibeui-date-013-muted)}
[data-vibeui-block="date-013"] [data-part="value"]{
font-size:0.875rem;font-weight:600;color:var(--vibeui-date-013-fg);
font-variant-numeric:tabular-nums;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="date-013"] [data-part="value"][data-empty="true"]{color:var(--vibeui-date-013-muted);font-weight:500}
[data-vibeui-block="date-013"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-date-013-muted);
}
[data-vibeui-block="date-013"] [data-part="panel"]{
width:17.5rem;max-width:100%;padding:0.75rem;
border:1px solid var(--vibeui-date-013-border);border-radius:0.875rem;
background:var(--vibeui-date-013-panel);color:var(--vibeui-date-013-fg);
font-family:var(--vibeui-date-013-font);
box-shadow:0 18px 40px -22px var(--vibeui-date-013-shadow);
}
[data-vibeui-block="date-013"] [data-part="panel"]:not(:popover-open){display:none}
[data-vibeui-block="date-013"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
margin-bottom:0.375rem;
}
[data-vibeui-block="date-013"] [data-part="month"]{font-size:0.875rem;font-weight:650;color:var(--vibeui-date-013-fg)}
/* Заглавная только первая буква: capitalize поднимает и «г.» в «январь 2026 г.». */
[data-vibeui-block="date-013"] [data-part="month"]::first-letter{text-transform:uppercase}
[data-vibeui-block="date-013"] [data-part="nav"]{display:flex;gap:0.25rem;flex:none}
[data-vibeui-block="date-013"] [data-part="nav"] button{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;padding:0;
border:1px solid var(--vibeui-date-013-border);border-radius:0.5rem;
background:transparent;color:var(--vibeui-date-013-fg);
}
[data-vibeui-block="date-013"] [data-part="nav"] button:hover{background:var(--vibeui-date-013-hover)}
[data-vibeui-block="date-013"] [data-part="nav"] button:focus-visible{outline:2px solid var(--vibeui-date-013-accent);outline-offset:2px}
[data-vibeui-block="date-013"] [data-part="arrow"]{
width:0.375rem;height:0.375rem;
border-left:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg) translate(0.0625rem,-0.0625rem);
}
[data-vibeui-block="date-013"] [data-part="arrow"][data-dir="next"]{transform:rotate(-135deg) translate(0.0625rem,-0.0625rem)}
[data-vibeui-block="date-013"] table{width:100%;border-collapse:collapse;table-layout:fixed}
[data-vibeui-block="date-013"] th{
padding:0.25rem 0;font-size:0.6875rem;font-weight:600;
color:var(--vibeui-date-013-muted);text-transform:capitalize;
}
/* Ячейки без зазора: промежуток диапазона обязан читаться сплошной полосой,
   а не пунктиром из отдельных плашек. */
[data-vibeui-block="date-013"] td{padding:0;text-align:center}
[data-vibeui-block="date-013"] [data-part="day"]{
appearance:none;cursor:pointer;
display:flex;align-items:center;justify-content:center;
width:100%;height:2rem;padding:0;border:0;border-radius:0.5rem;
background:transparent;color:var(--vibeui-date-013-fg);
font:inherit;font-size:0.8125rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="date-013"] [data-part="day"]:hover{background:var(--vibeui-date-013-hover)}
[data-vibeui-block="date-013"] [data-part="day"]:focus-visible{outline:2px solid var(--vibeui-date-013-accent);outline-offset:-2px}
/* Дни соседних месяцев приглушены, но кликабельны: диапазон почти всегда
   пересекает границу месяца. */
[data-vibeui-block="date-013"] [data-part="day"][data-outside="true"]{color:var(--vibeui-date-013-muted);opacity:.6}
[data-vibeui-block="date-013"] [data-part="day"][data-today="true"]{box-shadow:inset 0 0 0 1px var(--vibeui-date-013-accent);font-weight:650}
[data-vibeui-block="date-013"] [data-part="day"][data-range="in"]{
background:var(--vibeui-date-013-soft);border-radius:0;opacity:1;
}
[data-vibeui-block="date-013"] [data-part="day"][data-range="start"],
[data-vibeui-block="date-013"] [data-part="day"][data-range="end"],
[data-vibeui-block="date-013"] [data-part="day"][data-range="only"]{
background:var(--vibeui-date-013-accent);color:oklch(from var(--vibeui-date-013-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-weight:650;opacity:1;
}
[data-vibeui-block="date-013"] [data-part="day"][data-range="start"]{border-radius:0.5rem 0 0 0.5rem}
[data-vibeui-block="date-013"] [data-part="day"][data-range="end"]{border-radius:0 0.5rem 0.5rem 0}
[data-vibeui-block="date-013"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
margin-top:0.5rem;font-size:0.8125rem;color:var(--vibeui-date-013-muted);
}
[data-vibeui-block="date-013"] [data-part="nights"]{min-inline-size:0}
[data-vibeui-block="date-013"] [data-part="count"]{color:var(--vibeui-date-013-fg);font-weight:650}
[data-vibeui-block="date-013"] [data-part="clear"]{
appearance:none;cursor:pointer;flex:none;
min-height:1.75rem;padding:0.125rem 0.5rem;
border:1px solid var(--vibeui-date-013-border);border-radius:0.5rem;
background:transparent;color:var(--vibeui-date-013-accent);
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="date-013"] [data-part="clear"]:hover{background:var(--vibeui-date-013-soft);border-color:var(--vibeui-date-013-accent)}
[data-vibeui-block="date-013"] [data-part="clear"]:focus-visible{outline:2px solid var(--vibeui-date-013-accent);outline-offset:2px}
@supports (anchor-name:--vibeui-date-013-a){
[data-vibeui-block="date-013"] [data-part="panel"]{
position:fixed;margin:0.375rem 0 0;
position-area:bottom span-left;
position-try-fallbacks:flip-block,flip-inline;
}
}
/* Раскрытый режим: панель стоит в потоке под полями, а не в верхнем слое. */
[data-vibeui-block="date-013"] [data-part="panel"][data-open="true"]{
display:block;position:static;opacity:1;transform:none;
width:100%;margin:0.5rem 0 0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="date-013"] *{animation:none!important;transition:none!important}}
`

const DAY = 86400000
const ISO = /^\d{4}-\d{2}-\d{2}$/

function iso(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

// Неделя с понедельника: getDay() отдаёт воскресенье нулём, и без сдвига
// сетка съезжает на день.
function mondayIndex(date: Date) {
  return (date.getDay() + 6) % 7
}

function buildGrid(year: number, month: number) {
  const first = new Date(year, month, 1)
  const start = new Date(first.getTime() - mondayIndex(first) * DAY)

  // Шесть строк всегда: месяц переменной высоты дёргает раскладку под собой.
  return Array.from(
    { length: 42 },
    (_, index) => new Date(start.getTime() + index * DAY),
  )
}

/** Русские склонения: 1 ночь, 2 ночи, 5 ночей. */
function plural(count: number, forms: Date013Nights) {
  const tens = count % 100
  const ones = count % 10

  if (ones === 1 && tens !== 11) {
    return forms.one
  }

  if (ones >= 2 && ones <= 4 && (tens < 12 || tens > 14)) {
    return forms.few
  }

  return forms.many
}

// Стрелки водят фокус по сетке. Без них до нужного дня приходится жать Tab
// столько раз, сколько до него дней: сорок две кнопки подряд в табуляции.
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
    event.currentTarget.querySelectorAll<HTMLButtonElement>(
      '[data-part="day"]',
    ),
  )
  const from = buttons.indexOf(document.activeElement as HTMLButtonElement)

  if (from < 0 || !buttons[from + step]) {
    return
  }

  event.preventDefault()
  buttons[from + step].focus()
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
  return ISO.test(value) &&
    !Number.isNaN(new Date(`${value}T00:00:00`).getTime())
    ? value
    : fallback
}

function safeLocale(value: string, fallback: string) {
  try {
    Intl.DateTimeFormat.supportedLocalesOf(value)
    return value
  } catch {
    return fallback
  }
}

const DEFAULT_NIGHTS: Date013Nights = {
  one: "{count} ночь",
  few: "{count} ночи",
  many: "{count} ночей",
}

/**
 * Два поля диапазона с одной месячной сеткой под ними.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Date013({
  open = false,
  legend = "Даты проживания",
  fromLabel = "Заезд",
  toLabel = "Выезд",
  defaultFrom: defaultFromProp = "2026-09-14",
  defaultTo: defaultToProp = "2026-09-21",
  name = "stay",
  locale: localeProp = "ru-RU",
  hint = "Первый клик ставит заезд, второй — выезд.",
  nightsText = DEFAULT_NIGHTS,
  emptyText = "не выбрано",
  clearLabel = "Сбросить",
  todayLabel = "сегодня",
  previousLabel = "Предыдущий месяц",
  nextLabel = "Следующий месяц",
  accent,
  background = "",
  className,
  style,
  ...props
}: Date013Props) {
  const defaultFrom = safeDate(defaultFromProp, "2026-09-14")
  const defaultTo = safeDate(defaultToProp, "2026-09-21")
  const locale = safeLocale(localeProp, "ru-RU")
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "")
  const panelId = `vibeui-date-013-${uid}`
  const anchorName = `--vibeui-date-013-${uid.slice(-8)}`
  const panel = useRef<HTMLDivElement>(null)

  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo > defaultFrom ? defaultTo : "")
  const [edge, setEdge] = useState<"from" | "to">("from")
  const [cursor, setCursor] = useState(() => {
    const [year, month] = defaultFrom.split("-").map(Number)
    return { year, month: month - 1 }
  })

  const days = useMemo(
    () => buildGrid(cursor.year, cursor.month),
    [cursor.month, cursor.year],
  )

  const titles = useMemo(() => {
    const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" })
    const month = new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
    })

    return {
      weekdays: days.slice(0, 7).map((date) => weekday.format(date)),
      month: month.format(new Date(cursor.year, cursor.month, 1)),
      full: new Intl.DateTimeFormat(locale, { dateStyle: "long" }),
      short: new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
      }),
    }
  }, [cursor.month, cursor.year, days, locale])

  const palette = {
    ...(accent ? { "--vibeui-date-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-date-013-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const today = iso(new Date())
  const stop = days.some((date) => iso(date) === from)
    ? from
    : iso(new Date(cursor.year, cursor.month, 1))

  // Даты в формате ГГГГ-ММ-ДД сравниваются как строки: при одинаковой длине
  // и порядке частей это корректно и не требует разбора.
  const nights =
    from && to
      ? Math.round(
          (new Date(`${to}T00:00:00`).getTime() -
            new Date(`${from}T00:00:00`).getTime()) /
            DAY,
        )
      : 0

  const shift = (delta: number) => {
    const next = new Date(cursor.year, cursor.month + delta, 1)
    setCursor({ year: next.getFullYear(), month: next.getMonth() })
  }

  const close = () => {
    if (panel.current?.matches(":popover-open")) {
      panel.current.hidePopover()
    }
  }

  // Первый клик ставит заезд и переводит правку на выезд; клик раньше заезда
  // не считается ошибкой — он просто переносит начало.
  const pick = (date: Date) => {
    const value = iso(date)

    if (edge === "from" || !from || (from && to)) {
      setFrom(value)
      setTo("")
      setEdge("to")
      return
    }

    if (value <= from) {
      setFrom(value)
      return
    }

    setTo(value)
    setEdge("from")
    close()
  }

  const show = (value: string) =>
    value ? titles.short.format(new Date(`${value}T00:00:00`)) : emptyText

  const rangeState = (value: string) => {
    if (!from) {
      return undefined
    }

    if (value === from) {
      return to ? "start" : "only"
    }

    if (!to) {
      return undefined
    }

    if (value === to) {
      return "end"
    }

    return value > from && value < to ? "in" : undefined
  }

  return (
    <>
      <style href="vibeui-date-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="date-selector"
        data-vibeui-block="date-013"
        className={className}
        style={palette}
      >
        <span data-part="legend" id={`${panelId}-legend`}>
          {legend}
        </span>

        <div
          data-part="fields"
          role="group"
          aria-labelledby={`${panelId}-legend`}
          style={{ anchorName } as CSSProperties}
        >
          <button
            type="button"
            data-part="field"
            popoverTarget={panelId}
            aria-pressed={edge === "from"}
            aria-haspopup="dialog"
            aria-controls={panelId}
            onClick={() => setEdge("from")}
          >
            <span data-part="caption">{fromLabel}</span>
            <span data-part="value" data-empty={!from}>
              {show(from)}
            </span>
          </button>

          <button
            type="button"
            data-part="field"
            popoverTarget={panelId}
            aria-pressed={edge === "to"}
            aria-haspopup="dialog"
            aria-controls={panelId}
            onClick={() => setEdge("to")}
          >
            <span data-part="caption">{toLabel}</span>
            <span data-part="value" data-empty={!to}>
              {show(to)}
            </span>
          </button>
        </div>

        <input type="hidden" name={`${name}-from`} value={from} />
        <input type="hidden" name={`${name}-to`} value={to} />

        {hint ? <p data-part="hint">{hint}</p> : null}

        <div
          ref={panel}
          id={panelId}
          data-part="panel"
          popover={open ? undefined : "auto"}
          data-open={open || undefined}
          role="dialog"
          aria-label={legend}
          style={{ positionAnchor: anchorName } as CSSProperties}
        >
          <div data-part="head">
            <span data-part="month">{titles.month}</span>
            <span data-part="nav">
              <button
                type="button"
                aria-label={previousLabel}
                onClick={() => shift(-1)}
              >
                <span data-part="arrow" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={nextLabel}
                onClick={() => shift(1)}
              >
                <span data-part="arrow" data-dir="next" aria-hidden="true" />
              </button>
            </span>
          </div>

          <table>
            <thead>
              <tr>
                {titles.weekdays.map((day) => (
                  <th key={day} scope="col" abbr={day}>
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody onKeyDown={(event) => moveFocus(event, 7)}>
              {Array.from({ length: 6 }, (_, row) => (
                <tr key={row}>
                  {days.slice(row * 7, row * 7 + 7).map((date) => {
                    const value = iso(date)
                    const state = rangeState(value)

                    return (
                      <td key={value}>
                        <button
                          type="button"
                          data-part="day"
                          tabIndex={value === stop ? 0 : -1}
                          aria-pressed={state !== undefined}
                          aria-label={
                            value === today
                              ? `${titles.full.format(date)}, ${todayLabel}`
                              : titles.full.format(date)
                          }
                          data-outside={date.getMonth() !== cursor.month}
                          data-today={value === today}
                          data-range={state}
                          onClick={() => pick(date)}
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

          <div data-part="foot">
            <span data-part="nights" aria-live="polite">
              {nights > 0 ? (
                <>
                  {plural(nights, nightsText).split("{count}")[0]}
                  <span data-part="count">{nights}</span>
                  {plural(nights, nightsText).split("{count}")[1] ?? ""}
                </>
              ) : (
                emptyText
              )}
            </span>
            <button
              type="button"
              data-part="clear"
              onClick={() => {
                setFrom("")
                setTo("")
                setEdge("from")
              }}
            >
              {clearLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

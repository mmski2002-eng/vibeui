"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Popover011Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  placeholder?: string
  defaultValue?: string
  onChange?: (value: string) => void
  accent?: string
  /** Сокращения дней недели, начиная с понедельника. */
  weekdays?: string[]
  /** Названия месяцев, начиная с января. */
  months?: string[]
  prevLabel?: string
  nextLabel?: string
  /** Доступная подпись панели. {label} подставляется. */
  panelHint?: string
  /** Подложка панели, поля и кнопок. Пусто — штатная палитра. */
  background?: string
}

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
]

function pad2(value: number) {
  return String(value).padStart(2, "0")
}

function toISO(year: number, month: number, day: number) {
  return `${year}-${pad2(month + 1)}-${pad2(day)}`
}

function toDisplay(iso: string) {
  const [year, month, day] = iso.split("-")
  return `${day}.${month}.${year}`
}

function todayParts() {
  const now = new Date()
  return { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() }
}

// Идея компонента: календарь открывается от поля, а не от иконки в углу —
// сама кнопка выглядит как поле формы, называет выбранную дату и открывает
// панель по нажатию. Панель управляется состоянием: Escape и клик вне
// закрывают её без выбора, а стрелки листают месяц без потери открытости.
// Панель лежит внутри контейнера с position:relative и не вылезает за
// карточку каталога.
const STYLES = `
:where([data-vibeui-block="popover-011"]){
--vibeui-popover-011-surface:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-popover-011-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.006 265));
--vibeui-popover-011-muted:light-dark(oklch(0.53 0.014 265),oklch(0.71 0.012 265));
--vibeui-popover-011-border:light-dark(oklch(0.89 0.006 265),oklch(0.36 0.012 265));
--vibeui-popover-011-accent:light-dark(oklch(0.53 0.18 268),oklch(0.73 0.16 268));
--vibeui-popover-011-on-accent:light-dark(oklch(1 0 0),oklch(0.17 0.03 268));
--vibeui-popover-011-shadow:light-dark(oklch(0.2 0.02 265 / 60%),oklch(0.02 0.01 265 / 72%));
--vibeui-popover-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="popover-011"]{
position:relative;display:inline-flex;flex-direction:column;gap:0.25rem;
font-family:var(--vibeui-popover-011-font);color:var(--vibeui-popover-011-fg);
}
[data-vibeui-block="popover-011"] [data-part="label"]{font-size:0.75rem;color:var(--vibeui-popover-011-muted)}
[data-vibeui-block="popover-011"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:space-between;gap:0.5rem;
width:12rem;height:2.375rem;padding:0 0.75rem;border-radius:0.625rem;
border:1px solid var(--vibeui-popover-011-border);
background:var(--vibeui-popover-011-surface);color:inherit;
font:inherit;font-size:0.8125rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="popover-011"] [data-part="trigger"] em{color:var(--vibeui-popover-011-muted);font-style:normal}
[data-vibeui-block="popover-011"] [data-part="trigger"]:hover{border-color:var(--vibeui-popover-011-accent)}
[data-vibeui-block="popover-011"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-popover-011-accent);outline-offset:2px}
[data-vibeui-block="popover-011"] [data-part="glyph"]{flex:none;color:var(--vibeui-popover-011-muted)}
[data-vibeui-block="popover-011"] [data-part="panel"]{
position:absolute;top:calc(100% + 0.375rem);left:0;z-index:20;
width:16.5rem;box-sizing:border-box;padding:0.75rem;
border:1px solid var(--vibeui-popover-011-border);border-radius:0.875rem;
background:var(--vibeui-popover-011-surface);color:inherit;
box-shadow:0 24px 50px -30px var(--vibeui-popover-011-shadow);
animation:vibeui-popover-011-in .14s ease both;
}
@keyframes vibeui-popover-011-in{from{opacity:0;translate:0 -0.25rem}to{opacity:1;translate:0 0}}
[data-vibeui-block="popover-011"] [data-part="nav"]{
display:flex;align-items:center;justify-content:space-between;margin:0 0 0.625rem;
}
[data-vibeui-block="popover-011"] [data-part="nav"] button{
appearance:none;cursor:pointer;
display:grid;place-items:center;width:1.75rem;height:1.75rem;
border:1px solid var(--vibeui-popover-011-border);border-radius:0.5rem;
background:var(--vibeui-popover-011-surface);color:inherit;font:inherit;
}
[data-vibeui-block="popover-011"] [data-part="nav"] button:hover{border-color:var(--vibeui-popover-011-accent)}
[data-vibeui-block="popover-011"] [data-part="nav"] button:focus-visible{outline:2px solid var(--vibeui-popover-011-accent);outline-offset:2px}
[data-vibeui-block="popover-011"] [data-part="month"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="popover-011"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(7,1fr);gap:0.125rem;
}
[data-vibeui-block="popover-011"] [data-part="weekday"]{
display:grid;place-items:center;height:1.5rem;
font-size:0.6875rem;font-weight:650;color:var(--vibeui-popover-011-muted);
}
[data-vibeui-block="popover-011"] [data-part="day"]{
appearance:none;cursor:pointer;
display:grid;place-items:center;height:2rem;border-radius:0.5rem;
border:1px solid transparent;background:none;color:inherit;
font:inherit;font-size:0.75rem;font-variant-numeric:tabular-nums;
transition:background-color .16s ease,border-color .16s ease,color .16s ease;
}
[data-vibeui-block="popover-011"] [data-part="day"]:hover{border-color:var(--vibeui-popover-011-accent)}
[data-vibeui-block="popover-011"] [data-part="day"]:focus-visible{outline:2px solid var(--vibeui-popover-011-accent);outline-offset:2px}
[data-vibeui-block="popover-011"] [data-part="day"][data-today="true"]{border-color:var(--vibeui-popover-011-border)}
[data-vibeui-block="popover-011"] [data-part="day"][aria-pressed="true"]{
background:var(--vibeui-popover-011-accent);border-color:var(--vibeui-popover-011-accent);color:var(--vibeui-popover-011-on-accent);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="popover-011"] *{animation:none!important;transition:none!important}
}
`

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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
 * Поповер выбора даты от поля: кнопка-поле открывает панель с календарём,
 * выбор дня закрывает панель и возвращает фокус на поле. Один файл, ноль
 * зависимостей, собственная палитра.
 */
export function Popover011({
  label = "Дата встречи",
  placeholder = "Выберите дату",
  defaultValue,
  onChange,
  accent,
  weekdays = WEEKDAYS,
  months = MONTHS,
  prevLabel = "Предыдущий месяц",
  nextLabel = "Следующий месяц",
  panelHint = "{label}: выбор даты",
  background = "",
  className,
  style,
  ...props
}: Popover011Props) {
  const id = useId().replace(/:/g, "")
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(defaultValue ?? "")
  const today = todayParts()
  const [view, setView] = useState(() => {
    if (defaultValue) {
      const [year, month] = defaultValue.split("-").map(Number)
      return { year, month: month - 1 }
    }
    return { year: today.year, month: today.month }
  })
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-popover-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-popover-011-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const close = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close()
    }

    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [open])

  const shiftMonth = (delta: number) => {
    const next = new Date(view.year, view.month + delta, 1)
    setView({ year: next.getFullYear(), month: next.getMonth() })
  }

  const pick = (day: number) => {
    const iso = toISO(view.year, view.month, day)
    setSelected(iso)
    onChange?.(iso)
    close()
  }

  const leadingBlanks = (new Date(view.year, view.month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()

  return (
    <>
      <style href="vibeui-popover-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={rootRef}
        data-vibeui-block="popover-011"
        className={className}
        style={palette}
      >
        <span data-part="label" id={`${id}-label`}>
          {label}
        </span>
        <button
          ref={triggerRef}
          type="button"
          data-part="trigger"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          aria-labelledby={`${id}-label`}
          onClick={() => setOpen((current) => !current)}
        >
          {selected ? toDisplay(selected) : <em>{placeholder}</em>}
          <svg
            data-part="glyph"
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <rect
              x="3"
              y="5"
              width="18"
              height="16"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M3 9h18M8 3v4M16 3v4"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
        </button>

        {open ? (
          <div
            id={`${id}-panel`}
            data-part="panel"
            role="dialog"
            aria-label={panelHint.replace("{label}", label)}
          >
            <div data-part="nav">
              <button
                type="button"
                aria-label={prevLabel}
                onClick={() => shiftMonth(-1)}
              >
                ‹
              </button>
              <span data-part="month" aria-live="polite">
                {months[view.month]} {view.year}
              </span>
              <button
                type="button"
                aria-label={nextLabel}
                onClick={() => shiftMonth(1)}
              >
                ›
              </button>
            </div>
            <div data-part="grid">
              {weekdays.map((weekday) => (
                <span key={weekday} data-part="weekday" aria-hidden="true">
                  {weekday}
                </span>
              ))}
              {Array.from({ length: leadingBlanks }).map((_, index) => (
                <span key={`blank-${index}`} aria-hidden="true" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1
                const iso = toISO(view.year, view.month, day)
                const isToday =
                  view.year === today.year &&
                  view.month === today.month &&
                  day === today.day
                return (
                  <button
                    key={iso}
                    type="button"
                    data-part="day"
                    data-today={isToday}
                    aria-pressed={selected === iso}
                    aria-current={isToday ? "date" : undefined}
                    aria-label={toDisplay(iso)}
                    onClick={() => pick(day)}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}

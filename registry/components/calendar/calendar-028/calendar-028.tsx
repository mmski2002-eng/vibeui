"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Calendar028Busy = { from: number; to: number; who: string }

export type Calendar028Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  heading?: string
  date?: string
  openFrom?: number
  openTo?: number
  busy?: Calendar028Busy[]
  locale?: string
  onBook?: (from: number, to: number) => void
  accent?: string
}

// Идея компонента: переговорку берут не «на слот», а «с десяти до двенадцати».
// Поэтому час здесь не кнопка выбора, а край интервала: первое нажатие ставит
// начало, второе — конец. Занятые часы подписаны владельцем и не выбираются,
// а попытка перепрыгнуть через чужую бронь ловится отдельным сообщением.
const STYLES = `
:where([data-vibeui-block="calendar-028"]){
--vibeui-calendar-028-bg:oklch(1 0 0);
--vibeui-calendar-028-fg:oklch(0.23 0.014 200);
--vibeui-calendar-028-muted:oklch(0.57 0.014 200);
--vibeui-calendar-028-border:oklch(0.91 0.008 200);
--vibeui-calendar-028-soft:oklch(0.97 0.006 200);
--vibeui-calendar-028-busy:oklch(0.94 0.02 25);
--vibeui-calendar-028-busyfg:oklch(0.48 0.1 25);
--vibeui-calendar-028-accent:oklch(0.5 0.11 200);
--vibeui-calendar-028-accentsoft:oklch(0.93 0.05 200);
--vibeui-calendar-028-radius:0.7rem;
--vibeui-calendar-028-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="calendar-028"]{
display:flex;flex-direction:column;gap:0.7rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:1rem;
background:var(--vibeui-calendar-028-bg);
border:1px solid var(--vibeui-calendar-028-border);
border-radius:calc(var(--vibeui-calendar-028-radius) + 0.25rem);
color:var(--vibeui-calendar-028-fg);
font-family:var(--vibeui-calendar-028-font);
}
[data-vibeui-block="calendar-028"] [data-part="title"]{
margin:0;font-size:0.95rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="calendar-028"] [data-part="when"]{
margin:0.15rem 0 0;font-size:0.75rem;color:var(--vibeui-calendar-028-muted);
}
[data-vibeui-block="calendar-028"] [data-part="hours"]{
display:flex;flex-direction:column;gap:0.2rem;margin:0;padding:0;list-style:none;
max-height:16rem;overflow:auto;
}
[data-vibeui-block="calendar-028"] [data-part="hour"]{
appearance:none;font:inherit;width:100%;cursor:pointer;
display:grid;grid-template-columns:3.4rem 1fr;align-items:center;gap:0.5rem;
box-sizing:border-box;padding:0.45rem 0.6rem;
border:1px solid transparent;border-radius:0.55rem;
background:var(--vibeui-calendar-028-soft);
color:inherit;text-align:left;font-size:0.8125rem;
font-variant-numeric:tabular-nums;
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="calendar-028"] [data-part="hour"]:hover:not(:disabled){
border-color:var(--vibeui-calendar-028-accent);
}
[data-vibeui-block="calendar-028"] [data-part="hour"]:focus-visible{
outline:2px solid var(--vibeui-calendar-028-accent);outline-offset:2px;
}
[data-vibeui-block="calendar-028"] [data-part="hour"]:disabled{
cursor:not-allowed;background:var(--vibeui-calendar-028-busy);
color:var(--vibeui-calendar-028-busyfg);
}
[data-vibeui-block="calendar-028"] [data-part="hour"][data-picked="true"]{
background:var(--vibeui-calendar-028-accentsoft);
border-color:var(--vibeui-calendar-028-accent);
}
[data-vibeui-block="calendar-028"] [data-part="clock"]{font-weight:700}
[data-vibeui-block="calendar-028"] [data-part="who"]{
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
color:var(--vibeui-calendar-028-muted);
}
[data-vibeui-block="calendar-028"] [data-part="hour"]:disabled [data-part="who"]{color:inherit}
[data-vibeui-block="calendar-028"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding-top:0.6rem;border-top:1px solid var(--vibeui-calendar-028-border);
}
[data-vibeui-block="calendar-028"] [data-part="note"]{
margin:0;font-size:0.8125rem;color:var(--vibeui-calendar-028-muted);
}
[data-vibeui-block="calendar-028"] [data-part="note"] b{color:var(--vibeui-calendar-028-fg)}
[data-vibeui-block="calendar-028"] [data-part="note"][data-bad="true"]{color:var(--vibeui-calendar-028-busyfg)}
[data-vibeui-block="calendar-028"] [data-part="book"]{
appearance:none;cursor:pointer;font:inherit;flex:none;
padding:0.45rem 0.85rem;border:0;border-radius:0.55rem;
background:var(--vibeui-calendar-028-accent);color:var(--vibeui-calendar-028-bg);
font-size:0.8125rem;font-weight:600;
transition:opacity .16s ease;
}
[data-vibeui-block="calendar-028"] [data-part="book"]:disabled{cursor:not-allowed;opacity:.45}
[data-vibeui-block="calendar-028"] [data-part="book"]:focus-visible{
outline:2px solid var(--vibeui-calendar-028-accent);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-028"] *{animation:none!important;transition:none!important}}
`

const BUSY: Calendar028Busy[] = [
  { from: 9, to: 10, who: "Планёрка команды" },
  { from: 13, to: 15, who: "Демо для заказчика" },
  { from: 18, to: 19, who: "Ретро" },
]

function clock(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`
}

function pluralize(count: number, forms: [string, string, string]) {
  const tens = count % 100
  const ones = count % 10

  if (tens > 10 && tens < 20) return forms[2]
  if (ones === 1) return forms[0]
  if (ones > 1 && ones < 5) return forms[1]

  return forms[2]
}

/**
 * Доступность переговорки по часам: интервал набирается двумя нажатиями.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar028({
  heading = "Переговорная «Север»",
  date = "2026-04-15",
  openFrom = 8,
  openTo = 20,
  busy = BUSY,
  locale = "ru-RU",
  onBook,
  accent,
  className,
  style,
  ...props
}: Calendar028Props) {
  const [start, setStart] = useState<number | null>(10)
  const [end, setEnd] = useState<number | null>(12)
  const [error, setError] = useState("")

  const hours = Array.from(
    { length: Math.max(0, openTo - openFrom) },
    (_, step) => openFrom + step,
  )

  const owner = (hour: number) =>
    busy.find((slot) => hour >= slot.from && hour < slot.to)?.who ?? ""

  const pick = (hour: number) => {
    setError("")

    if (start === null || end !== null || hour < start) {
      setStart(hour)
      setEnd(null)

      return
    }

    for (let step = start; step <= hour; step += 1) {
      if (owner(step)) {
        setError("В интервале есть чужая бронь")

        return
      }
    }

    setEnd(hour + 1)
    onBook?.(start, hour + 1)
  }

  const picked = (hour: number) =>
    start !== null &&
    (end === null ? hour === start : hour >= start && hour < end)

  const length = start !== null && end !== null ? end - start : 0

  const heading2 = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${date}T12:00:00`))

  const palette = {
    ...(accent ? { "--vibeui-calendar-028-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-028" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="calendar-028"
        className={className}
        style={palette}
      >
        <header>
          <h3 data-part="title">{heading}</h3>
          <p data-part="when">{heading2}</p>
        </header>
        <ul data-part="hours">
          {hours.map((hour) => {
            const taken = owner(hour)

            return (
              <li key={hour}>
                <button
                  type="button"
                  data-part="hour"
                  data-picked={picked(hour)}
                  disabled={Boolean(taken)}
                  aria-label={
                    taken
                      ? `${clock(hour)} занято: ${taken}`
                      : `${clock(hour)} свободно`
                  }
                  onClick={() => pick(hour)}
                >
                  <span data-part="clock">{clock(hour)}</span>
                  <span data-part="who">{taken || "свободно"}</span>
                </button>
              </li>
            )
          })}
        </ul>
        <div data-part="foot">
          <p data-part="note" data-bad={Boolean(error)} aria-live="polite">
            {error ? (
              error
            ) : length > 0 ? (
              <>
                <b>
                  {clock(start ?? 0)}—{clock(end ?? 0)}
                </b>
                , {length} {pluralize(length, ["час", "часа", "часов"])}
              </>
            ) : start !== null ? (
              <>Начало {clock(start)}: выберите последний час</>
            ) : (
              "Выберите первый свободный час"
            )}
          </p>
          <button
            type="button"
            data-part="book"
            disabled={length === 0}
            onClick={() => {
              setStart(null)
              setEnd(null)
              setError("")
            }}
          >
            Забронировать
          </button>
        </div>
      </section>
    </>
  )
}

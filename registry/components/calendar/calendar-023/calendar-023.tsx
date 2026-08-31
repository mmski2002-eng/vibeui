"use client"

import { useMemo, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Calendar023Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onSelect"
> & {
  date?: string
  homeZone?: string
  awayZone?: string
  homeLabel?: string
  awayLabel?: string
  /** Границы рабочего дня в обоих городах, в часах. */
  officeFrom?: number
  officeTo?: number
  locale?: string
  defaultHour?: number
  onSelect?: (hour: number) => void
  accent?: string
}

// Идея компонента: созвон с другим городом срывается не из-за календаря,
// а из-за арифметики часовых поясов в голове. Поэтому слот здесь — это
// сразу две подписи времени, а строки вне чужого рабочего дня помечены:
// решение принимают глазами, не считая разницу.
const STYLES = `
:where([data-vibeui-block="calendar-023"]){
--vibeui-calendar-023-bg:oklch(1 0 0);
--vibeui-calendar-023-fg:oklch(0.23 0.014 285);
--vibeui-calendar-023-muted:oklch(0.57 0.014 285);
--vibeui-calendar-023-border:oklch(0.91 0.006 285);
--vibeui-calendar-023-soft:oklch(0.97 0.006 285);
--vibeui-calendar-023-accent:oklch(0.5 0.14 285);
--vibeui-calendar-023-accentsoft:oklch(0.95 0.04 285);
--vibeui-calendar-023-warn:oklch(0.58 0.13 55);
--vibeui-calendar-023-radius:0.75rem;
--vibeui-calendar-023-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="calendar-023"]{
display:flex;flex-direction:column;gap:0.7rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:1rem;
background:var(--vibeui-calendar-023-bg);
border:1px solid var(--vibeui-calendar-023-border);
border-radius:calc(var(--vibeui-calendar-023-radius) + 0.25rem);
color:var(--vibeui-calendar-023-fg);
font-family:var(--vibeui-calendar-023-font);
}
[data-vibeui-block="calendar-023"] [data-part="title"]{
margin:0;font-size:0.95rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="calendar-023"] [data-part="when"]{
margin:0.15rem 0 0;font-size:0.75rem;color:var(--vibeui-calendar-023-muted);
}
[data-vibeui-block="calendar-023"] [data-part="cols"]{
display:grid;grid-template-columns:1fr 1.2rem 1fr;align-items:center;gap:0.4rem;
font-size:0.7rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-calendar-023-muted);
}
[data-vibeui-block="calendar-023"] [data-part="cols"] span:last-child{text-align:right}
[data-vibeui-block="calendar-023"] [data-part="list"]{
display:flex;flex-direction:column;gap:0.3rem;margin:0;padding:0;list-style:none;
max-height:15rem;overflow:auto;
}
[data-vibeui-block="calendar-023"] [data-part="slot"]{
appearance:none;cursor:pointer;font:inherit;width:100%;
display:grid;grid-template-columns:1fr 1.2rem 1fr;align-items:center;gap:0.4rem;
box-sizing:border-box;padding:0.5rem 0.6rem;
border:1px solid var(--vibeui-calendar-023-border);
border-radius:0.6rem;
background:var(--vibeui-calendar-023-soft);
color:inherit;text-align:left;
font-variant-numeric:tabular-nums;
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="calendar-023"] [data-part="slot"]:hover{border-color:var(--vibeui-calendar-023-accent)}
[data-vibeui-block="calendar-023"] [data-part="slot"]:focus-visible{
outline:2px solid var(--vibeui-calendar-023-accent);outline-offset:2px;
}
[data-vibeui-block="calendar-023"] [data-part="slot"][aria-pressed="true"]{
background:var(--vibeui-calendar-023-accentsoft);
border-color:var(--vibeui-calendar-023-accent);
}
[data-vibeui-block="calendar-023"] [data-part="home"]{font-size:0.9rem;font-weight:700}
[data-vibeui-block="calendar-023"] [data-part="arrow"]{
text-align:center;color:var(--vibeui-calendar-023-muted);font-size:0.8rem;
}
[data-vibeui-block="calendar-023"] [data-part="away"]{
text-align:right;font-size:0.9rem;font-weight:600;color:var(--vibeui-calendar-023-muted);
}
[data-vibeui-block="calendar-023"] [data-part="slot"][data-offhours="true"] [data-part="away"]{
color:var(--vibeui-calendar-023-warn);
}
[data-vibeui-block="calendar-023"] [data-part="slot"][data-offhours="true"] [data-part="away"]::after{
content:" вне часов";font-size:0.65rem;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;
}
[data-vibeui-block="calendar-023"] [data-part="foot"]{
margin:0;padding-top:0.6rem;border-top:1px solid var(--vibeui-calendar-023-border);
font-size:0.8125rem;color:var(--vibeui-calendar-023-muted);
}
[data-vibeui-block="calendar-023"] [data-part="foot"] b{color:var(--vibeui-calendar-023-fg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-023"] *{animation:none!important;transition:none!important}}
`

/** Смещение зоны в минутах для конкретного момента: считаем через Intl. */
function zoneOffset(zone: string, instant: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(instant)

  const read = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value ?? "0")

  const local = Date.UTC(
    read("year"),
    read("month") - 1,
    read("day"),
    read("hour") % 24,
    read("minute"),
  )

  return (local - instant.getTime()) / 60000
}

/**
 * Момент, в который в зоне zone наступает указанное локальное время.
 * Второй проход нужен ради дней перехода на летнее время.
 */
function instantOf(zone: string, date: string, hour: number) {
  const [year, month, day] = date.split("-").map(Number)
  const naive = Date.UTC(year, month - 1, day, hour)
  const first = new Date(naive - zoneOffset(zone, new Date(naive)) * 60000)

  return new Date(naive - zoneOffset(zone, first) * 60000)
}

function cityOf(zone: string) {
  return (zone.split("/").pop() ?? zone).replace(/_/g, " ")
}

/**
 * Выбор слота созвона с двумя часовыми поясами в одной строке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar023({
  date = "2026-04-15",
  homeZone = "Europe/Moscow",
  awayZone = "America/New_York",
  homeLabel,
  awayLabel,
  officeFrom = 9,
  officeTo = 19,
  locale = "ru-RU",
  defaultHour = 17,
  onSelect,
  accent,
  className,
  style,
  ...props
}: Calendar023Props) {
  const [hour, setHour] = useState(defaultHour)

  const clock = useMemo(
    () => ({
      home: new Intl.DateTimeFormat(locale, {
        timeZone: homeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      away: new Intl.DateTimeFormat(locale, {
        timeZone: awayZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      awayHour: new Intl.DateTimeFormat("en-US", {
        timeZone: awayZone,
        hour: "2-digit",
        hour12: false,
      }),
      awayDay: new Intl.DateTimeFormat(locale, {
        timeZone: awayZone,
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
    }),
    [locale, homeZone, awayZone],
  )

  const slots = useMemo(
    () =>
      Array.from({ length: officeTo - officeFrom }, (_, step) => {
        const value = officeFrom + step
        const instant = instantOf(homeZone, date, value)
        const away = Number(clock.awayHour.format(instant).replace(/\D/g, ""))

        return {
          value,
          instant,
          home: clock.home.format(instant),
          away: clock.away.format(instant),
          offhours: away < officeFrom || away >= officeTo,
        }
      }),
    [officeFrom, officeTo, homeZone, date, clock],
  )

  const picked = slots.find((slot) => slot.value === hour)

  const heading = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${date}T12:00:00`))

  const palette = {
    ...(accent ? { "--vibeui-calendar-023-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-023" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="calendar-023"
        className={className}
        style={palette}
      >
        <header>
          <h3 data-part="title">Слот созвона</h3>
          <p data-part="when">{heading}</p>
        </header>
        <div data-part="cols" aria-hidden="true">
          <span>{homeLabel ?? cityOf(homeZone)}</span>
          <span />
          <span>{awayLabel ?? cityOf(awayZone)}</span>
        </div>
        <ul data-part="list">
          {slots.map((slot) => (
            <li key={slot.value}>
              <button
                type="button"
                data-part="slot"
                data-offhours={slot.offhours}
                aria-pressed={slot.value === hour}
                onClick={() => {
                  setHour(slot.value)
                  onSelect?.(slot.value)
                }}
              >
                <span data-part="home">{slot.home}</span>
                <span data-part="arrow" aria-hidden="true">
                  →
                </span>
                <span data-part="away">{slot.away}</span>
              </button>
            </li>
          ))}
        </ul>
        <p data-part="foot" aria-live="polite">
          {picked ? (
            <>
              <b>{picked.home}</b> в городе {homeLabel ?? cityOf(homeZone)} —
              это <b>{picked.away}</b>, {clock.awayDay.format(picked.instant)} в
              городе {awayLabel ?? cityOf(awayZone)}
            </>
          ) : (
            "Слот не выбран"
          )}
        </p>
      </section>
    </>
  )
}

"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Calendar027Preset =
  "today" | "yesterday" | "7d" | "30d" | "month" | "prevMonth" | "custom"

export type Calendar027Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onChange"
> & {
  label?: string
  /** Опорный «сегодня»: пресеты считаются от него, а не от Date.now(). */
  today?: string
  defaultPreset?: Calendar027Preset
  locale?: string
  onChange?: (from: string, to: string, preset: Calendar027Preset) => void
  accent?: string
}

// Идея компонента: в отчётах девять запросов из десяти — это «последние
// 7 дней» или «прошлый месяц». Поэтому наверху пресеты одним нажатием,
// а два поля ниже показывают, во что пресет развернулся, и остаются
// редактируемыми: ручная правка просто переводит выбор в «свой период».
const STYLES = `
:where([data-vibeui-block="calendar-027"]){
--vibeui-calendar-027-bg:oklch(1 0 0);
--vibeui-calendar-027-fg:oklch(0.23 0.014 230);
--vibeui-calendar-027-muted:oklch(0.56 0.014 230);
--vibeui-calendar-027-border:oklch(0.91 0.008 230);
--vibeui-calendar-027-field:oklch(0.985 0.004 230);
--vibeui-calendar-027-accent:oklch(0.5 0.12 230);
--vibeui-calendar-027-accentsoft:oklch(0.95 0.04 230);
--vibeui-calendar-027-radius:0.625rem;
--vibeui-calendar-027-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="calendar-027"]{
display:flex;flex-direction:column;gap:0.7rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:1rem;
background:var(--vibeui-calendar-027-bg);
border:1px solid var(--vibeui-calendar-027-border);
border-radius:calc(var(--vibeui-calendar-027-radius) + 0.3rem);
color:var(--vibeui-calendar-027-fg);
font-family:var(--vibeui-calendar-027-font);
}
[data-vibeui-block="calendar-027"] [data-part="title"]{
margin:0;font-size:0.95rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="calendar-027"] [data-part="presets"]{
display:flex;flex-wrap:wrap;gap:0.3rem;
}
[data-vibeui-block="calendar-027"] [data-part="preset"]{
appearance:none;cursor:pointer;font:inherit;
padding:0.3rem 0.65rem;border-radius:999px;
border:1px solid var(--vibeui-calendar-027-border);
background:var(--vibeui-calendar-027-field);
color:var(--vibeui-calendar-027-muted);
font-size:0.75rem;font-weight:600;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="calendar-027"] [data-part="preset"]:hover{
border-color:var(--vibeui-calendar-027-accent);color:var(--vibeui-calendar-027-fg);
}
[data-vibeui-block="calendar-027"] [data-part="preset"]:focus-visible{
outline:2px solid var(--vibeui-calendar-027-accent);outline-offset:2px;
}
[data-vibeui-block="calendar-027"] [data-part="preset"][aria-pressed="true"]{
background:var(--vibeui-calendar-027-accent);border-color:transparent;
color:var(--vibeui-calendar-027-bg);
}
[data-vibeui-block="calendar-027"] [data-part="fields"]{
display:grid;grid-template-columns:1fr 1fr;gap:0.4rem;
}
[data-vibeui-block="calendar-027"] [data-part="cell"]{display:flex;flex-direction:column;gap:0.2rem;min-width:0}
[data-vibeui-block="calendar-027"] [data-part="cell"] label{
font-size:0.7rem;font-weight:600;letter-spacing:0.03em;text-transform:uppercase;
color:var(--vibeui-calendar-027-muted);
}
[data-vibeui-block="calendar-027"] input{
box-sizing:border-box;width:100%;height:2.35rem;padding:0 0.5rem;
border:1px solid var(--vibeui-calendar-027-border);
border-radius:var(--vibeui-calendar-027-radius);
background:var(--vibeui-calendar-027-field);
color:inherit;font:inherit;font-size:0.875rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-027"] input:focus-visible{
outline:2px solid var(--vibeui-calendar-027-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="calendar-027"] [data-part="summary"]{
margin:0;padding:0.5rem 0.7rem;border-radius:var(--vibeui-calendar-027-radius);
background:var(--vibeui-calendar-027-accentsoft);
font-size:0.8125rem;line-height:1.35;
}
[data-vibeui-block="calendar-027"] [data-part="summary"] b{font-variant-numeric:tabular-nums}
[data-vibeui-block="calendar-027"] [data-part="summary"][data-bad="true"]{
background:var(--vibeui-calendar-027-field);color:var(--vibeui-calendar-027-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-027"] *{animation:none!important;transition:none!important}}
`

const DAY = 86400000

const TITLES: Record<Exclude<Calendar027Preset, "custom">, string> = {
  today: "Сегодня",
  yesterday: "Вчера",
  "7d": "Последние 7 дней",
  "30d": "Последние 30 дней",
  month: "Этот месяц",
  prevMonth: "Прошлый месяц",
}

function stamp(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

/** Разворачивает пресет в пару дат от опорного «сегодня». */
function resolve(preset: Calendar027Preset, today: string) {
  const now = new Date(`${today}T00:00:00`)
  const shifted = (days: number) => new Date(now.getTime() + days * DAY)

  if (preset === "today") return { from: stamp(now), to: stamp(now) }
  if (preset === "yesterday") {
    return { from: stamp(shifted(-1)), to: stamp(shifted(-1)) }
  }
  if (preset === "7d") return { from: stamp(shifted(-6)), to: stamp(now) }
  if (preset === "30d") return { from: stamp(shifted(-29)), to: stamp(now) }
  if (preset === "month") {
    return {
      from: stamp(new Date(now.getFullYear(), now.getMonth(), 1)),
      to: stamp(now),
    }
  }

  return {
    from: stamp(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
    to: stamp(new Date(now.getFullYear(), now.getMonth(), 0)),
  }
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
 * Выбор периода: пресеты сверху, два поля дат снизу, итог в днях.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar027({
  label = "Период отчёта",
  today = "2026-04-15",
  defaultPreset = "7d",
  locale = "ru-RU",
  onChange,
  accent,
  className,
  style,
  ...props
}: Calendar027Props) {
  const id = useId()
  const initial = resolve(
    defaultPreset === "custom" ? "7d" : defaultPreset,
    today,
  )
  const [preset, setPreset] = useState<Calendar027Preset>(defaultPreset)
  const [from, setFrom] = useState(initial.from)
  const [to, setTo] = useState(initial.to)

  const apply = (next: Calendar027Preset) => {
    const range = resolve(next, today)

    setPreset(next)
    setFrom(range.from)
    setTo(range.to)
    onChange?.(range.from, range.to, next)
  }

  const edit = (edge: "from" | "to", value: string) => {
    const range = { from, to, [edge]: value }

    if (edge === "from") setFrom(value)
    else setTo(value)

    setPreset("custom")
    onChange?.(range.from, range.to, "custom")
  }

  const days =
    from && to
      ? Math.round(
          (new Date(`${to}T00:00:00`).getTime() -
            new Date(`${from}T00:00:00`).getTime()) /
            DAY,
        ) + 1
      : 0

  const span = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
  })

  const palette = {
    ...(accent ? { "--vibeui-calendar-027-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-027" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="calendar-027"
        className={className}
        style={palette}
      >
        <h3 data-part="title">{label}</h3>
        <div data-part="presets" role="group" aria-label="Быстрые периоды">
          {(Object.keys(TITLES) as (keyof typeof TITLES)[]).map((key) => (
            <button
              key={key}
              type="button"
              data-part="preset"
              aria-pressed={preset === key}
              onClick={() => apply(key)}
            >
              {TITLES[key]}
            </button>
          ))}
        </div>
        <div data-part="fields">
          <div data-part="cell">
            <label htmlFor={`${id}-from`}>С</label>
            <input
              id={`${id}-from`}
              type="date"
              value={from}
              max={to || undefined}
              onChange={(event) => edit("from", event.target.value)}
            />
          </div>
          <div data-part="cell">
            <label htmlFor={`${id}-to`}>По</label>
            <input
              id={`${id}-to`}
              type="date"
              value={to}
              min={from || undefined}
              onChange={(event) => edit("to", event.target.value)}
            />
          </div>
        </div>
        <p data-part="summary" data-bad={days <= 0} aria-live="polite">
          {days > 0 ? (
            <>
              {span.format(new Date(`${from}T00:00:00`))} —{" "}
              {span.format(new Date(`${to}T00:00:00`))}, <b>{days}</b>{" "}
              {pluralize(days, ["день", "дня", "дней"])}
              {preset === "custom" ? " (свой период)" : ""}
            </>
          ) : (
            "Конец периода раньше начала"
          )}
        </p>
      </section>
    </>
  )
}

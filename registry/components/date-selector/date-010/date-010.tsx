"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Date010Preset = {
  id: string
  label: string
  /** Сколько дней назад от сегодня начинается диапазон. */
  days?: number
  /** Особый пресет: текущий месяц целиком. */
  thisMonth?: boolean
}

export type Date010Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  fromLabel?: string
  toLabel?: string
  presets?: Date010Preset[]
  /** Стартовый диапазон в формате ГГГГ-ММ-ДД. Пусто — поля пустые. */
  defaultFrom?: string
  defaultTo?: string
  /** id подсвеченного пресета на старте. */
  defaultPreset?: string
  /** Подпись длительности. {days} подставляется. */
  lengthTemplate?: string
  hint?: string
  accent?: string
  /** Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: диапазон, который в девяти случаях из десяти выбирают
// пресетом, а не двумя датами. «Последние тридцать дней» человек думает
// словами, и заставлять его считать, какое число было тридцать дней назад, —
// работа не по адресу. Поля при этом остаются: нестандартный отрезок никакой
// набор кнопок не покроет. Выбранный пресет подсвечен, но перестаёт быть
// выбранным, как только даты правят руками: показывать «последние 7 дней» на
// произвольном диапазоне — врать.
const STYLES = `
:where([data-vibeui-block="date-010"]){
--vibeui-date-010-bg:transparent;
--vibeui-date-010-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-date-010-muted:color-mix(in oklab,var(--vibeui-date-010-fg) 62%,transparent);
--vibeui-date-010-border:light-dark(oklch(0.86 0 265),oklch(0.38 0 265));
--vibeui-date-010-field:light-dark(oklch(1 0 0),oklch(1 0 0 / 6%));
--vibeui-date-010-hover:light-dark(oklch(0 0 0 / 5%),oklch(1 0 0 / 7%));
--vibeui-date-010-accent:light-dark(oklch(0.5 0.16 265),oklch(0.78 0.12 265));
--vibeui-date-010-soft:color-mix(in oklab,var(--vibeui-date-010-accent) 14%,transparent);
--vibeui-date-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="date-010"]{color-scheme:dark}
[data-vibeui-block="date-010"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;
font-family:var(--vibeui-date-010-font);color:var(--vibeui-date-010-fg);
}
[data-vibeui-block="date-010"] *{box-sizing:border-box}
[data-vibeui-block="date-010"] [data-part="label"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="date-010"] [data-part="presets"]{
display:flex;flex-wrap:wrap;gap:0.25rem;
}
[data-vibeui-block="date-010"] [data-part="preset"]{
appearance:none;cursor:pointer;
min-height:1.875rem;padding:0.25rem 0.625rem;border-radius:999px;
border:1px solid var(--vibeui-date-010-border);
background:transparent;color:inherit;
font:inherit;font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="date-010"] [data-part="preset"]:hover{background:var(--vibeui-date-010-hover)}
/* Выбранный пресет подсвечен, но слетает при правке дат руками: показывать
   «последние 7 дней» на произвольном отрезке — врать. */
[data-vibeui-block="date-010"] [data-part="preset"][aria-pressed="true"]{
background:var(--vibeui-date-010-soft);
border-color:var(--vibeui-date-010-accent);
}
[data-vibeui-block="date-010"] [data-part="fields"]{
display:flex;flex-wrap:wrap;gap:0.5rem;
}
[data-vibeui-block="date-010"] [data-part="field"]{
flex:1;min-width:8.5rem;display:flex;flex-direction:column;gap:0.1875rem;
}
[data-vibeui-block="date-010"] [data-part="caption"]{
font-size:0.75rem;color:var(--vibeui-date-010-muted);
}
[data-vibeui-block="date-010"] input{
width:100%;min-height:2.5rem;padding:0.4375rem 0.625rem;
border:1px solid var(--vibeui-date-010-border);border-radius:0.625rem;
background:var(--vibeui-date-010-field);color:inherit;
font:inherit;font-size:0.9375rem;
}
[data-vibeui-block="date-010"] input:focus-visible,
[data-vibeui-block="date-010"] [data-part="preset"]:focus-visible{
outline:2px solid var(--vibeui-date-010-accent);outline-offset:1px;
}
[data-vibeui-block="date-010"] [data-part="length"]{
margin:0;font-size:0.8125rem;color:var(--vibeui-date-010-muted);
}
[data-vibeui-block="date-010"] [data-part="count"]{color:var(--vibeui-date-010-fg);font-weight:600}
[data-vibeui-block="date-010"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-date-010-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="date-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PRESETS: Date010Preset[] = [
  { id: "7", label: "7 дней", days: 6 },
  { id: "30", label: "30 дней", days: 29 },
  { id: "90", label: "Квартал", days: 89 },
  { id: "month", label: "Этот месяц", thisMonth: true },
]

/** Дата в формате поля: ГГГГ-ММ-ДД по местным часам. */
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
 * Диапазон с пресетами: кнопки для частого, поля для остального.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Date010({
  label = "Период",
  fromLabel = "С",
  toLabel = "По",
  presets = DEFAULT_PRESETS,
  defaultFrom = "",
  defaultTo = "",
  defaultPreset = "",
  lengthTemplate = "Выбрано дней: {days}",
  hint = "Кнопки считают даты от сегодняшнего дня.",
  accent,
  background = "",
  className,
  style,
  ...props
}: Date010Props) {
  const id = useId().replace(/:/g, "")
  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo)
  const [chosen, setChosen] = useState(defaultPreset)

  // Даты пресета считаются в момент нажатия, а не при отрисовке: вычислить
  // «сегодня» на сервере и на клиенте — верный способ разойтись на сутки.
  const apply = (preset: Date010Preset) => {
    const today = new Date()

    if (preset.thisMonth) {
      const first = new Date(today.getFullYear(), today.getMonth(), 1)
      setFrom(iso(first))
      setTo(iso(today))
      setChosen(preset.id)
      return
    }

    const start = new Date(today)
    start.setDate(today.getDate() - (preset.days ?? 0))
    setFrom(iso(start))
    setTo(iso(today))
    setChosen(preset.id)
  }

  const palette = {
    ...(accent ? { "--vibeui-date-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-date-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const days =
    from && to
      ? Math.max(
          0,
          Math.round(
            (new Date(`${to}T00:00:00`).getTime() -
              new Date(`${from}T00:00:00`).getTime()) /
              86400000,
          ) + 1,
        )
      : 0

  return (
    <>
      <style href="vibeui-date-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="date-selector"
        data-vibeui-block="date-010"
        className={className}
        style={palette}
      >
        <span data-part="label">{label}</span>

        <div data-part="presets" role="group" aria-label={label}>
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              data-part="preset"
              aria-pressed={chosen === preset.id}
              onClick={() => apply(preset)}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div data-part="fields">
          <label data-part="field" htmlFor={`${id}-from`}>
            <span data-part="caption">{fromLabel}</span>
            <input
              id={`${id}-from`}
              type="date"
              value={from}
              max={to || undefined}
              onChange={(event) => {
                setFrom(event.target.value)
                setChosen("")
              }}
            />
          </label>

          <label data-part="field" htmlFor={`${id}-to`}>
            <span data-part="caption">{toLabel}</span>
            <input
              id={`${id}-to`}
              type="date"
              value={to}
              // Второму полю ставится min по первому: браузер сам не даст
              // выбрать конец раньше начала.
              min={from || undefined}
              onChange={(event) => {
                setTo(event.target.value)
                setChosen("")
              }}
            />
          </label>
        </div>

        <p data-part="length" aria-live="polite">
          {days > 0 ? (
            <>
              {lengthTemplate.split("{days}")[0]}
              <span data-part="count">{days}</span>
              {lengthTemplate.split("{days}")[1] ?? ""}
            </>
          ) : (
            "Период не выбран"
          )}
        </p>

        <p data-part="hint">{hint}</p>
      </div>
    </>
  )
}

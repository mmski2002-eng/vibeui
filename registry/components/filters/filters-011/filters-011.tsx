"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Filters011Preset = {
  label: string
  days: number
}

export type Filters011Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  title?: string
  presets?: Filters011Preset[]
  onChange?: (range: { from: string; to: string }) => void
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  labels?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

function toISODate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function daysAgo(days: number) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return toISODate(date)
}

// Идея компонента: диапазон дат остаётся двумя настоящими полями всегда —
// пресеты «неделя / месяц / квартал» лишь подставляют в них готовые значения,
// а не прячут поля за радиокнопкой. Отредактировать подставленное можно сразу
// же, а перевёрнутые границы меняются местами по уходу фокуса, а не ошибкой.
const STYLES = `
:where([data-vibeui-block="filters-011"]){
--vibeui-filters-011-surface:transparent;
--vibeui-filters-011-field:light-dark(oklch(1 0 0),oklch(0.27 0 265));
--vibeui-filters-011-fill:light-dark(oklch(0.975 0 265),oklch(0.3 0 265));
--vibeui-filters-011-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-filters-011-muted:color-mix(in oklab,var(--vibeui-filters-011-fg) 68%,transparent);
--vibeui-filters-011-border:light-dark(oklch(0.89 0 265),oklch(0.4 0 265));
--vibeui-filters-011-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-filters-011-accent:light-dark(oklch(0.53 0.15 39.8),oklch(0.76 0.13 39.8));
--vibeui-filters-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="filters-011"]{color-scheme:dark}
/* Подложки по умолчанию нет: фильтр ложится на фон страницы. */
[data-vibeui-block="filters-011"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-filters-011-surface);
border:1px solid var(--vibeui-filters-011-shell);border-radius:0.875rem;
font-family:var(--vibeui-filters-011-font);color:var(--vibeui-filters-011-fg);
}
[data-vibeui-block="filters-011"] *{box-sizing:border-box}
[data-vibeui-block="filters-011"] h3{margin:0;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="filters-011"] [data-part="presets"]{
display:flex;flex-wrap:wrap;gap:0.3125rem;
}
[data-vibeui-block="filters-011"] [data-part="preset"]{
appearance:none;cursor:pointer;
padding:0.25rem 0.625rem;border-radius:9999px;
border:1px solid var(--vibeui-filters-011-border);
background:var(--vibeui-filters-011-fill);color:inherit;
font:inherit;font-size:0.6875rem;font-weight:600;
transition:border-color .16s ease,color .16s ease,background-color .16s ease;
}
[data-vibeui-block="filters-011"] [data-part="preset"]:hover{border-color:var(--vibeui-filters-011-accent)}
[data-vibeui-block="filters-011"] [data-part="preset"]:focus-visible{outline:2px solid var(--vibeui-filters-011-accent);outline-offset:2px}
[data-vibeui-block="filters-011"] [data-part="preset"][aria-pressed="true"]{
border-color:var(--vibeui-filters-011-accent);
color:var(--vibeui-filters-011-accent);
background:color-mix(in oklab,var(--vibeui-filters-011-accent) 10%,var(--vibeui-filters-011-fill));
}
[data-vibeui-block="filters-011"] [data-part="pair"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
}
[data-vibeui-block="filters-011"] [data-part="cell"]{
flex:1;min-width:8rem;display:flex;flex-direction:column;gap:0.1875rem;
}
[data-vibeui-block="filters-011"] [data-part="cell"] span{
font-size:0.6875rem;color:var(--vibeui-filters-011-muted);
}
[data-vibeui-block="filters-011"] input{
width:100%;height:2.375rem;padding:0 0.5rem;box-sizing:border-box;
border:1px solid var(--vibeui-filters-011-border);border-radius:0.625rem;
background:var(--vibeui-filters-011-field);color:inherit;
font:inherit;font-size:0.8125rem;font-variant-numeric:tabular-nums;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="filters-011"] input:focus-visible{
outline:none;border-color:var(--vibeui-filters-011-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-filters-011-accent) 16%,transparent);
}
[data-vibeui-block="filters-011"] [data-part="summary"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-filters-011-muted);
}
[data-vibeui-block="filters-011"] [data-part="summary"] b{color:var(--vibeui-filters-011-fg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="filters-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PRESETS: Filters011Preset[] = [
  { label: "Неделя", days: 7 },
  { label: "Месяц", days: 30 },
  { label: "Квартал", days: 90 },
]

/** Русский словарь по умолчанию: установленный файл не меняет язык проекта. */
const DEFAULT_LABELS: Record<string, string> = {
  from: "С",
  to: "По",
  fromField: "{title}: начало периода",
  toField: "{title}: конец периода",
  summary: "Период: {from} — {to}",
  empty: "Период не задан — выберите пресет или даты.",
}

function label(
  labels: Record<string, string>,
  key: string,
  values?: Record<string, string>,
): string {
  const template = labels[key] ?? DEFAULT_LABELS[key] ?? ""

  if (!values) {
    return template
  }

  return template.replace(
    /\{(\w+)\}/g,
    (match, name: string) => values[name] ?? match,
  )
}

/**
 * Сводка с выделенными границами: даты обязаны быть заметнее слов вокруг,
 * поэтому подстановки from и to попадают в <b>, а шаблон остаётся строкой.
 */
function renderSummary(template: string, values: Record<string, string>) {
  return template.split(/(\{\w+\})/).map((part, index) => {
    const key = /^\{(\w+)\}$/.exec(part)?.[1]

    if (!key) {
      return part
    }

    const value = values[key] ?? part

    return key === "from" || key === "to" ? (
      <b key={`${key}-${index}`}>{value}</b>
    ) : (
      value
    )
  })
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
 * Диапазон дат двумя полями и быстрыми пресетами «неделя / месяц / квартал»,
 * подставляющими готовые значения. Один файл, ноль зависимостей, своя палитра.
 */
export function Filters011({
  title = "Период",
  presets = DEFAULT_PRESETS,
  onChange,
  labels = DEFAULT_LABELS,
  background = "",
  accent,
  className,
  style,
  ...props
}: Filters011Props) {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")

  const palette = {
    ...(accent ? { "--vibeui-filters-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-filters-011-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const push = (next: { from: string; to: string }) => {
    setFrom(next.from)
    setTo(next.to)
    onChange?.(next)
  }

  // Перевёрнутые границы меняются местами по уходу фокуса: человек уже
  // видит, что перепутал «с» и «по», и лишний шаг с ошибкой ему не нужен.
  const settle = () => {
    if (!from || !to || from <= to) return
    push({ from: to, to: from })
  }

  const applyPreset = (preset: Filters011Preset) =>
    push({ from: daysAgo(preset.days), to: toISODate(new Date()) })

  return (
    <>
      <style href="vibeui-filters-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="filters"
        data-vibeui-block="filters-011"
        className={className}
        style={palette}
      >
        <h3>{title}</h3>

        <div data-part="presets">
          {presets.map((preset) => {
            const pressed =
              from === daysAgo(preset.days) && to === toISODate(new Date())
            return (
              <button
                key={preset.label}
                type="button"
                data-part="preset"
                aria-pressed={pressed}
                onClick={() => applyPreset(preset)}
              >
                {preset.label}
              </button>
            )
          })}
        </div>

        <div data-part="pair">
          <label data-part="cell">
            <span>{label(labels, "from")}</span>
            <input
              type="date"
              value={from}
              aria-label={label(labels, "fromField", { title })}
              onChange={(event) => push({ from: event.target.value, to })}
              onBlur={settle}
            />
          </label>
          <label data-part="cell">
            <span>{label(labels, "to")}</span>
            <input
              type="date"
              value={to}
              aria-label={label(labels, "toField", { title })}
              onChange={(event) => push({ from, to: event.target.value })}
              onBlur={settle}
            />
          </label>
        </div>

        <p data-part="summary" role="status">
          {from && to
            ? renderSummary(label(labels, "summary"), { from, to })
            : label(labels, "empty")}
        </p>
      </div>
    </>
  )
}

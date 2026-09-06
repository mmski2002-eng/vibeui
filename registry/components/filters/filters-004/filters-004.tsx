"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Filters004Preset = {
  label: string
  from: string
  to: string
}

export type Filters004Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  title?: string
  unit?: string
  presets?: Filters004Preset[]
  onChange?: (range: { from: string; to: string }) => void
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  labels?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: диапазон числами, а не ползунком. Ползунок хорош, пока
// границы приблизительные; «от 3000 до 3500» им не поставить, а с клавиатуры
// он вовсе неудобен. Здесь два обычных числовых поля, быстрые пресеты сверху
// и одно правило: если «от» больше «до», значения меняются местами при уходе
// фокуса, а не подсвечиваются ошибкой — человек и так уже понял, что перепутал.
const STYLES = `
:where([data-vibeui-block="filters-004"]){
--vibeui-filters-004-surface:transparent;
--vibeui-filters-004-fill:light-dark(oklch(0.975 0 265),oklch(0.29 0 265));
--vibeui-filters-004-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-filters-004-muted:color-mix(in oklab,var(--vibeui-filters-004-fg) 68%,transparent);
--vibeui-filters-004-border:light-dark(oklch(0.89 0 265),oklch(0.4 0 265));
--vibeui-filters-004-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-filters-004-accent:light-dark(oklch(0.52 0.16 39.8),oklch(0.76 0.14 39.8));
--vibeui-filters-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="filters-004"]{color-scheme:dark}
/* Подложки по умолчанию нет: фильтр ложится на фон страницы. */
[data-vibeui-block="filters-004"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:19rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-filters-004-surface);
border:1px solid var(--vibeui-filters-004-shell);border-radius:0.875rem;
font-family:var(--vibeui-filters-004-font);color:var(--vibeui-filters-004-fg);
}
[data-vibeui-block="filters-004"] *{box-sizing:border-box}
[data-vibeui-block="filters-004"] h3{margin:0;font-size:0.8125rem;font-weight:650}
/* Пресеты сверху: девять из десяти запросов закрываются ими. */
[data-vibeui-block="filters-004"] [data-part="presets"]{
display:flex;flex-wrap:wrap;gap:0.3125rem;
}
[data-vibeui-block="filters-004"] [data-part="preset"]{
appearance:none;cursor:pointer;
padding:0.25rem 0.5625rem;border-radius:9999px;
border:1px solid var(--vibeui-filters-004-border);
background:var(--vibeui-filters-004-fill);color:inherit;
font:inherit;font-size:0.6875rem;font-weight:600;
transition:border-color .16s ease,color .16s ease;
}
[data-vibeui-block="filters-004"] [data-part="preset"]:hover{border-color:var(--vibeui-filters-004-accent)}
[data-vibeui-block="filters-004"] [data-part="preset"]:focus-visible{outline:2px solid var(--vibeui-filters-004-accent);outline-offset:2px}
[data-vibeui-block="filters-004"] [data-part="preset"][aria-pressed="true"]{
border-color:var(--vibeui-filters-004-accent);
color:var(--vibeui-filters-004-accent);
background:color-mix(in oklab,var(--vibeui-filters-004-accent) 10%,var(--vibeui-filters-004-fill));
}
[data-vibeui-block="filters-004"] [data-part="pair"]{
display:flex;align-items:center;gap:0.375rem;
}
[data-vibeui-block="filters-004"] [data-part="cell"]{
flex:1;min-width:0;display:flex;align-items:center;gap:0.25rem;
height:2.375rem;padding:0 0.5rem;
border:1px solid var(--vibeui-filters-004-border);border-radius:0.625rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="filters-004"] [data-part="cell"]:focus-within{
border-color:var(--vibeui-filters-004-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-filters-004-accent) 16%,transparent);
}
[data-vibeui-block="filters-004"] [data-part="cell"] > span{
flex:none;font-size:0.6875rem;color:var(--vibeui-filters-004-muted);user-select:none;
}
[data-vibeui-block="filters-004"] input{
width:100%;min-width:0;border:0;background:none;color:inherit;padding:0;
font:inherit;font-size:0.875rem;font-weight:600;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="filters-004"] input:focus{outline:none}
[data-vibeui-block="filters-004"] input::-webkit-outer-spin-button,
[data-vibeui-block="filters-004"] input::-webkit-inner-spin-button{appearance:none;margin:0}
[data-vibeui-block="filters-004"] [data-part="dash"]{
flex:none;width:0.5rem;height:1px;background:var(--vibeui-filters-004-border);
}
[data-vibeui-block="filters-004"] [data-part="summary"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-filters-004-muted);
}
[data-vibeui-block="filters-004"] [data-part="summary"] b{color:var(--vibeui-filters-004-fg);font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="filters-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PRESETS: Filters004Preset[] = [
  { label: "до 1000", from: "", to: "1000" },
  { label: "1000 — 5000", from: "1000", to: "5000" },
  { label: "5000 — 20 000", from: "5000", to: "20000" },
  { label: "от 20 000", from: "20000", to: "" },
]

/** Русский словарь по умолчанию: установленный файл не меняет язык проекта. */
const DEFAULT_LABELS: Record<string, string> = {
  from: "от",
  to: "до",
  fromPlaceholder: "0",
  toPlaceholder: "любая",
  fromField: "{title}: нижняя граница, {unit}",
  toField: "{title}: верхняя граница, {unit}",
  summary: "Отбор: {from} — {to} {unit}",
  empty: "Границы не заданы — цена любая.",
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
 * Сводка с выделенными границами: числа обязаны быть заметнее слов вокруг,
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
 * Числовой диапазон полями ввода с быстрыми пресетами и починкой перевёрнутых границ.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Filters004({
  title = "Цена",
  unit = "₽",
  presets = DEFAULT_PRESETS,
  onChange,
  labels = DEFAULT_LABELS,
  background = "",
  accent,
  className,
  style,
  ...props
}: Filters004Props) {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")

  const palette = {
    ...(accent ? { "--vibeui-filters-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-filters-004-surface": background,
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

  // Границы меняются местами по уходу фокуса: подсвечивать ошибкой то, что
  // человек уже понял, — лишний шаг.
  const settle = () => {
    if (!from || !to) return
    if (Number(from) <= Number(to)) return
    push({ from: to, to: from })
  }

  return (
    <>
      <style href="vibeui-filters-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="filters"
        data-vibeui-block="filters-004"
        className={className}
        style={palette}
      >
        <h3>{title}</h3>

        <div data-part="presets">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              data-part="preset"
              aria-pressed={from === preset.from && to === preset.to}
              onClick={() => push({ from: preset.from, to: preset.to })}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div data-part="pair">
          <span data-part="cell">
            <span aria-hidden="true">{label(labels, "from")}</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={from}
              placeholder={label(labels, "fromPlaceholder")}
              aria-label={label(labels, "fromField", { title, unit })}
              onChange={(event) => setFrom(event.target.value)}
              onBlur={settle}
            />
          </span>
          <span data-part="dash" aria-hidden="true" />
          <span data-part="cell">
            <span aria-hidden="true">{label(labels, "to")}</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={to}
              placeholder={label(labels, "toPlaceholder")}
              aria-label={label(labels, "toField", { title, unit })}
              onChange={(event) => setTo(event.target.value)}
              onBlur={settle}
            />
          </span>
        </div>

        <p data-part="summary" role="status">
          {from || to
            ? renderSummary(label(labels, "summary"), {
                from: from || "0",
                to: to || "∞",
                unit,
              })
            : label(labels, "empty")}
        </p>
      </div>
    </>
  )
}

"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Select020Preset = {
  value: string
  label: string
}

export type Select020Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  name?: string
  /** Готовые периоды; последним пунктом список всегда добавляет свой диапазон. */
  presets?: Select020Preset[]
  customLabel?: string
  fromLabel?: string
  toLabel?: string
  defaultValue?: string
  defaultFrom?: string
  defaultTo?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: у периода почти всегда хватает пресетов, но иногда
// нужен ровно свой диапазон. Последний пункт списка — не дата, а команда
// "показать два поля дат"; сама дата хранится отдельно от выбора периода.
const STYLES = `
:where([data-vibeui-block="select-020"]){
--vibeui-select-020-surface:transparent;
--vibeui-select-020-surface-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-select-020-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-select-020-muted:color-mix(in oklab,var(--vibeui-select-020-fg) 68%,transparent);
--vibeui-select-020-field:light-dark(oklch(0.985 0 265),oklch(0.27 0 265));
--vibeui-select-020-border:light-dark(oklch(0.87 0 265),oklch(0.42 0 265));
--vibeui-select-020-accent:light-dark(oklch(0.55 0.19 39.8),oklch(0.73 0.17 39.8));
--vibeui-select-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="select-020"]{color-scheme:dark}
[data-vibeui-block="select-020"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-select-020-surface);
border:1px solid var(--vibeui-select-020-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-020-font);color:var(--vibeui-select-020-fg);
container-type:inline-size;
}
[data-vibeui-block="select-020"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-020"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="select-020"] select{
appearance:none;-webkit-appearance:none;
width:100%;box-sizing:border-box;margin:0;height:2.75rem;
padding:0 2.75rem 0 0.875rem;
border:1px solid var(--vibeui-select-020-border);border-radius:0.625rem;
background:var(--vibeui-select-020-field);color:inherit;
font:inherit;font-size:0.9375rem;cursor:pointer;
}
/* Системный список рисует браузер по цветам самого <select>: у
   прозрачного он берёт белый, и в тёмной теме всплывал светлый
   список поверх тёмной страницы. */
[data-vibeui-block="select-020"] select,
[data-vibeui-block="select-020"] option,
[data-vibeui-block="select-020"] optgroup{
background-color:var(--vibeui-select-020-field);color:var(--vibeui-select-020-fg);
}
[data-vibeui-block="select-020"] select:focus-visible{
outline:none;border-color:var(--vibeui-select-020-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-020-accent) 22%,transparent);
}
[data-vibeui-block="select-020"] [data-part="arrow"]{
position:absolute;right:1rem;top:50%;
width:0.4375rem;height:0.4375rem;margin-top:-0.3125rem;pointer-events:none;
border-right:1.5px solid var(--vibeui-select-020-muted);
border-bottom:1.5px solid var(--vibeui-select-020-muted);
transform:rotate(45deg);
}
[data-vibeui-block="select-020"] [data-part="range"]{
display:grid;grid-template-rows:0fr;
transition:grid-template-rows .18s ease;
}
[data-vibeui-block="select-020"] [data-part="range"][data-open="true"]{
grid-template-rows:1fr;
}
[data-vibeui-block="select-020"] [data-part="range-inner"]{
display:flex;gap:0.5rem;overflow:hidden;min-height:0;
}
[data-vibeui-block="select-020"] [data-part="date-group"]{
flex:1 1 0;min-width:0;display:flex;flex-direction:column;gap:0.25rem;
}
[data-vibeui-block="select-020"] [data-part="date-label"]{
font-size:0.6875rem;color:var(--vibeui-select-020-muted);
}
[data-vibeui-block="select-020"] input[type="date"]{
box-sizing:border-box;width:100%;height:2.375rem;padding:0 0.625rem;
border:1px solid var(--vibeui-select-020-border);border-radius:0.5rem;
background:var(--vibeui-select-020-field);color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="select-020"] input[type="date"]:focus-visible{
outline:none;border-color:var(--vibeui-select-020-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-020-accent) 22%,transparent);
}
@container (max-width: 14rem){
[data-vibeui-block="select-020"] [data-part="range-inner"]{flex-direction:column}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-020"] *{animation:none!important;transition:none!important}}
`

const PRESETS: Select020Preset[] = [
  { value: "today", label: "Сегодня" },
  { value: "week", label: "Последние 7 дней" },
  { value: "month", label: "Последние 30 дней" },
  { value: "quarter", label: "Последний квартал" },
]

const CUSTOM_VALUE = "custom"

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
 * Select периода: обычные пресеты плюс пункт «Свой диапазон», который
 * раскрывает два поля дат. Один файл, ноль зависимостей, собственная
 * палитра.
 */
export function Select020({
  label = "Период",
  name,
  presets = PRESETS,
  customLabel = "Свой диапазон",
  fromLabel = "С даты",
  toLabel = "По дату",
  defaultValue = PRESETS[1].value,
  defaultFrom,
  defaultTo,
  background = "",
  accent,
  id,
  className,
  style,
  ...props
}: Select020Props) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const fromId = `${fieldId}-from`
  const toId = `${fieldId}-to`

  const [value, setValue] = useState(defaultValue)
  const [from, setFrom] = useState(defaultFrom ?? "")
  const [to, setTo] = useState(defaultTo ?? "")
  const isCustom = value === CUSTOM_VALUE

  const palette = {
    ...(accent ? { "--vibeui-select-020-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-select-020-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-020" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="select"
        data-vibeui-block="select-020"
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={fieldId}>
          {label}
        </label>
        <span data-part="field">
          <select
            id={fieldId}
            name={isCustom ? undefined : name}
            value={value}
            aria-controls={`${fieldId}-range`}
            aria-expanded={isCustom}
            onChange={(event) => setValue(event.target.value)}
          >
            {presets.map((preset) => (
              <option key={preset.value} value={preset.value}>
                {preset.label}
              </option>
            ))}
            <option value={CUSTOM_VALUE}>{customLabel}</option>
          </select>
          <span data-part="arrow" aria-hidden="true" />
        </span>
        <div id={`${fieldId}-range`} data-part="range" data-open={isCustom}>
          <div data-part="range-inner">
            <span data-part="date-group">
              <label data-part="date-label" htmlFor={fromId}>
                {fromLabel}
              </label>
              <input
                id={fromId}
                type="date"
                name={isCustom && name ? `${name}From` : undefined}
                value={from}
                disabled={!isCustom}
                tabIndex={isCustom ? 0 : -1}
                onChange={(event) => setFrom(event.target.value)}
              />
            </span>
            <span data-part="date-group">
              <label data-part="date-label" htmlFor={toId}>
                {toLabel}
              </label>
              <input
                id={toId}
                type="date"
                name={isCustom && name ? `${name}To` : undefined}
                value={to}
                disabled={!isCustom}
                tabIndex={isCustom ? 0 : -1}
                onChange={(event) => setTo(event.target.value)}
              />
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

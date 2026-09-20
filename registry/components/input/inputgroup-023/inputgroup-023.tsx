"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Inputgroup023Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  name?: string
  label?: string
  currency?: string
  presets?: number[]
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
  /** Подпись ряда быстрых сумм для скринридера. */
  presetsLabel?: string
  /** Локаль форматирования числа: компонент несёт русскую. */
  locale?: string
  hint?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

const DEFAULT_PRESETS = [500, 1000, 5000]

function formatAmount(value: number, locale: string) {
  return value.toLocaleString(locale)
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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

// Идея компонента: быстрые суммы — не отдельная сущность, а короткий путь к
// тому же числовому полю. Кнопка не добавляет пресет к текущему значению, а
// заменяет его целиком — так пресет предсказуем и не зависит от того, что
// было в поле раньше. Активный пресет подсвечивается aria-pressed, только
// пока значение совпадает с ним в точности; ручной ввод гасит подсветку.
const STYLES = `
:where([data-vibeui-block="inputgroup-023"]){
--vibeui-inputgroup-023-surface:transparent;
--vibeui-inputgroup-023-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-inputgroup-023-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-inputgroup-023-muted:color-mix(in oklab,var(--vibeui-inputgroup-023-fg) 68%,transparent);
--vibeui-inputgroup-023-field:light-dark(oklch(0.99 0 265),oklch(0.26 0 265));
--vibeui-inputgroup-023-fixed:light-dark(oklch(0.96 0 265),oklch(0.31 0 265));
--vibeui-inputgroup-023-border:light-dark(oklch(0.86 0 265),oklch(0.4 0 265));
--vibeui-inputgroup-023-accent:light-dark(oklch(0.295 0 0),oklch(0.906 0 0));
--vibeui-inputgroup-023-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.012 142));
--vibeui-inputgroup-023-radius:0.75rem;
--vibeui-inputgroup-023-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="inputgroup-023"]{color-scheme:dark}
[data-vibeui-block="inputgroup-023"]{
display:flex;flex-direction:column;gap:0.5625rem;margin:0;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-023-surface);
border:1px solid var(--vibeui-inputgroup-023-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-023-font);color:var(--vibeui-inputgroup-023-fg);
}
[data-vibeui-block="inputgroup-023"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-023"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-023"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-023"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-023-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-023"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-023-radius) 0 0 var(--vibeui-inputgroup-023-radius);
}
[data-vibeui-block="inputgroup-023"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-023-radius) var(--vibeui-inputgroup-023-radius) 0;
}
[data-vibeui-block="inputgroup-023"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-023"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-023-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-023-accent);
}
[data-vibeui-block="inputgroup-023"] input{
flex:1;min-width:0;padding:0 0.75rem;
background:var(--vibeui-inputgroup-023-field);
font-size:0.9375rem;font-weight:600;font-variant-numeric:tabular-nums;
text-align:right;
}
[data-vibeui-block="inputgroup-023"] input::-webkit-outer-spin-button,
[data-vibeui-block="inputgroup-023"] input::-webkit-inner-spin-button{
-webkit-appearance:none;margin:0;
}
[data-vibeui-block="inputgroup-023"] input{appearance:textfield}
[data-vibeui-block="inputgroup-023"] [data-part="unit"]{
flex:none;width:2.75rem;display:grid;place-items:center;
background:var(--vibeui-inputgroup-023-fixed);
font-size:0.875rem;font-weight:650;color:var(--vibeui-inputgroup-023-muted);
}
[data-vibeui-block="inputgroup-023"] [data-part="presets"]{
display:flex;flex-wrap:wrap;gap:0.375rem;
}
[data-vibeui-block="inputgroup-023"] [data-part="presets"] button{
appearance:none;cursor:pointer;height:2rem;padding:0 0.75rem;border-radius:999px;
border:1px solid var(--vibeui-inputgroup-023-border);
background:var(--vibeui-inputgroup-023-surface);
font-size:0.8125rem;font-weight:600;color:var(--vibeui-inputgroup-023-fg);
transition:background-color .16s ease,border-color .16s ease,color .16s ease;
}
[data-vibeui-block="inputgroup-023"] [data-part="presets"] button:hover{
border-color:var(--vibeui-inputgroup-023-accent);
}
[data-vibeui-block="inputgroup-023"] [data-part="presets"] button:focus-visible{
outline:2px solid var(--vibeui-inputgroup-023-accent);outline-offset:1px;
}
[data-vibeui-block="inputgroup-023"] [data-part="presets"] button[aria-pressed="true"]{
background:var(--vibeui-inputgroup-023-accent);border-color:var(--vibeui-inputgroup-023-accent);
color:oklch(from var(--vibeui-inputgroup-023-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
[data-vibeui-block="inputgroup-023"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-023-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-023"] *{animation:none!important;transition:none!important}}
`

/**
 * Сцепка «сумма + валюта» и ряд кнопок быстрого выбора под ней: пресет
 * заменяет значение целиком, подсветка активной кнопки следит за точным
 * совпадением с числом в поле.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup023({
  name = "amount",
  label = "Сумма пополнения",
  currency = "₽",
  presets = DEFAULT_PRESETS,
  defaultValue = 500,
  min = 0,
  max = 200000,
  step = 50,
  onChange,
  presetsLabel = "Быстрый выбор суммы",
  locale = "ru-RU",
  hint = "Кнопки ниже заменяют сумму целиком — число всегда можно поправить и вручную.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Inputgroup023Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-023-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-inputgroup-023-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const setAmount = (next: number) => {
    setValue(next)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-inputgroup-023" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input-group"
        data-vibeui-block="inputgroup-023"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <input
            id={id}
            name={name}
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            step={step}
            value={value}
            aria-describedby={`${id}-hint`}
            onChange={(event) => {
              const next = Number(event.target.value)
              setAmount(Number.isNaN(next) ? 0 : next)
            }}
          />
          <span data-part="unit" aria-hidden="true">
            {currency}
          </span>
        </div>
        <div data-part="presets" role="group" aria-label={presetsLabel}>
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              aria-pressed={value === preset}
              onClick={() => setAmount(preset)}
            >
              {formatAmount(preset, locale)} {currency}
            </button>
          ))}
        </div>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}

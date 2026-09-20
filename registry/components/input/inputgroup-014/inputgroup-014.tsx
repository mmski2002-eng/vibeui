"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Inputgroup014Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  name?: string
  label?: string
  unit?: string
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  /** Подпись кнопки шага вниз: компонент несёт русскую, проект подставляет свою. */
  decreaseLabel?: string
  /** Подпись кнопки шага вверх. */
  increaseLabel?: string
  hint?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: единица измерения — часть значения, а не соседний
// текст, поэтому она стоит внутри той же рамки сразу после числа, а не
// табличкой снаружи. Шаговые кнопки по краям меняют то же число, что и
// стрелки клавиатуры в поле — состояние одно на троих. На границе
// диапазона кнопка не прячется, а становится некликабельной: пропавшая
// кнопка на краю шкалы выглядит как баг, а не как предел.
const STYLES = `
:where([data-vibeui-block="inputgroup-014"]){
--vibeui-inputgroup-014-surface:transparent;
--vibeui-inputgroup-014-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-inputgroup-014-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-inputgroup-014-muted:color-mix(in oklab,var(--vibeui-inputgroup-014-fg) 68%,transparent);
--vibeui-inputgroup-014-field:light-dark(oklch(0.99 0 265),oklch(0.26 0 265));
--vibeui-inputgroup-014-fixed:light-dark(oklch(0.96 0 265),oklch(0.31 0 265));
--vibeui-inputgroup-014-border:light-dark(oklch(0.86 0 265),oklch(0.4 0 265));
--vibeui-inputgroup-014-accent:light-dark(oklch(0.28 0 0),oklch(0.905 0 0));
--vibeui-inputgroup-014-radius:0.75rem;
--vibeui-inputgroup-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="inputgroup-014"]{color-scheme:dark}
[data-vibeui-block="inputgroup-014"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:19rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-014-surface);
border:1px solid var(--vibeui-inputgroup-014-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-014-font);color:var(--vibeui-inputgroup-014-fg);
}
[data-vibeui-block="inputgroup-014"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-014"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-014"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-014"] [data-part="group"] > *{
position:relative;height:2.875rem;
border:1px solid var(--vibeui-inputgroup-014-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-014"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-014-radius) 0 0 var(--vibeui-inputgroup-014-radius);
}
[data-vibeui-block="inputgroup-014"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-014-radius) var(--vibeui-inputgroup-014-radius) 0;
}
[data-vibeui-block="inputgroup-014"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-014"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-014-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-014-accent);
}
[data-vibeui-block="inputgroup-014"] [data-part="step"]{
appearance:none;flex:none;width:2.75rem;cursor:pointer;
display:grid;place-items:center;
background:var(--vibeui-inputgroup-014-fixed);
color:var(--vibeui-inputgroup-014-fg);font-size:1.125rem;font-weight:650;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="inputgroup-014"] [data-part="step"]:hover:not(:disabled){
background:color-mix(in oklab,var(--vibeui-inputgroup-014-accent) 16%,var(--vibeui-inputgroup-014-fixed));
}
/* На краю диапазона кнопка гаснет, но остаётся на месте — так виден предел. */
[data-vibeui-block="inputgroup-014"] [data-part="step"]:disabled{
cursor:not-allowed;color:var(--vibeui-inputgroup-014-muted);opacity:0.5;
}
[data-vibeui-block="inputgroup-014"] [data-part="step"] svg{width:0.8125rem;height:0.8125rem;display:block}
[data-vibeui-block="inputgroup-014"] input{
flex:1;min-width:0;padding:0 0.5rem;text-align:center;
background:var(--vibeui-inputgroup-014-field);
font-size:1.0625rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="inputgroup-014"] input::-webkit-outer-spin-button,
[data-vibeui-block="inputgroup-014"] input::-webkit-inner-spin-button{appearance:none;margin:0}
[data-vibeui-block="inputgroup-014"] [data-part="unit"]{
flex:none;display:flex;align-items:center;padding:0 0.75rem;
background:var(--vibeui-inputgroup-014-fixed);
font-size:0.8125rem;font-weight:600;color:var(--vibeui-inputgroup-014-muted);
user-select:none;
}
[data-vibeui-block="inputgroup-014"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-014-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-014"] *{animation:none!important;transition:none!important}}
`

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
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

/**
 * Сцепка «шаг вниз + число с единицей + шаг вверх»: одно состояние на все три части.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup014({
  name = "weight",
  label = "Вес посылки",
  unit = "кг",
  defaultValue = 5,
  min = 0,
  max = 50,
  step = 1,
  decreaseLabel = "Уменьшить",
  increaseLabel = "Увеличить",
  hint = "Меняйте кнопками по краям или стрелками клавиатуры внутри поля.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Inputgroup014Props) {
  const id = useId()
  const [value, setValue] = useState(clamp(defaultValue, min, max))

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-inputgroup-014-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-inputgroup-014" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input-group"
        data-vibeui-block="inputgroup-014"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <button
            type="button"
            data-part="step"
            aria-label={decreaseLabel}
            disabled={value <= min}
            onClick={() =>
              setValue((current) => clamp(current - step, min, max))
            }
          >
            <svg
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M2 6h8" strokeLinecap="round" />
            </svg>
          </button>
          <input
            id={id}
            name={name}
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            value={value}
            aria-describedby={`${id}-hint`}
            onChange={(event) => {
              const next = Number(event.target.value)
              if (!Number.isNaN(next)) {
                setValue(clamp(next, min, max))
              }
            }}
          />
          <span data-part="unit" aria-hidden="true">
            {unit}
          </span>
          <button
            type="button"
            data-part="step"
            aria-label={increaseLabel}
            disabled={value >= max}
            onClick={() =>
              setValue((current) => clamp(current + step, min, max))
            }
          >
            <svg
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M6 2v8M2 6h8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}

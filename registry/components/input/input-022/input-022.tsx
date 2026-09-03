"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Input022Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  unitA?: string
  unitB?: string
  factor?: number
  defaultValue?: number
  defaultUnit?: "a" | "b"
  onChange?: (value: number, unit: string) => void
  /** Подпись группы кнопок для скринридера. */
  unitsLabel?: string
  /** Строка пересчёта; {amount} заменяется значением во второй единице. */
  convertText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: единица измерения из выпадающего списка уже есть
// (input-010), но там число при смене единицы намеренно не пересчитывается —
// для срока действия ссылки это честно. Для веса или роста нет: килограмм и
// фунт описывают одну и ту же величину, и при переключении число обязано
// смениться вместе с единицей. Поэтому здесь не список, а переключатель из
// двух кнопок, и значение конвертируется по заданному множителю.
const STYLES = `
:where([data-vibeui-block="input-022"]){
--vibeui-input-022-surface:transparent;
--vibeui-input-022-shell:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-input-022-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-input-022-muted:color-mix(in oklab,var(--vibeui-input-022-fg) 68%,transparent);
--vibeui-input-022-field:light-dark(oklch(0.985 0.002 265),oklch(0.27 0.011 265));
--vibeui-input-022-border:light-dark(oklch(0.88 0.008 265),oklch(0.41 0.013 265));
--vibeui-input-022-accent:light-dark(oklch(0.55 0.16 40),oklch(0.74 0.15 40));
--vibeui-input-022-on-accent:light-dark(oklch(1 0 0),oklch(0.2 0.03 40));
--vibeui-input-022-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="input-022"]{color-scheme:dark}
[data-vibeui-block="input-022"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-022-surface);
border:1px solid var(--vibeui-input-022-shell);border-radius:0.875rem;
font-family:var(--vibeui-input-022-font);color:var(--vibeui-input-022-fg);
}
[data-vibeui-block="input-022"] *{box-sizing:border-box}
[data-vibeui-block="input-022"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-022"] [data-part="frame"]{
display:flex;align-items:stretch;
height:2.75rem;
background:var(--vibeui-input-022-field);
border:1px solid var(--vibeui-input-022-border);border-radius:0.75rem;
overflow:hidden;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-022"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-input-022-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-022-accent) 18%,transparent);
}
[data-vibeui-block="input-022"] input{
flex:1;min-width:0;padding:0 0.75rem;
border:0;background:none;color:inherit;
font:inherit;font-size:1rem;font-weight:600;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="input-022"] input:focus{outline:none}
[data-vibeui-block="input-022"] input::-webkit-outer-spin-button,
[data-vibeui-block="input-022"] input::-webkit-inner-spin-button{appearance:none;margin:0}
[data-vibeui-block="input-022"] [data-part="units"]{
flex:none;display:flex;align-items:center;padding:0.25rem;gap:0.125rem;
border-left:1px solid var(--vibeui-input-022-border);
}
[data-vibeui-block="input-022"] [data-part="unit"]{
appearance:none;cursor:pointer;
height:100%;padding:0 0.625rem;border:0;border-radius:0.5rem;
background:none;color:var(--vibeui-input-022-muted);
font:inherit;font-size:0.8125rem;font-weight:650;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="input-022"] [data-part="unit"][data-active="1"]{
background:var(--vibeui-input-022-accent);color:var(--vibeui-input-022-on-accent);
}
[data-vibeui-block="input-022"] [data-part="unit"]:hover:not([data-active="1"]){
background:color-mix(in oklab,var(--vibeui-input-022-fg) 8%,transparent);
}
[data-vibeui-block="input-022"] [data-part="unit"]:focus-visible{
outline:2px solid var(--vibeui-input-022-accent);outline-offset:2px;
}
[data-vibeui-block="input-022"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-022-muted);
}
[data-vibeui-block="input-022"] [data-part="note"] b{
color:var(--vibeui-input-022-fg);font-weight:650;font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-022"] *{animation:none!important;transition:none!important}}
`

function round(value: number) {
  return Math.round(value * 10) / 10
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
 * Число с переключателем единиц из двух кнопок: значение пересчитывается
 * при смене единицы, а не остаётся прежним. Один файл, ноль зависимостей.
 */
export function Input022({
  label = "Вес",
  unitA = "кг",
  unitB = "фунты",
  factor = 2.20462,
  defaultValue = 72,
  defaultUnit = "a",
  onChange,
  unitsLabel = "Единица измерения",
  convertText = "Это ≈ {amount}.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Input022Props) {
  const id = useId()
  const [unit, setUnit] = useState<"a" | "b">(defaultUnit)
  const [value, setValue] = useState(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-input-022-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-input-022-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const currentLabel = unit === "a" ? unitA : unitB
  const otherLabel = unit === "a" ? unitB : unitA
  const other = round(unit === "a" ? value * factor : value / factor)
  const [convertBefore, convertAfter] = convertText.split("{amount}")

  const switchTo = (next: "a" | "b") => {
    if (next === unit) return
    const converted = round(unit === "a" ? value * factor : value / factor)
    setUnit(next)
    setValue(converted)
    onChange?.(converted, next === "a" ? unitA : unitB)
  }

  return (
    <>
      <style href="vibeui-input-022" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input"
        data-vibeui-block="input-022"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="frame">
          <input
            id={id}
            type="number"
            inputMode="decimal"
            step="0.1"
            value={value}
            aria-describedby={`${id}-note`}
            onChange={(event) => {
              const next = Number(event.target.value)
              setValue(next)
              onChange?.(next, currentLabel)
            }}
          />
          <span data-part="units" role="group" aria-label={unitsLabel}>
            <button
              type="button"
              data-part="unit"
              data-active={unit === "a" ? "1" : "0"}
              aria-pressed={unit === "a"}
              onClick={() => switchTo("a")}
            >
              {unitA}
            </button>
            <button
              type="button"
              data-part="unit"
              data-active={unit === "b" ? "1" : "0"}
              aria-pressed={unit === "b"}
              onClick={() => switchTo("b")}
            >
              {unitB}
            </button>
          </span>
        </div>
        <p data-part="note" id={`${id}-note`} aria-live="polite">
          {convertBefore}
          <b>
            {other} {otherLabel}
          </b>
          {convertAfter}
        </p>
      </div>
    </>
  )
}

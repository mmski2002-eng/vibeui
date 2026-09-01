"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Slider011Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  currency?: string
  accent?: string
}

// Идея компонента: ползунок цены и поле ввода синхронизируются вживую,
// без отложенного зажима на blur. Минимум цены — ноль, поэтому цифру можно
// набирать с любого разряда, не упираясь в нижнюю границу на середине
// ввода. Заголовок над дорожкой показывает цену с разрядами тысяч —
// поле ввода остаётся простыми цифрами, разряды не мешают печатать.
const STYLES = `
:where([data-vibeui-block="slider-011"]){
--vibeui-slider-011-bg:oklch(1 0 0);
--vibeui-slider-011-fg:oklch(0.22 0.014 265);
--vibeui-slider-011-muted:oklch(0.55 0.014 265);
--vibeui-slider-011-border:oklch(0.9 0.006 265);
--vibeui-slider-011-field:oklch(0.985 0.002 265);
--vibeui-slider-011-track:oklch(0.92 0.006 265);
--vibeui-slider-011-accent:oklch(0.56 0.17 152);
--vibeui-slider-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-slider-011-fill:30%;
}
[data-vibeui-block="slider-011"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-slider-011-bg);
border:1px solid var(--vibeui-slider-011-border);border-radius:0.875rem;
font-family:var(--vibeui-slider-011-font);color:var(--vibeui-slider-011-fg);
}
[data-vibeui-block="slider-011"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:1rem;
}
[data-vibeui-block="slider-011"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="slider-011"] [data-part="price"]{
margin:0;font-size:1.25rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="slider-011"] input[type="range"]{
appearance:none;width:100%;height:1.25rem;margin:0;background:none;cursor:pointer;display:block;
}
[data-vibeui-block="slider-011"] input[type="range"]::-webkit-slider-runnable-track{
height:0.375rem;border-radius:9999px;
background:linear-gradient(to right,var(--vibeui-slider-011-accent) var(--vibeui-slider-011-fill),var(--vibeui-slider-011-track) var(--vibeui-slider-011-fill));
}
[data-vibeui-block="slider-011"] input[type="range"]::-moz-range-track{
height:0.375rem;border-radius:9999px;
background:linear-gradient(to right,var(--vibeui-slider-011-accent) var(--vibeui-slider-011-fill),var(--vibeui-slider-011-track) var(--vibeui-slider-011-fill));
}
[data-vibeui-block="slider-011"] input[type="range"]::-webkit-slider-thumb{
appearance:none;margin-top:-0.3125rem;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-slider-011-accent);border:3px solid var(--vibeui-slider-011-bg);
box-shadow:0 1px 4px oklch(0.2 0.02 265 / 30%);
}
[data-vibeui-block="slider-011"] input[type="range"]::-moz-range-thumb{
width:1rem;height:1rem;border-radius:9999px;box-sizing:border-box;
background:var(--vibeui-slider-011-accent);border:3px solid var(--vibeui-slider-011-bg);
}
[data-vibeui-block="slider-011"] input[type="range"]:focus-visible{outline:2px solid var(--vibeui-slider-011-accent);outline-offset:4px;border-radius:0.5rem}
[data-vibeui-block="slider-011"] [data-part="scale"]{
display:flex;justify-content:space-between;margin:0;
font-size:0.6875rem;color:var(--vibeui-slider-011-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="slider-011"] [data-part="field-label"]{font-size:0.75rem;color:var(--vibeui-slider-011-muted)}
/* Поле с валютным префиксом внутри рамки — префикс не часть значения,
   поэтому он отдельный узел, а не placeholder или content. */
[data-vibeui-block="slider-011"] [data-part="field"]{
display:flex;align-items:center;gap:0.375rem;margin-top:0.25rem;
padding:0 0.625rem;height:2.25rem;border-radius:0.5rem;
border:1px solid var(--vibeui-slider-011-border);
background:var(--vibeui-slider-011-field);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="slider-011"] [data-part="field"]:focus-within{
border-color:var(--vibeui-slider-011-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-slider-011-accent) 20%,transparent);
}
[data-vibeui-block="slider-011"] [data-part="prefix"]{
flex:none;font-size:0.8125rem;font-weight:600;color:var(--vibeui-slider-011-muted);
}
[data-vibeui-block="slider-011"] [data-part="number"]{
appearance:none;flex:1 1 auto;min-width:0;border:0;padding:0;background:none;color:inherit;
font:inherit;font-size:0.9375rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="slider-011"] [data-part="number"]:focus{outline:none}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="slider-011"] *{animation:none!important;transition:none!important}}
`

/**
 * Ползунок цены с полем ввода: оба входа синхронизируются вживую, без
 * ожидания blur. Один файл, ноль зависимостей, собственная палитра.
 */
export function Slider011({
  label = "Цена товара",
  min = 0,
  max = 50000,
  step = 100,
  defaultValue = 12900,
  currency = "₽",
  accent,
  className,
  style,
  ...props
}: Slider011Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [draft, setDraft] = useState(String(defaultValue))

  const clamp = (next: number) => Math.min(max, Math.max(min, next))

  const applyDraft = (raw: string) => {
    const digits = raw.replace(/[^\d]/g, "")

    if (digits === "") {
      setDraft("")
      return
    }

    const next = clamp(Number(digits))
    setValue(next)
    setDraft(digits)
  }

  const applyRange = (raw: string) => {
    const next = Number(raw)
    setValue(next)
    setDraft(String(next))
  }

  const formatted = new Intl.NumberFormat("ru-RU").format(value)

  const palette = {
    "--vibeui-slider-011-fill": `${((value - min) / (max - min)) * 100}%`,
    ...(accent ? { "--vibeui-slider-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-slider-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="slider-011"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <label data-part="label" htmlFor={`${id}-range`}>
            {label}
          </label>
          <p data-part="price" aria-hidden="true">
            {formatted} {currency}
          </p>
        </div>
        <input
          id={`${id}-range`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-valuetext={`${formatted} ${currency}`}
          onChange={(event) => applyRange(event.target.value)}
        />
        <p data-part="scale">
          <span>
            {min} {currency}
          </span>
          <span>
            {max} {currency}
          </span>
        </p>
        <label data-part="field-label" htmlFor={`${id}-number`}>
          Точная цена
        </label>
        <span data-part="field">
          <span data-part="prefix" aria-hidden="true">
            {currency}
          </span>
          <input
            data-part="number"
            id={`${id}-number`}
            type="text"
            inputMode="numeric"
            value={draft}
            aria-label={`${label}, точное значение в ${currency}`}
            onChange={(event) => applyDraft(event.target.value)}
            onBlur={() => {
              if (draft === "") {
                setValue(min)
                setDraft(String(min))
              }
            }}
          />
        </span>
      </div>
    </>
  )
}

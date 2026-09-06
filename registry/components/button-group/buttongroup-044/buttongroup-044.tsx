"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup044Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  defaultValue?: number
  min?: number
  max?: number
  unit?: string
  label?: string
  /** Имена кнопок шага: голые значки своего имени не имеют. */
  decreaseLabel?: string
  increaseLabel?: string
  onChange?: (quantity: number) => void
  /** Пусто — заливки нет, счётчик ложится на фон страницы. */
  background?: string
  accent?: string
}

// Идея компонента: количество, которое можно и нащёлкать, и набрать. Между
// кнопками стоит настоящий input[type=number] — значит, работают ввод с
// клавиатуры, вставка из буфера, стрелки вверх/вниз и подсказка числовой
// клавиатуры на телефоне. Родные стрелки браузера убраны: они дублируют
// кнопки и на 16 пикселях в них не попасть. Значение зажимается в диапазон
// при потере фокуса, а не на каждом нажатии клавиши: иначе набрать «12»
// в поле с максимумом 20 было бы невозможно — «1» уже упёрлось бы в минимум.
const STYLES = `
:where([data-vibeui-block="buttongroup-044"]){
--vibeui-buttongroup-044-surface:transparent;
--vibeui-buttongroup-044-fg:light-dark(oklch(0.24 0 265),oklch(0.95 0 265));
--vibeui-buttongroup-044-muted:color-mix(in oklab,var(--vibeui-buttongroup-044-fg) 68%,transparent);
--vibeui-buttongroup-044-border:light-dark(oklch(0.88 0 265),oklch(0.41 0 265));
--vibeui-buttongroup-044-hover:light-dark(oklch(0.965 0 265),oklch(0.33 0 265));
--vibeui-buttongroup-044-accent:light-dark(oklch(0.5 0.16 265),oklch(0.77 0.13 265));
--vibeui-buttongroup-044-radius:0.625rem;
--vibeui-buttongroup-044-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-044"]{color-scheme:dark}
[data-vibeui-block="buttongroup-044"]{
box-sizing:border-box;display:inline-flex;align-items:stretch;isolation:isolate;
border:1px solid var(--vibeui-buttongroup-044-border);
border-radius:var(--vibeui-buttongroup-044-radius);
background:var(--vibeui-buttongroup-044-surface);
font-family:var(--vibeui-buttongroup-044-font);
}
[data-vibeui-block="buttongroup-044"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-044"] button{
appearance:none;cursor:pointer;font:inherit;
position:relative;z-index:0;
display:inline-flex;align-items:center;justify-content:center;
width:2.25rem;height:2.25rem;
border:0;background:transparent;
color:var(--vibeui-buttongroup-044-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="buttongroup-044"] button:hover:not(:disabled){
background:var(--vibeui-buttongroup-044-hover);color:var(--vibeui-buttongroup-044-fg);
}
[data-vibeui-block="buttongroup-044"] button:disabled{opacity:.35;cursor:not-allowed}
[data-vibeui-block="buttongroup-044"] svg{
width:1rem;height:1rem;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;
}
[data-vibeui-block="buttongroup-044"] [data-part="field"]{
display:flex;align-items:center;gap:0.1875rem;
padding:0 0.375rem;
border-inline:1px solid var(--vibeui-buttongroup-044-border);
}
/* Родные стрелки убраны: они дублируют кнопки и слишком мелкие. */
[data-vibeui-block="buttongroup-044"] input{
width:2.5rem;height:2.25rem;padding:0;
border:0;background:transparent;
color:var(--vibeui-buttongroup-044-fg);
font:inherit;font-size:0.875rem;font-weight:700;text-align:center;
font-variant-numeric:tabular-nums;
appearance:textfield;
}
[data-vibeui-block="buttongroup-044"] input::-webkit-outer-spin-button,
[data-vibeui-block="buttongroup-044"] input::-webkit-inner-spin-button{
appearance:none;margin:0;
}
[data-vibeui-block="buttongroup-044"] input:focus{outline:none}
[data-vibeui-block="buttongroup-044"] [data-part="field"]:has(input:focus-visible){
outline:2px solid var(--vibeui-buttongroup-044-accent);outline-offset:-2px;
}
[data-vibeui-block="buttongroup-044"] [data-part="unit"]{
color:var(--vibeui-buttongroup-044-muted);
font-size:0.75rem;font-weight:600;line-height:1;
}
[data-vibeui-block="buttongroup-044"] button:focus-visible{
z-index:1;outline:2px solid var(--vibeui-buttongroup-044-accent);outline-offset:-2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-044"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданного фона. Без неё светлая заливка досталась бы тексту
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
 * Количество: кнопки шага вокруг настоящего числового поля.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup044({
  defaultValue = 2,
  min = 1,
  max = 20,
  unit = "шт.",
  label = "Количество",
  decreaseLabel = "Уменьшить количество",
  increaseLabel = "Увеличить количество",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup044Props) {
  const [raw, setRaw] = useState(String(defaultValue))
  const value = Number(raw)
  const valid = Number.isFinite(value) ? value : min

  const apply = (next: number) => {
    const clamped = Math.min(max, Math.max(min, next))
    setRaw(String(clamped))
    onChange?.(clamped)
  }

  const palette = {
    ...(accent ? { "--vibeui-buttongroup-044-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-044-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-044" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-044"
        className={className}
        style={palette}
        role="group"
        aria-label={label}
      >
        <button
          type="button"
          onClick={() => apply(valid - 1)}
          disabled={valid <= min}
          aria-label={decreaseLabel}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14" />
          </svg>
        </button>
        <span data-part="field">
          <input
            type="number"
            inputMode="numeric"
            value={raw}
            min={min}
            max={max}
            aria-label={label}
            onChange={(event) => setRaw(event.target.value)}
            onBlur={() => apply(valid)}
          />
          <span data-part="unit">{unit}</span>
        </span>
        <button
          type="button"
          onClick={() => apply(valid + 1)}
          disabled={valid >= max}
          aria-label={increaseLabel}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </>
  )
}

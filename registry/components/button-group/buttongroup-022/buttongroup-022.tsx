"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup022Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  steps?: number[]
  defaultValue?: number
  label?: string
  /** Имя кнопки «минус». */
  decreaseLabel?: string
  /** Имя кнопки «плюс». */
  increaseLabel?: string
  /** Имя средней кнопки: {value} — текущий масштаб, {default} — сбрасываемый. */
  valueLabel?: string
  onChange?: (zoom: number) => void
  /** Пусто — подложки нет, сцепка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: шаговый регулятор, где значение живёт внутри сцепки
// третьей ячейкой. Масштаб идёт не арифметическим шагом, а по списку
// привычных значений (25, 50, 75, 100…): равномерный шаг в 5 % заставил бы
// щёлкать десяток раз. Средняя ячейка — кнопка сброса к 100 %, у неё
// фиксированная ширина и табличные цифры, иначе «75 %» и «100 %» дёргали бы
// соседей. Крайние значения гасят кнопку через disabled, а не прячут её.
const STYLES = `
:where([data-vibeui-block="buttongroup-022"]){
--vibeui-buttongroup-022-surface:transparent;
--vibeui-buttongroup-022-fg:light-dark(oklch(0.25 0 265),oklch(0.94 0 265));
--vibeui-buttongroup-022-muted:color-mix(in oklab,var(--vibeui-buttongroup-022-fg) 68%,transparent);
--vibeui-buttongroup-022-border:light-dark(oklch(0.88 0 265),oklch(0.38 0 265));
--vibeui-buttongroup-022-hover:light-dark(oklch(0.965 0 265),oklch(0.31 0 265));
--vibeui-buttongroup-022-accent:light-dark(oklch(0.52 0.16 39.8),oklch(0.76 0.13 39.8));
--vibeui-buttongroup-022-radius:0.625rem;
--vibeui-buttongroup-022-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-022"]{color-scheme:dark}
[data-vibeui-block="buttongroup-022"]{
box-sizing:border-box;display:inline-flex;isolation:isolate;
border:1px solid var(--vibeui-buttongroup-022-border);
border-radius:var(--vibeui-buttongroup-022-radius);
background:var(--vibeui-buttongroup-022-surface);
font-family:var(--vibeui-buttongroup-022-font);
}
[data-vibeui-block="buttongroup-022"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-022"] button{
appearance:none;cursor:pointer;font:inherit;
position:relative;z-index:0;
display:inline-flex;align-items:center;justify-content:center;
height:2.25rem;border:0;background:transparent;
color:var(--vibeui-buttongroup-022-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="buttongroup-022"] button + button{
border-inline-start:1px solid var(--vibeui-buttongroup-022-border);
}
[data-vibeui-block="buttongroup-022"] [data-part="step"]{width:2.25rem}
[data-vibeui-block="buttongroup-022"] [data-part="step"] svg{
width:1rem;height:1rem;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;
}
/* Ширина зафиксирована: иначе «100 %» толкает кнопки при каждом шаге. */
[data-vibeui-block="buttongroup-022"] [data-part="value"]{
min-width:4rem;padding:0 0.5rem;
color:var(--vibeui-buttongroup-022-fg);
font-size:0.8125rem;font-weight:650;line-height:1;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="buttongroup-022"] button:hover:not(:disabled){
background:var(--vibeui-buttongroup-022-hover);color:var(--vibeui-buttongroup-022-fg);
}
[data-vibeui-block="buttongroup-022"] button:disabled{opacity:.35;cursor:not-allowed}
[data-vibeui-block="buttongroup-022"] button:focus-visible{
z-index:1;outline:2px solid var(--vibeui-buttongroup-022-accent);outline-offset:-2px;
}
[data-vibeui-block="buttongroup-022"] :first-child{
border-start-start-radius:calc(var(--vibeui-buttongroup-022-radius) - 1px);
border-end-start-radius:calc(var(--vibeui-buttongroup-022-radius) - 1px);
}
[data-vibeui-block="buttongroup-022"] :last-child{
border-start-end-radius:calc(var(--vibeui-buttongroup-022-radius) - 1px);
border-end-end-radius:calc(var(--vibeui-buttongroup-022-radius) - 1px);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-022"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS = [25, 50, 75, 100, 125, 150, 200, 300]

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
 * Регулятор масштаба «минус — значение — плюс» с шагами по привычным числам.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup022({
  steps = DEFAULT_STEPS,
  defaultValue = 100,
  label = "Масштаб",
  decreaseLabel = "Уменьшить масштаб",
  increaseLabel = "Увеличить масштаб",
  valueLabel = "Масштаб {value} процентов, вернуть {default}",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup022Props) {
  const [zoom, setZoom] = useState(defaultValue)
  const index = Math.max(
    0,
    steps.findIndex((step) => step === zoom),
  )

  const move = (delta: number) => {
    const next = steps[Math.min(steps.length - 1, Math.max(0, index + delta))]
    setZoom(next)
    onChange?.(next)
  }

  const palette = {
    ...(accent ? { "--vibeui-buttongroup-022-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-022-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-022" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-022"
        className={className}
        style={palette}
        role="group"
        aria-label={label}
      >
        <button
          type="button"
          data-part="step"
          onClick={() => move(-1)}
          disabled={index === 0}
          aria-label={decreaseLabel}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14" />
          </svg>
        </button>
        <button
          type="button"
          data-part="value"
          onClick={() => {
            setZoom(defaultValue)
            onChange?.(defaultValue)
          }}
          aria-label={valueLabel
            .replace("{value}", String(zoom))
            .replace("{default}", String(defaultValue))}
        >
          <span aria-hidden="true">{zoom} %</span>
        </button>
        <button
          type="button"
          data-part="step"
          onClick={() => move(1)}
          disabled={index === steps.length - 1}
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

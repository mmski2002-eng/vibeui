"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type SliderMark = {
  value: number
  label: string
}

export type Slider010Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  unit?: string
  marks?: SliderMark[]
  accent?: string
}

// Идея компонента: непрерывный ползунок с делениями-ориентирами на
// произвольных значениях, а не через равную сетку колонок. Каждое деление и
// подпись под ним стоят на собственном проценте от диапазона, поэтому шкала
// с неравномерным шагом (6, 12, 24, 36…) остаётся читаемой, а ручка при
// этом свободно едет между делениями — в отличие от шага по ступеням.
const DEFAULT_MARKS: SliderMark[] = [
  { value: 6, label: "6" },
  { value: 12, label: "12" },
  { value: 24, label: "24" },
  { value: 36, label: "36" },
  { value: 48, label: "48" },
  { value: 60, label: "60" },
]

const STYLES = `
:where([data-vibeui-block="slider-010"]){
--vibeui-slider-010-bg:oklch(1 0 0);
--vibeui-slider-010-fg:oklch(0.22 0.014 265);
--vibeui-slider-010-muted:oklch(0.55 0.014 265);
--vibeui-slider-010-border:oklch(0.9 0.006 265);
--vibeui-slider-010-track:oklch(0.92 0.006 265);
--vibeui-slider-010-mark:oklch(0.75 0.012 265);
--vibeui-slider-010-accent:oklch(0.55 0.17 230);
--vibeui-slider-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-slider-010-fill:40%;
}
[data-vibeui-block="slider-010"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-slider-010-bg);
border:1px solid var(--vibeui-slider-010-border);border-radius:0.875rem;
font-family:var(--vibeui-slider-010-font);color:var(--vibeui-slider-010-fg);
}
[data-vibeui-block="slider-010"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:1rem;font-size:0.8125rem;
}
[data-vibeui-block="slider-010"] [data-part="label"]{font-weight:600}
[data-vibeui-block="slider-010"] [data-part="value"]{font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="slider-010"] [data-part="rail"]{position:relative}
[data-vibeui-block="slider-010"] input{
appearance:none;width:100%;height:1.25rem;margin:0;background:none;cursor:pointer;display:block;
}
[data-vibeui-block="slider-010"] input::-webkit-slider-runnable-track{
height:0.375rem;border-radius:9999px;
background:linear-gradient(to right,var(--vibeui-slider-010-accent) var(--vibeui-slider-010-fill),var(--vibeui-slider-010-track) var(--vibeui-slider-010-fill));
}
[data-vibeui-block="slider-010"] input::-moz-range-track{
height:0.375rem;border-radius:9999px;
background:linear-gradient(to right,var(--vibeui-slider-010-accent) var(--vibeui-slider-010-fill),var(--vibeui-slider-010-track) var(--vibeui-slider-010-fill));
}
[data-vibeui-block="slider-010"] input::-webkit-slider-thumb{
appearance:none;margin-top:-0.34375rem;
width:1.0625rem;height:1.0625rem;border-radius:9999px;
background:var(--vibeui-slider-010-accent);border:3px solid var(--vibeui-slider-010-bg);
box-shadow:0 1px 4px oklch(0.2 0.02 265 / 30%);
}
[data-vibeui-block="slider-010"] input::-moz-range-thumb{
width:1.0625rem;height:1.0625rem;border-radius:9999px;box-sizing:border-box;
background:var(--vibeui-slider-010-accent);border:3px solid var(--vibeui-slider-010-bg);
}
[data-vibeui-block="slider-010"] input:focus-visible{outline:2px solid var(--vibeui-slider-010-accent);outline-offset:4px;border-radius:0.5rem}
/* Деления рисуются отдельным слоем поверх дорожки, на своём проценте от
   ширины каждый: input остаётся кликабельным, слой лишь визуальный. */
[data-vibeui-block="slider-010"] [data-part="ticks"]{
position:absolute;left:0;right:0;top:0.4375rem;height:0.375rem;pointer-events:none;
}
[data-vibeui-block="slider-010"] [data-part="tick"]{
position:absolute;top:-0.125rem;width:2px;height:0.625rem;
background:var(--vibeui-slider-010-mark);border-radius:1px;transform:translateX(-1px);
}
/* Подписи стоят под своими делениями на тех же процентах, поэтому это
   абсолютные узлы, а не колонки грида: шаг между метками не равномерный. */
[data-vibeui-block="slider-010"] [data-part="marks"]{
position:relative;height:1rem;margin-top:0.25rem;
font-size:0.6875rem;color:var(--vibeui-slider-010-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="slider-010"] [data-part="mark"]{position:absolute;top:0;transform:translateX(-50%);white-space:nowrap}
[data-vibeui-block="slider-010"] [data-part="mark"]:first-child{transform:translateX(0)}
[data-vibeui-block="slider-010"] [data-part="mark"]:last-child{transform:translateX(-100%)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="slider-010"] *{animation:none!important;transition:none!important}}
`

/**
 * Непрерывный ползунок с делениями на произвольных значениях диапазона.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Slider010({
  label = "Срок кредита",
  min = 0,
  max = 60,
  step = 1,
  defaultValue = 24,
  unit = " мес.",
  marks = DEFAULT_MARKS,
  accent,
  className,
  style,
  ...props
}: Slider010Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const percent = (mark: number) => ((mark - min) / (max - min)) * 100

  const palette = {
    "--vibeui-slider-010-fill": `${percent(value)}%`,
    ...(accent ? { "--vibeui-slider-010-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-slider-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="slider-010"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <label data-part="label" htmlFor={id}>
            {label}
          </label>
          <span data-part="value">
            {value}
            {unit}
          </span>
        </div>
        <div data-part="rail">
          <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            aria-valuetext={`${value}${unit}`}
            onChange={(event) => setValue(Number(event.target.value))}
          />
          <span data-part="ticks" aria-hidden="true">
            {marks.map((mark) => (
              <span
                key={mark.value}
                data-part="tick"
                style={{ left: `${percent(mark.value)}%` }}
              />
            ))}
          </span>
        </div>
        <div data-part="marks" aria-hidden="true">
          {marks.map((mark) => (
            <span
              key={mark.value}
              data-part="mark"
              style={{ left: `${percent(mark.value)}%` }}
            >
              {mark.label}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}

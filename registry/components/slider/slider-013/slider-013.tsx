"use client"

import type { ComponentProps, CSSProperties } from "react"

export type Slider013Props = Omit<
  ComponentProps<"input">,
  "type" | "value" | "onChange" | "min" | "max" | "step"
> & {
  value?: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
  /** Фон ручки: блок передаёт свою подложку, чтобы кольцо стояло на «своём» цвете. */
  surface?: string
  /** Неоновое свечение дорожки и ручки для тёмных блоков. */
  glow?: boolean
  accent?: string
}

// Идея компонента: голый ползунок без рамки и подписи — блок сам рисует
// цифру, деления и итог там, где ему нужно. Здесь только дорожка с
// закрашенной частью и кольцо-ручка на цвете подложки: так одна деталь
// управления одинаково живёт в калькуляторах цены, планах и настройках.
const STYLES = `
:where([data-vibeui-block="slider-013"]){
--vibeui-slider-013-surface:light-dark(oklch(1 0 0),oklch(0.2 0 265));
--vibeui-slider-013-track:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-slider-013-accent:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
--vibeui-slider-013-fill:50%;
--vibeui-slider-013-halo:color-mix(in oklab,var(--vibeui-slider-013-accent) 20%,transparent);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="slider-013"]{color-scheme:dark}
[data-vibeui-block="slider-013"]{
-webkit-appearance:none;appearance:none;display:block;width:100%;height:1.5rem;margin:0;padding:0;
background:transparent;cursor:pointer;box-sizing:border-box;
}
[data-vibeui-block="slider-013"]::-webkit-slider-runnable-track{
height:0.5rem;border-radius:999px;
background:linear-gradient(90deg,var(--vibeui-slider-013-accent) var(--vibeui-slider-013-fill),var(--vibeui-slider-013-track) var(--vibeui-slider-013-fill));
}
[data-vibeui-block="slider-013"]::-moz-range-track{height:0.5rem;border-radius:999px;background:var(--vibeui-slider-013-track)}
[data-vibeui-block="slider-013"]::-moz-range-progress{height:0.5rem;border-radius:999px;background:var(--vibeui-slider-013-accent)}
[data-vibeui-block="slider-013"]::-webkit-slider-thumb{
-webkit-appearance:none;appearance:none;width:1.4rem;height:1.4rem;margin-top:-0.45rem;border-radius:50%;
background:var(--vibeui-slider-013-surface);border:3px solid var(--vibeui-slider-013-accent);
box-shadow:0 0 0 6px var(--vibeui-slider-013-halo);cursor:grab;
transition:box-shadow 0.3s,transform 0.3s cubic-bezier(0.2,0.8,0.2,1);
}
[data-vibeui-block="slider-013"]::-moz-range-thumb{
width:1.4rem;height:1.4rem;border-radius:50%;box-sizing:border-box;
background:var(--vibeui-slider-013-surface);border:3px solid var(--vibeui-slider-013-accent);
box-shadow:0 0 0 6px var(--vibeui-slider-013-halo);cursor:grab;
}
[data-vibeui-block="slider-013"]:hover::-webkit-slider-thumb{transform:scale(1.12)}
[data-vibeui-block="slider-013"]:active::-webkit-slider-thumb{cursor:grabbing;transform:scale(1.2)}
[data-vibeui-block="slider-013"]:focus-visible{outline:2px solid var(--vibeui-slider-013-accent);outline-offset:6px;border-radius:0.5rem}
/* Неон: ручка и пройденная часть светятся своим цветом, как на тёмных тарифах. */
[data-vibeui-block="slider-013"][data-glow]::-webkit-slider-runnable-track{height:4px;box-shadow:0 0 8px color-mix(in oklab,var(--vibeui-slider-013-accent) 40%,transparent)}
[data-vibeui-block="slider-013"][data-glow]::-moz-range-track,[data-vibeui-block="slider-013"][data-glow]::-moz-range-progress{height:4px}
[data-vibeui-block="slider-013"][data-glow]::-webkit-slider-thumb{margin-top:-0.55rem;border-width:2px;box-shadow:0 0 12px var(--vibeui-slider-013-accent),0 0 30px color-mix(in oklab,var(--vibeui-slider-013-accent) 50%,transparent)}
[data-vibeui-block="slider-013"][data-glow]::-moz-range-thumb{border-width:2px;box-shadow:0 0 12px var(--vibeui-slider-013-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="slider-013"]{transition:none!important}[data-vibeui-block="slider-013"]::-webkit-slider-thumb{transition:none!important}}
`

/** Голый ползунок: дорожка с заливкой и кольцо-ручка, без рамки и подписи. */
export function Slider013({
  value = 50,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  surface = "Голый ползунок",
  glow = false,
  accent,
  className,
  style,
  ...props
}: Slider013Props) {
  const fill = `${((value - min) / (max - min)) * 100}%`
  const palette = {
    "--vibeui-slider-013-fill": fill,
    ...(accent ? { "--vibeui-slider-013-accent": accent } : null),
    ...(surface ? { "--vibeui-slider-013-surface": surface } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-slider-013" precedence="medium">
        {STYLES}
      </style>
      <input
        {...props}
        type="range"
        data-slot="slider"
        data-vibeui-block="slider-013"
        data-glow={glow ? "" : undefined}
        className={className}
        style={palette}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange?.(Number(event.target.value))}
      />
    </>
  )
}

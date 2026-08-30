import type { CSSProperties } from "react"

export type Sparkline001Props = {
  values?: number[]
  label?: string
  /** Текущее значение крупно слева от кривой. */
  value?: string
  /** Изменение за период: положительное растёт, отрицательное падает. */
  delta?: number
  unit?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: график размером со строку, который стоит рядом с числом,
// а не вместо него. Число отвечает «сколько», кривая — «куда идёт», и вместе
// они занимают место одной ячейки таблицы. Цвет считается из знака изменения,
// поэтому падение нельзя случайно покрасить в зелёный.
const STYLES = `
:where([data-vibeui-block="sparkline-001"]){
--vibeui-sparkline-001-surface:oklch(1 0 0);
--vibeui-sparkline-001-surface-border:oklch(0.91 0.006 265);
--vibeui-sparkline-001-fg:oklch(0.24 0.016 265);
--vibeui-sparkline-001-muted:oklch(0.55 0.014 265);
--vibeui-sparkline-001-up:oklch(0.58 0.15 152);
--vibeui-sparkline-001-down:oklch(0.56 0.19 25);
--vibeui-sparkline-001-accent:var(--vibeui-sparkline-001-up);
--vibeui-sparkline-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Собственная подложка: строка показателя — это текст, и на тёмной
   странице он обязан читаться без правки палитры проекта. */
[data-vibeui-block="sparkline-001"]{
box-sizing:border-box;padding:0.625rem 0.75rem;
background:var(--vibeui-sparkline-001-surface);
border:1px solid var(--vibeui-sparkline-001-surface-border);border-radius:0.75rem;
display:inline-flex;align-items:center;gap:0.75rem;
font-family:var(--vibeui-sparkline-001-font);color:var(--vibeui-sparkline-001-fg);
}
[data-vibeui-block="sparkline-001"][data-trend="down"]{--vibeui-sparkline-001-accent:var(--vibeui-sparkline-001-down)}
[data-vibeui-block="sparkline-001"][data-trend="flat"]{--vibeui-sparkline-001-accent:var(--vibeui-sparkline-001-muted)}
[data-vibeui-block="sparkline-001"] [data-part="text"]{display:flex;flex-direction:column;gap:0.0625rem}
[data-vibeui-block="sparkline-001"] [data-part="label"]{font-size:0.6875rem;color:var(--vibeui-sparkline-001-muted)}
[data-vibeui-block="sparkline-001"] [data-part="value"]{
font-size:1.125rem;font-weight:650;line-height:1.1;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="sparkline-001"] [data-part="chart"]{display:flex;align-items:center;gap:0.4375rem}
[data-vibeui-block="sparkline-001"] svg{display:block;width:5.5rem;height:1.75rem;overflow:visible}
[data-vibeui-block="sparkline-001"] [data-part="line"]{
fill:none;stroke:var(--vibeui-sparkline-001-accent);stroke-width:1.5;
stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke;
}
[data-vibeui-block="sparkline-001"] [data-part="dot"]{fill:var(--vibeui-sparkline-001-accent)}
[data-vibeui-block="sparkline-001"] [data-part="delta"]{
display:inline-flex;align-items:center;gap:0.1875rem;
font-size:0.75rem;font-weight:600;font-variant-numeric:tabular-nums;
color:var(--vibeui-sparkline-001-accent);
}
[data-vibeui-block="sparkline-001"] [data-part="arrow"]{
width:0.3125rem;height:0.3125rem;
border-top:1.5px solid currentColor;border-right:1.5px solid currentColor;
transform:rotate(-45deg);
}
[data-vibeui-block="sparkline-001"][data-trend="down"] [data-part="arrow"]{transform:rotate(135deg)}
[data-vibeui-block="sparkline-001"][data-trend="flat"] [data-part="arrow"]{transform:rotate(45deg) scale(0.8)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sparkline-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_VALUES = [12, 15, 13, 19, 17, 24, 22, 28, 31, 29, 36, 41]
const WIDTH = 88
const HEIGHT = 28

/**
 * Мини-график размером со строку: число, кривая и изменение за период.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sparkline001({
  values = DEFAULT_VALUES,
  label = "Установок за месяц",
  value = "1 284",
  delta = 12.4,
  unit = "%",
  accent,
  className,
  style,
}: Sparkline001Props) {
  const palette = {
    ...(accent ? { "--vibeui-sparkline-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  const max = Math.max(...values)
  const min = Math.min(...values)
  const span = max - min || 1
  const points = values.map((point, index) => ({
    x: (index / Math.max(1, values.length - 1)) * WIDTH,
    y: HEIGHT - ((point - min) / span) * HEIGHT,
  }))

  const line = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ")
  const tail = points[points.length - 1]
  const trend = delta > 0.5 ? "up" : delta < -0.5 ? "down" : "flat"

  return (
    <>
      <style href="vibeui-sparkline-001" precedence="medium">
        {STYLES}
      </style>
      <span
        data-vibeui-block="sparkline-001"
        data-trend={trend}
        className={className}
        style={palette}
      >
        <span data-part="text">
          <span data-part="label">{label}</span>
          <span data-part="value">{value}</span>
        </span>
        <span data-part="chart">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            preserveAspectRatio="none"
            role="img"
            aria-label={`${label}: ${value}, изменение ${delta}${unit}`}
          >
            <path data-part="line" d={line} />
            <circle data-part="dot" cx={tail.x} cy={tail.y} r={2} />
          </svg>
          <span data-part="delta">
            <span data-part="arrow" aria-hidden="true" />
            {Math.abs(delta)}
            {unit}
          </span>
        </span>
      </span>
    </>
  )
}

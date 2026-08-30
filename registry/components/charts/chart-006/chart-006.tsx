import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Chart006Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "children" | "title"
> & {
  title?: string
  points?: number[]
  labels?: string[]
  unit?: string
  accent?: string
}

// Идея компонента: график с заливкой под линией на чистом SVG. Заливка
// подчёркивает объём, но линия остаётся главной: без неё площадь читается как
// клякса. Сетка нарисована тремя линиями — этого хватает, чтобы соотнести
// точку с осью, и не превращает график в тетрадь в клетку.
const STYLES = `
:where([data-vibeui-block="chart-006"]){
--vibeui-chart-006-bg:oklch(1 0 0);
--vibeui-chart-006-fg:oklch(0.22 0.014 265);
--vibeui-chart-006-muted:oklch(0.56 0.014 265);
--vibeui-chart-006-border:oklch(0.91 0.006 265);
--vibeui-chart-006-grid:oklch(0.94 0.004 265);
--vibeui-chart-006-accent:oklch(0.55 0.17 265);
--vibeui-chart-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="chart-006"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:24rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-006-bg);
border:1px solid var(--vibeui-chart-006-border);border-radius:0.875rem;
color:var(--vibeui-chart-006-fg);font-family:var(--vibeui-chart-006-font);
}
[data-vibeui-block="chart-006"] [data-part="head"]{display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem}
[data-vibeui-block="chart-006"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="chart-006"] [data-part="last"]{font-size:0.875rem;font-weight:680;font-variant-numeric:tabular-nums}
[data-vibeui-block="chart-006"] svg{display:block;width:100%;height:auto;overflow:visible}
[data-vibeui-block="chart-006"] [data-part="grid"]{stroke:var(--vibeui-chart-006-grid);stroke-width:1;vector-effect:non-scaling-stroke}
/* Заливка подчёркивает объём, линия остаётся главной. */
[data-vibeui-block="chart-006"] [data-part="area"]{fill:color-mix(in oklab,var(--vibeui-chart-006-accent) 14%,transparent)}
[data-vibeui-block="chart-006"] [data-part="line"]{
fill:none;stroke:var(--vibeui-chart-006-accent);stroke-width:2;
stroke-linejoin:round;stroke-linecap:round;vector-effect:non-scaling-stroke;
}
[data-vibeui-block="chart-006"] [data-part="dot"]{fill:var(--vibeui-chart-006-accent)}
[data-vibeui-block="chart-006"] [data-part="axis"]{
display:flex;justify-content:space-between;gap:0.5rem;
font-size:0.6875rem;color:var(--vibeui-chart-006-muted);
}
[data-vibeui-block="chart-006"] [data-part="unit"]{font-size:0.75rem;color:var(--vibeui-chart-006-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_POINTS = [18, 24, 21, 32, 29, 41, 38, 52]
const DEFAULT_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс", "Пн"]

/**
 * График с заливкой под линией на чистом SVG.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart006({
  title = "Установки компонентов",
  points = DEFAULT_POINTS,
  labels = DEFAULT_LABELS,
  unit = "установок в день",
  accent,
  className,
  style,
  ...props
}: Chart006Props) {
  const width = 300
  const height = 110
  const max = Math.max(...points, 1)
  const min = Math.min(...points, 0)
  const span = max - min || 1

  const coords = points.map((point, index) => {
    const x = (index / Math.max(1, points.length - 1)) * width
    const y = height - ((point - min) / span) * (height - 10) - 5
    return { x, y }
  })

  const line = coords
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ")
  const area = `${line} L${width} ${height} L0 ${height} Z`
  const last = coords[coords.length - 1]

  const palette = {
    ...(accent ? { "--vibeui-chart-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-006" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="chart-006"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <figcaption data-part="title">{title}</figcaption>
          <span data-part="last">{points[points.length - 1]}</span>
        </div>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={`${title}: от ${min} до ${max} ${unit}`}
        >
          {[0.25, 0.5, 0.75].map((step) => (
            <line
              key={step}
              data-part="grid"
              x1={0}
              x2={width}
              y1={height * step}
              y2={height * step}
            />
          ))}
          <path data-part="area" d={area} />
          <path data-part="line" d={line} />
          <circle data-part="dot" cx={last.x} cy={last.y} r={3.5} />
        </svg>
        <div data-part="axis">
          <span>{labels[0]}</span>
          <span>{labels[Math.floor(labels.length / 2)]}</span>
          <span>{labels[labels.length - 1]}</span>
        </div>
        <figcaption data-part="unit">{unit}</figcaption>
      </figure>
    </>
  )
}

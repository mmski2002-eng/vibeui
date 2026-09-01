import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Chart012Point = {
  label: string
  value: number
}

export type Chart012Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "children" | "title"
> & {
  title?: string
  points?: Chart012Point[]
  unit?: string
  showAverage?: boolean
  accent?: string
}

// Идея компонента: площадь с вертикальным градиентом вместо плоской заливки.
// Градиент гаснет к оси, поэтому площадь не спорит с линией за внимание, а
// пунктир среднего даёт линии точку отсчёта: без него «поднялось» и
// «опустилось» не с чем сравнить.
const STYLES = `
:where([data-vibeui-block="chart-012"]){
--vibeui-chart-012-bg:oklch(1 0 0);
--vibeui-chart-012-fg:oklch(0.22 0.014 265);
--vibeui-chart-012-muted:oklch(0.55 0.014 265);
--vibeui-chart-012-border:oklch(0.91 0.006 265);
--vibeui-chart-012-grid:oklch(0.94 0.005 265);
--vibeui-chart-012-accent:oklch(0.58 0.16 200);
--vibeui-chart-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="chart-012"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:30rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-012-bg);
border:1px solid var(--vibeui-chart-012-border);border-radius:0.875rem;
color:var(--vibeui-chart-012-fg);font-family:var(--vibeui-chart-012-font);
}
[data-vibeui-block="chart-012"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="chart-012"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="chart-012"] [data-part="now"]{
font-size:1.125rem;font-weight:700;font-variant-numeric:tabular-nums;
color:var(--vibeui-chart-012-accent);
}
[data-vibeui-block="chart-012"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="chart-012"] [data-part="grid"]{stroke:var(--vibeui-chart-012-grid);stroke-width:1}
[data-vibeui-block="chart-012"] [data-part="area"]{fill:url(#vibeui-chart-012-fade)}
[data-vibeui-block="chart-012"] [data-part="line"]{
fill:none;stroke:var(--vibeui-chart-012-accent);stroke-width:2;stroke-linejoin:round;
}
[data-vibeui-block="chart-012"] [data-part="average"]{
stroke:var(--vibeui-chart-012-muted);stroke-width:1;stroke-dasharray:4 3;
}
[data-vibeui-block="chart-012"] [data-part="average-text"]{
fill:var(--vibeui-chart-012-muted);font-size:8px;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-012"] [data-part="name"]{
fill:var(--vibeui-chart-012-muted);font-size:8.5px;text-anchor:middle;
}
[data-vibeui-block="chart-012"] [data-part="unit"]{margin:0;font-size:0.75rem;color:var(--vibeui-chart-012-muted)}
[data-vibeui-block="chart-012"] [data-part="data"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-012"] *{animation:none!important;transition:none!important}}
`

const LEFT = 6
const RIGHT = 294
const TOP = 10
const BASE = 112

const DEFAULT_POINTS: Chart012Point[] = [
  { label: "01", value: 240 },
  { label: "05", value: 310 },
  { label: "09", value: 286 },
  { label: "13", value: 402 },
  { label: "17", value: 368 },
  { label: "21", value: 455 },
  { label: "25", value: 520 },
  { label: "29", value: 610 },
]

/**
 * График площади с градиентной заливкой и линией среднего.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart012({
  title = "Трафик за месяц",
  points = DEFAULT_POINTS,
  unit = "визитов в день",
  showAverage = true,
  accent,
  className,
  style,
  ...props
}: Chart012Props) {
  const values = points.map((point) => point.value)
  const max = Math.max(...values, 1)
  const average = values.reduce((sum, value) => sum + value, 0) / values.length

  const place = (value: number, index: number) => ({
    x:
      LEFT +
      (points.length > 1 ? (index / (points.length - 1)) * (RIGHT - LEFT) : 0),
    y: BASE - (value / max) * (BASE - TOP),
  })

  const spots = points.map((point, index) => place(point.value, index))
  const line = spots
    .map((spot, index) => `${index === 0 ? "M" : "L"}${spot.x} ${spot.y}`)
    .join(" ")
  const area = `${line} L${RIGHT} ${BASE} L${LEFT} ${BASE} Z`
  const averageY = BASE - (average / max) * (BASE - TOP)

  const palette = {
    ...(accent ? { "--vibeui-chart-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-012" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="chart-012"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <figcaption data-part="title">{title}</figcaption>
          <span data-part="now">{values[values.length - 1]}</span>
        </div>
        <svg viewBox="0 0 300 130" aria-hidden="true" focusable="false">
          <defs>
            {/* Градиент гаснет к оси: площадь показывает объём, но не спорит
                с линией за внимание. */}
            <linearGradient
              id="vibeui-chart-012-fade"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="var(--vibeui-chart-012-accent)"
                stopOpacity="0.42"
              />
              <stop
                offset="100%"
                stopColor="var(--vibeui-chart-012-accent)"
                stopOpacity="0.02"
              />
            </linearGradient>
          </defs>
          {[TOP, (TOP + BASE) / 2, BASE].map((y) => (
            <line key={y} data-part="grid" x1={LEFT} y1={y} x2={RIGHT} y2={y} />
          ))}
          <path data-part="area" d={area} />
          <path data-part="line" d={line} />
          {showAverage ? (
            <g>
              <line
                data-part="average"
                x1={LEFT}
                y1={averageY}
                x2={RIGHT}
                y2={averageY}
              />
              <text data-part="average-text" x={LEFT + 2} y={averageY - 4}>
                среднее {Math.round(average)}
              </text>
            </g>
          ) : null}
          {points.map((point, index) => (
            <text
              key={point.label}
              data-part="name"
              x={spots[index].x}
              y={BASE + 14}
            >
              {point.label}
            </text>
          ))}
        </svg>
        <p data-part="unit">
          Единица измерения: {unit}. Максимум шкалы — {max}.
        </p>
        <table data-part="data">
          <caption>
            {title}, {unit}
          </caption>
          <tbody>
            {points.map((point) => (
              <tr key={point.label}>
                <th scope="row">{point.label}</th>
                <td>{point.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>
    </>
  )
}

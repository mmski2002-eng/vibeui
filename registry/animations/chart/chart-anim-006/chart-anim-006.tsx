import type { ComponentProps, CSSProperties } from "react"

export type ChartAnim006Point = {
  label: string
  value: number
}

export type ChartAnim006Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  /** Пилюля справа от заголовка: период среза. */
  period?: string
  /** Крупное число над графиком. */
  value?: string
  /** Изменение в процентах: знак определяет цвет пилюли тренда. */
  trend?: number
  points?: ChartAnim006Point[]
  accent?: string
  /** Заливка под линией градиентом. false — линия без заливки. */
  gradient?: boolean
  /** Линия и заливка растворяются к правому краю. */
  fadeOut?: boolean
  /** Изометрический наклон карточки. */
  isometric?: boolean
}

// Идея: линия рисуется слева направо при появлении. SVG-path получает
// pathLength=1 — единица штриха всегда равна всей длине пути независимо
// от реальной геометрии точек, поэтому анимация "от 1 до 0" одинакова для
// любых данных без пересчёта длины в JS. Заливка под линией проявляется
// следом отдельным затуханием непрозрачности.
const STYLES = `
:where([data-vibeui-block="chart-anim-006"]){
--vibeui-chart-anim-006-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-chart-anim-006-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-chart-anim-006-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-chart-anim-006-muted:color-mix(in oklab,var(--vibeui-chart-anim-006-fg) 62%,transparent);
--vibeui-chart-anim-006-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-chart-anim-006-grid:light-dark(oklch(0.93 0 0),oklch(0.3 0 0));
--vibeui-chart-anim-006-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-chart-anim-006-pos:light-dark(oklch(0.6 0.14 150),oklch(0.75 0.15 150));
--vibeui-chart-anim-006-neg:light-dark(oklch(0.6 0.19 25),oklch(0.72 0.18 25));
--vibeui-chart-anim-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-anim-006"]{color-scheme:dark}
[data-vibeui-block="chart-anim-006"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-chart-anim-006-fg);font-family:var(--vibeui-chart-anim-006-font);
}
[data-vibeui-block="chart-anim-006"] *{box-sizing:border-box}
[data-vibeui-block="chart-anim-006"] [data-part="stage"]{perspective:1400px}
[data-vibeui-block="chart-anim-006"] [data-part="frame"]{transition:transform .3s ease;transform-origin:center}
[data-vibeui-block="chart-anim-006"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-chart-anim-006-border);
background:var(--vibeui-chart-anim-006-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
padding:0.875rem 1rem 1rem;
}
[data-vibeui-block="chart-anim-006"] [data-part="head"]{
display:flex;align-items:flex-start;justify-content:space-between;gap:0.75rem;margin-bottom:0.5rem;
}
[data-vibeui-block="chart-anim-006"] [data-part="heading"]{display:flex;align-items:center;gap:0.375rem;min-width:0}
[data-vibeui-block="chart-anim-006"] [data-part="title"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="chart-anim-006"] [data-part="period"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
height:1rem;padding:0 0.375rem;border-radius:9999px;font-size:0.5625rem;font-weight:650;
color:var(--vibeui-chart-anim-006-muted);background:var(--vibeui-chart-anim-006-frame);
}
[data-vibeui-block="chart-anim-006"] [data-part="stat"]{display:flex;align-items:baseline;gap:0.5rem;flex:none}
[data-vibeui-block="chart-anim-006"] [data-part="value"]{font-size:1.375rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.02em}
[data-vibeui-block="chart-anim-006"] [data-part="trend"]{
display:inline-flex;align-items:center;height:1.0625rem;padding:0 0.375rem;border-radius:9999px;
font-size:0.625rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-anim-006"] [data-part="trend"][data-sign="pos"]{color:var(--vibeui-chart-anim-006-pos);background:color-mix(in oklab,var(--vibeui-chart-anim-006-pos) 16%,transparent)}
[data-vibeui-block="chart-anim-006"] [data-part="trend"][data-sign="neg"]{color:var(--vibeui-chart-anim-006-neg);background:color-mix(in oklab,var(--vibeui-chart-anim-006-neg) 16%,transparent)}
[data-vibeui-block="chart-anim-006"] svg{display:block;width:100%;height:6.5rem;overflow:visible}
[data-vibeui-block="chart-anim-006"] [data-part="grid"]{stroke:var(--vibeui-chart-anim-006-grid);stroke-width:1}
[data-vibeui-block="chart-anim-006"] [data-part="area"]{
fill:url(#vibeui-chart-anim-006-area);opacity:0;
animation:vibeui-chart-anim-006-fade .6s ease .75s both;
}
[data-vibeui-block="chart-anim-006"][data-gradient="false"] [data-part="area"]{display:none}
[data-vibeui-block="chart-anim-006"] [data-part="line"]{
fill:none;stroke:var(--vibeui-chart-anim-006-accent);stroke-width:2;
stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke;
stroke-dasharray:1;
animation:vibeui-chart-anim-006-draw 1s cubic-bezier(.16,1,.3,1) both;
}
[data-vibeui-block="chart-anim-006"][data-fade="true"] svg{
-webkit-mask-image:linear-gradient(to right,#000 72%,transparent 100%);
mask-image:linear-gradient(to right,#000 72%,transparent 100%);
}
[data-vibeui-block="chart-anim-006"] [data-part="axis"]{
display:flex;justify-content:space-between;gap:0.5rem;margin-top:0.25rem;
}
[data-vibeui-block="chart-anim-006"] [data-part="axis"] span{font-size:0.625rem;color:var(--vibeui-chart-anim-006-muted)}
[data-vibeui-block="chart-anim-006"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
@keyframes vibeui-chart-anim-006-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes vibeui-chart-anim-006-fade{from{opacity:0}to{opacity:1}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="chart-anim-006"] [data-part="line"]{animation:none;stroke-dashoffset:0}
[data-vibeui-block="chart-anim-006"] [data-part="area"]{animation:none;opacity:1}
}
`

const DEFAULT_POINTS: ChartAnim006Point[] = [
  { label: "Янв", value: 8200 },
  { label: "Мар", value: 9400 },
  { label: "Май", value: 8800 },
  { label: "Июл", value: 11200 },
  { label: "Сен", value: 12481 },
  { label: "Ноя", value: 13950 },
]

const WIDTH = 300
const HEIGHT = 100

/**
 * Анимированный линейный график: линия рисуется слева направо, следом
 * проявляется градиентная заливка. Один файл, ноль зависимостей,
 * собственная палитра, клиентского JS нет.
 */
export function ChartAnim006({
  title = "Активные пользователи",
  period = "с начала года",
  value = "12 481",
  trend = 24.1,
  points = DEFAULT_POINTS,
  accent,
  gradient = true,
  fadeOut = false,
  isometric = false,
  className,
  style,
  ...props
}: ChartAnim006Props) {
  const palette = {
    ...(accent ? { "--vibeui-chart-anim-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  const values = points.map((point) => point.value)
  const max = Math.max(...values)
  const min = Math.min(...values)
  const floor = min - (max - min) * 0.25
  const span = max - floor || 1

  const coords = points.map((point, index) => ({
    x: (index / Math.max(1, points.length - 1)) * WIDTH,
    y: HEIGHT - ((point.value - floor) / span) * HEIGHT,
  }))

  const line = coords
    .map((coord, index) => `${index === 0 ? "M" : "L"}${coord.x} ${coord.y}`)
    .join(" ")
  const area = `${line} L${WIDTH} ${HEIGHT} L0 ${HEIGHT} Z`

  const sign = trend >= 0 ? "pos" : "neg"
  const trendLabel = `${trend >= 0 ? "+" : ""}${trend.toFixed(1)}%`

  return (
    <>
      <style href="vibeui-chart-anim-006" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="chart-anim-006"
        data-slot="chart-line"
        data-fade={fadeOut ? "true" : undefined}
        data-gradient={gradient ? "true" : "false"}
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="frame" style={frameStyle}>
            <div data-part="card">
              <div data-part="head">
                <div data-part="heading">
                  <p data-part="title">{title}</p>
                  {period ? <span data-part="period">{period}</span> : null}
                </div>
                <div data-part="stat">
                  <span data-part="value">{value}</span>
                  <span data-part="trend" data-sign={sign}>
                    {trendLabel}
                  </span>
                </div>
              </div>
              <svg
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                preserveAspectRatio="none"
                role="img"
                aria-label={`${title}: ${points.map((point) => `${point.label} ${point.value}`).join(", ")}`}
              >
                <defs>
                  <linearGradient id="vibeui-chart-anim-006-area" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--vibeui-chart-anim-006-accent)" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="var(--vibeui-chart-anim-006-accent)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 0.5, 1].map((ratio) => (
                  <line
                    key={ratio}
                    data-part="grid"
                    x1={0}
                    x2={WIDTH}
                    y1={HEIGHT * ratio}
                    y2={HEIGHT * ratio}
                  />
                ))}
                <path data-part="area" d={area} />
                <path data-part="line" d={line} pathLength={1} />
              </svg>
              <div data-part="axis" aria-hidden="true">
                {points.map((point) => (
                  <span key={point.label}>{point.label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

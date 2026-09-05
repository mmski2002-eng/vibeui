import type { ComponentProps, CSSProperties } from "react"

export type ChartAnim007Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  label?: string
  value?: string
  /** Изменение в процентах: знак определяет цвет подписи. */
  trend?: number
  points?: number[]
  accent?: string
  /** Заливка под линией градиентом. false — только линия. */
  gradient?: boolean
  /** Линия растворяется к правому краю перед точкой-маркером. */
  fadeOut?: boolean
  /** Изометрический наклон карточки. */
  isometric?: boolean
}

// Идея: компактный инлайн-спарклайн для карточек метрик. Линия рисуется
// слева направо (pathLength=1 — единица штриха равна всей длине пути вне
// зависимости от реальных данных), в конце — точка-маркер с лёгким пульсом,
// который включается только после того, как линия дорисована.
const STYLES = `
:where([data-vibeui-block="chart-anim-007"]){
--vibeui-chart-anim-007-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-chart-anim-007-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-chart-anim-007-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-chart-anim-007-muted:color-mix(in oklab,var(--vibeui-chart-anim-007-fg) 62%,transparent);
--vibeui-chart-anim-007-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-chart-anim-007-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-chart-anim-007-pos:light-dark(oklch(0.6 0.14 150),oklch(0.75 0.15 150));
--vibeui-chart-anim-007-neg:light-dark(oklch(0.6 0.19 25),oklch(0.72 0.18 25));
--vibeui-chart-anim-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-anim-007"]{color-scheme:dark}
[data-vibeui-block="chart-anim-007"]{
display:block;box-sizing:border-box;width:100%;max-width:15rem;margin:0;
color:var(--vibeui-chart-anim-007-fg);font-family:var(--vibeui-chart-anim-007-font);
}
[data-vibeui-block="chart-anim-007"] *{box-sizing:border-box}
[data-vibeui-block="chart-anim-007"] [data-part="stage"]{perspective:1400px}
[data-vibeui-block="chart-anim-007"] [data-part="frame"]{transition:transform .3s ease;transform-origin:center}
[data-vibeui-block="chart-anim-007"] [data-part="card"]{
display:flex;align-items:center;gap:0.75rem;
border-radius:0.875rem;border:1px solid var(--vibeui-chart-anim-007-border);
background:var(--vibeui-chart-anim-007-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
padding:0.625rem 0.75rem;
}
[data-vibeui-block="chart-anim-007"] [data-part="info"]{min-width:0;flex:none}
[data-vibeui-block="chart-anim-007"] [data-part="label"]{
display:block;font-size:0.625rem;color:var(--vibeui-chart-anim-007-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:5rem;
}
[data-vibeui-block="chart-anim-007"] [data-part="stat"]{display:flex;align-items:baseline;gap:0.3125rem}
[data-vibeui-block="chart-anim-007"] [data-part="value"]{font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;font-variant-numeric:tabular-nums}
[data-vibeui-block="chart-anim-007"] [data-part="trend"]{font-size:0.625rem;font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="chart-anim-007"] [data-part="trend"][data-sign="pos"]{color:var(--vibeui-chart-anim-007-pos)}
[data-vibeui-block="chart-anim-007"] [data-part="trend"][data-sign="neg"]{color:var(--vibeui-chart-anim-007-neg)}
[data-vibeui-block="chart-anim-007"] [data-part="spark"]{flex:1;min-width:3.5rem;height:2rem;overflow:visible}
[data-vibeui-block="chart-anim-007"] [data-part="spark"] svg{display:block;width:100%;height:100%;overflow:visible}
[data-vibeui-block="chart-anim-007"] [data-part="area"]{fill:url(#vibeui-chart-anim-007-area);opacity:0;animation:vibeui-chart-anim-007-fade .5s ease .65s both}
[data-vibeui-block="chart-anim-007"][data-gradient="false"] [data-part="area"]{display:none}
[data-vibeui-block="chart-anim-007"] [data-part="line"]{
fill:none;stroke:var(--vibeui-chart-anim-007-accent);stroke-width:1.75;
stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke;
stroke-dasharray:1;animation:vibeui-chart-anim-007-draw .8s cubic-bezier(.16,1,.3,1) both;
}
[data-vibeui-block="chart-anim-007"][data-fade="true"] [data-part="spark"]{
-webkit-mask-image:linear-gradient(to right,#000 65%,transparent 96%);
mask-image:linear-gradient(to right,#000 65%,transparent 96%);
}
[data-vibeui-block="chart-anim-007"] [data-part="dot"]{fill:var(--vibeui-chart-anim-007-accent);opacity:0;animation:vibeui-chart-anim-007-fade .3s ease .8s both}
[data-vibeui-block="chart-anim-007"] [data-part="ping"]{
fill:none;stroke:var(--vibeui-chart-anim-007-accent);stroke-width:1.5;opacity:0;
animation:vibeui-chart-anim-007-ping 1.8s ease-out .8s infinite;
}
[data-vibeui-block="chart-anim-007"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
@keyframes vibeui-chart-anim-007-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes vibeui-chart-anim-007-fade{from{opacity:0}to{opacity:1}}
@keyframes vibeui-chart-anim-007-ping{0%{opacity:.55;r:2}80%,100%{opacity:0;r:6}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="chart-anim-007"] [data-part="line"]{animation:none;stroke-dashoffset:0}
[data-vibeui-block="chart-anim-007"] [data-part="area"]{animation:none;opacity:1}
[data-vibeui-block="chart-anim-007"] [data-part="dot"]{animation:none;opacity:1}
[data-vibeui-block="chart-anim-007"] [data-part="ping"]{animation:none;opacity:0}
}
`

const DEFAULT_POINTS = [8, 11, 9, 14, 12, 17, 15, 21]

const WIDTH = 100
const HEIGHT = 32

/**
 * Компактный инлайн-спарклайн: линия рисуется слева направо, в конце —
 * пульсирующая точка-маркер. Один файл, ноль зависимостей, собственная
 * палитра, клиентского JS нет.
 */
export function ChartAnim007({
  label = "Активные пользователи",
  value = "1 284",
  trend = 12.5,
  points = DEFAULT_POINTS,
  accent,
  gradient = true,
  fadeOut = false,
  isometric = false,
  className,
  style,
  ...props
}: ChartAnim007Props) {
  const palette = {
    ...(accent ? { "--vibeui-chart-anim-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  const max = Math.max(...points)
  const min = Math.min(...points)
  const span = max - min || 1
  const pad = 3

  const coords = points.map((point, index) => ({
    x: (index / Math.max(1, points.length - 1)) * WIDTH,
    y: pad + (HEIGHT - pad * 2) - ((point - min) / span) * (HEIGHT - pad * 2),
  }))

  const line = coords
    .map((coord, index) => `${index === 0 ? "M" : "L"}${coord.x} ${coord.y}`)
    .join(" ")
  const area = `${line} L${WIDTH} ${HEIGHT} L0 ${HEIGHT} Z`
  const last = coords[coords.length - 1]

  const sign = trend >= 0 ? "pos" : "neg"
  const trendLabel = `${trend >= 0 ? "+" : ""}${trend.toFixed(1)}%`

  return (
    <>
      <style href="vibeui-chart-anim-007" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="chart-anim-007"
        data-slot="chart-sparkline"
        data-fade={fadeOut ? "true" : undefined}
        data-gradient={gradient ? "true" : "false"}
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="frame" style={frameStyle}>
            <div data-part="card">
              <div data-part="info">
                <span data-part="label">{label}</span>
                <div data-part="stat">
                  <span data-part="value">{value}</span>
                  <span data-part="trend" data-sign={sign}>
                    {trendLabel}
                  </span>
                </div>
              </div>
              <div data-part="spark">
                <p data-part="sr">
                  {label}: {value}, {trendLabel}
                </p>
                <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" role="img" aria-hidden="true">
                  <defs>
                    <linearGradient id="vibeui-chart-anim-007-area" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="var(--vibeui-chart-anim-007-accent)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="var(--vibeui-chart-anim-007-accent)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path data-part="area" d={area} />
                  <path data-part="line" d={line} pathLength={1} />
                  <circle data-part="ping" cx={last.x} cy={last.y} r={2} />
                  <circle data-part="dot" cx={last.x} cy={last.y} r={2} />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

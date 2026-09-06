import type { ComponentProps, CSSProperties } from "react"

export type Metrics003Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  /** Слово «изменение» в строке для скринридера. */
  deltaWord?: string
  title?: string
  value?: number
  valuePrefix?: string
  valueSuffix?: string
  /** Знаковая дельта период-к-периоду в процентах, например 8.4 или -5.1. */
  deltaValue?: number
  periodLabel?: string
  /** Точки линии тренда, любое количество ≥ 2, масштабируются автоматически. */
  points?: number[]
  accent?: string
  /** Радужное свечение под карточкой (дышит). false — плоская карточка. */
  gradient?: boolean
  /** Изометрический наклон карточки. */
  isometric?: boolean
}

// Идея: крупное число метрики и мини-график тренда рядом. Линия — один SVG
// path с pathLength="1", поэтому stroke-dashoffset рисует её слева направо
// без вычисления реальной длины кривой (тот же приём, что в git-001).
// Заливка под линией — clip-path, раскрывающийся тем же таймингом. Число
// считается вверх через анимируемое @property, как в metrics-001/002.
// Направление (рост/падение) читается и по цвету линии, и по стрелке рядом
// с числом — не только по цвету, ради доступности для дальтоников.
const STYLES = `
:where([data-vibeui-block="metrics-003"]){
--vibeui-metrics-003-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-metrics-003-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-metrics-003-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-metrics-003-muted:color-mix(in oklab,var(--vibeui-metrics-003-fg) 60%,transparent);
--vibeui-metrics-003-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-metrics-003-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-metrics-003-pos:light-dark(oklch(0.6 0.17 145),oklch(0.78 0.15 145));
--vibeui-metrics-003-neg:light-dark(oklch(0.6 0.19 25),oklch(0.72 0.17 25));
--vibeui-metrics-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="metrics-003"]{color-scheme:dark}
@property --vibeui-metrics-003-n{
syntax:'<integer>';inherits:false;initial-value:0;
}
[data-vibeui-block="metrics-003"]{
display:block;box-sizing:border-box;width:100%;max-width:19rem;margin:0;
color:var(--vibeui-metrics-003-fg);font-family:var(--vibeui-metrics-003-font);
}
[data-vibeui-block="metrics-003"] *{box-sizing:border-box}
[data-vibeui-block="metrics-003"] [data-part="stage"]{perspective:1400px}
[data-vibeui-block="metrics-003"] [data-part="frame"]{
position:relative;isolation:isolate;padding:0.375rem;
border-radius:1.5rem;border:1px solid var(--vibeui-metrics-003-border);
background:color-mix(in oklab,var(--vibeui-metrics-003-frame) 75%,transparent);
transition:transform .3s ease;transform-origin:center;
}
[data-vibeui-block="metrics-003"] [data-part="glow"]{
position:absolute;left:0.3125rem;right:0.3125rem;bottom:0;height:4.5rem;z-index:0;
border-radius:9999px 9999px 0.75rem 0.75rem;
background:linear-gradient(to right,#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#6366f1,#8b5cf6);
filter:blur(7px);opacity:0.6;transform-origin:center bottom;
animation:vibeui-metrics-003-breathe 4.5s ease-in-out infinite;
}
[data-vibeui-block="metrics-003"][data-flat="true"] [data-part="glow"]{display:none}
[data-vibeui-block="metrics-003"] [data-part="card"]{
position:relative;z-index:1;
border-radius:1rem;border:1px solid var(--vibeui-metrics-003-border);
background:var(--vibeui-metrics-003-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
padding:0.875rem 1rem 1rem;
}
[data-vibeui-block="metrics-003"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="metrics-003"] [data-part="gtitle"]{
margin:0 0 0.25rem;font-size:0.6875rem;font-weight:650;color:var(--vibeui-metrics-003-muted);
}
[data-vibeui-block="metrics-003"] [data-part="valuewrap"]{display:flex;align-items:baseline;gap:0.375rem}
[data-vibeui-block="metrics-003"] [data-part="value"]{
font-size:1.625rem;font-weight:750;letter-spacing:-0.03em;line-height:1;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="metrics-003"] [data-part="count"]{
--vibeui-metrics-003-n:0;counter-reset:vibeui-metrics-003-c var(--vibeui-metrics-003-n);
animation:vibeui-metrics-003-count 1.2s cubic-bezier(.16,1,.3,1) both;
}
[data-vibeui-block="metrics-003"] [data-part="count"]::after{content:counter(vibeui-metrics-003-c)}
[data-vibeui-block="metrics-003"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.1875rem;white-space:nowrap;
height:1.0625rem;padding:0 0.375rem;border-radius:9999px;
font-size:0.5625rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="metrics-003"] [data-part="chip"] svg{width:0.5625rem;height:0.5625rem}
[data-vibeui-block="metrics-003"][data-trend="up"] [data-part="chip"]{
color:var(--vibeui-metrics-003-pos);
background:color-mix(in oklab,var(--vibeui-metrics-003-pos) 14%,transparent);
}
[data-vibeui-block="metrics-003"][data-trend="down"] [data-part="chip"]{
color:var(--vibeui-metrics-003-neg);
background:color-mix(in oklab,var(--vibeui-metrics-003-neg) 14%,transparent);
}
[data-vibeui-block="metrics-003"] [data-part="period"]{
margin:0.125rem 0 0;font-size:0.625rem;color:var(--vibeui-metrics-003-muted);
}
[data-vibeui-block="metrics-003"] [data-part="chart"]{margin-top:0.75rem}
[data-vibeui-block="metrics-003"] [data-part="chart"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="metrics-003"] [data-part="area"]{
opacity:0;
animation:vibeui-metrics-003-area .6s ease-out both;
animation-delay:.85s;
}
[data-vibeui-block="metrics-003"][data-trend="up"] [data-part="area"]{fill:var(--vibeui-metrics-003-pos)}
[data-vibeui-block="metrics-003"][data-trend="down"] [data-part="area"]{fill:var(--vibeui-metrics-003-neg)}
[data-vibeui-block="metrics-003"] [data-part="line"]{
fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;
stroke-dasharray:1;stroke-dashoffset:1;
animation:vibeui-metrics-003-draw .9s cubic-bezier(.16,1,.3,1) both;
animation-delay:.15s;
}
[data-vibeui-block="metrics-003"][data-trend="up"] [data-part="line"]{stroke:var(--vibeui-metrics-003-pos)}
[data-vibeui-block="metrics-003"][data-trend="down"] [data-part="line"]{stroke:var(--vibeui-metrics-003-neg)}
[data-vibeui-block="metrics-003"] [data-part="dot"]{
opacity:0;transform-box:fill-box;transform-origin:center;transform:scale(0.3);
animation:vibeui-metrics-003-pop .4s cubic-bezier(.34,1.56,.64,1) both;
animation-delay:1.02s;
}
[data-vibeui-block="metrics-003"][data-trend="up"] [data-part="dot"]{fill:var(--vibeui-metrics-003-pos)}
[data-vibeui-block="metrics-003"][data-trend="down"] [data-part="dot"]{fill:var(--vibeui-metrics-003-neg)}
[data-vibeui-block="metrics-003"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
@keyframes vibeui-metrics-003-breathe{0%,100%{transform:scaleX(0.8)}50%{transform:scaleX(1)}}
@keyframes vibeui-metrics-003-count{from{--vibeui-metrics-003-n:0}to{--vibeui-metrics-003-n:var(--vibeui-metrics-003-target)}}
@keyframes vibeui-metrics-003-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes vibeui-metrics-003-area{from{opacity:0}to{opacity:0.16}}
@keyframes vibeui-metrics-003-pop{
0%{opacity:0;transform:scale(0.3)}
70%{opacity:1;transform:scale(1.2)}
100%{opacity:1;transform:scale(1)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="metrics-003"] [data-part="glow"]{animation:none;transform:scaleX(0.92)}
[data-vibeui-block="metrics-003"] [data-part="count"]{animation:none;--vibeui-metrics-003-n:var(--vibeui-metrics-003-target)}
[data-vibeui-block="metrics-003"] [data-part="line"]{animation:none;stroke-dashoffset:0}
[data-vibeui-block="metrics-003"] [data-part="area"]{animation:none;opacity:0.16}
[data-vibeui-block="metrics-003"] [data-part="dot"]{animation:none;opacity:1;transform:scale(1)}
}
`

const ARROW_UP = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
)

const ARROW_DOWN = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
)

const DEFAULT_POINTS = [12, 18, 15, 24, 21, 30, 27, 38, 34, 44]

const CHART_WIDTH = 100
const CHART_HEIGHT = 32

function buildPath(points: number[]) {
  const min = Math.min(...points)
  const max = Math.max(...points)
  const span = max - min || 1
  const step = CHART_WIDTH / (points.length - 1 || 1)

  return points.map((point, index) => {
    const x = index * step
    const y = CHART_HEIGHT - ((point - min) / span) * (CHART_HEIGHT - 4) - 2
    return { x, y }
  })
}

/**
 * Метрика с мини-графиком тренда: число считается вверх, линия рисуется
 * слева направо, точка на конце всплывает следом. Один файл, ноль
 * зависимостей, собственная палитра, клиентского JS нет.
 */
export function Metrics003({
  deltaWord = "изменение",
  title = "Средний чек",
  value = 48,
  valuePrefix = "",
  valueSuffix = "K",
  deltaValue = 8.4,
  periodLabel = "vs прошлый месяц",
  points = DEFAULT_POINTS,
  accent,
  gradient = true,
  isometric = false,
  className,
  style,
  ...props
}: Metrics003Props) {
  const palette = {
    ...(accent ? { "--vibeui-metrics-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  const trend = deltaValue >= 0 ? "up" : "down"
  const deltaText = `${deltaValue >= 0 ? "+" : ""}${deltaValue}%`

  const coords = buildPath(points)
  const linePath = coords
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"}${point.x.toFixed(2)} ${point.y.toFixed(2)}`,
    )
    .join(" ")
  const areaPath = `${linePath} L${CHART_WIDTH} ${CHART_HEIGHT} L0 ${CHART_HEIGHT} Z`
  const last = coords[coords.length - 1]

  return (
    <>
      <style href="vibeui-metrics-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="metrics-003"
        data-slot="metrics-trend"
        data-trend={trend}
        data-flat={gradient ? undefined : "true"}
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="frame" style={frameStyle}>
            <div data-part="glow" aria-hidden="true" />
            <div data-part="card">
              <div data-part="head">
                <div>
                  <p data-part="gtitle">{title}</p>
                  <div data-part="valuewrap">
                    <span data-part="value">
                      {valuePrefix}
                      <span
                        data-part="count"
                        style={
                          {
                            "--vibeui-metrics-003-target": value,
                          } as CSSProperties
                        }
                      />
                      {valueSuffix}
                    </span>
                    <span data-part="chip" aria-hidden="true">
                      {trend === "up" ? ARROW_UP : ARROW_DOWN}
                      {deltaText}
                    </span>
                  </div>
                  {periodLabel ? <p data-part="period">{periodLabel}</p> : null}
                </div>
              </div>
              <div data-part="chart">
                <svg
                  viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                  preserveAspectRatio="none"
                  role="img"
                  aria-hidden="true"
                >
                  <path data-part="area" d={areaPath} />
                  <path data-part="line" pathLength={1} d={linePath} />
                  <circle data-part="dot" cx={last.x} cy={last.y} r="2.4" />
                </svg>
              </div>
              <p data-part="sr">
                {title}: {valuePrefix}
                {value}
                {valueSuffix}, {deltaWord} {deltaText} {periodLabel}.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

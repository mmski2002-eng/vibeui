import type { ComponentProps, CSSProperties } from "react"

export type ChartAnim001Point = {
  label: string
  value: number
}

export type ChartAnim001Props = Omit<
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
  points?: ChartAnim001Point[]
  accent?: string
  /** Заливка столбиков градиентом сверху вниз. false — плоский цвет. */
  gradient?: boolean
  /** Столбики растворяются к правому краю. */
  fadeOut?: boolean
  /** Изометрический наклон карточки. */
  isometric?: boolean
}

// Идея: столбиковая диаграмма растёт снизу вверх при появлении на экране.
// Каждый столбик — flex-элемент с заливкой внутри; заливка масштабируется
// по вертикали от 0 до 1 с задержкой, пропорциональной индексу (CSS-переменная
// --i, а не список nth-child, — работает для любого числа точек). Фоновая
// сетка — повторяющийся линейный градиент на дорожке столбиков.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, а класс
// .dark чужого проекта переводит компонент в тёмную ветку отдельной строкой.
const STYLES = `
:where([data-vibeui-block="chart-anim-001"]){
--vibeui-chart-anim-001-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-chart-anim-001-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-chart-anim-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-chart-anim-001-muted:color-mix(in oklab,var(--vibeui-chart-anim-001-fg) 62%,transparent);
--vibeui-chart-anim-001-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-chart-anim-001-grid:light-dark(oklch(0.93 0 0),oklch(0.3 0 0));
--vibeui-chart-anim-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-chart-anim-001-pos:light-dark(oklch(0.6 0.14 150),oklch(0.75 0.15 150));
--vibeui-chart-anim-001-neg:light-dark(oklch(0.6 0.19 25),oklch(0.72 0.18 25));
--vibeui-chart-anim-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-anim-001"]{color-scheme:dark}
[data-vibeui-block="chart-anim-001"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-chart-anim-001-fg);font-family:var(--vibeui-chart-anim-001-font);
}
[data-vibeui-block="chart-anim-001"] *{box-sizing:border-box}
[data-vibeui-block="chart-anim-001"] [data-part="stage"]{perspective:1400px}
[data-vibeui-block="chart-anim-001"] [data-part="frame"]{
transition:transform .3s ease;transform-origin:center;
}
[data-vibeui-block="chart-anim-001"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-chart-anim-001-border);
background:var(--vibeui-chart-anim-001-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
padding:0.875rem 1rem 1rem;
}
[data-vibeui-block="chart-anim-001"] [data-part="head"]{
display:flex;align-items:flex-start;justify-content:space-between;gap:0.75rem;margin-bottom:0.75rem;
}
[data-vibeui-block="chart-anim-001"] [data-part="heading"]{display:flex;align-items:center;gap:0.375rem;min-width:0}
[data-vibeui-block="chart-anim-001"] [data-part="title"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="chart-anim-001"] [data-part="period"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
height:1rem;padding:0 0.375rem;border-radius:9999px;font-size:0.5625rem;font-weight:650;
color:var(--vibeui-chart-anim-001-muted);background:var(--vibeui-chart-anim-001-frame);
}
[data-vibeui-block="chart-anim-001"] [data-part="stat"]{display:flex;align-items:baseline;gap:0.5rem;flex:none}
[data-vibeui-block="chart-anim-001"] [data-part="value"]{font-size:1.375rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.02em}
[data-vibeui-block="chart-anim-001"] [data-part="trend"]{
display:inline-flex;align-items:center;height:1.0625rem;padding:0 0.375rem;border-radius:9999px;
font-size:0.625rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-anim-001"] [data-part="trend"][data-sign="pos"]{
color:var(--vibeui-chart-anim-001-pos);background:color-mix(in oklab,var(--vibeui-chart-anim-001-pos) 16%,transparent);
}
[data-vibeui-block="chart-anim-001"] [data-part="trend"][data-sign="neg"]{
color:var(--vibeui-chart-anim-001-neg);background:color-mix(in oklab,var(--vibeui-chart-anim-001-neg) 16%,transparent);
}
[data-vibeui-block="chart-anim-001"] [data-part="plot"]{
position:relative;display:flex;align-items:flex-end;gap:0.5rem;height:6rem;
padding:0 0.125rem;border-radius:0.5rem;
background-image:repeating-linear-gradient(to top,var(--vibeui-chart-anim-001-grid) 0,var(--vibeui-chart-anim-001-grid) 1px,transparent 1px,transparent 25%);
}
[data-vibeui-block="chart-anim-001"][data-fade="true"] [data-part="plot"]{
-webkit-mask-image:linear-gradient(to right,#000 68%,transparent 100%);
mask-image:linear-gradient(to right,#000 68%,transparent 100%);
}
[data-vibeui-block="chart-anim-001"] [data-part="bar"]{
flex:1;display:flex;align-items:flex-end;height:100%;min-width:0;
}
[data-vibeui-block="chart-anim-001"] [data-part="bar-fill"]{
width:100%;height:var(--vibeui-chart-anim-001-v);border-radius:0.25rem 0.25rem 0 0;
background:var(--vibeui-chart-anim-001-accent);transform-origin:bottom;
animation:vibeui-chart-anim-001-grow .7s cubic-bezier(.16,1,.3,1) both;
animation-delay:calc(var(--vibeui-chart-anim-001-i,0) * 70ms);
}
[data-vibeui-block="chart-anim-001"][data-gradient="true"] [data-part="bar-fill"]{
background:linear-gradient(to top,var(--vibeui-chart-anim-001-accent),color-mix(in oklab,var(--vibeui-chart-anim-001-accent) 45%,transparent));
}
[data-vibeui-block="chart-anim-001"] [data-part="axis"]{
display:flex;gap:0.5rem;margin-top:0.5rem;padding:0 0.125rem;
}
[data-vibeui-block="chart-anim-001"] [data-part="axis"] span{
flex:1;text-align:center;font-size:0.625rem;color:var(--vibeui-chart-anim-001-muted);
}
[data-vibeui-block="chart-anim-001"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
@keyframes vibeui-chart-anim-001-grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="chart-anim-001"] [data-part="bar-fill"]{animation:none}
}
`

const DEFAULT_POINTS: ChartAnim001Point[] = [
  { label: "Пн", value: 32 },
  { label: "Вт", value: 41 },
  { label: "Ср", value: 38 },
  { label: "Чт", value: 55 },
  { label: "Пт", value: 62 },
  { label: "Сб", value: 47 },
  { label: "Вс", value: 58 },
]

/**
 * Анимированная столбиковая диаграмма: значение, пилюля тренда и сетка.
 * Столбики растут снизу вверх с задержкой по индексу. Один файл, ноль
 * зависимостей, собственная палитра, клиентского JS нет.
 */
export function ChartAnim001({
  title = "Выручка",
  period = "7д",
  value = "48,2k ₽",
  trend = 12.4,
  points = DEFAULT_POINTS,
  accent,
  gradient = true,
  fadeOut = false,
  isometric = false,
  className,
  style,
  ...props
}: ChartAnim001Props) {
  const palette = {
    ...(accent ? { "--vibeui-chart-anim-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  const max = Math.max(...points.map((point) => point.value), 1)
  const sign = trend >= 0 ? "pos" : "neg"
  const trendLabel = `${trend >= 0 ? "+" : ""}${trend.toFixed(1)}%`

  return (
    <>
      <style href="vibeui-chart-anim-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="chart-anim-001"
        data-slot="chart-bar"
        data-fade={fadeOut ? "true" : undefined}
        data-gradient={gradient ? "true" : undefined}
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
              <div data-part="plot">
                <p data-part="sr">
                  {title}: {points.map((point) => `${point.label} ${point.value}`).join(", ")}
                </p>
                {points.map((point, index) => (
                  <div data-part="bar" key={point.label} aria-hidden="true">
                    <span
                      data-part="bar-fill"
                      style={
                        {
                          "--vibeui-chart-anim-001-v": `${(point.value / max) * 100}%`,
                          "--vibeui-chart-anim-001-i": index,
                        } as CSSProperties
                      }
                    />
                  </div>
                ))}
              </div>
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

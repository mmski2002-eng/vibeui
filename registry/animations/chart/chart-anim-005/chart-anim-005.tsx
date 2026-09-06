import type { ComponentProps, CSSProperties } from "react"

export type ChartAnim005Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  /** Подписи шкалы интенсивности. */
  lessLabel?: string
  moreLabel?: string
  /** Строка для скринридера: {title}, {rows}, {cols}. */
  readTemplate?: string
  title?: string
  /** Пилюля справа от заголовка: период среза. */
  period?: string
  /** Крупное число над сеткой. */
  value?: string
  /** Изменение в процентах: знак определяет цвет пилюли тренда. */
  trend?: number
  rows?: string[]
  cols?: string[]
  /** Матрица интенсивности 0–1, строки × колонки. */
  data?: number[][]
  accent?: string
  /** Плавная заливка интенсивности. false — четыре ступени цвета. */
  gradient?: boolean
  /** Сетка растворяется к правому нижнему углу. */
  fadeOut?: boolean
  /** Изометрический наклон карточки. */
  isometric?: boolean
}

// Идея: сетка активности, где ячейки загораются диагональной волной —
// задержка появления ячейки растёт с суммой её строки и колонки (обычный
// animation-delay в инлайн-стиле, без custom properties). Цвет ячейки —
// смешение акцента с подложкой на долю интенсивности; при gradient=false
// доля округляется до одной из четырёх ступеней.
const STYLES = `
:where([data-vibeui-block="chart-anim-005"]){
--vibeui-chart-anim-005-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-chart-anim-005-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-chart-anim-005-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-chart-anim-005-muted:color-mix(in oklab,var(--vibeui-chart-anim-005-fg) 62%,transparent);
--vibeui-chart-anim-005-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-chart-anim-005-track:light-dark(oklch(0.93 0 0),oklch(0.3 0 0));
--vibeui-chart-anim-005-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-chart-anim-005-pos:light-dark(oklch(0.6 0.14 150),oklch(0.75 0.15 150));
--vibeui-chart-anim-005-neg:light-dark(oklch(0.6 0.19 25),oklch(0.72 0.18 25));
--vibeui-chart-anim-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-anim-005"]{color-scheme:dark}
[data-vibeui-block="chart-anim-005"]{
display:block;box-sizing:border-box;width:100%;max-width:22rem;margin:0;
color:var(--vibeui-chart-anim-005-fg);font-family:var(--vibeui-chart-anim-005-font);
}
[data-vibeui-block="chart-anim-005"] *{box-sizing:border-box}
[data-vibeui-block="chart-anim-005"] [data-part="stage"]{perspective:1400px}
[data-vibeui-block="chart-anim-005"] [data-part="frame"]{transition:transform .3s ease;transform-origin:center}
[data-vibeui-block="chart-anim-005"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-chart-anim-005-border);
background:var(--vibeui-chart-anim-005-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
padding:0.875rem 1rem 1rem;
}
[data-vibeui-block="chart-anim-005"] [data-part="head"]{
display:flex;align-items:flex-start;justify-content:space-between;gap:0.75rem;margin-bottom:0.75rem;
}
[data-vibeui-block="chart-anim-005"] [data-part="heading"]{display:flex;align-items:center;gap:0.375rem;min-width:0}
[data-vibeui-block="chart-anim-005"] [data-part="title"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="chart-anim-005"] [data-part="period"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
height:1rem;padding:0 0.375rem;border-radius:9999px;font-size:0.5625rem;font-weight:650;
color:var(--vibeui-chart-anim-005-muted);background:var(--vibeui-chart-anim-005-frame);
}
[data-vibeui-block="chart-anim-005"] [data-part="stat"]{display:flex;align-items:baseline;gap:0.5rem;flex:none}
[data-vibeui-block="chart-anim-005"] [data-part="value"]{font-size:1.125rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.02em}
[data-vibeui-block="chart-anim-005"] [data-part="trend"]{
display:inline-flex;align-items:center;height:1.0625rem;padding:0 0.375rem;border-radius:9999px;
font-size:0.625rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-anim-005"] [data-part="trend"][data-sign="pos"]{color:var(--vibeui-chart-anim-005-pos);background:color-mix(in oklab,var(--vibeui-chart-anim-005-pos) 16%,transparent)}
[data-vibeui-block="chart-anim-005"] [data-part="trend"][data-sign="neg"]{color:var(--vibeui-chart-anim-005-neg);background:color-mix(in oklab,var(--vibeui-chart-anim-005-neg) 16%,transparent)}
[data-vibeui-block="chart-anim-005"] [data-part="grid-wrap"]{display:flex;gap:0.375rem}
[data-vibeui-block="chart-anim-005"][data-fade="true"] [data-part="grid-wrap"]{
-webkit-mask-image:linear-gradient(115deg,#000 55%,transparent 92%);
mask-image:linear-gradient(115deg,#000 55%,transparent 92%);
}
[data-vibeui-block="chart-anim-005"] [data-part="rowlabels"]{display:flex;flex-direction:column;gap:0.1875rem;justify-content:space-between}
[data-vibeui-block="chart-anim-005"] [data-part="rowlabels"] span{font-size:0.5625rem;color:var(--vibeui-chart-anim-005-muted);line-height:1.15rem}
[data-vibeui-block="chart-anim-005"] [data-part="grid-body"]{flex:1;display:flex;flex-direction:column;gap:0.1875rem}
[data-vibeui-block="chart-anim-005"] [data-part="row"]{display:flex;gap:0.1875rem}
[data-vibeui-block="chart-anim-005"] [data-part="cell"]{
flex:1;aspect-ratio:1;border-radius:0.25rem;background:var(--vibeui-chart-anim-005-track);
transform:scale(0.4);opacity:0;
animation:vibeui-chart-anim-005-glow .5s ease both;
}
[data-vibeui-block="chart-anim-005"] [data-part="collabels"]{display:flex;gap:0.1875rem;margin-top:0.3125rem}
[data-vibeui-block="chart-anim-005"] [data-part="collabels"] span{flex:1;text-align:center;font-size:0.5625rem;color:var(--vibeui-chart-anim-005-muted)}
[data-vibeui-block="chart-anim-005"] [data-part="legend"]{display:flex;align-items:center;gap:0.375rem;margin-top:0.625rem;font-size:0.5625rem;color:var(--vibeui-chart-anim-005-muted)}
[data-vibeui-block="chart-anim-005"] [data-part="scale"]{display:flex;gap:0.1875rem}
[data-vibeui-block="chart-anim-005"] [data-part="swatch"]{width:0.5rem;height:0.5rem;border-radius:0.15rem}
[data-vibeui-block="chart-anim-005"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
@keyframes vibeui-chart-anim-005-glow{from{opacity:0;transform:scale(0.4)}to{opacity:1;transform:scale(1)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="chart-anim-005"] [data-part="cell"]{animation:none;opacity:1;transform:none}
}
`

const DEFAULT_ROWS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
const DEFAULT_COLS = ["00", "04", "08", "12", "16", "20"]
const DEFAULT_DATA: number[][] = [
  [0.05, 0.1, 0.35, 0.55, 0.5, 0.2],
  [0.05, 0.12, 0.4, 0.6, 0.55, 0.25],
  [0.08, 0.15, 0.38, 0.65, 0.6, 0.3],
  [0.1, 0.18, 0.42, 0.7, 0.62, 0.32],
  [0.12, 0.2, 0.5, 0.85, 0.78, 0.45],
  [0.3, 0.35, 0.55, 0.7, 0.9, 0.7],
  [0.25, 0.2, 0.3, 0.4, 0.6, 0.55],
]

/**
 * Анимированная тепловая карта: ячейки загораются диагональной волной от
 * левого верхнего угла к правому нижнему. Один файл, ноль зависимостей,
 * собственная палитра, клиентского JS нет.
 */
export function ChartAnim005({
  lessLabel = "Меньше",
  moreLabel = "Больше",
  readTemplate = "{title}: сетка {rows} строк на {cols} колонок, интенсивность от низкой до высокой.",
  title = "Активные часы",
  period = "4нед",
  value = "312 сессии",
  trend = 18.6,
  rows = DEFAULT_ROWS,
  cols = DEFAULT_COLS,
  data = DEFAULT_DATA,
  accent,
  gradient = true,
  fadeOut = false,
  isometric = false,
  className,
  style,
  ...props
}: ChartAnim005Props) {
  const palette = {
    ...(accent ? { "--vibeui-chart-anim-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  const sign = trend >= 0 ? "pos" : "neg"
  const trendLabel = `${trend >= 0 ? "+" : ""}${trend.toFixed(1)}%`

  const intensity = (raw: number) => {
    const clamped = Math.min(1, Math.max(0, raw))
    return gradient ? clamped : Math.round(clamped * 4) / 4
  }

  return (
    <>
      <style href="vibeui-chart-anim-005" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="chart-anim-005"
        data-slot="chart-heatmap"
        data-fade={fadeOut ? "true" : undefined}
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
              <p data-part="sr">
                {readTemplate
                  .replace("{title}", title)
                  .replace("{rows}", String(rows.length))
                  .replace("{cols}", String(cols.length))}
              </p>
              <div data-part="grid-wrap">
                <div data-part="rowlabels" aria-hidden="true">
                  {rows.map((row) => (
                    <span key={row}>{row}</span>
                  ))}
                </div>
                <div data-part="grid-body">
                  <div aria-hidden="true">
                    {rows.map((row, rowIndex) => (
                      <div data-part="row" key={row}>
                        {cols.map((col, colIndex) => {
                          const raw = data[rowIndex]?.[colIndex] ?? 0
                          const level = intensity(raw)
                          return (
                            <span
                              data-part="cell"
                              key={col}
                              style={{
                                backgroundColor: `color-mix(in oklab, var(--vibeui-chart-anim-005-accent) ${Math.round(level * 100)}%, var(--vibeui-chart-anim-005-track))`,
                                animationDelay: `${(rowIndex + colIndex) * 45}ms`,
                              }}
                            />
                          )
                        })}
                      </div>
                    ))}
                  </div>
                  <div data-part="collabels" aria-hidden="true">
                    {cols.map((col) => (
                      <span key={col}>{col}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div data-part="legend" aria-hidden="true">
                <span>{lessLabel}</span>
                <span data-part="scale">
                  {[0.15, 0.4, 0.65, 0.9].map((level) => (
                    <span
                      data-part="swatch"
                      key={level}
                      style={{
                        background: `color-mix(in oklab, var(--vibeui-chart-anim-005-accent) ${Math.round(level * 100)}%, var(--vibeui-chart-anim-005-track))`,
                      }}
                    />
                  ))}
                </span>
                <span>{moreLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

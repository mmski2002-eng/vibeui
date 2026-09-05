import type { ComponentProps, CSSProperties } from "react"

export type ChartAnim002Segment = {
  label: string
  /** Доля сегмента в процентах; сумма сегментов должна давать 100. */
  percent: number
}

export type ChartAnim002Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  /** Крупное число в центре кольца. */
  centerValue?: string
  /** Подпись под центральным числом. */
  centerLabel?: string
  segments?: ChartAnim002Segment[]
  accent?: string
  /** Заливка колец SVG-градиентом. false — плоский цвет на сегмент. */
  gradient?: boolean
  /** Легенда растворяется к нижнему краю. */
  fadeOut?: boolean
  /** Изометрический наклон карточки. */
  isometric?: boolean
}

// Идея: кольцевая диаграмма, сегменты которой дорисовываются по очереди.
// Классический трюк viewBox 36×36 с r=15.9155 даёт длину окружности ровно
// 100 — доля сегмента становится длиной штриха без пересчёта периметра.
// Каждый сегмент повёрнут на свой стартовый угол статически, а анимируется
// только stroke-dasharray: "0 100" → "{len} {100-len}", с задержкой по
// индексу через CSS-переменную --i. Легенда появляется тем же приёмом.
const STYLES = `
:where([data-vibeui-block="chart-anim-002"]){
--vibeui-chart-anim-002-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-chart-anim-002-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-chart-anim-002-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-chart-anim-002-muted:color-mix(in oklab,var(--vibeui-chart-anim-002-fg) 62%,transparent);
--vibeui-chart-anim-002-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-chart-anim-002-track:light-dark(oklch(0.93 0 0),oklch(0.3 0 0));
--vibeui-chart-anim-002-c1:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-chart-anim-002-c2:light-dark(oklch(0.62 0.16 200),oklch(0.76 0.13 200));
--vibeui-chart-anim-002-c3:light-dark(oklch(0.68 0.16 150),oklch(0.8 0.13 150));
--vibeui-chart-anim-002-c4:light-dark(oklch(0.72 0.14 90),oklch(0.82 0.12 90));
--vibeui-chart-anim-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-anim-002"]{color-scheme:dark}
[data-vibeui-block="chart-anim-002"]{
display:block;box-sizing:border-box;width:100%;max-width:18rem;margin:0;
color:var(--vibeui-chart-anim-002-fg);font-family:var(--vibeui-chart-anim-002-font);
}
[data-vibeui-block="chart-anim-002"] *{box-sizing:border-box}
[data-vibeui-block="chart-anim-002"] [data-part="stage"]{perspective:1400px}
[data-vibeui-block="chart-anim-002"] [data-part="frame"]{transition:transform .3s ease;transform-origin:center}
[data-vibeui-block="chart-anim-002"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-chart-anim-002-border);
background:var(--vibeui-chart-anim-002-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
padding:0.875rem 1rem 1rem;
}
[data-vibeui-block="chart-anim-002"] [data-part="title"]{
margin:0 0 0.625rem;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="chart-anim-002"] [data-part="ring-wrap"]{
position:relative;display:flex;align-items:center;justify-content:center;
width:8rem;height:8rem;margin:0 auto;
}
[data-vibeui-block="chart-anim-002"] [data-part="ring-wrap"] svg{width:100%;height:100%;transform:rotate(-90deg)}
[data-vibeui-block="chart-anim-002"] [data-part="track"]{
fill:none;stroke:var(--vibeui-chart-anim-002-track);stroke-width:3.8;
}
[data-vibeui-block="chart-anim-002"] [data-part="seg"]{
fill:none;stroke-width:3.8;stroke-linecap:round;
animation:vibeui-chart-anim-002-draw .9s cubic-bezier(.16,1,.3,1) both;
animation-delay:calc(var(--vibeui-chart-anim-002-i,0) * 140ms);
}
[data-vibeui-block="chart-anim-002"] [data-part="center"]{
position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
transform:rotate(0deg);
}
[data-vibeui-block="chart-anim-002"] [data-part="center-value"]{font-size:1.25rem;font-weight:700;letter-spacing:-0.02em;font-variant-numeric:tabular-nums}
[data-vibeui-block="chart-anim-002"] [data-part="center-label"]{font-size:0.5625rem;color:var(--vibeui-chart-anim-002-muted)}
[data-vibeui-block="chart-anim-002"] [data-part="legend"]{
display:flex;flex-direction:column;gap:0.375rem;margin:0.875rem 0 0;padding:0;list-style:none;
}
[data-vibeui-block="chart-anim-002"][data-fade="true"] [data-part="legend"]{
-webkit-mask-image:linear-gradient(to bottom,#000 55%,transparent 100%);
mask-image:linear-gradient(to bottom,#000 55%,transparent 100%);
}
[data-vibeui-block="chart-anim-002"] [data-part="legend"] li{
display:flex;align-items:center;gap:0.5rem;font-size:0.6875rem;
animation:vibeui-chart-anim-002-rise .5s ease both;
animation-delay:calc(var(--vibeui-chart-anim-002-i,0) * 100ms + 260ms);
}
[data-vibeui-block="chart-anim-002"] [data-part="dot"]{width:0.5rem;height:0.5rem;border-radius:9999px;flex:none}
[data-vibeui-block="chart-anim-002"] [data-part="legend-label"]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--vibeui-chart-anim-002-muted)}
[data-vibeui-block="chart-anim-002"] [data-part="legend-percent"]{font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="chart-anim-002"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
@keyframes vibeui-chart-anim-002-draw{from{stroke-dasharray:0 100}to{stroke-dasharray:var(--vibeui-chart-anim-002-len) calc(100 - var(--vibeui-chart-anim-002-len))}}
@keyframes vibeui-chart-anim-002-rise{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="chart-anim-002"] [data-part="seg"]{animation:none;stroke-dasharray:var(--vibeui-chart-anim-002-len) calc(100 - var(--vibeui-chart-anim-002-len))}
[data-vibeui-block="chart-anim-002"] [data-part="legend"] li{animation:none}
}
`

const DEFAULT_SEGMENTS: ChartAnim002Segment[] = [
  { label: "Фото", percent: 38 },
  { label: "Видео", percent: 27 },
  { label: "Документы", percent: 18 },
  { label: "Прочее", percent: 17 },
]

const COLOR_VARS = [
  "--vibeui-chart-anim-002-c1",
  "--vibeui-chart-anim-002-c2",
  "--vibeui-chart-anim-002-c3",
  "--vibeui-chart-anim-002-c4",
]

/**
 * Анимированная кольцевая диаграмма: сегменты дорисовываются по очереди,
 * в центре — итоговое число, снизу — легенда. Один файл, ноль зависимостей,
 * собственная палитра, клиентского JS нет.
 */
export function ChartAnim002({
  title = "Использование хранилища",
  centerValue = "82%",
  centerLabel = "из 128 ГБ",
  segments = DEFAULT_SEGMENTS,
  accent,
  gradient = true,
  fadeOut = false,
  isometric = false,
  className,
  style,
  ...props
}: ChartAnim002Props) {
  const palette = {
    ...(accent ? { "--vibeui-chart-anim-002-c1": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  const arcs = segments.map((segment, index) => {
    const cumulative = segments
      .slice(0, index)
      .reduce((sum, previous) => sum + previous.percent, 0)
    const startDeg = (cumulative / 100) * 360
    const colorVar = COLOR_VARS[index % COLOR_VARS.length]
    return { ...segment, startDeg, colorVar, index }
  })

  return (
    <>
      <style href="vibeui-chart-anim-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="chart-anim-002"
        data-slot="chart-donut"
        data-fade={fadeOut ? "true" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="frame" style={frameStyle}>
            <div data-part="card">
              <p data-part="title">{title}</p>
              <div data-part="ring-wrap">
                <p data-part="sr">
                  {title}: {centerValue} {centerLabel}.{" "}
                  {segments.map((segment) => `${segment.label} ${segment.percent}%`).join(", ")}
                </p>
                <svg viewBox="0 0 36 36" role="img" aria-hidden="true">
                  <circle data-part="track" cx="18" cy="18" r="15.9155" />
                  {arcs.map((arc) =>
                    gradient ? (
                      <defs key={`grad-${arc.label}`}>
                        <linearGradient
                          id={`vibeui-chart-anim-002-grad-${arc.index}`}
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor={`var(${arc.colorVar})`} />
                          <stop
                            offset="100%"
                            stopColor={`color-mix(in oklab, var(${arc.colorVar}) 55%, transparent)`}
                          />
                        </linearGradient>
                      </defs>
                    ) : null,
                  )}
                  {arcs.map((arc) => (
                    <circle
                      key={arc.label}
                      data-part="seg"
                      cx="18"
                      cy="18"
                      r="15.9155"
                      stroke={
                        gradient
                          ? `url(#vibeui-chart-anim-002-grad-${arc.index})`
                          : `var(${arc.colorVar})`
                      }
                      transform={`rotate(${arc.startDeg} 18 18)`}
                      style={
                        {
                          "--vibeui-chart-anim-002-len": arc.percent,
                          "--vibeui-chart-anim-002-i": arc.index,
                        } as CSSProperties
                      }
                    />
                  ))}
                </svg>
                <div data-part="center" aria-hidden="true">
                  <span data-part="center-value">{centerValue}</span>
                  <span data-part="center-label">{centerLabel}</span>
                </div>
              </div>
              <ul data-part="legend" aria-hidden="true">
                {arcs.map((arc) => (
                  <li
                    key={arc.label}
                    style={{ "--vibeui-chart-anim-002-i": arc.index } as CSSProperties}
                  >
                    <span data-part="dot" style={{ background: `var(${arc.colorVar})` }} />
                    <span data-part="legend-label">{arc.label}</span>
                    <span data-part="legend-percent">{arc.percent}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

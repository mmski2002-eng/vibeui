import type { ComponentProps, CSSProperties } from "react"

export type Search003Point = {
  x: number
  y: number
  /** Семантически близкая точка — та, что загорается, когда волна доходит. */
  related?: boolean
}

export type Search003Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  query?: string
  points?: Search003Point[]
  accent?: string
  /** false — волна и подсветка останавливаются. */
  sweeping?: boolean
}

const CENTER = { x: 160, y: 100 }
const MAX_RADIUS = 132
const SWEEP_SECONDS = 3.2

function distanceFromCenter(point: Search003Point): number {
  return Math.hypot(point.x - CENTER.x, point.y - CENTER.y)
}

const DEFAULT_POINTS: Search003Point[] = [
  { x: 60, y: 50 },
  { x: 90, y: 152 },
  { x: 130, y: 38 },
  { x: 202, y: 58, related: true },
  { x: 170, y: 132, related: true },
  { x: 232, y: 150 },
  { x: 262, y: 68 },
  { x: 40, y: 112 },
  { x: 112, y: 172, related: true },
  { x: 282, y: 40 },
  { x: 150, y: 172 },
  { x: 222, y: 108, related: true },
  { x: 68, y: 82 },
  { x: 252, y: 160 },
  { x: 190, y: 172, related: true },
  { x: 30, y: 160 },
]

// Идея: запрос приземляется в центре абстрактного embedding space, и от него
// расходится волна радиуса (окружность, растянутая transform:scale от 0 до
// 1 — дешевле, чем анимировать SVG-атрибут r). У семантически близких точек
// (data-related) собственный keyframe стартует с задержкой, посчитанной из
// расстояния до центра: --vibeui-search-003-delay = (distance / MAX_RADIUS) *
// длительность волны, поэтому вспышка точки совпадает с моментом, когда
// волна её достигает. Далёкие несвязанные точки волну игнорируют — это и
// читается как «семантическая», а не просто пространственная близость.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="search-003"]){
--vibeui-search-003-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-search-003-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-search-003-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-search-003-muted:color-mix(in oklab,var(--vibeui-search-003-fg) 58%,transparent);
--vibeui-search-003-border:light-dark(oklch(0.92 0 0),oklch(0.28 0 0));
--vibeui-search-003-dim:light-dark(oklch(0.82 0.006 265),oklch(0.42 0.01 265));
--vibeui-search-003-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-search-003-accent-fg:oklch(from var(--vibeui-search-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-search-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="search-003"]{color-scheme:dark}
[data-vibeui-block="search-003"]{
display:block;box-sizing:border-box;width:100%;max-width:22rem;margin:0;
color:var(--vibeui-search-003-fg);font-family:var(--vibeui-search-003-font);
}
[data-vibeui-block="search-003"] *{box-sizing:border-box}
[data-vibeui-block="search-003"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-search-003-border);
background:var(--vibeui-search-003-card);overflow:hidden;
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="search-003"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.875rem;border-bottom:1px solid var(--vibeui-search-003-border);
}
[data-vibeui-block="search-003"] [data-part="title"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="search-003"] [data-part="query"]{
flex:none;max-width:9.5rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.6875rem;font-weight:550;color:var(--vibeui-search-003-accent);
}
[data-vibeui-block="search-003"] [data-part="stage"]{padding:0.5rem 0.5rem 0.75rem}
[data-vibeui-block="search-003"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="search-003"] [data-part="point"]{fill:var(--vibeui-search-003-dim)}
[data-vibeui-block="search-003"] [data-part="point"][data-related="true"]{
transform-box:fill-box;transform-origin:center;
animation:vibeui-search-003-light ${SWEEP_SECONDS}s ease-in-out infinite;
animation-delay:var(--vibeui-search-003-delay,0s);
}
[data-vibeui-block="search-003"] [data-part="sweep"]{
fill:none;stroke:var(--vibeui-search-003-accent);stroke-width:1.5;
transform-box:fill-box;transform-origin:center;
animation:vibeui-search-003-sweep ${SWEEP_SECONDS}s ease-out infinite;
}
[data-vibeui-block="search-003"] [data-part="qring"]{
fill:none;stroke:var(--vibeui-search-003-accent);stroke-width:1.5;
transform-box:fill-box;transform-origin:center;
animation:vibeui-search-003-ping 2s ease-out infinite;
}
[data-vibeui-block="search-003"] [data-part="qdot"]{fill:var(--vibeui-search-003-accent)}
[data-vibeui-block="search-003"][data-sweeping="false"] [data-part="point"],
[data-vibeui-block="search-003"][data-sweeping="false"] [data-part="sweep"],
[data-vibeui-block="search-003"][data-sweeping="false"] [data-part="qring"]{
animation-play-state:paused;
}
@keyframes vibeui-search-003-light{
0%{fill:var(--vibeui-search-003-accent);transform:scale(1.7)}
20%{fill:var(--vibeui-search-003-accent);transform:scale(1.1)}
45%,100%{fill:var(--vibeui-search-003-dim);transform:scale(1)}
}
@keyframes vibeui-search-003-sweep{
0%{transform:scale(0);opacity:0.9}
70%{opacity:0.35}
100%{transform:scale(1);opacity:0}
}
@keyframes vibeui-search-003-ping{
0%{transform:scale(0.8);opacity:0.7}
100%{transform:scale(2.6);opacity:0}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="search-003"] [data-part="point"][data-related="true"]{animation:none;fill:var(--vibeui-search-003-accent)}
[data-vibeui-block="search-003"] [data-part="sweep"]{animation:none;opacity:0}
[data-vibeui-block="search-003"] [data-part="qring"]{animation:none;opacity:0}
}
`

/**
 * Семантический поиск: запрос приземляется в центре embedding space, волна
 * радиуса расходится наружу и подсвечивает связанные точки в момент, когда
 * достигает их. Один файл, ноль зависимостей, собственная палитра.
 */
export function Search003({
  title = "Семантический поиск",
  query = "уютный свитер на зиму",
  points = DEFAULT_POINTS,
  accent,
  sweeping = true,
  className,
  style,
  ...props
}: Search003Props) {
  const palette = {
    ...(accent ? { "--vibeui-search-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-search-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="search-003"
        data-slot="search-semantic"
        data-sweeping={sweeping ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="head">
            <p data-part="title">{title}</p>
            <span data-part="query">«{query}»</span>
          </div>
          <div data-part="stage">
            <svg
              viewBox="0 0 320 200"
              role="img"
              aria-label={`${title}: ${query}`}
            >
              <circle data-part="sweep" cx={CENTER.x} cy={CENTER.y} r={MAX_RADIUS} />

              {points.map((point, index) => {
                const delay = point.related
                  ? (distanceFromCenter(point) / MAX_RADIUS) * SWEEP_SECONDS
                  : undefined
                const pointStyle = point.related
                  ? ({
                      "--vibeui-search-003-delay": `${delay?.toFixed(2)}s`,
                    } as CSSProperties)
                  : undefined

                return (
                  <circle
                    data-part="point"
                    data-related={point.related ? "true" : undefined}
                    style={pointStyle}
                    cx={point.x}
                    cy={point.y}
                    r={point.related ? 4 : 3}
                    key={index}
                  />
                )
              })}

              <circle data-part="qring" cx={CENTER.x} cy={CENTER.y} r="5" />
              <circle data-part="qdot" cx={CENTER.x} cy={CENTER.y} r="4" />
            </svg>
          </div>
        </div>
      </section>
    </>
  )
}

import type { ComponentProps, CSSProperties } from "react"

export type AiAnim001Stage = {
  label: string
}

export type AiAnim001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  badge?: string
  /** Ровно четыре этапа — под них рассчитана изометрическая лестница. */
  stages?: AiAnim001Stage[]
  accent?: string
  paused?: boolean
  /** false — подписи этапов скрыты, остаются только кубы. */
  labels?: boolean
}

const DEFAULT_STAGES: AiAnim001Stage[] = [
  { label: "Приём запроса" },
  { label: "Разбор контекста" },
  { label: "Вызов инструмента" },
  { label: "Ответ" },
]

type Point = { x: number; y: number }

function isoCube(cx: number, cy: number) {
  const r = 22
  const rh = 13
  const sh = 24

  const top: Point[] = [
    { x: cx, y: cy - rh },
    { x: cx + r, y: cy - rh / 2 },
    { x: cx, y: cy },
    { x: cx - r, y: cy - rh / 2 },
  ]
  const left: Point[] = [
    { x: cx - r, y: cy - rh / 2 },
    { x: cx, y: cy },
    { x: cx, y: cy + sh },
    { x: cx - r, y: cy + sh - rh / 2 },
  ]
  const right: Point[] = [
    { x: cx, y: cy },
    { x: cx + r, y: cy - rh / 2 },
    { x: cx + r, y: cy + sh - rh / 2 },
    { x: cx, y: cy + sh },
  ]

  const toPoints = (points: Point[]) =>
    points.map((point) => `${point.x},${point.y}`).join(" ")

  return { top: toPoints(top), left: toPoints(left), right: toPoints(right) }
}

const CENTERS: Point[] = [
  { x: 54, y: 168 },
  { x: 124, y: 136 },
  { x: 194, y: 104 },
  { x: 264, y: 72 },
]

const CUBES = CENTERS.map((center) => isoCube(center.x, center.y))

// Идея: изометрическая лестница из кубов — каждый куб этап конвейера
// агента. Три грани куба лежат в одной <g>, читают цвет через currentColor,
// а сама анимация крутит не заливку каждой грани отдельно, а `color`
// родителя от приглушённого к акцентному вместе с glow-тенью: кубы
// загораются по очереди снизу вверх, стагер задаётся отрицательным сдвигом
// фазы через animation-delay, как строки в activity-001.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="ai-anim-001"]){
--vibeui-ai-anim-001-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-ai-anim-001-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-ai-anim-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-ai-anim-001-muted:color-mix(in oklab,var(--vibeui-ai-anim-001-fg) 60%,transparent);
--vibeui-ai-anim-001-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-ai-anim-001-cube:color-mix(in oklab,var(--vibeui-ai-anim-001-fg) 26%,var(--vibeui-ai-anim-001-card));
--vibeui-ai-anim-001-accent:light-dark(oklch(0.6 0.19 250),oklch(0.75 0.17 250));
--vibeui-ai-anim-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="ai-anim-001"]{color-scheme:dark}
[data-vibeui-block="ai-anim-001"]{
display:block;box-sizing:border-box;width:100%;max-width:24rem;margin:0;
color:var(--vibeui-ai-anim-001-fg);font-family:var(--vibeui-ai-anim-001-font);
}
[data-vibeui-block="ai-anim-001"] *{box-sizing:border-box}
[data-vibeui-block="ai-anim-001"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-ai-anim-001-border);
background:var(--vibeui-ai-anim-001-card);overflow:hidden;
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="ai-anim-001"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.875rem;border-bottom:1px solid var(--vibeui-ai-anim-001-border);
}
[data-vibeui-block="ai-anim-001"] [data-part="title"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="ai-anim-001"] [data-part="badge"]{
display:inline-flex;align-items:center;height:1.125rem;padding:0 0.4375rem;
border-radius:9999px;font-size:0.5625rem;font-weight:650;
color:var(--vibeui-ai-anim-001-accent);
background:color-mix(in oklab,var(--vibeui-ai-anim-001-accent) 14%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-ai-anim-001-accent) 22%,transparent);
}
[data-vibeui-block="ai-anim-001"] [data-part="stage"]{padding:0.5rem 0.5rem 0.75rem}
[data-vibeui-block="ai-anim-001"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="ai-anim-001"] [data-part="rail"]{
fill:none;stroke:var(--vibeui-ai-anim-001-border);stroke-width:1.5;stroke-dasharray:3 4;
}
[data-vibeui-block="ai-anim-001"] [data-part="cube"]{
color:var(--vibeui-ai-anim-001-cube);
animation:vibeui-ai-anim-001-lit 3.2s ease-in-out infinite;
transform-box:fill-box;transform-origin:center;
}
[data-vibeui-block="ai-anim-001"] [data-part="cube"][data-index="0"]{animation-delay:0s}
[data-vibeui-block="ai-anim-001"] [data-part="cube"][data-index="1"]{animation-delay:0.8s}
[data-vibeui-block="ai-anim-001"] [data-part="cube"][data-index="2"]{animation-delay:1.6s}
[data-vibeui-block="ai-anim-001"] [data-part="cube"][data-index="3"]{animation-delay:2.4s}
[data-vibeui-block="ai-anim-001"] [data-part="top"]{fill:currentColor;fill-opacity:1}
[data-vibeui-block="ai-anim-001"] [data-part="left"]{fill:currentColor;fill-opacity:0.62}
[data-vibeui-block="ai-anim-001"] [data-part="right"]{fill:currentColor;fill-opacity:0.42}
[data-vibeui-block="ai-anim-001"] [data-part="label"]{
font-size:9px;font-weight:650;fill:currentColor;
font-family:var(--vibeui-ai-anim-001-font);dominant-baseline:middle;
}
[data-vibeui-block="ai-anim-001"][data-labels="false"] [data-part="label"]{display:none}
[data-vibeui-block="ai-anim-001"][data-paused="true"] [data-part="cube"]{animation-play-state:paused}
@keyframes vibeui-ai-anim-001-lit{
0%,10%,100%{color:var(--vibeui-ai-anim-001-cube);filter:none}
3%,17%{color:var(--vibeui-ai-anim-001-accent);filter:drop-shadow(0 0 6px var(--vibeui-ai-anim-001-accent))}
26%{color:var(--vibeui-ai-anim-001-cube);filter:none}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="ai-anim-001"] [data-part="cube"]{animation:none;color:var(--vibeui-ai-anim-001-accent);filter:drop-shadow(0 0 6px var(--vibeui-ai-anim-001-accent))}
}
`

/**
 * Изометрическая лестница из кубов конвейера агента: каждый куб — этап,
 * кубы загораются по очереди снизу вверх с glow-тенью. Один файл, ноль
 * зависимостей, собственная палитра, вся анимация на чистом CSS.
 */
export function AiAnim001({
  title = "Пайплайн агента",
  badge = "Live",
  stages = DEFAULT_STAGES,
  accent,
  paused = false,
  labels = true,
  className,
  style,
  ...props
}: AiAnim001Props) {
  const palette = {
    ...(accent ? { "--vibeui-ai-anim-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  const items = stages.slice(0, 4)

  return (
    <>
      <style href="vibeui-ai-anim-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="ai-anim-001"
        data-slot="ai-agent-flow"
        data-paused={paused ? "true" : undefined}
        data-labels={labels ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="head">
            <p data-part="title">{title}</p>
            {badge ? <span data-part="badge">{badge}</span> : null}
          </div>
          <div data-part="stage">
            <svg viewBox="0 0 320 200" role="img" aria-label={title}>
              {CENTERS.slice(0, -1).map((center, index) => {
                const next = CENTERS[index + 1]
                return (
                  <path
                    key={`rail-${center.x}`}
                    data-part="rail"
                    d={`M${center.x} ${center.y} L${next.x} ${next.y}`}
                  />
                )
              })}
              {CUBES.map((cube, index) => {
                const center = CENTERS[index]
                const item = items[index]

                return (
                  <g data-part="cube" data-index={index} key={`cube-${center.x}`}>
                    <polygon data-part="left" points={cube.left} />
                    <polygon data-part="right" points={cube.right} />
                    <polygon data-part="top" points={cube.top} />
                    {item ? (
                      <text
                        data-part="label"
                        x={center.x + 30}
                        y={center.y - 4}
                      >
                        {item.label}
                      </text>
                    ) : null}
                  </g>
                )
              })}
            </svg>
          </div>
        </div>
      </section>
    </>
  )
}

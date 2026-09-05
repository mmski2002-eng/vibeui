import type { ComponentProps, CSSProperties } from "react"

export type Connections002Node = {
  label: string
}

export type Connections002Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  status?: string
  /** Ровно пять узлов — под них рассчитан граф из пяти рёбер. */
  nodes?: Connections002Node[]
  accent?: string
  paused?: boolean
  labels?: boolean
}

// Идея: небольшой граф из пяти узлов и пяти рёбер, вдоль каждого ребра
// бесконечно бежит точка данных. Каждая точка — offset-path вдоль своего
// ребра с собственной длительностью и направлением, поэтому поток читается
// как живая сеть, а не как один зацикленный маршрут.
const STYLES = `
:where([data-vibeui-block="connections-002"]){
--vibeui-connections-002-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-connections-002-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-connections-002-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-connections-002-muted:color-mix(in oklab,var(--vibeui-connections-002-fg) 60%,transparent);
--vibeui-connections-002-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-connections-002-line:color-mix(in oklab,var(--vibeui-connections-002-fg) 22%,transparent);
--vibeui-connections-002-accent:light-dark(oklch(0.58 0.16 190),oklch(0.78 0.14 190));
--vibeui-connections-002-accent-fg:oklch(from var(--vibeui-connections-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-connections-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="connections-002"]{color-scheme:dark}
[data-vibeui-block="connections-002"]{
display:block;box-sizing:border-box;width:100%;max-width:24rem;margin:0;
color:var(--vibeui-connections-002-fg);font-family:var(--vibeui-connections-002-font);
}
[data-vibeui-block="connections-002"] *{box-sizing:border-box}
[data-vibeui-block="connections-002"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-connections-002-border);
background:var(--vibeui-connections-002-card);overflow:hidden;
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="connections-002"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.875rem;border-bottom:1px solid var(--vibeui-connections-002-border);
}
[data-vibeui-block="connections-002"] [data-part="title"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="connections-002"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.3125rem;
font-size:0.625rem;font-weight:600;color:var(--vibeui-connections-002-muted);
}
[data-vibeui-block="connections-002"] [data-part="statusdot"]{
width:0.375rem;height:0.375rem;border-radius:9999px;background:var(--vibeui-connections-002-accent);
animation:vibeui-connections-002-blink 1.6s ease-in-out infinite;
}
[data-vibeui-block="connections-002"] [data-part="stage"]{padding:0.5rem 0.375rem 0.75rem}
[data-vibeui-block="connections-002"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="connections-002"] [data-part="edge"]{
fill:none;stroke:var(--vibeui-connections-002-line);stroke-width:1.5;
}
[data-vibeui-block="connections-002"] [data-part="node"]{
fill:var(--vibeui-connections-002-frame);stroke:var(--vibeui-connections-002-accent);stroke-width:1.5;
}
[data-vibeui-block="connections-002"] [data-part="monogram"]{
font-size:9px;font-weight:700;fill:var(--vibeui-connections-002-accent);
font-family:var(--vibeui-connections-002-font);text-anchor:middle;dominant-baseline:middle;
}
[data-vibeui-block="connections-002"] [data-part="label"]{
font-size:7px;font-weight:600;fill:var(--vibeui-connections-002-muted);
font-family:var(--vibeui-connections-002-font);text-anchor:middle;dominant-baseline:hanging;
}
[data-vibeui-block="connections-002"][data-labels="false"] [data-part="label"]{display:none}
[data-vibeui-block="connections-002"] [data-part="packet"]{
offset-distance:0%;r:3.2;fill:var(--vibeui-connections-002-accent);
}
[data-vibeui-block="connections-002"] [data-part="packet"][data-index="0"]{offset-path:path("M74 50 L170 30");animation:vibeui-connections-002-run 1.8s linear infinite}
[data-vibeui-block="connections-002"] [data-part="packet"][data-index="1"]{offset-path:path("M170 30 L260 90");animation:vibeui-connections-002-run 2.2s linear infinite;animation-delay:-0.5s}
[data-vibeui-block="connections-002"] [data-part="packet"][data-index="2"]{offset-path:path("M60 64 L110 150");animation:vibeui-connections-002-run 2.4s linear infinite;animation-delay:-1.1s}
[data-vibeui-block="connections-002"] [data-part="packet"][data-index="3"]{offset-path:path("M110 150 L230 160");animation:vibeui-connections-002-run 2s linear infinite;animation-delay:-0.4s}
[data-vibeui-block="connections-002"] [data-part="packet"][data-index="4"]{offset-path:path("M260 104 L230 160");animation:vibeui-connections-002-run 1.6s linear infinite;animation-delay:-0.9s}
[data-vibeui-block="connections-002"][data-paused="true"] *{animation-play-state:paused!important}
@keyframes vibeui-connections-002-run{from{offset-distance:0%}to{offset-distance:100%}}
@keyframes vibeui-connections-002-blink{0%,100%{opacity:.45}50%{opacity:1}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="connections-002"] [data-part="packet"]{animation:none;opacity:0}
[data-vibeui-block="connections-002"] [data-part="statusdot"]{animation:none}
}
`

const DEFAULT_NODES: Connections002Node[] = [
  { label: "Приём" },
  { label: "Очередь" },
  { label: "Расчёт" },
  { label: "Кэш" },
  { label: "Хранилище" },
]

const POSITIONS: Array<{ x: number; y: number }> = [
  { x: 60, y: 50 },
  { x: 170, y: 30 },
  { x: 260, y: 90 },
  { x: 110, y: 150 },
  { x: 230, y: 160 },
]

/**
 * Поток данных: пять узлов графа, соединённых рёбрами, вдоль которых
 * непрерывно бегут точки. Один файл, ноль зависимостей, собственная
 * палитра, анимация на CSS (offset-path).
 */
export function Connections002({
  title = "Поток данных",
  status = "Стрим",
  nodes = DEFAULT_NODES,
  accent,
  paused = false,
  labels = true,
  className,
  style,
  ...props
}: Connections002Props) {
  const palette = {
    ...(accent ? { "--vibeui-connections-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  const items = nodes.slice(0, 5)

  return (
    <>
      <style href="vibeui-connections-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="connections-002"
        data-slot="connections-002"
        data-paused={paused ? "true" : undefined}
        data-labels={labels ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="head">
            <p data-part="title">{title}</p>
            <span data-part="status">
              <span data-part="statusdot" aria-hidden="true" />
              {status}
            </span>
          </div>
          <div data-part="stage">
            <svg viewBox="0 0 320 200" role="img" aria-label={title}>
              <path data-part="edge" d="M74 50 L170 30" />
              <path data-part="edge" d="M170 30 L260 90" />
              <path data-part="edge" d="M60 64 L110 150" />
              <path data-part="edge" d="M110 150 L230 160" />
              <path data-part="edge" d="M260 104 L230 160" />

              {[0, 1, 2, 3, 4].map((index) => (
                <circle key={index} data-part="packet" data-index={index} />
              ))}

              {items.map((node, index) => {
                const position = POSITIONS[index]

                return (
                  <g key={node.label}>
                    <circle
                      data-part="node"
                      cx={position.x}
                      cy={position.y}
                      r="14"
                    />
                    <text
                      data-part="monogram"
                      x={position.x}
                      y={position.y}
                    >
                      {node.label.slice(0, 1)}
                    </text>
                    <text
                      data-part="label"
                      x={position.x}
                      y={position.y + 18}
                    >
                      {node.label}
                    </text>
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

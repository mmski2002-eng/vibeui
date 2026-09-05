import type { ComponentProps, CSSProperties } from "react"

export type Connections001Node = {
  label: string
}

export type Connections001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  status?: string
  /** Ровно три источника — под них рассчитаны кривые SVG. */
  sources?: Connections001Node[]
  destination?: string
  accent?: string
  paused?: boolean
  labels?: boolean
}

// Идея: три источника отправляют пакеты по кривым линиям к общему
// приёмнику. Каждая линия — offset-path для кружка-пакета: анимация двигает
// offset-distance от 0% до 100%, три пакета сдвинуты по фазе отрицательной
// задержкой (как строки в activity-001), поэтому поток в приёмник выглядит
// непрерывным. Приёмник подсвечивается расширяющимся контуром в том же ритме.
const STYLES = `
:where([data-vibeui-block="connections-001"]){
--vibeui-connections-001-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-connections-001-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-connections-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-connections-001-muted:color-mix(in oklab,var(--vibeui-connections-001-fg) 60%,transparent);
--vibeui-connections-001-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-connections-001-line:color-mix(in oklab,var(--vibeui-connections-001-fg) 22%,transparent);
--vibeui-connections-001-accent:light-dark(oklch(0.55 0.17 250),oklch(0.75 0.15 250));
--vibeui-connections-001-accent-fg:oklch(from var(--vibeui-connections-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-connections-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="connections-001"]{color-scheme:dark}
[data-vibeui-block="connections-001"]{
display:block;box-sizing:border-box;width:100%;max-width:24rem;margin:0;
color:var(--vibeui-connections-001-fg);font-family:var(--vibeui-connections-001-font);
}
[data-vibeui-block="connections-001"] *{box-sizing:border-box}
[data-vibeui-block="connections-001"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-connections-001-border);
background:var(--vibeui-connections-001-card);overflow:hidden;
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="connections-001"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.875rem;border-bottom:1px solid var(--vibeui-connections-001-border);
}
[data-vibeui-block="connections-001"] [data-part="title"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="connections-001"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.3125rem;
font-size:0.625rem;font-weight:600;color:var(--vibeui-connections-001-muted);
}
[data-vibeui-block="connections-001"] [data-part="statusdot"]{
width:0.375rem;height:0.375rem;border-radius:9999px;background:var(--vibeui-connections-001-accent);
animation:vibeui-connections-001-blink 1.6s ease-in-out infinite;
}
[data-vibeui-block="connections-001"] [data-part="stage"]{padding:0.5rem 0.375rem 0.75rem}
[data-vibeui-block="connections-001"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="connections-001"] [data-part="edge"]{
fill:none;stroke:var(--vibeui-connections-001-line);stroke-width:1.5;
}
[data-vibeui-block="connections-001"] [data-part="node"]{
fill:var(--vibeui-connections-001-frame);stroke:var(--vibeui-connections-001-border);stroke-width:1;
}
[data-vibeui-block="connections-001"] [data-part="node"][data-role="destination"]{
fill:var(--vibeui-connections-001-accent);stroke:var(--vibeui-connections-001-accent);
}
[data-vibeui-block="connections-001"] [data-part="label"]{
font-size:8px;font-weight:650;fill:var(--vibeui-connections-001-fg);
font-family:var(--vibeui-connections-001-font);text-anchor:middle;dominant-baseline:middle;
}
[data-vibeui-block="connections-001"] [data-part="label"][data-role="destination"]{fill:var(--vibeui-connections-001-accent-fg)}
[data-vibeui-block="connections-001"][data-labels="false"] [data-part="label"]{display:none}
[data-vibeui-block="connections-001"] [data-part="packet"]{
offset-distance:0%;fill:var(--vibeui-connections-001-accent);
animation:vibeui-connections-001-run 2.4s linear infinite;
}
[data-vibeui-block="connections-001"] [data-part="packet"][data-index="0"]{offset-path:path("M84 40 Q160 40 236 100")}
[data-vibeui-block="connections-001"] [data-part="packet"][data-index="1"]{offset-path:path("M84 100 L236 100");animation-delay:-0.8s}
[data-vibeui-block="connections-001"] [data-part="packet"][data-index="2"]{offset-path:path("M84 160 Q160 160 236 100");animation-delay:-1.6s}
[data-vibeui-block="connections-001"] [data-part="ping"]{
fill:none;stroke:var(--vibeui-connections-001-accent);stroke-width:1.5;
transform-box:fill-box;transform-origin:center;
animation:vibeui-connections-001-ping 0.8s ease-out infinite;
}
[data-vibeui-block="connections-001"][data-paused="true"] *{animation-play-state:paused!important}
@keyframes vibeui-connections-001-run{from{offset-distance:0%}to{offset-distance:100%}}
@keyframes vibeui-connections-001-ping{0%{transform:scale(0.9);opacity:.6}80%,100%{transform:scale(1.35);opacity:0}}
@keyframes vibeui-connections-001-blink{0%,100%{opacity:.45}50%{opacity:1}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="connections-001"] [data-part="packet"]{animation:none;opacity:0}
[data-vibeui-block="connections-001"] [data-part="ping"]{animation:none;opacity:0}
[data-vibeui-block="connections-001"] [data-part="statusdot"]{animation:none}
}
`

const DEFAULT_SOURCES: Connections001Node[] = [
  { label: "Заказы" },
  { label: "Платежи" },
  { label: "Профили" },
]

/**
 * Схождение потоков: несколько источников слева отправляют пакеты по
 * кривым линиям в общий приёмник справа. Один файл, ноль зависимостей,
 * собственная палитра, вся анимация на CSS (offset-path).
 */
export function Connections001({
  title = "Схождение потоков",
  status = "Синхронизация",
  sources = DEFAULT_SOURCES,
  destination = "Аналитика",
  accent,
  paused = false,
  labels = true,
  className,
  style,
  ...props
}: Connections001Props) {
  const palette = {
    ...(accent ? { "--vibeui-connections-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-connections-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="connections-001"
        data-slot="connections-001"
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
              <path data-part="edge" d="M84 40 Q160 40 236 100" />
              <path data-part="edge" d="M84 100 L236 100" />
              <path data-part="edge" d="M84 160 Q160 160 236 100" />

              <circle data-part="packet" data-index="0" r="4" />
              <circle data-part="packet" data-index="1" r="4" />
              <circle data-part="packet" data-index="2" r="4" />

              {sources.slice(0, 3).map((source, index) => {
                const y = 40 + index * 60

                return (
                  <g key={source.label}>
                    <rect
                      data-part="node"
                      x="8"
                      y={y - 12}
                      width="76"
                      height="24"
                      rx="8"
                    />
                    <text data-part="label" x="46" y={y}>
                      {source.label}
                    </text>
                  </g>
                )
              })}

              <g>
                <rect
                  data-part="ping"
                  x="236"
                  y="88"
                  width="76"
                  height="24"
                  rx="8"
                />
                <rect
                  data-part="node"
                  data-role="destination"
                  x="236"
                  y="88"
                  width="76"
                  height="24"
                  rx="8"
                />
                <text
                  data-part="label"
                  data-role="destination"
                  x="274"
                  y="100"
                >
                  {destination}
                </text>
              </g>
            </svg>
          </div>
        </div>
      </section>
    </>
  )
}

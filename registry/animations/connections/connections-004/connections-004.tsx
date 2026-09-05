import type { ComponentProps, CSSProperties } from "react"

export type Connections004Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  status?: string
  systemA?: string
  systemB?: string
  accent?: string
  paused?: boolean
  labels?: boolean
}

// Идея: два узла соединены двумя параллельными линиями — верхней и нижней.
// Пакет-точка едет по верхней линии вперёд, гаснет на середине цикла, и в
// этот же момент по нижней линии в обратную сторону включается второй
// пакет: оба используют один keyframes-набор, второй сдвинут отрицательной
// задержкой на полцикла. В центре крутится иконка синхронизации —
// самостоятельная бесконечная CSS-анимация вращения.
const STYLES = `
:where([data-vibeui-block="connections-004"]){
--vibeui-connections-004-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-connections-004-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-connections-004-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-connections-004-muted:color-mix(in oklab,var(--vibeui-connections-004-fg) 60%,transparent);
--vibeui-connections-004-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-connections-004-line:color-mix(in oklab,var(--vibeui-connections-004-fg) 22%,transparent);
--vibeui-connections-004-accent:light-dark(oklch(0.58 0.18 25),oklch(0.75 0.16 25));
--vibeui-connections-004-accent-fg:oklch(from var(--vibeui-connections-004-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-connections-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="connections-004"]{color-scheme:dark}
[data-vibeui-block="connections-004"]{
display:block;box-sizing:border-box;width:100%;max-width:24rem;margin:0;
color:var(--vibeui-connections-004-fg);font-family:var(--vibeui-connections-004-font);
}
[data-vibeui-block="connections-004"] *{box-sizing:border-box}
[data-vibeui-block="connections-004"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-connections-004-border);
background:var(--vibeui-connections-004-card);overflow:hidden;
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="connections-004"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.875rem;border-bottom:1px solid var(--vibeui-connections-004-border);
}
[data-vibeui-block="connections-004"] [data-part="title"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="connections-004"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.3125rem;
font-size:0.625rem;font-weight:600;color:var(--vibeui-connections-004-muted);
}
[data-vibeui-block="connections-004"] [data-part="statusdot"]{
width:0.375rem;height:0.375rem;border-radius:9999px;background:var(--vibeui-connections-004-accent);
animation:vibeui-connections-004-blink 1.6s ease-in-out infinite;
}
[data-vibeui-block="connections-004"] [data-part="stage"]{padding:0.5rem 0.375rem 0.75rem}
[data-vibeui-block="connections-004"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="connections-004"] [data-part="edge"]{
fill:none;stroke:var(--vibeui-connections-004-line);stroke-width:1.5;
}
[data-vibeui-block="connections-004"] [data-part="node"]{
fill:var(--vibeui-connections-004-frame);stroke:var(--vibeui-connections-004-border);stroke-width:1;
}
[data-vibeui-block="connections-004"] [data-part="label"]{
font-size:8px;font-weight:650;fill:var(--vibeui-connections-004-fg);
font-family:var(--vibeui-connections-004-font);text-anchor:middle;dominant-baseline:middle;
}
[data-vibeui-block="connections-004"][data-labels="false"] [data-part="label"]{display:none}
[data-vibeui-block="connections-004"] [data-part="packet"]{
fill:var(--vibeui-connections-004-accent);offset-distance:0%;
animation:vibeui-connections-004-trip 3s linear infinite;
}
[data-vibeui-block="connections-004"] [data-part="packet"][data-dir="forward"]{
offset-path:path("M96 88 L224 88");
}
[data-vibeui-block="connections-004"] [data-part="packet"][data-dir="backward"]{
offset-path:path("M224 112 L96 112");animation-delay:-1.5s;
}
[data-vibeui-block="connections-004"] [data-part="icon"]{
transform-box:fill-box;transform-origin:center;
animation:vibeui-connections-004-spin 6s linear infinite;
}
[data-vibeui-block="connections-004"] [data-part="arc"]{
fill:none;stroke:var(--vibeui-connections-004-accent);stroke-width:2.5;stroke-linecap:round;
}
[data-vibeui-block="connections-004"] [data-part="arrow"]{fill:var(--vibeui-connections-004-accent)}
[data-vibeui-block="connections-004"][data-paused="true"] *{animation-play-state:paused!important}
@keyframes vibeui-connections-004-trip{
0%{offset-distance:0%;opacity:1}
45%{offset-distance:100%;opacity:1}
50%,100%{offset-distance:100%;opacity:0}
}
@keyframes vibeui-connections-004-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes vibeui-connections-004-blink{0%,100%{opacity:.45}50%{opacity:1}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="connections-004"] [data-part="packet"]{animation:none;opacity:0}
[data-vibeui-block="connections-004"] [data-part="icon"]{animation:none}
[data-vibeui-block="connections-004"] [data-part="statusdot"]{animation:none}
}
`

/**
 * Синхронизация: два узла обмениваются данными по двум линиям, точки бегут
 * попеременно туда-обратно, в центре вращается иконка синхронизации. Один
 * файл, ноль зависимостей, собственная палитра, анимация на CSS.
 */
export function Connections004({
  title = "Синхронизация",
  status = "Онлайн",
  systemA = "Локально",
  systemB = "Облако",
  accent,
  paused = false,
  labels = true,
  className,
  style,
  ...props
}: Connections004Props) {
  const palette = {
    ...(accent ? { "--vibeui-connections-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-connections-004" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="connections-004"
        data-slot="connections-004"
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
              <path data-part="edge" d="M96 88 L224 88" />
              <path data-part="edge" d="M96 112 L224 112" />

              <circle data-part="packet" data-dir="forward" cx="0" cy="0" r="4" />
              <circle data-part="packet" data-dir="backward" cx="0" cy="0" r="4" />

              <g data-part="icon">
                <path data-part="arc" d="M147 90 A13 13 0 0 1 173 90" />
                <polygon data-part="arrow" points="173,90 179,86 179,94" />
                <path data-part="arc" d="M173 110 A13 13 0 0 1 147 110" />
                <polygon data-part="arrow" points="147,110 141,114 141,106" />
              </g>

              <g>
                <rect
                  data-part="node"
                  x="24"
                  y="84"
                  width="72"
                  height="32"
                  rx="10"
                />
                <text data-part="label" x="60" y="100">
                  {systemA}
                </text>
              </g>
              <g>
                <rect
                  data-part="node"
                  x="224"
                  y="84"
                  width="72"
                  height="32"
                  rx="10"
                />
                <text data-part="label" x="260" y="100">
                  {systemB}
                </text>
              </g>
            </svg>
          </div>
        </div>
      </section>
    </>
  )
}

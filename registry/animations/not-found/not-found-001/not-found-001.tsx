import type { ComponentProps, CSSProperties } from "react"

export type NotFound001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  status?: string
  /** Крупный статус-код за барьером. */
  code?: string
  accent?: string
  /** Секунд на полный пробег импульса. */
  duration?: number
  paused?: boolean
}

// Идея: импульс запроса бежит по прямой (offset-path, как в connections-001)
// к барьеру, гаснет о него вспышкой, а крупный статус-код за барьером
// вздрагивает в момент удара. Импульс, вспышка и тряска делят одну
// длительность через --vibeui-not-found-001-duration, поэтому фазы совпадают
// без единой строки JS.
const STYLES = `
:where([data-vibeui-block="not-found-001"]){
--vibeui-not-found-001-duration:3s;
--vibeui-not-found-001-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-not-found-001-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-not-found-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-not-found-001-muted:color-mix(in oklab,var(--vibeui-not-found-001-fg) 55%,transparent);
--vibeui-not-found-001-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-not-found-001-line:color-mix(in oklab,var(--vibeui-not-found-001-fg) 20%,transparent);
--vibeui-not-found-001-accent:light-dark(oklch(0.62 0.19 35),oklch(0.72 0.17 35));
--vibeui-not-found-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="not-found-001"]{color-scheme:dark}
[data-vibeui-block="not-found-001"]{
display:block;box-sizing:border-box;width:100%;max-width:22rem;margin:0;
color:var(--vibeui-not-found-001-fg);font-family:var(--vibeui-not-found-001-font);
}
[data-vibeui-block="not-found-001"] *{box-sizing:border-box}
[data-vibeui-block="not-found-001"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-not-found-001-border);
background:var(--vibeui-not-found-001-card);overflow:hidden;
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="not-found-001"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.875rem;border-bottom:1px solid var(--vibeui-not-found-001-border);
}
[data-vibeui-block="not-found-001"] [data-part="title"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="not-found-001"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.3125rem;
font-size:0.625rem;font-weight:600;color:var(--vibeui-not-found-001-muted);
}
[data-vibeui-block="not-found-001"] [data-part="statusdot"]{
width:0.375rem;height:0.375rem;border-radius:9999px;background:var(--vibeui-not-found-001-accent);
animation:vibeui-not-found-001-blink 1.6s ease-in-out infinite;
}
[data-vibeui-block="not-found-001"] [data-part="stage"]{padding:0.5rem 0.375rem 0.75rem}
[data-vibeui-block="not-found-001"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="not-found-001"] [data-part="edge"]{
fill:none;stroke:var(--vibeui-not-found-001-line);stroke-width:1.5;stroke-dasharray:3 4;
}
[data-vibeui-block="not-found-001"] [data-part="wall"]{
fill:var(--vibeui-not-found-001-fg);opacity:.16;
}
[data-vibeui-block="not-found-001"] [data-part="digits"]{
font-size:34px;font-weight:800;letter-spacing:-0.02em;
fill:var(--vibeui-not-found-001-fg);
font-family:var(--vibeui-not-found-001-font);
animation:vibeui-not-found-001-shake var(--vibeui-not-found-001-duration) ease-in-out infinite;
}
[data-vibeui-block="not-found-001"] [data-part="pulse"]{
fill:var(--vibeui-not-found-001-accent);
offset-path:path("M16 100 L228 100");offset-distance:0%;
animation:vibeui-not-found-001-pulse var(--vibeui-not-found-001-duration) linear infinite;
}
[data-vibeui-block="not-found-001"] [data-part="burst"]{
fill:none;stroke:var(--vibeui-not-found-001-accent);stroke-width:2;
transform-box:fill-box;transform-origin:center;
animation:vibeui-not-found-001-burst var(--vibeui-not-found-001-duration) ease-out infinite;
}
[data-vibeui-block="not-found-001"][data-paused="true"] *{animation-play-state:paused!important}
@keyframes vibeui-not-found-001-pulse{
0%,2%{offset-distance:0%;opacity:0}
7%{opacity:1}
60%{offset-distance:80%;opacity:1}
66%,100%{offset-distance:83%;opacity:0}
}
@keyframes vibeui-not-found-001-burst{
0%,60%{opacity:0;transform:scale(0.6)}
64%{opacity:.6;transform:scale(1)}
78%,100%{opacity:0;transform:scale(1.9)}
}
@keyframes vibeui-not-found-001-shake{
0%,60%{transform:translateX(0)}
63%{transform:translateX(-3px)}
66%{transform:translateX(3px)}
69%{transform:translateX(-2px)}
72%{transform:translateX(2px)}
75%,100%{transform:translateX(0)}
}
@keyframes vibeui-not-found-001-blink{0%,100%{opacity:.45}50%{opacity:1}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="not-found-001"] [data-part="pulse"]{animation:none;opacity:0}
[data-vibeui-block="not-found-001"] [data-part="burst"]{animation:none;opacity:0}
[data-vibeui-block="not-found-001"] [data-part="digits"]{animation:none}
[data-vibeui-block="not-found-001"] [data-part="statusdot"]{animation:none}
}
`

/**
 * Импульс запроса бежит по маршруту в барьер перед крупным статус-кодом,
 * код вздрагивает при ударе. Один файл, ноль зависимостей, собственная
 * палитра, вся анимация на CSS (offset-path).
 */
export function NotFound001({
  title = "Маршрут",
  status = "Заблокировано",
  code = "404",
  accent,
  duration = 3,
  paused = false,
  className,
  style,
  ...props
}: NotFound001Props) {
  const palette = {
    ...(accent ? { "--vibeui-not-found-001-accent": accent } : null),
    "--vibeui-not-found-001-duration": `${duration}s`,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-not-found-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="not-found-001"
        data-slot="not-found-route"
        data-paused={paused ? "true" : undefined}
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
            <svg viewBox="0 0 320 160" role="img" aria-label={title}>
              <path data-part="edge" d="M16 100 L228 100" />
              <rect data-part="wall" x="224" y="30" width="8" height="100" rx="4" />
              <text data-part="digits" x="250" y="112">
                {code}
              </text>
              <circle data-part="burst" cx="228" cy="100" r="7" />
              <circle data-part="pulse" r="5" />
            </svg>
          </div>
        </div>
      </section>
    </>
  )
}

import type { ComponentProps, CSSProperties } from "react"

export type Api003Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  eventLabel?: string
  endpointLabel?: string
  /** Число дуг-попыток доставки (последняя всегда успешна). */
  attempts?: number
  accent?: string
  /** Изометрический наклон карточки. */
  isometric?: boolean
  /** Свечение под карточкой от красного к зелёному. */
  gradient?: boolean
}

// Идея: событие веером рассылает дуги-попытки в эндпоинт. Каждая дуга живёт
// собственным бесконечным циклом со сдвигом по фазе (animation-delay = index
// * длительность одной попытки) — так весь веер выглядит непрерывной
// ретрай-волной. Все дуги, кроме последней, гаснут красным (fail); последняя
// приходит зелёной и подсвечивает эндпоинт кольцом (success).
const STYLES = `
:where([data-vibeui-block="api-003"]){
--vibeui-api-003-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-api-003-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-api-003-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-api-003-muted:color-mix(in oklab,var(--vibeui-api-003-fg) 60%,transparent);
--vibeui-api-003-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-api-003-accent:light-dark(oklch(0.58 0.17 255),oklch(0.72 0.15 255));
--vibeui-api-003-fail:oklch(0.62 0.21 25);
--vibeui-api-003-success:oklch(0.72 0.16 150);
--vibeui-api-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-api-003-mono:ui-monospace,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="api-003"]{color-scheme:dark}
[data-vibeui-block="api-003"]{
display:block;box-sizing:border-box;width:100%;max-width:21rem;margin:0;
color:var(--vibeui-api-003-fg);font-family:var(--vibeui-api-003-font);
}
[data-vibeui-block="api-003"] *{box-sizing:border-box}
[data-vibeui-block="api-003"] [data-part="stage"]{perspective:1400px}
[data-vibeui-block="api-003"] [data-part="frame"]{
position:relative;isolation:isolate;padding:0.375rem;
border-radius:1.5rem;border:1px solid var(--vibeui-api-003-border);
background:color-mix(in oklab,var(--vibeui-api-003-frame) 75%,transparent);
transform-origin:center;transition:transform .3s ease;
}
[data-vibeui-block="api-003"] [data-part="glow"]{
position:absolute;left:0.3125rem;right:0.3125rem;bottom:0;height:4.5rem;z-index:0;
border-radius:9999px 9999px 0.75rem 0.75rem;
background:linear-gradient(to right,var(--vibeui-api-003-fail),var(--vibeui-api-003-success));
filter:blur(7px);opacity:0.55;transform-origin:center bottom;
animation:vibeui-api-003-breathe 4.5s ease-in-out infinite;
}
[data-vibeui-block="api-003"][data-flat="true"] [data-part="glow"]{display:none}
[data-vibeui-block="api-003"] [data-part="card"]{
position:relative;z-index:1;
border-radius:1rem;border:1px solid var(--vibeui-api-003-border);
background:var(--vibeui-api-003-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="api-003"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.75rem;border-bottom:1px solid var(--vibeui-api-003-border);
}
[data-vibeui-block="api-003"] [data-part="gtitle"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="api-003"] [data-part="badge"]{
display:inline-flex;align-items:center;justify-content:center;
height:1.125rem;padding:0 0.4375rem;border-radius:9999px;
font-family:var(--vibeui-api-003-mono);font-size:0.625rem;font-weight:700;
color:var(--vibeui-api-003-accent);
background:color-mix(in oklab,var(--vibeui-api-003-accent) 14%,transparent);
}
[data-vibeui-block="api-003"] [data-part="body"]{padding:0.75rem 0.875rem 0.875rem}
[data-vibeui-block="api-003"] [data-part="fan"]{
position:relative;width:100%;height:7rem;
}
[data-vibeui-block="api-003"] [data-part="fan"] svg{
position:absolute;inset:0;width:100%;height:100%;overflow:visible;
}
[data-vibeui-block="api-003"] [data-part="arc"]{
fill:none;stroke:var(--vibeui-api-003-border);stroke-width:1.25;stroke-dasharray:3 4;
}
[data-vibeui-block="api-003"] [data-part="dot"]{
position:absolute;top:0;left:0;width:0.5rem;height:0.5rem;border-radius:9999px;
opacity:0;animation-name:vibeui-api-003-fail;animation-timing-function:ease-in-out;animation-iteration-count:infinite;
}
[data-vibeui-block="api-003"] [data-part="dot"][data-outcome="success"]{
animation-name:vibeui-api-003-success;
}
[data-vibeui-block="api-003"] [data-part="node"]{
display:flex;flex-direction:column;align-items:center;gap:0.3125rem;
position:absolute;bottom:0;
}
[data-vibeui-block="api-003"] [data-part="node"][data-role="event"]{left:0}
[data-vibeui-block="api-003"] [data-part="node"][data-role="endpoint"]{right:0}
[data-vibeui-block="api-003"] [data-part="node-dot"]{
position:relative;width:0.625rem;height:0.625rem;border-radius:9999px;
background:var(--vibeui-api-003-fg);
box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-api-003-fg) 10%,transparent);
}
[data-vibeui-block="api-003"] [data-part="ping"]{
position:absolute;inset:-0.3125rem;border-radius:9999px;
background:var(--vibeui-api-003-success);opacity:0;
animation:vibeui-api-003-ping var(--vibeui-api-003-slot,1.6s) ease-out infinite;
animation-delay:var(--vibeui-api-003-ping-delay,0s);
}
[data-vibeui-block="api-003"] [data-part="node-label"]{
font-size:0.625rem;font-weight:600;color:var(--vibeui-api-003-muted);
}
@keyframes vibeui-api-003-breathe{0%,100%{transform:scaleX(0.82)}50%{transform:scaleX(1)}}
@keyframes vibeui-api-003-fail{
0%{offset-distance:0%;opacity:0;background:var(--vibeui-api-003-accent)}
8%{opacity:1}
55%{offset-distance:100%;background:var(--vibeui-api-003-accent)}
62%{background:var(--vibeui-api-003-fail);box-shadow:0 0 8px 1px var(--vibeui-api-003-fail)}
78%{opacity:1}
92%,100%{offset-distance:100%;opacity:0;background:var(--vibeui-api-003-fail)}
}
@keyframes vibeui-api-003-success{
0%{offset-distance:0%;opacity:0;background:var(--vibeui-api-003-accent)}
8%{opacity:1}
55%{offset-distance:100%;background:var(--vibeui-api-003-accent)}
62%{background:var(--vibeui-api-003-success);box-shadow:0 0 8px 1px var(--vibeui-api-003-success)}
92%,100%{offset-distance:100%;opacity:1;background:var(--vibeui-api-003-success)}
}
@keyframes vibeui-api-003-ping{
0%,58%{transform:scale(1);opacity:0}
64%{transform:scale(1);opacity:.5}
92%{transform:scale(1.9);opacity:0}
100%{opacity:0}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="api-003"] [data-part="glow"]{animation:none;transform:scaleX(0.9)}
[data-vibeui-block="api-003"] [data-part="dot"]{animation:none;opacity:0}
[data-vibeui-block="api-003"] [data-part="ping"]{animation:none;opacity:0}
}
`

const SLOT_SECONDS = 1.6

function arcPath(index: number, count: number) {
  const spread = count <= 1 ? 0 : index / (count - 1)
  const peak = Math.round((78 - spread * 56) * 10) / 10

  return `M14 92 Q 150 ${peak} 286 92`
}

/**
 * Веер дуг-попыток доставки вебхука: каждая дуга гонит точку в эндпоинт
 * собственным бесконечным циклом со сдвигом по фазе. Неудачные попытки
 * гаснут красным, последняя приходит зелёной и подсвечивает эндпоинт
 * кольцом. Один файл, ноль зависимостей, собственная палитра.
 */
export function Api003({
  title = "Webhook",
  eventLabel = "order.created",
  endpointLabel = "Endpoint",
  attempts = 3,
  accent,
  isometric = false,
  gradient = true,
  className,
  style,
  ...props
}: Api003Props) {
  const count = Math.min(5, Math.max(2, Math.round(attempts)))
  const palette = {
    ...(accent ? { "--vibeui-api-003-accent": accent } : null),
    "--vibeui-api-003-slot": `${SLOT_SECONDS}s`,
    "--vibeui-api-003-ping-delay": `${(count - 1) * SLOT_SECONDS}s`,
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  const arcs = Array.from({ length: count }, (_, index) => {
    const last = index === count - 1
    const d = arcPath(index, count)

    return { index, last, d }
  })

  return (
    <>
      <style href="vibeui-api-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="api-003"
        data-slot="api-webhook"
        data-flat={gradient ? undefined : "true"}
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="frame" style={frameStyle}>
            <div data-part="glow" aria-hidden="true" />
            <div data-part="card">
              <div data-part="head">
                <p data-part="gtitle">{title}</p>
                <span data-part="badge">{eventLabel}</span>
              </div>
              <div data-part="body">
                <div data-part="fan">
                  <svg viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true">
                    {arcs.map((arc) => (
                      <path key={arc.index} data-part="arc" d={arc.d} />
                    ))}
                  </svg>
                  {arcs.map((arc) => (
                    <span
                      key={arc.index}
                      data-part="dot"
                      data-outcome={arc.last ? "success" : "fail"}
                      style={
                        {
                          offsetPath: `path("${arc.d}")`,
                          animationDuration: `${SLOT_SECONDS}s`,
                          animationDelay: `${arc.index * SLOT_SECONDS}s`,
                        } as CSSProperties
                      }
                    />
                  ))}
                  <span data-part="node" data-role="event">
                    <span data-part="node-dot" aria-hidden="true" />
                    <span data-part="node-label">Event</span>
                  </span>
                  <span data-part="node" data-role="endpoint">
                    <span data-part="node-dot" aria-hidden="true">
                      <span data-part="ping" aria-hidden="true" />
                    </span>
                    <span data-part="node-label">{endpointLabel}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

import type { ComponentProps, CSSProperties } from "react"

export type Api002Method = "GET" | "POST" | "PUT" | "DELETE"

export type Api002Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  method?: Api002Method
  clientLabel?: string
  serverLabel?: string
  path?: string
  status?: string
  statusLabel?: string
  timing?: string
  accent?: string
  /** Изометрический наклон карточки. */
  isometric?: boolean
  /** Свечение под карточкой в цвет метода запроса. */
  gradient?: boolean
}

// Идея: запрос летит дугой от клиента к серверу, ответ — обратной дугой.
// Обе точки едут по одному и тому же SVG-пути через CSS offset-path: пакет
// запроса идёт 0% → 100%, пакет ответа — 100% → 0% с задержкой. Пилюля
// статуса и тайминг проявляются ровно к приходу ответа и гаснут перед
// следующим циклом — анимация целиком на чистом CSS, без JS-таймеров.
const STYLES = `
:where([data-vibeui-block="api-002"]){
--vibeui-api-002-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-api-002-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-api-002-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-api-002-muted:color-mix(in oklab,var(--vibeui-api-002-fg) 60%,transparent);
--vibeui-api-002-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-api-002-accent:light-dark(oklch(0.58 0.17 255),oklch(0.72 0.15 255));
--vibeui-api-002-ok:oklch(0.72 0.16 150);
--vibeui-api-002-get:oklch(0.6 0.15 255);
--vibeui-api-002-post:oklch(0.68 0.15 150);
--vibeui-api-002-put:oklch(0.75 0.15 70);
--vibeui-api-002-delete:oklch(0.62 0.21 25);
--vibeui-api-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-api-002-mono:ui-monospace,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="api-002"]{color-scheme:dark}
[data-vibeui-block="api-002"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-api-002-fg);font-family:var(--vibeui-api-002-font);
}
[data-vibeui-block="api-002"] *{box-sizing:border-box}
[data-vibeui-block="api-002"] [data-part="stage"]{perspective:1400px}
[data-vibeui-block="api-002"] [data-part="frame"]{
position:relative;isolation:isolate;padding:0.375rem;
border-radius:1.5rem;border:1px solid var(--vibeui-api-002-border);
background:color-mix(in oklab,var(--vibeui-api-002-frame) 75%,transparent);
transform-origin:center;transition:transform .3s ease;
}
[data-vibeui-block="api-002"] [data-part="glow"]{
position:absolute;left:0.3125rem;right:0.3125rem;bottom:0;height:4.5rem;z-index:0;
border-radius:9999px 9999px 0.75rem 0.75rem;
background:linear-gradient(to right,var(--vibeui-api-002-accent),var(--vibeui-api-002-ok));
filter:blur(7px);opacity:0.55;transform-origin:center bottom;
animation:vibeui-api-002-breathe 4.5s ease-in-out infinite;
}
[data-vibeui-block="api-002"][data-flat="true"] [data-part="glow"]{display:none}
[data-vibeui-block="api-002"] [data-part="card"]{
position:relative;z-index:1;
border-radius:1rem;border:1px solid var(--vibeui-api-002-border);
background:var(--vibeui-api-002-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="api-002"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.75rem;border-bottom:1px solid var(--vibeui-api-002-border);
}
[data-vibeui-block="api-002"] [data-part="gtitle"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="api-002"] [data-part="method"]{
display:inline-flex;align-items:center;justify-content:center;
height:1.125rem;padding:0 0.4375rem;border-radius:0.3125rem;
font-family:var(--vibeui-api-002-mono);font-size:0.625rem;font-weight:700;
color:var(--vibeui-api-002-method-color);
background:color-mix(in oklab,var(--vibeui-api-002-method-color) 16%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-api-002-method-color) 26%,transparent);
}
[data-vibeui-block="api-002"][data-method="GET"] [data-part="method"]{--vibeui-api-002-method-color:var(--vibeui-api-002-get)}
[data-vibeui-block="api-002"][data-method="POST"] [data-part="method"]{--vibeui-api-002-method-color:var(--vibeui-api-002-post)}
[data-vibeui-block="api-002"][data-method="PUT"] [data-part="method"]{--vibeui-api-002-method-color:var(--vibeui-api-002-put)}
[data-vibeui-block="api-002"][data-method="DELETE"] [data-part="method"]{--vibeui-api-002-method-color:var(--vibeui-api-002-delete)}
[data-vibeui-block="api-002"] [data-part="body"]{padding:0.5rem 0.875rem 0.875rem}
[data-vibeui-block="api-002"] [data-part="nodes"]{
display:flex;align-items:center;justify-content:space-between;
padding:0 0.5rem;
}
[data-vibeui-block="api-002"] [data-part="node"]{
display:flex;flex-direction:column;align-items:center;gap:0.3125rem;
}
[data-vibeui-block="api-002"] [data-part="node-dot"]{
width:0.625rem;height:0.625rem;border-radius:9999px;
background:var(--vibeui-api-002-fg);
box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-api-002-fg) 10%,transparent);
}
[data-vibeui-block="api-002"] [data-part="node-label"]{
font-size:0.625rem;font-weight:600;color:var(--vibeui-api-002-muted);
}
[data-vibeui-block="api-002"] [data-part="wire"]{
position:relative;width:100%;height:5.625rem;margin-top:-0.5rem;
}
[data-vibeui-block="api-002"] [data-part="wire"] svg{
position:absolute;inset:0;width:100%;height:100%;overflow:visible;
}
[data-vibeui-block="api-002"] [data-part="wire"] path{
fill:none;stroke:var(--vibeui-api-002-border);stroke-width:1.5;stroke-dasharray:3 4;
}
[data-vibeui-block="api-002"] [data-part="packet-request"],
[data-vibeui-block="api-002"] [data-part="packet-response"]{
position:absolute;top:0;left:0;width:0.5rem;height:0.5rem;border-radius:9999px;
offset-path:path("M10 80 Q 140 4 270 80");
offset-rotate:0deg;
opacity:0;
}
[data-vibeui-block="api-002"] [data-part="packet-request"]{
background:var(--vibeui-api-002-accent);
box-shadow:0 0 8px 1px var(--vibeui-api-002-accent);
animation:vibeui-api-002-request 4.8s ease-in-out infinite;
}
[data-vibeui-block="api-002"] [data-part="packet-response"]{
background:var(--vibeui-api-002-ok);
box-shadow:0 0 8px 1px var(--vibeui-api-002-ok);
animation:vibeui-api-002-response 4.8s ease-in-out infinite;
}
[data-vibeui-block="api-002"] [data-part="result"]{
display:flex;align-items:center;justify-content:center;gap:0.375rem;
margin-top:0.25rem;opacity:0;
animation:vibeui-api-002-result 4.8s ease-in-out infinite;
}
[data-vibeui-block="api-002"] [data-part="status-pill"]{
display:inline-flex;align-items:center;gap:0.25rem;
padding:0.125rem 0.5rem;border-radius:9999px;
font-family:var(--vibeui-api-002-mono);font-size:0.625rem;font-weight:700;
color:var(--vibeui-api-002-ok);
background:color-mix(in oklab,var(--vibeui-api-002-ok) 16%,transparent);
}
[data-vibeui-block="api-002"] [data-part="timing"]{
font-family:var(--vibeui-api-002-mono);font-size:0.625rem;color:var(--vibeui-api-002-muted);
}
[data-vibeui-block="api-002"] [data-part="urlpath"]{
display:block;text-align:center;margin-top:0.375rem;
font-family:var(--vibeui-api-002-mono);font-size:0.625rem;color:var(--vibeui-api-002-muted);
}
@keyframes vibeui-api-002-breathe{0%,100%{transform:scaleX(0.82)}50%{transform:scaleX(1)}}
@keyframes vibeui-api-002-request{
0%{offset-distance:0%;opacity:0}
2%{opacity:1}
40%{offset-distance:100%;opacity:1}
44%{opacity:0}
100%{offset-distance:100%;opacity:0}
}
@keyframes vibeui-api-002-response{
0%,46%{offset-distance:100%;opacity:0}
50%{opacity:1}
88%{offset-distance:0%;opacity:1}
92%,100%{offset-distance:0%;opacity:0}
}
@keyframes vibeui-api-002-result{
0%,84%{opacity:0;transform:translateY(2px)}
90%,96%{opacity:1;transform:translateY(0)}
100%{opacity:0;transform:translateY(0)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="api-002"] [data-part="glow"]{animation:none;transform:scaleX(0.9)}
[data-vibeui-block="api-002"] [data-part="packet-request"],
[data-vibeui-block="api-002"] [data-part="packet-response"]{animation:none;opacity:0}
[data-vibeui-block="api-002"] [data-part="result"]{animation:none;opacity:1;transform:none}
}
`

/**
 * Дуга запрос-ответ между клиентом и сервером: пакеты бегут по общему
 * SVG-пути через offset-path, пилюля статуса и тайминг проявляются к
 * приходу ответа. Один файл, ноль зависимостей, собственная палитра.
 */
export function Api002({
  title = "Request",
  method = "GET",
  clientLabel = "Client",
  serverLabel = "Server",
  path = "/v1/orders",
  status = "200",
  statusLabel = "OK",
  timing = "42ms",
  accent,
  isometric = false,
  gradient = true,
  className,
  style,
  ...props
}: Api002Props) {
  const palette = {
    ...(accent ? { "--vibeui-api-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  return (
    <>
      <style href="vibeui-api-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="api-002"
        data-slot="api-request"
        data-method={method}
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
                <span data-part="method">{method}</span>
              </div>
              <div data-part="body">
                <div data-part="nodes">
                  <span data-part="node">
                    <span data-part="node-dot" aria-hidden="true" />
                    <span data-part="node-label">{clientLabel}</span>
                  </span>
                  <span data-part="node">
                    <span data-part="node-dot" aria-hidden="true" />
                    <span data-part="node-label">{serverLabel}</span>
                  </span>
                </div>
                <div data-part="wire" aria-hidden="true">
                  <svg viewBox="0 0 280 90" preserveAspectRatio="none">
                    <path d="M10 80 Q 140 4 270 80" />
                  </svg>
                  <span data-part="packet-request" />
                  <span data-part="packet-response" />
                </div>
                <span data-part="urlpath">
                  {method} {path}
                </span>
                <div data-part="result">
                  <span data-part="status-pill">
                    {status} {statusLabel}
                  </span>
                  <span data-part="timing">{timing}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

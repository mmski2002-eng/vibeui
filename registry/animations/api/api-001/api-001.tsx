import type { ComponentProps, CSSProperties } from "react"

export type Api001LogLevel = "info" | "debug" | "warn" | "error" | "ok"

export type Api001LogRow = {
  time: string
  level: Api001LogLevel
  method?: string
  path: string
  status?: string
}

export type Api001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  /** Заголовок вкладки в шапке-браузере. */
  title?: string
  rows?: Api001LogRow[]
  accent?: string
  /** Декоративные узлы сервисов над консолью, сходящиеся пунктиром в лог. */
  showNodes?: boolean
  /** Изометрический наклон карточки. */
  isometric?: boolean
  /** Свечение под карточкой, окрашенное в цвета уровней лога. */
  gradient?: boolean
}

// Идея: окно браузера с консолью логов. Строки тянутся снизу вверх сплошной
// лентой — список продублирован и едет вверх бесконечным translateY, поэтому
// шов между повтором не виден, а строки будто уезжают за верхний край и
// подъезжают снизу, как в реальном хвосте лога. Сверху — декоративная схема:
// два-три узла сервисов с пунктирными путями, сходящимися в консоль (сама
// линия «бежит» через анимацию stroke-dashoffset).
const STYLES = `
:where([data-vibeui-block="api-001"]){
--vibeui-api-001-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-api-001-card:light-dark(oklch(0.15 0 260),oklch(0.13 0 260));
--vibeui-api-001-fg:light-dark(oklch(0.94 0 260),oklch(0.94 0 260));
--vibeui-api-001-muted:color-mix(in oklab,var(--vibeui-api-001-fg) 52%,transparent);
--vibeui-api-001-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-api-001-accent:light-dark(oklch(0.62 0.16 255),oklch(0.72 0.14 255));
--vibeui-api-001-info:oklch(0.66 0.15 255);
--vibeui-api-001-debug:oklch(0.62 0 260);
--vibeui-api-001-warn:oklch(0.75 0.16 70);
--vibeui-api-001-error:oklch(0.62 0.21 25);
--vibeui-api-001-ok:oklch(0.72 0.16 150);
--vibeui-api-001-dotr:#ff5f57;
--vibeui-api-001-doty:#febc2e;
--vibeui-api-001-dotg:#28c840;
--vibeui-api-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-api-001-mono:ui-monospace,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="api-001"]{color-scheme:dark}
[data-vibeui-block="api-001"]{
display:block;box-sizing:border-box;width:100%;max-width:22rem;margin:0;
color:var(--vibeui-api-001-fg);font-family:var(--vibeui-api-001-font);
}
[data-vibeui-block="api-001"] *{box-sizing:border-box}
[data-vibeui-block="api-001"] [data-part="stage"]{perspective:1400px}
[data-vibeui-block="api-001"] [data-part="frame"]{
position:relative;isolation:isolate;padding:0.375rem;
border-radius:1.25rem;border:1px solid var(--vibeui-api-001-border);
background:color-mix(in oklab,var(--vibeui-api-001-frame) 75%,transparent);
transform-origin:center;transition:transform .3s ease;
}
[data-vibeui-block="api-001"] [data-part="glow"]{
position:absolute;left:0.3125rem;right:0.3125rem;bottom:0;height:4.5rem;z-index:0;
border-radius:9999px 9999px 0.75rem 0.75rem;
background:linear-gradient(to right,var(--vibeui-api-001-error),var(--vibeui-api-001-warn),var(--vibeui-api-001-ok),var(--vibeui-api-001-info));
filter:blur(7px);opacity:0.55;transform-origin:center bottom;
animation:vibeui-api-001-breathe 4.5s ease-in-out infinite;
}
[data-vibeui-block="api-001"][data-flat="true"] [data-part="glow"]{display:none}
[data-vibeui-block="api-001"] [data-part="card"]{
position:relative;z-index:1;overflow:hidden;
border-radius:0.875rem;border:1px solid oklch(0 0 0 / 0.4);
background:var(--vibeui-api-001-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.3);
}
[data-vibeui-block="api-001"] [data-part="chrome"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.5rem 0.75rem;border-bottom:1px solid color-mix(in oklab,var(--vibeui-api-001-fg) 10%,transparent);
}
[data-vibeui-block="api-001"] [data-part="dots"]{display:flex;gap:0.3125rem;flex:none}
[data-vibeui-block="api-001"] [data-part="dots"] i{
display:block;width:0.5rem;height:0.5rem;border-radius:9999px;
}
[data-vibeui-block="api-001"] [data-part="dots"] i:nth-child(1){background:var(--vibeui-api-001-dotr)}
[data-vibeui-block="api-001"] [data-part="dots"] i:nth-child(2){background:var(--vibeui-api-001-doty)}
[data-vibeui-block="api-001"] [data-part="dots"] i:nth-child(3){background:var(--vibeui-api-001-dotg)}
[data-vibeui-block="api-001"] [data-part="chrome-title"]{
flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
text-align:center;font-size:0.625rem;font-weight:600;letter-spacing:0.01em;
font-family:var(--vibeui-api-001-mono);color:var(--vibeui-api-001-muted);
}
[data-vibeui-block="api-001"] [data-part="graph"]{
display:block;width:100%;height:2.75rem;overflow:visible;
}
[data-vibeui-block="api-001"] [data-part="graph"] text{
font-family:var(--vibeui-api-001-mono);font-size:6.5px;fill:var(--vibeui-api-001-muted);
}
[data-vibeui-block="api-001"] [data-part="graph"] circle{
fill:var(--vibeui-api-001-card);stroke:var(--vibeui-api-001-accent);stroke-width:1.4;
}
[data-vibeui-block="api-001"] [data-part="graph"] path{
fill:none;stroke:var(--vibeui-api-001-accent);stroke-width:1;opacity:0.55;
stroke-dasharray:3 3;animation:vibeui-api-001-flow 1.4s linear infinite;
}
[data-vibeui-block="api-001"][data-nodes="false"] [data-part="graph"]{display:none}
[data-vibeui-block="api-001"] [data-part="console"]{
position:relative;height:9.5rem;overflow:hidden;padding:0 0.75rem 0.625rem;
-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 14%,#000 86%,transparent 100%);
mask-image:linear-gradient(to bottom,transparent 0,#000 14%,#000 86%,transparent 100%);
}
[data-vibeui-block="api-001"] [data-part="track"]{
display:flex;flex-direction:column;
animation:vibeui-api-001-tail 16s linear infinite;
}
[data-vibeui-block="api-001"] [data-part="row"]{
display:flex;align-items:baseline;gap:0.4375rem;padding:0.25rem 0;
font-family:var(--vibeui-api-001-mono);font-size:0.625rem;line-height:1.3;
white-space:nowrap;
}
[data-vibeui-block="api-001"] [data-part="time"]{
flex:none;color:var(--vibeui-api-001-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="api-001"] [data-part="chip"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
min-width:2.375rem;padding:0 0.25rem;border-radius:0.25rem;
font-size:0.5625rem;font-weight:700;letter-spacing:0.02em;
}
[data-vibeui-block="api-001"] [data-level="info"] [data-part="chip"]{color:var(--vibeui-api-001-info);background:color-mix(in oklab,var(--vibeui-api-001-info) 18%,transparent)}
[data-vibeui-block="api-001"] [data-level="debug"] [data-part="chip"]{color:var(--vibeui-api-001-debug);background:color-mix(in oklab,var(--vibeui-api-001-debug) 22%,transparent)}
[data-vibeui-block="api-001"] [data-level="warn"] [data-part="chip"]{color:var(--vibeui-api-001-warn);background:color-mix(in oklab,var(--vibeui-api-001-warn) 18%,transparent)}
[data-vibeui-block="api-001"] [data-level="error"] [data-part="chip"]{color:var(--vibeui-api-001-error);background:color-mix(in oklab,var(--vibeui-api-001-error) 20%,transparent)}
[data-vibeui-block="api-001"] [data-level="ok"] [data-part="chip"]{color:var(--vibeui-api-001-ok);background:color-mix(in oklab,var(--vibeui-api-001-ok) 18%,transparent)}
[data-vibeui-block="api-001"] [data-part="line"]{
overflow:hidden;text-overflow:ellipsis;color:var(--vibeui-api-001-muted);
}
[data-vibeui-block="api-001"] [data-part="method"]{color:var(--vibeui-api-001-fg);font-weight:600}
[data-vibeui-block="api-001"] [data-part="urlpath"]{color:var(--vibeui-api-001-fg)}
[data-vibeui-block="api-001"] [data-part="status"]{color:var(--vibeui-api-001-muted)}
@keyframes vibeui-api-001-breathe{0%,100%{transform:scaleX(0.82)}50%{transform:scaleX(1)}}
@keyframes vibeui-api-001-flow{to{stroke-dashoffset:-12}}
@keyframes vibeui-api-001-tail{from{transform:translateY(0)}to{transform:translateY(-50%)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="api-001"] [data-part="glow"]{animation:none;transform:scaleX(0.9)}
[data-vibeui-block="api-001"] [data-part="graph"] path{animation:none}
[data-vibeui-block="api-001"] [data-part="track"]{animation:none}
}
`

const DEFAULT_ROWS: Api001LogRow[] = [
  { time: "12:04:01", level: "info", method: "GET", path: "/v1/customers", status: "200" },
  { time: "12:04:02", level: "debug", method: "GET", path: "/v1/customers/cache", status: "HIT" },
  { time: "12:04:03", level: "ok", method: "POST", path: "/v1/orders", status: "201" },
  { time: "12:04:05", level: "warn", method: "GET", path: "/v1/inventory", status: "429" },
  { time: "12:04:06", level: "error", method: "POST", path: "/v1/payments", status: "502" },
  { time: "12:04:08", level: "info", method: "PATCH", path: "/v1/orders/8831", status: "200" },
]

/**
 * Окно браузера с консолью логов: строки тянутся снизу вверх бесконечной
 * лентой, узлы сервисов сходятся пунктиром в консоль. Один файл, ноль
 * зависимостей, собственная палитра.
 */
export function Api001({
  title = "api.logs",
  rows = DEFAULT_ROWS,
  accent,
  showNodes = true,
  isometric = false,
  gradient = true,
  className,
  style,
  ...props
}: Api001Props) {
  const palette = {
    ...(accent ? { "--vibeui-api-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  const loop = [...rows, ...rows]

  return (
    <>
      <style href="vibeui-api-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="api-001"
        data-slot="api-logs"
        data-nodes={showNodes ? undefined : "false"}
        data-flat={gradient ? undefined : "true"}
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="frame" style={frameStyle}>
            <div data-part="glow" aria-hidden="true" />
            <div data-part="card">
              <div data-part="chrome">
                <span data-part="dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span data-part="chrome-title">{title}</span>
              </div>
              <svg
                data-part="graph"
                viewBox="0 0 320 44"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M28 12 C 140 12, 220 32, 300 32" />
                <path d="M28 32 C 140 32, 220 12, 300 32" />
                <circle cx="28" cy="12" r="4" />
                <circle cx="28" cy="32" r="4" />
                <text x="14" y="7">
                  auth-svc
                </text>
                <text x="10" y="42">
                  billing-svc
                </text>
              </svg>
              <div data-part="console">
                <ol data-part="track">
                  {loop.map((row, index) => (
                    <li
                      data-part="row"
                      data-level={row.level}
                      key={`${row.time}-${row.path}-${index}`}
                    >
                      <span data-part="time">{row.time}</span>
                      <span data-part="chip">{row.level.toUpperCase()}</span>
                      <span data-part="line">
                        {row.method ? (
                          <span data-part="method">{row.method} </span>
                        ) : null}
                        <span data-part="urlpath">{row.path}</span>
                        {row.status ? (
                          <span data-part="status"> {row.status}</span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

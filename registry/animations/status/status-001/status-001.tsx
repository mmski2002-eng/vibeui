import type { ComponentProps, CSSProperties } from "react"

export type Status001Tone = "ok" | "degraded" | "down"

export type Status001Service = {
  name: string
  tone: Status001Tone
  /** Подпись статуса; по умолчанию берётся из tone. */
  status?: string
  /** Время отклика или причина недоступности. */
  meta: string
}

export type Status001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  /** Пилюля справа от заголовка: индикатор живого мониторинга. */
  badge?: string
  services?: Status001Service[]
  accent?: string
  /** Изометрический наклон карточки. */
  isometric?: boolean
  /** Радужное свечение под карточкой (дышит). false — плоская карточка. */
  gradient?: boolean
}

const STATUS_LABEL: Record<Status001Tone, string> = {
  ok: "Работает",
  degraded: "Деградация",
  down: "Недоступен",
}

// Идея: список сервисов с цветными индикаторами. Проверка читается кольцом,
// которое пробегает по индикаторам сверху вниз бесконечным циклом — у каждой
// строки своя задержка старта, посчитанная от её позиции в списке, поэтому
// кольцо кажется бегущей волной, а не синхронной вспышкой. У рабочих сервисов
// поверх волны ещё горит собственный мягкий зелёный пульс — сигнал "стабилен"
// не зависит от прохода волны.
const STYLES = `
:where([data-vibeui-block="status-001"]){
--vibeui-status-001-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-status-001-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-status-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-status-001-muted:color-mix(in oklab,var(--vibeui-status-001-fg) 62%,transparent);
--vibeui-status-001-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-status-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-status-001-ok:light-dark(oklch(0.66 0.17 150),oklch(0.76 0.15 150));
--vibeui-status-001-warn:light-dark(oklch(0.75 0.16 75),oklch(0.8 0.14 75));
--vibeui-status-001-down:light-dark(oklch(0.62 0.21 25),oklch(0.7 0.19 25));
--vibeui-status-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="status-001"]{color-scheme:dark}
[data-vibeui-block="status-001"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-status-001-fg);font-family:var(--vibeui-status-001-font);
}
[data-vibeui-block="status-001"] *{box-sizing:border-box}
[data-vibeui-block="status-001"] [data-part="stage"]{perspective:1400px}
[data-vibeui-block="status-001"] [data-part="frame"]{
position:relative;isolation:isolate;padding:0.375rem;
border-radius:1.5rem;border:1px solid var(--vibeui-status-001-border);
background:color-mix(in oklab,var(--vibeui-status-001-frame) 75%,transparent);
transition:transform .3s ease;transform-origin:center;
}
[data-vibeui-block="status-001"] [data-part="glow"]{
position:absolute;left:0.3125rem;right:0.3125rem;bottom:0;height:4.5rem;z-index:0;
border-radius:9999px 9999px 0.75rem 0.75rem;
background:linear-gradient(to right,var(--vibeui-status-001-down),var(--vibeui-status-001-warn),var(--vibeui-status-001-ok),var(--vibeui-status-001-accent));
filter:blur(7px);opacity:0.55;transform-origin:center bottom;
animation:vibeui-status-001-breathe 4.5s ease-in-out infinite;
}
[data-vibeui-block="status-001"][data-flat="true"] [data-part="glow"]{display:none}
[data-vibeui-block="status-001"] [data-part="card"]{
position:relative;z-index:1;
border-radius:1rem;border:1px solid var(--vibeui-status-001-border);
background:var(--vibeui-status-001-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="status-001"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.75rem;border-bottom:1px solid var(--vibeui-status-001-border);
}
[data-vibeui-block="status-001"] [data-part="gtitle"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="status-001"] [data-part="badge"]{
display:inline-flex;align-items:center;gap:0.3125rem;
height:1.125rem;padding:0 0.4375rem;border-radius:9999px;
font-size:0.5625rem;font-weight:650;letter-spacing:0.02em;text-transform:uppercase;
color:var(--vibeui-status-001-ok);
background:color-mix(in oklab,var(--vibeui-status-001-ok) 14%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-status-001-ok) 22%,transparent);
}
[data-vibeui-block="status-001"] [data-part="badge-dot"]{
width:0.3125rem;height:0.3125rem;border-radius:9999px;background:var(--vibeui-status-001-ok);
animation:vibeui-status-001-badge-pulse 1.8s ease-in-out infinite;
}
[data-vibeui-block="status-001"] [data-part="list"]{
display:flex;flex-direction:column;margin:0;padding:0.375rem 0.75rem;list-style:none;
}
[data-vibeui-block="status-001"] [data-part="row"]{
display:flex;align-items:center;gap:0.625rem;padding:0.5rem 0;
border-bottom:1px solid var(--vibeui-status-001-border);
}
[data-vibeui-block="status-001"] [data-part="row"]:last-child{border-bottom:none}
[data-vibeui-block="status-001"] [data-part="indicator"]{
position:relative;flex:none;width:0.5rem;height:0.5rem;
}
[data-vibeui-block="status-001"] [data-part="dot"]{
position:absolute;inset:0;border-radius:9999px;
}
[data-vibeui-block="status-001"] [data-part="scan"]{
position:absolute;inset:-0.3125rem;border-radius:9999px;
border:1.5px solid var(--vibeui-status-001-tone);
opacity:0;
animation:vibeui-status-001-scan 2.4s ease-out infinite;
animation-delay:var(--vibeui-status-001-delay,0s);
}
[data-vibeui-block="status-001"] [data-part="halo"]{
position:absolute;inset:-0.25rem;border-radius:9999px;
background:var(--vibeui-status-001-ok);opacity:0;
animation:vibeui-status-001-halo 3.2s ease-in-out infinite;
}
[data-vibeui-block="status-001"] [data-tone="ok"] [data-part="dot"]{background:var(--vibeui-status-001-ok)}
[data-vibeui-block="status-001"] [data-tone="ok"] [data-part="scan"]{--vibeui-status-001-tone:var(--vibeui-status-001-ok)}
[data-vibeui-block="status-001"] [data-tone="degraded"] [data-part="dot"]{background:var(--vibeui-status-001-warn)}
[data-vibeui-block="status-001"] [data-tone="degraded"] [data-part="scan"]{--vibeui-status-001-tone:var(--vibeui-status-001-warn)}
[data-vibeui-block="status-001"] [data-tone="down"] [data-part="dot"]{background:var(--vibeui-status-001-down)}
[data-vibeui-block="status-001"] [data-tone="down"] [data-part="scan"]{--vibeui-status-001-tone:var(--vibeui-status-001-down)}
[data-vibeui-block="status-001"] [data-part="body"]{display:flex;flex-direction:column;flex:1;min-width:0}
[data-vibeui-block="status-001"] [data-part="name"]{
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.75rem;font-weight:550;line-height:1.35;
}
[data-vibeui-block="status-001"] [data-part="status"]{
font-size:0.625rem;color:var(--vibeui-status-001-muted);
}
[data-vibeui-block="status-001"] [data-tone="degraded"] [data-part="status"]{color:var(--vibeui-status-001-warn)}
[data-vibeui-block="status-001"] [data-tone="down"] [data-part="status"]{color:var(--vibeui-status-001-down)}
[data-vibeui-block="status-001"] [data-part="meta"]{
flex:none;font-size:0.6875rem;font-weight:600;font-variant-numeric:tabular-nums;
color:var(--vibeui-status-001-muted);white-space:nowrap;
}
[data-vibeui-block="status-001"] [data-tone="down"] [data-part="meta"]{color:var(--vibeui-status-001-down)}
@keyframes vibeui-status-001-breathe{0%,100%{transform:scaleX(0.8)}50%{transform:scaleX(1)}}
@keyframes vibeui-status-001-badge-pulse{0%,100%{opacity:1}50%{opacity:0.35}}
@keyframes vibeui-status-001-scan{
0%{transform:scale(0.6);opacity:0.6}
70%,100%{transform:scale(1.9);opacity:0}
}
@keyframes vibeui-status-001-halo{
0%,100%{opacity:0.12;transform:scale(1)}
50%{opacity:0.32;transform:scale(1.25)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="status-001"] [data-part="glow"]{animation:none;transform:scaleX(0.92)}
[data-vibeui-block="status-001"] [data-part="badge-dot"]{animation:none;opacity:1}
[data-vibeui-block="status-001"] [data-part="scan"]{animation:none;opacity:0}
[data-vibeui-block="status-001"] [data-part="halo"]{animation:none;opacity:0.18}
}
`

const DEFAULT_SERVICES: Status001Service[] = [
  { name: "API Gateway", tone: "ok", meta: "42 ms" },
  { name: "Auth Service", tone: "ok", meta: "58 ms" },
  { name: "Payments", tone: "degraded", meta: "210 ms" },
  { name: "Database", tone: "ok", meta: "12 ms" },
  { name: "Search Index", tone: "down", meta: "Нет ответа" },
  { name: "CDN Edge", tone: "ok", meta: "8 ms" },
]

const SCAN_CYCLE_MS = 2400

/**
 * Health check списка сервисов: кольцо-проверка бежит по индикаторам сверху
 * вниз бесконечным циклом, рабочие сервисы держат собственный мягкий пульс.
 * Один файл, ноль зависимостей, собственная палитра, клиентского JS нет.
 */
export function Status001({
  title = "Статус сервисов",
  badge = "Live",
  services = DEFAULT_SERVICES,
  accent,
  isometric = false,
  gradient = true,
  className,
  style,
  ...props
}: Status001Props) {
  const palette = {
    ...(accent ? { "--vibeui-status-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  return (
    <>
      <style href="vibeui-status-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="status-001"
        data-slot="health-check"
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
                {badge ? (
                  <span data-part="badge">
                    <span data-part="badge-dot" aria-hidden="true" />
                    {badge}
                  </span>
                ) : null}
              </div>
              <ol data-part="list">
                {services.map((service, index) => {
                  const delayMs = (index / services.length) * SCAN_CYCLE_MS
                  const statusText = service.status ?? STATUS_LABEL[service.tone]

                  return (
                    <li data-part="row" data-tone={service.tone} key={service.name}>
                      <span data-part="indicator" aria-hidden="true">
                        <span data-part="dot" />
                        <span
                          data-part="scan"
                          style={
                            {
                              "--vibeui-status-001-delay": `${delayMs}ms`,
                            } as CSSProperties
                          }
                        />
                        {service.tone === "ok" ? (
                          <span data-part="halo" />
                        ) : null}
                      </span>
                      <span data-part="body">
                        <span data-part="name">{service.name}</span>
                        <span data-part="status">{statusText}</span>
                      </span>
                      <span data-part="meta">{service.meta}</span>
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

import type { ComponentProps, CSSProperties } from "react"

export type Maintenance001Service = {
  label: string
}

export type Maintenance001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  status?: string
  /** Ровно три сервиса — под них рассчитан веер стопки. */
  services?: Maintenance001Service[]
  /** Индекс сервиса, приподнятого из стопки и обрабатываемого гаечным ключом. */
  activeIndex?: number
  accent?: string
  paused?: boolean
}

// Идея: стопка карточек-сервисов веером, одна карточка приподнята из
// стопки и мягко покачивается (translate + rotate + scale), а над ней
// покачивается значок гаечного ключа — сервис явно «в работе». Задние
// карточки статичны, только приподнятая и ключ анимированы, JS не участвует.
const STYLES = `
:where([data-vibeui-block="maintenance-001"]){
--vibeui-maintenance-001-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-maintenance-001-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-maintenance-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-maintenance-001-muted:color-mix(in oklab,var(--vibeui-maintenance-001-fg) 58%,transparent);
--vibeui-maintenance-001-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-maintenance-001-accent:light-dark(oklch(0.68 0.15 75),oklch(0.78 0.14 75));
--vibeui-maintenance-001-accent-fg:oklch(from var(--vibeui-maintenance-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-maintenance-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="maintenance-001"]{color-scheme:dark}
[data-vibeui-block="maintenance-001"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-maintenance-001-fg);font-family:var(--vibeui-maintenance-001-font);
}
[data-vibeui-block="maintenance-001"] *{box-sizing:border-box}
[data-vibeui-block="maintenance-001"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-maintenance-001-border);
background:var(--vibeui-maintenance-001-card);overflow:hidden;
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="maintenance-001"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.875rem;border-bottom:1px solid var(--vibeui-maintenance-001-border);
}
[data-vibeui-block="maintenance-001"] [data-part="title"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="maintenance-001"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.3125rem;
font-size:0.625rem;font-weight:600;color:var(--vibeui-maintenance-001-muted);
}
[data-vibeui-block="maintenance-001"] [data-part="statusdot"]{
width:0.375rem;height:0.375rem;border-radius:9999px;background:var(--vibeui-maintenance-001-accent);
animation:vibeui-maintenance-001-blink 1.6s ease-in-out infinite;
}
[data-vibeui-block="maintenance-001"] [data-part="stage"]{
position:relative;height:9.5rem;padding:0.5rem;
}
[data-vibeui-block="maintenance-001"] [data-part="stack"]{
position:relative;width:100%;height:100%;
}
[data-vibeui-block="maintenance-001"] [data-part="tile"]{
position:absolute;top:50%;left:50%;width:6.25rem;height:4rem;
display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.375rem;
border-radius:0.75rem;border:1px solid var(--vibeui-maintenance-001-border);
background:var(--vibeui-maintenance-001-card);
}
[data-vibeui-block="maintenance-001"] [data-part="tile-icon"]{
width:1.25rem;height:1.25rem;border-radius:0.375rem;
background:var(--vibeui-maintenance-001-accent);opacity:.7;
}
[data-vibeui-block="maintenance-001"] [data-part="tile-label"]{
font-size:0.625rem;font-weight:600;text-align:center;padding:0 0.375rem;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%;
}
[data-vibeui-block="maintenance-001"] [data-part="tile"][data-role="back"][data-slot="0"]{
transform:translate(calc(-50% - 1rem),calc(-50% + 0.7rem)) rotate(-7deg) scale(0.92);
opacity:.62;z-index:1;
}
[data-vibeui-block="maintenance-001"] [data-part="tile"][data-role="back"][data-slot="1"]{
transform:translate(calc(-50% + 1rem),calc(-50% + 0.45rem)) rotate(6deg) scale(0.95);
opacity:.78;z-index:2;
}
[data-vibeui-block="maintenance-001"] [data-part="tile"][data-role="front"]{
z-index:3;box-shadow:0 18px 30px -16px oklch(0 0 0 / 0.35);
border-color:color-mix(in oklab,var(--vibeui-maintenance-001-accent) 45%,var(--vibeui-maintenance-001-border));
animation:vibeui-maintenance-001-bob 3.6s ease-in-out infinite;
}
[data-vibeui-block="maintenance-001"] [data-part="tile"][data-role="front"] [data-part="tile-icon"]{opacity:1}
[data-vibeui-block="maintenance-001"] [data-part="wrench"]{
position:absolute;top:50%;left:50%;width:1.875rem;height:1.875rem;
display:flex;align-items:center;justify-content:center;
transform:translate(0.9rem,-3.25rem);border-radius:9999px;
border:1px solid var(--vibeui-maintenance-001-border);
background:var(--vibeui-maintenance-001-card);
box-shadow:0 6px 14px -8px oklch(0 0 0 / 0.4);z-index:4;
}
[data-vibeui-block="maintenance-001"] [data-part="wrench"] svg{
width:1rem;height:1rem;color:var(--vibeui-maintenance-001-accent);
transform-origin:70% 30%;
animation:vibeui-maintenance-001-wrench 1.8s ease-in-out infinite;
}
[data-vibeui-block="maintenance-001"][data-paused="true"] *{animation-play-state:paused!important}
@keyframes vibeui-maintenance-001-bob{
0%,100%{transform:translate(-50%,-64%) rotate(-2deg) scale(1.05)}
50%{transform:translate(-50%,-72%) rotate(2deg) scale(1.07)}
}
@keyframes vibeui-maintenance-001-wrench{
0%,100%{transform:rotate(-16deg)}
50%{transform:rotate(16deg)}
}
@keyframes vibeui-maintenance-001-blink{0%,100%{opacity:.45}50%{opacity:1}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="maintenance-001"] [data-part="tile"][data-role="front"]{
animation:none;transform:translate(-50%,-68%) rotate(0deg) scale(1.06);
}
[data-vibeui-block="maintenance-001"] [data-part="wrench"] svg{animation:none;transform:rotate(-10deg)}
[data-vibeui-block="maintenance-001"] [data-part="statusdot"]{animation:none}
}
`

const WRENCH = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
)

const DEFAULT_SERVICES: Maintenance001Service[] = [
  { label: "База данных" },
  { label: "Платёжный шлюз" },
  { label: "Очередь задач" },
]

/**
 * Стопка карточек-сервисов, одна приподнята и обрабатывается гаечным
 * ключом. Один файл, ноль зависимостей, собственная палитра, вся
 * анимация на CSS.
 */
export function Maintenance001({
  title = "Технические работы",
  status = "Ведутся работы",
  services = DEFAULT_SERVICES,
  activeIndex = 1,
  accent,
  paused = false,
  className,
  style,
  ...props
}: Maintenance001Props) {
  const palette = {
    ...(accent ? { "--vibeui-maintenance-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  const items = services.slice(0, 3)
  const frontAt = Math.min(Math.max(activeIndex, 0), items.length - 1)
  const front = items[frontAt] ?? items[0]
  const backs = items.filter((_, index) => index !== frontAt).slice(0, 2)

  return (
    <>
      <style href="vibeui-maintenance-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="maintenance-001"
        data-slot="maintenance-stack"
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
          <div data-part="stage" role="img" aria-label={title}>
            <div data-part="stack">
              {backs.map((service, index) => (
                <div
                  data-part="tile"
                  data-role="back"
                  data-slot={index}
                  aria-hidden="true"
                  key={service.label}
                >
                  <span data-part="tile-icon" />
                  <span data-part="tile-label">{service.label}</span>
                </div>
              ))}
              {front ? (
                <div data-part="tile" data-role="front" aria-hidden="true">
                  <span data-part="tile-icon" />
                  <span data-part="tile-label">{front.label}</span>
                </div>
              ) : null}
              <span data-part="wrench" aria-hidden="true">
                {WRENCH}
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

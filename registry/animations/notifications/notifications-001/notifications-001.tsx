import type { ComponentProps, CSSProperties } from "react"

export type Notifications001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  /** Вторая строка под заголовком: короткая подпись. */
  subtitle?: string
  /** Число на бейдже. 0 скрывает бейдж, больше 99 показывает «99+». */
  count?: number
  accent?: string
  /** false — колокольчик и бейдж застывают без анимации. */
  shake?: boolean
}

// Идея: иконка-плитка с колокольчиком и бейджем непрочитанных. Раз в цикл
// колокольчик коротко покачивается (несколько шагов rotate туда-обратно —
// как от щелчка по языку колокола), а следом бейдж выскакивает поверх
// плитки с небольшим перехлёстом (overshoot). Оба движения на одной
// временной шкале, поэтому звон и pop бейджа читаются как одно событие.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="notifications-001"]){
--vibeui-notifications-001-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-notifications-001-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-notifications-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-notifications-001-muted:color-mix(in oklab,var(--vibeui-notifications-001-fg) 60%,transparent);
--vibeui-notifications-001-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-notifications-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-notifications-001-accent-fg:oklch(from var(--vibeui-notifications-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-notifications-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="notifications-001"]{color-scheme:dark}
[data-vibeui-block="notifications-001"]{
display:block;box-sizing:border-box;width:100%;max-width:18rem;margin:0;
color:var(--vibeui-notifications-001-fg);font-family:var(--vibeui-notifications-001-font);
}
[data-vibeui-block="notifications-001"] *{box-sizing:border-box}
[data-vibeui-block="notifications-001"] [data-part="card"]{
display:flex;align-items:center;gap:0.875rem;
padding:1rem 1.125rem;border-radius:1.25rem;border:1px solid var(--vibeui-notifications-001-border);
background:var(--vibeui-notifications-001-card);box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="notifications-001"] [data-part="tile"]{
position:relative;flex:none;display:flex;align-items:center;justify-content:center;
width:3.25rem;height:3.25rem;border-radius:1rem;
background:color-mix(in oklab,var(--vibeui-notifications-001-accent) 16%,var(--vibeui-notifications-001-frame));
}
[data-vibeui-block="notifications-001"] [data-part="bell"]{
width:1.5rem;height:1.5rem;color:var(--vibeui-notifications-001-accent);
transform-origin:50% 6%;
animation:vibeui-notifications-001-ring 4.5s ease-in-out infinite;
}
[data-vibeui-block="notifications-001"] [data-part="badge"]{
position:absolute;top:-0.25rem;right:-0.25rem;min-width:1.125rem;height:1.125rem;
padding:0 0.25rem;border-radius:9999px;display:inline-flex;align-items:center;justify-content:center;
font-size:0.5625rem;font-weight:700;font-variant-numeric:tabular-nums;line-height:1;
color:oklch(from var(--vibeui-notifications-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);background:var(--vibeui-notifications-001-accent);
border:2px solid var(--vibeui-notifications-001-card);
animation:vibeui-notifications-001-pop 4.5s ease-in-out infinite;
}
[data-vibeui-block="notifications-001"] [data-part="text"]{min-width:0}
[data-vibeui-block="notifications-001"] [data-part="title"]{
margin:0;font-size:0.8125rem;font-weight:650;letter-spacing:-0.01em;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="notifications-001"] [data-part="subtitle"]{
margin:0.125rem 0 0;font-size:0.6875rem;color:var(--vibeui-notifications-001-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="notifications-001"][data-shake="false"] [data-part="bell"]{animation:none}
[data-vibeui-block="notifications-001"][data-shake="false"] [data-part="badge"]{
animation:none;transform:scale(1);opacity:1;
}
@keyframes vibeui-notifications-001-ring{
0%,3%{transform:rotate(0deg)}
6%{transform:rotate(-16deg)}
9%{transform:rotate(13deg)}
12%{transform:rotate(-9deg)}
15%{transform:rotate(6deg)}
18%{transform:rotate(-3deg)}
21%,100%{transform:rotate(0deg)}
}
@keyframes vibeui-notifications-001-pop{
0%,5%{transform:scale(0);opacity:0}
11%{transform:scale(1.25);opacity:1}
15%{transform:scale(0.9)}
19%,100%{transform:scale(1);opacity:1}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="notifications-001"] [data-part="bell"]{animation:none}
[data-vibeui-block="notifications-001"] [data-part="badge"]{animation:none;transform:scale(1);opacity:1}
}
`

const BELL = (
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
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

/**
 * Иконка-плитка с колокольчиком и бейджем непрочитанных. Один файл, ноль
 * зависимостей, собственная палитра. Звон и pop бейджа — на чистом CSS.
 */
export function Notifications001({
  title = "Уведомления",
  subtitle = "5 новых оповещений",
  count = 5,
  accent,
  shake = true,
  className,
  style,
  ...props
}: Notifications001Props) {
  const palette = {
    ...(accent ? { "--vibeui-notifications-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  const badgeLabel = count > 99 ? "99+" : String(count)

  return (
    <>
      <style href="vibeui-notifications-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="notifications-001"
        data-slot="notifications-bell"
        data-shake={shake ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="tile">
            <span data-part="bell" aria-hidden="true">
              {BELL}
            </span>
            {count > 0 ? <span data-part="badge">{badgeLabel}</span> : null}
          </div>
          <div data-part="text">
            <p data-part="title">{title}</p>
            {subtitle ? <p data-part="subtitle">{subtitle}</p> : null}
          </div>
        </div>
      </section>
    </>
  )
}

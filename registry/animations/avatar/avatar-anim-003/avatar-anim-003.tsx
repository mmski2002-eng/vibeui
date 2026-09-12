import type { ComponentProps, CSSProperties } from "react"

export type AvatarAnim003Stat = {
  label: string
  value: string
}

export type AvatarAnim003Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  name?: string
  role?: string
  initials?: string
  stats?: AvatarAnim003Stat[]
  accent?: string
  /** Пульсирующее свечение за аватаром. false — статичный кружок. */
  pulse?: boolean
  /** Изометрический наклон карточки. */
  isometric?: boolean
  /** Радужное свечение под карточкой (дышит). false — плоская карточка. */
  gradient?: boolean
}

// Идея: компактная профильная карточка — аватар с именем и ролью сверху,
// ряд из 2–3 мини-статистик снизу. Анимация категории двойная: за аватаром
// непрерывно пульсирует кольцо акцентного цвета (не hover, а вечный сигнал
// «на связи»), а статистики въезжают снизу по очереди при монтировании.
const STYLES = `
:where([data-vibeui-block="avatar-anim-003"]){
--vibeui-avatar-anim-003-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-avatar-anim-003-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-avatar-anim-003-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-avatar-anim-003-muted:color-mix(in oklab,var(--vibeui-avatar-anim-003-fg) 62%,transparent);
--vibeui-avatar-anim-003-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-avatar-anim-003-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-avatar-anim-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-anim-003"]{color-scheme:dark}
[data-vibeui-block="avatar-anim-003"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-avatar-anim-003-fg);font-family:var(--vibeui-avatar-anim-003-font);
}
[data-vibeui-block="avatar-anim-003"] *{box-sizing:border-box}
[data-vibeui-block="avatar-anim-003"] [data-part="stage"]{perspective:1400px}
[data-vibeui-block="avatar-anim-003"] [data-part="frame"]{
position:relative;isolation:isolate;padding:0.375rem;
border-radius:1.5rem;border:1px solid var(--vibeui-avatar-anim-003-border);
background:color-mix(in oklab,var(--vibeui-avatar-anim-003-frame) 75%,transparent);
transition:transform .3s ease;transform-origin:center;
}
[data-vibeui-block="avatar-anim-003"] [data-part="glow"]{
position:absolute;left:0.3125rem;right:0.3125rem;bottom:0;height:5rem;z-index:0;
border-radius:9999px 9999px 0.75rem 0.75rem;
background:linear-gradient(to right,#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#6366f1,#8b5cf6);
filter:blur(7px);opacity:0.6;transform-origin:center bottom;
animation:vibeui-avatar-anim-003-breathe 4.5s ease-in-out infinite;
}
[data-vibeui-block="avatar-anim-003"][data-flat="true"] [data-part="glow"]{display:none}
[data-vibeui-block="avatar-anim-003"] [data-part="card"]{
position:relative;z-index:1;
border-radius:1rem;border:1px solid var(--vibeui-avatar-anim-003-border);
background:var(--vibeui-avatar-anim-003-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="avatar-anim-003"] [data-part="top"]{
display:flex;align-items:center;gap:0.75rem;padding:0.9375rem 0.9375rem 0;
}
[data-vibeui-block="avatar-anim-003"] [data-part="avatar-wrap"]{
position:relative;width:3.25rem;height:3.25rem;flex:none;
display:flex;align-items:center;justify-content:center;
}
[data-vibeui-block="avatar-anim-003"] [data-part="ring"]{
position:absolute;inset:-0.375rem;border-radius:9999px;
background:var(--vibeui-avatar-anim-003-accent);opacity:.4;filter:blur(3px);
animation:vibeui-avatar-anim-003-pulse 2.4s ease-out infinite;color:oklch(from var(--vibeui-avatar-anim-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="avatar-anim-003"][data-pulse="false"] [data-part="ring"]{display:none}
[data-vibeui-block="avatar-anim-003"] [data-part="avatar"]{
position:relative;z-index:1;width:100%;height:100%;border-radius:9999px;
display:flex;align-items:center;justify-content:center;
font-size:1.0625rem;font-weight:700;color:oklch(from var(--vibeui-avatar-anim-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
background:var(--vibeui-avatar-anim-003-accent);
box-shadow:0 2px 6px oklch(0 0 0 / 0.16);
}
[data-vibeui-block="avatar-anim-003"] [data-part="identity"]{
display:flex;flex-direction:column;gap:0.125rem;min-width:0;
}
[data-vibeui-block="avatar-anim-003"] [data-part="name"]{
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.875rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="avatar-anim-003"] [data-part="role"]{
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.6875rem;color:var(--vibeui-avatar-anim-003-muted);
}
[data-vibeui-block="avatar-anim-003"] [data-part="stats"]{
display:flex;margin:0.9375rem 0 0;border-top:1px solid var(--vibeui-avatar-anim-003-border);
}
[data-vibeui-block="avatar-anim-003"] [data-part="stat"]{
flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:0.125rem;
padding:0.6875rem 0.5rem;border-left:1px solid var(--vibeui-avatar-anim-003-border);
animation:vibeui-avatar-anim-003-rise .45s ease both;
}
[data-vibeui-block="avatar-anim-003"] [data-part="stat"]:first-child{border-left:none}
[data-vibeui-block="avatar-anim-003"] [data-part="stat"]:nth-child(1){animation-delay:.05s}
[data-vibeui-block="avatar-anim-003"] [data-part="stat"]:nth-child(2){animation-delay:.15s}
[data-vibeui-block="avatar-anim-003"] [data-part="stat"]:nth-child(3){animation-delay:.25s}
[data-vibeui-block="avatar-anim-003"] [data-part="value"]{
font-size:0.9375rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="avatar-anim-003"] [data-part="label"]{
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%;
font-size:0.625rem;color:var(--vibeui-avatar-anim-003-muted);
}
@keyframes vibeui-avatar-anim-003-breathe{0%,100%{transform:scaleX(0.8)}50%{transform:scaleX(1)}}
@keyframes vibeui-avatar-anim-003-pulse{0%{transform:scale(.85);opacity:.45}80%,100%{transform:scale(1.4);opacity:0}}
@keyframes vibeui-avatar-anim-003-rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="avatar-anim-003"] [data-part="glow"]{animation:none;transform:scaleX(0.92)}
[data-vibeui-block="avatar-anim-003"] [data-part="ring"]{animation:none;opacity:0}
[data-vibeui-block="avatar-anim-003"] [data-part="stat"]{animation:none}
}
`

const DEFAULT_STATS: AvatarAnim003Stat[] = [
  { label: "Проекты", value: "24" },
  { label: "Подписчики", value: "1.2K" },
  { label: "Рейтинг", value: "4.9" },
]

/**
 * Профильная карточка с пульсирующим кольцом за аватаром и мини-статистикой,
 * которая въезжает по очереди. Один файл, ноль зависимостей, своя палитра.
 */
export function AvatarAnim003({
  name = "Анна Ковалёва",
  role = "Продуктовый дизайнер",
  initials = "АК",
  stats = DEFAULT_STATS,
  accent,
  pulse = true,
  isometric = false,
  gradient = true,
  className,
  style,
  ...props
}: AvatarAnim003Props) {
  const palette = {
    ...(accent ? { "--vibeui-avatar-anim-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  return (
    <>
      <style href="vibeui-avatar-anim-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="avatar-anim-003"
        data-slot="avatar-profile-card"
        data-pulse={pulse ? undefined : "false"}
        data-flat={gradient ? undefined : "true"}
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="frame" style={frameStyle}>
            <div data-part="glow" aria-hidden="true" />
            <div data-part="card">
              <div data-part="top">
                <div data-part="avatar-wrap">
                  <span data-part="ring" aria-hidden="true" />
                  <span data-part="avatar" role="img" aria-label={name}>
                    {initials}
                  </span>
                </div>
                <div data-part="identity">
                  <p data-part="name">{name}</p>
                  <p data-part="role">{role}</p>
                </div>
              </div>
              <div data-part="stats">
                {stats.map((stat) => (
                  <div data-part="stat" key={stat.label}>
                    <span data-part="value">{stat.value}</span>
                    <span data-part="label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

import type { ComponentProps, CSSProperties } from "react"

export type AvatarAnim001Person = {
  initials: string
  /** Полное имя — уходит в aria-label, на карточке видны только инициалы. */
  name?: string
}

export type AvatarAnim001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  /** Пилюля справа от заголовка: общее число людей. */
  badge?: string
  people?: AvatarAnim001Person[]
  /** Плотная раскладка: аватары мельче, сетка чаще. */
  dense?: boolean
  /** Изометрический наклон карточки. */
  isometric?: boolean
  /** Радужное свечение под карточкой (дышит). false — плоская карточка. */
  gradient?: boolean
}

// Идея: сетка круглых аватаров с инициалами на цветном фоне, акцентные
// цвета идут по кругу из шести оттенков. Анимация категории — появление:
// каждый кружок влетает с лёгким увеличением из невидимости, задержка
// растёт по порядку (--i на инлайн-стиле), так сетка «досыпается» слева
// направо и сверху вниз при монтировании.
const STYLES = `
:where([data-vibeui-block="avatar-anim-001"]){
--vibeui-avatar-anim-001-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-avatar-anim-001-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-avatar-anim-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-avatar-anim-001-muted:color-mix(in oklab,var(--vibeui-avatar-anim-001-fg) 62%,transparent);
--vibeui-avatar-anim-001-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-avatar-anim-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-avatar-anim-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-anim-001"]{color-scheme:dark}
[data-vibeui-block="avatar-anim-001"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-avatar-anim-001-fg);font-family:var(--vibeui-avatar-anim-001-font);
}
[data-vibeui-block="avatar-anim-001"] *{box-sizing:border-box}
[data-vibeui-block="avatar-anim-001"] [data-part="stage"]{perspective:1400px}
[data-vibeui-block="avatar-anim-001"] [data-part="frame"]{
position:relative;isolation:isolate;padding:0.375rem;
border-radius:1.5rem;border:1px solid var(--vibeui-avatar-anim-001-border);
background:color-mix(in oklab,var(--vibeui-avatar-anim-001-frame) 75%,transparent);
transition:transform .3s ease;transform-origin:center;
}
[data-vibeui-block="avatar-anim-001"] [data-part="glow"]{
position:absolute;left:0.3125rem;right:0.3125rem;bottom:0;height:5rem;z-index:0;
border-radius:9999px 9999px 0.75rem 0.75rem;
background:linear-gradient(to right,#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#6366f1,#8b5cf6);
filter:blur(7px);opacity:0.6;transform-origin:center bottom;
animation:vibeui-avatar-anim-001-breathe 4.5s ease-in-out infinite;
}
[data-vibeui-block="avatar-anim-001"][data-flat="true"] [data-part="glow"]{display:none}
[data-vibeui-block="avatar-anim-001"] [data-part="card"]{
position:relative;z-index:1;
border-radius:1rem;border:1px solid var(--vibeui-avatar-anim-001-border);
background:var(--vibeui-avatar-anim-001-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="avatar-anim-001"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.75rem;border-bottom:1px solid var(--vibeui-avatar-anim-001-border);
}
[data-vibeui-block="avatar-anim-001"] [data-part="gtitle"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="avatar-anim-001"] [data-part="badge"]{
display:inline-flex;align-items:center;justify-content:center;
height:1rem;min-width:1rem;padding:0 0.3125rem;border-radius:9999px;
font-size:0.5625rem;font-weight:650;font-variant-numeric:tabular-nums;
color:var(--vibeui-avatar-anim-001-accent);
background:color-mix(in oklab,var(--vibeui-avatar-anim-001-accent) 14%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-avatar-anim-001-accent) 22%,transparent);
}
[data-vibeui-block="avatar-anim-001"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(auto-fill,minmax(2.75rem,1fr));
gap:0.625rem;padding:0.875rem;
}
[data-vibeui-block="avatar-anim-001"][data-dense="true"] [data-part="grid"]{
grid-template-columns:repeat(auto-fill,minmax(2rem,1fr));gap:0.375rem;
}
/* Появление сетки: каждый кружок стартует невидимым и увеличенным из нуля,
   задержка растёт по номеру (--i), так строки «досыпаются» по очереди. */
[data-vibeui-block="avatar-anim-001"] [data-part="avatar"]{
position:relative;display:flex;align-items:center;justify-content:center;
width:2.75rem;height:2.75rem;flex:none;border-radius:9999px;
font-size:0.75rem;font-weight:650;color:#fff;
border:2px solid var(--vibeui-avatar-anim-001-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.12);
animation:vibeui-avatar-anim-001-in .5s cubic-bezier(.16,1,.3,1) both;
animation-delay:calc(var(--i) * 55ms);
}
[data-vibeui-block="avatar-anim-001"][data-dense="true"] [data-part="avatar"]{
width:2rem;height:2rem;font-size:0.625rem;border-width:1.5px;
}
[data-vibeui-block="avatar-anim-001"] [data-part="avatar"]:nth-child(6n+1){background:#ef4444}
[data-vibeui-block="avatar-anim-001"] [data-part="avatar"]:nth-child(6n+2){background:#f97316}
[data-vibeui-block="avatar-anim-001"] [data-part="avatar"]:nth-child(6n+3){background:#eab308;color:#1c1917}
[data-vibeui-block="avatar-anim-001"] [data-part="avatar"]:nth-child(6n+4){background:#22c55e}
[data-vibeui-block="avatar-anim-001"] [data-part="avatar"]:nth-child(6n+5){background:#3b82f6}
[data-vibeui-block="avatar-anim-001"] [data-part="avatar"]:nth-child(6n+6){background:#8b5cf6}
@keyframes vibeui-avatar-anim-001-breathe{0%,100%{transform:scaleX(0.8)}50%{transform:scaleX(1)}}
@keyframes vibeui-avatar-anim-001-in{from{opacity:0;transform:scale(.55)}to{opacity:1;transform:scale(1)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="avatar-anim-001"] [data-part="glow"]{animation:none;transform:scaleX(0.92)}
[data-vibeui-block="avatar-anim-001"] [data-part="avatar"]{animation:none}
}
`

const DEFAULT_PEOPLE: AvatarAnim001Person[] = [
  { initials: "АК", name: "Анна Ковалёва" },
  { initials: "МП", name: "Максим Петров" },
  { initials: "ЕС", name: "Елена Смирнова" },
  { initials: "ДВ", name: "Дмитрий Волков" },
  { initials: "НТ", name: "Наталья Титова" },
  { initials: "ИЛ", name: "Игорь Лебедев" },
  { initials: "ОР", name: "Ольга Романова" },
  { initials: "СЖ", name: "Сергей Жуков" },
]

/**
 * Сетка аватаров с радужным свечением и попарным появлением по кругу
 * акцентных цветов. Один файл, ноль зависимостей, собственная палитра.
 */
export function AvatarAnim001({
  title = "Команда",
  badge = "24",
  people = DEFAULT_PEOPLE,
  dense = false,
  isometric = false,
  gradient = true,
  className,
  style,
  ...props
}: AvatarAnim001Props) {
  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  return (
    <>
      <style href="vibeui-avatar-anim-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="avatar-anim-001"
        data-slot="avatar-grid"
        data-dense={dense ? "true" : undefined}
        data-flat={gradient ? undefined : "true"}
        className={className}
        style={style}
      >
        <div data-part="stage">
          <div data-part="frame" style={frameStyle}>
            <div data-part="glow" aria-hidden="true" />
            <div data-part="card">
              <div data-part="head">
                <p data-part="gtitle">{title}</p>
                {badge ? <span data-part="badge">{badge}</span> : null}
              </div>
              <div data-part="grid">
                {people.map((person, index) => (
                  <div
                    key={person.initials + index}
                    data-part="avatar"
                    role="img"
                    aria-label={person.name ?? person.initials}
                    style={{ "--i": index } as CSSProperties}
                  >
                    {person.initials}
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

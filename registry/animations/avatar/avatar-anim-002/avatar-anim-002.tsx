import type { ComponentProps, CSSProperties } from "react"

export type AvatarAnim002Person = {
  initials: string
  /** Полное имя — уходит в aria-label, на карточке видны только инициалы. */
  name?: string
}

export type AvatarAnim002Props = Omit<ComponentProps<"section">, "children"> & {
  people?: AvatarAnim002Person[]
  /** Сколько людей ещё не поместилось в ряд — рисуется пилюлей "+N". */
  moreCount?: number
  /** Подпись под рядом: например, общее число участников. */
  caption?: string
  size?: "sm" | "md" | "lg"
  /** Изометрический наклон карточки. */
  isometric?: boolean
  /** Радужное свечение под карточкой (дышит). false — плоская карточка. */
  gradient?: boolean
}

// Идея: ряд аватаров внахлёст с обводкой цвета карточки и пилюлей "+N" на
// конце. Анимация категории — при монтировании кружки разъезжаются из одной
// точки в свою внахлёст-позицию (задержка растёт по номеру через --i), а по
// hover верхний слегка приподнимается и выходит на передний план.
const STYLES = `
:where([data-vibeui-block="avatar-anim-002"]){
--vibeui-avatar-anim-002-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-avatar-anim-002-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-avatar-anim-002-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-avatar-anim-002-muted:color-mix(in oklab,var(--vibeui-avatar-anim-002-fg) 62%,transparent);
--vibeui-avatar-anim-002-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-avatar-anim-002-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-avatar-anim-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-avatar-anim-002-size:2.5rem;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-anim-002"]{color-scheme:dark}
[data-vibeui-block="avatar-anim-002"][data-size="sm"]{--vibeui-avatar-anim-002-size:2rem}
[data-vibeui-block="avatar-anim-002"][data-size="lg"]{--vibeui-avatar-anim-002-size:3rem}
[data-vibeui-block="avatar-anim-002"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-avatar-anim-002-fg);font-family:var(--vibeui-avatar-anim-002-font);
}
[data-vibeui-block="avatar-anim-002"] *{box-sizing:border-box}
[data-vibeui-block="avatar-anim-002"] [data-part="stage"]{perspective:1400px}
[data-vibeui-block="avatar-anim-002"] [data-part="frame"]{
position:relative;isolation:isolate;padding:0.375rem;
border-radius:1.5rem;border:1px solid var(--vibeui-avatar-anim-002-border);
background:color-mix(in oklab,var(--vibeui-avatar-anim-002-frame) 75%,transparent);
transition:transform .3s ease;transform-origin:center;
}
[data-vibeui-block="avatar-anim-002"] [data-part="glow"]{
position:absolute;left:0.3125rem;right:0.3125rem;bottom:0;height:5rem;z-index:0;
border-radius:9999px 9999px 0.75rem 0.75rem;
background:linear-gradient(to right,#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#6366f1,#8b5cf6);
filter:blur(7px);opacity:0.6;transform-origin:center bottom;
animation:vibeui-avatar-anim-002-breathe 4.5s ease-in-out infinite;
}
[data-vibeui-block="avatar-anim-002"][data-flat="true"] [data-part="glow"]{display:none}
[data-vibeui-block="avatar-anim-002"] [data-part="card"]{
position:relative;z-index:1;
border-radius:1rem;border:1px solid var(--vibeui-avatar-anim-002-border);
background:var(--vibeui-avatar-anim-002-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
padding:1.125rem 0.875rem 0.875rem;
}
[data-vibeui-block="avatar-anim-002"] [data-part="stack"]{
display:flex;align-items:center;padding-left:0.5rem;
}
[data-vibeui-block="avatar-anim-002"] [data-part="avatar"],
[data-vibeui-block="avatar-anim-002"] [data-part="more"]{
position:relative;display:flex;align-items:center;justify-content:center;
width:var(--vibeui-avatar-anim-002-size);height:var(--vibeui-avatar-anim-002-size);
flex:none;border-radius:9999px;margin-left:-0.875rem;
font-size:0.75rem;font-weight:650;color:#fff;
border:2px solid var(--vibeui-avatar-anim-002-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.12);
transition:transform .2s ease,box-shadow .2s ease;
animation:vibeui-avatar-anim-002-in .5s cubic-bezier(.16,1,.3,1) both;
animation-delay:calc(var(--i) * 70ms);
}
[data-vibeui-block="avatar-anim-002"] [data-part="avatar"]:hover,
[data-vibeui-block="avatar-anim-002"] [data-part="more"]:hover{
transform:translateY(-0.3rem) scale(1.06);z-index:10;
box-shadow:0 6px 14px oklch(0 0 0 / 0.18);
}
[data-vibeui-block="avatar-anim-002"] [data-part="avatar"]:nth-child(6n+1){background:#ef4444}
[data-vibeui-block="avatar-anim-002"] [data-part="avatar"]:nth-child(6n+2){background:#f97316}
[data-vibeui-block="avatar-anim-002"] [data-part="avatar"]:nth-child(6n+3){background:#eab308;color:#1c1917}
[data-vibeui-block="avatar-anim-002"] [data-part="avatar"]:nth-child(6n+4){background:#22c55e}
[data-vibeui-block="avatar-anim-002"] [data-part="avatar"]:nth-child(6n+5){background:#3b82f6}
[data-vibeui-block="avatar-anim-002"] [data-part="avatar"]:nth-child(6n+6){background:#8b5cf6}
[data-vibeui-block="avatar-anim-002"] [data-part="more"]{
background:color-mix(in oklab,var(--vibeui-avatar-anim-002-fg) 12%,var(--vibeui-avatar-anim-002-card));
color:var(--vibeui-avatar-anim-002-muted);font-size:0.625rem;
}
[data-vibeui-block="avatar-anim-002"] [data-part="caption"]{
margin:0.625rem 0 0;font-size:0.6875rem;color:var(--vibeui-avatar-anim-002-muted);
}
@keyframes vibeui-avatar-anim-002-breathe{0%,100%{transform:scaleX(0.8)}50%{transform:scaleX(1)}}
@keyframes vibeui-avatar-anim-002-in{
from{opacity:0;transform:translateX(calc(-1 * var(--i) * 1.4rem)) scale(.7)}
to{opacity:1;transform:translateX(0) scale(1)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="avatar-anim-002"] [data-part="glow"]{animation:none;transform:scaleX(0.92)}
[data-vibeui-block="avatar-anim-002"] [data-part="avatar"],
[data-vibeui-block="avatar-anim-002"] [data-part="more"]{animation:none}
}
`

const DEFAULT_PEOPLE: AvatarAnim002Person[] = [
  { initials: "АК", name: "Анна Ковалёва" },
  { initials: "МП", name: "Максим Петров" },
  { initials: "ЕС", name: "Елена Смирнова" },
  { initials: "ДВ", name: "Дмитрий Волков" },
]

/**
 * Стопка аватаров внахлёст с пилюлей остатка. Один файл, ноль зависимостей,
 * собственная палитра. При монтировании кружки разъезжаются в ряд.
 */
export function AvatarAnim002({
  people = DEFAULT_PEOPLE,
  moreCount = 8,
  caption = "12 участников обсуждения",
  size = "md",
  isometric = false,
  gradient = true,
  className,
  style,
  ...props
}: AvatarAnim002Props) {
  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  return (
    <>
      <style href="vibeui-avatar-anim-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="avatar-anim-002"
        data-slot="avatar-stack"
        data-size={size}
        data-flat={gradient ? undefined : "true"}
        className={className}
        style={style}
      >
        <div data-part="stage">
          <div data-part="frame" style={frameStyle}>
            <div data-part="glow" aria-hidden="true" />
            <div data-part="card">
              <div data-part="stack">
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
                {moreCount > 0 ? (
                  <div
                    data-part="more"
                    aria-label={`Ещё ${moreCount}`}
                    style={{ "--i": people.length } as CSSProperties}
                  >
                    +{moreCount}
                  </div>
                ) : null}
              </div>
              {caption ? <p data-part="caption">{caption}</p> : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

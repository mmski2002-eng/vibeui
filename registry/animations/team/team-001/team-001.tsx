import type { ComponentProps, CSSProperties } from "react"

export type Team001Member = {
  name: string
  role: string
  /** 1-2 буквы для плейсхолдера аватара; по умолчанию берутся из имени. */
  initials?: string
}

export type Team001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  kicker?: string
  title?: string
  description?: string
  members?: Team001Member[]
  accent?: string
  /** Приподнимание карточки при наведении. */
  hover?: boolean
  /** Форма плейсхолдера аватара. */
  avatarShape?: "circle" | "square"
}

// Идея: сетка карточек команды, которая появляется stagger scale+fade — как
// будто состав собирается по одному человеку. Задержка растёт по номеру
// карточки через nth-child, поэтому эффект работает без единой строчки JS.
// Аватар — плейсхолдер с инициалами на градиенте, свой для каждой карточки
// (оттенок считается от порядкового номера через hue-rotate). При наведении
// карточка слегка приподнимается — обычный transition, не keyframe.
// container-type делает сетку собственным query-контейнером: колонки
// считаются от ширины секции, а не от ширины окна.
const STYLES = `
:where([data-vibeui-block="team-001"]){
--vibeui-team-001-bg:transparent;
--vibeui-team-001-fg:light-dark(oklch(0.19 0 266),oklch(0.98 0 266));
--vibeui-team-001-muted:light-dark(oklch(0.5 0 266),oklch(0.75 0 266));
--vibeui-team-001-border:light-dark(oklch(0.16 0 266 / 12%),oklch(1 0 0 / 12%));
--vibeui-team-001-card:light-dark(oklch(1 0 0),oklch(0.225 0 266));
--vibeui-team-001-accent:light-dark(oklch(0.55 0.19 264),oklch(0.72 0.163 264));
--vibeui-team-001-accent-fg:light-dark(oklch(0.99 0 266),oklch(0.17 0 266));
--vibeui-team-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="team-001"]{color-scheme:dark}
[data-vibeui-block="team-001"]{
display:block;box-sizing:border-box;width:100%;min-width:min(100%,16rem);
container-type:inline-size;
background:var(--vibeui-team-001-bg);color:var(--vibeui-team-001-fg);
font-family:var(--vibeui-team-001-font);
}
[data-vibeui-block="team-001"] *{box-sizing:border-box}
[data-vibeui-block="team-001"] [data-part="frame"]{
padding:clamp(2.5rem,10cqi,5rem) clamp(1.25rem,6cqi,2.5rem);
}
[data-vibeui-block="team-001"] [data-part="head"]{
max-width:38rem;margin:0 auto;text-align:center;
}
[data-vibeui-block="team-001"] [data-part="kicker"]{
display:inline-flex;align-items:center;gap:0.5rem;margin:0 0 0.75rem;
font-size:0.75rem;font-weight:650;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-team-001-accent);
}
[data-vibeui-block="team-001"] [data-part="title"]{
margin:0;font-size:clamp(1.5rem,4.5cqi,2.5rem);font-weight:650;
letter-spacing:-0.02em;line-height:1.15;text-wrap:balance;
}
[data-vibeui-block="team-001"] [data-part="desc"]{
margin:0.875rem 0 0;font-size:clamp(0.9375rem,1.6cqi,1.0625rem);line-height:1.6;
color:var(--vibeui-team-001-muted);text-wrap:pretty;
}
[data-vibeui-block="team-001"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem;
margin-top:clamp(2rem,6cqi,3.5rem);
}
@container (min-width:36rem){
[data-vibeui-block="team-001"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@container (min-width:52rem){
[data-vibeui-block="team-001"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr))}
}
[data-vibeui-block="team-001"] [data-part="card"]{
display:flex;flex-direction:column;align-items:center;gap:0.75rem;
padding:clamp(1.5rem,3.5cqi,2rem) 1rem;border-radius:1.25rem;
border:1px solid var(--vibeui-team-001-border);background:var(--vibeui-team-001-card);
text-align:center;opacity:0;transform:translateY(14px) scale(0.92);
animation:vibeui-team-001-in .6s cubic-bezier(.16,1,.3,1) both;
transition:transform .25s ease,box-shadow .25s ease;
}
[data-vibeui-block="team-001"] [data-part="card"]:hover{
transform:translateY(-4px);
box-shadow:0 16px 32px -20px color-mix(in oklab,var(--vibeui-team-001-fg) 35%,transparent);
}
[data-vibeui-block="team-001"][data-hover="false"] [data-part="card"]:hover{
transform:none;box-shadow:none;
}
[data-vibeui-block="team-001"][data-avatar-shape="square"] [data-part="avatar"]{
border-radius:0.9rem;
}
[data-vibeui-block="team-001"] [data-part="card"]:nth-child(1){animation-delay:0s}
[data-vibeui-block="team-001"] [data-part="card"]:nth-child(2){animation-delay:.09s}
[data-vibeui-block="team-001"] [data-part="card"]:nth-child(3){animation-delay:.18s}
[data-vibeui-block="team-001"] [data-part="card"]:nth-child(4){animation-delay:.27s}
[data-vibeui-block="team-001"] [data-part="card"]:nth-child(5){animation-delay:.36s}
[data-vibeui-block="team-001"] [data-part="card"]:nth-child(6){animation-delay:.45s}
[data-vibeui-block="team-001"] [data-part="card"]:nth-child(7){animation-delay:.54s}
[data-vibeui-block="team-001"] [data-part="card"]:nth-child(8){animation-delay:.63s}
[data-vibeui-block="team-001"] [data-part="avatar"]{
display:flex;align-items:center;justify-content:center;
width:4.25rem;height:4.25rem;border-radius:9999px;flex:none;
font-size:1.125rem;font-weight:700;color:var(--vibeui-team-001-accent-fg);
background:linear-gradient(145deg,var(--vibeui-team-001-accent),color-mix(in oklab,var(--vibeui-team-001-accent) 45%,white 30%));
filter:hue-rotate(var(--vibeui-team-001-hue,0deg));
}
[data-vibeui-block="team-001"] [data-part="name"]{margin:0;font-size:1rem;font-weight:650}
[data-vibeui-block="team-001"] [data-part="role"]{margin:0;font-size:0.8125rem;color:var(--vibeui-team-001-muted)}
@keyframes vibeui-team-001-in{
from{opacity:0;transform:translateY(14px) scale(0.92)}
to{opacity:1;transform:none}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="team-001"] [data-part="card"]{animation:none;opacity:1;transform:none}
[data-vibeui-block="team-001"] [data-part="card"]:hover{transform:none}
}
`

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/)
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

const DEFAULT_MEMBERS: Team001Member[] = [
  { name: "Анна Ковалёва", role: "Продакт-дизайнер" },
  { name: "Максим Орлов", role: "Фронтенд-инженер" },
  { name: "Дарья Литвинова", role: "Backend-инженер" },
  { name: "Игорь Соболев", role: "Продакт-менеджер" },
]

/**
 * Секция команды: сетка карточек, которые проявляются stagger scale+fade —
 * будто состав собирается по одному человеку. Аватар-плейсхолдер на
 * градиенте, hover приподнимает карточку. Один файл, ноль зависимостей.
 */
export function Team001({
  kicker = "Команда",
  title = "Люди, которые это делают",
  description = "Небольшая кросс-функциональная команда: от дизайна до продакшна каждую фичу ведёт один и тот же состав.",
  members = DEFAULT_MEMBERS,
  accent,
  hover = true,
  avatarShape = "circle",
  className,
  style,
  ...props
}: Team001Props) {
  const palette = {
    ...(accent ? { "--vibeui-team-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-team-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="team-001"
        data-slot="team-section"
        data-hover={hover ? undefined : "false"}
        data-avatar-shape={avatarShape === "square" ? "square" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="frame">
          {kicker || title || description ? (
            <div data-part="head">
              {kicker ? <p data-part="kicker">{kicker}</p> : null}
              {title ? <h2 data-part="title">{title}</h2> : null}
              {description ? <p data-part="desc">{description}</p> : null}
            </div>
          ) : null}
          <div data-part="grid">
            {members.map((member, index) => (
              <div data-part="card" key={member.name}>
                <span
                  data-part="avatar"
                  aria-hidden="true"
                  style={
                    {
                      "--vibeui-team-001-hue": `${(index * 47) % 360}deg`,
                    } as CSSProperties
                  }
                >
                  {member.initials ?? initialsFrom(member.name)}
                </span>
                <p data-part="name">{member.name}</p>
                <p data-part="role">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

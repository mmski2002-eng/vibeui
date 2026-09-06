import type { CSSProperties } from "react"

type People001Link = {
  kind: "mail" | "site" | "chat"
  label: string
  href: string
}

type People001Member = {
  name: string
  role: string
  links?: People001Link[]
}

export type People001Props = {
  eyebrow?: string
  title?: string
  members?: People001Member[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Сетка команды карточками: инициалы вместо фотографий, имя, роль и контакты
// нейтральными глифами. Инициалы — сознательный выбор: стоковые лица в разделе
// «Команда» подрывают доверие быстрее, чем их отсутствие. Глифы контактов
// рисуются CSS-символами, а не логотипами брендов: логотипы устаревают и тянут
// за собой иконочные шрифты.
const STYLES = `
:where([data-vibeui-block="people-001"]){
--vibeui-people-001-bg:transparent;
--vibeui-people-001-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-people-001-ink:light-dark(oklch(0.2 0 0),oklch(0.96 0 0));
--vibeui-people-001-muted:light-dark(oklch(0.51 0 0),oklch(0.72 0 0));
--vibeui-people-001-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-people-001-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-people-001-shadow:light-dark(oklch(0.2 0 0 / 55%),oklch(0 0 0 / 80%));
--vibeui-people-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="people-001"]{color-scheme:dark}
[data-vibeui-block="people-001"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-people-001-bg);color:var(--vibeui-people-001-ink);
font-family:var(--vibeui-people-001-font);
}
[data-vibeui-block="people-001"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="people-001"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-people-001-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="people-001"] [data-part="title"]{
margin:0 0 2rem;max-width:22ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="people-001"] [data-part="grid"]{display:grid;gap:1rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="people-001"] [data-part="card"]{
min-inline-size:0;display:flex;flex-direction:column;align-items:center;gap:0.25rem;
padding:1.75rem 1.25rem;text-align:center;
border:1px solid var(--vibeui-people-001-border);border-radius:1.125rem;
background:var(--vibeui-people-001-card);
transition:border-color .18s ease,transform .18s ease,box-shadow .18s ease;
}
[data-vibeui-block="people-001"] [data-part="card"]:hover{
border-color:color-mix(in oklab,var(--vibeui-people-001-accent) 40%,var(--vibeui-people-001-border));
transform:translateY(-2px);
box-shadow:0 22px 44px -36px var(--vibeui-people-001-shadow);
}
[data-vibeui-block="people-001"] [data-part="avatar"]{
width:3.5rem;height:3.5rem;flex:none;border-radius:999px;margin-bottom:0.625rem;
display:grid;place-items:center;
background:color-mix(in oklab,var(--vibeui-people-001-accent) 12%,var(--vibeui-people-001-card));
color:var(--vibeui-people-001-accent);
font-size:1rem;font-weight:750;letter-spacing:0.02em;
}
[data-vibeui-block="people-001"] [data-part="name"]{margin:0;font-size:1rem;font-weight:650}
[data-vibeui-block="people-001"] [data-part="role"]{margin:0;color:var(--vibeui-people-001-muted);font-size:0.8125rem;line-height:1.4}
[data-vibeui-block="people-001"] [data-part="links"]{display:flex;gap:0.5rem;margin-top:0.875rem}
[data-vibeui-block="people-001"] [data-part="link"]{
width:2rem;height:2rem;border-radius:999px;display:grid;place-items:center;
border:1px solid var(--vibeui-people-001-border);
color:var(--vibeui-people-001-muted);text-decoration:none;
font-size:0.875rem;font-weight:650;line-height:1;
transition:color .15s ease,border-color .15s ease,background .15s ease;
}
[data-vibeui-block="people-001"] [data-part="link"]:hover{
color:var(--vibeui-people-001-accent);
border-color:color-mix(in oklab,var(--vibeui-people-001-accent) 45%,var(--vibeui-people-001-border));
background:color-mix(in oklab,var(--vibeui-people-001-accent) 8%,var(--vibeui-people-001-card));
}
[data-vibeui-block="people-001"] [data-part="link"]:focus-visible{
outline:2px solid var(--vibeui-people-001-accent);outline-offset:2px;
}
[data-vibeui-block="people-001"] [data-part="link"][data-kind="mail"]::before{content:"@"}
[data-vibeui-block="people-001"] [data-part="link"][data-kind="site"]::before{content:"↗"}
[data-vibeui-block="people-001"] [data-part="link"][data-kind="chat"]::before{content:"#"}
@container (min-width: 30rem){
[data-vibeui-block="people-001"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container (min-width: 48rem){
[data-vibeui-block="people-001"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="people-001"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1.25rem}
}
@container (min-width: 64rem){
[data-vibeui-block="people-001"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="people-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_MEMBERS: People001Member[] = [
  {
    name: "Алексей Громов",
    role: "Основатель, продукт",
    links: [
      { kind: "mail", label: "Почта", href: "#" },
      { kind: "site", label: "Сайт", href: "#" },
    ],
  },
  {
    name: "Вера Лапина",
    role: "Дизайн-система и токены",
    links: [
      { kind: "mail", label: "Почта", href: "#" },
      { kind: "chat", label: "Чат сообщества", href: "#" },
    ],
  },
  {
    name: "Марат Гареев",
    role: "Фронтенд-инженер",
    links: [
      { kind: "mail", label: "Почта", href: "#" },
      { kind: "site", label: "Сайт", href: "#" },
    ],
  },
  {
    name: "Ксения Орлова",
    role: "Технический писатель",
    links: [
      { kind: "mail", label: "Почта", href: "#" },
      { kind: "chat", label: "Чат сообщества", href: "#" },
    ],
  },
  {
    name: "Никита Белов",
    role: "Инженер registry",
    links: [
      { kind: "mail", label: "Почта", href: "#" },
      { kind: "site", label: "Сайт", href: "#" },
    ],
  },
  {
    name: "Полина Царёва",
    role: "Дизайнер блоков",
    links: [
      { kind: "mail", label: "Почта", href: "#" },
      { kind: "chat", label: "Чат сообщества", href: "#" },
    ],
  },
  {
    name: "Тимур Ахметов",
    role: "Доступность и качество",
    links: [
      { kind: "mail", label: "Почта", href: "#" },
      { kind: "site", label: "Сайт", href: "#" },
    ],
  },
  {
    name: "Дарья Мельник",
    role: "Поддержка сообщества",
    links: [
      { kind: "mail", label: "Почта", href: "#" },
      { kind: "chat", label: "Чат сообщества", href: "#" },
    ],
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
}

/** Сетка команды: карточки с инициалами, ролью и контактами-глифами. */
export function People001({
  eyebrow = "Команда",
  title = "Люди, которые собирают VibeUI",
  members = DEFAULT_MEMBERS,
  background = "",
  accent,
  className,
  style,
}: People001Props) {
  const palette = {
    ...(accent ? { "--vibeui-people-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-people-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-people-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="people-001"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <ul data-part="grid">
            {members.map((member) => (
              <li key={member.name} data-part="card">
                <span data-part="avatar" aria-hidden="true">
                  {initials(member.name)}
                </span>
                <p data-part="name">{member.name}</p>
                <p data-part="role">{member.role}</p>
                {member.links && member.links.length > 0 ? (
                  <span data-part="links">
                    {member.links.map((link) => (
                      <a
                        key={link.kind + link.label}
                        data-part="link"
                        data-kind={link.kind}
                        href={link.href}
                        aria-label={`${link.label} — ${member.name}`}
                      />
                    ))}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

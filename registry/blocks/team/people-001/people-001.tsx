import type { CSSProperties } from "react"
import { Card049 } from "@/registry/components/card/card-049/card-049"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"


type People001Link = {
  kind: "mail" | "site" | "chat"
  label: string
  href: string
}

type People001Member = {
  name: string
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
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
const STYLES = `[data-vibeui-block="people-001"] [data-part="heading"]{margin-bottom:2rem}

:where([data-vibeui-block="people-001"]){
--vibeui-people-001-bg:transparent;
--vibeui-people-001-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-people-001-ink:light-dark(oklch(0.2 0 0),oklch(0.96 0 0));
--vibeui-people-001-muted:light-dark(oklch(0.51 0 0),oklch(0.72 0 0));
--vibeui-people-001-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-people-001-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-people-001-shadow:light-dark(oklch(0.2 0 0 / 55%),oklch(0 0 0 / 80%));
--vibeui-people-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-people-001-dur-2:180ms;
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
[data-vibeui-block="people-001"] [data-part="grid"]{display:grid;gap:1rem;margin:0;padding:0;list-style:none}
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
          <Heading001
            data-part="heading"
            eyebrow={eyebrow}
            title={title}
            accent={accent}
          />
          <ul data-part="grid">
            {members.map((member) => (
              <Card049 key={member.name} data-part="card" name={member.name} image={member.image} role={member.role} links={member.links} accent={accent} />
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

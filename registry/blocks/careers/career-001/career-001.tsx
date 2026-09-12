import type { CSSProperties } from "react"

type Career001Role = {
  title: string
  location: string
  type: string
}

type Career001Group = {
  department: string
  roles: Career001Role[]
}

export type Career001Props = {
  /** Фото команды за работой. Без него список вакансий остаётся текстовым. */
  image?: string
  eyebrow?: string
  title?: string
  groups?: Career001Group[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Вакансии, сгруппированные по отделам: заголовок отдела и под ним строки
// ролей с местом и типом занятости. Формат «список вакансий» для страницы
// карьеры: строка — ссылка на всю карточку, стрелка справа зовёт открыть.
const STYLES = `
:where([data-vibeui-block="career-001"]){
--vibeui-career-001-bg:transparent;
--vibeui-career-001-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-career-001-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-career-001-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-career-001-row:light-dark(oklch(0.98 0 0),oklch(0.2 0 0));
--vibeui-career-001-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-career-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="career-001"]{color-scheme:dark}
[data-vibeui-block="career-001"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-career-001-bg);color:var(--vibeui-career-001-ink);
font-family:var(--vibeui-career-001-font);
}
[data-vibeui-block="career-001"] [data-part="figure"]{
position:relative;overflow:hidden;aspect-ratio:16 / 9;
margin-top:1.5rem;border-radius:0.875rem;
}
[data-vibeui-block="career-001"] [data-part="figure"] img{
display:block;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="career-001"] [data-part="shell"]{max-width:52rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="career-001"] [data-part="eyebrow"]{margin:0 0 0.5rem;color:var(--vibeui-career-001-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase}
[data-vibeui-block="career-001"] [data-part="title"]{margin:0 0 2.25rem;font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700}
[data-vibeui-block="career-001"] [data-part="group"]{margin-bottom:2rem}
[data-vibeui-block="career-001"] [data-part="dept"]{
margin:0 0 0.75rem;font-size:0.75rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-career-001-muted);
}
[data-vibeui-block="career-001"] [data-part="roles"]{list-style:none;margin:0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="career-001"] [data-part="role"]{
display:flex;align-items:center;gap:1rem;
padding:0.875rem 1.125rem;border:1px solid var(--vibeui-career-001-border);border-radius:0.875rem;
background:var(--vibeui-career-001-row);color:inherit;text-decoration:none;
transition:border-color .16s ease,transform .16s ease;
}
[data-vibeui-block="career-001"] [data-part="role"]:hover{border-color:var(--vibeui-career-001-accent);transform:translateX(2px)}
[data-vibeui-block="career-001"] [data-part="role"]:focus-visible{outline:2px solid var(--vibeui-career-001-accent);outline-offset:2px}
[data-vibeui-block="career-001"] [data-part="role-title"]{font-size:1rem;font-weight:640}
[data-vibeui-block="career-001"] [data-part="role-meta"]{margin-left:auto;display:flex;gap:0.75rem;color:var(--vibeui-career-001-muted);font-size:0.8125rem}
[data-vibeui-block="career-001"] [data-part="arrow"]{color:var(--vibeui-career-001-accent);flex:none;font-size:1rem;line-height:1}
@container (min-width: 40rem){[data-vibeui-block="career-001"] [data-part="shell"]{padding:4rem 2rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="career-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Career001Group[] = [
  {
    department: "Инженерия",
    roles: [
      { title: "Фронтенд-разработчик", location: "Удалённо", type: "Полная" },
      {
        title: "Инженер по инфраструктуре",
        location: "Москва",
        type: "Полная",
      },
    ],
  },
  {
    department: "Дизайн",
    roles: [
      { title: "Продуктовый дизайнер", location: "Удалённо", type: "Полная" },
    ],
  },
  {
    department: "Развитие",
    roles: [
      { title: "Менеджер сообщества", location: "Удалённо", type: "Частичная" },
      { title: "Контент-стратег", location: "Удалённо", type: "Контракт" },
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

/** Вакансии, сгруппированные по отделам: строки-ссылки на карточки ролей. */
export function Career001({
  eyebrow = "Вакансии",
  image = "",
  title = "Присоединяйтесь к команде",
  groups = DEFAULT_GROUPS,
  background = "",
  accent,
  className,
  style,
}: Career001Props) {
  const palette = {
    ...(accent ? { "--vibeui-career-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-career-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-career-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="career-001"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          {groups.map((group) => (
            <div key={group.department} data-part="group">
              <h3 data-part="dept">{group.department}</h3>
              <ul data-part="roles">
                {group.roles.map((role) => (
                  <li key={role.title}>
                    <a href="#" data-part="role">
                      <span data-part="role-title">{role.title}</span>
                      <span data-part="role-meta">
                        <span>{role.location}</span>
                        <span>{role.type}</span>
                      </span>
                      <span data-part="arrow" aria-hidden="true">
                        →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {image ? (
            <figure data-part="figure">
              <img src={image} alt="" loading="lazy" decoding="async" />
            </figure>
          ) : null}
        </div>
      </section>
    </>
  )
}

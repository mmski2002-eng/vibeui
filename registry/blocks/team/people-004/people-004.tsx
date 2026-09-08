import type { CSSProperties } from "react"

type People004Member = {
  name: string
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  role: string
  city: string
  since: string
}

export type People004Props = {
  eyebrow?: string
  title?: string
  /** Подпись-счётчик в шапке; пусто — посчитается из числа людей. */
  countLabel?: string
  members?: People004Member[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Команда компактным списком: строка на человека — имя, роль, город и год
// прихода. Список вместо карточек — сознательный выбор для больших команд:
// двадцать карточек превращают секцию в бесконечную стену, а двадцать строк
// читаются как оглавление. Разделители-волосинки вместо рамок: строка легче
// карточки ровно настолько, насколько нужно.
const STYLES = `
:where([data-vibeui-block="people-004"]){
--vibeui-people-004-bg:transparent;
--vibeui-people-004-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-people-004-ink:light-dark(oklch(0.2 0 0),oklch(0.96 0 0));
--vibeui-people-004-muted:light-dark(oklch(0.51 0 0),oklch(0.72 0 0));
--vibeui-people-004-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-people-004-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-people-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="people-004"]{color-scheme:dark}
[data-vibeui-block="people-004"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-people-004-bg);color:var(--vibeui-people-004-ink);
font-family:var(--vibeui-people-004-font);
}
[data-vibeui-block="people-004"] [data-part="shell"]{max-width:56rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="people-004"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:1rem;flex-wrap:wrap;
margin:0 0 1.5rem;
}
[data-vibeui-block="people-004"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-people-004-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="people-004"] [data-part="title"]{
margin:0;max-width:22ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="people-004"] [data-part="count"]{
flex:none;padding:0.25rem 0.625rem;border-radius:999px;
border:1px solid var(--vibeui-people-004-border);
color:var(--vibeui-people-004-muted);font-size:0.75rem;font-weight:650;white-space:nowrap;
}
[data-vibeui-block="people-004"] [data-part="list"]{margin:0;padding:0;list-style:none}
[data-vibeui-block="people-004"] [data-part="row"]{
min-inline-size:0;display:grid;grid-template-columns:auto minmax(0,1fr) auto;
align-items:center;gap:0.875rem;
padding:0.75rem 0.5rem;border-top:1px solid var(--vibeui-people-004-border);
border-radius:0.5rem;
transition:background .15s ease;
}
[data-vibeui-block="people-004"] [data-part="row"]:last-child{border-bottom:1px solid var(--vibeui-people-004-border)}
[data-vibeui-block="people-004"] [data-part="row"]:hover{
background:color-mix(in oklab,var(--vibeui-people-004-accent) 7%,transparent);
}
[data-vibeui-block="people-004"] [data-part="avatar"]{
position:relative;width:2.5rem;height:2.5rem;flex:none;border-radius:999px;display:grid;place-items:center;
color:var(--vibeui-people-004-accent);
font-size:0.8125rem;font-weight:750;letter-spacing:0.02em;overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="people-004"] [data-part="avatar"][data-empty="true"]{background:color-mix(in oklab,var(--vibeui-people-004-accent) 12%,var(--vibeui-people-004-card));}
[data-vibeui-block="people-004"] [data-part="avatar"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;
}
[data-vibeui-block="people-004"] [data-part="who"]{display:grid;gap:0.0625rem;min-width:0}
[data-vibeui-block="people-004"] [data-part="name"]{
margin:0;font-size:0.9375rem;font-weight:650;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="people-004"] [data-part="role"]{
margin:0;color:var(--vibeui-people-004-muted);font-size:0.8125rem;line-height:1.35;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="people-004"] [data-part="meta"]{
display:grid;gap:0.0625rem;text-align:right;
}
[data-vibeui-block="people-004"] [data-part="city"]{font-size:0.8125rem;white-space:nowrap}
[data-vibeui-block="people-004"] [data-part="since"]{color:var(--vibeui-people-004-muted);font-size:0.75rem;white-space:nowrap}
@container (min-width: 48rem){
[data-vibeui-block="people-004"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="people-004"] [data-part="row"]{gap:1.125rem;padding:0.875rem 0.75rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="people-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_MEMBERS: People004Member[] = [
  {
    name: "Алексей Громов",
    role: "Основатель, продукт",
    city: "Санкт-Петербург",
    since: "с 2021",
  },
  {
    name: "Вера Лапина",
    role: "Дизайн-система и токены",
    city: "Москва",
    since: "с 2021",
  },
  {
    name: "Марат Гареев",
    role: "Фронтенд-инженер",
    city: "Казань",
    since: "с 2022",
  },
  {
    name: "Ксения Орлова",
    role: "Технический писатель",
    city: "Тбилиси",
    since: "с 2022",
  },
  {
    name: "Никита Белов",
    role: "Инженер registry",
    city: "Белград",
    since: "с 2023",
  },
  {
    name: "Полина Царёва",
    role: "Дизайнер блоков",
    city: "Екатеринбург",
    since: "с 2023",
  },
  {
    name: "Тимур Ахметов",
    role: "Доступность и качество",
    city: "Алматы",
    since: "с 2023",
  },
  {
    name: "Инна Штерн",
    role: "Инфраструктура и сборка",
    city: "Рига",
    since: "с 2024",
  },
  {
    name: "Олег Раков",
    role: "Моушен и микровзаимодействия",
    city: "Ереван",
    since: "с 2024",
  },
  {
    name: "Дарья Мельник",
    role: "Поддержка сообщества",
    city: "Новосибирск",
    since: "с 2024",
  },
  {
    name: "Гнат Вильде",
    role: "Примеры и шаблоны",
    city: "Лимасол",
    since: "с 2025",
  },
  {
    name: "Софья Ким",
    role: "Развитие каталога",
    city: "Минск",
    since: "с 2025",
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

/** Команда компактным списком: строка на человека, для больших составов. */
export function People004({
  eyebrow = "Команда",
  title = "Все, кто делает VibeUI",
  countLabel = "",
  members = DEFAULT_MEMBERS,
  background = "",
  accent,
  className,
  style,
}: People004Props) {
  const palette = {
    ...(accent ? { "--vibeui-people-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-people-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-people-004" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="people-004"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <div data-part="head">
            <h2 data-part="title">{title}</h2>
            <span data-part="count">
              {countLabel || `${members.length} человек`}
            </span>
          </div>
          <ul data-part="list">
            {members.map((member) => (
              <li key={member.name} data-part="row">
                <span
                  data-part="avatar"
                  data-empty={member.image ? undefined : "true"}
                  aria-hidden="true"
                >
                  {member.image ? (
                    <img
                      src={member.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  {initials(member.name)}
                </span>
                <span data-part="who">
                  <p data-part="name">{member.name}</p>
                  <p data-part="role">{member.role}</p>
                </span>
                <span data-part="meta">
                  <span data-part="city">{member.city}</span>
                  <span data-part="since">{member.since}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

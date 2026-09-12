import type { CSSProperties } from "react"

type People002Member = {
  name: string
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  role: string
  department: string
}

export type People002Props = {
  eyebrow?: string
  title?: string
  /** Подпись чипа, показывающего всех. */
  allLabel?: string
  members?: People002Member[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Команда с фильтром по отделам на чистом CSS: чипы — скрытые radio-инпуты,
// а карточки прячутся селектором :has() по значению выбранной кнопки.
// Ни строчки клиентского JS — фильтр работает в серверном компоненте.
// Отделы получают слоты d1…d6 по порядку появления в списке людей, поэтому
// CSS-правила остаются статичными при любых названиях отделов.
const STYLES = `
:where([data-vibeui-block="people-002"]){
--vibeui-people-002-bg:transparent;
--vibeui-people-002-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-people-002-ink:light-dark(oklch(0.2 0 0),oklch(0.96 0 0));
--vibeui-people-002-muted:light-dark(oklch(0.51 0 0),oklch(0.72 0 0));
--vibeui-people-002-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-people-002-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-people-002-accent-fill:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-people-002-on-accent:oklch(from var(--vibeui-people-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-people-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="people-002"]{color-scheme:dark}
[data-vibeui-block="people-002"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-people-002-bg);color:var(--vibeui-people-002-ink);
font-family:var(--vibeui-people-002-font);
}
[data-vibeui-block="people-002"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="people-002"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-people-002-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="people-002"] [data-part="title"]{
margin:0 0 1.5rem;max-width:22ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="people-002"] [data-part="filters"]{
display:flex;flex-wrap:wrap;gap:0.5rem;margin:0 0 1.75rem;padding:0;border:0;min-inline-size:0;
}
[data-vibeui-block="people-002"] [data-part="legend"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
[data-vibeui-block="people-002"] [data-part="chip"]{
position:relative;display:inline-flex;align-items:center;
padding:0.4375rem 0.875rem;border-radius:999px;
border:1px solid var(--vibeui-people-002-border);
color:var(--vibeui-people-002-muted);font-size:0.8125rem;font-weight:600;line-height:1;
cursor:pointer;
transition:color .15s ease,border-color .15s ease,background .15s ease;
}
[data-vibeui-block="people-002"] [data-part="chip"]:hover{
color:var(--vibeui-people-002-ink);
border-color:color-mix(in oklab,var(--vibeui-people-002-accent) 45%,var(--vibeui-people-002-border));
}
[data-vibeui-block="people-002"] [data-part="chip"] input{
position:absolute;inset:0;opacity:0;margin:0;cursor:pointer;
}
[data-vibeui-block="people-002"] [data-part="chip"]:has(input:checked){
background:var(--vibeui-people-002-accent-fill);
border-color:var(--vibeui-people-002-accent-fill);
color:var(--vibeui-people-002-on-accent);
}
[data-vibeui-block="people-002"] [data-part="chip"]:has(input:focus-visible){
outline:2px solid var(--vibeui-people-002-accent);outline-offset:2px;
}
[data-vibeui-block="people-002"] [data-part="grid"]{display:grid;gap:0.875rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="people-002"] [data-part="card"]{
min-inline-size:0;display:flex;align-items:center;gap:0.875rem;
padding:1rem 1.125rem;border:1px solid var(--vibeui-people-002-border);border-radius:1rem;
background:var(--vibeui-people-002-card);
transition:border-color .18s ease;
}
[data-vibeui-block="people-002"] [data-part="card"]:hover{
border-color:color-mix(in oklab,var(--vibeui-people-002-accent) 40%,var(--vibeui-people-002-border));
}
[data-vibeui-block="people-002"] [data-part="avatar"]{
position:relative;width:2.75rem;height:2.75rem;flex:none;border-radius:999px;display:grid;place-items:center;
color:var(--vibeui-people-002-accent);
font-size:0.875rem;font-weight:750;letter-spacing:0.02em;overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="people-002"] [data-part="avatar"][data-empty="true"]{background:color-mix(in oklab,var(--vibeui-people-002-accent) 12%,var(--vibeui-people-002-card));}
[data-vibeui-block="people-002"] [data-part="avatar"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;
}
[data-vibeui-block="people-002"] [data-part="who"]{display:grid;gap:0.0625rem;min-width:0}
[data-vibeui-block="people-002"] [data-part="name"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="people-002"] [data-part="role"]{margin:0;color:var(--vibeui-people-002-muted);font-size:0.8125rem;line-height:1.35}
[data-vibeui-block="people-002"] [data-part="dept"]{
margin-left:auto;flex:none;align-self:flex-start;
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.1875rem 0.5rem;border-radius:0.375rem;
border:1px solid var(--vibeui-people-002-border);
color:var(--vibeui-people-002-muted);font-size:0.6875rem;font-weight:600;white-space:nowrap;
}
[data-vibeui-block="people-002"] [data-part="dept"]::before{
content:"";width:0.375rem;height:0.375rem;border-radius:999px;
background:var(--vibeui-people-002-accent);color:oklch(from var(--vibeui-people-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="people-002"]:has([data-part="chip"] input[value="d1"]:checked) [data-part="card"]:not([data-dep="d1"]),
[data-vibeui-block="people-002"]:has([data-part="chip"] input[value="d2"]:checked) [data-part="card"]:not([data-dep="d2"]),
[data-vibeui-block="people-002"]:has([data-part="chip"] input[value="d3"]:checked) [data-part="card"]:not([data-dep="d3"]),
[data-vibeui-block="people-002"]:has([data-part="chip"] input[value="d4"]:checked) [data-part="card"]:not([data-dep="d4"]),
[data-vibeui-block="people-002"]:has([data-part="chip"] input[value="d5"]:checked) [data-part="card"]:not([data-dep="d5"]),
[data-vibeui-block="people-002"]:has([data-part="chip"] input[value="d6"]:checked) [data-part="card"]:not([data-dep="d6"]){
display:none;
}
@container (min-width: 34rem){
[data-vibeui-block="people-002"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container (min-width: 48rem){
[data-vibeui-block="people-002"] [data-part="shell"]{padding:4.5rem 2rem}
}
@container (min-width: 56rem){
[data-vibeui-block="people-002"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="people-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_MEMBERS: People002Member[] = [
  {
    name: "Вера Лапина",
    role: "Дизайн-система и токены",
    department: "Дизайн",
  },
  { name: "Полина Царёва", role: "Дизайнер блоков", department: "Дизайн" },
  {
    name: "Олег Раков",
    role: "Моушен и микровзаимодействия",
    department: "Дизайн",
  },
  { name: "Марат Гареев", role: "Фронтенд-инженер", department: "Разработка" },
  { name: "Никита Белов", role: "Инженер registry", department: "Разработка" },
  {
    name: "Инна Штерн",
    role: "Инфраструктура и сборка",
    department: "Разработка",
  },
  {
    name: "Ксения Орлова",
    role: "Документация и Copy for AI",
    department: "Контент",
  },
  { name: "Дарья Мельник", role: "Примеры и гайды", department: "Контент" },
  {
    name: "Алексей Громов",
    role: "Основатель, продукт",
    department: "Продукт",
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

/** Команда с CSS-фильтром по отделам: radio-чипы, ни строчки JS. */
export function People002({
  eyebrow = "Команда",
  title = "Четыре отдела, один каталог",
  allLabel = "Все",
  members = DEFAULT_MEMBERS,
  background = "",
  accent,
  className,
  style,
}: People002Props) {
  const departments = members
    .map((member) => member.department)
    .filter((department, index, all) => all.indexOf(department) === index)
    .slice(0, 6)

  const palette = {
    ...(accent
      ? {
          "--vibeui-people-002-accent": accent,
          "--vibeui-people-002-accent-fill": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-people-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-people-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="people-002"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <fieldset data-part="filters">
            <legend data-part="legend">Фильтр по отделу</legend>
            <label data-part="chip">
              <input
                type="radio"
                name="vibeui-people-002-department"
                value="all"
                defaultChecked
              />
              {allLabel}
            </label>
            {departments.map((department, index) => (
              <label key={department} data-part="chip">
                <input
                  type="radio"
                  name="vibeui-people-002-department"
                  value={`d${index + 1}`}
                />
                {department}
              </label>
            ))}
          </fieldset>
          <ul data-part="grid">
            {members.map((member) => (
              <li
                key={member.name}
                data-part="card"
                data-dep={`d${departments.indexOf(member.department) + 1}`}
              >
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
                <span data-part="dept">{member.department}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

import type { CSSProperties } from "react"
import { Card050 } from "@/registry/components/card/card-050/card-050"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"


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
const STYLES = `[data-vibeui-block="people-002"] [data-part="heading"]{margin-bottom:1.5rem}

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
--vibeui-people-002-dur-2:180ms;
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
transition:color var(--vibeui-people-002-dur-2) ease,border-color var(--vibeui-people-002-dur-2) ease,background var(--vibeui-people-002-dur-2) ease;
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
          <Heading001
            data-part="heading"
            eyebrow={eyebrow}
            title={title}
            accent={accent}
          />
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
              <Card050 key={member.name} data-part="card" name={member.name} department={member.department} image={member.image} role={member.role} data-dep={`d${departments.indexOf(member.department) + 1}`} accent={accent} />
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

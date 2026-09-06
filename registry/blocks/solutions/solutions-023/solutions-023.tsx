import type { CSSProperties } from "react"

export type Solutions023Group = {
  name: string
  level: string
  teacher: string
  days: string[]
  time: string
  room: string
  enrolled: number
  capacity: number
  nextLesson: string
}

export type Solutions023Props = {
  title?: string
  term?: string
  weekDays?: string[]
  groups?: Solutions023Group[]
  fullLabel?: string
  /** Счётчик в шапке, {count} — сколько мест свободно всего. */
  freeTotalText?: string
  /** Подпись ряда дней для скринридера, {days} — дни через запятую. */
  daysLabelText?: string
  /** Знаменатель набора, {total} — вместимость группы. */
  seatsText?: string
  /** Свободные места, {count} — сколько осталось. */
  freeText?: string
  /** Подпись полосы набора, {name} — название группы. */
  enrolLabelText?: string
  /** Подпись перед датой ближайшего занятия. */
  nextLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: учебные группы и расписание. Дни занятий показаны семью
// одинаковыми клетками, где активные закрашены: строка «пн, ср, пт» читается
// медленнее, чем узор, а расписание сравнивают между группами. Набор показан
// дробью и полосой, а свободные места названы числом: «80% заполнено» не
// отвечает на вопрос администратора «сколько ещё возьмём». Полная группа
// помечена и словом, и рамкой — в неё нельзя записать, и это должно быть видно
// до открытия карточки.
const STYLES = `
:where([data-vibeui-block="solutions-023"]){
--vibeui-solutions-023-bg:transparent;
--vibeui-solutions-023-panel:light-dark(oklch(0.975 0 300),oklch(0.27 0 300));
--vibeui-solutions-023-fg:light-dark(oklch(0.21 0 300),oklch(0.94 0 300));
--vibeui-solutions-023-muted:light-dark(oklch(0.53 0 300),oklch(0.7 0 300));
--vibeui-solutions-023-border:light-dark(oklch(0.9 0 300),oklch(0.36 0 300));
--vibeui-solutions-023-accent:light-dark(oklch(0.52 0.16 295),oklch(0.74 0.15 295));
--vibeui-solutions-023-on-accent:light-dark(oklch(1 0 0),oklch(0.2 0 300));
--vibeui-solutions-023-full:light-dark(oklch(0.6 0.16 35),oklch(0.76 0.14 35));
--vibeui-solutions-023-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="solutions-023"]{color-scheme:dark}
[data-vibeui-block="solutions-023"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;padding:1rem;
background:var(--vibeui-solutions-023-bg);
border:1px solid var(--vibeui-solutions-023-border);border-radius:1rem;
font-family:var(--vibeui-solutions-023-sans);color:var(--vibeui-solutions-023-fg);
}
[data-vibeui-block="solutions-023"] *{box-sizing:border-box}
[data-vibeui-block="solutions-023"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;margin-bottom:0.875rem;
}
[data-vibeui-block="solutions-023"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-023"] [data-part="term"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-023-muted)}
[data-vibeui-block="solutions-023"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.625rem}
@container (min-width: 44rem){
[data-vibeui-block="solutions-023"] ul{grid-template-columns:repeat(2,minmax(0,1fr))}
}
[data-vibeui-block="solutions-023"] li{
padding:0.75rem 0.875rem;border-radius:0.875rem;
background:var(--vibeui-solutions-023-bg);
border:1px solid var(--vibeui-solutions-023-border);
}
/* Полная группа помечена рамкой и словом: в неё нельзя записать. */
[data-vibeui-block="solutions-023"] [data-full="true"]{
border-color:color-mix(in oklab,var(--vibeui-solutions-023-full) 55%,transparent);
background:color-mix(in oklab,var(--vibeui-solutions-023-full) 6%,var(--vibeui-solutions-023-bg));
}
[data-vibeui-block="solutions-023"] [data-part="top"]{
display:flex;align-items:flex-start;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="solutions-023"] h3{margin:0;font-size:0.9375rem;font-weight:650;line-height:1.3}
[data-vibeui-block="solutions-023"] [data-part="teacher"]{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-023-muted);
}
[data-vibeui-block="solutions-023"] [data-part="level"]{
flex:none;padding:0.125rem 0.5rem;border-radius:9999px;
background:var(--vibeui-solutions-023-panel);
font-size:0.625rem;font-weight:700;letter-spacing:0.02em;text-transform:uppercase;
color:var(--vibeui-solutions-023-accent);
}
/* Семь клеток вместо строки «пн, ср, пт»: узор сравнивается быстрее текста. */
[data-vibeui-block="solutions-023"] [data-part="week"]{
display:flex;gap:0.1875rem;margin:0.625rem 0 0;
}
[data-vibeui-block="solutions-023"] [data-part="week"] span{
width:1.5rem;height:1.25rem;border-radius:0.3125rem;display:grid;place-items:center;
font-size:0.5625rem;font-weight:650;text-transform:lowercase;
background:var(--vibeui-solutions-023-panel);color:var(--vibeui-solutions-023-muted);
}
[data-vibeui-block="solutions-023"] [data-part="week"] [data-on="true"]{
background:var(--vibeui-solutions-023-accent);color:var(--vibeui-solutions-023-on-accent);
}
[data-vibeui-block="solutions-023"] [data-part="when"]{
margin:0.4375rem 0 0;font-size:0.75rem;color:var(--vibeui-solutions-023-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-023"] [data-part="when"] b{color:var(--vibeui-solutions-023-fg);font-weight:650}
[data-vibeui-block="solutions-023"] [data-part="seats"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
margin:0.625rem 0 0.25rem;font-size:0.75rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-023"] [data-part="seats"] b{font-weight:700}
/* Свободные места числом: «80% заполнено» не отвечает «сколько ещё возьмём». */
[data-vibeui-block="solutions-023"] [data-part="left"]{color:var(--vibeui-solutions-023-muted)}
[data-vibeui-block="solutions-023"] [data-full="true"] [data-part="left"]{color:var(--vibeui-solutions-023-full);font-weight:650}
[data-vibeui-block="solutions-023"] [data-part="track"]{
height:0.375rem;border-radius:9999px;overflow:hidden;
background:color-mix(in oklab,var(--vibeui-solutions-023-fg) 9%,transparent);
}
[data-vibeui-block="solutions-023"] [data-part="fill"]{display:block;height:100%;background:var(--vibeui-solutions-023-accent)}
[data-vibeui-block="solutions-023"] [data-full="true"] [data-part="fill"]{background:var(--vibeui-solutions-023-full)}
[data-vibeui-block="solutions-023"] [data-part="next"]{
margin:0.5rem 0 0;padding-top:0.5rem;border-top:1px solid var(--vibeui-solutions-023-border);
font-size:0.6875rem;color:var(--vibeui-solutions-023-muted);
}
[data-vibeui-block="solutions-023"] [data-part="next"] b{color:var(--vibeui-solutions-023-fg);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-023"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_WEEK = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]

const DEFAULT_GROUPS: Solutions023Group[] = [
  {
    name: "Английский · разговорный",
    level: "B1",
    teacher: "Ольга Панфилова",
    days: ["пн", "ср"],
    time: "19:00 — 20:30",
    room: "ауд. 4",
    enrolled: 11,
    capacity: 12,
    nextLesson: "понедельник, 18 марта",
  },
  {
    name: "Математика · подготовка к ЕГЭ",
    level: "11 класс",
    teacher: "Кирилл Ваулин",
    days: ["вт", "чт", "сб"],
    time: "16:00 — 17:30",
    room: "ауд. 2",
    enrolled: 14,
    capacity: 14,
    nextLesson: "вторник, 19 марта",
  },
  {
    name: "Рисунок с нуля",
    level: "старт",
    teacher: "Дина Соколова",
    days: ["сб"],
    time: "11:00 — 13:00",
    room: "мастерская",
    enrolled: 6,
    capacity: 10,
    nextLesson: "суббота, 16 марта",
  },
  {
    name: "Программирование на Python",
    level: "A2",
    teacher: "Алексей Ремизов",
    days: ["пн", "чт"],
    time: "18:00 — 19:40",
    room: "компьютерный класс",
    enrolled: 9,
    capacity: 15,
    nextLesson: "четверг, 21 марта",
  },
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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

/**
 * Учебные группы: дни недели клетками, набор дробью и свободные места числом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions023({
  title = "Группы и расписание",
  term = "Весенний семестр · 4 группы",
  weekDays = DEFAULT_WEEK,
  groups = DEFAULT_GROUPS,
  fullLabel = "мест нет",
  freeTotalText = "Свободных мест: {count}",
  daysLabelText = "Занятия: {days}",
  seatsText = "из {total} мест",
  freeText = "свободно {count}",
  enrolLabelText = "Набор в группу «{name}»",
  nextLabel = "Ближайшее занятие —",
  accent,
  background = "",
  className,
  style,
}: Solutions023Props) {
  const palette = {
    ...(accent ? { "--vibeui-solutions-023-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-023-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-023" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-023"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="term">{term}</p>
          </div>
          <p data-part="term">
            {freeTotalText.replace(
              "{count}",
              String(
                groups.reduce(
                  (sum, group) => sum + (group.capacity - group.enrolled),
                  0,
                ),
              ),
            )}
          </p>
        </header>

        <ul>
          {groups.map((group) => {
            const left = group.capacity - group.enrolled
            const full = left <= 0

            return (
              <li key={group.name} data-full={full ? "true" : "false"}>
                <div data-part="top">
                  <div>
                    <h3>{group.name}</h3>
                    <span data-part="teacher">
                      {group.teacher} · {group.room}
                    </span>
                  </div>
                  <span data-part="level">{group.level}</span>
                </div>

                <p
                  data-part="week"
                  role="img"
                  aria-label={daysLabelText.replace(
                    "{days}",
                    group.days.join(", "),
                  )}
                >
                  {weekDays.map((day) => (
                    <span
                      key={day}
                      data-on={group.days.includes(day) ? "true" : "false"}
                    >
                      {day}
                    </span>
                  ))}
                </p>

                <p data-part="when">
                  <b>{group.time}</b>
                </p>

                <p data-part="seats">
                  <span>
                    <b>{group.enrolled}</b>{" "}
                    {seatsText.replace("{total}", String(group.capacity))}
                  </span>
                  <span data-part="left">
                    {full
                      ? fullLabel
                      : freeText.replace("{count}", String(left))}
                  </span>
                </p>
                <div
                  data-part="track"
                  role="progressbar"
                  aria-valuenow={group.enrolled}
                  aria-valuemin={0}
                  aria-valuemax={group.capacity}
                  aria-label={enrolLabelText.replace("{name}", group.name)}
                >
                  <span
                    data-part="fill"
                    style={{
                      width: `${Math.round((group.enrolled / group.capacity) * 100)}%`,
                    }}
                  />
                </div>

                <p data-part="next">
                  {nextLabel} <b>{group.nextLesson}</b>
                </p>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}

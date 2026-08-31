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
  accent?: string
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
--vibeui-solutions-023-bg:oklch(1 0 0);
--vibeui-solutions-023-panel:oklch(0.975 0.005 300);
--vibeui-solutions-023-fg:oklch(0.21 0.014 300);
--vibeui-solutions-023-muted:oklch(0.53 0.013 300);
--vibeui-solutions-023-border:oklch(0.9 0.006 300);
--vibeui-solutions-023-accent:oklch(0.52 0.16 295);
--vibeui-solutions-023-full:oklch(0.6 0.16 35);
--vibeui-solutions-023-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-023"]{
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
background:var(--vibeui-solutions-023-accent);color:oklch(1 0 0);
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
 * Учебные группы: дни недели клетками, набор дробью и свободные места числом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions023({
  title = "Группы и расписание",
  term = "Весенний семестр · 4 группы",
  weekDays = DEFAULT_WEEK,
  groups = DEFAULT_GROUPS,
  fullLabel = "мест нет",
  accent,
  className,
  style,
}: Solutions023Props) {
  const palette = {
    ...(accent ? { "--vibeui-solutions-023-accent": accent } : null),
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
            Свободных мест:{" "}
            {groups.reduce(
              (sum, group) => sum + (group.capacity - group.enrolled),
              0,
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
                  aria-label={`Занятия: ${group.days.join(", ")}`}
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
                    <b>{group.enrolled}</b> из {group.capacity} мест
                  </span>
                  <span data-part="left">
                    {full ? fullLabel : `свободно ${left}`}
                  </span>
                </p>
                <div
                  data-part="track"
                  role="progressbar"
                  aria-valuenow={group.enrolled}
                  aria-valuemin={0}
                  aria-valuemax={group.capacity}
                  aria-label={`Набор в группу «${group.name}»`}
                >
                  <span
                    data-part="fill"
                    style={{
                      width: `${Math.round((group.enrolled / group.capacity) * 100)}%`,
                    }}
                  />
                </div>

                <p data-part="next">
                  Ближайшее занятие — <b>{group.nextLesson}</b>
                </p>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}

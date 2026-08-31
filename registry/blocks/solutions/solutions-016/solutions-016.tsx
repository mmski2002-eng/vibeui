import type { CSSProperties } from "react"

export type Solutions016Shift = "morning" | "evening" | "night" | "off" | "sick"

export type Solutions016Person = {
  name: string
  role: string
  week: Solutions016Shift[]
  hours: number
}

export type Solutions016Props = {
  title?: string
  week?: string
  days?: string[]
  people?: Solutions016Person[]
  normHours?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: график смен на неделю. Матрица «человек × день» показывает
// пересменки и дыры в покрытии сразу, чего список смен по дням не даёт.
// Смена подписана буквой и временем, а не только цветом: ночная и вечерняя
// различаются на печати и при дальтонизме. Первая колонка липкая, а таблица
// прокручивается — сжимать семь дней в ширину телефона значит потерять время
// смены. Внизу строка покрытия: сколько человек выходит в каждый день, потому
// что дыру в четверге по клеткам глазами не сосчитать.
const STYLES = `
:where([data-vibeui-block="solutions-016"]){
--vibeui-solutions-016-bg:oklch(1 0 0);
--vibeui-solutions-016-panel:oklch(0.975 0.004 280);
--vibeui-solutions-016-fg:oklch(0.21 0.014 280);
--vibeui-solutions-016-muted:oklch(0.54 0.014 280);
--vibeui-solutions-016-border:oklch(0.9 0.006 280);
--vibeui-solutions-016-morning:oklch(0.62 0.14 200);
--vibeui-solutions-016-evening:oklch(0.62 0.15 300);
--vibeui-solutions-016-night:oklch(0.42 0.1 275);
--vibeui-solutions-016-sick:oklch(0.62 0.17 35);
--vibeui-solutions-016-accent:oklch(0.5 0.17 280);
--vibeui-solutions-016-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-016"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-016-bg);
border:1px solid var(--vibeui-solutions-016-border);border-radius:1rem;
font-family:var(--vibeui-solutions-016-sans);color:var(--vibeui-solutions-016-fg);
}
[data-vibeui-block="solutions-016"] *{box-sizing:border-box}
[data-vibeui-block="solutions-016"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.625rem;
}
[data-vibeui-block="solutions-016"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-016"] [data-part="week"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-016-muted)}
[data-vibeui-block="solutions-016"] [data-part="legend"]{
display:flex;flex-wrap:wrap;gap:0.25rem 0.75rem;margin:0;padding:0 1rem 0.625rem;
font-size:0.6875rem;color:var(--vibeui-solutions-016-muted);
}
[data-vibeui-block="solutions-016"] [data-part="legend"] span{display:inline-flex;align-items:center;gap:0.3125rem}
[data-vibeui-block="solutions-016"] [data-part="chip"]{
width:0.875rem;height:0.875rem;border-radius:0.25rem;display:grid;place-items:center;
font-size:0.5rem;font-weight:700;color:oklch(1 0 0);line-height:1;
}
[data-vibeui-block="solutions-016"] [data-shift="morning"]{background:var(--vibeui-solutions-016-morning)}
[data-vibeui-block="solutions-016"] [data-shift="evening"]{background:var(--vibeui-solutions-016-evening)}
[data-vibeui-block="solutions-016"] [data-shift="night"]{background:var(--vibeui-solutions-016-night)}
[data-vibeui-block="solutions-016"] [data-shift="sick"]{background:var(--vibeui-solutions-016-sick)}
[data-vibeui-block="solutions-016"] [data-part="scroll"]{overflow-x:auto;scrollbar-width:thin}
[data-vibeui-block="solutions-016"] table{
width:100%;min-width:44rem;border-collapse:separate;border-spacing:0;font-size:0.75rem;
}
[data-vibeui-block="solutions-016"] th,
[data-vibeui-block="solutions-016"] td{
padding:0.375rem 0.3125rem;text-align:center;border-top:1px solid var(--vibeui-solutions-016-border);
}
/* Липкая первая колонка: без неё при прокрутке непонятно, чья это строка. */
[data-vibeui-block="solutions-016"] [data-part="who"]{
position:sticky;left:0;z-index:1;text-align:left;min-width:11rem;padding-left:1rem;
background:var(--vibeui-solutions-016-bg);
}
[data-vibeui-block="solutions-016"] thead [data-part="who"]{background:var(--vibeui-solutions-016-panel)}
[data-vibeui-block="solutions-016"] thead th{
font-size:0.625rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-016-muted);background:var(--vibeui-solutions-016-panel);border-top:0;
}
[data-vibeui-block="solutions-016"] [data-part="name"]{display:block;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="solutions-016"] [data-part="role"]{
display:block;font-size:0.6875rem;font-weight:400;color:var(--vibeui-solutions-016-muted);
}
/* Смена подписана буквой и временем, а не только цветом. */
[data-vibeui-block="solutions-016"] [data-part="cell"]{
display:block;padding:0.25rem 0.125rem;border-radius:0.4375rem;
font-size:0.6875rem;font-weight:650;line-height:1.25;color:oklch(1 0 0);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-016"] [data-cell="morning"]{background:var(--vibeui-solutions-016-morning)}
[data-vibeui-block="solutions-016"] [data-cell="evening"]{background:var(--vibeui-solutions-016-evening)}
[data-vibeui-block="solutions-016"] [data-cell="night"]{background:var(--vibeui-solutions-016-night)}
[data-vibeui-block="solutions-016"] [data-cell="sick"]{
background:var(--vibeui-solutions-016-sick);
background-image:repeating-linear-gradient(45deg,oklch(1 0 0 / 25%) 0 3px,transparent 3px 6px);
}
[data-vibeui-block="solutions-016"] [data-cell="off"]{
background:var(--vibeui-solutions-016-panel);color:var(--vibeui-solutions-016-muted);font-weight:500;
}
[data-vibeui-block="solutions-016"] [data-part="hours"]{
font-weight:700;font-variant-numeric:tabular-nums;text-align:right;padding-right:1rem;
}
[data-vibeui-block="solutions-016"] [data-under="true"]{color:var(--vibeui-solutions-016-sick)}
/* Строка покрытия: дыру в четверге по клеткам глазами не сосчитать. */
[data-vibeui-block="solutions-016"] tfoot td{
background:var(--vibeui-solutions-016-panel);font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-016"] tfoot [data-part="who"]{
background:var(--vibeui-solutions-016-panel);font-size:0.6875rem;color:var(--vibeui-solutions-016-muted);
text-transform:uppercase;letter-spacing:0.04em;
}
[data-vibeui-block="solutions-016"] [data-thin="true"]{color:var(--vibeui-solutions-016-sick)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_DAYS = [
  "Пн 11",
  "Вт 12",
  "Ср 13",
  "Чт 14",
  "Пт 15",
  "Сб 16",
  "Вс 17",
]

const DEFAULT_PEOPLE: Solutions016Person[] = [
  {
    name: "Анна Гаврилова",
    role: "старший смены",
    week: ["morning", "morning", "off", "evening", "evening", "off", "off"],
    hours: 32,
  },
  {
    name: "Сергей Тарасов",
    role: "оператор",
    week: ["evening", "evening", "evening", "off", "off", "morning", "morning"],
    hours: 40,
  },
  {
    name: "Дина Соколова",
    role: "оператор",
    week: ["night", "night", "off", "off", "night", "night", "off"],
    hours: 44,
  },
  {
    name: "Игорь Панин",
    role: "приёмка",
    week: ["off", "morning", "morning", "sick", "sick", "off", "evening"],
    hours: 24,
  },
  {
    name: "Мария Лунёва",
    role: "стажёр",
    week: ["off", "off", "morning", "off", "morning", "morning", "off"],
    hours: 18,
  },
]

const SHIFT_LABEL = {
  morning: { letter: "У", time: "07–15" },
  evening: { letter: "В", time: "15–23" },
  night: { letter: "Н", time: "23–07" },
  off: { letter: "—", time: "выходной" },
  sick: { letter: "Б", time: "больничный" },
} as const

/**
 * График смен на неделю: матрица «человек × день» и строка покрытия внизу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions016({
  title = "График смен",
  week = "11–17 марта · участок упаковки",
  days = DEFAULT_DAYS,
  people = DEFAULT_PEOPLE,
  normHours = 40,
  accent,
  className,
  style,
}: Solutions016Props) {
  const coverage = days.map(
    (_, index) =>
      people.filter(
        (person) =>
          person.week[index] !== "off" && person.week[index] !== "sick",
      ).length,
  )

  const palette = {
    ...(accent ? { "--vibeui-solutions-016-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-016" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-016"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="week">{week}</p>
          </div>
          <p data-part="week">Норма недели — {normHours} ч</p>
        </header>

        <p data-part="legend">
          <span>
            <span data-part="chip" data-shift="morning" aria-hidden="true">
              У
            </span>
            утро 07–15
          </span>
          <span>
            <span data-part="chip" data-shift="evening" aria-hidden="true">
              В
            </span>
            вечер 15–23
          </span>
          <span>
            <span data-part="chip" data-shift="night" aria-hidden="true">
              Н
            </span>
            ночь 23–07
          </span>
          <span>
            <span data-part="chip" data-shift="sick" aria-hidden="true">
              Б
            </span>
            больничный
          </span>
        </p>

        <div data-part="scroll">
          <table>
            <thead>
              <tr>
                <th scope="col" data-part="who">
                  Сотрудник
                </th>
                {days.map((day) => (
                  <th scope="col" key={day}>
                    {day}
                  </th>
                ))}
                <th scope="col" data-part="hours">
                  Часы
                </th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr key={person.name}>
                  <th scope="row" data-part="who">
                    <span data-part="name">{person.name}</span>
                    <span data-part="role">{person.role}</span>
                  </th>
                  {person.week.map((shift, index) => (
                    <td key={days[index]}>
                      <span data-part="cell" data-cell={shift}>
                        {SHIFT_LABEL[shift].letter}
                        <br />
                        {SHIFT_LABEL[shift].time}
                      </span>
                    </td>
                  ))}
                  <td
                    data-part="hours"
                    data-under={person.hours < normHours ? "true" : "false"}
                  >
                    {person.hours} ч
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" data-part="who">
                  На смене
                </th>
                {coverage.map((count, index) => (
                  <td
                    key={days[index]}
                    data-thin={count < 2 ? "true" : "false"}
                  >
                    {count}
                  </td>
                ))}
                <td data-part="hours">
                  {people.reduce((sum, person) => sum + person.hours, 0)} ч
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </>
  )
}

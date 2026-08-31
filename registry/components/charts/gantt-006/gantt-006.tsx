import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Gantt006Task = {
  title: string
  /** Смещение начала в днях от начала плана. */
  start: number
  days: number
  tone?: "work" | "risk" | "done"
}

export type Gantt006Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "title"
> & {
  heading?: string
  startDate?: string
  tasks?: Gantt006Task[]
  unit?: "week" | "day"
  accent?: string
}

// Идея компонента: квартальный план в днях не читается — сорок узких колонок
// превращаются в шум. Данные остаются дневными, а сетка сжимается до недель:
// колонка — неделя, полоса округляется наружу до целых недель. Округление
// названо словами в подписи и продублировано точными датами в таблице:
// сжатый вид обязан признаваться, что он сжатый.
const STYLES = `
:where([data-vibeui-block="gantt-006"]){
--vibeui-gantt-006-bg:oklch(1 0 0);
--vibeui-gantt-006-fg:oklch(0.23 0.014 265);
--vibeui-gantt-006-muted:oklch(0.6 0.014 265);
--vibeui-gantt-006-border:oklch(0.91 0.006 265);
--vibeui-gantt-006-line:oklch(0.955 0.004 265);
--vibeui-gantt-006-accent:oklch(0.55 0.14 200);
--vibeui-gantt-006-risk:oklch(0.62 0.16 45);
--vibeui-gantt-006-done:oklch(0.6 0.12 165);
--vibeui-gantt-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="gantt-006"]{
width:100%;box-sizing:border-box;padding:1rem;
background:var(--vibeui-gantt-006-bg);
border:1px solid var(--vibeui-gantt-006-border);border-radius:1rem;
color:var(--vibeui-gantt-006-fg);font-family:var(--vibeui-gantt-006-font);
}
[data-vibeui-block="gantt-006"] *{box-sizing:border-box}
[data-vibeui-block="gantt-006"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;
gap:0.5rem;margin:0 0 0.625rem;
}
[data-vibeui-block="gantt-006"] [data-part="heading"]{
margin:0;font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="gantt-006"] [data-part="hint"]{
margin:0;font-size:0.75rem;color:var(--vibeui-gantt-006-muted);
}
[data-vibeui-block="gantt-006"] [data-part="scroll"]{
overflow-x:auto;border:1px solid var(--vibeui-gantt-006-line);border-radius:0.5rem;
}
[data-vibeui-block="gantt-006"] [data-part="scroll"]:focus-visible{
outline:2px solid var(--vibeui-gantt-006-accent);outline-offset:2px;
}
/* Сжатый вид: строка ростом в одну строку текста, колонка — период. */
[data-vibeui-block="gantt-006"] [data-part="grid"]{
display:grid;
grid-template-columns:8.5rem repeat(var(--vibeui-gantt-006-cols,8),var(--vibeui-gantt-006-col,3rem));
}
[data-vibeui-block="gantt-006"] [data-part="corner"]{
position:sticky;left:0;z-index:3;background:var(--vibeui-gantt-006-bg);
border-right:1px solid var(--vibeui-gantt-006-border);
border-bottom:1px solid var(--vibeui-gantt-006-border);
}
[data-vibeui-block="gantt-006"] [data-part="cap"]{
padding:0.25rem 0.125rem;text-align:center;
border-left:1px solid var(--vibeui-gantt-006-line);
border-bottom:1px solid var(--vibeui-gantt-006-border);
font-size:0.5625rem;line-height:1.2;color:var(--vibeui-gantt-006-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="gantt-006"] [data-part="cap"] b{
display:block;font-size:0.625rem;font-weight:700;
color:var(--vibeui-gantt-006-fg);
}
[data-vibeui-block="gantt-006"] [data-part="name"]{
position:sticky;left:0;z-index:1;
display:flex;align-items:center;
height:1.625rem;padding:0 0.5rem;
background:var(--vibeui-gantt-006-bg);
border-right:1px solid var(--vibeui-gantt-006-border);
border-top:1px solid var(--vibeui-gantt-006-line);
font-size:0.6875rem;font-weight:600;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="gantt-006"] [data-part="cell"]{
border-top:1px solid var(--vibeui-gantt-006-line);
border-left:1px solid var(--vibeui-gantt-006-line);
}
[data-vibeui-block="gantt-006"] [data-part="bar"]{
align-self:center;z-index:1;margin:0 0.125rem;
display:flex;align-items:center;justify-content:center;
height:0.875rem;border-radius:0.25rem;
background:var(--vibeui-gantt-006-accent);
color:var(--vibeui-gantt-006-bg);
font-size:0.5rem;font-weight:700;line-height:1;
white-space:nowrap;overflow:hidden;
}
[data-vibeui-block="gantt-006"] [data-tone="risk"]{
background:repeating-linear-gradient(135deg,
var(--vibeui-gantt-006-risk) 0 4px,
color-mix(in oklab,var(--vibeui-gantt-006-risk) 60%,var(--vibeui-gantt-006-bg)) 4px 8px);
}
[data-vibeui-block="gantt-006"] [data-tone="done"]{background:var(--vibeui-gantt-006-done)}
[data-vibeui-block="gantt-006"] [data-part="legend"]{
display:flex;flex-wrap:wrap;gap:0.75rem;margin:0.625rem 0 0;padding:0;
list-style:none;font-size:0.625rem;color:var(--vibeui-gantt-006-muted);
}
[data-vibeui-block="gantt-006"] [data-part="legend"] li{
display:inline-flex;align-items:center;gap:0.375rem;
}
[data-vibeui-block="gantt-006"] [data-part="legend"] i{
width:1rem;height:0.5rem;border-radius:0.1875rem;
background:var(--vibeui-gantt-006-accent);
}
[data-vibeui-block="gantt-006"] [data-part="legend"] i[data-tone="risk"]{
background:repeating-linear-gradient(135deg,
var(--vibeui-gantt-006-risk) 0 4px,
color-mix(in oklab,var(--vibeui-gantt-006-risk) 60%,var(--vibeui-gantt-006-bg)) 4px 8px);
}
[data-vibeui-block="gantt-006"] [data-part="legend"] i[data-tone="done"]{
background:var(--vibeui-gantt-006-done);
}
[data-vibeui-block="gantt-006"] [data-part="table"]{margin:0.625rem 0 0}
[data-vibeui-block="gantt-006"] summary{
cursor:pointer;font-size:0.75rem;font-weight:600;color:var(--vibeui-gantt-006-accent);
}
[data-vibeui-block="gantt-006"] summary:focus-visible{
outline:2px solid var(--vibeui-gantt-006-accent);outline-offset:2px;border-radius:0.25rem;
}
[data-vibeui-block="gantt-006"] table{
width:100%;margin-top:0.5rem;border-collapse:collapse;font-size:0.6875rem;
}
[data-vibeui-block="gantt-006"] th,
[data-vibeui-block="gantt-006"] td{
padding:0.25rem 0.375rem;text-align:left;
border-bottom:1px solid var(--vibeui-gantt-006-line);
}
[data-vibeui-block="gantt-006"] thead th{color:var(--vibeui-gantt-006-muted);font-weight:600}
[data-vibeui-block="gantt-006"] td{font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="gantt-006"] *{animation:none!important;transition:none!important}}
`

const DAY = 86400000

const DEFAULT_TASKS: Gantt006Task[] = [
  { title: "Исследование", start: 0, days: 9, tone: "done" },
  { title: "Прототип", start: 6, days: 12, tone: "done" },
  { title: "Схема данных", start: 12, days: 10 },
  { title: "Каталог", start: 16, days: 15 },
  { title: "Страницы блоков", start: 24, days: 13 },
  { title: "Экспорт для агента", start: 30, days: 11, tone: "risk" },
  { title: "Нагрузочные тесты", start: 38, days: 8, tone: "risk" },
  { title: "Документация", start: 42, days: 12 },
  { title: "Релиз", start: 52, days: 4 },
]

/**
 * Сжатый план: данные дневные, сетка недельная. Полоса округляется наружу
 * до целых недель, точные даты остаются в таблице. Ноль зависимостей.
 */
export function Gantt006({
  heading = "Квартал по неделям",
  startDate = "2026-01-05",
  tasks = DEFAULT_TASKS,
  unit = "week",
  accent,
  className,
  style,
  ...props
}: Gantt006Props) {
  const origin = new Date(`${startDate}T00:00:00Z`).getTime()
  const size = unit === "week" ? 7 : 1
  const span = Math.max(...tasks.map((task) => task.start + task.days))
  const columns = Math.ceil(span / size)

  const caps = Array.from({ length: columns }, (_, index) => {
    const date = new Date(origin + index * size * DAY)

    return {
      key: date.toISOString().slice(0, 10),
      top: unit === "week" ? `н${index + 1}` : String(date.getUTCDate()),
      bottom: `${date.getUTCDate()}.${String(date.getUTCMonth() + 1).padStart(2, "0")}`,
    }
  })

  const dateText = (offset: number) =>
    new Date(origin + offset * DAY).toISOString().slice(0, 10)

  const palette = {
    "--vibeui-gantt-006-cols": columns,
    "--vibeui-gantt-006-col": unit === "week" ? "3rem" : "1.75rem",
    ...(accent ? { "--vibeui-gantt-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-gantt-006" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="gantt-006"
        aria-label={heading}
        className={className}
        style={palette}
      >
        <header data-part="head">
          <h3 data-part="heading">{heading}</h3>
          <p data-part="hint">
            {unit === "week"
              ? "полоса округлена наружу до целых недель"
              : "колонка — один день"}
          </p>
        </header>

        <div
          data-part="scroll"
          tabIndex={0}
          role="group"
          aria-label={`${heading}: диаграмма, прокручивается вбок`}
        >
          <div data-part="grid">
            <span data-part="corner" />
            {caps.map((cap) => (
              <span key={cap.key} data-part="cap">
                <b>{cap.top}</b>
                {cap.bottom}
              </span>
            ))}

            {tasks.map((task, row) => (
              <span
                key={task.title}
                data-part="name"
                title={task.title}
                style={{ gridRow: row + 2, gridColumn: 1 } as CSSProperties}
              >
                {task.title}
              </span>
            ))}

            {tasks.map((task, row) =>
              caps.map((cap, column) => (
                <span
                  key={`${task.title}-${cap.key}`}
                  data-part="cell"
                  style={
                    {
                      gridRow: row + 2,
                      gridColumn: column + 2,
                    } as CSSProperties
                  }
                />
              )),
            )}

            {tasks.map((task, row) => {
              const from = Math.floor(task.start / size)
              const to = Math.ceil((task.start + task.days) / size)

              return (
                <span
                  key={`${task.title}-bar`}
                  data-part="bar"
                  data-tone={task.tone ?? "work"}
                  role="img"
                  aria-label={`${task.title}: ${dateText(task.start)} — ${dateText(task.start + task.days - 1)}`}
                  style={
                    {
                      gridRow: row + 2,
                      gridColumn: `${from + 2} / ${to + 2}`,
                    } as CSSProperties
                  }
                >
                  {task.days} дн
                </span>
              )
            })}
          </div>
        </div>

        <ul data-part="legend">
          <li>
            <i /> в работе
          </li>
          <li>
            <i data-tone="risk" /> под риском
          </li>
          <li>
            <i data-tone="done" /> сделано
          </li>
        </ul>

        <details data-part="table">
          <summary>Точные даты таблицей</summary>
          <table>
            <thead>
              <tr>
                <th scope="col">Задача</th>
                <th scope="col">Начало</th>
                <th scope="col">Конец</th>
                <th scope="col">Дней</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.title}>
                  <th scope="row">{task.title}</th>
                  <td>{dateText(task.start)}</td>
                  <td>{dateText(task.start + task.days - 1)}</td>
                  <td>{task.days}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </section>
    </>
  )
}

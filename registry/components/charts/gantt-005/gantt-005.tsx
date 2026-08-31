import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Gantt005Task = {
  title: string
  owner: string
  /** Смещение начала в неделях от начала плана, 1 — первая колонка. */
  start: number
  weeks: number
  tone?: "work" | "risk" | "done"
}

export type Gantt005Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "title"
> & {
  heading?: string
  weeks?: string[]
  tasks?: Gantt005Task[]
  accent?: string
}

// Идея компонента: план по исполнителям отвечает на другой вопрос, чем план
// по задачам, — «кто перегружен» вместо «когда закончим». Поэтому строки
// сгруппированы, а заголовок группы несёт сводку: сколько задач и сколько
// недель работы. Пересечения внутри одной группы подписаны словом: две
// полосы на соседних строках одного человека — это два дела одновременно.
const STYLES = `
:where([data-vibeui-block="gantt-005"]){
--vibeui-gantt-005-bg:oklch(1 0 0);
--vibeui-gantt-005-fg:oklch(0.23 0.014 265);
--vibeui-gantt-005-muted:oklch(0.6 0.014 265);
--vibeui-gantt-005-border:oklch(0.91 0.006 265);
--vibeui-gantt-005-line:oklch(0.955 0.004 265);
--vibeui-gantt-005-group:oklch(0.97 0.004 265);
--vibeui-gantt-005-accent:oklch(0.54 0.15 285);
--vibeui-gantt-005-risk:oklch(0.62 0.16 45);
--vibeui-gantt-005-done:oklch(0.6 0.12 165);
--vibeui-gantt-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="gantt-005"]{
width:100%;box-sizing:border-box;padding:1rem;
background:var(--vibeui-gantt-005-bg);
border:1px solid var(--vibeui-gantt-005-border);border-radius:1rem;
color:var(--vibeui-gantt-005-fg);font-family:var(--vibeui-gantt-005-font);
}
[data-vibeui-block="gantt-005"] *{box-sizing:border-box}
[data-vibeui-block="gantt-005"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;
gap:0.5rem;margin:0 0 0.75rem;
}
[data-vibeui-block="gantt-005"] [data-part="heading"]{
margin:0;font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="gantt-005"] [data-part="hint"]{
margin:0;font-size:0.75rem;color:var(--vibeui-gantt-005-muted);
}
[data-vibeui-block="gantt-005"] [data-part="scroll"]{
overflow-x:auto;border:1px solid var(--vibeui-gantt-005-line);border-radius:0.625rem;
}
[data-vibeui-block="gantt-005"] [data-part="scroll"]:focus-visible{
outline:2px solid var(--vibeui-gantt-005-accent);outline-offset:2px;
}
[data-vibeui-block="gantt-005"] [data-part="grid"]{
display:grid;min-width:34rem;
grid-template-columns:10.5rem repeat(var(--vibeui-gantt-005-weeks,10),minmax(2.5rem,1fr));
}
[data-vibeui-block="gantt-005"] [data-part="corner"]{
position:sticky;left:0;z-index:3;background:var(--vibeui-gantt-005-bg);
border-right:1px solid var(--vibeui-gantt-005-border);
border-bottom:1px solid var(--vibeui-gantt-005-border);
}
[data-vibeui-block="gantt-005"] [data-part="cap"]{
padding:0.375rem 0.25rem;text-align:center;
border-left:1px solid var(--vibeui-gantt-005-line);
border-bottom:1px solid var(--vibeui-gantt-005-border);
font-size:0.625rem;color:var(--vibeui-gantt-005-muted);
}
/* Заголовок группы занимает всю ширину сетки: он про человека, а не про дату. */
[data-vibeui-block="gantt-005"] [data-part="group"]{
grid-column:1 / -1;position:sticky;left:0;z-index:2;
display:flex;align-items:center;gap:0.5rem;
padding:0.3125rem 0.625rem;
background:var(--vibeui-gantt-005-group);
border-top:1px solid var(--vibeui-gantt-005-border);
font-size:0.75rem;font-weight:700;
}
[data-vibeui-block="gantt-005"] [data-part="badge"]{
flex:none;display:grid;place-items:center;
width:1.375rem;height:1.375rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-gantt-005-accent) 20%,var(--vibeui-gantt-005-bg));
color:var(--vibeui-gantt-005-accent);
font-size:0.5625rem;font-weight:700;letter-spacing:0.02em;
}
[data-vibeui-block="gantt-005"] [data-part="load"]{
margin-left:auto;font-size:0.625rem;font-weight:500;
color:var(--vibeui-gantt-005-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="gantt-005"] [data-part="load"][data-heavy="true"]{
color:var(--vibeui-gantt-005-risk);font-weight:700;
}
[data-vibeui-block="gantt-005"] [data-part="name"]{
position:sticky;left:0;z-index:1;
display:flex;align-items:center;min-height:2rem;
padding:0.25rem 0.625rem 0.25rem 1.5rem;
background:var(--vibeui-gantt-005-bg);
border-right:1px solid var(--vibeui-gantt-005-border);
border-top:1px solid var(--vibeui-gantt-005-line);
font-size:0.75rem;
}
[data-vibeui-block="gantt-005"] [data-part="cell"]{
border-top:1px solid var(--vibeui-gantt-005-line);
border-left:1px solid var(--vibeui-gantt-005-line);
}
[data-vibeui-block="gantt-005"] [data-part="bar"]{
align-self:center;z-index:1;margin:0 0.1875rem;
display:flex;align-items:center;height:1.125rem;padding:0 0.4375rem;
border-radius:9999px;
border:1px solid var(--vibeui-gantt-005-accent);
background:color-mix(in oklab,var(--vibeui-gantt-005-accent) 18%,var(--vibeui-gantt-005-bg));
font-size:0.5625rem;line-height:1;white-space:nowrap;overflow:hidden;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="gantt-005"] [data-tone="risk"]{
border-color:var(--vibeui-gantt-005-risk);border-style:dashed;
background:color-mix(in oklab,var(--vibeui-gantt-005-risk) 16%,var(--vibeui-gantt-005-bg));
}
[data-vibeui-block="gantt-005"] [data-tone="done"]{
border-color:var(--vibeui-gantt-005-done);
background:color-mix(in oklab,var(--vibeui-gantt-005-done) 18%,var(--vibeui-gantt-005-bg));
}
[data-vibeui-block="gantt-005"] [data-part="table"]{margin:0.75rem 0 0}
[data-vibeui-block="gantt-005"] summary{
cursor:pointer;font-size:0.75rem;font-weight:600;color:var(--vibeui-gantt-005-accent);
}
[data-vibeui-block="gantt-005"] summary:focus-visible{
outline:2px solid var(--vibeui-gantt-005-accent);outline-offset:2px;border-radius:0.25rem;
}
[data-vibeui-block="gantt-005"] table{
width:100%;margin-top:0.5rem;border-collapse:collapse;font-size:0.6875rem;
}
[data-vibeui-block="gantt-005"] th,
[data-vibeui-block="gantt-005"] td{
padding:0.25rem 0.375rem;text-align:left;
border-bottom:1px solid var(--vibeui-gantt-005-line);
}
[data-vibeui-block="gantt-005"] thead th{color:var(--vibeui-gantt-005-muted);font-weight:600}
[data-vibeui-block="gantt-005"] td{font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="gantt-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_WEEKS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"]

const DEFAULT_TASKS: Gantt005Task[] = [
  {
    title: "Каркас каталога",
    owner: "Аня Ким",
    start: 1,
    weeks: 2,
    tone: "done",
  },
  { title: "Фильтры", owner: "Аня Ким", start: 3, weeks: 2 },
  { title: "Схема данных", owner: "Илья Ро", start: 1, weeks: 3, tone: "done" },
  { title: "Импорт из registry", owner: "Илья Ро", start: 3, weeks: 3 },
  {
    title: "Экспорт для агента",
    owner: "Илья Ро",
    start: 5,
    weeks: 2,
    tone: "risk",
  },
  { title: "Страница блока", owner: "Вера Ной", start: 2, weeks: 3 },
  { title: "Мобильная вёрстка", owner: "Вера Ной", start: 6, weeks: 2 },
  { title: "Тесты сборки", owner: "Пётр Гай", start: 4, weeks: 4 },
]

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

/**
 * План, сгруппированный по исполнителям: у каждой группы свой заголовок
 * со сводкой загрузки. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Gantt005({
  heading = "План по исполнителям",
  weeks = DEFAULT_WEEKS,
  tasks = DEFAULT_TASKS,
  accent,
  className,
  style,
  ...props
}: Gantt005Props) {
  const owners = [...new Set(tasks.map((task) => task.owner))]

  const rows: (
    | { kind: "group"; owner: string; count: number; load: number }
    | { kind: "task"; task: Gantt005Task }
  )[] = owners.flatMap((owner) => {
    const own = tasks.filter((task) => task.owner === owner)

    return [
      {
        kind: "group" as const,
        owner,
        count: own.length,
        load: own.reduce((sum, task) => sum + task.weeks, 0),
      },
      ...own.map((task) => ({ kind: "task" as const, task })),
    ]
  })

  const palette = {
    "--vibeui-gantt-005-weeks": weeks.length,
    ...(accent ? { "--vibeui-gantt-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-gantt-005" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="gantt-005"
        aria-label={heading}
        className={className}
        style={palette}
      >
        <header data-part="head">
          <h3 data-part="heading">{heading}</h3>
          <p data-part="hint">
            {owners.length} человека, {tasks.length} задач
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
            {weeks.map((week) => (
              <span key={week} data-part="cap">
                {week}
              </span>
            ))}

            {rows.map((row, index) =>
              row.kind === "group" ? (
                <h4
                  key={row.owner}
                  data-part="group"
                  style={{ gridRow: index + 2 } as CSSProperties}
                >
                  <span data-part="badge" aria-hidden="true">
                    {initials(row.owner)}
                  </span>
                  {row.owner}
                  <span data-part="load" data-heavy={String(row.load > 6)}>
                    {row.count} задач · {row.load} недель
                  </span>
                </h4>
              ) : (
                <span
                  key={row.task.title}
                  data-part="name"
                  style={{ gridRow: index + 2, gridColumn: 1 } as CSSProperties}
                >
                  {row.task.title}
                </span>
              ),
            )}

            {rows.map((row, index) =>
              row.kind === "task"
                ? weeks.map((week, column) => (
                    <span
                      key={`${row.task.title}-${week}`}
                      data-part="cell"
                      style={
                        {
                          gridRow: index + 2,
                          gridColumn: column + 2,
                        } as CSSProperties
                      }
                    />
                  ))
                : [],
            )}

            {rows.map((row, index) =>
              row.kind === "task" ? (
                <span
                  key={`${row.task.title}-bar`}
                  data-part="bar"
                  data-tone={row.task.tone ?? "work"}
                  style={
                    {
                      gridRow: index + 2,
                      gridColumn: `${row.task.start + 1} / ${row.task.start + row.task.weeks + 1}`,
                    } as CSSProperties
                  }
                >
                  {weeks[row.task.start - 1]}–
                  {weeks[row.task.start + row.task.weeks - 2]}
                </span>
              ) : null,
            )}
          </div>
        </div>

        <details data-part="table">
          <summary>Те же сроки таблицей</summary>
          <table>
            <thead>
              <tr>
                <th scope="col">Исполнитель</th>
                <th scope="col">Задача</th>
                <th scope="col">Начало</th>
                <th scope="col">Конец</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.title}>
                  <th scope="row">{task.owner}</th>
                  <td>{task.title}</td>
                  <td>{weeks[task.start - 1]}</td>
                  <td>{weeks[task.start + task.weeks - 2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </section>
    </>
  )
}

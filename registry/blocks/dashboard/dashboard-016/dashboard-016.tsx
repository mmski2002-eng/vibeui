import type { CSSProperties } from "react"

export type Dashboard016Task = {
  title: string
  tag?: string
  assignee?: string
  due?: string
  priority?: "low" | "normal" | "high"
}

export type Dashboard016Column = {
  title: string
  hint?: string
  tasks: Dashboard016Task[]
}

export type Dashboard016Props = {
  title?: string
  filterLabel?: string
  filters?: string[]
  activeFilter?: string
  columns?: Dashboard016Column[]
  addLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: доска задач, которая не разваливается в узкой колонке.
// Колонки лежат в горизонтальной прокрутке с scroll-snap, а не сжимаются:
// карточка задачи ниже определённой ширины перестаёт читаться, и лучше
// прокрутить, чем показать столбик из переносов. Приоритет помечен полосой
// слева и словом, а счётчик задач стоит в заголовке колонки, чтобы
// переполнение было видно до прокрутки.
const STYLES = `
:where([data-vibeui-block="dashboard-016"]){
--vibeui-dashboard-016-bg:oklch(0.985 0.003 265);
--vibeui-dashboard-016-card:oklch(1 0 0);
--vibeui-dashboard-016-fg:oklch(0.22 0.014 265);
--vibeui-dashboard-016-muted:oklch(0.55 0.014 265);
--vibeui-dashboard-016-border:oklch(0.91 0.006 265);
--vibeui-dashboard-016-accent:oklch(0.55 0.2 262);
--vibeui-dashboard-016-high:oklch(0.58 0.18 25);
--vibeui-dashboard-016-normal:oklch(0.68 0.14 75);
--vibeui-dashboard-016-low:oklch(0.72 0.04 265);
--vibeui-dashboard-016-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-016"]{
box-sizing:border-box;
background:var(--vibeui-dashboard-016-bg);
color:var(--vibeui-dashboard-016-fg);
font-family:var(--vibeui-dashboard-016-sans);
border:1px solid var(--vibeui-dashboard-016-border);border-radius:1rem;
}
[data-vibeui-block="dashboard-016"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-016"] [data-part="shell"]{padding:1rem}
[data-vibeui-block="dashboard-016"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;margin-bottom:0.875rem;
}
[data-vibeui-block="dashboard-016"] h2{margin:0;font-size:1.0625rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-016"] [data-part="filter"]{
display:flex;align-items:center;gap:0.375rem;margin-left:auto;
font-size:0.75rem;color:var(--vibeui-dashboard-016-muted);
}
[data-vibeui-block="dashboard-016"] select{
appearance:none;font:inherit;font-size:0.75rem;color:inherit;
padding:0.3125rem 1.75rem 0.3125rem 0.5rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-016-border);
background:var(--vibeui-dashboard-016-card)
url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23777' stroke-width='1.6'/%3E%3C/svg%3E")
no-repeat right 0.5rem center/0.625rem;
}
[data-vibeui-block="dashboard-016"] [data-part="add"]{
appearance:none;border:0;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:650;
padding:0.4375rem 0.75rem;border-radius:0.5rem;
background:var(--vibeui-dashboard-016-accent);color:oklch(1 0 0);
}
[data-vibeui-block="dashboard-016"] [data-part="add"]:focus-visible,
[data-vibeui-block="dashboard-016"] select:focus-visible{
outline:2px solid var(--vibeui-dashboard-016-accent);outline-offset:2px;
}
/* Колонки прокручиваются, а не сжимаются: узкая карточка не читается. */
[data-vibeui-block="dashboard-016"] [data-part="board"]{
display:grid;grid-auto-flow:column;grid-auto-columns:15rem;gap:0.75rem;
overflow-x:auto;scroll-snap-type:x proximity;padding-bottom:0.375rem;
}
[data-vibeui-block="dashboard-016"] [data-part="column"]{scroll-snap-align:start;min-width:0}
[data-vibeui-block="dashboard-016"] [data-part="colhead"]{
display:flex;align-items:baseline;gap:0.375rem;padding:0 0.125rem 0.5rem;
}
[data-vibeui-block="dashboard-016"] h3{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:0.03em;text-transform:uppercase;
color:var(--vibeui-dashboard-016-muted);
}
[data-vibeui-block="dashboard-016"] [data-part="count"]{
font-size:0.6875rem;font-weight:650;font-variant-numeric:tabular-nums;
padding:0.0625rem 0.375rem;border-radius:9999px;
background:var(--vibeui-dashboard-016-card);
border:1px solid var(--vibeui-dashboard-016-border);
color:var(--vibeui-dashboard-016-muted);
}
[data-vibeui-block="dashboard-016"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="dashboard-016"] [data-part="task"]{
background:var(--vibeui-dashboard-016-card);
border:1px solid var(--vibeui-dashboard-016-border);border-radius:0.75rem;
border-left:3px solid var(--vibeui-dashboard-016-low);
padding:0.625rem 0.75rem;
}
[data-vibeui-block="dashboard-016"] [data-priority="normal"]{border-left-color:var(--vibeui-dashboard-016-normal)}
[data-vibeui-block="dashboard-016"] [data-priority="high"]{border-left-color:var(--vibeui-dashboard-016-high)}
[data-vibeui-block="dashboard-016"] [data-part="tasktitle"]{
margin:0;font-size:0.8125rem;font-weight:600;line-height:1.35;
}
[data-vibeui-block="dashboard-016"] [data-part="meta"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;margin-top:0.4375rem;
font-size:0.6875rem;color:var(--vibeui-dashboard-016-muted);
}
[data-vibeui-block="dashboard-016"] [data-part="tag"]{
padding:0.0625rem 0.375rem;border-radius:0.375rem;
background:var(--vibeui-dashboard-016-bg);
border:1px solid var(--vibeui-dashboard-016-border);
}
[data-vibeui-block="dashboard-016"] [data-part="prio"]{font-weight:650}
[data-vibeui-block="dashboard-016"] [data-priority="high"] [data-part="prio"]{color:var(--vibeui-dashboard-016-high)}
[data-vibeui-block="dashboard-016"] [data-part="empty"]{
padding:0.75rem;border:1px dashed var(--vibeui-dashboard-016-border);border-radius:0.75rem;
font-size:0.75rem;color:var(--vibeui-dashboard-016-muted);text-align:center;
}
@container (min-width: 42rem){
[data-vibeui-block="dashboard-016"] [data-part="shell"]{padding:1.25rem}
[data-vibeui-block="dashboard-016"] [data-part="board"]{grid-auto-columns:17rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS: Dashboard016Column[] = [
  {
    title: "Очередь",
    tasks: [
      {
        title: "Переписать промпт установки блока",
        tag: "registry",
        assignee: "Анна",
        due: "20 марта",
        priority: "high",
      },
      {
        title: "Проверить превью на узкой колонке",
        tag: "витрина",
        assignee: "Илья",
        priority: "normal",
      },
      {
        title: "Собрать список тегов каталога",
        tag: "каталог",
        due: "24 марта",
      },
    ],
  },
  {
    title: "В работе",
    tasks: [
      {
        title: "Блок биллинга: план и история",
        tag: "dashboard",
        assignee: "Ким",
        due: "18 марта",
        priority: "high",
      },
      {
        title: "Иконки статусов без библиотеки",
        tag: "ui",
        assignee: "Пётр",
        priority: "normal",
      },
    ],
  },
  {
    title: "На проверке",
    tasks: [
      {
        title: "Экран логов с деталями записи",
        tag: "dashboard",
        assignee: "Анна",
        priority: "normal",
      },
    ],
  },
  { title: "Готово", tasks: [] },
]

const PRIORITY_WORD = { low: "низкий", normal: "обычный", high: "срочно" }

/**
 * Доска задач: колонки в горизонтальной прокрутке, приоритет полосой и словом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard016({
  title = "Задачи спринта",
  filterLabel = "Исполнитель",
  filters = ["Все", "Анна", "Илья", "Ким", "Пётр"],
  activeFilter = "Все",
  columns = DEFAULT_COLUMNS,
  addLabel = "Новая задача",
  accent,
  className,
  style,
}: Dashboard016Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-016-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-016" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-016"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <header data-part="head">
            <h2>{title}</h2>
            <p data-part="filter">
              <label htmlFor="dashboard-016-filter">{filterLabel}</label>
              <select id="dashboard-016-filter" defaultValue={activeFilter}>
                {filters.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </p>
            <button type="button" data-part="add">
              {addLabel}
            </button>
          </header>

          <div data-part="board">
            {columns.map((column) => (
              <section
                key={column.title}
                data-part="column"
                aria-label={`${column.title}: ${column.tasks.length}`}
              >
                <header data-part="colhead">
                  <h3>{column.title}</h3>
                  <span data-part="count">{column.tasks.length}</span>
                </header>
                {column.tasks.length === 0 ? (
                  <p data-part="empty">Пусто — перетащите сюда задачу</p>
                ) : (
                  <ul>
                    {column.tasks.map((task) => (
                      <li
                        key={task.title}
                        data-part="task"
                        data-priority={task.priority ?? "low"}
                      >
                        <p data-part="tasktitle">{task.title}</p>
                        <p data-part="meta">
                          {task.tag ? (
                            <span data-part="tag">{task.tag}</span>
                          ) : null}
                          {task.assignee ? <span>{task.assignee}</span> : null}
                          {task.due ? <span>до {task.due}</span> : null}
                          <span data-part="prio">
                            {PRIORITY_WORD[task.priority ?? "low"]}
                          </span>
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

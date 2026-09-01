import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Gantt001Task = {
  title: string
  start: number
  span: number
  tone?: "plan" | "work" | "done"
  owner?: string
}

export type Gantt001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  title?: string
  weeks?: string[]
  tasks?: Gantt001Task[]
  accent?: string
}

// Идея компонента: план работ полосами по неделям. Полоса занимает колонки
// грида от начала до конца, поэтому длительность задаётся разметкой, а не
// пересчётом в проценты. Названия задач стоят в первой колонке и не уезжают
// при прокрутке вправо: план читают по строкам, а не по датам. Состояние
// различается заливкой и рамкой одновременно — на печати и при дальтонизме
// одного цвета мало. Сроки продублированы текстом внутри строки.
const STYLES = `
:where([data-vibeui-block="gantt-001"]){
--vibeui-gantt-001-bg:oklch(1 0 0);
--vibeui-gantt-001-fg:oklch(0.24 0.014 265);
--vibeui-gantt-001-muted:oklch(0.56 0.014 265);
--vibeui-gantt-001-border:oklch(0.92 0.006 265);
--vibeui-gantt-001-line:oklch(0.96 0.004 265);
--vibeui-gantt-001-accent:oklch(0.55 0.2 262);
--vibeui-gantt-001-done:oklch(0.58 0.14 152);
--vibeui-gantt-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="gantt-001"]{
width:100%;box-sizing:border-box;overflow-x:auto;
background:var(--vibeui-gantt-001-bg);
border:1px solid var(--vibeui-gantt-001-border);border-radius:0.875rem;
font-family:var(--vibeui-gantt-001-font);color:var(--vibeui-gantt-001-fg);
}
[data-vibeui-block="gantt-001"] *{box-sizing:border-box}
[data-vibeui-block="gantt-001"] h3{margin:0;padding:0.75rem 0.875rem;font-size:0.875rem;font-weight:650}
[data-vibeui-block="gantt-001"] [data-part="grid"]{
display:grid;
grid-template-columns:10rem repeat(var(--vibeui-gantt-001-weeks,6),minmax(3.5rem,1fr));
min-width:30rem;
}
[data-vibeui-block="gantt-001"] [data-part="week"]{
padding:0.375rem 0.5rem;text-align:center;
border-top:1px solid var(--vibeui-gantt-001-border);
border-bottom:1px solid var(--vibeui-gantt-001-border);
font-size:0.6875rem;color:var(--vibeui-gantt-001-muted);
}
/* Названия в первой колонке остаются на месте: план читают по строкам. */
[data-vibeui-block="gantt-001"] [data-part="name"]{
position:sticky;left:0;z-index:1;
display:flex;flex-direction:column;gap:0.0625rem;justify-content:center;
padding:0.375rem 0.625rem;
background:var(--vibeui-gantt-001-bg);
border-top:1px solid var(--vibeui-gantt-001-line);
font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="gantt-001"] [data-part="owner"]{font-size:0.625rem;font-weight:400;color:var(--vibeui-gantt-001-muted)}
[data-vibeui-block="gantt-001"] [data-part="cell"]{
border-top:1px solid var(--vibeui-gantt-001-line);
border-left:1px solid var(--vibeui-gantt-001-line);
min-height:2.25rem;
}
/* Полоса занимает колонки грида: длительность задаётся разметкой, не процентом. */
[data-vibeui-block="gantt-001"] [data-part="bar"]{
align-self:center;margin:0.25rem;padding:0.1875rem 0.5rem;
border-radius:9999px;
background:oklch(0.55 0.2 262 / 14%);
border:1px solid var(--vibeui-gantt-001-accent);
color:var(--vibeui-gantt-001-fg);
font-size:0.625rem;line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="gantt-001"] [data-tone="plan"]{
background:oklch(0.55 0.02 265 / 8%);border-style:dashed;border-color:var(--vibeui-gantt-001-muted);
}
[data-vibeui-block="gantt-001"] [data-tone="done"]{
background:oklch(0.58 0.14 152 / 16%);border-color:var(--vibeui-gantt-001-done);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="gantt-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_WEEKS = ["1 нед", "2 нед", "3 нед", "4 нед", "5 нед", "6 нед"]

const DEFAULT_TASKS: Gantt001Task[] = [
  {
    title: "Спецификация категорий",
    start: 1,
    span: 1,
    tone: "done",
    owner: "Анна",
  },
  { title: "Компоненты форм", start: 1, span: 3, tone: "done", owner: "Илья" },
  { title: "Блоки витрины", start: 3, span: 2, tone: "work", owner: "Ким" },
  { title: "Таблицы данных", start: 4, span: 2, tone: "work", owner: "Пётр" },
  {
    title: "Шаблоны страниц",
    start: 5,
    span: 2,
    tone: "plan",
    owner: "не назначен",
  },
]

/**
 * План работ полосами по неделям: длительность задаётся колонками грида.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Gantt001({
  title = "План работ",
  weeks = DEFAULT_WEEKS,
  tasks = DEFAULT_TASKS,
  accent,
  className,
  style,
  ...props
}: Gantt001Props) {
  const palette = {
    "--vibeui-gantt-001-weeks": weeks.length,
    ...(accent ? { "--vibeui-gantt-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-gantt-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="gantt-001"
        role="group"
        aria-label={title}
        className={className}
        style={palette}
      >
        <h3>{title}</h3>
        <div data-part="grid">
          <span data-part="week" />
          {weeks.map((week) => (
            <span key={week} data-part="week">
              {week}
            </span>
          ))}

          {tasks.map((task, row) => (
            <span
              key={task.title}
              data-part="name"
              style={{ gridRow: row + 2, gridColumn: 1 } as CSSProperties}
            >
              {task.title}
              {task.owner ? <span data-part="owner">{task.owner}</span> : null}
            </span>
          ))}

          {tasks.map((task, row) =>
            weeks.map((week, column) => (
              <span
                key={`${task.title}-${week}`}
                data-part="cell"
                style={
                  { gridRow: row + 2, gridColumn: column + 2 } as CSSProperties
                }
              />
            )),
          )}

          {tasks.map((task, row) => (
            <span
              key={`${task.title}-bar`}
              data-part="bar"
              data-tone={task.tone ?? "work"}
              style={
                {
                  gridRow: row + 2,
                  gridColumn: `${task.start + 1} / ${task.start + task.span + 1}`,
                } as CSSProperties
              }
            >
              {weeks[task.start - 1]} — {weeks[task.start + task.span - 2]}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}

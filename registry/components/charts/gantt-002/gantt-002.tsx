import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Gantt002Task = {
  id: string
  title: string
  /** Смещение начала в днях от начала плана. */
  start: number
  /** Длительность в днях. */
  days: number
  /** id задачи, после которой эта начинается. */
  after?: string
  tone?: "work" | "risk" | "done"
}

export type Gantt002Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "title"
> & {
  heading?: string
  startDate?: string
  tasks?: Gantt002Task[]
  accent?: string
}

// Идея компонента: план без связей врёт — из него не видно, почему задача
// не может начаться раньше. Связи рисуются одним SVG-слоем поверх полос:
// координаты считаются из тех же чисел, что и полосы, поэтому стрелка не
// уезжает от прямоугольника. Ширина дня и высота строки заданы числами в
// коде: SVG и полосы обязаны жить в одной системе координат, иначе рассинхрон.
const STYLES = `
:where([data-vibeui-block="gantt-002"]){
--vibeui-gantt-002-bg:oklch(1 0 0);
--vibeui-gantt-002-fg:oklch(0.23 0.014 265);
--vibeui-gantt-002-muted:oklch(0.6 0.014 265);
--vibeui-gantt-002-border:oklch(0.91 0.006 265);
--vibeui-gantt-002-line:oklch(0.95 0.004 265);
--vibeui-gantt-002-accent:oklch(0.55 0.16 262);
--vibeui-gantt-002-risk:oklch(0.62 0.16 45);
--vibeui-gantt-002-done:oklch(0.6 0.12 165);
--vibeui-gantt-002-link:oklch(0.55 0.03 265);
--vibeui-gantt-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="gantt-002"]{
width:100%;box-sizing:border-box;padding:1rem;
background:var(--vibeui-gantt-002-bg);
border:1px solid var(--vibeui-gantt-002-border);border-radius:1rem;
color:var(--vibeui-gantt-002-fg);font-family:var(--vibeui-gantt-002-font);
}
[data-vibeui-block="gantt-002"] *{box-sizing:border-box}
[data-vibeui-block="gantt-002"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;
gap:0.5rem;margin:0 0 0.75rem;
}
[data-vibeui-block="gantt-002"] [data-part="heading"]{
margin:0;font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="gantt-002"] [data-part="hint"]{
margin:0;font-size:0.75rem;color:var(--vibeui-gantt-002-muted);
}
/* Прокрутка живёт в своём контейнере и получает фокус: план шире экрана
   почти всегда, и с клавиатуры его тоже нужно уметь пролистать. */
[data-vibeui-block="gantt-002"] [data-part="scroll"]{
overflow-x:auto;border:1px solid var(--vibeui-gantt-002-line);border-radius:0.625rem;
}
[data-vibeui-block="gantt-002"] [data-part="scroll"]:focus-visible{
outline:2px solid var(--vibeui-gantt-002-accent);outline-offset:2px;
}
[data-vibeui-block="gantt-002"] [data-part="shell"]{display:flex}
[data-vibeui-block="gantt-002"] [data-part="names"]{
position:sticky;left:0;z-index:2;flex:none;width:9.5rem;
background:var(--vibeui-gantt-002-bg);
border-right:1px solid var(--vibeui-gantt-002-border);
}
[data-vibeui-block="gantt-002"] [data-part="name"]{
display:flex;flex-direction:column;justify-content:center;
padding:0 0.625rem;font-size:0.75rem;font-weight:600;
border-top:1px solid var(--vibeui-gantt-002-line);
}
[data-vibeui-block="gantt-002"] [data-part="name"] small{
font-size:0.625rem;font-weight:400;color:var(--vibeui-gantt-002-muted);
}
[data-vibeui-block="gantt-002"] [data-part="plot"]{position:relative;flex:none}
[data-vibeui-block="gantt-002"] [data-part="scale"]{
display:flex;font-size:0.5625rem;color:var(--vibeui-gantt-002-muted);
}
[data-vibeui-block="gantt-002"] [data-part="day"]{
flex:none;text-align:center;padding:0.25rem 0;
border-left:1px solid var(--vibeui-gantt-002-line);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="gantt-002"] [data-part="canvas"]{
position:relative;
background:repeating-linear-gradient(
to right,
var(--vibeui-gantt-002-line) 0 1px,
transparent 1px var(--vibeui-gantt-002-daywidth,2.125rem));
}
[data-vibeui-block="gantt-002"] [data-part="bar"]{
position:absolute;display:flex;align-items:center;
padding:0 0.4375rem;border-radius:0.375rem;
background:color-mix(in oklab,var(--vibeui-gantt-002-accent) 18%,var(--vibeui-gantt-002-bg));
border:1px solid var(--vibeui-gantt-002-accent);
font-size:0.625rem;line-height:1;white-space:nowrap;overflow:hidden;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="gantt-002"] [data-tone="risk"]{
border-color:var(--vibeui-gantt-002-risk);border-style:dashed;
background:color-mix(in oklab,var(--vibeui-gantt-002-risk) 18%,var(--vibeui-gantt-002-bg));
}
[data-vibeui-block="gantt-002"] [data-tone="done"]{
border-color:var(--vibeui-gantt-002-done);
background:color-mix(in oklab,var(--vibeui-gantt-002-done) 18%,var(--vibeui-gantt-002-bg));
}
[data-vibeui-block="gantt-002"] svg{position:absolute;inset:0;pointer-events:none}
[data-vibeui-block="gantt-002"] [data-part="table"]{margin:0.75rem 0 0}
[data-vibeui-block="gantt-002"] summary{
cursor:pointer;font-size:0.75rem;font-weight:600;
color:var(--vibeui-gantt-002-accent);
}
[data-vibeui-block="gantt-002"] summary:focus-visible{
outline:2px solid var(--vibeui-gantt-002-accent);outline-offset:2px;border-radius:0.25rem;
}
[data-vibeui-block="gantt-002"] table{
width:100%;margin-top:0.5rem;border-collapse:collapse;font-size:0.6875rem;
}
[data-vibeui-block="gantt-002"] th,
[data-vibeui-block="gantt-002"] td{
padding:0.25rem 0.375rem;text-align:left;
border-bottom:1px solid var(--vibeui-gantt-002-line);
}
[data-vibeui-block="gantt-002"] thead th{color:var(--vibeui-gantt-002-muted);font-weight:600}
[data-vibeui-block="gantt-002"] td{font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="gantt-002"] *{animation:none!important;transition:none!important}}
`

/** Ширина дня и высота строки в пикселях: полосы и SVG считаются от них. */
const DAY_WIDTH = 34
const ROW_HEIGHT = 34
const BAR_HEIGHT = 22
const DAY = 86400000

const DEFAULT_TASKS: Gantt002Task[] = [
  { id: "spec", title: "Спецификация", start: 0, days: 3, tone: "done" },
  { id: "api", title: "Схема данных", start: 3, days: 4, after: "spec" },
  { id: "ui", title: "Экраны", start: 3, days: 5, after: "spec" },
  { id: "sync", title: "Синхронизация", start: 7, days: 3, after: "api" },
  {
    id: "qa",
    title: "Тестирование",
    start: 10,
    days: 3,
    after: "sync",
    tone: "risk",
  },
  { id: "ship", title: "Релиз", start: 13, days: 2, after: "qa" },
]

/**
 * План со связями «после чего»: стрелки рисуются SVG-слоем по тем же
 * координатам, что и полосы. Один файл, ноль зависимостей.
 */
export function Gantt002({
  heading = "План со связями",
  startDate = "2026-03-02",
  tasks = DEFAULT_TASKS,
  accent,
  className,
  style,
  ...props
}: Gantt002Props) {
  const total = Math.max(...tasks.map((task) => task.start + task.days))
  const width = total * DAY_WIDTH
  const height = tasks.length * ROW_HEIGHT
  const origin = new Date(`${startDate}T00:00:00Z`).getTime()

  const dayLabel = (offset: number) =>
    new Date(origin + offset * DAY).getUTCDate()

  const rowOf = (id: string) => tasks.findIndex((task) => task.id === id)

  const links = tasks.flatMap((task, row) => {
    const from = task.after ? rowOf(task.after) : -1

    if (from < 0) {
      return []
    }

    const parent = tasks[from]
    const x1 = (parent.start + parent.days) * DAY_WIDTH
    const y1 = from * ROW_HEIGHT + ROW_HEIGHT / 2
    const x2 = task.start * DAY_WIDTH
    const y2 = row * ROW_HEIGHT + ROW_HEIGHT / 2
    const turn = Math.max(x1 + 8, x2 - 10)

    return [
      {
        key: `${parent.id}-${task.id}`,
        points: `${x1},${y1} ${turn},${y1} ${turn},${y2} ${x2 - 5},${y2}`,
      },
    ]
  })

  const palette = {
    "--vibeui-gantt-002-daywidth": `${DAY_WIDTH}px`,
    ...(accent ? { "--vibeui-gantt-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-gantt-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="gantt-002"
        aria-label={heading}
        className={className}
        style={palette}
      >
        <header data-part="head">
          <h3 data-part="heading">{heading}</h3>
          <p data-part="hint">стрелка — «не раньше, чем закончится»</p>
        </header>

        <div
          data-part="scroll"
          tabIndex={0}
          role="group"
          aria-label={`${heading}: диаграмма, прокручивается вбок`}
        >
          <div data-part="shell">
            <div data-part="names">
              <div style={{ height: 22 }} />
              {tasks.map((task) => (
                <div
                  key={task.id}
                  data-part="name"
                  style={{ height: ROW_HEIGHT }}
                >
                  {task.title}
                  {task.after ? (
                    <small>
                      после: {tasks[rowOf(task.after)]?.title ?? task.after}
                    </small>
                  ) : (
                    <small>старт плана</small>
                  )}
                </div>
              ))}
            </div>

            <div data-part="plot" style={{ width }}>
              <div data-part="scale" style={{ height: 22 }} aria-hidden="true">
                {Array.from({ length: total }, (_, index) => (
                  <span
                    key={index}
                    data-part="day"
                    style={{ width: DAY_WIDTH }}
                  >
                    {dayLabel(index)}
                  </span>
                ))}
              </div>

              <div data-part="canvas" style={{ height }}>
                <svg
                  width={width}
                  height={height}
                  viewBox={`0 0 ${width} ${height}`}
                  aria-hidden="true"
                >
                  <defs>
                    <marker
                      id="vibeui-gantt-002-arrow"
                      markerWidth="6"
                      markerHeight="6"
                      refX="5"
                      refY="3"
                      orient="auto"
                    >
                      <path
                        d="M0,0 L6,3 L0,6 z"
                        fill="var(--vibeui-gantt-002-link)"
                      />
                    </marker>
                  </defs>
                  {links.map((link) => (
                    <polyline
                      key={link.key}
                      points={link.points}
                      fill="none"
                      stroke="var(--vibeui-gantt-002-link)"
                      strokeWidth="1.5"
                      markerEnd="url(#vibeui-gantt-002-arrow)"
                    />
                  ))}
                </svg>

                {tasks.map((task, row) => (
                  <div
                    key={task.id}
                    data-part="bar"
                    data-tone={task.tone ?? "work"}
                    style={{
                      left: task.start * DAY_WIDTH,
                      width: task.days * DAY_WIDTH,
                      top: row * ROW_HEIGHT + (ROW_HEIGHT - BAR_HEIGHT) / 2,
                      height: BAR_HEIGHT,
                    }}
                  >
                    {task.days} дн
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <details data-part="table">
          <summary>Те же сроки таблицей</summary>
          <table>
            <thead>
              <tr>
                <th scope="col">Задача</th>
                <th scope="col">Начало</th>
                <th scope="col">Конец</th>
                <th scope="col">После</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <th scope="row">{task.title}</th>
                  <td>
                    {new Date(origin + task.start * DAY)
                      .toISOString()
                      .slice(0, 10)}
                  </td>
                  <td>
                    {new Date(origin + (task.start + task.days - 1) * DAY)
                      .toISOString()
                      .slice(0, 10)}
                  </td>
                  <td>
                    {task.after
                      ? (tasks[rowOf(task.after)]?.title ?? task.after)
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </section>
    </>
  )
}

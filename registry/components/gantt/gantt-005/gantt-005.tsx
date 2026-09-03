import type { ComponentProps, CSSProperties } from "react"

export type Gantt005Task = {
  title: string
  owner: string
  /** Смещение начала в неделях от начала плана, 1 — первая колонка. */
  start: number
  weeks: number
  tone?: "work" | "risk" | "done"
}

export type Gantt005Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  heading?: string
  weeks?: string[]
  tasks?: Gantt005Task[]
  /** Строка под заголовком: {people} — людей, {tasks} — задач. */
  hintText?: string
  /** Подпись области прокрутки: {heading} — заголовок плана. */
  scrollText?: string
  /** Сводка группы: {count} — задач, {load} — недель работы. */
  loadText?: string
  /** Срок внутри полосы: {from} и {to} — подписи первой и последней недели. */
  rangeText?: string
  /** Подпись раскрывающейся таблицы точных сроков. */
  tableText?: string
  /** Заголовки таблицы по ключам owner, task, start, end. */
  columnText?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: план по исполнителям отвечает на другой вопрос, чем план
// по задачам, — «кто перегружен» вместо «когда закончим». Поэтому строки
// сгруппированы, а заголовок группы несёт сводку: сколько задач и сколько
// недель работы. Пересечения внутри одной группы подписаны словом: две
// полосы на соседних строках одного человека — это два дела одновременно.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="gantt-005"]){
--vibeui-gantt-005-bg:transparent;
--vibeui-gantt-005-sticky:light-dark(oklch(0.995 0.001 265),oklch(0.19 0.008 265));
--vibeui-gantt-005-fg:light-dark(oklch(0.23 0.014 265),oklch(0.93 0.006 265));
--vibeui-gantt-005-muted:color-mix(in oklab,var(--vibeui-gantt-005-fg) 68%,transparent);
--vibeui-gantt-005-border:light-dark(oklch(0.91 0.006 265),oklch(0.37 0.012 265));
--vibeui-gantt-005-line:light-dark(oklch(0.955 0.004 265),oklch(0.3 0.01 265));
--vibeui-gantt-005-group:light-dark(oklch(0.97 0.004 265),oklch(0.25 0.01 265));
--vibeui-gantt-005-accent:light-dark(oklch(0.54 0.15 285),oklch(0.74 0.14 285));
--vibeui-gantt-005-risk:light-dark(oklch(0.62 0.16 45),oklch(0.76 0.15 55));
--vibeui-gantt-005-done:light-dark(oklch(0.6 0.12 165),oklch(0.76 0.12 165));
--vibeui-gantt-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="gantt-005"]{color-scheme:dark}
[data-vibeui-block="gantt-005"]{
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);box-sizing:border-box;padding:1rem;
background:var(--vibeui-gantt-005-bg);
border:1px solid var(--vibeui-gantt-005-border);border-radius:1rem;
color:var(--vibeui-gantt-005-fg);font-family:var(--vibeui-gantt-005-font);
/* Шкала кегля растёт от собственной ширины блока, а не от окна. */
container-type:inline-size;
}
[data-vibeui-block="gantt-005"] *{box-sizing:border-box}
[data-vibeui-block="gantt-005"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;
gap:0.5rem;margin:0 0 0.75rem;
}
[data-vibeui-block="gantt-005"] [data-part="heading"]{
margin:0;font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
}
@container (min-width:32rem){
[data-vibeui-block="gantt-005"] [data-part="heading"]{font-size:1rem}
[data-vibeui-block="gantt-005"] [data-part="head"]{margin-bottom:1.0625rem}
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
position:sticky;left:0;z-index:3;background:var(--vibeui-gantt-005-sticky);
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
background:color-mix(in oklab,var(--vibeui-gantt-005-accent) 22%,transparent);
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
background:var(--vibeui-gantt-005-sticky);
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
background:color-mix(in oklab,var(--vibeui-gantt-005-accent) 18%,transparent);
font-size:0.5625rem;line-height:1;white-space:nowrap;overflow:hidden;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="gantt-005"] [data-tone="risk"]{
border-color:var(--vibeui-gantt-005-risk);border-style:dashed;
background:color-mix(in oklab,var(--vibeui-gantt-005-risk) 16%,transparent);
}
[data-vibeui-block="gantt-005"] [data-tone="done"]{
border-color:var(--vibeui-gantt-005-done);
background:color-mix(in oklab,var(--vibeui-gantt-005-done) 18%,transparent);
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

const DEFAULT_COLUMNS: Record<string, string> = {
  owner: "Исполнитель",
  task: "Задача",
  start: "Начало",
  end: "Конец",
}

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
  hintText = "{people} человека, {tasks} задач",
  scrollText = "{heading}: диаграмма, прокручивается вбок",
  loadText = "{count} задач · {load} недель",
  rangeText = "{from}–{to}",
  tableText = "Те же сроки таблицей",
  columnText = DEFAULT_COLUMNS,
  background = "",
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
    ...(background
      ? {
          "--vibeui-gantt-005-bg": background,
          "--vibeui-gantt-005-sticky": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-gantt-005" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="gantt"
        data-vibeui-block="gantt-005"
        aria-label={heading}
        className={className}
        style={palette}
      >
        <header data-part="head">
          <h3 data-part="heading">{heading}</h3>
          <p data-part="hint">
            {hintText
              .replace("{people}", String(owners.length))
              .replace("{tasks}", String(tasks.length))}
          </p>
        </header>

        <div
          data-part="scroll"
          tabIndex={0}
          role="group"
          aria-label={scrollText.replace("{heading}", heading)}
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
                    {loadText
                      .replace("{count}", String(row.count))
                      .replace("{load}", String(row.load))}
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
                  {rangeText
                    .replace("{from}", weeks[row.task.start - 1] ?? "")
                    .replace(
                      "{to}",
                      weeks[row.task.start + row.task.weeks - 2] ?? "",
                    )}
                </span>
              ) : null,
            )}
          </div>
        </div>

        <details data-part="table">
          <summary>{tableText}</summary>
          <table>
            <thead>
              <tr>
                <th scope="col">{columnText.owner ?? DEFAULT_COLUMNS.owner}</th>
                <th scope="col">{columnText.task ?? DEFAULT_COLUMNS.task}</th>
                <th scope="col">{columnText.start ?? DEFAULT_COLUMNS.start}</th>
                <th scope="col">{columnText.end ?? DEFAULT_COLUMNS.end}</th>
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

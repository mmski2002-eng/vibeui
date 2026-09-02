import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Gantt004Task = {
  title: string
  /** Смещение начала в неделях от начала плана. */
  start: number
  weeks: number
  /** Готовность, 0–100. */
  progress: number
  owner?: string
}

export type Gantt004Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "title"
> & {
  heading?: string
  weeks?: string[]
  tasks?: Gantt004Task[]
  /** Номер текущей недели, 1 — первая колонка. */
  currentWeek?: number
  /** Строка под заголовком: {done} — средняя готовность в процентах. */
  hintText?: string
  /** Подпись области прокрутки: {heading} — заголовок плана. */
  scrollText?: string
  /** Подпись полосы: {title}, {progress} и {target} подставляют значения. */
  barText?: string
  /** Срок в таблице: {from} и {to} — подписи первой и последней недели. */
  rangeText?: string
  /** Подпись раскрывающейся таблицы готовности. */
  tableText?: string
  /** Заголовки таблицы по ключам task, weeks, done, expected. */
  columnText?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: полоса показывает срок, но не отвечает на вопрос
// «успеваем ли». Готовность рисуется заливкой ВНУТРИ полосы, а ожидаемая
// на сегодня доля — засечкой на той же полосе: отставание видно как разрыв
// между заливкой и засечкой, без второй строки «план/факт». Проценты
// продублированы числом: по длине заливки 55% от 70% не отличить.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="gantt-004"]){
--vibeui-gantt-004-bg:transparent;
--vibeui-gantt-004-sticky:light-dark(oklch(0.995 0.001 265),oklch(0.19 0.008 265));
--vibeui-gantt-004-fg:light-dark(oklch(0.23 0.014 265),oklch(0.93 0.006 265));
--vibeui-gantt-004-muted:light-dark(oklch(0.6 0.014 265),oklch(0.7 0.012 265));
--vibeui-gantt-004-border:light-dark(oklch(0.91 0.006 265),oklch(0.37 0.012 265));
--vibeui-gantt-004-line:light-dark(oklch(0.955 0.004 265),oklch(0.3 0.01 265));
--vibeui-gantt-004-track:light-dark(oklch(0.94 0.006 265),oklch(0.27 0.01 265));
--vibeui-gantt-004-accent:light-dark(oklch(0.55 0.16 250),oklch(0.74 0.14 250));
--vibeui-gantt-004-late:light-dark(oklch(0.6 0.18 25),oklch(0.72 0.16 30));
--vibeui-gantt-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="gantt-004"]{
width:100%;box-sizing:border-box;padding:1rem;
background:var(--vibeui-gantt-004-bg);
border:1px solid var(--vibeui-gantt-004-border);border-radius:1rem;
color:var(--vibeui-gantt-004-fg);font-family:var(--vibeui-gantt-004-font);
}
[data-vibeui-block="gantt-004"] *{box-sizing:border-box}
[data-vibeui-block="gantt-004"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;
gap:0.5rem;margin:0 0 0.75rem;
}
[data-vibeui-block="gantt-004"] [data-part="heading"]{
margin:0;font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="gantt-004"] [data-part="hint"]{
margin:0;font-size:0.75rem;color:var(--vibeui-gantt-004-muted);
}
[data-vibeui-block="gantt-004"] [data-part="scroll"]{
overflow-x:auto;border:1px solid var(--vibeui-gantt-004-line);border-radius:0.625rem;
}
[data-vibeui-block="gantt-004"] [data-part="scroll"]:focus-visible{
outline:2px solid var(--vibeui-gantt-004-accent);outline-offset:2px;
}
[data-vibeui-block="gantt-004"] [data-part="grid"]{
display:grid;min-width:32rem;
grid-template-columns:11rem repeat(var(--vibeui-gantt-004-weeks,8),minmax(3rem,1fr));
}
[data-vibeui-block="gantt-004"] [data-part="cap"]{
padding:0.375rem 0.25rem;text-align:center;
border-bottom:1px solid var(--vibeui-gantt-004-border);
border-left:1px solid var(--vibeui-gantt-004-line);
font-size:0.625rem;color:var(--vibeui-gantt-004-muted);
}
[data-vibeui-block="gantt-004"] [data-part="cap"][data-current="true"]{
color:var(--vibeui-gantt-004-accent);font-weight:700;
}
[data-vibeui-block="gantt-004"] [data-part="corner"]{
position:sticky;left:0;z-index:2;background:var(--vibeui-gantt-004-sticky);
border-bottom:1px solid var(--vibeui-gantt-004-border);
border-right:1px solid var(--vibeui-gantt-004-border);
}
[data-vibeui-block="gantt-004"] [data-part="name"]{
position:sticky;left:0;z-index:1;
display:flex;flex-direction:column;justify-content:center;gap:0.0625rem;
min-height:2.5rem;padding:0.3125rem 0.625rem;
background:var(--vibeui-gantt-004-sticky);
border-right:1px solid var(--vibeui-gantt-004-border);
border-top:1px solid var(--vibeui-gantt-004-line);
font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="gantt-004"] [data-part="name"] small{
font-size:0.625rem;font-weight:400;color:var(--vibeui-gantt-004-muted);
}
[data-vibeui-block="gantt-004"] [data-part="cell"]{
border-top:1px solid var(--vibeui-gantt-004-line);
border-left:1px solid var(--vibeui-gantt-004-line);
}
[data-vibeui-block="gantt-004"] [data-part="cell"][data-current="true"]{
background:color-mix(in oklab,var(--vibeui-gantt-004-accent) 6%,transparent);
}
/* Полоса — это дорожка: срок задаёт её ширину, готовность — заливку внутри. */
[data-vibeui-block="gantt-004"] [data-part="bar"]{
position:relative;align-self:center;z-index:1;
margin:0 0.25rem;height:1.375rem;border-radius:0.4375rem;overflow:hidden;
background:var(--vibeui-gantt-004-track);
border:1px solid var(--vibeui-gantt-004-border);
}
[data-vibeui-block="gantt-004"] [data-part="fill"]{
position:absolute;inset:0 auto 0 0;
width:calc(var(--vibeui-gantt-004-progress,0) * 1%);
background:color-mix(in oklab,var(--vibeui-gantt-004-accent) 78%,var(--vibeui-gantt-004-track));
}
[data-vibeui-block="gantt-004"] [data-part="bar"][data-late="true"] [data-part="fill"]{
background:repeating-linear-gradient(135deg,
color-mix(in oklab,var(--vibeui-gantt-004-late) 62%,var(--vibeui-gantt-004-track)) 0 5px,
color-mix(in oklab,var(--vibeui-gantt-004-late) 38%,var(--vibeui-gantt-004-track)) 5px 10px);
}
/* Засечка — ожидаемая на сегодня доля. Разрыв с заливкой и есть отставание. */
[data-vibeui-block="gantt-004"] [data-part="target"]{
position:absolute;top:0;bottom:0;
left:calc(var(--vibeui-gantt-004-target,0) * 1%);
border-left:2px dashed var(--vibeui-gantt-004-fg);
}
[data-vibeui-block="gantt-004"] [data-part="value"]{
position:relative;z-index:1;display:block;
padding:0 0.4375rem;line-height:1.375rem;
font-size:0.625rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="gantt-004"] [data-part="table"]{margin:0.75rem 0 0}
[data-vibeui-block="gantt-004"] summary{
cursor:pointer;font-size:0.75rem;font-weight:600;color:var(--vibeui-gantt-004-accent);
}
[data-vibeui-block="gantt-004"] summary:focus-visible{
outline:2px solid var(--vibeui-gantt-004-accent);outline-offset:2px;border-radius:0.25rem;
}
[data-vibeui-block="gantt-004"] table{
width:100%;margin-top:0.5rem;border-collapse:collapse;font-size:0.6875rem;
}
[data-vibeui-block="gantt-004"] th,
[data-vibeui-block="gantt-004"] td{
padding:0.25rem 0.375rem;text-align:left;
border-bottom:1px solid var(--vibeui-gantt-004-line);
}
[data-vibeui-block="gantt-004"] thead th{color:var(--vibeui-gantt-004-muted);font-weight:600}
[data-vibeui-block="gantt-004"] td{font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="gantt-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_WEEKS = ["W10", "W11", "W12", "W13", "W14", "W15", "W16", "W17"]

const DEFAULT_TASKS: Gantt004Task[] = [
  {
    title: "Каркас каталога",
    start: 1,
    weeks: 2,
    progress: 100,
    owner: "Аня",
  },
  { title: "Карточки блоков", start: 2, weeks: 3, progress: 80, owner: "Илья" },
  { title: "Импорт данных", start: 3, weeks: 3, progress: 35, owner: "Ким" },
  {
    title: "Экспорт для агента",
    start: 5,
    weeks: 2,
    progress: 10,
    owner: "Пётр",
  },
  {
    title: "Документация",
    start: 6,
    weeks: 3,
    progress: 0,
    owner: "не назначен",
  },
]

const DEFAULT_COLUMNS: Record<string, string> = {
  task: "Задача",
  weeks: "Недели",
  done: "Готово",
  expected: "Ожидалось",
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

/**
 * План с прогрессом внутри полосы: заливка — сделано, засечка — ожидаемая
 * на сегодня доля. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Gantt004({
  heading = "Готовность работ",
  weeks = DEFAULT_WEEKS,
  tasks = DEFAULT_TASKS,
  currentWeek = 4,
  hintText = "по плану {done}% · пунктир — ожидание на сегодня",
  scrollText = "{heading}: диаграмма, прокручивается вбок",
  barText = "{title}: готово {progress}%, ожидалось {target}%",
  rangeText = "{from} — {to}",
  tableText = "Готовность таблицей",
  columnText = DEFAULT_COLUMNS,
  background = "",
  accent,
  className,
  style,
  ...props
}: Gantt004Props) {
  const expected = (task: Gantt004Task) => {
    const passed = currentWeek - task.start + 1
    return Math.max(0, Math.min(100, Math.round((passed / task.weeks) * 100)))
  }

  const done = Math.round(
    tasks.reduce((sum, task) => sum + task.progress * task.weeks, 0) /
      tasks.reduce((sum, task) => sum + task.weeks, 0),
  )

  const palette = {
    "--vibeui-gantt-004-weeks": weeks.length,
    ...(accent ? { "--vibeui-gantt-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-gantt-004-bg": background,
          "--vibeui-gantt-004-sticky": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-gantt-004" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="gantt-004"
        aria-label={heading}
        className={className}
        style={palette}
      >
        <header data-part="head">
          <h3 data-part="heading">{heading}</h3>
          <p data-part="hint">{hintText.replace("{done}", String(done))}</p>
        </header>

        <div
          data-part="scroll"
          tabIndex={0}
          role="group"
          aria-label={scrollText.replace("{heading}", heading)}
        >
          <div data-part="grid">
            <span data-part="corner" />
            {weeks.map((week, index) => (
              <span
                key={week}
                data-part="cap"
                data-current={String(index + 1 === currentWeek)}
              >
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
                {task.owner ? <small>{task.owner}</small> : null}
              </span>
            ))}

            {tasks.map((task, row) =>
              weeks.map((week, column) => (
                <span
                  key={`${task.title}-${week}`}
                  data-part="cell"
                  data-current={String(column + 1 === currentWeek)}
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
              const target = expected(task)
              const late = task.progress + 10 < target

              return (
                <span
                  key={`${task.title}-bar`}
                  data-part="bar"
                  data-late={String(late)}
                  role="img"
                  aria-label={barText
                    .replace("{title}", task.title)
                    .replace("{progress}", String(task.progress))
                    .replace("{target}", String(target))}
                  style={
                    {
                      gridRow: row + 2,
                      gridColumn: `${task.start + 1} / ${task.start + task.weeks + 1}`,
                      "--vibeui-gantt-004-progress": task.progress,
                      "--vibeui-gantt-004-target": target,
                    } as CSSProperties
                  }
                >
                  <i data-part="fill" aria-hidden="true" />
                  <i data-part="target" aria-hidden="true" />
                  <b data-part="value">{task.progress}%</b>
                </span>
              )
            })}
          </div>
        </div>

        <details data-part="table">
          <summary>{tableText}</summary>
          <table>
            <thead>
              <tr>
                <th scope="col">{columnText.task ?? DEFAULT_COLUMNS.task}</th>
                <th scope="col">{columnText.weeks ?? DEFAULT_COLUMNS.weeks}</th>
                <th scope="col">{columnText.done ?? DEFAULT_COLUMNS.done}</th>
                <th scope="col">
                  {columnText.expected ?? DEFAULT_COLUMNS.expected}
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.title}>
                  <th scope="row">{task.title}</th>
                  <td>
                    {rangeText
                      .replace("{from}", weeks[task.start - 1] ?? "")
                      .replace(
                        "{to}",
                        weeks[task.start + task.weeks - 2] ?? "",
                      )}
                  </td>
                  <td>{task.progress}%</td>
                  <td>{expected(task)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </section>
    </>
  )
}

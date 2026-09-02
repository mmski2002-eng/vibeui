import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Gantt007Task = {
  id: string
  title: string
  days: number
  /** id задач, после которых эта может начаться. */
  after?: string[]
}

export type Gantt007Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "title"
> & {
  heading?: string
  startDate?: string
  tasks?: Gantt007Task[]
  /** Сводка под заголовком: {total}, {critical} и {count} подставляют числа. */
  hintText?: string
  /** Подпись области прокрутки: {heading} — заголовок плана. */
  scrollText?: string
  /** Метка критической задачи на полосе. */
  tagText?: string
  /** Длительность внутри полосы: {days} — число дней. */
  daysText?: string
  /** Пометка критической задачи в таблице. */
  criticalText?: string
  /** Подпись раскрывающейся таблицы сроков и запаса. */
  tableText?: string
  /** Заголовки таблицы по ключам task, start, end, slack. */
  columnText?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: критический путь — это не цвет, а начертание. Задачи без
// запаса получают сплошную заливку, жирную рамку и подпись «КП», остальные —
// тонкий контур и полупрозрачный «хвост» запаса: сразу видно, где план
// сдвинется от любой задержки, а где есть люфт. Сроки и запас считаются из
// связей прямо при рендере — прямого и обратного прохода хватает, состояния
// нет, компонент остаётся серверным.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="gantt-007"]){
--vibeui-gantt-007-bg:transparent;
--vibeui-gantt-007-fg:light-dark(oklch(0.22 0.014 265),oklch(0.93 0.006 265));
--vibeui-gantt-007-muted:light-dark(oklch(0.6 0.014 265),oklch(0.7 0.012 265));
--vibeui-gantt-007-border:light-dark(oklch(0.91 0.006 265),oklch(0.37 0.012 265));
--vibeui-gantt-007-line:light-dark(oklch(0.955 0.004 265),oklch(0.3 0.01 265));
--vibeui-gantt-007-accent:light-dark(oklch(0.52 0.19 25),oklch(0.7 0.17 30));
--vibeui-gantt-007-calm:light-dark(oklch(0.55 0.03 265),oklch(0.68 0.02 265));
--vibeui-gantt-007-onaccent:light-dark(oklch(0.99 0 0),oklch(0.17 0.01 265));
--vibeui-gantt-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="gantt-007"]{
width:100%;box-sizing:border-box;padding:1rem;
background:var(--vibeui-gantt-007-bg);
border:1px solid var(--vibeui-gantt-007-border);border-radius:1rem;
color:var(--vibeui-gantt-007-fg);font-family:var(--vibeui-gantt-007-font);
}
[data-vibeui-block="gantt-007"] *{box-sizing:border-box}
[data-vibeui-block="gantt-007"] ol,
[data-vibeui-block="gantt-007"] ul{margin:0;padding:0;list-style:none}
[data-vibeui-block="gantt-007"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;
gap:0.5rem;margin:0 0 0.75rem;
}
[data-vibeui-block="gantt-007"] [data-part="heading"]{
margin:0;font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="gantt-007"] [data-part="hint"]{
margin:0;font-size:0.75rem;color:var(--vibeui-gantt-007-muted);
}
[data-vibeui-block="gantt-007"] [data-part="scroll"]{
overflow-x:auto;border:1px solid var(--vibeui-gantt-007-line);border-radius:0.625rem;
padding:0.5rem 0.625rem 0.625rem;
}
[data-vibeui-block="gantt-007"] [data-part="scroll"]:focus-visible{
outline:2px solid var(--vibeui-gantt-007-accent);outline-offset:2px;
}
[data-vibeui-block="gantt-007"] [data-part="shell"]{min-width:30rem}
[data-vibeui-block="gantt-007"] [data-part="row"]{
display:flex;align-items:center;gap:0.625rem;padding:0.1875rem 0;
}
[data-vibeui-block="gantt-007"] [data-part="label"]{
flex:none;width:9rem;font-size:0.75rem;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
/* Дорожка занимает всю оставшуюся ширину: полоса ставится в процентах
   от длины проекта, поэтому сетка колонок вообще не нужна. */
[data-vibeui-block="gantt-007"] [data-part="track"]{
position:relative;flex:1;height:1.25rem;
background:repeating-linear-gradient(
to right,
var(--vibeui-gantt-007-line) 0 1px,
transparent 1px calc(100% / var(--vibeui-gantt-007-ticks,10)));
}
[data-vibeui-block="gantt-007"] [data-part="bar"]{
position:absolute;top:0.125rem;bottom:0.125rem;
display:flex;align-items:center;padding:0 0.375rem;border-radius:0.25rem;
font-size:0.5625rem;line-height:1;white-space:nowrap;overflow:hidden;
font-variant-numeric:tabular-nums;
border:1px solid var(--vibeui-gantt-007-calm);
color:var(--vibeui-gantt-007-fg);
background:color-mix(in oklab,var(--vibeui-gantt-007-calm) 12%,transparent);
}
/* Критическая задача отличается начертанием, а не оттенком: заливка,
   двойная рамка и жирный текст переживают и печать, и дальтонизм. */
[data-vibeui-block="gantt-007"] [data-part="bar"][data-critical="true"]{
border:2px solid var(--vibeui-gantt-007-accent);
background:color-mix(in oklab,var(--vibeui-gantt-007-accent) 24%,transparent);
font-weight:750;
box-shadow:inset 0 0 0 1px var(--vibeui-gantt-007-onaccent);
}
[data-vibeui-block="gantt-007"] [data-part="row"][data-critical="true"] [data-part="label"]{
font-weight:700;
}
[data-vibeui-block="gantt-007"] [data-part="row"][data-critical="false"] [data-part="label"]{
color:var(--vibeui-gantt-007-muted);
}
/* Хвост запаса: докуда задачу можно сдвинуть, ничего не сломав. */
[data-vibeui-block="gantt-007"] [data-part="slack"]{
position:absolute;top:0.4375rem;bottom:0.4375rem;
border-top:1px dashed var(--vibeui-gantt-007-calm);
border-bottom:1px dashed var(--vibeui-gantt-007-calm);
}
[data-vibeui-block="gantt-007"] [data-part="scale"]{
display:flex;margin-left:9.625rem;
}
[data-vibeui-block="gantt-007"] [data-part="scale"] span{
flex:1;font-size:0.5625rem;color:var(--vibeui-gantt-007-muted);
font-variant-numeric:tabular-nums;
border-left:1px solid var(--vibeui-gantt-007-line);padding-left:0.1875rem;
}
[data-vibeui-block="gantt-007"] [data-part="tag"]{
margin-left:0.375rem;padding:0 0.1875rem;border-radius:0.1875rem;
background:var(--vibeui-gantt-007-accent);color:var(--vibeui-gantt-007-onaccent);
font-size:0.5rem;font-weight:700;letter-spacing:0.04em;
}
[data-vibeui-block="gantt-007"] [data-part="table"]{margin:0.75rem 0 0}
[data-vibeui-block="gantt-007"] summary{
cursor:pointer;font-size:0.75rem;font-weight:600;color:var(--vibeui-gantt-007-accent);
}
[data-vibeui-block="gantt-007"] summary:focus-visible{
outline:2px solid var(--vibeui-gantt-007-accent);outline-offset:2px;border-radius:0.25rem;
}
[data-vibeui-block="gantt-007"] table{
width:100%;margin-top:0.5rem;border-collapse:collapse;font-size:0.6875rem;
}
[data-vibeui-block="gantt-007"] th,
[data-vibeui-block="gantt-007"] td{
padding:0.25rem 0.375rem;text-align:left;
border-bottom:1px solid var(--vibeui-gantt-007-line);
}
[data-vibeui-block="gantt-007"] thead th{color:var(--vibeui-gantt-007-muted);font-weight:600}
[data-vibeui-block="gantt-007"] td{font-variant-numeric:tabular-nums}
[data-vibeui-block="gantt-007"] tr[data-critical="true"] th{font-weight:750}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="gantt-007"] *{animation:none!important;transition:none!important}}
`

const DAY = 86400000

const DEFAULT_TASKS: Gantt007Task[] = [
  { id: "brief", title: "Бриф", days: 2 },
  { id: "research", title: "Исследование", days: 5, after: ["brief"] },
  { id: "content", title: "Тексты", days: 4, after: ["brief"] },
  { id: "design", title: "Макеты", days: 6, after: ["research"] },
  { id: "build", title: "Вёрстка", days: 7, after: ["design", "content"] },
  { id: "photo", title: "Фотосъёмка", days: 3, after: ["brief"] },
  { id: "qa", title: "Проверка", days: 3, after: ["build", "photo"] },
  { id: "launch", title: "Запуск", days: 1, after: ["qa"] },
]

const DEFAULT_COLUMNS: Record<string, string> = {
  task: "Задача",
  start: "Начало",
  end: "Конец",
  slack: "Запас, дн",
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
 * Прямой и обратный проход по связям: ранние сроки, поздние сроки и запас.
 * Задача без запаса лежит на критическом пути.
 */
function schedule(tasks: Gantt007Task[]) {
  const earliest = new Map<string, number>()

  for (const task of tasks) {
    const start = (task.after ?? []).reduce(
      (max, id) => Math.max(max, earliest.get(id) ?? 0),
      0,
    )
    earliest.set(task.id, start + task.days)
  }

  const total = Math.max(...earliest.values())
  const latest = new Map<string, number>()

  for (const task of [...tasks].reverse()) {
    const finish = tasks
      .filter((other) => other.after?.includes(task.id))
      .reduce(
        (min, other) =>
          Math.min(min, (latest.get(other.id) ?? total) - other.days),
        total,
      )
    latest.set(task.id, finish)
  }

  return {
    total,
    rows: tasks.map((task) => {
      const finish = earliest.get(task.id) ?? task.days
      const start = finish - task.days
      const slack = (latest.get(task.id) ?? total) - finish

      return { task, start, finish, slack, critical: slack === 0 }
    }),
  }
}

/**
 * План с выделенным критическим путём: срок, запас и критичность считаются
 * из связей при рендере. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Gantt007({
  heading = "Критический путь",
  startDate = "2026-05-04",
  tasks = DEFAULT_TASKS,
  hintText = "{total} дней, без запаса {critical} из {count}",
  scrollText = "{heading}: диаграмма, прокручивается вбок",
  tagText = "КП",
  daysText = "{days} дн",
  criticalText = " (критическая)",
  tableText = "Сроки и запас таблицей",
  columnText = DEFAULT_COLUMNS,
  background = "",
  accent,
  className,
  style,
  ...props
}: Gantt007Props) {
  const origin = new Date(`${startDate}T00:00:00Z`).getTime()
  const { total, rows } = schedule(tasks)
  const ticks = Math.min(10, total)
  const step = Math.ceil(total / ticks)
  const critical = rows.filter((row) => row.critical).length

  const dateText = (offset: number) =>
    new Date(origin + offset * DAY).toISOString().slice(0, 10)

  const palette = {
    "--vibeui-gantt-007-ticks": ticks,
    ...(accent ? { "--vibeui-gantt-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-gantt-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-gantt-007" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="gantt-007"
        aria-label={heading}
        className={className}
        style={palette}
      >
        <header data-part="head">
          <h3 data-part="heading">{heading}</h3>
          <p data-part="hint">
            {hintText
              .replace("{total}", String(total))
              .replace("{critical}", String(critical))
              .replace("{count}", String(rows.length))}
          </p>
        </header>

        <div
          data-part="scroll"
          tabIndex={0}
          role="group"
          aria-label={scrollText.replace("{heading}", heading)}
        >
          <div data-part="shell">
            <ol>
              {rows.map((row) => (
                <li
                  key={row.task.id}
                  data-part="row"
                  data-critical={String(row.critical)}
                >
                  <span data-part="label">
                    {row.task.title}
                    {row.critical ? <b data-part="tag">{tagText}</b> : null}
                  </span>

                  <span data-part="track">
                    {row.slack > 0 ? (
                      <i
                        data-part="slack"
                        aria-hidden="true"
                        style={{
                          left: `${(row.finish / total) * 100}%`,
                          width: `${(row.slack / total) * 100}%`,
                        }}
                      />
                    ) : null}

                    <b
                      data-part="bar"
                      data-critical={String(row.critical)}
                      style={{
                        left: `${(row.start / total) * 100}%`,
                        width: `${(row.task.days / total) * 100}%`,
                      }}
                    >
                      {daysText.replace("{days}", String(row.task.days))}
                    </b>
                  </span>
                </li>
              ))}
            </ol>

            <div data-part="scale" aria-hidden="true">
              {Array.from({ length: ticks }, (_, index) => (
                <span key={index}>{index * step}</span>
              ))}
            </div>
          </div>
        </div>

        <details data-part="table">
          <summary>{tableText}</summary>
          <table>
            <thead>
              <tr>
                <th scope="col">{columnText.task ?? DEFAULT_COLUMNS.task}</th>
                <th scope="col">{columnText.start ?? DEFAULT_COLUMNS.start}</th>
                <th scope="col">{columnText.end ?? DEFAULT_COLUMNS.end}</th>
                <th scope="col">{columnText.slack ?? DEFAULT_COLUMNS.slack}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.task.id} data-critical={String(row.critical)}>
                  <th scope="row">
                    {row.task.title}
                    {row.critical ? criticalText : ""}
                  </th>
                  <td>{dateText(row.start)}</td>
                  <td>{dateText(row.finish - 1)}</td>
                  <td>{row.slack}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </section>
    </>
  )
}

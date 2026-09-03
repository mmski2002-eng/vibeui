import type { ComponentProps, CSSProperties } from "react"

export type Gantt006Task = {
  title: string
  /** Смещение начала в днях от начала плана. */
  start: number
  days: number
  tone?: "work" | "risk" | "done"
}

export type Gantt006Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  heading?: string
  startDate?: string
  tasks?: Gantt006Task[]
  unit?: "week" | "day"
  /** Пояснение под заголовком по ключам week и day. */
  hintText?: Record<string, string>
  /** Подпись области прокрутки: {heading} — заголовок плана. */
  scrollText?: string
  /** Верхняя строка недельной шапки: {number} — номер недели. */
  weekText?: string
  /** Подпись полосы: {title}, {from} и {to} подставляют значения. */
  barText?: string
  /** Длительность внутри полосы: {days} — число дней. */
  daysText?: string
  /** Легенда по ключам work, risk, done. */
  toneText?: Record<string, string>
  /** Подпись раскрывающейся таблицы точных дат. */
  tableText?: string
  /** Заголовки таблицы по ключам task, start, end, days. */
  columnText?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: квартальный план в днях не читается — сорок узких колонок
// превращаются в шум. Данные остаются дневными, а сетка сжимается до недель:
// колонка — неделя, полоса округляется наружу до целых недель. Округление
// названо словами в подписи и продублировано точными датами в таблице:
// сжатый вид обязан признаваться, что он сжатый.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="gantt-006"]){
--vibeui-gantt-006-bg:transparent;
--vibeui-gantt-006-sticky:light-dark(oklch(0.995 0.001 265),oklch(0.19 0.008 265));
--vibeui-gantt-006-fg:light-dark(oklch(0.23 0.014 265),oklch(0.93 0.006 265));
--vibeui-gantt-006-muted:color-mix(in oklab,var(--vibeui-gantt-006-fg) 68%,transparent);
--vibeui-gantt-006-border:light-dark(oklch(0.91 0.006 265),oklch(0.37 0.012 265));
--vibeui-gantt-006-line:light-dark(oklch(0.955 0.004 265),oklch(0.3 0.01 265));
--vibeui-gantt-006-accent:light-dark(oklch(0.55 0.14 200),oklch(0.72 0.13 200));
--vibeui-gantt-006-risk:light-dark(oklch(0.62 0.16 45),oklch(0.74 0.15 55));
--vibeui-gantt-006-done:light-dark(oklch(0.6 0.12 165),oklch(0.74 0.12 165));
--vibeui-gantt-006-onaccent:light-dark(oklch(0.99 0 0),oklch(0.17 0.01 265));
--vibeui-gantt-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="gantt-006"]{color-scheme:dark}
[data-vibeui-block="gantt-006"]{
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);box-sizing:border-box;padding:1rem;
background:var(--vibeui-gantt-006-bg);
border:1px solid var(--vibeui-gantt-006-border);border-radius:1rem;
color:var(--vibeui-gantt-006-fg);font-family:var(--vibeui-gantt-006-font);
/* Шкала кегля растёт от собственной ширины блока, а не от окна. */
container-type:inline-size;
}
[data-vibeui-block="gantt-006"] *{box-sizing:border-box}
[data-vibeui-block="gantt-006"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;
gap:0.5rem;margin:0 0 0.75rem;
}
[data-vibeui-block="gantt-006"] [data-part="heading"]{
margin:0;font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
}
@container (min-width:32rem){
[data-vibeui-block="gantt-006"] [data-part="heading"]{font-size:1rem}
[data-vibeui-block="gantt-006"] [data-part="head"]{margin-bottom:1.0625rem}
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
position:sticky;left:0;z-index:3;background:var(--vibeui-gantt-006-sticky);
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
background:var(--vibeui-gantt-006-sticky);
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
color:var(--vibeui-gantt-006-onaccent);
font-size:0.5rem;font-weight:700;line-height:1;
white-space:nowrap;overflow:hidden;
}
[data-vibeui-block="gantt-006"] [data-tone="risk"]{
background:repeating-linear-gradient(135deg,
var(--vibeui-gantt-006-risk) 0 4px,
color-mix(in oklab,var(--vibeui-gantt-006-risk) 60%,transparent) 4px 8px);
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
color-mix(in oklab,var(--vibeui-gantt-006-risk) 60%,transparent) 4px 8px);
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

const DEFAULT_HINTS: Record<string, string> = {
  week: "полоса округлена наружу до целых недель",
  day: "колонка — один день",
}

const DEFAULT_TONES: Record<string, string> = {
  work: "в работе",
  risk: "под риском",
  done: "сделано",
}

const DEFAULT_COLUMNS: Record<string, string> = {
  task: "Задача",
  start: "Начало",
  end: "Конец",
  days: "Дней",
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
 * Неверный проп не должен ронять страницу-хост: на Invalid Date toISOString
 * бросает RangeError, поэтому дату начала откатываем на дефолтную.
 */
function safeStart(value: string, fallback: string) {
  const time = new Date(`${value}T00:00:00Z`).getTime()

  return Number.isNaN(time) ? new Date(`${fallback}T00:00:00Z`).getTime() : time
}

/**
 * Сжатый план: данные дневные, сетка недельная. Полоса округляется наружу
 * до целых недель, точные даты остаются в таблице. Ноль зависимостей.
 */
export function Gantt006({
  heading = "Квартал по неделям",
  startDate = "2026-01-05",
  tasks = DEFAULT_TASKS,
  unit = "week",
  hintText = DEFAULT_HINTS,
  scrollText = "{heading}: диаграмма, прокручивается вбок",
  weekText = "н{number}",
  barText = "{title}: {from} — {to}",
  daysText = "{days} дн",
  toneText = DEFAULT_TONES,
  tableText = "Точные даты таблицей",
  columnText = DEFAULT_COLUMNS,
  background = "",
  accent,
  className,
  style,
  ...props
}: Gantt006Props) {
  const origin = safeStart(startDate, "2026-01-05")
  const size = unit === "week" ? 7 : 1
  const span = Math.max(...tasks.map((task) => task.start + task.days))
  const columns = Math.ceil(span / size)

  const caps = Array.from({ length: columns }, (_, index) => {
    const date = new Date(origin + index * size * DAY)

    return {
      key: date.toISOString().slice(0, 10),
      top:
        unit === "week"
          ? weekText.replace("{number}", String(index + 1))
          : String(date.getUTCDate()),
      bottom: `${date.getUTCDate()}.${String(date.getUTCMonth() + 1).padStart(2, "0")}`,
    }
  })

  const dateText = (offset: number) =>
    new Date(origin + offset * DAY).toISOString().slice(0, 10)

  const palette = {
    "--vibeui-gantt-006-cols": columns,
    "--vibeui-gantt-006-col": unit === "week" ? "3rem" : "1.75rem",
    ...(accent ? { "--vibeui-gantt-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-gantt-006-bg": background,
          "--vibeui-gantt-006-sticky": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-gantt-006" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="gantt"
        data-vibeui-block="gantt-006"
        aria-label={heading}
        className={className}
        style={palette}
      >
        <header data-part="head">
          <h3 data-part="heading">{heading}</h3>
          <p data-part="hint">{hintText[unit] ?? DEFAULT_HINTS[unit]}</p>
        </header>

        <div
          data-part="scroll"
          tabIndex={0}
          role="group"
          aria-label={scrollText.replace("{heading}", heading)}
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
                  aria-label={barText
                    .replace("{title}", task.title)
                    .replace("{from}", dateText(task.start))
                    .replace("{to}", dateText(task.start + task.days - 1))}
                  style={
                    {
                      gridRow: row + 2,
                      gridColumn: `${from + 2} / ${to + 2}`,
                    } as CSSProperties
                  }
                >
                  {daysText.replace("{days}", String(task.days))}
                </span>
              )
            })}
          </div>
        </div>

        <ul data-part="legend">
          <li>
            <i /> {toneText.work ?? DEFAULT_TONES.work}
          </li>
          <li>
            <i data-tone="risk" /> {toneText.risk ?? DEFAULT_TONES.risk}
          </li>
          <li>
            <i data-tone="done" /> {toneText.done ?? DEFAULT_TONES.done}
          </li>
        </ul>

        <details data-part="table">
          <summary>{tableText}</summary>
          <table>
            <thead>
              <tr>
                <th scope="col">{columnText.task ?? DEFAULT_COLUMNS.task}</th>
                <th scope="col">{columnText.start ?? DEFAULT_COLUMNS.start}</th>
                <th scope="col">{columnText.end ?? DEFAULT_COLUMNS.end}</th>
                <th scope="col">{columnText.days ?? DEFAULT_COLUMNS.days}</th>
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

import type { ComponentProps, CSSProperties } from "react"

export type Gantt008Task = {
  title: string
  /** Номер первой колонки задачи, считая с единицы. */
  start: number
  /** Сколько колонок занимает задача. */
  span: number
  owner?: string
  done?: boolean
}

export type Gantt008Props = Omit<ComponentProps<"div">, "children"> & {
  title?: string
  days?: string[]
  tasks?: Gantt008Task[]
  /** Номер сегодняшней колонки, считая с единицы. */
  today?: number
  /** Подпись линии сегодняшнего дня. */
  todayLabel?: string
  /** Подпись просроченной задачи: она же читается диктором. */
  lateLabel?: string
  /** Строка под планом: {late} и {total}. Пустая строка убирает её. */
  summaryTemplate?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: план, который сам показывает отставание. Линия сегодняшнего
// дня проходит через все строки, и задача, чей срок остался слева от неё, но
// не закрыта, помечается просроченной — считать это глазами по датам дольше и
// ненадёжнее, чем увидеть одну красную полосу.
//
// Просрочка выводится из данных, а не задаётся флагом: расходиться со сроками
// ей тогда попросту негде.
const STYLES = `
:where([data-vibeui-block="gantt-008"]){
--vibeui-gantt-008-bg:transparent;
--vibeui-gantt-008-sticky:light-dark(oklch(0.995 0.001 265),oklch(0.19 0.008 265));
--vibeui-gantt-008-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-gantt-008-muted:color-mix(in oklab,var(--vibeui-gantt-008-fg) 66%,transparent);
--vibeui-gantt-008-border:light-dark(oklch(0.92 0.006 265),oklch(0.36 0.012 265));
--vibeui-gantt-008-line:light-dark(oklch(0.96 0.004 265),oklch(0.29 0.01 265));
--vibeui-gantt-008-accent:light-dark(oklch(0.55 0.2 262),oklch(0.73 0.16 262));
--vibeui-gantt-008-done:light-dark(oklch(0.58 0.14 152),oklch(0.76 0.13 152));
--vibeui-gantt-008-late:light-dark(oklch(0.55 0.2 25),oklch(0.75 0.16 25));
--vibeui-gantt-008-today:light-dark(oklch(0.55 0.2 262),oklch(0.75 0.16 262));
--vibeui-gantt-008-past:light-dark(oklch(0.55 0.02 265 / 5%),oklch(0.8 0.02 265 / 6%));
--vibeui-gantt-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="gantt-008"]{color-scheme:dark}
[data-vibeui-block="gantt-008"]{
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);box-sizing:border-box;overflow-x:auto;
background:var(--vibeui-gantt-008-bg);
border:1px solid var(--vibeui-gantt-008-border);border-radius:1rem;
font-family:var(--vibeui-gantt-008-font);color:var(--vibeui-gantt-008-fg);
container-type:inline-size;
}
[data-vibeui-block="gantt-008"] *{box-sizing:border-box}
[data-vibeui-block="gantt-008"] h3{
margin:0;padding:0.75rem 0.875rem 0.5rem;
font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
}
@container (min-width:32rem){
[data-vibeui-block="gantt-008"] h3{font-size:1rem;padding:0.875rem 1rem 0.5rem}
}
[data-vibeui-block="gantt-008"] [data-part="grid"]{
position:relative;display:grid;
grid-template-columns:9.5rem repeat(var(--vibeui-gantt-008-days,10),minmax(2.5rem,1fr));
min-width:32rem;
}
[data-vibeui-block="gantt-008"] [data-part="day"]{
padding:0.375rem 0.25rem;text-align:center;
border-top:1px solid var(--vibeui-gantt-008-border);
border-bottom:1px solid var(--vibeui-gantt-008-border);
font-size:0.6875rem;color:var(--vibeui-gantt-008-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="gantt-008"] [data-part="day"][data-today="true"]{
color:var(--vibeui-gantt-008-today);font-weight:700;
}
[data-vibeui-block="gantt-008"] [data-part="name"]{
position:sticky;left:0;z-index:2;
display:flex;flex-direction:column;gap:0.0625rem;justify-content:center;
padding:0.375rem 0.625rem;
background:var(--vibeui-gantt-008-sticky);
border-top:1px solid var(--vibeui-gantt-008-line);
font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="gantt-008"] [data-part="owner"]{
font-size:0.625rem;font-weight:400;color:var(--vibeui-gantt-008-muted);
}
[data-vibeui-block="gantt-008"] [data-part="cell"]{
border-top:1px solid var(--vibeui-gantt-008-line);
border-left:1px solid var(--vibeui-gantt-008-line);
min-height:2.25rem;
}
/* Прошедшие колонки притенены: граница «уже было» читается даже там, где
   линия сегодняшнего дня ушла за край прокрутки. */
[data-vibeui-block="gantt-008"] [data-part="cell"][data-past="true"]{
background:var(--vibeui-gantt-008-past);
}
[data-vibeui-block="gantt-008"] [data-part="bar"]{
position:relative;z-index:1;
align-self:center;margin:0.25rem;padding:0.1875rem 0.5rem;
display:flex;align-items:center;gap:0.375rem;
border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-gantt-008-accent) 16%,transparent);
border:1px solid var(--vibeui-gantt-008-accent);
font-size:0.625rem;line-height:1.4;white-space:nowrap;overflow:hidden;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="gantt-008"] [data-part="bar"][data-state="done"]{
background:color-mix(in oklab,var(--vibeui-gantt-008-done) 18%,transparent);
border-color:var(--vibeui-gantt-008-done);
}
/* Просрочка помечена и цветом, и штриховкой, и словом: одного цвета мало
   на печати и при дальтонизме. */
[data-vibeui-block="gantt-008"] [data-part="bar"][data-state="late"]{
background:repeating-linear-gradient(135deg,
color-mix(in oklab,var(--vibeui-gantt-008-late) 22%,transparent) 0 0.375rem,
color-mix(in oklab,var(--vibeui-gantt-008-late) 10%,transparent) 0.375rem 0.75rem);
border-color:var(--vibeui-gantt-008-late);
color:var(--vibeui-gantt-008-fg);
}
[data-vibeui-block="gantt-008"] [data-part="flag"]{
flex:none;padding:0 0.3125rem;border-radius:999px;
background:var(--vibeui-gantt-008-late);
color:light-dark(oklch(1 0 0),oklch(0.16 0.012 265));
font-size:0.5625rem;font-weight:700;letter-spacing:0.02em;text-transform:uppercase;
}
/* Линия сегодняшнего дня идёт через все строки: она стоит в своей колонке
   и растянута по всем рядам грида. */
[data-vibeui-block="gantt-008"] [data-part="today"]{
grid-row:1 / -1;justify-self:start;
inline-size:2px;margin-inline-start:-1px;
background:var(--vibeui-gantt-008-today);
opacity:0.55;pointer-events:none;
}
[data-vibeui-block="gantt-008"] [data-part="foot"]{
display:flex;flex-wrap:wrap;gap:0.375rem 0.875rem;
margin:0;padding:0.5rem 0.875rem 0.75rem;
font-size:0.75rem;color:var(--vibeui-gantt-008-muted);
}
[data-vibeui-block="gantt-008"] [data-part="reader"]{
position:absolute;inline-size:1px;block-size:1px;margin:-1px;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="gantt-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_DAYS = [
  "пн",
  "вт",
  "ср",
  "чт",
  "пт",
  "пн",
  "вт",
  "ср",
  "чт",
  "пт",
]

const DEFAULT_TASKS: Gantt008Task[] = [
  { title: "Сбор требований", start: 1, span: 2, owner: "Анна", done: true },
  { title: "Макеты экранов", start: 2, span: 3, owner: "Ким", done: true },
  { title: "Вёрстка каталога", start: 3, span: 3, owner: "Илья" },
  { title: "Интеграция поиска", start: 5, span: 3, owner: "Даша" },
  { title: "Тексты и переводы", start: 7, span: 2, owner: "Тимур" },
  { title: "Приёмка", start: 9, span: 2, owner: "Анна" },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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

function fillTemplate(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}

/**
 * План со шкалой дней, линией сегодняшнего дня и пометкой просроченных задач.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Gantt008({
  title = "Спринт",
  days = DEFAULT_DAYS,
  tasks = DEFAULT_TASKS,
  today = 6,
  todayLabel = "Сегодня",
  lateLabel = "просрочено",
  summaryTemplate = "Просрочено задач: {late} из {total}.",
  accent,
  background = "",
  className,
  style,
  ...props
}: Gantt008Props) {
  // Просрочка выводится из данных: задача не закрыта, а её последний день уже
  // позади. Отдельный флаг разошёлся бы со сроками при первой же правке.
  const state = (task: Gantt008Task) =>
    task.done ? "done" : task.start + task.span - 1 < today ? "late" : "work"

  const late = tasks.filter((task) => state(task) === "late").length

  const palette = {
    "--vibeui-gantt-008-days": String(days.length),
    ...(accent ? { "--vibeui-gantt-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-gantt-008-bg": background,
          "--vibeui-gantt-008-sticky": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-gantt-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="gantt"
        data-vibeui-block="gantt-008"
        role="group"
        aria-label={title}
        className={className}
        style={palette}
      >
        <h3>{title}</h3>
        <div data-part="grid">
          <span data-part="day" />
          {days.map((day, index) => (
            <span
              key={`${day}-${index}`}
              data-part="day"
              data-today={index + 1 === today ? "true" : undefined}
            >
              {day}
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
            days.map((day, column) => (
              <span
                key={`${task.title}-${day}-${column}`}
                data-part="cell"
                data-past={column + 1 < today ? "true" : undefined}
                style={
                  { gridRow: row + 2, gridColumn: column + 2 } as CSSProperties
                }
              />
            )),
          )}

          <span
            data-part="today"
            aria-hidden="true"
            style={{ gridColumn: today + 1 } as CSSProperties}
          />

          {tasks.map((task, row) => {
            const kind = state(task)

            return (
              <span
                key={`${task.title}-bar`}
                data-part="bar"
                data-state={kind}
                style={
                  {
                    gridRow: row + 2,
                    gridColumn: `${task.start + 1} / ${task.start + task.span + 1}`,
                  } as CSSProperties
                }
              >
                {kind === "late" ? (
                  <span data-part="flag">{lateLabel}</span>
                ) : null}
                <span data-part="reader">
                  {task.title}: {days[task.start - 1] ?? ""} —{" "}
                  {days[task.start + task.span - 2] ?? ""}
                </span>
              </span>
            )
          })}
        </div>
        <p data-part="foot">
          <span>
            {todayLabel}: {days[today - 1] ?? ""}
          </span>
          {summaryTemplate ? (
            <span>
              {fillTemplate(summaryTemplate, { late, total: tasks.length })}
            </span>
          ) : null}
        </p>
      </div>
    </>
  )
}

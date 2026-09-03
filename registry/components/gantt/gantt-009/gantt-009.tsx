import type { ComponentProps, CSSProperties } from "react"

export type Gantt009Task = {
  title: string
  /** Первая колонка по плану, считая с единицы. */
  planStart: number
  planSpan: number
  /** Первая колонка по факту. Пусто — работа ещё не начиналась. */
  factStart?: number
  factSpan?: number
}

export type Gantt009Props = Omit<ComponentProps<"div">, "children"> & {
  title?: string
  columns?: string[]
  tasks?: Gantt009Task[]
  planLabel?: string
  factLabel?: string
  /** Подпись отклонения: {days}. Знак подставляется сам. */
  driftTemplate?: string
  /** Строка про задачи без факта: {count}. Пустая строка убирает её. */
  waitingTemplate?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: план и факт одной строкой. Тонкая полоса сверху — как
// собирались, толстая снизу — как вышло; сдвиг между ними виден раньше, чем
// прочитано хоть одно число, а само отклонение подписано у края.
//
// Обе полосы стоят в одной ячейке грида и разведены по вертикали align-self:
// отдельные строки для плана и факта растянули бы таблицу вдвое и разорвали
// пару, которую как раз и нужно сравнивать.
const STYLES = `
:where([data-vibeui-block="gantt-009"]){
--vibeui-gantt-009-bg:transparent;
--vibeui-gantt-009-sticky:light-dark(oklch(0.995 0.001 265),oklch(0.19 0.008 265));
--vibeui-gantt-009-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-gantt-009-muted:color-mix(in oklab,var(--vibeui-gantt-009-fg) 66%,transparent);
--vibeui-gantt-009-border:light-dark(oklch(0.92 0.006 265),oklch(0.36 0.012 265));
--vibeui-gantt-009-line:light-dark(oklch(0.96 0.004 265),oklch(0.29 0.01 265));
--vibeui-gantt-009-accent:light-dark(oklch(0.55 0.2 262),oklch(0.73 0.16 262));
--vibeui-gantt-009-plan:color-mix(in oklab,var(--vibeui-gantt-009-fg) 42%,transparent);
--vibeui-gantt-009-ahead:light-dark(oklch(0.55 0.14 152),oklch(0.76 0.13 152));
--vibeui-gantt-009-behind:light-dark(oklch(0.55 0.2 25),oklch(0.75 0.16 25));
--vibeui-gantt-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="gantt-009"]{color-scheme:dark}
[data-vibeui-block="gantt-009"]{
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);box-sizing:border-box;overflow-x:auto;
background:var(--vibeui-gantt-009-bg);
border:1px solid var(--vibeui-gantt-009-border);border-radius:1rem;
font-family:var(--vibeui-gantt-009-font);color:var(--vibeui-gantt-009-fg);
container-type:inline-size;
}
[data-vibeui-block="gantt-009"] *{box-sizing:border-box}
[data-vibeui-block="gantt-009"] h3{
margin:0;padding:0.75rem 0.875rem 0.5rem;
font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
}
@container (min-width:32rem){
[data-vibeui-block="gantt-009"] h3{font-size:1rem;padding:0.875rem 1rem 0.5rem}
}
[data-vibeui-block="gantt-009"] [data-part="grid"]{
display:grid;
grid-template-columns:9.5rem repeat(var(--vibeui-gantt-009-columns,8),minmax(2.75rem,1fr));
min-width:32rem;
}
[data-vibeui-block="gantt-009"] [data-part="head"]{
padding:0.375rem 0.25rem;text-align:center;
border-top:1px solid var(--vibeui-gantt-009-border);
border-bottom:1px solid var(--vibeui-gantt-009-border);
font-size:0.6875rem;color:var(--vibeui-gantt-009-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="gantt-009"] [data-part="name"]{
position:sticky;left:0;z-index:2;
display:flex;flex-direction:column;gap:0.0625rem;justify-content:center;
padding:0.4375rem 0.625rem;
background:var(--vibeui-gantt-009-sticky);
border-top:1px solid var(--vibeui-gantt-009-line);
font-size:0.75rem;font-weight:600;
}
/* Отклонение подписано у имени, а не на полосе: на полосе в одну колонку
   для числа просто нет места. */
[data-vibeui-block="gantt-009"] [data-part="drift"]{
font-size:0.625rem;font-weight:650;font-variant-numeric:tabular-nums;
color:var(--vibeui-gantt-009-muted);
}
[data-vibeui-block="gantt-009"] [data-part="drift"][data-tone="behind"]{color:var(--vibeui-gantt-009-behind)}
[data-vibeui-block="gantt-009"] [data-part="drift"][data-tone="ahead"]{color:var(--vibeui-gantt-009-ahead)}
[data-vibeui-block="gantt-009"] [data-part="cell"]{
border-top:1px solid var(--vibeui-gantt-009-line);
border-left:1px solid var(--vibeui-gantt-009-line);
min-height:2.875rem;
}
/* План — тонкая полоса под верхним краем строки. */
[data-vibeui-block="gantt-009"] [data-part="plan"]{
align-self:start;margin:0.5rem 0.25rem 0;
block-size:0.375rem;border-radius:999px;
background:repeating-linear-gradient(90deg,
var(--vibeui-gantt-009-plan) 0 0.25rem,transparent 0.25rem 0.4375rem);
}
/* Факт — толстая полоса у нижнего края: пара читается как «было — стало». */
[data-vibeui-block="gantt-009"] [data-part="fact"]{
/* Позиционированный предок для скрытой расшифровки: иначе она уезжает от
   начала страницы и тянет за собой горизонтальную прокрутку. */
position:relative;
align-self:end;margin:0 0.25rem 0.5rem;
block-size:0.75rem;border-radius:999px;
background:color-mix(in oklab,var(--vibeui-gantt-009-accent) 62%,transparent);
}
[data-vibeui-block="gantt-009"] [data-part="fact"][data-tone="behind"]{
background:color-mix(in oklab,var(--vibeui-gantt-009-behind) 62%,transparent);
}
[data-vibeui-block="gantt-009"] [data-part="fact"][data-tone="ahead"]{
background:color-mix(in oklab,var(--vibeui-gantt-009-ahead) 62%,transparent);
}
[data-vibeui-block="gantt-009"] [data-part="legend"]{
display:flex;flex-wrap:wrap;gap:0.375rem 0.875rem;align-items:center;
margin:0;padding:0.5rem 0.875rem 0.75rem;
font-size:0.75rem;color:var(--vibeui-gantt-009-muted);
}
[data-vibeui-block="gantt-009"] [data-part="key"]{display:flex;align-items:center;gap:0.375rem}
[data-vibeui-block="gantt-009"] [data-part="swatch"]{
flex:none;inline-size:1.125rem;block-size:0.375rem;border-radius:999px;
background:repeating-linear-gradient(90deg,
var(--vibeui-gantt-009-plan) 0 0.25rem,transparent 0.25rem 0.4375rem);
}
[data-vibeui-block="gantt-009"] [data-part="swatch"][data-kind="fact"]{
block-size:0.75rem;
background:color-mix(in oklab,var(--vibeui-gantt-009-accent) 62%,transparent);
}
[data-vibeui-block="gantt-009"] [data-part="reader"]{
position:absolute;inline-size:1px;block-size:1px;margin:-1px;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="gantt-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS = [
  "1 нед",
  "2 нед",
  "3 нед",
  "4 нед",
  "5 нед",
  "6 нед",
  "7 нед",
  "8 нед",
]

const DEFAULT_TASKS: Gantt009Task[] = [
  { title: "Исследование", planStart: 1, planSpan: 2, factStart: 1, factSpan: 2 },
  { title: "Прототип", planStart: 2, planSpan: 2, factStart: 2, factSpan: 3 },
  { title: "Дизайн экранов", planStart: 3, planSpan: 2, factStart: 4, factSpan: 2 },
  { title: "Разработка", planStart: 4, planSpan: 3, factStart: 5, factSpan: 3 },
  { title: "Тестирование", planStart: 6, planSpan: 2, factStart: 7, factSpan: 1 },
  { title: "Запуск", planStart: 8, planSpan: 1 },
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
 * План и факт одной строкой: тонкая полоса плана, толстая полоса факта.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Gantt009({
  title = "План и факт",
  columns = DEFAULT_COLUMNS,
  tasks = DEFAULT_TASKS,
  planLabel = "План",
  factLabel = "Факт",
  driftTemplate = "{days} к плану",
  waitingTemplate = "Ещё не начато задач: {count}.",
  accent,
  background = "",
  className,
  style,
  ...props
}: Gantt009Props) {
  // Отклонение считается по концу работы: сдвиг начала сам по себе ничего не
  // значит, если задачу успели догнать.
  const driftOf = (task: Gantt009Task) => {
    if (!task.factStart || !task.factSpan) {
      return null
    }

    return (
      task.factStart + task.factSpan - (task.planStart + task.planSpan)
    )
  }

  const waiting = tasks.filter((task) => driftOf(task) === null).length

  const palette = {
    "--vibeui-gantt-009-columns": String(columns.length),
    ...(accent ? { "--vibeui-gantt-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-gantt-009-bg": background,
          "--vibeui-gantt-009-sticky": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-gantt-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="gantt"
        data-vibeui-block="gantt-009"
        role="group"
        aria-label={title}
        className={className}
        style={palette}
      >
        <h3>{title}</h3>
        <div data-part="grid">
          <span data-part="head" />
          {columns.map((column) => (
            <span key={column} data-part="head">
              {column}
            </span>
          ))}

          {tasks.map((task, row) => {
            const drift = driftOf(task)
            const tone =
              drift === null || drift === 0
                ? undefined
                : drift > 0
                  ? "behind"
                  : "ahead"

            return (
              <span
                key={task.title}
                data-part="name"
                style={{ gridRow: row + 2, gridColumn: 1 } as CSSProperties}
              >
                {task.title}
                {drift !== null && drift !== 0 ? (
                  <span data-part="drift" data-tone={tone}>
                    {fillTemplate(driftTemplate, {
                      days: `${drift > 0 ? "+" : "−"}${Math.abs(drift)}`,
                    })}
                  </span>
                ) : null}
              </span>
            )
          })}

          {tasks.map((task, row) =>
            columns.map((column, index) => (
              <span
                key={`${task.title}-${column}`}
                data-part="cell"
                style={
                  { gridRow: row + 2, gridColumn: index + 2 } as CSSProperties
                }
              />
            )),
          )}

          {tasks.map((task, row) => (
            <span
              key={`${task.title}-plan`}
              data-part="plan"
              aria-hidden="true"
              style={
                {
                  gridRow: row + 2,
                  gridColumn: `${task.planStart + 1} / ${task.planStart + task.planSpan + 1}`,
                } as CSSProperties
              }
            />
          ))}

          {tasks.map((task, row) => {
            if (!task.factStart || !task.factSpan) {
              return null
            }

            const drift = driftOf(task)

            return (
              <span
                key={`${task.title}-fact`}
                data-part="fact"
                data-tone={
                  drift === null || drift === 0
                    ? undefined
                    : drift > 0
                      ? "behind"
                      : "ahead"
                }
                style={
                  {
                    gridRow: row + 2,
                    gridColumn: `${task.factStart + 1} / ${task.factStart + task.factSpan + 1}`,
                  } as CSSProperties
                }
              >
                <span data-part="reader">
                  {task.title}, {factLabel}: {columns[task.factStart - 1] ?? ""}{" "}
                  — {columns[task.factStart + task.factSpan - 2] ?? ""}
                </span>
              </span>
            )
          })}
        </div>
        <p data-part="legend">
          <span data-part="key">
            <span data-part="swatch" aria-hidden="true" />
            {planLabel}
          </span>
          <span data-part="key">
            <span data-part="swatch" data-kind="fact" aria-hidden="true" />
            {factLabel}
          </span>
          {waitingTemplate && waiting > 0 ? (
            <span>{fillTemplate(waitingTemplate, { count: waiting })}</span>
          ) : null}
        </p>
      </div>
    </>
  )
}

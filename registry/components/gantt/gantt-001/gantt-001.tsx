import type { ComponentProps, CSSProperties } from "react"

export type Gantt001Task = {
  title: string
  start: number
  span: number
  tone?: "plan" | "work" | "done"
  owner?: string
}

export type Gantt001Props = Omit<ComponentProps<"div">, "children"> & {
  title?: string
  weeks?: string[]
  tasks?: Gantt001Task[]
  /** Срок внутри полосы: {from} и {to} — подписи первой и последней недели. */
  rangeText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: план работ полосами по неделям. Полоса занимает колонки
// грида от начала до конца, поэтому длительность задаётся разметкой, а не
// пересчётом в проценты. Названия задач стоят в первой колонке и не уезжают
// при прокрутке вправо: план читают по строкам, а не по датам. Состояние
// различается заливкой и рамкой одновременно — на печати и при дальтонизме
// одного цвета мало. Сроки продублированы текстом внутри строки.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="gantt-001"]){
--vibeui-gantt-001-bg:transparent;
--vibeui-gantt-001-sticky:light-dark(oklch(0.995 0.001 265),oklch(0.19 0.008 265));
--vibeui-gantt-001-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-gantt-001-muted:color-mix(in oklab,var(--vibeui-gantt-001-fg) 68%,transparent);
--vibeui-gantt-001-border:light-dark(oklch(0.92 0.006 265),oklch(0.36 0.012 265));
--vibeui-gantt-001-line:light-dark(oklch(0.96 0.004 265),oklch(0.29 0.01 265));
--vibeui-gantt-001-accent:light-dark(oklch(0.55 0.2 262),oklch(0.73 0.16 262));
--vibeui-gantt-001-done:light-dark(oklch(0.58 0.14 152),oklch(0.76 0.13 152));
--vibeui-gantt-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="gantt-001"]{color-scheme:dark}
[data-vibeui-block="gantt-001"]{
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);box-sizing:border-box;overflow-x:auto;
background:var(--vibeui-gantt-001-bg);
border:1px solid var(--vibeui-gantt-001-border);border-radius:1rem;
font-family:var(--vibeui-gantt-001-font);color:var(--vibeui-gantt-001-fg);
/* Шкала кегля растёт от собственной ширины блока, а не от окна. */
container-type:inline-size;
}
[data-vibeui-block="gantt-001"] *{box-sizing:border-box}
[data-vibeui-block="gantt-001"] h3{margin:0;padding:0.75rem 0.875rem;font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em}
@container (min-width:32rem){
[data-vibeui-block="gantt-001"] h3{font-size:1rem;padding:0.875rem 1rem}
}
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
background:var(--vibeui-gantt-001-sticky);
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
background:color-mix(in oklab,var(--vibeui-gantt-001-accent) 16%,transparent);
border:1px solid var(--vibeui-gantt-001-accent);
color:var(--vibeui-gantt-001-fg);
font-size:0.625rem;line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="gantt-001"] [data-tone="plan"]{
background:color-mix(in oklab,var(--vibeui-gantt-001-muted) 12%,transparent);
border-style:dashed;border-color:var(--vibeui-gantt-001-muted);
}
[data-vibeui-block="gantt-001"] [data-tone="done"]{
background:color-mix(in oklab,var(--vibeui-gantt-001-done) 18%,transparent);
border-color:var(--vibeui-gantt-001-done);
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
 * План работ полосами по неделям: длительность задаётся колонками грида.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Gantt001({
  title = "План работ",
  weeks = DEFAULT_WEEKS,
  tasks = DEFAULT_TASKS,
  rangeText = "{from} — {to}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Gantt001Props) {
  // Липкая колонка названий закрывает собой ячейки при прокрутке, поэтому
  // её подложка едет вместе с фоном компонента.
  const palette = {
    "--vibeui-gantt-001-weeks": weeks.length,
    ...(accent ? { "--vibeui-gantt-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-gantt-001-bg": background,
          "--vibeui-gantt-001-sticky": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-gantt-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="gantt"
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
              {rangeText
                .replace("{from}", weeks[task.start - 1] ?? "")
                .replace("{to}", weeks[task.start + task.span - 2] ?? "")}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}

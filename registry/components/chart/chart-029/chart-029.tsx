import type { ComponentProps, CSSProperties } from "react"

export type Chart029Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  /** Недели слева направо, в каждой семь уровней 0…4 сверху вниз. */
  weeks?: number[][]
  /** Подписи месяцев над лентой: столько же, сколько отрезков по 4–5 недель. */
  months?: string[]
  /** Подписи дней слева: показываются через один, как в исходной ленте. */
  days?: string[]
  /** Подпись под лентой: {count}. */
  unitLabel?: string
  lessLabel?: string
  moreLabel?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: год одной лентой. Каждая клетка — день, столбец — неделя,
// и вопрос к такому графику не «сколько именно», а «где были провалы и
// сколько держится серия»: на это отвечает плотность, а не числа.
//
// Уровень задаётся числом 0…4, а не самим значением: пять ступеней различимы
// глазом, непрерывная шкала на клетке 10×10 — уже нет.
const STYLES = `
:where([data-vibeui-block="chart-029"]){
--vibeui-chart-029-bg:transparent;
--vibeui-chart-029-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-chart-029-muted:color-mix(in oklab,var(--vibeui-chart-029-fg) 64%,transparent);
--vibeui-chart-029-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-chart-029-empty:light-dark(oklch(0.94 0.004 265),oklch(0.29 0.01 265));
--vibeui-chart-029-accent:light-dark(oklch(0.55 0.17 152),oklch(0.72 0.15 152));
--vibeui-chart-029-cell:0.75rem;
--vibeui-chart-029-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-029"]{color-scheme:dark}
[data-vibeui-block="chart-029"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:34rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-029-bg);
border:1px solid var(--vibeui-chart-029-border);border-radius:0.875rem;
color:var(--vibeui-chart-029-fg);font-family:var(--vibeui-chart-029-font);
}
[data-vibeui-block="chart-029"] *{box-sizing:border-box}
[data-vibeui-block="chart-029"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
/* Лента прокручивается внутри себя: год клеток шире телефона, и обрезать её
   лучше здесь, чем растягивать страницу. */
[data-vibeui-block="chart-029"] [data-part="scroll"]{
overflow-x:auto;overscroll-behavior-x:contain;
padding-bottom:0.125rem;
}
[data-vibeui-block="chart-029"] [data-part="board"]{
display:grid;grid-template-columns:auto 1fr;gap:0.25rem 0.375rem;
min-width:max-content;
}
[data-vibeui-block="chart-029"] [data-part="months"]{
grid-column:2;
display:flex;gap:0.125rem;
font-size:0.6875rem;color:var(--vibeui-chart-029-muted);
}
[data-vibeui-block="chart-029"] [data-part="month"]{flex:1 1 0;min-width:0}
[data-vibeui-block="chart-029"] [data-part="days"]{
display:grid;grid-template-rows:repeat(7,var(--vibeui-chart-029-cell));
gap:0.125rem;align-content:start;
margin:0;padding:0;list-style:none;
font-size:0.625rem;line-height:var(--vibeui-chart-029-cell);
color:var(--vibeui-chart-029-muted);
}
[data-vibeui-block="chart-029"] [data-part="grid"]{
display:grid;grid-auto-flow:column;
grid-template-rows:repeat(7,var(--vibeui-chart-029-cell));
gap:0.125rem;
}
[data-vibeui-block="chart-029"] [data-part="cell"]{
width:var(--vibeui-chart-029-cell);height:var(--vibeui-chart-029-cell);
border-radius:0.1875rem;background:var(--vibeui-chart-029-empty);
}
/* Ступени задаются прозрачностью акцента: перекрасить весь график можно одной
   переменной, и цвет остаётся согласованным на любом фоне. */
[data-vibeui-block="chart-029"] [data-part="cell"][data-level="1"]{background:color-mix(in oklab,var(--vibeui-chart-029-accent) 28%,transparent)}
[data-vibeui-block="chart-029"] [data-part="cell"][data-level="2"]{background:color-mix(in oklab,var(--vibeui-chart-029-accent) 52%,transparent)}
[data-vibeui-block="chart-029"] [data-part="cell"][data-level="3"]{background:color-mix(in oklab,var(--vibeui-chart-029-accent) 76%,transparent)}
[data-vibeui-block="chart-029"] [data-part="cell"][data-level="4"]{background:var(--vibeui-chart-029-accent)}
[data-vibeui-block="chart-029"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
flex-wrap:wrap;
font-size:0.75rem;color:var(--vibeui-chart-029-muted);
}
[data-vibeui-block="chart-029"] [data-part="scale"]{display:flex;align-items:center;gap:0.25rem}
[data-vibeui-block="chart-029"] [data-part="unit"]{margin:0;min-width:0}
[data-vibeui-block="chart-029"] [data-part="data"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-029"] *{animation:none!important;transition:none!important}}
`

// Дефолтная лента считается формулой, а не выписана числами: тридцать недель
// по семь дней — это двести с лишним значений, которые нечитаемы в исходнике
// и ничего не объясняют. Формула даёт спады по выходным и летнюю просадку.
const DEFAULT_WEEKS = Array.from({ length: 30 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => {
    const weekend = day >= 5 ? 1.6 : 0
    const season = Math.sin((week / 30) * Math.PI * 2) * 1.1
    const noise = Math.sin(week * 2.7 + day * 1.9) * 1.2
    const level = Math.round(2.1 + season + noise - weekend)

    return Math.min(4, Math.max(0, level))
  }),
)

const DEFAULT_MONTHS = [
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
]
const DEFAULT_DAYS = ["Пн", "", "Ср", "", "Пт", "", "Вс"]

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

function fillTemplate(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}

/**
 * Лента активности: год днями, где столбец — неделя.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart029({
  title = "Активность за полгода",
  weeks = DEFAULT_WEEKS,
  months = DEFAULT_MONTHS,
  days = DEFAULT_DAYS,
  unitLabel = "Дней в ленте: {count}. Насыщенность клетки — уровень активности от нуля до четырёх.",
  lessLabel = "реже",
  moreLabel = "чаще",
  accent,
  background = "",
  className,
  style,
  ...props
}: Chart029Props) {
  const total = weeks.reduce((sum, week) => sum + week.length, 0)
  const active = weeks.reduce(
    (sum, week) => sum + week.filter((level) => level > 0).length,
    0,
  )

  const palette = {
    ...(accent ? { "--vibeui-chart-029-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-chart-029-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-029" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="chart"
        data-vibeui-block="chart-029"
        className={className}
        style={palette}
      >
        <figcaption data-part="title">{title}</figcaption>
        <div data-part="scroll">
          <div data-part="board">
            <p data-part="months" aria-hidden="true">
              {months.map((month) => (
                <span key={month} data-part="month">
                  {month}
                </span>
              ))}
            </p>
            <ul data-part="days" aria-hidden="true">
              {days.map((day, index) => (
                <li key={day || `blank-${index}`}>{day}</li>
              ))}
            </ul>
            <div data-part="grid" aria-hidden="true">
              {weeks.map((week, weekIndex) =>
                week.map((level, dayIndex) => (
                  <span
                    key={`${weekIndex}-${dayIndex}`}
                    data-part="cell"
                    data-level={level || undefined}
                  />
                )),
              )}
            </div>
          </div>
        </div>
        <div data-part="foot">
          <p data-part="unit">{fillTemplate(unitLabel, { count: total })}</p>
          <span data-part="scale" aria-hidden="true">
            {lessLabel}
            {[0, 1, 2, 3, 4].map((level) => (
              <span
                key={level}
                data-part="cell"
                data-level={level || undefined}
              />
            ))}
            {moreLabel}
          </span>
        </div>
        <div data-part="data">
          <table>
            <caption>{title}</caption>
            <tbody>
              <tr>
                <th scope="row">Дней всего</th>
                <td>{total}</td>
              </tr>
              <tr>
                <th scope="row">Дней с активностью</th>
                <td>{active}</td>
              </tr>
              <tr>
                <th scope="row">Недель в ленте</th>
                <td>{weeks.length}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </figure>
    </>
  )
}

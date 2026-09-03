import type { ComponentProps, CSSProperties } from "react"

export type Chart015Period = {
  label: string
  values: number[]
}

export type Chart015Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  series?: string[]
  periods?: Chart015Period[]
  unit?: string
  /** Подпись под графиком: {unit} и {max}. */
  unitLabel?: string
  /** Заголовки скрытой таблицы: ключи period и total. */
  tableText?: Record<string, string>
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: столбцы, разложенные на слои. Высота всего столбца
// отвечает «сколько всего», а доли внутри — «из чего». Слои складываются
// флексом от суммы, а не пересчитываются в пиксели, поэтому высота области
// меняется одной переменной и ничего не ломает.
//
// Тема берётся из color-scheme окружения через light-dark(): столбцы темнеют
// вместе со страницей и не носят собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="chart-015"]){
--vibeui-chart-015-bg:transparent;
--vibeui-chart-015-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-chart-015-muted:color-mix(in oklab,var(--vibeui-chart-015-fg) 68%,transparent);
--vibeui-chart-015-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-chart-015-track:light-dark(oklch(0.96 0.004 265),oklch(0.28 0.01 265));
--vibeui-chart-015-height:9rem;
--vibeui-chart-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-015"]{color-scheme:dark}
[data-vibeui-block="chart-015"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:30rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-015-bg);
border:1px solid var(--vibeui-chart-015-border);border-radius:0.875rem;
color:var(--vibeui-chart-015-fg);font-family:var(--vibeui-chart-015-font);
}
[data-vibeui-block="chart-015"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="chart-015"] [data-part="plot"]{
display:flex;align-items:flex-end;gap:0.5rem;height:var(--vibeui-chart-015-height);
padding-bottom:0.25rem;border-bottom:1px solid var(--vibeui-chart-015-border);
}
[data-vibeui-block="chart-015"] [data-part="column"]{
flex:1 1 0;display:flex;flex-direction:column;justify-content:flex-end;height:100%;
}
/* Слои идут снизу вверх, поэтому column-reverse: первый ряд серии остаётся
   у основания и не прыгает между периодами. */
[data-vibeui-block="chart-015"] [data-part="stack"]{
display:flex;flex-direction:column-reverse;width:100%;border-radius:0.25rem;overflow:hidden;
background:var(--vibeui-chart-015-track);
}
[data-vibeui-block="chart-015"] [data-part="layer"]{
min-height:2px;background:var(--vibeui-chart-015-layer);
}
[data-vibeui-block="chart-015"] [data-part="axis"]{
display:flex;gap:0.5rem;margin:0;padding:0;list-style:none;
font-size:0.6875rem;color:var(--vibeui-chart-015-muted);
}
[data-vibeui-block="chart-015"] [data-part="axis"] li{flex:1 1 0;text-align:center}
[data-vibeui-block="chart-015"] [data-part="legend"]{
display:flex;flex-wrap:wrap;gap:0.25rem 0.875rem;margin:0;padding:0;list-style:none;
font-size:0.75rem;
}
[data-vibeui-block="chart-015"] [data-part="legend"] li{display:flex;align-items:center;gap:0.375rem}
[data-vibeui-block="chart-015"] [data-part="chip"]{
width:0.625rem;height:0.625rem;border-radius:2px;background:var(--vibeui-chart-015-layer);
}
[data-vibeui-block="chart-015"] [data-part="unit"]{margin:0;font-size:0.75rem;color:var(--vibeui-chart-015-muted)}
[data-vibeui-block="chart-015"] [data-part="data"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SERIES = ["Новые", "Повторные", "Партнёрские"]

const DEFAULT_PERIODS: Chart015Period[] = [
  { label: "Май", values: [42, 28, 12] },
  { label: "Июн", values: [51, 30, 14] },
  { label: "Июл", values: [46, 36, 18] },
  { label: "Авг", values: [58, 41, 15] },
  { label: "Сен", values: [64, 44, 22] },
]

const HUES = [265, 200, 150, 40, 320]

const TABLE_TEXT: Record<string, string> = {
  period: "Период",
  total: "Всего",
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

function fillTemplate(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}

/**
 * Стековые столбцы с легендой серий и общей шкалой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart015({
  title = "Заказы по источникам",
  series = DEFAULT_SERIES,
  periods = DEFAULT_PERIODS,
  unit = "заказов в месяц",
  unitLabel = "Единица измерения: {unit}. Максимум столбца — {max}.",
  tableText = TABLE_TEXT,
  accent,
  background = "",
  className,
  style,
  ...props
}: Chart015Props) {
  const totals = periods.map((period) =>
    period.values.reduce((sum, value) => sum + value, 0),
  )
  const max = Math.max(...totals, 1)

  const tone = (index: number) =>
    accent && index === 0
      ? accent
      : `oklch(${0.5 + index * 0.09} ${0.15 - index * 0.03} ${HUES[index % HUES.length]})`

  const palette = {
    ...(accent ? { "--vibeui-chart-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-chart-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-015" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="chart"
        data-vibeui-block="chart-015"
        className={className}
        style={palette}
      >
        <figcaption data-part="title">{title}</figcaption>
        <div data-part="plot" aria-hidden="true">
          {periods.map((period, periodIndex) => (
            <div key={period.label} data-part="column">
              <div
                data-part="stack"
                style={{ height: `${(totals[periodIndex] / max) * 100}%` }}
              >
                {period.values.map((value, seriesIndex) => (
                  <span
                    key={series[seriesIndex] ?? seriesIndex}
                    data-part="layer"
                    style={
                      {
                        flexGrow: value,
                        flexBasis: 0,
                        "--vibeui-chart-015-layer": tone(seriesIndex),
                      } as CSSProperties
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <ul data-part="axis" aria-hidden="true">
          {periods.map((period) => (
            <li key={period.label}>{period.label}</li>
          ))}
        </ul>
        <ul data-part="legend">
          {series.map((name, index) => (
            <li key={name}>
              <span
                data-part="chip"
                aria-hidden="true"
                style={
                  { "--vibeui-chart-015-layer": tone(index) } as CSSProperties
                }
              />
              {name}
            </li>
          ))}
        </ul>
        <p data-part="unit">{fillTemplate(unitLabel, { unit, max })}</p>
        <div data-part="data">
          <table>
            <caption>
              {title}, {unit}
            </caption>
            <thead>
              <tr>
                <th scope="col">{tableText.period ?? TABLE_TEXT.period}</th>
                {series.map((name) => (
                  <th key={name} scope="col">
                    {name}
                  </th>
                ))}
                <th scope="col">{tableText.total ?? TABLE_TEXT.total}</th>
              </tr>
            </thead>
            <tbody>
              {periods.map((period, periodIndex) => (
                <tr key={period.label}>
                  <th scope="row">{period.label}</th>
                  {period.values.map((value, seriesIndex) => (
                    <td key={series[seriesIndex] ?? seriesIndex}>{value}</td>
                  ))}
                  <td>{totals[periodIndex]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>
    </>
  )
}

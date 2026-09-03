import { Fragment } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Chart021Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  days?: string[]
  hours?: number[]
  matrix?: number[][]
  unit?: string
  /** Подпись под картой: {unit} и {max}. */
  unitLabel?: string
  /** Края шкалы насыщенности: ключи less и more. */
  scaleText?: Record<string, string>
  /** Заголовок первого столбца скрытой таблицы. */
  rowHeader?: string
  /** Час в шапке скрытой таблицы: {hour}. */
  hourLabel?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: тепловая карта «день недели × время суток». Насыщенность
// клетки считается через color-mix от доли максимума, поэтому шкала остаётся
// одной переменной акцента. Клетки — сетка, а не таблица с рамками: сетке
// не нужны отступы, и карта не рассыпается на узкой ширине.
//
// Тема берётся из color-scheme окружения через light-dark(): карта темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="chart-021"]){
--vibeui-chart-021-bg:transparent;
--vibeui-chart-021-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-chart-021-muted:color-mix(in oklab,var(--vibeui-chart-021-fg) 68%,transparent);
--vibeui-chart-021-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-chart-021-empty:light-dark(oklch(0.96 0.003 265),oklch(0.27 0.008 265));
--vibeui-chart-021-accent:light-dark(oklch(0.52 0.16 245),oklch(0.68 0.15 245));
--vibeui-chart-021-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-021"]{color-scheme:dark}
[data-vibeui-block="chart-021"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:30rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-021-bg);
border:1px solid var(--vibeui-chart-021-border);border-radius:0.875rem;
color:var(--vibeui-chart-021-fg);font-family:var(--vibeui-chart-021-font);
}
[data-vibeui-block="chart-021"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="chart-021"] [data-part="map"]{
display:grid;grid-template-columns:1.75rem repeat(var(--vibeui-chart-021-cols),1fr);
gap:2px;align-items:center;
}
[data-vibeui-block="chart-021"] [data-part="day"]{
font-size:0.6875rem;color:var(--vibeui-chart-021-muted);
}
[data-vibeui-block="chart-021"] [data-part="cell"]{
aspect-ratio:1;border-radius:2px;min-height:0.75rem;
background:color-mix(in oklab,var(--vibeui-chart-021-accent) calc(var(--vibeui-chart-021-level) * 100%),var(--vibeui-chart-021-empty));
}
[data-vibeui-block="chart-021"] [data-part="hours"]{
display:grid;grid-template-columns:1.75rem repeat(var(--vibeui-chart-021-cols),1fr);
gap:2px;margin:0;padding:0;list-style:none;
font-size:0.625rem;color:var(--vibeui-chart-021-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-021"] [data-part="hour"]{text-align:center}
[data-vibeui-block="chart-021"] [data-part="scale"]{
display:flex;align-items:center;gap:0.3125rem;font-size:0.6875rem;color:var(--vibeui-chart-021-muted);
}
[data-vibeui-block="chart-021"] [data-part="step"]{
width:0.75rem;height:0.75rem;border-radius:2px;
background:color-mix(in oklab,var(--vibeui-chart-021-accent) calc(var(--vibeui-chart-021-level) * 100%),var(--vibeui-chart-021-empty));
}
[data-vibeui-block="chart-021"] [data-part="unit"]{margin:0;font-size:0.75rem;color:var(--vibeui-chart-021-muted)}
[data-vibeui-block="chart-021"] [data-part="data"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-021"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
const DEFAULT_HOURS = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]

const DEFAULT_MATRIX = [
  [2, 1, 1, 4, 18, 34, 41, 38, 44, 29, 14, 6],
  [1, 1, 2, 6, 21, 38, 46, 42, 48, 31, 16, 7],
  [2, 1, 1, 5, 19, 36, 44, 45, 47, 33, 18, 8],
  [1, 0, 2, 7, 24, 41, 52, 49, 51, 35, 19, 9],
  [3, 1, 2, 6, 22, 39, 47, 43, 40, 27, 21, 12],
  [5, 3, 2, 3, 9, 15, 22, 26, 24, 22, 18, 11],
  [4, 2, 1, 2, 7, 12, 18, 21, 23, 25, 20, 9],
]

const SCALE_TEXT: Record<string, string> = {
  less: "реже",
  more: "чаще",
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
 * Тепловая карта активности «день недели × время суток».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart021({
  title = "Активность за неделю",
  days = DEFAULT_DAYS,
  hours = DEFAULT_HOURS,
  matrix = DEFAULT_MATRIX,
  unit = "сессий в двухчасовом интервале",
  unitLabel = "Единица измерения: {unit}. Максимум клетки — {max}.",
  scaleText = SCALE_TEXT,
  rowHeader = "День",
  hourLabel = "{hour}:00",
  accent,
  background = "",
  className,
  style,
  ...props
}: Chart021Props) {
  const max = Math.max(...matrix.flat(), 1)

  const palette = {
    ...(accent ? { "--vibeui-chart-021-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-chart-021-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    "--vibeui-chart-021-cols": String(hours.length),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-021" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="chart"
        data-vibeui-block="chart-021"
        className={className}
        style={palette}
      >
        <figcaption data-part="title">{title}</figcaption>
        <div data-part="map" aria-hidden="true">
          {days.map((day, dayIndex) => (
            <Fragment key={day}>
              <span data-part="day">{day}</span>
              {hours.map((hour, hourIndex) => (
                <span
                  key={hour}
                  data-part="cell"
                  style={
                    {
                      "--vibeui-chart-021-level": (
                        (matrix[dayIndex]?.[hourIndex] ?? 0) / max
                      ).toFixed(3),
                    } as CSSProperties
                  }
                />
              ))}
            </Fragment>
          ))}
        </div>
        <ul data-part="hours" aria-hidden="true">
          <li />
          {hours.map((hour, index) => (
            <li key={hour} data-part="hour">
              {index % 2 === 0 ? hour : ""}
            </li>
          ))}
        </ul>
        <p data-part="scale">
          {scaleText.less ?? SCALE_TEXT.less}
          {[0.05, 0.3, 0.55, 0.8, 1].map((level) => (
            <span
              key={level}
              data-part="step"
              aria-hidden="true"
              style={
                { "--vibeui-chart-021-level": String(level) } as CSSProperties
              }
            />
          ))}
          {scaleText.more ?? SCALE_TEXT.more}
        </p>
        <p data-part="unit">{fillTemplate(unitLabel, { unit, max })}</p>
        <table data-part="data">
          <caption>
            {title}, {unit}
          </caption>
          <thead>
            <tr>
              <th scope="col">{rowHeader}</th>
              {hours.map((hour) => (
                <th key={hour} scope="col">
                  {fillTemplate(hourLabel, { hour })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day, dayIndex) => (
              <tr key={day}>
                <th scope="row">{day}</th>
                {hours.map((hour, hourIndex) => (
                  <td key={hour}>{matrix[dayIndex]?.[hourIndex] ?? 0}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </figure>
    </>
  )
}

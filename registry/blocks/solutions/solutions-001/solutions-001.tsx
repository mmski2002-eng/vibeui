import type { CSSProperties } from "react"

export type Solutions001Row = {
  source: string
  visits: string
  share: number
  delta?: string
  trend?: "up" | "down" | "flat"
}

export type Solutions001Props = {
  title?: string
  period?: string
  total?: string
  totalDelta?: string
  points?: number[]
  rows?: Solutions001Row[]
  /** Шапка таблицы: ключи source, visits, share, trend. */
  columnText?: Record<string, string>
  /** Подписи краёв оси: начало и конец периода. */
  axisText?: string[]
  /** Строка итога: ключи label, share, delta. */
  totalRowText?: Record<string, string>
  /** Подпись графика для скринридера, {from} и {to} — крайние точки. */
  chartLabelText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: аналитика посещений. График с заливкой построен одной полилинией
// и полигоном в SVG: никакой библиотеки, а viewBox с preserveAspectRatio="none"
// тянет его под любую ширину. Ось X подписана только краями — промежуточные
// подписи в узкой колонке слипаются и врут о частоте измерений. Доли в таблице
// нарисованы фоном ячейки, а сумма считается из строк: заданная отдельно, она
// расходится с таблицей после первой правки данных.
const STYLES = `
:where([data-vibeui-block="solutions-001"]){
--vibeui-solutions-001-bg:transparent;
--vibeui-solutions-001-panel:light-dark(oklch(0.985 0 265),oklch(0.27 0 265));
--vibeui-solutions-001-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-solutions-001-muted:light-dark(oklch(0.55 0 265),oklch(0.7 0 265));
--vibeui-solutions-001-border:light-dark(oklch(0.91 0 265),oklch(0.35 0 265));
--vibeui-solutions-001-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.73 0.17 39.8));
--vibeui-solutions-001-up:light-dark(oklch(0.58 0.14 152),oklch(0.76 0.14 152));
--vibeui-solutions-001-down:light-dark(oklch(0.57 0.19 25),oklch(0.73 0.16 25));
--vibeui-solutions-001-bar:light-dark(oklch(0.55 0.2 39.8 / 14%),oklch(0.73 0.17 39.8 / 22%));
--vibeui-solutions-001-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="solutions-001"]{color-scheme:dark}
[data-vibeui-block="solutions-001"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;padding:1rem;
background:var(--vibeui-solutions-001-bg);
border:1px solid var(--vibeui-solutions-001-border);border-radius:1rem;
font-family:var(--vibeui-solutions-001-sans);color:var(--vibeui-solutions-001-fg);
}
[data-vibeui-block="solutions-001"] *{box-sizing:border-box}
[data-vibeui-block="solutions-001"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;
gap:0.5rem;margin-bottom:0.75rem;
}
[data-vibeui-block="solutions-001"] h2{margin:0;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-001"] [data-part="period"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-001-muted)}
[data-vibeui-block="solutions-001"] [data-part="total"]{
display:flex;align-items:baseline;gap:0.5rem;margin:0 0 0.5rem;
}
[data-vibeui-block="solutions-001"] [data-part="value"]{
font-size:1.75rem;font-weight:700;line-height:1;letter-spacing:-0.02em;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-001"] [data-part="delta"]{font-size:0.75rem;font-weight:650;color:var(--vibeui-solutions-001-up)}
/* График — полилиния и полигон: библиотека ради одной кривой не нужна. */
[data-vibeui-block="solutions-001"] svg{display:block;width:100%;height:7rem;overflow:visible}
[data-vibeui-block="solutions-001"] [data-part="area"]{fill:var(--vibeui-solutions-001-bar);stroke:none}
[data-vibeui-block="solutions-001"] [data-part="line"]{
fill:none;stroke:var(--vibeui-solutions-001-accent);stroke-width:2;
stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke;
}
/* Подписаны только края оси: промежуточные в узкой колонке слипаются. */
[data-vibeui-block="solutions-001"] [data-part="axis"]{
display:flex;justify-content:space-between;margin:0.25rem 0 0.875rem;
font-size:0.6875rem;color:var(--vibeui-solutions-001-muted);
}
[data-vibeui-block="solutions-001"] [data-part="tablewrap"]{overflow-x:auto}
[data-vibeui-block="solutions-001"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="solutions-001"] th,
[data-vibeui-block="solutions-001"] td{
padding:0.375rem 0.5rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-solutions-001-border);
}
[data-vibeui-block="solutions-001"] th{
padding-top:0;border-top:0;
font-size:0.6875rem;font-weight:600;letter-spacing:0.03em;text-transform:uppercase;
color:var(--vibeui-solutions-001-muted);
}
[data-vibeui-block="solutions-001"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
/* Доля — фон ячейки: ещё один график ради пяти строк не нужен. */
[data-vibeui-block="solutions-001"] [data-part="share"]{
min-width:6rem;
background:linear-gradient(to right,var(--vibeui-solutions-001-bar) var(--vibeui-solutions-001-fill),transparent var(--vibeui-solutions-001-fill));
}
[data-vibeui-block="solutions-001"] [data-trend="down"]{color:var(--vibeui-solutions-001-down)}
[data-vibeui-block="solutions-001"] [data-trend="up"]{color:var(--vibeui-solutions-001-up)}
[data-vibeui-block="solutions-001"] tfoot td{font-weight:650;background:var(--vibeui-solutions-001-panel)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_POINTS = [28, 34, 31, 46, 42, 58, 54, 71, 68, 84, 92, 88]

const DEFAULT_ROWS: Solutions001Row[] = [
  { source: "Поиск", visits: "18 402", share: 46, delta: "+12 %", trend: "up" },
  {
    source: "Прямые заходы",
    visits: "7 118",
    share: 18,
    delta: "+3 %",
    trend: "up",
  },
  {
    source: "Соцсети",
    visits: "6 940",
    share: 17,
    delta: "−8 %",
    trend: "down",
  },
  { source: "Письма", visits: "4 233", share: 11, delta: "+21 %", trend: "up" },
  {
    source: "Реклама",
    visits: "3 211",
    share: 8,
    delta: "−2 %",
    trend: "down",
  },
]

const DEFAULT_COLUMN_TEXT: Record<string, string> = {
  source: "Источник",
  visits: "Визиты",
  share: "Доля",
  trend: "Динамика",
}

const DEFAULT_AXIS_TEXT = ["8 марта", "14 марта"]

const DEFAULT_TOTAL_ROW_TEXT: Record<string, string> = {
  label: "Всего",
  share: "100 %",
  delta: "+14 %",
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

function shape(points: number[]) {
  const max = Math.max(...points, 1)
  const step = 100 / Math.max(points.length - 1, 1)
  return points
    .map(
      (point, index) =>
        `${(index * step).toFixed(2)},${(100 - (point / max) * 90).toFixed(2)}`,
    )
    .join(" ")
}

/**
 * Аналитика посещений: график с заливкой и таблица источников с долями.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions001({
  title = "Посещения",
  period = "8–14 марта",
  total = "39 904",
  totalDelta = "+14 % к прошлой неделе",
  points = DEFAULT_POINTS,
  rows = DEFAULT_ROWS,
  columnText = DEFAULT_COLUMN_TEXT,
  axisText = DEFAULT_AXIS_TEXT,
  totalRowText = DEFAULT_TOTAL_ROW_TEXT,
  chartLabelText = "Посещения по дням: от {from} до {to}",
  accent,
  background = "",
  className,
  style,
}: Solutions001Props) {
  const line = shape(points)
  const chartLabel = chartLabelText
    .replace("{from}", String(points[0]))
    .replace("{to}", String(points[points.length - 1]))

  const palette = {
    ...(accent ? { "--vibeui-solutions-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-001"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <h2>{title}</h2>
          <p data-part="period">{period}</p>
        </header>

        <p data-part="total">
          <span data-part="value">{total}</span>
          <span data-part="delta">{totalDelta}</span>
        </p>

        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          role="img"
          aria-label={chartLabel}
        >
          <polygon data-part="area" points={`0,100 ${line} 100,100`} />
          <polyline data-part="line" points={line} />
        </svg>
        <p data-part="axis">
          {axisText.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </p>

        <div data-part="tablewrap">
          <table>
            <thead>
              <tr>
                <th scope="col">
                  {columnText.source ?? DEFAULT_COLUMN_TEXT.source}
                </th>
                <th scope="col" data-align="end">
                  {columnText.visits ?? DEFAULT_COLUMN_TEXT.visits}
                </th>
                <th scope="col" data-align="end">
                  {columnText.share ?? DEFAULT_COLUMN_TEXT.share}
                </th>
                <th scope="col" data-align="end">
                  {columnText.trend ?? DEFAULT_COLUMN_TEXT.trend}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.source}>
                  <td>{row.source}</td>
                  <td data-align="end">{row.visits}</td>
                  <td
                    data-part="share"
                    data-align="end"
                    style={
                      {
                        "--vibeui-solutions-001-fill": `${row.share}%`,
                      } as CSSProperties
                    }
                  >
                    {row.share} %
                  </td>
                  <td data-align="end" data-trend={row.trend ?? "flat"}>
                    {row.delta}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>{totalRowText.label ?? DEFAULT_TOTAL_ROW_TEXT.label}</td>
                <td data-align="end">{total}</td>
                <td data-align="end">
                  {totalRowText.share ?? DEFAULT_TOTAL_ROW_TEXT.share}
                </td>
                <td data-align="end" data-trend="up">
                  {totalRowText.delta ?? DEFAULT_TOTAL_ROW_TEXT.delta}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </>
  )
}

import type { CSSProperties } from "react"

export type Dashboard001Metric = {
  label: string
  value: string
  delta?: string
  trend?: "up" | "down" | "flat"
}

export type Dashboard001Row = {
  source: string
  visits: string
  share: number
}

export type Dashboard001Props = {
  title?: string
  period?: string
  metrics?: Dashboard001Metric[]
  points?: number[]
  rows?: Dashboard001Row[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// container-type делает секцию собственным query-контейнером: сетка
// перестраивается по ширине блока, поэтому панель одинаково верна и на
// странице, и в узкой карточке каталога.
//
// Идея блока: обзор без единой библиотеки графиков. График — polyline в SVG
// с viewBox и preserveAspectRatio="none", то есть тянется под любую ширину;
// доли в таблице — фон ячейки градиентом. Направление показателя передаётся
// не только цветом: рядом стоит стрелка и подпись за какой период сравнение.
const STYLES = `
:where([data-vibeui-block="dashboard-001"]){
--vibeui-dashboard-001-bg:oklch(0.985 0.002 265);
--vibeui-dashboard-001-card:oklch(1 0 0);
--vibeui-dashboard-001-fg:oklch(0.22 0.014 265);
--vibeui-dashboard-001-muted:oklch(0.55 0.014 265);
--vibeui-dashboard-001-border:oklch(0.91 0.006 265);
--vibeui-dashboard-001-accent:oklch(0.55 0.2 262);
--vibeui-dashboard-001-up:oklch(0.58 0.14 152);
--vibeui-dashboard-001-down:oklch(0.57 0.19 25);
--vibeui-dashboard-001-bar:oklch(0.55 0.2 262 / 14%);
--vibeui-dashboard-001-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-001"]{
box-sizing:border-box;padding:1.25rem;
background:var(--vibeui-dashboard-001-bg);
font-family:var(--vibeui-dashboard-001-sans);color:var(--vibeui-dashboard-001-fg);
}
[data-vibeui-block="dashboard-001"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-001"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;
gap:0.5rem;margin-bottom:1rem;
}
[data-vibeui-block="dashboard-001"] h2{margin:0;font-size:1.125rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="dashboard-001"] [data-part="period"]{margin:0;font-size:0.8125rem;color:var(--vibeui-dashboard-001-muted)}
[data-vibeui-block="dashboard-001"] [data-part="metrics"]{
display:grid;grid-template-columns:1fr;gap:0.75rem;margin-bottom:0.75rem;
}
[data-vibeui-block="dashboard-001"] [data-part="grid"]{display:grid;grid-template-columns:1fr;gap:0.75rem}
/* Сетка считается от ширины блока: панель живёт и в узкой колонке. */
@container (min-width: 34rem){
[data-vibeui-block="dashboard-001"] [data-part="metrics"]{grid-template-columns:repeat(3,1fr)}
}
@container (min-width: 52rem){
[data-vibeui-block="dashboard-001"] [data-part="grid"]{grid-template-columns:1.4fr 1fr}
}
[data-vibeui-block="dashboard-001"] [data-part="card"]{
padding:0.875rem 1rem;
background:var(--vibeui-dashboard-001-card);
border:1px solid var(--vibeui-dashboard-001-border);border-radius:0.875rem;
}
[data-vibeui-block="dashboard-001"] [data-part="label"]{
margin:0 0 0.375rem;font-size:0.75rem;color:var(--vibeui-dashboard-001-muted);
}
[data-vibeui-block="dashboard-001"] [data-part="value"]{
margin:0;font-size:1.5rem;font-weight:700;line-height:1.1;
font-variant-numeric:tabular-nums;letter-spacing:-0.02em;
}
/* Направление — стрелка и слово, а не только цвет. */
[data-vibeui-block="dashboard-001"] [data-part="delta"]{
display:inline-flex;align-items:center;gap:0.25rem;margin-top:0.375rem;
font-size:0.75rem;font-weight:600;color:var(--vibeui-dashboard-001-muted);
}
[data-vibeui-block="dashboard-001"] [data-trend="up"] [data-part="delta"]{color:var(--vibeui-dashboard-001-up)}
[data-vibeui-block="dashboard-001"] [data-trend="down"] [data-part="delta"]{color:var(--vibeui-dashboard-001-down)}
[data-vibeui-block="dashboard-001"] [data-part="chart"]{
display:block;width:100%;height:9rem;margin-top:0.25rem;overflow:visible;
}
[data-vibeui-block="dashboard-001"] [data-part="line"]{
fill:none;stroke:var(--vibeui-dashboard-001-accent);
stroke-width:2;stroke-linecap:round;stroke-linejoin:round;
vector-effect:non-scaling-stroke;
}
[data-vibeui-block="dashboard-001"] [data-part="area"]{fill:var(--vibeui-dashboard-001-bar);stroke:none}
[data-vibeui-block="dashboard-001"] [data-part="axis"]{
display:flex;justify-content:space-between;margin:0.25rem 0 0;
font-size:0.6875rem;color:var(--vibeui-dashboard-001-muted);
}
[data-vibeui-block="dashboard-001"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="dashboard-001"] th,
[data-vibeui-block="dashboard-001"] td{
padding:0.375rem 0.5rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-dashboard-001-border);
}
[data-vibeui-block="dashboard-001"] th{
padding-top:0;border-top:0;
font-size:0.6875rem;font-weight:600;letter-spacing:0.03em;text-transform:uppercase;
color:var(--vibeui-dashboard-001-muted);
}
[data-vibeui-block="dashboard-001"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
/* Доля — фон ячейки: ещё один график ради пяти строк не нужен. */
[data-vibeui-block="dashboard-001"] [data-part="share"]{
min-width:6rem;
background:linear-gradient(to right,var(--vibeui-dashboard-001-bar) var(--vibeui-dashboard-001-fill),transparent var(--vibeui-dashboard-001-fill));
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_METRICS: Dashboard001Metric[] = [
  {
    label: "Установок компонентов",
    value: "1 284",
    delta: "+18 %",
    trend: "up",
  },
  { label: "Уникальных проектов", value: "312", delta: "+6 %", trend: "up" },
  { label: "Ошибок установки", value: "7", delta: "−41 %", trend: "down" },
]

const DEFAULT_POINTS = [28, 34, 31, 46, 42, 58, 54, 71, 68, 84, 92, 88]

const DEFAULT_ROWS: Dashboard001Row[] = [
  { source: "Поиск", visits: "18 402", share: 46 },
  { source: "Прямые заходы", visits: "7 118", share: 18 },
  { source: "Соцсети", visits: "6 940", share: 17 },
  { source: "Письма", visits: "4 233", share: 11 },
  { source: "Реклама", visits: "3 211", share: 8 },
]

function line(points: number[]) {
  const max = Math.max(...points, 1)
  const step = 100 / Math.max(points.length - 1, 1)
  return points
    .map(
      (point, index) =>
        `${(index * step).toFixed(2)},${(100 - (point / max) * 92).toFixed(2)}`,
    )
    .join(" ")
}

/**
 * Обзорная панель: показатели, график и доли источников без библиотек.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard001({
  title = "Обзор за неделю",
  period = "8–14 марта, сравнение с прошлой неделей",
  metrics = DEFAULT_METRICS,
  points = DEFAULT_POINTS,
  rows = DEFAULT_ROWS,
  accent,
  className,
  style,
}: Dashboard001Props) {
  const shape = line(points)

  const palette = {
    ...(accent ? { "--vibeui-dashboard-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-001"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <h2>{title}</h2>
          <p data-part="period">{period}</p>
        </header>

        <div data-part="metrics">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              data-part="card"
              data-trend={metric.trend ?? "flat"}
            >
              <p data-part="label">{metric.label}</p>
              <p data-part="value">{metric.value}</p>
              {metric.delta ? (
                <p data-part="delta">
                  {metric.trend === "down" ? "↓" : "↑"} {metric.delta} к прошлой
                  неделе
                </p>
              ) : null}
            </article>
          ))}
        </div>

        <div data-part="grid">
          <article data-part="card">
            <p data-part="label">Установки по дням</p>
            <svg
              data-part="chart"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              role="img"
              aria-label={`Установки по дням: от ${points[0]} до ${points[points.length - 1]}`}
            >
              <polygon data-part="area" points={`0,100 ${shape} 100,100`} />
              <polyline data-part="line" points={shape} />
            </svg>
            <p data-part="axis">
              <span>8 марта</span>
              <span>14 марта</span>
            </p>
          </article>

          <article data-part="card">
            <p data-part="label">Источники</p>
            <table>
              <thead>
                <tr>
                  <th scope="col">Источник</th>
                  <th scope="col" data-align="end">
                    Визиты
                  </th>
                  <th scope="col" data-align="end">
                    Доля
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
                          "--vibeui-dashboard-001-fill": `${row.share}%`,
                        } as CSSProperties
                      }
                    >
                      {row.share} %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        </div>
      </section>
    </>
  )
}

import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Chart010Column = {
  label: string
  value: number
}

export type Chart010Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "children" | "title"
> & {
  title?: string
  columns?: Chart010Column[]
  unit?: string
  accent?: string
}

// Идея компонента: столбцы с настоящей осью значений. Верх шкалы округляется
// вверх до «круглого» числа, поэтому деления подписаны как 0 / 300 / 600, а не
// как 0 / 217 / 434. Ось, деления и столбцы лежат в одном SVG, поэтому подписи
// не разъезжаются с колонками ни на какой ширине контейнера.
const STYLES = `
:where([data-vibeui-block="chart-010"]){
--vibeui-chart-010-bg:oklch(1 0 0);
--vibeui-chart-010-fg:oklch(0.22 0.014 265);
--vibeui-chart-010-muted:oklch(0.55 0.014 265);
--vibeui-chart-010-border:oklch(0.91 0.006 265);
--vibeui-chart-010-grid:oklch(0.93 0.005 265);
--vibeui-chart-010-axis:oklch(0.78 0.01 265);
--vibeui-chart-010-accent:oklch(0.55 0.17 265);
--vibeui-chart-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="chart-010"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:30rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-010-bg);
border:1px solid var(--vibeui-chart-010-border);border-radius:0.875rem;
color:var(--vibeui-chart-010-fg);font-family:var(--vibeui-chart-010-font);
}
[data-vibeui-block="chart-010"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="chart-010"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="chart-010"] [data-part="grid"]{stroke:var(--vibeui-chart-010-grid);stroke-width:1}
[data-vibeui-block="chart-010"] [data-part="axis"]{stroke:var(--vibeui-chart-010-axis);stroke-width:1}
[data-vibeui-block="chart-010"] [data-part="scale"]{
fill:var(--vibeui-chart-010-muted);font-size:8.5px;font-variant-numeric:tabular-nums;text-anchor:end;
}
[data-vibeui-block="chart-010"] [data-part="name"]{
fill:var(--vibeui-chart-010-muted);font-size:8.5px;text-anchor:middle;
}
[data-vibeui-block="chart-010"] [data-part="bar"]{
fill:color-mix(in oklab,var(--vibeui-chart-010-accent) 60%,oklch(0.94 0.008 265));
}
[data-vibeui-block="chart-010"] [data-part="bar"][data-peak="true"]{fill:var(--vibeui-chart-010-accent)}
[data-vibeui-block="chart-010"] [data-part="unit"]{margin:0;font-size:0.75rem;color:var(--vibeui-chart-010-muted)}
[data-vibeui-block="chart-010"] [data-part="data"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-010"] *{animation:none!important;transition:none!important}}
`

const LEFT = 34
const RIGHT = 318
const TOP = 12
const BASE = 126
const LABEL_Y = 143

/**
 * Верх шкалы округляется до 1 / 2 / 2.5 / 5 × 10ⁿ: только тогда подписи
 * делений остаются круглыми, а сетка — читаемой.
 */
function niceCeil(value: number) {
  if (value <= 0) {
    return 1
  }

  const power = 10 ** Math.floor(Math.log10(value))

  for (const step of [1, 2, 2.5, 5]) {
    if (value <= step * power) {
      return step * power
    }
  }

  return 10 * power
}

const DEFAULT_COLUMNS: Chart010Column[] = [
  { label: "Пн", value: 320 },
  { label: "Вт", value: 410 },
  { label: "Ср", value: 380 },
  { label: "Чт", value: 520 },
  { label: "Пт", value: 470 },
  { label: "Сб", value: 210 },
  { label: "Вс", value: 180 },
]

/**
 * Столбцы с подписанной осью значений и округлённой шкалой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart010({
  title = "Установки по дням",
  columns = DEFAULT_COLUMNS,
  unit = "установок",
  accent,
  className,
  style,
  ...props
}: Chart010Props) {
  const peak = Math.max(...columns.map((column) => column.value), 0)
  const top = niceCeil(peak)
  const band = (RIGHT - LEFT) / Math.max(columns.length, 1)
  const barWidth = Math.min(band * 0.62, 36)
  const ticks = [0, top / 2, top]

  const palette = {
    ...(accent ? { "--vibeui-chart-010-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-010" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="chart-010"
        className={className}
        style={palette}
      >
        <figcaption data-part="title">{title}</figcaption>
        <svg viewBox="0 0 324 150" aria-hidden="true" focusable="false">
          {ticks.map((tick) => {
            const y = BASE - (tick / top) * (BASE - TOP)

            return (
              <g key={tick}>
                <line data-part="grid" x1={LEFT} y1={y} x2={RIGHT} y2={y} />
                <text data-part="scale" x={LEFT - 6} y={y + 3}>
                  {tick}
                </text>
              </g>
            )
          })}
          <line data-part="axis" x1={LEFT} y1={BASE} x2={RIGHT} y2={BASE} />
          {columns.map((column, index) => {
            const height = (column.value / top) * (BASE - TOP)
            const x = LEFT + band * index + (band - barWidth) / 2

            return (
              <g key={column.label}>
                <rect
                  data-part="bar"
                  data-peak={column.value === peak ? "true" : undefined}
                  x={x}
                  y={BASE - height}
                  width={barWidth}
                  height={Math.max(height, 1.5)}
                  rx={3}
                />
                <text data-part="name" x={x + barWidth / 2} y={LABEL_Y}>
                  {column.label}
                </text>
              </g>
            )
          })}
        </svg>
        <p data-part="unit">
          Ось значений — {unit}, шкала до {top}
        </p>
        <table data-part="data">
          <caption>
            {title}, {unit}
          </caption>
          <tbody>
            {columns.map((column) => (
              <tr key={column.label}>
                <th scope="row">{column.label}</th>
                <td>{column.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>
    </>
  )
}

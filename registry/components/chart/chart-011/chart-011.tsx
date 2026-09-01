import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Chart011Point = {
  label: string
  value: number
}

export type Chart011Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "children" | "title"
> & {
  title?: string
  points?: Chart011Point[]
  unit?: string
  accent?: string
}

// Идея компонента: линия, у которой каждая точка отмечена кружком, а последняя
// подписана выноской прямо на графике. Читатель ищет на тренде две вещи —
// «где узлы» и «сколько сейчас»; выноска отвечает на второй вопрос, не
// заставляя переводить взгляд в заголовок.
const STYLES = `
:where([data-vibeui-block="chart-011"]){
--vibeui-chart-011-bg:oklch(1 0 0);
--vibeui-chart-011-fg:oklch(0.22 0.014 265);
--vibeui-chart-011-muted:oklch(0.55 0.014 265);
--vibeui-chart-011-border:oklch(0.91 0.006 265);
--vibeui-chart-011-grid:oklch(0.94 0.005 265);
--vibeui-chart-011-accent:oklch(0.55 0.17 265);
--vibeui-chart-011-callout:oklch(0.22 0.014 265);
--vibeui-chart-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="chart-011"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:30rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-011-bg);
border:1px solid var(--vibeui-chart-011-border);border-radius:0.875rem;
color:var(--vibeui-chart-011-fg);font-family:var(--vibeui-chart-011-font);
}
[data-vibeui-block="chart-011"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="chart-011"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="chart-011"] [data-part="grid"]{stroke:var(--vibeui-chart-011-grid);stroke-width:1}
[data-vibeui-block="chart-011"] [data-part="line"]{
fill:none;stroke:var(--vibeui-chart-011-accent);stroke-width:2;
stroke-linejoin:round;stroke-linecap:round;
}
[data-vibeui-block="chart-011"] [data-part="dot"]{
fill:var(--vibeui-chart-011-bg);stroke:var(--vibeui-chart-011-accent);stroke-width:2;
}
[data-vibeui-block="chart-011"] [data-part="dot"][data-last="true"]{fill:var(--vibeui-chart-011-accent)}
[data-vibeui-block="chart-011"] [data-part="callout"]{fill:var(--vibeui-chart-011-callout)}
[data-vibeui-block="chart-011"] [data-part="callout-text"]{
fill:oklch(1 0 0);font-size:9px;font-weight:650;text-anchor:middle;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-011"] [data-part="name"]{
fill:var(--vibeui-chart-011-muted);font-size:8.5px;text-anchor:middle;
}
[data-vibeui-block="chart-011"] [data-part="unit"]{margin:0;font-size:0.75rem;color:var(--vibeui-chart-011-muted)}
[data-vibeui-block="chart-011"] [data-part="data"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-011"] *{animation:none!important;transition:none!important}}
`

const LEFT = 12
const RIGHT = 288
const TOP = 26
const BASE = 116

const DEFAULT_POINTS: Chart011Point[] = [
  { label: "Апр", value: 18 },
  { label: "Май", value: 24 },
  { label: "Июн", value: 21 },
  { label: "Июл", value: 33 },
  { label: "Авг", value: 29 },
  { label: "Сен", value: 42 },
]

/**
 * Линия с отмеченными точками и выноской последнего значения.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart011({
  title = "Средний чек",
  points = DEFAULT_POINTS,
  unit = "тысяч рублей",
  accent,
  className,
  style,
  ...props
}: Chart011Props) {
  const values = points.map((point) => point.value)
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  // Нижняя граница опускается ниже минимума: линия, лежащая на оси, читается
  // как ноль, хотя ноля в данных нет.
  const floor = min - (max - min) * 0.25
  const span = max - floor || 1

  const place = (value: number, index: number) => ({
    x:
      LEFT +
      (points.length > 1 ? (index / (points.length - 1)) * (RIGHT - LEFT) : 0),
    y: BASE - ((value - floor) / span) * (BASE - TOP),
  })

  const spots = points.map((point, index) => place(point.value, index))
  const path = spots
    .map((spot, index) => `${index === 0 ? "M" : "L"}${spot.x} ${spot.y}`)
    .join(" ")

  const last = spots[spots.length - 1]
  const lastValue = String(points[points.length - 1]?.value ?? "")
  const calloutWidth = lastValue.length * 6 + 14

  const palette = {
    ...(accent ? { "--vibeui-chart-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-011" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="chart-011"
        className={className}
        style={palette}
      >
        <figcaption data-part="title">{title}</figcaption>
        <svg viewBox="0 0 300 136" aria-hidden="true" focusable="false">
          {[0, 0.5, 1].map((share) => {
            const y = TOP + share * (BASE - TOP)

            return (
              <line
                key={share}
                data-part="grid"
                x1={LEFT}
                y1={y}
                x2={RIGHT + 8}
                y2={y}
              />
            )
          })}
          <path data-part="line" d={path} />
          {spots.map((spot, index) => (
            <circle
              key={points[index].label}
              data-part="dot"
              data-last={index === spots.length - 1 ? "true" : undefined}
              cx={spot.x}
              cy={spot.y}
              r={3}
            />
          ))}
          <rect
            data-part="callout"
            x={Math.min(last.x - calloutWidth / 2, 300 - calloutWidth)}
            y={Math.max(last.y - 20, 2)}
            width={calloutWidth}
            height={14}
            rx={7}
          />
          <text
            data-part="callout-text"
            x={Math.min(last.x, 300 - calloutWidth / 2)}
            y={Math.max(last.y - 20, 2) + 10}
          >
            {lastValue}
          </text>
          {points.map((point, index) => (
            <text
              key={point.label}
              data-part="name"
              x={spots[index].x}
              y={BASE + 14}
            >
              {point.label}
            </text>
          ))}
        </svg>
        <p data-part="unit">
          Единица измерения: {unit}. Последнее значение подписано на графике.
        </p>
        <table data-part="data">
          <caption>
            {title}, {unit}
          </caption>
          <tbody>
            {points.map((point) => (
              <tr key={point.label}>
                <th scope="row">{point.label}</th>
                <td>{point.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>
    </>
  )
}

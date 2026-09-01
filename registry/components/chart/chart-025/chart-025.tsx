import { Fragment } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Chart025Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "children" | "title"
> & {
  title?: string
  days?: string[]
  hours?: number[]
  matrix?: number[][]
  unit?: string
  accent?: string
}

// Идея компонента: та же карта «день × час», что и обычный heatmap, но
// клетками служат кружки на SVG, а не залитые прямоугольники сетки. Радиус
// кружка несёт величину, а не только цвет — это читается и в оттенках
// серого, и когда акцентный цвет слишком светлый для заметной заливки.
const STYLES = `
:where([data-vibeui-block="chart-025"]){
--vibeui-chart-025-bg:oklch(1 0 0);
--vibeui-chart-025-fg:oklch(0.22 0.014 265);
--vibeui-chart-025-muted:oklch(0.55 0.014 265);
--vibeui-chart-025-border:oklch(0.91 0.006 265);
--vibeui-chart-025-empty:oklch(0.9 0.004 265);
--vibeui-chart-025-accent:oklch(0.52 0.17 25);
--vibeui-chart-025-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="chart-025"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:32rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-025-bg);
border:1px solid var(--vibeui-chart-025-border);border-radius:0.875rem;
color:var(--vibeui-chart-025-fg);font-family:var(--vibeui-chart-025-font);
}
[data-vibeui-block="chart-025"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="chart-025"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="chart-025"] [data-part="day"]{
fill:var(--vibeui-chart-025-muted);font-size:7.5px;text-anchor:start;
}
[data-vibeui-block="chart-025"] [data-part="hour"]{
fill:var(--vibeui-chart-025-muted);font-size:7px;text-anchor:middle;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-025"] [data-part="dot"]{fill:var(--vibeui-chart-025-empty)}
[data-vibeui-block="chart-025"] [data-part="scale"]{
display:flex;align-items:center;gap:0.3125rem;font-size:0.6875rem;color:var(--vibeui-chart-025-muted);
}
[data-vibeui-block="chart-025"] [data-part="step"]{border-radius:9999px;background:var(--vibeui-chart-025-accent)}
[data-vibeui-block="chart-025"] [data-part="unit"]{margin:0;font-size:0.75rem;color:var(--vibeui-chart-025-muted)}
[data-vibeui-block="chart-025"] [data-part="data"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-025"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
const DEFAULT_HOURS = Array.from({ length: 24 }, (_, hour) => hour)

// Правдоподобная кривая активности без ручного массива 7×24: рабочий пик
// днём в будни, вечерний спад, тихие выходные.
function buildDefaultMatrix() {
  return DEFAULT_DAYS.map((_, dayIndex) => {
    const weekend = dayIndex >= 5
    const scale = weekend ? 0.55 : 1

    return DEFAULT_HOURS.map((hour) => {
      const wave = Math.max(0, Math.sin(((hour - 7) / 15) * Math.PI))
      const value = Math.round(wave * 46 * scale + (weekend ? 4 : 2))

      return value
    })
  })
}

const DEFAULT_MATRIX = buildDefaultMatrix()

const LEFT = 22
const TOP = 10
const CELL = 11.6
const RADIUS_MAX = 5

/**
 * Тепловая карта «день × час» в стиле punch card: величина закодирована
 * радиусом кружка, а не только цветом заливки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart025({
  title = "Активность по часам",
  days = DEFAULT_DAYS,
  hours = DEFAULT_HOURS,
  matrix = DEFAULT_MATRIX,
  unit = "событий в час",
  accent,
  className,
  style,
  ...props
}: Chart025Props) {
  const max = Math.max(...matrix.flat(), 1)
  const width = LEFT + hours.length * CELL + 6
  const height = TOP + days.length * CELL + 12

  const palette = {
    ...(accent ? { "--vibeui-chart-025-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-025" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="chart-025"
        className={className}
        style={palette}
      >
        <figcaption data-part="title">{title}</figcaption>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          aria-hidden="true"
          focusable="false"
        >
          {days.map((day, dayIndex) => (
            <Fragment key={day}>
              <text
                data-part="day"
                x={0}
                y={TOP + dayIndex * CELL + CELL / 2 + 2.5}
              >
                {day}
              </text>
              {hours.map((hour, hourIndex) => {
                const value = matrix[dayIndex]?.[hourIndex] ?? 0
                const level = value / max
                const r = 0.8 + level * RADIUS_MAX

                return (
                  <circle
                    key={hour}
                    data-part="dot"
                    cx={LEFT + hourIndex * CELL + CELL / 2}
                    cy={TOP + dayIndex * CELL + CELL / 2}
                    r={r}
                    fillOpacity={0.25 + level * 0.75}
                    style={
                      {
                        fill:
                          level > 0.02
                            ? "var(--vibeui-chart-025-accent)"
                            : "var(--vibeui-chart-025-empty)",
                      } as CSSProperties
                    }
                  />
                )
              })}
            </Fragment>
          ))}
          {hours.map((hour, index) =>
            index % 3 === 0 ? (
              <text
                key={hour}
                data-part="hour"
                x={LEFT + index * CELL + CELL / 2}
                y={TOP + days.length * CELL + 9}
              >
                {hour}
              </text>
            ) : null,
          )}
        </svg>
        <p data-part="scale">
          реже
          {[0.1, 0.35, 0.6, 0.85, 1].map((level) => (
            <span
              key={level}
              data-part="step"
              aria-hidden="true"
              style={
                {
                  width: `${(0.8 + level * RADIUS_MAX) * 2}px`,
                  height: `${(0.8 + level * RADIUS_MAX) * 2}px`,
                  opacity: 0.25 + level * 0.75,
                } as CSSProperties
              }
            />
          ))}
          чаще
        </p>
        <p data-part="unit">
          Единица измерения: {unit}. Максимум клетки — {max}.
        </p>
        <table data-part="data">
          <caption>
            {title}, {unit}
          </caption>
          <thead>
            <tr>
              <th scope="col">День</th>
              {hours.map((hour) => (
                <th key={hour} scope="col">
                  {hour}:00
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

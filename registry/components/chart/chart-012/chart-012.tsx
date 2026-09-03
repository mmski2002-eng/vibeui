import type { ComponentProps, CSSProperties } from "react"

export type Chart012Point = {
  label: string
  value: number
}

export type Chart012Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  points?: Chart012Point[]
  unit?: string
  showAverage?: boolean
  /** Подпись у пунктира среднего: {value}. */
  averageLabel?: string
  /** Подпись под графиком: {unit} и {max}. */
  unitLabel?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: площадь с вертикальным градиентом вместо плоской заливки.
// Градиент гаснет к оси, поэтому площадь не спорит с линией за внимание, а
// пунктир среднего даёт линии точку отсчёта: без него «поднялось» и
// «опустилось» не с чем сравнить.
//
// Тема берётся из color-scheme окружения через light-dark(): график темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="chart-012"]){
--vibeui-chart-012-bg:transparent;
--vibeui-chart-012-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-chart-012-muted:color-mix(in oklab,var(--vibeui-chart-012-fg) 68%,transparent);
--vibeui-chart-012-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-chart-012-grid:light-dark(oklch(0.94 0.005 265),oklch(0.3 0.01 265));
--vibeui-chart-012-accent:light-dark(oklch(0.58 0.16 200),oklch(0.76 0.13 200));
--vibeui-chart-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-012"]{color-scheme:dark}
[data-vibeui-block="chart-012"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:30rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-012-bg);
border:1px solid var(--vibeui-chart-012-border);border-radius:0.875rem;
color:var(--vibeui-chart-012-fg);font-family:var(--vibeui-chart-012-font);
}
[data-vibeui-block="chart-012"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="chart-012"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="chart-012"] [data-part="now"]{
font-size:1.125rem;font-weight:700;font-variant-numeric:tabular-nums;
color:var(--vibeui-chart-012-accent);
}
[data-vibeui-block="chart-012"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="chart-012"] [data-part="grid"]{stroke:var(--vibeui-chart-012-grid);stroke-width:1}
[data-vibeui-block="chart-012"] [data-part="area"]{fill:url(#vibeui-chart-012-fade)}
[data-vibeui-block="chart-012"] [data-part="line"]{
fill:none;stroke:var(--vibeui-chart-012-accent);stroke-width:2;stroke-linejoin:round;
}
[data-vibeui-block="chart-012"] [data-part="average"]{
stroke:var(--vibeui-chart-012-muted);stroke-width:1;stroke-dasharray:4 3;
}
[data-vibeui-block="chart-012"] [data-part="average-text"]{
fill:var(--vibeui-chart-012-muted);font-size:8px;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-012"] [data-part="name"]{
fill:var(--vibeui-chart-012-muted);font-size:8.5px;text-anchor:middle;
}
[data-vibeui-block="chart-012"] [data-part="unit"]{margin:0;font-size:0.75rem;color:var(--vibeui-chart-012-muted)}
[data-vibeui-block="chart-012"] [data-part="data"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-012"] *{animation:none!important;transition:none!important}}
`

const LEFT = 6
const RIGHT = 294
const TOP = 10
const BASE = 112

const DEFAULT_POINTS: Chart012Point[] = [
  { label: "01", value: 240 },
  { label: "05", value: 310 },
  { label: "09", value: 286 },
  { label: "13", value: 402 },
  { label: "17", value: 368 },
  { label: "21", value: 455 },
  { label: "25", value: 520 },
  { label: "29", value: 610 },
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

function fillTemplate(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}

/**
 * График площади с градиентной заливкой и линией среднего.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart012({
  title = "Трафик за месяц",
  points = DEFAULT_POINTS,
  unit = "визитов в день",
  showAverage = true,
  averageLabel = "среднее {value}",
  unitLabel = "Единица измерения: {unit}. Максимум шкалы — {max}.",
  accent,
  background = "",
  className,
  style,
  ...props
}: Chart012Props) {
  const values = points.map((point) => point.value)
  const max = Math.max(...values, 1)
  const average = values.reduce((sum, value) => sum + value, 0) / values.length

  const place = (value: number, index: number) => ({
    x:
      LEFT +
      (points.length > 1 ? (index / (points.length - 1)) * (RIGHT - LEFT) : 0),
    y: BASE - (value / max) * (BASE - TOP),
  })

  const spots = points.map((point, index) => place(point.value, index))
  const line = spots
    .map((spot, index) => `${index === 0 ? "M" : "L"}${spot.x} ${spot.y}`)
    .join(" ")
  const area = `${line} L${RIGHT} ${BASE} L${LEFT} ${BASE} Z`
  const averageY = BASE - (average / max) * (BASE - TOP)

  const palette = {
    ...(accent ? { "--vibeui-chart-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-chart-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-012" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="chart"
        data-vibeui-block="chart-012"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <figcaption data-part="title">{title}</figcaption>
          <span data-part="now">{values[values.length - 1]}</span>
        </div>
        <svg viewBox="0 0 300 130" aria-hidden="true" focusable="false">
          <defs>
            {/* Градиент гаснет к оси: площадь показывает объём, но не спорит
                с линией за внимание. */}
            <linearGradient
              id="vibeui-chart-012-fade"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="var(--vibeui-chart-012-accent)"
                stopOpacity="0.42"
              />
              <stop
                offset="100%"
                stopColor="var(--vibeui-chart-012-accent)"
                stopOpacity="0.02"
              />
            </linearGradient>
          </defs>
          {[TOP, (TOP + BASE) / 2, BASE].map((y) => (
            <line key={y} data-part="grid" x1={LEFT} y1={y} x2={RIGHT} y2={y} />
          ))}
          <path data-part="area" d={area} />
          <path data-part="line" d={line} />
          {showAverage ? (
            <g>
              <line
                data-part="average"
                x1={LEFT}
                y1={averageY}
                x2={RIGHT}
                y2={averageY}
              />
              <text data-part="average-text" x={LEFT + 2} y={averageY - 4}>
                {fillTemplate(averageLabel, { value: Math.round(average) })}
              </text>
            </g>
          ) : null}
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
        <p data-part="unit">{fillTemplate(unitLabel, { unit, max })}</p>
        <div data-part="data">
          <table>
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
        </div>
      </figure>
    </>
  )
}

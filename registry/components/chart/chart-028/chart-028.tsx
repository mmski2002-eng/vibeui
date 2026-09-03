import type { ComponentProps, CSSProperties } from "react"

export type Chart028Point = {
  label: string
  /** Величина для столбца: считается от нуля. */
  bar: number
  /** Величина для линии: своя шкала, справа. */
  line: number
}

export type Chart028Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  points?: Chart028Point[]
  /** Подпись левой шкалы — той, по которой стоят столбцы. */
  barLabel?: string
  /** Подпись правой шкалы — той, по которой идёт линия. */
  lineLabel?: string
  /** Знак после числа правой шкалы: «%», «₽», пусто. */
  lineSuffix?: string
  /** Подпись под графиком: {barLabel} и {lineLabel}. */
  unitLabel?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: две величины разной природы на одном поле. Столбцы держат
// объём, линия — долю, и вторая шкала справа честно говорит, что у линии свои
// единицы: без неё читатель сравнивает высоты, которые сравнивать нельзя.
//
// Столбцы намеренно бледнее линии: объём здесь фон, а вопрос задаётся к доле.
const STYLES = `
:where([data-vibeui-block="chart-028"]){
--vibeui-chart-028-bg:transparent;
--vibeui-chart-028-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-chart-028-muted:color-mix(in oklab,var(--vibeui-chart-028-fg) 66%,transparent);
--vibeui-chart-028-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-chart-028-grid:light-dark(oklch(0.94 0.005 265),oklch(0.3 0.01 265));
--vibeui-chart-028-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-chart-028-bar:color-mix(in oklab,var(--vibeui-chart-028-accent) 30%,transparent);
--vibeui-chart-028-dot:light-dark(oklch(1 0 0),oklch(0.24 0.014 265));
--vibeui-chart-028-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-028"]{color-scheme:dark}
[data-vibeui-block="chart-028"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:32rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-028-bg);
border:1px solid var(--vibeui-chart-028-border);border-radius:0.875rem;
color:var(--vibeui-chart-028-fg);font-family:var(--vibeui-chart-028-font);
}
[data-vibeui-block="chart-028"] *{box-sizing:border-box}
[data-vibeui-block="chart-028"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="chart-028"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="chart-028"] [data-part="grid"]{stroke:var(--vibeui-chart-028-grid);stroke-width:1}
[data-vibeui-block="chart-028"] [data-part="bar"]{fill:var(--vibeui-chart-028-bar)}
[data-vibeui-block="chart-028"] [data-part="line"]{
fill:none;stroke:var(--vibeui-chart-028-accent);stroke-width:2;
stroke-linejoin:round;stroke-linecap:round;
}
[data-vibeui-block="chart-028"] [data-part="dot"]{
fill:var(--vibeui-chart-028-dot);stroke:var(--vibeui-chart-028-accent);stroke-width:2;
}
[data-vibeui-block="chart-028"] [data-part="tick"],
[data-vibeui-block="chart-028"] [data-part="name"]{
fill:var(--vibeui-chart-028-muted);font-size:8.5px;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-028"] [data-part="tick"][data-side="left"]{text-anchor:end}
[data-vibeui-block="chart-028"] [data-part="tick"][data-side="right"]{text-anchor:start}
[data-vibeui-block="chart-028"] [data-part="name"]{text-anchor:middle}
[data-vibeui-block="chart-028"] [data-part="legend"]{
display:flex;flex-wrap:wrap;gap:0.25rem 0.875rem;
margin:0;padding:0;list-style:none;
font-size:0.75rem;color:var(--vibeui-chart-028-muted);
}
[data-vibeui-block="chart-028"] [data-part="key"]{display:flex;align-items:center;gap:0.375rem}
[data-vibeui-block="chart-028"] [data-part="swatch"]{
flex:none;width:0.75rem;height:0.5rem;border-radius:0.125rem;
background:var(--vibeui-chart-028-bar);
}
[data-vibeui-block="chart-028"] [data-part="swatch"][data-kind="line"]{
height:0.1875rem;border-radius:999px;background:var(--vibeui-chart-028-accent);
}
[data-vibeui-block="chart-028"] [data-part="unit"]{margin:0;font-size:0.75rem;color:var(--vibeui-chart-028-muted)}
[data-vibeui-block="chart-028"] [data-part="data"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-028"] *{animation:none!important;transition:none!important}}
`

const LEFT = 30
const RIGHT = 268
const TOP = 12
const BASE = 116

const DEFAULT_POINTS: Chart028Point[] = [
  { label: "Апр", bar: 820, line: 3.1 },
  { label: "Май", bar: 910, line: 3.4 },
  { label: "Июн", bar: 870, line: 2.9 },
  { label: "Июл", bar: 1140, line: 3.8 },
  { label: "Авг", bar: 1210, line: 4.4 },
  { label: "Сен", bar: 1080, line: 4.1 },
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

/** Верх шкалы округляется вверх до круглого числа: подписи должны читаться. */
function ceilNice(value: number) {
  if (value <= 0) {
    return 1
  }

  const step = 10 ** Math.floor(Math.log10(value))
  const share = value / step

  const factor = share <= 1 ? 1 : share <= 2 ? 2 : share <= 5 ? 5 : 10

  return factor * step
}

/**
 * Столбцы и линия на одном поле, у каждой величины своя шкала.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart028({
  title = "Заказы и конверсия",
  points = DEFAULT_POINTS,
  barLabel = "Заказы, шт",
  lineLabel = "Конверсия",
  lineSuffix = "%",
  unitLabel = "Столбцы — {barLabel} по левой шкале, линия — {lineLabel} по правой.",
  accent,
  background = "",
  className,
  style,
  ...props
}: Chart028Props) {
  const barTop = ceilNice(Math.max(...points.map((point) => point.bar), 1))
  const lineTop = ceilNice(Math.max(...points.map((point) => point.line), 1))

  const step = (RIGHT - LEFT) / points.length
  const barWidth = Math.min(step * 0.56, 26)

  const spots = points.map((point, index) => ({
    x: LEFT + step * (index + 0.5),
    y: BASE - (point.line / lineTop) * (BASE - TOP),
  }))
  const path = spots
    .map(
      (spot, index) =>
        `${index === 0 ? "M" : "L"}${spot.x.toFixed(1)} ${spot.y.toFixed(1)}`,
    )
    .join(" ")

  const palette = {
    ...(accent ? { "--vibeui-chart-028-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-chart-028-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-028" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="chart"
        data-vibeui-block="chart-028"
        className={className}
        style={palette}
      >
        <figcaption data-part="title">{title}</figcaption>
        <svg viewBox="0 0 300 134" aria-hidden="true" focusable="false">
          {[0, 0.5, 1].map((share) => {
            const y = BASE - share * (BASE - TOP)

            return (
              <g key={share}>
                <line data-part="grid" x1={LEFT} y1={y} x2={RIGHT} y2={y} />
                <text data-part="tick" data-side="left" x={LEFT - 4} y={y + 3}>
                  {Math.round(barTop * share)}
                </text>
                <text
                  data-part="tick"
                  data-side="right"
                  x={RIGHT + 4}
                  y={y + 3}
                >
                  {(lineTop * share).toLocaleString("ru-RU", {
                    maximumFractionDigits: 1,
                  })}
                  {lineSuffix}
                </text>
              </g>
            )
          })}
          {points.map((point, index) => {
            const height = (point.bar / barTop) * (BASE - TOP)

            return (
              <rect
                key={point.label}
                data-part="bar"
                x={LEFT + step * (index + 0.5) - barWidth / 2}
                y={BASE - height}
                width={barWidth}
                height={Math.max(height, 1)}
                rx={2}
              />
            )
          })}
          <path data-part="line" d={path} />
          {spots.map((spot, index) => (
            <circle
              key={points[index].label}
              data-part="dot"
              cx={spot.x}
              cy={spot.y}
              r={2.75}
            />
          ))}
          {points.map((point, index) => (
            <text
              key={point.label}
              data-part="name"
              x={LEFT + step * (index + 0.5)}
              y={BASE + 13}
            >
              {point.label}
            </text>
          ))}
        </svg>
        <ul data-part="legend">
          <li data-part="key">
            <span data-part="swatch" aria-hidden="true" />
            {barLabel}
          </li>
          <li data-part="key">
            <span data-part="swatch" data-kind="line" aria-hidden="true" />
            {lineLabel}
          </li>
        </ul>
        <p data-part="unit">
          {fillTemplate(unitLabel, { barLabel, lineLabel })}
        </p>
        <div data-part="data">
          <table>
            <caption>{title}</caption>
            <thead>
              <tr>
                <th scope="col">Период</th>
                <th scope="col">{barLabel}</th>
                <th scope="col">{lineLabel}</th>
              </tr>
            </thead>
            <tbody>
              {points.map((point) => (
                <tr key={point.label}>
                  <th scope="row">{point.label}</th>
                  <td>{point.bar}</td>
                  <td>
                    {point.line}
                    {lineSuffix}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>
    </>
  )
}

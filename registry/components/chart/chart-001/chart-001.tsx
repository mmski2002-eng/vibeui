import type { CSSProperties } from "react"

export type Chart001Point = {
  label: string
  value: number
}

export type Chart001Props = {
  points?: Chart001Point[]
  title?: string
  /** Единица у подписей значений: «₽», «%», « ч». */
  unit?: string
  /** Отмечать точку максимума подписью. */
  markPeak?: boolean
  /** Подпись графика для скринридера: {title}, {min}, {max}, {unit}. */
  rangeLabel?: string
  /** Локаль форматирования крупного значения. */
  locale?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: график рисуется разметкой, а не библиотекой. SVG считается
// на сервере из массива точек, поэтому клиентского JS нет вовсе, а сам график
// виден до гидратации и печатается. Заливка под линией — не украшение: она
// удерживает взгляд на области значений, а не на самой кривой.
//
// Тема берётся из color-scheme окружения через light-dark(): график темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="chart-001"]){
--vibeui-chart-001-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-chart-001-muted:color-mix(in oklab,var(--vibeui-chart-001-fg) 68%,transparent);
--vibeui-chart-001-bg:transparent;
--vibeui-chart-001-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-chart-001-grid:light-dark(oklch(0.93 0 265),oklch(0.31 0 265));
--vibeui-chart-001-ring:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-chart-001-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.17 262));
--vibeui-chart-001-radius:0.875rem;
--vibeui-chart-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-001"]{color-scheme:dark}
[data-vibeui-block="chart-001"]{
display:flex;flex-direction:column;gap:0.875rem;
width:100%;box-sizing:border-box;padding:1.125rem 1.25rem 1rem;
border:1px solid var(--vibeui-chart-001-border);
border-radius:var(--vibeui-chart-001-radius);
background:var(--vibeui-chart-001-bg);color:var(--vibeui-chart-001-fg);
font-family:var(--vibeui-chart-001-font);
}
[data-vibeui-block="chart-001"] [data-part="head"]{display:flex;align-items:baseline;justify-content:space-between;gap:1rem}
[data-vibeui-block="chart-001"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:600}
[data-vibeui-block="chart-001"] [data-part="last"]{
font-size:1.125rem;font-weight:650;font-variant-numeric:tabular-nums;
color:var(--vibeui-chart-001-accent);
}
[data-vibeui-block="chart-001"] svg{display:block;width:100%;height:8rem;overflow:visible}
[data-vibeui-block="chart-001"] [data-part="grid"]{stroke:var(--vibeui-chart-001-grid);stroke-width:1}
[data-vibeui-block="chart-001"] [data-part="line"]{
fill:none;stroke:var(--vibeui-chart-001-accent);stroke-width:2;
stroke-linecap:round;stroke-linejoin:round;
vector-effect:non-scaling-stroke;
}
[data-vibeui-block="chart-001"] [data-part="area"]{fill:var(--vibeui-chart-001-accent);opacity:.1}
[data-vibeui-block="chart-001"] [data-part="peak"]{fill:var(--vibeui-chart-001-accent)}
[data-vibeui-block="chart-001"] [data-part="peak-ring"]{fill:var(--vibeui-chart-001-ring);stroke:var(--vibeui-chart-001-accent);stroke-width:2}
[data-vibeui-block="chart-001"] [data-part="axis"]{
display:flex;justify-content:space-between;gap:0.5rem;
font-size:0.6875rem;color:var(--vibeui-chart-001-muted);
}
[data-vibeui-block="chart-001"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_POINTS: Chart001Point[] = [
  { label: "Пн", value: 1240 },
  { label: "Вт", value: 1580 },
  { label: "Ср", value: 1390 },
  { label: "Чт", value: 2180 },
  { label: "Пт", value: 2640 },
  { label: "Сб", value: 1980 },
  { label: "Вс", value: 2310 },
]

const WIDTH = 320
const HEIGHT = 120

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
 * Линейный график на SVG: путь считается из точек, зависимостей нет.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart001({
  points = DEFAULT_POINTS,
  title = "Посетители за неделю",
  unit = "",
  markPeak = true,
  rangeLabel = "{title}: от {min}{unit} до {max}{unit}",
  locale = "ru-RU",
  accent,
  background = "",
  className,
  style,
}: Chart001Props) {
  const palette = {
    ...(accent ? { "--vibeui-chart-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-chart-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const values = points.map((point) => point.value)
  const max = Math.max(...values)
  const min = Math.min(...values)
  // Нижняя граница опускается ниже минимума: линия не должна лежать на оси.
  const floor = min - (max - min) * 0.25
  const span = max - floor || 1

  const coords = points.map((point, index) => ({
    x: (index / Math.max(1, points.length - 1)) * WIDTH,
    y: HEIGHT - ((point.value - floor) / span) * HEIGHT,
    point,
  }))

  const line = coords
    .map((coord, index) => `${index === 0 ? "M" : "L"}${coord.x} ${coord.y}`)
    .join(" ")
  const area = `${line} L${WIDTH} ${HEIGHT} L0 ${HEIGHT} Z`
  const peak = coords.reduce((best, coord) =>
    coord.point.value > best.point.value ? coord : best,
  )
  const last = points[points.length - 1]

  return (
    <>
      <style href="vibeui-chart-001" precedence="medium">
        {STYLES}
      </style>
      <figure
        data-slot="chart"
        data-vibeui-block="chart-001"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <figcaption data-part="title">{title}</figcaption>
          <span data-part="last">
            {last.value.toLocaleString(locale)}
            {unit}
          </span>
        </div>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={fillTemplate(rangeLabel, { title, min, max, unit })}
        >
          {[0, 0.5, 1].map((ratio) => (
            <line
              key={ratio}
              data-part="grid"
              x1={0}
              x2={WIDTH}
              y1={HEIGHT * ratio}
              y2={HEIGHT * ratio}
            />
          ))}
          <path data-part="area" d={area} />
          <path data-part="line" d={line} />
          {markPeak ? (
            <>
              <circle data-part="peak-ring" cx={peak.x} cy={peak.y} r={4.5} />
              <circle data-part="peak" cx={peak.x} cy={peak.y} r={2} />
            </>
          ) : null}
        </svg>
        <div data-part="axis">
          {points.map((point) => (
            <span key={point.label}>{point.label}</span>
          ))}
        </div>
      </figure>
    </>
  )
}

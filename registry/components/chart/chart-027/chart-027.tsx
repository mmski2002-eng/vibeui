import type { ComponentProps, CSSProperties } from "react"

export type Chart027Axis = {
  label: string
  /** Значение в процентах от края паутины: 0…100. */
  value: number
}

export type Chart027Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  /** Заголовок первой колонки таблицы-дублёра. */
  axisColumnLabel?: string
  title?: string
  axes?: Chart027Axis[]
  /** Второй контур для сравнения: длина совпадает с числом осей. Пусто — контур один. */
  compare?: number[]
  /** Подпись текущего контура в легенде. */
  seriesLabel?: string
  /** Подпись контура сравнения в легенде. */
  compareLabel?: string
  /** Подпись под графиком: {count}. */
  unitLabel?: string
  /** Раскрывать многоугольник из центра при появлении. */
  animate?: boolean
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: паутина сравнивает профиль целиком, а не отдельные числа.
// Такой график отвечает на вопрос «где просели относительно остального», и
// форма многоугольника видна раньше, чем читается любая подпись.
//
// Второй контур пунктиром — эталон или прошлый период: сравнение двух форм
// и есть смысл радара, одиночный контур почти всегда проигрывает столбцам.
const STYLES = `
:where([data-vibeui-block="chart-027"]){
--vibeui-chart-027-bg:transparent;
--vibeui-chart-027-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-chart-027-muted:color-mix(in oklab,var(--vibeui-chart-027-fg) 66%,transparent);
--vibeui-chart-027-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-chart-027-grid:light-dark(oklch(0.92 0 265),oklch(0.32 0 265));
--vibeui-chart-027-accent:light-dark(oklch(0.57 0.2 306),oklch(0.76 0.16 306));
--vibeui-chart-027-dur:0.9s;
--vibeui-chart-027-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-chart-027-compare:color-mix(in oklab,var(--vibeui-chart-027-fg) 45%,transparent);
--vibeui-chart-027-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-027"]{color-scheme:dark}
[data-vibeui-block="chart-027"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:24rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-027-bg);
border:1px solid var(--vibeui-chart-027-border);border-radius:0.875rem;
color:var(--vibeui-chart-027-fg);font-family:var(--vibeui-chart-027-font);
}
[data-vibeui-block="chart-027"] *{box-sizing:border-box}
\[data\-vibeui\-block="chart\-027"\] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650;letter-spacing:-0.01em}
[data-vibeui-block="chart-027"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="chart-027"] [data-part="web"]{fill:none;stroke:var(--vibeui-chart-027-grid);stroke-width:1}
[data-vibeui-block="chart-027"] [data-part="spoke"]{stroke:var(--vibeui-chart-027-grid);stroke-width:1}
[data-vibeui-block="chart-027"] svg{overflow:visible}
[data-vibeui-block="chart-027"] [data-part="shape"]{
fill:var(--vibeui-chart-027-accent);fill-opacity:0.2;
stroke:var(--vibeui-chart-027-accent);stroke-width:2;stroke-linejoin:round;
transform-box:view-box;transform-origin:130px 102px;
filter:drop-shadow(0 0 6px color-mix(in oklab,var(--vibeui-chart-027-accent) 35%,transparent));
}
[data-vibeui-block="chart-027"] [data-part="compare"]{
fill:none;stroke:var(--vibeui-chart-027-compare);stroke-width:1.5;
stroke-dasharray:4 3;stroke-linejoin:round;transform-box:view-box;transform-origin:130px 102px;
}
[data-vibeui-block="chart-027"] [data-part="dot"]{fill:var(--vibeui-chart-027-accent);transform-box:fill-box;transform-origin:center;transition:r 0.2s}
[data-vibeui-block="chart-027"] [data-part="axis"]{cursor:default}
[data-vibeui-block="chart-027"] [data-part="axis"] [data-part="hint"]{
fill:var(--vibeui-chart-027-fg);font-size:8.5px;font-weight:700;text-anchor:middle;font-variant-numeric:tabular-nums;
opacity:0;transition:opacity 0.2s;pointer-events:none;
}
[data-vibeui-block="chart-027"] [data-part="axis"]:hover [data-part="hint"]{opacity:1}
[data-vibeui-block="chart-027"] [data-part="axis"]:hover [data-part="dot"]{r:4}
[data-vibeui-block="chart-027"] [data-part="name"]{
fill:var(--vibeui-chart-027-muted);font-size:8.5px;
}
[data-vibeui-block="chart-027"] [data-part="legend"]{
display:flex;flex-wrap:wrap;gap:0.25rem 0.875rem;
margin:0;padding:0;list-style:none;
font-size:0.75rem;color:var(--vibeui-chart-027-muted);
}
[data-vibeui-block="chart-027"] [data-part="key"]{display:flex;align-items:center;gap:0.375rem}
[data-vibeui-block="chart-027"] [data-part="swatch"]{
flex:none;width:0.75rem;height:0.1875rem;border-radius:999px;
background:var(--vibeui-chart-027-accent);color:oklch(from var(--vibeui-chart-027-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="chart-027"] [data-part="swatch"][data-kind="compare"]{
background:repeating-linear-gradient(90deg,var(--vibeui-chart-027-compare) 0 0.25rem,transparent 0.25rem 0.4375rem);
}
[data-vibeui-block="chart-027"] [data-part="unit"]{margin:0;font-size:0.75rem;color:var(--vibeui-chart-027-muted)}
[data-vibeui-block="chart-027"] [data-part="data"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
/* Появление: фигура раскрывается из центра, узлы выскакивают, сравнение проявляется. */
[data-vibeui-block="chart-027"][data-animate] [data-part="shape"]{transform:scale(0);animation:vibeui-chart-027-open var(--vibeui-chart-027-dur) var(--vibeui-chart-027-ease) 0.1s forwards}
[data-vibeui-block="chart-027"][data-animate] [data-part="compare"]{opacity:0;transform:scale(0.6);animation:vibeui-chart-027-compare 0.8s var(--vibeui-chart-027-ease) 0.5s forwards}
[data-vibeui-block="chart-027"][data-animate] [data-part="dot"]{transform:scale(0);animation:vibeui-chart-027-pop 0.4s var(--vibeui-chart-027-ease) calc(0.5s + var(--i) * 60ms) forwards}
@keyframes vibeui-chart-027-open{70%{transform:scale(1.04)}to{transform:scale(1)}}
@keyframes vibeui-chart-027-compare{to{opacity:1;transform:scale(1)}}
@keyframes vibeui-chart-027-pop{60%{transform:scale(1.4)}to{transform:scale(1)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="chart-027"] *{animation:none!important;transition:none!important}
[data-vibeui-block="chart-027"][data-animate] [data-part="shape"],[data-vibeui-block="chart-027"][data-animate] [data-part="dot"],[data-vibeui-block="chart-027"][data-animate] [data-part="compare"]{transform:none;opacity:1}
}
`

const CENTER_X = 130
const CENTER_Y = 102
const RADIUS = 66

const DEFAULT_AXES: Chart027Axis[] = [
  { label: "Скорость", value: 82 },
  { label: "Точность", value: 64 },
  { label: "Охват", value: 55 },
  { label: "Стабильность", value: 88 },
  { label: "Цена", value: 47 },
  { label: "Поддержка", value: 71 },
]

const DEFAULT_COMPARE = [70, 70, 70, 70, 70, 70]

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

/** Точка на луче: первый луч смотрит вверх, дальше по часовой стрелке. */
function place(index: number, count: number, share: number) {
  const angle = (index / count) * Math.PI * 2 - Math.PI / 2
  const radius = RADIUS * Math.min(Math.max(share, 0), 1)

  return {
    x: CENTER_X + Math.cos(angle) * radius,
    y: CENTER_Y + Math.sin(angle) * radius,
    angle,
  }
}

function polygon(values: number[]) {
  return values
    .map((value, index) => {
      const spot = place(index, values.length, value / 100)

      return `${index === 0 ? "M" : "L"}${spot.x.toFixed(1)} ${spot.y.toFixed(1)}`
    })
    .join(" ")
    .concat(" Z")
}

/**
 * Паутина: профиль показателей одной фигурой, с контуром сравнения.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart027({
  axisColumnLabel = "Ось",
  title = "Профиль продукта",
  axes = DEFAULT_AXES,
  compare = DEFAULT_COMPARE,
  seriesLabel = "Наш продукт",
  compareLabel = "Среднее по рынку",
  unitLabel = "Осей: {count}. Значения — доля от края паутины в процентах.",
  animate = true,
  accent,
  background = "",
  className,
  style,
  ...props
}: Chart027Props) {
  const values = axes.map((axis) => axis.value)
  const hasCompare = compare.length === axes.length && compare.length > 0

  const palette = {
    ...(accent ? { "--vibeui-chart-027-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-chart-027-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-027" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="chart"
        data-vibeui-block="chart-027"
        data-animate={animate ? "" : undefined}
        className={className}
        style={palette}
      >
        <figcaption data-part="title">{title}</figcaption>
        <svg viewBox="0 0 260 204" aria-hidden="true" focusable="false">
          {[0.34, 0.67, 1].map((ring) => (
            <path
              key={ring}
              data-part="web"
              d={polygon(axes.map(() => ring * 100))}
            />
          ))}
          {axes.map((axis, index) => {
            const spot = place(index, axes.length, 1)

            return (
              <line
                key={axis.label}
                data-part="spoke"
                x1={CENTER_X}
                y1={CENTER_Y}
                x2={spot.x}
                y2={spot.y}
              />
            )
          })}
          {hasCompare ? (
            <path data-part="compare" d={polygon(compare)} />
          ) : null}
          <path data-part="shape" d={polygon(values)} />
          {axes.map((axis, index) => {
            const spot = place(index, axes.length, values[index] / 100)

            return (
              <g key={axis.label} data-part="axis" style={{ "--i": index } as CSSProperties}>
                <circle cx={spot.x} cy={spot.y} r={9} fill="transparent" />
                <text data-part="hint" x={spot.x} y={spot.y - 8}>
                  {values[index]}
                </text>
                <circle
                  data-part="dot"
                  cx={spot.x}
                  cy={spot.y}
                  r={2.5}
                />
              </g>
            )
          })}
          {axes.map((axis, index) => {
            const spot = place(index, axes.length, 1)
            // Подпись отодвигается от края паутины и прижимается той стороной,
            // с которой стоит: иначе левые подписи налезают на фигуру.
            const dx = Math.cos(spot.angle)
            const anchor = dx > 0.2 ? "start" : dx < -0.2 ? "end" : "middle"

            return (
              <text
                key={axis.label}
                data-part="name"
                textAnchor={anchor}
                x={CENTER_X + dx * (RADIUS + 9)}
                y={CENTER_Y + Math.sin(spot.angle) * (RADIUS + 12) + 3}
              >
                {axis.label}
              </text>
            )
          })}
        </svg>
        <ul data-part="legend">
          <li data-part="key">
            <span data-part="swatch" aria-hidden="true" />
            {seriesLabel}
          </li>
          {hasCompare ? (
            <li data-part="key">
              <span data-part="swatch" data-kind="compare" aria-hidden="true" />
              {compareLabel}
            </li>
          ) : null}
        </ul>
        <p data-part="unit">
          {fillTemplate(unitLabel, { count: axes.length })}
        </p>
        <div data-part="data">
          <table>
            <caption>{title}</caption>
            <thead>
              <tr>
                <th scope="col">{axisColumnLabel}</th>
                <th scope="col">{seriesLabel}</th>
                {hasCompare ? <th scope="col">{compareLabel}</th> : null}
              </tr>
            </thead>
            <tbody>
              {axes.map((axis, index) => (
                <tr key={axis.label}>
                  <th scope="row">{axis.label}</th>
                  <td>{axis.value}</td>
                  {hasCompare ? <td>{compare[index]}</td> : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>
    </>
  )
}

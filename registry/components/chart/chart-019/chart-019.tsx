import type { ComponentProps, CSSProperties } from "react"

export type Chart019Dot = {
  label: string
  x: number
  y: number
}

export type Chart019Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  dots?: Chart019Dot[]
  xLabel?: string
  yLabel?: string
  /** Подпись под графиком: {x} и {y}. */
  axesLabel?: string
  /** Заголовок первого столбца скрытой таблицы. */
  rowHeader?: string
  /** Выскакивать точками по очереди при появлении. */
  animate?: boolean
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: диаграмма рассеяния для связи двух величин. Обе оси
// подписаны и начинаются от нуля, деления округляются до круглых чисел, а
// подпись оси Y повёрнута вдоль неё — иначе она съедает половину ширины.
// Точки полупрозрачны: наложения видно, и облако не превращается в кляксу.
//
// Тема берётся из color-scheme окружения через light-dark(): облако темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="chart-019"]){
--vibeui-chart-019-bg:transparent;
--vibeui-chart-019-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-chart-019-muted:color-mix(in oklab,var(--vibeui-chart-019-fg) 68%,transparent);
--vibeui-chart-019-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-chart-019-grid:light-dark(oklch(0.94 0 265),oklch(0.3 0 265));
--vibeui-chart-019-axis:light-dark(oklch(0.78 0 265),oklch(0.46 0 265));
--vibeui-chart-019-accent:light-dark(oklch(0.6 0.22 342),oklch(0.78 0.17 342));
--vibeui-chart-019-dur:0.9s;
--vibeui-chart-019-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-chart-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-019"]{color-scheme:dark}
[data-vibeui-block="chart-019"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:26rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-019-bg);
border:1px solid var(--vibeui-chart-019-border);border-radius:0.875rem;
color:var(--vibeui-chart-019-fg);font-family:var(--vibeui-chart-019-font);
}
\[data\-vibeui\-block="chart\-019"\] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650;letter-spacing:-0.01em}
[data-vibeui-block="chart-019"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="chart-019"] [data-part="grid"]{stroke:var(--vibeui-chart-019-grid);stroke-width:1}
[data-vibeui-block="chart-019"] [data-part="axis"]{stroke:var(--vibeui-chart-019-axis);stroke-width:1}
[data-vibeui-block="chart-019"] svg{overflow:visible}
[data-vibeui-block="chart-019"] [data-part="spot"] text{
fill:var(--vibeui-chart-019-fg);font-size:8.5px;font-weight:700;text-anchor:middle;
opacity:0;transition:opacity 0.2s;pointer-events:none;
}
[data-vibeui-block="chart-019"] [data-part="spot"]:hover text{opacity:1}
[data-vibeui-block="chart-019"] svg:hover [data-part="dot"]:not(:hover){fill-opacity:0.3}
[data-vibeui-block="chart-019"] [data-part="dot"]:hover{fill-opacity:1;r:6}
[data-vibeui-block="chart-019"] [data-part="dot"]{
fill:var(--vibeui-chart-019-accent);fill-opacity:0.62;
stroke:var(--vibeui-chart-019-accent);stroke-width:1.25;
transform-box:fill-box;transform-origin:center;transition:fill-opacity 0.2s,r 0.2s;
}
[data-vibeui-block="chart-019"] [data-part="tick-x"]{
fill:var(--vibeui-chart-019-muted);font-size:8px;text-anchor:middle;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-019"] [data-part="tick-y"]{
fill:var(--vibeui-chart-019-muted);font-size:8px;text-anchor:end;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-019"] [data-part="axis-name"]{
fill:var(--vibeui-chart-019-fg);font-size:8.5px;font-weight:600;
}
[data-vibeui-block="chart-019"] [data-part="unit"]{margin:0;font-size:0.75rem;color:var(--vibeui-chart-019-muted)}
[data-vibeui-block="chart-019"] [data-part="data"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
/* Появление: точки выскакивают по очереди. */
[data-vibeui-block="chart-019"][data-animate] [data-part="dot"]{transform:scale(0);animation:vibeui-chart-019-pop 0.5s var(--vibeui-chart-019-ease) calc(var(--i) * 50ms) forwards}
@keyframes vibeui-chart-019-pop{60%{transform:scale(1.3)}to{transform:scale(1)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="chart-019"] *{animation:none!important;transition:none!important}
[data-vibeui-block="chart-019"][data-animate] [data-part="dot"]{transform:none}
}
`

const LEFT = 34
const RIGHT = 292
const TOP = 12
const BASE = 148

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

const DEFAULT_DOTS: Chart019Dot[] = [
  { label: "Каталог", x: 12, y: 2.4 },
  { label: "Главная", x: 26, y: 3.1 },
  { label: "Компонент", x: 34, y: 4.6 },
  { label: "Блоки", x: 41, y: 4.2 },
  { label: "Документация", x: 48, y: 6.1 },
  { label: "Гайды", x: 55, y: 5.4 },
  { label: "Changelog", x: 63, y: 7.2 },
  { label: "Roadmap", x: 71, y: 6.8 },
  { label: "FAQ", x: 82, y: 8.4 },
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
 * Диаграмма рассеяния двух величин с подписанными осями.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart019({
  title = "Время на странице и глубина просмотра",
  dots = DEFAULT_DOTS,
  xLabel = "секунд на странице",
  yLabel = "страниц за визит",
  axesLabel = "Ось X — {x}, ось Y — {y}. Обе оси начинаются с нуля.",
  rowHeader = "Страница",
  animate = true,
  accent,
  background = "",
  className,
  style,
  ...props
}: Chart019Props) {
  const xTop = niceCeil(Math.max(...dots.map((dot) => dot.x), 1))
  const yTop = niceCeil(Math.max(...dots.map((dot) => dot.y), 1))
  const xTicks = [0, xTop / 2, xTop]
  const yTicks = [0, yTop / 2, yTop]

  const palette = {
    ...(accent ? { "--vibeui-chart-019-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-chart-019-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-019" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="chart"
        data-vibeui-block="chart-019"
        data-animate={animate ? "" : undefined}
        className={className}
        style={palette}
      >
        <figcaption data-part="title">{title}</figcaption>
        <svg viewBox="0 0 300 178" aria-hidden="true" focusable="false">
          {yTicks.map((tick) => {
            const y = BASE - (tick / yTop) * (BASE - TOP)

            return (
              <g key={`y${tick}`}>
                <line data-part="grid" x1={LEFT} y1={y} x2={RIGHT} y2={y} />
                <text data-part="tick-y" x={LEFT - 6} y={y + 3}>
                  {tick}
                </text>
              </g>
            )
          })}
          {xTicks.map((tick) => {
            const x = LEFT + (tick / xTop) * (RIGHT - LEFT)

            return (
              <text key={`x${tick}`} data-part="tick-x" x={x} y={BASE + 13}>
                {tick}
              </text>
            )
          })}
          <line data-part="axis" x1={LEFT} y1={TOP} x2={LEFT} y2={BASE} />
          <line data-part="axis" x1={LEFT} y1={BASE} x2={RIGHT} y2={BASE} />
          {dots.map((dot, index) => (
            <g key={dot.label} data-part="spot" style={{ "--i": index } as CSSProperties}>
              <text x={LEFT + (dot.x / xTop) * (RIGHT - LEFT)} y={BASE - (dot.y / yTop) * (BASE - TOP) - 9}>
                {dot.label}
              </text>
              <circle
                data-part="dot"
                cx={LEFT + (dot.x / xTop) * (RIGHT - LEFT)}
                cy={BASE - (dot.y / yTop) * (BASE - TOP)}
                r={4.5}
              />
            </g>
          ))}
          <text data-part="axis-name" x={RIGHT} y={BASE + 26} textAnchor="end">
            {xLabel} →
          </text>
          {/* Подпись оси Y повёрнута вдоль неё: горизонтальная съела бы
              треть ширины карточки. */}
          <text
            data-part="axis-name"
            transform={`translate(11 ${BASE}) rotate(-90)`}
          >
            {yLabel} →
          </text>
        </svg>
        <p data-part="unit">
          {fillTemplate(axesLabel, { x: xLabel, y: yLabel })}
        </p>
        <div data-part="data">
          <table>
            <caption>{title}</caption>
            <thead>
              <tr>
                <th scope="col">{rowHeader}</th>
                <th scope="col">{xLabel}</th>
                <th scope="col">{yLabel}</th>
              </tr>
            </thead>
            <tbody>
              {dots.map((dot) => (
                <tr key={dot.label}>
                  <th scope="row">{dot.label}</th>
                  <td>{dot.x}</td>
                  <td>{dot.y}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>
    </>
  )
}

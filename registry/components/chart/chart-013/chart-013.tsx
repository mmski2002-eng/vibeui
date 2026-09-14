import type { ComponentProps, CSSProperties } from "react"

export type Chart013Slice = {
  label: string
  value: number
  hue?: number
}

export type Chart013Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  slices?: Chart013Slice[]
  centerLabel?: string
  unit?: string
  /** Подпись под кольцом: {unit}. */
  unitLabel?: string
  /** Выдвигать секторы по очереди при появлении. */
  animate?: boolean
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: кольцо, у которого дырка занята делом. Секторы нарисованы
// обводкой одной окружности через stroke-dasharray, поэтому между ними есть
// настоящий зазор, а в центре стоит итог — число, ради которого кольцо и
// смотрят. Легенда справа держит подписи и проценты.
//
// Тема берётся из color-scheme окружения через light-dark(): кольцо темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="chart-013"]){
--vibeui-chart-013-bg:transparent;
--vibeui-chart-013-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-chart-013-dur:0.9s;
--vibeui-chart-013-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-chart-013-muted:color-mix(in oklab,var(--vibeui-chart-013-fg) 68%,transparent);
--vibeui-chart-013-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-chart-013-track:light-dark(oklch(0.94 0 265),oklch(0.31 0 265));
--vibeui-chart-013-chroma:0.14;
--vibeui-chart-013-light:0.62;
--vibeui-chart-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-013"]{color-scheme:dark}
[data-vibeui-block="chart-013"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.875rem;
width:100%;max-width:26rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-013-bg);
border:1px solid var(--vibeui-chart-013-border);border-radius:0.875rem;
color:var(--vibeui-chart-013-fg);font-family:var(--vibeui-chart-013-font);
}
[data-vibeui-block="chart-013"] [data-part="title"]{
flex:1 0 100%;margin:0;font-size:0.9375rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="chart-013"] svg{display:block;width:8.5rem;height:8.5rem;flex:0 0 auto}
[data-vibeui-block="chart-013"] [data-part="track"]{
fill:none;stroke:var(--vibeui-chart-013-track);stroke-width:16;
}
[data-vibeui-block="chart-013"] [data-part="slice"]{fill:none;stroke-width:16;stroke-linecap:butt;transition:stroke-width 0.25s var(--vibeui-chart-013-ease),opacity 0.25s;cursor:default}
[data-vibeui-block="chart-013"] [data-part="slice"]:hover{stroke-width:20}
[data-vibeui-block="chart-013"] [data-part="row"]{padding:0.2rem 0.375rem;margin:0 -0.375rem;border-radius:0.375rem;transition:background-color 0.2s,opacity 0.2s}
[data-vibeui-block="chart-013"] [data-part="row"]:hover{background:color-mix(in oklab,var(--vibeui-chart-013-fg) 6%,transparent)}
/* Связь сектора и строки: наведение на одно гасит остальное (сектор k —
   дочерний k+1 в svg после дорожки, строка k — k-я в легенде). */
[data-vibeui-block="chart-013"]:has([data-part="slice"]:hover) [data-part="slice"]:not(:hover){opacity:0.35}
[data-vibeui-block="chart-013"]:has([data-part="row"]:hover) [data-part="slice"]{opacity:0.35}
[data-vibeui-block="chart-013"]:has([data-part="slice"]:hover) [data-part="row"]{opacity:0.45}
[data-vibeui-block="chart-013"]:has([data-part="row"]:nth-child(1):hover) [data-part="slice"]:nth-child(2),
[data-vibeui-block="chart-013"]:has([data-part="row"]:nth-child(2):hover) [data-part="slice"]:nth-child(3),
[data-vibeui-block="chart-013"]:has([data-part="row"]:nth-child(3):hover) [data-part="slice"]:nth-child(4),
[data-vibeui-block="chart-013"]:has([data-part="row"]:nth-child(4):hover) [data-part="slice"]:nth-child(5),
[data-vibeui-block="chart-013"]:has([data-part="row"]:nth-child(5):hover) [data-part="slice"]:nth-child(6),
[data-vibeui-block="chart-013"]:has([data-part="row"]:nth-child(6):hover) [data-part="slice"]:nth-child(7),
[data-vibeui-block="chart-013"]:has([data-part="row"]:nth-child(7):hover) [data-part="slice"]:nth-child(8),
[data-vibeui-block="chart-013"]:has([data-part="row"]:nth-child(8):hover) [data-part="slice"]:nth-child(9){opacity:1;stroke-width:20}
[data-vibeui-block="chart-013"]:has([data-part="slice"]:nth-child(2):hover) [data-part="row"]:nth-child(1),
[data-vibeui-block="chart-013"]:has([data-part="slice"]:nth-child(3):hover) [data-part="row"]:nth-child(2),
[data-vibeui-block="chart-013"]:has([data-part="slice"]:nth-child(4):hover) [data-part="row"]:nth-child(3),
[data-vibeui-block="chart-013"]:has([data-part="slice"]:nth-child(5):hover) [data-part="row"]:nth-child(4),
[data-vibeui-block="chart-013"]:has([data-part="slice"]:nth-child(6):hover) [data-part="row"]:nth-child(5),
[data-vibeui-block="chart-013"]:has([data-part="slice"]:nth-child(7):hover) [data-part="row"]:nth-child(6),
[data-vibeui-block="chart-013"]:has([data-part="slice"]:nth-child(8):hover) [data-part="row"]:nth-child(7),
[data-vibeui-block="chart-013"]:has([data-part="slice"]:nth-child(9):hover) [data-part="row"]:nth-child(8){opacity:1;background:color-mix(in oklab,var(--vibeui-chart-013-fg) 6%,transparent)}
[data-vibeui-block="chart-013"] [data-part="total"]{
fill:var(--vibeui-chart-013-fg);font-size:20px;font-weight:700;text-anchor:middle;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-013"] [data-part="center-label"]{
fill:var(--vibeui-chart-013-muted);font-size:9px;text-anchor:middle;
}
[data-vibeui-block="chart-013"] [data-part="legend"]{
flex:1 1 9rem;display:flex;flex-direction:column;gap:0.375rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="chart-013"] [data-part="row"]{
display:grid;grid-template-columns:0.5rem 1fr auto;align-items:center;gap:0.5rem;
font-size:0.8125rem;
}
[data-vibeui-block="chart-013"] [data-part="chip"]{
width:0.5rem;height:0.5rem;border-radius:2px;background:var(--vibeui-chart-013-chip);
}
[data-vibeui-block="chart-013"] [data-part="name"]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="chart-013"] [data-part="share"]{
font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-013"] [data-part="unit"]{flex:1 0 100%;margin:0;font-size:0.75rem;color:var(--vibeui-chart-013-muted)}
/* Появление: секторы выезжают по очереди по часовой, итог и строки всплывают. */
[data-vibeui-block="chart-013"][data-animate] [data-part="slice"]{animation:vibeui-chart-013-sweep var(--vibeui-chart-013-dur) var(--vibeui-chart-013-ease) calc(var(--i) * 140ms) both}
[data-vibeui-block="chart-013"][data-animate] [data-part="total"],[data-vibeui-block="chart-013"][data-animate] [data-part="center-label"]{opacity:0;animation:vibeui-chart-013-fade 0.5s var(--vibeui-chart-013-ease) 0.5s forwards}
[data-vibeui-block="chart-013"][data-animate] [data-part="row"]{opacity:0;animation:vibeui-chart-013-rise 0.5s var(--vibeui-chart-013-ease) calc(0.35s + var(--i) * 80ms) forwards}
@keyframes vibeui-chart-013-sweep{from{stroke-dasharray:0 1000}}
@keyframes vibeui-chart-013-fade{to{opacity:1}}
@keyframes vibeui-chart-013-rise{from{opacity:0;translate:0 0.3rem}to{opacity:1;translate:0 0}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="chart-013"] *{animation:none!important;transition:none!important}
[data-vibeui-block="chart-013"][data-animate] [data-part="total"],[data-vibeui-block="chart-013"][data-animate] [data-part="center-label"],[data-vibeui-block="chart-013"][data-animate] [data-part="row"]{opacity:1}
}
`

const RADIUS = 42
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
// Зазор между секторами в единицах длины окружности: без него соседние доли
// сливаются в одну дугу.
const GAP = 3

const DEFAULT_SLICES: Chart013Slice[] = [
  { label: "Прямые", value: 480, hue: 265 },
  { label: "Поиск", value: 320, hue: 200 },
  { label: "Соцсети", value: 190, hue: 150 },
  { label: "Рассылка", value: 110, hue: 40 },
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
 * Кольцевая диаграмма с итогом в центре и легендой с процентами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart013({
  title = "Регистрации по каналам",
  slices = DEFAULT_SLICES,
  centerLabel = "всего",
  unit = "регистраций за месяц",
  unitLabel = "Единица измерения: {unit}",
  animate = true,
  accent,
  background = "",
  className,
  style,
  ...props
}: Chart013Props) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0) || 1

  const palette = {
    ...(accent ? { "--vibeui-chart-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-chart-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const tone = (slice: Chart013Slice, index: number) =>
    accent && index === 0
      ? accent
      : `oklch(var(--vibeui-chart-013-light) var(--vibeui-chart-013-chroma) ${slice.hue ?? index * 70})`

  // Начало сектора — сумма предыдущих длин. Считается заново на каждой доле,
  // чтобы во время отрисовки не мутировался внешний счётчик.
  const arcs = slices.map((slice, index) => ({
    slice,
    index,
    length: (slice.value / total) * CIRCUMFERENCE,
    offset: slices
      .slice(0, index)
      .reduce((sum, before) => sum + (before.value / total) * CIRCUMFERENCE, 0),
    color: tone(slice, index),
  }))

  return (
    <>
      <style href="vibeui-chart-013" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="chart"
        data-vibeui-block="chart-013"
        data-animate={animate ? "" : undefined}
        className={className}
        style={palette}
      >
        <figcaption data-part="title">{title}</figcaption>
        <svg viewBox="0 0 110 110" aria-hidden="true" focusable="false">
          <circle data-part="track" cx="55" cy="55" r={RADIUS} />
          {arcs.map((arc) => (
            <circle
              key={arc.slice.label}
              data-part="slice"
              cx="55"
              cy="55"
              r={RADIUS}
              style={{ stroke: arc.color, "--i": arc.index } as CSSProperties}
              strokeDasharray={`${Math.max(arc.length - GAP, 0.5)} ${CIRCUMFERENCE}`}
              strokeDashoffset={-arc.offset}
              transform="rotate(-90 55 55)"
            />
          ))}
          <text data-part="total" x="55" y="57">
            {total}
          </text>
          <text data-part="center-label" x="55" y="70">
            {centerLabel}
          </text>
        </svg>
        <ul data-part="legend">
          {arcs.map((arc) => (
            <li key={arc.slice.label} data-part="row" style={{ "--i": arc.index } as CSSProperties}>
              <span
                data-part="chip"
                aria-hidden="true"
                style={
                  { "--vibeui-chart-013-chip": arc.color } as CSSProperties
                }
              />
              <span data-part="name">{arc.slice.label}</span>
              <span data-part="share">
                {arc.slice.value} ·{" "}
                {Math.round((arc.slice.value / total) * 100)}%
              </span>
            </li>
          ))}
        </ul>
        <p data-part="unit">{fillTemplate(unitLabel, { unit })}</p>
      </figure>
    </>
  )
}

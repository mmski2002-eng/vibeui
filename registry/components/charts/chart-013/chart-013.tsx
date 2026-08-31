import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Chart013Slice = {
  label: string
  value: number
  hue?: number
}

export type Chart013Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "children" | "title"
> & {
  title?: string
  slices?: Chart013Slice[]
  centerLabel?: string
  unit?: string
  accent?: string
}

// Идея компонента: кольцо, у которого дырка занята делом. Секторы нарисованы
// обводкой одной окружности через stroke-dasharray, поэтому между ними есть
// настоящий зазор, а в центре стоит итог — число, ради которого кольцо и
// смотрят. Легенда справа держит подписи и проценты.
const STYLES = `
:where([data-vibeui-block="chart-013"]){
--vibeui-chart-013-bg:oklch(1 0 0);
--vibeui-chart-013-fg:oklch(0.22 0.014 265);
--vibeui-chart-013-muted:oklch(0.55 0.014 265);
--vibeui-chart-013-border:oklch(0.91 0.006 265);
--vibeui-chart-013-track:oklch(0.94 0.005 265);
--vibeui-chart-013-chroma:0.14;
--vibeui-chart-013-light:0.62;
--vibeui-chart-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="chart-013"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.875rem;
width:100%;max-width:26rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-013-bg);
border:1px solid var(--vibeui-chart-013-border);border-radius:0.875rem;
color:var(--vibeui-chart-013-fg);font-family:var(--vibeui-chart-013-font);
}
[data-vibeui-block="chart-013"] [data-part="title"]{
flex:1 0 100%;margin:0;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="chart-013"] svg{display:block;width:8.5rem;height:8.5rem;flex:0 0 auto}
[data-vibeui-block="chart-013"] [data-part="track"]{
fill:none;stroke:var(--vibeui-chart-013-track);stroke-width:16;
}
[data-vibeui-block="chart-013"] [data-part="slice"]{fill:none;stroke-width:16;stroke-linecap:butt}
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
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-013"] *{animation:none!important;transition:none!important}}
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
 * Кольцевая диаграмма с итогом в центре и легендой с процентами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart013({
  title = "Регистрации по каналам",
  slices = DEFAULT_SLICES,
  centerLabel = "всего",
  unit = "регистраций за месяц",
  accent,
  className,
  style,
  ...props
}: Chart013Props) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0) || 1

  const palette = {
    ...(accent ? { "--vibeui-chart-013-accent": accent } : null),
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
        data-vibeui-block="chart-013"
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
              style={{ stroke: arc.color }}
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
            <li key={arc.slice.label} data-part="row">
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
        <p data-part="unit">Единица измерения: {unit}</p>
      </figure>
    </>
  )
}

import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Chart023Stage = {
  label: string
  value: number
}

export type Chart023Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "children" | "title"
> & {
  title?: string
  stages?: Chart023Stage[]
  unit?: string
  accent?: string
}

// Идея компонента: воронка одной сплошной фигурой, а не стопкой раздельных
// трапеций. Полосы стыкуются без зазора, поэтому сужение читается как один
// конус, а не набор ступеней. Подписи вынесены наружу на выносных линиях —
// внутри узкой нижней полосы текст всё равно не помещается.
const STYLES = `
:where([data-vibeui-block="chart-023"]){
--vibeui-chart-023-bg:oklch(1 0 0);
--vibeui-chart-023-fg:oklch(0.22 0.014 265);
--vibeui-chart-023-muted:oklch(0.55 0.014 265);
--vibeui-chart-023-border:oklch(0.91 0.006 265);
--vibeui-chart-023-lead:oklch(0.82 0.008 265);
--vibeui-chart-023-accent:oklch(0.52 0.18 275);
--vibeui-chart-023-drop:oklch(0.58 0.16 25);
--vibeui-chart-023-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="chart-023"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:26rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-023-bg);
border:1px solid var(--vibeui-chart-023-border);border-radius:0.875rem;
color:var(--vibeui-chart-023-fg);font-family:var(--vibeui-chart-023-font);
}
[data-vibeui-block="chart-023"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="chart-023"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="chart-023"] [data-part="band"]{
fill:color-mix(in oklab,var(--vibeui-chart-023-accent) var(--vibeui-chart-023-mix,70%),var(--vibeui-chart-023-bg));
}
[data-vibeui-block="chart-023"] [data-part="lead"]{stroke:var(--vibeui-chart-023-lead);stroke-width:1}
[data-vibeui-block="chart-023"] [data-part="name"]{
fill:var(--vibeui-chart-023-fg);font-size:9px;font-weight:600;
}
[data-vibeui-block="chart-023"] [data-part="figures"]{
fill:var(--vibeui-chart-023-muted);font-size:8px;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-023"] [data-part="drop"]{fill:var(--vibeui-chart-023-drop);font-weight:600}
[data-vibeui-block="chart-023"] [data-part="unit"]{margin:0;font-size:0.75rem;color:var(--vibeui-chart-023-muted)}
[data-vibeui-block="chart-023"] [data-part="data"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-023"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STAGES: Chart023Stage[] = [
  { label: "Лиды", value: 3400 },
  { label: "Квалификация", value: 2050 },
  { label: "Демо", value: 980 },
  { label: "Предложение", value: 520 },
  { label: "Сделка", value: 214 },
]

const WIDTH = 320
const TOP = 12
const BOTTOM = 168
const CX = 104
const MAX_HALF = 76
const MIN_SHARE = 0.1

/**
 * Воронка одной сплошной сужающейся фигурой с выносными подписями.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart023({
  title = "Воронка продаж",
  stages = DEFAULT_STAGES,
  unit = "сделок за месяц",
  accent,
  className,
  style,
  ...props
}: Chart023Props) {
  const first = stages[0]?.value || 1
  const bandHeight = (BOTTOM - TOP) / Math.max(stages.length, 1)

  const bands = stages.map((stage, index) => {
    const next = stages[index + 1]
    const topShare = Math.max(stage.value / first, MIN_SHARE)
    const bottomShare = Math.max((next ?? stage).value / first, MIN_SHARE)
    const y0 = TOP + index * bandHeight
    const y1 = y0 + bandHeight
    const topHalf = topShare * MAX_HALF
    const bottomHalf = bottomShare * MAX_HALF
    const midY = (y0 + y1) / 2
    const edgeX = CX + (topHalf + bottomHalf) / 2

    return { stage, index, y0, y1, topHalf, bottomHalf, midY, edgeX }
  })

  const palette = {
    ...(accent ? { "--vibeui-chart-023-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-023" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="chart-023"
        className={className}
        style={palette}
      >
        <figcaption data-part="title">{title}</figcaption>
        <svg viewBox={`0 0 ${WIDTH} 178`} aria-hidden="true" focusable="false">
          {bands.map((band) => {
            const previous = stages[band.index - 1]
            const dropPercent = previous
              ? Math.round((1 - band.stage.value / previous.value) * 100)
              : null

            return (
              <g key={band.stage.label}>
                <polygon
                  data-part="band"
                  style={
                    {
                      "--vibeui-chart-023-mix": `${Math.max(30, 90 - band.index * 14)}%`,
                    } as CSSProperties
                  }
                  points={`${CX - band.topHalf},${band.y0} ${CX + band.topHalf},${band.y0} ${CX + band.bottomHalf},${band.y1} ${CX - band.bottomHalf},${band.y1}`}
                />
                <line
                  data-part="lead"
                  x1={band.edgeX}
                  y1={band.midY}
                  x2={220}
                  y2={band.midY}
                />
                <text data-part="name" x={226} y={band.midY - 3}>
                  {band.stage.label}
                </text>
                <text data-part="figures" x={226} y={band.midY + 9}>
                  {band.stage.value}
                  {dropPercent !== null ? (
                    <tspan data-part="drop"> · −{dropPercent}%</tspan>
                  ) : null}
                </text>
              </g>
            )
          })}
        </svg>
        <p data-part="unit">
          Единица измерения: {unit}. Проценты у подписи — потеря относительно
          предыдущего этапа.
        </p>
        <table data-part="data">
          <caption>
            {title}, {unit}
          </caption>
          <thead>
            <tr>
              <th scope="col">Этап</th>
              <th scope="col">Количество</th>
              <th scope="col">Переход от предыдущего</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((stage, index) => {
              const previous = stages[index - 1]
              const conversion = previous
                ? `${Math.round((stage.value / previous.value) * 100)}%`
                : "—"

              return (
                <tr key={stage.label}>
                  <th scope="row">{stage.label}</th>
                  <td>{stage.value}</td>
                  <td>{conversion}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </figure>
    </>
  )
}

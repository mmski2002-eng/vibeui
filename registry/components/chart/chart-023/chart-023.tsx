import type { ComponentProps, CSSProperties } from "react"

export type Chart023Stage = {
  label: string
  value: number
}

export type Chart023Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  stages?: Chart023Stage[]
  unit?: string
  /** Подпись под воронкой: {unit}. */
  unitLabel?: string
  /** Шапка скрытой таблицы: ключи stage, count и conversion. */
  tableText?: Record<string, string>
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: воронка одной сплошной фигурой, а не стопкой раздельных
// трапеций. Полосы стыкуются без зазора, поэтому сужение читается как один
// конус, а не набор ступеней. Подписи вынесены наружу на выносных линиях —
// внутри узкой нижней полосы текст всё равно не помещается.
//
// Тема берётся из color-scheme окружения через light-dark(): воронка темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="chart-023"]){
--vibeui-chart-023-bg:transparent;
--vibeui-chart-023-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-chart-023-muted:color-mix(in oklab,var(--vibeui-chart-023-fg) 68%,transparent);
--vibeui-chart-023-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-chart-023-lead:light-dark(oklch(0.82 0 265),oklch(0.44 0 265));
--vibeui-chart-023-blend:light-dark(oklch(1 0 0),oklch(0.19 0 265));
--vibeui-chart-023-accent:light-dark(oklch(0.52 0.18 39.8),oklch(0.64 0.17 39.8));
--vibeui-chart-023-drop:light-dark(oklch(0.58 0.16 39.8),oklch(0.74 0.15 39.8));
--vibeui-chart-023-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-023"]{color-scheme:dark}
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
fill:color-mix(in oklab,var(--vibeui-chart-023-accent) var(--vibeui-chart-023-mix,70%),var(--vibeui-chart-023-blend));
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

const TABLE_TEXT: Record<string, string> = {
  stage: "Этап",
  count: "Количество",
  conversion: "Переход от предыдущего",
}

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
 * Воронка одной сплошной сужающейся фигурой с выносными подписями.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart023({
  title = "Воронка продаж",
  stages = DEFAULT_STAGES,
  unit = "сделок за месяц",
  unitLabel = "Единица измерения: {unit}. Проценты у подписи — потеря относительно предыдущего этапа.",
  tableText = TABLE_TEXT,
  accent,
  background = "",
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
    ...(background
      ? {
          "--vibeui-chart-023-bg": background,
          "--vibeui-chart-023-blend": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-023" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="chart"
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
        <p data-part="unit">{fillTemplate(unitLabel, { unit })}</p>
        <div data-part="data">
          <table>
            <caption>
              {title}, {unit}
            </caption>
            <thead>
              <tr>
                <th scope="col">{tableText.stage ?? TABLE_TEXT.stage}</th>
                <th scope="col">{tableText.count ?? TABLE_TEXT.count}</th>
                <th scope="col">
                  {tableText.conversion ?? TABLE_TEXT.conversion}
                </th>
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
        </div>
      </figure>
    </>
  )
}

import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Chart024Step = {
  label: string
  value: number
  total?: boolean
}

export type Chart024Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "children" | "title"
> & {
  title?: string
  steps?: Chart024Step[]
  unit?: string
  accent?: string
}

// Идея компонента: тот же мост между двумя итогами, что и в обычном
// waterfall, но лёжа на боку. Строки — это статьи бюджета, ось со шкалой
// идёт сверху, а не сбоку, поэтому длинные подписи статей не сжимаются в
// вертикальный текст. Уголковый коннектор ведёт от конца одной полосы
// к началу следующей: без него накопленный итог не проследить взглядом.
const STYLES = `
:where([data-vibeui-block="chart-024"]){
--vibeui-chart-024-bg:oklch(1 0 0);
--vibeui-chart-024-fg:oklch(0.22 0.014 265);
--vibeui-chart-024-muted:oklch(0.55 0.014 265);
--vibeui-chart-024-border:oklch(0.91 0.006 265);
--vibeui-chart-024-grid:oklch(0.94 0.005 265);
--vibeui-chart-024-up:oklch(0.6 0.14 155);
--vibeui-chart-024-down:oklch(0.6 0.17 25);
--vibeui-chart-024-total:oklch(0.42 0.03 265);
--vibeui-chart-024-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="chart-024"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:32rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-024-bg);
border:1px solid var(--vibeui-chart-024-border);border-radius:0.875rem;
color:var(--vibeui-chart-024-fg);font-family:var(--vibeui-chart-024-font);
}
[data-vibeui-block="chart-024"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="chart-024"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="chart-024"] [data-part="grid"]{stroke:var(--vibeui-chart-024-grid);stroke-width:1}
[data-vibeui-block="chart-024"] [data-part="tick"]{
fill:var(--vibeui-chart-024-muted);font-size:7.5px;text-anchor:middle;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-024"] [data-part="bar"][data-kind="up"]{fill:var(--vibeui-chart-024-up)}
[data-vibeui-block="chart-024"] [data-part="bar"][data-kind="down"]{fill:var(--vibeui-chart-024-down)}
[data-vibeui-block="chart-024"] [data-part="bar"][data-kind="total"]{fill:var(--vibeui-chart-024-total)}
[data-vibeui-block="chart-024"] [data-part="connector"]{
stroke:var(--vibeui-chart-024-muted);stroke-width:1;stroke-dasharray:2 2;
}
[data-vibeui-block="chart-024"] [data-part="label"]{
fill:var(--vibeui-chart-024-fg);font-size:8px;text-anchor:start;
}
[data-vibeui-block="chart-024"] [data-part="value"]{
fill:var(--vibeui-chart-024-muted);font-size:8px;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-024"] [data-part="key"]{display:flex;flex-wrap:wrap;gap:0.25rem 0.875rem;margin:0;padding:0;list-style:none;font-size:0.6875rem;color:var(--vibeui-chart-024-muted)}
[data-vibeui-block="chart-024"] [data-part="key"] li{display:flex;align-items:center;gap:0.375rem}
[data-vibeui-block="chart-024"] [data-part="chip"]{width:0.625rem;height:0.625rem;border-radius:2px}
[data-vibeui-block="chart-024"] [data-part="chip"][data-kind="up"]{background:var(--vibeui-chart-024-up)}
[data-vibeui-block="chart-024"] [data-part="chip"][data-kind="down"]{background:var(--vibeui-chart-024-down)}
[data-vibeui-block="chart-024"] [data-part="chip"][data-kind="total"]{background:var(--vibeui-chart-024-total)}
[data-vibeui-block="chart-024"] [data-part="unit"]{margin:0;font-size:0.75rem;color:var(--vibeui-chart-024-muted)}
[data-vibeui-block="chart-024"] [data-part="data"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-024"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS: Chart024Step[] = [
  { label: "Остаток на начало", value: 860, total: true },
  { label: "Выручка", value: 640 },
  { label: "Себестоимость", value: -310 },
  { label: "Маркетинг", value: -145 },
  { label: "Аренда и ФОТ", value: -220 },
  { label: "Остаток на конец", value: 825, total: true },
]

const LEFT = 132
const RIGHT = 306
const ROW_HEIGHT = 26
const TOP = 22

function niceCeil(value: number) {
  if (value <= 0) return 1

  const power = 10 ** Math.floor(Math.log10(value))

  for (const step of [1, 2, 2.5, 5]) {
    if (value <= step * power) return step * power
  }

  return 10 * power
}

/**
 * Waterfall на боку: статьи бюджета строками, шкала сверху.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart024({
  title = "Мост от остатка к остатку",
  steps = DEFAULT_STEPS,
  unit = "тысяч рублей",
  accent,
  className,
  style,
  ...props
}: Chart024Props) {
  const bars = steps.reduce<
    { step: Chart024Step; from: number; to: number; kind: string }[]
  >((done, step) => {
    const previous = done.length > 0 ? done[done.length - 1].to : 0
    const from = step.total ? 0 : previous
    const to = step.total ? step.value : previous + step.value

    return [
      ...done,
      {
        step,
        from,
        to,
        kind: step.total ? "total" : step.value >= 0 ? "up" : "down",
      },
    ]
  }, [])

  const ceiling = niceCeil(
    Math.max(...bars.map((bar) => Math.max(bar.from, bar.to)), 1),
  )
  const ticks = [0, ceiling / 2, ceiling]
  const height = TOP + bars.length * ROW_HEIGHT + 8
  const x = (value: number) => LEFT + (value / ceiling) * (RIGHT - LEFT)

  const palette = {
    ...(accent ? { "--vibeui-chart-024-total": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-024" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="chart-024"
        className={className}
        style={palette}
      >
        <figcaption data-part="title">{title}</figcaption>
        <svg viewBox={`0 0 320 ${height}`} aria-hidden="true" focusable="false">
          {ticks.map((tick) => (
            <line
              key={tick}
              data-part="grid"
              x1={x(tick)}
              y1={8}
              x2={x(tick)}
              y2={height - 2}
            />
          ))}
          {ticks.map((tick) => (
            <text key={`t${tick}`} data-part="tick" x={x(tick)} y={8}>
              {Math.round(tick)}
            </text>
          ))}
          {bars.map((bar, index) => {
            const y = TOP + index * ROW_HEIGHT
            const barHeight = 14
            const barY = y + (ROW_HEIGHT - barHeight) / 2
            const barX = Math.min(x(bar.from), x(bar.to))
            const barWidth = Math.max(Math.abs(x(bar.to) - x(bar.from)), 2)
            const next = bars[index + 1]

            return (
              <g key={bar.step.label}>
                <text data-part="label" x={4} y={y + ROW_HEIGHT / 2 + 3}>
                  {bar.step.label}
                </text>
                <rect
                  data-part="bar"
                  data-kind={bar.kind}
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  rx={2}
                />
                <text
                  data-part="value"
                  x={Math.max(x(bar.from), x(bar.to)) + 4}
                  y={y + ROW_HEIGHT / 2 + 3}
                >
                  {bar.step.total
                    ? bar.step.value
                    : `${bar.step.value > 0 ? "+" : ""}${bar.step.value}`}
                </text>
                {next && !next.step.total ? (
                  <line
                    data-part="connector"
                    x1={x(bar.to)}
                    y1={barY + barHeight}
                    x2={x(bar.to)}
                    y2={y + ROW_HEIGHT + (ROW_HEIGHT - barHeight) / 2}
                  />
                ) : null}
              </g>
            )
          })}
        </svg>
        <ul data-part="key">
          <li>
            <span data-part="chip" data-kind="up" aria-hidden="true" />
            приход
          </li>
          <li>
            <span data-part="chip" data-kind="down" aria-hidden="true" />
            расход
          </li>
          <li>
            <span data-part="chip" data-kind="total" aria-hidden="true" />
            итог
          </li>
        </ul>
        <p data-part="unit">Единица измерения: {unit}</p>
        <table data-part="data">
          <caption>
            {title}, {unit}
          </caption>
          <tbody>
            {bars.map((bar) => (
              <tr key={bar.step.label}>
                <th scope="row">{bar.step.label}</th>
                <td>{bar.step.value}</td>
                <td>накопленный итог {bar.to}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>
    </>
  )
}

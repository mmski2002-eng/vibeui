import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Chart018Step = {
  label: string
  value: number
  total?: boolean
}

export type Chart018Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "children" | "title"
> & {
  title?: string
  steps?: Chart018Step[]
  unit?: string
  accent?: string
}

// Идея компонента: waterfall — как из начального остатка получился конечный.
// Столбцы приходов и расходов висят в воздухе на накопленной сумме, итоговые
// стоят на нуле, а пунктирные перемычки не дают потерять уровень между
// шагами. Знак значения красит столбец, поэтому расход нельзя сделать зелёным.
const STYLES = `
:where([data-vibeui-block="chart-018"]){
--vibeui-chart-018-bg:oklch(1 0 0);
--vibeui-chart-018-fg:oklch(0.22 0.014 265);
--vibeui-chart-018-muted:oklch(0.55 0.014 265);
--vibeui-chart-018-border:oklch(0.91 0.006 265);
--vibeui-chart-018-grid:oklch(0.94 0.005 265);
--vibeui-chart-018-up:oklch(0.62 0.13 155);
--vibeui-chart-018-down:oklch(0.62 0.16 25);
--vibeui-chart-018-total:oklch(0.42 0.03 265);
--vibeui-chart-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="chart-018"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:32rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-018-bg);
border:1px solid var(--vibeui-chart-018-border);border-radius:0.875rem;
color:var(--vibeui-chart-018-fg);font-family:var(--vibeui-chart-018-font);
}
[data-vibeui-block="chart-018"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="chart-018"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="chart-018"] [data-part="grid"]{stroke:var(--vibeui-chart-018-grid);stroke-width:1}
[data-vibeui-block="chart-018"] [data-part="bar"][data-kind="up"]{fill:var(--vibeui-chart-018-up)}
[data-vibeui-block="chart-018"] [data-part="bar"][data-kind="down"]{fill:var(--vibeui-chart-018-down)}
[data-vibeui-block="chart-018"] [data-part="bar"][data-kind="total"]{fill:var(--vibeui-chart-018-total)}
[data-vibeui-block="chart-018"] [data-part="link"]{
stroke:var(--vibeui-chart-018-muted);stroke-width:1;stroke-dasharray:3 3;
}
[data-vibeui-block="chart-018"] [data-part="value"]{
fill:var(--vibeui-chart-018-fg);font-size:8.5px;font-weight:600;text-anchor:middle;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-018"] [data-part="name"]{
fill:var(--vibeui-chart-018-muted);font-size:8px;text-anchor:middle;
}
[data-vibeui-block="chart-018"] [data-part="key"]{
display:flex;flex-wrap:wrap;gap:0.25rem 0.875rem;margin:0;padding:0;list-style:none;
font-size:0.6875rem;color:var(--vibeui-chart-018-muted);
}
[data-vibeui-block="chart-018"] [data-part="key"] li{display:flex;align-items:center;gap:0.375rem}
[data-vibeui-block="chart-018"] [data-part="chip"]{width:0.625rem;height:0.625rem;border-radius:2px}
[data-vibeui-block="chart-018"] [data-part="chip"][data-kind="up"]{background:var(--vibeui-chart-018-up)}
[data-vibeui-block="chart-018"] [data-part="chip"][data-kind="down"]{background:var(--vibeui-chart-018-down)}
[data-vibeui-block="chart-018"] [data-part="chip"][data-kind="total"]{background:var(--vibeui-chart-018-total)}
[data-vibeui-block="chart-018"] [data-part="unit"]{margin:0;font-size:0.75rem;color:var(--vibeui-chart-018-muted)}
[data-vibeui-block="chart-018"] [data-part="data"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-018"] *{animation:none!important;transition:none!important}}
`

const LEFT = 8
const RIGHT = 332
const TOP = 24
const BASE = 126

const DEFAULT_STEPS: Chart018Step[] = [
  { label: "Начало", value: 420, total: true },
  { label: "Продажи", value: 260 },
  { label: "Продления", value: 140 },
  { label: "Возвраты", value: -90 },
  { label: "Расходы", value: -215 },
  { label: "Итог", value: 515, total: true },
]

/**
 * Waterfall: приходы и расходы между двумя итогами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart018({
  title = "Движение денег за квартал",
  steps = DEFAULT_STEPS,
  unit = "тысяч рублей",
  accent,
  className,
  style,
  ...props
}: Chart018Props) {
  // Накопленная сумма считается заранее: каждому столбцу нужны и низ, и верх,
  // а не только значение. Список собирается копированием, чтобы во время
  // отрисовки не мутировался внешний счётчик.
  const bars = steps.reduce<
    { step: Chart018Step; from: number; to: number; kind: string }[]
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

  const ceiling = Math.max(...bars.map((bar) => Math.max(bar.from, bar.to)), 1)
  const band = (RIGHT - LEFT) / Math.max(bars.length, 1)
  const width = Math.min(band * 0.58, 40)
  const y = (value: number) => BASE - (value / ceiling) * (BASE - TOP)

  const palette = {
    ...(accent ? { "--vibeui-chart-018-total": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-018" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="chart-018"
        className={className}
        style={palette}
      >
        <figcaption data-part="title">{title}</figcaption>
        <svg viewBox="0 0 340 150" aria-hidden="true" focusable="false">
          <line data-part="grid" x1={LEFT} y1={BASE} x2={RIGHT} y2={BASE} />
          {bars.map((bar, index) => {
            const x = LEFT + band * index + (band - width) / 2
            const top = Math.min(y(bar.from), y(bar.to))
            const height = Math.max(Math.abs(y(bar.from) - y(bar.to)), 2)
            const next = bars[index + 1]

            return (
              <g key={bar.step.label}>
                <rect
                  data-part="bar"
                  data-kind={bar.kind}
                  x={x}
                  y={top}
                  width={width}
                  height={height}
                  rx={2}
                />
                <text data-part="value" x={x + width / 2} y={top - 5}>
                  {bar.step.total
                    ? bar.step.value
                    : `${bar.step.value > 0 ? "+" : ""}${bar.step.value}`}
                </text>
                <text data-part="name" x={x + width / 2} y={BASE + 14}>
                  {bar.step.label}
                </text>
                {next && !next.step.total ? (
                  <line
                    data-part="link"
                    x1={x + width}
                    y1={y(bar.to)}
                    x2={x + band}
                    y2={y(bar.to)}
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

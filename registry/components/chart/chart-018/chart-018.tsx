import type { ComponentProps, CSSProperties } from "react"

export type Chart018Step = {
  label: string
  value: number
  total?: boolean
}

export type Chart018Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  steps?: Chart018Step[]
  unit?: string
  /** Подпись под графиком: {unit}. */
  unitLabel?: string
  /** Легенда: ключи up, down и total. */
  keyText?: Record<string, string>
  /** Накопленный итог в скрытой таблице: {total}. */
  runningLabel?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: waterfall — как из начального остатка получился конечный.
// Столбцы приходов и расходов висят в воздухе на накопленной сумме, итоговые
// стоят на нуле, а пунктирные перемычки не дают потерять уровень между
// шагами. Знак значения красит столбец, поэтому расход нельзя сделать зелёным.
//
// Тема берётся из color-scheme окружения через light-dark(): график темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="chart-018"]){
--vibeui-chart-018-bg:transparent;
--vibeui-chart-018-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-chart-018-muted:color-mix(in oklab,var(--vibeui-chart-018-fg) 68%,transparent);
--vibeui-chart-018-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-chart-018-grid:light-dark(oklch(0.94 0 265),oklch(0.31 0 265));
--vibeui-chart-018-up:light-dark(oklch(0.62 0.13 155),oklch(0.74 0.14 155));
--vibeui-chart-018-down:light-dark(oklch(0.62 0.16 25),oklch(0.71 0.16 25));
--vibeui-chart-018-total:light-dark(oklch(0.42 0 265),oklch(0.78 0 265));
--vibeui-chart-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-018"]{color-scheme:dark}
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

const KEY_TEXT: Record<string, string> = {
  up: "приход",
  down: "расход",
  total: "итог",
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
 * Waterfall: приходы и расходы между двумя итогами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart018({
  title = "Движение денег за квартал",
  steps = DEFAULT_STEPS,
  unit = "тысяч рублей",
  unitLabel = "Единица измерения: {unit}",
  keyText = KEY_TEXT,
  runningLabel = "накопленный итог {total}",
  accent,
  background = "",
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
    ...(background
      ? {
          "--vibeui-chart-018-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-018" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="chart"
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
            {keyText.up ?? KEY_TEXT.up}
          </li>
          <li>
            <span data-part="chip" data-kind="down" aria-hidden="true" />
            {keyText.down ?? KEY_TEXT.down}
          </li>
          <li>
            <span data-part="chip" data-kind="total" aria-hidden="true" />
            {keyText.total ?? KEY_TEXT.total}
          </li>
        </ul>
        <p data-part="unit">{fillTemplate(unitLabel, { unit })}</p>
        <div data-part="data">
          <table>
            <caption>
              {title}, {unit}
            </caption>
            <tbody>
              {bars.map((bar) => (
                <tr key={bar.step.label}>
                  <th scope="row">{bar.step.label}</th>
                  <td>{bar.step.value}</td>
                  <td>{fillTemplate(runningLabel, { total: bar.to })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>
    </>
  )
}

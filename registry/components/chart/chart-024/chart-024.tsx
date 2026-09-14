import type { ComponentProps, CSSProperties } from "react"

export type Chart024Step = {
  label: string
  value: number
  total?: boolean
}

export type Chart024Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  steps?: Chart024Step[]
  unit?: string
  /** Подпись под графиком: {unit}. */
  unitLabel?: string
  /** Легенда: ключи up, down и total. */
  keyText?: Record<string, string>
  /** Накопленный итог в скрытой таблице: {total}. */
  runningLabel?: string
  /** Растить полосы по очереди при появлении. */
  animate?: boolean
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: тот же мост между двумя итогами, что и в обычном
// waterfall, но лёжа на боку. Строки — это статьи бюджета, ось со шкалой
// идёт сверху, а не сбоку, поэтому длинные подписи статей не сжимаются в
// вертикальный текст. Уголковый коннектор ведёт от конца одной полосы
// к началу следующей: без него накопленный итог не проследить взглядом.
//
// Тема берётся из color-scheme окружения через light-dark(): мост темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="chart-024"]){
--vibeui-chart-024-bg:transparent;
--vibeui-chart-024-dur:0.7s;
--vibeui-chart-024-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-chart-024-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-chart-024-muted:color-mix(in oklab,var(--vibeui-chart-024-fg) 68%,transparent);
--vibeui-chart-024-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-chart-024-grid:light-dark(oklch(0.94 0 265),oklch(0.31 0 265));
--vibeui-chart-024-up:light-dark(oklch(0.6 0.14 155),oklch(0.74 0.14 155));
--vibeui-chart-024-down:light-dark(oklch(0.6 0.17 25),oklch(0.71 0.16 25));
--vibeui-chart-024-total:light-dark(oklch(0.42 0 265),oklch(0.78 0 265));
--vibeui-chart-024-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-024"]{color-scheme:dark}
[data-vibeui-block="chart-024"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:32rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-024-bg);
border:1px solid var(--vibeui-chart-024-border);border-radius:0.875rem;
color:var(--vibeui-chart-024-fg);font-family:var(--vibeui-chart-024-font);
}
\[data\-vibeui\-block="chart\-024"\] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650;letter-spacing:-0.01em}
[data-vibeui-block="chart-024"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="chart-024"] [data-part="grid"]{stroke:var(--vibeui-chart-024-grid);stroke-width:1}
[data-vibeui-block="chart-024"] [data-part="tick"]{
fill:var(--vibeui-chart-024-muted);font-size:7.5px;text-anchor:middle;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-024"] svg{overflow:visible}
[data-vibeui-block="chart-024"] [data-part="bar"]{transform-box:fill-box;transform-origin:left;transition:opacity 0.2s,filter 0.2s}
[data-vibeui-block="chart-024"] [data-part="bar"][data-kind="down"]{transform-origin:right}
[data-vibeui-block="chart-024"] svg:hover g:not(:hover) [data-part="bar"]{opacity:0.5}
[data-vibeui-block="chart-024"] g:hover [data-part="bar"]{filter:brightness(1.08)}
[data-vibeui-block="chart-024"] g:hover [data-part="value"]{fill:var(--vibeui-chart-024-fg);font-weight:700}
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
/* Появление: полосы вырастают по очереди, коннекторы и цифры следом. */
[data-vibeui-block="chart-024"][data-animate] [data-part="bar"]{transform:scaleX(0);animation:vibeui-chart-024-grow var(--vibeui-chart-024-dur) var(--vibeui-chart-024-ease) calc(var(--i) * 100ms) forwards}
[data-vibeui-block="chart-024"][data-animate] [data-part="value"],[data-vibeui-block="chart-024"][data-animate] [data-part="connector"]{opacity:0;animation:vibeui-chart-024-fade 0.35s var(--vibeui-chart-024-ease) calc(var(--i) * 100ms + 0.45s) forwards}
@keyframes vibeui-chart-024-grow{to{transform:scaleX(1)}}
@keyframes vibeui-chart-024-fade{to{opacity:1}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="chart-024"] *{animation:none!important;transition:none!important}
[data-vibeui-block="chart-024"][data-animate] [data-part="bar"]{transform:none}
[data-vibeui-block="chart-024"][data-animate] [data-part="value"],[data-vibeui-block="chart-024"][data-animate] [data-part="connector"]{opacity:1}
}
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
 * Waterfall на боку: статьи бюджета строками, шкала сверху.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart024({
  title = "Мост от остатка к остатку",
  steps = DEFAULT_STEPS,
  unit = "тысяч рублей",
  unitLabel = "Единица измерения: {unit}",
  keyText = KEY_TEXT,
  runningLabel = "накопленный итог {total}",
  animate = true,
  accent,
  background = "",
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
    ...(background
      ? {
          "--vibeui-chart-024-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-024" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="chart"
        data-vibeui-block="chart-024"
        data-animate={animate ? "" : undefined}
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
              <g key={bar.step.label} style={{ "--i": index } as CSSProperties}>
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

import type { ComponentProps, CSSProperties } from "react"

export type Chart026Row = {
  label: string
  /** Текущее значение — оно же последняя точка ряда. */
  value: string
  /** Изменение за период: знак решает цвет. */
  change: number
  /** Ряд для микрографика: 6–20 значений, больше в такой ширине не читается. */
  series: number[]
}

export type Chart026Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  rows?: Chart026Row[]
  /** Подпись под таблицей: {count}. */
  unitLabel?: string
  /** Рост вверх — это хорошо. Выключите там, где рост означает потери. */
  riseIsGood?: boolean
  /** Въезжать строками и прорисовывать спарклайны при появлении. */
  animate?: boolean
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: показатели строками, у каждой свой микрографик. Числа
// отвечают «сколько сейчас», спарклайн — «как шло», и оба ответа читаются
// одним взглядом, без перехода на отдельную страницу с графиком.
//
// Спарклайн намеренно без осей и подписей: на такой ширине они превратились бы
// в шум, а форма линии и так показывает направление.
const STYLES = `
:where([data-vibeui-block="chart-026"]){
--vibeui-chart-026-bg:transparent;
--vibeui-chart-026-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-chart-026-muted:color-mix(in oklab,var(--vibeui-chart-026-fg) 64%,transparent);
--vibeui-chart-026-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-chart-026-rule:light-dark(oklch(0.94 0 265),oklch(0.3 0 265));
--vibeui-chart-026-accent:light-dark(oklch(0.53 0.14 166),oklch(0.78 0.14 166));
--vibeui-chart-026-dur:0.9s;
--vibeui-chart-026-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-chart-026-good:light-dark(oklch(0.52 0.15 152),oklch(0.75 0.14 152));
--vibeui-chart-026-bad:light-dark(oklch(0.55 0.19 25),oklch(0.74 0.16 25));
--vibeui-chart-026-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-026"]{color-scheme:dark}
[data-vibeui-block="chart-026"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:28rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-026-bg);
border:1px solid var(--vibeui-chart-026-border);border-radius:0.875rem;
color:var(--vibeui-chart-026-fg);font-family:var(--vibeui-chart-026-font);
}
[data-vibeui-block="chart-026"] *{box-sizing:border-box}
\[data\-vibeui\-block="chart\-026"\] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650;letter-spacing:-0.01em}
[data-vibeui-block="chart-026"] [data-part="rows"]{
display:flex;flex-direction:column;
margin:0;padding:0;list-style:none;
}
[data-vibeui-block="chart-026"] [data-part="row"]{
display:grid;align-items:center;gap:0.25rem 0.75rem;
grid-template-columns:minmax(0,1fr) auto 4.25rem;
padding:0.5rem 0;
}
[data-vibeui-block="chart-026"] [data-part="row"] + [data-part="row"]{
border-top:1px solid var(--vibeui-chart-026-rule);
}
[data-vibeui-block="chart-026"] [data-part="name"]{
min-width:0;font-size:0.8125rem;line-height:1.3;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="chart-026"] [data-part="figures"]{
display:flex;align-items:baseline;gap:0.375rem;
}
[data-vibeui-block="chart-026"] [data-part="value"]{
font-size:0.9375rem;font-weight:680;font-variant-numeric:tabular-nums;line-height:1.2;
}
[data-vibeui-block="chart-026"] [data-part="change"]{
font-size:0.75rem;font-weight:600;font-variant-numeric:tabular-nums;
color:var(--vibeui-chart-026-muted);
}
[data-vibeui-block="chart-026"] [data-part="change"][data-tone="good"]{color:var(--vibeui-chart-026-good)}
[data-vibeui-block="chart-026"] [data-part="change"][data-tone="bad"]{color:var(--vibeui-chart-026-bad)}
[data-vibeui-block="chart-026"] [data-part="spark"]{display:block;width:100%;height:1.375rem}
[data-vibeui-block="chart-026"] [data-part="row"]{transition:opacity 0.2s,background-color 0.2s;border-radius:0.375rem}
[data-vibeui-block="chart-026"] [data-part="rows"]:hover [data-part="row"]:not(:hover){opacity:0.55}
[data-vibeui-block="chart-026"] [data-part="row"]:hover [data-part="value"]{color:var(--vibeui-chart-026-accent)}
[data-vibeui-block="chart-026"] [data-part="line"]{
fill:none;stroke:var(--vibeui-chart-026-accent);stroke-width:1.75;
stroke-linejoin:round;stroke-linecap:round;vector-effect:non-scaling-stroke;
filter:drop-shadow(0 0 3px color-mix(in oklab,var(--vibeui-chart-026-accent) 40%,transparent));
}
[data-vibeui-block="chart-026"] [data-part="area"]{
fill:var(--vibeui-chart-026-accent);opacity:0.16;stroke:none;
}
[data-vibeui-block="chart-026"] [data-part="last"]{fill:var(--vibeui-chart-026-accent)}
[data-vibeui-block="chart-026"] [data-part="unit"]{margin:0;font-size:0.75rem;color:var(--vibeui-chart-026-muted)}
/* Узкая колонка: спарклайн уходит под строку во всю ширину, иначе на трёх
   колонках имя показателя сжимается до пары букв. */
@media (max-width:24rem){
[data-vibeui-block="chart-026"] [data-part="row"]{grid-template-columns:minmax(0,1fr) auto}
[data-vibeui-block="chart-026"] [data-part="spark"]{grid-column:1 / -1;height:1.75rem}
}
[data-vibeui-block="chart-026"] [data-part="data"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
/* Появление: строки въезжают по очереди, спарклайны открываются слева направо. */
[data-vibeui-block="chart-026"][data-animate] [data-part="row"]{opacity:0;translate:0 0.35rem;animation:vibeui-chart-026-rise 0.5s var(--vibeui-chart-026-ease) calc(var(--i) * 80ms) forwards}
[data-vibeui-block="chart-026"][data-animate] [data-part="line"],[data-vibeui-block="chart-026"][data-animate] [data-part="area"]{clip-path:inset(-30% 100% -30% 0);animation:vibeui-chart-026-draw 0.8s var(--vibeui-chart-026-ease) calc(var(--i) * 80ms + 0.2s) forwards}
[data-vibeui-block="chart-026"][data-animate] [data-part="last"]{opacity:0;animation:vibeui-chart-026-fade 0.3s var(--vibeui-chart-026-ease) calc(var(--i) * 80ms + 0.9s) forwards}
@keyframes vibeui-chart-026-rise{to{opacity:1;translate:0 0}}
@keyframes vibeui-chart-026-draw{to{clip-path:inset(-30% 0 -30% 0)}}
@keyframes vibeui-chart-026-fade{to{opacity:1}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="chart-026"] *{animation:none!important;transition:none!important}
[data-vibeui-block="chart-026"][data-animate] [data-part="row"],[data-vibeui-block="chart-026"][data-animate] [data-part="last"]{opacity:1;translate:none}
[data-vibeui-block="chart-026"][data-animate] [data-part="line"],[data-vibeui-block="chart-026"][data-animate] [data-part="area"]{clip-path:none}
}
`

const WIDTH = 68
const HEIGHT = 22

const DEFAULT_ROWS: Chart026Row[] = [
  {
    label: "Выручка",
    value: "4,8 млн",
    change: 12.4,
    series: [31, 34, 33, 38, 41, 39, 44, 48],
  },
  {
    label: "Новые клиенты",
    value: "312",
    change: 5.1,
    series: [22, 25, 24, 23, 27, 26, 29, 31],
  },
  {
    label: "Повторные покупки",
    value: "41 %",
    change: 2.6,
    series: [33, 34, 36, 35, 38, 37, 40, 41],
  },
  {
    label: "Средний чек",
    value: "15 400 ₽",
    change: -3.2,
    series: [19, 21, 20, 18, 17, 18, 16, 15],
  },
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

/** Точки спарклайна в системе координат 68×22 с полем в 2 единицы по краям. */
function place(series: number[]) {
  const max = Math.max(...series)
  const min = Math.min(...series)
  const span = max - min || 1

  return series.map((value, index) => ({
    x:
      2 + (series.length > 1 ? (index / (series.length - 1)) * (WIDTH - 4) : 0),
    y: HEIGHT - 3 - ((value - min) / span) * (HEIGHT - 6),
  }))
}

/**
 * Показатели строками, у каждой свой микрографик.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart026({
  title = "Показатели за месяц",
  rows = DEFAULT_ROWS,
  unitLabel = "Показателей: {count}. Микрографик показывает восемь последних значений ряда.",
  riseIsGood = true,
  animate = true,
  accent,
  background = "",
  className,
  style,
  ...props
}: Chart026Props) {
  const palette = {
    ...(accent ? { "--vibeui-chart-026-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-chart-026-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-026" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="chart"
        data-vibeui-block="chart-026"
        data-animate={animate ? "" : undefined}
        className={className}
        style={palette}
      >
        <figcaption data-part="title">{title}</figcaption>
        <ul data-part="rows">
          {rows.map((row, index) => {
            const spots = place(row.series)
            const line = spots
              .map(
                (spot, index) =>
                  `${index === 0 ? "M" : "L"}${spot.x} ${spot.y}`,
              )
              .join(" ")
            const area = `${line} L${spots[spots.length - 1].x} ${HEIGHT} L${spots[0].x} ${HEIGHT} Z`
            const last = spots[spots.length - 1]
            const rising = row.change >= 0
            const tone = rising === riseIsGood ? "good" : "bad"

            return (
              <li key={row.label} data-part="row" style={{ "--i": index } as CSSProperties}>
                <span data-part="name">{row.label}</span>
                <span data-part="figures">
                  <span data-part="value">{row.value}</span>
                  <span data-part="change" data-tone={tone}>
                    {rising ? "+" : "−"}
                    {Math.abs(row.change).toLocaleString("ru-RU")} %
                  </span>
                </span>
                <svg
                  data-part="spark"
                  viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path data-part="area" d={area} />
                  <path data-part="line" d={line} />
                  <circle data-part="last" cx={last.x} cy={last.y} r={2} />
                </svg>
              </li>
            )
          })}
        </ul>
        <p data-part="unit">
          {fillTemplate(unitLabel, { count: rows.length })}
        </p>
        <div data-part="data">
          <table>
            <caption>{title}</caption>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  <td>{row.value}</td>
                  <td>
                    {row.change >= 0 ? "+" : "−"}
                    {Math.abs(row.change).toLocaleString("ru-RU")} %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>
    </>
  )
}

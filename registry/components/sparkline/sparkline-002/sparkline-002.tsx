import type { ComponentProps, CSSProperties } from "react"

export type Sparkline002Row = {
  label: string
  value: string
  delta: number
  values: number[]
}

export type Sparkline002Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  caption?: string
  rows?: Sparkline002Row[]
  period?: string
  /** Заголовки колонок: компонент несёт русские, проект подставляет свои. */
  headings?: Record<string, string>
  /** Пояснение под заголовком; {period} подставляется. */
  note?: string
  accent?: string
  /** Пусто — подложки нет, таблица лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: таблица метрик, где динамика живёт прямо в строке. Данные
// здесь уже текст — таблица и есть текстовая альтернатива графику, поэтому
// кривые помечены aria-hidden и не мешают скринридеру. Направление кривой
// выводится из знака delta, так что цвет не может разойтись со смыслом.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// таблицы по умолчанию нет, она темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="sparkline-002"]){
--vibeui-sparkline-002-bg:transparent;
--vibeui-sparkline-002-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-sparkline-002-muted:color-mix(in oklab,var(--vibeui-sparkline-002-fg) 68%,transparent);
--vibeui-sparkline-002-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-sparkline-002-up:light-dark(oklch(0.58 0.14 155),oklch(0.76 0.13 155));
--vibeui-sparkline-002-down:light-dark(oklch(0.6 0.16 25),oklch(0.73 0.16 25));
--vibeui-sparkline-002-flat:light-dark(oklch(0.62 0.01 265),oklch(0.66 0.01 265));
--vibeui-sparkline-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sparkline-002"]{color-scheme:dark}
[data-vibeui-block="sparkline-002"]{
width:100%;max-width:32rem;box-sizing:border-box;overflow-x:auto;
background:var(--vibeui-sparkline-002-bg);
border:1px solid var(--vibeui-sparkline-002-border);border-radius:0.875rem;
color:var(--vibeui-sparkline-002-fg);font-family:var(--vibeui-sparkline-002-font);
font-size:0.8125rem;
}
[data-vibeui-block="sparkline-002"] table{width:100%;border-collapse:collapse}
[data-vibeui-block="sparkline-002"] caption{
padding:0.75rem 0.875rem 0.5rem;text-align:left;font-size:0.875rem;font-weight:650;
color:var(--vibeui-sparkline-002-fg);
}
[data-vibeui-block="sparkline-002"] caption span{
display:block;font-size:0.75rem;font-weight:400;color:var(--vibeui-sparkline-002-muted);
}
[data-vibeui-block="sparkline-002"] th,
[data-vibeui-block="sparkline-002"] td{
padding:0.5rem 0.875rem;text-align:left;border-top:1px solid var(--vibeui-sparkline-002-border);
}
[data-vibeui-block="sparkline-002"] thead th{
font-size:0.6875rem;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;
color:var(--vibeui-sparkline-002-muted);
}
[data-vibeui-block="sparkline-002"] [data-part="value"],
[data-vibeui-block="sparkline-002"] [data-part="delta"]{
text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap;
}
[data-vibeui-block="sparkline-002"] [data-part="value"]{font-weight:650}
[data-vibeui-block="sparkline-002"] [data-part="delta"][data-trend="up"]{color:var(--vibeui-sparkline-002-up)}
[data-vibeui-block="sparkline-002"] [data-part="delta"][data-trend="down"]{color:var(--vibeui-sparkline-002-down)}
[data-vibeui-block="sparkline-002"] [data-part="delta"][data-trend="flat"]{color:var(--vibeui-sparkline-002-flat)}
[data-vibeui-block="sparkline-002"] [data-part="spark"]{width:6rem;padding-right:0}
[data-vibeui-block="sparkline-002"] svg{display:block;width:5.5rem;height:1.5rem}
/* Толщина линии не масштабируется вместе с viewBox: иначе в узкой колонке
   кривая становится ниткой, а в широкой — жирной. */
[data-vibeui-block="sparkline-002"] [data-part="line"]{
fill:none;stroke-width:1.5;stroke-linejoin:round;stroke-linecap:round;
vector-effect:non-scaling-stroke;
}
[data-vibeui-block="sparkline-002"] tr[data-trend="up"] [data-part="line"]{stroke:var(--vibeui-sparkline-002-up)}
[data-vibeui-block="sparkline-002"] tr[data-trend="down"] [data-part="line"]{stroke:var(--vibeui-sparkline-002-down)}
[data-vibeui-block="sparkline-002"] tr[data-trend="flat"] [data-part="line"]{stroke:var(--vibeui-sparkline-002-flat)}
[data-vibeui-block="sparkline-002"] [data-part="last"]{r:2}
[data-vibeui-block="sparkline-002"] tr[data-trend="up"] [data-part="last"]{fill:var(--vibeui-sparkline-002-up)}
[data-vibeui-block="sparkline-002"] tr[data-trend="down"] [data-part="last"]{fill:var(--vibeui-sparkline-002-down)}
[data-vibeui-block="sparkline-002"] tr[data-trend="flat"] [data-part="last"]{fill:var(--vibeui-sparkline-002-flat)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sparkline-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Sparkline002Row[] = [
  {
    label: "Визиты",
    value: "48 210",
    delta: 8.4,
    values: [31, 34, 33, 38, 41, 44, 48],
  },
  {
    label: "Регистрации",
    value: "1 284",
    delta: 12.1,
    values: [8, 9, 11, 10, 12, 12, 14],
  },
  {
    label: "Отказы",
    value: "37,2 %",
    delta: -3.6,
    values: [44, 43, 41, 42, 39, 38, 37],
  },
  {
    label: "Средний чек",
    value: "2 940 ₽",
    delta: 0.2,
    values: [29, 30, 29, 30, 29, 30, 29],
  },
]

const HEADINGS: Record<string, string> = {
  metric: "Метрика",
  value: "Значение",
  trend: "Динамика",
  change: "Изменение",
}

const NOTE = "Динамика {period}, изменение — к прошлому периоду"

// Ниже полупроцента изменение считается шумом: колебание в 0,1 % не должно
// краситься как рост.
const FLAT = 0.5

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

function pathFor(values: number[]) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const span = max - min || 1

  return values
    .map((value, index) => {
      const x = values.length > 1 ? (index / (values.length - 1)) * 100 : 0
      const y = 22 - ((value - min) / span) * 18

      return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(" ")
}

function lastPoint(values: number[]) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const span = max - min || 1
  const value = values[values.length - 1]

  return { x: 100, y: 22 - ((value - min) / span) * 18 }
}

/**
 * Таблица метрик со спарклайном в каждой строке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sparkline002({
  caption = "Ключевые метрики",
  rows = DEFAULT_ROWS,
  period = "за последние 7 дней",
  headings = HEADINGS,
  note = NOTE,
  accent,
  background = "",
  className,
  style,
  ...props
}: Sparkline002Props) {
  const palette = {
    ...(accent ? { "--vibeui-sparkline-002-up": accent } : null),
    ...(background
      ? {
          "--vibeui-sparkline-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sparkline-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="sparkline"
        data-vibeui-block="sparkline-002"
        className={className}
        style={palette}
      >
        <table>
          <caption>
            {caption}
            <span>{note.replace("{period}", period)}</span>
          </caption>
          <thead>
            <tr>
              <th scope="col">{headings.metric ?? HEADINGS.metric}</th>
              <th scope="col">{headings.value ?? HEADINGS.value}</th>
              <th scope="col">{headings.trend ?? HEADINGS.trend}</th>
              <th scope="col">{headings.change ?? HEADINGS.change}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const trend =
                row.delta > FLAT ? "up" : row.delta < -FLAT ? "down" : "flat"
              const point = lastPoint(row.values)

              return (
                <tr key={row.label} data-trend={trend}>
                  <th scope="row">{row.label}</th>
                  <td data-part="value">{row.value}</td>
                  <td data-part="spark">
                    <svg
                      viewBox="0 0 100 24"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path data-part="line" d={pathFor(row.values)} />
                      <circle
                        data-part="last"
                        cx={point.x - 1.5}
                        cy={point.y}
                        r={2}
                      />
                    </svg>
                  </td>
                  <td data-part="delta" data-trend={trend}>
                    {row.delta > 0 ? "+" : ""}
                    {row.delta} %
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

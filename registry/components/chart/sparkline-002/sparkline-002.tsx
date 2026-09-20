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
--vibeui-sparkline-002-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-sparkline-002-muted:color-mix(in oklab,var(--vibeui-sparkline-002-fg) 68%,transparent);
--vibeui-sparkline-002-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-sparkline-002-up:light-dark(oklch(0.58 0.14 155),oklch(0.76 0.13 155));
--vibeui-sparkline-002-down:light-dark(oklch(0.6 0.16 25),oklch(0.73 0.16 25));
--vibeui-sparkline-002-flat:light-dark(oklch(0.62 0 265),oklch(0.66 0 265));
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
[data-vibeui-block="sparkline-002"] [data-part="spark"]{width:7rem;padding-right:0}
[data-vibeui-block="sparkline-002"] svg{display:block;width:6.5rem;height:1.75rem}
/* Цвет строки объявляется один раз: линия, заливка и точка берут его из
   одной переменной, поэтому строка не может оказаться наполовину красной. */
[data-vibeui-block="sparkline-002"] tr[data-trend="up"]{--vibeui-sparkline-002-trend:var(--vibeui-sparkline-002-up)}
[data-vibeui-block="sparkline-002"] tr[data-trend="down"]{--vibeui-sparkline-002-trend:var(--vibeui-sparkline-002-down)}
[data-vibeui-block="sparkline-002"] tr[data-trend="flat"]{--vibeui-sparkline-002-trend:var(--vibeui-sparkline-002-flat)}
/* Толщина линии не масштабируется вместе с viewBox: иначе в узкой колонке
   кривая становится ниткой, а в широкой — жирной. */
[data-vibeui-block="sparkline-002"] [data-part="line"]{
fill:none;stroke:var(--vibeui-sparkline-002-trend);stroke-width:2;
stroke-linejoin:round;stroke-linecap:round;vector-effect:non-scaling-stroke;
stroke-dasharray:1;animation:vibeui-sparkline-002-draw 0.8s ease-out both;
}
/* Заливка под кривой: в таблице она отделяет строку от строки лучше, чем
   ещё одна линейка, и сразу читается как «столько было». */
[data-vibeui-block="sparkline-002"] [data-part="area"]{
stroke:none;fill:color-mix(in oklab,var(--vibeui-sparkline-002-trend) 16%,transparent);
animation:vibeui-sparkline-002-rise 0.6s ease-out both;
}
[data-vibeui-block="sparkline-002"] [data-part="last"]{
r:2.5;fill:var(--vibeui-sparkline-002-trend);
stroke:light-dark(oklch(1 0 0),oklch(0.16 0 265));stroke-width:1.5;
}
@keyframes vibeui-sparkline-002-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes vibeui-sparkline-002-rise{from{opacity:0}to{opacity:1}}
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

/**
 * Гладкая кривая через все точки: Catmull-Rom, переписанный кубическими
 * Безье. Ломаная из отрезков в строке таблицы читается как «данные скачут»,
 * хотя скачет только частота замеров; кривая проходит ровно через значения
 * и при этом не рвёт глаз углами.
 */
function curve(points: { x: number; y: number }[]) {
  if (points.length < 2) {
    return points.length === 1 ? `M${points[0].x} ${points[0].y}` : ""
  }

  const round = (value: number) => Math.round(value * 100) / 100
  const parts = [`M${round(points[0].x)} ${round(points[0].y)}`]

  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[index - 1] ?? points[index]
    const start = points[index]
    const end = points[index + 1]
    const next = points[index + 2] ?? end

    parts.push(
      `C${round(start.x + (end.x - previous.x) / 6)} ${round(start.y + (end.y - previous.y) / 6)} ` +
        `${round(end.x - (next.x - start.x) / 6)} ${round(end.y - (next.y - start.y) / 6)} ` +
        `${round(end.x)} ${round(end.y)}`,
    )
  }

  return parts.join(" ")
}

/** Кривая, заливка под ней и последняя точка — из одного набора координат. */
function geometry(values: number[]) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const span = max - min || 1
  const points = values.map((value, index) => ({
    x: values.length > 1 ? (index / (values.length - 1)) * 100 : 0,
    y: 21 - ((value - min) / span) * 17,
  }))
  const line = curve(points)

  return {
    line,
    area: `${line} L100 24 L0 24 Z`,
    last: points[points.length - 1],
  }
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
              const chart = geometry(row.values)

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
                      <path data-part="area" d={chart.area} />
                      <path data-part="line" d={chart.line} pathLength={1} />
                      <circle
                        data-part="last"
                        cx={chart.last.x - 2}
                        cy={chart.last.y}
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

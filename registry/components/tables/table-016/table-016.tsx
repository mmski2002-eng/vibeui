import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Table016Row = {
  title: string
  values: number[]
}

export type Table016Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  columns?: string[]
  rows?: Table016Row[]
  /** Сколько знаков после запятой печатать во всех ячейках. */
  decimals?: number
  caption?: string
  accent?: string
}

// Идея компонента: числа выстроены по разряду. Каждая ячейка — маленькая
// сетка из трёх колонок: знак, целая часть, дробная. Целые части упираются
// в одну границу, запятые стоят в одну линию, а минус висит слева и не
// сдвигает цифры. Минус — знак «−», а не дефис, и он читается вслух:
// цветом отрицательное значение не размечают.
const STYLES = `
:where([data-vibeui-block="table-016"]){
--vibeui-table-016-bg:oklch(1 0 0);
--vibeui-table-016-fg:oklch(0.24 0.014 265);
--vibeui-table-016-muted:oklch(0.56 0.014 265);
--vibeui-table-016-border:oklch(0.92 0.006 265);
--vibeui-table-016-head:oklch(0.975 0.003 265);
--vibeui-table-016-accent:oklch(0.55 0.2 262);
--vibeui-table-016-minus:oklch(0.53 0.19 27);
--vibeui-table-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="table-016"]{
width:100%;box-sizing:border-box;
font-family:var(--vibeui-table-016-font);color:var(--vibeui-table-016-fg);
}
[data-vibeui-block="table-016"] [data-part="shell"]{
background:var(--vibeui-table-016-bg);
border:1px solid var(--vibeui-table-016-border);border-radius:1rem;overflow:hidden;
}
[data-vibeui-block="table-016"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="table-016"] [data-part="scroll"]:focus-visible{
outline:2px solid var(--vibeui-table-016-accent);outline-offset:-2px;
}
[data-vibeui-block="table-016"] table{width:100%;border-collapse:collapse;font-size:0.8125rem;min-width:26rem}
[data-vibeui-block="table-016"] caption{
padding:0.875rem 1rem 0.5rem;text-align:left;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="table-016"] th,
[data-vibeui-block="table-016"] td{
padding:0.4375rem 0.875rem;text-align:left;
border-top:1px solid var(--vibeui-table-016-border);
}
[data-vibeui-block="table-016"] thead th{
background:var(--vibeui-table-016-head);font-weight:600;white-space:nowrap;text-align:right;
}
[data-vibeui-block="table-016"] thead th:first-child{text-align:left}
[data-vibeui-block="table-016"] tbody th,
[data-vibeui-block="table-016"] tfoot th{font-weight:500;white-space:nowrap}
[data-vibeui-block="table-016"] tfoot th,
[data-vibeui-block="table-016"] tfoot td{font-weight:700;background:var(--vibeui-table-016-head)}
/* Ячейка числа: знак | целая часть | дробная. Границы колонок общие для
   всех строк, поэтому запятые встают в одну вертикаль. */
[data-vibeui-block="table-016"] [data-part="num"]{
display:grid;grid-template-columns:0.75ch 1fr auto;align-items:baseline;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="table-016"] [data-part="sign"]{text-align:left}
[data-vibeui-block="table-016"] [data-part="whole"]{text-align:right}
[data-vibeui-block="table-016"] [data-part="fraction"]{text-align:left}
[data-vibeui-block="table-016"] [data-sign="neg"]{color:var(--vibeui-table-016-minus)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="table-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS = ["План", "Факт", "Отклонение"]

const DEFAULT_ROWS: Table016Row[] = [
  { title: "Подписки", values: [1240.5, 1310.25, 69.75] },
  { title: "Разовые продажи", values: [420, 388.4, -31.6] },
  { title: "Партнёрские выплаты", values: [-96.3, -128.75, -32.45] },
  { title: "Возвраты", values: [-18, -7.5, 10.5] },
  { title: "Прочее", values: [64.2, 64.2, 0] },
]

const MINUS = "−"

/** Разбиваем число на знак, целую и дробную часть: их печатает разметка. */
function split(value: number, decimals: number) {
  const fixed = Math.abs(value).toFixed(decimals)
  const [whole, fraction = ""] = fixed.split(".")

  return {
    sign: value < 0 ? MINUS : "",
    whole: whole.replace(/\B(?=(\d{3})+(?!\d))/g, " "),
    fraction: fraction ? `,${fraction}` : "",
  }
}

/**
 * Числовая таблица с выравниванием по разряду и висящим минусом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table016({
  columns = DEFAULT_COLUMNS,
  rows = DEFAULT_ROWS,
  decimals = 2,
  caption = "Движение денег за месяц, тыс. ₽",
  accent,
  className,
  style,
  ...props
}: Table016Props) {
  const palette = {
    ...(accent ? { "--vibeui-table-016-accent": accent } : null),
    ...style,
  } as CSSProperties

  const totals = columns.map((_, index) =>
    rows.reduce((sum, row) => sum + (row.values[index] ?? 0), 0),
  )

  const renderNumber = (value: number) => {
    const parts = split(value, decimals)

    return (
      <span data-part="num" data-sign={value < 0 ? "neg" : undefined}>
        <span data-part="sign">{parts.sign}</span>
        <span data-part="whole">{parts.whole}</span>
        <span data-part="fraction">{parts.fraction}</span>
      </span>
    )
  }

  return (
    <>
      <style href="vibeui-table-016" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="table-016"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div
            data-part="scroll"
            role="region"
            aria-label={caption}
            tabIndex={0}
          >
            <table>
              <caption>{caption}</caption>
              <thead>
                <tr>
                  <th scope="col">Статья</th>
                  {columns.map((column) => (
                    <th key={column} scope="col">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.title}>
                    <th scope="row">{row.title}</th>
                    {columns.map((column, index) => (
                      <td key={column}>
                        {renderNumber(row.values[index] ?? 0)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">Итого</th>
                  {totals.map((total, index) => (
                    <td key={columns[index]}>{renderNumber(total)}</td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

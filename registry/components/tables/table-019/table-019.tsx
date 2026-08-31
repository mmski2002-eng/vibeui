import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Table019Row = {
  title: string
  hint?: string
  value: number
}

export type Table019Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  rows?: Table019Row[]
  unit?: string
  caption?: string
  /** Подпись итоговой строки: она же объясняет, что именно просуммировано. */
  totalLabel?: string
  accent?: string
}

// Идея компонента: итог снизу не просто повторяет сумму — он задаёт масштаб.
// Доля каждой строки считается от итога и рисуется полоской прямо в ячейке,
// поэтому «412» и «41%» стоят рядом. Полоска — оформление, число рядом с ней
// остаётся текстом, иначе доля пропадёт для скринридера.
const STYLES = `
:where([data-vibeui-block="table-019"]){
--vibeui-table-019-bg:oklch(1 0 0);
--vibeui-table-019-fg:oklch(0.24 0.014 265);
--vibeui-table-019-muted:oklch(0.56 0.014 265);
--vibeui-table-019-border:oklch(0.92 0.006 265);
--vibeui-table-019-head:oklch(0.975 0.003 265);
--vibeui-table-019-accent:oklch(0.55 0.2 262);
--vibeui-table-019-track:oklch(0.93 0.008 265);
--vibeui-table-019-fill:0%;
--vibeui-table-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="table-019"]{
width:100%;box-sizing:border-box;
font-family:var(--vibeui-table-019-font);color:var(--vibeui-table-019-fg);
}
[data-vibeui-block="table-019"] [data-part="shell"]{
background:var(--vibeui-table-019-bg);
border:1px solid var(--vibeui-table-019-border);border-radius:1rem;overflow:hidden;
}
[data-vibeui-block="table-019"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="table-019"] [data-part="scroll"]:focus-visible{
outline:2px solid var(--vibeui-table-019-accent);outline-offset:-2px;
}
[data-vibeui-block="table-019"] table{width:100%;border-collapse:collapse;font-size:0.8125rem;min-width:24rem}
[data-vibeui-block="table-019"] caption{
padding:0.875rem 1rem 0.5rem;text-align:left;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="table-019"] th,
[data-vibeui-block="table-019"] td{
padding:0.5rem 0.875rem;text-align:left;
border-top:1px solid var(--vibeui-table-019-border);
}
[data-vibeui-block="table-019"] thead th{
background:var(--vibeui-table-019-head);font-weight:600;white-space:nowrap;
}
[data-vibeui-block="table-019"] thead th:not(:first-child){text-align:right}
[data-vibeui-block="table-019"] tbody th{font-weight:500}
[data-vibeui-block="table-019"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="table-019"] [data-part="hint"]{
display:block;font-size:0.75rem;font-weight:400;color:var(--vibeui-table-019-muted);
}
[data-vibeui-block="table-019"] [data-part="share"]{
display:flex;align-items:center;justify-content:flex-end;gap:0.5rem;
}
[data-vibeui-block="table-019"] [data-part="track"]{
flex:1 1 4rem;max-width:6rem;height:0.375rem;border-radius:9999px;
background:var(--vibeui-table-019-track);overflow:hidden;
}
[data-vibeui-block="table-019"] [data-part="fill"]{
display:block;height:100%;width:var(--vibeui-table-019-fill);
background:var(--vibeui-table-019-accent);border-radius:inherit;
}
[data-vibeui-block="table-019"] [data-part="percent"]{
min-width:2.75rem;text-align:right;font-variant-numeric:tabular-nums;
color:var(--vibeui-table-019-muted);
}
/* Итог отбит двойной линией: это принятый в отчётах знак «ниже — сумма». */
[data-vibeui-block="table-019"] tfoot th,
[data-vibeui-block="table-019"] tfoot td{
border-top:3px double var(--vibeui-table-019-border);
background:var(--vibeui-table-019-head);font-weight:700;
padding-top:0.625rem;padding-bottom:0.625rem;
}
[data-vibeui-block="table-019"] tfoot [data-part="hint"]{font-weight:400}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="table-019"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Table019Row[] = [
  { title: "Поиск", hint: "органика", value: 4120 },
  { title: "Рассылка", hint: "письма и дайджест", value: 2480 },
  { title: "Рекомендации", hint: "внутри продукта", value: 1310 },
  { title: "Соцсети", hint: "посты и сторис", value: 860 },
  { title: "Партнёры", hint: "интеграции", value: 470 },
]

function group(value: number) {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

/**
 * Таблица с итоговой строкой снизу и долей каждой строки от итога.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table019({
  rows = DEFAULT_ROWS,
  unit = "визитов",
  caption = "Источники трафика за неделю",
  totalLabel = "Итого",
  accent,
  className,
  style,
  ...props
}: Table019Props) {
  const palette = {
    ...(accent ? { "--vibeui-table-019-accent": accent } : null),
    ...style,
  } as CSSProperties

  const total = rows.reduce((sum, row) => sum + row.value, 0)

  return (
    <>
      <style href="vibeui-table-019" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="table-019"
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
                  <th scope="col">Источник</th>
                  <th scope="col">Значение</th>
                  <th scope="col">Доля</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const percent = total ? (row.value / total) * 100 : 0

                  return (
                    <tr key={row.title}>
                      <th scope="row">
                        {row.title}
                        {row.hint ? (
                          <span data-part="hint">{row.hint}</span>
                        ) : null}
                      </th>
                      <td data-align="end">{group(row.value)}</td>
                      <td data-align="end">
                        <span data-part="share">
                          <span
                            data-part="track"
                            aria-hidden="true"
                            style={
                              {
                                "--vibeui-table-019-fill": `${percent.toFixed(1)}%`,
                              } as CSSProperties
                            }
                          >
                            <span data-part="fill" />
                          </span>
                          <span data-part="percent">
                            {percent.toFixed(1).replace(".", ",")}%
                          </span>
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">
                    {totalLabel}
                    <span data-part="hint">
                      по {rows.length} источникам, {unit}
                    </span>
                  </th>
                  <td data-align="end">{group(total)}</td>
                  <td data-align="end">100,0%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

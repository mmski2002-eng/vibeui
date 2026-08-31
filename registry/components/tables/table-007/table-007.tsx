import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Table007Row = {
  order: string
  customer: string
  status: string
  sum: string
}

export type Table007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  rows?: Table007Row[]
  caption?: string
  accent?: string
}

// Идея компонента: таблица, которая на узком экране становится списком карточек.
// Заголовки колонок дублируются в data-label и выводятся через ::before, иначе
// в карточке остаются голые значения без смысла. Ширину меряет контейнерный
// запрос: таблица может стоять в узкой колонке на широком экране.
const STYLES = `
:where([data-vibeui-block="table-007"]){
--vibeui-table-007-bg:oklch(1 0 0);
--vibeui-table-007-fg:oklch(0.24 0.014 265);
--vibeui-table-007-muted:oklch(0.56 0.014 265);
--vibeui-table-007-border:oklch(0.92 0.006 265);
--vibeui-table-007-head:oklch(0.975 0.003 265);
--vibeui-table-007-accent:oklch(0.55 0.2 262);
--vibeui-table-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="table-007"]{
container-type:inline-size;width:100%;box-sizing:border-box;
font-family:var(--vibeui-table-007-font);color:var(--vibeui-table-007-fg);
}
/* Правила ширины живут на внутренней обёртке: сам контейнер себя не измеряет. */
[data-vibeui-block="table-007"] [data-part="shell"]{
background:var(--vibeui-table-007-bg);
border:1px solid var(--vibeui-table-007-border);border-radius:0.875rem;
overflow:hidden;
}
[data-vibeui-block="table-007"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="table-007"] caption{padding:0.75rem 0.875rem;text-align:left;font-size:0.875rem;font-weight:650}
[data-vibeui-block="table-007"] th,
[data-vibeui-block="table-007"] td{
padding:0.5rem 0.875rem;text-align:left;
border-top:1px solid var(--vibeui-table-007-border);
}
[data-vibeui-block="table-007"] thead th{background:var(--vibeui-table-007-head);font-weight:600;white-space:nowrap}
[data-vibeui-block="table-007"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
/* Узкая колонка: строки становятся карточками, подписи берутся из data-label. */
@container (max-width: 30rem){
[data-vibeui-block="table-007"] [data-part="shell"] thead{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
[data-vibeui-block="table-007"] [data-part="shell"] tr{
display:grid;grid-template-columns:auto 1fr;gap:0.125rem 0.75rem;
padding:0.625rem 0.875rem;border-top:1px solid var(--vibeui-table-007-border);
}
[data-vibeui-block="table-007"] [data-part="shell"] td{
display:contents;border:0;padding:0;
}
[data-vibeui-block="table-007"] [data-part="shell"] td::before{
content:attr(data-label);color:var(--vibeui-table-007-muted);font-size:0.75rem;
}
[data-vibeui-block="table-007"] [data-part="shell"] [data-part="cell"]{text-align:left;font-size:0.8125rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="table-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Table007Row[] = [
  {
    order: "№ 300",
    customer: "ООО «Полёт»",
    status: "Ожидает оплаты",
    sum: "24 000 ₽",
  },
  {
    order: "№ 301",
    customer: "ИП Гаврилов",
    status: "Оплачен",
    sum: "5 900 ₽",
  },
  {
    order: "№ 302",
    customer: "ООО «Ветка»",
    status: "Черновик",
    sum: "12 400 ₽",
  },
]

const COLUMNS = [
  { key: "order", title: "Счёт" },
  { key: "customer", title: "Заказчик" },
  { key: "status", title: "Статус" },
  { key: "sum", title: "Сумма", numeric: true },
] as const

/**
 * Таблица, которая в узкой колонке становится списком карточек.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table007({
  rows = DEFAULT_ROWS,
  caption = "Счета за март",
  accent,
  className,
  style,
  ...props
}: Table007Props) {
  const palette = {
    ...(accent ? { "--vibeui-table-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-table-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="table-007"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                {COLUMNS.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    data-align={"numeric" in column ? "end" : undefined}
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.order}>
                  {COLUMNS.map((column) => (
                    <td
                      key={column.key}
                      data-label={column.title}
                      data-align={"numeric" in column ? "end" : undefined}
                    >
                      <span data-part="cell">{row[column.key]}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

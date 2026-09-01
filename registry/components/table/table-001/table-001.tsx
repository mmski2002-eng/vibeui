import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Table001Column = {
  key: string
  label: string
  /** Числовая колонка: выравнивается вправо и получает моноширинные цифры. */
  numeric?: boolean
}

export type Table001Row = Record<string, ReactNode>

export type Table001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  columns?: Table001Column[]
  rows?: Table001Row[]
  caption?: string
  /** Плотный режим: строки ниже, шрифт мельче. */
  dense?: boolean
  accent?: string
}

// Идея компонента: таблица, которая не разваливается на телефоне и не врёт
// про числа. Прокрутка живёт в обёртке, шапка липнет к верху при вертикальной
// прокрутке, а числовые колонки идут вправо с моноширинными цифрами, чтобы
// разряды стояли под разрядами.
const STYLES = `
:where([data-vibeui-block="table-001"]){
--vibeui-table-001-fg:oklch(0.24 0.016 265);
--vibeui-table-001-muted:oklch(0.54 0.014 265);
--vibeui-table-001-bg:oklch(1 0 0);
--vibeui-table-001-head:oklch(0.975 0.003 265);
--vibeui-table-001-border:oklch(0.91 0.006 265);
--vibeui-table-001-hover:oklch(0.55 0.02 265 / 5%);
--vibeui-table-001-accent:oklch(0.55 0.2 262);
--vibeui-table-001-radius:0.75rem;
--vibeui-table-001-pad:0.6875rem;
--vibeui-table-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="table-001"]{
width:100%;box-sizing:border-box;overflow:auto;
max-height:22rem;
border:1px solid var(--vibeui-table-001-border);
border-radius:var(--vibeui-table-001-radius);
background:var(--vibeui-table-001-bg);color:var(--vibeui-table-001-fg);
font-family:var(--vibeui-table-001-font);
}
[data-vibeui-block="table-001"][data-dense="true"]{--vibeui-table-001-pad:0.4375rem}
[data-vibeui-block="table-001"] table{width:100%;border-collapse:separate;border-spacing:0;font-size:0.875rem}
[data-vibeui-block="table-001"][data-dense="true"] table{font-size:0.8125rem}
[data-vibeui-block="table-001"] caption{
padding:var(--vibeui-table-001-pad) 0.875rem;text-align:left;
font-size:0.8125rem;color:var(--vibeui-table-001-muted);
border-bottom:1px solid var(--vibeui-table-001-border);
}
/* Шапка липнет к верху обёртки: при прокрутке длинного списка она нужна. */
[data-vibeui-block="table-001"] th{
position:sticky;top:0;z-index:1;
padding:var(--vibeui-table-001-pad) 0.875rem;text-align:left;
background:var(--vibeui-table-001-head);
border-bottom:1px solid var(--vibeui-table-001-border);
font-size:0.75rem;font-weight:600;letter-spacing:0.02em;
color:var(--vibeui-table-001-muted);white-space:nowrap;
}
[data-vibeui-block="table-001"] td{
padding:var(--vibeui-table-001-pad) 0.875rem;
border-bottom:1px solid var(--vibeui-table-001-border);
vertical-align:middle;
}
[data-vibeui-block="table-001"] tr:last-child td{border-bottom:0}
[data-vibeui-block="table-001"] tbody tr:hover td{background:var(--vibeui-table-001-hover)}
/* Числа вправо и моноширинными: разряды должны стоять под разрядами. */
[data-vibeui-block="table-001"] [data-numeric="true"]{
text-align:right;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="table-001"] a{color:var(--vibeui-table-001-accent);text-decoration:none}
[data-vibeui-block="table-001"] a:hover{text-decoration:underline}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="table-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS: Table001Column[] = [
  { key: "page", label: "Страница" },
  { key: "updated", label: "Изменена" },
  { key: "views", label: "Просмотры", numeric: true },
  { key: "share", label: "Доля", numeric: true },
]

const DEFAULT_ROWS: Table001Row[] = [
  {
    page: "Главная",
    updated: "12 марта",
    views: "18 402",
    share: "46,1 %",
  },
  { page: "Услуги", updated: "9 марта", views: "7 118", share: "17,8 %" },
  { page: "Портфолио", updated: "2 марта", views: "6 940", share: "17,4 %" },
  { page: "О студии", updated: "27 февраля", views: "4 233", share: "10,6 %" },
  { page: "Контакты", updated: "27 февраля", views: "3 210", share: "8,1 %" },
]

/**
 * Таблица данных: липкая шапка, прокрутка в обёртке, числа по разрядам.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table001({
  columns = DEFAULT_COLUMNS,
  rows = DEFAULT_ROWS,
  caption = "Страницы сайта за март",
  dense = false,
  accent,
  className,
  style,
  ...props
}: Table001Props) {
  const palette = {
    ...(accent ? { "--vibeui-table-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-table-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="table-001"
        data-dense={dense || undefined}
        className={className}
        style={palette}
      >
        <table>
          {caption ? <caption>{caption}</caption> : null}
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  data-numeric={column.numeric || undefined}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    data-numeric={column.numeric || undefined}
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

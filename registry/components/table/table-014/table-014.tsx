import type { ComponentProps, CSSProperties } from "react"

export type Table014Group = {
  title: string
  columns: string[]
}

export type Table014Row = {
  title: string
  values: string[]
}

export type Table014Props = Omit<ComponentProps<"div">, "children"> & {
  groups?: Table014Group[]
  rows?: Table014Row[]
  /** Подпись первой колонки: она склеена на обе строки шапки. */
  leadTitle?: string
  caption?: string
  /** Пусто — подложки нет, таблица лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: двухэтажная шапка. Верхний ряд — год со scope="colgroup"
// и colspan, нижний — колонки внутри года, а первая ячейка склеена rowspan
// на оба ряда. Без scope такая шапка для скринридера рассыпается: числа
// теряют год, к которому относятся.
//
// Тема берётся из color-scheme окружения через light-dark(): таблица темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="table-014"]){
--vibeui-table-014-bg:transparent;
--vibeui-table-014-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-table-014-muted:color-mix(in oklab,var(--vibeui-table-014-fg) 68%,transparent);
--vibeui-table-014-border:light-dark(oklch(0.92 0 265),oklch(0.36 0 265));
--vibeui-table-014-head:light-dark(oklch(0.5 0 265 / 5%),oklch(0.85 0 265 / 7%));
--vibeui-table-014-accent:light-dark(oklch(0.287 0 0),oklch(0.905 0 0));
--vibeui-table-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="table-014"]{color-scheme:dark}
[data-vibeui-block="table-014"]{
width:100%;box-sizing:border-box;
font-family:var(--vibeui-table-014-font);color:var(--vibeui-table-014-fg);
}
[data-vibeui-block="table-014"] [data-part="shell"]{
background:var(--vibeui-table-014-bg);
border:1px solid var(--vibeui-table-014-border);border-radius:1rem;overflow:hidden;
}
[data-vibeui-block="table-014"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="table-014"] [data-part="scroll"]:focus-visible{
outline:2px solid var(--vibeui-table-014-accent);outline-offset:-2px;
}
[data-vibeui-block="table-014"] table{width:100%;border-collapse:collapse;font-size:0.8125rem;min-width:30rem}
[data-vibeui-block="table-014"] caption{
padding:0.875rem 1rem 0.625rem;text-align:left;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="table-014"] th,
[data-vibeui-block="table-014"] td{padding:0.5rem 0.875rem;text-align:right;white-space:nowrap}
[data-vibeui-block="table-014"] thead th{background:var(--vibeui-table-014-head);font-weight:600}
/* Верхний этаж шапки центрируется над своей группой, нижний — по числам. */
[data-vibeui-block="table-014"] [data-part="group"]{
text-align:center;border-bottom:1px solid var(--vibeui-table-014-border);
letter-spacing:0.02em;
}
[data-vibeui-block="table-014"] [data-part="lead"]{text-align:left;vertical-align:bottom}
[data-vibeui-block="table-014"] tbody th{
text-align:left;font-weight:500;
border-top:1px solid var(--vibeui-table-014-border);
}
[data-vibeui-block="table-014"] tbody td{
border-top:1px solid var(--vibeui-table-014-border);
font-variant-numeric:tabular-nums;
}
/* Граница между годами: без неё два одинаковых столбца «План» сливаются. */
[data-vibeui-block="table-014"] [data-edge="group"]{
border-left:1px solid var(--vibeui-table-014-border);
}
[data-vibeui-block="table-014"] tbody tr:nth-child(even) th,
[data-vibeui-block="table-014"] tbody tr:nth-child(even) td{
background:color-mix(in oklab,var(--vibeui-table-014-head) 60%,transparent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="table-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Table014Group[] = [
  { title: "2024", columns: ["План", "Факт"] },
  { title: "2025", columns: ["План", "Факт"] },
]

const DEFAULT_ROWS: Table014Row[] = [
  { title: "Северо-Запад", values: ["12,0", "11,4", "13,5", "14,2"] },
  { title: "Центр", values: ["28,4", "30,1", "32,0", "31,6"] },
  { title: "Урал", values: ["9,8", "9,1", "10,4", "10,9"] },
  { title: "Сибирь", values: ["7,2", "7,7", "8,1", "8,0"] },
]

/**
 * Ветка темы для заданного фона: light-dark() смотрит на color-scheme, а не
 * на цвет подложки, поэтому светлую плашку приходится объявлять светлой.
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
 * Таблица с двухэтажной шапкой: группы колонок склеены colspan и scope.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table014({
  groups = DEFAULT_GROUPS,
  rows = DEFAULT_ROWS,
  leadTitle = "Регион",
  caption = "Выручка по регионам, млн ₽",
  background = "",
  accent,
  className,
  style,
  ...props
}: Table014Props) {
  const palette = {
    ...(accent ? { "--vibeui-table-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-table-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const columns = groups.flatMap((group, groupIndex) =>
    group.columns.map((column, columnIndex) => ({
      key: `${group.title}-${column}`,
      title: column,
      group: group.title,
      first: groupIndex > 0 && columnIndex === 0,
    })),
  )

  return (
    <>
      <style href="vibeui-table-014" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="table"
        data-vibeui-block="table-014"
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
                  <th scope="col" rowSpan={2} data-part="lead">
                    {leadTitle}
                  </th>
                  {groups.map((group, index) => (
                    <th
                      key={group.title}
                      scope="colgroup"
                      colSpan={group.columns.length}
                      data-part="group"
                      data-edge={index > 0 ? "group" : undefined}
                    >
                      {group.title}
                    </th>
                  ))}
                </tr>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      data-edge={column.first ? "group" : undefined}
                    >
                      {column.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.title}>
                    <th scope="row">{row.title}</th>
                    {columns.map((column, index) => (
                      <td
                        key={column.key}
                        data-edge={column.first ? "group" : undefined}
                      >
                        {row.values[index] ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

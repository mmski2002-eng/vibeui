import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Table001Column = {
  key: string
  label: string
  /** Числовая колонка: выравнивается вправо и получает моноширинные цифры. */
  numeric?: boolean
}

export type Table001Row = Record<string, ReactNode>

export type Table001Props = Omit<ComponentProps<"div">, "children"> & {
  columns?: Table001Column[]
  rows?: Table001Row[]
  caption?: string
  /** Плотный режим: строки ниже, шрифт мельче. */
  dense?: boolean
  /** Пусто — подложки нет, таблица лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: таблица, которая не разваливается на телефоне и не врёт
// про числа. Прокрутка живёт в обёртке, шапка липнет к верху при вертикальной
// прокрутке, а числовые колонки идут вправо с моноширинными цифрами, чтобы
// разряды стояли под разрядами.
//
// Тема берётся из color-scheme окружения через light-dark(): таблица темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="table-001"]){
--vibeui-table-001-fg:light-dark(oklch(0.24 0.016 265),oklch(0.93 0.006 265));
--vibeui-table-001-muted:color-mix(in oklab,var(--vibeui-table-001-fg) 68%,transparent);
--vibeui-table-001-bg:transparent;
--vibeui-table-001-head:light-dark(oklch(0.975 0.003 265),oklch(0.27 0.012 265));
--vibeui-table-001-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.011 265));
--vibeui-table-001-hover:light-dark(oklch(0.55 0.02 265 / 5%),oklch(0.85 0.02 265 / 9%));
--vibeui-table-001-accent:light-dark(oklch(0.55 0.2 262),oklch(0.75 0.16 262));
--vibeui-table-001-radius:0.75rem;
--vibeui-table-001-pad:0.6875rem;
--vibeui-table-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="table-001"]{color-scheme:dark}
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
font-size:0.8125rem;font-weight:600;letter-spacing:0.02em;
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
 * Таблица данных: липкая шапка, прокрутка в обёртке, числа по разрядам.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table001({
  columns = DEFAULT_COLUMNS,
  rows = DEFAULT_ROWS,
  caption = "Страницы сайта за март",
  dense = false,
  background = "",
  accent,
  className,
  style,
  ...props
}: Table001Props) {
  // Липкая шапка обязана быть непрозрачной, поэтому подложка фона таблицы
  // задаётся и ей тоже: иначе строки просвечивают сквозь заголовки.
  const palette = {
    ...(accent ? { "--vibeui-table-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-table-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-table-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="table"
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
              // Ключ — значение первой колонки: при сортировке и фильтрации
              // индекс переезжает с одной строки на другую, и React переносит
              // состояние ячеек не туда.
              <tr key={String(row[columns[0]?.key] ?? index)}>
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

import type { ComponentProps, CSSProperties } from "react"

export type Table010Row = {
  source: string
  visits: number
}

export type Table010Props = Omit<ComponentProps<"div">, "children"> & {
  rows?: Table010Row[]
  caption?: string
  /** Заголовки колонок: компонент несёт русские, проект подставляет свои. */
  columnText?: Record<string, string>
  totalText?: string
  /** Локаль для группировки цифр и дробной части. */
  locale?: string
  /** Пусто — подложки нет, таблица лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: таблица долей с полосой прямо в ячейке. Полоса рисуется
// градиентом фона по проценту, поэтому не добавляет ни элемента, ни библиотеки.
// Число остаётся рядом: полоса показывает соотношение, а точную величину
// читают цифрой. Доля считается от суммы строк, а не задаётся отдельно, —
// иначе итог перестаёт сходиться при правке данных.
//
// Тема берётся из color-scheme окружения через light-dark(): таблица темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="table-010"]){
--vibeui-table-010-bg:transparent;
--vibeui-table-010-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-table-010-muted:color-mix(in oklab,var(--vibeui-table-010-fg) 68%,transparent);
--vibeui-table-010-border:light-dark(oklch(0.92 0 265),oklch(0.36 0 265));
--vibeui-table-010-head:light-dark(oklch(0.5 0 265 / 5%),oklch(0.85 0 265 / 7%));
--vibeui-table-010-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.75 0.16 39.8));
--vibeui-table-010-bar:color-mix(in oklab,var(--vibeui-table-010-accent) 16%,transparent);
--vibeui-table-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="table-010"]{color-scheme:dark}
[data-vibeui-block="table-010"]{
width:100%;box-sizing:border-box;overflow-x:auto;
background:var(--vibeui-table-010-bg);
border:1px solid var(--vibeui-table-010-border);border-radius:0.875rem;
font-family:var(--vibeui-table-010-font);color:var(--vibeui-table-010-fg);
}
[data-vibeui-block="table-010"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="table-010"] caption{padding:0.75rem 0.875rem;text-align:left;font-size:0.875rem;font-weight:650}
[data-vibeui-block="table-010"] th,
[data-vibeui-block="table-010"] td{
padding:0.5rem 0.875rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-table-010-border);
}
[data-vibeui-block="table-010"] thead th{background:var(--vibeui-table-010-head);font-weight:600}
[data-vibeui-block="table-010"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
/* Полоса — фон ячейки: лишний элемент и библиотека графиков не нужны. */
[data-vibeui-block="table-010"] [data-part="share"]{
min-width:9rem;
background:linear-gradient(to right,var(--vibeui-table-010-bar) var(--vibeui-table-010-fill),transparent var(--vibeui-table-010-fill));
}
[data-vibeui-block="table-010"] tfoot td{
font-weight:650;background:var(--vibeui-table-010-head);
}
[data-vibeui-block="table-010"] [data-part="total"]{color:var(--vibeui-table-010-muted);font-weight:600}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="table-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Table010Row[] = [
  { source: "Поиск", visits: 18402 },
  { source: "Прямые заходы", visits: 7118 },
  { source: "Соцсети", visits: 6940 },
  { source: "Письма", visits: 4233 },
  { source: "Реклама", visits: 3211 },
]

const COLUMN_TEXT: Record<string, string> = {
  source: "Источник",
  visits: "Визиты",
  share: "Доля",
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

/**
 * Таблица долей: полоса рисуется фоном ячейки, число остаётся рядом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table010({
  rows = DEFAULT_ROWS,
  caption = "Источники трафика",
  columnText = COLUMN_TEXT,
  totalText = "Всего",
  locale = "ru-RU",
  background = "",
  accent,
  className,
  style,
  ...props
}: Table010Props) {
  const total = rows.reduce((sum, row) => sum + row.visits, 0)
  const percent = (value: number) =>
    value.toLocaleString(locale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })

  const palette = {
    ...(accent ? { "--vibeui-table-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-table-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-table-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="table"
        data-vibeui-block="table-010"
        className={className}
        style={palette}
      >
        <table>
          <caption>{caption}</caption>
          <thead>
            <tr>
              <th scope="col">{columnText.source ?? COLUMN_TEXT.source}</th>
              <th scope="col" data-align="end">
                {columnText.visits ?? COLUMN_TEXT.visits}
              </th>
              <th scope="col" data-align="end">
                {columnText.share ?? COLUMN_TEXT.share}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const share = total ? (row.visits / total) * 100 : 0
              return (
                <tr key={row.source}>
                  <td>{row.source}</td>
                  <td data-align="end">{row.visits.toLocaleString(locale)}</td>
                  <td
                    data-part="share"
                    data-align="end"
                    style={
                      {
                        "--vibeui-table-010-fill": `${share.toFixed(1)}%`,
                      } as CSSProperties
                    }
                  >
                    {percent(share)} %
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td data-part="total">{totalText}</td>
              <td data-align="end">{total.toLocaleString(locale)}</td>
              <td data-align="end">{percent(100)} %</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  )
}

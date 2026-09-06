import type { ComponentProps, CSSProperties } from "react"

export type Table020Column = {
  title: string
  unit: string
  /** Расшифровка сокращения: попадает в title у abbr рядом с единицей. */
  full?: string
}

export type Table020Row = {
  title: string
  values: string[]
}

export type Table020Props = Omit<ComponentProps<"div">, "children"> & {
  columns?: Table020Column[]
  rows?: Table020Row[]
  caption?: string
  /** Вторая строка подписи: единицы, округление, дата среза. */
  note?: string
  /** Подпись первой колонки. */
  leadTitle?: string
  /** Пусто — подложки нет, таблица лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: заголовок таблицы — настоящий caption, а не абзац сверху.
// В нём же лежит вторая строка про единицы, округление и дату среза, поэтому
// скринридер объявляет условия чтения до первой ячейки. Единица каждой
// колонки вынесена в отдельную строку шапки, сокращения раскрыты через abbr.
//
// Тема берётся из color-scheme окружения через light-dark(): таблица темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="table-020"]){
--vibeui-table-020-bg:transparent;
--vibeui-table-020-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-table-020-muted:color-mix(in oklab,var(--vibeui-table-020-fg) 68%,transparent);
--vibeui-table-020-border:light-dark(oklch(0.92 0 265),oklch(0.36 0 265));
--vibeui-table-020-head:light-dark(oklch(0.5 0 265 / 5%),oklch(0.85 0 265 / 7%));
--vibeui-table-020-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.75 0.16 39.8));
--vibeui-table-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="table-020"]{color-scheme:dark}
[data-vibeui-block="table-020"]{
width:100%;box-sizing:border-box;
font-family:var(--vibeui-table-020-font);color:var(--vibeui-table-020-fg);
}
[data-vibeui-block="table-020"] [data-part="shell"]{
background:var(--vibeui-table-020-bg);
border:1px solid var(--vibeui-table-020-border);border-radius:1rem;overflow:hidden;
}
[data-vibeui-block="table-020"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="table-020"] [data-part="scroll"]:focus-visible{
outline:2px solid var(--vibeui-table-020-accent);outline-offset:-2px;
}
[data-vibeui-block="table-020"] table{width:100%;border-collapse:collapse;font-size:0.8125rem;min-width:24rem}
/* caption-side:top задан явно: в печати браузеры любят унести подпись вниз. */
[data-vibeui-block="table-020"] caption{
caption-side:top;text-align:left;padding:0.875rem 1rem 0.75rem;
border-bottom:1px solid var(--vibeui-table-020-border);
}
[data-vibeui-block="table-020"] [data-part="title"]{
display:block;font-size:0.9375rem;font-weight:650;line-height:1.3;
}
[data-vibeui-block="table-020"] [data-part="note"]{
display:block;margin-top:0.25rem;max-width:44ch;
font-size:0.75rem;line-height:1.45;color:var(--vibeui-table-020-muted);
}
[data-vibeui-block="table-020"] th,
[data-vibeui-block="table-020"] td{padding:0.5rem 0.875rem;text-align:right}
[data-vibeui-block="table-020"] thead th{
background:var(--vibeui-table-020-head);font-weight:600;vertical-align:bottom;
border-bottom:1px solid var(--vibeui-table-020-border);white-space:nowrap;
}
[data-vibeui-block="table-020"] thead th:first-child,
[data-vibeui-block="table-020"] tbody th{text-align:left}
[data-vibeui-block="table-020"] tbody th{font-weight:500}
[data-vibeui-block="table-020"] tbody tr + tr th,
[data-vibeui-block="table-020"] tbody tr + tr td{border-top:1px solid var(--vibeui-table-020-border)}
[data-vibeui-block="table-020"] tbody td{font-variant-numeric:tabular-nums}
[data-vibeui-block="table-020"] [data-part="unit"]{
display:block;font-size:0.6875rem;font-weight:500;color:var(--vibeui-table-020-muted);
letter-spacing:0.01em;
}
/* Пунктир под сокращением: подсказка есть, но она не выглядит ссылкой. */
[data-vibeui-block="table-020"] abbr{
text-decoration:underline dotted;text-underline-offset:0.15em;cursor:help;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="table-020"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS: Table020Column[] = [
  { title: "Выручка", unit: "тыс. ₽" },
  { title: "Заказы", unit: "шт." },
  { title: "Средний чек", unit: "₽" },
  { title: "Доля рынка", unit: "п. п.", full: "процентные пункты" },
]

const DEFAULT_ROWS: Table020Row[] = [
  { title: "Магазин на Лесной", values: ["1 284", "612", "2 098", "+0,4"] },
  { title: "Магазин в Строгино", values: ["948", "471", "2 013", "−0,2"] },
  { title: "Пункт выдачи «Юг»", values: ["402", "388", "1 036", "+0,1"] },
  { title: "Онлайн-витрина", values: ["3 116", "1 940", "1 606", "+1,2"] },
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
 * Таблица с подписью caption, где объяснены единицы, округление и дата среза.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table020({
  columns = DEFAULT_COLUMNS,
  rows = DEFAULT_ROWS,
  caption = "Продажи по точкам, август",
  note = "Значения округлены до целых, выручка — в тысячах рублей без НДС. Срез данных на 31 августа, 23:59 по Москве.",
  leadTitle = "Точка продаж",
  background = "",
  accent,
  className,
  style,
  ...props
}: Table020Props) {
  const palette = {
    ...(accent ? { "--vibeui-table-020-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-table-020-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-table-020" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="table"
        data-vibeui-block="table-020"
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
              <caption>
                <span data-part="title">{caption}</span>
                <span data-part="note">{note}</span>
              </caption>
              <thead>
                <tr>
                  <th scope="col">{leadTitle}</th>
                  {columns.map((column) => (
                    <th key={column.title} scope="col">
                      {column.title}
                      <span data-part="unit">
                        {column.full ? (
                          <abbr title={column.full}>{column.unit}</abbr>
                        ) : (
                          column.unit
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.title}>
                    <th scope="row">{row.title}</th>
                    {columns.map((column, index) => (
                      <td key={column.title}>{row.values[index] ?? "—"}</td>
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

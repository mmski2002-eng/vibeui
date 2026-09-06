import type { ComponentProps, CSSProperties } from "react"

export type Table012Line = {
  title: string
  note?: string
  quantity: number
  price: number
}

export type Table012Props = Omit<ComponentProps<"div">, "children"> & {
  lines?: Table012Line[]
  /** Ставка налога в процентах: считается поверх подытога. */
  taxRate?: number
  currency?: string
  caption?: string
  /** Заголовки колонок: компонент несёт русские, проект подставляет свои. */
  columnText?: Record<string, string>
  /** Подписи расчёта: ключи subtotal, tax (с подстановкой {rate}) и total. */
  totalsText?: Record<string, string>
  /** Пусто — подложки нет, смета лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: смета, где расчёт виден целиком — подытог, скидка, налог
// и итог лежат в tfoot отдельными строками, а не сворачиваются в одно число.
// Подписи расчёта — заголовки строк (th scope="row"), поэтому «1 200 ₽»
// всегда читается вместе со словом, к которому относится.
//
// Тема берётся из color-scheme окружения через light-dark(): смета темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="table-012"]){
--vibeui-table-012-bg:transparent;
--vibeui-table-012-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-table-012-muted:color-mix(in oklab,var(--vibeui-table-012-fg) 68%,transparent);
--vibeui-table-012-border:light-dark(oklch(0.92 0 265),oklch(0.36 0 265));
--vibeui-table-012-head:light-dark(oklch(0.5 0 265 / 5%),oklch(0.85 0 265 / 7%));
--vibeui-table-012-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.75 0.16 39.8));
--vibeui-table-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="table-012"]{color-scheme:dark}
[data-vibeui-block="table-012"]{
width:100%;box-sizing:border-box;
font-family:var(--vibeui-table-012-font);color:var(--vibeui-table-012-fg);
}
[data-vibeui-block="table-012"] [data-part="shell"]{
background:var(--vibeui-table-012-bg);
border:1px solid var(--vibeui-table-012-border);border-radius:1rem;overflow:hidden;
}
[data-vibeui-block="table-012"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="table-012"] [data-part="scroll"]:focus-visible{
outline:2px solid var(--vibeui-table-012-accent);outline-offset:-2px;
}
[data-vibeui-block="table-012"] table{width:100%;border-collapse:collapse;font-size:0.8125rem;min-width:24rem}
[data-vibeui-block="table-012"] caption{
padding:0.875rem 1rem 0.5rem;text-align:left;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="table-012"] th,
[data-vibeui-block="table-012"] td{padding:0.5rem 0.875rem;text-align:left}
[data-vibeui-block="table-012"] thead th{
background:var(--vibeui-table-012-head);font-weight:600;white-space:nowrap;
border-bottom:1px solid var(--vibeui-table-012-border);
}
[data-vibeui-block="table-012"] tbody tr + tr th,
[data-vibeui-block="table-012"] tbody tr + tr td{border-top:1px solid var(--vibeui-table-012-border)}
[data-vibeui-block="table-012"] [data-align="end"]{
text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap;
}
[data-vibeui-block="table-012"] [data-part="note"]{
display:block;font-size:0.75rem;font-weight:400;color:var(--vibeui-table-012-muted);
}
[data-vibeui-block="table-012"] tbody th{font-weight:600}
/* Расчёт отбит от позиций: без этой линии итог читается как ещё одна позиция. */
[data-vibeui-block="table-012"] tfoot th,
[data-vibeui-block="table-012"] tfoot td{
padding:0.375rem 0.875rem;color:var(--vibeui-table-012-muted);font-weight:500;
}
[data-vibeui-block="table-012"] tfoot tr:first-child th,
[data-vibeui-block="table-012"] tfoot tr:first-child td{
padding-top:0.75rem;border-top:1px solid var(--vibeui-table-012-border);
}
[data-vibeui-block="table-012"] tfoot [data-row="total"] th,
[data-vibeui-block="table-012"] tfoot [data-row="total"] td{
padding-top:0.5rem;padding-bottom:0.875rem;
color:var(--vibeui-table-012-fg);font-size:1rem;font-weight:700;
}
[data-vibeui-block="table-012"] tfoot [data-row="total"] td{color:var(--vibeui-table-012-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="table-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINES: Table012Line[] = [
  {
    title: "Дизайн лендинга",
    note: "5 экранов, 2 правки",
    quantity: 1,
    price: 84000,
  },
  { title: "Вёрстка", note: "адаптив до 360 px", quantity: 1, price: 46000 },
  { title: "Иконки", note: "штучно", quantity: 12, price: 900 },
  { title: "Поддержка", note: "часов в месяц", quantity: 8, price: 3200 },
]

const COLUMN_TEXT: Record<string, string> = {
  title: "Работа",
  quantity: "Кол-во",
  price: "Цена",
  amount: "Сумма",
}

const TOTALS_TEXT: Record<string, string> = {
  subtotal: "Подытог",
  tax: "Налог {rate}%",
  total: "К оплате",
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

/** Разряды разделяем неразрывным пробелом: сумма не должна рваться переносом. */
function money(value: number, currency: string) {
  const fixed = Math.round(value * 100) / 100
  const [whole, fraction = "00"] = fixed.toFixed(2).split(".")
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, " ")

  return `${grouped},${fraction} ${currency}`
}

/**
 * Смета с раскрытым расчётом: подытог, скидка, налог и итог в tfoot.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table012({
  lines = DEFAULT_LINES,
  taxRate = 20,
  currency = "₽",
  caption = "Смета на запуск сайта",
  columnText = COLUMN_TEXT,
  totalsText = TOTALS_TEXT,
  background = "",
  accent,
  className,
  style,
  ...props
}: Table012Props) {
  const palette = {
    ...(accent ? { "--vibeui-table-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-table-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const subtotal = lines.reduce(
    (sum, line) => sum + line.quantity * line.price,
    0,
  )
  const tax = (subtotal * taxRate) / 100

  return (
    <>
      <style href="vibeui-table-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="table"
        data-vibeui-block="table-012"
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
                  <th scope="col">{columnText.title ?? COLUMN_TEXT.title}</th>
                  <th scope="col" data-align="end">
                    {columnText.quantity ?? COLUMN_TEXT.quantity}
                  </th>
                  <th scope="col" data-align="end">
                    {columnText.price ?? COLUMN_TEXT.price}
                  </th>
                  <th scope="col" data-align="end">
                    {columnText.amount ?? COLUMN_TEXT.amount}
                  </th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.title}>
                    <th scope="row">
                      {line.title}
                      {line.note ? (
                        <span data-part="note">{line.note}</span>
                      ) : null}
                    </th>
                    <td data-align="end">{line.quantity}</td>
                    <td data-align="end">{money(line.price, currency)}</td>
                    <td data-align="end">
                      {money(line.quantity * line.price, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" colSpan={3} data-align="end">
                    {totalsText.subtotal ?? TOTALS_TEXT.subtotal}
                  </th>
                  <td data-align="end">{money(subtotal, currency)}</td>
                </tr>
                <tr>
                  <th scope="row" colSpan={3} data-align="end">
                    {(totalsText.tax ?? TOTALS_TEXT.tax).replace(
                      "{rate}",
                      String(taxRate),
                    )}
                  </th>
                  <td data-align="end">{money(tax, currency)}</td>
                </tr>
                <tr data-row="total">
                  <th scope="row" colSpan={3} data-align="end">
                    {totalsText.total ?? TOTALS_TEXT.total}
                  </th>
                  <td data-align="end">{money(subtotal + tax, currency)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

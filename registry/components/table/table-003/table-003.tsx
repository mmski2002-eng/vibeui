import type { ComponentProps, CSSProperties } from "react"

export type Table003Line = {
  title: string
  hint?: string
  quantity?: number
  amount: number
}

export type Table003Props = Omit<ComponentProps<"div">, "children"> & {
  lines?: Table003Line[]
  /** Ставка налога в процентах. 0 — строку налога не показывать. */
  taxRate?: number
  currency?: string
  caption?: string
  /** Подписи колонок: компонент несёт русские, проект подставляет свои. */
  headingText?: Record<string, string>
  /** Строка налога; {rate} подставляет ставку. */
  taxText?: string
  totalText?: string
  /** Пусто — подложки нет, таблица лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: таблица с деньгами, где итог виден без прокрутки. Строка
// итога стоит в <tfoot> и липнет к низу обёртки, суммы идут моноширинными
// цифрами по правому краю, а сам итог считается из строк, а не задаётся
// отдельным пропом — разойтись они не могут.
//
// Тема берётся из color-scheme окружения через light-dark(): счёт темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="table-003"]){
--vibeui-table-003-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-table-003-muted:color-mix(in oklab,var(--vibeui-table-003-fg) 68%,transparent);
--vibeui-table-003-bg:transparent;
--vibeui-table-003-foot:light-dark(oklch(0.975 0 265),oklch(0.27 0 265));
--vibeui-table-003-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-table-003-accent:light-dark(oklch(0.287 0 0),oklch(0.905 0 0));
--vibeui-table-003-radius:0.75rem;
--vibeui-table-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="table-003"]{color-scheme:dark}
[data-vibeui-block="table-003"]{
width:100%;max-width:34rem;box-sizing:border-box;overflow:auto;max-height:24rem;
border:1px solid var(--vibeui-table-003-border);
border-radius:var(--vibeui-table-003-radius);
background:var(--vibeui-table-003-bg);color:var(--vibeui-table-003-fg);
font-family:var(--vibeui-table-003-font);
}
[data-vibeui-block="table-003"] table{width:100%;border-collapse:separate;border-spacing:0;font-size:0.875rem}
[data-vibeui-block="table-003"] caption{
padding:0.75rem 0.9375rem;text-align:left;
font-size:0.8125rem;font-weight:600;
border-bottom:1px solid var(--vibeui-table-003-border);
}
[data-vibeui-block="table-003"] th{
padding:0.5rem 0.9375rem;text-align:left;
font-size:0.6875rem;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;
color:var(--vibeui-table-003-muted);
border-bottom:1px solid var(--vibeui-table-003-border);
}
[data-vibeui-block="table-003"] td{
padding:0.625rem 0.9375rem;border-bottom:1px solid var(--vibeui-table-003-border);
}
[data-vibeui-block="table-003"] [data-part="hint"]{
display:block;font-size:0.75rem;color:var(--vibeui-table-003-muted);
}
[data-vibeui-block="table-003"] [data-numeric="true"]{
text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap;
}
/* Итог липнет к низу: сумма видна и на середине длинного списка. */
[data-vibeui-block="table-003"] tfoot td{
position:sticky;bottom:0;
background:var(--vibeui-table-003-foot);
border-top:1px solid var(--vibeui-table-003-border);border-bottom:0;
}
[data-vibeui-block="table-003"] tfoot [data-part="total"]{font-size:1rem;font-weight:600}
/* Итоговая сумма — единственное акцентное пятно: на неё и смотрят. */
[data-vibeui-block="table-003"] tfoot [data-numeric="true"][data-part="total"]{color:var(--vibeui-table-003-accent)}
[data-vibeui-block="table-003"] tfoot [data-part="sub"]{color:var(--vibeui-table-003-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="table-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINES: Table003Line[] = [
  {
    title: "Тариф «Команда»",
    hint: "Годовая подписка, 12 месяцев",
    quantity: 1,
    amount: 28800,
  },
  {
    title: "Дополнительные участники",
    hint: "3 человека сверх тарифа",
    quantity: 3,
    amount: 10800,
  },
  { title: "Домен .ru", hint: "Продление на год", quantity: 1, amount: 890 },
]

const HEADING_TEXT: Record<string, string> = {
  title: "Позиция",
  quantity: "Кол-во",
  amount: "Сумма",
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

/** Пробел вместо разделителя тысяч и запятая в дробной части — как в рублях. */
function formatAmount(value: number, currency: string) {
  const rounded = Math.round(value * 100) / 100
  const [whole, fraction = "00"] = rounded.toFixed(2).split(".")
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, " ")

  return `${grouped},${fraction} ${currency}`
}

/**
 * Таблица позиций с итогом, который считается из строк и липнет к низу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table003({
  lines = DEFAULT_LINES,
  taxRate = 20,
  currency = "₽",
  caption = "Счёт на оплату",
  headingText = HEADING_TEXT,
  taxText = "НДС {rate} %",
  totalText = "Итого",
  background = "",
  accent,
  className,
  style,
  ...props
}: Table003Props) {
  const palette = {
    ...(accent ? { "--vibeui-table-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-table-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0)
  const tax = (subtotal * taxRate) / 100
  const total = subtotal + tax

  return (
    <>
      <style href="vibeui-table-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="table"
        data-vibeui-block="table-003"
        className={className}
        style={palette}
      >
        <table>
          {caption ? <caption>{caption}</caption> : null}
          <thead>
            <tr>
              <th scope="col">{headingText.title ?? HEADING_TEXT.title}</th>
              <th scope="col" data-numeric="true">
                {headingText.quantity ?? HEADING_TEXT.quantity}
              </th>
              <th scope="col" data-numeric="true">
                {headingText.amount ?? HEADING_TEXT.amount}
              </th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr key={line.title}>
                <td>
                  {line.title}
                  {line.hint ? <span data-part="hint">{line.hint}</span> : null}
                </td>
                <td data-numeric="true">{line.quantity ?? 1}</td>
                <td data-numeric="true">
                  {formatAmount(line.amount, currency)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            {taxRate > 0 ? (
              <tr>
                <td colSpan={2} data-part="sub">
                  {taxText.replace("{rate}", String(taxRate))}
                </td>
                <td data-numeric="true" data-part="sub">
                  {formatAmount(tax, currency)}
                </td>
              </tr>
            ) : null}
            <tr>
              <td colSpan={2} data-part="total">
                {totalText}
              </td>
              <td data-numeric="true" data-part="total">
                {formatAmount(total, currency)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  )
}

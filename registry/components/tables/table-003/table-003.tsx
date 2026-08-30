import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Table003Line = {
  title: string
  hint?: string
  quantity?: number
  amount: number
}

export type Table003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  lines?: Table003Line[]
  /** Ставка налога в процентах. 0 — строку налога не показывать. */
  taxRate?: number
  currency?: string
  caption?: string
  accent?: string
}

// Идея компонента: таблица с деньгами, где итог виден без прокрутки. Строка
// итога стоит в <tfoot> и липнет к низу обёртки, суммы идут моноширинными
// цифрами по правому краю, а сам итог считается из строк, а не задаётся
// отдельным пропом — разойтись они не могут.
const STYLES = `
:where([data-vibeui-block="table-003"]){
--vibeui-table-003-fg:oklch(0.24 0.016 265);
--vibeui-table-003-muted:oklch(0.54 0.014 265);
--vibeui-table-003-bg:oklch(1 0 0);
--vibeui-table-003-foot:oklch(0.975 0.003 265);
--vibeui-table-003-border:oklch(0.91 0.006 265);
--vibeui-table-003-accent:oklch(0.55 0.2 262);
--vibeui-table-003-radius:0.75rem;
--vibeui-table-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
  accent,
  className,
  style,
  ...props
}: Table003Props) {
  const palette = {
    ...(accent ? { "--vibeui-table-003-accent": accent } : null),
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
        data-vibeui-block="table-003"
        className={className}
        style={palette}
      >
        <table>
          {caption ? <caption>{caption}</caption> : null}
          <thead>
            <tr>
              <th scope="col">Позиция</th>
              <th scope="col" data-numeric="true">
                Кол-во
              </th>
              <th scope="col" data-numeric="true">
                Сумма
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
                  НДС {taxRate} %
                </td>
                <td data-numeric="true" data-part="sub">
                  {formatAmount(tax, currency)}
                </td>
              </tr>
            ) : null}
            <tr>
              <td colSpan={2} data-part="total">
                Итого
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

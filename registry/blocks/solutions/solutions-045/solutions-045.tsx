import type { CSSProperties } from "react"

export type Solutions045Operation = {
  date: string
  side: "buy" | "sell"
  currency: string
  amount: number
  dealRate: number
  cbRate: number
}

export type Solutions045Position = {
  currency: string
  amount: number
  limit: number
}

export type Solutions045Props = {
  title?: string
  subtitle?: string
  operations?: Solutions045Operation[]
  positions?: Solutions045Position[]
  foot?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: журнал валютных операций. Отклонение курса сделки от курса ЦБ
// не приходит пропом — считается в компоненте из двух чисел, поэтому не
// может разойтись со знаком в стрелке. Сумма в рублях тоже не задаётся
// отдельно: это сумма в валюте, умноженная на курс сделки, — иначе правка
// одного числа молча ломает другое. Позиции по валютам — горизонтальные
// полосы относительно лимита, а не голые числа: превышение видно геометрией.
const STYLES = `
:where([data-vibeui-block="solutions-045"]){
--vibeui-solutions-045-bg:oklch(1 0 0);
--vibeui-solutions-045-panel:oklch(0.977 0.004 250);
--vibeui-solutions-045-fg:oklch(0.21 0.014 265);
--vibeui-solutions-045-muted:oklch(0.55 0.014 265);
--vibeui-solutions-045-border:oklch(0.9 0.006 265);
--vibeui-solutions-045-accent:oklch(0.5 0.16 265);
--vibeui-solutions-045-buy:oklch(0.55 0.14 152);
--vibeui-solutions-045-sell:oklch(0.56 0.17 25);
--vibeui-solutions-045-warn:oklch(0.65 0.15 75);
--vibeui-solutions-045-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-045-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-045"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-045-bg);
border:1px solid var(--vibeui-solutions-045-border);border-radius:1rem;
font-family:var(--vibeui-solutions-045-sans);color:var(--vibeui-solutions-045-fg);
}
[data-vibeui-block="solutions-045"] *{box-sizing:border-box}
[data-vibeui-block="solutions-045"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-045"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-045"] [data-part="subtitle"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-045-muted)}
[data-vibeui-block="solutions-045"] [data-part="scroll"]{overflow-x:auto;scrollbar-width:thin}
[data-vibeui-block="solutions-045"] table{width:100%;min-width:42rem;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="solutions-045"] th,
[data-vibeui-block="solutions-045"] td{
padding:0.5rem 0.625rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-solutions-045-border);
}
[data-vibeui-block="solutions-045"] th:first-child,
[data-vibeui-block="solutions-045"] td:first-child{padding-left:1rem}
[data-vibeui-block="solutions-045"] th:last-child,
[data-vibeui-block="solutions-045"] td:last-child{padding-right:1rem}
[data-vibeui-block="solutions-045"] th{
font-size:0.625rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-045-muted);background:var(--vibeui-solutions-045-panel);
}
[data-vibeui-block="solutions-045"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="solutions-045"] [data-part="side"]{
display:inline-flex;align-items:center;gap:0.3125rem;font-size:0.6875rem;font-weight:650;
padding:0.125rem 0.5rem 0.125rem 0.375rem;border-radius:9999px;border:1px solid var(--vibeui-solutions-045-border);
}
[data-vibeui-block="solutions-045"] [data-side="buy"]{color:var(--vibeui-solutions-045-buy);border-color:color-mix(in oklab,var(--vibeui-solutions-045-buy) 50%,transparent)}
[data-vibeui-block="solutions-045"] [data-side="sell"]{color:var(--vibeui-solutions-045-sell);border-color:color-mix(in oklab,var(--vibeui-solutions-045-sell) 50%,transparent)}
[data-vibeui-block="solutions-045"] [data-part="rate"]{font-family:var(--vibeui-solutions-045-mono);font-size:0.75rem;text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="solutions-045"] [data-part="deviation"]{
display:inline-flex;align-items:center;gap:0.25rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-045"] [data-deviation="above"]{color:var(--vibeui-solutions-045-sell)}
[data-vibeui-block="solutions-045"] [data-deviation="below"]{color:var(--vibeui-solutions-045-buy)}
[data-vibeui-block="solutions-045"] [data-part="arrow"]{font-size:0.625rem}
[data-vibeui-block="solutions-045"] [data-part="rub"]{font-weight:650;text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="solutions-045"] [data-part="positions"]{
padding:0.875rem 1rem 1rem;border-top:1px solid var(--vibeui-solutions-045-border);
display:flex;flex-direction:column;gap:0.625rem;
}
[data-vibeui-block="solutions-045"] [data-part="positions-title"]{
margin:0;font-size:0.6875rem;font-weight:650;letter-spacing:0.02em;text-transform:uppercase;
color:var(--vibeui-solutions-045-muted);
}
[data-vibeui-block="solutions-045"] [data-part="position"]{display:grid;gap:0.25rem}
[data-vibeui-block="solutions-045"] [data-part="position-head"]{
display:flex;justify-content:space-between;font-size:0.75rem;
}
[data-vibeui-block="solutions-045"] [data-part="position-head"] b{font-variant-numeric:tabular-nums}
[data-vibeui-block="solutions-045"] [data-part="bar-track"]{
height:0.5rem;border-radius:9999px;background:var(--vibeui-solutions-045-panel);
border:1px solid var(--vibeui-solutions-045-border);overflow:hidden;
}
[data-vibeui-block="solutions-045"] [data-part="bar-fill"]{
height:100%;border-radius:9999px;background:var(--vibeui-solutions-045-accent);
}
[data-vibeui-block="solutions-045"] [data-over="true"] [data-part="bar-fill"]{background:var(--vibeui-solutions-045-warn)}
[data-vibeui-block="solutions-045"] [data-part="limit-note"]{margin:0;font-size:0.625rem;color:var(--vibeui-solutions-045-muted)}
[data-vibeui-block="solutions-045"] [data-part="foot"]{
margin:0;padding:0 1rem 1rem;font-size:0.75rem;color:var(--vibeui-solutions-045-muted);
}
@container (min-width: 34rem){
[data-vibeui-block="solutions-045"] [data-part="positions"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.75rem 1.5rem;
}
[data-vibeui-block="solutions-045"] [data-part="positions-title"]{grid-column:1 / -1}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-045"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPERATIONS: Solutions045Operation[] = [
  {
    date: "3 мар",
    side: "buy",
    currency: "USD",
    amount: 50000,
    dealRate: 92.85,
    cbRate: 91.4,
  },
  {
    date: "4 мар",
    side: "sell",
    currency: "EUR",
    amount: 20000,
    dealRate: 98.1,
    cbRate: 99.2,
  },
  {
    date: "5 мар",
    side: "buy",
    currency: "CNY",
    amount: 300000,
    dealRate: 12.74,
    cbRate: 12.6,
  },
  {
    date: "6 мар",
    side: "sell",
    currency: "USD",
    amount: 15000,
    dealRate: 91.9,
    cbRate: 91.6,
  },
]

const DEFAULT_POSITIONS: Solutions045Position[] = [
  { currency: "USD", amount: 128000, limit: 150000 },
  { currency: "EUR", amount: 34000, limit: 60000 },
  { currency: "CNY", amount: 640000, limit: 500000 },
]

const CURRENCY_LABEL: Record<string, string> = {
  USD: "$",
  EUR: "€",
  CNY: "¥",
}

function money(amount: number): string {
  return `${Math.round(amount).toLocaleString("ru-RU")} ₽`
}

/**
 * Журнал валютных операций: отклонение от курса ЦБ и сумма в рублях
 * посчитаны из курса и объёма сделки, позиции — полосой относительно лимита.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions045({
  title = "Валютные операции",
  subtitle = "Казначейство · неделя 10",
  operations = DEFAULT_OPERATIONS,
  positions = DEFAULT_POSITIONS,
  foot = "Отклонение считается от курса ЦБ на дату сделки: выше рынка при покупке — переплата, ниже — экономия.",
  accent,
  className,
  style,
}: Solutions045Props) {
  const palette = {
    ...(accent ? { "--vibeui-solutions-045-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-045" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-045"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="subtitle">{subtitle}</p>
          </div>
        </header>

        <div data-part="scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Дата</th>
                <th scope="col">Операция</th>
                <th scope="col" data-align="end">
                  Сумма в валюте
                </th>
                <th scope="col" data-align="end">
                  Курс сделки
                </th>
                <th scope="col" data-align="end">
                  Курс ЦБ
                </th>
                <th scope="col" data-align="end">
                  Отклонение
                </th>
                <th scope="col" data-align="end">
                  Сумма в рублях
                </th>
              </tr>
            </thead>
            <tbody>
              {operations.map((operation) => {
                const deviationPercent =
                  ((operation.dealRate - operation.cbRate) / operation.cbRate) *
                  100
                const above = deviationPercent > 0
                const rubles = operation.amount * operation.dealRate
                return (
                  <tr
                    key={`${operation.date}-${operation.currency}-${operation.side}`}
                  >
                    <td>{operation.date}</td>
                    <td>
                      <span data-part="side" data-side={operation.side}>
                        {operation.side === "buy" ? "покупка" : "продажа"}{" "}
                        {operation.currency}
                      </span>
                    </td>
                    <td data-align="end">
                      {CURRENCY_LABEL[operation.currency] ?? ""}
                      {operation.amount.toLocaleString("ru-RU")}
                    </td>
                    <td data-part="rate">{operation.dealRate.toFixed(2)}</td>
                    <td data-part="rate">{operation.cbRate.toFixed(2)}</td>
                    <td data-align="end">
                      <span
                        data-part="deviation"
                        data-deviation={above ? "above" : "below"}
                      >
                        <span data-part="arrow" aria-hidden="true">
                          {above ? "▲" : "▼"}
                        </span>
                        {Math.abs(deviationPercent).toFixed(2)}%
                      </span>
                    </td>
                    <td data-part="rub">{money(rubles)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div data-part="positions">
          <p data-part="positions-title">Позиции по валютам</p>
          {positions.map((position) => {
            const percent = Math.min(
              100,
              Math.round((position.amount / position.limit) * 100),
            )
            const over = position.amount > position.limit
            return (
              <div data-part="position" key={position.currency}>
                <p data-part="position-head">
                  <span>{position.currency}</span>
                  <b>
                    {CURRENCY_LABEL[position.currency] ?? ""}
                    {position.amount.toLocaleString("ru-RU")}
                  </b>
                </p>
                <div
                  data-part="bar-track"
                  data-over={over ? "true" : "false"}
                  role="progressbar"
                  aria-label={`Позиция по ${position.currency} относительно лимита`}
                  aria-valuenow={position.amount}
                  aria-valuemin={0}
                  aria-valuemax={position.limit}
                >
                  <div data-part="bar-fill" style={{ width: `${percent}%` }} />
                </div>
                <p data-part="limit-note">
                  {over
                    ? `превышен лимит ${position.limit.toLocaleString("ru-RU")}`
                    : `лимит ${position.limit.toLocaleString("ru-RU")}`}
                </p>
              </div>
            )
          })}
        </div>

        <p data-part="foot">{foot}</p>
      </section>
    </>
  )
}

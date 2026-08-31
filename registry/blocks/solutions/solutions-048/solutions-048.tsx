import type { CSSProperties } from "react"

export type Solutions048Invoice = {
  amount: number
  daysOverdue: number
}

export type Solutions048Debtor = {
  client: string
  invoices: Solutions048Invoice[]
}

export type Solutions048Props = {
  title?: string
  asOf?: string
  debtors?: Solutions048Debtor[]
  currency?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

type BucketKey = "b0" | "b31" | "b61" | "b90"

const BUCKETS: { key: BucketKey; label: string }[] = [
  { key: "b0", label: "0–30 дней" },
  { key: "b31", label: "31–60 дней" },
  { key: "b61", label: "61–90 дней" },
  { key: "b90", label: "90+ дней" },
]

function bucketOf(daysOverdue: number): BucketKey {
  if (daysOverdue <= 30) return "b0"
  if (daysOverdue <= 60) return "b31"
  if (daysOverdue <= 90) return "b61"
  return "b90"
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: дебиторка по корзинам срока. Сумма и доля каждой корзины не
// дублируются пропами — они сворачиваются из списка счетов построчно, чтобы
// таблица и сводка никогда не расходились между собой. Полоса состава портфеля
// нарисована как единая шкала с четырьмя сегментами: пропорция видна
// геометрией, а не только числом. У каждого должника — своя мини-шкала того
// же цвета, чтобы состав долга конкретного клиента читался тем же языком.
const STYLES = `
:where([data-vibeui-block="solutions-048"]){
--vibeui-solutions-048-bg:oklch(1 0 0);
--vibeui-solutions-048-panel:oklch(0.977 0.004 250);
--vibeui-solutions-048-fg:oklch(0.21 0.014 265);
--vibeui-solutions-048-muted:oklch(0.55 0.014 265);
--vibeui-solutions-048-border:oklch(0.9 0.006 265);
--vibeui-solutions-048-accent:oklch(0.5 0.17 265);
--vibeui-solutions-048-b0:oklch(0.62 0.13 155);
--vibeui-solutions-048-b31:oklch(0.72 0.14 95);
--vibeui-solutions-048-b61:oklch(0.66 0.17 55);
--vibeui-solutions-048-b90:oklch(0.58 0.2 25);
--vibeui-solutions-048-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-048-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-048"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-048-bg);
border:1px solid var(--vibeui-solutions-048-border);border-radius:1rem;
font-family:var(--vibeui-solutions-048-sans);color:var(--vibeui-solutions-048-fg);
}
[data-vibeui-block="solutions-048"] *{box-sizing:border-box}
[data-vibeui-block="solutions-048"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-048"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-048"] [data-part="sub"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-048-muted)}
[data-vibeui-block="solutions-048"] [data-part="buckets"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.75rem;
}
@container (min-width:34rem){
[data-vibeui-block="solutions-048"] [data-part="buckets"]{grid-template-columns:repeat(4,minmax(0,1fr))}
}
[data-vibeui-block="solutions-048"] [data-part="tile"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-solutions-048-panel);
border:1px solid var(--vibeui-solutions-048-border);
border-top:3px solid var(--vibeui-solutions-048-dot);
}
[data-vibeui-block="solutions-048"] [data-part="tile"] b{
display:block;font-size:0.9375rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.01em;
}
[data-vibeui-block="solutions-048"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-048-muted);
}
[data-vibeui-block="solutions-048"] [data-bucket="b0"]{--vibeui-solutions-048-dot:var(--vibeui-solutions-048-b0)}
[data-vibeui-block="solutions-048"] [data-bucket="b31"]{--vibeui-solutions-048-dot:var(--vibeui-solutions-048-b31)}
[data-vibeui-block="solutions-048"] [data-bucket="b61"]{--vibeui-solutions-048-dot:var(--vibeui-solutions-048-b61)}
[data-vibeui-block="solutions-048"] [data-bucket="b90"]{--vibeui-solutions-048-dot:var(--vibeui-solutions-048-b90)}
/* Шкала состава портфеля: пропорция задана шириной сегмента, не только числом. */
[data-vibeui-block="solutions-048"] [data-part="stack"]{
display:flex;height:0.625rem;border-radius:9999px;overflow:hidden;
margin:0 1rem 0.875rem;border:1px solid var(--vibeui-solutions-048-border);
width:calc(100% - 2rem);
}
[data-vibeui-block="solutions-048"] [data-part="segment"]{height:100%}
[data-vibeui-block="solutions-048"] [data-segment="b0"]{background:var(--vibeui-solutions-048-b0)}
[data-vibeui-block="solutions-048"] [data-segment="b31"]{background:var(--vibeui-solutions-048-b31)}
[data-vibeui-block="solutions-048"] [data-segment="b61"]{background:var(--vibeui-solutions-048-b61)}
[data-vibeui-block="solutions-048"] [data-segment="b90"]{background:var(--vibeui-solutions-048-b90)}
[data-vibeui-block="solutions-048"] [data-part="scroll"]{overflow-x:auto;scrollbar-width:thin}
[data-vibeui-block="solutions-048"] table{width:100%;min-width:36rem;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="solutions-048"] th,
[data-vibeui-block="solutions-048"] td{
padding:0.5rem 0.625rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-solutions-048-border);
}
[data-vibeui-block="solutions-048"] th:first-child,
[data-vibeui-block="solutions-048"] td:first-child{padding-left:1rem}
[data-vibeui-block="solutions-048"] th:last-child,
[data-vibeui-block="solutions-048"] td:last-child{padding-right:1rem}
[data-vibeui-block="solutions-048"] th{
font-size:0.625rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-048-muted);background:var(--vibeui-solutions-048-panel);
}
[data-vibeui-block="solutions-048"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="solutions-048"] [data-part="mini"]{
display:flex;height:0.5rem;border-radius:9999px;overflow:hidden;width:6rem;
border:1px solid var(--vibeui-solutions-048-border);
}
[data-vibeui-block="solutions-048"] [data-part="risk"]{
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.125rem 0.5rem 0.125rem 0.25rem;border-radius:9999px;
border:1px solid var(--vibeui-solutions-048-border);
font-size:0.6875rem;font-weight:650;color:var(--vibeui-solutions-048-muted);
}
[data-vibeui-block="solutions-048"] [data-part="letter"]{
width:1rem;height:1rem;border-radius:9999px;display:grid;place-items:center;
background:var(--vibeui-solutions-048-panel);font-size:0.5625rem;font-weight:700;line-height:1;
color:oklch(1 0 0);
}
[data-vibeui-block="solutions-048"] [data-risk="ok"] [data-part="risk"]{color:var(--vibeui-solutions-048-b0)}
[data-vibeui-block="solutions-048"] [data-risk="ok"] [data-part="letter"]{background:var(--vibeui-solutions-048-b0)}
[data-vibeui-block="solutions-048"] [data-risk="watch"] [data-part="risk"]{color:var(--vibeui-solutions-048-b31)}
[data-vibeui-block="solutions-048"] [data-risk="watch"] [data-part="letter"]{background:var(--vibeui-solutions-048-b31);color:var(--vibeui-solutions-048-fg)}
[data-vibeui-block="solutions-048"] [data-risk="risk"] [data-part="risk"]{color:var(--vibeui-solutions-048-b61)}
[data-vibeui-block="solutions-048"] [data-risk="risk"] [data-part="letter"]{background:var(--vibeui-solutions-048-b61)}
[data-vibeui-block="solutions-048"] [data-risk="critical"] [data-part="risk"]{color:var(--vibeui-solutions-048-b90)}
[data-vibeui-block="solutions-048"] [data-risk="critical"] [data-part="letter"]{background:var(--vibeui-solutions-048-b90)}
[data-vibeui-block="solutions-048"] [data-part="foot"]{
margin:0;padding:0.75rem 1rem 1rem;font-size:0.75rem;color:var(--vibeui-solutions-048-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-048"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_DEBTORS: Solutions048Debtor[] = [
  {
    client: "Логистика «Верста»",
    invoices: [{ amount: 410000, daysOverdue: 98 }],
  },
  {
    client: "Стройдвор",
    invoices: [
      { amount: 220000, daysOverdue: 75 },
      { amount: 90000, daysOverdue: 20 },
    ],
  },
  {
    client: "ИП Кравцов",
    invoices: [
      { amount: 145000, daysOverdue: 12 },
      { amount: 60000, daysOverdue: 5 },
    ],
  },
  {
    client: "Клиника «Исток»",
    invoices: [
      { amount: 76000, daysOverdue: 58 },
      { amount: 31000, daysOverdue: 8 },
    ],
  },
  {
    client: "Ателье «Нить»",
    invoices: [{ amount: 52000, daysOverdue: 33 }],
  },
  {
    client: "Кофейня «Мера»",
    invoices: [{ amount: 38000, daysOverdue: 45 }],
  },
]

function money(value: number, currency: string) {
  return `${Math.round(value).toLocaleString("ru-RU")} ${currency}`
}

function riskOf(oldest: number): "ok" | "watch" | "risk" | "critical" {
  if (oldest <= 30) return "ok"
  if (oldest <= 60) return "watch"
  if (oldest <= 90) return "risk"
  return "critical"
}

const RISK_LABEL = {
  ok: { letter: "Н", label: "в норме" },
  watch: { letter: "К", label: "к оплате" },
  risk: { letter: "Р", label: "риск" },
  critical: { letter: "!", label: "критично" },
} as const

/**
 * Дебиторская задолженность по корзинам срока: суммы и доли сворачиваются из
 * списка счетов, риск клиента выводится из давности старейшего долга.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions048({
  title = "Дебиторская задолженность",
  asOf = "на 31 марта 2024",
  debtors = DEFAULT_DEBTORS,
  currency = "₽",
  accent,
  className,
  style,
}: Solutions048Props) {
  const buckets: Record<BucketKey, number> = { b0: 0, b31: 0, b61: 0, b90: 0 }
  let grandTotal = 0

  for (const debtor of debtors) {
    for (const invoice of debtor.invoices) {
      buckets[bucketOf(invoice.daysOverdue)] += invoice.amount
      grandTotal += invoice.amount
    }
  }

  const overdueOver60 =
    grandTotal > 0 ? ((buckets.b61 + buckets.b90) / grandTotal) * 100 : 0

  const rows = debtors
    .map((debtor) => {
      const rowBuckets: Record<BucketKey, number> = {
        b0: 0,
        b31: 0,
        b61: 0,
        b90: 0,
      }
      let total = 0
      let oldest = 0
      for (const invoice of debtor.invoices) {
        rowBuckets[bucketOf(invoice.daysOverdue)] += invoice.amount
        total += invoice.amount
        oldest = Math.max(oldest, invoice.daysOverdue)
      }
      return { client: debtor.client, total, oldest, buckets: rowBuckets }
    })
    .sort((a, b) => b.total - a.total)

  const palette = {
    ...(accent ? { "--vibeui-solutions-048-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-048" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-048"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="sub">{asOf}</p>
          </div>
          <p data-part="sub">
            Всего долга {money(grandTotal, currency)} · старше 60 дней{" "}
            {overdueOver60.toFixed(0)}%
          </p>
        </header>

        <div data-part="buckets">
          {BUCKETS.map((bucket) => (
            <p data-part="tile" data-bucket={bucket.key} key={bucket.key}>
              <b>{money(buckets[bucket.key], currency)}</b>
              <span>
                {bucket.label} ·{" "}
                {grandTotal > 0
                  ? ((buckets[bucket.key] / grandTotal) * 100).toFixed(0)
                  : 0}
                %
              </span>
            </p>
          ))}
        </div>

        <div
          data-part="stack"
          role="img"
          aria-label={`Состав долга: ${BUCKETS.map(
            (bucket) =>
              `${bucket.label} — ${grandTotal > 0 ? ((buckets[bucket.key] / grandTotal) * 100).toFixed(0) : 0}%`,
          ).join(", ")}`}
        >
          {BUCKETS.map((bucket) => (
            <span
              data-part="segment"
              data-segment={bucket.key}
              key={bucket.key}
              style={{
                width: `${grandTotal > 0 ? (buckets[bucket.key] / grandTotal) * 100 : 0}%`,
              }}
            />
          ))}
        </div>

        <div data-part="scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Клиент</th>
                <th scope="col" data-align="end">
                  Долг
                </th>
                <th scope="col" data-align="end">
                  Старший счёт
                </th>
                <th scope="col">Состав</th>
                <th scope="col">Риск</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const risk = riskOf(row.oldest)
                return (
                  <tr key={row.client} data-risk={risk}>
                    <td>{row.client}</td>
                    <td data-align="end">{money(row.total, currency)}</td>
                    <td data-align="end">{row.oldest} дн.</td>
                    <td>
                      <span
                        data-part="mini"
                        role="img"
                        aria-label={`Состав долга ${row.client} по корзинам срока`}
                      >
                        {BUCKETS.map((bucket) => (
                          <span
                            data-part="segment"
                            data-segment={bucket.key}
                            key={bucket.key}
                            style={{
                              width: `${row.total > 0 ? (row.buckets[bucket.key] / row.total) * 100 : 0}%`,
                            }}
                          />
                        ))}
                      </span>
                    </td>
                    <td>
                      <span data-part="risk">
                        <span data-part="letter" aria-hidden="true">
                          {RISK_LABEL[risk].letter}
                        </span>
                        {RISK_LABEL[risk].label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <p data-part="foot">
          Крупнейшие должники — {rows[0]?.client} и {rows[1]?.client} — вместе
          формируют{" "}
          {grandTotal > 0
            ? (
                (((rows[0]?.total ?? 0) + (rows[1]?.total ?? 0)) / grandTotal) *
                100
              ).toFixed(0)
            : 0}
          % всей задолженности.
        </p>
      </section>
    </>
  )
}

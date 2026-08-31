import type { CSSProperties } from "react"

export type Solutions044Order = {
  recipient: string
  inn: string
  account: string
  amount: number
  priority: 1 | 2 | 3 | 4 | 5
  signedBy: string[]
}

export type Solutions044Props = {
  title?: string
  subtitle?: string
  requiredSignatures?: number
  orders?: Solutions044Order[]
  foot?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: реестр платёжных поручений к отправке. Статус подписи не
// приходит готовой меткой — считается из длины списка подписавших против
// требуемых двух, и рисуется двумя точками: закрашена/пустая, а не одним
// словом цветом. Итог к списанию в шапке — сумма только полностью подписанных
// поручений, посчитанная в компоненте из тех же строк, что и таблица, а не
// отдельным пропом, который может разойтись со списком.
const STYLES = `
:where([data-vibeui-block="solutions-044"]){
--vibeui-solutions-044-bg:oklch(1 0 0);
--vibeui-solutions-044-panel:oklch(0.977 0.004 250);
--vibeui-solutions-044-fg:oklch(0.21 0.014 265);
--vibeui-solutions-044-muted:oklch(0.55 0.014 265);
--vibeui-solutions-044-border:oklch(0.9 0.006 265);
--vibeui-solutions-044-accent:oklch(0.5 0.16 265);
--vibeui-solutions-044-ready:oklch(0.55 0.14 152);
--vibeui-solutions-044-wait:oklch(0.65 0.15 75);
--vibeui-solutions-044-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-044-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-044"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-044-bg);
border:1px solid var(--vibeui-solutions-044-border);border-radius:1rem;
font-family:var(--vibeui-solutions-044-sans);color:var(--vibeui-solutions-044-fg);
}
[data-vibeui-block="solutions-044"] *{box-sizing:border-box}
[data-vibeui-block="solutions-044"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-044"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-044"] [data-part="subtitle"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-044-muted)}
[data-vibeui-block="solutions-044"] [data-part="stats"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
[data-vibeui-block="solutions-044"] [data-part="tile"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-solutions-044-panel);border:1px solid var(--vibeui-solutions-044-border);
}
[data-vibeui-block="solutions-044"] [data-tile="ready"]{
border-color:color-mix(in oklab,var(--vibeui-solutions-044-ready) 45%,transparent);
background:color-mix(in oklab,var(--vibeui-solutions-044-ready) 8%,var(--vibeui-solutions-044-bg));
}
[data-vibeui-block="solutions-044"] [data-part="tile"] b{
display:block;font-size:1.0625rem;font-weight:700;letter-spacing:-0.015em;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-044"] [data-tile="ready"] b{color:var(--vibeui-solutions-044-ready)}
[data-vibeui-block="solutions-044"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-044-muted);
}
[data-vibeui-block="solutions-044"] [data-part="scroll"]{overflow-x:auto;scrollbar-width:thin}
[data-vibeui-block="solutions-044"] table{width:100%;min-width:38rem;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="solutions-044"] th,
[data-vibeui-block="solutions-044"] td{
padding:0.5rem 0.625rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-solutions-044-border);
}
[data-vibeui-block="solutions-044"] th:first-child,
[data-vibeui-block="solutions-044"] td:first-child{padding-left:1rem}
[data-vibeui-block="solutions-044"] th:last-child,
[data-vibeui-block="solutions-044"] td:last-child{padding-right:1rem}
[data-vibeui-block="solutions-044"] th{
font-size:0.625rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-044-muted);background:var(--vibeui-solutions-044-panel);
}
[data-vibeui-block="solutions-044"] [data-part="requisites"]{font-size:0.6875rem;color:var(--vibeui-solutions-044-muted);font-family:var(--vibeui-solutions-044-mono)}
[data-vibeui-block="solutions-044"] [data-part="priority"]{
display:inline-grid;place-items:center;width:1.375rem;height:1.375rem;border-radius:9999px;
font-size:0.6875rem;font-weight:700;border:1px solid var(--vibeui-solutions-044-border);
color:var(--vibeui-solutions-044-muted);
}
[data-vibeui-block="solutions-044"] [data-priority="1"],
[data-vibeui-block="solutions-044"] [data-priority="2"]{
color:var(--vibeui-solutions-044-wait);border-color:color-mix(in oklab,var(--vibeui-solutions-044-wait) 50%,transparent);
}
[data-vibeui-block="solutions-044"] [data-part="amount"],
[data-vibeui-block="solutions-044"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums;font-weight:650}
[data-vibeui-block="solutions-044"] [data-part="signoff"]{display:flex;flex-direction:column;gap:0.25rem}
[data-vibeui-block="solutions-044"] [data-part="dots"]{display:inline-flex;gap:0.25rem}
[data-vibeui-block="solutions-044"] [data-part="dot"]{
width:0.75rem;height:0.75rem;border-radius:9999px;border:1px solid var(--vibeui-solutions-044-border);
display:inline-flex;align-items:center;justify-content:center;font-size:0.5rem;line-height:1;
color:transparent;
}
[data-vibeui-block="solutions-044"] [data-dot="signed"]{
background:var(--vibeui-solutions-044-ready);border-color:var(--vibeui-solutions-044-ready);color:oklch(1 0 0);
}
[data-vibeui-block="solutions-044"] [data-part="status"]{font-size:0.6875rem;color:var(--vibeui-solutions-044-muted)}
[data-vibeui-block="solutions-044"] [data-status="ready"] [data-part="status"]{color:var(--vibeui-solutions-044-ready);font-weight:650}
[data-vibeui-block="solutions-044"] [data-status="waiting"] [data-part="status"]{color:var(--vibeui-solutions-044-wait);font-weight:650}
[data-vibeui-block="solutions-044"] tfoot td{
border-top:2px solid var(--vibeui-solutions-044-border);font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-044"] [data-part="foot"]{
margin:0;padding:0.75rem 1rem 1rem;font-size:0.75rem;color:var(--vibeui-solutions-044-muted);
}
@container (min-width: 32rem){
[data-vibeui-block="solutions-044"] [data-part="stats"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-044"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ORDERS: Solutions044Order[] = [
  {
    recipient: "ФНС России по г. Москве",
    inn: "7707329152",
    account: "40101810800000010041",
    amount: 214300,
    priority: 3,
    signedBy: ["Тарасов С.", "Гаврилова А."],
  },
  {
    recipient: "ООО «Стройдвор»",
    inn: "7743012345",
    account: "40702810900000012345",
    amount: 180000,
    priority: 5,
    signedBy: ["Тарасов С."],
  },
  {
    recipient: "СФР",
    inn: "7703363868",
    account: "03100643000000018500",
    amount: 96400,
    priority: 2,
    signedBy: [],
  },
  {
    recipient: "ООО «Нить»",
    inn: "7714099887",
    account: "40702810300000098765",
    amount: 96000,
    priority: 5,
    signedBy: ["Гаврилова А.", "Тарасов С."],
  },
  {
    recipient: "Иванов П. Р. (зарплата)",
    inn: "772345678901",
    account: "40817810200000054321",
    amount: 148000,
    priority: 2,
    signedBy: ["Гаврилова А."],
  },
]

function money(amount: number): string {
  return `${amount.toLocaleString("ru-RU")} ₽`
}

function statusOf(
  signed: number,
  required: number,
): { key: "ready" | "waiting" | "none"; label: string } {
  if (signed >= required) return { key: "ready", label: "готово к отправке" }
  if (signed > 0)
    return { key: "waiting", label: `ждёт ${required - signed}-ю подпись` }
  return { key: "none", label: "не подписано" }
}

/**
 * Реестр платёжных поручений: статус подписи посчитан из числа подписавших,
 * итог к списанию — сумма только полностью подписанных строк.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions044({
  title = "Платёжные поручения",
  subtitle = "К отправке в банк · 8 марта",
  requiredSignatures = 2,
  orders = DEFAULT_ORDERS,
  foot = "Поручение уходит в банк только после второй подписи — очередность определяет порядок списания при нехватке средств.",
  accent,
  className,
  style,
}: Solutions044Props) {
  const ready = orders.filter(
    (order) => order.signedBy.length >= requiredSignatures,
  )
  const readyTotal = ready.reduce((sum, order) => sum + order.amount, 0)
  const registryTotal = orders.reduce((sum, order) => sum + order.amount, 0)

  const palette = {
    ...(accent ? { "--vibeui-solutions-044-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-044" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-044"
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

        <div data-part="stats">
          <p data-part="tile" data-tile="ready">
            <b>{money(readyTotal)}</b>
            <span>готово к списанию</span>
          </p>
          <p data-part="tile">
            <b>{money(registryTotal)}</b>
            <span>всего в реестре</span>
          </p>
          <p data-part="tile">
            <b>
              {ready.length} из {orders.length}
            </b>
            <span>подписаны полностью</span>
          </p>
        </div>

        <div data-part="scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Получатель</th>
                <th scope="col">ИНН / счёт</th>
                <th scope="col">Очередь</th>
                <th scope="col">Подписи</th>
                <th scope="col" data-align="end">
                  Сумма
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const status = statusOf(
                  order.signedBy.length,
                  requiredSignatures,
                )
                const statusKey = status.key === "none" ? "waiting" : status.key
                return (
                  <tr
                    key={`${order.recipient}-${order.account}`}
                    data-status={statusKey}
                  >
                    <td>{order.recipient}</td>
                    <td data-part="requisites">
                      {order.inn} / {order.account.slice(-4)}
                    </td>
                    <td>
                      <span data-part="priority" data-priority={order.priority}>
                        {order.priority}
                      </span>
                    </td>
                    <td>
                      <span data-part="signoff">
                        <span
                          data-part="dots"
                          role="img"
                          aria-label={`${order.signedBy.length} из ${requiredSignatures} подписей`}
                        >
                          {Array.from(
                            { length: requiredSignatures },
                            (_, index) => (
                              <span
                                data-part="dot"
                                data-dot={
                                  index < order.signedBy.length
                                    ? "signed"
                                    : "empty"
                                }
                                key={index}
                                aria-hidden="true"
                              >
                                {index < order.signedBy.length ? "✓" : ""}
                              </span>
                            ),
                          )}
                        </span>
                        <span data-part="status">{status.label}</span>
                      </span>
                    </td>
                    <td data-part="amount">{money(order.amount)}</td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4}>Итого к списанию</td>
                <td data-part="amount">{money(readyTotal)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <p data-part="foot">{foot}</p>
      </section>
    </>
  )
}

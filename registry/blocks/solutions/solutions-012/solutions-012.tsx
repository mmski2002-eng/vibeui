import type { CSSProperties } from "react"

export type Solutions012Invoice = {
  number: string
  client: string
  amount: string
  issued: string
  due: string
  status: "paid" | "sent" | "draft" | "overdue"
  overdueDays?: number
}

export type Solutions012Props = {
  title?: string
  hint?: string
  overdueSum?: string
  waitingSum?: string
  paidSum?: string
  invoices?: Solutions012Invoice[]
  cta?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: реестр счетов. Три суммы сверху отвечают на единственный вопрос
// бухгалтера — сколько зависло, сколько ждём, сколько пришло; список без них
// заставляет складывать в уме. Статус несёт букву и рамку, а не только заливку:
// «оплачен» и «отправлен» одинаково зелёные при дальтонизме. Просроченная
// строка помечена левой полосой и числом дней просрочки прямо у срока —
// «до 2 марта» само по себе не говорит, что срок прошёл.
const STYLES = `
:where([data-vibeui-block="solutions-012"]){
--vibeui-solutions-012-bg:oklch(1 0 0);
--vibeui-solutions-012-panel:oklch(0.978 0.003 250);
--vibeui-solutions-012-fg:oklch(0.21 0.014 265);
--vibeui-solutions-012-muted:oklch(0.55 0.014 265);
--vibeui-solutions-012-border:oklch(0.9 0.006 265);
--vibeui-solutions-012-accent:oklch(0.5 0.17 265);
--vibeui-solutions-012-paid:oklch(0.55 0.14 152);
--vibeui-solutions-012-late:oklch(0.57 0.19 25);
--vibeui-solutions-012-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-012-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-012"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-012-bg);
border:1px solid var(--vibeui-solutions-012-border);border-radius:1rem;
font-family:var(--vibeui-solutions-012-sans);color:var(--vibeui-solutions-012-fg);
}
[data-vibeui-block="solutions-012"] *{box-sizing:border-box}
[data-vibeui-block="solutions-012"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-012"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-012"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-012-muted)}
[data-vibeui-block="solutions-012"] [data-part="cta"]{
appearance:none;cursor:pointer;height:2.125rem;padding:0 0.875rem;border:0;border-radius:0.625rem;
background:var(--vibeui-solutions-012-accent);color:oklch(1 0 0);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="solutions-012"] [data-part="cta"]:focus-visible{outline:2px solid var(--vibeui-solutions-012-accent);outline-offset:2px}
/* Три суммы сверху: иначе итоги по статусам считают в уме по списку. */
[data-vibeui-block="solutions-012"] [data-part="summary"]{
display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
[data-vibeui-block="solutions-012"] [data-part="tile"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-solutions-012-panel);
border:1px solid var(--vibeui-solutions-012-border);
}
[data-vibeui-block="solutions-012"] [data-tile="late"]{
border-color:color-mix(in oklab,var(--vibeui-solutions-012-late) 45%,transparent);
background:color-mix(in oklab,var(--vibeui-solutions-012-late) 8%,var(--vibeui-solutions-012-bg));
}
[data-vibeui-block="solutions-012"] [data-part="tile"] b{
display:block;font-size:1rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.015em;
}
[data-vibeui-block="solutions-012"] [data-tile="late"] b{color:var(--vibeui-solutions-012-late)}
[data-vibeui-block="solutions-012"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-012-muted);
}
[data-vibeui-block="solutions-012"] [data-part="scroll"]{overflow-x:auto;scrollbar-width:thin}
[data-vibeui-block="solutions-012"] table{width:100%;min-width:36rem;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="solutions-012"] th,
[data-vibeui-block="solutions-012"] td{
padding:0.5rem 0.625rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-solutions-012-border);
}
[data-vibeui-block="solutions-012"] th:first-child,
[data-vibeui-block="solutions-012"] td:first-child{padding-left:1rem}
[data-vibeui-block="solutions-012"] th:last-child,
[data-vibeui-block="solutions-012"] td:last-child{padding-right:1rem}
[data-vibeui-block="solutions-012"] th{
font-size:0.625rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-012-muted);background:var(--vibeui-solutions-012-panel);
}
[data-vibeui-block="solutions-012"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="solutions-012"] [data-part="number"]{
font-family:var(--vibeui-solutions-012-mono);font-size:0.75rem;
}
/* Просрочка помечена полосой и числом дней: «до 2 марта» не говорит о срыве. */
[data-vibeui-block="solutions-012"] [data-status="overdue"] td:first-child{
box-shadow:inset 3px 0 0 0 var(--vibeui-solutions-012-late);
}
[data-vibeui-block="solutions-012"] [data-part="late"]{
display:block;font-size:0.6875rem;font-weight:650;color:var(--vibeui-solutions-012-late);
}
[data-vibeui-block="solutions-012"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.125rem 0.5rem 0.125rem 0.25rem;border-radius:9999px;
border:1px solid var(--vibeui-solutions-012-border);
font-size:0.6875rem;font-weight:650;color:var(--vibeui-solutions-012-muted);
}
[data-vibeui-block="solutions-012"] [data-part="letter"]{
width:1rem;height:1rem;border-radius:9999px;display:grid;place-items:center;
background:var(--vibeui-solutions-012-panel);font-size:0.5625rem;font-weight:700;line-height:1;
}
[data-vibeui-block="solutions-012"] [data-status="paid"] [data-part="status"]{
color:var(--vibeui-solutions-012-paid);
border-color:color-mix(in oklab,var(--vibeui-solutions-012-paid) 50%,transparent);
}
[data-vibeui-block="solutions-012"] [data-status="paid"] [data-part="letter"]{
background:var(--vibeui-solutions-012-paid);color:oklch(1 0 0);
}
[data-vibeui-block="solutions-012"] [data-status="overdue"] [data-part="status"]{
color:var(--vibeui-solutions-012-late);
border-color:color-mix(in oklab,var(--vibeui-solutions-012-late) 50%,transparent);
}
[data-vibeui-block="solutions-012"] [data-status="overdue"] [data-part="letter"]{
background:var(--vibeui-solutions-012-late);color:oklch(1 0 0);
}
[data-vibeui-block="solutions-012"] [data-status="sent"] [data-part="status"]{color:var(--vibeui-solutions-012-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_INVOICES: Solutions012Invoice[] = [
  {
    number: "СЧ-2024-0141",
    client: "Логистика «Верста»",
    amount: "780 000 ₽",
    issued: "12 фев",
    due: "26 фев",
    status: "overdue",
    overdueDays: 16,
  },
  {
    number: "СЧ-2024-0148",
    client: "Кофейня «Мера»",
    amount: "14 400 ₽",
    issued: "1 мар",
    due: "15 мар",
    status: "sent",
  },
  {
    number: "СЧ-2024-0150",
    client: "Клиника «Исток»",
    amount: "540 000 ₽",
    issued: "3 мар",
    due: "17 мар",
    status: "sent",
  },
  {
    number: "СЧ-2024-0139",
    client: "Ателье «Нить»",
    amount: "96 000 ₽",
    issued: "5 фев",
    due: "19 фев",
    status: "paid",
  },
  {
    number: "СЧ-2024-0152",
    client: "Стройдвор",
    amount: "180 000 ₽",
    issued: "—",
    due: "—",
    status: "draft",
  },
]

const STATUS = {
  paid: { letter: "О", label: "оплачен" },
  sent: { letter: "В", label: "выставлен" },
  draft: { letter: "Ч", label: "черновик" },
  overdue: { letter: "!", label: "просрочен" },
} as const

/**
 * Реестр счетов: итоги по статусам сверху, просрочка помечена полосой и днями.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions012({
  title = "Счета на оплату",
  hint = "Март, все клиенты",
  overdueSum = "780 000 ₽",
  waitingSum = "554 400 ₽",
  paidSum = "96 000 ₽",
  invoices = DEFAULT_INVOICES,
  cta = "Выставить счёт",
  accent,
  className,
  style,
}: Solutions012Props) {
  const palette = {
    ...(accent ? { "--vibeui-solutions-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-012" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-012"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="hint">{hint}</p>
          </div>
          <button type="button" data-part="cta">
            {cta}
          </button>
        </header>

        <div data-part="summary">
          <p data-part="tile" data-tile="late">
            <b>{overdueSum}</b>
            <span>просрочено</span>
          </p>
          <p data-part="tile">
            <b>{waitingSum}</b>
            <span>ждём оплату</span>
          </p>
          <p data-part="tile">
            <b>{paidSum}</b>
            <span>оплачено в марте</span>
          </p>
        </div>

        <div data-part="scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Счёт</th>
                <th scope="col">Клиент</th>
                <th scope="col">Выставлен</th>
                <th scope="col">Оплатить до</th>
                <th scope="col" data-align="end">
                  Сумма
                </th>
                <th scope="col">Статус</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.number} data-status={invoice.status}>
                  <td>
                    <span data-part="number">{invoice.number}</span>
                  </td>
                  <td>{invoice.client}</td>
                  <td>{invoice.issued}</td>
                  <td>
                    {invoice.due}
                    {invoice.overdueDays ? (
                      <span data-part="late">
                        просрочка {invoice.overdueDays} дн.
                      </span>
                    ) : null}
                  </td>
                  <td data-align="end">{invoice.amount}</td>
                  <td>
                    <span data-part="status">
                      <span data-part="letter" aria-hidden="true">
                        {STATUS[invoice.status].letter}
                      </span>
                      {STATUS[invoice.status].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

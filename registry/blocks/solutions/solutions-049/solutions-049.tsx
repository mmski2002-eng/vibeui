import type { CSSProperties } from "react"

export type Solutions049Shift = {
  cashier: string
  register: string
  opened: string
  closed: string | null
  openingFloat: number
  cashSales: number
  cardSales: number
  receipts: number
  returns: number
  countedCash: number | null
}

export type Solutions049Props = {
  title?: string
  date?: string
  shifts?: Solutions049Shift[]
  currency?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: кассовые смены. Расхождение по кассе не приходит меткой —
// считается как «посчитано минус ожидаемо», где ожидаемо — это разменный
// фонд плюс наличная выручка минус возвраты. Открытая смена не притворяется
// закрытой с нулевым расхождением: у неё нет фактической суммы, поэтому
// статус — «смена открыта», а не «сходится». Средний чек на смену и по итогу
// считается из выручки и числа чеков, а не задаётся отдельно.
const STYLES = `
:where([data-vibeui-block="solutions-049"]){
--vibeui-solutions-049-bg:oklch(1 0 0);
--vibeui-solutions-049-panel:oklch(0.977 0.004 250);
--vibeui-solutions-049-fg:oklch(0.21 0.014 265);
--vibeui-solutions-049-muted:oklch(0.55 0.014 265);
--vibeui-solutions-049-border:oklch(0.9 0.006 265);
--vibeui-solutions-049-accent:oklch(0.5 0.17 265);
--vibeui-solutions-049-over:oklch(0.6 0.15 152);
--vibeui-solutions-049-short:oklch(0.58 0.2 25);
--vibeui-solutions-049-open:oklch(0.6 0.13 255);
--vibeui-solutions-049-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-049-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-049"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-049-bg);
border:1px solid var(--vibeui-solutions-049-border);border-radius:1rem;
font-family:var(--vibeui-solutions-049-sans);color:var(--vibeui-solutions-049-fg);
}
[data-vibeui-block="solutions-049"] *{box-sizing:border-box}
[data-vibeui-block="solutions-049"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-049"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-049"] [data-part="sub"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-049-muted)}
[data-vibeui-block="solutions-049"] [data-part="summary"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
@container (min-width:30rem){
[data-vibeui-block="solutions-049"] [data-part="summary"]{grid-template-columns:repeat(4,minmax(0,1fr))}
}
[data-vibeui-block="solutions-049"] [data-part="tile"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-solutions-049-panel);
border:1px solid var(--vibeui-solutions-049-border);
}
[data-vibeui-block="solutions-049"] [data-part="tile"] b{
display:block;font-size:1rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.015em;
}
[data-vibeui-block="solutions-049"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-049-muted);
}
[data-vibeui-block="solutions-049"] [data-tile="gap"][data-favor="over"] b{color:var(--vibeui-solutions-049-over)}
[data-vibeui-block="solutions-049"] [data-tile="gap"][data-favor="short"] b{color:var(--vibeui-solutions-049-short)}
[data-vibeui-block="solutions-049"] [data-part="scroll"]{overflow-x:auto;scrollbar-width:thin}
[data-vibeui-block="solutions-049"] table{width:100%;min-width:44rem;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="solutions-049"] th,
[data-vibeui-block="solutions-049"] td{
padding:0.5rem 0.625rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-solutions-049-border);
}
[data-vibeui-block="solutions-049"] th:first-child,
[data-vibeui-block="solutions-049"] td:first-child{padding-left:1rem}
[data-vibeui-block="solutions-049"] th:last-child,
[data-vibeui-block="solutions-049"] td:last-child{padding-right:1rem}
[data-vibeui-block="solutions-049"] th{
font-size:0.625rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-049-muted);background:var(--vibeui-solutions-049-panel);
}
[data-vibeui-block="solutions-049"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="solutions-049"] [data-part="cashier"]{display:block;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="solutions-049"] [data-part="register"]{display:block;font-size:0.6875rem;color:var(--vibeui-solutions-049-muted)}
[data-vibeui-block="solutions-049"] [data-status="short"] td:first-child{
box-shadow:inset 3px 0 0 0 var(--vibeui-solutions-049-short);
}
[data-vibeui-block="solutions-049"] [data-part="gap"]{
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.125rem 0.5rem 0.125rem 0.25rem;border-radius:9999px;
border:1px solid var(--vibeui-solutions-049-border);
font-size:0.6875rem;font-weight:650;color:var(--vibeui-solutions-049-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-049"] [data-part="letter"]{
width:1rem;height:1rem;border-radius:9999px;display:grid;place-items:center;flex:none;
background:var(--vibeui-solutions-049-panel);font-size:0.5625rem;font-weight:700;line-height:1;color:oklch(1 0 0);
}
[data-vibeui-block="solutions-049"] [data-status="match"] [data-part="gap"]{color:var(--vibeui-solutions-049-muted)}
[data-vibeui-block="solutions-049"] [data-status="match"] [data-part="letter"]{background:var(--vibeui-solutions-049-muted)}
[data-vibeui-block="solutions-049"] [data-status="over"] [data-part="gap"]{
color:var(--vibeui-solutions-049-over);
border-color:color-mix(in oklab,var(--vibeui-solutions-049-over) 50%,transparent);
}
[data-vibeui-block="solutions-049"] [data-status="over"] [data-part="letter"]{background:var(--vibeui-solutions-049-over)}
[data-vibeui-block="solutions-049"] [data-status="short"] [data-part="gap"]{
color:var(--vibeui-solutions-049-short);
border-color:color-mix(in oklab,var(--vibeui-solutions-049-short) 50%,transparent);
}
[data-vibeui-block="solutions-049"] [data-status="short"] [data-part="letter"]{background:var(--vibeui-solutions-049-short)}
[data-vibeui-block="solutions-049"] [data-status="open"] [data-part="gap"]{
color:var(--vibeui-solutions-049-open);
border-color:color-mix(in oklab,var(--vibeui-solutions-049-open) 50%,transparent);
border-style:dashed;
}
[data-vibeui-block="solutions-049"] [data-status="open"] [data-part="letter"]{background:var(--vibeui-solutions-049-open)}
[data-vibeui-block="solutions-049"] [data-part="foot"]{
margin:0;padding:0.75rem 1rem 1rem;font-size:0.75rem;color:var(--vibeui-solutions-049-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-049"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SHIFTS: Solutions049Shift[] = [
  {
    cashier: "Ирина Волкова",
    register: "касса №1",
    opened: "08:00",
    closed: "16:00",
    openingFloat: 5000,
    cashSales: 84300,
    cardSales: 156200,
    receipts: 142,
    returns: 3200,
    countedCash: 85900,
  },
  {
    cashier: "Павел Уваров",
    register: "касса №2",
    opened: "08:00",
    closed: "16:00",
    openingFloat: 5000,
    cashSales: 62100,
    cardSales: 98700,
    receipts: 96,
    returns: 0,
    countedCash: 67100,
  },
  {
    cashier: "Динара Ахметова",
    register: "касса №1",
    opened: "16:00",
    closed: "23:30",
    openingFloat: 5000,
    cashSales: 51800,
    cardSales: 143900,
    receipts: 118,
    returns: 4100,
    countedCash: 53400,
  },
  {
    cashier: "Павел Уваров",
    register: "касса №2",
    opened: "16:00",
    closed: "23:30",
    openingFloat: 5000,
    cashSales: 39200,
    cardSales: 88100,
    receipts: 79,
    returns: 1600,
    countedCash: 42600,
  },
  {
    cashier: "Роман Белых",
    register: "касса №3 (самовывоз)",
    opened: "08:00",
    closed: null,
    openingFloat: 3000,
    cashSales: 21400,
    cardSales: 46700,
    receipts: 58,
    returns: 900,
    countedCash: null,
  },
]

function money(value: number, currency: string) {
  const sign = value < 0 ? "−" : value > 0 ? "+" : ""
  return `${sign}${Math.abs(Math.round(value)).toLocaleString("ru-RU")} ${currency}`
}

function gapStatus(
  shift: Solutions049Shift,
): "open" | "match" | "over" | "short" {
  if (shift.closed === null || shift.countedCash === null) return "open"
  const expected = shift.openingFloat + shift.cashSales - shift.returns
  const gap = shift.countedCash - expected
  if (gap === 0) return "match"
  return gap > 0 ? "over" : "short"
}

const GAP_LABEL = {
  open: { letter: "…", label: "смена открыта" },
  match: { letter: "=", label: "сходится" },
  over: { letter: "+", label: "излишек" },
  short: { letter: "−", label: "недостача" },
} as const

/**
 * Кассовые смены: расхождение по кассе считается как «посчитано минус
 * ожидаемо», открытая смена не притворяется закрытой с нулевым расхождением.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions049({
  title = "Кассовые смены",
  date = "Четверг, 14 марта 2024",
  shifts = DEFAULT_SHIFTS,
  currency = "₽",
  accent,
  className,
  style,
}: Solutions049Props) {
  const revenue = shifts.reduce(
    (sum, shift) => sum + shift.cashSales + shift.cardSales,
    0,
  )
  const totalReceipts = shifts.reduce((sum, shift) => sum + shift.receipts, 0)
  const avgCheck = totalReceipts > 0 ? revenue / totalReceipts : 0

  const closedGaps = shifts
    .filter((shift) => shift.closed !== null && shift.countedCash !== null)
    .map(
      (shift) =>
        (shift.countedCash as number) -
        (shift.openingFloat + shift.cashSales - shift.returns),
    )
  const totalGap = closedGaps.reduce((sum, gap) => sum + gap, 0)
  const gapFavor = totalGap > 0 ? "over" : totalGap < 0 ? "short" : "match"

  const palette = {
    ...(accent ? { "--vibeui-solutions-049-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-049" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-049"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="sub">{date}</p>
          </div>
          <p data-part="sub">
            {shifts.filter((shift) => shift.closed === null).length} смена ещё
            открыта
          </p>
        </header>

        <div data-part="summary">
          <p data-part="tile">
            <b>{money(revenue, currency)}</b>
            <span>выручка за день</span>
          </p>
          <p data-part="tile">
            <b>{totalReceipts}</b>
            <span>чеков пробито</span>
          </p>
          <p data-part="tile">
            <b>{money(avgCheck, currency)}</b>
            <span>средний чек</span>
          </p>
          <p data-part="tile" data-tile="gap" data-favor={gapFavor}>
            <b>{money(totalGap, currency)}</b>
            <span>расхождение по закрытым сменам</span>
          </p>
        </div>

        <div data-part="scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Смена</th>
                <th scope="col">Время</th>
                <th scope="col" data-align="end">
                  Наличные
                </th>
                <th scope="col" data-align="end">
                  Карта
                </th>
                <th scope="col" data-align="end">
                  Чеков
                </th>
                <th scope="col" data-align="end">
                  Ср. чек
                </th>
                <th scope="col" data-align="end">
                  Возвраты
                </th>
                <th scope="col">Расхождение</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift) => {
                const status = gapStatus(shift)
                const expected =
                  shift.openingFloat + shift.cashSales - shift.returns
                const gap =
                  shift.countedCash !== null ? shift.countedCash - expected : 0
                const shiftAvg =
                  shift.receipts > 0
                    ? (shift.cashSales + shift.cardSales) / shift.receipts
                    : 0
                return (
                  <tr
                    key={`${shift.cashier}-${shift.opened}`}
                    data-status={status}
                  >
                    <td>
                      <span data-part="cashier">{shift.cashier}</span>
                      <span data-part="register">{shift.register}</span>
                    </td>
                    <td>
                      {shift.opened}–{shift.closed ?? "…"}
                    </td>
                    <td data-align="end">{money(shift.cashSales, currency)}</td>
                    <td data-align="end">{money(shift.cardSales, currency)}</td>
                    <td data-align="end">{shift.receipts}</td>
                    <td data-align="end">{money(shiftAvg, currency)}</td>
                    <td data-align="end">{money(shift.returns, currency)}</td>
                    <td>
                      <span data-part="gap">
                        <span data-part="letter" aria-hidden="true">
                          {GAP_LABEL[status].letter}
                        </span>
                        {status === "open"
                          ? GAP_LABEL[status].label
                          : `${GAP_LABEL[status].label}${gap !== 0 ? ` ${money(gap, currency)}` : ""}`}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <p data-part="foot">
          Ожидаемая наличность считается как разменный фонд плюс наличная
          выручка минус возвраты; расхождение — разница с фактическим
          пересчётом.
        </p>
      </section>
    </>
  )
}

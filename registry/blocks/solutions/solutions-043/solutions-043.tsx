import type { CSSProperties } from "react"

export type Solutions043Operation = {
  date: string
  counterparty: string
  purpose: string
  amount: number
  direction: "in" | "out"
  posted: boolean
}

export type Solutions043Props = {
  title?: string
  account?: string
  period?: string
  openingBalance?: number
  operations?: Solutions043Operation[]
  foot?: string
  /** Подпись счёта. {account} — номер счёта. */
  accountLabel?: string
  /** Подписи плиток: opening, closing, pending. */
  balanceText?: Record<string, string>
  /** Подписи оборотов: in, out. */
  turnoverText?: Record<string, string>
  /** Заголовки колонок: date, counterparty, purpose, in, out. */
  columnText?: Record<string, string>
  /** Пометка непроведённой операции. */
  pendingText?: string
  currency?: string
  /** Локаль форматирования чисел. */
  locale?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: выписка по счёту. Приход и расход — два разных столбца таблицы,
// а не один столбец со знаком: так глаз читает движение денег не вчитываясь
// в минус. Исходящий остаток не приходит пропом отдельно — он посчитан из
// входящего остатка и оборотов по ПРОВЕДЁННЫМ операциям тут же в компоненте,
// иначе цифры разъедутся при любой правке списка. Непроведённые операции не
// входят в остаток и помечены словом и пунктирной рамкой, а не только цветом.
const STYLES = `
:where([data-vibeui-block="solutions-043"]){
--vibeui-solutions-043-bg:transparent;
--vibeui-solutions-043-panel:light-dark(oklch(0.977 0.004 250),oklch(0.27 0.011 265));
--vibeui-solutions-043-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-solutions-043-muted:light-dark(oklch(0.55 0.014 265),oklch(0.69 0.012 265));
--vibeui-solutions-043-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-solutions-043-accent:light-dark(oklch(0.5 0.16 265),oklch(0.72 0.14 265));
--vibeui-solutions-043-in:light-dark(oklch(0.55 0.14 152),oklch(0.71 0.14 152));
--vibeui-solutions-043-out:light-dark(oklch(0.56 0.17 25),oklch(0.71 0.16 25));
--vibeui-solutions-043-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-043-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-043"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-043-bg);
border:1px solid var(--vibeui-solutions-043-border);border-radius:1rem;
font-family:var(--vibeui-solutions-043-sans);color:var(--vibeui-solutions-043-fg);
}
[data-vibeui-block="solutions-043"] *{box-sizing:border-box}
[data-vibeui-block="solutions-043"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-043"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-043"] [data-part="account"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-043-muted);font-family:var(--vibeui-solutions-043-mono)}
[data-vibeui-block="solutions-043"] [data-part="period"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-043-muted)}
[data-vibeui-block="solutions-043"] [data-part="balances"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
[data-vibeui-block="solutions-043"] [data-part="tile"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-solutions-043-panel);border:1px solid var(--vibeui-solutions-043-border);
}
[data-vibeui-block="solutions-043"] [data-part="tile"] b{
display:block;font-size:1.125rem;font-weight:700;letter-spacing:-0.015em;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-043"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-043-muted);
}
[data-vibeui-block="solutions-043"] [data-part="turnover"]{
display:flex;gap:1rem;padding:0 1rem 0.75rem;font-size:0.75rem;color:var(--vibeui-solutions-043-muted);
}
[data-vibeui-block="solutions-043"] [data-part="turnover"] b{font-variant-numeric:tabular-nums;font-weight:650}
[data-vibeui-block="solutions-043"] [data-flow="in"] b{color:var(--vibeui-solutions-043-in)}
[data-vibeui-block="solutions-043"] [data-flow="out"] b{color:var(--vibeui-solutions-043-out)}
[data-vibeui-block="solutions-043"] [data-part="scroll"]{overflow-x:auto;scrollbar-width:thin}
[data-vibeui-block="solutions-043"] table{width:100%;min-width:40rem;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="solutions-043"] th,
[data-vibeui-block="solutions-043"] td{
padding:0.5rem 0.625rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-solutions-043-border);
}
[data-vibeui-block="solutions-043"] th:first-child,
[data-vibeui-block="solutions-043"] td:first-child{padding-left:1rem}
[data-vibeui-block="solutions-043"] th:last-child,
[data-vibeui-block="solutions-043"] td:last-child{padding-right:1rem}
[data-vibeui-block="solutions-043"] th{
font-size:0.625rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-043-muted);background:var(--vibeui-solutions-043-panel);
}
[data-vibeui-block="solutions-043"] [data-part="purpose"]{
white-space:normal;color:var(--vibeui-solutions-043-muted);font-size:0.75rem;max-width:16rem;
}
[data-vibeui-block="solutions-043"] [data-part="in"],
[data-vibeui-block="solutions-043"] [data-part="out"]{
text-align:right;font-variant-numeric:tabular-nums;font-weight:650;
}
[data-vibeui-block="solutions-043"] [data-part="in"]{color:var(--vibeui-solutions-043-in)}
[data-vibeui-block="solutions-043"] [data-part="out"]{color:var(--vibeui-solutions-043-out)}
[data-vibeui-block="solutions-043"] [data-part="dash"]{color:var(--vibeui-solutions-043-muted);font-weight:400}
/* Непроведённая операция: пунктир и слово, не только цвет. */
[data-vibeui-block="solutions-043"] [data-posted="false"] td{
border-style:dashed;color:var(--vibeui-solutions-043-muted);
}
[data-vibeui-block="solutions-043"] [data-part="pending"]{
display:block;font-size:0.625rem;font-style:italic;color:var(--vibeui-solutions-043-muted);
}
[data-vibeui-block="solutions-043"] [data-part="foot"]{
margin:0;padding:0.75rem 1rem 1rem;font-size:0.75rem;color:var(--vibeui-solutions-043-muted);
}
@container (min-width: 30rem){
[data-vibeui-block="solutions-043"] [data-part="balances"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-043"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPERATIONS: Solutions043Operation[] = [
  {
    date: "3 мар",
    counterparty: "ООО «Верста Логистик»",
    purpose: "Оплата по договору №118 за март",
    amount: 640000,
    direction: "in",
    posted: true,
  },
  {
    date: "4 мар",
    counterparty: "ФНС России",
    purpose: "Уплата страховых взносов за февраль",
    amount: 214300,
    direction: "out",
    posted: true,
  },
  {
    date: "5 мар",
    counterparty: "ООО «Стройдвор»",
    purpose: "Аванс по счёту СЧ-2024-0152",
    amount: 180000,
    direction: "out",
    posted: true,
  },
  {
    date: "6 мар",
    counterparty: "ИП Гаврилова А. С.",
    purpose: "Возврат излишне уплаченного",
    amount: 12400,
    direction: "in",
    posted: false,
  },
  {
    date: "7 мар",
    counterparty: "Кофейня «Мера»",
    purpose: "Оплата по счёту СЧ-2024-0148",
    amount: 14400,
    direction: "in",
    posted: true,
  },
  {
    date: "7 мар",
    counterparty: "ООО «Нить»",
    purpose: "Оплата аренды за март",
    amount: 96000,
    direction: "out",
    posted: false,
  },
]

const BALANCE_LABEL: Record<string, string> = {
  opening: "входящий остаток",
  closing: "исходящий остаток",
  pending: "непроведённых операций",
}

const TURNOVER_LABEL: Record<string, string> = {
  in: "Приход:",
  out: "Расход:",
}

const COLUMN_LABEL: Record<string, string> = {
  date: "Дата",
  counterparty: "Контрагент",
  purpose: "Назначение платежа",
  in: "Приход",
  out: "Расход",
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
 * Банковская выписка: приход и расход — раздельные столбцы, исходящий
 * остаток посчитан из входящего и оборотов по проведённым операциям.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions043({
  title = "Выписка по счёту",
  account = "40702810900000012345",
  period = "1–7 марта 2024",
  openingBalance = 1284600,
  operations = DEFAULT_OPERATIONS,
  foot = "Непроведённые операции показаны пунктиром и не входят в исходящий остаток.",
  accountLabel = "Счёт {account}",
  balanceText = BALANCE_LABEL,
  turnoverText = TURNOVER_LABEL,
  columnText = COLUMN_LABEL,
  pendingText = "не проведено",
  currency = "₽",
  locale = "ru-RU",
  accent,
  background = "",
  className,
  style,
}: Solutions043Props) {
  const money = (amount: number) =>
    `${amount.toLocaleString(locale)} ${currency}`
  const balance = (key: string) => balanceText[key] ?? BALANCE_LABEL[key]
  const turnover = (key: string) => turnoverText[key] ?? TURNOVER_LABEL[key]
  const column = (key: string) => columnText[key] ?? COLUMN_LABEL[key]
  const posted = operations.filter((operation) => operation.posted)
  const totalIn = posted
    .filter((operation) => operation.direction === "in")
    .reduce((sum, operation) => sum + operation.amount, 0)
  const totalOut = posted
    .filter((operation) => operation.direction === "out")
    .reduce((sum, operation) => sum + operation.amount, 0)
  const closingBalance = openingBalance + totalIn - totalOut
  const pendingCount = operations.length - posted.length

  const palette = {
    ...(accent ? { "--vibeui-solutions-043-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-043-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-043" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-043"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="account">
              {accountLabel.replace("{account}", account)}
            </p>
          </div>
          <p data-part="period">{period}</p>
        </header>

        <div data-part="balances">
          <p data-part="tile">
            <b>{money(openingBalance)}</b>
            <span>{balance("opening")}</span>
          </p>
          <p data-part="tile">
            <b>{money(closingBalance)}</b>
            <span>{balance("closing")}</span>
          </p>
          <p data-part="tile">
            <b>{pendingCount}</b>
            <span>{balance("pending")}</span>
          </p>
        </div>

        <p data-part="turnover">
          <span data-flow="in">
            {turnover("in")} <b>{money(totalIn)}</b>
          </span>
          <span data-flow="out">
            {turnover("out")} <b>{money(totalOut)}</b>
          </span>
        </p>

        <div data-part="scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">{column("date")}</th>
                <th scope="col">{column("counterparty")}</th>
                <th scope="col">{column("purpose")}</th>
                <th scope="col">{column("in")}</th>
                <th scope="col">{column("out")}</th>
              </tr>
            </thead>
            <tbody>
              {operations.map((operation) => (
                <tr
                  key={`${operation.date}-${operation.counterparty}-${operation.amount}`}
                  data-posted={operation.posted ? "true" : "false"}
                >
                  <td>{operation.date}</td>
                  <td>
                    {operation.counterparty}
                    {!operation.posted ? (
                      <span data-part="pending">{pendingText}</span>
                    ) : null}
                  </td>
                  <td data-part="purpose">{operation.purpose}</td>
                  <td data-part="in">
                    {operation.direction === "in" ? (
                      money(operation.amount)
                    ) : (
                      <span data-part="dash">—</span>
                    )}
                  </td>
                  <td data-part="out">
                    {operation.direction === "out" ? (
                      money(operation.amount)
                    ) : (
                      <span data-part="dash">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p data-part="foot">{foot}</p>
      </section>
    </>
  )
}

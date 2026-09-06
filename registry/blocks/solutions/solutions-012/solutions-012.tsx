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
  /** Подписи плиток итогов: ключи overdue, waiting, paid. */
  summaryText?: Record<string, string>
  /** Шапка таблицы: ключи number, client, issued, due, amount, status. */
  columnText?: Record<string, string>
  /** Пометка просрочки, {days} — число дней. */
  overdueText?: string
  /** Названия статусов: ключи paid, sent, draft, overdue. */
  statusText?: Record<string, string>
  /** Буквы статусов на кружке: те же ключи. */
  statusLetterText?: Record<string, string>
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
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
--vibeui-solutions-012-bg:transparent;
--vibeui-solutions-012-panel:light-dark(oklch(0.978 0 250),oklch(0.27 0 255));
--vibeui-solutions-012-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-solutions-012-muted:light-dark(oklch(0.55 0 265),oklch(0.7 0 265));
--vibeui-solutions-012-border:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-solutions-012-accent:light-dark(oklch(0.5 0.17 265),oklch(0.71 0.16 265));
--vibeui-solutions-012-paid:light-dark(oklch(0.55 0.14 152),oklch(0.74 0.14 152));
--vibeui-solutions-012-late:light-dark(oklch(0.57 0.19 25),oklch(0.72 0.16 25));
--vibeui-solutions-012-onaccent:light-dark(oklch(1 0 0),oklch(0.17 0 265));
--vibeui-solutions-012-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-012-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="solutions-012"]{color-scheme:dark}
[data-vibeui-block="solutions-012"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
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
background:var(--vibeui-solutions-012-accent);color:var(--vibeui-solutions-012-onaccent);
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
background:color-mix(in oklab,var(--vibeui-solutions-012-late) 10%,transparent);
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
background:var(--vibeui-solutions-012-paid);color:var(--vibeui-solutions-012-onaccent);
}
[data-vibeui-block="solutions-012"] [data-status="overdue"] [data-part="status"]{
color:var(--vibeui-solutions-012-late);
border-color:color-mix(in oklab,var(--vibeui-solutions-012-late) 50%,transparent);
}
[data-vibeui-block="solutions-012"] [data-status="overdue"] [data-part="letter"]{
background:var(--vibeui-solutions-012-late);color:var(--vibeui-solutions-012-onaccent);
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

const STATUS_LETTER: Record<string, string> = {
  paid: "О",
  sent: "В",
  draft: "Ч",
  overdue: "!",
}

const STATUS_LABEL: Record<string, string> = {
  paid: "оплачен",
  sent: "выставлен",
  draft: "черновик",
  overdue: "просрочен",
}

const DEFAULT_SUMMARY_TEXT: Record<string, string> = {
  overdue: "просрочено",
  waiting: "ждём оплату",
  paid: "оплачено в марте",
}

const DEFAULT_COLUMN_TEXT: Record<string, string> = {
  number: "Счёт",
  client: "Клиент",
  issued: "Выставлен",
  due: "Оплатить до",
  amount: "Сумма",
  status: "Статус",
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
  summaryText = DEFAULT_SUMMARY_TEXT,
  columnText = DEFAULT_COLUMN_TEXT,
  overdueText = "просрочка {days} дн.",
  statusText = STATUS_LABEL,
  statusLetterText = STATUS_LETTER,
  accent,
  background = "",
  className,
  style,
}: Solutions012Props) {
  const palette = {
    ...(accent ? { "--vibeui-solutions-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
            <span>{summaryText.overdue ?? DEFAULT_SUMMARY_TEXT.overdue}</span>
          </p>
          <p data-part="tile">
            <b>{waitingSum}</b>
            <span>{summaryText.waiting ?? DEFAULT_SUMMARY_TEXT.waiting}</span>
          </p>
          <p data-part="tile">
            <b>{paidSum}</b>
            <span>{summaryText.paid ?? DEFAULT_SUMMARY_TEXT.paid}</span>
          </p>
        </div>

        <div data-part="scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">
                  {columnText.number ?? DEFAULT_COLUMN_TEXT.number}
                </th>
                <th scope="col">
                  {columnText.client ?? DEFAULT_COLUMN_TEXT.client}
                </th>
                <th scope="col">
                  {columnText.issued ?? DEFAULT_COLUMN_TEXT.issued}
                </th>
                <th scope="col">{columnText.due ?? DEFAULT_COLUMN_TEXT.due}</th>
                <th scope="col" data-align="end">
                  {columnText.amount ?? DEFAULT_COLUMN_TEXT.amount}
                </th>
                <th scope="col">
                  {columnText.status ?? DEFAULT_COLUMN_TEXT.status}
                </th>
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
                        {overdueText.replace(
                          "{days}",
                          String(invoice.overdueDays),
                        )}
                      </span>
                    ) : null}
                  </td>
                  <td data-align="end">{invoice.amount}</td>
                  <td>
                    <span data-part="status">
                      <span data-part="letter" aria-hidden="true">
                        {statusLetterText[invoice.status] ??
                          STATUS_LETTER[invoice.status]}
                      </span>
                      {statusText[invoice.status] ??
                        STATUS_LABEL[invoice.status]}
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

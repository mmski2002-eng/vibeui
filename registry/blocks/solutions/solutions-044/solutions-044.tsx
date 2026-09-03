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
  /** Подписи плиток: ready, total, signed. */
  statsText?: Record<string, string>
  /** Плитка полностью подписанных. {ready} и {total} — числа поручений. */
  readyOfText?: string
  /** Заголовки колонок: recipient, requisites, priority, signatures, amount. */
  columnText?: Record<string, string>
  /** Статусы подписи: ready, waiting, none; {left} — сколько подписей ждём. */
  statusText?: Record<string, string>
  /** Скрытая подпись точек. {signed} и {required} — число подписей. */
  signaturesLabel?: string
  /** Подпись итоговой строки таблицы. */
  totalRowText?: string
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
// Идея блока: реестр платёжных поручений к отправке. Статус подписи не
// приходит готовой меткой — считается из длины списка подписавших против
// требуемых двух, и рисуется двумя точками: закрашена/пустая, а не одним
// словом цветом. Итог к списанию в шапке — сумма только полностью подписанных
// поручений, посчитанная в компоненте из тех же строк, что и таблица, а не
// отдельным пропом, который может разойтись со списком.
const STYLES = `
:where([data-vibeui-block="solutions-044"]){
--vibeui-solutions-044-bg:transparent;
--vibeui-solutions-044-panel:light-dark(oklch(0.977 0.004 250),oklch(0.27 0.011 265));
--vibeui-solutions-044-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-solutions-044-muted:light-dark(oklch(0.55 0.014 265),oklch(0.69 0.012 265));
--vibeui-solutions-044-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-solutions-044-accent:light-dark(oklch(0.5 0.16 265),oklch(0.72 0.14 265));
--vibeui-solutions-044-ready:light-dark(oklch(0.55 0.14 152),oklch(0.71 0.14 152));
--vibeui-solutions-044-wait:light-dark(oklch(0.65 0.15 75),oklch(0.78 0.14 75));
--vibeui-solutions-044-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-044-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="solutions-044"]{color-scheme:dark}
[data-vibeui-block="solutions-044"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
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

const STATS_LABEL: Record<string, string> = {
  ready: "готово к списанию",
  total: "всего в реестре",
  signed: "подписаны полностью",
}

const COLUMN_LABEL: Record<string, string> = {
  recipient: "Получатель",
  requisites: "ИНН / счёт",
  priority: "Очередь",
  signatures: "Подписи",
  amount: "Сумма",
}

const STATUS_LABEL: Record<string, string> = {
  ready: "готово к отправке",
  waiting: "ждёт {left}-ю подпись",
  none: "не подписано",
}

function statusKeyOf(signed: number, required: number) {
  if (signed >= required) return "ready" as const
  if (signed > 0) return "waiting" as const
  return "none" as const
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
  statsText = STATS_LABEL,
  readyOfText = "{ready} из {total}",
  columnText = COLUMN_LABEL,
  statusText = STATUS_LABEL,
  signaturesLabel = "{signed} из {required} подписей",
  totalRowText = "Итого к списанию",
  currency = "₽",
  locale = "ru-RU",
  accent,
  background = "",
  className,
  style,
}: Solutions044Props) {
  const money = (amount: number) =>
    `${amount.toLocaleString(locale)} ${currency}`
  const stat = (key: string) => statsText[key] ?? STATS_LABEL[key]
  const column = (key: string) => columnText[key] ?? COLUMN_LABEL[key]
  const ready = orders.filter(
    (order) => order.signedBy.length >= requiredSignatures,
  )
  const readyTotal = ready.reduce((sum, order) => sum + order.amount, 0)
  const registryTotal = orders.reduce((sum, order) => sum + order.amount, 0)

  const palette = {
    ...(accent ? { "--vibeui-solutions-044-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-044-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
            <span>{stat("ready")}</span>
          </p>
          <p data-part="tile">
            <b>{money(registryTotal)}</b>
            <span>{stat("total")}</span>
          </p>
          <p data-part="tile">
            <b>
              {readyOfText
                .replace("{ready}", String(ready.length))
                .replace("{total}", String(orders.length))}
            </b>
            <span>{stat("signed")}</span>
          </p>
        </div>

        <div data-part="scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">{column("recipient")}</th>
                <th scope="col">{column("requisites")}</th>
                <th scope="col">{column("priority")}</th>
                <th scope="col">{column("signatures")}</th>
                <th scope="col" data-align="end">
                  {column("amount")}
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const statusName = statusKeyOf(
                  order.signedBy.length,
                  requiredSignatures,
                )
                const statusLabel = (
                  statusText[statusName] ?? STATUS_LABEL[statusName]
                ).replace(
                  "{left}",
                  String(requiredSignatures - order.signedBy.length),
                )
                const statusKey = statusName === "none" ? "waiting" : statusName
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
                          aria-label={signaturesLabel
                            .replace("{signed}", String(order.signedBy.length))
                            .replace("{required}", String(requiredSignatures))}
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
                        <span data-part="status">{statusLabel}</span>
                      </span>
                    </td>
                    <td data-part="amount">{money(order.amount)}</td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4}>{totalRowText}</td>
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

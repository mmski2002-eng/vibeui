import type { CSSProperties } from "react"

export type Dashboard021Usage = {
  label: string
  used: number
  limit: number
  unit?: string
}

export type Dashboard021Invoice = {
  number: string
  date: string
  amount: string
  status: "paid" | "wait" | "failed"
}

export type Dashboard021Props = {
  title?: string
  plan?: string
  planPrice?: string
  renewsOn?: string
  card?: string
  usage?: Dashboard021Usage[]
  invoices?: Dashboard021Invoice[]
  upgradeLabel?: string
  cancelLabel?: string
  /** Подпись карточки плана для скринридера. */
  planSectionLabel?: string
  /** Шаблон расхода: {used}, {limit} и {unit}. */
  usageText?: string
  /** Приписка при перерасходе. */
  overText?: string
  invoicesTitle?: string
  /** Заголовки колонок таблицы счетов. */
  invoiceColumns?: string[]
  /** Состояния счёта: ключи paid, wait и failed. */
  statusText?: Record<string, string>
  accent?: string
  /** Подложка карточки; пусто — цвет из палитры блока. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: биллинг, который отвечает на три вопроса сразу — какой план,
// сколько израсходовано и что уже списали. Расход показан полосой и дробью
// «использовано из лимита»: одна полоса не говорит, сколько осталось в
// штуках, а одна дробь не даёт почувствовать близость потолка. Перерасходная
// строка меняет не только цвет, но и надпись, а история счетов — настоящая
// таблица, потому что колонки здесь сравнивают.
const STYLES = `
:where([data-vibeui-block="dashboard-021"]){
--vibeui-dashboard-021-bg:light-dark(oklch(1 0 0),oklch(0.23 0.013 265));
--vibeui-dashboard-021-panel:light-dark(oklch(0.985 0.003 265),oklch(0.27 0.013 265));
--vibeui-dashboard-021-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-dashboard-021-muted:light-dark(oklch(0.55 0.014 265),oklch(0.69 0.012 265));
--vibeui-dashboard-021-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-dashboard-021-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.15 262));
--vibeui-dashboard-021-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.02 265));
--vibeui-dashboard-021-ok:light-dark(oklch(0.53 0.14 152),oklch(0.76 0.13 152));
--vibeui-dashboard-021-warn:light-dark(oklch(0.65 0.15 60),oklch(0.79 0.13 60));
--vibeui-dashboard-021-risk:light-dark(oklch(0.55 0.18 25),oklch(0.74 0.15 25));
--vibeui-dashboard-021-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-021"]{
box-sizing:border-box;
background:var(--vibeui-dashboard-021-bg);
color:var(--vibeui-dashboard-021-fg);
font-family:var(--vibeui-dashboard-021-sans);
border:1px solid var(--vibeui-dashboard-021-border);border-radius:1rem;
}
[data-vibeui-block="dashboard-021"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-021"] [data-part="shell"]{display:grid;gap:1rem;padding:1.125rem}
[data-vibeui-block="dashboard-021"] h2{margin:0;font-size:1.0625rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-021"] [data-part="top"]{display:grid;grid-template-columns:1fr;gap:1rem}
[data-vibeui-block="dashboard-021"] [data-part="plan"]{
background:var(--vibeui-dashboard-021-panel);
border:1px solid var(--vibeui-dashboard-021-border);border-radius:0.875rem;
padding:0.875rem;
}
[data-vibeui-block="dashboard-021"] [data-part="planname"]{
display:flex;align-items:baseline;gap:0.5rem;margin:0;
font-size:1.25rem;font-weight:700;letter-spacing:-0.02em;
}
[data-vibeui-block="dashboard-021"] [data-part="price"]{
font-size:0.8125rem;font-weight:600;color:var(--vibeui-dashboard-021-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-021"] [data-part="renews"]{
margin:0.25rem 0 0.75rem;font-size:0.75rem;color:var(--vibeui-dashboard-021-muted);
}
[data-vibeui-block="dashboard-021"] [data-part="buttons"]{display:flex;flex-wrap:wrap;gap:0.5rem}
[data-vibeui-block="dashboard-021"] [data-part="primary"]{
appearance:none;border:0;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:650;
padding:0.5rem 0.875rem;border-radius:0.5rem;
background:var(--vibeui-dashboard-021-accent);color:var(--vibeui-dashboard-021-on-accent);
}
[data-vibeui-block="dashboard-021"] [data-part="ghost"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:650;
padding:0.5rem 0.875rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-021-border);
background:var(--vibeui-dashboard-021-bg);color:inherit;
}
[data-vibeui-block="dashboard-021"] [data-part="card"]{
margin:0.75rem 0 0;padding-top:0.625rem;
border-top:1px solid var(--vibeui-dashboard-021-border);
font-size:0.75rem;color:var(--vibeui-dashboard-021-muted);
}
[data-vibeui-block="dashboard-021"] ul{list-style:none;margin:0;padding:0}
[data-vibeui-block="dashboard-021"] [data-part="usage"]{display:grid;gap:0.75rem;align-content:start}
[data-vibeui-block="dashboard-021"] [data-part="line"]{
display:flex;align-items:baseline;gap:0.5rem;font-size:0.75rem;
}
[data-vibeui-block="dashboard-021"] [data-part="figure"]{
margin-left:auto;font-variant-numeric:tabular-nums;font-weight:650;
color:var(--vibeui-dashboard-021-muted);
}
[data-vibeui-block="dashboard-021"] [data-part="track"]{
margin-top:0.3125rem;height:0.4375rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-dashboard-021-panel);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-021-border);
}
[data-vibeui-block="dashboard-021"] [data-part="fill"]{
display:block;height:100%;border-radius:9999px;
width:var(--vibeui-dashboard-021-w);
background:var(--vibeui-dashboard-021-accent);
}
[data-vibeui-block="dashboard-021"] [data-level="warn"] [data-part="fill"]{background:var(--vibeui-dashboard-021-warn)}
[data-vibeui-block="dashboard-021"] [data-level="over"] [data-part="fill"]{background:var(--vibeui-dashboard-021-risk)}
[data-vibeui-block="dashboard-021"] [data-level="over"] [data-part="figure"]{color:var(--vibeui-dashboard-021-risk)}
[data-vibeui-block="dashboard-021"] [data-part="tablewrap"]{overflow-x:auto}
[data-vibeui-block="dashboard-021"] table{width:100%;border-collapse:collapse;font-size:0.75rem}
[data-vibeui-block="dashboard-021"] caption{
text-align:left;padding-bottom:0.5rem;font-size:0.8125rem;font-weight:700;
}
[data-vibeui-block="dashboard-021"] th{
text-align:left;padding:0.375rem 0.625rem 0.375rem 0;white-space:nowrap;
font-size:0.625rem;font-weight:650;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-dashboard-021-muted);
border-bottom:1px solid var(--vibeui-dashboard-021-border);
}
[data-vibeui-block="dashboard-021"] td{
padding:0.5rem 0.625rem 0.5rem 0;white-space:nowrap;
border-bottom:1px solid var(--vibeui-dashboard-021-border);
}
[data-vibeui-block="dashboard-021"] [data-part="sum"]{font-variant-numeric:tabular-nums;font-weight:650}
[data-vibeui-block="dashboard-021"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.375rem;font-weight:600;
}
[data-vibeui-block="dashboard-021"] [data-part="mark"]{
width:0.5rem;height:0.5rem;border-radius:9999px;
background:var(--vibeui-dashboard-021-ok);
}
[data-vibeui-block="dashboard-021"] [data-status="wait"] [data-part="mark"]{
background:none;box-shadow:inset 0 0 0 2px var(--vibeui-dashboard-021-warn);
}
[data-vibeui-block="dashboard-021"] [data-status="failed"] [data-part="mark"]{
background:var(--vibeui-dashboard-021-risk);border-radius:0.125rem;
}
[data-vibeui-block="dashboard-021"] [data-part="link"]{color:var(--vibeui-dashboard-021-accent);font-weight:650}
[data-vibeui-block="dashboard-021"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-021-accent);outline-offset:2px;
}
@container (min-width: 46rem){
[data-vibeui-block="dashboard-021"] [data-part="shell"]{padding:1.375rem}
[data-vibeui-block="dashboard-021"] [data-part="top"]{grid-template-columns:19rem 1fr}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-021"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_USAGE: Dashboard021Usage[] = [
  { label: "Участники", used: 7, limit: 10, unit: "мест" },
  { label: "Проекты", used: 12, limit: 15, unit: "шт." },
  { label: "Установки блоков", used: 4820, limit: 5000, unit: "в месяц" },
  { label: "Хранилище", used: 26, limit: 20, unit: "ГБ" },
]

const DEFAULT_INVOICES: Dashboard021Invoice[] = [
  { number: "№ 302", date: "1 марта", amount: "24 000 ₽", status: "wait" },
  { number: "№ 288", date: "1 февраля", amount: "24 000 ₽", status: "paid" },
  { number: "№ 271", date: "1 января", amount: "24 000 ₽", status: "paid" },
  { number: "№ 254", date: "1 декабря", amount: "18 000 ₽", status: "failed" },
]

const STATUS_WORD: Record<string, string> = {
  paid: "оплачен",
  wait: "ожидает",
  failed: "не прошёл",
}

const DEFAULT_COLUMNS = ["Счёт", "Дата", "Сумма", "Состояние", "Документ"]

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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

function level(used: number, limit: number) {
  if (used > limit) {
    return "over"
  }

  return used / limit >= 0.85 ? "warn" : "ok"
}

/**
 * Биллинг: текущий план, расход по лимитам полосой и дробью, история счетов.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard021({
  title = "Оплата и лимиты",
  plan = "Команда",
  planPrice = "24 000 ₽ / месяц",
  renewsOn = "Продление 1 апреля, автосписание включено",
  card = "Оплата картой · 4400 •••• 1287 · до 09/27",
  usage = DEFAULT_USAGE,
  invoices = DEFAULT_INVOICES,
  upgradeLabel = "Сменить план",
  cancelLabel = "Отменить продление",
  planSectionLabel = "Текущий план",
  usageText = "{used} из {limit} {unit}",
  overText = " · перерасход",
  invoicesTitle = "История счетов",
  invoiceColumns = DEFAULT_COLUMNS,
  statusText = STATUS_WORD,
  accent,
  background = "",
  className,
  style,
}: Dashboard021Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-021-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-021-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-021" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-021"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>

          <div data-part="top">
            <section data-part="plan" aria-label={planSectionLabel}>
              <p data-part="planname">
                {plan}
                <span data-part="price">{planPrice}</span>
              </p>
              <p data-part="renews">{renewsOn}</p>
              <div data-part="buttons">
                <button type="button" data-part="primary">
                  {upgradeLabel}
                </button>
                <button type="button" data-part="ghost">
                  {cancelLabel}
                </button>
              </div>
              <p data-part="card">{card}</p>
            </section>

            <ul data-part="usage">
              {usage.map((row) => {
                const share = Math.min(
                  100,
                  Math.round((row.used / row.limit) * 100),
                )

                return (
                  <li key={row.label} data-level={level(row.used, row.limit)}>
                    <p data-part="line">
                      <span>{row.label}</span>
                      <span data-part="figure">
                        {usageText
                          .replace("{used}", String(row.used))
                          .replace("{limit}", String(row.limit))
                          .replace("{unit}", row.unit ?? "")}
                        {row.used > row.limit ? overText : ""}
                      </span>
                    </p>
                    <span
                      data-part="track"
                      role="progressbar"
                      aria-valuenow={row.used}
                      aria-valuemin={0}
                      aria-valuemax={row.limit}
                      aria-label={row.label}
                    >
                      <span
                        data-part="fill"
                        style={
                          {
                            "--vibeui-dashboard-021-w": `${share}%`,
                          } as CSSProperties
                        }
                      />
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>

          <div data-part="tablewrap">
            <table>
              <caption>{invoicesTitle}</caption>
              <thead>
                <tr>
                  {invoiceColumns.map((column) => (
                    <th key={column} scope="col">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.number} data-status={invoice.status}>
                    <th scope="row">{invoice.number}</th>
                    <td>{invoice.date}</td>
                    <td data-part="sum">{invoice.amount}</td>
                    <td>
                      <span data-part="status">
                        <span data-part="mark" aria-hidden="true" />
                        {statusText[invoice.status] ??
                          STATUS_WORD[invoice.status]}
                      </span>
                    </td>
                    <td>
                      <a data-part="link" href="#dashboard-021">
                        PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  )
}

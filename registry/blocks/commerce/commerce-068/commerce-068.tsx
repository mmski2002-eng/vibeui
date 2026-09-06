import type { CSSProperties } from "react"

export type Commerce068State = "done" | "hold" | "back" | "fail"

export type Commerce068Payment = {
  id: string
  date: string
  dateIso: string
  title: string
  method: string
  amount: string
  state: Commerce068State
  receipt?: boolean
}

export type Commerce068Props = {
  title?: string
  period?: string
  periods?: string[]
  spentLabel?: string
  spent?: string
  returnedLabel?: string
  returned?: string
  payments?: Commerce068Payment[]
  periodLabel?: string
  /** Подписи статусов: done, hold, back, fail. */
  stateText?: Record<string, string>
  columnDate?: string
  columnWhat?: string
  columnAmount?: string
  columnState?: string
  receiptLabel?: string
  emptyText?: string
  more?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: история платежей таблицей, где статус назван словом и
// подкреплён формой значка. Итоги периода стоят над таблицей: человек
// приходит сюда узнать, сколько потратил, а не читать двадцать строк.
// Возвраты показаны в той же таблице со знаком, потому что «сколько
// потратил» без вычета возвратов — неверная цифра.
const STYLES = `
:where([data-vibeui-block="commerce-068"]){
--vibeui-commerce-068-bg:transparent;
--vibeui-commerce-068-surface:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-commerce-068-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-commerce-068-muted:light-dark(oklch(0.53 0 265),oklch(0.73 0 265));
--vibeui-commerce-068-border:light-dark(oklch(0.9 0 265),oklch(0.38 0 265));
--vibeui-commerce-068-soft:light-dark(oklch(0.972 0 265),oklch(0.27 0 265));
--vibeui-commerce-068-accent:light-dark(oklch(0.48 0.14 265),oklch(0.76 0.13 265));
--vibeui-commerce-068-done:light-dark(oklch(0.47 0.12 150),oklch(0.78 0.14 150));
--vibeui-commerce-068-hold:light-dark(oklch(0.58 0.13 75),oklch(0.82 0.14 75));
--vibeui-commerce-068-fail:light-dark(oklch(0.54 0.17 25),oklch(0.73 0.15 25));
--vibeui-commerce-068-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-068"]{color-scheme:dark}
[data-vibeui-block="commerce-068"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-068-bg);
color:var(--vibeui-commerce-068-fg);font-family:var(--vibeui-commerce-068-sans);
}
[data-vibeui-block="commerce-068"] *{box-sizing:border-box}
[data-vibeui-block="commerce-068"] [data-part="shell"]{max-width:60rem;margin:0 auto;padding:1.25rem 1rem 2rem}
[data-vibeui-block="commerce-068"] [data-part="top"]{display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;justify-content:space-between;margin-bottom:1rem}
[data-vibeui-block="commerce-068"] h2{margin:0;font-size:1.375rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-068"] select{
height:2.5rem;padding:0 2rem 0 0.75rem;border-radius:0.625rem;appearance:none;
border:1px solid var(--vibeui-commerce-068-border);background:var(--vibeui-commerce-068-surface);
font:inherit;font-size:0.875rem;color:inherit;
background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);
background-position:calc(100% - 1.0625rem) 1.125rem,calc(100% - 0.75rem) 1.125rem;
background-size:0.3125rem 0.3125rem,0.3125rem 0.3125rem;background-repeat:no-repeat;
}
[data-vibeui-block="commerce-068"] select:focus-visible,
[data-vibeui-block="commerce-068"] [data-part="receipt"]:focus-visible,
[data-vibeui-block="commerce-068"] [data-part="more"]:focus-visible{outline:2px solid var(--vibeui-commerce-068-accent);outline-offset:2px}
[data-vibeui-block="commerce-068"] [data-part="sums"]{display:grid;gap:0.625rem;grid-template-columns:repeat(2,minmax(0,1fr));margin-bottom:1.25rem}
[data-vibeui-block="commerce-068"] [data-part="sum"]{border:1px solid var(--vibeui-commerce-068-border);border-radius:0.875rem;padding:0.75rem 0.875rem;background:var(--vibeui-commerce-068-soft)}
[data-vibeui-block="commerce-068"] [data-part="slabel"]{display:block;font-size:0.75rem;color:var(--vibeui-commerce-068-muted)}
[data-vibeui-block="commerce-068"] [data-part="svalue"]{display:block;margin-top:0.125rem;font-size:1.375rem;font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-068"] [data-part="scroll"]{overflow-x:auto;border:1px solid var(--vibeui-commerce-068-border);border-radius:0.875rem}
[data-vibeui-block="commerce-068"] table{border-collapse:collapse;width:100%;min-width:36rem;font-size:0.8125rem}
[data-vibeui-block="commerce-068"] caption{
caption-side:top;text-align:left;padding:0.625rem 0.875rem;font-size:0.75rem;color:var(--vibeui-commerce-068-muted);
background:var(--vibeui-commerce-068-soft);border-bottom:1px solid var(--vibeui-commerce-068-border);
}
[data-vibeui-block="commerce-068"] th,
[data-vibeui-block="commerce-068"] td{padding:0.625rem 0.75rem;text-align:left;vertical-align:top;border-bottom:1px solid var(--vibeui-commerce-068-border)}
[data-vibeui-block="commerce-068"] thead th{
background:var(--vibeui-commerce-068-soft);font-size:0.6875rem;letter-spacing:0.05em;text-transform:uppercase;
color:var(--vibeui-commerce-068-muted);font-weight:700;
}
[data-vibeui-block="commerce-068"] tbody tr:last-child td{border-bottom:0}
[data-vibeui-block="commerce-068"] [data-part="what"]{font-weight:650}
[data-vibeui-block="commerce-068"] [data-part="method"]{display:block;margin-top:0.125rem;font-weight:400;color:var(--vibeui-commerce-068-muted)}
[data-vibeui-block="commerce-068"] [data-part="amount"]{text-align:right;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="commerce-068"] [data-part="amount"][data-state="back"]{color:var(--vibeui-commerce-068-done)}
[data-vibeui-block="commerce-068"] [data-part="state"]{display:inline-flex;align-items:center;gap:0.375rem;font-weight:650;white-space:nowrap}
[data-vibeui-block="commerce-068"] [data-part="mark"]{
flex:none;width:0.875rem;height:0.875rem;border-radius:9999px;
}
[data-vibeui-block="commerce-068"] [data-part="mark"][data-state="done"]{background:var(--vibeui-commerce-068-done)}
[data-vibeui-block="commerce-068"] [data-part="mark"][data-state="back"]{background:var(--vibeui-commerce-068-done);border-radius:0.1875rem}
[data-vibeui-block="commerce-068"] [data-part="mark"][data-state="hold"]{background:var(--vibeui-commerce-068-hold);clip-path:polygon(50% 0,100% 100%,0 100%);border-radius:0}
[data-vibeui-block="commerce-068"] [data-part="mark"][data-state="fail"]{background:var(--vibeui-commerce-068-fail);clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);border-radius:0}
[data-vibeui-block="commerce-068"] [data-part="receipt"]{
appearance:none;border:0;background:transparent;cursor:pointer;padding:0.125rem 0.25rem;border-radius:0.375rem;
font:inherit;font-size:0.75rem;font-weight:650;color:var(--vibeui-commerce-068-accent);
text-decoration:underline;text-underline-offset:2px;
}
[data-vibeui-block="commerce-068"] [data-part="empty"]{margin:0;padding:1.5rem 0.875rem;text-align:center;font-size:0.8125rem;color:var(--vibeui-commerce-068-muted)}
[data-vibeui-block="commerce-068"] [data-part="more"]{
appearance:none;cursor:pointer;display:block;margin:1rem auto 0;height:2.625rem;padding:0 1.5rem;border-radius:0.875rem;
border:1px solid var(--vibeui-commerce-068-border);background:var(--vibeui-commerce-068-surface);
color:inherit;font:inherit;font-size:0.875rem;font-weight:650;
}
@container (min-width: 44rem){
[data-vibeui-block="commerce-068"] [data-part="shell"]{padding:2rem 2rem 3rem}
[data-vibeui-block="commerce-068"] [data-part="sums"]{grid-template-columns:repeat(2,minmax(0,16rem))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-068"] *{animation:none!important;transition:none!important}}
`

const STATE_WORD: Record<Commerce068State, string> = {
  done: "Проведён",
  hold: "Ожидает банк",
  back: "Возврат",
  fail: "Отклонён",
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

const DEFAULT_PAYMENTS: Commerce068Payment[] = [
  {
    id: "1",
    date: "11 марта",
    dateIso: "2024-03-11",
    title: "Заказ № 2024-1187",
    method: "Мир •• 4821",
    amount: "− 62 580 ₽",
    state: "done",
    receipt: true,
  },
  {
    id: "2",
    date: "9 марта",
    dateIso: "2024-03-09",
    title: "Возврат по заказу № 2024-1102",
    method: "На карту •• 4821",
    amount: "+ 7 400 ₽",
    state: "back",
    receipt: true,
  },
  {
    id: "3",
    date: "8 марта",
    dateIso: "2024-03-08",
    title: "Заказ № 2024-1155",
    method: "Мир •• 0175",
    amount: "− 3 900 ₽",
    state: "hold",
  },
  {
    id: "4",
    date: "6 марта",
    dateIso: "2024-03-06",
    title: "Заказ № 2024-1149",
    method: "Мир •• 4821",
    amount: "− 12 300 ₽",
    state: "fail",
  },
  {
    id: "5",
    date: "2 марта",
    dateIso: "2024-03-02",
    title: "Подписка «Кофе каждый месяц»",
    method: "Автосписание •• 4821",
    amount: "− 1 690 ₽",
    state: "done",
    receipt: true,
  },
]

/**
 * История платежей: итоги периода над таблицей, статусы формой значка,
 * возвраты в общем списке. Один файл, ноль зависимостей.
 */
export function Commerce068({
  title = "История платежей",
  period = "Март 2024",
  periods = ["Март 2024", "Февраль 2024", "Январь 2024", "Весь 2023 год"],
  spentLabel = "Потрачено за период",
  spent = "78 780 ₽",
  returnedLabel = "Вернулось",
  returned = "7 400 ₽",
  payments = DEFAULT_PAYMENTS,
  periodLabel = "Период",
  stateText = STATE_WORD,
  columnDate = "Дата",
  columnWhat = "Операция",
  columnAmount = "Сумма",
  columnState = "Статус",
  receiptLabel = "Чек",
  emptyText = "За этот период платежей не было.",
  more = "Показать более ранние",
  accent,
  background = "",
  className,
  style,
}: Commerce068Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-068-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-068-bg": background,
          // Select периода и кнопка догрузки не должны просвечивать: им нужна
          // непрозрачная подложка, а она задана тем же цветом.
          "--vibeui-commerce-068-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-068" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-068"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="top">
            <h2>{title}</h2>
            <div>
              <label htmlFor="commerce-068-period" hidden>
                {periodLabel}
              </label>
              <select id="commerce-068-period" defaultValue={period}>
                {periods.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div data-part="sums">
            <div data-part="sum">
              <span data-part="slabel">{spentLabel}</span>
              <span data-part="svalue">{spent}</span>
            </div>
            <div data-part="sum">
              <span data-part="slabel">{returnedLabel}</span>
              <span data-part="svalue">{returned}</span>
            </div>
          </div>

          {payments.length === 0 ? (
            <p data-part="empty">{emptyText}</p>
          ) : (
            <div
              data-part="scroll"
              tabIndex={0}
              role="group"
              aria-label={title}
            >
              <table>
                <caption>
                  {title} · {period}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">{columnDate}</th>
                    <th scope="col">{columnWhat}</th>
                    <th scope="col">{columnAmount}</th>
                    <th scope="col">{columnState}</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>
                        <time dateTime={payment.dateIso}>{payment.date}</time>
                      </td>
                      <td>
                        <span data-part="what">{payment.title}</span>
                        <span data-part="method">{payment.method}</span>
                      </td>
                      <td data-part="amount" data-state={payment.state}>
                        {payment.amount}
                      </td>
                      <td>
                        <span data-part="state">
                          <span
                            data-part="mark"
                            data-state={payment.state}
                            aria-hidden="true"
                          />
                          {stateText[payment.state] ??
                            STATE_WORD[payment.state]}
                        </span>
                        {payment.receipt ? (
                          <>
                            <br />
                            <button type="button" data-part="receipt">
                              {receiptLabel} — {payment.title}
                            </button>
                          </>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button type="button" data-part="more">
            {more}
          </button>
        </div>
      </section>
    </>
  )
}

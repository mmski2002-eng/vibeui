import type { CSSProperties } from "react"

export type Solutions033Bid = {
  vendor: string
  price: number
  priceLabel: string
  deadlineDays: number
  warrantyMonths: number
}

export type Solutions033Props = {
  title?: string
  lot?: string
  budgetLabel?: string
  startPrice?: number
  deadlineHours?: number
  bids?: Solutions033Bid[]
  /** Подписи плиток сводки: start, bids. */
  summaryText?: Record<string, string>
  /** Заголовки колонок таблицы предложений. */
  columnText?: Record<string, string>
  /** Подпись под обратным отсчётом. */
  countdownNote?: string
  /** Отсчёт в днях. {days} — число дней. */
  daysText?: string
  /** Отсчёт в часах. {hours} — число часов. */
  hoursText?: string
  /** Срок поставки. {days} — число дней. */
  deliveryText?: string
  /** Гарантия. {months} — число месяцев. */
  warrantyText?: string
  /** Метка самого дешёвого предложения. */
  bestText?: string
  /** Итог под таблицей. {amount} — разница, {vendor} — поставщик. */
  footNote?: string
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
// Идея блока: сравнение предложений по лоту. Отклонение цены от стартовой не
// хранится строкой, а считается из price и startPrice — знак и процент видно
// сразу, а не подгоняется вручную под цифры. Самое дешёвое предложение
// помечено полосой слева и подписью «минимальная цена»: в таблице чисел глаз
// не находит минимум сам. Дедлайн подачи — обратный отсчёт часами, а не дата:
// «до 14:00» ничего не говорит о срочности, «осталось 6 ч» — говорит.
const STYLES = `
:where([data-vibeui-block="solutions-033"]){
--vibeui-solutions-033-bg:transparent;
--vibeui-solutions-033-panel:light-dark(oklch(0.973 0.005 60),oklch(0.27 0.01 60));
--vibeui-solutions-033-fg:light-dark(oklch(0.22 0.014 60),oklch(0.94 0.005 60));
--vibeui-solutions-033-muted:light-dark(oklch(0.54 0.014 60),oklch(0.69 0.011 60));
--vibeui-solutions-033-border:light-dark(oklch(0.9 0.007 60),oklch(0.36 0.011 60));
--vibeui-solutions-033-accent:light-dark(oklch(0.62 0.17 55),oklch(0.77 0.15 55));
--vibeui-solutions-033-good:light-dark(oklch(0.55 0.14 152),oklch(0.71 0.14 152));
--vibeui-solutions-033-bad:light-dark(oklch(0.57 0.19 25),oklch(0.71 0.17 25));
--vibeui-solutions-033-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-033-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-033"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-033-bg);
border:1px solid var(--vibeui-solutions-033-border);border-radius:1rem;
font-family:var(--vibeui-solutions-033-sans);color:var(--vibeui-solutions-033-fg);
}
[data-vibeui-block="solutions-033"] *{box-sizing:border-box}
[data-vibeui-block="solutions-033"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-033"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-033"] [data-part="lot"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-033-muted)}
/* Обратный отсчёт: срочность видна как факт, а не как календарная дата. */
[data-vibeui-block="solutions-033"] [data-part="countdown"]{
display:inline-flex;flex-direction:column;align-items:flex-end;gap:0.0625rem;
padding:0.375rem 0.75rem;border-radius:0.625rem;
background:var(--vibeui-solutions-033-panel);border:1px solid var(--vibeui-solutions-033-border);
}
[data-vibeui-block="solutions-033"] [data-part="countdown"] b{
font-size:0.9375rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-033"] [data-part="countdown"] span{font-size:0.625rem;color:var(--vibeui-solutions-033-muted)}
[data-vibeui-block="solutions-033"] [data-urgent="true"]{
border-color:color-mix(in oklab,var(--vibeui-solutions-033-bad) 45%,transparent);
background:color-mix(in oklab,var(--vibeui-solutions-033-bad) 8%,var(--vibeui-solutions-033-bg));
}
[data-vibeui-block="solutions-033"] [data-urgent="true"] b{color:var(--vibeui-solutions-033-bad)}
[data-vibeui-block="solutions-033"] [data-part="summary"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
[data-vibeui-block="solutions-033"] [data-part="tile"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;background:var(--vibeui-solutions-033-panel);
border:1px solid var(--vibeui-solutions-033-border);
}
[data-vibeui-block="solutions-033"] [data-part="tile"] b{
display:block;font-size:1rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.015em;
}
[data-vibeui-block="solutions-033"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-033-muted);
}
[data-vibeui-block="solutions-033"] [data-part="scroll"]{overflow-x:auto;scrollbar-width:thin}
[data-vibeui-block="solutions-033"] table{width:100%;min-width:38rem;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="solutions-033"] th,
[data-vibeui-block="solutions-033"] td{
padding:0.5rem 0.625rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-solutions-033-border);
}
[data-vibeui-block="solutions-033"] th:first-child,
[data-vibeui-block="solutions-033"] td:first-child{padding-left:1rem}
[data-vibeui-block="solutions-033"] th:last-child,
[data-vibeui-block="solutions-033"] td:last-child{padding-right:1rem}
[data-vibeui-block="solutions-033"] th{
font-size:0.625rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-033-muted);background:var(--vibeui-solutions-033-panel);
}
[data-vibeui-block="solutions-033"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
/* Минимальная цена помечена полосой слева: минимум не виден в столбце чисел сам по себе. */
[data-vibeui-block="solutions-033"] [data-best="true"] td:first-child{
box-shadow:inset 3px 0 0 0 var(--vibeui-solutions-033-good);
}
[data-vibeui-block="solutions-033"] [data-part="vendor"]{font-weight:650}
[data-vibeui-block="solutions-033"] [data-part="best-tag"]{
display:block;margin-top:0.125rem;font-size:0.625rem;font-weight:650;color:var(--vibeui-solutions-033-good);
}
[data-vibeui-block="solutions-033"] [data-part="price"]{font-family:var(--vibeui-solutions-033-mono)}
[data-vibeui-block="solutions-033"] [data-part="deviation"]{
display:inline-flex;align-items:center;padding:0.0625rem 0.4375rem;border-radius:9999px;
font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="solutions-033"] [data-dir="down"]{
color:var(--vibeui-solutions-033-good);
background:color-mix(in oklab,var(--vibeui-solutions-033-good) 14%,transparent);
}
[data-vibeui-block="solutions-033"] [data-dir="up"]{
color:var(--vibeui-solutions-033-bad);
background:color-mix(in oklab,var(--vibeui-solutions-033-bad) 14%,transparent);
}
[data-vibeui-block="solutions-033"] [data-dir="flat"]{
color:var(--vibeui-solutions-033-muted);
background:var(--vibeui-solutions-033-panel);
}
[data-vibeui-block="solutions-033"] [data-part="foot"]{
margin:0;padding:0.75rem 1rem 1rem;font-size:0.75rem;color:var(--vibeui-solutions-033-muted);
}
/* Сводка от собственной ширины: в узкой карточке две колонки нечитаемы. */
@container (max-width: 26rem){
[data-vibeui-block="solutions-033"] [data-part="summary"]{grid-template-columns:minmax(0,1fr);gap:0.375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-033"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_BIDS: Solutions033Bid[] = [
  {
    vendor: "ТехноСнаб",
    price: 3120000,
    priceLabel: "3 120 000 ₽",
    deadlineDays: 21,
    warrantyMonths: 24,
  },
  {
    vendor: "ИнжПром",
    price: 3480000,
    priceLabel: "3 480 000 ₽",
    deadlineDays: 14,
    warrantyMonths: 36,
  },
  {
    vendor: "Уралмонтаж",
    price: 2950000,
    priceLabel: "2 950 000 ₽",
    deadlineDays: 28,
    warrantyMonths: 12,
  },
  {
    vendor: "Северная сталь",
    price: 3400000,
    priceLabel: "3 400 000 ₽",
    deadlineDays: 18,
    warrantyMonths: 24,
  },
]

const SUMMARY_LABEL: Record<string, string> = {
  start: "стартовая цена лота",
  bids: "предложений подано",
}

const COLUMN_LABEL: Record<string, string> = {
  vendor: "Поставщик",
  price: "Цена",
  deviation: "Отклонение",
  deadline: "Срок поставки",
  warranty: "Гарантия",
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
 * Тендер по лоту: отклонение цены от стартовой считается из чисел, минимум
 * помечен полосой, дедлайн — обратным отсчётом. Один файл, своя палитра.
 */
export function Solutions033({
  title = "Поставка станков для цеха №2",
  lot = "Лот № 44-2024 · закрытый тендер",
  budgetLabel = "3 600 000 ₽",
  startPrice = 3600000,
  deadlineHours = 18,
  bids = DEFAULT_BIDS,
  summaryText = SUMMARY_LABEL,
  columnText = COLUMN_LABEL,
  countdownNote = "до конца приёма",
  daysText = "{days} дн.",
  hoursText = "{hours} ч",
  deliveryText = "{days} дн.",
  warrantyText = "{months} мес.",
  bestText = "минимальная цена",
  footNote = "Минимальная цена ниже стартовой на {amount} — предложил «{vendor}».",
  currency = "₽",
  locale = "ru-RU",
  accent,
  background = "",
  className,
  style,
}: Solutions033Props) {
  const cheapest = bids.reduce(
    (min, bid) => (bid.price < min.price ? bid : min),
    bids[0],
  )
  const urgent = deadlineHours <= 24
  const countdownLabel =
    deadlineHours >= 24
      ? daysText.replace("{days}", String(Math.round(deadlineHours / 24)))
      : hoursText.replace("{hours}", String(deadlineHours))
  const spread = startPrice - cheapest.price
  const column = (key: string) => columnText[key] ?? COLUMN_LABEL[key]
  const summary = (key: string) => summaryText[key] ?? SUMMARY_LABEL[key]

  const palette = {
    ...(accent ? { "--vibeui-solutions-033-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-033-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-033" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-033"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="lot">{lot}</p>
          </div>
          <p data-part="countdown" data-urgent={urgent ? "true" : "false"}>
            <b>{countdownLabel}</b>
            <span>{countdownNote}</span>
          </p>
        </header>

        <div data-part="summary">
          <p data-part="tile">
            <b>{budgetLabel}</b>
            <span>{summary("start")}</span>
          </p>
          <p data-part="tile">
            <b>{bids.length}</b>
            <span>{summary("bids")}</span>
          </p>
        </div>

        <div data-part="scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">{column("vendor")}</th>
                <th scope="col" data-align="end">
                  {column("price")}
                </th>
                <th scope="col" data-align="end">
                  {column("deviation")}
                </th>
                <th scope="col" data-align="end">
                  {column("deadline")}
                </th>
                <th scope="col" data-align="end">
                  {column("warranty")}
                </th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid) => {
                const deviation = Math.round(
                  ((bid.price - startPrice) / startPrice) * 100,
                )
                const dir =
                  deviation < 0 ? "down" : deviation > 0 ? "up" : "flat"
                const isBest = bid.vendor === cheapest.vendor

                return (
                  <tr key={bid.vendor} data-best={isBest ? "true" : "false"}>
                    <td>
                      <span data-part="vendor">{bid.vendor}</span>
                      {isBest ? (
                        <span data-part="best-tag">{bestText}</span>
                      ) : null}
                    </td>
                    <td data-align="end">
                      <span data-part="price">{bid.priceLabel}</span>
                    </td>
                    <td data-align="end">
                      <span data-part="deviation" data-dir={dir}>
                        {deviation > 0 ? "+" : ""}
                        {deviation}%
                      </span>
                    </td>
                    <td data-align="end">
                      {deliveryText.replace(
                        "{days}",
                        String(bid.deadlineDays),
                      )}
                    </td>
                    <td data-align="end">
                      {warrantyText.replace(
                        "{months}",
                        String(bid.warrantyMonths),
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <p data-part="foot">
          {footNote
            .replace(
              "{amount}",
              `${spread.toLocaleString(locale)} ${currency}`,
            )
            .replace("{vendor}", cheapest.vendor)}
        </p>
      </section>
    </>
  )
}

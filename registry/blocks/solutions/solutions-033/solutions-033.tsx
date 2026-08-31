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
  accent?: string
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
--vibeui-solutions-033-bg:oklch(1 0 0);
--vibeui-solutions-033-panel:oklch(0.973 0.005 60);
--vibeui-solutions-033-fg:oklch(0.22 0.014 60);
--vibeui-solutions-033-muted:oklch(0.54 0.014 60);
--vibeui-solutions-033-border:oklch(0.9 0.007 60);
--vibeui-solutions-033-accent:oklch(0.62 0.17 55);
--vibeui-solutions-033-good:oklch(0.55 0.14 152);
--vibeui-solutions-033-bad:oklch(0.57 0.19 25);
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
  accent,
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
      ? `${Math.round(deadlineHours / 24)} дн.`
      : `${deadlineHours} ч`
  const spread = startPrice - cheapest.price

  const palette = {
    ...(accent ? { "--vibeui-solutions-033-accent": accent } : null),
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
            <span>до конца приёма</span>
          </p>
        </header>

        <div data-part="summary">
          <p data-part="tile">
            <b>{budgetLabel}</b>
            <span>стартовая цена лота</span>
          </p>
          <p data-part="tile">
            <b>{bids.length}</b>
            <span>предложений подано</span>
          </p>
        </div>

        <div data-part="scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Поставщик</th>
                <th scope="col" data-align="end">
                  Цена
                </th>
                <th scope="col" data-align="end">
                  Отклонение
                </th>
                <th scope="col" data-align="end">
                  Срок поставки
                </th>
                <th scope="col" data-align="end">
                  Гарантия
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
                        <span data-part="best-tag">минимальная цена</span>
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
                    <td data-align="end">{bid.deadlineDays} дн.</td>
                    <td data-align="end">{bid.warrantyMonths} мес.</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <p data-part="foot">
          Минимальная цена ниже стартовой на {spread.toLocaleString("ru-RU")} ₽
          — предложил «{cheapest.vendor}».
        </p>
      </section>
    </>
  )
}

import type { CSSProperties } from "react"

export type Solutions039Purchase = {
  date: string
  card: string
  vehicle: string
  liters: number
  amount: number
}

export type Solutions039Consumption = {
  vehicle: string
  actual: number
  norm: number
}

export type Solutions039Props = {
  title?: string
  hint?: string
  purchases?: Solutions039Purchase[]
  consumption?: Solutions039Consumption[]
  /** Подписи плиток сводки: amount, liters, over. */
  summaryText?: Record<string, string>
  /** Заголовки секций: purchases, consumption. */
  sectionText?: Record<string, string>
  /** Заголовки колонок: date, card, vehicle, liters, amount. */
  columnText?: Record<string, string>
  /** Литры. {liters} — число литров. */
  litersText?: string
  /** Норма расхода. {norm} — литры на 100 км. */
  normText?: string
  /** Фактический расход. {actual} — литры на 100 км. */
  actualText?: string
  /** Величина перерасхода рядом с фактом. {over} — литры. */
  overText?: string
  /** Скрытая подпись полосы. {vehicle}, {actual} и {norm} подставляются. */
  barLabel?: string
  /** Хвост подписи полосы при перерасходе. {over} — литры. */
  barOverLabel?: string
  /** Сноска под полосами. */
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
// Идея блока: заправки по картам сверху, расход по машинам снизу. Перерасход
// л/100 км нарисован отдельным отрезком поверх нормы, а не отдельным числом
// рядом с планом — сразу видно, насколько именно превышен норматив, а не
// просто «да/нет». Шкала общая для всех машин, иначе полосы нельзя сравнить
// друг с другом на глаз.
const STYLES = `
:where([data-vibeui-block="solutions-039"]){
--vibeui-solutions-039-bg:transparent;
--vibeui-solutions-039-panel:light-dark(oklch(0.976 0.004 250),oklch(0.27 0.011 265));
--vibeui-solutions-039-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-solutions-039-muted:light-dark(oklch(0.54 0.014 265),oklch(0.69 0.012 265));
--vibeui-solutions-039-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-solutions-039-accent:light-dark(oklch(0.52 0.16 255),oklch(0.73 0.14 255));
--vibeui-solutions-039-over:light-dark(oklch(0.57 0.19 25),oklch(0.71 0.17 25));
--vibeui-solutions-039-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-039-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-039"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-039-bg);
border:1px solid var(--vibeui-solutions-039-border);border-radius:1rem;
font-family:var(--vibeui-solutions-039-sans);color:var(--vibeui-solutions-039-fg);
}
[data-vibeui-block="solutions-039"] *{box-sizing:border-box}
[data-vibeui-block="solutions-039"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-039"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-039"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-039-muted)}
[data-vibeui-block="solutions-039"] [data-part="summary"]{
display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
[data-vibeui-block="solutions-039"] [data-part="tile"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-solutions-039-panel);border:1px solid var(--vibeui-solutions-039-border);
}
[data-vibeui-block="solutions-039"] [data-part="tile"] b{
display:block;font-size:1.125rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.015em;
}
[data-vibeui-block="solutions-039"] [data-tile="over"] b{color:var(--vibeui-solutions-039-over)}
[data-vibeui-block="solutions-039"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-039-muted);
}
[data-vibeui-block="solutions-039"] [data-part="label"]{
margin:0;padding:0.75rem 1rem 0.375rem;font-size:0.6875rem;font-weight:650;
letter-spacing:0.03em;text-transform:uppercase;color:var(--vibeui-solutions-039-muted);
}
[data-vibeui-block="solutions-039"] [data-part="scroll"]{overflow-x:auto;scrollbar-width:thin}
[data-vibeui-block="solutions-039"] table{width:100%;min-width:34rem;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="solutions-039"] th,
[data-vibeui-block="solutions-039"] td{
padding:0.5rem 0.625rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-solutions-039-border);
}
[data-vibeui-block="solutions-039"] th:first-child,
[data-vibeui-block="solutions-039"] td:first-child{padding-left:1rem}
[data-vibeui-block="solutions-039"] th:last-child,
[data-vibeui-block="solutions-039"] td:last-child{padding-right:1rem}
[data-vibeui-block="solutions-039"] th{
font-size:0.625rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-039-muted);background:var(--vibeui-solutions-039-panel);
}
[data-vibeui-block="solutions-039"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="solutions-039"] [data-part="card"]{
font-family:var(--vibeui-solutions-039-mono);font-size:0.75rem;color:var(--vibeui-solutions-039-muted);
}
[data-vibeui-block="solutions-039"] [data-part="rows"]{
display:grid;gap:0.625rem;padding:0.375rem 1rem 1rem;
}
[data-vibeui-block="solutions-039"] [data-part="row"]{
display:grid;grid-template-columns:9rem 1fr;gap:0.25rem 0.75rem;align-items:center;
}
[data-vibeui-block="solutions-039"] [data-part="vehicle"]{
font-size:0.8125rem;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="solutions-039"] [data-part="figures"]{
grid-column:2;display:flex;justify-content:space-between;font-size:0.6875rem;
color:var(--vibeui-solutions-039-muted);font-variant-numeric:tabular-nums;margin-bottom:0.1875rem;
}
[data-vibeui-block="solutions-039"] [data-part="figures"] b{
font-weight:700;color:var(--vibeui-solutions-039-fg);
}
[data-vibeui-block="solutions-039"] [data-over="true"] [data-part="figures"] b{color:var(--vibeui-solutions-039-over)}
/* Перерасход — отдельный отрезок поверх нормы: видна именно величина превышения. */
[data-vibeui-block="solutions-039"] [data-part="track"]{
grid-column:2;position:relative;height:0.625rem;border-radius:9999px;
background:var(--vibeui-solutions-039-panel);border:1px solid var(--vibeui-solutions-039-border);overflow:hidden;
}
[data-vibeui-block="solutions-039"] [data-part="within"]{
position:absolute;top:0;bottom:0;left:0;border-radius:9999px;
background:var(--vibeui-solutions-039-accent);
}
[data-vibeui-block="solutions-039"] [data-part="over"]{
position:absolute;top:0;bottom:0;
background:repeating-linear-gradient(135deg,var(--vibeui-solutions-039-over) 0 3px,transparent 3px 6px);
border-left:2px solid var(--vibeui-solutions-039-over);
}
[data-vibeui-block="solutions-039"] [data-part="norm"]{
position:absolute;top:-2px;bottom:-2px;width:2px;background:var(--vibeui-solutions-039-fg);opacity:0.55;
}
[data-vibeui-block="solutions-039"] [data-part="foot"]{
margin:0;padding:0.75rem 1rem;font-size:0.75rem;color:var(--vibeui-solutions-039-muted);
border-top:1px solid var(--vibeui-solutions-039-border);
}
@container (min-width: 30rem){
[data-vibeui-block="solutions-039"] [data-part="row"]{grid-template-columns:11rem 1fr}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-039"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PURCHASES: Solutions039Purchase[] = [
  {
    date: "3 мар",
    card: "•• 4471",
    vehicle: "ГАЗель NEXT · А 412 ОК",
    liters: 62.4,
    amount: 4181,
  },
  {
    date: "3 мар",
    card: "•• 2290",
    vehicle: "КАМАЗ 65115 · Е 233 РА",
    liters: 148.0,
    amount: 10064,
  },
  {
    date: "4 мар",
    card: "•• 4471",
    vehicle: "Ford Transit · В 087 ТС",
    liters: 58.1,
    amount: 3893,
  },
  {
    date: "4 мар",
    card: "•• 7715",
    vehicle: "Lada Largus · М 561 НВ",
    liters: 41.6,
    amount: 2787,
  },
  {
    date: "5 мар",
    card: "•• 2290",
    vehicle: "КАМАЗ 65115 · Е 233 РА",
    liters: 152.3,
    amount: 10356,
  },
]

const DEFAULT_CONSUMPTION: Solutions039Consumption[] = [
  { vehicle: "ГАЗель NEXT · А 412 ОК", actual: 13.8, norm: 14.5 },
  { vehicle: "Ford Transit · В 087 ТС", actual: 16.9, norm: 13.0 },
  { vehicle: "КАМАЗ 65115 · Е 233 РА", actual: 34.2, norm: 31.0 },
  { vehicle: "Lada Largus · М 561 НВ", actual: 9.6, norm: 9.5 },
]

const SUMMARY_LABEL: Record<string, string> = {
  amount: "потрачено на топливо",
  liters: "залито по картам",
  over: "машин с перерасходом",
}

const SECTION_LABEL: Record<string, string> = {
  purchases: "Заправки",
  consumption: "Расход л/100 км против нормы",
}

const COLUMN_LABEL: Record<string, string> = {
  date: "Дата",
  card: "Карта",
  vehicle: "Машина",
  liters: "Литры",
  amount: "Сумма",
}

function overAmount(item: Solutions039Consumption) {
  return (item.actual - item.norm).toFixed(1)
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
 * Заправки по картам и расход л/100 км против нормы: перерасход нарисован
 * отдельным заштрихованным отрезком поверх отметки нормы.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions039({
  title = "Заправки и расход топлива",
  hint = "Март, все машины",
  purchases = DEFAULT_PURCHASES,
  consumption = DEFAULT_CONSUMPTION,
  summaryText = SUMMARY_LABEL,
  sectionText = SECTION_LABEL,
  columnText = COLUMN_LABEL,
  litersText = "{liters} л",
  normText = "норма {norm} л/100 км",
  actualText = "{actual} л/100 км",
  overText = "(+{over})",
  barLabel = "{vehicle}: расход {actual} л на 100 км при норме {norm}",
  barOverLabel = ", перерасход {over} л",
  footNote = "Штриховка — отрезок расхода сверх нормы, тонкая метка — сама норма.",
  currency = "₽",
  locale = "ru-RU",
  accent,
  background = "",
  className,
  style,
}: Solutions039Props) {
  const summary = (key: string) => summaryText[key] ?? SUMMARY_LABEL[key]
  const section = (key: string) => sectionText[key] ?? SECTION_LABEL[key]
  const column = (key: string) => columnText[key] ?? COLUMN_LABEL[key]
  const totalLiters = purchases.reduce((sum, item) => sum + item.liters, 0)
  const totalAmount = purchases.reduce((sum, item) => sum + item.amount, 0)
  const overCount = consumption.filter((item) => item.actual > item.norm).length
  const scale =
    Math.ceil(
      (Math.max(
        ...consumption.map((item) => Math.max(item.actual, item.norm)),
      ) *
        1.15) /
        5,
    ) * 5

  const palette = {
    ...(accent ? { "--vibeui-solutions-039-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-039-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-039" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-039"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="hint">{hint}</p>
          </div>
        </header>

        <div data-part="summary">
          <p data-part="tile">
            <b>
              {totalAmount.toLocaleString(locale)} {currency}
            </b>
            <span>{summary("amount")}</span>
          </p>
          <p data-part="tile">
            <b>
              {litersText.replace(
                "{liters}",
                totalLiters.toLocaleString(locale),
              )}
            </b>
            <span>{summary("liters")}</span>
          </p>
          <p data-part="tile" data-tile={overCount > 0 ? "over" : undefined}>
            <b>{overCount}</b>
            <span>{summary("over")}</span>
          </p>
        </div>

        <p data-part="label">{section("purchases")}</p>
        <div data-part="scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">{column("date")}</th>
                <th scope="col">{column("card")}</th>
                <th scope="col">{column("vehicle")}</th>
                <th scope="col" data-align="end">
                  {column("liters")}
                </th>
                <th scope="col" data-align="end">
                  {column("amount")}
                </th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase, index) => (
                <tr key={`${purchase.date}-${purchase.card}-${index}`}>
                  <td>{purchase.date}</td>
                  <td>
                    <span data-part="card">{purchase.card}</span>
                  </td>
                  <td>{purchase.vehicle}</td>
                  <td data-align="end">
                    {purchase.liters.toLocaleString(locale)}
                  </td>
                  <td data-align="end">
                    {purchase.amount.toLocaleString(locale)} {currency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p data-part="label">{section("consumption")}</p>
        <div data-part="rows">
          {consumption.map((item) => {
            const over = item.actual > item.norm
            const withinPct = (Math.min(item.actual, item.norm) / scale) * 100
            const overPct = (Math.max(0, item.actual - item.norm) / scale) * 100
            const normPct = (item.norm / scale) * 100
            return (
              <div data-part="row" key={item.vehicle}>
                <span data-part="vehicle">{item.vehicle}</span>
                <span data-part="figures" data-over={String(over)}>
                  <span>
                    {normText.replace(
                      "{norm}",
                      item.norm.toLocaleString(locale),
                    )}
                  </span>
                  <b>
                    {actualText.replace(
                      "{actual}",
                      item.actual.toLocaleString(locale),
                    )}
                    {over
                      ? ` ${overText.replace("{over}", overAmount(item))}`
                      : ""}
                  </b>
                </span>
                <span
                  data-part="track"
                  role="img"
                  aria-label={
                    barLabel
                      .replace("{vehicle}", item.vehicle)
                      .replace("{actual}", String(item.actual))
                      .replace("{norm}", String(item.norm)) +
                    (over
                      ? barOverLabel.replace("{over}", overAmount(item))
                      : "")
                  }
                >
                  <span data-part="within" style={{ width: `${withinPct}%` }} />
                  {over ? (
                    <span
                      data-part="over"
                      style={{ left: `${withinPct}%`, width: `${overPct}%` }}
                    />
                  ) : null}
                  <span data-part="norm" style={{ left: `${normPct}%` }} />
                </span>
              </div>
            )
          })}
        </div>

        <p data-part="foot">{footNote}</p>
      </section>
    </>
  )
}

import type { CSSProperties } from "react"

export type Solutions051Mechanic = "discount" | "gift" | "cashback"

export type Solutions051Promo = {
  name: string
  mechanic: Solutions051Mechanic
  value: string
  code: string
  period: string
  limit: number
  used: number
  revenue: number
  cost: number
}

export type Solutions051Props = {
  title?: string
  subtitle?: string
  promos?: Solutions051Promo[]
  foot?: string
  /** Доля израсходованного лимита, с которой акция считается на исходе, %. */
  lowAt?: number
  /** Подписи плиток: revenue, cost, margin. */
  statsText?: Record<string, string>
  /** Подписи механик: discount, gift, cashback. */
  mechanicText?: Record<string, string>
  /** Буквы в кружке механики: те же ключи, что и в mechanicText. */
  mechanicLetter?: Record<string, string>
  /** Строка активаций. {used} и {limit} подставляются на месте. */
  usedText?: string
  /** Приписка при почти исчерпанном лимите. */
  lowText?: string
  /** Остаток активаций. {count} — сколько осталось. */
  remainingText?: string
  /** Скрытая подпись полосы. {code} — промокод. */
  progressLabel?: string
  /** Подписи денежной строки карточки: revenue, cost. */
  moneyText?: Record<string, string>
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
// Идея блока: витрина промоакций. Три сводных числа сверху — выручка,
// стоимость промо и итоговая маржа — отвечают на вопрос маркетолога «мы на
// этом зарабатываем или спонсируем скидку», список без них заставляет
// вычитать в уме. Лимит активаций нарисован полосой расхода: цифры «412 из
// 500» сами по себе не показывают темп, а полоса — показывает, и меняет цвет,
// когда лимит почти исчерпан. Механика акции несёт не только цвет, но и
// букву-маркер и подпись словом — скидка, подарок и кэшбэк не должны
// путаться при дальтонизме.
const STYLES = `
:where([data-vibeui-block="solutions-051"]){
--vibeui-solutions-051-bg:transparent;
--vibeui-solutions-051-panel:light-dark(oklch(0.976 0.004 330),oklch(0.27 0.014 330));
--vibeui-solutions-051-fg:light-dark(oklch(0.22 0.02 330),oklch(0.94 0.006 330));
--vibeui-solutions-051-muted:light-dark(oklch(0.54 0.016 330),oklch(0.69 0.014 330));
--vibeui-solutions-051-border:light-dark(oklch(0.9 0.008 330),oklch(0.36 0.014 330));
--vibeui-solutions-051-accent:light-dark(oklch(0.58 0.19 340),oklch(0.75 0.16 340));
--vibeui-solutions-051-gift:light-dark(oklch(0.6 0.14 150),oklch(0.74 0.13 150));
--vibeui-solutions-051-cashback:light-dark(oklch(0.58 0.14 235),oklch(0.74 0.13 235));
--vibeui-solutions-051-low:light-dark(oklch(0.57 0.19 35),oklch(0.73 0.16 35));
--vibeui-solutions-051-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-051-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-051"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-051-bg);
border:1px solid var(--vibeui-solutions-051-border);border-radius:1rem;
font-family:var(--vibeui-solutions-051-sans);color:var(--vibeui-solutions-051-fg);
}
[data-vibeui-block="solutions-051"] *{box-sizing:border-box}
[data-vibeui-block="solutions-051"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-051"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-051"] [data-part="subtitle"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-051-muted)}
[data-vibeui-block="solutions-051"] [data-part="summary"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
[data-vibeui-block="solutions-051"] [data-part="tile"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-solutions-051-panel);
border:1px solid var(--vibeui-solutions-051-border);
}
[data-vibeui-block="solutions-051"] [data-part="tile"] b{
display:block;font-size:1.0625rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.015em;
}
[data-vibeui-block="solutions-051"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-051-muted);
}
[data-vibeui-block="solutions-051"] [data-tile="margin"] b{color:var(--vibeui-solutions-051-accent)}
[data-vibeui-block="solutions-051"] [data-part="grid"]{
display:grid;grid-template-columns:1fr;gap:0.625rem;padding:0 1rem 1rem;
}
@container (min-width: 34rem){
[data-vibeui-block="solutions-051"] [data-part="summary"]{grid-template-columns:repeat(3,minmax(0,1fr))}
[data-vibeui-block="solutions-051"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container (min-width: 56rem){
[data-vibeui-block="solutions-051"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
[data-vibeui-block="solutions-051"] [data-part="card"]{
border:1px solid var(--vibeui-solutions-051-border);border-radius:0.875rem;
padding:0.75rem 0.875rem;display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="solutions-051"] [data-part="card-head"]{
display:flex;align-items:flex-start;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="solutions-051"] [data-part="name"]{margin:0;font-size:0.875rem;font-weight:650;line-height:1.25}
[data-vibeui-block="solutions-051"] [data-part="value"]{
margin:0.125rem 0 0;font-size:0.75rem;color:var(--vibeui-solutions-051-accent);font-weight:650;
}
/* Механика — буква-маркер и подпись словом, не только цвет: не путать при дальтонизме. */
[data-vibeui-block="solutions-051"] [data-part="badge"]{
display:inline-flex;align-items:center;gap:0.3125rem;flex-shrink:0;
padding:0.1875rem 0.5rem 0.1875rem 0.25rem;border-radius:9999px;
border:1px solid var(--vibeui-solutions-051-border);
font-size:0.625rem;font-weight:650;color:var(--vibeui-solutions-051-muted);white-space:nowrap;
}
[data-vibeui-block="solutions-051"] [data-part="letter"]{
width:1rem;height:1rem;border-radius:9999px;display:grid;place-items:center;flex-shrink:0;
background:var(--vibeui-solutions-051-panel);color:light-dark(oklch(1 0 0),oklch(0.18 0.02 330));font-size:0.5625rem;font-weight:700;line-height:1;
}
[data-vibeui-block="solutions-051"] [data-mechanic="discount"] [data-part="letter"]{background:var(--vibeui-solutions-051-accent)}
[data-vibeui-block="solutions-051"] [data-mechanic="discount"] [data-part="badge"]{color:var(--vibeui-solutions-051-accent);border-color:color-mix(in oklab,var(--vibeui-solutions-051-accent) 45%,transparent)}
[data-vibeui-block="solutions-051"] [data-mechanic="gift"] [data-part="letter"]{background:var(--vibeui-solutions-051-gift)}
[data-vibeui-block="solutions-051"] [data-mechanic="gift"] [data-part="badge"]{color:var(--vibeui-solutions-051-gift);border-color:color-mix(in oklab,var(--vibeui-solutions-051-gift) 45%,transparent)}
[data-vibeui-block="solutions-051"] [data-mechanic="cashback"] [data-part="letter"]{background:var(--vibeui-solutions-051-cashback)}
[data-vibeui-block="solutions-051"] [data-mechanic="cashback"] [data-part="badge"]{color:var(--vibeui-solutions-051-cashback);border-color:color-mix(in oklab,var(--vibeui-solutions-051-cashback) 45%,transparent)}
[data-vibeui-block="solutions-051"] [data-part="meta"]{
display:flex;flex-wrap:wrap;gap:0.375rem 0.75rem;margin:0;font-size:0.6875rem;color:var(--vibeui-solutions-051-muted);
}
[data-vibeui-block="solutions-051"] [data-part="code"]{
font-family:var(--vibeui-solutions-051-mono);color:var(--vibeui-solutions-051-fg);
}
[data-vibeui-block="solutions-051"] [data-part="limit-row"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;font-size:0.6875rem;color:var(--vibeui-solutions-051-muted);
}
[data-vibeui-block="solutions-051"] [data-part="limit-row"] b{font-variant-numeric:tabular-nums;color:var(--vibeui-solutions-051-fg)}
[data-vibeui-block="solutions-051"] [role="progressbar"]{
position:relative;height:0.4375rem;border-radius:9999px;background:var(--vibeui-solutions-051-panel);overflow:hidden;
}
[data-vibeui-block="solutions-051"] [role="progressbar"] i{
position:absolute;inset:0 auto 0 0;display:block;border-radius:9999px;
background:var(--vibeui-solutions-051-accent);width:var(--vibeui-solutions-051-fill,0%);
}
[data-vibeui-block="solutions-051"] [data-low="true"] [role="progressbar"] i{background:var(--vibeui-solutions-051-low)}
[data-vibeui-block="solutions-051"] [data-part="money"]{
display:flex;justify-content:space-between;gap:0.5rem;padding-top:0.375rem;
border-top:1px dashed var(--vibeui-solutions-051-border);font-size:0.6875rem;
}
[data-vibeui-block="solutions-051"] [data-part="money"] b{font-variant-numeric:tabular-nums;font-weight:650}
[data-vibeui-block="solutions-051"] [data-part="foot"]{
margin:0;padding:0 1rem 1rem;font-size:0.75rem;color:var(--vibeui-solutions-051-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-051"] *{animation:none!important;transition:none!important}}
`

const MECHANIC_LABEL: Record<string, string> = {
  discount: "скидка",
  gift: "подарок",
  cashback: "кэшбэк",
}

const MECHANIC_LETTER: Record<string, string> = {
  discount: "%",
  gift: "П",
  cashback: "К",
}

const STATS_LABEL: Record<string, string> = {
  revenue: "выручка по промо",
  cost: "стоимость промо",
  margin: "маржа",
}

const MONEY_LABEL: Record<string, string> = {
  revenue: "Выручка",
  cost: "Стоимость",
}

const DEFAULT_PROMOS: Solutions051Promo[] = [
  {
    name: "Весенняя распродажа",
    mechanic: "discount",
    value: "−20% на весь заказ",
    code: "VESNA20",
    period: "1–15 марта",
    limit: 500,
    used: 412,
    revenue: 1840000,
    cost: 368000,
  },
  {
    name: "Подарок к заказу от 3000 ₽",
    mechanic: "gift",
    value: "Термокружка в подарок",
    code: "GIFTMUG",
    period: "5–31 марта",
    limit: 300,
    used: 118,
    revenue: 612000,
    cost: 141000,
  },
  {
    name: "Кэшбэк за отзыв",
    mechanic: "cashback",
    value: "10% баллами на счёт",
    code: "REVIEW10",
    period: "1 марта – 30 апреля",
    limit: 1000,
    used: 946,
    revenue: 2410000,
    cost: 241000,
  },
  {
    name: "Возврат клиента",
    mechanic: "discount",
    value: "−15% на первый заказ после паузы",
    code: "COMEBACK15",
    period: "10–24 марта",
    limit: 250,
    used: 231,
    revenue: 587000,
    cost: 96000,
  },
  {
    name: "Подарок именинникам",
    mechanic: "gift",
    value: "Десерт дня в подарок",
    code: "BDAYVIBE",
    period: "весь март",
    limit: 200,
    used: 54,
    revenue: 164000,
    cost: 39000,
  },
  {
    name: "Кэшбэк на доставку",
    mechanic: "cashback",
    value: "5% от суммы доставки",
    code: "DELIV5",
    period: "1–20 марта",
    limit: 600,
    used: 388,
    revenue: 903000,
    cost: 74000,
  },
]

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
 * Витрина промоакций: карточка на акцию с полосой расхода лимита активаций
 * и парой «выручка / стоимость» под чертой. Один файл, ноль зависимостей.
 */
export function Solutions051({
  title = "Промоакции и купоны",
  subtitle = "Активные и недавно завершённые",
  promos = DEFAULT_PROMOS,
  foot = "Маржа — выручка по промо за вычетом его стоимости; ROI ниже 3× считается на грани окупаемости.",
  lowAt = 90,
  statsText = STATS_LABEL,
  mechanicText = MECHANIC_LABEL,
  mechanicLetter = MECHANIC_LETTER,
  usedText = "Активаций: {used} из {limit}",
  lowText = "лимит почти исчерпан",
  remainingText = "осталось {count}",
  progressLabel = "Активации промокода {code}",
  moneyText = MONEY_LABEL,
  currency = "₽",
  locale = "ru-RU",
  accent,
  background = "",
  className,
  style,
}: Solutions051Props) {
  const money = (value: number) => `${value.toLocaleString(locale)} ${currency}`
  const stat = (key: string) => statsText[key] ?? STATS_LABEL[key]
  const [usedBefore = "", usedAfter = ""] = usedText.split("{used}")
  const revenueSum = promos.reduce((sum, promo) => sum + promo.revenue, 0)
  const costSum = promos.reduce((sum, promo) => sum + promo.cost, 0)
  const marginSum = revenueSum - costSum

  const palette = {
    ...(accent ? { "--vibeui-solutions-051-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-051-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-051" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-051"
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

        <div data-part="summary">
          <p data-part="tile">
            <b>{money(revenueSum)}</b>
            <span>{stat("revenue")}</span>
          </p>
          <p data-part="tile">
            <b>{money(costSum)}</b>
            <span>{stat("cost")}</span>
          </p>
          <p data-part="tile" data-tile="margin">
            <b>{money(marginSum)}</b>
            <span>{stat("margin")}</span>
          </p>
        </div>

        <div data-part="grid">
          {promos.map((promo) => {
            const ratio = promo.limit > 0 ? promo.used / promo.limit : 0
            const low = ratio * 100 >= lowAt
            const remaining = Math.max(promo.limit - promo.used, 0)

            return (
              <article
                data-part="card"
                data-mechanic={promo.mechanic}
                data-low={low}
                key={promo.code}
              >
                <div data-part="card-head">
                  <div>
                    <p data-part="name">{promo.name}</p>
                    <p data-part="value">{promo.value}</p>
                  </div>
                  <span data-part="badge">
                    <span data-part="letter" aria-hidden="true">
                      {mechanicLetter[promo.mechanic] ??
                        MECHANIC_LETTER[promo.mechanic]}
                    </span>
                    {mechanicText[promo.mechanic] ??
                      MECHANIC_LABEL[promo.mechanic]}
                  </span>
                </div>

                <p data-part="meta">
                  <span data-part="code">{promo.code}</span>
                  <span>{promo.period}</span>
                </p>

                <div>
                  <p data-part="limit-row">
                    <span>
                      {usedBefore}
                      <b>{promo.used}</b>
                      {usedAfter.replace("{limit}", String(promo.limit))}
                    </span>
                    <span>
                      {low
                        ? lowText
                        : remainingText.replace("{count}", String(remaining))}
                    </span>
                  </p>
                  <div
                    role="progressbar"
                    aria-valuenow={promo.used}
                    aria-valuemin={0}
                    aria-valuemax={promo.limit}
                    aria-label={progressLabel.replace("{code}", promo.code)}
                    style={
                      {
                        "--vibeui-solutions-051-fill": `${Math.min(ratio * 100, 100)}%`,
                      } as CSSProperties
                    }
                  >
                    <i />
                  </div>
                </div>

                <p data-part="money">
                  <span>
                    {moneyText.revenue ?? MONEY_LABEL.revenue}{" "}
                    <b>{money(promo.revenue)}</b>
                  </span>
                  <span>
                    {moneyText.cost ?? MONEY_LABEL.cost}{" "}
                    <b>{money(promo.cost)}</b>
                  </span>
                </p>
              </article>
            )
          })}
        </div>

        <p data-part="foot">{foot}</p>
      </section>
    </>
  )
}

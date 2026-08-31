import type { CSSProperties } from "react"

export type Commerce043Offer = {
  id: string
  seller: string
  rating: number
  votes: number
  price: number
  shipping: number
  eta: string
  stock: string
  best?: string
  years?: string
}

export type Commerce043Props = {
  title?: string
  product?: string
  sorts?: string[]
  offers?: Commerce043Offer[]
  cta?: string
  note?: string
  currency?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: сравнение продавцов по итоговой цене, а не по цене товара.
// Самое дешёвое предложение с дорогой доставкой проигрывает, поэтому сумма
// «товар + доставка» считается прямо в блоке и стоит в строке крупнее. Ярлык
// лучшего предложения объясняет, чем оно лучшее, — «выгоднее всего» и
// «быстрее всех» это разные победители.
const STYLES = `
:where([data-vibeui-block="commerce-043"]){
--vibeui-commerce-043-bg:oklch(1 0 0);
--vibeui-commerce-043-fg:oklch(0.21 0.014 265);
--vibeui-commerce-043-muted:oklch(0.55 0.014 265);
--vibeui-commerce-043-border:oklch(0.91 0.006 265);
--vibeui-commerce-043-soft:oklch(0.975 0.004 265);
--vibeui-commerce-043-accent:oklch(0.5 0.14 210);
--vibeui-commerce-043-star:oklch(0.72 0.15 80);
--vibeui-commerce-043-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-043"]{
box-sizing:border-box;background:var(--vibeui-commerce-043-bg);
color:var(--vibeui-commerce-043-fg);font-family:var(--vibeui-commerce-043-sans);
}
[data-vibeui-block="commerce-043"] *{box-sizing:border-box}
[data-vibeui-block="commerce-043"] [data-part="shell"]{max-width:56rem;margin:0 auto;padding:1.25rem 1rem}
[data-vibeui-block="commerce-043"] [data-part="head"]{
display:flex;flex-wrap:wrap;gap:0.75rem;align-items:flex-end;justify-content:space-between;margin-bottom:0.875rem;
}
[data-vibeui-block="commerce-043"] h2{margin:0;font-size:1.1875rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-043"] [data-part="product"]{margin:0.1875rem 0 0;font-size:0.8125rem;color:var(--vibeui-commerce-043-muted)}
[data-vibeui-block="commerce-043"] [data-part="sort"]{display:flex;align-items:center;gap:0.375rem;font-size:0.75rem;color:var(--vibeui-commerce-043-muted)}
[data-vibeui-block="commerce-043"] select{
height:2.25rem;padding:0 0.625rem;border-radius:0.75rem;
border:1px solid var(--vibeui-commerce-043-border);background:var(--vibeui-commerce-043-bg);
color:var(--vibeui-commerce-043-fg);font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="commerce-043"] select:focus-visible{outline:2px solid var(--vibeui-commerce-043-accent);outline-offset:1px}
[data-vibeui-block="commerce-043"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="commerce-043"] [data-part="offer"]{
position:relative;border:1px solid var(--vibeui-commerce-043-border);border-radius:1.125rem;padding:0.875rem;
display:grid;gap:0.625rem;
}
@container (min-width: 42rem){
[data-vibeui-block="commerce-043"] [data-part="offer"]{grid-template-columns:minmax(0,1fr) 9rem 9.5rem;align-items:center;gap:1rem}
}
[data-vibeui-block="commerce-043"] [data-part="offer"][data-best="yes"]{
border-color:var(--vibeui-commerce-043-accent);box-shadow:inset 0 0 0 1px var(--vibeui-commerce-043-accent);
}
/* Ярлык объясняет, чем предложение лучшее: дешевле и быстрее — разные победители. */
[data-vibeui-block="commerce-043"] [data-part="flag"]{
position:absolute;top:-0.6875rem;left:0.875rem;padding:0.1875rem 0.5rem;border-radius:0.5rem;
background:var(--vibeui-commerce-043-accent);color:oklch(1 0 0);font-size:0.625rem;font-weight:700;
}
[data-vibeui-block="commerce-043"] [data-part="seller"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="commerce-043"] [data-part="meta"]{
margin:0.25rem 0 0;display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;font-size:0.75rem;color:var(--vibeui-commerce-043-muted);
}
[data-vibeui-block="commerce-043"] [data-part="rating"]{
display:inline-flex;align-items:center;gap:0.25rem;font-weight:650;color:var(--vibeui-commerce-043-fg);
}
[data-vibeui-block="commerce-043"] [data-part="rating"] i{font-style:normal;color:var(--vibeui-commerce-043-star)}
[data-vibeui-block="commerce-043"] [data-part="eta"]{margin:0.25rem 0 0;font-size:0.75rem;color:var(--vibeui-commerce-043-muted)}
[data-vibeui-block="commerce-043"] [data-part="eta"] b{color:var(--vibeui-commerce-043-fg);font-weight:650}
[data-vibeui-block="commerce-043"] [data-part="money"]{display:grid;gap:0.0625rem}
[data-vibeui-block="commerce-043"] [data-part="sum"]{
margin:0;font-size:1.25rem;font-weight:750;letter-spacing:-0.02em;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="commerce-043"] [data-part="parts"]{margin:0;font-size:0.6875rem;color:var(--vibeui-commerce-043-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-043"] [data-part="free"]{color:oklch(0.5 0.13 150);font-weight:650}
[data-vibeui-block="commerce-043"] [data-part="buy"]{
appearance:none;border:0;cursor:pointer;width:100%;height:2.625rem;border-radius:0.875rem;
background:var(--vibeui-commerce-043-accent);color:oklch(1 0 0);font:inherit;font-size:0.875rem;font-weight:700;
}
[data-vibeui-block="commerce-043"] [data-part="offer"][data-best="no"] [data-part="buy"]{
background:var(--vibeui-commerce-043-bg);color:var(--vibeui-commerce-043-fg);
box-shadow:inset 0 0 0 1px var(--vibeui-commerce-043-border);
}
[data-vibeui-block="commerce-043"] [data-part="buy"]:focus-visible{outline:2px solid var(--vibeui-commerce-043-accent);outline-offset:2px}
[data-vibeui-block="commerce-043"] [data-part="note"]{
margin:0.875rem 0 0;padding:0.625rem 0.75rem;border-radius:0.875rem;background:var(--vibeui-commerce-043-soft);
font-size:0.75rem;line-height:1.55;color:var(--vibeui-commerce-043-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-043"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SORTS = [
  "Сначала дешевле с доставкой",
  "Сначала быстрее",
  "Сначала с лучшим рейтингом",
]

const DEFAULT_OFFERS: Commerce043Offer[] = [
  {
    id: "o1",
    seller: "Хмарь — фирменный магазин",
    rating: 4.9,
    votes: 2340,
    price: 16200,
    shipping: 0,
    eta: "завтра, 12:00–18:00",
    stock: "12 шт. на складе",
    best: "Выгоднее всего с доставкой",
    years: "на площадке 6 лет",
  },
  {
    id: "o2",
    seller: "Свет и Дом",
    rating: 4.6,
    votes: 812,
    price: 15600,
    shipping: 890,
    eta: "12 марта",
    stock: "3 шт. на складе",
    years: "на площадке 2 года",
  },
  {
    id: "o3",
    seller: "Северный склад",
    rating: 4.2,
    votes: 148,
    price: 15200,
    shipping: 1490,
    eta: "16–19 марта",
    stock: "под заказ",
    years: "на площадке 8 месяцев",
  },
]

/**
 * Сравнение предложений продавцов: сумма с доставкой считается в блоке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce043({
  title = "Предложения продавцов",
  product = "Торшер «Сумерки», ясень, тканый абажур",
  sorts = DEFAULT_SORTS,
  offers = DEFAULT_OFFERS,
  cta = "Выбрать продавца",
  note = "Цена сравнивается вместе с доставкой в ваш город. Условия возврата у продавцов разные: у фирменного магазина — 14 дней без причины, у остальных смотрите карточку продавца.",
  currency = "₽",
  accent,
  className,
  style,
}: Commerce043Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-043-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-043" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-043"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <div>
              <h2>{title}</h2>
              <p data-part="product">{product}</p>
            </div>
            <div data-part="sort">
              <label htmlFor="commerce-043-sort">Порядок</label>
              <select id="commerce-043-sort" defaultValue={sorts[0]}>
                {sorts.map((sort) => (
                  <option key={sort} value={sort}>
                    {sort}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ul>
            {offers.map((offer) => (
              <li
                key={offer.id}
                data-part="offer"
                data-best={offer.best ? "yes" : "no"}
              >
                {offer.best ? <span data-part="flag">{offer.best}</span> : null}
                <div>
                  <p data-part="seller">{offer.seller}</p>
                  <p data-part="meta">
                    <span data-part="rating">
                      <i aria-hidden="true">★</i>
                      {offer.rating.toLocaleString("ru-RU")}
                    </span>
                    <span>{offer.votes.toLocaleString("ru-RU")} оценок</span>
                    {offer.years ? <span>{offer.years}</span> : null}
                  </p>
                  <p data-part="eta">
                    Доставка <b>{offer.eta}</b> · {offer.stock}
                  </p>
                </div>
                <div data-part="money">
                  <p data-part="sum">
                    {(offer.price + offer.shipping).toLocaleString("ru-RU")}{" "}
                    {currency}
                  </p>
                  <p data-part="parts">
                    {offer.price.toLocaleString("ru-RU")} {currency} +{" "}
                    {offer.shipping === 0 ? (
                      <span data-part="free">бесплатная доставка</span>
                    ) : (
                      `${offer.shipping.toLocaleString("ru-RU")} ${currency} доставка`
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  data-part="buy"
                  aria-label={`${cta}: ${offer.seller}`}
                >
                  {cta}
                </button>
              </li>
            ))}
          </ul>

          <p data-part="note">{note}</p>
        </div>
      </section>
    </>
  )
}

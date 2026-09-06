import type { CSSProperties } from "react"

export type Commerce059Line = {
  id: string
  title: string
  spec: string
  price: string
  count: number
  hue?: number
}

export type Commerce059Seller = {
  id: string
  name: string
  rating: string
  shipping: string
  eta: string
  subtotal: string
  warning?: string
  lines: Commerce059Line[]
}

export type Commerce059Props = {
  title?: string
  lead?: string
  sellers?: Commerce059Seller[]
  itemsLabel?: string
  shippingLabel?: string
  totalLabel?: string
  items?: string
  shipping?: string
  total?: string
  cta?: string
  note?: string
  countLabel?: string
  /** Срок доставки: {date} подставляется датой продавца. */
  etaTemplate?: string
  subtotalLabel?: string
  summaryTitle?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: корзина маркетплейса, где товары приходят от разных продавцов.
// Каждая группа несёт свои условия — доставку, срок и промежуточный итог, —
// потому что покупатель платит один раз, а посылок получает несколько, и
// возвращать их придётся по отдельности. Общий итог внизу собирает группы,
// но не прячет их: одна сумма без разбивки не объясняет, почему доставка
// стоит столько.
const STYLES = `
:where([data-vibeui-block="commerce-059"]){
--vibeui-commerce-059-bg:transparent;
--vibeui-commerce-059-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-commerce-059-muted:light-dark(oklch(0.53 0 265),oklch(0.73 0 265));
--vibeui-commerce-059-border:light-dark(oklch(0.91 0 265),oklch(0.38 0 265));
--vibeui-commerce-059-soft:light-dark(oklch(0.972 0 265),oklch(0.27 0 265));
--vibeui-commerce-059-accent:light-dark(oklch(0.55 0.15 39.8),oklch(0.74 0.13 39.8));
--vibeui-commerce-059-onaccent:oklch(0.15 0.02 39.8);
--vibeui-commerce-059-warn:light-dark(oklch(0.55 0.14 60),oklch(0.8 0.13 70));
--vibeui-commerce-059-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-059"]{color-scheme:dark}
[data-vibeui-block="commerce-059"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-059-bg);
color:var(--vibeui-commerce-059-fg);font-family:var(--vibeui-commerce-059-sans);
}
[data-vibeui-block="commerce-059"] *{box-sizing:border-box}
[data-vibeui-block="commerce-059"] [data-part="shell"]{max-width:64rem;margin:0 auto;padding:1.25rem 1rem 2rem;display:grid;gap:1.25rem;grid-template-columns:1fr}
[data-vibeui-block="commerce-059"] h2{margin:0 0 0.375rem;font-size:1.375rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-059"] [data-part="lead"]{margin:0 0 1.125rem;max-width:54ch;font-size:0.875rem;line-height:1.55;color:var(--vibeui-commerce-059-muted)}
[data-vibeui-block="commerce-059"] [data-part="sellers"]{list-style:none;margin:0;padding:0;display:grid;gap:0.875rem}
[data-vibeui-block="commerce-059"] [data-part="seller"]{border:1px solid var(--vibeui-commerce-059-border);border-radius:1rem;overflow:hidden}
[data-vibeui-block="commerce-059"] [data-part="head"]{
display:flex;flex-wrap:wrap;gap:0.375rem 0.75rem;align-items:baseline;justify-content:space-between;
padding:0.75rem 0.875rem;background:var(--vibeui-commerce-059-soft);border-bottom:1px solid var(--vibeui-commerce-059-border);
}
[data-vibeui-block="commerce-059"] h3{margin:0;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="commerce-059"] [data-part="rating"]{margin:0.125rem 0 0;font-size:0.75rem;color:var(--vibeui-commerce-059-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-059"] [data-part="terms"]{margin:0;text-align:right;font-size:0.75rem;line-height:1.45;color:var(--vibeui-commerce-059-muted)}
[data-vibeui-block="commerce-059"] [data-part="terms"] strong{display:block;color:var(--vibeui-commerce-059-fg);font-weight:650}
[data-vibeui-block="commerce-059"] [data-part="lines"]{list-style:none;margin:0;padding:0}
[data-vibeui-block="commerce-059"] [data-part="line"]{display:flex;gap:0.75rem;padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-commerce-059-border)}
[data-vibeui-block="commerce-059"] [data-part="thumb"]{
flex:none;width:3.25rem;height:3.25rem;border-radius:0.625rem;
background:linear-gradient(150deg,oklch(0.94 0.05 var(--vibeui-commerce-059-hue,260)),oklch(0.85 0.09 var(--vibeui-commerce-059-hue,260)));
}
[data-vibeui-block="commerce-059"] [data-part="ltexts"]{flex:1;min-width:0}
[data-vibeui-block="commerce-059"] [data-part="lname"]{margin:0;font-size:0.875rem;font-weight:650;line-height:1.35}
[data-vibeui-block="commerce-059"] [data-part="lspec"]{margin:0.125rem 0 0;font-size:0.75rem;color:var(--vibeui-commerce-059-muted)}
[data-vibeui-block="commerce-059"] [data-part="lcount"]{margin:0.25rem 0 0;font-size:0.75rem;color:var(--vibeui-commerce-059-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-059"] [data-part="lprice"]{margin:0;flex:none;font-size:0.9375rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-059"] [data-part="foot"]{
display:flex;flex-wrap:wrap;gap:0.5rem;align-items:baseline;justify-content:space-between;padding:0.6875rem 0.875rem;
font-size:0.8125rem;
}
[data-vibeui-block="commerce-059"] [data-part="foot"] strong{font-size:1rem;font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-059"] [data-part="warn"]{
margin:0;padding:0.5rem 0.875rem 0.75rem;font-size:0.75rem;line-height:1.45;color:var(--vibeui-commerce-059-warn);
}
[data-vibeui-block="commerce-059"] [data-part="panel"]{
border:1px solid var(--vibeui-commerce-059-border);border-radius:1rem;padding:1rem 1.125rem;align-self:start;
background:var(--vibeui-commerce-059-soft);
}
[data-vibeui-block="commerce-059"] h4{margin:0 0 0.625rem;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="commerce-059"] dl{margin:0;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:0.375rem 0.75rem;font-size:0.8125rem}
[data-vibeui-block="commerce-059"] [data-part="pair"]{display:contents}
[data-vibeui-block="commerce-059"] dt{color:var(--vibeui-commerce-059-muted);min-width:0}
[data-vibeui-block="commerce-059"] dd{margin:0;text-align:right;font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-059"] [data-part="total"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;margin:0.875rem 0 0;
padding-top:0.75rem;border-top:1px solid var(--vibeui-commerce-059-border);
}
[data-vibeui-block="commerce-059"] [data-part="total"] span:first-child{font-size:0.875rem;font-weight:650}
[data-vibeui-block="commerce-059"] [data-part="sum"]{font-size:1.5rem;font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-059"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;width:100%;height:2.875rem;margin-top:0.875rem;border-radius:0.875rem;
background:var(--vibeui-commerce-059-accent);color:var(--vibeui-commerce-059-onaccent);font:inherit;font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="commerce-059"] [data-part="go"]:focus-visible{outline:2px solid var(--vibeui-commerce-059-accent);outline-offset:2px}
[data-vibeui-block="commerce-059"] [data-part="note"]{margin:0.75rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-059-muted)}
@container (min-width: 32rem){
[data-vibeui-block="commerce-059"] [data-part="lname"]{font-size:0.9375rem}
}
@container (min-width: 50rem){
[data-vibeui-block="commerce-059"] [data-part="shell"]{padding:2rem 2rem 3rem;grid-template-columns:minmax(0,1fr) 19rem;gap:1.75rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-059"] *{animation:none!important;transition:none!important}}
`

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

const DEFAULT_SELLERS: Commerce059Seller[] = [
  {
    id: "1",
    name: "Мастерская «Плёс»",
    rating: "4,9 · 1 240 отзывов",
    shipping: "Доставка 0 ₽",
    eta: "12 марта",
    subtotal: "45 800 ₽",
    lines: [
      {
        id: "1",
        title: "Кресло «Хмарь»",
        spec: "Букле, песочный",
        price: "38 900 ₽",
        count: 1,
        hue: 75,
      },
      {
        id: "2",
        title: "Плед «Пасмурно»",
        spec: "Шерсть, 140×200 см",
        price: "6 900 ₽",
        count: 1,
        hue: 265,
      },
    ],
  },
  {
    id: "2",
    name: "Свет и провод",
    rating: "4,6 · 318 отзывов",
    shipping: "Доставка 490 ₽",
    eta: "15 марта",
    subtotal: "16 200 ₽",
    warning:
      "Продавец отправляет заказы по вторникам: если оформить в среду, посылка уедет через неделю.",
    lines: [
      {
        id: "1",
        title: "Торшер «Сумерки»",
        spec: "Тёплый свет 2700 K",
        price: "16 200 ₽",
        count: 1,
        hue: 150,
      },
    ],
  },
  {
    id: "3",
    name: "Керамика Ольги Т.",
    rating: "5,0 · 87 отзывов",
    shipping: "Доставка 350 ₽",
    eta: "18 марта",
    subtotal: "4 800 ₽",
    lines: [
      {
        id: "1",
        title: "Кружка «Затон»",
        spec: "Ручная работа, 350 мл",
        price: "2 400 ₽",
        count: 2,
        hue: 25,
      },
    ],
  },
]

/**
 * Корзина маркетплейса с несколькими продавцами: у каждой группы свои
 * условия и свой итог. Один файл, ноль зависимостей, палитра своя.
 */
export function Commerce059({
  title = "Корзина: три продавца",
  lead = "Заказ оплачивается один раз, но посылок будет три — у каждого продавца свои сроки, доставка и правила возврата.",
  sellers = DEFAULT_SELLERS,
  itemsLabel = "Товары",
  shippingLabel = "Доставка (3 посылки)",
  totalLabel = "К оплате",
  items = "66 800 ₽",
  shipping = "840 ₽",
  total = "67 640 ₽",
  cta = "Перейти к оформлению",
  note = "Возврат оформляется отдельно у каждого продавца: единой кнопки «вернуть весь заказ» не существует.",
  countLabel = "шт.",
  etaTemplate = "Приедет {date}",
  subtotalLabel = "Итого у продавца",
  summaryTitle = "Общий итог",
  accent,
  background = "",
  className,
  style,
}: Commerce059Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-059-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-059-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-059" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-059"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div>
            <h2>{title}</h2>
            <p data-part="lead">{lead}</p>

            <ul data-part="sellers">
              {sellers.map((seller) => (
                <li key={seller.id} data-part="seller">
                  <div data-part="head">
                    <div>
                      <h3>{seller.name}</h3>
                      <p data-part="rating">{seller.rating}</p>
                    </div>
                    <p data-part="terms">
                      <strong>{seller.shipping}</strong>
                      {etaTemplate.replace("{date}", seller.eta)}
                    </p>
                  </div>
                  <ul data-part="lines">
                    {seller.lines.map((line) => (
                      <li
                        key={line.id}
                        data-part="line"
                        style={
                          {
                            "--vibeui-commerce-059-hue": line.hue ?? 260,
                          } as CSSProperties
                        }
                      >
                        <span data-part="thumb" aria-hidden="true" />
                        <div data-part="ltexts">
                          <p data-part="lname">{line.title}</p>
                          <p data-part="lspec">{line.spec}</p>
                          <p data-part="lcount">
                            {line.count} {countLabel}
                          </p>
                        </div>
                        <p data-part="lprice">{line.price}</p>
                      </li>
                    ))}
                  </ul>
                  <div data-part="foot">
                    <span>{subtotalLabel}</span>
                    <strong>{seller.subtotal}</strong>
                  </div>
                  {seller.warning ? (
                    <p data-part="warn">{seller.warning}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          <aside data-part="panel">
            <h4>{summaryTitle}</h4>
            <dl>
              <div data-part="pair">
                <dt>{itemsLabel}</dt>
                <dd>{items}</dd>
              </div>
              <div data-part="pair">
                <dt>{shippingLabel}</dt>
                <dd>{shipping}</dd>
              </div>
            </dl>
            <p data-part="total">
              <span>{totalLabel}</span>
              <span data-part="sum">{total}</span>
            </p>
            <button type="button" data-part="go">
              {cta}
            </button>
            <p data-part="note">{note}</p>
          </aside>
        </div>
      </section>
    </>
  )
}

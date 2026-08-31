import type { CSSProperties } from "react"

export type Commerce001Product = {
  title: string
  brand?: string
  price: string
  oldPrice?: string
  rating?: number
  reviews?: number
  badge?: string
  hue?: number
}

export type Commerce001Props = {
  title?: string
  products?: Commerce001Product[]
  cta?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// container-type делает секцию собственным query-контейнером: число колонок
// считается от ширины блока, поэтому витрина верна и в узкой колонке каталога.
//
// Идея блока: витрина товаров. Кнопка «в корзину» — отдельная цель, а не часть
// растянутой ссылки: карточка ведёт на товар, кнопка кладёт в корзину, и эти
// два действия нельзя объединять. Старая цена помечена тегом <s> и подписью
// для скринридера — зачёркивание одним стилем не читается вслух. Рейтинг
// продублирован числом: звёзды без цифры не дают точности.
const STYLES = `
:where([data-vibeui-block="commerce-001"]){
--vibeui-commerce-001-bg:oklch(1 0 0);
--vibeui-commerce-001-fg:oklch(0.22 0.014 265);
--vibeui-commerce-001-muted:oklch(0.55 0.014 265);
--vibeui-commerce-001-border:oklch(0.91 0.006 265);
--vibeui-commerce-001-accent:oklch(0.55 0.2 262);
--vibeui-commerce-001-sale:oklch(0.56 0.19 25);
--vibeui-commerce-001-star:oklch(0.72 0.16 75);
--vibeui-commerce-001-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-001"]{
box-sizing:border-box;padding:1rem;
background:var(--vibeui-commerce-001-bg);
font-family:var(--vibeui-commerce-001-sans);color:var(--vibeui-commerce-001-fg);
}
[data-vibeui-block="commerce-001"] *{box-sizing:border-box}
[data-vibeui-block="commerce-001"] h2{margin:0 0 0.875rem;font-size:1.0625rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="commerce-001"] ul{
list-style:none;margin:0;padding:0;
display:grid;grid-template-columns:1fr;gap:0.75rem;
}
@container (min-width: 28rem){[data-vibeui-block="commerce-001"] ul{grid-template-columns:repeat(2,1fr)}}
@container (min-width: 46rem){[data-vibeui-block="commerce-001"] ul{grid-template-columns:repeat(3,1fr)}}
[data-vibeui-block="commerce-001"] [data-part="card"]{
position:relative;display:flex;flex-direction:column;overflow:hidden;
background:var(--vibeui-commerce-001-bg);
border:1px solid var(--vibeui-commerce-001-border);border-radius:0.875rem;
}
/* Обложка — цветное поле, а не картинка: блок не тянет чужие файлы. */
[data-vibeui-block="commerce-001"] [data-part="shot"]{
aspect-ratio:4 / 3;
background:
radial-gradient(120% 90% at 30% 20%, oklch(0.94 0.07 var(--vibeui-commerce-001-hue,262)), transparent 70%),
oklch(0.96 0.02 var(--vibeui-commerce-001-hue,262));
}
[data-vibeui-block="commerce-001"] [data-part="badge"]{
position:absolute;top:0.5rem;left:0.5rem;
padding:0.125rem 0.4375rem;border-radius:0.375rem;
background:var(--vibeui-commerce-001-sale);color:oklch(1 0 0);
font-size:0.625rem;font-weight:700;letter-spacing:0.02em;
}
[data-vibeui-block="commerce-001"] [data-part="body"]{
display:flex;flex-direction:column;gap:0.25rem;padding:0.625rem 0.75rem 0.75rem;
}
[data-vibeui-block="commerce-001"] [data-part="brand"]{font-size:0.6875rem;color:var(--vibeui-commerce-001-muted)}
[data-vibeui-block="commerce-001"] h3{margin:0;font-size:0.875rem;font-weight:600;line-height:1.3}
/* Карточка ведёт на товар, кнопка кладёт в корзину: две разные цели. */
[data-vibeui-block="commerce-001"] h3 a{color:inherit;text-decoration:none}
[data-vibeui-block="commerce-001"] h3 a::after{content:"";position:absolute;inset:0}
[data-vibeui-block="commerce-001"] [data-part="card"]:has(a:focus-visible){outline:2px solid var(--vibeui-commerce-001-accent);outline-offset:2px}
[data-vibeui-block="commerce-001"] [data-part="rating"]{
display:flex;align-items:center;gap:0.25rem;
font-size:0.6875rem;color:var(--vibeui-commerce-001-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="commerce-001"] [data-part="stars"]{color:var(--vibeui-commerce-001-star);letter-spacing:0.05em}
[data-vibeui-block="commerce-001"] [data-part="prices"]{
display:flex;align-items:baseline;gap:0.375rem;margin-top:0.125rem;
}
[data-vibeui-block="commerce-001"] [data-part="price"]{font-size:1rem;font-weight:700;font-variant-numeric:tabular-nums}
/* Старая цена: тег s и подпись — зачёркивание стилем вслух не читается. */
[data-vibeui-block="commerce-001"] s{font-size:0.75rem;color:var(--vibeui-commerce-001-muted)}
[data-vibeui-block="commerce-001"] [data-part="cart"]{
position:relative;z-index:1;margin-top:0.5rem;
appearance:none;cursor:pointer;height:2.125rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-commerce-001-accent);color:oklch(1 0 0);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="commerce-001"] [data-part="cart"]:focus-visible{outline:2px solid var(--vibeui-commerce-001-accent);outline-offset:2px}
[data-vibeui-block="commerce-001"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PRODUCTS: Commerce001Product[] = [
  {
    title: "Настольная лампа «Луч»",
    brand: "Свет и форма",
    price: "4 900 ₽",
    oldPrice: "6 400 ₽",
    rating: 4.8,
    reviews: 126,
    badge: "−23 %",
    hue: 75,
  },
  {
    title: "Кресло «Пикник»",
    brand: "Дом и сад",
    price: "18 400 ₽",
    rating: 4.6,
    reviews: 84,
    hue: 152,
  },
  {
    title: "Полка «Ступени»",
    brand: "Свет и форма",
    price: "7 200 ₽",
    rating: 4.9,
    reviews: 41,
    hue: 262,
  },
]

function stars(rating: number) {
  return "★★★★★".slice(0, Math.round(rating)).padEnd(5, "☆")
}

/**
 * Витрина товаров: карточка ведёт на товар, кнопка кладёт в корзину.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce001({
  title = "Хиты недели",
  products = DEFAULT_PRODUCTS,
  cta = "В корзину",
  accent,
  className,
  style,
}: Commerce001Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-001"
        className={className}
        style={palette}
        aria-label={title}
      >
        <h2>{title}</h2>
        <ul>
          {products.map((product) => (
            <li key={product.title}>
              <article
                data-part="card"
                style={
                  {
                    "--vibeui-commerce-001-hue": product.hue ?? 262,
                  } as CSSProperties
                }
              >
                <div data-part="shot" aria-hidden="true" />
                {product.badge ? (
                  <span data-part="badge">{product.badge}</span>
                ) : null}
                <div data-part="body">
                  {product.brand ? (
                    <span data-part="brand">{product.brand}</span>
                  ) : null}
                  <h3>
                    <a href="#">{product.title}</a>
                  </h3>
                  {product.rating ? (
                    <p data-part="rating">
                      <span data-part="stars" aria-hidden="true">
                        {stars(product.rating)}
                      </span>
                      {product.rating.toLocaleString("ru-RU")} ·{" "}
                      {product.reviews} отзывов
                    </p>
                  ) : null}
                  <p data-part="prices">
                    <span data-part="price">{product.price}</span>
                    {product.oldPrice ? (
                      <s>
                        <span data-part="sr">Старая цена </span>
                        {product.oldPrice}
                      </s>
                    ) : null}
                  </p>
                  <button type="button" data-part="cart">
                    {cta}
                    <span data-part="sr">: {product.title}</span>
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

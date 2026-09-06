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
  /** Подпись рейтинга: {count} — число отзывов. */
  reviewsText?: string
  /** Подпись старой цены для скринридера. */
  oldPriceLabel?: string
  /** Локаль форматирования рейтинга. */
  locale?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
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
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// по умолчанию нет, он лежит прямо на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="commerce-001"]){
--vibeui-commerce-001-bg:transparent;
--vibeui-commerce-001-card:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-commerce-001-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-commerce-001-muted:light-dark(oklch(0.55 0 265),oklch(0.71 0 265));
--vibeui-commerce-001-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-commerce-001-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-commerce-001-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0 262));
--vibeui-commerce-001-sale:light-dark(oklch(0.56 0.19 25),oklch(0.7 0.17 25));
--vibeui-commerce-001-on-sale:light-dark(oklch(1 0 0),oklch(0.19 0.02 25));
--vibeui-commerce-001-star:light-dark(oklch(0.72 0.16 75),oklch(0.82 0.15 75));
--vibeui-commerce-001-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-001"]{color-scheme:dark}
[data-vibeui-block="commerce-001"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
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
background:var(--vibeui-commerce-001-card);
border:1px solid var(--vibeui-commerce-001-border);border-radius:0.875rem;
}
/* Обложка — цветное поле, а не картинка: блок не тянет чужие файлы. */
[data-vibeui-block="commerce-001"] [data-part="shot"]{
aspect-ratio:4 / 3;
background:
radial-gradient(120% 90% at 30% 20%, light-dark(oklch(0.94 0.07 var(--vibeui-commerce-001-hue,262)),oklch(0.46 0.08 var(--vibeui-commerce-001-hue,262))), transparent 70%),
light-dark(oklch(0.96 0.02 var(--vibeui-commerce-001-hue,262)),oklch(0.34 0.03 var(--vibeui-commerce-001-hue,262)));
}
[data-vibeui-block="commerce-001"] [data-part="badge"]{
position:absolute;top:0.5rem;left:0.5rem;
padding:0.125rem 0.4375rem;border-radius:0.375rem;
background:var(--vibeui-commerce-001-sale);color:var(--vibeui-commerce-001-on-sale);
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
background:var(--vibeui-commerce-001-accent);color:var(--vibeui-commerce-001-on-accent);
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
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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
 * Витрина товаров: карточка ведёт на товар, кнопка кладёт в корзину.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce001({
  title = "Хиты недели",
  products = DEFAULT_PRODUCTS,
  cta = "В корзину",
  reviewsText = "{count} отзывов",
  oldPriceLabel = "Старая цена",
  locale = "ru-RU",
  accent,
  background = "",
  className,
  style,
}: Commerce001Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
                      {product.rating.toLocaleString(locale)} ·{" "}
                      {reviewsText.replace("{count}", String(product.reviews))}
                    </p>
                  ) : null}
                  <p data-part="prices">
                    <span data-part="price">{product.price}</span>
                    {product.oldPrice ? (
                      <s>
                        <span data-part="sr">{oldPriceLabel} </span>
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

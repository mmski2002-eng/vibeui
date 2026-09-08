import type { ComponentProps, CSSProperties } from "react"

export type Card004Props = Omit<
  ComponentProps<"article">,
  "children" | "title"
> & {
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  title?: string
  price?: string
  oldPrice?: string
  rating?: number
  reviews?: number
  badge?: string
  href?: string
  actionLabel?: string
  /** Подпись рейтинга для скринридера: {rating} и {reviews} — числа. */
  ratingLabel?: string
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: карточка товара для сетки магазина. Кнопка «в корзину» —
// отдельная цель поверх ссылки на товар: если сделать кликабельной всю
// карточку, добавление в корзину начнёт открывать страницу. Рейтинг подписан
// числом, а не только звёздами: «4,7 из 5» точнее, чем закрашенные фигуры.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте рамка и кадр светлее подложки, а не темнее.
const STYLES = `
:where([data-vibeui-block="card-004"]){
--vibeui-card-004-bg:transparent;
--vibeui-card-004-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-card-004-muted:color-mix(in oklab,var(--vibeui-card-004-fg) 68%,transparent);
--vibeui-card-004-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-card-004-frame:light-dark(oklch(0.96 0 265),oklch(0.3 0 265));
--vibeui-card-004-frame-light:light-dark(oklch(1 0 0),oklch(0.38 0 265));
--vibeui-card-004-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.74 0.15 39.8));
--vibeui-card-004-on-accent:light-dark(oklch(0.99 0 265),oklch(0.18 0 265));
--vibeui-card-004-sale:light-dark(oklch(0.56 0.19 39.8),oklch(0.68 0.18 39.8));
--vibeui-card-004-on-sale:light-dark(oklch(0.99 0.01 25),oklch(0.16 0.02 25));
--vibeui-card-004-star:light-dark(oklch(0.72 0.15 80),oklch(0.82 0.15 80));
--vibeui-card-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-004"]{color-scheme:dark}
[data-vibeui-block="card-004"]{
position:relative;display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:15rem;box-sizing:border-box;padding:0.75rem;
background:var(--vibeui-card-004-bg);
border:1px solid var(--vibeui-card-004-border);border-radius:0.875rem;
color:var(--vibeui-card-004-fg);font-family:var(--vibeui-card-004-font);
}
[data-vibeui-block="card-004"] [data-part="frame"]{
position:relative;aspect-ratio:1 / 1;overflow:hidden;
border-radius:0.625rem;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="card-004"] [data-part="frame"][data-empty="true"]{background:
radial-gradient(90% 80% at 30% 20%,var(--vibeui-card-004-frame-light),transparent 70%),
var(--vibeui-card-004-frame);}
[data-vibeui-block="card-004"] [data-part="frame"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="card-004"] img{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="card-004"] [data-part="badge"]{
position:absolute;left:0.5rem;top:0.5rem;
padding:0.1875rem 0.4375rem;border-radius:0.375rem;
background:var(--vibeui-card-004-sale);color:var(--vibeui-card-004-on-sale);
font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="card-004"] [data-part="title"]{
margin:0;font-size:0.875rem;font-weight:600;line-height:1.35;
display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
}
[data-vibeui-block="card-004"] a{color:inherit;text-decoration:none}
/* Ссылка растянута на карточку, но кнопка лежит выше по z-index: иначе
   «в корзину» начнёт открывать страницу товара. */
[data-vibeui-block="card-004"] a::after{content:"";position:absolute;inset:0;border-radius:inherit}
[data-vibeui-block="card-004"]:has(a:focus-visible){outline:2px solid var(--vibeui-card-004-accent);outline-offset:2px}
[data-vibeui-block="card-004"] [data-part="rating"]{
display:flex;align-items:center;gap:0.25rem;
font-size:0.75rem;color:var(--vibeui-card-004-muted);
}
[data-vibeui-block="card-004"] [data-part="star"]{
width:0.6875rem;height:0.6875rem;flex:none;background:var(--vibeui-card-004-star);
clip-path:polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);
}
[data-vibeui-block="card-004"] [data-part="prices"]{display:flex;align-items:baseline;gap:0.4375rem}
[data-vibeui-block="card-004"] [data-part="price"]{font-size:1rem;font-weight:680;font-variant-numeric:tabular-nums}
[data-vibeui-block="card-004"] [data-part="old"]{
font-size:0.8125rem;color:var(--vibeui-card-004-muted);
text-decoration:line-through;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="card-004"] button{
position:relative;z-index:1;appearance:none;cursor:pointer;
height:2.125rem;border:0;border-radius:0.5rem;
background:var(--vibeui-card-004-accent);color:var(--vibeui-card-004-on-accent);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="card-004"] button:hover{filter:brightness(0.96)}
[data-vibeui-block="card-004"] button:focus-visible{outline:2px solid var(--vibeui-card-004-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-004"] *{animation:none!important;transition:none!important}}
`

const RATING_LABEL = "Рейтинг {rating} из 5, отзывов: {reviews}"

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
 * Карточка товара: кнопка в корзину — отдельная цель поверх ссылки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Card004({
  title = "Настольная лампа «Полёт», тёплый свет",
  image = "",
  price = "4 900 ₽",
  oldPrice = "6 900 ₽",
  rating = 4.7,
  reviews = 128,
  badge = "−30 %",
  href = "#",
  actionLabel = "В корзину",
  ratingLabel = RATING_LABEL,
  background = "",
  accent,
  className,
  style,
  ...props
}: Card004Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-card-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-004" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-slot="card"
        data-vibeui-block="card-004"
        className={className}
        style={palette}
      >
        <div data-part="frame" data-empty={image ? undefined : "true"}>
          {image ? (
            <img src={image} alt="" loading="lazy" decoding="async" />
          ) : null}
          {badge ? <span data-part="badge">{badge}</span> : null}
        </div>
        <h3 data-part="title">
          <a href={href}>{title}</a>
        </h3>
        <p
          data-part="rating"
          aria-label={ratingLabel
            .replace("{rating}", String(rating))
            .replace("{reviews}", String(reviews))}
        >
          <span data-part="star" aria-hidden="true" />
          <span aria-hidden="true">
            {rating} · {reviews}
          </span>
        </p>
        <p data-part="prices">
          <span data-part="price">{price}</span>
          {oldPrice ? <span data-part="old">{oldPrice}</span> : null}
        </p>
        <button type="button">{actionLabel}</button>
      </article>
    </>
  )
}

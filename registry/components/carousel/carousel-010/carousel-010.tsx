"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Carousel010Product = {
  title: string
  price: string
  oldPrice?: string
  rating?: number
  hue?: number
}

export type Carousel010Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  products?: Carousel010Product[]
  title?: string
  accent?: string
}

// Идея компонента: витрина товаров, где следующая карточка выглядывает из-за
// края, а стрелки честно гаснут на концах ленты. Отключённая стрелка — это
// ответ на вопрос «дальше есть что-нибудь»: без него пользователь жмёт в
// пустоту. Шаг прокрутки равен ширине карточки с зазором, поэтому лента
// останавливается ровно на карточке, а не в середине.
const STYLES = `
:where([data-vibeui-block="carousel-010"]){
--vibeui-carousel-010-bg:oklch(1 0 0);
--vibeui-carousel-010-fg:oklch(0.22 0.014 265);
--vibeui-carousel-010-muted:oklch(0.58 0.014 265);
--vibeui-carousel-010-border:oklch(0.91 0.006 265);
--vibeui-carousel-010-accent:oklch(0.55 0.19 25);
--vibeui-carousel-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="carousel-010"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:30rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-carousel-010-bg);
border:1px solid var(--vibeui-carousel-010-border);border-radius:1rem;
font-family:var(--vibeui-carousel-010-font);color:var(--vibeui-carousel-010-fg);
}
[data-vibeui-block="carousel-010"] [data-part="head"]{display:flex;align-items:center;justify-content:space-between;gap:0.75rem}
[data-vibeui-block="carousel-010"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="carousel-010"] [data-part="nav"]{display:flex;gap:0.375rem}
[data-vibeui-block="carousel-010"] [data-part="nav"] button{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;padding:0;
border:1px solid var(--vibeui-carousel-010-border);border-radius:0.5rem;
background:var(--vibeui-carousel-010-bg);color:var(--vibeui-carousel-010-fg);
}
[data-vibeui-block="carousel-010"] [data-part="nav"] button:hover:not(:disabled){background:oklch(0.96 0.004 265)}
[data-vibeui-block="carousel-010"] [data-part="nav"] button:focus-visible{outline:2px solid var(--vibeui-carousel-010-accent);outline-offset:2px}
/* Гаснущая стрелка отвечает «дальше пусто» до нажатия, а не после. */
[data-vibeui-block="carousel-010"] [data-part="nav"] button:disabled{cursor:not-allowed;opacity:.35}
[data-vibeui-block="carousel-010"] [data-part="nav"] svg{width:0.875rem;height:0.875rem;display:block}
[data-vibeui-block="carousel-010"] [data-part="rail"]{
display:flex;gap:0.625rem;margin:0;padding:0 0 0.25rem;list-style:none;
overflow-x:auto;overscroll-behavior-x:contain;
scroll-snap-type:x mandatory;scroll-behavior:smooth;scrollbar-width:none;
}
[data-vibeui-block="carousel-010"] [data-part="rail"]::-webkit-scrollbar{display:none}
/* Карточка занимает меньше половины ширины: соседняя обязана выглядывать. */
[data-vibeui-block="carousel-010"] [data-part="card"]{
flex:0 0 44%;min-width:0;scroll-snap-align:start;
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="carousel-010"] [data-part="shot"]{
position:relative;aspect-ratio:4 / 3;border-radius:0.75rem;overflow:hidden;
background:
radial-gradient(85% 80% at 25% 20%,oklch(0.93 0.05 var(--vibeui-carousel-010-hue,250)),transparent 70%),
linear-gradient(150deg,oklch(0.84 0.07 var(--vibeui-carousel-010-hue,250)),oklch(0.6 0.09 var(--vibeui-carousel-010-hue,250)));
}
[data-vibeui-block="carousel-010"] [data-part="sale"]{
position:absolute;left:0.375rem;top:0.375rem;
padding:0.0625rem 0.375rem;border-radius:9999px;
background:var(--vibeui-carousel-010-accent);color:oklch(1 0 0);
font-size:0.625rem;font-weight:700;
}
[data-vibeui-block="carousel-010"] [data-part="name"]{font-size:0.8125rem;font-weight:600;line-height:1.3}
[data-vibeui-block="carousel-010"] [data-part="row"]{display:flex;align-items:baseline;gap:0.375rem}
[data-vibeui-block="carousel-010"] [data-part="price"]{font-size:0.875rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="carousel-010"] [data-part="old"]{font-size:0.75rem;color:var(--vibeui-carousel-010-muted);text-decoration:line-through}
[data-vibeui-block="carousel-010"] [data-part="rating"]{
margin-left:auto;font-size:0.6875rem;color:var(--vibeui-carousel-010-muted);
font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="carousel-010"] [data-part="rail"]{scroll-behavior:auto}
[data-vibeui-block="carousel-010"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_PRODUCTS: Carousel010Product[] = [
  {
    title: "Кофемолка ручная",
    price: "4 290 ₽",
    oldPrice: "5 900 ₽",
    rating: 4.8,
    hue: 40,
  },
  { title: "Чайник на 1,2 л", price: "3 150 ₽", rating: 4.6, hue: 200 },
  {
    title: "Френч-пресс стеклянный",
    price: "1 890 ₽",
    oldPrice: "2 400 ₽",
    rating: 4.4,
    hue: 150,
  },
  { title: "Весы кухонные", price: "2 750 ₽", rating: 4.9, hue: 280 },
  { title: "Термос 0,5 л", price: "2 190 ₽", rating: 4.5, hue: 20 },
]

/**
 * Витрина товаров с выглядывающей карточкой и стрелками, гаснущими на краях.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Carousel010({
  products = DEFAULT_PRODUCTS,
  title = "Часто покупают",
  accent,
  className,
  style,
  ...props
}: Carousel010Props) {
  const rail = useRef<HTMLUListElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  function measure() {
    const node = rail.current
    if (!node) return
    const rest = node.scrollWidth - node.clientWidth - node.scrollLeft
    setEdge({ start: node.scrollLeft <= 1, end: rest <= 1 })
  }

  useEffect(measure, [products])

  function step(direction: 1 | -1) {
    const node = rail.current
    if (!node) return
    const card = node.querySelector("[data-part='card']") as HTMLElement | null
    const width = card ? card.offsetWidth + 10 : node.clientWidth
    node.scrollBy({ left: width * direction })
  }

  const palette = {
    ...(accent ? { "--vibeui-carousel-010-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-carousel-010" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="carousel-010"
        aria-roledescription="карусель"
        aria-label={title}
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3 data-part="title">{title}</h3>
          <div data-part="nav">
            <button
              type="button"
              aria-label="Предыдущие товары"
              disabled={edge.start}
              onClick={() => step(-1)}
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor">
                <path
                  d="M10 3 5 8l5 5"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Следующие товары"
              disabled={edge.end}
              onClick={() => step(1)}
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor">
                <path
                  d="m6 3 5 5-5 5"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <ul data-part="rail" ref={rail} onScroll={measure}>
          {products.map((product) => (
            <li
              data-part="card"
              key={product.title}
              style={
                {
                  "--vibeui-carousel-010-hue": product.hue ?? 250,
                } as CSSProperties
              }
            >
              <div data-part="shot">
                {product.oldPrice ? <span data-part="sale">скидка</span> : null}
              </div>
              <span data-part="name">{product.title}</span>
              <span data-part="row">
                <span data-part="price">{product.price}</span>
                {product.oldPrice ? (
                  <span data-part="old">{product.oldPrice}</span>
                ) : null}
                {product.rating ? (
                  <span data-part="rating">★ {product.rating.toFixed(1)}</span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

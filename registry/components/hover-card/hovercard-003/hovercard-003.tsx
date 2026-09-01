import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Hovercard003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  name?: string
  price?: string
  oldPrice?: string
  /** Наличие: строка показывается цветом и словом, не только цветом. */
  stock?: string
  rating?: number
  reviews?: number
}

// Идея компонента: карточка товара у названия в тексте. Главное здесь цена и
// наличие, поэтому они стоят выше отзывов; рейтинг нарисован звёздами через
// линейный градиент по ширине, а не набором символов — дробная оценка честнее.
const STYLES = `
:where([data-vibeui-block="hovercard-003"]){
--vibeui-hovercard-003-bg:oklch(1 0 0);
--vibeui-hovercard-003-fg:oklch(0.22 0.014 265);
--vibeui-hovercard-003-muted:oklch(0.55 0.014 265);
--vibeui-hovercard-003-border:oklch(0.9 0.006 265);
--vibeui-hovercard-003-accent:oklch(0.55 0.17 265);
--vibeui-hovercard-003-star:oklch(0.78 0.15 80);
--vibeui-hovercard-003-ok:oklch(0.52 0.14 152);
--vibeui-hovercard-003-rating:0;
--vibeui-hovercard-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="hovercard-003"]{
width:100%;max-width:28rem;box-sizing:border-box;
padding:1rem 1.125rem;
border:1px solid var(--vibeui-hovercard-003-border);border-radius:0.875rem;
background:var(--vibeui-hovercard-003-bg);
font-family:var(--vibeui-hovercard-003-font);color:var(--vibeui-hovercard-003-fg);
}
[data-vibeui-block="hovercard-003"] [data-part="line"]{margin:0;font-size:0.875rem;line-height:1.7}
/* Карточка цепляется к названию товара в строке, а не к абзацу целиком. */
[data-vibeui-block="hovercard-003"] [data-part="host"]{position:relative;display:inline-block}
[data-vibeui-block="hovercard-003"] [data-part="link"]{
color:var(--vibeui-hovercard-003-accent);font-weight:620;
text-decoration:underline;text-decoration-style:dotted;text-underline-offset:0.2em;
border-radius:0.25rem;
}
[data-vibeui-block="hovercard-003"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-hovercard-003-accent);outline-offset:2px}
[data-vibeui-block="hovercard-003"] [data-part="card"]{
position:absolute;left:0;top:calc(100% + 0.5rem);z-index:20;
display:grid;grid-template-columns:3.5rem 1fr;gap:0.125rem 0.75rem;
width:17rem;box-sizing:border-box;padding:0.8125rem;
border:1px solid var(--vibeui-hovercard-003-border);border-radius:0.875rem;
background:var(--vibeui-hovercard-003-bg);
box-shadow:0 22px 46px -28px oklch(0.2 0.02 265 / 55%);
opacity:0;visibility:hidden;translate:0 -0.25rem;
transition:opacity .15s ease,translate .15s ease,visibility .15s;
}
[data-vibeui-block="hovercard-003"] [data-part="host"]:hover [data-part="card"],
[data-vibeui-block="hovercard-003"] [data-part="host"]:focus-within [data-part="card"]{opacity:1;visibility:visible;translate:0 0}
[data-vibeui-block="hovercard-003"] [data-part="thumb"]{
grid-row:1 / span 3;
display:flex;align-items:center;justify-content:center;
width:3.5rem;height:3.5rem;border-radius:0.625rem;
background:linear-gradient(140deg,oklch(0.93 0.03 265),oklch(0.87 0.05 250));
color:oklch(0.42 0.08 260);font-size:1.25rem;
}
[data-vibeui-block="hovercard-003"] [data-part="name"]{font-size:0.8125rem;font-weight:650;line-height:1.3}
[data-vibeui-block="hovercard-003"] [data-part="prices"]{display:flex;align-items:baseline;gap:0.4375rem;margin-top:0.125rem}
[data-vibeui-block="hovercard-003"] [data-part="price"]{font-size:1rem;font-weight:750;letter-spacing:-0.01em;font-variant-numeric:tabular-nums}
[data-vibeui-block="hovercard-003"] [data-part="old"]{font-size:0.75rem;color:var(--vibeui-hovercard-003-muted);text-decoration:line-through}
[data-vibeui-block="hovercard-003"] [data-part="stock"]{
margin-top:0.1875rem;font-size:0.75rem;font-weight:620;color:var(--vibeui-hovercard-003-ok);
}
[data-vibeui-block="hovercard-003"] [data-part="rating"]{
grid-column:1 / -1;display:flex;align-items:center;gap:0.4375rem;
margin-top:0.5rem;padding-top:0.5rem;
border-top:1px solid var(--vibeui-hovercard-003-border);
font-size:0.75rem;color:var(--vibeui-hovercard-003-muted);
}
/* Звёзды залиты градиентом по доле оценки: 4,3 видно как 4,3, а не как 4. */
[data-vibeui-block="hovercard-003"] [data-part="stars"]{
position:relative;flex:none;font-size:0.8125rem;line-height:1;letter-spacing:0.08em;
color:oklch(0.88 0.02 80);
}
[data-vibeui-block="hovercard-003"] [data-part="stars"]::before{
content:"★★★★★";
background:linear-gradient(90deg,
var(--vibeui-hovercard-003-star) calc(var(--vibeui-hovercard-003-rating) * 20%),
oklch(0.88 0.02 80) calc(var(--vibeui-hovercard-003-rating) * 20%));
-webkit-background-clip:text;background-clip:text;color:transparent;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hovercard-003"] *{animation:none!important;transition:none!important}}
`

/**
 * Карточка товара у названия в тексте: цена, наличие и дробный рейтинг.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Hovercard003({
  name = "Механическая клавиатура Kite 68",
  price = "8 940 ₽",
  oldPrice = "11 200 ₽",
  stock = "На складе, доставка завтра",
  rating = 4.3,
  reviews = 218,
  className,
  style,
  ...props
}: Hovercard003Props) {
  const palette = {
    "--vibeui-hovercard-003-rating": Math.min(5, Math.max(0, rating)),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hovercard-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="hovercard-003"
        className={className}
        style={palette}
      >
        <p data-part="line">
          В подборку вошла{" "}
          <span data-part="host">
            <a
              data-part="link"
              href="#product"
              aria-describedby="vibeui-hovercard-003-card"
            >
              {name}
            </a>
            <span
              data-part="card"
              id="vibeui-hovercard-003-card"
              role="tooltip"
            >
              <span data-part="thumb" aria-hidden="true">
                ⌨
              </span>
              <span data-part="name">{name}</span>
              <span data-part="prices">
                <span data-part="price">{price}</span>
                {oldPrice ? <span data-part="old">{oldPrice}</span> : null}
              </span>
              <span data-part="stock">{stock}</span>
              <span data-part="rating">
                <span data-part="stars" aria-hidden="true" />
                {rating.toLocaleString("ru-RU")} · {reviews} отзывов
              </span>
            </span>
          </span>{" "}
          — цену и наличие видно, не уходя со страницы.
        </p>
      </div>
    </>
  )
}

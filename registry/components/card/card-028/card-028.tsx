import type { ComponentProps, CSSProperties } from "react"

export type Card028Props = Omit<ComponentProps<"figure">, "title" | "children"> & {
  title?: string
  rating?: number
  date?: string
  quote?: string
  name?: string
  ratingLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function starState(index: number, rating: number) {
  if (rating >= index + 1) {
    return "full"
  }

  return rating > index ? "half" : "empty"
}

// Часть блока testimonials-005, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-028"]){
--vibeui-card-028-accent:light-dark(oklch(0.335 0 0),oklch(0.914 0 0));
--vibeui-card-028-border:light-dark(oklch(0.9 0.01 85),oklch(0.35 0.014 85));
--vibeui-card-028-card:light-dark(oklch(1 0 0),oklch(0.25 0.014 80));
--vibeui-card-028-empty:light-dark(oklch(0.88 0.01 85),oklch(0.4 0.014 85));
--vibeui-card-028-muted:light-dark(oklch(0.49 0.016 80),oklch(0.72 0.014 85));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-028"]{color-scheme:dark}
[data-vibeui-block="card-028"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="card-028"] *{box-sizing:border-box}
[data-vibeui-block="card-028"] [data-part="stars"]{display:inline-flex;gap:0.125rem;}
[data-vibeui-block="card-028"] [data-part="star"]{width:1rem;height:1rem;flex:none;
clip-path:polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);
background:var(--vibeui-card-028-empty);}
[data-vibeui-block="card-028"] [data-part="star"][data-filled="full"]{background:var(--vibeui-card-028-accent);color:oklch(from var(--vibeui-card-028-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="card-028"] [data-part="star"][data-filled="half"]{background:linear-gradient(90deg,var(--vibeui-card-028-accent) 50%,var(--vibeui-card-028-empty) 50%);}
[data-vibeui-block="card-028"]{margin:0;padding:1.375rem;
border:1px solid var(--vibeui-card-028-border);border-radius:1rem;
background:var(--vibeui-card-028-card);}
[data-vibeui-block="card-028"] [data-part="card-head"]{display:flex;align-items:center;gap:0.625rem;margin-bottom:0.625rem;}
[data-vibeui-block="card-028"] [data-part="date"]{margin-left:auto;color:var(--vibeui-card-028-muted);font-size:0.75rem}
[data-vibeui-block="card-028"] [data-part="card-title"]{margin:0 0 0.375rem;font-size:1rem;font-weight:660;line-height:1.35;}
[data-vibeui-block="card-028"] [data-part="quote"]{margin:0 0 0.875rem;color:var(--vibeui-card-028-muted);font-size:0.9375rem;line-height:1.6;}
[data-vibeui-block="card-028"] [data-part="name"]{font-size:0.8125rem;font-weight:620}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-028"] *{animation:none!important;transition:none!important}}
`

/** Карточка отзыва с заголовком и рядом звёзд в шапке, цитатой и подписью автора: рейтинг продублирован числом для скринридера. */
export function Card028({
  title = "Приехало раньше срока",
  rating = 5,
  date = "12 марта",
  quote = "Заказывала в пятницу вечером, привезли в субботу днём. Упаковано плотно, ничего не помялось, курьер дождался, пока проверю.",
  name = "Наталья В.",
  ratingLabel = "Оценка {value} из 5",
  accent,
  className,
  style,
  ...props
}: Card028Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-028-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-028" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="card"
        data-vibeui-block="card-028"
        className={className}
        style={palette}
      >
        <div data-part="card-head">
          <span
            data-part="stars"
            role="img"
            aria-label={ratingLabel.replace(
              "{value}",
              String(rating),
            )}
          >
            {[0, 1, 2, 3, 4].map((index) => (
              <span
                key={index}
                data-part="star"
                data-filled={starState(index, rating)}
              />
            ))}
          </span>
          <span data-part="date">{date}</span>
        </div>
        <p data-part="card-title">{title}</p>
        <blockquote data-part="quote">{quote}</blockquote>
        <figcaption data-part="name">{name}</figcaption>
      </figure>
    </>
  )
}

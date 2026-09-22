import type { ComponentProps, CSSProperties } from "react"

export type Card109Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  name?: string
  image?: string
  imageAlt?: string
  after?: string
  quote?: string
  meta?: string
  rating?: number
  ratingLine?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока testimonials-019, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-109"]){
--vibeui-card-109-accent:#ff2bd6;
--vibeui-card-109-card:#110e1a;
--vibeui-card-109-cyan:#22f3ff;
--vibeui-card-109-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-109-line:rgb(255 255 255 / .12);
--vibeui-card-109-mono:"JetBrains Mono",ui-monospace,monospace;
--vibeui-card-109-muted:#a39bb5;
}
[data-vibeui-block="card-109"]{box-sizing:border-box}
[data-vibeui-block="card-109"] *{box-sizing:border-box}
[data-vibeui-block="card-109"]:focus-visible{outline:2px solid var(--vibeui-card-109-cyan);outline-offset:3px}
[data-vibeui-block="card-109"]{position:absolute;left:50%;top:0;width:min(22rem,86cqi);margin-left:calc(min(22rem,86cqi) / -2);display:flex;flex-direction:column;gap:.9rem;padding:1rem;border:1px solid color-mix(in oklab,var(--vibeui-card-109-accent) 45%,transparent);border-radius:1rem;background:var(--vibeui-card-109-card);color:inherit;font:inherit;text-align:left;cursor:pointer;transform:translateX(calc(var(--vibeui-testimonials-019-d) * 60%)) translateZ(calc(var(--vibeui-testimonials-019-abs) * -14rem)) rotateY(calc(var(--vibeui-testimonials-019-d) * -28deg));opacity:calc(1 - var(--vibeui-testimonials-019-abs) * .35);filter:brightness(calc(1 - var(--vibeui-testimonials-019-abs) * .35));z-index:calc(10 - var(--vibeui-testimonials-019-abs));transition:transform .7s cubic-bezier(.2,.8,.2,1),opacity .7s,filter .7s;box-shadow:0 0 0 1px rgb(0 0 0 / .4),0 30px 60px -30px rgb(0 0 0 / .8)}
[data-vibeui-block="card-109"][data-active="true"]{cursor:default;box-shadow:0 0 0 1px rgb(0 0 0 / .4),0 0 30px color-mix(in oklab,var(--vibeui-card-109-accent) 40%,transparent),0 30px 60px -30px rgb(0 0 0 / .8)}
[data-vibeui-block="card-109"][data-hidden="true"]{opacity:0;pointer-events:none}
[data-vibeui-block="card-109"] [data-part="photo"]{position:relative;aspect-ratio:4/3;overflow:hidden;border-radius:.6rem;background:#1a1526}
[data-vibeui-block="card-109"] [data-part="photo"] img{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="card-109"] [data-part="after"]{position:absolute;left:.6rem;bottom:.6rem;padding:.25rem .6rem;border-radius:.35rem;background:rgb(7 6 11 / .75);border:1px solid color-mix(in oklab,var(--vibeui-card-109-cyan) 60%,transparent);font-family:var(--vibeui-card-109-mono);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-card-109-cyan)}
[data-vibeui-block="card-109"] [data-part="quote"]{margin:0;font-size:.95rem;line-height:1.5}
[data-vibeui-block="card-109"] [data-part="who"]{display:flex;align-items:center;justify-content:space-between;gap:.75rem;margin-top:auto;padding-top:.75rem;border-top:1px solid var(--vibeui-card-109-line)}
[data-vibeui-block="card-109"] [data-part="name"]{display:block;font-family:var(--vibeui-card-109-display);font-size:.95rem;font-weight:600}
[data-vibeui-block="card-109"] [data-part="meta"]{display:block;font-size:.78rem;color:var(--vibeui-card-109-muted)}
[data-vibeui-block="card-109"] [data-part="stars"]{font-size:.85rem;letter-spacing:.1em;color:var(--vibeui-card-109-accent);text-shadow:0 0 8px var(--vibeui-card-109-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-109"] *{animation:none!important;transition:none!important}}
`

/** Кнопка-карточка объёмной карусели: фото с бейджем «после», цитата, имя, подпись и звёзды; положение через переменные. */
export function Card109({
  name = "Илья",
  image,
  imageAlt,
  after,
  quote = "Марк переспросил три раза, где будет проходить рукав рубашки. Через два года лев смотрится так, будто сделан вчера.",
  meta,
  rating,
  ratingLine = "{n} из 5",
  accent,
  className,
  style,
  ...props
}: Card109Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-109-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-109" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="card"
        data-vibeui-block="card-109"
        type="button"
        className={className}
        style={palette}
      >
        {image ? (
          <span data-part="photo">
            <img src={image} alt={imageAlt ?? ""} loading="lazy" />
            {after ? <span data-part="after">{after}</span> : null}
          </span>
        ) : null}
        <p data-part="quote">«{quote}»</p>
        <span data-part="who">
          <span>
            <span data-part="name">{name}</span>
            {meta ? <span data-part="meta">{meta}</span> : null}
          </span>
          {rating ? (
            <span data-part="stars" aria-label={ratingLine.replace("{n}", String(rating))}>
              {"★".repeat(rating)}
            </span>
          ) : null}
        </span>
      </button>
    </>
  )
}

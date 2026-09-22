import type { ComponentProps, CSSProperties } from "react"

export type Card033Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  deal?: string
  rating?: number
  quote?: string
  image?: string
  source?: string
  ratingLabel?: string
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока testimonials-016, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-033"]){
--vibeui-card-033-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-033-card:light-dark(#fffdf9,#242424);
--vibeui-card-033-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-card-033-line:color-mix(in oklab,var(--vibeui-card-033-fg) 14%,var(--vibeui-card-033-bg));
--vibeui-card-033-muted:color-mix(in oklab,var(--vibeui-card-033-fg) 62%,var(--vibeui-card-033-bg));
--vibeui-card-033-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-033-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-033"]{color-scheme:dark}
[data-vibeui-block="card-033"]{box-sizing:border-box;min-width:min(100%,12rem);list-style:none}
[data-vibeui-block="card-033"] *{box-sizing:border-box}
@keyframes vibeui-card-033-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
[data-vibeui-block="card-033"]{position:relative;display:flex;flex-direction:column;gap:1rem;padding:1.5rem 1.5rem 1.25rem;border-radius:1rem;background:var(--vibeui-card-033-card);border:1px solid var(--vibeui-card-033-line);animation:vibeui-card-033-in .6s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-card-033-n) * 90ms)}
[data-vibeui-block="card-033"] [data-part="mark"]{position:absolute;top:.4rem;right:1rem;font-family:var(--vibeui-card-033-display);font-size:5rem;line-height:1;color:var(--vibeui-card-033-accent);opacity:.35;pointer-events:none}
[data-vibeui-block="card-033"] [data-part="stars"]{display:flex;gap:.15rem;color:var(--vibeui-card-033-accent);font-size:.9rem;letter-spacing:.05em}
[data-vibeui-block="card-033"] [data-part="quote"]{margin:0;font-family:var(--vibeui-card-033-display);font-size:1.35rem;font-weight:500;line-height:1.3;font-style:italic}
[data-vibeui-block="card-033"] [data-part="who"]{display:flex;align-items:center;gap:.75rem;margin-top:auto;padding-top:1rem;border-top:1px solid var(--vibeui-card-033-line)}
[data-vibeui-block="card-033"] [data-part="who"] img{width:2.5rem;height:2.5rem;border-radius:50%;object-fit:cover;flex:none;background:light-dark(#e7dfd2,#2a2a2a)}
[data-vibeui-block="card-033"] [data-part="who"] b{display:block;font-size:.9rem}
[data-vibeui-block="card-033"] [data-part="who"] span{display:block;font-size:.8rem;color:var(--vibeui-card-033-muted)}
[data-vibeui-block="card-033"] [data-part="source"]{margin-left:auto;flex:none;padding:.25rem .6rem;border:1px solid var(--vibeui-card-033-line);border-radius:999px;font-size:.7rem;font-weight:600;color:var(--vibeui-card-033-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-033"] *{animation:none!important;transition:none!important}}
`

/** Карточка отзыва о сделке: кавычка-марка, цитата, имя и тип сделки подписью, порядковый сдвиг анимации через переменную. */
export function Card033({
  name = "Анна",
  deal = "купила трёшку в центре",
  rating,
  quote = "Квартира была с долгом по капремонту и прописанным родственником. Андрей всё вычистил до сделки, мы ничего не заметили.",
  image,
  source,
  ratingLabel = "Оценка {n} из 5",
  index = 0,
  accent,
  className,
  style,
  ...props
}: Card033Props) {
  const palette = {
    "--vibeui-card-033-n": index,
    ...(accent ? { "--vibeui-card-033-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-033" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-033"
        className={className}
        style={palette}
      >
        <span data-part="mark" aria-hidden="true">
          ”
        </span>
        {rating ? (
          <span data-part="stars" aria-label={ratingLabel.replace("{n}", String(rating))}>
            {"★".repeat(Math.max(0, Math.min(5, Math.round(rating))))}
          </span>
        ) : null}
        <blockquote data-part="quote">{quote}</blockquote>
        <div data-part="who">
          {image ? <img src={image} alt="" loading="lazy" /> : null}
          <div>
            <b>{name}</b>
            <span>{deal}</span>
          </div>
          {source ? <span data-part="source">{source}</span> : null}
        </div>
      </li>
    </>
  )
}

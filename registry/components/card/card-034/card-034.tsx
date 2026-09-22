import type { ComponentProps, CSSProperties } from "react"

export type Card034Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  quote?: string
  rating?: number
  occasion?: string
  source?: string
  ratingLabel?: string
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока testimonials-017, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-034"]){
--vibeui-card-034-accent-ink:color-mix(in oklab,var(--vibeui-card-034-accent) 55%,var(--vibeui-card-034-fg));
--vibeui-card-034-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-card-034-glass:color-mix(in oklab,var(--vibeui-card-034-bg) 55%,transparent);
--vibeui-card-034-line:color-mix(in oklab,var(--vibeui-card-034-fg) 16%,transparent);
--vibeui-card-034-muted:color-mix(in oklab,var(--vibeui-card-034-fg) 68%,transparent);
--vibeui-card-034-accent:#f2f2f2;
--vibeui-card-034-fg:#f2f2f2;
--vibeui-card-034-bg:#1a1a1a;
}
[data-vibeui-block="card-034"]{box-sizing:border-box;min-width:min(100%,12rem);list-style:none}
[data-vibeui-block="card-034"] *{box-sizing:border-box}
@keyframes vibeui-card-034-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
[data-vibeui-block="card-034"]{display:flex;flex-direction:column;gap:1rem;padding:1.5rem;border-radius:1rem;border:1px solid var(--vibeui-card-034-line);background:var(--vibeui-card-034-glass);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);animation:vibeui-card-034-in .6s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-card-034-n) * 100ms)}
[data-vibeui-block="card-034"] [data-part="stars"]{color:var(--vibeui-card-034-accent-ink);letter-spacing:.1em;font-size:.85rem;text-shadow:0 0 12px rgb(125 42 58 / .6)}
[data-vibeui-block="card-034"] [data-part="quote"]{margin:0;font-family:var(--vibeui-card-034-display);font-style:italic;font-size:1.25rem;line-height:1.35}
[data-vibeui-block="card-034"] [data-part="who"]{display:flex;align-items:baseline;justify-content:space-between;gap:1rem;margin-top:auto;padding-top:1rem;border-top:1px solid var(--vibeui-card-034-line)}
[data-vibeui-block="card-034"] [data-part="who"] b{display:block;font-size:.9rem}
[data-vibeui-block="card-034"] [data-part="who"] small{display:block;font-size:.75rem;color:var(--vibeui-card-034-muted)}
[data-vibeui-block="card-034"] [data-part="source"]{flex:none;font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-card-034-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-034"] *{animation:none!important;transition:none!important}}
`

/** Полупрозрачная карточка отзыва для фона с фото: звёзды, цитата, имя — читается на любом кадре за счёт размытия и подложки. */
export function Card034({
  name = "Анна Л.",
  quote = "Отмечали день рождения на двенадцать человек — дальний зал, своё меню, ни одной накладки.",
  rating,
  occasion,
  source,
  ratingLabel = "Оценка {n} из 5",
  index = 0,
  accent,
  className,
  style,
  ...props
}: Card034Props) {
  const palette = {
    ["--vibeui-card-034-n" as string]: index,
    ...(accent ? { "--vibeui-card-034-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-034" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-034"
        className={className}
        style={palette}
      >
        {rating ? (
          <span data-part="stars" aria-label={ratingLabel.replace("{n}", String(rating))}>
            {"★".repeat(Math.max(0, Math.min(5, Math.round(rating))))}
          </span>
        ) : null}
        <blockquote data-part="quote">{quote}</blockquote>
        <div data-part="who">
          <div>
            <b>{name}</b>
            {occasion ? <small>{occasion}</small> : null}
          </div>
          {source ? <span data-part="source">{source}</span> : null}
        </div>
      </li>
    </>
  )
}

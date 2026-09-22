import type { ComponentProps, CSSProperties } from "react"

export type Card054Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  image?: string
  fact?: string
  role?: string
  phone?: string
  chatLabel?: string
  phoneHref?: string
  chatHref?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока people-007, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-054"]){
--vibeui-card-054-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-054-card:light-dark(#fffdf9,#242424);
--vibeui-card-054-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-card-054-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-054-line:color-mix(in oklab,var(--vibeui-card-054-fg) 14%,var(--vibeui-card-054-bg));
--vibeui-card-054-muted:color-mix(in oklab,var(--vibeui-card-054-fg) 62%,var(--vibeui-card-054-bg));
--vibeui-card-054-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-054"]{color-scheme:dark}
[data-vibeui-block="card-054"]{box-sizing:border-box;min-width:min(100%,12rem);list-style:none}
[data-vibeui-block="card-054"] *{box-sizing:border-box}
[data-vibeui-block="card-054"]{display:flex;flex-direction:column;overflow:hidden;border-radius:1rem;background:var(--vibeui-card-054-card);border:1px solid var(--vibeui-card-054-line);transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s}
[data-vibeui-block="card-054"]:hover{transform:translateY(-4px);box-shadow:0 30px 40px -28px rgb(20 33 27 / .5)}
[data-vibeui-block="card-054"] [data-part="media"]{position:relative;aspect-ratio:4/5;overflow:hidden;background:light-dark(#e7dfd2,#2a2a2a)}
[data-vibeui-block="card-054"] [data-part="media"] img{display:block;width:100%;height:100%;object-fit:cover;object-position:center top;transition:transform 1.2s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="card-054"]:hover [data-part="media"] img{transform:scale(1.04)}
[data-vibeui-block="card-054"] [data-part="fact"]{position:absolute;left:.75rem;bottom:.75rem;padding:.3rem .65rem;border-radius:999px;background:var(--vibeui-card-054-card);color:var(--vibeui-card-054-fg);font-size:.7rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
[data-vibeui-block="card-054"] [data-part="body"]{display:grid;gap:.25rem;padding:1rem 1.1rem 1.15rem}
[data-vibeui-block="card-054"] [data-part="name"]{margin:0;font-family:var(--vibeui-card-054-display);font-size:1.5rem;font-weight:600;line-height:1.1}
[data-vibeui-block="card-054"] [data-part="role"]{margin:0;color:var(--vibeui-card-054-muted);font-size:.85rem}
[data-vibeui-block="card-054"] [data-part="links"]{display:flex;flex-wrap:wrap;gap:.35rem 1rem;margin-top:.6rem;padding-top:.7rem;border-top:1px solid var(--vibeui-card-054-line);font-size:.85rem;font-weight:600}
[data-vibeui-block="card-054"] [data-part="links"] a{color:inherit;text-decoration:none;border-bottom:1px solid var(--vibeui-card-054-accent);padding-bottom:.1rem;transition:color .2s}
[data-vibeui-block="card-054"] [data-part="links"] a:hover{color:var(--vibeui-card-054-accent)}
[data-vibeui-block="card-054"] [data-part="links"] a:focus-visible{outline:2px solid var(--vibeui-card-054-accent);outline-offset:3px;border-radius:.2rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-054"] *{animation:none!important;transition:none!important}}
`

/** Карточка агента недвижимости: портрет, имя, специализация, число сделок и кнопка связи. */
export function Card054({
  name = "Андрей Фёдоров",
  image = "/demo/realty/object-01.webp",
  fact = "18 лет в сделках",
  role = "Юрист. История квартиры, долги, собственники",
  phone = "+7 812 240-00-41",
  chatLabel = "Написать",
  phoneHref = "tel:+78122400041",
  chatHref = "#",
  accent,
  className,
  style,
  ...props
}: Card054Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-054-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-054" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-054"
        className={className}
        style={palette}
      >
        <div data-part="media">
          {image ? <img src={image} alt={name} loading="lazy" /> : null}
          {fact ? <span data-part="fact">{fact}</span> : null}
        </div>
        <div data-part="body">
          <h3 data-part="name">{name}</h3>
          <p data-part="role">{role}</p>
          {phone || chatLabel ? (
            <div data-part="links">
              {phone ? <a href={phoneHref ?? `tel:${phone.replace(/[^\d+]/g, "")}`}>{phone}</a> : null}
              {chatLabel ? <a href={chatHref ?? "#"}>{chatLabel}</a> : null}
            </div>
          ) : null}
        </div>
      </li>
    </>
  )
}

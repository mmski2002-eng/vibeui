import type { ComponentProps, CSSProperties } from "react"

export type Card120Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  href?: string
  text?: string
  facts?: readonly string[]
  tags?: readonly string[]
  image?: string
  imageAlt?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока event-007, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-120"]){
--vibeui-card-120-card:light-dark(#ffffff,#15161b);
--vibeui-card-120-display:"Inter Tight","Inter",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-120-muted:light-dark(#6b6b70,#a1a1aa);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-120"]{color-scheme:dark}
[data-vibeui-block="card-120"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-120"] *{box-sizing:border-box}
@keyframes vibeui-card-120-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
[data-vibeui-block="card-120"]{padding:.5rem;border-radius:1.5rem;background:var(--vibeui-event-007-color);transition:padding .35s cubic-bezier(.2,.8,.2,1);animation:vibeui-card-120-in .6s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-event-007-n) * 70ms)}
[data-vibeui-block="card-120"]:hover{padding:.75rem}
[data-vibeui-block="card-120"] [data-part="card"]{display:grid;grid-template-columns:minmax(0,1fr) 5.5rem;gap:1rem;height:100%;padding:1.1rem;border-radius:1.05rem;background:var(--vibeui-card-120-card)}
[data-vibeui-block="card-120"] [data-part="name"]{margin:0;font-family:var(--vibeui-card-120-display);font-size:1.3rem;font-weight:600;line-height:1.15;letter-spacing:-.02em}
[data-vibeui-block="card-120"] [data-part="name"] a:hover{opacity:.7}
[data-vibeui-block="card-120"] [data-part="text"]{margin:.4rem 0 0;font-size:.92rem;color:var(--vibeui-card-120-muted)}
[data-vibeui-block="card-120"] [data-part="facts"]{display:flex;flex-wrap:wrap;gap:.35rem;margin:.8rem 0 0;padding:0;list-style:none}
[data-vibeui-block="card-120"] [data-part="facts"] li{padding:.2rem .6rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-event-007-color) 45%,var(--vibeui-card-120-card));font-size:.78rem;font-weight:500}
[data-vibeui-block="card-120"] [data-part="tags"]{margin:.6rem 0 0;font-size:.82rem;color:var(--vibeui-card-120-muted)}
[data-vibeui-block="card-120"] [data-part="photo"]{align-self:start;width:5.5rem;height:5.5rem;border-radius:.9rem;overflow:hidden;background:light-dark(#efeff1,#1f2026);transition:transform .45s cubic-bezier(.2,.9,.3,1.3)}
[data-vibeui-block="card-120"] [data-part="photo"] img{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="card-120"]:hover [data-part="photo"]{transform:translateY(-4px) rotate(4deg) scale(1.05)}
@container (min-width: 68rem){
[data-vibeui-block="card-120"] [data-part="card"]{grid-template-columns:1fr;grid-template-rows:auto 1fr}
[data-vibeui-block="card-120"] [data-part="photo"]{grid-row:1;width:100%;height:auto;aspect-ratio:3/2}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-120"] *{animation:none!important;transition:none!important}}
`

/** Карточка площадки с цветной рамкой: название, адрес, факты и ссылка. */
export function Card120({
  name = "Главная сцена",
  href,
  text,
  facts = [],
  tags = [],
  image,
  imageAlt,
  accent,
  className,
  style,
  ...props
}: Card120Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-120-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-120" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-120"
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div>
            <h3 data-part="name">{href ? <a href={href}>{name}</a> : name}</h3>
            {text ? <p data-part="text">{text}</p> : null}
            {facts && facts.length > 0 ? (
              <ul data-part="facts">
                {facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            ) : null}
            {tags && tags.length > 0 ? <p data-part="tags">{tags.join(" · ")}</p> : null}
          </div>
          <div data-part="photo">{image ? <img src={image} alt={imageAlt ?? ""} loading="lazy" /> : null}</div>
        </div>
      </li>
    </>
  )
}

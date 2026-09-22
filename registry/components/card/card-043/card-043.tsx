import type { ComponentProps, CSSProperties } from "react"
import { Avatar001 } from "@/registry/components/avatar/avatar-001/avatar-001"

export type Card043Props = Omit<ComponentProps<"figure">, "title" | "children"> & {
  name?: string
  quote?: string
  image?: string
  role?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока testimonials-012, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-043"]){
--vibeui-card-043-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-card-043-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-card-043-muted:light-dark(oklch(0.48 0 0),oklch(0.71 0 0));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-043"]{color-scheme:dark}
[data-vibeui-block="card-043"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="card-043"] *{box-sizing:border-box}
[data-vibeui-block="card-043"]{min-inline-size:0;
display:flex;flex-direction:column;gap:1.25rem;margin:0;
padding:1.5rem;border:1px solid var(--vibeui-card-043-border);border-radius:1.125rem;
background:var(--vibeui-card-043-card);}
[data-vibeui-block="card-043"] [data-part="quote"]{margin:0;flex:1 1 auto;font-size:1rem;line-height:1.6;}
[data-vibeui-block="card-043"] [data-part="quote"]::before{content:"«"}
[data-vibeui-block="card-043"] [data-part="quote"]::after{content:"»"}
[data-vibeui-block="card-043"] [data-part="author"]{display:flex;align-items:center;gap:0.75rem;
padding-top:1rem;border-top:1px solid var(--vibeui-card-043-border);}
[data-vibeui-block="card-043"] [data-part="who"]{display:grid;gap:0.0625rem;min-width:0}
[data-vibeui-block="card-043"] [data-part="author-name"]{font-size:0.9375rem;font-weight:640}
[data-vibeui-block="card-043"] [data-part="role"]{color:var(--vibeui-card-043-muted);font-size:0.8125rem;line-height:1.35}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-043"] *{animation:none!important;transition:none!important}}
`

/** Карточка отзыва для панели вкладки по сегменту: цитата, аватар, имя и роль, без собственной рамки. */
export function Card043({
  name = "Отзыв в панели сегмента",
  quote = "Отзыв в панели сегмента",
  image = "/demo/realty/object-01.webp",
  role = "Отзыв в панели сегмента",
  accent,
  className,
  style,
  ...props
}: Card043Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-043-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-043" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="card"
        data-vibeui-block="card-043"
        className={className}
        style={palette}
      >
        <blockquote data-part="quote">{quote}</blockquote>
        <figcaption data-part="author">
          <Avatar001 data-part="avatar" name={name} src={image} status="none" aria-hidden="true" />
          <span data-part="who">
            <span data-part="author-name">{name}</span>
            <span data-part="role">{role}</span>
          </span>
        </figcaption>
      </figure>
    </>
  )
}

import type { ComponentProps, CSSProperties } from "react"
import { Avatar001 } from "@/registry/components/avatar/avatar-001/avatar-001"

export type Card042Props = Omit<ComponentProps<"figure">, "title" | "children"> & {
  quote?: string
  name?: string
  image?: string
  role?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока testimonials-007, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-042"]){
--vibeui-card-042-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-card-042-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-card-042-muted:light-dark(oklch(0.48 0 0),oklch(0.71 0 0));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-042"]{color-scheme:dark}
[data-vibeui-block="card-042"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="card-042"] *{box-sizing:border-box}
[data-vibeui-block="card-042"]{width:19rem;flex:none;display:flex;flex-direction:column;gap:1rem;margin:0;
padding:1.25rem;border:1px solid var(--vibeui-card-042-border);border-radius:1rem;
background:var(--vibeui-card-042-card);}
[data-vibeui-block="card-042"] [data-part="quote"]{margin:0;flex:1 1 auto;font-size:0.9375rem;line-height:1.55;}
[data-vibeui-block="card-042"] [data-part="quote"]::before{content:"«"}
[data-vibeui-block="card-042"] [data-part="quote"]::after{content:"»"}
[data-vibeui-block="card-042"] [data-part="author"]{display:flex;align-items:center;gap:0.625rem;}
[data-vibeui-block="card-042"] [data-part="who"]{display:grid;gap:0.0625rem;min-width:0}
[data-vibeui-block="card-042"] [data-part="author-name"]{font-size:0.875rem;font-weight:640}
[data-vibeui-block="card-042"] [data-part="role"]{color:var(--vibeui-card-042-muted);font-size:0.75rem;line-height:1.35}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-042"] *{animation:none!important;transition:none!important}}
`

/** Компактная карточка отзыва фиксированной ширины для бегущей ленты: цитата, аватар, имя и роль. */
export function Card042({
  quote = "Лендинг собрали за вечер: выбрали блоки, отдали агенту, поправили тексты.",
  name = "Анна Ковалёва",
  image = "/demo/realty/object-01.webp",
  role = "Маркетинг, «Северный путь»",
  accent,
  className,
  style,
  ...props
}: Card042Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-042-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-042" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="card"
        data-vibeui-block="card-042"
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

import type { ComponentProps, CSSProperties } from "react"
import { Avatar001 } from "@/registry/components/avatar/avatar-001/avatar-001"

export type Card051Props = Omit<ComponentProps<"figure">, "title" | "children"> & {
  name?: string
  quote?: string
  image?: string
  role?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока people-003, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-051"]){
--vibeui-card-051-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-card-051-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-card-051-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-card-051-dur-2:180ms;
--vibeui-card-051-muted:light-dark(oklch(0.51 0 0),oklch(0.72 0 0));
--vibeui-card-051-shadow:light-dark(oklch(0.2 0 0 / 55%),oklch(0 0 0 / 80%));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-051"]{color-scheme:dark}
[data-vibeui-block="card-051"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="card-051"] *{box-sizing:border-box}
[data-vibeui-block="card-051"]{min-inline-size:0;display:flex;flex-direction:column;gap:1.25rem;margin:0;
padding:2rem;border:1px solid var(--vibeui-card-051-border);border-radius:1.25rem;
background:var(--vibeui-card-051-card);
transition:border-color var(--vibeui-card-051-dur-2) ease,transform var(--vibeui-card-051-dur-2) ease,box-shadow var(--vibeui-card-051-dur-2) ease;}
[data-vibeui-block="card-051"]:hover{border-color:color-mix(in oklab,var(--vibeui-card-051-accent) 40%,var(--vibeui-card-051-border));
transform:translateY(-2px);
box-shadow:0 22px 44px -36px var(--vibeui-card-051-shadow);}
[data-vibeui-block="card-051"] [data-part="person"]{display:flex;align-items:center;gap:1rem;order:-1;}
[data-vibeui-block="card-051"] [data-part="who"]{display:grid;gap:0.125rem;min-width:0}
[data-vibeui-block="card-051"] [data-part="person-name"]{font-size:1.125rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="card-051"] [data-part="role"]{color:var(--vibeui-card-051-muted);font-size:0.875rem;line-height:1.4}
[data-vibeui-block="card-051"] [data-part="quote"]{margin:0;padding-left:1rem;
border-left:2px solid color-mix(in oklab,var(--vibeui-card-051-accent) 55%,var(--vibeui-card-051-border));
font-size:1rem;line-height:1.65;}
[data-vibeui-block="card-051"] [data-part="quote"]::before{content:"«"}
[data-vibeui-block="card-051"] [data-part="quote"]::after{content:"»"}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-051"] *{animation:none!important;transition:none!important}}
`

/** Карточка руководителя в ряд: крупный аватар, имя, должность и короткая цитата о зоне ответственности. */
export function Card051({
  name = "Алексей Громов",
  quote = "Мы не продаём компоненты — мы продаём вечер, за который маркетолог собирает страницу без разработчика.",
  image = "/demo/realty/object-01.webp",
  role = "Основатель и продукт",
  accent,
  className,
  style,
  ...props
}: Card051Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-051-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-051" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="card"
        data-vibeui-block="card-051"
        className={className}
        style={palette}
      >
        <blockquote data-part="quote">{quote}</blockquote>
        <figcaption data-part="person">
          <Avatar001 data-part="avatar" name={name} src={image} size="lg" status="none" aria-hidden="true" />
          <span data-part="who">
            <span data-part="person-name">{name}</span>
            <span data-part="role">{role}</span>
          </span>
        </figcaption>
      </figure>
    </>
  )
}

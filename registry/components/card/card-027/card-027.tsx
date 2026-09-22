import type { ComponentProps, CSSProperties } from "react"
import { Avatar001 } from "@/registry/components/avatar/avatar-001/avatar-001"

export type Card027Props = Omit<ComponentProps<"figure">, "title" | "children"> & {
  name?: string
  quote?: string
  image?: string
  role?: string
  source?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока testimonials-002, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-027"]){
--vibeui-card-027-accent:light-dark(oklch(0.287 0 0),oklch(0.906 0 0));
--vibeui-card-027-border:light-dark(oklch(0.91 0 260),oklch(0.35 0 260));
--vibeui-card-027-card:light-dark(oklch(1 0 0),oklch(0.255 0 260));
--vibeui-card-027-dur-2:180ms;
--vibeui-card-027-muted:light-dark(oklch(0.5 0 260),oklch(0.72 0 260));
--vibeui-card-027-shadow:light-dark(oklch(0.2 0 0 / 70%),oklch(0.05 0 260 / 85%));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-027"]{color-scheme:dark}
[data-vibeui-block="card-027"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="card-027"] *{box-sizing:border-box}
[data-vibeui-block="card-027"]{/* Элемент грида не сжимается меньше содержимого без явного нуля: на узком
   экране карточка вылезала за край блока. */
min-inline-size:0;
display:flex;flex-direction:column;gap:1.25rem;margin:0;
padding:1.5rem;border:1px solid var(--vibeui-card-027-border);border-radius:1.125rem;
background:var(--vibeui-card-027-card);
transition:border-color var(--vibeui-card-027-dur-2) ease,transform var(--vibeui-card-027-dur-2) ease,box-shadow var(--vibeui-card-027-dur-2) ease;}
[data-vibeui-block="card-027"]:hover{border-color:color-mix(in oklab,var(--vibeui-card-027-accent) 40%,var(--vibeui-card-027-border));
transform:translateY(-2px);
box-shadow:0 22px 44px -36px var(--vibeui-card-027-shadow);}
[data-vibeui-block="card-027"] [data-part="quote"]{margin:0;flex:1 1 auto;
font-size:1rem;line-height:1.6;}
[data-vibeui-block="card-027"] [data-part="quote"]::before{content:"«"}
[data-vibeui-block="card-027"] [data-part="quote"]::after{content:"»"}
[data-vibeui-block="card-027"] [data-part="author"]{display:flex;align-items:center;gap:0.75rem;
padding-top:1rem;border-top:1px solid var(--vibeui-card-027-border);}
[data-vibeui-block="card-027"] [data-part="who"]{display:grid;gap:0.0625rem;min-width:0}
[data-vibeui-block="card-027"] [data-part="author-name"]{font-size:0.9375rem;font-weight:640}
[data-vibeui-block="card-027"] [data-part="role"]{color:var(--vibeui-card-027-muted);font-size:0.8125rem;line-height:1.35}
[data-vibeui-block="card-027"] [data-part="source"]{margin-left:auto;flex:none;align-self:flex-start;
padding:0.1875rem 0.5rem;border-radius:0.375rem;
border:1px solid var(--vibeui-card-027-border);
color:var(--vibeui-card-027-muted);font-size:0.6875rem;font-weight:600;white-space:nowrap;}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-027"] *{animation:none!important;transition:none!important}}
`

/** Карточка отзыва в рамке: цитата, автор с аватаром и ролью, справа плашка источника — чат, письмо, интервью. */
export function Card027({
  name = "Анна Ковалёва",
  quote = "Раньше на посадочную страницу уходила неделя вёрстки. Сейчас маркетолог собирает её сам за вечер, а мы только проверяем тексты.",
  image = "/demo/realty/object-01.webp",
  role = "Руководитель маркетинга, «Северный путь»",
  source = "Отзыв в чате",
  accent,
  className,
  style,
  ...props
}: Card027Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-027-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-027" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="card"
        data-vibeui-block="card-027"
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
          <span data-part="source">{source}</span>
        </figcaption>
      </figure>
    </>
  )
}

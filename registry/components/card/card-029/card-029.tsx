import type { ComponentProps, CSSProperties } from "react"
import { Avatar001 } from "@/registry/components/avatar/avatar-001/avatar-001"

export type Card029Props = Omit<ComponentProps<"figure">, "title" | "children"> & {
  name?: string
  highlight?: boolean
  quote?: string
  image?: string
  role?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока testimonials-006, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-029"]){
--vibeui-card-029-accent:light-dark(oklch(0.287 0 0),oklch(0.91 0 0));
--vibeui-card-029-border:light-dark(oklch(0.9 0 275),oklch(0.34 0 275));
--vibeui-card-029-card:light-dark(oklch(1 0 0),oklch(0.26 0 275));
--vibeui-card-029-muted:light-dark(oklch(0.5 0 275),oklch(0.76 0 275));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-029"]{color-scheme:dark}
[data-vibeui-block="card-029"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="card-029"] *{box-sizing:border-box}
[data-vibeui-block="card-029"]{break-inside:avoid;margin:0 0 1rem;
padding:1.375rem;border:1px solid var(--vibeui-card-029-border);border-radius:1.125rem;
background:var(--vibeui-card-029-card);}
[data-vibeui-block="card-029"][data-highlight="true"]{border-color:color-mix(in oklab,var(--vibeui-card-029-accent) 55%,transparent);
background:linear-gradient(180deg,color-mix(in oklab,var(--vibeui-card-029-accent) 12%,var(--vibeui-card-029-card)),var(--vibeui-card-029-card));}
[data-vibeui-block="card-029"] [data-part="quote"]{margin:0 0 1rem;font-size:0.9375rem;line-height:1.65;}
[data-vibeui-block="card-029"] [data-part="author"]{display:flex;align-items:center;gap:0.625rem}
[data-vibeui-block="card-029"] [data-part="author-name"]{display:block;font-size:0.875rem;font-weight:620}
[data-vibeui-block="card-029"] [data-part="role"]{display:block;color:var(--vibeui-card-029-muted);font-size:0.75rem;line-height:1.35}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-029"] *{animation:none!important;transition:none!important}}
`

/** Карточка отзыва переменной высоты для стены: цитата целиком, автор с аватаром и ролью внизу, без обрезки текста. */
export function Card029({
  name = "Анна Ковалёва",
  highlight,
  quote = "Раньше каждый лендинг начинался с пустого файла и заканчивался спором о кнопке.",
  image = "/demo/realty/object-01.webp",
  role = "Маркетинг, «Северный путь»",
  accent,
  className,
  style,
  ...props
}: Card029Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-029-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-029" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="card"
        data-vibeui-block="card-029"
        data-highlight={highlight ? "true" : undefined}
        className={className}
        style={palette}
      >
        <blockquote data-part="quote">{quote}</blockquote>
        <figcaption data-part="author">
          <Avatar001 data-part="avatar" name={name} src={image} status="none" aria-hidden="true" />
          <span>
            <span data-part="author-name">{name}</span>
            <span data-part="role">{role}</span>
          </span>
        </figcaption>
      </figure>
    </>
  )
}

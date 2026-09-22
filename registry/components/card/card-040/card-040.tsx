import type { ComponentProps, CSSProperties } from "react"

export type Card040Props = Omit<ComponentProps<"figure">, "title" | "children"> & {
  name?: string
  featured?: boolean
  quote?: string
  role?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

/** Инициалы: первые буквы двух первых слов имени. */
function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
}

// Часть блока testimonials-001, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-040"]){
--vibeui-card-040-accent:light-dark(oklch(0.28 0 0),oklch(0.906 0 0));
--vibeui-card-040-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-card-040-card:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-card-040-ink:light-dark(oklch(0.22 0 265),oklch(0.95 0 265));
--vibeui-card-040-muted:light-dark(oklch(0.5 0 265),oklch(0.72 0 265));
--vibeui-card-040-serif:ui-serif,Georgia,"Times New Roman",Times,serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-040"]{color-scheme:dark}
[data-vibeui-block="card-040"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="card-040"] *{box-sizing:border-box}
[data-vibeui-block="card-040"]{display:flex;flex-direction:column;gap:1rem;margin:0;
padding:1.25rem;
border:1px solid var(--vibeui-card-040-border);border-radius:1rem;
background:var(--vibeui-card-040-card);}
[data-vibeui-block="card-040"] blockquote{margin:0;font-size:0.9375rem;line-height:1.6;color:var(--vibeui-card-040-ink);}
[data-vibeui-block="card-040"] figcaption{display:flex;align-items:center;gap:0.625rem;margin-top:auto;
font-size:0.8125rem;color:var(--vibeui-card-040-muted);}
[data-vibeui-block="card-040"] [data-part="mark"]{display:flex;align-items:center;justify-content:center;flex:none;
width:2rem;height:2rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-card-040-accent) 14%,transparent);
color:var(--vibeui-card-040-accent);
font-size:0.75rem;font-weight:650;}
[data-vibeui-block="card-040"] [data-part="name"]{display:block;color:var(--vibeui-card-040-ink);font-weight:560;}
[data-vibeui-block="card-040"][data-featured="true"] blockquote{font-family:var(--vibeui-card-040-serif);
font-size:clamp(1.125rem,2.2cqi,1.5rem);line-height:1.4;letter-spacing:-0.01em;}
[data-vibeui-block="card-040"][data-featured="true"]{border-color:color-mix(in oklab,var(--vibeui-card-040-accent) 30%,var(--vibeui-card-040-border));}
@container (min-width: 44rem){
[data-vibeui-block="card-040"][data-featured="true"]{grid-column:span 2}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-040"] *{animation:none!important;transition:none!important}}
`

/** Карточка отзыва для сетки с главным: цитата в кавычках, инициалы в круге, имя и роль; featured растягивает карточку. */
export function Card040({
  name = "Анна Ковалёва",
  featured,
  quote = "Мы перестали спорить о вёрстке. Дизайнер выбирает блок, агент ставит ровно его — и то, что видно в превью, оказывается на странице без переделок.",
  role = "Арт-директор, студия «Полёт»",
  accent,
  className,
  style,
  ...props
}: Card040Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-040-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-040" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="card"
        data-vibeui-block="card-040"
        data-featured={featured || undefined}
        className={className}
        style={palette}
      >
        <blockquote>«{quote}»</blockquote>
        <figcaption>
          <span data-part="mark" aria-hidden="true">
            {initialsOf(name)}
          </span>
          <span>
            <span data-part="name">{name}</span>
            {role}
          </span>
        </figcaption>
      </figure>
    </>
  )
}

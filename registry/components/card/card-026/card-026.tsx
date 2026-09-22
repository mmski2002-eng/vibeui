import type { ComponentProps, CSSProperties } from "react"

export type Card026Props = Omit<ComponentProps<"figure">, "title" | "children"> & {
  company?: string
  industry?: string
  quote?: string
  person?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока testimonials-004, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-026"]){
--vibeui-card-026-accent:light-dark(oklch(0.287 0 0),oklch(0.905 0 0));
--vibeui-card-026-border:light-dark(oklch(0.91 0 250),oklch(0.34 0 250));
--vibeui-card-026-muted:light-dark(oklch(0.5 0 250),oklch(0.72 0 250));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-026"]{color-scheme:dark}
[data-vibeui-block="card-026"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="card-026"] *{box-sizing:border-box}
[data-vibeui-block="card-026"]{display:grid;gap:0.875rem;align-content:start;margin:0;
padding:1.75rem 0;border-bottom:1px solid var(--vibeui-card-026-border);}
[data-vibeui-block="card-026"] [data-part="logo"]{display:inline-flex;align-items:center;gap:0.5rem;
font-size:1.125rem;font-weight:760;letter-spacing:-0.035em;}
[data-vibeui-block="card-026"] [data-part="glyph"]{width:1.625rem;height:1.625rem;flex:none;border-radius:0.5rem;
background:var(--vibeui-card-026-accent);
mask-image:conic-gradient(from 0deg at 50% 50%,black 0 25%,transparent 0 50%,black 0 75%,transparent 0);
mask-size:0.8125rem 0.8125rem;color:oklch(from var(--vibeui-card-026-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="card-026"] [data-part="industry"]{color:var(--vibeui-card-026-muted);
font-size:0.6875rem;font-weight:640;letter-spacing:0.1em;text-transform:uppercase;}
[data-vibeui-block="card-026"] [data-part="quote"]{margin:0;font-size:0.9375rem;line-height:1.6;max-width:42ch;}
[data-vibeui-block="card-026"] [data-part="person"]{color:var(--vibeui-card-026-muted);font-size:0.8125rem;line-height:1.4;}
[data-vibeui-block="card-026"] [data-part="person"]::before{content:"— "}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-026"] *{animation:none!important;transition:none!important}}
`

/** Карточка отзыва без рамки: знак и название компании, отрасль мелким uppercase, цитата и подпись с тире. */
export function Card026({
  company = "Северный путь",
  industry = "Логистика",
  quote = "Личный кабинет клиента переписали за месяц вместо квартала и не потеряли ни одного сценария.",
  person = "Анна Ковалёва, маркетинг",
  accent,
  className,
  style,
  ...props
}: Card026Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-026-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-026" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="card"
        data-vibeui-block="card-026"
        className={className}
        style={palette}
      >
        <span data-part="logo">
          <span data-part="glyph" aria-hidden="true" />
          {company}
        </span>
        <span data-part="industry">{industry}</span>
        <blockquote data-part="quote">{quote}</blockquote>
        <figcaption data-part="person">{person}</figcaption>
      </figure>
    </>
  )
}

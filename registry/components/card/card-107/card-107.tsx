import type { ComponentProps, CSSProperties } from "react"

export type Card107Props = Omit<ComponentProps<"figure">, "title" | "children"> & {
  quote?: string
  name?: string
  role?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока testimonials-010, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-107"]){
--vibeui-card-107-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-card-107-muted:light-dark(oklch(0.48 0 0),oklch(0.71 0 0));
--vibeui-card-107-serif:Georgia,"Times New Roman",Times,serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-107"]{color-scheme:dark}
[data-vibeui-block="card-107"]{box-sizing:border-box}
[data-vibeui-block="card-107"] *{box-sizing:border-box}
[data-vibeui-block="card-107"]{margin:0;display:grid;gap:2rem;}
[data-vibeui-block="card-107"] [data-part="quote"]{position:relative;margin:0;padding-top:2.5rem;
font-family:var(--vibeui-card-107-serif);
font-size:clamp(1.75rem,6.5cqi,4.25rem);line-height:1.12;letter-spacing:-0.02em;font-weight:500;
text-wrap:balance;}
[data-vibeui-block="card-107"] [data-part="quote"]::before{content:"\\201C";position:absolute;top:-0.05em;left:-0.04em;
color:var(--vibeui-card-107-accent);
font-size:1.9em;line-height:1;pointer-events:none;}
[data-vibeui-block="card-107"] [data-part="quote"]::after{content:"\\201D";margin-left:0.08em;
color:var(--vibeui-card-107-accent);}
[data-vibeui-block="card-107"] [data-part="author"]{display:flex;align-items:baseline;gap:0.625rem;flex-wrap:wrap;}
[data-vibeui-block="card-107"] [data-part="author"]::before{content:"";align-self:center;
width:2.5rem;height:2px;border-radius:2px;
background:var(--vibeui-card-107-accent);color:oklch(from var(--vibeui-card-107-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="card-107"] [data-part="name"]{font-size:1rem;font-weight:660}
[data-vibeui-block="card-107"] [data-part="role"]{color:var(--vibeui-card-107-muted);font-size:0.9375rem}
@container (min-width: 48rem){
[data-vibeui-block="card-107"] [data-part="quote"]{padding-top:0;padding-left:1.1em}
[data-vibeui-block="card-107"] [data-part="quote"]::before{left:-0.08em}
[data-vibeui-block="card-107"] [data-part="author"]{padding-left:2.35em}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-107"] *{animation:none!important;transition:none!important}}
`

/** Одна крупная цитата с кавычками-акцентом и подпись: имя, роль. */
export function Card107({
  quote = "Крупная цитата с автором",
  name = "Анна Ковалёва",
  role = "Крупная цитата с автором",
  accent,
  className,
  style,
  ...props
}: Card107Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-107-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-107" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="card"
        data-vibeui-block="card-107"
        className={className}
        style={palette}
      >
        <blockquote data-part="quote">{quote}</blockquote>
        <figcaption data-part="author">
          <span data-part="name">{name}</span>
          <span data-part="role">{role}</span>
        </figcaption>
      </figure>
    </>
  )
}

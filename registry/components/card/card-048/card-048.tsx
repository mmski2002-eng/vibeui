import type { ComponentProps, CSSProperties } from "react"

export type Card048Props = Omit<ComponentProps<"figure">, "title" | "children"> & {
  quote?: string
  who?: string
  role?: string
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока testimonials-035, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-048"]){
--vibeui-card-048-accent:light-dark(#111111,#f2ede4);
--vibeui-card-048-card:color-mix(in oklab,var(--vibeui-card-048-fg) 6%,var(--vibeui-card-048-bg));
--vibeui-card-048-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-048-fg:light-dark(#111111,#f2ede4);
--vibeui-card-048-line:color-mix(in oklab,var(--vibeui-card-048-fg) 12%,transparent);
--vibeui-card-048-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-card-048-muted:color-mix(in oklab,var(--vibeui-card-048-fg) 60%,var(--vibeui-card-048-bg));
--vibeui-card-048-bg:light-dark(#ffffff,#0a0a0a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-048"]{color-scheme:dark}
[data-vibeui-block="card-048"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="card-048"] *{box-sizing:border-box}
[data-vibeui-block="card-048"]{display:grid;gap:.6rem;width:20rem;padding:1.1rem 1.2rem;border-radius:1.2rem;background:var(--vibeui-card-048-card);border:1px solid var(--vibeui-card-048-line)}
[data-vibeui-block="card-048"] blockquote{margin:0;font-size:.95rem;line-height:1.45}
[data-vibeui-block="card-048"] blockquote::before{content:"“";color:var(--vibeui-card-048-accent);font-family:var(--vibeui-card-048-display);font-weight:900;margin-right:.1em}
[data-vibeui-block="card-048"] figcaption{display:flex;gap:.5rem;align-items:baseline;font-family:var(--vibeui-card-048-mono);font-size:.68rem;letter-spacing:.06em;color:var(--vibeui-card-048-muted)}
[data-vibeui-block="card-048"] figcaption b{font-weight:500;color:var(--vibeui-card-048-fg)}
[data-vibeui-block="card-048"] figcaption i{font-style:normal;color:var(--vibeui-card-048-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-048"] *{animation:none!important;transition:none!important}}
`

/** Карточка цитаты из прессы для наклонной бегущей строки: логотип-название издания, цитата, дата. */
export function Card048({
  quote,
  who,
  role,
  accent,
  className,
  style,
  ...props
}: Card048Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-048-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-048" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="card"
        data-vibeui-block="card-048"
        className={className}
        style={palette}
      >
        <blockquote>{quote}</blockquote>
        <figcaption>
          <b>{who}</b>
          {role ? <i>{role}</i> : null}
        </figcaption>
      </figure>
    </>
  )
}

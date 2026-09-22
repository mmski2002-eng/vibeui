import type { ComponentProps, CSSProperties } from "react"

export type Card030Props = Omit<ComponentProps<"figure">, "title" | "children"> & {
  name?: string
  metric?: string
  metricLabel?: string
  quote?: string
  role?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока testimonials-008, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-030"]){
--vibeui-card-030-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-card-030-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-card-030-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-card-030-muted:light-dark(oklch(0.48 0 0),oklch(0.71 0 0));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-030"]{color-scheme:dark}
[data-vibeui-block="card-030"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="card-030"] *{box-sizing:border-box}
[data-vibeui-block="card-030"]{min-inline-size:0;
display:flex;flex-direction:column;margin:0;
padding:1.75rem 1.5rem;border:1px solid var(--vibeui-card-030-border);border-radius:1.125rem;
background:var(--vibeui-card-030-card);}
[data-vibeui-block="card-030"] [data-part="metric"]{color:var(--vibeui-card-030-accent);
font-size:clamp(2.5rem,7cqi,3.25rem);line-height:1;letter-spacing:-0.03em;font-weight:750;
font-variant-numeric:tabular-nums;}
[data-vibeui-block="card-030"] [data-part="metric-label"]{margin:0.375rem 0 0;color:var(--vibeui-card-030-muted);
font-size:0.8125rem;font-weight:600;letter-spacing:0.02em;}
[data-vibeui-block="card-030"] [data-part="quote"]{margin:1.25rem 0 0;flex:1 1 auto;
padding-top:1.25rem;border-top:1px solid var(--vibeui-card-030-border);
font-size:0.9375rem;line-height:1.6;}
[data-vibeui-block="card-030"] [data-part="quote"]::before{content:"«"}
[data-vibeui-block="card-030"] [data-part="quote"]::after{content:"»"}
[data-vibeui-block="card-030"] [data-part="author"]{margin-top:1.25rem;display:grid;gap:0.0625rem;}
[data-vibeui-block="card-030"] [data-part="name"]{font-size:0.875rem;font-weight:640}
[data-vibeui-block="card-030"] [data-part="role"]{color:var(--vibeui-card-030-muted);font-size:0.8125rem;line-height:1.35}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-030"] *{animation:none!important;transition:none!important}}
`

/** Карточка отзыва, где сверху крупная цифра результата с подписью, а цитата объясняет, как её получили. */
export function Card030({
  name = "Анна Ковалёва",
  metric = "−40%",
  metricLabel = "времени на вёрстку лендинга",
  quote = "Секции берём готовыми, агент ставит их в проект сам. Руки доходят до текстов и офферов — того, что реально двигает конверсию.",
  role = "Руководитель маркетинга, «Северный путь»",
  accent,
  className,
  style,
  ...props
}: Card030Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-030-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-030" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="card"
        data-vibeui-block="card-030"
        className={className}
        style={palette}
      >
        <span data-part="metric">{metric}</span>
        <p data-part="metric-label">{metricLabel}</p>
        <blockquote data-part="quote">{quote}</blockquote>
        <figcaption data-part="author">
          <span data-part="name">{name}</span>
          <span data-part="role">{role}</span>
        </figcaption>
      </figure>
    </>
  )
}

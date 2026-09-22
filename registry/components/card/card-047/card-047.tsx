import type { ComponentProps, CSSProperties } from "react"

export type Card047Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  featured?: boolean
  metric?: string
  metricLabel?: string
  quote?: string
  initials?: string
  role?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока testimonials-032, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-047"]){
--vibeui-card-047-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-047-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-047-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-047-glass:color-mix(in oklab,var(--vibeui-card-047-fg) 5%,transparent);
--vibeui-card-047-line:color-mix(in oklab,var(--vibeui-card-047-fg) 11%,transparent);
--vibeui-card-047-mint:color-mix(in oklab,var(--vibeui-card-047-accent) 45%,#99f6e4);
--vibeui-card-047-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-card-047-muted:color-mix(in oklab,var(--vibeui-card-047-fg) 62%,var(--vibeui-card-047-bg));
--vibeui-card-047-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-047"]{color-scheme:dark}
[data-vibeui-block="card-047"]{box-sizing:border-box;min-width:min(100%,12rem);list-style:none}
[data-vibeui-block="card-047"] *{box-sizing:border-box}
@keyframes vibeui-card-047-rise{from{opacity:0;transform:translateY(2.5rem)}to{opacity:1;transform:translateY(0)}}
[data-vibeui-block="card-047"] [data-part="card"]{position:relative;height:100%;display:grid;grid-template-rows:auto 1fr auto;gap:1.1rem;margin:0;padding:1.5rem;border-radius:1.5rem;background:var(--vibeui-card-047-glass);border:1px solid var(--vibeui-card-047-line);transition:border-color .3s,background .3s}
[data-vibeui-block="card-047"] [data-part="card"]:hover{border-color:color-mix(in oklab,var(--vibeui-card-047-accent) 40%,transparent);background:color-mix(in oklab,var(--vibeui-card-047-accent) 7%,transparent)}
[data-vibeui-block="card-047"] [data-part="metric"]{display:flex;align-items:baseline;gap:.6rem;font-family:var(--vibeui-card-047-mono)}
[data-vibeui-block="card-047"] [data-part="metric"] strong{font-weight:600;font-size:1.6rem;line-height:1;letter-spacing:-.03em;font-variant-numeric:tabular-nums;background:linear-gradient(90deg,var(--vibeui-card-047-accent),var(--vibeui-card-047-mint));-webkit-background-clip:text;background-clip:text;color:transparent}
[data-vibeui-block="card-047"] [data-part="metric"] span{font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-card-047-muted)}
[data-vibeui-block="card-047"] [data-part="quote"]{margin:0;font-size:1rem;line-height:1.55;text-wrap:pretty}
[data-vibeui-block="card-047"] [data-part="quote"]::before{content:"«"}
[data-vibeui-block="card-047"] [data-part="quote"]::after{content:"»"}
[data-vibeui-block="card-047"] [data-part="card"][data-featured="true"] [data-part="quote"]{font-family:var(--vibeui-card-047-display);font-weight:600;font-size:clamp(1.2rem,2.4cqi,1.6rem);line-height:1.3;letter-spacing:-.02em}
[data-vibeui-block="card-047"] [data-part="author"]{display:flex;align-items:center;gap:.8rem;font-size:.86rem}
[data-vibeui-block="card-047"] [data-part="avatar"]{display:grid;place-items:center;width:2.6rem;height:2.6rem;border-radius:50%;background:linear-gradient(135deg,color-mix(in oklab,var(--vibeui-card-047-accent) 40%,transparent),color-mix(in oklab,var(--vibeui-card-047-mint) 30%,transparent));border:1px solid var(--vibeui-card-047-line);font-family:var(--vibeui-card-047-mono);font-weight:600;font-size:.8rem}
[data-vibeui-block="card-047"] [data-part="author"] b{display:block;font-weight:600;color:var(--vibeui-card-047-fg)}
[data-vibeui-block="card-047"] [data-part="author"] span{color:var(--vibeui-card-047-muted)}
[data-vibeui-block="card-047"] [data-part="card"]{animation:vibeui-card-047-rise linear both;animation-timeline:view();animation-range:entry 0% entry 45%}
@container (min-width: 44rem){
[data-vibeui-block="card-047"][data-featured="true"]{grid-column:span 2}
}
@container (min-width: 60rem){
[data-vibeui-block="card-047"][data-featured="true"]{grid-column:span 2}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-047"] *{animation:none!important;transition:none!important}}
`

/** Карточка отзыва с портретом, цитатой и результатом цифрой; featured выделяет карточку рамкой. */
export function Card047({
  name = "Дарья Немцова",
  featured,
  metric = "Отзыв предпринимателя с ме…",
  metricLabel = "Отзыв предпринимателя с ме…",
  quote = "Карты сотрудникам с лимитами по категориям закрыли вечную проблему «а на что ушли восемь тысяч». Теперь видно в приложении, без чеков в чате.",
  initials = "Отзыв предпринимателя с ме…",
  role = "Студия дизайна «Лист», Санкт-Петербург",
  accent,
  className,
  style,
  ...props
}: Card047Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-047-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-047" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-047" data-featured={featured ? "true" : undefined}
        className={className}
        style={palette}
      >
        <figure data-part="card" data-featured={featured ? "true" : undefined}>
          {metric ? (
            <div data-part="metric">
              <strong>{metric}</strong>
              {metricLabel ? <span>{metricLabel}</span> : null}
            </div>
          ) : null}
          <blockquote data-part="quote">{quote}</blockquote>
          <figcaption data-part="author">
            <span data-part="avatar" aria-hidden="true">
              {initials ?? name.charAt(0)}
            </span>
            <span>
              <b>{name}</b>
              <span>{role}</span>
            </span>
          </figcaption>
        </figure>
      </li>
    </>
  )
}

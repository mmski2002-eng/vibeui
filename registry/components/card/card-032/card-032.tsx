import type { ComponentProps, CSSProperties } from "react"

export type Card032Props = Omit<ComponentProps<"article">, "title" | "children"> & {
  platform?: string
  score?: number
  reviews?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function formatScore(score: number) {
  return score.toFixed(1).replace(".", ",")
}

function StarRow() {
  return (
    <>
      {[0, 1, 2, 3, 4].map((index) => (
        <svg
          key={index}
          data-part="star"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2.5l2.95 6.13 6.75.9-4.94 4.7 1.24 6.68L12 17.68l-6 3.23 1.24-6.68-4.94-4.7 6.75-.9L12 2.5Z" />
        </svg>
      ))}
    </>
  )
}

// Часть блока testimonials-011, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-032"]){
--vibeui-card-032-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-card-032-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-card-032-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-card-032-muted:light-dark(oklch(0.48 0 0),oklch(0.71 0 0));
--vibeui-card-032-star-off:light-dark(oklch(0.88 0 0),oklch(0.38 0 0));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-032"]{color-scheme:dark}
[data-vibeui-block="card-032"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="card-032"] *{box-sizing:border-box}
[data-vibeui-block="card-032"]{min-inline-size:0;
display:grid;gap:0.75rem;justify-items:center;
padding:1.75rem 1.25rem;border:1px solid var(--vibeui-card-032-border);border-radius:1.125rem;
background:var(--vibeui-card-032-card);}
[data-vibeui-block="card-032"] [data-part="platform"]{font-size:1rem;font-weight:700;letter-spacing:-0.01em;}
[data-vibeui-block="card-032"] [data-part="stars"]{position:relative;display:inline-flex;gap:0.125rem;
color:var(--vibeui-card-032-star-off);}
[data-vibeui-block="card-032"] [data-part="stars-on"]{position:absolute;inset:0;display:inline-flex;gap:0.125rem;
overflow:hidden;white-space:nowrap;
color:var(--vibeui-card-032-accent);}
[data-vibeui-block="card-032"] [data-part="star"]{width:1.125rem;height:1.125rem;flex:none}
[data-vibeui-block="card-032"] [data-part="score"]{font-size:1.75rem;font-weight:750;letter-spacing:-0.02em;line-height:1;
font-variant-numeric:tabular-nums;}
[data-vibeui-block="card-032"] [data-part="score"] small{color:var(--vibeui-card-032-muted);
font-size:0.5em;font-weight:600;}
[data-vibeui-block="card-032"] [data-part="reviews"]{color:var(--vibeui-card-032-muted);font-size:0.8125rem;}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-032"] *{animation:none!important;transition:none!important}}
`

/** Карточка рейтинга на внешней площадке: название, крупная оценка со звёздами, число отзывов и ссылка на страницу. */
export function Card032({
  platform = "GitHub",
  score = 4.8,
  reviews = "2 340 звёзд",
  accent,
  className,
  style,
  ...props
}: Card032Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-032-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-032" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-slot="card"
        data-vibeui-block="card-032"
        className={className}
        style={palette}
      >
        <h3 data-part="platform">{platform}</h3>
        <span
          data-part="stars"
          role="img"
          aria-label={`Оценка ${formatScore(score)} из 5`}
        >
          <StarRow />
          <span
            data-part="stars-on"
            style={{
              width: `${Math.min(Math.max(score / 5, 0), 1) * 100}%`,
            }}
            aria-hidden="true"
          >
            <StarRow />
          </span>
        </span>
        <p data-part="score">
          {formatScore(score)}
          <small> / 5</small>
        </p>
        <p data-part="reviews">{reviews}</p>
      </article>
    </>
  )
}

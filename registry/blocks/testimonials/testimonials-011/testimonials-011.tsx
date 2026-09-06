import type { CSSProperties } from "react"

type Testimonials011Item = {
  platform: string
  score: number
  reviews: string
}

export type Testimonials011Props = {
  eyebrow?: string
  title?: string
  items?: Testimonials011Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Рейтинги с независимых площадок. Оценка на чужой платформе убедительнее
// цитаты на своём сайте: её нельзя отредактировать. Звёзды закрашены ровно
// на величину оценки — слой акцентных звёзд обрезается по ширине, дробная
// часть видна честно, без округления до целых.
const STYLES = `
:where([data-vibeui-block="testimonials-011"]){
--vibeui-testimonials-011-bg:transparent;
--vibeui-testimonials-011-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-testimonials-011-ink:light-dark(oklch(0.17 0 0),oklch(0.96 0 0));
--vibeui-testimonials-011-muted:light-dark(oklch(0.48 0 0),oklch(0.71 0 0));
--vibeui-testimonials-011-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-testimonials-011-star-off:light-dark(oklch(0.88 0 0),oklch(0.38 0 0));
--vibeui-testimonials-011-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-testimonials-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-011"]{color-scheme:dark}
[data-vibeui-block="testimonials-011"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-testimonials-011-bg);color:var(--vibeui-testimonials-011-ink);
font-family:var(--vibeui-testimonials-011-font);
}
[data-vibeui-block="testimonials-011"] [data-part="shell"]{
max-width:76rem;margin:0 auto;padding:3rem 1.25rem;text-align:center;
}
[data-vibeui-block="testimonials-011"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-testimonials-011-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="testimonials-011"] [data-part="title"]{
margin:0 auto 2rem;max-width:24ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="testimonials-011"] [data-part="grid"]{display:grid;gap:1rem}
[data-vibeui-block="testimonials-011"] [data-part="card"]{
min-inline-size:0;
display:grid;gap:0.75rem;justify-items:center;
padding:1.75rem 1.25rem;border:1px solid var(--vibeui-testimonials-011-border);border-radius:1.125rem;
background:var(--vibeui-testimonials-011-card);
}
[data-vibeui-block="testimonials-011"] [data-part="platform"]{
font-size:1rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="testimonials-011"] [data-part="stars"]{
position:relative;display:inline-flex;gap:0.125rem;
color:var(--vibeui-testimonials-011-star-off);
}
[data-vibeui-block="testimonials-011"] [data-part="stars-on"]{
position:absolute;inset:0;display:inline-flex;gap:0.125rem;
overflow:hidden;white-space:nowrap;
color:var(--vibeui-testimonials-011-accent);
}
[data-vibeui-block="testimonials-011"] [data-part="star"]{width:1.125rem;height:1.125rem;flex:none}
[data-vibeui-block="testimonials-011"] [data-part="score"]{
font-size:1.75rem;font-weight:750;letter-spacing:-0.02em;line-height:1;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="testimonials-011"] [data-part="score"] small{
color:var(--vibeui-testimonials-011-muted);
font-size:0.5em;font-weight:600;
}
[data-vibeui-block="testimonials-011"] [data-part="reviews"]{
color:var(--vibeui-testimonials-011-muted);font-size:0.8125rem;
}
@container (min-width: 34rem){
[data-vibeui-block="testimonials-011"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container (min-width: 60rem){
[data-vibeui-block="testimonials-011"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="testimonials-011"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr));gap:1.25rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Testimonials011Item[] = [
  { platform: "G2", score: 4.8, reviews: "312 отзывов" },
  { platform: "Product Hunt", score: 4.9, reviews: "184 отзыва" },
  { platform: "Trustpilot", score: 4.7, reviews: "526 отзывов" },
  { platform: "GitHub", score: 4.9, reviews: "2 340 звёзд" },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
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

function formatScore(score: number) {
  return score.toFixed(1).replace(".", ",")
}

/** Ряд карточек с рейтингами продукта на независимых площадках. */
export function Testimonials011({
  eyebrow = "Рейтинги",
  title = "Оценки на площадках, которые нам не принадлежат",
  items = DEFAULT_ITEMS,
  background = "",
  accent,
  className,
  style,
}: Testimonials011Props) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-testimonials-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-testimonials-011" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="testimonials-011"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="grid">
            {items.map((item) => (
              <article key={item.platform} data-part="card">
                <h3 data-part="platform">{item.platform}</h3>
                <span
                  data-part="stars"
                  role="img"
                  aria-label={`Оценка ${formatScore(item.score)} из 5`}
                >
                  <StarRow />
                  <span
                    data-part="stars-on"
                    style={{
                      width: `${Math.min(Math.max(item.score / 5, 0), 1) * 100}%`,
                    }}
                    aria-hidden="true"
                  >
                    <StarRow />
                  </span>
                </span>
                <p data-part="score">
                  {formatScore(item.score)}
                  <small> / 5</small>
                </p>
                <p data-part="reviews">{item.reviews}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

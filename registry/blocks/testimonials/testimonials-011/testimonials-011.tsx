import type { CSSProperties } from "react"
import { Card032 } from "@/registry/components/card/card-032/card-032"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

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
const STYLES = `[data-vibeui-block="testimonials-011"] [data-part="heading"]{margin-bottom:2rem}

:where([data-vibeui-block="testimonials-011"]){
--vibeui-testimonials-011-bg:transparent;
--vibeui-testimonials-011-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-testimonials-011-ink:light-dark(oklch(0.17 0 0),oklch(0.96 0 0));
--vibeui-testimonials-011-muted:light-dark(oklch(0.48 0 0),oklch(0.71 0 0));
--vibeui-testimonials-011-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-testimonials-011-star-off:light-dark(oklch(0.88 0 0),oklch(0.38 0 0));
--vibeui-testimonials-011-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
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
[data-vibeui-block="testimonials-011"] [data-part="grid"]{display:grid;gap:1rem}
[data-vibeui-block="testimonials-011"] [data-part="card-star"]{width:1.125rem;height:1.125rem;flex:none}
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
          <Heading001
            data-part="heading"
            eyebrow={eyebrow}
            title={title}
            align="center"
            accent={accent}
          />
          <div data-part="grid">
            {items.map((item) => (
              <Card032 key={item.platform} data-part="card" platform={item.platform} score={item.score} reviews={item.reviews} accent={accent} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

import type { CSSProperties } from "react"
import { Card034 } from "@/registry/components/card/card-034/card-034"

export type Testimonials017Review = {
  quote: string
  name: string
  /** «Яндекс Карты», «Restoclub», «TripAdvisor». */
  source?: string
  rating?: number
  /** «ужин на двоих», «день рождения». */
  occasion?: string
}

export type Testimonials017Props = {
  eyebrow?: string
  title?: string
  reviews?: readonly Testimonials017Review[]
  /** Общая оценка и подпись: «4,9», «по 640 отзывам». */
  score?: string
  scoreLabel?: string
  /** Фото под мутным затемнением на весь фон. */
  image?: string
  /** aria звёзд. */
  ratingLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Отзывы поверх фото зала под тёплым затемнением и размытием: три цитаты
// серифом на стеклянных карточках, звёзды брусничным свечением, источник и повод.
// Слева общая оценка крупно. Серверный, без состояния.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="testimonials-017"]){
--vibeui-testimonials-017-bg:#1a1a1a;
--vibeui-testimonials-017-fg:#f2f2f2;
--vibeui-testimonials-017-muted:color-mix(in oklab,var(--vibeui-testimonials-017-fg) 68%,transparent);
--vibeui-testimonials-017-glass:color-mix(in oklab,var(--vibeui-testimonials-017-bg) 55%,transparent);
--vibeui-testimonials-017-line:color-mix(in oklab,var(--vibeui-testimonials-017-fg) 16%,transparent);
--vibeui-testimonials-017-accent:#f2f2f2;
--vibeui-testimonials-017-glow:0 0 24px color-mix(in oklab,var(--vibeui-testimonials-017-accent) 70%,transparent),0 0 70px color-mix(in oklab,var(--vibeui-testimonials-017-accent) 35%,transparent);
--vibeui-testimonials-017-accent-ink:color-mix(in oklab,var(--vibeui-testimonials-017-accent) 55%,var(--vibeui-testimonials-017-fg));
--vibeui-testimonials-017-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-testimonials-017-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="testimonials-017"]{box-sizing:border-box;position:relative;display:block;overflow:hidden;background:var(--vibeui-testimonials-017-bg);color:var(--vibeui-testimonials-017-fg);font-family:var(--vibeui-testimonials-017-font);font-size:.9375rem;line-height:1.5;color-scheme:dark}
[data-vibeui-block="testimonials-017"] *{box-sizing:border-box}
[data-vibeui-block="testimonials-017"] [data-part="picture"]{position:absolute;inset:-4%;width:108%;height:108%;object-fit:cover;filter:blur(10px) saturate(.8);opacity:.5}
[data-vibeui-block="testimonials-017"] [data-part="shade"]{position:absolute;inset:0;background:linear-gradient(to bottom,color-mix(in oklab,var(--vibeui-testimonials-017-bg) 70%,transparent),color-mix(in oklab,var(--vibeui-testimonials-017-bg) 90%,transparent))}
[data-vibeui-block="testimonials-017"] [data-part="shell"]{position:relative;z-index:1;max-width:76rem;margin:0 auto;padding:4rem 1.25rem;display:grid;gap:2.5rem}
[data-vibeui-block="testimonials-017"] [data-part="eyebrow"]{margin:0 0 .75rem;font-size:.72rem;letter-spacing:.24em;text-transform:uppercase;color:var(--vibeui-testimonials-017-accent-ink);font-weight:600}
[data-vibeui-block="testimonials-017"] [data-part="title"]{margin:0;font-family:var(--vibeui-testimonials-017-display);font-weight:400;font-size:clamp(2.25rem,5cqi,3.5rem);line-height:1.05;letter-spacing:-.01em}
[data-vibeui-block="testimonials-017"] [data-part="score"]{display:flex;align-items:baseline;gap:.75rem;margin:1.5rem 0 0}
[data-vibeui-block="testimonials-017"] [data-part="score"] b{font-family:var(--vibeui-testimonials-017-display);font-size:4rem;font-weight:400;line-height:1;color:var(--vibeui-testimonials-017-accent-ink);text-shadow:0 0 30px rgb(125 42 58 / .5)}
[data-vibeui-block="testimonials-017"] [data-part="score"] span{font-size:.8rem;color:var(--vibeui-testimonials-017-muted);max-width:9rem;line-height:1.3}
[data-vibeui-block="testimonials-017"] [data-part="list"]{display:grid;gap:1.25rem;margin:0;padding:0;list-style:none}
@keyframes vibeui-testimonials-017-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@container (min-width: 48rem){[data-vibeui-block="testimonials-017"] [data-part="list"]{grid-template-columns:repeat(3,minmax(0,1fr))}}
@container (min-width: 64rem){[data-vibeui-block="testimonials-017"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,2.6fr);gap:4rem;padding:6rem 2rem;align-items:start}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-017"] *{animation:none!important;transition:none!important}}`

const DEFAULT_REVIEWS: Testimonials017Review[] = [
  { quote: "Сиг с копчёным картофелем — лучшее, что я ела в городе за год. И свечи, и тишина, и никто не торопит.", name: "Мария К.", occasion: "ужин на двоих", source: "Яндекс Карты", rating: 5 },
  { quote: "Пришли на устричную среду, остались до закрытия. Бармен собрал сауэр под наш разговор, а не по карте.", name: "Илья и Саша", occasion: "среда", source: "Restoclub", rating: 5 },
  { quote: "Отмечали день рождения на двенадцать человек — дальний зал, своё меню, ни одной накладки.", name: "Анна Л.", occasion: "день рождения", source: "TripAdvisor", rating: 5 },
]

/** Отзывы поверх мутного фото зала: стеклянные карточки, звёзды брусничным свечением, общая оценка. */
export function Testimonials017({
  eyebrow = "Отзывы",
  title = "Что пишут после ужина",
  reviews = DEFAULT_REVIEWS,
  score = "4,9",
  scoreLabel = "по 640 отзывам на трёх площадках",
  image = "",
  ratingLabel = "Оценка {n} из 5",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Testimonials017Props) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-017-accent": accent } : null),
    ...(ink ? { "--vibeui-testimonials-017-fg": ink } : null),
    ...(background ? { "--vibeui-testimonials-017-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-testimonials-017" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="testimonials-017" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        {image ? <img data-part="picture" src={image} alt="" loading="lazy" /> : null}
        <div data-part="shade" />
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {score ? (
              <p data-part="score">
                <b>{score}</b>
                {scoreLabel ? <span>{scoreLabel}</span> : null}
              </p>
            ) : null}
          </div>
          <ul data-part="list">
            {reviews.map((review, index) => (
              <Card034 key={review.name + review.quote.slice(0, 12)} data-part="card" name={review.name} quote={review.quote} rating={review.rating} occasion={review.occasion} source={review.source} ratingLabel={ratingLabel} index={index} accent={accent} />
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

import type { CSSProperties } from "react"

export type Restaurant008Review = {
  quote: string
  name: string
  /** «Яндекс Карты», «Restoclub», «TripAdvisor». */
  source?: string
  rating?: number
  /** «ужин на двоих», «день рождения». */
  occasion?: string
}

export type Restaurant008Props = {
  eyebrow?: string
  title?: string
  reviews?: readonly Restaurant008Review[]
  /** Общая оценка и подпись: «4,9», «по 640 отзывам». */
  score?: string
  scoreLabel?: string
  /** Фото под мутным затемнением на весь фон. */
  image?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Отзывы поверх фото зала под тёплым затемнением и размытием: три цитаты
// серифом на стеклянных карточках, звёзды брусничным свечением, источник и повод.
// Слева общая оценка крупно. Серверный, без состояния.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="restaurant-008"]){
--vibeui-restaurant-008-bg:#141110;
--vibeui-restaurant-008-fg:#f2ebe0;
--vibeui-restaurant-008-muted:rgb(242 235 224 / .68);
--vibeui-restaurant-008-glass:rgb(20 17 16 / .55);
--vibeui-restaurant-008-line:rgb(242 235 224 / .16);
--vibeui-restaurant-008-accent:#7d2a3a;
--vibeui-restaurant-008-glow:0 0 24px rgb(125 42 58 / .7),0 0 70px rgb(125 42 58 / .35);
--vibeui-restaurant-008-accent-ink:color-mix(in oklab,var(--vibeui-restaurant-008-accent) 55%,#f2ebe0);
--vibeui-restaurant-008-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-restaurant-008-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="restaurant-008"]{box-sizing:border-box;position:relative;display:block;overflow:hidden;background:var(--vibeui-restaurant-008-bg);color:var(--vibeui-restaurant-008-fg);font-family:var(--vibeui-restaurant-008-font);font-size:.9375rem;line-height:1.5;color-scheme:dark}
[data-vibeui-block="restaurant-008"] *{box-sizing:border-box}
[data-vibeui-block="restaurant-008"] [data-part="picture"]{position:absolute;inset:-4%;width:108%;height:108%;object-fit:cover;filter:blur(10px) saturate(.8);opacity:.5}
[data-vibeui-block="restaurant-008"] [data-part="shade"]{position:absolute;inset:0;background:linear-gradient(to bottom,rgb(20 17 16 / .7),rgb(20 17 16 / .9))}
[data-vibeui-block="restaurant-008"] [data-part="shell"]{position:relative;z-index:1;max-width:76rem;margin:0 auto;padding:4rem 1.25rem;display:grid;gap:2.5rem}
[data-vibeui-block="restaurant-008"] [data-part="eyebrow"]{margin:0 0 .75rem;font-size:.72rem;letter-spacing:.24em;text-transform:uppercase;color:var(--vibeui-restaurant-008-accent-ink);font-weight:600}
[data-vibeui-block="restaurant-008"] [data-part="title"]{margin:0;font-family:var(--vibeui-restaurant-008-display);font-weight:400;font-size:clamp(2.25rem,5cqi,3.5rem);line-height:1.05;letter-spacing:-.01em}
[data-vibeui-block="restaurant-008"] [data-part="score"]{display:flex;align-items:baseline;gap:.75rem;margin:1.5rem 0 0}
[data-vibeui-block="restaurant-008"] [data-part="score"] b{font-family:var(--vibeui-restaurant-008-display);font-size:4rem;font-weight:400;line-height:1;color:var(--vibeui-restaurant-008-accent-ink);text-shadow:0 0 30px rgb(125 42 58 / .5)}
[data-vibeui-block="restaurant-008"] [data-part="score"] span{font-size:.8rem;color:var(--vibeui-restaurant-008-muted);max-width:9rem;line-height:1.3}
[data-vibeui-block="restaurant-008"] [data-part="list"]{display:grid;gap:1.25rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="restaurant-008"] [data-part="card"]{display:flex;flex-direction:column;gap:1rem;padding:1.5rem;border-radius:1rem;border:1px solid var(--vibeui-restaurant-008-line);background:var(--vibeui-restaurant-008-glass);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);animation:vibeui-restaurant-008-in .6s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-restaurant-008-n) * 100ms)}
@keyframes vibeui-restaurant-008-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
[data-vibeui-block="restaurant-008"] [data-part="stars"]{color:var(--vibeui-restaurant-008-accent-ink);letter-spacing:.1em;font-size:.85rem;text-shadow:0 0 12px rgb(125 42 58 / .6)}
[data-vibeui-block="restaurant-008"] [data-part="quote"]{margin:0;font-family:var(--vibeui-restaurant-008-display);font-style:italic;font-size:1.25rem;line-height:1.35}
[data-vibeui-block="restaurant-008"] [data-part="who"]{display:flex;align-items:baseline;justify-content:space-between;gap:1rem;margin-top:auto;padding-top:1rem;border-top:1px solid var(--vibeui-restaurant-008-line)}
[data-vibeui-block="restaurant-008"] [data-part="who"] b{display:block;font-size:.9rem}
[data-vibeui-block="restaurant-008"] [data-part="who"] small{display:block;font-size:.75rem;color:var(--vibeui-restaurant-008-muted)}
[data-vibeui-block="restaurant-008"] [data-part="source"]{flex:none;font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-restaurant-008-muted)}
@container (min-width: 48rem){[data-vibeui-block="restaurant-008"] [data-part="list"]{grid-template-columns:repeat(3,minmax(0,1fr))}}
@container (min-width: 64rem){[data-vibeui-block="restaurant-008"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,2.6fr);gap:4rem;padding:6rem 2rem;align-items:start}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="restaurant-008"] *{animation:none!important;transition:none!important}}`

const DEFAULT_REVIEWS: Restaurant008Review[] = [
  { quote: "Сиг с копчёным картофелем — лучшее, что я ела в городе за год. И свечи, и тишина, и никто не торопит.", name: "Мария К.", occasion: "ужин на двоих", source: "Яндекс Карты", rating: 5 },
  { quote: "Пришли на устричную среду, остались до закрытия. Бармен собрал сауэр под наш разговор, а не по карте.", name: "Илья и Саша", occasion: "среда", source: "Restoclub", rating: 5 },
  { quote: "Отмечали день рождения на двенадцать человек — дальний зал, своё меню, ни одной накладки.", name: "Анна Л.", occasion: "день рождения", source: "TripAdvisor", rating: 5 },
]

/** Отзывы поверх мутного фото зала: стеклянные карточки, звёзды брусничным свечением, общая оценка. */
export function Restaurant008({
  eyebrow = "Отзывы",
  title = "Что пишут после ужина",
  reviews = DEFAULT_REVIEWS,
  score = "4,9",
  scoreLabel = "по 640 отзывам на трёх площадках",
  image = "",
  tone = "auto",
  accent,
  className,
  style,
}: Restaurant008Props) {
  const palette = {
    ...(accent ? { "--vibeui-restaurant-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-restaurant-008" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="restaurant-008" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
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
              <li key={review.name + review.quote.slice(0, 12)} data-part="card" style={{ ["--vibeui-restaurant-008-n" as string]: index }}>
                {review.rating ? (
                  <span data-part="stars" aria-label={`Оценка ${review.rating} из 5`}>
                    {"★".repeat(Math.max(0, Math.min(5, Math.round(review.rating))))}
                  </span>
                ) : null}
                <blockquote data-part="quote">{review.quote}</blockquote>
                <div data-part="who">
                  <div>
                    <b>{review.name}</b>
                    {review.occasion ? <small>{review.occasion}</small> : null}
                  </div>
                  {review.source ? <span data-part="source">{review.source}</span> : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

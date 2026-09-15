import type { CSSProperties } from "react"

export type Testimonials016Review = {
  quote: string
  name: string
  /** Что сделали: «продали двушку на Петроградской». */
  deal: string
  /** Откуда отзыв: «Яндекс Карты». */
  source?: string
  /** Оценка 1–5. */
  rating?: number
  image?: string
}

export type Testimonials016Props = {
  eyebrow?: string
  title?: string
  lede?: string
  reviews?: readonly Testimonials016Review[]
  /** Общая оценка: «4,9». */
  score?: string
  scoreLabel?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Отзывы после сделки: цитата серифом с большой латунной кавычкой, звёзды,
// кто и что сделал, откуда отзыв. В шапке справа общая оценка крупно. Карточки
// появляются каскадом при первом рендере. Без состояния.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="testimonials-016"]){
--vibeui-testimonials-016-bg:light-dark(#f3ede3,#14211b);
--vibeui-testimonials-016-fg:light-dark(#173b2e,#eef0ea);
--vibeui-testimonials-016-muted:light-dark(color-mix(in oklab,#173b2e 62%,#f3ede3),color-mix(in oklab,#eef0ea 62%,#14211b));
--vibeui-testimonials-016-card:light-dark(#fffdf9,#1b2c24);
--vibeui-testimonials-016-line:light-dark(color-mix(in oklab,#173b2e 14%,#f3ede3),color-mix(in oklab,#eef0ea 14%,#14211b));
--vibeui-testimonials-016-accent:#b8925a;
--vibeui-testimonials-016-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-testimonials-016-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-016"]{color-scheme:dark}
:where([data-vibeui-block="testimonials-016"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="testimonials-016"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="testimonials-016"]{box-sizing:border-box;display:block;background:var(--vibeui-testimonials-016-bg);color:var(--vibeui-testimonials-016-fg);font-family:var(--vibeui-testimonials-016-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="testimonials-016"] *{box-sizing:border-box}
[data-vibeui-block="testimonials-016"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="testimonials-016"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:1.5rem 3rem;margin-bottom:2.5rem}
[data-vibeui-block="testimonials-016"] [data-part="eyebrow"]{margin:0 0 .5rem;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-testimonials-016-accent);font-weight:600}
[data-vibeui-block="testimonials-016"] [data-part="title"]{margin:0;font-family:var(--vibeui-testimonials-016-display);font-weight:500;font-size:clamp(2rem,4.5cqi,3.25rem);line-height:1.05;letter-spacing:-.01em}
[data-vibeui-block="testimonials-016"] [data-part="lede"]{margin:.75rem 0 0;max-width:36rem;color:var(--vibeui-testimonials-016-muted)}
[data-vibeui-block="testimonials-016"] [data-part="score"]{display:flex;align-items:baseline;gap:.75rem;margin:0}
[data-vibeui-block="testimonials-016"] [data-part="score"] b{font-family:var(--vibeui-testimonials-016-display);font-size:3.5rem;font-weight:600;line-height:1;color:var(--vibeui-testimonials-016-accent)}
[data-vibeui-block="testimonials-016"] [data-part="score"] span{font-size:.8rem;color:var(--vibeui-testimonials-016-muted);max-width:10rem;line-height:1.3}
[data-vibeui-block="testimonials-016"] [data-part="list"]{display:grid;gap:1.25rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="testimonials-016"] [data-part="card"]{position:relative;display:flex;flex-direction:column;gap:1rem;padding:1.5rem 1.5rem 1.25rem;border-radius:1rem;background:var(--vibeui-testimonials-016-card);border:1px solid var(--vibeui-testimonials-016-line);animation:vibeui-testimonials-016-in .6s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-testimonials-016-n) * 90ms)}
@keyframes vibeui-testimonials-016-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
[data-vibeui-block="testimonials-016"] [data-part="mark"]{position:absolute;top:.4rem;right:1rem;font-family:var(--vibeui-testimonials-016-display);font-size:5rem;line-height:1;color:var(--vibeui-testimonials-016-accent);opacity:.35;pointer-events:none}
[data-vibeui-block="testimonials-016"] [data-part="stars"]{display:flex;gap:.15rem;color:var(--vibeui-testimonials-016-accent);font-size:.9rem;letter-spacing:.05em}
[data-vibeui-block="testimonials-016"] [data-part="quote"]{margin:0;font-family:var(--vibeui-testimonials-016-display);font-size:1.35rem;font-weight:500;line-height:1.3;font-style:italic}
[data-vibeui-block="testimonials-016"] [data-part="who"]{display:flex;align-items:center;gap:.75rem;margin-top:auto;padding-top:1rem;border-top:1px solid var(--vibeui-testimonials-016-line)}
[data-vibeui-block="testimonials-016"] [data-part="who"] img{width:2.5rem;height:2.5rem;border-radius:50%;object-fit:cover;flex:none;background:light-dark(#e7dfd2,#243830)}
[data-vibeui-block="testimonials-016"] [data-part="who"] b{display:block;font-size:.9rem}
[data-vibeui-block="testimonials-016"] [data-part="who"] span{display:block;font-size:.8rem;color:var(--vibeui-testimonials-016-muted)}
[data-vibeui-block="testimonials-016"] [data-part="source"]{margin-left:auto;flex:none;padding:.25rem .6rem;border:1px solid var(--vibeui-testimonials-016-line);border-radius:999px;font-size:.7rem;font-weight:600;color:var(--vibeui-testimonials-016-muted)}
@container (min-width: 48rem){[data-vibeui-block="testimonials-016"] [data-part="list"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 64rem){[data-vibeui-block="testimonials-016"] [data-part="shell"]{padding:5.5rem 2rem}[data-vibeui-block="testimonials-016"] [data-part="list"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1.5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-016"] *{animation:none!important}}`

const DEFAULT_REVIEWS: Testimonials016Review[] = [
  { quote: "Продали двушку за 26 дней и дороже, чем оценивали соседние агентства. Все звонки и показы взяла на себя Ксения, мы только подписали.", name: "Ольга и Сергей", deal: "продали квартиру на Петроградской", source: "Яндекс Карты", rating: 5 },
  { quote: "Илья нашёл ипотечную программу на два процента ниже той, что предлагал наш банк. За год это больше двухсот тысяч.", name: "Дмитрий", deal: "купил студию в Приморском", source: "Google", rating: 5 },
  { quote: "Квартира была с долгом по капремонту и прописанным родственником. Андрей всё вычистил до сделки, мы ничего не заметили.", name: "Анна", deal: "купила трёшку в центре", source: "Авито", rating: 5 },
]

/** Отзывы после сделки: серифные цитаты со звёздами и источником, общая оценка в шапке. */
export function Testimonials016({
  eyebrow = "Отзывы",
  title = "Что говорят после сделки",
  lede = "Отзывы с открытых площадок, где их нельзя отредактировать.",
  reviews = DEFAULT_REVIEWS,
  score = "4,9",
  scoreLabel = "средняя оценка по 312 отзывам",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Testimonials016Props) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-016-accent": accent } : null),
    ...(background ? { "--vibeui-testimonials-016-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-testimonials-016" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="testimonials-016" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
            </div>
            {score ? (
              <p data-part="score">
                <b>{score}</b>
                {scoreLabel ? <span>{scoreLabel}</span> : null}
              </p>
            ) : null}
          </div>
          <ul data-part="list">
            {reviews.map((review, index) => (
              <li key={review.name + review.deal} data-part="card" style={{ "--vibeui-testimonials-016-n": index } as CSSProperties}>
                <span data-part="mark" aria-hidden="true">
                  ”
                </span>
                {review.rating ? (
                  <span data-part="stars" aria-label={`Оценка ${review.rating} из 5`}>
                    {"★".repeat(Math.max(0, Math.min(5, Math.round(review.rating))))}
                  </span>
                ) : null}
                <blockquote data-part="quote">{review.quote}</blockquote>
                <div data-part="who">
                  {review.image ? <img src={review.image} alt="" loading="lazy" /> : null}
                  <div>
                    <b>{review.name}</b>
                    <span>{review.deal}</span>
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

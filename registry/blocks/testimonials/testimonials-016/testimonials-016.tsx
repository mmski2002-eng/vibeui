import type { CSSProperties } from "react"
import { Card033 } from "@/registry/components/card/card-033/card-033"

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
  /** aria звёзд. */
  ratingLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
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
--vibeui-testimonials-016-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-testimonials-016-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-016-muted:color-mix(in oklab,var(--vibeui-testimonials-016-fg) 62%,var(--vibeui-testimonials-016-bg));
--vibeui-testimonials-016-card:light-dark(#fffdf9,#242424);
--vibeui-testimonials-016-line:color-mix(in oklab,var(--vibeui-testimonials-016-fg) 14%,var(--vibeui-testimonials-016-bg));
--vibeui-testimonials-016-accent:light-dark(#1a1a1a,#f2f2f2);
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
@keyframes vibeui-testimonials-016-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
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
  ratingLabel = "Оценка {n} из 5",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Testimonials016Props) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-016-accent": accent } : null),
    ...(ink ? { "--vibeui-testimonials-016-fg": ink } : null),
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
              <Card033 key={review.name + review.deal} data-part="card" name={review.name} deal={review.deal} rating={review.rating} quote={review.quote} image={review.image} source={review.source} ratingLabel={ratingLabel} index={index} accent={accent} />
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

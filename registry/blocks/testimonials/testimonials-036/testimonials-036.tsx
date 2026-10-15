"use client"

import { useState, type CSSProperties } from "react"

export type Testimonials036Review = { quote: string; name: string; meta: string; image: string; project?: string }

export type Testimonials036Props = {
  eyebrow?: string
  title?: string
  reviews?: readonly Testimonials036Review[]
  /** Секунд на отзыв; 0 — только вручную. */
  interval?: number
  prevLabel?: string
  nextLabel?: string
  reviewLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Отзывы владельцев: слева вертикальное фото из их дома, справа крупная
// цитата. Смена отзыва — фото проявляется из-под шторки clip-path, цитата
// поднимается построчно с размытием. Номера отзывов внизу — кнопки с
// заполняющейся полоской-таймером.
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"

const S = '[data-vibeui-block="testimonials-036"]'
const STYLES = `
:where(${S}){
--vibeui-testimonials-036-bg:light-dark(#ebe7e0,#121315);
--vibeui-testimonials-036-fg:light-dark(#16181a,#f2efe9);
--vibeui-testimonials-036-accent:#e8a35c;
--vibeui-testimonials-036-muted:color-mix(in oklab,var(--vibeui-testimonials-036-fg) 58%,transparent);
--vibeui-testimonials-036-line:color-mix(in oklab,var(--vibeui-testimonials-036-fg) 12%,transparent);
--vibeui-testimonials-036-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-testimonials-036-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) ${S}{color-scheme:dark}
:where(${S}[data-tone="light"]){color-scheme:light}
:where(${S}[data-tone="dark"]){color-scheme:dark}
${S}{padding:clamp(4rem,9cqi,7.5rem) 0;background:var(--vibeui-testimonials-036-bg);color:var(--vibeui-testimonials-036-fg);font-family:var(--vibeui-testimonials-036-font)}
${S} *{box-sizing:border-box}
${S} [data-part="shell"]{display:grid;gap:2rem;max-width:90rem;margin:0 auto;padding:0 clamp(1rem,3cqi,2.5rem)}
${S} [data-part="photo"]{position:relative;margin:0;aspect-ratio:4/5;max-height:38rem;border-radius:1.6rem;overflow:hidden;background:var(--vibeui-testimonials-036-line)}
${S} [data-part="photo"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;animation:vibeui-testimonials-036-wipe 1.2s cubic-bezier(.7,0,.2,1) both}
${S} [data-part="photo"] figcaption{position:absolute;left:1rem;bottom:1rem;padding:.4rem .8rem;border-radius:999px;background:rgb(14 15 16 / .55);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);color:#f2efe9;font-family:var(--vibeui-testimonials-036-mono);font-size:.7rem}
${S} [data-part="body"]{display:flex;flex-direction:column;min-width:0}
${S} [data-part="eyebrow"]{display:flex;align-items:center;gap:.7rem;margin:0 0 1rem;font-family:var(--vibeui-testimonials-036-mono);font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-testimonials-036-muted)}
${S} [data-part="eyebrow"]::before{content:"";width:1.6rem;height:1px;background:var(--vibeui-testimonials-036-accent)}
${S} [data-part="title"]{margin:0;font-weight:300;font-size:clamp(1.6rem,3cqi,2.4rem);letter-spacing:-.03em;color:var(--vibeui-testimonials-036-muted)}
${S} [data-part="mark"]{display:block;width:3rem;height:3rem;margin:2rem 0 .5rem;color:var(--vibeui-testimonials-036-accent)}
${S} blockquote{margin:0}
${S} blockquote p{margin:0;font-size:clamp(1.4rem,3cqi,2.5rem);font-weight:300;line-height:1.22;letter-spacing:-.025em;text-wrap:pretty;animation:vibeui-testimonials-036-rise 1s .15s cubic-bezier(.2,.8,.2,1) both}
${S} [data-part="who"]{display:flex;flex-wrap:wrap;gap:.3rem 1rem;align-items:baseline;margin-top:1.6rem;animation:vibeui-testimonials-036-rise 1s .3s cubic-bezier(.2,.8,.2,1) both}
${S} [data-part="who"] b{font-weight:600}
${S} [data-part="who"] span{font-size:.85rem;color:var(--vibeui-testimonials-036-muted)}
${S} [data-part="nav"]{display:flex;align-items:center;gap:.5rem;margin-top:auto;padding-top:2.5rem}
${S} [data-part="dot"]{position:relative;flex:1;max-width:7rem;padding:.8rem 0 0;border:0;background:transparent;color:var(--vibeui-testimonials-036-muted);font-family:var(--vibeui-testimonials-036-mono);font-size:.7rem;text-align:left;cursor:pointer}
${S} [data-part="dot"]::before{content:"";position:absolute;left:0;right:0;top:0;height:1px;background:var(--vibeui-testimonials-036-line)}
${S} [data-part="dot"] i{position:absolute;left:0;top:0;height:1px;width:100%;background:var(--vibeui-testimonials-036-accent);transform-origin:left;transform:scaleX(0)}
${S} [data-part="dot"][aria-current="true"]{color:var(--vibeui-testimonials-036-fg)}
${S} [data-part="dot"][aria-current="true"] i{animation:vibeui-testimonials-036-timer var(--vibeui-testimonials-036-t) linear forwards}
${S} [data-part="dot"][data-static="true"][aria-current="true"] i{animation:none;transform:none}
${S} [data-part="arrows"]{display:flex;gap:.4rem;margin-left:auto}
${S} [data-part="arrows"] button{display:grid;place-items:center;width:2.8rem;height:2.8rem;padding:0;border:1px solid var(--vibeui-testimonials-036-line);border-radius:50%;background:transparent;color:inherit;cursor:pointer;transition:background-color .3s,color .3s}
${S} [data-part="arrows"] button:hover{background:var(--vibeui-testimonials-036-fg);color:var(--vibeui-testimonials-036-bg)}
${S} [data-part="arrows"] svg{width:1rem;height:1rem}
${S} button:focus-visible{outline:2px solid var(--vibeui-testimonials-036-accent);outline-offset:2px}
@keyframes vibeui-testimonials-036-wipe{from{clip-path:inset(0 0 100% 0);transform:scale(1.15)}to{clip-path:inset(0);transform:none}}
@keyframes vibeui-testimonials-036-rise{from{opacity:0;transform:translateY(18px);filter:blur(6px)}to{opacity:1;transform:none;filter:none}}
@keyframes vibeui-testimonials-036-timer{to{transform:scaleX(1)}}
@container (min-width: 56rem){${S} [data-part="shell"]{grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:4rem;align-items:stretch}}
@media (prefers-reduced-motion:reduce){${S} *{animation:none!important;transition:none!important}${S} [data-part="dot"][aria-current="true"] i{transform:none}}
${S} [data-part="arrows"] button{transition:background-color .35s,color .35s,border-color .35s,transform .3s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="arrows"] button svg{transition:transform .45s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="arrows"] button:active{transform:scale(.9);transition-duration:.12s}
${S} [data-part="arrows"] button:hover svg[data-dir="next"]{transform:translateX(3px)}
${S} [data-part="arrows"] button:hover svg[data-dir="prev"]{transform:translateX(-3px)}
${S} [data-part="arrows"] button:hover svg[data-dir="up"]{transform:translateY(-3px)}
${S} [data-part="arrows"] button:hover svg[data-dir="down"]{transform:translateY(3px)}
${S} [data-part="dot"]{transition:background-color .35s,color .35s,border-color .35s,transform .3s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="dot"]:active{transform:scale(.95);transition-duration:.1s}
@keyframes vibeui-testimonials-036-fly{0%{transform:none}45%{transform:translate(140%,-140%)}46%{transform:translate(-140%,140%)}100%{transform:none}}
@keyframes vibeui-testimonials-036-pop{0%{transform:scale(.94)}60%{transform:scale(1.04)}100%{transform:none}}
@media (prefers-reduced-motion:reduce){${S} *,${S} *::before{animation:none!important;transition:none!important}}`

const DEFAULT_REVIEWS: Testimonials036Review[] = [
  { quote: "Въехали в октябре, а в январе поняли главное: в минус тридцать в доме тихо и тепло, а пахнет деревом, а не краской. Смету не превысили ни на рубль.", name: "Андрей и Мария", meta: "живут 3 года · Приозерск", image: "/demo/house/review-01.webp", project: "КБ-198" },
  { quote: "Строили, пока мы жили в Москве. Каждую пятницу — фотоотчёт и короткое видео. Приехали один раз на фундамент и второй — забрать ключи.", name: "Ольга Савельева", meta: "живёт 2 года · Валдай", image: "/demo/house/review-02.webp", project: "КБ-160" },
  { quote: "Брус ни одной трещиной не пошёл, двери не заклинило. Через год позвали ребят на гарантийный осмотр — подтянули пару нагелей бесплатно.", name: "Игорь Ветров", meta: "живёт 4 года · Истра", image: "/demo/house/review-03.webp", project: "БХ-138" },
]

/** Отзывы владельцев домов: фото и крупная цитата с таймером. */
export function Testimonials036({
  eyebrow = "Отзывы",
  title = "Слово тем, кто уже живёт",
  reviews = DEFAULT_REVIEWS,
  interval = 9,
  prevLabel = "Предыдущий отзыв",
  nextLabel = "Следующий отзыв",
  reviewLabel = "Отзыв",
  tone = "dark",
  accent,
  ink,
  background,
  className,
  style,
}: Testimonials036Props) {
  const [index, setIndex] = useState(0)
  const review = reviews[index % reviews.length]
  const go = (step: number) => setIndex((value) => (value + step + reviews.length) % reviews.length)

  const palette = {
    ...(accent ? { "--vibeui-testimonials-036-accent": accent } : null),
    ...(ink ? { "--vibeui-testimonials-036-fg": ink } : null),
    ...(background ? { "--vibeui-testimonials-036-bg": background } : null),
    "--vibeui-testimonials-036-t": `${interval}s`,
    ...style,
  } as CSSProperties

  const auto = interval > 0

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-testimonials-036" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="testimonials-036" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <figure data-part="photo">
            <img key={review.image} src={review.image} alt="" loading="lazy" />
            {review.project ? <figcaption>{review.project}</figcaption> : null}
          </figure>
          <div data-part="body">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            <svg data-part="mark" viewBox="0 0 48 48" fill="currentColor" aria-hidden="true">
              <path d="M8 34c0-9 4-16 12-20l2 3c-5 3-7 7-7 11h7v12H8Zm20 0c0-9 4-16 12-20l2 3c-5 3-7 7-7 11h7v12H28Z" opacity=".9" />
            </svg>
            <blockquote key={index} aria-live="polite">
              <p>{review.quote}</p>
              <footer data-part="who">
                <b>{review.name}</b>
                <span>{review.meta}</span>
              </footer>
            </blockquote>
            <div data-part="nav">
              {reviews.map((item, itemIndex) => (
                <button
                  key={item.name}
                  data-part="dot"
                  type="button"
                  data-static={!auto}
                  aria-current={itemIndex === index}
                  aria-label={`${reviewLabel} ${itemIndex + 1}`}
                  onClick={() => setIndex(itemIndex)}
                >
                  {String(itemIndex + 1).padStart(2, "0")}
                  <i key={itemIndex === index ? `on-${index}` : "off"} onAnimationEnd={() => auto && go(1)} />
                </button>
              ))}
              <div data-part="arrows">
                <button type="button" aria-label={prevLabel} onClick={() => go(-1)}>
                  <svg data-dir="prev" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M13 8H3M7 4 3 8l4 4" />
                  </svg>
                </button>
                <button type="button" aria-label={nextLabel} onClick={() => go(1)}>
                  <svg data-dir="next" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

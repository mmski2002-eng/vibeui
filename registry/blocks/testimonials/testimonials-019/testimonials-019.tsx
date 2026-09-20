"use client"

import { useState, type CSSProperties } from "react"

export type Testimonials019Item = {
  quote: string
  name: string
  /** «реализм · плечо · 2023». */
  meta?: string
  /** Фото зажившей работы. */
  image?: string
  imageAlt?: string
  /** «спустя 2 года». */
  after?: string
  rating?: number
}

export type Testimonials019Props = {
  eyebrow?: string
  title?: string
  items?: readonly Testimonials019Item[]
  prevLabel?: string
  nextLabel?: string
  /** aria звёзд и точек. */
  ratingLine?: string
  dotLine?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Отзывы каруселью coverflow: активная карточка в центре и в полный
// размер, соседи уходят в глубину с поворотом (rotateY) и затемнением,
// позиция каждой считается от расстояния до активной. На карточке фото
// зажившей работы с плашкой «спустя N лет», цитата и рейтинг неоновыми
// звёздами. Стрелки, точки и клавиатура; клик по соседу делает его
// активным.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"

const STYLES = `
:where([data-vibeui-block="testimonials-019"]){
--vibeui-testimonials-019-bg:#07060b;
--vibeui-testimonials-019-fg:#f3eefc;
--vibeui-testimonials-019-muted:#a39bb5;
--vibeui-testimonials-019-line:rgb(255 255 255 / .12);
--vibeui-testimonials-019-card:#110e1a;
--vibeui-testimonials-019-accent:#ff2bd6;
--vibeui-testimonials-019-cyan:#22f3ff;
--vibeui-testimonials-019-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-testimonials-019-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-testimonials-019-mono:"JetBrains Mono",ui-monospace,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-019"]{color-scheme:dark}
:where([data-vibeui-block="testimonials-019"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="testimonials-019"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="testimonials-019"]{box-sizing:border-box;display:block;overflow:hidden;background:var(--vibeui-testimonials-019-bg);color:var(--vibeui-testimonials-019-fg);font-family:var(--vibeui-testimonials-019-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="testimonials-019"] *{box-sizing:border-box}
[data-vibeui-block="testimonials-019"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="testimonials-019"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:1rem 2rem;margin-bottom:2rem}
[data-vibeui-block="testimonials-019"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 .75rem;font-family:var(--vibeui-testimonials-019-mono);font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-testimonials-019-cyan);text-shadow:0 0 10px color-mix(in oklab,var(--vibeui-testimonials-019-cyan) 70%,transparent)}
[data-vibeui-block="testimonials-019"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-testimonials-019-cyan);box-shadow:0 0 8px var(--vibeui-testimonials-019-cyan)}
[data-vibeui-block="testimonials-019"] [data-part="title"]{margin:0;font-family:var(--vibeui-testimonials-019-display);font-size:clamp(1.8rem,3.8cqi,2.8rem);font-weight:700;line-height:1.05;letter-spacing:-.02em;text-transform:uppercase}
[data-vibeui-block="testimonials-019"] [data-part="arrows"]{display:flex;gap:.5rem}
[data-vibeui-block="testimonials-019"] [data-part="arrows"] button,[data-vibeui-block="testimonials-019"] [data-part="dot"]{border:1px solid var(--vibeui-testimonials-019-line);background:transparent;color:inherit;font:inherit;cursor:pointer;transition:border-color .25s,box-shadow .3s,background .25s}
[data-vibeui-block="testimonials-019"] [data-part="arrows"] button{width:2.75rem;height:2.75rem;border-radius:50%;display:grid;place-items:center}
[data-vibeui-block="testimonials-019"] [data-part="arrows"] button:hover{border-color:var(--vibeui-testimonials-019-accent);box-shadow:0 0 16px color-mix(in oklab,var(--vibeui-testimonials-019-accent) 55%,transparent)}
[data-vibeui-block="testimonials-019"] [data-part="arrows"] button:focus-visible,[data-vibeui-block="testimonials-019"] [data-part="dot"]:focus-visible,[data-vibeui-block="testimonials-019"] [data-part="card"]:focus-visible{outline:2px solid var(--vibeui-testimonials-019-cyan);outline-offset:3px}
[data-vibeui-block="testimonials-019"] [data-part="arrows"] svg{width:1rem;height:1rem}
[data-vibeui-block="testimonials-019"] [data-part="stage"]{position:relative;height:30rem;perspective:1600px}
[data-vibeui-block="testimonials-019"] [data-part="card"]{position:absolute;left:50%;top:0;width:min(22rem,86cqi);margin-left:calc(min(22rem,86cqi) / -2);display:flex;flex-direction:column;gap:.9rem;padding:1rem;border:1px solid color-mix(in oklab,var(--vibeui-testimonials-019-accent) 45%,transparent);border-radius:1rem;background:var(--vibeui-testimonials-019-card);color:inherit;font:inherit;text-align:left;cursor:pointer;transform:translateX(calc(var(--vibeui-testimonials-019-d) * 60%)) translateZ(calc(var(--vibeui-testimonials-019-abs) * -14rem)) rotateY(calc(var(--vibeui-testimonials-019-d) * -28deg));opacity:calc(1 - var(--vibeui-testimonials-019-abs) * .35);filter:brightness(calc(1 - var(--vibeui-testimonials-019-abs) * .35));z-index:calc(10 - var(--vibeui-testimonials-019-abs));transition:transform .7s cubic-bezier(.2,.8,.2,1),opacity .7s,filter .7s;box-shadow:0 0 0 1px rgb(0 0 0 / .4),0 30px 60px -30px rgb(0 0 0 / .8)}
[data-vibeui-block="testimonials-019"] [data-part="card"][data-active="true"]{cursor:default;box-shadow:0 0 0 1px rgb(0 0 0 / .4),0 0 30px color-mix(in oklab,var(--vibeui-testimonials-019-accent) 40%,transparent),0 30px 60px -30px rgb(0 0 0 / .8)}
[data-vibeui-block="testimonials-019"] [data-part="card"][data-hidden="true"]{opacity:0;pointer-events:none}
[data-vibeui-block="testimonials-019"] [data-part="photo"]{position:relative;aspect-ratio:4/3;overflow:hidden;border-radius:.6rem;background:#1a1526}
[data-vibeui-block="testimonials-019"] [data-part="photo"] img{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="testimonials-019"] [data-part="after"]{position:absolute;left:.6rem;bottom:.6rem;padding:.25rem .6rem;border-radius:.35rem;background:rgb(7 6 11 / .75);border:1px solid color-mix(in oklab,var(--vibeui-testimonials-019-cyan) 60%,transparent);font-family:var(--vibeui-testimonials-019-mono);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-testimonials-019-cyan)}
[data-vibeui-block="testimonials-019"] [data-part="quote"]{margin:0;font-size:.95rem;line-height:1.5}
[data-vibeui-block="testimonials-019"] [data-part="who"]{display:flex;align-items:center;justify-content:space-between;gap:.75rem;margin-top:auto;padding-top:.75rem;border-top:1px solid var(--vibeui-testimonials-019-line)}
[data-vibeui-block="testimonials-019"] [data-part="name"]{display:block;font-family:var(--vibeui-testimonials-019-display);font-size:.95rem;font-weight:600}
[data-vibeui-block="testimonials-019"] [data-part="meta"]{display:block;font-size:.78rem;color:var(--vibeui-testimonials-019-muted)}
[data-vibeui-block="testimonials-019"] [data-part="stars"]{font-size:.85rem;letter-spacing:.1em;color:var(--vibeui-testimonials-019-accent);text-shadow:0 0 8px var(--vibeui-testimonials-019-accent)}
[data-vibeui-block="testimonials-019"] [data-part="dots"]{display:flex;justify-content:center;gap:.5rem;margin:1.5rem 0 0;padding:0;list-style:none}
[data-vibeui-block="testimonials-019"] [data-part="dot"]{width:.6rem;height:.6rem;padding:0;border-radius:50%}
[data-vibeui-block="testimonials-019"] [data-part="dot"][aria-current="true"]{background:var(--vibeui-testimonials-019-accent);border-color:var(--vibeui-testimonials-019-accent);box-shadow:0 0 10px var(--vibeui-testimonials-019-accent)}
@container (min-width: 60rem){
[data-vibeui-block="testimonials-019"] [data-part="shell"]{padding:5.5rem 2rem}
[data-vibeui-block="testimonials-019"] [data-part="stage"]{height:32rem}
[data-vibeui-block="testimonials-019"] [data-part="card"]{transform:translateX(calc(var(--vibeui-testimonials-019-d) * 78%)) translateZ(calc(var(--vibeui-testimonials-019-abs) * -12rem)) rotateY(calc(var(--vibeui-testimonials-019-d) * -32deg))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-019"] *{animation:none!important;transition:none!important}}`

const P = "/demo/tattoo"

const DEFAULT_ITEMS: Testimonials019Item[] = [
  { quote: "Марк переспросил три раза, где будет проходить рукав рубашки. Через два года лев смотрится так, будто сделан вчера.", name: "Илья", meta: "реализм · предплечье · 2023", image: `${P}/healed-01.webp`, after: "спустя 2 года", rating: 5 },
  { quote: "Боялась, что тонкие линии поплывут. Лина сделала эскиз прямо на коже, и папоротник до сих пор ровный до последнего листа.", name: "Марина", meta: "минимализм · плечо · 2024", image: `${P}/healed-02.webp`, after: "спустя год", rating: 5 },
  { quote: "Ася уговорила поменять ромашки на пионы — и была права. Цвет не выцвел, хотя бедро всё лето на солнце.", name: "Кира", meta: "нео-традишнл · бедро · 2022", image: `${P}/healed-03.webp`, after: "спустя 3 года", rating: 5 },
  { quote: "Орнамент на голени — 9 часов за два сеанса. Тимур каждые сорок минут давал перерыв, и это правда помогло.", name: "Денис", meta: "графика · голень · 2024", image: `${P}/healed-04.webp`, after: "спустя год", rating: 5 },
]

/** Отзывы тату-студии каруселью coverflow с фото заживших работ. */
export function Testimonials019({
  eyebrow = "Отзывы",
  title = "Как это выглядит спустя годы",
  items = DEFAULT_ITEMS,
  prevLabel = "Предыдущий",
  nextLabel = "Следующий",
  ratingLine = "{n} из 5",
  dotLine = "Отзыв {n}",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Testimonials019Props) {
  const [active, setActive] = useState(Math.min(1, items.length - 1))
  const palette = {
    ...(accent ? { "--vibeui-testimonials-019-accent": accent } : null),
    ...(background ? { "--vibeui-testimonials-019-bg": background } : null),
    ...style,
  } as CSSProperties
  const go = (index: number) => setActive((index + items.length) % items.length)

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-testimonials-019" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="testimonials-019" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
            </div>
            <div data-part="arrows">
              <button type="button" aria-label={prevLabel} onClick={() => go(active - 1)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
              <button type="button" aria-label={nextLabel} onClick={() => go(active + 1)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div data-part="stage" onKeyDown={(event) => (event.key === "ArrowRight" ? go(active + 1) : event.key === "ArrowLeft" ? go(active - 1) : null)}>
            {items.map((item, index) => {
              const d = index - active
              const abs = Math.abs(d)
              return (
                <button
                  type="button"
                  key={item.name + index}
                  data-part="card"
                  data-active={index === active}
                  data-hidden={abs > 2 ? "true" : undefined}
                  aria-hidden={index === active ? undefined : "true"}
                  tabIndex={index === active ? 0 : -1}
                  style={{ ["--vibeui-testimonials-019-d" as string]: d, ["--vibeui-testimonials-019-abs" as string]: abs }}
                  onClick={() => go(index)}
                >
                  {item.image ? (
                    <span data-part="photo">
                      <img src={item.image} alt={item.imageAlt ?? ""} loading="lazy" />
                      {item.after ? <span data-part="after">{item.after}</span> : null}
                    </span>
                  ) : null}
                  <p data-part="quote">«{item.quote}»</p>
                  <span data-part="who">
                    <span>
                      <span data-part="name">{item.name}</span>
                      {item.meta ? <span data-part="meta">{item.meta}</span> : null}
                    </span>
                    {item.rating ? (
                      <span data-part="stars" aria-label={ratingLine.replace("{n}", String(item.rating))}>
                        {"★".repeat(item.rating)}
                      </span>
                    ) : null}
                  </span>
                </button>
              )
            })}
          </div>
          <ul data-part="dots">
            {items.map((item, index) => (
              <li key={item.name + index}>
                <button type="button" data-part="dot" aria-current={index === active ? "true" : undefined} aria-label={dotLine.replace("{n}", String(index + 1))} onClick={() => go(index)} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

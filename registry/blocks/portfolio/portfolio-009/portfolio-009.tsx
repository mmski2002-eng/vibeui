"use client"

import { useState, type CSSProperties } from "react"

export type Portfolio009Card = {
  src: string
  alt?: string
  /** Подпись на лицевой стороне рукописным. */
  caption?: string
  /** Текст на обороте — как на открытке. */
  back?: string
  /** Откуда: город на штампе оборота. */
  from?: string
  date?: string
  /** Форма: wide 3:2, tall 4:5, square 1:1. */
  shape?: "wide" | "tall" | "square"
}

export type Portfolio009Props = {
  eyebrow?: string
  title?: string
  lede?: string
  cards?: readonly Portfolio009Card[]
  /** Кому адресованы открытки на обороте. */
  addressee?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Галерея-открытки: фото на кремовом картоне с полоской скотча, подпись
// рукописным; клик переворачивает карточку — на обороте разлиновка,
// штамп с городом и датой, текст открытки и адрес. Раскладка — колонки
// masonry, три формы карточек. Переворот — 3D с perspective, reduced motion
// показывает оборот без вращения.
const FONTS = "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Lobster&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="portfolio-009"]){
--vibeui-portfolio-009-bg:light-dark(#f3e9d2,#1c2a34);
--vibeui-portfolio-009-paper:#fffaf0;
--vibeui-portfolio-009-fg:light-dark(#123a4b,#eef4f2);
--vibeui-portfolio-009-ink:#123a4b;
--vibeui-portfolio-009-muted:light-dark(#5b6f78,#9fb2b8);
--vibeui-portfolio-009-line:light-dark(#e3d7bf,#2c3f4a);
--vibeui-portfolio-009-accent:#ff6b57;
--vibeui-portfolio-009-sea:#2aa7a0;
--vibeui-portfolio-009-sun:#f2c14e;
--vibeui-portfolio-009-display:"Oswald","Arial Narrow",Impact,sans-serif;
--vibeui-portfolio-009-script:"Lobster","Brush Script MT",cursive;
--vibeui-portfolio-009-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="portfolio-009"]{color-scheme:dark}
:where([data-vibeui-block="portfolio-009"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="portfolio-009"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="portfolio-009"]{box-sizing:border-box;display:block;background:var(--vibeui-portfolio-009-bg);color:var(--vibeui-portfolio-009-fg);font-family:var(--vibeui-portfolio-009-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="portfolio-009"] *{box-sizing:border-box}
[data-vibeui-block="portfolio-009"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="portfolio-009"] [data-part="head"]{display:grid;gap:.6rem;max-width:40rem;margin-bottom:2.5rem}
[data-vibeui-block="portfolio-009"] [data-part="eyebrow"]{margin:0;font-family:var(--vibeui-portfolio-009-display);font-size:.8rem;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--vibeui-portfolio-009-accent)}
[data-vibeui-block="portfolio-009"] [data-part="title"]{margin:0;font-family:var(--vibeui-portfolio-009-display);font-size:clamp(2.2rem,6cqi,4.2rem);font-weight:700;line-height:.98;text-transform:uppercase}
[data-vibeui-block="portfolio-009"] [data-part="lede"]{margin:0;color:var(--vibeui-portfolio-009-muted)}
[data-vibeui-block="portfolio-009"] [data-part="grid"]{columns:2;column-gap:1.25rem}
[data-vibeui-block="portfolio-009"] [data-part="card"]{position:relative;display:block;width:100%;margin:0 0 1.25rem;padding:0;border:0;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;break-inside:avoid;perspective:1400px}
[data-vibeui-block="portfolio-009"] [data-part="card"]:focus-visible{outline:none}
[data-vibeui-block="portfolio-009"] [data-part="card"]:focus-visible [data-part="inner"]{outline:3px solid var(--vibeui-portfolio-009-sea);outline-offset:4px}
[data-vibeui-block="portfolio-009"] [data-part="inner"]{position:relative;display:block;transform-style:preserve-3d;transition:transform .8s cubic-bezier(.2,.9,.3,1);border-radius:.3rem}
[data-vibeui-block="portfolio-009"] [data-part="card"][data-flipped="true"] [data-part="inner"]{transform:rotateY(180deg)}
[data-vibeui-block="portfolio-009"] [data-part="card"]:hover [data-part="inner"]{box-shadow:0 26px 40px -26px rgb(18 58 75 / .6)}
[data-vibeui-block="portfolio-009"] [data-part="front"],[data-vibeui-block="portfolio-009"] [data-part="back"]{backface-visibility:hidden;border-radius:.3rem;background:var(--vibeui-portfolio-009-paper);color:var(--vibeui-portfolio-009-ink);box-shadow:0 18px 30px -24px rgb(18 58 75 / .6)}
[data-vibeui-block="portfolio-009"] [data-part="front"]{position:relative;display:block;padding:.7rem .7rem 2.4rem}
[data-vibeui-block="portfolio-009"] [data-part="front"]::before{content:"";position:absolute;top:-.55rem;left:50%;width:5rem;height:1.3rem;margin-left:-2.5rem;background:rgb(255 255 255 / .55);box-shadow:0 1px 2px rgb(0 0 0 / .12);transform:rotate(-2deg)}
[data-vibeui-block="portfolio-009"] [data-part="card"]:nth-child(3n) [data-part="front"]::before{transform:rotate(3deg)}
[data-vibeui-block="portfolio-009"] [data-part="pic"]{display:block;overflow:hidden;background:var(--vibeui-portfolio-009-line);aspect-ratio:3/2}
[data-vibeui-block="portfolio-009"] [data-part="card"][data-shape="tall"] [data-part="pic"]{aspect-ratio:4/5}
[data-vibeui-block="portfolio-009"] [data-part="card"][data-shape="square"] [data-part="pic"]{aspect-ratio:1}
[data-vibeui-block="portfolio-009"] [data-part="pic"] img{display:block;width:100%;height:100%;object-fit:cover;filter:saturate(1.05)}
[data-vibeui-block="portfolio-009"] [data-part="cap"]{position:absolute;left:.7rem;right:.7rem;bottom:.55rem;font-family:var(--vibeui-portfolio-009-script);font-size:1.15rem;line-height:1.2;color:var(--vibeui-portfolio-009-ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
[data-vibeui-block="portfolio-009"] [data-part="back"]{position:absolute;inset:0;display:grid;grid-template-columns:1.2fr 1fr;transform:rotateY(180deg);overflow:hidden}
[data-vibeui-block="portfolio-009"] [data-part="back"]::before{content:"";position:absolute;top:1rem;bottom:1rem;left:55%;width:1px;background:var(--vibeui-portfolio-009-line)}
[data-vibeui-block="portfolio-009"] [data-part="text"]{padding:1.1rem 1rem 1rem 1.1rem;font-family:var(--vibeui-portfolio-009-script);font-size:1.05rem;line-height:1.35;overflow:hidden}
[data-vibeui-block="portfolio-009"] [data-part="text"] small{display:block;margin-bottom:.4rem;font-family:var(--vibeui-portfolio-009-font);font-size:.6rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-portfolio-009-muted)}
[data-vibeui-block="portfolio-009"] [data-part="addr"]{position:relative;display:grid;align-content:end;gap:.4rem;padding:1rem 1rem 1rem 1.4rem}
[data-vibeui-block="portfolio-009"] [data-part="addr"] i{display:block;height:1px;background:var(--vibeui-portfolio-009-line)}
[data-vibeui-block="portfolio-009"] [data-part="addr"] span{font-family:var(--vibeui-portfolio-009-script);font-size:1rem;color:var(--vibeui-portfolio-009-ink)}
[data-vibeui-block="portfolio-009"] [data-part="postmark"]{position:absolute;top:.7rem;right:.7rem;width:4.2rem;height:4.2rem;transform:rotate(-12deg);opacity:.85}
[data-vibeui-block="portfolio-009"] [data-part="postmark"] svg{display:block;width:100%;height:100%;overflow:visible}
[data-vibeui-block="portfolio-009"] [data-part="postmark"] circle{fill:none;stroke:var(--vibeui-portfolio-009-accent);stroke-width:2}
[data-vibeui-block="portfolio-009"] [data-part="postmark"] text{font-family:var(--vibeui-portfolio-009-display);font-weight:600;fill:var(--vibeui-portfolio-009-accent);text-anchor:middle;letter-spacing:1px}
[data-vibeui-block="portfolio-009"] [data-part="stamp"]{position:absolute;top:.6rem;right:5.2rem;width:2.4rem;height:2.9rem;border:.25rem solid var(--vibeui-portfolio-009-paper);background:var(--vibeui-portfolio-009-sea);outline:2px dashed var(--vibeui-portfolio-009-paper);outline-offset:-.45rem;box-shadow:0 0 0 1px var(--vibeui-portfolio-009-line)}
[data-vibeui-block="portfolio-009"] [data-part="card"]:nth-child(even) [data-part="stamp"]{background:var(--vibeui-portfolio-009-sun)}
@container (max-width:40rem){
[data-vibeui-block="portfolio-009"] [data-part="back"]{grid-template-columns:1fr}
[data-vibeui-block="portfolio-009"] [data-part="back"]::before,[data-vibeui-block="portfolio-009"] [data-part="addr"]{display:none}
}
@container (min-width:40rem){
[data-vibeui-block="portfolio-009"] [data-part="grid"]{columns:3}
}
@container (min-width:64rem){
[data-vibeui-block="portfolio-009"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="portfolio-009"] [data-part="grid"]{columns:4;column-gap:1.5rem}
[data-vibeui-block="portfolio-009"] [data-part="card"]{margin-bottom:1.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="portfolio-009"] *{animation:none!important;transition:none!important}}`

/** Галерея-открытки: фото на картоне со скотчем, клик переворачивает — на обороте штамп, текст и адрес. */
export function Portfolio009({
  eyebrow = "Открытки",
  title = "Что мы вам писали",
  lede = "Из каждой поездки мы отправляли друг другу открытки — даже когда сидели рядом. Переверните любую.",
  cards = [
    { src: "", caption: "Велосипед на двоих", back: "Соня едет на раме и командует. Я кручу. Всё как всегда.", from: "Trinidad", date: "03.2026", shape: "wide" },
    { src: "", caption: "Дверь в Гаване", back: "Синяя, облупленная, идеальная. Соня сказала «поженимся здесь». Я сказал «где здесь?»", from: "La Habana", date: "10.2025", shape: "tall" },
    { src: "", caption: "Лежим", back: "Море +27, мы +100. Не звоните.", from: "Cayo Largo", date: "10.2025", shape: "wide" },
    { src: "", caption: "Кокос", back: "Один на двоих, две трубочки. Тимур выпил больше.", from: "Varadero", date: "10.2025", shape: "square" },
    { src: "", caption: "Сон на площади", back: "Нас научили за десять минут. Врут. Но было весело.", from: "La Habana", date: "10.2025", shape: "wide" },
    { src: "", caption: "Пирс", back: "Здесь он спросил. Тут я и ответила. Смотрите на воду — она бирюзовая, честно.", from: "Cayo Largo", date: "10.2025", shape: "tall" },
    { src: "", caption: "Маленький самолёт", back: "Сорок минут, восемь кресел, оба спали. Проснулись женихом и невестой.", from: "над морем", date: "10.2025", shape: "wide" },
    { src: "", caption: "Закат", back: "Ничего не написали. Просто смотрели.", from: "Cayo Largo", date: "10.2025", shape: "wide" },
  ],
  addressee = "Дорогим гостям",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Portfolio009Props) {
  const [flipped, setFlipped] = useState<Set<number>>(() => new Set())
  const palette = {
    ...(accent ? { "--vibeui-portfolio-009-accent": accent } : null),
    ...(background ? { "--vibeui-portfolio-009-bg": background } : null),
    ...style,
  } as CSSProperties

  function flip(index: number) {
    setFlipped((current) => {
      const next = new Set(current)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-portfolio-009" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="portfolio-009" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <p data-part="eyebrow">{eyebrow}</p>
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="grid">
            {cards.map((card, index) => (
              <button key={card.src + index} type="button" data-part="card" data-shape={card.shape ?? "wide"} data-flipped={flipped.has(index) ? "true" : undefined} aria-pressed={flipped.has(index)} aria-label={card.caption ?? card.alt ?? `${index + 1}`} onClick={() => flip(index)}>
                <span data-part="inner">
                  <span data-part="front">
                    <span data-part="pic">{card.src ? <img src={card.src} alt={card.alt ?? ""} loading="lazy" /> : null}</span>
                    {card.caption ? <span data-part="cap">{card.caption}</span> : null}
                  </span>
                  <span data-part="back" aria-hidden={!flipped.has(index)}>
                    <span data-part="text">
                      {card.from || card.date ? <small>{[card.from, card.date].filter(Boolean).join(", ")}</small> : null}
                      {card.back}
                    </span>
                    <span data-part="addr">
                      <span data-part="stamp" aria-hidden="true" />
                      <span data-part="postmark" aria-hidden="true">
                        <svg viewBox="0 0 60 60">
                          <circle cx="30" cy="30" r="27" />
                          <circle cx="30" cy="30" r="21" strokeWidth="1" />
                          <text x="30" y="27" fontSize="7">
                            {card.from ?? ""}
                          </text>
                          <text x="30" y="37" fontSize="6.5">
                            {card.date ?? ""}
                          </text>
                        </svg>
                      </span>
                      <i />
                      <i />
                      <i />
                      <span>{addressee}</span>
                    </span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

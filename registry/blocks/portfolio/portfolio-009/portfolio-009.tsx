"use client"

import { useState, type CSSProperties } from "react"
import { Button103 } from "@/registry/components/button/button-103/button-103"

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
  ink?: string
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
--vibeui-portfolio-009-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-portfolio-009-paper:#fffaf0;
--vibeui-portfolio-009-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-portfolio-009-ink:#123a4b;
--vibeui-portfolio-009-muted:light-dark(#5b6f78,#a3a3a3);
--vibeui-portfolio-009-line:light-dark(#e3d7bf,#2e2e2e);
--vibeui-portfolio-009-accent:light-dark(#1a1a1a,#f2f2f2);
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
[data-vibeui-block="portfolio-009"] [data-part="card"]{width:100%;margin:0 0 1.25rem}
[data-vibeui-block="portfolio-009"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="portfolio-009"] [data-part="head"]{display:grid;gap:.6rem;max-width:40rem;margin-bottom:2.5rem}
[data-vibeui-block="portfolio-009"] [data-part="eyebrow"]{margin:0;font-family:var(--vibeui-portfolio-009-display);font-size:.8rem;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--vibeui-portfolio-009-accent)}
[data-vibeui-block="portfolio-009"] [data-part="title"]{margin:0;font-family:var(--vibeui-portfolio-009-display);font-size:clamp(2.2rem,6cqi,4.2rem);font-weight:700;line-height:.98;text-transform:uppercase}
[data-vibeui-block="portfolio-009"] [data-part="lede"]{margin:0;color:var(--vibeui-portfolio-009-muted)}
[data-vibeui-block="portfolio-009"] [data-part="grid"]{columns:2;column-gap:1.25rem}

@container (min-width:40rem){
[data-vibeui-block="portfolio-009"] [data-part="grid"]{columns:3}
}
@container (min-width:64rem){
[data-vibeui-block="portfolio-009"] [data-part="card"]{margin-bottom:1.5rem}
[data-vibeui-block="portfolio-009"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="portfolio-009"] [data-part="grid"]{columns:4;column-gap:1.5rem}
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
  ink,
  background,
  className,
  style,
}: Portfolio009Props) {
  const [flipped, setFlipped] = useState<Set<number>>(() => new Set())
  const palette = {
    ...(accent ? { "--vibeui-portfolio-009-accent": accent } : null),
    ...(ink ? { "--vibeui-portfolio-009-fg": ink } : null),
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
              <Button103 key={card.src + index} data-part="card" src={card.src} shape={card.shape} caption={card.caption} alt={card.alt} from={card.from} date={card.date} back={card.back} addressee={addressee} flipped={flipped} index={index} data-flipped={flipped.has(index) ? "true" : undefined} aria-pressed={flipped.has(index)} aria-label={card.caption ?? card.alt ?? `${index + 1}`} onClick={() => flip(index)} accent={accent} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

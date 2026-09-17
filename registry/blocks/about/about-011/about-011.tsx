"use client"

import { useRef, type CSSProperties, type WheelEvent } from "react"

export type About011Frame = {
  /** Подпись даты: «Май 2021». */
  date: string
  title: string
  text?: string
  image?: string
  imageAlt?: string
}

export type About011Props = {
  eyebrow?: string
  title?: string
  lede?: string
  frames?: readonly About011Frame[]
  /** Подписи стрелок для скринридера. */
  prevLabel?: string
  nextLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Наша история» плёночной лентой: кадры с перфорацией по краям идут
// горизонтальной прокруткой со snap'ом, каждый чуть повёрнут по-своему,
// под фото дата и пара строк. Стрелки листают на ширину кадра; колесо и
// свайп работают сами. Слева заголовок и лид, они остаются на месте.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="about-011"]){
--vibeui-about-011-bg:light-dark(#f6f1e8,#17131a);
--vibeui-about-011-fg:light-dark(#2b1a24,#f3ebe4);
--vibeui-about-011-muted:light-dark(#7a6a70,#b3a5aa);
--vibeui-about-011-line:light-dark(#e2d8ca,#372b31);
--vibeui-about-011-card:light-dark(#fffaf3,#211a25);
--vibeui-about-011-accent:#b8552f;
--vibeui-about-011-plum:light-dark(#4a1f36,#e9c7d6);
--vibeui-about-011-sand:light-dark(#d9c5a5,#5a4a3a);
--vibeui-about-011-film:light-dark(#2b1a24,#0c090e);
--vibeui-about-011-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-about-011-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="about-011"]{color-scheme:dark}
:where([data-vibeui-block="about-011"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="about-011"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="about-011"]{box-sizing:border-box;display:block;overflow:hidden;background:var(--vibeui-about-011-bg);color:var(--vibeui-about-011-fg);font-family:var(--vibeui-about-011-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="about-011"] *{box-sizing:border-box}
[data-vibeui-block="about-011"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="about-011"] [data-part="head"]{display:grid;gap:1rem;margin-bottom:2rem}
[data-vibeui-block="about-011"] [data-part="eyebrow"]{margin:0;font-size:.72rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--vibeui-about-011-accent)}
[data-vibeui-block="about-011"] [data-part="title"]{margin:0;font-family:var(--vibeui-about-011-display);font-size:clamp(2rem,5cqi,3.6rem);font-weight:500;font-style:italic;line-height:1.05;letter-spacing:-.01em;color:var(--vibeui-about-011-plum);text-wrap:balance}
[data-vibeui-block="about-011"] [data-part="lede"]{max-width:36rem;margin:0;color:var(--vibeui-about-011-muted)}
[data-vibeui-block="about-011"] [data-part="nav"]{display:flex;gap:.5rem}
[data-vibeui-block="about-011"] [data-part="nav"] button{display:inline-flex;align-items:center;justify-content:center;width:2.75rem;height:2.75rem;border:1px solid var(--vibeui-about-011-line);border-radius:50%;background:transparent;color:inherit;cursor:pointer;transition:border-color .25s,transform .2s}
[data-vibeui-block="about-011"] [data-part="nav"] button:hover{border-color:var(--vibeui-about-011-accent);color:var(--vibeui-about-011-accent);transform:translateY(-1px)}
[data-vibeui-block="about-011"] [data-part="nav"] button:focus-visible{outline:2px solid var(--vibeui-about-011-accent);outline-offset:3px}
[data-vibeui-block="about-011"] [data-part="nav"] svg{width:1.1rem;height:1.1rem;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
[data-vibeui-block="about-011"] [data-part="track"]{display:flex;gap:1.25rem;margin:0 -1.25rem;padding:1.5rem 1.25rem 2rem;list-style:none;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch}
[data-vibeui-block="about-011"] [data-part="track"]::-webkit-scrollbar{display:none}
[data-vibeui-block="about-011"] [data-part="frame"]{flex:0 0 min(78cqi,20rem);scroll-snap-align:center;transform:rotate(var(--vibeui-about-011-tilt,0deg));transition:transform .4s cubic-bezier(.2,.9,.3,1)}
[data-vibeui-block="about-011"] [data-part="frame"]:nth-child(odd){--vibeui-about-011-tilt:-2deg}
[data-vibeui-block="about-011"] [data-part="frame"]:nth-child(even){--vibeui-about-011-tilt:1.6deg}
[data-vibeui-block="about-011"] [data-part="frame"]:nth-child(3n){--vibeui-about-011-tilt:-1deg}
[data-vibeui-block="about-011"] [data-part="frame"]:hover{transform:rotate(0) translateY(-.35rem)}
[data-vibeui-block="about-011"] [data-part="film"]{position:relative;padding:1.1rem .6rem;border-radius:.4rem;background:var(--vibeui-about-011-film);box-shadow:0 24px 40px -24px rgb(43 26 36 / .6),0 0 0 1px rgb(255 255 255 / .06)}
[data-vibeui-block="about-011"] [data-part="film"]::before,[data-vibeui-block="about-011"] [data-part="film"]::after{content:"";position:absolute;left:.6rem;right:.6rem;height:.5rem;background:repeating-linear-gradient(90deg,var(--vibeui-about-011-bg) 0 .55rem,transparent .55rem 1.1rem);border-radius:2px;opacity:.85}
[data-vibeui-block="about-011"] [data-part="film"]::before{top:.3rem}
[data-vibeui-block="about-011"] [data-part="film"]::after{bottom:.3rem}
[data-vibeui-block="about-011"] [data-part="picture"]{display:block;aspect-ratio:3/2;overflow:hidden;background:var(--vibeui-about-011-sand)}
[data-vibeui-block="about-011"] [data-part="picture"] img{display:block;width:100%;height:100%;object-fit:cover;filter:saturate(.9) contrast(1.02)}
[data-vibeui-block="about-011"] [data-part="stamp"]{position:absolute;right:.9rem;bottom:1.4rem;font-family:var(--vibeui-about-011-display);font-size:.8rem;letter-spacing:.1em;color:var(--vibeui-about-011-accent);text-transform:uppercase;mix-blend-mode:screen}
[data-vibeui-block="about-011"] [data-part="caption"]{padding:1rem .35rem 0}
[data-vibeui-block="about-011"] [data-part="date"]{display:block;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-about-011-accent)}
[data-vibeui-block="about-011"] [data-part="name"]{display:block;margin:.3rem 0 .2rem;font-family:var(--vibeui-about-011-display);font-size:1.5rem;font-weight:500;line-height:1.15;color:var(--vibeui-about-011-plum)}
[data-vibeui-block="about-011"] [data-part="text"]{margin:0;font-size:.92rem;color:var(--vibeui-about-011-muted)}
@container (min-width:56rem){
[data-vibeui-block="about-011"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="about-011"] [data-part="head"]{grid-template-columns:minmax(0,1fr) auto;align-items:end}
[data-vibeui-block="about-011"] [data-part="head"] [data-part="lede"]{grid-column:1}
[data-vibeui-block="about-011"] [data-part="nav"]{grid-column:2;grid-row:1 / span 3;align-self:end}
[data-vibeui-block="about-011"] [data-part="track"]{margin:0 -2.5rem;padding:1.5rem 2.5rem 2rem}
[data-vibeui-block="about-011"] [data-part="frame"]{flex:1 1 0;min-width:15rem;max-width:22rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="about-011"] *{animation:none!important;transition:none!important}[data-vibeui-block="about-011"] [data-part="track"]{scroll-behavior:auto}}`

/** «Наша история» плёночной лентой: кадры с перфорацией, датами и подписями, горизонтальная прокрутка со snap'ом. */
export function About011({
  eyebrow = "Наша история",
  title = "Шесть лет, четыре кадра",
  lede = "Мы не любим длинные рассказы о себе, поэтому — коротко и по кадрам. Остальное расскажем за столом.",
  frames = [
    { date: "Октябрь 2021", title: "Кофе у окна", text: "Познакомились в очереди за кофе: Артём взял её стакан, Василиса — его. Поменялись через полчаса разговора." },
    { date: "Июль 2022", title: "Первая дорога", text: "Две тысячи километров на юг, карта на коленях и один плейлист на двоих." },
    { date: "Март 2024", title: "Коробки", text: "Съехались. Первый ужин в новой квартире — пицца на полу среди коробок." },
    { date: "Май 2027", title: "Пирс на закате", text: "Артём встал на одно колено, Василиса сказала «да» ещё до вопроса." },
  ],
  prevLabel = "Назад",
  nextLabel = "Дальше",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: About011Props) {
  const track = useRef<HTMLUListElement>(null)
  const palette = {
    ...(accent ? { "--vibeui-about-011-accent": accent } : null),
    ...(background ? { "--vibeui-about-011-bg": background } : null),
    ...style,
  } as CSSProperties

  // Колесо мыши листает ленту вбок: вертикальный жест над кадрами иначе
  // просто прокручивает страницу, и лента кажется «не работающей».
  function onWheel(event: WheelEvent<HTMLUListElement>) {
    const node = event.currentTarget
    if (node.scrollWidth <= node.clientWidth) return
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
    const atStart = node.scrollLeft <= 0 && event.deltaY < 0
    const atEnd = node.scrollLeft + node.clientWidth >= node.scrollWidth - 1 && event.deltaY > 0
    if (atStart || atEnd) return
    event.preventDefault()
    node.scrollLeft += event.deltaY
  }

  function scroll(direction: -1 | 1) {
    const node = track.current
    if (!node) return
    const step = node.firstElementChild instanceof HTMLElement ? node.firstElementChild.offsetWidth + 24 : node.clientWidth * 0.8
    node.scrollBy({ left: direction * step, behavior: "smooth" })
  }

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-about-011" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="about-011" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <p data-part="eyebrow">{eyebrow}</p>
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <div data-part="nav">
              <button type="button" aria-label={prevLabel} onClick={() => scroll(-1)}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
              <button type="button" aria-label={nextLabel} onClick={() => scroll(1)}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <ul ref={track} data-part="track" onWheel={onWheel}>
            {frames.map((frame, index) => (
              <li key={frame.title} data-part="frame">
                <div data-part="film">
                  <span data-part="picture">{frame.image ? <img src={frame.image} alt={frame.imageAlt ?? ""} loading="lazy" /> : null}</span>
                  <span data-part="stamp" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}A
                  </span>
                </div>
                <div data-part="caption">
                  <span data-part="date">{frame.date}</span>
                  <span data-part="name">{frame.title}</span>
                  {frame.text ? <p data-part="text">{frame.text}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type About013Frame = {
  date: string
  title: string
  text?: string
  image?: string
  imageAlt?: string
}

export type About013Props = {
  eyebrow?: string
  /** Часть в «кавычках» уходит в курсив. */
  title?: string
  lede?: string
  /** Четыре кадра — по лампочке на каждый. */
  frames?: readonly About013Frame[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// История пары как гирлянда: провисающий провод через секцию, на нём
// четыре лампочки; пока секцию прокручивают, лампочки зажигаются одна за
// другой, под каждой — кадр с датой и текстом. Зажжённый кадр
// подсвечивается тёплым, текущий — ярче всех. Прогресс считает rAF из
// положения секции в окне, в state попадает только число зажжённых.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Marck+Script&family=Manrope:wght@400;500;600;700&display=swap"

const WIRE = "M0 30 Q125 95 250 40 Q375 95 500 40 Q625 95 750 40 Q875 95 1000 30"
const BULBS = [125, 375, 625, 875] as const

const STYLES = `
:where([data-vibeui-block="about-013"]){
--vibeui-about-013-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-about-013-card:light-dark(#ffffff,#242424);
--vibeui-about-013-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-about-013-muted:light-dark(#6b6b6b,#a3a3a3);
--vibeui-about-013-line:light-dark(color-mix(in oklab,var(--vibeui-about-013-fg) 16%,transparent),color-mix(in oklab,var(--vibeui-about-013-fg) 22%,transparent));
--vibeui-about-013-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-about-013-fire:#ff9a3c;
--vibeui-about-013-silver:#9fb0c8;
--vibeui-about-013-display:"Cormorant Garamond",Georgia,serif;
--vibeui-about-013-script:"Marck Script","Segoe Script",cursive;
--vibeui-about-013-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="about-013"]{color-scheme:dark}
:where([data-vibeui-block="about-013"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="about-013"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="about-013"]{box-sizing:border-box;position:relative;display:block;overflow:hidden;background:var(--vibeui-about-013-bg);color:var(--vibeui-about-013-fg);font-family:var(--vibeui-about-013-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="about-013"] *{box-sizing:border-box}
[data-vibeui-block="about-013"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4.5rem 1.25rem}
[data-vibeui-block="about-013"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-about-013-display);font-size:.85rem;font-weight:500;letter-spacing:.32em;text-transform:uppercase;color:var(--vibeui-about-013-silver)}
[data-vibeui-block="about-013"] [data-part="title"]{margin:0;font-family:var(--vibeui-about-013-display);font-size:clamp(2.2rem,5.5cqi,3.8rem);font-weight:500;line-height:1.05;letter-spacing:-.01em}
[data-vibeui-block="about-013"] [data-part="title"] em{font-style:italic;font-weight:400;color:var(--vibeui-about-013-accent)}
[data-vibeui-block="about-013"] [data-part="lede"]{max-width:36rem;margin:1rem 0 0;color:var(--vibeui-about-013-muted)}
[data-vibeui-block="about-013"] [data-part="wire"]{display:none;margin:2.5rem 0 -1.5rem}
[data-vibeui-block="about-013"] [data-part="wire"] svg{display:block;width:100%;height:auto;overflow:visible}
[data-vibeui-block="about-013"] [data-part="wire"] path{fill:none;stroke:var(--vibeui-about-013-line);stroke-width:1.5}
[data-vibeui-block="about-013"] [data-part="bulb"] line{stroke:var(--vibeui-about-013-line);stroke-width:1.5}
[data-vibeui-block="about-013"] [data-part="bulb"] ellipse{fill:var(--vibeui-about-013-line);transition:fill .6s,filter .6s}
[data-vibeui-block="about-013"] [data-part="bulb"] rect{fill:var(--vibeui-about-013-muted);opacity:.6}
[data-vibeui-block="about-013"] [data-part="bulb"][data-lit="true"] ellipse{fill:var(--vibeui-about-013-accent);filter:drop-shadow(0 0 6px var(--vibeui-about-013-accent)) drop-shadow(0 0 18px rgb(242 182 79 / .5))}
[data-vibeui-block="about-013"] [data-part="bulb"][data-now="true"] ellipse{fill:#fff1c9;filter:drop-shadow(0 0 8px #fff1c9) drop-shadow(0 0 26px var(--vibeui-about-013-fire));animation:vibeui-about-013-breathe 2.4s ease-in-out infinite}
@keyframes vibeui-about-013-breathe{50%{filter:drop-shadow(0 0 5px #fff1c9) drop-shadow(0 0 14px var(--vibeui-about-013-fire))}}
[data-vibeui-block="about-013"] [data-part="frames"]{display:grid;gap:1.25rem;margin:2.5rem 0 0;padding:0;list-style:none}
[data-vibeui-block="about-013"] [data-part="frame"]{position:relative;display:grid;gap:.9rem;padding:.7rem .7rem 1.2rem;border:1px solid var(--vibeui-about-013-line);border-radius:.8rem;background:var(--vibeui-about-013-card);opacity:.55;transform:translateY(.4rem);transition:opacity .7s,transform .7s cubic-bezier(.2,.9,.3,1),box-shadow .7s,border-color .7s}
[data-vibeui-block="about-013"] [data-part="frame"][data-lit="true"]{opacity:1;transform:none;border-color:rgb(242 182 79 / .35);box-shadow:0 0 0 1px rgb(242 182 79 / .12),0 24px 50px -30px rgb(242 182 79 / .45)}
[data-vibeui-block="about-013"] [data-part="frame"][data-now="true"]{border-color:rgb(242 182 79 / .6);box-shadow:0 0 0 1px rgb(242 182 79 / .2),0 0 40px -6px rgb(242 182 79 / .35)}
[data-vibeui-block="about-013"] [data-part="frame"] figure{position:relative;margin:0;aspect-ratio:3/2;overflow:hidden;border-radius:.4rem;background:var(--vibeui-about-013-bg)}
[data-vibeui-block="about-013"] [data-part="frame"] img{display:block;width:100%;height:100%;object-fit:cover;filter:saturate(.85) brightness(.85);transition:filter .7s}
[data-vibeui-block="about-013"] [data-part="frame"][data-lit="true"] img{filter:none}
[data-vibeui-block="about-013"] [data-part="frame"] figure::after{content:"";position:absolute;inset:0;background:radial-gradient(35% 30% at 0 100%,rgb(242 238 230 / .35),transparent 70%),radial-gradient(30% 25% at 100% 0,rgb(242 238 230 / .25),transparent 70%);mix-blend-mode:screen;pointer-events:none}
[data-vibeui-block="about-013"] [data-part="frame"] div{display:grid;gap:.3rem;padding:0 .4rem}
[data-vibeui-block="about-013"] [data-part="frame"] small{font-family:var(--vibeui-about-013-script);font-size:1.15rem;color:var(--vibeui-about-013-accent)}
[data-vibeui-block="about-013"] [data-part="frame"] h3{margin:0;font-family:var(--vibeui-about-013-display);font-size:1.5rem;font-weight:500;line-height:1.15}
[data-vibeui-block="about-013"] [data-part="frame"] p{margin:0;font-size:.92rem;color:var(--vibeui-about-013-muted)}
[data-vibeui-block="about-013"] [data-part="frame"] i{position:absolute;left:50%;top:-.6rem;width:1.2rem;height:1.2rem;margin-left:-.6rem;border-radius:50%;background:var(--vibeui-about-013-line);transition:background .6s,box-shadow .6s}
[data-vibeui-block="about-013"] [data-part="frame"][data-lit="true"] i{background:var(--vibeui-about-013-accent);box-shadow:0 0 12px var(--vibeui-about-013-accent)}
@container (min-width:40rem){
[data-vibeui-block="about-013"] [data-part="frames"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container (min-width:56rem){
[data-vibeui-block="about-013"] [data-part="wire"]{display:block}
[data-vibeui-block="about-013"] [data-part="frames"]{grid-template-columns:repeat(4,minmax(0,1fr));margin-top:1rem}
[data-vibeui-block="about-013"] [data-part="frame"] i{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="about-013"] *{animation:none!important;transition:none!important}[data-vibeui-block="about-013"] [data-part="frame"]{opacity:1;transform:none}[data-vibeui-block="about-013"] [data-part="bulb"] ellipse{fill:var(--vibeui-about-013-accent)}}`

/** История пары гирляндой: лампочки зажигаются при прокрутке, под каждой — кадр с датой и текстом. */
export function About013({
  eyebrow = "Наша история",
  title = "Четыре зимы «до»",
  lede = "Мы познакомились зимой и с тех пор считаем годы не по календарю, а по снегу. Эта — четвёртая.",
  frames = [
    { date: "Декабрь 2023", title: "Каток", text: "Дима упал первым, Лера — второй. Встали вместе, так и держимся." },
    { date: "Январь 2025", title: "Ёлка на двоих", text: "Несли её через весь город. Игрушек хватило на одну ветку." },
    { date: "Февраль 2026", title: "Первая зима вместе", text: "Съехались в снегопад. Коробки разбирали до весны." },
    { date: "Ноябрь 2027", title: "Под ёлкой в лесу", text: "Дима спросил под большой елью с гирляндой. Лера сказала «да» и «холодно»." },
  ],
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: About013Props) {
  const root = useRef<HTMLElement>(null)
  const [lit, setLit] = useState(0)
  const palette = {
    ...(accent ? { "--vibeui-about-013-accent": accent } : null),
    ...(ink ? { "--vibeui-about-013-fg": ink } : null),
    ...(background ? { "--vibeui-about-013-bg": background } : null),
    ...style,
  } as CSSProperties

  // Лампочки зажигаются по прокрутке: секция входит снизу — ни одной,
  // её середина прошла центр окна — все четыре. В state только число.
  useEffect(() => {
    const node = root.current
    if (!node) return
    let frame = 0
    const read = () => {
      frame = 0
      const rect = node.getBoundingClientRect()
      const viewport = window.innerHeight
      const start = viewport * 0.85
      const end = viewport * 0.3 - rect.height * 0.3
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)))
      setLit(Math.min(4, Math.floor(progress * 4.999)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }
    frame = requestAnimationFrame(read)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const shown = frames.slice(0, 4)
  const [head, tail] = title.split("«")

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-about-013" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="about-013" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">
            {head}
            {tail ? <em>{`«${tail}`}</em> : null}
          </h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="wire" aria-hidden="true">
            <svg viewBox="0 0 1000 120">
              <path d={WIRE} />
              {shown.map((item, index) => (
                <g key={item.title} data-part="bulb" data-lit={index < lit ? "true" : undefined} data-now={index === lit - 1 ? "true" : undefined}>
                  <line x1={BULBS[index]} y1={index === 0 || index === 3 ? 62 : 66} x2={BULBS[index]} y2={index % 2 ? 78 : 88} />
                  <rect x={BULBS[index] - 5} y={index % 2 ? 76 : 86} width="10" height="8" rx="1.5" />
                  <ellipse cx={BULBS[index]} cy={index % 2 ? 97 : 107} rx="9" ry="13" />
                </g>
              ))}
            </svg>
          </div>
          <ol data-part="frames">
            {shown.map((item, index) => (
              <li key={item.title} data-part="frame" data-lit={index < lit ? "true" : undefined} data-now={index === lit - 1 ? "true" : undefined}>
                <i aria-hidden="true" />
                <figure>{item.image ? <img src={item.image} alt={item.imageAlt ?? ""} loading="lazy" /> : null}</figure>
                <div>
                  <small>{item.date}</small>
                  <h3>{item.title}</h3>
                  {item.text ? <p>{item.text}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}

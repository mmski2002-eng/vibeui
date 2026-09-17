"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type About012Stop = {
  /** Код города: «MOW». */
  code: string
  city: string
  date: string
  title: string
  text?: string
  image?: string
  imageAlt?: string
}

export type About012Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Остановки по порядку — ровно четыре: старт, две пересадки, финиш. */
  stops?: readonly About012Stop[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Наш маршрут»: пунктирная линия рейса через четыре остановки, как на
// карте в бортовом журнале. На остановках — пины с кодами городов, под
// линией — карточки с круглым фото, датой и историей. Самолётик едет по
// линии, пока секцию прокручивают (offset-path + прогресс из scroll), а
// пройденная часть маршрута прорисовывается сплошной. Клик по пину
// подсвечивает карточку.
const FONTS = "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Lobster&family=Manrope:wght@400;500;600;700&display=swap"

// Точки на кривой — концы T-сегментов, поэтому пины стоят ровно на линии.
const PATH = "M60 200 Q200 40 340 100 T620 120 T940 70"
const POINTS = [
  [60, 200],
  [340, 100],
  [620, 120],
  [940, 70],
] as const

const STYLES = `
:where([data-vibeui-block="about-012"]){
--vibeui-about-012-bg:light-dark(#fffaf0,#14202a);
--vibeui-about-012-sand:light-dark(#f3e9d2,#1c2a34);
--vibeui-about-012-fg:light-dark(#123a4b,#eef4f2);
--vibeui-about-012-muted:light-dark(#5b6f78,#9fb2b8);
--vibeui-about-012-line:light-dark(#e3d7bf,#2c3f4a);
--vibeui-about-012-accent:#ff6b57;
--vibeui-about-012-sea:#2aa7a0;
--vibeui-about-012-sun:#f2c14e;
--vibeui-about-012-display:"Oswald","Arial Narrow",Impact,sans-serif;
--vibeui-about-012-script:"Lobster","Brush Script MT",cursive;
--vibeui-about-012-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="about-012"]{color-scheme:dark}
:where([data-vibeui-block="about-012"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="about-012"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="about-012"]{box-sizing:border-box;display:block;background:var(--vibeui-about-012-bg);color:var(--vibeui-about-012-fg);font-family:var(--vibeui-about-012-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="about-012"] *{box-sizing:border-box}
[data-vibeui-block="about-012"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="about-012"] [data-part="eyebrow"]{margin:0 0 .6rem;font-family:var(--vibeui-about-012-display);font-size:.8rem;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--vibeui-about-012-accent)}
[data-vibeui-block="about-012"] [data-part="title"]{margin:0;font-family:var(--vibeui-about-012-display);font-size:clamp(2.2rem,6cqi,4.2rem);font-weight:700;line-height:.98;text-transform:uppercase;letter-spacing:-.01em}
[data-vibeui-block="about-012"] [data-part="title"] em{font-family:var(--vibeui-about-012-script);font-style:normal;font-weight:400;text-transform:none;letter-spacing:0;color:var(--vibeui-about-012-sea);font-size:.75em}
[data-vibeui-block="about-012"] [data-part="lede"]{max-width:36rem;margin:.8rem 0 0;color:var(--vibeui-about-012-muted)}
[data-vibeui-block="about-012"] [data-part="map"]{position:relative;margin:2rem 0 0;padding:1rem 0 0;border-radius:1.2rem;background:radial-gradient(circle at 50% 50%,color-mix(in oklab,var(--vibeui-about-012-sea) 8%,transparent),transparent 70%),repeating-linear-gradient(0deg,transparent 0 2.4rem,color-mix(in oklab,var(--vibeui-about-012-line) 60%,transparent) 2.4rem calc(2.4rem + 1px)),repeating-linear-gradient(90deg,transparent 0 2.4rem,color-mix(in oklab,var(--vibeui-about-012-line) 60%,transparent) 2.4rem calc(2.4rem + 1px))}
[data-vibeui-block="about-012"] [data-part="map"] svg{display:block;width:100%;height:auto;overflow:visible}
[data-vibeui-block="about-012"] [data-part="trail"]{fill:none;stroke:var(--vibeui-about-012-muted);stroke-width:2;stroke-dasharray:4 8;stroke-linecap:round;opacity:.6}
[data-vibeui-block="about-012"] [data-part="done"]{fill:none;stroke:var(--vibeui-about-012-accent);stroke-width:3;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:calc(1 - var(--vibeui-about-012-k,0));transition:stroke-dashoffset .2s linear}
[data-vibeui-block="about-012"] [data-part="pin"]{cursor:pointer}
[data-vibeui-block="about-012"] [data-part="pin"] circle{fill:var(--vibeui-about-012-bg);stroke:var(--vibeui-about-012-fg);stroke-width:2.5;transition:fill .25s,stroke .25s,r .25s}
[data-vibeui-block="about-012"] [data-part="pin"] text{font-family:var(--vibeui-about-012-display);font-size:15px;font-weight:600;letter-spacing:1.5px;fill:var(--vibeui-about-012-fg);text-anchor:middle}
[data-vibeui-block="about-012"] [data-part="pin"]:hover circle,[data-vibeui-block="about-012"] [data-part="pin"][data-active="true"] circle{fill:var(--vibeui-about-012-accent);stroke:var(--vibeui-about-012-accent)}
[data-vibeui-block="about-012"] [data-part="pin"]:focus-visible{outline:none}
[data-vibeui-block="about-012"] [data-part="pin"]:focus-visible circle{stroke:var(--vibeui-about-012-sea);stroke-width:4}
[data-vibeui-block="about-012"] [data-part="plane"]{offset-path:path("${PATH}");offset-rotate:auto;offset-distance:var(--vibeui-about-012-p,0);fill:var(--vibeui-about-012-fg);transition:offset-distance .2s linear;filter:drop-shadow(0 6px 8px rgb(18 58 75 / .35))}
[data-vibeui-block="about-012"] [data-part="stops"]{display:grid;gap:1.5rem;margin:2rem 0 0;padding:0;list-style:none}
[data-vibeui-block="about-012"] [data-part="stop"]{position:relative;display:grid;grid-template-columns:5.5rem minmax(0,1fr);gap:1rem;padding:1.1rem;border:1px solid var(--vibeui-about-012-line);border-radius:1rem;background:color-mix(in oklab,var(--vibeui-about-012-sand) 60%,transparent);transition:border-color .3s,transform .3s,box-shadow .3s}
[data-vibeui-block="about-012"] [data-part="stop"][data-active="true"]{border-color:var(--vibeui-about-012-accent);transform:translateY(-.25rem);box-shadow:0 24px 40px -28px rgb(18 58 75 / .5)}
[data-vibeui-block="about-012"] [data-part="stop"] figure{margin:0;width:5.5rem;height:5.5rem;border-radius:50%;overflow:hidden;background:var(--vibeui-about-012-sand);box-shadow:0 0 0 3px var(--vibeui-about-012-bg),0 0 0 4px var(--vibeui-about-012-line)}
[data-vibeui-block="about-012"] [data-part="stop"] img{display:block;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="about-012"] [data-part="stop"] small{display:block;padding-right:3.2rem;font-family:var(--vibeui-about-012-display);font-size:.72rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--vibeui-about-012-sea)}
[data-vibeui-block="about-012"] [data-part="stop"] h3{margin:.2rem 0 .3rem;font-family:var(--vibeui-about-012-display);font-size:1.35rem;font-weight:600;line-height:1.1;text-transform:uppercase}
[data-vibeui-block="about-012"] [data-part="stop"] p{margin:0;font-size:.92rem;color:var(--vibeui-about-012-muted)}
[data-vibeui-block="about-012"] [data-part="stop"] [data-part="code"]{position:absolute;top:.6rem;right:.8rem;font-family:var(--vibeui-about-012-script);font-size:1.2rem;color:var(--vibeui-about-012-accent);opacity:.8}
@container (min-width:56rem){
[data-vibeui-block="about-012"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="about-012"] [data-part="stops"]{grid-template-columns:repeat(4,minmax(0,1fr))}
[data-vibeui-block="about-012"] [data-part="stop"]{grid-template-columns:1fr;gap:.8rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="about-012"] *{animation:none!important;transition:none!important}[data-vibeui-block="about-012"] [data-part="plane"]{offset-distance:100%}[data-vibeui-block="about-012"] [data-part="done"]{stroke-dashoffset:0}}`

/** «Наш маршрут»: пунктирная линия рейса с четырьмя остановками, самолётик едет по ней при прокрутке, карточки с фото и историей. */
export function About012({
  eyebrow = "Наш маршрут",
  title = "Четыре города до «да»",
  lede = "Мы познакомились в одной стране, влюбились в другой и решили пожениться в третьей. Так и летим.",
  stops = [
    { code: "MOW", city: "Москва", date: "Январь 2022", title: "Один стакан кофе", text: "Познакомились на мосту в снегопад: у Тимура замёрзли руки, у Сони был лишний кофе." },
    { code: "IST", city: "Стамбул", date: "Май 2023", title: "Первая пересадка", text: "Опоздали на стыковку и провели в городе сутки. Поняли, что так — лучше." },
    { code: "LIS", city: "Лиссабон", date: "Октябрь 2025", title: "Трамвай 28", text: "Соня высунулась в окно, Тимур сделал тот самый кадр. Он теперь на обложке." },
    { code: "HAV", city: "Гавана", date: "Февраль 2027", title: "Финиш — на пляже", text: "Здесь Тимур спросил, здесь Соня ответила. Здесь и поженимся — с вами." },
  ],
  tone = "auto",
  accent,
  background,
  className,
  style,
}: About012Props) {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(-1)
  const palette = {
    ...(accent ? { "--vibeui-about-012-accent": accent } : null),
    ...(background ? { "--vibeui-about-012-bg": background } : null),
    ...style,
  } as CSSProperties

  // Прогресс самолётика — CSS-переменная из прокрутки, без ререндеров:
  // 0 % когда секция входит снизу, 100 % когда её середина прошла центр.
  useEffect(() => {
    const node = root.current
    if (!node) return
    let frame = 0
    const read = () => {
      frame = 0
      const rect = node.getBoundingClientRect()
      const viewport = window.innerHeight
      const start = viewport * 0.9
      const end = viewport * 0.25 - rect.height * 0.35
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)))
      node.style.setProperty("--vibeui-about-012-p", `${(progress * 100).toFixed(1)}%`)
      node.style.setProperty("--vibeui-about-012-k", progress.toFixed(3))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }
    read()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const shown = stops.slice(0, 4)

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-about-012" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="about-012" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">
            {title.split("«")[0]}
            {title.includes("«") ? <em>{`«${title.split("«")[1]}`}</em> : null}
          </h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="map">
            <svg viewBox="0 0 1000 260" aria-hidden="true">
              <path data-part="trail" d={PATH} />
              <path data-part="done" d={PATH} pathLength={1} />
              {shown.map((stop, index) => (
                <g key={stop.code} data-part="pin" data-active={active === index ? "true" : undefined} role="button" tabIndex={0} aria-label={`${stop.code} — ${stop.city}`} onClick={() => setActive(index === active ? -1 : index)} onKeyDown={(event) => (event.key === "Enter" || event.key === " " ? setActive(index === active ? -1 : index) : undefined)}>
                  <circle cx={POINTS[index][0]} cy={POINTS[index][1]} r="11" />
                  <text x={POINTS[index][0]} y={POINTS[index][1] + (index === 0 ? 36 : -22)}>
                    {stop.code}
                  </text>
                </g>
              ))}
              <path data-part="plane" transform="translate(-12 -12)" d="M21 12.5c0 .6-.5 1-1.1 1L13 12.9 9.5 20H7.6l1.7-7.4-4.6-.6-1.7 2H1.6l1.2-3.5L1.6 7.1H3l1.7 2 4.6-.6L7.6 1h1.9L13 8.1l6.9-.6c.6 0 1.1.4 1.1 1v4z" />
            </svg>
          </div>
          <ol data-part="stops">
            {shown.map((stop, index) => (
              <li key={stop.code} data-part="stop" data-active={active === index ? "true" : undefined}>
                <figure>{stop.image ? <img src={stop.image} alt={stop.imageAlt ?? ""} loading="lazy" /> : null}</figure>
                <div>
                  <small>
                    {stop.city} · {stop.date}
                  </small>
                  <h3>{stop.title}</h3>
                  {stop.text ? <p>{stop.text}</p> : null}
                </div>
                <span data-part="code" aria-hidden="true">
                  {stop.code}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}

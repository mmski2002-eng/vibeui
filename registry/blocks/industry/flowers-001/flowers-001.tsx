"use client"

import { useEffect, useRef, type CSSProperties } from "react"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Flowers001Item = {
  name: string
  /** Состав одной строкой: «пионы, эвкалипт, мак». */
  note: string
  price: string
  /** Фото букета — постер карточки. */
  image: string
  /** Ролик: букет медленно поворачивается на подставке, бесшовный повтор. */
  video?: string
  alt?: string
  href?: string
  /** Метка в углу: «хит», «новое». */
  badge?: string
}

export type Flowers001Props = {
  eyebrow?: string
  title?: string
  lede?: string
  items?: readonly Flowers001Item[]
  /** Подпись справа от заголовка, рукописная. */
  note?: string
  allLabel?: string
  /** aria стрелок ленты. */
  prevLabel?: string
  nextLabel?: string
  allHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Каталог букетов витриной: крупные карточки, в каждой букет медленно
// поворачивается на подставке — ролик играет, только пока карточка видна
// (IntersectionObserver), вне экрана стоит на паузе. Лента выплывает
// при прокрутке (animation-timeline: view()), при наведении
// карточка приподнимается, под названием рукой прописывается росчерк,
// а цена проявляется. Порядковый номер — как в журнальном оглавлении.
// Карточки идут одной лентой со scroll-snap: листается стрелками, колесом
// и пальцем; высота карточки считается от высоты экрана, чтобы секция
// целиком помещалась в один экран.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Golos+Text:wght@400;500;600&family=Caveat:wght@500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="flowers-001"]){
--vibeui-flowers-001-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-flowers-001-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-flowers-001-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-flowers-001-on-accent:oklch(from var(--vibeui-flowers-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-flowers-001-muted:color-mix(in oklab,var(--vibeui-flowers-001-fg) 62%,var(--vibeui-flowers-001-bg));
--vibeui-flowers-001-line:color-mix(in oklab,var(--vibeui-flowers-001-fg) 14%,transparent);
--vibeui-flowers-001-card:#efe3d1;
--vibeui-flowers-001-ease:cubic-bezier(.22,1,.36,1);
--vibeui-flowers-001-display:"Cormorant",Georgia,"Times New Roman",serif;
--vibeui-flowers-001-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-flowers-001-hand:"Caveat","Segoe Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="flowers-001"]{color-scheme:dark}
:where([data-vibeui-block="flowers-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="flowers-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="flowers-001"]{box-sizing:border-box;position:relative;padding:4rem 0;background:var(--vibeui-flowers-001-bg);color:var(--vibeui-flowers-001-fg);font-family:var(--vibeui-flowers-001-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="flowers-001"] *{box-sizing:border-box}
[data-vibeui-block="flowers-001"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="flowers-001"] [data-part="head"]{display:grid;gap:1rem;align-items:end;margin:0 0 1.8rem}
[data-vibeui-block="flowers-001"] [data-part="side"]{display:flex;flex-wrap:wrap;align-items:center;gap:.8rem 1.4rem}
[data-vibeui-block="flowers-001"] [data-part="arrows"]{display:flex;gap:.5rem}
[data-vibeui-block="flowers-001"] [data-part="nav-arrow"]{display:grid;place-items:center;width:2.8rem;height:2.8rem;border-radius:50%;border:1px solid var(--vibeui-flowers-001-line);background:transparent;color:var(--vibeui-flowers-001-fg);cursor:pointer;transition:background .25s,color .25s,border-color .25s}
[data-vibeui-block="flowers-001"] [data-part="nav-arrow"]:hover{background:var(--vibeui-flowers-001-accent);border-color:var(--vibeui-flowers-001-accent);color:var(--vibeui-flowers-001-on-accent)}
[data-vibeui-block="flowers-001"] [data-part="nav-arrow"]:focus-visible{outline:2px solid var(--vibeui-flowers-001-accent);outline-offset:3px}
[data-vibeui-block="flowers-001"] [data-part="arrow-glyph"]{width:1.1rem;height:1.1rem}
[data-vibeui-block="flowers-001"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.74rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-flowers-001-muted)}
[data-vibeui-block="flowers-001"] [data-part="title"]{margin:0;font-family:var(--vibeui-flowers-001-display);font-weight:500;font-size:clamp(2.2rem,5cqi,3.8rem);line-height:1;letter-spacing:-.02em}
[data-vibeui-block="flowers-001"] [data-part="lede"]{margin:.8rem 0 0;max-width:34rem;color:var(--vibeui-flowers-001-muted)}
[data-vibeui-block="flowers-001"] [data-part="note"]{margin:0;font-family:var(--vibeui-flowers-001-hand);font-size:1.5rem;line-height:1.1;color:var(--vibeui-flowers-001-accent);rotate:-2deg}
[data-vibeui-block="flowers-001"] [data-part="list"]{--vibeui-flowers-001-w:min(78vw,21rem,max(12rem,calc((100svh - 28rem) * .8)));display:flex;gap:1.4rem;margin:0 -1.25rem;padding:.5rem 1.25rem 1rem;list-style:none;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding-inline:1.25rem;scrollbar-width:none;overscroll-behavior-x:contain}
[data-vibeui-block="flowers-001"] [data-part="list"]::-webkit-scrollbar{display:none}
[data-vibeui-block="flowers-001"] [data-part="item"]{flex:0 0 var(--vibeui-flowers-001-w);scroll-snap-align:start}
[data-vibeui-block="flowers-001"] [data-part="card"]{display:grid;gap:.9rem;color:inherit;text-decoration:none}
[data-vibeui-block="flowers-001"] [data-part="media"]{position:relative;margin:0;aspect-ratio:4/5;overflow:hidden;border-radius:1.1rem;background:var(--vibeui-flowers-001-card);box-shadow:0 1px 0 var(--vibeui-flowers-001-line);transition:translate .6s var(--vibeui-flowers-001-ease),box-shadow .6s}
[data-vibeui-block="flowers-001"] [data-part="card"]:hover [data-part="media"]{translate:0 -6px;box-shadow:0 30px 50px -30px rgb(60 30 10 / .45)}
[data-vibeui-block="flowers-001"] [data-part="shot"]{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;scale:1.02;transition:scale 1.2s var(--vibeui-flowers-001-ease)}
[data-vibeui-block="flowers-001"] [data-part="card"]:hover [data-part="shot"]{scale:1.08}
[data-vibeui-block="flowers-001"] [data-part="index"]{position:absolute;left:1rem;top:.9rem;font-family:var(--vibeui-flowers-001-display);font-style:italic;font-size:1.1rem;color:color-mix(in oklab,var(--vibeui-flowers-001-fg) 55%,transparent)}
[data-vibeui-block="flowers-001"] [data-part="badge"]{position:absolute;right:.9rem;top:.9rem;padding:.2rem .6rem;border-radius:999px;background:var(--vibeui-flowers-001-accent);color:var(--vibeui-flowers-001-on-accent);font-family:var(--vibeui-flowers-001-hand);font-size:1.05rem;line-height:1.2;rotate:4deg}
[data-vibeui-block="flowers-001"] [data-part="meta"]{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:.2rem 1rem;align-items:baseline}
[data-vibeui-block="flowers-001"] [data-part="name"]{position:relative;justify-self:start;margin:0;font-family:var(--vibeui-flowers-001-display);font-weight:500;font-size:clamp(1.4rem,2.4cqi,2rem);line-height:1.05;letter-spacing:-.01em}
[data-vibeui-block="flowers-001"] [data-part="scribble"]{position:absolute;left:-2%;bottom:-.3em;width:104%;height:.4em;overflow:visible;fill:none;stroke:var(--vibeui-flowers-001-accent);stroke-width:2;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .7s var(--vibeui-flowers-001-ease)}
[data-vibeui-block="flowers-001"] [data-part="card"]:hover [data-part="scribble"]{stroke-dashoffset:0}
[data-vibeui-block="flowers-001"] [data-part="price"]{font-family:var(--vibeui-flowers-001-display);font-weight:600;font-size:1.3rem;font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="flowers-001"] [data-part="composition"]{grid-column:1/-1;margin:0;font-size:.86rem;color:var(--vibeui-flowers-001-muted)}
[data-vibeui-block="flowers-001"] [data-part="all"]{flex:none}
[data-vibeui-block="flowers-001"] [data-part="card"]:focus-visible{outline:2px solid var(--vibeui-flowers-001-accent);outline-offset:4px;border-radius:1.1rem}
@keyframes vibeui-flowers-001-in{from{opacity:0;translate:0 40px}}
@supports (animation-timeline: view()){[data-vibeui-block="flowers-001"] [data-part="list"]{animation:vibeui-flowers-001-in linear both;animation-timeline:view();animation-range:entry 0% cover 30%}}
@container (min-width: 40rem){[data-vibeui-block="flowers-001"] [data-part="head"]{grid-template-columns:minmax(0,1fr) auto}}

@media (prefers-reduced-motion:reduce){[data-vibeui-block="flowers-001"] *{animation:none!important;transition:none!important}}`

const DEFAULT_ITEMS: Flowers001Item[] = [
  { name: "Маковое поле", note: "мак, ромашка, зверобой, овёс", price: "3 900 ₽", image: "/demo/flowers/video/bq-poppy.webp", video: "/demo/flowers/video/bq-poppy.mp4", alt: "Букет с красным маком и полевыми травами в крафтовой бумаге", href: "#builder", badge: "хит" },
  { name: "Утро на даче", note: "пионы, эвкалипт, душистый горошек", price: "5 400 ₽", image: "/demo/flowers/video/bq-peony.webp", video: "/demo/flowers/video/bq-peony.mp4", alt: "Пышный букет с розовыми пионами и эвкалиптом", href: "#builder" },
  { name: "Сливовый вечер", note: "георгины, скабиоза, амарант, рускус", price: "4 700 ₽", image: "/demo/flowers/video/bq-plum.webp", video: "/demo/flowers/video/bq-plum.mp4", alt: "Тёмный букет с бордовыми георгинами", href: "#builder" },
  { name: "Ботаник", note: "антуриум, папоротник, монстера, каллы", price: "6 200 ₽", image: "/demo/flowers/video/bq-botanic.webp", video: "/demo/flowers/video/bq-botanic.mp4", alt: "Зелёный букет с антуриумом и крупными листьями", href: "#builder" },
  { name: "Бумажный сад", note: "ранункулюсы, анемоны, лаванда, вероника", price: "4 300 ₽", image: "/demo/flowers/video/bq-paper.webp", video: "/demo/flowers/video/bq-paper.mp4", alt: "Нежный букет с ранункулюсами и лавандой", href: "#builder", badge: "новое" },
  { name: "Один стебель", note: "гортензия, одна, в бумаге", price: "1 200 ₽", image: "/demo/flowers/video/bq-single.webp", video: "/demo/flowers/video/bq-single.mp4", alt: "Одна крупная голубая гортензия в бумаге", href: "#builder" },
]

/** Каталог букетов витриной: в каждой карточке букет поворачивается на подставке. */
export function Flowers001({
  eyebrow = "Букеты недели",
  title = "Что собрали сегодня",
  lede = "Шесть букетов, которые стоят на витрине прямо сейчас. Каждый можно заказать как есть или пересобрать под себя.",
  items = DEFAULT_ITEMS,
  note = "цены с бумагой и открыткой",
  allLabel = "Собрать свой букет",
  allHref = "#builder",
  prevLabel = "Назад",
  nextLabel = "Дальше",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Flowers001Props) {
  const listRef = useRef<HTMLUListElement>(null)

  // Ролики играют только в видимых карточках — шесть видео разом не грузят процессор.
  useEffect(() => {
    const list = listRef.current
    if (!list || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement
          if (entry.isIntersecting) video.play().catch(() => {})
          else video.pause()
        }
      },
      { threshold: 0.35 },
    )
    list.querySelectorAll("video").forEach((video) => observer.observe(video))
    return () => observer.disconnect()
  }, [items])

  const scroll = (direction: number) => {
    const list = listRef.current
    if (!list) return
    list.scrollBy({ left: direction * list.clientWidth * 0.8, behavior: "smooth" })
  }

  const palette = {
    ...(accent ? { "--vibeui-flowers-001-accent": accent } : null),
    ...(ink ? { "--vibeui-flowers-001-fg": ink } : null),
    ...(background ? { "--vibeui-flowers-001-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-flowers-001" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="flowers-001" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
            </div>
            <div data-part="side">
              {note ? <p data-part="note">{note}</p> : null}
              {allLabel ? <Button016 data-part="all" label={allLabel} href={allHref} external={false} size="md" tone="neutral" accent={accent} /> : null}
              <div data-part="arrows">
                <button data-part="nav-arrow" type="button" onClick={() => scroll(-1)} aria-label={prevLabel}>
                  <svg data-part="arrow-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 12H4M11 5l-7 7 7 7" />
                  </svg>
                </button>
                <button data-part="nav-arrow" type="button" onClick={() => scroll(1)} aria-label={nextLabel}>
                  <svg data-part="arrow-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 12h16M13 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <ul data-part="list" ref={listRef}>
            {items.map((item, index) => (
              <li key={item.name} data-part="item">
                <a data-part="card" href={item.href ?? "#"}>
                  <figure data-part="media">
                    {item.video ? (
                      <video data-part="shot" src={item.video} poster={item.image} aria-label={item.alt ?? item.name} muted loop playsInline preload="metadata" />
                    ) : (
                      <img data-part="shot" src={item.image} alt={item.alt ?? item.name} loading="lazy" />
                    )}
                    <span data-part="index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.badge ? <span data-part="badge">{item.badge}</span> : null}
                  </figure>
                  <div data-part="meta">
                    <h3 data-part="name">
                      {item.name}
                      <svg data-part="scribble" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true">
                        <path d="M2 12C30 4 52 18 80 10s52-6 78 2 30-4 40-6" pathLength={1} />
                      </svg>
                    </h3>
                    <span data-part="price">{item.price}</span>
                    <p data-part="composition">{item.note}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

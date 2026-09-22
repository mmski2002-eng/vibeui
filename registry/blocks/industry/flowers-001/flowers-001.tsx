"use client"

import { useRef, useState, type CSSProperties, type PointerEvent } from "react"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Flowers001Item = {
  name: string
  /** Состав одной строкой: «пионы, эвкалипт, мак». */
  note: string
  price: string
  image: string
  alt?: string
  href?: string
}

export type Flowers001Props = {
  eyebrow?: string
  title?: string
  lede?: string
  items?: readonly Flowers001Item[]
  /** Подпись справа от заголовка, рукописная. */
  note?: string
  allLabel?: string
  allHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Каталог букетов как оглавление журнала: на широком экране это список
// названий крупной антиквой с ценой у правого края, а картинка букета
// не лежит в сетке, а следует за курсором по списку — с лёгким запаздыванием
// и наклоном по направлению движения (transform + transition, без
// перерисовок React). На узком экране список превращается в обычную
// сетку карточек с фото, чтобы всё было видно и без курсора.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Golos+Text:wght@400;500;600&family=Caveat:wght@500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="flowers-001"]){
--vibeui-flowers-001-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-flowers-001-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-flowers-001-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-flowers-001-on-accent:oklch(from var(--vibeui-flowers-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-flowers-001-muted:color-mix(in oklab,var(--vibeui-flowers-001-fg) 62%,var(--vibeui-flowers-001-bg));
--vibeui-flowers-001-line:color-mix(in oklab,var(--vibeui-flowers-001-fg) 16%,transparent);
--vibeui-flowers-001-display:"Cormorant",Georgia,"Times New Roman",serif;
--vibeui-flowers-001-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-flowers-001-hand:"Caveat","Segoe Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="flowers-001"]{color-scheme:dark}
:where([data-vibeui-block="flowers-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="flowers-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="flowers-001"]{box-sizing:border-box;position:relative;padding:5rem 0;background:var(--vibeui-flowers-001-bg);color:var(--vibeui-flowers-001-fg);font-family:var(--vibeui-flowers-001-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="flowers-001"] *{box-sizing:border-box}
[data-vibeui-block="flowers-001"] [data-part="all"]{margin:2.5rem 0 0}
[data-vibeui-block="flowers-001"] [data-part="shell"]{max-width:84rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="flowers-001"] [data-part="head"]{display:grid;gap:1rem;align-items:end;margin:0 0 2.5rem}
[data-vibeui-block="flowers-001"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.74rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-flowers-001-muted)}
[data-vibeui-block="flowers-001"] [data-part="title"]{margin:0;font-family:var(--vibeui-flowers-001-display);font-weight:500;font-size:clamp(2.2rem,5.4cqi,4.2rem);line-height:1;letter-spacing:-.02em}
[data-vibeui-block="flowers-001"] [data-part="lede"]{margin:.8rem 0 0;max-width:34rem;color:var(--vibeui-flowers-001-muted)}
[data-vibeui-block="flowers-001"] [data-part="note"]{font-family:var(--vibeui-flowers-001-hand);font-size:1.5rem;line-height:1.1;color:var(--vibeui-flowers-001-accent);transform:rotate(-2deg)}
[data-vibeui-block="flowers-001"] [data-part="list"]{position:relative;margin:0;padding:0;list-style:none;display:grid;gap:1.6rem 1.25rem;grid-template-columns:repeat(2,minmax(0,1fr))}
[data-vibeui-block="flowers-001"] [data-part="row"]{display:grid;gap:.6rem;color:inherit;text-decoration:none}
[data-vibeui-block="flowers-001"] [data-part="figure"]{margin:0;aspect-ratio:4/5;overflow:hidden;border-radius:.4rem;background:var(--vibeui-flowers-001-line)}
[data-vibeui-block="flowers-001"] [data-part="figure"] img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .8s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="flowers-001"] [data-part="row"]:hover [data-part="figure"] img{transform:scale(1.05)}
[data-vibeui-block="flowers-001"] [data-part="index"]{display:none}
[data-vibeui-block="flowers-001"] [data-part="name"]{margin:0;font-family:var(--vibeui-flowers-001-display);font-weight:500;font-size:1.5rem;line-height:1.05;letter-spacing:-.01em}
[data-vibeui-block="flowers-001"] [data-part="composition"]{margin:0;font-size:.82rem;color:var(--vibeui-flowers-001-muted)}
[data-vibeui-block="flowers-001"] [data-part="price"]{font-variant-numeric:tabular-nums;font-weight:500;white-space:nowrap}
[data-vibeui-block="flowers-001"] [data-part="row-arrow"]{display:none}
[data-vibeui-block="flowers-001"] [data-part="ghost"]{display:none}
[data-vibeui-block="flowers-001"] a:focus-visible{outline:2px solid var(--vibeui-flowers-001-accent);outline-offset:3px}
@container (min-width: 40rem){[data-vibeui-block="flowers-001"] [data-part="head"]{grid-template-columns:minmax(0,1fr) auto}[data-vibeui-block="flowers-001"] [data-part="list"]{grid-template-columns:repeat(3,minmax(0,1fr))}}
@container (min-width: 60rem){
[data-vibeui-block="flowers-001"] [data-part="list"]{display:block;border-top:1px solid var(--vibeui-flowers-001-line)}
[data-vibeui-block="flowers-001"] [data-part="row"]{grid-template-columns:3rem minmax(0,1fr) minmax(0,18rem) 7rem 2rem;align-items:baseline;gap:1.5rem;padding:1.35rem 0;border-bottom:1px solid var(--vibeui-flowers-001-line);transition:padding-left .4s cubic-bezier(.2,.7,.2,1),color .3s}
[data-vibeui-block="flowers-001"] [data-part="row"]:hover{padding-left:1rem;color:var(--vibeui-flowers-001-accent)}
[data-vibeui-block="flowers-001"] [data-part="figure"]{display:none}
[data-vibeui-block="flowers-001"] [data-part="index"]{display:block;font-size:.78rem;color:var(--vibeui-flowers-001-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="flowers-001"] [data-part="name"]{font-size:clamp(2rem,3.4cqi,3rem)}
[data-vibeui-block="flowers-001"] [data-part="composition"]{font-size:.9rem}
[data-vibeui-block="flowers-001"] [data-part="price"]{text-align:right;font-size:1.05rem}
[data-vibeui-block="flowers-001"] [data-part="row-arrow"]{display:block;width:1.6rem;height:1.6rem;opacity:0;transform:translateX(-.6rem);transition:opacity .3s,transform .4s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="flowers-001"] [data-part="row"]:hover [data-part="row-arrow"]{opacity:1;transform:none}
[data-vibeui-block="flowers-001"] [data-part="ghost"]{display:block;position:absolute;left:0;top:0;z-index:2;width:15rem;aspect-ratio:4/5;pointer-events:none;overflow:hidden;border-radius:.4rem;box-shadow:0 30px 60px -24px rgb(0 0 0 / .45);opacity:0;transform:translate3d(-50%,-50%,0) scale(.85);transition:transform .55s cubic-bezier(.2,.7,.2,1),opacity .3s}
[data-vibeui-block="flowers-001"] [data-part="ghost"][data-on="true"]{opacity:1}
[data-vibeui-block="flowers-001"] [data-part="ghost"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .35s}
[data-vibeui-block="flowers-001"] [data-part="ghost"] img[data-on="true"]{opacity:1}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="flowers-001"] *{animation:none!important;transition:none!important}}`

const DEFAULT_ITEMS: Flowers001Item[] = [
  { name: "Маковое поле", note: "мак, ромашка, зверобой, овёс", price: "3 900 ₽", image: "/demo/flowers/bouquet-01.webp", alt: "Букет с красным маком и полевыми травами в крафтовой бумаге", href: "#builder" },
  { name: "Утро на даче", note: "пионы, эвкалипт, душистый горошек", price: "5 400 ₽", image: "/demo/flowers/bouquet-02.webp", alt: "Пышный букет с розовыми пионами и эвкалиптом", href: "#builder" },
  { name: "Сливовый вечер", note: "георгины, скабиоза, амарант, рускус", price: "4 700 ₽", image: "/demo/flowers/bouquet-03.webp", alt: "Тёмный букет с бордовыми георгинами", href: "#builder" },
  { name: "Ботаник", note: "антуриум, папоротник, монстера, каллы", price: "6 200 ₽", image: "/demo/flowers/bouquet-04.webp", alt: "Зелёный букет с антуриумом и крупными листьями", href: "#builder" },
  { name: "Бумажный сад", note: "ранункулюсы, анемоны, лаванда, вероника", price: "4 300 ₽", image: "/demo/flowers/bouquet-05.webp", alt: "Нежный букет с ранункулюсами и лавандой", href: "#builder" },
  { name: "Один стебель", note: "гортензия, одна, в бумаге", price: "1 200 ₽", image: "/demo/flowers/bouquet-06.webp", alt: "Одна крупная голубая гортензия в бумаге", href: "#builder" },
]

/** Каталог букетов: список названий, картинка следует за курсором. */
export function Flowers001({
  eyebrow = "Букеты недели",
  title = "Что собрали сегодня",
  lede = "Шесть букетов, которые стоят на витрине прямо сейчас. Наведите на название — покажем, как он выглядит.",
  items = DEFAULT_ITEMS,
  note = "цены с бумагой и открыткой",
  allLabel = "Собрать свой букет",
  allHref = "#builder",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Flowers001Props) {
  const [active, setActive] = useState<number | null>(null)
  const ghostRef = useRef<HTMLLIElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const lastX = useRef(0)

  const move = (event: PointerEvent<HTMLUListElement>) => {
    const ghost = ghostRef.current
    const list = listRef.current
    if (!ghost || !list || event.pointerType === "touch") return
    const rect = list.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const tilt = Math.max(-8, Math.min(8, (event.clientX - lastX.current) * 0.6))
    lastX.current = event.clientX
    ghost.style.transform = `translate3d(calc(${x}px - 50%),calc(${y}px - 50%),0) rotate(${tilt}deg)`
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
            {note ? <p data-part="note">{note}</p> : null}
          </div>
          <ul data-part="list" ref={listRef} onPointerMove={move} onPointerLeave={() => setActive(null)}>
            {items.map((item, index) => (
              <li key={item.name}>
                <a data-part="row" href={item.href ?? "#"} onPointerEnter={(event) => (event.pointerType === "touch" ? null : setActive(index))} onFocus={() => setActive(null)}>
                  <figure data-part="figure">
                    <img src={item.image} alt={item.alt ?? item.name} loading="lazy" />
                  </figure>
                  <span data-part="index">{String(index + 1).padStart(2, "0")}</span>
                  <h3 data-part="name">{item.name}</h3>
                  <p data-part="composition">{item.note}</p>
                  <span data-part="price">{item.price}</span>
                  <svg data-part="row-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 12h16M13 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
            ))}
            <li data-part="ghost" ref={ghostRef} data-on={active !== null} aria-hidden="true">
              {items.map((item, index) => (
                <img key={item.name} src={item.image} alt="" data-on={active === index} loading="lazy" />
              ))}
            </li>
          </ul>
          {allLabel ? (
            <Button016
              data-part="all"
              label={allLabel}
              href={allHref}
              external={false}
              size="md"
              tone="neutral"
              accent={accent}
            />
          ) : null}
        </div>
      </section>
    </>
  )
}

"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Portfolio008Photo = {
  src: string
  alt?: string
  caption?: string
  /** Форма: rect | arch | tall. Арка — верх скруглён, tall — вытянутый кадр. */
  shape?: "rect" | "arch" | "tall"
}

export type Portfolio008Props = {
  eyebrow?: string
  title?: string
  lede?: string
  photos?: readonly Portfolio008Photo[]
  /** Подписи кнопок лайтбокса. */
  closeLabel?: string
  prevLabel?: string
  nextLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Галерея пары: колонки masonry (CSS columns), часть кадров в арке, часть
// вытянутая; фото приглушены и чуть ч/б, по наведению — цвет и лёгкий
// подъём. Клик открывает лайтбокс на <dialog>: фото на тёмном, подпись,
// стрелки и клавиатура. Зерно плёнки поверх сетки.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap"

const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .3 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const STYLES = `
:where([data-vibeui-block="portfolio-008"]){
--vibeui-portfolio-008-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-portfolio-008-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-portfolio-008-muted:light-dark(#7a6a70,#a3a3a3);
--vibeui-portfolio-008-line:light-dark(#e2d8ca,#2e2e2e);
--vibeui-portfolio-008-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-portfolio-008-plum:var(--vibeui-portfolio-008-fg);
--vibeui-portfolio-008-sand:light-dark(#d9c5a5,#5a4a3a);
--vibeui-portfolio-008-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-portfolio-008-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="portfolio-008"]{color-scheme:dark}
:where([data-vibeui-block="portfolio-008"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="portfolio-008"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="portfolio-008"]{box-sizing:border-box;position:relative;display:block;background:var(--vibeui-portfolio-008-bg);color:var(--vibeui-portfolio-008-fg);font-family:var(--vibeui-portfolio-008-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="portfolio-008"] *{box-sizing:border-box}
[data-vibeui-block="portfolio-008"] [data-part="shell"]{position:relative;z-index:1;max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="portfolio-008"]::after{content:"";position:absolute;inset:0;background-image:${GRAIN};opacity:.3;mix-blend-mode:multiply;pointer-events:none}
[data-vibeui-block="portfolio-008"] [data-part="head"]{display:grid;gap:.6rem;max-width:40rem;margin-bottom:2.5rem}
[data-vibeui-block="portfolio-008"] [data-part="eyebrow"]{margin:0;font-size:.72rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--vibeui-portfolio-008-accent)}
[data-vibeui-block="portfolio-008"] [data-part="title"]{margin:0;font-family:var(--vibeui-portfolio-008-display);font-size:clamp(2rem,5cqi,3.6rem);font-weight:500;font-style:italic;line-height:1.05;color:var(--vibeui-portfolio-008-plum);text-wrap:balance}
[data-vibeui-block="portfolio-008"] [data-part="lede"]{margin:0;color:var(--vibeui-portfolio-008-muted)}
[data-vibeui-block="portfolio-008"] [data-part="grid"]{columns:2;column-gap:1rem}
[data-vibeui-block="portfolio-008"] [data-part="item"]{display:block;width:100%;margin:0 0 1rem;padding:0;border:0;background:transparent;color:inherit;font:inherit;cursor:zoom-in;break-inside:avoid;text-align:left}
[data-vibeui-block="portfolio-008"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-portfolio-008-accent);outline-offset:4px;border-radius:.6rem}
[data-vibeui-block="portfolio-008"] [data-part="pic"]{display:block;overflow:hidden;border-radius:.6rem;background:var(--vibeui-portfolio-008-sand);aspect-ratio:4/3;transition:transform .45s cubic-bezier(.2,.9,.3,1),box-shadow .45s}
[data-vibeui-block="portfolio-008"] [data-part="item"][data-shape="arch"] [data-part="pic"]{aspect-ratio:4/5;border-radius:50% 50% .6rem .6rem / 36% 36% .6rem .6rem}
[data-vibeui-block="portfolio-008"] [data-part="item"][data-shape="tall"] [data-part="pic"]{aspect-ratio:3/4}
[data-vibeui-block="portfolio-008"] [data-part="pic"] img{display:block;width:100%;height:100%;object-fit:cover;filter:grayscale(.35) saturate(.85) contrast(1.02);transition:filter .6s,transform .6s cubic-bezier(.2,.9,.3,1)}
[data-vibeui-block="portfolio-008"] [data-part="item"]:hover [data-part="pic"],[data-vibeui-block="portfolio-008"] [data-part="item"]:focus-visible [data-part="pic"]{transform:translateY(-.3rem);box-shadow:0 24px 40px -24px rgb(43 26 36 / .6)}
[data-vibeui-block="portfolio-008"] [data-part="item"]:hover img,[data-vibeui-block="portfolio-008"] [data-part="item"]:focus-visible img{filter:none;transform:scale(1.04)}
[data-vibeui-block="portfolio-008"] [data-part="cap"]{display:block;padding:.5rem .2rem 0;font-family:var(--vibeui-portfolio-008-display);font-style:italic;font-size:1.05rem;color:var(--vibeui-portfolio-008-muted)}
[data-vibeui-block="portfolio-008"] dialog{width:min(100%,52rem);max-width:calc(100% - 2rem);max-height:calc(100% - 2rem);margin:auto;padding:0;border:0;border-radius:1.2rem;background:#1d1620;color:#f3ebe4;box-shadow:0 40px 90px -30px rgb(0 0 0 / .8),0 0 0 1px rgb(255 255 255 / .06)}
[data-vibeui-block="portfolio-008"] dialog::backdrop{background:rgb(23 19 26 / .78);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);animation:vibeui-portfolio-008-veil .5s ease both}
@keyframes vibeui-portfolio-008-veil{from{opacity:0}}
[data-vibeui-block="portfolio-008"] dialog[open]{animation:vibeui-portfolio-008-in .55s cubic-bezier(.2,.9,.3,1) both}
@keyframes vibeui-portfolio-008-in{from{opacity:0;transform:translateY(1.5rem) scale(.94)}}
[data-vibeui-block="portfolio-008"] [data-part="stage"]{display:grid;grid-template-rows:minmax(0,1fr) auto;gap:.8rem;padding:1rem}
[data-vibeui-block="portfolio-008"] [data-part="frame"]{display:grid;place-items:center;min-height:12rem;max-height:min(32rem,calc(100vh - 9rem));overflow:hidden;border-radius:.6rem;background:#17131a}
[data-vibeui-block="portfolio-008"] [data-part="stage"] img{display:block;max-width:100%;max-height:min(32rem,calc(100vh - 9rem));object-fit:contain;border-radius:.6rem;animation:vibeui-portfolio-008-photo .5s cubic-bezier(.2,.9,.3,1) both}
@keyframes vibeui-portfolio-008-photo{from{opacity:0;transform:scale(1.03)}}
[data-vibeui-block="portfolio-008"] [data-part="bar"]{display:flex;align-items:center;justify-content:space-between;gap:1rem}
[data-vibeui-block="portfolio-008"] [data-part="bar"] p{margin:0;font-family:var(--vibeui-portfolio-008-display);font-style:italic;font-size:1.15rem;color:#d9c5a5}
[data-vibeui-block="portfolio-008"] [data-part="bar"] div{display:flex;gap:.4rem}
[data-vibeui-block="portfolio-008"] [data-part="bar"] button{display:inline-flex;align-items:center;justify-content:center;width:2.6rem;height:2.6rem;border:1px solid rgb(255 255 255 / .2);border-radius:50%;background:transparent;color:inherit;cursor:pointer;transition:border-color .25s,background .25s}
[data-vibeui-block="portfolio-008"] [data-part="bar"] button:hover{border-color:#fff;background:rgb(255 255 255 / .08)}
[data-vibeui-block="portfolio-008"] [data-part="bar"] button:focus-visible{outline:2px solid var(--vibeui-portfolio-008-accent);outline-offset:2px}
[data-vibeui-block="portfolio-008"] [data-part="bar"] svg{width:1.1rem;height:1.1rem;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
@container (min-width:40rem){
[data-vibeui-block="portfolio-008"] [data-part="grid"]{columns:3;column-gap:1.25rem}
[data-vibeui-block="portfolio-008"] [data-part="item"]{margin-bottom:1.25rem}
}
@container (min-width:64rem){
[data-vibeui-block="portfolio-008"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="portfolio-008"] [data-part="grid"]{columns:4}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="portfolio-008"] *{animation:none!important;transition:none!important}}`

/** Галерея пары masonry-сеткой с арками, ч/б → цвет по наведению и лайтбоксом на <dialog>. */
export function Portfolio008({
  eyebrow = "Галерея",
  title = "Мы до свадьбы",
  lede = "Кадры с плёнки за шесть лет: кухня, дорога, дождь и один пирс. Свадебные добавим после пятого сентября.",
  photos = [
    { src: "", caption: "Воскресное утро", shape: "arch" },
    { src: "", caption: "Парк, май" },
    { src: "", caption: "Под одним зонтом", shape: "tall" },
    { src: "", caption: "Пикник" },
    { src: "", caption: "Лифт", shape: "arch" },
    { src: "", caption: "Набережная" },
    { src: "", caption: "Мороженое", shape: "tall" },
    { src: "", caption: "Дождь за окном" },
  ],
  closeLabel = "Закрыть",
  prevLabel = "Предыдущее",
  nextLabel = "Следующее",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Portfolio008Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [current, setCurrent] = useState<number | null>(null)
  const palette = {
    ...(accent ? { "--vibeui-portfolio-008-accent": accent } : null),
    ...(ink ? { "--vibeui-portfolio-008-fg": ink } : null),
    ...(background ? { "--vibeui-portfolio-008-bg": background } : null),
    ...style,
  } as CSSProperties

  useEffect(() => {
    const node = dialog.current
    if (!node) return
    if (current !== null && !node.open) node.showModal()
    if (current === null && node.open) node.close()
  }, [current])

  function move(direction: -1 | 1) {
    setCurrent((value) => (value === null ? value : (value + direction + photos.length) % photos.length))
  }

  const shown = current === null ? null : photos[current]

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-portfolio-008" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="portfolio-008" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <p data-part="eyebrow">{eyebrow}</p>
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="grid">
            {photos.map((photo, index) => (
              <button key={photo.src + index} type="button" data-part="item" data-shape={photo.shape ?? "rect"} onClick={() => setCurrent(index)} aria-label={photo.caption ?? photo.alt ?? `${index + 1}`}>
                <span data-part="pic">{photo.src ? <img src={photo.src} alt={photo.alt ?? ""} loading="lazy" /> : null}</span>
                {photo.caption ? <span data-part="cap">{photo.caption}</span> : null}
              </button>
            ))}
          </div>
        </div>
        <dialog
          ref={dialog}
          onClose={() => setCurrent(null)}
          onClick={(event) => event.target === dialog.current && dialog.current.close()}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") move(1)
            if (event.key === "ArrowLeft") move(-1)
          }}
        >
          {shown ? (
            <div data-part="stage">
              <div data-part="frame">{shown.src ? <img key={shown.src} src={shown.src} alt={shown.alt ?? ""} /> : null}</div>
              <div data-part="bar">
                <p>{shown.caption}</p>
                <div>
                  <button type="button" aria-label={prevLabel} onClick={() => move(-1)}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M15 5l-7 7 7 7" />
                    </svg>
                  </button>
                  <button type="button" aria-label={nextLabel} onClick={() => move(1)}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button type="button" aria-label={closeLabel} onClick={() => dialog.current?.close()}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </dialog>
      </section>
    </>
  )
}

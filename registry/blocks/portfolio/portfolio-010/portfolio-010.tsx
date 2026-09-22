"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { Button104 } from "@/registry/components/button/button-104/button-104"

export type Portfolio010Photo = {
  src: string
  alt?: string
  caption?: string
  /** Форма карточки: rect (3:2), tall (4:5), square, wide (большая, 2 колонки). */
  shape?: "rect" | "tall" | "square" | "wide"
}

export type Portfolio010Props = {
  eyebrow?: string
  title?: string
  lede?: string
  photos?: readonly Portfolio010Photo[]
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

// Bento-галерея зимних кадров: чистые фото в скруглённых карточках-паспарту,
// без наложений поверх снимка. Наведение — мягкий подъём карточки и лёгкий
// zoom кадра, подпись рукописным Marck Script серебром под фото. Клик —
// лайтбокс на <dialog>: фото на ночном фоне, подпись, стрелки, Esc.
// Раскладка плотная, wide-кадр занимает две колонки.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Marck+Script&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="portfolio-010"]){
--vibeui-portfolio-010-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-portfolio-010-card:light-dark(#ffffff,#242424);
--vibeui-portfolio-010-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-portfolio-010-muted:light-dark(#6b6b6b,#a3a3a3);
--vibeui-portfolio-010-line:light-dark(color-mix(in oklab,var(--vibeui-portfolio-010-fg) 20%,transparent),color-mix(in oklab,var(--vibeui-portfolio-010-fg) 35%,transparent));
--vibeui-portfolio-010-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-portfolio-010-silver:#9fb0c8;
--vibeui-portfolio-010-display:"Cormorant Garamond",Georgia,serif;
--vibeui-portfolio-010-script:"Marck Script","Segoe Script",cursive;
--vibeui-portfolio-010-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="portfolio-010"]{color-scheme:dark}
:where([data-vibeui-block="portfolio-010"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="portfolio-010"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="portfolio-010"]{box-sizing:border-box;display:block;background:var(--vibeui-portfolio-010-bg);color:var(--vibeui-portfolio-010-fg);font-family:var(--vibeui-portfolio-010-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="portfolio-010"] *{box-sizing:border-box}
[data-vibeui-block="portfolio-010"] [data-part="item"]{width:100%;margin:0}
[data-vibeui-block="portfolio-010"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4.5rem 1.25rem}
[data-vibeui-block="portfolio-010"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-portfolio-010-display);font-size:.85rem;font-weight:500;letter-spacing:.32em;text-transform:uppercase;color:var(--vibeui-portfolio-010-silver)}
[data-vibeui-block="portfolio-010"] [data-part="title"]{margin:0;font-family:var(--vibeui-portfolio-010-display);font-size:clamp(2.2rem,5.5cqi,3.8rem);font-weight:500;line-height:1.05}
[data-vibeui-block="portfolio-010"] [data-part="lede"]{max-width:36rem;margin:1rem 0 0;color:var(--vibeui-portfolio-010-muted)}
[data-vibeui-block="portfolio-010"] [data-part="grid"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));align-items:start;gap:.9rem;margin-top:2.5rem}
[data-vibeui-block="portfolio-010"] dialog{width:min(100%,56rem);max-width:calc(100% - 2rem);max-height:calc(100% - 2rem);margin:auto;padding:0;border:1px solid rgb(159 176 200 / .25);border-radius:1rem;background:#0b1220;color:#f2eee6;box-shadow:0 40px 90px -30px rgb(0 0 0 / .9)}
[data-vibeui-block="portfolio-010"] dialog::backdrop{background:rgb(5 9 15 / .82);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);animation:vibeui-portfolio-010-veil .5s ease both}
@keyframes vibeui-portfolio-010-veil{from{opacity:0}}
[data-vibeui-block="portfolio-010"] dialog[open]{animation:vibeui-portfolio-010-in .55s cubic-bezier(.2,.9,.3,1) both}
@keyframes vibeui-portfolio-010-in{from{opacity:0;transform:translateY(1.5rem) scale(.96)}}
[data-vibeui-block="portfolio-010"] [data-part="stage"]{display:grid;grid-template-rows:minmax(0,1fr) auto;gap:.8rem;padding:1rem}
[data-vibeui-block="portfolio-010"] [data-part="frame"]{display:grid;place-items:center;min-height:12rem;max-height:min(34rem,calc(100vh - 9rem));overflow:hidden;border-radius:.6rem;background:#070c15}
[data-vibeui-block="portfolio-010"] [data-part="stage"] img{display:block;max-width:100%;max-height:min(34rem,calc(100vh - 9rem));object-fit:contain;border-radius:.4rem;animation:vibeui-portfolio-010-photo .5s cubic-bezier(.2,.9,.3,1) both}
@keyframes vibeui-portfolio-010-photo{from{opacity:0;transform:scale(1.03)}}
[data-vibeui-block="portfolio-010"] [data-part="bar"]{display:flex;align-items:center;justify-content:space-between;gap:1rem}
[data-vibeui-block="portfolio-010"] [data-part="bar"] p{margin:0;font-family:var(--vibeui-portfolio-010-script);font-size:1.3rem;color:var(--vibeui-portfolio-010-accent)}
[data-vibeui-block="portfolio-010"] [data-part="bar"] div{display:flex;gap:.4rem}
[data-vibeui-block="portfolio-010"] [data-part="bar"] button{display:inline-flex;align-items:center;justify-content:center;width:2.6rem;height:2.6rem;border:1px solid rgb(159 176 200 / .35);border-radius:50%;background:transparent;color:inherit;cursor:pointer;transition:border-color .25s,background .25s}
[data-vibeui-block="portfolio-010"] [data-part="bar"] button:hover{border-color:var(--vibeui-portfolio-010-accent);background:rgb(242 182 79 / .1)}
[data-vibeui-block="portfolio-010"] [data-part="bar"] button:focus-visible{outline:2px solid var(--vibeui-portfolio-010-accent);outline-offset:2px}
[data-vibeui-block="portfolio-010"] [data-part="bar"] svg{width:1.1rem;height:1.1rem;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
@container (min-width:40rem){
[data-vibeui-block="portfolio-010"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1.1rem}
}
@container (min-width:64rem){
[data-vibeui-block="portfolio-010"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="portfolio-010"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="portfolio-010"] *{animation:none!important;transition:none!important}}`

/** Bento-галерея зимних кадров: чистые фото, мягкий hover-подъём, клик открывает лайтбокс на <dialog>. */
export function Portfolio010({
  eyebrow = "Кадры",
  title = "Четыре зимы в окнах",
  lede = "Лучшее из наших зим — каток, ёлка, первый снег и та самая ель. Отогрейте любое окно.",
  photos = [
    { src: "", caption: "Дорога в лес", shape: "wide" },
    { src: "", caption: "Снег на ресницах", shape: "tall" },
    { src: "", caption: "Глинтвейн", shape: "square" },
    { src: "", caption: "Дрова", shape: "tall" },
    { src: "", caption: "Снежные ангелы" },
    { src: "", caption: "Сердце на стекле" },
    { src: "", caption: "Фонарь", shape: "square" },
    { src: "", caption: "Фейерверк" },
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
}: Portfolio010Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [current, setCurrent] = useState<number | null>(null)
  const palette = {
    ...(accent ? { "--vibeui-portfolio-010-accent": accent } : null),
    ...(ink ? { "--vibeui-portfolio-010-fg": ink } : null),
    ...(background ? { "--vibeui-portfolio-010-bg": background } : null),
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
      <style href="vibeui-portfolio-010" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="portfolio-010" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="grid">
            {photos.map((photo, index) => (
              <Button104 key={photo.src + index} data-part="item" src={photo.src} shape={photo.shape} caption={photo.caption} alt={photo.alt} onClick={() => setCurrent(index)} aria-label={photo.caption ?? photo.alt ?? `${index + 1}`} accent={accent} />
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

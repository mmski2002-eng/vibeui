"use client"

import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react"

export type Testimonials027Entry = {
  /** Кличка питомца — заголовок записи. */
  pet: string
  /** Хозяин: «Оля, хозяйка». */
  owner: string
  date: string
  text: string
  photo?: string
  /** Стикер на карточке: «5/5», «не боялся». */
  sticker?: string
}

export type Testimonials027Props = {
  eyebrow?: string
  title?: string
  lede?: string
  entries?: readonly Testimonials027Entry[]
  hint?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Отзывы как дневник питомца: горизонтальная лента полароидов — фото,
// рукописная подпись (Caveat), дата, полоска скотча сверху и стикер с
// поворотом. Карточки повёрнуты вразнобой через nth-child, по наведению
// выпрямляются и всплывают. Ленту можно тянуть мышью: pointer capture на
// треке, scrollLeft считается от точки захвата, на время drag снап
// отключён; на тач-экранах работает нативный скролл.
const FONTS = "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Golos+Text:wght@400;500;600&family=Caveat:wght@500;700&display=swap"

const STYLES = `
:where([data-vibeui-block="testimonials-027"]){
--vibeui-testimonials-027-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-testimonials-027-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-027-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-027-on-accent:oklch(from var(--vibeui-testimonials-027-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-testimonials-027-muted:color-mix(in oklab,var(--vibeui-testimonials-027-fg) 62%,var(--vibeui-testimonials-027-bg));
--vibeui-testimonials-027-line:color-mix(in oklab,var(--vibeui-testimonials-027-fg) 12%,transparent);
--vibeui-testimonials-027-paper:light-dark(#fffdf8,#26221f);
--vibeui-testimonials-027-display:"Nunito",ui-rounded,ui-sans-serif,system-ui,sans-serif;
--vibeui-testimonials-027-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-testimonials-027-hand:"Caveat",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-027"]{color-scheme:dark}
:where([data-vibeui-block="testimonials-027"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="testimonials-027"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="testimonials-027"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-testimonials-027-bg);color:var(--vibeui-testimonials-027-fg);font-family:var(--vibeui-testimonials-027-font);font-size:1rem;line-height:1.5;overflow:hidden}
[data-vibeui-block="testimonials-027"] *{box-sizing:border-box}
[data-vibeui-block="testimonials-027"] [data-part="head"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:flex;flex-wrap:wrap;align-items:end;justify-content:space-between;gap:1rem}
[data-vibeui-block="testimonials-027"] [data-part="eyebrow"]{margin:0 0 .7rem;font-weight:600;font-size:.85rem;letter-spacing:.02em;color:var(--vibeui-testimonials-027-accent)}
[data-vibeui-block="testimonials-027"] [data-part="title"]{margin:0;font-family:var(--vibeui-testimonials-027-display);font-weight:900;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1;letter-spacing:-.03em}
[data-vibeui-block="testimonials-027"] [data-part="lede"]{margin:.9rem 0 0;max-width:34rem;color:var(--vibeui-testimonials-027-muted)}
[data-vibeui-block="testimonials-027"] [data-part="hint"]{display:inline-flex;align-items:center;gap:.5rem;font-family:var(--vibeui-testimonials-027-hand);font-size:1.3rem;color:var(--vibeui-testimonials-027-muted);transform:rotate(-2deg)}
[data-vibeui-block="testimonials-027"] [data-part="hint"] svg{width:1.6rem;height:1.6rem;animation:vibeui-testimonials-027-nudge 1.6s ease-in-out infinite}
[data-vibeui-block="testimonials-027"] [data-part="track"]{display:flex;gap:1.5rem;margin:2.4rem 0 0;padding:1.5rem max(1.25rem,calc((100% - 80rem) / 2 + 1.25rem)) 2rem;list-style:none;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;cursor:grab;user-select:none;-webkit-user-select:none}
[data-vibeui-block="testimonials-027"] [data-part="track"]::-webkit-scrollbar{display:none}
[data-vibeui-block="testimonials-027"] [data-part="track"][data-dragging="true"]{scroll-snap-type:none;cursor:grabbing}
[data-vibeui-block="testimonials-027"] [data-part="card"]{position:relative;flex:0 0 16rem;scroll-snap-align:center;padding:.9rem .9rem 1.1rem;border-radius:.4rem;background:var(--vibeui-testimonials-027-paper);box-shadow:0 1px 0 rgb(255 255 255 / .5) inset,0 20px 40px -24px rgb(0 0 0 / .5),0 0 0 1px var(--vibeui-testimonials-027-line);transform:rotate(var(--vibeui-testimonials-027-r));transition:transform .3s cubic-bezier(.34,1.4,.64,1),box-shadow .3s}
[data-vibeui-block="testimonials-027"] [data-part="card"]:nth-child(4n+1){--vibeui-testimonials-027-r:-3deg}
[data-vibeui-block="testimonials-027"] [data-part="card"]:nth-child(4n+2){--vibeui-testimonials-027-r:2deg}
[data-vibeui-block="testimonials-027"] [data-part="card"]:nth-child(4n+3){--vibeui-testimonials-027-r:-1.5deg}
[data-vibeui-block="testimonials-027"] [data-part="card"]:nth-child(4n+4){--vibeui-testimonials-027-r:3deg}
[data-vibeui-block="testimonials-027"] [data-part="card"]:hover{transform:rotate(0) translateY(-8px) scale(1.02);box-shadow:0 30px 50px -24px rgb(0 0 0 / .55),0 0 0 1px var(--vibeui-testimonials-027-line);z-index:2}
[data-vibeui-block="testimonials-027"] [data-part="tape"]{position:absolute;left:50%;top:-.7rem;width:6rem;height:1.5rem;margin-left:-3rem;background:color-mix(in oklab,var(--vibeui-testimonials-027-accent) 30%,rgb(255 255 255 / .6));opacity:.8;transform:rotate(-2deg);box-shadow:0 1px 3px rgb(0 0 0 / .1)}
[data-vibeui-block="testimonials-027"] [data-part="photo"]{position:relative;aspect-ratio:4/5;overflow:hidden;background:linear-gradient(160deg,color-mix(in oklab,var(--vibeui-testimonials-027-accent) 25%,var(--vibeui-testimonials-027-bg)),color-mix(in oklab,var(--vibeui-testimonials-027-accent) 60%,var(--vibeui-testimonials-027-fg)))}
[data-vibeui-block="testimonials-027"] [data-part="photo"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}
[data-vibeui-block="testimonials-027"] [data-part="sticker"]{position:absolute;right:-.6rem;top:.8rem;z-index:2;padding:.35rem .7rem;border-radius:999px;background:var(--vibeui-testimonials-027-accent);color:var(--vibeui-testimonials-027-on-accent);font-family:var(--vibeui-testimonials-027-display);font-weight:800;font-size:.75rem;transform:rotate(8deg);box-shadow:0 6px 14px -6px var(--vibeui-testimonials-027-accent)}
[data-vibeui-block="testimonials-027"] [data-part="caption"]{margin:.8rem 0 0;font-family:var(--vibeui-testimonials-027-hand);font-weight:500;font-size:1.25rem;line-height:1.15;color:var(--vibeui-testimonials-027-fg)}
[data-vibeui-block="testimonials-027"] [data-part="caption"] b{display:block;font-weight:700;font-size:1.5rem}
[data-vibeui-block="testimonials-027"] [data-part="meta"]{display:flex;justify-content:space-between;gap:.6rem;margin:.7rem 0 0;font-size:.75rem;color:var(--vibeui-testimonials-027-muted)}
@keyframes vibeui-testimonials-027-nudge{0%,100%{transform:translateX(0)}50%{transform:translateX(6px)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-027"] *{animation:none!important;transition:none!important}}`

const DEFAULT_ENTRIES: Testimonials027Entry[] = [
  { pet: "Батон", owner: "Оля, хозяйка", date: "14 марта", text: "Кастрация. Утром боялся я, вечером он уже требовал ужин. Шов не трогал, воротник не понадобился.", photo: "/demo/vet/diary-01.webp", sticker: "не боялся" },
  { pet: "Мисс Плюш", owner: "Артём и Настя", date: "2 апреля", text: "Стригли под льва. Грумер Лена показала фото до и после и спросила, точно ли мы этого хотим. Хотели. Не жалеем.", photo: "/demo/vet/diary-02.webp", sticker: "лев" },
  { pet: "Фунтик", owner: "Дед Миша", date: "19 апреля", text: "Ночью перестал есть. Приехали в два часа, УЗИ сделали сразу. Через день ел сено как ни в чём не бывало.", photo: "/demo/vet/diary-03.webp", sticker: "24/7" },
  { pet: "Зося", owner: "Катя, хозяйка", date: "5 мая", text: "Чистили зубы. Запаха нет, ест хрустящий корм, целует в нос. Ортопед заодно посмотрел лапу — бесплатно.", photo: "/demo/vet/diary-04.webp", sticker: "5 / 5" },
  { pet: "Кекс", owner: "Семья Ивановых", date: "23 мая", text: "Первая прививка. Врач дала лакомство до укола, а не после — и щенок так ничего и не понял.", sticker: "первый раз" },
  { pet: "Марсель", owner: "Ира, хозяйка", date: "8 июня", text: "Дерматолог нашёл, на что аллергия, за один приём. Три года чесался, месяц — нет.", sticker: "нашли" },
]

/** Отзывы-полароиды в ленте с drag-scroll. */
export function Testimonials027({
  eyebrow = "Дневник",
  title = "Записи от хозяев",
  lede = "Отзывы с карт и из мессенджера — как есть, с кличками и датами. Фото присылают сами.",
  entries = DEFAULT_ENTRIES,
  hint = "тяните ленту",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Testimonials027Props) {
  const trackRef = useRef<HTMLUListElement>(null)
  const grab = useRef<{ x: number; left: number } | null>(null)
  const [dragging, setDragging] = useState(false)

  const onDown = (event: ReactPointerEvent<HTMLUListElement>) => {
    if (event.pointerType !== "mouse" || !trackRef.current) return
    grab.current = { x: event.clientX, left: trackRef.current.scrollLeft }
    trackRef.current.setPointerCapture(event.pointerId)
    setDragging(true)
  }

  const onMove = (event: ReactPointerEvent<HTMLUListElement>) => {
    if (!grab.current || !trackRef.current) return
    trackRef.current.scrollLeft = grab.current.left - (event.clientX - grab.current.x)
  }

  const onUp = () => {
    grab.current = null
    setDragging(false)
  }

  const palette = {
    ...(accent ? { "--vibeui-testimonials-027-accent": accent } : null),
    ...(ink ? { "--vibeui-testimonials-027-fg": ink } : null),
    ...(background ? { "--vibeui-testimonials-027-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-testimonials-027" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="testimonials-027" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="head">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          {hint ? (
            <span data-part="hint" aria-hidden="true">
              {hint}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            </span>
          ) : null}
        </div>
        <ul data-part="track" ref={trackRef} data-dragging={dragging} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} aria-label="Отзывы">
          {entries.map((entry) => (
            <li key={entry.pet + entry.date} data-part="card">
              <i data-part="tape" aria-hidden="true" />
              {entry.sticker ? <span data-part="sticker">{entry.sticker}</span> : null}
              <div data-part="photo">{entry.photo ? <img src={entry.photo} alt={entry.pet} loading="lazy" draggable={false} /> : null}</div>
              <p data-part="caption">
                <b>{entry.pet}</b>
                {entry.text}
              </p>
              <p data-part="meta">
                <span>{entry.owner}</span>
                <span>{entry.date}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

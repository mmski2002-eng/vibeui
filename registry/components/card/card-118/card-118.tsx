"use client"

import type { ComponentProps, CSSProperties } from "react"

export type Card118Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  image?: string
  imageAlt?: string
  from?: string
  role?: string
  years?: number
  note?: string
  accentText?: string
  yearsUnit?: string
  listenLabel?: string
  playing?: number | null
  setPlaying?: (value: number | null) => void
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока people-019, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-118"]){
--vibeui-card-118-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-118-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-118-display:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-118-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-118-hand:"Marck Script",cursive;
--vibeui-card-118-line:color-mix(in oklab,var(--vibeui-card-118-fg) 12%,transparent);
--vibeui-card-118-muted:color-mix(in oklab,var(--vibeui-card-118-fg) 62%,var(--vibeui-card-118-bg));
--vibeui-card-118-on-accent:oklch(from var(--vibeui-card-118-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-card-118-paper:color-mix(in oklab,var(--vibeui-card-118-bg) 92%,#fff);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-118"]{color-scheme:dark}
[data-vibeui-block="card-118"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-118"] *{box-sizing:border-box}
@keyframes vibeui-card-118-wave{0%,100%{transform:scaleY(.2)}30%{transform:scaleY(1)}60%{transform:scaleY(.45)}}
[data-vibeui-block="card-118"]{position:relative;display:grid;gap:.6rem;padding:.8rem .8rem 1.1rem;border-radius:.6rem;background:var(--vibeui-card-118-paper);border:1px solid var(--vibeui-card-118-line);box-shadow:0 20px 40px -30px color-mix(in oklab,var(--vibeui-card-118-fg) 60%,transparent);transform:rotate(calc(var(--vibeui-people-019-tilt) * 1deg)) rotateX(calc(var(--vibeui-people-019-rx,0) * 1deg)) rotateY(calc(var(--vibeui-people-019-ry,0) * 1deg));transform-style:preserve-3d;transition:transform .5s cubic-bezier(.2,.8,.2,1),box-shadow .5s;will-change:transform}
[data-vibeui-block="card-118"][data-hover="true"]{transition:transform .12s ease-out;box-shadow:0 40px 60px -30px color-mix(in oklab,var(--vibeui-card-118-fg) 60%,transparent)}
[data-vibeui-block="card-118"]::after{content:"";position:absolute;inset:0;border-radius:inherit;background:radial-gradient(18rem circle at calc(var(--vibeui-people-019-x,50) * 1%) calc(var(--vibeui-people-019-y,50) * 1%),rgb(255 255 255 / .35),transparent 60%);opacity:0;transition:opacity .3s;pointer-events:none;mix-blend-mode:soft-light}
[data-vibeui-block="card-118"][data-hover="true"]::after{opacity:1}
[data-vibeui-block="card-118"] [data-part="photo"]{position:relative;aspect-ratio:4/5;border-radius:.3rem;overflow:hidden;background:color-mix(in oklab,var(--vibeui-card-118-accent) 18%,var(--vibeui-card-118-bg))}
[data-vibeui-block="card-118"] [data-part="photo"] img{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="card-118"] [data-part="photo"] span{position:absolute;left:.6rem;top:.6rem;padding:.25rem .6rem;border-radius:.4rem;background:var(--vibeui-card-118-accent);color:var(--vibeui-card-118-on-accent);font-family:var(--vibeui-card-118-display);font-size:.7rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase}
[data-vibeui-block="card-118"] h3{margin:.3rem 0 0;font-family:var(--vibeui-card-118-display);font-weight:700;font-size:1.25rem;letter-spacing:-.02em;line-height:1.2}
[data-vibeui-block="card-118"] [data-part="meta"]{margin:0;font-size:.85rem;color:var(--vibeui-card-118-muted)}
[data-vibeui-block="card-118"] [data-part="note"]{margin:.2rem 0 0;font-family:var(--vibeui-card-118-hand);font-size:1.2rem;line-height:1.25;color:var(--vibeui-card-118-accent);transform:rotate(-1.5deg);transform-origin:left}
[data-vibeui-block="card-118"] [data-part="listen"]{display:flex;align-items:center;gap:.7rem;margin-top:.3rem;padding:.55rem .8rem;border-radius:999px;border:1.5px solid var(--vibeui-card-118-line);background:var(--vibeui-card-118-bg);color:var(--vibeui-card-118-fg);font:inherit;font-size:.85rem;font-weight:600;cursor:pointer;text-align:left;transition:border-color .2s,background .2s}
[data-vibeui-block="card-118"] [data-part="listen"]:hover{border-color:var(--vibeui-card-118-accent)}
[data-vibeui-block="card-118"] [data-part="listen"][aria-pressed="true"]{border-color:var(--vibeui-card-118-accent);background:color-mix(in oklab,var(--vibeui-card-118-accent) 10%,var(--vibeui-card-118-bg))}
[data-vibeui-block="card-118"] [data-part="listen"]:focus-visible{outline:2px solid var(--vibeui-card-118-accent);outline-offset:2px}
[data-vibeui-block="card-118"] [data-part="play"]{display:grid;place-items:center;flex:none;width:1.8rem;height:1.8rem;border-radius:50%;background:var(--vibeui-card-118-accent);color:var(--vibeui-card-118-on-accent)}
[data-vibeui-block="card-118"] [data-part="play"] svg{width:.7rem;height:.7rem}
[data-vibeui-block="card-118"] [data-part="wave"]{display:flex;align-items:center;gap:2px;height:1.2rem;margin-left:auto}
[data-vibeui-block="card-118"] [data-part="wave"] i{width:3px;height:100%;border-radius:2px;background:var(--vibeui-card-118-accent);transform:scaleY(.18);transform-origin:center;transition:transform .3s}
[data-vibeui-block="card-118"] [data-part="listen"][aria-pressed="true"] [data-part="wave"] i{animation:vibeui-card-118-wave 1s ease-in-out infinite;animation-delay:calc(var(--vibeui-card-118-i) * -.13s)}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="card-118"] [data-part="listen"][aria-pressed="true"] [data-part="wave"] i{transform:scaleY(.7)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-118"] *{animation:none!important;transition:none!important}}
`

/** Карточка преподавателя: фото с флагом, имя, роль и стаж, заметка и кнопка «послушать» с волной. */
export function Card118({
  name = "Emma Whitfield",
  image,
  imageAlt,
  from = "Манчестер",
  role = "английский · носитель",
  years = 9,
  note,
  accentText,
  yearsUnit = "лет",
  listenLabel = "послушать акцент",
  playing = null,
  setPlaying,
  index = 0,
  accent,
  className,
  style,
  ...props
}: Card118Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-118-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-118" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-118"
        className={className}
        style={palette}
      >
        <div data-part="photo">
          {image ? <img src={image} alt={imageAlt ?? name} loading="lazy" /> : null}
          <span>{from}</span>
        </div>
        <h3>{name}</h3>
        <p data-part="meta">
          {role} · {years} {yearsUnit}
        </p>
        {note ? <p data-part="note">{note}</p> : null}
        <button data-part="listen" type="button" aria-pressed={playing === index} onClick={() => setPlaying?.(playing === index ? null : index)} aria-label={`${listenLabel}: ${accentText ?? from}`}>
          <span data-part="play" aria-hidden="true">
            {playing === index ? (
              <svg viewBox="0 0 10 10" fill="currentColor">
                <rect x="1" y="1" width="3" height="8" rx="1" />
                <rect x="6" y="1" width="3" height="8" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 10 10" fill="currentColor">
                <path d="M2 1.5v7l6-3.5z" />
              </svg>
            )}
          </span>
          <span>{accentText ?? listenLabel}</span>
          <span data-part="wave" aria-hidden="true">
            {[0, 1, 2, 3, 4, 5, 6].map((bar) => (
              <i key={bar} style={{ ["--vibeui-card-118-i" as string]: bar }} />
            ))}
          </span>
        </button>
      </li>
    </>
  )
}

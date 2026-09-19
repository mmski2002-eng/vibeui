"use client"

import { useEffect, useState, type CSSProperties, type PointerEvent } from "react"

export type People019Person = {
  name: string
  /** Роль: «английский · носитель». */
  role: string
  /** Откуда: «Манчестер». */
  from: string
  /** Лет преподаёт. */
  years: number
  /** Рукописная заметка: «любимое слово — sobremesa». */
  note?: string
  image?: string
  imageAlt?: string
  /** Подпись к «послушать акцент»: «манчестерский». */
  accent?: string
}

export type People019Props = {
  eyebrow?: string
  title?: string
  lede?: string
  people?: readonly People019Person[]
  listenLabel?: string
  /** Сколько секунд «звучит» акцент после нажатия. */
  seconds?: number
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Преподаватели: карточки-«полароиды» с 3D-наклоном за курсором
// (perspective + rotateX/rotateY через --rx/--ry, блик по --x/--y) и
// рукописной заметкой на полях. Внизу карточки кнопка «послушать акцент»
// с волновым индикатором: семь полосок, которые «дышат» на CSS, пока
// «играет»; через несколько секунд затихают. Звука нет — заглушка под
// свой аудио-обработчик. Карточки слегка повёрнуты в разные стороны, как
// разложенные на столе фотографии.
const FONTS = "https://fonts.googleapis.com/css2?family=Onest:wght@500;600;700;800&family=Golos+Text:wght@400;500;600&family=Marck+Script&display=swap"

const STYLES = `
:where([data-vibeui-block="people-019"]){
--vibeui-people-019-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-people-019-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-people-019-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-people-019-on-accent:oklch(from var(--vibeui-people-019-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-people-019-muted:color-mix(in oklab,var(--vibeui-people-019-fg) 62%,var(--vibeui-people-019-bg));
--vibeui-people-019-line:color-mix(in oklab,var(--vibeui-people-019-fg) 12%,transparent);
--vibeui-people-019-paper:color-mix(in oklab,var(--vibeui-people-019-bg) 92%,#fff);
--vibeui-people-019-display:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-people-019-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-people-019-hand:"Marck Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="people-019"]{color-scheme:dark}
:where([data-vibeui-block="people-019"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="people-019"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="people-019"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-people-019-bg);color:var(--vibeui-people-019-fg);font-family:var(--vibeui-people-019-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="people-019"] *{box-sizing:border-box}
[data-vibeui-block="people-019"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="people-019"] [data-part="head"]{max-width:40rem;margin:0 0 2.5rem}
[data-vibeui-block="people-019"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-people-019-hand);font-size:1.4rem;color:var(--vibeui-people-019-accent)}
[data-vibeui-block="people-019"] [data-part="title"]{margin:0;font-family:var(--vibeui-people-019-display);font-weight:800;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1.05;letter-spacing:-.03em;text-wrap:balance}
[data-vibeui-block="people-019"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-people-019-muted)}
[data-vibeui-block="people-019"] [data-part="grid"]{display:grid;gap:1.5rem;margin:0;padding:0;list-style:none;perspective:1200px}
[data-vibeui-block="people-019"] [data-part="card"]{position:relative;display:grid;gap:.6rem;padding:.8rem .8rem 1.1rem;border-radius:.6rem;background:var(--vibeui-people-019-paper);border:1px solid var(--vibeui-people-019-line);box-shadow:0 20px 40px -30px color-mix(in oklab,var(--vibeui-people-019-fg) 60%,transparent);transform:rotate(calc(var(--vibeui-people-019-tilt) * 1deg)) rotateX(calc(var(--vibeui-people-019-rx,0) * 1deg)) rotateY(calc(var(--vibeui-people-019-ry,0) * 1deg));transform-style:preserve-3d;transition:transform .5s cubic-bezier(.2,.8,.2,1),box-shadow .5s;will-change:transform}
[data-vibeui-block="people-019"] [data-part="card"][data-hover="true"]{transition:transform .12s ease-out;box-shadow:0 40px 60px -30px color-mix(in oklab,var(--vibeui-people-019-fg) 60%,transparent)}
[data-vibeui-block="people-019"] [data-part="card"]::after{content:"";position:absolute;inset:0;border-radius:inherit;background:radial-gradient(18rem circle at calc(var(--vibeui-people-019-x,50) * 1%) calc(var(--vibeui-people-019-y,50) * 1%),rgb(255 255 255 / .35),transparent 60%);opacity:0;transition:opacity .3s;pointer-events:none;mix-blend-mode:soft-light}
[data-vibeui-block="people-019"] [data-part="card"][data-hover="true"]::after{opacity:1}
[data-vibeui-block="people-019"] [data-part="photo"]{position:relative;aspect-ratio:4/5;border-radius:.3rem;overflow:hidden;background:color-mix(in oklab,var(--vibeui-people-019-accent) 18%,var(--vibeui-people-019-bg))}
[data-vibeui-block="people-019"] [data-part="photo"] img{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="people-019"] [data-part="photo"] span{position:absolute;left:.6rem;top:.6rem;padding:.25rem .6rem;border-radius:.4rem;background:var(--vibeui-people-019-accent);color:var(--vibeui-people-019-on-accent);font-family:var(--vibeui-people-019-display);font-size:.7rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase}
[data-vibeui-block="people-019"] [data-part="card"] h3{margin:.3rem 0 0;font-family:var(--vibeui-people-019-display);font-weight:700;font-size:1.25rem;letter-spacing:-.02em;line-height:1.2}
[data-vibeui-block="people-019"] [data-part="meta"]{margin:0;font-size:.85rem;color:var(--vibeui-people-019-muted)}
[data-vibeui-block="people-019"] [data-part="note"]{margin:.2rem 0 0;font-family:var(--vibeui-people-019-hand);font-size:1.2rem;line-height:1.25;color:var(--vibeui-people-019-accent);transform:rotate(-1.5deg);transform-origin:left}
[data-vibeui-block="people-019"] [data-part="listen"]{display:flex;align-items:center;gap:.7rem;margin-top:.3rem;padding:.55rem .8rem;border-radius:999px;border:1.5px solid var(--vibeui-people-019-line);background:var(--vibeui-people-019-bg);color:var(--vibeui-people-019-fg);font:inherit;font-size:.85rem;font-weight:600;cursor:pointer;text-align:left;transition:border-color .2s,background .2s}
[data-vibeui-block="people-019"] [data-part="listen"]:hover{border-color:var(--vibeui-people-019-accent)}
[data-vibeui-block="people-019"] [data-part="listen"][aria-pressed="true"]{border-color:var(--vibeui-people-019-accent);background:color-mix(in oklab,var(--vibeui-people-019-accent) 10%,var(--vibeui-people-019-bg))}
[data-vibeui-block="people-019"] [data-part="listen"]:focus-visible{outline:2px solid var(--vibeui-people-019-accent);outline-offset:2px}
[data-vibeui-block="people-019"] [data-part="play"]{display:grid;place-items:center;flex:none;width:1.8rem;height:1.8rem;border-radius:50%;background:var(--vibeui-people-019-accent);color:var(--vibeui-people-019-on-accent)}
[data-vibeui-block="people-019"] [data-part="play"] svg{width:.7rem;height:.7rem}
[data-vibeui-block="people-019"] [data-part="wave"]{display:flex;align-items:center;gap:2px;height:1.2rem;margin-left:auto}
[data-vibeui-block="people-019"] [data-part="wave"] i{width:3px;height:100%;border-radius:2px;background:var(--vibeui-people-019-accent);transform:scaleY(.18);transform-origin:center;transition:transform .3s}
[data-vibeui-block="people-019"] [data-part="listen"][aria-pressed="true"] [data-part="wave"] i{animation:vibeui-people-019-wave 1s ease-in-out infinite;animation-delay:calc(var(--vibeui-people-019-i) * -.13s)}
@keyframes vibeui-people-019-wave{0%,100%{transform:scaleY(.2)}30%{transform:scaleY(1)}60%{transform:scaleY(.45)}}
@container (min-width: 36rem){[data-vibeui-block="people-019"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 64rem){[data-vibeui-block="people-019"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="people-019"] *{animation:none!important;transition:none!important}[data-vibeui-block="people-019"] [data-part="listen"][aria-pressed="true"] [data-part="wave"] i{transform:scaleY(.7)}}`

const DEFAULT_PEOPLE: People019Person[] = [
  { name: "Emma Whitfield", role: "английский · носитель", from: "Манчестер", years: 9, note: "любимое слово — serendipity", accent: "манчестерский", image: "", imageAlt: "Эмма, преподаватель английского" },
  { name: "Diego Ferrer", role: "испанский · носитель", from: "Валенсия", years: 7, note: "любимое слово — sobremesa", accent: "валенсийский", image: "", imageAlt: "Диего, преподаватель испанского" },
  { name: "Giulia Rinaldi", role: "итальянский · носитель", from: "Болонья", years: 6, note: "любимое слово — abbiocco", accent: "болонский", image: "", imageAlt: "Джулия, преподаватель итальянского" },
  { name: "Анна Северова", role: "английский · методист", from: "Петербург", years: 12, note: "любимое слово — petrichor", accent: "RP, почти BBC", image: "", imageAlt: "Анна, методист школы" },
]

/** Преподаватели: полароиды с 3D-наклоном и «послушать акцент». */
export function People019({
  eyebrow = "преподаватели",
  title = "Люди, с которыми не страшно ошибаться",
  lede = "Носители ведут разговорные занятия, методисты — грамматику. У каждого свой акцент: послушайте, чтобы не удивляться на уроке.",
  people = DEFAULT_PEOPLE,
  listenLabel = "послушать акцент",
  seconds = 4,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: People019Props) {
  const [playing, setPlaying] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  useEffect(() => {
    if (playing === null) return
    const timer = setTimeout(() => setPlaying(null), Math.max(1, seconds) * 1000)
    return () => clearTimeout(timer)
  }, [playing, seconds])

  const tilt = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    const target = event.currentTarget.style
    target.setProperty("--vibeui-people-019-ry", String(((x - 0.5) * 16).toFixed(2)))
    target.setProperty("--vibeui-people-019-rx", String(((0.5 - y) * 16).toFixed(2)))
    target.setProperty("--vibeui-people-019-x", String(Math.round(x * 100)))
    target.setProperty("--vibeui-people-019-y", String(Math.round(y * 100)))
  }

  const reset = (event: PointerEvent<HTMLElement>) => {
    const target = event.currentTarget.style
    target.setProperty("--vibeui-people-019-ry", "0")
    target.setProperty("--vibeui-people-019-rx", "0")
    setHovered(null)
  }

  const palette = {
    ...(accent ? { "--vibeui-people-019-accent": accent } : null),
    ...(ink ? { "--vibeui-people-019-fg": ink } : null),
    ...(background ? { "--vibeui-people-019-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-people-019" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="people-019" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <ul data-part="grid">
            {people.map((person, index) => (
              <li
                key={person.name}
                data-part="card"
                data-hover={hovered === index ? "true" : undefined}
                style={{ ["--vibeui-people-019-tilt" as string]: index % 2 === 0 ? -1.5 : 1.5 }}
                onPointerMove={tilt}
                onPointerEnter={() => setHovered(index)}
                onPointerLeave={reset}
              >
                <div data-part="photo">
                  {person.image ? <img src={person.image} alt={person.imageAlt ?? person.name} loading="lazy" /> : null}
                  <span>{person.from}</span>
                </div>
                <h3>{person.name}</h3>
                <p data-part="meta">
                  {person.role} · {person.years} лет
                </p>
                {person.note ? <p data-part="note">{person.note}</p> : null}
                <button data-part="listen" type="button" aria-pressed={playing === index} onClick={() => setPlaying(playing === index ? null : index)} aria-label={`${listenLabel}: ${person.accent ?? person.from}`}>
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
                  <span>{person.accent ?? listenLabel}</span>
                  <span data-part="wave" aria-hidden="true">
                    {[0, 1, 2, 3, 4, 5, 6].map((bar) => (
                      <i key={bar} style={{ ["--vibeui-people-019-i" as string]: bar }} />
                    ))}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

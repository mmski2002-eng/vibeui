"use client"

import { useEffect, useState, type CSSProperties, type PointerEvent } from "react"
import { Card118 } from "@/registry/components/card/card-118/card-118"

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
  yearsUnit?: string
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
@keyframes vibeui-people-019-wave{0%,100%{transform:scaleY(.2)}30%{transform:scaleY(1)}60%{transform:scaleY(.45)}}
@container (min-width: 36rem){[data-vibeui-block="people-019"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 64rem){[data-vibeui-block="people-019"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="people-019"] *{animation:none!important;transition:none!important}}`

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
  yearsUnit = "лет",
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
              <Card118 key={person.name} data-part="card" name={person.name} image={person.image} imageAlt={person.imageAlt} from={person.from} role={person.role} years={person.years} note={person.note} accentText={person.accent} yearsUnit={yearsUnit} listenLabel={listenLabel} playing={playing} setPlaying={setPlaying} index={index} data-hover={hovered === index ? "true" : undefined} style={{ ["--vibeui-people-019-tilt" as string]: index % 2 === 0 ? -1.5 : 1.5 }} onPointerMove={tilt} onPointerEnter={() => setHovered(index)} onPointerLeave={reset} accent={accent} />
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

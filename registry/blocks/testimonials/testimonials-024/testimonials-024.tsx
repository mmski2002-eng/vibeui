"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"
import { Card111 } from "@/registry/components/card/card-111/card-111"

export type Testimonials024Quote = {
  text: string
  name: string
  role?: string
  /** Проект, к которому относится отзыв. */
  project?: string
}

export type Testimonials024Props = {
  eyebrow?: string
  quotes?: readonly Testimonials024Quote[]
  /** Секунд на цитату при автопрокрутке. 0 — без автопрокрутки. */
  interval?: number
  prevLabel?: string
  nextLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Отзывы как заметки на столе: бумажные карточки с полоской скотча, каждая
// чуть повёрнута в свою сторону, появляются каскадом при попадании в viewport
// (IntersectionObserver). Одна заметка «поднята» — выровнена, крупнее, с
// цветной тенью и полосой прогресса; автопрокрутка поднимает следующую,
// стрелки, клик по заметке и клавиши ← → переключают вручную, наведение и
// фокус ставят на паузу. По карточке ходит пятно света за курсором. Имя —
// рукописной подписью.
const FONTS = "https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Inter+Tight:wght@500;600;800&family=Golos+Text:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="testimonials-024"]){
--vibeui-testimonials-024-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-testimonials-024-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-024-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-024-muted:color-mix(in oklab,var(--vibeui-testimonials-024-fg) 60%,var(--vibeui-testimonials-024-bg));
--vibeui-testimonials-024-line:color-mix(in oklab,var(--vibeui-testimonials-024-fg) 12%,transparent);
--vibeui-testimonials-024-paper:color-mix(in oklab,var(--vibeui-testimonials-024-bg) 70%,light-dark(#ffffff,#2a2a2a));
--vibeui-testimonials-024-hand:"Caveat","Segoe Script",cursive;
--vibeui-testimonials-024-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-testimonials-024-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-testimonials-024-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-testimonials-024-ease:cubic-bezier(.2,.8,.2,1);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-024"]{color-scheme:dark}
:where([data-vibeui-block="testimonials-024"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="testimonials-024"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="testimonials-024"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-testimonials-024-bg);color:var(--vibeui-testimonials-024-fg);font-family:var(--vibeui-testimonials-024-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="testimonials-024"] *{box-sizing:border-box}
[data-vibeui-block="testimonials-024"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="testimonials-024"] [data-part="top"]{display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-bottom:2.5rem;opacity:0;transform:translateY(.8rem);transition:opacity .7s var(--vibeui-testimonials-024-ease),transform .7s var(--vibeui-testimonials-024-ease)}
[data-vibeui-block="testimonials-024"][data-in="true"] [data-part="top"]{opacity:1;transform:none}
[data-vibeui-block="testimonials-024"] [data-part="eyebrow"]{margin:0;font-family:var(--vibeui-testimonials-024-mono);font-size:.78rem;color:var(--vibeui-testimonials-024-muted)}
[data-vibeui-block="testimonials-024"] [data-part="nav"]{display:flex;gap:.4rem}
[data-vibeui-block="testimonials-024"] [data-part="nav"] button{width:2.6rem;height:2.6rem;border-radius:50%;border:1px solid var(--vibeui-testimonials-024-line);background:none;color:inherit;font-size:1.1rem;cursor:pointer;transition:background .2s,border-color .2s,transform .3s var(--vibeui-testimonials-024-ease)}
[data-vibeui-block="testimonials-024"] [data-part="nav"] button:hover{border-color:var(--vibeui-testimonials-024-accent);background:color-mix(in oklab,var(--vibeui-testimonials-024-accent) 10%,transparent);transform:scale(1.08)}
[data-vibeui-block="testimonials-024"] [data-part="nav"] button:focus-visible{outline:2px solid var(--vibeui-testimonials-024-accent);outline-offset:2px}
[data-vibeui-block="testimonials-024"] [data-part="board"]{display:grid;gap:1.6rem;margin:0;padding:.6rem 0;list-style:none}
[data-vibeui-block="testimonials-024"][data-in="true"] [data-vibeui-block="card-111"]{opacity:1;animation:vibeui-testimonials-024-rise .8s var(--vibeui-card-111-ease) backwards;animation-delay:calc(var(--vibeui-testimonials-024-i) * .1s)}
[data-vibeui-block="testimonials-024"][data-in="true"] [data-vibeui-block="card-111"]:hover{transform:rotate(calc(var(--vibeui-card-111-r) * .4deg)) translateY(-.3rem)}
[data-vibeui-block="testimonials-024"][data-in="true"] [data-vibeui-block="card-111"][data-active="true"]{transform:rotate(0) translateY(-.4rem) scale(1.04);box-shadow:0 1px 0 var(--vibeui-card-111-line),0 36px 60px -30px color-mix(in oklab,var(--vibeui-card-111-accent) 55%,rgb(0 0 0 / .5));z-index:2}
[data-vibeui-block="testimonials-024"][data-paused="true"] [data-vibeui-block="card-111"] [data-part="bar"]::after{animation-play-state:paused}
@keyframes vibeui-testimonials-024-fill{from{transform:scaleX(0)}to{transform:none}}
@keyframes vibeui-testimonials-024-rise{from{opacity:0;transform:translateY(2.4rem) rotate(calc(var(--vibeui-testimonials-024-r) * 1deg)) scale(.96)}}
@container (min-width: 40rem){[data-vibeui-block="testimonials-024"] [data-part="board"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:2rem}}
@container (min-width: 60rem){[data-vibeui-block="testimonials-024"] [data-part="board"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:2.4rem;padding:1rem 0}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-024"] *{animation:none!important;transition:none!important}[data-vibeui-block="testimonials-024"] [data-part="top"]{opacity:1;transform:none}}`

const DEFAULT_QUOTES: Testimonials024Quote[] = [
  { text: "Даня сделал за три недели то, на что у нас ушло бы полгода согласований. И это работает до сих пор.", name: "Марина Соколова", role: "СЕО, магазин керамики", project: "магазин" },
  { text: "Редкий случай, когда дизайнер понимает, что такое стейт, а разработчик — что такое отступ.", name: "Игорь Черных", role: "CTO, Точка", project: "дизайн-система" },
  { text: "Панель диспетчера перестала быть местом, куда страшно заходить. Люди стали её открывать по своей воле.", name: "Алина Гусева", role: "руководитель операций", project: "доставка" },
]

const TILTS = [-2.5, 1.5, -1, 2, -1.5, 1]

/** Отзывы-заметки на столе: каскадное появление, одна поднята, автопрокрутка. */
export function Testimonials024({
  eyebrow = "что говорят",
  quotes = DEFAULT_QUOTES,
  interval = 7,
  prevLabel = "Предыдущий отзыв",
  nextLabel = "Следующий отзыв",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Testimonials024Props) {
  const root = useRef<HTMLElement>(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [seen, setSeen] = useState(false)
  const count = quotes.length

  useEffect(() => {
    const element = root.current
    if (!element) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(element)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!interval || paused || !seen || count < 2) return
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % count), interval * 1000)
    return () => window.clearTimeout(timer)
  }, [index, interval, paused, seen, count])

  const spot = (event: PointerEvent<HTMLLIElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty("--vibeui-testimonials-024-x", `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`)
    event.currentTarget.style.setProperty("--vibeui-testimonials-024-y", `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`)
  }

  const palette = {
    "--vibeui-testimonials-024-t": `${interval}s`,
    ...(accent ? { "--vibeui-testimonials-024-accent": accent } : null),
    ...(ink ? { "--vibeui-testimonials-024-fg": ink } : null),
    ...(background ? { "--vibeui-testimonials-024-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-testimonials-024" precedence="medium">
        {STYLES}
      </style>
      <section
        ref={root}
        data-vibeui-block="testimonials-024"
        data-tone={tone === "auto" ? undefined : tone}
        data-paused={paused}
        data-in={seen}
        className={className}
        style={palette}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") setIndex((current) => (current + 1) % count)
          if (event.key === "ArrowLeft") setIndex((current) => (current - 1 + count) % count)
        }}
      >
        <div data-part="shell">
          <div data-part="top">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            {count > 1 ? (
              <div data-part="nav">
                <button type="button" aria-label={prevLabel} onClick={() => setIndex((current) => (current - 1 + count) % count)}>
                  ←
                </button>
                <button type="button" aria-label={nextLabel} onClick={() => setIndex((current) => (current + 1) % count)}>
                  →
                </button>
              </div>
            ) : null}
          </div>
          <ul data-part="board">
            {quotes.map((quote, i) => (
              <Card111 key={quote.name} data-part="note" name={quote.name} text={quote.text} role={quote.role} project={quote.project} interval={interval} index={index} count={count} i={i} data-active={i === index} aria-current={i === index ? "true" : undefined} style={{ ["--vibeui-testimonials-024-i" as string]: i, ["--vibeui-testimonials-024-r" as string]: TILTS[i % TILTS.length] }} onClick={() => setIndex(i)} onPointerMove={spot} accent={accent} />
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

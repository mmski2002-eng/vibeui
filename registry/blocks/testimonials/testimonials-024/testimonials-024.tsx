"use client"

import { useEffect, useState, type CSSProperties } from "react"

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

// Отзывы по одному, крупно: цитата плотным гротеском во всю ширину, под ней
// имя и роль, справа стрелки и точки. Автопрокрутка с полосой прогресса
// (keyframes на ширину, перезапуск через key), пауза по наведению и при
// фокусе внутри; смена — плавный сдвиг вверх с затуханием. Клавиши ← → по
// фокусу на секции.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;800&family=Golos+Text:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="testimonials-024"]){
--vibeui-testimonials-024-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-testimonials-024-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-024-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-024-muted:color-mix(in oklab,var(--vibeui-testimonials-024-fg) 60%,var(--vibeui-testimonials-024-bg));
--vibeui-testimonials-024-line:color-mix(in oklab,var(--vibeui-testimonials-024-fg) 12%,transparent);
--vibeui-testimonials-024-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-testimonials-024-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-testimonials-024-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-024"]{color-scheme:dark}
:where([data-vibeui-block="testimonials-024"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="testimonials-024"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="testimonials-024"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-testimonials-024-bg);color:var(--vibeui-testimonials-024-fg);font-family:var(--vibeui-testimonials-024-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="testimonials-024"] *{box-sizing:border-box}
[data-vibeui-block="testimonials-024"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="testimonials-024"] [data-part="top"]{display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-bottom:2rem}
[data-vibeui-block="testimonials-024"] [data-part="eyebrow"]{margin:0;font-family:var(--vibeui-testimonials-024-mono);font-size:.78rem;color:var(--vibeui-testimonials-024-muted)}
[data-vibeui-block="testimonials-024"] [data-part="nav"]{display:flex;gap:.4rem}
[data-vibeui-block="testimonials-024"] [data-part="nav"] button{width:2.6rem;height:2.6rem;border-radius:50%;border:1px solid var(--vibeui-testimonials-024-line);background:none;color:inherit;font-size:1.1rem;cursor:pointer;transition:background .2s,border-color .2s}
[data-vibeui-block="testimonials-024"] [data-part="nav"] button:hover{border-color:var(--vibeui-testimonials-024-accent);background:color-mix(in oklab,var(--vibeui-testimonials-024-accent) 10%,transparent)}
[data-vibeui-block="testimonials-024"] [data-part="nav"] button:focus-visible{outline:2px solid var(--vibeui-testimonials-024-accent);outline-offset:2px}
[data-vibeui-block="testimonials-024"] [data-part="quote"]{margin:0;font-family:var(--vibeui-testimonials-024-display);font-weight:600;font-size:clamp(1.6rem,4.4cqi,3.4rem);line-height:1.12;letter-spacing:-.035em;text-wrap:balance;min-height:3.4em;animation:vibeui-testimonials-024-in .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="testimonials-024"] [data-part="quote"]::before{content:"«";color:var(--vibeui-testimonials-024-accent)}
[data-vibeui-block="testimonials-024"] [data-part="quote"]::after{content:"»";color:var(--vibeui-testimonials-024-accent)}
[data-vibeui-block="testimonials-024"] [data-part="who"]{display:flex;align-items:baseline;gap:.6rem;flex-wrap:wrap;margin-top:1.6rem;animation:vibeui-testimonials-024-in .6s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="testimonials-024"] [data-part="who"] b{font-weight:600}
[data-vibeui-block="testimonials-024"] [data-part="who"] span{color:var(--vibeui-testimonials-024-muted)}
[data-vibeui-block="testimonials-024"] [data-part="who"] i{font-style:normal;font-family:var(--vibeui-testimonials-024-mono);font-size:.72rem;padding:.2rem .5rem;border-radius:4px;border:1px solid var(--vibeui-testimonials-024-line)}
[data-vibeui-block="testimonials-024"] [data-part="dots"]{display:flex;gap:.5rem;margin-top:2rem}
[data-vibeui-block="testimonials-024"] [data-part="dot"]{position:relative;width:3rem;height:.3rem;border-radius:999px;border:0;padding:0;background:var(--vibeui-testimonials-024-line);cursor:pointer;overflow:hidden}
[data-vibeui-block="testimonials-024"] [data-part="dot"]::after{content:"";position:absolute;inset:0;background:var(--vibeui-testimonials-024-accent);transform:scaleX(0);transform-origin:left}
[data-vibeui-block="testimonials-024"] [data-part="dot"][data-done="true"]::after{transform:none}
[data-vibeui-block="testimonials-024"] [data-part="dot"][data-active="true"]::after{animation:vibeui-testimonials-024-fill var(--vibeui-testimonials-024-t) linear forwards}
[data-vibeui-block="testimonials-024"][data-paused="true"] [data-part="dot"][data-active="true"]::after{animation-play-state:paused}
[data-vibeui-block="testimonials-024"] [data-part="dot"]:focus-visible{outline:2px solid var(--vibeui-testimonials-024-accent);outline-offset:3px}
@keyframes vibeui-testimonials-024-in{from{opacity:0;transform:translateY(.6rem)}to{opacity:1;transform:none}}
@keyframes vibeui-testimonials-024-fill{from{transform:scaleX(0)}to{transform:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-024"] *{animation:none!important;transition:none!important}[data-vibeui-block="testimonials-024"] [data-part="dot"][data-active="true"]::after{transform:none}}`

const DEFAULT_QUOTES: Testimonials024Quote[] = [
  { text: "Даня сделал за три недели то, на что у нас ушло бы полгода согласований. И это работает до сих пор.", name: "Марина Соколова", role: "СЕО, магазин керамики", project: "магазин" },
  { text: "Редкий случай, когда дизайнер понимает, что такое стейт, а разработчик — что такое отступ.", name: "Игорь Черных", role: "CTO, Точка", project: "дизайн-система" },
  { text: "Панель диспетчера перестала быть местом, куда страшно заходить. Люди стали её открывать по своей воле.", name: "Алина Гусева", role: "руководитель операций", project: "доставка" },
]

/** Цитаты по одной с автопрокруткой и полосой прогресса. */
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
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = quotes.length

  useEffect(() => {
    if (!interval || paused || count < 2) return
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % count), interval * 1000)
    return () => window.clearTimeout(timer)
  }, [index, interval, paused, count])

  const quote = quotes[index]
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
        data-vibeui-block="testimonials-024"
        data-tone={tone === "auto" ? undefined : tone}
        data-paused={paused}
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
          <blockquote key={index} data-part="quote" aria-live="polite">
            {quote.text}
          </blockquote>
          <div key={`who-${index}`} data-part="who">
            <b>{quote.name}</b>
            {quote.role ? <span>{quote.role}</span> : null}
            {quote.project ? <i>{quote.project}</i> : null}
          </div>
          {count > 1 ? (
            <div data-part="dots">
              {quotes.map((item, i) => (
                <button key={item.name} type="button" data-part="dot" data-active={i === index} data-done={i < index} aria-label={`Отзыв ${i + 1}`} onClick={() => setIndex(i)} />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}

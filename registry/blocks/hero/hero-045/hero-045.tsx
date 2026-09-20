"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Hero045Props = {
  /** Строки имени: каждая въезжает отдельно. */
  lines?: readonly string[]
  /** Подпись под именем: кто это. */
  role?: string
  /** Ярлык над цитатой. */
  quoteLabel?: string
  /** Цитаты «сегодняшней строки»: печатаются по очереди. */
  quotes?: readonly string[]
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  /** Стартовое состояние: «night» — графит, «day» — бумага. */
  defaultMode?: "day" | "night"
  /** Показывать ли переключатель день/ночь. */
  showModeSwitch?: boolean
  /** Фоновое видео ночи (mp4, тихое и медленное); без него фон — просто цвет. */
  video?: string
  /** Фоновое видео дня: подменяет ночное при переключении темы. */
  videoDay?: string
  /** Постеры к видео: показываются до загрузки и при prefers-reduced-motion. */
  poster?: string
  posterDay?: string
  /** Строка над именем и подписи переключателя темы. */
  topLine?: string
  paperLabel?: string
  nightLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Первый экран писателя: имя огромной антиквой, каждая строка въезжает
// из-под маски (clip-path снизу + translateY) с задержкой; справа
// «сегодняшняя строка» — цитата печатается буква за буквой, за ней идёт
// курсор-перо, которое чуть покачивается, пока пишет; дописав, ждёт,
// стирает и берёт следующую. Справа сверху солнце/луна: клик шлёт
// `vibeui-writer:theme`, и весь сайт плавно меняет color-scheme.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=PT+Serif:ital,wght@0,400;0,700;1,400&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-045"]){
--vibeui-hero-045-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-hero-045-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-045-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-045-on-accent:oklch(from var(--vibeui-hero-045-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-045-muted:color-mix(in oklab,var(--vibeui-hero-045-fg) 60%,var(--vibeui-hero-045-bg));
--vibeui-hero-045-line:color-mix(in oklab,var(--vibeui-hero-045-fg) 14%,transparent);
--vibeui-hero-045-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-hero-045-font:"PT Serif",Georgia,"Times New Roman",serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-045"]{color-scheme:dark}
:where([data-vibeui-block="hero-045"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-045"][data-tone="dark"]){color-scheme:dark}
:where([data-vibeui-block="hero-045"][data-mode="day"]){color-scheme:light}
:where([data-vibeui-block="hero-045"][data-mode="night"]){color-scheme:dark}
[data-vibeui-block="hero-045"]{box-sizing:border-box;position:relative;overflow:hidden;padding:clamp(2.5rem,6cqi,4rem) 0 clamp(3rem,6cqi,5rem);background:var(--vibeui-hero-045-bg);color:var(--vibeui-hero-045-fg);font-family:var(--vibeui-hero-045-font);font-size:1.125rem;line-height:1.7;transition:background-color .6s,color .6s}
[data-vibeui-block="hero-045"] *{box-sizing:border-box}
[data-vibeui-block="hero-045"] [data-part="film"]{position:absolute;inset:0;pointer-events:none;background:var(--vibeui-hero-045-poster,none) center/cover no-repeat}
[data-vibeui-block="hero-045"] [data-part="clip"]{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .6s}
[data-vibeui-block="hero-045"] [data-part="clip"][data-on="true"]{opacity:1}
[data-vibeui-block="hero-045"] [data-part="veil"]{position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,color-mix(in oklab,var(--vibeui-hero-045-bg) 30%,transparent),color-mix(in oklab,var(--vibeui-hero-045-bg) 30%,transparent) 55%,var(--vibeui-hero-045-bg)),linear-gradient(100deg,var(--vibeui-hero-045-bg) 12%,color-mix(in oklab,var(--vibeui-hero-045-bg) 72%,transparent) 55%,color-mix(in oklab,var(--vibeui-hero-045-bg) 35%,transparent));transition:background .6s}
[data-vibeui-block="hero-045"] [data-part="grain"]{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:.07;mix-blend-mode:overlay}
[data-vibeui-block="hero-045"] [data-part="shell"]{position:relative;max-width:74rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem}
[data-vibeui-block="hero-045"] [data-part="top"]{display:flex;align-items:center;justify-content:space-between;gap:1rem;font-size:.72rem;font-style:italic;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-hero-045-muted)}
[data-vibeui-block="hero-045"] [data-part="mode"]{position:relative;display:inline-flex;align-items:center;gap:.6rem;padding:.4rem .4rem .4rem .9rem;border:1px solid var(--vibeui-hero-045-line);border-radius:999px;background:transparent;color:var(--vibeui-hero-045-fg);font:inherit;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:border-color .25s,background-color .6s}
[data-vibeui-block="hero-045"] [data-part="mode"]:hover{border-color:var(--vibeui-hero-045-accent)}
[data-vibeui-block="hero-045"] [data-part="orb"]{position:relative;display:grid;place-items:center;width:1.9rem;height:1.9rem;border-radius:50%;background:var(--vibeui-hero-045-accent);color:var(--vibeui-hero-045-on-accent);transition:background-color .6s}
[data-vibeui-block="hero-045"] [data-part="orb"] svg{position:absolute;width:1.05rem;height:1.05rem;transition:opacity .5s,transform .6s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="hero-045"] [data-part="orb"] [data-icon="sun"]{opacity:0;transform:rotate(-90deg) scale(.4)}
[data-vibeui-block="hero-045"] [data-part="mode"][aria-checked="true"] [data-icon="sun"]{opacity:1;transform:rotate(0) scale(1)}
[data-vibeui-block="hero-045"] [data-part="mode"][aria-checked="true"] [data-icon="moon"]{opacity:0;transform:rotate(90deg) scale(.4)}
[data-vibeui-block="hero-045"] [data-part="name"]{margin:0;font-family:var(--vibeui-hero-045-display);font-weight:400;font-size:clamp(3.6rem,16cqi,12rem);line-height:.92;letter-spacing:-.02em}
[data-vibeui-block="hero-045"] [data-part="mask"]{display:block;clip-path:inset(-.2em -50% 0 -.2em);padding-bottom:.06em;margin-bottom:-.06em}
[data-vibeui-block="hero-045"] [data-part="word"]{display:block;transform:translateY(110%);animation:vibeui-hero-045-rise 1.1s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:calc(var(--vibeui-hero-045-i) * .16s + .1s)}
[data-vibeui-block="hero-045"] [data-part="mask"]:nth-child(2n) [data-part="word"]{font-style:italic;padding-left:.18em}
[data-vibeui-block="hero-045"] [data-part="role"]{margin:1.5rem 0 0;max-width:34rem;font-size:1.05rem;font-style:italic;color:var(--vibeui-hero-045-muted);opacity:0;animation:vibeui-hero-045-fade 1s ease-out .8s forwards}
[data-vibeui-block="hero-045"] [data-part="today"]{display:grid;gap:.7rem;max-width:36rem;padding-top:1.6rem;border-top:1px solid var(--vibeui-hero-045-line);opacity:0;animation:vibeui-hero-045-fade 1s ease-out 1.1s forwards}
[data-vibeui-block="hero-045"] [data-part="label"]{margin:0;font-size:.72rem;font-style:italic;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-hero-045-accent)}
[data-vibeui-block="hero-045"] [data-part="quote"]{margin:0;min-height:3.4em;font-family:var(--vibeui-hero-045-display);font-size:clamp(1.5rem,3cqi,2.1rem);line-height:1.35;font-weight:400}
[data-vibeui-block="hero-045"] [data-part="pen"]{display:inline-block;width:.6em;height:.6em;margin-left:.15em;vertical-align:-.05em;color:var(--vibeui-hero-045-accent);transform-origin:80% 80%;animation:vibeui-hero-045-blink 1s steps(2) infinite}
[data-vibeui-block="hero-045"] [data-part="quote"][data-writing="true"] [data-part="pen"]{animation:vibeui-hero-045-scribble .18s ease-in-out infinite alternate}
[data-vibeui-block="hero-045"] [data-part="actions"]{display:flex;flex-wrap:wrap;align-items:center;gap:.9rem;opacity:0;animation:vibeui-hero-045-fade 1s ease-out 1.4s forwards}
[data-vibeui-block="hero-045"] [data-part="primary"]{display:inline-flex;align-items:center;justify-content:center;padding:.8rem 1.5rem;border-radius:999px;background:var(--vibeui-hero-045-accent);color:var(--vibeui-hero-045-on-accent);text-decoration:none;font-style:italic;font-size:1.02rem;transition:transform .25s cubic-bezier(.2,.7,.2,1),box-shadow .25s}
[data-vibeui-block="hero-045"] [data-part="primary"]:hover{transform:translateY(-2px);box-shadow:0 14px 30px -14px var(--vibeui-hero-045-accent)}
[data-vibeui-block="hero-045"] [data-part="secondary"]{position:relative;color:var(--vibeui-hero-045-fg);text-decoration:none;font-style:italic;font-size:1.02rem;padding:.4rem .1rem}
[data-vibeui-block="hero-045"] [data-part="secondary"]::after{content:"";position:absolute;left:0;right:0;bottom:.1rem;height:1px;background:var(--vibeui-hero-045-accent);transform:scaleX(.4);transform-origin:left;transition:transform .35s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="hero-045"] [data-part="secondary"]:hover::after{transform:scaleX(1)}
[data-vibeui-block="hero-045"] a:focus-visible,[data-vibeui-block="hero-045"] button:focus-visible{outline:2px solid var(--vibeui-hero-045-accent);outline-offset:3px}
@keyframes vibeui-hero-045-rise{to{transform:translateY(0)}}
@keyframes vibeui-hero-045-fade{to{opacity:1}}
@keyframes vibeui-hero-045-blink{50%{opacity:0}}
@keyframes vibeui-hero-045-scribble{from{transform:rotate(-8deg) translateY(0)}to{transform:rotate(6deg) translateY(-.06em)}}
@container (min-width: 56rem){[data-vibeui-block="hero-045"] [data-part="shell"]{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);column-gap:3rem;row-gap:3rem}[data-vibeui-block="hero-045"] [data-part="top"],[data-vibeui-block="hero-045"] [data-part="actions"]{grid-column:1/-1}[data-vibeui-block="hero-045"] [data-part="bottom"]{display:contents}[data-vibeui-block="hero-045"] [data-part="today"]{align-self:end;margin-bottom:.5rem}[data-vibeui-block="hero-045"] [data-part="actions"]{margin-top:-.5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-045"] *{animation:none!important;transition:none!important}[data-vibeui-block="hero-045"] [data-part="clip"]{display:none}[data-vibeui-block="hero-045"] [data-part="word"]{transform:none}[data-vibeui-block="hero-045"] [data-part="role"],[data-vibeui-block="hero-045"] [data-part="today"],[data-vibeui-block="hero-045"] [data-part="actions"]{opacity:1}}`

/** Хиро писателя: имя из-под маски, цитата пером, солнце/луна на весь сайт. */
export function Hero045({
  lines = ["Вера", "Холодова"],
  role = "Эссеистка. Пишу о городах, памяти и домах, в которых мы не жили.",
  quoteLabel = "Сегодняшняя строка",
  quotes = [
    "Тишина — это не отсутствие звука, а место, где его слушают.",
    "Все города, в которых я жила, начинались с вокзала и заканчивались кухней.",
    "Пишу, чтобы не забыть; забываю, чтобы было о чём писать.",
  ],
  primaryLabel = "Читать тексты",
  primaryHref = "#texts",
  secondaryLabel = "О книге",
  secondaryHref = "#book",
  defaultMode = "night",
  showModeSwitch = true,
  video,
  videoDay,
  poster,
  posterDay,
  topLine = "Личный сайт · тексты · книга",
  paperLabel = "Бумага",
  nightLabel = "Ночь",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero045Props) {
  const [mode, setMode] = useState<"day" | "night" | null>(null)
  const filmRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [count, setCount] = useState(0)
  const [phase, setPhase] = useState<"write" | "hold" | "erase">("write")
  const current = mode ?? defaultMode
  const quote = quotes[index % Math.max(1, quotes.length)] ?? ""

  useEffect(() => {
    const onTheme = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: string }>).detail
      if (detail?.mode === "day" || detail?.mode === "night") setMode(detail.mode)
    }
    window.addEventListener("vibeui-writer:theme", onTheme)
    return () => window.removeEventListener("vibeui-writer:theme", onTheme)
  }, [])

  // Крутится только видимый клип; при reduced-motion оба стоят — виден постер.
  useEffect(() => {
    if (!filmRef.current) return
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    filmRef.current.querySelectorAll<HTMLVideoElement>("video").forEach((clip) => {
      if (!still && clip.dataset.on === "true") clip.play().catch(() => {})
      else clip.pause()
    })
  }, [current, video, videoDay])

  useEffect(() => {
    if (!quote) return
    let timer = 0
    if (phase === "write") {
      if (count < quote.length) {
        // Пауза после знаков препинания — как у живого письма.
        const char = quote[count - 1] ?? ""
        const delay = /[,;:—]/.test(char) ? 260 : /[.!?]/.test(char) ? 420 : 48 + (count % 3) * 14
        timer = window.setTimeout(() => setCount((value) => value + 1), delay)
      } else {
        timer = window.setTimeout(() => setPhase("hold"), 0)
      }
    } else if (phase === "hold") {
      timer = window.setTimeout(() => setPhase(quotes.length > 1 ? "erase" : "hold"), 4200)
    } else if (count > 0) {
      timer = window.setTimeout(() => setCount((value) => Math.max(0, value - 3)), 22)
    } else {
      timer = window.setTimeout(() => {
        setIndex((value) => (value + 1) % quotes.length)
        setPhase("write")
      }, 350)
    }
    return () => window.clearTimeout(timer)
  }, [phase, count, quote, quotes.length])

  const toggle = () => {
    const next = current === "day" ? "night" : "day"
    setMode(next)
    window.dispatchEvent(new CustomEvent("vibeui-writer:theme", { detail: { mode: next } }))
  }

  const palette = {
    ...(accent ? { "--vibeui-hero-045-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-045-fg": ink } : null),
    ...(background ? { "--vibeui-hero-045-bg": background } : null),
    ...(poster ? { "--vibeui-hero-045-poster": `url("${current === "day" && posterDay ? posterDay : poster}")` } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-045" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-045" data-tone={tone === "auto" ? undefined : tone} data-mode={mode ?? undefined} className={className} style={palette}>
        {video ? (
          <div ref={filmRef} data-part="film" aria-hidden="true">
            <video data-part="clip" data-on={current === "night" || !videoDay} src={video} poster={poster} muted loop playsInline preload="metadata" />
            {videoDay ? <video data-part="clip" data-on={current === "day"} src={videoDay} poster={posterDay ?? poster} muted loop playsInline preload="metadata" /> : null}
            <div data-part="veil" />
          </div>
        ) : null}
        <svg data-part="grain" aria-hidden="true">
          <filter id="vibeui-hero-045-noise">
            <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix values="0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .6 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#vibeui-hero-045-noise)" />
        </svg>
        <div data-part="shell">
          <div data-part="top">
            <span>{topLine}</span>
            {showModeSwitch ? (
              <button data-part="mode" type="button" role="switch" aria-checked={current === "day"} onClick={toggle}>
                <span>{current === "day" ? paperLabel : nightLabel}</span>
                <span data-part="orb" aria-hidden="true">
                  <svg data-icon="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                  </svg>
                  <svg data-icon="moon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
                  </svg>
                </span>
              </button>
            ) : null}
          </div>
          <div>
            <h1 data-part="name">
              {lines.map((line, i) => (
                <span key={line + i} data-part="mask">
                  <span data-part="word" style={{ ["--vibeui-hero-045-i" as string]: i }}>
                    {line}
                  </span>
                </span>
              ))}
            </h1>
            {role ? <p data-part="role">{role}</p> : null}
          </div>
          <div data-part="bottom">
            <div data-part="today">
              {quoteLabel ? <p data-part="label">{quoteLabel}</p> : null}
              <p data-part="quote" data-writing={phase === "write"} aria-live="off">
                {quote.slice(0, count)}
                <svg data-part="pen" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3 21l2.2-6.6L17.4 2.2a2 2 0 0 1 2.8 0l1.6 1.6a2 2 0 0 1 0 2.8L9.6 18.8 3 21Zm4.4-5.2-1 3 3-1 10.6-10.6-2-2L7.4 15.8Z" />
                </svg>
              </p>
              <span hidden>{quote}</span>
            </div>
            <div data-part="actions">
              {primaryLabel ? (
                <a data-part="primary" href={primaryHref}>
                  {primaryLabel}
                </a>
              ) : null}
              {secondaryLabel ? (
                <a data-part="secondary" href={secondaryHref}>
                  {secondaryLabel}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

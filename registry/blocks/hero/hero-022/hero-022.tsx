"use client"

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react"

export type Hero022Fact = {
  value: string
  label: string
}

export type Hero022Props = {
  /** Строка над заголовком: «онлайн-курс · старт 6 октября». */
  eyebrow?: string
  /** Заголовок; слово в *звёздочках* подчёркивается маркером. */
  title?: string
  lede?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  /** Кадр урока в большой плитке. */
  poster?: string
  posterAlt?: string
  duration?: string
  /** Плитка с гигантской цифрой: «6», «недель». */
  bigValue?: string
  bigLabel?: string
  /** Плитка мест: сколько занято из скольких. */
  seatsTaken?: number
  seatsTotal?: number
  seatsLabel?: string
  /** Плитка даты: «6 окт», «старт потока». */
  dateValue?: string
  dateLabel?: string
  facts?: readonly Hero022Fact[]
  logosLabel?: string
  logos?: readonly string[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Бенто-хиро лендинга курса: гигантский заголовок на всю ширину — слова
// проявляются по одному из размытия, маркер дорисовывается после. Под ним
// мозаика из четырёх плиток: превью урока 2×2, цифра-гигант, живой
// индикатор мест и дата старта. Плитки наклоняются за курсором (3D через
// CSS-переменные без ререндеров). Фон — медленно плывущий mesh-градиент.
// Факты внизу набегают счётчиком при появлении.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-022"]){
--vibeui-hero-022-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-hero-022-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-022-muted:light-dark(#6b7280,#a3a3a3);
--vibeui-hero-022-card:light-dark(var(--vibeui-hero-022-bg),#242424);
--vibeui-hero-022-line:light-dark(#e5e7eb,#2e2e2e);
--vibeui-hero-022-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-022-on-accent:oklch(from var(--vibeui-hero-022-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-022-marker:light-dark(#d9f99d,rgb(163 230 53 / .3));
--vibeui-hero-022-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-022-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-022"]{color-scheme:dark}
:where([data-vibeui-block="hero-022"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-022"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-022"]{box-sizing:border-box;display:block;position:relative;overflow:hidden;background:var(--vibeui-hero-022-bg);color:var(--vibeui-hero-022-fg);font-family:var(--vibeui-hero-022-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="hero-022"] *{box-sizing:border-box}
[data-vibeui-block="hero-022"] [data-part="mesh"]{position:absolute;inset:-30% -20%;pointer-events:none;background:radial-gradient(40% 50% at 20% 30%,color-mix(in oklab,var(--vibeui-hero-022-accent) 26%,transparent),transparent 70%),radial-gradient(35% 45% at 80% 20%,color-mix(in oklab,var(--vibeui-hero-022-marker) 70%,transparent),transparent 70%),radial-gradient(45% 55% at 65% 85%,color-mix(in oklab,var(--vibeui-hero-022-accent) 16%,transparent),transparent 70%);filter:blur(40px);animation:vibeui-hero-022-mesh 24s ease-in-out infinite alternate}
@keyframes vibeui-hero-022-mesh{from{transform:translate(0,0) rotate(0)}to{transform:translate(4%,-3%) rotate(6deg)}}
[data-vibeui-block="hero-022"] [data-part="shell"]{position:relative;max-width:76rem;margin:0 auto;padding:3.5rem 1.25rem 3rem;display:grid;gap:2rem}
[data-vibeui-block="hero-022"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.5rem;margin:0;padding:.35rem .8rem .35rem .5rem;border-radius:999px;border:1px solid var(--vibeui-hero-022-line);background:color-mix(in oklab,var(--vibeui-hero-022-card) 80%,transparent);backdrop-filter:blur(8px);font-size:.78rem;font-weight:600;justify-self:start;animation:vibeui-hero-022-fade .7s .05s both}
[data-vibeui-block="hero-022"] [data-part="eyebrow"]::before{content:"";width:.5rem;height:.5rem;border-radius:50%;background:#22c55e;box-shadow:0 0 0 3px rgb(34 197 94 / .2);animation:vibeui-hero-022-pulse 2s infinite}
@keyframes vibeui-hero-022-pulse{50%{box-shadow:0 0 0 6px rgb(34 197 94 / .08)}}
[data-vibeui-block="hero-022"] [data-part="title"]{margin:0;font-family:var(--vibeui-hero-022-display);font-weight:700;font-size:clamp(2rem,6.4cqi,5.4rem);line-height:1;letter-spacing:-.03em;text-wrap:balance;max-width:18ch}
[data-vibeui-block="hero-022"] [data-part="word"]{display:inline-block;opacity:0;filter:blur(12px);transform:translateY(.3em);animation:vibeui-hero-022-word .7s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:calc(.15s + var(--vibeui-hero-022-i) * 70ms)}
@keyframes vibeui-hero-022-word{to{opacity:1;filter:blur(0);transform:none}}
[data-vibeui-block="hero-022"] [data-part="mark"]{background:linear-gradient(var(--vibeui-hero-022-marker),var(--vibeui-hero-022-marker)) no-repeat left 88% / 0% .4em;padding:0 .08em;box-decoration-break:clone;-webkit-box-decoration-break:clone;animation:vibeui-hero-022-draw .7s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:calc(.6s + var(--vibeui-hero-022-i) * 70ms)}
@keyframes vibeui-hero-022-draw{to{background-size:100% .4em}}
@keyframes vibeui-hero-022-fade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
[data-vibeui-block="hero-022"] [data-part="row"]{display:grid;gap:1.25rem;align-items:end;animation:vibeui-hero-022-fade .8s .5s both}
[data-vibeui-block="hero-022"] [data-part="lede"]{margin:0;max-width:34rem;font-size:1.05rem;color:var(--vibeui-hero-022-muted)}
[data-vibeui-block="hero-022"] [data-part="actions"]{display:flex;flex-wrap:wrap;align-items:center;gap:.75rem 1.25rem}
[data-vibeui-block="hero-022"] [data-part="primary"]{position:relative;display:inline-flex;align-items:center;height:3.25rem;padding:0 1.6rem;border-radius:999px;background:var(--vibeui-hero-022-accent);color:var(--vibeui-hero-022-on-accent);font-weight:600;text-decoration:none;overflow:hidden;transition:transform .2s,box-shadow .3s}
[data-vibeui-block="hero-022"] [data-part="primary"]::after{content:"";position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,rgb(255 255 255 / .35) 50%,transparent 70%);transform:translateX(-120%);transition:transform .6s}
[data-vibeui-block="hero-022"] [data-part="primary"]:hover{transform:translateY(-2px);box-shadow:0 16px 32px -14px var(--vibeui-hero-022-accent)}
[data-vibeui-block="hero-022"] [data-part="primary"]:hover::after{transform:translateX(120%)}
[data-vibeui-block="hero-022"] [data-part="secondary"]{display:inline-flex;align-items:center;gap:.5rem;color:inherit;font-weight:600;text-decoration:none}
[data-vibeui-block="hero-022"] [data-part="secondary"]::before{content:"";width:2.25rem;height:2.25rem;border-radius:50%;border:1px solid var(--vibeui-hero-022-line);background:var(--vibeui-hero-022-card) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M9 6.5v11l9-5.5z' fill='%234f46e5'/%3E%3C/svg%3E") center/1.1rem no-repeat}
[data-vibeui-block="hero-022"] a:focus-visible{outline:2px solid var(--vibeui-hero-022-accent);outline-offset:3px}
[data-vibeui-block="hero-022"] [data-part="bento"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.9rem;margin:0;padding:0;list-style:none;perspective:1200px;animation:vibeui-hero-022-fade .9s .7s both}
[data-vibeui-block="hero-022"] [data-part="tile"]{position:relative;overflow:hidden;border-radius:1.25rem;border:1px solid var(--vibeui-hero-022-line);background:var(--vibeui-hero-022-card);min-height:9rem;transform:rotateX(var(--vibeui-hero-022-rx,0)) rotateY(var(--vibeui-hero-022-ry,0));transform-style:preserve-3d;transition:transform .4s cubic-bezier(.2,.8,.2,1),box-shadow .4s;box-shadow:0 20px 40px -30px rgb(17 24 39 / .35)}
[data-vibeui-block="hero-022"] [data-part="tile"]:hover{box-shadow:0 30px 60px -30px rgb(17 24 39 / .45)}
[data-vibeui-block="hero-022"] [data-part="tile"]::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(18rem 18rem at var(--vibeui-hero-022-mx,50%) var(--vibeui-hero-022-my,50%),rgb(255 255 255 / .35),transparent 60%);opacity:0;transition:opacity .3s}
[data-vibeui-block="hero-022"] [data-part="tile"]:hover::after{opacity:1}
[data-vibeui-block="hero-022"] [data-part="tile"][data-kind="video"]{grid-column:span 2;aspect-ratio:16/9;cursor:pointer}
[data-vibeui-block="hero-022"] [data-part="tile"][data-kind="video"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1.2s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="hero-022"] [data-part="tile"][data-kind="video"]:hover img{transform:scale(1.04)}
[data-vibeui-block="hero-022"] [data-part="play"]{position:absolute;left:50%;top:50%;width:4.5rem;height:4.5rem;margin:-2.25rem 0 0 -2.25rem;border-radius:50%;background:rgb(255 255 255 / .92);backdrop-filter:blur(6px);box-shadow:0 12px 30px -10px rgb(0 0 0 / .5);display:grid;place-items:center;transition:transform .3s}
[data-vibeui-block="hero-022"] [data-part="play"]::after{content:"";margin-left:.3rem;border-style:solid;border-width:.65rem 0 .65rem 1.1rem;border-color:transparent transparent transparent var(--vibeui-hero-022-accent)}
[data-vibeui-block="hero-022"] [data-part="tile"][data-kind="video"]:hover [data-part="play"]{transform:scale(1.1)}
[data-vibeui-block="hero-022"] [data-part="chip"]{position:absolute;left:1rem;bottom:1rem;display:inline-flex;align-items:center;gap:.5rem;padding:.4rem .7rem;border-radius:.5rem;background:rgb(17 24 39 / .75);color:#fff;font-size:.75rem;font-weight:600;backdrop-filter:blur(6px)}
[data-vibeui-block="hero-022"] [data-part="duration"]{position:absolute;right:1rem;bottom:1rem;padding:.3rem .55rem;border-radius:.4rem;background:rgb(17 24 39 / .75);color:#fff;font-size:.72rem;font-variant-numeric:tabular-nums}
[data-vibeui-block="hero-022"] [data-part="tile"][data-kind="big"]{display:flex;flex-direction:column;justify-content:flex-end;padding:1.25rem;background:var(--vibeui-hero-022-fg);color:var(--vibeui-hero-022-bg)}
[data-vibeui-block="hero-022"] [data-part="big"]{font-family:var(--vibeui-hero-022-display);font-size:clamp(3rem,9cqi,5.5rem);font-weight:700;line-height:.9;letter-spacing:-.04em}
[data-vibeui-block="hero-022"] [data-part="big-label"]{margin-top:.5rem;font-size:.8rem;opacity:.7}
[data-vibeui-block="hero-022"] [data-part="tile"][data-kind="seats"]{display:flex;flex-direction:column;justify-content:space-between;gap:.75rem;padding:1.25rem}
[data-vibeui-block="hero-022"] [data-part="seats-value"]{font-family:var(--vibeui-hero-022-display);font-size:1.6rem;font-weight:700;line-height:1}
[data-vibeui-block="hero-022"] [data-part="seats-value"] small{display:block;font-family:var(--vibeui-hero-022-font);font-size:.78rem;font-weight:500;color:var(--vibeui-hero-022-muted);margin-top:.25rem}
[data-vibeui-block="hero-022"] [data-part="bars"]{display:grid;grid-template-columns:repeat(12,1fr);gap:.2rem}
[data-vibeui-block="hero-022"] [data-part="bars"] i{display:block;height:1.6rem;border-radius:.2rem;background:var(--vibeui-hero-022-line);transform-origin:bottom;animation:vibeui-hero-022-bar .5s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(1s + var(--vibeui-hero-022-i) * 40ms)}
[data-vibeui-block="hero-022"] [data-part="bars"] i[data-on="true"]{background:var(--vibeui-hero-022-accent)}
@keyframes vibeui-hero-022-bar{from{transform:scaleY(.2);opacity:0}to{transform:none;opacity:1}}
[data-vibeui-block="hero-022"] [data-part="tile"][data-kind="date"]{display:flex;flex-direction:column;justify-content:flex-end;padding:1.25rem;background:var(--vibeui-hero-022-marker);color:#1a2e05;border-color:transparent}
[data-vibeui-block="hero-022"] [data-part="date"]{font-family:var(--vibeui-hero-022-display);font-size:clamp(1.8rem,4.5cqi,2.6rem);font-weight:700;line-height:1;letter-spacing:-.03em}
[data-vibeui-block="hero-022"] [data-part="date-label"]{margin-top:.4rem;font-size:.8rem;font-weight:600;opacity:.75}
[data-vibeui-block="hero-022"] [data-part="facts"]{display:flex;flex-wrap:wrap;gap:1.25rem 2.5rem;margin:0;padding:1.75rem 0 0;list-style:none;border-top:1px solid var(--vibeui-hero-022-line);animation:vibeui-hero-022-fade .8s .9s both}
[data-vibeui-block="hero-022"] [data-part="fact"] b{display:block;font-family:var(--vibeui-hero-022-display);font-size:1.6rem;font-weight:700;line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
[data-vibeui-block="hero-022"] [data-part="fact"] span{display:block;margin-top:.3rem;font-size:.8rem;color:var(--vibeui-hero-022-muted)}
[data-vibeui-block="hero-022"] [data-part="logos"]{display:flex;flex-wrap:wrap;align-items:center;gap:.75rem 1.75rem;margin-left:auto}
[data-vibeui-block="hero-022"] [data-part="logos-label"]{font-size:.75rem;color:var(--vibeui-hero-022-muted)}
[data-vibeui-block="hero-022"] [data-part="logo"]{font-family:var(--vibeui-hero-022-display);font-size:.95rem;font-weight:600;letter-spacing:-.01em;opacity:.5;transition:opacity .2s}
[data-vibeui-block="hero-022"] [data-part="logo"]:hover{opacity:1}
@container (min-width: 60rem){
[data-vibeui-block="hero-022"] [data-part="shell"]{padding:4.5rem 2rem 3.5rem;gap:2.5rem}
[data-vibeui-block="hero-022"] [data-part="row"]{grid-template-columns:minmax(0,1fr) auto;gap:3rem}
[data-vibeui-block="hero-022"] [data-part="bento"]{grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:repeat(2,minmax(9rem,1fr))}
[data-vibeui-block="hero-022"] [data-part="tile"][data-kind="video"]{grid-column:span 2;grid-row:span 2;aspect-ratio:auto}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-022"] *{animation:none!important;transition:none!important}[data-vibeui-block="hero-022"] [data-part="word"]{opacity:1;filter:none;transform:none}[data-vibeui-block="hero-022"] [data-part="mark"]{background-size:100% .4em}}`

function words(title: string) {
  let index = 0
  return title.split(/(\*[^*]+\*)/).flatMap((part) => {
    const marked = part.startsWith("*") && part.endsWith("*")
    const text = marked ? part.slice(1, -1) : part
    return text.split(/(\s+)/).map((token) => {
      if (/^\s+$/.test(token)) return token
      if (!token) return null
      const i = index++
      return (
        <span key={`${i}-${token}`} data-part="word" style={{ ["--vibeui-hero-022-i" as string]: i }}>
          {marked ? (
            <span data-part="mark" style={{ ["--vibeui-hero-022-i" as string]: i }}>
              {token}
            </span>
          ) : (
            token
          )}
        </span>
      )
    })
  })
}

/** Число из строки факта: «94 %» → 94, суффикс « %». */
function parseFact(value: string): { number: number; prefix: string; suffix: string } | null {
  const match = value.match(/^([^\d]*)(\d[\d\s]*)(.*)$/)
  if (!match) return null
  return { number: Number(match[2].replace(/\s/g, "")), prefix: match[1], suffix: match[3] }
}

function Fact({ fact, active }: { fact: Hero022Fact; active: boolean }) {
  const parsed = parseFact(fact.value)
  const target = parsed ? parsed.number : 0
  const [shown, setShown] = useState(0)
  useEffect(() => {
    if (!active || target === 0) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const done = () => setShown(target)
      done()
      return
    }
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1100)
      setShown(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = window.requestAnimationFrame(tick)
    }
    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [active, target])
  const text = parsed ? `${parsed.prefix}${new Intl.NumberFormat("ru-RU").format(active ? shown : 0)}${parsed.suffix}` : fact.value
  return (
    <li data-part="fact">
      <b>{text}</b>
      <span>{fact.label}</span>
    </li>
  )
}

/** Бенто-хиро курса: заголовок по словам, плитки с превью, цифрой, местами и датой, счётчики фактов. */
export function Hero022({
  eyebrow = "Онлайн-курс · старт 6 октября",
  title = "Figma для продуктовых дизайнеров: от макета до *живого прототипа*",
  lede = "Шесть недель практики на реальных задачах: соберёте три интерфейса, защитите проект перед арт-директором и выйдете с портфолио, которое смотрят.",
  primaryLabel = "Записаться на поток",
  primaryHref = "#pricing",
  secondaryLabel = "Смотреть первый урок",
  secondaryHref = "#",
  poster = "",
  posterAlt = "",
  duration = "4:32",
  bigValue = "6",
  bigLabel = "недель практики",
  seatsTaken = 48,
  seatsTotal = 60,
  seatsLabel = "мест занято",
  dateValue = "6 окт",
  dateLabel = "старт потока",
  facts = [
    { value: "18", label: "уроков по 40 минут" },
    { value: "3", label: "проекта в портфолио" },
    { value: "3 000", label: "выпускников" },
    { value: "94 %", label: "доходят до защиты" },
  ],
  logosLabel = "Выпускники работают в",
  logos = ["Ozon", "Тинькофф", "Яндекс", "Авито", "Самокат"],
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero022Props) {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(false)
  const palette = {
    ...(accent ? { "--vibeui-hero-022-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-022-fg": ink } : null),
    ...(background ? { "--vibeui-hero-022-bg": background } : null),
    ...style,
  } as CSSProperties

  useEffect(() => {
    const element = root.current
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // Наклон плитки за курсором и блик: пишем углы в переменные плитки.
  const tilt = (event: MouseEvent<HTMLLIElement>) => {
    const tile = event.currentTarget
    const rect = tile.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    tile.style.setProperty("--vibeui-hero-022-ry", `${(x - 0.5) * 8}deg`)
    tile.style.setProperty("--vibeui-hero-022-rx", `${(0.5 - y) * 8}deg`)
    tile.style.setProperty("--vibeui-hero-022-mx", `${x * 100}%`)
    tile.style.setProperty("--vibeui-hero-022-my", `${y * 100}%`)
  }
  const untilt = (event: MouseEvent<HTMLLIElement>) => {
    event.currentTarget.style.removeProperty("--vibeui-hero-022-ry")
    event.currentTarget.style.removeProperty("--vibeui-hero-022-rx")
  }

  const seats = Math.max(0, Math.min(12, Math.round((seatsTaken / Math.max(1, seatsTotal)) * 12)))

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-022" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="hero-022" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="mesh" aria-hidden="true" />
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h1 data-part="title">{words(title)}</h1>
          <div data-part="row">
            {lede ? <p data-part="lede">{lede}</p> : null}
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
          <ul data-part="bento">
            <li data-part="tile" data-kind="video" onMouseMove={tilt} onMouseLeave={untilt}>
              <a href={secondaryHref} aria-label={secondaryLabel || "Смотреть урок"} style={{ position: "absolute", inset: 0, zIndex: 1 }} />
              {poster ? <img src={poster} alt={posterAlt} /> : null}
              <span data-part="play" aria-hidden="true" />
              {secondaryLabel ? <span data-part="chip">{secondaryLabel}</span> : null}
              {duration ? <span data-part="duration">{duration}</span> : null}
            </li>
            <li data-part="tile" data-kind="big" onMouseMove={tilt} onMouseLeave={untilt}>
              <span data-part="big">{bigValue}</span>
              <span data-part="big-label">{bigLabel}</span>
            </li>
            <li data-part="tile" data-kind="seats" onMouseMove={tilt} onMouseLeave={untilt}>
              <span data-part="seats-value">
                {seatsTaken} / {seatsTotal}
                <small>{seatsLabel}</small>
              </span>
              <span data-part="bars" aria-hidden="true">
                {Array.from({ length: 12 }, (_, i) => (
                  <i key={i} data-on={i < seats} style={{ ["--vibeui-hero-022-i" as string]: i }} />
                ))}
              </span>
            </li>
            <li data-part="tile" data-kind="date" onMouseMove={tilt} onMouseLeave={untilt}>
              <span data-part="date">{dateValue}</span>
              <span data-part="date-label">{dateLabel}</span>
            </li>
          </ul>
          {facts.length > 0 || logos.length > 0 ? (
            <ul data-part="facts">
              {facts.map((fact) => (
                <Fact key={fact.label} fact={fact} active={active} />
              ))}
              {logos.length > 0 ? (
                <li data-part="logos">
                  {logosLabel ? <span data-part="logos-label">{logosLabel}</span> : null}
                  {logos.map((logo) => (
                    <span key={logo} data-part="logo">
                      {logo}
                    </span>
                  ))}
                </li>
              ) : null}
            </ul>
          ) : null}
        </div>
      </section>
    </>
  )
}

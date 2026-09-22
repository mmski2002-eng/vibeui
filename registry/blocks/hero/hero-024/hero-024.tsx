"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Hero024Fact = {
  value: string
  label: string
}

export type Hero024Props = {
  eyebrow?: string
  /** Вывеска: буквы зажигаются по одной. Перенос строки — \n. */
  title?: string
  /** Индекс буквы, которая «барахлит» и мерцает. -1 — без мерцания. */
  flicker?: number
  lede?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  /** Фото на фоне: мастер за работой. */
  image?: string
  imageAlt?: string
  facts?: readonly Hero024Fact[]
  /** Светящийся след за курсором. */
  trail?: boolean
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Первый экран тату-студии: заголовок как неоновая вывеска — буквы
// зажигаются по одной с искрой, одна трубка «барахлит» и мерцает. На фоне
// крупное фото мастера с зерном плёнки и фуксиевой подсветкой по краю. За
// курсором ходит мягкое свечение (позиция в CSS-переменных из pointermove,
// без ререндеров). Внизу счётчики лет и работ, набегают при появлении.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"

const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const STYLES = `
:where([data-vibeui-block="hero-024"]){
--vibeui-hero-024-bg:#07060b;
--vibeui-hero-024-fg:#f3eefc;
--vibeui-hero-024-muted:#a39bb5;
--vibeui-hero-024-line:rgb(255 255 255 / .12);
--vibeui-hero-024-accent:#ff2bd6;
--vibeui-hero-024-accent-2:#8b5cff;
--vibeui-hero-024-cyan:#22f3ff;
--vibeui-hero-024-on-accent:#15121c;
--vibeui-hero-024-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-024-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-024-mono:"JetBrains Mono",ui-monospace,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-024"]{color-scheme:dark}
:where([data-vibeui-block="hero-024"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-024"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-024"]{box-sizing:border-box;position:relative;display:block;overflow:hidden;isolation:isolate;background:var(--vibeui-hero-024-bg);color:var(--vibeui-hero-024-fg);font-family:var(--vibeui-hero-024-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-024"] *{box-sizing:border-box}
[data-vibeui-block="hero-024"] [data-part="photo"]{position:absolute;inset:0;z-index:-3;overflow:hidden}
[data-vibeui-block="hero-024"] [data-part="photo"] img{width:100%;height:100%;object-fit:cover;object-position:70% 30%;display:block;filter:saturate(.7) contrast(1.1);animation:vibeui-hero-024-zoom 30s ease-in-out infinite alternate}
@keyframes vibeui-hero-024-zoom{from{transform:scale(1.02)}to{transform:scale(1.12)}}
[data-vibeui-block="hero-024"] [data-part="photo"]::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,var(--vibeui-hero-024-bg) 0%,color-mix(in oklab,var(--vibeui-hero-024-bg) 85%,transparent) 40%,color-mix(in oklab,var(--vibeui-hero-024-bg) 25%,transparent) 100%),linear-gradient(0deg,var(--vibeui-hero-024-bg) 0%,transparent 40%)}
[data-vibeui-block="hero-024"] [data-part="photo"]::after{content:"";position:absolute;inset:0;background:radial-gradient(60rem 30rem at 100% 20%,color-mix(in oklab,var(--vibeui-hero-024-accent) 35%,transparent),transparent 60%),radial-gradient(40rem 30rem at 80% 100%,color-mix(in oklab,var(--vibeui-hero-024-accent-2) 40%,transparent),transparent 60%);mix-blend-mode:screen}
[data-vibeui-block="hero-024"] [data-part="grain"]{position:absolute;inset:-50%;z-index:-2;background-image:${GRAIN};opacity:.12;mix-blend-mode:overlay;pointer-events:none;animation:vibeui-hero-024-grain .5s steps(4) infinite}
@keyframes vibeui-hero-024-grain{0%{transform:translate(0,0)}25%{transform:translate(-3%,2%)}50%{transform:translate(2%,-3%)}75%{transform:translate(-1%,-1%)}100%{transform:translate(3%,1%)}}
[data-vibeui-block="hero-024"] [data-part="trail"]{position:absolute;inset:0;z-index:-1;pointer-events:none;background:radial-gradient(18rem circle at var(--vibeui-hero-024-mx,-100%) var(--vibeui-hero-024-my,-100%),color-mix(in oklab,var(--vibeui-hero-024-accent) 28%,transparent),transparent 60%);opacity:var(--vibeui-hero-024-mo,0);transition:opacity .6s}
[data-vibeui-block="hero-024"] [data-part="shell"]{position:relative;display:grid;align-content:end;min-height:min(92svh,56rem);max-width:80rem;margin:0 auto;padding:6rem 1.25rem 3rem}
[data-vibeui-block="hero-024"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 1.25rem;font-family:var(--vibeui-hero-024-mono);font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-hero-024-cyan);text-shadow:0 0 10px color-mix(in oklab,var(--vibeui-hero-024-cyan) 70%,transparent)}
[data-vibeui-block="hero-024"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-hero-024-cyan);box-shadow:0 0 8px var(--vibeui-hero-024-cyan)}
[data-vibeui-block="hero-024"] [data-part="title"]{margin:0;font-family:var(--vibeui-hero-024-display);font-weight:700;font-size:clamp(2.6rem,9.5cqi,7.5rem);line-height:1;letter-spacing:-.02em;text-transform:uppercase;white-space:pre-line}
[data-vibeui-block="hero-024"] [data-part="letter"]{display:inline-block;color:transparent;-webkit-text-stroke:1.5px color-mix(in oklab,var(--vibeui-hero-024-accent) 45%,transparent);animation:vibeui-hero-024-light .35s steps(2,end) forwards;animation-delay:calc(.3s + var(--vibeui-hero-024-i) * 70ms)}
@keyframes vibeui-hero-024-light{to{color:var(--vibeui-hero-024-fg);-webkit-text-stroke:0 transparent;text-shadow:0 0 6px var(--vibeui-hero-024-accent),0 0 20px var(--vibeui-hero-024-accent),0 0 50px color-mix(in oklab,var(--vibeui-hero-024-accent) 60%,transparent)}}
[data-vibeui-block="hero-024"] [data-part="letter"][data-flicker="true"]{animation:vibeui-hero-024-light .35s steps(2,end) forwards,vibeui-hero-024-buzz 4s 2s infinite;animation-delay:calc(.3s + var(--vibeui-hero-024-i) * 70ms),2s}
@keyframes vibeui-hero-024-buzz{0%,86%,100%{opacity:1}87%{opacity:.3}88%{opacity:1}90%{opacity:.5}91%{opacity:1}94%{opacity:.6}95%{opacity:1}}
[data-vibeui-block="hero-024"] [data-part="space"]{display:inline-block;width:.3em}
[data-vibeui-block="hero-024"] [data-part="lede"]{margin:1.5rem 0 0;max-width:34rem;font-size:1.15rem;color:var(--vibeui-hero-024-muted);animation:vibeui-hero-024-in .8s 1.2s both}
@keyframes vibeui-hero-024-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
[data-vibeui-block="hero-024"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:.75rem;margin:1.75rem 0 0;animation:vibeui-hero-024-in .8s 1.4s both}
[data-vibeui-block="hero-024"] [data-part="facts"]{display:flex;flex-wrap:wrap;gap:1.25rem 2.5rem;margin:3rem 0 0;padding:1.5rem 0 0;list-style:none;border-top:1px solid var(--vibeui-hero-024-line);animation:vibeui-hero-024-in .8s 1.6s both}
[data-vibeui-block="hero-024"] [data-part="fact"] b{display:block;font-family:var(--vibeui-hero-024-mono);font-size:2rem;font-weight:700;line-height:1;letter-spacing:-.02em;color:var(--vibeui-hero-024-cyan);text-shadow:0 0 12px color-mix(in oklab,var(--vibeui-hero-024-cyan) 60%,transparent);font-variant-numeric:tabular-nums}
[data-vibeui-block="hero-024"] [data-part="fact"] span{display:block;margin-top:.35rem;font-size:.85rem;color:var(--vibeui-hero-024-muted)}
@container (min-width: 60rem){
[data-vibeui-block="hero-024"] [data-part="shell"]{padding:7rem 2rem 3.5rem}
[data-vibeui-block="hero-024"] [data-part="photo"] img{object-position:80% 30%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-024"] *{animation:none!important;transition:none!important}[data-vibeui-block="hero-024"] [data-part="letter"]{color:var(--vibeui-hero-024-fg);-webkit-text-stroke:0 transparent;text-shadow:0 0 20px var(--vibeui-hero-024-accent)}}`

function Counter({ value, active }: { value: string; active: boolean }) {
  const number = Number((value.match(/\d[\d\s]*/)?.[0] ?? "").replace(/\s/g, ""))
  const [shown, setShown] = useState(0)
  useEffect(() => {
    if (!active || !Number.isFinite(number) || number === 0) return
    const start = performance.now()
    let frame = 0
    const step = (time: number) => {
      const t = Math.min(1, (time - start) / 1400)
      setShown(Math.round(number * (1 - Math.pow(1 - t, 3))))
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [active, number])
  if (!Number.isFinite(number) || number === 0 || !active) return <b>{value}</b>
  return <b>{value.replace(/\d[\d\s]*/, new Intl.NumberFormat("ru-RU").format(shown))}</b>
}

/** Первый экран тату-студии: неоновая вывеска, фото с зерном, свечение за курсором и счётчики. */
export function Hero024({
  eyebrow = "Тату-студия · с 2014",
  title = "Носи\nсвоё",
  flicker = 5,
  lede = "Реализм, олд-скул, графика и минимализм. Четыре мастера, стерильный кабинет, эскиз бесплатно. Первый сеанс — уже на этой неделе.",
  primaryLabel = "Записаться на консультацию",
  primaryHref = "#booking",
  secondaryLabel = "Смотреть работы",
  secondaryHref = "#works",
  image = "/demo/tattoo/hero.webp",
  imageAlt = "",
  facts = [
    { value: "11", label: "лет студии" },
    { value: "4 800+", label: "работ" },
    { value: "4", label: "мастера" },
    { value: "100 %", label: "одноразовые иглы" },
  ],
  trail = true,
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Hero024Props) {
  const root = useRef<HTMLElement>(null)
  const [seen, setSeen] = useState(false)
  const palette = {
    ...(accent ? { "--vibeui-hero-024-accent": accent } : null),
    ...(background ? { "--vibeui-hero-024-bg": background } : null),
    ...style,
  } as CSSProperties

  useEffect(() => {
    const node = root.current
    if (!node || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setSeen(true)
        })
      },
      { threshold: 0.3 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const move = (event: PointerEvent<HTMLElement>) => {
    if (!trail || event.pointerType !== "mouse") return
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty("--vibeui-hero-024-mx", `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty("--vibeui-hero-024-my", `${event.clientY - rect.top}px`)
    event.currentTarget.style.setProperty("--vibeui-hero-024-mo", "1")
  }
  const leave = (event: PointerEvent<HTMLElement>) => event.currentTarget.style.setProperty("--vibeui-hero-024-mo", "0")

  let index = 0
  const letters = Array.from(title).map((char, position) => {
    if (char === "\n") return <br key={position} />
    if (char === " ") return <span key={position} data-part="space" />
    const current = index++
    return (
      <span key={position} data-part="letter" data-flicker={current === flicker ? "true" : undefined} style={{ ["--vibeui-hero-024-i" as string]: current }}>
        {char}
      </span>
    )
  })

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-024" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="hero-024" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette} onPointerMove={move} onPointerLeave={leave}>
        <div data-part="photo" aria-hidden={imageAlt ? undefined : "true"}>
          {image ? <img src={image} alt={imageAlt} /> : null}
        </div>
        <div data-part="grain" aria-hidden="true" />
        {trail ? <div data-part="trail" aria-hidden="true" /> : null}
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h1 data-part="title" aria-label={title.replace(/\n/g, " ")}>
            <span aria-hidden="true">{letters}</span>
          </h1>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="actions">
            {primaryLabel ? (
              <Button016
                data-part="primary"
                size="lg"
                label={primaryLabel}
                href={primaryHref}
                external={false}
                tone="accent"
                accent={accent}
              />
            ) : null}
            {secondaryLabel ? (
              <Button016
                data-part="secondary"
                size="lg"
                label={secondaryLabel}
                href={secondaryHref}
                external={false}
                tone="neutral"
                accent={accent}
              />
            ) : null}
          </div>
          {facts.length > 0 ? (
            <ul data-part="facts">
              {facts.map((fact) => (
                <li key={fact.label} data-part="fact">
                  <Counter value={fact.value} active={seen} />
                  <span>{fact.label}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    </>
  )
}

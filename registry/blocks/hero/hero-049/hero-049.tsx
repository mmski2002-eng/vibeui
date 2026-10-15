"use client"

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"

export type Hero049Slide = {
  image: string
  code: string
  area: string
  /** Короткая строка характеристик: этажи, спальни. */
  specs?: string
  price: number
  priceNote?: string
  href?: string
}

export type Hero049Props = {
  title?: string
  subtitle?: string
  slides?: readonly Hero049Slide[]
  currency?: string
  /** Локаль форматирования цены: "ru-RU" — 21 780 000, "en-US" — 21,780,000. */
  locale?: string
  ctaLabel?: string
  asideLabel?: string
  asideHref?: string
  /** Секунд на слайд; 0 — без автопрокрутки. */
  interval?: number
  prevLabel?: string
  nextLabel?: string
  slidesLabel?: string
  imageAlt?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Хиро-слайдер проектов: фото дома медленно наплывает (ken burns) и
// сменяется кроссфейдом, заголовок стоит, а стеклянная карточка внизу
// переключается вместе со слайдом — цена докручивается до новой. Полоска
// таймера в карточке показывает, когда будет следующий проект; наведение и
// фокус ставят автопрокрутку на паузу.
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"

const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E\")"

const S = '[data-vibeui-block="hero-049"]'
const STYLES = `
:where(${S}){
--vibeui-hero-049-bg:light-dark(#e9e5de,#0e0f10);
--vibeui-hero-049-fg:#f2efe9;
--vibeui-hero-049-accent:#e8a35c;
--vibeui-hero-049-on-accent:oklch(from var(--vibeui-hero-049-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-049-muted:color-mix(in oklab,var(--vibeui-hero-049-fg) 66%,transparent);
--vibeui-hero-049-glass:rgb(16 18 20 / .52);
--vibeui-hero-049-line:color-mix(in oklab,var(--vibeui-hero-049-fg) 16%,transparent);
--vibeui-hero-049-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-049-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) ${S}{color-scheme:dark}
:where(${S}[data-tone="light"]){color-scheme:light}
:where(${S}[data-tone="dark"]){color-scheme:dark}
${S}{position:relative;isolation:isolate;overflow:hidden;min-height:min(100svh,62rem);display:flex;flex-direction:column;background:var(--vibeui-hero-049-bg);color:var(--vibeui-hero-049-fg);font-family:var(--vibeui-hero-049-font)}
${S} *{box-sizing:border-box}
${S} [data-part="media"]{position:absolute;inset:0;z-index:-2;margin:0}
${S} [data-part="media"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transform:scale(1.14);transition:opacity 1.6s cubic-bezier(.4,0,.2,1),transform 1.6s cubic-bezier(.4,0,.2,1)}
${S} [data-part="media"] img[data-active="true"]{opacity:1;transform:scale(1.02);transition:opacity 1.6s cubic-bezier(.4,0,.2,1),transform 9s cubic-bezier(.2,.6,.3,1)}
${S} [data-part="media"]::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgb(8 9 10 / .55) 0%,rgb(8 9 10 / 0) 28%,rgb(8 9 10 / 0) 52%,rgb(8 9 10 / .78) 100%),radial-gradient(120% 70% at 0% 100%,rgb(8 9 10 / .6),transparent 60%)}
${S} [data-part="grain"]{position:absolute;inset:0;z-index:-1;background-image:${GRAIN};mix-blend-mode:overlay;opacity:.22;pointer-events:none}
${S} [data-part="shell"]{position:relative;flex:1;display:flex;flex-direction:column;width:100%;max-width:90rem;margin:0 auto;padding:clamp(7rem,14cqi,10rem) clamp(1rem,3cqi,2.5rem) clamp(1rem,3cqi,2.5rem)}
${S} [data-part="title"]{margin:0;max-width:16ch;font-weight:200;font-size:clamp(2.6rem,7cqi,6.4rem);line-height:.98;letter-spacing:-.05em;text-shadow:0 2px 40px rgb(0 0 0 / .35)}
${S} [data-part="title"] span{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em}
${S} [data-part="title"] span i{display:inline-block;font-style:normal;transform:translateY(105%);animation:vibeui-hero-049-rise 1.2s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:calc(var(--vibeui-hero-049-i) * 90ms + 150ms)}
${S} [data-part="subtitle"]{margin:1.1rem 0 0;font-size:clamp(1rem,1.6cqi,1.3rem);font-weight:400;color:var(--vibeui-hero-049-muted);text-shadow:0 1px 20px rgb(0 0 0 / .6);opacity:0;animation:vibeui-hero-049-fade 1s .7s forwards}
${S} [data-part="foot"]{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:1.25rem;margin-top:auto;padding-top:3rem}
${S} [data-part="card"]{position:relative;width:min(100%,22rem);padding:1.15rem;border:1px solid var(--vibeui-hero-049-line);border-radius:1.4rem;background:var(--vibeui-hero-049-glass);backdrop-filter:blur(22px) saturate(1.3);-webkit-backdrop-filter:blur(22px) saturate(1.3);box-shadow:0 30px 60px -30px rgb(0 0 0 / .7);opacity:0;animation:vibeui-hero-049-fade 1s .9s forwards}
${S} [data-part="card-top"]{display:flex;justify-content:space-between;align-items:baseline;gap:1rem}
${S} [data-part="code"]{font-size:1.6rem;font-weight:500;letter-spacing:-.02em}
${S} [data-part="area"]{font-family:var(--vibeui-hero-049-mono);font-size:.72rem;color:var(--vibeui-hero-049-muted)}
${S} [data-part="specs"]{margin:.2rem 0 0;font-size:.78rem;color:var(--vibeui-hero-049-muted)}
${S} [data-part="price"]{margin:.9rem 0 0;font-family:var(--vibeui-hero-049-mono);font-size:1.35rem;font-weight:500;font-variant-numeric:tabular-nums;letter-spacing:-.02em}
${S} [data-part="price"] small{display:block;margin-top:.15rem;font-family:var(--vibeui-hero-049-font);font-size:.7rem;font-weight:400;letter-spacing:0;color:var(--vibeui-hero-049-muted)}
${S} [data-part="card"] [data-swap]{animation:vibeui-hero-049-swap .7s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="open"]{display:flex;align-items:center;justify-content:space-between;gap:.6rem;width:100%;height:2.7rem;margin-top:1rem;padding:0 .35rem 0 1.1rem;border-radius:999px;background:var(--vibeui-hero-049-fg);color:#111;font-weight:600;font-size:.85rem;text-decoration:none;transition:background-color .35s}
${S} [data-part="open"] i{display:grid;place-items:center;width:2rem;height:2rem;border-radius:50%;background:#111;color:var(--vibeui-hero-049-fg);transition:transform .45s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="open"]:hover i{transform:rotate(45deg)}
${S} [data-part="open"] svg,${S} [data-part="nav"] svg,${S} [data-part="aside"] svg{width:.95rem;height:.95rem}
${S} [data-part="nav"]{display:flex;align-items:center;gap:.75rem;margin-top:.9rem}
${S} [data-part="nav"] button{display:grid;place-items:center;flex:none;width:2.4rem;height:2.4rem;padding:0;border:1px solid var(--vibeui-hero-049-line);border-radius:50%;background:transparent;color:inherit;cursor:pointer;transition:background-color .3s,border-color .3s}
${S} [data-part="nav"] button:hover{background:var(--vibeui-hero-049-line);border-color:transparent}
${S} [data-part="count"]{flex:1;display:grid;gap:.35rem;text-align:center;font-family:var(--vibeui-hero-049-mono);font-size:.7rem;color:var(--vibeui-hero-049-muted)}
${S} [data-part="count"] b{font-weight:500;color:var(--vibeui-hero-049-fg)}
${S} [data-part="timer"]{display:block;height:1px;background:var(--vibeui-hero-049-line);overflow:hidden}
${S} [data-part="timer"] i{display:block;height:100%;background:var(--vibeui-hero-049-accent);transform-origin:left;animation:vibeui-hero-049-timer var(--vibeui-hero-049-t) linear forwards}
${S}[data-paused="true"] [data-part="timer"] i{animation-play-state:paused}
${S} [data-part="aside"]{display:flex;align-items:center;gap:.8rem;max-width:13rem;color:inherit;text-decoration:none;font-size:.78rem;line-height:1.3;color:var(--vibeui-hero-049-muted);opacity:0;animation:vibeui-hero-049-fade 1s 1.1s forwards}
${S} [data-part="aside"] i{display:grid;place-items:center;flex:none;width:2.8rem;height:2.8rem;border:1px solid var(--vibeui-hero-049-line);border-radius:50%;color:var(--vibeui-hero-049-fg);transition:background-color .3s,transform .5s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="aside"]:hover{color:var(--vibeui-hero-049-fg)}
${S} [data-part="aside"]:hover i{background:var(--vibeui-hero-049-accent);color:var(--vibeui-hero-049-on-accent);border-color:transparent;transform:translateY(3px)}
${S} a:focus-visible,${S} button:focus-visible{outline:2px solid var(--vibeui-hero-049-accent);outline-offset:3px}
@keyframes vibeui-hero-049-rise{to{transform:none}}
@keyframes vibeui-hero-049-fade{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes vibeui-hero-049-swap{from{opacity:0;transform:translateY(8px);filter:blur(4px)}to{opacity:1;transform:none;filter:none}}
@keyframes vibeui-hero-049-timer{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@media (prefers-reduced-motion:reduce){${S} *{animation:none!important;transition:none!important}${S} [data-part="title"] span i{transform:none}${S} [data-part="subtitle"],${S} [data-part="card"],${S} [data-part="aside"]{opacity:1}}
${S} [data-part="open"]{position:relative;isolation:isolate;overflow:hidden;transition:color .55s cubic-bezier(.2,.8,.2,1),transform .3s cubic-bezier(.2,.8,.2,1),box-shadow .5s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="open"]::before{content:"";position:absolute;z-index:-1;right:.45rem;top:50%;width:2rem;height:2rem;border-radius:50%;background:var(--vibeui-hero-049-accent);transform:translateY(-50%) scale(0);transition:transform .75s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="open"]:hover::before{transform:translateY(-50%) scale(28)}
${S} [data-part="open"]:hover{color:#111;box-shadow:0 14px 34px -14px color-mix(in oklab,var(--vibeui-hero-049-accent) 70%,transparent)}
${S} [data-part="open"]:active{transform:scale(.965);transition-duration:.12s}
${S} [data-part="open"] i{overflow:hidden}
${S} [data-part="open"]:hover i{transform:none}
${S} [data-part="open"]:hover i svg{animation:vibeui-hero-049-fly .65s cubic-bezier(.6,0,.2,1)}
${S} [data-part="nav"] button{transition:background-color .35s,color .35s,border-color .35s,transform .3s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="nav"] button svg{transition:transform .45s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="nav"] button:active{transform:scale(.9);transition-duration:.12s}
${S} [data-part="nav"] button:hover svg[data-dir="next"]{transform:translateX(3px)}
${S} [data-part="nav"] button:hover svg[data-dir="prev"]{transform:translateX(-3px)}
${S} [data-part="nav"] button:hover svg[data-dir="up"]{transform:translateY(-3px)}
${S} [data-part="nav"] button:hover svg[data-dir="down"]{transform:translateY(3px)}
${S} [data-part="aside"] i{transition:background-color .35s,color .35s,border-color .35s,transform .3s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="aside"] i svg{transition:transform .45s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="aside"] i:active{transform:scale(.9);transition-duration:.12s}
${S} [data-part="aside"] i:hover svg[data-dir="next"]{transform:translateX(3px)}
${S} [data-part="aside"] i:hover svg[data-dir="prev"]{transform:translateX(-3px)}
${S} [data-part="aside"] i:hover svg[data-dir="up"]{transform:translateY(-3px)}
${S} [data-part="aside"] i:hover svg[data-dir="down"]{transform:translateY(3px)}
@keyframes vibeui-hero-049-fly{0%{transform:none}45%{transform:translate(140%,-140%)}46%{transform:translate(-140%,140%)}100%{transform:none}}
@keyframes vibeui-hero-049-pop{0%{transform:scale(.94)}60%{transform:scale(1.04)}100%{transform:none}}
@media (prefers-reduced-motion:reduce){${S} *,${S} *::before{animation:none!important;transition:none!important}}`

const DEFAULT_SLIDES: Hero049Slide[] = [
  { image: "/demo/house/hero-01.webp", code: "КБ-242", area: "242 м²", specs: "2 этажа · 4 спальни · второй свет", price: 21780000, priceNote: "под ключ, с инженерией", href: "#projects" },
  { image: "/demo/house/hero-02.webp", code: "КБ-160", area: "160 м²", specs: "1 этаж · 3 спальни · терраса 48 м²", price: 12389979, priceNote: "под ключ, с инженерией", href: "#projects" },
  { image: "/demo/house/hero-03.webp", code: "БХ-138", area: "138 м²", specs: "1 этаж · 3 спальни · барнхаус", price: 10940000, priceNote: "под ключ, с инженерией", href: "#projects" },
  { image: "/demo/house/hero-04.webp", code: "КБ-198", area: "198 м²", specs: "2 этажа · 4 спальни · баня", price: 17460000, priceNote: "под ключ, с инженерией", href: "#projects" },
]

/** Слайдер проектов на весь экран со стеклянной карточкой проекта. */
export function Hero049({
  title = "Строительство домов",
  subtitle = "из клеёного бруса — от проекта до ключей за 6 месяцев",
  slides = DEFAULT_SLIDES,
  currency = "₽",
  locale = "ru-RU",
  ctaLabel = "Смотреть проект",
  asideLabel = "Подобрать проект по площади и бюджету",
  asideHref = "#projects",
  interval = 7,
  prevLabel = "Предыдущий проект",
  nextLabel = "Следующий проект",
  slidesLabel = "Проекты",
  imageAlt = "Дом {code} из клеёного бруса",
  tone = "dark",
  accent,
  ink,
  background,
  className,
  style,
}: Hero049Props) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [price, setPrice] = useState(slides[0]?.price ?? 0)
  const priceRef = useRef(price)
  const slide = slides[index % slides.length]

  const go = useCallback((step: number) => setIndex((value) => (value + step + slides.length) % slides.length), [slides.length])

  useEffect(() => {
    const from = priceRef.current
    const to = slide.price
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 900
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = duration ? Math.min(1, (now - start) / duration) : 1
      const value = from + (to - from) * (1 - Math.pow(1 - t, 4))
      priceRef.current = value
      setPrice(value)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [slide.price])

  const onTimerEnd = () => {
    if (!paused) go(1)
  }

  const palette = {
    ...(accent ? { "--vibeui-hero-049-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-049-fg": ink } : null),
    ...(background ? { "--vibeui-hero-049-bg": background } : null),
    "--vibeui-hero-049-t": `${interval}s`,
    ...style,
  } as CSSProperties

  const words = title.split(" ")

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-049" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="hero-049"
        data-tone={tone === "auto" ? undefined : tone}
        data-paused={paused}
        className={className}
        style={palette}
        aria-roledescription="carousel"
        aria-label={slidesLabel}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") go(-1)
          if (event.key === "ArrowRight") go(1)
        }}
        onTouchStart={(event) => {
          const startX = event.touches[0].clientX
          const end = (endEvent: TouchEvent) => {
            const delta = endEvent.changedTouches[0].clientX - startX
            if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1)
          }
          window.addEventListener("touchend", end, { once: true })
        }}
      >
        <figure data-part="media">
          {slides.map((item, itemIndex) => (
            <img key={item.image} src={item.image} alt={itemIndex === index ? imageAlt.replace("{code}", item.code) : ""} data-active={itemIndex === index} fetchPriority={itemIndex === 0 ? "high" : "low"} draggable={false} />
          ))}
        </figure>
        <span data-part="grain" aria-hidden="true" />
        <div data-part="shell">
          <h1 data-part="title">
            {words.map((word, wordIndex) => (
              <span key={wordIndex}>
                <i style={{ ["--vibeui-hero-049-i" as string]: wordIndex }}>{word}</i>
                {wordIndex < words.length - 1 ? " " : null}
              </span>
            ))}
          </h1>
          {subtitle ? <p data-part="subtitle">{subtitle}</p> : null}
          <div data-part="foot">
            <div data-part="card" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
              <div key={slide.code} data-swap="">
                <div data-part="card-top">
                  <span data-part="code">{slide.code}</span>
                  <span data-part="area">{slide.area}</span>
                </div>
                {slide.specs ? <p data-part="specs">{slide.specs}</p> : null}
              </div>
              <p data-part="price" aria-live="polite">
                {locale.startsWith("en") ? `${currency}${Math.round(price).toLocaleString(locale)}` : `${Math.round(price).toLocaleString(locale)} ${currency}`}
                {slide.priceNote ? <small>{slide.priceNote}</small> : null}
              </p>
              <a data-part="open" href={slide.href ?? "#"}>
                {ctaLabel}
                <i aria-hidden="true">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M5 11 11 5M6 5h5v5" />
                  </svg>
                </i>
              </a>
              <div data-part="nav">
                <button type="button" aria-label={prevLabel} onClick={() => go(-1)}>
                  <svg data-dir="prev" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M13 8H3M7 4 3 8l4 4" />
                  </svg>
                </button>
                <span data-part="count">
                  <span>
                    <b>{String(index + 1).padStart(2, "0")}</b> / {String(slides.length).padStart(2, "0")}
                  </span>
                  <span data-part="timer" aria-hidden="true">
                    {interval > 0 ? <i key={index} onAnimationEnd={onTimerEnd} /> : null}
                  </span>
                </span>
                <button type="button" aria-label={nextLabel} onClick={() => go(1)}>
                  <svg data-dir="next" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </button>
              </div>
            </div>
            {asideLabel ? (
              <a data-part="aside" href={asideHref}>
                <i aria-hidden="true">
                  <svg data-dir="down" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 3v10M4 9l4 4 4-4" />
                  </svg>
                </i>
                {asideLabel}
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}

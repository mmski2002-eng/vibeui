"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"

export type Hero032Props = {
  eyebrow?: string
  title?: string
  /** Слова заголовка, которые красятся градиентом (через пробел). */
  highlight?: string
  lede?: string
  appStoreLabel?: string
  appStoreHref?: string
  playLabel?: string
  playHref?: string
  rating?: string
  ratingNote?: string
  /** Экран телефона: заголовок практики и фазы дыхания. */
  screenTitle?: string
  inhaleLabel?: string
  holdLabel?: string
  exhaleLabel?: string
  /** Секунд на вдох, задержку и выдох. */
  inhale?: number
  hold?: number
  exhale?: number
  /** Подписи над названиями магазинов и aria телефона. */
  appStoreCaption?: string
  playCaption?: string
  phoneLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Первый экран мобильного приложения без единого скриншота: справа телефон,
// нарисованный CSS, наклоняется за курсором (rotateX/Y через переменные),
// отражается в «столе» и отбрасывает цветную тень; на экране круг дышит —
// расширяется на вдохе, замирает, сжимается на выдохе, вокруг него ореол
// колец и облако частиц, которые разлетаются вместе с кругом, а подпись фазы
// крупно сменяется в такт (фаза считается в setInterval, длительности —
// пропсами; смена фазы уходит наружу событием `vibeui-hero-032:phase`).
// Слева гигантский заголовок въезжает пословно через маски, пара слов —
// градиентом; бейджи магазинов магнитятся к курсору. Фон — плывущие пятна.
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-032"]){
--vibeui-hero-032-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-hero-032-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-032-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-032-on-accent:oklch(from var(--vibeui-hero-032-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-032-muted:color-mix(in oklab,var(--vibeui-hero-032-fg) 60%,var(--vibeui-hero-032-bg));
--vibeui-hero-032-line:color-mix(in oklab,var(--vibeui-hero-032-fg) 12%,transparent);
--vibeui-hero-032-screen:#151428;
--vibeui-hero-032-screen-fg:#f4f2fb;
--vibeui-hero-032-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-032-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-hero-032-rx:0;
--vibeui-hero-032-ry:0;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-032"]{color-scheme:dark}
:where([data-vibeui-block="hero-032"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-032"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-032"]{box-sizing:border-box;position:relative;overflow:hidden;background:var(--vibeui-hero-032-bg);color:var(--vibeui-hero-032-fg);font-family:var(--vibeui-hero-032-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-032"] *{box-sizing:border-box}
[data-vibeui-block="hero-032"] [data-part="mesh"]{position:absolute;inset:0;overflow:hidden;pointer-events:none}
[data-vibeui-block="hero-032"] [data-part="mesh"] i{position:absolute;border-radius:50%;filter:blur(40px);opacity:.55;animation:vibeui-hero-032-float 16s ease-in-out infinite alternate}
[data-vibeui-block="hero-032"] [data-part="mesh"] i:nth-child(1){right:-8%;top:-18%;width:52%;aspect-ratio:1;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-hero-032-accent) 32%,transparent),transparent 65%)}
[data-vibeui-block="hero-032"] [data-part="mesh"] i:nth-child(2){left:-12%;bottom:-30%;width:45%;aspect-ratio:1;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-hero-032-accent) 18%,#ff9ad5),transparent 66%);animation-delay:-6s;animation-direction:alternate-reverse}
[data-vibeui-block="hero-032"] [data-part="mesh"] i:nth-child(3){left:35%;top:55%;width:30%;aspect-ratio:1;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-hero-032-accent) 22%,#8fd6ff),transparent 66%);animation-delay:-11s;opacity:.4}
[data-vibeui-block="hero-032"] [data-part="mesh"]::after{content:"";position:absolute;inset:0;opacity:.05;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .9 0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");background-size:200px}
[data-vibeui-block="hero-032"]::after{content:"";position:absolute;left:0;right:0;bottom:0;height:5rem;background:linear-gradient(transparent,var(--vibeui-hero-032-bg));pointer-events:none}
[data-vibeui-block="hero-032"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:4rem 1.25rem 3rem;display:grid;gap:3.5rem;align-items:center}
[data-vibeui-block="hero-032"] [data-part="copy"]>*{animation:vibeui-hero-032-up .9s cubic-bezier(.2,.8,.2,1) both}
[data-vibeui-block="hero-032"] [data-part="eyebrow"]{margin:0 0 1.2rem;display:inline-flex;align-items:center;gap:.5rem;padding:.4rem .9rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-hero-032-accent) 12%,transparent);color:var(--vibeui-hero-032-accent);font-size:.8rem;font-weight:600;animation-delay:.05s}
[data-vibeui-block="hero-032"] [data-part="eyebrow"]::before{content:"";width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-hero-032-accent);animation:vibeui-hero-032-blink 3s ease-in-out infinite}
[data-vibeui-block="hero-032"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2.8rem,7.2cqi,5.6rem);line-height:.98;letter-spacing:-.045em;text-wrap:balance;animation:none}
[data-vibeui-block="hero-032"] [data-part="w"]{display:inline-block;overflow:hidden;vertical-align:bottom;padding:.06em .04em .12em 0;margin:-.06em 0 -.12em}
[data-vibeui-block="hero-032"] [data-part="w"] span{display:inline-block;animation:vibeui-hero-032-rise 1s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-hero-032-i) * .07s + .15s)}
[data-vibeui-block="hero-032"] [data-part="w"] span[data-mark]{background:linear-gradient(120deg,var(--vibeui-hero-032-accent),color-mix(in oklab,var(--vibeui-hero-032-accent) 50%,#ff8fd8));-webkit-background-clip:text;background-clip:text;color:transparent}
[data-vibeui-block="hero-032"] [data-part="lede"]{margin:1.6rem 0 0;max-width:30rem;font-size:1.15rem;color:var(--vibeui-hero-032-muted);animation-delay:.55s}
[data-vibeui-block="hero-032"] [data-part="stores"]{display:flex;gap:.7rem;flex-wrap:wrap;margin-top:2rem;animation-delay:.7s}
[data-vibeui-block="hero-032"] [data-part="store"]{display:inline-flex;flex-direction:column;padding:.65rem 1.25rem .7rem;border-radius:1rem;background:var(--vibeui-hero-032-fg);color:var(--vibeui-hero-032-bg);text-decoration:none;line-height:1.1;transform:translate(var(--vibeui-hero-032-mx,0px),var(--vibeui-hero-032-my,0px));transition:transform .35s cubic-bezier(.2,.8,.2,1),background .25s,color .25s,box-shadow .35s}
[data-vibeui-block="hero-032"] [data-part="store"]:hover{background:var(--vibeui-hero-032-accent);color:var(--vibeui-hero-032-on-accent);box-shadow:0 18px 40px -18px color-mix(in oklab,var(--vibeui-hero-032-accent) 70%,transparent)}
[data-vibeui-block="hero-032"] [data-part="store"] small{font-size:.62rem;opacity:.75;letter-spacing:.04em;text-transform:uppercase}
[data-vibeui-block="hero-032"] [data-part="store"] b{font-size:1.05rem;font-weight:700}
[data-vibeui-block="hero-032"] [data-part="rating"]{display:flex;align-items:center;gap:.6rem;margin-top:1.6rem;font-size:.9rem;color:var(--vibeui-hero-032-muted);animation-delay:.85s}
[data-vibeui-block="hero-032"] [data-part="rating"] b{font-family:var(--vibeui-hero-032-mono);color:var(--vibeui-hero-032-fg)}
[data-vibeui-block="hero-032"] [data-part="stars"]{display:inline-flex;gap:.1rem;color:var(--vibeui-hero-032-accent)}
[data-vibeui-block="hero-032"] [data-part="stars"] i{animation:vibeui-hero-032-star .6s cubic-bezier(.2,1.4,.4,1) both;animation-delay:calc(var(--vibeui-hero-032-i) * .08s + 1s)}
[data-vibeui-block="hero-032"] [data-part="stage"]{perspective:1400px;padding-bottom:1rem}
[data-vibeui-block="hero-032"] [data-part="tilt"]{width:min(100%,19rem);margin:0 auto;transform:rotateX(calc(var(--vibeui-hero-032-ry) * -9deg)) rotateY(calc(var(--vibeui-hero-032-rx) * 12deg));transform-style:preserve-3d;transition:transform .8s cubic-bezier(.2,.8,.2,1);animation:vibeui-hero-032-up 1.2s cubic-bezier(.2,.8,.2,1) .3s backwards}
[data-vibeui-block="hero-032"] [data-part="phone"]{position:relative;aspect-ratio:9 / 19;border-radius:2.6rem;background:#0b0b16;padding:.6rem;box-shadow:0 60px 110px -36px color-mix(in oklab,var(--vibeui-hero-032-accent) 65%,transparent),0 30px 50px -30px rgb(0 0 0 / .6),0 0 0 2px #2a2a3a,0 0 0 6px #0b0b16;animation:vibeui-hero-032-hover 7s ease-in-out infinite;-webkit-box-reflect:below .9rem linear-gradient(transparent 78%,rgb(0 0 0 / .28))}
[data-vibeui-block="hero-032"] [data-part="phone"]::before{content:"";position:absolute;left:50%;top:.9rem;width:5rem;height:1.4rem;border-radius:999px;background:#0b0b16;transform:translateX(-50%);z-index:2}
[data-vibeui-block="hero-032"] [data-part="glare"]{position:absolute;inset:.6rem;border-radius:2rem;background:linear-gradient(115deg,transparent 38%,rgb(255 255 255 / .14) 48%,transparent 58%);transform:translateX(calc(var(--vibeui-hero-032-rx) * 45%));transition:transform .8s cubic-bezier(.2,.8,.2,1);pointer-events:none;z-index:3}
[data-vibeui-block="hero-032"] [data-part="screen"]{position:relative;height:100%;border-radius:2rem;background:radial-gradient(70% 50% at 50% 30%,color-mix(in oklab,var(--vibeui-hero-032-accent) 35%,var(--vibeui-hero-032-screen)),var(--vibeui-hero-032-screen) 70%);color:var(--vibeui-hero-032-screen-fg);display:grid;grid-template-rows:auto 1fr auto;padding:3rem 1.2rem 1.6rem;overflow:hidden;text-align:center}
[data-vibeui-block="hero-032"] [data-part="stitle"]{font-size:.85rem;font-weight:600;opacity:.8}
[data-vibeui-block="hero-032"] [data-part="orb"]{position:relative;align-self:center;justify-self:center;width:9rem;height:9rem;display:grid;place-items:center}
[data-vibeui-block="hero-032"] [data-part="orb"] > i{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-hero-032-accent) 90%,white),var(--vibeui-hero-032-accent) 60%,transparent 72%);transform:scale(var(--vibeui-hero-032-s));transition:transform var(--vibeui-hero-032-d) cubic-bezier(.4,0,.2,1);opacity:.92;filter:blur(.5px)}
[data-vibeui-block="hero-032"] [data-part="orb"] > i:nth-of-type(2){opacity:.35;transform:scale(calc(var(--vibeui-hero-032-s) * 1.35));filter:blur(8px)}
[data-vibeui-block="hero-032"] [data-part="ring"]{position:absolute;inset:0;border-radius:50%;border:1px solid color-mix(in oklab,var(--vibeui-hero-032-accent) 70%,white);opacity:.35;transform:scale(calc(var(--vibeui-hero-032-s) * 1.55));transition:transform var(--vibeui-hero-032-d) cubic-bezier(.4,0,.2,1);pointer-events:none}
[data-vibeui-block="hero-032"] [data-part="ring"] + [data-part="ring"]{opacity:.16;transform:scale(calc(var(--vibeui-hero-032-s) * 1.95))}
[data-vibeui-block="hero-032"] [data-part="ripple"]{position:absolute;inset:0;border-radius:50%;border:1px solid var(--vibeui-hero-032-accent);animation:vibeui-hero-032-ripple 4s ease-out infinite;pointer-events:none}
[data-vibeui-block="hero-032"] [data-part="ripple"] + [data-part="ripple"]{animation-delay:-2s}
[data-vibeui-block="hero-032"] [data-part="dust"]{position:absolute;inset:0;pointer-events:none}
[data-vibeui-block="hero-032"] [data-part="dust"] i{position:absolute;left:50%;top:50%;width:.28rem;height:.28rem;margin:-.14rem;border-radius:50%;background:#fff;box-shadow:0 0 6px 1px color-mix(in oklab,var(--vibeui-hero-032-accent) 60%,white);transform:rotate(var(--vibeui-hero-032-a)) translateY(calc(var(--vibeui-hero-032-s) * -4.8rem - var(--vibeui-hero-032-r)));transition:transform var(--vibeui-hero-032-d) cubic-bezier(.4,0,.2,1);animation:vibeui-hero-032-twinkle 2.6s ease-in-out infinite;animation-delay:calc(var(--vibeui-hero-032-i) * -.37s)}
[data-vibeui-block="hero-032"] [data-part="orb"] b{position:relative;font-family:var(--vibeui-hero-032-mono);font-size:1.7rem;font-weight:500}
[data-vibeui-block="hero-032"] [data-part="phase"]{overflow:hidden;font-size:2.1rem;font-weight:800;letter-spacing:-.03em;line-height:1.15;text-transform:lowercase;min-height:1.2em}
[data-vibeui-block="hero-032"] [data-part="phase"] span{display:block;animation:vibeui-hero-032-rise .6s cubic-bezier(.2,.8,.2,1) both}
[data-vibeui-block="hero-032"] [data-part="dots"]{display:flex;justify-content:center;gap:.4rem;margin-top:.7rem}
[data-vibeui-block="hero-032"] [data-part="dots"] i{width:.4rem;height:.4rem;border-radius:50%;background:rgb(255 255 255 / .25);transition:background .3s,transform .3s}
[data-vibeui-block="hero-032"] [data-part="dots"] i[data-on="true"]{background:var(--vibeui-hero-032-accent);transform:scale(1.4)}
[data-vibeui-block="hero-032"] a:focus-visible{outline:2px solid var(--vibeui-hero-032-accent);outline-offset:3px}
@keyframes vibeui-hero-032-star{from{transform:scale(0) rotate(-30deg);opacity:0}to{transform:none;opacity:1}}
@keyframes vibeui-hero-032-rise{from{transform:translateY(112%)}to{transform:none}}
@keyframes vibeui-hero-032-up{from{opacity:0;transform:translateY(1.2rem)}to{opacity:1;transform:none}}
@keyframes vibeui-hero-032-float{from{transform:translate(0,0)}to{transform:translate(-6%,8%)}}
@keyframes vibeui-hero-032-hover{0%,100%{transform:translateY(0)}50%{transform:translateY(-.6rem)}}
@keyframes vibeui-hero-032-ripple{from{transform:scale(1);opacity:.5}to{transform:scale(2.3);opacity:0}}
@keyframes vibeui-hero-032-twinkle{0%,100%{opacity:.25}50%{opacity:1}}
@keyframes vibeui-hero-032-blink{0%,100%{opacity:.5;transform:scale(.8)}50%{opacity:1;transform:scale(1.1)}}
@container (min-width: 60rem){[data-vibeui-block="hero-032"] [data-part="shell"]{grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:4rem;padding:5rem 2rem 5rem}[data-vibeui-block="hero-032"] [data-part="tilt"]{margin:0 0 0 auto}}
[data-vibeui-block="hero-032"] [data-part="w"]:not(:last-child)::after{content:"\\00a0"}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-032"] *{animation:none!important;transition:none!important}}`

const DUST = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

function Words({ text, highlight }: { text: string; highlight: string }) {
  const marks = new Set(highlight.toLowerCase().split(/\s+/).filter(Boolean))
  return text.split(/\s+/).map((word, index) => (
    <span data-part="w" key={index} style={{ ["--vibeui-hero-032-i" as string]: index }}>
      <span data-mark={marks.has(word.toLowerCase().replace(/[,.!?;:«»]/g, "")) ? "" : undefined}>{word}</span>
    </span>
  ))
}

/** Первый экран приложения с CSS-телефоном, наклоном за курсором и дышащим кругом. */
export function Hero032({
  eyebrow = "Сон · дыхание · тишина",
  title = "Засыпайте за десять минут, а не за час",
  highlight = "десять минут",
  lede = "Вечерние ритуалы, дыхательные практики и умный будильник. Без подписки на «медитацию» — только то, что помогает уснуть.",
  appStoreLabel = "App Store",
  appStoreHref = "#",
  playLabel = "Google Play",
  playHref = "#",
  rating = "4,9",
  ratingNote = "12 тыс. оценок",
  screenTitle = "Вечернее дыхание · 4-7-8",
  inhaleLabel = "вдох",
  holdLabel = "задержите",
  exhaleLabel = "выдох",
  inhale = 4,
  hold = 7,
  exhale = 8,
  appStoreCaption = "Скачать в",
  playCaption = "Доступно в",
  phoneLabel = "Экран приложения: дыхательная практика",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero032Props) {
  const root = useRef<HTMLElement>(null)
  const [state, setState] = useState({ phase: 0, left: inhale })
  const labels = [inhaleLabel, holdLabel, exhaleLabel]
  const { phase, left } = state

  useEffect(() => {
    const durations = [inhale, hold, exhale]
    const timer = window.setInterval(() => {
      setState((current) => {
        if (current.left > 1) return { ...current, left: current.left - 1 }
        const next = (current.phase + 1) % 3
        return { phase: next, left: durations[next] }
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [inhale, hold, exhale])

  const scale = phase === 0 ? 1 : phase === 1 ? 1 : 0.55
  const duration = phase === 2 ? exhale : phase === 0 ? inhale : 0.4

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("vibeui-hero-032:phase", { detail: { phase, duration } }))
  }, [phase, duration])

  const tilt = (event: PointerEvent<HTMLElement>) => {
    const element = root.current
    if (!element || event.pointerType !== "mouse") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const rect = element.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1
    element.style.setProperty("--vibeui-hero-032-rx", x.toFixed(3))
    element.style.setProperty("--vibeui-hero-032-ry", y.toFixed(3))
  }
  const untilt = () => {
    root.current?.style.setProperty("--vibeui-hero-032-rx", "0")
    root.current?.style.setProperty("--vibeui-hero-032-ry", "0")
  }
  const magnet = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse") return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    event.currentTarget.style.setProperty("--vibeui-hero-032-mx", `${(x * 10).toFixed(1)}px`)
    event.currentTarget.style.setProperty("--vibeui-hero-032-my", `${(y * 10 - 2).toFixed(1)}px`)
  }
  const unmagnet = (event: PointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.removeProperty("--vibeui-hero-032-mx")
    event.currentTarget.style.removeProperty("--vibeui-hero-032-my")
  }

  const palette = {
    "--vibeui-hero-032-s": scale,
    "--vibeui-hero-032-d": `${duration}s`,
    ...(accent ? { "--vibeui-hero-032-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-032-fg": ink } : null),
    ...(background ? { "--vibeui-hero-032-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-032" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="hero-032" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette} onPointerMove={tilt} onPointerLeave={untilt}>
        <div data-part="mesh" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div data-part="shell">
          <div data-part="copy">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h1 data-part="title">
              <Words text={title} highlight={highlight} />
            </h1>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <div data-part="stores">
              {appStoreLabel ? (
                <a data-part="store" href={appStoreHref} onPointerMove={magnet} onPointerLeave={unmagnet}>
                  <small>{appStoreCaption}</small>
                  <b>{appStoreLabel}</b>
                </a>
              ) : null}
              {playLabel ? (
                <a data-part="store" href={playHref} onPointerMove={magnet} onPointerLeave={unmagnet}>
                  <small>{playCaption}</small>
                  <b>{playLabel}</b>
                </a>
              ) : null}
            </div>
            {rating ? (
              <div data-part="rating">
                <span data-part="stars" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <i key={i} style={{ ["--vibeui-hero-032-i" as string]: i }}>
                      ★
                    </i>
                  ))}
                </span>
                <b>{rating}</b>
                {ratingNote ? <span>· {ratingNote}</span> : null}
              </div>
            ) : null}
          </div>
          <div data-part="stage">
            <div data-part="tilt">
              <div data-part="phone" aria-label={phoneLabel}>
                <div data-part="glare" aria-hidden="true" />
                <div data-part="screen">
                  <div data-part="stitle">{screenTitle}</div>
                  <div data-part="orb" aria-hidden="true">
                    <span data-part="ripple" />
                    <span data-part="ripple" />
                    <span data-part="ring" />
                    <span data-part="ring" />
                    <i />
                    <i />
                    <span data-part="dust">
                      {DUST.map((i) => (
                        <i key={i} style={{ ["--vibeui-hero-032-a" as string]: `${i * (360 / DUST.length)}deg`, ["--vibeui-hero-032-r" as string]: `${0.4 + (i % 3) * 0.55}rem`, ["--vibeui-hero-032-i" as string]: i }} />
                      ))}
                    </span>
                    <b>{left}</b>
                  </div>
                  <div>
                    <div data-part="phase" aria-live="polite">
                      <span key={phase}>{labels[phase]}</span>
                    </div>
                    <div data-part="dots" aria-hidden="true">
                      {[0, 1, 2].map((i) => (
                        <i key={i} data-on={i === phase} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

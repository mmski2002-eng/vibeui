"use client"

import { useEffect, useState, type CSSProperties } from "react"

export type Hero032Props = {
  eyebrow?: string
  title?: string
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
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Первый экран мобильного приложения без единого скриншота: справа телефон,
// нарисованный CSS, на его экране круг дышит — расширяется на вдохе,
// замирает, сжимается на выдохе, а подпись и счётчик секунд меняются в такт
// (фаза считается в setInterval, длительности — пропсами). Слева заголовок,
// рейтинг звёздами и бейджи магазинов текстом. Фон — мягкое лавандовое пятно.
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
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-032"]{color-scheme:dark}
:where([data-vibeui-block="hero-032"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-032"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-032"]{box-sizing:border-box;position:relative;overflow:hidden;background:var(--vibeui-hero-032-bg);color:var(--vibeui-hero-032-fg);font-family:var(--vibeui-hero-032-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-032"] *{box-sizing:border-box}
[data-vibeui-block="hero-032"]::before{content:"";position:absolute;right:-10%;top:-20%;width:55%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-hero-032-accent) 28%,transparent),transparent 65%);filter:blur(30px);pointer-events:none}
[data-vibeui-block="hero-032"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:4rem 1.25rem 3rem;display:grid;gap:3rem;align-items:center}
[data-vibeui-block="hero-032"] [data-part="eyebrow"]{margin:0 0 1rem;display:inline-flex;align-items:center;gap:.5rem;padding:.35rem .8rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-hero-032-accent) 12%,transparent);color:var(--vibeui-hero-032-accent);font-size:.8rem;font-weight:600}
[data-vibeui-block="hero-032"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2.4rem,6cqi,4.6rem);line-height:1.02;letter-spacing:-.035em;text-wrap:balance}
[data-vibeui-block="hero-032"] [data-part="lede"]{margin:1.2rem 0 0;max-width:30rem;font-size:1.1rem;color:var(--vibeui-hero-032-muted)}
[data-vibeui-block="hero-032"] [data-part="stores"]{display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1.8rem}
[data-vibeui-block="hero-032"] [data-part="store"]{display:inline-flex;flex-direction:column;padding:.55rem 1.1rem .6rem;border-radius:.9rem;background:var(--vibeui-hero-032-fg);color:var(--vibeui-hero-032-bg);text-decoration:none;line-height:1.1;transition:transform .18s,background .2s}
[data-vibeui-block="hero-032"] [data-part="store"]:hover{transform:translateY(-2px);background:var(--vibeui-hero-032-accent);color:var(--vibeui-hero-032-on-accent)}
[data-vibeui-block="hero-032"] [data-part="store"] small{font-size:.62rem;opacity:.75;letter-spacing:.04em;text-transform:uppercase}
[data-vibeui-block="hero-032"] [data-part="store"] b{font-size:1rem;font-weight:700}
[data-vibeui-block="hero-032"] [data-part="rating"]{display:flex;align-items:center;gap:.6rem;margin-top:1.4rem;font-size:.9rem;color:var(--vibeui-hero-032-muted)}
[data-vibeui-block="hero-032"] [data-part="rating"] b{font-family:var(--vibeui-hero-032-mono);color:var(--vibeui-hero-032-fg)}
[data-vibeui-block="hero-032"] [data-part="stars"]{display:inline-flex;gap:.1rem;color:var(--vibeui-hero-032-accent)}
[data-vibeui-block="hero-032"] [data-part="stars"] i{animation:vibeui-hero-032-star .6s cubic-bezier(.2,1.4,.4,1) both;animation-delay:calc(var(--vibeui-hero-032-i) * .08s + .4s)}
[data-vibeui-block="hero-032"] [data-part="phone"]{position:relative;width:min(100%,19rem);aspect-ratio:9 / 19;margin:0 auto;border-radius:2.6rem;background:#0b0b16;padding:.6rem;box-shadow:0 40px 80px -30px rgb(0 0 0 / .6),0 0 0 2px #2a2a3a,0 0 0 6px #0b0b16}
[data-vibeui-block="hero-032"] [data-part="phone"]::before{content:"";position:absolute;left:50%;top:.9rem;width:5rem;height:1.4rem;border-radius:999px;background:#0b0b16;transform:translateX(-50%);z-index:2}
[data-vibeui-block="hero-032"] [data-part="screen"]{position:relative;height:100%;border-radius:2rem;background:radial-gradient(70% 50% at 50% 30%,color-mix(in oklab,var(--vibeui-hero-032-accent) 35%,var(--vibeui-hero-032-screen)),var(--vibeui-hero-032-screen) 70%);color:var(--vibeui-hero-032-screen-fg);display:grid;grid-template-rows:auto 1fr auto;padding:3rem 1.4rem 1.6rem;overflow:hidden;text-align:center}
[data-vibeui-block="hero-032"] [data-part="stitle"]{font-size:.85rem;font-weight:600;opacity:.8}
[data-vibeui-block="hero-032"] [data-part="orb"]{position:relative;align-self:center;justify-self:center;width:9rem;height:9rem;display:grid;place-items:center}
[data-vibeui-block="hero-032"] [data-part="orb"] i{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-hero-032-accent) 90%,white),var(--vibeui-hero-032-accent) 60%,transparent 72%);transform:scale(var(--vibeui-hero-032-s));transition:transform var(--vibeui-hero-032-d) cubic-bezier(.4,0,.2,1);opacity:.9;filter:blur(.5px)}
[data-vibeui-block="hero-032"] [data-part="orb"] i:nth-child(2){opacity:.35;transform:scale(calc(var(--vibeui-hero-032-s) * 1.35));filter:blur(8px)}
[data-vibeui-block="hero-032"] [data-part="orb"] b{position:relative;font-family:var(--vibeui-hero-032-mono);font-size:1.6rem;font-weight:500}
[data-vibeui-block="hero-032"] [data-part="phase"]{font-size:1.1rem;font-weight:700;letter-spacing:.02em;text-transform:lowercase;min-height:1.4em}
[data-vibeui-block="hero-032"] [data-part="dots"]{display:flex;justify-content:center;gap:.4rem;margin-top:.6rem}
[data-vibeui-block="hero-032"] [data-part="dots"] i{width:.4rem;height:.4rem;border-radius:50%;background:rgb(255 255 255 / .25)}
[data-vibeui-block="hero-032"] [data-part="dots"] i[data-on="true"]{background:var(--vibeui-hero-032-accent)}
[data-vibeui-block="hero-032"] a:focus-visible{outline:2px solid var(--vibeui-hero-032-accent);outline-offset:3px}
@keyframes vibeui-hero-032-star{from{transform:scale(0) rotate(-30deg);opacity:0}to{transform:none;opacity:1}}
@container (min-width: 60rem){[data-vibeui-block="hero-032"] [data-part="shell"]{grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:4rem;padding:5rem 2rem 4rem}[data-vibeui-block="hero-032"] [data-part="phone"]{margin:0 0 0 auto}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-032"] *{animation:none!important;transition:none!important}}`

/** Первый экран приложения с CSS-телефоном и дышащим кругом. */
export function Hero032({
  eyebrow = "Сон · дыхание · тишина",
  title = "Засыпайте за десять минут, а не за час",
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
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero032Props) {
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
      <section data-vibeui-block="hero-032" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h1 data-part="title">{title}</h1>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <div data-part="stores">
              {appStoreLabel ? (
                <a data-part="store" href={appStoreHref}>
                  <small>Скачать в</small>
                  <b>{appStoreLabel}</b>
                </a>
              ) : null}
              {playLabel ? (
                <a data-part="store" href={playHref}>
                  <small>Доступно в</small>
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
          <div data-part="phone" aria-label="Экран приложения: дыхательная практика">
            <div data-part="screen">
              <div data-part="stitle">{screenTitle}</div>
              <div data-part="orb" aria-hidden="true">
                <i />
                <i />
                <b>{left}</b>
              </div>
              <div>
                <div data-part="phase" aria-live="polite">
                  {labels[phase]}
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
      </section>
    </>
  )
}

"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Hero048Props = {
  /** Фоновый ролик (mp4/H.264): стартует, как только браузер уверен, что доиграет без остановок. */
  videoSrc?: string
  /** Тот же ролик в webm (VP9) — для браузеров без H.264. */
  videoWebmSrc?: string
  /** Картинка-подложка, пока ролик грузится. Пусто — до старта ролика темно. */
  posterSrc?: string
  /** Последний кадр ролика: для reduced-motion и если видео не успело. */
  stillSrc?: string
  /** Герой последнего кадра без фона, того же размера, что кадр: ложится поверх надписи. */
  subjectSrc?: string
  /** Огромная надпись за героем кадра. */
  wordmark?: string
  eyebrow?: string
  /** Заголовок; таймер встаёт после него отдельной строкой. */
  title?: readonly string[]
  /** Сколько минут обещаем — стартовое значение обратного отсчёта. */
  minutes?: number
  lede?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  /** Строка доверия; первая часть до « · » — акцентом. */
  trust?: string
  /** Бегущая строка блюд внизу первого экрана. */
  ticker?: readonly string[]
  /** aria таймера. */
  timerLabel?: string
  skipLabel?: string
  replayLabel?: string
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Хиро доставки с фоновым роликом: текст и таймер «привезём за 28:00» видны
// сразу, пока ролик грузится, фоном стоит его первый кадр. Как только браузер
// уверен, что доиграет без остановок, ролик проявляется и играет один раз,
// к концу замедляясь; на последнем кадре за блюдом встаёт название. Стоп-кадр
// вписан в «рамку» с пропорцией ролика, которая повторяет object-fit:cover, —
// надпись и вырезанное блюдо в процентах рамки ложатся точно на кадр.
// Понизу бегущая строка блюд с наклоном.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@700;900&family=Russo+One&family=Onest:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-048"]){
--vibeui-hero-048-bg:#000000;
--vibeui-hero-048-fg:#fff4e6;
--vibeui-hero-048-accent:#ff3d2e;
--vibeui-hero-048-on-accent:oklch(from var(--vibeui-hero-048-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-048-muted:color-mix(in oklab,var(--vibeui-hero-048-fg) 64%,var(--vibeui-hero-048-bg));
--vibeui-hero-048-line:color-mix(in oklab,var(--vibeui-hero-048-fg) 16%,transparent);
--vibeui-hero-048-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-048-accent-font:"Russo One",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-048-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-048-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-hero-048-offset:0px;
container:vibeui-hero-048/inline-size;
color-scheme:dark;
}
[data-vibeui-block="hero-048"]{box-sizing:border-box;position:relative;overflow:hidden;isolation:isolate;background:var(--vibeui-hero-048-bg);color:var(--vibeui-hero-048-fg);font-family:var(--vibeui-hero-048-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-048"] *{box-sizing:border-box}
[data-vibeui-block="hero-048"] [data-part="scene"]{position:relative;display:flex;flex-direction:column}
[data-vibeui-block="hero-048"] [data-part="stage"]{position:relative;aspect-ratio:4/3;overflow:hidden;container-type:size;background:var(--vibeui-hero-048-bg)}
[data-vibeui-block="hero-048"] [data-part="frame"]{position:absolute;left:50%;top:50%;width:max(100cqw,177.778cqh);height:max(100cqh,56.25cqw);translate:-71% -50%;container-type:size}
[data-vibeui-block="hero-048"] [data-part="frame"] :is(video,img){position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="hero-048"] [data-part="video"]{opacity:0}
[data-vibeui-block="hero-048"]:not([data-phase="loading"]) [data-part="video"]{opacity:1}
[data-vibeui-block="hero-048"] [data-part="dark"]{position:absolute;inset:0;z-index:1;background:var(--vibeui-hero-048-bg);pointer-events:none}
[data-vibeui-block="hero-048"][data-phase="playing"] [data-part="dark"]{animation:vibeui-hero-048-dawn 2.6s cubic-bezier(.5,0,.2,1) .15s both}
[data-vibeui-block="hero-048"][data-phase="parked"] [data-part="dark"]{opacity:0}
[data-vibeui-block="hero-048"] [data-part="still"]{display:none}
[data-vibeui-block="hero-048"]:not([data-phase="loading"]) [data-part="poster"]{opacity:0;transition:opacity .8s ease-out .3s}
[data-vibeui-block="hero-048"][data-failed="true"] [data-part="video"]{display:none}
[data-vibeui-block="hero-048"][data-failed="true"] [data-part="still"]{display:block}
[data-vibeui-block="hero-048"] [data-part="subject"]{z-index:2;opacity:0;pointer-events:none;transition:opacity .6s ease-out}
[data-vibeui-block="hero-048"][data-phase="parked"] [data-part="subject"]{opacity:1}
[data-vibeui-block="hero-048"] [data-part="wordmark"]{position:absolute;z-index:3;left:0;right:3%;top:21%;margin:0;text-align:right;white-space:nowrap;font-family:var(--vibeui-hero-048-display);font-weight:900;font-size:9cqw;line-height:1;letter-spacing:-.04em;text-transform:uppercase;color:color-mix(in oklab,var(--vibeui-hero-048-accent) 42%,transparent);opacity:0;translate:0 14%;transition:opacity 1.2s ease-out .15s,translate 1.5s var(--vibeui-hero-048-ease) .15s;pointer-events:none;user-select:none}
[data-vibeui-block="hero-048"][data-phase="parked"] [data-part="wordmark"]{opacity:1;translate:0 0}
[data-vibeui-block="hero-048"] [data-part="shade"]{position:absolute;inset:0;z-index:3;pointer-events:none;background:linear-gradient(0deg,var(--vibeui-hero-048-bg) 2%,transparent 34%)}
[data-vibeui-block="hero-048"] [data-part="shell"]{position:relative;z-index:4;width:100%;max-width:80rem;margin:0 auto;padding:1rem 1.25rem 2.5rem;pointer-events:none}
[data-vibeui-block="hero-048"] [data-part="copy"]{animation:vibeui-hero-048-in 1s var(--vibeui-hero-048-ease) .15s both}
[data-vibeui-block="hero-048"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.5rem;margin:0 0 1.2rem;padding:.4rem .9rem;border-radius:999px;border:1px solid var(--vibeui-hero-048-line);background:color-mix(in oklab,var(--vibeui-hero-048-bg) 60%,transparent);font-size:.76rem;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--vibeui-hero-048-muted)}
[data-vibeui-block="hero-048"] [data-part="eyebrow"]::before{content:"";width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-hero-048-accent);box-shadow:0 0 0 0 var(--vibeui-hero-048-accent);animation:vibeui-hero-048-pulse 1.8s ease-out infinite}
[data-vibeui-block="hero-048"] [data-part="title"]{margin:0;font-family:var(--vibeui-hero-048-display);font-weight:900;font-size:clamp(2.1rem,9cqi,4.8rem);line-height:.98;letter-spacing:-.035em;text-transform:uppercase}
[data-vibeui-block="hero-048"] [data-part="line"]{display:block;overflow:hidden;padding-bottom:.06em;margin-bottom:-.06em}
[data-vibeui-block="hero-048"] [data-part="line"] > span{display:block;animation:vibeui-hero-048-rise .9s var(--vibeui-hero-048-ease) both;animation-delay:calc(var(--vibeui-hero-048-i) * .1s + .25s)}
[data-vibeui-block="hero-048"] [data-part="timer"]{display:inline-block;font-family:var(--vibeui-hero-048-accent-font);font-weight:400;color:var(--vibeui-hero-048-accent);font-variant-numeric:tabular-nums;letter-spacing:.02em;font-size:1.12em;line-height:1}
[data-vibeui-block="hero-048"] [data-part="timer"] b{font-weight:400;animation:vibeui-hero-048-blink 1s steps(1) infinite}
[data-vibeui-block="hero-048"] [data-part="lede"]{margin:1.3rem 0 0;max-width:29rem;font-size:1.04rem;color:var(--vibeui-hero-048-muted)}
[data-vibeui-block="hero-048"] [data-part="actions"]{display:flex;flex-wrap:wrap;align-items:center;gap:1rem 1.8rem;margin:1.8rem 0 0}
[data-vibeui-block="hero-048"] [data-part="actions"] a{pointer-events:auto;text-decoration:none;-webkit-tap-highlight-color:transparent}
[data-vibeui-block="hero-048"] [data-part="primary"]{position:relative;display:inline-flex;align-items:center;gap:.85rem;height:3.4rem;padding:0 1.6rem 0 .45rem;border-radius:999px;background:var(--vibeui-hero-048-accent);color:var(--vibeui-hero-048-on-accent);font-weight:600;font-size:1rem;letter-spacing:.01em;box-shadow:0 14px 34px -16px var(--vibeui-hero-048-accent),inset 0 1px 0 rgb(255 255 255 / .25);transition:box-shadow .3s,translate .3s var(--vibeui-hero-048-ease)}
[data-vibeui-block="hero-048"] [data-part="primary"]::after{content:"";position:absolute;inset:-3px;border-radius:inherit;border:1px solid var(--vibeui-hero-048-accent);opacity:0;scale:.96;transition:opacity .3s,scale .4s var(--vibeui-hero-048-ease);pointer-events:none}
[data-vibeui-block="hero-048"] [data-part="primary"]:hover{translate:0 -2px;box-shadow:0 20px 40px -14px var(--vibeui-hero-048-accent),inset 0 1px 0 rgb(255 255 255 / .25)}
[data-vibeui-block="hero-048"] [data-part="primary"]:hover::after{opacity:.55;scale:1.04}
[data-vibeui-block="hero-048"] [data-part="icon"]{display:grid;place-items:center;flex:none;width:2.5rem;height:2.5rem;border-radius:50%;background:var(--vibeui-hero-048-on-accent);color:var(--vibeui-hero-048-accent);transition:rotate .5s var(--vibeui-hero-048-ease)}
[data-vibeui-block="hero-048"] [data-part="icon"] [data-part="glyph"]{width:1.2rem;height:1.2rem}
[data-vibeui-block="hero-048"] [data-part="primary"]:hover [data-part="icon"]{rotate:-18deg}
[data-vibeui-block="hero-048"] [data-part="secondary"]{position:relative;display:inline-flex;align-items:center;gap:.55rem;padding:.35rem 0;color:var(--vibeui-hero-048-fg);font-weight:500;font-size:.98rem}
[data-vibeui-block="hero-048"] [data-part="secondary"] [data-part="glyph"]{width:1.15rem;height:1.15rem;color:var(--vibeui-hero-048-accent)}
[data-vibeui-block="hero-048"] [data-part="secondary"]::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:currentColor;opacity:.35;transform-origin:left;transition:opacity .3s,transform .4s var(--vibeui-hero-048-ease)}
[data-vibeui-block="hero-048"] [data-part="secondary"]:hover::after{opacity:1;background:var(--vibeui-hero-048-accent)}
[data-vibeui-block="hero-048"] [data-part="actions"] a:focus-visible{outline:2px solid var(--vibeui-hero-048-accent);outline-offset:4px;border-radius:999px}
[data-vibeui-block="hero-048"] [data-part="trust"]{margin:1.3rem 0 0;font-size:.86rem;color:var(--vibeui-hero-048-muted)}
[data-vibeui-block="hero-048"] [data-part="trust"] b{color:var(--vibeui-hero-048-accent);font-weight:700}
[data-vibeui-block="hero-048"] [data-part="ticker"]{position:relative;z-index:4;left:-3%;width:106%;margin:.4rem 0 2.6rem;padding:.7rem 0;background:var(--vibeui-hero-048-accent);color:var(--vibeui-hero-048-on-accent);transform:rotate(-2deg);overflow:hidden;white-space:nowrap;font-family:var(--vibeui-hero-048-accent-font);font-size:clamp(1rem,2.2cqi,1.4rem);text-transform:uppercase;letter-spacing:.04em}
[data-vibeui-block="hero-048"] [data-part="track"]{display:inline-flex;animation:vibeui-hero-048-marquee 30s linear infinite}
[data-vibeui-block="hero-048"] [data-part="ticker"]:hover [data-part="track"]{animation-play-state:paused}
[data-vibeui-block="hero-048"] [data-part="track"] span{display:inline-flex;align-items:center;gap:1.4rem;padding-right:1.4rem}
[data-vibeui-block="hero-048"] [data-part="track"] span::after{content:"";width:.55em;height:.55em;border-radius:50%;background:var(--vibeui-hero-048-on-accent);opacity:.7}
[data-vibeui-block="hero-048"] [data-part="replay"]{position:absolute;z-index:5;right:1rem;top:1rem;padding:.4rem .85rem;border-radius:999px;border:1px solid var(--vibeui-hero-048-line);background:color-mix(in oklab,var(--vibeui-hero-048-bg) 55%,transparent);color:var(--vibeui-hero-048-fg);font:inherit;font-size:.78rem;font-weight:500;cursor:pointer;transition:border-color .2s,opacity .6s}
[data-vibeui-block="hero-048"]:is([data-phase="loading"],[data-failed="true"]) [data-part="replay"]{opacity:0;visibility:hidden}
[data-vibeui-block="hero-048"] [data-part="replay"]:hover{border-color:var(--vibeui-hero-048-accent)}
[data-vibeui-block="hero-048"] [data-part="replay"]:focus-visible{outline:2px solid var(--vibeui-hero-048-accent);outline-offset:3px}
@keyframes vibeui-hero-048-in{from{opacity:0;translate:0 1.25rem}}
@keyframes vibeui-hero-048-dawn{to{opacity:0}}
@keyframes vibeui-hero-048-rise{from{translate:0 110%}}
@keyframes vibeui-hero-048-blink{50%{opacity:.2}}
@keyframes vibeui-hero-048-pulse{to{box-shadow:0 0 0 .55rem transparent}}
@keyframes vibeui-hero-048-marquee{to{transform:translateX(-50%)}}
@container vibeui-hero-048 (min-width: 56rem){
[data-vibeui-block="hero-048"] [data-part="scene"]{min-height:calc(100svh - var(--vibeui-hero-048-offset));justify-content:flex-end}
[data-vibeui-block="hero-048"] [data-part="stage"]{position:absolute;inset:0;aspect-ratio:auto}
[data-vibeui-block="hero-048"] [data-part="frame"]{--vibeui-hero-048-h:min(88cqh,calc((100svh - var(--vibeui-hero-048-offset)) * .88));left:auto;right:max(-6cqh,50cqw - 46rem);width:calc(var(--vibeui-hero-048-h) * 1.7778);height:var(--vibeui-hero-048-h);top:min(54cqh,calc((100svh - var(--vibeui-hero-048-offset)) * .54));translate:0 -50%}
[data-vibeui-block="hero-048"] [data-part="shade"]{background:linear-gradient(0deg,var(--vibeui-hero-048-bg),transparent 26%),linear-gradient(90deg,color-mix(in oklab,var(--vibeui-hero-048-bg) 75%,transparent),transparent 50%)}
[data-vibeui-block="hero-048"] [data-part="shell"]{padding:4rem 1.25rem 3rem}
[data-vibeui-block="hero-048"] [data-part="title"]{font-size:clamp(2.4rem,min(5.4cqi,9svh),5rem)}
[data-vibeui-block="hero-048"] [data-part="copy"]{max-width:40rem}
[data-vibeui-block="hero-048"] [data-part="replay"]{right:1.5rem;top:1.25rem}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="hero-048"] *{transition:none!important;animation:none!important}
[data-vibeui-block="hero-048"] :is([data-part="video"],[data-part="poster"],[data-part="replay"],[data-part="dark"]){display:none}
[data-vibeui-block="hero-048"] [data-part="still"]{display:block}
[data-vibeui-block="hero-048"] :is([data-part="subject"],[data-part="wordmark"]){opacity:1;translate:0 0}
}`

// Если за столько ролик не готов играть, вместо него — сразу стоп-кадр.
const READY_TIMEOUT = 5000
// Последние секунды ролика замедляются до SLOW_RATE — блюдо «оседает»,
// и стоп-кадр наступает без рывка.
const SLOW_RAMP = 1.2
const SLOW_RATE = 0.35

type Phase = "loading" | "playing" | "parked"

const pad = (value: number) => String(value).padStart(2, "0")

/** Хиро доставки: текст и живой таймер сразу, фоном — ролик с блюдом, которое замирает на последнем кадре. */
export function Hero048({
  videoSrc = "/demo/delivery/intro.mp4",
  videoWebmSrc = "/demo/delivery/intro.webm",
  posterSrc,
  stillSrc = "/demo/delivery/intro-end.webp",
  subjectSrc = "/demo/delivery/intro-burger.webp",
  wordmark = "",
  eyebrow = "Дарк-китчен · в пределах ТТК",
  title = ["Горячее", "привезём за"],
  minutes = 28,
  lede = "Своя кухня, свои курьеры, без посредников. Готовим после оплаты и везём в термосумке — бургер приезжает хрустящим, том-ям горячим.",
  primaryLabel = "Открыть меню",
  primaryHref = "#menu",
  secondaryLabel = "Собрать боул",
  secondaryHref = "#builder",
  trust = "4,8 из 5 · 12 400 заказов в месяц · бесплатно от 1 500 ₽",
  ticker = ["Смэш-бургер", "Том-ям", "Поке с лососем", "Пад-тай", "Картошка с трюфелем", "Чизкейк «Сан-Себастьян»", "Рамен тонкоцу", "Шаурма на углях"],
  timerLabel = "{m} минут {s} секунд",
  skipLabel = "Пропустить",
  replayLabel = "Смотреть ещё раз",
  accent,
  ink,
  background,
  className,
  style,
}: Hero048Props) {
  const [phase, setPhase] = useState<Phase>("loading")
  const [failed, setFailed] = useState(false)
  const [seconds, setSeconds] = useState(minutes * 60)
  const videoRef = useRef<HTMLVideoElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-hero-048-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-048-fg": ink } : null),
    ...(background ? { "--vibeui-hero-048-bg": background } : null),
    ...style,
  } as CSSProperties

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds((value) => (value <= 1 ? minutes * 60 : value - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [minutes])

  useEffect(() => {
    const video = videoRef.current
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    // Старт — когда браузер уверен, что доиграет без остановок (canplaythrough);
    // до этого фоном первый кадр. Не успел за READY_TIMEOUT — стоп-кадр.
    let started = false
    const fail = () => {
      window.clearTimeout(readyTimer)
      setFailed(true)
      setPhase("parked")
    }
    const start = () => {
      if (started) return
      started = true
      window.clearTimeout(readyTimer)
      video.play().then(() => setPhase("playing")).catch(fail)
    }
    const readyTimer = window.setTimeout(() => {
      if (started) return
      video.removeAttribute("src")
      video.load()
      fail()
    }, READY_TIMEOUT)
    video.addEventListener("canplaythrough", start)
    video.addEventListener("error", fail)
    video.muted = true
    video.preload = "auto"
    video.src = video.canPlayType('video/mp4; codecs="avc1.640028"') || !videoWebmSrc ? videoSrc : videoWebmSrc
    video.load()
    return () => {
      window.clearTimeout(readyTimer)
      video.removeEventListener("canplaythrough", start)
      video.removeEventListener("error", fail)
    }
  }, [videoSrc, videoWebmSrc])

  useEffect(() => {
    const video = videoRef.current
    if (!video || phase !== "playing") return
    let frame = 0
    const tick = () => {
      const left = video.duration - video.currentTime
      video.playbackRate = left < SLOW_RAMP ? SLOW_RATE + (1 - SLOW_RATE) * (left / SLOW_RAMP) : 1
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      video.playbackRate = 1
    }
  }, [phase])

  const toggle = () => {
    const video = videoRef.current
    if (!video) return
    if (phase === "parked") {
      video.currentTime = 0
      setPhase("playing")
      video.play().catch(() => setPhase("parked"))
      return
    }
    video.pause()
    if (video.duration) video.currentTime = video.duration
    setPhase("parked")
  }

  const trustParts = trust.split(" · ")
  const tickerRow = ticker.map((item, index) => <span key={`${item}-${index}`}>{item}</span>)

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-048" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-048" data-phase={phase} data-failed={failed ? "true" : undefined} className={className} style={palette}>
        <div data-part="scene">
          <div data-part="stage" aria-hidden="true">
            <div data-part="frame">
              {posterSrc ? <img data-part="poster" src={posterSrc} alt="" /> : null}
              <video ref={videoRef} data-part="video" muted playsInline preload="none" onEnded={() => setPhase("parked")} />
              <img data-part="still" src={stillSrc} alt="" />
              <i data-part="dark" />
              {wordmark ? <p data-part="wordmark">{wordmark}</p> : null}
              <img data-part="subject" src={subjectSrc} alt="" />
            </div>
            <i data-part="shade" />
          </div>
          <div data-part="shell">
            <div data-part="copy">
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h1 data-part="title">
                {title.map((line, index) => (
                  <span key={line} data-part="line" style={{ ["--vibeui-hero-048-i" as string]: index }}>
                    <span>{line}</span>
                  </span>
                ))}
                <span data-part="line" style={{ ["--vibeui-hero-048-i" as string]: title.length }}>
                  <span>
                    <time data-part="timer" aria-live="off" aria-label={timerLabel.replace("{m}", String(Math.floor(seconds / 60))).replace("{s}", String(seconds % 60))}>
                      {pad(Math.floor(seconds / 60))}
                      <b>:</b>
                      {pad(seconds % 60)}
                    </time>
                  </span>
                </span>
              </h1>
              {lede ? <p data-part="lede">{lede}</p> : null}
              {primaryLabel || secondaryLabel ? (
                <div data-part="actions">
                  {primaryLabel ? (
                    <a data-part="primary" href={primaryHref}>
                      <span data-part="icon" aria-hidden="true">
                        <svg data-part="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 3v7a3 3 0 0 0 3 3v8M7 3v7M10 3v7a3 3 0 0 1-3 3" />
                          <path d="M17 21V3c-2.2 1.4-3.5 4-3.5 7.5 0 2 1.2 3 3.5 3" />
                        </svg>
                      </span>
                      {primaryLabel}
                    </a>
                  ) : null}
                  {secondaryLabel ? (
                    <a data-part="secondary" href={secondaryHref}>
                      <svg data-part="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 11h18a9 9 0 0 1-18 0Z" />
                        <path d="M8 7.5c0-1.5 1-2 1-3.5M12 7.5c0-1.5 1-2 1-3.5M16 7.5c0-1.5 1-2 1-3.5" />
                      </svg>
                      {secondaryLabel}
                    </a>
                  ) : null}
                </div>
              ) : null}
              {trust ? (
                <p data-part="trust">
                  {trustParts.map((part, index) => (
                    <span key={part}>
                      {index > 0 ? " · " : null}
                      {index === 0 ? <b>{part}</b> : part}
                    </span>
                  ))}
                </p>
              ) : null}
            </div>
          </div>
          {ticker.length > 0 ? (
            <div data-part="ticker" aria-hidden="true">
              <div data-part="track">
                {tickerRow}
                {tickerRow}
              </div>
            </div>
          ) : null}
          <button data-part="replay" type="button" onClick={toggle}>
            {phase === "parked" ? replayLabel : skipLabel}
          </button>
        </div>
      </section>
    </>
  )
}

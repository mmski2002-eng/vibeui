"use client"

import { memo, useEffect, useRef, useState, type CSSProperties } from "react"

export type Hero047Stat = {
  value: number
  suffix?: string
  label: string
}

export type Hero047Props = {
  /** Ролик-интро (mp4/H.264): стартует, как только браузер уверен, что доиграет без остановок. */
  videoSrc?: string
  /** Тот же ролик в webm (VP9) — для браузеров без H.264. */
  videoWebmSrc?: string
  /** Последний кадр ролика: для reduced-motion и если видео не успело. */
  stillSrc?: string
  /** Герой последнего кадра без фона, того же размера, что кадр: ложится поверх надписи. */
  subjectSrc?: string
  /** Огромная надпись за героем кадра. */
  wordmark?: string
  eyebrow?: string
  /** Строки заголовка: каждая въезжает отдельно, последняя — акцентом. */
  title?: readonly string[]
  lede?: string
  primaryLabel?: string
  /** Мелкая строка под главной кнопкой. */
  primaryHint?: string
  primaryHref?: string
  stats?: readonly Hero047Stat[]
  /** Разделитель дробной части в показателях: «,» или «.». */
  decimalSeparator?: string
  loadingLabel?: string
  skipLabel?: string
  replayLabel?: string
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Хиро-интро: экран открывается пустым, по центру прорисовывается линия ЭКГ —
// она растёт вместе с буфером ролика, на готовности бьётся пульс, и только
// потом стартует видео. Ролик замедляется к концу и замирает на последнем
// кадре; тогда проявляются надпись за героем кадра, заголовок, кнопка
// с бьющимся сердцем и показатели. Стоп-кадр вписан в «рамку» с пропорцией
// ролика, которая повторяет object-fit:cover, — надпись и вырезанный герой
// в процентах рамки ложатся точно на кадр при любой ширине. Фаза дублируется
// атрибутом data-vibeui-hero-047 на <html>, чтобы страница прятала шапку.
const FONTS = "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Golos+Text:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-047"]){
--vibeui-hero-047-bg:#faf7f2;
--vibeui-hero-047-fg:#1f1a17;
--vibeui-hero-047-accent:#1f1a17;
--vibeui-hero-047-muted:color-mix(in oklab,var(--vibeui-hero-047-fg) 62%,var(--vibeui-hero-047-bg));
--vibeui-hero-047-line:color-mix(in oklab,var(--vibeui-hero-047-fg) 14%,transparent);
--vibeui-hero-047-glass:color-mix(in oklab,var(--vibeui-hero-047-bg) 72%,transparent);
--vibeui-hero-047-display:"Nunito",ui-rounded,ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-047-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-047-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-hero-047-ease:cubic-bezier(.2,.8,.2,1);
container:vibeui-hero-047/inline-size;
color-scheme:light;
}
[data-vibeui-block="hero-047"]{box-sizing:border-box;position:relative;overflow:hidden;isolation:isolate;background:var(--vibeui-hero-047-bg);color:var(--vibeui-hero-047-fg);font-family:var(--vibeui-hero-047-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-047"] *{box-sizing:border-box}
[data-vibeui-block="hero-047"] [data-part="scene"]{position:relative;min-height:100svh;display:flex;flex-direction:column;justify-content:space-between}
[data-vibeui-block="hero-047"] [data-part="stage"]{position:relative;aspect-ratio:5/4;overflow:hidden;container-type:size;background:var(--vibeui-hero-047-bg)}
[data-vibeui-block="hero-047"] [data-part="frame"]{position:absolute;right:0;top:50%;width:max(100cqw,177.778cqh);height:max(100cqh,56.25cqw);translate:0 -50%;container-type:size}
[data-vibeui-block="hero-047"] [data-part="frame"] :is(video,img){position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="hero-047"] [data-part="video"]{opacity:0;transition:opacity .8s ease-out}
[data-vibeui-block="hero-047"]:not([data-phase="loading"]) [data-part="video"]{opacity:1}
[data-vibeui-block="hero-047"] [data-part="still"]{display:none}
[data-vibeui-block="hero-047"][data-failed="true"] [data-part="video"]{display:none}
[data-vibeui-block="hero-047"][data-failed="true"] [data-part="still"]{display:block}
[data-vibeui-block="hero-047"] [data-part="subject"]{z-index:2;opacity:0;pointer-events:none;transition:opacity .6s ease-out}
[data-vibeui-block="hero-047"][data-phase="parked"] [data-part="subject"]{opacity:1}
[data-vibeui-block="hero-047"] [data-part="wordmark"]{position:absolute;z-index:1;left:0;right:10%;top:14%;margin:0;text-align:right;white-space:nowrap;font-family:var(--vibeui-hero-047-display);font-weight:900;font-size:11cqw;line-height:1;letter-spacing:-.03em;text-transform:uppercase;color:color-mix(in oklab,var(--vibeui-hero-047-fg) 10%,transparent);opacity:0;translate:0 14%;transition:opacity 1.2s ease-out .15s,translate 1.5s var(--vibeui-hero-047-ease) .15s;pointer-events:none;user-select:none}
[data-vibeui-block="hero-047"][data-phase="parked"] [data-part="wordmark"]{opacity:1;translate:0 0}
[data-vibeui-block="hero-047"] [data-part="shade"]{position:absolute;inset:0;z-index:3;pointer-events:none;opacity:0;transition:opacity 1.2s ease-out;background:linear-gradient(0deg,var(--vibeui-hero-047-bg) 4%,transparent 36%)}
[data-vibeui-block="hero-047"][data-phase="parked"] [data-part="shade"]{opacity:1}
[data-vibeui-block="hero-047"] [data-part="loader"]{position:absolute;inset:0;z-index:6;display:grid;place-content:center;justify-items:center;gap:1rem;pointer-events:none;transition:opacity .6s ease-out,visibility 0s linear .6s}
[data-vibeui-block="hero-047"]:not([data-phase="loading"]) [data-part="loader"]{opacity:0;visibility:hidden}
[data-vibeui-block="hero-047"] [data-part="ecg"]{width:clamp(14rem,36cqi,22rem);height:auto;overflow:visible}
[data-vibeui-block="hero-047"] [data-part="ecg-track"]{fill:none;stroke:var(--vibeui-hero-047-line);stroke-width:2;stroke-linejoin:round;stroke-linecap:round}
[data-vibeui-block="hero-047"] [data-part="ecg-line"]{fill:none;stroke:var(--vibeui-hero-047-accent);stroke-width:2.4;stroke-linejoin:round;stroke-linecap:round;stroke-dasharray:1;transition:stroke-dashoffset .35s cubic-bezier(.3,.7,.3,1);filter:drop-shadow(0 0 3px color-mix(in oklab,var(--vibeui-hero-047-accent) 60%,transparent))}
[data-vibeui-block="hero-047"] [data-part="ecg"][data-idle="true"] [data-part="ecg-line"]{stroke-dashoffset:.7;animation:vibeui-hero-047-idle 1.4s ease-in-out infinite}
[data-vibeui-block="hero-047"] [data-part="ecg"][data-beat="true"]{animation:vibeui-hero-047-beat .5s ease-out 2}
[data-vibeui-block="hero-047"] [data-part="pulse"]{display:flex;align-items:baseline;gap:.5rem;margin:0;font-family:var(--vibeui-hero-047-mono);font-size:.68rem;letter-spacing:.26em;text-transform:uppercase;color:var(--vibeui-hero-047-muted)}
[data-vibeui-block="hero-047"] [data-part="pulse"] b{font-family:var(--vibeui-hero-047-display);font-weight:800;font-size:1.3rem;letter-spacing:-.01em;color:var(--vibeui-hero-047-fg);font-variant-numeric:tabular-nums}
@keyframes vibeui-hero-047-idle{50%{stroke-dashoffset:.35}}
@keyframes vibeui-hero-047-beat{30%{scale:1.06;filter:drop-shadow(0 0 10px var(--vibeui-hero-047-accent))}}
[data-vibeui-block="hero-047"] [data-part="shell"]{position:relative;z-index:4;width:100%;max-width:84rem;margin:0 auto;padding:1.5rem 1.25rem 3rem;display:grid;gap:2rem;align-items:end;pointer-events:none}
[data-vibeui-block="hero-047"] [data-part="copy"]{opacity:0;translate:0 1.25rem;visibility:hidden;transition:opacity 1s ease-out .35s,translate 1.1s var(--vibeui-hero-047-ease) .35s,visibility 0s}
[data-vibeui-block="hero-047"][data-phase="parked"] [data-part="copy"]{opacity:1;translate:0 0;visibility:visible}
[data-vibeui-block="hero-047"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 1.1rem;font-family:var(--vibeui-hero-047-mono);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-hero-047-accent)}
[data-vibeui-block="hero-047"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-hero-047-accent)}
[data-vibeui-block="hero-047"] [data-part="title"]{margin:0;font-family:var(--vibeui-hero-047-display);font-weight:900;font-size:clamp(2.2rem,4.2cqi,3.8rem);line-height:1;letter-spacing:-.025em}
[data-vibeui-block="hero-047"] [data-part="line"]{display:block;overflow:hidden;padding-bottom:.08em;margin-bottom:-.08em}
[data-vibeui-block="hero-047"] [data-part="line"] span{display:block;translate:0 110%;transition:translate .9s var(--vibeui-hero-047-ease);transition-delay:calc(var(--vibeui-hero-047-i) * .12s + .45s)}
[data-vibeui-block="hero-047"][data-phase="parked"] [data-part="line"] span{translate:0 0}
[data-vibeui-block="hero-047"] [data-part="line"]:last-child span{color:var(--vibeui-hero-047-accent)}
[data-vibeui-block="hero-047"] [data-part="lede"]{margin:1.1rem 0 0;max-width:30rem;font-size:1.02rem;color:var(--vibeui-hero-047-muted)}
[data-vibeui-block="hero-047"] [data-part="actions"]{display:flex;flex-wrap:wrap;align-items:center;gap:1rem 1.4rem;margin:1.6rem 0 0}
[data-vibeui-block="hero-047"] [data-part="start"]{display:inline-flex;align-items:center;gap:1rem;padding:.5rem 1.6rem .5rem .5rem;border-radius:999px;border:1px solid var(--vibeui-hero-047-line);background:linear-gradient(180deg,color-mix(in oklab,var(--vibeui-hero-047-bg) 92%,#fff),var(--vibeui-hero-047-glass));box-shadow:inset 0 1px 0 #fff,0 14px 30px -18px color-mix(in oklab,var(--vibeui-hero-047-fg) 60%,transparent);color:var(--vibeui-hero-047-fg);text-decoration:none;pointer-events:auto;transition:border-color .3s,box-shadow .3s;-webkit-tap-highlight-color:transparent}
[data-vibeui-block="hero-047"] [data-part="start"]:is(:hover,:focus-visible){border-color:color-mix(in oklab,var(--vibeui-hero-047-accent) 55%,transparent);box-shadow:inset 0 1px 0 #fff,0 0 0 4px color-mix(in oklab,var(--vibeui-hero-047-accent) 10%,transparent),0 14px 30px -18px color-mix(in oklab,var(--vibeui-hero-047-fg) 60%,transparent)}
[data-vibeui-block="hero-047"] [data-part="start"]:focus-visible{outline:none}
[data-vibeui-block="hero-047"] [data-part="knob"]{position:relative;display:grid;place-items:center;flex:none;width:3.6rem;height:3.6rem;border-radius:50%;background:var(--vibeui-hero-047-accent);box-shadow:0 8px 18px -8px var(--vibeui-hero-047-accent);transition:scale .12s}
[data-vibeui-block="hero-047"] [data-part="ring"]{position:absolute;inset:-5px;width:calc(100% + 10px);height:calc(100% + 10px);rotate:-90deg;overflow:visible}
[data-vibeui-block="hero-047"] [data-part="ring"] circle{fill:none;stroke:var(--vibeui-hero-047-accent);stroke-width:1.6;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .7s cubic-bezier(.4,0,.2,1)}
[data-vibeui-block="hero-047"] [data-part="heart"]{width:1.5rem;height:1.5rem;fill:#fff;animation:vibeui-hero-047-heart 1.3s ease-in-out infinite}
[data-vibeui-block="hero-047"] [data-part="start"]:is(:hover,:focus-visible) [data-part="ring"] circle{stroke-dashoffset:0}
[data-vibeui-block="hero-047"] [data-part="start"]:is(:hover,:focus-visible) [data-part="heart"]{animation-duration:.7s}
[data-vibeui-block="hero-047"] [data-part="start"]:focus-visible [data-part="knob"]{outline:2px solid var(--vibeui-hero-047-accent);outline-offset:6px}
[data-vibeui-block="hero-047"] [data-part="start"]:active [data-part="knob"]{scale:.94}
[data-vibeui-block="hero-047"] [data-part="start-text"]{display:grid;gap:.15rem}
[data-vibeui-block="hero-047"] [data-part="start-text"] strong{font-family:var(--vibeui-hero-047-display);font-weight:800;font-size:1.02rem;letter-spacing:-.005em}
[data-vibeui-block="hero-047"] [data-part="start-text"] small{font-size:.8rem;color:var(--vibeui-hero-047-muted)}
@keyframes vibeui-hero-047-heart{0%,40%,100%{scale:1}15%{scale:1.18}28%{scale:1.05}}
[data-vibeui-block="hero-047"] [data-part="stats"]{display:flex;flex-wrap:wrap;gap:1.2rem 1.6rem;margin:2.2rem 0 0;padding:1.4rem 0 0;border-top:1px solid var(--vibeui-hero-047-line);list-style:none}
[data-vibeui-block="hero-047"] [data-part="stat"]{display:grid;gap:.2rem;max-width:10rem}
[data-vibeui-block="hero-047"] [data-part="stat"] b{font-family:var(--vibeui-hero-047-display);font-weight:900;font-size:1.5rem;line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
[data-vibeui-block="hero-047"] [data-part="stat"] small{font-size:.8rem;line-height:1.3;color:var(--vibeui-hero-047-muted)}
[data-vibeui-block="hero-047"] [data-part="replay"]{position:absolute;z-index:5;right:1rem;bottom:1rem;padding:.4rem .85rem;border-radius:999px;border:1px solid var(--vibeui-hero-047-line);background:var(--vibeui-hero-047-glass);color:var(--vibeui-hero-047-fg);font:inherit;font-size:.78rem;font-weight:500;cursor:pointer;transition:border-color .2s,opacity .6s}
[data-vibeui-block="hero-047"]:is([data-phase="loading"],[data-failed="true"]) [data-part="replay"]{opacity:0;visibility:hidden}
[data-vibeui-block="hero-047"] [data-part="replay"]:hover{border-color:var(--vibeui-hero-047-accent)}
[data-vibeui-block="hero-047"] [data-part="replay"]:focus-visible{outline:2px solid var(--vibeui-hero-047-accent);outline-offset:3px}
@container vibeui-hero-047 (min-width: 56rem){
[data-vibeui-block="hero-047"] [data-part="scene"]{justify-content:flex-end}
[data-vibeui-block="hero-047"] [data-part="stage"]{position:absolute;inset:0;aspect-ratio:auto}
[data-vibeui-block="hero-047"] [data-part="frame"]{right:auto;left:50%;translate:-50% -50%}
[data-vibeui-block="hero-047"] [data-part="shade"]{background:linear-gradient(0deg,color-mix(in oklab,var(--vibeui-hero-047-bg) 80%,transparent),transparent 30%),linear-gradient(90deg,color-mix(in oklab,var(--vibeui-hero-047-bg) 70%,transparent),transparent 46%)}
[data-vibeui-block="hero-047"] [data-part="shell"]{padding:0 2rem 3rem}
[data-vibeui-block="hero-047"] [data-part="copy"]{max-width:36rem}
[data-vibeui-block="hero-047"] [data-part="replay"]{right:1.5rem;bottom:1.25rem}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="hero-047"] *{transition:none!important;animation:none!important}
[data-vibeui-block="hero-047"] :is([data-part="video"],[data-part="loader"],[data-part="replay"]){display:none}
[data-vibeui-block="hero-047"] [data-part="still"]{display:block}
[data-vibeui-block="hero-047"] :is([data-part="subject"],[data-part="shade"],[data-part="wordmark"]){opacity:1;translate:0 0}
[data-vibeui-block="hero-047"] [data-part="copy"]{opacity:1;translate:0 0;visibility:visible}
[data-vibeui-block="hero-047"] [data-part="line"] span{translate:0 0}
}`

// Если за столько ролик не готов играть, интро пропускаем: сразу стоп-кадр и сайт.
const READY_TIMEOUT = 5000
// Пульс на готовности — два удара, потом старт ролика.
const BEAT_MS = 1000
// Последние секунды ролика замедляются до SLOW_RATE — герой «оседает»,
// и стоп-кадр наступает без рывка.
const SLOW_RAMP = 1.4
const SLOW_RATE = 0.3

// Два удара кардиограммы: изолиния, зубец P, комплекс QRS, зубец T.
const ECG = "M0 34H40l6-4 6 4H70l4 6 6-30 6 34 4-10H112q8-10 16 0H150l6-4 6 4H180l4 6 6-30 6 34 4-10H222q6-6 12 0H240"

const DEFAULT_STATS: Hero047Stat[] = [
  { value: 24, suffix: "/7", label: "дежурный врач без записи" },
  { value: 4.9, suffix: " / 5", label: "средняя оценка на картах" },
  { value: 18, label: "минут — среднее ожидание приёма" },
]

type Phase = "loading" | "playing" | "parked"

// Линия ЭКГ загрузки — отдельный memo-компонент: смена фазы блока
// не перерисовывает её, пока не меняются прогресс и пульс.
const Loader = memo(function Loader({ progress, beat, label }: { progress: number | null; beat: boolean; label: string }) {
  return (
    <div data-part="loader" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress === null ? undefined : Math.round(progress * 100)}>
      <svg data-part="ecg" viewBox="0 0 240 60" data-idle={progress === null && !beat ? "true" : undefined} data-beat={beat ? "true" : undefined}>
        <path data-part="ecg-track" d={ECG} />
        <path data-part="ecg-line" d={ECG} pathLength={1} style={{ strokeDashoffset: beat ? 0 : 1 - (progress ?? 0) }} />
      </svg>
      <p data-part="pulse">
        {label}
        <b>{String(Math.round((beat ? 1 : (progress ?? 0)) * 100)).padStart(3, "0")}</b>
      </p>
    </div>
  )
})

// Показатель «набегает» от нуля, когда хиро останавливается на стоп-кадре.
function Stat({ stat, run, separator }: { stat: Hero047Stat; run: boolean; separator: string }) {
  const ref = useRef<HTMLElement>(null)
  const decimals = Number.isInteger(stat.value) ? 0 : 1
  useEffect(() => {
    const node = ref.current
    if (!node || !run) return
    const start = performance.now()
    let frame = 0
    const step = (now: number) => {
      const progress = Math.min((now - start) / 1100, 1)
      const value = stat.value * (1 - (1 - progress) ** 3)
      node.textContent = value.toFixed(decimals).replace(".", separator) + (stat.suffix ?? "")
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [run, stat, decimals, separator])
  return <b ref={ref}>{stat.value.toFixed(decimals).replace(".", separator) + (stat.suffix ?? "")}</b>
}

/** Хиро-интро ветклиники: линия ЭКГ на загрузке, ролик с героем, стоп-кадр и только потом весь текст. */
export function Hero047({
  videoSrc = "/demo/vet/intro.mp4",
  videoWebmSrc = "/demo/vet/intro.webm",
  stillSrc = "/demo/vet/intro-end.webp",
  subjectSrc = "/demo/vet/intro-cat.webp",
  wordmark = "Лапа",
  eyebrow = "Ветклиника и груминг · Сокол",
  title = ["Лечим бережно.", "Без очередей", "и стресса."],
  lede = "Терапия, вакцинация, стоматология и груминг в одной клинике. Отдельные кабинеты для кошек и собак, дежурный врач круглосуточно.",
  primaryLabel = "Записаться на приём",
  primaryHint = "есть свободное время сегодня",
  primaryHref = "#booking",
  stats = DEFAULT_STATS,
  decimalSeparator = ",",
  loadingLabel = "Загрузка",
  skipLabel = "Пропустить",
  replayLabel = "Смотреть ещё раз",
  accent,
  ink,
  background,
  className,
  style,
}: Hero047Props) {
  const [phase, setPhase] = useState<Phase>("loading")
  const [progress, setProgress] = useState<number | null>(0)
  const [failed, setFailed] = useState(false)
  const [beat, setBeat] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-hero-047-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-047-fg": ink } : null),
    ...(background ? { "--vibeui-hero-047-bg": background } : null),
    ...style,
  } as CSSProperties

  useEffect(() => {
    const video = videoRef.current
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    // Ролик грузится обычной буферизацией: линия ЭКГ показывает, сколько уже
    // в буфере, старт — когда браузер уверен, что доиграет без остановок
    // (canplaythrough). Не успел за READY_TIMEOUT — сайт со стоп-кадром.
    let started = false
    let beatTimer = 0
    const fail = () => {
      window.clearTimeout(readyTimer)
      setFailed(true)
      setPhase("parked")
    }
    const start = () => {
      if (started) return
      started = true
      window.clearTimeout(readyTimer)
      setBeat(true)
      beatTimer = window.setTimeout(() => {
        video.play().then(() => setPhase("playing")).catch(fail)
      }, BEAT_MS)
    }
    const buffered = () => {
      if (!video.duration || started) return
      const end = video.buffered.length ? video.buffered.end(video.buffered.length - 1) : 0
      setProgress(Math.min(end / video.duration, 0.99))
    }
    const readyTimer = window.setTimeout(() => {
      if (started) return
      video.removeAttribute("src")
      video.load()
      fail()
    }, READY_TIMEOUT)
    video.addEventListener("progress", buffered)
    video.addEventListener("loadedmetadata", buffered)
    video.addEventListener("canplaythrough", start)
    video.addEventListener("error", fail)
    video.muted = true
    video.preload = "auto"
    video.src = video.canPlayType('video/mp4; codecs="avc1.640028"') || !videoWebmSrc ? videoSrc : videoWebmSrc
    video.load()
    return () => {
      window.clearTimeout(readyTimer)
      window.clearTimeout(beatTimer)
      video.removeEventListener("progress", buffered)
      video.removeEventListener("loadedmetadata", buffered)
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

  useEffect(() => {
    const root = document.documentElement
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    root.setAttribute("data-vibeui-hero-047", reduced ? "parked" : phase)
    return () => root.removeAttribute("data-vibeui-hero-047")
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

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-047" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-047" data-phase={phase} data-failed={failed ? "true" : undefined} className={className} style={palette}>
        <div data-part="scene">
          <div data-part="stage" aria-hidden="true">
            <div data-part="frame">
              <video ref={videoRef} data-part="video" muted playsInline preload="none" onEnded={() => setPhase("parked")} />
              <img data-part="still" src={stillSrc} alt="" />
              {wordmark ? <p data-part="wordmark">{wordmark}</p> : null}
              <img data-part="subject" src={subjectSrc} alt="" />
            </div>
            <i data-part="shade" />
          </div>
          <Loader progress={progress} beat={beat} label={loadingLabel} />
          <div data-part="shell">
            <div data-part="copy">
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h1 data-part="title">
                {title.map((line, index) => (
                  <span key={line} data-part="line" style={{ ["--vibeui-hero-047-i" as string]: index }}>
                    <span>{line}</span>
                  </span>
                ))}
              </h1>
              {lede ? <p data-part="lede">{lede}</p> : null}
              {primaryLabel ? (
                <div data-part="actions">
                  <a data-part="start" href={primaryHref}>
                    <span data-part="knob" aria-hidden="true">
                      <svg data-part="ring" viewBox="0 0 60 60">
                        <circle cx={30} cy={30} r={29} pathLength={1} />
                      </svg>
                      <svg data-part="heart" viewBox="0 0 24 24">
                        <path d="M12 21s-7.2-4.5-9.4-8.8C1 9.1 2.7 5.4 6.4 5.1c2-.2 3.8.9 4.6 2.6.8-1.7 2.6-2.8 4.6-2.6 3.7.3 5.4 4 3.8 7.1C19.2 16.5 12 21 12 21Z" />
                      </svg>
                    </span>
                    <span data-part="start-text">
                      <strong>{primaryLabel}</strong>
                      {primaryHint ? <small>{primaryHint}</small> : null}
                    </span>
                  </a>
                </div>
              ) : null}
              {stats.length ? (
                <ul data-part="stats">
                  {stats.map((stat) => (
                    <li key={stat.label} data-part="stat">
                      <Stat stat={stat} run={phase === "parked"} separator={decimalSeparator} />
                      <small>{stat.label}</small>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
          <button data-part="replay" type="button" onClick={toggle}>
            {phase === "parked" ? replayLabel : skipLabel}
          </button>
        </div>
      </section>
    </>
  )
}

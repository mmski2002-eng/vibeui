"use client"

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react"

export type Hero029Chapter = {
  /** Секунда начала главы. */
  at: number
  title: string
}

export type Hero029Props = {
  eyebrow?: string
  /** Номер эпизода: «№ 112». */
  number?: string
  title?: string
  guest?: string
  lede?: string
  cover?: string
  coverAlt?: string
  /** Длительность в секундах. */
  duration?: number
  chapters?: readonly Hero029Chapter[]
  playLabel?: string
  pauseLabel?: string
  chaptersLabel?: string
  allLabel?: string
  allHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Первый экран подкаста с плеером эпизода недели: обложка с мягким
// свечением, номер эпизода моноширинным, плакатный заголовок узким гротеском,
// кнопка play. Под ней — волна из 64 полосок (высоты псевдослучайные, от
// индекса), которая оживает при воспроизведении и заливается по прогрессу;
// таймер идёт секундами, главы кликабельны — прыгают по времени. Звука нет —
// это витрина поведения; подключить <audio> — дело одного ref.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Sofia+Sans+Extra+Condensed:wght@700;800&family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-029"]){
--vibeui-hero-029-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-hero-029-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-029-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-029-on-accent:oklch(from var(--vibeui-hero-029-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-029-muted:color-mix(in oklab,var(--vibeui-hero-029-fg) 60%,var(--vibeui-hero-029-bg));
--vibeui-hero-029-panel:color-mix(in oklab,var(--vibeui-hero-029-fg) 6%,var(--vibeui-hero-029-bg));
--vibeui-hero-029-line:color-mix(in oklab,var(--vibeui-hero-029-fg) 12%,transparent);
--vibeui-hero-029-display:"Sofia Sans Extra Condensed",Impact,"Arial Narrow",sans-serif;
--vibeui-hero-029-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-029-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-029"]{color-scheme:dark}
:where([data-vibeui-block="hero-029"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-029"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-029"]{box-sizing:border-box;position:relative;overflow:hidden;background:var(--vibeui-hero-029-bg);color:var(--vibeui-hero-029-fg);font-family:var(--vibeui-hero-029-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-029"] *{box-sizing:border-box}
[data-vibeui-block="hero-029"]::before{content:"";position:absolute;left:-10%;top:-30%;width:60%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-hero-029-accent) 22%,transparent),transparent 60%);filter:blur(40px);pointer-events:none}
[data-vibeui-block="hero-029"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:4rem 1.25rem 3.5rem;display:grid;gap:2.5rem;align-items:center}
[data-vibeui-block="hero-029"] [data-part="cover"]{position:relative;width:min(100%,22rem);aspect-ratio:1;border-radius:1.2rem;overflow:hidden;background:var(--vibeui-hero-029-panel);box-shadow:0 40px 80px -40px rgb(0 0 0 / .8),0 0 0 1px var(--vibeui-hero-029-line);margin:0 auto}
[data-vibeui-block="hero-029"] [data-part="cover"] img{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="hero-029"] [data-part="cover"]::after{content:"";position:absolute;inset:0;box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-hero-029-accent) 40%,transparent) inset;transition:box-shadow .4s}
[data-vibeui-block="hero-029"][data-playing="true"] [data-part="cover"]::after{box-shadow:0 0 0 3px var(--vibeui-hero-029-accent) inset}
[data-vibeui-block="hero-029"] [data-part="rec"]{position:absolute;left:.9rem;top:.9rem;display:inline-flex;align-items:center;gap:.4rem;padding:.35rem .6rem;border-radius:999px;background:rgb(0 0 0 / .55);color:#fff;font-family:var(--vibeui-hero-029-mono);font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;backdrop-filter:blur(6px)}
[data-vibeui-block="hero-029"] [data-part="rec"] i{width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-hero-029-accent)}
[data-vibeui-block="hero-029"][data-playing="true"] [data-part="rec"] i{animation:vibeui-hero-029-blink 1s steps(1) infinite}
[data-vibeui-block="hero-029"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-hero-029-mono);font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-hero-029-accent)}
[data-vibeui-block="hero-029"] [data-part="title"]{margin:0;font-family:var(--vibeui-hero-029-display);font-weight:800;font-size:clamp(3.2rem,9cqi,7.5rem);line-height:.9;letter-spacing:-.01em;text-transform:uppercase;text-wrap:balance}
[data-vibeui-block="hero-029"] [data-part="guest"]{margin:1rem 0 0;font-size:1.15rem;font-weight:500}
[data-vibeui-block="hero-029"] [data-part="lede"]{margin:.6rem 0 0;max-width:34rem;color:var(--vibeui-hero-029-muted)}
[data-vibeui-block="hero-029"] [data-part="player"]{margin-top:1.8rem;display:grid;grid-template-columns:auto 1fr;gap:1.2rem;align-items:center}
[data-vibeui-block="hero-029"] [data-part="play"]{width:4.5rem;height:4.5rem;border-radius:50%;border:0;background:var(--vibeui-hero-029-accent);color:var(--vibeui-hero-029-on-accent);display:grid;place-items:center;cursor:pointer;box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-hero-029-accent) 40%,transparent);transition:transform .18s,box-shadow .3s}
[data-vibeui-block="hero-029"] [data-part="play"]:hover{transform:scale(1.05)}
[data-vibeui-block="hero-029"][data-playing="true"] [data-part="play"]{box-shadow:0 0 0 12px color-mix(in oklab,var(--vibeui-hero-029-accent) 18%,transparent)}
[data-vibeui-block="hero-029"] [data-part="play"] svg{width:1.6rem;height:1.6rem;fill:currentColor}
[data-vibeui-block="hero-029"] [data-part="play"]:focus-visible,[data-vibeui-block="hero-029"] a:focus-visible,[data-vibeui-block="hero-029"] [data-part="chapter"]:focus-visible{outline:2px solid var(--vibeui-hero-029-accent);outline-offset:3px}
[data-vibeui-block="hero-029"] [data-part="wave"]{display:flex;align-items:center;gap:2px;height:3.5rem;cursor:pointer;border:0;background:none;padding:0;width:100%}
[data-vibeui-block="hero-029"] [data-part="wave"] i{flex:1;height:calc(var(--vibeui-hero-029-h) * 100%);min-height:3px;border-radius:2px;background:color-mix(in oklab,var(--vibeui-hero-029-fg) 22%,transparent);transition:background .2s}
[data-vibeui-block="hero-029"] [data-part="wave"] i[data-past="true"]{background:var(--vibeui-hero-029-accent)}
[data-vibeui-block="hero-029"][data-playing="true"] [data-part="wave"] i{animation:vibeui-hero-029-wave 1.1s ease-in-out infinite alternate;animation-delay:calc(var(--vibeui-hero-029-i) * -.07s)}
[data-vibeui-block="hero-029"] [data-part="time"]{display:flex;justify-content:space-between;font-family:var(--vibeui-hero-029-mono);font-size:.78rem;color:var(--vibeui-hero-029-muted);margin-top:.4rem;font-variant-numeric:tabular-nums}
[data-vibeui-block="hero-029"] [data-part="chapters"]{margin:1.6rem 0 0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:.5rem}
[data-vibeui-block="hero-029"] [data-part="chapters"] li:first-child{width:100%;font-family:var(--vibeui-hero-029-mono);font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-hero-029-muted)}
[data-vibeui-block="hero-029"] [data-part="chapter"]{display:inline-flex;align-items:center;gap:.5rem;padding:.5rem .8rem;border-radius:999px;border:1px solid var(--vibeui-hero-029-line);background:var(--vibeui-hero-029-panel);color:inherit;font:inherit;font-size:.85rem;cursor:pointer;transition:border-color .2s,background .2s}
[data-vibeui-block="hero-029"] [data-part="chapter"]:hover,[data-vibeui-block="hero-029"] [data-part="chapter"][data-active="true"]{border-color:var(--vibeui-hero-029-accent);background:color-mix(in oklab,var(--vibeui-hero-029-accent) 14%,transparent)}
[data-vibeui-block="hero-029"] [data-part="chapter"] span{font-family:var(--vibeui-hero-029-mono);font-size:.72rem;color:var(--vibeui-hero-029-accent)}
[data-vibeui-block="hero-029"] [data-part="all"]{display:inline-flex;align-items:center;gap:.4rem;margin-top:1.6rem;color:inherit;text-decoration:none;font-weight:500;border-bottom:1px solid var(--vibeui-hero-029-accent);padding-bottom:.1rem}
@keyframes vibeui-hero-029-wave{from{transform:scaleY(.5)}to{transform:scaleY(1.15)}}
@keyframes vibeui-hero-029-blink{50%{opacity:.2}}
@container (min-width: 60rem){[data-vibeui-block="hero-029"] [data-part="shell"]{grid-template-columns:22rem minmax(0,1fr);gap:4rem;padding:5rem 2rem 4.5rem}[data-vibeui-block="hero-029"] [data-part="cover"]{margin:0}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-029"] *{animation:none!important;transition:none!important}}`

const BARS = 64
// Округление до сотых: Math.sin в Node и в браузере расходится в последних битах, и гидрация ловила бы расхождение.
const heightAt = (i: number) => Math.round((0.25 + (Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1) * 0.75) * 100) / 100
const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`

/** Первый экран подкаста с плеером эпизода недели и живой волной. */
export function Hero029({
  eyebrow = "Эпизод недели",
  number = "№ 112",
  title = "Человек, который зажигает маяк",
  guest = "Сергей Волков — смотритель маяка на Белом море",
  lede = "Полтора часа о том, как устроен день, в котором нет никого, кроме тебя, ветра и лампы на сорок километров.",
  cover = "",
  coverAlt = "",
  duration = 5412,
  chapters = [
    { at: 0, title: "Как попасть на маяк" },
    { at: 780, title: "Одиночество и радио" },
    { at: 1860, title: "Шторм 2019 года" },
    { at: 3240, title: "Что читать зимой" },
    { at: 4500, title: "Уехать или остаться" },
  ],
  playLabel = "Слушать",
  pauseLabel = "Пауза",
  chaptersLabel = "Главы",
  allLabel = "Все эпизоды",
  allHref = "#episodes",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero029Props) {
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const wave = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setElapsed((current) => {
        if (current + 1 >= duration) {
          setPlaying(false)
          return duration
        }
        return current + 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [playing, duration])

  const seek = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = wave.current?.getBoundingClientRect()
    if (!rect) return
    setElapsed(Math.round(((event.clientX - rect.left) / rect.width) * duration))
  }

  const progress = elapsed / duration
  const current = [...chapters].reverse().find((chapter) => chapter.at <= elapsed)

  const palette = {
    ...(accent ? { "--vibeui-hero-029-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-029-fg": ink } : null),
    ...(background ? { "--vibeui-hero-029-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-029" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-029" data-tone={tone === "auto" ? undefined : tone} data-playing={playing} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="cover">
            {cover ? <img src={cover} alt={coverAlt} /> : null}
            <span data-part="rec" aria-hidden="true">
              <i />
              {playing ? "on air" : number}
            </span>
          </div>
          <div>
            {eyebrow ? (
              <p data-part="eyebrow">
                {eyebrow} · {number}
              </p>
            ) : null}
            <h1 data-part="title">{title}</h1>
            {guest ? <p data-part="guest">{guest}</p> : null}
            {lede ? <p data-part="lede">{lede}</p> : null}
            <div data-part="player">
              <button type="button" data-part="play" aria-label={playing ? pauseLabel : playLabel} aria-pressed={playing} onClick={() => setPlaying((value) => !value)}>
                {playing ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="6" y="5" width="4" height="14" rx="1" />
                    <rect x="14" y="5" width="4" height="14" rx="1" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5.5v13l11-6.5z" />
                  </svg>
                )}
              </button>
              <div>
                <button ref={wave} type="button" data-part="wave" aria-label="Перемотать" onClick={seek}>
                  {Array.from({ length: BARS }, (_, i) => (
                    <i key={i} data-past={i / BARS <= progress} style={{ ["--vibeui-hero-029-h" as string]: heightAt(i), ["--vibeui-hero-029-i" as string]: i }} />
                  ))}
                </button>
                <div data-part="time">
                  <span>{clock(elapsed)}</span>
                  <span>{clock(duration)}</span>
                </div>
              </div>
            </div>
            {chapters.length > 0 ? (
              <ul data-part="chapters">
                <li>{chaptersLabel}</li>
                {chapters.map((chapter) => (
                  <li key={chapter.at}>
                    <button
                      type="button"
                      data-part="chapter"
                      data-active={current === chapter}
                      onClick={() => {
                        setElapsed(chapter.at)
                        setPlaying(true)
                      }}
                    >
                      <span>{clock(chapter.at)}</span>
                      {chapter.title}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            {allLabel ? (
              <a data-part="all" href={allHref}>
                {allLabel} →
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}

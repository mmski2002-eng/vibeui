"use client"

import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from "react"

import { Button077 } from "@/registry/components/button/button-077/button-077"

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
  /** Слово заголовка, которое показать контуром; пусто — последнее. */
  outline?: string
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
  /** aria волны-перемотки. */
  seekLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Первый экран подкаста с плеером эпизода недели. Заголовок кинетический:
// слова въезжают снизу через маски каскадом, последнее (или заданное) —
// контуром. Обложка наклоняется за курсором (3D-tilt) и лежит на собственном
// размытом «свечении» — та же картинка, растянутая и размытая под ней.
// Кнопка play магнитная. Волна из 64 полосок оживает при воспроизведении и
// заливается по прогрессу; таймер идёт секундами, главы прыгают по времени.
// Плеер связан с мини-плеером (podcast-007) событиями `vibeui-player:*`:
// play шлёт трек вниз, состояние приходит обратно — волна «живая», пока
// что-то играет, и замирает на паузе. Звука нет — витрина поведения.
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
--vibeui-hero-029-ease:cubic-bezier(.2,.8,.2,1);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-029"]{color-scheme:dark}
:where([data-vibeui-block="hero-029"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-029"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-029"]{box-sizing:border-box;position:relative;overflow:hidden;background:var(--vibeui-hero-029-bg);color:var(--vibeui-hero-029-fg);font-family:var(--vibeui-hero-029-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-029"] *{box-sizing:border-box}
[data-vibeui-block="hero-029"] [data-part="all"]{margin-top:1.6rem}
[data-vibeui-block="hero-029"] [data-part="all"]{margin-top:1.6rem}
[data-vibeui-block="hero-029"]::before{content:"";position:absolute;left:-10%;top:-30%;width:60%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-hero-029-accent) 22%,transparent),transparent 60%);filter:blur(40px);pointer-events:none;animation:vibeui-hero-029-drift 14s ease-in-out infinite alternate}
[data-vibeui-block="hero-029"]::after{content:"";position:absolute;right:-20%;bottom:-40%;width:55%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-hero-029-accent) 12%,transparent),transparent 62%);filter:blur(50px);pointer-events:none;animation:vibeui-hero-029-drift 18s ease-in-out infinite alternate-reverse}
[data-vibeui-block="hero-029"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:4rem 1.25rem 3.5rem;display:grid;gap:2.5rem;align-items:center}
[data-vibeui-block="hero-029"] [data-part="stage"]{position:relative;width:min(100%,22rem);margin:0 auto;perspective:1000px;animation:vibeui-hero-029-up .9s var(--vibeui-hero-029-ease) both}
[data-vibeui-block="hero-029"] [data-part="glow"]{position:absolute;inset:8% -6% -10%;border-radius:2rem;overflow:hidden;filter:blur(34px) saturate(1.6);opacity:.55;transform:translateZ(0);pointer-events:none;transition:opacity .6s}
[data-vibeui-block="hero-029"] [data-part="glow"] img{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="hero-029"] [data-part="glow"]::after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 70%,color-mix(in oklab,var(--vibeui-hero-029-accent) 55%,transparent),transparent 70%)}
[data-vibeui-block="hero-029"][data-live="true"] [data-part="glow"]{opacity:.9;animation:vibeui-hero-029-breathe 2.4s ease-in-out infinite}
[data-vibeui-block="hero-029"] [data-part="cover"]{position:relative;width:100%;aspect-ratio:1;border-radius:1.2rem;overflow:hidden;background:var(--vibeui-hero-029-panel);box-shadow:0 40px 80px -40px rgb(0 0 0 / .8),0 0 0 1px var(--vibeui-hero-029-line);transform:rotateX(calc(var(--vibeui-hero-029-ty,0) * -9deg)) rotateY(calc(var(--vibeui-hero-029-tx,0) * 11deg));transition:transform .35s var(--vibeui-hero-029-ease);will-change:transform;transform-style:preserve-3d}
[data-vibeui-block="hero-029"] [data-part="cover"] img{width:100%;height:100%;object-fit:cover;display:block;transform:scale(1.04) translate(calc(var(--vibeui-hero-029-tx,0) * -1.2%),calc(var(--vibeui-hero-029-ty,0) * -1.2%));transition:transform .35s var(--vibeui-hero-029-ease)}
[data-vibeui-block="hero-029"] [data-part="cover"]::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at calc(50% + var(--vibeui-hero-029-tx,0) * 50%) calc(50% + var(--vibeui-hero-029-ty,0) * 50%),rgb(255 255 255 / .22),transparent 45%);opacity:0;transition:opacity .3s;pointer-events:none}
[data-vibeui-block="hero-029"] [data-part="stage"]:hover [data-part="cover"]::before{opacity:1}
[data-vibeui-block="hero-029"] [data-part="cover"]::after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-hero-029-accent) 40%,transparent) inset;transition:box-shadow .4s;pointer-events:none}
[data-vibeui-block="hero-029"][data-live="true"] [data-part="cover"]::after{box-shadow:0 0 0 3px var(--vibeui-hero-029-accent) inset}
[data-vibeui-block="hero-029"] [data-part="rec"]{position:absolute;left:.9rem;top:.9rem;display:inline-flex;align-items:center;gap:.4rem;padding:.35rem .6rem;border-radius:999px;background:rgb(0 0 0 / .55);color:#fff;font-family:var(--vibeui-hero-029-mono);font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;backdrop-filter:blur(6px);transform:translateZ(30px)}
[data-vibeui-block="hero-029"] [data-part="rec"] i{width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-hero-029-accent);box-shadow:0 0 0 0 var(--vibeui-hero-029-accent)}
[data-vibeui-block="hero-029"][data-live="true"] [data-part="rec"] i{animation:vibeui-hero-029-blink 1s steps(1) infinite,vibeui-hero-029-ping 1.6s ease-out infinite}
[data-vibeui-block="hero-029"] [data-part="eyebrow"]{margin:0 0 .9rem;font-family:var(--vibeui-hero-029-mono);font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-hero-029-accent);animation:vibeui-hero-029-up .7s var(--vibeui-hero-029-ease) both}
[data-vibeui-block="hero-029"] [data-part="title"]{margin:0;font-family:var(--vibeui-hero-029-display);font-weight:800;font-size:clamp(3.4rem,10cqi,8.4rem);line-height:.88;letter-spacing:-.015em;text-transform:uppercase;text-wrap:balance}
[data-vibeui-block="hero-029"] [data-part="w"]{display:inline-block;overflow:hidden;vertical-align:top;padding:.04em .08em .12em 0;margin:-.04em 0 -.12em 0}
[data-vibeui-block="hero-029"] [data-part="w"] i{display:inline-block;font-style:normal;animation:vibeui-hero-029-word .9s var(--vibeui-hero-029-ease) both;animation-delay:calc(.12s + var(--vibeui-hero-029-i) * 70ms)}
[data-vibeui-block="hero-029"] [data-part="w"][data-outline="true"] i{color:transparent;-webkit-text-stroke:.03em var(--vibeui-hero-029-accent);paint-order:stroke fill;transition:color .3s}
[data-vibeui-block="hero-029"] [data-part="title"]:hover [data-part="w"][data-outline="true"] i{color:var(--vibeui-hero-029-accent)}
[data-vibeui-block="hero-029"] [data-part="guest"]{margin:1.1rem 0 0;font-size:1.15rem;font-weight:500;animation:vibeui-hero-029-up .8s var(--vibeui-hero-029-ease) .45s both}
[data-vibeui-block="hero-029"] [data-part="lede"]{margin:.6rem 0 0;max-width:34rem;color:var(--vibeui-hero-029-muted);animation:vibeui-hero-029-up .8s var(--vibeui-hero-029-ease) .55s both}
[data-vibeui-block="hero-029"] [data-part="player"]{margin-top:1.8rem;display:grid;grid-template-columns:auto 1fr;gap:1.2rem;align-items:center;animation:vibeui-hero-029-up .8s var(--vibeui-hero-029-ease) .65s both}
[data-vibeui-block="hero-029"] [data-part="play"]{position:relative;width:4.5rem;height:4.5rem;border-radius:50%;border:0;background:var(--vibeui-hero-029-accent);color:var(--vibeui-hero-029-on-accent);display:grid;place-items:center;cursor:pointer;box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-hero-029-accent) 40%,transparent),0 20px 40px -20px var(--vibeui-hero-029-accent);translate:var(--vibeui-hero-029-mx,0) var(--vibeui-hero-029-my,0);transition:translate .3s var(--vibeui-hero-029-ease),scale .3s var(--vibeui-hero-029-ease),box-shadow .4s}
[data-vibeui-block="hero-029"] [data-part="play"]:hover{scale:1.06}
[data-vibeui-block="hero-029"] [data-part="play"]:active{scale:.96}
[data-vibeui-block="hero-029"][data-playing="true"] [data-part="play"]{box-shadow:0 0 0 12px color-mix(in oklab,var(--vibeui-hero-029-accent) 18%,transparent),0 20px 50px -16px var(--vibeui-hero-029-accent)}
[data-vibeui-block="hero-029"][data-playing="true"] [data-part="play"]::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:2px solid var(--vibeui-hero-029-accent);animation:vibeui-hero-029-ring 1.8s ease-out infinite}
[data-vibeui-block="hero-029"] [data-part="play"] svg{width:1.6rem;height:1.6rem;fill:currentColor}
[data-vibeui-block="hero-029"] [data-part="play"]:focus-visible,[data-vibeui-block="hero-029"] [data-part="chapter"]:focus-visible{outline:2px solid var(--vibeui-hero-029-accent);outline-offset:3px}
[data-vibeui-block="hero-029"] [data-part="wave"]{display:flex;align-items:center;gap:2px;height:3.5rem;cursor:pointer;border:0;background:none;padding:0;width:100%}
[data-vibeui-block="hero-029"] [data-part="wave"] i{flex:1;height:calc(var(--vibeui-hero-029-h) * 100%);min-height:3px;border-radius:2px;background:color-mix(in oklab,var(--vibeui-hero-029-fg) 22%,transparent);transition:background .2s,transform .5s var(--vibeui-hero-029-ease);animation:vibeui-hero-029-rise .8s var(--vibeui-hero-029-ease) both;animation-delay:calc(.5s + var(--vibeui-hero-029-i) * 12ms)}
[data-vibeui-block="hero-029"] [data-part="wave"]:hover i{background:color-mix(in oklab,var(--vibeui-hero-029-fg) 34%,transparent)}
[data-vibeui-block="hero-029"] [data-part="wave"] i[data-past="true"]{background:var(--vibeui-hero-029-accent);box-shadow:0 0 12px -2px var(--vibeui-hero-029-accent)}
[data-vibeui-block="hero-029"][data-live="true"] [data-part="wave"] i{animation:vibeui-hero-029-wave 1.1s ease-in-out infinite alternate;animation-delay:calc(var(--vibeui-hero-029-i) * -.07s)}
[data-vibeui-block="hero-029"][data-live="true"][data-playing="false"] [data-part="wave"] i{animation-duration:1.6s;opacity:.7}
[data-vibeui-block="hero-029"] [data-part="time"]{display:flex;justify-content:space-between;font-family:var(--vibeui-hero-029-mono);font-size:.78rem;color:var(--vibeui-hero-029-muted);margin-top:.4rem;font-variant-numeric:tabular-nums}
[data-vibeui-block="hero-029"] [data-part="chapters"]{margin:1.6rem 0 0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:.5rem}
[data-vibeui-block="hero-029"] [data-part="chapters"] li{animation:vibeui-hero-029-up .7s var(--vibeui-hero-029-ease) both;animation-delay:calc(.8s + var(--vibeui-hero-029-i) * 60ms)}
[data-vibeui-block="hero-029"] [data-part="chapters"] li:first-child{width:100%;font-family:var(--vibeui-hero-029-mono);font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-hero-029-muted)}
[data-vibeui-block="hero-029"] [data-part="chapter"]{display:inline-flex;align-items:center;gap:.5rem;padding:.5rem .8rem;border-radius:999px;border:1px solid var(--vibeui-hero-029-line);background:var(--vibeui-hero-029-panel);color:inherit;font:inherit;font-size:.85rem;cursor:pointer;transition:border-color .25s,background .25s,translate .3s var(--vibeui-hero-029-ease)}
[data-vibeui-block="hero-029"] [data-part="chapter"]:hover{translate:0 -2px}
[data-vibeui-block="hero-029"] [data-part="chapter"]:hover,[data-vibeui-block="hero-029"] [data-part="chapter"][data-active="true"]{border-color:var(--vibeui-hero-029-accent);background:color-mix(in oklab,var(--vibeui-hero-029-accent) 14%,transparent)}
[data-vibeui-block="hero-029"] [data-part="chapter"] span{font-family:var(--vibeui-hero-029-mono);font-size:.72rem;color:var(--vibeui-hero-029-accent)}
@keyframes vibeui-hero-029-wave{from{transform:scaleY(.5)}to{transform:scaleY(1.15)}}
@keyframes vibeui-hero-029-rise{from{transform:scaleY(0)}}
@keyframes vibeui-hero-029-blink{50%{opacity:.2}}
@keyframes vibeui-hero-029-ping{to{box-shadow:0 0 0 .5rem transparent}}
@keyframes vibeui-hero-029-ring{to{scale:1.55;opacity:0}}
@keyframes vibeui-hero-029-word{from{translate:0 110%;rotate:4deg}}
@keyframes vibeui-hero-029-up{from{opacity:0;translate:0 1.2rem}}
@keyframes vibeui-hero-029-breathe{50%{opacity:.6}}
@keyframes vibeui-hero-029-drift{to{translate:12% 10%;scale:1.15}}
@container (min-width: 60rem){[data-vibeui-block="hero-029"] [data-part="shell"]{grid-template-columns:24rem minmax(0,1fr);gap:4rem;padding:5rem 2rem 4.5rem}[data-vibeui-block="hero-029"] [data-part="stage"]{width:24rem;margin:0}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-029"] *,[data-vibeui-block="hero-029"]::before,[data-vibeui-block="hero-029"]::after{animation:none!important;transition:none!important}[data-vibeui-block="hero-029"] [data-part="cover"]{transform:none!important}}`

const BARS = 64
// Округление до сотых: Math.sin в Node и в браузере расходится в последних битах, и гидрация ловила бы расхождение.
const heightAt = (i: number) => Math.round((0.25 + (Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1) * 0.75) * 100) / 100
const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`
const clampUnit = (n: number) => Math.max(-1, Math.min(1, n))

type PlayerState = { id?: string | null; playing?: boolean; elapsed?: number }

/** Первый экран подкаста с плеером эпизода недели и живой волной. */
export function Hero029({
  eyebrow = "Эпизод недели",
  number = "№ 112",
  title = "Человек, который зажигает маяк",
  outline,
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
  seekLabel = "Перемотать",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero029Props) {
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  // Мини-плеер на странице подтвердил трек: он ведёт время, хиро только слушает.
  const [linked, setLinked] = useState(false)
  const [external, setExternal] = useState(false)
  const wave = useRef<HTMLButtonElement>(null)
  const trackId = `hero-029:${number}`

  const words = useMemo(() => {
    const list = title.split(/\s+/).filter(Boolean)
    const target = outline?.trim().toLowerCase()
    const index = target ? list.findIndex((word) => word.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "") === target.replace(/[^\p{L}\p{N}]/gu, "")) : -1
    return list.map((word, i) => ({ word, outline: index >= 0 ? i === index : i === list.length - 1 }))
  }, [title, outline])

  useEffect(() => {
    const onState = (event: Event) => {
      const detail = (event as CustomEvent<PlayerState>).detail
      if (!detail) return
      if (detail.id === trackId) {
        setLinked(true)
        setExternal(false)
        setPlaying(Boolean(detail.playing))
        setElapsed(detail.elapsed ?? 0)
        return
      }
      setExternal(Boolean(detail.playing && detail.id))
      setPlaying(false)
      setLinked(false)
    }
    window.addEventListener("vibeui-player:state", onState)
    return () => window.removeEventListener("vibeui-player:state", onState)
  }, [trackId])

  useEffect(() => {
    if (!playing || linked) return
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
  }, [playing, linked, duration])

  const control = (action: "play" | "pause" | "seek", at?: number) => {
    window.dispatchEvent(new CustomEvent("vibeui-player:control", { detail: { id: trackId, action, elapsed: at } }))
  }

  const toggle = () => {
    if (playing) {
      setPlaying(false)
      if (linked) control("pause")
      return
    }
    setPlaying(true)
    if (linked) {
      control("play")
      return
    }
    window.dispatchEvent(new CustomEvent("vibeui-player:play", { detail: { id: trackId, title, number: number.replace(/^№\s*/, ""), guest, cover, duration, elapsed } }))
  }

  const jump = (at: number, start: boolean) => {
    setElapsed(at)
    if (start) setPlaying(true)
    if (linked) {
      control("seek", at)
      if (start) control("play")
    } else if (start) {
      window.dispatchEvent(new CustomEvent("vibeui-player:play", { detail: { id: trackId, title, number: number.replace(/^№\s*/, ""), guest, cover, duration, elapsed: at } }))
    }
  }

  const seek = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = wave.current?.getBoundingClientRect()
    if (!rect) return
    jump(Math.round(((event.clientX - rect.left) / rect.width) * duration), false)
  }

  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty("--vibeui-hero-029-tx", clampUnit(((event.clientX - rect.left) / rect.width) * 2 - 1).toFixed(2))
    event.currentTarget.style.setProperty("--vibeui-hero-029-ty", clampUnit(((event.clientY - rect.top) / rect.height) * 2 - 1).toFixed(2))
  }
  const untilt = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--vibeui-hero-029-tx", "0")
    event.currentTarget.style.setProperty("--vibeui-hero-029-ty", "0")
  }
  const magnet = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "touch") return
    const rect = event.currentTarget.getBoundingClientRect()
    const dx = clampUnit(((event.clientX - rect.left) / rect.width) * 2 - 1) * 7
    const dy = clampUnit(((event.clientY - rect.top) / rect.height) * 2 - 1) * 7
    event.currentTarget.style.setProperty("--vibeui-hero-029-mx", `${dx.toFixed(1)}px`)
    event.currentTarget.style.setProperty("--vibeui-hero-029-my", `${dy.toFixed(1)}px`)
  }
  const unmagnet = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.style.setProperty("--vibeui-hero-029-mx", "0px")
    event.currentTarget.style.setProperty("--vibeui-hero-029-my", "0px")
  }

  const progress = elapsed / duration
  const current = [...chapters].reverse().find((chapter) => chapter.at <= elapsed)
  const live = playing || external

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
      <section data-vibeui-block="hero-029" data-tone={tone === "auto" ? undefined : tone} data-playing={playing} data-live={live} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="stage" onPointerMove={tilt} onPointerLeave={untilt}>
            <div data-part="glow" aria-hidden="true">
              {cover ? <img src={cover} alt="" /> : null}
            </div>
            <div data-part="cover">
              {cover ? <img src={cover} alt={coverAlt} /> : null}
              <span data-part="rec" aria-hidden="true">
                <i />
                {live ? "on air" : number}
              </span>
            </div>
          </div>
          <div>
            {eyebrow ? (
              <p data-part="eyebrow">
                {eyebrow} · {number}
              </p>
            ) : null}
            <h1 data-part="title">
              {words.map((item, i) => (
                <Fragment key={`${item.word}-${i}`}>
                  <span data-part="w" data-outline={item.outline} style={{ ["--vibeui-hero-029-i" as string]: i }}>
                    <i>{item.word}</i>
                  </span>
                  {i < words.length - 1 ? " " : null}
                </Fragment>
              ))}
            </h1>
            {guest ? <p data-part="guest">{guest}</p> : null}
            {lede ? <p data-part="lede">{lede}</p> : null}
            <div data-part="player">
              <button type="button" data-part="play" aria-label={playing ? pauseLabel : playLabel} aria-pressed={playing} onClick={toggle} onPointerMove={magnet} onPointerLeave={unmagnet}>
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
                <button ref={wave} type="button" data-part="wave" aria-label={seekLabel} onClick={seek}>
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
                <li style={{ ["--vibeui-hero-029-i" as string]: 0 }}>{chaptersLabel}</li>
                {chapters.map((chapter, i) => (
                  <li key={chapter.at} style={{ ["--vibeui-hero-029-i" as string]: i + 1 }}>
                    <button type="button" data-part="chapter" data-active={current === chapter} onClick={() => jump(chapter.at, true)}>
                      <span>{clock(chapter.at)}</span>
                      {chapter.title}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            {allLabel ? (
              <Button077 data-part="all" label={allLabel} href={allHref} accent={accent} />
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}

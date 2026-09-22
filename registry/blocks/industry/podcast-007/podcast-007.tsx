"use client"

import { useEffect, useState, type CSSProperties, type MouseEvent } from "react"
import { Button099 } from "@/registry/components/button/button-099/button-099"

export type Podcast007Track = {
  id: string
  title: string
  number?: string
  guest?: string
  cover?: string
  /** Длительность в секундах. */
  duration: number
  /** С какой секунды начать; пусто — с нуля. */
  elapsed?: number
}

export type Podcast007Props = {
  /** Трек по умолчанию — плеер покажется сразу; пусто — появится по событию. */
  initial?: Podcast007Track
  playLabel?: string
  pauseLabel?: string
  closeLabel?: string
  /** Прижат к низу окна (по умолчанию). false — обычный блок в потоке, для витрины и превью. */
  docked?: boolean
  /** aria плеера и перемотки. */
  regionLabel?: string
  seekLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Мини-плеер: липкая полоса у нижнего края, выпрыгивает снизу с пружиной,
// когда любой блок шлёт `vibeui-player:play` с треком (лента эпизодов
// podcast-004, хиро hero-029). Обложка, номер и название, play/pause, полоса
// прогресса с перемоткой по клику и «искрой» на конце — светящейся точкой,
// которая пульсирует, пока идёт время; таймкод; закрыть. Под полосой при
// воспроизведении разливается свечение акцента. Каждую секунду и на каждом
// действии рассылает `vibeui-player:state` — по нему лента подсвечивает
// текущий эпизод, хиро ведёт волну, а шапка показывает «сейчас играет».
// Понимает `vibeui-player:control` {id, action: play|pause|seek, elapsed} —
// так другой блок управляет своим треком. Звука нет: подключить <audio> —
// дело одного ref.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Sofia+Sans+Extra+Condensed:wght@700&family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="podcast-007"]){
--vibeui-podcast-007-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-podcast-007-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-podcast-007-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-podcast-007-on-accent:oklch(from var(--vibeui-podcast-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-podcast-007-muted:color-mix(in oklab,var(--vibeui-podcast-007-fg) 60%,var(--vibeui-podcast-007-bg));
--vibeui-podcast-007-line:color-mix(in oklab,var(--vibeui-podcast-007-fg) 12%,transparent);
--vibeui-podcast-007-display:"Sofia Sans Extra Condensed",Impact,"Arial Narrow",sans-serif;
--vibeui-podcast-007-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-podcast-007-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-podcast-007-spring:cubic-bezier(.34,1.56,.64,1);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="podcast-007"]{color-scheme:dark}
:where([data-vibeui-block="podcast-007"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="podcast-007"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="podcast-007"]{box-sizing:border-box;position:fixed;left:50%;bottom:1rem;z-index:60;width:min(56rem,100% - 2rem);transform:translate(-50%,calc(100% + 2rem)) scale(.92);transition:transform .45s cubic-bezier(.4,0,.8,.4);font-family:var(--vibeui-podcast-007-font);color:var(--vibeui-podcast-007-fg);font-size:.95rem;line-height:1.3}
[data-vibeui-block="podcast-007"][data-open="true"]{transform:translate(-50%,0) scale(1);transition:transform .7s var(--vibeui-podcast-007-spring)}
[data-vibeui-block="podcast-007"][data-docked="false"]{position:relative;left:auto;bottom:auto;width:100%;transform:none;padding:1rem}
[data-vibeui-block="podcast-007"] *{box-sizing:border-box}
[data-vibeui-block="podcast-007"] [data-part="play"]{width:2.8rem}
[data-vibeui-block="podcast-007"] [data-part="halo"]{position:absolute;inset:-40% -10% -60%;border-radius:50%;background:radial-gradient(ellipse at 50% 100%,color-mix(in oklab,var(--vibeui-podcast-007-accent) 45%,transparent),transparent 65%);filter:blur(30px);opacity:0;transition:opacity .8s;pointer-events:none;z-index:-1}
[data-vibeui-block="podcast-007"][data-playing="true"] [data-part="halo"]{opacity:1;animation:vibeui-podcast-007-breathe 2.6s ease-in-out infinite}
[data-vibeui-block="podcast-007"] [data-part="bar"]{position:relative;display:grid;grid-template-columns:auto auto 1fr auto;gap:.9rem;align-items:center;padding:.6rem .8rem .6rem .6rem;border-radius:1.2rem;background:color-mix(in oklab,var(--vibeui-podcast-007-bg) 86%,transparent);backdrop-filter:blur(18px) saturate(1.4);box-shadow:0 30px 60px -30px rgb(0 0 0 / .7),0 0 0 1px var(--vibeui-podcast-007-line),0 0 0 0 color-mix(in oklab,var(--vibeui-podcast-007-accent) 30%,transparent);transition:box-shadow .5s}
[data-vibeui-block="podcast-007"][data-playing="true"] [data-part="bar"]{box-shadow:0 30px 60px -30px rgb(0 0 0 / .7),0 0 0 1px color-mix(in oklab,var(--vibeui-podcast-007-accent) 40%,var(--vibeui-podcast-007-line)),0 20px 60px -20px color-mix(in oklab,var(--vibeui-podcast-007-accent) 40%,transparent)}
[data-vibeui-block="podcast-007"] [data-part="bar"]::before{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(120deg,transparent 30%,rgb(255 255 255 / .06) 45%,transparent 60%);pointer-events:none}
[data-vibeui-block="podcast-007"] [data-part="cover"]{position:relative;width:3.2rem;height:3.2rem;border-radius:.7rem;overflow:hidden;background:var(--vibeui-podcast-007-line);transition:transform .4s var(--vibeui-podcast-007-spring)}
[data-vibeui-block="podcast-007"][data-playing="true"] [data-part="cover"]{transform:rotate(-4deg) scale(1.06)}
[data-vibeui-block="podcast-007"] [data-part="cover"] img{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="podcast-007"] [data-part="eq"]{position:absolute;left:.4rem;bottom:.4rem;display:flex;align-items:flex-end;gap:2px;height:.7rem;opacity:0;transition:opacity .3s}
[data-vibeui-block="podcast-007"][data-playing="true"] [data-part="eq"]{opacity:1}
[data-vibeui-block="podcast-007"] [data-part="eq"] i{width:3px;height:30%;border-radius:1px;background:var(--vibeui-podcast-007-accent);box-shadow:0 0 6px var(--vibeui-podcast-007-accent)}
[data-vibeui-block="podcast-007"][data-playing="true"] [data-part="eq"] i{animation:vibeui-podcast-007-eq .7s ease-in-out infinite alternate}
[data-vibeui-block="podcast-007"] [data-part="eq"] i:nth-child(2){animation-delay:-.25s}
[data-vibeui-block="podcast-007"] [data-part="eq"] i:nth-child(3){animation-delay:-.45s}
[data-vibeui-block="podcast-007"] [data-part="info"]{min-width:0}
[data-vibeui-block="podcast-007"] [data-part="name"]{font-family:var(--vibeui-podcast-007-display);font-weight:700;font-size:1.15rem;text-transform:uppercase;line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
[data-vibeui-block="podcast-007"] [data-part="sub"]{font-size:.78rem;color:var(--vibeui-podcast-007-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:.15rem}
[data-vibeui-block="podcast-007"] [data-part="track"]{position:relative;height:.4rem;margin-top:.5rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-podcast-007-fg) 12%,transparent);cursor:pointer;border:0;padding:0;width:100%;display:block;overflow:visible}
[data-vibeui-block="podcast-007"] [data-part="track"]::before{content:"";position:absolute;inset:0;width:calc(var(--vibeui-podcast-007-p) * 100%);border-radius:999px;background:linear-gradient(90deg,color-mix(in oklab,var(--vibeui-podcast-007-accent) 55%,transparent),var(--vibeui-podcast-007-accent));transition:width .3s linear}
[data-vibeui-block="podcast-007"] [data-part="spark"]{position:absolute;top:50%;left:calc(var(--vibeui-podcast-007-p) * 100%);width:.9rem;height:.9rem;margin:-.45rem 0 0 -.45rem;border-radius:50%;background:var(--vibeui-podcast-007-accent);box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-podcast-007-accent) 25%,transparent),0 0 16px 2px var(--vibeui-podcast-007-accent);pointer-events:none;transition:left .3s linear,transform .3s var(--vibeui-podcast-007-spring)}
[data-vibeui-block="podcast-007"] [data-part="spark"]::after{content:"";position:absolute;inset:-.6rem;border-radius:50%;border:1px solid var(--vibeui-podcast-007-accent);opacity:0}
[data-vibeui-block="podcast-007"][data-playing="true"] [data-part="spark"]{animation:vibeui-podcast-007-spark 1s ease-in-out infinite}
[data-vibeui-block="podcast-007"][data-playing="true"] [data-part="spark"]::after{animation:vibeui-podcast-007-ping 1.4s ease-out infinite}
[data-vibeui-block="podcast-007"] [data-part="track"]:hover [data-part="spark"]{transform:scale(1.3)}
[data-vibeui-block="podcast-007"] [data-part="time"]{font-family:var(--vibeui-podcast-007-mono);font-size:.72rem;color:var(--vibeui-podcast-007-muted);font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="podcast-007"] [data-part="side"]{display:grid;gap:.4rem;justify-items:end}
[data-vibeui-block="podcast-007"] [data-part="close"]{width:2rem;height:2rem;border-radius:50%;border:1px solid var(--vibeui-podcast-007-line);background:none;color:inherit;font-size:1rem;line-height:1;cursor:pointer;transition:transform .3s var(--vibeui-podcast-007-spring),background .2s}
[data-vibeui-block="podcast-007"] [data-part="close"]:hover{transform:rotate(90deg);background:color-mix(in oklab,var(--vibeui-podcast-007-fg) 8%,transparent)}
[data-vibeui-block="podcast-007"] button:focus-visible{outline:2px solid var(--vibeui-podcast-007-accent);outline-offset:2px}
@keyframes vibeui-podcast-007-spark{50%{box-shadow:0 0 0 5px color-mix(in oklab,var(--vibeui-podcast-007-accent) 18%,transparent),0 0 24px 4px var(--vibeui-podcast-007-accent)}}
@keyframes vibeui-podcast-007-ping{from{opacity:.8;transform:scale(.4)}to{opacity:0;transform:scale(1.4)}}
@keyframes vibeui-podcast-007-eq{from{height:25%}to{height:100%}}
@keyframes vibeui-podcast-007-breathe{50%{opacity:.55}}
@media (max-width: 40rem){[data-vibeui-block="podcast-007"] [data-part="time"]{display:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="podcast-007"] *{transition:none!important;animation:none!important}[data-vibeui-block="podcast-007"]{transition:none!important}}`

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`

type Control = { id?: string; action?: "play" | "pause" | "seek"; elapsed?: number }

/** Мини-плеер у нижнего края: появляется по событию, рассылает состояние. */
export function Podcast007({ initial, playLabel = "Слушать", pauseLabel = "Пауза", closeLabel = "Закрыть", regionLabel = "Плеер", seekLabel = "Перемотать", docked = true, tone = "auto", accent, ink, background, className, style }: Podcast007Props) {
  const [track, setTrack] = useState<Podcast007Track | null>(initial ?? null)
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(initial?.elapsed ?? 0)

  useEffect(() => {
    const onPlay = (event: Event) => {
      const detail = (event as CustomEvent<Podcast007Track>).detail
      if (!detail?.id) return
      setTrack(detail)
      setElapsed(Math.max(0, Math.min(detail.duration, detail.elapsed ?? 0)))
      setPlaying(true)
    }
    window.addEventListener("vibeui-player:play", onPlay)
    return () => window.removeEventListener("vibeui-player:play", onPlay)
  }, [])

  useEffect(() => {
    const onControl = (event: Event) => {
      const detail = (event as CustomEvent<Control>).detail
      if (!detail?.id || !track || track.id !== detail.id) return
      if (detail.action === "play") setPlaying(true)
      if (detail.action === "pause") setPlaying(false)
      if (detail.action === "seek" && typeof detail.elapsed === "number") setElapsed(Math.max(0, Math.min(track.duration, Math.round(detail.elapsed))))
    }
    window.addEventListener("vibeui-player:control", onControl)
    return () => window.removeEventListener("vibeui-player:control", onControl)
  }, [track])

  useEffect(() => {
    if (!playing || !track) return
    const timer = window.setInterval(() => setElapsed((current) => Math.min(track.duration, current + 1)), 1000)
    return () => window.clearInterval(timer)
  }, [playing, track])

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("vibeui-player:state", { detail: { id: track?.id ?? null, title: track?.title ?? null, playing: playing && Boolean(track), elapsed } }))
  }, [track, playing, elapsed])

  const seek = (event: MouseEvent<HTMLButtonElement>) => {
    if (!track) return
    const rect = event.currentTarget.getBoundingClientRect()
    setElapsed(Math.round(((event.clientX - rect.left) / rect.width) * track.duration))
  }

  const palette = {
    "--vibeui-podcast-007-p": track ? elapsed / track.duration : 0,
    ...(accent ? { "--vibeui-podcast-007-accent": accent } : null),
    ...(ink ? { "--vibeui-podcast-007-fg": ink } : null),
    ...(background ? { "--vibeui-podcast-007-bg": background } : null),
    ...style,
  } as CSSProperties

  const active = playing && Boolean(track)

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-podcast-007" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="podcast-007" data-tone={tone === "auto" ? undefined : tone} data-open={Boolean(track)} data-playing={active} data-docked={docked} className={className} style={palette} role="region" aria-label={regionLabel}>
        <div data-part="halo" aria-hidden="true" />
        <div data-part="bar">
          <div data-part="cover">
            {track?.cover ? <img src={track.cover} alt="" /> : null}
            <span data-part="eq" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </div>
          <Button099 data-part="play" pauseLabel={pauseLabel} playLabel={playLabel} playing={playing} onClick={() => setPlaying((value) => !value)} accent={accent} />
          <div data-part="info">
            <div data-part="name">{track?.title ?? ""}</div>
            <div data-part="sub">
              {track?.number ? `№ ${track.number}` : ""}
              {track?.guest ? ` · ${track.guest}` : ""}
            </div>
            <button type="button" data-part="track" aria-label={seekLabel} onClick={seek}>
              <span data-part="spark" aria-hidden="true" />
            </button>
          </div>
          <div data-part="side">
            <button type="button" data-part="close" aria-label={closeLabel} onClick={() => { setPlaying(false); setTrack(null) }}>
              ×
            </button>
            <span data-part="time">
              {clock(elapsed)} / {clock(track?.duration ?? 0)}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

"use client"

import { useEffect, useState, type CSSProperties, type MouseEvent } from "react"

export type Podcast007Track = {
  id: string
  title: string
  number?: string
  guest?: string
  cover?: string
  /** Длительность в секундах. */
  duration: number
}

export type Podcast007Props = {
  /** Трек по умолчанию — плеер покажется сразу; пусто — появится по событию. */
  initial?: Podcast007Track
  playLabel?: string
  pauseLabel?: string
  closeLabel?: string
  /** Прижат к низу окна (по умолчанию). false — обычный блок в потоке, для витрины и превью. */
  docked?: boolean
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Мини-плеер: липкая полоса у нижнего края, выезжает снизу, когда любой блок
// шлёт `vibeui-player:play` с треком (лента эпизодов podcast-004). Обложка,
// номер и название, play/pause, полоса прогресса с перемоткой по клику,
// таймкод, закрыть. Каждую секунду и на каждом действии рассылает
// `vibeui-player:state` — по нему лента подсвечивает текущий эпизод, а шапка
// показывает «сейчас играет». Звука нет: подключить <audio> — дело одного ref.
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
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="podcast-007"]{color-scheme:dark}
:where([data-vibeui-block="podcast-007"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="podcast-007"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="podcast-007"]{box-sizing:border-box;position:fixed;left:50%;bottom:1rem;z-index:60;width:min(56rem,100% - 2rem);transform:translate(-50%,calc(100% + 2rem));transition:transform .5s cubic-bezier(.2,.8,.2,1);font-family:var(--vibeui-podcast-007-font);color:var(--vibeui-podcast-007-fg);font-size:.95rem;line-height:1.3}
[data-vibeui-block="podcast-007"][data-open="true"]{transform:translate(-50%,0)}
[data-vibeui-block="podcast-007"][data-docked="false"]{position:relative;left:auto;bottom:auto;width:100%;transform:none;padding:1rem}
[data-vibeui-block="podcast-007"] *{box-sizing:border-box}
[data-vibeui-block="podcast-007"] [data-part="bar"]{display:grid;grid-template-columns:auto auto 1fr auto;gap:.9rem;align-items:center;padding:.6rem .8rem .6rem .6rem;border-radius:1.2rem;background:color-mix(in oklab,var(--vibeui-podcast-007-bg) 88%,transparent);backdrop-filter:blur(16px) saturate(1.3);box-shadow:0 30px 60px -30px rgb(0 0 0 / .7),0 0 0 1px var(--vibeui-podcast-007-line)}
[data-vibeui-block="podcast-007"] [data-part="cover"]{width:3.2rem;height:3.2rem;border-radius:.7rem;overflow:hidden;background:var(--vibeui-podcast-007-line)}
[data-vibeui-block="podcast-007"] [data-part="cover"] img{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="podcast-007"] [data-part="play"]{width:2.8rem;height:2.8rem;border-radius:50%;border:0;background:var(--vibeui-podcast-007-accent);color:var(--vibeui-podcast-007-on-accent);display:grid;place-items:center;cursor:pointer;transition:transform .18s}
[data-vibeui-block="podcast-007"] [data-part="play"]:hover{transform:scale(1.06)}
[data-vibeui-block="podcast-007"] [data-part="play"] svg{width:1.1rem;height:1.1rem;fill:currentColor}
[data-vibeui-block="podcast-007"] [data-part="info"]{min-width:0}
[data-vibeui-block="podcast-007"] [data-part="name"]{font-family:var(--vibeui-podcast-007-display);font-weight:700;font-size:1.15rem;text-transform:uppercase;line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
[data-vibeui-block="podcast-007"] [data-part="sub"]{font-size:.78rem;color:var(--vibeui-podcast-007-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:.15rem}
[data-vibeui-block="podcast-007"] [data-part="track"]{position:relative;height:.4rem;margin-top:.45rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-podcast-007-fg) 12%,transparent);cursor:pointer;border:0;padding:0;width:100%;display:block}
[data-vibeui-block="podcast-007"] [data-part="track"]::before{content:"";position:absolute;inset:0;width:calc(var(--vibeui-podcast-007-p) * 100%);border-radius:999px;background:var(--vibeui-podcast-007-accent)}
[data-vibeui-block="podcast-007"] [data-part="time"]{font-family:var(--vibeui-podcast-007-mono);font-size:.72rem;color:var(--vibeui-podcast-007-muted);font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="podcast-007"] [data-part="side"]{display:grid;gap:.4rem;justify-items:end}
[data-vibeui-block="podcast-007"] [data-part="close"]{width:2rem;height:2rem;border-radius:50%;border:1px solid var(--vibeui-podcast-007-line);background:none;color:inherit;font-size:1rem;line-height:1;cursor:pointer}
[data-vibeui-block="podcast-007"] button:focus-visible{outline:2px solid var(--vibeui-podcast-007-accent);outline-offset:2px}
@media (max-width: 40rem){[data-vibeui-block="podcast-007"] [data-part="time"]{display:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="podcast-007"] *{transition:none!important}}`

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`

/** Мини-плеер у нижнего края: появляется по событию, рассылает состояние. */
export function Podcast007({ initial, playLabel = "Слушать", pauseLabel = "Пауза", closeLabel = "Закрыть", docked = true, tone = "auto", accent, ink, background, className, style }: Podcast007Props) {
  const [track, setTrack] = useState<Podcast007Track | null>(initial ?? null)
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const onPlay = (event: Event) => {
      const detail = (event as CustomEvent<Podcast007Track>).detail
      if (!detail?.id) return
      setTrack(detail)
      setElapsed(0)
      setPlaying(true)
    }
    window.addEventListener("vibeui-player:play", onPlay)
    return () => window.removeEventListener("vibeui-player:play", onPlay)
  }, [])

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

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-podcast-007" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="podcast-007" data-tone={tone === "auto" ? undefined : tone} data-open={Boolean(track)} data-docked={docked} className={className} style={palette} role="region" aria-label="Плеер">
        <div data-part="bar">
          <div data-part="cover">{track?.cover ? <img src={track.cover} alt="" /> : null}</div>
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
          <div data-part="info">
            <div data-part="name">{track?.title ?? ""}</div>
            <div data-part="sub">
              {track?.number ? `№ ${track.number}` : ""}
              {track?.guest ? ` · ${track.guest}` : ""}
            </div>
            <button type="button" data-part="track" aria-label="Перемотать" onClick={seek} />
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

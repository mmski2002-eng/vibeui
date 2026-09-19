"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"

export type App002Props = {
  eyebrow?: string
  title?: string
  lede?: string
  beforeLabel?: string
  afterLabel?: string
  /** Часы сна по дням недели до и после — семь чисел. */
  before?: readonly number[]
  after?: readonly number[]
  days?: readonly string[]
  /** Подписи под графиком: среднее до / после, засыпание. */
  beforeNote?: string
  afterNote?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «До / после» с ползунком сравнения: два графика сна за неделю лежат друг
// на друге, верхний обрезан clip-path по положению ползунка, который тянут
// мышью или пальцем (pointer events, доля ширины в состоянии) — после
// отпускания он докатывается по инерции (скорость гасится в rAF). Когда блок
// попадает в окно, столбики вырастают, линии среднего прочерчиваются
// (stroke-dashoffset), цифры среднего докручиваются от нуля, а ползунок сам
// проезжает к середине как подсказка. Заголовок въезжает через маску.
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="app-002"]){
--vibeui-app-002-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-app-002-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-app-002-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-app-002-on-accent:oklch(from var(--vibeui-app-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-app-002-muted:color-mix(in oklab,var(--vibeui-app-002-fg) 60%,var(--vibeui-app-002-bg));
--vibeui-app-002-line:color-mix(in oklab,var(--vibeui-app-002-fg) 12%,transparent);
--vibeui-app-002-panel:color-mix(in oklab,var(--vibeui-app-002-fg) 5%,var(--vibeui-app-002-bg));
--vibeui-app-002-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-app-002-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-app-002-p:0.5;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="app-002"]{color-scheme:dark}
:where([data-vibeui-block="app-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="app-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="app-002"]{box-sizing:border-box;position:relative;overflow:hidden;padding:5rem 0;background:var(--vibeui-app-002-bg);color:var(--vibeui-app-002-fg);font-family:var(--vibeui-app-002-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="app-002"] *{box-sizing:border-box}
[data-vibeui-block="app-002"] [data-part="mesh"]{position:absolute;inset:0;pointer-events:none}
[data-vibeui-block="app-002"] [data-part="mesh"] i{position:absolute;border-radius:50%;filter:blur(50px);opacity:.45;animation:vibeui-app-002-float 20s ease-in-out infinite alternate}
[data-vibeui-block="app-002"] [data-part="mesh"] i:nth-child(1){left:-10%;top:-20%;width:42%;aspect-ratio:1;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-app-002-accent) 30%,transparent),transparent 65%)}
[data-vibeui-block="app-002"] [data-part="mesh"] i:nth-child(2){right:-12%;bottom:-25%;width:40%;aspect-ratio:1;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-app-002-accent) 20%,#8fd6ff),transparent 65%);animation-delay:-10s}
[data-vibeui-block="app-002"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem;align-items:center}
[data-vibeui-block="app-002"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.8rem;font-weight:600;color:var(--vibeui-app-002-accent)}
[data-vibeui-block="app-002"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2.2rem,5.6cqi,4rem);line-height:1.02;letter-spacing:-.035em}
[data-vibeui-block="app-002"] [data-part="w"]{display:inline-block;overflow:hidden;vertical-align:bottom;padding:.06em .04em .12em 0;margin:-.06em 0 -.12em}
[data-vibeui-block="app-002"] [data-part="w"] span{display:inline-block;transition:transform 1s cubic-bezier(.2,.8,.2,1);transition-delay:calc(var(--vibeui-app-002-i) * .06s)}
[data-vibeui-block="app-002"][data-motion="true"] [data-reveal]:not([data-in="true"]) [data-part="w"] span{transform:translateY(112%)}
[data-vibeui-block="app-002"] [data-part="lede"]{margin:1rem 0 0;max-width:28rem;color:var(--vibeui-app-002-muted)}
[data-vibeui-block="app-002"] [data-part="notes"]{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1.8rem}
[data-vibeui-block="app-002"] [data-part="notes"] div{padding:1.1rem 1.2rem;border-radius:1.1rem;background:var(--vibeui-app-002-panel);transition:opacity .3s,transform .3s}
[data-vibeui-block="app-002"][data-motion="true"] [data-part="notes"]:not([data-in="true"]) div{opacity:0}
[data-vibeui-block="app-002"] [data-part="notes"][data-in="true"] div{animation:vibeui-app-002-rise .8s cubic-bezier(.2,.8,.2,1) backwards}
[data-vibeui-block="app-002"] [data-part="notes"][data-in="true"] div:last-child{animation-delay:.12s}
[data-vibeui-block="app-002"] [data-part="notes"] div:first-child{opacity:calc(1 - var(--vibeui-app-002-p) * .6)}
[data-vibeui-block="app-002"] [data-part="notes"] div:last-child{opacity:calc(.4 + var(--vibeui-app-002-p) * .6);box-shadow:0 0 0 1px color-mix(in oklab,var(--vibeui-app-002-accent) 50%,transparent) inset,0 20px 40px -30px color-mix(in oklab,var(--vibeui-app-002-accent) 60%,transparent)}
[data-vibeui-block="app-002"] [data-part="notes"] small{display:block;font-family:var(--vibeui-app-002-mono);font-size:.68rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-app-002-muted)}
[data-vibeui-block="app-002"] [data-part="notes"] b{display:block;margin-top:.3rem;font-size:2rem;font-weight:800;letter-spacing:-.03em;line-height:1.1;font-variant-numeric:tabular-nums}
[data-vibeui-block="app-002"] [data-part="notes"] div:last-child b{color:var(--vibeui-app-002-accent)}
[data-vibeui-block="app-002"] [data-part="notes"] span{font-size:.82rem;color:var(--vibeui-app-002-muted)}
[data-vibeui-block="app-002"] [data-part="compare"]{position:relative;height:22rem;border-radius:1.6rem;background:var(--vibeui-app-002-panel);box-shadow:0 0 0 1px var(--vibeui-app-002-line),0 40px 80px -50px color-mix(in oklab,var(--vibeui-app-002-accent) 50%,transparent);overflow:hidden;user-select:none;-webkit-user-select:none;touch-action:pan-y;cursor:ew-resize;transition:opacity .8s,transform .9s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="app-002"][data-motion="true"] [data-part="compare"]:not([data-in="true"]){opacity:0;transform:translateY(2rem) scale(.98)}
[data-vibeui-block="app-002"] [data-part="chart"]{position:absolute;inset:0;display:flex;align-items:flex-end;gap:.6rem;padding:3rem 1.5rem 2.4rem}
[data-vibeui-block="app-002"] [data-part="chart"][data-side="after"]{clip-path:inset(0 0 0 calc(var(--vibeui-app-002-p) * 100%))}
[data-vibeui-block="app-002"] [data-part="chart"] i{flex:1;position:relative;height:calc(var(--vibeui-app-002-h) * 100%);border-radius:.5rem .5rem .2rem .2rem;background:color-mix(in oklab,var(--vibeui-app-002-fg) 22%,transparent);transform:scaleY(0);transform-origin:bottom;transition:transform .9s cubic-bezier(.2,.8,.2,1);transition-delay:calc(var(--vibeui-app-002-i) * .07s + .2s)}
[data-vibeui-block="app-002"] [data-part="compare"][data-in="true"] [data-part="chart"] i{transform:none}
[data-vibeui-block="app-002"] [data-part="chart"][data-side="after"] i{background:var(--vibeui-app-002-accent);box-shadow:0 0 24px -6px var(--vibeui-app-002-accent)}
[data-vibeui-block="app-002"] [data-part="chart"] i::after{content:attr(data-v);position:absolute;left:50%;top:-1.4rem;transform:translateX(-50%);font-family:var(--vibeui-app-002-mono);font-size:.68rem;color:var(--vibeui-app-002-muted)}
[data-vibeui-block="app-002"] [data-part="chart"][data-side="after"] i::after{color:var(--vibeui-app-002-accent)}
[data-vibeui-block="app-002"] [data-part="chart"] svg{position:absolute;left:1.5rem;right:1.5rem;top:3rem;bottom:2.4rem;width:calc(100% - 3rem);height:calc(100% - 5.4rem);overflow:visible;pointer-events:none}
[data-vibeui-block="app-002"] [data-part="chart"] svg path{fill:none;stroke:var(--vibeui-app-002-fg);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke;opacity:.55;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1.6s cubic-bezier(.2,.8,.2,1) .6s}
[data-vibeui-block="app-002"] [data-part="chart"][data-side="after"] svg path{stroke:var(--vibeui-app-002-accent);opacity:1;filter:drop-shadow(0 0 6px var(--vibeui-app-002-accent))}
[data-vibeui-block="app-002"] [data-part="chart"] svg circle{fill:var(--vibeui-app-002-bg);stroke:var(--vibeui-app-002-fg);stroke-width:2;vector-effect:non-scaling-stroke;opacity:0;transition:opacity .4s;transition-delay:calc(var(--vibeui-app-002-i) * .18s + .8s)}
[data-vibeui-block="app-002"] [data-part="chart"][data-side="after"] svg circle{stroke:var(--vibeui-app-002-accent)}
[data-vibeui-block="app-002"] [data-part="compare"][data-in="true"] svg path{stroke-dashoffset:0}
[data-vibeui-block="app-002"] [data-part="compare"][data-in="true"] svg circle{opacity:1}
[data-vibeui-block="app-002"] [data-part="days"]{position:absolute;left:1.5rem;right:1.5rem;bottom:.8rem;display:flex;gap:.6rem;font-family:var(--vibeui-app-002-mono);font-size:.68rem;color:var(--vibeui-app-002-muted)}
[data-vibeui-block="app-002"] [data-part="days"] span{flex:1;text-align:center}
[data-vibeui-block="app-002"] [data-part="tag"]{position:absolute;top:.9rem;padding:.3rem .6rem;border-radius:999px;font-size:.72rem;font-weight:600;background:var(--vibeui-app-002-bg);box-shadow:0 0 0 1px var(--vibeui-app-002-line)}
[data-vibeui-block="app-002"] [data-part="tag"][data-side="before"]{left:.9rem}
[data-vibeui-block="app-002"] [data-part="tag"][data-side="after"]{right:.9rem;background:var(--vibeui-app-002-accent);color:var(--vibeui-app-002-on-accent);box-shadow:none}
[data-vibeui-block="app-002"] [data-part="handle"]{position:absolute;top:0;bottom:0;left:calc(var(--vibeui-app-002-p) * 100%);width:2px;background:var(--vibeui-app-002-fg);transform:translateX(-50%)}
[data-vibeui-block="app-002"] [data-part="handle"] i{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:2.8rem;height:2.8rem;border-radius:50%;background:var(--vibeui-app-002-fg);color:var(--vibeui-app-002-bg);display:grid;place-items:center;font-size:.8rem;font-style:normal;letter-spacing:-.1em;box-shadow:0 8px 20px -8px rgb(0 0 0 / .6),0 0 0 6px color-mix(in oklab,var(--vibeui-app-002-fg) 12%,transparent);transition:box-shadow .3s}
[data-vibeui-block="app-002"] [data-part="compare"]:not([data-touched="true"]) [data-part="handle"] i{animation:vibeui-app-002-nudge 2.4s ease-in-out infinite}
[data-vibeui-block="app-002"] [data-part="compare"]:active [data-part="handle"] i{box-shadow:0 8px 20px -8px rgb(0 0 0 / .6),0 0 0 10px color-mix(in oklab,var(--vibeui-app-002-accent) 25%,transparent)}
[data-vibeui-block="app-002"] [data-part="range"]{position:absolute;inset:0;width:100%;height:100%;opacity:0;margin:0;cursor:ew-resize}
[data-vibeui-block="app-002"] [data-part="range"]:focus-visible + [data-part="handle"] i{outline:2px solid var(--vibeui-app-002-accent);outline-offset:3px}
@keyframes vibeui-app-002-rise{from{opacity:0;transform:translateY(1.5rem)}}
@keyframes vibeui-app-002-nudge{0%,100%{transform:translate(-50%,-50%)}50%{transform:translate(calc(-50% + 6px),-50%)}}
@keyframes vibeui-app-002-float{from{transform:translate(0,0)}to{transform:translate(8%,-10%)}}
@container (min-width: 60rem){[data-vibeui-block="app-002"] [data-part="shell"]{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:4rem}}
[data-vibeui-block="app-002"] [data-part="w"]:not(:last-child)::after{content:"\\00a0"}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="app-002"] *{animation:none!important;transition:none!important}[data-vibeui-block="app-002"] [data-part="compare"],[data-vibeui-block="app-002"] [data-part="notes"] div,[data-vibeui-block="app-002"] [data-part="w"] span,[data-vibeui-block="app-002"] [data-part="chart"] i{opacity:1!important;transform:none!important}[data-vibeui-block="app-002"] [data-part="notes"] div:first-child{opacity:calc(1 - var(--vibeui-app-002-p) * .6)!important}[data-vibeui-block="app-002"] [data-part="notes"] div:last-child{opacity:calc(.4 + var(--vibeui-app-002-p) * .6)!important}[data-vibeui-block="app-002"] svg path{stroke-dashoffset:0!important}[data-vibeui-block="app-002"] svg circle{opacity:1!important}}`

const avg = (list: readonly number[]) => list.reduce((a, b) => a + b, 0) / Math.max(1, list.length)

function Words({ text }: { text: string }) {
  return text.split(/\s+/).map((word, index) => (
    <span data-part="w" key={index} style={{ ["--vibeui-app-002-i" as string]: index }}>
      <span>{word}</span>
    </span>
  ))
}

function Line({ values, max }: { values: readonly number[]; max: number }) {
  const points = values.map((value, index) => [((index + 0.5) / values.length) * 100, 100 - (value / max) * 100] as const)
  const d = points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ")
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d={d} pathLength={1} />
      {points.map(([x, y], index) => (
        <circle key={index} cx={x} cy={y} r={1.2} style={{ ["--vibeui-app-002-i" as string]: index }} />
      ))}
    </svg>
  )
}

/** «До / после»: два графика сна и ползунок сравнения с инерцией. */
export function App002({
  eyebrow = "Результат",
  title = "Неделя до и неделя после",
  lede = "Данные восьмисот пользователей за первый месяц. Тяните ползунок — увидите разницу по дням.",
  beforeLabel = "до",
  afterLabel = "после",
  before = [5.4, 6.1, 5.8, 6.4, 5.2, 7.0, 6.6],
  after = [7.1, 7.4, 7.2, 7.6, 7.0, 8.1, 7.8],
  days = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"],
  beforeNote = "засыпали за 48 мин",
  afterNote = "засыпают за 12 мин",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: App002Props) {
  const root = useRef<HTMLElement>(null)
  const box = useRef<HTMLDivElement>(null)
  const notes = useRef<HTMLDivElement>(null)
  const drag = useRef({ x: 0, t: 0, v: 0, frame: 0, touched: false })
  const [p, setP] = useState(0.5)
  const [tick, setTick] = useState(0)
  const [touched, setTouched] = useState(false)
  const targets = [avg(before), avg(after)]
  const max = Math.max(...before, ...after, 1)

  useEffect(() => {
    const element = root.current
    if (!element) return
    element.dataset.motion = "true"
    const targetsInView = Array.from(element.querySelectorAll<HTMLElement>("[data-reveal]"))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          ;(entry.target as HTMLElement).dataset.in = "true"
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    )
    targetsInView.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const element = notes.current
    if (!element) return
    let frame = 0
    let start = 0
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        if (reduced) {
          setTick(1)
          return
        }
        const step = (now: number) => {
          if (!start) start = now
          const t = Math.min(1, (now - start) / 1600)
          const eased = 1 - Math.pow(1 - t, 3)
          setTick(eased)
          if (!drag.current.touched) setP(0.08 + eased * 0.42)
          if (t < 1) frame = window.requestAnimationFrame(step)
        }
        frame = window.requestAnimationFrame(step)
      },
      { threshold: 0.5 },
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const stopMomentum = () => {
    if (drag.current.frame) window.cancelAnimationFrame(drag.current.frame)
    drag.current.frame = 0
  }

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (event.buttons !== 1 && event.pointerType === "mouse") return
    const rect = box.current?.getBoundingClientRect()
    if (!rect) return
    const now = performance.now()
    const next = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
    const dt = now - drag.current.t
    if (dt > 0 && dt < 120) drag.current.v = (next - drag.current.x) / dt
    drag.current.x = next
    drag.current.t = now
    setP(next)
  }

  const down = (event: PointerEvent<HTMLDivElement>) => {
    stopMomentum()
    drag.current.v = 0
    event.currentTarget.setPointerCapture(event.pointerId)
    if (!drag.current.touched) {
      drag.current.touched = true
      setTouched(true)
    }
    move(event)
  }

  const release = () => {
    const stale = performance.now() - drag.current.t > 100
    let velocity = stale ? 0 : drag.current.v
    if (Math.abs(velocity) < 0.0004) return
    let position = drag.current.x
    let last = performance.now()
    const glide = (now: number) => {
      const dt = Math.min(48, now - last)
      last = now
      position = Math.min(1, Math.max(0, position + velocity * dt))
      velocity *= Math.pow(0.985, dt)
      setP(position)
      if (Math.abs(velocity) > 0.00005 && position > 0 && position < 1) drag.current.frame = window.requestAnimationFrame(glide)
      else drag.current.frame = 0
    }
    drag.current.frame = window.requestAnimationFrame(glide)
  }

  useEffect(() => {
    const state = drag.current
    return () => {
      if (state.frame) window.cancelAnimationFrame(state.frame)
    }
  }, [])

  const palette = {
    "--vibeui-app-002-p": p,
    ...(accent ? { "--vibeui-app-002-accent": accent } : null),
    ...(ink ? { "--vibeui-app-002-fg": ink } : null),
    ...(background ? { "--vibeui-app-002-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-app-002" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="app-002" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="mesh" aria-hidden="true">
          <i />
          <i />
        </div>
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title" data-reveal="">
              <Words text={title} />
            </h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <div ref={notes} data-part="notes" data-reveal="">
              <div>
                <small>{beforeLabel}</small>
                <b>{(targets[0] * tick).toFixed(1)} ч</b>
                <span>{beforeNote}</span>
              </div>
              <div>
                <small>{afterLabel}</small>
                <b>{(targets[1] * tick).toFixed(1)} ч</b>
                <span>{afterNote}</span>
              </div>
            </div>
          </div>
          <div ref={box} data-part="compare" data-reveal="" data-touched={touched} onPointerDown={down} onPointerMove={move} onPointerUp={release} onPointerCancel={release}>
            <div data-part="chart" data-side="before" aria-hidden="true">
              {before.map((v, i) => (
                <i key={i} data-v={v} style={{ ["--vibeui-app-002-h" as string]: v / max, ["--vibeui-app-002-i" as string]: i }} />
              ))}
              <Line values={before} max={max} />
            </div>
            <div data-part="chart" data-side="after" aria-hidden="true">
              {after.map((v, i) => (
                <i key={i} data-v={v} style={{ ["--vibeui-app-002-h" as string]: v / max, ["--vibeui-app-002-i" as string]: i }} />
              ))}
              <Line values={after} max={max} />
            </div>
            <div data-part="days" aria-hidden="true">
              {days.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <span data-part="tag" data-side="before">
              {beforeLabel}
            </span>
            <span data-part="tag" data-side="after">
              {afterLabel}
            </span>
            <input data-part="range" type="range" min={0} max={100} value={Math.round(p * 100)} onChange={(event) => setP(Number(event.target.value) / 100)} aria-label="Сравнение до и после" />
            <div data-part="handle" aria-hidden="true">
              <i>◀ ▶</i>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

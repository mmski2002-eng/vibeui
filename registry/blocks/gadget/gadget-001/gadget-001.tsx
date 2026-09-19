"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Gadget001Step = {
  /** Доля прокрутки 0–1, с которой шаг становится текущим. */
  at: number
  label: string
  text: string
}

export type Gadget001Props = {
  eyebrow?: string
  title?: string
  /** Время начала и конца рассвета, «ЧЧ:ММ». */
  startTime?: string
  endTime?: string
  /** Подпись под часами: «будильник 06:00». */
  alarmLabel?: string
  steps?: readonly Gadget001Step[]
  /** Длина прокрутки сцены в экранах (svh). */
  screens?: number
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Рассвет за 30 минут»: sticky-сцена, где по прокрутке комната светлеет
// от ночи к утру. Комната — CSS-слои: стена, окно с тремя небами (ночь со
// звёздами, заря, день) и солнцем, которое поднимается, стол, лампа из
// градиентов. Прогресс прокрутки считается один раз за кадр и уходит в
// переменные: ночные слои гаснут, дневные проявляются (только opacity и
// transform), лампа разгорается от углей до белого, часы в углу идут
// 05:30 → 06:00, подпись сменяется по порогам.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="gadget-001"]){
--vibeui-gadget-001-bg:light-dark(#ffffff,#0a0a0a);
--vibeui-gadget-001-fg:light-dark(#111111,#f2ede4);
--vibeui-gadget-001-accent:light-dark(#111111,#f2ede4);
--vibeui-gadget-001-p:0;
--vibeui-gadget-001-pk:0%;
--vibeui-gadget-001-night:1;
--vibeui-gadget-001-dawn:0;
--vibeui-gadget-001-day:0;
--vibeui-gadget-001-ember:#ff6a2a;
--vibeui-gadget-001-white:#fff3df;
--vibeui-gadget-001-light:color-mix(in oklab,var(--vibeui-gadget-001-ember),var(--vibeui-gadget-001-white) var(--vibeui-gadget-001-pk));
--vibeui-gadget-001-b:calc(.06 + var(--vibeui-gadget-001-p) * .94);
--vibeui-gadget-001-text:color-mix(in oklab,#f2ede4,#14110f calc(var(--vibeui-gadget-001-day) * 100%));
--vibeui-gadget-001-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-gadget-001-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-gadget-001-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="gadget-001"]{color-scheme:dark}
:where([data-vibeui-block="gadget-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="gadget-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="gadget-001"]{box-sizing:border-box;position:relative;background:var(--vibeui-gadget-001-bg);color:var(--vibeui-gadget-001-fg);font-family:var(--vibeui-gadget-001-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="gadget-001"] *{box-sizing:border-box}
[data-vibeui-block="gadget-001"] [data-part="track"]{position:relative;min-height:calc(var(--vibeui-gadget-001-screens) * 100svh)}
[data-vibeui-block="gadget-001"] [data-part="stage"]{--vibeui-gadget-001-desk:42%;--vibeui-gadget-001-lx:68%;position:sticky;top:0;min-height:100svh;max-height:100svh;overflow:hidden;display:grid;grid-template-rows:auto 1fr auto;padding:5.5rem 1.25rem 1.5rem;color:var(--vibeui-gadget-001-text)}
[data-vibeui-block="gadget-001"] [data-part="room"]{position:absolute;inset:0;z-index:0;pointer-events:none}
[data-vibeui-block="gadget-001"] [data-part="wall"]{position:absolute;inset:0;background:#0d0c0b}
[data-vibeui-block="gadget-001"] [data-part="wall-dawn"]{position:absolute;inset:0;background:linear-gradient(180deg,#4a2c22,#2a1a14);opacity:var(--vibeui-gadget-001-dawn)}
[data-vibeui-block="gadget-001"] [data-part="wall-day"]{position:absolute;inset:0;background:linear-gradient(180deg,#f6eee2,#e9dcc8);opacity:var(--vibeui-gadget-001-day)}
[data-vibeui-block="gadget-001"] [data-part="glow"]{position:absolute;left:var(--vibeui-gadget-001-lx);bottom:calc(var(--vibeui-gadget-001-desk) + 4rem);width:60rem;height:60rem;transform:translate(-50%,50%);border-radius:50%;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-gadget-001-light) 55%,transparent),color-mix(in oklab,var(--vibeui-gadget-001-light) 18%,transparent) 22%,transparent 55%);opacity:calc(var(--vibeui-gadget-001-b) * (1 - var(--vibeui-gadget-001-day) * .7))}
[data-vibeui-block="gadget-001"] [data-part="window"]{position:absolute;left:6%;top:9%;width:min(40%,20rem);aspect-ratio:4/5;border:.8rem solid #1b1815;border-radius:.6rem;overflow:hidden;box-shadow:0 0 0 1px rgb(255 255 255/.06),0 30px 60px -30px rgb(0 0 0/.8)}
[data-vibeui-block="gadget-001"] [data-part="window"]::before{content:"";position:absolute;left:50%;top:0;bottom:0;width:.6rem;margin-left:-.3rem;background:#1b1815;z-index:5}
[data-vibeui-block="gadget-001"] [data-part="window"]::after{content:"";position:absolute;top:50%;left:0;right:0;height:.6rem;margin-top:-.3rem;background:#1b1815;z-index:5}
[data-vibeui-block="gadget-001"] [data-part="sky-night"]{position:absolute;inset:0;background:radial-gradient(circle at 20% 30%,#fff 0 1px,transparent 1.5px),radial-gradient(circle at 70% 20%,#fff 0 1px,transparent 1.5px),radial-gradient(circle at 40% 60%,#fff 0 .8px,transparent 1.3px),radial-gradient(circle at 85% 55%,#fff 0 1px,transparent 1.5px),radial-gradient(circle at 55% 40%,#fff 0 .7px,transparent 1.2px),radial-gradient(circle at 15% 75%,#fff 0 .8px,transparent 1.3px),linear-gradient(180deg,#05070f,#111a33 70%,#1c2440);opacity:var(--vibeui-gadget-001-night)}
[data-vibeui-block="gadget-001"] [data-part="sky-dawn"]{position:absolute;inset:0;background:linear-gradient(180deg,#3b2d5e 0%,#c94a3a 50%,#ffb066 100%);opacity:var(--vibeui-gadget-001-dawn)}
[data-vibeui-block="gadget-001"] [data-part="sky-day"]{position:absolute;inset:0;background:linear-gradient(180deg,#7fb4ea 0%,#c9e2f7 65%,#fff6e6 100%);opacity:var(--vibeui-gadget-001-day)}
[data-vibeui-block="gadget-001"] [data-part="sun"]{position:absolute;left:50%;top:58%;width:28%;aspect-ratio:1;margin-left:-14%;border-radius:50%;background:radial-gradient(circle,#fff6d5,#ffbd5e 60%,transparent 72%);transform:translateY(calc((1 - var(--vibeui-gadget-001-p)) * 190%));opacity:calc(var(--vibeui-gadget-001-p) * 1.2)}
[data-vibeui-block="gadget-001"] [data-part="horizon"]{position:absolute;left:0;right:0;bottom:0;height:28%;background:linear-gradient(180deg,#141a22,#0b0f14);opacity:calc(1 - var(--vibeui-gadget-001-day) * .35)}
[data-vibeui-block="gadget-001"] [data-part="desk"]{position:absolute;left:0;right:0;bottom:0;height:var(--vibeui-gadget-001-desk);background:linear-gradient(180deg,#1a1410,#0e0b09)}
[data-vibeui-block="gadget-001"] [data-part="desk-day"]{position:absolute;left:0;right:0;bottom:0;height:var(--vibeui-gadget-001-desk);background:linear-gradient(180deg,#d9c3a3,#b89a76);opacity:var(--vibeui-gadget-001-day)}
[data-vibeui-block="gadget-001"] [data-part="cast"]{position:absolute;left:var(--vibeui-gadget-001-lx);bottom:calc(var(--vibeui-gadget-001-desk) - 2.5rem);width:30rem;height:6rem;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse,color-mix(in oklab,var(--vibeui-gadget-001-light) 50%,transparent),transparent 70%);opacity:var(--vibeui-gadget-001-b)}
[data-vibeui-block="gadget-001"] [data-part="lamp"]{position:absolute;left:var(--vibeui-gadget-001-lx);bottom:calc(var(--vibeui-gadget-001-desk) - .8rem);width:10rem;height:15rem;transform:translateX(-50%)}
[data-vibeui-block="gadget-001"] [data-part="foot"]{position:absolute;left:50%;bottom:.3rem;width:10rem;height:2rem;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse,rgb(0 0 0/.6),transparent 70%)}
[data-vibeui-block="gadget-001"] [data-part="body"]{position:absolute;left:50%;bottom:1rem;width:7rem;height:9rem;transform:translateX(-50%);border-radius:1rem 1rem 1.8rem 1.8rem/1rem 1rem 1.4rem 1.4rem;background:linear-gradient(90deg,#141414 0%,#3b3b3b 26%,#4c4c4c 40%,#2a2a2a 74%,#0d0d0d 100%);box-shadow:inset 0 -14px 24px rgb(0 0 0/.55),0 24px 40px -18px rgb(0 0 0/.9)}
[data-vibeui-block="gadget-001"] [data-part="dome"]{position:absolute;left:50%;top:3.8rem;width:7rem;height:2.4rem;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse at 50% 40%,#fff 0%,var(--vibeui-gadget-001-light) 42%,color-mix(in oklab,var(--vibeui-gadget-001-light) 55%,#000) 100%);box-shadow:0 0 calc(var(--vibeui-gadget-001-b) * 40px) color-mix(in oklab,var(--vibeui-gadget-001-light) calc(var(--vibeui-gadget-001-b) * 90%),transparent),0 0 calc(var(--vibeui-gadget-001-b) * 120px) color-mix(in oklab,var(--vibeui-gadget-001-light) calc(var(--vibeui-gadget-001-b) * 55%),transparent);filter:brightness(calc(.25 + var(--vibeui-gadget-001-b) * .85))}
[data-vibeui-block="gadget-001"] [data-part="hud"]{position:relative;z-index:1;justify-self:end;text-align:right}
[data-vibeui-block="gadget-001"] [data-part="time"]{margin:0;font-family:var(--vibeui-gadget-001-mono);font-weight:500;font-size:clamp(2.6rem,8cqi,5.5rem);line-height:1;letter-spacing:-.04em;font-variant-numeric:tabular-nums}
[data-vibeui-block="gadget-001"] [data-part="alarm"]{margin:.4rem 0 0;font-family:var(--vibeui-gadget-001-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;opacity:.7}
[data-vibeui-block="gadget-001"] [data-part="rail"]{position:absolute;right:1.25rem;top:50%;width:2px;height:8rem;margin-top:-4rem;background:color-mix(in oklab,currentColor 20%,transparent);border-radius:2px;overflow:hidden;z-index:1}
[data-vibeui-block="gadget-001"] [data-part="rail"]::after{content:"";position:absolute;inset:0;background:currentColor;transform-origin:top;transform:scaleY(var(--vibeui-gadget-001-p))}
[data-vibeui-block="gadget-001"] [data-part="copy"]{position:relative;z-index:1;align-self:end;max-width:34rem}
[data-vibeui-block="gadget-001"] [data-part="eyebrow"]{margin:0 0 .6rem;font-family:var(--vibeui-gadget-001-mono);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;opacity:.75}
[data-vibeui-block="gadget-001"] [data-part="title"]{margin:0;font-family:var(--vibeui-gadget-001-display);font-weight:900;font-size:clamp(1.7rem,4.6cqi,3.4rem);line-height:1.02;letter-spacing:-.03em;text-wrap:balance}
[data-vibeui-block="gadget-001"] [data-part="step"]{margin:1rem 0 0;display:grid;gap:.25rem;min-height:4.4rem}
[data-vibeui-block="gadget-001"] [data-part="step"] b{font-family:var(--vibeui-gadget-001-mono);font-weight:500;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:color-mix(in oklab,var(--vibeui-gadget-001-ember) 60%,var(--vibeui-gadget-001-text))}
[data-vibeui-block="gadget-001"] [data-part="step"] p{margin:0;font-size:1rem;opacity:.85;animation:vibeui-gadget-001-fade .5s ease-out}
@keyframes vibeui-gadget-001-fade{from{opacity:0;transform:translateY(.4rem)}}
@container (min-width: 60rem){[data-vibeui-block="gadget-001"] [data-part="stage"]{--vibeui-gadget-001-desk:30%;padding:6rem 3rem 3rem}[data-vibeui-block="gadget-001"] [data-part="lamp"]{width:14rem;height:21rem}[data-vibeui-block="gadget-001"] [data-part="body"]{width:10rem;height:13rem}[data-vibeui-block="gadget-001"] [data-part="dome"]{width:10rem;height:3.4rem;top:5.3rem}[data-vibeui-block="gadget-001"] [data-part="window"]{left:8%;top:8%;width:min(26%,18rem)}[data-vibeui-block="gadget-001"] [data-part="rail"]{right:3rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="gadget-001"] *{animation:none!important;transition:none!important}}`

const DEFAULT_STEPS: Gadget001Step[] = [
  { at: 0, label: "05:30 · 1 %", text: "Тусклый красный, как угли. Зрачки успевают привыкнуть, сон становится поверхностным — без рывка." },
  { at: 0.34, label: "05:45 · 40 %", text: "Тёплый янтарь 2700 K. Кортизол растёт сам, как на настоящем рассвете. Птицы за окном — динамик, 8 %." },
  { at: 0.68, label: "06:00 · 100 %", text: "Дневной белый 5000 K, 1 200 люмен. Вы уже проснулись — звонок будильника не понадобился." },
]

function parseTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number)
  return (hours || 0) * 60 + (minutes || 0)
}

function formatTime(total: number) {
  const hours = Math.floor(total / 60) % 24
  const minutes = total % 60
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
}

/** Sticky-сцена рассвета: комната светлеет по прокрутке, часы идут. */
export function Gadget001({
  eyebrow = "Как это работает",
  title = "Рассвет за тридцать минут — прямо на столе",
  startTime = "05:30",
  endTime = "06:00",
  alarmLabel = "будильник 06:00",
  steps = DEFAULT_STEPS,
  screens = 3.2,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Gadget001Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let frame = 0
    const update = () => {
      frame = 0
      const rect = track.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const next = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1
      setProgress(Math.round(next * 1000) / 1000)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    schedule()
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const start = parseTime(startTime)
  const end = parseTime(endTime)
  const time = formatTime(start + Math.round((end - start) * progress))
  const night = Math.min(1, Math.max(0, 1 - progress * 2))
  const day = Math.min(1, Math.max(0, (progress - 0.5) * 2))
  const dawn = 1 - Math.abs(progress * 2 - 1)
  let current = steps[0]
  for (const step of steps) if (step.at <= progress) current = step

  const palette = {
    ...(accent ? { "--vibeui-gadget-001-accent": accent } : null),
    ...(ink ? { "--vibeui-gadget-001-fg": ink } : null),
    ...(background ? { "--vibeui-gadget-001-bg": background } : null),
    "--vibeui-gadget-001-p": progress,
    "--vibeui-gadget-001-pk": `${Math.round(progress * 100)}%`,
    "--vibeui-gadget-001-night": night,
    "--vibeui-gadget-001-dawn": dawn,
    "--vibeui-gadget-001-day": day,
    "--vibeui-gadget-001-screens": screens,
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-gadget-001" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="gadget-001" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="track" ref={trackRef}>
          <div data-part="stage">
            <div data-part="room" aria-hidden="true">
              <i data-part="wall" />
              <i data-part="wall-dawn" />
              <i data-part="wall-day" />
              <i data-part="glow" />
              <div data-part="window">
                <i data-part="sky-night" />
                <i data-part="sky-dawn" />
                <i data-part="sky-day" />
                <i data-part="sun" />
                <i data-part="horizon" />
              </div>
              <i data-part="desk" />
              <i data-part="desk-day" />
              <i data-part="cast" />
              <div data-part="lamp">
                <i data-part="foot" />
                <i data-part="body" />
                <i data-part="dome" />
              </div>
            </div>
            <div data-part="hud">
              <p data-part="time" aria-live="off">
                {time}
              </p>
              {alarmLabel ? <p data-part="alarm">{alarmLabel}</p> : null}
            </div>
            <i data-part="rail" aria-hidden="true" />
            <div data-part="copy">
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
              {current ? (
                <div data-part="step" aria-live="polite">
                  <b>{current.label}</b>
                  <p key={current.label}>{current.text}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

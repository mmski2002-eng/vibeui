"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { Card099 } from "@/registry/components/card/card-099/card-099"

export type Fintech003Layer = {
  title: string
  text: string
  /** Иконка-линия: biometrics | lock | radar | shield. */
  icon?: "biometrics" | "lock" | "radar" | "shield"
}

export type Fintech003Props = {
  eyebrow?: string
  title?: string
  lede?: string
  layers?: readonly Fintech003Layer[]
  cardLabel?: string
  /** Подпись счётчика: «слой 01 / 04». */
  counterLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Безопасность по прокрутке: высокий трек, внутри sticky-сцена. Пока
// пользователь листает, прогресс трека пишется в CSS-переменную, и
// маленькая карта едет вниз сквозь четыре кольца-слоя в 3D (preserve-3d,
// кольца лежат плашмя). Слой, через который проходит карта, подсвечивается,
// его иконка-линия прорисовывается через stroke-dashoffset, слева
// подсвечивается описание. Состояние — только номер активного слоя,
// движение карты идёт без ререндера.
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@600;700;800&family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="fintech-003"]){
--vibeui-fintech-003-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-fintech-003-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-fintech-003-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-fintech-003-mint:color-mix(in oklab,var(--vibeui-fintech-003-accent) 45%,#99f6e4);
--vibeui-fintech-003-muted:color-mix(in oklab,var(--vibeui-fintech-003-fg) 62%,var(--vibeui-fintech-003-bg));
--vibeui-fintech-003-line:color-mix(in oklab,var(--vibeui-fintech-003-fg) 11%,transparent);
--vibeui-fintech-003-glass:color-mix(in oklab,var(--vibeui-fintech-003-fg) 5%,transparent);
--vibeui-fintech-003-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-fintech-003-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-fintech-003-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-fintech-003-p:0;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="fintech-003"]{color-scheme:dark}
:where([data-vibeui-block="fintech-003"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="fintech-003"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="fintech-003"]{box-sizing:border-box;background:var(--vibeui-fintech-003-bg);color:var(--vibeui-fintech-003-fg);font-family:var(--vibeui-fintech-003-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="fintech-003"] *{box-sizing:border-box}
[data-vibeui-block="fintech-003"] [data-part="track"]{position:relative;min-height:320svh}
[data-vibeui-block="fintech-003"] [data-part="sticky"]{position:sticky;top:0;min-height:100svh;display:grid;align-items:center;overflow:hidden;padding:3rem 0}
[data-vibeui-block="fintech-003"] [data-part="glow"]{position:absolute;left:50%;top:50%;width:40rem;height:40rem;margin:-20rem 0 0 -20rem;border-radius:50%;background:radial-gradient(closest-side,var(--vibeui-fintech-003-accent),transparent);opacity:.12;filter:blur(60px);pointer-events:none}
[data-vibeui-block="fintech-003"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2rem;width:100%}
[data-vibeui-block="fintech-003"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-fintech-003-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-fintech-003-accent)}
[data-vibeui-block="fintech-003"] [data-part="title"]{margin:0;font-family:var(--vibeui-fintech-003-display);font-weight:800;font-size:clamp(1.9rem,4.6cqi,3.2rem);line-height:1.02;letter-spacing:-.04em;text-wrap:balance}
[data-vibeui-block="fintech-003"] [data-part="lede"]{margin:.8rem 0 0;max-width:30rem;color:var(--vibeui-fintech-003-muted)}
[data-vibeui-block="fintech-003"] [data-part="layers"]{position:relative;margin:1.6rem 0 0;padding:0 0 0 1.4rem;list-style:none;display:grid;gap:.4rem}
[data-vibeui-block="fintech-003"] [data-part="layers"]::before{content:"";position:absolute;left:.3rem;top:.6rem;bottom:.6rem;width:2px;border-radius:2px;background:var(--vibeui-fintech-003-line)}
[data-vibeui-block="fintech-003"] [data-part="layers"]::after{content:"";position:absolute;left:.3rem;top:.6rem;bottom:.6rem;width:2px;border-radius:2px;background:linear-gradient(var(--vibeui-fintech-003-accent),var(--vibeui-fintech-003-mint));transform-origin:top;transform:scaleY(var(--vibeui-fintech-003-p));transition:transform .15s linear}
[data-vibeui-block="fintech-003"] [data-part="counter"]{margin:1rem 0 0;font-family:var(--vibeui-fintech-003-mono);font-size:.75rem;color:var(--vibeui-fintech-003-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="fintech-003"] [data-part="scene"]{position:relative;height:14rem;perspective:900px;transform-style:preserve-3d}
[data-vibeui-block="fintech-003"] [data-part="ring"]{position:absolute;left:50%;width:15rem;height:6rem;margin-left:-7.5rem;top:calc(.5rem + var(--vibeui-fintech-003-i) * 2.8rem);border-radius:50%;border:1px solid var(--vibeui-fintech-003-line);background:radial-gradient(closest-side,color-mix(in oklab,var(--vibeui-fintech-003-fg) 4%,transparent),transparent);transform:rotateX(72deg);transform-style:preserve-3d;transition:border-color .4s,box-shadow .4s}
[data-vibeui-block="fintech-003"] [data-part="ring"]::after{content:attr(data-label);position:absolute;left:100%;top:50%;margin-left:.8rem;transform:rotateX(-72deg) translateY(-50%);font-family:var(--vibeui-fintech-003-mono);font-size:.62rem;white-space:nowrap;color:var(--vibeui-fintech-003-muted);opacity:0;transition:opacity .4s}
[data-vibeui-block="fintech-003"] [data-part="ring"][data-active="true"]{border-color:var(--vibeui-fintech-003-accent);box-shadow:0 0 30px color-mix(in oklab,var(--vibeui-fintech-003-accent) 45%,transparent),0 0 0 1px color-mix(in oklab,var(--vibeui-fintech-003-accent) 30%,transparent) inset}
[data-vibeui-block="fintech-003"] [data-part="ring"][data-active="true"]::after{opacity:1;color:var(--vibeui-fintech-003-accent)}
[data-vibeui-block="fintech-003"] [data-part="card"]{position:absolute;left:50%;top:0;width:8.5rem;aspect-ratio:1.586;margin-left:-4.25rem;border-radius:.7rem;padding:.55rem .65rem;display:grid;grid-template-rows:auto 1fr auto;color:#f4f7ff;font-size:.55rem;background:linear-gradient(135deg,#141a3a,#090c22 55%,#0b1330);border:1px solid rgb(255 255 255 / .18);box-shadow:0 20px 40px -20px rgb(0 0 0 / .9);transform:translateY(calc(var(--vibeui-fintech-003-p) * 9rem)) rotateY(-14deg);transition:transform .12s linear}
[data-vibeui-block="fintech-003"] [data-part="card"] b{font-family:var(--vibeui-fintech-003-display);font-size:.7rem}
[data-vibeui-block="fintech-003"] [data-part="card"] i{display:block;width:1.1rem;height:.8rem;border-radius:.15rem;background:linear-gradient(135deg,#f5e6a8,#c9a54b);align-self:center}
[data-vibeui-block="fintech-003"] [data-part="card"] span{font-family:var(--vibeui-fintech-003-mono);letter-spacing:.08em}
[data-vibeui-block="fintech-003"] [data-part="scan"]{position:absolute;left:0;right:0;top:calc(.5rem + var(--vibeui-fintech-003-p) * 9rem + 2.3rem);height:1px;background:linear-gradient(90deg,transparent,var(--vibeui-fintech-003-accent),transparent);opacity:.7;pointer-events:none}
@keyframes vibeui-fintech-003-draw{to{stroke-dashoffset:0}}
@container (min-width: 56rem){[data-vibeui-block="fintech-003"] [data-part="sticky"]{padding:4rem 0}[data-vibeui-block="fintech-003"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:4rem;align-items:center}[data-vibeui-block="fintech-003"] [data-part="scene"]{height:22rem}[data-vibeui-block="fintech-003"] [data-part="ring"]{width:20rem;height:8rem;margin-left:-10rem;top:calc(1rem + var(--vibeui-fintech-003-i) * 4.4rem)}[data-vibeui-block="fintech-003"] [data-part="card"]{width:11rem;margin-left:-5.5rem;font-size:.7rem;padding:.7rem .85rem;border-radius:.9rem;transform:translateY(calc(var(--vibeui-fintech-003-p) * 14.5rem)) rotateY(-14deg)}[data-vibeui-block="fintech-003"] [data-part="scan"]{top:calc(1rem + var(--vibeui-fintech-003-p) * 14.5rem + 3.4rem)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="fintech-003"] *{animation:none!important;transition:none!important}}`

const DEFAULT_LAYERS: Fintech003Layer[] = [
  { title: "Вход по лицу и ключу", text: "Биометрия на телефоне, аппаратный ключ или подтверждение в приложении. СМС-кодов, которые перехватывают, нет.", icon: "biometrics" },
  { title: "Токены вместо номеров", text: "Реквизиты карты не хранятся у продавца: при оплате уходит одноразовый токен, а не номер.", icon: "lock" },
  { title: "Антифрод за 200 мс", text: "Модель смотрит на сумму, получателя, время и устройство. Подозрительный платёж останавливается до списания.", icon: "radar" },
  { title: "Страховка и лимиты", text: "Средства до 1,4 млн ₽ застрахованы АСВ. Лимиты на карты сотрудников — по категориям и дням.", icon: "shield" },
]


/** Безопасность: карта проходит четыре слоя защиты по прокрутке. */
export function Fintech003({
  eyebrow = "Безопасность",
  title = "Каждый платёж проходит четыре слоя защиты",
  lede = "Листайте — карта пройдёт их у вас на глазах. Всё это работает за доли секунды и не просит от вас ни одного СМС-кода.",
  layers = DEFAULT_LAYERS,
  cardLabel = "Ось",
  counterLabel = "слой",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Fintech003Props) {
  const rootRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const count = Math.max(1, layers.length)

  useEffect(() => {
    const root = rootRef.current
    const track = trackRef.current
    if (!root || !track) return
    let frame = 0
    let lastStep = -1
    const update = () => {
      frame = 0
      const rect = track.getBoundingClientRect()
      const total = Math.max(1, rect.height - window.innerHeight)
      const progress = Math.min(1, Math.max(0, -rect.top / total))
      root.style.setProperty("--vibeui-fintech-003-p", progress.toFixed(4))
      const next = Math.min(count - 1, Math.floor(progress * count))
      if (next !== lastStep) {
        lastStep = next
        setStep(next)
      }
    }
    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [count])

  const palette = {
    ...(accent ? { "--vibeui-fintech-003-accent": accent } : null),
    ...(ink ? { "--vibeui-fintech-003-fg": ink } : null),
    ...(background ? { "--vibeui-fintech-003-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-fintech-003" precedence="medium">
        {STYLES}
      </style>
      <section ref={rootRef} data-vibeui-block="fintech-003" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="track" ref={trackRef}>
          <div data-part="sticky">
            <i data-part="glow" aria-hidden="true" />
            <div data-part="shell">
              <div>
                {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
                <h2 data-part="title">{title}</h2>
                {lede ? <p data-part="lede">{lede}</p> : null}
                <ol data-part="layers">
                  {layers.map((layer, index) => (
                    <Card099 key={layer.title} data-part="layer" title={layer.title} icon={layer.icon} text={layer.text} data-active={index === step} accent={accent} />
                  ))}
                </ol>
                <p data-part="counter" aria-live="polite">
                  {counterLabel} {String(step + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </p>
              </div>
              <div data-part="scene" aria-hidden="true">
                {layers.map((layer, index) => (
                  <i key={layer.title} data-part="ring" data-label={`0${index + 1}`} data-active={index === step} style={{ ["--vibeui-fintech-003-i" as string]: index }} />
                ))}
                <div data-part="card">
                  <b>{cardLabel}</b>
                  <i />
                  <span>•••• 4821</span>
                </div>
                <i data-part="scan" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

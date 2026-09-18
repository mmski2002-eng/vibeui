"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"

export type Hero031Props = {
  /** Строка над именем: «привет, я». */
  greeting?: string
  name?: string
  /** Роли печатаются по очереди. */
  roles?: readonly string[]
  lede?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  scrollHint?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Первый экран личного сайта: огромное имя плотным гротеском, под ним роль,
// которая печатается по буквам и стирается, чтобы напечатать следующую;
// по фону за курсором ходит мягкое пятно света (позиция в CSS-переменных,
// без ререндера); кнопки «магнитные» — тянутся к курсору на несколько
// пикселей. Внизу подсказка «листайте» с плавающей стрелкой.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;800;900&family=Golos+Text:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-031"]){
--vibeui-hero-031-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-hero-031-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-031-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-031-on-accent:oklch(from var(--vibeui-hero-031-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-031-muted:color-mix(in oklab,var(--vibeui-hero-031-fg) 60%,var(--vibeui-hero-031-bg));
--vibeui-hero-031-line:color-mix(in oklab,var(--vibeui-hero-031-fg) 12%,transparent);
--vibeui-hero-031-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-031-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-031-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-hero-031-x:50%;
--vibeui-hero-031-y:40%;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-031"]{color-scheme:dark}
:where([data-vibeui-block="hero-031"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-031"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-031"]{box-sizing:border-box;position:relative;overflow:hidden;background:var(--vibeui-hero-031-bg);color:var(--vibeui-hero-031-fg);font-family:var(--vibeui-hero-031-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-031"] *{box-sizing:border-box}
[data-vibeui-block="hero-031"] [data-part="light"]{position:absolute;inset:0;background:radial-gradient(28rem 28rem at var(--vibeui-hero-031-x) var(--vibeui-hero-031-y),color-mix(in oklab,var(--vibeui-hero-031-accent) 22%,transparent),transparent 70%);pointer-events:none;transition:background-position .1s}
[data-vibeui-block="hero-031"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:5rem 1.25rem 4rem;min-height:calc(100svh - 4rem);display:flex;flex-direction:column;justify-content:center}
[data-vibeui-block="hero-031"] [data-part="greeting"]{margin:0 0 1rem;font-family:var(--vibeui-hero-031-mono);font-size:.82rem;color:var(--vibeui-hero-031-muted)}
[data-vibeui-block="hero-031"] [data-part="name"]{margin:0;font-family:var(--vibeui-hero-031-display);font-weight:900;font-size:clamp(3.2rem,11cqi,9.5rem);line-height:.92;letter-spacing:-.05em;text-wrap:balance}
[data-vibeui-block="hero-031"] [data-part="role"]{margin:1.2rem 0 0;font-family:var(--vibeui-hero-031-display);font-weight:600;font-size:clamp(1.4rem,3.6cqi,2.6rem);letter-spacing:-.03em;color:var(--vibeui-hero-031-accent);min-height:1.3em}
[data-vibeui-block="hero-031"] [data-part="role"] i{display:inline-block;width:.08em;height:1em;margin-left:.1em;vertical-align:-.1em;background:currentColor;animation:vibeui-hero-031-blink 1s steps(1) infinite}
[data-vibeui-block="hero-031"] [data-part="lede"]{margin:1.6rem 0 0;max-width:34rem;font-size:1.1rem;color:var(--vibeui-hero-031-muted)}
[data-vibeui-block="hero-031"] [data-part="actions"]{display:flex;gap:.75rem;flex-wrap:wrap;margin-top:2.2rem}
[data-vibeui-block="hero-031"] [data-part="btn"]{position:relative;display:inline-flex;align-items:center;gap:.5rem;padding:1rem 1.6rem;border-radius:999px;font-weight:600;text-decoration:none;font-size:1rem;color:var(--vibeui-hero-031-fg);border:1px solid var(--vibeui-hero-031-line);transform:translate(calc(var(--vibeui-hero-031-mx) * 1px),calc(var(--vibeui-hero-031-my) * 1px));transition:transform .25s cubic-bezier(.2,.8,.2,1),background .2s,color .2s}
[data-vibeui-block="hero-031"] [data-part="btn"][data-primary="true"]{background:var(--vibeui-hero-031-fg);color:var(--vibeui-hero-031-bg);border-color:transparent}
[data-vibeui-block="hero-031"] [data-part="btn"][data-primary="true"]:hover{background:var(--vibeui-hero-031-accent);color:var(--vibeui-hero-031-on-accent)}
[data-vibeui-block="hero-031"] [data-part="btn"]:not([data-primary="true"]):hover{background:var(--vibeui-hero-031-line)}
[data-vibeui-block="hero-031"] [data-part="btn"]:focus-visible{outline:2px solid var(--vibeui-hero-031-accent);outline-offset:3px}
[data-vibeui-block="hero-031"] [data-part="hint"]{position:absolute;left:1.25rem;bottom:1.5rem;display:inline-flex;align-items:center;gap:.5rem;font-family:var(--vibeui-hero-031-mono);font-size:.72rem;color:var(--vibeui-hero-031-muted);letter-spacing:.08em;text-transform:uppercase}
[data-vibeui-block="hero-031"] [data-part="hint"] i{display:inline-block;width:1px;height:2rem;background:currentColor;transform-origin:top;animation:vibeui-hero-031-drop 1.6s ease-in-out infinite}
@keyframes vibeui-hero-031-blink{50%{opacity:0}}
@keyframes vibeui-hero-031-drop{0%{transform:scaleY(0);opacity:0}40%{transform:scaleY(1);opacity:1}100%{transform:scaleY(1) translateY(1rem);opacity:0}}
@container (min-width: 60rem){[data-vibeui-block="hero-031"] [data-part="shell"]{padding:6rem 2rem 5rem}[data-vibeui-block="hero-031"] [data-part="hint"]{left:2rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-031"] *{animation:none!important;transition:none!important}}`

/** Первый экран личного сайта: печатающиеся роли, свет за курсором, магнитные кнопки. */
export function Hero031({
  greeting = "привет, я",
  name = "Даня Лунёв",
  roles = ["делаю интерфейсы", "пишу фронтенд", "рисую дизайн-системы", "собираю продукты с нуля"],
  lede = "Дизайнер и разработчик в одном лице: от первого наброска до продакшена. Работаю с командами на ранней стадии — там, где важнее собрать, чем согласовать.",
  primaryLabel = "Смотреть проекты",
  primaryHref = "#work",
  secondaryLabel = "Написать",
  secondaryHref = "#contact",
  scrollHint = "листайте",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero031Props) {
  const root = useRef<HTMLElement>(null)
  const [text, setText] = useState("")

  useEffect(() => {
    let role = 0
    let length = 0
    let deleting = false
    let timer = 0
    const step = () => {
      const current = roles[role] ?? ""
      if (!deleting) {
        length += 1
        setText(current.slice(0, length))
        if (length >= current.length) {
          deleting = true
          timer = window.setTimeout(step, 1600)
          return
        }
        timer = window.setTimeout(step, 55)
      } else {
        length -= 1
        setText(current.slice(0, length))
        if (length <= 0) {
          deleting = false
          role = (role + 1) % roles.length
          timer = window.setTimeout(step, 300)
          return
        }
        timer = window.setTimeout(step, 28)
      }
    }
    timer = window.setTimeout(step, 400)
    return () => window.clearTimeout(timer)
  }, [roles])

  const onMove = (event: PointerEvent<HTMLElement>) => {
    const element = root.current
    if (!element) return
    const rect = element.getBoundingClientRect()
    element.style.setProperty("--vibeui-hero-031-x", `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`)
    element.style.setProperty("--vibeui-hero-031-y", `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`)
  }

  const magnet = (event: PointerEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const dx = event.clientX - (rect.left + rect.width / 2)
    const dy = event.clientY - (rect.top + rect.height / 2)
    event.currentTarget.style.setProperty("--vibeui-hero-031-mx", (dx * 0.18).toFixed(1))
    event.currentTarget.style.setProperty("--vibeui-hero-031-my", (dy * 0.18).toFixed(1))
  }
  const release = (event: PointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.setProperty("--vibeui-hero-031-mx", "0")
    event.currentTarget.style.setProperty("--vibeui-hero-031-my", "0")
  }

  const palette = {
    ...(accent ? { "--vibeui-hero-031-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-031-fg": ink } : null),
    ...(background ? { "--vibeui-hero-031-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-031" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="hero-031" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette} onPointerMove={onMove}>
        <div data-part="light" aria-hidden="true" />
        <div data-part="shell">
          {greeting ? <p data-part="greeting">{greeting}</p> : null}
          <h1 data-part="name">{name}</h1>
          <p data-part="role" aria-live="polite">
            {text}
            <i aria-hidden="true" />
          </p>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="actions">
            {primaryLabel ? (
              <a data-part="btn" data-primary="true" href={primaryHref} onPointerMove={magnet} onPointerLeave={release} style={{ ["--vibeui-hero-031-mx" as string]: 0, ["--vibeui-hero-031-my" as string]: 0 }}>
                {primaryLabel} →
              </a>
            ) : null}
            {secondaryLabel ? (
              <a data-part="btn" href={secondaryHref} onPointerMove={magnet} onPointerLeave={release} style={{ ["--vibeui-hero-031-mx" as string]: 0, ["--vibeui-hero-031-my" as string]: 0 }}>
                {secondaryLabel}
              </a>
            ) : null}
          </div>
          {scrollHint ? (
            <div data-part="hint" aria-hidden="true">
              <i />
              {scrollHint}
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}

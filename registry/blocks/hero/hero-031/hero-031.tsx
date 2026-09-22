"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"

import { Button016 } from "@/registry/components/button/button-016/button-016"

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
  /** Текст на вращающемся круглом штампе справа. Пусто — без штампа. */
  badge?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Первый экран личного сайта: имя гигантской антиквой, каждое слово въезжает
// из-под маски каскадом, фамилия — курсивом с градиентом акцента; над именем
// рукописное «привет, я». Под именем роль, которая печатается по буквам и
// стирается, чтобы напечатать следующую. За курсором ходит пятно света
// (с инерцией: позиция догоняет курсор в rAF), под ним плавают два размытых
// пятна mesh-градиента и зерно бумаги. Кнопки «магнитные», справа вращается
// круглый штамп с текстом по окружности.
const FONTS = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Caveat:wght@500;600&family=Inter+Tight:wght@500;600;800&family=Golos+Text:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const STYLES = `
:where([data-vibeui-block="hero-031"]){
--vibeui-hero-031-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-hero-031-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-031-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-031-on-accent:oklch(from var(--vibeui-hero-031-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-031-muted:color-mix(in oklab,var(--vibeui-hero-031-fg) 60%,var(--vibeui-hero-031-bg));
--vibeui-hero-031-line:color-mix(in oklab,var(--vibeui-hero-031-fg) 12%,transparent);
--vibeui-hero-031-serif:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-hero-031-hand:"Caveat","Segoe Script",cursive;
--vibeui-hero-031-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-031-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-031-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-hero-031-x:50%;
--vibeui-hero-031-y:40%;
--vibeui-hero-031-ease:cubic-bezier(.2,.8,.2,1);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-031"]{color-scheme:dark}
:where([data-vibeui-block="hero-031"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-031"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-031"]{box-sizing:border-box;position:relative;overflow:hidden;background:var(--vibeui-hero-031-bg);color:var(--vibeui-hero-031-fg);font-family:var(--vibeui-hero-031-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-031"] *{box-sizing:border-box}
[data-vibeui-block="hero-031"] [data-part="btn"]{transform:translate(calc(var(--vibeui-hero-031-mx) * 1px),calc(var(--vibeui-hero-031-my) * 1px)) scale(var(--vibeui-hero-031-ms,1));transition:transform .3s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="hero-031"] [data-part="btn"]:hover{--vibeui-hero-031-ms:1.04}
[data-vibeui-block="hero-031"] [data-part="mesh"]{position:absolute;inset:0;overflow:hidden;pointer-events:none}
[data-vibeui-block="hero-031"] [data-part="mesh"] i{position:absolute;display:block;border-radius:50%;filter:blur(70px);opacity:.55;will-change:transform}
[data-vibeui-block="hero-031"] [data-part="mesh"] i:nth-child(1){width:38rem;height:38rem;right:-12rem;top:-14rem;background:color-mix(in oklab,var(--vibeui-hero-031-accent) 45%,transparent);animation:vibeui-hero-031-float 18s ease-in-out infinite alternate}
[data-vibeui-block="hero-031"] [data-part="mesh"] i:nth-child(2){width:28rem;height:28rem;left:-10rem;bottom:-12rem;background:color-mix(in oklab,var(--vibeui-hero-031-accent) 28%,#f5b26b 40%);animation:vibeui-hero-031-float 22s ease-in-out infinite alternate-reverse}
[data-vibeui-block="hero-031"] [data-part="light"]{position:absolute;inset:0;background:radial-gradient(30rem 30rem at var(--vibeui-hero-031-x) var(--vibeui-hero-031-y),color-mix(in oklab,var(--vibeui-hero-031-accent) 26%,transparent),transparent 70%);pointer-events:none}
[data-vibeui-block="hero-031"] [data-part="grain"]{position:absolute;inset:0;background-image:${NOISE};background-size:160px 160px;opacity:.07;mix-blend-mode:multiply;pointer-events:none}
[data-vibeui-block="hero-031"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:5rem 1.25rem 5rem;min-height:calc(100svh - 4rem);display:flex;flex-direction:column;justify-content:center}
[data-vibeui-block="hero-031"] [data-part="greeting"]{display:inline-block;margin:0 0 .2rem .2rem;font-family:var(--vibeui-hero-031-hand);font-weight:600;font-size:clamp(1.6rem,3.2cqi,2.6rem);line-height:1;color:var(--vibeui-hero-031-accent);transform:rotate(-3deg);transform-origin:left bottom;animation:vibeui-hero-031-fade .9s var(--vibeui-hero-031-ease) both}
[data-vibeui-block="hero-031"] [data-part="name"]{margin:0;font-family:var(--vibeui-hero-031-serif);font-weight:900;font-size:clamp(3.4rem,9cqi,8.6rem);line-height:.98;letter-spacing:-.035em;text-wrap:balance}
[data-vibeui-block="hero-031"] [data-part="word"]{display:inline-block;vertical-align:top;overflow:hidden;padding:.02em .06em .14em;margin:-.02em -.06em -.14em}
[data-vibeui-block="hero-031"] [data-part="word"] span{display:inline-block;animation:vibeui-hero-031-rise 1s var(--vibeui-hero-031-ease) both;animation-delay:calc(.15s + var(--vibeui-hero-031-i) * .12s)}
[data-vibeui-block="hero-031"] [data-part="word"][data-last="true"] span{font-style:italic;font-weight:700;padding-right:.08em;background:linear-gradient(100deg,var(--vibeui-hero-031-accent),color-mix(in oklab,var(--vibeui-hero-031-accent) 55%,#f5b26b));-webkit-background-clip:text;background-clip:text;color:transparent}
[data-vibeui-block="hero-031"] [data-part="role"]{margin:1.3rem 0 0;font-family:var(--vibeui-hero-031-display);font-weight:600;font-size:clamp(1.3rem,3.2cqi,2.4rem);letter-spacing:-.03em;color:var(--vibeui-hero-031-fg);min-height:1.3em;animation:vibeui-hero-031-fade 1s .6s var(--vibeui-hero-031-ease) both}
[data-vibeui-block="hero-031"] [data-part="role"] i{display:inline-block;width:.08em;height:1em;margin-left:.1em;vertical-align:-.1em;background:var(--vibeui-hero-031-accent);animation:vibeui-hero-031-blink 1s steps(1) infinite}
[data-vibeui-block="hero-031"] [data-part="lede"]{margin:1.6rem 0 0;max-width:34rem;font-size:1.1rem;color:var(--vibeui-hero-031-muted);animation:vibeui-hero-031-fade 1s .75s var(--vibeui-hero-031-ease) both}
[data-vibeui-block="hero-031"] [data-part="actions"]{display:flex;gap:.75rem;flex-wrap:wrap;margin-top:2.2rem;animation:vibeui-hero-031-fade 1s .9s var(--vibeui-hero-031-ease) both}
[data-vibeui-block="hero-031"] [data-part="hint"]{position:absolute;left:1.25rem;bottom:1.5rem;display:inline-flex;align-items:center;gap:.5rem;font-family:var(--vibeui-hero-031-mono);font-size:.72rem;color:var(--vibeui-hero-031-muted);letter-spacing:.08em;text-transform:uppercase}
[data-vibeui-block="hero-031"] [data-part="hint"] i{display:inline-block;width:1px;height:2rem;background:currentColor;transform-origin:top;animation:vibeui-hero-031-drop 1.6s ease-in-out infinite}
[data-vibeui-block="hero-031"] [data-part="badge"]{display:none;position:absolute;right:2rem;bottom:2rem;width:9rem;height:9rem;color:var(--vibeui-hero-031-fg);animation:vibeui-hero-031-spin 22s linear infinite}
[data-vibeui-block="hero-031"] [data-part="badge"] svg{width:100%;height:100%;overflow:visible}
[data-vibeui-block="hero-031"] [data-part="badge"] text{font-family:var(--vibeui-hero-031-mono);font-size:10px;letter-spacing:.2em;text-transform:uppercase;fill:currentColor}
[data-vibeui-block="hero-031"] [data-part="badge"] circle{fill:var(--vibeui-hero-031-accent)}
@keyframes vibeui-hero-031-blink{50%{opacity:0}}
@keyframes vibeui-hero-031-drop{0%{transform:scaleY(0);opacity:0}40%{transform:scaleY(1);opacity:1}100%{transform:scaleY(1) translateY(1rem);opacity:0}}
@keyframes vibeui-hero-031-rise{from{transform:translateY(130%) rotate(3deg)}}
@keyframes vibeui-hero-031-fade{from{opacity:0;transform:translateY(.8rem)}}
@keyframes vibeui-hero-031-float{to{transform:translate(-8rem,6rem) scale(1.15)}}
@keyframes vibeui-hero-031-spin{to{transform:rotate(360deg)}}
@container (min-width: 60rem){[data-vibeui-block="hero-031"] [data-part="shell"]{padding:6rem 2rem 6rem}[data-vibeui-block="hero-031"] [data-part="hint"]{left:2rem}[data-vibeui-block="hero-031"] [data-part="badge"]{display:block}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-031"] *{animation:none!important;transition:none!important}[data-vibeui-block="hero-031"] [data-part="greeting"]{transform:none}}`

/** Первый экран личного сайта: имя антиквой из-под маски, печатающиеся роли, свет за курсором, магнитные кнопки. */
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
  badge = "дизайн · фронтенд · продукт · ",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero031Props) {
  const root = useRef<HTMLElement>(null)
  const target = useRef({ x: 50, y: 40 })
  const [text, setText] = useState("")
  const words = name.split(" ")
  // Дефолтный массив ролей пересоздаётся на каждый рендер: в deps идёт строка, иначе печать сбрасывается на первой букве.
  const rolesKey = roles.join("|")

  useEffect(() => {
    const list = rolesKey.split("|").filter(Boolean)
    if (list.length === 0) return
    let role = 0
    let length = 0
    let deleting = false
    let timer = 0
    const step = () => {
      const current = list[role] ?? ""
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
          role = (role + 1) % list.length
          timer = window.setTimeout(step, 300)
          return
        }
        timer = window.setTimeout(step, 28)
      }
    }
    timer = window.setTimeout(step, 400)
    return () => window.clearTimeout(timer)
  }, [rolesKey])

  // Свет догоняет курсор с инерцией: позиция лерпится в rAF, а не пишется сразу.
  useEffect(() => {
    const element = root.current
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let x = 50
    let y = 40
    let raf = 0
    const tick = () => {
      x += (target.current.x - x) * 0.08
      y += (target.current.y - y) * 0.08
      element.style.setProperty("--vibeui-hero-031-x", `${x.toFixed(2)}%`)
      element.style.setProperty("--vibeui-hero-031-y", `${y.toFixed(2)}%`)
      raf = Math.abs(target.current.x - x) + Math.abs(target.current.y - y) > 0.05 ? window.requestAnimationFrame(tick) : 0
    }
    const onMove = (event: globalThis.PointerEvent) => {
      const rect = element.getBoundingClientRect()
      target.current = { x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 }
      if (!raf) raf = window.requestAnimationFrame(tick)
    }
    element.addEventListener("pointermove", onMove)
    return () => {
      element.removeEventListener("pointermove", onMove)
      window.cancelAnimationFrame(raf)
    }
  }, [])

  const magnet = (event: PointerEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const dx = event.clientX - (rect.left + rect.width / 2)
    const dy = event.clientY - (rect.top + rect.height / 2)
    event.currentTarget.style.setProperty("--vibeui-hero-031-mx", (dx * 0.22).toFixed(1))
    event.currentTarget.style.setProperty("--vibeui-hero-031-my", (dy * 0.22).toFixed(1))
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
      <section ref={root} data-vibeui-block="hero-031" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="mesh" aria-hidden="true">
          <i />
          <i />
        </div>
        <div data-part="light" aria-hidden="true" />
        <div data-part="grain" aria-hidden="true" />
        <div data-part="shell">
          {greeting ? <p data-part="greeting">{greeting}</p> : null}
          <h1 data-part="name">
            {words.map((word, index) => (
              <span key={`${word}-${index}`}>
                <span data-part="word" data-last={index === words.length - 1} style={{ ["--vibeui-hero-031-i" as string]: index }}>
                  <span>{word}</span>
                </span>
                {index < words.length - 1 ? " " : null}
              </span>
            ))}
          </h1>
          <p data-part="role" aria-live="polite">
            {text}
            <i aria-hidden="true" />
          </p>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="actions">
            {primaryLabel ? (
              <Button016 data-part="btn" label={primaryLabel} href={primaryHref} external={false} arrow size="lg" tone="accent" accent={accent} onPointerMove={magnet} onPointerLeave={release} style={{ ["--vibeui-hero-031-mx" as string]: 0, ["--vibeui-hero-031-my" as string]: 0 }} />
            ) : null}
            {secondaryLabel ? (
              <Button016 data-part="btn" label={secondaryLabel} href={secondaryHref} external={false} size="lg" tone="neutral" accent={accent} onPointerMove={magnet} onPointerLeave={release} style={{ ["--vibeui-hero-031-mx" as string]: 0, ["--vibeui-hero-031-my" as string]: 0 }} />
            ) : null}
          </div>
          {scrollHint ? (
            <div data-part="hint" aria-hidden="true">
              <i />
              {scrollHint}
            </div>
          ) : null}
          {badge ? (
            <div data-part="badge" aria-hidden="true">
              <svg viewBox="0 0 100 100">
                <defs>
                  <path id="vibeui-hero-031-ring" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                </defs>
                <circle cx="50" cy="50" r="6" />
                <text>
                  <textPath href="#vibeui-hero-031-ring">{badge}</textPath>
                </text>
              </svg>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}

"use client"

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react"

export type About014Fact = {
  value: string
  label: string
}

export type About014Step = {
  years: string
  place: string
  role?: string
}

export type About014Props = {
  eyebrow?: string
  title?: string
  text?: string
  image?: string
  imageAlt?: string
  /** Подпись-каракуля на фото. */
  imageNote?: string
  facts?: readonly About014Fact[]
  skillsLabel?: string
  skills?: readonly string[]
  pathLabel?: string
  path?: readonly About014Step[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Обо мне» для личного сайта: фото чёрно-белое с параллаксом на прокрутке
// (сдвиг пишется в переменную из rAF), по наведению — в цвет; рядом крупный
// заголовок словами из-под маски, три факта, чьи цифры докручиваются при
// появлении в viewport, линия карьеры каскадом. Внизу кинетическая бегущая
// строка навыков: слова через одно контурные, лента ускоряется и скашивается
// от скорости прокрутки (позиция считается в rAF, не CSS-анимацией).
const FONTS = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&family=Inter+Tight:wght@600;800&family=Golos+Text:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="about-014"]){
--vibeui-about-014-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-about-014-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-about-014-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-about-014-on-accent:oklch(from var(--vibeui-about-014-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-about-014-muted:color-mix(in oklab,var(--vibeui-about-014-fg) 60%,var(--vibeui-about-014-bg));
--vibeui-about-014-line:color-mix(in oklab,var(--vibeui-about-014-fg) 12%,transparent);
--vibeui-about-014-panel:color-mix(in oklab,var(--vibeui-about-014-fg) 5%,var(--vibeui-about-014-bg));
--vibeui-about-014-serif:"Playfair Display",Georgia,serif;
--vibeui-about-014-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-about-014-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-about-014-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-about-014-ease:cubic-bezier(.2,.8,.2,1);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="about-014"]{color-scheme:dark}
:where([data-vibeui-block="about-014"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="about-014"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="about-014"]{box-sizing:border-box;position:relative;overflow:hidden;padding:5rem 0 3rem;background:var(--vibeui-about-014-panel);color:var(--vibeui-about-014-fg);font-family:var(--vibeui-about-014-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="about-014"] *{box-sizing:border-box}
[data-vibeui-block="about-014"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem}
[data-vibeui-block="about-014"] [data-part="pic"]{position:relative;aspect-ratio:4 / 5;max-width:26rem;border-radius:1.4rem;overflow:hidden;background:var(--vibeui-about-014-line);box-shadow:0 30px 60px -36px color-mix(in oklab,var(--vibeui-about-014-accent) 50%,rgb(0 0 0 / .6));opacity:0;transform:translateY(2rem) rotate(-2deg);transition:opacity .9s var(--vibeui-about-014-ease),transform .9s var(--vibeui-about-014-ease)}
[data-vibeui-block="about-014"][data-in="true"] [data-part="pic"]{opacity:1;transform:none}
[data-vibeui-block="about-014"] [data-part="pic"] img{width:100%;height:100%;object-fit:cover;display:block;filter:grayscale(1) contrast(1.05);transform:translateY(calc(var(--vibeui-about-014-py,0) * 1px)) scale(1.18);transition:filter .6s;will-change:transform}
[data-vibeui-block="about-014"] [data-part="pic"]:hover img{filter:none}
[data-vibeui-block="about-014"] [data-part="note"]{position:absolute;left:1rem;bottom:1rem;padding:.4rem .7rem;border-radius:999px;background:var(--vibeui-about-014-bg);font-family:var(--vibeui-about-014-mono);font-size:.7rem;color:var(--vibeui-about-014-muted)}
[data-vibeui-block="about-014"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-about-014-mono);font-size:.78rem;color:var(--vibeui-about-014-muted);opacity:0;transition:opacity .6s}
[data-vibeui-block="about-014"][data-in="true"] [data-part="eyebrow"]{opacity:1}
[data-vibeui-block="about-014"] [data-part="title"]{margin:0;font-family:var(--vibeui-about-014-display);font-weight:800;font-size:clamp(2rem,5cqi,3.6rem);line-height:1;letter-spacing:-.04em}
[data-vibeui-block="about-014"] [data-part="word"]{display:inline-block;vertical-align:top;overflow:hidden;padding:.05em .05em .14em;margin:-.05em -.05em -.14em}
[data-vibeui-block="about-014"] [data-part="word"] span{display:inline-block;transform:translateY(130%);transition:transform .9s var(--vibeui-about-014-ease);transition-delay:calc(var(--vibeui-about-014-i) * .06s)}
[data-vibeui-block="about-014"][data-in="true"] [data-part="word"] span{transform:none}
[data-vibeui-block="about-014"] [data-part="text"]{display:block;margin:1.2rem 0 0;font-size:1.1rem;max-width:34rem}
[data-vibeui-block="about-014"] [data-part="rise"]{opacity:0;transform:translateY(1.2rem);transition:opacity .8s var(--vibeui-about-014-ease),transform .8s var(--vibeui-about-014-ease);transition-delay:calc(.2s + var(--vibeui-about-014-i,0) * .08s)}
[data-vibeui-block="about-014"][data-in="true"] [data-part="rise"]{opacity:1;transform:none}
[data-vibeui-block="about-014"] [data-part="facts"]{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin:2rem 0 0;padding:0;list-style:none}
[data-vibeui-block="about-014"] [data-part="facts"] b{display:block;font-family:var(--vibeui-about-014-display);font-weight:800;font-size:clamp(1.8rem,4cqi,2.8rem);letter-spacing:-.04em;line-height:1;color:var(--vibeui-about-014-accent);font-variant-numeric:tabular-nums}
[data-vibeui-block="about-014"] [data-part="facts"] small{display:block;margin-top:.3rem;font-size:.82rem;color:var(--vibeui-about-014-muted)}
[data-vibeui-block="about-014"] [data-part="label"]{margin:2rem 0 .6rem;font-family:var(--vibeui-about-014-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-about-014-muted)}
[data-vibeui-block="about-014"] [data-part="path"]{margin:0;padding:0;list-style:none;display:grid;gap:.5rem}
[data-vibeui-block="about-014"] [data-part="path"] li{display:grid;grid-template-columns:7rem 1fr;gap:1rem;padding:.6rem 0;border-top:1px solid var(--vibeui-about-014-line);font-size:.92rem}
[data-vibeui-block="about-014"] [data-part="path"] span:first-child{font-family:var(--vibeui-about-014-mono);font-size:.78rem;color:var(--vibeui-about-014-muted)}
[data-vibeui-block="about-014"] [data-part="path"] b{font-weight:600}
[data-vibeui-block="about-014"] [data-part="path"] small{display:block;color:var(--vibeui-about-014-muted)}
[data-vibeui-block="about-014"] [data-part="band"]{position:relative;margin-top:1rem;padding:1.4rem 0;background:var(--vibeui-about-014-fg);color:var(--vibeui-about-014-bg);transform:rotate(-2deg) scale(1.04) skewX(calc(var(--vibeui-about-014-skew,0) * 1deg));transform-origin:center;overflow:hidden;white-space:nowrap}
[data-vibeui-block="about-014"] [data-part="band-label"]{max-width:80rem;margin:3.5rem auto 0;padding:0 1.25rem;font-family:var(--vibeui-about-014-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-about-014-muted)}
[data-vibeui-block="about-014"] [data-part="track"]{display:inline-flex;align-items:baseline;gap:2.5rem;padding-right:2.5rem;transform:translate3d(calc(var(--vibeui-about-014-mx,0) * 1px),0,0);will-change:transform}
[data-vibeui-block="about-014"] [data-part="track"] span{font-family:var(--vibeui-about-014-display);font-weight:800;font-size:clamp(2rem,5.5cqi,4.4rem);letter-spacing:-.04em;line-height:1}
[data-vibeui-block="about-014"] [data-part="track"] span:nth-of-type(even){font-family:var(--vibeui-about-014-serif);font-style:italic;font-weight:700;letter-spacing:-.01em;color:transparent;-webkit-text-stroke:1.5px var(--vibeui-about-014-bg)}
[data-vibeui-block="about-014"] [data-part="track"] i{width:.5em;height:.5em;border-radius:50%;background:var(--vibeui-about-014-accent);align-self:center;flex:none}
@container (min-width: 56rem){[data-vibeui-block="about-014"] [data-part="shell"]{grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:4rem;align-items:start}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="about-014"] *{animation:none!important;transition:none!important}[data-vibeui-block="about-014"] [data-part="pic"],[data-vibeui-block="about-014"] [data-part="eyebrow"],[data-vibeui-block="about-014"] [data-part="rise"]{opacity:1;transform:none}[data-vibeui-block="about-014"] [data-part="word"] span{transform:none}[data-vibeui-block="about-014"] [data-part="pic"] img{transform:none}}`

/** «Обо мне»: фото с параллаксом, факты-счётчики, кинетическая лента навыков и линия карьеры. */
export function About014({
  eyebrow = "обо мне",
  title = "Дизайнер, который умеет в код. Или наоборот",
  text = "Семь лет делаю продукты: от лендинга за выходные до дизайн-системы на четыре команды. Люблю ранние стадии, когда важнее собрать, чем согласовать, и не боюсь сам открыть терминал.",
  image = "",
  imageAlt = "",
  imageNote = "Тбилиси, 2026",
  facts = [
    { value: "7", label: "лет в продуктах" },
    { value: "40+", label: "запущенных проектов" },
    { value: "3", label: "команды выросли из моих макетов" },
  ],
  skillsLabel = "чем работаю",
  skills = ["Figma", "React", "Next.js", "TypeScript", "дизайн-системы", "прототипы", "исследования", "анимация", "Framer", "Tailwind"],
  pathLabel = "путь",
  path = [
    { years: "2024 — сейчас", place: "фриланс и партнёрства", role: "дизайн + разработка для стартапов" },
    { years: "2021 — 2024", place: "Точка", role: "ведущий продуктовый дизайнер" },
    { years: "2019 — 2021", place: "агентство «Смена»", role: "дизайнер интерфейсов" },
  ],
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: About014Props) {
  const root = useRef<HTMLElement>(null)
  const pic = useRef<HTMLDivElement>(null)
  const band = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const factsList = useRef<HTMLUListElement>(null)
  const [seen, setSeen] = useState(false)
  const words = title.split(" ")

  useEffect(() => {
    const element = root.current
    if (!element) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(element)
    return () => io.disconnect()
  }, [])

  // Цифры докручиваются: число в тексте факта разбирается на префикс, число и суффикс.
  useEffect(() => {
    const list = factsList.current
    if (!seen || !list || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const rafs: number[] = []
    Array.from(list.querySelectorAll("b")).forEach((node, index) => {
      const match = /^(\D*)(\d+)(.*)$/.exec(node.textContent ?? "")
      if (!match) return
      const [, prefix, digits, suffix] = match
      const target = Number(digits)
      const started = performance.now() + index * 120
      const frame = (now: number) => {
        const progress = Math.min(1, Math.max(0, (now - started) / 1500))
        const eased = 1 - Math.pow(1 - progress, 4)
        node.textContent = `${prefix}${Math.round(target * eased)}${suffix}`
        if (progress < 1) rafs[index] = window.requestAnimationFrame(frame)
      }
      rafs[index] = window.requestAnimationFrame(frame)
    })
    return () => rafs.forEach((id) => window.cancelAnimationFrame(id))
  }, [seen])

  // Один цикл rAF на секцию: параллакс фото и лента, скорость и скос которой зависят от прокрутки.
  useEffect(() => {
    const element = root.current
    const strip = track.current
    const ribbon = band.current
    const photo = pic.current
    if (!element || !strip || !ribbon || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let raf = 0
    let active = false
    let x = 0
    let lastY = window.scrollY
    let velocity = 0
    let skew = 0
    const loop = () => {
      const scrollY = window.scrollY
      velocity = velocity * 0.9 + (scrollY - lastY) * 0.1
      lastY = scrollY
      const half = strip.scrollWidth / 2
      x -= 0.8 + Math.min(40, Math.abs(velocity)) * 0.35
      if (half > 0 && x <= -half) x += half
      strip.style.setProperty("--vibeui-about-014-mx", x.toFixed(1))
      skew += (Math.max(-14, Math.min(14, -velocity * 0.6)) - skew) * 0.12
      ribbon.style.setProperty("--vibeui-about-014-skew", skew.toFixed(2))
      if (photo) {
        const rect = photo.getBoundingClientRect()
        const centre = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight
        photo.style.setProperty("--vibeui-about-014-py", (centre * -rect.height * 0.08).toFixed(1))
      }
      raf = active ? window.requestAnimationFrame(loop) : 0
    }
    const io = new IntersectionObserver((entries) => {
      active = entries.some((entry) => entry.isIntersecting)
      if (active && !raf) raf = window.requestAnimationFrame(loop)
    })
    io.observe(element)
    return () => {
      io.disconnect()
      active = false
      window.cancelAnimationFrame(raf)
    }
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-about-014-accent": accent } : null),
    ...(ink ? { "--vibeui-about-014-fg": ink } : null),
    ...(background ? { "--vibeui-about-014-bg": background } : null),
    ...style,
  } as CSSProperties

  const ribbon = [...skills, ...skills]

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-about-014" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="about-014" data-tone={tone === "auto" ? undefined : tone} data-in={seen} className={className} style={palette}>
        <div data-part="shell">
          <div ref={pic} data-part="pic">
            {image ? <img src={image} alt={imageAlt} loading="lazy" /> : null}
            {imageNote ? <span data-part="note">{imageNote}</span> : null}
          </div>
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">
              {words.map((word, index) => (
                <span key={`${word}-${index}`}>
                  <span data-part="word" style={{ ["--vibeui-about-014-i" as string]: index }}>
                    <span>{word}</span>
                  </span>
                  {index < words.length - 1 ? " " : null}
                </span>
              ))}
            </h2>
            {text ? (
              <p data-part="rise" style={{ ["--vibeui-about-014-i" as string]: 0 }}>
                <span data-part="text">
                  {text}
                </span>
              </p>
            ) : null}
            {facts.length > 0 ? (
              <ul ref={factsList} data-part="facts">
                {facts.map((fact, index) => (
                  <li key={fact.label} data-part="rise" style={{ ["--vibeui-about-014-i" as string]: index + 1 }}>
                    <b>{fact.value}</b>
                    <small>{fact.label}</small>
                  </li>
                ))}
              </ul>
            ) : null}
            {path.length > 0 ? (
              <>
                <p data-part="label">{pathLabel}</p>
                <ol data-part="path">
                  {path.map((step, index) => (
                    <li key={step.years} data-part="rise" style={{ ["--vibeui-about-014-i" as string]: index + 4 }}>
                      <span>{step.years}</span>
                      <span>
                        <b>{step.place}</b>
                        {step.role ? <small>{step.role}</small> : null}
                      </span>
                    </li>
                  ))}
                </ol>
              </>
            ) : null}
          </div>
        </div>
        {skills.length > 0 ? (
          <>
            {skillsLabel ? <p data-part="band-label">{skillsLabel}</p> : null}
            <div ref={band} data-part="band" aria-label={skills.join(", ")}>
              <div ref={track} data-part="track" aria-hidden="true">
                {ribbon.map((skill, index) => (
                  <Fragment key={`${skill}-${index}`}>
                    <span>{skill}</span>
                    <i />
                  </Fragment>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </section>
    </>
  )
}

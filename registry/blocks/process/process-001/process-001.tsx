"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Process001Step = {
  title: string
  text: string
  /** «бесплатно», «30 мин», «1–3 дня». */
  note?: string
}

export type Process001Props = {
  eyebrow?: string
  title?: string
  lede?: string
  steps?: readonly Process001Step[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Как проходит: шаги вдоль линии-пути. По линии бежит неоновый импульс
// (@keyframes на градиенте), шаги загораются по мере скролла — узел
// вспыхивает, номер светится, карточка проявляется. Активный шаг считается
// IntersectionObserver; всё, что выше него, остаётся зажжённым. На широком
// экране линия горизонтальная, шаги в ряд; на узком — вертикальная.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"

const STYLES = `
:where([data-vibeui-block="process-001"]){
--vibeui-process-001-bg:#07060b;
--vibeui-process-001-fg:#f3eefc;
--vibeui-process-001-muted:#a39bb5;
--vibeui-process-001-line:rgb(255 255 255 / .12);
--vibeui-process-001-card:#110e1a;
--vibeui-process-001-accent:#ff2bd6;
--vibeui-process-001-accent-2:#8b5cff;
--vibeui-process-001-cyan:#22f3ff;
--vibeui-process-001-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-process-001-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-process-001-mono:"JetBrains Mono",ui-monospace,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="process-001"]{color-scheme:dark}
:where([data-vibeui-block="process-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="process-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="process-001"]{box-sizing:border-box;display:block;background:var(--vibeui-process-001-bg);color:var(--vibeui-process-001-fg);font-family:var(--vibeui-process-001-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="process-001"] *{box-sizing:border-box}
[data-vibeui-block="process-001"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="process-001"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 .75rem;font-family:var(--vibeui-process-001-mono);font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-process-001-cyan);text-shadow:0 0 10px color-mix(in oklab,var(--vibeui-process-001-cyan) 70%,transparent)}
[data-vibeui-block="process-001"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-process-001-cyan);box-shadow:0 0 8px var(--vibeui-process-001-cyan)}
[data-vibeui-block="process-001"] [data-part="title"]{margin:0;font-family:var(--vibeui-process-001-display);font-size:clamp(1.8rem,3.8cqi,2.8rem);font-weight:700;line-height:1.05;letter-spacing:-.02em;text-transform:uppercase}
[data-vibeui-block="process-001"] [data-part="lede"]{margin:.75rem 0 2.5rem;max-width:36rem;color:var(--vibeui-process-001-muted)}
[data-vibeui-block="process-001"] [data-part="steps"]{position:relative;display:grid;gap:1.5rem;margin:0;padding:0 0 0 2.5rem;list-style:none}
[data-vibeui-block="process-001"] [data-part="rail"]{position:absolute;left:.75rem;top:.75rem;bottom:.75rem;width:2px;background:var(--vibeui-process-001-line);overflow:hidden}
[data-vibeui-block="process-001"] [data-part="rail"]::before{content:"";position:absolute;left:0;top:0;width:100%;height:var(--vibeui-process-001-p,0%);background:linear-gradient(180deg,var(--vibeui-process-001-accent-2),var(--vibeui-process-001-accent));box-shadow:0 0 10px var(--vibeui-process-001-accent);transition:height .8s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="process-001"] [data-part="rail"]::after{content:"";position:absolute;left:-3px;width:8px;height:4rem;border-radius:4px;background:linear-gradient(180deg,transparent,var(--vibeui-process-001-cyan),transparent);filter:blur(1px);animation:vibeui-process-001-pulse 3s linear infinite}
@keyframes vibeui-process-001-pulse{from{top:-4rem}to{top:100%}}
[data-vibeui-block="process-001"] [data-part="step"]{position:relative;padding:1.1rem 1.25rem;border-radius:.9rem;background:var(--vibeui-process-001-card);border:1px solid var(--vibeui-process-001-line);opacity:.45;transform:translateX(8px);transition:opacity .6s,transform .6s cubic-bezier(.2,.8,.2,1),border-color .6s,box-shadow .6s}
[data-vibeui-block="process-001"] [data-part="step"][data-lit="true"]{opacity:1;transform:none;border-color:color-mix(in oklab,var(--vibeui-process-001-accent) 45%,transparent);box-shadow:0 0 22px color-mix(in oklab,var(--vibeui-process-001-accent) 18%,transparent)}
[data-vibeui-block="process-001"] [data-part="node"]{position:absolute;left:-2.5rem;top:1.1rem;width:1.5rem;height:1.5rem;margin-left:.05rem;border-radius:50%;border:2px solid var(--vibeui-process-001-line);background:var(--vibeui-process-001-bg);display:grid;place-items:center;font-family:var(--vibeui-process-001-mono);font-size:.62rem;font-weight:700;color:var(--vibeui-process-001-muted);transition:border-color .5s,box-shadow .5s,color .5s,transform .5s cubic-bezier(.2,.9,.3,1.4)}
[data-vibeui-block="process-001"] [data-part="step"][data-lit="true"] [data-part="node"]{border-color:var(--vibeui-process-001-accent);color:var(--vibeui-process-001-accent);box-shadow:0 0 12px var(--vibeui-process-001-accent),0 0 28px color-mix(in oklab,var(--vibeui-process-001-accent) 50%,transparent);transform:scale(1.15)}
[data-vibeui-block="process-001"] [data-part="step-title"]{margin:0;font-family:var(--vibeui-process-001-display);font-size:1.1rem;font-weight:600;line-height:1.2}
[data-vibeui-block="process-001"] [data-part="text"]{margin:.4rem 0 0;font-size:.92rem;color:var(--vibeui-process-001-muted)}
[data-vibeui-block="process-001"] [data-part="note"]{display:inline-block;margin-top:.75rem;padding:.2rem .55rem;border-radius:.35rem;border:1px solid color-mix(in oklab,var(--vibeui-process-001-cyan) 50%,transparent);font-family:var(--vibeui-process-001-mono);font-size:.72rem;color:var(--vibeui-process-001-cyan);text-shadow:0 0 8px color-mix(in oklab,var(--vibeui-process-001-cyan) 60%,transparent)}
@container (min-width: 60rem){
[data-vibeui-block="process-001"] [data-part="shell"]{padding:5.5rem 2rem}
[data-vibeui-block="process-001"] [data-part="steps"]{grid-template-columns:repeat(var(--vibeui-process-001-count,5),minmax(0,1fr));gap:1rem;padding:2.5rem 0 0}
[data-vibeui-block="process-001"] [data-part="rail"]{left:.75rem;right:.75rem;top:.7rem;bottom:auto;width:auto;height:2px}
[data-vibeui-block="process-001"] [data-part="rail"]::before{width:var(--vibeui-process-001-p,0%);height:100%;background:linear-gradient(90deg,var(--vibeui-process-001-accent-2),var(--vibeui-process-001-accent));transition:width .8s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="process-001"] [data-part="rail"]::after{top:-3px;left:auto;width:4rem;height:8px;background:linear-gradient(90deg,transparent,var(--vibeui-process-001-cyan),transparent);animation:vibeui-process-001-pulse-x 3s linear infinite}
@keyframes vibeui-process-001-pulse-x{from{left:-4rem}to{left:100%}}
[data-vibeui-block="process-001"] [data-part="step"]{transform:translateY(8px)}
[data-vibeui-block="process-001"] [data-part="node"]{left:0;top:-2.5rem;margin-left:0}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="process-001"] *{animation:none!important;transition:none!important}[data-vibeui-block="process-001"] [data-part="step"]{opacity:1;transform:none}}`

const DEFAULT_STEPS: Process001Step[] = [
  { title: "Идея", text: "Пишете в мессенджер или приходите: что, где, размер, референсы. Обсуждаем, кому из мастеров это ближе.", note: "бесплатно" },
  { title: "Эскиз", text: "Мастер рисует под вашу анатомию: примеряем на фото, правим до «да».", note: "1–3 дня" },
  { title: "Согласование", text: "Финальный размер, место, цена и дата. Предоплата 20 % держит окно.", note: "30 мин" },
  { title: "Сеанс", text: "Стерильный кабинет, одноразовые иглы и краски вскрываются при вас. Перерывы каждые 40 минут.", note: "от 1 ч" },
  { title: "Уход", text: "Плёнка, инструкция и бесплатная коррекция через месяц. Мастер на связи, пока не заживёт.", note: "30 дней" },
]

/** Как проходит: шаги вдоль неоновой линии с бегущим импульсом, загораются по скроллу. */
export function Process001({
  eyebrow = "Как проходит",
  title = "От идеи до зажившей кожи",
  lede = "Пять шагов, ни один не пропускаем. Половина времени — до иглы.",
  steps = DEFAULT_STEPS,
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Process001Props) {
  const list = useRef<HTMLOListElement>(null)
  const [lit, setLit] = useState(-1)
  const palette = {
    ...(accent ? { "--vibeui-process-001-accent": accent } : null),
    ...(background ? { "--vibeui-process-001-bg": background } : null),
    ...style,
  } as CSSProperties

  useEffect(() => {
    const node = list.current
    if (!node || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const index = Number((entry.target as HTMLElement).dataset.index)
          setLit((value) => Math.max(value, index))
        })
      },
      { rootMargin: "0px 0px -25% 0px", threshold: 0.4 },
    )
    Array.from(node.querySelectorAll("[data-index]")).forEach((child) => observer.observe(child))
    return () => observer.disconnect()
  }, [steps])

  const progress = steps.length > 1 ? Math.max(0, lit) / (steps.length - 1) : 1

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-process-001" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="process-001" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <ol ref={list} data-part="steps" style={{ ["--vibeui-process-001-count" as string]: steps.length, ["--vibeui-process-001-p" as string]: `${progress * 100}%` }}>
            <span data-part="rail" aria-hidden="true" />
            {steps.map((step, index) => (
              <li key={step.title} data-part="step" data-index={index} data-lit={index <= lit}>
                <span data-part="node" aria-hidden="true">
                  {index + 1}
                </span>
                <h3 data-part="step-title">{step.title}</h3>
                <p data-part="text">{step.text}</p>
                {step.note ? <span data-part="note">{step.note}</span> : null}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}

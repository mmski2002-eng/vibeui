"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type House003Fact = { value: string; label: string; text?: string }

export type House003Props = {
  eyebrow?: string
  title?: string
  lede?: string
  facts?: readonly House003Fact[]
  image?: string
  imageAlt?: string
  imageCaption?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Технология бруса на липкой сцене: изометрическая балка из пяти ламелей
// при прокрутке «разъезжается» по слоям, а справа по очереди загораются
// свойства — каждое соответствует своему слою. Высота секции задаёт длину
// анимации; без движения ламели сразу стоят раздвинутыми, а список виден целиком.
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"

const S = '[data-vibeui-block="house-003"]'
const STYLES = `
:where(${S}){
--vibeui-house-003-bg:light-dark(#f4f1ec,#0e0f10);
--vibeui-house-003-fg:light-dark(#16181a,#f2efe9);
--vibeui-house-003-accent:#e8a35c;
--vibeui-house-003-wood:#c98d4f;
--vibeui-house-003-muted:color-mix(in oklab,var(--vibeui-house-003-fg) 58%,transparent);
--vibeui-house-003-line:color-mix(in oklab,var(--vibeui-house-003-fg) 12%,transparent);
--vibeui-house-003-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-house-003-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) ${S}{color-scheme:dark}
:where(${S}[data-tone="light"]){color-scheme:light}
:where(${S}[data-tone="dark"]){color-scheme:dark}
${S}{position:relative;height:min(240vh,400rem);background:var(--vibeui-house-003-bg);color:var(--vibeui-house-003-fg);font-family:var(--vibeui-house-003-font)}
${S} *{box-sizing:border-box}
${S} [data-part="stage"]{position:sticky;top:0;display:flex;align-items:center;min-height:100vh;padding:5.5rem 0 2rem;overflow:hidden}
${S} [data-part="shell"]{display:grid;gap:2rem;width:100%;max-width:90rem;margin:0 auto;padding:0 clamp(1rem,3cqi,2.5rem);align-items:center}
${S} [data-part="eyebrow"]{display:flex;align-items:center;gap:.7rem;margin:0 0 1rem;font-family:var(--vibeui-house-003-mono);font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-house-003-muted)}
${S} [data-part="eyebrow"]::before{content:"";width:1.6rem;height:1px;background:var(--vibeui-house-003-accent)}
${S} [data-part="title"]{margin:0;font-weight:300;font-size:clamp(2rem,4.8cqi,4rem);line-height:1.02;letter-spacing:-.04em}
${S} [data-part="lede"]{margin:1rem 0 0;max-width:34rem;color:var(--vibeui-house-003-muted);font-size:.95rem}
${S} [data-part="scene"]{position:relative;height:clamp(17rem,40cqi,30rem);perspective:1400px}
${S} [data-part="scene"]::before{content:"";position:absolute;left:50%;top:55%;width:70%;aspect-ratio:1;translate:-50% -50%;border-radius:50%;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-house-003-accent) 26%,transparent),transparent 62%);filter:blur(10px)}
${S} [data-part="beam"]{position:absolute;left:50%;top:50%;width:min(62%,20rem);aspect-ratio:1;transform:translate(-50%,-40%) rotateX(58deg) rotateZ(-38deg);transform-style:preserve-3d}
${S} [data-part="layer"]{position:absolute;inset:0;transform:translateZ(calc((var(--vibeui-house-003-n) - 2) * (1.15rem + var(--vibeui-house-003-p) * 2.8rem)));transform-style:preserve-3d;transition:filter .5s}
${S} [data-part="layer"] i{position:absolute;inset:0;border-radius:.25rem;background:repeating-linear-gradient(98deg,rgb(0 0 0 / 0) 0 .7rem,rgb(90 45 10 / .16) .7rem .78rem),linear-gradient(135deg,#e6b47a,var(--vibeui-house-003-wood) 55%,#a7693a);box-shadow:inset 0 0 0 1px rgb(255 230 190 / .25)}
${S} [data-part="layer"] i::before{content:"";position:absolute;left:0;right:0;top:100%;height:1.15rem;transform-origin:top;transform:rotateX(-90deg);background:repeating-linear-gradient(90deg,#9a5f31 0 .2rem,#b8783f .2rem .55rem);filter:brightness(.85)}
${S} [data-part="layer"] i::after{content:"";position:absolute;top:0;bottom:0;left:100%;width:1.15rem;transform-origin:left;transform:rotateY(90deg);background:repeating-radial-gradient(circle at 0% 50%,#a5683a 0 .18rem,#c48a52 .18rem .4rem);filter:brightness(.72)}
${S} [data-part="layer"][data-on="true"]{filter:drop-shadow(0 0 18px color-mix(in oklab,var(--vibeui-house-003-accent) 70%,transparent)) brightness(1.12)}
${S} [data-part="photo"]{position:absolute;right:0;bottom:0;width:clamp(6rem,16cqi,9.5rem);margin:0;border:1px solid var(--vibeui-house-003-line);border-radius:1rem;overflow:hidden;background:var(--vibeui-house-003-line);box-shadow:0 20px 40px -20px rgb(0 0 0 / .8)}
${S} [data-part="photo"] img{display:block;width:100%;aspect-ratio:1;object-fit:cover;transform:scale(calc(1.25 - var(--vibeui-house-003-p) * .25))}
${S} [data-part="photo"] figcaption{padding:.4rem .6rem;font-family:var(--vibeui-house-003-mono);font-size:.58rem;color:var(--vibeui-house-003-muted)}
${S} [data-part="facts"]{display:grid;gap:.4rem;margin:1.8rem 0 0;padding:0;list-style:none;counter-reset:fact}
${S} [data-part="fact"]{display:grid;grid-template-columns:auto 1fr;gap:.1rem 1rem;padding:.85rem 0;border-top:1px solid var(--vibeui-house-003-line);opacity:.32;transition:opacity .5s}
${S} [data-part="fact"][data-on="true"]{opacity:1}
${S} [data-part="fact"] b{grid-row:1/3;min-width:5.5ch;font-family:var(--vibeui-house-003-mono);font-size:1.5rem;font-weight:500;letter-spacing:-.03em;color:var(--vibeui-house-003-accent)}
${S} [data-part="fact"] span{font-weight:600;font-size:.95rem}
${S} [data-part="fact"] small{font-size:.8rem;color:var(--vibeui-house-003-muted)}
@container (min-width: 60rem){${S} [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:4rem}${S} [data-part="scene"]{order:-1}}
@media (prefers-reduced-motion:reduce){${S}{height:auto}${S} [data-part="stage"]{position:relative}${S} *{transition:none!important}${S} [data-part="fact"]{opacity:1}}`

const DEFAULT_FACTS: House003Fact[] = [
  { value: "5", label: "ламелей в сечении", text: "Склеены по волокну встречно — брус не ведёт и не крутит." },
  { value: "12 %", label: "влажность с завода", text: "Камерная сушка: дом не «садится» и не трескается." },
  { value: "<1 %", label: "усадка за первый год", text: "Отделку начинаем сразу, без года ожидания." },
  { value: "×1,7", label: "теплее бревна", text: "Плотный стык «гребень-паз» с утеплителем в пазу." },
  { value: "6 мес", label: "от проекта до ключей", text: "Домокомплект готовится на заводе, пока идёт фундамент." },
]

/** Технология клеёного бруса: балка раскладывается на ламели при прокрутке. */
export function House003({
  eyebrow = "Технология",
  title = "Брус, который не садится и не трескается",
  lede = "Клеёный брус — это не бревно. Пять просушенных ламелей, склеенных встречно волокнами: геометрия на десятилетия и въезд без года усадки.",
  facts = DEFAULT_FACTS,
  image = "/demo/house/tech.webp",
  imageAlt = "Срез клеёного бруса",
  imageCaption = "сечение 200 × 280",
  tone = "dark",
  accent,
  ink,
  background,
  className,
  style,
}: House003Props) {
  const ref = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect()
        const span = rect.height - window.innerHeight
        setProgress(reduced ? 1 : span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 1)
      })
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  const active = Math.min(facts.length - 1, Math.floor(progress * facts.length * 0.999))

  const palette = {
    ...(accent ? { "--vibeui-house-003-accent": accent } : null),
    ...(ink ? { "--vibeui-house-003-fg": ink } : null),
    ...(background ? { "--vibeui-house-003-bg": background } : null),
    "--vibeui-house-003-p": progress,
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-house-003" precedence="medium">
        {STYLES}
      </style>
      <section ref={ref} data-vibeui-block="house-003" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="stage">
          <div data-part="shell">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
              <ol data-part="facts">
                {facts.map((fact, factIndex) => (
                  <li key={fact.label} data-part="fact" data-on={factIndex <= active}>
                    <b>{fact.value}</b>
                    <span>{fact.label}</span>
                    {fact.text ? <small>{fact.text}</small> : null}
                  </li>
                ))}
              </ol>
            </div>
            <div data-part="scene" aria-hidden="true">
              <div data-part="beam">
                {[0, 1, 2, 3, 4].map((layer) => (
                  <div key={layer} data-part="layer" data-on={layer === 4 - (active % 5)} style={{ ["--vibeui-house-003-n" as string]: layer }}>
                    <i />
                  </div>
                ))}
              </div>
              {image ? (
                <figure data-part="photo">
                  <img src={image} alt={imageAlt} loading="lazy" />
                  {imageCaption ? <figcaption>{imageCaption}</figcaption> : null}
                </figure>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

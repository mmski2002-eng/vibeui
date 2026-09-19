"use client"

import { Fragment, useEffect, useRef, type CSSProperties, type ReactNode } from "react"

export type Hero036Props = {
  eyebrow?: string
  /** Строки через «|», курсивный акцент — *между звёздочками*. */
  title?: string
  lede?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  /** Три факта под кнопками: «с 2014», «от 2 ч», «7+ дней». */
  facts?: readonly { value: string; label: string }[]
  /** Рукописная пометка у букета. */
  note?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Хиро цветочной мастерской: справа букет из пяти SVG-слоёв — ваза, листья,
// стебли, задние и передние бутоны, — которые при загрузке по очереди
// «встают» в вазу, а при прокрутке разъезжаются параллаксом (каждому слою
// своя глубина, transform через одну CSS-переменную). Слева заголовок
// въезжает строками сквозь маску, под ним кнопки и три факта. Пометка
// у букета — рукописная, Caveat, со стрелкой.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Golos+Text:wght@400;500;600&family=Caveat:wght@500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-036"]){
--vibeui-hero-036-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-hero-036-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-036-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-036-on-accent:oklch(from var(--vibeui-hero-036-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-036-muted:color-mix(in oklab,var(--vibeui-hero-036-fg) 62%,var(--vibeui-hero-036-bg));
--vibeui-hero-036-line:color-mix(in oklab,var(--vibeui-hero-036-fg) 16%,transparent);
--vibeui-hero-036-petal:var(--vibeui-hero-036-accent);
--vibeui-hero-036-petal-2:color-mix(in oklab,var(--vibeui-hero-036-accent) 76%,var(--vibeui-hero-036-bg));
--vibeui-hero-036-petal-3:color-mix(in oklab,var(--vibeui-hero-036-accent) 52%,var(--vibeui-hero-036-bg));
--vibeui-hero-036-leaf:color-mix(in oklab,var(--vibeui-hero-036-fg) 10%,var(--vibeui-hero-036-bg));
--vibeui-hero-036-display:"Cormorant",Georgia,"Times New Roman",serif;
--vibeui-hero-036-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-036-hand:"Caveat","Segoe Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-036"]{color-scheme:dark}
:where([data-vibeui-block="hero-036"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-036"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-036"]{box-sizing:border-box;position:relative;overflow:hidden;padding:2.5rem 0 3.5rem;background:var(--vibeui-hero-036-bg);color:var(--vibeui-hero-036-fg);font-family:var(--vibeui-hero-036-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-036"] *{box-sizing:border-box}
[data-vibeui-block="hero-036"] [data-part="shell"]{max-width:84rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem;align-items:center}
[data-vibeui-block="hero-036"] [data-part="eyebrow"]{margin:0 0 1.2rem;font-size:.74rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-hero-036-muted)}
[data-vibeui-block="hero-036"] [data-part="eyebrow"]::before{content:"";display:inline-block;width:2rem;height:1px;margin:0 .7rem .25em 0;background:var(--vibeui-hero-036-accent);vertical-align:middle}
[data-vibeui-block="hero-036"] [data-part="title"]{margin:0;font-family:var(--vibeui-hero-036-display);font-weight:500;font-size:clamp(2.7rem,7.2cqi,5.8rem);line-height:.98;letter-spacing:-.02em;text-wrap:balance}
[data-vibeui-block="hero-036"] [data-part="line"]{display:block;overflow:hidden;padding-bottom:.06em;margin-bottom:-.06em}
[data-vibeui-block="hero-036"] [data-part="line"]>span{display:block;transform:translateY(110%);animation:vibeui-hero-036-slide .9s cubic-bezier(.2,.7,.2,1) forwards;animation-delay:calc(.15s + var(--vibeui-hero-036-i) * .13s)}
[data-vibeui-block="hero-036"] [data-part="title"] em{font-style:italic;font-weight:500;color:var(--vibeui-hero-036-accent)}
[data-vibeui-block="hero-036"] [data-part="lede"]{max-width:30rem;margin:1.6rem 0 0;font-size:1.05rem;color:var(--vibeui-hero-036-muted);opacity:0;animation:vibeui-hero-036-fade .8s ease-out .6s forwards}
[data-vibeui-block="hero-036"] [data-part="actions"]{display:flex;flex-wrap:wrap;align-items:center;gap:1rem 1.6rem;margin:1.8rem 0 0;opacity:0;animation:vibeui-hero-036-fade .8s ease-out .75s forwards}
[data-vibeui-block="hero-036"] [data-part="primary"]{display:inline-flex;align-items:center;gap:.5rem;padding:.9rem 1.5rem;border-radius:999px;background:var(--vibeui-hero-036-accent);color:var(--vibeui-hero-036-on-accent);text-decoration:none;font-weight:500;transition:transform .2s,box-shadow .25s}
[data-vibeui-block="hero-036"] [data-part="primary"]:hover{transform:translateY(-2px);box-shadow:0 14px 30px -14px var(--vibeui-hero-036-accent)}
[data-vibeui-block="hero-036"] [data-part="secondary"]{color:var(--vibeui-hero-036-fg);text-decoration:none;font-weight:500;border-bottom:1px solid var(--vibeui-hero-036-fg);padding-bottom:.1rem;transition:color .2s,border-color .2s}
[data-vibeui-block="hero-036"] [data-part="secondary"]:hover{color:var(--vibeui-hero-036-accent);border-color:var(--vibeui-hero-036-accent)}
[data-vibeui-block="hero-036"] a:focus-visible{outline:2px solid var(--vibeui-hero-036-accent);outline-offset:3px}
[data-vibeui-block="hero-036"] [data-part="facts"]{display:flex;flex-wrap:wrap;gap:1.2rem 2.4rem;margin:2.4rem 0 0;padding:1.4rem 0 0;border-top:1px solid var(--vibeui-hero-036-line);list-style:none;opacity:0;animation:vibeui-hero-036-fade .8s ease-out .9s forwards}
[data-vibeui-block="hero-036"] [data-part="facts"] b{display:block;font-family:var(--vibeui-hero-036-display);font-weight:600;font-size:1.9rem;line-height:1;letter-spacing:-.02em}
[data-vibeui-block="hero-036"] [data-part="facts"] span{display:block;margin-top:.3rem;font-size:.82rem;color:var(--vibeui-hero-036-muted)}
[data-vibeui-block="hero-036"] [data-part="scene"]{position:relative;width:min(100%,26rem);aspect-ratio:4/5;margin:0 auto}
[data-vibeui-block="hero-036"] [data-part="wash"]{position:absolute;left:10%;top:6%;width:80%;aspect-ratio:1;border-radius:50%;background:color-mix(in oklab,var(--vibeui-hero-036-accent) 12%,transparent);filter:blur(40px)}
[data-vibeui-block="hero-036"] [data-part="layer"]{position:absolute;inset:0;transform:translate3d(0,calc(var(--vibeui-hero-036-y,0) * var(--vibeui-hero-036-d) * -1px),0);will-change:transform}
[data-vibeui-block="hero-036"] [data-part="sheet"]{display:block;width:100%;height:100%;overflow:visible;opacity:0;animation:vibeui-hero-036-rise 1s cubic-bezier(.2,.7,.2,1) forwards;animation-delay:calc(.1s + var(--vibeui-hero-036-i) * .14s)}
[data-vibeui-block="hero-036"] [data-part="stems"]{fill:none;stroke:var(--vibeui-hero-036-fg);stroke-width:2;stroke-linecap:round}
[data-vibeui-block="hero-036"] [data-part="leaf"]{fill:var(--vibeui-hero-036-leaf);stroke:var(--vibeui-hero-036-fg);stroke-width:1.4;stroke-linejoin:round}
[data-vibeui-block="hero-036"] [data-part="vase"]{fill:var(--vibeui-hero-036-bg);stroke:var(--vibeui-hero-036-fg);stroke-width:2;stroke-linejoin:round}
[data-vibeui-block="hero-036"] [data-part="note"]{position:absolute;right:-.5rem;top:2%;max-width:9rem;font-family:var(--vibeui-hero-036-hand);font-size:1.35rem;line-height:1.05;color:var(--vibeui-hero-036-accent);transform:translate3d(0,calc(var(--vibeui-hero-036-y,0) * -.3px),0) rotate(-6deg);opacity:0;animation:vibeui-hero-036-fade .8s ease-out 1.1s forwards}
[data-vibeui-block="hero-036"] [data-part="note"] svg{display:block;width:3rem;height:2rem;margin:.2rem 0 0 .4rem;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
@keyframes vibeui-hero-036-slide{to{transform:translateY(0)}}
@keyframes vibeui-hero-036-fade{to{opacity:1}}
@keyframes vibeui-hero-036-rise{from{opacity:0;transform:translateY(46px) rotate(-2deg)}to{opacity:1;transform:translateY(0) rotate(0)}}
@container (min-width: 40rem){[data-vibeui-block="hero-036"] [data-part="note"]{right:-2rem}}
@container (min-width: 58rem){[data-vibeui-block="hero-036"] [data-part="shell"]{grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:3rem;min-height:calc(100svh - 4.25rem)}[data-vibeui-block="hero-036"] [data-part="scene"]{width:min(100%,32rem);margin:0 0 0 auto}[data-vibeui-block="hero-036"] [data-part="note"]{right:-3rem;top:4%}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-036"] *{animation:none!important;transition:none!important}[data-vibeui-block="hero-036"] [data-part="line"]>span{transform:none}[data-vibeui-block="hero-036"] [data-part="lede"],[data-vibeui-block="hero-036"] [data-part="actions"],[data-vibeui-block="hero-036"] [data-part="facts"],[data-vibeui-block="hero-036"] [data-part="sheet"],[data-vibeui-block="hero-036"] [data-part="note"]{opacity:1}[data-vibeui-block="hero-036"] [data-part="layer"],[data-vibeui-block="hero-036"] [data-part="note"]{transform:none}}`

function renderLine(line: string) {
  // *слово* — курсивный акцент
  const parts = line.split(/(\*[^*]+\*)/g).filter(Boolean)
  return parts.map((part, index) => (part.startsWith("*") && part.endsWith("*") ? <em key={index}>{part.slice(1, -1)}</em> : <Fragment key={index}>{part}</Fragment>))
}

function Leaf({ x, y, rotate, scale = 1 }: { x: number; y: number; rotate: number; scale?: number }) {
  return <path data-part="leaf" transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`} d="M0 0C-18 -10 -28 -34 -20 -62C0 -50 12 -26 0 0Z" />
}

function Poppy({ x, y, r, shade = "var(--vibeui-hero-036-petal)" }: { x: number; y: number; r: number; shade?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 45, 90, 135].map((angle) => (
        <ellipse key={angle} rx={r} ry={r * 0.62} transform={`rotate(${angle})`} fill={shade} opacity={0.9} />
      ))}
      <circle r={r * 0.22} fill="var(--vibeui-hero-036-fg)" />
      <circle r={r * 0.36} fill="none" stroke="var(--vibeui-hero-036-fg)" strokeWidth={1} strokeDasharray="2 3" opacity={0.7} />
    </g>
  )
}

function Peony({ x, y, r }: { x: number; y: number; r: number }) {
  const rings: { count: number; radius: number; shade: string }[] = [
    { count: 9, radius: r, shade: "var(--vibeui-hero-036-petal-3)" },
    { count: 7, radius: r * 0.7, shade: "var(--vibeui-hero-036-petal-2)" },
    { count: 5, radius: r * 0.42, shade: "var(--vibeui-hero-036-petal)" },
  ]
  return (
    <g transform={`translate(${x} ${y})`}>
      {rings.map((ring, ringIndex) =>
        Array.from({ length: ring.count }, (_, index) => {
          const angle = (360 / ring.count) * index + ringIndex * 17
          return <ellipse key={`${ringIndex}-${index}`} cx={ring.radius * 0.5} rx={ring.radius * 0.55} ry={ring.radius * 0.36} transform={`rotate(${angle})`} fill={ring.shade} stroke="var(--vibeui-hero-036-bg)" strokeWidth={1} />
        }),
      )}
      <circle r={r * 0.12} fill="var(--vibeui-hero-036-petal)" />
    </g>
  )
}

function Daisy({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: 12 }, (_, index) => (
        <ellipse key={index} cx={r * 0.58} rx={r * 0.48} ry={r * 0.16} transform={`rotate(${index * 30})`} fill="var(--vibeui-hero-036-bg)" stroke="var(--vibeui-hero-036-fg)" strokeWidth={1} />
      ))}
      <circle r={r * 0.28} fill="var(--vibeui-hero-036-petal-2)" stroke="var(--vibeui-hero-036-fg)" strokeWidth={1} />
    </g>
  )
}

function Bud({ x, y, rotate = 0 }: { x: number; y: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <ellipse rx={9} ry={16} fill="var(--vibeui-hero-036-petal-2)" />
      <path d="M-8 6 L0 18 L8 6" fill="none" stroke="var(--vibeui-hero-036-fg)" strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M0 -14 L0 14" stroke="var(--vibeui-hero-036-bg)" strokeWidth={1} opacity={0.6} />
    </g>
  )
}

function Layer({ index, depth, children }: { index: number; depth: number; children: ReactNode }) {
  return (
    <div data-part="layer" style={{ ["--vibeui-hero-036-d" as string]: depth }}>
      <svg data-part="sheet" viewBox="0 0 400 520" aria-hidden="true" style={{ ["--vibeui-hero-036-i" as string]: index }}>
        {children}
      </svg>
    </div>
  )
}

/** Хиро с букетом из слоёв: собирается при загрузке, разъезжается на прокрутке. */
export function Hero036({
  eyebrow = "Цветочная мастерская · Петербург",
  title = "Букеты,|которые собирают|как *письмо*",
  lede = "Без целлофана и бантов. Сезонные цветы с ферм Ленобласти и Голландии, собранные в тот же день, доставка к часу.",
  primaryLabel = "Собрать букет",
  primaryHref = "#builder",
  secondaryLabel = "Смотреть готовые",
  secondaryHref = "#catalog",
  facts = [
    { value: "с 2014", label: "мастерская на Пестеля" },
    { value: "от 2 ч", label: "доставка по городу" },
    { value: "7+ дней", label: "стоит в вазе" },
  ],
  note = "сегодня: пионы, мак и ромашка",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero036Props) {
  const sceneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    let frame = 0
    const update = () => {
      frame = 0
      const top = scene.getBoundingClientRect().top
      const value = Math.max(-320, Math.min(720, -top + 80))
      scene.style.setProperty("--vibeui-hero-036-y", String(value))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-hero-036-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-036-fg": ink } : null),
    ...(background ? { "--vibeui-hero-036-bg": background } : null),
    ...style,
  } as CSSProperties

  const lines = title.split("|").map((line) => line.trim()).filter(Boolean)

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-036" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-036" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="copy">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h1 data-part="title">
              {lines.map((line, index) => (
                <span data-part="line" key={index}>
                  <span style={{ ["--vibeui-hero-036-i" as string]: index }}>{renderLine(line)}</span>
                </span>
              ))}
            </h1>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <div data-part="actions">
              {primaryLabel ? (
                <a data-part="primary" href={primaryHref}>
                  {primaryLabel}
                </a>
              ) : null}
              {secondaryLabel ? (
                <a data-part="secondary" href={secondaryHref}>
                  {secondaryLabel}
                </a>
              ) : null}
            </div>
            {facts.length > 0 ? (
              <ul data-part="facts">
                {facts.map((fact) => (
                  <li key={fact.label}>
                    <b>{fact.value}</b>
                    <span>{fact.label}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div data-part="scene" ref={sceneRef}>
            <i data-part="wash" aria-hidden="true" />
            <Layer index={0} depth={0.03}>
              <path data-part="vase" d="M150 330h100c0 30 25 50 25 90 0 45-20 80-35 90h-80c-15-10-35-45-35-90 0-40 25-60 25-90Z" />
              <path d="M165 348c20 6 50 6 70 0" fill="none" stroke="var(--vibeui-hero-036-fg)" strokeWidth={1.2} opacity={0.5} />
            </Layer>
            <Layer index={1} depth={0.07}>
              <Leaf x={140} y={300} rotate={-58} scale={1.5} />
              <Leaf x={262} y={296} rotate={52} scale={1.4} />
              <Leaf x={112} y={228} rotate={-80} scale={1.1} />
              <Leaf x={300} y={230} rotate={78} scale={1.1} />
            </Layer>
            <Layer index={2} depth={0.11}>
              <g data-part="stems">
                <path d="M200 340Q190 250 200 150" />
                <path d="M200 340Q168 285 120 200" />
                <path d="M200 340Q252 262 285 175" />
                <path d="M200 340Q236 205 250 100" />
                <path d="M200 340Q150 250 100 150" />
                <path d="M200 340Q272 232 310 120" />
                <path d="M200 340Q185 205 160 80" />
              </g>
              <Leaf x={196} y={258} rotate={-32} scale={0.8} />
              <Leaf x={228} y={236} rotate={40} scale={0.75} />
              <Leaf x={172} y={212} rotate={-46} scale={0.7} />
            </Layer>
            <Layer index={3} depth={0.16}>
              <Poppy x={285} y={175} r={30} shade="var(--vibeui-hero-036-petal-2)" />
              <Daisy x={250} y={100} r={24} />
              <Bud x={100} y={150} rotate={-28} />
              <Bud x={310} y={120} rotate={26} />
            </Layer>
            <Layer index={4} depth={0.22}>
              <Peony x={200} y={150} r={54} />
              <Poppy x={120} y={200} r={36} />
              <Bud x={160} y={80} rotate={-12} />
            </Layer>
            {note ? (
              <span data-part="note" aria-hidden="true">
                {note}
                <svg viewBox="0 0 48 32">
                  <path d="M44 4C34 6 22 14 6 28M6 28l10-2M6 28l3-10" />
                </svg>
              </span>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}

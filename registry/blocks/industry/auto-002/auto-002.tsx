"use client"

import { useRef, useState, type CSSProperties, type PointerEvent } from "react"
import { Button083 } from "@/registry/components/button/button-083/button-083"

export type Auto002Pair = {
  /** Подпись вкладки: «Фары», «Кузов», «Салон». */
  label: string
  before: string
  after: string
  /** Что сделали: подпись под слайдером. */
  work: string
  /** Сколько заняло. */
  time?: string
}

export type Auto002Props = {
  eyebrow?: string
  title?: string
  lede?: string
  pairs?: readonly Auto002Pair[]
  beforeLabel?: string
  afterLabel?: string
  /** Стартовое положение шторки, %. */
  defaultPosition?: number
  /** aria вкладок, заголовок описания, «Заняло: {time}» и aria шторки «{label}». */
  tabsLabel?: string
  workLabel?: string
  tookLine?: string
  sliderLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// До/после детейлинга: слайдер сравнения с перетаскиванием — «до» лежит под
// «после» и режется clip-path по положению ручки, ручка с двумя стрелками и
// вертикальная линия-лампа. Тянется пальцем и мышью (pointer capture),
// клавиатурой — через невидимый range. Сверху переключатель «фары / кузов /
// салон»: каждая вкладка несёт свою пару фото и подпись, при смене шторка
// возвращается на середину.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="auto-002"]){
--vibeui-auto-002-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-auto-002-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-auto-002-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-auto-002-on-accent:oklch(from var(--vibeui-auto-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-auto-002-muted:color-mix(in oklab,var(--vibeui-auto-002-fg) 60%,var(--vibeui-auto-002-bg));
--vibeui-auto-002-line:color-mix(in oklab,var(--vibeui-auto-002-fg) 12%,transparent);
--vibeui-auto-002-glass:color-mix(in oklab,var(--vibeui-auto-002-fg) 5%,transparent);
--vibeui-auto-002-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-auto-002-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-auto-002-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auto-002"]{color-scheme:dark}
:where([data-vibeui-block="auto-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="auto-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="auto-002"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-auto-002-bg);color:var(--vibeui-auto-002-fg);font-family:var(--vibeui-auto-002-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="auto-002"] *{box-sizing:border-box}
[data-vibeui-block="auto-002"] [data-part="shell"]{max-width:84rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2rem}
[data-vibeui-block="auto-002"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 .8rem;font-family:var(--vibeui-auto-002-mono);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-auto-002-accent)}
[data-vibeui-block="auto-002"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-auto-002-accent)}
[data-vibeui-block="auto-002"] [data-part="title"]{margin:0;font-family:var(--vibeui-auto-002-display);font-weight:900;font-size:clamp(1.8rem,4.4cqi,3.2rem);line-height:1.02;letter-spacing:-.03em;text-transform:uppercase}
[data-vibeui-block="auto-002"] [data-part="lede"]{margin:1rem 0 0;max-width:30rem;color:var(--vibeui-auto-002-muted)}
[data-vibeui-block="auto-002"] [data-part="tabs"]{display:flex;flex-wrap:wrap;gap:.4rem;margin:1.6rem 0 0;padding:.35rem;border-radius:999px;border:1px solid var(--vibeui-auto-002-line);background:var(--vibeui-auto-002-glass);width:fit-content}
[data-vibeui-block="auto-002"] [data-part="work"]{margin:1.4rem 0 0;padding:1rem 1.2rem;border-radius:1rem;border:1px solid var(--vibeui-auto-002-line);background:var(--vibeui-auto-002-glass);display:grid;gap:.3rem}
[data-vibeui-block="auto-002"] [data-part="work"] small{font-family:var(--vibeui-auto-002-mono);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-auto-002-accent)}
[data-vibeui-block="auto-002"] [data-part="work"] p{margin:0}
[data-vibeui-block="auto-002"] [data-part="work"] span{font-size:.85rem;color:var(--vibeui-auto-002-muted)}
[data-vibeui-block="auto-002"] [data-part="compare"]{position:relative;overflow:hidden;aspect-ratio:4/3;border-radius:1.4rem;border:1px solid var(--vibeui-auto-002-line);background:var(--vibeui-auto-002-glass);user-select:none;touch-action:pan-y;cursor:ew-resize;--vibeui-auto-002-pos:50%}
[data-vibeui-block="auto-002"] [data-part="compare"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}
[data-vibeui-block="auto-002"] [data-part="before"]{clip-path:inset(0 calc(100% - var(--vibeui-auto-002-pos)) 0 0);filter:saturate(.8) contrast(.95)}
[data-vibeui-block="auto-002"] [data-part="divider"]{position:absolute;top:0;bottom:0;left:var(--vibeui-auto-002-pos);width:2px;margin-left:-1px;background:var(--vibeui-auto-002-accent);box-shadow:0 0 18px var(--vibeui-auto-002-accent);pointer-events:none}
[data-vibeui-block="auto-002"] [data-part="handle"]{position:absolute;top:50%;left:var(--vibeui-auto-002-pos);width:3rem;height:3rem;transform:translate(-50%,-50%);border-radius:50%;background:var(--vibeui-auto-002-accent);color:var(--vibeui-auto-002-on-accent);display:grid;place-items:center;box-shadow:0 10px 30px -8px rgb(0 0 0 / .6);pointer-events:none}
[data-vibeui-block="auto-002"] [data-part="handle"] svg{width:1.3rem;height:1.3rem}
[data-vibeui-block="auto-002"] [data-part="tag"]{position:absolute;top:1rem;padding:.35rem .7rem;border-radius:999px;font-family:var(--vibeui-auto-002-mono);font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;background:rgb(0 0 0 / .55);color:#fff;backdrop-filter:blur(8px);pointer-events:none}
[data-vibeui-block="auto-002"] [data-part="tag"][data-side="before"]{left:1rem}
[data-vibeui-block="auto-002"] [data-part="tag"][data-side="after"]{right:1rem;background:var(--vibeui-auto-002-accent);color:var(--vibeui-auto-002-on-accent)}
[data-vibeui-block="auto-002"] [data-part="range"]{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;pointer-events:none;-webkit-appearance:none;appearance:none}
[data-vibeui-block="auto-002"] [data-part="compare"]:has([data-part="range"]:focus-visible){outline:2px solid var(--vibeui-auto-002-accent);outline-offset:3px}
@container (min-width: 60rem){[data-vibeui-block="auto-002"] [data-part="shell"]{grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:3rem;align-items:center}[data-vibeui-block="auto-002"] [data-part="compare"]{aspect-ratio:3/2}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auto-002"] *{animation:none!important;transition:none!important}}`

const DEFAULT_PAIRS: Auto002Pair[] = [
  { label: "Фары", before: "/demo/auto/before-lights.webp", after: "/demo/auto/after-lights.webp", work: "Сняли желтизну и паутинку в три абразива, сверху — бронирующая плёнка 200 мкм.", time: "2 часа" },
  { label: "Кузов", before: "/demo/auto/before-body.webp", after: "/demo/auto/after-body.webp", work: "Двухэтапная полировка и керамика 9H в три слоя. Чёрный снова глубокий, без голограмм.", time: "2 дня" },
  { label: "Салон", before: "/demo/auto/before-interior.webp", after: "/demo/auto/after-interior.webp", work: "Химчистка потолка, сидений и ковров, кожа — чистка и кондиционер. Пахнет новой машиной.", time: "5 часов" },
]

/** До/после: слайдер сравнения с перетаскиванием и вкладками «фары / кузов / салон». */
export function Auto002({
  eyebrow = "До / после",
  title = "Потяните — и разница видна",
  lede = "Три реальные машины из бокса. Шторку можно тянуть пальцем, мышью или стрелками.",
  pairs = DEFAULT_PAIRS,
  beforeLabel = "до",
  afterLabel = "после",
  defaultPosition = 50,
  tabsLabel = "Что сравниваем",
  workLabel = "Что сделали",
  tookLine = "Заняло: {time}",
  sliderLabel = "Шторка до/после: {label}",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Auto002Props) {
  const [tab, setTab] = useState(0)
  const [position, setPosition] = useState(defaultPosition)
  const dragging = useRef(false)
  const current = pairs[tab] ?? pairs[0]

  const palette = {
    ...(accent ? { "--vibeui-auto-002-accent": accent } : null),
    ...(ink ? { "--vibeui-auto-002-fg": ink } : null),
    ...(background ? { "--vibeui-auto-002-bg": background } : null),
    ...style,
  } as CSSProperties

  const moveTo = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const next = ((event.clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(100, Math.max(0, next)))
  }
  const down = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    moveTo(event)
  }
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) moveTo(event)
  }
  const up = () => {
    dragging.current = false
  }

  const pick = (index: number) => {
    setTab(index)
    setPosition(defaultPosition)
  }

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-auto-002" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="auto-002" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="copy">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <div data-part="tabs" role="tablist" aria-label={tabsLabel}>
              {pairs.map((pair, index) => (
                <Button083 key={pair.label} data-part="tab" label={pair.label} aria-selected={tab === index} onClick={() => pick(index)} accent={accent} />
              ))}
            </div>
            {current ? (
              <div data-part="work" role="tabpanel">
                <small>{workLabel}</small>
                <p>{current.work}</p>
                {current.time ? <span>{tookLine.replace("{time}", current.time)}</span> : null}
              </div>
            ) : null}
          </div>
          {current ? (
            <div data-part="compare" style={{ ["--vibeui-auto-002-pos" as string]: `${position}%` }} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
              <img data-part="after" src={current.after} alt={`${current.label}: ${afterLabel}`} draggable={false} />
              <img data-part="before" src={current.before} alt={`${current.label}: ${beforeLabel}`} draggable={false} />
              <span data-part="tag" data-side="before">
                {beforeLabel}
              </span>
              <span data-part="tag" data-side="after">
                {afterLabel}
              </span>
              <i data-part="divider" aria-hidden="true" />
              <span data-part="handle" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
                </svg>
              </span>
              <input data-part="range" type="range" min={0} max={100} value={Math.round(position)} onChange={(event) => setPosition(Number(event.target.value))} aria-label={sliderLabel.replace("{label}", current.label)} />
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}

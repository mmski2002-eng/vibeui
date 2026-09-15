"use client"

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react"

export type Sketch020Stat = {
  value: string
  label: string
}

export type Sketch020Props = {
  eyebrow?: string
  title?: string
  /** Абзацы текста. */
  paragraphs?: readonly string[]
  /** Фото в рамке, приклеенное скотчем. */
  image?: string
  imageAlt?: string
  imageCaption?: string
  /** Цифры: значение обводится кружком от руки. */
  stats?: readonly Sketch020Stat[]
  /** Список «что важно» с нарисованными галочками. */
  points?: readonly string[]
  /** Почерк: аккуратный или размашистый. */
  rough?: "neat" | "loose"
  /** Дрожание линии: покой, мягкое или живое. */
  boil?: "still" | "soft" | "lively"
  /** Зерно почерка: одно число — один и тот же рисунок. Без него — от заголовка. */
  seed?: number
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  /** Цвет линий. По умолчанию — цвет текста. */
  accent?: string
  /** Цвет текста. */
  ink?: string
  className?: string
  style?: CSSProperties
}

// «Обо мне» от руки: фото приклеено скотчем под наклоном, текст рукописным
// шрифтом, цифры обведены кружками как в блокноте, список с галочками в два
// штриха. Всё рисуется по коробкам элементов и кипит тремя кадрами.
const FONTS = "https://fonts.googleapis.com/css2?family=Neucha&family=Caveat:wght@400..700&display=swap"

type Point = [number, number]

function random(seed: number) {
  let state = seed >>> 0

  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hash(text: string) {
  let value = 2166136261

  for (let index = 0; index < text.length; index += 1) {
    value = Math.imul(value ^ text.charCodeAt(index), 16777619)
  }

  return value >>> 0
}

function sketch(points: Point[], seed: number, rough: number, boil: number, closed = false) {
  const base = random(seed)
  const shake = (amount: number, next: () => number) => (next() - 0.5) * 2 * amount
  const anchors = points.map(([x, y]) => [x + shake(rough, base), y + shake(rough, base)] as Point)

  if (closed && anchors.length > 1) {
    anchors.push([anchors[0][0] + shake(rough * 0.4, base), anchors[0][1] + shake(rough * 0.4, base)])
  }

  return [0, 1, 2].map((frame) => {
    const next = random(seed + 7919 * (frame + 1))
    const pts = frame === 0 ? anchors : anchors.map(([x, y]) => [x + shake(boil, next), y + shake(boil, next)] as Point)
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`

    for (let index = 1; index < pts.length; index += 1) {
      const [x0, y0] = pts[index - 1]
      const [x1, y1] = pts[index]
      const cx = (x0 + x1) / 2 + shake(rough * 0.8, next)
      const cy = (y0 + y1) / 2 + shake(rough * 0.8, next)

      d += `Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`
    }

    return d
  })
}

function rectPoints(w: number, h: number, inset: number, radius: number, step = 14): Point[] {
  const x0 = inset
  const y0 = inset
  const x1 = w - inset
  const y1 = h - inset
  const r = Math.min(radius, (x1 - x0) / 2, (y1 - y0) / 2)
  const points: Point[] = []
  const edge = (ax: number, ay: number, bx: number, by: number) => {
    const length = Math.hypot(bx - ax, by - ay)
    const count = Math.max(1, Math.round(length / step))

    for (let index = 0; index < count; index += 1) {
      const t = index / count

      points.push([ax + (bx - ax) * t, ay + (by - ay) * t])
    }
  }
  const corner = (cx: number, cy: number, from: number) => {
    for (let index = 0; index <= 2; index += 1) {
      const angle = from + (Math.PI / 2) * (index / 2)

      points.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r])
    }
  }

  edge(x0 + r, y0, x1 - r, y0)
  corner(x1 - r, y0 + r, -Math.PI / 2)
  edge(x1, y0 + r, x1, y1 - r)
  corner(x1 - r, y1 - r, 0)
  edge(x1 - r, y1, x0 + r, y1)
  corner(x0 + r, y1 - r, Math.PI / 2)
  edge(x0, y1 - r, x0, y0 + r)
  corner(x0 + r, y0 + r, Math.PI)

  return points
}

function ellipsePoints(cx: number, cy: number, rx: number, ry: number, count = 22): Point[] {
  return Array.from({ length: count + 3 }, (_, index) => {
    const angle = (index / count) * Math.PI * 2 - Math.PI / 3

    return [cx + Math.cos(angle) * rx, cy + Math.sin(angle) * ry] as Point
  })
}

function useSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const element = ref.current

    if (!element) return

    const observer = new ResizeObserver(() => {
      const w = element.offsetWidth
      const h = element.offsetHeight

      setSize((current) => (current.w === w && current.h === h ? current : { w, h }))
    })

    observer.observe(element)

    return () => observer.disconnect()
  }, [ref])

  return size
}

type Layer = { frames: string[]; part: string }

function Ink({ w, h, layers }: { w: number; h: number; layers: Layer[] }) {
  if (w === 0 || h === 0) return null

  return (
    <svg data-part="ink" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      {layers.map((layer, index) =>
        layer.frames.map((d, frame) => <path key={`${index}-${frame}`} d={d} data-part={layer.part} data-i={frame} />),
      )}
    </svg>
  )
}

const ROUGH = { neat: 0.8, loose: 1.8 } as const
const BOIL = { still: 0, soft: 0.7, lively: 1.4 } as const

/** Фото в рамке с тенью и скотчем. */
function Photo({ src, alt, caption, seed, rough, boil }: { src: string; alt: string; caption?: string; seed: number; rough: number; boil: number }) {
  const host = useRef<HTMLElement>(null)
  const { w, h } = useSize(host)
  const line = sketch(rectPoints(w, h, 3, 5, 16), seed, rough, boil, true)
  const shadow = sketch(rectPoints(w, h, 3, 5, 16).map(([x, y]) => [x + 6, y + 7] as Point), seed + 2, rough * 1.2, boil, true)

  return (
    <figure ref={host} data-part="photo">
      <Ink w={w} h={h} layers={[{ frames: shadow, part: "shadow" }, { frames: line, part: "line" }]} />
      <span data-part="tape" aria-hidden="true" />
      {src ? <img data-part="picture" src={src} alt={alt} loading="lazy" /> : <span data-part="picture" role="img" aria-label={alt} />}
      {caption ? <figcaption data-part="caption">{caption}</figcaption> : null}
    </figure>
  )
}

/** Цифра в кружке от руки. */
function Stat({ stat, seed, rough, boil }: { stat: Sketch020Stat; seed: number; rough: number; boil: number }) {
  const host = useRef<HTMLSpanElement>(null)
  const { w, h } = useSize(host)
  const ring = sketch(ellipsePoints(w / 2, h / 2, w / 2 + 8, h / 2 + 2), seed, rough * 1.3, boil)

  return (
    <li data-part="stat">
      <span ref={host} data-part="value">
        <Ink w={w} h={h} layers={[{ frames: ring, part: "ring" }]} />
        {stat.value}
      </span>
      <span data-part="label">{stat.label}</span>
    </li>
  )
}

/** Галочка в два штриха. */
function Check({ seed, rough, boil }: { seed: number; rough: number; boil: number }) {
  const frames = sketch([[3, 11], [8, 17], [19, 4]], seed, rough * 0.8, boil * 0.8)

  return (
    <svg data-part="check" viewBox="0 0 22 22" aria-hidden="true">
      {frames.map((d, frame) => (
        <path key={frame} d={d} data-i={frame} />
      ))}
    </svg>
  )
}

const STYLES = `
:where([data-vibeui-block="sketch-020"]){
--vibeui-sketch-020-ink:light-dark(#1a1a1a,#f2f2f2);
--vibeui-sketch-020-paper:light-dark(#fbf8f3,#1c1a18);
--vibeui-sketch-020-muted:light-dark(color-mix(in oklab,#000000 55%,#ffffff),color-mix(in oklab,#ffffff 60%,#1c1a18));
--vibeui-sketch-020-accent:var(--vibeui-sketch-020-ink);
--vibeui-sketch-020-width:2;
--vibeui-sketch-020-font:"Neucha","Caveat","Segoe Print","Bradley Hand",cursive;
--vibeui-sketch-020-display:"Caveat","Neucha","Segoe Print",cursive;
--vibeui-sketch-020-frame:0;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sketch-020"]{color-scheme:dark}
:where([data-vibeui-block="sketch-020"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="sketch-020"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="sketch-020"]{position:relative;isolation:isolate;box-sizing:border-box;display:block;background:var(--vibeui-sketch-020-paper);color:var(--vibeui-sketch-020-ink);font-family:var(--vibeui-sketch-020-font);font-size:1.125rem;line-height:1.45}
[data-vibeui-block="sketch-020"] *{box-sizing:border-box}
[data-vibeui-block="sketch-020"] [data-part="ink"]{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:-1}
[data-vibeui-block="sketch-020"] path{fill:none;stroke:var(--vibeui-sketch-020-accent);stroke-width:var(--vibeui-sketch-020-width);stroke-linecap:round;stroke-linejoin:round;opacity:clamp(0,1 - (var(--vibeui-sketch-020-frame) - var(--vibeui-sketch-020-i)) * (var(--vibeui-sketch-020-frame) - var(--vibeui-sketch-020-i)),1)}
[data-vibeui-block="sketch-020"] path[data-i="0"]{--vibeui-sketch-020-i:0}
[data-vibeui-block="sketch-020"] path[data-i="1"]{--vibeui-sketch-020-i:1}
[data-vibeui-block="sketch-020"] path[data-i="2"]{--vibeui-sketch-020-i:2}
[data-vibeui-block="sketch-020"] path[data-part="shadow"]{stroke:var(--vibeui-sketch-020-muted);opacity:calc(clamp(0,1 - (var(--vibeui-sketch-020-frame) - var(--vibeui-sketch-020-i)) * (var(--vibeui-sketch-020-frame) - var(--vibeui-sketch-020-i)),1) * 0.35)}
@property --vibeui-sketch-020-frame{syntax:"<integer>";inherits:true;initial-value:0}
[data-vibeui-block="sketch-020"][data-boil] svg{animation:vibeui-sketch-020-boil 1.2s step-end infinite}
@keyframes vibeui-sketch-020-boil{0%{--vibeui-sketch-020-frame:0}33.33%{--vibeui-sketch-020-frame:1}66.67%{--vibeui-sketch-020-frame:2}}
[data-vibeui-block="sketch-020"] [data-part="shell"]{max-width:72rem;margin:0 auto;padding:3.5rem 1.5rem;display:grid;gap:2.5rem;align-items:start}
[data-vibeui-block="sketch-020"] [data-part="eyebrow"]{margin:0 0 .75rem;font-family:var(--vibeui-sketch-020-display);font-size:1.25rem;color:var(--vibeui-sketch-020-accent)}
[data-vibeui-block="sketch-020"] [data-part="title"]{margin:0 0 1.25rem;font-family:var(--vibeui-sketch-020-display);font-weight:700;font-size:clamp(2.25rem,5.5cqi,3.75rem);line-height:1;text-wrap:balance}
[data-vibeui-block="sketch-020"] [data-part="text"]{margin:0 0 1rem;max-width:34rem;font-size:1.2rem;color:var(--vibeui-sketch-020-muted)}
[data-vibeui-block="sketch-020"] [data-part="points"]{margin:1.5rem 0 0;padding:0;list-style:none;display:grid;gap:.6rem;max-width:34rem}
[data-vibeui-block="sketch-020"] [data-part="point"]{display:flex;gap:.7rem;align-items:flex-start;font-size:1.15rem}
[data-vibeui-block="sketch-020"] [data-part="check"]{flex:none;width:1.4rem;height:1.4rem;margin-top:.15rem;overflow:visible}
[data-vibeui-block="sketch-020"] [data-part="check"] path{stroke-width:2.4}
[data-vibeui-block="sketch-020"] [data-part="stats"]{margin:2.25rem 0 0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.5rem 1rem;max-width:34rem}
[data-vibeui-block="sketch-020"] [data-part="stat"]{display:grid;gap:.5rem;justify-items:start}
[data-vibeui-block="sketch-020"] [data-part="value"]{position:relative;isolation:isolate;display:inline-block;padding:.1em .45em;font-family:var(--vibeui-sketch-020-display);font-size:2.25rem;font-weight:700;line-height:1;color:var(--vibeui-sketch-020-accent);transform:rotate(-2deg)}
[data-vibeui-block="sketch-020"] [data-part="stat"]:nth-child(2n) [data-part="value"]{transform:rotate(1.5deg)}
[data-vibeui-block="sketch-020"] [data-part="stat"] [data-part="label"]{font-size:1rem;color:var(--vibeui-sketch-020-muted)}
[data-vibeui-block="sketch-020"] [data-part="photo"]{position:relative;isolation:isolate;margin:0;padding:.75rem .75rem 0;background:light-dark(#ffffff,#242220);transform:rotate(-1.5deg);max-width:24rem}
[data-vibeui-block="sketch-020"] [data-part="picture"]{display:block;width:100%;aspect-ratio:4/5;object-fit:cover;object-position:50% 20%;background:light-dark(#eee9e1,#2b2825)}
[data-vibeui-block="sketch-020"] [data-part="caption"]{display:block;padding:.75rem .25rem .9rem;font-family:var(--vibeui-sketch-020-display);font-size:1.3rem;line-height:1.1;color:var(--vibeui-sketch-020-muted);text-align:center}
[data-vibeui-block="sketch-020"] [data-part="tape"]{position:absolute;top:-.7rem;left:50%;width:6rem;height:1.5rem;transform:translateX(-50%) rotate(3deg);background:color-mix(in oklab,var(--vibeui-sketch-020-accent) 22%,#f5f0e6);opacity:.85;z-index:1}
@container (min-width: 52rem){
[data-vibeui-block="sketch-020"] [data-part="shell"]{grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:4rem;padding:5rem 2.5rem}
[data-vibeui-block="sketch-020"] [data-part="photo"]{position:sticky;top:6rem;justify-self:center}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sketch-020"] svg{animation:none!important}}`

const DEFAULT_STATS: Sketch020Stat[] = [
  { value: "300+", label: "съёмок" },
  { value: "48", label: "свадеб" },
  { value: "7 лет", label: "с камерой" },
  { value: "10 дней", label: "до готовых фото" },
]

/** «Обо мне» от руки: приклеенное фото, рукописный текст, цифры в кружках, галочки. */
export function Sketch020({
  eyebrow = "Обо мне",
  title = "Семь лет снимаю людей, которые не любят сниматься",
  paragraphs = [
    "Начинала с репортажей для городской газеты, поэтому не жду «правильного» света и не расставляю руки. Ловлю то, что уже происходит.",
    "Снимаю на плёнку и цифру, ретуширую сама и без «пластика»: веснушки и морщинки остаются на месте.",
  ],
  image = "",
  imageAlt = "",
  imageCaption = "домашняя студия, ноябрь",
  stats = DEFAULT_STATS,
  points = ["Без поз и «улыбнитесь»", "Плёнка и цифра", "Ретушь без пластика"],
  rough = "loose",
  boil = "soft",
  seed,
  tone = "auto",
  accent,
  ink,
  className,
  style,
}: Sketch020Props) {
  const base = seed ?? hash(title)
  const roughness = ROUGH[rough] ?? ROUGH.loose
  const shake = BOIL[boil] ?? BOIL.soft

  const palette = {
    ...(accent ? { "--vibeui-sketch-020-accent": accent } : null),
    ...(ink ? { "--vibeui-sketch-020-ink": ink } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-sketch-020" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="sketch-020"
        data-tone={tone === "auto" ? undefined : tone}
        data-boil={shake > 0 ? "" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <Photo src={image} alt={imageAlt} caption={imageCaption} seed={base + 1} rough={roughness} boil={shake} />
          <div data-part="copy">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {paragraphs.map((paragraph, index) => (
              <p key={index} data-part="text">
                {paragraph}
              </p>
            ))}
            {points.length > 0 ? (
              <ul data-part="points">
                {points.map((point, index) => (
                  <li key={point} data-part="point">
                    <Check seed={base + 20 + index} rough={roughness} boil={shake} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {stats.length > 0 ? (
              <ul data-part="stats">
                {stats.map((stat, index) => (
                  <Stat key={stat.label} stat={stat} seed={base + 40 + index} rough={roughness} boil={shake} />
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}

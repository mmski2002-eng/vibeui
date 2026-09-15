"use client"

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react"

export type Sketch022Link = {
  label: string
  href: string
}

export type Sketch022Props = {
  /** Надпись над историей: «следующая история». */
  kicker?: string
  /** Название следующей истории. */
  title?: string
  note?: string
  href?: string
  linkLabel?: string
  /** Фото истории, приклеенное скотчем. */
  image?: string
  imageAlt?: string
  /** Имя студии в нижней строке. */
  studioName?: string
  contactLabel?: string
  contactHref?: string
  /** Соцсети и прочие ссылки нижней строки. */
  links?: readonly Sketch022Link[]
  legal?: string
  /** Почерк: аккуратный или размашистый. */
  rough?: "neat" | "loose"
  /** Дрожание линии: покой, мягкое или живое. */
  boil?: "still" | "soft" | "lively"
  /** Зерно почерка: одно число — один и тот же рисунок. Без него — от названия. */
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

// Подвал от руки: «следующая история» — широкое фото, приклеенное скотчем,
// с рукописным названием и стрелкой-росчерком; ниже карандашная линия и
// строка со студией, контактом и правами. Всё кипит тремя кадрами.
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

function linePoints(x0: number, y0: number, x1: number, y1: number, step = 16): Point[] {
  const count = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / step) + 1)

  return Array.from({ length: count }, (_, index) => {
    const t = index / (count - 1)

    return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t] as Point
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

const STYLES = `
:where([data-vibeui-block="sketch-022"]){
--vibeui-sketch-022-ink:light-dark(#1a1a1a,#f2f2f2);
--vibeui-sketch-022-paper:light-dark(#fbf8f3,#1c1a18);
--vibeui-sketch-022-muted:light-dark(color-mix(in oklab,#000000 55%,#ffffff),color-mix(in oklab,#ffffff 60%,#1c1a18));
--vibeui-sketch-022-accent:var(--vibeui-sketch-022-ink);
--vibeui-sketch-022-width:2;
--vibeui-sketch-022-font:"Neucha","Caveat","Segoe Print","Bradley Hand",cursive;
--vibeui-sketch-022-display:"Caveat","Neucha","Segoe Print",cursive;
--vibeui-sketch-022-frame:0;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sketch-022"]{color-scheme:dark}
:where([data-vibeui-block="sketch-022"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="sketch-022"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="sketch-022"]{position:relative;isolation:isolate;box-sizing:border-box;display:block;background:var(--vibeui-sketch-022-paper);color:var(--vibeui-sketch-022-ink);font-family:var(--vibeui-sketch-022-font);font-size:1.125rem;line-height:1.4;overflow:hidden}
[data-vibeui-block="sketch-022"] *{box-sizing:border-box}
[data-vibeui-block="sketch-022"] [data-part="ink"]{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:-1}
[data-vibeui-block="sketch-022"] path{fill:none;stroke:var(--vibeui-sketch-022-accent);stroke-width:var(--vibeui-sketch-022-width);stroke-linecap:round;stroke-linejoin:round;opacity:clamp(0,1 - (var(--vibeui-sketch-022-frame) - var(--vibeui-sketch-022-i)) * (var(--vibeui-sketch-022-frame) - var(--vibeui-sketch-022-i)),1)}
[data-vibeui-block="sketch-022"] path[data-i="0"]{--vibeui-sketch-022-i:0}
[data-vibeui-block="sketch-022"] path[data-i="1"]{--vibeui-sketch-022-i:1}
[data-vibeui-block="sketch-022"] path[data-i="2"]{--vibeui-sketch-022-i:2}
[data-vibeui-block="sketch-022"] path[data-part="shadow"]{stroke:var(--vibeui-sketch-022-muted);opacity:calc(clamp(0,1 - (var(--vibeui-sketch-022-frame) - var(--vibeui-sketch-022-i)) * (var(--vibeui-sketch-022-frame) - var(--vibeui-sketch-022-i)),1) * 0.35)}
@property --vibeui-sketch-022-frame{syntax:"<integer>";inherits:true;initial-value:0}
[data-vibeui-block="sketch-022"][data-boil] svg{animation:vibeui-sketch-022-boil 1.2s step-end infinite}
@keyframes vibeui-sketch-022-boil{0%{--vibeui-sketch-022-frame:0}33.33%{--vibeui-sketch-022-frame:1}66.67%{--vibeui-sketch-022-frame:2}}
[data-vibeui-block="sketch-022"] [data-part="shell"]{max-width:72rem;margin:0 auto;padding:3.5rem 1.5rem 2rem}
[data-vibeui-block="sketch-022"] [data-part="kicker"]{margin:0 0 1rem;font-family:var(--vibeui-sketch-022-display);font-size:1.25rem;color:var(--vibeui-sketch-022-accent)}
[data-vibeui-block="sketch-022"] [data-part="story"]{position:relative;isolation:isolate;display:block;margin:0;padding:.75rem .75rem 0;background:light-dark(#ffffff,#242220);color:inherit;text-decoration:none;transform:rotate(-.6deg);transition:transform .4s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="sketch-022"] [data-part="story"]:hover{transform:rotate(0deg) translateY(-2px)}
[data-vibeui-block="sketch-022"] [data-part="story"]:focus-visible{outline:2px dashed var(--vibeui-sketch-022-accent);outline-offset:6px}
[data-vibeui-block="sketch-022"] [data-part="tape"]{position:absolute;top:-.7rem;width:6rem;height:1.5rem;background:color-mix(in oklab,var(--vibeui-sketch-022-accent) 22%,#f5f0e6);opacity:.85;z-index:1}
[data-vibeui-block="sketch-022"] [data-part="tape"][data-side="left"]{left:2rem;transform:rotate(-4deg)}
[data-vibeui-block="sketch-022"] [data-part="tape"][data-side="right"]{right:2rem;transform:rotate(5deg)}
[data-vibeui-block="sketch-022"] [data-part="picture"]{display:block;width:100%;aspect-ratio:16/8;object-fit:cover;background:light-dark(#eee9e1,#2b2825)}
[data-vibeui-block="sketch-022"] [data-part="under"]{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:.5rem 1.5rem;padding:1rem .5rem 1.1rem}
[data-vibeui-block="sketch-022"] [data-part="title"]{margin:0;font-family:var(--vibeui-sketch-022-display);font-weight:700;font-size:clamp(1.75rem,4cqi,2.75rem);line-height:1}
[data-vibeui-block="sketch-022"] [data-part="note"]{margin:0;color:var(--vibeui-sketch-022-muted)}
[data-vibeui-block="sketch-022"] [data-part="go"]{font-family:var(--vibeui-sketch-022-display);font-size:1.4rem;color:var(--vibeui-sketch-022-accent);white-space:nowrap}
[data-vibeui-block="sketch-022"] [data-part="rule"]{display:block;width:100%;height:8px;margin:2.5rem 0 1.25rem;overflow:visible}
[data-vibeui-block="sketch-022"] [data-part="bottom"]{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem 1.5rem;font-size:1rem;color:var(--vibeui-sketch-022-muted)}
[data-vibeui-block="sketch-022"] [data-part="studio"]{font-family:var(--vibeui-sketch-022-display);font-size:1.4rem;color:var(--vibeui-sketch-022-ink)}
[data-vibeui-block="sketch-022"] [data-part="bottom"] a{color:var(--vibeui-sketch-022-ink);text-decoration:underline;text-decoration-style:wavy;text-decoration-color:var(--vibeui-sketch-022-accent);text-underline-offset:.2em}
[data-vibeui-block="sketch-022"] [data-part="bottom"] a:focus-visible{outline:2px dashed var(--vibeui-sketch-022-accent);outline-offset:3px}
[data-vibeui-block="sketch-022"] [data-part="legal"]{margin-left:auto}
@container (min-width: 52rem){[data-vibeui-block="sketch-022"] [data-part="shell"]{padding:5rem 2.5rem 2.5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sketch-022"] svg{animation:none!important}[data-vibeui-block="sketch-022"] *{transition:none!important}}`

/** Подвал от руки: следующая история на приклеенном фото и строка со студией под карандашной линией. */
export function Sketch022({
  kicker = "Следующая история",
  title = "Лиза и Марк. Ладога, июнь",
  note = "Свадьба на два дня, без тамады и с костром.",
  href = "#",
  linkLabel = "смотреть →",
  image = "",
  imageAlt = "",
  studioName = "Аня Соколова",
  contactLabel = "Написать",
  contactHref = "#",
  links = [],
  legal = "© 2026. Фото не для перепечатки.",
  rough = "loose",
  boil = "soft",
  seed,
  tone = "auto",
  accent,
  ink,
  className,
  style,
}: Sketch022Props) {
  const story = useRef<HTMLAnchorElement>(null)
  const { w, h } = useSize(story)
  const host = useRef<HTMLElement>(null)
  const { w: width } = useSize(host)
  const base = seed ?? hash(title)
  const roughness = ROUGH[rough] ?? ROUGH.loose
  const shake = BOIL[boil] ?? BOIL.soft
  const frame = sketch(rectPoints(w, h, 3, 5, 18), base, roughness, shake, true)
  const shadow = sketch(rectPoints(w, h, 3, 5, 18).map(([x, y]) => [x + 7, y + 8] as Point), base + 2, roughness * 1.2, shake, true)
  const rule = width > 0 ? sketch(linePoints(0, 4, width, 4, 20), base + 9, roughness * 1.4, shake) : []

  const palette = {
    ...(accent ? { "--vibeui-sketch-022-accent": accent } : null),
    ...(ink ? { "--vibeui-sketch-022-ink": ink } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-sketch-022" precedence="medium">
        {STYLES}
      </style>
      <footer
        ref={host}
        data-vibeui-block="sketch-022"
        data-tone={tone === "auto" ? undefined : tone}
        data-boil={shake > 0 ? "" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          {kicker ? <p data-part="kicker">{kicker}</p> : null}
          <a ref={story} href={href} data-part="story">
            <Ink w={w} h={h} layers={[{ frames: shadow, part: "shadow" }, { frames: frame, part: "line" }]} />
            <span data-part="tape" data-side="left" aria-hidden="true" />
            <span data-part="tape" data-side="right" aria-hidden="true" />
            {image ? <img data-part="picture" src={image} alt={imageAlt} loading="lazy" /> : <span data-part="picture" role="img" aria-label={imageAlt} />}
            <span data-part="under">
              <span>
                <span data-part="title">{title}</span>
                {note ? <span data-part="note"> — {note}</span> : null}
              </span>
              <span data-part="go">{linkLabel}</span>
            </span>
          </a>
          {rule.length > 0 ? (
            <svg data-part="rule" viewBox={`0 0 ${width} 8`} preserveAspectRatio="none" aria-hidden="true">
              {rule.map((d, index) => (
                <path key={index} d={d} data-i={index} />
              ))}
            </svg>
          ) : null}
          <div data-part="bottom">
            <span data-part="studio">{studioName}</span>
            {contactLabel ? <a href={contactHref}>{contactLabel}</a> : null}
            {links.map((link) => (
              <a key={`${link.label}-${link.href}`} href={link.href}>
                {link.label}
              </a>
            ))}
            {legal ? <span data-part="legal">{legal}</span> : null}
          </div>
        </div>
      </footer>
    </>
  )
}

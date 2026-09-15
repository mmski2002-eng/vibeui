"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react"

export type Sketch023Props = {
  /** Текст записки. */
  text?: string
  /** Своё содержимое вместо текста. */
  children?: ReactNode
  /** Чем приклеена: скотчем сверху, кнопкой-пином или ничем. */
  pin?: "tape" | "pin" | "none"
  /** Цвет бумаги записки. По умолчанию — жёлтый стикер. */
  paper?: string
  /** Наклон в градусах. */
  tilt?: number
  /** Почерк: аккуратный или размашистый. */
  rough?: "neat" | "loose"
  /** Дрожание линии: покой, мягкое или живое. */
  boil?: "still" | "soft" | "lively"
  /** Зерно почерка: одно число — один и тот же рисунок. Без него — от текста. */
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

// Стикер от руки: приклеенная записка на полях — квадрат бумаги под наклоном
// с нарисованной тенью, скотчем или пином, текст рукописным Caveat. Для
// пометок редактора: «важно!», «свободные даты в мае», «сюда →».
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

function circlePoints(cx: number, cy: number, r: number, count = 12): Point[] {
  return Array.from({ length: count + 2 }, (_, index) => {
    const angle = (index / count) * Math.PI * 2 - Math.PI / 2

    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r] as Point
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

const ROUGH = { neat: 0.8, loose: 1.8 } as const
const BOIL = { still: 0, soft: 0.7, lively: 1.4 } as const

const STYLES = `
:where([data-vibeui-block="sketch-023"]){
--vibeui-sketch-023-ink:light-dark(#1a1a1a,#f2f2f2);
--vibeui-sketch-023-paper:light-dark(#fff3a8,#5c5320);
--vibeui-sketch-023-muted:light-dark(color-mix(in oklab,#000000 55%,#ffffff),color-mix(in oklab,#ffffff 60%,#1c1a18));
--vibeui-sketch-023-accent:var(--vibeui-sketch-023-ink);
--vibeui-sketch-023-width:2;
--vibeui-sketch-023-display:"Caveat","Neucha","Segoe Print",cursive;
--vibeui-sketch-023-frame:0;
--vibeui-sketch-023-tilt:-3deg;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sketch-023"]{color-scheme:dark}
:where([data-vibeui-block="sketch-023"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="sketch-023"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="sketch-023"]{position:relative;isolation:isolate;box-sizing:border-box;display:inline-block;max-width:16rem;padding:1rem 1.1rem 1.1rem;background:var(--vibeui-sketch-023-paper);color:var(--vibeui-sketch-023-ink);font-family:var(--vibeui-sketch-023-display);font-size:1.4rem;font-weight:600;line-height:1.1;text-wrap:balance;transform:rotate(var(--vibeui-sketch-023-tilt));transform-origin:50% 0;transition:transform .3s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="sketch-023"]:hover{transform:rotate(calc(var(--vibeui-sketch-023-tilt) * -0.4)) translateY(-1px)}
[data-vibeui-block="sketch-023"] *{box-sizing:border-box}
[data-vibeui-block="sketch-023"] [data-part="ink"]{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:-1}
[data-vibeui-block="sketch-023"] path{fill:none;stroke:var(--vibeui-sketch-023-accent);stroke-width:var(--vibeui-sketch-023-width);stroke-linecap:round;stroke-linejoin:round;opacity:clamp(0,1 - (var(--vibeui-sketch-023-frame) - var(--vibeui-sketch-023-i)) * (var(--vibeui-sketch-023-frame) - var(--vibeui-sketch-023-i)),1)}
[data-vibeui-block="sketch-023"] path[data-i="0"]{--vibeui-sketch-023-i:0}
[data-vibeui-block="sketch-023"] path[data-i="1"]{--vibeui-sketch-023-i:1}
[data-vibeui-block="sketch-023"] path[data-i="2"]{--vibeui-sketch-023-i:2}
[data-vibeui-block="sketch-023"] path[data-part="shadow"]{stroke:var(--vibeui-sketch-023-muted);opacity:calc(clamp(0,1 - (var(--vibeui-sketch-023-frame) - var(--vibeui-sketch-023-i)) * (var(--vibeui-sketch-023-frame) - var(--vibeui-sketch-023-i)),1) * 0.35)}
[data-vibeui-block="sketch-023"] path[data-part="pin"]{fill:var(--vibeui-sketch-023-accent)}
@property --vibeui-sketch-023-frame{syntax:"<integer>";inherits:true;initial-value:0}
[data-vibeui-block="sketch-023"][data-boil] svg{animation:vibeui-sketch-023-boil 1.2s step-end infinite}
@keyframes vibeui-sketch-023-boil{0%{--vibeui-sketch-023-frame:0}33.33%{--vibeui-sketch-023-frame:1}66.67%{--vibeui-sketch-023-frame:2}}
[data-vibeui-block="sketch-023"] [data-part="tape"]{position:absolute;top:-.7rem;left:50%;width:5rem;height:1.3rem;transform:translateX(-50%) rotate(2deg);background:color-mix(in oklab,var(--vibeui-sketch-023-accent) 20%,#f5f0e6);opacity:.85;z-index:1}
[data-vibeui-block="sketch-023"] [data-part="pinhead"]{position:absolute;top:-.6rem;left:50%;width:1.6rem;height:1.6rem;overflow:visible;transform:translateX(-50%);z-index:1}
[data-vibeui-block="sketch-023"] [data-part="text"]{margin:0}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sketch-023"] svg{animation:none!important}[data-vibeui-block="sketch-023"]{transition:none!important}}`

/** Стикер от руки: приклеенная записка на полях с рукописным текстом. */
export function Sketch023({
  text = "важно!",
  children,
  pin = "tape",
  paper,
  tilt = -3,
  rough = "loose",
  boil = "soft",
  seed,
  tone = "auto",
  accent,
  ink,
  className,
  style,
}: Sketch023Props) {
  const host = useRef<HTMLDivElement>(null)
  const { w, h } = useSize(host)
  const base = seed ?? hash(text)
  const roughness = ROUGH[rough] ?? ROUGH.loose
  const shake = BOIL[boil] ?? BOIL.soft
  const frame = sketch(rectPoints(w, h, 2, 3, 14), base, roughness, shake, true)
  const shadow = sketch(rectPoints(w, h, 2, 3, 14).map(([x, y]) => [x + 5, y + 6] as Point), base + 2, roughness * 1.2, shake, true)
  const head = sketch(circlePoints(12, 12, 7), base + 5, roughness * 0.5, shake * 0.6)

  const palette = {
    ...(accent ? { "--vibeui-sketch-023-accent": accent } : null),
    ...(ink ? { "--vibeui-sketch-023-ink": ink } : null),
    ...(paper ? { "--vibeui-sketch-023-paper": paper } : null),
    ["--vibeui-sketch-023-tilt" as string]: `${tilt}deg`,
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-sketch-023" precedence="medium">
        {STYLES}
      </style>
      <div
        ref={host}
        data-vibeui-block="sketch-023"
        data-tone={tone === "auto" ? undefined : tone}
        data-boil={shake > 0 ? "" : undefined}
        className={className}
        style={palette}
      >
        {w > 0 && h > 0 ? (
          <svg data-part="ink" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
            {shadow.map((d, index) => (
              <path key={`s-${index}`} d={d} data-part="shadow" data-i={index} />
            ))}
            {frame.map((d, index) => (
              <path key={`f-${index}`} d={d} data-part="line" data-i={index} />
            ))}
          </svg>
        ) : null}
        {pin === "tape" ? <span data-part="tape" aria-hidden="true" /> : null}
        {pin === "pin" ? (
          <svg data-part="pinhead" viewBox="0 0 24 24" aria-hidden="true">
            {head.map((d, index) => (
              <path key={index} d={d} data-part="pin" data-i={index} />
            ))}
          </svg>
        ) : null}
        {children ?? <p data-part="text">{text}</p>}
      </div>
    </>
  )
}

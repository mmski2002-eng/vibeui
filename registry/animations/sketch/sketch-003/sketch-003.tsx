"use client"

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react"

export type Sketch003Props = {
  /** Подпись. */
  label?: string
  /** Отмечен при загрузке. */
  defaultChecked?: boolean
  /** Почерк: аккуратный или размашистый. */
  rough?: "neat" | "loose"
  /** Дрожание линии: покой, мягкое или живое. */
  boil?: "still" | "soft" | "lively"
  /** Зерно почерка: одно число — один и тот же рисунок. Без него — от подписи. */
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

// Рукописный чекбокс: квадратик нарисован от руки, галочка — две
// дрожащие линии, появляется при выборе. Под рисунком настоящий
// <input type="checkbox">, подпись — <label>.
const FONTS = "https://fonts.googleapis.com/css2?family=Neucha&family=Caveat:wght@400..700&display=swap"

type Point = [number, number]

/** Детерминированный ГПСЧ (mulberry32): один seed — один и тот же рисунок. */
function random(seed: number) {
  let state = seed >>> 0

  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Число из строки — чтобы у одной подписи был один и тот же почерк. */
function hash(text: string) {
  let value = 2166136261

  for (let index = 0; index < text.length; index += 1) {
    value = Math.imul(value ^ text.charCodeAt(index), 16777619)
  }

  return value >>> 0
}

/**
 * Три кадра одной линии: точки сдвигаются шумом rough один раз (это и есть
 * «почерк»), потом каждый кадр добавляет мелкую дрожь boil — так линия
 * «кипит», но остаётся той же линией. Отрезки — квадратичные кривые.
 */
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

/** Периметр прямоугольника со скруглёнными углами, точки с шагом step. */
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

function ellipsePoints(cx: number, cy: number, rx: number, ry: number, count = 24): Point[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2 - Math.PI / 3

    return [cx + Math.cos(angle) * rx, cy + Math.sin(angle) * ry] as Point
  })
}

function linePoints(x0: number, y0: number, x1: number, y1: number, step = 14): Point[] {
  const count = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / step) + 1)

  return Array.from({ length: count }, (_, index) => {
    const t = index / (count - 1)

    return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t] as Point
  })
}

/** Размер хоста: контуры рисуются в пикселях, поэтому холст ждёт измерения. */
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

type Layer = { frames: string[]; part: string; width?: number }

/** Слой чернил: каждый контур — три кадра, кадры переключает CSS. */
function Ink({ w, h, layers }: { w: number; h: number; layers: Layer[] }) {
  if (w === 0 || h === 0) return null

  return (
    <svg data-part="ink" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      {layers.map((layer, index) =>
        layer.frames.map((d, frame) => (
          <path
            key={`${index}-${frame}`}
            d={d}
            data-part={layer.part}
            data-i={frame}
            style={layer.width ? { strokeWidth: layer.width } : undefined}
          />
        )),
      )}
    </svg>
  )
}

const ROUGH = { neat: 0.8, loose: 1.8 } as const
const BOIL = { still: 0, soft: 0.7, lively: 1.4 } as const

const STYLES = `
:where([data-vibeui-block="sketch-003"]){
--vibeui-sketch-003-ink:light-dark(#1a1a1a,#f2f2f2);
--vibeui-sketch-003-paper:light-dark(#ffffff,#1a1a1a);
--vibeui-sketch-003-muted:light-dark(color-mix(in oklab,#000000 55%,#ffffff),color-mix(in oklab,#ffffff 60%,#1a1a1a));
--vibeui-sketch-003-accent:var(--vibeui-sketch-003-ink);
--vibeui-sketch-003-on-accent:oklch(from var(--vibeui-sketch-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-sketch-003-width:2;
--vibeui-sketch-003-font:"Neucha","Caveat","Segoe Print","Bradley Hand",cursive;
--vibeui-sketch-003-display:"Caveat","Neucha","Segoe Print",cursive;
--vibeui-sketch-003-frame:0;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sketch-003"]{color-scheme:dark}
:where([data-vibeui-block="sketch-003"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="sketch-003"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="sketch-003"]{position:relative;isolation:isolate;box-sizing:border-box;color:var(--vibeui-sketch-003-ink);font-family:var(--vibeui-sketch-003-font);font-style:italic;font-size:1.125rem;line-height:1.3}
[data-vibeui-block="sketch-003"] *{box-sizing:border-box}
/* Чернила — абсолютный слой под содержимым; overflow visible, потому что
   дрожащая линия выходит за коробку на пару пикселей. */
[data-vibeui-block="sketch-003"] [data-part="ink"]{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:-1}
[data-vibeui-block="sketch-003"] [data-part="ink"] path{fill:none;stroke:var(--vibeui-sketch-003-accent);stroke-width:var(--vibeui-sketch-003-width);stroke-linecap:round;stroke-linejoin:round;opacity:clamp(0,1 - (var(--vibeui-sketch-003-frame) - var(--vibeui-sketch-003-i)) * (var(--vibeui-sketch-003-frame) - var(--vibeui-sketch-003-i)),1)}
[data-vibeui-block="sketch-003"] [data-part="ink"] path[data-i="0"]{--vibeui-sketch-003-i:0}
[data-vibeui-block="sketch-003"] [data-part="ink"] path[data-i="1"]{--vibeui-sketch-003-i:1}
[data-vibeui-block="sketch-003"] [data-part="ink"] path[data-i="2"]{--vibeui-sketch-003-i:2}
[data-vibeui-block="sketch-003"] [data-part="ink"] path[data-part="fill"]{fill:var(--vibeui-sketch-003-accent);stroke:var(--vibeui-sketch-003-accent);stroke-width:calc(var(--vibeui-sketch-003-width) * 2)}
[data-vibeui-block="sketch-003"] [data-part="ink"] path[data-part="hatch"]{stroke-width:calc(var(--vibeui-sketch-003-width) * 0.7);opacity:calc(clamp(0,1 - (var(--vibeui-sketch-003-frame) - var(--vibeui-sketch-003-i)) * (var(--vibeui-sketch-003-frame) - var(--vibeui-sketch-003-i)),1) * 0.8)}
/* Boil: три кадра переключаются step-end раз в 0.4 с — как в рисованной
   анимации; кадр выбирает целочисленная переменная, видим только свой. */
@property --vibeui-sketch-003-frame{syntax:"<integer>";inherits:true;initial-value:0}
[data-vibeui-block="sketch-003"][data-boil] [data-part="ink"]{animation:vibeui-sketch-003-boil 1.2s step-end infinite}
@keyframes vibeui-sketch-003-boil{0%{--vibeui-sketch-003-frame:0}33.33%{--vibeui-sketch-003-frame:1}66.67%{--vibeui-sketch-003-frame:2}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sketch-003"] [data-part="ink"]{animation:none!important}[data-vibeui-block="sketch-003"] *{transition:none!important}}

[data-vibeui-block="sketch-003"]{display:inline-flex;align-items:center;gap:0.6em;cursor:pointer;user-select:none}
[data-vibeui-block="sketch-003"] input{position:absolute;opacity:0;width:1px;height:1px;pointer-events:none}
[data-vibeui-block="sketch-003"] [data-part="box"]{position:relative;display:inline-block;width:1.4em;height:1.4em;flex:none}
[data-vibeui-block="sketch-003"]:has(input:focus-visible) [data-part="box"]{outline:2px dashed var(--vibeui-sketch-003-accent);outline-offset:4px}
[data-vibeui-block="sketch-003"]:hover [data-part="box"]{transform:translateY(-1px)}`

/** Рукописный чекбокс: квадратик и галочка от руки. */
export function Sketch003({
  label = "Согласен с условиями",
  defaultChecked = true,
  rough = "neat",
  boil = "soft",
  seed,
  tone = "auto",
  accent,
  ink,
  className,
  style,
}: Sketch003Props) {
  const host = useRef<HTMLSpanElement>(null)
  const { w, h } = useSize(host)
  // Новый росчерк по наведению: seed сдвигается, контуры пересчитываются.
  const [stroke, setStroke] = useState(0)
  const base = (seed ?? hash(label)) + stroke * 104729
  const roughness = ROUGH[rough] ?? ROUGH.neat
  const shake = BOIL[boil] ?? BOIL.soft
  const [on, setOn] = useState(defaultChecked)
  const box = sketch(rectPoints(w, h, 2, 4, 8), base, roughness, shake, true)
  const tick = on ? sketch([[w * 0.2, h * 0.52], [w * 0.42, h * 0.78], [w * 0.88, h * 0.18]], base + 3, roughness * 0.8, shake) : null

  const palette = {
    ...(accent ? { "--vibeui-sketch-003-accent": accent } : null),
    ...(ink ? { "--vibeui-sketch-003-ink": ink } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-sketch-003" precedence="medium">
        {STYLES}
      </style>
      <label className={className} style={palette} data-vibeui-block="sketch-003" data-tone={tone === "auto" ? undefined : tone} data-boil={shake > 0 ? "" : undefined}>
        <input type="checkbox" checked={on} onChange={(event) => setOn(event.target.checked)} />
        <span data-part="box" ref={host} onPointerEnter={() => setStroke((count) => count + 1)}>
          <Ink w={w} h={h} layers={[{ frames: box, part: "line" }, ...(tick ? [{ frames: tick, part: "tick", width: 3 }] : [])]} />
        </span>
        <span data-part="label">{label}</span>
      </label>
    </>
  )
}

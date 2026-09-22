"use client"

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react"

export type Sketch010Props = {
  /** Подпись у хвоста стрелки. */
  label?: string
  /** Куда указывает. */
  direction?: "right" | "left" | "down"
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

// Рукописная стрелка-аннотация: изогнутая линия по квадратичной кривой
// с нарисованным наконечником и подписью рукописным шрифтом. Кладётся
// рядом с тем, на что указывает: абсолютно или в потоке.
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
:where([data-vibeui-block="sketch-010"]){
--vibeui-sketch-010-ink:light-dark(#1a1a1a,#f2f2f2);
--vibeui-sketch-010-paper:light-dark(#ffffff,#1a1a1a);
--vibeui-sketch-010-muted:light-dark(color-mix(in oklab,#000000 55%,#ffffff),color-mix(in oklab,#ffffff 60%,#1a1a1a));
--vibeui-sketch-010-accent:var(--vibeui-sketch-010-ink);
--vibeui-sketch-010-on-accent:oklch(from var(--vibeui-sketch-010-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-sketch-010-width:2;
--vibeui-sketch-010-font:"Neucha","Caveat","Segoe Print","Bradley Hand",cursive;
--vibeui-sketch-010-display:"Caveat","Neucha","Segoe Print",cursive;
--vibeui-sketch-010-frame:0;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sketch-010"]{color-scheme:dark}
:where([data-vibeui-block="sketch-010"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="sketch-010"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="sketch-010"]{position:relative;isolation:isolate;box-sizing:border-box;color:var(--vibeui-sketch-010-ink);font-family:var(--vibeui-sketch-010-font);font-style:italic;font-size:1.125rem;line-height:1.3}
[data-vibeui-block="sketch-010"] *{box-sizing:border-box}
/* Чернила — абсолютный слой под содержимым; overflow visible, потому что
   дрожащая линия выходит за коробку на пару пикселей. */
[data-vibeui-block="sketch-010"] [data-part="ink"]{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:-1}
[data-vibeui-block="sketch-010"] [data-part="ink"] path{fill:none;stroke:var(--vibeui-sketch-010-accent);stroke-width:var(--vibeui-sketch-010-width);stroke-linecap:round;stroke-linejoin:round;opacity:clamp(0,1 - (var(--vibeui-sketch-010-frame) - var(--vibeui-sketch-010-i)) * (var(--vibeui-sketch-010-frame) - var(--vibeui-sketch-010-i)),1)}
[data-vibeui-block="sketch-010"] [data-part="ink"] path[data-i="0"]{--vibeui-sketch-010-i:0}
[data-vibeui-block="sketch-010"] [data-part="ink"] path[data-i="1"]{--vibeui-sketch-010-i:1}
[data-vibeui-block="sketch-010"] [data-part="ink"] path[data-i="2"]{--vibeui-sketch-010-i:2}
[data-vibeui-block="sketch-010"] [data-part="ink"] path[data-part="fill"]{fill:var(--vibeui-sketch-010-accent);stroke:var(--vibeui-sketch-010-accent);stroke-width:calc(var(--vibeui-sketch-010-width) * 2)}
[data-vibeui-block="sketch-010"] [data-part="ink"] path[data-part="hatch"]{stroke-width:calc(var(--vibeui-sketch-010-width) * 0.7);opacity:calc(clamp(0,1 - (var(--vibeui-sketch-010-frame) - var(--vibeui-sketch-010-i)) * (var(--vibeui-sketch-010-frame) - var(--vibeui-sketch-010-i)),1) * 0.8)}
/* Boil: три кадра переключаются step-end раз в 0.4 с — как в рисованной
   анимации; кадр выбирает целочисленная переменная, видим только свой. */
@property --vibeui-sketch-010-frame{syntax:"<integer>";inherits:true;initial-value:0}
[data-vibeui-block="sketch-010"][data-boil] [data-part="ink"]{animation:vibeui-sketch-010-boil 1.2s step-end infinite}
@keyframes vibeui-sketch-010-boil{0%{--vibeui-sketch-010-frame:0}33.33%{--vibeui-sketch-010-frame:1}66.67%{--vibeui-sketch-010-frame:2}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sketch-010"] [data-part="ink"]{animation:none!important}[data-vibeui-block="sketch-010"] *{transition:none!important}}

[data-vibeui-block="sketch-010"]{display:inline-block;width:11rem;height:5.5rem;--vibeui-sketch-010-width:2.4}
[data-vibeui-block="sketch-010"] [data-part="label"]{position:absolute;left:0;bottom:-0.2em;font-family:var(--vibeui-sketch-010-display);font-size:1.5rem;line-height:1;white-space:nowrap;transform:rotate(-4deg)}
[data-vibeui-block="sketch-010"][data-direction="left"] [data-part="label"]{left:auto;right:0}
[data-vibeui-block="sketch-010"][data-direction="down"] [data-part="label"]{bottom:auto;top:-0.3em;left:0}`

/** Рукописная стрелка: изогнутая стрелка с подписью. */
export function Sketch010({
  label = "вот сюда",
  direction = "right",
  rough = "neat",
  boil = "soft",
  seed,
  tone = "auto",
  accent,
  ink,
  className,
  style,
}: Sketch010Props) {
  const host = useRef<HTMLDivElement>(null)
  const { w, h } = useSize(host)
  // Новый росчерк по наведению: seed сдвигается, контуры пересчитываются.
  const [stroke, setStroke] = useState(0)
  const base = (seed ?? hash(label)) + stroke * 104729
  const roughness = ROUGH[rough] ?? ROUGH.neat
  const shake = BOIL[boil] ?? BOIL.soft
  const curve = (() => {
    const start: Point = direction === "left" ? [w - 14, h - 12] : direction === "down" ? [w * 0.35, 14] : [14, h - 12]
    const end: Point = direction === "left" ? [14, 14] : direction === "down" ? [w * 0.65, h - 14] : [w - 14, 14]
    const control: Point = direction === "down" ? [w * 0.95, h * 0.5] : [start[0] * 0.3 + end[0] * 0.7, start[1]]

    return Array.from({ length: 12 }, (_, index) => {
      const t = index / 11
      const x = (1 - t) * (1 - t) * start[0] + 2 * (1 - t) * t * control[0] + t * t * end[0]
      const y = (1 - t) * (1 - t) * start[1] + 2 * (1 - t) * t * control[1] + t * t * end[1]

      return [x, y] as Point
    })
  })()
  const tip = curve[curve.length - 1]
  const prev = curve[curve.length - 2]
  const angle = Math.atan2(tip[1] - prev[1], tip[0] - prev[0])
  const wing = (delta: number): Point => [tip[0] - Math.cos(angle + delta) * 14, tip[1] - Math.sin(angle + delta) * 14]
  const head = sketch([wing(0.5), tip, wing(-0.5)], base + 7, roughness * 0.7, shake)
  const shaft = sketch(curve, base, roughness, shake)

  const palette = {
    ...(accent ? { "--vibeui-sketch-010-accent": accent } : null),
    ...(ink ? { "--vibeui-sketch-010-ink": ink } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-sketch-010" precedence="medium">
        {STYLES}
      </style>
      <div
        ref={host}
        data-vibeui-block="sketch-010"
        data-tone={tone === "auto" ? undefined : tone}
        data-boil={shake > 0 ? "" : undefined}
        data-direction={direction}
        className={className}
        style={palette}
        onPointerEnter={() => setStroke((count) => count + 1)}
      >
        <Ink w={w} h={h} layers={[{ frames: shaft, part: "line" }, { frames: head, part: "line" }]} />
        <span data-part="label">{label}</span>
      </div>
    </>
  )
}

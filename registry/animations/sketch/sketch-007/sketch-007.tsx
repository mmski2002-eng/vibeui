"use client"

import { useEffect, useRef, useState, type CSSProperties, type RefObject, type ReactNode } from "react"

export type Sketch007Props = {
  /** Заголовок карточки. */
  title?: string
  /** Текст карточки. */
  text?: string
  /** Своё содержимое вместо текста. */
  children?: ReactNode
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

// Рукописная карточка: рамка от руки вокруг содержимого, заголовок
// рукописным дисплейным шрифтом. children заменяют демонстрационный
// текст; рамка следует за высотой содержимого.
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
:where([data-vibeui-block="sketch-007"]){
--vibeui-sketch-007-ink:light-dark(#1a1a1a,#f2f2f2);
--vibeui-sketch-007-paper:light-dark(#ffffff,#1a1a1a);
--vibeui-sketch-007-muted:light-dark(color-mix(in oklab,#000000 55%,#ffffff),color-mix(in oklab,#ffffff 60%,#1a1a1a));
--vibeui-sketch-007-accent:var(--vibeui-sketch-007-ink);
--vibeui-sketch-007-on-accent:oklch(from var(--vibeui-sketch-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-sketch-007-width:2;
--vibeui-sketch-007-font:"Neucha","Caveat","Segoe Print","Bradley Hand",cursive;
--vibeui-sketch-007-display:"Caveat","Neucha","Segoe Print",cursive;
--vibeui-sketch-007-frame:0;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sketch-007"]{color-scheme:dark}
:where([data-vibeui-block="sketch-007"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="sketch-007"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="sketch-007"]{position:relative;isolation:isolate;box-sizing:border-box;color:var(--vibeui-sketch-007-ink);font-family:var(--vibeui-sketch-007-font);font-style:italic;font-size:1.125rem;line-height:1.3}
[data-vibeui-block="sketch-007"] *{box-sizing:border-box}
/* Чернила — абсолютный слой под содержимым; overflow visible, потому что
   дрожащая линия выходит за коробку на пару пикселей. */
[data-vibeui-block="sketch-007"] [data-part="ink"]{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:-1}
[data-vibeui-block="sketch-007"] [data-part="ink"] path{fill:none;stroke:var(--vibeui-sketch-007-accent);stroke-width:var(--vibeui-sketch-007-width);stroke-linecap:round;stroke-linejoin:round;opacity:clamp(0,1 - (var(--vibeui-sketch-007-frame) - var(--vibeui-sketch-007-i)) * (var(--vibeui-sketch-007-frame) - var(--vibeui-sketch-007-i)),1)}
[data-vibeui-block="sketch-007"] [data-part="ink"] path[data-i="0"]{--vibeui-sketch-007-i:0}
[data-vibeui-block="sketch-007"] [data-part="ink"] path[data-i="1"]{--vibeui-sketch-007-i:1}
[data-vibeui-block="sketch-007"] [data-part="ink"] path[data-i="2"]{--vibeui-sketch-007-i:2}
[data-vibeui-block="sketch-007"] [data-part="ink"] path[data-part="fill"]{fill:var(--vibeui-sketch-007-accent);stroke:var(--vibeui-sketch-007-accent);stroke-width:calc(var(--vibeui-sketch-007-width) * 2)}
[data-vibeui-block="sketch-007"] [data-part="ink"] path[data-part="hatch"]{stroke-width:calc(var(--vibeui-sketch-007-width) * 0.7);opacity:calc(clamp(0,1 - (var(--vibeui-sketch-007-frame) - var(--vibeui-sketch-007-i)) * (var(--vibeui-sketch-007-frame) - var(--vibeui-sketch-007-i)),1) * 0.8)}
/* Boil: три кадра переключаются step-end раз в 0.4 с — как в рисованной
   анимации; кадр выбирает целочисленная переменная, видим только свой. */
@property --vibeui-sketch-007-frame{syntax:"<integer>";inherits:true;initial-value:0}
[data-vibeui-block="sketch-007"][data-boil] [data-part="ink"]{animation:vibeui-sketch-007-boil 1.2s step-end infinite}
@keyframes vibeui-sketch-007-boil{0%{--vibeui-sketch-007-frame:0}33.33%{--vibeui-sketch-007-frame:1}66.67%{--vibeui-sketch-007-frame:2}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sketch-007"] [data-part="ink"]{animation:none!important}[data-vibeui-block="sketch-007"] *{transition:none!important}}

[data-vibeui-block="sketch-007"]{display:block;max-width:24rem;padding:1.25rem 1.5rem;background:var(--vibeui-sketch-007-paper)}
[data-vibeui-block="sketch-007"] [data-part="ink"] path[data-part="shadow"]{stroke:var(--vibeui-sketch-007-muted);opacity:calc(clamp(0,1 - (var(--vibeui-sketch-007-frame) - var(--vibeui-sketch-007-i)) * (var(--vibeui-sketch-007-frame) - var(--vibeui-sketch-007-i)),1) * 0.35)}
[data-vibeui-block="sketch-007"] [data-part="title"]{margin:0 0 0.5rem;font-family:var(--vibeui-sketch-007-display);font-size:1.75rem;font-weight:600;line-height:1.1}
[data-vibeui-block="sketch-007"] [data-part="text"]{margin:0;color:var(--vibeui-sketch-007-muted);line-height:1.4}`

/** Рукописная карточка: рамка от руки вокруг любого содержимого. */
export function Sketch007({
  title = "Заметка на полях",
  text = "Рамка рисуется по коробке содержимого, поэтому карточка может быть любой высоты.",
  children,
  rough = "neat",
  boil = "soft",
  seed,
  tone = "auto",
  accent,
  ink,
  className,
  style,
}: Sketch007Props) {
  const host = useRef<HTMLDivElement>(null)
  const { w, h } = useSize(host)
  // Новый росчерк по наведению: seed сдвигается, контуры пересчитываются.
  const [stroke, setStroke] = useState(0)
  const base = (seed ?? hash(title)) + stroke * 104729
  const roughness = ROUGH[rough] ?? ROUGH.neat
  const shake = BOIL[boil] ?? BOIL.soft
  const frame = sketch(rectPoints(w, h, 3, 12, 16), base, roughness, shake, true)
  const shadow = sketch(rectPoints(w, h, 3, 12, 16).map(([x, y]) => [x + 5, y + 6] as Point), base + 2, roughness * 1.2, shake, true)

  const palette = {
    ...(accent ? { "--vibeui-sketch-007-accent": accent } : null),
    ...(ink ? { "--vibeui-sketch-007-ink": ink } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-sketch-007" precedence="medium">
        {STYLES}
      </style>
      <div
        ref={host}
        data-vibeui-block="sketch-007"
        data-tone={tone === "auto" ? undefined : tone}
        data-boil={shake > 0 ? "" : undefined}
        className={className}
        style={palette}
        onPointerEnter={() => setStroke((count) => count + 1)}
      >
        <Ink w={w} h={h} layers={[{ frames: shadow, part: "shadow" }, { frames: frame, part: "line" }]} />
        {title ? <h3 data-part="title">{title}</h3> : null}
        {children ?? <p data-part="text">{text}</p>}
      </div>
    </>
  )
}

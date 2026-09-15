"use client"

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react"
import { createPortal } from "react-dom"

export type Sketch017Work = {
  title: string
  /** Жанр — по нему фильтруют чипы. */
  category: string
  image?: string
  alt?: string
  /** Подпись под кадром. Без неё — «жанр · название». */
  caption?: string
  /** Ориентация кадра без картинки: подложка нужного формата. */
  orientation?: "portrait" | "landscape"
}

export type Sketch017Props = {
  /** Заголовок над галереей, рукописный. */
  title?: string
  works?: readonly Sketch017Work[]
  /** Подпись чипа «показать всё». */
  allLabel?: string
  /** Жанр, выбранный при загрузке. По умолчанию — все. */
  defaultCategory?: string
  /** Клик по кадру: он вылетает на передний план и увеличивается. */
  lightbox?: boolean
  /** Подписи кнопок лайтбокса — для скринридера. */
  closeLabel?: string
  prevLabel?: string
  nextLabel?: string
  /** Почерк: аккуратный или размашистый. */
  rough?: "neat" | "loose"
  /** Дрожание линии: покой, мягкое или живое. */
  boil?: "still" | "soft" | "lively"
  /** Зерно почерка: одно число — один и тот же рисунок. Без него — от заголовка. */
  seed?: number
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  /** Цвет линий и активного чипа. По умолчанию — цвет текста. */
  accent?: string
  /** Цвет текста. */
  ink?: string
  className?: string
  style?: CSSProperties
}

// Галерея от руки: чипы жанров в нарисованных капсулах фильтруют кадры,
// кадры лежат «на столе» — masonry колонками, каждый под своим наклоном, с
// рукописной подписью. Кадры прилетают по одному, когда доезжают до экрана;
// при смене жанра лишние сдуваются, оставшиеся раскладываются заново.
// Клик по кадру: он вылетает с места на передний план (FLIP по координатам),
// выравнивается и увеличивается; закрытие — тем же путём обратно.
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

/** Чип жанра: капсула от руки, активный залит чернилами. */
function Chip({
  label,
  active,
  seed,
  rough,
  boil,
  onClick,
}: {
  label: string
  active: boolean
  seed: number
  rough: number
  boil: number
  onClick: () => void
}) {
  const host = useRef<HTMLButtonElement>(null)
  const { w, h } = useSize(host)
  const line = sketch(rectPoints(w, h, 2, h / 2, 12), seed, rough, boil, true)
  const layers: Layer[] = active ? [{ frames: line, part: "fill" }, { frames: line, part: "line" }] : [{ frames: line, part: "line" }]

  return (
    <button ref={host} type="button" data-part="chip" aria-pressed={active} onClick={onClick}>
      <Ink w={w} h={h} layers={layers} />
      {label}
    </button>
  )
}

/** Кадр на столе: фото в рамке с нарисованной тенью и подписью. */
function Print({
  work,
  seed,
  rough,
  boil,
  index,
  onOpen,
  hidden,
  children,
}: {
  work: Sketch017Work
  seed: number
  rough: number
  boil: number
  index: number
  /** Вызывается с коробкой кадра — откуда лететь. */
  onOpen?: (rect: DOMRect) => void
  /** Кадр сейчас в лайтбоксе: на столе остаётся пустое место. */
  hidden?: boolean
  children?: ReactNode
}) {
  const host = useRef<HTMLElement>(null)
  const { w, h } = useSize(host)
  const [shown, setShown] = useState(false)
  const tilt = ((random(seed)() - 0.5) * 3.2).toFixed(2)
  const line = sketch(rectPoints(w, h, 3, 4, 16), seed, rough, boil, true)
  const shadow = sketch(rectPoints(w, h, 3, 4, 16).map(([x, y]) => [x + 6, y + 7] as Point), seed + 2, rough * 1.2, boil, true)

  // Кадр «прилетает», когда доезжает до экрана — один раз, дальше лежит.
  useEffect(() => {
    const element = host.current

    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.02 },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <figure
      ref={host}
      data-part="print"
      data-shown={shown ? "" : undefined}
      data-away={hidden ? "" : undefined}
      style={{ ["--vibeui-sketch-017-tilt" as string]: `${tilt}deg`, ["--vibeui-sketch-017-n" as string]: index % 6 }}
    >
      <Ink w={w} h={h} layers={[{ frames: shadow, part: "shadow" }, { frames: line, part: "line" }]} />
      {onOpen ? (
        <button
          type="button"
          data-part="open"
          onClick={() => {
            const picture = host.current?.querySelector<HTMLElement>('[data-part="picture"]')

            if (picture) onOpen(picture.getBoundingClientRect())
          }}
        >
          {children}
        </button>
      ) : (
        children
      )}
      <figcaption data-part="caption">{work.caption ?? `${work.category} · ${work.title}`}</figcaption>
    </figure>
  )
}

type Box = { left: number; top: number; width: number; height: number }

/** Куда лететь: вписать кадр в окно с полями, сохранив пропорции. */
function target(orientation: "portrait" | "landscape"): Box {
  const ratio = orientation === "portrait" ? 4 / 5 : 3 / 2
  const pad = Math.min(48, window.innerWidth * 0.06)
  const maxW = window.innerWidth - pad * 2
  const maxH = window.innerHeight - pad * 2 - 56
  let width = Math.min(maxW, maxH * ratio)
  let height = width / ratio

  if (height > maxH) {
    height = maxH
    width = height * ratio
  }

  return { left: (window.innerWidth - width) / 2, top: (window.innerHeight - 56 - height) / 2, width, height }
}

/**
 * Кадр на переднем плане. Стартует с коробки кадра на столе (position:fixed
 * с теми же координатами), на следующем кадре получает коробку по центру —
 * переход делает CSS. Закрытие — те же координаты обратно, после перехода
 * лайтбокс размонтируется.
 */
function Lightbox({
  works,
  index,
  from,
  seed,
  rough,
  boil,
  labels,
  onClose,
  onStep,
  host,
}: {
  works: readonly Sketch017Work[]
  index: number
  from: DOMRect
  seed: number
  rough: number
  boil: number
  labels: { close: string; prev: string; next: string }
  onClose: () => void
  onStep: (next: number) => void
  /** Атрибуты и палитра хоста: портал живёт в body, вне секции. */
  host: { tone?: string; boil?: string; style: CSSProperties }
}) {
  const work = works[index]
  const orientation = work.orientation ?? "landscape"
  const [box, setBox] = useState<Box>({ left: from.left, top: from.top, width: from.width, height: from.height })
  const [phase, setPhase] = useState<"in" | "open" | "out">("in")
  const stage = useRef<HTMLDivElement>(null)
  const { w, h } = useSize(stage)
  const line = sketch(rectPoints(w, h, 3, 4, 18), seed, rough, boil, true)
  const shadow = sketch(rectPoints(w, h, 3, 4, 18).map(([x, y]) => [x + 8, y + 10] as Point), seed + 2, rough * 1.2, boil, true)

  const closing = useRef<number | undefined>(undefined)
  const close = useCallback(() => {
    if (closing.current) return

    setPhase("out")
    setBox({ left: from.left, top: from.top, width: from.width, height: from.height })
    closing.current = window.setTimeout(onClose, 620)
  }, [from, onClose])

  useEffect(() => {
    // Принудительный reflow: без него браузер не успевает вычислить
    // стартовые координаты, и вместо перелёта получается прыжок.
    void stage.current?.offsetWidth
    const raf = window.requestAnimationFrame(() => {
      setBox(target(orientation))
      setPhase("open")
    })
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
      if (event.key === "ArrowRight") onStep((index + 1) % works.length)
      if (event.key === "ArrowLeft") onStep((index - 1 + works.length) % works.length)
    }
    const onResize = () => setBox(target(orientation))
    const body = document.body
    const previous = { overflow: body.style.overflow, padding: body.style.paddingRight }
    const gutter = window.innerWidth - document.documentElement.clientWidth

    body.style.overflow = "hidden"
    if (gutter > 0) body.style.paddingRight = `${gutter}px`
    window.addEventListener("keydown", onKey)
    window.addEventListener("resize", onResize)

    return () => {
      window.cancelAnimationFrame(raf)
      window.clearTimeout(closing.current)
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("resize", onResize)
      body.style.overflow = previous.overflow
      body.style.paddingRight = previous.padding
    }
  }, [orientation, index, works.length, close, onStep])

  return (
    <div
      data-vibeui-block="sketch-017"
      data-part="lightbox"
      data-tone={host.tone}
      data-boil={host.boil}
      data-phase={phase}
      role="dialog"
      aria-modal="true"
      aria-label={work.title}
      style={host.style}
      onClick={close}
    >
      <div
        ref={stage}
        data-part="stage"
        style={{ left: box.left, top: box.top, width: box.width, height: box.height }}
        onClick={(event) => event.stopPropagation()}
      >
        <Ink w={w} h={h} layers={[{ frames: shadow, part: "shadow" }, { frames: line, part: "line" }]} />
        {work.image ? <img data-part="big" src={work.image} alt={work.alt ?? work.title} /> : <span data-part="big" role="img" aria-label={work.title} />}
      </div>
      <div data-part="bar" onClick={(event) => event.stopPropagation()}>
        <button type="button" data-part="step" aria-label={labels.prev} onClick={() => onStep((index - 1 + works.length) % works.length)}>
          ←
        </button>
        <span data-part="bigcaption">{work.caption ?? `${work.category} · ${work.title}`}</span>
        <button type="button" data-part="step" aria-label={labels.next} onClick={() => onStep((index + 1) % works.length)}>
          →
        </button>
      </div>
      <button type="button" data-part="close" aria-label={labels.close} onClick={close}>
        ×
      </button>
    </div>
  )
}

const STYLES = `
:where([data-vibeui-block="sketch-017"]){
--vibeui-sketch-017-ink:light-dark(#1a1a1a,#f2f2f2);
--vibeui-sketch-017-paper:light-dark(#fbf8f3,#1c1a18);
--vibeui-sketch-017-card:light-dark(#ffffff,#242220);
--vibeui-sketch-017-muted:light-dark(color-mix(in oklab,#000000 55%,#ffffff),color-mix(in oklab,#ffffff 60%,#1c1a18));
--vibeui-sketch-017-accent:var(--vibeui-sketch-017-ink);
--vibeui-sketch-017-on-accent:oklch(from var(--vibeui-sketch-017-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-sketch-017-width:2;
--vibeui-sketch-017-font:"Neucha","Caveat","Segoe Print","Bradley Hand",cursive;
--vibeui-sketch-017-display:"Caveat","Neucha","Segoe Print",cursive;
--vibeui-sketch-017-frame:0;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sketch-017"]{color-scheme:dark}
:where([data-vibeui-block="sketch-017"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="sketch-017"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="sketch-017"]{position:relative;isolation:isolate;box-sizing:border-box;display:block;background:var(--vibeui-sketch-017-paper);color:var(--vibeui-sketch-017-ink);font-family:var(--vibeui-sketch-017-font);font-size:1.125rem;line-height:1.35}
[data-vibeui-block="sketch-017"] *{box-sizing:border-box}
[data-vibeui-block="sketch-017"] [data-part="ink"]{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:-1}
[data-vibeui-block="sketch-017"] [data-part="ink"] path{fill:none;stroke:var(--vibeui-sketch-017-accent);stroke-width:var(--vibeui-sketch-017-width);stroke-linecap:round;stroke-linejoin:round;opacity:clamp(0,1 - (var(--vibeui-sketch-017-frame) - var(--vibeui-sketch-017-i)) * (var(--vibeui-sketch-017-frame) - var(--vibeui-sketch-017-i)),1)}
[data-vibeui-block="sketch-017"] [data-part="ink"] path[data-i="0"]{--vibeui-sketch-017-i:0}
[data-vibeui-block="sketch-017"] [data-part="ink"] path[data-i="1"]{--vibeui-sketch-017-i:1}
[data-vibeui-block="sketch-017"] [data-part="ink"] path[data-i="2"]{--vibeui-sketch-017-i:2}
[data-vibeui-block="sketch-017"] [data-part="ink"] path[data-part="fill"]{fill:var(--vibeui-sketch-017-accent);stroke-width:calc(var(--vibeui-sketch-017-width) * 2)}
[data-vibeui-block="sketch-017"] [data-part="ink"] path[data-part="shadow"]{stroke:var(--vibeui-sketch-017-muted);opacity:calc(clamp(0,1 - (var(--vibeui-sketch-017-frame) - var(--vibeui-sketch-017-i)) * (var(--vibeui-sketch-017-frame) - var(--vibeui-sketch-017-i)),1) * 0.35)}
@property --vibeui-sketch-017-frame{syntax:"<integer>";inherits:true;initial-value:0}
[data-vibeui-block="sketch-017"][data-boil] [data-part="ink"]{animation:vibeui-sketch-017-boil 1.2s step-end infinite}
@keyframes vibeui-sketch-017-boil{0%{--vibeui-sketch-017-frame:0}33.33%{--vibeui-sketch-017-frame:1}66.67%{--vibeui-sketch-017-frame:2}}

[data-vibeui-block="sketch-017"] [data-part="shell"]{max-width:72rem;margin:0 auto;padding:2.5rem 1.5rem 3rem}
[data-vibeui-block="sketch-017"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:1rem 2rem;margin-bottom:2rem}
[data-vibeui-block="sketch-017"] [data-part="title"]{margin:0;font-family:var(--vibeui-sketch-017-display);font-weight:700;font-size:clamp(2rem,5cqi,3.25rem);line-height:1}
[data-vibeui-block="sketch-017"] [data-part="chips"]{display:flex;flex-wrap:wrap;gap:.5rem .6rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="sketch-017"] [data-part="chip"]{position:relative;isolation:isolate;appearance:none;border:0;background:none;padding:.35rem 1rem .4rem;font:inherit;font-family:var(--vibeui-sketch-017-display);font-size:1.3rem;font-weight:600;line-height:1;color:var(--vibeui-sketch-017-ink);cursor:pointer;transition:transform .2s}
[data-vibeui-block="sketch-017"] [data-part="chip"]:hover{transform:rotate(-2deg)}
[data-vibeui-block="sketch-017"] [data-part="chip"][aria-pressed="true"]{color:var(--vibeui-sketch-017-on-accent)}
[data-vibeui-block="sketch-017"] [data-part="chip"]:focus-visible{outline:2px dashed var(--vibeui-sketch-017-accent);outline-offset:3px}
[data-vibeui-block="sketch-017"] [data-part="count"]{font-family:var(--vibeui-sketch-017-display);font-size:1.25rem;color:var(--vibeui-sketch-017-muted)}
/* Стол: masonry колонками, кадры не рвутся между колонками. */
[data-vibeui-block="sketch-017"] [data-part="table"]{columns:1;column-gap:1.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="sketch-017"] [data-part="table"][data-leaving]{pointer-events:none}
[data-vibeui-block="sketch-017"] [data-part="slot"]{break-inside:avoid;margin:0 0 1.5rem;padding:0}
[data-vibeui-block="sketch-017"] [data-part="print"]{position:relative;isolation:isolate;margin:0;padding:.6rem .6rem 0;background:var(--vibeui-sketch-017-card);transform:translateY(28px) rotate(calc(var(--vibeui-sketch-017-tilt) + 3deg)) scale(.97);opacity:0;transition:transform .7s cubic-bezier(.2,.8,.2,1),opacity .5s;transition-delay:calc(var(--vibeui-sketch-017-n) * 60ms);will-change:transform}
[data-vibeui-block="sketch-017"] [data-part="print"][data-shown]{transform:rotate(var(--vibeui-sketch-017-tilt));opacity:1}
[data-vibeui-block="sketch-017"] [data-part="print"]:hover{transform:rotate(0deg) scale(1.02);transition-delay:0s;z-index:1}
[data-vibeui-block="sketch-017"] [data-part="table"][data-leaving] [data-part="print"]{transform:scale(.94) rotate(var(--vibeui-sketch-017-tilt));opacity:0;transition-duration:.25s;transition-delay:0s}
[data-vibeui-block="sketch-017"] [data-part="picture"]{display:block;width:100%;object-fit:cover;background:light-dark(#eee9e1,#2b2825)}
[data-vibeui-block="sketch-017"] [data-part="picture"][data-orientation="portrait"]{aspect-ratio:4/5}
[data-vibeui-block="sketch-017"] [data-part="picture"][data-orientation="landscape"]{aspect-ratio:3/2}
[data-vibeui-block="sketch-017"] [data-part="caption"]{display:block;padding:.6rem .2rem .7rem;font-family:var(--vibeui-sketch-017-display);font-size:1.25rem;line-height:1.1;color:var(--vibeui-sketch-017-muted)}
[data-vibeui-block="sketch-017"] [data-part="open"]{display:block;width:100%;padding:0;border:0;background:none;cursor:zoom-in;font:inherit;color:inherit}
[data-vibeui-block="sketch-017"] [data-part="open"]:focus-visible{outline:2px dashed var(--vibeui-sketch-017-accent);outline-offset:4px}
[data-vibeui-block="sketch-017"] [data-part="print"][data-away]{opacity:0!important;transition:none}
/* Лайтбокс: подложка бумажного цвета, кадр летит position:fixed от своей
   коробки к центру — переход по left/top/width/height и повороту. */
[data-vibeui-block="sketch-017"][data-part="lightbox"]{position:fixed;inset:0;z-index:60;background:color-mix(in oklab,var(--vibeui-sketch-017-paper) 88%,transparent);backdrop-filter:blur(4px);opacity:0;transition:opacity .35s;cursor:zoom-out}
[data-vibeui-block="sketch-017"][data-part="lightbox"][data-phase="open"]{opacity:1}
[data-vibeui-block="sketch-017"][data-part="lightbox"][data-phase="out"]{opacity:0}
[data-vibeui-block="sketch-017"] [data-part="stage"]{position:fixed;isolation:isolate;padding:0;background:var(--vibeui-sketch-017-card);cursor:default;transform:rotate(0deg);transition:left .6s cubic-bezier(.2,.8,.2,1),top .6s cubic-bezier(.2,.8,.2,1),width .6s cubic-bezier(.2,.8,.2,1),height .6s cubic-bezier(.2,.8,.2,1),transform .6s cubic-bezier(.2,.8,.2,1);will-change:left,top,width,height}
[data-vibeui-block="sketch-017"] [data-part="stage"] [data-part="ink"]{inset:-.6rem;width:calc(100% + 1.2rem);height:calc(100% + 1.2rem)}
[data-vibeui-block="sketch-017"] [data-part="stage"] [data-part="ink"]{z-index:-1}
[data-vibeui-block="sketch-017"] [data-part="big"]{display:block;width:100%;height:100%;object-fit:cover;background:light-dark(#eee9e1,#2b2825)}
[data-vibeui-block="sketch-017"] [data-part="bar"]{position:fixed;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;gap:1rem;padding:.75rem 1rem 1rem;cursor:default;opacity:0;transition:opacity .3s .2s}
[data-vibeui-block="sketch-017"][data-part="lightbox"][data-phase="open"] [data-part="bar"]{opacity:1}
[data-vibeui-block="sketch-017"] [data-part="bigcaption"]{font-family:var(--vibeui-sketch-017-display);font-size:1.5rem;color:var(--vibeui-sketch-017-ink);text-align:center;max-width:60ch}
[data-vibeui-block="sketch-017"] [data-part="step"],[data-vibeui-block="sketch-017"] [data-part="close"]{appearance:none;border:0;background:none;padding:.2rem .6rem;font-family:var(--vibeui-sketch-017-display);font-size:2rem;line-height:1;color:var(--vibeui-sketch-017-accent);cursor:pointer;transition:transform .2s}
[data-vibeui-block="sketch-017"] [data-part="step"]:hover,[data-vibeui-block="sketch-017"] [data-part="close"]:hover{transform:rotate(-8deg) scale(1.15)}
[data-vibeui-block="sketch-017"] [data-part="close"]{position:fixed;top:.5rem;right:1rem;font-size:2.5rem}
[data-vibeui-block="sketch-017"] [data-part="step"]:focus-visible,[data-vibeui-block="sketch-017"] [data-part="close"]:focus-visible{outline:2px dashed var(--vibeui-sketch-017-accent);outline-offset:3px}
[data-vibeui-block="sketch-017"] [data-part="empty"]{margin:2rem 0;font-family:var(--vibeui-sketch-017-display);font-size:1.5rem;color:var(--vibeui-sketch-017-muted)}
@container (min-width: 36rem){[data-vibeui-block="sketch-017"] [data-part="table"]{columns:2}}
@container (min-width: 60rem){[data-vibeui-block="sketch-017"] [data-part="table"]{columns:3;column-gap:2rem}[data-vibeui-block="sketch-017"] [data-part="slot"]{margin-bottom:2rem}[data-vibeui-block="sketch-017"] [data-part="shell"]{padding:3rem 2.5rem 4rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sketch-017"] [data-part="ink"]{animation:none!important}[data-vibeui-block="sketch-017"] *{transition:none!important}[data-vibeui-block="sketch-017"] [data-part="print"]{transform:none;opacity:1}[data-vibeui-block="sketch-017"][data-part="lightbox"],[data-vibeui-block="sketch-017"] [data-part="bar"]{opacity:1}}`

const DEFAULT_WORKS: Sketch017Work[] = [
  { title: "Лиза и Марк, Ладога", category: "Свадьба", orientation: "portrait" },
  { title: "Портрет для обложки", category: "Портрет", orientation: "portrait" },
  { title: "Семья на даче", category: "Семья", orientation: "landscape" },
  { title: "Утро на Васильевском", category: "Улица", orientation: "landscape" },
  { title: "Анна, актриса", category: "Портрет", orientation: "portrait" },
  { title: "Регистрация в Пушкине", category: "Свадьба", orientation: "landscape" },
]

/** Галерея от руки: чипы жанров фильтруют кадры, разложенные на столе. */
export function Sketch017({
  title = "Работы",
  works = DEFAULT_WORKS,
  allLabel = "Все",
  defaultCategory,
  lightbox = true,
  closeLabel = "Закрыть",
  prevLabel = "Предыдущий кадр",
  nextLabel = "Следующий кадр",
  rough = "loose",
  boil = "soft",
  seed,
  tone = "auto",
  accent,
  ink,
  className,
  style,
}: Sketch017Props) {
  const base = seed ?? hash(title)
  const roughness = ROUGH[rough] ?? ROUGH.loose
  const shake = BOIL[boil] ?? BOIL.soft
  const categories = Array.from(new Set(works.map((work) => work.category)))
  const [active, setActive] = useState<string | null>(defaultCategory ?? null)
  // Смена жанра в два такта: лишние кадры сдуваются, потом стол раскладывается заново.
  const [pending, setPending] = useState<string | null | undefined>(undefined)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const choose = (category: string | null) => {
    if (category === active || pending !== undefined) return

    setPending(category)
    timer.current = window.setTimeout(() => {
      setActive(category)
      setPending(undefined)
    }, 260)
  }

  const visible = works.filter((work) => active === null || work.category === active)
  // Открытый кадр: индекс в видимом списке и коробка, откуда он вылетел.
  const [shown, setShown] = useState<{ index: number; from: DOMRect } | null>(null)
  const openAt = useCallback((index: number, from: DOMRect) => setShown({ index, from }), [])
  const step = useCallback((next: number) => setShown((current) => (current ? { ...current, index: next } : current)), [])
  const closeBox = useCallback(() => setShown(null), [])

  const palette = {
    ...(accent ? { "--vibeui-sketch-017-accent": accent } : null),
    ...(ink ? { "--vibeui-sketch-017-ink": ink } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-sketch-017" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="sketch-017"
        data-tone={tone === "auto" ? undefined : tone}
        data-boil={shake > 0 ? "" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="head">
            {title ? <h2 data-part="title">{title}</h2> : null}
            <ul data-part="chips" aria-label={allLabel}>
              <li>
                <Chip label={allLabel} active={active === null} seed={base + 1} rough={roughness} boil={shake} onClick={() => choose(null)} />
              </li>
              {categories.map((category, index) => (
                <li key={category}>
                  <Chip label={category} active={active === category} seed={base + 10 + index} rough={roughness} boil={shake} onClick={() => choose(category)} />
                </li>
              ))}
            </ul>
          </div>
          {visible.length === 0 ? (
            <p data-part="empty">Пока пусто</p>
          ) : (
            <ul data-part="table" data-leaving={pending !== undefined ? "" : undefined} key={active ?? "all"}>
              {visible.map((work, index) => (
                <li key={`${work.category}-${work.title}`} data-part="slot">
                  <Print
                    work={work}
                    seed={base + 100 + hash(work.title)}
                    rough={roughness}
                    boil={shake}
                    index={index}
                    onOpen={lightbox ? (rect) => openAt(index, rect) : undefined}
                    hidden={shown?.index === index}
                  >
                    {work.image ? (
                      <img data-part="picture" data-orientation={work.orientation ?? "landscape"} src={work.image} alt={work.alt ?? work.title} loading="lazy" />
                    ) : (
                      <span data-part="picture" data-orientation={work.orientation ?? "landscape"} role="img" aria-label={work.title} />
                    )}
                  </Print>
                </li>
              ))}
            </ul>
          )}
        </div>
        {shown
          ? createPortal(
              <Lightbox
                host={{ tone: tone === "auto" ? undefined : tone, boil: shake > 0 ? "" : undefined, style: palette }}
            works={visible}
            index={shown.index}
            from={shown.from}
            seed={base + 7}
            rough={roughness}
            boil={shake}
            labels={{ close: closeLabel, prev: prevLabel, next: nextLabel }}
                onClose={closeBox}
                onStep={step}
              />,
              document.body,
            )
          : null}
      </section>
    </>
  )
}

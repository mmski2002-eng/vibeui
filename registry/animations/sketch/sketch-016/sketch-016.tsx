"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react"

export type Sketch016Props = {
  /** Надпись над заголовком. */
  eyebrow?: string
  /** Заголовок: обычная часть. */
  title?: string
  /** Слово или фраза, которую обводят от руки. */
  titleAccent?: string
  /** Подзаголовок. */
  lede?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  /** Фото в рукописной рамке. Без него — пустая рамка с подписью. */
  image?: string
  imageAlt?: string
  /** Подпись под фото, рукописная. */
  imageCaption?: string
  /** Надпись у стрелки, которая ведёт от текста к фото. */
  arrowLabel?: string
  /** Почерк: аккуратный или размашистый. */
  rough?: "neat" | "loose"
  /** Дрожание линии: покой, мягкое или живое. */
  boil?: "still" | "soft" | "lively"
  /** Зерно почерка: одно число — один и тот же рисунок. Без него — от заголовка. */
  seed?: number
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  /** Цвет линий и кнопки. По умолчанию — цвет текста. */
  accent?: string
  /** Цвет текста. */
  ink?: string
  className?: string
  style?: CSSProperties
}

// Первый экран от руки: заголовок дисплейным рукописным шрифтом с обведённым
// словом, две нарисованные кнопки и фото, «приклеенное» к листу под
// небольшим наклоном. Линии дорисовываются при появлении, потом кипят.
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

function ellipsePoints(cx: number, cy: number, rx: number, ry: number, count = 26): Point[] {
  return Array.from({ length: count + 3 }, (_, index) => {
    // Полтора оборота: обводка от руки заходит сама на себя.
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

type Layer = { frames: string[]; part: string; width?: number }

function Ink({ w, h, layers, delay = 0 }: { w: number; h: number; layers: Layer[]; delay?: number }) {
  if (w === 0 || h === 0) return null

  return (
    <svg data-part="ink" viewBox={`0 0 ${w} ${h}`} aria-hidden="true" style={{ ["--vibeui-sketch-016-delay" as string]: `${delay}ms` }}>
      {layers.map((layer, index) =>
        layer.frames.map((d, frame) => (
          <path
            key={`${index}-${frame}`}
            d={d}
            pathLength={1}
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

/** Элемент в нарисованной рамке: измеряет себя и рисует контур по коробке. */
function Framed({
  as = "div",
  part,
  seed,
  rough,
  boil,
  radius = 10,
  fill = false,
  shadow = false,
  delay = 0,
  href,
  children,
  className,
  style,
}: {
  as?: "div" | "a" | "figure"
  part: string
  seed: number
  rough: number
  boil: number
  radius?: number
  fill?: boolean
  shadow?: boolean
  delay?: number
  href?: string
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  const host = useRef<HTMLElement | null>(null)
  const { w, h } = useSize(host)
  const [stroke, setStroke] = useState(0)
  const base = seed + stroke * 104729
  const line = sketch(rectPoints(w, h, 3, radius, 16), base, rough, boil, true)
  const layers: Layer[] = []

  if (shadow) {
    layers.push({ frames: sketch(rectPoints(w, h, 3, radius, 16).map(([x, y]) => [x + 6, y + 7] as Point), base + 2, rough * 1.2, boil, true), part: "shadow" })
  }

  if (fill) {
    layers.push({ frames: line, part: "fill" })
  }

  layers.push({ frames: line, part: "line" })

  const shared = {
    "data-part": part,
    "data-variant": fill ? "solid" : undefined,
    className,
    style,
    onPointerEnter: () => setStroke((count) => count + 1),
  }
  const body = (
    <>
      <Ink w={w} h={h} layers={layers} delay={delay} />
      {children}
    </>
  )
  const attach = (element: HTMLElement | null) => {
    host.current = element
  }

  if (as === "a") {
    return (
      <a ref={attach} href={href} {...shared}>
        {body}
      </a>
    )
  }

  if (as === "figure") {
    return (
      <figure ref={attach} {...shared}>
        {body}
      </figure>
    )
  }

  return (
    <div ref={attach} {...shared}>
      {body}
    </div>
  )
}

/** Слово, обведённое от руки: эллипс чуть больше коробки текста. */
function Circled({ text, seed, rough, boil }: { text: string; seed: number; rough: number; boil: number }) {
  const host = useRef<HTMLSpanElement>(null)
  const { w, h } = useSize(host)
  const frames = sketch(ellipsePoints(w / 2, h / 2, w / 2 + 10, h / 2 + 4), seed, rough * 1.3, boil)

  return (
    <span ref={host} data-part="circled">
      <Ink w={w} h={h} layers={[{ frames, part: "circle" }]} delay={900} />
      {text}
    </span>
  )
}

const STYLES = `
:where([data-vibeui-block="sketch-016"]){
--vibeui-sketch-016-ink:light-dark(#1a1a1a,#f2f2f2);
--vibeui-sketch-016-paper:light-dark(#fbf8f3,#1c1a18);
--vibeui-sketch-016-muted:light-dark(color-mix(in oklab,#000000 55%,#ffffff),color-mix(in oklab,#ffffff 60%,#1c1a18));
--vibeui-sketch-016-accent:var(--vibeui-sketch-016-ink);
--vibeui-sketch-016-on-accent:oklch(from var(--vibeui-sketch-016-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-sketch-016-width:2;
--vibeui-sketch-016-font:"Neucha","Caveat","Segoe Print","Bradley Hand",cursive;
--vibeui-sketch-016-display:"Caveat","Neucha","Segoe Print",cursive;
--vibeui-sketch-016-frame:0;
--vibeui-sketch-016-delay:0ms;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sketch-016"]{color-scheme:dark}
:where([data-vibeui-block="sketch-016"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="sketch-016"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="sketch-016"]{position:relative;isolation:isolate;box-sizing:border-box;display:block;background:var(--vibeui-sketch-016-paper);color:var(--vibeui-sketch-016-ink);font-family:var(--vibeui-sketch-016-font);font-size:1.125rem;line-height:1.35;overflow:hidden}
[data-vibeui-block="sketch-016"] *{box-sizing:border-box}
[data-vibeui-block="sketch-016"] [data-part="ink"]{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:-1}
[data-vibeui-block="sketch-016"] [data-part="ink"] path{fill:none;stroke:var(--vibeui-sketch-016-accent);stroke-width:var(--vibeui-sketch-016-width);stroke-linecap:round;stroke-linejoin:round;opacity:clamp(0,1 - (var(--vibeui-sketch-016-frame) - var(--vibeui-sketch-016-i)) * (var(--vibeui-sketch-016-frame) - var(--vibeui-sketch-016-i)),1)}
[data-vibeui-block="sketch-016"] [data-part="ink"] path[data-i="0"]{--vibeui-sketch-016-i:0}
[data-vibeui-block="sketch-016"] [data-part="ink"] path[data-i="1"]{--vibeui-sketch-016-i:1}
[data-vibeui-block="sketch-016"] [data-part="ink"] path[data-i="2"]{--vibeui-sketch-016-i:2}
[data-vibeui-block="sketch-016"] [data-part="ink"] path[data-part="fill"]{fill:var(--vibeui-sketch-016-accent);stroke-width:calc(var(--vibeui-sketch-016-width) * 2)}
[data-vibeui-block="sketch-016"] [data-part="ink"] path[data-part="shadow"]{stroke:var(--vibeui-sketch-016-muted);opacity:calc(clamp(0,1 - (var(--vibeui-sketch-016-frame) - var(--vibeui-sketch-016-i)) * (var(--vibeui-sketch-016-frame) - var(--vibeui-sketch-016-i)),1) * 0.35)}
/* Дорисовка: контур появляется как под пером — stroke-dashoffset от 1 до 0
   (pathLength=1), каждый слой со своей задержкой. Потом — обычный boil. */
[data-vibeui-block="sketch-016"] [data-part="ink"] path{stroke-dasharray:1;stroke-dashoffset:0;animation:vibeui-sketch-016-draw 1s cubic-bezier(.4,0,.2,1) both;animation-delay:var(--vibeui-sketch-016-delay)}
@keyframes vibeui-sketch-016-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@property --vibeui-sketch-016-frame{syntax:"<integer>";inherits:true;initial-value:0}
[data-vibeui-block="sketch-016"][data-boil] [data-part="ink"]{animation:vibeui-sketch-016-boil 1.2s step-end infinite}
@keyframes vibeui-sketch-016-boil{0%{--vibeui-sketch-016-frame:0}33.33%{--vibeui-sketch-016-frame:1}66.67%{--vibeui-sketch-016-frame:2}}

[data-vibeui-block="sketch-016"] [data-part="shell"]{position:relative;max-width:72rem;margin:0 auto;padding:3rem 1.5rem 3.5rem;display:grid;gap:2.5rem;align-items:center}
[data-vibeui-block="sketch-016"] [data-part="copy"]{position:relative;max-width:34rem}
[data-vibeui-block="sketch-016"] [data-part="eyebrow"]{margin:0 0 1rem;font-family:var(--vibeui-sketch-016-display);font-size:1.25rem;color:var(--vibeui-sketch-016-accent);letter-spacing:0.01em}
[data-vibeui-block="sketch-016"] [data-part="title"]{margin:0;font-family:var(--vibeui-sketch-016-display);font-weight:700;font-size:clamp(2.75rem,8cqi,5.5rem);line-height:0.98;letter-spacing:-0.01em;text-wrap:balance}
/* Слова заголовка приезжают по одному — как будто их дописывают. */
[data-vibeui-block="sketch-016"] [data-part="word"]{display:inline-block;animation:vibeui-sketch-016-rise .55s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-sketch-016-n) * 70ms)}
@keyframes vibeui-sketch-016-rise{from{opacity:0;transform:translateY(0.35em) rotate(-2deg)}to{opacity:1;transform:none}}
[data-vibeui-block="sketch-016"] [data-part="circled"]{position:relative;display:inline-block;padding:0 0.15em;color:var(--vibeui-sketch-016-accent);isolation:isolate}
[data-vibeui-block="sketch-016"] [data-part="circled"] [data-part="ink"]{z-index:-1}
[data-vibeui-block="sketch-016"] [data-part="circled"] path{stroke-width:calc(var(--vibeui-sketch-016-width) * 1.3)}
[data-vibeui-block="sketch-016"] [data-part="lede"]{margin:1.5rem 0 0;max-width:30rem;font-size:1.25rem;line-height:1.45;color:var(--vibeui-sketch-016-muted);animation:vibeui-sketch-016-fade .6s .5s both}
@keyframes vibeui-sketch-016-fade{from{opacity:0}to{opacity:1}}
[data-vibeui-block="sketch-016"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:1rem 1.25rem;margin-top:2rem;animation:vibeui-sketch-016-fade .6s .7s both}
[data-vibeui-block="sketch-016"] [data-part="button"]{position:relative;isolation:isolate;display:inline-flex;align-items:center;min-height:3rem;padding:0.6rem 1.5rem;font-family:var(--vibeui-sketch-016-display);font-size:1.5rem;font-weight:600;line-height:1;color:var(--vibeui-sketch-016-ink);text-decoration:none;cursor:pointer;transition:transform .2s}
[data-vibeui-block="sketch-016"] [data-part="button"]:hover{transform:rotate(-1.5deg) translateY(-1px)}
[data-vibeui-block="sketch-016"] [data-part="button"]:focus-visible{outline:2px dashed var(--vibeui-sketch-016-accent);outline-offset:4px}
[data-vibeui-block="sketch-016"] [data-part="button"][data-variant="solid"]{color:var(--vibeui-sketch-016-on-accent)}
/* «это я»: подпись со стрелкой над левым верхним углом фото, стрелка ведёт
   внутрь кадра. Лежит в figure, поэтому едет вместе с наклоном фото. */
[data-vibeui-block="sketch-016"] [data-part="arrow"]{position:absolute;left:-2.5rem;top:-2.4rem;z-index:2;display:none;align-items:center;gap:.4rem;font-family:var(--vibeui-sketch-016-display);font-size:1.35rem;color:var(--vibeui-sketch-016-accent);transform:rotate(-14deg);animation:vibeui-sketch-016-fade .6s 1.1s both}
[data-vibeui-block="sketch-016"] [data-part="arrow"] svg{width:5.5rem;height:3rem;overflow:visible}
[data-vibeui-block="sketch-016"] [data-part="arrow"] path{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;animation:vibeui-sketch-016-draw .8s 1.2s both}
[data-vibeui-block="sketch-016"] [data-part="photo"]{position:relative;isolation:isolate;margin:0;padding:0.75rem 0.75rem 0;background:light-dark(#ffffff,#242220);transform:rotate(var(--vibeui-sketch-016-tilt,1.5deg));animation:vibeui-sketch-016-drop .8s .3s cubic-bezier(.2,.8,.2,1) both;will-change:transform}
@keyframes vibeui-sketch-016-drop{from{opacity:0;transform:translateY(24px) rotate(calc(var(--vibeui-sketch-016-tilt,1.5deg) + 4deg)) scale(.96)}to{opacity:1;transform:rotate(var(--vibeui-sketch-016-tilt,1.5deg))}}
[data-vibeui-block="sketch-016"] [data-part="picture"]{display:block;width:100%;aspect-ratio:4/5;object-fit:cover;background:light-dark(#eee9e1,#2b2825)}
[data-vibeui-block="sketch-016"] [data-part="caption"]{display:block;padding:0.75rem 0.25rem 0.9rem;font-family:var(--vibeui-sketch-016-display);font-size:1.35rem;line-height:1.1;color:var(--vibeui-sketch-016-muted);text-align:center}
/* Кусочек малярного скотча сверху: полупрозрачная полоска под наклоном. */
[data-vibeui-block="sketch-016"] [data-part="tape"]{position:absolute;top:-0.7rem;left:50%;width:6rem;height:1.5rem;transform:translateX(-50%) rotate(-3deg);background:color-mix(in oklab,var(--vibeui-sketch-016-accent) 22%,#f5f0e6);opacity:.85;z-index:1}
[data-vibeui-block="sketch-016"] [data-part="note"]{margin:1.25rem 0 0;font-size:1rem;color:var(--vibeui-sketch-016-muted)}
@container (min-width: 52rem){
[data-vibeui-block="sketch-016"] [data-part="shell"]{grid-template-columns:minmax(0,1.15fr) minmax(0,0.85fr);gap:3.5rem;padding:4.5rem 2.5rem 5rem}
[data-vibeui-block="sketch-016"] [data-part="arrow"]{display:flex}
[data-vibeui-block="sketch-016"] [data-part="photo"]{max-width:26rem;justify-self:end}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sketch-016"] *,[data-vibeui-block="sketch-016"] [data-part="ink"]{animation:none!important;transition:none!important}}`

/** Первый экран от руки: заголовок с обведённым словом, нарисованные кнопки и приклеенное фото. */
export function Sketch016({
  eyebrow = "Портретный фотограф · Петербург",
  title = "Снимаю людей,",
  titleAccent = "а не позы",
  lede = "Без «улыбнитесь на счёт три». Час разговора, немного прогулки — и на карточках вы такие, какими вас видят близкие.",
  primaryLabel = "Записаться",
  primaryHref = "#",
  secondaryLabel = "Смотреть работы",
  secondaryHref = "#",
  image = "",
  imageAlt = "",
  imageCaption = "Нева, май, плёнка",
  arrowLabel = "это я",
  rough = "loose",
  boil = "soft",
  seed,
  tone = "auto",
  accent,
  ink,
  className,
  style,
}: Sketch016Props) {
  const base = seed ?? hash(title + titleAccent)
  const roughness = ROUGH[rough] ?? ROUGH.loose
  const shake = BOIL[boil] ?? BOIL.soft
  const words = title.split(/\s+/).filter(Boolean)

  const palette = {
    ...(accent ? { "--vibeui-sketch-016-accent": accent } : null),
    ...(ink ? { "--vibeui-sketch-016-ink": ink } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-sketch-016" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="sketch-016"
        data-tone={tone === "auto" ? undefined : tone}
        data-boil={shake > 0 ? "" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="copy">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h1 data-part="title">
              {words.map((word, index) => (
                <span key={`${word}-${index}`}>
                  <span data-part="word" style={{ ["--vibeui-sketch-016-n" as string]: index }}>
                    {word}
                  </span>{" "}
                </span>
              ))}
              {titleAccent ? (
                <span data-part="word" style={{ ["--vibeui-sketch-016-n" as string]: words.length }}>
                  <Circled text={titleAccent} seed={base + 11} rough={roughness} boil={shake} />
                </span>
              ) : null}
            </h1>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <div data-part="actions">
              {primaryLabel ? (
                <Framed as="a" part="button" href={primaryHref} seed={base + 21} rough={roughness} boil={shake} radius={14} fill delay={600}>
                  {primaryLabel}
                </Framed>
              ) : null}
              {secondaryLabel ? (
                <Framed as="a" part="button" href={secondaryHref} seed={base + 31} rough={roughness} boil={shake} radius={14} delay={750}>
                  {secondaryLabel}
                </Framed>
              ) : null}
            </div>
          </div>
          <Framed as="figure" part="photo" seed={base + 41} rough={roughness} boil={shake} radius={6} shadow delay={300}>
            <span data-part="tape" aria-hidden="true" />
            {arrowLabel ? (
              <span data-part="arrow" aria-hidden="true">
                {arrowLabel}
                <svg viewBox="0 0 88 48">
                  <path pathLength={1} d="M4 6 C 28 2, 60 14, 82 40 M 66 34 L 82 40 L 80 24" />
                </svg>
              </span>
            ) : null}
            {image ? (
              <img data-part="picture" src={image} alt={imageAlt} loading="eager" />
            ) : (
              <span data-part="picture" role="img" aria-label={imageAlt} />
            )}
            {imageCaption ? <figcaption data-part="caption">{imageCaption}</figcaption> : null}
          </Framed>
        </div>
      </section>
    </>
  )
}

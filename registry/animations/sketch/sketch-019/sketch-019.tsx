"use client"

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react"

export type Sketch019Link = {
  label: string
  href: string
  current?: boolean
}

export type Sketch019Props = {
  /** Имя студии или человека, рукописное. */
  brand?: string
  brandHref?: string
  /** Подпись под именем: «фотограф · Петербург». */
  caption?: string
  /** Картинка-логотип вместо нарисованного фотоаппарата. */
  logo?: string
  logoAlt?: string
  links?: readonly Sketch019Link[]
  actionLabel?: string
  actionHref?: string
  /** Кнопка: заштрихована карандашом или залита чернилами. */
  actionStyle?: "hatch" | "solid"
  /** Подпись кнопки меню на узком экране. */
  menuLabel?: string
  /** Прилипает к верху страницы. */
  sticky?: boolean
  /** Почерк: аккуратный или размашистый. */
  rough?: "neat" | "loose"
  /** Дрожание линии: покой, мягкое или живое. */
  boil?: "still" | "soft" | "lively"
  /** Зерно почерка: одно число — один и тот же рисунок. Без него — от имени. */
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

// Шапка от руки: нарисованный фотоаппарат вместо логотипа, имя рукописным
// шрифтом, ссылки с подчёркиванием-росчерком (текущая — жирным штрихом,
// остальные — по наведению) и кнопка в нарисованной капсуле. На узком
// экране ссылки прячутся за кнопкой «меню» и раскрываются списком.
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

function linePoints(x0: number, y0: number, x1: number, y1: number, step = 10): Point[] {
  const count = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / step) + 1)

  return Array.from({ length: count }, (_, index) => {
    const t = index / (count - 1)

    return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t] as Point
  })
}

function circlePoints(cx: number, cy: number, r: number, count = 18): Point[] {
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

/**
 * Штриховка как карандашом, не отрывая руки: пила между кромками, но шаг,
 * наклон и заход к кромке гуляют от штриха к штриху — ровная пила выглядит
 * машинной. Каждый шестой штрих не дотягивает до кромки, как бывает у руки.
 */
function hatchPoints(w: number, h: number, seed: number, rough: number): Point[] {
  const next = random(seed)
  const jitter = (amount: number) => (next() - 0.5) * 2 * amount
  const top = 5
  const bottom = h - 5
  const points: Point[] = []
  let x = 6 + (bottom - top) * 0.55
  let index = 0

  while (x <= w - 4) {
    const back = (bottom - top) * (0.42 + next() * 0.28)
    const short = index % 6 === 5
    const peak: Point = [x + jitter(1.5), top + (short ? 5 + jitter(3) : jitter(2.5))]
    const dip: Point = [x - back + jitter(2), bottom - (short ? jitter(2) : 1 + jitter(3))]

    points.push(peak, [(peak[0] + dip[0]) / 2 + jitter(1.5), (peak[1] + dip[1]) / 2 + jitter(1.5)], dip)

    const step = 8.5 + next() * 5 + rough
    const nextX = x + step

    if (nextX <= w - 4) points.push([(dip[0] + nextX) / 2 + jitter(1.5), (top + bottom) / 2 + jitter(2)])

    x = nextX
    index += 1
  }

  return points
}

const ROUGH = { neat: 0.8, loose: 1.8 } as const
const BOIL = { still: 0, soft: 0.7, lively: 1.4 } as const

/** Фотоаппарат от руки: корпус, объектив в два круга, видоискатель и кнопка. */
function Camera({ seed, rough, boil }: { seed: number; rough: number; boil: number }) {
  const w = 44
  const h = 36
  const body = sketch(rectPoints(w, h, 3, 6, 6).map(([x, y]) => [x, y + 3] as Point), seed, rough * 0.6, boil * 0.6, true)
  const lens = sketch(circlePoints(w / 2, h / 2 + 3, 9), seed + 1, rough * 0.5, boil * 0.6)
  const pupil = sketch(circlePoints(w / 2, h / 2 + 3, 4, 12), seed + 2, rough * 0.4, boil * 0.5)
  const finder = sketch(rectPoints(14, 8, 1, 2, 4).map(([x, y]) => [x + 8, y] as Point), seed + 3, rough * 0.5, boil * 0.5, true)
  const button = sketch(linePoints(31, 4, 36, 4, 3), seed + 4, rough * 0.4, boil * 0.4)

  return (
    <svg data-part="camera" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      {[body, lens, pupil, finder, button].map((frames, layer) =>
        frames.map((d, frame) => <path key={`${layer}-${frame}`} d={d} data-i={frame} />),
      )}
    </svg>
  )
}

/**
 * Кнопка в нарисованной капсуле: заштрихована карандашом (диагональные
 * штрихи, обрезанные по контуру капсулы) или залита чернилами.
 */
function Button({
  href,
  seed,
  rough,
  boil,
  variant,
  children,
}: {
  href: string
  seed: number
  rough: number
  boil: number
  variant: "hatch" | "solid"
  children: ReactNode
}) {
  const host = useRef<HTMLAnchorElement>(null)
  const { w, h } = useSize(host)
  const [stroke, setStroke] = useState(0)
  const id = useId()
  const base = seed + stroke * 104729
  const line = sketch(rectPoints(w, h, 2, h / 2, 12), base, rough, boil, true)
  // Штриховка одним path, как карандашом не отрывая руки (см. hatchPoints);
  // лишнее у скруглённых концов срезает clipPath по контуру капсулы.
  const hatch = w > 0 && h > 0 ? sketch(hatchPoints(w, h, base + 17, rough), base + 23, rough * 0.45, boil * 0.8) : []

  return (
    <a ref={host} href={href} data-part="action" data-variant={variant} onPointerEnter={() => setStroke((count) => count + 1)}>
      {w > 0 && h > 0 ? (
        <svg data-part="ink" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
          {variant === "hatch" ? (
            <>
              <clipPath id={`${id}-clip`}>
                <path d={line[0]} />
              </clipPath>
              <g clipPath={`url(#${id}-clip)`}>
                {hatch.map((d, frame) => (
                  <path key={frame} d={d} data-part="hatch" data-i={frame} />
                ))}
              </g>
            </>
          ) : (
            line.map((d, frame) => <path key={`fill-${frame}`} d={d} data-part="fill" data-i={frame} />)
          )}
          {line.map((d, frame) => (
            <path key={`line-${frame}`} d={d} data-part="line" data-i={frame} />
          ))}
        </svg>
      ) : null}
      {children}
    </a>
  )
}

/** Ссылка с росчерком-подчёркиванием: текущая — всегда, остальные — по наведению. */
function NavLink({ link, seed, rough, boil }: { link: Sketch019Link; seed: number; rough: number; boil: number }) {
  const host = useRef<HTMLAnchorElement>(null)
  const { w, h } = useSize(host)
  const line = sketch(linePoints(2, h - 3, w - 2, h - 2), seed, rough * 1.2, boil)

  return (
    <a ref={host} href={link.href} data-part="link" aria-current={link.current ? "page" : undefined}>
      <Ink w={w} h={h} layers={[{ frames: line, part: "under" }]} />
      {link.label}
    </a>
  )
}

const STYLES = `
:where([data-vibeui-block="sketch-019"]){
--vibeui-sketch-019-ink:light-dark(#1a1a1a,#f2f2f2);
--vibeui-sketch-019-paper:light-dark(#fbf8f3,#1c1a18);
--vibeui-sketch-019-muted:light-dark(color-mix(in oklab,#000000 55%,#ffffff),color-mix(in oklab,#ffffff 60%,#1c1a18));
--vibeui-sketch-019-accent:var(--vibeui-sketch-019-ink);
--vibeui-sketch-019-on-accent:oklch(from var(--vibeui-sketch-019-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-sketch-019-width:2;
--vibeui-sketch-019-font:"Neucha","Caveat","Segoe Print","Bradley Hand",cursive;
--vibeui-sketch-019-display:"Caveat","Neucha","Segoe Print",cursive;
--vibeui-sketch-019-frame:0;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sketch-019"]{color-scheme:dark}
:where([data-vibeui-block="sketch-019"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="sketch-019"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="sketch-019"]{position:relative;z-index:20;box-sizing:border-box;display:block;background:color-mix(in oklab,var(--vibeui-sketch-019-paper) 92%,transparent);backdrop-filter:blur(6px);color:var(--vibeui-sketch-019-ink);font-family:var(--vibeui-sketch-019-font);font-size:1.125rem;line-height:1.2}
[data-vibeui-block="sketch-019"][data-sticky]{position:sticky;top:0}
[data-vibeui-block="sketch-019"] *{box-sizing:border-box}
[data-vibeui-block="sketch-019"] [data-part="ink"]{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:-1}
[data-vibeui-block="sketch-019"] path{fill:none;stroke:var(--vibeui-sketch-019-accent);stroke-width:var(--vibeui-sketch-019-width);stroke-linecap:round;stroke-linejoin:round;opacity:clamp(0,1 - (var(--vibeui-sketch-019-frame) - var(--vibeui-sketch-019-i)) * (var(--vibeui-sketch-019-frame) - var(--vibeui-sketch-019-i)),1)}
[data-vibeui-block="sketch-019"] path[data-i="0"]{--vibeui-sketch-019-i:0}
[data-vibeui-block="sketch-019"] path[data-i="1"]{--vibeui-sketch-019-i:1}
[data-vibeui-block="sketch-019"] path[data-i="2"]{--vibeui-sketch-019-i:2}
[data-vibeui-block="sketch-019"] path[data-part="fill"]{fill:var(--vibeui-sketch-019-accent);stroke-width:calc(var(--vibeui-sketch-019-width) * 2)}
[data-vibeui-block="sketch-019"] path[data-part="hatch"]{stroke-width:calc(var(--vibeui-sketch-019-width) * 0.6);opacity:calc(clamp(0,1 - (var(--vibeui-sketch-019-frame) - var(--vibeui-sketch-019-i)) * (var(--vibeui-sketch-019-frame) - var(--vibeui-sketch-019-i)),1) * 0.45)}
@property --vibeui-sketch-019-frame{syntax:"<integer>";inherits:true;initial-value:0}
[data-vibeui-block="sketch-019"][data-boil] svg{animation:vibeui-sketch-019-boil 1.2s step-end infinite}
@keyframes vibeui-sketch-019-boil{0%{--vibeui-sketch-019-frame:0}33.33%{--vibeui-sketch-019-frame:1}66.67%{--vibeui-sketch-019-frame:2}}
/* Низ шапки — карандашная линия, а не border: боковины уходят чуть за край. */
[data-vibeui-block="sketch-019"] [data-part="rule"]{position:absolute;left:0;right:0;bottom:-2px;height:6px;overflow:visible;pointer-events:none}
[data-vibeui-block="sketch-019"] [data-part="rule"] path{stroke-width:1.5;opacity:calc(clamp(0,1 - (var(--vibeui-sketch-019-frame) - var(--vibeui-sketch-019-i)) * (var(--vibeui-sketch-019-frame) - var(--vibeui-sketch-019-i)),1) * 0.7)}
[data-vibeui-block="sketch-019"] [data-part="bar"]{position:relative;max-width:72rem;margin:0 auto;padding:.75rem 1.25rem;display:flex;align-items:center;gap:1rem 1.5rem}
[data-vibeui-block="sketch-019"] [data-part="brand"]{display:flex;align-items:center;gap:.7rem;color:inherit;text-decoration:none;margin-right:auto;min-width:0}
[data-vibeui-block="sketch-019"] [data-part="camera"]{width:2.75rem;height:2.25rem;overflow:visible;flex:none;transform:rotate(-6deg);transition:transform .3s}
[data-vibeui-block="sketch-019"] [data-part="brand"]:hover [data-part="camera"]{transform:rotate(4deg) scale(1.06)}
[data-vibeui-block="sketch-019"] [data-part="logo"]{width:2.75rem;height:2.75rem;object-fit:contain;flex:none}
[data-vibeui-block="sketch-019"] [data-part="name"]{display:block;font-family:var(--vibeui-sketch-019-display);font-size:1.75rem;font-weight:700;line-height:1;white-space:nowrap}
[data-vibeui-block="sketch-019"] [data-part="caption"]{display:block;margin-top:.15rem;font-size:.9rem;color:var(--vibeui-sketch-019-muted);white-space:nowrap}
[data-vibeui-block="sketch-019"] [data-part="nav"]{display:none;align-items:center;gap:.25rem 1.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="sketch-019"] [data-part="link"]{position:relative;isolation:isolate;display:inline-block;padding:.35rem .15rem;color:inherit;text-decoration:none;font-size:1.2rem;white-space:nowrap}
[data-vibeui-block="sketch-019"] [data-part="link"] [data-part="ink"]{opacity:0;transition:opacity .2s}
[data-vibeui-block="sketch-019"] [data-part="link"]:hover [data-part="ink"],[data-vibeui-block="sketch-019"] [data-part="link"][aria-current] [data-part="ink"]{opacity:1}
[data-vibeui-block="sketch-019"] [data-part="link"][aria-current] path{stroke-width:calc(var(--vibeui-sketch-019-width) * 1.6)}
[data-vibeui-block="sketch-019"] [data-part="link"]:focus-visible,[data-vibeui-block="sketch-019"] [data-part="action"]:focus-visible,[data-vibeui-block="sketch-019"] [data-part="toggle"]:focus-visible{outline:2px dashed var(--vibeui-sketch-019-accent);outline-offset:3px}
[data-vibeui-block="sketch-019"] [data-part="action"]{position:relative;isolation:isolate;display:none;padding:.5rem 1.25rem .55rem;font-family:var(--vibeui-sketch-019-display);font-size:1.35rem;font-weight:600;line-height:1;color:var(--vibeui-sketch-019-ink);text-decoration:none;white-space:nowrap;transition:transform .2s}
[data-vibeui-block="sketch-019"] [data-part="action"][data-variant="solid"]{color:var(--vibeui-sketch-019-on-accent)}
/* Штриховка светлая (opacity .45), текст чернилами поверх — читается без подложки. */
[data-vibeui-block="sketch-019"] [data-part="action"][data-variant="hatch"] [data-part="label"]{position:relative;font-weight:700}
[data-vibeui-block="sketch-019"] [data-part="action"]:hover{transform:rotate(-2deg)}
[data-vibeui-block="sketch-019"] [data-part="toggle"]{appearance:none;border:0;background:none;padding:.35rem .5rem;font:inherit;font-family:var(--vibeui-sketch-019-display);font-size:1.35rem;color:inherit;cursor:pointer;text-decoration:underline;text-decoration-style:wavy;text-underline-offset:.2em}
[data-vibeui-block="sketch-019"] [data-part="sheet"]{display:grid;gap:.25rem;padding:.25rem 1.25rem 1rem;margin:0;list-style:none}
[data-vibeui-block="sketch-019"] [data-part="sheet"][hidden]{display:none}
[data-vibeui-block="sketch-019"] [data-part="sheet"] [data-part="link"]{font-size:1.5rem}
@container (min-width: 48rem){
[data-vibeui-block="sketch-019"] [data-part="nav"]{display:flex}
[data-vibeui-block="sketch-019"] [data-part="action"]{display:inline-block}
[data-vibeui-block="sketch-019"] [data-part="toggle"],[data-vibeui-block="sketch-019"] [data-part="sheet"]{display:none}
[data-vibeui-block="sketch-019"] [data-part="bar"]{padding:.85rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sketch-019"] svg{animation:none!important}[data-vibeui-block="sketch-019"] *{transition:none!important}}`

const DEFAULT_LINKS: Sketch019Link[] = [
  { label: "Работы", href: "#works", current: true },
  { label: "Как проходит съёмка", href: "#process" },
  { label: "Обо мне", href: "#about" },
  { label: "Цены", href: "#pricing" },
]

/** Шапка от руки: нарисованный фотоаппарат, рукописное имя, ссылки с росчерком, кнопка-капсула. */
export function Sketch019({
  brand = "Аня Соколова",
  brandHref = "#",
  caption = "фотограф · Петербург",
  logo = "",
  logoAlt = "",
  links = DEFAULT_LINKS,
  actionLabel = "Записаться",
  actionHref = "#book",
  actionStyle = "hatch",
  menuLabel = "меню",
  sticky = true,
  rough = "loose",
  boil = "soft",
  seed,
  tone = "auto",
  accent,
  ink,
  className,
  style,
}: Sketch019Props) {
  const host = useRef<HTMLElement>(null)
  const { w } = useSize(host)
  const [open, setOpen] = useState(false)
  const id = useId()
  const base = seed ?? hash(brand)
  const roughness = ROUGH[rough] ?? ROUGH.loose
  const shake = BOIL[boil] ?? BOIL.soft
  const rule = w > 0 ? sketch(linePoints(-4, 3, w + 4, 3, 18), base + 99, roughness * 1.4, shake) : []

  const palette = {
    ...(accent ? { "--vibeui-sketch-019-accent": accent } : null),
    ...(ink ? { "--vibeui-sketch-019-ink": ink } : null),
    ...style,
  } as CSSProperties

  const items = (
    <>
      {links.map((link, index) => (
        <li key={`${link.href}-${index}`}>
          <NavLink link={link} seed={base + 10 + index} rough={roughness} boil={shake} />
        </li>
      ))}
    </>
  )

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-sketch-019" precedence="medium">
        {STYLES}
      </style>
      <header
        ref={host}
        data-vibeui-block="sketch-019"
        data-tone={tone === "auto" ? undefined : tone}
        data-boil={shake > 0 ? "" : undefined}
        data-sticky={sticky ? "" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <a href={brandHref} data-part="brand">
            {logo ? <img data-part="logo" src={logo} alt={logoAlt || brand} /> : <Camera seed={base} rough={roughness} boil={shake} />}
            <span>
              <span data-part="name">{brand}</span>
              {caption ? <span data-part="caption">{caption}</span> : null}
            </span>
          </a>
          <nav aria-label="Разделы">
            <ul data-part="nav">{items}</ul>
          </nav>
          {actionLabel ? (
            <Button href={actionHref} seed={base + 50} rough={roughness} boil={shake} variant={actionStyle}>
              <span data-part="label">{actionLabel}</span>
            </Button>
          ) : null}
          <button type="button" data-part="toggle" aria-expanded={open} aria-controls={id} onClick={() => setOpen((value) => !value)}>
            {menuLabel}
          </button>
        </div>
        <ul id={id} data-part="sheet" hidden={!open}>
          {items}
          {actionLabel ? (
            <li>
              <a href={actionHref} data-part="link">
                {actionLabel} →
              </a>
            </li>
          ) : null}
        </ul>
        {rule.length > 0 ? (
          <svg data-part="rule" viewBox={`0 0 ${w} 6`} preserveAspectRatio="none" aria-hidden="true">
            {rule.map((d, frame) => (
              <path key={frame} d={d} data-i={frame} />
            ))}
          </svg>
        ) : null}
      </header>
    </>
  )
}

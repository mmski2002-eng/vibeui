"use client"

import { useEffect, useRef, useState, type CSSProperties, type RefObject, useId, type KeyboardEvent } from "react"

export type Sketch008Props = {
  /** Названия вкладок. */
  tabs?: readonly string[]
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

// Рукописные вкладки: под рядом кнопок — линия от руки, под активной —
// жирный подчёрк, который перерисовывается по её коробке. Кнопки с
// role=tab, панель с role=tabpanel; стрелки переключают вкладки.
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
:where([data-vibeui-block="sketch-008"]){
--vibeui-sketch-008-ink:light-dark(#1a1a1a,#f2f2f2);
--vibeui-sketch-008-paper:light-dark(#ffffff,#1a1a1a);
--vibeui-sketch-008-muted:light-dark(color-mix(in oklab,#000000 55%,#ffffff),color-mix(in oklab,#ffffff 60%,#1a1a1a));
--vibeui-sketch-008-accent:var(--vibeui-sketch-008-ink);
--vibeui-sketch-008-on-accent:oklch(from var(--vibeui-sketch-008-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-sketch-008-width:2;
--vibeui-sketch-008-font:"Neucha","Caveat","Segoe Print","Bradley Hand",cursive;
--vibeui-sketch-008-display:"Caveat","Neucha","Segoe Print",cursive;
--vibeui-sketch-008-frame:0;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sketch-008"]{color-scheme:dark}
:where([data-vibeui-block="sketch-008"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="sketch-008"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="sketch-008"]{position:relative;isolation:isolate;box-sizing:border-box;color:var(--vibeui-sketch-008-ink);font-family:var(--vibeui-sketch-008-font);font-style:italic;font-size:1.125rem;line-height:1.3}
[data-vibeui-block="sketch-008"] *{box-sizing:border-box}
/* Чернила — абсолютный слой под содержимым; overflow visible, потому что
   дрожащая линия выходит за коробку на пару пикселей. */
[data-vibeui-block="sketch-008"] [data-part="ink"]{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:-1}
[data-vibeui-block="sketch-008"] [data-part="ink"] path{fill:none;stroke:var(--vibeui-sketch-008-accent);stroke-width:var(--vibeui-sketch-008-width);stroke-linecap:round;stroke-linejoin:round;opacity:clamp(0,1 - (var(--vibeui-sketch-008-frame) - var(--vibeui-sketch-008-i)) * (var(--vibeui-sketch-008-frame) - var(--vibeui-sketch-008-i)),1)}
[data-vibeui-block="sketch-008"] [data-part="ink"] path[data-i="0"]{--vibeui-sketch-008-i:0}
[data-vibeui-block="sketch-008"] [data-part="ink"] path[data-i="1"]{--vibeui-sketch-008-i:1}
[data-vibeui-block="sketch-008"] [data-part="ink"] path[data-i="2"]{--vibeui-sketch-008-i:2}
[data-vibeui-block="sketch-008"] [data-part="ink"] path[data-part="fill"]{fill:var(--vibeui-sketch-008-accent);stroke:var(--vibeui-sketch-008-accent);stroke-width:calc(var(--vibeui-sketch-008-width) * 2)}
[data-vibeui-block="sketch-008"] [data-part="ink"] path[data-part="hatch"]{stroke-width:calc(var(--vibeui-sketch-008-width) * 0.7);opacity:calc(clamp(0,1 - (var(--vibeui-sketch-008-frame) - var(--vibeui-sketch-008-i)) * (var(--vibeui-sketch-008-frame) - var(--vibeui-sketch-008-i)),1) * 0.8)}
/* Boil: три кадра переключаются step-end раз в 0.4 с — как в рисованной
   анимации; кадр выбирает целочисленная переменная, видим только свой. */
@property --vibeui-sketch-008-frame{syntax:"<integer>";inherits:true;initial-value:0}
[data-vibeui-block="sketch-008"][data-boil] [data-part="ink"]{animation:vibeui-sketch-008-boil 1.2s step-end infinite}
@keyframes vibeui-sketch-008-boil{0%{--vibeui-sketch-008-frame:0}33.33%{--vibeui-sketch-008-frame:1}66.67%{--vibeui-sketch-008-frame:2}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sketch-008"] [data-part="ink"]{animation:none!important}[data-vibeui-block="sketch-008"] *{transition:none!important}}

[data-vibeui-block="sketch-008"]{display:inline-flex;flex-direction:column;gap:0.75rem;min-width:16rem}
[data-vibeui-block="sketch-008"] [data-part="list"]{position:relative;display:flex;gap:0.25rem;padding-bottom:0.5rem}
[data-vibeui-block="sketch-008"] [data-part="ink"] path[data-part="rail"]{stroke:var(--vibeui-sketch-008-muted);opacity:calc(clamp(0,1 - (var(--vibeui-sketch-008-frame) - var(--vibeui-sketch-008-i)) * (var(--vibeui-sketch-008-frame) - var(--vibeui-sketch-008-i)),1) * 0.5)}
[data-vibeui-block="sketch-008"] [role="tab"]{padding:0.3em 0.8em;border:0;background:none;font:inherit;font-family:var(--vibeui-sketch-008-font);color:var(--vibeui-sketch-008-muted);cursor:pointer;transition:color 0.2s,transform 0.2s}
[data-vibeui-block="sketch-008"] [role="tab"][aria-selected="true"]{color:var(--vibeui-sketch-008-ink)}
[data-vibeui-block="sketch-008"] [role="tab"]:hover{transform:translateY(-1px);color:var(--vibeui-sketch-008-ink)}
[data-vibeui-block="sketch-008"] [role="tab"]:focus-visible{outline:2px dashed var(--vibeui-sketch-008-accent);outline-offset:2px;border-radius:0.5rem}
[data-vibeui-block="sketch-008"] [data-part="panel"]{color:var(--vibeui-sketch-008-muted);font-family:var(--vibeui-sketch-008-display);font-size:1.4rem}`

/** Рукописные вкладки: подчёркивание от руки едет к активной. */
export function Sketch008({
  tabs = ["Обзор","Цены","Отзывы"],
  rough = "neat",
  boil = "soft",
  seed,
  tone = "auto",
  accent,
  ink,
  className,
  style,
}: Sketch008Props) {
  const host = useRef<HTMLDivElement>(null)
  const { w, h } = useSize(host)
  // Новый росчерк по наведению: seed сдвигается, контуры пересчитываются.
  const [stroke, setStroke] = useState(0)
  const base = (seed ?? hash(tabs.join())) + stroke * 104729
  const roughness = ROUGH[rough] ?? ROUGH.neat
  const shake = BOIL[boil] ?? BOIL.soft
  const [active, setActive] = useState(0)
  const [span, setSpan] = useState({ x: 0, width: 0 })
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const id = `sketch-${useId().replace(/:/g, "")}`

  useEffect(() => {
    const button = buttons.current[active]

    if (button) setSpan({ x: button.offsetLeft, width: button.offsetWidth })
  }, [active, w])

  const rail = sketch(linePoints(2, h - 3, w - 2, h - 3, 16), base, roughness * 0.6, shake)
  const mark = span.width > 0 ? sketch(linePoints(span.x + 6, h - 4, span.x + span.width - 6, h - 4, 10), base + 13 + active, roughness, shake) : null

  function onKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return

    event.preventDefault()
    const next = (active + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length

    setActive(next)
    buttons.current[next]?.focus()
  }

  const palette = {
    ...(accent ? { "--vibeui-sketch-008-accent": accent } : null),
    ...(ink ? { "--vibeui-sketch-008-ink": ink } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-sketch-008" precedence="medium">
        {STYLES}
      </style>
      <div className={className} style={palette} data-vibeui-block="sketch-008" data-tone={tone === "auto" ? undefined : tone} data-boil={shake > 0 ? "" : undefined}>
        <div data-part="list" role="tablist" ref={host} onKeyDown={onKey} onPointerEnter={() => setStroke((count) => count + 1)}>
          <Ink w={w} h={h} layers={[{ frames: rail, part: "rail" }, ...(mark ? [{ frames: mark, part: "line", width: 3 }] : [])]} />
          {tabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              role="tab"
              id={`${id}-tab-${index}`}
              aria-selected={active === index}
              aria-controls={`${id}-panel`}
              tabIndex={active === index ? 0 : -1}
              ref={(node) => {
                buttons.current[index] = node
              }}
              onClick={() => setActive(index)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div data-part="panel" role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${active}`}>
          {tabs[active]}
        </div>
      </div>
    </>
  )
}

"use client"

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type PointerEvent } from "react"

export type Bakery001Product = {
  id: string
  name: string
  text?: string
  price: string
  image?: string
  /** Во сколько вышла из печи: «08:30». */
  bakedAt?: string
  /** Сколько осталось на полке. */
  left?: number
}

export type Bakery001Props = {
  eyebrow?: string
  title?: string
  lede?: string
  hint?: string
  products?: readonly Bakery001Product[]
  addLabel?: string
  inBoxLabel?: string
  fullLabel?: string
  /** Сколько позиций вмещает коробка (совпадает с блоком коробки). */
  boxSize?: number
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Витрина-полка: горизонтальная лента карточек выпечки, которую тянут мышью
// (drag-to-scroll) или пальцем, карточки «стоят» на деревянной полке, у
// каждой — время выхода из печи и остаток («последние 4» — рукописно).
// Кнопка «в коробку» шлёт событие `vibeui-box:add` на window — блок коробки
// (bakery-003) его ловит; обратно приходит `vibeui-box:state`, и кнопка
// показывает «в коробке · 2 шт». Без блока коробки кнопка просто считает сама.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Golos+Text:wght@400;500;600&family=Caveat:wght@600&display=swap"

const STYLES = `
:where([data-vibeui-block="bakery-001"]){
--vibeui-bakery-001-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-bakery-001-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bakery-001-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bakery-001-on-accent:oklch(from var(--vibeui-bakery-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-bakery-001-muted:color-mix(in oklab,var(--vibeui-bakery-001-fg) 60%,var(--vibeui-bakery-001-bg));
--vibeui-bakery-001-panel:color-mix(in oklab,var(--vibeui-bakery-001-fg) 5%,var(--vibeui-bakery-001-bg));
--vibeui-bakery-001-card:light-dark(#fff,color-mix(in oklab,var(--vibeui-bakery-001-bg) 88%,var(--vibeui-bakery-001-fg)));
--vibeui-bakery-001-wood:light-dark(#c9ad86,#5a4632);
--vibeui-bakery-001-display:"Playfair Display",ui-serif,Georgia,serif;
--vibeui-bakery-001-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-bakery-001-hand:"Caveat",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="bakery-001"]{color-scheme:dark}
:where([data-vibeui-block="bakery-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="bakery-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="bakery-001"]{box-sizing:border-box;position:relative;overflow:hidden;padding:5.5rem 0;background:var(--vibeui-bakery-001-panel);color:var(--vibeui-bakery-001-fg);font-family:var(--vibeui-bakery-001-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="bakery-001"] *{box-sizing:border-box}
[data-vibeui-block="bakery-001"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="bakery-001"] [data-part="head"]{display:flex;align-items:flex-end;justify-content:space-between;gap:2rem;flex-wrap:wrap;margin-bottom:2.5rem}
[data-vibeui-block="bakery-001"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.5rem;font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--vibeui-bakery-001-accent);font-weight:600;margin:0 0 1.1rem}
[data-vibeui-block="bakery-001"] [data-part="eyebrow"]::before{content:"";width:1.4rem;height:2px;background:var(--vibeui-bakery-001-accent);border-radius:2px}
[data-vibeui-block="bakery-001"] [data-part="title"]{margin:0;font-family:var(--vibeui-bakery-001-display);font-weight:600;letter-spacing:-.02em;line-height:1.02;font-size:clamp(2rem,4.6cqi,3.6rem)}
[data-vibeui-block="bakery-001"] [data-part="lede"]{font-size:1.06rem;color:var(--vibeui-bakery-001-muted);max-width:34rem;margin:1rem 0 0}
[data-vibeui-block="bakery-001"] [data-part="hint"]{display:inline-flex;align-items:center;gap:.5rem;color:var(--vibeui-bakery-001-muted);font-size:.9rem}
[data-vibeui-block="bakery-001"] [data-part="hint"] svg{width:2.2rem;height:1.2rem;stroke:var(--vibeui-bakery-001-accent);fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
[data-vibeui-block="bakery-001"] [data-part="rail"]{position:relative}
[data-vibeui-block="bakery-001"] [data-part="rail"]::before{content:"";position:absolute;left:0;right:0;bottom:2.2rem;height:1.4rem;background:linear-gradient(180deg,color-mix(in oklab,var(--vibeui-bakery-001-wood) 70%,white),var(--vibeui-bakery-001-wood) 70%,color-mix(in oklab,var(--vibeui-bakery-001-wood) 80%,black));border-radius:3px;box-shadow:0 16px 28px -12px rgb(0 0 0 / .45),0 1px 0 rgb(255 255 255 / .5) inset}
[data-vibeui-block="bakery-001"] [data-part="rail"]::after{content:"";position:absolute;left:0;right:0;bottom:2.1rem;height:.3rem;background:rgb(0 0 0 / .12);filter:blur(4px)}
[data-vibeui-block="bakery-001"] [data-part="track"]{display:flex;gap:1.25rem;overflow-x:auto;scroll-snap-type:x proximity;padding:1rem max(1.25rem,calc((100cqi - 80rem) / 2 + 1.25rem)) 3.4rem;scroll-padding-inline:max(1.25rem,calc((100cqi - 80rem) / 2 + 1.25rem));scrollbar-width:none;cursor:grab;user-select:none;-webkit-user-select:none}
[data-vibeui-block="bakery-001"] [data-part="track"]::-webkit-scrollbar{display:none}
[data-vibeui-block="bakery-001"] [data-part="track"][data-dragging="true"]{cursor:grabbing;scroll-snap-type:none}
[data-vibeui-block="bakery-001"] [data-part="item"]{position:relative;display:flex;flex-direction:column;flex:0 0 16.5rem;scroll-snap-align:start;padding:.9rem .9rem 1.1rem;border-radius:1.4rem;background:var(--vibeui-bakery-001-card);box-shadow:0 1px 0 rgb(255 255 255 / .5) inset,0 24px 48px -32px rgb(0 0 0 / .35),0 1px 2px rgb(0 0 0 / .06);transition:transform .3s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="bakery-001"] [data-part="item"]:hover{transform:translateY(-.6rem)}
[data-vibeui-block="bakery-001"] [data-part="pic"]{position:relative;aspect-ratio:1;border-radius:1rem;overflow:hidden;background:var(--vibeui-bakery-001-panel)}
[data-vibeui-block="bakery-001"] [data-part="pic"] img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s;pointer-events:none}
[data-vibeui-block="bakery-001"] [data-part="item"]:hover [data-part="pic"] img{transform:scale(1.05)}
[data-vibeui-block="bakery-001"] [data-part="fresh"]{position:absolute;left:.6rem;top:.6rem;display:inline-flex;align-items:center;gap:.35rem;padding:.3rem .6rem;border-radius:999px;background:rgb(255 255 255 / .85);backdrop-filter:blur(6px);font-size:.72rem;font-weight:600;color:#1a1a1a;font-variant-numeric:tabular-nums}
[data-vibeui-block="bakery-001"] [data-part="fresh"] i{width:.45rem;height:.45rem;border-radius:50%;background:var(--vibeui-bakery-001-accent)}
[data-vibeui-block="bakery-001"] [data-part="fresh"][data-cold="true"] i{background:#9aa0a6}
[data-vibeui-block="bakery-001"] [data-part="left"]{position:absolute;right:.6rem;bottom:.6rem;font-family:var(--vibeui-bakery-001-hand);font-size:1.15rem;color:#fff;text-shadow:0 1px 8px rgb(0 0 0 / .5);transform:rotate(-4deg)}
[data-vibeui-block="bakery-001"] [data-part="left"][data-few="true"]{color:#f2c94c}
[data-vibeui-block="bakery-001"] [data-part="name"]{display:flex;justify-content:space-between;align-items:baseline;gap:.6rem;margin:.9rem 0 .15rem;font-family:var(--vibeui-bakery-001-display);font-size:1rem;font-weight:600;letter-spacing:-.01em;line-height:1.15}
[data-vibeui-block="bakery-001"] [data-part="name"] b{font-weight:600;white-space:nowrap;font-variant-numeric:tabular-nums}
[data-vibeui-block="bakery-001"] [data-part="text"]{margin:0 0 .8rem;color:var(--vibeui-bakery-001-muted);font-size:.86rem}
[data-vibeui-block="bakery-001"] [data-part="add"]{margin-top:auto;display:inline-flex;align-items:center;justify-content:center;width:100%;border:0;border-radius:999px;padding:.7rem 1rem;font:inherit;font-weight:600;font-size:.86rem;cursor:pointer;color:var(--vibeui-bakery-001-on-accent);background:var(--vibeui-bakery-001-accent);box-shadow:0 1px 0 rgb(255 255 255 / .35) inset,0 10px 24px -12px color-mix(in oklab,var(--vibeui-bakery-001-accent) 70%,transparent);transition:transform .18s,filter .18s}
[data-vibeui-block="bakery-001"] [data-part="add"]:hover{transform:translateY(-1px);filter:brightness(1.05)}
[data-vibeui-block="bakery-001"] [data-part="add"]:active{transform:translateY(1px) scale(.985)}
[data-vibeui-block="bakery-001"] [data-part="add"][data-in="true"]{background:var(--vibeui-bakery-001-fg);color:var(--vibeui-bakery-001-bg);box-shadow:none}
[data-vibeui-block="bakery-001"] [data-part="add"]:disabled{opacity:.5;cursor:not-allowed;transform:none}
[data-vibeui-block="bakery-001"] [data-part="add"]:focus-visible{outline:2px solid var(--vibeui-bakery-001-accent);outline-offset:3px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="bakery-001"] *{transition:none!important}}`

const listeners = new Set<() => void>()
let timer: number | undefined

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (timer === undefined) timer = window.setInterval(() => listeners.forEach((fn) => fn()), 30000)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      window.clearInterval(timer)
      timer = undefined
    }
  }
}

function useMinutes(): number | null {
  const tick = useSyncExternalStore(subscribe, () => Math.floor(Date.now() / 30000), () => null)
  if (tick === null) return null
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

const toMinutes = (time: string) => {
  const [h, m = 0] = time.split(":").map(Number)
  return h * 60 + m
}

const DEFAULT_PRODUCTS: Bakery001Product[] = [
  { id: "tartine", name: "Тартин", text: "закваска, 36 часов, 700 г", price: "420 ₽", image: "/demo/bakery/item-01.webp", bakedAt: "08:30", left: 6 },
  { id: "croissant", name: "Круассан", text: "масло 82 %, 27 слоёв", price: "190 ₽", image: "/demo/bakery/item-02.webp", bakedAt: "07:00", left: 11 },
  { id: "cinnamon", name: "Булочка с корицей", text: "глазурь на сливках", price: "240 ₽", image: "/demo/bakery/item-03.webp", bakedAt: "11:00", left: 4 },
  { id: "focaccia", name: "Фокачча", text: "розмарин, морская соль", price: "210 ₽", image: "/demo/bakery/item-04.webp", bakedAt: "13:00", left: 9 },
  { id: "rye", name: "Ржаной", text: "тмин, тёмная корка, 800 г", price: "380 ₽", image: "/demo/bakery/item-05.webp", bakedAt: "15:00", left: 3 },
  { id: "cardamom", name: "Кардамоновый узел", text: "по-стокгольмски", price: "230 ₽", image: "/demo/bakery/item-06.webp", bakedAt: "11:00", left: 7 },
  { id: "baguette", name: "Багет", text: "тонкий, хрусткий, 280 г", price: "160 ₽", image: "/demo/bakery/item-07.webp", bakedAt: "17:00", left: 12 },
  { id: "chocolat", name: "Пан-о-шоколя", text: "две палочки тёмного", price: "210 ₽", image: "/demo/bakery/item-08.webp", bakedAt: "07:00", left: 5 },
]

/** Полка выпечки: тянется мышью, знает время выпечки и остаток. */
export function Bakery001({
  eyebrow = "Витрина",
  title = "Что на полке сейчас",
  lede = "Каждая карточка знает, когда её испекли и сколько осталось. Кладите в коробку — соберём к утру.",
  hint = "тяните полку",
  products = DEFAULT_PRODUCTS,
  addLabel = "в коробку",
  inBoxLabel = "в коробке",
  fullLabel = "коробка полна",
  boxSize = 4,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Bakery001Props) {
  const minutes = useMinutes()
  const track = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)
  const [dragging, setDragging] = useState(false)
  const [inBox, setInBox] = useState<string[]>([])
  const m = minutes ?? 9 * 60

  useEffect(() => {
    const onState = (event: Event) => {
      const detail = (event as CustomEvent<{ ids?: string[] }>).detail
      if (Array.isArray(detail?.ids)) setInBox(detail.ids)
    }
    window.addEventListener("vibeui-box:state", onState)
    return () => window.removeEventListener("vibeui-box:state", onState)
  }, [])

  const add = (product: Bakery001Product) => {
    if (inBox.length >= boxSize) return
    setInBox((current) => [...current, product.id])
    window.dispatchEvent(new CustomEvent("vibeui-box:add", { detail: product }))
  }

  const onDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!track.current || event.pointerType === "touch") return
    // Без setPointerCapture: с захватом клик уходил бы в ленту, а не в кнопку.
    drag.current = { x: event.clientX, left: track.current.scrollLeft, moved: false }
  }
  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const element = track.current
    if (!element || !drag.current) return
    const dx = event.clientX - drag.current.x
    if (Math.abs(dx) > 4 && !drag.current.moved) {
      drag.current.moved = true
      setDragging(true)
    }
    if (drag.current.moved) element.scrollLeft = drag.current.left - dx
  }
  const onUp = () => {
    drag.current = null
    setDragging(false)
  }

  const palette = {
    ...(accent ? { "--vibeui-bakery-001-accent": accent } : null),
    ...(ink ? { "--vibeui-bakery-001-fg": ink } : null),
    ...(background ? { "--vibeui-bakery-001-bg": background } : null),
    ...style,
  } as CSSProperties
  const full = inBox.length >= boxSize

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-bakery-001" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="bakery-001" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
            </div>
            {hint ? (
              <div data-part="hint" aria-hidden="true">
                <svg viewBox="0 0 60 30">
                  <path d="M4 15 C 20 4, 40 26, 56 15 M 44 8 L 56 15 L 44 22" />
                </svg>
                {hint}
              </div>
            ) : null}
          </div>
        </div>
        <div data-part="rail">
          <div
            ref={track}
            data-part="track"
            data-dragging={dragging}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onPointerLeave={onUp}
            onClickCapture={(event) => {
              // Перетаскивание не должно превращаться в клик по кнопке.
              if (dragging) event.stopPropagation()
            }}
          >
            {products.map((product) => {
              const baked = product.bakedAt ? toMinutes(product.bakedAt) : null
              const cold = baked !== null && (m - baked > 180 || m < baked)
              const count = inBox.filter((id) => id === product.id).length
              return (
                <article key={product.id} data-part="item">
                  <div data-part="pic">
                    {product.image ? <img src={product.image} alt={product.name} draggable={false} /> : null}
                    {baked !== null ? (
                      <span data-part="fresh" data-cold={cold}>
                        <i aria-hidden="true" />
                        {m < baked ? `будет в ${product.bakedAt}` : `испечено в ${product.bakedAt}`}
                      </span>
                    ) : null}
                    {product.left !== undefined ? (
                      <span data-part="left" data-few={product.left <= 4}>
                        {product.left <= 4 ? `последние ${product.left}` : `осталось ${product.left}`}
                      </span>
                    ) : null}
                  </div>
                  <h3 data-part="name">
                    {product.name} <b>{product.price}</b>
                  </h3>
                  {product.text ? <p data-part="text">{product.text}</p> : null}
                  <button type="button" data-part="add" data-in={count > 0} disabled={full && count === 0} onClick={() => add(product)}>
                    {count > 0 ? `${inBoxLabel} · ${count} шт` : full ? fullLabel : addLabel}
                  </button>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

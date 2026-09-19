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
  /** Подпись у мини-коробки в шапке: «в коробке». */
  boxLabel?: string
  boxHref?: string
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
// (drag-to-scroll) или пальцем. Пока лента едет, карточки наклоняются по
// направлению движения, а фото внутри отстаёт — лёгкий параллакс, как будто
// полка настоящая. Карточки «стоят» на деревянной полке, у каждой — время
// выхода из печи и остаток («последние 4» — рукописно). По кнопке «в коробку»
// фото товара прыгает по дуге в мини-коробку в шапке секции, а на window
// уходит событие `vibeui-box:add` — блок коробки (bakery-003) его ловит;
// обратно приходит `vibeui-box:state`, и кнопка показывает «в коробке · 2 шт».
// Без блока коробки кнопка просто считает сама. Заголовок и карточки
// появляются каскадом, когда секция попадает в кадр.
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
--vibeui-bakery-001-ease:cubic-bezier(.2,.8,.2,1);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="bakery-001"]{color-scheme:dark}
:where([data-vibeui-block="bakery-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="bakery-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="bakery-001"]{box-sizing:border-box;position:relative;overflow:clip;padding:5.5rem 0;background:var(--vibeui-bakery-001-panel);color:var(--vibeui-bakery-001-fg);font-family:var(--vibeui-bakery-001-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="bakery-001"] *{box-sizing:border-box}
[data-vibeui-block="bakery-001"] [data-part="glow"]{position:absolute;left:50%;top:40%;width:60rem;height:30rem;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(closest-side,color-mix(in oklab,var(--vibeui-bakery-001-accent) 14%,transparent),transparent 70%);filter:blur(40px);pointer-events:none}
[data-vibeui-block="bakery-001"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="bakery-001"] [data-part="head"]{display:flex;align-items:flex-end;justify-content:space-between;gap:2rem;flex-wrap:wrap;margin-bottom:2.5rem}
[data-vibeui-block="bakery-001"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.5rem;font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--vibeui-bakery-001-accent);font-weight:600;margin:0 0 1.1rem}
[data-vibeui-block="bakery-001"] [data-part="eyebrow"]::before{content:"";width:1.4rem;height:2px;background:var(--vibeui-bakery-001-accent);border-radius:2px}
[data-vibeui-block="bakery-001"] [data-part="title"]{margin:0;font-family:var(--vibeui-bakery-001-display);font-weight:600;letter-spacing:-.025em;line-height:1.02;font-size:clamp(2.2rem,5cqi,4rem)}
[data-vibeui-block="bakery-001"] [data-part="word"]{display:inline-block;overflow:clip;vertical-align:top;padding:.04em .06em .14em 0;margin:-.04em 0 -.14em}
[data-vibeui-block="bakery-001"] [data-part="word"] i{display:inline-block;font-style:normal;transform:translateY(112%)}
[data-vibeui-block="bakery-001"][data-shown="true"] [data-part="word"] i{animation:vibeui-bakery-001-rise .9s var(--vibeui-bakery-001-ease) both;animation-delay:calc(var(--vibeui-bakery-001-n) * .09s)}
[data-vibeui-block="bakery-001"] [data-part="lede"]{font-size:1.06rem;color:var(--vibeui-bakery-001-muted);max-width:34rem;margin:1rem 0 0}
[data-vibeui-block="bakery-001"] [data-part="lede"],[data-vibeui-block="bakery-001"] [data-part="aside"]{opacity:0;translate:0 1rem}
[data-vibeui-block="bakery-001"][data-shown="true"] [data-part="lede"],[data-vibeui-block="bakery-001"][data-shown="true"] [data-part="aside"]{animation:vibeui-bakery-001-in .8s var(--vibeui-bakery-001-ease) .3s both}
[data-vibeui-block="bakery-001"] [data-part="aside"]{display:flex;align-items:center;gap:1.25rem;flex-wrap:wrap}
[data-vibeui-block="bakery-001"] [data-part="hint"]{display:inline-flex;align-items:center;gap:.5rem;color:var(--vibeui-bakery-001-muted);font-size:.9rem}
[data-vibeui-block="bakery-001"] [data-part="hint"] svg{width:2.2rem;height:1.2rem;stroke:var(--vibeui-bakery-001-accent);fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;animation:vibeui-bakery-001-nudge 2.4s ease-in-out infinite}
[data-vibeui-block="bakery-001"] [data-part="box"]{display:inline-flex;align-items:center;gap:.6rem;padding:.55rem .9rem .55rem .7rem;border-radius:999px;background:var(--vibeui-bakery-001-card);color:inherit;text-decoration:none;font-size:.86rem;font-weight:600;box-shadow:0 1px 0 rgb(255 255 255 / .5) inset,0 12px 24px -16px rgb(0 0 0 / .5),0 0 0 1px color-mix(in oklab,var(--vibeui-bakery-001-fg) 8%,transparent);transition:transform .3s var(--vibeui-bakery-001-ease),box-shadow .3s}
[data-vibeui-block="bakery-001"] [data-part="box"]:hover{transform:translateY(-2px);box-shadow:0 1px 0 rgb(255 255 255 / .5) inset,0 16px 28px -16px rgb(0 0 0 / .5),0 0 0 1px color-mix(in oklab,var(--vibeui-bakery-001-accent) 40%,transparent)}
[data-vibeui-block="bakery-001"] [data-part="box"] svg{width:1.7rem;height:1.5rem;fill:none;stroke:var(--vibeui-bakery-001-accent);stroke-width:1.8;stroke-linejoin:round;stroke-linecap:round}
[data-vibeui-block="bakery-001"] [data-part="box"] b{font-family:var(--vibeui-bakery-001-display);font-size:1.1rem;font-weight:700;font-variant-numeric:tabular-nums;color:var(--vibeui-bakery-001-accent)}
[data-vibeui-block="bakery-001"] [data-part="box"] span{color:var(--vibeui-bakery-001-muted);font-weight:500}
[data-vibeui-block="bakery-001"] [data-part="box"][data-count="0"] b{color:var(--vibeui-bakery-001-muted)}
[data-vibeui-block="bakery-001"] [data-part="rail"]{position:relative}
[data-vibeui-block="bakery-001"] [data-part="rail"]::before{content:"";position:absolute;left:0;right:0;bottom:2.2rem;height:1.4rem;background:linear-gradient(180deg,color-mix(in oklab,var(--vibeui-bakery-001-wood) 70%,white),var(--vibeui-bakery-001-wood) 70%,color-mix(in oklab,var(--vibeui-bakery-001-wood) 80%,black));border-radius:3px;box-shadow:0 16px 28px -12px rgb(0 0 0 / .45),0 1px 0 rgb(255 255 255 / .5) inset}
[data-vibeui-block="bakery-001"] [data-part="rail"]::after{content:"";position:absolute;left:0;right:0;bottom:2.1rem;height:.3rem;background:rgb(0 0 0 / .12);filter:blur(4px)}
[data-vibeui-block="bakery-001"] [data-part="track"]{display:flex;gap:1.25rem;perspective:70rem;overflow-x:auto;scroll-snap-type:x proximity;padding:1rem max(1.25rem,calc((100cqi - 80rem) / 2 + 1.25rem)) 3.4rem;scroll-padding-inline:max(1.25rem,calc((100cqi - 80rem) / 2 + 1.25rem));scrollbar-width:none;cursor:grab;user-select:none;-webkit-user-select:none}
[data-vibeui-block="bakery-001"] [data-part="track"]::-webkit-scrollbar{display:none}
[data-vibeui-block="bakery-001"] [data-part="track"][data-dragging="true"]{cursor:grabbing;scroll-snap-type:none}
[data-vibeui-block="bakery-001"] [data-part="item"]{position:relative;display:flex;flex-direction:column;flex:0 0 16.5rem;scroll-snap-align:start;padding:.9rem .9rem 1.1rem;border-radius:1.4rem;background:var(--vibeui-bakery-001-card);box-shadow:0 1px 0 rgb(255 255 255 / .5) inset,0 24px 48px -32px rgb(0 0 0 / .35),0 1px 2px rgb(0 0 0 / .06);transform:rotateY(calc(var(--vibeui-bakery-001-v,0) * -14deg)) translateX(calc(var(--vibeui-bakery-001-v,0) * -.5rem));transition:transform .5s var(--vibeui-bakery-001-ease),box-shadow .5s;opacity:0;translate:0 2rem}
[data-vibeui-block="bakery-001"][data-shown="true"] [data-part="item"]{animation:vibeui-bakery-001-in .9s var(--vibeui-bakery-001-ease) both;animation-delay:calc(.15s + var(--vibeui-bakery-001-i) * .08s)}
[data-vibeui-block="bakery-001"] [data-part="item"]:hover{transform:rotateY(calc(var(--vibeui-bakery-001-v,0) * -14deg)) translateY(-.6rem);box-shadow:0 1px 0 rgb(255 255 255 / .5) inset,0 34px 56px -30px color-mix(in oklab,var(--vibeui-bakery-001-accent) 30%,rgb(0 0 0 / .45)),0 1px 2px rgb(0 0 0 / .06)}
[data-vibeui-block="bakery-001"] [data-part="pic"]{position:relative;aspect-ratio:1;border-radius:1rem;overflow:hidden;background:var(--vibeui-bakery-001-panel)}
[data-vibeui-block="bakery-001"] [data-part="pic"] img{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;transform:translateX(calc(var(--vibeui-bakery-001-v,0) * 7%)) scale(1.14);transition:transform .55s var(--vibeui-bakery-001-ease)}
[data-vibeui-block="bakery-001"] [data-part="item"]:hover [data-part="pic"] img{transform:translateX(calc(var(--vibeui-bakery-001-v,0) * 7%)) scale(1.2)}
[data-vibeui-block="bakery-001"] [data-part="fresh"]{position:absolute;left:.6rem;top:.6rem;display:inline-flex;align-items:center;gap:.35rem;padding:.3rem .6rem;border-radius:999px;background:rgb(255 255 255 / .85);backdrop-filter:blur(6px);font-size:.72rem;font-weight:600;color:#1a1a1a;font-variant-numeric:tabular-nums}
[data-vibeui-block="bakery-001"] [data-part="fresh"] i{width:.45rem;height:.45rem;border-radius:50%;background:var(--vibeui-bakery-001-accent)}
[data-vibeui-block="bakery-001"] [data-part="fresh"][data-cold="true"] i{background:#9aa0a6}
[data-vibeui-block="bakery-001"] [data-part="left"]{position:absolute;right:.6rem;bottom:.6rem;font-family:var(--vibeui-bakery-001-hand);font-size:1.15rem;color:#fff;text-shadow:0 1px 8px rgb(0 0 0 / .5);transform:rotate(-4deg)}
[data-vibeui-block="bakery-001"] [data-part="left"][data-few="true"]{color:#f2c94c}
[data-vibeui-block="bakery-001"] [data-part="name"]{display:flex;justify-content:space-between;align-items:baseline;gap:.6rem;margin:.9rem 0 .15rem;font-family:var(--vibeui-bakery-001-display);font-size:1rem;font-weight:600;letter-spacing:-.01em;line-height:1.15}
[data-vibeui-block="bakery-001"] [data-part="name"] b{font-weight:600;white-space:nowrap;font-variant-numeric:tabular-nums}
[data-vibeui-block="bakery-001"] [data-part="text"]{margin:0 0 .8rem;color:var(--vibeui-bakery-001-muted);font-size:.86rem}
[data-vibeui-block="bakery-001"] [data-part="add"]{margin-top:auto;display:inline-flex;align-items:center;justify-content:center;width:100%;border:0;border-radius:999px;padding:.7rem 1rem;font:inherit;font-weight:600;font-size:.86rem;cursor:pointer;color:var(--vibeui-bakery-001-on-accent);background:var(--vibeui-bakery-001-accent);box-shadow:0 1px 0 rgb(255 255 255 / .35) inset,0 10px 24px -12px color-mix(in oklab,var(--vibeui-bakery-001-accent) 70%,transparent);transition:transform .25s var(--vibeui-bakery-001-ease),filter .18s,background .3s,color .3s}
[data-vibeui-block="bakery-001"] [data-part="add"]:hover{transform:translateY(-2px);filter:brightness(1.05)}
[data-vibeui-block="bakery-001"] [data-part="add"]:active{transform:translateY(1px) scale(.97)}
[data-vibeui-block="bakery-001"] [data-part="add"][data-in="true"]{background:var(--vibeui-bakery-001-fg);color:var(--vibeui-bakery-001-bg);box-shadow:none}
[data-vibeui-block="bakery-001"] [data-part="add"]:disabled{opacity:.5;cursor:not-allowed;transform:none}
[data-vibeui-block="bakery-001"] [data-part="add"]:focus-visible,[data-vibeui-block="bakery-001"] [data-part="box"]:focus-visible{outline:2px solid var(--vibeui-bakery-001-accent);outline-offset:3px}
@keyframes vibeui-bakery-001-rise{0%{transform:translateY(112%) scaleY(.8)}70%{transform:translateY(-2%)}100%{transform:none}}
@keyframes vibeui-bakery-001-in{from{opacity:0;translate:0 2rem}to{opacity:1;translate:0 0}}
@keyframes vibeui-bakery-001-nudge{0%,100%{transform:translateX(0)}50%{transform:translateX(.35rem)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="bakery-001"] *{animation:none!important;transition:none!important}[data-vibeui-block="bakery-001"] [data-part="word"] i{transform:none}[data-vibeui-block="bakery-001"] [data-part="item"],[data-vibeui-block="bakery-001"] [data-part="lede"],[data-vibeui-block="bakery-001"] [data-part="aside"]{opacity:1;translate:none}}`

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

// Фото товара летит по дуге в мини-коробку: клон фиксированной позиции
// поверх страницы, две фазы — вверх с замедлением, вниз с ускорением.
function fly(from: HTMLElement | null, to: HTMLElement | null, image: string | undefined) {
  if (!from || !to || !image || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  const a = from.getBoundingClientRect()
  const b = to.getBoundingClientRect()
  const ghost = document.createElement("div")
  ghost.setAttribute("aria-hidden", "true")
  ghost.style.cssText = `position:fixed;left:${a.left}px;top:${a.top}px;width:${a.width}px;height:${a.height}px;border-radius:1rem;z-index:9999;pointer-events:none;box-shadow:0 24px 48px -20px rgb(0 0 0 / .55);background:url("${image}") center/cover;will-change:transform`
  document.body.appendChild(ghost)
  const dx = b.left + b.width / 2 - (a.left + a.width / 2)
  const dy = b.top + b.height / 2 - (a.top + a.height / 2)
  const scale = Math.max(0.1, (b.height * 0.9) / a.height)
  const animation = ghost.animate(
    [
      { transform: "translate(0,0) scale(1) rotate(0deg)", opacity: 1, easing: "cubic-bezier(.2,.8,.3,1)" },
      { transform: `translate(${dx * 0.45}px,${Math.min(dy, 0) - 140}px) scale(.55) rotate(-10deg)`, opacity: 1, offset: 0.5, easing: "cubic-bezier(.6,0,.8,.4)" },
      { transform: `translate(${dx}px,${dy}px) scale(${scale}) rotate(4deg)`, opacity: 0.85 },
    ],
    { duration: 820, fill: "forwards" },
  )
  animation.onfinish = () => {
    ghost.remove()
    to.animate([{ transform: "scale(1)" }, { transform: "scale(1.16) rotate(-3deg)" }, { transform: "scale(1)" }], { duration: 380, easing: "cubic-bezier(.2,1.4,.4,1)" })
  }
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
  boxLabel = "в коробке",
  boxHref = "#box",
  boxSize = 4,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Bakery001Props) {
  const minutes = useMinutes()
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const box = useRef<HTMLAnchorElement>(null)
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)
  const velocity = useRef<{ last: number; raf: number; timer: number }>({ last: 0, raf: 0, timer: 0 })
  const [dragging, setDragging] = useState(false)
  const [shown, setShown] = useState(false)
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

  useEffect(() => {
    const element = root.current
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: "-10% 0px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const add = (product: Bakery001Product, from: HTMLElement | null) => {
    if (inBox.length >= boxSize) return
    setInBox((current) => [...current, product.id])
    fly(from, box.current, product.image)
    window.dispatchEvent(new CustomEvent("vibeui-box:add", { detail: product }))
  }

  // Скорость ленты → CSS-переменная: карточки наклоняются, фото отстаёт; через 90 мс покоя — обратно в ноль.
  const onScroll = () => {
    const element = track.current
    const state = velocity.current
    if (!element || state.raf) return
    state.raf = window.requestAnimationFrame(() => {
      state.raf = 0
      const delta = element.scrollLeft - state.last
      state.last = element.scrollLeft
      element.style.setProperty("--vibeui-bakery-001-v", Math.max(-1, Math.min(1, delta / 36)).toFixed(3))
      window.clearTimeout(state.timer)
      state.timer = window.setTimeout(() => element.style.setProperty("--vibeui-bakery-001-v", "0"), 90)
    })
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
      <section ref={root} data-vibeui-block="bakery-001" data-tone={tone === "auto" ? undefined : tone} data-shown={shown} className={className} style={palette}>
        <div data-part="glow" aria-hidden="true" />
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">
                {title.split(" ").map((word, index, all) => (
                  <span key={`${word}-${index}`}>
                    <span data-part="word" style={{ ["--vibeui-bakery-001-n" as string]: index }}>
                      <i>{word}</i>
                    </span>
                    {index < all.length - 1 ? " " : ""}
                  </span>
                ))}
              </h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
            </div>
            <div data-part="aside">
              {hint ? (
                <div data-part="hint" aria-hidden="true">
                  <svg viewBox="0 0 60 30">
                    <path d="M4 15 C 20 4, 40 26, 56 15 M 44 8 L 56 15 L 44 22" />
                  </svg>
                  {hint}
                </div>
              ) : null}
              <a ref={box} data-part="box" data-count={inBox.length} href={boxHref} aria-label={`${boxLabel}: ${inBox.length} из ${boxSize}`}>
                <svg viewBox="0 0 34 30" aria-hidden="true">
                  <path d="M3 11 L17 4 L31 11 L31 26 L3 26 Z M3 11 L17 18 L31 11 M17 18 L17 26" />
                </svg>
                <b>{inBox.length}</b>
                <span>
                  / {boxSize} · {boxLabel}
                </span>
              </a>
            </div>
          </div>
        </div>
        <div data-part="rail">
          <div
            ref={track}
            data-part="track"
            data-dragging={dragging}
            onScroll={onScroll}
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
            {products.map((product, index) => {
              const baked = product.bakedAt ? toMinutes(product.bakedAt) : null
              const cold = baked !== null && (m - baked > 180 || m < baked)
              const count = inBox.filter((id) => id === product.id).length
              return (
                <article key={product.id} data-part="item" style={{ ["--vibeui-bakery-001-i" as string]: index }}>
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
                  <button
                    type="button"
                    data-part="add"
                    data-in={count > 0}
                    disabled={full && count === 0}
                    onClick={(event) => add(product, event.currentTarget.closest("[data-part='item']")?.querySelector<HTMLElement>("[data-part='pic']") ?? null)}
                  >
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

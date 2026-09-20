"use client"

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react"
import { createPortal } from "react-dom"

export type Realty003Listing = {
  title: string
  /** Цена как строка: «12 400 000 ₽» или «85 000 ₽/мес». */
  price: string
  /** Тип — по нему фильтруют чипы. */
  kind: string
  area: string
  rooms: string
  floor?: string
  district: string
  metro?: string
  /** Метка: «новостройка», «срочно», «эксклюзив». */
  badge?: string
  image?: string
  /** Второе фото — показывается по наведению. */
  imageHover?: string
  href?: string
  /** Обратная сторона: описание и список плюсов. */
  text?: string
  features?: readonly string[]
}

export type Realty003Props = {
  eyebrow?: string
  title?: string
  lede?: string
  listings?: readonly Realty003Listing[]
  allLabel?: string
  moreLabel?: string
  moreHref?: string
  /** Подсказка в углу фото. Пусто — без подсказки. */
  flipHint?: string
  /** Ссылка в окне. */
  openLabel?: string
  closeLabel?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  /** Строка этажа, aria фильтра, пустое состояние. */
  floorLabel?: string
  chipsLabel?: string
  emptyLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подборка объектов: чипы типов фильтруют карточки без перезагрузки.
// Карточка — фото с подменой на второе по наведению, цена серифом крупно,
// метры и комнаты в одну строку, район и метро внизу. По клику копия
// карточки в портале едет в центр экрана, растёт в 1,35 раза и
// переворачивается одним движением — анимируется только transform
// (translate, scale, rotateY), поэтому не тормозит с большими фото. На
// обороте второе фото во весь кадр и стеклянная панель с описанием,
// плюсами и ссылкой; клик по окну переворачивает его обратно. Закрытие —
// тот же transform назад; фокус заперт, Escape закрывает. Карточки
// появляются с каскадной задержкой, по фильтру — заново.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="realty-003"]){
--vibeui-realty-003-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-realty-003-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-realty-003-muted:color-mix(in oklab,var(--vibeui-realty-003-fg) 62%,var(--vibeui-realty-003-bg));
--vibeui-realty-003-card:light-dark(#fffdf9,#242424);
--vibeui-realty-003-line:color-mix(in oklab,var(--vibeui-realty-003-fg) 14%,var(--vibeui-realty-003-bg));
--vibeui-realty-003-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-realty-003-on-accent:oklch(from var(--vibeui-realty-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-realty-003-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-realty-003-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="realty-003"]{color-scheme:dark}
:where([data-vibeui-block="realty-003"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="realty-003"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="realty-003"]{box-sizing:border-box;display:block;background:var(--vibeui-realty-003-bg);color:var(--vibeui-realty-003-fg);font-family:var(--vibeui-realty-003-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="realty-003"] *{box-sizing:border-box}
[data-vibeui-block="realty-003"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="realty-003"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:1rem 2rem;margin-bottom:2rem}
[data-vibeui-block="realty-003"] [data-part="eyebrow"]{margin:0 0 .5rem;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-realty-003-accent);font-weight:600}
[data-vibeui-block="realty-003"] [data-part="title"]{margin:0;font-family:var(--vibeui-realty-003-display);font-weight:500;font-size:clamp(2rem,4.5cqi,3.25rem);line-height:1.05;letter-spacing:-.01em}
[data-vibeui-block="realty-003"] [data-part="lede"]{margin:.75rem 0 0;max-width:36rem;color:var(--vibeui-realty-003-muted)}
[data-vibeui-block="realty-003"] [data-part="chips"]{display:flex;flex-wrap:wrap;gap:.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="realty-003"] [data-part="chip"]{appearance:none;border:1px solid var(--vibeui-realty-003-line);border-radius:999px;background:transparent;padding:.5rem 1rem;font:inherit;font-size:.85rem;font-weight:600;color:var(--vibeui-realty-003-fg);cursor:pointer;transition:background .2s,color .2s,border-color .2s}
[data-vibeui-block="realty-003"] [data-part="chip"]:hover{border-color:var(--vibeui-realty-003-accent)}
[data-vibeui-block="realty-003"] [data-part="chip"][aria-pressed="true"]{background:var(--vibeui-realty-003-fg);color:var(--vibeui-realty-003-bg);border-color:var(--vibeui-realty-003-fg)}
[data-vibeui-block="realty-003"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-realty-003-accent);outline-offset:2px}
[data-vibeui-block="realty-003"] [data-part="grid"]{display:grid;gap:1.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="realty-003"] [data-part="grid"] > li{animation:vibeui-realty-003-in .6s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-realty-003-n) * 70ms)}
@keyframes vibeui-realty-003-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
[data-vibeui-block="realty-003"] [data-part="card"]{position:relative;display:flex;flex-direction:column;height:100%;overflow:hidden;border-radius:1rem;background:var(--vibeui-realty-003-card);border:1px solid var(--vibeui-realty-003-line);cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s}
[data-vibeui-block="realty-003"] [data-part="card"]:hover{transform:translateY(-4px);box-shadow:0 30px 40px -28px rgb(20 33 27 / .5)}
[data-vibeui-block="realty-003"] [data-part="card"]:focus-visible{outline:2px solid var(--vibeui-realty-003-accent);outline-offset:3px}
[data-vibeui-block="realty-003"] [data-part="card"][data-hidden="true"]{visibility:hidden}
[data-vibeui-block="realty-003"] [data-part="media"]{position:relative;aspect-ratio:3/2;overflow:hidden;background:light-dark(#e7dfd2,#2a2a2a)}
[data-vibeui-block="realty-003"] [data-part="media"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity .6s ease,transform 1.2s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="realty-003"] [data-part="media"] img[data-hover]{opacity:0}
[data-vibeui-block="realty-003"] [data-part="card"]:hover [data-part="media"] img{transform:scale(1.05)}
[data-vibeui-block="realty-003"] [data-part="card"]:hover [data-part="media"] img[data-hover]{opacity:1}
[data-vibeui-block="realty-003"] [data-part="hint"]{position:absolute;right:.75rem;bottom:.75rem;display:inline-flex;align-items:center;gap:.4rem;padding:.3rem .65rem;border-radius:999px;background:rgb(255 253 249 / .88);color:var(--vibeui-realty-003-fg);font-size:.68rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;backdrop-filter:blur(6px)}
[data-vibeui-block="realty-003"] [data-part="hint"]::before{content:"";width:.65rem;height:.65rem;border-radius:50%;border:2px solid currentColor;border-right-color:transparent;transform:rotate(-30deg)}
[data-vibeui-block="realty-003"][data-part="layer"]{position:fixed;inset:0;z-index:60;perspective:1400px;font-family:var(--vibeui-realty-003-font);font-size:.9375rem;line-height:1.5;color:var(--vibeui-realty-003-fg)}
[data-vibeui-block="realty-003"] [data-part="backdrop"]{position:absolute;inset:0;background:light-dark(rgb(243 237 227 / .72),rgb(20 33 27 / .72));backdrop-filter:blur(12px) saturate(1.4);-webkit-backdrop-filter:blur(12px) saturate(1.4);opacity:0;transition:opacity .35s ease}
[data-vibeui-block="realty-003"][data-phase="open"] [data-part="backdrop"]{opacity:1}
[data-vibeui-block="realty-003"] [data-part="flyer"]{position:absolute;transform-style:preserve-3d;transform-origin:center;will-change:transform;transition:transform .5s cubic-bezier(.2,.9,.25,1)}
[data-vibeui-block="realty-003"] [data-part="side"]{position:absolute;inset:0;display:flex;flex-direction:column;overflow:hidden;border-radius:1rem;border:1px solid var(--vibeui-realty-003-line);background:var(--vibeui-realty-003-card);backface-visibility:hidden;-webkit-backface-visibility:hidden;transform:translateZ(1px);cursor:pointer;box-shadow:0 24px 48px -24px rgb(0 0 0 / .45)}
[data-vibeui-block="realty-003"] [data-part="side"][data-side="front"] [data-part="media"]{flex:none}
[data-vibeui-block="realty-003"] [data-part="side"][data-side="back"]{transform:rotateY(180deg) translateZ(1px)}
[data-vibeui-block="realty-003"] [data-part="photo"]{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="realty-003"] [data-part="panel"]{position:absolute;left:1rem;right:1rem;bottom:1rem;display:grid;gap:.4rem;padding:1.25rem;border-radius:1rem;border:1px solid var(--vibeui-realty-003-line);background:light-dark(rgb(255 253 249 / .8),rgb(20 33 27 / .72));color:var(--vibeui-realty-003-fg);backdrop-filter:blur(16px) saturate(1.5);-webkit-backdrop-filter:blur(16px) saturate(1.5);cursor:default}
[data-vibeui-block="realty-003"] [data-part="back-price"]{font-family:var(--vibeui-realty-003-display);font-size:1.75rem;font-weight:600;line-height:1;color:var(--vibeui-realty-003-accent)}
[data-vibeui-block="realty-003"] [data-part="back-name"]{margin:0;font-family:var(--vibeui-realty-003-display);font-size:1.35rem;font-weight:600;line-height:1.15}
[data-vibeui-block="realty-003"] [data-part="text"]{margin:0;opacity:.85;font-size:.85rem}
[data-vibeui-block="realty-003"] [data-part="features"]{margin:.25rem 0 0;padding:0;list-style:none;display:grid;gap:.2rem;font-size:.8rem}
[data-vibeui-block="realty-003"] [data-part="features"] li{display:flex;gap:.55rem;align-items:flex-start}
[data-vibeui-block="realty-003"] [data-part="features"] li::before{content:"";flex:none;width:.4rem;height:.4rem;margin-top:.5rem;border-radius:50%;background:var(--vibeui-realty-003-accent)}
[data-vibeui-block="realty-003"] [data-part="open"]{display:inline-flex;align-items:center;gap:.5rem;justify-self:start;margin-top:.6rem;padding:.65rem 1.1rem;border-radius:999px;background:var(--vibeui-realty-003-accent);color:var(--vibeui-realty-003-on-accent);font-weight:700;font-size:.85rem;text-decoration:none;transition:transform .2s}
[data-vibeui-block="realty-003"] [data-part="open"]:hover{transform:translateY(-1px)}
[data-vibeui-block="realty-003"] [data-part="open"]:focus-visible{outline:2px solid var(--vibeui-realty-003-fg);outline-offset:2px}
[data-vibeui-block="realty-003"] [data-part="close"]{position:absolute;top:1rem;right:1rem;width:2.5rem;height:2.5rem;display:grid;place-items:center;border-radius:50%;border:1px solid var(--vibeui-realty-003-line);background:light-dark(rgb(255 253 249 / .8),rgb(20 33 27 / .72));color:var(--vibeui-realty-003-fg);cursor:pointer;z-index:3;backdrop-filter:blur(16px) saturate(1.5);-webkit-backdrop-filter:blur(16px) saturate(1.5);font:inherit;transition:background .2s}
[data-vibeui-block="realty-003"] [data-part="close"]:hover{background:var(--vibeui-realty-003-card)}
[data-vibeui-block="realty-003"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-realty-003-accent);outline-offset:2px}
[data-vibeui-block="realty-003"] [data-part="badge"]{position:absolute;top:.75rem;left:.75rem;padding:.3rem .65rem;border-radius:999px;background:var(--vibeui-realty-003-accent);color:var(--vibeui-realty-003-on-accent);font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
[data-vibeui-block="realty-003"] [data-part="body"]{display:grid;gap:.35rem;padding:1rem 1.1rem 1.15rem}
[data-vibeui-block="realty-003"] [data-part="price"]{font-family:var(--vibeui-realty-003-display);font-size:1.75rem;font-weight:600;line-height:1;letter-spacing:.01em}
[data-vibeui-block="realty-003"] [data-part="name"]{font-weight:600}
[data-vibeui-block="realty-003"] [data-part="meta"]{display:flex;flex-wrap:wrap;gap:.25rem .75rem;color:var(--vibeui-realty-003-muted);font-size:.85rem}
[data-vibeui-block="realty-003"] [data-part="place"]{margin-top:.35rem;padding-top:.6rem;border-top:1px solid var(--vibeui-realty-003-line);display:flex;justify-content:space-between;gap:.5rem;font-size:.8rem;color:var(--vibeui-realty-003-muted)}
[data-vibeui-block="realty-003"] [data-part="more"]{display:inline-flex;align-items:center;gap:.5rem;margin-top:2rem;color:inherit;font-weight:600;text-decoration:none;border-bottom:1px solid var(--vibeui-realty-003-accent);padding-bottom:.15rem}
[data-vibeui-block="realty-003"] [data-part="empty"]{margin:2rem 0;color:var(--vibeui-realty-003-muted)}
@container (min-width: 40rem){[data-vibeui-block="realty-003"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 64rem){[data-vibeui-block="realty-003"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}[data-vibeui-block="realty-003"] [data-part="shell"]{padding:5.5rem 2rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="realty-003"] *{animation:none!important;transition:none!important}}`

type Box = { top: number; left: number; width: number; height: number }

const DURATION = 500
const ZOOM = 1.35
const FOCUSABLE = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])'

/** Окно — карточка ×ZOOM, по центру, но не больше экрана с отступом. */
function targetBox(from: Box): Box {
  const gutter = Math.min(window.innerWidth * 0.06, 32)
  const scale = Math.min(ZOOM, (window.innerWidth - gutter * 2) / from.width, (window.innerHeight - gutter * 2) / from.height)
  const width = from.width * scale
  const height = from.height * scale
  return { top: (window.innerHeight - height) / 2, left: (window.innerWidth - width) / 2, width, height }
}

/** Transform, ставящий летуна размера to ровно на место from. */
function offsetTransform(from: Box, to: Box): string {
  const dx = from.left + from.width / 2 - (to.left + to.width / 2)
  const dy = from.top + from.height / 2 - (to.top + to.height / 2)
  return `translate(${dx}px, ${dy}px) scale(${from.width / to.width}) rotateY(0deg)`
}

function rectOf(element: HTMLElement): Box {
  const rect = element.getBoundingClientRect()
  return { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
}

function Front({ item, hint, floorLabel }: { item: Realty003Listing; hint: string; floorLabel: string }) {
  return (
    <>
      <span data-part="media">
        {item.image ? <img src={item.image} alt="" loading="lazy" /> : null}
        {item.imageHover ? <img src={item.imageHover} alt="" loading="lazy" data-hover="" /> : null}
        {item.badge ? <span data-part="badge">{item.badge}</span> : null}
        {hint ? <span data-part="hint">{hint}</span> : null}
      </span>
      <span data-part="body">
        <span data-part="price">{item.price}</span>
        <span data-part="name">{item.title}</span>
        <span data-part="meta">
          <span>{item.area}</span>
          <span>{item.rooms}</span>
          {item.floor ? <span>{floorLabel.replace("{n}", item.floor)}</span> : null}
        </span>
        <span data-part="place">
          <span>{item.district}</span>
          {item.metro ? <span>{item.metro}</span> : null}
        </span>
      </span>
    </>
  )
}

const DEFAULT_LISTINGS: Realty003Listing[] = [
  { title: "Двушка с зелёной кухней на Петроградской", price: "18 900 000 ₽", kind: "Квартиры", area: "64 м²", rooms: "2 комнаты", floor: "4 из 6", district: "Петроградская", metro: "Чкаловская, 7 мин", badge: "эксклюзив", text: "Кухня-гостиная 24 м² с окнами во двор, две изолированные спальни, свежий ремонт 2024 года.", features: ["Дом 1912 года, капремонт 2019", "Потолки 3,4 м, паркет ёлочкой", "Закрытый двор, кладовая в подвале"] },
  { title: "Дом-эркер на тихой улице", price: "31 500 000 ₽", kind: "Квартиры", area: "112 м²", rooms: "3 комнаты", floor: "2 из 5", district: "Центральный", metro: "Владимирская, 9 мин", text: "Три комнаты с эркером на юг, кабинет в бывшей гардеробной, окна на липовую аллею.", features: ["Лепнина и печи сохранены", "Две ванные, гардеробная", "Парковка во дворе"] },
  { title: "Студия с видом на закат", price: "9 200 000 ₽", kind: "Новостройки", area: "31 м²", rooms: "студия", floor: "19 из 24", district: "Приморский", metro: "Беговая, 12 мин", badge: "новостройка", text: "Угловая студия с панорамным остеклением, кухня в нише, отделка white box от застройщика.", features: ["Сдача в 4 квартале 2026", "Ипотека от 6 % по программе", "Паркинг и кладовые в доме"] },
  { title: "Спальня с лепниной, окна во двор", price: "22 400 000 ₽", kind: "Квартиры", area: "78 м²", rooms: "3 комнаты", floor: "3 из 4", district: "Центральный", metro: "Чернышевская, 6 мин", text: "Тихая трёшка на третьем этаже: спальня с лепниной, детская и гостиная с камином.", features: ["Дом 1898 года, лифт", "Два санузла", "Школа и сад во дворе"] },
  { title: "Таунхаус с садом и террасой", price: "27 000 000 ₽", kind: "Дома", area: "148 м²", rooms: "4 комнаты", district: "Курортный", metro: "Сестрорецк, ж/д", badge: "срочно", text: "Двухэтажный таунхаус с участком четыре сотки, террасой и отдельным входом.", features: ["Газ, вода, канализация центральные", "Гараж на две машины", "До залива 10 минут пешком"] },
  { title: "Пентхаус с террасой над крышами", price: "64 000 000 ₽", kind: "Квартиры", area: "164 м²", rooms: "4 комнаты", floor: "7 из 7", district: "Центральный", metro: "Адмиралтейская, 5 мин", text: "Последний этаж с террасой 60 м², видом на купол собора и своим лифтом.", features: ["Потолки 4,2 м", "Панорамные окна на три стороны", "Две парковки в закрытом дворе"] },
]

/** Подборка объектов недвижимости с фильтром по типу и сменой фото по наведению. */
export function Realty003({
  eyebrow = "Подборка недели",
  title = "Объекты, за которые мы ручаемся",
  lede = "Каждый объект осмотрен агентом, документы проверены юристом до публикации.",
  listings = DEFAULT_LISTINGS,
  allLabel = "Все",
  moreLabel = "Все объекты",
  moreHref = "#",
  flipHint = "подробнее",
  openLabel = "Смотреть объект",
  closeLabel = "Закрыть",
  floorLabel = "этаж {n}",
  chipsLabel = "Тип объекта",
  emptyLabel = "Пока пусто",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Realty003Props) {
  const kinds = Array.from(new Set(listings.map((item) => item.kind)))
  const [active, setActive] = useState<string | null>(null)
  const [phase, setPhase] = useState<"closed" | "start" | "open" | "closing">("closed")
  const [current, setCurrent] = useState<Realty003Listing | null>(null)
  const [side, setSide] = useState<"front" | "back">("front")
  const [from, setFrom] = useState<Box | null>(null)
  const [to, setTo] = useState<Box | null>(null)
  const cards = useRef<Record<string, HTMLDivElement | null>>({})
  const layer = useRef<HTMLDivElement>(null)
  const closing = useRef(0)
  const returnFocus = useRef(false)

  const open = (item: Realty003Listing) => {
    const element = cards.current[item.title]
    if (phase !== "closed" || !element) return
    window.clearTimeout(closing.current)
    const start = rectOf(element)
    setCurrent(item)
    setFrom(start)
    setTo(targetBox(start))
    setSide("front")
    setPhase("start")
  }

  const close = useCallback(() => {
    const element = current ? cards.current[current.title] : null
    if (phase !== "open" || !element) return
    setFrom(rectOf(element))
    setPhase("closing")
    closing.current = window.setTimeout(() => {
      returnFocus.current = true
      setPhase("closed")
    }, DURATION)
  }, [phase, current])

  const onKey = (event: KeyboardEvent<HTMLDivElement>, item: Realty003Listing) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      open(item)
    }
  }

  // Старт: копия стоит ровно на месте карточки (transform со сдвигом и
  // scale); после reflow и кадра transform обнуляется, а rotateY становится
  // 180° — едет, растёт и переворачивается одним движением. Пока открыто:
  // скролл заперт, Escape закрывает, Tab ходит по кругу, resize перецентрует.
  useEffect(() => {
    if (phase === "closed") return
    let raf = 0
    if (phase === "start") {
      void layer.current?.offsetWidth
      raf = window.requestAnimationFrame(() => {
        setSide("back")
        setPhase("open")
      })
    }
    const onWindowKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") close()
      if (event.key === "Tab" && layer.current) {
        const focusable = layer.current.querySelectorAll<HTMLElement>(FOCUSABLE)
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    const onResize = () => {
      const element = current ? cards.current[current.title] : null
      if (!element) return
      const start = rectOf(element)
      setFrom(start)
      setTo(targetBox(start))
    }
    const body = document.body
    const previous = { overflow: body.style.overflow, padding: body.style.paddingRight }
    const gutter = window.innerWidth - document.documentElement.clientWidth
    body.style.overflow = "hidden"
    if (gutter > 0) body.style.paddingRight = `${gutter}px`
    window.addEventListener("keydown", onWindowKey)
    window.addEventListener("resize", onResize)
    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener("keydown", onWindowKey)
      window.removeEventListener("resize", onResize)
      body.style.overflow = previous.overflow
      body.style.paddingRight = previous.padding
    }
  }, [phase, close, current])

  useEffect(() => {
    if (phase !== "open") return
    const timer = window.setTimeout(() => layer.current?.querySelector<HTMLElement>('[data-side="back"] [data-part="close"]')?.focus(), DURATION)
    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase === "closed" && returnFocus.current && current) {
      returnFocus.current = false
      cards.current[current.title]?.focus({ preventScroll: true })
    }
  }, [phase, current])

  useEffect(() => () => window.clearTimeout(closing.current), [])
  const visible = listings.filter((item) => active === null || item.kind === active)
  const palette = {
    ...(accent ? { "--vibeui-realty-003-accent": accent } : null),
    ...(ink ? { "--vibeui-realty-003-fg": ink } : null),
    ...(background ? { "--vibeui-realty-003-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-realty-003" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="realty-003" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
            </div>
            <ul data-part="chips" aria-label={chipsLabel}>
              <li>
                <button type="button" data-part="chip" aria-pressed={active === null} onClick={() => setActive(null)}>
                  {allLabel}
                </button>
              </li>
              {kinds.map((kind) => (
                <li key={kind}>
                  <button type="button" data-part="chip" aria-pressed={active === kind} onClick={() => setActive(kind)}>
                    {kind}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {visible.length === 0 ? (
            <p data-part="empty">{emptyLabel}</p>
          ) : (
            <ul data-part="grid" key={active ?? "all"}>
              {visible.map((item, index) => (
                <li key={item.title} style={{ ["--vibeui-realty-003-n" as string]: index }}>
                  <div
                    ref={(element) => {
                      cards.current[item.title] = element
                    }}
                    data-part="card"
                    data-hidden={phase !== "closed" && current?.title === item.title}
                    role="button"
                    tabIndex={0}
                    aria-haspopup="dialog"
                    aria-label={`${item.title}, ${item.price}`}
                    onClick={() => open(item)}
                    onKeyDown={(event) => onKey(event, item)}
                  >
                    <Front item={item} hint={flipHint} floorLabel={floorLabel} />
                  </div>
                </li>
              ))}
            </ul>
          )}
          {moreLabel ? (
            <a href={moreHref} data-part="more">
              {moreLabel} →
            </a>
          ) : null}
        </div>
      </section>
      {phase !== "closed" && from && to && current
        ? createPortal(
            <div
              ref={layer}
              data-vibeui-block="realty-003"
              data-part="layer"
              data-phase={phase}
              data-tone={tone === "auto" ? undefined : tone}
              style={palette}
              role="dialog"
              aria-modal="true"
              aria-label={current.title}
            >
              <div data-part="backdrop" onClick={close} />
              <div
                data-part="flyer"
                style={{
                  top: to.top,
                  left: to.left,
                  width: to.width,
                  height: to.height,
                  transform: phase === "open" ? `translate(0px, 0px) scale(1) rotateY(${side === "back" ? 180 : 0}deg)` : offsetTransform(from, to),
                }}
              >
                <div data-part="side" data-side="front" inert={side === "back" ? true : undefined} onClick={() => setSide("back")}>
                  <Front item={current} hint={flipHint} floorLabel={floorLabel} />
                  <button type="button" data-part="close" aria-label={closeLabel} onClick={(event) => { event.stopPropagation(); close() }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                      <path d="M3 3l10 10M13 3L3 13" />
                    </svg>
                  </button>
                </div>
                <div data-part="side" data-side="back" inert={side === "front" ? true : undefined} onClick={() => setSide("front")}>
                  {current.imageHover || current.image ? <img data-part="photo" src={current.imageHover || current.image} alt="" /> : null}
                  <div data-part="panel" onClick={(event) => event.stopPropagation()}>
                    <span data-part="back-price">{current.price}</span>
                    <h3 data-part="back-name">{current.title}</h3>
                    {current.text ? <p data-part="text">{current.text}</p> : null}
                    {current.features && current.features.length > 0 ? (
                      <ul data-part="features">
                        {current.features.map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                    ) : null}
                    {openLabel ? (
                      <a href={current.href ?? "#"} data-part="open">
                        {openLabel} →
                      </a>
                    ) : null}
                  </div>
                  <button type="button" data-part="close" aria-label={closeLabel} onClick={(event) => { event.stopPropagation(); close() }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                      <path d="M3 3l10 10M13 3L3 13" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}

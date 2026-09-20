"use client"

import { useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react"

export type Market001Product = {
  name: string
  author: string
  /** Ключ категории из `kinds`. */
  kind: string
  /** Цена личной лицензии в целых единицах валюты. */
  price: number
  image: string
  /** До трёх кадров превью для «пролистывания» по наведению. Пусто — кадры нарезаются из обложки. */
  frames?: readonly string[]
  downloads: number
  isNew?: boolean
}

export type Market001Kind = {
  key: string
  label: string
}

export type Market001License = {
  key: string
  label: string
  /** Во сколько раз дороже личной лицензии. */
  factor: number
  note?: string
}

export type Market001Props = {
  eyebrow?: string
  title?: string
  lede?: string
  products?: readonly Market001Product[]
  kinds?: readonly Market001Kind[]
  allLabel?: string
  sortLabels?: { popular: string; fresh: string; cheap: string; expensive: string }
  licenses?: readonly Market001License[]
  quickLabel?: string
  addLabel?: string
  addedLabel?: string
  currency?: string
  /** Имя CustomEvent, которое уходит наружу при «В набор» (detail: name, price, kind, image, license). */
  addEvent?: string
  /** aria фильтров, сортировки и лицензий; подписи. */
  chipsLabel?: string
  sortsLabel?: string
  sortShort?: string
  emptyText?: string
  downloadsUnit?: string
  licenseLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Витрина маркетплейса с живыми фильтрами: чипы категорий и четыре
// сортировки, при смене которых карточки переезжают на новые места
// FLIP-анимацией (снимок позиций до, инверсный transform после, анимация
// к нулю через Web Animations). По наведению обложка «пролистывается» —
// три кадра сменяются по очереди с точками-индикатором, а по курсору
// ходит спотлайт через --x/--y. «Быстрый просмотр» раскрывает в карточке
// панель лицензий: личная, коммерческая, команда — цена пересчитывается,
// «В набор» шлёт CustomEvent, который ловит конструктор набора.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="market-001"]){
--vibeui-market-001-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-market-001-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-market-001-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-market-001-on-accent:oklch(from var(--vibeui-market-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-market-001-muted:color-mix(in oklab,var(--vibeui-market-001-fg) 58%,var(--vibeui-market-001-bg));
--vibeui-market-001-line:color-mix(in oklab,var(--vibeui-market-001-fg) 12%,transparent);
--vibeui-market-001-soft:color-mix(in oklab,var(--vibeui-market-001-fg) 5%,transparent);
--vibeui-market-001-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-market-001-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-market-001-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="market-001"]{color-scheme:dark}
:where([data-vibeui-block="market-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="market-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="market-001"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-market-001-bg);color:var(--vibeui-market-001-fg);font-family:var(--vibeui-market-001-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="market-001"] *{box-sizing:border-box}
[data-vibeui-block="market-001"] [data-part="shell"]{max-width:86rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="market-001"] [data-part="head"]{display:grid;gap:1rem;align-items:end}
[data-vibeui-block="market-001"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-market-001-mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-market-001-muted)}
[data-vibeui-block="market-001"] [data-part="title"]{margin:0;font-family:var(--vibeui-market-001-display);font-weight:800;font-size:clamp(2rem,5cqi,3.6rem);line-height:.98;letter-spacing:-.04em}
[data-vibeui-block="market-001"] [data-part="lede"]{margin:.8rem 0 0;max-width:34rem;color:var(--vibeui-market-001-muted)}
[data-vibeui-block="market-001"] [data-part="bar"]{display:grid;gap:.8rem;margin:2rem 0 0;padding:1rem 0;border-top:1px solid var(--vibeui-market-001-line);border-bottom:1px solid var(--vibeui-market-001-line)}
[data-vibeui-block="market-001"] [data-part="chips"],[data-vibeui-block="market-001"] [data-part="sorts"]{display:flex;flex-wrap:wrap;gap:.4rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="market-001"] [data-part="chip"]{height:2.2rem;padding:0 .95rem;border-radius:999px;border:1px solid var(--vibeui-market-001-line);background:transparent;color:var(--vibeui-market-001-fg);font:inherit;font-size:.86rem;font-weight:500;cursor:pointer;transition:background .2s,color .2s,border-color .2s}
[data-vibeui-block="market-001"] [data-part="chip"]:hover{background:var(--vibeui-market-001-soft)}
[data-vibeui-block="market-001"] [data-part="chip"][aria-pressed="true"]{background:var(--vibeui-market-001-fg);color:var(--vibeui-market-001-bg);border-color:var(--vibeui-market-001-fg)}
[data-vibeui-block="market-001"] [data-part="chip"] small{margin-left:.4rem;font-family:var(--vibeui-market-001-mono);font-size:.66rem;opacity:.6}
[data-vibeui-block="market-001"] [data-part="sorts"]{align-items:center;font-family:var(--vibeui-market-001-mono);font-size:.72rem}
[data-vibeui-block="market-001"] [data-part="sorts"] [data-part="sort-label"]{margin-right:.4rem;color:var(--vibeui-market-001-muted);letter-spacing:.06em;text-transform:uppercase}
[data-vibeui-block="market-001"] [data-part="sort"]{height:2rem;padding:0 .7rem;border-radius:.5rem;border:0;background:transparent;color:var(--vibeui-market-001-muted);font:inherit;cursor:pointer;transition:color .2s,background .2s}
[data-vibeui-block="market-001"] [data-part="sort"]:hover{color:var(--vibeui-market-001-fg)}
[data-vibeui-block="market-001"] [data-part="sort"][aria-pressed="true"]{color:var(--vibeui-market-001-accent);background:color-mix(in oklab,var(--vibeui-market-001-accent) 10%,transparent)}
[data-vibeui-block="market-001"] [data-part="grid"]{display:grid;grid-template-columns:1fr;gap:1.6rem 1.2rem;margin:1.8rem 0 0;padding:0;list-style:none}
[data-vibeui-block="market-001"] [data-part="card"]{--vibeui-market-001-x:50%;--vibeui-market-001-y:50%;position:relative;display:grid;gap:.75rem;border-radius:1.2rem}
[data-vibeui-block="market-001"] [data-part="media"]{position:relative;aspect-ratio:4/3;border-radius:1rem;overflow:hidden;background:var(--vibeui-market-001-soft);isolation:isolate}
[data-vibeui-block="market-001"] [data-part="media"]::after{content:"";position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(14rem circle at var(--vibeui-market-001-x) var(--vibeui-market-001-y),rgb(255 255 255 / .35),transparent 60%);opacity:0;transition:opacity .3s}
[data-vibeui-block="market-001"] [data-part="card"]:hover [data-part="media"]::after{opacity:1}
[data-vibeui-block="market-001"] [data-part="frame"]{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:transform .6s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="market-001"] [data-part="frame"][data-k="0"]{opacity:1}
[data-vibeui-block="market-001"] [data-part="frame"][data-crop="1"]{transform:scale(1.6);transform-origin:20% 30%}
[data-vibeui-block="market-001"] [data-part="frame"][data-crop="2"]{transform:scale(1.6);transform-origin:80% 75%}
[data-vibeui-block="market-001"] [data-part="card"]:hover [data-part="frame"][data-k="0"]{animation:vibeui-market-001-f0 2.4s steps(1,end) infinite}
[data-vibeui-block="market-001"] [data-part="card"]:hover [data-part="frame"][data-k="1"]{animation:vibeui-market-001-f1 2.4s steps(1,end) infinite}
[data-vibeui-block="market-001"] [data-part="card"]:hover [data-part="frame"][data-k="2"]{animation:vibeui-market-001-f2 2.4s steps(1,end) infinite}
[data-vibeui-block="market-001"] [data-part="dots"]{position:absolute;left:50%;bottom:.7rem;z-index:4;display:flex;gap:.3rem;transform:translateX(-50%);opacity:0;transition:opacity .25s}
[data-vibeui-block="market-001"] [data-part="card"]:hover [data-part="dots"]{opacity:1}
[data-vibeui-block="market-001"] [data-part="dots"] i{width:1.2rem;height:3px;border-radius:2px;background:rgb(255 255 255 / .45)}
[data-vibeui-block="market-001"] [data-part="card"]:hover [data-part="dots"] i:nth-child(1){animation:vibeui-market-001-d0 2.4s steps(1,end) infinite}
[data-vibeui-block="market-001"] [data-part="card"]:hover [data-part="dots"] i:nth-child(2){animation:vibeui-market-001-d1 2.4s steps(1,end) infinite}
[data-vibeui-block="market-001"] [data-part="card"]:hover [data-part="dots"] i:nth-child(3){animation:vibeui-market-001-d2 2.4s steps(1,end) infinite}
@keyframes vibeui-market-001-f0{0%,33%{opacity:1}34%,100%{opacity:0}}
@keyframes vibeui-market-001-f1{0%,33%{opacity:0}34%,66%{opacity:1}67%,100%{opacity:0}}
@keyframes vibeui-market-001-f2{0%,66%{opacity:0}67%,100%{opacity:1}}
@keyframes vibeui-market-001-d0{0%,33%{background:#fff}34%,100%{background:rgb(255 255 255 / .45)}}
@keyframes vibeui-market-001-d1{0%,33%{background:rgb(255 255 255 / .45)}34%,66%{background:#fff}67%,100%{background:rgb(255 255 255 / .45)}}
@keyframes vibeui-market-001-d2{0%,66%{background:rgb(255 255 255 / .45)}67%,100%{background:#fff}}
[data-vibeui-block="market-001"] [data-part="tag"]{position:absolute;left:.7rem;top:.7rem;z-index:4;padding:.25rem .55rem;border-radius:999px;background:rgb(255 255 255 / .85);color:#111;font-family:var(--vibeui-market-001-mono);font-size:.64rem;letter-spacing:.04em;text-transform:uppercase;backdrop-filter:blur(6px)}
[data-vibeui-block="market-001"] [data-part="new"]{position:absolute;right:.7rem;top:.7rem;z-index:4;padding:.25rem .55rem;border-radius:999px;background:var(--vibeui-market-001-accent);color:var(--vibeui-market-001-on-accent);font-family:var(--vibeui-market-001-mono);font-size:.64rem;letter-spacing:.04em;text-transform:uppercase}
[data-vibeui-block="market-001"] [data-part="quick"]{position:absolute;right:.7rem;bottom:.7rem;z-index:4;display:inline-flex;align-items:center;gap:.4rem;height:2rem;padding:0 .8rem;border-radius:999px;border:0;background:rgb(255 255 255 / .9);color:#111;font:inherit;font-size:.78rem;font-weight:600;cursor:pointer;backdrop-filter:blur(6px);transition:transform .2s,background .2s}
[data-vibeui-block="market-001"] [data-part="quick"] svg{width:.9rem;height:.9rem}
[data-vibeui-block="market-001"] [data-part="quick"]:hover{transform:translateY(-1px);background:#fff}
[data-vibeui-block="market-001"] [data-part="quick"][aria-expanded="true"]{background:var(--vibeui-market-001-fg);color:var(--vibeui-market-001-bg)}
[data-vibeui-block="market-001"] [data-part="info"]{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:.2rem .8rem;align-items:baseline}
[data-vibeui-block="market-001"] [data-part="name"]{margin:0;font-family:var(--vibeui-market-001-display);font-weight:700;font-size:1.08rem;letter-spacing:-.02em;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="market-001"] [data-part="price"]{font-family:var(--vibeui-market-001-mono);font-size:.9rem;font-weight:500;font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="market-001"] [data-part="author"]{grid-column:1/-1;margin:0;font-size:.84rem;color:var(--vibeui-market-001-muted)}
[data-vibeui-block="market-001"] [data-part="author"] span{font-family:var(--vibeui-market-001-mono);font-size:.7rem;margin-left:.5rem}
[data-vibeui-block="market-001"] [data-part="panel"]{display:grid;grid-template-rows:0fr;transition:grid-template-rows .4s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="market-001"] [data-part="panel"][data-open="true"]{grid-template-rows:1fr}
[data-vibeui-block="market-001"] [data-part="panel"] > div{overflow:hidden}
[data-vibeui-block="market-001"] [data-part="licenses"]{display:grid;gap:.6rem;padding:1rem;border-radius:1rem;border:1px solid var(--vibeui-market-001-line);background:var(--vibeui-market-001-soft)}
[data-vibeui-block="market-001"] [data-part="lic"]{display:flex;flex-wrap:wrap;gap:.35rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="market-001"] [data-part="lic"] button{height:2rem;padding:0 .75rem;border-radius:999px;border:1px solid var(--vibeui-market-001-line);background:var(--vibeui-market-001-bg);color:var(--vibeui-market-001-fg);font:inherit;font-size:.8rem;font-weight:500;cursor:pointer;transition:background .2s,color .2s,border-color .2s}
[data-vibeui-block="market-001"] [data-part="lic"] button[aria-pressed="true"]{background:var(--vibeui-market-001-accent);color:var(--vibeui-market-001-on-accent);border-color:transparent}
[data-vibeui-block="market-001"] [data-part="sum"]{display:flex;align-items:center;justify-content:space-between;gap:.8rem}
[data-vibeui-block="market-001"] [data-part="sum"] output{font-family:var(--vibeui-market-001-display);font-weight:800;font-size:1.6rem;letter-spacing:-.03em;font-variant-numeric:tabular-nums;line-height:1}
[data-vibeui-block="market-001"] [data-part="sum"] output small{display:block;margin-top:.2rem;font-family:var(--vibeui-market-001-mono);font-weight:400;font-size:.66rem;letter-spacing:.02em;color:var(--vibeui-market-001-muted)}
[data-vibeui-block="market-001"] [data-part="add"]{display:inline-flex;align-items:center;gap:.4rem;height:2.5rem;padding:0 1.1rem;border-radius:999px;border:0;background:var(--vibeui-market-001-fg);color:var(--vibeui-market-001-bg);font:inherit;font-size:.86rem;font-weight:600;cursor:pointer;white-space:nowrap;transition:transform .18s,background .2s}
[data-vibeui-block="market-001"] [data-part="add"]:hover{transform:translateY(-1px)}
[data-vibeui-block="market-001"] [data-part="add"][data-done="true"]{background:var(--vibeui-market-001-accent);color:var(--vibeui-market-001-on-accent)}
[data-vibeui-block="market-001"] button:focus-visible{outline:2px solid var(--vibeui-market-001-accent);outline-offset:2px}
[data-vibeui-block="market-001"] [data-part="empty"]{padding:3rem 1rem;text-align:center;color:var(--vibeui-market-001-muted)}
@container (min-width: 36rem){[data-vibeui-block="market-001"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 48rem){[data-vibeui-block="market-001"] [data-part="bar"]{grid-template-columns:minmax(0,1fr) auto;align-items:center}}
@container (min-width: 60rem){[data-vibeui-block="market-001"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}}
@container (min-width: 78rem){[data-vibeui-block="market-001"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="market-001"] *{animation:none!important;transition:none!important}}`

const DEFAULT_KINDS: Market001Kind[] = [
  { key: "figma", label: "Figma" },
  { key: "notion", label: "Notion" },
  { key: "icons", label: "Иконки" },
  { key: "fonts", label: "Шрифты" },
]

const DEFAULT_LICENSES: Market001License[] = [
  { key: "personal", label: "Личная", factor: 1, note: "один человек, свои проекты" },
  { key: "commercial", label: "Коммерческая", factor: 2.5, note: "клиентские проекты, один дизайнер" },
  { key: "team", label: "Команда", factor: 5, note: "до 10 человек, любые проекты" },
]

const DEFAULT_PRODUCTS: Market001Product[] = [
  { name: "Атлас — UI-кит", author: "Лена Заварзина", kind: "figma", price: 2490, image: "/demo/market/cover-01.webp", downloads: 4210, isNew: false },
  { name: "Рутина — второй мозг", author: "Игорь Плотников", kind: "notion", price: 990, image: "/demo/market/cover-02.webp", downloads: 6830 },
  { name: "Грань — 480 иконок", author: "студия Сетка", kind: "icons", price: 1490, image: "/demo/market/cover-03.webp", downloads: 3120, isNew: true },
  { name: "Нарва Grotesk", author: "Тимур Гареев", kind: "fonts", price: 3900, image: "/demo/market/cover-04.webp", downloads: 1980 },
  { name: "Дашборд Про", author: "Лена Заварзина", kind: "figma", price: 3200, image: "/demo/market/cover-05.webp", downloads: 2740, isNew: true },
  { name: "Спринт — трекер продукта", author: "Аня Мельник", kind: "notion", price: 1290, image: "/demo/market/cover-06.webp", downloads: 5110 },
  { name: "Пиксель 3D", author: "студия Сетка", kind: "icons", price: 1990, image: "/demo/market/cover-07.webp", downloads: 1420, isNew: true },
  { name: "Мото Script", author: "Тимур Гареев", kind: "fonts", price: 2400, image: "/demo/market/cover-08.webp", downloads: 860 },
]

type SortKey = "popular" | "fresh" | "cheap" | "expensive"

function formatMoney(value: number, currency: string) {
  return `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${currency}`
}

/** Витрина с фильтрами, FLIP-перестановкой, пролистыванием обложек и быстрым просмотром лицензий. */
export function Market001({
  eyebrow = "витрина · обновляется по четвергам",
  title = "Что покупают на этой неделе",
  lede = "Каждый товар проверен редакцией: файлы открываются, слои названы, лицензия понятна.",
  products = DEFAULT_PRODUCTS,
  kinds = DEFAULT_KINDS,
  allLabel = "Все",
  sortLabels = { popular: "Популярные", fresh: "Новые", cheap: "Дешевле", expensive: "Дороже" },
  licenses = DEFAULT_LICENSES,
  quickLabel = "Быстрый просмотр",
  addLabel = "В набор",
  addedLabel = "В наборе",
  currency = "₽",
  addEvent = "vibeui-market:add",
  chipsLabel = "Категории",
  sortsLabel = "Сортировка",
  sortShort = "сорт.",
  emptyText = "Пока пусто — загляните в четверг.",
  downloadsUnit = "загрузок",
  licenseLabel = "Лицензия",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Market001Props) {
  const [kind, setKind] = useState("all")
  const [sort, setSort] = useState<SortKey>("popular")
  const [open, setOpen] = useState<string | null>(null)
  const [license, setLicense] = useState(licenses[0]?.key ?? "personal")
  const [added, setAdded] = useState<string | null>(null)
  const idPrefix = useId()
  const gridRef = useRef<HTMLUListElement>(null)
  const rects = useRef(new Map<string, DOMRect>())
  const pending = useRef(false)

  const visible = useMemo(() => {
    const list = products.filter((product) => kind === "all" || product.kind === kind)
    const sorted = [...list]
    if (sort === "popular") sorted.sort((a, b) => b.downloads - a.downloads)
    if (sort === "fresh") sorted.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)))
    if (sort === "cheap") sorted.sort((a, b) => a.price - b.price)
    if (sort === "expensive") sorted.sort((a, b) => b.price - a.price)
    return sorted
  }, [products, kind, sort])

  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const product of products) map.set(product.kind, (map.get(product.kind) ?? 0) + 1)
    return map
  }, [products])

  // Снимок позиций до смены фильтра — первая половина FLIP.
  const snapshot = () => {
    const grid = gridRef.current
    if (!grid) return
    rects.current = new Map()
    grid.querySelectorAll<HTMLElement>('[data-part="card"]').forEach((element) => {
      rects.current.set(element.dataset.name ?? "", element.getBoundingClientRect())
    })
    pending.current = true
  }

  useLayoutEffect(() => {
    if (!pending.current) return
    pending.current = false
    const grid = gridRef.current
    if (!grid || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const easing = "cubic-bezier(.2,.7,.2,1)"
    grid.querySelectorAll<HTMLElement>('[data-part="card"]').forEach((element) => {
      const previous = rects.current.get(element.dataset.name ?? "")
      if (!previous) {
        element.animate([{ opacity: 0, transform: "scale(.94)" }, { opacity: 1, transform: "none" }], { duration: 420, easing })
        return
      }
      const next = element.getBoundingClientRect()
      const dx = previous.left - next.left
      const dy = previous.top - next.top
      if (dx || dy) element.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: "none" }], { duration: 520, easing })
    })
  }, [kind, sort])

  const pickKind = (next: string) => {
    if (next === kind) return
    snapshot()
    setKind(next)
  }
  const pickSort = (next: SortKey) => {
    if (next === sort) return
    snapshot()
    setSort(next)
  }

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty("--vibeui-market-001-x", `${((event.clientX - box.left) / box.width) * 100}%`)
    event.currentTarget.style.setProperty("--vibeui-market-001-y", `${((event.clientY - box.top) / box.height) * 100}%`)
  }

  const add = (product: Market001Product) => {
    const current = licenses.find((item) => item.key === license) ?? licenses[0]
    const price = Math.round(product.price * (current?.factor ?? 1))
    if (addEvent) window.dispatchEvent(new CustomEvent(addEvent, { detail: { name: product.name, price, kind: product.kind, image: product.image, license: current?.key } }))
    setAdded(product.name)
    window.setTimeout(() => setAdded((value) => (value === product.name ? null : value)), 1800)
  }

  const activeLicense = licenses.find((item) => item.key === license) ?? licenses[0]
  const palette = {
    ...(accent ? { "--vibeui-market-001-accent": accent } : null),
    ...(ink ? { "--vibeui-market-001-fg": ink } : null),
    ...(background ? { "--vibeui-market-001-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-market-001" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="market-001" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
            </div>
          </div>
          <div data-part="bar">
            <ul data-part="chips" aria-label={chipsLabel}>
              <li>
                <button data-part="chip" type="button" aria-pressed={kind === "all"} onClick={() => pickKind("all")}>
                  {allLabel}
                  <small>{products.length}</small>
                </button>
              </li>
              {kinds.map((item) => (
                <li key={item.key}>
                  <button data-part="chip" type="button" aria-pressed={kind === item.key} onClick={() => pickKind(item.key)}>
                    {item.label}
                    <small>{counts.get(item.key) ?? 0}</small>
                  </button>
                </li>
              ))}
            </ul>
            <ul data-part="sorts" aria-label={sortsLabel}>
              <li data-part="sort-label" aria-hidden="true">
                {sortShort}
              </li>
              {(Object.keys(sortLabels) as SortKey[]).map((key) => (
                <li key={key}>
                  <button data-part="sort" type="button" aria-pressed={sort === key} onClick={() => pickSort(key)}>
                    {sortLabels[key]}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {visible.length === 0 ? (
            <p data-part="empty">{emptyText}</p>
          ) : (
            <ul ref={gridRef} data-part="grid">
              {visible.map((product, index) => {
                const frames = product.frames && product.frames.length > 0 ? product.frames : [product.image]
                const isOpen = open === product.name
                const kindLabel = kinds.find((item) => item.key === product.kind)?.label ?? product.kind
                const panelId = `${idPrefix}-${index}`
                return (
                  <li key={product.name} data-part="card" data-name={product.name}>
                    <div data-part="media" onPointerMove={onMove}>
                      {[0, 1, 2].map((k) => (
                        <img key={k} data-part="frame" data-k={k} data-crop={frames[k] ? undefined : k} src={frames[k] ?? frames[0]} alt="" loading="lazy" />
                      ))}
                      <span data-part="tag">{kindLabel}</span>
                      {product.isNew ? <span data-part="new">new</span> : null}
                      <span data-part="dots" aria-hidden="true">
                        <i />
                        <i />
                        <i />
                      </span>
                      <button data-part="quick" type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpen(isOpen ? null : product.name)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        {quickLabel}
                      </button>
                    </div>
                    <div data-part="info">
                      <h3 data-part="name">{product.name}</h3>
                      <span data-part="price">{formatMoney(product.price, currency)}</span>
                      <p data-part="author">
                        {product.author}
                        <span>{formatMoney(product.downloads, "").trim()} {downloadsUnit}</span>
                      </p>
                    </div>
                    <div data-part="panel" data-open={isOpen} id={panelId}>
                      <div>
                        <div data-part="licenses">
                          <ul data-part="lic" aria-label={licenseLabel}>
                            {licenses.map((item) => (
                              <li key={item.key}>
                                <button type="button" aria-pressed={license === item.key} onClick={() => setLicense(item.key)} tabIndex={isOpen ? 0 : -1}>
                                  {item.label}
                                </button>
                              </li>
                            ))}
                          </ul>
                          <div data-part="sum">
                            <output aria-live="polite">
                              {formatMoney(product.price * (activeLicense?.factor ?? 1), currency)}
                              <small>{activeLicense?.note ?? activeLicense?.label}</small>
                            </output>
                            <button data-part="add" type="button" data-done={added === product.name} onClick={() => add(product)} tabIndex={isOpen ? 0 : -1}>
                              {added === product.name ? `✓ ${addedLabel}` : `+ ${addLabel}`}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}

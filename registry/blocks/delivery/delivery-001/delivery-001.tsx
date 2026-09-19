"use client"

import { useEffect, useMemo, useState, type CSSProperties } from "react"

export type Delivery001Dish = {
  id: string
  name: string
  text?: string
  price: number
  /** «320 г», «450 ккал» — короткие факты через точку. */
  meta?: string
  /** Группа для фильтра: «Бургеры», «Азия». */
  kind: string
  image?: string
  /** Бейдж на фото: «хит», «острое», «новое». */
  badge?: string
}

export type Delivery001Props = {
  eyebrow?: string
  title?: string
  lede?: string
  dishes?: readonly Delivery001Dish[]
  /** С какой суммы доставка бесплатна. */
  freeFrom?: number
  /** Стоимость доставки, пока сумма меньше freeFrom (если карта зон не прислала свою). */
  deliveryFee?: number
  currency?: string
  allLabel?: string
  addLabel?: string
  checkoutLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Меню с корзиной: фильтр-чипы по группам, карточки блюд с фото в
// «вырезанных» формах (круг, капля, блоб — по очереди), кнопка «+» в
// карточке раскрывается в степпер «− 2 +». Корзина — закреплённая полоса
// снизу (position:fixed), выезжает при первом добавлении: количество,
// сумма, прогресс «до бесплатной доставки осталось …» и кнопка
// оформления. Кросс-блочно: шлёт vibeui-cart:state (count, total),
// принимает vibeui-cart:add от конструктора и vibeui-cart:zone от карты
// зон (стоимость и минуты доставки), по оформлению шлёт
// vibeui-cart:checkout — трекер заказа стартует сам.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@700;900&family=Onest:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="delivery-001"]){
--vibeui-delivery-001-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-delivery-001-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-delivery-001-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-delivery-001-on-accent:oklch(from var(--vibeui-delivery-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-delivery-001-on-fg:oklch(from var(--vibeui-delivery-001-fg) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-delivery-001-muted:color-mix(in oklab,var(--vibeui-delivery-001-fg) 62%,var(--vibeui-delivery-001-bg));
--vibeui-delivery-001-line:color-mix(in oklab,var(--vibeui-delivery-001-fg) 14%,transparent);
--vibeui-delivery-001-card:color-mix(in oklab,var(--vibeui-delivery-001-fg) 6%,var(--vibeui-delivery-001-bg));
--vibeui-delivery-001-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-delivery-001-font:"Onest",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="delivery-001"]{color-scheme:dark}
:where([data-vibeui-block="delivery-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="delivery-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="delivery-001"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-delivery-001-bg);color:var(--vibeui-delivery-001-fg);font-family:var(--vibeui-delivery-001-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="delivery-001"] *{box-sizing:border-box}
[data-vibeui-block="delivery-001"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="delivery-001"] [data-part="head"]{display:grid;gap:1.2rem;align-items:end}
[data-vibeui-block="delivery-001"] [data-part="eyebrow"]{margin:0 0 .6rem;font-size:.78rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-delivery-001-accent)}
[data-vibeui-block="delivery-001"] [data-part="title"]{margin:0;font-family:var(--vibeui-delivery-001-display);font-weight:900;font-size:clamp(2rem,5cqi,3.6rem);line-height:1;letter-spacing:-.03em;text-transform:uppercase}
[data-vibeui-block="delivery-001"] [data-part="lede"]{margin:.8rem 0 0;max-width:34rem;color:var(--vibeui-delivery-001-muted)}
[data-vibeui-block="delivery-001"] [data-part="filters"]{display:flex;flex-wrap:wrap;gap:.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="delivery-001"] [data-part="filters"] button{height:2.4rem;padding:0 1rem;border-radius:999px;border:1px solid var(--vibeui-delivery-001-line);background:transparent;color:var(--vibeui-delivery-001-muted);font:inherit;font-weight:600;font-size:.88rem;cursor:pointer;transition:background .2s,color .2s,transform .18s}
[data-vibeui-block="delivery-001"] [data-part="filters"] button:hover{color:var(--vibeui-delivery-001-fg);transform:translateY(-1px)}
[data-vibeui-block="delivery-001"] [data-part="filters"] button[aria-pressed="true"]{background:var(--vibeui-delivery-001-fg);color:var(--vibeui-delivery-001-on-fg);border-color:transparent}
[data-vibeui-block="delivery-001"] [data-part="grid"]{display:grid;gap:1rem;margin:2.2rem 0 0;padding:0;list-style:none;grid-template-columns:repeat(auto-fill,minmax(16rem,1fr))}
[data-vibeui-block="delivery-001"] [data-part="dish"]{position:relative;display:grid;grid-template-rows:auto 1fr auto;gap:.8rem;padding:1.1rem 1.1rem 1.2rem;border-radius:1.6rem;background:var(--vibeui-delivery-001-card);border:1px solid var(--vibeui-delivery-001-line);transition:transform .25s cubic-bezier(.2,.8,.2,1),border-color .25s;animation:vibeui-delivery-001-in .5s cubic-bezier(.2,.8,.2,1) both}
[data-vibeui-block="delivery-001"] [data-part="dish"]:hover{transform:translateY(-4px);border-color:color-mix(in oklab,var(--vibeui-delivery-001-accent) 60%,transparent)}
[data-vibeui-block="delivery-001"] [data-part="dish"][data-in="true"]{border-color:var(--vibeui-delivery-001-accent)}
[data-vibeui-block="delivery-001"] [data-part="photo"]{position:relative;width:72%;margin:0 auto;aspect-ratio:1}
[data-vibeui-block="delivery-001"] [data-part="photo"] img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="delivery-001"] [data-part="photo"][data-shape="circle"] img{border-radius:50%}
[data-vibeui-block="delivery-001"] [data-part="photo"][data-shape="drop"] img{border-radius:50% 50% 50% 8%}
[data-vibeui-block="delivery-001"] [data-part="photo"][data-shape="blob"] img{border-radius:60% 40% 55% 45% / 45% 60% 40% 55%}
[data-vibeui-block="delivery-001"] [data-part="dish"]:hover [data-part="photo"] img{transform:scale(1.06) rotate(-4deg)}
[data-vibeui-block="delivery-001"] [data-part="photo"]:empty{border-radius:50%;background:radial-gradient(circle at 35% 30%,color-mix(in oklab,var(--vibeui-delivery-001-accent) 55%,var(--vibeui-delivery-001-card)),var(--vibeui-delivery-001-card))}
[data-vibeui-block="delivery-001"] [data-part="badge"]{position:absolute;top:2%;left:-4%;padding:.3rem .65rem;border-radius:.5rem;background:var(--vibeui-delivery-001-accent);color:var(--vibeui-delivery-001-on-accent);font-size:.68rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;transform:rotate(-8deg)}
[data-vibeui-block="delivery-001"] [data-part="dish"] h3{margin:0;font-family:var(--vibeui-delivery-001-display);font-weight:700;font-size:1rem;line-height:1.2}
[data-vibeui-block="delivery-001"] [data-part="text"]{margin:.3rem 0 0;font-size:.86rem;color:var(--vibeui-delivery-001-muted)}
[data-vibeui-block="delivery-001"] [data-part="meta"]{margin:.5rem 0 0;font-size:.74rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--vibeui-delivery-001-muted)}
[data-vibeui-block="delivery-001"] [data-part="row"]{display:flex;align-items:center;justify-content:space-between;gap:.6rem}
[data-vibeui-block="delivery-001"] [data-part="price"]{font-family:var(--vibeui-delivery-001-display);font-weight:900;font-size:1.15rem;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
[data-vibeui-block="delivery-001"] [data-part="step"]{display:inline-flex;align-items:center;height:2.6rem;border-radius:999px;background:var(--vibeui-delivery-001-fg);color:var(--vibeui-delivery-001-on-fg);overflow:hidden;transition:background .2s}
[data-vibeui-block="delivery-001"] [data-part="step"][data-active="true"]{background:var(--vibeui-delivery-001-accent);color:var(--vibeui-delivery-001-on-accent)}
[data-vibeui-block="delivery-001"] [data-part="step"] button{display:grid;place-items:center;width:2.6rem;height:2.6rem;border:0;background:transparent;color:inherit;font:inherit;font-size:1.3rem;font-weight:700;line-height:1;cursor:pointer;transition:transform .15s}
[data-vibeui-block="delivery-001"] [data-part="step"] button:hover{transform:scale(1.15)}
[data-vibeui-block="delivery-001"] [data-part="step"] button:active{transform:scale(.9)}
[data-vibeui-block="delivery-001"] [data-part="step"] output{min-width:1.4rem;text-align:center;font-weight:800;font-variant-numeric:tabular-nums}
[data-vibeui-block="delivery-001"] button:focus-visible{outline:2px solid var(--vibeui-delivery-001-accent);outline-offset:2px}
[data-vibeui-block="delivery-001"] [data-part="empty"]{margin:2rem 0 0;padding:2rem;border-radius:1.2rem;border:1px dashed var(--vibeui-delivery-001-line);text-align:center;color:var(--vibeui-delivery-001-muted)}
[data-vibeui-block="delivery-001"] [data-part="bar"]{position:fixed;left:50%;bottom:1rem;z-index:60;width:min(100% - 2rem,58rem);padding:.9rem 1rem;border-radius:1.4rem;background:var(--vibeui-delivery-001-fg);color:var(--vibeui-delivery-001-on-fg);box-shadow:0 30px 60px -20px rgb(0 0 0 / .6);display:grid;gap:.7rem;transform:translate(-50%,calc(100% + 1.5rem));transition:transform .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="delivery-001"] [data-part="bar"][data-open="true"]{transform:translate(-50%,0)}
[data-vibeui-block="delivery-001"] [data-part="sum"]{display:flex;align-items:baseline;justify-content:space-between;gap:.8rem;font-size:.86rem}
[data-vibeui-block="delivery-001"] [data-part="sum"] b{font-family:var(--vibeui-delivery-001-display);font-weight:900;font-size:1.25rem;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
[data-vibeui-block="delivery-001"] [data-part="sum"] span{opacity:.75}
[data-vibeui-block="delivery-001"] [data-part="progress"]{display:grid;gap:.35rem;font-size:.78rem}
[data-vibeui-block="delivery-001"] [data-part="progress"] em{font-style:normal;opacity:.85}
[data-vibeui-block="delivery-001"] [data-part="progress"] em b{color:var(--vibeui-delivery-001-accent)}
[data-vibeui-block="delivery-001"] [data-part="track"]{height:.5rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-delivery-001-on-fg) 15%,transparent);overflow:hidden}
[data-vibeui-block="delivery-001"] [data-part="track"] i{display:block;height:100%;border-radius:inherit;background:var(--vibeui-delivery-001-accent);transform-origin:left;transform:scaleX(var(--vibeui-delivery-001-fill));transition:transform .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="delivery-001"] [data-part="checkout"]{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;height:3rem;padding:0 1.4rem;border-radius:999px;border:0;background:var(--vibeui-delivery-001-accent);color:var(--vibeui-delivery-001-on-accent);font:inherit;font-weight:800;font-size:.95rem;white-space:nowrap;cursor:pointer;transition:transform .18s,box-shadow .2s}
[data-vibeui-block="delivery-001"] [data-part="checkout"]:hover{transform:translateY(-1px);box-shadow:0 12px 30px -10px var(--vibeui-delivery-001-accent)}
[data-vibeui-block="delivery-001"] [data-part="checkout"][data-done="true"]{background:#22c55e;color:#fff}
@keyframes vibeui-delivery-001-in{from{opacity:0;transform:translateY(12px)}}
@container (min-width: 44rem){[data-vibeui-block="delivery-001"] [data-part="head"]{grid-template-columns:minmax(0,1fr) auto}[data-vibeui-block="delivery-001"] [data-part="bar"]{grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:1.4rem;padding:.8rem .8rem .8rem 1.4rem}[data-vibeui-block="delivery-001"] [data-part="sum"]{flex-direction:column;align-items:flex-start;gap:0}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="delivery-001"] *{animation:none!important;transition:none!important}}`

const DEFAULT_DISHES: Delivery001Dish[] = [
  { id: "smash", name: "Смэш-бургер двойной", text: "две котлеты, чеддер, карамельный лук, соус «Горячо»", price: 590, meta: "320 г · 780 ккал", kind: "Бургеры", image: "/demo/delivery/dish-01.webp", badge: "хит" },
  { id: "chicken", name: "Чикен-бургер хрустящий", text: "бедро в панировке, слоу, халапеньо, ранч", price: 520, meta: "300 г · 690 ккал", kind: "Бургеры", image: "/demo/delivery/dish-02.webp", badge: "острое" },
  { id: "tomyum", name: "Том-ям с креветками", text: "кокос, лемонграсс, шампиньоны, рис отдельно", price: 490, meta: "450 мл · 380 ккал", kind: "Азия", image: "/demo/delivery/dish-03.webp" },
  { id: "poke", name: "Поке с лососем", text: "рис, авокадо, эдамаме, манго, понзу", price: 640, meta: "380 г · 520 ккал", kind: "Азия", image: "/demo/delivery/dish-04.webp", badge: "новое" },
  { id: "padthai", name: "Пад-тай с курицей", text: "рисовая лапша, арахис, ростки, лайм", price: 470, meta: "400 г · 610 ккал", kind: "Азия", image: "/demo/delivery/dish-05.webp" },
  { id: "fries", name: "Картошка с трюфелем", text: "пармезан, трюфельное масло, айоли", price: 290, meta: "220 г · 470 ккал", kind: "Закуски", image: "/demo/delivery/dish-06.webp" },
  { id: "wings", name: "Крылья в глазури", text: "8 штук, кимчи-майо, кунжут", price: 450, meta: "360 г · 720 ккал", kind: "Закуски", image: "/demo/delivery/dish-07.webp", badge: "острое" },
  { id: "cheesecake", name: "Чизкейк «Сан-Себастьян»", text: "жжёный верх, ваниль, ложка сливок", price: 320, meta: "150 г · 430 ккал", kind: "Десерты", image: "/demo/delivery/dish-08.webp" },
]

type Extra = { id: string; name: string; price: number; qty: number }

const SHAPES = ["circle", "drop", "blob"] as const

function formatMoney(value: number, currency: string) {
  return `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${currency}`
}

function plural(count: number, one: string, few: string, many: string) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
  return many
}

/** Меню с фильтрами и закреплённой корзиной снизу. */
export function Delivery001({
  eyebrow = "Меню",
  title = "Что готовим прямо сейчас",
  lede = "Восемь позиций, которые уезжают чаще всего. Всё готовится после оплаты, ничего не греем повторно.",
  dishes = DEFAULT_DISHES,
  freeFrom = 1500,
  deliveryFee = 149,
  currency = "₽",
  allLabel = "Всё",
  addLabel = "В корзину",
  checkoutLabel = "Оформить",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Delivery001Props) {
  const [filter, setFilter] = useState<string | null>(null)
  const [qty, setQty] = useState<Record<string, number>>({})
  const [extras, setExtras] = useState<Extra[]>([])
  const [zone, setZone] = useState<{ fee: number; minutes: number } | null>(null)
  const [done, setDone] = useState(false)

  const kinds = useMemo(() => Array.from(new Set(dishes.map((dish) => dish.kind))), [dishes])
  const visible = filter ? dishes.filter((dish) => dish.kind === filter) : dishes

  const { count, total } = useMemo(() => {
    let count = 0
    let total = 0
    for (const dish of dishes) {
      const amount = qty[dish.id] ?? 0
      count += amount
      total += amount * dish.price
    }
    for (const extra of extras) {
      count += extra.qty
      total += extra.qty * extra.price
    }
    return { count, total }
  }, [dishes, qty, extras])

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("vibeui-cart:state", { detail: { count, total, freeFrom } }))
  }, [count, total, freeFrom])

  useEffect(() => {
    const onAdd = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string; name?: string; price?: number; qty?: number }>).detail
      if (!detail?.id || !detail.name || typeof detail.price !== "number") return
      const id = detail.id
      const name = detail.name
      const price = detail.price
      const amount = detail.qty ?? 1
      setExtras((list) => {
        const existing = list.find((extra) => extra.id === id)
        if (existing) return list.map((extra) => (extra.id === id ? { ...extra, qty: extra.qty + amount } : extra))
        return [...list, { id, name, price, qty: amount }]
      })
      setDone(false)
    }
    const onZone = (event: Event) => {
      const detail = (event as CustomEvent<{ fee?: number; minutes?: number }>).detail
      if (typeof detail?.fee !== "number" || typeof detail.minutes !== "number") return
      setZone({ fee: detail.fee, minutes: detail.minutes })
    }
    window.addEventListener("vibeui-cart:add", onAdd)
    window.addEventListener("vibeui-cart:zone", onZone)
    return () => {
      window.removeEventListener("vibeui-cart:add", onAdd)
      window.removeEventListener("vibeui-cart:zone", onZone)
    }
  }, [])

  useEffect(() => {
    if (!done) return
    const timer = window.setTimeout(() => {
      setDone(false)
      setQty({})
      setExtras([])
    }, 2600)
    return () => window.clearTimeout(timer)
  }, [done])

  const change = (id: string, delta: number) => {
    setDone(false)
    setQty((map) => {
      const next = Math.max(0, (map[id] ?? 0) + delta)
      const copy = { ...map }
      if (next === 0) delete copy[id]
      else copy[id] = next
      return copy
    })
  }

  const checkout = () => {
    if (count === 0) return
    setDone(true)
    window.dispatchEvent(new CustomEvent("vibeui-cart:checkout", { detail: { count, total } }))
  }

  const fee = zone?.fee ?? deliveryFee
  const left = Math.max(0, freeFrom - total)
  const fill = Math.min(1, total / freeFrom)

  const palette = {
    ...(accent ? { "--vibeui-delivery-001-accent": accent } : null),
    ...(ink ? { "--vibeui-delivery-001-fg": ink } : null),
    ...(background ? { "--vibeui-delivery-001-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-delivery-001" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="delivery-001" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
            </div>
            <ul data-part="filters" aria-label="Разделы меню">
              <li>
                <button type="button" aria-pressed={filter === null} onClick={() => setFilter(null)}>
                  {allLabel}
                </button>
              </li>
              {kinds.map((kind) => (
                <li key={kind}>
                  <button type="button" aria-pressed={filter === kind} onClick={() => setFilter(kind)}>
                    {kind}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <ul data-part="grid" key={filter ?? "all"}>
            {visible.map((dish, index) => {
              const amount = qty[dish.id] ?? 0
              return (
                <li key={dish.id} data-part="dish" data-in={amount > 0 ? "true" : undefined}>
                  <figure data-part="photo" data-shape={SHAPES[index % SHAPES.length]}>
                    {dish.image ? <img src={dish.image} alt={dish.name} loading="lazy" /> : null}
                    {dish.badge ? <figcaption data-part="badge">{dish.badge}</figcaption> : null}
                  </figure>
                  <div>
                    <h3>{dish.name}</h3>
                    {dish.text ? <p data-part="text">{dish.text}</p> : null}
                    {dish.meta ? <p data-part="meta">{dish.meta}</p> : null}
                  </div>
                  <div data-part="row">
                    <span data-part="price">{formatMoney(dish.price, currency)}</span>
                    <div data-part="step" data-active={amount > 0}>
                      {amount > 0 ? (
                        <>
                          <button type="button" aria-label={`Убрать ${dish.name}`} onClick={() => change(dish.id, -1)}>
                            −
                          </button>
                          <output aria-live="polite" aria-label={`${dish.name}: ${amount}`}>
                            {amount}
                          </output>
                        </>
                      ) : null}
                      <button type="button" aria-label={`${addLabel}: ${dish.name}`} onClick={() => change(dish.id, 1)}>
                        +
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
          {visible.length === 0 ? <p data-part="empty">В этом разделе пока пусто</p> : null}
        </div>
        <aside data-part="bar" data-open={count > 0} aria-label="Корзина" aria-hidden={count === 0}>
          <p data-part="sum">
            <b>{formatMoney(total, currency)}</b>
            <span>
              {count} {plural(count, "блюдо", "блюда", "блюд")}
              {zone ? ` · привезём за ${zone.minutes} мин` : null}
            </span>
          </p>
          <div data-part="progress">
            <em>
              {left > 0 ? (
                <>
                  До бесплатной доставки осталось <b>{formatMoney(left, currency)}</b> · сейчас доставка {formatMoney(fee, currency)}
                </>
              ) : (
                <>
                  <b>Доставка бесплатная</b> · спасибо, что взяли побольше
                </>
              )}
            </em>
            <div data-part="track" role="progressbar" aria-valuemin={0} aria-valuemax={freeFrom} aria-valuenow={Math.min(total, freeFrom)} aria-label="До бесплатной доставки">
              <i style={{ ["--vibeui-delivery-001-fill" as string]: fill }} />
            </div>
          </div>
          <button data-part="checkout" type="button" data-done={done} onClick={checkout} disabled={count === 0}>
            {done ? "Принято, готовим" : `${checkoutLabel} · ${formatMoney(total + (left > 0 ? fee : 0), currency)}`}
          </button>
        </aside>
      </section>
    </>
  )
}

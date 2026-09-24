"use client"

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react"

export type Flowers002Flower = {
  name: string
  /** Цена за стебель. */
  price: number
  /** Сколько дней стоит в вазе. */
  days: number
  /** Цвет бутона — для миниатюры, если нет фото. Пусто — акцент блока. */
  color?: string
  /** Сколько стеблей положить по умолчанию. */
  initial?: number
  /** Фото стебля во всю высоту (PNG/WebP без фона, срез у нижнего края, пропорция 2:3). */
  image?: string
  /** Где у нижнего края фото проходит стебель, доля ширины: 0.5 — по центру. */
  anchor?: number
}

export type Flowers002Props = {
  eyebrow?: string
  title?: string
  lede?: string
  flowers?: readonly Flowers002Flower[]
  /** Бумага и лента — фиксированная надбавка. */
  wrapPrice?: number
  wrapLabel?: string
  maxStems?: number
  /** Фото пустой вазы (PNG/WebP без фона, квадрат), стоит перед стеблями. */
  vaseImage?: string
  currency?: string
  orderLabel?: string
  /** Куда прокрутить после «заказать» — якорь формы. */
  formHref?: string
  /** Имя CustomEvent, в detail которого уходит состав. */
  eventName?: string
  /** Формы слова «день», подписи вазы и итога. */
  dayUnits?: readonly [string, string, string]
  /** Время сборки: до 6, до 14 и больше стеблей. */
  assemblyLabels?: readonly [string, string, string]
  emptyLine?: string
  lifeLine?: string
  stemLine?: string
  removeLabel?: string
  addLabel?: string
  stemsLabel?: string
  assemblyLabel?: string
  priceLabel?: string
  wrapLine?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Конструктор букета: слева стеклянная ваза на столе у окна, справа цветы
// с миниатюрами и «+ / −». Букет растёт как настоящий: каждый новый стебель
// получает следующее место от центра к краям — центральные выше, крайние
// ниже и шире, веер раскрывается с каждым стеблем, а уже стоящие плавно
// расходятся. Все стебли поворачиваются вокруг горлышка вазы, поэтому
// сходятся в нём; под водой видны их концы. Новый стебель опускается в вазу
// сверху, по воде расходятся круги, цветы еле заметно покачиваются вразнобой.
// Убранный стебель уходит вверх и тает. Цена, срок сборки и «букет живёт
// N дней» пересчитываются с подпрыгиванием цифр. «Заказать» отправляет состав
// CustomEvent-ом и прокручивает к форме.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Golos+Text:wght@400;500;600&family=Caveat:wght@500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="flowers-002"]){
--vibeui-flowers-002-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-flowers-002-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-flowers-002-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-flowers-002-on-accent:oklch(from var(--vibeui-flowers-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-flowers-002-muted:color-mix(in oklab,var(--vibeui-flowers-002-fg) 62%,var(--vibeui-flowers-002-bg));
--vibeui-flowers-002-line:color-mix(in oklab,var(--vibeui-flowers-002-fg) 14%,transparent);
--vibeui-flowers-002-paper:color-mix(in oklab,var(--vibeui-flowers-002-fg) 4%,var(--vibeui-flowers-002-bg));
--vibeui-flowers-002-spring:cubic-bezier(.34,1.3,.5,1);
--vibeui-flowers-002-ease:cubic-bezier(.22,1,.36,1);
--vibeui-flowers-002-display:"Cormorant",Georgia,"Times New Roman",serif;
--vibeui-flowers-002-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-flowers-002-hand:"Caveat","Segoe Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="flowers-002"]{color-scheme:dark}
:where([data-vibeui-block="flowers-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="flowers-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="flowers-002"]{box-sizing:border-box;padding:4rem 0;background:var(--vibeui-flowers-002-bg);color:var(--vibeui-flowers-002-fg);font-family:var(--vibeui-flowers-002-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="flowers-002"] *{box-sizing:border-box}
[data-vibeui-block="flowers-002"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="flowers-002"] [data-part="head"]{max-width:40rem;margin:0 0 1.8rem}
[data-vibeui-block="flowers-002"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.74rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-flowers-002-muted)}
[data-vibeui-block="flowers-002"] [data-part="title"]{margin:0;font-family:var(--vibeui-flowers-002-display);font-weight:500;font-size:clamp(2.2rem,5cqi,3.8rem);line-height:1;letter-spacing:-.02em}
[data-vibeui-block="flowers-002"] [data-part="lede"]{margin:.8rem 0 0;color:var(--vibeui-flowers-002-muted)}
[data-vibeui-block="flowers-002"] [data-part="grid"]{display:grid;gap:2rem;align-items:start}
[data-vibeui-block="flowers-002"] [data-part="stage"]{position:relative;width:min(100%,calc((100svh - 17rem) * .8));margin:0 auto;aspect-ratio:4/5;border-radius:1.4rem;overflow:hidden;container-type:inline-size;background:radial-gradient(70% 55% at 22% 12%,rgb(255 255 255 / .7),transparent 70%),linear-gradient(to bottom,var(--vibeui-flowers-002-paper) 72%,color-mix(in oklab,var(--vibeui-flowers-002-fg) 9%,var(--vibeui-flowers-002-bg)) 72%);box-shadow:inset 0 0 0 1px var(--vibeui-flowers-002-line)}
[data-vibeui-block="flowers-002"] [data-part="window"]{position:absolute;left:-10%;top:-10%;width:70%;height:90%;background:repeating-linear-gradient(115deg,rgb(255 255 255 / .22) 0 14%,transparent 14% 18%);filter:blur(10px);opacity:.7;pointer-events:none;animation:vibeui-flowers-002-light 14s ease-in-out infinite alternate}
[data-vibeui-block="flowers-002"] [data-part="shadow"]{position:absolute;left:50%;bottom:4cqw;width:34cqw;height:5cqw;margin-left:-17cqw;border-radius:50%;background:radial-gradient(closest-side,rgb(0 0 0 / .22),transparent);pointer-events:none}
[data-vibeui-block="flowers-002"] [data-part="stem"]{position:absolute;left:50%;bottom:42cqw;width:46.667cqw;height:70cqw;margin-left:calc(var(--vibeui-flowers-002-x) * -46.667cqw);transform-origin:calc(var(--vibeui-flowers-002-x) * 100%) 82.9%;rotate:var(--vibeui-flowers-002-a);scale:var(--vibeui-flowers-002-s);z-index:var(--vibeui-flowers-002-z);transition:rotate .9s var(--vibeui-flowers-002-spring),scale .9s var(--vibeui-flowers-002-spring),translate .5s var(--vibeui-flowers-002-ease),opacity .5s;pointer-events:none}
[data-vibeui-block="flowers-002"] [data-part="stem"][data-leaving="true"]{translate:0 -40cqw;opacity:0}
[data-vibeui-block="flowers-002"] [data-part="stem-img"]{display:block;width:100%;height:100%;object-fit:contain;object-position:50% 100%;transform-origin:calc(var(--vibeui-flowers-002-x) * 100%) 82.9%;filter:drop-shadow(0 .8cqw .8cqw rgb(0 0 0 / .16));animation:vibeui-flowers-002-drop .8s var(--vibeui-flowers-002-ease) both,vibeui-flowers-002-sway var(--vibeui-flowers-002-t) ease-in-out .8s infinite alternate}
[data-vibeui-block="flowers-002"] [data-part="jar"]{position:absolute;left:22cqw;bottom:3cqw;width:56cqw;height:56cqw;object-fit:contain;z-index:40;pointer-events:none;filter:drop-shadow(0 1cqw 1.2cqw rgb(0 0 0 / .12))}
[data-vibeui-block="flowers-002"] [data-part="ripple"]{position:absolute;left:50%;bottom:28.5cqw;width:15cqw;height:2.4cqw;margin-left:-7.5cqw;z-index:41;border-radius:50%;border:.25cqw solid rgb(255 255 255 / .85);opacity:0;pointer-events:none;animation:vibeui-flowers-002-ripple 1.1s ease-out .45s both}
[data-vibeui-block="flowers-002"] [data-part="ripple"][data-late]{animation-delay:.7s}
[data-vibeui-block="flowers-002"] [data-part="empty"]{position:absolute;left:50%;top:26%;z-index:42;translate:-50% -50%;rotate:-4deg;max-width:16rem;margin:0;text-align:center;font-family:var(--vibeui-flowers-002-hand);font-size:1.6rem;line-height:1.05;color:var(--vibeui-flowers-002-accent);pointer-events:none;animation:vibeui-flowers-002-fade .6s ease both}
[data-vibeui-block="flowers-002"] [data-part="life"]{position:absolute;right:1rem;bottom:1rem;z-index:42;margin:0;font-family:var(--vibeui-flowers-002-hand);font-size:1.45rem;line-height:1;color:var(--vibeui-flowers-002-accent);rotate:-3deg;animation:vibeui-flowers-002-note .5s var(--vibeui-flowers-002-spring) both}
[data-vibeui-block="flowers-002"] [data-part="counter"]{position:absolute;left:1rem;top:1rem;z-index:42;margin:0;padding:.3rem .7rem;border-radius:999px;background:rgb(255 255 255 / .7);backdrop-filter:blur(8px);font-size:.78rem;color:var(--vibeui-flowers-002-muted)}
[data-vibeui-block="flowers-002"] [data-part="chips"]{margin:0;padding:0;list-style:none;display:grid;gap:.6rem}
[data-vibeui-block="flowers-002"] [data-part="chip"]{display:grid;grid-template-columns:3.2rem minmax(0,1fr) auto;align-items:center;gap:.9rem;padding:.6rem .8rem .6rem .6rem;border-radius:1rem;border:1px solid var(--vibeui-flowers-002-line);background:var(--vibeui-flowers-002-bg);transition:border-color .3s,background .3s,box-shadow .3s,translate .3s var(--vibeui-flowers-002-ease)}
[data-vibeui-block="flowers-002"] [data-part="chip"]:hover{translate:0 -2px;box-shadow:0 12px 24px -18px rgb(0 0 0 / .5)}
[data-vibeui-block="flowers-002"] [data-part="chip"][data-on="true"]{border-color:color-mix(in oklab,var(--vibeui-flowers-002-fg) 55%,transparent);background:var(--vibeui-flowers-002-paper)}
[data-vibeui-block="flowers-002"] [data-part="thumb"]{position:relative;width:3.2rem;height:3.2rem;border-radius:50%;overflow:hidden;background:color-mix(in oklab,var(--vibeui-flowers-002-c) 22%,var(--vibeui-flowers-002-bg))}
[data-vibeui-block="flowers-002"] [data-part="thumb-img"]{position:absolute;left:-40%;top:-6%;width:180%;height:auto;transition:scale .5s var(--vibeui-flowers-002-spring),rotate .5s var(--vibeui-flowers-002-spring);transform-origin:50% 20%}
[data-vibeui-block="flowers-002"] [data-part="chip"]:hover [data-part="thumb-img"]{scale:1.12;rotate:-6deg}
[data-vibeui-block="flowers-002"] [data-part="chip-name"]{margin:0;font-family:var(--vibeui-flowers-002-display);font-size:1.35rem;font-weight:600;line-height:1.1}
[data-vibeui-block="flowers-002"] [data-part="chip-meta"]{margin:.1rem 0 0;font-size:.8rem;color:var(--vibeui-flowers-002-muted)}
[data-vibeui-block="flowers-002"] [data-part="count"]{display:inline-flex;align-items:center;gap:.25rem}
[data-vibeui-block="flowers-002"] [data-part="step"]{width:2.1rem;height:2.1rem;border-radius:50%;border:1px solid var(--vibeui-flowers-002-line);background:transparent;color:var(--vibeui-flowers-002-fg);font:inherit;font-size:1.1rem;line-height:1;cursor:pointer;transition:background .2s,color .2s,border-color .2s,scale .15s}
[data-vibeui-block="flowers-002"] [data-part="step"]:hover{background:var(--vibeui-flowers-002-accent);border-color:var(--vibeui-flowers-002-accent);color:var(--vibeui-flowers-002-on-accent)}
[data-vibeui-block="flowers-002"] [data-part="step"]:active{scale:.9}
[data-vibeui-block="flowers-002"] [data-part="step"]:disabled{opacity:.3;cursor:default;background:transparent;color:var(--vibeui-flowers-002-fg);border-color:var(--vibeui-flowers-002-line)}
[data-vibeui-block="flowers-002"] [data-part="step"]:focus-visible,[data-vibeui-block="flowers-002"] [data-part="order"]:focus-visible{outline:2px solid var(--vibeui-flowers-002-accent);outline-offset:3px}
[data-vibeui-block="flowers-002"] [data-part="num"]{display:inline-block;min-width:1.6rem;text-align:center;font-variant-numeric:tabular-nums;font-weight:500;animation:vibeui-flowers-002-bump .35s var(--vibeui-flowers-002-spring)}
[data-vibeui-block="flowers-002"] [data-part="sum"]{margin:1.2rem 0 0;padding:1.4rem;border-radius:1.2rem;background:var(--vibeui-flowers-002-fg);color:var(--vibeui-flowers-002-bg);display:grid;gap:1rem}
[data-vibeui-block="flowers-002"] [data-part="facts"]{margin:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}
[data-vibeui-block="flowers-002"] [data-part="fact-label"]{font-size:.74rem;letter-spacing:.06em;text-transform:uppercase;opacity:.65}
[data-vibeui-block="flowers-002"] [data-part="fact-value"]{margin:.2rem 0 0;font-family:var(--vibeui-flowers-002-display);font-weight:600;font-size:1.7rem;line-height:1;font-variant-numeric:tabular-nums;letter-spacing:-.02em;overflow:hidden}
[data-vibeui-block="flowers-002"] [data-part="roll"]{display:inline-block;animation:vibeui-flowers-002-roll .45s var(--vibeui-flowers-002-ease)}
[data-vibeui-block="flowers-002"] [data-part="fact-small"]{font-family:var(--vibeui-flowers-002-font);font-size:.78rem;font-weight:400;opacity:.7;letter-spacing:0}
[data-vibeui-block="flowers-002"] [data-part="order"]{display:inline-flex;justify-content:center;align-items:center;gap:.5rem;padding:.95rem 1.4rem;border-radius:999px;border:0;background:var(--vibeui-flowers-002-accent);color:var(--vibeui-flowers-002-on-accent);font:inherit;font-weight:500;cursor:pointer;transition:translate .2s,box-shadow .25s,opacity .2s}
[data-vibeui-block="flowers-002"] [data-part="order"]:hover{translate:0 -2px;box-shadow:0 14px 30px -14px var(--vibeui-flowers-002-accent)}
[data-vibeui-block="flowers-002"] [data-part="order"]:disabled{opacity:.45;cursor:default;translate:0 0;box-shadow:none}
[data-vibeui-block="flowers-002"] [data-part="wrap"]{margin:0;font-size:.8rem;opacity:.7}
@keyframes vibeui-flowers-002-drop{from{translate:0 -30cqw;opacity:0}60%{opacity:1}}
@keyframes vibeui-flowers-002-sway{from{rotate:calc(var(--vibeui-flowers-002-w) * -1deg)}to{rotate:calc(var(--vibeui-flowers-002-w) * 1deg)}}
@keyframes vibeui-flowers-002-ripple{0%{opacity:.9;scale:.2}100%{opacity:0;scale:1.6}}
@keyframes vibeui-flowers-002-light{from{translate:-3% 0}to{translate:5% 2%}}
@keyframes vibeui-flowers-002-bump{0%{scale:1}40%{scale:1.45;color:var(--vibeui-flowers-002-accent)}100%{scale:1}}
@keyframes vibeui-flowers-002-roll{from{translate:0 60%;opacity:0}}
@keyframes vibeui-flowers-002-note{from{opacity:0;scale:.8}}
@keyframes vibeui-flowers-002-fade{from{opacity:0}}
@container (min-width: 40rem){[data-vibeui-block="flowers-002"] [data-part="chips"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 60rem){[data-vibeui-block="flowers-002"] [data-part="grid"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:3rem}[data-vibeui-block="flowers-002"] [data-part="stage-wrap"]{position:sticky;top:5.5rem}[data-vibeui-block="flowers-002"] [data-part="grid"]{align-items:center}[data-vibeui-block="flowers-002"] [data-part="chips"]{grid-template-columns:1fr}}
@container (min-width: 76rem){[data-vibeui-block="flowers-002"] [data-part="chips"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="flowers-002"] *{animation:none!important;transition:none!important}}`

const IMAGES = "/demo/flowers/stems"

const DEFAULT_FLOWERS: Flowers002Flower[] = [
  { name: "Пион", price: 390, days: 6, color: "#e9a3b6", initial: 3, image: `${IMAGES}/peony.webp`, anchor: 0.532 },
  { name: "Мак", price: 190, days: 4, color: "#c2361d", initial: 2, image: `${IMAGES}/poppy.webp`, anchor: 0.495 },
  { name: "Ромашка", price: 120, days: 8, color: "#fbf6ea", image: `${IMAGES}/daisy.webp`, anchor: 0.554 },
  { name: "Ранункулюс", price: 260, days: 7, color: "#f0b04c", image: `${IMAGES}/ranunculus.webp`, anchor: 0.506 },
  { name: "Лаванда", price: 140, days: 10, color: "#8b7bb5", initial: 2, image: `${IMAGES}/lavender.webp`, anchor: 0.507 },
  { name: "Эвкалипт", price: 160, days: 14, color: "#7f9a7a", image: `${IMAGES}/eucalyptus.webp`, anchor: 0.528 },
]

type Stem = { id: number; name: string; leaving?: boolean }

function formatMoney(value: number, currency: string) {
  return `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${currency}`
}

function daysWord(days: number, units: readonly [string, string, string]) {
  const rest = days % 10
  if (days % 100 >= 11 && days % 100 <= 14) return units[2]
  if (rest === 1) return units[0]
  if (rest >= 2 && rest <= 4) return units[1]
  return units[2]
}

// Псевдослучайное число 0..1 от id: разброс углов и высот без Math.random,
// одинаковый на сервере и клиенте.
function noise(id: number, salt: number) {
  const value = Math.sin(id * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}

// Место k-го стебля из n: 0 — центр, дальше поочерёдно влево и вправо.
// Веер раскрывается вместе с числом стеблей, крайние ниже центральных.
function place(slot: number, count: number, id: number) {
  const rank = Math.ceil(slot / 2)
  const side = slot === 0 ? 0 : slot % 2 ? -1 : 1
  const ranks = Math.max(1, Math.ceil((count - 1) / 2))
  const spread = Math.min(8 + count * 2.2, 44)
  const t = rank / ranks
  const angle = side * t * spread + (noise(id, 1) - 0.5) * 5
  const scale = 1 - t * 0.2 - noise(id, 2) * 0.08
  return { angle, scale, z: 30 - rank * 2 + Math.round(noise(id, 3) * 2) }
}

function initialStems(flowers: readonly Flowers002Flower[]) {
  const left = flowers.map((flower) => flower.initial ?? 0)
  const stems: Stem[] = []
  let id = 1
  // Начальные стебли чередуются по видам, чтобы букет был смешанным.
  while (left.some((value) => value > 0)) {
    flowers.forEach((flower, index) => {
      if (left[index] > 0) {
        stems.push({ id: id++, name: flower.name })
        left[index] -= 1
      }
    })
  }
  return stems
}

/** Конструктор букета: стебли встают в вазу веером, букет растёт, цена и срок считаются. */
export function Flowers002({
  eyebrow = "Собрать свой",
  title = "Букет по вашему рецепту",
  lede = "Добавляйте стебли — они встанут в вазу. Мы подскажем цену, сколько будем собирать и сколько букет простоит.",
  flowers = DEFAULT_FLOWERS,
  wrapPrice = 300,
  wrapLabel = "бумага, лента и открытка",
  maxStems = 24,
  vaseImage = `${IMAGES}/vase.webp`,
  currency = "₽",
  orderLabel = "Заказать этот букет",
  formHref = "#delivery",
  eventName = "vibeui-flowers:order",
  dayUnits = ["день", "дня", "дней"],
  assemblyLabels = ["40 мин", "1,5 ч", "3 ч"],
  emptyLine = "ваза пуста — добавьте пару стеблей →",
  lifeLine = "этот букет живёт {n} {days}",
  stemLine = "{price}/шт · стоит {n} {days}",
  removeLabel = "Убрать: {name}",
  addLabel = "Добавить: {name}",
  stemsLabel = "Стеблей",
  assemblyLabel = "Соберём за",
  priceLabel = "Цена",
  wrapLine = "{wrap} — {price}, уже в цене",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Flowers002Props) {
  const [stems, setStems] = useState<Stem[]>(() => initialStems(flowers))
  const [splash, setSplash] = useState(0)
  const nextId = useRef(1000)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), [])

  const byName = useMemo(() => new Map(flowers.map((flower) => [flower.name, flower])), [flowers])
  const live = stems.filter((stem) => !stem.leaving)
  const counts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const stem of live) map[stem.name] = (map[stem.name] ?? 0) + 1
    return map
  }, [live])
  const total = live.length
  const chosen = flowers.filter((flower) => (counts[flower.name] ?? 0) > 0)
  const price = chosen.reduce((sum, flower) => sum + flower.price * (counts[flower.name] ?? 0), 0) + (total > 0 ? wrapPrice : 0)
  const life = chosen.length ? Math.min(...chosen.map((flower) => flower.days)) : 0
  const assembly = total === 0 ? "—" : total <= 6 ? assemblyLabels[0] : total <= 14 ? assemblyLabels[1] : assemblyLabels[2]

  const add = (name: string) => {
    if (total >= maxStems) return
    nextId.current += 1
    const id = nextId.current
    setStems((current) => [...current, { id, name }])
    setSplash((value) => value + 1)
  }

  const remove = (name: string) => {
    const target = [...stems].reverse().find((stem) => stem.name === name && !stem.leaving)
    if (!target) return
    setStems((current) => current.map((stem) => (stem.id === target.id ? { ...stem, leaving: true } : stem)))
    timers.current.push(window.setTimeout(() => setStems((current) => current.filter((stem) => stem.id !== target.id)), 520))
  }

  const order = () => {
    const detail = {
      items: chosen.map((flower) => ({ name: flower.name, count: counts[flower.name] ?? 0, price: flower.price })),
      stems: total,
      price,
      days: life,
    }
    window.dispatchEvent(new CustomEvent(eventName, { detail }))
    if (formHref.startsWith("#")) document.querySelector(formHref)?.scrollIntoView({ behavior: "smooth", block: "start" })
    else window.location.assign(formHref)
  }

  const palette = {
    ...(accent ? { "--vibeui-flowers-002-accent": accent } : null),
    ...(ink ? { "--vibeui-flowers-002-fg": ink } : null),
    ...(background ? { "--vibeui-flowers-002-bg": background } : null),
    ...style,
  } as CSSProperties

  const placed = stems.map((stem, index) => {
    const slot = stems.slice(0, index).filter((item) => !item.leaving).length
    return { stem, spot: place(stem.leaving ? Math.max(0, slot - 1) : slot, Math.max(total, 1), stem.id) }
  })

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-flowers-002" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="flowers-002" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="grid">
            <div data-part="stage-wrap">
              <div data-part="stage" aria-hidden="true">
                <i data-part="window" />
                <i data-part="shadow" />
                {placed.map(({ stem, spot }) => {
                  const flower = byName.get(stem.name)
                  if (!flower?.image) return null
                  return (
                    <span
                      key={stem.id}
                      data-part="stem"
                      data-leaving={stem.leaving ? "true" : undefined}
                      style={
                        {
                          ["--vibeui-flowers-002-a" as string]: `${spot.angle.toFixed(2)}deg`,
                          ["--vibeui-flowers-002-s" as string]: spot.scale.toFixed(3),
                          ["--vibeui-flowers-002-z" as string]: spot.z,
                          ["--vibeui-flowers-002-x" as string]: flower.anchor ?? 0.5,
                          ["--vibeui-flowers-002-w" as string]: (0.8 + noise(stem.id, 4) * 1.2).toFixed(2),
                          ["--vibeui-flowers-002-t" as string]: `${(4.5 + noise(stem.id, 5) * 3).toFixed(2)}s`,
                        } as CSSProperties
                      }
                    >
                      <img data-part="stem-img" src={flower.image} alt="" />
                    </span>
                  )
                })}
                {vaseImage ? <img data-part="jar" src={vaseImage} alt="" /> : null}
                {splash > 0 ? (
                  <span key={`splash-${splash}`}>
                    <i data-part="ripple" />
                    <i data-part="ripple" data-late="" />
                  </span>
                ) : null}
                {total === 0 ? <p data-part="empty">{emptyLine}</p> : null}
                {life > 0 ? (
                  <p key={`life-${life}`} data-part="life" aria-live="polite">
                    {lifeLine.replace("{n}", String(life)).replace("{days}", daysWord(life, dayUnits))}
                  </p>
                ) : null}
              </div>
            </div>
            <div>
              <ul data-part="chips">
                {flowers.map((flower) => {
                  const count = counts[flower.name] ?? 0
                  return (
                    <li key={flower.name} data-part="chip" data-on={count > 0} style={{ ["--vibeui-flowers-002-c" as string]: flower.color ?? "var(--vibeui-flowers-002-accent)" } as CSSProperties}>
                      <span data-part="thumb" aria-hidden="true">
                        {flower.image ? <img data-part="thumb-img" src={flower.image} alt="" loading="lazy" /> : null}
                      </span>
                      <div>
                        <h3 data-part="chip-name">{flower.name}</h3>
                        <p data-part="chip-meta">{stemLine.replace("{price}", `${flower.price} ${currency}`).replace("{n}", String(flower.days)).replace("{days}", daysWord(flower.days, dayUnits))}</p>
                      </div>
                      <div data-part="count">
                        <button data-part="step" type="button" onClick={() => remove(flower.name)} disabled={count === 0} aria-label={removeLabel.replace("{name}", flower.name)}>
                          −
                        </button>
                        <output data-part="num" key={count} aria-label={`${flower.name}: ${count}`}>
                          {count}
                        </output>
                        <button data-part="step" type="button" onClick={() => add(flower.name)} disabled={total >= maxStems} aria-label={addLabel.replace("{name}", flower.name)}>
                          +
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
              <div data-part="sum" aria-live="polite">
                <dl data-part="facts">
                  <div>
                    <dt data-part="fact-label">{stemsLabel}</dt>
                    <dd data-part="fact-value">
                      <span data-part="roll" key={total}>
                        {total}
                      </span>
                      <small data-part="fact-small"> / {maxStems}</small>
                    </dd>
                  </div>
                  <div>
                    <dt data-part="fact-label">{assemblyLabel}</dt>
                    <dd data-part="fact-value">
                      <span data-part="roll" key={assembly}>
                        {assembly}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt data-part="fact-label">{priceLabel}</dt>
                    <dd data-part="fact-value">
                      <span data-part="roll" key={price}>
                        {formatMoney(price, currency)}
                      </span>
                    </dd>
                  </div>
                </dl>
                <p data-part="wrap">{wrapLine.replace("{wrap}", wrapLabel).replace("{price}", `${wrapPrice} ${currency}`)}</p>
                <button data-part="order" type="button" onClick={order} disabled={total === 0}>
                  {orderLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

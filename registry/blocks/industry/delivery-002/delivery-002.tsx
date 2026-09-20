"use client"

import { useMemo, useState, type CSSProperties } from "react"

export type Delivery002Option = {
  id: string
  name: string
  price: number
  kcal: number
  /** Цвет слоя в миске. */
  color: string
  /** Фото миски с этим ингредиентом (тот же ракурс, что bowlImage) — показывается сектором. */
  image?: string
}

export type Delivery002Group = {
  id: string
  title: string
  /** single — ровно один вариант (основа, соус); multi — сколько угодно. */
  mode: "single" | "multi"
  options: readonly Delivery002Option[]
}

export type Delivery002Props = {
  eyebrow?: string
  title?: string
  lede?: string
  groups?: readonly Delivery002Group[]
  /** Цена миски без добавок. */
  basePrice?: number
  /** Фото пустой миски с основой (PNG без фона). Задан — миска рисуется фото, иначе цветными слоями. */
  bowlImage?: string
  currency?: string
  addLabel?: string
  addedLabel?: string
  /** Имя позиции в корзине, подписи групп и итога. */
  ownBowlLabel?: string
  singleHint?: string
  multiHint?: string
  emptyText?: string
  kcalLabel?: string
  gramsUnit?: string
  weightLabel?: string
  priceLabel?: string
  nothingLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Конструктор боула: слева группы ингредиентов чипами (основа и соус —
// один из, остальное — сколько угодно), справа миска. С фото (bowlImage):
// пустая миска с рисом, каждый выбранный белок — своё фото той же миски,
// обрезанное сектором (два белка — по половине, три — по трети), соус —
// цветной блик поверх, добавки — цветные горошины с отскоком. Без фото —
// CSS-миска, в которую падают цветные слои. Под миской бегущие цифры:
// калории, вес и цена считаются на лету. Кнопка «в корзину» шлёт
// vibeui-cart:add — блок меню добавляет боул в общую корзину, а кнопка
// на пару секунд становится зелёной.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@700;900&family=Onest:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="delivery-002"]){
--vibeui-delivery-002-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-delivery-002-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-delivery-002-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-delivery-002-on-accent:oklch(from var(--vibeui-delivery-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-delivery-002-on-fg:oklch(from var(--vibeui-delivery-002-fg) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-delivery-002-muted:color-mix(in oklab,var(--vibeui-delivery-002-fg) 62%,var(--vibeui-delivery-002-bg));
--vibeui-delivery-002-line:color-mix(in oklab,var(--vibeui-delivery-002-fg) 14%,transparent);
--vibeui-delivery-002-card:color-mix(in oklab,var(--vibeui-delivery-002-fg) 6%,var(--vibeui-delivery-002-bg));
--vibeui-delivery-002-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-delivery-002-font:"Onest",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="delivery-002"]{color-scheme:dark}
:where([data-vibeui-block="delivery-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="delivery-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="delivery-002"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-delivery-002-bg);color:var(--vibeui-delivery-002-fg);font-family:var(--vibeui-delivery-002-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="delivery-002"] *{box-sizing:border-box}
[data-vibeui-block="delivery-002"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="delivery-002"] [data-part="eyebrow"]{margin:0 0 .6rem;font-size:.78rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-delivery-002-accent)}
[data-vibeui-block="delivery-002"] [data-part="title"]{margin:0;font-family:var(--vibeui-delivery-002-display);font-weight:900;font-size:clamp(2rem,5cqi,3.6rem);line-height:1;letter-spacing:-.03em;text-transform:uppercase}
[data-vibeui-block="delivery-002"] [data-part="lede"]{margin:.8rem 0 0;max-width:34rem;color:var(--vibeui-delivery-002-muted)}
[data-vibeui-block="delivery-002"] [data-part="layout"]{display:grid;gap:2rem;margin-top:2.4rem;align-items:start}
[data-vibeui-block="delivery-002"] [data-part="groups"]{display:grid;gap:1.4rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="delivery-002"] [data-part="group"] h3{margin:0 0 .6rem;font-size:.8rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-delivery-002-muted)}
[data-vibeui-block="delivery-002"] [data-part="group"] h3 small{font-weight:500;letter-spacing:0;text-transform:none;margin-left:.4rem}
[data-vibeui-block="delivery-002"] [data-part="chips"]{display:flex;flex-wrap:wrap;gap:.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="delivery-002"] [data-part="chip"]{display:inline-flex;align-items:center;gap:.5rem;height:2.5rem;padding:0 .9rem 0 .6rem;border-radius:999px;border:1px solid var(--vibeui-delivery-002-line);background:var(--vibeui-delivery-002-card);color:var(--vibeui-delivery-002-fg);font:inherit;font-weight:600;font-size:.88rem;cursor:pointer;transition:background .2s,border-color .2s,transform .18s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="delivery-002"] [data-part="chip"]::before{content:"";width:1.1rem;height:1.1rem;border-radius:50%;background:var(--vibeui-delivery-002-c);box-shadow:inset 0 -2px 0 rgb(0 0 0 / .18)}
[data-vibeui-block="delivery-002"] [data-part="chip"] small{font-weight:500;color:var(--vibeui-delivery-002-muted)}
[data-vibeui-block="delivery-002"] [data-part="chip"]:hover{transform:translateY(-2px);border-color:var(--vibeui-delivery-002-fg)}
[data-vibeui-block="delivery-002"] [data-part="chip"][aria-pressed="true"],[data-vibeui-block="delivery-002"] [data-part="chip"][aria-checked="true"]{background:var(--vibeui-delivery-002-fg);color:var(--vibeui-delivery-002-on-fg);border-color:transparent}
[data-vibeui-block="delivery-002"] [data-part="chip"][aria-pressed="true"] small,[data-vibeui-block="delivery-002"] [data-part="chip"][aria-checked="true"] small{color:inherit;opacity:.7}
[data-vibeui-block="delivery-002"] button:focus-visible{outline:2px solid var(--vibeui-delivery-002-accent);outline-offset:2px}
[data-vibeui-block="delivery-002"] [data-part="stage"]{position:sticky;top:5rem;display:grid;gap:1.2rem;padding:1.4rem;border-radius:2rem;background:var(--vibeui-delivery-002-card);border:1px solid var(--vibeui-delivery-002-line)}
[data-vibeui-block="delivery-002"] [data-part="bowl"]{position:relative;width:min(100%,22rem);aspect-ratio:1/.8;margin:0 auto;container-type:inline-size}
[data-vibeui-block="delivery-002"] [data-part="rim"]{position:absolute;left:5%;right:5%;top:30%;height:28%;border-radius:50%;background:radial-gradient(ellipse at 50% 40%,color-mix(in oklab,var(--vibeui-delivery-002-fg) 14%,var(--vibeui-delivery-002-bg)),color-mix(in oklab,var(--vibeui-delivery-002-fg) 4%,var(--vibeui-delivery-002-bg)));box-shadow:inset 0 6px 14px rgb(0 0 0 / .3)}
[data-vibeui-block="delivery-002"] [data-part="body"]{position:absolute;left:5%;right:5%;top:44%;height:50%;border-radius:0 0 50% 50% / 0 0 100% 100%;background:linear-gradient(to bottom,color-mix(in oklab,var(--vibeui-delivery-002-fg) 12%,var(--vibeui-delivery-002-bg)),color-mix(in oklab,var(--vibeui-delivery-002-fg) 24%,var(--vibeui-delivery-002-bg)));box-shadow:0 26px 40px -20px rgb(0 0 0 / .6)}
[data-vibeui-block="delivery-002"] [data-part="body"]::after{content:"";position:absolute;left:12%;right:12%;bottom:-8%;height:10%;border-radius:50%;background:rgb(0 0 0 / .3);filter:blur(6px);z-index:-1}
[data-vibeui-block="delivery-002"] [data-part="stack"]{position:absolute;left:8%;right:8%;top:32%;height:28%;border-radius:50%;overflow:hidden}
[data-vibeui-block="delivery-002"] [data-part="layer"]{display:block;position:absolute;border-radius:50%;background:var(--vibeui-delivery-002-c);box-shadow:inset 0 -.5cqi 0 rgb(0 0 0 / .2),0 .6cqi 1.2cqi -.4cqi rgb(0 0 0 / .4);animation:vibeui-delivery-002-drop .55s cubic-bezier(.34,1.56,.64,1) both}
[data-vibeui-block="delivery-002"] [data-part="layer"][data-role="base"]{left:2%;right:2%;top:2%;bottom:2%;border-radius:50%;animation-name:vibeui-delivery-002-fill}
[data-vibeui-block="delivery-002"] [data-part="layer"][data-role="base"]::after{content:"";position:absolute;inset:0;border-radius:inherit;background:radial-gradient(circle at 30% 30%,rgb(255 255 255 / .25),transparent 60%)}
[data-vibeui-block="delivery-002"] [data-part="layer"][data-role="sauce"]{left:22%;right:22%;top:18%;bottom:18%;opacity:.85;filter:blur(.4cqi);animation-name:vibeui-delivery-002-fill}
[data-vibeui-block="delivery-002"] [data-part="empty"]{position:absolute;inset:0;display:grid;place-items:center;text-align:center;font-size:.8rem;color:var(--vibeui-delivery-002-muted);padding:0 15%}
[data-vibeui-block="delivery-002"] [data-part="facts"]{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.6rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="delivery-002"] [data-part="facts"] li{padding:.7rem .8rem;border-radius:1rem;background:var(--vibeui-delivery-002-bg);border:1px solid var(--vibeui-delivery-002-line);text-align:center}
[data-vibeui-block="delivery-002"] [data-part="facts"] b{display:block;font-family:var(--vibeui-delivery-002-display);font-weight:900;font-size:clamp(1.1rem,3.6cqi,1.5rem);letter-spacing:-.02em;font-variant-numeric:tabular-nums;line-height:1.1}
[data-vibeui-block="delivery-002"] [data-part="facts"] span{display:block;margin-top:.15rem;font-size:.7rem;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--vibeui-delivery-002-muted)}
[data-vibeui-block="delivery-002"] [data-part="recipe"]{margin:0;font-size:.86rem;color:var(--vibeui-delivery-002-muted);min-height:2.6em}
[data-vibeui-block="delivery-002"] [data-part="add"]{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;height:3.2rem;padding:0 1.4rem;border-radius:999px;border:0;background:var(--vibeui-delivery-002-accent);color:var(--vibeui-delivery-002-on-accent);font:inherit;font-weight:800;font-size:1rem;cursor:pointer;transition:transform .18s cubic-bezier(.2,.8,.2,1),box-shadow .2s,background .3s}
[data-vibeui-block="delivery-002"] [data-part="add"]:hover{transform:translateY(-2px);box-shadow:0 14px 34px -12px var(--vibeui-delivery-002-accent)}
[data-vibeui-block="delivery-002"] [data-part="add"][data-done="true"]{background:#22c55e;color:#fff}
[data-vibeui-block="delivery-002"] [data-part="add"] svg{width:1.1rem;height:1.1rem}
[data-vibeui-block="delivery-002"] [data-part="dish"]{position:relative;width:min(100%,22rem);aspect-ratio:1;margin:0 auto;container-type:inline-size;filter:drop-shadow(0 24px 24px rgb(0 0 0 / .35))}
[data-vibeui-block="delivery-002"] [data-part="dish"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;transition:opacity .4s,filter .5s}
[data-vibeui-block="delivery-002"] [data-part="dish"][data-empty="true"] [data-part="plate"]{filter:grayscale(.6) brightness(.7);opacity:.55}
[data-vibeui-block="delivery-002"] [data-part="wedge"]{animation:vibeui-delivery-002-fill .5s cubic-bezier(.3,1.4,.4,1) both;transform-origin:50% 50%}
[data-vibeui-block="delivery-002"] [data-part="drizzle"]{position:absolute;left:24%;top:24%;width:52%;height:52%;border-radius:50%;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-delivery-002-c) 70%,transparent),transparent 65%);mix-blend-mode:soft-light;opacity:.95;animation:vibeui-delivery-002-fill .5s cubic-bezier(.3,1.4,.4,1) both;pointer-events:none}
[data-vibeui-block="delivery-002"] [data-part="dot"]{position:absolute;width:7cqi;height:7cqi;margin:-3.5cqi 0 0 -3.5cqi;border-radius:50%;background:radial-gradient(circle at 35% 30%,color-mix(in oklab,var(--vibeui-delivery-002-c) 60%,#fff),var(--vibeui-delivery-002-c) 70%);box-shadow:0 .6cqi 1cqi rgb(0 0 0 / .35);animation:vibeui-delivery-002-drop .5s cubic-bezier(.3,1.4,.4,1) both}
[data-vibeui-block="delivery-002"] [data-part="dish"] [data-part="empty"]{inset:auto 0 -2.4rem}
@keyframes vibeui-delivery-002-drop{from{transform:translateY(-120%) scale(.6);opacity:0}to{transform:none;opacity:1}}
@keyframes vibeui-delivery-002-fill{from{transform:scale(.3);opacity:0}to{transform:none;opacity:1}}
@container (min-width: 56rem){[data-vibeui-block="delivery-002"] [data-part="layout"]{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:3rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="delivery-002"] *{animation:none!important;transition:none!important}}`

// Сектор миски для i-го из n белков: многоугольник от центра по дуге,
// чтобы два-три ингредиента легли рядом, а не друг на друга.
function wedge(index: number, count: number) {
  if (count <= 1) return "none"
  const steps = 12
  const from = (index / count) * Math.PI * 2 - Math.PI / 2
  const to = ((index + 1) / count) * Math.PI * 2 - Math.PI / 2
  const points = ["50% 50%"]
  for (let step = 0; step <= steps; step++) {
    const angle = from + ((to - from) * step) / steps
    points.push(`${(50 + Math.cos(angle) * 80).toFixed(1)}% ${(50 + Math.sin(angle) * 80).toFixed(1)}%`)
  }
  return `polygon(${points.join(",")})`
}

const DEFAULT_GROUPS: Delivery002Group[] = [
  {
    id: "base",
    title: "Основа",
    mode: "single",
    options: [
      { id: "rice", name: "Рис", price: 0, kcal: 210, color: "#f4efe2" },
      { id: "quinoa", name: "Киноа", price: 60, kcal: 190, color: "#d9c9a3" },
      { id: "noodles", name: "Лапша соба", price: 40, kcal: 240, color: "#a88a6a" },
      { id: "greens", name: "Микс салата", price: 0, kcal: 40, color: "#7cc95a" },
    ],
  },
  {
    id: "protein",
    title: "Белок",
    mode: "multi",
    options: [
      { id: "salmon", name: "Лосось", price: 220, kcal: 180, color: "#ff8a6b", image: "/demo/delivery/bowl-salmon.png" },
      { id: "chicken", name: "Курица на гриле", price: 150, kcal: 165, color: "#e6b380", image: "/demo/delivery/bowl-chicken.png" },
      { id: "shrimp", name: "Креветки", price: 240, kcal: 95, color: "#ffb0a0", image: "/demo/delivery/bowl-shrimp.png" },
      { id: "tofu", name: "Тофу", price: 110, kcal: 120, color: "#f0e6c8" },
    ],
  },
  {
    id: "toppings",
    title: "Добавки",
    mode: "multi",
    options: [
      { id: "avocado", name: "Авокадо", price: 90, kcal: 120, color: "#9ad04c" },
      { id: "edamame", name: "Эдамаме", price: 60, kcal: 60, color: "#5fb85a" },
      { id: "mango", name: "Манго", price: 80, kcal: 70, color: "#ffc632" },
      { id: "corn", name: "Кукуруза", price: 40, kcal: 55, color: "#ffe066" },
      { id: "egg", name: "Яйцо онсэн", price: 70, kcal: 75, color: "#fff2c2" },
      { id: "cucumber", name: "Огурец", price: 30, kcal: 10, color: "#6fd08b" },
      { id: "sesame", name: "Кунжут", price: 20, kcal: 30, color: "#e8dcc0" },
      { id: "chili", name: "Чили", price: 20, kcal: 5, color: "#ff3d2e" },
    ],
  },
  {
    id: "sauce",
    title: "Соус",
    mode: "single",
    options: [
      { id: "teriyaki", name: "Терияки", price: 0, kcal: 60, color: "#7a3b1e" },
      { id: "ponzu", name: "Понзу", price: 0, kcal: 25, color: "#d6a34a" },
      { id: "peanut", name: "Арахисовый", price: 20, kcal: 110, color: "#c98a4b" },
      { id: "spicy", name: "Острый майо", price: 20, kcal: 130, color: "#ff8060" },
    ],
  },
]

// Положения блобов в миске по порядку добавления: разбросаны заранее,
// чтобы слой ложился на «своё» место без Math.random.
const SPOTS = [
  { x: 18, y: 18, w: 34, h: 40 },
  { x: 52, y: 12, w: 32, h: 42 },
  { x: 36, y: 42, w: 30, h: 38 },
  { x: 8, y: 48, w: 28, h: 34 },
  { x: 64, y: 46, w: 28, h: 36 },
  { x: 28, y: 6, w: 26, h: 30 },
  { x: 50, y: 58, w: 24, h: 30 },
  { x: 14, y: 30, w: 22, h: 26 },
  { x: 62, y: 26, w: 22, h: 28 },
  { x: 40, y: 26, w: 20, h: 24 },
]

function formatMoney(value: number, currency: string) {
  return `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${currency}`
}

/** Конструктор боула: слои падают в миску, цена и калории считаются. */
export function Delivery002({
  eyebrow = "Конструктор",
  title = "Собери свой боул",
  lede = "Основа, белок, добавки, соус. Миска справа собирается по мере выбора, калории и цена — честно и сразу.",
  groups = DEFAULT_GROUPS,
  bowlImage = "/demo/delivery/bowl-base.png",
  basePrice = 290,
  currency = "₽",
  addLabel = "В корзину",
  addedLabel = "Добавили в корзину",
  ownBowlLabel = "Свой боул: {items}",
  singleHint = "один на выбор",
  multiHint = "сколько хочешь",
  emptyText = "Выберите основу — миска наполнится",
  kcalLabel = "ккал",
  gramsUnit = "г",
  weightLabel = "вес",
  priceLabel = "цена",
  nothingLabel = "Пока пусто",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Delivery002Props) {
  const [picked, setPicked] = useState<string[]>(() => {
    const initial: string[] = []
    for (const group of groups) if (group.mode === "single" && group.options[0]) initial.push(group.options[0].id)
    return initial
  })
  const [done, setDone] = useState(false)

  const byId = useMemo(() => {
    const map = new Map<string, Delivery002Option & { role: string }>()
    for (const group of groups) for (const option of group.options) map.set(option.id, { ...option, role: group.id })
    return map
  }, [groups])

  const chosen = picked.map((id) => byId.get(id)).filter((option): option is Delivery002Option & { role: string } => Boolean(option))
  const price = basePrice + chosen.reduce((sum, option) => sum + option.price, 0)
  const kcal = chosen.reduce((sum, option) => sum + option.kcal, 0)
  const weight = 120 + chosen.length * 45

  const toggle = (group: Delivery002Group, id: string) => {
    setDone(false)
    setPicked((list) => {
      if (group.mode === "single") {
        const others = list.filter((item) => !group.options.some((option) => option.id === item))
        return [...others, id]
      }
      return list.includes(id) ? list.filter((item) => item !== id) : [...list, id]
    })
  }

  const add = () => {
    const name = ownBowlLabel.replace("{items}", chosen.map((option) => option.name.toLowerCase()).join(", "))
    window.dispatchEvent(new CustomEvent("vibeui-cart:add", { detail: { id: `bowl-${picked.slice().sort().join("-")}`, name, price, qty: 1 } }))
    setDone(true)
    window.setTimeout(() => setDone(false), 2200)
  }

  const palette = {
    ...(accent ? { "--vibeui-delivery-002-accent": accent } : null),
    ...(ink ? { "--vibeui-delivery-002-fg": ink } : null),
    ...(background ? { "--vibeui-delivery-002-bg": background } : null),
    ...style,
  } as CSSProperties

  const base = chosen.find((option) => option.role === "base")
  const sauce = chosen.find((option) => option.role === "sauce")
  const pieces = chosen.filter((option) => option.role !== "base" && option.role !== "sauce")
  const wedges = pieces.filter((option) => option.image)
  const dots = pieces.filter((option) => !option.image)

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-delivery-002" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="delivery-002" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="layout">
            <ul data-part="groups">
              {groups.map((group) => (
                <li key={group.id} data-part="group">
                  <h3>
                    {group.title}
                    <small>{group.mode === "single" ? singleHint : multiHint}</small>
                  </h3>
                  <ul data-part="chips" role={group.mode === "single" ? "radiogroup" : undefined} aria-label={group.title}>
                    {group.options.map((option) => {
                      const on = picked.includes(option.id)
                      const chipStyle = { ["--vibeui-delivery-002-c" as string]: option.color } as CSSProperties
                      return (
                        <li key={option.id}>
                          {group.mode === "single" ? (
                            <button data-part="chip" type="button" role="radio" aria-checked={on} style={chipStyle} onClick={() => toggle(group, option.id)}>
                              {option.name}
                              <small>{option.price > 0 ? `+${option.price}` : "0"}</small>
                            </button>
                          ) : (
                            <button data-part="chip" type="button" aria-pressed={on} style={chipStyle} onClick={() => toggle(group, option.id)}>
                              {option.name}
                              <small>+{option.price}</small>
                            </button>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </li>
              ))}
            </ul>
            <div data-part="stage">
              {bowlImage ? (
                <div data-part="dish" aria-hidden="true" data-empty={!base}>
                  <img data-part="plate" src={bowlImage} alt="" />
                  {wedges.map((option, index) => (
                    <img key={option.id} data-part="wedge" src={option.image} alt="" style={{ clipPath: wedge(index, wedges.length), animationDelay: `${(index % 3) * 60}ms` }} />
                  ))}
                  {sauce ? <i key={sauce.id} data-part="drizzle" style={{ ["--vibeui-delivery-002-c" as string]: sauce.color } as CSSProperties} /> : null}
                  {dots.map((option, index) => {
                    // горошины по кругу внутри миски, шаг — золотой угол, без Math.random
                    const angle = ((index * 137.5) % 360) * (Math.PI / 180)
                    const radius = 22 + (index % 3) * 6
                    return <i key={option.id} data-part="dot" style={{ left: `${(50 + Math.cos(angle) * radius).toFixed(1)}%`, top: `${(50 + Math.sin(angle) * radius).toFixed(1)}%`, ["--vibeui-delivery-002-c" as string]: option.color, animationDelay: `${(index % 3) * 60}ms` } as CSSProperties} />
                  })}
                  {chosen.length === 0 ? <p data-part="empty">{emptyText}</p> : null}
                </div>
              ) : (
                <div data-part="bowl" aria-hidden="true">
                  <div data-part="body" />
                  <div data-part="rim" />
                  <div data-part="stack">
                    {base ? <i key={base.id} data-part="layer" data-role="base" style={{ ["--vibeui-delivery-002-c" as string]: base.color } as CSSProperties} /> : null}
                    {pieces.map((option, index) => {
                      const spot = SPOTS[index % SPOTS.length]
                      return <i key={option.id} data-part="layer" style={{ left: `${spot.x}%`, top: `${spot.y}%`, width: `${spot.w}%`, height: `${spot.h}%`, ["--vibeui-delivery-002-c" as string]: option.color, animationDelay: `${(index % 3) * 60}ms` } as CSSProperties} />
                    })}
                    {sauce ? <i key={sauce.id} data-part="layer" data-role="sauce" style={{ ["--vibeui-delivery-002-c" as string]: sauce.color } as CSSProperties} /> : null}
                  </div>
                  {chosen.length === 0 ? <p data-part="empty">{emptyText}</p> : null}
                </div>
              )}
              <ul data-part="facts">
                <li>
                  <b>{kcal}</b>
                  <span>{kcalLabel}</span>
                </li>
                <li>
                  <b>{weight} {gramsUnit}</b>
                  <span>{weightLabel}</span>
                </li>
                <li>
                  <b>{formatMoney(price, currency)}</b>
                  <span>{priceLabel}</span>
                </li>
              </ul>
              <p data-part="recipe" aria-live="polite">
                {chosen.length > 0 ? chosen.map((option) => option.name).join(" · ") : nothingLabel}
              </p>
              <button data-part="add" type="button" data-done={done} onClick={add} disabled={chosen.length === 0}>
                {done ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12l5 5 9-11" />
                    </svg>
                    {addedLabel}
                  </>
                ) : (
                  `${addLabel} · ${formatMoney(price, currency)}`
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

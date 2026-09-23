"use client"

import { useMemo, useState, type CSSProperties } from "react"

export type Delivery002Option = {
  id: string
  name: string
  price: number
  kcal: number
  /** Цвет-заглушка, если нет фото. */
  color: string
  /** Фото ингредиента сверху без фона (PNG/WebP с прозрачностью). */
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
  /** Пустая миска сверху без фона. */
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

// Конструктор боула: слева группы ингредиентов плитками с настоящими фото
// (основа и соус — один из, остальное — сколько угодно), справа миска сверху.
// Основа ложится кругом внутрь миски, белки и добавки падают в неё с отскоком
// и раскладываются по кругу — при каждом новом ингредиенте остальные плавно
// сдвигаются, соус стоит соусницей у края. Под миской калории, вес и цена
// на лету. Кнопка «в корзину» шлёт vibeui-cart:add — блок меню добавляет
// боул в общую корзину, а кнопка на пару секунд становится зелёной.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@700;900&family=Onest:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="delivery-002"]){
--vibeui-delivery-002-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-delivery-002-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-delivery-002-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-delivery-002-on-accent:oklch(from var(--vibeui-delivery-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-delivery-002-muted:color-mix(in oklab,var(--vibeui-delivery-002-fg) 62%,var(--vibeui-delivery-002-bg));
--vibeui-delivery-002-line:color-mix(in oklab,var(--vibeui-delivery-002-fg) 12%,transparent);
--vibeui-delivery-002-card:color-mix(in oklab,var(--vibeui-delivery-002-fg) 5%,var(--vibeui-delivery-002-bg));
--vibeui-delivery-002-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-delivery-002-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-delivery-002-spring:cubic-bezier(.3,1.5,.5,1);
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
[data-vibeui-block="delivery-002"] [data-part="groups"]{display:grid;gap:1.6rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="delivery-002"] [data-part="group-title"]{display:flex;align-items:baseline;gap:.5rem;margin:0 0 .7rem;font-size:.8rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-delivery-002-fg)}
[data-vibeui-block="delivery-002"] [data-part="group-hint"]{font-weight:500;letter-spacing:0;text-transform:none;color:var(--vibeui-delivery-002-muted)}
[data-vibeui-block="delivery-002"] [data-part="tiles"]{display:grid;grid-template-columns:repeat(auto-fill,minmax(7rem,1fr));gap:.6rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="delivery-002"] [data-part="tiles"] > li{display:flex}
[data-vibeui-block="delivery-002"] [data-part="tile"]{position:relative;display:grid;justify-items:center;align-content:start;gap:.15rem;width:100%;padding:.7rem .5rem .75rem;border-radius:1.1rem;border:1px solid var(--vibeui-delivery-002-line);background:var(--vibeui-delivery-002-card);color:var(--vibeui-delivery-002-fg);font:inherit;text-align:center;cursor:pointer;transition:border-color .3s,background .3s,translate .3s var(--vibeui-delivery-002-spring),box-shadow .3s}
[data-vibeui-block="delivery-002"] [data-part="tile"]:hover{translate:0 -3px;border-color:color-mix(in oklab,var(--vibeui-delivery-002-fg) 28%,transparent)}
[data-vibeui-block="delivery-002"] [data-part="tile"]:focus-visible{outline:2px solid var(--vibeui-delivery-002-accent);outline-offset:2px}
[data-vibeui-block="delivery-002"] [data-part="tile"][data-on="true"]{border-color:var(--vibeui-delivery-002-accent);background:color-mix(in oklab,var(--vibeui-delivery-002-accent) 10%,var(--vibeui-delivery-002-card));box-shadow:0 12px 28px -18px var(--vibeui-delivery-002-accent)}
[data-vibeui-block="delivery-002"] [data-part="thumb"]{display:block;width:4rem;height:4rem;object-fit:contain;filter:drop-shadow(0 8px 10px rgb(0 0 0 / .45));transition:scale .4s var(--vibeui-delivery-002-spring),rotate .4s var(--vibeui-delivery-002-spring)}
[data-vibeui-block="delivery-002"] [data-part="swatch"]{display:block;width:3rem;height:3rem;margin:.5rem;border-radius:50%;background:var(--vibeui-delivery-002-c)}
[data-vibeui-block="delivery-002"] [data-part="tile"]:hover [data-part="thumb"]{scale:1.1;rotate:-8deg}
[data-vibeui-block="delivery-002"] [data-part="tile"][data-on="true"] [data-part="thumb"]{scale:1.12}
[data-vibeui-block="delivery-002"] [data-part="tile-name"]{font-size:.82rem;font-weight:600;line-height:1.2}
[data-vibeui-block="delivery-002"] [data-part="tile-price"]{font-size:.72rem;font-weight:600;color:var(--vibeui-delivery-002-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="delivery-002"] [data-part="check"]{position:absolute;right:.45rem;top:.45rem;display:grid;place-items:center;width:1.3rem;height:1.3rem;border-radius:50%;background:var(--vibeui-delivery-002-accent);color:var(--vibeui-delivery-002-on-accent);scale:0;transition:scale .35s var(--vibeui-delivery-002-spring)}
[data-vibeui-block="delivery-002"] [data-part="check"] [data-part="glyph"]{width:.8rem;height:.8rem}
[data-vibeui-block="delivery-002"] [data-part="tile"][data-on="true"] [data-part="check"]{scale:1}
[data-vibeui-block="delivery-002"] [data-part="stage"]{position:sticky;top:5rem;display:grid;gap:1.1rem;padding:1.4rem;border-radius:2rem;background:radial-gradient(circle at 50% 32%,color-mix(in oklab,var(--vibeui-delivery-002-accent) 14%,transparent),transparent 60%),var(--vibeui-delivery-002-card);border:1px solid var(--vibeui-delivery-002-line)}
[data-vibeui-block="delivery-002"] [data-part="dish"]{position:relative;width:min(100%,24rem);aspect-ratio:1;margin:0 auto}
[data-vibeui-block="delivery-002"] [data-part="bowl"]{position:absolute;inset:3%;width:94%;height:94%;object-fit:contain;filter:drop-shadow(0 30px 30px rgb(0 0 0 / .55))}
[data-vibeui-block="delivery-002"] [data-part="base"]{position:absolute;inset:14%;width:72%;height:72%;border-radius:50%;object-fit:cover;animation:vibeui-delivery-002-fill .6s var(--vibeui-delivery-002-spring) both}
[data-vibeui-block="delivery-002"] [data-part="piece"]{position:absolute;width:var(--vibeui-delivery-002-size);aspect-ratio:1;translate:-50% -50%;transition:left .55s var(--vibeui-delivery-002-spring),top .55s var(--vibeui-delivery-002-spring)}
[data-vibeui-block="delivery-002"] [data-part="piece"] img{display:block;width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 6px 6px rgb(0 0 0 / .45));animation:vibeui-delivery-002-drop .7s var(--vibeui-delivery-002-spring) both}
[data-vibeui-block="delivery-002"] [data-part="piece"] i{display:block;width:100%;height:100%;border-radius:50%;background:var(--vibeui-delivery-002-c);animation:vibeui-delivery-002-drop .7s var(--vibeui-delivery-002-spring) both}
[data-vibeui-block="delivery-002"] [data-part="sauce"]{position:absolute;right:-1%;bottom:-1%;width:26%;aspect-ratio:1;filter:drop-shadow(0 12px 12px rgb(0 0 0 / .5));animation:vibeui-delivery-002-slide .6s var(--vibeui-delivery-002-spring) both}
[data-vibeui-block="delivery-002"] [data-part="sauce"] img{display:block;width:100%;height:100%;object-fit:contain}
[data-vibeui-block="delivery-002"] [data-part="empty"]{position:absolute;inset:0;display:grid;place-items:center;margin:0;padding:0 24%;text-align:center;font-size:.85rem;color:var(--vibeui-delivery-002-muted)}
[data-vibeui-block="delivery-002"] [data-part="facts"]{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.6rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="delivery-002"] [data-part="facts"] li{padding:.7rem .8rem;border-radius:1rem;background:var(--vibeui-delivery-002-bg);border:1px solid var(--vibeui-delivery-002-line);text-align:center}
[data-vibeui-block="delivery-002"] [data-part="fact-value"]{display:block;font-family:var(--vibeui-delivery-002-display);font-weight:900;font-size:clamp(1.1rem,3.6cqi,1.5rem);letter-spacing:-.02em;font-variant-numeric:tabular-nums;line-height:1.1}
[data-vibeui-block="delivery-002"] [data-part="fact-label"]{display:block;margin-top:.15rem;font-size:.7rem;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--vibeui-delivery-002-muted)}
[data-vibeui-block="delivery-002"] [data-part="recipe"]{margin:0;font-size:.86rem;color:var(--vibeui-delivery-002-muted);min-height:2.6em}
[data-vibeui-block="delivery-002"] [data-part="add"]{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;height:3.2rem;padding:0 1.4rem;border-radius:999px;border:0;background:var(--vibeui-delivery-002-accent);color:var(--vibeui-delivery-002-on-accent);font:inherit;font-weight:800;font-size:1rem;cursor:pointer;transition:translate .18s cubic-bezier(.2,.8,.2,1),box-shadow .2s,background .3s}
[data-vibeui-block="delivery-002"] [data-part="add"]:hover{translate:0 -2px;box-shadow:0 14px 34px -12px var(--vibeui-delivery-002-accent)}
[data-vibeui-block="delivery-002"] [data-part="add"]:focus-visible{outline:2px solid var(--vibeui-delivery-002-fg);outline-offset:3px}
[data-vibeui-block="delivery-002"] [data-part="add"][data-done="true"]{background:#22c55e;color:#fff}
[data-vibeui-block="delivery-002"] [data-part="add"] [data-part="glyph"]{width:1.1rem;height:1.1rem}
@keyframes vibeui-delivery-002-drop{0%{translate:0 -180%;scale:1.25;rotate:-25deg;opacity:0}60%{opacity:1}100%{translate:0 0;scale:1;rotate:0deg;opacity:1}}
@keyframes vibeui-delivery-002-fill{from{scale:.5;opacity:0}}
@keyframes vibeui-delivery-002-slide{from{translate:40% 20%;opacity:0}}
@container (min-width: 56rem){[data-vibeui-block="delivery-002"] [data-part="layout"]{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:3rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="delivery-002"] *{animation:none!important;transition:none!important}}`

const IMAGES = "/demo/delivery/bowl"

const DEFAULT_GROUPS: Delivery002Group[] = [
  {
    id: "base",
    title: "Основа",
    mode: "single",
    options: [
      { id: "rice", name: "Рис", price: 0, kcal: 210, color: "#f4efe2", image: `${IMAGES}/base-rice.webp` },
      { id: "quinoa", name: "Киноа", price: 60, kcal: 190, color: "#d9c9a3", image: `${IMAGES}/base-quinoa.webp` },
      { id: "noodles", name: "Лапша соба", price: 40, kcal: 240, color: "#a88a6a", image: `${IMAGES}/base-noodles.webp` },
      { id: "greens", name: "Микс салата", price: 0, kcal: 40, color: "#7cc95a", image: `${IMAGES}/base-greens.webp` },
    ],
  },
  {
    id: "protein",
    title: "Белок",
    mode: "multi",
    options: [
      { id: "salmon", name: "Лосось", price: 220, kcal: 180, color: "#ff8a6b", image: `${IMAGES}/protein-salmon.webp` },
      { id: "chicken", name: "Курица на гриле", price: 150, kcal: 165, color: "#e6b380", image: `${IMAGES}/protein-chicken.webp` },
      { id: "shrimp", name: "Креветки", price: 240, kcal: 95, color: "#ffb0a0", image: `${IMAGES}/protein-shrimp.webp` },
      { id: "tofu", name: "Тофу", price: 110, kcal: 120, color: "#f0e6c8", image: `${IMAGES}/protein-tofu.webp` },
    ],
  },
  {
    id: "toppings",
    title: "Добавки",
    mode: "multi",
    options: [
      { id: "avocado", name: "Авокадо", price: 90, kcal: 120, color: "#9ad04c", image: `${IMAGES}/topping-avocado.webp` },
      { id: "edamame", name: "Эдамаме", price: 60, kcal: 60, color: "#5fb85a", image: `${IMAGES}/topping-edamame.webp` },
      { id: "mango", name: "Манго", price: 80, kcal: 70, color: "#ffc632", image: `${IMAGES}/topping-mango.webp` },
      { id: "corn", name: "Кукуруза", price: 40, kcal: 55, color: "#ffe066", image: `${IMAGES}/topping-corn.webp` },
      { id: "egg", name: "Яйцо онсэн", price: 70, kcal: 75, color: "#fff2c2", image: `${IMAGES}/topping-egg.webp` },
      { id: "cucumber", name: "Огурец", price: 30, kcal: 10, color: "#6fd08b", image: `${IMAGES}/topping-cucumber.webp` },
      { id: "sesame", name: "Кунжут", price: 20, kcal: 30, color: "#e8dcc0", image: `${IMAGES}/topping-sesame.webp` },
      { id: "chili", name: "Чили", price: 20, kcal: 5, color: "#ff3d2e", image: `${IMAGES}/topping-chili.webp` },
    ],
  },
  {
    id: "sauce",
    title: "Соус",
    mode: "single",
    options: [
      { id: "teriyaki", name: "Терияки", price: 0, kcal: 60, color: "#7a3b1e", image: `${IMAGES}/sauce-teriyaki.webp` },
      { id: "ponzu", name: "Понзу", price: 0, kcal: 25, color: "#d6a34a", image: `${IMAGES}/sauce-ponzu.webp` },
      { id: "peanut", name: "Арахисовый", price: 20, kcal: 110, color: "#c98a4b", image: `${IMAGES}/sauce-peanut.webp` },
      { id: "spicy", name: "Острый майо", price: 20, kcal: 130, color: "#ff8060", image: `${IMAGES}/sauce-spicy.webp` },
    ],
  },
]

// Место i-го из n ингредиентов по кругу внутри миски, в процентах: первый — сверху,
// дальше по часовой; при новом ингредиенте все плавно сдвигаются на новые места.
function spot(index: number, count: number) {
  const angle = -Math.PI / 2 + (index / Math.max(count, 3)) * Math.PI * 2
  const radius = count === 1 ? 0 : 21
  return { left: `${(50 + Math.cos(angle) * radius).toFixed(2)}%`, top: `${(50 + Math.sin(angle) * radius).toFixed(2)}%` }
}

function formatMoney(value: number, currency: string) {
  return `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${currency}`
}

/** Конструктор боула: ингредиенты с фото падают в миску, цена и калории считаются. */
export function Delivery002({
  eyebrow = "Конструктор",
  title = "Собери свой боул",
  lede = "Основа, белок, добавки, соус. Миска справа собирается по мере выбора, калории и цена считаются сразу.",
  groups = DEFAULT_GROUPS,
  bowlImage = `${IMAGES}/bowl-empty.webp`,
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
                <li key={group.id}>
                  <h3 data-part="group-title">
                    {group.title}
                    <small data-part="group-hint">{group.mode === "single" ? singleHint : multiHint}</small>
                  </h3>
                  <ul data-part="tiles" role={group.mode === "single" ? "radiogroup" : undefined} aria-label={group.title}>
                    {group.options.map((option) => {
                      const on = picked.includes(option.id)
                      return (
                        <li key={option.id}>
                          <button
                            data-part="tile"
                            type="button"
                            data-on={on}
                            role={group.mode === "single" ? "radio" : undefined}
                            aria-checked={group.mode === "single" ? on : undefined}
                            aria-pressed={group.mode === "single" ? undefined : on}
                            onClick={() => toggle(group, option.id)}
                          >
                            {option.image ? (
                              <img data-part="thumb" src={option.image} alt="" loading="lazy" />
                            ) : (
                              <i data-part="swatch" style={{ ["--vibeui-delivery-002-c" as string]: option.color } as CSSProperties} />
                            )}
                            <span data-part="tile-name">{option.name}</span>
                            <span data-part="tile-price">{option.price > 0 ? `+${formatMoney(option.price, currency)}` : formatMoney(0, currency)}</span>
                            <span data-part="check" aria-hidden="true">
                              <svg data-part="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12.5l4.5 4.5L19 7.5" />
                              </svg>
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              ))}
            </ul>
            <div data-part="stage">
              <div data-part="dish" aria-hidden="true">
                <img data-part="bowl" src={bowlImage} alt="" />
                {base?.image ? <img key={base.id} data-part="base" src={base.image} alt="" /> : null}
                {pieces.map((option, index) => {
                  const size = option.role === "protein" ? "34%" : "25%"
                  return (
                    <span key={option.id} data-part="piece" style={{ ...spot(index, pieces.length), ["--vibeui-delivery-002-size" as string]: size, ["--vibeui-delivery-002-c" as string]: option.color } as CSSProperties}>
                      {option.image ? <img src={option.image} alt="" /> : <i />}
                    </span>
                  )
                })}
                {sauce?.image ? (
                  <span key={sauce.id} data-part="sauce">
                    <img src={sauce.image} alt="" />
                  </span>
                ) : null}
                {!base ? <p data-part="empty">{emptyText}</p> : null}
              </div>
              <ul data-part="facts">
                <li>
                  <b data-part="fact-value">{kcal}</b>
                  <span data-part="fact-label">{kcalLabel}</span>
                </li>
                <li>
                  <b data-part="fact-value">
                    {weight} {gramsUnit}
                  </b>
                  <span data-part="fact-label">{weightLabel}</span>
                </li>
                <li>
                  <b data-part="fact-value">{formatMoney(price, currency)}</b>
                  <span data-part="fact-label">{priceLabel}</span>
                </li>
              </ul>
              <p data-part="recipe" aria-live="polite">
                {chosen.length > 0 ? chosen.map((option) => option.name).join(" · ") : nothingLabel}
              </p>
              <button data-part="add" type="button" data-done={done} onClick={add} disabled={chosen.length === 0}>
                {done ? (
                  <>
                    <svg data-part="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

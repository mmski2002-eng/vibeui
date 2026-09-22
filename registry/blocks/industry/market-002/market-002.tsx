"use client"

import { useEffect, useMemo, useState, type CSSProperties } from "react"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Market002Item = {
  name: string
  /** Подпись типа: «Figma», «Notion», «иконки». */
  kind: string
  price: number
  image: string
}

export type Market002Tier = {
  /** От скольких товаров действует скидка. */
  count: number
  percent: number
}

export type Market002Props = {
  eyebrow?: string
  title?: string
  lede?: string
  items?: readonly Market002Item[]
  /** Имена товаров, выбранных изначально. */
  preselected?: readonly string[]
  tiers?: readonly Market002Tier[]
  currency?: string
  panelTitle?: string
  emptyText?: string
  checkoutLabel?: string
  checkoutHref?: string
  /** CustomEvent наружу при каждом изменении набора (detail: count, total, discount). */
  bundleEvent?: string
  /** CustomEvent, который добавляет товар в набор (detail: name, price, kind, image). */
  addEvent?: string
  /** Формы слова «товар», aria кнопок, подписи панели. */
  itemUnits?: readonly [string, string, string]
  removeLabel?: string
  addLabel?: string
  removeShort?: string
  scaleLabel?: string
  nextLine?: string
  maxLine?: string
  subtotalLabel?: string
  discountLabel?: string
  totalLabel?: string
  hideLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Конструктор набора со скидкой: слева список товаров с кнопками «+»,
// справа липкая панель с выбранными, шкалой «скидка растёт» (пороги 2, 3,
// 4 товара → 5, 15, 25 %) — заливка и маркер едут transition'ом, и итогом,
// который пересчитывается. Внизу экрана закреплённая мини-корзина
// (position:fixed) с миниатюрами, процентом и суммой. Блок шлёт
// CustomEvent наружу при каждом изменении (шапка ловит и показывает
// бейдж) и слушает событие «добавить» от витрины.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="market-002"]){
--vibeui-market-002-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-market-002-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-market-002-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-market-002-on-accent:oklch(from var(--vibeui-market-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-market-002-muted:color-mix(in oklab,var(--vibeui-market-002-fg) 58%,var(--vibeui-market-002-bg));
--vibeui-market-002-line:color-mix(in oklab,var(--vibeui-market-002-fg) 12%,transparent);
--vibeui-market-002-soft:color-mix(in oklab,var(--vibeui-market-002-fg) 5%,transparent);
--vibeui-market-002-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-market-002-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-market-002-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="market-002"]{color-scheme:dark}
:where([data-vibeui-block="market-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="market-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="market-002"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-market-002-bg);color:var(--vibeui-market-002-fg);font-family:var(--vibeui-market-002-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="market-002"] *{box-sizing:border-box}
[data-vibeui-block="market-002"] [data-part="shell"]{max-width:86rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="market-002"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-market-002-mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-market-002-muted)}
[data-vibeui-block="market-002"] [data-part="title"]{margin:0;max-width:24ch;font-family:var(--vibeui-market-002-display);font-weight:800;font-size:clamp(2rem,5cqi,3.6rem);line-height:.98;letter-spacing:-.04em}
[data-vibeui-block="market-002"] [data-part="lede"]{margin:.8rem 0 0;max-width:34rem;color:var(--vibeui-market-002-muted)}
[data-vibeui-block="market-002"] [data-part="layout"]{display:grid;gap:2rem;margin:2.5rem 0 0;align-items:start}
[data-vibeui-block="market-002"] [data-part="list"]{margin:0;padding:0;list-style:none;border-top:1px solid var(--vibeui-market-002-line)}
[data-vibeui-block="market-002"] [data-part="row"]{display:grid;grid-template-columns:3.4rem minmax(0,1fr) auto auto;gap:.9rem;align-items:center;padding:.8rem 0;border-bottom:1px solid var(--vibeui-market-002-line);transition:background .2s}
[data-vibeui-block="market-002"] [data-part="row"][data-on="true"]{background:linear-gradient(90deg,color-mix(in oklab,var(--vibeui-market-002-accent) 7%,transparent),transparent)}
[data-vibeui-block="market-002"] [data-part="thumb"]{width:3.4rem;aspect-ratio:4/3;border-radius:.6rem;object-fit:cover;background:var(--vibeui-market-002-soft)}
[data-vibeui-block="market-002"] [data-part="name"]{margin:0;font-family:var(--vibeui-market-002-display);font-weight:700;font-size:1.02rem;letter-spacing:-.02em;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="market-002"] [data-part="kind"]{display:block;margin-top:.15rem;font-family:var(--vibeui-market-002-mono);font-size:.68rem;letter-spacing:.04em;text-transform:uppercase;color:var(--vibeui-market-002-muted)}
[data-vibeui-block="market-002"] [data-part="price"]{font-family:var(--vibeui-market-002-mono);font-size:.88rem;font-weight:500;font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="market-002"] [data-part="toggle"]{position:relative;width:2.4rem;height:2.4rem;border-radius:999px;border:1px solid var(--vibeui-market-002-line);background:transparent;color:var(--vibeui-market-002-fg);cursor:pointer;transition:background .25s,border-color .25s,color .25s,transform .18s}
[data-vibeui-block="market-002"] [data-part="toggle"]:hover{transform:scale(1.06);border-color:var(--vibeui-market-002-fg)}
[data-vibeui-block="market-002"] [data-part="toggle"] svg{position:absolute;inset:0;margin:auto;width:1rem;height:1rem;transition:transform .3s cubic-bezier(.2,.7,.2,1),opacity .2s}
[data-vibeui-block="market-002"] [data-part="toggle"] svg[data-icon="check"]{opacity:0;transform:scale(.4) rotate(-90deg)}
[data-vibeui-block="market-002"] [data-part="toggle"][aria-pressed="true"]{background:var(--vibeui-market-002-accent);border-color:transparent;color:var(--vibeui-market-002-on-accent)}
[data-vibeui-block="market-002"] [data-part="toggle"][aria-pressed="true"] svg[data-icon="plus"]{opacity:0;transform:rotate(90deg) scale(.4)}
[data-vibeui-block="market-002"] [data-part="toggle"][aria-pressed="true"] svg[data-icon="check"]{opacity:1;transform:none}
[data-vibeui-block="market-002"] [data-part="panel"]{display:grid;gap:1.2rem;padding:1.4rem;border-radius:1.4rem;border:1px solid var(--vibeui-market-002-line);background:var(--vibeui-market-002-soft)}
[data-vibeui-block="market-002"] [data-part="panel"] h3{margin:0;display:flex;justify-content:space-between;align-items:baseline;font-family:var(--vibeui-market-002-display);font-weight:700;font-size:1.2rem;letter-spacing:-.02em}
[data-vibeui-block="market-002"] [data-part="panel"] h3 span{font-family:var(--vibeui-market-002-mono);font-weight:400;font-size:.72rem;color:var(--vibeui-market-002-muted)}
[data-vibeui-block="market-002"] [data-part="picked"]{display:flex;flex-wrap:wrap;gap:.4rem;margin:0;padding:0;list-style:none;min-height:2rem}
[data-vibeui-block="market-002"] [data-part="pick"]{display:inline-flex;align-items:center;gap:.4rem;height:2rem;padding:0 .3rem 0 .3rem;border-radius:999px;background:var(--vibeui-market-002-bg);border:1px solid var(--vibeui-market-002-line);font-size:.78rem;font-weight:500;animation:vibeui-market-002-in .3s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="market-002"] [data-part="pick"] img{width:1.5rem;height:1.5rem;border-radius:999px;object-fit:cover}
[data-vibeui-block="market-002"] [data-part="pick"] button{width:1.3rem;height:1.3rem;border:0;border-radius:999px;background:transparent;color:var(--vibeui-market-002-muted);font:inherit;line-height:1;cursor:pointer}
[data-vibeui-block="market-002"] [data-part="pick"] button:hover{background:var(--vibeui-market-002-soft);color:var(--vibeui-market-002-fg)}
[data-vibeui-block="market-002"] [data-part="empty"]{margin:0;font-size:.86rem;color:var(--vibeui-market-002-muted)}
[data-vibeui-block="market-002"] [data-part="scale"]{display:grid;gap:.5rem}
[data-vibeui-block="market-002"] [data-part="scale-head"]{display:flex;justify-content:space-between;align-items:baseline;gap:.6rem;font-size:.84rem}
[data-vibeui-block="market-002"] [data-part="scale-head"] b{font-family:var(--vibeui-market-002-display);font-weight:800;font-size:1.5rem;letter-spacing:-.03em;color:var(--vibeui-market-002-accent);font-variant-numeric:tabular-nums}
[data-vibeui-block="market-002"] [data-part="track"]{position:relative;height:.6rem;border-radius:999px;background:var(--vibeui-market-002-line);overflow:visible}
[data-vibeui-block="market-002"] [data-part="fill"]{position:absolute;left:0;top:0;bottom:0;border-radius:999px;background:linear-gradient(90deg,color-mix(in oklab,var(--vibeui-market-002-accent) 50%,transparent),var(--vibeui-market-002-accent));transform-origin:left;transform:scaleX(var(--vibeui-market-002-fill));transition:transform .6s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="market-002"] [data-part="tick"]{position:absolute;top:50%;width:.9rem;height:.9rem;margin:-.45rem 0 0 -.45rem;border-radius:999px;background:var(--vibeui-market-002-bg);border:2px solid var(--vibeui-market-002-line);transition:border-color .3s,background .3s}
[data-vibeui-block="market-002"] [data-part="tick"][data-on="true"]{border-color:var(--vibeui-market-002-accent);background:var(--vibeui-market-002-accent)}
[data-vibeui-block="market-002"] [data-part="tick"] span{position:absolute;top:1.1rem;left:50%;transform:translateX(-50%);font-family:var(--vibeui-market-002-mono);font-size:.66rem;color:var(--vibeui-market-002-muted);white-space:nowrap}
[data-vibeui-block="market-002"] [data-part="tick"][data-on="true"] span{color:var(--vibeui-market-002-fg)}
[data-vibeui-block="market-002"] [data-part="tick"][data-last] span{left:auto;right:0;transform:none}
[data-vibeui-block="market-002"] [data-part="hint"]{margin:1.7rem 0 0;font-size:.8rem;color:var(--vibeui-market-002-muted)}
[data-vibeui-block="market-002"] [data-part="totals"]{display:grid;gap:.3rem;padding-top:1rem;border-top:1px dashed var(--vibeui-market-002-line);font-size:.9rem}
[data-vibeui-block="market-002"] [data-part="totals"] div{display:flex;justify-content:space-between;gap:1rem}
[data-vibeui-block="market-002"] [data-part="totals"] span:last-child{font-family:var(--vibeui-market-002-mono);font-variant-numeric:tabular-nums}
[data-vibeui-block="market-002"] [data-part="totals"] [data-part="was"] span:last-child{text-decoration:line-through;color:var(--vibeui-market-002-muted)}
[data-vibeui-block="market-002"] [data-part="totals"] [data-part="save"] span:last-child{color:var(--vibeui-market-002-accent)}
[data-vibeui-block="market-002"] [data-part="total"]{align-items:baseline;margin-top:.4rem}
[data-vibeui-block="market-002"] [data-part="total"] span:last-child{font-family:var(--vibeui-market-002-display);font-weight:800;font-size:1.9rem;letter-spacing:-.03em;line-height:1;animation:vibeui-market-002-pop .4s cubic-bezier(.2,1.2,.4,1)}
[data-vibeui-block="market-002"] [data-part="mini"]{position:fixed;left:50%;bottom:1rem;z-index:60;display:flex;align-items:center;gap:.8rem;width:max-content;max-width:calc(100vw - 2rem);padding:.5rem .5rem .5rem .7rem;border-radius:999px;background:var(--vibeui-market-002-fg);color:var(--vibeui-market-002-bg);box-shadow:0 20px 50px -20px rgb(0 0 0 / .6);transform:translate(-50%,0);transition:transform .45s cubic-bezier(.2,.8,.2,1),opacity .3s}
[data-vibeui-block="market-002"] [data-part="mini"][data-hidden="true"]{transform:translate(-50%,140%);opacity:0;pointer-events:none}
[data-vibeui-block="market-002"] [data-part="mini-thumbs"]{display:flex}
[data-vibeui-block="market-002"] [data-part="mini-thumbs"] img{width:1.8rem;height:1.8rem;border-radius:999px;object-fit:cover;border:2px solid var(--vibeui-market-002-fg);margin-left:-.5rem}
[data-vibeui-block="market-002"] [data-part="mini-thumbs"] img:first-child{margin-left:0}
[data-vibeui-block="market-002"] [data-part="mini-text"]{display:flex;align-items:baseline;gap:.5rem;font-size:.84rem;white-space:nowrap}
[data-vibeui-block="market-002"] [data-part="mini-text"] span{display:none}
[data-vibeui-block="market-002"] [data-part="mini-text"] b{font-family:var(--vibeui-market-002-mono);font-weight:500;font-variant-numeric:tabular-nums}
[data-vibeui-block="market-002"] [data-part="mini-text"] em{font-style:normal;padding:.1rem .45rem;border-radius:999px;background:var(--vibeui-market-002-accent);color:var(--vibeui-market-002-on-accent);font-family:var(--vibeui-market-002-mono);font-size:.7rem}
[data-vibeui-block="market-002"] [data-part="mini-go"]{display:inline-flex;align-items:center;height:2.2rem;padding:0 1rem;border-radius:999px;background:var(--vibeui-market-002-bg);color:var(--vibeui-market-002-fg);font-size:.84rem;font-weight:600;text-decoration:none;white-space:nowrap}
[data-vibeui-block="market-002"] [data-part="mini-close"]{width:1.8rem;height:1.8rem;border:0;border-radius:999px;background:transparent;color:inherit;font:inherit;font-size:1rem;line-height:1;cursor:pointer;opacity:.6}
[data-vibeui-block="market-002"] [data-part="mini-close"]:hover{opacity:1}
[data-vibeui-block="market-002"] button:focus-visible,[data-vibeui-block="market-002"] a:focus-visible{outline:2px solid var(--vibeui-market-002-accent);outline-offset:2px}
@keyframes vibeui-market-002-in{from{opacity:0;transform:scale(.8)}}
@keyframes vibeui-market-002-pop{0%{transform:scale(.9)}50%{transform:scale(1.08)}100%{transform:scale(1)}}
@container (min-width: 40rem){[data-vibeui-block="market-002"] [data-part="mini-text"] span{display:inline}}
@container (min-width: 56rem){[data-vibeui-block="market-002"] [data-part="layout"]{grid-template-columns:minmax(0,1fr) 22rem;gap:3rem}[data-vibeui-block="market-002"] [data-part="panel"]{position:sticky;top:5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="market-002"] *{animation:none!important;transition:none!important}}`

const DEFAULT_ITEMS: Market002Item[] = [
  { name: "Атлас — UI-кит", kind: "Figma", price: 2490, image: "/demo/market/cover-01.webp" },
  { name: "Рутина — второй мозг", kind: "Notion", price: 990, image: "/demo/market/cover-02.webp" },
  { name: "Грань — 480 иконок", kind: "Иконки", price: 1490, image: "/demo/market/cover-03.webp" },
  { name: "Нарва Grotesk", kind: "Шрифт", price: 3900, image: "/demo/market/cover-04.webp" },
  { name: "Дашборд Про", kind: "Figma", price: 3200, image: "/demo/market/cover-05.webp" },
  { name: "Спринт — трекер продукта", kind: "Notion", price: 1290, image: "/demo/market/cover-06.webp" },
]

const DEFAULT_TIERS: Market002Tier[] = [
  { count: 2, percent: 5 },
  { count: 3, percent: 15 },
  { count: 4, percent: 25 },
]

function formatMoney(value: number, currency: string) {
  return `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${currency}`
}

function plural(count: number, forms: readonly [string, string, string]) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1]
  return forms[2]
}

/** Конструктор набора со шкалой растущей скидки и закреплённой мини-корзиной. */
export function Market002({
  eyebrow = "набор со скидкой",
  title = "Собери набор — скидка растёт с каждым товаром",
  lede = "Два товара — минус 5 %, три — минус 15 %, четыре и больше — минус 25 %. Скидка считается от полной цены, лицензия — любая.",
  items = DEFAULT_ITEMS,
  preselected = ["Атлас — UI-кит", "Грань — 480 иконок"],
  tiers = DEFAULT_TIERS,
  currency = "₽",
  panelTitle = "Ваш набор",
  emptyText = "Пока пусто. Нажмите «+» у товара или «В набор» в витрине.",
  checkoutLabel = "Оформить набор",
  checkoutHref = "#checkout",
  bundleEvent = "vibeui-market:bundle",
  addEvent = "vibeui-market:add",
  itemUnits = ["товар", "товара", "товаров"],
  removeLabel = "Убрать «{name}» из набора",
  addLabel = "Добавить «{name}» в набор",
  removeShort = "Убрать «{name}»",
  scaleLabel = "Скидка растёт",
  nextLine = "Ещё {n} {items} — и скидка {percent} %",
  maxLine = "Максимальная скидка. Можно добавлять ещё.",
  subtotalLabel = "Без скидки",
  discountLabel = "Скидка",
  totalLabel = "Итого",
  hideLabel = "Скрыть мини-корзину",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Market002Props) {
  const [selected, setSelected] = useState<Market002Item[]>(() => preselected.map((name) => items.find((item) => item.name === name)).filter((item): item is Market002Item => Boolean(item)))
  const [dismissed, setDismissed] = useState(false)

  const sortedTiers = useMemo(() => [...tiers].sort((a, b) => a.count - b.count), [tiers])
  const count = selected.length
  const percent = sortedTiers.reduce((best, tier) => (count >= tier.count ? tier.percent : best), 0)
  const subtotal = selected.reduce((sum, item) => sum + item.price, 0)
  const discount = Math.round((subtotal * percent) / 100)
  const total = subtotal - discount
  const maxCount = sortedTiers[sortedTiers.length - 1]?.count ?? 4
  const fill = Math.min(1, count / maxCount)
  const nextTier = sortedTiers.find((tier) => tier.count > count)

  useEffect(() => {
    if (!bundleEvent) return
    window.dispatchEvent(new CustomEvent(bundleEvent, { detail: { count, total, discount: percent } }))
  }, [bundleEvent, count, total, percent])

  useEffect(() => {
    if (!addEvent) return
    const onAdd = (event: Event) => {
      const detail = (event as CustomEvent<Partial<Market002Item>>).detail
      if (!detail?.name) return
      const known = items.find((item) => item.name === detail.name)
      const next: Market002Item = known ?? { name: detail.name, kind: detail.kind ?? "", price: Number(detail.price ?? 0), image: detail.image ?? "" }
      setSelected((current) => (current.some((item) => item.name === next.name) ? current : [...current, next]))
      setDismissed(false)
    }
    window.addEventListener(addEvent, onAdd)
    return () => window.removeEventListener(addEvent, onAdd)
  }, [addEvent, items])

  const toggle = (item: Market002Item) => {
    setSelected((current) => (current.some((entry) => entry.name === item.name) ? current.filter((entry) => entry.name !== item.name) : [...current, item]))
    setDismissed(false)
  }

  const extras = selected.filter((item) => !items.some((entry) => entry.name === item.name))
  const list = [...items, ...extras]

  const palette = {
    ...(accent ? { "--vibeui-market-002-accent": accent } : null),
    ...(ink ? { "--vibeui-market-002-fg": ink } : null),
    ...(background ? { "--vibeui-market-002-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-market-002" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="market-002" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="layout">
            <ul data-part="list">
              {list.map((item) => {
                const on = selected.some((entry) => entry.name === item.name)
                return (
                  <li key={item.name} data-part="row" data-on={on}>
                    <img data-part="thumb" src={item.image} alt="" loading="lazy" />
                    <div>
                      <h3 data-part="name">{item.name}</h3>
                      <span data-part="kind">{item.kind}</span>
                    </div>
                    <span data-part="price">{formatMoney(item.price, currency)}</span>
                    <button data-part="toggle" type="button" aria-pressed={on} aria-label={on ? removeLabel.replace("{name}", item.name) : addLabel.replace("{name}", item.name)} onClick={() => toggle(item)}>
                      <svg data-icon="plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      <svg data-icon="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m5 12 5 5 9-10" />
                      </svg>
                    </button>
                  </li>
                )
              })}
            </ul>
            <aside data-part="panel" aria-live="polite">
              <h3>
                {panelTitle}
                <span>
                  {count} {plural(count, itemUnits)}
                </span>
              </h3>
              {count === 0 ? (
                <p data-part="empty">{emptyText}</p>
              ) : (
                <ul data-part="picked">
                  {selected.map((item) => (
                    <li key={item.name} data-part="pick">
                      <img src={item.image} alt="" />
                      {item.name}
                      <button type="button" aria-label={removeShort.replace("{name}", item.name)} onClick={() => toggle(item)}>
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div data-part="scale">
                <div data-part="scale-head">
                  <span>{scaleLabel}</span>
                  <b>−{percent} %</b>
                </div>
                <div data-part="track" style={{ ["--vibeui-market-002-fill" as string]: fill }}>
                  <div data-part="fill" />
                  {sortedTiers.map((tier) => (
                    <span key={tier.count} data-part="tick" data-on={count >= tier.count} data-last={tier.count === maxCount ? "" : undefined} style={{ left: `${Math.min(100, (tier.count / maxCount) * 100)}%` }}>
                      <span>
                        {tier.count} → {tier.percent} %
                      </span>
                    </span>
                  ))}
                </div>
                <p data-part="hint">{nextTier ? nextLine.replace("{n}", String(nextTier.count - count)).replace("{items}", plural(nextTier.count - count, itemUnits)).replace("{percent}", String(nextTier.percent)) : maxLine}</p>
              </div>
              <div data-part="totals">
                <div data-part="was">
                  <span>{subtotalLabel}</span>
                  <span>{formatMoney(subtotal, currency)}</span>
                </div>
                <div data-part="save">
                  <span>{discountLabel}</span>
                  <span>−{formatMoney(discount, currency)}</span>
                </div>
                <div data-part="total">
                  <span>{totalLabel}</span>
                  <span key={total}>{formatMoney(total, currency)}</span>
                </div>
              </div>
              <Button016
                data-part="checkout"
                aria-disabled={count === 0}
                label={checkoutLabel}
                href={checkoutHref}
                external={false}
                size="lg"
                tone="accent"
                accent={accent}
              />
            </aside>
          </div>
        </div>
        <div data-part="mini" data-hidden={count === 0 || dismissed} aria-hidden={count === 0 || dismissed}>
          <div data-part="mini-thumbs">
            {selected.slice(0, 4).map((item) => (
              <img key={item.name} src={item.image} alt="" />
            ))}
          </div>
          <div data-part="mini-text">
            <span>
              {count} {plural(count, itemUnits)}
            </span>
            {percent > 0 ? <em>−{percent} %</em> : null}
            <b>{formatMoney(total, currency)}</b>
          </div>
          <a data-part="mini-go" href={checkoutHref} tabIndex={count === 0 || dismissed ? -1 : 0}>
            {checkoutLabel}
          </a>
          <button data-part="mini-close" type="button" aria-label={hideLabel} tabIndex={count === 0 || dismissed ? -1 : 0} onClick={() => setDismissed(true)}>
            ×
          </button>
        </div>
      </section>
    </>
  )
}

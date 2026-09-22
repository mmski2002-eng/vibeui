"use client"

import { useMemo, useState, type CSSProperties } from "react"
import { Card086 } from "@/registry/components/card/card-086/card-086"

export type Flowers002Flower = {
  name: string
  /** Цена за стебель. */
  price: number
  /** Сколько дней стоит в вазе. */
  days: number
  /** Цвет бутона. Пусто — акцент блока. */
  color?: string
  kind?: "peony" | "poppy" | "daisy" | "leaf" | "spike"
  /** Сколько стеблей положить по умолчанию. */
  initial?: number
  /** Фото стебля во всю высоту (PNG без фона, срез внизу). Есть у всех цветов — букет из фото. */
  image?: string
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
  /** Фото пустой вазы (PNG без фона), стоит перед стеблями. */
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

// Конструктор букета: слева ваза, справа цветы-чипы с кнопками «+ / −».
// Каждый добавленный стебель — фото (PNG без фона) — вырастает из
// горлышка вазы, стебли раскладываются веером и плавно перестраиваются,
// когда состав меняется (rotate через transition), ваза-фото стоит
// спереди. Без фото — SVG-стебли и рисованная ваза. Цена, срок сборки и
// «этот букет живёт N дней» считаются на лету: букет живёт столько,
// сколько его самый недолгий цветок. Кнопка «заказать» отправляет состав
// в форму через CustomEvent и прокручивает к ней.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Golos+Text:wght@400;500;600&family=Caveat:wght@500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="flowers-002"]){
--vibeui-flowers-002-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-flowers-002-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-flowers-002-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-flowers-002-on-accent:oklch(from var(--vibeui-flowers-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-flowers-002-muted:color-mix(in oklab,var(--vibeui-flowers-002-fg) 62%,var(--vibeui-flowers-002-bg));
--vibeui-flowers-002-line:color-mix(in oklab,var(--vibeui-flowers-002-fg) 16%,transparent);
--vibeui-flowers-002-paper:color-mix(in oklab,var(--vibeui-flowers-002-fg) 5%,var(--vibeui-flowers-002-bg));
--vibeui-flowers-002-display:"Cormorant",Georgia,"Times New Roman",serif;
--vibeui-flowers-002-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-flowers-002-hand:"Caveat","Segoe Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="flowers-002"]{color-scheme:dark}
:where([data-vibeui-block="flowers-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="flowers-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="flowers-002"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-flowers-002-bg);color:var(--vibeui-flowers-002-fg);font-family:var(--vibeui-flowers-002-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="flowers-002"] *{box-sizing:border-box}
[data-vibeui-block="flowers-002"] [data-part="shell"]{max-width:84rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="flowers-002"] [data-part="head"]{max-width:40rem;margin:0 0 2.5rem}
[data-vibeui-block="flowers-002"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.74rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-flowers-002-muted)}
[data-vibeui-block="flowers-002"] [data-part="title"]{margin:0;font-family:var(--vibeui-flowers-002-display);font-weight:500;font-size:clamp(2.2rem,5.4cqi,4.2rem);line-height:1;letter-spacing:-.02em}
[data-vibeui-block="flowers-002"] [data-part="lede"]{margin:.8rem 0 0;color:var(--vibeui-flowers-002-muted)}
[data-vibeui-block="flowers-002"] [data-part="grid"]{display:grid;gap:2rem;align-items:start}
[data-vibeui-block="flowers-002"] [data-part="stage"]{position:relative;border-radius:1.2rem;background:var(--vibeui-flowers-002-paper);border:1px solid var(--vibeui-flowers-002-line);padding:1rem;overflow:hidden}
[data-vibeui-block="flowers-002"] [data-part="vase"]{display:block;width:100%;max-width:26rem;margin:0 auto;aspect-ratio:8/9;overflow:visible}
[data-vibeui-block="flowers-002"] [data-part="glass"]{fill:var(--vibeui-flowers-002-bg);stroke:var(--vibeui-flowers-002-fg);stroke-width:2;stroke-linejoin:round}
[data-vibeui-block="flowers-002"] [data-part="stem"]{transform:rotate(var(--vibeui-flowers-002-a));transform-origin:160px 272px;transform-box:view-box;transition:transform .6s cubic-bezier(.2,.7,.2,1);animation:vibeui-flowers-002-grow .7s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="flowers-002"] [data-part="stalk"]{fill:none;stroke:var(--vibeui-flowers-002-fg);stroke-width:2;stroke-linecap:round;stroke-dasharray:var(--vibeui-flowers-002-l) 400;transition:stroke-dasharray .6s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="flowers-002"] [data-part="sprig"]{fill:color-mix(in oklab,var(--vibeui-flowers-002-fg) 12%,var(--vibeui-flowers-002-bg));stroke:var(--vibeui-flowers-002-fg);stroke-width:1.2;transform:translateY(calc(var(--vibeui-flowers-002-l) * -.5px));transition:transform .6s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="flowers-002"] [data-part="bloom"]{transform:translateY(calc(var(--vibeui-flowers-002-l) * -1px));transition:transform .6s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="flowers-002"] [data-part="empty"]{position:absolute;left:50%;top:38%;transform:translate(-50%,-50%) rotate(-4deg);max-width:14rem;text-align:center;font-family:var(--vibeui-flowers-002-hand);font-size:1.5rem;line-height:1.05;color:var(--vibeui-flowers-002-accent);pointer-events:none}
[data-vibeui-block="flowers-002"] [data-part="life"]{position:absolute;right:1rem;bottom:1rem;font-family:var(--vibeui-flowers-002-hand);font-size:1.45rem;line-height:1;color:var(--vibeui-flowers-002-accent);transform:rotate(-3deg)}
[data-vibeui-block="flowers-002"] [data-part="chips"]{margin:0;padding:0;list-style:none;display:grid;gap:.6rem}
[data-vibeui-block="flowers-002"] [data-part="sum"]{margin:1.4rem 0 0;padding:1.4rem;border-radius:1.2rem;background:var(--vibeui-flowers-002-fg);color:var(--vibeui-flowers-002-bg);display:grid;gap:1rem}
[data-vibeui-block="flowers-002"] [data-part="sum"] dl{margin:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}
[data-vibeui-block="flowers-002"] [data-part="sum"] dt{font-size:.74rem;letter-spacing:.06em;text-transform:uppercase;opacity:.65}
[data-vibeui-block="flowers-002"] [data-part="sum"] dd{margin:.2rem 0 0;font-family:var(--vibeui-flowers-002-display);font-weight:600;font-size:1.7rem;line-height:1;font-variant-numeric:tabular-nums;letter-spacing:-.02em}
[data-vibeui-block="flowers-002"] [data-part="sum"] dd small{font-family:var(--vibeui-flowers-002-font);font-size:.78rem;font-weight:400;opacity:.7;letter-spacing:0}
[data-vibeui-block="flowers-002"] [data-part="order"]{display:inline-flex;justify-content:center;align-items:center;gap:.5rem;padding:.95rem 1.4rem;border-radius:999px;border:0;background:var(--vibeui-flowers-002-accent);color:var(--vibeui-flowers-002-on-accent);font:inherit;font-weight:500;cursor:pointer;transition:transform .2s,box-shadow .25s,opacity .2s}
[data-vibeui-block="flowers-002"] [data-part="order"]:hover{transform:translateY(-2px);box-shadow:0 14px 30px -14px var(--vibeui-flowers-002-accent)}
[data-vibeui-block="flowers-002"] [data-part="order"]:disabled{opacity:.45;cursor:default;transform:none;box-shadow:none}
[data-vibeui-block="flowers-002"] [data-part="wrap"]{margin:0;font-size:.8rem;opacity:.7}
[data-vibeui-block="flowers-002"] button:focus-visible{outline:2px solid var(--vibeui-flowers-002-accent);outline-offset:3px}
[data-vibeui-block="flowers-002"] [data-part="bunch"]{position:relative;width:100%;max-width:26rem;margin:0 auto;aspect-ratio:8/9;container-type:size}
[data-vibeui-block="flowers-002"] [data-part="photo"]{position:absolute;left:50%;bottom:14cqh;width:26cqw;height:78cqh;margin-left:-13cqw;object-fit:contain;object-position:50% 100%;transform-origin:50% 100%;transform:rotate(var(--vibeui-flowers-002-a)) scale(calc(1 - var(--vibeui-flowers-002-lift) / 100));transition:transform .6s cubic-bezier(.2,.7,.2,1);animation:vibeui-flowers-002-sprout .7s cubic-bezier(.2,.7,.2,1);filter:drop-shadow(0 6px 6px rgb(0 0 0 / .18))}
[data-vibeui-block="flowers-002"] [data-part="jar"]{position:absolute;left:50%;bottom:0;width:44cqw;height:44cqh;margin-left:-22cqw;object-fit:contain;object-position:50% 100%;z-index:20;filter:drop-shadow(0 14px 14px rgb(0 0 0 / .18))}
@keyframes vibeui-flowers-002-sprout{from{opacity:0;transform:rotate(var(--vibeui-flowers-002-a)) scale(.3)}to{opacity:1;transform:rotate(var(--vibeui-flowers-002-a)) scale(calc(1 - var(--vibeui-flowers-002-lift) / 100))}}
@keyframes vibeui-flowers-002-grow{from{opacity:0;transform:rotate(var(--vibeui-flowers-002-a)) scale(.2)}to{opacity:1;transform:rotate(var(--vibeui-flowers-002-a)) scale(1)}}
@container (min-width: 40rem){[data-vibeui-block="flowers-002"] [data-part="chips"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 60rem){[data-vibeui-block="flowers-002"] [data-part="grid"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:3rem}[data-vibeui-block="flowers-002"] [data-part="stage"]{position:sticky;top:5.5rem;padding:1.5rem}[data-vibeui-block="flowers-002"] [data-part="chips"]{grid-template-columns:1fr}}
@container (min-width: 76rem){[data-vibeui-block="flowers-002"] [data-part="chips"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="flowers-002"] *{animation:none!important;transition:none!important}}`

const DEFAULT_FLOWERS: Flowers002Flower[] = [
  { name: "Пион", price: 390, days: 6, color: "#e9a3b6", kind: "peony", initial: 3, image: "/demo/flowers/stem-peony.png" },
  { name: "Мак", price: 190, days: 4, color: "#c2361d", kind: "poppy", initial: 2, image: "/demo/flowers/stem-poppy.png" },
  { name: "Ромашка", price: 120, days: 8, color: "#fbf6ea", kind: "daisy", image: "/demo/flowers/stem-chamomile.png" },
  { name: "Ранункулюс", price: 260, days: 7, color: "#f0b04c", kind: "peony", image: "/demo/flowers/stem-ranunculus.png" },
  { name: "Лаванда", price: 140, days: 10, color: "#8b7bb5", kind: "spike", initial: 2, image: "/demo/flowers/stem-lavender.png" },
  { name: "Эвкалипт", price: 160, days: 14, color: "#7f9a7a", kind: "leaf", image: "/demo/flowers/stem-eucalyptus.png" },
]

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

function Bloom({ kind, color }: { kind: Flowers002Flower["kind"]; color: string }) {
  if (kind === "poppy") {
    return (
      <g>
        {[0, 45, 90, 135].map((angle) => (
          <ellipse key={angle} rx={17} ry={11} transform={`rotate(${angle})`} fill={color} opacity={0.92} />
        ))}
        <circle r={4} fill="var(--vibeui-flowers-002-fg)" />
      </g>
    )
  }
  if (kind === "daisy") {
    return (
      <g>
        {Array.from({ length: 11 }, (_, index) => (
          <ellipse key={index} cx={9} rx={8} ry={2.6} transform={`rotate(${index * (360 / 11)})`} fill={color} stroke="var(--vibeui-flowers-002-fg)" strokeWidth={0.8} />
        ))}
        <circle r={4.5} fill="#e5b640" stroke="var(--vibeui-flowers-002-fg)" strokeWidth={0.8} />
      </g>
    )
  }
  if (kind === "leaf") {
    return (
      <g fill={color} stroke="var(--vibeui-flowers-002-fg)" strokeWidth={0.9}>
        <circle cx={-9} cy={4} r={6} />
        <circle cx={9} cy={-2} r={6.5} />
        <circle cx={-7} cy={-14} r={5.5} />
        <circle cx={8} cy={-18} r={5} />
        <circle cx={0} cy={-28} r={4.5} />
      </g>
    )
  }
  if (kind === "spike") {
    return (
      <g fill={color}>
        {Array.from({ length: 7 }, (_, index) => (
          <ellipse key={index} cx={index % 2 ? 4 : -4} cy={-index * 6} rx={4} ry={3} />
        ))}
        <ellipse cx={0} cy={-42} rx={3} ry={4} />
      </g>
    )
  }
  return (
    <g>
      {[
        { count: 8, radius: 22, opacity: 0.55 },
        { count: 6, radius: 15, opacity: 0.8 },
        { count: 4, radius: 8, opacity: 1 },
      ].map((ring, ringIndex) =>
        Array.from({ length: ring.count }, (_, index) => (
          <ellipse key={`${ringIndex}-${index}`} cx={ring.radius * 0.5} rx={ring.radius * 0.55} ry={ring.radius * 0.36} transform={`rotate(${(360 / ring.count) * index + ringIndex * 20})`} fill={color} opacity={ring.opacity} stroke="var(--vibeui-flowers-002-bg)" strokeWidth={0.8} />
        )),
      )}
    </g>
  )
}

/** Конструктор букета: стебли растут в вазе, цена и срок считаются. */
export function Flowers002({
  eyebrow = "Собрать свой",
  title = "Букет по вашему рецепту",
  lede = "Добавляйте стебли — они встанут в вазу. Мы подскажем цену, сколько будем собирать и сколько букет простоит.",
  flowers = DEFAULT_FLOWERS,
  wrapPrice = 300,
  wrapLabel = "бумага, лента и открытка",
  maxStems = 24,
  vaseImage = "/demo/flowers/vase.png",
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
  const [counts, setCounts] = useState<Record<string, number>>(() => Object.fromEntries(flowers.map((flower) => [flower.name, flower.initial ?? 0])))

  const stems = useMemo(() => flowers.flatMap((flower, flowerIndex) => Array.from({ length: counts[flower.name] ?? 0 }, (_, index) => ({ flower, flowerIndex, key: `${flower.name}-${index}` }))), [flowers, counts])
  const total = stems.length
  const photos = Boolean(vaseImage) && flowers.every((flower) => flower.image)
  const chosen = flowers.filter((flower) => (counts[flower.name] ?? 0) > 0)
  const price = chosen.reduce((sum, flower) => sum + flower.price * (counts[flower.name] ?? 0), 0) + (total > 0 ? wrapPrice : 0)
  const life = chosen.length ? Math.min(...chosen.map((flower) => flower.days)) : 0
  const assembly = total === 0 ? "—" : total <= 6 ? assemblyLabels[0] : total <= 14 ? assemblyLabels[1] : assemblyLabels[2]

  const change = (name: string, delta: number) => {
    setCounts((current) => {
      const next = Math.max(0, (current[name] ?? 0) + delta)
      if (delta > 0 && total >= maxStems) return current
      return { ...current, [name]: next }
    })
  }

  const order = () => {
    const detail = {
      items: chosen.map((flower) => ({ name: flower.name, count: counts[flower.name] ?? 0, price: flower.price })),
      stems: total,
      price,
      days: life,
    }
    window.dispatchEvent(new CustomEvent(eventName, { detail }))
    if (formHref.startsWith("#")) {
      document.querySelector(formHref)?.scrollIntoView({ behavior: "smooth", block: "start" })
    } else {
      window.location.assign(formHref)
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-flowers-002-accent": accent } : null),
    ...(ink ? { "--vibeui-flowers-002-fg": ink } : null),
    ...(background ? { "--vibeui-flowers-002-bg": background } : null),
    ...style,
  } as CSSProperties

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
            <div data-part="stage">
              {photos ? (
                <div data-part="bunch" aria-hidden="true">
                  {stems.map((stem, index) => {
                    const angle = total === 1 ? 0 : -26 + (52 * (index + 0.5)) / total
                    const lift = (index % 3) * 5 + ((index * 7) % 11)
                    return <img key={stem.key} data-part="photo" src={stem.flower.image} alt="" style={{ ["--vibeui-flowers-002-a" as string]: `${angle.toFixed(1)}deg`, ["--vibeui-flowers-002-lift" as string]: `${lift}%`, zIndex: 10 + (index % 5) }} />
                  })}
                  <img data-part="jar" src={vaseImage} alt="" />
                </div>
              ) : (
              <svg data-part="vase" viewBox="0 0 320 360" aria-hidden="true">
                {stems.map((stem, index) => {
                  const angle = total === 1 ? 0 : -52 + (104 * (index + 0.5)) / total
                  const length = 150 - (index % 3) * 26 + ((index * 7) % 13)
                  const color = stem.flower.color ?? "var(--vibeui-flowers-002-accent)"
                  return (
                    <g key={stem.key} data-part="stem" style={{ ["--vibeui-flowers-002-a" as string]: `${angle}deg`, ["--vibeui-flowers-002-l" as string]: length }}>
                      <path data-part="stalk" d="M160 272V40" />
                      <path data-part="sprig" transform="translate(160 272)" d="M0 0c-9-3-15-13-11-24 9 4 15 14 11 24Z" />
                      <g transform="translate(160 272)">
                        <g data-part="bloom">
                          <Bloom kind={stem.flower.kind} color={color} />
                        </g>
                      </g>
                    </g>
                  )
                })}
                <path data-part="glass" d="M124 268h72c0 18 18 32 18 54 0 18-10 26-20 28h-68c-10-2-20-10-20-28 0-22 18-36 18-54Z" />
                <path d="M136 284c14 5 34 5 48 0" fill="none" stroke="var(--vibeui-flowers-002-fg)" strokeWidth={1.2} opacity={0.5} />
              </svg>
              )}
              {total === 0 ? <p data-part="empty">{emptyLine}</p> : null}
              {life > 0 ? (
                <p data-part="life" aria-live="polite">
                  {lifeLine.replace("{n}", String(life)).replace("{days}", daysWord(life, dayUnits))}
                </p>
              ) : null}
            </div>
            <div>
              <ul data-part="chips">
                {flowers.map((flower) => {
                  const count = counts[flower.name] ?? 0
                  return (
                    <Card086 key={flower.name} data-part="chip" name={flower.name} color={flower.color} price={flower.price} days={flower.days} stemLine={stemLine} currency={currency} dayUnits={dayUnits} removeLabel={removeLabel} maxStems={maxStems} addLabel={addLabel} count={count} total={total} change={change} accent={accent} />
                  )
                })}
              </ul>
              <div data-part="sum" aria-live="polite">
                <dl>
                  <div>
                    <dt>{stemsLabel}</dt>
                    <dd>
                      {total}
                      <small> / {maxStems}</small>
                    </dd>
                  </div>
                  <div>
                    <dt>{assemblyLabel}</dt>
                    <dd>{assembly}</dd>
                  </div>
                  <div>
                    <dt>{priceLabel}</dt>
                    <dd>{formatMoney(price, currency)}</dd>
                  </div>
                </dl>
                <p data-part="wrap">
                  {wrapLine.replace("{wrap}", wrapLabel).replace("{price}", `${wrapPrice} ${currency}`)}
                </p>
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

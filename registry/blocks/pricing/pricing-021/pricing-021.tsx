"use client"

import { useState, type CSSProperties } from "react"

export type Pricing021Ticket = {
  name: string
  /** «на один день», «на все три дня». */
  text?: string
  price: number
  /** Цена по предпродаже — зачёркнутая старая цена. */
  oldPrice?: number
  /** Цвет карточки. */
  color: string
  ink?: string
  features: readonly string[]
  featured?: boolean
  /** «Осталось 120». */
  note?: string
  actionLabel?: string
  actionHref?: string
}

export type Pricing021Props = {
  eyebrow?: string
  title?: string
  lede?: string
  tickets?: readonly Pricing021Ticket[]
  /** Счётчик билетов: цена умножается на количество. */
  counter?: boolean
  counterLabel?: string
  maxCount?: number
  freeNote?: string
  currency?: string
  /** aria счётчика билетов. */
  lessLabel?: string
  moreLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Билеты фестиваля: три карточки, каждая своего цвета, цена гигантом,
// список того, что входит, кнопка-пилюля. Счётчик «сколько билетов»
// умножает цены во всех карточках, число перелистывается. Выделенный
// тариф чуть больше и с тёмной кнопкой. Внизу строка про бесплатные зоны.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="pricing-021"]){
--vibeui-pricing-021-bg:light-dark(#ffffff,#0e0f12);
--vibeui-pricing-021-fg:light-dark(#111111,#f4f4f5);
--vibeui-pricing-021-muted:light-dark(#6b6b70,#a1a1aa);
--vibeui-pricing-021-line:light-dark(#e8e8ea,#26272d);
--vibeui-pricing-021-chip:light-dark(#f1f1f3,#1f2026);
--vibeui-pricing-021-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-pricing-021-on-accent:oklch(from var(--vibeui-pricing-021-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-pricing-021-display:"Inter Tight","Inter",ui-sans-serif,system-ui,sans-serif;
--vibeui-pricing-021-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-021"]{color-scheme:dark}
:where([data-vibeui-block="pricing-021"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="pricing-021"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="pricing-021"]{box-sizing:border-box;display:block;background:var(--vibeui-pricing-021-bg);color:var(--vibeui-pricing-021-fg);font-family:var(--vibeui-pricing-021-font);font-size:1rem;line-height:1.4}
[data-vibeui-block="pricing-021"] *{box-sizing:border-box}
[data-vibeui-block="pricing-021"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:2rem 1.25rem 3rem}
[data-vibeui-block="pricing-021"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;padding-top:1.25rem;border-top:1px solid var(--vibeui-pricing-021-line)}
[data-vibeui-block="pricing-021"] [data-part="eyebrow"]{margin:0;font-size:1.05rem}
[data-vibeui-block="pricing-021"] [data-part="title"]{margin:.5rem 0 0;font-family:var(--vibeui-pricing-021-display);font-size:clamp(1.6rem,3.4cqi,2.4rem);font-weight:600;letter-spacing:-.03em;line-height:1.1}
[data-vibeui-block="pricing-021"] [data-part="lede"]{margin:.5rem 0 1.5rem;max-width:36rem;color:var(--vibeui-pricing-021-muted)}
[data-vibeui-block="pricing-021"] [data-part="counter"]{display:inline-flex;align-items:center;gap:.75rem;padding:.35rem .35rem .35rem 1rem;border-radius:999px;background:var(--vibeui-pricing-021-chip);font-size:.95rem;font-weight:500}
[data-vibeui-block="pricing-021"] [data-part="counter"] button{width:2.2rem;height:2.2rem;border-radius:50%;border:0;background:var(--vibeui-pricing-021-bg);color:inherit;font:inherit;font-size:1.2rem;line-height:1;cursor:pointer;transition:transform .2s}
[data-vibeui-block="pricing-021"] [data-part="counter"] button:hover{transform:scale(1.08)}
[data-vibeui-block="pricing-021"] [data-part="counter"] button:disabled{opacity:.35;cursor:default;transform:none}
[data-vibeui-block="pricing-021"] [data-part="counter"] button:focus-visible,[data-vibeui-block="pricing-021"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-pricing-021-fg);outline-offset:3px}
[data-vibeui-block="pricing-021"] [data-part="count"]{min-width:1.5rem;text-align:center;font-family:var(--vibeui-pricing-021-display);font-size:1.15rem;font-weight:600;font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-021"] [data-part="grid"]{display:grid;gap:1rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="pricing-021"] [data-part="ticket"]{display:flex;flex-direction:column;gap:1.25rem;padding:1.5rem;border-radius:1.5rem;background:var(--vibeui-pricing-021-color);color:var(--vibeui-pricing-021-ink,#111);transition:transform .35s cubic-bezier(.2,.9,.3,1.3),box-shadow .35s}
[data-vibeui-block="pricing-021"] [data-part="ticket"]:hover{transform:translateY(-5px) rotate(-.5deg);box-shadow:0 30px 50px -30px rgb(0 0 0 / .45)}
[data-vibeui-block="pricing-021"] [data-part="ticket-head"]{display:flex;align-items:flex-start;justify-content:space-between;gap:.75rem}
[data-vibeui-block="pricing-021"] [data-part="name"]{margin:0;font-family:var(--vibeui-pricing-021-display);font-size:1.4rem;font-weight:600;letter-spacing:-.02em;line-height:1.15}
[data-vibeui-block="pricing-021"] [data-part="text"]{margin:.3rem 0 0;font-size:.92rem;opacity:.8}
[data-vibeui-block="pricing-021"] [data-part="note"]{flex:none;padding:.3rem .65rem;border-radius:999px;background:rgb(255 255 255 / .55);color:#111;font-size:.75rem;font-weight:600}
[data-vibeui-block="pricing-021"] [data-part="ticket"][data-dark="true"] [data-part="note"]{background:rgb(0 0 0 / .3);color:#fff}
[data-vibeui-block="pricing-021"] [data-part="price"]{display:flex;align-items:baseline;flex-wrap:wrap;gap:.5rem}
[data-vibeui-block="pricing-021"] [data-part="amount"]{position:relative;display:block;height:3.4rem;overflow:hidden;font-family:var(--vibeui-pricing-021-display);font-size:clamp(2.4rem,4cqi,3.2rem);font-weight:700;letter-spacing:-.04em;line-height:3.4rem;font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-021"] [data-part="amount"] span{display:block;animation:vibeui-pricing-021-flip .4s cubic-bezier(.2,.8,.2,1)}
@keyframes vibeui-pricing-021-flip{from{transform:translateY(100%);opacity:0}to{transform:none;opacity:1}}
[data-vibeui-block="pricing-021"] [data-part="old"]{font-size:1rem;opacity:.6;text-decoration:line-through;font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-021"] [data-part="features"]{margin:0;padding:0;list-style:none;display:grid;gap:.5rem;font-size:.95rem}
[data-vibeui-block="pricing-021"] [data-part="features"] li{position:relative;display:flex;gap:.6rem;align-items:flex-start}
[data-vibeui-block="pricing-021"] [data-part="features"] li::after{content:"";position:absolute;left:.3rem;top:.5rem;width:.5rem;height:.28rem;border-left:2px solid var(--vibeui-pricing-021-color);border-bottom:2px solid var(--vibeui-pricing-021-color);transform:rotate(-45deg)}
[data-vibeui-block="pricing-021"] [data-part="features"] li::before{content:"";flex:none;width:1.15rem;height:1.15rem;margin-top:.15rem;border-radius:50%;background:currentColor;opacity:.9}
[data-vibeui-block="pricing-021"] [data-part="action"]{display:inline-flex;align-items:center;justify-content:center;height:3.2rem;margin-top:auto;border-radius:999px;background:rgb(255 255 255 / .7);color:#111;font-size:1.05rem;font-weight:600;text-decoration:none;transition:transform .2s,filter .2s}
[data-vibeui-block="pricing-021"] [data-part="ticket"][data-dark="true"] [data-part="action"]{background:rgb(255 255 255 / .92)}
[data-vibeui-block="pricing-021"] [data-part="ticket"][data-featured="true"] [data-part="action"]{background:#111;color:#fff}
[data-vibeui-block="pricing-021"] [data-part="action"]:hover{transform:translateY(-2px);filter:brightness(.95)}
[data-vibeui-block="pricing-021"] [data-part="free"]{display:flex;align-items:center;gap:.6rem;margin:1.25rem 0 0;font-size:.95rem;color:var(--vibeui-pricing-021-muted)}
[data-vibeui-block="pricing-021"] [data-part="free"]::before{content:"";width:.6rem;height:.6rem;border-radius:50%;background:var(--vibeui-pricing-021-accent);box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-pricing-021-accent) 30%,transparent)}
@container (min-width: 56rem){
[data-vibeui-block="pricing-021"] [data-part="shell"]{padding:2.5rem 2rem 4rem}
[data-vibeui-block="pricing-021"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr));align-items:stretch;gap:1.25rem}
[data-vibeui-block="pricing-021"] [data-part="ticket"]{padding:1.75rem}
[data-vibeui-block="pricing-021"] [data-part="ticket"][data-featured="true"]{transform:scale(1.03)}
[data-vibeui-block="pricing-021"] [data-part="ticket"][data-featured="true"]:hover{transform:scale(1.03) translateY(-5px) rotate(-.5deg)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-021"] *{animation:none!important;transition:none!important}}`

const DEFAULT_TICKETS: Pricing021Ticket[] = [
  { name: "Один день", text: "Любой из трёх дней на выбор.", price: 1500, oldPrice: 1900, color: "#ffe2d6", features: ["Все сцены и площадки дня", "Лекторий и кино", "Детская поляна с ребёнком"], actionLabel: "Купить на день", actionHref: "#" },
  { name: "Все три дня", text: "Один браслет на весь фестиваль.", price: 3200, oldPrice: 4500, color: "#c2df37", featured: true, note: "Выгоднее на 30 %", features: ["Все сцены и площадки", "Ночная программа 18+", "Приоритетный вход по утрам", "Скидка 10 % на фуд-корте"], actionLabel: "Купить на всё", actionHref: "#" },
  { name: "Семейный", text: "Двое взрослых и дети до 14.", price: 5000, oldPrice: 6400, color: "#464dff", ink: "#fff", features: ["Все три дня для всей семьи", "Детская поляна и мастерские", "Тихая зона и пеленальные", "Парковка у входа"], actionLabel: "Купить семейный", actionHref: "#" },
]

/** Билеты фестиваля: три цветные карточки, счётчик билетов и перелистывание цен. */
export function Pricing021({
  eyebrow = "Билеты",
  title = "Один браслет — все сцены",
  lede = "Предпродажа до 1 августа. Половина программы бесплатна: фуд-корт, маркет, лекторий и утренние занятия открыты для всех.",
  tickets = DEFAULT_TICKETS,
  counter = true,
  counterLabel = "Билетов",
  maxCount = 8,
  freeNote = "Детям до 7 лет — бесплатно с любым билетом. Возврат до 15 августа без вопросов.",
  currency = "₽",
  lessLabel = "Меньше",
  moreLabel = "Больше",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Pricing021Props) {
  const [count, setCount] = useState(1)
  const format = new Intl.NumberFormat("ru-RU")
  const palette = {
    ...(accent ? { "--vibeui-pricing-021-accent": accent } : null),
    ...(background ? { "--vibeui-pricing-021-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-pricing-021" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="pricing-021" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            {counter ? (
              <div data-part="counter" role="group" aria-label={counterLabel}>
                <span>{counterLabel}</span>
                <button type="button" aria-label={lessLabel} disabled={count <= 1} onClick={() => setCount((value) => Math.max(1, value - 1))}>
                  −
                </button>
                <span data-part="count" aria-live="polite">
                  {count}
                </span>
                <button type="button" aria-label={moreLabel} disabled={count >= maxCount} onClick={() => setCount((value) => Math.min(maxCount, value + 1))}>
                  +
                </button>
              </div>
            ) : null}
          </div>
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <ul data-part="grid">
            {tickets.map((ticket) => {
              const value = ticket.price * count
              return (
                <li key={ticket.name} data-part="ticket" data-featured={ticket.featured ? "true" : undefined} data-dark={ticket.ink ? "true" : undefined} style={{ ["--vibeui-pricing-021-color" as string]: ticket.color, ["--vibeui-pricing-021-ink" as string]: ticket.ink ?? "#111" }}>
                  <div data-part="ticket-head">
                    <div>
                      <h3 data-part="name">{ticket.name}</h3>
                      {ticket.text ? <p data-part="text">{ticket.text}</p> : null}
                    </div>
                    {ticket.note ? <span data-part="note">{ticket.note}</span> : null}
                  </div>
                  <div data-part="price">
                    <span data-part="amount">
                      <span key={value}>
                        {format.format(value)} {currency}
                      </span>
                    </span>
                    {ticket.oldPrice ? (
                      <span data-part="old">
                        {format.format(ticket.oldPrice * count)} {currency}
                      </span>
                    ) : null}
                  </div>
                  <ul data-part="features">
                    {ticket.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  {ticket.actionLabel ? (
                    <a data-part="action" href={ticket.actionHref ?? "#"}>
                      {ticket.actionLabel}
                    </a>
                  ) : null}
                </li>
              )
            })}
          </ul>
          {freeNote ? <p data-part="free">{freeNote}</p> : null}
        </div>
      </section>
    </>
  )
}

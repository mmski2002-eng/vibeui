"use client"

import { useState, type CSSProperties, type PointerEvent } from "react"

export type Pricing020Plan = {
  name: string
  text?: string
  /** Полная цена в рублях. */
  price: number
  /** Цена до скидки — зачёркивается. */
  oldPrice?: number
  features: readonly string[]
  /** «Осталось 5 мест». */
  seats?: string
  /** Прогресс мест: сколько занято из скольких — рисует полоску. */
  seatsTaken?: number
  seatsTotal?: number
  featured?: boolean
  actionLabel?: string
  actionHref?: string
}

export type Pricing020Props = {
  eyebrow?: string
  title?: string
  lede?: string
  plans?: readonly Pricing020Plan[]
  /** Число месяцев рассрочки. */
  months?: number
  onceLabel?: string
  splitLabel?: string
  /** Стикер над тарифами: «−20 % до 30 сентября». */
  sticker?: string
  /** Подпись под тарифами: возврат, договор. */
  note?: string
  currency?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Тарифы курса: переключатель «сразу / рассрочка» перелистывает цены (старая
// уезжает вверх, новая въезжает снизу), у выделенного плана вращающаяся
// conic-рамка через @property, полоска занятых мест, курсорный блик на
// карточках через --mx/--my. Формат чисел — Intl.NumberFormat ru-RU.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"

const STYLES = `
@property --vibeui-pricing-020-a{syntax:"<angle>";inherits:false;initial-value:0deg}
:where([data-vibeui-block="pricing-020"]){
--vibeui-pricing-020-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-pricing-020-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-pricing-020-muted:light-dark(#6b7280,#a3a3a3);
--vibeui-pricing-020-card:light-dark(#ffffff,#242424);
--vibeui-pricing-020-line:light-dark(#e5e7eb,#2e2e2e);
--vibeui-pricing-020-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-pricing-020-on-accent:oklch(from var(--vibeui-pricing-020-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-pricing-020-marker:light-dark(#d9f99d,rgb(163 230 53 / .3));
--vibeui-pricing-020-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-pricing-020-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-020"]{color-scheme:dark}
:where([data-vibeui-block="pricing-020"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="pricing-020"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="pricing-020"]{box-sizing:border-box;display:block;background:var(--vibeui-pricing-020-bg);color:var(--vibeui-pricing-020-fg);font-family:var(--vibeui-pricing-020-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="pricing-020"] *{box-sizing:border-box}
[data-vibeui-block="pricing-020"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="pricing-020"] [data-part="head"]{text-align:center;max-width:38rem;margin:0 auto 2rem}
[data-vibeui-block="pricing-020"] [data-part="eyebrow"]{margin:0 0 .75rem;font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-pricing-020-accent);font-weight:700}
[data-vibeui-block="pricing-020"] [data-part="title"]{margin:0;font-family:var(--vibeui-pricing-020-display);font-weight:700;font-size:clamp(1.8rem,3.6cqi,2.75rem);line-height:1.1;letter-spacing:-.02em}
[data-vibeui-block="pricing-020"] [data-part="lede"]{margin:.75rem 0 0;color:var(--vibeui-pricing-020-muted)}
[data-vibeui-block="pricing-020"] [data-part="bar"]{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:1rem;margin-bottom:2rem}
[data-vibeui-block="pricing-020"] [data-part="switch"]{position:relative;display:inline-grid;grid-template-columns:1fr 1fr;padding:.25rem;border-radius:999px;background:var(--vibeui-pricing-020-card);border:1px solid var(--vibeui-pricing-020-line)}
[data-vibeui-block="pricing-020"] [data-part="switch"]::before{content:"";position:absolute;top:.25rem;bottom:.25rem;left:.25rem;width:calc(50% - .25rem);border-radius:999px;background:var(--vibeui-pricing-020-fg);transition:transform .35s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="pricing-020"] [data-part="switch"][data-split="true"]::before{transform:translateX(100%)}
[data-vibeui-block="pricing-020"] [data-part="switch"] button{position:relative;z-index:1;border:0;background:transparent;padding:.55rem 1.1rem;border-radius:999px;font:inherit;font-size:.85rem;font-weight:600;color:var(--vibeui-pricing-020-muted);cursor:pointer;white-space:nowrap;transition:color .3s}
[data-vibeui-block="pricing-020"] [data-part="switch"] button[aria-pressed="true"]{color:var(--vibeui-pricing-020-bg)}
[data-vibeui-block="pricing-020"] [data-part="switch"] button:focus-visible{outline:2px solid var(--vibeui-pricing-020-accent);outline-offset:2px}
[data-vibeui-block="pricing-020"] [data-part="sticker"]{padding:.45rem .8rem;border-radius:.6rem;background:var(--vibeui-pricing-020-marker);color:#1a2e05;font-family:var(--vibeui-pricing-020-display);font-size:.75rem;font-weight:600;transform:rotate(-2deg)}
[data-vibeui-block="pricing-020"] [data-part="grid"]{display:grid;gap:1.25rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="pricing-020"] [data-part="plan"]{position:relative;isolation:isolate;display:flex;flex-direction:column;gap:1.25rem;padding:1.75rem;border-radius:1.25rem;background:var(--vibeui-pricing-020-card);border:1px solid var(--vibeui-pricing-020-line);transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s}
[data-vibeui-block="pricing-020"] [data-part="plan"]:hover{transform:translateY(-4px);box-shadow:0 30px 50px -30px rgb(17 24 39 / .35)}
[data-vibeui-block="pricing-020"] [data-part="plan"]::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:radial-gradient(18rem circle at var(--vibeui-pricing-020-mx,50%) var(--vibeui-pricing-020-my,50%),color-mix(in oklab,var(--vibeui-pricing-020-accent) 16%,transparent),transparent 60%);opacity:0;transition:opacity .4s}
[data-vibeui-block="pricing-020"] [data-part="plan"]:hover::after{opacity:1}
[data-vibeui-block="pricing-020"] [data-part="plan"][data-featured="true"]{background:var(--vibeui-pricing-020-fg);color:var(--vibeui-pricing-020-bg);border-color:transparent}
[data-vibeui-block="pricing-020"] [data-part="plan"][data-featured="true"]::before{content:"";position:absolute;inset:-2px;padding:2px;border-radius:calc(1.25rem + 2px);pointer-events:none;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude;background:conic-gradient(from var(--vibeui-pricing-020-a),var(--vibeui-pricing-020-accent),var(--vibeui-pricing-020-marker),transparent 40%,var(--vibeui-pricing-020-accent));animation:vibeui-pricing-020-spin 5s linear infinite}
@keyframes vibeui-pricing-020-spin{to{--vibeui-pricing-020-a:360deg}}
[data-vibeui-block="pricing-020"] [data-part="plan"][data-featured="true"]::after{background:radial-gradient(18rem circle at var(--vibeui-pricing-020-mx,50%) var(--vibeui-pricing-020-my,50%),rgb(255 255 255 / .12),transparent 60%)}
[data-vibeui-block="pricing-020"] [data-part="plan"][data-featured="true"] [data-part="plan-text"],[data-vibeui-block="pricing-020"] [data-part="plan"][data-featured="true"] [data-part="per"],[data-vibeui-block="pricing-020"] [data-part="plan"][data-featured="true"] [data-part="old"],[data-vibeui-block="pricing-020"] [data-part="plan"][data-featured="true"] [data-part="meter"] span{color:color-mix(in oklab,var(--vibeui-pricing-020-bg) 70%,transparent)}
[data-vibeui-block="pricing-020"] [data-part="plan-name"]{margin:0;font-family:var(--vibeui-pricing-020-display);font-size:1.1rem;font-weight:600}
[data-vibeui-block="pricing-020"] [data-part="plan-text"]{margin:.35rem 0 0;font-size:.875rem;color:var(--vibeui-pricing-020-muted)}
[data-vibeui-block="pricing-020"] [data-part="seats"]{position:absolute;top:1.25rem;right:1.25rem;padding:.3rem .6rem;border-radius:.5rem;background:var(--vibeui-pricing-020-marker);color:#1a2e05;font-size:.7rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase}
[data-vibeui-block="pricing-020"] [data-part="amount"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:.5rem}
[data-vibeui-block="pricing-020"] [data-part="price"]{position:relative;display:block;height:2.3rem;overflow:hidden;font-family:var(--vibeui-pricing-020-display);font-size:2.1rem;font-weight:700;line-height:2.3rem;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-020"] [data-part="price"] span{display:block;animation:vibeui-pricing-020-flip .45s cubic-bezier(.2,.8,.2,1)}
@keyframes vibeui-pricing-020-flip{from{transform:translateY(100%);opacity:0}to{transform:none;opacity:1}}
[data-vibeui-block="pricing-020"] [data-part="per"]{font-size:.85rem;color:var(--vibeui-pricing-020-muted)}
[data-vibeui-block="pricing-020"] [data-part="old"]{width:100%;font-size:.85rem;color:var(--vibeui-pricing-020-muted);text-decoration:line-through;font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-020"] [data-part="meter"]{display:grid;gap:.4rem}
[data-vibeui-block="pricing-020"] [data-part="meter"] span{font-size:.75rem;color:var(--vibeui-pricing-020-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-020"] [data-part="meter"] i{display:block;height:.4rem;border-radius:999px;background:color-mix(in oklab,currentColor 12%,transparent);overflow:hidden}
[data-vibeui-block="pricing-020"] [data-part="meter"] i::before{content:"";display:block;height:100%;width:calc(var(--vibeui-pricing-020-fill) * 100%);border-radius:inherit;background:linear-gradient(90deg,var(--vibeui-pricing-020-accent),var(--vibeui-pricing-020-marker));animation:vibeui-pricing-020-fill 1.2s .3s cubic-bezier(.2,.8,.2,1) both}
@keyframes vibeui-pricing-020-fill{from{width:0}}
[data-vibeui-block="pricing-020"] [data-part="features"]{margin:0;padding:0;list-style:none;display:grid;gap:.55rem;font-size:.9rem}
[data-vibeui-block="pricing-020"] [data-part="features"] li{display:flex;gap:.65rem;align-items:flex-start}
[data-vibeui-block="pricing-020"] [data-part="features"] li::before{content:"";flex:none;width:1.1rem;height:1.1rem;margin-top:.15rem;border-radius:50%;background:var(--vibeui-pricing-020-accent) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M5.5 10.5l3 3 6-6' fill='none' stroke='%23fff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/100% no-repeat}
[data-vibeui-block="pricing-020"] [data-part="action"]{position:relative;display:inline-flex;align-items:center;justify-content:center;height:3rem;margin-top:auto;border-radius:999px;border:1px solid var(--vibeui-pricing-020-line);color:inherit;font-weight:600;text-decoration:none;transition:transform .2s,background .2s,box-shadow .3s}
[data-vibeui-block="pricing-020"] [data-part="action"]:hover{transform:translateY(-1px)}
[data-vibeui-block="pricing-020"] [data-part="plan"][data-featured="true"] [data-part="action"]{background:var(--vibeui-pricing-020-accent);color:var(--vibeui-pricing-020-on-accent);border-color:transparent;box-shadow:0 0 0 0 var(--vibeui-pricing-020-accent)}
[data-vibeui-block="pricing-020"] [data-part="plan"][data-featured="true"] [data-part="action"]:hover{box-shadow:0 14px 30px -12px var(--vibeui-pricing-020-accent)}
[data-vibeui-block="pricing-020"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-pricing-020-accent);outline-offset:3px}
[data-vibeui-block="pricing-020"] [data-part="note"]{margin:1.5rem 0 0;text-align:center;font-size:.8rem;color:var(--vibeui-pricing-020-muted)}
@container (min-width: 56rem){
[data-vibeui-block="pricing-020"] [data-part="shell"]{padding:5.5rem 2rem}
[data-vibeui-block="pricing-020"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr));align-items:stretch}
[data-vibeui-block="pricing-020"] [data-part="plan"][data-featured="true"]{transform:translateY(-.75rem)}
[data-vibeui-block="pricing-020"] [data-part="plan"][data-featured="true"]:hover{transform:translateY(-1rem)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-020"] *{transition:none!important;animation:none!important}}`

const DEFAULT_PLANS: Pricing020Plan[] = [
  { name: "Сам", text: "Записи уроков и чат потока. Без проверки домашек.", price: 29000, oldPrice: 36000, features: ["18 уроков и все файлы", "Чат потока и сообщество", "Доступ к записям — год"], actionLabel: "Выбрать", actionHref: "#" },
  { name: "С куратором", text: "Всё из «Сам» плюс ревью каждой домашки и защита кейса.", price: 49000, oldPrice: 61000, featured: true, seats: "Осталось 12 мест", seatsTaken: 48, seatsTotal: 60, features: ["Куратор на 12 человек", "Видеоразбор шести домашек", "Защита перед арт-директором", "Кейс в базе рекомендаций"], actionLabel: "Записаться", actionHref: "#" },
  { name: "С трудоустройством", text: "Куратор, карьерный трек и три пробных собеседования.", price: 79000, oldPrice: 98000, seatsTaken: 7, seatsTotal: 10, features: ["Всё из «С куратором»", "Резюме и портфолио с карьерным консультантом", "Три мок-интервью", "Вакансии партнёров"], actionLabel: "Выбрать", actionHref: "#" },
]

/** Тарифы курса: перелистывание цен, вращающаяся рамка у выделенного плана и полоска мест. */
export function Pricing020({
  eyebrow = "Стоимость",
  title = "Три формата — одна программа",
  lede = "Рассрочка без переплаты от банка-партнёра. Возврат в первые семь дней без вопросов.",
  plans = DEFAULT_PLANS,
  months = 6,
  onceLabel = "Оплата сразу",
  splitLabel = "Рассрочка",
  sticker = "−20 % до 30 сентября",
  note = "Договор оферты и чек — на почту. Оплата картой, СБП или по счёту для юрлиц.",
  currency = "₽",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Pricing020Props) {
  const [split, setSplit] = useState(false)
  const format = new Intl.NumberFormat("ru-RU")
  const palette = {
    ...(accent ? { "--vibeui-pricing-020-accent": accent } : null),
    ...(ink ? { "--vibeui-pricing-020-fg": ink } : null),
    ...(background ? { "--vibeui-pricing-020-bg": background } : null),
    ...style,
  } as CSSProperties
  const glow = (event: PointerEvent<HTMLLIElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty("--vibeui-pricing-020-mx", `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty("--vibeui-pricing-020-my", `${event.clientY - rect.top}px`)
  }

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-pricing-020" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="pricing-020" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="bar">
            <div data-part="switch" data-split={split} role="group" aria-label="Способ оплаты">
              <button type="button" aria-pressed={!split} onClick={() => setSplit(false)}>
                {onceLabel}
              </button>
              <button type="button" aria-pressed={split} onClick={() => setSplit(true)}>
                {splitLabel} · {months} мес
              </button>
            </div>
            {sticker ? <span data-part="sticker">{sticker}</span> : null}
          </div>
          <ul data-part="grid">
            {plans.map((plan) => {
              const value = split ? Math.round(plan.price / months) : plan.price
              const fill = plan.seatsTaken !== undefined && plan.seatsTotal ? Math.min(1, plan.seatsTaken / plan.seatsTotal) : null
              return (
                <li key={plan.name} data-part="plan" data-featured={plan.featured ? "true" : undefined} onPointerMove={glow}>
                  {plan.seats ? <span data-part="seats">{plan.seats}</span> : null}
                  <div>
                    <h3 data-part="plan-name">{plan.name}</h3>
                    {plan.text ? <p data-part="plan-text">{plan.text}</p> : null}
                  </div>
                  <div data-part="amount" aria-live="polite">
                    <span data-part="price">
                      <span key={value}>
                        {format.format(value)} {currency}
                      </span>
                    </span>
                    <span data-part="per">{split ? "в месяц" : "за курс"}</span>
                    {plan.oldPrice && !split ? (
                      <span data-part="old">
                        {format.format(plan.oldPrice)} {currency}
                      </span>
                    ) : null}
                    {split ? (
                      <span data-part="old" style={{ textDecoration: "none" }}>
                        всего {format.format(plan.price)} {currency}
                      </span>
                    ) : null}
                  </div>
                  {fill !== null ? (
                    <div data-part="meter" style={{ ["--vibeui-pricing-020-fill" as string]: fill }}>
                      <i aria-hidden="true" />
                      <span>
                        занято {plan.seatsTaken} из {plan.seatsTotal}
                      </span>
                    </div>
                  ) : null}
                  <ul data-part="features">
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  {plan.actionLabel ? (
                    <a data-part="action" href={plan.actionHref ?? "#"}>
                      {plan.actionLabel}
                    </a>
                  ) : null}
                </li>
              )
            })}
          </ul>
          {note ? <p data-part="note">{note}</p> : null}
        </div>
      </section>
    </>
  )
}

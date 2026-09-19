"use client"

import { useState, type CSSProperties } from "react"

export type Pricing025Plan = {
  name: string
  /** Цена за место в месяц при помесячной оплате. 0 — бесплатно. */
  perSeat: number
  /** Сколько мест входит бесплатно (для нулевого тарифа — потолок). */
  seatsIncluded?: number
  note: string
  features: readonly string[]
  featured?: boolean
  actionLabel?: string
  actionHref?: string
}

export type Pricing025Props = {
  eyebrow?: string
  title?: string
  lede?: string
  plans?: readonly Pricing025Plan[]
  /** Диапазон ползунка мест. */
  minSeats?: number
  maxSeats?: number
  defaultSeats?: number
  /** Скидка за год, в процентах. */
  yearlyDiscount?: number
  currency?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Тарифы с ползунком мест: один range сверху, под ним три карточки, цена
// в каждой пересчитывается на лету (за место × мест, годовая скидка
// переключателем), в средней карточке аврора-рамка и бейдж «выбирают
// чаще». Число в цене плавно меняется через tabular-nums без прыжков.
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@600;700;800&family=Golos+Text:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="pricing-025"]){
--vibeui-pricing-025-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-pricing-025-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-pricing-025-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-pricing-025-on-accent:oklch(from var(--vibeui-pricing-025-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-pricing-025-muted:color-mix(in oklab,var(--vibeui-pricing-025-fg) 60%,var(--vibeui-pricing-025-bg));
--vibeui-pricing-025-line:color-mix(in oklab,var(--vibeui-pricing-025-fg) 14%,transparent);
--vibeui-pricing-025-glass:color-mix(in oklab,var(--vibeui-pricing-025-fg) 6%,transparent);
--vibeui-pricing-025-aurora:linear-gradient(135deg,var(--vibeui-pricing-025-accent),color-mix(in oklab,var(--vibeui-pricing-025-accent) 40%,#a855f7),color-mix(in oklab,var(--vibeui-pricing-025-accent) 30%,#f472b6));
--vibeui-pricing-025-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-pricing-025-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-pricing-025-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-025"]{color-scheme:dark}
:where([data-vibeui-block="pricing-025"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="pricing-025"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="pricing-025"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-pricing-025-bg);color:var(--vibeui-pricing-025-fg);font-family:var(--vibeui-pricing-025-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="pricing-025"] *{box-sizing:border-box}
[data-vibeui-block="pricing-025"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="pricing-025"] [data-part="head"]{max-width:40rem;margin:0 auto;text-align:center}
[data-vibeui-block="pricing-025"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-pricing-025-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-pricing-025-accent)}
[data-vibeui-block="pricing-025"] [data-part="title"]{margin:0;font-family:var(--vibeui-pricing-025-display);font-weight:800;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1.05;letter-spacing:-.03em}
[data-vibeui-block="pricing-025"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-pricing-025-muted)}
[data-vibeui-block="pricing-025"] [data-part="controls"]{margin:2.4rem auto 0;max-width:44rem;padding:1.2rem 1.4rem;border-radius:1.2rem;background:var(--vibeui-pricing-025-glass);border:1px solid var(--vibeui-pricing-025-line);display:grid;gap:1rem}
[data-vibeui-block="pricing-025"] [data-part="seats"]{display:flex;align-items:baseline;justify-content:space-between;gap:1rem;font-size:.9rem}
[data-vibeui-block="pricing-025"] [data-part="seats"] output{font-family:var(--vibeui-pricing-025-display);font-weight:800;font-size:1.6rem;font-variant-numeric:tabular-nums;letter-spacing:-.02em}
[data-vibeui-block="pricing-025"] [data-part="seats"] output small{font-family:var(--vibeui-pricing-025-font);font-weight:500;font-size:.85rem;color:var(--vibeui-pricing-025-muted);margin-left:.3rem}
[data-vibeui-block="pricing-025"] [data-part="range"]{-webkit-appearance:none;appearance:none;width:100%;height:.5rem;border-radius:999px;background:linear-gradient(90deg,var(--vibeui-pricing-025-accent) var(--vibeui-pricing-025-fill),var(--vibeui-pricing-025-line) var(--vibeui-pricing-025-fill));outline:none;cursor:pointer}
[data-vibeui-block="pricing-025"] [data-part="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:1.4rem;height:1.4rem;border-radius:50%;background:var(--vibeui-pricing-025-bg);border:3px solid var(--vibeui-pricing-025-accent);box-shadow:0 0 0 6px color-mix(in oklab,var(--vibeui-pricing-025-accent) 20%,transparent);cursor:grab}
[data-vibeui-block="pricing-025"] [data-part="range"]::-moz-range-thumb{width:1.4rem;height:1.4rem;border-radius:50%;background:var(--vibeui-pricing-025-bg);border:3px solid var(--vibeui-pricing-025-accent);box-shadow:0 0 0 6px color-mix(in oklab,var(--vibeui-pricing-025-accent) 20%,transparent);cursor:grab}
[data-vibeui-block="pricing-025"] [data-part="range"]:focus-visible{box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-pricing-025-accent) 40%,transparent)}
[data-vibeui-block="pricing-025"] [data-part="period"]{display:flex;align-items:center;justify-content:center;gap:.8rem;font-size:.88rem;color:var(--vibeui-pricing-025-muted)}
[data-vibeui-block="pricing-025"] [data-part="period"] [data-on="true"]{color:var(--vibeui-pricing-025-fg);font-weight:600}
[data-vibeui-block="pricing-025"] [data-part="switch"]{position:relative;width:2.8rem;height:1.5rem;border-radius:999px;border:0;padding:0;background:var(--vibeui-pricing-025-line);cursor:pointer;transition:background .2s}
[data-vibeui-block="pricing-025"] [data-part="switch"]::after{content:"";position:absolute;top:.2rem;left:.2rem;width:1.1rem;height:1.1rem;border-radius:50%;background:var(--vibeui-pricing-025-fg);transition:transform .2s}
[data-vibeui-block="pricing-025"] [data-part="switch"][aria-checked="true"]{background:var(--vibeui-pricing-025-accent)}
[data-vibeui-block="pricing-025"] [data-part="switch"][aria-checked="true"]::after{transform:translateX(1.3rem);background:var(--vibeui-pricing-025-on-accent)}
[data-vibeui-block="pricing-025"] [data-part="switch"]:focus-visible{outline:2px solid var(--vibeui-pricing-025-accent);outline-offset:2px}
[data-vibeui-block="pricing-025"] [data-part="save"]{font-family:var(--vibeui-pricing-025-mono);font-size:.68rem;padding:.15rem .5rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-pricing-025-accent) 18%,transparent);color:var(--vibeui-pricing-025-accent)}
[data-vibeui-block="pricing-025"] [data-part="grid"]{display:grid;gap:1rem;margin:2.5rem 0 0;padding:0;list-style:none}
[data-vibeui-block="pricing-025"] [data-part="plan"]{position:relative;display:grid;gap:1.2rem;padding:1.6rem;border-radius:1.4rem;background:var(--vibeui-pricing-025-glass);border:1px solid var(--vibeui-pricing-025-line)}
[data-vibeui-block="pricing-025"] [data-part="plan"][data-featured="true"]{border-color:transparent;background:linear-gradient(var(--vibeui-pricing-025-bg),var(--vibeui-pricing-025-bg)) padding-box,var(--vibeui-pricing-025-aurora) border-box;box-shadow:0 30px 60px -30px var(--vibeui-pricing-025-accent)}
[data-vibeui-block="pricing-025"] [data-part="badge"]{position:absolute;top:-.8rem;left:1.6rem;padding:.25rem .7rem;border-radius:999px;background:var(--vibeui-pricing-025-aurora);color:var(--vibeui-pricing-025-on-accent);font-size:.7rem;font-weight:600;letter-spacing:.02em}
[data-vibeui-block="pricing-025"] [data-part="plan"] h3{margin:0;font-family:var(--vibeui-pricing-025-display);font-size:1.15rem;font-weight:700}
[data-vibeui-block="pricing-025"] [data-part="price"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:.2rem .5rem;font-family:var(--vibeui-pricing-025-display);font-weight:800;font-size:2.4rem;letter-spacing:-.03em;line-height:1;font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-025"] [data-part="price"] small{font-family:var(--vibeui-pricing-025-font);font-weight:500;font-size:.85rem;color:var(--vibeui-pricing-025-muted);letter-spacing:0}
[data-vibeui-block="pricing-025"] [data-part="note"]{margin:0;font-size:.85rem;color:var(--vibeui-pricing-025-muted);min-height:2.6em}
[data-vibeui-block="pricing-025"] [data-part="features"]{margin:0;padding:0;list-style:none;display:grid;gap:.5rem;font-size:.9rem}
[data-vibeui-block="pricing-025"] [data-part="features"] li{display:flex;gap:.5rem;align-items:baseline}
[data-vibeui-block="pricing-025"] [data-part="features"] li::before{content:"✓";font-family:var(--vibeui-pricing-025-mono);color:var(--vibeui-pricing-025-accent);font-size:.8rem}
[data-vibeui-block="pricing-025"] [data-part="action"]{display:inline-flex;justify-content:center;align-items:center;padding:.8rem 1.2rem;border-radius:999px;font-weight:600;text-decoration:none;color:var(--vibeui-pricing-025-fg);border:1px solid var(--vibeui-pricing-025-line);transition:transform .18s,background .2s,color .2s}
[data-vibeui-block="pricing-025"] [data-part="action"]:hover{transform:translateY(-1px);background:var(--vibeui-pricing-025-glass)}
[data-vibeui-block="pricing-025"] [data-part="plan"][data-featured="true"] [data-part="action"]{background:var(--vibeui-pricing-025-accent);color:var(--vibeui-pricing-025-on-accent);border-color:transparent}
[data-vibeui-block="pricing-025"] [data-part="plan"][data-featured="true"] [data-part="action"]:hover{box-shadow:0 10px 30px -10px var(--vibeui-pricing-025-accent)}
[data-vibeui-block="pricing-025"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-pricing-025-accent);outline-offset:2px}
@container (min-width: 44rem){[data-vibeui-block="pricing-025"] [data-part="controls"]{grid-template-columns:1fr auto;align-items:center}[data-vibeui-block="pricing-025"] [data-part="seats"]{grid-column:1/-1}}
@container (min-width: 56rem){[data-vibeui-block="pricing-025"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr));align-items:start}[data-vibeui-block="pricing-025"] [data-part="plan"][data-featured="true"]{transform:translateY(-.6rem)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-025"] *{animation:none!important;transition:none!important}}`

const DEFAULT_PLANS: Pricing025Plan[] = [
  { name: "Старт", perSeat: 0, seatsIncluded: 3, note: "До трёх человек, 5 встреч в месяц, сводка в Telegram.", features: ["Расшифровка и сводка", "5 встреч в месяц", "Экспорт в Markdown"], actionLabel: "Начать бесплатно", actionHref: "#start" },
  { name: "Команда", perSeat: 890, note: "Всё, что нужно команде до 50 человек. Интеграции и задачи в трекере.", features: ["Безлимит встреч", "Задачи в Jira, Notion, Linear", "Поиск по всем решениям", "История 12 месяцев"], featured: true, actionLabel: "Попробовать 14 дней", actionHref: "#start" },
  { name: "Компания", perSeat: 1490, note: "SSO, свой контур данных, договор и поддержка с SLA.", features: ["Всё из «Команды»", "SSO и SCIM", "Данные в вашем контуре", "Менеджер и SLA"], actionLabel: "Обсудить", actionHref: "#contact" },
]

function formatMoney(value: number, currency: string) {
  const digits = String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  return `${digits} ${currency}`
}

/** Тарифы с ползунком мест и годовым переключателем. */
export function Pricing025({
  eyebrow = "Цены",
  title = "Платите за людей, не за минуты",
  lede = "Подвиньте ползунок под размер команды — цена пересчитается. Годовая оплата дешевле на пятую часть.",
  plans = DEFAULT_PLANS,
  minSeats = 1,
  maxSeats = 100,
  defaultSeats = 12,
  yearlyDiscount = 20,
  currency = "₽",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Pricing025Props) {
  const [seats, setSeats] = useState(defaultSeats)
  const [yearly, setYearly] = useState(false)
  const fill = `${((seats - minSeats) / Math.max(1, maxSeats - minSeats)) * 100}%`
  const factor = yearly ? 1 - yearlyDiscount / 100 : 1

  const palette = {
    ...(accent ? { "--vibeui-pricing-025-accent": accent } : null),
    ...(ink ? { "--vibeui-pricing-025-fg": ink } : null),
    ...(background ? { "--vibeui-pricing-025-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-pricing-025" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="pricing-025" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="controls">
            <label data-part="seats">
              <span>Человек в команде</span>
              <output>
                {seats}
                <small>{seats === 1 ? "место" : seats < 5 ? "места" : "мест"}</small>
              </output>
            </label>
            <input
              data-part="range"
              type="range"
              min={minSeats}
              max={maxSeats}
              value={seats}
              onChange={(event) => setSeats(Number(event.target.value))}
              aria-label="Человек в команде"
              style={{ ["--vibeui-pricing-025-fill" as string]: fill }}
            />
            <div data-part="period">
              <span data-on={!yearly}>В месяц</span>
              <button data-part="switch" type="button" role="switch" aria-checked={yearly} aria-label="Оплата за год" onClick={() => setYearly((value) => !value)} />
              <span data-on={yearly}>За год</span>
              {yearlyDiscount > 0 ? <span data-part="save">−{yearlyDiscount}%</span> : null}
            </div>
          </div>
          <ul data-part="grid">
            {plans.map((plan) => {
              const paidSeats = plan.perSeat === 0 ? 0 : seats
              const total = paidSeats * plan.perSeat * factor
              const over = plan.perSeat === 0 && plan.seatsIncluded !== undefined && seats > plan.seatsIncluded
              return (
                <li key={plan.name} data-part="plan" data-featured={plan.featured ? "true" : undefined}>
                  {plan.featured ? <span data-part="badge">Выбирают чаще</span> : null}
                  <h3>{plan.name}</h3>
                  <div data-part="price">
                    {plan.perSeat === 0 ? (
                      <>
                        {"0 " + currency}
                        <small>{over ? `только до ${plan.seatsIncluded} человек` : "навсегда"}</small>
                      </>
                    ) : (
                      <>
                        {formatMoney(total, currency)}
                        <small>/ мес · {formatMoney(plan.perSeat * factor, currency)} за место</small>
                      </>
                    )}
                  </div>
                  <p data-part="note">{plan.note}</p>
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
        </div>
      </section>
    </>
  )
}

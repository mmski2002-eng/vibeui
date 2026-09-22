"use client"

import { useState, type CSSProperties } from "react"


import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Charity001Icon = "bag" | "visit" | "pills" | "tools" | "home"

export type Charity001Tier = {
  amount: number
  title: string
  text: string
  icon: Charity001Icon
  /** Рукописная пометка на карточке. */
  note?: string
}

export type Charity001Props = {
  eyebrow?: string
  title?: string
  lede?: string
  tiers?: readonly Charity001Tier[]
  /** Какой уровень выбран при загрузке (индекс). */
  defaultIndex?: number
  currency?: string
  actionLabel?: string
  actionHref?: string
  /** aria сумм и ползунка, подсказка, «это». */
  chipsLabel?: string
  sliderLabel?: string
  hint?: string
  thisLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Что даёт ваша сумма»: слева чипы сумм и ползунок, который к ним
// привязан, справа бумажная карточка — она живо меняется: заголовок и
// текст въезжают снизу, а линейная иконка перерисовывается штрихом
// (pathLength + stroke-dashoffset). Выбранная сумма уходит наружу событием
// vibeui-charity:amount, чтобы форма пожертвования подхватила её.
const FONTS = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&family=Golos+Text:wght@400;500;600&family=Caveat:wght@500;700&display=swap"

const STYLES = `
:where([data-vibeui-block="charity-001"]){
--vibeui-charity-001-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-charity-001-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-charity-001-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-charity-001-on-accent:oklch(from var(--vibeui-charity-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-charity-001-muted:color-mix(in oklab,var(--vibeui-charity-001-fg) 62%,var(--vibeui-charity-001-bg));
--vibeui-charity-001-line:color-mix(in oklab,var(--vibeui-charity-001-fg) 16%,transparent);
--vibeui-charity-001-soft:color-mix(in oklab,var(--vibeui-charity-001-fg) 6%,var(--vibeui-charity-001-bg));
--vibeui-charity-001-second:color-mix(in oklab,var(--vibeui-charity-001-accent) 45%,#e0b000);
--vibeui-charity-001-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-charity-001-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-charity-001-hand:"Caveat","Segoe Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="charity-001"]{color-scheme:dark}
:where([data-vibeui-block="charity-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="charity-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="charity-001"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-charity-001-bg);color:var(--vibeui-charity-001-fg);font-family:var(--vibeui-charity-001-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="charity-001"] *{box-sizing:border-box}
[data-vibeui-block="charity-001"] [data-part="action"]{margin-top:.4rem}
[data-vibeui-block="charity-001"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem;align-items:center}
[data-vibeui-block="charity-001"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.8rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-charity-001-accent)}
[data-vibeui-block="charity-001"] [data-part="title"]{margin:0;font-family:var(--vibeui-charity-001-display);font-weight:500;font-size:clamp(2rem,4.6cqi,3.4rem);line-height:1.08;letter-spacing:-.02em}
[data-vibeui-block="charity-001"] [data-part="lede"]{margin:1rem 0 0;max-width:30rem;color:var(--vibeui-charity-001-muted)}
[data-vibeui-block="charity-001"] [data-part="chips"]{display:flex;flex-wrap:wrap;gap:.5rem;margin:1.8rem 0 0;padding:0;list-style:none}
[data-vibeui-block="charity-001"] [data-part="chip"]{padding:.6rem 1rem;border-radius:999px;border:1px solid var(--vibeui-charity-001-line);background:transparent;color:var(--vibeui-charity-001-fg);font:inherit;font-weight:600;font-size:.95rem;font-variant-numeric:tabular-nums;cursor:pointer;transition:background .2s,color .2s,border-color .2s,transform .2s}
[data-vibeui-block="charity-001"] [data-part="chip"]:hover{border-color:var(--vibeui-charity-001-accent);transform:translateY(-1px)}
[data-vibeui-block="charity-001"] [data-part="chip"][aria-pressed="true"]{background:var(--vibeui-charity-001-accent);border-color:var(--vibeui-charity-001-accent);color:var(--vibeui-charity-001-on-accent)}
[data-vibeui-block="charity-001"] [data-part="chip"]:focus-visible,[data-vibeui-block="charity-001"] [data-part="range"]:focus-visible{outline:2px solid var(--vibeui-charity-001-accent);outline-offset:2px}
[data-vibeui-block="charity-001"] [data-part="slider"]{margin:1.4rem 0 0;display:grid;gap:.5rem}
[data-vibeui-block="charity-001"] [data-part="slider"] label{display:flex;justify-content:space-between;font-size:.82rem;color:var(--vibeui-charity-001-muted)}
[data-vibeui-block="charity-001"] [data-part="range"]{-webkit-appearance:none;appearance:none;width:100%;height:.45rem;margin:0;border-radius:999px;background:linear-gradient(90deg,var(--vibeui-charity-001-accent) var(--vibeui-charity-001-fill),var(--vibeui-charity-001-line) var(--vibeui-charity-001-fill));outline:none;cursor:pointer}
[data-vibeui-block="charity-001"] [data-part="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:1.5rem;height:1.5rem;border-radius:50%;background:var(--vibeui-charity-001-bg);border:3px solid var(--vibeui-charity-001-accent);box-shadow:0 0 0 5px color-mix(in oklab,var(--vibeui-charity-001-accent) 18%,transparent);cursor:grab}
[data-vibeui-block="charity-001"] [data-part="range"]::-moz-range-thumb{width:1.5rem;height:1.5rem;border-radius:50%;background:var(--vibeui-charity-001-bg);border:3px solid var(--vibeui-charity-001-accent);box-shadow:0 0 0 5px color-mix(in oklab,var(--vibeui-charity-001-accent) 18%,transparent);cursor:grab}
[data-vibeui-block="charity-001"] [data-part="stage"]{position:relative;padding:1rem .5rem}
[data-vibeui-block="charity-001"] [data-part="card"]{position:relative;max-width:26rem;margin:0 auto;padding:2rem 1.8rem 1.8rem;background:var(--vibeui-charity-001-bg);border:1px solid var(--vibeui-charity-001-line);box-shadow:0 30px 60px -30px rgb(0 0 0 / .45),0 1px 0 var(--vibeui-charity-001-line);transform:rotate(-1.5deg);display:grid;gap:1rem}
[data-vibeui-block="charity-001"] [data-part="card"]::before{content:"";position:absolute;top:-.7rem;right:2rem;width:5rem;height:1.4rem;transform:rotate(4deg);background:color-mix(in oklab,var(--vibeui-charity-001-second) 55%,transparent);opacity:.85}
[data-vibeui-block="charity-001"] [data-part="card"]::after{content:"";position:absolute;inset:.5rem;border:1px dashed var(--vibeui-charity-001-line);pointer-events:none}
[data-vibeui-block="charity-001"] [data-part="icon"]{width:5.5rem;height:5.5rem;color:var(--vibeui-charity-001-accent)}
[data-vibeui-block="charity-001"] [data-part="icon"] path,[data-vibeui-block="charity-001"] [data-part="icon"] circle{stroke-dasharray:1;stroke-dashoffset:1;animation:vibeui-charity-001-draw 1.1s cubic-bezier(.2,.8,.2,1) forwards}
[data-vibeui-block="charity-001"] [data-part="icon"] :nth-child(2){animation-delay:.15s}
[data-vibeui-block="charity-001"] [data-part="icon"] :nth-child(3){animation-delay:.3s}
[data-vibeui-block="charity-001"] [data-part="icon"] :nth-child(4){animation-delay:.45s}
[data-vibeui-block="charity-001"] [data-part="icon"] :nth-child(5){animation-delay:.6s}
[data-vibeui-block="charity-001"] [data-part="amount"]{margin:0;font-family:var(--vibeui-charity-001-display);font-weight:700;font-size:2.6rem;line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums;animation:vibeui-charity-001-in .5s cubic-bezier(.2,.8,.2,1) both}
[data-vibeui-block="charity-001"] [data-part="amount"] small{font-family:var(--vibeui-charity-001-font);font-weight:500;font-size:.9rem;color:var(--vibeui-charity-001-muted);margin-left:.5rem;letter-spacing:0}
[data-vibeui-block="charity-001"] [data-part="what"]{margin:0;font-family:var(--vibeui-charity-001-display);font-weight:500;font-size:1.5rem;line-height:1.15;animation:vibeui-charity-001-in .5s cubic-bezier(.2,.8,.2,1) .08s both}
[data-vibeui-block="charity-001"] [data-part="text"]{margin:0;color:var(--vibeui-charity-001-muted);font-size:.95rem;animation:vibeui-charity-001-in .5s cubic-bezier(.2,.8,.2,1) .16s both}
[data-vibeui-block="charity-001"] [data-part="note"]{margin:.2rem 0 0;font-family:var(--vibeui-charity-001-hand);font-size:1.35rem;line-height:1.1;color:var(--vibeui-charity-001-accent);animation:vibeui-charity-001-in .5s cubic-bezier(.2,.8,.2,1) .24s both}
@keyframes vibeui-charity-001-draw{to{stroke-dashoffset:0}}
@keyframes vibeui-charity-001-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@container (min-width: 56rem){[data-vibeui-block="charity-001"] [data-part="shell"]{grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:4rem}[data-vibeui-block="charity-001"] [data-part="stage"]{padding:1.5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="charity-001"] *{animation:none!important;transition:none!important}[data-vibeui-block="charity-001"] [data-part="icon"] path,[data-vibeui-block="charity-001"] [data-part="icon"] circle{stroke-dashoffset:0}}`

const DEFAULT_TIERS: Charity001Tier[] = [
  { amount: 500, title: "Продукты на неделю", text: "Хлеб, крупы, овощи, молоко и что-то к чаю — соцработник привозит пакет и остаётся на разговор.", icon: "bag", note: "и полчаса разговора" },
  { amount: 1000, title: "Лекарства на месяц", text: "Давление, сердце, суставы — по списку от врача. Аптека вдали от дома одинокому человеку не по силам.", icon: "pills", note: "по рецепту, с чеком" },
  { amount: 2000, title: "Визит соцработника", text: "Четыре часа: уборка, купание, оплата счетов, поход в поликлинику. Один визит в неделю — уже другая жизнь.", icon: "visit", note: "раз в неделю" },
  { amount: 5000, title: "Мелкий ремонт дома", text: "Кран, розетка, дверной замок, утепление окна к зиме. Мастер приезжает с инструментом и материалами.", icon: "tools", note: "мастер + материалы" },
  { amount: 15000, title: "Месяц заботы целиком", text: "Продукты, лекарства, еженедельные визиты и телефон, на который можно позвонить в любое время.", icon: "home", note: "один человек — целый месяц" },
]

const ICONS: Record<Charity001Icon, readonly string[]> = {
  bag: ["M10 18h28l-3 24H13z", "M17 18v-3a7 7 0 0 1 14 0v3", "M20 27c0 3 8 3 8 0", "M19 34h10"],
  pills: ["M13 26 26 13a7 7 0 0 1 10 10L23 36a7 7 0 0 1-10-10Z", "M19.5 19.5 29.5 29.5", "M35 33v10", "M30 38h10"],
  visit: ["M24 8a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z", "M12 42c0-9 5-14 12-14s12 5 12 14", "M33 24c0-2 3-3 4 0 1-3 4-2 4 0 0 2-4 5-4 5s-4-3-4-5Z", "M14 30l-4-3"],
  tools: ["M30 8a8 8 0 0 0-9 11L9 31a3 3 0 0 0 4 4l12-12a8 8 0 0 0 11-9l-5 5-4-4 5-5Z", "M28 30l9 9a2.5 2.5 0 0 0 4-4l-9-9", "M13 34l1 1"],
  home: ["M8 22 24 9l16 13", "M12 19v22h24V19", "M24 41V29a3 3 0 0 1 6 0v12", "M17 26c0-2 3-3 4-.5 1-2.5 4-1.5 4 .5 0 2-4 5-4 5s-4-3-4-5Z"],
}

function formatMoney(value: number) {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

/** «Что даёт ваша сумма»: чипы, ползунок и перерисовывающаяся карточка. */
export function Charity001({
  eyebrow = "Что даёт ваша сумма",
  title = "Мы считаем не рубли, а недели, визиты и починенные краны",
  lede = "Выберите сумму — покажем, во что она превращается для одного конкретного человека. Без округлений в нашу пользу.",
  tiers = DEFAULT_TIERS,
  defaultIndex = 1,
  currency = "₽",
  actionLabel = "Помочь этой суммой",
  actionHref = "#donate",
  chipsLabel = "Сумма",
  sliderLabel = "Сумма пожертвования",
  hint = "потяните ползунок или нажмите на сумму →",
  thisLabel = "это",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Charity001Props) {
  const [index, setIndex] = useState(() => Math.min(Math.max(0, defaultIndex), Math.max(0, tiers.length - 1)))
  const tier = tiers[index] ?? tiers[0]
  const fill = `${tiers.length > 1 ? (index / (tiers.length - 1)) * 100 : 0}%`

  const choose = (next: number) => {
    setIndex(next)
    const chosen = tiers[next]
    if (chosen) window.dispatchEvent(new CustomEvent("vibeui-charity:amount", { detail: { amount: chosen.amount } }))
  }

  const palette = {
    ...(accent ? { "--vibeui-charity-001-accent": accent } : null),
    ...(ink ? { "--vibeui-charity-001-fg": ink } : null),
    ...(background ? { "--vibeui-charity-001-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-charity-001" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="charity-001" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <ul data-part="chips" aria-label={chipsLabel}>
              {tiers.map((item, itemIndex) => (
                <li key={item.amount}>
                  <button data-part="chip" type="button" aria-pressed={itemIndex === index} onClick={() => choose(itemIndex)}>
                    {formatMoney(item.amount)} {currency}
                  </button>
                </li>
              ))}
            </ul>
            <div data-part="slider">
              <input
                data-part="range"
                type="range"
                min={0}
                max={Math.max(0, tiers.length - 1)}
                step={1}
                value={index}
                onChange={(event) => choose(Number(event.target.value))}
                aria-label={sliderLabel}
                aria-valuetext={`${formatMoney(tier?.amount ?? 0)} ${currency}`}
                style={{ ["--vibeui-charity-001-fill" as string]: fill }}
              />
              <label>
                <span>{formatMoney(tiers[0]?.amount ?? 0)} {currency}</span>
                <span>{formatMoney(tiers[tiers.length - 1]?.amount ?? 0)} {currency}</span>
              </label>
            </div>
            <p data-part="hint" aria-hidden="true">
              {hint}
            </p>
          </div>
          <div data-part="stage" aria-live="polite">
            {tier ? (
              <article data-part="card" key={tier.amount}>
                <svg data-part="icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {ICONS[tier.icon].map((d, pathIndex) => (
                    <path key={pathIndex} d={d} pathLength={1} />
                  ))}
                </svg>
                <p data-part="amount">
                  {formatMoney(tier.amount)} {currency}
                  <small>{thisLabel}</small>
                </p>
                <h3 data-part="what">{tier.title}</h3>
                <p data-part="text">{tier.text}</p>
                {tier.note ? <p data-part="note">— {tier.note}</p> : null}
                {actionLabel ? (
                  <Button016
                    data-part="action"
                    label={actionLabel}
                    href={actionHref}
                    external={false}
                    size="lg"
                    tone="accent"
                    accent={accent}
                  />
                ) : null}
              </article>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}

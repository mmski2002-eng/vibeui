"use client"

import { useState, type CSSProperties } from "react"

export type Pricing024Feature = {
  label: string
  free: boolean | string
  premium: boolean | string
}

export type Pricing024Props = {
  eyebrow?: string
  title?: string
  lede?: string
  freeName?: string
  freePrice?: string
  premiumName?: string
  premiumMonthly?: string
  premiumYearly?: string
  monthlyLabel?: string
  yearlyLabel?: string
  yearlyNote?: string
  trial?: string
  features?: readonly Pricing024Feature[]
  freeAction?: string
  premiumAction?: string
  premiumHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Тарифы приложения: две карточки — «Бесплатно» и «Премиум» с
// переключателем месяц/год (цена сдвигается с анимацией), плашкой «7 дней
// бесплатно» и общей таблицей функций под ними: галочки и крестики на
// светлых плитках, у премиума — акцентом. Ничего лишнего: два столбца.
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="pricing-024"]){
--vibeui-pricing-024-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-pricing-024-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-pricing-024-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-pricing-024-on-accent:oklch(from var(--vibeui-pricing-024-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-pricing-024-muted:color-mix(in oklab,var(--vibeui-pricing-024-fg) 60%,var(--vibeui-pricing-024-bg));
--vibeui-pricing-024-line:color-mix(in oklab,var(--vibeui-pricing-024-fg) 12%,transparent);
--vibeui-pricing-024-panel:color-mix(in oklab,var(--vibeui-pricing-024-fg) 5%,var(--vibeui-pricing-024-bg));
--vibeui-pricing-024-card:light-dark(#fff,color-mix(in oklab,var(--vibeui-pricing-024-bg) 85%,var(--vibeui-pricing-024-fg)));
--vibeui-pricing-024-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-pricing-024-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-024"]{color-scheme:dark}
:where([data-vibeui-block="pricing-024"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="pricing-024"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="pricing-024"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-pricing-024-panel);color:var(--vibeui-pricing-024-fg);font-family:var(--vibeui-pricing-024-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="pricing-024"] *{box-sizing:border-box}
[data-vibeui-block="pricing-024"] [data-part="shell"]{max-width:60rem;margin:0 auto;padding:0 1.25rem;text-align:center}
[data-vibeui-block="pricing-024"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.8rem;font-weight:600;color:var(--vibeui-pricing-024-accent)}
[data-vibeui-block="pricing-024"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2rem,5cqi,3.4rem);line-height:1.05;letter-spacing:-.03em}
[data-vibeui-block="pricing-024"] [data-part="lede"]{margin:1rem auto 0;max-width:30rem;color:var(--vibeui-pricing-024-muted)}
[data-vibeui-block="pricing-024"] [data-part="switch"]{display:inline-flex;align-items:center;gap:.25rem;margin-top:1.8rem;padding:.3rem;border-radius:999px;background:var(--vibeui-pricing-024-card);box-shadow:0 0 0 1px var(--vibeui-pricing-024-line)}
[data-vibeui-block="pricing-024"] [data-part="switch"] button{border:0;border-radius:999px;padding:.55rem 1rem;font:inherit;font-weight:600;font-size:.9rem;background:none;color:inherit;cursor:pointer;transition:background .2s,color .2s}
[data-vibeui-block="pricing-024"] [data-part="switch"] button[aria-pressed="true"]{background:var(--vibeui-pricing-024-fg);color:var(--vibeui-pricing-024-bg)}
[data-vibeui-block="pricing-024"] [data-part="switch"] small{font-size:.72rem;color:var(--vibeui-pricing-024-accent);padding:0 .7rem 0 .2rem;font-weight:600}
[data-vibeui-block="pricing-024"] [data-part="cards"]{display:grid;gap:1rem;margin-top:2rem;text-align:left}
[data-vibeui-block="pricing-024"] [data-part="card"]{position:relative;display:grid;gap:.6rem;padding:1.6rem;border-radius:1.4rem;background:var(--vibeui-pricing-024-card);box-shadow:0 0 0 1px var(--vibeui-pricing-024-line)}
[data-vibeui-block="pricing-024"] [data-part="card"][data-premium="true"]{background:var(--vibeui-pricing-024-fg);color:var(--vibeui-pricing-024-bg);box-shadow:0 30px 60px -30px rgb(0 0 0 / .5)}
[data-vibeui-block="pricing-024"] [data-part="card"] h3{margin:0;font-size:1.1rem;font-weight:700}
[data-vibeui-block="pricing-024"] [data-part="price"]{display:flex;align-items:baseline;gap:.4rem;overflow:hidden}
[data-vibeui-block="pricing-024"] [data-part="price"] b{font-family:var(--vibeui-pricing-024-mono);font-size:2.6rem;font-weight:500;letter-spacing:-.04em;line-height:1;animation:vibeui-pricing-024-slide .35s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="pricing-024"] [data-part="price"] span{font-size:.85rem;opacity:.7}
[data-vibeui-block="pricing-024"] [data-part="trial"]{position:absolute;right:1.2rem;top:-.8rem;padding:.3rem .7rem;border-radius:999px;background:var(--vibeui-pricing-024-accent);color:var(--vibeui-pricing-024-on-accent);font-size:.72rem;font-weight:700}
[data-vibeui-block="pricing-024"] [data-part="action"]{display:inline-flex;justify-content:center;align-items:center;margin-top:.6rem;padding:.85rem 1.2rem;border-radius:999px;font-weight:700;text-decoration:none;color:inherit;box-shadow:0 0 0 1px var(--vibeui-pricing-024-line) inset;transition:transform .18s,filter .18s}
[data-vibeui-block="pricing-024"] [data-part="card"][data-premium="true"] [data-part="action"]{background:var(--vibeui-pricing-024-accent);color:var(--vibeui-pricing-024-on-accent);box-shadow:none}
[data-vibeui-block="pricing-024"] [data-part="action"]:hover{transform:translateY(-1px);filter:brightness(1.05)}
[data-vibeui-block="pricing-024"] [data-part="table"]{margin-top:1.5rem;border-radius:1.2rem;overflow:hidden;box-shadow:0 0 0 1px var(--vibeui-pricing-024-line);background:var(--vibeui-pricing-024-card);text-align:left}
[data-vibeui-block="pricing-024"] [data-part="row"]{display:grid;grid-template-columns:1fr 5rem 5rem;align-items:center;gap:.5rem;padding:.8rem 1.2rem;border-top:1px solid var(--vibeui-pricing-024-line);font-size:.92rem}
[data-vibeui-block="pricing-024"] [data-part="row"]:first-child{border-top:0;font-family:var(--vibeui-pricing-024-mono);font-size:.68rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-pricing-024-muted)}
[data-vibeui-block="pricing-024"] [data-part="row"] span:not(:first-child){text-align:center}
[data-vibeui-block="pricing-024"] [data-part="yes"]{display:inline-grid;place-items:center;width:1.5rem;height:1.5rem;border-radius:50%;background:color-mix(in oklab,var(--vibeui-pricing-024-accent) 15%,transparent);color:var(--vibeui-pricing-024-accent);font-size:.8rem;font-weight:700}
[data-vibeui-block="pricing-024"] [data-part="no"]{color:var(--vibeui-pricing-024-line);font-size:1.1rem}
[data-vibeui-block="pricing-024"] button:focus-visible,[data-vibeui-block="pricing-024"] a:focus-visible{outline:2px solid var(--vibeui-pricing-024-accent);outline-offset:2px}
@keyframes vibeui-pricing-024-slide{from{transform:translateY(50%);opacity:0}to{transform:none;opacity:1}}
@container (min-width: 44rem){[data-vibeui-block="pricing-024"] [data-part="cards"]{grid-template-columns:1fr 1fr}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-024"] *{animation:none!important;transition:none!important}}`

/** Тарифы приложения: бесплатно и премиум с переключателем и таблицей. */
export function Pricing024({
  eyebrow = "Тарифы",
  title = "Бесплатно хватает. Премиум — если хочется больше",
  lede = "Дыхание и будильник бесплатны навсегда. Премиум — анализ сна по фазам, серии и семейный доступ.",
  freeName = "Бесплатно",
  freePrice = "0 ₽",
  premiumName = "Премиум",
  premiumMonthly = "299 ₽",
  premiumYearly = "1 990 ₽",
  monthlyLabel = "в месяц",
  yearlyLabel = "в год",
  yearlyNote = "−45 %",
  trial = "7 дней бесплатно",
  features = [
    { label: "Дыхательные практики", free: true, premium: true },
    { label: "Умный будильник", free: true, premium: true },
    { label: "Сон по фазам", free: false, premium: true },
    { label: "Серии и напоминания", free: "7 дней", premium: "без лимита" },
    { label: "Семейный доступ", free: false, premium: "до 5" },
    { label: "Экспорт данных", free: false, premium: true },
  ],
  freeAction = "Скачать",
  premiumAction = "Попробовать 7 дней",
  premiumHref = "#",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Pricing024Props) {
  const [yearly, setYearly] = useState(false)
  const palette = {
    ...(accent ? { "--vibeui-pricing-024-accent": accent } : null),
    ...(ink ? { "--vibeui-pricing-024-fg": ink } : null),
    ...(background ? { "--vibeui-pricing-024-bg": background } : null),
    ...style,
  } as CSSProperties
  const cell = (value: boolean | string) => (value === true ? <span data-part="yes">✓</span> : value === false ? <span data-part="no">—</span> : <span>{value}</span>)

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-pricing-024" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="pricing-024" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="switch" role="group" aria-label="Период оплаты">
            <button type="button" aria-pressed={!yearly} onClick={() => setYearly(false)}>
              {monthlyLabel}
            </button>
            <button type="button" aria-pressed={yearly} onClick={() => setYearly(true)}>
              {yearlyLabel}
            </button>
            {yearlyNote ? <small>{yearlyNote}</small> : null}
          </div>
          <div data-part="cards">
            <div data-part="card">
              <h3>{freeName}</h3>
              <div data-part="price">
                <b>{freePrice}</b>
              </div>
              <a data-part="action" href="#">
                {freeAction}
              </a>
            </div>
            <div data-part="card" data-premium="true">
              {trial ? <span data-part="trial">{trial}</span> : null}
              <h3>{premiumName}</h3>
              <div data-part="price">
                <b key={yearly ? "y" : "m"}>{yearly ? premiumYearly : premiumMonthly}</b>
                <span>{yearly ? yearlyLabel : monthlyLabel}</span>
              </div>
              <a data-part="action" href={premiumHref}>
                {premiumAction}
              </a>
            </div>
          </div>
          <div data-part="table">
            <div data-part="row">
              <span>функция</span>
              <span>{freeName}</span>
              <span>{premiumName}</span>
            </div>
            {features.map((feature) => (
              <div key={feature.label} data-part="row">
                <span>{feature.label}</span>
                {cell(feature.free)}
                {cell(feature.premium)}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

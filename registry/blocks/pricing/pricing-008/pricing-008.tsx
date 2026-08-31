import type { CSSProperties } from "react"

export type Pricing008Props = {
  title?: string
  lede?: string
  free?: {
    name: string
    price: string
    caption: string
    features: string[]
    action: { label: string; href: string }
  }
  paid?: {
    name: string
    price: string
    period: string
    caption: string
    features: string[]
    extra: string[]
    action: { label: string; href: string }
  }
  note?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: только два варианта — бесплатный и платный, и разница между
// ними видна с одного взгляда. Платная карточка залита тёмным, бесплатная
// остаётся светлой: контраст материала работает быстрее, чем цветная рамка.
// В платной список делится на две части — «всё из бесплатного» и «и ещё»:
// повторять общие пункты во второй колонке значит заставлять сравнивать
// строки глазами. Кнопки прижаты к низу, поэтому карточки заканчиваются ровно.
const STYLES = `
:where([data-vibeui-block="pricing-008"]){
--vibeui-pricing-008-bg:oklch(0.97 0.004 285);
--vibeui-pricing-008-fg:oklch(0.19 0.014 285);
--vibeui-pricing-008-muted:oklch(0.51 0.014 285);
--vibeui-pricing-008-card:oklch(1 0 0);
--vibeui-pricing-008-line:oklch(0.89 0.008 285);
--vibeui-pricing-008-dark:oklch(0.22 0.03 285);
--vibeui-pricing-008-darkfg:oklch(0.98 0.004 285);
--vibeui-pricing-008-darkmuted:oklch(0.74 0.016 285);
--vibeui-pricing-008-accent:oklch(0.7 0.17 300);
--vibeui-pricing-008-accent-fg:oklch(0.18 0.04 300);
--vibeui-pricing-008-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="pricing-008"]{
box-sizing:border-box;background:var(--vibeui-pricing-008-bg);color:var(--vibeui-pricing-008-fg);
font-family:var(--vibeui-pricing-008-sans);
}
[data-vibeui-block="pricing-008"] *{box-sizing:border-box}
[data-vibeui-block="pricing-008"] [data-part="shell"]{max-width:58rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="pricing-008"] [data-part="head"]{max-width:34rem;margin:0 auto 2.25rem;text-align:center}
[data-vibeui-block="pricing-008"] h2{
margin:0;font-size:clamp(1.5rem,4.2cqi,2.25rem);line-height:1.14;letter-spacing:-0.025em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="pricing-008"] [data-part="lede"]{margin:0.875rem 0 0;font-size:0.9375rem;line-height:1.6;color:var(--vibeui-pricing-008-muted);text-wrap:pretty}
[data-vibeui-block="pricing-008"] [data-part="pair"]{display:grid;grid-template-columns:1fr;gap:1rem}
[data-vibeui-block="pricing-008"] [data-part="card"]{
display:flex;flex-direction:column;padding:1.75rem;border-radius:1.25rem;
border:1px solid var(--vibeui-pricing-008-line);background:var(--vibeui-pricing-008-card);
}
[data-vibeui-block="pricing-008"] [data-paid="true"]{
border-color:transparent;background:var(--vibeui-pricing-008-dark);color:var(--vibeui-pricing-008-darkfg);
}
[data-vibeui-block="pricing-008"] h3{margin:0;font-size:1rem;font-weight:700;letter-spacing:-0.005em}
[data-vibeui-block="pricing-008"] [data-part="price"]{
display:flex;align-items:baseline;gap:0.375rem;margin:0.875rem 0 0;
font-size:2.5rem;font-weight:700;letter-spacing:-0.045em;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pricing-008"] [data-part="period"]{font-size:0.8125rem;font-weight:500;letter-spacing:0;color:var(--vibeui-pricing-008-muted)}
[data-vibeui-block="pricing-008"] [data-paid="true"] [data-part="period"]{color:var(--vibeui-pricing-008-darkmuted)}
[data-vibeui-block="pricing-008"] [data-part="caption"]{margin:0.5rem 0 0;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-pricing-008-muted)}
[data-vibeui-block="pricing-008"] [data-paid="true"] [data-part="caption"]{color:var(--vibeui-pricing-008-darkmuted)}
[data-vibeui-block="pricing-008"] [data-part="feats"]{list-style:none;margin:1.25rem 0 0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="pricing-008"] [data-part="feats"] li{display:flex;align-items:flex-start;gap:0.5rem;font-size:0.875rem;line-height:1.5}
[data-vibeui-block="pricing-008"] [data-part="tick"]{flex:0 0 auto;margin-top:0.25rem;color:var(--vibeui-pricing-008-accent)}
[data-vibeui-block="pricing-008"] [data-part="card"] [data-part="tick"]{color:color-mix(in oklab,var(--vibeui-pricing-008-accent) 70%,black)}
[data-vibeui-block="pricing-008"] [data-paid="true"] [data-part="tick"]{color:var(--vibeui-pricing-008-accent)}
[data-vibeui-block="pricing-008"] [data-part="divider"]{
margin:1.25rem 0 0;padding-top:1rem;border-top:1px solid oklch(1 0 0 / 16%);
font-size:0.6875rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--vibeui-pricing-008-darkmuted);
}
[data-vibeui-block="pricing-008"] a{
display:inline-flex;align-items:center;justify-content:center;margin-top:auto;height:2.75rem;border-radius:0.75rem;
font-size:0.9375rem;font-weight:650;text-decoration:none;transition:opacity .16s ease,border-color .16s ease;
}
[data-vibeui-block="pricing-008"] [data-part="cta"]{margin-top:1.5rem}
[data-vibeui-block="pricing-008"] [data-part="card"] a{border:1px solid var(--vibeui-pricing-008-line);color:var(--vibeui-pricing-008-fg)}
[data-vibeui-block="pricing-008"] [data-paid="true"] a{border:0;background:var(--vibeui-pricing-008-accent);color:var(--vibeui-pricing-008-accent-fg)}
[data-vibeui-block="pricing-008"] a:hover{opacity:.88}
[data-vibeui-block="pricing-008"] a:focus-visible{outline:2px solid var(--vibeui-pricing-008-accent);outline-offset:3px}
[data-vibeui-block="pricing-008"] [data-part="note"]{margin:1.5rem 0 0;text-align:center;font-size:0.8125rem;color:var(--vibeui-pricing-008-muted)}
@container (min-width: 34rem){
[data-vibeui-block="pricing-008"] [data-part="shell"]{padding:5rem 2rem}
}
@container (min-width: 48rem){
[data-vibeui-block="pricing-008"] [data-part="pair"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem}
[data-vibeui-block="pricing-008"] [data-part="card"]{padding:2.25rem}
[data-vibeui-block="pricing-008"] [data-part="shell"]{padding:6rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FREE = {
  name: "Бесплатно",
  price: "0 ₽",
  caption: "Хватает, чтобы собрать один лендинг и понять, подходит ли подход.",
  features: [
    "10 секций на выбор",
    "Один проект",
    "Инструкция для агента",
    "Обновления каталога",
  ],
  action: { label: "Начать без карты", href: "#" },
}

const DEFAULT_PAID = {
  name: "Полный доступ",
  price: "1 490 ₽",
  period: "в месяц",
  caption: "Для тех, кто собирает страницы регулярно, а не один раз.",
  features: ["Всё из бесплатного тарифа"],
  extra: [
    "Все 1 080 секций каталога",
    "Неограниченное число проектов",
    "Приватные пресеты палитры",
    "Поддержка за один рабочий день",
  ],
  action: { label: "Оформить подписку", href: "#" },
}

function Tick() {
  return (
    <span data-part="tick" aria-hidden="true">
      <svg viewBox="0 0 16 16" width="12" height="12">
        <path
          d="M3.5 8.5 6.5 11.5 12.5 4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

/** Бесплатный тариф рядом с платным: светлая карточка против тёмной, без третьего варианта. */
export function Pricing008({
  title = "Два варианта, между которыми легко выбрать",
  lede = "Бесплатный тариф не урезан по качеству — он урезан по объёму. Платный снимает лимиты.",
  free = DEFAULT_FREE,
  paid = DEFAULT_PAID,
  note = "Перейти с бесплатного на платный можно в любой момент — установленные секции остаются вашими.",
  accent,
  className,
  style,
}: Pricing008Props) {
  const palette = {
    ...(accent ? { "--vibeui-pricing-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-pricing-008" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="pricing-008"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>

          <div data-part="pair">
            <article data-part="card">
              <h3>{free.name}</h3>
              <p data-part="price">{free.price}</p>
              <p data-part="caption">{free.caption}</p>
              <ul data-part="feats">
                {free.features.slice(0, 6).map((feature) => (
                  <li key={feature}>
                    <Tick />
                    {feature}
                  </li>
                ))}
              </ul>
              <a data-part="cta" href={free.action.href}>
                {free.action.label}
              </a>
            </article>

            <article data-part="card" data-paid="true">
              <h3>{paid.name}</h3>
              <p data-part="price">
                {paid.price}
                <span data-part="period">{paid.period}</span>
              </p>
              <p data-part="caption">{paid.caption}</p>
              <ul data-part="feats">
                {paid.features.slice(0, 3).map((feature) => (
                  <li key={feature}>
                    <Tick />
                    {feature}
                  </li>
                ))}
              </ul>
              <p data-part="divider">И сверх того</p>
              <ul data-part="feats">
                {paid.extra.slice(0, 6).map((feature) => (
                  <li key={feature}>
                    <Tick />
                    {feature}
                  </li>
                ))}
              </ul>
              <a data-part="cta" href={paid.action.href}>
                {paid.action.label}
              </a>
            </article>
          </div>

          {note ? <p data-part="note">{note}</p> : null}
        </div>
      </section>
    </>
  )
}

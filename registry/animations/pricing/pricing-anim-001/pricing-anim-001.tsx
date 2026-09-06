import type { ComponentProps, CSSProperties } from "react"

export type PricingAnim001Plan = {
  name: string
  price: string
  period?: string
  features: string[]
  ctaLabel?: string
  /** Выделенный (рекомендованный) тариф — один на набор. */
  popular?: boolean
}

export type PricingAnim001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  /** Плашка на выделенном тарифе. */
  popularLabel?: string
  title?: string
  description?: string
  plans?: PricingAnim001Plan[]
  accent?: string
}

// Идея: полноширинная секция тарифов — 2–3 карточки в ряд, одна выделена
// как популярная. Карточки въезжают по очереди по мере прокрутки секции в
// вид (scroll-driven view-timeline, тот же приём, что у activity-001):
// анимацией управляет прогресс входа секции в экран, а не таймер, и на
// браузерах без поддержки карточки сразу видны в конечном состоянии.
// Выделенная карточка держит независимое дыхание рамки и мягкого свечения.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит секцию в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
//
// container-type делает секцию собственным query-контейнером: сетка
// переключается со столбца на три колонки по её ширине, а не по окну.
const STYLES = `
:where([data-vibeui-block="pricing-anim-001"]){
--vibeui-pricing-anim-001-bg:transparent;
--vibeui-pricing-anim-001-card:light-dark(oklch(1 0 0),oklch(0.215 0 285));
--vibeui-pricing-anim-001-fg:light-dark(oklch(0.2 0 285),oklch(0.96 0 285));
--vibeui-pricing-anim-001-muted:light-dark(oklch(0.5 0 285),oklch(0.72 0 285));
--vibeui-pricing-anim-001-border:light-dark(oklch(0.9 0 285),oklch(0.34 0 285));
--vibeui-pricing-anim-001-accent:light-dark(oklch(0.55 0.19 295),oklch(0.74 0.16 295));
--vibeui-pricing-anim-001-accent-fg:light-dark(oklch(0.99 0 285),oklch(0.17 0 295));
--vibeui-pricing-anim-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-anim-001"]{color-scheme:dark}
[data-vibeui-block="pricing-anim-001"]{
display:block;box-sizing:border-box;width:100%;min-width:min(100%,16rem);
background:var(--vibeui-pricing-anim-001-bg);color:var(--vibeui-pricing-anim-001-fg);
font-family:var(--vibeui-pricing-anim-001-font);
container-type:inline-size;
}
[data-vibeui-block="pricing-anim-001"] *{box-sizing:border-box}
[data-vibeui-block="pricing-anim-001"] [data-part="frame"]{
padding:clamp(2.5rem,10cqi,5rem) clamp(1.25rem,6cqi,2.5rem);
view-timeline:--vibeui-pricing-anim-001 block;
}
[data-vibeui-block="pricing-anim-001"] [data-part="head"]{
max-width:36rem;margin:0 auto;text-align:center;
}
[data-vibeui-block="pricing-anim-001"] [data-part="title"]{
margin:0;font-size:clamp(1.75rem,5.5cqi,2.625rem);line-height:1.15;
font-weight:650;letter-spacing:-0.015em;text-wrap:balance;
}
[data-vibeui-block="pricing-anim-001"] [data-part="desc"]{
margin:0.75rem 0 0;font-size:clamp(0.9375rem,2cqi,1.0625rem);
line-height:1.6;color:var(--vibeui-pricing-anim-001-muted);text-wrap:pretty;
}
[data-vibeui-block="pricing-anim-001"] [data-part="grid"]{
display:grid;grid-template-columns:1fr;gap:1.25rem;
max-width:64rem;margin:2.5rem auto 0;list-style:none;padding:0;
}
@container (min-width:52rem){
[data-vibeui-block="pricing-anim-001"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
[data-vibeui-block="pricing-anim-001"] [data-part="card"]{
position:relative;display:flex;flex-direction:column;
padding:1.75rem;border-radius:1.25rem;border:1px solid var(--vibeui-pricing-anim-001-border);
background:var(--vibeui-pricing-anim-001-card);
opacity:0;transform:translateY(18px);
animation:vibeui-pricing-anim-001-rise linear both;
animation-timeline:--vibeui-pricing-anim-001;
animation-range:entry 0% entry 45%;
}
[data-vibeui-block="pricing-anim-001"] [data-part="card"]:nth-child(2){animation-range:entry 8% entry 53%}
[data-vibeui-block="pricing-anim-001"] [data-part="card"]:nth-child(3){animation-range:entry 16% entry 61%}
[data-vibeui-block="pricing-anim-001"] [data-part="card"][data-popular="true"]{
border-color:color-mix(in oklab,var(--vibeui-pricing-anim-001-accent) 55%,transparent);
box-shadow:0 0 0 1px color-mix(in oklab,var(--vibeui-pricing-anim-001-accent) 30%,transparent);
animation:vibeui-pricing-anim-001-rise linear both,vibeui-pricing-anim-001-glow 3.6s ease-in-out infinite;
animation-timeline:--vibeui-pricing-anim-001,auto;
}
[data-vibeui-block="pricing-anim-001"] [data-part="badge"]{
position:absolute;top:-0.75rem;left:50%;transform:translateX(-50%);
padding:0.25rem 0.75rem;border-radius:9999px;
background:var(--vibeui-pricing-anim-001-accent);color:var(--vibeui-pricing-anim-001-accent-fg);
font-size:0.6875rem;font-weight:700;letter-spacing:0.02em;text-transform:uppercase;
}
[data-vibeui-block="pricing-anim-001"] [data-part="name"]{
margin:0;font-size:1.0625rem;font-weight:650;
}
[data-vibeui-block="pricing-anim-001"] [data-part="price-row"]{
display:flex;align-items:baseline;gap:0.25rem;margin-top:0.875rem;
}
[data-vibeui-block="pricing-anim-001"] [data-part="price"]{
font-size:clamp(1.875rem,5cqi,2.5rem);font-weight:700;letter-spacing:-0.02em;
}
[data-vibeui-block="pricing-anim-001"] [data-part="period"]{
font-size:0.875rem;color:var(--vibeui-pricing-anim-001-muted);
}
[data-vibeui-block="pricing-anim-001"] [data-part="features"]{
display:flex;flex-direction:column;gap:0.625rem;margin:1.5rem 0 0;padding:0;list-style:none;flex:1;
}
[data-vibeui-block="pricing-anim-001"] [data-part="feature"]{
display:flex;align-items:flex-start;gap:0.5rem;font-size:0.875rem;line-height:1.5;
}
[data-vibeui-block="pricing-anim-001"] [data-part="feature"] svg{
width:1rem;height:1rem;flex:none;margin-top:0.125rem;color:var(--vibeui-pricing-anim-001-accent);
}
[data-vibeui-block="pricing-anim-001"] [data-part="cta"]{
display:inline-flex;align-items:center;justify-content:center;
height:2.75rem;margin-top:1.75rem;border-radius:0.75rem;
font-size:0.9375rem;font-weight:600;text-decoration:none;
border:1px solid var(--vibeui-pricing-anim-001-border);color:var(--vibeui-pricing-anim-001-fg);
}
[data-vibeui-block="pricing-anim-001"] [data-part="card"][data-popular="true"] [data-part="cta"]{
border-color:transparent;background:var(--vibeui-pricing-anim-001-accent);color:var(--vibeui-pricing-anim-001-accent-fg);
}
@keyframes vibeui-pricing-anim-001-rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes vibeui-pricing-anim-001-glow{
0%,100%{box-shadow:0 0 0 1px color-mix(in oklab,var(--vibeui-pricing-anim-001-accent) 30%,transparent),0 0 0 0 transparent}
50%{box-shadow:0 0 0 1px color-mix(in oklab,var(--vibeui-pricing-anim-001-accent) 45%,transparent),0 0.75rem 2rem -0.75rem color-mix(in oklab,var(--vibeui-pricing-anim-001-accent) 55%,transparent)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="pricing-anim-001"] [data-part="card"]{animation:none;opacity:1;transform:none}
}
`

const CHECK = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

const DEFAULT_PLANS: PricingAnim001Plan[] = [
  {
    name: "Старт",
    price: "0 ₽",
    features: ["1 проект", "До 3 участников", "Базовая аналитика"],
    ctaLabel: "Начать бесплатно",
  },
  {
    name: "Про",
    price: "1 990 ₽",
    period: "/мес",
    features: [
      "Безлимит проектов",
      "До 20 участников",
      "Расширенная аналитика",
      "Приоритетная поддержка",
    ],
    ctaLabel: "Оформить Про",
    popular: true,
  },
  {
    name: "Бизнес",
    price: "4 990 ₽",
    period: "/мес",
    features: ["Всё из Про", "SSO и роли", "Выделенный менеджер", "SLA 99.9%"],
    ctaLabel: "Связаться с продажами",
  },
]

/**
 * Секция тарифов: 2–3 карточки въезжают по мере прокрутки, выделенный план
 * держит дышащее свечение рамки. Один файл, ноль зависимостей, собственная
 * палитра.
 */
export function PricingAnim001({
  popularLabel = "Популярно",
  title = "Тарифы, которые растут вместе с вами",
  description = "Начните бесплатно и переходите на старший план, когда команде понадобится больше.",
  plans = DEFAULT_PLANS,
  accent,
  className,
  style,
  ...props
}: PricingAnim001Props) {
  const palette = {
    ...(accent ? { "--vibeui-pricing-anim-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-pricing-anim-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="pricing-anim-001"
        data-slot="pricing"
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <div data-part="head">
            <h2 data-part="title">{title}</h2>
            {description ? <p data-part="desc">{description}</p> : null}
          </div>
          <ul data-part="grid">
            {plans.map((plan) => (
              <li
                data-part="card"
                data-popular={plan.popular ? "true" : undefined}
                key={plan.name}
              >
                {plan.popular ? (
                  <span data-part="badge">{popularLabel}</span>
                ) : null}
                <p data-part="name">{plan.name}</p>
                <div data-part="price-row">
                  <span data-part="price">{plan.price}</span>
                  {plan.period ? (
                    <span data-part="period">{plan.period}</span>
                  ) : null}
                </div>
                <ul data-part="features">
                  {plan.features.map((feature) => (
                    <li data-part="feature" key={feature}>
                      {CHECK}
                      {feature}
                    </li>
                  ))}
                </ul>
                <a data-part="cta" href="#">
                  {plan.ctaLabel ?? "Выбрать план"}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

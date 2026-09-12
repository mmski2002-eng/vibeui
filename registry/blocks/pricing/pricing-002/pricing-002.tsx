import type { CSSProperties } from "react"

export type Pricing002Plan = {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  action: { label: string; href: string }
  featured?: boolean
  badge?: string
}

export type Pricing002Props = {
  eyebrow?: string
  title?: string
  lede?: string
  plans?: Pricing002Plan[]
  note?: string
  accent?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

// Идея блока: три тарифа, где рекомендованный выделен не только цветом.
// Он поднят над соседями отрицательным отступом и несёт бейдж словами —
// цвет один не работает для дальтоника и не переживёт печать. Карточки —
// flex-колонки с кнопкой, прижатой к низу через margin-top:auto, поэтому
// нижний край ровный даже при разном числе пунктов. Списки помечены
// role="list" не зря: list-style:none в Safari снимает роль списка.
const STYLES = `
:where([data-vibeui-block="pricing-002"]){
--vibeui-pricing-002-bg:transparent;
--vibeui-pricing-002-fg:light-dark(oklch(0.2 0 265),oklch(0.95 0 265));
--vibeui-pricing-002-muted:light-dark(oklch(0.52 0 265),oklch(0.72 0 265));
--vibeui-pricing-002-card:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-pricing-002-line:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-pricing-002-accent:light-dark(oklch(0.28 0 0),oklch(0.901 0 0));
--vibeui-pricing-002-accent-fg:oklch(from var(--vibeui-pricing-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-pricing-002-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-002"]{color-scheme:dark}
[data-vibeui-block="pricing-002"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-pricing-002-bg);color:var(--vibeui-pricing-002-fg);
font-family:var(--vibeui-pricing-002-sans);
}
[data-vibeui-block="pricing-002"] *{box-sizing:border-box}
[data-vibeui-block="pricing-002"] [data-part="shell"]{max-width:70rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="pricing-002"] [data-part="head"]{max-width:36rem;margin:0 auto 2.25rem;text-align:center}
[data-vibeui-block="pricing-002"] [data-part="eyebrow"]{
margin:0 0 0.75rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-pricing-002-accent);
}
[data-vibeui-block="pricing-002"] h2{
margin:0;font-size:clamp(1.5rem,4.2cqi,2.375rem);line-height:1.12;letter-spacing:-0.025em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="pricing-002"] [data-part="lede"]{
margin:0.875rem 0 0;font-size:clamp(0.9375rem,1.3cqi,1.0625rem);line-height:1.6;
color:var(--vibeui-pricing-002-muted);text-wrap:pretty;
}
[data-vibeui-block="pricing-002"] [data-part="plans"]{
list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr;gap:1rem;align-items:stretch;
}
[data-vibeui-block="pricing-002"] [data-part="plan"]{
position:relative;display:flex;flex-direction:column;padding:1.75rem;
border:1px solid var(--vibeui-pricing-002-line);border-radius:1.125rem;background:var(--vibeui-pricing-002-card);
}
[data-vibeui-block="pricing-002"] [data-featured="true"]{
border-color:var(--vibeui-pricing-002-accent);border-width:2px;
box-shadow:0 12px 40px color-mix(in oklab,var(--vibeui-pricing-002-accent) 16%,transparent);
}
[data-vibeui-block="pricing-002"] [data-part="badge"]{
position:absolute;top:-0.75rem;left:1.75rem;padding:0.25rem 0.625rem;border-radius:9999px;
background:var(--vibeui-pricing-002-accent);color:oklch(from var(--vibeui-pricing-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-size:0.6875rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
}
[data-vibeui-block="pricing-002"] h3{margin:0;font-size:1.0625rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="pricing-002"] [data-part="desc"]{margin:0.375rem 0 0;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-pricing-002-muted)}
[data-vibeui-block="pricing-002"] [data-part="price"]{
display:flex;align-items:baseline;gap:0.375rem;margin:1.25rem 0 0;
font-size:2.25rem;font-weight:700;letter-spacing:-0.04em;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pricing-002"] [data-part="period"]{font-size:0.8125rem;font-weight:500;letter-spacing:0;color:var(--vibeui-pricing-002-muted)}
[data-vibeui-block="pricing-002"] [data-part="feats"]{list-style:none;margin:1.25rem 0 0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="pricing-002"] [data-part="feats"] li{display:flex;align-items:flex-start;gap:0.5rem;font-size:0.875rem;line-height:1.5}
[data-vibeui-block="pricing-002"] [data-part="tick"]{flex:0 0 auto;margin-top:0.25rem;color:var(--vibeui-pricing-002-accent)}
[data-vibeui-block="pricing-002"] a{
display:inline-flex;align-items:center;justify-content:center;margin-top:auto;padding-top:0;
height:2.75rem;border-radius:0.625rem;font-size:0.9375rem;font-weight:650;text-decoration:none;
border:1px solid var(--vibeui-pricing-002-line);color:var(--vibeui-pricing-002-fg);
transition:background-color .16s ease,border-color .16s ease,color .16s ease;
}
[data-vibeui-block="pricing-002"] [data-part="cta"]{margin-top:1.5rem}
[data-vibeui-block="pricing-002"] a:hover{border-color:var(--vibeui-pricing-002-fg)}
[data-vibeui-block="pricing-002"] [data-featured="true"] a{
background:var(--vibeui-pricing-002-accent);color:oklch(from var(--vibeui-pricing-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);border-color:transparent;
}
[data-vibeui-block="pricing-002"] [data-featured="true"] a:hover{background:color-mix(in oklab,var(--vibeui-pricing-002-accent) 86%,black)}
[data-vibeui-block="pricing-002"] a:focus-visible{outline:2px solid var(--vibeui-pricing-002-accent);outline-offset:3px}
[data-vibeui-block="pricing-002"] [data-part="note"]{margin:1.5rem 0 0;text-align:center;font-size:0.8125rem;color:var(--vibeui-pricing-002-muted)}
@container (min-width: 34rem){
[data-vibeui-block="pricing-002"] [data-part="shell"]{padding:5rem 2rem}
}
@container (min-width: 58rem){
[data-vibeui-block="pricing-002"] [data-part="plans"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1.25rem;align-items:center}
[data-vibeui-block="pricing-002"] [data-featured="true"]{padding-top:2.5rem;padding-bottom:2.5rem}
[data-vibeui-block="pricing-002"] [data-part="shell"]{padding:6rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PLANS: Pricing002Plan[] = [
  {
    name: "Старт",
    price: "0 ₽",
    period: "навсегда",
    description: "Для личных проектов и проверки гипотез.",
    features: [
      "10 секций на проект",
      "Копирование инструкции для агента",
      "Обновления каталога",
    ],
    action: { label: "Начать бесплатно", href: "#" },
  },
  {
    name: "Команда",
    price: "1 490 ₽",
    period: "в месяц",
    description:
      "Для продуктовых команд, которые запускают лендинги регулярно.",
    features: [
      "Все секции каталога",
      "До пяти участников",
      "Приватные пресеты палитры",
      "Приоритетная поддержка",
    ],
    action: { label: "Попробовать 14 дней", href: "#" },
    featured: true,
    badge: "Рекомендуем",
  },
  {
    name: "Агентство",
    price: "4 900 ₽",
    period: "в месяц",
    description: "Для студий, которые сдают проекты клиентам.",
    features: [
      "Безлимит участников",
      "Передача секций клиенту",
      "Отдельный менеджер",
      "Счета и закрывающие документы",
    ],
    action: { label: "Связаться", href: "#" },
  },
]

/** Три тарифа с выделенным рекомендованным: бейдж словами, а не только цвет. */
export function Pricing002({
  eyebrow = "Тарифы",
  title = "Платите за скорость, а не за количество компонентов",
  lede = "Каталог один и тот же на всех тарифах. Разница — в числе проектов, участников и в поддержке.",
  plans = DEFAULT_PLANS,
  note = "Цены указаны без НДС. Годовая оплата — минус два месяца.",
  accent,
  background = "",
  className,
  style,
}: Pricing002Props) {
  const palette = {
    ...(accent ? { "--vibeui-pricing-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pricing-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-pricing-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="pricing-002"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2>{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>

          <ul data-part="plans">
            {plans.slice(0, 3).map((plan) => (
              <li
                key={plan.name}
                data-part="plan"
                data-featured={plan.featured ? "true" : undefined}
              >
                {plan.badge ? (
                  <span data-part="badge">{plan.badge}</span>
                ) : null}
                <h3>{plan.name}</h3>
                <p data-part="desc">{plan.description}</p>
                <p data-part="price">
                  {plan.price}
                  <span data-part="period">{plan.period}</span>
                </p>
                <ul data-part="feats">
                  {plan.features.slice(0, 6).map((feature) => (
                    <li key={feature}>
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
                      {feature}
                    </li>
                  ))}
                </ul>
                <a data-part="cta" href={plan.action.href}>
                  {plan.action.label}
                </a>
              </li>
            ))}
          </ul>

          {note ? <p data-part="note">{note}</p> : null}
        </div>
      </section>
    </>
  )
}

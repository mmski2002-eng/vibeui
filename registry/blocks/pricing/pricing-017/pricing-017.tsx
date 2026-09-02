import type { CSSProperties } from "react"

export type Pricing017Plan = {
  name: string
  price: string
  period: string
  summary: string
  features: string[]
  action: { label: string; href: string }
  featured?: boolean
}

export type Pricing017Props = {
  eyebrow?: string
  title?: string
  hint?: string
  plans?: Pricing017Plan[]
  /** Подпись ленты для скринридера. */
  trackLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: тарифы, свёрстанные под палец. На узкой ширине карточки лежат
// в горизонтальной ленте со scroll-snap: карточка занимает почти весь экран
// и «прилипает» к краю, поэтому пролистывание попадает точно в карточку, а не
// в промежуток. Ползунок прокрутки скрыт, зато под лентой стоит подсказка о
// свайпе — невидимая прокрутка без подсказки выглядит как обрезанная вёрстка.
// От 52rem лента превращается в обычную сетку, и snap отключается.
const STYLES = `
:where([data-vibeui-block="pricing-017"]){
--vibeui-pricing-017-bg:transparent;
--vibeui-pricing-017-fg:light-dark(oklch(0.2 0.012 255),oklch(0.94 0.005 255));
--vibeui-pricing-017-muted:light-dark(oklch(0.51 0.012 255),oklch(0.7 0.01 255));
--vibeui-pricing-017-card:light-dark(oklch(1 0 0),oklch(0.25 0.011 255));
--vibeui-pricing-017-line:light-dark(oklch(0.89 0.006 255),oklch(0.37 0.011 255));
--vibeui-pricing-017-accent:light-dark(oklch(0.51 0.17 255),oklch(0.75 0.14 255));
--vibeui-pricing-017-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.19 0.03 255));
--vibeui-pricing-017-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="pricing-017"]{
box-sizing:border-box;background:var(--vibeui-pricing-017-bg);color:var(--vibeui-pricing-017-fg);
font-family:var(--vibeui-pricing-017-sans);
}
[data-vibeui-block="pricing-017"] *{box-sizing:border-box}
[data-vibeui-block="pricing-017"] [data-part="shell"]{max-width:66rem;width:100%;margin:0 auto;padding:3rem 0}
[data-vibeui-block="pricing-017"] [data-part="head"]{padding:0 1.25rem;margin-bottom:1.5rem}
[data-vibeui-block="pricing-017"] [data-part="eyebrow"]{
margin:0 0 0.625rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-pricing-017-accent);
}
[data-vibeui-block="pricing-017"] h2{
margin:0;max-width:20ch;font-size:clamp(1.375rem,4.6cqi,2.125rem);line-height:1.16;letter-spacing:-0.025em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="pricing-017"] [data-part="track"]{
display:flex;gap:0.875rem;padding:0.25rem 1.25rem 1rem;
overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding-left:1.25rem;
scrollbar-width:none;-webkit-overflow-scrolling:touch;
}
[data-vibeui-block="pricing-017"] [data-part="track"]::-webkit-scrollbar{display:none}
[data-vibeui-block="pricing-017"] [data-part="plan"]{
flex:0 0 min(85%,19rem);scroll-snap-align:start;
display:flex;flex-direction:column;padding:1.5rem;border-radius:1.125rem;
border:1px solid var(--vibeui-pricing-017-line);background:var(--vibeui-pricing-017-card);
}
[data-vibeui-block="pricing-017"] [data-featured="true"]{border-color:var(--vibeui-pricing-017-accent);border-width:2px}
[data-vibeui-block="pricing-017"] h3{margin:0;font-size:1rem;font-weight:700}
[data-vibeui-block="pricing-017"] [data-part="price"]{
display:flex;align-items:baseline;gap:0.375rem;margin:0.875rem 0 0;
font-size:2rem;font-weight:700;letter-spacing:-0.04em;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pricing-017"] [data-part="period"]{font-size:0.8125rem;font-weight:500;letter-spacing:0;color:var(--vibeui-pricing-017-muted)}
[data-vibeui-block="pricing-017"] [data-part="summary"]{margin:0.5rem 0 0;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-pricing-017-muted)}
[data-vibeui-block="pricing-017"] ul{list-style:none;margin:1.125rem 0 0;padding:0;display:grid;gap:0.4375rem}
[data-vibeui-block="pricing-017"] li{display:flex;align-items:flex-start;gap:0.5rem;font-size:0.8125rem;line-height:1.5}
[data-vibeui-block="pricing-017"] [data-part="dot"]{flex:0 0 auto;margin-top:0.4375rem;width:0.3125rem;height:0.3125rem;border-radius:9999px;background:var(--vibeui-pricing-017-accent)}
[data-vibeui-block="pricing-017"] a{
display:inline-flex;align-items:center;justify-content:center;margin-top:auto;height:2.625rem;border-radius:0.625rem;
border:1px solid var(--vibeui-pricing-017-line);color:var(--vibeui-pricing-017-fg);
font-size:0.9375rem;font-weight:650;text-decoration:none;transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="pricing-017"] [data-part="cta"]{margin-top:1.25rem}
[data-vibeui-block="pricing-017"] [data-featured="true"] a{background:var(--vibeui-pricing-017-accent);color:var(--vibeui-pricing-017-accent-fg);border-color:transparent}
[data-vibeui-block="pricing-017"] a:focus-visible{outline:2px solid var(--vibeui-pricing-017-accent);outline-offset:3px}
[data-vibeui-block="pricing-017"] [data-part="hint"]{
display:flex;align-items:center;gap:0.4375rem;margin:0;padding:0 1.25rem;
font-size:0.75rem;color:var(--vibeui-pricing-017-muted);
}
@container (min-width: 52rem){
[data-vibeui-block="pricing-017"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="pricing-017"] [data-part="head"]{padding:0;margin-bottom:2rem}
[data-vibeui-block="pricing-017"] [data-part="track"]{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1.25rem;padding:0;overflow:visible;scroll-snap-type:none}
[data-vibeui-block="pricing-017"] [data-part="plan"]{flex:1 1 auto;padding:1.75rem}
[data-vibeui-block="pricing-017"] [data-part="hint"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-017"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PLANS: Pricing017Plan[] = [
  {
    name: "Личный",
    price: "590 ₽",
    period: "в месяц",
    summary: "Один проект и весь каталог секций.",
    features: ["Один проект", "Все секции", "Обновления навсегда"],
    action: { label: "Выбрать", href: "#" },
  },
  {
    name: "Команда",
    price: "1 490 ₽",
    period: "в месяц",
    summary: "Для тех, кто запускает страницы регулярно.",
    features: [
      "До пяти участников",
      "Общие пресеты палитры",
      "Поддержка за рабочий день",
    ],
    action: { label: "Попробовать", href: "#" },
    featured: true,
  },
  {
    name: "Агентство",
    price: "4 900 ₽",
    period: "в месяц",
    summary: "Для студий и клиентских проектов.",
    features: [
      "Безлимит участников",
      "Передача проекта клиенту",
      "Документы для бухгалтерии",
    ],
    action: { label: "Связаться", href: "#" },
  },
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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

/** Тарифы карточками на телефоне: горизонтальная лента со scroll-snap, сетка от 52rem. */
export function Pricing017({
  eyebrow = "Тарифы",
  title = "Пролистайте и выберите — как в приложении",
  hint = "Листайте вбок, чтобы увидеть все тарифы",
  plans = DEFAULT_PLANS,
  trackLabel = "Тарифы",
  accent,
  background = "",
  className,
  style,
}: Pricing017Props) {
  const palette = {
    ...(accent ? { "--vibeui-pricing-017-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pricing-017-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-pricing-017" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="pricing-017"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2>{title}</h2>
          </div>

          <div
            data-part="track"
            tabIndex={0}
            role="group"
            aria-label={trackLabel}
          >
            {plans.slice(0, 4).map((plan) => (
              <article
                key={plan.name}
                data-part="plan"
                data-featured={plan.featured ? "true" : undefined}
              >
                <h3>{plan.name}</h3>
                <p data-part="price">
                  {plan.price}
                  <span data-part="period">{plan.period}</span>
                </p>
                <p data-part="summary">{plan.summary}</p>
                <ul>
                  {plan.features.slice(0, 5).map((feature) => (
                    <li key={feature}>
                      <span data-part="dot" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a data-part="cta" href={plan.action.href}>
                  {plan.action.label}
                </a>
              </article>
            ))}
          </div>

          {hint ? (
            <p data-part="hint">
              <svg
                viewBox="0 0 16 16"
                width="13"
                height="13"
                aria-hidden="true"
              >
                <path
                  d="M2.5 8h11m0 0-3-3m3 3-3 3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {hint}
            </p>
          ) : null}
        </div>
      </section>
    </>
  )
}

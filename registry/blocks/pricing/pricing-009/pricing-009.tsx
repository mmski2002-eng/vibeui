import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Pricing009Plan = {
  name: string
  description: string
  amounts: { rub: string; usd: string; eur: string }
  features: string[]
  action: { label: string; href: string }
  featured?: boolean
}

export type Pricing009Props = {
  title?: string
  lede?: string
  currencyLabel?: string
  plans?: Pricing009Plan[]
  note?: string
  /** Приписка к сумме: за какой период она указана. */
  perLabel?: string
  /** Подписи переключателя валют по ключам rub, usd и eur. */
  currencyText?: Record<string, string>
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

// Идея блока: валюта выбирается на месте и без перезагрузки. Три радиокнопки
// и селектор :has() показывают нужную сумму: все три цены лежат в разметке,
// лишние скрыты. Это сознательный размен — разметка чуть тяжелее, зато цена
// не «прыгает» после гидратации и видна даже при выключенном JavaScript.
// Суммы прописаны вручную, а не пересчитаны по курсу: локальная цена всегда
// округлена под рынок, а не получена умножением.
//
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="pricing-009"]){
--vibeui-pricing-009-bg:transparent;
--vibeui-pricing-009-fg:light-dark(oklch(0.19 0.014 200),oklch(0.95 0.005 200));
--vibeui-pricing-009-muted:light-dark(oklch(0.5 0.014 200),oklch(0.71 0.012 200));
--vibeui-pricing-009-card:light-dark(oklch(1 0 0),oklch(0.22 0.014 200));
--vibeui-pricing-009-line:light-dark(oklch(0.88 0.008 200),oklch(0.34 0.014 200));
--vibeui-pricing-009-soft:light-dark(oklch(0.95 0.01 200),oklch(0.27 0.016 200));
--vibeui-pricing-009-accent:light-dark(oklch(0.287 0 0),oklch(0.906 0 0));
--vibeui-pricing-009-accent-fg:oklch(from var(--vibeui-pricing-009-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-pricing-009-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-pricing-009-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-009"]{color-scheme:dark}
[data-vibeui-block="pricing-009"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-pricing-009-bg);color:var(--vibeui-pricing-009-fg);
font-family:var(--vibeui-pricing-009-sans);
}
[data-vibeui-block="pricing-009"] *{box-sizing:border-box}
[data-vibeui-block="pricing-009"] [data-part="cta"]{margin-top:1.375rem}
[data-vibeui-block="pricing-009"] [data-part="shell"]{max-width:62rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="pricing-009"] [data-part="head"]{
display:flex;flex-direction:column;gap:1.25rem;margin-bottom:2rem;
}
[data-vibeui-block="pricing-009"] input{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
[data-vibeui-block="pricing-009"] [data-part="switch"]{
display:inline-flex;align-self:flex-start;align-items:center;gap:0.25rem;padding:0.25rem;border-radius:0.75rem;
border:1px solid var(--vibeui-pricing-009-line);background:var(--vibeui-pricing-009-soft);
}
[data-vibeui-block="pricing-009"] [data-part="opt"]{
display:inline-flex;align-items:center;cursor:pointer;height:2rem;padding:0 0.875rem;border-radius:0.5rem;
font-size:0.8125rem;font-weight:650;color:var(--vibeui-pricing-009-muted);
transition:background-color var(--vibeui-pricing-009-dur-2) ease,color var(--vibeui-pricing-009-dur-2) ease;
}
[data-vibeui-block="pricing-009"] [data-part="plans"]{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr;gap:1rem}
[data-vibeui-block="pricing-009"] [data-part="plan"]{
display:flex;flex-direction:column;padding:1.5rem;border-radius:1rem;
border:1px solid var(--vibeui-pricing-009-line);background:var(--vibeui-pricing-009-card);
}
[data-vibeui-block="pricing-009"] [data-featured="true"]{border-color:var(--vibeui-pricing-009-accent);border-width:2px}
[data-vibeui-block="pricing-009"] h3{margin:0;font-size:1rem;font-weight:700}
[data-vibeui-block="pricing-009"] [data-part="desc"]{margin:0.375rem 0 0;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-pricing-009-muted)}
[data-vibeui-block="pricing-009"] [data-part="price"]{
display:flex;align-items:baseline;gap:0.375rem;margin:1.125rem 0 0;
font-size:2rem;font-weight:700;letter-spacing:-0.04em;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pricing-009"] [data-part="per"]{font-size:0.8125rem;font-weight:500;letter-spacing:0;color:var(--vibeui-pricing-009-muted)}
[data-vibeui-block="pricing-009"] [data-part="amount"]{display:none}
[data-vibeui-block="pricing-009"] [data-part="feats"]{list-style:none;margin:1.125rem 0 0;padding:0;display:grid;gap:0.4375rem}
[data-vibeui-block="pricing-009"] [data-part="feats"] li{display:flex;align-items:flex-start;gap:0.5rem;font-size:0.875rem;line-height:1.5}
[data-vibeui-block="pricing-009"] [data-part="dot"]{flex:0 0 auto;margin-top:0.5rem;width:0.3125rem;height:0.3125rem;border-radius:9999px;background:var(--vibeui-pricing-009-accent);color:oklch(from var(--vibeui-pricing-009-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="pricing-009"] a{
display:inline-flex;align-items:center;justify-content:center;margin-top:auto;height:2.625rem;border-radius:0.625rem;
border:1px solid var(--vibeui-pricing-009-line);color:var(--vibeui-pricing-009-fg);
font-size:0.9375rem;font-weight:650;text-decoration:none;transition:background-color var(--vibeui-pricing-009-dur-2) ease,border-color var(--vibeui-pricing-009-dur-2) ease;
}
[data-vibeui-block="pricing-009"] [data-featured="true"] a{background:var(--vibeui-pricing-009-accent);color:oklch(from var(--vibeui-pricing-009-accent) clamp(0,(0.62 - l) * 100,1) 0 0);border-color:transparent}
[data-vibeui-block="pricing-009"] a:focus-visible{outline:2px solid var(--vibeui-pricing-009-accent);outline-offset:3px}
[data-vibeui-block="pricing-009"] [data-part="note"]{margin:1.5rem 0 0;font-size:0.75rem;color:var(--vibeui-pricing-009-muted)}
[data-vibeui-block="pricing-009"]:has([data-cur="rub"]:checked) [data-amount="rub"],
[data-vibeui-block="pricing-009"]:has([data-cur="usd"]:checked) [data-amount="usd"],
[data-vibeui-block="pricing-009"]:has([data-cur="eur"]:checked) [data-amount="eur"]{
display:inline;
}
[data-vibeui-block="pricing-009"]:has([data-cur="rub"]:checked) [data-opt="rub"],
[data-vibeui-block="pricing-009"]:has([data-cur="usd"]:checked) [data-opt="usd"],
[data-vibeui-block="pricing-009"]:has([data-cur="eur"]:checked) [data-opt="eur"]{
background:var(--vibeui-pricing-009-card);color:var(--vibeui-pricing-009-fg);box-shadow:0 1px 3px oklch(0 0 0 / 10%);
}
[data-vibeui-block="pricing-009"]:has([data-cur="rub"]:focus-visible) [data-opt="rub"],
[data-vibeui-block="pricing-009"]:has([data-cur="usd"]:focus-visible) [data-opt="usd"],
[data-vibeui-block="pricing-009"]:has([data-cur="eur"]:focus-visible) [data-opt="eur"]{
outline:2px solid var(--vibeui-pricing-009-accent);outline-offset:2px;
}
@container (min-width: 34rem){
[data-vibeui-block="pricing-009"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="pricing-009"] [data-part="head"]{flex-direction:row;align-items:flex-end;justify-content:space-between}
}
@container (min-width: 56rem){
[data-vibeui-block="pricing-009"] [data-part="plans"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1.25rem}
[data-vibeui-block="pricing-009"] [data-part="plan"]{padding:1.75rem}
[data-vibeui-block="pricing-009"] [data-part="shell"]{padding:6rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-009"] *{animation:none!important;transition:none!important}}
`

const CURRENCIES = ["rub", "usd", "eur"] as const

const DEFAULT_CURRENCY_TEXT: Record<string, string> = {
  rub: "₽ RUB",
  usd: "$ USD",
  eur: "€ EUR",
}

const DEFAULT_PLANS: Pricing009Plan[] = [
  {
    name: "Личный",
    description: "Один проект и всё, что нужно для запуска.",
    amounts: { rub: "590 ₽", usd: "$9", eur: "€9" },
    features: ["Один проект", "Все секции каталога", "Обновления навсегда"],
    action: { label: "Выбрать", href: "#" },
  },
  {
    name: "Команда",
    description: "Для продуктовых команд с регулярными запусками.",
    amounts: { rub: "1 490 ₽", usd: "$19", eur: "€18" },
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
    description: "Для студий, сдающих проекты клиентам.",
    amounts: { rub: "4 900 ₽", usd: "$59", eur: "€55" },
    features: [
      "Безлимит участников",
      "Передача проекта клиенту",
      "Документы для бухгалтерии",
    ],
    action: { label: "Связаться", href: "#" },
  },
]

/** Тарифы с выбором валюты: три суммы лежат в разметке, лишние скрыты через :has(). */
export function Pricing009({
  title = "Цена в вашей валюте, без пересчёта по курсу",
  lede = "Суммы округлены под каждый рынок, поэтому в рублях и в долларах тариф стоит по-разному, а не «столько же, но по курсу».",
  currencyLabel = "Валюта",
  plans = DEFAULT_PLANS,
  note = "Списание проходит в выбранной валюте. Сменить её можно в настройках подписки в любой момент.",
  perLabel = "в месяц",
  currencyText,
  accent,
  background = "",
  className,
  style,
}: Pricing009Props) {
  const palette = {
    ...(accent ? { "--vibeui-pricing-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pricing-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties
  const currencyLabels = { ...DEFAULT_CURRENCY_TEXT, ...currencyText }

  return (
    <>
      <style href="vibeui-pricing-009" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="pricing-009"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <form>
            {CURRENCIES.map((currency, index) => (
              <input
                key={currency}
                data-cur={currency}
                id={`vibeui-pricing-009-${currency}`}
                type="radio"
                name="vibeui-pricing-009-currency"
                defaultChecked={index === 0}
              />
            ))}
          </form>

          <div data-part="head">
            <div>
              <Heading001
                data-part="heading"
                title={title}
                lede={lede}
                accent={accent}
              />
            </div>
            <div data-part="switch" role="group" aria-label={currencyLabel}>
              {CURRENCIES.map((currency) => (
                <label
                  key={currency}
                  data-part="opt"
                  data-opt={currency}
                  htmlFor={`vibeui-pricing-009-${currency}`}
                >
                  {currencyLabels[currency]}
                </label>
              ))}
            </div>
          </div>

          <ul data-part="plans">
            {plans.slice(0, 3).map((plan) => (
              <li
                key={plan.name}
                data-part="plan"
                data-featured={plan.featured ? "true" : undefined}
              >
                <h3>{plan.name}</h3>
                <p data-part="desc">{plan.description}</p>
                <p data-part="price">
                  <span data-part="amount" data-amount="rub">
                    {plan.amounts.rub}
                  </span>
                  <span data-part="amount" data-amount="usd">
                    {plan.amounts.usd}
                  </span>
                  <span data-part="amount" data-amount="eur">
                    {plan.amounts.eur}
                  </span>
                  <span data-part="per">{perLabel}</span>
                </p>
                <ul data-part="feats">
                  {plan.features.slice(0, 5).map((feature) => (
                    <li key={feature}>
                      <span data-part="dot" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button016
                  data-part="cta"
                  label={plan.action.label}
                  href={plan.action.href}
                  external={false}
                  size="lg"
                  tone={plan.featured ? "accent" : "neutral"}
                  accent={accent}
                />
              </li>
            ))}
          </ul>

          {note ? <p data-part="note">{note}</p> : null}
        </div>
      </section>
    </>
  )
}

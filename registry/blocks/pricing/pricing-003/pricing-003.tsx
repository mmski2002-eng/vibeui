import type { CSSProperties } from "react"

export type Pricing003Plan = {
  name: string
  monthly: string
  yearly: string
  yearlyNote: string
  features: string[]
  action: { label: string; href: string }
  featured?: boolean
}

export type Pricing003Props = {
  title?: string
  lede?: string
  monthLabel?: string
  yearLabel?: string
  saveLabel?: string
  /** Подпись группы переключателя для скринридера. */
  switchLabel?: string
  /** Приписка к сумме: за какой период она указана. */
  perLabel?: string
  plans?: Pricing003Plan[]
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

// Идея блока: переключатель периода без единой строки JavaScript. Две
// радиокнопки задают состояние, а цены переключаются селектором :has() на
// корне блока — секция остаётся серверной и работает даже до гидратации.
// Радиокнопки настоящие: стрелки клавиатуры, фокус и объявление состояния
// достаются от браузера, а не имитируются. Скидка подписана словами рядом с
// переключателем, а не спрятана в подсказку.
//
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="pricing-003"]){
--vibeui-pricing-003-bg:transparent;
--vibeui-pricing-003-fg:light-dark(oklch(0.19 0.014 160),oklch(0.95 0.005 160));
--vibeui-pricing-003-muted:light-dark(oklch(0.5 0.014 160),oklch(0.71 0.012 160));
--vibeui-pricing-003-card:light-dark(oklch(1 0 0),oklch(0.22 0.014 160));
--vibeui-pricing-003-line:light-dark(oklch(0.89 0.008 160),oklch(0.34 0.014 160));
--vibeui-pricing-003-soft:light-dark(oklch(0.95 0.012 160),oklch(0.27 0.016 160));
--vibeui-pricing-003-accent:light-dark(oklch(0.287 0 0),oklch(0.906 0 0));
--vibeui-pricing-003-accent-fg:oklch(from var(--vibeui-pricing-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-pricing-003-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-003"]{color-scheme:dark}
[data-vibeui-block="pricing-003"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-pricing-003-bg);color:var(--vibeui-pricing-003-fg);
font-family:var(--vibeui-pricing-003-sans);
}
[data-vibeui-block="pricing-003"] *{box-sizing:border-box}
[data-vibeui-block="pricing-003"] [data-part="shell"]{max-width:64rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem;text-align:center}
[data-vibeui-block="pricing-003"] h2{
margin:0;font-size:clamp(1.5rem,4.2cqi,2.375rem);line-height:1.12;letter-spacing:-0.025em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="pricing-003"] [data-part="lede"]{
margin:0.875rem auto 0;max-width:34rem;font-size:0.9375rem;line-height:1.6;color:var(--vibeui-pricing-003-muted);text-wrap:pretty;
}
[data-vibeui-block="pricing-003"] input{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
[data-vibeui-block="pricing-003"] [data-part="switch"]{
display:inline-flex;align-items:center;gap:0.25rem;margin:1.75rem 0 0;padding:0.25rem;border-radius:9999px;
border:1px solid var(--vibeui-pricing-003-line);background:var(--vibeui-pricing-003-soft);
}
[data-vibeui-block="pricing-003"] [data-part="opt"]{
display:inline-flex;align-items:center;gap:0.375rem;cursor:pointer;height:2.25rem;padding:0 1rem;border-radius:9999px;
font-size:0.875rem;font-weight:650;color:var(--vibeui-pricing-003-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="pricing-003"] [data-part="save"]{
padding:0.125rem 0.375rem;border-radius:0.375rem;background:var(--vibeui-pricing-003-accent);
color:oklch(from var(--vibeui-pricing-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="pricing-003"] [data-part="plans"]{
list-style:none;margin:2rem 0 0;padding:0;display:grid;grid-template-columns:1fr;gap:1rem;text-align:left;
}
[data-vibeui-block="pricing-003"] [data-part="plan"]{
display:flex;flex-direction:column;padding:1.75rem;border-radius:1.125rem;
border:1px solid var(--vibeui-pricing-003-line);background:var(--vibeui-pricing-003-card);
}
[data-vibeui-block="pricing-003"] [data-featured="true"]{border-color:var(--vibeui-pricing-003-accent);border-width:2px}
[data-vibeui-block="pricing-003"] h3{margin:0;font-size:1rem;font-weight:700}
[data-vibeui-block="pricing-003"] [data-part="amount"]{
display:flex;align-items:baseline;gap:0.375rem;margin:1rem 0 0;
font-size:2.125rem;font-weight:700;letter-spacing:-0.04em;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pricing-003"] [data-part="per"]{font-size:0.8125rem;font-weight:500;letter-spacing:0;color:var(--vibeui-pricing-003-muted)}
[data-vibeui-block="pricing-003"] [data-part="hint"]{margin:0.375rem 0 0;font-size:0.75rem;color:var(--vibeui-pricing-003-accent);font-weight:600;min-height:1rem}
[data-vibeui-block="pricing-003"] [data-part="feats"]{list-style:none;margin:1.25rem 0 0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="pricing-003"] [data-part="feats"] li{display:flex;align-items:flex-start;gap:0.5rem;font-size:0.875rem;line-height:1.5}
[data-vibeui-block="pricing-003"] [data-part="tick"]{flex:0 0 auto;margin-top:0.25rem;color:var(--vibeui-pricing-003-accent)}
[data-vibeui-block="pricing-003"] a{
display:inline-flex;align-items:center;justify-content:center;margin-top:1.5rem;height:2.75rem;border-radius:0.625rem;
border:1px solid var(--vibeui-pricing-003-line);color:var(--vibeui-pricing-003-fg);
font-size:0.9375rem;font-weight:650;text-decoration:none;transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="pricing-003"] [data-featured="true"] a{background:var(--vibeui-pricing-003-accent);color:oklch(from var(--vibeui-pricing-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);border-color:transparent}
[data-vibeui-block="pricing-003"] a:focus-visible{outline:2px solid var(--vibeui-pricing-003-accent);outline-offset:3px}
[data-vibeui-block="pricing-003"] [data-part="year"]{display:none}
[data-vibeui-block="pricing-003"]:has([data-part="periodyear"]:checked) [data-part="month"]{display:none}
[data-vibeui-block="pricing-003"]:has([data-part="periodyear"]:checked) [data-part="year"]{display:inline}
[data-vibeui-block="pricing-003"]:has([data-part="periodmonth"]:checked) [data-opt="month"],
[data-vibeui-block="pricing-003"]:has([data-part="periodyear"]:checked) [data-opt="year"]{
background:var(--vibeui-pricing-003-card);color:var(--vibeui-pricing-003-fg);
box-shadow:0 1px 3px oklch(0 0 0 / 10%);
}
[data-vibeui-block="pricing-003"]:has([data-part="periodmonth"]:focus-visible) [data-opt="month"],
[data-vibeui-block="pricing-003"]:has([data-part="periodyear"]:focus-visible) [data-opt="year"]{
outline:2px solid var(--vibeui-pricing-003-accent);outline-offset:2px;
}
@container (min-width: 34rem){
[data-vibeui-block="pricing-003"] [data-part="shell"]{padding:5rem 2rem}
}
@container (min-width: 56rem){
[data-vibeui-block="pricing-003"] [data-part="plans"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1.25rem}
[data-vibeui-block="pricing-003"] [data-part="shell"]{padding:6rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PLANS: Pricing003Plan[] = [
  {
    name: "Личный",
    monthly: "590 ₽",
    yearly: "490 ₽",
    yearlyNote: "5 880 ₽ разом, два месяца в подарок",
    features: ["Один проект", "Все секции каталога", "Обновления навсегда"],
    action: { label: "Выбрать", href: "#" },
  },
  {
    name: "Команда",
    monthly: "1 490 ₽",
    yearly: "1 240 ₽",
    yearlyNote: "14 880 ₽ разом, два месяца в подарок",
    features: [
      "До пяти участников",
      "Приватные пресеты палитры",
      "Приоритетная поддержка",
      "Совместные проекты",
    ],
    action: { label: "Попробовать 14 дней", href: "#" },
    featured: true,
  },
  {
    name: "Агентство",
    monthly: "4 900 ₽",
    yearly: "4 080 ₽",
    yearlyNote: "48 960 ₽ разом, два месяца в подарок",
    features: [
      "Безлимит участников",
      "Передача проектов клиенту",
      "Счета и закрывающие документы",
    ],
    action: { label: "Связаться", href: "#" },
  },
]

/** Тарифы с переключателем месяц/год: состояние держат радиокнопки и :has(). */
export function Pricing003({
  title = "Годовая оплата дешевле на два месяца",
  lede = "Переключатель не перезагружает страницу и не требует скриптов: цены меняются на CSS.",
  monthLabel = "Помесячно",
  yearLabel = "За год",
  saveLabel = "−17 %",
  switchLabel = "Период оплаты",
  perLabel = "в месяц",
  plans = DEFAULT_PLANS,
  accent,
  background = "",
  className,
  style,
}: Pricing003Props) {
  const palette = {
    ...(accent ? { "--vibeui-pricing-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pricing-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-pricing-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="pricing-003"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}

          <form>
            <input
              data-part="periodmonth"
              id="vibeui-pricing-003-month"
              type="radio"
              name="vibeui-pricing-003-period"
              defaultChecked
            />
            <input
              data-part="periodyear"
              id="vibeui-pricing-003-year"
              type="radio"
              name="vibeui-pricing-003-period"
            />
          </form>

          <div data-part="switch" role="group" aria-label={switchLabel}>
            <label
              data-part="opt"
              data-opt="month"
              htmlFor="vibeui-pricing-003-month"
            >
              {monthLabel}
            </label>
            <label
              data-part="opt"
              data-opt="year"
              htmlFor="vibeui-pricing-003-year"
            >
              {yearLabel}
              <span data-part="save">{saveLabel}</span>
            </label>
          </div>

          <ul data-part="plans">
            {plans.slice(0, 3).map((plan) => (
              <li
                key={plan.name}
                data-part="plan"
                data-featured={plan.featured ? "true" : undefined}
              >
                <h3>{plan.name}</h3>
                <p data-part="amount">
                  <span data-part="month">{plan.monthly}</span>
                  <span data-part="year">{plan.yearly}</span>
                  <span data-part="per">{perLabel}</span>
                </p>
                <p data-part="hint">
                  <span data-part="year">{plan.yearlyNote}</span>
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
                <a href={plan.action.href}>{plan.action.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

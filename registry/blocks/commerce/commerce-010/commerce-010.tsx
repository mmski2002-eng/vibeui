import type { CSSProperties } from "react"

export type Commerce010Method = {
  value: string
  label: string
  hint: string
  price: string
}

export type Commerce010Props = {
  title?: string
  ways?: Commerce010Method[]
  summary?: { label: string; value: string }[]
  total?: string
  cta?: string
  legal?: string
  /** Подписи блока: компонент несёт русские, проект подставляет свои. */
  labels?: Record<string, string>
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: оформление в один экран — контакты, доставка и оплата без
// перехода по шагам. Поля карты не висят всегда: они появляются только когда
// выбрана оплата картой, и это сделано на :has(), а не на состоянии, поэтому
// блок остаётся серверным. Итог прилипает к колонке: на одном длинном экране
// сумму сверяют по дороге, а не в конце.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// по умолчанию нет, он лежит прямо на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="commerce-010"]){
--vibeui-commerce-010-bg:transparent;
--vibeui-commerce-010-field:light-dark(oklch(1 0 0),oklch(0.24 0.012 265));
--vibeui-commerce-010-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-commerce-010-muted:light-dark(oklch(0.55 0.014 265),oklch(0.72 0.012 265));
--vibeui-commerce-010-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-commerce-010-soft:light-dark(oklch(0.975 0.004 265),oklch(0.28 0.01 265));
--vibeui-commerce-010-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-commerce-010-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.02 262));
--vibeui-commerce-010-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-010"]{color-scheme:dark}
[data-vibeui-block="commerce-010"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-commerce-010-bg);
font-family:var(--vibeui-commerce-010-sans);color:var(--vibeui-commerce-010-fg);
}
[data-vibeui-block="commerce-010"] *{box-sizing:border-box}
[data-vibeui-block="commerce-010"] [data-part="shell"]{
padding:1rem;max-width:70rem;margin:0 auto;display:grid;gap:1rem;grid-template-columns:1fr;align-items:start;
}
@container (min-width: 48rem){
[data-vibeui-block="commerce-010"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) 18rem}
}
[data-vibeui-block="commerce-010"] h2{margin:0 0 0.875rem;font-size:1.1875rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-010"] fieldset{
margin:0 0 0.75rem;padding:0.875rem;border:1px solid var(--vibeui-commerce-010-border);border-radius:1rem;
}
[data-vibeui-block="commerce-010"] legend{
padding:0 0.375rem;margin-left:-0.375rem;font-size:0.75rem;font-weight:700;letter-spacing:0.02em;text-transform:uppercase;
color:var(--vibeui-commerce-010-muted);
}
[data-vibeui-block="commerce-010"] [data-part="fields"]{display:grid;gap:0.5rem;grid-template-columns:1fr}
@container (min-width: 34rem){
[data-vibeui-block="commerce-010"] [data-part="fields"]{grid-template-columns:1fr 1fr}
[data-vibeui-block="commerce-010"] [data-wide="true"]{grid-column:1 / -1}
}
[data-vibeui-block="commerce-010"] label[data-part="field"]{display:flex;flex-direction:column;gap:0.25rem;font-size:0.6875rem;color:var(--vibeui-commerce-010-muted)}
[data-vibeui-block="commerce-010"] input[type="text"],
[data-vibeui-block="commerce-010"] input[type="tel"],
[data-vibeui-block="commerce-010"] input[type="email"]{
font:inherit;font-size:0.8125rem;color:var(--vibeui-commerce-010-fg);height:2.375rem;padding:0 0.625rem;
border:1px solid var(--vibeui-commerce-010-border);border-radius:0.625rem;background:var(--vibeui-commerce-010-field);
}
[data-vibeui-block="commerce-010"] input:focus-visible{outline:2px solid var(--vibeui-commerce-010-accent);outline-offset:1px}
[data-vibeui-block="commerce-010"] [data-part="choices"]{display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="commerce-010"] [data-part="choice"]{
display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:0.625rem;align-items:center;
padding:0.625rem 0.75rem;border-radius:0.75rem;cursor:pointer;
border:1px solid var(--vibeui-commerce-010-border);
}
[data-vibeui-block="commerce-010"] [data-part="choice"]:has(input:checked){border-color:var(--vibeui-commerce-010-accent);background:var(--vibeui-commerce-010-soft)}
[data-vibeui-block="commerce-010"] [data-part="choice"]:has(input:focus-visible){outline:2px solid var(--vibeui-commerce-010-accent);outline-offset:2px}
[data-vibeui-block="commerce-010"] [data-part="choice"] input{accent-color:var(--vibeui-commerce-010-accent);width:1rem;height:1rem;margin:0}
[data-vibeui-block="commerce-010"] [data-part="name"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="commerce-010"] [data-part="hint"]{display:block;font-size:0.6875rem;font-weight:400;color:var(--vibeui-commerce-010-muted)}
[data-vibeui-block="commerce-010"] [data-part="cost"]{font-size:0.8125rem;font-weight:650;font-variant-numeric:tabular-nums}
/* Поля карты появляются только под выбранной оплатой картой — на :has(), без состояния. */
[data-vibeui-block="commerce-010"] [data-part="card"]{display:none;gap:0.5rem;grid-template-columns:1fr;margin-top:0.625rem}
[data-vibeui-block="commerce-010"] [data-part="paying"]:has(#commerce-010-pay-card:checked) [data-part="card"]{display:grid}
@container (min-width: 34rem){
[data-vibeui-block="commerce-010"] [data-part="card"]{grid-template-columns:2fr 1fr 1fr}
}
[data-vibeui-block="commerce-010"] [data-part="total"]{
padding:0.875rem;border-radius:1rem;border:1px solid var(--vibeui-commerce-010-border);position:sticky;top:1rem;
background:var(--vibeui-commerce-010-soft);
}
[data-vibeui-block="commerce-010"] dl{display:grid;grid-template-columns:1fr auto;gap:0.375rem 0.75rem;margin:0 0 0.75rem;font-size:0.8125rem}
[data-vibeui-block="commerce-010"] [data-part="pair"]{display:contents}
[data-vibeui-block="commerce-010"] [data-space="true"]{margin-top:0.625rem}
[data-vibeui-block="commerce-010"] dt{color:var(--vibeui-commerce-010-muted)}
[data-vibeui-block="commerce-010"] dd{margin:0;text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-010"] [data-part="grand"]{
display:flex;justify-content:space-between;align-items:baseline;gap:0.75rem;
padding-top:0.625rem;border-top:1px solid var(--vibeui-commerce-010-border);margin-bottom:0.75rem;
}
[data-vibeui-block="commerce-010"] [data-part="grand"] b{font-size:1.25rem;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-010"] [data-part="pay"]{
width:100%;appearance:none;border:0;cursor:pointer;height:2.75rem;border-radius:0.75rem;
background:var(--vibeui-commerce-010-accent);color:var(--vibeui-commerce-010-on-accent);font:inherit;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="commerce-010"] [data-part="pay"]:focus-visible{outline:2px solid var(--vibeui-commerce-010-accent);outline-offset:2px}
[data-vibeui-block="commerce-010"] [data-part="legal"]{margin:0.625rem 0 0;font-size:0.6875rem;line-height:1.45;color:var(--vibeui-commerce-010-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_WAYS: Commerce010Method[] = [
  {
    value: "courier",
    label: "Курьер завтра",
    hint: "Привезём 12 марта, интервал выберете в СМС",
    price: "490 ₽",
  },
  {
    value: "pickup",
    label: "Пункт выдачи",
    hint: "Сегодня после 18:00, Пушкина 12",
    price: "бесплатно",
  },
  {
    value: "post",
    label: "Почта России",
    hint: "5–9 дней, трек придёт на почту",
    price: "290 ₽",
  },
]

const DEFAULT_SUMMARY = [
  { label: "Товары, 3 шт.", value: "53 700 ₽" },
  { label: "Доставка", value: "490 ₽" },
  { label: "Скидка", value: "−2 685 ₽" },
]

/** Русские подписи по умолчанию: установленный файл не меняет язык сам. */
const LABELS: Record<string, string> = {
  who: "Кому",
  name: "Имя и фамилия",
  phone: "Телефон",
  mail: "Почта для чека",
  where: "Куда",
  address: "Адрес",
  how: "Чем",
  payCard: "Картой онлайн",
  payCardHint: "Спишем сразу, чек придёт на почту",
  payCardCost: "−1%",
  payCash: "При получении",
  payCashHint: "Наличными или картой курьеру",
  payCashCost: "0 ₽",
  pan: "Номер карты",
  expiry: "Срок",
  cvc: "CVC",
  grand: "К оплате",
  summary: "Итог заказа",
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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

/**
 * Оформление в один экран: контакты, доставка и оплата без шагов.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce010({
  title = "Оформление заказа",
  ways = DEFAULT_WAYS,
  summary = DEFAULT_SUMMARY,
  total = "51 505 ₽",
  cta = "Оплатить",
  legal = "Нажимая «Оплатить», вы соглашаетесь с условиями продажи и политикой обработки данных.",
  labels = LABELS,
  accent,
  background = "",
  className,
  style,
}: Commerce010Props) {
  const text = { ...LABELS, ...labels }

  const palette = {
    ...(accent ? { "--vibeui-commerce-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-010" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-010"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <form data-part="form" id="commerce-010-form">
            <h2>{title}</h2>

            <fieldset>
              <legend>{text.who}</legend>
              <div data-part="fields">
                <label data-part="field" htmlFor="commerce-010-name">
                  {text.name}
                  <input
                    id="commerce-010-name"
                    type="text"
                    autoComplete="name"
                  />
                </label>
                <label data-part="field" htmlFor="commerce-010-phone">
                  {text.phone}
                  <input
                    id="commerce-010-phone"
                    type="tel"
                    autoComplete="tel"
                  />
                </label>
                <label
                  data-part="field"
                  htmlFor="commerce-010-mail"
                  data-wide="true"
                >
                  {text.mail}
                  <input
                    id="commerce-010-mail"
                    type="email"
                    autoComplete="email"
                  />
                </label>
              </div>
            </fieldset>

            <fieldset>
              <legend>{text.where}</legend>
              <div data-part="choices">
                {ways.map((way, index) => (
                  <label key={way.value} data-part="choice">
                    <input
                      type="radio"
                      name="commerce-010-way"
                      value={way.value}
                      defaultChecked={index === 0}
                    />
                    <span data-part="name">
                      {way.label}
                      <span data-part="hint">{way.hint}</span>
                    </span>
                    <span data-part="cost">{way.price}</span>
                  </label>
                ))}
              </div>
              <div data-part="fields" data-space="true">
                <label
                  data-part="field"
                  htmlFor="commerce-010-address"
                  data-wide="true"
                >
                  {text.address}
                  <input
                    id="commerce-010-address"
                    type="text"
                    autoComplete="street-address"
                  />
                </label>
              </div>
            </fieldset>

            <fieldset data-part="paying">
              <legend>{text.how}</legend>
              <div data-part="choices">
                <label data-part="choice">
                  <input
                    type="radio"
                    name="commerce-010-pay"
                    id="commerce-010-pay-card"
                    defaultChecked
                  />
                  <span data-part="name">
                    {text.payCard}
                    <span data-part="hint">{text.payCardHint}</span>
                  </span>
                  <span data-part="cost">{text.payCardCost}</span>
                </label>
                <label data-part="choice">
                  <input type="radio" name="commerce-010-pay" />
                  <span data-part="name">
                    {text.payCash}
                    <span data-part="hint">{text.payCashHint}</span>
                  </span>
                  <span data-part="cost">{text.payCashCost}</span>
                </label>
              </div>
              <div data-part="card">
                <label data-part="field" htmlFor="commerce-010-pan">
                  {text.pan}
                  <input
                    id="commerce-010-pan"
                    type="text"
                    inputMode="numeric"
                  />
                </label>
                <label data-part="field" htmlFor="commerce-010-exp">
                  {text.expiry}
                  <input
                    id="commerce-010-exp"
                    type="text"
                    inputMode="numeric"
                  />
                </label>
                <label data-part="field" htmlFor="commerce-010-cvc">
                  {text.cvc}
                  <input
                    id="commerce-010-cvc"
                    type="text"
                    inputMode="numeric"
                  />
                </label>
              </div>
            </fieldset>
          </form>

          <aside data-part="total" aria-label={text.summary}>
            <dl>
              {summary.map((entry) => (
                <div key={entry.label} data-part="pair">
                  <dt>{entry.label}</dt>
                  <dd>{entry.value}</dd>
                </div>
              ))}
            </dl>
            <p data-part="grand">
              <span>{text.grand}</span>
              <b>{total}</b>
            </p>
            <button type="submit" form="commerce-010-form" data-part="pay">
              {cta} {total}
            </button>
            <p data-part="legal">{legal}</p>
          </aside>
        </div>
      </section>
    </>
  )
}

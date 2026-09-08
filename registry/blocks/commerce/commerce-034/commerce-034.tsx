import type { CSSProperties } from "react"

export type Commerce034Plan = {
  id: string
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  label: string
  parts: number
  overpay: number
  note: string
}

export type Commerce034Payment = {
  date: string
  note?: string
}

export type Commerce034Props = {
  title?: string
  amount?: number
  currency?: string
  plans?: Commerce034Plan[]
  scheduleTitle?: string
  schedule?: Commerce034Payment[]
  warning?: string
  cta?: string
  /** Строка над планами: {amount} подставляет сумму заказа. */
  sumText?: string
  /** Подпись группы планов. */
  plansLegend?: string
  /** Подписи переплаты: {amount} подставляет её размер. */
  overpayText?: string
  noOverpayText?: string
  /** Локаль форматирования сумм. */
  numberLocale?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: оплата с рассрочкой, где платёж в месяц и переплата считаются
// из суммы заказа, а не приходят готовыми строками — иначе после смены цены
// цифры разъезжаются и обещают то, чего нет. График платежей показан списком
// с датами: «4 платежа» без дат не даёт понять, когда снимут деньги.
const STYLES = `
:where([data-vibeui-block="commerce-034"]){
--vibeui-commerce-034-bg:transparent;
--vibeui-commerce-034-radius:0;
--vibeui-commerce-034-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-commerce-034-muted:light-dark(oklch(0.55 0 265),oklch(0.7 0 265));
--vibeui-commerce-034-border:light-dark(oklch(0.91 0 265),oklch(0.35 0 265));
--vibeui-commerce-034-soft:light-dark(oklch(0.975 0 265),oklch(0.27 0 265));
--vibeui-commerce-034-accent:light-dark(oklch(0.55 0.16 39.8),oklch(0.75 0.14 39.8));
--vibeui-commerce-034-on-accent:oklch(0.15 0.02 39.8);
--vibeui-commerce-034-warn:light-dark(oklch(0.98 0.03 85),oklch(0.33 0.05 85));
--vibeui-commerce-034-free:light-dark(oklch(0.5 0.13 39.8),oklch(0.78 0.14 39.8));
--vibeui-commerce-034-cost:light-dark(oklch(0.55 0.15 39.8),oklch(0.79 0.13 39.8));
--vibeui-commerce-034-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-034"]{color-scheme:dark}
[data-vibeui-block="commerce-034"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-034-bg);
border-radius:var(--vibeui-commerce-034-radius);
color:var(--vibeui-commerce-034-fg);font-family:var(--vibeui-commerce-034-sans);
}
[data-vibeui-block="commerce-034"] *{box-sizing:border-box}
[data-vibeui-block="commerce-034"] form{display:contents}
[data-vibeui-block="commerce-034"] [data-part="shell"]{max-width:52rem;margin:0 auto;padding:1.25rem 1rem}
[data-vibeui-block="commerce-034"] h2{margin:0 0 0.25rem;font-size:1.1875rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-034"] [data-part="sum"]{margin:0 0 1rem;font-size:0.875rem;color:var(--vibeui-commerce-034-muted)}
[data-vibeui-block="commerce-034"] [data-part="sum"] b{color:var(--vibeui-commerce-034-fg);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-034"] fieldset{border:0;margin:0;padding:0}
[data-vibeui-block="commerce-034"] legend{
padding:0;float:left;width:100%;clear:both;margin-bottom:0.5rem;
font-size:0.6875rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;
color:var(--vibeui-commerce-034-muted);
}
[data-vibeui-block="commerce-034"] [data-part="plans"]{clear:both;display:grid;gap:0.5rem}
@container (min-width: 42rem){
[data-vibeui-block="commerce-034"] [data-part="plans"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
[data-vibeui-block="commerce-034"] [data-part="plan"]{position:relative;display:block;cursor:pointer}
[data-vibeui-block="commerce-034"] [data-part="plan"] input{position:absolute;opacity:0;pointer-events:none}
[data-vibeui-block="commerce-034"] [data-part="face"]{
position:relative;display:block;height:100%;padding:0.875rem;border-radius:1rem;
border:1px solid var(--vibeui-commerce-034-border);
transition:border-color .15s ease,box-shadow .15s ease;overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="commerce-034"] [data-part="face"][data-empty="true"]{background:var(--vibeui-commerce-034-bg);}
[data-vibeui-block="commerce-034"] [data-part="face"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;
}
[data-vibeui-block="commerce-034"] [data-part="plan"] input:checked + [data-part="face"]{
border-color:var(--vibeui-commerce-034-accent);
box-shadow:inset 0 0 0 1px var(--vibeui-commerce-034-accent);
background:color-mix(in oklab,var(--vibeui-commerce-034-accent) 6%,transparent);
}
[data-vibeui-block="commerce-034"] [data-part="plan"] input:focus-visible + [data-part="face"]{outline:2px solid var(--vibeui-commerce-034-accent);outline-offset:2px}
[data-vibeui-block="commerce-034"] [data-part="label"]{display:block;font-size:0.75rem;font-weight:650;color:var(--vibeui-commerce-034-muted)}
[data-vibeui-block="commerce-034"] [data-part="per"]{
display:block;margin:0.25rem 0 0.125rem;font-size:1.375rem;font-weight:750;letter-spacing:-0.02em;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="commerce-034"] [data-part="per"] small{font-size:0.75rem;font-weight:600;color:var(--vibeui-commerce-034-muted)}
[data-vibeui-block="commerce-034"] [data-part="over"]{display:block;font-size:0.75rem;font-weight:650;color:var(--vibeui-commerce-034-free)}
[data-vibeui-block="commerce-034"] [data-part="over"][data-cost="yes"]{color:var(--vibeui-commerce-034-cost)}
[data-vibeui-block="commerce-034"] [data-part="note"]{display:block;margin-top:0.375rem;font-size:0.6875rem;line-height:1.45;color:var(--vibeui-commerce-034-muted)}
[data-vibeui-block="commerce-034"] h3{
margin:1.25rem 0 0.5rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.07em;
text-transform:uppercase;color:var(--vibeui-commerce-034-muted);
}
[data-vibeui-block="commerce-034"] ol{list-style:none;margin:0;padding:0;display:grid;gap:0}
[data-vibeui-block="commerce-034"] [data-part="row"]{
display:grid;grid-template-columns:1.5rem minmax(0,1fr) auto;gap:0.625rem;align-items:baseline;
padding:0.625rem 0;border-bottom:1px solid var(--vibeui-commerce-034-border);
}
[data-vibeui-block="commerce-034"] [data-part="row"]:last-child{border-bottom:0}
[data-vibeui-block="commerce-034"] [data-part="num"]{
justify-self:center;align-self:center;width:1.5rem;height:1.5rem;border-radius:9999px;display:grid;place-items:center;
background:var(--vibeui-commerce-034-soft);font-size:0.6875rem;font-weight:700;color:var(--vibeui-commerce-034-muted);
}
[data-vibeui-block="commerce-034"] [data-part="row"]:first-child [data-part="num"]{
background:var(--vibeui-commerce-034-accent);color:var(--vibeui-commerce-034-on-accent);
}
[data-vibeui-block="commerce-034"] [data-part="when"]{margin:0;font-size:0.875rem;font-weight:600}
[data-vibeui-block="commerce-034"] [data-part="hint"]{margin:0.0625rem 0 0;font-size:0.6875rem;color:var(--vibeui-commerce-034-muted)}
[data-vibeui-block="commerce-034"] [data-part="money"]{margin:0;font-size:0.9375rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-034"] [data-part="warn"]{
margin:1rem 0 0;padding:0.75rem 0.875rem;border-radius:0.875rem;background:var(--vibeui-commerce-034-warn);
font-size:0.75rem;line-height:1.55;
}
[data-vibeui-block="commerce-034"] [data-part="cta"]{
margin-top:1rem;width:100%;appearance:none;border:0;cursor:pointer;height:3rem;border-radius:0.875rem;
background:var(--vibeui-commerce-034-accent);color:var(--vibeui-commerce-034-on-accent);font:inherit;font-size:1rem;font-weight:700;
}
[data-vibeui-block="commerce-034"] [data-part="cta"]:focus-visible{outline:2px solid var(--vibeui-commerce-034-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-034"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PLANS: Commerce034Plan[] = [
  {
    id: "once",
    label: "Сразу",
    parts: 1,
    overpay: 0,
    note: "Одним платежом картой или через СБП.",
  },
  {
    id: "four",
    label: "4 платежа",
    parts: 4,
    overpay: 0,
    note: "Каждые две недели, первый — сегодня. Без процентов.",
  },
  {
    id: "twelve",
    label: "12 месяцев",
    parts: 12,
    overpay: 0.14,
    note: "Банковская рассрочка, решение за минуту.",
  },
]

const DEFAULT_SCHEDULE: Commerce034Payment[] = [
  { date: "Сегодня, 5 марта", note: "спишется сразу после оформления" },
  { date: "19 марта" },
  { date: "2 апреля" },
  { date: "16 апреля", note: "последний платёж" },
]

function money(value: number, currency: string, locale: string) {
  return `${Math.round(value).toLocaleString(locale)} ${currency}`
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

/**
 * Оплата с рассрочкой: платёж и переплата считаются из суммы, график с датами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce034({
  title = "Как заплатить",
  amount = 51505,
  currency = "₽",
  plans = DEFAULT_PLANS,
  scheduleTitle = "График платежей по выбранному плану",
  schedule = DEFAULT_SCHEDULE,
  warning = "Рассрочку оформляет банк-партнёр: он проверит данные и может отказать. Просрочка платежа попадает в кредитную историю, а товар при этом остаётся у вас.",
  cta = "Оформить рассрочку",
  sumText = "Сумма заказа {amount} · выберите, как её разделить",
  plansLegend = "Способ оплаты",
  overpayText = "переплата {amount}",
  noOverpayText = "без переплаты",
  numberLocale = "ru-RU",
  accent,
  background = "",
  className,
  style,
}: Commerce034Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-034-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-034-bg": background,
          "--vibeui-commerce-034-radius": "1.25rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const chosen = plans[1] ?? plans[0]
  const part = chosen ? (amount * (1 + chosen.overpay)) / chosen.parts : amount
  // Сумма в строке выделена жирным, поэтому шаблон разрезается по {amount}.
  const [sumHead, sumTail] = sumText.split("{amount}")

  return (
    <>
      <style href="vibeui-commerce-034" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-034"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="sum">
            {sumHead}
            <b>{money(amount, currency, numberLocale)}</b>
            {sumTail ?? ""}
          </p>

          <form>
            <fieldset>
              <legend>{plansLegend}</legend>
              <div data-part="plans">
                {plans.map((plan) => {
                  const total = amount * (1 + plan.overpay)

                  return (
                    <label data-part="plan" key={plan.id}>
                      <input
                        type="radio"
                        name="commerce-034-plan"
                        value={plan.id}
                        defaultChecked={plan.id === chosen?.id}
                      />
                      <span
                        data-part="face"
                        data-empty={plan.image ? undefined : "true"}
                      >
                        {plan.image ? (
                          <img
                            src={plan.image}
                            alt=""
                            loading="lazy"
                            decoding="async"
                          />
                        ) : null}
                        <span data-part="label">{plan.label}</span>
                        <span data-part="per">
                          {money(total / plan.parts, currency, numberLocale)}
                          {plan.parts > 1 ? (
                            <small> × {plan.parts}</small>
                          ) : null}
                        </span>
                        <span
                          data-part="over"
                          data-cost={plan.overpay > 0 ? "yes" : "no"}
                        >
                          {plan.overpay > 0
                            ? overpayText.replace(
                                "{amount}",
                                money(total - amount, currency, numberLocale),
                              )
                            : noOverpayText}
                        </span>
                        <span data-part="note">{plan.note}</span>
                      </span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          </form>

          <h3>{scheduleTitle}</h3>
          <ol>
            {schedule.map((payment, index) => (
              <li data-part="row" key={payment.date}>
                <span data-part="num" aria-hidden="true">
                  {index + 1}
                </span>
                <span>
                  <p data-part="when">{payment.date}</p>
                  {payment.note ? <p data-part="hint">{payment.note}</p> : null}
                </span>
                <p data-part="money">{money(part, currency, numberLocale)}</p>
              </li>
            ))}
          </ol>

          <p data-part="warn">{warning}</p>

          <button type="button" data-part="cta">
            {cta}
          </button>
        </div>
      </section>
    </>
  )
}

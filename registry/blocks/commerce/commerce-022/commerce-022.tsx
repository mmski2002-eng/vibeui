import type { CSSProperties } from "react"

export type Commerce022Card = {
  id: string
  brand: string
  last4: string
  expires: string
  bank?: string
  expiring?: boolean
  hue?: number
}

export type Commerce022Props = {
  title?: string
  amount?: string
  cards?: Commerce022Card[]
  extra?: { value: string; label: string; hint: string }[]
  cta?: string
  secure?: string
  /** Скрытая подпись выбора способа оплаты. */
  payLabel?: string
  /** Шаблон срока действия карты, {date} — месяц и год. */
  expiresText?: string
  /** Пометка карты, срок которой скоро выйдет. */
  expiringText?: string
  /** Шаблон подписи поля CVC, {last4} — последние цифры карты. */
  cvcText?: string
  /** Подпись и пояснение варианта новой карты. */
  newCardLabel?: string
  newCardHint?: string
  /** Подписи полей новой карты. */
  panLabel?: string
  expLabel?: string
  /** Подпись галочки запоминания карты. */
  rememberText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: оплата сохранёнными картами, где карта узнаётся по банку и
// четырём цифрам, а не по логотипу платёжной системы: у человека три карты
// одной системы и он различает их по банку. Истекающая карта помечена
// заранее, потому что отказ на оплате объясняют «попробуйте другую карту»,
// когда уже поздно. Новая карта — такой же вариант в списке, и её поля
// появляются на :has(), поэтому блок остаётся серверным.
const STYLES = `
:where([data-vibeui-block="commerce-022"]){
--vibeui-commerce-022-bg:transparent;
--vibeui-commerce-022-paper:light-dark(oklch(1 0 0),oklch(0.2 0.012 265));
--vibeui-commerce-022-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-commerce-022-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-commerce-022-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-commerce-022-soft:light-dark(oklch(0.975 0.004 265),oklch(0.27 0.01 265));
--vibeui-commerce-022-accent:light-dark(oklch(0.55 0.2 262),oklch(0.7 0.17 262));
--vibeui-commerce-022-on-accent:light-dark(oklch(1 0 0),oklch(0.16 0.02 265));
--vibeui-commerce-022-warn:light-dark(oklch(0.62 0.16 45),oklch(0.79 0.14 45));
--vibeui-commerce-022-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-022"]{color-scheme:dark}
[data-vibeui-block="commerce-022"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-commerce-022-bg);
font-family:var(--vibeui-commerce-022-sans);color:var(--vibeui-commerce-022-fg);
}
[data-vibeui-block="commerce-022"] *{box-sizing:border-box}
[data-vibeui-block="commerce-022"] [data-part="vh"]{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
[data-vibeui-block="commerce-022"] [data-part="shell"]{padding:1rem;max-width:36rem;margin:0 auto}
[data-vibeui-block="commerce-022"] [data-part="top"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.5rem;margin-bottom:0.875rem}
[data-vibeui-block="commerce-022"] h2{margin:0;font-size:1.125rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-022"] [data-part="amount"]{margin-left:auto;font-size:1.25rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-022"] fieldset{margin:0;padding:0;border:0}
[data-vibeui-block="commerce-022"] form{display:contents}
[data-vibeui-block="commerce-022"] [data-part="list"]{display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="commerce-022"] [data-part="card"]{
display:grid;grid-template-columns:auto 2.5rem minmax(0,1fr) auto;gap:0.625rem;align-items:center;
padding:0.625rem 0.75rem;border-radius:0.875rem;
border:1px solid var(--vibeui-commerce-022-border);
}
[data-vibeui-block="commerce-022"] [data-part="grab"]{display:contents;cursor:pointer}
[data-vibeui-block="commerce-022"] label[data-part="card"]{cursor:pointer}
[data-vibeui-block="commerce-022"] [data-part="card"]:has(input:checked){border-color:var(--vibeui-commerce-022-accent);background:var(--vibeui-commerce-022-soft)}
[data-vibeui-block="commerce-022"] [data-part="card"]:has(input:focus-visible){outline:2px solid var(--vibeui-commerce-022-accent);outline-offset:2px}
[data-vibeui-block="commerce-022"] input[type="radio"],
[data-vibeui-block="commerce-022"] input[type="checkbox"]{accent-color:var(--vibeui-commerce-022-accent);width:1rem;height:1rem;margin:0}
/* Карту узнают по банку и четырём цифрам, а не по логотипу системы. */
[data-vibeui-block="commerce-022"] [data-part="plate"]{
display:flex;align-items:center;justify-content:center;
width:2.5rem;height:1.625rem;border-radius:0.3125rem;
background:linear-gradient(135deg,oklch(0.85 0.09 var(--vibeui-commerce-022-hue,262)),oklch(0.72 0.13 var(--vibeui-commerce-022-hue,262)));
color:oklch(1 0 0);font-size:0.5625rem;font-weight:700;letter-spacing:0.02em;
}
[data-vibeui-block="commerce-022"] [data-part="num"]{display:block;font-size:0.8125rem;font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-022"] [data-part="sub"]{display:block;font-size:0.6875rem;color:var(--vibeui-commerce-022-muted)}
[data-vibeui-block="commerce-022"] [data-part="soon"]{
display:inline-block;margin-top:0.1875rem;padding:0.0625rem 0.375rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-commerce-022-warn) 15%,transparent);
color:var(--vibeui-commerce-022-warn);font-size:0.625rem;font-weight:700;
}
[data-vibeui-block="commerce-022"] [data-part="cvc"]{
width:4.5rem;font:inherit;font-size:0.8125rem;height:2.25rem;text-align:center;letter-spacing:0.2em;
border:1px solid var(--vibeui-commerce-022-border);border-radius:0.5rem;background:var(--vibeui-commerce-022-paper);color:inherit;
}
[data-vibeui-block="commerce-022"] input:focus-visible{outline:2px solid var(--vibeui-commerce-022-accent);outline-offset:1px}
/* Поля новой карты появляются только под её вариантом. */
[data-vibeui-block="commerce-022"] [data-part="fresh"]{display:none;gap:0.5rem;grid-template-columns:1fr;margin-top:0.625rem}
[data-vibeui-block="commerce-022"] [data-part="list"]:has(#commerce-022-new:checked) [data-part="fresh"]{display:grid}
@container (min-width: 30rem){
[data-vibeui-block="commerce-022"] [data-part="fresh"]{grid-template-columns:2fr 1fr 1fr}
}
[data-vibeui-block="commerce-022"] label[data-part="field"]{display:flex;flex-direction:column;gap:0.25rem;font-size:0.6875rem;color:var(--vibeui-commerce-022-muted)}
[data-vibeui-block="commerce-022"] label[data-part="field"] input{
font:inherit;font-size:0.8125rem;height:2.375rem;padding:0 0.625rem;color:var(--vibeui-commerce-022-fg);
border:1px solid var(--vibeui-commerce-022-border);border-radius:0.625rem;background:var(--vibeui-commerce-022-paper);
}
[data-vibeui-block="commerce-022"] [data-part="remember"]{display:flex;align-items:center;gap:0.5rem;margin-top:0.75rem;font-size:0.75rem;cursor:pointer}
[data-vibeui-block="commerce-022"] [data-part="pay"]{
width:100%;margin-top:0.875rem;appearance:none;border:0;cursor:pointer;height:2.75rem;border-radius:0.75rem;
background:var(--vibeui-commerce-022-accent);color:var(--vibeui-commerce-022-on-accent);font:inherit;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="commerce-022"] [data-part="pay"]:focus-visible{outline:2px solid var(--vibeui-commerce-022-accent);outline-offset:2px}
[data-vibeui-block="commerce-022"] [data-part="secure"]{
display:flex;gap:0.375rem;align-items:flex-start;margin:0.625rem 0 0;
font-size:0.6875rem;line-height:1.45;color:var(--vibeui-commerce-022-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-022"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CARDS: Commerce022Card[] = [
  {
    id: "1",
    brand: "MIR",
    last4: "4417",
    expires: "09/27",
    bank: "Зелёный банк",
    hue: 150,
  },
  {
    id: "2",
    brand: "VISA",
    last4: "2210",
    expires: "04/26",
    bank: "Синий банк",
    expiring: true,
    hue: 262,
  },
]

const DEFAULT_EXTRA = [
  {
    value: "sbp",
    label: "По QR через СБП",
    hint: "Без комиссии, подтверждение в приложении банка",
  },
]

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
 * Оплата сохранёнными картами: банк и четыре цифры, новая карта — вариант списка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce022({
  title = "Оплата",
  amount = "51 505 ₽",
  cards = DEFAULT_CARDS,
  extra = DEFAULT_EXTRA,
  cta = "Оплатить",
  secure = "Данные карты уходят в банк напрямую, магазин их не хранит. Списание пройдёт после подтверждения в приложении банка.",
  payLabel = "Чем платите",
  expiresText = "до {date}",
  expiringText = "скоро истекает",
  cvcText = "CVC карты {last4}",
  newCardLabel = "Новая карта",
  newCardHint = "Спишем 1 ₽ и сразу вернём для проверки",
  panLabel = "Номер карты",
  expLabel = "Срок",
  rememberText = "Запомнить карту для следующих заказов",
  accent,
  background = "",
  className,
  style,
}: Commerce022Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-022-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-022-bg": background,
          "--vibeui-commerce-022-paper": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-022" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-022"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="top">
            <h2>{title}</h2>
            <span data-part="amount">{amount}</span>
          </div>

          <form>
            <fieldset data-part="list">
              <legend data-part="vh">{payLabel}</legend>

              {cards.map((card, index) => (
                <div
                  key={card.id}
                  data-part="card"
                  style={
                    {
                      "--vibeui-commerce-022-hue": card.hue ?? 262,
                    } as CSSProperties
                  }
                >
                  <label data-part="grab">
                    <input
                      type="radio"
                      name="commerce-022-pay"
                      value={card.id}
                      defaultChecked={index === 0}
                    />
                    <span data-part="plate" aria-hidden="true">
                      {card.brand}
                    </span>
                    <span>
                      <span data-part="num">•••• {card.last4}</span>
                      <span data-part="sub">
                        {card.bank ? `${card.bank} · ` : ""}
                        {expiresText.replace("{date}", card.expires)}
                      </span>
                      {card.expiring ? (
                        <span data-part="soon">{expiringText}</span>
                      ) : null}
                    </span>
                  </label>
                  <input
                    data-part="cvc"
                    type="text"
                    inputMode="numeric"
                    maxLength={3}
                    aria-label={cvcText.replace("{last4}", card.last4)}
                    placeholder="CVC"
                  />
                </div>
              ))}

              {extra.map((way) => (
                <label key={way.value} data-part="card">
                  <input
                    type="radio"
                    name="commerce-022-pay"
                    value={way.value}
                  />
                  <span data-part="plate" aria-hidden="true">
                    QR
                  </span>
                  <span>
                    <span data-part="num">{way.label}</span>
                    <span data-part="sub">{way.hint}</span>
                  </span>
                  <span />
                </label>
              ))}

              <label data-part="card">
                <input
                  type="radio"
                  name="commerce-022-pay"
                  id="commerce-022-new"
                />
                <span data-part="plate" aria-hidden="true">
                  +
                </span>
                <span>
                  <span data-part="num">{newCardLabel}</span>
                  <span data-part="sub">{newCardHint}</span>
                </span>
                <span />
              </label>

              <div data-part="fresh">
                <label data-part="field" htmlFor="commerce-022-pan">
                  {panLabel}
                  <input
                    id="commerce-022-pan"
                    type="text"
                    inputMode="numeric"
                  />
                </label>
                <label data-part="field" htmlFor="commerce-022-exp">
                  {expLabel}
                  <input
                    id="commerce-022-exp"
                    type="text"
                    inputMode="numeric"
                  />
                </label>
                <label data-part="field" htmlFor="commerce-022-code">
                  CVC
                  <input
                    id="commerce-022-code"
                    type="text"
                    inputMode="numeric"
                  />
                </label>
              </div>
            </fieldset>
          </form>

          <label data-part="remember">
            <input type="checkbox" defaultChecked />
            {rememberText}
          </label>

          <button type="button" data-part="pay">
            {cta} {amount}
          </button>

          <p data-part="secure">
            <span aria-hidden="true">🔒</span>
            <span>{secure}</span>
          </p>
        </div>
      </section>
    </>
  )
}

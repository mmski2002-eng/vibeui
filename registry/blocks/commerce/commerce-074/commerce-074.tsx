import type { CSSProperties } from "react"

export type Commerce074Value = {
  value: string
  amount: string
  hint: string
}

export type Commerce074Design = {
  value: string
  label: string
  hue: number
}

export type Commerce074Props = {
  kicker?: string
  title?: string
  lead?: string
  valueLegend?: string
  values?: Commerce074Value[]
  designLegend?: string
  designs?: Commerce074Design[]
  deliveryLegend?: string
  toLabel?: string
  toPlaceholder?: string
  whenLabel?: string
  messageLabel?: string
  messagePlaceholder?: string
  cta?: string
  rules?: string[]
  rulesTitle?: string
  cardKicker?: string
  cardAmount?: string
  cardValid?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: покупка подарочного сертификата, где превращение подарка в
// проблему предотвращают заранее. Правила — срок действия, остаток, возврат —
// стоят рядом с кнопкой, а не в подвале: именно о них спорят потом. Дизайн
// открытки выбирается радиокнопками, и выбранный сразу виден в превью через
// :has(), поэтому не нужен ни JS, ни второй экран.
const STYLES = `
:where([data-vibeui-block="commerce-074"]){
--vibeui-commerce-074-bg:transparent;
--vibeui-commerce-074-surface:light-dark(oklch(1 0 0),oklch(0.22 0.016 15));
--vibeui-commerce-074-fg:light-dark(oklch(0.2 0.014 15),oklch(0.94 0.008 15));
--vibeui-commerce-074-muted:light-dark(oklch(0.53 0.016 15),oklch(0.73 0.014 15));
--vibeui-commerce-074-border:light-dark(oklch(0.9 0.01 15),oklch(0.38 0.018 15));
--vibeui-commerce-074-soft:light-dark(oklch(0.975 0.008 25),oklch(0.27 0.02 25));
--vibeui-commerce-074-accent:light-dark(oklch(0.52 0.16 10),oklch(0.78 0.15 10));
--vibeui-commerce-074-onaccent:light-dark(oklch(0.99 0 0),oklch(0.2 0.05 10));
--vibeui-commerce-074-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-074"]{color-scheme:dark}
[data-vibeui-block="commerce-074"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-074-bg);
color:var(--vibeui-commerce-074-fg);font-family:var(--vibeui-commerce-074-sans);
}
[data-vibeui-block="commerce-074"] *{box-sizing:border-box}
[data-vibeui-block="commerce-074"] form{display:contents}
[data-vibeui-block="commerce-074"] [data-part="shell"]{max-width:60rem;margin:0 auto;padding:1.25rem 1rem 2rem;display:grid;gap:1.25rem;grid-template-columns:1fr}
[data-vibeui-block="commerce-074"] [data-part="kicker"]{margin:0;font-size:0.75rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--vibeui-commerce-074-accent)}
[data-vibeui-block="commerce-074"] h2{margin:0.375rem 0 0.5rem;font-size:clamp(1.25rem,4cqi,1.875rem);line-height:1.12;letter-spacing:-0.02em}
[data-vibeui-block="commerce-074"] [data-part="lead"]{margin:0 0 1.25rem;max-width:52ch;font-size:0.875rem;line-height:1.55;color:var(--vibeui-commerce-074-muted)}
[data-vibeui-block="commerce-074"] fieldset{border:0;margin:0 0 1.125rem;padding:0;min-inline-size:0}
[data-vibeui-block="commerce-074"] legend{
padding:0;margin:0 0 0.5rem;font-size:0.75rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-commerce-074-muted);
}
[data-vibeui-block="commerce-074"] [data-part="values"]{display:grid;gap:0.5rem;grid-template-columns:repeat(2,minmax(0,1fr));clear:both}
[data-vibeui-block="commerce-074"] [data-part="opt"]{position:relative}
[data-vibeui-block="commerce-074"] [data-part="opt"] input{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
[data-vibeui-block="commerce-074"] [data-part="vface"]{
display:block;cursor:pointer;text-align:center;border:1px solid var(--vibeui-commerce-074-border);border-radius:0.875rem;
padding:0.6875rem 0.5rem;transition:border-color .14s ease,background-color .14s ease;
}
[data-vibeui-block="commerce-074"] [data-part="opt"] input:checked+[data-part="vface"],
[data-vibeui-block="commerce-074"] [data-part="opt"] input:checked+[data-part="dface"]{
border-color:var(--vibeui-commerce-074-accent);background:var(--vibeui-commerce-074-soft);
box-shadow:inset 0 0 0 1px var(--vibeui-commerce-074-accent);
}
[data-vibeui-block="commerce-074"] [data-part="opt"] input:focus-visible+[data-part="vface"],
[data-vibeui-block="commerce-074"] [data-part="opt"] input:focus-visible+[data-part="dface"]{outline:2px solid var(--vibeui-commerce-074-accent);outline-offset:2px}
[data-vibeui-block="commerce-074"] [data-part="amount"]{display:block;font-size:1.125rem;font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-074"] [data-part="vhint"]{display:block;margin-top:0.125rem;font-size:0.6875rem;line-height:1.4;color:var(--vibeui-commerce-074-muted)}
[data-vibeui-block="commerce-074"] [data-part="designs"]{display:flex;flex-wrap:wrap;gap:0.5rem;clear:both}
[data-vibeui-block="commerce-074"] [data-part="dface"]{
display:flex;gap:0.5rem;align-items:center;cursor:pointer;border:1px solid var(--vibeui-commerce-074-border);
border-radius:0.75rem;padding:0.4375rem 0.6875rem;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="commerce-074"] [data-part="swatch"]{
width:1.25rem;height:1.25rem;border-radius:0.375rem;
background:linear-gradient(140deg,oklch(0.9 0.08 var(--vibeui-commerce-074-hue,10)),oklch(0.74 0.14 var(--vibeui-commerce-074-hue,10)));
}
[data-vibeui-block="commerce-074"] [data-part="fields"]{display:grid;gap:0.625rem;grid-template-columns:1fr}
[data-vibeui-block="commerce-074"] [data-part="field"]{display:grid;gap:0.25rem}
[data-vibeui-block="commerce-074"] [data-part="field"]>span{font-size:0.75rem;font-weight:650;color:var(--vibeui-commerce-074-muted)}
[data-vibeui-block="commerce-074"] input[type="email"],
[data-vibeui-block="commerce-074"] input[type="date"],
[data-vibeui-block="commerce-074"] textarea{
padding:0.5rem 0.75rem;border-radius:0.625rem;border:1px solid var(--vibeui-commerce-074-border);
background:var(--vibeui-commerce-074-surface);font:inherit;font-size:0.875rem;color:inherit;
}
[data-vibeui-block="commerce-074"] input[type="email"],
[data-vibeui-block="commerce-074"] input[type="date"]{height:2.5rem;padding-top:0;padding-bottom:0}
[data-vibeui-block="commerce-074"] textarea{resize:vertical;min-height:4.5rem;line-height:1.5}
[data-vibeui-block="commerce-074"] input:focus-visible,
[data-vibeui-block="commerce-074"] textarea:focus-visible,
[data-vibeui-block="commerce-074"] [data-part="go"]:focus-visible{outline:2px solid var(--vibeui-commerce-074-accent);outline-offset:2px}
[data-vibeui-block="commerce-074"] [data-part="panel"]{align-self:start}
[data-vibeui-block="commerce-074"] [data-part="card"]{
border-radius:1rem;padding:1.125rem;color:oklch(0.99 0 0);min-height:10rem;
display:flex;flex-direction:column;justify-content:space-between;
background:linear-gradient(140deg,oklch(0.58 0.15 10),oklch(0.42 0.12 340));
}
[data-vibeui-block="commerce-074"] [data-part="shell"]:has(#commerce-074-design-forest:checked) [data-part="card"]{background:linear-gradient(140deg,oklch(0.55 0.13 150),oklch(0.38 0.1 190))}
[data-vibeui-block="commerce-074"] [data-part="shell"]:has(#commerce-074-design-sea:checked) [data-part="card"]{background:linear-gradient(140deg,oklch(0.56 0.13 225),oklch(0.4 0.11 265))}
[data-vibeui-block="commerce-074"] [data-part="cardtop"]{font-size:0.6875rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;opacity:0.85}
[data-vibeui-block="commerce-074"] [data-part="cardsum"]{margin:0;font-size:2rem;font-weight:750;line-height:1;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-074"] [data-part="cardfoot"]{margin:0;font-size:0.75rem;opacity:0.85}
[data-vibeui-block="commerce-074"] h3{margin:1rem 0 0.5rem;font-size:0.75rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--vibeui-commerce-074-muted)}
[data-vibeui-block="commerce-074"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.375rem}
[data-vibeui-block="commerce-074"] li{display:flex;gap:0.5rem;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-commerce-074-muted)}
[data-vibeui-block="commerce-074"] li::before{content:"—";flex:none;color:var(--vibeui-commerce-074-accent)}
[data-vibeui-block="commerce-074"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;width:100%;height:2.875rem;margin-top:1rem;border-radius:0.875rem;
background:var(--vibeui-commerce-074-accent);color:var(--vibeui-commerce-074-onaccent);font:inherit;font-size:0.9375rem;font-weight:700;
}
@container (min-width: 34rem){
[data-vibeui-block="commerce-074"] [data-part="values"]{grid-template-columns:repeat(4,minmax(0,1fr))}
[data-vibeui-block="commerce-074"] [data-part="fields"]{grid-template-columns:repeat(2,minmax(0,1fr))}
[data-vibeui-block="commerce-074"] [data-part="field"][data-wide]{grid-column:1 / -1}
}
@container (min-width: 48rem){
[data-vibeui-block="commerce-074"] [data-part="shell"]{padding:2rem 2rem 3rem;grid-template-columns:minmax(0,1fr) 19rem;gap:1.75rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-074"] *{animation:none!important;transition:none!important}}
`

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

const DEFAULT_VALUES: Commerce074Value[] = [
  { value: "3000", amount: "3 000 ₽", hint: "на кружку и зерно" },
  { value: "5000", amount: "5 000 ₽", hint: "на текстиль" },
  { value: "10000", amount: "10 000 ₽", hint: "на свет" },
  { value: "25000", amount: "25 000 ₽", hint: "на мебель" },
]

const DEFAULT_DESIGNS: Commerce074Design[] = [
  { value: "sunset", label: "Закат", hue: 10 },
  { value: "forest", label: "Хвоя", hue: 150 },
  { value: "sea", label: "Отмель", hue: 220 },
]

const DEFAULT_RULES = [
  "Сертификат действует год с даты покупки, дата напечатана на открытке.",
  "Остаток сохраняется: можно потратить за несколько заказов.",
  "Сертификат нельзя обменять на деньги, но можно передать другому человеку.",
  "Если заказ дороже номинала, разницу доплачивают картой при оформлении.",
]

/**
 * Страница подарочного сертификата: номинал и дизайн радиокнопками,
 * превью открытки и правила рядом с кнопкой. Один файл, ноль зависимостей.
 */
export function Commerce074({
  kicker = "Подарочный сертификат",
  title = "Подарок, который не нужно угадывать",
  lead = "Сертификат приходит письмом в выбранный день. Получатель тратит его на что угодно из каталога, а остаток сохраняется.",
  valueLegend = "Номинал",
  values = DEFAULT_VALUES,
  designLegend = "Оформление открытки",
  designs = DEFAULT_DESIGNS,
  deliveryLegend = "Кому и когда отправить",
  toLabel = "Почта получателя",
  toPlaceholder = "имя@почта.рф",
  whenLabel = "Дата отправки",
  messageLabel = "Подпись на открытке",
  messagePlaceholder = "С днём рождения! Выбери сам — я знаю, что так надёжнее.",
  cta = "Купить сертификат",
  rulesTitle = "Что важно знать",
  rules = DEFAULT_RULES,
  cardKicker = "Подарочный сертификат",
  cardAmount = "5 000 ₽",
  cardValid = "Действует до 11 марта 2025 года",
  accent,
  background = "",
  className,
  style,
}: Commerce074Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-074-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-074-bg": background,
          // Поля ввода не должны просвечивать: им нужна непрозрачная
          // подложка, и это тот же цвет.
          "--vibeui-commerce-074-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-074" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-074"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div>
            <p data-part="kicker">{kicker}</p>
            <h2>{title}</h2>
            <p data-part="lead">{lead}</p>

            <form>
              <fieldset>
                <legend>{valueLegend}</legend>
                <div data-part="values">
                  {values.map((entry, index) => (
                    <label
                      key={entry.value}
                      data-part="opt"
                      htmlFor={`commerce-074-value-${entry.value}`}
                    >
                      <input
                        type="radio"
                        id={`commerce-074-value-${entry.value}`}
                        name="commerce-074-value"
                        defaultChecked={index === 1}
                      />
                      <span data-part="vface">
                        <span data-part="amount">{entry.amount}</span>
                        <span data-part="vhint">{entry.hint}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend>{designLegend}</legend>
                <div data-part="designs">
                  {designs.map((design, index) => (
                    <label
                      key={design.value}
                      data-part="opt"
                      htmlFor={`commerce-074-design-${design.value}`}
                    >
                      <input
                        type="radio"
                        id={`commerce-074-design-${design.value}`}
                        name="commerce-074-design"
                        defaultChecked={index === 0}
                      />
                      <span
                        data-part="dface"
                        style={
                          {
                            "--vibeui-commerce-074-hue": design.hue,
                          } as CSSProperties
                        }
                      >
                        <span data-part="swatch" aria-hidden="true" />
                        {design.label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend>{deliveryLegend}</legend>
                <div data-part="fields">
                  <label data-part="field" htmlFor="commerce-074-to">
                    <span>{toLabel}</span>
                    <input
                      id="commerce-074-to"
                      name="to"
                      type="email"
                      placeholder={toPlaceholder}
                    />
                  </label>
                  <label data-part="field" htmlFor="commerce-074-when">
                    <span>{whenLabel}</span>
                    <input id="commerce-074-when" name="when" type="date" />
                  </label>
                  <label
                    data-part="field"
                    data-wide="true"
                    htmlFor="commerce-074-message"
                  >
                    <span>{messageLabel}</span>
                    <textarea
                      id="commerce-074-message"
                      name="message"
                      rows={3}
                      maxLength={200}
                      placeholder={messagePlaceholder}
                    />
                  </label>
                </div>
              </fieldset>
            </form>
          </div>

          <aside data-part="panel">
            <div data-part="card">
              <span data-part="cardtop">{cardKicker}</span>
              <p data-part="cardsum">{cardAmount}</p>
              <p data-part="cardfoot">{cardValid}</p>
            </div>
            <h3>{rulesTitle}</h3>
            <ul>
              {rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
            <button type="button" data-part="go">
              {cta}
            </button>
          </aside>
        </div>
      </section>
    </>
  )
}

import type { CSSProperties } from "react"

export type Commerce019Period = {
  value: string
  label: string
  hint: string
}

export type Commerce019Props = {
  title?: string
  product?: string
  once?: string
  regular?: string
  discount?: number
  periods?: Commerce019Period[]
  first?: string
  cta?: string
  rules?: string[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: выбор между разовой покупкой и подпиской, где обе цены видно
// одновременно. Подписка, у которой не с чем сравнить, читается как ловушка.
// Периодичность появляется только под выбранной подпиской — на :has(), без
// клиентского состояния, — и сразу называет дату первой доставки: «каждые
// 4 недели» без даты не отвечает на вопрос «когда придёт». Условия отмены
// стоят рядом с кнопкой, а не в подвале страницы.
const STYLES = `
:where([data-vibeui-block="commerce-019"]){
--vibeui-commerce-019-bg:oklch(1 0 0);
--vibeui-commerce-019-fg:oklch(0.21 0.014 265);
--vibeui-commerce-019-muted:oklch(0.55 0.014 265);
--vibeui-commerce-019-border:oklch(0.91 0.006 265);
--vibeui-commerce-019-soft:oklch(0.975 0.004 265);
--vibeui-commerce-019-accent:oklch(0.52 0.16 165);
--vibeui-commerce-019-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-019"]{
box-sizing:border-box;
background:var(--vibeui-commerce-019-bg);
font-family:var(--vibeui-commerce-019-sans);color:var(--vibeui-commerce-019-fg);
}
[data-vibeui-block="commerce-019"] *{box-sizing:border-box}
[data-vibeui-block="commerce-019"] [data-part="shell"]{padding:1rem;max-width:38rem;margin:0 auto}
[data-vibeui-block="commerce-019"] h2{margin:0 0 0.25rem;font-size:1.125rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-019"] [data-part="product"]{margin:0 0 0.875rem;font-size:0.8125rem;color:var(--vibeui-commerce-019-muted)}
[data-vibeui-block="commerce-019"] [data-part="vh"]{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
[data-vibeui-block="commerce-019"] [data-part="modes"]{display:grid;gap:0.5rem;grid-template-columns:1fr;margin:0 0 0.75rem;padding:0;border:0}
@container (min-width: 28rem){
[data-vibeui-block="commerce-019"] [data-part="modes"]{grid-template-columns:1fr 1fr}
}
[data-vibeui-block="commerce-019"] [data-part="mode"]{
display:block;padding:0.75rem;border-radius:0.875rem;cursor:pointer;
border:1px solid var(--vibeui-commerce-019-border);
}
[data-vibeui-block="commerce-019"] [data-part="mode"]:has(input:checked){border-color:var(--vibeui-commerce-019-accent);background:var(--vibeui-commerce-019-soft)}
[data-vibeui-block="commerce-019"] [data-part="mode"]:has(input:focus-visible){outline:2px solid var(--vibeui-commerce-019-accent);outline-offset:2px}
[data-vibeui-block="commerce-019"] input[type="radio"]{accent-color:var(--vibeui-commerce-019-accent);width:1rem;height:1rem;margin:0}
[data-vibeui-block="commerce-019"] [data-part="head"]{display:flex;align-items:center;gap:0.5rem;font-size:0.8125rem;font-weight:650}
/* Обе цены видно сразу: подписке нужно с чем сравниться. */
[data-vibeui-block="commerce-019"] [data-part="cost"]{margin:0.375rem 0 0;font-size:1.25rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.02em}
[data-vibeui-block="commerce-019"] [data-part="per"]{font-size:0.6875rem;font-weight:500;color:var(--vibeui-commerce-019-muted)}
[data-vibeui-block="commerce-019"] [data-part="tag"]{
display:inline-block;margin-top:0.375rem;padding:0.125rem 0.4375rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-commerce-019-accent) 16%,transparent);
color:var(--vibeui-commerce-019-accent);font-size:0.625rem;font-weight:700;
}
/* Периодичность появляется только под подпиской — на :has(), без состояния. */
[data-vibeui-block="commerce-019"] [data-part="plan"]{display:none;margin-bottom:0.875rem}
[data-vibeui-block="commerce-019"] [data-part="picker"]:has(#commerce-019-sub:checked) [data-part="plan"]{display:block}
[data-vibeui-block="commerce-019"] [data-part="cap"]{margin:0 0 0.375rem;font-size:0.75rem;font-weight:700;letter-spacing:0.02em;text-transform:uppercase;color:var(--vibeui-commerce-019-muted)}
[data-vibeui-block="commerce-019"] [data-part="periods"]{display:flex;flex-wrap:wrap;gap:0.375rem;padding:0;border:0;margin:0}
[data-vibeui-block="commerce-019"] [data-part="period"]{
display:flex;flex-direction:column;gap:0.125rem;cursor:pointer;flex:1 1 8rem;
padding:0.5rem 0.625rem;border-radius:0.75rem;border:1px solid var(--vibeui-commerce-019-border);
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="commerce-019"] [data-part="period"] input{position:absolute;width:1px;height:1px;opacity:0}
[data-vibeui-block="commerce-019"] [data-part="period"]:has(input:checked){border-color:var(--vibeui-commerce-019-accent);background:var(--vibeui-commerce-019-soft)}
[data-vibeui-block="commerce-019"] [data-part="period"]:has(input:focus-visible){outline:2px solid var(--vibeui-commerce-019-accent);outline-offset:2px}
[data-vibeui-block="commerce-019"] [data-part="hint"]{font-size:0.6875rem;font-weight:500;color:var(--vibeui-commerce-019-muted)}
[data-vibeui-block="commerce-019"] [data-part="first"]{
margin:0.625rem 0 0;padding:0.5rem 0.625rem;border-radius:0.625rem;
background:var(--vibeui-commerce-019-soft);font-size:0.75rem;line-height:1.45;
}
[data-vibeui-block="commerce-019"] [data-part="go"]{
width:100%;appearance:none;border:0;cursor:pointer;height:2.625rem;border-radius:0.75rem;
background:var(--vibeui-commerce-019-accent);color:oklch(1 0 0);font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="commerce-019"] [data-part="go"]:focus-visible{outline:2px solid var(--vibeui-commerce-019-accent);outline-offset:2px}
[data-vibeui-block="commerce-019"] ul{list-style:none;margin:0.625rem 0 0;padding:0;display:flex;flex-direction:column;gap:0.25rem;font-size:0.6875rem;color:var(--vibeui-commerce-019-muted)}
[data-vibeui-block="commerce-019"] li{display:flex;gap:0.375rem;line-height:1.4}
[data-vibeui-block="commerce-019"] li::before{content:"·";color:var(--vibeui-commerce-019-accent);font-weight:700}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-019"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PERIODS: Commerce019Period[] = [
  { value: "2w", label: "Раз в 2 недели", hint: "для семьи из четырёх" },
  { value: "4w", label: "Раз в 4 недели", hint: "чаще всего выбирают" },
  { value: "8w", label: "Раз в 8 недель", hint: "если берёте про запас" },
]

const DEFAULT_RULES = [
  "Отменить или отложить доставку можно в любой момент до сборки заказа.",
  "Цена фиксируется на первые шесть доставок.",
  "Напомним письмом за два дня до списания.",
]

/**
 * Подписка на товар: разовая цена и цена по подписке рядом, период — ниже.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce019({
  title = "Как покупать",
  product = "Кофе «Тихий вечер», зерно, 1 кг",
  once = "1 890 ₽",
  regular = "1 605 ₽",
  discount = 15,
  periods = DEFAULT_PERIODS,
  first = "Первая доставка — 14 марта, дальше каждые 4 недели в тот же день.",
  cta = "Оформить подписку",
  rules = DEFAULT_RULES,
  accent,
  className,
  style,
}: Commerce019Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-019-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-019" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-019"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="product">{product}</p>

          <div data-part="picker">
            <fieldset data-part="modes">
              <legend data-part="vh">Способ покупки</legend>
              <label data-part="mode">
                <span data-part="head">
                  <input type="radio" name="commerce-019-mode" />
                  Разовая покупка
                </span>
                <span data-part="cost">
                  {once} <span data-part="per">за упаковку</span>
                </span>
              </label>
              <label data-part="mode">
                <span data-part="head">
                  <input
                    type="radio"
                    name="commerce-019-mode"
                    id="commerce-019-sub"
                    defaultChecked
                  />
                  По подписке
                </span>
                <span data-part="cost">
                  {regular} <span data-part="per">за упаковку</span>
                </span>
                <span data-part="tag">Выгода {discount}%</span>
              </label>
            </fieldset>

            <div data-part="plan">
              <p data-part="cap">Как часто привозить</p>
              <fieldset data-part="periods">
                <legend data-part="vh">Периодичность</legend>
                {periods.map((period, index) => (
                  <label key={period.value} data-part="period">
                    <input
                      type="radio"
                      name="commerce-019-period"
                      value={period.value}
                      defaultChecked={index === 1}
                    />
                    {period.label}
                    <span data-part="hint">{period.hint}</span>
                  </label>
                ))}
              </fieldset>
              <p data-part="first">{first}</p>
            </div>
          </div>

          <button type="button" data-part="go">
            {cta} · {regular}
          </button>

          <ul>
            {rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

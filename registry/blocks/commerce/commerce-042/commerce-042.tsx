import type { CSSProperties } from "react"

export type Commerce042Rule = {
  id: string
  title: string
  note: string
}

export type Commerce042Props = {
  title?: string
  balance?: number
  expiring?: string
  earn?: number
  order?: string
  spendMax?: number
  level?: string
  nextLevel?: string
  toNext?: number
  progress?: number
  rules?: Commerce042Rule[]
  cta?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: баллы, у которых названа не только сумма, но и срок сгорания и
// предел списания. Баланс без ответа «сколько можно потратить прямо сейчас»
// превращает программу лояльности в непонятное число. Полоса до следующего
// уровня показывает, за что ещё стоит держаться, а курс балла к рублю написан
// прямо в блоке: без него «1 200 баллов» ничего не сообщают.
const STYLES = `
:where([data-vibeui-block="commerce-042"]){
--vibeui-commerce-042-bg:oklch(1 0 0);
--vibeui-commerce-042-fg:oklch(0.21 0.014 265);
--vibeui-commerce-042-muted:oklch(0.55 0.014 265);
--vibeui-commerce-042-border:oklch(0.91 0.006 265);
--vibeui-commerce-042-soft:oklch(0.975 0.004 265);
--vibeui-commerce-042-accent:oklch(0.6 0.16 55);
--vibeui-commerce-042-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-042"]{
box-sizing:border-box;background:var(--vibeui-commerce-042-bg);
color:var(--vibeui-commerce-042-fg);font-family:var(--vibeui-commerce-042-sans);
}
[data-vibeui-block="commerce-042"] *{box-sizing:border-box}
[data-vibeui-block="commerce-042"] [data-part="shell"]{max-width:52rem;margin:0 auto;padding:1.25rem 1rem}
[data-vibeui-block="commerce-042"] [data-part="top"]{
display:grid;gap:0.875rem;padding:1.125rem;border-radius:1.25rem;
background:linear-gradient(145deg,oklch(0.34 0.08 55),oklch(0.24 0.05 40));color:oklch(1 0 0);
}
@container (min-width: 40rem){
[data-vibeui-block="commerce-042"] [data-part="top"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:center;padding:1.5rem}
}
[data-vibeui-block="commerce-042"] h2{margin:0;font-size:0.75rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:oklch(1 0 0 / 70%)}
[data-vibeui-block="commerce-042"] [data-part="balance"]{
margin:0.375rem 0 0;font-size:clamp(2rem,7cqi,3rem);font-weight:800;letter-spacing:-0.035em;line-height:1;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="commerce-042"] [data-part="balance"] small{font-size:0.875rem;font-weight:600;letter-spacing:0;margin-left:0.375rem;color:oklch(1 0 0 / 70%)}
[data-vibeui-block="commerce-042"] [data-part="rate"]{margin:0.375rem 0 0;font-size:0.8125rem;color:oklch(1 0 0 / 78%)}
/* Срок сгорания названа отдельной строкой: молча сгоревшие баллы — потеря доверия. */
[data-vibeui-block="commerce-042"] [data-part="expiring"]{
margin:0.625rem 0 0;padding:0.4375rem 0.625rem;border-radius:0.625rem;
background:oklch(1 0 0 / 15%);font-size:0.75rem;line-height:1.45;
}
[data-vibeui-block="commerce-042"] [data-part="level"]{
padding:0.875rem;border-radius:1rem;background:oklch(1 0 0 / 12%);border:1px solid oklch(1 0 0 / 18%);
}
[data-vibeui-block="commerce-042"] [data-part="levelName"]{margin:0;font-size:0.875rem;font-weight:700}
[data-vibeui-block="commerce-042"] [data-part="toNext"]{margin:0.1875rem 0 0.5rem;font-size:0.75rem;color:oklch(1 0 0 / 75%)}
[data-vibeui-block="commerce-042"] [data-part="track"]{height:0.375rem;border-radius:9999px;background:oklch(1 0 0 / 22%);overflow:hidden}
[data-vibeui-block="commerce-042"] [data-part="track"] i{display:block;height:100%;border-radius:9999px;background:oklch(1 0 0);width:var(--vibeui-commerce-042-fill,40%)}
[data-vibeui-block="commerce-042"] [data-part="scale"]{margin:0.375rem 0 0;display:flex;justify-content:space-between;font-size:0.625rem;color:oklch(1 0 0 / 65%)}
[data-vibeui-block="commerce-042"] [data-part="order"]{
margin-top:0.875rem;padding:0.875rem 1rem;border-radius:1.125rem;
border:1px solid var(--vibeui-commerce-042-border);display:grid;gap:0.75rem;
}
@container (min-width: 40rem){
[data-vibeui-block="commerce-042"] [data-part="order"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
[data-vibeui-block="commerce-042"] [data-part="cell"]{display:grid;gap:0.125rem}
[data-vibeui-block="commerce-042"] [data-part="cell"] dt{font-size:0.75rem;color:var(--vibeui-commerce-042-muted)}
[data-vibeui-block="commerce-042"] [data-part="cell"] dd{margin:0;font-size:1.125rem;font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-042"] [data-part="cell"] dd b{color:var(--vibeui-commerce-042-accent)}
[data-vibeui-block="commerce-042"] [data-part="cell"] span{font-size:0.6875rem;font-weight:500;color:var(--vibeui-commerce-042-muted)}
[data-vibeui-block="commerce-042"] [data-part="use"]{
margin-top:0.875rem;padding:0.875rem;border-radius:1.125rem;background:var(--vibeui-commerce-042-soft);
display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;justify-content:space-between;
}
[data-vibeui-block="commerce-042"] [data-part="use"] p{margin:0;font-size:0.8125rem;line-height:1.5;max-width:26rem}
[data-vibeui-block="commerce-042"] [data-part="cta"]{
appearance:none;border:0;cursor:pointer;height:2.625rem;padding:0 1.25rem;border-radius:0.875rem;
background:var(--vibeui-commerce-042-accent);color:oklch(0.16 0.02 60);font:inherit;font-size:0.875rem;font-weight:700;
}
[data-vibeui-block="commerce-042"] [data-part="cta"]:focus-visible{outline:2px solid var(--vibeui-commerce-042-accent);outline-offset:2px}
[data-vibeui-block="commerce-042"] h3{
margin:1.125rem 0 0.5rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.07em;
text-transform:uppercase;color:var(--vibeui-commerce-042-muted);
}
[data-vibeui-block="commerce-042"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.5rem}
@container (min-width: 40rem){
[data-vibeui-block="commerce-042"] ul{grid-template-columns:repeat(2,minmax(0,1fr))}
}
[data-vibeui-block="commerce-042"] li{
padding:0.625rem 0.75rem;border-radius:0.875rem;border:1px solid var(--vibeui-commerce-042-border);
font-size:0.75rem;line-height:1.5;
}
[data-vibeui-block="commerce-042"] li b{display:block;font-size:0.8125rem;font-weight:650;margin-bottom:0.125rem}
[data-vibeui-block="commerce-042"] li span{color:var(--vibeui-commerce-042-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-042"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_RULES: Commerce042Rule[] = [
  {
    id: "r1",
    title: "1 балл = 1 рубль",
    note: "Курс не меняется, пересчитывать в голове ничего не нужно.",
  },
  {
    id: "r2",
    title: "Списать можно до 30% заказа",
    note: "Остальное — деньгами: так работает касса, а не наше желание.",
  },
  {
    id: "r3",
    title: "Начисляем через 14 дней",
    note: "После того как пройдёт срок возврата товара.",
  },
  {
    id: "r4",
    title: "Баллы живут год",
    note: "Считаем от даты начисления, за месяц пришлём напоминание.",
  },
]

/**
 * Бонусные баллы при покупке: баланс, срок сгорания, предел списания и уровень.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce042({
  title = "Ваши баллы",
  balance = 3240,
  expiring = "480 баллов сгорят 31 марта — успейте потратить их в этом заказе",
  earn = 515,
  order = "51 505 ₽",
  spendMax = 1546,
  level = "Уровень «Постоянный», 5% баллами",
  nextLevel = "«Частый гость», 7% баллами",
  toNext = 12500,
  progress = 64,
  rules = DEFAULT_RULES,
  cta = "Списать баллы в этом заказе",
  accent,
  className,
  style,
}: Commerce042Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-042-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-042" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-042"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div
            data-part="top"
            style={
              { "--vibeui-commerce-042-fill": `${progress}%` } as CSSProperties
            }
          >
            <div>
              <h2>{title}</h2>
              <p data-part="balance">
                {balance.toLocaleString("ru-RU")}
                <small>баллов</small>
              </p>
              <p data-part="rate">
                Это {balance.toLocaleString("ru-RU")} ₽ при списании: курс один
                к одному
              </p>
              <p data-part="expiring">{expiring}</p>
            </div>
            <div data-part="level">
              <p data-part="levelName">{level}</p>
              <p data-part="toNext">
                До уровня {nextLevel} осталось потратить{" "}
                {toNext.toLocaleString("ru-RU")} ₽
              </p>
              <div data-part="track" aria-hidden="true">
                <i />
              </div>
              <p data-part="scale">
                <span>текущий</span>
                <span>следующий</span>
              </p>
            </div>
          </div>

          <dl data-part="order">
            <div data-part="cell">
              <dt>Начислим за этот заказ на {order}</dt>
              <dd>
                <b>+{earn.toLocaleString("ru-RU")}</b> баллов{" "}
                <span>придут через 14 дней после доставки</span>
              </dd>
            </div>
            <div data-part="cell">
              <dt>Можно списать прямо сейчас</dt>
              <dd>
                {spendMax.toLocaleString("ru-RU")} баллов{" "}
                <span>не больше 30% от суммы заказа</span>
              </dd>
            </div>
          </dl>

          <div data-part="use">
            <p>
              Спишем максимум и уменьшим сумму к оплате. Начисление за заказ при
              этом сохранится — баллы за покупку не отменяются.
            </p>
            <button type="button" data-part="cta">
              {cta}
            </button>
          </div>

          <h3>Как это работает</h3>
          <ul>
            {rules.map((rule) => (
              <li key={rule.id}>
                <b>{rule.title}</b>
                <span>{rule.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

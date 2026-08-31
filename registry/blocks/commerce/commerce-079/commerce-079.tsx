import type { CSSProperties } from "react"

export type Commerce079Point = {
  id: string
  month: string
  value: number
  label: string
  low?: boolean
}

export type Commerce079Props = {
  title?: string
  product?: string
  price?: string
  oldPrice?: string
  discount?: string
  minLabel?: string
  minPrice?: string
  minWhen?: string
  avgLabel?: string
  avgPrice?: string
  chartTitle?: string
  points?: Commerce079Point[]
  verdict?: string
  cta?: string
  watch?: string
  honesty?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: сравнение цены с историей, а не с «рекомендованной». Скидка
// от вчерашней завышенной цены — самый частый обман витрины, поэтому
// рядом стоят минимум за период и дата, когда он был. График нарисован
// столбиками из div: библиотека графиков ради шести значений — лишняя
// зависимость, а цифры всё равно продублированы текстом под графиком.
const STYLES = `
:where([data-vibeui-block="commerce-079"]){
--vibeui-commerce-079-bg:oklch(1 0 0);
--vibeui-commerce-079-fg:oklch(0.21 0.012 260);
--vibeui-commerce-079-muted:oklch(0.53 0.014 260);
--vibeui-commerce-079-border:oklch(0.9 0.006 260);
--vibeui-commerce-079-soft:oklch(0.972 0.004 260);
--vibeui-commerce-079-accent:oklch(0.48 0.14 260);
--vibeui-commerce-079-low:oklch(0.5 0.13 150);
--vibeui-commerce-079-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-079"]{
box-sizing:border-box;background:var(--vibeui-commerce-079-bg);
color:var(--vibeui-commerce-079-fg);font-family:var(--vibeui-commerce-079-sans);
}
[data-vibeui-block="commerce-079"] *{box-sizing:border-box}
[data-vibeui-block="commerce-079"] [data-part="shell"]{max-width:44rem;margin:0 auto;padding:1.25rem 1rem 1.75rem}
[data-vibeui-block="commerce-079"] [data-part="box"]{border:1px solid var(--vibeui-commerce-079-border);border-radius:1rem;padding:1rem 1.125rem}
[data-vibeui-block="commerce-079"] [data-part="product"]{margin:0;font-size:0.75rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--vibeui-commerce-079-muted)}
[data-vibeui-block="commerce-079"] h2{margin:0.25rem 0 0.75rem;font-size:1.0625rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="commerce-079"] [data-part="now"]{display:flex;flex-wrap:wrap;gap:0.375rem 0.75rem;align-items:baseline}
[data-vibeui-block="commerce-079"] [data-part="price"]{margin:0;font-size:1.875rem;font-weight:750;line-height:1;font-variant-numeric:tabular-nums;letter-spacing:-0.02em}
[data-vibeui-block="commerce-079"] [data-part="was"]{font-size:0.9375rem;color:var(--vibeui-commerce-079-muted)}
[data-vibeui-block="commerce-079"] [data-part="was"] s{text-decoration-thickness:1px}
[data-vibeui-block="commerce-079"] [data-part="off"]{
display:inline-flex;align-items:center;height:1.5rem;padding:0 0.5rem;border-radius:0.4375rem;
background:var(--vibeui-commerce-079-low);color:oklch(0.99 0 0);font-size:0.75rem;font-weight:750;
}
[data-vibeui-block="commerce-079"] [data-part="marks"]{
display:grid;gap:0.5rem;grid-template-columns:repeat(2,minmax(0,1fr));margin:0.875rem 0;
}
[data-vibeui-block="commerce-079"] [data-part="mark"]{border-radius:0.75rem;padding:0.5625rem 0.75rem;background:var(--vibeui-commerce-079-soft)}
[data-vibeui-block="commerce-079"] [data-part="mlabel"]{display:block;font-size:0.6875rem;color:var(--vibeui-commerce-079-muted)}
[data-vibeui-block="commerce-079"] [data-part="mvalue"]{display:block;margin-top:0.125rem;font-size:1.0625rem;font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-079"] [data-part="mwhen"]{display:block;margin-top:0.0625rem;font-size:0.6875rem;color:var(--vibeui-commerce-079-muted)}
[data-vibeui-block="commerce-079"] h3{margin:0.875rem 0 0.5rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--vibeui-commerce-079-muted)}
[data-vibeui-block="commerce-079"] [data-part="chart"]{
display:flex;align-items:flex-end;gap:0.375rem;height:7rem;padding:0.5rem 0.25rem 0;
border-bottom:1px solid var(--vibeui-commerce-079-border);
}
[data-vibeui-block="commerce-079"] [data-part="bar"]{
flex:1;min-width:0;border-radius:0.25rem 0.25rem 0 0;background:var(--vibeui-commerce-079-accent);
height:var(--vibeui-commerce-079-h,50%);opacity:0.55;
}
[data-vibeui-block="commerce-079"] [data-part="bar"][data-low]{background:var(--vibeui-commerce-079-low);opacity:1}
[data-vibeui-block="commerce-079"] [data-part="bar"]:last-child{opacity:1}
[data-vibeui-block="commerce-079"] [data-part="axis"]{
display:flex;gap:0.375rem;margin:0.3125rem 0 0;padding:0;list-style:none;
font-size:0.625rem;color:var(--vibeui-commerce-079-muted);
}
[data-vibeui-block="commerce-079"] [data-part="axis"] li{flex:1;min-width:0;text-align:center}
[data-vibeui-block="commerce-079"] [data-part="table"]{margin:0.75rem 0 0;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:0.25rem 0.75rem;font-size:0.75rem}
[data-vibeui-block="commerce-079"] [data-part="pair"]{display:contents}
[data-vibeui-block="commerce-079"] dt{color:var(--vibeui-commerce-079-muted);min-width:0}
[data-vibeui-block="commerce-079"] dd{margin:0;text-align:right;font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-079"] [data-part="verdict"]{
margin:0.875rem 0 0;padding:0.625rem 0.75rem;border-radius:0.75rem;
border:1px solid var(--vibeui-commerce-079-low);color:var(--vibeui-commerce-079-low);
font-size:0.8125rem;line-height:1.5;font-weight:650;
}
[data-vibeui-block="commerce-079"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.875rem}
[data-vibeui-block="commerce-079"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;height:2.75rem;padding:0 1.5rem;border-radius:0.875rem;
background:var(--vibeui-commerce-079-accent);color:oklch(0.99 0 0);font:inherit;font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="commerce-079"] [data-part="alt"]{
appearance:none;cursor:pointer;height:2.75rem;padding:0 1.125rem;border-radius:0.875rem;
border:1px solid var(--vibeui-commerce-079-border);background:var(--vibeui-commerce-079-bg);
color:inherit;font:inherit;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="commerce-079"] [data-part="go"]:focus-visible,
[data-vibeui-block="commerce-079"] [data-part="alt"]:focus-visible{outline:2px solid var(--vibeui-commerce-079-accent);outline-offset:2px}
[data-vibeui-block="commerce-079"] [data-part="honesty"]{margin:0.75rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-079-muted)}
@container (min-width: 32rem){
[data-vibeui-block="commerce-079"] [data-part="marks"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@container (min-width: 40rem){
[data-vibeui-block="commerce-079"] [data-part="shell"]{padding:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-079"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_POINTS: Commerce079Point[] = [
  { id: "1", month: "окт", value: 42900, label: "42 900 ₽" },
  { id: "2", month: "ноя", value: 42900, label: "42 900 ₽" },
  { id: "3", month: "дек", value: 46400, label: "46 400 ₽" },
  { id: "4", month: "янв", value: 39900, label: "39 900 ₽", low: true },
  { id: "5", month: "фев", value: 44900, label: "44 900 ₽" },
  { id: "6", month: "мар", value: 41400, label: "41 400 ₽" },
]

/**
 * Сравнение цены с историей: минимум за период, дата минимума и график
 * столбиками без библиотеки. Один файл, ноль зависимостей.
 */
export function Commerce079({
  title = "Цена за полгода",
  product = "Стол «Отмель», 140×80",
  price = "41 400 ₽",
  oldPrice = "44 900 ₽",
  discount = "−8%",
  minLabel = "Минимум за 180 дней",
  minPrice = "39 900 ₽",
  minWhen = "14 января",
  avgLabel = "Средняя цена",
  avgPrice = "43 100 ₽",
  chartTitle = "Как менялась цена",
  points = DEFAULT_POINTS,
  verdict = "Сейчас на 1 700 ₽ дороже, чем в лучший день, но дешевле средней цены за полгода.",
  cta = "В корзину",
  watch = "Следить за ценой",
  honesty = "Мы показываем цену этого магазина, а не «рекомендованную производителем»: скидка считается от того, сколько товар действительно стоил, и от завышенной цены накануне акции её не посчитать.",
  accent,
  className,
  style,
}: Commerce079Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-079-accent": accent } : null),
    ...style,
  } as CSSProperties

  const top = Math.max(...points.map((point) => point.value), 1)
  const bottom = Math.min(...points.map((point) => point.value), top)
  const span = top - bottom || 1

  return (
    <>
      <style href="vibeui-commerce-079" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-079"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="box">
            <p data-part="product">{product}</p>
            <h2>{title}</h2>

            <div data-part="now">
              <p data-part="price">{price}</p>
              <span data-part="was">
                было <s>{oldPrice}</s>
              </span>
              <span data-part="off">{discount}</span>
            </div>

            <div data-part="marks">
              <div data-part="mark">
                <span data-part="mlabel">{minLabel}</span>
                <span data-part="mvalue">{minPrice}</span>
                <span data-part="mwhen">{minWhen}</span>
              </div>
              <div data-part="mark">
                <span data-part="mlabel">{avgLabel}</span>
                <span data-part="mvalue">{avgPrice}</span>
                <span data-part="mwhen">за 180 дней</span>
              </div>
              <div data-part="mark">
                <span data-part="mlabel">Сейчас</span>
                <span data-part="mvalue">{price}</span>
                <span data-part="mwhen">с 4 марта</span>
              </div>
            </div>

            <h3>{chartTitle}</h3>
            <div data-part="chart" aria-hidden="true">
              {points.map((point) => (
                <span
                  key={point.id}
                  data-part="bar"
                  data-low={point.low ? "true" : undefined}
                  style={
                    {
                      "--vibeui-commerce-079-h": `${25 + ((point.value - bottom) / span) * 75}%`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
            <ul data-part="axis" aria-hidden="true">
              {points.map((point) => (
                <li key={point.id}>{point.month}</li>
              ))}
            </ul>

            <dl data-part="table">
              {points.map((point) => (
                <div key={point.id} data-part="pair">
                  <dt>{point.month}</dt>
                  <dd>{point.label}</dd>
                </div>
              ))}
            </dl>

            <p data-part="verdict">{verdict}</p>

            <div data-part="actions">
              <button type="button" data-part="go">
                {cta}
              </button>
              <button type="button" data-part="alt">
                {watch}
              </button>
            </div>
            <p data-part="honesty">{honesty}</p>
          </div>
        </div>
      </section>
    </>
  )
}

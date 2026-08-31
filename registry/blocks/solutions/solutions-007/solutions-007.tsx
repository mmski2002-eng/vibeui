import type { CSSProperties } from "react"

export type Solutions007Deal = {
  company: string
  owner: string
  amount: number
  probability: number
  note?: string
}

export type Solutions007Stage = {
  name: string
  deals: Solutions007Deal[]
}

export type Solutions007Props = {
  title?: string
  hint?: string
  currency?: string
  stages?: Solutions007Stage[]
  forecastLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: доска сделок по этапам. В шапке колонки стоит не только счётчик,
// но и сумма этапа: без неё десять мелких сделок выглядят важнее одной крупной.
// Вероятность нарисована полосой на карточке и участвует в расчёте: прогноз
// внизу — взвешенная сумма, а не сумма всех сделок подряд. Колонки
// прокручиваются по горизонтали, а не сжимаются: сжатая карточка сделки
// перестаёт читаться раньше, чем заканчивается место.
const STYLES = `
:where([data-vibeui-block="solutions-007"]){
--vibeui-solutions-007-bg:oklch(1 0 0);
--vibeui-solutions-007-panel:oklch(0.975 0.004 255);
--vibeui-solutions-007-card:oklch(1 0 0);
--vibeui-solutions-007-fg:oklch(0.22 0.014 265);
--vibeui-solutions-007-muted:oklch(0.55 0.014 265);
--vibeui-solutions-007-border:oklch(0.9 0.006 265);
--vibeui-solutions-007-accent:oklch(0.52 0.19 275);
--vibeui-solutions-007-warm:oklch(0.7 0.15 62);
--vibeui-solutions-007-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-007"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-007-bg);
border:1px solid var(--vibeui-solutions-007-border);border-radius:1rem;
font-family:var(--vibeui-solutions-007-sans);color:var(--vibeui-solutions-007-fg);
}
[data-vibeui-block="solutions-007"] *{box-sizing:border-box}
[data-vibeui-block="solutions-007"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;
gap:0.5rem;padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-007"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-007"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-007-muted)}
/* Колонки прокручиваются, а не сжимаются: узкая карточка сделки нечитаема. */
[data-vibeui-block="solutions-007"] [data-part="board"]{
display:grid;grid-auto-flow:column;grid-auto-columns:15rem;gap:0.625rem;
overflow-x:auto;padding:0 1rem 0.875rem;scrollbar-width:thin;
}
@container (min-width: 62rem){
[data-vibeui-block="solutions-007"] [data-part="board"]{grid-auto-columns:1fr;overflow-x:visible}
}
[data-vibeui-block="solutions-007"] [data-part="column"]{
display:flex;flex-direction:column;gap:0.5rem;
padding:0.625rem;border-radius:0.875rem;
background:var(--vibeui-solutions-007-panel);
border:1px solid var(--vibeui-solutions-007-border);
}
[data-vibeui-block="solutions-007"] [data-part="column-head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="solutions-007"] h3{
margin:0;font-size:0.75rem;font-weight:700;letter-spacing:0.02em;text-transform:uppercase;
}
/* Сумма этапа рядом со счётчиком: десять мелких сделок не равны одной крупной. */
[data-vibeui-block="solutions-007"] [data-part="column-sum"]{
font-size:0.6875rem;color:var(--vibeui-solutions-007-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-007"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="solutions-007"] [data-part="card"]{
padding:0.625rem 0.6875rem;border-radius:0.75rem;
background:var(--vibeui-solutions-007-card);
border:1px solid var(--vibeui-solutions-007-border);
}
[data-vibeui-block="solutions-007"] [data-part="company"]{
display:block;font-size:0.8125rem;font-weight:650;line-height:1.3;
}
[data-vibeui-block="solutions-007"] [data-part="note"]{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-007-muted);
}
[data-vibeui-block="solutions-007"] [data-part="money"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
margin-top:0.4375rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-007"] [data-part="amount"]{font-size:0.875rem;font-weight:700}
[data-vibeui-block="solutions-007"] [data-part="probability"]{font-size:0.6875rem;color:var(--vibeui-solutions-007-muted)}
/* Вероятность видна полосой и участвует в прогнозе, а не украшает карточку. */
[data-vibeui-block="solutions-007"] [data-part="track"]{
margin-top:0.375rem;height:0.25rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-solutions-007-accent) 16%,transparent);
}
[data-vibeui-block="solutions-007"] [data-part="fill"]{
display:block;height:100%;border-radius:inherit;background:var(--vibeui-solutions-007-accent);
}
[data-vibeui-block="solutions-007"] [data-part="owner"]{
display:block;margin-top:0.375rem;font-size:0.6875rem;color:var(--vibeui-solutions-007-muted);
}
[data-vibeui-block="solutions-007"] [data-part="forecast"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.375rem;
margin:0 1rem 1rem;padding:0.75rem 0.875rem;border-radius:0.875rem;
background:color-mix(in oklab,var(--vibeui-solutions-007-warm) 12%,var(--vibeui-solutions-007-bg));
border:1px solid color-mix(in oklab,var(--vibeui-solutions-007-warm) 40%,transparent);
}
[data-vibeui-block="solutions-007"] [data-part="forecast"] strong{font-size:1.125rem;font-variant-numeric:tabular-nums}
[data-vibeui-block="solutions-007"] [data-part="forecast"] span{font-size:0.75rem;color:var(--vibeui-solutions-007-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STAGES: Solutions007Stage[] = [
  {
    name: "Квалификация",
    deals: [
      {
        company: "ООО «Полёт»",
        owner: "Марина К.",
        amount: 420000,
        probability: 20,
        note: "Запрос через сайт",
      },
      {
        company: "Стройдвор",
        owner: "Игорь П.",
        amount: 180000,
        probability: 15,
      },
    ],
  },
  {
    name: "Демонстрация",
    deals: [
      {
        company: "Кофейня «Мера»",
        owner: "Марина К.",
        amount: 260000,
        probability: 40,
        note: "Показ 14 марта",
      },
      {
        company: "Ателье «Нить»",
        owner: "Дина С.",
        amount: 95000,
        probability: 45,
      },
    ],
  },
  {
    name: "Договор",
    deals: [
      {
        company: "Логистика «Верста»",
        owner: "Игорь П.",
        amount: 780000,
        probability: 70,
        note: "На согласовании у юристов",
      },
    ],
  },
  {
    name: "Оплата",
    deals: [
      {
        company: "Клиника «Исток»",
        owner: "Дина С.",
        amount: 540000,
        probability: 90,
        note: "Счёт выставлен",
      },
    ],
  },
]

function money(value: number, currency: string) {
  return `${value.toLocaleString("ru-RU")} ${currency}`
}

/**
 * Доска сделок по этапам: сумма этапа в шапке колонки, прогноз взвешен вероятностью.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions007({
  title = "Сделки по этапам",
  hint = "Прогноз считается с учётом вероятности каждой сделки",
  currency = "₽",
  stages = DEFAULT_STAGES,
  forecastLabel = "Взвешенный прогноз квартала",
  accent,
  className,
  style,
}: Solutions007Props) {
  const all = stages.flatMap((stage) => stage.deals)
  const forecast = all.reduce(
    (sum, deal) => sum + Math.round((deal.amount * deal.probability) / 100),
    0,
  )
  const total = all.reduce((sum, deal) => sum + deal.amount, 0)

  const palette = {
    ...(accent ? { "--vibeui-solutions-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-007" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-007"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="hint">{hint}</p>
          </div>
          <p data-part="hint">
            {all.length} сделок на {money(total, currency)}
          </p>
        </header>

        <div data-part="board">
          {stages.map((stage) => {
            const sum = stage.deals.reduce((acc, deal) => acc + deal.amount, 0)

            return (
              <section data-part="column" key={stage.name}>
                <header data-part="column-head">
                  <h3>
                    {stage.name} · {stage.deals.length}
                  </h3>
                  <span data-part="column-sum">{money(sum, currency)}</span>
                </header>

                <ul>
                  {stage.deals.map((deal) => (
                    <li data-part="card" key={deal.company}>
                      <span data-part="company">{deal.company}</span>
                      {deal.note ? (
                        <span data-part="note">{deal.note}</span>
                      ) : null}
                      <p data-part="money">
                        <span data-part="amount">
                          {money(deal.amount, currency)}
                        </span>
                        <span data-part="probability">{deal.probability}%</span>
                      </p>
                      <div
                        data-part="track"
                        role="progressbar"
                        aria-valuenow={deal.probability}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Вероятность сделки ${deal.company}`}
                      >
                        <span
                          data-part="fill"
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>
                      <span data-part="owner">{deal.owner}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>

        <p data-part="forecast">
          <strong>{money(forecast, currency)}</strong>
          <span>{forecastLabel}</span>
        </p>
      </section>
    </>
  )
}

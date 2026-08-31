import type { CSSProperties } from "react"

export type Dashboard015Metric = {
  label: string
  value: string
  delta: string
  trend?: "up" | "down" | "flat"
  hint?: string
}

export type Dashboard015Bar = {
  label: string
  now: number
  was: number
}

export type Dashboard015Props = {
  title?: string
  period?: string
  metrics?: Dashboard015Metric[]
  bars?: Dashboard015Bar[]
  nowLabel?: string
  wasLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: обзор, где четыре показателя и график читаются как один ответ
// на вопрос «стало лучше или хуже». Поэтому столбцы идут парами: текущий
// период рядом с прошлым, и разница видна геометрией, а не только цифрой
// дельты. Пара столбцов различается не одним цветом, а насыщенностью и
// подписью легенды: на печати и при дальтонизме цвет пропадает первым.
const STYLES = `
:where([data-vibeui-block="dashboard-015"]){
--vibeui-dashboard-015-bg:oklch(1 0 0);
--vibeui-dashboard-015-panel:oklch(0.985 0.003 265);
--vibeui-dashboard-015-fg:oklch(0.22 0.014 265);
--vibeui-dashboard-015-muted:oklch(0.55 0.014 265);
--vibeui-dashboard-015-border:oklch(0.91 0.006 265);
--vibeui-dashboard-015-accent:oklch(0.55 0.2 262);
--vibeui-dashboard-015-pale:oklch(0.87 0.05 262);
--vibeui-dashboard-015-up:oklch(0.53 0.14 152);
--vibeui-dashboard-015-down:oklch(0.55 0.18 25);
--vibeui-dashboard-015-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-015"]{
box-sizing:border-box;
background:var(--vibeui-dashboard-015-bg);
color:var(--vibeui-dashboard-015-fg);
font-family:var(--vibeui-dashboard-015-sans);
border:1px solid var(--vibeui-dashboard-015-border);border-radius:1rem;
}
[data-vibeui-block="dashboard-015"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-015"] [data-part="shell"]{padding:1.125rem}
[data-vibeui-block="dashboard-015"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.5rem 0.75rem;margin-bottom:1rem;
}
[data-vibeui-block="dashboard-015"] h2{margin:0;font-size:1.0625rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-015"] [data-part="period"]{
margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-015-muted);
}
[data-vibeui-block="dashboard-015"] [data-part="legend"]{
display:flex;gap:0.75rem;margin:0 0 0 auto;padding:0;list-style:none;
font-size:0.6875rem;color:var(--vibeui-dashboard-015-muted);
}
[data-vibeui-block="dashboard-015"] [data-part="legend"] li{display:flex;align-items:center;gap:0.3125rem}
[data-vibeui-block="dashboard-015"] [data-part="swatch"]{
width:0.625rem;height:0.625rem;border-radius:0.1875rem;
background:var(--vibeui-dashboard-015-accent);
}
[data-vibeui-block="dashboard-015"] [data-series="was"] [data-part="swatch"],
[data-vibeui-block="dashboard-015"] [data-part="swatch"][data-series="was"]{
background:var(--vibeui-dashboard-015-pale);
}
[data-vibeui-block="dashboard-015"] [data-part="metrics"]{
display:grid;grid-template-columns:1fr;gap:0.625rem;margin:0 0 1rem;padding:0;list-style:none;
}
[data-vibeui-block="dashboard-015"] [data-part="metric"]{
background:var(--vibeui-dashboard-015-panel);
border:1px solid var(--vibeui-dashboard-015-border);border-radius:0.75rem;
padding:0.75rem 0.875rem;
}
[data-vibeui-block="dashboard-015"] [data-part="label"]{
display:block;font-size:0.6875rem;font-weight:600;letter-spacing:0.03em;text-transform:uppercase;
color:var(--vibeui-dashboard-015-muted);
}
[data-vibeui-block="dashboard-015"] [data-part="value"]{
display:block;margin-top:0.25rem;font-size:1.5rem;font-weight:700;line-height:1.1;
font-variant-numeric:tabular-nums;letter-spacing:-0.02em;
}
[data-vibeui-block="dashboard-015"] [data-part="delta"]{
display:inline-flex;align-items:center;gap:0.25rem;margin-top:0.375rem;
font-size:0.75rem;font-weight:600;font-variant-numeric:tabular-nums;
color:var(--vibeui-dashboard-015-muted);
}
[data-vibeui-block="dashboard-015"] [data-trend="up"] [data-part="delta"]{color:var(--vibeui-dashboard-015-up)}
[data-vibeui-block="dashboard-015"] [data-trend="down"] [data-part="delta"]{color:var(--vibeui-dashboard-015-down)}
[data-vibeui-block="dashboard-015"] [data-part="hint"]{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-dashboard-015-muted);
}
[data-vibeui-block="dashboard-015"] figure{margin:0}
[data-vibeui-block="dashboard-015"] [data-part="plot"]{
display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:0.375rem;
height:9rem;padding-bottom:1.25rem;
background:repeating-linear-gradient(to top,var(--vibeui-dashboard-015-border) 0 1px,transparent 1px 25%);
}
[data-vibeui-block="dashboard-015"] [data-part="col"]{
display:flex;flex-direction:column;justify-content:flex-end;height:100%;
}
[data-vibeui-block="dashboard-015"] [data-part="pair"]{
display:flex;align-items:flex-end;justify-content:center;gap:0.125rem;height:100%;
}
/* Высота столбца приходит переменной: это единственное динамическое число. */
[data-vibeui-block="dashboard-015"] [data-part="bar"]{
width:0.6875rem;border-radius:0.1875rem 0.1875rem 0 0;
height:var(--vibeui-dashboard-015-h);min-height:0.25rem;
background:var(--vibeui-dashboard-015-accent);
}
[data-vibeui-block="dashboard-015"] [data-part="bar"][data-series="was"]{background:var(--vibeui-dashboard-015-pale)}
[data-vibeui-block="dashboard-015"] [data-part="tick"]{
margin-top:0.375rem;text-align:center;font-size:0.6875rem;color:var(--vibeui-dashboard-015-muted);
}
[data-vibeui-block="dashboard-015"] figcaption{
margin-top:0.5rem;font-size:0.6875rem;color:var(--vibeui-dashboard-015-muted);
}
@container (min-width: 34rem){
[data-vibeui-block="dashboard-015"] [data-part="metrics"]{grid-template-columns:repeat(2,1fr)}
[data-vibeui-block="dashboard-015"] [data-part="shell"]{padding:1.375rem}
}
@container (min-width: 56rem){
[data-vibeui-block="dashboard-015"] [data-part="metrics"]{grid-template-columns:repeat(4,1fr)}
[data-vibeui-block="dashboard-015"] [data-part="plot"]{height:11rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_METRICS: Dashboard015Metric[] = [
  {
    label: "Выручка",
    value: "1 284 000 ₽",
    delta: "+18 %",
    trend: "up",
    hint: "к прошлой неделе",
  },
  {
    label: "Заказы",
    value: "3 412",
    delta: "+6 %",
    trend: "up",
    hint: "к прошлой неделе",
  },
  {
    label: "Средний чек",
    value: "376 ₽",
    delta: "−2 %",
    trend: "down",
    hint: "к прошлой неделе",
  },
  {
    label: "Возвраты",
    value: "48",
    delta: "0 %",
    trend: "flat",
    hint: "к прошлой неделе",
  },
]

const DEFAULT_BARS: Dashboard015Bar[] = [
  { label: "Пн", now: 62, was: 54 },
  { label: "Вт", now: 71, was: 66 },
  { label: "Ср", now: 58, was: 63 },
  { label: "Чт", now: 84, was: 70 },
  { label: "Пт", now: 96, was: 78 },
  { label: "Сб", now: 47, was: 44 },
  { label: "Вс", now: 39, was: 41 },
]

const ARROW = { up: "↑", down: "↓", flat: "→" }

/**
 * Обзор периода: четыре показателя и парные столбцы «сейчас против прошлого».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard015({
  title = "Обзор недели",
  period = "8–14 марта",
  metrics = DEFAULT_METRICS,
  bars = DEFAULT_BARS,
  nowLabel = "Текущая неделя",
  wasLabel = "Прошлая неделя",
  accent,
  className,
  style,
}: Dashboard015Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-015-accent": accent } : null),
    ...style,
  } as CSSProperties

  const peak = Math.max(1, ...bars.flatMap((bar) => [bar.now, bar.was]))

  return (
    <>
      <style href="vibeui-dashboard-015" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-015"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <header data-part="head">
            <h2>{title}</h2>
            <p data-part="period">{period}</p>
            <ul data-part="legend">
              <li>
                <span data-part="swatch" aria-hidden="true" />
                {nowLabel}
              </li>
              <li>
                <span data-part="swatch" data-series="was" aria-hidden="true" />
                {wasLabel}
              </li>
            </ul>
          </header>

          <ul data-part="metrics">
            {metrics.map((metric) => (
              <li
                key={metric.label}
                data-part="metric"
                data-trend={metric.trend ?? "flat"}
              >
                <span data-part="label">{metric.label}</span>
                <span data-part="value">{metric.value}</span>
                <span data-part="delta">
                  <span aria-hidden="true">
                    {ARROW[metric.trend ?? "flat"]}
                  </span>
                  {metric.delta}
                </span>
                {metric.hint ? (
                  <span data-part="hint">{metric.hint}</span>
                ) : null}
              </li>
            ))}
          </ul>

          <figure>
            <div
              data-part="plot"
              role="img"
              aria-label={`${nowLabel} против «${wasLabel}» по дням: ${bars
                .map((bar) => `${bar.label} ${bar.now} и ${bar.was}`)
                .join(", ")}`}
            >
              {bars.map((bar) => (
                <div key={bar.label} data-part="col">
                  <div data-part="pair">
                    <span
                      data-part="bar"
                      data-series="was"
                      style={
                        {
                          "--vibeui-dashboard-015-h": `${Math.round((bar.was / peak) * 100)}%`,
                        } as CSSProperties
                      }
                    />
                    <span
                      data-part="bar"
                      style={
                        {
                          "--vibeui-dashboard-015-h": `${Math.round((bar.now / peak) * 100)}%`,
                        } as CSSProperties
                      }
                    />
                  </div>
                  <span data-part="tick">{bar.label}</span>
                </div>
              ))}
            </div>
            <figcaption>
              Столбцы стоят парами: слева прошлый период, справа текущий.
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  )
}

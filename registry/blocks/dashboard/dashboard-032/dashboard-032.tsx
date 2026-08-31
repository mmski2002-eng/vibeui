import type { CSSProperties } from "react"

export type Dashboard032Row = {
  label: string
  now: string
  was: string
  delta: number
  goodWhen?: "up" | "down"
  note?: string
}

export type Dashboard032Props = {
  title?: string
  nowPeriod?: string
  wasPeriod?: string
  presets?: string[]
  activePreset?: string
  rows?: Dashboard032Row[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: сравнение двух периодов, где рост не всегда хорош. У каждой
// строки объявлено, какое направление считается хорошим: рост отказов и рост
// выручки не могут быть одного цвета. Изменение нарисовано полосой от центра
// в обе стороны — так видно и знак, и размер, не читая чисел. Полоса
// строится на гриде из двух половин, поэтому нулевая линия остаётся на месте
// при любой ширине блока и любом наборе значений.
const STYLES = `
:where([data-vibeui-block="dashboard-032"]){
--vibeui-dashboard-032-bg:oklch(1 0 0);
--vibeui-dashboard-032-panel:oklch(0.985 0.003 265);
--vibeui-dashboard-032-fg:oklch(0.22 0.014 265);
--vibeui-dashboard-032-muted:oklch(0.55 0.014 265);
--vibeui-dashboard-032-border:oklch(0.91 0.006 265);
--vibeui-dashboard-032-accent:oklch(0.55 0.2 262);
--vibeui-dashboard-032-good:oklch(0.55 0.14 152);
--vibeui-dashboard-032-bad:oklch(0.56 0.18 25);
--vibeui-dashboard-032-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-032"]{
box-sizing:border-box;
background:var(--vibeui-dashboard-032-bg);
color:var(--vibeui-dashboard-032-fg);
font-family:var(--vibeui-dashboard-032-sans);
border:1px solid var(--vibeui-dashboard-032-border);border-radius:1rem;
}
[data-vibeui-block="dashboard-032"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-032"] [data-part="shell"]{padding:1.125rem}
[data-vibeui-block="dashboard-032"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 0.75rem;margin-bottom:0.75rem;
}
[data-vibeui-block="dashboard-032"] h2{margin:0;font-size:1.0625rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-032"] select{
appearance:none;font:inherit;font-size:0.75rem;color:inherit;margin-left:auto;
padding:0.375rem 1.75rem 0.375rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-032-border);
background:var(--vibeui-dashboard-032-bg)
url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23777' stroke-width='1.6'/%3E%3C/svg%3E")
no-repeat right 0.5rem center/0.625rem;
}
[data-vibeui-block="dashboard-032"] select:focus-visible{outline:2px solid var(--vibeui-dashboard-032-accent);outline-offset:2px}
[data-vibeui-block="dashboard-032"] [data-part="periods"]{
display:flex;flex-wrap:wrap;gap:0.5rem;margin:0 0 0.875rem;padding:0;list-style:none;
}
[data-vibeui-block="dashboard-032"] [data-part="periods"] li{
flex:1 1 10rem;
background:var(--vibeui-dashboard-032-panel);
border:1px solid var(--vibeui-dashboard-032-border);border-radius:0.75rem;
padding:0.5rem 0.75rem;font-size:0.75rem;
}
[data-vibeui-block="dashboard-032"] [data-part="plabel"]{
display:block;font-size:0.625rem;font-weight:650;letter-spacing:0.03em;text-transform:uppercase;
color:var(--vibeui-dashboard-032-muted);
}
[data-vibeui-block="dashboard-032"] [data-part="pvalue"]{display:block;margin-top:0.125rem;font-weight:650}
[data-vibeui-block="dashboard-032"] [data-part="tablewrap"]{overflow-x:auto}
[data-vibeui-block="dashboard-032"] table{width:100%;border-collapse:collapse;font-size:0.75rem}
[data-vibeui-block="dashboard-032"] th{
text-align:left;padding:0.375rem 0.625rem 0.375rem 0;white-space:nowrap;
font-size:0.625rem;font-weight:650;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-dashboard-032-muted);
border-bottom:1px solid var(--vibeui-dashboard-032-border);
}
[data-vibeui-block="dashboard-032"] td{
padding:0.5rem 0.625rem 0.5rem 0;white-space:nowrap;
border-bottom:1px solid var(--vibeui-dashboard-032-border);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-032"] tbody th{
font-size:0.75rem;font-weight:650;text-transform:none;letter-spacing:0;color:inherit;
padding-right:0.75rem;white-space:normal;
}
[data-vibeui-block="dashboard-032"] [data-part="note"]{
display:block;font-size:0.625rem;font-weight:500;color:var(--vibeui-dashboard-032-muted);
}
[data-vibeui-block="dashboard-032"] [data-part="was"]{color:var(--vibeui-dashboard-032-muted)}
[data-vibeui-block="dashboard-032"] [data-part="pct"]{font-weight:700}
[data-vibeui-block="dashboard-032"] [data-verdict="good"] [data-part="pct"]{color:var(--vibeui-dashboard-032-good)}
[data-vibeui-block="dashboard-032"] [data-verdict="bad"] [data-part="pct"]{color:var(--vibeui-dashboard-032-bad)}
/* Полоса от центра: две половины грида, нулевая линия не уезжает. */
[data-vibeui-block="dashboard-032"] [data-part="diverge"]{
display:grid;grid-template-columns:1fr 1fr;align-items:center;
width:8rem;height:0.75rem;
border-left:1px solid transparent;
background:linear-gradient(90deg,transparent calc(50% - 0.5px),var(--vibeui-dashboard-032-border) calc(50% - 0.5px) calc(50% + 0.5px),transparent calc(50% + 0.5px));
}
[data-vibeui-block="dashboard-032"] [data-part="left"]{justify-self:end;height:0.5rem;border-radius:0.25rem 0 0 0.25rem}
[data-vibeui-block="dashboard-032"] [data-part="right"]{justify-self:start;height:0.5rem;border-radius:0 0.25rem 0.25rem 0}
[data-vibeui-block="dashboard-032"] [data-part="left"],
[data-vibeui-block="dashboard-032"] [data-part="right"]{
width:var(--vibeui-dashboard-032-w);
background:var(--vibeui-dashboard-032-bad);
}
[data-vibeui-block="dashboard-032"] [data-verdict="good"] :is([data-part="left"],[data-part="right"]){
background:var(--vibeui-dashboard-032-good);
}
[data-vibeui-block="dashboard-032"] [data-part="legend"]{
margin:0.75rem 0 0;font-size:0.6875rem;color:var(--vibeui-dashboard-032-muted);
}
@container (min-width: 44rem){
[data-vibeui-block="dashboard-032"] [data-part="shell"]{padding:1.375rem}
[data-vibeui-block="dashboard-032"] [data-part="diverge"]{width:11rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-032"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Dashboard032Row[] = [
  {
    label: "Выручка",
    now: "1 284 000 ₽",
    was: "1 088 000 ₽",
    delta: 18,
    goodWhen: "up",
  },
  { label: "Заказы", now: "3 412", was: "3 218", delta: 6, goodWhen: "up" },
  {
    label: "Средний чек",
    now: "376 ₽",
    was: "338 ₽",
    delta: 11,
    goodWhen: "up",
  },
  {
    label: "Доля отказов",
    now: "41 %",
    was: "36 %",
    delta: 14,
    goodWhen: "down",
    note: "рост отказов — это плохо",
  },
  {
    label: "Возвраты",
    now: "48",
    was: "61",
    delta: -21,
    goodWhen: "down",
    note: "снижение — это хорошо",
  },
  {
    label: "Время до первого заказа",
    now: "2 д 4 ч",
    was: "2 д 9 ч",
    delta: -9,
    goodWhen: "down",
  },
]

function verdict(row: Dashboard032Row) {
  if (row.delta === 0) {
    return "flat"
  }

  const good = row.goodWhen === "down" ? row.delta < 0 : row.delta > 0

  return good ? "good" : "bad"
}

/**
 * Сравнение двух периодов: направление «хорошо» объявлено для каждой строки,
 * изменение — полоса от центра. Один файл, ноль зависимостей.
 */
export function Dashboard032({
  title = "Сравнение периодов",
  nowPeriod = "1–14 марта",
  wasPeriod = "15–28 февраля",
  presets = [
    "С прошлым периодом",
    "С прошлым месяцем",
    "С прошлым годом",
    "Свой период",
  ],
  activePreset = "С прошлым периодом",
  rows = DEFAULT_ROWS,
  accent,
  className,
  style,
}: Dashboard032Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-032-accent": accent } : null),
    ...style,
  } as CSSProperties

  const scale = Math.max(10, ...rows.map((row) => Math.abs(row.delta)))

  return (
    <>
      <style href="vibeui-dashboard-032" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-032"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <header data-part="head">
            <h2>{title}</h2>
            <select defaultValue={activePreset} aria-label="Что с чем сравнить">
              {presets.map((preset) => (
                <option key={preset}>{preset}</option>
              ))}
            </select>
          </header>

          <ul data-part="periods">
            <li>
              <span data-part="plabel">Текущий период</span>
              <span data-part="pvalue">{nowPeriod}</span>
            </li>
            <li>
              <span data-part="plabel">Период сравнения</span>
              <span data-part="pvalue">{wasPeriod}</span>
            </li>
          </ul>

          <div data-part="tablewrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Показатель</th>
                  <th scope="col">{nowPeriod}</th>
                  <th scope="col">{wasPeriod}</th>
                  <th scope="col">Изменение</th>
                  <th scope="col">Отклонение</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const width = `${Math.round((Math.abs(row.delta) / scale) * 100)}%`

                  return (
                    <tr key={row.label} data-verdict={verdict(row)}>
                      <th scope="row">
                        {row.label}
                        {row.note ? (
                          <span data-part="note">{row.note}</span>
                        ) : null}
                      </th>
                      <td>{row.now}</td>
                      <td data-part="was">{row.was}</td>
                      <td>
                        <span data-part="pct">
                          {row.delta > 0 ? "+" : ""}
                          {row.delta} %
                        </span>
                      </td>
                      <td>
                        <span
                          data-part="diverge"
                          role="img"
                          aria-label={`${row.label}: ${row.delta > 0 ? "рост" : "снижение"} на ${Math.abs(row.delta)} процентов`}
                          style={
                            {
                              "--vibeui-dashboard-032-w": width,
                            } as CSSProperties
                          }
                        >
                          {row.delta < 0 ? <span data-part="left" /> : <span />}
                          {row.delta > 0 ? (
                            <span data-part="right" />
                          ) : (
                            <span />
                          )}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <p data-part="legend">
            Зелёный — изменение в нужную сторону, красный — в обратную.
            Направление задаётся у каждого показателя отдельно.
          </p>
        </div>
      </section>
    </>
  )
}

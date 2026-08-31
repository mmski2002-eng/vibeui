import type { CSSProperties } from "react"

export type Solutions003Deal = {
  company: string
  contact: string
  amount: string
  stage: string
  age: string
  tone?: "warm" | "cold" | "hot"
}

export type Solutions003Stage = {
  name: string
  count: number
  sum: string
}

export type Solutions003Props = {
  title?: string
  hint?: string
  stages?: Solutions003Stage[]
  deals?: Solutions003Deal[]
  cta?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: воронка сделок. Ширина ступени считается от первой, а не от
// суммы всех: воронка показывает, сколько дошло, а не как поделился пирог.
// Возраст сделки выводится словами и помечается тоном: сделка, которая висит
// три недели, важнее суммы, но её не видно ни в одной колонке с деньгами.
// Список сделок идёт под воронкой, а не рядом: в узкой колонке две таблицы
// превращаются в кашу, а воронка без списка бесполезна.
const STYLES = `
:where([data-vibeui-block="solutions-003"]){
--vibeui-solutions-003-bg:oklch(1 0 0);
--vibeui-solutions-003-panel:oklch(0.985 0.002 265);
--vibeui-solutions-003-fg:oklch(0.22 0.014 265);
--vibeui-solutions-003-muted:oklch(0.55 0.014 265);
--vibeui-solutions-003-border:oklch(0.91 0.006 265);
--vibeui-solutions-003-accent:oklch(0.55 0.2 262);
--vibeui-solutions-003-hot:oklch(0.6 0.18 30);
--vibeui-solutions-003-cold:oklch(0.6 0.05 250);
--vibeui-solutions-003-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-003"]{
box-sizing:border-box;padding:1rem;
background:var(--vibeui-solutions-003-bg);
border:1px solid var(--vibeui-solutions-003-border);border-radius:1rem;
font-family:var(--vibeui-solutions-003-sans);color:var(--vibeui-solutions-003-fg);
}
[data-vibeui-block="solutions-003"] *{box-sizing:border-box}
[data-vibeui-block="solutions-003"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;
gap:0.5rem;margin-bottom:0.875rem;
}
[data-vibeui-block="solutions-003"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-003"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-003-muted)}
[data-vibeui-block="solutions-003"] [data-part="cta"]{
appearance:none;cursor:pointer;height:2.125rem;padding:0 0.875rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-solutions-003-accent);color:oklch(1 0 0);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="solutions-003"] [data-part="cta"]:focus-visible{outline:2px solid var(--vibeui-solutions-003-accent);outline-offset:2px}
/* Ширина ступени — от первой: воронка про доходимость, а не про доли пирога. */
[data-vibeui-block="solutions-003"] ol{list-style:none;margin:0 0 0.875rem;padding:0;display:flex;flex-direction:column;gap:0.375rem}
[data-vibeui-block="solutions-003"] [data-part="stage"]{
display:grid;grid-template-columns:8rem 1fr auto;align-items:center;gap:0.625rem;
font-size:0.75rem;
}
[data-vibeui-block="solutions-003"] [data-part="bar"]{
height:1.5rem;border-radius:0.375rem;
background:oklch(0.55 0.2 262 / 16%);
width:var(--vibeui-solutions-003-width,100%);
}
[data-vibeui-block="solutions-003"] [data-part="sum"]{font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="solutions-003"] [data-part="count"]{color:var(--vibeui-solutions-003-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="solutions-003"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="solutions-003"] th,
[data-vibeui-block="solutions-003"] td{
padding:0.4375rem 0.5rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-solutions-003-border);
}
[data-vibeui-block="solutions-003"] th{
padding-top:0;border-top:0;
font-size:0.6875rem;font-weight:600;letter-spacing:0.03em;text-transform:uppercase;
color:var(--vibeui-solutions-003-muted);
}
[data-vibeui-block="solutions-003"] [data-part="contact"]{display:block;font-size:0.6875rem;color:var(--vibeui-solutions-003-muted)}
[data-vibeui-block="solutions-003"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
/* Возраст сделки словами и тоном: висящая три недели важнее суммы. */
[data-vibeui-block="solutions-003"] [data-part="age"]{
display:inline-flex;align-items:center;gap:0.3125rem;
font-size:0.6875rem;color:var(--vibeui-solutions-003-muted);
}
[data-vibeui-block="solutions-003"] [data-part="dot"]{
width:0.4375rem;height:0.4375rem;border-radius:9999px;
background:var(--vibeui-solutions-003-cold);
}
[data-vibeui-block="solutions-003"] [data-tone="hot"] [data-part="dot"]{background:var(--vibeui-solutions-003-hot)}
[data-vibeui-block="solutions-003"] [data-tone="warm"] [data-part="dot"]{background:var(--vibeui-solutions-003-accent)}
[data-vibeui-block="solutions-003"] [data-tone="hot"] [data-part="age"]{color:var(--vibeui-solutions-003-hot);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STAGES: Solutions003Stage[] = [
  { name: "Заявки", count: 128, sum: "6,4 млн ₽" },
  { name: "Квалификация", count: 74, sum: "4,1 млн ₽" },
  { name: "Предложение", count: 31, sum: "2,2 млн ₽" },
  { name: "Договор", count: 12, sum: "980 тыс. ₽" },
]

const DEFAULT_DEALS: Solutions003Deal[] = [
  {
    company: "ООО «Полёт»",
    contact: "Анна Реброва · бухгалтерия",
    amount: "240 000 ₽",
    stage: "Договор",
    age: "висит 21 день",
    tone: "hot",
  },
  {
    company: "Студия «Мера»",
    contact: "Пётр Гай · основатель",
    amount: "180 000 ₽",
    stage: "Предложение",
    age: "5 дней",
    tone: "warm",
  },
  {
    company: "ИП Гаврилов",
    contact: "Илья Мохов · закупки",
    amount: "96 000 ₽",
    stage: "Квалификация",
    age: "2 дня",
    tone: "cold",
  },
]

/**
 * Воронка сделок: ширина ступени от первой, возраст сделки словами и тоном.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions003({
  title = "Сделки",
  hint = "Воронка за квартал и сделки, требующие ответа",
  stages = DEFAULT_STAGES,
  deals = DEFAULT_DEALS,
  cta = "Добавить сделку",
  accent,
  className,
  style,
}: Solutions003Props) {
  const first = stages[0]?.count ?? 1

  const palette = {
    ...(accent ? { "--vibeui-solutions-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-003"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="hint">{hint}</p>
          </div>
          <button type="button" data-part="cta">
            {cta}
          </button>
        </header>

        <ol>
          {stages.map((stage) => (
            <li key={stage.name} data-part="stage">
              <span>{stage.name}</span>
              <span
                data-part="bar"
                aria-hidden="true"
                style={
                  {
                    "--vibeui-solutions-003-width": `${(stage.count / first) * 100}%`,
                  } as CSSProperties
                }
              />
              <span>
                <span data-part="sum">{stage.sum}</span>{" "}
                <span data-part="count">· {stage.count}</span>
              </span>
            </li>
          ))}
        </ol>

        <table>
          <thead>
            <tr>
              <th scope="col">Компания</th>
              <th scope="col">Этап</th>
              <th scope="col">Возраст</th>
              <th scope="col" data-align="end">
                Сумма
              </th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr key={deal.company} data-tone={deal.tone ?? "cold"}>
                <td>
                  {deal.company}
                  <span data-part="contact">{deal.contact}</span>
                </td>
                <td>{deal.stage}</td>
                <td>
                  <span data-part="age">
                    <span data-part="dot" aria-hidden="true" />
                    {deal.age}
                  </span>
                </td>
                <td data-align="end">{deal.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}

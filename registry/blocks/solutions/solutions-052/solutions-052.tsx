import type { CSSProperties } from "react"

export type Solutions052Point = {
  city: string
  partner: string
  opened: string
  revenue: number
  plan: number
  royaltyRate: number
  compliance: number
}

export type Solutions052Props = {
  title?: string
  hint?: string
  points?: Solutions052Point[]
  foot?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: реестр точек франшизы. Выручка против плана нарисована двумя
// полосами в одной шкале — план виден пунктирной меткой, факт закрашен
// сплошь, и превышение плана видно геометрией без вычитания процентов в уме.
// Статус «отстаёт / по плану» считается компонентом из тех же чисел, а не
// приходит готовой меткой. Роялти дано ставкой в реквизитах точки и суммой
// в отдельной колонке — сумму отдельно не передают, франчайзер сверяет её с
// начислением. Соответствие стандартам — процент с цветовой шкалой по трём
// порогам, а не бинарный «ок / не ок».
const STYLES = `
:where([data-vibeui-block="solutions-052"]){
--vibeui-solutions-052-bg:oklch(1 0 0);
--vibeui-solutions-052-panel:oklch(0.976 0.004 190);
--vibeui-solutions-052-fg:oklch(0.21 0.014 220);
--vibeui-solutions-052-muted:oklch(0.54 0.014 220);
--vibeui-solutions-052-border:oklch(0.9 0.006 220);
--vibeui-solutions-052-accent:oklch(0.55 0.13 190);
--vibeui-solutions-052-good:oklch(0.58 0.14 152);
--vibeui-solutions-052-warn:oklch(0.68 0.15 85);
--vibeui-solutions-052-risk:oklch(0.57 0.19 30);
--vibeui-solutions-052-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-052-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-052"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-052-bg);
border:1px solid var(--vibeui-solutions-052-border);border-radius:1rem;
font-family:var(--vibeui-solutions-052-sans);color:var(--vibeui-solutions-052-fg);
}
[data-vibeui-block="solutions-052"] *{box-sizing:border-box}
[data-vibeui-block="solutions-052"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-052"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-052"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-052-muted)}
[data-vibeui-block="solutions-052"] [data-part="summary"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
[data-vibeui-block="solutions-052"] [data-part="tile"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;background:var(--vibeui-solutions-052-panel);
border:1px solid var(--vibeui-solutions-052-border);
}
[data-vibeui-block="solutions-052"] [data-part="tile"] b{
display:block;font-size:1.0625rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.015em;
}
[data-vibeui-block="solutions-052"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-052-muted);
}
@container (min-width: 30rem){
[data-vibeui-block="solutions-052"] [data-part="summary"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
[data-vibeui-block="solutions-052"] [data-part="scroll"]{overflow-x:auto;scrollbar-width:thin}
[data-vibeui-block="solutions-052"] table{width:100%;min-width:46rem;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="solutions-052"] th,
[data-vibeui-block="solutions-052"] td{
padding:0.5rem 0.625rem;text-align:left;vertical-align:middle;
border-top:1px solid var(--vibeui-solutions-052-border);
}
[data-vibeui-block="solutions-052"] th:first-child,
[data-vibeui-block="solutions-052"] td:first-child{padding-left:1rem}
[data-vibeui-block="solutions-052"] th:last-child,
[data-vibeui-block="solutions-052"] td:last-child{padding-right:1rem}
[data-vibeui-block="solutions-052"] th{
font-size:0.625rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-052-muted);background:var(--vibeui-solutions-052-panel);white-space:nowrap;
}
[data-vibeui-block="solutions-052"] [data-part="city"]{font-weight:650}
[data-vibeui-block="solutions-052"] [data-part="partner"]{
display:block;margin-top:0.0625rem;font-size:0.6875rem;color:var(--vibeui-solutions-052-muted);
}
[data-vibeui-block="solutions-052"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
/* План — пунктирная метка на шкале, факт — заливка: превышение видно геометрией. */
[data-vibeui-block="solutions-052"] [data-part="bar-cell"]{min-width:9rem}
[data-vibeui-block="solutions-052"] [data-part="bar"]{
position:relative;height:0.5rem;border-radius:9999px;background:var(--vibeui-solutions-052-panel);overflow:visible;
}
[data-vibeui-block="solutions-052"] [data-part="bar"] i{
position:absolute;inset:0 auto 0 0;display:block;border-radius:9999px;
background:var(--vibeui-solutions-052-accent);width:var(--vibeui-solutions-052-fill,0%);
}
[data-vibeui-block="solutions-052"] [data-behind="true"] [data-part="bar"] i{background:var(--vibeui-solutions-052-risk)}
[data-vibeui-block="solutions-052"] [data-part="bar"] em{
position:absolute;top:-0.125rem;bottom:-0.125rem;width:2px;background:var(--vibeui-solutions-052-fg);
left:var(--vibeui-solutions-052-plan,100%);font-style:normal;
}
[data-vibeui-block="solutions-052"] [data-part="bar-label"]{
display:block;margin-top:0.25rem;font-size:0.6875rem;color:var(--vibeui-solutions-052-muted);
}
[data-vibeui-block="solutions-052"] [data-behind="true"] [data-part="bar-label"]{color:var(--vibeui-solutions-052-risk);font-weight:650}
[data-vibeui-block="solutions-052"] [data-part="royalty"]{
font-family:var(--vibeui-solutions-052-mono);font-size:0.75rem;
}
[data-vibeui-block="solutions-052"] [data-part="royalty-rate"]{
display:block;font-size:0.625rem;color:var(--vibeui-solutions-052-muted);font-family:var(--vibeui-solutions-052-sans);
}
[data-vibeui-block="solutions-052"] [data-part="compliance"]{
display:inline-flex;align-items:center;gap:0.375rem;font-variant-numeric:tabular-nums;font-weight:650;
}
[data-vibeui-block="solutions-052"] [data-part="dot"]{
width:0.5rem;height:0.5rem;border-radius:9999px;flex-shrink:0;background:var(--vibeui-solutions-052-good);
}
[data-vibeui-block="solutions-052"] [data-level="warn"] [data-part="dot"]{background:var(--vibeui-solutions-052-warn)}
[data-vibeui-block="solutions-052"] [data-level="risk"] [data-part="dot"]{background:var(--vibeui-solutions-052-risk)}
[data-vibeui-block="solutions-052"] [data-level="warn"]{color:var(--vibeui-solutions-052-warn)}
[data-vibeui-block="solutions-052"] [data-level="risk"]{color:var(--vibeui-solutions-052-risk)}
[data-vibeui-block="solutions-052"] [data-part="foot"]{
margin:0;padding:0 1rem 1rem;font-size:0.75rem;color:var(--vibeui-solutions-052-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-052"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_POINTS: Solutions052Point[] = [
  {
    city: "Казань",
    partner: "ИП Валиева Р.",
    opened: "март 2021",
    revenue: 3120000,
    plan: 2800000,
    royaltyRate: 6,
    compliance: 96,
  },
  {
    city: "Новосибирск",
    partner: "ООО «Сибирский узел»",
    opened: "июль 2022",
    revenue: 1940000,
    plan: 2400000,
    royaltyRate: 6,
    compliance: 81,
  },
  {
    city: "Краснодар",
    partner: "ИП Ткачук С.",
    opened: "январь 2023",
    revenue: 2210000,
    plan: 2100000,
    royaltyRate: 5,
    compliance: 92,
  },
  {
    city: "Пермь",
    partner: "ООО «Прикамье-Ритейл»",
    opened: "сентябрь 2023",
    revenue: 1180000,
    plan: 1700000,
    royaltyRate: 6,
    compliance: 64,
  },
  {
    city: "Тюмень",
    partner: "ИП Городов А.",
    opened: "апрель 2024",
    revenue: 980000,
    plan: 900000,
    royaltyRate: 5,
    compliance: 88,
  },
  {
    city: "Иваново",
    partner: "ООО «Текстиль-Групп»",
    opened: "декабрь 2024",
    revenue: 540000,
    plan: 700000,
    royaltyRate: 6,
    compliance: 73,
  },
]

const money = (value: number) =>
  `${Math.round(value).toLocaleString("ru-RU")} ₽`

const complianceLevel = (value: number): "good" | "warn" | "risk" =>
  value >= 90 ? "good" : value >= 75 ? "warn" : "risk"

/**
 * Реестр точек франшизы: выручка против плана шкалой с меткой плана,
 * роялти суммой из ставки, соответствие стандартам — трёхуровневой шкалой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions052({
  title = "Сеть франшизы",
  hint = "42 точки · I квартал",
  points = DEFAULT_POINTS,
  foot = "Метка на шкале — план месяца; закрашенная часть — факт. Роялти считается от факта выручки по ставке точки.",
  accent,
  className,
  style,
}: Solutions052Props) {
  const revenueSum = points.reduce((sum, point) => sum + point.revenue, 0)
  const complianceAvg =
    points.length > 0
      ? Math.round(
          points.reduce((sum, point) => sum + point.compliance, 0) /
            points.length,
        )
      : 0
  const behindCount = points.filter(
    (point) => point.revenue < point.plan,
  ).length

  const palette = {
    ...(accent ? { "--vibeui-solutions-052-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-052" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-052"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="hint">{hint}</p>
          </div>
        </header>

        <div data-part="summary">
          <p data-part="tile">
            <b>{money(revenueSum)}</b>
            <span>суммарная выручка</span>
          </p>
          <p data-part="tile">
            <b>{complianceAvg}%</b>
            <span>среднее соответствие</span>
          </p>
          <p data-part="tile">
            <b>{behindCount}</b>
            <span>точек отстают от плана</span>
          </p>
        </div>

        <div data-part="scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Точка</th>
                <th scope="col">Открыта</th>
                <th scope="col">Выручка / план</th>
                <th scope="col" data-align="end">
                  Роялти
                </th>
                <th scope="col">Соответствие</th>
              </tr>
            </thead>
            <tbody>
              {points.map((point) => {
                const behind = point.revenue < point.plan
                const scaleMax = Math.max(point.revenue, point.plan) * 1.05
                const fill = scaleMax > 0 ? (point.revenue / scaleMax) * 100 : 0
                const planMark =
                  scaleMax > 0 ? (point.plan / scaleMax) * 100 : 0
                const level = complianceLevel(point.compliance)

                return (
                  <tr key={point.city} data-behind={behind}>
                    <td>
                      <span data-part="city">{point.city}</span>
                      <span data-part="partner">{point.partner}</span>
                    </td>
                    <td>{point.opened}</td>
                    <td data-part="bar-cell">
                      <div
                        data-part="bar"
                        role="img"
                        aria-label={`Выручка ${money(point.revenue)} против плана ${money(point.plan)}`}
                        style={
                          {
                            "--vibeui-solutions-052-fill": `${Math.min(fill, 100)}%`,
                            "--vibeui-solutions-052-plan": `${Math.min(planMark, 100)}%`,
                          } as CSSProperties
                        }
                      >
                        <i />
                        <em />
                      </div>
                      <span data-part="bar-label">
                        {money(point.revenue)}{" "}
                        {behind ? "· отстаёт от плана" : "· план выполнен"}
                      </span>
                    </td>
                    <td data-align="end">
                      <span data-part="royalty">
                        {money((point.revenue * point.royaltyRate) / 100)}
                      </span>
                      <span data-part="royalty-rate">
                        ставка {point.royaltyRate}%
                      </span>
                    </td>
                    <td>
                      <span data-part="compliance" data-level={level}>
                        <span data-part="dot" aria-hidden="true" />
                        {point.compliance}%
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <p data-part="foot">{foot}</p>
      </section>
    </>
  )
}

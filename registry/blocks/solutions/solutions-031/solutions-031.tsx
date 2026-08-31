import type { CSSProperties } from "react"

export type Solutions031Batch = {
  number: string
  product: string
  checkedQty: number
  defectQty: number
  decision: "accept" | "rework" | "scrap"
}

export type Solutions031Cause = {
  name: string
  count: number
}

export type Solutions031Props = {
  title?: string
  hint?: string
  batches?: Solutions031Batch[]
  causes?: Solutions031Cause[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: контроль качества с браком в двух связанных секциях. Доля
// брака по партии считается из проверенного и бракованного количества, а не
// приходит числом — процент и число обязаны совпадать. Причины дефектов
// собраны в диаграмму Парето: столбцы отсортированы по частоте, а
// накопленный процент под каждым — тоже посчитан нарастающим итогом, это и
// показывает, сколько причин закрывают 80% брака. Решение по партии несёт не
// только цвет, но и форму метки и слово: принять/доработать/списать нельзя
// перепутать при дальтонизме.
const STYLES = `
:where([data-vibeui-block="solutions-031"]){
--vibeui-solutions-031-bg:oklch(1 0 0);
--vibeui-solutions-031-panel:oklch(0.977 0.004 255);
--vibeui-solutions-031-fg:oklch(0.21 0.014 265);
--vibeui-solutions-031-muted:oklch(0.54 0.014 265);
--vibeui-solutions-031-border:oklch(0.9 0.006 265);
--vibeui-solutions-031-accent:oklch(0.5 0.15 250);
--vibeui-solutions-031-accept:oklch(0.55 0.14 152);
--vibeui-solutions-031-rework:oklch(0.64 0.15 75);
--vibeui-solutions-031-scrap:oklch(0.57 0.19 25);
--vibeui-solutions-031-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-031-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-031"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-031-bg);
border:1px solid var(--vibeui-solutions-031-border);border-radius:1rem;
font-family:var(--vibeui-solutions-031-sans);color:var(--vibeui-solutions-031-fg);
}
[data-vibeui-block="solutions-031"] *{box-sizing:border-box}
[data-vibeui-block="solutions-031"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-031"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-031"] h3{margin:0 0 0.5rem;font-size:0.8125rem;font-weight:700}
[data-vibeui-block="solutions-031"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-031-muted)}
[data-vibeui-block="solutions-031"] [data-part="summary"]{
display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
[data-vibeui-block="solutions-031"] [data-part="tile"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-solutions-031-panel);border:1px solid var(--vibeui-solutions-031-border);
}
[data-vibeui-block="solutions-031"] [data-part="tile"] b{
display:block;font-size:1rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.015em;
}
[data-vibeui-block="solutions-031"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-031-muted);
}
[data-vibeui-block="solutions-031"] [data-part="scroll"]{overflow-x:auto;scrollbar-width:thin}
[data-vibeui-block="solutions-031"] table{width:100%;min-width:36rem;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="solutions-031"] th,
[data-vibeui-block="solutions-031"] td{
padding:0.5rem 0.625rem;text-align:left;white-space:nowrap;vertical-align:middle;
border-top:1px solid var(--vibeui-solutions-031-border);
}
[data-vibeui-block="solutions-031"] th:first-child,
[data-vibeui-block="solutions-031"] td:first-child{padding-left:1rem}
[data-vibeui-block="solutions-031"] th:last-child,
[data-vibeui-block="solutions-031"] td:last-child{padding-right:1rem}
[data-vibeui-block="solutions-031"] th{
font-size:0.625rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-031-muted);background:var(--vibeui-solutions-031-panel);
}
[data-vibeui-block="solutions-031"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="solutions-031"] [data-part="batch"]{
display:block;font-family:var(--vibeui-solutions-031-mono);font-size:0.6875rem;color:var(--vibeui-solutions-031-muted);
}
[data-vibeui-block="solutions-031"] [data-part="product"]{display:block;font-weight:650}
[data-vibeui-block="solutions-031"] [data-part="rate"]{display:flex;align-items:center;gap:0.5rem;min-width:8rem}
[data-vibeui-block="solutions-031"] [data-part="meter"]{
position:relative;flex:1;height:0.5rem;border-radius:9999px;
background:var(--vibeui-solutions-031-panel);border:1px solid var(--vibeui-solutions-031-border);overflow:hidden;
}
[data-vibeui-block="solutions-031"] [data-part="fill"]{
position:absolute;inset:0;width:var(--vibeui-solutions-031-fill,0%);
border-radius:9999px;background:var(--vibeui-solutions-031-scrap);
}
[data-vibeui-block="solutions-031"] [data-part="rate-value"]{
flex:none;font-size:0.6875rem;font-variant-numeric:tabular-nums;color:var(--vibeui-solutions-031-muted);
}
/* Решение: слово и форма метки, не только цвет — принять/доработать/списать. */
[data-vibeui-block="solutions-031"] [data-part="decision"]{
display:inline-flex;align-items:center;gap:0.375rem;font-size:0.6875rem;font-weight:650;
}
[data-vibeui-block="solutions-031"] [data-part="mark"]{
width:0.875rem;height:0.875rem;flex:none;display:grid;place-items:center;
border-radius:9999px;color:oklch(1 0 0);font-size:0.5625rem;font-weight:700;line-height:1;
}
[data-vibeui-block="solutions-031"] [data-decision="accept"] [data-part="decision"]{color:var(--vibeui-solutions-031-accept)}
[data-vibeui-block="solutions-031"] [data-decision="accept"] [data-part="mark"]{background:var(--vibeui-solutions-031-accept)}
[data-vibeui-block="solutions-031"] [data-decision="rework"] [data-part="decision"]{color:var(--vibeui-solutions-031-rework)}
[data-vibeui-block="solutions-031"] [data-decision="rework"] [data-part="mark"]{
background:var(--vibeui-solutions-031-rework);border-radius:0.25rem;
}
[data-vibeui-block="solutions-031"] [data-decision="scrap"] [data-part="decision"]{color:var(--vibeui-solutions-031-scrap)}
[data-vibeui-block="solutions-031"] [data-decision="scrap"] [data-part="mark"]{
background:var(--vibeui-solutions-031-scrap);border-radius:0.1875rem;transform:rotate(45deg);
}
[data-vibeui-block="solutions-031"] [data-part="pareto"]{padding:1.125rem 1rem 0.25rem}
[data-vibeui-block="solutions-031"] [data-part="causes"]{
display:flex;flex-direction:column;gap:0.5rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="solutions-031"] [data-part="cause"]{
display:grid;grid-template-columns:9rem 1fr 3.25rem;align-items:center;gap:0.625rem;font-size:0.75rem;
}
[data-vibeui-block="solutions-031"] [data-part="cause-name"]{
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="solutions-031"] [data-part="bar-track"]{
position:relative;height:0.875rem;border-radius:0.25rem;background:var(--vibeui-solutions-031-panel);
border:1px solid var(--vibeui-solutions-031-border);overflow:hidden;
}
[data-vibeui-block="solutions-031"] [data-part="bar-fill"]{
position:absolute;inset:0;width:var(--vibeui-solutions-031-fill,0%);
border-radius:0.25rem;background:var(--vibeui-solutions-031-accent);
}
[data-vibeui-block="solutions-031"] [data-part="cause-count"]{
text-align:right;font-variant-numeric:tabular-nums;color:var(--vibeui-solutions-031-muted);
}
[data-vibeui-block="solutions-031"] [data-part="cumulative"]{
display:block;margin-top:0.125rem;font-size:0.625rem;color:var(--vibeui-solutions-031-muted);
grid-column:2 / span 1;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-031"] [data-part="foot"]{
margin:0;padding:1rem;font-size:0.75rem;color:var(--vibeui-solutions-031-muted);
}
@container (min-width: 42rem){
[data-vibeui-block="solutions-031"] [data-part="layout"]{display:grid;grid-template-columns:1.3fr 1fr;gap:0 0.5rem}
[data-vibeui-block="solutions-031"] [data-part="pareto"]{border-left:1px solid var(--vibeui-solutions-031-border)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-031"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_BATCHES: Solutions031Batch[] = [
  {
    number: "П-5502",
    product: "Крышка редуктора, литьё",
    checkedQty: 240,
    defectQty: 6,
    decision: "accept",
  },
  {
    number: "П-5507",
    product: "Втулка направляющая",
    checkedQty: 180,
    defectQty: 21,
    decision: "rework",
  },
  {
    number: "П-5511",
    product: "Кронштейн крепления",
    checkedQty: 96,
    defectQty: 34,
    decision: "scrap",
  },
  {
    number: "П-5514",
    product: "Прокладка уплотнительная",
    checkedQty: 500,
    defectQty: 9,
    decision: "accept",
  },
  {
    number: "П-5519",
    product: "Вал шлицевой",
    checkedQty: 64,
    defectQty: 12,
    decision: "rework",
  },
]

const DEFAULT_CAUSES: Solutions031Cause[] = [
  { name: "Раковины в отливке", count: 38 },
  { name: "Смещение оси отверстия", count: 24 },
  { name: "Трещина после закалки", count: 14 },
  { name: "Царапины на поверхности", count: 9 },
  { name: "Отклонение по толщине", count: 6 },
  { name: "Прочие причины", count: 4 },
]

const DECISION_LABEL: Record<
  Solutions031Batch["decision"],
  { word: string; mark: string }
> = {
  accept: { word: "принять", mark: "✓" },
  rework: { word: "доработать", mark: "~" },
  scrap: { word: "списать", mark: "×" },
}

const formatPercent = (value: number) => `${Math.round(value * 10) / 10}%`

/**
 * Контроль качества: доля брака считается из партии, причины — диаграмма
 * Парето с посчитанным нарастающим итогом под каждым столбцом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions031({
  title = "Контроль качества",
  hint = "Партии на входном контроле · участок литья и мехобработки",
  batches = DEFAULT_BATCHES,
  causes = DEFAULT_CAUSES,
  accent,
  className,
  style,
}: Solutions031Props) {
  const totalChecked = batches.reduce((sum, batch) => sum + batch.checkedQty, 0)
  const totalDefects = batches.reduce((sum, batch) => sum + batch.defectQty, 0)
  const avgDefectRate = totalChecked ? (totalDefects / totalChecked) * 100 : 0

  const sortedCauses = [...causes].sort((a, b) => b.count - a.count)
  const causeTotal = sortedCauses.reduce((sum, cause) => sum + cause.count, 0)
  const maxCauseCount = Math.max(1, ...sortedCauses.map((cause) => cause.count))

  const palette = {
    ...(accent ? { "--vibeui-solutions-031-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-031" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-031"
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
            <b>{totalChecked}</b>
            <span>единиц проверено</span>
          </p>
          <p data-part="tile">
            <b>{totalDefects}</b>
            <span>единиц брака</span>
          </p>
          <p data-part="tile">
            <b>{formatPercent(avgDefectRate)}</b>
            <span>средняя доля брака</span>
          </p>
        </div>

        <div data-part="layout">
          <div data-part="scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Партия</th>
                  <th scope="col" data-align="end">
                    Проверено
                  </th>
                  <th scope="col">Доля брака</th>
                  <th scope="col">Решение</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch) => {
                  const rate = batch.checkedQty
                    ? (batch.defectQty / batch.checkedQty) * 100
                    : 0
                  const decision = DECISION_LABEL[batch.decision]

                  return (
                    <tr key={batch.number} data-decision={batch.decision}>
                      <td>
                        <span data-part="batch">{batch.number}</span>
                        <span data-part="product">{batch.product}</span>
                      </td>
                      <td data-align="end">{batch.checkedQty}</td>
                      <td>
                        <span data-part="rate">
                          <span
                            data-part="meter"
                            role="progressbar"
                            aria-valuenow={Math.round(rate)}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`Доля брака в партии ${batch.number}`}
                          >
                            <span
                              data-part="fill"
                              style={{
                                ["--vibeui-solutions-031-fill" as string]: `${Math.min(100, rate)}%`,
                              }}
                            />
                          </span>
                          <span data-part="rate-value">
                            {formatPercent(rate)}
                          </span>
                        </span>
                      </td>
                      <td>
                        <span data-part="decision">
                          <span data-part="mark" aria-hidden="true">
                            {decision.mark}
                          </span>
                          {decision.word}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div data-part="pareto">
            <h3>Причины брака (Парето)</h3>
            <ol data-part="causes">
              {sortedCauses.map((cause, index) => {
                const barWidth = Math.round((cause.count / maxCauseCount) * 100)
                const runningCount = sortedCauses
                  .slice(0, index + 1)
                  .reduce((sum, item) => sum + item.count, 0)
                const cumulativeShare = causeTotal
                  ? (runningCount / causeTotal) * 100
                  : 0

                return (
                  <li data-part="cause" key={cause.name}>
                    <span data-part="cause-name">{cause.name}</span>
                    <span
                      data-part="bar-track"
                      role="img"
                      aria-label={`${cause.name}: ${cause.count} случаев, нарастающим итогом ${formatPercent(cumulativeShare)}`}
                    >
                      <span
                        data-part="bar-fill"
                        style={{
                          ["--vibeui-solutions-031-fill" as string]: `${barWidth}%`,
                        }}
                      />
                    </span>
                    <span data-part="cause-count">{cause.count}</span>
                    <span data-part="cumulative">
                      нарастающим итогом: {formatPercent(cumulativeShare)}
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>

        <p data-part="foot">
          Доля брака и накопленный процент причин пересчитаны из чисел партии и
          списка причин — сортировка Парето сама показывает главные причины.
        </p>
      </section>
    </>
  )
}

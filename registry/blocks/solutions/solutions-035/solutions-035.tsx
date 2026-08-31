import type { CSSProperties } from "react"

export type Solutions035Kind = "electricity" | "water" | "heat"

export type Solutions035Meter = {
  id: string
  kind: Solutions035Kind
  location: string
  previous: number
  current: number
  unit: string
  tariffLabel: string
  tariffValue: number
  average: number
}

export type Solutions035Props = {
  title?: string
  hint?: string
  anomalyThreshold?: number
  meters?: Solutions035Meter[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: показания приборов учёта. Расход и сумма не приходят готовыми
// числами — считаются из previous/current и тарифа прямо в компоненте, чтобы
// таблица не могла разойтись с исходными показаниями. Аномалия — не метка от
// бэкенда, а сравнение расхода со средним по anomalyThreshold: превышение
// подписывается процентом и получает контрастную полосу, а не только цвет
// текста. Тип счётчика несёт букву в кружке — электро, вода, тепло — рядом с
// адресом, чтобы список читался без легенды на каждой странице.
const STYLES = `
:where([data-vibeui-block="solutions-035"]){
--vibeui-solutions-035-bg:oklch(1 0 0);
--vibeui-solutions-035-panel:oklch(0.973 0.005 90);
--vibeui-solutions-035-fg:oklch(0.22 0.014 90);
--vibeui-solutions-035-muted:oklch(0.54 0.014 90);
--vibeui-solutions-035-border:oklch(0.9 0.007 90);
--vibeui-solutions-035-accent:oklch(0.6 0.15 85);
--vibeui-solutions-035-electricity:oklch(0.64 0.16 95);
--vibeui-solutions-035-water:oklch(0.58 0.13 235);
--vibeui-solutions-035-heat:oklch(0.58 0.18 30);
--vibeui-solutions-035-bad:oklch(0.57 0.19 25);
--vibeui-solutions-035-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-035-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-035"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-035-bg);
border:1px solid var(--vibeui-solutions-035-border);border-radius:1rem;
font-family:var(--vibeui-solutions-035-sans);color:var(--vibeui-solutions-035-fg);
}
[data-vibeui-block="solutions-035"] *{box-sizing:border-box}
[data-vibeui-block="solutions-035"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-035"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-035"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-035-muted)}
[data-vibeui-block="solutions-035"] [data-part="summary"]{
display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
[data-vibeui-block="solutions-035"] [data-part="tile"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;background:var(--vibeui-solutions-035-panel);
border:1px solid var(--vibeui-solutions-035-border);
}
[data-vibeui-block="solutions-035"] [data-tile="bad"]{
border-color:color-mix(in oklab,var(--vibeui-solutions-035-bad) 45%,transparent);
background:color-mix(in oklab,var(--vibeui-solutions-035-bad) 8%,var(--vibeui-solutions-035-bg));
}
[data-vibeui-block="solutions-035"] [data-part="tile"] b{
display:block;font-size:1rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.015em;
}
[data-vibeui-block="solutions-035"] [data-tile="bad"] b{color:var(--vibeui-solutions-035-bad)}
[data-vibeui-block="solutions-035"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-035-muted);
}
[data-vibeui-block="solutions-035"] [data-part="scroll"]{overflow-x:auto;scrollbar-width:thin}
[data-vibeui-block="solutions-035"] table{width:100%;min-width:40rem;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="solutions-035"] th,
[data-vibeui-block="solutions-035"] td{
padding:0.5rem 0.625rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-solutions-035-border);
}
[data-vibeui-block="solutions-035"] th:first-child,
[data-vibeui-block="solutions-035"] td:first-child{padding-left:1rem}
[data-vibeui-block="solutions-035"] th:last-child,
[data-vibeui-block="solutions-035"] td:last-child{padding-right:1rem}
[data-vibeui-block="solutions-035"] th{
font-size:0.625rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-035-muted);background:var(--vibeui-solutions-035-panel);
}
[data-vibeui-block="solutions-035"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="solutions-035"] [data-part="meter"]{display:flex;align-items:center;gap:0.5rem}
[data-vibeui-block="solutions-035"] [data-part="chip"]{
flex:none;width:1.5rem;height:1.5rem;border-radius:9999px;display:grid;place-items:center;
font-size:0.6875rem;font-weight:700;color:oklch(1 0 0);
}
[data-vibeui-block="solutions-035"] [data-kind="electricity"]{background:var(--vibeui-solutions-035-electricity)}
[data-vibeui-block="solutions-035"] [data-kind="water"]{background:var(--vibeui-solutions-035-water)}
[data-vibeui-block="solutions-035"] [data-kind="heat"]{background:var(--vibeui-solutions-035-heat)}
[data-vibeui-block="solutions-035"] [data-part="location"]{display:block;font-weight:650}
[data-vibeui-block="solutions-035"] [data-part="id"]{display:block;font-size:0.6875rem;color:var(--vibeui-solutions-035-muted)}
[data-vibeui-block="solutions-035"] [data-part="num"]{font-family:var(--vibeui-solutions-035-mono)}
/* Аномалия — полоса и подпись процентом, не только цвет: различимо и без него. */
[data-vibeui-block="solutions-035"] [data-anomaly="true"] td:first-child{
box-shadow:inset 3px 0 0 0 var(--vibeui-solutions-035-bad);
}
[data-vibeui-block="solutions-035"] [data-part="delta"]{
display:block;font-size:0.6875rem;margin-top:0.125rem;color:var(--vibeui-solutions-035-muted);
}
[data-vibeui-block="solutions-035"] [data-anomaly="true"] [data-part="delta"]{
color:var(--vibeui-solutions-035-bad);font-weight:650;
}
[data-vibeui-block="solutions-035"] [data-part="foot"]{
margin:0;padding:0.75rem 1rem 1rem;font-size:0.75rem;color:var(--vibeui-solutions-035-muted);
}
/* Сводка от собственной ширины: в узкой карточке три колонки нечитаемы. */
@container (max-width: 30rem){
[data-vibeui-block="solutions-035"] [data-part="summary"]{grid-template-columns:minmax(0,1fr);gap:0.375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-035"] *{animation:none!important;transition:none!important}}
`

const KIND_LETTER: Record<Solutions035Kind, string> = {
  electricity: "Э",
  water: "В",
  heat: "Т",
}

const KIND_LABEL: Record<Solutions035Kind, string> = {
  electricity: "Электричество",
  water: "Вода",
  heat: "Тепло",
}

const DEFAULT_METERS: Solutions035Meter[] = [
  {
    id: "Э-014",
    kind: "electricity",
    location: "Подъезд 1, ИТП",
    previous: 48210,
    current: 49340,
    unit: "кВт·ч",
    tariffLabel: "5,8 ₽/кВт·ч",
    tariffValue: 5.8,
    average: 980,
  },
  {
    id: "В-014",
    kind: "water",
    location: "Подъезд 1, ХВС",
    previous: 3120,
    current: 3186,
    unit: "м³",
    tariffLabel: "48 ₽/м³",
    tariffValue: 48,
    average: 62,
  },
  {
    id: "Т-002",
    kind: "heat",
    location: "Общедомовой, тепло",
    previous: 214,
    current: 261,
    unit: "Гкал",
    tariffLabel: "1 940 ₽/Гкал",
    tariffValue: 1940,
    average: 36,
  },
  {
    id: "Э-021",
    kind: "electricity",
    location: "Подъезд 2, ИТП",
    previous: 51040,
    current: 51920,
    unit: "кВт·ч",
    tariffLabel: "5,8 ₽/кВт·ч",
    tariffValue: 5.8,
    average: 910,
  },
]

/**
 * Показания приборов учёта: расход и сумма считаются из показаний и тарифа,
 * аномалия — из сравнения со средним. Один файл, ноль зависимостей.
 */
export function Solutions035({
  title = "Показания приборов учёта",
  hint = "Март 2024 · управляющая компания «Двор»",
  anomalyThreshold = 30,
  meters = DEFAULT_METERS,
  accent,
  className,
  style,
}: Solutions035Props) {
  const rows = meters.map((meter) => {
    const consumption = meter.current - meter.previous
    const sum = Math.round(consumption * meter.tariffValue)
    const deviationPercent = Math.round(
      ((consumption - meter.average) / meter.average) * 100,
    )
    const anomaly = deviationPercent >= anomalyThreshold
    return { meter, consumption, sum, deviationPercent, anomaly }
  })

  const totalSum = rows.reduce((sum, row) => sum + row.sum, 0)
  const anomalies = rows.filter((row) => row.anomaly)

  const palette = {
    ...(accent ? { "--vibeui-solutions-035-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-035" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-035"
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
            <b>{meters.length}</b>
            <span>приборов в реестре</span>
          </p>
          <p data-part="tile">
            <b>{totalSum.toLocaleString("ru-RU")} ₽</b>
            <span>к начислению за месяц</span>
          </p>
          <p data-part="tile" data-tile={anomalies.length ? "bad" : undefined}>
            <b>{anomalies.length}</b>
            <span>расход выше среднего</span>
          </p>
        </div>

        <div data-part="scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Прибор</th>
                <th scope="col" data-align="end">
                  Предыдущее
                </th>
                <th scope="col" data-align="end">
                  Текущее
                </th>
                <th scope="col" data-align="end">
                  Расход
                </th>
                <th scope="col" data-align="end">
                  Тариф
                </th>
                <th scope="col" data-align="end">
                  Сумма
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(
                ({ meter, consumption, sum, deviationPercent, anomaly }) => (
                  <tr key={meter.id} data-anomaly={anomaly ? "true" : "false"}>
                    <td>
                      <span data-part="meter">
                        <span
                          data-part="chip"
                          data-kind={meter.kind}
                          aria-hidden="true"
                        >
                          {KIND_LETTER[meter.kind]}
                        </span>
                        <span>
                          <span data-part="location">{meter.location}</span>
                          <span data-part="id">
                            {meter.id} · {KIND_LABEL[meter.kind]}
                          </span>
                        </span>
                      </span>
                    </td>
                    <td data-align="end">
                      <span data-part="num">
                        {meter.previous.toLocaleString("ru-RU")}
                      </span>
                    </td>
                    <td data-align="end">
                      <span data-part="num">
                        {meter.current.toLocaleString("ru-RU")}
                      </span>
                    </td>
                    <td data-align="end">
                      <span data-part="num">
                        {consumption.toLocaleString("ru-RU")} {meter.unit}
                      </span>
                      <span data-part="delta">
                        {anomaly
                          ? `выше среднего на ${deviationPercent}%`
                          : `среднее ${meter.average} ${meter.unit}`}
                      </span>
                    </td>
                    <td data-align="end">{meter.tariffLabel}</td>
                    <td data-align="end">
                      <span data-part="num">
                        {sum.toLocaleString("ru-RU")} ₽
                      </span>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>

        <p data-part="foot">
          Аномалия — расход выше среднего по прибору на {anomalyThreshold}% и
          более. Проверьте счётчик перед начислением.
        </p>
      </section>
    </>
  )
}

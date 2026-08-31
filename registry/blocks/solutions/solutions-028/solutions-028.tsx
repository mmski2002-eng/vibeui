import type { CSSProperties } from "react"

export type Solutions028Item = {
  sku: string
  name: string
  location: string
  countedQty: number
  actualQty: number
  unitPrice: number
}

export type Solutions028Props = {
  title?: string
  hint?: string
  items?: Solutions028Item[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: расхождение при пересчёте не приходит меткой «недостача» — оно
// считается как actualQty минус countedQty прямо в компоненте, знак сам
// определяет недостачу или излишек. Полоса расхождения растёт от центральной
// оси вправо или влево — направление читается по геометрии раньше, чем по
// числу со знаком. Недостача и излишек различаются ещё и подписью и формой
// метки, чтобы не зависеть только от цвета столбика.
const STYLES = `
:where([data-vibeui-block="solutions-028"]){
--vibeui-solutions-028-bg:oklch(1 0 0);
--vibeui-solutions-028-panel:oklch(0.977 0.004 255);
--vibeui-solutions-028-fg:oklch(0.21 0.014 265);
--vibeui-solutions-028-muted:oklch(0.54 0.014 265);
--vibeui-solutions-028-border:oklch(0.9 0.006 265);
--vibeui-solutions-028-accent:oklch(0.5 0.15 250);
--vibeui-solutions-028-short:oklch(0.57 0.19 25);
--vibeui-solutions-028-over:oklch(0.55 0.14 152);
--vibeui-solutions-028-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-028-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-028"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-028-bg);
border:1px solid var(--vibeui-solutions-028-border);border-radius:1rem;
font-family:var(--vibeui-solutions-028-sans);color:var(--vibeui-solutions-028-fg);
}
[data-vibeui-block="solutions-028"] *{box-sizing:border-box}
[data-vibeui-block="solutions-028"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-028"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-028"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-028-muted)}
[data-vibeui-block="solutions-028"] [data-part="summary"]{
display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
[data-vibeui-block="solutions-028"] [data-part="tile"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-solutions-028-panel);
border:1px solid var(--vibeui-solutions-028-border);
}
[data-vibeui-block="solutions-028"] [data-tile="short"]{
border-color:color-mix(in oklab,var(--vibeui-solutions-028-short) 45%,transparent);
background:color-mix(in oklab,var(--vibeui-solutions-028-short) 8%,var(--vibeui-solutions-028-bg));
}
[data-vibeui-block="solutions-028"] [data-tile="over"]{
border-color:color-mix(in oklab,var(--vibeui-solutions-028-over) 45%,transparent);
background:color-mix(in oklab,var(--vibeui-solutions-028-over) 8%,var(--vibeui-solutions-028-bg));
}
[data-vibeui-block="solutions-028"] [data-part="tile"] b{
display:block;font-size:1rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.015em;
}
[data-vibeui-block="solutions-028"] [data-tile="short"] b{color:var(--vibeui-solutions-028-short)}
[data-vibeui-block="solutions-028"] [data-tile="over"] b{color:var(--vibeui-solutions-028-over)}
[data-vibeui-block="solutions-028"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-028-muted);
}
[data-vibeui-block="solutions-028"] [data-part="scroll"]{overflow-x:auto;scrollbar-width:thin}
[data-vibeui-block="solutions-028"] table{width:100%;min-width:44rem;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="solutions-028"] th,
[data-vibeui-block="solutions-028"] td{
padding:0.5rem 0.625rem;text-align:left;white-space:nowrap;vertical-align:middle;
border-top:1px solid var(--vibeui-solutions-028-border);
}
[data-vibeui-block="solutions-028"] th:first-child,
[data-vibeui-block="solutions-028"] td:first-child{padding-left:1rem}
[data-vibeui-block="solutions-028"] th:last-child,
[data-vibeui-block="solutions-028"] td:last-child{padding-right:1rem}
[data-vibeui-block="solutions-028"] th{
font-size:0.625rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-028-muted);background:var(--vibeui-solutions-028-panel);
}
[data-vibeui-block="solutions-028"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="solutions-028"] [data-part="sku"]{
display:block;font-family:var(--vibeui-solutions-028-mono);font-size:0.6875rem;color:var(--vibeui-solutions-028-muted);
}
[data-vibeui-block="solutions-028"] [data-part="name"]{display:block;font-weight:650}
[data-vibeui-block="solutions-028"] [data-part="loc"]{display:block;font-size:0.6875rem;color:var(--vibeui-solutions-028-muted)}
/* Полоса растёт от центра: направление расхождения видно по геометрии. */
[data-vibeui-block="solutions-028"] [data-part="diverge"]{
position:relative;width:8rem;height:0.75rem;
background:linear-gradient(90deg,transparent calc(50% - 1px),var(--vibeui-solutions-028-border) calc(50% - 1px),var(--vibeui-solutions-028-border) calc(50% + 1px),transparent calc(50% + 1px));
}
[data-vibeui-block="solutions-028"] [data-part="bar"]{
position:absolute;top:0.125rem;height:0.5rem;border-radius:0.25rem;
width:var(--vibeui-solutions-028-bar,0%);
}
[data-vibeui-block="solutions-028"] [data-dir="short"] [data-part="bar"]{
right:50%;background:var(--vibeui-solutions-028-short);
}
[data-vibeui-block="solutions-028"] [data-dir="over"] [data-part="bar"]{
left:50%;background:var(--vibeui-solutions-028-over);
}
[data-vibeui-block="solutions-028"] [data-dir="none"] [data-part="bar"]{width:0}
[data-vibeui-block="solutions-028"] [data-part="delta"]{
display:block;font-size:0.75rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-028"] [data-dir="short"] [data-part="delta"]{color:var(--vibeui-solutions-028-short)}
[data-vibeui-block="solutions-028"] [data-dir="over"] [data-part="delta"]{color:var(--vibeui-solutions-028-over)}
/* Статус: слово и толщина рамки метки, не только цвет полосы. */
[data-vibeui-block="solutions-028"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.125rem 0.5rem;border-radius:9999px;border:1px solid var(--vibeui-solutions-028-border);
font-size:0.6875rem;font-weight:650;color:var(--vibeui-solutions-028-muted);
}
[data-vibeui-block="solutions-028"] [data-dir="short"] [data-part="status"]{
color:var(--vibeui-solutions-028-short);
border-color:color-mix(in oklab,var(--vibeui-solutions-028-short) 55%,transparent);
border-style:dashed;
}
[data-vibeui-block="solutions-028"] [data-dir="over"] [data-part="status"]{
color:var(--vibeui-solutions-028-over);
border-color:color-mix(in oklab,var(--vibeui-solutions-028-over) 55%,transparent);
border-width:2px;
}
[data-vibeui-block="solutions-028"] [data-part="foot"]{
margin:0;padding:0 1rem 1rem;font-size:0.75rem;color:var(--vibeui-solutions-028-muted);
}
/* Сводка от собственной ширины: в узкой карточке три колонки нечитаемы. */
@container (max-width: 30rem){
[data-vibeui-block="solutions-028"] [data-part="summary"]{grid-template-columns:minmax(0,1fr);gap:0.375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-028"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Solutions028Item[] = [
  {
    sku: "ТВ-10241",
    name: "Кабель ВВГнг 3×2.5, бухта 100м",
    location: "Стеллаж А-04",
    countedQty: 84,
    actualQty: 71,
    unitPrice: 6_400,
  },
  {
    sku: "ТВ-10298",
    name: "Автомат защиты C16 ИЭК",
    location: "Стеллаж Б-11",
    countedQty: 320,
    actualQty: 320,
    unitPrice: 410,
  },
  {
    sku: "ТВ-10355",
    name: "Светильник LED 40Вт IP65",
    location: "Стеллаж В-02",
    countedQty: 156,
    actualQty: 181,
    unitPrice: 1_950,
  },
  {
    sku: "ТВ-10402",
    name: "Розетка накладная с УЗО",
    location: "Стеллаж Б-07",
    countedQty: 210,
    actualQty: 198,
    unitPrice: 890,
  },
  {
    sku: "ТВ-10477",
    name: "Щит распределительный ЩРН-24",
    location: "Стеллаж Г-01",
    countedQty: 12,
    actualQty: 9,
    unitPrice: 14_300,
  },
  {
    sku: "ТВ-10513",
    name: "Провод ПУГВ 1×4, бухта 200м",
    location: "Стеллаж А-09",
    countedQty: 64,
    actualQty: 70,
    unitPrice: 3_200,
  },
]

const formatRub = (value: number) =>
  `${value < 0 ? "−" : ""}${Math.abs(Math.round(value)).toLocaleString("ru-RU")} ₽`

/**
 * Инвентаризация с расхождениями: недостача и излишек считаются из учётного
 * и фактического количества, полоса растёт от центра по направлению.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions028({
  title = "Инвентаризация: расхождения",
  hint = "Склад электротоваров · пересчёт от 3 марта 2026",
  items = DEFAULT_ITEMS,
  accent,
  className,
  style,
}: Solutions028Props) {
  const rows = items.map((item) => {
    const variance = item.actualQty - item.countedQty
    const sum = variance * item.unitPrice
    const dir: "short" | "over" | "none" =
      variance < 0 ? "short" : variance > 0 ? "over" : "none"
    return { item, variance, sum, dir }
  })

  const shortageSum = rows.reduce(
    (sum, row) => sum + (row.dir === "short" ? row.sum : 0),
    0,
  )
  const overageSum = rows.reduce(
    (sum, row) => sum + (row.dir === "over" ? row.sum : 0),
    0,
  )
  const mismatched = rows.filter((row) => row.dir !== "none").length
  const maxAbsVariance = Math.max(
    1,
    ...rows.map((row) => Math.abs(row.variance)),
  )

  const palette = {
    ...(accent ? { "--vibeui-solutions-028-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-028" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-028"
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
            Расхождений {mismatched} из {items.length} позиций
          </p>
        </header>

        <div data-part="summary">
          <p data-part="tile" data-tile="short">
            <b>{formatRub(shortageSum)}</b>
            <span>сумма недостачи</span>
          </p>
          <p data-part="tile" data-tile="over">
            <b>{formatRub(overageSum)}</b>
            <span>сумма излишка</span>
          </p>
          <p data-part="tile">
            <b>{mismatched}</b>
            <span>позиций с расхождением</span>
          </p>
        </div>

        <div data-part="scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Позиция</th>
                <th scope="col">Место хранения</th>
                <th scope="col" data-align="end">
                  Учётное
                </th>
                <th scope="col" data-align="end">
                  Фактическое
                </th>
                <th scope="col">Расхождение</th>
                <th scope="col" data-align="end">
                  Сумма отклонения
                </th>
                <th scope="col">Статус</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ item, variance, sum, dir }) => {
                const barPercent = Math.round(
                  (Math.abs(variance) / maxAbsVariance) * 100,
                )
                const statusLabel =
                  dir === "short"
                    ? "недостача"
                    : dir === "over"
                      ? "излишек"
                      : "совпадает"

                return (
                  <tr key={item.sku} data-dir={dir}>
                    <td>
                      <span data-part="sku">{item.sku}</span>
                      <span data-part="name">{item.name}</span>
                    </td>
                    <td>
                      <span data-part="loc">{item.location}</span>
                    </td>
                    <td data-align="end">{item.countedQty}</td>
                    <td data-align="end">{item.actualQty}</td>
                    <td>
                      <span
                        data-part="diverge"
                        role="img"
                        aria-label={`Расхождение по ${item.name}: ${variance > 0 ? "+" : ""}${variance} шт`}
                      >
                        <span
                          data-part="bar"
                          style={{
                            ["--vibeui-solutions-028-bar" as string]: `${barPercent}%`,
                          }}
                        />
                      </span>
                      <span data-part="delta">
                        {variance > 0 ? "+" : ""}
                        {variance} шт
                      </span>
                    </td>
                    <td data-align="end">{formatRub(sum)}</td>
                    <td>
                      <span data-part="status">{statusLabel}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <p data-part="foot">
          Расхождение и сумма отклонения посчитаны из учётного и фактического
          количества — метку статуса нельзя проставить вручную мимо чисел.
        </p>
      </section>
    </>
  )
}

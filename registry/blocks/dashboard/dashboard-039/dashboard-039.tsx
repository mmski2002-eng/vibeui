import type { CSSProperties } from "react"

export type Dashboard039Item = {
  sku: string
  name: string
  place: string
  stock: number
  reorder: number
  max: number
  unit: string
  incoming?: string
}

export type Dashboard039Props = {
  title?: string
  hint?: string
  items?: Dashboard039Item[]
  orderLabel?: string
  lowLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: таблица остатков, где запас показан не числом, а отрезком с
// отметкой точки заказа. Отметка нарисована градиентной засечкой прямо в
// полосе, поэтому «сколько осталось» и «когда пора заказывать» читаются одним
// взглядом и не требуют сравнения двух колонок. Позиции ниже точки заказа
// помечены полосой слева, словом и знаком: только цветом такую строку не
// выделить. Отбор строк собран на чекбоксах, а кнопка заказа стоит в липкой
// нижней панели, чтобы не терялась при длинном списке.
const STYLES = `
:where([data-vibeui-block="dashboard-039"]){
--vibeui-dashboard-039-bg:oklch(0.985 0.004 95);
--vibeui-dashboard-039-card:oklch(1 0 0);
--vibeui-dashboard-039-fg:oklch(0.23 0.012 95);
--vibeui-dashboard-039-muted:oklch(0.55 0.012 95);
--vibeui-dashboard-039-border:oklch(0.9 0.008 95);
--vibeui-dashboard-039-accent:oklch(0.52 0.13 155);
--vibeui-dashboard-039-low:oklch(0.6 0.18 35);
--vibeui-dashboard-039-soft:oklch(0.96 0.03 155);
--vibeui-dashboard-039-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-039"]{
box-sizing:border-box;
background:var(--vibeui-dashboard-039-bg);
color:var(--vibeui-dashboard-039-fg);
font-family:var(--vibeui-dashboard-039-sans);
border:1px solid var(--vibeui-dashboard-039-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-039"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-039"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.75rem}
[data-vibeui-block="dashboard-039"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.5rem 0.875rem}
[data-vibeui-block="dashboard-039"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-039"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-039-muted)}
[data-vibeui-block="dashboard-039"] [data-part="alarm"]{
margin-left:auto;font-size:0.75rem;font-weight:700;padding:0.25rem 0.625rem;border-radius:9999px;
color:var(--vibeui-dashboard-039-low);
border:1px solid color-mix(in oklab,var(--vibeui-dashboard-039-low) 40%,white);
background:color-mix(in oklab,var(--vibeui-dashboard-039-low) 10%,white);
}
[data-vibeui-block="dashboard-039"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="dashboard-039"] table{
width:100%;min-width:36rem;border-collapse:collapse;
background:var(--vibeui-dashboard-039-card);
border:1px solid var(--vibeui-dashboard-039-border);border-radius:0.875rem;overflow:hidden;
}
[data-vibeui-block="dashboard-039"] th{
text-align:left;font-size:0.625rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;
color:var(--vibeui-dashboard-039-muted);
padding:0.625rem 0.75rem;border-bottom:1px solid var(--vibeui-dashboard-039-border);
white-space:nowrap;
}
[data-vibeui-block="dashboard-039"] th[data-num],
[data-vibeui-block="dashboard-039"] td[data-num]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="dashboard-039"] td{
padding:0.625rem 0.75rem;font-size:0.8125rem;vertical-align:middle;
border-bottom:1px solid var(--vibeui-dashboard-039-border);
}
[data-vibeui-block="dashboard-039"] tbody tr:last-child td{border-bottom:0}
[data-vibeui-block="dashboard-039"] tbody tr[data-low="yes"] td:first-child{
box-shadow:inset 0.1875rem 0 0 var(--vibeui-dashboard-039-low);
}
[data-vibeui-block="dashboard-039"] tbody tr[data-low="yes"]{background:color-mix(in oklab,var(--vibeui-dashboard-039-low) 5%,white)}
[data-vibeui-block="dashboard-039"] input[type="checkbox"]{
width:0.9375rem;height:0.9375rem;margin:0;accent-color:var(--vibeui-dashboard-039-accent);
}
[data-vibeui-block="dashboard-039"] [data-part="name"]{display:block;font-weight:700}
[data-vibeui-block="dashboard-039"] [data-part="sku"]{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-dashboard-039-muted);
}
[data-vibeui-block="dashboard-039"] [data-part="gauge"]{
display:block;position:relative;width:100%;min-width:6rem;height:0.5rem;border-radius:9999px;
background:var(--vibeui-dashboard-039-bg);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-039-border);overflow:hidden;
}
[data-vibeui-block="dashboard-039"] [data-part="fill"]{
position:absolute;inset:0 auto 0 0;border-radius:9999px;background:var(--vibeui-dashboard-039-accent);
}
[data-vibeui-block="dashboard-039"] tr[data-low="yes"] [data-part="fill"]{background:var(--vibeui-dashboard-039-low)}
/* Засечка точки заказа: порог виден внутри полосы, а не отдельной колонкой. */
[data-vibeui-block="dashboard-039"] [data-part="mark"]{
position:absolute;top:-0.125rem;bottom:-0.125rem;width:0.125rem;
background:var(--vibeui-dashboard-039-fg);border-radius:9999px;
}
[data-vibeui-block="dashboard-039"] [data-part="under"]{
display:block;margin-top:0.25rem;font-size:0.625rem;color:var(--vibeui-dashboard-039-muted);
}
[data-vibeui-block="dashboard-039"] [data-part="state"]{
display:inline-flex;align-items:center;gap:0.3125rem;white-space:nowrap;
font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="dashboard-039"] [data-part="state"]::before{
content:"";width:0.5rem;height:0.5rem;border-radius:50%;
border:1.5px solid var(--vibeui-dashboard-039-accent);
}
[data-vibeui-block="dashboard-039"] tr[data-low="yes"] [data-part="state"]{color:var(--vibeui-dashboard-039-low)}
[data-vibeui-block="dashboard-039"] tr[data-low="yes"] [data-part="state"]::before{
border-color:var(--vibeui-dashboard-039-low);background:var(--vibeui-dashboard-039-low);border-radius:0.125rem;
}
[data-vibeui-block="dashboard-039"] [data-part="bar"]{
position:sticky;bottom:0;display:flex;flex-wrap:wrap;align-items:center;gap:0.625rem;
padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-dashboard-039-card);
border:1px solid var(--vibeui-dashboard-039-border);
}
[data-vibeui-block="dashboard-039"] [data-part="bar"] p{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-039-muted)}
[data-vibeui-block="dashboard-039"] [data-part="order"]{
appearance:none;border:0;cursor:pointer;font:inherit;margin-left:auto;
font-size:0.8125rem;font-weight:700;padding:0.5rem 0.9375rem;border-radius:0.625rem;
background:var(--vibeui-dashboard-039-accent);color:oklch(1 0 0);
}
[data-vibeui-block="dashboard-039"] :is(button,input):focus-visible{
outline:2px solid var(--vibeui-dashboard-039-accent);outline-offset:2px;
}
@container (min-width: 44rem){
[data-vibeui-block="dashboard-039"] [data-part="scroll"] table{min-width:0}
}
`

const DEFAULT_ITEMS: Dashboard039Item[] = [
  {
    sku: "ФН-1201",
    name: "Фанера берёзовая 15 мм",
    place: "Склад А · стеллаж 4",
    stock: 18,
    reorder: 40,
    max: 200,
    unit: "листов",
    incoming: "60 в пути, 22 марта",
  },
  {
    sku: "БР-0450",
    name: "Брус сухой 100×100",
    place: "Склад А · площадка",
    stock: 140,
    reorder: 60,
    max: 300,
    unit: "штук",
  },
  {
    sku: "СМ-3390",
    name: "Саморезы 4×50, короб",
    place: "Склад Б · полка 2",
    stock: 9,
    reorder: 25,
    max: 120,
    unit: "коробов",
  },
  {
    sku: "ЛК-7712",
    name: "Лак матовый, 10 л",
    place: "Склад Б · химия",
    stock: 64,
    reorder: 20,
    max: 100,
    unit: "канистр",
  },
  {
    sku: "УТ-0088",
    name: "Утеплитель рулонный",
    place: "Склад В · ангар",
    stock: 32,
    reorder: 30,
    max: 150,
    unit: "рулонов",
  },
]

/**
 * Экран инвентаря: остатки с отметкой точки заказа внутри полосы, отбор
 * позиций чекбоксами и липкая панель заказа. Один файл, ноль зависимостей,
 * клиентского JS нет.
 */
export function Dashboard039({
  title = "Остатки на складах",
  hint = "Обновлено 5 минут назад · 128 позиций",
  items = DEFAULT_ITEMS,
  orderLabel = "Заказать у поставщика",
  lowLabel = "ниже точки заказа",
  accent,
  className,
  style,
}: Dashboard039Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-039-accent": accent } : null),
    ...style,
  } as CSSProperties

  const low = items.filter((item) => item.stock < item.reorder)

  return (
    <>
      <style href="vibeui-dashboard-039" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-039"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="hint">{hint}</p>
            <p data-part="alarm">
              {low.length} {lowLabel}
            </p>
          </div>

          <div data-part="scroll">
            <table>
              <caption hidden>{title}</caption>
              <thead>
                <tr>
                  <th scope="col">
                    <span hidden>Отбор</span>
                  </th>
                  <th scope="col">Позиция</th>
                  <th scope="col" data-num="">
                    Остаток
                  </th>
                  <th scope="col">Запас и точка заказа</th>
                  <th scope="col">Состояние</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const isLow = item.stock < item.reorder
                  const width = Math.min(100, (item.stock / item.max) * 100)
                  const mark = Math.min(100, (item.reorder / item.max) * 100)

                  return (
                    <tr key={item.sku} data-low={isLow ? "yes" : "no"}>
                      <td>
                        <input
                          type="checkbox"
                          defaultChecked={isLow}
                          aria-label={`Добавить ${item.name} в заказ`}
                        />
                      </td>
                      <td>
                        <span data-part="name">{item.name}</span>
                        <span data-part="sku">
                          {item.sku} · {item.place}
                        </span>
                      </td>
                      <td data-num="">
                        {item.stock} {item.unit}
                      </td>
                      <td>
                        <span data-part="gauge">
                          <span
                            data-part="fill"
                            style={{ width: `${width}%` }}
                          />
                          <span
                            data-part="mark"
                            style={{ left: `${mark}%` }}
                            title={`Точка заказа: ${item.reorder}`}
                          />
                        </span>
                        <span data-part="under">
                          точка заказа {item.reorder} · максимум {item.max}
                          {item.incoming ? ` · ${item.incoming}` : ""}
                        </span>
                      </td>
                      <td>
                        <span data-part="state">
                          {isLow ? `! ${lowLabel}` : "запас в норме"}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div data-part="bar">
            <p>
              Отмечено позиций: {low.length}. Заказ уйдёт поставщику по
              умолчанию из карточки товара.
            </p>
            <button type="button" data-part="order">
              {orderLabel}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

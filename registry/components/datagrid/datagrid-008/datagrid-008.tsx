"use client"

import { Fragment, useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Datagrid008Row = {
  id: string
  shipment: string
  route: string
  status: string
  eta: string
  details: { term: string; value: string }[]
}

export type Datagrid008Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  rows?: Datagrid008Row[]
  caption?: string
  single?: boolean
  accent?: string
}

// Идея компонента: подробности живут в строке под своей строкой, а не в
// диалоге — сравнивать две записи проще, когда обе остаются на месте.
// Кнопка раскрытия несёт aria-expanded и aria-controls на id строки-деталей,
// поэтому связь «кнопка → панель» есть и без зрения. Режим single держит
// открытой одну строку: иначе таблица на десяти раскрытых записях
// перестаёт быть таблицей.
const STYLES = `
:where([data-vibeui-block="datagrid-008"]){
--vibeui-datagrid-008-bg:oklch(1 0 0);
--vibeui-datagrid-008-fg:oklch(0.23 0.014 230);
--vibeui-datagrid-008-muted:oklch(0.55 0.014 230);
--vibeui-datagrid-008-border:oklch(0.92 0.006 230);
--vibeui-datagrid-008-head:oklch(0.975 0.003 230);
--vibeui-datagrid-008-panel:oklch(0.98 0.006 230);
--vibeui-datagrid-008-accent:oklch(0.52 0.15 235);
--vibeui-datagrid-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="datagrid-008"]{
box-sizing:border-box;width:100%;max-width:52rem;margin:0 auto;
background:var(--vibeui-datagrid-008-bg);color:var(--vibeui-datagrid-008-fg);
border:1px solid var(--vibeui-datagrid-008-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-008-font);overflow:hidden;
}
[data-vibeui-block="datagrid-008"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-008"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.5rem;
padding:0.875rem;border-bottom:1px solid var(--vibeui-datagrid-008-border);
}
[data-vibeui-block="datagrid-008"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="datagrid-008"] [data-part="hint"]{
margin:0 0 0 auto;font-size:0.75rem;color:var(--vibeui-datagrid-008-muted);
}
[data-vibeui-block="datagrid-008"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-008"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-008-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-008"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-008"] caption{
padding:0 0.875rem 0.625rem;text-align:left;
font-size:0.75rem;color:var(--vibeui-datagrid-008-muted);
}
[data-vibeui-block="datagrid-008"] th,
[data-vibeui-block="datagrid-008"] td{
padding:0.4375rem 0.875rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-datagrid-008-border);
}
[data-vibeui-block="datagrid-008"] thead th{background:var(--vibeui-datagrid-008-head);font-weight:600}
[data-vibeui-block="datagrid-008"] [data-part="pick"]{width:2.5rem;padding:0}
[data-vibeui-block="datagrid-008"] [data-part="toggle"]{
display:flex;align-items:center;justify-content:center;
width:100%;height:2rem;
appearance:none;border:0;background:none;cursor:pointer;color:inherit;font:inherit;
}
[data-vibeui-block="datagrid-008"] [data-part="toggle"]:focus-visible{outline:2px solid var(--vibeui-datagrid-008-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-008"] [data-part="caret"]{
font-size:0.625rem;color:var(--vibeui-datagrid-008-accent);
transition:transform .16s ease;
}
[data-vibeui-block="datagrid-008"] [data-part="toggle"][aria-expanded="true"] [data-part="caret"]{transform:rotate(90deg)}
[data-vibeui-block="datagrid-008"] tr[data-open="true"] > *{background:var(--vibeui-datagrid-008-panel)}
[data-vibeui-block="datagrid-008"] [data-part="detail-cell"]{padding:0;background:var(--vibeui-datagrid-008-panel)}
[data-vibeui-block="datagrid-008"] [data-part="detail"]{
display:flex;flex-wrap:wrap;gap:1rem;align-items:flex-start;
padding:0.875rem 0.875rem 0.875rem 3.375rem;
opacity:1;transition:opacity .18s ease;
}
@starting-style{[data-vibeui-block="datagrid-008"] [data-part="detail"]{opacity:0}}
[data-vibeui-block="datagrid-008"] dl{
display:grid;grid-template-columns:auto auto;gap:0.25rem 1rem;margin:0;
}
/* display:contents на обёртке пары: без неё div становится элементом
   сетки и колонки «термин / значение» разъезжаются. */
[data-vibeui-block="datagrid-008"] dl > div{display:contents}
[data-vibeui-block="datagrid-008"] dt{font-size:0.75rem;color:var(--vibeui-datagrid-008-muted)}
[data-vibeui-block="datagrid-008"] dd{margin:0;font-size:0.75rem;font-weight:550}
[data-vibeui-block="datagrid-008"] [data-part="detail-actions"]{
display:flex;gap:0.375rem;margin-inline-start:auto;
}
[data-vibeui-block="datagrid-008"] [data-part="detail-actions"] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;
padding:0.3125rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-datagrid-008-border);
background:var(--vibeui-datagrid-008-bg);color:var(--vibeui-datagrid-008-fg);
}
[data-vibeui-block="datagrid-008"] [data-part="detail-actions"] button:focus-visible{outline:2px solid var(--vibeui-datagrid-008-accent);outline-offset:2px}
[data-vibeui-block="datagrid-008"] [data-part="route"]{color:var(--vibeui-datagrid-008-muted)}
[data-vibeui-block="datagrid-008"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Datagrid008Row[] = [
  {
    id: "SH-4410",
    shipment: "Партия 4410",
    route: "Москва → Казань",
    status: "В пути",
    eta: "14 марта",
    details: [
      { term: "Перевозчик", value: "Ирбис-Логистика" },
      { term: "Мест", value: "18 паллет" },
      { term: "Вес", value: "4 240 кг" },
      { term: "Документы", value: "ТТН, счёт-фактура" },
    ],
  },
  {
    id: "SH-4411",
    shipment: "Партия 4411",
    route: "Москва → Петербург",
    status: "Готовится",
    eta: "16 марта",
    details: [
      { term: "Перевозчик", value: "Северный путь" },
      { term: "Мест", value: "6 паллет" },
      { term: "Вес", value: "1 180 кг" },
      { term: "Документы", value: "Заявка" },
    ],
  },
  {
    id: "SH-4412",
    shipment: "Партия 4412",
    route: "Казань → Екатеринбург",
    status: "Доставлена",
    eta: "9 марта",
    details: [
      { term: "Перевозчик", value: "Ирбис-Логистика" },
      { term: "Мест", value: "11 паллет" },
      { term: "Вес", value: "2 960 кг" },
      { term: "Документы", value: "ТТН, акт приёмки" },
    ],
  },
]

/**
 * Сетка с раскрывающейся строкой-деталями: панель занимает всю ширину под
 * своей строкой, связь объявлена через aria-controls. Один файл.
 */
export function Datagrid008({
  rows = DEFAULT_ROWS,
  caption = "Нажмите на стрелку, чтобы раскрыть подробности партии",
  single = true,
  accent,
  className,
  style,
  ...props
}: Datagrid008Props) {
  const prefix = useId()
  const [open, setOpen] = useState<string[]>([rows[0]?.id ?? ""])

  const toggle = (id: string) =>
    setOpen((current) => {
      if (current.includes(id)) return current.filter((value) => value !== id)
      return single ? [id] : [...current, id]
    })

  const palette = {
    ...(accent ? { "--vibeui-datagrid-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-008" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="datagrid-008"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3 data-part="title">Отгрузки</h3>
          <p data-part="hint">
            {single ? "Открыта одна строка" : "Можно раскрыть несколько"}
          </p>
        </div>
        <div
          data-part="scroll"
          role="region"
          aria-label="Таблица отгрузок, прокручивается вбок"
          tabIndex={0}
        >
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col" data-part="pick">
                  <span aria-hidden="true">·</span>
                </th>
                <th scope="col">Партия</th>
                <th scope="col">Маршрут</th>
                <th scope="col">Статус</th>
                <th scope="col" data-align="end">
                  Прибытие
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const expanded = open.includes(row.id)
                const panel = `${prefix}-${row.id}`

                return (
                  <Fragment key={row.id}>
                    <tr data-open={expanded}>
                      <td data-part="pick">
                        <button
                          type="button"
                          data-part="toggle"
                          aria-expanded={expanded}
                          aria-controls={panel}
                          aria-label={`Подробности: ${row.shipment}`}
                          onClick={() => toggle(row.id)}
                        >
                          <span data-part="caret" aria-hidden="true">
                            ▶
                          </span>
                        </button>
                      </td>
                      <th scope="row">{row.shipment}</th>
                      <td data-part="route">{row.route}</td>
                      <td>{row.status}</td>
                      <td data-align="end">{row.eta}</td>
                    </tr>
                    {expanded ? (
                      <tr>
                        <td colSpan={5} data-part="detail-cell">
                          <div data-part="detail" id={panel}>
                            <dl>
                              {row.details.map((item) => (
                                <div key={item.term}>
                                  <dt>{item.term}</dt>
                                  <dd>{item.value}</dd>
                                </div>
                              ))}
                            </dl>
                            <div data-part="detail-actions">
                              <button type="button">Документы</button>
                              <button type="button">Трек</button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

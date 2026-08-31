"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Datagrid002Row = {
  id: string
  client: string
  plan: string
  seats: number
  amount: number
}

export type Datagrid002Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  rows?: Datagrid002Row[]
  caption?: string
  actionLabel?: string
  accent?: string
}

// Идея компонента: выбор строк живёт вместе с панелью массовых действий.
// Панель не появляется рывком поверх контента, а занимает то же место, что
// и обычная шапка: строки не прыгают. Счётчик выбранного объявлен
// aria-live, флажок шапки знает промежуточное состояние, а сумма по выбору
// считается на лету — ради неё выбор строк обычно и делают.
const STYLES = `
:where([data-vibeui-block="datagrid-002"]){
--vibeui-datagrid-002-bg:oklch(1 0 0);
--vibeui-datagrid-002-fg:oklch(0.23 0.014 275);
--vibeui-datagrid-002-muted:oklch(0.55 0.014 275);
--vibeui-datagrid-002-border:oklch(0.92 0.006 275);
--vibeui-datagrid-002-head:oklch(0.975 0.003 275);
--vibeui-datagrid-002-accent:oklch(0.5 0.17 300);
--vibeui-datagrid-002-accent-soft:oklch(0.5 0.17 300 / 9%);
--vibeui-datagrid-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="datagrid-002"]{
box-sizing:border-box;width:100%;max-width:60rem;margin:0 auto;
background:var(--vibeui-datagrid-002-bg);color:var(--vibeui-datagrid-002-fg);
border:1px solid var(--vibeui-datagrid-002-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-002-font);overflow:hidden;
}
[data-vibeui-block="datagrid-002"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-002"] [data-part="bar"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
min-height:3.25rem;padding:0.625rem 0.875rem;
border-bottom:1px solid var(--vibeui-datagrid-002-border);
transition:background-color .18s ease;
}
[data-vibeui-block="datagrid-002"] [data-part="bar"][data-active="true"]{
background:var(--vibeui-datagrid-002-accent-soft);
}
[data-vibeui-block="datagrid-002"] [data-part="bar-title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="datagrid-002"] [data-part="bar-note"]{
margin:0;font-size:0.75rem;color:var(--vibeui-datagrid-002-muted);
}
[data-vibeui-block="datagrid-002"] [data-part="bar-text"]{margin-inline-end:auto}
[data-vibeui-block="datagrid-002"] [data-part="count"]{
font-size:0.875rem;font-weight:650;color:var(--vibeui-datagrid-002-accent);
}
[data-vibeui-block="datagrid-002"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.375rem}
[data-vibeui-block="datagrid-002"] [data-part="actions"] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:550;
padding:0.375rem 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-datagrid-002-border);
background:var(--vibeui-datagrid-002-bg);color:var(--vibeui-datagrid-002-fg);
}
[data-vibeui-block="datagrid-002"] [data-part="actions"] button[data-tone="primary"]{
border-color:transparent;background:var(--vibeui-datagrid-002-accent);color:oklch(1 0 0);
}
[data-vibeui-block="datagrid-002"] [data-part="actions"] button:focus-visible{
outline:2px solid var(--vibeui-datagrid-002-accent);outline-offset:2px;
}
[data-vibeui-block="datagrid-002"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-002"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-002-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-002"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-002"] caption{
padding:0 0.875rem 0.625rem;text-align:left;
font-size:0.75rem;color:var(--vibeui-datagrid-002-muted);
}
[data-vibeui-block="datagrid-002"] th,
[data-vibeui-block="datagrid-002"] td{
padding:0.5rem 0.875rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-datagrid-002-border);
}
[data-vibeui-block="datagrid-002"] thead th{background:var(--vibeui-datagrid-002-head);font-weight:600}
[data-vibeui-block="datagrid-002"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-002"] [data-part="pick"]{width:2.75rem;padding-right:0}
[data-vibeui-block="datagrid-002"] input[type="checkbox"]{
width:1rem;height:1rem;margin:0;cursor:pointer;accent-color:var(--vibeui-datagrid-002-accent);
}
[data-vibeui-block="datagrid-002"] input[type="checkbox"]:focus-visible{outline:2px solid var(--vibeui-datagrid-002-accent);outline-offset:2px}
/* Выбранная строка помечена и заливкой, и полосой слева: одной заливки
   мало, когда рядом стоит наведённая мышью строка. */
[data-vibeui-block="datagrid-002"] tbody tr[data-selected="true"] td,
[data-vibeui-block="datagrid-002"] tbody tr[data-selected="true"] th{
background:var(--vibeui-datagrid-002-accent-soft);
}
[data-vibeui-block="datagrid-002"] tbody tr[data-selected="true"] [data-part="pick"]{
box-shadow:inset 3px 0 0 var(--vibeui-datagrid-002-accent);
}
[data-vibeui-block="datagrid-002"] [data-part="plan"]{color:var(--vibeui-datagrid-002-muted)}
[data-vibeui-block="datagrid-002"] tfoot td{
font-weight:650;background:var(--vibeui-datagrid-002-head);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Datagrid002Row[] = [
  { id: "c-1", client: "Атлас", plan: "Команда", seats: 24, amount: 96000 },
  { id: "c-2", client: "Берег", plan: "Старт", seats: 5, amount: 12500 },
  { id: "c-3", client: "Ветка", plan: "Команда", seats: 18, amount: 72000 },
  { id: "c-4", client: "Гранат", plan: "Бизнес", seats: 60, amount: 310000 },
  { id: "c-5", client: "Дельта", plan: "Старт", seats: 3, amount: 7500 },
  { id: "c-6", client: "Ёлка", plan: "Команда", seats: 12, amount: 48000 },
]

/**
 * Сетка с выбором строк и панелью массовых действий: счётчик, сумма
 * по выбору и промежуточное состояние флажка шапки. Один файл.
 */
export function Datagrid002({
  rows = DEFAULT_ROWS,
  caption = "Отметьте строки, чтобы шапка превратилась в панель действий",
  actionLabel = "Выставить счёт",
  accent,
  className,
  style,
  ...props
}: Datagrid002Props) {
  const [selected, setSelected] = useState<string[]>(["c-3"])

  const all = rows.length > 0 && selected.length === rows.length
  const some = selected.length > 0 && !all
  const total = rows
    .filter((row) => selected.includes(row.id))
    .reduce((sum, row) => sum + row.amount, 0)

  const toggleRow = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    )

  const palette = {
    ...(accent ? { "--vibeui-datagrid-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="datagrid-002"
        className={className}
        style={palette}
      >
        <div data-part="bar" data-active={selected.length > 0}>
          <div data-part="bar-text">
            {selected.length > 0 ? (
              <p data-part="count" aria-live="polite">
                Выбрано {selected.length} из {rows.length} ·{" "}
                {total.toLocaleString("ru-RU")} ₽
              </p>
            ) : (
              <>
                <h3 data-part="bar-title">Договоры на продление</h3>
                <p data-part="bar-note">{rows.length} клиентов</p>
              </>
            )}
          </div>
          {selected.length > 0 ? (
            <div data-part="actions">
              <button type="button" data-tone="primary">
                {actionLabel}
              </button>
              <button type="button">Экспорт CSV</button>
              <button type="button" onClick={() => setSelected([])}>
                Снять выделение
              </button>
            </div>
          ) : null}
        </div>
        <div
          data-part="scroll"
          role="region"
          aria-label="Таблица договоров, прокручивается вбок"
          tabIndex={0}
        >
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col" data-part="pick">
                  <input
                    type="checkbox"
                    checked={all}
                    aria-label="Выбрать все строки"
                    ref={(node) => {
                      if (node) node.indeterminate = some
                    }}
                    onChange={() =>
                      setSelected(all ? [] : rows.map((row) => row.id))
                    }
                  />
                </th>
                <th scope="col">Клиент</th>
                <th scope="col">Тариф</th>
                <th scope="col" data-align="end">
                  Места
                </th>
                <th scope="col" data-align="end">
                  Сумма
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const checked = selected.includes(row.id)

                return (
                  <tr key={row.id} data-selected={checked}>
                    <td data-part="pick">
                      <input
                        type="checkbox"
                        checked={checked}
                        aria-label={`Выбрать ${row.client}`}
                        onChange={() => toggleRow(row.id)}
                      />
                    </td>
                    <th scope="row">{row.client}</th>
                    <td data-part="plan">{row.plan}</td>
                    <td data-align="end">{row.seats}</td>
                    <td data-align="end">
                      {row.amount.toLocaleString("ru-RU")} ₽
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4}>Итого по выбранным</td>
                <td data-align="end">{total.toLocaleString("ru-RU")} ₽</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </>
  )
}

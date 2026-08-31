"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Datagrid021Row = {
  id: string
  position: string
  unit: string
  quantity: number
  price: number
}

export type Datagrid021Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  rows?: Datagrid021Row[]
  caption?: string
  editLabel?: string
  accent?: string
}

// Идея компонента: правка идёт не по одной ячейке, а пачкой. Режим правки
// превращает все числовые ячейки в поля разом, черновик копится отдельно
// от базовых строк, а журнал изменений показывает пары «было → стало» с
// точечной отменой. Общее «Сохранить» переносит черновик в базу, общее
// «Отменить» выбрасывает его целиком — по одной ячейке ничего не уезжает.
const STYLES = `
:where([data-vibeui-block="datagrid-021"]){
--vibeui-datagrid-021-bg:oklch(1 0 0);
--vibeui-datagrid-021-fg:oklch(0.23 0.014 285);
--vibeui-datagrid-021-muted:oklch(0.55 0.014 285);
--vibeui-datagrid-021-border:oklch(0.92 0.006 285);
--vibeui-datagrid-021-head:oklch(0.975 0.003 285);
--vibeui-datagrid-021-accent:oklch(0.5 0.15 250);
--vibeui-datagrid-021-dirty:oklch(0.96 0.05 95);
--vibeui-datagrid-021-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="datagrid-021"]{
box-sizing:border-box;width:100%;max-width:52rem;margin:0 auto;
background:var(--vibeui-datagrid-021-bg);color:var(--vibeui-datagrid-021-fg);
border:1px solid var(--vibeui-datagrid-021-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-021-font);overflow:hidden;
}
[data-vibeui-block="datagrid-021"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-021"] [data-part="bar"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;min-height:3rem;
padding:0.625rem 0.875rem;border-bottom:1px solid var(--vibeui-datagrid-021-border);
}
[data-vibeui-block="datagrid-021"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="datagrid-021"] [data-part="count"]{margin:0;font-size:0.75rem;color:var(--vibeui-datagrid-021-muted)}
[data-vibeui-block="datagrid-021"] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:600;
padding:0.375rem 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-datagrid-021-border);
background:var(--vibeui-datagrid-021-bg);color:var(--vibeui-datagrid-021-fg);
}
[data-vibeui-block="datagrid-021"] [data-part="primary"]{border-color:transparent;background:var(--vibeui-datagrid-021-accent);color:oklch(1 0 0)}
[data-vibeui-block="datagrid-021"] button:disabled{opacity:.4;cursor:not-allowed}
[data-vibeui-block="datagrid-021"] button:focus-visible{outline:2px solid var(--vibeui-datagrid-021-accent);outline-offset:2px}
[data-vibeui-block="datagrid-021"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-021"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-021-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-021"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-021"] caption{
padding:0.625rem 0.875rem;text-align:left;font-size:0.75rem;color:var(--vibeui-datagrid-021-muted);caption-side:top;
}
[data-vibeui-block="datagrid-021"] th,
[data-vibeui-block="datagrid-021"] td{
padding:0.375rem 0.875rem;text-align:left;white-space:nowrap;height:2.375rem;
border-top:1px solid var(--vibeui-datagrid-021-border);
}
[data-vibeui-block="datagrid-021"] thead th{background:var(--vibeui-datagrid-021-head);font-weight:600}
[data-vibeui-block="datagrid-021"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-021"] [data-part="input"]{
width:6rem;font:inherit;font-size:0.8125rem;text-align:right;color:inherit;
padding:0.1875rem 0.375rem;border-radius:0.375rem;
border:1px solid var(--vibeui-datagrid-021-border);background:var(--vibeui-datagrid-021-bg);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="datagrid-021"] [data-part="input"]:focus-visible{outline:2px solid var(--vibeui-datagrid-021-accent);outline-offset:1px}
[data-vibeui-block="datagrid-021"] td[data-changed="true"]{background:var(--vibeui-datagrid-021-dirty)}
[data-vibeui-block="datagrid-021"] td[data-changed="true"] [data-part="input"]{border-color:oklch(0.62 0.14 85)}
[data-vibeui-block="datagrid-021"] [data-part="log"]{
margin:0;padding:0.625rem 0.875rem 0.75rem;border-top:1px solid var(--vibeui-datagrid-021-border);
background:oklch(0.985 0.004 285);font-size:0.75rem;
}
[data-vibeui-block="datagrid-021"] [data-part="log"] h4{margin:0 0 0.375rem;font-size:0.6875rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:var(--vibeui-datagrid-021-muted)}
[data-vibeui-block="datagrid-021"] [data-part="entry"]{
display:flex;align-items:center;gap:0.5rem;padding:0.1875rem 0;
}
[data-vibeui-block="datagrid-021"] [data-part="entry"] span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis}
[data-vibeui-block="datagrid-021"] [data-part="was"]{color:var(--vibeui-datagrid-021-muted);text-decoration:line-through;flex:none!important}
[data-vibeui-block="datagrid-021"] [data-part="now"]{font-weight:650;flex:none!important}
[data-vibeui-block="datagrid-021"] [data-part="undo"]{
padding:0.125rem 0.4375rem;font-size:0.6875rem;font-weight:550;border-radius:0.375rem;flex:none;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-021"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Datagrid021Row[] = [
  {
    id: "p1",
    position: "Профиль алюминиевый",
    unit: "м",
    quantity: 240,
    price: 410,
  },
  {
    id: "p2",
    position: "Уплотнитель EPDM",
    unit: "м",
    quantity: 180,
    price: 95,
  },
  {
    id: "p3",
    position: "Стеклопакет 4-16-4",
    unit: "м²",
    quantity: 62,
    price: 3400,
  },
  {
    id: "p4",
    position: "Фурнитура поворотная",
    unit: "компл.",
    quantity: 48,
    price: 1750,
  },
  {
    id: "p5",
    position: "Монтажная пена",
    unit: "балл.",
    quantity: 90,
    price: 380,
  },
]

type Draft = Record<string, number>

const FIELDS = [
  { key: "quantity" as const, label: "Количество" },
  { key: "price" as const, label: "Цена" },
]

/**
 * Сетка с пакетной правкой: все числовые ячейки редактируются разом,
 * журнал показывает «было → стало» с точечной отменой. Один файл.
 */
export function Datagrid021({
  rows = DEFAULT_ROWS,
  caption = "Правки копятся в черновике и уезжают одним сохранением",
  editLabel = "Режим правки",
  accent,
  className,
  style,
  ...props
}: Datagrid021Props) {
  const [base, setBase] = useState(rows)
  const [draft, setDraft] = useState<Draft>({})
  const [editing, setEditing] = useState(true)

  const entries = Object.entries(draft)

  const palette = {
    ...(accent ? { "--vibeui-datagrid-021-accent": accent } : null),
    ...style,
  } as CSSProperties

  function valueOf(row: Datagrid021Row, key: "quantity" | "price") {
    const cell = `${row.id}:${key}`

    return draft[cell] ?? row[key]
  }

  return (
    <>
      <style href="vibeui-datagrid-021" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="datagrid-021"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <h3 data-part="title">Спецификация заказа</h3>
          <p data-part="count" role="status" aria-live="polite">
            {entries.length === 0
              ? "Несохранённых правок нет"
              : `Несохранённых правок: ${entries.length}`}
          </p>
          <button
            type="button"
            aria-pressed={editing}
            onClick={() => setEditing((value) => !value)}
          >
            {editLabel}
          </button>
          <button
            type="button"
            disabled={entries.length === 0}
            onClick={() => setDraft({})}
          >
            Отменить всё
          </button>
          <button
            type="button"
            data-part="primary"
            disabled={entries.length === 0}
            onClick={() => {
              setBase((current) =>
                current.map((row) => ({
                  ...row,
                  quantity: valueOf(row, "quantity"),
                  price: valueOf(row, "price"),
                })),
              )
              setDraft({})
            }}
          >
            Сохранить всё
          </button>
        </div>
        <div
          data-part="scroll"
          role="region"
          aria-label="Таблица спецификации, прокручивается вбок"
          tabIndex={0}
        >
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col">Позиция</th>
                <th scope="col">Ед.</th>
                {FIELDS.map((field) => (
                  <th key={field.key} scope="col" data-align="end">
                    {field.label}
                  </th>
                ))}
                <th scope="col" data-align="end">
                  Стоимость, ₽
                </th>
              </tr>
            </thead>
            <tbody>
              {base.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.position}</th>
                  <td>{row.unit}</td>
                  {FIELDS.map((field) => {
                    const cell = `${row.id}:${field.key}`
                    const changed = draft[cell] !== undefined

                    return (
                      <td
                        key={field.key}
                        data-align="end"
                        data-changed={changed ? "true" : undefined}
                      >
                        {editing ? (
                          <input
                            data-part="input"
                            type="number"
                            min={0}
                            value={valueOf(row, field.key)}
                            aria-label={`${field.label}, ${row.position}`}
                            onChange={(event) => {
                              const next = Number(event.target.value)

                              setDraft((current) => {
                                const copy = { ...current }

                                if (
                                  Number.isNaN(next) ||
                                  next === row[field.key]
                                ) {
                                  delete copy[cell]
                                } else {
                                  copy[cell] = next
                                }

                                return copy
                              })
                            }}
                          />
                        ) : (
                          valueOf(row, field.key).toLocaleString("ru-RU")
                        )}
                      </td>
                    )
                  })}
                  <td data-align="end">
                    {(
                      valueOf(row, "quantity") * valueOf(row, "price")
                    ).toLocaleString("ru-RU")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {entries.length > 0 ? (
          <div data-part="log">
            <h4>Журнал правок</h4>
            {entries.map(([cell, next]) => {
              const [rowId, key] = cell.split(":")
              const row = base.find((item) => item.id === rowId)
              const field = FIELDS.find((item) => item.key === key)

              if (!row || !field) {
                return null
              }

              return (
                <p key={cell} data-part="entry">
                  <span>
                    {row.position} · {field.label}
                  </span>
                  <span data-part="was">
                    {row[field.key].toLocaleString("ru-RU")}
                  </span>
                  <span aria-hidden="true">→</span>
                  <span data-part="now">{next.toLocaleString("ru-RU")}</span>
                  <button
                    type="button"
                    data-part="undo"
                    aria-label={`Отменить правку «${field.label}» в позиции «${row.position}»`}
                    onClick={() =>
                      setDraft((current) => {
                        const copy = { ...current }
                        delete copy[cell]

                        return copy
                      })
                    }
                  >
                    Вернуть
                  </button>
                </p>
              )
            })}
          </div>
        ) : null}
      </section>
    </>
  )
}

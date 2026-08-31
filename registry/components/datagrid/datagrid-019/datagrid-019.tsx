"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Datagrid019Row = {
  id: string
  name: string
  region: string
  revenue: number
  overdue: number
}

export type Datagrid019Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  rows?: Datagrid019Row[]
  caption?: string
  joiner?: "and" | "or"
  accent?: string
}

// Идея компонента: фильтр собирается из условий, а не выбирается из
// готового списка. Каждое условие — поле, оператор и значение; связка
// «и/или» одна на весь набор и стоит между строками условий, чтобы её
// нельзя было прочитать как часть соседнего условия. Набор живёт внутри
// fieldset с legend: для скринридера это одна группа, а не россыпь полей.
const STYLES = `
:where([data-vibeui-block="datagrid-019"]){
--vibeui-datagrid-019-bg:oklch(1 0 0);
--vibeui-datagrid-019-fg:oklch(0.23 0.014 285);
--vibeui-datagrid-019-muted:oklch(0.55 0.014 285);
--vibeui-datagrid-019-border:oklch(0.92 0.006 285);
--vibeui-datagrid-019-head:oklch(0.975 0.003 285);
--vibeui-datagrid-019-accent:oklch(0.5 0.14 230);
--vibeui-datagrid-019-panel:oklch(0.985 0.004 285);
--vibeui-datagrid-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="datagrid-019"]{
box-sizing:border-box;width:100%;max-width:52rem;margin:0 auto;
background:var(--vibeui-datagrid-019-bg);color:var(--vibeui-datagrid-019-fg);
border:1px solid var(--vibeui-datagrid-019-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-019-font);overflow:hidden;
}
[data-vibeui-block="datagrid-019"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-019"] [data-part="builder"]{
border:0;margin:0;padding:0.75rem 0.875rem;background:var(--vibeui-datagrid-019-panel);
border-bottom:1px solid var(--vibeui-datagrid-019-border);
}
[data-vibeui-block="datagrid-019"] [data-part="builder"] legend{
padding:0;font-size:0.6875rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-datagrid-019-muted);float:left;width:100%;
}
/* legend с float:left увёл бы следующие flex-строки в обтекание. */
[data-vibeui-block="datagrid-019"] [data-part="rule"]{clear:both;display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;margin-top:0.5rem}
[data-vibeui-block="datagrid-019"] [data-part="joiner"]{
clear:both;display:flex;align-items:center;gap:0.375rem;margin-top:0.5rem;
font-size:0.6875rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:var(--vibeui-datagrid-019-accent);
}
[data-vibeui-block="datagrid-019"] [data-part="joiner"]::after{content:"";flex:1;height:1px;background:var(--vibeui-datagrid-019-border)}
[data-vibeui-block="datagrid-019"] select,
[data-vibeui-block="datagrid-019"] [data-part="value"]{
font:inherit;font-size:0.75rem;color:inherit;padding:0.3125rem 0.5rem;
border:1px solid var(--vibeui-datagrid-019-border);border-radius:0.4375rem;
background:var(--vibeui-datagrid-019-bg);
}
[data-vibeui-block="datagrid-019"] [data-part="value"]{width:8rem;min-width:0}
[data-vibeui-block="datagrid-019"] select:focus-visible,
[data-vibeui-block="datagrid-019"] [data-part="value"]:focus-visible{outline:2px solid var(--vibeui-datagrid-019-accent);outline-offset:1px}
[data-vibeui-block="datagrid-019"] [data-part="drop"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;line-height:1;
width:1.75rem;height:1.75rem;border-radius:0.4375rem;
border:1px solid var(--vibeui-datagrid-019-border);
background:var(--vibeui-datagrid-019-bg);color:var(--vibeui-datagrid-019-muted);
}
[data-vibeui-block="datagrid-019"] [data-part="drop"]:hover{color:oklch(0.55 0.17 28);border-color:oklch(0.55 0.17 28)}
[data-vibeui-block="datagrid-019"] [data-part="drop"]:focus-visible{outline:2px solid var(--vibeui-datagrid-019-accent);outline-offset:2px}
[data-vibeui-block="datagrid-019"] [data-part="add"]{
clear:both;appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:600;
margin-top:0.625rem;padding:0.3125rem 0.625rem;border-radius:0.4375rem;
border:1px dashed var(--vibeui-datagrid-019-accent);background:transparent;color:var(--vibeui-datagrid-019-accent);
}
[data-vibeui-block="datagrid-019"] [data-part="add"]:disabled{opacity:.45;cursor:not-allowed}
[data-vibeui-block="datagrid-019"] [data-part="add"]:focus-visible{outline:2px solid var(--vibeui-datagrid-019-accent);outline-offset:2px}
[data-vibeui-block="datagrid-019"] [data-part="summary"]{
clear:both;margin:0.625rem 0 0;font-size:0.75rem;color:var(--vibeui-datagrid-019-muted);
}
[data-vibeui-block="datagrid-019"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-019"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-019-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-019"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-019"] caption{
padding:0.625rem 0.875rem;text-align:left;font-size:0.75rem;color:var(--vibeui-datagrid-019-muted);caption-side:top;
}
[data-vibeui-block="datagrid-019"] th,
[data-vibeui-block="datagrid-019"] td{
padding:0.5rem 0.875rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-datagrid-019-border);
}
[data-vibeui-block="datagrid-019"] thead th{background:var(--vibeui-datagrid-019-head);font-weight:600}
[data-vibeui-block="datagrid-019"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-019"] [data-late="true"]{color:oklch(0.55 0.17 28);font-weight:600}
[data-vibeui-block="datagrid-019"] [data-part="none"]{padding:1.5rem 0.875rem;text-align:center;color:var(--vibeui-datagrid-019-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-019"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Datagrid019Row[] = [
  {
    id: "a1",
    name: "Артель «Кама»",
    region: "Приволжье",
    revenue: 12400,
    overdue: 0,
  },
  {
    id: "a2",
    name: "Северный Порт",
    region: "Северо-Запад",
    revenue: 30100,
    overdue: 12,
  },
  {
    id: "a3",
    name: "Гранд-Сервис",
    region: "Центр",
    revenue: 4300,
    overdue: 41,
  },
  { id: "a4", name: "Мостовик", region: "Урал", revenue: 18700, overdue: 3 },
  {
    id: "a5",
    name: "Ювенко Логистика",
    region: "Центр",
    revenue: 8600,
    overdue: 0,
  },
  {
    id: "a6",
    name: "Дельта-Строй",
    region: "Урал",
    revenue: 26500,
    overdue: 27,
  },
]

const FIELDS = [
  { key: "name", label: "Название", numeric: false },
  { key: "region", label: "Регион", numeric: false },
  { key: "revenue", label: "Выручка, тыс.", numeric: true },
  { key: "overdue", label: "Просрочка, дн.", numeric: true },
] as const

const TEXT_OPS = [
  { key: "contains", label: "содержит" },
  { key: "equals", label: "равно" },
  { key: "starts", label: "начинается с" },
] as const

const NUMBER_OPS = [
  { key: "gt", label: "больше" },
  { key: "lt", label: "меньше" },
  { key: "eq", label: "равно" },
] as const

type Rule = {
  id: number
  field: (typeof FIELDS)[number]["key"]
  operator: string
  value: string
}

function test(row: Datagrid019Row, rule: Rule) {
  const field = FIELDS.find((item) => item.key === rule.field)

  if (!field) {
    return true
  }

  if (field.numeric) {
    const left = Number(row[rule.field as "revenue" | "overdue"])
    const right = Number(rule.value)

    if (Number.isNaN(right)) {
      return true
    }

    if (rule.operator === "gt") {
      return left > right
    }

    if (rule.operator === "lt") {
      return left < right
    }

    return left === right
  }

  const left = String(row[rule.field as "name" | "region"]).toLowerCase()
  const right = rule.value.trim().toLowerCase()

  if (right === "") {
    return true
  }

  if (rule.operator === "equals") {
    return left === right
  }

  if (rule.operator === "starts") {
    return left.startsWith(right)
  }

  return left.includes(right)
}

/**
 * Сетка с конструктором условий: поле, оператор и значение в каждой
 * строке, одна связка «и/или» на весь набор. Один файл, ноль зависимостей.
 */
export function Datagrid019({
  rows = DEFAULT_ROWS,
  caption = "Строки отбираются набором условий из конструктора",
  joiner = "and",
  accent,
  className,
  style,
  ...props
}: Datagrid019Props) {
  const [join, setJoin] = useState<"and" | "or">(joiner)
  const [rules, setRules] = useState<Rule[]>([
    { id: 1, field: "region", operator: "contains", value: "Урал" },
    { id: 2, field: "overdue", operator: "gt", value: "10" },
  ])

  const filtered = rows.filter((row) => {
    if (rules.length === 0) {
      return true
    }

    return join === "and"
      ? rules.every((rule) => test(row, rule))
      : rules.some((rule) => test(row, rule))
  })

  const palette = {
    ...(accent ? { "--vibeui-datagrid-019-accent": accent } : null),
    ...style,
  } as CSSProperties

  function patch(id: number, change: Partial<Rule>) {
    setRules((current) =>
      current.map((rule) => (rule.id === id ? { ...rule, ...change } : rule)),
    )
  }

  return (
    <>
      <style href="vibeui-datagrid-019" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="datagrid-019"
        className={className}
        style={palette}
      >
        <fieldset data-part="builder">
          <legend>Условия отбора</legend>
          {rules.map((rule, index) => {
            const field = FIELDS.find((item) => item.key === rule.field)
            const operators = field?.numeric ? NUMBER_OPS : TEXT_OPS

            return (
              <div key={rule.id}>
                {index > 0 ? (
                  <p data-part="joiner">
                    {join === "and" ? "и" : "или"}
                    <span hidden>связка условий</span>
                  </p>
                ) : null}
                <div data-part="rule">
                  <select
                    value={rule.field}
                    aria-label={`Поле условия ${index + 1}`}
                    onChange={(event) => {
                      const next = FIELDS.find(
                        (item) => item.key === event.target.value,
                      )

                      patch(rule.id, {
                        field: event.target.value as Rule["field"],
                        operator: next?.numeric ? "gt" : "contains",
                        value: "",
                      })
                    }}
                  >
                    {FIELDS.map((item) => (
                      <option key={item.key} value={item.key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={rule.operator}
                    aria-label={`Оператор условия ${index + 1}`}
                    onChange={(event) =>
                      patch(rule.id, { operator: event.target.value })
                    }
                  >
                    {operators.map((item) => (
                      <option key={item.key} value={item.key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <input
                    data-part="value"
                    type={field?.numeric ? "number" : "text"}
                    value={rule.value}
                    aria-label={`Значение условия ${index + 1}`}
                    onChange={(event) =>
                      patch(rule.id, { value: event.target.value })
                    }
                  />
                  <button
                    type="button"
                    data-part="drop"
                    aria-label={`Удалить условие ${index + 1}`}
                    onClick={() =>
                      setRules((current) =>
                        current.filter((item) => item.id !== rule.id),
                      )
                    }
                  >
                    ×
                  </button>
                  {index === 0 ? (
                    <select
                      value={join}
                      aria-label="Связка между условиями"
                      onChange={(event) =>
                        setJoin(event.target.value as "and" | "or")
                      }
                    >
                      <option value="and">все условия (и)</option>
                      <option value="or">любое условие (или)</option>
                    </select>
                  ) : null}
                </div>
              </div>
            )
          })}
          <button
            type="button"
            data-part="add"
            disabled={rules.length >= 4}
            onClick={() =>
              setRules((current) => [
                ...current,
                {
                  id: Math.max(0, ...current.map((rule) => rule.id)) + 1,
                  field: "name",
                  operator: "contains",
                  value: "",
                },
              ])
            }
          >
            + Добавить условие
          </button>
          <p data-part="summary" role="status" aria-live="polite">
            Подошло строк: {filtered.length} из {rows.length}
          </p>
        </fieldset>
        <div
          data-part="scroll"
          role="region"
          aria-label="Таблица контрагентов, прокручивается вбок"
          tabIndex={0}
        >
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col">Контрагент</th>
                <th scope="col">Регион</th>
                <th scope="col" data-align="end">
                  Выручка, тыс. ₽
                </th>
                <th scope="col" data-align="end">
                  Просрочка, дн.
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.name}</th>
                  <td>{row.region}</td>
                  <td data-align="end">
                    {row.revenue.toLocaleString("ru-RU")}
                  </td>
                  <td
                    data-align="end"
                    data-late={row.overdue > 0 ? "true" : undefined}
                  >
                    {row.overdue}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} data-part="none">
                    Набор условий не пропустил ни одной строки
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

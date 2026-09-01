"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Filters001Rule = {
  id: string
  field: string
  operator: string
  value: string
}

export type Filters001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  fields?: string[]
  operators?: string[]
  rules?: Filters001Rule[]
  found?: string
  onChange?: (rules: Filters001Rule[]) => void
  accent?: string
}

// Идея компонента: строитель условий вместо набора отдельных полей. Условие —
// это тройка «поле, оператор, значение», и она собрана из нативных select и
// input, поэтому клавиатура и мобильный выбор работают сами. Связка между
// условиями показана словом «и» между строками, а не подразумевается: без неё
// набор фильтров читается как «или» ровно так же часто, как «и». Удаление
// строки — кнопка с именем условия, чтобы не пришлось считать строки на слух.
const STYLES = `
:where([data-vibeui-block="filters-001"]){
--vibeui-filters-001-bg:oklch(1 0 0);
--vibeui-filters-001-fg:oklch(0.24 0.014 265);
--vibeui-filters-001-muted:oklch(0.56 0.014 265);
--vibeui-filters-001-border:oklch(0.9 0.006 265);
--vibeui-filters-001-hover:oklch(0.55 0.02 265 / 8%);
--vibeui-filters-001-accent:oklch(0.55 0.2 262);
--vibeui-filters-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="filters-001"]{
width:100%;max-width:34rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-filters-001-bg);
border:1px solid var(--vibeui-filters-001-border);border-radius:0.875rem;
font-family:var(--vibeui-filters-001-font);color:var(--vibeui-filters-001-fg);
}
[data-vibeui-block="filters-001"] *{box-sizing:border-box}
[data-vibeui-block="filters-001"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;margin-bottom:0.625rem;
}
[data-vibeui-block="filters-001"] h3{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="filters-001"] [data-part="found"]{
margin:0;font-size:0.75rem;color:var(--vibeui-filters-001-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="filters-001"] [data-part="rule"]{
display:grid;grid-template-columns:auto 1fr 1fr 1fr auto;align-items:center;gap:0.375rem;
margin-bottom:0.375rem;
}
/* Связка словом: без неё набор условий читается как «или» так же часто. */
[data-vibeui-block="filters-001"] [data-part="join"]{
width:1.75rem;font-size:0.6875rem;color:var(--vibeui-filters-001-muted);text-align:right;
}
[data-vibeui-block="filters-001"] select,
[data-vibeui-block="filters-001"] input{
min-width:0;width:100%;height:2rem;padding:0 0.5rem;
background:var(--vibeui-filters-001-bg);color:inherit;
border:1px solid var(--vibeui-filters-001-border);border-radius:0.5rem;
font:inherit;font-size:0.75rem;
}
[data-vibeui-block="filters-001"] select:focus-visible,
[data-vibeui-block="filters-001"] input:focus-visible{outline:2px solid var(--vibeui-filters-001-accent);outline-offset:1px}
[data-vibeui-block="filters-001"] [data-part="drop"]{
appearance:none;border:0;background:none;cursor:pointer;
width:1.75rem;height:1.75rem;border-radius:0.375rem;
color:var(--vibeui-filters-001-muted);font:inherit;font-size:0.875rem;line-height:1;
}
[data-vibeui-block="filters-001"] [data-part="drop"]:hover{background:var(--vibeui-filters-001-hover);color:var(--vibeui-filters-001-fg)}
[data-vibeui-block="filters-001"] [data-part="drop"]:focus-visible{outline:2px solid var(--vibeui-filters-001-accent);outline-offset:1px}
[data-vibeui-block="filters-001"] [data-part="actions"]{display:flex;gap:0.5rem;margin-top:0.625rem}
[data-vibeui-block="filters-001"] [data-part="add"],
[data-vibeui-block="filters-001"] [data-part="clear"]{
appearance:none;cursor:pointer;height:2rem;padding:0 0.75rem;border-radius:0.5rem;
font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="filters-001"] [data-part="add"]{border:0;background:var(--vibeui-filters-001-accent);color:oklch(1 0 0)}
[data-vibeui-block="filters-001"] [data-part="clear"]{
border:1px solid var(--vibeui-filters-001-border);background:none;color:inherit;
}
[data-vibeui-block="filters-001"] [data-part="empty"]{
margin:0;padding:0.75rem 0;font-size:0.8125rem;color:var(--vibeui-filters-001-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="filters-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FIELDS = ["Категория", "Автор", "Установок", "Обновлён"]
const DEFAULT_OPERATORS = ["равно", "не равно", "содержит", "больше", "меньше"]

const DEFAULT_RULES: Filters001Rule[] = [
  { id: "1", field: "Категория", operator: "равно", value: "Формы" },
  { id: "2", field: "Установок", operator: "больше", value: "100" },
]

/**
 * Строитель условий: поле, оператор и значение в строке, связка словом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Filters001({
  fields = DEFAULT_FIELDS,
  operators = DEFAULT_OPERATORS,
  rules = DEFAULT_RULES,
  found = "Найдено 42 из 255",
  onChange,
  accent,
  className,
  style,
  ...props
}: Filters001Props) {
  const [list, setList] = useState(rules)

  const apply = (next: Filters001Rule[]) => {
    setList(next)
    onChange?.(next)
  }

  const patch = (id: string, part: Partial<Filters001Rule>) =>
    apply(list.map((rule) => (rule.id === id ? { ...rule, ...part } : rule)))

  const palette = {
    ...(accent ? { "--vibeui-filters-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-filters-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="filters-001"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3>Условия отбора</h3>
          <p data-part="found" aria-live="polite">
            {found}
          </p>
        </div>

        {list.length === 0 ? (
          <p data-part="empty">
            Условий нет — показаны все записи. Добавьте первое условие.
          </p>
        ) : (
          list.map((rule, index) => (
            <div key={rule.id} data-part="rule">
              <span data-part="join">{index === 0 ? "где" : "и"}</span>
              <select
                value={rule.field}
                aria-label={`Поле условия ${index + 1}`}
                onChange={(event) =>
                  patch(rule.id, { field: event.target.value })
                }
              >
                {fields.map((field) => (
                  <option key={field} value={field}>
                    {field}
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
                {operators.map((operator) => (
                  <option key={operator} value={operator}>
                    {operator}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={rule.value}
                aria-label={`Значение условия ${index + 1}`}
                onChange={(event) =>
                  patch(rule.id, { value: event.target.value })
                }
              />
              <button
                type="button"
                data-part="drop"
                aria-label={`Убрать условие: ${rule.field} ${rule.operator} ${rule.value}`}
                onClick={() =>
                  apply(list.filter((item) => item.id !== rule.id))
                }
              >
                ×
              </button>
            </div>
          ))
        )}

        <div data-part="actions">
          <button
            type="button"
            data-part="add"
            onClick={() =>
              apply([
                ...list,
                {
                  id: String(Date.now()),
                  field: fields[0],
                  operator: operators[0],
                  value: "",
                },
              ])
            }
          >
            Добавить условие
          </button>
          {list.length > 0 ? (
            <button type="button" data-part="clear" onClick={() => apply([])}>
              Очистить
            </button>
          ) : null}
        </div>
      </div>
    </>
  )
}

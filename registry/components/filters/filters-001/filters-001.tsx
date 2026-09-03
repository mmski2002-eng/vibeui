"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Filters001Rule = {
  id: string
  field: string
  operator: string
  value: string
}

export type Filters001Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  fields?: string[]
  operators?: string[]
  rules?: Filters001Rule[]
  found?: string
  onChange?: (rules: Filters001Rule[]) => void
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  labels?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
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
--vibeui-filters-001-bg:transparent;
--vibeui-filters-001-field:light-dark(oklch(1 0 0),oklch(0.26 0.012 265));
--vibeui-filters-001-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.005 265));
--vibeui-filters-001-muted:color-mix(in oklab,var(--vibeui-filters-001-fg) 68%,transparent);
--vibeui-filters-001-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-filters-001-hover:light-dark(oklch(0.55 0.02 265 / 8%),oklch(0.85 0.02 265 / 14%));
--vibeui-filters-001-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-filters-001-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.03 262));
--vibeui-filters-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="filters-001"]{color-scheme:dark}
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
background:var(--vibeui-filters-001-field);color:inherit;
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
[data-vibeui-block="filters-001"] [data-part="add"]{border:0;background:var(--vibeui-filters-001-accent);color:var(--vibeui-filters-001-on-accent)}
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

/** Русский словарь по умолчанию: установленный файл не меняет язык проекта. */
const DEFAULT_LABELS: Record<string, string> = {
  title: "Условия отбора",
  join: "где",
  joinNext: "и",
  empty: "Условий нет — показаны все записи. Добавьте первое условие.",
  add: "Добавить условие",
  clear: "Очистить",
  field: "Поле условия {index}",
  operator: "Оператор условия {index}",
  value: "Значение условия {index}",
  remove: "Убрать условие: {rule}",
}

function label(
  labels: Record<string, string>,
  key: string,
  values?: Record<string, string>,
): string {
  const template = labels[key] ?? DEFAULT_LABELS[key] ?? ""

  if (!values) {
    return template
  }

  return template.replace(
    /\{(\w+)\}/g,
    (match, name: string) => values[name] ?? match,
  )
}

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

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
  labels = DEFAULT_LABELS,
  background = "",
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
    ...(background
      ? {
          "--vibeui-filters-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-filters-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="filters"
        data-vibeui-block="filters-001"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3>{label(labels, "title")}</h3>
          <p data-part="found" aria-live="polite">
            {found}
          </p>
        </div>

        {list.length === 0 ? (
          <p data-part="empty">{label(labels, "empty")}</p>
        ) : (
          list.map((rule, index) => (
            <div key={rule.id} data-part="rule">
              <span data-part="join">
                {label(labels, index === 0 ? "join" : "joinNext")}
              </span>
              <select
                value={rule.field}
                aria-label={label(labels, "field", {
                  index: String(index + 1),
                })}
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
                aria-label={label(labels, "operator", {
                  index: String(index + 1),
                })}
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
                aria-label={label(labels, "value", {
                  index: String(index + 1),
                })}
                onChange={(event) =>
                  patch(rule.id, { value: event.target.value })
                }
              />
              <button
                type="button"
                data-part="drop"
                aria-label={label(labels, "remove", {
                  rule: `${rule.field} ${rule.operator} ${rule.value}`,
                })}
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
            {label(labels, "add")}
          </button>
          {list.length > 0 ? (
            <button type="button" data-part="clear" onClick={() => apply([])}>
              {label(labels, "clear")}
            </button>
          ) : null}
        </div>
      </div>
    </>
  )
}

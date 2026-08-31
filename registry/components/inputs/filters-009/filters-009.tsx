"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Filters009Option = {
  value: string
  count: number
}

export type Filters009Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  title?: string
  options?: Filters009Option[]
  baseCount?: number
  onApply?: (values: string[]) => void
  accent?: string
}

// Идея компонента: фильтры с кнопкой, а не мгновенные. Мгновенное применение
// хорошо на списке из ста строк и мучительно на тяжёлом отчёте: каждый щелчок
// уходит в запрос, а собрать отбор из четырёх условий — это четыре ожидания.
// Здесь щелчки меняют черновик, кнопка сообщает, сколько записей останется, и
// пока черновик отличается от применённого, панель честно говорит об этом.
const STYLES = `
:where([data-vibeui-block="filters-009"]){
--vibeui-filters-009-surface:oklch(1 0 0);
--vibeui-filters-009-fill:oklch(0.975 0.004 265);
--vibeui-filters-009-fg:oklch(0.23 0.014 265);
--vibeui-filters-009-muted:oklch(0.55 0.014 265);
--vibeui-filters-009-border:oklch(0.89 0.008 265);
--vibeui-filters-009-shell:oklch(0.91 0.006 265);
--vibeui-filters-009-accent:oklch(0.5 0.17 145);
--vibeui-filters-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: панель показывают поверх любого фона. */
[data-vibeui-block="filters-009"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:18rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-filters-009-surface);
border:1px solid var(--vibeui-filters-009-shell);border-radius:0.875rem;
font-family:var(--vibeui-filters-009-font);color:var(--vibeui-filters-009-fg);
}
[data-vibeui-block="filters-009"] *{box-sizing:border-box}
[data-vibeui-block="filters-009"] h3{margin:0;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="filters-009"] ul{
display:flex;flex-direction:column;gap:0.0625rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="filters-009"] label{
display:flex;align-items:center;gap:0.5rem;cursor:pointer;
padding:0.3125rem 0.375rem;border-radius:0.4375rem;font-size:0.8125rem;
transition:background-color .16s ease;
}
[data-vibeui-block="filters-009"] label:hover{background:var(--vibeui-filters-009-fill)}
[data-vibeui-block="filters-009"] input{
appearance:none;flex:none;margin:0;cursor:pointer;position:relative;
width:1rem;height:1rem;border-radius:0.3125rem;
border:1.5px solid var(--vibeui-filters-009-border);background:oklch(1 0 0);
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="filters-009"] input:checked{
background:var(--vibeui-filters-009-accent);border-color:var(--vibeui-filters-009-accent);
}
[data-vibeui-block="filters-009"] input:checked::after{
content:"";position:absolute;left:0.3125rem;top:0.0625rem;
width:0.25rem;height:0.5rem;transform:rotate(42deg);
border-right:2px solid oklch(1 0 0);border-bottom:2px solid oklch(1 0 0);
}
[data-vibeui-block="filters-009"] input:focus-visible{outline:2px solid var(--vibeui-filters-009-accent);outline-offset:2px}
[data-vibeui-block="filters-009"] [data-part="value"]{flex:1;min-width:0}
[data-vibeui-block="filters-009"] [data-part="count"]{
flex:none;font-size:0.6875rem;color:var(--vibeui-filters-009-muted);
font-variant-numeric:tabular-nums;
}
/* Кнопка называет результат: «Применить» не говорит, во что это обойдётся. */
[data-vibeui-block="filters-009"] [data-part="apply"]{
appearance:none;cursor:pointer;width:100%;
height:2.375rem;border:0;border-radius:0.625rem;
background:var(--vibeui-filters-009-accent);color:oklch(1 0 0);
font:inherit;font-size:0.8125rem;font-weight:700;
font-variant-numeric:tabular-nums;
transition:opacity .16s ease;
}
[data-vibeui-block="filters-009"] [data-part="apply"]:focus-visible{outline:2px solid var(--vibeui-filters-009-accent);outline-offset:2px}
[data-vibeui-block="filters-009"] [data-part="apply"]:disabled{cursor:default;opacity:.4}
[data-vibeui-block="filters-009"] [data-part="state"]{
margin:0;font-size:0.6875rem;line-height:1.4;color:var(--vibeui-filters-009-muted);
}
[data-vibeui-block="filters-009"][data-dirty="true"] [data-part="state"]{
color:var(--vibeui-filters-009-accent);font-weight:650;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="filters-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Filters009Option[] = [
  { value: "Оплачен", count: 184 },
  { value: "В сборке", count: 76 },
  { value: "Доставляется", count: 51 },
  { value: "Возврат", count: 12 },
]

/**
 * Фильтры с отложенным применением: кнопка сообщает, сколько записей останется.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Filters009({
  title = "Статус заказа",
  options = DEFAULT_OPTIONS,
  baseCount = 412,
  onApply,
  accent,
  className,
  style,
  ...props
}: Filters009Props) {
  const [draft, setDraft] = useState<string[]>([])
  const [applied, setApplied] = useState<string[]>([])

  const palette = {
    ...(accent ? { "--vibeui-filters-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  // Предсказанное число берётся из тех же счётчиков, что стоят у значений:
  // кнопка не имеет права обещать то, чего не видно в списке.
  const predicted = draft.length
    ? options
        .filter((option) => draft.includes(option.value))
        .reduce((sum, option) => sum + option.count, 0)
    : baseCount

  const dirty = draft.join("|") !== applied.join("|")

  const toggle = (value: string) =>
    setDraft((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    )

  return (
    <>
      <style href="vibeui-filters-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="filters-009"
        data-dirty={dirty ? "true" : undefined}
        className={className}
        style={palette}
      >
        <h3>{title}</h3>
        <ul>
          {options.map((option) => (
            <li key={option.value}>
              <label>
                <input
                  type="checkbox"
                  checked={draft.includes(option.value)}
                  onChange={() => toggle(option.value)}
                />
                <span data-part="value">{option.value}</span>
                <span data-part="count">{option.count}</span>
              </label>
            </li>
          ))}
        </ul>
        <p data-part="state" role="status">
          {dirty
            ? "Черновик изменён — отбор ещё не применён."
            : `Применено условий: ${applied.length}`}
        </p>
        <button
          type="button"
          data-part="apply"
          disabled={!dirty}
          onClick={() => {
            setApplied(draft)
            onApply?.(draft)
          }}
        >
          Показать {predicted}
        </button>
      </div>
    </>
  )
}

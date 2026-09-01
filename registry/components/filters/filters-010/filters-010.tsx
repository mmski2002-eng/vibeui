"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Filters010Group = {
  title: string
  options: string[]
}

export type Filters010Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  title?: string
  groups?: Filters010Group[]
  defaultSelected?: string[]
  resetLabel?: string
  onChange?: (selected: string[]) => void
  accent?: string
}

// Идея компонента: фишка — не подпись уже применённого условия, а сам
// переключатель. Нажатие включает и выключает значение на месте, без
// отдельной панели с чекбоксами; aria-pressed объявляет состояние, а не
// только цвет. Счётчик выбранного стоит в role="status", а «сбросить всё»
// появляется сразу от одной фишки — тут это единственный способ снять выбор.
const STYLES = `
:where([data-vibeui-block="filters-010"]){
--vibeui-filters-010-surface:oklch(1 0 0);
--vibeui-filters-010-fill:oklch(0.975 0.004 265);
--vibeui-filters-010-fg:oklch(0.23 0.014 265);
--vibeui-filters-010-muted:oklch(0.55 0.014 265);
--vibeui-filters-010-border:oklch(0.89 0.008 265);
--vibeui-filters-010-shell:oklch(0.91 0.006 265);
--vibeui-filters-010-accent:oklch(0.55 0.17 300);
--vibeui-filters-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: панель показывают поверх любого фона. */
[data-vibeui-block="filters-010"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-filters-010-surface);
border:1px solid var(--vibeui-filters-010-shell);border-radius:0.875rem;
font-family:var(--vibeui-filters-010-font);color:var(--vibeui-filters-010-fg);
}
[data-vibeui-block="filters-010"] *{box-sizing:border-box}
[data-vibeui-block="filters-010"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="filters-010"] h3{margin:0;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="filters-010"] [data-part="count"]{
margin:0;font-size:0.75rem;color:var(--vibeui-filters-010-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="filters-010"] [data-part="group"]{
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="filters-010"] [data-part="group"] span{
font-size:0.6875rem;font-weight:650;color:var(--vibeui-filters-010-muted);
text-transform:uppercase;letter-spacing:0.03em;
}
[data-vibeui-block="filters-010"] [data-part="chips"]{
display:flex;flex-wrap:wrap;gap:0.375rem;
}
/* Сама фишка — переключатель: нажатие включает и выключает значение. */
[data-vibeui-block="filters-010"] [data-part="chip"]{
appearance:none;cursor:pointer;
padding:0.3125rem 0.75rem;border-radius:9999px;
border:1px solid var(--vibeui-filters-010-border);
background:var(--vibeui-filters-010-fill);color:inherit;
font:inherit;font-size:0.75rem;font-weight:600;
transition:border-color .16s ease,background-color .16s ease,color .16s ease;
}
[data-vibeui-block="filters-010"] [data-part="chip"]:hover{border-color:var(--vibeui-filters-010-accent)}
[data-vibeui-block="filters-010"] [data-part="chip"]:focus-visible{
outline:2px solid var(--vibeui-filters-010-accent);outline-offset:2px;
}
[data-vibeui-block="filters-010"] [data-part="chip"][aria-pressed="true"]{
border-color:var(--vibeui-filters-010-accent);color:oklch(1 0 0);
background:var(--vibeui-filters-010-accent);
}
[data-vibeui-block="filters-010"] [data-part="reset"]{
appearance:none;cursor:pointer;align-self:flex-start;
padding:0.25rem 0.625rem;border-radius:9999px;
border:1px dashed var(--vibeui-filters-010-border);
background:none;color:var(--vibeui-filters-010-accent);
font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="filters-010"] [data-part="reset"]:hover{border-style:solid;border-color:var(--vibeui-filters-010-accent)}
[data-vibeui-block="filters-010"] [data-part="reset"]:focus-visible{outline:2px solid var(--vibeui-filters-010-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="filters-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Filters010Group[] = [
  { title: "Категория", options: ["Формы", "Таблицы", "Навигация", "Карточки"] },
  { title: "Лицензия", options: ["MIT", "Коммерческая"] },
]

/**
 * Панель фильтров-переключателей: сама фишка включает и выключает значение,
 * без отдельного списка чекбоксов. Один файл, ноль зависимостей, своя палитра.
 */
export function Filters010({
  title = "Фильтры",
  groups = DEFAULT_GROUPS,
  defaultSelected = [],
  resetLabel = "Сбросить всё",
  onChange,
  accent,
  className,
  style,
  ...props
}: Filters010Props) {
  const [selected, setSelected] = useState(defaultSelected)

  const palette = {
    ...(accent ? { "--vibeui-filters-010-accent": accent } : null),
    ...style,
  } as CSSProperties

  const apply = (next: string[]) => {
    setSelected(next)
    onChange?.(next)
  }

  const toggle = (value: string) => {
    apply(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    )
  }

  return (
    <>
      <style href="vibeui-filters-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="filters-010"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3>{title}</h3>
          <p data-part="count" role="status">
            {selected.length === 0
              ? "Ничего не выбрано"
              : `Выбрано: ${selected.length}`}
          </p>
        </div>

        {groups.map((group) => (
          <div key={group.title} data-part="group">
            <span>{group.title}</span>
            <div data-part="chips">
              {group.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  data-part="chip"
                  aria-pressed={selected.includes(option)}
                  onClick={() => toggle(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}

        {selected.length > 0 ? (
          <button
            type="button"
            data-part="reset"
            onClick={() => apply([])}
          >
            {resetLabel}
          </button>
        ) : null}
      </div>
    </>
  )
}

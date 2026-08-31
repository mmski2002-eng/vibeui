"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Filters002Chip = {
  id: string
  group: string
  value: string
}

export type Filters002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  chips?: Filters002Chip[]
  total?: string
  resetLabel?: string
  onChange?: (chips: Filters002Chip[]) => void
  accent?: string
}

// Идея компонента: строка того, что уже включено. Фильтры почти всегда
// прячутся в панели, и через минуту непонятно, почему список такой короткий.
// Здесь каждое условие — отдельная фишка с названием группы («Цена: до 5000»),
// а не голое значение: «до 5000» само по себе ничего не значит. Снять условие
// можно поштучно, а «сбросить всё» стоит отдельно и появляется от двух фишек.
const STYLES = `
:where([data-vibeui-block="filters-002"]){
--vibeui-filters-002-surface:oklch(1 0 0);
--vibeui-filters-002-chip:oklch(0.97 0.004 265);
--vibeui-filters-002-fg:oklch(0.23 0.014 265);
--vibeui-filters-002-muted:oklch(0.55 0.014 265);
--vibeui-filters-002-border:oklch(0.89 0.008 265);
--vibeui-filters-002-shell:oklch(0.91 0.006 265);
--vibeui-filters-002-accent:oklch(0.53 0.18 268);
--vibeui-filters-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: строку показывают поверх любого фона. */
[data-vibeui-block="filters-002"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:32rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-filters-002-surface);
border:1px solid var(--vibeui-filters-002-shell);border-radius:0.875rem;
font-family:var(--vibeui-filters-002-font);color:var(--vibeui-filters-002-fg);
}
[data-vibeui-block="filters-002"] *{box-sizing:border-box}
[data-vibeui-block="filters-002"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="filters-002"] h3{margin:0;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="filters-002"] [data-part="total"]{
margin:0;font-size:0.75rem;color:var(--vibeui-filters-002-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="filters-002"] ul{
display:flex;flex-wrap:wrap;gap:0.375rem;margin:0;padding:0;list-style:none;
}
/* Фишка называет группу: «до 5000» без «Цена» ничего не значит. */
[data-vibeui-block="filters-002"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.25rem 0.25rem 0.25rem 0.5625rem;border-radius:9999px;
background:var(--vibeui-filters-002-chip);
border:1px solid var(--vibeui-filters-002-border);
font-size:0.75rem;line-height:1.35;
}
[data-vibeui-block="filters-002"] [data-part="group"]{color:var(--vibeui-filters-002-muted)}
[data-vibeui-block="filters-002"] [data-part="value"]{font-weight:650}
[data-vibeui-block="filters-002"] [data-part="chip"] button{
appearance:none;cursor:pointer;flex:none;
display:grid;place-items:center;
width:1.125rem;height:1.125rem;border-radius:9999px;border:0;
background:oklch(1 0 0);color:var(--vibeui-filters-002-muted);
font:inherit;font-size:0.75rem;line-height:1;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="filters-002"] [data-part="chip"] button:hover{
background:var(--vibeui-filters-002-accent);color:oklch(1 0 0);
}
[data-vibeui-block="filters-002"] [data-part="chip"] button:focus-visible{
outline:2px solid var(--vibeui-filters-002-accent);outline-offset:2px;
}
/* «Сбросить всё» отделено: рядом с фишками его нажимают по инерции. */
[data-vibeui-block="filters-002"] [data-part="reset"]{
appearance:none;cursor:pointer;align-self:flex-start;
padding:0.25rem 0.625rem;border-radius:9999px;
border:1px dashed var(--vibeui-filters-002-border);
background:none;color:var(--vibeui-filters-002-accent);
font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="filters-002"] [data-part="reset"]:hover{border-style:solid;border-color:var(--vibeui-filters-002-accent)}
[data-vibeui-block="filters-002"] [data-part="reset"]:focus-visible{outline:2px solid var(--vibeui-filters-002-accent);outline-offset:2px}
[data-vibeui-block="filters-002"] [data-part="empty"]{
margin:0;font-size:0.8125rem;color:var(--vibeui-filters-002-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="filters-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CHIPS: Filters002Chip[] = [
  { id: "1", group: "Категория", value: "Формы" },
  { id: "2", group: "Цена", value: "до 5000 ₽" },
  { id: "3", group: "Лицензия", value: "MIT" },
  { id: "4", group: "Обновлён", value: "за месяц" },
]

/**
 * Строка активных фильтров: снятие по одному и отдельный сброс всего набора.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Filters002({
  chips = DEFAULT_CHIPS,
  total = "Найдено 128 компонентов",
  resetLabel = "Сбросить всё",
  onChange,
  accent,
  className,
  style,
  ...props
}: Filters002Props) {
  const [list, setList] = useState(chips)

  const palette = {
    ...(accent ? { "--vibeui-filters-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  const apply = (next: Filters002Chip[]) => {
    setList(next)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-filters-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="filters-002"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3>Активные фильтры</h3>
          <p data-part="total" aria-live="polite">
            {total}
          </p>
        </div>

        {list.length === 0 ? (
          <p data-part="empty">Фильтров нет — показан весь каталог целиком.</p>
        ) : (
          <ul>
            {list.map((chip) => (
              <li key={chip.id} data-part="chip">
                <span data-part="group">{chip.group}:</span>
                <span data-part="value">{chip.value}</span>
                <button
                  type="button"
                  aria-label={`Снять фильтр ${chip.group}: ${chip.value}`}
                  onClick={() =>
                    apply(list.filter((item) => item.id !== chip.id))
                  }
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Сброс появляется от двух фишек: на одной он дублирует крестик. */}
        {list.length > 1 ? (
          <button type="button" data-part="reset" onClick={() => apply([])}>
            {resetLabel}
          </button>
        ) : null}
      </div>
    </>
  )
}

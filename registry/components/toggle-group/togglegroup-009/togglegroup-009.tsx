"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Togglegroup009Item = {
  id: string
  name: string
  size: string
  updated: string
}

export type Togglegroup009Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onChange"
> & {
  label?: string
  defaultValue?: string
  items?: Togglegroup009Item[]
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: переключатель вида списка, где три вида — это три разные
// разметки одних и тех же данных, а не три набора CSS-правил над одним HTML.
// Таблица остаётся table с th, список — ul с li: скринридер получает верную
// семантику для каждого вида вместо визуальной подмены одной и той же разметки.
const STYLES = `
:where([data-vibeui-block="togglegroup-009"]){
--vibeui-togglegroup-009-bg:oklch(1 0 0);
--vibeui-togglegroup-009-fg:oklch(0.22 0.014 265);
--vibeui-togglegroup-009-muted:oklch(0.55 0.014 265);
--vibeui-togglegroup-009-border:oklch(0.9 0.006 265);
--vibeui-togglegroup-009-surface:oklch(0.97 0.004 265);
--vibeui-togglegroup-009-accent:oklch(0.56 0.16 230);
--vibeui-togglegroup-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="togglegroup-009"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:28rem;padding:0.875rem;
border:1px solid var(--vibeui-togglegroup-009-border);border-radius:0.875rem;
background:var(--vibeui-togglegroup-009-bg);color:var(--vibeui-togglegroup-009-fg);
font-family:var(--vibeui-togglegroup-009-font);
container-type:inline-size;
}
[data-vibeui-block="togglegroup-009"] *{box-sizing:border-box}
[data-vibeui-block="togglegroup-009"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;flex-wrap:wrap;
}
[data-vibeui-block="togglegroup-009"] h3{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="togglegroup-009"] [data-part="group"]{
display:inline-flex;gap:0.125rem;padding:0.1875rem;
border-radius:0.625rem;background:var(--vibeui-togglegroup-009-surface);
}
[data-vibeui-block="togglegroup-009"] [data-part="group"] button{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;gap:0.375rem;
height:1.875rem;padding:0 0.625rem;border:0;border-radius:0.4375rem;
background:transparent;color:var(--vibeui-togglegroup-009-muted);
font-size:0.75rem;font-weight:600;line-height:1;
transition:background-color .15s ease,color .15s ease;
}
[data-vibeui-block="togglegroup-009"] [data-part="group"] button svg{width:0.875rem;height:0.875rem}
[data-vibeui-block="togglegroup-009"] [data-part="group"] button:focus-visible{
outline:2px solid var(--vibeui-togglegroup-009-accent);outline-offset:1px;
}
[data-vibeui-block="togglegroup-009"] [data-part="group"] button[aria-pressed="true"]{
background:var(--vibeui-togglegroup-009-bg);color:var(--vibeui-togglegroup-009-accent);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 14%);
}
[data-vibeui-block="togglegroup-009"] [data-part="grid"]{
display:grid;grid-template-columns:1fr;gap:0.5rem;
}
[data-vibeui-block="togglegroup-009"] [data-part="card"]{
display:flex;flex-direction:column;gap:0.25rem;padding:0.625rem;
border:1px solid var(--vibeui-togglegroup-009-border);border-radius:0.625rem;
background:var(--vibeui-togglegroup-009-surface);
}
[data-vibeui-block="togglegroup-009"] [data-part="card"] strong{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="togglegroup-009"] [data-part="card"] span{font-size:0.6875rem;color:var(--vibeui-togglegroup-009-muted)}
[data-vibeui-block="togglegroup-009"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.375rem}
[data-vibeui-block="togglegroup-009"] li{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
padding:0.5rem 0.625rem;border-radius:0.5rem;background:var(--vibeui-togglegroup-009-surface);
font-size:0.8125rem;
}
[data-vibeui-block="togglegroup-009"] li span{font-size:0.6875rem;color:var(--vibeui-togglegroup-009-muted)}
[data-vibeui-block="togglegroup-009"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="togglegroup-009"] table{
width:100%;min-width:22rem;border-collapse:collapse;font-size:0.75rem;
border:1px solid var(--vibeui-togglegroup-009-border);border-radius:0.5rem;overflow:hidden;
}
[data-vibeui-block="togglegroup-009"] th,[data-vibeui-block="togglegroup-009"] td{
padding:0.375rem 0.5rem;text-align:left;border-bottom:1px solid var(--vibeui-togglegroup-009-border);
}
[data-vibeui-block="togglegroup-009"] th{background:var(--vibeui-togglegroup-009-surface);font-weight:650}
[data-vibeui-block="togglegroup-009"] tr:last-child td{border-bottom:0}
/* Контейнерный запрос читает ширину самой панели, а не окна: в узкой колонке
   карточки остаются в один столбец, даже если экран широкий. */
@container (min-width:24rem){
[data-vibeui-block="togglegroup-009"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="togglegroup-009"] *{animation:none!important;transition:none!important}}
`

const VIEWS = [
  {
    id: "grid",
    label: "Сетка",
    d: "M2 2.5h4v4H2zM8 2.5h4v4H8zM2 8.5h4v4H2zM8 8.5h4v4H8z",
  },
  { id: "list", label: "Список", d: "M2 4h10M2 7h10M2 10h10" },
  { id: "table", label: "Таблица", d: "M2 3h10v8H2zM2 6.5h10M7 6.5v4.5" },
]

const DEFAULT_ITEMS: Togglegroup009Item[] = [
  { id: "1", name: "Бриф для дизайнера.pdf", size: "1.2 МБ", updated: "14.03" },
  { id: "2", name: "Смета на печать.xlsx", size: "48 КБ", updated: "12.03" },
  { id: "3", name: "Договор подряда.docx", size: "220 КБ", updated: "09.03" },
  { id: "4", name: "Отчёт за квартал.pdf", size: "3.4 МБ", updated: "01.03" },
]

/**
 * Переключатель вида списка одиночным выбором: сетка, список и таблица —
 * три реальные разметки одних данных. Один файл, ноль зависимостей.
 */
export function Togglegroup009({
  label = "Вид списка",
  defaultValue = "list",
  items = DEFAULT_ITEMS,
  onChange,
  accent,
  className,
  style,
  ...props
}: Togglegroup009Props) {
  const [value, setValue] = useState(defaultValue)
  const regionId = useId()

  const palette = {
    ...(accent ? { "--vibeui-togglegroup-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-togglegroup-009" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="togglegroup-009"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3>Документы</h3>
          <div data-part="group" role="group" aria-label={label}>
            {VIEWS.map((view) => (
              <button
                key={view.id}
                type="button"
                aria-pressed={value === view.id}
                aria-controls={regionId}
                onClick={() => {
                  setValue(view.id)
                  onChange?.(view.id)
                }}
              >
                <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d={view.d}
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {view.label}
              </button>
            ))}
          </div>
        </div>
        <div id={regionId}>
          {value === "grid" ? (
            <div data-part="grid">
              {items.map((item) => (
                <div key={item.id} data-part="card">
                  <strong>{item.name}</strong>
                  <span>
                    {item.size} · {item.updated}
                  </span>
                </div>
              ))}
            </div>
          ) : value === "table" ? (
            <div data-part="scroll">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Имя</th>
                    <th scope="col">Размер</th>
                    <th scope="col">Изменён</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.size}</td>
                      <td>{item.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <ul>
              {items.map((item) => (
                <li key={item.id}>
                  {item.name}
                  <span>
                    {item.size} · {item.updated}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}

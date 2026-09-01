"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Togglegroup008Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onChange"
> & {
  label?: string
  minMessage?: string
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  accent?: string
}

// Идея компонента: группа с обязательным минимумом. Последняя нажатая кнопка
// не гаснет молча: она помечается aria-disabled и на нажатие отвечает
// объяснением. Убирать её из группы или отключать заранее нельзя — правило
// становится понятным ровно в тот момент, когда в него упираются.
const STYLES = `
:where([data-vibeui-block="togglegroup-008"]){
--vibeui-togglegroup-008-bg:oklch(1 0 0);
--vibeui-togglegroup-008-fg:oklch(0.22 0.014 265);
--vibeui-togglegroup-008-muted:oklch(0.55 0.014 265);
--vibeui-togglegroup-008-border:oklch(0.9 0.006 265);
--vibeui-togglegroup-008-surface:oklch(0.97 0.004 265);
--vibeui-togglegroup-008-accent:oklch(0.55 0.16 240);
--vibeui-togglegroup-008-warn:oklch(0.58 0.17 30);
--vibeui-togglegroup-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="togglegroup-008"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:24rem;padding:0.875rem;
border:1px solid var(--vibeui-togglegroup-008-border);border-radius:0.875rem;
background:var(--vibeui-togglegroup-008-bg);color:var(--vibeui-togglegroup-008-fg);
font-family:var(--vibeui-togglegroup-008-font);
}
[data-vibeui-block="togglegroup-008"] *{box-sizing:border-box}
[data-vibeui-block="togglegroup-008"] h3{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="togglegroup-008"] [data-part="group"]{display:flex;flex-wrap:wrap;gap:0.375rem}
[data-vibeui-block="togglegroup-008"] button{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;gap:0.375rem;
height:2rem;padding:0 0.6875rem;
border:1px solid var(--vibeui-togglegroup-008-border);border-radius:9999px;
background:var(--vibeui-togglegroup-008-bg);color:var(--vibeui-togglegroup-008-muted);
font-size:0.8125rem;font-weight:600;line-height:1;
transition:background-color .15s ease,color .15s ease,border-color .15s ease;
}
[data-vibeui-block="togglegroup-008"] button:focus-visible{
outline:2px solid var(--vibeui-togglegroup-008-accent);outline-offset:2px;
}
[data-vibeui-block="togglegroup-008"] button[aria-pressed="true"]{
background:color-mix(in oklab,var(--vibeui-togglegroup-008-accent) 12%,white);
border-color:var(--vibeui-togglegroup-008-accent);
color:var(--vibeui-togglegroup-008-accent);
}
/* Единственная оставшаяся кнопка помечена замком и aria-disabled: она
   нажата и снять её нельзя — это состояние, а не запрет на весь элемент. */
[data-vibeui-block="togglegroup-008"] button[aria-disabled="true"]{cursor:not-allowed}
[data-vibeui-block="togglegroup-008"] button svg{width:0.75rem;height:0.75rem}
[data-vibeui-block="togglegroup-008"] button[data-blocked="true"]{
border-color:var(--vibeui-togglegroup-008-warn);color:var(--vibeui-togglegroup-008-warn);
animation:vibeui-togglegroup-008-nudge .22s ease;
}
@keyframes vibeui-togglegroup-008-nudge{
0%,100%{transform:translateX(0)}
30%{transform:translateX(-0.1875rem)}
70%{transform:translateX(0.1875rem)}
}
[data-vibeui-block="togglegroup-008"] table{
width:100%;border-collapse:collapse;font-size:0.75rem;
border:1px solid var(--vibeui-togglegroup-008-border);border-radius:0.5rem;overflow:hidden;
}
[data-vibeui-block="togglegroup-008"] th,[data-vibeui-block="togglegroup-008"] td{
padding:0.375rem 0.5rem;text-align:left;border-bottom:1px solid var(--vibeui-togglegroup-008-border);
}
[data-vibeui-block="togglegroup-008"] th{background:var(--vibeui-togglegroup-008-surface);font-weight:650}
[data-vibeui-block="togglegroup-008"] tr:last-child td{border-bottom:0}
[data-vibeui-block="togglegroup-008"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-togglegroup-008-muted);
}
[data-vibeui-block="togglegroup-008"] [data-part="note"][data-warn="true"]{color:var(--vibeui-togglegroup-008-warn)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="togglegroup-008"] *{animation:none!important;transition:none!important}}
`

const COLUMNS = [
  { id: "name", label: "Клиент", cell: "ООО «Сфера»" },
  { id: "status", label: "Статус", cell: "Оплачен" },
  { id: "date", label: "Дата", cell: "14.03" },
  { id: "sum", label: "Сумма", cell: "48 200 ₽" },
]

/**
 * Группа тумблеров с обязательным минимумом: последняя нажатая кнопка
 * помечена aria-disabled и объясняет отказ. Один файл, ноль зависимостей.
 */
export function Togglegroup008({
  label = "Колонки таблицы",
  minMessage = "Хотя бы одна колонка должна остаться видимой.",
  defaultValue = ["name", "status", "sum"],
  onChange,
  accent,
  className,
  style,
  ...props
}: Togglegroup008Props) {
  const [value, setValue] = useState<string[]>(defaultValue)
  const [blocked, setBlocked] = useState("")

  const palette = {
    ...(accent ? { "--vibeui-togglegroup-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  const locked = (id: string) => value.length === 1 && value[0] === id

  const toggle = (id: string) => {
    if (locked(id)) {
      setBlocked(id)
      return
    }

    const next = value.includes(id)
      ? value.filter((item) => item !== id)
      : [...value, id]

    setBlocked("")
    setValue(next)
    onChange?.(next)
  }

  const shown = COLUMNS.filter((column) => value.includes(column.id))

  return (
    <>
      <style href="vibeui-togglegroup-008" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="togglegroup-008"
        className={className}
        style={palette}
      >
        <h3>{label}</h3>
        <div data-part="group" role="group" aria-label={label}>
          {COLUMNS.map((column) => (
            <button
              key={column.id}
              type="button"
              aria-pressed={value.includes(column.id)}
              aria-disabled={locked(column.id)}
              data-blocked={blocked === column.id}
              onClick={() => toggle(column.id)}
            >
              {locked(column.id) ? (
                <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path
                    d="M3.2 5.2V4a2.8 2.8 0 0 1 5.6 0v1.2M2.6 5.2h6.8v5H2.6z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : null}
              {column.label}
            </button>
          ))}
        </div>
        <table>
          <thead>
            <tr>
              {shown.map((column) => (
                <th key={column.id} scope="col">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {shown.map((column) => (
                <td key={column.id}>{column.cell}</td>
              ))}
            </tr>
          </tbody>
        </table>
        <p data-part="note" data-warn={blocked !== ""} role="status">
          {blocked ? minMessage : `Показано колонок: ${value.length} из 4.`}
        </p>
      </section>
    </>
  )
}

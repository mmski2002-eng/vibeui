"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Togglegroup003Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onChange"
> & {
  label?: string
  defaultValue?: string
  items?: string[]
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: группа переключателей вместе с тем, чем она управляет.
// aria-controls связывает её со списком, и вид меняется в той же разметке —
// видно, что группа выбирает состояние вида, а не запускает действие.
const STYLES = `
:where([data-vibeui-block="togglegroup-003"]){
--vibeui-togglegroup-003-bg:oklch(1 0 0);
--vibeui-togglegroup-003-fg:oklch(0.22 0.014 265);
--vibeui-togglegroup-003-muted:oklch(0.55 0.014 265);
--vibeui-togglegroup-003-border:oklch(0.9 0.006 265);
--vibeui-togglegroup-003-surface:oklch(0.97 0.004 265);
--vibeui-togglegroup-003-accent:oklch(0.56 0.15 195);
--vibeui-togglegroup-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="togglegroup-003"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:26rem;padding:0.875rem;
border:1px solid var(--vibeui-togglegroup-003-border);border-radius:0.875rem;
background:var(--vibeui-togglegroup-003-bg);color:var(--vibeui-togglegroup-003-fg);
font-family:var(--vibeui-togglegroup-003-font);
}
[data-vibeui-block="togglegroup-003"] *{box-sizing:border-box}
[data-vibeui-block="togglegroup-003"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;flex-wrap:wrap;
}
[data-vibeui-block="togglegroup-003"] h3{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="togglegroup-003"] [data-part="group"]{
display:inline-flex;gap:0.125rem;padding:0.1875rem;
border-radius:0.625rem;background:var(--vibeui-togglegroup-003-surface);
}
[data-vibeui-block="togglegroup-003"] button{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;gap:0.375rem;
height:1.875rem;padding:0 0.5625rem;border:0;border-radius:0.4375rem;
background:transparent;color:var(--vibeui-togglegroup-003-muted);
font-size:0.75rem;font-weight:600;line-height:1;
transition:background-color .15s ease,color .15s ease;
}
[data-vibeui-block="togglegroup-003"] button svg{width:0.875rem;height:0.875rem}
[data-vibeui-block="togglegroup-003"] button:focus-visible{
outline:2px solid var(--vibeui-togglegroup-003-accent);outline-offset:1px;
}
[data-vibeui-block="togglegroup-003"] button[aria-pressed="true"]{
background:var(--vibeui-togglegroup-003-bg);color:var(--vibeui-togglegroup-003-accent);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 14%);
}
[data-vibeui-block="togglegroup-003"] ul{
list-style:none;margin:0;padding:0;display:grid;gap:0.375rem;
}
[data-vibeui-block="togglegroup-003"] li{
display:flex;align-items:center;gap:0.5rem;
padding:0.5rem 0.625rem;border-radius:0.5rem;
background:var(--vibeui-togglegroup-003-surface);
font-size:0.8125rem;line-height:1.3;
}
[data-vibeui-block="togglegroup-003"] li::before{
content:"";flex:none;width:1.5rem;height:1.5rem;border-radius:0.375rem;
background:color-mix(in oklab,var(--vibeui-togglegroup-003-accent) 22%,white);
}
/* Три вида — три набора правил над одной и той же разметкой: список не
   пересобирается, поэтому переключение не теряет прокрутку и фокус. */
[data-vibeui-block="togglegroup-003"][data-view="grid"] ul{grid-template-columns:repeat(2,minmax(0,1fr))}
[data-vibeui-block="togglegroup-003"][data-view="grid"] li{
flex-direction:column;align-items:flex-start;gap:0.4375rem;padding:0.625rem;
}
[data-vibeui-block="togglegroup-003"][data-view="grid"] li::before{width:100%;height:2.25rem}
[data-vibeui-block="togglegroup-003"][data-view="compact"] ul{gap:0}
[data-vibeui-block="togglegroup-003"][data-view="compact"] li{
padding:0.3125rem 0.5rem;border-radius:0;background:transparent;
border-bottom:1px solid var(--vibeui-togglegroup-003-border);font-size:0.75rem;
}
[data-vibeui-block="togglegroup-003"][data-view="compact"] li::before{width:0.375rem;height:0.375rem;border-radius:50%}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="togglegroup-003"] *{animation:none!important;transition:none!important}}
`

const VIEWS = [
  { id: "list", label: "Список", d: "M2 4h10M2 7h10M2 10h10" },
  {
    id: "grid",
    label: "Сетка",
    d: "M2 2.5h4v4H2zM8 2.5h4v4H8zM2 8.5h4v4H2zM8 8.5h4v4H8z",
  },
  { id: "compact", label: "Компактно", d: "M2 3h10M2 5.5h10M2 8h10M2 10.5h10" },
]

const DEFAULT_ITEMS = [
  "Бриф для дизайнера",
  "Смета на печать",
  "Договор подряда",
  "Отчёт за квартал",
]

/**
 * Группа выбора вида списка, связанная со списком через aria-controls:
 * вид меняется правилами над одной разметкой. Один файл, ноль зависимостей.
 */
export function Togglegroup003({
  label = "Вид списка",
  defaultValue = "list",
  items = DEFAULT_ITEMS,
  onChange,
  accent,
  className,
  style,
  ...props
}: Togglegroup003Props) {
  const [value, setValue] = useState(defaultValue)
  const listId = useId()

  const palette = {
    ...(accent ? { "--vibeui-togglegroup-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-togglegroup-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="togglegroup-003"
        data-view={value}
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
                aria-controls={listId}
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
                  />
                </svg>
                {view.label}
              </button>
            ))}
          </div>
        </div>
        <ul id={listId}>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </>
  )
}

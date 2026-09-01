"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Input026Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  defaultValue?: string
  quick?: string[]
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: выбор времени бронирования редко бывает произвольным —
// шаг в 15 минут и несколько частых значений покрывают почти все случаи.
// Нативный <input type="time"> с step={900} задаёт стрелкам браузера этот
// шаг, но ручной ввод с клавиатуры шаг не соблюдает, поэтому на onChange
// значение довдится до ближайших 15 минут в JS, а не только надеждой на
// браузер. Чипы под полем — те же самые частые значения, но одним кликом.
const STYLES = `
:where([data-vibeui-block="input-026"]){
--vibeui-input-026-surface:oklch(1 0 0);
--vibeui-input-026-shell:oklch(0.91 0.006 265);
--vibeui-input-026-fg:oklch(0.23 0.014 265);
--vibeui-input-026-muted:oklch(0.56 0.014 265);
--vibeui-input-026-field:oklch(0.985 0.002 265);
--vibeui-input-026-border:oklch(0.88 0.008 265);
--vibeui-input-026-accent:oklch(0.55 0.15 200);
--vibeui-input-026-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="input-026"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-026-surface);
border:1px solid var(--vibeui-input-026-shell);border-radius:0.875rem;
font-family:var(--vibeui-input-026-font);color:var(--vibeui-input-026-fg);
}
[data-vibeui-block="input-026"] *{box-sizing:border-box}
[data-vibeui-block="input-026"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-026"] [data-part="frame"]{
display:flex;align-items:center;
height:2.5rem;padding:0 0.75rem;
background:var(--vibeui-input-026-field);
border:1px solid var(--vibeui-input-026-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-026"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-input-026-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-026-accent) 18%,transparent);
}
[data-vibeui-block="input-026"] input{
flex:1;min-width:0;height:100%;border:0;background:none;color:inherit;
font:inherit;font-size:1rem;font-weight:600;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="input-026"] input:focus{outline:none}
[data-vibeui-block="input-026"] [data-part="quick"]{
display:flex;flex-wrap:wrap;gap:0.375rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="input-026"] [data-part="chip"]{
appearance:none;cursor:pointer;
padding:0.3125rem 0.625rem;border-radius:999px;border:1px solid var(--vibeui-input-026-border);
background:var(--vibeui-input-026-surface);color:var(--vibeui-input-026-muted);
font:inherit;font-size:0.75rem;font-weight:600;font-variant-numeric:tabular-nums;
transition:border-color .16s ease,color .16s ease,background-color .16s ease;
}
[data-vibeui-block="input-026"] [data-part="chip"]:hover{border-color:var(--vibeui-input-026-accent);color:var(--vibeui-input-026-fg)}
[data-vibeui-block="input-026"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-input-026-accent);outline-offset:1px}
[data-vibeui-block="input-026"] [data-part="chip"][aria-pressed="true"]{
background:color-mix(in oklab,var(--vibeui-input-026-accent) 16%,transparent);
border-color:var(--vibeui-input-026-accent);color:var(--vibeui-input-026-fg);
}
[data-vibeui-block="input-026"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-026-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-026"] *{animation:none!important;transition:none!important}}
`

const QUICK = ["09:00", "12:00", "15:00", "18:00"]
const STEP_MINUTES = 15

// Ручной ввод (набор с клавиатуры) в type="time" не подчиняется атрибуту
// step — округляем сами, к ближайшим 15 минутам, а не всегда вниз, чтобы
// «12:52» стало «13:00», а не незаметно потеряло восемь минут в другую сторону.
function snap(value: string) {
  const match = value.match(/^(\d{2}):(\d{2})$/)
  if (!match) return value

  const total = Number(match[1]) * 60 + Number(match[2])
  const rounded = Math.round(total / STEP_MINUTES) * STEP_MINUTES
  const wrapped = ((rounded % 1440) + 1440) % 1440
  const hh = String(Math.floor(wrapped / 60)).padStart(2, "0")
  const mm = String(wrapped % 60).padStart(2, "0")
  return `${hh}:${mm}`
}

/**
 * Поле времени с шагом 15 минут: ручной ввод довдится до ближайшего шага,
 * а частые значения выбираются чипами под полем. Один файл, ноль зависимостей.
 */
export function Input026({
  label = "Время визита",
  defaultValue = "12:00",
  quick = QUICK,
  onChange,
  accent,
  className,
  style,
  ...props
}: Input026Props) {
  const id = useId()
  const [value, setValue] = useState(snap(defaultValue))

  const palette = {
    ...(accent ? { "--vibeui-input-026-accent": accent } : null),
    ...style,
  } as CSSProperties

  const commit = (next: string) => {
    setValue(next)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-input-026" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="input-026"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="frame">
          <input
            id={id}
            type="time"
            step={STEP_MINUTES * 60}
            value={value}
            aria-describedby={`${id}-note`}
            onChange={(event) => {
              if (!event.target.value) return
              commit(snap(event.target.value))
            }}
          />
        </div>
        <ul data-part="quick" aria-label="Частые значения">
          {quick.map((time) => (
            <li key={time}>
              <button
                type="button"
                data-part="chip"
                aria-pressed={time === value}
                onClick={() => commit(time)}
              >
                {time}
              </button>
            </li>
          ))}
        </ul>
        <p data-part="note" id={`${id}-note`}>
          Шаг — 15 минут, ручной ввод округляется до ближайшего.
        </p>
      </div>
    </>
  )
}

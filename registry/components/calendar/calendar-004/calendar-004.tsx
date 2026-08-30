"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Calendar004Slot = {
  time: string
  taken?: boolean
}

export type Calendar004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  date?: string
  slots?: Calendar004Slot[]
  defaultValue?: string
  timezone?: string
  onChange?: (time: string) => void
  accent?: string
}

// Идея компонента: сетка слотов записи. Занятые слоты остаются видимыми, но
// выключенными: исчезнувшие слоты создают ощущение, что свободных часов
// больше, чем есть. Под сеткой подписан часовой пояс — запись на «14:00»
// без пояса регулярно оборачивается опозданием на несколько часов.
const STYLES = `
:where([data-vibeui-block="calendar-004"]){
--vibeui-calendar-004-bg:oklch(1 0 0);
--vibeui-calendar-004-fg:oklch(0.24 0.014 265);
--vibeui-calendar-004-muted:oklch(0.6 0.014 265);
--vibeui-calendar-004-border:oklch(0.91 0.006 265);
--vibeui-calendar-004-accent:oklch(0.55 0.17 265);
--vibeui-calendar-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="calendar-004"]{
display:block;width:100%;max-width:20rem;box-sizing:border-box;
font-family:var(--vibeui-calendar-004-font);color:var(--vibeui-calendar-004-fg);
}
[data-vibeui-block="calendar-004"] [data-part="card"]{
display:flex;flex-direction:column;gap:0.625rem;
box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-calendar-004-bg);
border:1px solid var(--vibeui-calendar-004-border);border-radius:0.875rem;
}
[data-vibeui-block="calendar-004"] [data-part="date"]{font-size:0.875rem;font-weight:650}
[data-vibeui-block="calendar-004"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(3,1fr);gap:0.375rem;
margin:0;padding:0;border:0;
}
[data-vibeui-block="calendar-004"] legend{
padding:0;margin:0 0 0.375rem;font-size:0.75rem;color:var(--vibeui-calendar-004-muted);
}
[data-vibeui-block="calendar-004"] label{
position:relative;display:flex;align-items:center;justify-content:center;
height:2.25rem;border-radius:0.5rem;
border:1px solid var(--vibeui-calendar-004-border);
font-size:0.8125rem;font-weight:600;font-variant-numeric:tabular-nums;
cursor:pointer;
}
[data-vibeui-block="calendar-004"] input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}
[data-vibeui-block="calendar-004"] label:has(input:checked){
border-color:transparent;background:var(--vibeui-calendar-004-accent);color:oklch(0.99 0.01 265);
}
[data-vibeui-block="calendar-004"] label:has(input:focus-visible){outline:2px solid var(--vibeui-calendar-004-accent);outline-offset:2px}
/* Занятый слот остаётся на месте: исчезнувший создаёт ложное ощущение
   свободного расписания. */
[data-vibeui-block="calendar-004"] label:has(input:disabled){
cursor:not-allowed;color:var(--vibeui-calendar-004-muted);
background:repeating-linear-gradient(135deg,oklch(0.97 0.003 265) 0 0.25rem,oklch(0.94 0.004 265) 0.25rem 0.5rem);
}
[data-vibeui-block="calendar-004"] [data-part="zone"]{font-size:0.75rem;color:var(--vibeui-calendar-004-muted)}
@container (max-width: 17rem){
[data-vibeui-block="calendar-004"] [data-part="grid"]{grid-template-columns:repeat(2,1fr)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SLOTS: Calendar004Slot[] = [
  { time: "10:00" },
  { time: "10:30", taken: true },
  { time: "11:00" },
  { time: "11:30" },
  { time: "12:00", taken: true },
  { time: "12:30", taken: true },
  { time: "14:00" },
  { time: "14:30" },
  { time: "15:00" },
]

/**
 * Сетка слотов записи: занятые видны, но выключены, пояс подписан.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar004({
  date = "Вторник, 17 марта",
  slots = DEFAULT_SLOTS,
  defaultValue = "11:00",
  timezone = "Время московское (UTC+3)",
  onChange,
  accent,
  className,
  style,
  ...props
}: Calendar004Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-calendar-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  const free = slots.filter((slot) => !slot.taken).length

  return (
    <>
      <style href="vibeui-calendar-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="calendar-004"
        className={className}
        style={palette}
      >
        <div data-part="card">
          <p data-part="date">{date}</p>
          <fieldset data-part="grid-wrap">
            <legend>
              Свободно {free} из {slots.length}
            </legend>
            <div data-part="grid">
              {slots.map((slot) => (
                <label key={slot.time}>
                  <input
                    type="radio"
                    name={id}
                    value={slot.time}
                    checked={value === slot.time}
                    disabled={slot.taken}
                    onChange={() => {
                      setValue(slot.time)
                      onChange?.(slot.time)
                    }}
                  />
                  {slot.time}
                </label>
              ))}
            </div>
          </fieldset>
          <p data-part="zone">{timezone}</p>
        </div>
      </div>
    </>
  )
}

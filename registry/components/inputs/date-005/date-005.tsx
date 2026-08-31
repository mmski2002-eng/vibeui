"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Date005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  defaultValue?: string
  presets?: { text: string; days: number }[]
  accent?: string
}

// Идея компонента: относительные пресеты рядом с полем. «Сегодня» и «завтра»
// пользователь думает словами, а вводить вынужден числами — кнопки убирают этот
// перевод. Считаются они по системным часам в момент нажатия, а не при отрисовке:
// вычислить «сегодня» на сервере и на клиенте — верный способ получить разные
// даты на границе часовых поясов и расхождение при гидратации. Под полем
// подписан день недели: «16 сентября» само по себе не говорит, что это среда.
const STYLES = `
:where([data-vibeui-block="date-005"]){
--vibeui-date-005-surface:oklch(1 0 0);
--vibeui-date-005-field:oklch(1 0 0);
--vibeui-date-005-shell:oklch(0.9 0.006 265);
--vibeui-date-005-fg:oklch(0.23 0.014 265);
--vibeui-date-005-muted:oklch(0.55 0.014 265);
--vibeui-date-005-border:oklch(0.88 0.008 265);
--vibeui-date-005-accent:oklch(0.54 0.15 165);
--vibeui-date-005-soft:oklch(0.54 0.15 165 / 12%);
--vibeui-date-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: поле показывают поверх любого фона. */
[data-vibeui-block="date-005"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-date-005-surface);
border:1px solid var(--vibeui-date-005-shell);border-radius:0.875rem;
font-family:var(--vibeui-date-005-font);color:var(--vibeui-date-005-fg);
}
[data-vibeui-block="date-005"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="date-005"] input{
width:100%;box-sizing:border-box;height:2.75rem;padding:0 0.75rem;
background:var(--vibeui-date-005-field);color:inherit;
border:1px solid var(--vibeui-date-005-border);border-radius:0.625rem;
font:inherit;font-size:0.9375rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="date-005"] input:focus-visible{
outline:2px solid var(--vibeui-date-005-accent);outline-offset:1px;border-color:var(--vibeui-date-005-accent);
}
[data-vibeui-block="date-005"] input::-webkit-calendar-picker-indicator{cursor:pointer;opacity:.55}
[data-vibeui-block="date-005"] input::-webkit-calendar-picker-indicator:hover{opacity:1}
/* Кнопки словами: пользователь думает «завтра», а не «2026-09-01». */
[data-vibeui-block="date-005"] [data-part="presets"]{display:flex;flex-wrap:wrap;gap:0.375rem}
[data-vibeui-block="date-005"] button{
appearance:none;cursor:pointer;
height:1.875rem;padding:0 0.75rem;border-radius:9999px;
border:1px solid var(--vibeui-date-005-border);
background:var(--vibeui-date-005-surface);color:inherit;
font:inherit;font-size:0.75rem;font-weight:650;
transition:background-color .14s ease,border-color .14s ease,color .14s ease;
}
[data-vibeui-block="date-005"] button:hover{border-color:var(--vibeui-date-005-accent)}
[data-vibeui-block="date-005"] button:focus-visible{outline:2px solid var(--vibeui-date-005-accent);outline-offset:2px}
/* Нажатый пресет остаётся отмеченным: видно, что дата пришла из кнопки. */
[data-vibeui-block="date-005"] button[aria-pressed="true"]{
background:var(--vibeui-date-005-soft);border-color:var(--vibeui-date-005-accent);
color:var(--vibeui-date-005-accent);
}
[data-vibeui-block="date-005"] [data-part="weekday"]{
margin:0;font-size:0.75rem;color:var(--vibeui-date-005-muted);
}
[data-vibeui-block="date-005"] [data-part="weekday"] b{color:var(--vibeui-date-005-fg);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="date-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PRESETS = [
  { text: "Сегодня", days: 0 },
  { text: "Завтра", days: 1 },
  { text: "Через неделю", days: 7 },
]

// Системные часы читаются в момент нажатия: «сегодня» на сервере и на клиенте
// могут оказаться разными датами, и гидратация это заметит.
function shiftedToday(days: number) {
  const now = new Date()
  now.setDate(now.getDate() + days)
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${now.getFullYear()}-${month}-${day}`
}

// Дата разбирается по частям: Date.parse трактует «2026-09-16» как UTC и
// в минусовых поясах отдаёт предыдущий день.
function weekdayOf(value: string) {
  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) return ""
  return new Date(year, month - 1, day).toLocaleDateString("ru-RU", {
    weekday: "long",
  })
}

/**
 * Поле даты с кнопками «сегодня» и «завтра» и подписью дня недели.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Date005({
  label = "Дата доставки",
  defaultValue = "2026-09-16",
  presets = DEFAULT_PRESETS,
  accent,
  className,
  style,
  ...props
}: Date005Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [picked, setPicked] = useState<string | null>(null)

  const palette = {
    ...(accent ? { "--vibeui-date-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-date-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="date-005"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type="date"
          value={value}
          aria-describedby={`${id}-weekday`}
          onChange={(event) => {
            setValue(event.target.value)
            setPicked(null)
          }}
        />
        <div data-part="presets">
          {presets.map((preset) => (
            <button
              key={preset.text}
              type="button"
              aria-pressed={picked === preset.text}
              onClick={() => {
                setValue(shiftedToday(preset.days))
                setPicked(preset.text)
              }}
            >
              {preset.text}
            </button>
          ))}
        </div>
        <p id={`${id}-weekday`} data-part="weekday" aria-live="polite">
          Это <b>{weekdayOf(value) || "неизвестный день"}</b>
        </p>
      </div>
    </>
  )
}

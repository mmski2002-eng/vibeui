"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Date008Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  defaultValue?: string
  stepMinutes?: number
  openAt?: string
  closeAt?: string
  accent?: string
}

// Идея компонента: время по сетке в четверть часа. Запись «на 14:07» не нужна
// никому, но нативное поле её позволяет, поэтому любое введённое значение
// округляется до ближайшей четверти. Кнопки сдвигают время на шаг и заодно
// выравнивают по сетке: сдвиг от 14:07 даёт 14:15, а не 14:22. Границы работы
// заданы через min и max, и за них не выйдут ни кнопки, ни клавиатура.
const STYLES = `
:where([data-vibeui-block="date-008"]){
--vibeui-date-008-surface:oklch(1 0 0);
--vibeui-date-008-field:oklch(0.985 0.002 265);
--vibeui-date-008-shell:oklch(0.9 0.006 265);
--vibeui-date-008-fg:oklch(0.23 0.014 265);
--vibeui-date-008-muted:oklch(0.55 0.014 265);
--vibeui-date-008-border:oklch(0.88 0.008 265);
--vibeui-date-008-accent:oklch(0.5 0.15 240);
--vibeui-date-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: поле показывают поверх любого фона. */
[data-vibeui-block="date-008"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:19rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-date-008-surface);
border:1px solid var(--vibeui-date-008-shell);border-radius:0.875rem;
font-family:var(--vibeui-date-008-font);color:var(--vibeui-date-008-fg);
}
[data-vibeui-block="date-008"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="date-008"] [data-part="row"]{display:flex;align-items:stretch;gap:0.375rem}
[data-vibeui-block="date-008"] input{
flex:1 1 auto;min-width:0;box-sizing:border-box;
height:2.75rem;padding:0 0.75rem;text-align:center;
background:var(--vibeui-date-008-field);color:inherit;
border:1px solid var(--vibeui-date-008-border);border-radius:0.625rem;
font:inherit;font-size:1.125rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="date-008"] input:focus-visible{
outline:2px solid var(--vibeui-date-008-accent);outline-offset:1px;border-color:var(--vibeui-date-008-accent);
}
[data-vibeui-block="date-008"] input::-webkit-calendar-picker-indicator{display:none}
/* Кнопки сдвигают на шаг и заодно выравнивают по сетке. */
[data-vibeui-block="date-008"] button{
appearance:none;cursor:pointer;flex:none;
width:2.75rem;height:2.75rem;
border:1px solid var(--vibeui-date-008-border);border-radius:0.625rem;
background:var(--vibeui-date-008-surface);color:inherit;
font:inherit;font-size:0.6875rem;font-weight:700;line-height:1.1;
transition:border-color .14s ease,color .14s ease;
}
[data-vibeui-block="date-008"] button:hover:not(:disabled){border-color:var(--vibeui-date-008-accent);color:var(--vibeui-date-008-accent)}
[data-vibeui-block="date-008"] button:focus-visible{outline:2px solid var(--vibeui-date-008-accent);outline-offset:2px}
[data-vibeui-block="date-008"] button:disabled{opacity:.4;cursor:default}
[data-vibeui-block="date-008"] [data-part="hint"]{
display:flex;justify-content:space-between;gap:0.75rem;margin:0;
font-size:0.75rem;color:var(--vibeui-date-008-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="date-008"] *{animation:none!important;transition:none!important}}
`

function toMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number)
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return 0
  return hours * 60 + minutes
}

function toTime(minutes: number) {
  const hours = Math.floor(minutes / 60) % 24
  return `${String(hours).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`
}

/**
 * Поле времени с сеткой в четверть часа и кнопками сдвига по шагу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Date008({
  label = "Время записи",
  defaultValue = "14:30",
  stepMinutes = 15,
  openAt = "09:00",
  closeAt = "20:00",
  accent,
  className,
  style,
  ...props
}: Date008Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const open = toMinutes(openAt)
  const close = toMinutes(closeAt)
  const current = toMinutes(value)

  // Округление к ближайшей четверти: «на 14:07» не записывают никого.
  const snap = (minutes: number) =>
    Math.min(
      close,
      Math.max(open, Math.round(minutes / stepMinutes) * stepMinutes),
    )

  const palette = {
    ...(accent ? { "--vibeui-date-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-date-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="date-008"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="row">
          <button
            type="button"
            disabled={current <= open}
            aria-label={`Раньше на ${stepMinutes} минут`}
            onClick={() => setValue(toTime(snap(current - stepMinutes)))}
          >
            −{stepMinutes}
          </button>
          <input
            id={id}
            type="time"
            value={value}
            min={openAt}
            max={closeAt}
            step={stepMinutes * 60}
            aria-describedby={`${id}-hint`}
            onChange={(event) => setValue(event.target.value)}
            onBlur={() => setValue(toTime(snap(toMinutes(value))))}
          />
          <button
            type="button"
            disabled={current >= close}
            aria-label={`Позже на ${stepMinutes} минут`}
            onClick={() => setValue(toTime(snap(current + stepMinutes)))}
          >
            +{stepMinutes}
          </button>
        </div>
        <p id={`${id}-hint`} data-part="hint">
          <span>Шаг {stepMinutes} мин</span>
          <span>
            приём с {openAt} до {closeAt}
          </span>
        </p>
      </div>
    </>
  )
}

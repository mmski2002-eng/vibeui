"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Togglegroup004Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onChange"
> & {
  label?: string
  hint?: string
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  accent?: string
}

// Идея компонента: фильтр по дням недели множественным выбором. Кружок — это
// toggle: нажат или нет, седьмого состояния не бывает. Рядом стоит обычная
// кнопка «Будни» — она не toggle, а действие над выбором, и выглядит иначе,
// чтобы разница между состоянием и действием читалась глазами.
const STYLES = `
:where([data-vibeui-block="togglegroup-004"]){
--vibeui-togglegroup-004-bg:oklch(1 0 0);
--vibeui-togglegroup-004-fg:oklch(0.22 0.014 265);
--vibeui-togglegroup-004-muted:oklch(0.55 0.014 265);
--vibeui-togglegroup-004-border:oklch(0.9 0.006 265);
--vibeui-togglegroup-004-surface:oklch(0.97 0.004 265);
--vibeui-togglegroup-004-accent:oklch(0.55 0.16 145);
--vibeui-togglegroup-004-weekend:oklch(0.6 0.16 25);
--vibeui-togglegroup-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="togglegroup-004"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:23rem;padding:0.875rem;
border:1px solid var(--vibeui-togglegroup-004-border);border-radius:0.875rem;
background:var(--vibeui-togglegroup-004-bg);color:var(--vibeui-togglegroup-004-fg);
font-family:var(--vibeui-togglegroup-004-font);
}
[data-vibeui-block="togglegroup-004"] *{box-sizing:border-box}
[data-vibeui-block="togglegroup-004"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="togglegroup-004"] h3{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="togglegroup-004"] [data-part="preset"]{
appearance:none;cursor:pointer;font:inherit;border:0;background:none;padding:0;
color:var(--vibeui-togglegroup-004-accent);
font-size:0.75rem;font-weight:600;text-decoration:underline;text-underline-offset:0.2em;
}
[data-vibeui-block="togglegroup-004"] [data-part="preset"]:focus-visible{
outline:2px solid var(--vibeui-togglegroup-004-accent);outline-offset:2px;border-radius:0.25rem;
}
[data-vibeui-block="togglegroup-004"] [data-part="group"]{
display:flex;flex-wrap:wrap;gap:0.375rem;
}
[data-vibeui-block="togglegroup-004"] [data-part="day"]{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;justify-content:center;
width:2.375rem;height:2.375rem;padding:0;
border:1px solid var(--vibeui-togglegroup-004-border);border-radius:50%;
background:var(--vibeui-togglegroup-004-bg);color:var(--vibeui-togglegroup-004-muted);
font-size:0.8125rem;font-weight:650;line-height:1;
transition:background-color .15s ease,color .15s ease,border-color .15s ease;
}
[data-vibeui-block="togglegroup-004"] [data-part="day"]:hover{background:var(--vibeui-togglegroup-004-surface)}
[data-vibeui-block="togglegroup-004"] [data-part="day"]:focus-visible{
outline:2px solid var(--vibeui-togglegroup-004-accent);outline-offset:2px;
}
[data-vibeui-block="togglegroup-004"] [data-part="day"][aria-pressed="true"]{
background:var(--vibeui-togglegroup-004-accent);
border-color:var(--vibeui-togglegroup-004-accent);
color:oklch(0.99 0 0);
}
/* Выходные красятся своим цветом только в нажатом виде: в спокойном
   состоянии семь разноцветных кружков читались бы как семь разных сущностей. */
[data-vibeui-block="togglegroup-004"] [data-part="day"][data-weekend="true"][aria-pressed="true"]{
background:var(--vibeui-togglegroup-004-weekend);
border-color:var(--vibeui-togglegroup-004-weekend);
}
[data-vibeui-block="togglegroup-004"] [data-part="summary"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-togglegroup-004-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="togglegroup-004"] *{animation:none!important;transition:none!important}}
`

const DAYS = [
  { id: "mon", short: "Пн", full: "Понедельник", weekend: false },
  { id: "tue", short: "Вт", full: "Вторник", weekend: false },
  { id: "wed", short: "Ср", full: "Среда", weekend: false },
  { id: "thu", short: "Чт", full: "Четверг", weekend: false },
  { id: "fri", short: "Пт", full: "Пятница", weekend: false },
  { id: "sat", short: "Сб", full: "Суббота", weekend: true },
  { id: "sun", short: "Вс", full: "Воскресенье", weekend: true },
]

function plural(count: number) {
  const tail = count % 100

  if (tail > 10 && tail < 20) {
    return "дней"
  }

  const last = count % 10

  if (last === 1) {
    return "день"
  }

  if (last > 1 && last < 5) {
    return "дня"
  }

  return "дней"
}

/**
 * Фильтр по дням недели: множественный выбор кружками-тумблерами и живая
 * строка итога. Один файл, ноль зависимостей, собственная палитра.
 */
export function Togglegroup004({
  label = "Дни доставки",
  hint = "Курьер приезжает только в отмеченные дни.",
  defaultValue = ["mon", "wed", "fri"],
  onChange,
  accent,
  className,
  style,
  ...props
}: Togglegroup004Props) {
  const [value, setValue] = useState<string[]>(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-togglegroup-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  const apply = (next: string[]) => {
    setValue(next)
    onChange?.(next)
  }

  const chosen = DAYS.filter((day) => value.includes(day.id))

  return (
    <>
      <style href="vibeui-togglegroup-004" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="togglegroup-004"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3>{label}</h3>
          <button
            type="button"
            data-part="preset"
            onClick={() => apply(["mon", "tue", "wed", "thu", "fri"])}
          >
            Только будни
          </button>
        </div>
        <div data-part="group" role="group" aria-label={label}>
          {DAYS.map((day) => (
            <button
              key={day.id}
              type="button"
              data-part="day"
              data-weekend={day.weekend}
              aria-pressed={value.includes(day.id)}
              aria-label={day.full}
              onClick={() =>
                apply(
                  value.includes(day.id)
                    ? value.filter((item) => item !== day.id)
                    : [...value, day.id],
                )
              }
            >
              {day.short}
            </button>
          ))}
        </div>
        <p data-part="summary" role="status">
          {chosen.length === 0
            ? "Ни один день не выбран — доставки не будет."
            : `${chosen.length} ${plural(chosen.length)}: ${chosen
                .map((day) => day.short)
                .join(", ")}.`}
        </p>
        <p data-part="summary">{hint}</p>
      </section>
    </>
  )
}

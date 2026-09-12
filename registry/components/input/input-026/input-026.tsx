"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Input026Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  defaultValue?: string
  quick?: string[]
  /** Подпись списка частых значений для скринридера. */
  quickLabel?: string
  /** Примечание под полем. */
  noteText?: string
  onChange?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
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
--vibeui-input-026-surface:transparent;
--vibeui-input-026-shell:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-input-026-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-input-026-muted:color-mix(in oklab,var(--vibeui-input-026-fg) 68%,transparent);
--vibeui-input-026-field:light-dark(oklch(0.985 0 265),oklch(0.26 0 265));
--vibeui-input-026-border:light-dark(oklch(0.88 0 265),oklch(0.38 0 265));
--vibeui-input-026-accent:light-dark(oklch(0.287 0 0),oklch(0.906 0 0));
--vibeui-input-026-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="input-026"]{color-scheme:dark}
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

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

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
  quickLabel = "Частые значения",
  noteText = "Шаг — 15 минут, ручной ввод округляется до ближайшего.",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Input026Props) {
  const id = useId()
  const [value, setValue] = useState(snap(defaultValue))

  const palette = {
    ...(accent ? { "--vibeui-input-026-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-input-026-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        data-slot="input"
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
        <ul data-part="quick" aria-label={quickLabel}>
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
          {noteText}
        </p>
      </div>
    </>
  )
}

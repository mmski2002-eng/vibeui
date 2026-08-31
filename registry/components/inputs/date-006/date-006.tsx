"use client"

import { useId, useState, useSyncExternalStore } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Date006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  defaultValue?: string
  soonInDays?: number
  accent?: string
}

// Идея компонента: срок, который сам говорит, что он в прошлом. Прошедшая дата
// формально валидна, поэтому браузер о ней молчит, а задача с таким сроком
// тихо уезжает в просрочку. Компонент сравнивает значение с сегодняшним днём и
// показывает одно из трёх состояний: прошло, скоро, в запасе. Сегодняшний день
// вычисляется после монтирования: считать его при отрисовке значит получить на
// сервере и на клиенте разные даты и расхождение при гидратации. До первого
// эффекта состояние нейтральное — это честнее, чем мигнуть ложной тревогой.
const STYLES = `
:where([data-vibeui-block="date-006"]){
--vibeui-date-006-surface:oklch(1 0 0);
--vibeui-date-006-field:oklch(1 0 0);
--vibeui-date-006-shell:oklch(0.9 0.006 265);
--vibeui-date-006-fg:oklch(0.23 0.014 265);
--vibeui-date-006-muted:oklch(0.55 0.014 265);
--vibeui-date-006-border:oklch(0.88 0.008 265);
--vibeui-date-006-ok:oklch(0.55 0.14 160);
--vibeui-date-006-soon:oklch(0.66 0.15 70);
--vibeui-date-006-past:oklch(0.56 0.19 25);
--vibeui-date-006-accent:var(--vibeui-date-006-ok);
--vibeui-date-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: поле показывают поверх любого фона. */
[data-vibeui-block="date-006"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-date-006-surface);
border:1px solid var(--vibeui-date-006-shell);border-radius:0.875rem;
font-family:var(--vibeui-date-006-font);color:var(--vibeui-date-006-fg);
}
/* Одна переменная на состояние: цвет рамки, полосы и текста меняется разом. */
[data-vibeui-block="date-006"][data-state="soon"]{--vibeui-date-006-accent:var(--vibeui-date-006-soon)}
[data-vibeui-block="date-006"][data-state="past"]{--vibeui-date-006-accent:var(--vibeui-date-006-past)}
[data-vibeui-block="date-006"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="date-006"] input{
width:100%;box-sizing:border-box;height:2.75rem;padding:0 0.75rem;
background:var(--vibeui-date-006-field);color:inherit;
border:1px solid var(--vibeui-date-006-border);border-radius:0.625rem;
font:inherit;font-size:0.9375rem;font-weight:650;font-variant-numeric:tabular-nums;
transition:border-color .16s ease;
}
[data-vibeui-block="date-006"][data-state="past"] input,
[data-vibeui-block="date-006"][data-state="soon"] input{border-color:var(--vibeui-date-006-accent)}
[data-vibeui-block="date-006"] input:focus-visible{
outline:2px solid var(--vibeui-date-006-accent);outline-offset:1px;border-color:var(--vibeui-date-006-accent);
}
[data-vibeui-block="date-006"] input::-webkit-calendar-picker-indicator{cursor:pointer;opacity:.55}
[data-vibeui-block="date-006"] input::-webkit-calendar-picker-indicator:hover{opacity:1}
/* Полоса слева вместо иконки: цвет читается боковым зрением. */
[data-vibeui-block="date-006"] [data-part="status"]{
display:flex;align-items:center;gap:0.5rem;margin:0;
padding:0.4375rem 0.625rem;border-radius:0.5rem;
border-left:3px solid var(--vibeui-date-006-accent);
background:color-mix(in oklch,var(--vibeui-date-006-accent) 10%,transparent);
font-size:0.75rem;line-height:1.4;color:var(--vibeui-date-006-fg);
}
[data-vibeui-block="date-006"] [data-part="status"] b{color:var(--vibeui-date-006-accent);font-weight:700}
[data-vibeui-block="date-006"] [data-part="status"][data-idle="true"]{
border-left-color:var(--vibeui-date-006-border);background:none;color:var(--vibeui-date-006-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="date-006"] *{animation:none!important;transition:none!important}}
`

const DAY = 86400000

// Часы устройства читаются как внешний источник: на сервере снимка нет вовсе,
// поэтому сравнивать нечего и гидратация не расходится.
const subscribeToClock = () => () => {}

function todayAtMidnight() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
}

function midnight(value: string) {
  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day).getTime()
}

function daysWord(count: number) {
  const tail = count % 10
  const teen = count % 100
  if (teen > 10 && teen < 20) return "дней"
  if (tail === 1) return "день"
  if (tail > 1 && tail < 5) return "дня"
  return "дней"
}

/**
 * Поле срока, которое предупреждает о прошедшей и о близкой дате.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Date006({
  label = "Срок сдачи",
  defaultValue = "2026-09-04",
  soonInDays = 3,
  accent,
  className,
  style,
  ...props
}: Date006Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  // Сегодняшний день приходит только с клиента: на сервере снимок пустой.
  const today = useSyncExternalStore<number | null>(
    subscribeToClock,
    todayAtMidnight,
    () => null,
  )

  const target = midnight(value)
  const left =
    today !== null && target !== null
      ? Math.round((target - today) / DAY)
      : null

  const state =
    left === null
      ? "idle"
      : left < 0
        ? "past"
        : left <= soonInDays
          ? "soon"
          : "ok"

  const message =
    left === null
      ? "Срок сверяется с сегодняшним днём после загрузки."
      : left < 0
        ? `Срок прошёл ${Math.abs(left)} ${daysWord(Math.abs(left))} назад.`
        : left === 0
          ? "Срок истекает сегодня."
          : `В запасе ${left} ${daysWord(left)}.`

  const palette = {
    ...(accent ? { "--vibeui-date-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-date-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="date-006"
        data-state={state}
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type="date"
          value={value}
          aria-describedby={`${id}-status`}
          onChange={(event) => setValue(event.target.value)}
        />
        <p
          id={`${id}-status`}
          data-part="status"
          data-idle={state === "idle"}
          aria-live="polite"
        >
          {state === "past" ? <b>Просрочено.</b> : null}
          {message}
        </p>
      </div>
    </>
  )
}

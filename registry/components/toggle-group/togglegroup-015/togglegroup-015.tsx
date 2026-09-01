"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Togglegroup015Task = {
  id: string
  name: string
  status: "active" | "done" | "overdue"
}

export type Togglegroup015Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onChange"
> & {
  label?: string
  defaultValue?: string
  tasks?: Togglegroup015Task[]
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: фильтр-сегмент одиночным выбором, где у каждого сегмента
// есть счётчик. Число не зашито отдельно — оно всегда считается от того же
// набора задач, что и сам список ниже, поэтому цифра на сегменте и то, что
// покажет список после клика, никогда не разойдутся.
const STYLES = `
:where([data-vibeui-block="togglegroup-015"]){
--vibeui-togglegroup-015-bg:oklch(1 0 0);
--vibeui-togglegroup-015-fg:oklch(0.22 0.014 265);
--vibeui-togglegroup-015-muted:oklch(0.55 0.014 265);
--vibeui-togglegroup-015-border:oklch(0.9 0.006 265);
--vibeui-togglegroup-015-surface:oklch(0.97 0.004 265);
--vibeui-togglegroup-015-accent:oklch(0.55 0.15 265);
--vibeui-togglegroup-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="togglegroup-015"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:25rem;padding:0.875rem;
border:1px solid var(--vibeui-togglegroup-015-border);border-radius:0.875rem;
background:var(--vibeui-togglegroup-015-bg);color:var(--vibeui-togglegroup-015-fg);
font-family:var(--vibeui-togglegroup-015-font);
}
[data-vibeui-block="togglegroup-015"] *{box-sizing:border-box}
[data-vibeui-block="togglegroup-015"] [data-part="group"]{
display:flex;flex-wrap:wrap;gap:0.375rem;
}
[data-vibeui-block="togglegroup-015"] button{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;gap:0.375rem;
height:2rem;padding:0 0.625rem 0 0.75rem;
border:1px solid var(--vibeui-togglegroup-015-border);border-radius:9999px;
background:var(--vibeui-togglegroup-015-bg);color:var(--vibeui-togglegroup-015-muted);
font-size:0.8125rem;font-weight:600;line-height:1;
transition:background-color .15s ease,color .15s ease,border-color .15s ease;
}
[data-vibeui-block="togglegroup-015"] button:focus-visible{
outline:2px solid var(--vibeui-togglegroup-015-accent);outline-offset:2px;
}
[data-vibeui-block="togglegroup-015"] button[aria-pressed="true"]{
background:var(--vibeui-togglegroup-015-accent);border-color:var(--vibeui-togglegroup-015-accent);
color:oklch(0.99 0 0);
}
[data-vibeui-block="togglegroup-015"] [data-part="count"]{
display:inline-flex;align-items:center;justify-content:center;
min-width:1.25rem;height:1.25rem;padding:0 0.3125rem;border-radius:9999px;
background:var(--vibeui-togglegroup-015-surface);color:var(--vibeui-togglegroup-015-muted);
font-size:0.6875rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="togglegroup-015"] button[aria-pressed="true"] [data-part="count"]{
background:oklch(1 0 0 / 24%);color:oklch(0.99 0 0);
}
[data-vibeui-block="togglegroup-015"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.375rem}
[data-vibeui-block="togglegroup-015"] li{
padding:0.5rem 0.625rem;border-radius:0.5rem;background:var(--vibeui-togglegroup-015-surface);
font-size:0.8125rem;
}
[data-vibeui-block="togglegroup-015"] [data-part="empty"]{
margin:0;padding:0.75rem;border-radius:0.5rem;text-align:center;
background:var(--vibeui-togglegroup-015-surface);color:var(--vibeui-togglegroup-015-muted);
font-size:0.8125rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="togglegroup-015"] *{animation:none!important;transition:none!important}}
`

const STATUS_LABEL: Record<Togglegroup015Task["status"], string> = {
  active: "В работе",
  done: "Готово",
  overdue: "Просрочено",
}

const DEFAULT_TASKS: Togglegroup015Task[] = [
  { id: "1", name: "Собрать смету", status: "active" },
  { id: "2", name: "Согласовать макет", status: "done" },
  { id: "3", name: "Продлить домен", status: "overdue" },
  { id: "4", name: "Написать отчёт", status: "active" },
  { id: "5", name: "Отправить договор", status: "done" },
  { id: "6", name: "Оплатить хостинг", status: "active" },
]

const FILTERS: { id: string; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "active", label: "Активные" },
  { id: "done", label: "Завершённые" },
  { id: "overdue", label: "Просроченные" },
]

/**
 * Фильтр-сегмент одиночным выбором со счётчиком в каждой кнопке: цифра
 * всегда считается от списка задач под группой. Один файл, ноль
 * зависимостей.
 */
export function Togglegroup015({
  label = "Задачи",
  defaultValue = "all",
  tasks = DEFAULT_TASKS,
  onChange,
  accent,
  className,
  style,
  ...props
}: Togglegroup015Props) {
  const [value, setValue] = useState(defaultValue)
  const listId = useId()

  const palette = {
    ...(accent ? { "--vibeui-togglegroup-015-accent": accent } : null),
    ...style,
  } as CSSProperties

  const countFor = (id: string) =>
    id === "all"
      ? tasks.length
      : tasks.filter((task) => task.status === id).length

  const shown =
    value === "all" ? tasks : tasks.filter((task) => task.status === value)

  return (
    <>
      <style href="vibeui-togglegroup-015" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="togglegroup-015"
        className={className}
        style={palette}
      >
        <div data-part="group" role="group" aria-label={label}>
          {FILTERS.map((filter) => {
            const count = countFor(filter.id)

            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={value === filter.id}
                aria-label={`${filter.label}, ${count}`}
                aria-controls={listId}
                onClick={() => {
                  setValue(filter.id)
                  onChange?.(filter.id)
                }}
              >
                <span aria-hidden="true">{filter.label}</span>
                <span data-part="count" aria-hidden="true">
                  {count}
                </span>
              </button>
            )
          })}
        </div>
        {shown.length === 0 ? (
          <p data-part="empty" id={listId}>
            В этой категории пока пусто.
          </p>
        ) : (
          <ul id={listId}>
            {shown.map((task) => (
              <li key={task.id}>
                {task.name} — {STATUS_LABEL[task.status]}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

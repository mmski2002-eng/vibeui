"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Togglegroup015Task = {
  id: string
  name: string
  status: "active" | "done" | "overdue"
}

export type Togglegroup015Props = Omit<
  ComponentProps<"section">,
  "children" | "onChange"
> & {
  label?: string
  defaultValue?: string
  tasks?: Togglegroup015Task[]
  /** Подписи фильтров: компонент несёт русские, проект подставляет свои. */
  filterText?: Record<string, string>
  /** Подписи статусов задач. */
  statusText?: Record<Togglegroup015Task["status"], string>
  /** Строка на месте пустого списка. */
  emptyText?: string
  onChange?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: фильтр-сегмент одиночным выбором, где у каждого сегмента
// есть счётчик. Число не зашито отдельно — оно всегда считается от того же
// набора задач, что и сам список ниже, поэтому цифра на сегменте и то, что
// покажет список после клика, никогда не разойдутся.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="togglegroup-015"]){
--vibeui-togglegroup-015-bg:transparent;
--vibeui-togglegroup-015-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-togglegroup-015-muted:color-mix(in oklab,var(--vibeui-togglegroup-015-fg) 68%,transparent);
--vibeui-togglegroup-015-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-togglegroup-015-surface:light-dark(oklch(0.97 0 265),oklch(0.28 0 265));
--vibeui-togglegroup-015-accent:light-dark(oklch(0.55 0.15 265),oklch(0.73 0.13 265));
--vibeui-togglegroup-015-on-accent:light-dark(oklch(0.99 0 0),oklch(0.18 0 265));
--vibeui-togglegroup-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="togglegroup-015"]{color-scheme:dark}
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
background:transparent;color:var(--vibeui-togglegroup-015-muted);
font-size:0.8125rem;font-weight:600;line-height:1;
transition:background-color .15s ease,color .15s ease,border-color .15s ease;
}
[data-vibeui-block="togglegroup-015"] button:focus-visible{
outline:2px solid var(--vibeui-togglegroup-015-accent);outline-offset:2px;
}
[data-vibeui-block="togglegroup-015"] button[aria-pressed="true"]{
background:var(--vibeui-togglegroup-015-accent);border-color:var(--vibeui-togglegroup-015-accent);
color:var(--vibeui-togglegroup-015-on-accent);
}
[data-vibeui-block="togglegroup-015"] [data-part="count"]{
display:inline-flex;align-items:center;justify-content:center;
min-width:1.25rem;height:1.25rem;padding:0 0.3125rem;border-radius:9999px;
background:var(--vibeui-togglegroup-015-surface);color:var(--vibeui-togglegroup-015-muted);
font-size:0.6875rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="togglegroup-015"] button[aria-pressed="true"] [data-part="count"]{
background:color-mix(in oklab,var(--vibeui-togglegroup-015-on-accent) 22%,transparent);
color:var(--vibeui-togglegroup-015-on-accent);
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

const FILTERS = ["all", "active", "done", "overdue"]

const FILTER_LABEL: Record<string, string> = {
  all: "Все",
  active: "Активные",
  done: "Завершённые",
  overdue: "Просроченные",
}

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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

/**
 * Стрелки водят фокус внутри группы: до дальней кнопки не нужно дожимать
 * Tab через все предыдущие, а Home и End бросают на края.
 */
function moveFocus(event: KeyboardEvent<HTMLDivElement>) {
  const step =
    event.key === "ArrowRight" || event.key === "ArrowDown"
      ? 1
      : event.key === "ArrowLeft" || event.key === "ArrowUp"
        ? -1
        : 0

  if (step === 0 && event.key !== "Home" && event.key !== "End") {
    return
  }

  const buttons = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>("button"),
  )
  const from = buttons.indexOf(document.activeElement as HTMLButtonElement)

  if (from === -1) {
    return
  }

  const last = buttons.length - 1
  const next =
    event.key === "Home" ? 0 : event.key === "End" ? last : from + step

  event.preventDefault()
  buttons[next < 0 ? last : next > last ? 0 : next].focus()
}

/**
 * Фильтр-сегмент одиночным выбором со счётчиком в каждой кнопке: цифра
 * всегда считается от списка задач под группой. Один файл, ноль
 * зависимостей.
 */
export function Togglegroup015({
  label = "Задачи",
  defaultValue = "all",
  tasks = DEFAULT_TASKS,
  filterText = FILTER_LABEL,
  statusText = STATUS_LABEL,
  emptyText = "В этой категории пока пусто.",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Togglegroup015Props) {
  const [value, setValue] = useState(defaultValue)
  const listId = useId()

  const palette = {
    ...(accent ? { "--vibeui-togglegroup-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-togglegroup-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        data-slot="toggle-group"
        data-vibeui-block="togglegroup-015"
        className={className}
        style={palette}
      >
        <div
          data-part="group"
          role="group"
          aria-label={label}
          onKeyDown={moveFocus}
        >
          {FILTERS.map((filter) => {
            const count = countFor(filter)
            const caption = filterText[filter] ?? FILTER_LABEL[filter] ?? filter

            return (
              <button
                key={filter}
                type="button"
                aria-pressed={value === filter}
                aria-label={`${caption}, ${count}`}
                aria-controls={listId}
                onClick={() => {
                  setValue(filter)
                  onChange?.(filter)
                }}
              >
                <span aria-hidden="true">{caption}</span>
                <span data-part="count" aria-hidden="true">
                  {count}
                </span>
              </button>
            )
          })}
        </div>
        {shown.length === 0 ? (
          <p data-part="empty" id={listId}>
            {emptyText}
          </p>
        ) : (
          <ul id={listId}>
            {shown.map((task) => (
              <li key={task.id}>
                {task.name} —{" "}
                {statusText[task.status] ?? STATUS_LABEL[task.status]}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

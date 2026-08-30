"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Checkbox007Task = {
  id: string
  text: string
  due?: string
}

export type Checkbox007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  title?: string
  tasks?: Checkbox007Task[]
  defaultDone?: string[]
  onChange?: (done: string[]) => void
  accent?: string
}

// Идея компонента: чеклист с зачёркиванием. Выполненные не исчезают и не
// уезжают вниз: список, который переставляет строки под курсором, невозможно
// заполнять. Зачёркнутый текст приглушён, но читаем — это память о сделанном,
// а не мусор.
const STYLES = `
:where([data-vibeui-block="checkbox-007"]){
--vibeui-checkbox-007-bg:oklch(1 0 0);
--vibeui-checkbox-007-fg:oklch(0.22 0.014 265);
--vibeui-checkbox-007-muted:oklch(0.58 0.014 265);
--vibeui-checkbox-007-border:oklch(0.9 0.006 265);
--vibeui-checkbox-007-accent:oklch(0.55 0.15 152);
--vibeui-checkbox-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="checkbox-007"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-checkbox-007-bg);
border:1px solid var(--vibeui-checkbox-007-border);border-radius:0.875rem;
font-family:var(--vibeui-checkbox-007-font);color:var(--vibeui-checkbox-007-fg);
}
[data-vibeui-block="checkbox-007"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
margin-bottom:0.125rem;
}
[data-vibeui-block="checkbox-007"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="checkbox-007"] [data-part="progress"]{font-size:0.75rem;color:var(--vibeui-checkbox-007-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="checkbox-007"] label{
display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:0.5rem;
min-height:2rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="checkbox-007"] input{
appearance:none;flex:none;cursor:pointer;position:relative;
width:1.125rem;height:1.125rem;margin:0;box-sizing:border-box;
border:1.5px solid var(--vibeui-checkbox-007-border);border-radius:9999px;
background:var(--vibeui-checkbox-007-bg);
}
[data-vibeui-block="checkbox-007"] input:checked{border-color:transparent;background:var(--vibeui-checkbox-007-accent)}
[data-vibeui-block="checkbox-007"] input:checked::after{
content:"";position:absolute;left:50%;top:50%;
width:0.25rem;height:0.4375rem;margin:-0.3125rem 0 0 -0.125rem;
border-right:2px solid oklch(0.99 0.01 152);border-bottom:2px solid oklch(0.99 0.01 152);
transform:rotate(45deg);
}
[data-vibeui-block="checkbox-007"] input:focus-visible{outline:2px solid var(--vibeui-checkbox-007-accent);outline-offset:2px}
/* Сделанное зачёркнуто и приглушено, но остаётся на месте: список, который
   переставляет строки под курсором, невозможно заполнять. */
[data-vibeui-block="checkbox-007"] label:has(input:checked) [data-part="text"]{
text-decoration:line-through;color:var(--vibeui-checkbox-007-muted);
}
[data-vibeui-block="checkbox-007"] [data-part="due"]{
justify-self:end;font-size:0.6875rem;color:var(--vibeui-checkbox-007-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TASKS: Checkbox007Task[] = [
  { id: "1", text: "Описать компоненты категории", due: "сегодня" },
  { id: "2", text: "Проверить превью на телефоне", due: "завтра" },
  { id: "3", text: "Обновить инструкцию для агента", due: "пт" },
  { id: "4", text: "Выложить на прод", due: "пт" },
]

/**
 * Чеклист: выполненное зачёркивается, но остаётся на своём месте.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Checkbox007({
  title = "Задачи на неделю",
  tasks = DEFAULT_TASKS,
  defaultDone = ["1"],
  onChange,
  accent,
  className,
  style,
  ...props
}: Checkbox007Props) {
  const [done, setDone] = useState<string[]>(defaultDone)

  const palette = {
    ...(accent ? { "--vibeui-checkbox-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  const update = (next: string[]) => {
    setDone(next)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-checkbox-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="checkbox-007"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3 data-part="title">{title}</h3>
          <span data-part="progress">
            {done.length} из {tasks.length}
          </span>
        </div>
        {tasks.map((task) => (
          <label key={task.id}>
            <input
              type="checkbox"
              checked={done.includes(task.id)}
              onChange={() =>
                update(
                  done.includes(task.id)
                    ? done.filter((item) => item !== task.id)
                    : [...done, task.id],
                )
              }
            />
            <span data-part="text">{task.text}</span>
            {task.due ? <span data-part="due">{task.due}</span> : null}
          </label>
        ))}
      </div>
    </>
  )
}

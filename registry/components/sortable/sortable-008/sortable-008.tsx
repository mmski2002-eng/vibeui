"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties, DragEvent } from "react"

export type Sortable008Task = {
  id: string
  text: string
  done?: boolean
}

export type Sortable008Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  title?: string
  tasks?: Sortable008Task[]
  onChange?: (tasks: Sortable008Task[]) => void
  accent?: string
}

// Идея компонента: список задач, где готовность и порядок — две разные вещи.
// Чекбокс отмечает готовую задачу и зачёркивает текст, но не двигает строку —
// сортировка выполненного вниз была бы отдельным решением, не заявленным
// здесь. Порядок меняют перетаскиванием или кнопками со стрелками; после
// каждого переноса живая область целиком проговаривает новый список, а не
// только сдвинутую строку, — так порядок слышен весь, а не по кусочкам.
const STYLES = `
:where([data-vibeui-block="sortable-008"]){
--vibeui-sortable-008-bg:oklch(1 0 0);
--vibeui-sortable-008-row:oklch(0.99 0.002 265);
--vibeui-sortable-008-fg:oklch(0.24 0.014 265);
--vibeui-sortable-008-muted:oklch(0.56 0.014 265);
--vibeui-sortable-008-border:oklch(0.9 0.006 265);
--vibeui-sortable-008-accent:oklch(0.55 0.2 262);
--vibeui-sortable-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="sortable-008"]{
position:relative;width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-sortable-008-bg);
border:1px solid var(--vibeui-sortable-008-border);border-radius:0.875rem;
font-family:var(--vibeui-sortable-008-font);color:var(--vibeui-sortable-008-fg);
}
[data-vibeui-block="sortable-008"] *{box-sizing:border-box}
[data-vibeui-block="sortable-008"] h3{margin:0 0 0.625rem;font-size:0.875rem;font-weight:650}
[data-vibeui-block="sortable-008"] ol{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.375rem}
[data-vibeui-block="sortable-008"] li{
display:flex;align-items:center;gap:0.5rem;
padding:0.4375rem 0.5rem;border-radius:0.625rem;
border:1px solid var(--vibeui-sortable-008-border);
background:var(--vibeui-sortable-008-row);font-size:0.8125rem;
}
[data-vibeui-block="sortable-008"] li[data-dragging="true"]{opacity:.45}
[data-vibeui-block="sortable-008"] li[data-over="true"]{box-shadow:inset 0 2px 0 var(--vibeui-sortable-008-accent)}
[data-vibeui-block="sortable-008"] [data-part="grip"]{flex:none;display:grid;gap:2.5px;padding:0.25rem;cursor:grab}
[data-vibeui-block="sortable-008"] [data-part="grip"] span{
display:block;width:0.75rem;height:2px;border-radius:1px;
background:var(--vibeui-sortable-008-muted);opacity:.6;
}
[data-vibeui-block="sortable-008"] [data-part="check"]{
flex:none;width:1.125rem;height:1.125rem;margin:0;accent-color:var(--vibeui-sortable-008-accent);cursor:pointer;
}
[data-vibeui-block="sortable-008"] [data-part="check"]:focus-visible{outline:2px solid var(--vibeui-sortable-008-accent);outline-offset:2px}
[data-vibeui-block="sortable-008"] [data-part="text"]{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
/* Готовая задача зачёркнута и приглушена: порядок это не двигает. */
[data-vibeui-block="sortable-008"] li[data-done="true"] [data-part="text"]{
text-decoration:line-through;color:var(--vibeui-sortable-008-muted);
}
[data-vibeui-block="sortable-008"] [data-part="move"]{
flex:none;appearance:none;border:0;background:none;cursor:pointer;
width:1.5rem;height:1.5rem;border-radius:0.375rem;
color:var(--vibeui-sortable-008-muted);font:inherit;font-size:0.6875rem;line-height:1;
}
[data-vibeui-block="sortable-008"] [data-part="move"]:hover:not(:disabled){color:var(--vibeui-sortable-008-fg)}
[data-vibeui-block="sortable-008"] [data-part="move"]:disabled{opacity:.35;cursor:default}
[data-vibeui-block="sortable-008"] [data-part="move"]:focus-visible{outline:2px solid var(--vibeui-sortable-008-accent);outline-offset:1px}
[data-vibeui-block="sortable-008"] [data-part="live"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sortable-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TASKS: Sortable008Task[] = [
  { id: "brief", text: "Собрать бриф" },
  { id: "mock", text: "Сделать макет" },
  { id: "review", text: "Согласовать с командой" },
  { id: "build", text: "Свёрстать" },
  { id: "ship", text: "Опубликовать" },
]

/**
 * Список задач с перетаскиванием и кнопками для клавиатуры; готовность
 * задачи отмечается чекбоксом отдельно от порядка. Один файл, ноль
 * зависимостей, собственная палитра.
 */
export function Sortable008({
  title = "Задачи на сегодня",
  tasks = DEFAULT_TASKS,
  onChange,
  accent,
  className,
  style,
  ...props
}: Sortable008Props) {
  const [order, setOrder] = useState(tasks)
  const [dragged, setDragged] = useState<string | null>(null)
  const [over, setOver] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState("")

  const apply = (next: Sortable008Task[], announceOrder: boolean) => {
    setOrder(next)
    onChange?.(next)
    if (announceOrder) {
      setAnnouncement(`Новый порядок: ${next.map((task) => task.text).join(", ")}.`)
    }
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length) return
    const next = [...order]
    const [row] = next.splice(from, 1)
    next.splice(to, 0, row)
    apply(next, true)
  }

  const toggle = (id: string) => {
    apply(
      order.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
      false,
    )
  }

  const drop = (event: DragEvent<HTMLLIElement>, targetId: string) => {
    event.preventDefault()
    setOver(null)
    if (!dragged || dragged === targetId) return
    move(
      order.findIndex((task) => task.id === dragged),
      order.findIndex((task) => task.id === targetId),
    )
    setDragged(null)
  }

  const palette = {
    ...(accent ? { "--vibeui-sortable-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sortable-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="sortable-008"
        className={className}
        style={palette}
      >
        <h3>{title}</h3>
        <ol>
          {order.map((task, index) => (
            <li
              key={task.id}
              draggable
              data-dragging={task.id === dragged}
              data-over={task.id === over}
              data-done={Boolean(task.done)}
              onDragStart={() => setDragged(task.id)}
              onDragEnd={() => {
                setDragged(null)
                setOver(null)
              }}
              onDragOver={(event) => {
                event.preventDefault()
                setOver(task.id)
              }}
              onDrop={(event) => drop(event, task.id)}
            >
              <span data-part="grip" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <input
                type="checkbox"
                data-part="check"
                checked={Boolean(task.done)}
                aria-label={`Готово: ${task.text}`}
                onChange={() => toggle(task.id)}
              />
              <span data-part="text">{task.text}</span>
              <button
                type="button"
                data-part="move"
                disabled={index === 0}
                aria-label={`Поднять «${task.text}», сейчас ${index + 1} из ${order.length}`}
                onClick={() => move(index, index - 1)}
              >
                ▲
              </button>
              <button
                type="button"
                data-part="move"
                disabled={index === order.length - 1}
                aria-label={`Опустить «${task.text}», сейчас ${index + 1} из ${order.length}`}
                onClick={() => move(index, index + 1)}
              >
                ▼
              </button>
            </li>
          ))}
        </ol>
        <span data-part="live" role="status" aria-live="polite">
          {announcement}
        </span>
      </div>
    </>
  )
}

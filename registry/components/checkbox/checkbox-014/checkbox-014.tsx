"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Checkbox014Task = {
  id: string
  text: string
}

export type Checkbox014Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onChange" | "title"
> & {
  title?: string
  tasks?: Checkbox014Task[]
  defaultDone?: string[]
  onChange?: (done: string[]) => void
  accent?: string
}

// Идея компонента: выполненные задачи не остаются в общем списке, а уезжают
// в свёрнутый блок «Готово» под ним. Активный список остаётся коротким, но
// сделанное никуда не пропадает — его можно раскрыть и снять галочку.
// Сверху полоса прогресса: доля выполненного видна без счёта в уме.
const STYLES = `
:where([data-vibeui-block="checkbox-014"]){
--vibeui-checkbox-014-bg:oklch(1 0 0);
--vibeui-checkbox-014-fg:oklch(0.22 0.014 265);
--vibeui-checkbox-014-muted:oklch(0.57 0.014 265);
--vibeui-checkbox-014-border:oklch(0.9 0.006 265);
--vibeui-checkbox-014-track:oklch(0.94 0.005 265);
--vibeui-checkbox-014-accent:oklch(0.56 0.14 150);
--vibeui-checkbox-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="checkbox-014"]{
display:block;width:100%;max-width:21rem;box-sizing:border-box;
padding:0.9375rem;border:1px solid var(--vibeui-checkbox-014-border);border-radius:0.9375rem;
background:var(--vibeui-checkbox-014-bg);
font-family:var(--vibeui-checkbox-014-font);color:var(--vibeui-checkbox-014-fg);
}
[data-vibeui-block="checkbox-014"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="checkbox-014"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="checkbox-014"] [data-part="ratio"]{
font-size:0.75rem;color:var(--vibeui-checkbox-014-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="checkbox-014"] [data-part="track"]{
display:block;height:0.3125rem;margin:0.5rem 0 0.625rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-checkbox-014-track);
}
[data-vibeui-block="checkbox-014"] [data-part="fill"]{
display:block;height:100%;border-radius:9999px;
background:var(--vibeui-checkbox-014-accent);
transition:width .25s ease;
}
[data-vibeui-block="checkbox-014"] ul{margin:0;padding:0;list-style:none}
[data-vibeui-block="checkbox-014"] label{
display:flex;align-items:center;gap:0.625rem;
min-height:2rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="checkbox-014"] input{
appearance:none;position:relative;flex:none;cursor:pointer;
width:1.125rem;height:1.125rem;margin:0;box-sizing:border-box;
border:1.5px solid var(--vibeui-checkbox-014-border);border-radius:0.375rem;
background:var(--vibeui-checkbox-014-bg);
transition:background-color .15s ease,border-color .15s ease;
}
[data-vibeui-block="checkbox-014"] input:checked{border-color:transparent;background:var(--vibeui-checkbox-014-accent)}
[data-vibeui-block="checkbox-014"] input:checked::after{
content:"";position:absolute;left:50%;top:50%;
width:0.25rem;height:0.4375rem;margin:-0.3125rem 0 0 -0.125rem;
border-right:2px solid oklch(0.99 0.01 150);border-bottom:2px solid oklch(0.99 0.01 150);
transform:rotate(45deg);
}
[data-vibeui-block="checkbox-014"] input:focus-visible{outline:2px solid var(--vibeui-checkbox-014-accent);outline-offset:2px}
[data-vibeui-block="checkbox-014"] [data-part="empty"]{
margin:0.25rem 0;font-size:0.8125rem;color:var(--vibeui-checkbox-014-muted);
}
/* Готовое живёт в <details>: свёрнуто по умолчанию, раскрывается без
   единой строки JS и остаётся доступным с клавиатуры. */
[data-vibeui-block="checkbox-014"] details{
margin-top:0.625rem;padding-top:0.625rem;
border-top:1px solid var(--vibeui-checkbox-014-border);
}
[data-vibeui-block="checkbox-014"] summary{
cursor:pointer;font-size:0.75rem;font-weight:650;color:var(--vibeui-checkbox-014-muted);
list-style:none;
}
[data-vibeui-block="checkbox-014"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="checkbox-014"] summary::before{
content:"▸";display:inline-block;width:0.875rem;
transition:transform .15s ease;
}
[data-vibeui-block="checkbox-014"] details[open] summary::before{transform:rotate(90deg)}
[data-vibeui-block="checkbox-014"] summary:focus-visible{outline:2px solid var(--vibeui-checkbox-014-accent);outline-offset:2px;border-radius:0.25rem}
[data-vibeui-block="checkbox-014"] details label span{
text-decoration:line-through;color:var(--vibeui-checkbox-014-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TASKS: Checkbox014Task[] = [
  { id: "1", text: "Собрать требования" },
  { id: "2", text: "Нарисовать макет" },
  { id: "3", text: "Согласовать с командой" },
  { id: "4", text: "Написать компонент" },
  { id: "5", text: "Проверить на телефоне" },
]

/**
 * Список задач, где выполненное уезжает в свёрнутый блок «Готово»,
 * а сверху идёт полоса прогресса. Один файл, ноль зависимостей.
 */
export function Checkbox014({
  title = "Запуск раздела",
  tasks = DEFAULT_TASKS,
  defaultDone = ["1", "2"],
  onChange,
  accent,
  className,
  style,
  ...props
}: Checkbox014Props) {
  const [done, setDone] = useState<string[]>(defaultDone)

  const palette = {
    ...(accent ? { "--vibeui-checkbox-014-accent": accent } : null),
    ...style,
  } as CSSProperties

  const toggle = (id: string) => {
    const next = done.includes(id)
      ? done.filter((item) => item !== id)
      : [...done, id]

    setDone(next)
    onChange?.(next)
  }

  const open = tasks.filter((task) => !done.includes(task.id))
  const closed = tasks.filter((task) => done.includes(task.id))
  const percent = tasks.length ? (closed.length / tasks.length) * 100 : 0

  return (
    <>
      <style href="vibeui-checkbox-014" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="checkbox-014"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="head">
          <h3 data-part="title">{title}</h3>
          <span data-part="ratio" role="status">
            {closed.length} из {tasks.length}
          </span>
        </div>
        <span
          data-part="track"
          role="progressbar"
          aria-valuenow={closed.length}
          aria-valuemin={0}
          aria-valuemax={tasks.length}
        >
          <span data-part="fill" style={{ width: `${percent}%` }} />
        </span>
        {open.length === 0 ? (
          <p data-part="empty">Все задачи выполнены.</p>
        ) : (
          <ul>
            {open.map((task) => (
              <li key={task.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => toggle(task.id)}
                  />
                  <span>{task.text}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
        {closed.length > 0 ? (
          <details>
            <summary>Готово: {closed.length}</summary>
            <ul>
              {closed.map((task) => (
                <li key={task.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked
                      onChange={() => toggle(task.id)}
                    />
                    <span>{task.text}</span>
                  </label>
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </section>
    </>
  )
}

"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Checkbox007Task = {
  id: string
  text: string
  due?: string
}

export type Checkbox007Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  title?: string
  tasks?: Checkbox007Task[]
  defaultDone?: string[]
  /** Счётчик в шапке. {done} — сделано, {total} — всего задач. */
  progressText?: string
  onChange?: (done: string[]) => void
  /** Пусто — подложки нет, список лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: чеклист с зачёркиванием. Выполненные не исчезают и не
// уезжают вниз: список, который переставляет строки под курсором, невозможно
// заполнять. Зачёркнутый текст приглушён, но читаем — это память о сделанном,
// а не мусор.
//
// Тема берётся из color-scheme окружения через light-dark(): список темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="checkbox-007"]){
--vibeui-checkbox-007-surface:transparent;
--vibeui-checkbox-007-bg:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-checkbox-007-fg:light-dark(oklch(0.22 0 265),oklch(0.95 0 265));
--vibeui-checkbox-007-muted:color-mix(in oklab,var(--vibeui-checkbox-007-fg) 68%,transparent);
--vibeui-checkbox-007-border:light-dark(oklch(0.9 0 265),oklch(0.38 0 265));
--vibeui-checkbox-007-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-checkbox-007-mark:light-dark(oklch(0.99 0.01 152),oklch(0.2 0.03 152));
--vibeui-checkbox-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="checkbox-007"]{color-scheme:dark}
[data-vibeui-block="checkbox-007"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-checkbox-007-surface);
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
display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:0.625rem;
min-height:2rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="checkbox-007"] input{
appearance:none;flex:none;cursor:pointer;position:relative;
width:1.125rem;height:1.125rem;margin:0;box-sizing:border-box;
border:1.5px solid var(--vibeui-checkbox-007-border);border-radius:9999px;
background:var(--vibeui-checkbox-007-bg);
}
[data-vibeui-block="checkbox-007"] input:checked{border-color:transparent;background:var(--vibeui-checkbox-007-accent);color:oklch(from var(--vibeui-checkbox-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="checkbox-007"] input:checked::after{
content:"";position:absolute;left:50%;top:50%;
width:0.25rem;height:0.4375rem;margin:-0.3125rem 0 0 -0.125rem;
border-right:2px solid var(--vibeui-checkbox-007-mark);
border-bottom:2px solid var(--vibeui-checkbox-007-mark);
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
 * Чеклист: выполненное зачёркивается, но остаётся на своём месте.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Checkbox007({
  title = "Задачи на неделю",
  tasks = DEFAULT_TASKS,
  defaultDone = ["1"],
  progressText = "{done} из {total}",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Checkbox007Props) {
  const [done, setDone] = useState<string[]>(defaultDone)

  const palette = {
    ...(accent ? { "--vibeui-checkbox-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-checkbox-007-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const update = (next: string[]) => {
    setDone(next)
    onChange?.(next)
  }

  const progress = progressText
    .replace("{done}", String(done.length))
    .replace("{total}", String(tasks.length))

  return (
    <>
      <style href="vibeui-checkbox-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="checkbox"
        data-vibeui-block="checkbox-007"
        className={className}
        style={palette}
        role="group"
        aria-label={title}
      >
        <div data-part="head">
          <h3 data-part="title">{title}</h3>
          <span data-part="progress" role="status">
            {progress}
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

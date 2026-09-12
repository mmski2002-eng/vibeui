"use client"

import { useEffect, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Toast024Task = {
  id: string
  label: string
  /** Сколько шагов в задаче: по ним считается общая доля. */
  total: number
  /** Сколько уже сделано при первом показе. */
  done?: number
  /** Задача заканчивается отказом: показ смешанного итога. */
  fails?: boolean
}

export type Toast024Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  tasks?: Toast024Task[]
  /** Заголовок с общим счётом. {done} и {total} подставляются. */
  titleTemplate?: string
  doneText?: string
  /** Подпись смешанного итога. {failed} — сколько не удалось. */
  mixedTemplate?: string
  expandLabel?: string
  collapseLabel?: string
  /** Сколько миллисекунд на шаг: имитация фоновой работы. */
  stepMs?: number
  tone?: string
  /** Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: фоновых задач сразу несколько, и каждая со своим
// сообщением превращает угол экрана в ленту. Здесь одно сообщение на все:
// сверху общий счёт и полоса, внутри — список задач, который разворачивают,
// когда нужны подробности. Общая доля считается по шагам, а не по числу
// задач: три файла по гигабайту и один по мегабайту двигают полосу
// по-разному, и усреднять их поштучно значит врать. Итог не молчит про
// неудачи: «готово» при двух отказах — самая обидная разновидность лжи.
const STYLES = `
:where([data-vibeui-block="toast-024"]){
--vibeui-toast-024-bg:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-toast-024-fg:light-dark(oklch(0.24 0 265),oklch(0.95 0 265));
--vibeui-toast-024-muted:color-mix(in oklab,var(--vibeui-toast-024-fg) 64%,transparent);
--vibeui-toast-024-border:light-dark(oklch(0.89 0 265),oklch(0.36 0 265));
--vibeui-toast-024-hover:light-dark(oklch(0 0 0 / 5%),oklch(1 0 0 / 7%));
--vibeui-toast-024-track:light-dark(oklch(0 0 0 / 10%),oklch(1 0 0 / 14%));
--vibeui-toast-024-tone:light-dark(oklch(0.275 0 0),oklch(0.91 0 0));
--vibeui-toast-024-ok:light-dark(oklch(0.46 0.13 152),oklch(0.82 0.13 152));
--vibeui-toast-024-error:light-dark(oklch(0.53 0.19 25),oklch(0.79 0.15 25));
--vibeui-toast-024-shadow:light-dark(oklch(0.2 0 265 / 22%),oklch(0 0 0 / 58%));
--vibeui-toast-024-radius:0.875rem;
--vibeui-toast-024-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="toast-024"]{color-scheme:dark}
[data-vibeui-block="toast-024"]{
width:100%;max-width:23rem;box-sizing:border-box;
font-family:var(--vibeui-toast-024-font);color:var(--vibeui-toast-024-fg);
}
[data-vibeui-block="toast-024"] *{box-sizing:border-box}
[data-vibeui-block="toast-024"] [data-part="card"]{
display:flex;flex-direction:column;gap:0.5rem;
padding:0.75rem 0.875rem;
border:1px solid var(--vibeui-toast-024-border);border-radius:var(--vibeui-toast-024-radius);
background:var(--vibeui-toast-024-bg);
box-shadow:0 16px 40px -26px var(--vibeui-toast-024-shadow);
}
[data-vibeui-block="toast-024"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="toast-024"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="toast-024"] [data-part="percent"]{
flex:none;font-size:0.75rem;font-weight:650;color:var(--vibeui-toast-024-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="toast-024"] [data-part="track"]{
height:0.3125rem;border-radius:999px;overflow:hidden;
background:var(--vibeui-toast-024-track);
}
[data-vibeui-block="toast-024"] [data-part="fill"]{
display:block;height:100%;border-radius:inherit;
background:var(--vibeui-toast-024-tone);
transition:width .3s ease;
}
[data-vibeui-block="toast-024"][data-state="done"] [data-part="fill"]{background:var(--vibeui-toast-024-ok)}
[data-vibeui-block="toast-024"][data-state="mixed"] [data-part="fill"]{background:var(--vibeui-toast-024-error)}
/* Список задач свёрнут: пока всё идёт, хватает общей полосы, а подробности
   нужны, когда что-то встало. */
[data-vibeui-block="toast-024"] [data-part="toggle"]{
appearance:none;border:0;cursor:pointer;align-self:flex-start;
padding:0.125rem 0.25rem;border-radius:0.375rem;
background:transparent;color:var(--vibeui-toast-024-muted);
font:inherit;font-size:0.75rem;text-decoration:underline;text-underline-offset:0.2em;
}
[data-vibeui-block="toast-024"] [data-part="toggle"]:hover{color:var(--vibeui-toast-024-fg)}
[data-vibeui-block="toast-024"] [data-part="list"]{
display:flex;flex-direction:column;gap:0.25rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="toast-024"] [data-part="row"]{
display:flex;align-items:center;gap:0.5rem;font-size:0.8125rem;
}
[data-vibeui-block="toast-024"] [data-part="name"]{
flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="toast-024"] [data-part="state"]{
flex:none;font-size:0.75rem;color:var(--vibeui-toast-024-muted);font-variant-numeric:tabular-nums;
}
/* Итог каждой задачи назван словом рядом со значком: по одной галочке
   отличить «готово» от «не удалось» нельзя. */
[data-vibeui-block="toast-024"] [data-part="row"][data-done="true"] [data-part="state"]{color:var(--vibeui-toast-024-ok)}
[data-vibeui-block="toast-024"] [data-part="row"][data-failed="true"] [data-part="state"]{color:var(--vibeui-toast-024-error)}
[data-vibeui-block="toast-024"] [data-part="foot"]{
margin:0;font-size:0.75rem;color:var(--vibeui-toast-024-muted);
}
[data-vibeui-block="toast-024"][data-state="mixed"] [data-part="foot"]{color:var(--vibeui-toast-024-error);font-weight:600}
[data-vibeui-block="toast-024"] :focus-visible{outline:2px solid var(--vibeui-toast-024-tone);outline-offset:2px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="toast-024"] [data-part="fill"]{transition:none}
[data-vibeui-block="toast-024"] *{animation:none!important}
}
`

const DEFAULT_TASKS: Toast024Task[] = [
  { id: "photos", label: "Фотографии каталога", total: 24, done: 9 },
  { id: "invoices", label: "Счета за август", total: 6, done: 2 },
  { id: "backup", label: "Резервная копия", total: 10, done: 4, fails: true },
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
 * Одно сообщение на несколько фоновых задач: общая полоса и список внутри.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast024({
  tasks = DEFAULT_TASKS,
  titleTemplate = "Фоновые задачи: {done} из {total}",
  doneText = "Все задачи завершены",
  mixedTemplate = "Завершено с ошибками: {failed}",
  expandLabel = "Показать задачи",
  collapseLabel = "Свернуть список",
  stepMs = 260,
  tone,
  background = "",
  className,
  style,
  ...props
}: Toast024Props) {
  const [progress, setProgress] = useState<Record<string, number>>(() =>
    Object.fromEntries(tasks.map((task) => [task.id, task.done ?? 0])),
  )
  const [open, setOpen] = useState(false)

  const total = tasks.reduce((sum, task) => sum + task.total, 0)
  const done = tasks.reduce(
    (sum, task) => sum + Math.min(progress[task.id] ?? 0, task.total),
    0,
  )
  const running = done < total

  useEffect(() => {
    if (!running) {
      return
    }

    const timer = window.setInterval(() => {
      setProgress((current) => {
        const next = { ...current }

        for (const task of tasks) {
          const value = next[task.id] ?? 0

          if (value < task.total) {
            next[task.id] = value + 1
            break
          }
        }

        return next
      })
    }, stepMs)

    return () => window.clearInterval(timer)
  }, [running, stepMs, tasks])

  const failed = running ? 0 : tasks.filter((task) => task.fails).length
  const state = running ? "running" : failed > 0 ? "mixed" : "done"

  // Доля считается по шагам, а не по числу задач: усреднять поштучно значит
  // врать, когда задачи разного размера.
  const percent = total > 0 ? Math.round((done / total) * 100) : 100

  const palette = {
    ...(tone ? { "--vibeui-toast-024-tone": tone } : null),
    ...(background
      ? {
          "--vibeui-toast-024-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toast-024" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="toast"
        data-vibeui-block="toast-024"
        data-state={state}
        role="status"
        aria-live="polite"
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="head">
            <p data-part="title">
              {titleTemplate
                .replace(
                  "{done}",
                  String(
                    tasks.filter(
                      (task) => (progress[task.id] ?? 0) >= task.total,
                    ).length,
                  ),
                )
                .replace("{total}", String(tasks.length))}
            </p>
            <span data-part="percent">{percent}%</span>
          </div>

          <span
            data-part="track"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span data-part="fill" style={{ width: `${percent}%` }} />
          </span>

          <button
            type="button"
            data-part="toggle"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? collapseLabel : expandLabel}
          </button>

          {open ? (
            <ul data-part="list">
              {tasks.map((task) => {
                const value = Math.min(progress[task.id] ?? 0, task.total)
                const complete = value >= task.total

                return (
                  <li
                    key={task.id}
                    data-part="row"
                    data-done={complete && !task.fails ? true : undefined}
                    data-failed={complete && task.fails ? true : undefined}
                  >
                    <span data-part="name">{task.label}</span>
                    <span data-part="state">
                      {complete
                        ? task.fails
                          ? "не удалось"
                          : "готово"
                        : `${value} из ${task.total}`}
                    </span>
                  </li>
                )
              })}
            </ul>
          ) : null}

          {!running ? (
            <p data-part="foot">
              {failed > 0
                ? mixedTemplate.replace("{failed}", String(failed))
                : doneText}
            </p>
          ) : null}
        </div>
      </div>
    </>
  )
}

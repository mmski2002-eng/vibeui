"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Toast023Problem = {
  /** Поле, к которому ведёт строка: имя или идентификатор. */
  field: string
  text: string
}

export type Toast023Props = Omit<ComponentProps<"div">, "children" | "title"> & {
  /** Заголовок сводки. {count} — сколько полей с ошибкой. */
  titleTemplate?: string
  problems?: Toast023Problem[]
  /** Подпись перехода к полю. {field} подставляется. */
  jumpTemplate?: string
  /** Подпись кнопки перехода к первому полю. */
  firstLabel?: string
  closeLabel?: string
  /** Что показать, когда переход уже сделан. {field} подставляется. */
  jumpedTemplate?: string
  /** Строка на месте закрытой сводки: ошибки никуда не делись. */
  hiddenText?: string
  showLabel?: string
  danger?: string
  /** Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: форма не отправилась, и человеку нужно не «проверьте
// поля», а список — какие именно и где. Сводка перечисляет ошибки строками,
// и каждая строка сама ведёт к своему полю: искать красную рамку среди
// двадцати полей — работа, которую должен делать не человек. Заголовок
// считает поля, а не ошибки: «три ошибки» в одном поле пугают сильнее, чем
// стоило бы. Сообщение не исчезает по таймеру: пока форма не отправлена,
// список остаётся нужен.
const STYLES = `
:where([data-vibeui-block="toast-023"]){
--vibeui-toast-023-bg:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-toast-023-fg:light-dark(oklch(0.24 0 265),oklch(0.95 0 265));
--vibeui-toast-023-muted:color-mix(in oklab,var(--vibeui-toast-023-fg) 64%,transparent);
--vibeui-toast-023-border:light-dark(oklch(0.89 0 265),oklch(0.36 0 265));
--vibeui-toast-023-hover:light-dark(oklch(0 0 0 / 5%),oklch(1 0 0 / 7%));
--vibeui-toast-023-danger:light-dark(oklch(0.53 0.19 25),oklch(0.79 0.15 25));
--vibeui-toast-023-danger-soft:color-mix(in oklab,var(--vibeui-toast-023-danger) 12%,transparent);
--vibeui-toast-023-on-danger:oklch(from var(--vibeui-toast-023-danger) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-toast-023-shadow:light-dark(oklch(0.2 0 265 / 22%),oklch(0 0 0 / 58%));
--vibeui-toast-023-radius:0.875rem;
--vibeui-toast-023-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="toast-023"]{color-scheme:dark}
[data-vibeui-block="toast-023"]{
width:100%;max-width:23rem;box-sizing:border-box;
font-family:var(--vibeui-toast-023-font);color:var(--vibeui-toast-023-fg);
}
[data-vibeui-block="toast-023"] *{box-sizing:border-box}
[data-vibeui-block="toast-023"] [data-part="card"]{
display:flex;flex-direction:column;gap:0.5rem;
padding:0.75rem 0.875rem;
border:1px solid var(--vibeui-toast-023-border);border-radius:var(--vibeui-toast-023-radius);
border-inline-start:3px solid var(--vibeui-toast-023-danger);
background:var(--vibeui-toast-023-bg);
box-shadow:0 16px 40px -26px var(--vibeui-toast-023-shadow);
}
[data-vibeui-block="toast-023"] [data-part="head"]{
display:flex;align-items:flex-start;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="toast-023"] [data-part="title"]{
margin:0;font-size:0.875rem;font-weight:650;color:var(--vibeui-toast-023-danger);
}
[data-vibeui-block="toast-023"] [data-part="close"]{
appearance:none;border:0;cursor:pointer;flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;border-radius:0.4375rem;
background:transparent;color:var(--vibeui-toast-023-muted);font:inherit;
}
[data-vibeui-block="toast-023"] [data-part="close"]:hover{background:var(--vibeui-toast-023-hover);color:var(--vibeui-toast-023-fg)}
[data-vibeui-block="toast-023"] [data-part="list"]{
display:flex;flex-direction:column;gap:0.125rem;margin:0;padding:0;list-style:none;
}
/* Каждая строка сама ведёт к полю: искать красную рамку среди двадцати
   полей — работа, которую человек делать не должен. */
[data-vibeui-block="toast-023"] [data-part="jump"]{
appearance:none;border:0;cursor:pointer;width:100%;text-align:left;
display:flex;align-items:baseline;gap:0.5rem;
padding:0.3125rem 0.4375rem;border-radius:0.5rem;
background:transparent;color:inherit;font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="toast-023"] [data-part="jump"]:hover{background:var(--vibeui-toast-023-danger-soft)}
[data-vibeui-block="toast-023"] [data-part="field"]{
flex:none;font-weight:650;color:var(--vibeui-toast-023-danger);
}
[data-vibeui-block="toast-023"] [data-part="text"]{min-width:0;color:var(--vibeui-toast-023-muted)}
[data-vibeui-block="toast-023"] [data-part="foot"]{
display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="toast-023"] [data-part="first"]{
appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:1.875rem;padding:0.25rem 0.75rem;border-radius:0.5rem;
background:var(--vibeui-toast-023-danger);color:var(--vibeui-toast-023-on-danger);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="toast-023"] [data-part="done"]{
font-size:0.75rem;color:var(--vibeui-toast-023-muted);
}
[data-vibeui-block="toast-023"] [data-part="hidden"]{
display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0.5rem;
margin:0;padding:0.625rem 0.875rem;
border:1px dashed var(--vibeui-toast-023-border);border-radius:var(--vibeui-toast-023-radius);
font-size:0.8125rem;color:var(--vibeui-toast-023-muted);
}
[data-vibeui-block="toast-023"] [data-part="show"]{
appearance:none;cursor:pointer;
min-height:1.75rem;padding:0.1875rem 0.625rem;border-radius:0.4375rem;
border:1px solid var(--vibeui-toast-023-border);
background:transparent;color:var(--vibeui-toast-023-fg);
font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="toast-023"] :focus-visible{outline:2px solid var(--vibeui-toast-023-danger);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-023"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PROBLEMS: Toast023Problem[] = [
  { field: "Телефон", text: "не хватает двух цифр" },
  { field: "Индекс", text: "шесть цифр без пробелов" },
  { field: "Согласие", text: "без него заявку не примут" },
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
 * Сводка ошибок формы: каждая строка ведёт к своему полю.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast023({
  titleTemplate = "Не заполнено полей: {count}",
  problems = DEFAULT_PROBLEMS,
  jumpTemplate = "Перейти к полю «{field}»",
  firstLabel = "К первому полю",
  closeLabel = "Закрыть сводку",
  jumpedTemplate = "Курсор в поле «{field}»",
  hiddenText = "Сводка скрыта, поля не заполнены",
  showLabel = "Показать",
  danger,
  background = "",
  className,
  style,
  ...props
}: Toast023Props) {
  const [jumped, setJumped] = useState("")
  const [open, setOpen] = useState(true)

  const palette = {
    ...(danger ? { "--vibeui-toast-023-danger": danger } : null),
    ...(background
      ? {
          "--vibeui-toast-023-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toast-023" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="toast"
        data-vibeui-block="toast-023"
        // Сводка ошибок — это отказ, а не уведомление: role=alert доносит
        // её сразу, не дожидаясь паузы в речи.
        role="alert"
        className={className}
        style={palette}
      >
        {!open ? (
          // Закрытая сводка не исчезает совсем: ошибки остались, и вернуть
          // список должно быть можно без повторной отправки формы.
          <p data-part="hidden">
            {hiddenText}
            <button
              type="button"
              data-part="show"
              onClick={() => setOpen(true)}
            >
              {showLabel}
            </button>
          </p>
        ) : (
        <div data-part="card">
          <div data-part="head">
            {/* Считаются поля, а не ошибки: «три ошибки» в одном поле пугают
                сильнее, чем стоило бы. */}
            <p data-part="title">
              {titleTemplate.replace("{count}", String(problems.length))}
            </p>
            <button
              type="button"
              data-part="close"
              aria-label={closeLabel}
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>

          <ul data-part="list">
            {problems.map((problem) => (
              <li key={problem.field}>
                <button
                  type="button"
                  data-part="jump"
                  aria-label={jumpTemplate.replace("{field}", problem.field)}
                  onClick={() => setJumped(problem.field)}
                >
                  <span data-part="field">{problem.field}</span>
                  <span data-part="text">{problem.text}</span>
                </button>
              </li>
            ))}
          </ul>

          <div data-part="foot">
            <span data-part="done" aria-live="polite">
              {jumped ? jumpedTemplate.replace("{field}", jumped) : ""}
            </span>
            <button
              type="button"
              data-part="first"
              onClick={() => setJumped(problems[0]?.field ?? "")}
            >
              {firstLabel}
            </button>
          </div>
        </div>
        )}
      </div>
    </>
  )
}

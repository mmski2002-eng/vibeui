"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Togglegroup016Props = Omit<
  ComponentProps<"section">,
  "children" | "onChange" | "defaultValue"
> & {
  label?: string
  defaultValue?: string | null
  /** Подписи кнопок: компонент несёт русские, проект подставляет свои. */
  optionText?: Record<string, string>
  /** Подпись кнопки сброса. */
  resetText?: string
  /** Строка статуса при выборе; {label} — подпись нажатой кнопки. */
  selectedText?: string
  /** Строка статуса, когда не выбрано ничего. */
  emptyText?: string
  onChange?: (value: string | null) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: одиночный выбор, который умеет вернуться в «ничего не
// выбрано». Обычная toggle-группа при одиночном выборе всегда держит ровно
// одну нажатую кнопку — здесь повторный клик по нажатой снимает её, а рядом
// стоит кнопка «Сбросить» для того же результата одним действием.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="togglegroup-016"]){
--vibeui-togglegroup-016-bg:transparent;
--vibeui-togglegroup-016-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-togglegroup-016-muted:color-mix(in oklab,var(--vibeui-togglegroup-016-fg) 68%,transparent);
--vibeui-togglegroup-016-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-togglegroup-016-surface:light-dark(oklch(0.97 0 265),oklch(0.28 0 265));
--vibeui-togglegroup-016-accent:light-dark(oklch(0.55 0.16 39.8),oklch(0.76 0.13 39.8));
--vibeui-togglegroup-016-on-accent:light-dark(oklch(0.99 0 0),oklch(0.18 0 300));
--vibeui-togglegroup-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="togglegroup-016"]{color-scheme:dark}
[data-vibeui-block="togglegroup-016"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:23rem;padding:0.875rem;
border:1px solid var(--vibeui-togglegroup-016-border);border-radius:0.875rem;
background:var(--vibeui-togglegroup-016-bg);color:var(--vibeui-togglegroup-016-fg);
font-family:var(--vibeui-togglegroup-016-font);
}
[data-vibeui-block="togglegroup-016"] *{box-sizing:border-box}
[data-vibeui-block="togglegroup-016"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="togglegroup-016"] h3{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="togglegroup-016"] [data-part="reset"]{
appearance:none;cursor:pointer;font:inherit;border:0;background:none;padding:0;
color:var(--vibeui-togglegroup-016-accent);
font-size:0.75rem;font-weight:600;text-decoration:underline;text-underline-offset:0.2em;
}
[data-vibeui-block="togglegroup-016"] [data-part="reset"]:disabled{
cursor:not-allowed;color:var(--vibeui-togglegroup-016-muted);text-decoration:none;
}
[data-vibeui-block="togglegroup-016"] [data-part="reset"]:focus-visible{
outline:2px solid var(--vibeui-togglegroup-016-accent);outline-offset:2px;border-radius:0.25rem;
}
[data-vibeui-block="togglegroup-016"] [data-part="group"]{display:flex;flex-wrap:wrap;gap:0.375rem}
[data-vibeui-block="togglegroup-016"] [data-part="group"] button{
appearance:none;cursor:pointer;font:inherit;
height:2rem;padding:0 0.75rem;
border:1px solid var(--vibeui-togglegroup-016-border);border-radius:9999px;
background:transparent;color:var(--vibeui-togglegroup-016-fg);
font-size:0.8125rem;font-weight:600;line-height:1;
transition:background-color .15s ease,color .15s ease,border-color .15s ease;
}
[data-vibeui-block="togglegroup-016"] [data-part="group"] button:focus-visible{
outline:2px solid var(--vibeui-togglegroup-016-accent);outline-offset:2px;
}
[data-vibeui-block="togglegroup-016"] [data-part="group"] button[aria-pressed="true"]{
background:var(--vibeui-togglegroup-016-accent);border-color:var(--vibeui-togglegroup-016-accent);
color:var(--vibeui-togglegroup-016-on-accent);
}
[data-vibeui-block="togglegroup-016"] [data-part="summary"]{
margin:0;font-size:0.8125rem;line-height:1.4;
padding:0.625rem;border-radius:0.5rem;background:var(--vibeui-togglegroup-016-surface);
color:var(--vibeui-togglegroup-016-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="togglegroup-016"] *{animation:none!important;transition:none!important}}
`

const OPTIONS = ["new", "progress", "done"]

const OPTION_LABEL: Record<string, string> = {
  new: "Новые",
  progress: "В работе",
  done: "Готово",
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
 * Одиночный выбор с деселектом и кнопкой сброса: повторный клик по нажатой
 * кнопке возвращает группу в состояние «ничего не выбрано». Один файл,
 * ноль зависимостей.
 */
export function Togglegroup016({
  label = "Быстрый фильтр",
  defaultValue = null,
  optionText = OPTION_LABEL,
  resetText = "Сбросить",
  selectedText = "Показаны записи со статусом «{label}».",
  emptyText = "Фильтр не выбран — показаны все записи.",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Togglegroup016Props) {
  const [value, setValue] = useState<string | null>(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-togglegroup-016-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-togglegroup-016-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const apply = (next: string | null) => {
    setValue(next)
    onChange?.(next)
  }

  const labelFor = (id: string) => optionText[id] ?? OPTION_LABEL[id] ?? id
  const current = OPTIONS.find((option) => option === value)

  return (
    <>
      <style href="vibeui-togglegroup-016" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="toggle-group"
        data-vibeui-block="togglegroup-016"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3>{label}</h3>
          <button
            type="button"
            data-part="reset"
            disabled={value === null}
            onClick={() => apply(null)}
          >
            {resetText}
          </button>
        </div>
        <div
          data-part="group"
          role="group"
          aria-label={label}
          onKeyDown={moveFocus}
        >
          {OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={value === option}
              onClick={() => apply(value === option ? null : option)}
            >
              {labelFor(option)}
            </button>
          ))}
        </div>
        <p data-part="summary" role="status">
          {current
            ? selectedText.replace("{label}", labelFor(current))
            : emptyText}
        </p>
      </section>
    </>
  )
}

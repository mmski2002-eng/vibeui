"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Togglegroup017Option = {
  value: string
  label: string
}

export type Togglegroup017Props = Omit<
  ComponentProps<"section">,
  "children" | "onChange"
> & {
  label?: string
  options?: Togglegroup017Option[]
  defaultValue?: string
  /** Строка под группой: {label}. Пустая строка убирает её. */
  hintTemplate?: string
  onChange?: (value: string) => void
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: сегмент, у которого выбранное состояние переезжает, а не
// перекрашивается. Движение показывает, откуда и куда ушёл выбор, — при
// перекраске двух кнопок сразу глаз этого перехода не ловит.
//
// Плашка одна на всю группу и двигается translate'ом по доле ширины, поэтому
// анимация идёт на композиторе и не пересчитывает раскладку. Ширина сегмента
// задана долей от числа кнопок, а не измеряется скриптом: серверная разметка
// сразу приходит с плашкой на своём месте.
const STYLES = `
:where([data-vibeui-block="togglegroup-017"]){
--vibeui-togglegroup-017-bg:transparent;
--vibeui-togglegroup-017-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-togglegroup-017-muted:color-mix(in oklab,var(--vibeui-togglegroup-017-fg) 66%,transparent);
--vibeui-togglegroup-017-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-togglegroup-017-track:light-dark(oklch(0.96 0.004 265),oklch(0.28 0.011 265));
--vibeui-togglegroup-017-accent:light-dark(oklch(0.55 0.15 265),oklch(0.73 0.13 265));
--vibeui-togglegroup-017-on-accent:oklch(from var(--vibeui-togglegroup-017-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-togglegroup-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="togglegroup-017"]{color-scheme:dark}
[data-vibeui-block="togglegroup-017"]{
display:flex;flex-direction:column;gap:0.5rem;align-items:flex-start;
box-sizing:border-box;margin:0;
background:var(--vibeui-togglegroup-017-bg);
color:var(--vibeui-togglegroup-017-fg);
font-family:var(--vibeui-togglegroup-017-font);
}
[data-vibeui-block="togglegroup-017"] *{box-sizing:border-box}
[data-vibeui-block="togglegroup-017"] [data-part="label"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-togglegroup-017-muted);
}
[data-vibeui-block="togglegroup-017"] [data-part="group"]{
position:relative;display:grid;
grid-template-columns:repeat(var(--vibeui-togglegroup-017-count,3),minmax(0,1fr));
gap:0;padding:0.1875rem;
border:1px solid var(--vibeui-togglegroup-017-border);border-radius:999px;
background:var(--vibeui-togglegroup-017-track);
}
/* Плашка живёт в поле padding группы, поэтому её ширина считается от рабочей
   области, а не от внешней рамки. */
[data-vibeui-block="togglegroup-017"] [data-part="thumb"]{
position:absolute;z-index:0;
inset:0.1875rem auto 0.1875rem 0.1875rem;
inline-size:calc((100% - 0.375rem) / var(--vibeui-togglegroup-017-count,3));
translate:calc(var(--vibeui-togglegroup-017-index,0) * 100%) 0;
border-radius:999px;background:var(--vibeui-togglegroup-017-accent);
box-shadow:0 1px 2px oklch(0.2 0.03 265 / 22%);
transition:translate .22s cubic-bezier(0.2,0.7,0.3,1);
}
[data-vibeui-block="togglegroup-017"] [data-part="option"]{
position:relative;z-index:1;
appearance:none;border:0;background:transparent;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:2rem;padding:0.25rem 0.875rem;
border-radius:999px;
color:var(--vibeui-togglegroup-017-muted);
font:inherit;font-size:0.8125rem;font-weight:600;line-height:1.3;
white-space:nowrap;
transition:color .18s ease;
}
[data-vibeui-block="togglegroup-017"] [data-part="option"]:hover{color:var(--vibeui-togglegroup-017-fg)}
[data-vibeui-block="togglegroup-017"] [data-part="option"][aria-pressed="true"]{
color:var(--vibeui-togglegroup-017-on-accent);
}
[data-vibeui-block="togglegroup-017"] [data-part="option"]:focus-visible{
outline:2px solid var(--vibeui-togglegroup-017-accent);outline-offset:2px;
}
[data-vibeui-block="togglegroup-017"] [data-part="hint"]{
margin:0;font-size:0.75rem;color:var(--vibeui-togglegroup-017-muted);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="togglegroup-017"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_OPTIONS: Togglegroup017Option[] = [
  { value: "day", label: "День" },
  { value: "week", label: "Неделя" },
  { value: "month", label: "Месяц" },
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

function fillTemplate(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
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
 * Сегмент одиночного выбора, у которого плашка выбранного переезжает.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Togglegroup017({
  label = "Период",
  options = DEFAULT_OPTIONS,
  defaultValue = "week",
  hintTemplate = "Выбрано: {label}.",
  onChange,
  accent,
  background = "",
  className,
  style,
  ...props
}: Togglegroup017Props) {
  const [value, setValue] = useState(defaultValue)
  const index = Math.max(
    options.findIndex((option) => option.value === value),
    0,
  )
  const current = options[index]

  const palette = {
    "--vibeui-togglegroup-017-count": String(options.length),
    "--vibeui-togglegroup-017-index": String(index),
    ...(accent ? { "--vibeui-togglegroup-017-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-togglegroup-017-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-togglegroup-017" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="toggle-group"
        data-vibeui-block="togglegroup-017"
        className={className}
        style={palette}
      >
        <p data-part="label">{label}</p>
        <div
          data-part="group"
          role="group"
          aria-label={label}
          onKeyDown={moveFocus}
        >
          <span data-part="thumb" aria-hidden="true" />
          {options.map((option) => (
            <button
              key={option.value}
              data-part="option"
              type="button"
              aria-pressed={option.value === value}
              onClick={() => {
                setValue(option.value)
                onChange?.(option.value)
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
        {hintTemplate ? (
          <p data-part="hint">
            {fillTemplate(hintTemplate, { label: current?.label ?? "" })}
          </p>
        ) : null}
      </section>
    </>
  )
}

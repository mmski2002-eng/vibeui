"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Togglegroup005Size = {
  id: string
  available?: boolean
}

export type Togglegroup005Props = Omit<
  ComponentProps<"section">,
  "children" | "onChange"
> & {
  label?: string
  defaultValue?: string
  sizes?: Togglegroup005Size[]
  /** Строка выбранного размера с подстановкой {size}. */
  currentText?: string
  /** Имя закончившейся кнопки для скринридера, подстановка {size}. */
  soldOutText?: string
  /** Ответ на нажатие закончившегося размера, подстановка {size}. */
  refusedText?: string
  /** Пояснение под рядом, пока никто не жал закончившийся размер. */
  noteText?: string
  onChange?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: выбор размера одиночным toggle-выбором, где закончившиеся
// размеры остаются в ряду. Они помечены aria-disabled, а не disabled: такой
// пункт остаётся доступен с клавиатуры и может объяснить, почему не работает,
// — исчезнувший размер читался бы как несуществующий.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте панель темнеет, а границы становятся светлее фона.
const STYLES = `
:where([data-vibeui-block="togglegroup-005"]){
--vibeui-togglegroup-005-bg:transparent;
--vibeui-togglegroup-005-fg:light-dark(oklch(0.2 0 265),oklch(0.94 0 265));
--vibeui-togglegroup-005-muted:color-mix(in oklab,var(--vibeui-togglegroup-005-fg) 68%,transparent);
--vibeui-togglegroup-005-border:light-dark(oklch(0.88 0 265),oklch(0.36 0 265));
--vibeui-togglegroup-005-surface:light-dark(oklch(0.97 0 265),oklch(0.25 0 265));
--vibeui-togglegroup-005-raised:light-dark(oklch(1 0 0),oklch(0.29 0 265));
--vibeui-togglegroup-005-accent:light-dark(oklch(0.28 0 265),oklch(0.88 0 265));
--vibeui-togglegroup-005-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.2 0 265));
--vibeui-togglegroup-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="togglegroup-005"]{color-scheme:dark}
[data-vibeui-block="togglegroup-005"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:22rem;padding:0.875rem;
border:1px solid var(--vibeui-togglegroup-005-border);border-radius:0.875rem;
background:var(--vibeui-togglegroup-005-bg);color:var(--vibeui-togglegroup-005-fg);
font-family:var(--vibeui-togglegroup-005-font);
}
[data-vibeui-block="togglegroup-005"] *{box-sizing:border-box}
[data-vibeui-block="togglegroup-005"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="togglegroup-005"] h3{margin:0;font-size:0.8125rem;font-weight:650;letter-spacing:0.02em;text-transform:uppercase}
[data-vibeui-block="togglegroup-005"] [data-part="current"]{
margin:0;font-size:0.8125rem;color:var(--vibeui-togglegroup-005-muted);
}
[data-vibeui-block="togglegroup-005"] [data-part="group"]{display:flex;flex-wrap:wrap;gap:0.375rem}
[data-vibeui-block="togglegroup-005"] button{
appearance:none;cursor:pointer;font:inherit;position:relative;
display:inline-flex;align-items:center;justify-content:center;
min-width:3rem;height:2.5rem;padding:0 0.625rem;
border:1px solid var(--vibeui-togglegroup-005-border);border-radius:0.5rem;
background:var(--vibeui-togglegroup-005-raised);color:var(--vibeui-togglegroup-005-fg);
font-size:0.8125rem;font-weight:600;line-height:1;
transition:border-color .15s ease,background-color .15s ease,color .15s ease;
}
[data-vibeui-block="togglegroup-005"] button:hover{border-color:var(--vibeui-togglegroup-005-accent)}
[data-vibeui-block="togglegroup-005"] button:focus-visible{
outline:2px solid var(--vibeui-togglegroup-005-accent);outline-offset:2px;
}
[data-vibeui-block="togglegroup-005"] button[aria-pressed="true"]{
background:var(--vibeui-togglegroup-005-accent);
border-color:var(--vibeui-togglegroup-005-accent);
color:var(--vibeui-togglegroup-005-accent-fg);
}
/* Закончившийся размер гасится и перечёркивается: цвет один — слишком слабый
   признак, а перечёркивание читается и в чёрно-белой печати. */
[data-vibeui-block="togglegroup-005"] button[aria-disabled="true"]{
cursor:not-allowed;color:var(--vibeui-togglegroup-005-muted);
background:var(--vibeui-togglegroup-005-surface);border-color:transparent;
}
[data-vibeui-block="togglegroup-005"] button[aria-disabled="true"]::after{
content:"";position:absolute;left:0.5rem;right:0.5rem;top:50%;height:1px;
background:var(--vibeui-togglegroup-005-muted);transform:rotate(-12deg);
}
[data-vibeui-block="togglegroup-005"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-togglegroup-005-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="togglegroup-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SIZES: Togglegroup005Size[] = [
  { id: "XS", available: true },
  { id: "S", available: true },
  { id: "M", available: true },
  { id: "L", available: false },
  { id: "XL", available: true },
  { id: "XXL", available: false },
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
 * Выбор размера одиночным toggle-выбором: закончившиеся размеры остаются
 * в ряду и помечены aria-disabled. Один файл, ноль зависимостей.
 */
export function Togglegroup005({
  label = "Размер",
  defaultValue = "M",
  sizes = DEFAULT_SIZES,
  currentText = "Выбран: {size}",
  soldOutText = "{size}, закончился",
  refusedText = "Размера {size} сейчас нет. Напишем, когда привезут.",
  noteText = "Перечёркнутых размеров нет в наличии.",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Togglegroup005Props) {
  const [value, setValue] = useState(defaultValue)
  const [refused, setRefused] = useState("")

  const palette = {
    ...(accent ? { "--vibeui-togglegroup-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-togglegroup-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-togglegroup-005" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="toggle-group"
        data-vibeui-block="togglegroup-005"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3>{label}</h3>
          <p data-part="current" role="status">
            {currentText.replace("{size}", value)}
          </p>
        </div>
        <div
          data-part="group"
          role="group"
          aria-label={label}
          onKeyDown={moveFocus}
        >
          {sizes.map((size) => {
            const out = size.available === false

            return (
              <button
                key={size.id}
                type="button"
                aria-pressed={value === size.id}
                aria-disabled={out}
                aria-label={
                  out ? soldOutText.replace("{size}", size.id) : size.id
                }
                onClick={() => {
                  if (out) {
                    setRefused(size.id)
                    return
                  }

                  setRefused("")
                  setValue(size.id)
                  onChange?.(size.id)
                }}
              >
                {size.id}
              </button>
            )
          })}
        </div>
        <p data-part="note" role="status">
          {refused ? refusedText.replace("{size}", refused) : noteText}
        </p>
      </section>
    </>
  )
}

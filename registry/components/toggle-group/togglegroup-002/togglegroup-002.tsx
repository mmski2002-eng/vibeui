"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Togglegroup002Props = Omit<
  ComponentProps<"section">,
  "children" | "onChange"
> & {
  label?: string
  defaultValue?: string[]
  text?: string
  /** Подписи кнопок по идентификатору: компонент несёт русские. */
  optionText?: Record<string, string>
  /** Строка счётчика с подстановками {selected} и {total}. */
  countText?: string
  onChange?: (value: string[]) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: та же группа toggle-кнопок, но с множественным выбором.
// Начертания складываются, поэтому нажатых кнопок может быть сколько угодно —
// и это ровно та причина, по которой здесь aria-pressed, а не radio.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте панель темнеет, а границы становятся светлее фона.
const STYLES = `
:where([data-vibeui-block="togglegroup-002"]){
--vibeui-togglegroup-002-bg:transparent;
--vibeui-togglegroup-002-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-togglegroup-002-muted:color-mix(in oklab,var(--vibeui-togglegroup-002-fg) 68%,transparent);
--vibeui-togglegroup-002-border:light-dark(oklch(0.9 0.006 265),oklch(0.35 0.012 265));
--vibeui-togglegroup-002-surface:light-dark(oklch(0.97 0.004 265),oklch(0.26 0.01 265));
--vibeui-togglegroup-002-raised:light-dark(oklch(1 0 0),oklch(0.29 0.01 265));
--vibeui-togglegroup-002-accent:light-dark(oklch(0.5 0.02 265),oklch(0.85 0.008 265));
--vibeui-togglegroup-002-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.2 0.014 265));
--vibeui-togglegroup-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="togglegroup-002"]{color-scheme:dark}
[data-vibeui-block="togglegroup-002"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:24rem;padding:0.875rem;
border:1px solid var(--vibeui-togglegroup-002-border);border-radius:0.875rem;
background:var(--vibeui-togglegroup-002-bg);color:var(--vibeui-togglegroup-002-fg);
font-family:var(--vibeui-togglegroup-002-font);
}
[data-vibeui-block="togglegroup-002"] *{box-sizing:border-box}
[data-vibeui-block="togglegroup-002"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="togglegroup-002"] [data-part="group"]{
display:inline-flex;gap:0.25rem;
}
[data-vibeui-block="togglegroup-002"] button{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;padding:0;
border:1px solid var(--vibeui-togglegroup-002-border);border-radius:0.5rem;
background:var(--vibeui-togglegroup-002-raised);color:var(--vibeui-togglegroup-002-muted);
transition:background-color .15s ease,color .15s ease,border-color .15s ease;
}
[data-vibeui-block="togglegroup-002"] button svg{width:1rem;height:1rem}
[data-vibeui-block="togglegroup-002"] button:hover{background:var(--vibeui-togglegroup-002-surface)}
[data-vibeui-block="togglegroup-002"] button:focus-visible{
outline:2px solid var(--vibeui-togglegroup-002-accent);outline-offset:2px;
}
/* Каждая кнопка независима: нажатых может быть три сразу, поэтому подсветка
   не выбирает «одну активную», а просто следует за своим aria-pressed. */
[data-vibeui-block="togglegroup-002"] button[aria-pressed="true"]{
background:var(--vibeui-togglegroup-002-accent);
border-color:var(--vibeui-togglegroup-002-accent);
color:var(--vibeui-togglegroup-002-accent-fg);
}
[data-vibeui-block="togglegroup-002"] [data-part="count"]{
margin:0;font-size:0.75rem;color:var(--vibeui-togglegroup-002-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="togglegroup-002"] [data-part="sample"]{
margin:0;padding:0.75rem;border-radius:0.625rem;
background:var(--vibeui-togglegroup-002-surface);
font-size:0.9375rem;line-height:1.55;
font-weight:400;font-style:normal;text-decoration:none;
}
[data-vibeui-block="togglegroup-002"][data-bold="true"] [data-part="sample"]{font-weight:700}
[data-vibeui-block="togglegroup-002"][data-italic="true"] [data-part="sample"]{font-style:italic}
[data-vibeui-block="togglegroup-002"][data-underline="true"] [data-part="sample"]{
text-decoration:underline;text-underline-offset:0.2em;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="togglegroup-002"] *{animation:none!important;transition:none!important}}
`

const OPTIONS = [
  {
    id: "bold",
    d: "M5.4 2.8h4.2a2.9 2.9 0 0 1 0 5.8H5.4zm0 5.8h4.9a3.1 3.1 0 0 1 0 6.2H5.4z",
    fill: true,
  },
  {
    id: "italic",
    d: "M11.5 3h-4M9 13H5M9.8 3 7 13",
    fill: false,
  },
  {
    id: "underline",
    d: "M4.6 2.8v5.4a3.4 3.4 0 0 0 6.8 0V2.8M3.6 14.4h8.8",
    fill: false,
  },
]

const OPTION_TEXT: Record<string, string> = {
  bold: "Полужирный",
  italic: "Курсив",
  underline: "Подчёркнутый",
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
 * Группа toggle-кнопок с множественным выбором: начертания складываются
 * и применяются к образцу сразу. Один файл, ноль зависимостей.
 */
export function Togglegroup002({
  label = "Начертание текста",
  defaultValue = ["bold"],
  text = "Множественный выбор: жирный, курсив и подчёркивание включаются независимо друг от друга.",
  optionText = OPTION_TEXT,
  countText = "Выбрано: {selected} из {total}",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Togglegroup002Props) {
  const [value, setValue] = useState<string[]>(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-togglegroup-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-togglegroup-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const toggle = (id: string) => {
    const next = value.includes(id)
      ? value.filter((item) => item !== id)
      : [...value, id]

    setValue(next)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-togglegroup-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="toggle-group"
        data-vibeui-block="togglegroup-002"
        data-bold={value.includes("bold")}
        data-italic={value.includes("italic")}
        data-underline={value.includes("underline")}
        className={className}
        style={palette}
      >
        <div data-part="head">
          <div
            data-part="group"
            role="group"
            aria-label={label}
            onKeyDown={moveFocus}
          >
            {OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={value.includes(option.id)}
                aria-label={optionText[option.id] ?? OPTION_TEXT[option.id]}
                title={optionText[option.id] ?? OPTION_TEXT[option.id]}
                onClick={() => toggle(option.id)}
              >
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d={option.d}
                    fill={option.fill ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth={option.fill ? 0 : 1.4}
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            ))}
          </div>
          <p data-part="count" role="status">
            {countText
              .replace("{selected}", String(value.length))
              .replace("{total}", String(OPTIONS.length))}
          </p>
        </div>
        <p data-part="sample">{text}</p>
      </section>
    </>
  )
}

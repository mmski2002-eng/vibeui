"use client"

import { useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Togglegroup001Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onChange"
> & {
  label?: string
  defaultValue?: string
  text?: string
  /** Подписи кнопок по идентификатору: компонент несёт русские. */
  optionText?: Record<string, string>
  onChange?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: группа toggle-кнопок с одиночным выбором. Это не сцепка
// действий, как в button group: каждая кнопка объявляет состояние через
// aria-pressed, и ровно одна из них нажата. Внутри группы работает roving
// tabindex — Tab заводит фокус один раз, дальше ходят стрелки.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте панель темнеет, а границы становятся светлее фона.
const STYLES = `
:where([data-vibeui-block="togglegroup-001"]){
--vibeui-togglegroup-001-bg:transparent;
--vibeui-togglegroup-001-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-togglegroup-001-muted:light-dark(oklch(0.55 0.014 265),oklch(0.68 0.012 265));
--vibeui-togglegroup-001-border:light-dark(oklch(0.9 0.006 265),oklch(0.35 0.012 265));
--vibeui-togglegroup-001-surface:light-dark(oklch(0.97 0.004 265),oklch(0.26 0.01 265));
--vibeui-togglegroup-001-raised:light-dark(oklch(1 0 0),oklch(0.36 0.014 265));
--vibeui-togglegroup-001-shadow:light-dark(oklch(0.2 0.02 265 / 16%),oklch(0 0 0 / 45%));
--vibeui-togglegroup-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-togglegroup-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="togglegroup-001"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:24rem;padding:0.875rem;
border:1px solid var(--vibeui-togglegroup-001-border);border-radius:0.875rem;
background:var(--vibeui-togglegroup-001-bg);color:var(--vibeui-togglegroup-001-fg);
font-family:var(--vibeui-togglegroup-001-font);
}
[data-vibeui-block="togglegroup-001"] *{box-sizing:border-box}
[data-vibeui-block="togglegroup-001"] [data-part="group"]{
display:inline-flex;align-self:flex-start;gap:0.1875rem;padding:0.1875rem;
border:1px solid var(--vibeui-togglegroup-001-border);border-radius:0.625rem;
background:var(--vibeui-togglegroup-001-surface);
}
[data-vibeui-block="togglegroup-001"] button{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;padding:0;border:0;border-radius:0.4375rem;
background:transparent;color:var(--vibeui-togglegroup-001-muted);
transition:background-color .15s ease,color .15s ease,box-shadow .15s ease;
}
[data-vibeui-block="togglegroup-001"] button svg{width:1rem;height:1rem}
[data-vibeui-block="togglegroup-001"] button:hover{color:var(--vibeui-togglegroup-001-fg)}
[data-vibeui-block="togglegroup-001"] button:focus-visible{
outline:2px solid var(--vibeui-togglegroup-001-accent);outline-offset:1px;
}
/* Вид нажатой кнопки берётся из aria-pressed: если состояние поменяют, не
   тронув атрибут, кнопка просто не покрасится — расхождение видно сразу. */
[data-vibeui-block="togglegroup-001"] button[aria-pressed="true"]{
background:var(--vibeui-togglegroup-001-raised);
color:var(--vibeui-togglegroup-001-accent);
box-shadow:0 1px 2px var(--vibeui-togglegroup-001-shadow);
}
[data-vibeui-block="togglegroup-001"] [data-part="sample"]{
margin:0;padding:0.75rem;border-radius:0.625rem;
background:var(--vibeui-togglegroup-001-surface);
font-size:0.875rem;line-height:1.55;
}
[data-vibeui-block="togglegroup-001"][data-align="left"] [data-part="sample"]{text-align:left}
[data-vibeui-block="togglegroup-001"][data-align="center"] [data-part="sample"]{text-align:center}
[data-vibeui-block="togglegroup-001"][data-align="right"] [data-part="sample"]{text-align:right}
[data-vibeui-block="togglegroup-001"][data-align="justify"] [data-part="sample"]{text-align:justify}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="togglegroup-001"] *{animation:none!important;transition:none!important}}
`

const OPTIONS = [
  { id: "left", d: "M2.5 4h11M2.5 8h7M2.5 12h11" },
  { id: "center", d: "M2.5 4h11M4.5 8h7M2.5 12h11" },
  { id: "right", d: "M2.5 4h11M6.5 8h7M2.5 12h11" },
  { id: "justify", d: "M2.5 4h11M2.5 8h11M2.5 12h11" },
]

const OPTION_TEXT: Record<string, string> = {
  left: "По левому краю",
  center: "По центру",
  right: "По правому краю",
  justify: "По ширине",
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
 * Группа toggle-кнопок с одиночным выбором и roving tabindex: выравнивание
 * применяется к образцу сразу. Один файл, ноль зависимостей.
 */
export function Togglegroup001({
  label = "Выравнивание текста",
  defaultValue = "left",
  text = "Группа переключателей отличается от сцепки кнопок тем, что кнопка здесь объявляет состояние, а не запускает действие.",
  optionText = OPTION_TEXT,
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Togglegroup001Props) {
  const [value, setValue] = useState(defaultValue)
  const items = useRef<(HTMLButtonElement | null)[]>([])

  const palette = {
    ...(accent ? { "--vibeui-togglegroup-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-togglegroup-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const focusAt = (index: number) => {
    const last = OPTIONS.length - 1
    const target = index < 0 ? last : index > last ? 0 : index

    items.current[target]?.focus()
  }

  const onKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const step =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0

    if (step !== 0) {
      event.preventDefault()
      focusAt(index + step)
      return
    }

    if (event.key === "Home") {
      event.preventDefault()
      focusAt(0)
    }

    if (event.key === "End") {
      event.preventDefault()
      focusAt(OPTIONS.length - 1)
    }
  }

  return (
    <>
      <style href="vibeui-togglegroup-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="togglegroup-001"
        data-align={value}
        className={className}
        style={palette}
      >
        <div data-part="group" role="group" aria-label={label}>
          {OPTIONS.map((option, index) => (
            <button
              key={option.id}
              ref={(node) => {
                items.current[index] = node
              }}
              type="button"
              aria-pressed={value === option.id}
              aria-label={optionText[option.id] ?? OPTION_TEXT[option.id]}
              title={optionText[option.id] ?? OPTION_TEXT[option.id]}
              tabIndex={value === option.id ? 0 : -1}
              onKeyDown={(event) => onKeyDown(event, index)}
              onClick={() => {
                setValue(option.id)
                onChange?.(option.id)
              }}
            >
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d={option.d}
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ))}
        </div>
        <p data-part="sample">{text}</p>
      </section>
    </>
  )
}

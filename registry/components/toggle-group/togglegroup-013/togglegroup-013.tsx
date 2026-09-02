"use client"

import { useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Togglegroup013Option = {
  id: string
  title: string
  about: string
}

export type Togglegroup013Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onChange"
> & {
  label?: string
  defaultValue?: string
  options?: Togglegroup013Option[]
  onChange?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: та же группа тумблеров с одиночным выбором, что и в
// горизонтальных вариантах, но кнопки идут вертикальным столбцом и несут
// подпись с пояснением, а не только значок. Roving tabindex здесь ходит
// стрелками вверх-вниз — это соответствует направлению самого списка.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="togglegroup-013"]){
--vibeui-togglegroup-013-bg:transparent;
--vibeui-togglegroup-013-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-togglegroup-013-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-togglegroup-013-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-togglegroup-013-surface:light-dark(oklch(0.97 0.004 265),oklch(0.29 0.011 265));
--vibeui-togglegroup-013-accent:light-dark(oklch(0.55 0.16 250),oklch(0.74 0.14 250));
--vibeui-togglegroup-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="togglegroup-013"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:22rem;padding:0.875rem;
border:1px solid var(--vibeui-togglegroup-013-border);border-radius:0.875rem;
background:var(--vibeui-togglegroup-013-bg);color:var(--vibeui-togglegroup-013-fg);
font-family:var(--vibeui-togglegroup-013-font);
}
[data-vibeui-block="togglegroup-013"] *{box-sizing:border-box}
[data-vibeui-block="togglegroup-013"] h3{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="togglegroup-013"] [data-part="group"]{
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="togglegroup-013"] button{
appearance:none;cursor:pointer;font:inherit;text-align:left;
display:flex;align-items:flex-start;gap:0.625rem;width:100%;
padding:0.625rem 0.75rem;border:1px solid var(--vibeui-togglegroup-013-border);
border-radius:0.75rem;background:transparent;color:var(--vibeui-togglegroup-013-fg);
transition:border-color .15s ease,background-color .15s ease,box-shadow .15s ease;
}
[data-vibeui-block="togglegroup-013"] button:hover{background:var(--vibeui-togglegroup-013-surface)}
[data-vibeui-block="togglegroup-013"] button:focus-visible{
outline:2px solid var(--vibeui-togglegroup-013-accent);outline-offset:2px;
}
[data-vibeui-block="togglegroup-013"] button[aria-pressed="true"]{
border-color:var(--vibeui-togglegroup-013-accent);
box-shadow:inset 0 0 0 1px var(--vibeui-togglegroup-013-accent);
background:color-mix(in oklab,var(--vibeui-togglegroup-013-accent) 9%,transparent);
}
[data-vibeui-block="togglegroup-013"] [data-part="dot"]{
flex:none;margin-top:0.1875rem;width:1rem;height:1rem;border-radius:50%;
border:1.5px solid var(--vibeui-togglegroup-013-border);
display:inline-flex;align-items:center;justify-content:center;
}
[data-vibeui-block="togglegroup-013"] [data-part="dot"]::after{
content:"";width:0.5rem;height:0.5rem;border-radius:50%;
background:var(--vibeui-togglegroup-013-accent);transform:scale(0);
transition:transform .12s ease;
}
[data-vibeui-block="togglegroup-013"] button[aria-pressed="true"] [data-part="dot"]{
border-color:var(--vibeui-togglegroup-013-accent);
}
[data-vibeui-block="togglegroup-013"] button[aria-pressed="true"] [data-part="dot"]::after{
transform:scale(1);
}
[data-vibeui-block="togglegroup-013"] [data-part="title"]{
display:block;font-size:0.8125rem;font-weight:650;line-height:1.25;
}
[data-vibeui-block="togglegroup-013"] [data-part="about"]{
display:block;margin-top:0.125rem;font-size:0.6875rem;line-height:1.35;
color:var(--vibeui-togglegroup-013-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="togglegroup-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Togglegroup013Option[] = [
  { id: "courier", title: "Курьер", about: "Завтра до 18:00, 350 ₽" },
  {
    id: "pickup",
    title: "Самовывоз",
    about: "Сегодня из пункта на карте, бесплатно",
  },
  { id: "post", title: "Почта", about: "3–5 дней, 250 ₽" },
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
 * Вертикальная группа тумблеров с одиночным выбором и подписями: roving
 * tabindex ходит стрелками вверх-вниз. Один файл, ноль зависимостей.
 */
export function Togglegroup013({
  label = "Способ доставки",
  defaultValue = "courier",
  options = DEFAULT_OPTIONS,
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Togglegroup013Props) {
  const [value, setValue] = useState(defaultValue)
  const items = useRef<(HTMLButtonElement | null)[]>([])

  const palette = {
    ...(accent ? { "--vibeui-togglegroup-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-togglegroup-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const focusAt = (index: number) => {
    const last = options.length - 1
    const target = index < 0 ? last : index > last ? 0 : index

    items.current[target]?.focus()
  }

  const onKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const step =
      event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0

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
      focusAt(options.length - 1)
    }
  }

  return (
    <>
      <style href="vibeui-togglegroup-013" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="togglegroup-013"
        className={className}
        style={palette}
      >
        <h3>{label}</h3>
        <div data-part="group" role="group" aria-label={label}>
          {options.map((option, index) => (
            <button
              key={option.id}
              ref={(node) => {
                items.current[index] = node
              }}
              type="button"
              aria-pressed={value === option.id}
              tabIndex={value === option.id ? 0 : -1}
              onKeyDown={(event) => onKeyDown(event, index)}
              onClick={() => {
                setValue(option.id)
                onChange?.(option.id)
              }}
            >
              <span data-part="dot" aria-hidden="true" />
              <span>
                <span data-part="title">{option.title}</span>
                <span data-part="about">{option.about}</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </>
  )
}

"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Toggle001Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  text?: string
  label?: string
  defaultPressed?: boolean
  onChange?: (pressed: boolean) => void
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: показать toggle рядом с тем, чем он управляет. Кнопка
// начертания меняет образец текста в тот же миг — это действие над объектом,
// а не настройка, которую применяют кнопкой «Сохранить». Состояние объявлено
// через aria-pressed, потому что чекбокс здесь означал бы поле формы.
const STYLES = `
:where([data-vibeui-block="toggle-001"]){
--vibeui-toggle-001-bg:transparent;
--vibeui-toggle-001-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-toggle-001-muted:color-mix(in oklab,var(--vibeui-toggle-001-fg) 68%,transparent);
--vibeui-toggle-001-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-toggle-001-hover:light-dark(oklch(0.97 0 265),oklch(0.29 0 265));
--vibeui-toggle-001-accent:light-dark(oklch(0.5 0 265),oklch(0.82 0 265));
--vibeui-toggle-001-on:light-dark(oklch(0.99 0 0),oklch(0.2 0 265));
--vibeui-toggle-001-radius:0.5rem;
--vibeui-toggle-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="toggle-001"]{color-scheme:dark}
[data-vibeui-block="toggle-001"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:22rem;padding:0.875rem;
border:1px solid var(--vibeui-toggle-001-border);border-radius:0.875rem;
background:var(--vibeui-toggle-001-bg);color:var(--vibeui-toggle-001-fg);
font-family:var(--vibeui-toggle-001-font);
}
[data-vibeui-block="toggle-001"] *{box-sizing:border-box}
[data-vibeui-block="toggle-001"] [data-part="bar"]{
display:flex;align-items:center;gap:0.625rem;
}
[data-vibeui-block="toggle-001"] button{
appearance:none;cursor:pointer;font:inherit;flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:2.125rem;height:2.125rem;padding:0;
border:1px solid var(--vibeui-toggle-001-border);
border-radius:var(--vibeui-toggle-001-radius);
background:var(--vibeui-toggle-001-bg);color:var(--vibeui-toggle-001-fg);
transition:background-color .15s ease,color .15s ease,border-color .15s ease;
}
[data-vibeui-block="toggle-001"] button svg{width:1.0625rem;height:1.0625rem}
[data-vibeui-block="toggle-001"] button:hover{background:var(--vibeui-toggle-001-hover)}
[data-vibeui-block="toggle-001"] button:focus-visible{
outline:2px solid var(--vibeui-toggle-001-accent);outline-offset:2px;
}
/* Вид берётся из того же атрибута, который читает скринридер: разойтись
   картинке и разметке негде. */
[data-vibeui-block="toggle-001"] button[aria-pressed="true"]{
background:var(--vibeui-toggle-001-accent);
border-color:var(--vibeui-toggle-001-accent);
color:oklch(from var(--vibeui-toggle-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
[data-vibeui-block="toggle-001"] [data-part="hint"]{
margin:0;font-size:0.75rem;color:var(--vibeui-toggle-001-muted);
}
[data-vibeui-block="toggle-001"] [data-part="sample"]{
margin:0;padding:0.625rem 0.75rem;border-radius:0.625rem;
background:var(--vibeui-toggle-001-hover);
font-size:0.9375rem;line-height:1.5;font-weight:400;
}
[data-vibeui-block="toggle-001"][data-bold="true"] [data-part="sample"]{font-weight:700}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toggle-001"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Кнопка начертания над образцом текста: нажатие меняет образец сразу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toggle001({
  text = "Черновик письма клиенту",
  label = "Полужирный",
  defaultPressed = false,
  onChange,
  accent,
  background = "",
  className,
  style,
  ...props
}: Toggle001Props) {
  const [pressed, setPressed] = useState(defaultPressed)

  const palette = {
    ...(accent ? { "--vibeui-toggle-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-toggle-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toggle-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="toggle"
        data-vibeui-block="toggle-001"
        data-bold={pressed}
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <button
            type="button"
            aria-pressed={pressed}
            aria-label={label}
            title={label}
            onClick={() => {
              setPressed(!pressed)
              onChange?.(!pressed)
            }}
          >
            <svg viewBox="0 0 18 18" aria-hidden="true">
              <path
                d="M5.4 2.8h4.3a2.9 2.9 0 0 1 0 5.8H5.4zm0 5.8h5a3.1 3.1 0 0 1 0 6.2h-5z"
                fill="currentColor"
              />
            </svg>
          </button>
          <p data-part="hint">{label}</p>
        </div>
        <p data-part="sample">{text}</p>
      </div>
    </>
  )
}

"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Toggle003Props = Omit<
  ComponentProps<"article">,
  "children" | "onChange" | "title"
> & {
  title?: string
  count?: number
  label?: string
  /** Строка счётчика; {count} подставляется числом. */
  countText?: string
  defaultPressed?: boolean
  onChange?: (pressed: boolean) => void
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: кнопка избранного, у которой нажатие сразу меняет и
// значок, и счётчик рядом. Счётчик вынесен из кнопки: внутри он приклеился бы
// к её имени, и скринридер прочитал бы «В избранное 128, нажато».
const STYLES = `
:where([data-vibeui-block="toggle-003"]){
--vibeui-toggle-003-bg:transparent;
--vibeui-toggle-003-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-toggle-003-muted:color-mix(in oklab,var(--vibeui-toggle-003-fg) 68%,transparent);
--vibeui-toggle-003-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-toggle-003-accent:light-dark(oklch(0.33 0 0),oklch(0.919 0 0));
--vibeui-toggle-003-hover:light-dark(oklch(0.97 0 265),oklch(0.29 0 265));
--vibeui-toggle-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="toggle-003"]{color-scheme:dark}
[data-vibeui-block="toggle-003"]{
box-sizing:border-box;display:flex;align-items:center;gap:0.75rem;
width:100%;max-width:22rem;padding:0.75rem 0.875rem;
border:1px solid var(--vibeui-toggle-003-border);border-radius:0.875rem;
background:var(--vibeui-toggle-003-bg);color:var(--vibeui-toggle-003-fg);
font-family:var(--vibeui-toggle-003-font);
}
[data-vibeui-block="toggle-003"] *{box-sizing:border-box}
[data-vibeui-block="toggle-003"] [data-part="text"]{min-width:0;flex:1}
[data-vibeui-block="toggle-003"] h3{
margin:0;font-size:0.875rem;font-weight:650;line-height:1.3;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="toggle-003"] [data-part="count"]{
display:block;margin-top:0.125rem;font-size:0.75rem;color:var(--vibeui-toggle-003-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="toggle-003"] button{
appearance:none;cursor:pointer;font:inherit;flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:2.25rem;height:2.25rem;padding:0;
border:1px solid var(--vibeui-toggle-003-border);border-radius:9999px;
background:var(--vibeui-toggle-003-bg);color:var(--vibeui-toggle-003-muted);
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="toggle-003"] button:hover{background:var(--vibeui-toggle-003-hover)}
[data-vibeui-block="toggle-003"] button:focus-visible{
outline:2px solid var(--vibeui-toggle-003-accent);outline-offset:2px;
}
[data-vibeui-block="toggle-003"] svg{width:1.125rem;height:1.125rem}
[data-vibeui-block="toggle-003"] svg path{
fill:none;stroke:currentColor;stroke-width:1.5;stroke-linejoin:round;
}
/* Отмеченная звезда не только красится, но и заливается: цвет один — плохой
   признак для тех, кто его не различает. */
[data-vibeui-block="toggle-003"] button[aria-pressed="true"]{
color:var(--vibeui-toggle-003-accent);border-color:var(--vibeui-toggle-003-accent);
}
[data-vibeui-block="toggle-003"] button[aria-pressed="true"] svg{animation:vibeui-toggle-003-pop .22s ease}
[data-vibeui-block="toggle-003"] button[aria-pressed="true"] svg path{fill:currentColor}
@keyframes vibeui-toggle-003-pop{
0%{transform:scale(.75)}
60%{transform:scale(1.18)}
100%{transform:scale(1)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toggle-003"] *{animation:none!important;transition:none!important}}
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
 * Кнопка избранного со счётчиком: звезда заливается, число рядом меняется
 * сразу. Один файл, ноль зависимостей, собственная палитра.
 */
export function Toggle003({
  title = "Годовой отчёт по продажам",
  count = 128,
  label = "В избранное",
  countText = "{count} в избранном",
  defaultPressed = false,
  onChange,
  accent,
  background = "",
  className,
  style,
  ...props
}: Toggle003Props) {
  const [pressed, setPressed] = useState(defaultPressed)

  const palette = {
    ...(accent ? { "--vibeui-toggle-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-toggle-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const total = pressed ? count + 1 : count

  return (
    <>
      <style href="vibeui-toggle-003" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-slot="toggle"
        data-vibeui-block="toggle-003"
        className={className}
        style={palette}
      >
        <div data-part="text">
          <h3>{title}</h3>
          <span data-part="count" role="status">
            {countText.replace("{count}", String(total))}
          </span>
        </div>
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
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 2.4l2.28 4.7 5.12.72-3.7 3.63.87 5.13L10 14.16l-4.57 2.42.87-5.13-3.7-3.63 5.12-.72z" />
          </svg>
        </button>
      </article>
    </>
  )
}

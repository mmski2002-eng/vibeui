"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toggle003Props = Omit<
  ComponentPropsWithoutRef<"article">,
  "children" | "onChange" | "title"
> & {
  title?: string
  count?: number
  label?: string
  defaultPressed?: boolean
  onChange?: (pressed: boolean) => void
  accent?: string
}

// Идея компонента: кнопка избранного, у которой нажатие сразу меняет и
// значок, и счётчик рядом. Счётчик вынесен из кнопки: внутри он приклеился бы
// к её имени, и скринридер прочитал бы «В избранное 128, нажато».
const STYLES = `
:where([data-vibeui-block="toggle-003"]){
--vibeui-toggle-003-bg:oklch(1 0 0);
--vibeui-toggle-003-fg:oklch(0.22 0.014 265);
--vibeui-toggle-003-muted:oklch(0.55 0.014 265);
--vibeui-toggle-003-border:oklch(0.9 0.006 265);
--vibeui-toggle-003-accent:oklch(0.72 0.16 75);
--vibeui-toggle-003-hover:oklch(0.97 0.004 265);
--vibeui-toggle-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
 * Кнопка избранного со счётчиком: звезда заливается, число рядом меняется
 * сразу. Один файл, ноль зависимостей, собственная палитра.
 */
export function Toggle003({
  title = "Годовой отчёт по продажам",
  count = 128,
  label = "В избранное",
  defaultPressed = false,
  onChange,
  accent,
  className,
  style,
  ...props
}: Toggle003Props) {
  const [pressed, setPressed] = useState(defaultPressed)

  const palette = {
    ...(accent ? { "--vibeui-toggle-003-accent": accent } : null),
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
        data-vibeui-block="toggle-003"
        className={className}
        style={palette}
      >
        <div data-part="text">
          <h3>{title}</h3>
          <span data-part="count" role="status">
            {total} в избранном
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

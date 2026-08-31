"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toggle001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  text?: string
  label?: string
  defaultPressed?: boolean
  onChange?: (pressed: boolean) => void
  accent?: string
}

// Идея компонента: показать toggle рядом с тем, чем он управляет. Кнопка
// начертания меняет образец текста в тот же миг — это действие над объектом,
// а не настройка, которую применяют кнопкой «Сохранить». Состояние объявлено
// через aria-pressed, потому что чекбокс здесь означал бы поле формы.
const STYLES = `
:where([data-vibeui-block="toggle-001"]){
--vibeui-toggle-001-bg:oklch(1 0 0);
--vibeui-toggle-001-fg:oklch(0.22 0.014 265);
--vibeui-toggle-001-muted:oklch(0.55 0.014 265);
--vibeui-toggle-001-border:oklch(0.9 0.006 265);
--vibeui-toggle-001-hover:oklch(0.97 0.004 265);
--vibeui-toggle-001-accent:oklch(0.5 0.02 265);
--vibeui-toggle-001-on:oklch(0.99 0 0);
--vibeui-toggle-001-radius:0.5rem;
--vibeui-toggle-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
color:var(--vibeui-toggle-001-on);
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
 * Кнопка начертания над образцом текста: нажатие меняет образец сразу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toggle001({
  text = "Черновик письма клиенту",
  label = "Полужирный",
  defaultPressed = false,
  onChange,
  accent,
  className,
  style,
  ...props
}: Toggle001Props) {
  const [pressed, setPressed] = useState(defaultPressed)

  const palette = {
    ...(accent ? { "--vibeui-toggle-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toggle-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
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

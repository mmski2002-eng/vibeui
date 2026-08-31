"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toggle004Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onChange"
> & {
  label?: string
  step?: number
  defaultPressed?: boolean
  onChange?: (pressed: boolean) => void
  accent?: string
}

// Идея компонента: toggle, который управляет соседней областью и говорит об
// этом разметкой. aria-controls связывает кнопку с холстом, поэтому «Показать
// сетку» — не абстрактная настройка, а видимое действие над конкретным видом.
const STYLES = `
:where([data-vibeui-block="toggle-004"]){
--vibeui-toggle-004-bg:oklch(1 0 0);
--vibeui-toggle-004-fg:oklch(0.23 0.014 265);
--vibeui-toggle-004-muted:oklch(0.55 0.014 265);
--vibeui-toggle-004-border:oklch(0.9 0.006 265);
--vibeui-toggle-004-canvas:oklch(0.975 0.004 265);
--vibeui-toggle-004-accent:oklch(0.58 0.15 200);
--vibeui-toggle-004-line:oklch(0.58 0.15 200 / 26%);
--vibeui-toggle-004-step:1.25rem;
--vibeui-toggle-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toggle-004"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:24rem;padding:0.875rem;
border:1px solid var(--vibeui-toggle-004-border);border-radius:0.875rem;
background:var(--vibeui-toggle-004-bg);color:var(--vibeui-toggle-004-fg);
font-family:var(--vibeui-toggle-004-font);
}
[data-vibeui-block="toggle-004"] *{box-sizing:border-box}
[data-vibeui-block="toggle-004"] [data-part="bar"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="toggle-004"] [data-part="caption"]{
margin:0;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="toggle-004"] button{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;gap:0.4375rem;
height:2rem;padding:0 0.75rem;
border:1px solid var(--vibeui-toggle-004-border);border-radius:0.5rem;
background:var(--vibeui-toggle-004-bg);color:var(--vibeui-toggle-004-muted);
font-size:0.8125rem;font-weight:600;line-height:1;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="toggle-004"] button svg{width:0.9375rem;height:0.9375rem}
[data-vibeui-block="toggle-004"] button:focus-visible{
outline:2px solid var(--vibeui-toggle-004-accent);outline-offset:2px;
}
[data-vibeui-block="toggle-004"] button[aria-pressed="true"]{
border-color:var(--vibeui-toggle-004-accent);color:var(--vibeui-toggle-004-accent);
background:color-mix(in oklab,var(--vibeui-toggle-004-accent) 10%,white);
}
[data-vibeui-block="toggle-004"] [data-part="canvas"]{
position:relative;height:8.5rem;border-radius:0.625rem;overflow:hidden;
border:1px solid var(--vibeui-toggle-004-border);
background:var(--vibeui-toggle-004-canvas);
}
/* Сетка рисуется отдельным слоем поверх содержимого: так она включается
   без перерисовки самого макета и ничего в нём не двигает. */
[data-vibeui-block="toggle-004"] [data-part="grid"]{
position:absolute;inset:0;pointer-events:none;opacity:0;
background-image:linear-gradient(to right,var(--vibeui-toggle-004-line) 1px,transparent 1px),linear-gradient(to bottom,var(--vibeui-toggle-004-line) 1px,transparent 1px);
background-size:var(--vibeui-toggle-004-step) var(--vibeui-toggle-004-step);
transition:opacity .18s ease;
}
[data-vibeui-block="toggle-004"][data-grid="true"] [data-part="grid"]{opacity:1}
[data-vibeui-block="toggle-004"] [data-part="art"]{
position:absolute;inset:0;padding:1rem;display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="toggle-004"] [data-part="art"] span{
display:block;border-radius:0.375rem;background:oklch(0.86 0.02 265);
}
[data-vibeui-block="toggle-004"] [data-part="art"] span:nth-child(1){height:1.25rem;width:58%}
[data-vibeui-block="toggle-004"] [data-part="art"] span:nth-child(2){height:0.5rem;width:84%}
[data-vibeui-block="toggle-004"] [data-part="art"] span:nth-child(3){height:0.5rem;width:72%}
[data-vibeui-block="toggle-004"] [data-part="art"] span:nth-child(4){height:2rem;width:38%;margin-top:auto;background:var(--vibeui-toggle-004-accent)}
[data-vibeui-block="toggle-004"] [data-part="note"]{
margin:0;font-size:0.75rem;color:var(--vibeui-toggle-004-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toggle-004"] *{animation:none!important;transition:none!important}}
`

/**
 * Toggle «показать сетку»: кнопка связана с холстом через aria-controls,
 * сетка включается слоем поверх макета. Один файл, ноль зависимостей.
 */
export function Toggle004({
  label = "Показать сетку",
  step = 20,
  defaultPressed = true,
  onChange,
  accent,
  className,
  style,
  ...props
}: Toggle004Props) {
  const [pressed, setPressed] = useState(defaultPressed)
  const canvasId = useId()

  const palette = {
    "--vibeui-toggle-004-step": `${step}px`,
    ...(accent ? { "--vibeui-toggle-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toggle-004" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="toggle-004"
        data-grid={pressed}
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <p data-part="caption">Макет карточки</p>
          <button
            type="button"
            aria-pressed={pressed}
            aria-controls={canvasId}
            onClick={() => {
              setPressed(!pressed)
              onChange?.(!pressed)
            }}
          >
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M1.5 6h13M1.5 10h13M6 1.5v13M10 1.5v13"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            {label}
          </button>
        </div>
        <div data-part="canvas" id={canvasId}>
          <div data-part="art">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div data-part="grid" aria-hidden="true" />
        </div>
        <p data-part="note">Шаг сетки — {step} px.</p>
      </section>
    </>
  )
}

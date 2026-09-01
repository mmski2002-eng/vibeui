"use client"

import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button053Props = ComponentPropsWithoutRef<"button"> & {
  /** Подсказка сочетания рядом с подписью. */
  hint?: string
  accent?: string
}

// Идея компонента: кнопка печати, которая исчезает с распечатки. Обычная
// кнопка попадает в бумажный вариант чёрным прямоугольником — здесь есть
// собственное @media print с display:none, поэтому её не надо прятать
// снаружи. Клик зовёт window.print(), никакого своего диалога.
const STYLES = `
:where([data-vibeui-block="button-053"]){
--vibeui-button-053-surface:oklch(1 0 0);
--vibeui-button-053-border:oklch(0.88 0.006 265);
--vibeui-button-053-fg:oklch(0.26 0.02 265);
--vibeui-button-053-muted:oklch(0.58 0.014 265);
--vibeui-button-053-accent:oklch(0.5 0.13 245);
--vibeui-button-053-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-button-053-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
[data-vibeui-block="button-053"]{
appearance:none;cursor:pointer;box-sizing:border-box;
display:inline-flex;align-items:center;gap:0.625rem;
height:2.625rem;padding:0 0.75rem 0 0.875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-button-053-border);
background:var(--vibeui-button-053-surface);color:var(--vibeui-button-053-fg);
font-family:var(--vibeui-button-053-font);font-size:0.875rem;font-weight:600;line-height:1;
transition:border-color .16s ease,color .16s ease;
}
[data-vibeui-block="button-053"]:hover:not(:disabled){border-color:var(--vibeui-button-053-accent);color:var(--vibeui-button-053-accent)}
[data-vibeui-block="button-053"]:focus-visible{outline:2px solid var(--vibeui-button-053-accent);outline-offset:2px}
[data-vibeui-block="button-053"]:disabled{cursor:not-allowed;opacity:.5}
/* Принтер: корпус, лоток сверху и лист снизу. */
[data-vibeui-block="button-053"] [data-part="printer"]{position:relative;flex:none;width:1.125rem;height:1.125rem}
[data-vibeui-block="button-053"] [data-part="printer"]::before{
content:"";position:absolute;left:0;top:0.3125rem;width:1.125rem;height:0.5625rem;
box-sizing:border-box;border:1.5px solid currentColor;border-radius:0.1875rem;
}
[data-vibeui-block="button-053"] [data-part="printer"]::after{
content:"";position:absolute;left:0.25rem;top:0;width:0.625rem;height:0.375rem;
box-sizing:border-box;border:1.5px solid currentColor;border-bottom:0;
border-radius:0.125rem 0.125rem 0 0;
}
[data-vibeui-block="button-053"] [data-part="sheet"]{
position:absolute;left:0.25rem;bottom:0;width:0.625rem;height:0.375rem;
box-sizing:border-box;border:1.5px solid currentColor;border-top:0;
background:var(--vibeui-button-053-surface);
transition:transform .18s ease;
}
[data-vibeui-block="button-053"]:hover [data-part="sheet"]{transform:translateY(2px)}
[data-vibeui-block="button-053"] [data-part="hint"]{
font-family:var(--vibeui-button-053-mono);font-size:0.6875rem;font-weight:500;
color:var(--vibeui-button-053-muted);
padding:0.1875rem 0.375rem;border-radius:0.3125rem;
background:color-mix(in oklab,var(--vibeui-button-053-accent) 8%,transparent);
}
/* Кнопка не должна попадать на бумагу. */
@media print{[data-vibeui-block="button-053"]{display:none!important}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-053"] *{animation:none!important;transition:none!important}}
`

/**
 * Кнопка печати: зовёт системный диалог и прячется от самой распечатки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button053({
  hint = "Ctrl + P",
  accent,
  type = "button",
  className,
  style,
  children = "Распечатать счёт",
  onClick,
  ...props
}: Button053Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-053-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-053" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-vibeui-block="button-053"
        className={className}
        style={palette}
        onClick={(event) => {
          onClick?.(event)

          if (!event.defaultPrevented) {
            window.print()
          }
        }}
      >
        <span data-part="printer" aria-hidden="true">
          <span data-part="sheet" />
        </span>
        {children}
        {hint ? (
          <span data-part="hint" aria-hidden="true">
            {hint}
          </span>
        ) : null}
      </button>
    </>
  )
}

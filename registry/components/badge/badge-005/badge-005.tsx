"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Badge005Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children" | "onRemove"
> & {
  label?: string
  onRemove?: () => void
  size?: "sm" | "md"
}

// Идея компонента: снимаемая плашка фильтра. Крестик — настоящая кнопка с
// собственным именем: «×» без имени скринридер прочитает как «звёздочка» и
// не скажет, что именно снимает. На месте снятой плашки остаётся «Вернуть»:
// исчезнувший без следа фильтр нечем восстановить, кроме памяти.
const STYLES = `
:where([data-vibeui-block="badge-005"]){
--vibeui-badge-005-bg:oklch(0.96 0.004 265);
--vibeui-badge-005-fg:oklch(0.3 0.014 265);
--vibeui-badge-005-border:oklch(0.89 0.006 265);
--vibeui-badge-005-muted:oklch(0.55 0.014 265);
--vibeui-badge-005-accent:oklch(0.55 0.17 265);
--vibeui-badge-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="badge-005"]{
display:inline-flex;align-items:center;gap:0.25rem;
height:1.625rem;padding:0 0.25rem 0 0.625rem;
border:1px solid var(--vibeui-badge-005-border);border-radius:9999px;
background:var(--vibeui-badge-005-bg);color:var(--vibeui-badge-005-fg);
font-family:var(--vibeui-badge-005-font);font-size:0.75rem;font-weight:500;
line-height:1;white-space:nowrap;vertical-align:middle;
}
[data-vibeui-block="badge-005"][data-size="sm"]{height:1.375rem;padding:0 0.1875rem 0 0.5rem;font-size:0.6875rem}
[data-vibeui-block="badge-005"][data-gone="true"]{border-color:transparent;background:transparent;padding:0;height:auto}
/* Крестик — кнопка: у неё своя область нажатия и своё имя. */
[data-vibeui-block="badge-005"] button{
appearance:none;border:0;cursor:pointer;background:transparent;
display:inline-flex;align-items:center;justify-content:center;
width:1.125rem;height:1.125rem;padding:0;border-radius:9999px;
color:var(--vibeui-badge-005-muted);
}
[data-vibeui-block="badge-005"] button:hover{background:oklch(0.91 0.006 265);color:var(--vibeui-badge-005-fg)}
[data-vibeui-block="badge-005"] button:focus-visible{outline:2px solid var(--vibeui-badge-005-accent);outline-offset:1px}
/* Крестик нарисован двумя полосками: символ × в шрифтах кривой и прыгает. */
[data-vibeui-block="badge-005"] [data-part="cross"]{position:relative;width:0.5rem;height:0.5rem}
[data-vibeui-block="badge-005"] [data-part="cross"]::before,
[data-vibeui-block="badge-005"] [data-part="cross"]::after{
content:"";position:absolute;left:0;top:50%;width:100%;height:1.5px;
margin-top:-0.75px;background:currentColor;border-radius:9999px;
}
[data-vibeui-block="badge-005"] [data-part="cross"]::before{transform:rotate(45deg)}
[data-vibeui-block="badge-005"] [data-part="cross"]::after{transform:rotate(-45deg)}
/* След снятой плашки: место остаётся, действие обратимо. */
[data-vibeui-block="badge-005"] [data-part="undo"]{
appearance:none;border:1px dashed var(--vibeui-badge-005-border);cursor:pointer;
display:inline-flex;align-items:center;width:auto;height:1.625rem;padding:0 0.625rem;
border-radius:9999px;background:transparent;color:var(--vibeui-badge-005-muted);
font-family:var(--vibeui-badge-005-font);font-size:0.75rem;line-height:1;
}
[data-vibeui-block="badge-005"] [data-part="undo"]:hover{color:var(--vibeui-badge-005-fg)}
[data-vibeui-block="badge-005"] [data-part="undo"]:focus-visible{outline:2px solid var(--vibeui-badge-005-accent);outline-offset:1px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-005"] *{animation:none!important;transition:none!important}}
`

/**
 * Снимаемая плашка фильтра: крестик — настоящая кнопка с именем.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge005({
  label = "Москва",
  onRemove,
  size = "md",
  className,
  style,
  ...props
}: Badge005Props) {
  const [gone, setGone] = useState(false)

  return (
    <>
      <style href="vibeui-badge-005" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="badge-005"
        data-size={size}
        data-gone={gone}
        className={className}
        style={style as CSSProperties}
      >
        {gone ? (
          <button type="button" data-part="undo" onClick={() => setGone(false)}>
            Вернуть «{label}»
          </button>
        ) : null}
        {gone ? null : label}
        {gone ? null : (
          <button
            type="button"
            aria-label={`Снять фильтр «${label}»`}
            onClick={() => {
              setGone(true)
              onRemove?.()
            }}
          >
            <span data-part="cross" aria-hidden="true" />
          </button>
        )}
      </span>
    </>
  )
}

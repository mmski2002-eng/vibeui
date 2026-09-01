"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toggle009Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  count?: number
  defaultPressed?: boolean
  onChange?: (pressed: boolean) => void
  accent?: string
}

// Идея компонента: круглая кнопка сердца с числовым бейджем поверх угла, как
// у иконки корзины. Бейдж лежит вне кнопки и обновляется через role="status",
// поэтому число не склеивается с именем кнопки в один announcement.
const STYLES = `
:where([data-vibeui-block="toggle-009"]){
--vibeui-toggle-009-bg:oklch(1 0 0);
--vibeui-toggle-009-fg:oklch(0.22 0.014 265);
--vibeui-toggle-009-muted:oklch(0.55 0.014 265);
--vibeui-toggle-009-border:oklch(0.9 0.006 265);
--vibeui-toggle-009-hover:oklch(0.97 0.004 265);
--vibeui-toggle-009-accent:oklch(0.63 0.22 15);
--vibeui-toggle-009-on:oklch(0.99 0 0);
--vibeui-toggle-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toggle-009"]{
box-sizing:border-box;display:inline-flex;align-items:center;gap:0.625rem;
padding:0.625rem 0.75rem;
border:1px solid var(--vibeui-toggle-009-border);border-radius:9999px;
background:var(--vibeui-toggle-009-bg);color:var(--vibeui-toggle-009-fg);
font-family:var(--vibeui-toggle-009-font);
}
[data-vibeui-block="toggle-009"] *{box-sizing:border-box}
[data-vibeui-block="toggle-009"] [data-part="wrap"]{position:relative;flex:none}
[data-vibeui-block="toggle-009"] button{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;justify-content:center;
width:2.5rem;height:2.5rem;padding:0;
border:1px solid var(--vibeui-toggle-009-border);border-radius:9999px;
background:var(--vibeui-toggle-009-bg);color:var(--vibeui-toggle-009-muted);
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="toggle-009"] button:hover{background:var(--vibeui-toggle-009-hover)}
[data-vibeui-block="toggle-009"] button:focus-visible{
outline:2px solid var(--vibeui-toggle-009-accent);outline-offset:2px;
}
[data-vibeui-block="toggle-009"] svg{width:1.1875rem;height:1.1875rem}
[data-vibeui-block="toggle-009"] svg path{
fill:none;stroke:currentColor;stroke-width:1.6;stroke-linejoin:round;stroke-linecap:round;
}
[data-vibeui-block="toggle-009"] button[aria-pressed="true"]{
color:var(--vibeui-toggle-009-accent);border-color:var(--vibeui-toggle-009-accent);
}
[data-vibeui-block="toggle-009"] button[aria-pressed="true"] svg path{fill:currentColor}
[data-vibeui-block="toggle-009"] button[aria-pressed="true"] svg{animation:vibeui-toggle-009-beat .5s ease}
/* Бейдж вынесен из кнопки абсолютным позиционированием: он не часть имени
   кнопки, а отдельная живая цифра рядом с ней. */
[data-vibeui-block="toggle-009"] [data-part="badge"]{
position:absolute;top:-0.25rem;right:-0.25rem;min-width:1.125rem;height:1.125rem;
display:inline-flex;align-items:center;justify-content:center;
padding:0 0.25rem;border-radius:9999px;border:2px solid var(--vibeui-toggle-009-bg);
background:var(--vibeui-toggle-009-accent);color:var(--vibeui-toggle-009-on);
font-size:0.625rem;font-weight:700;line-height:1;font-variant-numeric:tabular-nums;
animation:vibeui-toggle-009-pop .22s ease;
}
[data-vibeui-block="toggle-009"] [data-part="hint"]{
margin:0;font-size:0.8125rem;font-weight:600;color:var(--vibeui-toggle-009-fg);
}
@keyframes vibeui-toggle-009-beat{
0%{transform:scale(1)}
30%{transform:scale(1.3)}
50%{transform:scale(1.05)}
70%{transform:scale(1.2)}
100%{transform:scale(1)}
}
@keyframes vibeui-toggle-009-pop{
0%{transform:scale(.6);opacity:0}
100%{transform:scale(1);opacity:1}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toggle-009"] *{animation:none!important;transition:none!important}}
`

/**
 * Кнопка избранного с сердцем и бейджем-счётчиком поверх угла: бейдж лежит
 * вне кнопки и объявляет число отдельно. Один файл, ноль зависимостей.
 */
export function Toggle009({
  label = "В избранное",
  count = 27,
  defaultPressed = false,
  onChange,
  accent,
  className,
  style,
  ...props
}: Toggle009Props) {
  const [pressed, setPressed] = useState(defaultPressed)

  const palette = {
    ...(accent ? { "--vibeui-toggle-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  const total = pressed ? count + 1 : count

  return (
    <>
      <style href="vibeui-toggle-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="toggle-009"
        className={className}
        style={palette}
      >
        <span data-part="wrap">
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
              <path d="M10 17.2 3.8 11a4 4 0 0 1 5.7-5.6L10 6l.5-.6A4 4 0 0 1 16.2 11z" />
            </svg>
          </button>
          <span data-part="badge" key={total} role="status">
            {total}
          </span>
        </span>
        <p data-part="hint">{label}</p>
      </div>
    </>
  )
}

"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toggle011Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  sample?: string
  defaultPressed?: boolean
  onChange?: (pressed: boolean) => void
  accentLight?: string
  accentDark?: string
}

// Идея компонента: солнце и луна лежат в кнопке одновременно и меняются
// прозрачностью с поворотом, а не display:none — переход виден глазами, а не
// дёргается. Рядом карточка-образец плавно перекрашивается тем же атрибутом.
const STYLES = `
:where([data-vibeui-block="toggle-011"]){
--vibeui-toggle-011-border:oklch(0.9 0.006 265);
--vibeui-toggle-011-accent-light:oklch(0.72 0.16 75);
--vibeui-toggle-011-accent-dark:oklch(0.62 0.14 265);
--vibeui-toggle-011-panel-bg:oklch(1 0 0);
--vibeui-toggle-011-panel-fg:oklch(0.22 0.014 265);
--vibeui-toggle-011-sample-bg:oklch(0.97 0.004 265);
--vibeui-toggle-011-sample-fg:oklch(0.24 0.014 265);
--vibeui-toggle-011-muted:oklch(0.55 0.014 265);
--vibeui-toggle-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toggle-011"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:20rem;padding:0.875rem;
border:1px solid var(--vibeui-toggle-011-border);border-radius:0.875rem;
background:var(--vibeui-toggle-011-panel-bg);color:var(--vibeui-toggle-011-panel-fg);
font-family:var(--vibeui-toggle-011-font);
transition:background-color .3s ease,color .3s ease;
}
[data-vibeui-block="toggle-011"] *{box-sizing:border-box}
[data-vibeui-block="toggle-011"] [data-part="bar"]{display:flex;align-items:center;gap:0.625rem}
[data-vibeui-block="toggle-011"] button{
appearance:none;cursor:pointer;font:inherit;flex:none;position:relative;
display:inline-flex;align-items:center;justify-content:center;overflow:hidden;
width:2.5rem;height:2.5rem;padding:0;
border:1px solid var(--vibeui-toggle-011-border);border-radius:9999px;
background:transparent;color:var(--vibeui-toggle-011-accent-light);
transition:color .3s ease,border-color .3s ease;
}
[data-vibeui-block="toggle-011"] button[aria-pressed="true"]{color:var(--vibeui-toggle-011-accent-dark)}
[data-vibeui-block="toggle-011"] button:focus-visible{
outline:2px solid currentColor;outline-offset:2px;
}
[data-vibeui-block="toggle-011"] svg{
position:absolute;width:1.25rem;height:1.25rem;
transition:opacity .3s ease,transform .3s ease;
}
/* Оба значка живут в разметке всегда — меняется только их прозрачность и
   поворот, поэтому смена темы выглядит плавной, а не мгновенным щелчком. */
[data-vibeui-block="toggle-011"] [data-part="sun"]{opacity:1;transform:rotate(0deg) scale(1)}
[data-vibeui-block="toggle-011"] [data-part="moon"]{opacity:0;transform:rotate(-60deg) scale(0.6)}
[data-vibeui-block="toggle-011"] button[aria-pressed="true"] [data-part="sun"]{opacity:0;transform:rotate(60deg) scale(0.6)}
[data-vibeui-block="toggle-011"] button[aria-pressed="true"] [data-part="moon"]{opacity:1;transform:rotate(0deg) scale(1)}
[data-vibeui-block="toggle-011"] [data-part="label"]{margin:0;font-size:0.875rem;font-weight:600}
[data-vibeui-block="toggle-011"] [data-part="sample"]{
margin:0;padding:0.75rem;border-radius:0.625rem;font-size:0.8125rem;line-height:1.5;
background:var(--vibeui-toggle-011-sample-bg);color:var(--vibeui-toggle-011-sample-fg);
transition:background-color .3s ease,color .3s ease;
}
[data-vibeui-block="toggle-011"][data-theme="dark"]{
background:oklch(0.2 0.01 265);color:oklch(0.94 0.004 265);
}
[data-vibeui-block="toggle-011"][data-theme="dark"] [data-part="sample"]{
background:oklch(0.27 0.012 265);color:oklch(0.94 0.004 265);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toggle-011"] *{animation:none!important;transition:none!important}}
`

/**
 * Кнопка темы: солнце и луна лежат в разметке одновременно и меняются
 * прозрачностью с поворотом. Один файл, ноль зависимостей.
 */
export function Toggle011({
  label = "Тёмная тема",
  sample = "Так будет выглядеть карточка контента.",
  defaultPressed = false,
  onChange,
  accentLight,
  accentDark,
  className,
  style,
  ...props
}: Toggle011Props) {
  const [pressed, setPressed] = useState(defaultPressed)

  const palette = {
    ...(accentLight ? { "--vibeui-toggle-011-accent-light": accentLight } : null),
    ...(accentDark ? { "--vibeui-toggle-011-accent-dark": accentDark } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toggle-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="toggle-011"
        data-theme={pressed ? "dark" : "light"}
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
            <svg data-part="sun" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="10" cy="10" r="3.6" fill="currentColor" />
              <path
                d="M10 2.4v2M10 15.6v2M17.6 10h-2M4.4 10h-2M15.4 4.6l-1.4 1.4M6 14l-1.4 1.4M15.4 15.4L14 14M6 6 4.6 4.6"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            <svg data-part="moon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M16.5 12.3A6.8 6.8 0 0 1 7.7 3.5a7 7 0 1 0 8.8 8.8z"
                fill="currentColor"
              />
            </svg>
          </button>
          <p data-part="label">{pressed ? "Тёмная тема" : "Светлая тема"}</p>
        </div>
        <p data-part="sample">{sample}</p>
      </div>
    </>
  )
}

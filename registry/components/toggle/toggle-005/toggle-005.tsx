"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toggle005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  volume?: number
  defaultPressed?: boolean
  onChange?: (pressed: boolean) => void
  accent?: string
}

// Идея компонента: toggle с двумя значками состояния. Оба лежат в разметке,
// показывается тот, что совпал с aria-pressed, — картинка не может разойтись
// с состоянием, потому что источник у них один атрибут.
const STYLES = `
:where([data-vibeui-block="toggle-005"]){
--vibeui-toggle-005-bg:oklch(1 0 0);
--vibeui-toggle-005-fg:oklch(0.22 0.014 265);
--vibeui-toggle-005-muted:oklch(0.56 0.014 265);
--vibeui-toggle-005-border:oklch(0.9 0.006 265);
--vibeui-toggle-005-accent:oklch(0.55 0.17 285);
--vibeui-toggle-005-track:oklch(0.93 0.006 265);
--vibeui-toggle-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toggle-005"]{
box-sizing:border-box;display:flex;align-items:center;gap:0.75rem;
width:100%;max-width:21rem;padding:0.75rem 0.875rem;
border:1px solid var(--vibeui-toggle-005-border);border-radius:0.875rem;
background:var(--vibeui-toggle-005-bg);color:var(--vibeui-toggle-005-fg);
font-family:var(--vibeui-toggle-005-font);
}
[data-vibeui-block="toggle-005"] *{box-sizing:border-box}
[data-vibeui-block="toggle-005"] button{
appearance:none;cursor:pointer;font:inherit;flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:2.5rem;height:2.5rem;padding:0;
border:1px solid var(--vibeui-toggle-005-border);border-radius:0.75rem;
background:var(--vibeui-toggle-005-bg);color:var(--vibeui-toggle-005-fg);
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="toggle-005"] button:focus-visible{
outline:2px solid var(--vibeui-toggle-005-accent);outline-offset:2px;
}
[data-vibeui-block="toggle-005"] button[aria-pressed="true"]{
background:var(--vibeui-toggle-005-fg);border-color:var(--vibeui-toggle-005-fg);
color:oklch(0.99 0 0);
}
[data-vibeui-block="toggle-005"] svg{width:1.1875rem;height:1.1875rem;display:none}
[data-vibeui-block="toggle-005"] button[aria-pressed="false"] [data-part="sound"]{display:block}
[data-vibeui-block="toggle-005"] button[aria-pressed="true"] [data-part="silent"]{display:block}
[data-vibeui-block="toggle-005"] [data-part="text"]{flex:1;min-width:0}
[data-vibeui-block="toggle-005"] [data-part="state"]{
margin:0;font-size:0.8125rem;font-weight:600;line-height:1.3;
}
[data-vibeui-block="toggle-005"] [data-part="meter"]{
display:block;margin-top:0.4375rem;height:0.375rem;border-radius:9999px;
background:var(--vibeui-toggle-005-track);overflow:hidden;
}
[data-vibeui-block="toggle-005"] [data-part="fill"]{
display:block;height:100%;border-radius:9999px;
background:var(--vibeui-toggle-005-accent);
transition:width .2s ease,background-color .2s ease;
}
/* Выключенный звук гасит и полосу: состояние обязано читаться не только по
   значку — иначе на беглом взгляде громкость выглядит рабочей. */
[data-vibeui-block="toggle-005"][data-muted="true"] [data-part="fill"]{
background:var(--vibeui-toggle-005-muted);opacity:.4;
}
[data-vibeui-block="toggle-005"] [data-part="value"]{
margin:0.25rem 0 0;font-size:0.75rem;color:var(--vibeui-toggle-005-muted);
font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toggle-005"] *{animation:none!important;transition:none!important}}
`

/**
 * Кнопка отключения звука с двумя значками состояния: показывается тот,
 * что совпал с aria-pressed. Один файл, ноль зависимостей.
 */
export function Toggle005({
  label = "Без звука",
  volume = 64,
  defaultPressed = false,
  onChange,
  accent,
  className,
  style,
  ...props
}: Toggle005Props) {
  const [pressed, setPressed] = useState(defaultPressed)

  const palette = {
    ...(accent ? { "--vibeui-toggle-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toggle-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="toggle-005"
        data-muted={pressed}
        className={className}
        style={palette}
      >
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
          <svg
            data-part="sound"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 7.5h2.5L10.5 4v12L6.5 12.5H4zM13.6 7a4 4 0 0 1 0 6M15.9 4.9a7 7 0 0 1 0 10.2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            data-part="silent"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 7.5h2.5L10.5 4v12L6.5 12.5H4zM14 8l4 4M18 8l-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div data-part="text">
          <p data-part="state" role="status">
            {pressed ? "Звук выключен" : "Звук включён"}
          </p>
          <span data-part="meter">
            <span data-part="fill" style={{ width: `${volume}%` }} />
          </span>
          <p data-part="value">
            {pressed ? "Громкость сохранена" : "Громкость"} {volume}%
          </p>
        </div>
      </div>
    </>
  )
}

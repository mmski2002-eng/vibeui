"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toggle013Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  fieldLabel?: string
  defaultValue?: string
  defaultPressed?: boolean
  onChange?: (visible: boolean) => void
  accent?: string
}

// Идея компонента: кнопка «показать пароль» стоит внутри поля, рядом с
// текстом, а не отдельно от него — aria-controls указывает на input, а
// живая строка снаружи объявляет исход для тех, кто не видит текст на экране.
const STYLES = `
:where([data-vibeui-block="toggle-013"]){
--vibeui-toggle-013-bg:oklch(1 0 0);
--vibeui-toggle-013-fg:oklch(0.22 0.014 265);
--vibeui-toggle-013-muted:oklch(0.55 0.014 265);
--vibeui-toggle-013-border:oklch(0.82 0.006 265);
--vibeui-toggle-013-accent:oklch(0.56 0.16 255);
--vibeui-toggle-013-hover:oklch(0.96 0.004 265);
--vibeui-toggle-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toggle-013"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:19rem;
font-family:var(--vibeui-toggle-013-font);color:var(--vibeui-toggle-013-fg);
}
[data-vibeui-block="toggle-013"] *{box-sizing:border-box}
[data-vibeui-block="toggle-013"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="toggle-013"] [data-part="row"]{
display:flex;align-items:center;gap:0.375rem;
border:1px solid var(--vibeui-toggle-013-border);border-radius:0.625rem;
background:var(--vibeui-toggle-013-bg);padding:0 0.375rem 0 0.75rem;
}
[data-vibeui-block="toggle-013"] [data-part="row"]:focus-within{
border-color:var(--vibeui-toggle-013-accent);
box-shadow:0 0 0 3px color-mix(in oklch, var(--vibeui-toggle-013-accent) 22%, transparent);
}
[data-vibeui-block="toggle-013"] input{
appearance:none;border:none;outline:none;background:transparent;color:inherit;
flex:1;min-width:0;height:2.5rem;font:inherit;font-size:0.875rem;
letter-spacing:0.02em;
}
[data-vibeui-block="toggle-013"] button{
appearance:none;cursor:pointer;font:inherit;flex:none;
display:inline-flex;align-items:center;gap:0.375rem;
height:2rem;padding:0 0.625rem;border:none;border-radius:0.5rem;
background:transparent;color:var(--vibeui-toggle-013-muted);
font-size:0.75rem;font-weight:600;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="toggle-013"] button:hover{background:var(--vibeui-toggle-013-hover)}
[data-vibeui-block="toggle-013"] button:focus-visible{
outline:2px solid var(--vibeui-toggle-013-accent);outline-offset:2px;
}
[data-vibeui-block="toggle-013"] button[aria-pressed="true"]{color:var(--vibeui-toggle-013-accent)}
[data-vibeui-block="toggle-013"] svg{width:1rem;height:1rem}
[data-vibeui-block="toggle-013"] svg path,
[data-vibeui-block="toggle-013"] svg circle{
fill:none;stroke:currentColor;stroke-width:1.5;stroke-linejoin:round;stroke-linecap:round;
}
[data-vibeui-block="toggle-013"] [data-part="hint"]{
margin:0;font-size:0.75rem;color:var(--vibeui-toggle-013-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toggle-013"] *{animation:none!important;transition:none!important}}
`

/**
 * Поле пароля с кнопкой видимости внутри поля: aria-controls связывает
 * кнопку с input, живая строка объявляет исход. Один файл, ноль зависимостей.
 */
export function Toggle013({
  fieldLabel = "Пароль",
  defaultValue = "SuperSecret123",
  defaultPressed = false,
  onChange,
  accent,
  className,
  style,
  ...props
}: Toggle013Props) {
  const [visible, setVisible] = useState(defaultPressed)
  const id = useId()

  const palette = {
    ...(accent ? { "--vibeui-toggle-013-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toggle-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="toggle-013"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{fieldLabel}</label>
        <div data-part="row">
          <input
            id={id}
            type={visible ? "text" : "password"}
            defaultValue={defaultValue}
            autoComplete="current-password"
          />
          <button
            type="button"
            aria-pressed={visible}
            aria-controls={id}
            aria-label={visible ? "Скрыть пароль" : "Показать пароль"}
            onClick={() => {
              setVisible(!visible)
              onChange?.(!visible)
            }}
          >
            {visible ? (
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 6l12 8M4 14 16 6M2 10s2.7-5 8-5 8 5 8 5-2.7 5-8 5-8-5-8-5Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M2 10s2.7-5 8-5 8 5 8 5-2.7 5-8 5-8-5-8-5Z" />
                <circle cx="10" cy="10" r="2.2" />
              </svg>
            )}
            {visible ? "Скрыть" : "Показать"}
          </button>
        </div>
        <p data-part="hint" role="status">
          {visible ? "Пароль виден" : "Пароль скрыт"}
        </p>
      </div>
    </>
  )
}

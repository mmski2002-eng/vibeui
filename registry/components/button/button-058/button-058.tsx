"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button058Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  /** Подпись поля: без неё кнопка-глаз висит в воздухе. */
  label?: string
  placeholder?: string
  defaultValue?: string
  showLabel?: string
  hideLabel?: string
  accent?: string
}

// Идея компонента: кнопка «показать пароль» живёт внутри поля. Состояние
// объявлено через aria-pressed, а не сменой иконки, и подпись кнопки меняется
// вместе с ним. Поле всегда одно и то же: меняется только type, поэтому
// каретка и введённый текст на месте. autoComplete остаётся current-password.
const STYLES = `
:where([data-vibeui-block="button-058"]){
--vibeui-button-058-surface:oklch(1 0 0);
--vibeui-button-058-border:oklch(0.88 0.006 265);
--vibeui-button-058-fg:oklch(0.24 0.02 265);
--vibeui-button-058-muted:oklch(0.56 0.014 265);
--vibeui-button-058-accent:oklch(0.53 0.16 265);
--vibeui-button-058-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-058"]{
display:flex;flex-direction:column;gap:0.375rem;box-sizing:border-box;
width:100%;max-width:20rem;
font-family:var(--vibeui-button-058-font);color:var(--vibeui-button-058-fg);
}
[data-vibeui-block="button-058"] label{font-size:0.75rem;font-weight:600;color:var(--vibeui-button-058-muted)}
[data-vibeui-block="button-058"] [data-part="field"]{
position:relative;display:flex;align-items:center;
border:1px solid var(--vibeui-button-058-border);border-radius:0.625rem;
background:var(--vibeui-button-058-surface);
transition:border-color .16s ease;
}
[data-vibeui-block="button-058"] [data-part="field"]:has(input:focus-visible){
border-color:var(--vibeui-button-058-accent);
outline:2px solid color-mix(in oklab,var(--vibeui-button-058-accent) 45%,transparent);
outline-offset:1px;
}
[data-vibeui-block="button-058"] input{
flex:1;min-width:0;appearance:none;border:0;background:transparent;outline:0;
height:2.625rem;padding:0 2.75rem 0 0.75rem;
font:inherit;font-size:0.9375rem;color:inherit;
letter-spacing:0.02em;
}
[data-vibeui-block="button-058"] [data-part="toggle"]{
position:absolute;right:0.3125rem;
appearance:none;border:0;background:transparent;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:0.4375rem;color:var(--vibeui-button-058-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="button-058"] [data-part="toggle"]:hover{
background:color-mix(in oklab,var(--vibeui-button-058-accent) 10%,transparent);
color:var(--vibeui-button-058-accent);
}
[data-vibeui-block="button-058"] [data-part="toggle"]:focus-visible{outline:2px solid var(--vibeui-button-058-accent);outline-offset:2px}
[data-vibeui-block="button-058"] [data-part="toggle"][aria-pressed="true"]{color:var(--vibeui-button-058-accent)}
[data-vibeui-block="button-058"] [data-part="eye"]{position:relative;width:1.125rem;height:1.125rem}
[data-vibeui-block="button-058"] [data-part="eye"]::before{
content:"";position:absolute;left:0;top:50%;width:1.125rem;height:0.75rem;
margin-top:-0.375rem;box-sizing:border-box;
border:1.5px solid currentColor;border-radius:0.5625rem;
}
[data-vibeui-block="button-058"] [data-part="eye"]::after{
content:"";position:absolute;left:50%;top:50%;width:0.3125rem;height:0.3125rem;
margin:-0.15625rem 0 0 -0.15625rem;border-radius:50%;background:currentColor;
}
/* Перечёркнутый глаз — состояние «скрыто». */
[data-vibeui-block="button-058"] [data-part="slash"]{
position:absolute;left:-0.0625rem;top:50%;width:1.25rem;height:1.5px;
background:currentColor;transform:rotate(-40deg);transform-origin:center;
box-shadow:0 -2px 0 0 var(--vibeui-button-058-surface);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-058"] *{animation:none!important;transition:none!important}}
`

/**
 * Поле пароля с кнопкой «показать»: состояние объявлено через aria-pressed.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button058({
  label = "Пароль",
  placeholder = "Введите пароль",
  defaultValue = "correct-horse-battery",
  showLabel = "Показать пароль",
  hideLabel = "Скрыть пароль",
  accent,
  className,
  style,
  ...props
}: Button058Props) {
  const [shown, setShown] = useState(false)

  const palette = {
    ...(accent ? { "--vibeui-button-058-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-058" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="button-058"
        className={className}
        style={palette}
      >
        <label htmlFor="vibeui-button-058-input">{label}</label>
        <div data-part="field">
          <input
            id="vibeui-button-058-input"
            type={shown ? "text" : "password"}
            defaultValue={defaultValue}
            placeholder={placeholder}
            autoComplete="current-password"
          />
          <button
            type="button"
            data-part="toggle"
            aria-pressed={shown}
            aria-label={shown ? hideLabel : showLabel}
            title={shown ? hideLabel : showLabel}
            onClick={() => setShown((value) => !value)}
          >
            <span data-part="eye" aria-hidden="true">
              {shown ? null : <span data-part="slash" />}
            </span>
          </button>
        </div>
      </div>
    </>
  )
}

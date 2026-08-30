"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Checkbox005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  text?: string
  linkLabel?: string
  linkHref?: string
  error?: string
  accent?: string
}

// Идея компонента: согласие с условиями. Галочка не проставлена заранее —
// предвыбранное согласие незаконно в ЕС и нечестно везде. Ссылка на документ
// живёт внутри подписи и остаётся отдельной целью: нажатие на неё не должно
// ставить галочку. Ошибка появляется под строкой и связана с полем.
const STYLES = `
:where([data-vibeui-block="checkbox-005"]){
--vibeui-checkbox-005-bg:oklch(1 0 0);
--vibeui-checkbox-005-fg:oklch(0.24 0.014 265);
--vibeui-checkbox-005-muted:oklch(0.56 0.014 265);
--vibeui-checkbox-005-border:oklch(0.88 0.008 265);
--vibeui-checkbox-005-accent:oklch(0.55 0.17 265);
--vibeui-checkbox-005-danger:oklch(0.56 0.19 25);
--vibeui-checkbox-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="checkbox-005"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-checkbox-005-bg);
border:1px solid var(--vibeui-checkbox-005-border);border-radius:0.875rem;
font-family:var(--vibeui-checkbox-005-font);color:var(--vibeui-checkbox-005-fg);
}
[data-vibeui-block="checkbox-005"] [data-part="row"]{display:flex;align-items:flex-start;gap:0.5rem}
[data-vibeui-block="checkbox-005"] input{
appearance:none;flex:none;cursor:pointer;position:relative;
width:1.125rem;height:1.125rem;margin:0.125rem 0 0;box-sizing:border-box;
border:1.5px solid var(--vibeui-checkbox-005-border);border-radius:0.3125rem;
background:var(--vibeui-checkbox-005-bg);
}
[data-vibeui-block="checkbox-005"] input:checked{border-color:transparent;background:var(--vibeui-checkbox-005-accent)}
[data-vibeui-block="checkbox-005"] input:checked::after{
content:"";position:absolute;left:50%;top:50%;
width:0.25rem;height:0.4375rem;margin:-0.3125rem 0 0 -0.125rem;
border-right:2px solid oklch(0.99 0.01 265);border-bottom:2px solid oklch(0.99 0.01 265);
transform:rotate(45deg);
}
[data-vibeui-block="checkbox-005"] input:focus-visible{outline:2px solid var(--vibeui-checkbox-005-accent);outline-offset:2px}
[data-vibeui-block="checkbox-005"][data-error="true"] input{border-color:var(--vibeui-checkbox-005-danger)}
[data-vibeui-block="checkbox-005"] label{font-size:0.8125rem;line-height:1.45;cursor:pointer}
/* Ссылка внутри подписи — отдельная цель: нажатие на неё не должно ставить
   галочку, поэтому клик по ней не всплывает до label. */
[data-vibeui-block="checkbox-005"] a{color:var(--vibeui-checkbox-005-accent);text-decoration:underline;text-underline-offset:2px}
[data-vibeui-block="checkbox-005"] a:focus-visible{outline:2px solid var(--vibeui-checkbox-005-accent);outline-offset:2px;border-radius:0.25rem}
[data-vibeui-block="checkbox-005"] [data-part="error"]{
display:flex;align-items:center;gap:0.375rem;padding-left:1.625rem;
font-size:0.75rem;font-weight:600;color:var(--vibeui-checkbox-005-danger);
}
[data-vibeui-block="checkbox-005"] [data-part="mark"]{
position:relative;flex:none;width:0.75rem;height:0.75rem;
border:1.5px solid currentColor;border-radius:9999px;
}
[data-vibeui-block="checkbox-005"] [data-part="mark"]::after{
content:"";position:absolute;left:50%;top:0.125rem;width:1.5px;height:0.3125rem;
margin-left:-0.75px;background:currentColor;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-005"] *{animation:none!important;transition:none!important}}
`

/**
 * Согласие с условиями: галочка не проставлена заранее, ссылка отдельной целью.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Checkbox005({
  text = "Я прочитал и принимаю",
  linkLabel = "условия обработки данных",
  linkHref = "#",
  error = "Без согласия отправить форму не получится",
  accent,
  className,
  style,
  ...props
}: Checkbox005Props) {
  const id = useId()
  // Согласие никогда не проставлено заранее: предвыбранная галочка незаконна
  // в ЕС и нечестна везде.
  const [checked, setChecked] = useState(false)
  const [touched, setTouched] = useState(false)
  const invalid = touched && !checked

  const palette = {
    ...(accent ? { "--vibeui-checkbox-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-checkbox-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="checkbox-005"
        data-error={invalid}
        className={className}
        style={palette}
      >
        <div data-part="row">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            aria-invalid={invalid}
            aria-describedby={invalid ? `${id}-error` : undefined}
            onChange={(event) => {
              setChecked(event.target.checked)
              setTouched(true)
            }}
          />
          <label htmlFor={id}>
            {text}{" "}
            <a href={linkHref} onClick={(event) => event.stopPropagation()}>
              {linkLabel}
            </a>
            .
          </label>
        </div>
        {invalid ? (
          <p data-part="error" id={`${id}-error`} role="alert">
            <span data-part="mark" aria-hidden="true" />
            {error}
          </p>
        ) : null}
      </div>
    </>
  )
}

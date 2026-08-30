"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Input005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  prefix?: string
  hint?: string
  onChange?: (digits: string) => void
  accent?: string
}

// Идея компонента: телефон с маской, которая не мешает. Форматирование идёт
// от цифр: из ввода вынимаются только они, а скобки и дефисы дорисовываются
// сверху. Так вставка из буфера в любом формате не ломает поле, а стирание
// не застревает на скобке.
const STYLES = `
:where([data-vibeui-block="input-005"]){
--vibeui-input-005-bg:oklch(1 0 0);
--vibeui-input-005-fg:oklch(0.22 0.014 265);
--vibeui-input-005-muted:oklch(0.56 0.014 265);
--vibeui-input-005-border:oklch(0.9 0.006 265);
--vibeui-input-005-field:oklch(0.985 0.002 265);
--vibeui-input-005-accent:oklch(0.55 0.17 265);
--vibeui-input-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="input-005"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-005-bg);
border:1px solid var(--vibeui-input-005-border);border-radius:0.875rem;
font-family:var(--vibeui-input-005-font);color:var(--vibeui-input-005-fg);
}
[data-vibeui-block="input-005"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-005"] [data-part="row"]{
display:flex;align-items:center;gap:0.5rem;
box-sizing:border-box;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-input-005-border);border-radius:0.625rem;
background:var(--vibeui-input-005-field);
}
[data-vibeui-block="input-005"] [data-part="row"]:focus-within{
outline:2px solid var(--vibeui-input-005-accent);outline-offset:1px;border-color:transparent;
}
/* Код страны — не часть поля: его не стирают и не редактируют случайно. */
[data-vibeui-block="input-005"] [data-part="prefix"]{
flex:none;color:var(--vibeui-input-005-muted);font-size:0.875rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="input-005"] input{
flex:1;min-width:0;height:100%;border:0;background:transparent;color:inherit;
font:inherit;font-size:0.875rem;font-variant-numeric:tabular-nums;letter-spacing:0.01em;
}
[data-vibeui-block="input-005"] input:focus{outline:none}
[data-vibeui-block="input-005"] [data-part="hint"]{font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-005-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-005"] *{animation:none!important;transition:none!important}}
`

// Форматирование идёт от цифр: вставка «+7 (999) 000-00-00» и «79990000000»
// даёт одинаковый результат, а стирание не застревает на скобке.
function format(digits: string) {
  const value = digits.slice(0, 10)
  const parts = [
    value.slice(0, 3),
    value.slice(3, 6),
    value.slice(6, 8),
    value.slice(8, 10),
  ].filter(Boolean)

  if (parts.length === 0) return ""
  if (parts.length === 1) return `(${parts[0]}`
  return `(${parts[0]}) ${parts.slice(1).join("-")}`
}

/**
 * Телефон с маской от цифр: вставка в любом формате не ломает поле.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Input005({
  label = "Телефон",
  prefix = "+7",
  hint = "Пришлём код подтверждения в СМС",
  onChange,
  accent,
  className,
  style,
  ...props
}: Input005Props) {
  const id = useId()
  const [digits, setDigits] = useState("9990000000")

  const palette = {
    ...(accent ? { "--vibeui-input-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-input-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="input-005"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="row">
          <span data-part="prefix">{prefix}</span>
          <input
            id={id}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(999) 000-00-00"
            value={format(digits)}
            aria-describedby={hint ? `${id}-hint` : undefined}
            onChange={(event) => {
              const next = event.target.value.replace(/\D/g, "").slice(0, 10)
              setDigits(next)
              onChange?.(next)
            }}
          />
        </div>
        {hint ? (
          <span data-part="hint" id={`${id}-hint`}>
            {hint}
          </span>
        ) : null}
      </div>
    </>
  )
}

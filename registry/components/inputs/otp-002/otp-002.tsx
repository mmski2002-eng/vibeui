"use client"

import { useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Otp002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  length?: number
  hint?: string
  onChange?: (code: string) => void
  accent?: string
}

// Идея компонента: ячеек шесть, а поле одно. Прозрачный input растянут поверх
// ячеек, ячейки — просто отрисовка его значения. Отсюда бесплатно берутся
// вставка целиком, автопереход, Backspace, стрелки, отмена и системная
// подстановка кода — всё это умеет обычное текстовое поле, и городить шесть
// input'ов с переносом фокуса не нужно. Каретка нарисована сама: у прозрачного
// поля её не видно.
const STYLES = `
:where([data-vibeui-block="otp-002"]){
--vibeui-otp-002-surface:oklch(1 0 0);
--vibeui-otp-002-shell:oklch(0.91 0.006 265);
--vibeui-otp-002-fg:oklch(0.21 0.014 265);
--vibeui-otp-002-muted:oklch(0.56 0.014 265);
--vibeui-otp-002-field:oklch(0.98 0.002 265);
--vibeui-otp-002-border:oklch(0.87 0.008 265);
--vibeui-otp-002-accent:oklch(0.52 0.18 285);
--vibeui-otp-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="otp-002"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-otp-002-surface);
border:1px solid var(--vibeui-otp-002-shell);border-radius:0.875rem;
font-family:var(--vibeui-otp-002-font);color:var(--vibeui-otp-002-fg);
}
[data-vibeui-block="otp-002"] *{box-sizing:border-box}
[data-vibeui-block="otp-002"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="otp-002"] [data-part="shell"]{position:relative}
/* Настоящее поле лежит поверх ячеек и полностью прозрачно: щелчок в любую
   ячейку попадает в него, а системная клавиатура и автоподстановка работают. */
[data-vibeui-block="otp-002"] input{
position:absolute;inset:0;width:100%;height:100%;
padding:0;border:0;margin:0;background:transparent;
color:transparent;caret-color:transparent;
font:inherit;font-size:1rem;letter-spacing:2rem;
}
[data-vibeui-block="otp-002"] input:focus{outline:none}
[data-vibeui-block="otp-002"] [data-part="row"]{
display:flex;gap:0.375rem;pointer-events:none;
}
[data-vibeui-block="otp-002"] [data-part="cell"]{
flex:1;min-width:0;height:3rem;
display:grid;place-items:center;
border:1.5px solid var(--vibeui-otp-002-border);border-radius:0.625rem;
background:var(--vibeui-otp-002-field);
font-size:1.25rem;font-weight:700;font-variant-numeric:tabular-nums;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="otp-002"] [data-part="cell"][data-filled="1"]{
border-color:color-mix(in oklab,var(--vibeui-otp-002-accent) 55%,transparent);
background:var(--vibeui-otp-002-surface);
}
[data-vibeui-block="otp-002"] [data-part="cell"][data-active="1"]{
border-color:var(--vibeui-otp-002-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-otp-002-accent) 18%,transparent);
}
/* Каретка рисуется сама: у прозрачного поля её не видно. */
[data-vibeui-block="otp-002"] [data-part="caret"]{
width:2px;height:1.375rem;border-radius:1px;
background:var(--vibeui-otp-002-accent);
animation:vibeui-otp-002-blink 1.06s steps(2,start) infinite;
}
@keyframes vibeui-otp-002-blink{50%{opacity:0}}
[data-vibeui-block="otp-002"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-otp-002-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="otp-002"] *{animation:none!important;transition:none!important}}
`

/**
 * Код подтверждения: шесть ячеек, но одно настоящее поле под ними.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Otp002({
  label = "Код подтверждения",
  length = 6,
  hint = "Вставьте код целиком — он разложится по ячейкам сам.",
  onChange,
  accent,
  className,
  style,
  ...props
}: Otp002Props) {
  const id = useId()
  const size = Math.max(4, Math.min(8, length))
  const [code, setCode] = useState("")
  const [focused, setFocused] = useState(false)
  const field = useRef<HTMLInputElement | null>(null)

  const palette = {
    ...(accent ? { "--vibeui-otp-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  const cells = Array.from({ length: size }, (_, index) => code[index] ?? "")
  const at = Math.min(code.length, size - 1)

  return (
    <>
      <style href="vibeui-otp-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="otp-002"
        className={className}
        style={palette}
      >
        <span data-part="label" id={`${id}-label`}>
          {label}
        </span>
        <div data-part="shell">
          <div data-part="row" aria-hidden="true">
            {cells.map((digit, index) => (
              <div
                key={index}
                data-part="cell"
                data-filled={digit ? "1" : "0"}
                data-active={
                  focused && index === at && code.length < size ? "1" : "0"
                }
              >
                {digit ||
                  (focused && index === at ? <span data-part="caret" /> : null)}
              </div>
            ))}
          </div>
          <input
            ref={field}
            id={id}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={size}
            value={code}
            aria-labelledby={`${id}-label`}
            aria-describedby={`${id}-hint`}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(event) => {
              const next = event.target.value.replace(/\D/g, "").slice(0, size)
              setCode(next)
              onChange?.(next)
            }}
          />
        </div>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}

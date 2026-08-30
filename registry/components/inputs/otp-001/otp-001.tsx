"use client"

import { useId, useRef, useState } from "react"
import type {
  ClipboardEvent,
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Otp001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  length?: number
  hint?: string
  onChange?: (code: string) => void
  accent?: string
}

// Идея компонента: код из СМС по одной цифре в клетке. Главное здесь —
// вставка целиком: код почти всегда копируют, и поле обязано разложить его по
// клеткам само. Backspace на пустой клетке уводит назад, иначе стереть
// набранное невозможно.
const STYLES = `
:where([data-vibeui-block="otp-001"]){
--vibeui-otp-001-bg:oklch(1 0 0);
--vibeui-otp-001-fg:oklch(0.22 0.014 265);
--vibeui-otp-001-muted:oklch(0.56 0.014 265);
--vibeui-otp-001-border:oklch(0.88 0.008 265);
--vibeui-otp-001-field:oklch(0.985 0.002 265);
--vibeui-otp-001-accent:oklch(0.55 0.17 265);
--vibeui-otp-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="otp-001"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-otp-001-bg);
border:1px solid var(--vibeui-otp-001-border);border-radius:0.875rem;
font-family:var(--vibeui-otp-001-font);color:var(--vibeui-otp-001-fg);
}
[data-vibeui-block="otp-001"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="otp-001"] [data-part="row"]{display:flex;gap:0.375rem}
[data-vibeui-block="otp-001"] input{
flex:1;min-width:0;height:3rem;padding:0;box-sizing:border-box;
border:1.5px solid var(--vibeui-otp-001-border);border-radius:0.625rem;
background:var(--vibeui-otp-001-field);color:inherit;
font:inherit;font-size:1.125rem;font-weight:650;text-align:center;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="otp-001"] input:focus-visible{
outline:2px solid var(--vibeui-otp-001-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="otp-001"] input:not(:placeholder-shown){border-color:var(--vibeui-otp-001-accent)}
[data-vibeui-block="otp-001"] [data-part="hint"]{font-size:0.75rem;line-height:1.4;color:var(--vibeui-otp-001-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="otp-001"] *{animation:none!important;transition:none!important}}
`

/**
 * Код из СМС по клеткам: вставка целиком раскладывается сама.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Otp001({
  label = "Код из СМС",
  length = 6,
  hint = "Отправили на +7 999 000-00-00. Код придёт в течение минуты",
  onChange,
  accent,
  className,
  style,
  ...props
}: Otp001Props) {
  const id = useId()
  const size = Math.max(4, Math.min(8, length))
  const [code, setCode] = useState<string[]>(Array(size).fill(""))
  const boxes = useRef<(HTMLInputElement | null)[]>([])

  const palette = {
    ...(accent ? { "--vibeui-otp-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  const push = (next: string[]) => {
    setCode(next)
    onChange?.(next.join(""))
  }

  const type = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1)
    const next = [...code]
    next[index] = digit
    push(next)
    if (digit && index < size - 1) boxes.current[index + 1]?.focus()
  }

  // Вставка целиком: код копируют из сообщения, и раскладывать его руками
  // по клеткам никто не станет.
  const paste = (event: ClipboardEvent<HTMLInputElement>) => {
    const digits = event.clipboardData.getData("text").replace(/\D/g, "")
    if (!digits) return
    event.preventDefault()
    const next = Array.from({ length: size }, (_, index) => digits[index] ?? "")
    push(next)
    boxes.current[Math.min(digits.length, size - 1)]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      event.preventDefault()
      boxes.current[index - 1]?.focus()
      const next = [...code]
      next[index - 1] = ""
      push(next)
    } else if (event.key === "ArrowLeft" && index > 0) {
      boxes.current[index - 1]?.focus()
    } else if (event.key === "ArrowRight" && index < size - 1) {
      boxes.current[index + 1]?.focus()
    }
  }

  return (
    <>
      <style href="vibeui-otp-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="otp-001"
        className={className}
        style={palette}
        role="group"
        aria-labelledby={`${id}-label`}
      >
        <span data-part="label" id={`${id}-label`}>
          {label}
        </span>
        <div data-part="row">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(node) => {
                boxes.current[index] = node
              }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              placeholder=" "
              value={digit}
              aria-label={`Цифра ${index + 1} из ${size}`}
              onChange={(event) => type(index, event.target.value)}
              onPaste={paste}
              onKeyDown={(event) => onKeyDown(event, index)}
            />
          ))}
        </div>
        {hint ? <span data-part="hint">{hint}</span> : null}
      </div>
    </>
  )
}

"use client"

import { useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Input015Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  suffix?: string
  max?: number
  onChange?: (amount: number) => void
  accent?: string
}

// Идея компонента: разряды расставляются прямо во время набора, а курсор
// не улетает в конец — он пересчитывается по числу цифр слева от него.
// Это главная сложность живого форматирования: без пересчёта поле нельзя
// править в середине. Под полем сумма продублирована словами-сокращениями,
// чтобы «1 200 000» и «120 000» не путались краем глаза.
const STYLES = `
:where([data-vibeui-block="input-015"]){
--vibeui-input-015-surface:oklch(1 0 0);
--vibeui-input-015-shell:oklch(0.91 0.006 265);
--vibeui-input-015-fg:oklch(0.21 0.014 265);
--vibeui-input-015-muted:oklch(0.55 0.014 265);
--vibeui-input-015-field:oklch(0.985 0.002 265);
--vibeui-input-015-border:oklch(0.88 0.008 265);
--vibeui-input-015-accent:oklch(0.5 0.15 150);
--vibeui-input-015-bad:oklch(0.55 0.2 25);
--vibeui-input-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="input-015"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-015-surface);
border:1px solid var(--vibeui-input-015-shell);border-radius:0.875rem;
font-family:var(--vibeui-input-015-font);color:var(--vibeui-input-015-fg);
}
[data-vibeui-block="input-015"] *{box-sizing:border-box}
[data-vibeui-block="input-015"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-015"] [data-part="frame"]{
display:flex;align-items:baseline;gap:0.375rem;
padding:0.5rem 0.75rem;
background:var(--vibeui-input-015-field);
border:1px solid var(--vibeui-input-015-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-015"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-input-015-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-015-accent) 18%,transparent);
}
[data-vibeui-block="input-015"] [data-part="frame"][data-over="1"]{border-color:var(--vibeui-input-015-bad)}
/* Крупные табличные цифры: сумму читают, а не разглядывают. */
[data-vibeui-block="input-015"] input{
flex:1;min-width:0;border:0;background:none;color:inherit;
font:inherit;font-size:1.5rem;font-weight:700;line-height:1.2;
letter-spacing:-0.01em;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="input-015"] input:focus{outline:none}
[data-vibeui-block="input-015"] [data-part="suffix"]{
flex:none;font-size:1rem;font-weight:600;color:var(--vibeui-input-015-muted);
user-select:none;
}
[data-vibeui-block="input-015"] [data-part="foot"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-015-muted);
}
[data-vibeui-block="input-015"] [data-part="words"]{font-weight:600;color:var(--vibeui-input-015-fg)}
[data-vibeui-block="input-015"] [data-part="foot"][data-over="1"] [data-part="words"]{color:var(--vibeui-input-015-bad)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-015"] *{animation:none!important;transition:none!important}}
`

// Неразрывный пробел: обычный переносит строку между разрядами.
const THIN = " "

function group(digits: string) {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, THIN)
}

function short(amount: number) {
  if (amount >= 1_000_000)
    return `${(amount / 1_000_000).toFixed(1).replace(".", ",")} млн`
  if (amount >= 1_000) return `${Math.round(amount / 1000)} тыс.`
  return String(amount)
}

/**
 * Сумма с разделителями разрядов прямо при вводе и сохранением места курсора.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Input015({
  label = "Сумма перевода",
  suffix = "₽",
  max = 300000,
  onChange,
  accent,
  className,
  style,
  ...props
}: Input015Props) {
  const id = useId()
  const field = useRef<HTMLInputElement | null>(null)
  const [digits, setDigits] = useState("125000")

  const palette = {
    ...(accent ? { "--vibeui-input-015-accent": accent } : null),
    ...style,
  } as CSSProperties

  const amount = Number(digits || "0")
  const over = amount > max

  return (
    <>
      <style href="vibeui-input-015" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="input-015"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="frame" data-over={over ? "1" : "0"}>
          <input
            ref={field}
            id={id}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="0"
            value={group(digits)}
            aria-invalid={over}
            aria-describedby={`${id}-foot`}
            onChange={(event) => {
              const input = event.target
              const before = input.value.slice(0, input.selectionStart ?? 0)
              const digitsBefore = before.replace(/\D/g, "").length
              const next = input.value.replace(/\D/g, "").slice(0, 12)

              setDigits(next)
              onChange?.(Number(next || "0"))

              // Курсор ставится после того же количества цифр, а не на тот же
              // индекс: разделители сдвигают строку и индекс врёт.
              window.requestAnimationFrame(() => {
                const node = field.current
                if (!node) return
                const formatted = group(next)
                let seen = 0
                let position = formatted.length
                for (let index = 0; index < formatted.length; index += 1) {
                  if (/\d/.test(formatted[index])) seen += 1
                  if (seen === digitsBefore) {
                    position = index + 1
                    break
                  }
                }
                if (digitsBefore === 0) position = 0
                node.setSelectionRange(position, position)
              })
            }}
          />
          <span data-part="suffix" aria-hidden="true">
            {suffix}
          </span>
        </div>
        <p
          data-part="foot"
          id={`${id}-foot`}
          data-over={over ? "1" : "0"}
          aria-live="polite"
        >
          <span data-part="words">
            {over ? "Больше лимита" : `≈ ${short(amount)} ${suffix}`}
          </span>
          <span>
            лимит {group(String(max))}
            {THIN}
            {suffix}
          </span>
        </p>
      </div>
    </>
  )
}

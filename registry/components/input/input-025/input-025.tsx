"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Input025Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  defaultValue?: string
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: IBAN уже проверяется по остатку от деления (input-018) —
// здесь та же идея контрольной суммы, но для российского ИНН и с другой
// формулой: 10 цифр для юрлица, 12 — для физлица или ИП, у каждой длины
// свои весовые коэффициенты. Тип определяется длиной по ходу набора, бейдж
// у подписи меняется сам, а контрольная сумма пересчитывается на каждый
// введённый символ — ошибку видно сразу, не дожидаясь потери фокуса.
const STYLES = `
:where([data-vibeui-block="input-025"]){
--vibeui-input-025-surface:oklch(1 0 0);
--vibeui-input-025-shell:oklch(0.91 0.006 265);
--vibeui-input-025-fg:oklch(0.22 0.014 265);
--vibeui-input-025-muted:oklch(0.55 0.014 265);
--vibeui-input-025-field:oklch(0.985 0.002 265);
--vibeui-input-025-border:oklch(0.88 0.008 265);
--vibeui-input-025-chip:oklch(0.95 0.005 265);
--vibeui-input-025-accent:oklch(0.5 0.14 230);
--vibeui-input-025-bad:oklch(0.55 0.2 25);
--vibeui-input-025-ok:oklch(0.5 0.13 155);
--vibeui-input-025-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="input-025"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-025-surface);
border:1px solid var(--vibeui-input-025-shell);border-radius:0.875rem;
font-family:var(--vibeui-input-025-font);color:var(--vibeui-input-025-fg);
}
[data-vibeui-block="input-025"] *{box-sizing:border-box}
[data-vibeui-block="input-025"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="input-025"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-025"] [data-part="badge"]{
flex:none;padding:0.125rem 0.4375rem;border-radius:999px;
font-size:0.6875rem;font-weight:650;letter-spacing:0.02em;
background:var(--vibeui-input-025-chip);color:var(--vibeui-input-025-muted);
}
[data-vibeui-block="input-025"] [data-part="frame"]{
display:flex;align-items:center;
height:2.5rem;padding:0 0.75rem;
background:var(--vibeui-input-025-field);
border:1px solid var(--vibeui-input-025-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-025"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-input-025-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-025-accent) 18%,transparent);
}
[data-vibeui-block="input-025"][data-state="valid"] [data-part="frame"]{border-color:var(--vibeui-input-025-ok)}
[data-vibeui-block="input-025"][data-state="invalid"] [data-part="frame"]{border-color:var(--vibeui-input-025-bad)}
[data-vibeui-block="input-025"] input{
flex:1;min-width:0;height:100%;border:0;background:none;color:inherit;
font:inherit;font-size:0.9375rem;letter-spacing:0.04em;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="input-025"] input:focus{outline:none}
[data-vibeui-block="input-025"] [data-part="mark"]{
flex:none;width:1.125rem;height:1.125rem;display:block;
}
[data-vibeui-block="input-025"][data-state="valid"] [data-part="mark"]{color:var(--vibeui-input-025-ok)}
[data-vibeui-block="input-025"][data-state="invalid"] [data-part="mark"]{color:var(--vibeui-input-025-bad)}
[data-vibeui-block="input-025"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-025-muted);
}
[data-vibeui-block="input-025"][data-state="valid"] [data-part="note"]{color:var(--vibeui-input-025-ok)}
[data-vibeui-block="input-025"][data-state="invalid"] [data-part="note"]{color:var(--vibeui-input-025-bad)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-025"] *{animation:none!important;transition:none!important}}
`

function digits(value: string) {
  return value.replace(/\D/g, "").slice(0, 12)
}

// Официальная формула ФНС: для 10 цифр — один контрольный разряд, для 12 —
// два, у каждого свой набор весов. Считаем по массиву цифр, не по строке:
// строковая арифметика для десяти множителей ни к чему.
function checksum(value: string): boolean | null {
  const d = value.split("").map(Number)

  if (d.length === 10) {
    const weights = [2, 4, 10, 3, 5, 9, 4, 6, 8]
    const control = (weights.reduce((sum, w, i) => sum + w * d[i], 0) % 11) % 10
    return control === d[9]
  }

  if (d.length === 12) {
    const w11 = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]
    const w12 = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]
    const n11 = (w11.reduce((sum, w, i) => sum + w * d[i], 0) % 11) % 10
    const n12 = (w12.reduce((sum, w, i) => sum + w * d[i], 0) % 11) % 10
    return n11 === d[10] && n12 === d[11]
  }

  return null
}

const BADGE: Record<string, string> = {
  empty: "ИНН",
  partial: "Вводится",
  org: "Юрлицо",
  person: "Физлицо / ИП",
}

/**
 * Поле ИНН с проверкой контрольной суммы по формуле ФНС: тип (10 или 12
 * цифр) определяется по длине, ошибка видна на каждом введённом символе.
 * Один файл, ноль зависимостей.
 */
export function Input025({
  label = "ИНН",
  defaultValue = "",
  onChange,
  accent,
  className,
  style,
  ...props
}: Input025Props) {
  const id = useId()
  const [value, setValue] = useState(digits(defaultValue))

  const palette = {
    ...(accent ? { "--vibeui-input-025-accent": accent } : null),
    ...style,
  } as CSSProperties

  const complete = value.length === 10 || value.length === 12
  const valid = complete ? checksum(value) : null
  const state = !complete ? "idle" : valid ? "valid" : "invalid"
  const badgeKey =
    value.length === 0
      ? "empty"
      : value.length === 10
        ? "org"
        : value.length === 12
          ? "person"
          : "partial"

  return (
    <>
      <style href="vibeui-input-025" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="input-025"
        data-state={state}
        className={className}
        style={palette}
      >
        <div data-part="head">
          <label htmlFor={id}>{label}</label>
          <span data-part="badge">{BADGE[badgeKey]}</span>
        </div>
        <div data-part="frame">
          <input
            id={id}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="7707083893"
            value={value}
            aria-invalid={state === "invalid"}
            aria-describedby={`${id}-note`}
            onChange={(event) => {
              const next = digits(event.target.value)
              setValue(next)
              onChange?.(next)
            }}
          />
          {state === "valid" ? (
            <svg
              data-part="mark"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path
                d="m3.5 8.5 3 3 6-7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
          {state === "invalid" ? (
            <svg
              data-part="mark"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M4.5 4.5l7 7m0-7-7 7" strokeLinecap="round" />
            </svg>
          ) : null}
        </div>
        <p data-part="note" id={`${id}-note`} aria-live="polite">
          {state === "idle"
            ? "10 цифр для организации, 12 — для физлица или ИП."
            : state === "valid"
              ? "Контрольная сумма сходится."
              : "Контрольная сумма не сходится — проверьте цифры."}
        </p>
      </div>
    </>
  )
}

"use client"

import { useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Input018Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  defaultValue?: string
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: номер карты по четвёркам уже занят (input-008) — здесь та
// же механика группировки, но для другого номера и с другой проверкой.
// IBAN хранится без пробелов, группируется по четыре символа на отображение,
// страна читается по первым двум буквам, а контрольная сумма — не Луна,
// а остаток от деления на 97 (стандарт ISO 7064 для IBAN).
const STYLES = `
:where([data-vibeui-block="input-018"]){
--vibeui-input-018-surface:oklch(1 0 0);
--vibeui-input-018-shell:oklch(0.91 0.006 265);
--vibeui-input-018-fg:oklch(0.22 0.014 265);
--vibeui-input-018-muted:oklch(0.55 0.014 265);
--vibeui-input-018-field:oklch(0.985 0.002 265);
--vibeui-input-018-border:oklch(0.88 0.008 265);
--vibeui-input-018-accent:oklch(0.5 0.14 230);
--vibeui-input-018-bad:oklch(0.55 0.2 25);
--vibeui-input-018-ok:oklch(0.5 0.13 155);
--vibeui-input-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="input-018"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-018-surface);
border:1px solid var(--vibeui-input-018-shell);border-radius:0.875rem;
font-family:var(--vibeui-input-018-font);color:var(--vibeui-input-018-fg);
}
[data-vibeui-block="input-018"] *{box-sizing:border-box}
[data-vibeui-block="input-018"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="input-018"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-018"] [data-part="country"]{
flex:none;padding:0.125rem 0.4375rem;border-radius:999px;
font-size:0.6875rem;font-weight:650;letter-spacing:0.02em;
background:color-mix(in oklab,var(--vibeui-input-018-accent) 12%,transparent);
color:var(--vibeui-input-018-accent);
}
[data-vibeui-block="input-018"] [data-part="frame"]{
display:flex;align-items:center;gap:0.5rem;
height:2.75rem;padding:0 0.5rem 0 0.75rem;
background:var(--vibeui-input-018-field);
border:1px solid var(--vibeui-input-018-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-018"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-input-018-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-018-accent) 18%,transparent);
}
[data-vibeui-block="input-018"] input{
flex:1;min-width:0;height:100%;border:0;background:none;color:inherit;
font:inherit;font-size:0.9375rem;letter-spacing:0.05em;text-transform:uppercase;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="input-018"] input:focus{outline:none}
[data-vibeui-block="input-018"] input::placeholder{text-transform:none;letter-spacing:normal}
[data-vibeui-block="input-018"] [data-part="copy"]{
flex:none;appearance:none;cursor:pointer;
height:1.75rem;padding:0 0.5rem;border-radius:0.4375rem;border:1px solid var(--vibeui-input-018-border);
background:var(--vibeui-input-018-surface);color:var(--vibeui-input-018-muted);
font:inherit;font-size:0.6875rem;font-weight:650;
transition:border-color .16s ease,color .16s ease;
}
[data-vibeui-block="input-018"] [data-part="copy"]:hover:not(:disabled){border-color:var(--vibeui-input-018-accent);color:var(--vibeui-input-018-fg)}
[data-vibeui-block="input-018"] [data-part="copy"]:focus-visible{outline:2px solid var(--vibeui-input-018-accent);outline-offset:1px}
[data-vibeui-block="input-018"] [data-part="copy"]:disabled{cursor:not-allowed;opacity:0.5}
[data-vibeui-block="input-018"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-018-muted);
}
[data-vibeui-block="input-018"] [data-part="note"][data-tone="bad"]{color:var(--vibeui-input-018-bad)}
[data-vibeui-block="input-018"] [data-part="note"][data-tone="ok"]{color:var(--vibeui-input-018-ok)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-018"] *{animation:none!important;transition:none!important}}
`

const COUNTRIES: Record<string, string> = {
  GB: "Великобритания",
  DE: "Германия",
  FR: "Франция",
  ES: "Испания",
  IT: "Италия",
  NL: "Нидерланды",
  PL: "Польша",
  EE: "Эстония",
  CH: "Швейцария",
  AE: "ОАЭ",
}

function normalize(raw: string) {
  return raw
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 34)
}

function group(value: string) {
  return value.replace(/(.{4})/g, "$1 ").trim()
}

// Остаток от деления на 97: буквы четырёх первых символов переносятся в
// конец и переводятся в числа (A=10 … Z=35), затем остаток считается по
// кускам — само число IBAN как строка цифр не помещается в Number.
function ibanValid(value: string) {
  if (value.length < 15) return false

  const rearranged = value.slice(4) + value.slice(0, 4)
  let digits = ""

  for (const char of rearranged) {
    const code = char.charCodeAt(0)
    digits += code >= 65 && code <= 90 ? String(code - 55) : char
  }

  let mod = 0
  for (let index = 0; index < digits.length; index += 7) {
    mod = Number(`${mod}${digits.slice(index, index + 7)}`) % 97
  }

  return mod === 1
}

/**
 * Поле IBAN: маска по четвёркам, страна по первым буквам, проверка по
 * остатку от деления на 97 и копирование в буфер. Один файл, ноль зависимостей.
 */
export function Input018({
  label = "Номер счёта IBAN",
  defaultValue = "GB29NWBK60161331926819",
  onChange,
  accent,
  className,
  style,
  ...props
}: Input018Props) {
  const id = useId()
  const [value, setValue] = useState(normalize(defaultValue))
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const palette = {
    ...(accent ? { "--vibeui-input-018-accent": accent } : null),
    ...style,
  } as CSSProperties

  const country = COUNTRIES[value.slice(0, 2)]
  const complete = value.length >= 15
  const valid = complete && ibanValid(value)

  const handleCopy = async () => {
    if (!value || typeof navigator === "undefined" || !navigator.clipboard) {
      return
    }

    try {
      await navigator.clipboard.writeText(group(value))
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1600)
    } catch {
      // Буфер обмена может быть недоступен — тихо остаёмся в исходном состоянии.
    }
  }

  return (
    <>
      <style href="vibeui-input-018" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="input-018"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <label htmlFor={id}>{label}</label>
          {country ? <span data-part="country">{country}</span> : null}
        </div>
        <div data-part="frame">
          <input
            id={id}
            type="text"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="GB00 BANK 0000 0000 0000 00"
            value={group(value)}
            aria-invalid={complete && !valid}
            aria-describedby={`${id}-note`}
            onChange={(event) => {
              const next = normalize(event.target.value)
              setValue(next)
              setCopied(false)
              onChange?.(next)
            }}
          />
          <button
            type="button"
            data-part="copy"
            disabled={!value}
            onClick={handleCopy}
          >
            {copied ? "Скопировано" : "Копировать"}
          </button>
        </div>
        <p
          data-part="note"
          id={`${id}-note`}
          aria-live="polite"
          data-tone={complete ? (valid ? "ok" : "bad") : undefined}
        >
          {complete
            ? valid
              ? "Номер прошёл контрольную проверку."
              : "Номер не сходится — проверьте символы."
            : "Данные счёта не сохраняются, поле только собирает их для платёжного шлюза."}
        </p>
      </div>
    </>
  )
}

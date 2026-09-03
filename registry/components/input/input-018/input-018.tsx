"use client"

import { useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Input018Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** Названия стран по коду IBAN. */
  countryText?: Record<string, string>
  /** Подсказка в пустом поле. */
  placeholder?: string
  /** Надпись на кнопке копирования. */
  copyText?: string
  /** Надпись на кнопке копирования сразу после копирования. */
  copiedText?: string
  /** Строка под полем: ключи idle, ok, bad. */
  noteText?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: номер карты по четвёркам уже занят (input-008) — здесь та
// же механика группировки, но для другого номера и с другой проверкой.
// IBAN хранится без пробелов, группируется по четыре символа на отображение,
// страна читается по первым двум буквам, а контрольная сумма — не Луна,
// а остаток от деления на 97 (стандарт ISO 7064 для IBAN).
const STYLES = `
:where([data-vibeui-block="input-018"]){
--vibeui-input-018-surface:transparent;
--vibeui-input-018-shell:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-input-018-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-input-018-muted:color-mix(in oklab,var(--vibeui-input-018-fg) 68%,transparent);
--vibeui-input-018-field:light-dark(oklch(0.985 0.002 265),oklch(0.27 0.011 265));
--vibeui-input-018-border:light-dark(oklch(0.88 0.008 265),oklch(0.41 0.013 265));
--vibeui-input-018-accent:light-dark(oklch(0.5 0.14 230),oklch(0.76 0.13 230));
--vibeui-input-018-bad:light-dark(oklch(0.55 0.2 25),oklch(0.73 0.16 25));
--vibeui-input-018-ok:light-dark(oklch(0.5 0.13 155),oklch(0.77 0.13 155));
--vibeui-input-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="input-018"]{color-scheme:dark}
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

const NOTE: Record<string, string> = {
  idle: "Данные счёта не сохраняются, поле только собирает их для платёжного шлюза.",
  ok: "Номер прошёл контрольную проверку.",
  bad: "Номер не сходится — проверьте символы.",
}

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
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
  countryText = COUNTRIES,
  placeholder = "GB00 BANK 0000 0000 0000 00",
  copyText = "Копировать",
  copiedText = "Скопировано",
  noteText = NOTE,
  background = "",
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
    ...(background
      ? {
          "--vibeui-input-018-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const country = countryText[value.slice(0, 2)]
  const complete = value.length >= 15
  const valid = complete && ibanValid(value)
  const noteKey = complete ? (valid ? "ok" : "bad") : "idle"

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
        data-slot="input"
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
            placeholder={placeholder}
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
            {copied ? copiedText : copyText}
          </button>
        </div>
        <p
          data-part="note"
          id={`${id}-note`}
          aria-live="polite"
          data-tone={complete ? (valid ? "ok" : "bad") : undefined}
        >
          {noteText[noteKey] ?? NOTE[noteKey]}
        </p>
      </div>
    </>
  )
}

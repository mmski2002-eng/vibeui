"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Input008Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  defaultValue?: string
  /** Подписи полей и примечаний: компонент несёт русские. */
  text?: Record<string, string>
  /** Названия платёжных систем по ключу: visa, mastercard, mir, amex. */
  brandText?: Record<string, string>
  /** Пусто — подложки нет, поле лежит прямо на фоне страницы. */
  background?: string
  onChange?: (digits: string) => void
  accent?: string
}

// Идея компонента: номер карты набирают глазами с пластика, поэтому маска
// разбивает его ровно на те же четвёрки. В состоянии живут только цифры,
// пробелы дорисовываются — вставка «4276 3800 0000 0000» и «4276380000000000»
// дают один результат. Платёжная система определяется по первым цифрам и
// подписывается словом: значок без подписи ничего не объясняет.
const STYLES = `
:where([data-vibeui-block="input-008"]){
--vibeui-input-008-surface:transparent;
--vibeui-input-008-shell:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-input-008-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-input-008-muted:color-mix(in oklab,var(--vibeui-input-008-fg) 68%,transparent);
--vibeui-input-008-field:light-dark(oklch(0.985 0.002 265),oklch(0.26 0.012 265));
--vibeui-input-008-border:light-dark(oklch(0.88 0.008 265),oklch(0.42 0.014 265));
--vibeui-input-008-accent:light-dark(oklch(0.52 0.18 285),oklch(0.76 0.15 285));
--vibeui-input-008-bad:light-dark(oklch(0.55 0.2 25),oklch(0.74 0.17 25));
--vibeui-input-008-ok:light-dark(oklch(0.5 0.13 155),oklch(0.75 0.14 155));
--vibeui-input-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="input-008"]{color-scheme:dark}
[data-vibeui-block="input-008"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:21rem;box-sizing:border-box;
font-family:var(--vibeui-input-008-font);color:var(--vibeui-input-008-fg);
}
/* Подложка появляется только вместе с пропом background: без него поле
   лежит прямо на фоне страницы. */
[data-vibeui-block="input-008"][data-surface="on"]{
padding:0.875rem;
background:var(--vibeui-input-008-surface);
border:1px solid var(--vibeui-input-008-shell);border-radius:0.875rem;
}
[data-vibeui-block="input-008"] *{box-sizing:border-box}
[data-vibeui-block="input-008"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="input-008"] label{font-size:0.8125rem;font-weight:600}
/* Подпись системы — текст, а не логотип: логотипы нельзя раздавать
   в registry, а слово читается и вслух, и на маленьком экране. */
[data-vibeui-block="input-008"] [data-part="brand"]{
flex:none;padding:0.125rem 0.4375rem;border-radius:999px;
font-size:0.6875rem;font-weight:650;letter-spacing:0.04em;text-transform:uppercase;
background:color-mix(in oklab,var(--vibeui-input-008-accent) 12%,transparent);
color:var(--vibeui-input-008-accent);
}
[data-vibeui-block="input-008"] [data-part="frame"]{
display:flex;align-items:center;gap:0.5rem;
height:2.75rem;padding:0 0.75rem;
background:var(--vibeui-input-008-field);
border:1px solid var(--vibeui-input-008-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-008"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-input-008-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-008-accent) 18%,transparent);
}
[data-vibeui-block="input-008"] input{
flex:1;min-width:0;height:100%;border:0;background:none;color:inherit;
font:inherit;font-size:1rem;letter-spacing:0.06em;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="input-008"] input:focus{outline:none}
[data-vibeui-block="input-008"] [data-part="row"]{
display:flex;align-items:center;gap:0.5rem;
}
[data-vibeui-block="input-008"] [data-part="row"] [data-part="cell"]{flex:1;min-width:0}
[data-vibeui-block="input-008"] [data-part="cell"] > span{
display:block;margin-bottom:0.25rem;
font-size:0.6875rem;font-weight:600;color:var(--vibeui-input-008-muted);
}
[data-vibeui-block="input-008"] [data-part="cell"] [data-part="frame"]{height:2.25rem}
[data-vibeui-block="input-008"] [data-part="cell"] input{font-size:0.875rem;letter-spacing:0.04em}
[data-vibeui-block="input-008"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-008-muted);
}
[data-vibeui-block="input-008"] [data-part="note"][data-tone="bad"]{color:var(--vibeui-input-008-bad)}
[data-vibeui-block="input-008"] [data-part="note"][data-tone="ok"]{color:var(--vibeui-input-008-ok)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-008"] *{animation:none!important;transition:none!important}}
`

const TEXT = {
  expiry: "Срок",
  code: "Код",
  expiryPlaceholder: "ММ / ГГ",
  ok: "Номер прошёл контрольную проверку.",
  bad: "Номер не сходится — проверьте цифры.",
  calm: "Данные карты не сохраняются, поле только собирает их для платёжного шлюза.",
}

const BRANDS = {
  visa: "Visa",
  mastercard: "Mastercard",
  mir: "Мир",
  amex: "Amex",
}

function brandOf(digits: string) {
  if (/^220[0-4]/.test(digits)) return "mir"
  if (/^4/.test(digits)) return "visa"
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "mastercard"
  if (/^3[47]/.test(digits)) return "amex"
  return null
}

function group(digits: string) {
  return digits.replace(/(.{4})/g, "$1 ").trim()
}

// Алгоритм Луна ловит опечатку в одной цифре ещё до похода на сервер —
// это единственная проверка номера, которую честно делать на клиенте.
function luhn(digits: string) {
  let sum = 0
  for (let index = 0; index < digits.length; index += 1) {
    let value = Number(digits[digits.length - 1 - index])
    if (index % 2 === 1) {
      value *= 2
      if (value > 9) value -= 9
    }
    sum += value
  }
  return sum % 10 === 0
}

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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

/**
 * Поле номера карты: маска по четвёркам, система по первым цифрам, проверка Луна.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Input008({
  label = "Номер карты",
  defaultValue = "4276380000000000",
  text,
  brandText,
  background = "",
  onChange,
  accent,
  className,
  style,
  ...props
}: Input008Props) {
  const id = useId()
  const [digits, setDigits] = useState(
    defaultValue.replace(/\D/g, "").slice(0, 16),
  )
  const [expiry, setExpiry] = useState("0729")
  const [code, setCode] = useState("")

  const copy = { ...TEXT, ...text }
  const brands = { ...BRANDS, ...brandText }

  const palette = {
    ...(accent ? { "--vibeui-input-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-input-008-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const brandKey = brandOf(digits)
  const brand = brandKey ? brands[brandKey] : null
  const full = digits.length === 16
  const valid = full && luhn(digits)

  return (
    <>
      <style href="vibeui-input-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input"
        data-vibeui-block="input-008"
        data-surface={background ? "on" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="head">
          <label htmlFor={id}>{label}</label>
          {brand ? <span data-part="brand">{brand}</span> : null}
        </div>
        <div data-part="frame">
          <input
            id={id}
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="0000 0000 0000 0000"
            value={group(digits)}
            aria-invalid={full && !valid}
            aria-describedby={`${id}-note`}
            onChange={(event) => {
              const next = event.target.value.replace(/\D/g, "").slice(0, 16)
              setDigits(next)
              onChange?.(next)
            }}
          />
        </div>
        <div data-part="row">
          <div data-part="cell">
            <span id={`${id}-exp`}>{copy.expiry}</span>
            <div data-part="frame">
              <input
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder={copy.expiryPlaceholder}
                aria-labelledby={`${id}-exp`}
                value={
                  expiry.length > 2
                    ? `${expiry.slice(0, 2)} / ${expiry.slice(2)}`
                    : expiry
                }
                onChange={(event) =>
                  setExpiry(event.target.value.replace(/\D/g, "").slice(0, 4))
                }
              />
            </div>
          </div>
          <div data-part="cell">
            <span id={`${id}-cvc`}>{copy.code}</span>
            <div data-part="frame">
              <input
                type="text"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="000"
                aria-labelledby={`${id}-cvc`}
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, "").slice(0, 4))
                }
              />
            </div>
          </div>
        </div>
        <p
          data-part="note"
          id={`${id}-note`}
          aria-live="polite"
          data-tone={full ? (valid ? "ok" : "bad") : "calm"}
        >
          {full ? (valid ? copy.ok : copy.bad) : copy.calm}
        </p>
      </div>
    </>
  )
}

"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Currency002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  defaultValue?: number
  defaultCurrency?: string
  currencies?: { code: string; sign: string; text: string }[]
  /** Подпись списка валют для скринридера: рядом с ним нет видимой. */
  currencyLabel?: string
  /** Строка под полем; {currency} подставляется склонением из currencies. */
  hint?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: валюта выбирается прямо в поле суммы. Отдельный список над
// полем читается как второй вопрос, хотя это одно значение — сумма в валюте.
// Знак валюты стоит слева от числа и меняется вместе с выбором, поэтому строка
// всегда читается целиком: «€ 1 200». Список нативный: он даёт поиск по первой
// букве, а на телефоне — системное колесо, и всё это без единой строки кода.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у поля по
// умолчанию нет, оно лежит прямо на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="currency-002"]){
--vibeui-currency-002-surface:transparent;
--vibeui-currency-002-field:light-dark(oklch(0.985 0.002 265),oklch(0.26 0.011 265));
--vibeui-currency-002-chip:light-dark(oklch(1 0 0),oklch(0.31 0.012 265));
--vibeui-currency-002-shell:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-currency-002-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-currency-002-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.014 265));
--vibeui-currency-002-border:light-dark(oklch(0.88 0.008 265),oklch(0.38 0.013 265));
--vibeui-currency-002-accent:light-dark(oklch(0.52 0.16 255),oklch(0.72 0.14 255));
--vibeui-currency-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Подложки по умолчанию нет: поле ложится на фон страницы. */
[data-vibeui-block="currency-002"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-currency-002-surface);
border:1px solid var(--vibeui-currency-002-shell);border-radius:0.875rem;
font-family:var(--vibeui-currency-002-font);color:var(--vibeui-currency-002-fg);
}
[data-vibeui-block="currency-002"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="currency-002"] [data-part="row"]{
display:flex;align-items:stretch;overflow:hidden;
border:1px solid var(--vibeui-currency-002-border);border-radius:0.75rem;
background:var(--vibeui-currency-002-field);
}
[data-vibeui-block="currency-002"] [data-part="row"]:focus-within{
border-color:var(--vibeui-currency-002-accent);
box-shadow:0 0 0 2px color-mix(in oklch,var(--vibeui-currency-002-accent) 20%,transparent);
}
/* Знак слева от числа: строка читается целиком, «€ 1 200». */
[data-vibeui-block="currency-002"] [data-part="sign"]{
display:flex;align-items:center;flex:none;padding:0 0.25rem 0 0.875rem;
font-size:1.25rem;font-weight:700;color:var(--vibeui-currency-002-muted);
}
[data-vibeui-block="currency-002"] input{
flex:1 1 auto;min-width:0;width:100%;
appearance:none;border:0;background:none;outline:none;
height:3rem;padding:0 0.5rem;color:inherit;
font:inherit;font-size:1.25rem;font-weight:700;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="currency-002"] input::-webkit-outer-spin-button,
[data-vibeui-block="currency-002"] input::-webkit-inner-spin-button{appearance:none;margin:0}
/* Валюта в том же поле: это одно значение, а не второй вопрос. */
[data-vibeui-block="currency-002"] select{
flex:none;appearance:none;cursor:pointer;
padding:0 0.875rem;border:0;border-left:1px solid var(--vibeui-currency-002-border);
background:var(--vibeui-currency-002-chip);color:inherit;
font:inherit;font-size:0.875rem;font-weight:700;letter-spacing:0.02em;
}
[data-vibeui-block="currency-002"] select:focus-visible{outline:2px solid var(--vibeui-currency-002-accent);outline-offset:-2px}
[data-vibeui-block="currency-002"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-currency-002-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="currency-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CURRENCIES = [
  { code: "RUB", sign: "₽", text: "рублях" },
  { code: "USD", sign: "$", text: "долларах" },
  { code: "EUR", sign: "€", text: "евро" },
  { code: "CNY", sign: "¥", text: "юанях" },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Сумма с выбором валюты в том же поле: знак слева меняется вместе с выбором.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Currency002({
  label = "Сумма счёта",
  defaultValue = 1200,
  defaultCurrency = "EUR",
  currencies = DEFAULT_CURRENCIES,
  currencyLabel = "Валюта счёта",
  hint = "Счёт будет выставлен в {currency}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Currency002Props) {
  const id = useId()
  const [amount, setAmount] = useState(defaultValue)
  const [code, setCode] = useState(defaultCurrency)
  const active = currencies.find((item) => item.code === code) ?? currencies[0]

  const palette = {
    ...(accent ? { "--vibeui-currency-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-currency-002-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-currency-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="currency-002"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="row">
          <span data-part="sign" aria-hidden="true">
            {active.sign}
          </span>
          <input
            id={id}
            type="number"
            inputMode="decimal"
            min={0}
            step={1}
            value={amount}
            aria-describedby={`${id}-hint`}
            onChange={(event) => {
              const next = Number(event.target.value)
              setAmount(Number.isFinite(next) ? Math.max(0, next) : 0)
            }}
          />
          <select
            value={code}
            aria-label={currencyLabel}
            onChange={(event) => setCode(event.target.value)}
          >
            {currencies.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code}
              </option>
            ))}
          </select>
        </div>
        <p id={`${id}-hint`} data-part="hint" aria-live="polite">
          {hint.replace("{currency}", active.text)}
        </p>
      </div>
    </>
  )
}

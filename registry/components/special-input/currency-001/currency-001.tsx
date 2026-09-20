"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Currency001Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  currency?: string
  /** Валюта словом: знак «₽» скринридер не называет. */
  currencyText?: string
  hint?: string
  presets?: number[]
  /** Локаль разрядов: компонент несёт русскую, проект подставляет свою. */
  locale?: string
  onChange?: (value: number) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: сумма, которая форматируется по уходу из поля, а не на
// каждой букве. Разряды, расставляемые прямо во время ввода, прыгают под
// курсором и мешают править число; по blur они появляются один раз и остаются.
// Быстрые суммы рядом: чаще всего вводят одно из нескольких круглых значений.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у поля по
// умолчанию нет, оно лежит прямо на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="currency-001"]){
--vibeui-currency-001-bg:transparent;
--vibeui-currency-001-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-currency-001-muted:color-mix(in oklab,var(--vibeui-currency-001-fg) 68%,transparent);
--vibeui-currency-001-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-currency-001-field:light-dark(oklch(0.985 0 265),oklch(0.26 0 265));
--vibeui-currency-001-hover:light-dark(oklch(0.96 0 265),oklch(0.32 0 265));
--vibeui-currency-001-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-currency-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="currency-001"]{color-scheme:dark}
[data-vibeui-block="currency-001"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-currency-001-bg);
border:1px solid var(--vibeui-currency-001-border);border-radius:0.875rem;
font-family:var(--vibeui-currency-001-font);color:var(--vibeui-currency-001-fg);
}
[data-vibeui-block="currency-001"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="currency-001"] [data-part="row"]{
display:flex;align-items:center;gap:0.5rem;
box-sizing:border-box;height:3rem;padding:0 0.875rem;
border:1px solid var(--vibeui-currency-001-border);border-radius:0.75rem;
background:var(--vibeui-currency-001-field);
}
[data-vibeui-block="currency-001"] [data-part="row"]:focus-within{
outline:2px solid var(--vibeui-currency-001-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="currency-001"] input{
flex:1;min-width:0;height:100%;border:0;background:transparent;color:inherit;
font:inherit;font-size:1.25rem;font-weight:680;
font-variant-numeric:tabular-nums;text-align:right;
}
[data-vibeui-block="currency-001"] input:focus{outline:none}
[data-vibeui-block="currency-001"] [data-part="currency"]{
flex:none;font-size:1.125rem;font-weight:650;color:var(--vibeui-currency-001-muted);
}
/* Быстрые суммы: обычно вводят одно из нескольких круглых значений. */
[data-vibeui-block="currency-001"] [data-part="presets"]{display:flex;gap:0.375rem;flex-wrap:wrap}
[data-vibeui-block="currency-001"] button{
appearance:none;cursor:pointer;
height:1.875rem;padding:0 0.625rem;
border:1px solid var(--vibeui-currency-001-border);border-radius:9999px;
background:transparent;color:inherit;
font:inherit;font-size:0.75rem;font-weight:600;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="currency-001"] button:hover{background:var(--vibeui-currency-001-hover)}
[data-vibeui-block="currency-001"] button:focus-visible{outline:2px solid var(--vibeui-currency-001-accent);outline-offset:2px}
[data-vibeui-block="currency-001"] [data-part="hint"]{font-size:0.75rem;line-height:1.4;color:var(--vibeui-currency-001-muted)}
[data-vibeui-block="currency-001"] [data-part="sr"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
clip:rect(0,0,0,0);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="currency-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PRESETS = [1000, 2500, 5000, 10000]

// Разряды ставятся по уходу из поля: во время ввода они прыгают под курсором.
function pretty(value: number, locale: string) {
  return value ? value.toLocaleString(locale) : ""
}

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
 * Поле суммы: разряды появляются по уходу из поля, рядом быстрые значения.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Currency001({
  label = "Сумма пополнения",
  currency = "₽",
  currencyText = "в рублях",
  hint = "Минимум 100 ₽, зачислится в течение минуты",
  presets = DEFAULT_PRESETS,
  locale = "ru-RU",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Currency001Props) {
  const id = useId()
  const [amount, setAmount] = useState(2500)
  const [text, setText] = useState(pretty(2500, locale))

  const palette = {
    ...(accent ? { "--vibeui-currency-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-currency-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const apply = (value: number) => {
    setAmount(value)
    setText(pretty(value, locale))
    onChange?.(value)
  }

  return (
    <>
      <style href="vibeui-currency-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="currency-input"
        data-vibeui-block="currency-001"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>
          {label}
          <span data-part="sr"> {currencyText}</span>
        </label>
        <div data-part="row">
          <input
            id={id}
            type="text"
            inputMode="numeric"
            value={text}
            aria-describedby={hint ? `${id}-hint` : undefined}
            onChange={(event) => {
              const digits = event.target.value.replace(/\D/g, "")
              setText(digits)
              setAmount(Number(digits) || 0)
            }}
            onBlur={() => apply(Number(text.replace(/\D/g, "")) || 0)}
          />
          <span data-part="currency">{currency}</span>
        </div>
        <div data-part="presets">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              aria-pressed={amount === preset}
              onClick={() => apply(preset)}
            >
              {pretty(preset, locale)} {currency}
            </button>
          ))}
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

"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Currency003Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  currency?: string
  /** Валюта словом: знак «₽» скринридер не называет. */
  currencyText?: string
  defaultValue?: number
  hint?: string
  /** Подпись копеек; {cents} подставляется остатком. */
  centsText?: string
  /** Локаль разрядов: компонент несёт русскую, проект подставляет свою. */
  locale?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: кассовый ввод справа налево. Сумма хранится в копейках
// целым числом, а каждая набранная цифра сдвигает её на разряд: набрали «12345»
// — получили 123,45. Точку и запятую вводить не нужно вовсе, а значит некуда и
// промахнуться; заодно исчезает главная беда денег в JS — дробная арифметика,
// потому что складываются копейки, а не 0.1 + 0.2. Разряды расставляются на
// каждом нажатии, но курсор всегда в конце строки, поэтому ничего не прыгает.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у поля по
// умолчанию нет, оно лежит прямо на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="currency-003"]){
--vibeui-currency-003-surface:transparent;
--vibeui-currency-003-field:light-dark(oklch(0.985 0 265),oklch(0.26 0 265));
--vibeui-currency-003-shell:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-currency-003-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-currency-003-muted:color-mix(in oklab,var(--vibeui-currency-003-fg) 68%,transparent);
--vibeui-currency-003-border:light-dark(oklch(0.88 0 265),oklch(0.38 0 265));
--vibeui-currency-003-accent:light-dark(oklch(0.275 0 0),oklch(0.903 0 0));
--vibeui-currency-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="currency-003"]{color-scheme:dark}
/* Подложки по умолчанию нет: поле ложится на фон страницы. */
[data-vibeui-block="currency-003"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-currency-003-surface);
border:1px solid var(--vibeui-currency-003-shell);border-radius:0.875rem;
font-family:var(--vibeui-currency-003-font);color:var(--vibeui-currency-003-fg);
}
[data-vibeui-block="currency-003"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="currency-003"] [data-part="row"]{
display:flex;align-items:baseline;gap:0.375rem;
padding:0.625rem 0.875rem;box-sizing:border-box;
border:1px solid var(--vibeui-currency-003-border);border-radius:0.75rem;
background:var(--vibeui-currency-003-field);
}
[data-vibeui-block="currency-003"] [data-part="row"]:focus-within{
border-color:var(--vibeui-currency-003-accent);
box-shadow:0 0 0 2px color-mix(in oklch,var(--vibeui-currency-003-accent) 20%,transparent);
}
/* Числа моноширинные: при вводе справа налево дрожание разрядов заметно. */
[data-vibeui-block="currency-003"] input{
flex:1 1 auto;min-width:0;width:100%;
appearance:none;border:0;background:none;outline:none;
color:inherit;font:inherit;font-size:1.625rem;font-weight:750;
text-align:right;font-variant-numeric:tabular-nums;letter-spacing:-0.01em;
}
[data-vibeui-block="currency-003"] [data-part="sign"]{
flex:none;font-size:1.125rem;font-weight:700;color:var(--vibeui-currency-003-muted);
}
[data-vibeui-block="currency-003"] [data-part="foot"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;margin:0;
font-size:0.75rem;color:var(--vibeui-currency-003-muted);
}
[data-vibeui-block="currency-003"] [data-part="kopecks"]{
font-weight:650;color:var(--vibeui-currency-003-fg);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="currency-003"] [data-part="sr"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
clip:rect(0,0,0,0);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="currency-003"] *{animation:none!important;transition:none!important}}
`

// Форматируется всегда целое число копеек: дробная арифметика к деньгам не
// подпускается вовсе.
function format(cents: number, locale: string) {
  const whole = Math.floor(cents / 100)
  const rest = String(cents % 100).padStart(2, "0")
  // Разделитель дробной части берётся у локали: в ru это запятая, в en — точка.
  const point = (1.1).toLocaleString(locale).replace(/\d/g, "")
  return `${whole.toLocaleString(locale)}${point}${rest}`
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
 * Кассовый ввод суммы: цифры набираются справа налево, копейки встают сами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Currency003({
  label = "Сумма чека",
  currency = "₽",
  currencyText = "в рублях",
  defaultValue = 1499.9,
  hint = "Точку вводить не нужно — копейки встают сами",
  centsText = "{cents} коп.",
  locale = "ru-RU",
  background = "",
  accent,
  className,
  style,
  ...props
}: Currency003Props) {
  const id = useId()
  const [cents, setCents] = useState(Math.round(defaultValue * 100))

  const palette = {
    ...(accent ? { "--vibeui-currency-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-currency-003-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-currency-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="currency-input"
        data-vibeui-block="currency-003"
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
            value={format(cents, locale)}
            aria-describedby={`${id}-foot`}
            onChange={(event) => {
              // Из строки берутся только цифры: разделители не редактируются,
              // а каждая новая цифра сдвигает сумму на разряд.
              const digits = event.target.value.replace(/\D/g, "").slice(0, 11)
              setCents(Number(digits) || 0)
            }}
          />
          <span data-part="sign" aria-hidden="true">
            {currency}
          </span>
        </div>
        <p id={`${id}-foot`} data-part="foot">
          <span>{hint}</span>
          <span data-part="kopecks">
            {centsText.replace("{cents}", String(cents % 100))}
          </span>
        </p>
      </div>
    </>
  )
}

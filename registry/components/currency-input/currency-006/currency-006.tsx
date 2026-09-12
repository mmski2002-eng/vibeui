"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Currency006Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  percent?: number
  minFee?: number
  defaultValue?: number
  currency?: string
  /** Валюта словом: знак «₽» скринридер не называет. */
  currencyText?: string
  /** Подписи чека; {percent}, {min} и {currency} подставляются. */
  checkText?: Record<string, string>
  /** Локаль разрядов: компонент несёт русскую, проект подставляет свою. */
  locale?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: сумма перевода вместе с комиссией и итогом к списанию.
// Поле, которое показывает только введённое число, врёт: со счёта уйдёт больше,
// и это выясняется на экране подтверждения. Здесь чек виден сразу — перевод,
// комиссия, итог, — а комиссия считается по правилу «процент, но не меньше
// минимума», как её и берут в жизни. Итог набран крупнее остального: это то
// число, которое человек сверяет с остатком на карте.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у чека по
// умолчанию нет, он лежит прямо на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="currency-006"]){
--vibeui-currency-006-surface:transparent;
--vibeui-currency-006-field:light-dark(oklch(0.985 0 265),oklch(0.26 0 265));
--vibeui-currency-006-shell:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-currency-006-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-currency-006-muted:color-mix(in oklab,var(--vibeui-currency-006-fg) 68%,transparent);
--vibeui-currency-006-border:light-dark(oklch(0.88 0 265),oklch(0.38 0 265));
--vibeui-currency-006-accent:light-dark(oklch(0.275 0 0),oklch(0.906 0 0));
--vibeui-currency-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="currency-006"]{color-scheme:dark}
/* Подложки по умолчанию нет: чек ложится на фон страницы. */
[data-vibeui-block="currency-006"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-currency-006-surface);
border:1px solid var(--vibeui-currency-006-shell);border-radius:0.875rem;
font-family:var(--vibeui-currency-006-font);color:var(--vibeui-currency-006-fg);
}
[data-vibeui-block="currency-006"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="currency-006"] [data-part="row"]{
display:flex;align-items:center;gap:0.375rem;
padding:0 0.875rem;box-sizing:border-box;height:3rem;
border:1px solid var(--vibeui-currency-006-border);border-radius:0.75rem;
background:var(--vibeui-currency-006-field);
}
[data-vibeui-block="currency-006"] [data-part="row"]:focus-within{
border-color:var(--vibeui-currency-006-accent);
box-shadow:0 0 0 2px color-mix(in oklch,var(--vibeui-currency-006-accent) 20%,transparent);
}
[data-vibeui-block="currency-006"] input{
flex:1 1 auto;min-width:0;width:100%;
appearance:none;border:0;background:none;outline:none;
height:100%;color:inherit;text-align:right;
font:inherit;font-size:1.375rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="currency-006"] input::-webkit-outer-spin-button,
[data-vibeui-block="currency-006"] input::-webkit-inner-spin-button{appearance:none;margin:0}
[data-vibeui-block="currency-006"] [data-part="sign"]{
flex:none;font-size:1.125rem;font-weight:700;color:var(--vibeui-currency-006-muted);
}
/* Чек: перевод, комиссия, итог — до подтверждения, а не после. */
[data-vibeui-block="currency-006"] [data-part="check"]{
display:flex;flex-direction:column;gap:0.375rem;margin:0;
padding:0.625rem 0.75rem;border-radius:0.625rem;
background:var(--vibeui-currency-006-field);
}
[data-vibeui-block="currency-006"] [data-part="line"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
font-size:0.8125rem;color:var(--vibeui-currency-006-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="currency-006"] [data-part="line"] span:last-child{color:var(--vibeui-currency-006-fg);font-weight:600}
/* Итог крупнее: это число сверяют с остатком на карте. */
[data-vibeui-block="currency-006"] [data-part="total"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
padding-top:0.375rem;border-top:1px solid var(--vibeui-currency-006-border);
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="currency-006"] [data-part="total"] b{
font-size:1.125rem;font-weight:750;color:var(--vibeui-currency-006-accent);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="currency-006"] [data-part="rule"]{
margin:0;font-size:0.6875rem;color:var(--vibeui-currency-006-muted);
}
[data-vibeui-block="currency-006"] [data-part="sr"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
clip:rect(0,0,0,0);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="currency-006"] *{animation:none!important;transition:none!important}}
`

function money(value: number, locale: string) {
  return value.toLocaleString(locale, { maximumFractionDigits: 2 })
}

const CHECK_TEXT: Record<string, string> = {
  receiver: "Получатель получит",
  fee: "Комиссия {percent}%",
  total: "Спишется с карты",
  rule: "Комиссия {percent}%, но не меньше {min} {currency}",
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
 * Сумма перевода с комиссией и итогом к списанию, посчитанными сразу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Currency006({
  label = "Сумма перевода",
  percent = 1.5,
  minFee = 50,
  defaultValue = 12000,
  currency = "₽",
  currencyText = "в рублях",
  checkText = CHECK_TEXT,
  locale = "ru-RU",
  background = "",
  accent,
  className,
  style,
  ...props
}: Currency006Props) {
  const id = useId()
  const [amount, setAmount] = useState(defaultValue)
  // Комиссия по правилу «процент, но не меньше минимума» — так её и берут.
  const fee = amount > 0 ? Math.max(minFee, (amount * percent) / 100) : 0
  const total = amount + fee

  const say = (key: string) =>
    (checkText[key] ?? CHECK_TEXT[key])
      .replace("{percent}", String(percent))
      .replace("{min}", String(minFee))
      .replace("{currency}", currency)

  const palette = {
    ...(accent ? { "--vibeui-currency-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-currency-006-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-currency-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="currency-input"
        data-vibeui-block="currency-006"
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
            type="number"
            inputMode="numeric"
            min={0}
            step={100}
            value={amount}
            aria-describedby={`${id}-check`}
            onChange={(event) => {
              const next = Number(event.target.value)
              setAmount(Number.isFinite(next) ? Math.max(0, next) : 0)
            }}
          />
          <span data-part="sign" aria-hidden="true">
            {currency}
          </span>
        </div>
        <div id={`${id}-check`} data-part="check" aria-live="polite">
          <p data-part="line">
            <span>{say("receiver")}</span>
            <span>
              {money(amount, locale)} {currency}
            </span>
          </p>
          <p data-part="line">
            <span>{say("fee")}</span>
            <span>
              {money(fee, locale)} {currency}
            </span>
          </p>
          <p data-part="total">
            <span>{say("total")}</span>
            <b>
              {money(total, locale)} {currency}
            </b>
          </p>
        </div>
        <p data-part="rule">{say("rule")}</p>
      </div>
    </>
  )
}

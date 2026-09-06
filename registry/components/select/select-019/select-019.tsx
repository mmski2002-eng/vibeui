"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Select019Currency = {
  value: string
  label: string
  sign: string
  rate: number
}

export type Select019Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  name?: string
  currencies?: Select019Currency[]
  defaultValue?: string
  /** Строка курса; {code} — код валюты, {rate} — отформатированный курс. */
  rateText?: string
  /** Локаль форматирования курса: компонент несёт русскую. */
  locale?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: валюту опознают по знаку быстрее, чем по коду, а курс
// рядом отвечает на следующий вопрос без перехода на другую страницу.
// Настоящий select лежит поверх плитки и невидим, как в select-012:
// клик, клавиатура и системный список остаются браузерными.
const STYLES = `
:where([data-vibeui-block="select-019"]){
--vibeui-select-019-surface:transparent;
--vibeui-select-019-surface-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-select-019-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-select-019-muted:color-mix(in oklab,var(--vibeui-select-019-fg) 68%,transparent);
--vibeui-select-019-border:light-dark(oklch(0.87 0 265),oklch(0.4 0 265));
--vibeui-select-019-accent:light-dark(oklch(0.58 0.16 39.8),oklch(0.76 0.14 39.8));
--vibeui-select-019-tint:light-dark(oklch(0.58 0.16 39.8 / 12%),oklch(0.76 0.14 39.8 / 20%));
--vibeui-select-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-select-019-mono:ui-monospace,"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="select-019"]{color-scheme:dark}
[data-vibeui-block="select-019"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,15rem);max-width:19rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-select-019-surface);
border:1px solid var(--vibeui-select-019-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-019-font);color:var(--vibeui-select-019-fg);
container-type:inline-size;
}
[data-vibeui-block="select-019"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-019"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="select-019"] select{
position:absolute;inset:0;width:100%;height:100%;
opacity:0;cursor:pointer;font:inherit;
}
/* Системный список рисует браузер по цветам самого <select>: у
   прозрачного он берёт белый, и в тёмной теме всплывал светлый
   список поверх тёмной страницы. */
[data-vibeui-block="select-019"] select,
[data-vibeui-block="select-019"] option,
[data-vibeui-block="select-019"] optgroup{
background-color:light-dark(oklch(1 0 0),oklch(0.24 0.01 265));color:var(--vibeui-select-019-fg);
}
[data-vibeui-block="select-019"] [data-part="trigger"]{
display:flex;align-items:center;gap:0.625rem;
box-sizing:border-box;width:100%;min-height:2.75rem;padding:0.5rem 0.75rem;
border:1px solid var(--vibeui-select-019-border);border-radius:0.625rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="select-019"] select:focus-visible + [data-part="trigger"],
[data-vibeui-block="select-019"] select:focus + [data-part="trigger"]{
border-color:var(--vibeui-select-019-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-019-accent) 22%,transparent);
}
[data-vibeui-block="select-019"] [data-part="sign"]{
flex:none;display:grid;place-items:center;width:1.75rem;height:1.75rem;border-radius:9999px;
background:var(--vibeui-select-019-tint);color:var(--vibeui-select-019-accent);
font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="select-019"] [data-part="name"]{
flex:1 1 auto;min-width:0;font-size:0.9375rem;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="select-019"] [data-part="code"]{
flex:none;font-size:0.8125rem;font-weight:600;color:var(--vibeui-select-019-muted);
}
[data-vibeui-block="select-019"] [data-part="rate"]{
margin:0;padding:0 0.125rem;
font-size:0.8125rem;color:var(--vibeui-select-019-muted);
font-variant-numeric:tabular-nums;font-family:var(--vibeui-select-019-mono);
}
@container (max-width: 13rem){
[data-vibeui-block="select-019"] [data-part="code"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-019"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CURRENCIES: Select019Currency[] = [
  { value: "usd", label: "Доллар США", sign: "$", rate: 82.4 },
  { value: "eur", label: "Евро", sign: "€", rate: 89.7 },
  { value: "rub", label: "Российский рубль", sign: "₽", rate: 1 },
  { value: "cny", label: "Китайский юань", sign: "¥", rate: 11.3 },
]

function formatRate(rate: number, locale: string) {
  return rate.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
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

/**
 * Select валюты: знак и код в плитке-триггере, курс к рублю — отдельной
 * строкой под полем. Один файл, ноль зависимостей, собственная палитра.
 */
export function Select019({
  label = "Валюта расчёта",
  name,
  currencies = DEFAULT_CURRENCIES,
  defaultValue = currencies[0]?.value,
  rateText = "1 {code} = {rate} ₽",
  locale = "ru-RU",
  background = "",
  accent,
  id,
  className,
  style,
  ...props
}: Select019Props) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const rateId = `${fieldId}-rate`
  const [value, setValue] = useState(
    defaultValue ?? DEFAULT_CURRENCIES[0].value,
  )
  const current =
    currencies.find((currency) => currency.value === value) ?? currencies[0]

  const palette = {
    ...(accent ? { "--vibeui-select-019-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-select-019-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-019" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="select"
        data-vibeui-block="select-019"
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={fieldId}>
          {label}
        </label>
        <span data-part="field">
          <select
            id={fieldId}
            name={name}
            value={value}
            aria-describedby={rateId}
            onChange={(event) => setValue(event.target.value)}
          >
            {currencies.map((currency) => (
              <option key={currency.value} value={currency.value}>
                {currency.sign} {currency.label}
              </option>
            ))}
          </select>
          <span data-part="trigger" aria-hidden="true">
            <span data-part="sign">{current?.sign}</span>
            <span data-part="name">{current?.label}</span>
            <span data-part="code">{current?.value.toUpperCase()}</span>
          </span>
        </span>
        <p data-part="rate" id={rateId} role="status">
          {rateText
            .replace("{code}", current?.value.toUpperCase() ?? "")
            .replace("{rate}", formatRate(current?.rate ?? 0, locale))}
        </p>
      </div>
    </>
  )
}

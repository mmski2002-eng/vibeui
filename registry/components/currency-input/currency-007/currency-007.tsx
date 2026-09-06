"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Currency007Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  defaultFrom?: string
  defaultTo?: string
  currency?: string
  /** Подписи фильтра; {from}, {to} и {currency} подставляются. */
  filterText?: Record<string, string>
  /** Локаль разрядов: компонент несёт русскую, проект подставляет свою. */
  locale?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: цена «от» и «до» двумя полями, где перепутанный порядок
// молча меняется местами по уходу из поля. Ругаться на «от 12000 до 3000»
// бессмысленно: человек уже сказал, чего хочет, и просто набрал не в том поле.
// Каждая граница необязательна: одно «до 5000» — самый частый фильтр, и
// заставлять придумывать нижнюю границу не за что. Итоговая формулировка
// собирается словами и меняется в зависимости от того, что заполнено.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у фильтра
// по умолчанию нет, он лежит прямо на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="currency-007"]){
--vibeui-currency-007-surface:transparent;
--vibeui-currency-007-field:light-dark(oklch(0.985 0 265),oklch(0.26 0 265));
--vibeui-currency-007-shell:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-currency-007-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-currency-007-muted:color-mix(in oklab,var(--vibeui-currency-007-fg) 68%,transparent);
--vibeui-currency-007-border:light-dark(oklch(0.88 0 265),oklch(0.38 0 265));
--vibeui-currency-007-accent:light-dark(oklch(0.55 0.18 40),oklch(0.76 0.15 45));
--vibeui-currency-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="currency-007"]{color-scheme:dark}
/* Подложки по умолчанию нет: фильтр ложится на фон страницы. */
[data-vibeui-block="currency-007"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:21rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-currency-007-surface);
border:1px solid var(--vibeui-currency-007-shell);border-radius:0.875rem;
font-family:var(--vibeui-currency-007-font);color:var(--vibeui-currency-007-fg);
}
/* legend во float даёт обтекание: clear возвращает нормальный поток. */
[data-vibeui-block="currency-007"] legend{
float:left;width:100%;padding:0;margin-bottom:0.5rem;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="currency-007"] [data-part="pair"]{
clear:both;display:flex;align-items:stretch;gap:0.375rem;
}
[data-vibeui-block="currency-007"] [data-part="cell"]{
flex:1 1 0;min-width:0;display:flex;align-items:center;gap:0.25rem;
padding:0 0.625rem;box-sizing:border-box;height:2.75rem;
border:1px solid var(--vibeui-currency-007-border);border-radius:0.625rem;
background:var(--vibeui-currency-007-field);
}
[data-vibeui-block="currency-007"] [data-part="cell"]:focus-within{
border-color:var(--vibeui-currency-007-accent);
box-shadow:0 0 0 2px color-mix(in oklch,var(--vibeui-currency-007-accent) 20%,transparent);
}
[data-vibeui-block="currency-007"] [data-part="prefix"]{
flex:none;font-size:0.75rem;font-weight:650;color:var(--vibeui-currency-007-muted);
}
[data-vibeui-block="currency-007"] input{
flex:1 1 auto;min-width:0;width:100%;
appearance:none;border:0;background:none;outline:none;
height:100%;color:inherit;text-align:right;
font:inherit;font-size:0.9375rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="currency-007"] input::-webkit-outer-spin-button,
[data-vibeui-block="currency-007"] input::-webkit-inner-spin-button{appearance:none;margin:0}
[data-vibeui-block="currency-007"] input::placeholder{font-weight:500;color:var(--vibeui-currency-007-muted)}
[data-vibeui-block="currency-007"] [data-part="dash"]{
display:flex;align-items:center;flex:none;color:var(--vibeui-currency-007-muted);
}
[data-vibeui-block="currency-007"] [data-part="sign"]{
flex:none;font-size:0.8125rem;font-weight:650;color:var(--vibeui-currency-007-muted);
}
[data-vibeui-block="currency-007"] [data-part="summary"]{
margin:0;font-size:0.75rem;color:var(--vibeui-currency-007-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="currency-007"] [data-part="summary"] b{color:var(--vibeui-currency-007-fg);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="currency-007"] *{animation:none!important;transition:none!important}}
`

function pretty(value: string, locale: string) {
  const number = Number(value)
  return Number.isFinite(number) ? number.toLocaleString(locale) : value
}

const FILTER_TEXT: Record<string, string> = {
  fromPrefix: "от",
  toPrefix: "до",
  fromLabel: "Цена от, {currency}",
  toLabel: "Цена до, {currency}",
  caption: "Фильтр:",
  any: "Любая цена",
  onlyFrom: "От {from} {currency}",
  onlyTo: "До {to} {currency}",
  both: "От {from} до {to} {currency}",
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
 * Цена «от» и «до»: обе границы необязательны, перепутанный порядок меняется местами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Currency007({
  legend = "Цена",
  defaultFrom = "3000",
  defaultTo = "12000",
  currency = "₽",
  filterText = FILTER_TEXT,
  locale = "ru-RU",
  background = "",
  accent,
  className,
  style,
  ...props
}: Currency007Props) {
  const id = useId()
  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo)

  // Порядок чинится обменом, а не ошибкой: человек просто набрал не в том поле.
  const settle = () => {
    if (from !== "" && to !== "" && Number(from) > Number(to)) {
      setFrom(to)
      setTo(from)
    }
  }

  const say = (key: string) =>
    (filterText[key] ?? FILTER_TEXT[key])
      .replace("{from}", pretty(from, locale))
      .replace("{to}", pretty(to, locale))
      .replace("{currency}", currency)

  const summary =
    from === "" && to === ""
      ? say("any")
      : from === ""
        ? say("onlyTo")
        : to === ""
          ? say("onlyFrom")
          : say("both")

  const palette = {
    ...(accent ? { "--vibeui-currency-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-currency-007-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-currency-007" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="currency-input"
        data-vibeui-block="currency-007"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <div data-part="pair">
          <div data-part="cell">
            <span data-part="prefix" aria-hidden="true">
              {say("fromPrefix")}
            </span>
            <input
              id={`${id}-from`}
              type="number"
              inputMode="numeric"
              min={0}
              step={100}
              value={from}
              placeholder="0"
              aria-label={say("fromLabel")}
              onChange={(event) => setFrom(event.target.value)}
              onBlur={settle}
            />
            <span data-part="sign" aria-hidden="true">
              {currency}
            </span>
          </div>
          <span data-part="dash" aria-hidden="true">
            —
          </span>
          <div data-part="cell">
            <span data-part="prefix" aria-hidden="true">
              {say("toPrefix")}
            </span>
            <input
              id={`${id}-to`}
              type="number"
              inputMode="numeric"
              min={0}
              step={100}
              value={to}
              placeholder="∞"
              aria-label={say("toLabel")}
              onChange={(event) => setTo(event.target.value)}
              onBlur={settle}
            />
            <span data-part="sign" aria-hidden="true">
              {currency}
            </span>
          </div>
        </div>
        <p data-part="summary" aria-live="polite">
          {say("caption")} <b>{summary}</b>
        </p>
      </fieldset>
    </>
  )
}

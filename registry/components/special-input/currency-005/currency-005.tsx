"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Currency005Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  limit?: number
  defaultValue?: number
  currency?: string
  /** Валюта словом: знак «₽» скринридер не называет. */
  currencyText?: string
  /** Подпись потолка; {limit} и {currency} подставляются. */
  limitText?: string
  /** Пояснение по состоянию; {amount} и {currency} подставляются. */
  noteText?: Record<string, string>
  /** Локаль разрядов: компонент несёт русскую, проект подставляет свою. */
  locale?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: бюджет с потолком, который виден до ошибки, а не после.
// Обычное поле с max молчит до отправки формы, и о превышении узнают на
// последнем шаге. Здесь полоса заполняется по мере ввода, а на подходе к
// лимиту меняет цвет: остаток читается площадью быстрее, чем цифрой. Ввод
// выше лимита не запрещается — он помечается как ошибка, потому что человек
// часто сначала набирает нужную сумму, а потом идёт повышать лимит.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у поля по
// умолчанию нет, оно лежит прямо на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="currency-005"]){
--vibeui-currency-005-surface:transparent;
--vibeui-currency-005-field:light-dark(oklch(0.985 0 265),oklch(0.26 0 265));
--vibeui-currency-005-shell:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-currency-005-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-currency-005-muted:color-mix(in oklab,var(--vibeui-currency-005-fg) 68%,transparent);
--vibeui-currency-005-border:light-dark(oklch(0.88 0 265),oklch(0.38 0 265));
--vibeui-currency-005-track:light-dark(oklch(0.93 0 265),oklch(0.32 0 265));
--vibeui-currency-005-ok:light-dark(oklch(0.55 0.15 160),oklch(0.74 0.13 160));
--vibeui-currency-005-near:light-dark(oklch(0.32 0 0),oklch(0.914 0 0));
--vibeui-currency-005-over:light-dark(oklch(0.29 0 0),oklch(0.899 0 0));
--vibeui-currency-005-accent:var(--vibeui-currency-005-ok);
--vibeui-currency-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-currency-005-fill:0%;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="currency-005"]{color-scheme:dark}
/* Подложки по умолчанию нет: поле ложится на фон страницы. */
[data-vibeui-block="currency-005"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-currency-005-surface);
border:1px solid var(--vibeui-currency-005-shell);border-radius:0.875rem;
font-family:var(--vibeui-currency-005-font);color:var(--vibeui-currency-005-fg);
}
/* Одна переменная на состояние: полоса, рамка и текст меняются разом. */
[data-vibeui-block="currency-005"][data-state="near"]{--vibeui-currency-005-accent:var(--vibeui-currency-005-near)}
[data-vibeui-block="currency-005"][data-state="over"]{--vibeui-currency-005-accent:var(--vibeui-currency-005-over)}
[data-vibeui-block="currency-005"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;margin:0;
}
[data-vibeui-block="currency-005"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="currency-005"] [data-part="limit"]{
font-size:0.6875rem;color:var(--vibeui-currency-005-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="currency-005"] [data-part="row"]{
display:flex;align-items:center;gap:0.375rem;
padding:0 0.875rem;box-sizing:border-box;height:3rem;
border:1px solid var(--vibeui-currency-005-border);border-radius:0.75rem;
background:var(--vibeui-currency-005-field);
transition:border-color .16s ease;
}
[data-vibeui-block="currency-005"][data-state="over"] [data-part="row"]{border-color:var(--vibeui-currency-005-over)}
[data-vibeui-block="currency-005"] [data-part="row"]:focus-within{
border-color:var(--vibeui-currency-005-accent);
box-shadow:0 0 0 2px color-mix(in oklch,var(--vibeui-currency-005-accent) 20%,transparent);
}
[data-vibeui-block="currency-005"] input{
flex:1 1 auto;min-width:0;width:100%;
appearance:none;border:0;background:none;outline:none;
height:100%;color:inherit;text-align:right;
font:inherit;font-size:1.375rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="currency-005"] input::-webkit-outer-spin-button,
[data-vibeui-block="currency-005"] input::-webkit-inner-spin-button{appearance:none;margin:0}
[data-vibeui-block="currency-005"] [data-part="sign"]{
flex:none;font-size:1.125rem;font-weight:700;color:var(--vibeui-currency-005-muted);
}
/* Остаток читается площадью быстрее, чем цифрой. */
[data-vibeui-block="currency-005"] [data-part="bar"]{
height:0.375rem;border-radius:9999px;background:var(--vibeui-currency-005-track);overflow:hidden;
}
[data-vibeui-block="currency-005"] [data-part="fill"]{
display:block;height:100%;width:var(--vibeui-currency-005-fill);
background:var(--vibeui-currency-005-accent);
transition:width .18s ease,background-color .18s ease;color:oklch(from var(--vibeui-currency-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="currency-005"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-currency-005-muted);
}
[data-vibeui-block="currency-005"][data-state="over"] [data-part="note"]{color:var(--vibeui-currency-005-over);font-weight:650}
[data-vibeui-block="currency-005"] [data-part="sr"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
clip:rect(0,0,0,0);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="currency-005"] *{animation:none!important;transition:none!important}}
`

const NOTE_TEXT: Record<string, string> = {
  ok: "Останется {amount} {currency} из месячного лимита.",
  near: "Останется {amount} {currency} из месячного лимита.",
  over: "Превышение на {amount} {currency} — уменьшите сумму или поднимите лимит.",
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
 * Поле бюджета с потолком: полоса остатка и предупреждение до отправки формы.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Currency005({
  label = "Бюджет кампании",
  limit = 100000,
  defaultValue = 68000,
  currency = "₽",
  currencyText = "в рублях",
  limitText = "потолок {limit} {currency}",
  noteText = NOTE_TEXT,
  locale = "ru-RU",
  background = "",
  accent,
  className,
  style,
  ...props
}: Currency005Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const share = limit > 0 ? value / limit : 0
  const state = share > 1 ? "over" : share >= 0.85 ? "near" : "ok"
  const rest = limit - value

  const note = (noteText[state] ?? NOTE_TEXT[state])
    .replace("{amount}", Math.abs(rest).toLocaleString(locale))
    .replace("{currency}", currency)

  const palette = {
    "--vibeui-currency-005-fill": `${Math.min(100, Math.max(0, share * 100))}%`,
    ...(accent ? { "--vibeui-currency-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-currency-005-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-currency-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="currency-input"
        data-vibeui-block="currency-005"
        data-state={state}
        className={className}
        style={palette}
      >
        <p data-part="head">
          <label htmlFor={id}>
            {label}
            <span data-part="sr"> {currencyText}</span>
          </label>
          <span data-part="limit">
            {limitText
              .replace("{limit}", limit.toLocaleString(locale))
              .replace("{currency}", currency)}
          </span>
        </p>
        <div data-part="row">
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            value={value}
            aria-invalid={state === "over"}
            aria-describedby={`${id}-note`}
            onChange={(event) => {
              const next = Number(event.target.value)
              setValue(Number.isFinite(next) ? Math.max(0, next) : 0)
            }}
          />
          <span data-part="sign" aria-hidden="true">
            {currency}
          </span>
        </div>
        <div data-part="bar" aria-hidden="true">
          <span data-part="fill" />
        </div>
        <p id={`${id}-note`} data-part="note" aria-live="polite">
          {note}
        </p>
      </div>
    </>
  )
}

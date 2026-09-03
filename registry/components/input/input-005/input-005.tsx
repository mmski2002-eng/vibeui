"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Input005Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  prefix?: string
  hint?: string
  placeholder?: string
  /** Начальные цифры номера без кода страны. */
  defaultValue?: string
  /** Пусто — подложки нет, поле лежит прямо на фоне страницы. */
  background?: string
  onChange?: (digits: string) => void
  accent?: string
}

// Идея компонента: телефон с маской, которая не мешает. Форматирование идёт
// от цифр: из ввода вынимаются только они, а скобки и дефисы дорисовываются
// сверху. Так вставка из буфера в любом формате не ломает поле, а стирание
// не застревает на скобке.
const STYLES = `
:where([data-vibeui-block="input-005"]){
--vibeui-input-005-bg:transparent;
--vibeui-input-005-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-input-005-muted:color-mix(in oklab,var(--vibeui-input-005-fg) 68%,transparent);
--vibeui-input-005-border:light-dark(oklch(0.9 0.006 265),oklch(0.4 0.014 265));
--vibeui-input-005-field:light-dark(oklch(0.985 0.002 265),oklch(0.26 0.012 265));
--vibeui-input-005-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-input-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="input-005"]{color-scheme:dark}
[data-vibeui-block="input-005"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:20rem;box-sizing:border-box;
font-family:var(--vibeui-input-005-font);color:var(--vibeui-input-005-fg);
}
/* Подложка появляется только вместе с пропом background: без него поле
   лежит прямо на фоне страницы. */
[data-vibeui-block="input-005"][data-surface="on"]{
padding:0.875rem;
background:var(--vibeui-input-005-bg);
border:1px solid var(--vibeui-input-005-border);border-radius:0.875rem;
}
[data-vibeui-block="input-005"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-005"] [data-part="row"]{
display:flex;align-items:center;gap:0.5rem;
box-sizing:border-box;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-input-005-border);border-radius:0.625rem;
background:var(--vibeui-input-005-field);
}
[data-vibeui-block="input-005"] [data-part="row"]:focus-within{
outline:2px solid var(--vibeui-input-005-accent);outline-offset:1px;border-color:transparent;
}
/* Код страны — не часть поля: его не стирают и не редактируют случайно. */
[data-vibeui-block="input-005"] [data-part="prefix"]{
flex:none;color:var(--vibeui-input-005-muted);font-size:0.875rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="input-005"] input{
flex:1;min-width:0;height:100%;border:0;background:transparent;color:inherit;
font:inherit;font-size:0.875rem;font-variant-numeric:tabular-nums;letter-spacing:0.01em;
}
[data-vibeui-block="input-005"] input:focus{outline:none}
[data-vibeui-block="input-005"] [data-part="hint"]{font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-005-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-005"] *{animation:none!important;transition:none!important}}
`

// Форматирование идёт от цифр: вставка «+7 (999) 000-00-00» и «79990000000»
// даёт одинаковый результат, а стирание не застревает на скобке.
function format(digits: string) {
  const value = digits.slice(0, 10)
  const parts = [
    value.slice(0, 3),
    value.slice(3, 6),
    value.slice(6, 8),
    value.slice(8, 10),
  ].filter(Boolean)

  if (parts.length === 0) return ""
  if (parts.length === 1) return `(${parts[0]}`
  return `(${parts[0]}) ${parts.slice(1).join("-")}`
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
 * Телефон с маской от цифр: вставка в любом формате не ломает поле.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Input005({
  label = "Телефон",
  prefix = "+7",
  hint = "Пришлём код подтверждения в СМС",
  placeholder = "(999) 000-00-00",
  defaultValue = "9990000000",
  background = "",
  onChange,
  accent,
  className,
  style,
  ...props
}: Input005Props) {
  const id = useId()
  const [digits, setDigits] = useState(defaultValue.replace(/\D/g, ""))

  const palette = {
    ...(accent ? { "--vibeui-input-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-input-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-input-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input"
        data-vibeui-block="input-005"
        data-surface={background ? "on" : undefined}
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="row">
          <span data-part="prefix">{prefix}</span>
          <input
            id={id}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder={placeholder}
            value={format(digits)}
            aria-describedby={hint ? `${id}-hint` : undefined}
            onChange={(event) => {
              const next = event.target.value.replace(/\D/g, "").slice(0, 10)
              setDigits(next)
              onChange?.(next)
            }}
          />
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

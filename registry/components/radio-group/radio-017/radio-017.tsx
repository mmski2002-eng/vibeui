"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Radio017Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "defaultValue" | "onChange"
> & {
  legend?: string
  reasons?: string[]
  otherLabel?: string
  placeholder?: string
  footnote?: string
  /** Accessible-имя поля: {label} подставляет подпись пункта «другое». */
  otherFieldLabel?: string
  name?: string
  defaultValue?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: причина отказа, не объяснение целиком. Готовые формулировки
// закрывают почти все случаи, а строка «другое» с полем — редкий остаток.
// Поле — textarea, а не однострочный input: причину часто хочется пояснить
// парой предложений. Строка стоит на месте всегда, но включается по выбору.
//
// Тема берётся из color-scheme окружения через light-dark().
const STYLES = `
:where([data-vibeui-block="radio-017"]){
--vibeui-radio-017-bg:transparent;
--vibeui-radio-017-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-radio-017-muted:light-dark(oklch(0.56 0.014 265),oklch(0.71 0.012 265));
--vibeui-radio-017-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-radio-017-ring:light-dark(oklch(0.74 0.012 265),oklch(0.5 0.014 265));
--vibeui-radio-017-field:light-dark(oklch(0.985 0.002 265),oklch(0.27 0.012 265));
--vibeui-radio-017-accent:light-dark(oklch(0.55 0.18 25),oklch(0.75 0.15 25));
--vibeui-radio-017-tint:light-dark(oklch(0.55 0.18 25 / 6%),oklch(0.75 0.15 25 / 15%));
--vibeui-radio-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="radio-017"]{
display:flex;flex-direction:column;
width:100%;max-width:23rem;box-sizing:border-box;
margin:0;padding:0.5rem 0.875rem 0.875rem;
background:var(--vibeui-radio-017-bg);
border:1px solid var(--vibeui-radio-017-border);border-radius:0.875rem;
font-family:var(--vibeui-radio-017-font);color:var(--vibeui-radio-017-fg);
}
[data-vibeui-block="radio-017"] legend{
float:left;width:100%;padding:0;margin:0.375rem 0 0.5rem;
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="radio-017"] [data-part="list"]{clear:both;display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="radio-017"] [data-part="reason"]{
display:flex;align-items:center;gap:0.625rem;cursor:pointer;
padding:0.5625rem 0.6875rem;border-radius:0.625rem;font-size:0.8125rem;
border:1px solid var(--vibeui-radio-017-border);
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="radio-017"] [data-part="reason"]:has(input:checked){
border-color:var(--vibeui-radio-017-accent);background:var(--vibeui-radio-017-tint);
}
[data-vibeui-block="radio-017"] input[type="radio"]{
appearance:none;-webkit-appearance:none;flex:none;margin:0;cursor:pointer;
width:1.0625rem;height:1.0625rem;border-radius:9999px;
border:1.5px solid var(--vibeui-radio-017-ring);
background:transparent;
}
/* Точка — градиент, а не внутренняя тень: тени пришлось бы закрашивать
   зазор цветом подложки, а подложки у компонента по умолчанию нет. */
[data-vibeui-block="radio-017"] input[type="radio"]:checked{
border-color:var(--vibeui-radio-017-accent);
background:radial-gradient(circle at 50% 50%,var(--vibeui-radio-017-accent) 0 0.21875rem,transparent 0.21875rem);
}
[data-vibeui-block="radio-017"] input[type="radio"]:focus-visible{outline:2px solid var(--vibeui-radio-017-accent);outline-offset:2px}
/* Поле занимает место всегда: исчезающий textarea дёргает высоту формы и
   прячет саму возможность написать своими словами. */
[data-vibeui-block="radio-017"] [data-part="other-field"]{margin:0.375rem 0 0 1.6875rem}
[data-vibeui-block="radio-017"] textarea{
box-sizing:border-box;width:100%;min-height:3.75rem;resize:vertical;
padding:0.5rem 0.625rem;border:1px solid var(--vibeui-radio-017-border);border-radius:0.5rem;
background:var(--vibeui-radio-017-field);color:inherit;font:inherit;font-size:0.8125rem;
transition:border-color .16s ease,box-shadow .16s ease,opacity .16s ease;
}
[data-vibeui-block="radio-017"] textarea:focus{
outline:none;border-color:var(--vibeui-radio-017-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-radio-017-accent) 20%,transparent);
}
[data-vibeui-block="radio-017"] textarea:disabled{opacity:.5;cursor:not-allowed;background:transparent}
[data-vibeui-block="radio-017"] [data-part="counter"]{
display:block;margin-top:0.25rem;font-size:0.6875rem;color:var(--vibeui-radio-017-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="radio-017"] [data-part="footnote"]{
margin:0.75rem 0 0;font-size:0.6875rem;color:var(--vibeui-radio-017-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="radio-017"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_REASONS = [
  "Слишком дорого",
  "Не нашёл нужных функций",
  "Перешёл на другой сервис",
  "Редко пользуюсь",
]

const OTHER = "__other__"
const LIMIT = 240

/**
 * Причина отказа радиогруппой: готовые формулировки и «другое» с textarea,
 * включённым только после выбора последнего пункта. Один файл, ноль
 * зависимостей, собственная палитра.
 */
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

export function Radio017({
  legend = "Почему вы отменяете подписку?",
  reasons = DEFAULT_REASONS,
  otherLabel = "Другая причина",
  placeholder = "Опишите, что пошло не так",
  footnote = "Ответ поможет нам стать лучше — это не обязательное поле.",
  otherFieldLabel = "{label}: причина своими словами",
  name = "vibeui-radio-017",
  defaultValue = DEFAULT_REASONS[0],
  background = "",
  accent,
  className,
  style,
  ...props
}: Radio017Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [other, setOther] = useState("")
  const isOther = value === OTHER

  const palette = {
    ...(accent ? { "--vibeui-radio-017-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-radio-017-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-radio-017" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="radio-017"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <div data-part="list">
          {reasons.map((reason) => (
            <label key={reason} data-part="reason">
              <input
                type="radio"
                name={name}
                value={reason}
                checked={value === reason}
                onChange={() => setValue(reason)}
              />
              <span>{reason}</span>
            </label>
          ))}
          <div>
            <label data-part="reason" htmlFor={`${id}-other-radio`}>
              <input
                id={`${id}-other-radio`}
                type="radio"
                name={name}
                value={OTHER}
                checked={isOther}
                onChange={() => setValue(OTHER)}
              />
              <span>{otherLabel}</span>
            </label>
            <div data-part="other-field">
              <textarea
                id={`${id}-other-text`}
                name={`${name}-other`}
                value={other}
                maxLength={LIMIT}
                disabled={!isOther}
                placeholder={placeholder}
                aria-label={otherFieldLabel.replace("{label}", otherLabel)}
                onChange={(event) => setOther(event.target.value)}
              />
              {isOther ? (
                <span data-part="counter">
                  {other.length} / {LIMIT}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        {footnote ? <p data-part="footnote">{footnote}</p> : null}
      </fieldset>
    </>
  )
}

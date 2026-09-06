"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Radio008Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "defaultValue" | "onChange"
> & {
  legend?: string
  options?: string[]
  otherLabel?: string
  placeholder?: string
  /** Доступное имя поля. `{label}` заменяется подписью варианта «другое». */
  otherFieldLabel?: string
  name?: string
  defaultValue?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: вариант «другое» с полем ввода. Прятать поле совсем —
// плохо: человек не видит, что можно ответить своими словами. Поле стоит
// на месте всегда, но выключено, пока не выбран последний пункт; disabled
// не даёт отправить пустую строку и убирает поле из обхода по Tab.
//
// Тема берётся из color-scheme окружения через light-dark().
const STYLES = `
:where([data-vibeui-block="radio-008"]){
--vibeui-radio-008-bg:transparent;
--vibeui-radio-008-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-radio-008-muted:color-mix(in oklab,var(--vibeui-radio-008-fg) 68%,transparent);
--vibeui-radio-008-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-radio-008-ring:light-dark(oklch(0.74 0 265),oklch(0.53 0 265));
--vibeui-radio-008-field:light-dark(oklch(0.985 0 265),oklch(0.28 0 265));
--vibeui-radio-008-accent:light-dark(oklch(0.55 0.19 300),oklch(0.75 0.15 300));
--vibeui-radio-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="radio-008"]{color-scheme:dark}
[data-vibeui-block="radio-008"]{
display:flex;flex-direction:column;
width:100%;max-width:21rem;box-sizing:border-box;
margin:0;padding:0.5rem 0.875rem 0.875rem;
background:var(--vibeui-radio-008-bg);
border:1px solid var(--vibeui-radio-008-border);border-radius:0.875rem;
font-family:var(--vibeui-radio-008-font);color:var(--vibeui-radio-008-fg);
}
[data-vibeui-block="radio-008"] legend{
float:left;width:100%;padding:0;margin:0.375rem 0 0.625rem;
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="radio-008"] [data-part="list"]{clear:both;display:flex;flex-direction:column;gap:0.625rem}
[data-vibeui-block="radio-008"] [data-part="option"]{
display:flex;align-items:center;gap:0.625rem;cursor:pointer;font-size:0.875rem;
}
[data-vibeui-block="radio-008"] input[type="radio"]{
appearance:none;-webkit-appearance:none;flex:none;margin:0;cursor:pointer;
width:1.125rem;height:1.125rem;border-radius:9999px;
border:1.5px solid var(--vibeui-radio-008-ring);
background:transparent;
}
/* Точка нарисована фоном самого кружка: внутренней тенью зазор пришлось бы
   закрашивать цветом подложки, а подложки у компонента по умолчанию нет. */
[data-vibeui-block="radio-008"] input[type="radio"]:checked{
border-color:var(--vibeui-radio-008-accent);
background:radial-gradient(circle at 50% 50%,var(--vibeui-radio-008-accent) 0 0.25rem,transparent 0.25rem);
}
[data-vibeui-block="radio-008"] input[type="radio"]:focus-visible{outline:2px solid var(--vibeui-radio-008-accent);outline-offset:2px}
/* Поле сдвинуто под подпись «другое» и всегда занимает место: исчезающее
   поле дёргает всю форму и прячет саму возможность ответить словами. */
[data-vibeui-block="radio-008"] [data-part="other-field"]{
margin-left:1.75rem;margin-top:0.5rem;
}
[data-vibeui-block="radio-008"] input[type="text"]{
box-sizing:border-box;width:100%;height:2.25rem;padding:0 0.625rem;
border:1px solid var(--vibeui-radio-008-border);border-radius:0.5rem;
background:var(--vibeui-radio-008-field);color:inherit;
font:inherit;font-size:0.8125rem;
transition:border-color .16s ease,box-shadow .16s ease,opacity .16s ease;
}
[data-vibeui-block="radio-008"] input[type="text"]:focus{
outline:none;border-color:var(--vibeui-radio-008-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-radio-008-accent) 20%,transparent);
}
[data-vibeui-block="radio-008"] input[type="text"]:disabled{
opacity:.5;cursor:not-allowed;background:transparent;
}
[data-vibeui-block="radio-008"] [data-part="counter"]{
display:block;margin-top:0.25rem;font-size:0.6875rem;color:var(--vibeui-radio-008-muted);
font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="radio-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "Через друзей",
  "Реклама в соцсетях",
  "Поиск в интернете",
]

const OTHER = "__other__"
const LIMIT = 60

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
 * Радиогруппа с вариантом «другое»: поле стоит всегда, включается по выбору.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Radio008({
  legend = "Откуда узнали о нас",
  options = DEFAULT_OPTIONS,
  otherLabel = "Другое",
  placeholder = "Расскажите своими словами",
  otherFieldLabel = "{label}: свой вариант",
  name = "vibeui-radio-008",
  defaultValue = "Через друзей",
  background = "",
  accent,
  className,
  style,
  ...props
}: Radio008Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [other, setOther] = useState("")
  const isOther = value === OTHER

  const palette = {
    ...(accent ? { "--vibeui-radio-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-radio-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-radio-008" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="radio-group"
        data-vibeui-block="radio-008"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <div data-part="list">
          {options.map((option) => (
            <label key={option} data-part="option">
              <input
                type="radio"
                name={name}
                value={option}
                checked={value === option}
                onChange={() => setValue(option)}
              />
              <span>{option}</span>
            </label>
          ))}
          <div>
            <label data-part="option" htmlFor={`${id}-other-radio`}>
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
              <input
                id={`${id}-other-text`}
                type="text"
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
      </fieldset>
    </>
  )
}

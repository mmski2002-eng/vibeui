"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Select008Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  options?: string[]
  placeholder?: string
  error?: string
  /** Строка на месте ошибки, когда поле заполнено. */
  hint?: string
  /** Пусто — подложки нет, поле лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: ошибка валидации, которая уходит сама. Красная рамка,
// висящая до повторной отправки формы, выглядит как обвинение: человек уже
// исправил поле, а его всё ещё ругают. Здесь сообщение снимается на первом
// же осмысленном выборе, а до этого связано с полем через aria-describedby.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="select-008"]){
--vibeui-select-008-surface:transparent;
--vibeui-select-008-surface-border:transparent;
--vibeui-select-008-surface-pad:0;
--vibeui-select-008-surface-radius:0;
--vibeui-select-008-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-select-008-muted:color-mix(in oklab,var(--vibeui-select-008-fg) 68%,transparent);
--vibeui-select-008-field:light-dark(oklch(0.985 0 265),oklch(0.25 0 265));
--vibeui-select-008-border:light-dark(oklch(0.87 0 265),oklch(0.42 0 265));
--vibeui-select-008-accent:light-dark(oklch(0.287 0 0),oklch(0.905 0 0));
--vibeui-select-008-danger:light-dark(oklch(0.55 0.2 25),oklch(0.72 0.17 25));
--vibeui-select-008-danger-tint:light-dark(oklch(0.55 0.2 25 / 9%),oklch(0.72 0.17 25 / 18%));
--vibeui-select-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="select-008"]{color-scheme:dark}
/* Подложка появляется только вместе с пропом background: по умолчанию поле
   лежит прямо на фоне страницы. */
[data-vibeui-block="select-008"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:20rem;box-sizing:border-box;
padding:var(--vibeui-select-008-surface-pad);
background:var(--vibeui-select-008-surface);
border:1px solid var(--vibeui-select-008-surface-border);
border-radius:var(--vibeui-select-008-surface-radius);
font-family:var(--vibeui-select-008-font);color:var(--vibeui-select-008-fg);
}
[data-vibeui-block="select-008"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-008"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="select-008"] select{
appearance:none;-webkit-appearance:none;
width:100%;box-sizing:border-box;margin:0;height:2.75rem;
padding:0 2.5rem 0 0.875rem;
border:1px solid var(--vibeui-select-008-border);border-radius:0.625rem;
background:var(--vibeui-select-008-field);color:inherit;
font:inherit;font-size:0.9375rem;cursor:pointer;
transition:border-color .16s ease,box-shadow .16s ease;
}
/* Системный список рисует браузер по цветам самого <select>: у
   прозрачного он берёт белый, и в тёмной теме всплывал светлый
   список поверх тёмной страницы. */
[data-vibeui-block="select-008"] select,
[data-vibeui-block="select-008"] option,
[data-vibeui-block="select-008"] optgroup{
background-color:var(--vibeui-select-008-field);color:var(--vibeui-select-008-fg);
}
[data-vibeui-block="select-008"] select:focus{
outline:none;border-color:var(--vibeui-select-008-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-008-accent) 22%,transparent);
}
/* Ошибка — это рамка, заливка и текст сразу: одного цвета рамки не хватает
   тем, кто его не различает. */
[data-vibeui-block="select-008"][data-invalid="true"] select{
border-color:var(--vibeui-select-008-danger);
background:var(--vibeui-select-008-danger-tint);
}
[data-vibeui-block="select-008"][data-invalid="true"] select:focus{
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-008-danger) 22%,transparent);
}
[data-vibeui-block="select-008"] [data-part="arrow"]{
position:absolute;right:1rem;top:50%;
width:0.4375rem;height:0.4375rem;margin-top:-0.3125rem;pointer-events:none;
border-right:1.5px solid var(--vibeui-select-008-muted);
border-bottom:1.5px solid var(--vibeui-select-008-muted);
transform:rotate(45deg);
}
[data-vibeui-block="select-008"][data-invalid="true"] [data-part="arrow"]{
border-right-color:var(--vibeui-select-008-danger);
border-bottom-color:var(--vibeui-select-008-danger);
}
[data-vibeui-block="select-008"] [data-part="error"]{
display:flex;align-items:flex-start;gap:0.375rem;margin:0;
font-size:0.75rem;line-height:1.4;color:var(--vibeui-select-008-danger);
}
/* Кружок с восклицательным знаком нарисован рамкой и псевдоэлементом:
   значок ошибки без иконочного пакета. */
[data-vibeui-block="select-008"] [data-part="sign"]{
position:relative;flex:none;width:0.875rem;height:0.875rem;margin-top:0.0625rem;
border:1.5px solid currentColor;border-radius:9999px;
}
[data-vibeui-block="select-008"] [data-part="sign"]::before{
content:"";position:absolute;left:50%;top:0.125rem;
width:1.5px;height:0.3125rem;margin-left:-0.75px;background:currentColor;
}
[data-vibeui-block="select-008"] [data-part="sign"]::after{
content:"";position:absolute;left:50%;bottom:0.125rem;
width:1.5px;height:1.5px;margin-left:-0.75px;background:currentColor;
}
[data-vibeui-block="select-008"] [data-part="ok"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-select-008-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "Индивидуальный предприниматель",
  "Общество с ограниченной ответственностью",
  "Самозанятый",
  "Физическое лицо",
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 * Считается один раз при рендере, клиентского кода не добавляет.
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
 * Select с ошибкой валидации, которая снимается при первом верном выборе.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Select008({
  label = "Форма собственности",
  options = DEFAULT_OPTIONS,
  placeholder = "Не выбрано",
  error = "Без этого поля счёт не выставить",
  hint = "Реквизиты подставим автоматически.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Select008Props) {
  const id = useId()
  const [value, setValue] = useState("")
  const invalid = value === ""

  // Подложка приходит вместе с полями и скруглением: без неё поле лежит
  // прямо на странице, и лишние поля по бокам ему только мешают.
  const palette = {
    ...(accent ? { "--vibeui-select-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-select-008-surface": background,
          "--vibeui-select-008-surface-border":
            "light-dark(oklch(0.91 0 265),oklch(0.36 0 265))",
          "--vibeui-select-008-surface-pad": "0.875rem",
          "--vibeui-select-008-surface-radius": "0.875rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="select"
        data-vibeui-block="select-008"
        data-invalid={invalid}
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={id}>
          {label}
        </label>
        <span data-part="field">
          <select
            id={id}
            value={value}
            aria-invalid={invalid}
            aria-describedby={`${id}-message`}
            onChange={(event) => setValue(event.target.value)}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span data-part="arrow" aria-hidden="true" />
        </span>
        {invalid ? (
          <p data-part="error" id={`${id}-message`} role="alert">
            <span data-part="sign" aria-hidden="true" />
            <span>{error}</span>
          </p>
        ) : (
          <p data-part="ok" id={`${id}-message`}>
            {hint}
          </p>
        )}
      </div>
    </>
  )
}

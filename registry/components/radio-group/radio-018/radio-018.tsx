"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Radio018Option = {
  value: string
  label: string
}

export type Radio018Props = Omit<
  ComponentProps<"form">,
  "children" | "onSubmit" | "defaultValue"
> & {
  legend?: string
  options?: Radio018Option[]
  name?: string
  error?: string
  hint?: string
  submitLabel?: string
  onSubmitValue?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: у радиогруппы нет выбранного варианта по умолчанию —
// вопрос обязателен, и угадывать ответ за пользователя неправильно. Ошибка
// живёт на группе целиком: рамка, знак «!» и текст появляются только после
// попытки отправить форму пустой, а не при каждом клике мимо кружка.
// Компонент — сам себе <form>, поэтому имя радиокнопок не конфликтует с
// другими блоками страницы.
//
// Тема берётся из color-scheme окружения через light-dark().
const STYLES = `
:where([data-vibeui-block="radio-018"]){
--vibeui-radio-018-bg:transparent;
--vibeui-radio-018-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-radio-018-muted:color-mix(in oklab,var(--vibeui-radio-018-fg) 68%,transparent);
--vibeui-radio-018-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-radio-018-accent:light-dark(oklch(0.55 0.19 262),oklch(0.75 0.16 262));
--vibeui-radio-018-danger:light-dark(oklch(0.55 0.2 25),oklch(0.7 0.17 25));
--vibeui-radio-018-danger-soft:light-dark(oklch(0.96 0.03 25),oklch(0.29 0.05 25));
--vibeui-radio-018-on-accent:oklch(0.99 0 265);
--vibeui-radio-018-on-danger:light-dark(oklch(0.99 0.01 25),oklch(0.21 0.04 25));
--vibeui-radio-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="radio-018"]{color-scheme:dark}
[data-vibeui-block="radio-018"]{
display:block;width:100%;max-width:21rem;box-sizing:border-box;
padding:0.9375rem;border:1px solid var(--vibeui-radio-018-border);border-radius:0.9375rem;
background:var(--vibeui-radio-018-bg);
font-family:var(--vibeui-radio-018-font);color:var(--vibeui-radio-018-fg);
}
[data-vibeui-block="radio-018"] fieldset{
display:flex;flex-direction:column;gap:0.125rem;
margin:0;padding:0.625rem;border:1.5px solid var(--vibeui-radio-018-border);border-radius:0.75rem;
transition:border-color .15s ease,background-color .15s ease;
}
/* Ошибка на группе, а не на кружке: требование «выберите один» относится
   ко всему набору. */
[data-vibeui-block="radio-018"] fieldset[data-invalid="true"]{
border-color:var(--vibeui-radio-018-danger);
background:var(--vibeui-radio-018-danger-soft);
}
[data-vibeui-block="radio-018"] legend{
float:left;width:100%;padding:0 0 0.375rem;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="radio-018"] label{
clear:both;display:flex;align-items:center;gap:0.625rem;
min-height:2rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="radio-018"] input{
appearance:none;-webkit-appearance:none;flex:none;margin:0;cursor:pointer;
width:1.125rem;height:1.125rem;border-radius:9999px;
border:1.5px solid var(--vibeui-radio-018-border);background:transparent;
transition:border-color .15s ease;
}
[data-vibeui-block="radio-018"] fieldset[data-invalid="true"] input{border-color:var(--vibeui-radio-018-danger)}
/* Точка нарисована фоном самого кружка, а не отдельным узлом. */
[data-vibeui-block="radio-018"] input:checked{
border-color:var(--vibeui-radio-018-accent);
background:radial-gradient(circle at 50% 50%,var(--vibeui-radio-018-accent) 0 0.25rem,transparent 0.25rem);
}
[data-vibeui-block="radio-018"] input:focus-visible{outline:2px solid var(--vibeui-radio-018-accent);outline-offset:2px}
[data-vibeui-block="radio-018"] [data-part="error"]{
display:flex;align-items:flex-start;gap:0.5rem;
margin:0.625rem 0 0;font-size:0.8125rem;line-height:1.4;color:var(--vibeui-radio-018-danger);
}
/* Знак «!» кружком: ошибка обязана читаться и в чёрно-белой печати,
   и при дальтонизме. */
[data-vibeui-block="radio-018"] [data-part="sign"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.125rem;height:1.125rem;margin-top:0.0625rem;border-radius:9999px;
background:var(--vibeui-radio-018-danger);color:var(--vibeui-radio-018-on-danger);
font-size:0.75rem;font-weight:800;line-height:1;
}
[data-vibeui-block="radio-018"] [data-part="fix"]{
display:block;margin-top:0.125rem;color:var(--vibeui-radio-018-muted);font-size:0.75rem;
}
[data-vibeui-block="radio-018"] button{
appearance:none;border:0;cursor:pointer;margin-top:0.75rem;
min-height:2.25rem;padding:0 0.875rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;font-weight:650;
background:var(--vibeui-radio-018-accent);color:var(--vibeui-radio-018-on-accent);
}
[data-vibeui-block="radio-018"] button:focus-visible{outline:2px solid var(--vibeui-radio-018-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="radio-018"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Radio018Option[] = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Телефон" },
  { value: "telegram", label: "Telegram" },
]

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
 * Радиогруппа с ошибкой на уровне набора: без выбранного варианта по
 * умолчанию, ошибка встаёт после попытки отправить форму. Один файл,
 * ноль зависимостей, собственная палитра.
 */
export function Radio018({
  legend = "Как с вами связаться",
  options = DEFAULT_OPTIONS,
  name = "vibeui-radio-018",
  error = "Выберите способ связи",
  hint = "Мы ответим тем способом, который вы укажете.",
  submitLabel = "Продолжить",
  onSubmitValue,
  background = "",
  accent,
  className,
  style,
  ...props
}: Radio018Props) {
  const [value, setValue] = useState("")
  const [attempted, setAttempted] = useState(false)
  const errorId = useId()

  const palette = {
    ...(accent ? { "--vibeui-radio-018-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-radio-018-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const invalid = attempted && value === ""

  return (
    <>
      <style href="vibeui-radio-018" precedence="medium">
        {STYLES}
      </style>
      <form
        {...props}
        data-slot="radio-group"
        data-vibeui-block="radio-018"
        className={className}
        style={palette}
        onSubmit={(event) => {
          event.preventDefault()
          setAttempted(true)

          if (value !== "") {
            onSubmitValue?.(value)
          }
        }}
      >
        <fieldset
          data-invalid={invalid}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? errorId : undefined}
        >
          <legend>{legend}</legend>
          {options.map((option) => (
            <label key={option.value}>
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => setValue(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>
        {invalid ? (
          <p data-part="error" id={errorId} role="alert">
            <span data-part="sign" aria-hidden="true">
              !
            </span>
            <span>
              {error}
              <span data-part="fix">{hint}</span>
            </span>
          </p>
        ) : null}
        <button type="submit">{submitLabel}</button>
      </form>
    </>
  )
}

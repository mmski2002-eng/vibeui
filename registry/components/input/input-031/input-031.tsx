"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Input031Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  placeholder?: string
  defaultValue?: string
  errorText?: string
  /** Скрытый текст у звёздочки: его читает скринридер вместо символа. */
  requiredText?: string
  onChange?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: звёздочка у подписи сообщает «обязательно» только
// глазами — для скринридера рядом лежит скрытый текст «обязательное поле».
// Ошибка не показывается на каждый символ: поле сначала должно потерять
// фокус пустым (человек ушёл, не заполнив), либо форма попытается
// отправиться — states «ещё не трогали» и «пусто после попытки» разные,
// иначе ошибка вспыхивает от одного клика в поле и обратно.
const STYLES = `
:where([data-vibeui-block="input-031"]){
--vibeui-input-031-surface:transparent;
--vibeui-input-031-shell:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-input-031-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-input-031-muted:color-mix(in oklab,var(--vibeui-input-031-fg) 68%,transparent);
--vibeui-input-031-field:light-dark(oklch(0.985 0 265),oklch(0.26 0 265));
--vibeui-input-031-border:light-dark(oklch(0.88 0 265),oklch(0.38 0 265));
--vibeui-input-031-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.72 0.15 39.8));
--vibeui-input-031-bad:light-dark(oklch(0.55 0.2 25),oklch(0.74 0.16 25));
--vibeui-input-031-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="input-031"]{color-scheme:dark}
[data-vibeui-block="input-031"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-031-surface);
border:1px solid var(--vibeui-input-031-shell);border-radius:0.875rem;
font-family:var(--vibeui-input-031-font);color:var(--vibeui-input-031-fg);
}
[data-vibeui-block="input-031"] *{box-sizing:border-box}
[data-vibeui-block="input-031"] [data-part="label-row"]{display:flex;align-items:baseline;gap:0.25rem}
[data-vibeui-block="input-031"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-031"] [data-part="star"]{color:var(--vibeui-input-031-bad);font-weight:700}
[data-vibeui-block="input-031"] [data-part="sr"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
clip:rect(0,0,0,0);white-space:nowrap;border:0;
}
[data-vibeui-block="input-031"] [data-part="frame"]{
display:flex;align-items:center;
height:2.5rem;padding:0 0.75rem;
background:var(--vibeui-input-031-field);
border:1px solid var(--vibeui-input-031-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-031"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-input-031-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-031-accent) 18%,transparent);
}
[data-vibeui-block="input-031"][data-invalid="1"] [data-part="frame"]{
border-color:var(--vibeui-input-031-bad);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-031-bad) 16%,transparent);
}
[data-vibeui-block="input-031"] input{
flex:1;min-width:0;height:100%;border:0;background:none;color:inherit;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="input-031"] input:focus{outline:none}
[data-vibeui-block="input-031"] [data-part="error"]{
margin:0;display:flex;align-items:center;gap:0.3125rem;
font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-031-bad);font-weight:600;
}
[data-vibeui-block="input-031"] [data-part="error"] svg{flex:none;width:0.875rem;height:0.875rem;display:block}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-031"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
 * Обязательное поле со звёздочкой у подписи и текстом ошибки под ним:
 * ошибка появляется после потери фокуса пустым полем, не на каждый символ.
 * Один файл, ноль зависимостей.
 */
export function Input031({
  label = "Имя получателя",
  placeholder = "Как к вам обращаться",
  defaultValue = "",
  errorText = "Это поле обязательно для заполнения.",
  requiredText = ", обязательное поле",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Input031Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [touched, setTouched] = useState(false)

  const palette = {
    ...(accent ? { "--vibeui-input-031-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-input-031-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const invalid = touched && value.trim().length === 0
  const errorId = `${id}-error`

  return (
    <>
      <style href="vibeui-input-031" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input"
        data-vibeui-block="input-031"
        data-invalid={invalid ? "1" : "0"}
        className={className}
        style={palette}
      >
        <div data-part="label-row">
          {/* Скрытый текст живёт внутри <label>: снаружи он не попал бы
              в доступное имя поля и звёздочка осталась бы без озвучки. */}
          <label htmlFor={id}>
            {label}
            <span data-part="sr">{requiredText}</span>
          </label>
          <span data-part="star" aria-hidden="true">
            *
          </span>
        </div>
        <span data-part="frame">
          <input
            id={id}
            type="text"
            required
            placeholder={placeholder}
            value={value}
            aria-invalid={invalid}
            aria-describedby={invalid ? errorId : undefined}
            onChange={(event) => {
              setValue(event.target.value)
              onChange?.(event.target.value)
            }}
            onBlur={() => setTouched(true)}
          />
        </span>
        {invalid ? (
          <p data-part="error" id={errorId} role="alert">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="6.25" />
              <path d="M8 5.25v3.5M8 11v.01" strokeLinecap="round" />
            </svg>
            {errorText}
          </p>
        ) : null}
      </div>
    </>
  )
}

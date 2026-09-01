"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Input031Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  placeholder?: string
  defaultValue?: string
  errorText?: string
  onChange?: (value: string) => void
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
--vibeui-input-031-surface:oklch(1 0 0);
--vibeui-input-031-shell:oklch(0.91 0.006 265);
--vibeui-input-031-fg:oklch(0.23 0.014 265);
--vibeui-input-031-muted:oklch(0.56 0.014 265);
--vibeui-input-031-field:oklch(0.985 0.002 265);
--vibeui-input-031-border:oklch(0.88 0.008 265);
--vibeui-input-031-accent:oklch(0.55 0.17 265);
--vibeui-input-031-bad:oklch(0.55 0.2 25);
--vibeui-input-031-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
 * Обязательное поле со звёздочкой у подписи и текстом ошибки под ним:
 * ошибка появляется после потери фокуса пустым полем, не на каждый символ.
 * Один файл, ноль зависимостей.
 */
export function Input031({
  label = "Имя получателя",
  placeholder = "Как к вам обращаться",
  defaultValue = "",
  errorText = "Это поле обязательно для заполнения.",
  onChange,
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
        data-vibeui-block="input-031"
        data-invalid={invalid ? "1" : "0"}
        className={className}
        style={palette}
      >
        <div data-part="label-row">
          <label htmlFor={id}>{label}</label>
          <span data-part="star" aria-hidden="true">
            *
          </span>
          <span data-part="sr">, обязательное поле</span>
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

"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Input003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  placeholder?: string
  hint?: string
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: пароль с показом и честной оценкой. Кнопка «показать» —
// не украшение: без неё длинный пароль набирают вслепую и ошибаются. Оценка
// считается по длине и разнообразию символов и подписана словом: полоска без
// подписи не отвечает, что именно исправить.
const STYLES = `
:where([data-vibeui-block="input-003"]){
--vibeui-input-003-bg:oklch(1 0 0);
--vibeui-input-003-fg:oklch(0.22 0.014 265);
--vibeui-input-003-muted:oklch(0.56 0.014 265);
--vibeui-input-003-border:oklch(0.9 0.006 265);
--vibeui-input-003-field:oklch(0.985 0.002 265);
--vibeui-input-003-track:oklch(0.92 0.005 265);
--vibeui-input-003-accent:oklch(0.55 0.17 265);
--vibeui-input-003-weak:oklch(0.58 0.19 25);
--vibeui-input-003-fair:oklch(0.72 0.16 75);
--vibeui-input-003-good:oklch(0.58 0.15 152);
--vibeui-input-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="input-003"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-003-bg);
border:1px solid var(--vibeui-input-003-border);border-radius:0.875rem;
font-family:var(--vibeui-input-003-font);color:var(--vibeui-input-003-fg);
}
[data-vibeui-block="input-003"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-003"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="input-003"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 5.75rem 0 0.75rem;
border:1px solid var(--vibeui-input-003-border);border-radius:0.625rem;
background:var(--vibeui-input-003-field);color:inherit;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="input-003"] input:focus-visible{
outline:2px solid var(--vibeui-input-003-accent);outline-offset:1px;border-color:transparent;
}
/* Кнопка показа: без неё длинный пароль набирают вслепую. */
[data-vibeui-block="input-003"] button{
position:absolute;right:0.375rem;top:50%;transform:translateY(-50%);
appearance:none;border:0;cursor:pointer;background:transparent;
padding:0 0.375rem;height:1.875rem;border-radius:0.4375rem;
color:var(--vibeui-input-003-muted);font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="input-003"] button:hover{color:var(--vibeui-input-003-fg)}
[data-vibeui-block="input-003"] button:focus-visible{outline:2px solid var(--vibeui-input-003-accent);outline-offset:1px}
[data-vibeui-block="input-003"] [data-part="meter"]{display:flex;gap:0.25rem}
[data-vibeui-block="input-003"] [data-part="bar"]{
flex:1;height:0.25rem;border-radius:9999px;background:var(--vibeui-input-003-track);
}
[data-vibeui-block="input-003"][data-score="1"] [data-part="bar"]:nth-child(-n+1){background:var(--vibeui-input-003-weak)}
[data-vibeui-block="input-003"][data-score="2"] [data-part="bar"]:nth-child(-n+2){background:var(--vibeui-input-003-fair)}
[data-vibeui-block="input-003"][data-score="3"] [data-part="bar"]:nth-child(-n+3){background:var(--vibeui-input-003-good)}
[data-vibeui-block="input-003"] [data-part="hint"]{font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-003-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-003"] *{animation:none!important;transition:none!important}}
`

const LEVELS = [
  "Пусто",
  "Слабый: добавьте длины",
  "Средний: добавьте цифры или знаки",
  "Хороший пароль",
]

// Оценка по длине и разнообразию: три ступени, потому что больше человек всё
// равно не различает, а «очень сильный» ничего не меняет в поведении.
function score(value: string) {
  if (!value) return 0
  const variety =
    Number(/[a-zа-я]/.test(value)) +
    Number(/[A-ZА-Я]/.test(value)) +
    Number(/\d/.test(value)) +
    Number(/[^\wа-яА-Я]/.test(value))
  if (value.length >= 12 && variety >= 3) return 3
  if (value.length >= 8 && variety >= 2) return 2
  return 1
}

/**
 * Пароль с показом и оценкой словами, а не только полоской.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Input003({
  label = "Пароль",
  placeholder = "Не короче восьми символов",
  hint,
  onChange,
  accent,
  className,
  style,
  ...props
}: Input003Props) {
  const id = useId()
  const [value, setValue] = useState("")
  const [shown, setShown] = useState(false)
  const level = score(value)

  const palette = {
    ...(accent ? { "--vibeui-input-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-input-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="input-003"
        data-score={level}
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <span data-part="field">
          <input
            id={id}
            type={shown ? "text" : "password"}
            placeholder={placeholder}
            value={value}
            autoComplete="new-password"
            aria-describedby={`${id}-hint`}
            onChange={(event) => {
              setValue(event.target.value)
              onChange?.(event.target.value)
            }}
          />
          <button
            type="button"
            aria-pressed={shown}
            aria-label={shown ? "Скрыть пароль" : "Показать пароль"}
            onClick={() => setShown(!shown)}
          >
            {shown ? "Скрыть" : "Показать"}
          </button>
        </span>
        <span data-part="meter" aria-hidden="true">
          <span data-part="bar" />
          <span data-part="bar" />
          <span data-part="bar" />
        </span>
        <span data-part="hint" id={`${id}-hint`}>
          {hint ?? LEVELS[level]}
        </span>
      </div>
    </>
  )
}

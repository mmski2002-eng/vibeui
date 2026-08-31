"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Radio008Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "defaultValue" | "onChange"
> & {
  legend?: string
  options?: string[]
  otherLabel?: string
  placeholder?: string
  name?: string
  defaultValue?: string
  accent?: string
}

// Идея компонента: вариант «другое» с полем ввода. Прятать поле совсем —
// плохо: человек не видит, что можно ответить своими словами. Поле стоит
// на месте всегда, но выключено, пока не выбран последний пункт; disabled
// не даёт отправить пустую строку и убирает поле из обхода по Tab.
const STYLES = `
:where([data-vibeui-block="radio-008"]){
--vibeui-radio-008-bg:oklch(1 0 0);
--vibeui-radio-008-fg:oklch(0.22 0.014 265);
--vibeui-radio-008-muted:oklch(0.56 0.014 265);
--vibeui-radio-008-border:oklch(0.9 0.006 265);
--vibeui-radio-008-ring:oklch(0.74 0.012 265);
--vibeui-radio-008-field:oklch(0.985 0.002 265);
--vibeui-radio-008-accent:oklch(0.55 0.19 300);
--vibeui-radio-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
width:1.0625rem;height:1.0625rem;border-radius:9999px;
border:1.5px solid var(--vibeui-radio-008-ring);
background:var(--vibeui-radio-008-bg);
}
[data-vibeui-block="radio-008"] input[type="radio"]:checked{
border-color:var(--vibeui-radio-008-accent);
box-shadow:inset 0 0 0 0.1875rem var(--vibeui-radio-008-bg),inset 0 0 0 1rem var(--vibeui-radio-008-accent);
}
[data-vibeui-block="radio-008"] input[type="radio"]:focus-visible{outline:2px solid var(--vibeui-radio-008-accent);outline-offset:2px}
/* Поле сдвинуто под подпись «другое» и всегда занимает место: исчезающее
   поле дёргает всю форму и прячет саму возможность ответить словами. */
[data-vibeui-block="radio-008"] [data-part="other-field"]{
margin-left:1.6875rem;margin-top:0.5rem;
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
 * Радиогруппа с вариантом «другое»: поле стоит всегда, включается по выбору.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Radio008({
  legend = "Откуда узнали о нас",
  options = DEFAULT_OPTIONS,
  otherLabel = "Другое",
  placeholder = "Расскажите своими словами",
  name = "vibeui-radio-008",
  defaultValue = "Через друзей",
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
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-radio-008" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
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
                aria-label={`${otherLabel}: свой вариант`}
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

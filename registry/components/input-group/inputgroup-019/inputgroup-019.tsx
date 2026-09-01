"use client"

import { useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup019Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  name?: string
  label?: string
  scopes?: string[]
  placeholder?: string
  onChange?: (value: string, scope: string) => void
  hint?: string
  accent?: string
}

const DEFAULT_SCOPES = ["Везде", "В названии", "В тексте"]

// Идея компонента: живой поиск без кнопки отправки — область поиска слева
// сужает список так же, как текст справа, и оба меняют один и тот же
// результат сразу по вводу, а не после отдельного нажатия «Найти». Кнопка
// очистки справа устроена как в «Icon And Clear»: появляется только вместе
// с текстом и возвращает фокус в поле после очистки.
const STYLES = `
:where([data-vibeui-block="inputgroup-019"]){
--vibeui-inputgroup-019-surface:oklch(1 0 0);
--vibeui-inputgroup-019-shell:oklch(0.91 0.006 265);
--vibeui-inputgroup-019-fg:oklch(0.22 0.014 265);
--vibeui-inputgroup-019-muted:oklch(0.55 0.014 265);
--vibeui-inputgroup-019-field:oklch(0.99 0.002 265);
--vibeui-inputgroup-019-fixed:oklch(0.96 0.004 265);
--vibeui-inputgroup-019-border:oklch(0.86 0.008 265);
--vibeui-inputgroup-019-accent:oklch(0.56 0.11 190);
--vibeui-inputgroup-019-radius:0.75rem;
--vibeui-inputgroup-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="inputgroup-019"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-019-surface);
border:1px solid var(--vibeui-inputgroup-019-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-019-font);color:var(--vibeui-inputgroup-019-fg);
}
[data-vibeui-block="inputgroup-019"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-019"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-019"] [data-part="group"]{display:flex;align-items:stretch;min-width:0}
[data-vibeui-block="inputgroup-019"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-019-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-019"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-019-radius) 0 0 var(--vibeui-inputgroup-019-radius);
}
[data-vibeui-block="inputgroup-019"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-019-radius) var(--vibeui-inputgroup-019-radius) 0;
}
[data-vibeui-block="inputgroup-019"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-019"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-019-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-019-accent);
}
[data-vibeui-block="inputgroup-019"] select{
appearance:none;flex:none;cursor:pointer;width:9ch;
padding:0 1.375rem 0 0.75rem;
background:var(--vibeui-inputgroup-019-fixed);
font-size:0.8125rem;font-weight:600;color:var(--vibeui-inputgroup-019-muted);
background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);
background-position:calc(100% - 0.85rem) 50%,calc(100% - 0.55rem) 50%;
background-size:0.3rem 0.3rem,0.3rem 0.3rem;
background-repeat:no-repeat;
}
[data-vibeui-block="inputgroup-019"] select:focus{color:var(--vibeui-inputgroup-019-fg)}
[data-vibeui-block="inputgroup-019"] input{
flex:1;min-width:0;padding:0 0.75rem;
background:var(--vibeui-inputgroup-019-field);font-size:0.875rem;
}
[data-vibeui-block="inputgroup-019"] input::-webkit-search-cancel-button{display:none}
[data-vibeui-block="inputgroup-019"] [data-part="clear"]{
appearance:none;flex:none;cursor:pointer;width:2.75rem;
display:grid;place-items:center;
background:var(--vibeui-inputgroup-019-fixed);color:var(--vibeui-inputgroup-019-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="inputgroup-019"] [data-part="clear"]:hover{
background:color-mix(in oklab,var(--vibeui-inputgroup-019-accent) 14%,var(--vibeui-inputgroup-019-fixed));
color:var(--vibeui-inputgroup-019-fg);
}
[data-vibeui-block="inputgroup-019"] [data-part="clear"] svg{width:0.875rem;height:0.875rem;display:block}
[data-vibeui-block="inputgroup-019"] [data-part="status"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-019-muted);
}
[data-vibeui-block="inputgroup-019"] [data-part="status"] b{
font-weight:650;color:var(--vibeui-inputgroup-019-accent);
}
[data-vibeui-block="inputgroup-019"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-019-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-019"] *{animation:none!important;transition:none!important}}
`

/**
 * Сцепка «область поиска + запрос + очистка»: слева нативный select с
 * областью, справа поле с живым поиском без кнопки отправки, кнопка
 * очистки появляется только вместе с текстом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup019({
  name = "search",
  label = "Поиск по каталогу",
  scopes = DEFAULT_SCOPES,
  placeholder = "Введите запрос",
  onChange,
  hint = "Область слева и текст справа сужают один и тот же список без отдельной кнопки — результат меняется по мере ввода.",
  accent,
  className,
  style,
  ...props
}: Inputgroup019Props) {
  const id = useId()
  const field = useRef<HTMLInputElement | null>(null)
  const [scope, setScope] = useState(scopes[0] ?? "Везде")
  const [query, setQuery] = useState("")

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-019-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-inputgroup-019" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="inputgroup-019"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <select
            data-part="scope"
            name={`${name}-scope`}
            aria-label="Область поиска"
            value={scope}
            onChange={(event) => {
              setScope(event.target.value)
              onChange?.(query, event.target.value)
            }}
          >
            {scopes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            ref={field}
            id={id}
            name={name}
            type="search"
            placeholder={placeholder}
            autoComplete="off"
            value={query}
            aria-describedby={`${id}-status ${id}-hint`}
            onChange={(event) => {
              setQuery(event.target.value)
              onChange?.(event.target.value, scope)
            }}
          />
          {query ? (
            <button
              type="button"
              data-part="clear"
              aria-label="Очистить поле"
              onClick={() => {
                setQuery("")
                onChange?.("", scope)
                field.current?.focus()
              }}
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="m4 4 8 8M12 4l-8 8" strokeLinecap="round" />
              </svg>
            </button>
          ) : null}
        </div>
        <p data-part="status" id={`${id}-status`} aria-live="polite">
          {query ? (
            <>
              Ищем «{query}»: <b>{scope.toLowerCase()}</b>
            </>
          ) : (
            "Начните вводить запрос"
          )}
        </p>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}

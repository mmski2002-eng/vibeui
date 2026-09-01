"use client"

import { useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  placeholder?: string
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: слева значок-приставка, справа кнопка очистки, и обе
// половины сцеплены с полем одной рамкой. Значок не кнопка — по нему нечего
// нажимать, поэтому это span с aria-hidden. Кнопка очистки появляется только
// когда есть что очищать, и её место заранее не резервируется: пустое поле не
// должно выглядеть как поле с выключенной кнопкой. После очистки фокус
// возвращается в поле — иначе он повисает на исчезнувшей кнопке.
const STYLES = `
:where([data-vibeui-block="inputgroup-007"]){
--vibeui-inputgroup-007-surface:oklch(1 0 0);
--vibeui-inputgroup-007-shell:oklch(0.91 0.006 265);
--vibeui-inputgroup-007-fg:oklch(0.23 0.014 265);
--vibeui-inputgroup-007-muted:oklch(0.55 0.014 265);
--vibeui-inputgroup-007-field:oklch(0.99 0.002 265);
--vibeui-inputgroup-007-fixed:oklch(0.96 0.004 265);
--vibeui-inputgroup-007-border:oklch(0.86 0.008 265);
--vibeui-inputgroup-007-accent:oklch(0.52 0.17 320);
--vibeui-inputgroup-007-radius:0.75rem;
--vibeui-inputgroup-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="inputgroup-007"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-007-surface);
border:1px solid var(--vibeui-inputgroup-007-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-007-font);color:var(--vibeui-inputgroup-007-fg);
}
[data-vibeui-block="inputgroup-007"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-007"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-007"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-007"] [data-part="group"] > *{
position:relative;height:2.625rem;
border:1px solid var(--vibeui-inputgroup-007-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-007"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-007-radius) 0 0 var(--vibeui-inputgroup-007-radius);
}
[data-vibeui-block="inputgroup-007"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-007-radius) var(--vibeui-inputgroup-007-radius) 0;
}
[data-vibeui-block="inputgroup-007"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-007"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-007-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-007-accent);
}
/* Приставка со значком — не мишень: ни курсора, ни фокуса. */
[data-vibeui-block="inputgroup-007"] [data-part="icon"]{
flex:none;display:grid;place-items:center;width:2.5rem;
background:var(--vibeui-inputgroup-007-fixed);
color:var(--vibeui-inputgroup-007-muted);
}
[data-vibeui-block="inputgroup-007"] [data-part="icon"] svg{width:1rem;height:1rem;display:block}
[data-vibeui-block="inputgroup-007"] input{
flex:1;min-width:0;padding:0 0.75rem;font-size:0.875rem;
background:var(--vibeui-inputgroup-007-field);
}
[data-vibeui-block="inputgroup-007"] [data-part="clear"]{
appearance:none;flex:none;cursor:pointer;width:2.5rem;
display:grid;place-items:center;
background:var(--vibeui-inputgroup-007-fixed);
color:var(--vibeui-inputgroup-007-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="inputgroup-007"] [data-part="clear"]:hover{
background:color-mix(in oklab,var(--vibeui-inputgroup-007-accent) 14%,var(--vibeui-inputgroup-007-fixed));
color:var(--vibeui-inputgroup-007-fg);
}
[data-vibeui-block="inputgroup-007"] [data-part="clear"] svg{width:0.875rem;height:0.875rem;display:block}
[data-vibeui-block="inputgroup-007"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-007-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-007"] *{animation:none!important;transition:none!important}}
`

/**
 * Сцепка со значком слева и кнопкой очистки справа: кнопка есть, только если есть что стирать.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup007({
  label = "Кодовое слово поддержки",
  placeholder = "Слово из письма",
  onChange,
  accent,
  className,
  style,
  ...props
}: Inputgroup007Props) {
  const id = useId()
  const field = useRef<HTMLInputElement | null>(null)
  const [value, setValue] = useState("вьюга-77")

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  const push = (next: string) => {
    setValue(next)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-inputgroup-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="inputgroup-007"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <span data-part="icon" aria-hidden="true">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="2.5" y="7" width="11" height="7" rx="1.75" />
              <path d="M5 7V5a3 3 0 0 1 6 0v2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            ref={field}
            id={id}
            type="text"
            autoComplete="off"
            placeholder={placeholder}
            value={value}
            aria-describedby={`${id}-hint`}
            onChange={(event) => push(event.target.value)}
          />
          {value ? (
            <button
              type="button"
              data-part="clear"
              aria-label="Очистить поле"
              onClick={() => {
                push("")
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
        <p data-part="hint" id={`${id}-hint`}>
          Кнопка очистки появляется вместе с текстом и уходит вместе с ним.
        </p>
      </div>
    </>
  )
}

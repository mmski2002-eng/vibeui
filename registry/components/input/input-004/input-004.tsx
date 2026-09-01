"use client"

import { useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Input004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  placeholder?: string
  shortcut?: string
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: поле поиска с очисткой и подсказкой горячей клавиши.
// Крестик появляется только когда есть что стирать: постоянная кнопка сбивает
// с толку в пустом поле. После очистки фокус возвращается в поле — иначе
// человек остаётся с пустым полем и без курсора.
const STYLES = `
:where([data-vibeui-block="input-004"]){
--vibeui-input-004-bg:oklch(1 0 0);
--vibeui-input-004-fg:oklch(0.22 0.014 265);
--vibeui-input-004-muted:oklch(0.56 0.014 265);
--vibeui-input-004-border:oklch(0.9 0.006 265);
--vibeui-input-004-field:oklch(0.985 0.002 265);
--vibeui-input-004-accent:oklch(0.55 0.17 265);
--vibeui-input-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="input-004"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-004-bg);
border:1px solid var(--vibeui-input-004-border);border-radius:0.875rem;
font-family:var(--vibeui-input-004-font);color:var(--vibeui-input-004-fg);
}
[data-vibeui-block="input-004"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-004"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="input-004"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 4.5rem 0 2.25rem;
border:1px solid var(--vibeui-input-004-border);border-radius:0.625rem;
background:var(--vibeui-input-004-field);color:inherit;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="input-004"] input::-webkit-search-cancel-button{display:none}
[data-vibeui-block="input-004"] input:focus-visible{
outline:2px solid var(--vibeui-input-004-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="input-004"] [data-part="glass"]{
position:absolute;left:0.75rem;top:50%;width:0.75rem;height:0.75rem;
margin-top:-0.4375rem;pointer-events:none;
border:1.5px solid var(--vibeui-input-004-muted);border-radius:9999px;
}
[data-vibeui-block="input-004"] [data-part="glass"]::after{
content:"";position:absolute;right:-0.3125rem;bottom:-0.1875rem;
width:0.375rem;height:1.5px;background:var(--vibeui-input-004-muted);transform:rotate(45deg);
}
/* Крестик только при непустом поле: в пустом он сбивает с толку. */
[data-vibeui-block="input-004"] [data-part="clear"]{
position:absolute;right:2.375rem;top:50%;transform:translateY(-50%);
appearance:none;border:0;cursor:pointer;background:transparent;
display:flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;padding:0;border-radius:9999px;
color:var(--vibeui-input-004-muted);
}
[data-vibeui-block="input-004"] [data-part="clear"]:hover{background:oklch(0.94 0.005 265);color:var(--vibeui-input-004-fg)}
[data-vibeui-block="input-004"] [data-part="clear"]:focus-visible{outline:2px solid var(--vibeui-input-004-accent);outline-offset:1px}
[data-vibeui-block="input-004"] [data-part="cross"]{position:relative;width:0.5rem;height:0.5rem}
[data-vibeui-block="input-004"] [data-part="cross"]::before,
[data-vibeui-block="input-004"] [data-part="cross"]::after{
content:"";position:absolute;left:0;top:50%;width:100%;height:1.5px;
margin-top:-0.75px;background:currentColor;border-radius:9999px;
}
[data-vibeui-block="input-004"] [data-part="cross"]::before{transform:rotate(45deg)}
[data-vibeui-block="input-004"] [data-part="cross"]::after{transform:rotate(-45deg)}
[data-vibeui-block="input-004"] kbd{
position:absolute;right:0.5rem;top:50%;transform:translateY(-50%);pointer-events:none;
padding:0.125rem 0.375rem;border-radius:0.3125rem;
border:1px solid var(--vibeui-input-004-border);
font-family:inherit;font-size:0.6875rem;color:var(--vibeui-input-004-muted);
}
[data-vibeui-block="input-004"] [data-part="status"]{font-size:0.75rem;color:var(--vibeui-input-004-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-004"] *{animation:none!important;transition:none!important}}
`

/**
 * Поле поиска: крестик появляется с текстом, фокус возвращается после очистки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Input004({
  label = "Поиск по каталогу",
  placeholder = "Название или категория",
  shortcut = "/",
  onChange,
  accent,
  className,
  style,
  ...props
}: Input004Props) {
  const id = useId()
  const field = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState("кнопка")

  const palette = {
    ...(accent ? { "--vibeui-input-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  const update = (next: string) => {
    setValue(next)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-input-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="input-004"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <span data-part="field">
          <span data-part="glass" aria-hidden="true" />
          <input
            ref={field}
            id={id}
            type="search"
            placeholder={placeholder}
            value={value}
            autoComplete="off"
            onChange={(event) => update(event.target.value)}
          />
          {value ? (
            <button
              type="button"
              data-part="clear"
              aria-label="Очистить поиск"
              onClick={() => {
                update("")
                // Фокус обратно в поле: иначе человек остаётся без курсора.
                field.current?.focus()
              }}
            >
              <span data-part="cross" aria-hidden="true" />
            </button>
          ) : null}
          {shortcut ? <kbd>{shortcut}</kbd> : null}
        </span>
        <span data-part="status" role="status">
          {value ? `Ищем: ${value}` : "Начните вводить запрос"}
        </span>
      </div>
    </>
  )
}

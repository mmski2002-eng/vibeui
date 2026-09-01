"use client"

import { useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup012Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  placeholder?: string
  onChange?: (value: string) => void
  onFilterChange?: (active: boolean) => void
  accent?: string
}

// Идея компонента: слева не значок, а настоящая кнопка-переключатель фильтра
// — по ней можно нажать, у неё есть состояние aria-pressed и свой цвет во
// включённом виде. Справа — кнопка очистки текста, она устроена как в
// «Icon And Clear»: появляется только при непустом значении и возвращает
// фокус в поле. Обе кнопки независимы друг от друга: очистка текста не
// трогает фильтр, а переключение фильтра не трогает текст.
const STYLES = `
:where([data-vibeui-block="inputgroup-012"]){
--vibeui-inputgroup-012-surface:oklch(1 0 0);
--vibeui-inputgroup-012-shell:oklch(0.91 0.006 265);
--vibeui-inputgroup-012-fg:oklch(0.23 0.014 265);
--vibeui-inputgroup-012-muted:oklch(0.55 0.014 265);
--vibeui-inputgroup-012-field:oklch(0.99 0.002 265);
--vibeui-inputgroup-012-fixed:oklch(0.96 0.004 265);
--vibeui-inputgroup-012-border:oklch(0.86 0.008 265);
--vibeui-inputgroup-012-accent:oklch(0.53 0.18 255);
--vibeui-inputgroup-012-radius:0.75rem;
--vibeui-inputgroup-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="inputgroup-012"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-012-surface);
border:1px solid var(--vibeui-inputgroup-012-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-012-font);color:var(--vibeui-inputgroup-012-fg);
}
[data-vibeui-block="inputgroup-012"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-012"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-012"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-012"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-012-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-012"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-012-radius) 0 0 var(--vibeui-inputgroup-012-radius);
}
[data-vibeui-block="inputgroup-012"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-012-radius) var(--vibeui-inputgroup-012-radius) 0;
}
[data-vibeui-block="inputgroup-012"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-012"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-012-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-012-accent);
}
[data-vibeui-block="inputgroup-012"] [data-part="filter"]{
appearance:none;flex:none;cursor:pointer;width:2.75rem;
display:grid;place-items:center;
background:var(--vibeui-inputgroup-012-fixed);
color:var(--vibeui-inputgroup-012-muted);
transition:background-color .16s ease,color .16s ease;
}
/* Включённый фильтр красится акцентом — состояние видно без чтения aria. */
[data-vibeui-block="inputgroup-012"] [data-part="filter"][aria-pressed="true"]{
background:var(--vibeui-inputgroup-012-accent);
color:oklch(1 0 0);
}
[data-vibeui-block="inputgroup-012"] [data-part="filter"]:hover:not([aria-pressed="true"]){
background:color-mix(in oklab,var(--vibeui-inputgroup-012-accent) 14%,var(--vibeui-inputgroup-012-fixed));
color:var(--vibeui-inputgroup-012-fg);
}
[data-vibeui-block="inputgroup-012"] [data-part="filter"] svg{width:0.9375rem;height:0.9375rem;display:block}
[data-vibeui-block="inputgroup-012"] input{
flex:1;min-width:0;padding:0 0.75rem;font-size:0.875rem;
background:var(--vibeui-inputgroup-012-field);
}
[data-vibeui-block="inputgroup-012"] [data-part="clear"]{
appearance:none;flex:none;cursor:pointer;width:2.75rem;
display:grid;place-items:center;
background:var(--vibeui-inputgroup-012-fixed);
color:var(--vibeui-inputgroup-012-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="inputgroup-012"] [data-part="clear"]:hover{
background:color-mix(in oklab,var(--vibeui-inputgroup-012-accent) 14%,var(--vibeui-inputgroup-012-fixed));
color:var(--vibeui-inputgroup-012-fg);
}
[data-vibeui-block="inputgroup-012"] [data-part="clear"] svg{width:0.875rem;height:0.875rem;display:block}
[data-vibeui-block="inputgroup-012"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-012-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-012"] *{animation:none!important;transition:none!important}}
`

/**
 * Сцепка «фильтр + поиск + очистка»: слева переключатель с aria-pressed, справа
 * кнопка очистки, которая появляется только вместе с текстом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup012({
  label = "Поиск по заказам",
  placeholder = "Номер заказа или имя",
  onChange,
  onFilterChange,
  accent,
  className,
  style,
  ...props
}: Inputgroup012Props) {
  const id = useId()
  const field = useRef<HTMLInputElement | null>(null)
  const [value, setValue] = useState("")
  const [filterActive, setFilterActive] = useState(false)

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  const push = (next: string) => {
    setValue(next)
    onChange?.(next)
  }

  const toggleFilter = () => {
    const next = !filterActive
    setFilterActive(next)
    onFilterChange?.(next)
  }

  return (
    <>
      <style href="vibeui-inputgroup-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="inputgroup-012"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <button
            type="button"
            data-part="filter"
            aria-pressed={filterActive}
            aria-label={
              filterActive
                ? "Только незавершённые: включено"
                : "Только незавершённые"
            }
            onClick={toggleFilter}
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path
                d="M2.5 3h11l-4 5v4.5l-3 1.5V8L2.5 3Z"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <input
            ref={field}
            id={id}
            type="search"
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
          Фильтр слева ограничивает список отдельно от текста запроса.
        </p>
      </div>
    </>
  )
}

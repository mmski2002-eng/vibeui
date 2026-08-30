"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Textarea002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  placeholder?: string
  limit?: number
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: поле с ограничением, которое не обрезает текст молча.
// maxlength не стоит: он не даёт дописать даже пробел и не объясняет, почему
// клавиатура перестала работать. Вместо этого счётчик краснеет, а лишнее
// подсвечивается — человек сам решает, что сократить.
const STYLES = `
:where([data-vibeui-block="textarea-002"]){
--vibeui-textarea-002-bg:oklch(1 0 0);
--vibeui-textarea-002-fg:oklch(0.22 0.014 265);
--vibeui-textarea-002-muted:oklch(0.56 0.014 265);
--vibeui-textarea-002-border:oklch(0.9 0.006 265);
--vibeui-textarea-002-field:oklch(0.985 0.002 265);
--vibeui-textarea-002-accent:oklch(0.55 0.17 265);
--vibeui-textarea-002-danger:oklch(0.56 0.19 25);
--vibeui-textarea-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="textarea-002"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-textarea-002-bg);
border:1px solid var(--vibeui-textarea-002-border);border-radius:0.875rem;
font-family:var(--vibeui-textarea-002-font);color:var(--vibeui-textarea-002-fg);
}
[data-vibeui-block="textarea-002"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="textarea-002"] textarea{
box-sizing:border-box;width:100%;min-height:5.5rem;resize:vertical;
padding:0.5rem 0.75rem;
border:1px solid var(--vibeui-textarea-002-border);border-radius:0.625rem;
background:var(--vibeui-textarea-002-field);color:inherit;
font:inherit;font-size:0.875rem;line-height:1.5;
}
[data-vibeui-block="textarea-002"] textarea:focus-visible{
outline:2px solid var(--vibeui-textarea-002-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="textarea-002"][data-over="true"] textarea{border-color:var(--vibeui-textarea-002-danger)}
[data-vibeui-block="textarea-002"] [data-part="foot"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
font-size:0.75rem;color:var(--vibeui-textarea-002-muted);
}
/* Счётчик краснеет, но текст не обрезается: сокращать решает человек. */
[data-vibeui-block="textarea-002"] [data-part="count"]{font-variant-numeric:tabular-nums}
[data-vibeui-block="textarea-002"][data-over="true"] [data-part="count"]{color:var(--vibeui-textarea-002-danger);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="textarea-002"] *{animation:none!important;transition:none!important}}
`

/**
 * Поле с ограничением: счётчик краснеет, но текст не обрезается молча.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Textarea002({
  label = "Описание компонента",
  placeholder = "Что делает компонент и в чём его идея",
  limit = 180,
  onChange,
  accent,
  className,
  style,
  ...props
}: Textarea002Props) {
  const id = useId()
  const [value, setValue] = useState(
    "Карточка товара с квадратным кадром: кнопка «в корзину» — отдельная цель поверх ссылки.",
  )
  const over = value.length > limit

  const palette = {
    ...(accent ? { "--vibeui-textarea-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-textarea-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="textarea-002"
        data-over={over}
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <textarea
          id={id}
          placeholder={placeholder}
          value={value}
          aria-describedby={`${id}-count`}
          aria-invalid={over}
          onChange={(event) => {
            setValue(event.target.value)
            onChange?.(event.target.value)
          }}
        />
        <p data-part="foot">
          <span>
            {over ? "Слишком длинно — сократите" : "Коротко и по делу"}
          </span>
          <span data-part="count" id={`${id}-count`} role="status">
            {value.length} / {limit}
          </span>
        </p>
      </div>
    </>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Checkbox011Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onChange" | "title"
> & {
  title?: string
  items?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  accent?: string
}

// Идея компонента: «выбрать всё» вынесено в отдельную панель над списком —
// с промежуточным состоянием, числом выбранного и инверсией выбора. В отличие
// от родительской строки внутри списка, панель не притворяется таким же
// пунктом, как элементы под ней, и её нельзя выбрать по ошибке.
const STYLES = `
:where([data-vibeui-block="checkbox-011"]){
--vibeui-checkbox-011-bg:oklch(1 0 0);
--vibeui-checkbox-011-fg:oklch(0.22 0.014 265);
--vibeui-checkbox-011-muted:oklch(0.55 0.014 265);
--vibeui-checkbox-011-border:oklch(0.9 0.006 265);
--vibeui-checkbox-011-bar:oklch(0.97 0.004 265);
--vibeui-checkbox-011-hover:oklch(0.98 0.003 265);
--vibeui-checkbox-011-accent:oklch(0.55 0.17 285);
--vibeui-checkbox-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="checkbox-011"]{
display:block;width:100%;max-width:23rem;box-sizing:border-box;overflow:hidden;
border:1px solid var(--vibeui-checkbox-011-border);border-radius:0.875rem;
background:var(--vibeui-checkbox-011-bg);
font-family:var(--vibeui-checkbox-011-font);color:var(--vibeui-checkbox-011-fg);
}
[data-vibeui-block="checkbox-011"] [data-part="bar"]{
display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;
padding:0.5rem 0.75rem;
background:var(--vibeui-checkbox-011-bar);
border-bottom:1px solid var(--vibeui-checkbox-011-border);
}
[data-vibeui-block="checkbox-011"] [data-part="all"]{
display:flex;align-items:center;gap:0.5rem;
font-size:0.8125rem;font-weight:650;cursor:pointer;
}
[data-vibeui-block="checkbox-011"] [data-part="count"]{
margin-left:auto;font-size:0.75rem;color:var(--vibeui-checkbox-011-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="checkbox-011"] button{
appearance:none;border:0;background:transparent;padding:0;cursor:pointer;
font:inherit;font-size:0.75rem;font-weight:650;color:var(--vibeui-checkbox-011-accent);
}
[data-vibeui-block="checkbox-011"] button:focus-visible{outline:2px solid var(--vibeui-checkbox-011-accent);outline-offset:2px;border-radius:0.25rem}
[data-vibeui-block="checkbox-011"] ul{margin:0;padding:0.25rem 0;list-style:none}
[data-vibeui-block="checkbox-011"] li label{
display:flex;align-items:center;gap:0.625rem;
padding:0.4375rem 0.75rem;font-size:0.875rem;cursor:pointer;
transition:background-color .15s ease;
}
[data-vibeui-block="checkbox-011"] li label:hover{background:var(--vibeui-checkbox-011-hover)}
[data-vibeui-block="checkbox-011"] input{
appearance:none;position:relative;flex:none;cursor:pointer;
width:1.0625rem;height:1.0625rem;margin:0;box-sizing:border-box;
border:1.5px solid var(--vibeui-checkbox-011-border);border-radius:0.3125rem;
background:var(--vibeui-checkbox-011-bg);
transition:background-color .15s ease,border-color .15s ease;
}
[data-vibeui-block="checkbox-011"] input:checked,
[data-vibeui-block="checkbox-011"] input:indeterminate{
border-color:transparent;background:var(--vibeui-checkbox-011-accent);
}
[data-vibeui-block="checkbox-011"] input:checked::after{
content:"";position:absolute;left:50%;top:50%;
width:0.25rem;height:0.4375rem;margin:-0.3125rem 0 0 -0.125rem;
border-right:2px solid oklch(0.99 0.01 285);border-bottom:2px solid oklch(0.99 0.01 285);
transform:rotate(45deg);
}
/* Промежуточное состояние — черта, а не бледная галка: форма читается без
   цвета, и скринридер объявляет «mixed» сам. */
[data-vibeui-block="checkbox-011"] input:indeterminate::after{
content:"";position:absolute;left:50%;top:50%;
width:0.5rem;height:2px;margin:-1px 0 0 -0.25rem;border-radius:1px;
background:oklch(0.99 0.01 285);
}
[data-vibeui-block="checkbox-011"] input:focus-visible{outline:2px solid var(--vibeui-checkbox-011-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS = [
  "Счёт за март",
  "Счёт за апрель",
  "Счёт за май",
  "Счёт за июнь",
  "Счёт за июль",
]

/**
 * Панель «выбрать всё» с промежуточным состоянием и инверсией выбора.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Checkbox011({
  title = "Документы",
  items = DEFAULT_ITEMS,
  defaultValue = ["Счёт за март"],
  onChange,
  accent,
  className,
  style,
  ...props
}: Checkbox011Props) {
  const [value, setValue] = useState<string[]>(defaultValue)
  const allRef = useRef<HTMLInputElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-checkbox-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  const all = value.length === items.length && items.length > 0
  const some = value.length > 0 && !all

  // indeterminate — свойство DOM, атрибутом его не задать.
  useEffect(() => {
    if (allRef.current) {
      allRef.current.indeterminate = some
    }
  }, [some])

  const update = (next: string[]) => {
    setValue(next)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-checkbox-011" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="checkbox-011"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="bar">
          <label data-part="all">
            <input
              ref={allRef}
              type="checkbox"
              checked={all}
              onChange={() => update(all ? [] : [...items])}
            />
            Выбрать все на странице
          </label>
          <button
            type="button"
            onClick={() =>
              update(items.filter((item) => !value.includes(item)))
            }
          >
            Инвертировать
          </button>
          <span data-part="count" role="status">
            {value.length} из {items.length}
          </span>
        </div>
        <ul>
          {items.map((item) => (
            <li key={item}>
              <label>
                <input
                  type="checkbox"
                  checked={value.includes(item)}
                  onChange={() =>
                    update(
                      value.includes(item)
                        ? value.filter((entry) => entry !== item)
                        : [...value, item],
                    )
                  }
                />
                <span>{item}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

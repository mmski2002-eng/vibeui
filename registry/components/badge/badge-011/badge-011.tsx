"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Badge011Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  options?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  accent?: string
}

// Идея компонента: плашки-фильтры, которые можно нажимать. Они объявлены
// кнопками с aria-pressed, а не ссылками: состояние переключается на месте и
// адрес страницы не меняется. Выбранная плашка отличается не только цветом —
// у неё галочка, иначе выбор не виден при дальтонизме.
const STYLES = `
:where([data-vibeui-block="badge-011"]){
--vibeui-badge-011-bg:oklch(0.97 0.003 265);
--vibeui-badge-011-fg:oklch(0.32 0.014 265);
--vibeui-badge-011-border:oklch(0.89 0.006 265);
--vibeui-badge-011-accent:oklch(0.55 0.17 265);
--vibeui-badge-011-on-bg:color-mix(in oklab,var(--vibeui-badge-011-accent) 14%,oklch(1 0 0));
--vibeui-badge-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="badge-011"]{
display:flex;flex-wrap:wrap;gap:0.375rem;
font-family:var(--vibeui-badge-011-font);
}
[data-vibeui-block="badge-011"] button{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.375rem;
height:1.75rem;padding:0 0.6875rem;
border:1px solid var(--vibeui-badge-011-border);border-radius:9999px;
background:var(--vibeui-badge-011-bg);color:var(--vibeui-badge-011-fg);
font:inherit;font-size:0.75rem;font-weight:500;line-height:1;
}
[data-vibeui-block="badge-011"] button:hover{border-color:oklch(0.82 0.008 265)}
[data-vibeui-block="badge-011"] button:focus-visible{outline:2px solid var(--vibeui-badge-011-accent);outline-offset:1px}
/* Выбранная плашка отличается галочкой, а не только цветом. */
[data-vibeui-block="badge-011"] button[aria-pressed="true"]{
background:var(--vibeui-badge-011-on-bg);
border-color:color-mix(in oklab,var(--vibeui-badge-011-accent) 45%,oklch(1 0 0));
color:color-mix(in oklab,var(--vibeui-badge-011-accent) 75%,oklch(0.2 0.02 265));
font-weight:600;
}
[data-vibeui-block="badge-011"] [data-part="tick"]{
width:0.3125rem;height:0.5rem;margin-top:-0.125rem;flex:none;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = ["Все", "Открытые", "Мои", "Срочные", "В архиве"]

/**
 * Плашки-фильтры: кнопки с aria-pressed и галочкой у выбранной.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge011({
  options = DEFAULT_OPTIONS,
  defaultValue = ["Открытые"],
  onChange,
  accent,
  className,
  style,
  ...props
}: Badge011Props) {
  const [value, setValue] = useState<string[]>(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-badge-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  const toggle = (option: string) => {
    const next = value.includes(option)
      ? value.filter((item) => item !== option)
      : [...value, option]
    setValue(next)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-badge-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="badge-011"
        className={className}
        style={palette}
      >
        {options.map((option) => {
          const on = value.includes(option)

          return (
            <button
              key={option}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(option)}
            >
              {on ? <span data-part="tick" aria-hidden="true" /> : null}
              {option}
            </button>
          )
        })}
      </div>
    </>
  )
}

"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Togglegroup005Size = {
  id: string
  available?: boolean
}

export type Togglegroup005Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onChange"
> & {
  label?: string
  defaultValue?: string
  sizes?: Togglegroup005Size[]
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: выбор размера одиночным toggle-выбором, где закончившиеся
// размеры остаются в ряду. Они помечены aria-disabled, а не disabled: такой
// пункт остаётся доступен с клавиатуры и может объяснить, почему не работает,
// — исчезнувший размер читался бы как несуществующий.
const STYLES = `
:where([data-vibeui-block="togglegroup-005"]){
--vibeui-togglegroup-005-bg:oklch(1 0 0);
--vibeui-togglegroup-005-fg:oklch(0.2 0.014 265);
--vibeui-togglegroup-005-muted:oklch(0.58 0.014 265);
--vibeui-togglegroup-005-border:oklch(0.88 0.006 265);
--vibeui-togglegroup-005-surface:oklch(0.97 0.004 265);
--vibeui-togglegroup-005-accent:oklch(0.28 0.02 265);
--vibeui-togglegroup-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="togglegroup-005"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:22rem;padding:0.875rem;
border:1px solid var(--vibeui-togglegroup-005-border);border-radius:0.875rem;
background:var(--vibeui-togglegroup-005-bg);color:var(--vibeui-togglegroup-005-fg);
font-family:var(--vibeui-togglegroup-005-font);
}
[data-vibeui-block="togglegroup-005"] *{box-sizing:border-box}
[data-vibeui-block="togglegroup-005"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="togglegroup-005"] h3{margin:0;font-size:0.8125rem;font-weight:650;letter-spacing:0.02em;text-transform:uppercase}
[data-vibeui-block="togglegroup-005"] [data-part="current"]{
margin:0;font-size:0.8125rem;color:var(--vibeui-togglegroup-005-muted);
}
[data-vibeui-block="togglegroup-005"] [data-part="group"]{display:flex;flex-wrap:wrap;gap:0.375rem}
[data-vibeui-block="togglegroup-005"] button{
appearance:none;cursor:pointer;font:inherit;position:relative;
display:inline-flex;align-items:center;justify-content:center;
min-width:3rem;height:2.5rem;padding:0 0.625rem;
border:1px solid var(--vibeui-togglegroup-005-border);border-radius:0.5rem;
background:var(--vibeui-togglegroup-005-bg);color:var(--vibeui-togglegroup-005-fg);
font-size:0.8125rem;font-weight:600;line-height:1;
transition:border-color .15s ease,background-color .15s ease,color .15s ease;
}
[data-vibeui-block="togglegroup-005"] button:hover{border-color:var(--vibeui-togglegroup-005-accent)}
[data-vibeui-block="togglegroup-005"] button:focus-visible{
outline:2px solid var(--vibeui-togglegroup-005-accent);outline-offset:2px;
}
[data-vibeui-block="togglegroup-005"] button[aria-pressed="true"]{
background:var(--vibeui-togglegroup-005-accent);
border-color:var(--vibeui-togglegroup-005-accent);
color:oklch(0.99 0 0);
}
/* Закончившийся размер гасится и перечёркивается: цвет один — слишком слабый
   признак, а перечёркивание читается и в чёрно-белой печати. */
[data-vibeui-block="togglegroup-005"] button[aria-disabled="true"]{
cursor:not-allowed;color:var(--vibeui-togglegroup-005-muted);
background:var(--vibeui-togglegroup-005-surface);border-color:transparent;
}
[data-vibeui-block="togglegroup-005"] button[aria-disabled="true"]::after{
content:"";position:absolute;left:0.5rem;right:0.5rem;top:50%;height:1px;
background:var(--vibeui-togglegroup-005-muted);transform:rotate(-12deg);
}
[data-vibeui-block="togglegroup-005"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-togglegroup-005-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="togglegroup-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SIZES: Togglegroup005Size[] = [
  { id: "XS", available: true },
  { id: "S", available: true },
  { id: "M", available: true },
  { id: "L", available: false },
  { id: "XL", available: true },
  { id: "XXL", available: false },
]

/**
 * Выбор размера одиночным toggle-выбором: закончившиеся размеры остаются
 * в ряду и помечены aria-disabled. Один файл, ноль зависимостей.
 */
export function Togglegroup005({
  label = "Размер",
  defaultValue = "M",
  sizes = DEFAULT_SIZES,
  onChange,
  accent,
  className,
  style,
  ...props
}: Togglegroup005Props) {
  const [value, setValue] = useState(defaultValue)
  const [refused, setRefused] = useState("")

  const palette = {
    ...(accent ? { "--vibeui-togglegroup-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-togglegroup-005" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="togglegroup-005"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3>{label}</h3>
          <p data-part="current" role="status">
            Выбран: {value}
          </p>
        </div>
        <div data-part="group" role="group" aria-label={label}>
          {sizes.map((size) => {
            const out = size.available === false

            return (
              <button
                key={size.id}
                type="button"
                aria-pressed={value === size.id}
                aria-disabled={out}
                aria-label={out ? `${size.id}, закончился` : size.id}
                onClick={() => {
                  if (out) {
                    setRefused(size.id)
                    return
                  }

                  setRefused("")
                  setValue(size.id)
                  onChange?.(size.id)
                }}
              >
                {size.id}
              </button>
            )
          })}
        </div>
        <p data-part="note" role="status">
          {refused
            ? `Размера ${refused} сейчас нет. Напишем, когда привезут.`
            : "Перечёркнутых размеров нет в наличии."}
        </p>
      </section>
    </>
  )
}

"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button013Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  options?: string[]
  defaultValue?: string
  label?: string
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: сегментированный переключатель — выбор одного из немногих.
// Внутри настоящие radio, а не кнопки: стрелки, Home/End и объявление
// «выбрано 2 из 3» браузер даёт сам. Подложка выбранного двигается за
// значением, но состояние держит форма, а не анимация.
const STYLES = `
:where([data-vibeui-block="button-013"]){
--vibeui-button-013-fg:oklch(0.3 0.014 265);
--vibeui-button-013-muted:oklch(0.5 0.014 265);
--vibeui-button-013-bg:oklch(0.96 0.004 265);
--vibeui-button-013-on:oklch(1 0 0);
--vibeui-button-013-border:oklch(0.9 0.006 265);
--vibeui-button-013-accent:oklch(0.55 0.17 265);
--vibeui-button-013-radius:0.625rem;
--vibeui-button-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-013"]{
display:inline-flex;align-items:center;gap:0.125rem;
padding:0.1875rem;box-sizing:border-box;
border:1px solid var(--vibeui-button-013-border);
border-radius:calc(var(--vibeui-button-013-radius) + 0.1875rem);
background:var(--vibeui-button-013-bg);
font-family:var(--vibeui-button-013-font);
}
[data-vibeui-block="button-013"] label{
position:relative;display:inline-flex;align-items:center;justify-content:center;
height:1.875rem;padding:0 0.75rem;border-radius:var(--vibeui-button-013-radius);
color:var(--vibeui-button-013-muted);font-size:0.8125rem;font-weight:600;
cursor:pointer;white-space:nowrap;
transition:color .16s ease,background-color .16s ease;
}
/* Настоящие radio под подписями: стрелки и объявление позиции — от браузера. */
[data-vibeui-block="button-013"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;
opacity:0;cursor:pointer;
}
[data-vibeui-block="button-013"] label:has(input:checked){
background:var(--vibeui-button-013-on);color:var(--vibeui-button-013-fg);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 12%);
}
[data-vibeui-block="button-013"] label:has(input:focus-visible){outline:2px solid var(--vibeui-button-013-accent);outline-offset:2px}
[data-vibeui-block="button-013"] label:hover{color:var(--vibeui-button-013-fg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = ["День", "Неделя", "Месяц"]

/**
 * Сегментированный переключатель на настоящих radio.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button013({
  options = DEFAULT_OPTIONS,
  defaultValue = "Неделя",
  label = "Период",
  onChange,
  accent,
  className,
  style,
  ...props
}: Button013Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-button-013-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="button-013"
        role="radiogroup"
        aria-label={label}
        className={className}
        style={palette}
      >
        {options.map((option) => (
          <label key={option}>
            <input
              type="radio"
              name={id}
              value={option}
              checked={value === option}
              onChange={() => {
                setValue(option)
                onChange?.(option)
              }}
            />
            {option}
          </label>
        ))}
      </div>
    </>
  )
}

"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Checkbox019Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "onChange"
> & {
  legend?: string
  options?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  accent?: string
}

// Идея компонента: фильтры-таблетки в одну ленту с переносом. Каждая
// таблетка — настоящий чекбокс со спрятанным input, поэтому Tab и пробел
// работают, а внешне это компактный ряд, помещающийся над списком. Отмеченная
// таблетка не только заливается, но и получает галочку слева: заливка одна
// не читается при дальтонизме.
const STYLES = `
:where([data-vibeui-block="checkbox-019"]){
--vibeui-checkbox-019-bg:oklch(1 0 0);
--vibeui-checkbox-019-fg:oklch(0.24 0.014 265);
--vibeui-checkbox-019-muted:oklch(0.55 0.014 265);
--vibeui-checkbox-019-border:oklch(0.89 0.006 265);
--vibeui-checkbox-019-chip:oklch(0.97 0.003 265);
--vibeui-checkbox-019-accent:oklch(0.45 0.13 200);
--vibeui-checkbox-019-on:oklch(0.98 0.01 200);
--vibeui-checkbox-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="checkbox-019"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
width:100%;max-width:26rem;box-sizing:border-box;
margin:0;padding:0.75rem;border:1px solid var(--vibeui-checkbox-019-border);border-radius:0.875rem;
background:var(--vibeui-checkbox-019-bg);
font-family:var(--vibeui-checkbox-019-font);color:var(--vibeui-checkbox-019-fg);
}
[data-vibeui-block="checkbox-019"] legend{float:left;width:100%;padding:0 0 0.5rem;font-size:0.75rem;font-weight:650;color:var(--vibeui-checkbox-019-muted);text-transform:uppercase;letter-spacing:0.04em}
[data-vibeui-block="checkbox-019"] label{
clear:both;display:inline-flex;align-items:center;gap:0.25rem;
height:1.875rem;padding:0 0.625rem;border-radius:9999px;cursor:pointer;
background:var(--vibeui-checkbox-019-chip);
box-shadow:inset 0 0 0 1px var(--vibeui-checkbox-019-border);
font-size:0.8125rem;line-height:1;white-space:nowrap;
transition:background-color .15s ease,color .15s ease,box-shadow .15s ease;
}
[data-vibeui-block="checkbox-019"] label:hover{box-shadow:inset 0 0 0 1px var(--vibeui-checkbox-019-accent)}
[data-vibeui-block="checkbox-019"] label:has(input:checked){
background:var(--vibeui-checkbox-019-accent);color:var(--vibeui-checkbox-019-on);
box-shadow:none;font-weight:600;
}
[data-vibeui-block="checkbox-019"] label:has(input:focus-visible){outline:2px solid var(--vibeui-checkbox-019-accent);outline-offset:2px}
[data-vibeui-block="checkbox-019"] input{
appearance:none;position:absolute;width:1px;height:1px;margin:0;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
/* Галочка появляется шириной, а не opacity: невыбранная таблетка не тащит
   за собой пустое место под значок. */
[data-vibeui-block="checkbox-019"] [data-part="tick"]{
display:inline-block;width:0;height:0.5rem;overflow:hidden;
transition:width .15s ease,margin .15s ease;
}
[data-vibeui-block="checkbox-019"] label:has(input:checked) [data-part="tick"]{
width:0.3125rem;margin-right:0.1875rem;
border-right:2px solid currentColor;border-bottom:2px solid currentColor;
height:0.5rem;transform:rotate(45deg) translateY(-1px);
}
[data-vibeui-block="checkbox-019"] button{
appearance:none;border:0;background:transparent;cursor:pointer;padding:0 0.25rem;
font:inherit;font-size:0.75rem;font-weight:650;color:var(--vibeui-checkbox-019-accent);
}
[data-vibeui-block="checkbox-019"] button:disabled{color:var(--vibeui-checkbox-019-muted);cursor:not-allowed}
[data-vibeui-block="checkbox-019"] button:focus-visible{outline:2px solid var(--vibeui-checkbox-019-accent);outline-offset:2px;border-radius:0.25rem}
[data-vibeui-block="checkbox-019"] [data-part="count"]{
flex:1 1 100%;margin:0.25rem 0 0;font-size:0.75rem;color:var(--vibeui-checkbox-019-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-019"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "Бесплатно",
  "Со скидкой",
  "Новинки",
  "В наличии",
  "С доставкой",
  "Отзывы 4+",
]

/**
 * Компактный ряд фильтров-таблеток: настоящие чекбоксы со спрятанным input,
 * галочка у отмеченных и сброс. Один файл, ноль зависимостей.
 */
export function Checkbox019({
  legend = "Быстрые фильтры",
  options = DEFAULT_OPTIONS,
  defaultValue = ["В наличии"],
  onChange,
  accent,
  className,
  style,
  ...props
}: Checkbox019Props) {
  const [value, setValue] = useState<string[]>(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-checkbox-019-accent": accent } : null),
    ...style,
  } as CSSProperties

  const update = (next: string[]) => {
    setValue(next)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-checkbox-019" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="checkbox-019"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        {options.map((option) => (
          <label key={option}>
            <input
              type="checkbox"
              checked={value.includes(option)}
              onChange={() =>
                update(
                  value.includes(option)
                    ? value.filter((item) => item !== option)
                    : [...value, option],
                )
              }
            />
            <span data-part="tick" aria-hidden="true" />
            <span>{option}</span>
          </label>
        ))}
        <button
          type="button"
          disabled={value.length === 0}
          onClick={() => update([])}
        >
          Сбросить
        </button>
        <p data-part="count" role="status">
          {value.length === 0
            ? "Фильтры не выбраны"
            : `Выбрано фильтров: ${value.length}`}
        </p>
      </fieldset>
    </>
  )
}

"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Checkbox004Filter = {
  label: string
  count: number
  disabled?: boolean
}

export type Checkbox004Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "onChange"
> & {
  legend?: string
  filters?: Checkbox004Filter[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  accent?: string
}

// Идея компонента: список фильтров с числом находок у каждого. Ноль находок
// не прячется, а выключается: исчезнувший фильтр заставляет думать, что его
// вообще нет. Числа выровнены по правому краю табличными цифрами — так
// сравнивают, что выбрать.
const STYLES = `
:where([data-vibeui-block="checkbox-004"]){
--vibeui-checkbox-004-bg:oklch(1 0 0);
--vibeui-checkbox-004-fg:oklch(0.22 0.014 265);
--vibeui-checkbox-004-muted:oklch(0.56 0.014 265);
--vibeui-checkbox-004-border:oklch(0.88 0.008 265);
--vibeui-checkbox-004-hover:oklch(0.97 0.003 265);
--vibeui-checkbox-004-accent:oklch(0.55 0.17 265);
--vibeui-checkbox-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="checkbox-004"]{
display:flex;flex-direction:column;gap:0.125rem;
width:100%;max-width:17rem;box-sizing:border-box;
margin:0;padding:0.75rem;
border:1px solid var(--vibeui-checkbox-004-border);border-radius:0.875rem;
background:var(--vibeui-checkbox-004-bg);
font-family:var(--vibeui-checkbox-004-font);color:var(--vibeui-checkbox-004-fg);
}
/* legend у fieldset садится на рамку и обрезается — float возвращает
   его в поток обычной строкой. */
[data-vibeui-block="checkbox-004"] legend{float:left;width:100%;padding:0 0 0.375rem;font-size:0.8125rem;font-weight:650}
/* Строка целиком кликабельна и подсвечивается: попадать в квадратик не надо. */
[data-vibeui-block="checkbox-004"] label{
display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:0.5rem;
min-height:2rem;padding:0 0.375rem;border-radius:0.5rem;
font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="checkbox-004"] label:hover{background:var(--vibeui-checkbox-004-hover)}
[data-vibeui-block="checkbox-004"] label:has(input:disabled){cursor:not-allowed;color:var(--vibeui-checkbox-004-muted)}
[data-vibeui-block="checkbox-004"] label:has(input:disabled):hover{background:transparent}
[data-vibeui-block="checkbox-004"] input{
appearance:none;flex:none;cursor:inherit;position:relative;
width:1.0625rem;height:1.0625rem;margin:0;box-sizing:border-box;
border:1.5px solid var(--vibeui-checkbox-004-border);border-radius:0.3125rem;
background:var(--vibeui-checkbox-004-bg);
}
[data-vibeui-block="checkbox-004"] input:checked{border-color:transparent;background:var(--vibeui-checkbox-004-accent)}
[data-vibeui-block="checkbox-004"] input:checked::after{
content:"";position:absolute;left:50%;top:50%;
width:0.25rem;height:0.4375rem;margin:-0.3125rem 0 0 -0.125rem;
border-right:2px solid oklch(0.99 0.01 265);border-bottom:2px solid oklch(0.99 0.01 265);
transform:rotate(45deg);
}
[data-vibeui-block="checkbox-004"] input:focus-visible{outline:2px solid var(--vibeui-checkbox-004-accent);outline-offset:2px}
/* Ноль находок выключается, а не исчезает: пропавший фильтр читается как
   отсутствующий вовсе. */
[data-vibeui-block="checkbox-004"] [data-part="count"]{
justify-self:end;font-size:0.75rem;color:var(--vibeui-checkbox-004-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="checkbox-004"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
margin-top:0.375rem;padding-top:0.5rem;
border-top:1px solid var(--vibeui-checkbox-004-border);
font-size:0.75rem;color:var(--vibeui-checkbox-004-muted);
}
[data-vibeui-block="checkbox-004"] button{
appearance:none;border:0;background:transparent;cursor:pointer;padding:0;
color:var(--vibeui-checkbox-004-accent);font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="checkbox-004"] button:disabled{color:var(--vibeui-checkbox-004-muted);cursor:not-allowed}
[data-vibeui-block="checkbox-004"] button:focus-visible{outline:2px solid var(--vibeui-checkbox-004-accent);outline-offset:2px;border-radius:0.25rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FILTERS: Checkbox004Filter[] = [
  { label: "Кнопки", count: 20 },
  { label: "Формы", count: 14 },
  { label: "Навигация", count: 12 },
  { label: "Графики", count: 10 },
  { label: "Календари", count: 0, disabled: true },
]

/**
 * Список фильтров с числом находок: ноль выключается, а не исчезает.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Checkbox004({
  legend = "Категория",
  filters = DEFAULT_FILTERS,
  defaultValue = ["Кнопки"],
  onChange,
  accent,
  className,
  style,
  ...props
}: Checkbox004Props) {
  const [value, setValue] = useState<string[]>(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-checkbox-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  const update = (next: string[]) => {
    setValue(next)
    onChange?.(next)
  }

  const found = filters
    .filter((filter) => value.includes(filter.label))
    .reduce((sum, filter) => sum + filter.count, 0)

  return (
    <>
      <style href="vibeui-checkbox-004" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="checkbox-004"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        {filters.map((filter) => (
          <label key={filter.label}>
            <input
              type="checkbox"
              checked={value.includes(filter.label)}
              disabled={filter.disabled}
              onChange={() =>
                update(
                  value.includes(filter.label)
                    ? value.filter((item) => item !== filter.label)
                    : [...value, filter.label],
                )
              }
            />
            <span>{filter.label}</span>
            <span data-part="count">{filter.count}</span>
          </label>
        ))}
        <p data-part="foot">
          <span>Найдётся: {found}</span>
          <button
            type="button"
            disabled={value.length === 0}
            onClick={() => update([])}
          >
            Сбросить
          </button>
        </p>
      </fieldset>
    </>
  )
}

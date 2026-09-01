"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Select005Option = {
  value: string
  label: string
  description: string
}

export type Select005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  options?: Select005Option[]
  defaultValue?: string
  accent?: string
}

// Идея компонента: короткое название в поле, объяснение — под ним. Роли,
// планы и режимы почти всегда требуют одной поясняющей строки, но внутрь
// <option> её не поместить: системный список рисует только текст. Поэтому
// пояснение живёт отдельным абзацем и переключается вместе со значением.
const STYLES = `
:where([data-vibeui-block="select-005"]){
--vibeui-select-005-surface:oklch(1 0 0);
--vibeui-select-005-surface-border:oklch(0.91 0.006 265);
--vibeui-select-005-fg:oklch(0.23 0.016 265);
--vibeui-select-005-muted:oklch(0.52 0.014 265);
--vibeui-select-005-field:oklch(0.985 0.002 265);
--vibeui-select-005-border:oklch(0.87 0.008 265);
--vibeui-select-005-accent:oklch(0.55 0.19 262);
--vibeui-select-005-note:oklch(0.55 0.19 262 / 8%);
--vibeui-select-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="select-005"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-select-005-surface);
border:1px solid var(--vibeui-select-005-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-005-font);color:var(--vibeui-select-005-fg);
}
[data-vibeui-block="select-005"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-005"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="select-005"] select{
appearance:none;-webkit-appearance:none;
width:100%;box-sizing:border-box;margin:0;height:2.75rem;
padding:0 2.5rem 0 0.875rem;
border:1px solid var(--vibeui-select-005-border);border-radius:0.625rem;
background:var(--vibeui-select-005-field);color:inherit;
font:inherit;font-size:0.9375rem;cursor:pointer;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="select-005"] select:focus{
outline:none;border-color:var(--vibeui-select-005-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-005-accent) 22%,transparent);
}
[data-vibeui-block="select-005"] [data-part="arrow"]{
position:absolute;right:1rem;top:50%;
width:0.4375rem;height:0.4375rem;margin-top:-0.3125rem;pointer-events:none;
border-right:1.5px solid var(--vibeui-select-005-muted);
border-bottom:1.5px solid var(--vibeui-select-005-muted);
transform:rotate(45deg);
}
/* Пояснение — часть поля, а не подсказка: оно объявлено через
   aria-describedby и обновляется как живая область. */
[data-vibeui-block="select-005"] [data-part="note"]{
display:flex;gap:0.5rem;margin:0;padding:0.5rem 0.625rem;
border-radius:0.5rem;background:var(--vibeui-select-005-note);
font-size:0.75rem;line-height:1.45;color:var(--vibeui-select-005-muted);
}
[data-vibeui-block="select-005"] [data-part="mark"]{
flex:none;color:var(--vibeui-select-005-accent);font-weight:700;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Select005Option[] = [
  {
    value: "viewer",
    label: "Наблюдатель",
    description: "Видит проект и комментарии, но ничего не меняет.",
  },
  {
    value: "editor",
    label: "Редактор",
    description: "Правит содержимое и публикует, но не зовёт новых людей.",
  },
  {
    value: "admin",
    label: "Администратор",
    description: "Управляет доступами, оплатой и может удалить проект.",
  },
]

/**
 * Select с пояснением: под полем живая строка про выбранный вариант.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Select005({
  label = "Роль в проекте",
  options = DEFAULT_OPTIONS,
  defaultValue = "editor",
  accent,
  className,
  style,
  ...props
}: Select005Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const current = options.find((option) => option.value === value) ?? options[0]

  const palette = {
    ...(accent ? { "--vibeui-select-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="select-005"
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={id}>
          {label}
        </label>
        <span data-part="field">
          <select
            id={id}
            value={value}
            aria-describedby={`${id}-note`}
            onChange={(event) => setValue(event.target.value)}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span data-part="arrow" aria-hidden="true" />
        </span>
        <p data-part="note" id={`${id}-note`} role="status">
          <span data-part="mark" aria-hidden="true">
            →
          </span>
          {current?.description}
        </p>
      </div>
    </>
  )
}

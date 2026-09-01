"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Select028Tone = "low" | "medium" | "high" | "critical"

export type Select028Option = {
  value: string
  label: string
  tone: Select028Tone
  caption: string
}

export type Select028Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  options?: Select028Option[]
  defaultValue?: string
  accent?: string
}

// Идея компонента: приоритет узнают по цвету метки раньше, чем по слову, а
// подпись под полем объясняет, что этот приоритет значит на практике —
// как в select-011 (цветная точка) и select-005 (живое пояснение), только
// вместе и про задачи, а не про статус или роль.
const STYLES = `
:where([data-vibeui-block="select-028"]){
--vibeui-select-028-surface:oklch(1 0 0);
--vibeui-select-028-surface-border:oklch(0.91 0.006 265);
--vibeui-select-028-fg:oklch(0.22 0.014 265);
--vibeui-select-028-muted:oklch(0.55 0.014 265);
--vibeui-select-028-border:oklch(0.87 0.008 265);
--vibeui-select-028-accent:oklch(0.55 0.19 262);
--vibeui-select-028-tone-low:oklch(0.62 0.13 200);
--vibeui-select-028-tone-medium:oklch(0.75 0.16 85);
--vibeui-select-028-tone-high:oklch(0.62 0.19 45);
--vibeui-select-028-tone-critical:oklch(0.55 0.21 25);
--vibeui-select-028-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="select-028"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-select-028-surface);
border:1px solid var(--vibeui-select-028-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-028-font);color:var(--vibeui-select-028-fg);
container-type:inline-size;
}
[data-vibeui-block="select-028"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-028"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="select-028"] select{
position:absolute;inset:0;width:100%;height:100%;
opacity:0;cursor:pointer;font:inherit;
}
[data-vibeui-block="select-028"] [data-part="trigger"]{
display:flex;align-items:center;gap:0.625rem;
box-sizing:border-box;width:100%;min-height:2.75rem;padding:0.5rem 0.75rem;
border:1px solid var(--vibeui-select-028-border);border-radius:0.625rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="select-028"] select:focus-visible + [data-part="trigger"],
[data-vibeui-block="select-028"] select:focus + [data-part="trigger"]{
border-color:var(--vibeui-select-028-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-028-accent) 22%,transparent);
}
[data-vibeui-block="select-028"] [data-part="badge"]{
flex:none;display:inline-flex;align-items:center;gap:0.375rem;
padding:0.1875rem 0.5625rem;border-radius:9999px;
font-size:0.8125rem;font-weight:700;
}
[data-vibeui-block="select-028"] [data-part="badge"]::before{
content:"";width:0.5rem;height:0.5rem;border-radius:9999px;background:currentColor;
}
[data-vibeui-block="select-028"] [data-part="badge"][data-tone="low"]{
color:var(--vibeui-select-028-tone-low);
background:color-mix(in oklab,var(--vibeui-select-028-tone-low) 14%,transparent);
}
[data-vibeui-block="select-028"] [data-part="badge"][data-tone="medium"]{
color:var(--vibeui-select-028-tone-medium);
background:color-mix(in oklab,var(--vibeui-select-028-tone-medium) 16%,transparent);
}
[data-vibeui-block="select-028"] [data-part="badge"][data-tone="high"]{
color:var(--vibeui-select-028-tone-high);
background:color-mix(in oklab,var(--vibeui-select-028-tone-high) 14%,transparent);
}
[data-vibeui-block="select-028"] [data-part="badge"][data-tone="critical"]{
color:var(--vibeui-select-028-tone-critical);
background:color-mix(in oklab,var(--vibeui-select-028-tone-critical) 14%,transparent);
}
[data-vibeui-block="select-028"] [data-part="name"]{
flex:1 1 auto;min-width:0;font-size:0.9375rem;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="select-028"] [data-part="caption"]{margin:0;font-size:0.8125rem;color:var(--vibeui-select-028-muted)}
@container (max-width: 15rem){
[data-vibeui-block="select-028"] [data-part="name"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-028"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Select028Option[] = [
  {
    value: "low",
    label: "Низкий",
    tone: "low",
    caption: "Можно вернуться к задаче в любой момент, срок не горит.",
  },
  {
    value: "medium",
    label: "Средний",
    tone: "medium",
    caption: "Стоит сделать на этой неделе, но не бросать всё ради неё.",
  },
  {
    value: "high",
    label: "Высокий",
    tone: "high",
    caption: "Задача блокирует другие — её берут в работу сегодня.",
  },
  {
    value: "critical",
    label: "Критический",
    tone: "critical",
    caption: "Инцидент: команда переключается на задачу немедленно.",
  },
]

/**
 * Select приоритета задачи: цветная метка в триггере и живая подпись под
 * полем с объяснением, что приоритет значит на практике. Один файл, ноль
 * зависимостей, клиентский компонент.
 */
export function Select028({
  label = "Приоритет задачи",
  options = DEFAULT_OPTIONS,
  defaultValue = options[1]?.value ?? options[0]?.value,
  accent,
  id,
  className,
  style,
  ...props
}: Select028Props) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const captionId = `${fieldId}-caption`
  const [value, setValue] = useState(defaultValue ?? options[0]?.value ?? "")
  const current = options.find((option) => option.value === value) ?? options[0]

  const palette = {
    ...(accent ? { "--vibeui-select-028-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-028" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="select-028"
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={fieldId}>
          {label}
        </label>
        <span data-part="field">
          <select
            id={fieldId}
            value={value}
            aria-describedby={captionId}
            onChange={(event) => setValue(event.target.value)}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span data-part="trigger" aria-hidden="true">
            <span data-part="badge" data-tone={current?.tone}>
              {current?.label}
            </span>
            <span data-part="name">{current?.label} приоритет</span>
          </span>
        </span>
        <p data-part="caption" id={captionId} role="status">
          {current?.caption}
        </p>
      </div>
    </>
  )
}

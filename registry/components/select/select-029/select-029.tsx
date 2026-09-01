"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Select029Layout = "header-side" | "grid" | "stack" | "hero"

export type Select029Template = {
  value: string
  label: string
  layout: Select029Layout
}

export type Select029Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  templates?: Select029Template[]
  defaultValue?: string
  accent?: string
}

// Идея компонента: рядом с полем — миниатюра выбранного шаблона, нарисованная
// блоками на CSS. Название шаблона само по себе не говорит, как выглядит
// раскладка, а маленькая схема — говорит, ещё до открытия предпросмотра.
const STYLES = `
:where([data-vibeui-block="select-029"]){
--vibeui-select-029-surface:oklch(1 0 0);
--vibeui-select-029-surface-border:oklch(0.91 0.006 265);
--vibeui-select-029-fg:oklch(0.22 0.014 265);
--vibeui-select-029-muted:oklch(0.55 0.014 265);
--vibeui-select-029-field:oklch(0.985 0.002 265);
--vibeui-select-029-border:oklch(0.87 0.008 265);
--vibeui-select-029-accent:oklch(0.55 0.19 262);
--vibeui-select-029-thumb-bg:oklch(0.96 0.004 265);
--vibeui-select-029-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="select-029"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-select-029-surface);
border:1px solid var(--vibeui-select-029-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-029-font);color:var(--vibeui-select-029-fg);
container-type:inline-size;
}
[data-vibeui-block="select-029"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-029"] [data-part="row"]{display:flex;align-items:center;gap:0.75rem}
[data-vibeui-block="select-029"] [data-part="thumb"]{
flex:none;display:grid;gap:0.1875rem;box-sizing:border-box;
width:3rem;height:2.375rem;padding:0.25rem;
border:1px solid var(--vibeui-select-029-border);border-radius:0.4375rem;
background:var(--vibeui-select-029-thumb-bg);overflow:hidden;
}
[data-vibeui-block="select-029"] [data-part="thumb"] span{
display:block;border-radius:0.125rem;
background:color-mix(in oklab,var(--vibeui-select-029-accent) 55%,var(--vibeui-select-029-border));
}
[data-vibeui-block="select-029"] [data-part="thumb"][data-layout="header-side"]{grid-template-columns:0.5rem 1fr;grid-template-rows:1fr}
[data-vibeui-block="select-029"] [data-part="thumb"][data-layout="grid"]{grid-template-columns:1fr 1fr;grid-template-rows:1fr}
[data-vibeui-block="select-029"] [data-part="thumb"][data-layout="stack"]{grid-template-rows:1fr 1fr 1fr}
[data-vibeui-block="select-029"] [data-part="thumb"][data-layout="hero"]{grid-template-rows:1.4fr 0.4rem}
[data-vibeui-block="select-029"] [data-part="field"]{position:relative;display:block;flex:1 1 auto;min-width:0}
[data-vibeui-block="select-029"] select{
appearance:none;-webkit-appearance:none;
width:100%;box-sizing:border-box;margin:0;height:2.75rem;
padding:0 2.5rem 0 0.875rem;
border:1px solid var(--vibeui-select-029-border);border-radius:0.625rem;
background:var(--vibeui-select-029-field);color:inherit;
font:inherit;font-size:0.9375rem;cursor:pointer;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="select-029"] select:focus-visible{
outline:none;border-color:var(--vibeui-select-029-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-029-accent) 22%,transparent);
}
[data-vibeui-block="select-029"] [data-part="arrow"]{
position:absolute;right:1rem;top:50%;
width:0.4375rem;height:0.4375rem;margin-top:-0.3125rem;pointer-events:none;
border-right:1.5px solid var(--vibeui-select-029-muted);
border-bottom:1.5px solid var(--vibeui-select-029-muted);
transform:rotate(45deg);
}
@container (max-width: 14rem){
[data-vibeui-block="select-029"] [data-part="thumb"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-029"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TEMPLATES: Select029Template[] = [
  {
    value: "header-side",
    label: "Шапка + боковая панель",
    layout: "header-side",
  },
  { value: "grid", label: "Плиточная сетка", layout: "grid" },
  { value: "stack", label: "Одна колонка", layout: "stack" },
  { value: "hero", label: "Крупный баннер", layout: "hero" },
]

/**
 * Select шаблона с CSS-миниатюрой раскладки рядом с полем: схема из блоков
 * меняется вместе с выбором. Один файл, ноль зависимостей, клиентский
 * компонент.
 */
export function Select029({
  label = "Шаблон страницы",
  templates = DEFAULT_TEMPLATES,
  defaultValue = templates[0]?.value,
  accent,
  id,
  className,
  style,
  ...props
}: Select029Props) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const [value, setValue] = useState(defaultValue ?? templates[0]?.value ?? "")
  const current =
    templates.find((template) => template.value === value) ?? templates[0]

  const palette = {
    ...(accent ? { "--vibeui-select-029-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-029" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="select-029"
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={fieldId}>
          {label}
        </label>
        <span data-part="row">
          <span
            data-part="thumb"
            data-layout={current?.layout}
            aria-hidden="true"
          >
            <span data-block="a" />
            <span data-block="b" />
          </span>
          <span data-part="field">
            <select
              id={fieldId}
              value={value}
              onChange={(event) => setValue(event.target.value)}
            >
              {templates.map((template) => (
                <option key={template.value} value={template.value}>
                  {template.label}
                </option>
              ))}
            </select>
            <span data-part="arrow" aria-hidden="true" />
          </span>
        </span>
      </div>
    </>
  )
}

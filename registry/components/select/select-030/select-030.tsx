"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Select030Field = {
  key: string
  label: string
  options: { value: string; label: string }[]
}

export type Select030Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "onChange"
> & {
  legend?: string
  fields?: Select030Field[]
  defaultValues?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: несколько независимых select'ов стоят в одну плотную
// строку, как панель фильтров над таблицей. Каждое поле маленькое и своё —
// в отличие от select-025, поля друг от друга не зависят, а в отличие от
// select-006 их не два, а произвольное число, и они не считают сумму.
const STYLES = `
:where([data-vibeui-block="select-030"]){
--vibeui-select-030-surface:transparent;
--vibeui-select-030-surface-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-select-030-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-select-030-muted:color-mix(in oklab,var(--vibeui-select-030-fg) 68%,transparent);
--vibeui-select-030-field:light-dark(oklch(0.985 0 265),oklch(0.27 0 265));
--vibeui-select-030-border:light-dark(oklch(0.87 0 265),oklch(0.42 0 265));
--vibeui-select-030-accent:light-dark(oklch(0.55 0.19 39.8),oklch(0.73 0.17 39.8));
--vibeui-select-030-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="select-030"]{color-scheme:dark}
[data-vibeui-block="select-030"]{
display:flex;flex-wrap:wrap;align-items:flex-end;gap:0.625rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);box-sizing:border-box;padding:0.75rem;margin:0;
background:var(--vibeui-select-030-surface);
border:1px solid var(--vibeui-select-030-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-030-font);color:var(--vibeui-select-030-fg);
container-type:inline-size;
}
[data-vibeui-block="select-030"] [data-part="legend"]{
flex-basis:100%;margin:0 0 0.125rem;padding:0;
font-size:0.75rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-select-030-muted);
}
[data-vibeui-block="select-030"] [data-part="cell"]{
display:flex;flex-direction:column;gap:0.25rem;min-width:8rem;flex:1 1 8rem;
}
[data-vibeui-block="select-030"] [data-part="caption"]{font-size:0.6875rem;font-weight:600;color:var(--vibeui-select-030-muted)}
[data-vibeui-block="select-030"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="select-030"] select{
appearance:none;-webkit-appearance:none;
width:100%;box-sizing:border-box;margin:0;height:2.375rem;
padding:0 1.875rem 0 0.625rem;
border:1px solid var(--vibeui-select-030-border);border-radius:0.5rem;
background:var(--vibeui-select-030-field);color:inherit;
font:inherit;font-size:0.8125rem;cursor:pointer;
transition:border-color .16s ease,box-shadow .16s ease;
}
/* Системный список рисует браузер по цветам самого <select>: у
   прозрачного он берёт белый, и в тёмной теме всплывал светлый
   список поверх тёмной страницы. */
[data-vibeui-block="select-030"] select,
[data-vibeui-block="select-030"] option,
[data-vibeui-block="select-030"] optgroup{
background-color:var(--vibeui-select-030-field);color:var(--vibeui-select-030-fg);
}
[data-vibeui-block="select-030"] select:focus-visible{
outline:none;border-color:var(--vibeui-select-030-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-030-accent) 22%,transparent);
}
[data-vibeui-block="select-030"] [data-part="arrow"]{
position:absolute;right:0.625rem;top:50%;
width:0.375rem;height:0.375rem;margin-top:-0.28125rem;pointer-events:none;
border-right:1.5px solid var(--vibeui-select-030-muted);
border-bottom:1.5px solid var(--vibeui-select-030-muted);
transform:rotate(45deg);
}
@container (max-width: 22rem){
[data-vibeui-block="select-030"] [data-part="cell"]{flex-basis:100%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-030"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FIELDS: Select030Field[] = [
  {
    key: "category",
    label: "Категория",
    options: [
      { value: "all", label: "Все" },
      { value: "clothes", label: "Одежда" },
      { value: "shoes", label: "Обувь" },
    ],
  },
  {
    key: "status",
    label: "Статус",
    options: [
      { value: "all", label: "Любой" },
      { value: "active", label: "В продаже" },
      { value: "archived", label: "В архиве" },
    ],
  },
  {
    key: "sort",
    label: "Сортировка",
    options: [
      { value: "new", label: "Сначала новые" },
      { value: "price-asc", label: "Дешевле" },
      { value: "price-desc", label: "Дороже" },
    ],
  },
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Компактная строка фильтров из нескольких независимых select'ов, как
 * панель над таблицей. Один файл, ноль зависимостей, клиентский компонент.
 */
export function Select030({
  legend = "Фильтры",
  fields = DEFAULT_FIELDS,
  defaultValues,
  background = "",
  accent,
  className,
  style,
  ...props
}: Select030Props) {
  const generatedId = useId()
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    for (const field of fields) {
      initial[field.key] =
        defaultValues?.[field.key] ?? field.options[0]?.value ?? ""
    }
    return initial
  })

  function handleChange(key: string, nextValue: string) {
    setValues((prev) => ({ ...prev, [key]: nextValue }))
  }

  const palette = {
    ...(accent ? { "--vibeui-select-030-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-select-030-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-030" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="select"
        data-vibeui-block="select-030"
        className={className}
        style={palette}
      >
        <legend data-part="legend">{legend}</legend>
        {fields.map((field) => {
          const fieldId = `${generatedId}-${field.key}`
          return (
            <div data-part="cell" key={field.key}>
              <label data-part="caption" htmlFor={fieldId}>
                {field.label}
              </label>
              <span data-part="field">
                <select
                  id={fieldId}
                  name={field.key}
                  value={values[field.key]}
                  onChange={(event) =>
                    handleChange(field.key, event.target.value)
                  }
                >
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span data-part="arrow" aria-hidden="true" />
              </span>
            </div>
          )
        })}
      </fieldset>
    </>
  )
}

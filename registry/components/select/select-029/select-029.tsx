"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Select029Layout = "header-side" | "grid" | "stack" | "hero"

export type Select029Template = {
  value: string
  label: string
  layout: Select029Layout
}

export type Select029Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  label?: string
  templates?: Select029Template[]
  defaultValue?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: рядом с полем — миниатюра выбранного шаблона, нарисованная
// блоками на CSS. Название шаблона само по себе не говорит, как выглядит
// раскладка, а маленькая схема — говорит, ещё до открытия предпросмотра.
const STYLES = `
:where([data-vibeui-block="select-029"]){
--vibeui-select-029-surface:transparent;
--vibeui-select-029-surface-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-select-029-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-select-029-muted:color-mix(in oklab,var(--vibeui-select-029-fg) 68%,transparent);
--vibeui-select-029-field:light-dark(oklch(0.985 0 265),oklch(0.27 0 265));
--vibeui-select-029-border:light-dark(oklch(0.87 0 265),oklch(0.42 0 265));
--vibeui-select-029-accent:light-dark(oklch(0.287 0 0),oklch(0.901 0 0));
--vibeui-select-029-thumb-bg:light-dark(oklch(0.96 0 265),oklch(0.31 0 265));
--vibeui-select-029-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="select-029"]{color-scheme:dark}
[data-vibeui-block="select-029"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-select-029-surface);
border:1px solid var(--vibeui-select-029-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-029-font);color:var(--vibeui-select-029-fg);
container-type:inline-size;
}
[data-vibeui-block="select-029"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-029"] [data-part="row"]{display:flex;align-items:center;gap:0.75rem}
[data-vibeui-block="select-029"] [data-part="thumb"]{
position:relative;flex:none;display:grid;gap:0.1875rem;box-sizing:border-box;
width:3rem;height:2.375rem;padding:0.25rem;
border:1px solid var(--vibeui-select-029-border);border-radius:0.4375rem;overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="select-029"] [data-part="thumb"][data-empty="true"]{background:var(--vibeui-select-029-thumb-bg);}
[data-vibeui-block="select-029"] [data-part="thumb"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
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
/* Системный список рисует браузер по цветам самого <select>: у
   прозрачного он берёт белый, и в тёмной теме всплывал светлый
   список поверх тёмной страницы. */
[data-vibeui-block="select-029"] select,
[data-vibeui-block="select-029"] option,
[data-vibeui-block="select-029"] optgroup{
background-color:var(--vibeui-select-029-field);color:var(--vibeui-select-029-fg);
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
 * Select шаблона с CSS-миниатюрой раскладки рядом с полем: схема из блоков
 * меняется вместе с выбором. Один файл, ноль зависимостей, клиентский
 * компонент.
 */
export function Select029({
  label = "Шаблон страницы",
  image = "",
  templates = DEFAULT_TEMPLATES,
  defaultValue = templates[0]?.value,
  background = "",
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
    ...(background
      ? {
          "--vibeui-select-029-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-029" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="select"
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
            data-empty={image ? undefined : "true"}
            data-layout={current?.layout}
            aria-hidden="true"
          >
            {image ? (
              <img src={image} alt="" loading="lazy" decoding="async" />
            ) : null}
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

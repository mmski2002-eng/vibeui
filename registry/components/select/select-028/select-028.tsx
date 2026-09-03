"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Select028Tone = "low" | "medium" | "high" | "critical"

export type Select028Option = {
  value: string
  label: string
  tone: Select028Tone
  caption: string
}

export type Select028Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  options?: Select028Option[]
  defaultValue?: string
  /** Строка рядом с меткой, {label} — подпись выбранного приоритета. */
  currentText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: приоритет узнают по цвету метки раньше, чем по слову, а
// подпись под полем объясняет, что этот приоритет значит на практике —
// как в select-011 (цветная точка) и select-005 (живое пояснение), только
// вместе и про задачи, а не про статус или роль.
const STYLES = `
:where([data-vibeui-block="select-028"]){
--vibeui-select-028-surface:transparent;
--vibeui-select-028-surface-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-select-028-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-select-028-muted:color-mix(in oklab,var(--vibeui-select-028-fg) 68%,transparent);
--vibeui-select-028-border:light-dark(oklch(0.87 0.008 265),oklch(0.42 0.012 265));
--vibeui-select-028-accent:light-dark(oklch(0.55 0.19 262),oklch(0.73 0.17 262));
--vibeui-select-028-tone-low:light-dark(oklch(0.62 0.13 200),oklch(0.78 0.12 200));
--vibeui-select-028-tone-medium:light-dark(oklch(0.75 0.16 85),oklch(0.83 0.14 88));
--vibeui-select-028-tone-high:light-dark(oklch(0.62 0.19 45),oklch(0.79 0.15 55));
--vibeui-select-028-tone-critical:light-dark(oklch(0.55 0.21 25),oklch(0.72 0.17 25));
--vibeui-select-028-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="select-028"]{color-scheme:dark}
[data-vibeui-block="select-028"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:20rem;box-sizing:border-box;padding:0.875rem;
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
 * Select приоритета задачи: цветная метка в триггере и живая подпись под
 * полем с объяснением, что приоритет значит на практике. Один файл, ноль
 * зависимостей, клиентский компонент.
 */
export function Select028({
  label = "Приоритет задачи",
  options = DEFAULT_OPTIONS,
  defaultValue = options[1]?.value ?? options[0]?.value,
  currentText = "{label} приоритет",
  background = "",
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
    ...(background
      ? {
          "--vibeui-select-028-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-028" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="select"
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
            <span data-part="name">
              {currentText.replace("{label}", current?.label ?? "")}
            </span>
          </span>
        </span>
        <p data-part="caption" id={captionId} role="status">
          {current?.caption}
        </p>
      </div>
    </>
  )
}

"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Select011Tone = "open" | "progress" | "review" | "done"

export type Select011Option = {
  value: string
  label: string
  tone: Select011Tone
}

export type Select011Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  options?: Select011Option[]
  defaultValue?: string
  /** Пусто — подложки нет, поле лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: статус узнают по цвету раньше, чем по слову. Точка перед
// текущим значением — самый быстрый сигнал в списке задач, а настоящий
// select снизу отдаёт нам клавиатуру и системный список бесплатно: как в
// select-003, видимая плитка — просто наклейка поверх прозрачного select.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="select-011"]){
--vibeui-select-011-surface:transparent;
--vibeui-select-011-surface-border:transparent;
--vibeui-select-011-surface-pad:0;
--vibeui-select-011-surface-radius:0;
--vibeui-select-011-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-select-011-muted:color-mix(in oklab,var(--vibeui-select-011-fg) 68%,transparent);
--vibeui-select-011-border:light-dark(oklch(0.87 0 265),oklch(0.42 0 265));
--vibeui-select-011-accent:light-dark(oklch(0.287 0 0),oklch(0.905 0 0));
--vibeui-select-011-tone-open:light-dark(oklch(0.58 0.14 250),oklch(0.74 0.13 250));
--vibeui-select-011-tone-progress:light-dark(oklch(0.7 0.15 75),oklch(0.8 0.14 78));
--vibeui-select-011-tone-review:light-dark(oklch(0.58 0.15 300),oklch(0.74 0.13 300));
--vibeui-select-011-tone-done:light-dark(oklch(0.62 0.17 155),oklch(0.74 0.15 155));
--vibeui-select-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="select-011"]{color-scheme:dark}
/* Подложка появляется только вместе с пропом background: по умолчанию поле
   лежит прямо на фоне страницы. */
[data-vibeui-block="select-011"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:18rem;box-sizing:border-box;
padding:var(--vibeui-select-011-surface-pad);
background:var(--vibeui-select-011-surface);
border:1px solid var(--vibeui-select-011-surface-border);
border-radius:var(--vibeui-select-011-surface-radius);
font-family:var(--vibeui-select-011-font);color:var(--vibeui-select-011-fg);
}
[data-vibeui-block="select-011"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-011"] [data-part="field"]{position:relative;display:block}
/* Настоящий select лежит поверх плитки и невидим: клик, клавиатура и
   системный список остаются браузерными, оформление — наше. */
[data-vibeui-block="select-011"] select{
position:absolute;inset:0;width:100%;height:100%;
opacity:0;cursor:pointer;font:inherit;
}
/* Системный список рисует браузер по цветам самого <select>: у
   прозрачного он берёт белый, и в тёмной теме всплывал светлый
   список поверх тёмной страницы. */
[data-vibeui-block="select-011"] select,
[data-vibeui-block="select-011"] option,
[data-vibeui-block="select-011"] optgroup{
background-color:light-dark(oklch(1 0 0),oklch(0.24 0.01 265));color:var(--vibeui-select-011-fg);
}
[data-vibeui-block="select-011"] [data-part="trigger"]{
display:flex;align-items:center;gap:0.625rem;
box-sizing:border-box;width:100%;min-height:2.75rem;padding:0.5rem 2.25rem 0.5rem 0.875rem;
border:1px solid var(--vibeui-select-011-border);border-radius:0.625rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="select-011"] select:focus-visible + [data-part="trigger"],
[data-vibeui-block="select-011"] select:focus + [data-part="trigger"]{
border-color:var(--vibeui-select-011-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-011-accent) 22%,transparent);
}
[data-vibeui-block="select-011"] [data-part="dot"]{
flex:none;width:0.625rem;height:0.625rem;border-radius:9999px;
box-shadow:0 0 0 3px color-mix(in oklab,currentColor 16%,transparent);
}
[data-vibeui-block="select-011"] [data-part="dot"][data-tone="open"]{
background:var(--vibeui-select-011-tone-open);color:var(--vibeui-select-011-tone-open);
}
[data-vibeui-block="select-011"] [data-part="dot"][data-tone="progress"]{
background:var(--vibeui-select-011-tone-progress);color:var(--vibeui-select-011-tone-progress);
}
[data-vibeui-block="select-011"] [data-part="dot"][data-tone="review"]{
background:var(--vibeui-select-011-tone-review);color:var(--vibeui-select-011-tone-review);
}
[data-vibeui-block="select-011"] [data-part="dot"][data-tone="done"]{
background:var(--vibeui-select-011-tone-done);color:var(--vibeui-select-011-tone-done);
}
[data-vibeui-block="select-011"] [data-part="text"]{
flex:1 1 auto;min-width:0;font-size:0.9375rem;font-weight:500;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="select-011"] [data-part="arrow"]{
position:absolute;right:0.875rem;top:50%;
width:0.4375rem;height:0.4375rem;margin-top:-0.3125rem;pointer-events:none;
border-right:1.5px solid var(--vibeui-select-011-muted);
border-bottom:1.5px solid var(--vibeui-select-011-muted);
transform:rotate(45deg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Select011Option[] = [
  { value: "open", label: "Открыта", tone: "open" },
  { value: "progress", label: "В работе", tone: "progress" },
  { value: "review", label: "На проверке", tone: "review" },
  { value: "done", label: "Закрыта", tone: "done" },
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 * Считается один раз при рендере, клиентского кода не добавляет.
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
 * Select статуса с цветной точкой у текущего значения. Своя плитка,
 * системный список. Один файл, ноль зависимостей, собственная палитра.
 */
export function Select011({
  label = "Статус задачи",
  options = DEFAULT_OPTIONS,
  defaultValue = "progress",
  background = "",
  accent,
  className,
  style,
  ...props
}: Select011Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const current = options.find((option) => option.value === value) ?? options[0]

  // Подложка приходит вместе с полями и скруглением: без неё поле лежит
  // прямо на странице, и лишние поля по бокам ему только мешают.
  const palette = {
    ...(accent ? { "--vibeui-select-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-select-011-surface": background,
          "--vibeui-select-011-surface-border":
            "light-dark(oklch(0.91 0 265),oklch(0.36 0 265))",
          "--vibeui-select-011-surface-pad": "0.875rem",
          "--vibeui-select-011-surface-radius": "0.875rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="select"
        data-vibeui-block="select-011"
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
            onChange={(event) => setValue(event.target.value)}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span data-part="trigger" aria-hidden="true">
            <span data-part="dot" data-tone={current?.tone} />
            <span data-part="text">{current?.label}</span>
          </span>
          <span data-part="arrow" aria-hidden="true" />
        </span>
      </div>
    </>
  )
}

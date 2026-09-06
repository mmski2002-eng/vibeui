"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Select018Language = {
  value: string
  label: string
  code: string
}

export type Select018Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  name?: string
  languages?: Select018Language[]
  defaultValue?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: язык интерфейса называют своим именем ("Русский"), а
// сверяют по короткому коду ("RU") — оба формата живут в одной строке.
// Настоящий select лежит поверх плитки и невидим, как в select-012: клик,
// клавиатура и системный список остаются браузерными, оформление — наше.
const STYLES = `
:where([data-vibeui-block="select-018"]){
--vibeui-select-018-surface:transparent;
--vibeui-select-018-surface-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-select-018-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-select-018-muted:color-mix(in oklab,var(--vibeui-select-018-fg) 68%,transparent);
--vibeui-select-018-border:light-dark(oklch(0.87 0 265),oklch(0.4 0 265));
--vibeui-select-018-accent:light-dark(oklch(0.55 0.19 262),oklch(0.73 0.17 262));
--vibeui-select-018-tint:light-dark(oklch(0.55 0.19 262 / 12%),oklch(0.73 0.17 262 / 20%));
--vibeui-select-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-select-018-mono:ui-monospace,"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="select-018"]{color-scheme:dark}
[data-vibeui-block="select-018"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,14rem);max-width:18rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-select-018-surface);
border:1px solid var(--vibeui-select-018-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-018-font);color:var(--vibeui-select-018-fg);
container-type:inline-size;
}
[data-vibeui-block="select-018"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-018"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="select-018"] select{
position:absolute;inset:0;width:100%;height:100%;
opacity:0;cursor:pointer;font:inherit;
}
/* Системный список рисует браузер по цветам самого <select>: у
   прозрачного он берёт белый, и в тёмной теме всплывал светлый
   список поверх тёмной страницы. */
[data-vibeui-block="select-018"] select,
[data-vibeui-block="select-018"] option,
[data-vibeui-block="select-018"] optgroup{
background-color:light-dark(oklch(1 0 0),oklch(0.24 0.01 265));color:var(--vibeui-select-018-fg);
}
[data-vibeui-block="select-018"] [data-part="trigger"]{
display:flex;align-items:center;gap:0.625rem;
box-sizing:border-box;width:100%;min-height:2.75rem;padding:0.5rem 0.75rem;
border:1px solid var(--vibeui-select-018-border);border-radius:0.625rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="select-018"] select:focus-visible + [data-part="trigger"],
[data-vibeui-block="select-018"] select:focus + [data-part="trigger"]{
border-color:var(--vibeui-select-018-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-018-accent) 22%,transparent);
}
[data-vibeui-block="select-018"] [data-part="name"]{
flex:1 1 auto;min-width:0;font-size:0.9375rem;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="select-018"] [data-part="code"]{
flex:none;padding:0.125rem 0.4375rem;border-radius:0.375rem;
background:var(--vibeui-select-018-tint);color:var(--vibeui-select-018-accent);
font-family:var(--vibeui-select-018-mono);font-size:0.75rem;font-weight:700;letter-spacing:0.04em;
}
@container (max-width: 13rem){
[data-vibeui-block="select-018"] [data-part="trigger"]{padding:0.5rem 0.625rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-018"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LANGUAGES: Select018Language[] = [
  { value: "ru", label: "Русский", code: "RU" },
  { value: "en", label: "English", code: "EN" },
  { value: "de", label: "Deutsch", code: "DE" },
  { value: "es", label: "Español", code: "ES" },
  { value: "zh", label: "中文", code: "ZH" },
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
 * Select языка интерфейса: полное имя языка слева, короткий код справа.
 * Своя плитка поверх настоящего select. Один файл, ноль зависимостей,
 * собственная палитра.
 */
export function Select018({
  label = "Язык интерфейса",
  name,
  languages = DEFAULT_LANGUAGES,
  defaultValue = languages[0]?.value,
  background = "",
  accent,
  id,
  className,
  style,
  ...props
}: Select018Props) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const [value, setValue] = useState(defaultValue ?? DEFAULT_LANGUAGES[0].value)
  const current =
    languages.find((language) => language.value === value) ?? languages[0]

  const palette = {
    ...(accent ? { "--vibeui-select-018-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-select-018-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-018" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="select"
        data-vibeui-block="select-018"
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={fieldId}>
          {label}
        </label>
        <span data-part="field">
          <select
            id={fieldId}
            name={name}
            value={value}
            onChange={(event) => setValue(event.target.value)}
          >
            {languages.map((language) => (
              <option key={language.value} value={language.value}>
                {language.label} · {language.code}
              </option>
            ))}
          </select>
          <span data-part="trigger" aria-hidden="true">
            <span data-part="name">{current?.label}</span>
            <span data-part="code">{current?.code}</span>
          </span>
        </span>
      </div>
    </>
  )
}

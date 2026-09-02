import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Radio015Variant = "light" | "dark" | "system"

export type Radio015Option = {
  value: Radio015Variant
  label: string
}

export type Radio015Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  options?: Radio015Option[]
  name?: string
  defaultValue?: Radio015Variant
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: выбор темы по картинке, а не по слову. Миниатюра — не
// фотография, а нарисованная в CSS полоска шапки и две строки контента:
// этого достаточно, чтобы «светлая» и «тёмная» читались с одного взгляда.
// У системной темы миниатюра честно разделена пополам — она и есть обе сразу.
//
// Тема берётся из color-scheme окружения через light-dark(): её слушается
// обвязка, но не сами миниатюры — те обязаны показывать оба варианта всегда.
const STYLES = `
:where([data-vibeui-block="radio-015"]){
--vibeui-radio-015-bg:transparent;
--vibeui-radio-015-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-radio-015-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-radio-015-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-radio-015-ring:light-dark(oklch(0.74 0.012 265),oklch(0.5 0.014 265));
--vibeui-radio-015-accent:light-dark(oklch(0.55 0.17 260),oklch(0.75 0.15 260));
--vibeui-radio-015-tint:light-dark(oklch(0.55 0.17 260 / 7%),oklch(0.75 0.15 260 / 16%));
/* Миниатюры остаются фиксированными: они рисуют светлую и тёмную тему как
   картинку выбора, а не как оформление компонента. */
--vibeui-radio-015-thumb-light-bg:oklch(0.98 0.002 265);
--vibeui-radio-015-thumb-light-bar:oklch(0.9 0.006 265);
--vibeui-radio-015-thumb-light-line:oklch(0.8 0.006 265);
--vibeui-radio-015-thumb-dark-bg:oklch(0.24 0.012 265);
--vibeui-radio-015-thumb-dark-bar:oklch(0.34 0.012 265);
--vibeui-radio-015-thumb-dark-line:oklch(0.56 0.012 265);
--vibeui-radio-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="radio-015"]{
display:flex;flex-direction:column;
width:100%;max-width:22rem;box-sizing:border-box;
margin:0;padding:0.5rem 0.875rem 0.875rem;
background:var(--vibeui-radio-015-bg);
border:1px solid var(--vibeui-radio-015-border);border-radius:0.875rem;
font-family:var(--vibeui-radio-015-font);color:var(--vibeui-radio-015-fg);
}
[data-vibeui-block="radio-015"] legend{
float:left;width:100%;padding:0;margin:0.375rem 0 0.625rem;
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="radio-015"] [data-part="grid"]{
clear:both;display:grid;gap:0.625rem;
grid-template-columns:repeat(auto-fit,minmax(5.5rem,1fr));
}
[data-vibeui-block="radio-015"] [data-part="tile"]{
display:flex;flex-direction:column;align-items:center;gap:0.4375rem;
padding:0.5rem;border-radius:0.75rem;cursor:pointer;
border:1.5px solid var(--vibeui-radio-015-border);
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="radio-015"] [data-part="tile"]:has(input:checked){
border-color:var(--vibeui-radio-015-accent);background:var(--vibeui-radio-015-tint);
}
[data-vibeui-block="radio-015"] [data-part="tile"]:has(input:focus-visible){
outline:2px solid var(--vibeui-radio-015-accent);outline-offset:2px;
}
[data-vibeui-block="radio-015"] input{
position:absolute;width:1px;height:1px;margin:0;
clip-path:inset(50%);overflow:hidden;white-space:nowrap;
}
[data-vibeui-block="radio-015"] [data-part="thumb"]{
display:flex;flex-direction:column;width:100%;height:3rem;
border-radius:0.5rem;overflow:hidden;
border:1px solid var(--vibeui-radio-015-border);
}
[data-vibeui-block="radio-015"] [data-part="thumb-bar"]{height:0.375rem;flex:none}
[data-vibeui-block="radio-015"] [data-part="thumb-body"]{
flex:1 1 auto;display:flex;flex-direction:column;justify-content:center;
gap:0.25rem;padding:0 0.5rem;
}
[data-vibeui-block="radio-015"] [data-part="thumb-line"]{height:0.1875rem;border-radius:9999px}
[data-vibeui-block="radio-015"] [data-part="thumb-line"][data-w="full"]{width:70%}
[data-vibeui-block="radio-015"] [data-part="thumb-line"][data-w="short"]{width:42%}
[data-vibeui-block="radio-015"] [data-part="thumb"][data-variant="light"]{background:var(--vibeui-radio-015-thumb-light-bg)}
[data-vibeui-block="radio-015"] [data-part="thumb"][data-variant="light"] [data-part="thumb-bar"]{background:var(--vibeui-radio-015-thumb-light-bar)}
[data-vibeui-block="radio-015"] [data-part="thumb"][data-variant="light"] [data-part="thumb-line"]{background:var(--vibeui-radio-015-thumb-light-line)}
[data-vibeui-block="radio-015"] [data-part="thumb"][data-variant="dark"]{background:var(--vibeui-radio-015-thumb-dark-bg)}
[data-vibeui-block="radio-015"] [data-part="thumb"][data-variant="dark"] [data-part="thumb-bar"]{background:var(--vibeui-radio-015-thumb-dark-bar)}
[data-vibeui-block="radio-015"] [data-part="thumb"][data-variant="dark"] [data-part="thumb-line"]{background:var(--vibeui-radio-015-thumb-dark-line)}
[data-vibeui-block="radio-015"] [data-part="thumb"][data-variant="system"]{
background:linear-gradient(90deg,var(--vibeui-radio-015-thumb-light-bg) 50%,var(--vibeui-radio-015-thumb-dark-bg) 50%);
}
[data-vibeui-block="radio-015"] [data-part="thumb"][data-variant="system"] [data-part="thumb-bar"]{
background:linear-gradient(90deg,var(--vibeui-radio-015-thumb-light-bar) 50%,var(--vibeui-radio-015-thumb-dark-bar) 50%);
}
[data-vibeui-block="radio-015"] [data-part="thumb"][data-variant="system"] [data-part="thumb-line"]{
background:linear-gradient(90deg,var(--vibeui-radio-015-thumb-light-line) 50%,var(--vibeui-radio-015-thumb-dark-line) 50%);
}
[data-vibeui-block="radio-015"] [data-part="name"]{font-size:0.75rem;font-weight:600}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="radio-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Radio015Option[] = [
  { value: "light", label: "Светлая" },
  { value: "dark", label: "Тёмная" },
  { value: "system", label: "Системная" },
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
 * Выбор темы оформления миниатюрами: полоска шапки и строки контента в CSS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Radio015({
  legend = "Тема оформления",
  options = DEFAULT_OPTIONS,
  name = "vibeui-radio-015",
  defaultValue = "system",
  background = "",
  accent,
  className,
  style,
  ...props
}: Radio015Props) {
  const palette = {
    ...(accent ? { "--vibeui-radio-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-radio-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-radio-015" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="radio-015"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <div data-part="grid">
          {options.map((option) => (
            <label key={option.value} data-part="tile">
              <input
                type="radio"
                name={name}
                value={option.value}
                defaultChecked={option.value === defaultValue}
              />
              <span
                data-part="thumb"
                data-variant={option.value}
                aria-hidden="true"
              >
                <span data-part="thumb-bar" />
                <span data-part="thumb-body">
                  <span data-part="thumb-line" data-w="full" />
                  <span data-part="thumb-line" data-w="short" />
                </span>
              </span>
              <span data-part="name">{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  )
}

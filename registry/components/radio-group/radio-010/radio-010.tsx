import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Radio010Option = {
  value: string
  label: string
  /** Путь иконки в системе координат 24×24. */
  path: string
}

export type Radio010Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  options?: Radio010Option[]
  name?: string
  defaultValue?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: переключатель вида — иконка над подписью в общей рамке,
// без единой подложки, которая переезжает между сегментами. Каждый сегмент
// красится сам по себе через :has(input:checked), поэтому раскладка не
// завязана на порядок и количество вариантов, как это нужно у подложки.
//
// Тема берётся из color-scheme окружения через light-dark().
const STYLES = `
:where([data-vibeui-block="radio-010"]){
--vibeui-radio-010-bg:transparent;
--vibeui-radio-010-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-radio-010-muted:light-dark(oklch(0.5 0.014 265),oklch(0.72 0.012 265));
--vibeui-radio-010-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-radio-010-rail:light-dark(oklch(0.97 0.003 265),oklch(0.29 0.008 265));
--vibeui-radio-010-accent:light-dark(oklch(0.52 0.17 235),oklch(0.66 0.15 235));
--vibeui-radio-010-on-accent:light-dark(oklch(1 0 0),oklch(0.15 0.02 235));
--vibeui-radio-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-radio-010-count:3;
}
[data-vibeui-block="radio-010"]{
display:flex;flex-direction:column;
width:100%;max-width:20rem;box-sizing:border-box;
margin:0;padding:0.5rem 0.875rem 0.875rem;
background:var(--vibeui-radio-010-bg);
border:1px solid var(--vibeui-radio-010-border);border-radius:0.875rem;
font-family:var(--vibeui-radio-010-font);color:var(--vibeui-radio-010-fg);
}
[data-vibeui-block="radio-010"] legend{
float:left;width:100%;padding:0;margin:0.375rem 0 0.5rem;
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-radio-010-muted);
}
[data-vibeui-block="radio-010"] [data-part="rail"]{
clear:both;display:grid;gap:0.25rem;
grid-template-columns:repeat(var(--vibeui-radio-010-count),1fr);
padding:0.25rem;border-radius:0.75rem;background:var(--vibeui-radio-010-rail);
}
[data-vibeui-block="radio-010"] [data-part="seg"]{
display:flex;flex-direction:column;align-items:center;gap:0.25rem;
padding:0.5rem 0.375rem;border-radius:0.625rem;cursor:pointer;
color:var(--vibeui-radio-010-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="radio-010"] [data-part="seg"]:has(input:checked){
background:var(--vibeui-radio-010-accent);color:var(--vibeui-radio-010-on-accent);
}
[data-vibeui-block="radio-010"] [data-part="seg"]:has(input:focus-visible){
outline:2px solid var(--vibeui-radio-010-accent);outline-offset:2px;
}
/* Радио спрятано визуально, но не от клавиатуры: стрелки переключают
   сегмент, а Tab заводит фокус в группу. */
[data-vibeui-block="radio-010"] input{
position:absolute;width:1px;height:1px;margin:0;
clip-path:inset(50%);overflow:hidden;white-space:nowrap;
}
[data-vibeui-block="radio-010"] svg{width:1.25rem;height:1.25rem;display:block}
[data-vibeui-block="radio-010"] [data-part="name"]{font-size:0.6875rem;font-weight:600;line-height:1.2}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="radio-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Radio010Option[] = [
  {
    value: "list",
    label: "Список",
    path: "M4 6h16M4 12h16M4 18h16",
  },
  {
    value: "grid",
    label: "Плитки",
    path: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  },
  {
    value: "table",
    label: "Таблица",
    path: "M3 5h18v14H3zM3 10h18M9 5v14",
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
 * Сегментированный переключатель вида с иконками: заливка сегмента по
 * :has(), без общей подложки. Один файл, ноль зависимостей, своя палитра.
 */
export function Radio010({
  legend = "Вид списка",
  options = DEFAULT_OPTIONS,
  name = "vibeui-radio-010",
  defaultValue = "grid",
  background = "",
  accent,
  className,
  style,
  ...props
}: Radio010Props) {
  const palette = {
    "--vibeui-radio-010-count": String(options.length),
    ...(accent ? { "--vibeui-radio-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-radio-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-radio-010" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="radio-010"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <div data-part="rail">
          {options.map((option) => (
            <label key={option.value} data-part="seg">
              <input
                type="radio"
                name={name}
                value={option.value}
                defaultChecked={option.value === defaultValue}
              />
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d={option.path}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span data-part="name">{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  )
}

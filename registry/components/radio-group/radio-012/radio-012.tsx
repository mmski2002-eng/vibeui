import type { ComponentProps, CSSProperties } from "react"

export type Radio012Option = {
  value: string
  label: string
  /** Цвет образца: любое значение CSS `background-color` (hex, oklch...). */
  color: string
}

export type Radio012Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  options?: Radio012Option[]
  name?: string
  defaultValue?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: выбор цвета образцом, а не подписью. Кружок несёт сам
// цвет как фон — значение приходит из данных и не выражается классом,
// поэтому это тот самый случай, когда инлайн-стиль оправдан. Кольцо вокруг
// выбранного образца рисуется двойной тенью: зазор цвета фона и акцент.
//
// Тема берётся из color-scheme окружения через light-dark().
const STYLES = `
:where([data-vibeui-block="radio-012"]){
--vibeui-radio-012-bg:transparent;
--vibeui-radio-012-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-radio-012-muted:color-mix(in oklab,var(--vibeui-radio-012-fg) 68%,transparent);
--vibeui-radio-012-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-radio-012-accent:light-dark(oklch(0.5 0.03 265),oklch(0.8 0.02 265));
--vibeui-radio-012-edge:light-dark(oklch(0 0 0 / 10%),oklch(1 0 0 / 18%));
--vibeui-radio-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="radio-012"]{color-scheme:dark}
[data-vibeui-block="radio-012"]{
display:flex;flex-direction:column;
width:100%;max-width:20rem;box-sizing:border-box;
margin:0;padding:0.5rem 0.875rem 0.875rem;
background:var(--vibeui-radio-012-bg);
border:1px solid var(--vibeui-radio-012-border);border-radius:0.875rem;
font-family:var(--vibeui-radio-012-font);color:var(--vibeui-radio-012-fg);
}
[data-vibeui-block="radio-012"] legend{
float:left;width:100%;padding:0;margin:0.375rem 0 0.625rem;
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="radio-012"] [data-part="grid"]{
clear:both;display:grid;gap:0.625rem;
grid-template-columns:repeat(auto-fit,minmax(4.5rem,1fr));
}
[data-vibeui-block="radio-012"] [data-part="option"]{
display:flex;flex-direction:column;align-items:center;gap:0.375rem;
padding:0.25rem;border-radius:0.625rem;cursor:pointer;
}
[data-vibeui-block="radio-012"] [data-part="option"]:has(input:focus-visible) [data-part="swatch"]{
outline:2px solid var(--vibeui-radio-012-accent);outline-offset:2px;
}
[data-vibeui-block="radio-012"] input{
position:absolute;width:1px;height:1px;margin:0;
clip-path:inset(50%);overflow:hidden;white-space:nowrap;
}
[data-vibeui-block="radio-012"] [data-part="swatch"]{
width:2.5rem;height:2.5rem;border-radius:9999px;
box-shadow:inset 0 0 0 1px var(--vibeui-radio-012-edge);
transition:box-shadow .16s ease;
}
/* Кольцо у выбранного образца: первая тень — зазор цвета подложки (по
   умолчанию прозрачной, то есть цвета страницы), вторая — акцент.
   Проверка своего цвета через :has() значения не нужна. */
[data-vibeui-block="radio-012"] [data-part="option"]:has(input:checked) [data-part="swatch"]{
box-shadow:inset 0 0 0 1px var(--vibeui-radio-012-edge),0 0 0 2px var(--vibeui-radio-012-bg),0 0 0 4px var(--vibeui-radio-012-accent);
}
[data-vibeui-block="radio-012"] [data-part="name"]{
font-size:0.6875rem;color:var(--vibeui-radio-012-muted);text-align:center;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="radio-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Radio012Option[] = [
  { value: "black", label: "Чёрный", color: "#18181b" },
  { value: "white", label: "Белый", color: "#f5f5f4" },
  { value: "blue", label: "Синий", color: "#2563eb" },
  { value: "olive", label: "Оливковый", color: "#4d7c0f" },
  { value: "terracotta", label: "Терракотовый", color: "#c2410c" },
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
 * Выбор цвета образцами: кольцо на выбранном, значение цвета — инлайн-стиль.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Radio012({
  legend = "Цвет",
  options = DEFAULT_OPTIONS,
  name = "vibeui-radio-012",
  defaultValue = "blue",
  background = "",
  accent,
  className,
  style,
  ...props
}: Radio012Props) {
  const palette = {
    ...(accent ? { "--vibeui-radio-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-radio-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-radio-012" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="radio-group"
        data-vibeui-block="radio-012"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <form data-part="grid">
          {options.map((option) => (
            <label key={option.value} data-part="option">
              <input
                type="radio"
                name={name}
                value={option.value}
                defaultChecked={option.value === defaultValue}
              />
              <span
                data-part="swatch"
                style={{ backgroundColor: option.color }}
                aria-hidden="true"
              />
              <span data-part="name">{option.label}</span>
            </label>
          ))}
        </form>
      </fieldset>
    </>
  )
}

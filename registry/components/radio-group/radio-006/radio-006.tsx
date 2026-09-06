import type { ComponentProps, CSSProperties } from "react"

export type Radio006Option = {
  value: string
  label: string
  /** Путь иконки в системе координат 24×24. */
  path: string
}

export type Radio006Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  options?: Radio006Option[]
  name?: string
  defaultValue?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: выбор по узнаваемой форме, а не по чтению. Плитки с
// иконками сканируются быстрее списка, поэтому подпись здесь вторична, а
// иконка занимает половину высоты. Иконки — inline-SVG с currentColor:
// пакет иконок потянул бы зависимость, а компонент обязан быть один файл.
//
// Тема берётся из color-scheme окружения через light-dark().
const STYLES = `
:where([data-vibeui-block="radio-006"]){
--vibeui-radio-006-bg:transparent;
--vibeui-radio-006-card:light-dark(oklch(0.99 0 265),oklch(0.27 0 265));
--vibeui-radio-006-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-radio-006-muted:color-mix(in oklab,var(--vibeui-radio-006-fg) 68%,transparent);
--vibeui-radio-006-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-radio-006-accent:light-dark(oklch(0.55 0.19 30),oklch(0.75 0.15 30));
--vibeui-radio-006-tint:light-dark(oklch(0.55 0.19 30 / 8%),oklch(0.75 0.15 30 / 16%));
--vibeui-radio-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="radio-006"]{color-scheme:dark}
[data-vibeui-block="radio-006"]{
display:flex;flex-direction:column;
width:100%;max-width:22rem;box-sizing:border-box;
margin:0;padding:0.5rem 0.875rem 0.875rem;
background:var(--vibeui-radio-006-bg);
border:1px solid var(--vibeui-radio-006-border);border-radius:0.875rem;
font-family:var(--vibeui-radio-006-font);color:var(--vibeui-radio-006-fg);
}
[data-vibeui-block="radio-006"] legend{
float:left;width:100%;padding:0;margin:0.375rem 0 0.5rem;
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="radio-006"] [data-part="grid"]{
clear:both;display:grid;gap:0.5rem;
grid-template-columns:repeat(auto-fit,minmax(5rem,1fr));
}
[data-vibeui-block="radio-006"] [data-part="tile"]{
display:flex;flex-direction:column;align-items:center;gap:0.375rem;
padding:0.75rem 0.375rem;border-radius:0.75rem;cursor:pointer;text-align:center;
border:1.5px solid var(--vibeui-radio-006-border);
background:var(--vibeui-radio-006-card);
color:var(--vibeui-radio-006-muted);
transition:border-color .16s ease,background-color .16s ease,color .16s ease;
}
[data-vibeui-block="radio-006"] [data-part="tile"]:hover{border-color:var(--vibeui-radio-006-muted)}
[data-vibeui-block="radio-006"] [data-part="tile"]:has(input:checked){
border-color:var(--vibeui-radio-006-accent);
background:var(--vibeui-radio-006-tint);
color:var(--vibeui-radio-006-accent);
}
[data-vibeui-block="radio-006"] [data-part="tile"]:has(input:focus-visible){
outline:2px solid var(--vibeui-radio-006-accent);outline-offset:2px;
}
[data-vibeui-block="radio-006"] input{
position:absolute;width:1px;height:1px;margin:0;
clip-path:inset(50%);overflow:hidden;white-space:nowrap;
}
/* Иконка наследует цвет плитки: одно правило красит и рисунок, и подпись. */
[data-vibeui-block="radio-006"] svg{width:1.5rem;height:1.5rem;display:block}
[data-vibeui-block="radio-006"] [data-part="name"]{
font-size:0.75rem;font-weight:600;line-height:1.2;color:var(--vibeui-radio-006-fg);
}
[data-vibeui-block="radio-006"] [data-part="tile"]:has(input:checked) [data-part="name"]{color:var(--vibeui-radio-006-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="radio-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Radio006Option[] = [
  {
    value: "phone",
    label: "Телефон",
    path: "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm3 17h4",
  },
  {
    value: "tablet",
    label: "Планшет",
    path: "M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm6 17h2",
  },
  {
    value: "laptop",
    label: "Ноутбук",
    path: "M4 5h16v11H4zM2 19h20",
  },
  {
    value: "tv",
    label: "Телевизор",
    path: "M3 6h18v12H3zM8 21h8M12 18v3",
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
 * Радиогруппа плитками с иконками: inline-SVG на currentColor, без пакетов.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Radio006({
  legend = "Основное устройство",
  options = DEFAULT_OPTIONS,
  name = "vibeui-radio-006",
  defaultValue = "laptop",
  background = "",
  accent,
  className,
  style,
  ...props
}: Radio006Props) {
  const palette = {
    ...(accent ? { "--vibeui-radio-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-radio-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-radio-006" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="radio-group"
        data-vibeui-block="radio-006"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <form data-part="grid">
          {options.map((option) => (
            <label key={option.value} data-part="tile">
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
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span data-part="name">{option.label}</span>
            </label>
          ))}
        </form>
      </fieldset>
    </>
  )
}

import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Select021Option = {
  value: string
  label: string
  icon: string
}

export type Select021Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  name?: string
  options?: Select021Option[]
  defaultValue?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: список остаётся настоящим нативным <select> — без
// прозрачного оверлея и своей плитки, как в select-003/select-011. Иконка
// живёт прямо в тексте option символом, поэтому список открывает система
// в неизменном виде, а глаз всё равно цепляется за значок.
const STYLES = `
:where([data-vibeui-block="select-021"]){
--vibeui-select-021-surface:transparent;
--vibeui-select-021-surface-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-select-021-fg:light-dark(oklch(0.23 0.016 265),oklch(0.94 0.005 265));
--vibeui-select-021-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-select-021-field:light-dark(oklch(0.985 0.002 265),oklch(0.27 0.012 265));
--vibeui-select-021-border:light-dark(oklch(0.87 0.008 265),oklch(0.42 0.012 265));
--vibeui-select-021-accent:light-dark(oklch(0.55 0.19 262),oklch(0.73 0.17 262));
--vibeui-select-021-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="select-021"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:19rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-select-021-surface);
border:1px solid var(--vibeui-select-021-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-021-font);color:var(--vibeui-select-021-fg);
container-type:inline-size;
}
[data-vibeui-block="select-021"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-021"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="select-021"] select{
appearance:none;-webkit-appearance:none;
width:100%;box-sizing:border-box;margin:0;height:2.75rem;
padding:0 2.75rem 0 0.875rem;
border:1px solid var(--vibeui-select-021-border);border-radius:0.625rem;
background:var(--vibeui-select-021-field);color:inherit;
font:inherit;font-size:0.9375rem;cursor:pointer;
}
[data-vibeui-block="select-021"] select:focus-visible{
outline:none;border-color:var(--vibeui-select-021-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-021-accent) 22%,transparent);
}
[data-vibeui-block="select-021"] [data-part="arrow"]{
position:absolute;right:1rem;top:50%;
width:0.4375rem;height:0.4375rem;margin-top:-0.3125rem;pointer-events:none;
border-right:1.5px solid var(--vibeui-select-021-muted);
border-bottom:1.5px solid var(--vibeui-select-021-muted);
transform:rotate(45deg);
}
@container (max-width: 12rem){
[data-vibeui-block="select-021"] select{font-size:0.875rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-021"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Select021Option[] = [
  { value: "email", label: "Email", icon: "✉" },
  { value: "phone", label: "Телефон", icon: "☎" },
  { value: "telegram", label: "Telegram", icon: "✈" },
  { value: "whatsapp", label: "WhatsApp", icon: "💬" },
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
 * Select с иконкой у каждого варианта в честном нативном стиле: список
 * открывает система, значок — обычный символ перед текстом option и перед
 * текстом в самом поле. Один файл, ноль зависимостей, серверный компонент.
 */
export function Select021({
  label = "Способ связи",
  name,
  options = DEFAULT_OPTIONS,
  defaultValue = options[0]?.value,
  background = "",
  accent,
  id,
  className,
  style,
  ...props
}: Select021Props) {
  const palette = {
    ...(accent ? { "--vibeui-select-021-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-select-021-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-021" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="select-021"
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={id}>
          {label}
        </label>
        <span data-part="field">
          <select id={id} name={name} defaultValue={defaultValue}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
          <span data-part="arrow" aria-hidden="true" />
        </span>
      </div>
    </>
  )
}

import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Select024Option = {
  value: string
  label: string
  disabled?: boolean
  reason?: string
}

export type Select024Props = Omit<
  ComponentProps<"select">,
  "size" | "children"
> & {
  label?: string
  options?: Select024Option[]
  placeholder?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: title на disabled-варианте показывает причину только
// при наведении мышью и не доходит до скринридера и до тачскрина, поэтому
// причины продублированы отдельным списком под полем — так недоступный
// вариант не выглядит как баг каталога.
const STYLES = `
:where([data-vibeui-block="select-024"]){
--vibeui-select-024-surface:transparent;
--vibeui-select-024-surface-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-select-024-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-select-024-muted:color-mix(in oklab,var(--vibeui-select-024-fg) 68%,transparent);
--vibeui-select-024-field:light-dark(oklch(0.985 0 265),oklch(0.27 0 265));
--vibeui-select-024-border:light-dark(oklch(0.87 0 265),oklch(0.42 0 265));
--vibeui-select-024-accent:light-dark(oklch(0.287 0 0),oklch(0.901 0 0));
--vibeui-select-024-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="select-024"]{color-scheme:dark}
[data-vibeui-block="select-024"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-select-024-surface);
border:1px solid var(--vibeui-select-024-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-024-font);color:var(--vibeui-select-024-fg);
container-type:inline-size;
}
[data-vibeui-block="select-024"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-024"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="select-024"] select{
appearance:none;-webkit-appearance:none;
width:100%;box-sizing:border-box;margin:0;height:2.75rem;
padding:0 2.5rem 0 0.875rem;
border:1px solid var(--vibeui-select-024-border);border-radius:0.625rem;
background:var(--vibeui-select-024-field);color:inherit;
font:inherit;font-size:0.9375rem;cursor:pointer;
transition:border-color .16s ease,box-shadow .16s ease;
}
/* Системный список рисует браузер по цветам самого <select>: у
   прозрачного он берёт белый, и в тёмной теме всплывал светлый
   список поверх тёмной страницы. */
[data-vibeui-block="select-024"] select,
[data-vibeui-block="select-024"] option,
[data-vibeui-block="select-024"] optgroup{
background-color:var(--vibeui-select-024-field);color:var(--vibeui-select-024-fg);
}
[data-vibeui-block="select-024"] select:focus-visible{
outline:none;border-color:var(--vibeui-select-024-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-024-accent) 22%,transparent);
}
[data-vibeui-block="select-024"] option:disabled{color:var(--vibeui-select-024-muted)}
[data-vibeui-block="select-024"] [data-part="arrow"]{
position:absolute;right:1rem;top:50%;
width:0.4375rem;height:0.4375rem;margin-top:-0.3125rem;pointer-events:none;
border-right:1.5px solid var(--vibeui-select-024-muted);
border-bottom:1.5px solid var(--vibeui-select-024-muted);
transform:rotate(45deg);
}
[data-vibeui-block="select-024"] [data-part="reasons"]{
margin:0;padding:0;list-style:none;
display:flex;flex-direction:column;gap:0.25rem;
}
[data-vibeui-block="select-024"] [data-part="reason"]{
display:flex;gap:0.375rem;font-size:0.75rem;line-height:1.4;color:var(--vibeui-select-024-muted);
}
[data-vibeui-block="select-024"] [data-part="reason-name"]{
flex:none;font-weight:600;color:var(--vibeui-select-024-fg);
}
@container (max-width: 14rem){
[data-vibeui-block="select-024"] [data-part="reason"]{flex-direction:column;gap:0.0625rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-024"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Select024Option[] = [
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L", disabled: true, reason: "нет в наличии" },
  { value: "xl", label: "XL" },
  { value: "xxl", label: "XXL", disabled: true, reason: "снят с продажи" },
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
 * Select с частично запрещёнными вариантами: disabled-опции остаются в
 * списке и видны, а причина недоступности продублирована текстом под
 * полем. Один файл, ноль зависимостей, серверный компонент.
 */
export function Select024({
  label = "Размер",
  options = DEFAULT_OPTIONS,
  placeholder = "Выберите размер",
  background = "",
  accent,
  id,
  className,
  style,
  defaultValue,
  ...props
}: Select024Props) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const reasonsId = `${fieldId}-reasons`
  const disabledOptions = options.filter(
    (option) => option.disabled && option.reason,
  )

  const palette = {
    ...(accent ? { "--vibeui-select-024-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-select-024-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-024" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="select"
        data-vibeui-block="select-024"
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={fieldId}>
          {label}
        </label>
        <span data-part="field">
          <select
            {...props}
            id={fieldId}
            aria-describedby={disabledOptions.length ? reasonsId : undefined}
            defaultValue={defaultValue ?? (placeholder ? "" : undefined)}
          >
            {placeholder ? (
              <option value="" disabled>
                {placeholder}
              </option>
            ) : null}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                title={option.reason}
              >
                {option.label}
                {option.disabled && option.reason ? ` — ${option.reason}` : ""}
              </option>
            ))}
          </select>
          <span data-part="arrow" aria-hidden="true" />
        </span>
        {disabledOptions.length ? (
          <ul data-part="reasons" id={reasonsId}>
            {disabledOptions.map((option) => (
              <li key={option.value} data-part="reason">
                <span data-part="reason-name">{option.label}:</span>
                <span>{option.reason}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </>
  )
}

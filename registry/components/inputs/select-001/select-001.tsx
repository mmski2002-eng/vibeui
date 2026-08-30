import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Select001Option = {
  value: string
  label: string
}

export type Select001Props = Omit<
  ComponentPropsWithoutRef<"select">,
  "size" | "children"
> & {
  label?: string
  options?: Select001Option[]
  /** Первая строка-заглушка. Пустая строка убирает её. */
  placeholder?: string
  size?: "md" | "lg"
  accent?: string
}

// Идея компонента: нативный <select> с одетой рамкой. Список открывает
// система, поэтому на телефоне это привычное колесо, а не самодельное меню,
// которое ломает прокрутку и клавиатуру. От нас — только рамка и стрелка.
const STYLES = `
:where([data-vibeui-block="select-001"]){
--vibeui-select-001-fg:oklch(0.24 0.016 265);
--vibeui-select-001-muted:oklch(0.54 0.014 265);
--vibeui-select-001-bg:oklch(1 0 0);
--vibeui-select-001-border:oklch(0.87 0.008 265);
--vibeui-select-001-accent:oklch(0.55 0.2 262);
--vibeui-select-001-radius:0.625rem;
--vibeui-select-001-height:2.75rem;
--vibeui-select-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="select-001"]{
display:flex;flex-direction:column;gap:0.375rem;
font-family:var(--vibeui-select-001-font);color:var(--vibeui-select-001-fg);
}
[data-vibeui-block="select-001"][data-size="lg"]{--vibeui-select-001-height:3.25rem}
[data-vibeui-block="select-001"] [data-part="label"]{font-size:0.8125rem;font-weight:500}
[data-vibeui-block="select-001"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="select-001"] select{
appearance:none;-webkit-appearance:none;
width:100%;box-sizing:border-box;margin:0;
height:var(--vibeui-select-001-height);
padding:0 2.5rem 0 0.875rem;
border:1px solid var(--vibeui-select-001-border);
border-radius:var(--vibeui-select-001-radius);
background:var(--vibeui-select-001-bg);color:inherit;
font:inherit;font-size:0.9375rem;line-height:1.2;cursor:pointer;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="select-001"] select:hover:not(:disabled):not(:focus){border-color:var(--vibeui-select-001-muted)}
[data-vibeui-block="select-001"] select:focus{
outline:none;border-color:var(--vibeui-select-001-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-001-accent) 22%,transparent);
}
[data-vibeui-block="select-001"] select:disabled{
cursor:not-allowed;opacity:.55;
background:color-mix(in oklab,var(--vibeui-select-001-border) 25%,var(--vibeui-select-001-bg));
}
/* Стрелка нарисована двумя гранями квадрата: иконочная библиотека не нужна. */
[data-vibeui-block="select-001"] [data-part="arrow"]{
position:absolute;right:1rem;top:50%;
width:0.4375rem;height:0.4375rem;
margin-top:-0.3125rem;pointer-events:none;
border-right:1.5px solid var(--vibeui-select-001-muted);
border-bottom:1.5px solid var(--vibeui-select-001-muted);
transform:rotate(45deg);
transition:border-color .16s ease;
}
[data-vibeui-block="select-001"] select:focus + [data-part="arrow"]{
border-right-color:var(--vibeui-select-001-accent);
border-bottom-color:var(--vibeui-select-001-accent);
}
[data-vibeui-block="select-001"] [data-part="placeholder"]{color:var(--vibeui-select-001-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Select001Option[] = [
  { value: "landing", label: "Лендинг" },
  { value: "dashboard", label: "Личный кабинет" },
  { value: "shop", label: "Интернет-магазин" },
  { value: "blog", label: "Блог" },
]

/**
 * Нативный select в собственной рамке: системный список, своя типографика.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Select001({
  label = "Тип проекта",
  options = DEFAULT_OPTIONS,
  placeholder = "Выберите вариант",
  size = "md",
  accent,
  id,
  className,
  style,
  defaultValue,
  ...props
}: Select001Props) {
  const palette = {
    ...(accent ? { "--vibeui-select-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-001" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="select-001"
        data-size={size}
        className={className}
        style={palette}
      >
        {label ? (
          <label data-part="label" htmlFor={id}>
            {label}
          </label>
        ) : null}
        <span data-part="field">
          <select
            {...props}
            id={id}
            defaultValue={defaultValue ?? (placeholder ? "" : undefined)}
          >
            {placeholder ? (
              <option data-part="placeholder" value="" disabled>
                {placeholder}
              </option>
            ) : null}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span data-part="arrow" aria-hidden="true" />
        </span>
      </div>
    </>
  )
}

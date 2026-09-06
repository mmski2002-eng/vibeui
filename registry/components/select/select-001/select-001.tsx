import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Select001Option = {
  value: string
  label: string
}

export type Select001Props = Omit<
  ComponentProps<"select">,
  "size" | "children"
> & {
  label?: string
  options?: Select001Option[]
  /** Первая строка-заглушка. Пустая строка убирает её. */
  placeholder?: string
  size?: "md" | "lg"
  /** Пусто — подложки нет, поле лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: нативный <select> с одетой рамкой. Список открывает
// система, поэтому на телефоне это привычное колесо, а не самодельное меню,
// которое ломает прокрутку и клавиатуру. От нас — только рамка и стрелка.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="select-001"]){
--vibeui-select-001-surface:transparent;
--vibeui-select-001-surface-border:transparent;
--vibeui-select-001-surface-pad:0;
--vibeui-select-001-surface-radius:0;
--vibeui-select-001-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-select-001-muted:color-mix(in oklab,var(--vibeui-select-001-fg) 68%,transparent);
--vibeui-select-001-bg:light-dark(oklch(1 0 0),oklch(0.23 0 265));
--vibeui-select-001-border:light-dark(oklch(0.87 0 265),oklch(0.41 0 265));
--vibeui-select-001-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.74 0.16 39.8));
--vibeui-select-001-radius:0.625rem;
--vibeui-select-001-height:2.75rem;
--vibeui-select-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="select-001"]{color-scheme:dark}
/* Подложка появляется только вместе с пропом background: по умолчанию поле
   лежит прямо на фоне страницы. */
[data-vibeui-block="select-001"]{
box-sizing:border-box;padding:var(--vibeui-select-001-surface-pad);
background:var(--vibeui-select-001-surface);
border:1px solid var(--vibeui-select-001-surface-border);
border-radius:var(--vibeui-select-001-surface-radius);
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
/* Системный список рисует браузер по цветам самого <select>: у
   прозрачного он берёт белый, и в тёмной теме всплывал светлый
   список поверх тёмной страницы. */
[data-vibeui-block="select-001"] select,
[data-vibeui-block="select-001"] option,
[data-vibeui-block="select-001"] optgroup{
background-color:var(--vibeui-select-001-bg);color:var(--vibeui-select-001-fg);
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
 * Нативный select в собственной рамке: системный список, своя типографика.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Select001({
  label = "Тип проекта",
  options = DEFAULT_OPTIONS,
  placeholder = "Выберите вариант",
  size = "md",
  background = "",
  accent,
  id,
  className,
  style,
  defaultValue,
  ...props
}: Select001Props) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  // Подложка приходит вместе с полями и скруглением: без неё поле лежит
  // прямо на странице, и лишние поля по бокам ему только мешают.
  const palette = {
    ...(accent ? { "--vibeui-select-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-select-001-surface": background,
          "--vibeui-select-001-surface-border":
            "light-dark(oklch(0.91 0 265),oklch(0.36 0 265))",
          "--vibeui-select-001-surface-pad": "0.875rem",
          "--vibeui-select-001-surface-radius": "0.875rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-001" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="select"
        data-vibeui-block="select-001"
        data-size={size}
        className={className}
        style={palette}
      >
        {label ? (
          <label data-part="label" htmlFor={fieldId}>
            {label}
          </label>
        ) : null}
        <span data-part="field">
          <select
            {...props}
            id={fieldId}
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

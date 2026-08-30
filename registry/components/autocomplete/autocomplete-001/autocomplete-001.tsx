import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Autocomplete001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  hint?: string
  placeholder?: string
  options?: string[]
  accent?: string
}

// Идея компонента: подсказка на нативном datalist — единственный вариант
// автодополнения, который работает без единой строки клиентского кода и
// доживает до пользователя даже с выключенным JS. Список отдаёт браузер, он
// же фильтрует и озвучивает его скринридеру; наш код только рисует поле.
const STYLES = `
:where([data-vibeui-block="autocomplete-001"]){
--vibeui-autocomplete-001-bg:oklch(1 0 0);
--vibeui-autocomplete-001-fg:oklch(0.22 0.014 265);
--vibeui-autocomplete-001-muted:oklch(0.52 0.014 265);
--vibeui-autocomplete-001-border:oklch(0.9 0.006 265);
--vibeui-autocomplete-001-field:oklch(0.985 0.002 265);
--vibeui-autocomplete-001-accent:oklch(0.55 0.17 265);
--vibeui-autocomplete-001-radius:0.625rem;
--vibeui-autocomplete-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Собственная светлая подложка: поле обязано читаться и на тёмной странице. */
[data-vibeui-block="autocomplete-001"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-autocomplete-001-bg);
border:1px solid var(--vibeui-autocomplete-001-border);
border-radius:calc(var(--vibeui-autocomplete-001-radius) + 0.25rem);
color:var(--vibeui-autocomplete-001-fg);
font-family:var(--vibeui-autocomplete-001-font);
}
[data-vibeui-block="autocomplete-001"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="autocomplete-001"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="autocomplete-001"] input{
box-sizing:border-box;width:100%;height:2.5rem;
padding:0 2.25rem 0 0.75rem;
border:1px solid var(--vibeui-autocomplete-001-border);
border-radius:var(--vibeui-autocomplete-001-radius);
background:var(--vibeui-autocomplete-001-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="autocomplete-001"] input::placeholder{color:var(--vibeui-autocomplete-001-muted)}
[data-vibeui-block="autocomplete-001"] input:focus-visible{
outline:2px solid var(--vibeui-autocomplete-001-accent);outline-offset:1px;border-color:transparent;
}
/* Стрелка нарисована рамкой: иконочный шрифт ради одного треугольника —
   лишняя зависимость, а SVG внутри инпута всё равно не кликабелен. */
[data-vibeui-block="autocomplete-001"] [data-part="caret"]{
position:absolute;right:0.875rem;top:50%;width:0.4375rem;height:0.4375rem;
margin-top:-0.3125rem;pointer-events:none;
border-right:1.5px solid var(--vibeui-autocomplete-001-muted);
border-bottom:1.5px solid var(--vibeui-autocomplete-001-muted);
transform:rotate(45deg);
}
[data-vibeui-block="autocomplete-001"] [data-part="hint"]{font-size:0.75rem;line-height:1.4;color:var(--vibeui-autocomplete-001-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="autocomplete-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "Москва",
  "Санкт-Петербург",
  "Новосибирск",
  "Екатеринбург",
  "Казань",
  "Нижний Новгород",
  "Челябинск",
  "Самара",
]

/**
 * Автодополнение на нативном datalist: без клиентского кода.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Autocomplete001({
  label = "Город",
  hint = "Начните вводить — браузер подскажет из списка",
  placeholder = "Например, Казань",
  options = DEFAULT_OPTIONS,
  accent,
  className,
  style,
  ...props
}: Autocomplete001Props) {
  const id = useId()
  const listId = `${id}-list`
  const palette = {
    ...(accent ? { "--vibeui-autocomplete-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-autocomplete-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="autocomplete-001"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <span data-part="field">
          <input
            id={id}
            list={listId}
            type="text"
            placeholder={placeholder}
            autoComplete="off"
            aria-describedby={hint ? `${id}-hint` : undefined}
          />
          <span data-part="caret" aria-hidden="true" />
        </span>
        <datalist id={listId}>
          {options.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
        {hint ? (
          <span data-part="hint" id={`${id}-hint`}>
            {hint}
          </span>
        ) : null}
      </div>
    </>
  )
}

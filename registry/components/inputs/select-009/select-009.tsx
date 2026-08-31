import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Select009Props = Omit<
  ComponentPropsWithoutRef<"select">,
  "size" | "children" | "required"
> & {
  label?: string
  options?: string[]
  /** Строка-заглушка с пустым value: она и делает поле незаполненным. */
  placeholder?: string
  hint?: string
  accent?: string
}

// Идея компонента: обязательный выбор без единой строки JS. Заглушка имеет
// пустое value, поэтому required считает поле незаполненным, а :invalid
// красит его в «ждём ответа» — но только после :user-invalid, иначе форма
// краснеет ещё до того, как её начали заполнять.
const STYLES = `
:where([data-vibeui-block="select-009"]){
--vibeui-select-009-surface:oklch(1 0 0);
--vibeui-select-009-surface-border:oklch(0.91 0.006 265);
--vibeui-select-009-fg:oklch(0.23 0.016 265);
--vibeui-select-009-muted:oklch(0.58 0.014 265);
--vibeui-select-009-field:oklch(0.985 0.002 265);
--vibeui-select-009-border:oklch(0.87 0.008 265);
--vibeui-select-009-accent:oklch(0.55 0.19 262);
--vibeui-select-009-required:oklch(0.55 0.2 25);
--vibeui-select-009-pending:oklch(0.68 0.15 75);
--vibeui-select-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="select-009"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-select-009-surface);
border:1px solid var(--vibeui-select-009-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-009-font);color:var(--vibeui-select-009-fg);
}
[data-vibeui-block="select-009"] [data-part="label"]{
display:flex;align-items:baseline;gap:0.25rem;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="select-009"] [data-part="star"]{color:var(--vibeui-select-009-required)}
[data-vibeui-block="select-009"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="select-009"] select{
appearance:none;-webkit-appearance:none;
width:100%;box-sizing:border-box;margin:0;height:2.75rem;
padding:0 2.5rem 0 0.875rem;
border:1px solid var(--vibeui-select-009-border);border-radius:0.625rem;
background:var(--vibeui-select-009-field);color:inherit;
font:inherit;font-size:0.9375rem;cursor:pointer;
transition:border-color .16s ease,box-shadow .16s ease;
}
/* Пока ничего не выбрано, поле держит серую заглушку и не притворяется
   заполненным: :invalid ловит именно пустое value. */
[data-vibeui-block="select-009"] select:invalid{color:var(--vibeui-select-009-muted)}
[data-vibeui-block="select-009"] select:user-invalid{
border-color:var(--vibeui-select-009-pending);
background:color-mix(in oklab,var(--vibeui-select-009-pending) 10%,var(--vibeui-select-009-field));
}
[data-vibeui-block="select-009"] select:focus{
outline:none;border-color:var(--vibeui-select-009-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-009-accent) 22%,transparent);
}
[data-vibeui-block="select-009"] [data-part="arrow"]{
position:absolute;right:1rem;top:50%;
width:0.4375rem;height:0.4375rem;margin-top:-0.3125rem;pointer-events:none;
border-right:1.5px solid var(--vibeui-select-009-muted);
border-bottom:1.5px solid var(--vibeui-select-009-muted);
transform:rotate(45deg);
}
[data-vibeui-block="select-009"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-select-009-muted);
}
/* Подсказка меняется вместе с состоянием поля: пока пусто — «нужно
   выбрать», после выбора — нейтральный текст. Это чистый CSS через :has(). */
[data-vibeui-block="select-009"]:has(select:valid) [data-part="hint"]{
color:var(--vibeui-select-009-accent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "Утро, 9:00 — 12:00",
  "День, 12:00 — 16:00",
  "Вечер, 16:00 — 21:00",
]

/**
 * Обязательный select: заглушка с пустым value и подсветка через :user-invalid.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Select009({
  label = "Окно доставки",
  options = DEFAULT_OPTIONS,
  placeholder = "Выберите время",
  hint = "Поле обязательное: курьер приедет в это окно.",
  accent,
  id,
  className,
  style,
  ...props
}: Select009Props) {
  const palette = {
    ...(accent ? { "--vibeui-select-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-009" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="select-009" className={className} style={palette}>
        <label data-part="label" htmlFor={id}>
          {label}
          <span data-part="star" aria-hidden="true">
            *
          </span>
        </label>
        <span data-part="field">
          <select {...props} id={id} required defaultValue="">
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span data-part="arrow" aria-hidden="true" />
        </span>
        {hint ? <p data-part="hint">{hint}</p> : null}
      </div>
    </>
  )
}

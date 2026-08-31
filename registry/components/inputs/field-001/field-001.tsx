import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Field001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  hint?: string
  error?: string
  placeholder?: string
  defaultValue?: string
  name?: string
  required?: boolean
  accent?: string
}

// Идея компонента: обвязка поля — подпись, пояснение и ошибка. Пояснение и
// ошибка связаны с полем через aria-describedby, поэтому их читают вслух вместе
// со значением, а не отдельно. Ошибка не заменяет пояснение, а добавляется к
// нему: пользователь теряет условия ровно тогда, когда они нужнее всего.
const STYLES = `
:where([data-vibeui-block="field-001"]){
--vibeui-field-001-bg:oklch(1 0 0);
--vibeui-field-001-surface:oklch(1 0 0);
--vibeui-field-001-shell:oklch(0.9 0.006 265);
--vibeui-field-001-fg:oklch(0.24 0.014 265);
--vibeui-field-001-muted:oklch(0.56 0.014 265);
--vibeui-field-001-border:oklch(0.88 0.008 265);
--vibeui-field-001-accent:oklch(0.55 0.2 262);
--vibeui-field-001-danger:oklch(0.55 0.19 25);
--vibeui-field-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: поле показывают поверх любого фона. */
[data-vibeui-block="field-001"]{
display:flex;flex-direction:column;gap:0.375rem;
padding:0.875rem;
background:var(--vibeui-field-001-surface);
border:1px solid var(--vibeui-field-001-shell);border-radius:0.875rem;
width:100%;max-width:20rem;box-sizing:border-box;
font-family:var(--vibeui-field-001-font);color:var(--vibeui-field-001-fg);
}
[data-vibeui-block="field-001"] label{display:flex;gap:0.25rem;font-size:0.8125rem;font-weight:600}
/* Звёздочка — не единственный признак: слово «обязательно» стоит рядом. */
[data-vibeui-block="field-001"] [data-part="required"]{font-weight:500;color:var(--vibeui-field-001-muted)}
[data-vibeui-block="field-001"] input{
width:100%;box-sizing:border-box;height:2.5rem;padding:0 0.75rem;
background:var(--vibeui-field-001-bg);color:inherit;
border:1px solid var(--vibeui-field-001-border);border-radius:0.625rem;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="field-001"] input::placeholder{color:var(--vibeui-field-001-muted)}
[data-vibeui-block="field-001"] input:focus-visible{outline:2px solid var(--vibeui-field-001-accent);outline-offset:1px;border-color:var(--vibeui-field-001-accent)}
[data-vibeui-block="field-001"] input[aria-invalid="true"]{border-color:var(--vibeui-field-001-danger)}
[data-vibeui-block="field-001"] input[aria-invalid="true"]:focus-visible{outline-color:var(--vibeui-field-001-danger)}
[data-vibeui-block="field-001"] [data-part="hint"]{margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-field-001-muted)}
/* Ошибка со знаком, а не одним цветом: красный виден не всем. */
[data-vibeui-block="field-001"] [data-part="error"]{
display:flex;align-items:flex-start;gap:0.3125rem;margin:0;
font-size:0.75rem;line-height:1.4;color:var(--vibeui-field-001-danger);
}
[data-vibeui-block="field-001"] [data-part="mark"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
width:0.875rem;height:0.875rem;margin-top:0.0625rem;border-radius:9999px;
background:var(--vibeui-field-001-danger);color:oklch(1 0 0);
font-size:0.625rem;font-weight:700;line-height:1;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="field-001"] *{animation:none!important;transition:none!important}}
`

/**
 * Обвязка поля: подпись, пояснение и ошибка, связанные через aria-describedby.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Field001({
  label = "Рабочая почта",
  hint = "Пришлём на неё ключ доступа к registry.",
  error = "Адрес без «@» — проверьте написание.",
  placeholder = "name@company.ru",
  defaultValue = "name@company",
  name = "email",
  required = true,
  accent,
  className,
  style,
  ...props
}: Field001Props) {
  const described = [
    hint ? `${name}-hint` : null,
    error ? `${name}-error` : null,
  ]
    .filter(Boolean)
    .join(" ")

  const palette = {
    ...(accent ? { "--vibeui-field-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-field-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="field-001"
        className={className}
        style={palette}
      >
        <label htmlFor={`${name}-input`}>
          {label}
          {required ? <span data-part="required">· обязательно</span> : null}
        </label>
        <input
          id={`${name}-input`}
          name={name}
          type="email"
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={described || undefined}
        />
        {hint ? (
          <p id={`${name}-hint`} data-part="hint">
            {hint}
          </p>
        ) : null}
        {error ? (
          <p id={`${name}-error`} data-part="error">
            <span data-part="mark" aria-hidden="true">
              !
            </span>
            {error}
          </p>
        ) : null}
      </div>
    </>
  )
}

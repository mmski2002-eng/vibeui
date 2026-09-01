import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Field002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  hint?: string
  error?: string
  badge?: string
  name?: string
  children?: ReactNode
  accent?: string
}

// Идея компонента: каркас, а не поле. Рамка обнимает подпись и контрол
// вместе, поэтому подпись читается как часть поля, а не как строка над ним.
// Внутрь кладут что угодно — input, textarea, select, — и обвязка остаётся
// одинаковой во всей форме. Служебная строка под рамкой одна: подсказка и
// ошибка занимают одно место, поэтому форма не прыгает при появлении ошибки.
const STYLES = `
:where([data-vibeui-block="field-002"]){
--vibeui-field-002-surface:oklch(1 0 0);
--vibeui-field-002-frame:oklch(0.985 0.003 265);
--vibeui-field-002-fg:oklch(0.24 0.014 265);
--vibeui-field-002-muted:oklch(0.55 0.014 265);
--vibeui-field-002-border:oklch(0.88 0.008 265);
--vibeui-field-002-shell:oklch(0.91 0.006 265);
--vibeui-field-002-accent:oklch(0.55 0.2 262);
--vibeui-field-002-danger:oklch(0.55 0.19 25);
--vibeui-field-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: каркас показывают поверх любого фона. */
[data-vibeui-block="field-002"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-field-002-surface);
border:1px solid var(--vibeui-field-002-shell);border-radius:0.875rem;
font-family:var(--vibeui-field-002-font);color:var(--vibeui-field-002-fg);
}
[data-vibeui-block="field-002"] *{box-sizing:border-box}
/* Рамка обнимает подпись и контрол: подпись — часть поля, а не строка над ним. */
[data-vibeui-block="field-002"] [data-part="frame"]{
display:flex;flex-direction:column;gap:0.125rem;
padding:0.4375rem 0.75rem 0.5rem;
background:var(--vibeui-field-002-frame);
border:1px solid var(--vibeui-field-002-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="field-002"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-field-002-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-field-002-accent) 18%,transparent);
}
[data-vibeui-block="field-002"][data-invalid="true"] [data-part="frame"]{border-color:var(--vibeui-field-002-danger)}
[data-vibeui-block="field-002"][data-invalid="true"] [data-part="frame"]:focus-within{
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-field-002-danger) 18%,transparent);
}
[data-vibeui-block="field-002"] label{
font-size:0.6875rem;font-weight:650;letter-spacing:0.01em;
color:var(--vibeui-field-002-muted);
}
/* Контрол без собственной рамки: рамка одна на весь каркас. */
[data-vibeui-block="field-002"] :is(input,textarea,select){
width:100%;min-width:0;padding:0;margin:0;
border:0;background:none;color:inherit;font:inherit;font-size:0.875rem;line-height:1.6;
appearance:none;
}
[data-vibeui-block="field-002"] :is(input,textarea,select):focus{outline:none}
[data-vibeui-block="field-002"] textarea{resize:none;min-height:3rem}
[data-vibeui-block="field-002"] ::placeholder{color:var(--vibeui-field-002-muted)}
/* Одна служебная строка на подсказку и ошибку: форма не прыгает. */
[data-vibeui-block="field-002"] [data-part="foot"]{
display:flex;align-items:flex-start;justify-content:space-between;gap:0.75rem;
font-size:0.75rem;line-height:1.4;
}
[data-vibeui-block="field-002"] [data-part="note"]{margin:0;color:var(--vibeui-field-002-muted)}
[data-vibeui-block="field-002"] [data-part="error"]{margin:0;font-weight:600;color:var(--vibeui-field-002-danger)}
[data-vibeui-block="field-002"] [data-part="badge"]{
flex:none;padding:0.0625rem 0.375rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-field-002-accent) 12%,oklch(1 0 0));
color:var(--vibeui-field-002-accent);font-size:0.6875rem;font-weight:650;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="field-002"] *{animation:none!important;transition:none!important}}
`

/**
 * Каркас поля: рамка вокруг подписи и контрола, одна служебная строка снизу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Field002({
  label = "Название проекта",
  hint = "Видно только вам и участникам команды.",
  error = "",
  badge = "черновик",
  name = "project",
  children,
  accent,
  className,
  style,
  ...props
}: Field002Props) {
  const noteId = `${name}-note`

  const palette = {
    ...(accent ? { "--vibeui-field-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-field-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="field-002"
        data-invalid={error ? "true" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <label htmlFor={`${name}-input`}>{label}</label>
          {children ?? (
            <input
              id={`${name}-input`}
              name={name}
              type="text"
              defaultValue="Каталог компонентов"
              placeholder="Как назовём"
              aria-invalid={error ? true : undefined}
              aria-describedby={hint || error ? noteId : undefined}
            />
          )}
        </div>
        <div data-part="foot">
          {error ? (
            <p id={noteId} data-part="error" role="alert">
              {error}
            </p>
          ) : (
            <p id={noteId} data-part="note">
              {hint}
            </p>
          )}
          {badge ? <span data-part="badge">{badge}</span> : null}
        </div>
      </div>
    </>
  )
}

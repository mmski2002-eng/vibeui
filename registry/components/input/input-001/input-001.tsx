import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Input001Size = "md" | "lg"

export type Input001Props = Omit<
  ComponentPropsWithoutRef<"input">,
  "size" | "placeholder"
> & {
  label?: string
  /** Подсказка под полем. В состоянии ошибки её место занимает текст ошибки. */
  hint?: string
  /** Текст ошибки. Непустая строка переводит поле в невалидное состояние. */
  error?: string
  size?: Input001Size
  accent?: string
}

// Идея компонента: подпись живёт внутри рамки и уезжает в неё же при вводе.
// Поле не занимает вертикаль на отдельную подпись, но подпись никогда не
// исчезает — в отличие от placeholder, который пропадает вместе с контекстом.
// Всё держится на :placeholder-shown, поэтому JS не нужен.
const STYLES = `
:where([data-vibeui-block="input-001"]){
--vibeui-input-001-surface:oklch(1 0 0);
--vibeui-input-001-surface-border:oklch(0.91 0.006 265);
--vibeui-input-001-fg:oklch(0.24 0.016 265);
--vibeui-input-001-muted:oklch(0.55 0.014 265);
--vibeui-input-001-bg:oklch(1 0 0);
--vibeui-input-001-border:oklch(0.87 0.008 265);
--vibeui-input-001-accent:oklch(0.55 0.2 262);
--vibeui-input-001-danger:oklch(0.55 0.19 25);
--vibeui-input-001-radius:0.625rem;
--vibeui-input-001-height:3.5rem;
--vibeui-input-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Собственная подложка: подпись поля — это текст, и на тёмной странице
   он обязан читаться без правки палитры проекта. */
[data-vibeui-block="input-001"]{
box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-001-surface);
border:1px solid var(--vibeui-input-001-surface-border);border-radius:0.875rem;
display:flex;flex-direction:column;gap:0.375rem;
font-family:var(--vibeui-input-001-font);color:var(--vibeui-input-001-fg);
}
[data-vibeui-block="input-001"][data-size="lg"]{--vibeui-input-001-height:4rem}
[data-vibeui-block="input-001"] [data-part="field"]{
position:relative;display:block;
}
[data-vibeui-block="input-001"] input{
width:100%;box-sizing:border-box;margin:0;
height:var(--vibeui-input-001-height);
padding:1.375rem 0.875rem 0.5rem;
border:1px solid var(--vibeui-input-001-border);
border-radius:var(--vibeui-input-001-radius);
background:var(--vibeui-input-001-bg);color:inherit;
font:inherit;font-size:0.9375rem;line-height:1.2;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-001"][data-size="lg"] input{font-size:1rem;padding-top:1.625rem}
[data-vibeui-block="input-001"] input:hover:not(:disabled):not(:focus){border-color:var(--vibeui-input-001-muted)}
[data-vibeui-block="input-001"] input:focus{
outline:none;border-color:var(--vibeui-input-001-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-001-accent) 22%,transparent);
}
[data-vibeui-block="input-001"] input:disabled{
cursor:not-allowed;opacity:.55;
background:color-mix(in oklab,var(--vibeui-input-001-border) 25%,var(--vibeui-input-001-bg));
}
[data-vibeui-block="input-001"] [data-part="label"]{
position:absolute;left:0.9375rem;top:0.5rem;
font-size:0.6875rem;font-weight:500;letter-spacing:0.01em;
color:var(--vibeui-input-001-muted);
transform-origin:left top;pointer-events:none;
transition:transform .16s ease,color .16s ease;
}
/* Поле пустое и не в фокусе — подпись стоит на месте текста. */
[data-vibeui-block="input-001"] input:placeholder-shown:not(:focus) + [data-part="label"]{
transform:translateY(0.8125rem) scale(1.32);
}
[data-vibeui-block="input-001"] input:focus + [data-part="label"]{color:var(--vibeui-input-001-accent)}
[data-vibeui-block="input-001"] [data-part="note"]{
font-size:0.75rem;line-height:1.35;color:var(--vibeui-input-001-muted);
}
[data-vibeui-block="input-001"][data-invalid="true"] input{border-color:var(--vibeui-input-001-danger)}
[data-vibeui-block="input-001"][data-invalid="true"] input:focus{
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-001-danger) 22%,transparent);
}
[data-vibeui-block="input-001"][data-invalid="true"] [data-part="label"],
[data-vibeui-block="input-001"][data-invalid="true"] [data-part="note"]{color:var(--vibeui-input-001-danger)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-001"] *{animation:none!important;transition:none!important}}
`

/**
 * Текстовое поле с подписью, которая уезжает внутрь рамки при вводе.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Input001({
  label = "Рабочая почта",
  hint,
  error,
  size = "md",
  accent,
  id,
  className,
  style,
  ...props
}: Input001Props) {
  const palette = {
    ...(accent ? { "--vibeui-input-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  const invalid = Boolean(error)
  const note = error || hint
  const noteId = id && note ? `${id}-note` : undefined

  return (
    <>
      <style href="vibeui-input-001" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="input-001"
        data-size={size}
        data-invalid={invalid || undefined}
        className={className}
        style={palette}
      >
        <label data-part="field">
          <input
            {...props}
            id={id}
            placeholder=" "
            aria-invalid={invalid || undefined}
            aria-describedby={noteId}
          />
          <span data-part="label">{label}</span>
        </label>
        {note ? (
          <span
            data-part="note"
            id={noteId}
            role={invalid ? "alert" : undefined}
          >
            {note}
          </span>
        ) : null}
      </div>
    </>
  )
}

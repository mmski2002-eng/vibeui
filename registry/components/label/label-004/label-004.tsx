import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Label004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  hint?: string
  labelWidth?: number
  accent?: string
}

// Идея компонента: в плотной десктопной форме подпись сбоку экономит
// вертикаль и даёт полям общий левый край. Раскладка переключается по
// ширине самого блока (container query), а не по ширине окна: в узкой
// колонке настроек подпись возвращается наверх, и это верно даже тогда,
// когда окно широкое.
const STYLES = `
:where([data-vibeui-block="label-004"]){
--vibeui-label-004-surface:oklch(1 0 0);
--vibeui-label-004-surface-border:oklch(0.91 0.006 265);
--vibeui-label-004-fg:oklch(0.24 0.016 265);
--vibeui-label-004-muted:oklch(0.54 0.014 265);
--vibeui-label-004-field-border:oklch(0.85 0.01 265);
--vibeui-label-004-accent:oklch(0.55 0.2 262);
--vibeui-label-004-label-width:9rem;
--vibeui-label-004-radius:0.625rem;
--vibeui-label-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="label-004"]{
box-sizing:border-box;width:100%;max-width:38rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-label-004-surface);
border:1px solid var(--vibeui-label-004-surface-border);
font-family:var(--vibeui-label-004-font);color:var(--vibeui-label-004-fg);
}
/* Раскладка живёт на внутренней оболочке: правило внутри @container не
   действует на сам контейнер, поэтому на корне её держать нельзя. */
[data-vibeui-block="label-004"] [data-part="shell"]{
display:grid;grid-template-columns:1fr;gap:0.375rem 1rem;
grid-template-areas:"label" "field" "hint";
}
[data-vibeui-block="label-004"] label{
grid-area:label;
font-size:0.875rem;font-weight:600;line-height:1.35;cursor:pointer;
}
[data-vibeui-block="label-004"] input{
grid-area:field;
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
font:inherit;font-size:0.9375rem;
color:var(--vibeui-label-004-fg);background:var(--vibeui-label-004-surface);
border:1px solid var(--vibeui-label-004-field-border);
border-radius:var(--vibeui-label-004-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="label-004"] input:focus-visible{
outline:none;border-color:var(--vibeui-label-004-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-label-004-accent) 22%,transparent);
}
[data-vibeui-block="label-004"] [data-part="hint"]{
grid-area:hint;margin:0;
font-size:0.8125rem;line-height:1.45;color:var(--vibeui-label-004-muted);
}
@container (min-width: 28rem){
[data-vibeui-block="label-004"] [data-part="shell"]{
grid-template-columns:var(--vibeui-label-004-label-width) minmax(0,1fr);
grid-template-areas:"label field" ".     hint";
align-items:start;
}
/* Подпись опускается на строку поля: выравнивание по первой строке
   текста внутри поля, а не по его верхнему краю. */
[data-vibeui-block="label-004"] label{padding-top:0.625rem;text-align:right}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="label-004"] *{animation:none!important;transition:none!important}}
`

/**
 * Подпись слева от поля для десктопной формы: колонка подписи фиксирована,
 * на узкой ширине блока подпись уходит наверх. Один файл, ноль зависимостей.
 */
export function Label004({
  label = "Название компании",
  hint = "Так, как написано в реквизитах, без кавычек и формы собственности.",
  labelWidth = 9,
  accent,
  className,
  style,
  ...props
}: Label004Props) {
  const id = useId()
  const hintId = `${id}-hint`
  const palette = {
    "--vibeui-label-004-label-width": `${labelWidth}rem`,
    ...(accent ? { "--vibeui-label-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-label-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="label-004"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <label htmlFor={id}>{label}</label>
          <input
            id={id}
            type="text"
            name="company"
            autoComplete="organization"
            aria-describedby={hintId}
          />
          <p data-part="hint" id={hintId}>
            {hint}
          </p>
        </div>
      </div>
    </>
  )
}

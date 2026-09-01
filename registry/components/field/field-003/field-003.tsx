import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Field003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  optionalLabel?: string
  legend?: string
  name?: string
  accent?: string
}

// Идея компонента: звёздочка, которая объясняет себя. Символ «*» ничего не
// значит для того, кто видит форму впервые, и совсем ничего — для screen
// reader. Здесь он обёрнут в <abbr> с расшифровкой, продублирован скрытым
// словом «обязательно» и объяснён сноской под парой полей. Рядом стоит
// необязательное поле с явной меткой: пара показывает разницу, а не намекает.
const STYLES = `
:where([data-vibeui-block="field-003"]){
--vibeui-field-003-bg:oklch(1 0 0);
--vibeui-field-003-surface:oklch(1 0 0);
--vibeui-field-003-fg:oklch(0.24 0.014 265);
--vibeui-field-003-muted:oklch(0.55 0.014 265);
--vibeui-field-003-border:oklch(0.88 0.008 265);
--vibeui-field-003-shell:oklch(0.91 0.006 265);
--vibeui-field-003-accent:oklch(0.55 0.2 262);
--vibeui-field-003-danger:oklch(0.55 0.19 25);
--vibeui-field-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: форму показывают поверх любого фона. */
[data-vibeui-block="field-003"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-field-003-surface);
border:1px solid var(--vibeui-field-003-shell);border-radius:0.875rem;
font-family:var(--vibeui-field-003-font);color:var(--vibeui-field-003-fg);
}
[data-vibeui-block="field-003"] *{box-sizing:border-box}
[data-vibeui-block="field-003"] [data-part="row"]{display:flex;flex-direction:column;gap:0.3125rem}
[data-vibeui-block="field-003"] label{
display:flex;align-items:baseline;gap:0.25rem;
font-size:0.8125rem;font-weight:600;
}
/* Звёздочка с расшифровкой: <abbr> объясняет символ и наведением, и вслух. */
[data-vibeui-block="field-003"] abbr{
color:var(--vibeui-field-003-danger);text-decoration:none;
font-weight:700;cursor:help;
}
[data-vibeui-block="field-003"] [data-part="optional"]{
font-size:0.75rem;font-weight:500;color:var(--vibeui-field-003-muted);
}
[data-vibeui-block="field-003"] input{
width:100%;height:2.375rem;padding:0 0.75rem;
background:var(--vibeui-field-003-bg);color:inherit;
border:1px solid var(--vibeui-field-003-border);border-radius:0.625rem;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="field-003"] input::placeholder{color:var(--vibeui-field-003-muted)}
[data-vibeui-block="field-003"] input:focus-visible{
outline:2px solid var(--vibeui-field-003-accent);outline-offset:1px;
border-color:var(--vibeui-field-003-accent);
}
[data-vibeui-block="field-003"] input[required]{
border-inline-start:3px solid color-mix(in oklab,var(--vibeui-field-003-danger) 45%,oklch(1 0 0));
}
/* Сноска рядом с полями, а не в конце длинной формы: там её не читают. */
[data-vibeui-block="field-003"] [data-part="legend"]{
display:flex;align-items:flex-start;gap:0.375rem;margin:0;
padding-top:0.5rem;border-top:1px dashed var(--vibeui-field-003-border);
font-size:0.75rem;line-height:1.4;color:var(--vibeui-field-003-muted);
}
[data-vibeui-block="field-003"] [data-part="legend"] span{color:var(--vibeui-field-003-danger);font-weight:700}
[data-vibeui-block="field-003"] [data-part="sr"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="field-003"] *{animation:none!important;transition:none!important}}
`

/**
 * Обязательное поле со звёздочкой, у которой есть расшифровка и сноска.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Field003({
  label = "Юридическое название",
  optionalLabel = "необязательно",
  legend = "Звёздочкой отмечены поля, без которых заявку не примут.",
  name = "company",
  accent,
  className,
  style,
  ...props
}: Field003Props) {
  const palette = {
    ...(accent ? { "--vibeui-field-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-field-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="field-003"
        className={className}
        style={palette}
      >
        <div data-part="row">
          <label htmlFor={`${name}-required`}>
            {label}
            <abbr title="обязательное поле" aria-hidden="true">
              *
            </abbr>
            <span data-part="sr">, обязательное поле</span>
          </label>
          <input
            id={`${name}-required`}
            name={name}
            type="text"
            required
            aria-required="true"
            placeholder="ООО «Ромашка»"
          />
        </div>

        <div data-part="row">
          <label htmlFor={`${name}-optional`}>
            Комментарий
            <span data-part="optional">· {optionalLabel}</span>
          </label>
          <input
            id={`${name}-optional`}
            name={`${name}-comment`}
            type="text"
            placeholder="Что важно знать заранее"
          />
        </div>

        <p data-part="legend">
          <span aria-hidden="true">*</span>
          {legend}
        </p>
      </div>
    </>
  )
}

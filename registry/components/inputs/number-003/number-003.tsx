import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Number003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  unit?: string
  hint?: string
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  name?: string
  accent?: string
}

// Идея компонента: число и его единица в одной рамке. Единица не плейсхолдер
// и не текст рядом — это отдельная зона поля за разделителем, поэтому она
// видна и при заполненном поле, и при пустом. Число прижато вправо, к самой
// единице: так «12 м²» читается как одна величина, а не как два элемента.
// Компонент серверный: состояние тут не нужно, значение забирает форма.
const STYLES = `
:where([data-vibeui-block="number-003"]){
--vibeui-number-003-surface:oklch(1 0 0);
--vibeui-number-003-field:oklch(1 0 0);
--vibeui-number-003-suffix:oklch(0.965 0.004 265);
--vibeui-number-003-shell:oklch(0.9 0.006 265);
--vibeui-number-003-fg:oklch(0.23 0.014 265);
--vibeui-number-003-muted:oklch(0.55 0.014 265);
--vibeui-number-003-border:oklch(0.88 0.008 265);
--vibeui-number-003-accent:oklch(0.52 0.15 250);
--vibeui-number-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: поле показывают поверх любого фона. */
[data-vibeui-block="number-003"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:16rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-number-003-surface);
border:1px solid var(--vibeui-number-003-shell);border-radius:0.875rem;
font-family:var(--vibeui-number-003-font);color:var(--vibeui-number-003-fg);
}
[data-vibeui-block="number-003"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="number-003"] [data-part="field"]{
display:flex;align-items:stretch;overflow:hidden;
border:1px solid var(--vibeui-number-003-border);border-radius:0.625rem;
background:var(--vibeui-number-003-field);
}
[data-vibeui-block="number-003"] [data-part="field"]:focus-within{
border-color:var(--vibeui-number-003-accent);
box-shadow:0 0 0 2px oklch(0.52 0.15 250 / 20%);
}
/* Число прижато к единице: «12 м²» читается как одна величина. */
[data-vibeui-block="number-003"] input{
flex:1 1 auto;min-width:0;width:100%;
appearance:none;border:0;background:none;outline:none;
height:2.625rem;padding:0 0.625rem;color:inherit;
font:inherit;font-size:1rem;font-weight:680;text-align:right;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="number-003"] input::-webkit-outer-spin-button,
[data-vibeui-block="number-003"] input::-webkit-inner-spin-button{appearance:none;margin:0}
/* Единица — отдельная зона за разделителем: видна и на пустом поле. */
[data-vibeui-block="number-003"] [data-part="unit"]{
display:flex;align-items:center;flex:none;
padding:0 0.75rem;
border-left:1px solid var(--vibeui-number-003-border);
background:var(--vibeui-number-003-suffix);
color:var(--vibeui-number-003-muted);
font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="number-003"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-number-003-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="number-003"] *{animation:none!important;transition:none!important}}
`

/**
 * Число с единицей измерения в отдельной зоне поля.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Number003({
  label = "Площадь квартиры",
  unit = "м²",
  hint = "Считается по внутренним стенам, без балкона.",
  defaultValue = 54,
  min = 10,
  max = 400,
  step = 1,
  name = "area",
  accent,
  className,
  style,
  ...props
}: Number003Props) {
  const palette = {
    ...(accent ? { "--vibeui-number-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-number-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="number-003"
        className={className}
        style={palette}
      >
        <label htmlFor={`${name}-input`}>{label}</label>
        <div data-part="field">
          <input
            id={`${name}-input`}
            name={name}
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            defaultValue={defaultValue}
            aria-describedby={hint ? `${name}-hint` : undefined}
          />
          <span data-part="unit" aria-hidden="true">
            {unit}
          </span>
        </div>
        {hint ? (
          <p id={`${name}-hint`} data-part="hint">
            {hint}
          </p>
        ) : null}
      </div>
    </>
  )
}

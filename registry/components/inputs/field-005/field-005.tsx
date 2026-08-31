import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Field005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  prefix?: string
  units?: string[]
  defaultValue?: number
  name?: string
  accent?: string
}

// Идея компонента: окончание, которое можно выбрать. Приставка слева —
// обычный текст и часть формулировки («не более»), а справа стоит настоящий
// select единицы: значение и единица вводятся в одном месте и уезжают на
// сервер двумя полями. Так не приходится угадывать, мегабайты перед вами или
// гигабайты, и не нужен отдельный ряд под выбор единицы.
const STYLES = `
:where([data-vibeui-block="field-005"]){
--vibeui-field-005-bg:oklch(1 0 0);
--vibeui-field-005-surface:oklch(1 0 0);
--vibeui-field-005-fill:oklch(0.975 0.004 265);
--vibeui-field-005-fg:oklch(0.24 0.014 265);
--vibeui-field-005-muted:oklch(0.55 0.014 265);
--vibeui-field-005-border:oklch(0.88 0.008 265);
--vibeui-field-005-shell:oklch(0.91 0.006 265);
--vibeui-field-005-accent:oklch(0.52 0.14 175);
--vibeui-field-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: поле показывают поверх любого фона. */
[data-vibeui-block="field-005"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-field-005-surface);
border:1px solid var(--vibeui-field-005-shell);border-radius:0.875rem;
font-family:var(--vibeui-field-005-font);color:var(--vibeui-field-005-fg);
}
[data-vibeui-block="field-005"] *{box-sizing:border-box}
[data-vibeui-block="field-005"] label{font-size:0.8125rem;font-weight:600}
/* Рамка одна на всю группу, у частей её нет — иначе рамка в рамке. */
[data-vibeui-block="field-005"] [data-part="group"]{
display:flex;align-items:stretch;height:2.625rem;overflow:hidden;
background:var(--vibeui-field-005-bg);
border:1px solid var(--vibeui-field-005-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="field-005"] [data-part="group"]:focus-within{
border-color:var(--vibeui-field-005-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-field-005-accent) 18%,transparent);
}
/* Приставка неинтерактивна: её не выделяют и не копируют со значением. */
[data-vibeui-block="field-005"] [data-part="prefix"]{
display:flex;align-items:center;padding:0 0.625rem;
background:var(--vibeui-field-005-fill);
border-inline-end:1px solid var(--vibeui-field-005-border);
font-size:0.8125rem;color:var(--vibeui-field-005-muted);
user-select:none;white-space:nowrap;
}
[data-vibeui-block="field-005"] input{
flex:1;min-width:0;padding:0 0.625rem;
border:0;background:none;color:inherit;
font:inherit;font-size:0.9375rem;font-weight:600;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="field-005"] input:focus{outline:none}
[data-vibeui-block="field-005"] input::-webkit-outer-spin-button,
[data-vibeui-block="field-005"] input::-webkit-inner-spin-button{appearance:none;margin:0}
/* Единица — настоящий select: клавиатура и мобильное колесо достаются даром. */
[data-vibeui-block="field-005"] select{
appearance:none;flex:none;padding:0 1.75rem 0 0.75rem;
border:0;border-inline-start:1px solid var(--vibeui-field-005-border);
background:var(--vibeui-field-005-fill);color:inherit;cursor:pointer;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="field-005"] select:focus{outline:none}
[data-vibeui-block="field-005"] [data-part="unit"]{position:relative;display:flex}
[data-vibeui-block="field-005"] [data-part="unit"]::after{
content:"";position:absolute;right:0.6875rem;top:50%;pointer-events:none;
width:0.375rem;height:0.375rem;margin-top:-0.25rem;
border-right:1.5px solid var(--vibeui-field-005-muted);
border-bottom:1.5px solid var(--vibeui-field-005-muted);
transform:rotate(45deg);
}
[data-vibeui-block="field-005"] [data-part="unit"]:focus-within::after{border-color:var(--vibeui-field-005-accent)}
[data-vibeui-block="field-005"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-field-005-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="field-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_UNITS = ["КБ", "МБ", "ГБ"]

/**
 * Поле с текстовой приставкой слева и выбором единицы справа в одной рамке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Field005({
  label = "Лимит на один файл",
  prefix = "не более",
  units = DEFAULT_UNITS,
  defaultValue = 25,
  name = "limit",
  accent,
  className,
  style,
  ...props
}: Field005Props) {
  const palette = {
    ...(accent ? { "--vibeui-field-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-field-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="field-005"
        className={className}
        style={palette}
      >
        <label htmlFor={`${name}-value`}>{label}</label>
        <div data-part="group">
          <span data-part="prefix" aria-hidden="true">
            {prefix}
          </span>
          <input
            id={`${name}-value`}
            name={name}
            type="number"
            min={1}
            inputMode="numeric"
            defaultValue={defaultValue}
            aria-describedby={`${name}-hint`}
          />
          <span data-part="unit">
            <select
              name={`${name}-unit`}
              defaultValue={units[1] ?? units[0]}
              aria-label="Единица измерения"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </span>
        </div>
        <p id={`${name}-hint`} data-part="hint">
          Значение и единица уходят двумя полями формы — пересчитывать ничего не
          нужно.
        </p>
      </div>
    </>
  )
}

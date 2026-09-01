import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Radio001Option = {
  value: string
  label: string
  hint?: string
  price?: string
}

export type Radio001Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "defaultValue"
> & {
  options?: Radio001Option[]
  legend?: string
  name?: string
  defaultValue?: string
  accent?: string
}

// Идея компонента: выбор одного варианта карточками. Кликабельна вся карточка,
// а не кружок в 16 пикселей: попасть в неё можно и пальцем, и мышью на ходу.
// Группа собрана на fieldset с legend — так скринридер объявляет вопрос перед
// вариантами. Легенда прижата float, иначе она садится на рамку и обрезается.
const STYLES = `
:where([data-vibeui-block="radio-001"]){
--vibeui-radio-001-bg:oklch(1 0 0);
--vibeui-radio-001-fg:oklch(0.24 0.014 265);
--vibeui-radio-001-muted:oklch(0.56 0.014 265);
--vibeui-radio-001-border:oklch(0.9 0.006 265);
--vibeui-radio-001-accent:oklch(0.55 0.2 262);
--vibeui-radio-001-tint:oklch(0.55 0.2 262 / 7%);
--vibeui-radio-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="radio-001"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;
margin:0;padding:0.875rem;
background:var(--vibeui-radio-001-bg);
border:1px solid var(--vibeui-radio-001-border);border-radius:0.875rem;
font-family:var(--vibeui-radio-001-font);color:var(--vibeui-radio-001-fg);
}
/* float у легенды: иначе она садится на рамку fieldset и обрезается. */
[data-vibeui-block="radio-001"] legend{
float:left;width:100%;padding:0;margin-bottom:0.5rem;
font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="radio-001"] [data-part="option"]{
position:relative;display:flex;align-items:flex-start;gap:0.625rem;
padding:0.625rem 0.75rem;border-radius:0.625rem;cursor:pointer;
border:1px solid var(--vibeui-radio-001-border);
}
[data-vibeui-block="radio-001"] input{
appearance:none;flex:none;margin:0.125rem 0 0;cursor:pointer;
width:1.0625rem;height:1.0625rem;border-radius:9999px;
border:1.5px solid var(--vibeui-radio-001-muted);background:var(--vibeui-radio-001-bg);
}
[data-vibeui-block="radio-001"] input:checked{
border-color:var(--vibeui-radio-001-accent);border-width:5px;
}
[data-vibeui-block="radio-001"] input:focus-visible{outline:2px solid var(--vibeui-radio-001-accent);outline-offset:2px}
/* Выбранная карточка отмечена рамкой и заливкой, а не одним кружком. */
[data-vibeui-block="radio-001"] [data-part="option"]:has(input:checked){
border-color:var(--vibeui-radio-001-accent);background:var(--vibeui-radio-001-tint);
}
[data-vibeui-block="radio-001"] [data-part="text"]{display:flex;flex-direction:column;gap:0.125rem;min-width:0}
[data-vibeui-block="radio-001"] [data-part="label"]{display:flex;justify-content:space-between;gap:0.75rem;font-size:0.875rem;font-weight:600}
[data-vibeui-block="radio-001"] [data-part="price"]{font-variant-numeric:tabular-nums;font-weight:650}
[data-vibeui-block="radio-001"] [data-part="hint"]{font-size:0.75rem;line-height:1.4;color:var(--vibeui-radio-001-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="radio-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Radio001Option[] = [
  {
    value: "month",
    label: "Помесячно",
    hint: "Отмена в любой момент, без обязательств.",
    price: "590 ₽",
  },
  {
    value: "year",
    label: "На год",
    hint: "Два месяца в подарок, оплата раз в год.",
    price: "5 900 ₽",
  },
  {
    value: "team",
    label: "Команда",
    hint: "До десяти участников и общий доступ к проектам.",
    price: "12 400 ₽",
  },
]

/**
 * Радиогруппа карточками: кликабельна вся карточка, а не кружок.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Radio001({
  options = DEFAULT_OPTIONS,
  legend = "Тариф",
  name = "vibeui-radio-001",
  defaultValue = "year",
  accent,
  className,
  style,
  ...props
}: Radio001Props) {
  const palette = {
    ...(accent ? { "--vibeui-radio-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-radio-001" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="radio-001"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        {options.map((option) => (
          <label key={option.value} data-part="option">
            <input
              type="radio"
              name={name}
              value={option.value}
              defaultChecked={option.value === defaultValue}
            />
            <span data-part="text">
              <span data-part="label">
                {option.label}
                {option.price ? (
                  <span data-part="price">{option.price}</span>
                ) : null}
              </span>
              {option.hint ? <span data-part="hint">{option.hint}</span> : null}
            </span>
          </label>
        ))}
      </fieldset>
    </>
  )
}

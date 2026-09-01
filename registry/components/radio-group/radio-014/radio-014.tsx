import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Radio014Method = {
  value: string
  brand: string
  name: string
  chargeDate: string
  disabled?: boolean
}

export type Radio014Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  methods?: Radio014Method[]
  name?: string
  defaultValue?: string
  accent?: string
}

// Идея компонента: выбор способа оплаты, где решение держится на двух
// фактах — чем платим и когда спишут. Логотип платёжной системы здесь не
// нужен настоящий: короткий код в рамке — законная заглушка, а дата
// списания стоит отдельной строкой под номером карты, а не в скобках.
const STYLES = `
:where([data-vibeui-block="radio-014"]){
--vibeui-radio-014-bg:oklch(1 0 0);
--vibeui-radio-014-fg:oklch(0.22 0.014 265);
--vibeui-radio-014-muted:oklch(0.55 0.014 265);
--vibeui-radio-014-border:oklch(0.9 0.006 265);
--vibeui-radio-014-ring:oklch(0.74 0.012 265);
--vibeui-radio-014-accent:oklch(0.52 0.17 260);
--vibeui-radio-014-tint:oklch(0.52 0.17 260 / 7%);
--vibeui-radio-014-logo-bg:oklch(0.96 0.004 265);
--vibeui-radio-014-logo-fg:oklch(0.42 0.014 265);
--vibeui-radio-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="radio-014"]{
display:flex;flex-direction:column;
width:100%;max-width:23rem;box-sizing:border-box;
margin:0;padding:0.5rem 0.875rem 0.875rem;
background:var(--vibeui-radio-014-bg);
border:1px solid var(--vibeui-radio-014-border);border-radius:0.875rem;
font-family:var(--vibeui-radio-014-font);color:var(--vibeui-radio-014-fg);
}
[data-vibeui-block="radio-014"] legend{
float:left;width:100%;padding:0;margin:0.375rem 0 0.5rem;
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="radio-014"] [data-part="list"]{clear:both;display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="radio-014"] [data-part="method"]{
display:flex;align-items:center;gap:0.75rem;
padding:0.625rem 0.75rem;border-radius:0.625rem;cursor:pointer;
border:1px solid var(--vibeui-radio-014-border);
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="radio-014"] [data-part="method"]:has(input:checked){
border-color:var(--vibeui-radio-014-accent);background:var(--vibeui-radio-014-tint);
}
[data-vibeui-block="radio-014"] [data-part="method"]:has(input:focus-visible){
outline:2px solid var(--vibeui-radio-014-accent);outline-offset:2px;
}
[data-vibeui-block="radio-014"] [data-part="method"]:has(input:disabled){
cursor:not-allowed;opacity:.55;background:transparent;
}
[data-vibeui-block="radio-014"] input{
appearance:none;-webkit-appearance:none;flex:none;margin:0;cursor:inherit;
width:1.0625rem;height:1.0625rem;border-radius:9999px;
border:1.5px solid var(--vibeui-radio-014-ring);
background:var(--vibeui-radio-014-bg);
}
[data-vibeui-block="radio-014"] input:checked{
border-color:var(--vibeui-radio-014-accent);
box-shadow:inset 0 0 0 0.1875rem var(--vibeui-radio-014-bg),inset 0 0 0 1rem var(--vibeui-radio-014-accent);
}
/* Логотип-заглушка: код платёжной системы в рамке, а не иконка бренда —
   так компонент не тянет ни один настоящий логотип как зависимость. */
[data-vibeui-block="radio-014"] [data-part="logo"]{
flex:none;display:grid;place-items:center;
width:2.75rem;height:1.875rem;border-radius:0.375rem;
border:1px solid var(--vibeui-radio-014-border);
background:var(--vibeui-radio-014-logo-bg);color:var(--vibeui-radio-014-logo-fg);
font-size:0.625rem;font-weight:800;letter-spacing:0.02em;
}
[data-vibeui-block="radio-014"] [data-part="text"]{display:flex;flex-direction:column;gap:0.125rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="radio-014"] [data-part="name"]{font-size:0.875rem;font-weight:600;line-height:1.3}
[data-vibeui-block="radio-014"] [data-part="charge"]{font-size:0.75rem;color:var(--vibeui-radio-014-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="radio-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_METHODS: Radio014Method[] = [
  {
    value: "visa",
    brand: "VISA",
    name: "Карта •••• 4412",
    chargeDate: "Спишется 5 сентября",
  },
  {
    value: "mir",
    brand: "МИР",
    name: "Карта •••• 0071",
    chargeDate: "Спишется 5 сентября",
  },
  {
    value: "sbp",
    brand: "СБП",
    name: "Оплата по номеру телефона",
    chargeDate: "Спишется сразу после подтверждения",
  },
  {
    value: "invoice",
    brand: "СЧЁТ",
    name: "Счёт для юрлица",
    chargeDate: "Недоступно для этого тарифа",
    disabled: true,
  },
]

/**
 * Выбор способа оплаты: логотип-заглушка слева, срок списания под названием.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Radio014({
  legend = "Способ оплаты",
  methods = DEFAULT_METHODS,
  name = "vibeui-radio-014",
  defaultValue = "visa",
  accent,
  className,
  style,
  ...props
}: Radio014Props) {
  const palette = {
    ...(accent ? { "--vibeui-radio-014-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-radio-014" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="radio-014"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <div data-part="list">
          {methods.map((method) => (
            <label key={method.value} data-part="method">
              <input
                type="radio"
                name={name}
                value={method.value}
                disabled={method.disabled}
                defaultChecked={method.value === defaultValue}
              />
              <span data-part="logo" aria-hidden="true">
                {method.brand}
              </span>
              <span data-part="text">
                <span data-part="name">{method.name}</span>
                <span data-part="charge">{method.chargeDate}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  )
}

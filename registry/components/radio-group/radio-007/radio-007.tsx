import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Radio007Method = {
  value: string
  name: string
  eta: string
  price: string
  free?: boolean
  disabled?: boolean
  note?: string
}

export type Radio007Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  methods?: Radio007Method[]
  name?: string
  defaultValue?: string
  accent?: string
}

// Идея компонента: строка доставки читается справа налево — сначала цена,
// потом срок, потом название. Поэтому цена стоит отдельной колонкой с
// моноширинными цифрами и выровнена по правому краю: так три варианта
// сравниваются вертикально, без чтения предложений. Недоступный способ
// не исчезает, а гаснет и объясняет причину.
const STYLES = `
:where([data-vibeui-block="radio-007"]){
--vibeui-radio-007-bg:oklch(1 0 0);
--vibeui-radio-007-fg:oklch(0.22 0.014 265);
--vibeui-radio-007-muted:oklch(0.55 0.014 265);
--vibeui-radio-007-border:oklch(0.9 0.006 265);
--vibeui-radio-007-ring:oklch(0.74 0.012 265);
--vibeui-radio-007-accent:oklch(0.5 0.16 250);
--vibeui-radio-007-free:oklch(0.5 0.15 155);
--vibeui-radio-007-tint:oklch(0.5 0.16 250 / 7%);
--vibeui-radio-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="radio-007"]{
display:flex;flex-direction:column;
width:100%;max-width:24rem;box-sizing:border-box;
margin:0;padding:0.5rem 0.875rem 0.875rem;
background:var(--vibeui-radio-007-bg);
border:1px solid var(--vibeui-radio-007-border);border-radius:0.875rem;
font-family:var(--vibeui-radio-007-font);color:var(--vibeui-radio-007-fg);
}
[data-vibeui-block="radio-007"] legend{
float:left;width:100%;padding:0;margin:0.375rem 0 0.5rem;
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="radio-007"] [data-part="list"]{clear:both;display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="radio-007"] [data-part="method"]{
display:flex;align-items:center;gap:0.75rem;
padding:0.6875rem 0.75rem;border-radius:0.625rem;cursor:pointer;
border:1px solid var(--vibeui-radio-007-border);
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="radio-007"] [data-part="method"]:has(input:checked){
border-color:var(--vibeui-radio-007-accent);background:var(--vibeui-radio-007-tint);
}
[data-vibeui-block="radio-007"] [data-part="method"]:has(input:focus-visible){
outline:2px solid var(--vibeui-radio-007-accent);outline-offset:2px;
}
[data-vibeui-block="radio-007"] [data-part="method"]:has(input:disabled){
cursor:not-allowed;opacity:.55;background:transparent;
}
[data-vibeui-block="radio-007"] input{
appearance:none;-webkit-appearance:none;flex:none;margin:0;cursor:inherit;
width:1.0625rem;height:1.0625rem;border-radius:9999px;
border:1.5px solid var(--vibeui-radio-007-ring);
background:var(--vibeui-radio-007-bg);
}
[data-vibeui-block="radio-007"] input:checked{
border-color:var(--vibeui-radio-007-accent);
box-shadow:inset 0 0 0 0.1875rem var(--vibeui-radio-007-bg),inset 0 0 0 1rem var(--vibeui-radio-007-accent);
}
[data-vibeui-block="radio-007"] [data-part="text"]{display:flex;flex-direction:column;gap:0.125rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="radio-007"] [data-part="name"]{font-size:0.875rem;font-weight:600;line-height:1.3}
[data-vibeui-block="radio-007"] [data-part="eta"]{font-size:0.75rem;color:var(--vibeui-radio-007-muted)}
/* Цена — отдельная колонка справа с табличными цифрами: три строки
   сравниваются взглядом сверху вниз. */
[data-vibeui-block="radio-007"] [data-part="price"]{
flex:none;text-align:right;
font-size:0.875rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="radio-007"] [data-part="price"][data-free="true"]{color:var(--vibeui-radio-007-free)}
[data-vibeui-block="radio-007"] [data-part="total"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
margin:0.75rem 0 0;padding-top:0.625rem;
border-top:1px dashed var(--vibeui-radio-007-border);
font-size:0.75rem;color:var(--vibeui-radio-007-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="radio-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_METHODS: Radio007Method[] = [
  {
    value: "pickup",
    name: "Самовывоз из пункта",
    eta: "Завтра после 14:00",
    price: "0 ₽",
    free: true,
  },
  {
    value: "courier",
    name: "Курьер по городу",
    eta: "Послезавтра, окно 3 часа",
    price: "390 ₽",
  },
  {
    value: "express",
    name: "Экспресс за 2 часа",
    eta: "Сегодня до 21:00",
    price: "890 ₽",
  },
  {
    value: "post",
    name: "Почта России",
    eta: "Недоступно для этого адреса",
    price: "—",
    disabled: true,
  },
]

/**
 * Выбор доставки: срок слева, цена отдельной колонкой справа.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Radio007({
  legend = "Способ доставки",
  methods = DEFAULT_METHODS,
  name = "vibeui-radio-007",
  defaultValue = "courier",
  accent,
  className,
  style,
  ...props
}: Radio007Props) {
  const palette = {
    ...(accent ? { "--vibeui-radio-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-radio-007" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="radio-007"
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
              <span data-part="text">
                <span data-part="name">{method.name}</span>
                <span data-part="eta">{method.eta}</span>
              </span>
              <span data-part="price" data-free={Boolean(method.free)}>
                {method.free ? "бесплатно" : method.price}
              </span>
            </label>
          ))}
        </div>
        <p data-part="total">
          <span>Цена доставки добавится к заказу</span>
          <span>шаг 2 из 3</span>
        </p>
      </fieldset>
    </>
  )
}

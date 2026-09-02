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
  /** Что стоит вместо цены у бесплатного способа. */
  freeLabel?: string
  /** Строка под списком: чем цена доставки обернётся в заказе. */
  footnote?: string
  /** Правая половина той же строки: место шага в оформлении заказа. */
  stepLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: строка доставки читается справа налево — сначала цена,
// потом срок, потом название. Поэтому цена стоит отдельной колонкой с
// моноширинными цифрами и выровнена по правому краю: так три варианта
// сравниваются вертикально, без чтения предложений. Недоступный способ
// не исчезает, а гаснет и объясняет причину.
//
// Тема берётся из color-scheme окружения через light-dark().
const STYLES = `
:where([data-vibeui-block="radio-007"]){
--vibeui-radio-007-bg:transparent;
--vibeui-radio-007-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-radio-007-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-radio-007-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-radio-007-ring:light-dark(oklch(0.74 0.012 265),oklch(0.53 0.014 265));
--vibeui-radio-007-accent:light-dark(oklch(0.5 0.16 250),oklch(0.72 0.14 250));
--vibeui-radio-007-free:light-dark(oklch(0.5 0.15 155),oklch(0.76 0.14 155));
--vibeui-radio-007-tint:light-dark(oklch(0.5 0.16 250 / 7%),oklch(0.72 0.14 250 / 15%));
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
background:transparent;
}
/* Точка нарисована фоном самого кружка: внутренней тенью зазор пришлось бы
   закрашивать цветом подложки, а подложки у компонента по умолчанию нет. */
[data-vibeui-block="radio-007"] input:checked{
border-color:var(--vibeui-radio-007-accent);
background:radial-gradient(circle at 50% 50%,var(--vibeui-radio-007-accent) 0 0.25rem,transparent 0.25rem);
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
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Выбор доставки: срок слева, цена отдельной колонкой справа.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Radio007({
  legend = "Способ доставки",
  methods = DEFAULT_METHODS,
  name = "vibeui-radio-007",
  defaultValue = "courier",
  freeLabel = "бесплатно",
  footnote = "Цена доставки добавится к заказу",
  stepLabel = "шаг 2 из 3",
  background = "",
  accent,
  className,
  style,
  ...props
}: Radio007Props) {
  const palette = {
    ...(accent ? { "--vibeui-radio-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-radio-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
                {method.free ? freeLabel : method.price}
              </span>
            </label>
          ))}
        </div>
        <p data-part="total">
          <span>{footnote}</span>
          <span>{stepLabel}</span>
        </p>
      </fieldset>
    </>
  )
}

import type { ComponentProps, CSSProperties } from "react"

export type Radio014Method = {
  value: string
  brand: string
  name: string
  chargeDate: string
  disabled?: boolean
}

export type Radio014Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  methods?: Radio014Method[]
  name?: string
  defaultValue?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: выбор способа оплаты, где решение держится на двух
// фактах — чем платим и когда спишут. Логотип платёжной системы здесь не
// нужен настоящий: короткий код в рамке — законная заглушка, а дата
// списания стоит отдельной строкой под номером карты, а не в скобках.
//
// Тема берётся из color-scheme окружения через light-dark().
const STYLES = `
:where([data-vibeui-block="radio-014"]){
--vibeui-radio-014-bg:transparent;
--vibeui-radio-014-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-radio-014-muted:color-mix(in oklab,var(--vibeui-radio-014-fg) 68%,transparent);
--vibeui-radio-014-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-radio-014-ring:light-dark(oklch(0.74 0 265),oklch(0.5 0 265));
--vibeui-radio-014-accent:light-dark(oklch(0.52 0.17 260),oklch(0.74 0.15 260));
--vibeui-radio-014-tint:light-dark(oklch(0.52 0.17 260 / 7%),oklch(0.74 0.15 260 / 16%));
--vibeui-radio-014-logo-bg:light-dark(oklch(0.96 0 265),oklch(0.31 0 265));
--vibeui-radio-014-logo-fg:light-dark(oklch(0.42 0 265),oklch(0.83 0 265));
--vibeui-radio-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="radio-014"]{color-scheme:dark}
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
display:flex;align-items:center;gap:0.625rem;
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
width:1.125rem;height:1.125rem;border-radius:9999px;
border:1.5px solid var(--vibeui-radio-014-ring);
background:transparent;
}
/* Точка — градиент, а не внутренняя тень: тени пришлось бы закрашивать
   зазор цветом подложки, а подложки у компонента по умолчанию нет. */
[data-vibeui-block="radio-014"] input:checked{
border-color:var(--vibeui-radio-014-accent);
background:radial-gradient(circle at 50% 50%,var(--vibeui-radio-014-accent) 0 0.21875rem,transparent 0.21875rem);
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
 * Выбор способа оплаты: логотип-заглушка слева, срок списания под названием.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Radio014({
  legend = "Способ оплаты",
  methods = DEFAULT_METHODS,
  name = "vibeui-radio-014",
  defaultValue = "visa",
  background = "",
  accent,
  className,
  style,
  ...props
}: Radio014Props) {
  const palette = {
    ...(accent ? { "--vibeui-radio-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-radio-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-radio-014" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="radio-group"
        data-vibeui-block="radio-014"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <form data-part="list">
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
        </form>
      </fieldset>
    </>
  )
}

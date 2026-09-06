import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup020Currency = {
  code: string
  symbol: string
  name: string
}

export type Buttongroup020Props = Omit<
  ComponentProps<"fieldset">,
  "children"
> & {
  currencies?: Buttongroup020Currency[]
  defaultValue?: string
  label?: string
  name?: string
  /** Заливка сегментов. Пусто — своя, следующая теме страницы. */
  background?: string
  accent?: string
}

// Идея компонента: разделители нарисованы не рамками, а просветами. Трек —
// grid с gap:1px и заливкой цвета границы: сквозь зазоры видно подложку, и
// линия между сегментами получается ровно одна, без отрицательных отступов
// и без вычитания радиусов. Приём переживает перенос строки: auto-fit
// раскладывает валюты в несколько рядов, и сетка сама рисует крест.
// overflow:hidden на треке обрезает углы сегментов по внешнему радиусу.
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="buttongroup-020"]){
--vibeui-buttongroup-020-surface:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-buttongroup-020-fg:light-dark(oklch(0.25 0 265),oklch(0.94 0 265));
--vibeui-buttongroup-020-muted:color-mix(in oklab,var(--vibeui-buttongroup-020-fg) 68%,transparent);
--vibeui-buttongroup-020-border:light-dark(oklch(0.88 0 265),oklch(0.39 0 265));
--vibeui-buttongroup-020-on:light-dark(oklch(0.965 0 250),oklch(0.3 0.045 250));
--vibeui-buttongroup-020-accent:light-dark(oklch(0.5 0.14 250),oklch(0.77 0.12 250));
--vibeui-buttongroup-020-radius:0.75rem;
--vibeui-buttongroup-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-020"]{color-scheme:dark}
[data-vibeui-block="buttongroup-020"]{
box-sizing:border-box;display:block;width:100%;max-width:24rem;
margin:0;padding:0;border:0;
font-family:var(--vibeui-buttongroup-020-font);
}
[data-vibeui-block="buttongroup-020"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-020"] legend{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
/* Заливка трека видна в зазорах — это и есть разделители. */
[data-vibeui-block="buttongroup-020"] [data-part="track"]{
/* Одна строка при любом числе валют: auto-fit переносил четвёртую пилюлю
   вниз, и переключатель разваливался на две строки. */
display:grid;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);
gap:1px;isolation:isolate;
border:1px solid var(--vibeui-buttongroup-020-border);
border-radius:var(--vibeui-buttongroup-020-radius);
background:var(--vibeui-buttongroup-020-border);
overflow:hidden;
}
[data-vibeui-block="buttongroup-020"] [data-part="segment"]{
position:relative;z-index:0;
display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.125rem;
padding:0.625rem 0.5rem;
background:var(--vibeui-buttongroup-020-surface);
color:var(--vibeui-buttongroup-020-muted);
cursor:pointer;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="buttongroup-020"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
[data-vibeui-block="buttongroup-020"] [data-part="symbol"]{
font-size:1.125rem;font-weight:700;line-height:1.1;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="buttongroup-020"] [data-part="code"]{
font-size:0.6875rem;font-weight:650;letter-spacing:0.06em;line-height:1.2;
}
[data-vibeui-block="buttongroup-020"] [data-part="name"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
[data-vibeui-block="buttongroup-020"] [data-part="segment"]:hover{color:var(--vibeui-buttongroup-020-fg)}
[data-vibeui-block="buttongroup-020"] [data-part="segment"]:has(input:checked){
z-index:1;
background:var(--vibeui-buttongroup-020-on);
color:var(--vibeui-buttongroup-020-accent);
box-shadow:inset 0 0 0 1px var(--vibeui-buttongroup-020-accent);
}
[data-vibeui-block="buttongroup-020"] [data-part="segment"]:has(input:focus-visible){
z-index:2;
outline:2px solid var(--vibeui-buttongroup-020-accent);outline-offset:-2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-020"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CURRENCIES: Buttongroup020Currency[] = [
  { code: "RUB", symbol: "₽", name: "российский рубль" },
  { code: "USD", symbol: "$", name: "доллар США" },
  { code: "EUR", symbol: "€", name: "евро" },
  { code: "GBP", symbol: "£", name: "фунт стерлингов" },
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
 * Выбор валюты, где разделители — просветы сетки, а не рамки сегментов.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup020({
  currencies = DEFAULT_CURRENCIES,
  defaultValue = "RUB",
  label = "Валюта отчёта",
  name = "buttongroup-020",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup020Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-020-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-020-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-020" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-020"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <form data-part="track">
          {currencies.map((currency) => (
            <label key={currency.code} data-part="segment">
              <input
                type="radio"
                name={name}
                value={currency.code}
                defaultChecked={currency.code === defaultValue}
              />
              <span data-part="symbol" aria-hidden="true">
                {currency.symbol}
              </span>
              <span data-part="code">{currency.code}</span>
              <span data-part="name">, {currency.name}</span>
            </label>
          ))}
        </form>
      </fieldset>
    </>
  )
}

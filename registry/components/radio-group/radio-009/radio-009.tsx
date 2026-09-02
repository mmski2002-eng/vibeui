import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Radio009Bundle = {
  value: string
  qty: string
  price: string
  perUnit: string
  save?: string
}

export type Radio009Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  bundles?: Radio009Bundle[]
  name?: string
  defaultValue?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: выбор объёма упаковки, а не тарифа. Решение принимают по
// цене за штуку, поэтому она стоит отдельной строкой под общей суммой, а
// самый выгодный вариант помечен бейджем в углу — сравнение идёт по цифрам,
// а не по названию плана. Радио остаётся видимым кружком, а не тиком.
//
// Тема берётся из color-scheme окружения через light-dark().
const STYLES = `
:where([data-vibeui-block="radio-009"]){
--vibeui-radio-009-bg:transparent;
--vibeui-radio-009-card:light-dark(oklch(0.99 0.002 265),oklch(0.27 0.008 265));
--vibeui-radio-009-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-radio-009-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-radio-009-border:light-dark(oklch(0.9 0.006 265),oklch(0.37 0.012 265));
--vibeui-radio-009-ring:light-dark(oklch(0.74 0.012 265),oklch(0.54 0.014 265));
--vibeui-radio-009-accent:light-dark(oklch(0.58 0.15 165),oklch(0.76 0.14 165));
--vibeui-radio-009-tint:light-dark(oklch(0.58 0.15 165 / 7%),oklch(0.76 0.14 165 / 15%));
--vibeui-radio-009-save:light-dark(oklch(0.58 0.15 165),oklch(0.76 0.14 165));
--vibeui-radio-009-on-save:light-dark(oklch(1 0 0),oklch(0.18 0.03 165));
--vibeui-radio-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="radio-009"]{
display:flex;flex-direction:column;
width:100%;max-width:24rem;box-sizing:border-box;
margin:0;padding:0.5rem 0.875rem 0.875rem;
background:var(--vibeui-radio-009-bg);
border:1px solid var(--vibeui-radio-009-border);border-radius:0.875rem;
font-family:var(--vibeui-radio-009-font);color:var(--vibeui-radio-009-fg);
}
[data-vibeui-block="radio-009"] legend{
float:left;width:100%;padding:0;margin:0.375rem 0 0.625rem;
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="radio-009"] [data-part="grid"]{
clear:both;display:grid;gap:0.625rem;
grid-template-columns:repeat(auto-fit,minmax(7rem,1fr));
}
[data-vibeui-block="radio-009"] [data-part="bundle"]{
position:relative;display:flex;flex-direction:column;gap:0.25rem;
padding:0.6875rem 0.75rem;border-radius:0.75rem;cursor:pointer;
border:1.5px solid var(--vibeui-radio-009-border);
background:var(--vibeui-radio-009-card);
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="radio-009"] [data-part="bundle"]:has(input:checked){
border-color:var(--vibeui-radio-009-accent);background:var(--vibeui-radio-009-tint);
}
[data-vibeui-block="radio-009"] [data-part="bundle"]:has(input:focus-visible){
outline:2px solid var(--vibeui-radio-009-accent);outline-offset:2px;
}
[data-vibeui-block="radio-009"] input{
appearance:none;-webkit-appearance:none;flex:none;margin:0;cursor:pointer;
width:1rem;height:1rem;border-radius:9999px;
border:1.5px solid var(--vibeui-radio-009-ring);
background:transparent;
}
/* Точка нарисована фоном самого кружка: внутренней тенью зазор пришлось бы
   закрашивать цветом подложки, а подложки у компонента по умолчанию нет. */
[data-vibeui-block="radio-009"] input:checked{
border-color:var(--vibeui-radio-009-accent);
background:radial-gradient(circle at 50% 50%,var(--vibeui-radio-009-accent) 0 0.21875rem,transparent 0.21875rem);
}
[data-vibeui-block="radio-009"] [data-part="qty"]{font-size:0.8125rem;font-weight:700}
/* Бейдж экономии сидит в углу карточки, а не в тексте: так самый выгодный
   вариант замечают до чтения цифр. */
[data-vibeui-block="radio-009"] [data-part="save"]{
position:absolute;top:0.5rem;right:0.5rem;
padding:0.0625rem 0.375rem;border-radius:9999px;
background:var(--vibeui-radio-009-save);color:var(--vibeui-radio-009-on-save);
font-size:0.625rem;font-weight:700;
}
[data-vibeui-block="radio-009"] [data-part="price"]{
margin-top:0.125rem;font-size:1.0625rem;font-weight:750;line-height:1.1;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="radio-009"] [data-part="unit"]{font-size:0.6875rem;color:var(--vibeui-radio-009-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="radio-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_BUNDLES: Radio009Bundle[] = [
  { value: "1", qty: "1 упаковка", price: "790 ₽", perUnit: "790 ₽ / шт" },
  {
    value: "3",
    qty: "3 упаковки",
    price: "2 070 ₽",
    perUnit: "690 ₽ / шт",
    save: "-13%",
  },
  {
    value: "6",
    qty: "6 упаковок",
    price: "3 780 ₽",
    perUnit: "630 ₽ / шт",
    save: "-20%",
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
 * Выбор объёма упаковки карточками: сумма, цена за штуку и бейдж экономии.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Radio009({
  legend = "Сколько упаковок",
  bundles = DEFAULT_BUNDLES,
  name = "vibeui-radio-009",
  defaultValue = "3",
  background = "",
  accent,
  className,
  style,
  ...props
}: Radio009Props) {
  const palette = {
    ...(accent ? { "--vibeui-radio-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-radio-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-radio-009" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="radio-009"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <div data-part="grid">
          {bundles.map((bundle) => (
            <label key={bundle.value} data-part="bundle">
              <input
                type="radio"
                name={name}
                value={bundle.value}
                defaultChecked={bundle.value === defaultValue}
              />
              {bundle.save ? <span data-part="save">{bundle.save}</span> : null}
              <span data-part="qty">{bundle.qty}</span>
              <span data-part="price">{bundle.price}</span>
              <span data-part="unit">{bundle.perUnit}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  )
}

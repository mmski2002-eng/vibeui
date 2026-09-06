import type { ComponentProps, CSSProperties } from "react"

export type Radio001Option = {
  value: string
  label: string
  hint?: string
  price?: string
}

export type Radio001Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "defaultValue"
> & {
  options?: Radio001Option[]
  legend?: string
  name?: string
  defaultValue?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: выбор одного варианта карточками. Кликабельна вся карточка,
// а не кружок в 16 пикселей: попасть в неё можно и пальцем, и мышью на ходу.
// Группа собрана на fieldset с legend — так скринридер объявляет вопрос перед
// вариантами. Легенда прижата float, иначе она садится на рамку и обрезается.
//
// Радиокнопки лежат в собственной <form data-part="options"> (display:contents,
// чтобы не ломать flex-раскладку fieldset): одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="radio-001"]){
--vibeui-radio-001-bg:transparent;
--vibeui-radio-001-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-radio-001-muted:color-mix(in oklab,var(--vibeui-radio-001-fg) 68%,transparent);
--vibeui-radio-001-border:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-radio-001-accent:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-radio-001-tint:light-dark(oklch(0.24 0.015 265 / 6%),oklch(0.93 0.006 265 / 12%));
--vibeui-radio-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="radio-001"]{color-scheme:dark}
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
[data-vibeui-block="radio-001"] [data-part="options"]{display:contents}
[data-vibeui-block="radio-001"] [data-part="option"]{
position:relative;display:flex;align-items:flex-start;gap:0.625rem;
padding:0.625rem 0.75rem;border-radius:0.625rem;cursor:pointer;
border:1px solid var(--vibeui-radio-001-border);
}
[data-vibeui-block="radio-001"] input{
appearance:none;flex:none;margin:0.0625rem 0 0;cursor:pointer;
width:1.125rem;height:1.125rem;border-radius:9999px;
border:1.5px solid var(--vibeui-radio-001-muted);background:transparent;
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
/* Название тянется, цена держится одной строкой у правого края: без nowrap
   «5 900 ₽» разрывалось по пробелу и уезжало под подпись. */
[data-vibeui-block="radio-001"] [data-part="label"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
font-size:0.875rem;font-weight:600;line-height:1.3;
}
[data-vibeui-block="radio-001"] [data-part="price"]{
flex:none;white-space:nowrap;font-variant-numeric:tabular-nums;font-weight:650;
}
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
 * Радиогруппа карточками: кликабельна вся карточка, а не кружок.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Radio001({
  options = DEFAULT_OPTIONS,
  legend = "Тариф",
  name = "vibeui-radio-001",
  defaultValue = "year",
  background = "",
  accent,
  className,
  style,
  ...props
}: Radio001Props) {
  const palette = {
    ...(accent ? { "--vibeui-radio-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-radio-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-radio-001" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="radio-group"
        data-vibeui-block="radio-001"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <form data-part="options">
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
                {option.hint ? (
                  <span data-part="hint">{option.hint}</span>
                ) : null}
              </span>
            </label>
          ))}
        </form>
      </fieldset>
    </>
  )
}

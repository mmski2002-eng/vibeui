import type { ComponentProps, CSSProperties } from "react"

export type Inputgroup004Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  name?: string
  label?: string
  currencies?: string[]
  defaultValue?: number
  /** Подпись списка валют для чтения вслух. */
  currencyLabel?: string
  hint?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: число прижато вправо, к самой границе с валютой, — так
// сумма и её валюта читаются как одна строка «12 500 ₽», а не как два поля.
// Рамка живёт на группе, у input и select её нет; разделяет половины
// внутренняя линия box-shadow'ом, чтобы схлопывание границ не давало
// двойной толщины. Стрелка select нарисована градиентами: своя разметка
// внутри option невозможна, а картинку в registry не положишь.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="inputgroup-004"]){
--vibeui-inputgroup-004-surface:transparent;
--vibeui-inputgroup-004-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-inputgroup-004-fg:light-dark(oklch(0.21 0 265),oklch(0.95 0 265));
--vibeui-inputgroup-004-muted:color-mix(in oklab,var(--vibeui-inputgroup-004-fg) 68%,transparent);
--vibeui-inputgroup-004-field:light-dark(oklch(0.99 0 265),oklch(0.26 0 265));
--vibeui-inputgroup-004-fixed:light-dark(oklch(0.96 0 265),oklch(0.32 0 265));
--vibeui-inputgroup-004-border:light-dark(oklch(0.86 0 265),oklch(0.44 0 265));
--vibeui-inputgroup-004-accent:light-dark(oklch(0.5 0.15 150),oklch(0.74 0.14 150));
--vibeui-inputgroup-004-radius:0.75rem;
--vibeui-inputgroup-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="inputgroup-004"]{color-scheme:dark}
[data-vibeui-block="inputgroup-004"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-004-surface);
border:1px solid var(--vibeui-inputgroup-004-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-004-font);color:var(--vibeui-inputgroup-004-fg);
}
[data-vibeui-block="inputgroup-004"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-004"] label{font-size:0.8125rem;font-weight:600}
/* Рамка одна на всю сцепку, overflow обрезает половины по её радиусу. */
[data-vibeui-block="inputgroup-004"] [data-part="group"]{
display:flex;align-items:stretch;overflow:hidden;
height:3rem;background:var(--vibeui-inputgroup-004-field);
border:1px solid var(--vibeui-inputgroup-004-border);
border-radius:var(--vibeui-inputgroup-004-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="inputgroup-004"] [data-part="group"]:focus-within{
border-color:var(--vibeui-inputgroup-004-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-inputgroup-004-accent) 18%,transparent);
}
[data-vibeui-block="inputgroup-004"] [data-part="group"] > *{
border:0;background:none;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-004"] [data-part="group"] > *:focus{outline:none}
[data-vibeui-block="inputgroup-004"] input{
flex:1;min-width:0;padding:0 0.75rem;text-align:right;
font-size:1.25rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="inputgroup-004"] input::-webkit-outer-spin-button,
[data-vibeui-block="inputgroup-004"] input::-webkit-inner-spin-button{appearance:none;margin:0}
/* Внутренняя линия тенью, а не border: толщина не удваивается. */
[data-vibeui-block="inputgroup-004"] select{
appearance:none;flex:none;width:6.5ch;padding:0 1.25rem 0 0.625rem;cursor:pointer;
background:var(--vibeui-inputgroup-004-fixed);
box-shadow:inset 1px 0 0 var(--vibeui-inputgroup-004-border);
font-size:0.9375rem;font-weight:650;color:var(--vibeui-inputgroup-004-muted);
background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);
background-position:calc(100% - 0.8rem) 50%,calc(100% - 0.5rem) 50%;
background-size:0.3rem 0.3rem,0.3rem 0.3rem;
background-repeat:no-repeat;
}
[data-vibeui-block="inputgroup-004"] [data-part="group"]:focus-within select:focus{
color:var(--vibeui-inputgroup-004-fg);
}
[data-vibeui-block="inputgroup-004"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-004-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-004"] *{animation:none!important;transition:none!important}}
`

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
 * Сцепка «сумма + валюта» в одной рамке: число справа, валюта у самой границы.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup004({
  name = "amount",
  label = "Стоимость подписки",
  currencies = ["₽", "$", "€", "₸"],
  defaultValue = 1290,
  currencyLabel = "Валюта",
  hint = "Валюта уходит отдельным полем формы, пересчёт делает сервер.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Inputgroup004Props) {
  const palette = {
    ...(accent ? { "--vibeui-inputgroup-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-inputgroup-004-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-inputgroup-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input-group"
        data-vibeui-block="inputgroup-004"
        className={className}
        style={palette}
      >
        <label htmlFor={`${name}-value`}>{label}</label>
        <div data-part="group">
          <input
            id={`${name}-value`}
            name={name}
            type="number"
            inputMode="decimal"
            min={0}
            step={10}
            defaultValue={defaultValue}
            aria-describedby={`${name}-hint`}
          />
          <select
            name={`${name}-currency`}
            aria-label={currencyLabel}
            defaultValue={currencies[0]}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <p data-part="hint" id={`${name}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}

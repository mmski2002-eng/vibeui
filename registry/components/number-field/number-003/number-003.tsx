import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Number003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  unit?: string
  hint?: string
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  name?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: число и его единица в одной рамке. Единица не плейсхолдер
// и не текст рядом — это отдельная зона поля за разделителем, поэтому она
// видна и при заполненном поле, и при пустом. Число прижато вправо, к самой
// единице: так «12 м²» читается как одна величина, а не как два элемента.
// Компонент серверный: состояние тут не нужно, значение забирает форма.
//
// Тема берётся из color-scheme окружения через light-dark(): поле темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="number-003"]){
--vibeui-number-003-surface:transparent;
--vibeui-number-003-field:light-dark(oklch(1 0 0),oklch(0.26 0.012 265));
--vibeui-number-003-suffix:light-dark(oklch(0.965 0.004 265),oklch(0.32 0.013 265));
--vibeui-number-003-shell:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-number-003-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-number-003-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-number-003-border:light-dark(oklch(0.88 0.008 265),oklch(0.42 0.014 265));
--vibeui-number-003-accent:light-dark(oklch(0.52 0.15 250),oklch(0.72 0.14 250));
--vibeui-number-003-ring:light-dark(oklch(0.52 0.15 250 / 20%),oklch(0.72 0.14 250 / 30%));
--vibeui-number-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Подложки по умолчанию нет: поле ложится на фон страницы. */
[data-vibeui-block="number-003"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:16rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-number-003-surface);
border:1px solid var(--vibeui-number-003-shell);border-radius:0.875rem;
font-family:var(--vibeui-number-003-font);color:var(--vibeui-number-003-fg);
}
[data-vibeui-block="number-003"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="number-003"] [data-part="field"]{
display:flex;align-items:stretch;overflow:hidden;
border:1px solid var(--vibeui-number-003-border);border-radius:0.625rem;
background:var(--vibeui-number-003-field);
}
[data-vibeui-block="number-003"] [data-part="field"]:focus-within{
border-color:var(--vibeui-number-003-accent);
box-shadow:0 0 0 2px var(--vibeui-number-003-ring);
}
/* Число прижато к единице: «12 м²» читается как одна величина. */
[data-vibeui-block="number-003"] input{
flex:1 1 auto;min-width:0;width:100%;
appearance:none;border:0;background:none;outline:none;
height:2.625rem;padding:0 0.625rem;color:inherit;
font:inherit;font-size:1rem;font-weight:680;text-align:right;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="number-003"] input::-webkit-outer-spin-button,
[data-vibeui-block="number-003"] input::-webkit-inner-spin-button{appearance:none;margin:0}
/* Единица — отдельная зона за разделителем: видна и на пустом поле. */
[data-vibeui-block="number-003"] [data-part="unit"]{
display:flex;align-items:center;flex:none;
padding:0 0.75rem;
border-left:1px solid var(--vibeui-number-003-border);
background:var(--vibeui-number-003-suffix);
color:var(--vibeui-number-003-muted);
font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="number-003"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-number-003-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="number-003"] *{animation:none!important;transition:none!important}}
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
 * Число с единицей измерения в отдельной зоне поля.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Number003({
  label = "Площадь квартиры",
  unit = "м²",
  hint = "Считается по внутренним стенам, без балкона.",
  defaultValue = 54,
  min = 10,
  max = 400,
  step = 1,
  name = "area",
  background = "",
  accent,
  className,
  style,
  ...props
}: Number003Props) {
  const palette = {
    ...(accent ? { "--vibeui-number-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-number-003-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-number-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="number-003"
        className={className}
        style={palette}
      >
        <label htmlFor={`${name}-input`}>{label}</label>
        <div data-part="field">
          <input
            id={`${name}-input`}
            name={name}
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            defaultValue={defaultValue}
            aria-describedby={hint ? `${name}-hint` : undefined}
          />
          <span data-part="unit" aria-hidden="true">
            {unit}
          </span>
        </div>
        {hint ? (
          <p id={`${name}-hint`} data-part="hint">
            {hint}
          </p>
        ) : null}
      </div>
    </>
  )
}

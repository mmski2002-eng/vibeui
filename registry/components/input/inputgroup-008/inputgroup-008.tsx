import type { ComponentProps, CSSProperties } from "react"

export type Inputgroup008Props = Omit<ComponentProps<"form">, "children"> & {
  name?: string
  label?: string
  action?: string
  /** Подсказки в полях: город и индекс. */
  fieldText?: { city: string; zip: string }
  /** Подпись поля индекса для чтения вслух. */
  zipLabel?: string
  hint?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: одна и та же сцепка на телефоне — столбик во всю ширину,
// на широком месте — строка. Раскладка считается от собственной ширины блока
// через container query, а не от ширины окна: тот же компонент в узкой колонке
// сайдбара обязан сложиться так же, как на телефоне. При складывании
// схлопнутая граница переезжает с левой стороны на верхнюю, а скругления —
// с боков на верх и низ; иначе столбик распадается на три отдельные рамки.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="inputgroup-008"]){
--vibeui-inputgroup-008-surface:transparent;
--vibeui-inputgroup-008-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-inputgroup-008-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-inputgroup-008-muted:color-mix(in oklab,var(--vibeui-inputgroup-008-fg) 68%,transparent);
--vibeui-inputgroup-008-field:light-dark(oklch(0.99 0 265),oklch(0.27 0 265));
--vibeui-inputgroup-008-border:light-dark(oklch(0.86 0 265),oklch(0.44 0 265));
--vibeui-inputgroup-008-accent:light-dark(oklch(0.275 0 0),oklch(0.899 0 0));
--vibeui-inputgroup-008-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0.02 25));
--vibeui-inputgroup-008-radius:0.75rem;
--vibeui-inputgroup-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="inputgroup-008"]{color-scheme:dark}
[data-vibeui-block="inputgroup-008"]{
display:block;margin:0;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-008-surface);
border:1px solid var(--vibeui-inputgroup-008-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-008-font);color:var(--vibeui-inputgroup-008-fg);
}
[data-vibeui-block="inputgroup-008"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-008"] [data-part="shell"]{
display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="inputgroup-008"] label{font-size:0.8125rem;font-weight:600}
/* Столбик по умолчанию: схлопнутая граница сверху, скругления по краям
   всей стопки. Так выглядит форма на телефоне. */
[data-vibeui-block="inputgroup-008"] [data-part="group"]{
display:flex;flex-direction:column;
}
[data-vibeui-block="inputgroup-008"] [data-part="group"] > *{
position:relative;height:2.75rem;width:100%;
border:1px solid var(--vibeui-inputgroup-008-border);
border-radius:0;margin-top:-1px;margin-left:0;
font:inherit;font-size:0.875rem;color:inherit;
}
[data-vibeui-block="inputgroup-008"] [data-part="group"] > *:first-child{
margin-top:0;
border-radius:var(--vibeui-inputgroup-008-radius) var(--vibeui-inputgroup-008-radius) 0 0;
}
[data-vibeui-block="inputgroup-008"] [data-part="group"] > *:last-child{
border-radius:0 0 var(--vibeui-inputgroup-008-radius) var(--vibeui-inputgroup-008-radius);
}
[data-vibeui-block="inputgroup-008"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-008"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-008-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-008-accent);
}
[data-vibeui-block="inputgroup-008"] input{
padding:0 0.875rem;background:var(--vibeui-inputgroup-008-field);
}
[data-vibeui-block="inputgroup-008"] button{
appearance:none;cursor:pointer;
background:var(--vibeui-inputgroup-008-accent);
border-color:var(--vibeui-inputgroup-008-accent);
color:oklch(from var(--vibeui-inputgroup-008-accent) clamp(0,(0.62 - l) * 100,1) 0 0);font-weight:650;
transition:filter .16s ease;
}
[data-vibeui-block="inputgroup-008"] button:hover{filter:brightness(1.08)}
[data-vibeui-block="inputgroup-008"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-008-muted);
}
/* Есть место — та же сцепка становится строкой. */
@container (min-width: 30rem){
[data-vibeui-block="inputgroup-008"] [data-part="group"]{flex-direction:row}
[data-vibeui-block="inputgroup-008"] [data-part="group"] > *{
width:auto;margin-top:0;margin-left:-1px;
}
[data-vibeui-block="inputgroup-008"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-008-radius) 0 0 var(--vibeui-inputgroup-008-radius);
}
[data-vibeui-block="inputgroup-008"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-008-radius) var(--vibeui-inputgroup-008-radius) 0;
}
[data-vibeui-block="inputgroup-008"] [data-part="city"]{flex:2 1 0}
[data-vibeui-block="inputgroup-008"] [data-part="zip"]{flex:1 1 0;min-width:7rem}
[data-vibeui-block="inputgroup-008"] button{flex:none;padding:0 1.5rem}
}
/* Специфичнее общего color:inherit у детей группы: кнопка на акценте держит свой контраст. */
[data-vibeui-block="inputgroup-008"] [data-part="group"] > button{color:oklch(from var(--vibeui-inputgroup-008-accent) clamp(0,(0.62 - l) * 100,1) 0 0)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-008"] *{animation:none!important;transition:none!important}}
`

const FIELD_TEXT = { city: "Город", zip: "Индекс" }

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
 * Сцепка полной ширины: столбик на узком месте, строка на широком.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup008({
  name = "delivery",
  label = "Куда доставить",
  action = "Рассчитать",
  fieldText = FIELD_TEXT,
  zipLabel = "Почтовый индекс",
  hint = "Раскладка считается от ширины самого блока: в узкой колонке сцепка складывается так же, как на телефоне.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Inputgroup008Props) {
  const palette = {
    ...(accent ? { "--vibeui-inputgroup-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-inputgroup-008-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-inputgroup-008" precedence="medium">
        {STYLES}
      </style>
      <form
        {...props}
        data-slot="input-group"
        data-vibeui-block="inputgroup-008"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <label htmlFor={`${name}-city`}>{label}</label>
          <div data-part="group">
            <input
              id={`${name}-city`}
              data-part="city"
              name={`${name}-city`}
              type="text"
              autoComplete="address-level2"
              placeholder={fieldText.city}
              aria-describedby={`${name}-hint`}
            />
            <input
              data-part="zip"
              name={`${name}-zip`}
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder={fieldText.zip}
              aria-label={zipLabel}
            />
            <button type="submit">{action}</button>
          </div>
          <p data-part="hint" id={`${name}-hint`}>
            {hint}
          </p>
        </div>
      </form>
    </>
  )
}

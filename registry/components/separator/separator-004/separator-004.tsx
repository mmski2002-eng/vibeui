import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Separator004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  above?: string
  below?: string
  dash?: number
  gap?: number
  /** Подпись состояния верхнего раздела. */
  doneText?: string
  /** Подпись рисунка: {dash} и {gap} подставляются числами. */
  dashText?: string
  /** Пусто — подложки нет, разделы лежат прямо на фоне страницы. */
  background?: string
}

// Идея компонента: пунктирная линия с управляемым рисунком. border-style
// dashed рисует штрих, длина которого зависит от браузера и от толщины
// границы — одинакового пунктира в двух местах макета так не добиться. Здесь
// линия набрана repeating-linear-gradient: длина штриха и промежуток заданы
// числами, поэтому рисунок повторяем и предсказуем.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки по
// умолчанию нет, а пунктир в тёмном контексте светлее фона.
const STYLES = `
:where([data-vibeui-block="separator-004"]){
--vibeui-separator-004-dash:6px;
--vibeui-separator-004-gap:6px;
--vibeui-separator-004-line:light-dark(oklch(0.78 0.01 265),oklch(0.5 0.014 265));
--vibeui-separator-004-surface:transparent;
--vibeui-separator-004-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-separator-004-fg:light-dark(oklch(0.26 0.014 265),oklch(0.94 0.006 265));
--vibeui-separator-004-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-separator-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="separator-004"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem 1rem;
background:var(--vibeui-separator-004-surface);
border:1px solid var(--vibeui-separator-004-border);border-radius:0.875rem;
font-family:var(--vibeui-separator-004-font);color:var(--vibeui-separator-004-fg);
font-size:0.8125rem;
}
[data-vibeui-block="separator-004"] [data-part="row"]{
display:flex;align-items:center;justify-content:space-between;gap:1rem;
}
[data-vibeui-block="separator-004"] [data-part="hint"]{
color:var(--vibeui-separator-004-muted);font-variant-numeric:tabular-nums;
}
/* Градиент вместо border-dashed: длина штриха задана числом и повторяема. */
[data-vibeui-block="separator-004"] [data-part="rule"]{
height:1px;border:0;margin:0;
background-image:repeating-linear-gradient(90deg,
var(--vibeui-separator-004-line) 0,
var(--vibeui-separator-004-line) var(--vibeui-separator-004-dash),
transparent var(--vibeui-separator-004-dash),
transparent calc(var(--vibeui-separator-004-dash) + var(--vibeui-separator-004-gap)));
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="separator-004"] *{animation:none!important;transition:none!important}}
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
 * Пунктирный разделитель с управляемой длиной штриха и промежутка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Separator004({
  above = "Личные данные",
  below = "Оплата",
  dash = 6,
  gap = 6,
  doneText = "заполнено",
  dashText = "штрих {dash} / {gap}",
  background = "",
  className,
  style,
  ...props
}: Separator004Props) {
  const palette = {
    "--vibeui-separator-004-dash": `${dash}px`,
    "--vibeui-separator-004-gap": `${gap}px`,
    ...(background
      ? {
          "--vibeui-separator-004-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties
  const hint = dashText
    .replace("{dash}", String(dash))
    .replace("{gap}", String(gap))

  return (
    <>
      <style href="vibeui-separator-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="separator-004"
        className={className}
        style={palette}
      >
        <p data-part="row">
          <span>{above}</span>
          <span data-part="hint">{doneText}</span>
        </p>
        <hr data-part="rule" />
        <p data-part="row">
          <span>{below}</span>
          <span data-part="hint">{hint}</span>
        </p>
      </div>
    </>
  )
}

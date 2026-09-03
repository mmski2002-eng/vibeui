import type { ComponentProps, CSSProperties } from "react"

export type Separator002Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  align?: "start" | "center" | "end"
  /** Цвет линии и рамки пилюли. Пусто — цвет из палитры компонента. */
  line?: string
}

// Идея компонента: подпись разделителя в «пилюле», которая сама несёт фон.
// Приём с текстом, закрашенным цветом страницы, ломается на градиенте и на
// картинке: подпись оказывается в прямоугольнике чужого цвета. Пилюля со
// своей заливкой и рамкой работает на любой подложке. Положение подписи
// задаётся числом колонок сетки, а не отступами — линии всегда сходятся.
//
// Заливка пилюли объявлена через light-dark(): в тёмном окружении она
// темнее фона страницы, а текст в ней светлый.
const STYLES = `
:where([data-vibeui-block="separator-002"]){
--vibeui-separator-002-line:light-dark(oklch(0.88 0.006 265),oklch(0.37 0.012 265));
--vibeui-separator-002-pill:light-dark(oklch(0.98 0.002 265),oklch(0.26 0.012 265));
--vibeui-separator-002-fg:light-dark(oklch(0.35 0.014 265),oklch(0.9 0.008 265));
--vibeui-separator-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="separator-002"]{color-scheme:dark}
[data-vibeui-block="separator-002"]{
display:grid;align-items:center;gap:0.625rem;
width:100%;max-width:24rem;box-sizing:border-box;
font-family:var(--vibeui-separator-002-font);
}
/* Положение подписи — это число колонок, а не отступы: линии всегда сходятся. */
[data-vibeui-block="separator-002"][data-align="center"]{grid-template-columns:1fr auto 1fr}
[data-vibeui-block="separator-002"][data-align="start"]{grid-template-columns:auto 1fr}
[data-vibeui-block="separator-002"][data-align="end"]{grid-template-columns:1fr auto}
[data-vibeui-block="separator-002"] [data-part="line"]{
height:1px;background:var(--vibeui-separator-002-line);
}
/* Пилюля несёт свой фон: приём «текст цвета страницы» рвётся на градиенте. */
[data-vibeui-block="separator-002"] [data-part="pill"]{
padding:0.1875rem 0.625rem;border-radius:9999px;
background:var(--vibeui-separator-002-pill);
border:1px solid var(--vibeui-separator-002-line);
color:var(--vibeui-separator-002-fg);
font-size:0.6875rem;font-weight:650;letter-spacing:0.04em;text-transform:uppercase;
white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="separator-002"] *{animation:none!important;transition:none!important}}
`

/**
 * Разделитель с подписью в пилюле: слева, по центру или справа.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Separator002({
  label = "или",
  align = "center",
  line = "",
  className,
  style,
  ...props
}: Separator002Props) {
  const palette = {
    ...(line ? { "--vibeui-separator-002-line": line } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-separator-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="separator"
        data-vibeui-block="separator-002"
        data-align={align}
        role="separator"
        aria-label={label}
        className={className}
        style={palette}
      >
        {align === "start" ? null : <span data-part="line" />}
        <span data-part="pill">{label}</span>
        {align === "end" ? null : <span data-part="line" />}
      </div>
    </>
  )
}

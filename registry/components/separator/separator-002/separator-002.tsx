import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Separator002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  align?: "start" | "center" | "end"
}

// Идея компонента: подпись разделителя в «пилюле», которая сама несёт фон.
// Приём с текстом, закрашенным цветом страницы, ломается на градиенте и на
// картинке: подпись оказывается в прямоугольнике чужого цвета. Пилюля со
// своей заливкой и рамкой работает на любой подложке. Положение подписи
// задаётся числом колонок сетки, а не отступами — линии всегда сходятся.
const STYLES = `
:where([data-vibeui-block="separator-002"]){
--vibeui-separator-002-line:oklch(0.88 0.006 265);
--vibeui-separator-002-pill:oklch(0.98 0.002 265);
--vibeui-separator-002-fg:oklch(0.35 0.014 265);
--vibeui-separator-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
  className,
  style,
  ...props
}: Separator002Props) {
  return (
    <>
      <style href="vibeui-separator-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="separator-002"
        data-align={align}
        role="separator"
        aria-label={label}
        className={className}
        style={style as CSSProperties}
      >
        {align === "start" ? null : <span data-part="line" />}
        <span data-part="pill">{label}</span>
        {align === "end" ? null : <span data-part="line" />}
      </div>
    </>
  )
}

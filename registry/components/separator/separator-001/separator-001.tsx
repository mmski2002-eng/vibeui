import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Separator001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  orientation?: "horizontal" | "vertical"
  /** Цвет линии. Пусто — цвет из палитры компонента. */
  line?: string
}

// Идея компонента: разделитель, который умеет держать подпись. Линия с
// текстом посередине набирается сеткой из трёх колонок, а не двумя блоками с
// фоном: тогда она работает на любой подложке. Пустой разделитель помечен
// role="separator" и aria-hidden не получает — его слышно как границу.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте линия светлее фона, а не темнее.
const STYLES = `
:where([data-vibeui-block="separator-001"]){
--vibeui-separator-001-line:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-separator-001-muted:light-dark(oklch(0.56 0.014 265),oklch(0.71 0.012 265));
--vibeui-separator-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="separator-001"]{
display:grid;align-items:center;gap:0.75rem;
width:100%;box-sizing:border-box;
font-family:var(--vibeui-separator-001-font);
}
/* Три колонки: линия — текст — линия. Так подпись живёт на любом фоне. */
[data-vibeui-block="separator-001"][data-with-label="true"]{grid-template-columns:1fr auto 1fr}
[data-vibeui-block="separator-001"] [data-part="line"]{height:1px;background:var(--vibeui-separator-001-line)}
[data-vibeui-block="separator-001"] [data-part="label"]{
font-size:0.75rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-separator-001-muted);
}
/* Вертикальный вариант тянется по высоте соседей, а не задаёт её. */
[data-vibeui-block="separator-001"][data-orientation="vertical"]{
display:block;width:1px;min-height:1.5rem;height:100%;
background:var(--vibeui-separator-001-line);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="separator-001"] *{animation:none!important;transition:none!important}}
`

/**
 * Разделитель с подписью посередине и вертикальный вариант.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Separator001({
  label = "или",
  orientation = "horizontal",
  line = "",
  className,
  style,
  ...props
}: Separator001Props) {
  const vertical = orientation === "vertical"
  const palette = {
    ...(line ? { "--vibeui-separator-001-line": line } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-separator-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="separator-001"
        data-orientation={orientation}
        data-with-label={Boolean(label) && !vertical}
        role="separator"
        aria-orientation={orientation}
        aria-label={label && !vertical ? label : undefined}
        className={className}
        style={palette}
      >
        {vertical ? null : (
          <>
            <span data-part="line" />
            {label ? <span data-part="label">{label}</span> : null}
            {label ? <span data-part="line" /> : null}
          </>
        )}
      </div>
    </>
  )
}

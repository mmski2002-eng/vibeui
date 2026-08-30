import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Aspect001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  /** Соотношение сторон: «16 / 9», «4 / 3», «1 / 1». */
  ratio?: string
  /** Подпись поверх подложки, пока содержимого нет. */
  label?: string
  children?: ReactNode
}

// Идея компонента: рамка с заданным соотношением сторон, которая держит место
// до загрузки содержимого. Соотношение приходит переменной, а не классом:
// «16 / 9» и «4 / 3» — это данные, а плодить класс на каждую пропорцию значит
// заранее решать за пользователя, какие ему понадобятся.
const STYLES = `
:where([data-vibeui-block="aspect-001"]){
--vibeui-aspect-001-ratio:16 / 9;
--vibeui-aspect-001-bg:oklch(0.955 0.005 265);
--vibeui-aspect-001-fg:oklch(0.5 0.014 265);
--vibeui-aspect-001-border:oklch(0.9 0.006 265);
--vibeui-aspect-001-radius:0.75rem;
--vibeui-aspect-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="aspect-001"]{
position:relative;display:block;width:100%;box-sizing:border-box;overflow:hidden;
aspect-ratio:var(--vibeui-aspect-001-ratio);
border:1px solid var(--vibeui-aspect-001-border);
border-radius:var(--vibeui-aspect-001-radius);
background:var(--vibeui-aspect-001-bg);
font-family:var(--vibeui-aspect-001-font);
}
/* Содержимое обязано заполнять рамку целиком, иначе соотношение бессмысленно. */
[data-vibeui-block="aspect-001"] > img,
[data-vibeui-block="aspect-001"] > video,
[data-vibeui-block="aspect-001"] > iframe{
display:block;width:100%;height:100%;border:0;object-fit:cover;
}
[data-vibeui-block="aspect-001"] [data-part="label"]{
position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
gap:0.5rem;color:var(--vibeui-aspect-001-fg);font-size:0.8125rem;
}
/* Диагональная штриховка: пустая рамка не должна выглядеть сломанной. */
[data-vibeui-block="aspect-001"] [data-part="label"]::before{
content:"";position:absolute;inset:0;pointer-events:none;
background-image:repeating-linear-gradient(135deg,var(--vibeui-aspect-001-border) 0 1px,transparent 1px 10px);
opacity:.5;
}
[data-vibeui-block="aspect-001"] [data-part="label"] span{position:relative;font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="aspect-001"] *{animation:none!important;transition:none!important}}
`

/**
 * Рамка заданного соотношения: держит место до загрузки содержимого.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Aspect001({
  ratio = "16 / 9",
  label = "16 / 9",
  children,
  className,
  style,
  ...props
}: Aspect001Props) {
  const palette = {
    "--vibeui-aspect-001-ratio": ratio,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-aspect-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="aspect-001"
        className={className}
        style={palette}
      >
        {children ?? (
          <span data-part="label" aria-hidden="true">
            <span>{label}</span>
          </span>
        )}
      </div>
    </>
  )
}

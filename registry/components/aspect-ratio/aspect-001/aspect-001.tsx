import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Aspect001Props = Omit<ComponentProps<"div">, "children"> & {
  /** Соотношение сторон: «16 / 9», «4 / 3», «1 / 1». */
  ratio?: string
  /** Подпись поверх подложки, пока содержимого нет. */
  label?: string
  /** Пусто — подложки нет, рамка лежит прямо на фоне страницы. */
  background?: string
  children?: ReactNode
}

// Идея компонента: рамка с заданным соотношением сторон, которая держит место
// до загрузки содержимого. Соотношение приходит переменной, а не классом:
// «16 / 9» и «4 / 3» — это данные, а плодить класс на каждую пропорцию значит
// заранее решать за пользователя, какие ему понадобятся.
//
// Тема берётся из color-scheme окружения через light-dark(): рамка темнеет
// вместе со страницей и не выкладывает под себя плашку.
const STYLES = `
:where([data-vibeui-block="aspect-001"]){
--vibeui-aspect-001-ratio:16 / 9;
--vibeui-aspect-001-bg:transparent;
--vibeui-aspect-001-fg:light-dark(oklch(0.5 0.014 265),oklch(0.72 0.012 265));
--vibeui-aspect-001-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-aspect-001-radius:0.75rem;
--vibeui-aspect-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="aspect-001"]{color-scheme:dark}
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
 * Рамка заданного соотношения: держит место до загрузки содержимого.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Aspect001({
  ratio = "16 / 9",
  label = "16 / 9",
  background = "",
  children,
  className,
  style,
  ...props
}: Aspect001Props) {
  const palette = {
    "--vibeui-aspect-001-ratio": ratio,
    ...(background
      ? {
          "--vibeui-aspect-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-aspect-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="aspect-ratio"
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

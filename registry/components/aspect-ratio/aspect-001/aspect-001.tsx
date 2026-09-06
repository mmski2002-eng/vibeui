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
--vibeui-aspect-001-fg:light-dark(oklch(0.5 0 265),oklch(0.72 0 265));
--vibeui-aspect-001-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-aspect-001-sky:light-dark(oklch(0.9 0.06 245),oklch(0.34 0.05 262));
--vibeui-aspect-001-hill:light-dark(oklch(0.74 0.09 190),oklch(0.44 0.07 195));
--vibeui-aspect-001-sun:light-dark(oklch(0.9 0.12 85),oklch(0.78 0.13 80));
--vibeui-aspect-001-chip:light-dark(oklch(1 0 0 / 0.85),oklch(0.2 0 265 / 0.8));
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
/* Пустая рамка рисует условный снимок, а не штриховку: по миниатюре должно
   быть понятно, что сюда встаёт картинка, и какую долю кадра она займёт. */
[data-vibeui-block="aspect-001"] [data-part="label"]{
position:absolute;inset:0;display:flex;align-items:flex-end;justify-content:center;
padding:0.5rem;color:var(--vibeui-aspect-001-fg);font-size:0.8125rem;
background:linear-gradient(180deg,var(--vibeui-aspect-001-sky),color-mix(in oklab,var(--vibeui-aspect-001-sky) 45%,transparent));
}
[data-vibeui-block="aspect-001"] [data-part="sun"]{
position:absolute;left:22%;top:24%;width:12%;aspect-ratio:1 / 1;
border-radius:9999px;background:var(--vibeui-aspect-001-sun);
}
/* Холмы — треугольники на clip-path: снимок нарисован кадром, без файлов. */
[data-vibeui-block="aspect-001"] [data-part="hill"]{
position:absolute;inset:auto 0 0;height:52%;
background:var(--vibeui-aspect-001-hill);
clip-path:polygon(0 100%,26% 24%,52% 74%,74% 38%,100% 100%);
}
[data-vibeui-block="aspect-001"] [data-part="ratio"]{
position:relative;padding:0.0625rem 0.4375rem;border-radius:0.3125rem;
background:var(--vibeui-aspect-001-chip);
font-variant-numeric:tabular-nums;font-weight:650;
}
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
            <span data-part="sun" />
            <span data-part="hill" />
            <span data-part="ratio">{label}</span>
          </span>
        )}
      </div>
    </>
  )
}

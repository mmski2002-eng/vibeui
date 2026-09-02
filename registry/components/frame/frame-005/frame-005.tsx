import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Frame005Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "title"
> & {
  title?: string
  tone?: "silver" | "graphite"
  /** Пусто — экран прозрачный, сквозь него виден фон страницы. */
  background?: string
  children?: ReactNode
}

// Идея компонента: рамка ноутбука под демо страницы. Основание — не картинка
// и не второй прямоугольник: это трапеция из clip-path, поэтому корпус
// сужается книзу без единого изображения и масштабируется вместе с экраном.
// Экран держит пропорцию 16 / 10 — стандарт ноутбучной матрицы; 16 / 9 даёт
// заметно более плоский силуэт и читается как телевизор.
const STYLES = `
:where([data-vibeui-block="frame-005"]){
--vibeui-frame-005-body:light-dark(oklch(0.9 0.005 265),oklch(0.72 0.006 265));
--vibeui-frame-005-edge:light-dark(oklch(0.76 0.008 265),oklch(0.6 0.009 265));
--vibeui-frame-005-base:light-dark(oklch(0.85 0.006 265),oklch(0.66 0.007 265));
--vibeui-frame-005-screen:transparent;
--vibeui-frame-005-fg:light-dark(oklch(0.23 0.014 265),oklch(0.93 0.005 265));
--vibeui-frame-005-muted:light-dark(oklch(0.56 0.014 265),oklch(0.71 0.012 265));
--vibeui-frame-005-soft:light-dark(oklch(0.96 0.004 265),oklch(0.33 0.008 265));
--vibeui-frame-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="frame-005"]{
display:flex;flex-direction:column;align-items:center;margin:0;
width:100%;max-width:30rem;box-sizing:border-box;
font-family:var(--vibeui-frame-005-font);color:var(--vibeui-frame-005-fg);
}
[data-vibeui-block="frame-005"] *{box-sizing:border-box}
[data-vibeui-block="frame-005"][data-tone="graphite"]{
--vibeui-frame-005-body:oklch(0.42 0.012 265);
--vibeui-frame-005-edge:oklch(0.55 0.012 265);
--vibeui-frame-005-base:oklch(0.36 0.012 265);
}
[data-vibeui-block="frame-005"] [data-part="lid"]{
width:100%;padding:0.5rem 0.5rem 0.625rem;
background:var(--vibeui-frame-005-body);
border:1px solid var(--vibeui-frame-005-edge);
border-radius:0.875rem 0.875rem 0.375rem 0.375rem;
}
[data-vibeui-block="frame-005"] [data-part="cam"]{
display:block;width:0.25rem;height:0.25rem;margin:0 auto 0.375rem;
border-radius:9999px;background:var(--vibeui-frame-005-edge);
}
[data-vibeui-block="frame-005"] [data-part="screen"]{
overflow:hidden;aspect-ratio:16 / 10;
background:var(--vibeui-frame-005-screen);
border-radius:0.375rem;
}
[data-vibeui-block="frame-005"] [data-part="screen"] > *{display:block;width:100%}
[data-vibeui-block="frame-005"] img{display:block;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="frame-005"] [data-part="stub"]{
display:flex;flex-direction:column;gap:0.5rem;height:100%;padding:0.875rem 1rem;
}
[data-vibeui-block="frame-005"] [data-part="stub-title"]{margin:0;font-size:0.875rem;font-weight:700}
[data-vibeui-block="frame-005"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;flex:1 1 auto;
}
[data-vibeui-block="frame-005"] [data-part="cell"]{border-radius:0.5rem;background:var(--vibeui-frame-005-soft)}
/* Трапеция из clip-path: основание сужается книзу без единой картинки. */
[data-vibeui-block="frame-005"] [data-part="base"]{
width:108%;max-width:none;height:0.75rem;
background:var(--vibeui-frame-005-base);
clip-path:polygon(0 0,100% 0,96% 100%,4% 100%);
}
[data-vibeui-block="frame-005"] [data-part="notch"]{
width:18%;height:0.25rem;margin:0 auto;
border-radius:0 0 9999px 9999px;
background:var(--vibeui-frame-005-edge);
}
[data-vibeui-block="frame-005"] figcaption{
margin-top:0.625rem;font-size:0.75rem;color:var(--vibeui-frame-005-muted);text-align:center;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="frame-005"] *{animation:none!important;transition:none!important}}
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
 * Рамка ноутбука: крышка с экраном 16 / 10 и трапеция основания на clip-path.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Frame005({
  title = "Панель проекта",
  tone = "silver",
  background = "",
  children,
  className,
  style,
  ...props
}: Frame005Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-frame-005-screen": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-frame-005" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="frame-005"
        data-tone={tone}
        className={className}
        style={palette}
      >
        <div data-part="lid">
          <span data-part="cam" aria-hidden="true" />
          <div data-part="screen">
            {children ?? (
              <div data-part="stub">
                <p data-part="stub-title">{title}</p>
                <div data-part="grid" aria-hidden="true">
                  <span data-part="cell" />
                  <span data-part="cell" />
                  <span data-part="cell" />
                  <span data-part="cell" />
                  <span data-part="cell" />
                  <span data-part="cell" />
                </div>
              </div>
            )}
          </div>
        </div>
        <div data-part="base" aria-hidden="true">
          <span data-part="notch" />
        </div>
      </figure>
    </>
  )
}

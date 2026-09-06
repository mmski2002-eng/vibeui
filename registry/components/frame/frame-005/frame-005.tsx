import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Frame005Props = Omit<ComponentProps<"figure">, "title"> & {
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
--vibeui-frame-005-body:light-dark(oklch(0.9 0 265),oklch(0.72 0 265));
--vibeui-frame-005-edge:light-dark(oklch(0.76 0 265),oklch(0.6 0 265));
--vibeui-frame-005-base:light-dark(oklch(0.85 0 265),oklch(0.66 0 265));
--vibeui-frame-005-screen:transparent;
--vibeui-frame-005-fg:light-dark(oklch(0.23 0 265),oklch(0.93 0 265));
--vibeui-frame-005-muted:color-mix(in oklab,var(--vibeui-frame-005-fg) 68%,transparent);
--vibeui-frame-005-soft:light-dark(oklch(0.96 0 265),oklch(0.33 0 265));
--vibeui-frame-005-accent:light-dark(oklch(0.55 0.16 262),oklch(0.72 0.15 262));
--vibeui-frame-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="frame-005"]{color-scheme:dark}
[data-vibeui-block="frame-005"]{
display:flex;flex-direction:column;align-items:center;margin:0;
width:100%;max-width:30rem;box-sizing:border-box;
font-family:var(--vibeui-frame-005-font);color:var(--vibeui-frame-005-fg);
}
[data-vibeui-block="frame-005"] *{box-sizing:border-box}
[data-vibeui-block="frame-005"][data-tone="graphite"]{
--vibeui-frame-005-body:oklch(0.42 0 265);
--vibeui-frame-005-edge:oklch(0.55 0 265);
--vibeui-frame-005-base:oklch(0.36 0 265);
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
/* Пустой экран рисует условную панель: три показателя и столбиковый график.
   Шесть серых ячеек читались бы как незагрузившийся скриншот. */
[data-vibeui-block="frame-005"] [data-part="screen"] [data-part="stub"]{
display:flex;flex-direction:column;gap:0.5rem;height:100%;padding:0.875rem 1rem;
}
[data-vibeui-block="frame-005"] [data-part="stub-title"]{margin:0;font-size:0.875rem;font-weight:700}
[data-vibeui-block="frame-005"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;flex:none;
}
[data-vibeui-block="frame-005"] [data-part="cell"]{
display:flex;flex-direction:column;gap:0.3125rem;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
background:var(--vibeui-frame-005-soft);
border-left:2px solid var(--vibeui-frame-005-accent);
}
[data-vibeui-block="frame-005"] [data-part="cell"] span{
display:block;height:0.5rem;width:55%;border-radius:9999px;
background:var(--vibeui-frame-005-accent);
}
[data-vibeui-block="frame-005"] [data-part="cell"] i{
display:block;height:0.3125rem;width:80%;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-frame-005-fg) 20%,transparent);
}
[data-vibeui-block="frame-005"] [data-part="cell"]:nth-child(2){--vibeui-frame-005-accent:light-dark(oklch(0.6 0.15 160),oklch(0.74 0.14 160))}
[data-vibeui-block="frame-005"] [data-part="cell"]:nth-child(3){--vibeui-frame-005-accent:light-dark(oklch(0.68 0.15 60),oklch(0.8 0.13 60))}
/* График столбиками: высота задана в CSS, поэтому график не требует данных. */
[data-vibeui-block="frame-005"] [data-part="chart"]{
display:flex;align-items:flex-end;gap:0.375rem;
flex:1 1 auto;min-height:3rem;padding:0.5rem;border-radius:0.5rem;
background:var(--vibeui-frame-005-soft);
}
[data-vibeui-block="frame-005"] [data-part="chart"] i{
display:block;flex:1 1 0;border-radius:0.1875rem 0.1875rem 0 0;
background:color-mix(in oklab,var(--vibeui-frame-005-accent) 45%,transparent);
}
[data-vibeui-block="frame-005"] [data-part="chart"] i:nth-child(1){height:38%}
[data-vibeui-block="frame-005"] [data-part="chart"] i:nth-child(2){height:62%}
[data-vibeui-block="frame-005"] [data-part="chart"] i:nth-child(3){height:48%}
[data-vibeui-block="frame-005"] [data-part="chart"] i:nth-child(4){height:82%}
[data-vibeui-block="frame-005"] [data-part="chart"] i:nth-child(5){height:70%}
[data-vibeui-block="frame-005"] [data-part="chart"] i:nth-child(6){height:100%;background:var(--vibeui-frame-005-accent)}
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
        data-slot="frame"
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
                  {[0, 1, 2].map((cell) => (
                    <span data-part="cell" key={cell}>
                      <span />
                      <i />
                    </span>
                  ))}
                </div>
                <div data-part="chart" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
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

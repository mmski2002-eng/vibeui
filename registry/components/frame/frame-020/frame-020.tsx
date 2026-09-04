import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Frame020Props = Omit<ComponentProps<"figure">, "title"> & {
  caption?: string
  tone?: "silver" | "graphite"
  /** Надпись пустого экрана: компонент несёт русскую. */
  stubText?: string
  /** Пусто — экран прозрачный, сквозь него виден фон страницы. */
  background?: string
  children?: ReactNode
}

// Идея компонента: рамка настольного монитора под скриншот интерфейса. От
// рамки ноутбука её отличает состав: экран отделён от опоры шеей и ножкой,
// клавиатуры нет — так десктопные приложения и лендинги показывают в
// hero-секциях, где сцена не подразумевает клавиатуру в кадре. Экран держит
// пропорцию 16 / 9 — стандарт настольной матрицы, а не 16 / 10 у ноутбука.
const STYLES = `
:where([data-vibeui-block="frame-020"]){
--vibeui-frame-020-body:light-dark(oklch(0.9 0.005 265),oklch(0.72 0.006 265));
--vibeui-frame-020-edge:light-dark(oklch(0.76 0.008 265),oklch(0.6 0.009 265));
--vibeui-frame-020-stand:light-dark(oklch(0.83 0.006 265),oklch(0.64 0.007 265));
--vibeui-frame-020-screen:transparent;
--vibeui-frame-020-fg:light-dark(oklch(0.23 0.014 265),oklch(0.93 0.005 265));
--vibeui-frame-020-muted:color-mix(in oklab,var(--vibeui-frame-020-fg) 68%,transparent);
--vibeui-frame-020-soft:light-dark(oklch(0.96 0.004 265),oklch(0.33 0.008 265));
--vibeui-frame-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="frame-020"]{color-scheme:dark}
[data-vibeui-block="frame-020"]{
display:flex;flex-direction:column;align-items:center;margin:0;
width:100%;min-width:min(100%,14rem);max-width:32rem;box-sizing:border-box;
font-family:var(--vibeui-frame-020-font);color:var(--vibeui-frame-020-fg);
}
[data-vibeui-block="frame-020"] *{box-sizing:border-box}
[data-vibeui-block="frame-020"][data-tone="graphite"]{
--vibeui-frame-020-body:oklch(0.42 0.012 265);
--vibeui-frame-020-edge:oklch(0.55 0.012 265);
--vibeui-frame-020-stand:oklch(0.36 0.012 265);
}
[data-vibeui-block="frame-020"] [data-part="bezel"]{
position:relative;width:100%;padding:0.5rem;
background:var(--vibeui-frame-020-body);
border:1px solid var(--vibeui-frame-020-edge);
border-radius:0.75rem;
}
[data-vibeui-block="frame-020"] [data-part="cam"]{
position:absolute;top:0.25rem;left:50%;
width:0.25rem;height:0.25rem;border-radius:9999px;
background:var(--vibeui-frame-020-edge);
transform:translateX(-50%);
}
[data-vibeui-block="frame-020"] [data-part="screen"]{
overflow:hidden;aspect-ratio:16 / 9;
background:var(--vibeui-frame-020-screen);
border-radius:0.375rem;
}
[data-vibeui-block="frame-020"] [data-part="screen"] > *{display:block;width:100%}
[data-vibeui-block="frame-020"] img{display:block;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="frame-020"] [data-part="stub"]{
display:grid;place-items:center;height:100%;padding:1rem;text-align:center;
font-size:0.8125rem;color:var(--vibeui-frame-020-muted);background:var(--vibeui-frame-020-soft);
}
/* Шея и ножка, а не клавиатура: монитор — отдельно стоящий экран. */
[data-vibeui-block="frame-020"] [data-part="stand"]{
display:flex;flex-direction:column;align-items:center;
}
[data-vibeui-block="frame-020"] [data-part="neck"]{
width:12%;height:1rem;background:var(--vibeui-frame-020-stand);
}
[data-vibeui-block="frame-020"] [data-part="foot"]{
width:34%;height:0.5rem;margin-top:-0.0625rem;
background:var(--vibeui-frame-020-stand);
border-radius:9999px;
}
[data-vibeui-block="frame-020"] figcaption{
margin-top:0.625rem;font-size:0.75rem;color:var(--vibeui-frame-020-muted);text-align:center;
}
@container (max-width: 22rem){
[data-vibeui-block="frame-020"] [data-part="bezel"]{padding:0.375rem;border-radius:0.625rem}
[data-vibeui-block="frame-020"] [data-part="neck"]{height:0.75rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="frame-020"] *{animation:none!important;transition:none!important}}
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
 * Рамка настольного монитора: экран 16 / 9 на шее и ножке, без клавиатуры.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Frame020({
  caption = "Приложение на экране настольного монитора",
  tone = "silver",
  stubText = "Экран монитора",
  background = "",
  children,
  className,
  style,
  ...props
}: Frame020Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-frame-020-screen": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-frame-020" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="frame"
        data-vibeui-block="frame-020"
        data-tone={tone}
        className={className}
        style={palette}
      >
        <div data-part="bezel">
          <span data-part="cam" aria-hidden="true" />
          <div data-part="screen">
            {children ?? <div data-part="stub">{stubText}</div>}
          </div>
        </div>
        <div data-part="stand" aria-hidden="true">
          <span data-part="neck" />
          <span data-part="foot" />
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </>
  )
}

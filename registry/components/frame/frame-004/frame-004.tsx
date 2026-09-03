import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Frame004Props = ComponentProps<"figure"> & {
  time?: string
  carrier?: string
  /** Заголовок заглушки экрана: компонент несёт русский, проект подставляет свой. */
  stubTitle?: string
  /** Пусто — экран прозрачный, сквозь него виден фон страницы. */
  background?: string
  children?: ReactNode
}

// Идея компонента: рамка телефона под скриншот. Экран задан пропорцией
// 9 / 19.5, а не высотой в пикселях: скриншот любого размера ложится в него
// без обрезки и без чёрных полей. Корпус светлый с тонкой обводкой — тёмный
// корпус на тёмной подложке каталога сливается, и от телефона остаётся
// плавающий белый прямоугольник.
const STYLES = `
:where([data-vibeui-block="frame-004"]){
--vibeui-frame-004-body:light-dark(oklch(0.93 0.005 265),oklch(0.31 0.008 265));
--vibeui-frame-004-edge:light-dark(oklch(0.78 0.008 265),oklch(0.46 0.01 265));
--vibeui-frame-004-screen:transparent;
--vibeui-frame-004-fg:light-dark(oklch(0.22 0.014 265),oklch(0.93 0.005 265));
--vibeui-frame-004-muted:color-mix(in oklab,var(--vibeui-frame-004-fg) 68%,transparent);
--vibeui-frame-004-island:light-dark(oklch(0.2 0.014 265),oklch(0.08 0.006 265));
--vibeui-frame-004-card:light-dark(oklch(0.96 0.004 265),oklch(0.36 0.008 265));
--vibeui-frame-004-width:15rem;
--vibeui-frame-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="frame-004"]{color-scheme:dark}
[data-vibeui-block="frame-004"]{
display:flex;justify-content:center;margin:0;width:100%;box-sizing:border-box;
font-family:var(--vibeui-frame-004-font);color:var(--vibeui-frame-004-fg);
}
[data-vibeui-block="frame-004"] *{box-sizing:border-box}
[data-vibeui-block="frame-004"] [data-part="shell"]{
position:relative;
width:min(100%,var(--vibeui-frame-004-width));
padding:0.5rem;
background:var(--vibeui-frame-004-body);
border:1px solid var(--vibeui-frame-004-edge);
border-radius:2rem;
}
/* Пропорция вместо высоты: скриншот ложится без обрезки на любой ширине. */
[data-vibeui-block="frame-004"] [data-part="screen"]{
position:relative;overflow:hidden;
display:flex;flex-direction:column;
aspect-ratio:9 / 19.5;
background:var(--vibeui-frame-004-screen);
border:1px solid var(--vibeui-frame-004-edge);
border-radius:1.625rem;
}
[data-vibeui-block="frame-004"] [data-part="status"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
flex:none;padding:0.5rem 0.875rem 0.25rem;
font-size:0.625rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="frame-004"] [data-part="meters"]{display:inline-flex;align-items:center;gap:0.25rem}
[data-vibeui-block="frame-004"] [data-part="signal"]{display:inline-flex;align-items:flex-end;gap:0.0625rem}
[data-vibeui-block="frame-004"] [data-part="signal"] i{
display:block;width:0.125rem;border-radius:0.0625rem;background:currentColor;
}
[data-vibeui-block="frame-004"] [data-part="signal"] i:nth-child(1){height:0.1875rem}
[data-vibeui-block="frame-004"] [data-part="signal"] i:nth-child(2){height:0.3125rem}
[data-vibeui-block="frame-004"] [data-part="signal"] i:nth-child(3){height:0.4375rem}
[data-vibeui-block="frame-004"] [data-part="battery"]{
display:inline-block;width:1rem;height:0.5rem;
border:1px solid currentColor;border-radius:0.125rem;
background:linear-gradient(90deg,currentColor 62%,transparent 62%);
background-clip:content-box;padding:1px;
}
/* Островок висит поверх экрана: в потоке он сдвигал бы статус-строку вниз. */
[data-vibeui-block="frame-004"] [data-part="island"]{
position:absolute;top:0.375rem;left:50%;transform:translateX(-50%);
width:4rem;height:1.125rem;border-radius:9999px;
background:var(--vibeui-frame-004-island);
}
[data-vibeui-block="frame-004"] [data-part="body"]{flex:1 1 auto;min-height:0;overflow:hidden}
[data-vibeui-block="frame-004"] [data-part="body"] > *{display:block;width:100%}
[data-vibeui-block="frame-004"] img{display:block;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="frame-004"] [data-part="stub"]{
display:flex;flex-direction:column;gap:0.5rem;
height:100%;padding:1rem 0.875rem;
}
[data-vibeui-block="frame-004"] [data-part="stub-title"]{font-size:0.875rem;font-weight:700;margin:0 0 0.25rem}
[data-vibeui-block="frame-004"] [data-part="card"]{
height:2.75rem;border-radius:0.625rem;
background:var(--vibeui-frame-004-card);
}
[data-vibeui-block="frame-004"] [data-part="card"]:nth-child(3){height:4.5rem}
[data-vibeui-block="frame-004"] [data-part="home"]{
flex:none;width:35%;height:0.25rem;margin:0.375rem auto 0.5rem;
border-radius:9999px;background:var(--vibeui-frame-004-edge);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="frame-004"] *{animation:none!important;transition:none!important}}
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
 * Рамка телефона под скриншот: пропорция экрана, статус-строка, островок.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Frame004({
  time = "9:41",
  carrier = "VibeUI",
  stubTitle = "Сегодня",
  background = "",
  children,
  className,
  style,
  ...props
}: Frame004Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-frame-004-screen": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-frame-004" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="frame"
        data-vibeui-block="frame-004"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="screen">
            <span data-part="island" aria-hidden="true" />
            <div data-part="status" aria-hidden="true">
              <span>{time}</span>
              <span>{carrier}</span>
              <span data-part="meters">
                <span data-part="signal">
                  <i />
                  <i />
                  <i />
                </span>
                <span data-part="battery" />
              </span>
            </div>
            <div data-part="body">
              {children ?? (
                <div data-part="stub">
                  <p data-part="stub-title">{stubTitle}</p>
                  <span data-part="card" />
                  <span data-part="card" />
                  <span data-part="card" />
                </div>
              )}
            </div>
            <span data-part="home" aria-hidden="true" />
          </div>
        </div>
      </figure>
    </>
  )
}

import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Frame008Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "title"
> & {
  caption?: string
  /** Надпись пустого экрана: компонент несёт русскую. */
  stubText?: string
  /** Пусто — экран прозрачный, сквозь него виден фон страницы. */
  background?: string
  children?: ReactNode
}

// Идея компонента: планшет в альбомной ориентации под скриншот интерфейса,
// который на телефонном кадре читался бы обрезанным. Экран держит
// пропорцию 4 / 3 (стандарт планшетной матрицы), а не фиксированную высоту:
// иначе скриншот другого размера обрежется или получит поля. Камера — точка
// на длинной грани корпуса: в альбомной ориентации она уезжает с верхнего
// края на боковой, а не остаётся сверху, как у портретного макета.
const STYLES = `
:where([data-vibeui-block="frame-008"]){
--vibeui-frame-008-body:light-dark(oklch(0.93 0.004 265),oklch(0.31 0.007 265));
--vibeui-frame-008-bezel:light-dark(oklch(0.86 0.006 265),oklch(0.45 0.01 265));
--vibeui-frame-008-screen:transparent;
--vibeui-frame-008-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.005 265));
--vibeui-frame-008-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-frame-008-camera:light-dark(oklch(0.4 0.01 265),oklch(0.16 0.008 265));
--vibeui-frame-008-radius:1.5rem;
--vibeui-frame-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="frame-008"]{
display:flex;flex-direction:column;align-items:center;margin:0;
width:100%;box-sizing:border-box;
font-family:var(--vibeui-frame-008-font);color:var(--vibeui-frame-008-fg);
}
[data-vibeui-block="frame-008"] *{box-sizing:border-box}
[data-vibeui-block="frame-008"] [data-part="body"]{
position:relative;width:min(100%,34rem);
padding:0.75rem 0.9375rem;
background:var(--vibeui-frame-008-body);
border:1px solid var(--vibeui-frame-008-bezel);
border-radius:var(--vibeui-frame-008-radius);
}
[data-vibeui-block="frame-008"] [data-part="screen"]{
position:relative;overflow:hidden;
aspect-ratio:4 / 3;width:100%;
background:var(--vibeui-frame-008-screen);
border-radius:0.625rem;
}
[data-vibeui-block="frame-008"] [data-part="screen"] > *{display:block;width:100%;height:100%}
[data-vibeui-block="frame-008"] img{display:block;width:100%;height:100%;object-fit:cover}
/* Камера на боковой грани: в альбомной ориентации она уходит с верхнего края. */
[data-vibeui-block="frame-008"] [data-part="camera"]{
position:absolute;top:50%;left:0.3125rem;
width:0.3125rem;height:0.3125rem;border-radius:9999px;
background:var(--vibeui-frame-008-camera);
transform:translateY(-50%);
}
[data-vibeui-block="frame-008"] [data-part="home"]{
position:absolute;left:50%;bottom:0.625rem;
width:4rem;height:0.25rem;border-radius:9999px;
background:var(--vibeui-frame-008-muted);opacity:0.35;
transform:translateX(-50%);
}
[data-vibeui-block="frame-008"] [data-part="stub"]{
display:grid;place-items:center;gap:0.5rem;
width:100%;height:100%;padding:1.25rem;text-align:center;
font-size:0.8125rem;color:var(--vibeui-frame-008-muted);
}
[data-vibeui-block="frame-008"] figcaption{
margin-top:0.625rem;font-size:0.75rem;line-height:1.4;
color:var(--vibeui-frame-008-muted);text-align:center;
}
@container (max-width: 22rem){
[data-vibeui-block="frame-008"] [data-part="body"]{padding:0.5rem 0.625rem;border-radius:1rem}
[data-vibeui-block="frame-008"] [data-part="home"]{width:2.75rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="frame-008"] *{animation:none!important;transition:none!important}}
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
 * Планшет в альбомной ориентации: экран 4 / 3, камера на боковой грани,
 * слот под скриншот интерфейса. Один файл, ноль зависимостей.
 */
export function Frame008({
  caption = "Интерфейс на планшете в альбомной ориентации",
  stubText = "Экран планшета",
  background = "",
  children,
  className,
  style,
  ...props
}: Frame008Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-frame-008-screen": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-frame-008" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="frame-008"
        className={className}
        style={palette}
      >
        <div data-part="body">
          <span data-part="camera" aria-hidden="true" />
          <div data-part="screen">
            {children ?? <div data-part="stub">{stubText}</div>}
            <span data-part="home" aria-hidden="true" />
          </div>
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </>
  )
}

import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Frame002Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "title"
> & {
  ratio?: "16:9" | "4:3" | "1:1" | "21:9"
  title?: string
  caption?: string
  /** Пусто — подложки нет, рамка ложится на фон страницы. */
  background?: string
  children?: ReactNode
}

// Идея компонента: рамка встраивания держит пропорцию до загрузки контента.
// Место под ролик резервируется соотношением сторон на самой рамке, поэтому
// страница не прыгает, когда iframe наконец приходит. Вложенный iframe
// растягивается абсолютом: без этого он оставляет свои дефолтные 150px
// высоты и пропорция рамки перестаёт что-либо значить.
const STYLES = `
:where([data-vibeui-block="frame-002"]){
--vibeui-frame-002-ratio:16 / 9;
--vibeui-frame-002-bg:transparent;
--vibeui-frame-002-screen:oklch(0.22 0.02 265);
--vibeui-frame-002-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.005 265));
--vibeui-frame-002-muted:light-dark(oklch(0.56 0.014 265),oklch(0.71 0.012 265));
--vibeui-frame-002-border:light-dark(oklch(0.9 0.006 265),oklch(0.38 0.011 265));
--vibeui-frame-002-light:oklch(0.98 0.002 265);
--vibeui-frame-002-radius:0.75rem;
--vibeui-frame-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="frame-002"]{
display:flex;flex-direction:column;gap:0.625rem;margin:0;
width:100%;max-width:32rem;box-sizing:border-box;padding:0.625rem;
background:var(--vibeui-frame-002-bg);
border:1px solid var(--vibeui-frame-002-border);
border-radius:calc(var(--vibeui-frame-002-radius) + 0.25rem);
font-family:var(--vibeui-frame-002-font);color:var(--vibeui-frame-002-fg);
}
[data-vibeui-block="frame-002"] *{box-sizing:border-box}
/* Соотношение сторон живёт на рамке: место под ролик занято до загрузки. */
[data-vibeui-block="frame-002"] [data-part="shell"]{
position:relative;overflow:hidden;
aspect-ratio:var(--vibeui-frame-002-ratio);
border-radius:var(--vibeui-frame-002-radius);
background:var(--vibeui-frame-002-screen);
}
/* Встраиваемый узел растягивается абсолютом: iframe иначе держит свои 150px. */
[data-vibeui-block="frame-002"] [data-part="shell"] > :where(iframe,img,video){
position:absolute;inset:0;display:block;width:100%;height:100%;border:0;
object-fit:cover;
}
[data-vibeui-block="frame-002"] [data-part="stub"]{
position:absolute;inset:0;
display:grid;place-content:center;justify-items:center;gap:0.625rem;
padding:1rem;text-align:center;color:var(--vibeui-frame-002-light);
}
[data-vibeui-block="frame-002"] [data-part="play"]{
display:grid;place-items:center;
width:3rem;height:3rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-frame-002-light) 16%,transparent);
border:1px solid color-mix(in oklab,var(--vibeui-frame-002-light) 40%,transparent);
}
[data-vibeui-block="frame-002"] [data-part="play"]::before{
content:"";width:0;height:0;margin-left:0.2rem;
border-left:0.75rem solid var(--vibeui-frame-002-light);
border-top:0.5rem solid transparent;border-bottom:0.5rem solid transparent;
}
[data-vibeui-block="frame-002"] [data-part="stub-title"]{font-size:0.8125rem;opacity:.85}
[data-vibeui-block="frame-002"] [data-part="badge"]{
position:absolute;right:0.5rem;bottom:0.5rem;
padding:0.125rem 0.375rem;border-radius:0.375rem;
background:color-mix(in oklab,var(--vibeui-frame-002-screen) 65%,transparent);
color:var(--vibeui-frame-002-light);
font-size:0.6875rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="frame-002"] figcaption{
font-size:0.75rem;line-height:1.4;color:var(--vibeui-frame-002-muted);
}
[data-vibeui-block="frame-002"][data-ratio="4:3"]{--vibeui-frame-002-ratio:4 / 3}
[data-vibeui-block="frame-002"][data-ratio="1:1"]{--vibeui-frame-002-ratio:1 / 1}
[data-vibeui-block="frame-002"][data-ratio="21:9"]{--vibeui-frame-002-ratio:21 / 9}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="frame-002"] *{animation:none!important;transition:none!important}}
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
 * Рамка встраивания с фиксированным соотношением сторон.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Frame002({
  ratio = "16:9",
  title = "Обзор каталога VibeUI",
  caption = "Ролик подгружается — место под него уже занято",
  background = "",
  children,
  className,
  style,
  ...props
}: Frame002Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-frame-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-frame-002" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="frame-002"
        data-ratio={ratio}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          {children ?? (
            <div data-part="stub">
              <span data-part="play" aria-hidden="true" />
              <span data-part="stub-title">{title}</span>
            </div>
          )}
          <span data-part="badge">{ratio}</span>
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </>
  )
}

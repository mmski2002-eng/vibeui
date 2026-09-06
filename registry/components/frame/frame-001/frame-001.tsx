import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Frame001Props = Omit<ComponentProps<"figure">, "title"> & {
  variant?: "browser" | "phone" | "plain"
  title?: string
  url?: string
  caption?: string
  /** Пусто — экран прозрачный, сквозь рамку виден фон страницы. */
  background?: string
  children?: ReactNode
}

// Идея компонента: обрамление для скриншота или демо. Рамка браузера нужна,
// чтобы читатель понял: внутри — страница, а не картинка на сайте. Полоса
// адреса не имитирует настоящий браузер до кнопок и вкладок: чем подробнее
// подделка, тем сильнее она спорит с интерфейсом вокруг. Содержимое лежит в
// слоте, поэтому внутрь встаёт что угодно — картинка, iframe или другой блок.
const STYLES = `
:where([data-vibeui-block="frame-001"]){
--vibeui-frame-001-bg:transparent;
--vibeui-frame-001-chrome:light-dark(oklch(0.97 0 265),oklch(0.27 0 265));
--vibeui-frame-001-pill:light-dark(oklch(1 0 0),oklch(0.34 0 265));
--vibeui-frame-001-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-frame-001-muted:color-mix(in oklab,var(--vibeui-frame-001-fg) 68%,transparent);
--vibeui-frame-001-border:light-dark(oklch(0.9 0 265),oklch(0.38 0 265));
--vibeui-frame-001-line:light-dark(oklch(0.91 0 265),oklch(0.4 0 265));
--vibeui-frame-001-tile:light-dark(oklch(0.965 0 265),oklch(0.31 0 265));
--vibeui-frame-001-accent:light-dark(oklch(0.55 0.16 262),oklch(0.72 0.15 262));
--vibeui-frame-001-radius:0.875rem;
--vibeui-frame-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="frame-001"]{color-scheme:dark}
[data-vibeui-block="frame-001"]{
display:flex;flex-direction:column;margin:0;
width:100%;box-sizing:border-box;
font-family:var(--vibeui-frame-001-font);color:var(--vibeui-frame-001-fg);
}
[data-vibeui-block="frame-001"] *{box-sizing:border-box}
[data-vibeui-block="frame-001"] [data-part="shell"]{
overflow:hidden;background:var(--vibeui-frame-001-bg);
border:1px solid var(--vibeui-frame-001-border);
border-radius:var(--vibeui-frame-001-radius);
}
/* Полоса браузера намеренно условная: точная подделка спорит с интерфейсом. */
[data-vibeui-block="frame-001"] [data-part="chrome"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.4375rem 0.625rem;
background:var(--vibeui-frame-001-chrome);
border-bottom:1px solid var(--vibeui-frame-001-border);
}
[data-vibeui-block="frame-001"] [data-part="dots"]{display:flex;gap:0.25rem;flex:none}
[data-vibeui-block="frame-001"] [data-part="dot"]{
width:0.5rem;height:0.5rem;border-radius:9999px;
background:var(--vibeui-frame-001-border);
}
[data-vibeui-block="frame-001"] [data-part="url"]{
flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
padding:0.125rem 0.5rem;border-radius:0.375rem;
background:var(--vibeui-frame-001-pill);
font-size:0.6875rem;color:var(--vibeui-frame-001-muted);
}
[data-vibeui-block="frame-001"] [data-part="body"]{display:block;background:var(--vibeui-frame-001-bg)}
[data-vibeui-block="frame-001"] [data-part="body"] > *{display:block;width:100%}
[data-vibeui-block="frame-001"] img{display:block;width:100%;height:auto}
/* Телефон: скругление крупнее, а ширина ограничена — иначе это не телефон. */
[data-vibeui-block="frame-001"][data-variant="phone"]{align-items:center}
[data-vibeui-block="frame-001"][data-variant="phone"] [data-part="shell"]{
--vibeui-frame-001-radius:1.75rem;
width:min(100%,17rem);padding:0.5rem;
border-width:2px;
}
[data-vibeui-block="frame-001"][data-variant="phone"] [data-part="body"]{
border-radius:1.25rem;overflow:hidden;
border:1px solid var(--vibeui-frame-001-border);
}
[data-vibeui-block="frame-001"][data-variant="phone"] [data-part="notch"]{
width:4.5rem;height:0.3125rem;margin:0 auto 0.5rem;
border-radius:9999px;background:var(--vibeui-frame-001-border);
}
[data-vibeui-block="frame-001"] figcaption{
margin-top:0.5rem;font-size:0.75rem;line-height:1.4;
color:var(--vibeui-frame-001-muted);text-align:center;
}
/* Пустой слот рисует условный экран страницы, а не серый прямоугольник:
   по одной миниатюре должно быть понятно, что рамка обрамляет интерфейс. */
[data-vibeui-block="frame-001"] [data-part="body"] [data-part="slot"]{
display:flex;flex-direction:column;gap:0.625rem;min-height:9rem;padding:0.75rem;
}
[data-vibeui-block="frame-001"] [data-part="slot-bar"]{
display:flex;align-items:center;gap:0.5rem;
padding-bottom:0.5rem;border-bottom:1px solid var(--vibeui-frame-001-line);
}
[data-vibeui-block="frame-001"] [data-part="slot-logo"]{
flex:none;width:1rem;height:1rem;border-radius:0.3125rem;
background:var(--vibeui-frame-001-accent);
}
[data-vibeui-block="frame-001"] [data-part="slot-nav"]{display:flex;gap:0.375rem;flex:1 1 auto}
[data-vibeui-block="frame-001"] [data-part="slot-nav"] i{
display:block;width:2rem;height:0.375rem;border-radius:9999px;
background:var(--vibeui-frame-001-line);
}
[data-vibeui-block="frame-001"] [data-part="slot-cta"]{
flex:none;width:2.75rem;height:1rem;border-radius:0.375rem;
background:var(--vibeui-frame-001-accent);
}
[data-vibeui-block="frame-001"] [data-part="slot-hero"]{display:flex;flex-direction:column;gap:0.375rem}
[data-vibeui-block="frame-001"] [data-part="slot-title"]{
margin:0;font-size:0.875rem;font-weight:700;line-height:1.25;
}
[data-vibeui-block="frame-001"] [data-part="slot-line"]{
display:block;height:0.4375rem;border-radius:9999px;
background:var(--vibeui-frame-001-line);
}
[data-vibeui-block="frame-001"] [data-part="slot-line"]:last-of-type{width:62%}
[data-vibeui-block="frame-001"] [data-part="slot-tiles"]{
display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;
}
/* Цвет плитки задан переопределением локального акцента: три оттенка без
   трёх новых переменных. */
[data-vibeui-block="frame-001"] [data-part="slot-tile"]{
height:2.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-frame-001-line);
background:linear-gradient(180deg,color-mix(in oklab,var(--vibeui-frame-001-accent) 30%,transparent) 0 0.375rem,var(--vibeui-frame-001-tile) 0.375rem);
}
[data-vibeui-block="frame-001"] [data-part="slot-tile"]:nth-child(2){--vibeui-frame-001-accent:light-dark(oklch(0.6 0.15 160),oklch(0.75 0.14 160))}
[data-vibeui-block="frame-001"] [data-part="slot-tile"]:nth-child(3){--vibeui-frame-001-accent:light-dark(oklch(0.68 0.15 60),oklch(0.8 0.13 60))}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="frame-001"] *{animation:none!important;transition:none!important}}
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
 * Обрамление демо: браузер, телефон или чистая рамка вокруг слота.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Frame001({
  variant = "browser",
  title = "Каталог VibeUI",
  url = "vibeui.ru/components",
  caption = "Каталог компонентов в браузере",
  background = "",
  children,
  className,
  style,
  ...props
}: Frame001Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-frame-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-frame-001" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="frame"
        data-vibeui-block="frame-001"
        data-variant={variant}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          {variant === "browser" ? (
            <div data-part="chrome">
              <span data-part="dots" aria-hidden="true">
                <span data-part="dot" />
                <span data-part="dot" />
                <span data-part="dot" />
              </span>
              <span data-part="url">{url}</span>
            </div>
          ) : null}
          {variant === "phone" ? (
            <span data-part="notch" aria-hidden="true" />
          ) : null}
          <div data-part="body">
            {children ?? (
              <div data-part="slot">
                <div data-part="slot-bar" aria-hidden="true">
                  <span data-part="slot-logo" />
                  <span data-part="slot-nav">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span data-part="slot-cta" />
                </div>
                <div data-part="slot-hero">
                  <p data-part="slot-title">{title}</p>
                  <span data-part="slot-line" aria-hidden="true" />
                  <span data-part="slot-line" aria-hidden="true" />
                </div>
                <div data-part="slot-tiles" aria-hidden="true">
                  <span data-part="slot-tile" />
                  <span data-part="slot-tile" />
                  <span data-part="slot-tile" />
                </div>
              </div>
            )}
          </div>
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </>
  )
}

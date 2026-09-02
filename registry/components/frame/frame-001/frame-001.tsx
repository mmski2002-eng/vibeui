import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Frame001Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "title"
> & {
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
--vibeui-frame-001-chrome:light-dark(oklch(0.97 0.003 265),oklch(0.27 0.009 265));
--vibeui-frame-001-pill:light-dark(oklch(1 0 0),oklch(0.34 0.009 265));
--vibeui-frame-001-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.005 265));
--vibeui-frame-001-muted:light-dark(oklch(0.56 0.014 265),oklch(0.71 0.012 265));
--vibeui-frame-001-border:light-dark(oklch(0.9 0.006 265),oklch(0.38 0.011 265));
--vibeui-frame-001-radius:0.875rem;
--vibeui-frame-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
[data-vibeui-block="frame-001"] [data-part="slot"]{
display:grid;place-items:center;min-height:9rem;padding:1.25rem;
font-size:0.8125rem;color:var(--vibeui-frame-001-muted);text-align:center;
}
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
            {children ?? <div data-part="slot">{title}</div>}
          </div>
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </>
  )
}

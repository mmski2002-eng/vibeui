import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Frame003Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "title"
> & {
  url?: string
  tab?: string
  /** Пусто — тело окна прозрачно, сквозь рамку виден фон страницы. */
  background?: string
  children?: ReactNode
}

// Идея компонента: окно браузера с вкладкой и адресной строкой. Смысл рамки
// в том, чтобы читатель понял: внутри — страница, а не иллюстрация. Замок
// нарисован CSS, а не эмодзи: эмодзи меняет начертание от системы и портит
// строку. Адрес обрезается многоточием — длинный URL иначе растягивает окно
// и ломает раскладку на телефоне.
const STYLES = `
:where([data-vibeui-block="frame-003"]){
--vibeui-frame-003-bg:transparent;
--vibeui-frame-003-chrome:light-dark(oklch(0.95 0.004 265),oklch(0.24 0.009 265));
--vibeui-frame-003-tab:light-dark(oklch(0.99 0.002 265),oklch(0.3 0.009 265));
--vibeui-frame-003-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.005 265));
--vibeui-frame-003-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-frame-003-border:light-dark(oklch(0.89 0.006 265),oklch(0.38 0.011 265));
--vibeui-frame-003-radius:0.875rem;
--vibeui-frame-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="frame-003"]{
display:block;margin:0;width:100%;max-width:34rem;box-sizing:border-box;
font-family:var(--vibeui-frame-003-font);color:var(--vibeui-frame-003-fg);
}
[data-vibeui-block="frame-003"] *{box-sizing:border-box}
[data-vibeui-block="frame-003"] [data-part="shell"]{
overflow:hidden;
background:var(--vibeui-frame-003-bg);
border:1px solid var(--vibeui-frame-003-border);
border-radius:var(--vibeui-frame-003-radius);
}
[data-vibeui-block="frame-003"] [data-part="tabs"]{
display:flex;align-items:flex-end;gap:0.5rem;
padding:0.4375rem 0.625rem 0;
background:var(--vibeui-frame-003-chrome);
}
[data-vibeui-block="frame-003"] [data-part="dots"]{display:flex;gap:0.25rem;flex:none;padding-bottom:0.4375rem}
[data-vibeui-block="frame-003"] [data-part="dot"]{
width:0.5rem;height:0.5rem;border-radius:9999px;
background:var(--vibeui-frame-003-border);
}
/* Вкладка сидит на строке адреса: скругление только сверху, низ сливается. */
[data-vibeui-block="frame-003"] [data-part="tab"]{
max-width:14rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
padding:0.3125rem 0.625rem;
background:var(--vibeui-frame-003-tab);
border:1px solid var(--vibeui-frame-003-border);border-bottom:0;
border-radius:0.5rem 0.5rem 0 0;
font-size:0.6875rem;color:var(--vibeui-frame-003-fg);
}
[data-vibeui-block="frame-003"] [data-part="bar"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.4375rem 0.625rem;
background:var(--vibeui-frame-003-tab);
border-bottom:1px solid var(--vibeui-frame-003-border);
}
[data-vibeui-block="frame-003"] [data-part="nav"]{
display:flex;gap:0.375rem;flex:none;
font-size:0.75rem;line-height:1;color:var(--vibeui-frame-003-muted);
}
[data-vibeui-block="frame-003"] [data-part="url"]{
display:flex;align-items:center;gap:0.375rem;
flex:1 1 auto;min-width:0;
padding:0.1875rem 0.5rem;border-radius:9999px;
background:var(--vibeui-frame-003-chrome);
font-size:0.6875rem;color:var(--vibeui-frame-003-muted);
}
[data-vibeui-block="frame-003"] [data-part="url"] span{
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
/* Замок нарисован CSS: эмодзи меняет начертание от системы и рвёт строку. */
[data-vibeui-block="frame-003"] [data-part="lock"]{
position:relative;flex:none;
width:0.5rem;height:0.4375rem;margin-top:0.1875rem;
border-radius:0.125rem;background:currentColor;
}
[data-vibeui-block="frame-003"] [data-part="lock"]::before{
content:"";position:absolute;left:50%;bottom:100%;transform:translateX(-50%);
width:0.3125rem;height:0.3125rem;
border:1.5px solid currentColor;border-bottom:0;
border-radius:0.25rem 0.25rem 0 0;
}
[data-vibeui-block="frame-003"] [data-part="body"]{display:block;background:var(--vibeui-frame-003-bg)}
[data-vibeui-block="frame-003"] [data-part="body"] > *{display:block;width:100%}
[data-vibeui-block="frame-003"] img{display:block;width:100%;height:auto}
[data-vibeui-block="frame-003"] [data-part="stub"]{
display:grid;place-items:center;gap:0.5rem;
min-height:9rem;padding:1.5rem;text-align:center;
}
[data-vibeui-block="frame-003"] [data-part="stub-line"]{
width:9rem;height:0.5rem;border-radius:9999px;background:var(--vibeui-frame-003-chrome);
}
[data-vibeui-block="frame-003"] [data-part="stub-line"]:last-child{width:6rem}
[data-vibeui-block="frame-003"] [data-part="stub-text"]{font-size:0.8125rem;color:var(--vibeui-frame-003-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="frame-003"] *{animation:none!important;transition:none!important}}
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
 * Окно браузера с вкладкой и адресной строкой вокруг слота.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Frame003({
  url = "vibeui.ru/components/frame-003",
  tab = "VibeUI — каталог компонентов",
  background = "",
  children,
  className,
  style,
  ...props
}: Frame003Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-frame-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-frame-003" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="frame-003"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="tabs" aria-hidden="true">
            <span data-part="dots">
              <span data-part="dot" />
              <span data-part="dot" />
              <span data-part="dot" />
            </span>
            <span data-part="tab">{tab}</span>
          </div>
          <div data-part="bar">
            <span data-part="nav" aria-hidden="true">
              <span>←</span>
              <span>→</span>
              <span>⟳</span>
            </span>
            <span data-part="url">
              <span data-part="lock" aria-hidden="true" />
              <span>{url}</span>
            </span>
          </div>
          <div data-part="body">
            {children ?? (
              <div data-part="stub">
                <span data-part="stub-text">{tab}</span>
                <span data-part="stub-line" />
                <span data-part="stub-line" />
              </div>
            )}
          </div>
        </div>
      </figure>
    </>
  )
}

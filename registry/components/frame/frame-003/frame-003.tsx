import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Frame003Props = Omit<ComponentProps<"figure">, "title"> & {
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
--vibeui-frame-003-chrome:light-dark(oklch(0.95 0 265),oklch(0.24 0 265));
--vibeui-frame-003-tab:light-dark(oklch(0.99 0 265),oklch(0.3 0 265));
--vibeui-frame-003-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-frame-003-muted:color-mix(in oklab,var(--vibeui-frame-003-fg) 68%,transparent);
--vibeui-frame-003-border:light-dark(oklch(0.89 0 265),oklch(0.38 0 265));
--vibeui-frame-003-accent:light-dark(oklch(0.62 0.15 262),oklch(0.68 0.15 262));
--vibeui-frame-003-hero-fg:oklch(0.99 0 265);
--vibeui-frame-003-radius:0.875rem;
--vibeui-frame-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="frame-003"]{color-scheme:dark}
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
/* Пустое окно рисует условную страницу: обложка, заголовок и ряд карточек.
   Серые полосы посреди белого поля читались бы как ошибка загрузки. */
[data-vibeui-block="frame-003"] [data-part="body"] [data-part="stub"]{
display:flex;flex-direction:column;gap:0.625rem;
min-height:9rem;padding:0.75rem;
}
[data-vibeui-block="frame-003"] [data-part="hero"]{
display:flex;flex-direction:column;justify-content:flex-end;gap:0.375rem;
min-height:3.5rem;padding:0.625rem 0.75rem;border-radius:0.625rem;
background:
radial-gradient(80% 120% at 12% 10%,var(--vibeui-frame-003-accent),transparent 68%),
linear-gradient(120deg,color-mix(in oklab,var(--vibeui-frame-003-accent) 55%,transparent),color-mix(in oklab,var(--vibeui-frame-003-accent) 12%,transparent));
}
[data-vibeui-block="frame-003"] [data-part="stub-text"]{
margin:0;font-size:0.8125rem;font-weight:700;line-height:1.25;
color:var(--vibeui-frame-003-hero-fg);
}
[data-vibeui-block="frame-003"] [data-part="stub-line"]{
display:block;width:9rem;max-width:70%;height:0.375rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-frame-003-hero-fg) 55%,transparent);
}
[data-vibeui-block="frame-003"] [data-part="cards"]{
display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;
}
[data-vibeui-block="frame-003"] [data-part="card"]{
display:flex;flex-direction:column;gap:0.3125rem;
padding:0.5rem;border-radius:0.5rem;
border:1px solid var(--vibeui-frame-003-border);
background:var(--vibeui-frame-003-chrome);
}
[data-vibeui-block="frame-003"] [data-part="card"] i{
display:block;width:1.125rem;height:1.125rem;border-radius:0.3125rem;
background:var(--vibeui-frame-003-accent);
}
[data-vibeui-block="frame-003"] [data-part="card-line"]{
display:block;height:0.3125rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-frame-003-fg) 22%,transparent);
}
[data-vibeui-block="frame-003"] [data-part="card-line"]:last-child{width:60%}
[data-vibeui-block="frame-003"] [data-part="card"]:nth-child(2){--vibeui-frame-003-accent:light-dark(oklch(0.6 0.15 160),oklch(0.75 0.14 160))}
[data-vibeui-block="frame-003"] [data-part="card"]:nth-child(3){--vibeui-frame-003-accent:light-dark(oklch(0.68 0.15 60),oklch(0.8 0.13 60))}
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
        data-slot="frame"
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
                <div data-part="hero">
                  <p data-part="stub-text">{tab}</p>
                  <span data-part="stub-line" aria-hidden="true" />
                </div>
                <div data-part="cards" aria-hidden="true">
                  {[0, 1, 2].map((card) => (
                    <span data-part="card" key={card}>
                      <i />
                      <span data-part="card-line" />
                      <span data-part="card-line" />
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </figure>
    </>
  )
}

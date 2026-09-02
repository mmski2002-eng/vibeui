import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Frame017Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "title"
> & {
  index?: number
  total?: number
  caption?: string
  /** Заголовок пустого слайда: компонент несёт русский. */
  stubTitle?: string
  accent?: string
  /** Пусто — подложки нет, кадр ложится на фон страницы. */
  background?: string
  children?: ReactNode
}

// Идея компонента: кадр слайда презентации — поле 16 / 9 держит пропорцию
// экрана проектора независимо от того, что внутри, а строка снизу считает
// «3 / 12» и рисует точки-индикаторы позиции в колоде. Точки декоративны и
// помечены aria-hidden, порядковый номер объявлен обычным текстом, чтобы
// его слышал скринридер. Подпись — обычный figcaption под слайдом.
const STYLES = `
:where([data-vibeui-block="frame-017"]){
--vibeui-frame-017-bg:transparent;
--vibeui-frame-017-screen:light-dark(oklch(0.99 0.002 95),oklch(0.27 0.008 265));
--vibeui-frame-017-line:light-dark(oklch(0.93 0.004 265),oklch(0.38 0.01 265));
--vibeui-frame-017-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.005 265));
--vibeui-frame-017-muted:light-dark(oklch(0.55 0.014 265),oklch(0.72 0.012 265));
--vibeui-frame-017-border:light-dark(oklch(0.89 0.006 265),oklch(0.4 0.011 265));
--vibeui-frame-017-dot:light-dark(oklch(0.86 0.006 265),oklch(0.45 0.01 265));
--vibeui-frame-017-dot-active:light-dark(oklch(0.55 0.14 260),oklch(0.72 0.14 260));
--vibeui-frame-017-radius:0.875rem;
--vibeui-frame-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="frame-017"]{
display:block;margin:0;width:100%;max-width:32rem;box-sizing:border-box;
font-family:var(--vibeui-frame-017-font);color:var(--vibeui-frame-017-fg);
}
[data-vibeui-block="frame-017"] *{box-sizing:border-box}
[data-vibeui-block="frame-017"] [data-part="shell"]{
overflow:hidden;
background:var(--vibeui-frame-017-bg);
border:1px solid var(--vibeui-frame-017-border);
border-radius:var(--vibeui-frame-017-radius);
}
[data-vibeui-block="frame-017"] [data-part="stage"]{padding:0.625rem}
[data-vibeui-block="frame-017"] [data-part="field"]{
position:relative;overflow:hidden;
aspect-ratio:16 / 9;
background:var(--vibeui-frame-017-screen);
border:1px solid var(--vibeui-frame-017-border);
border-radius:calc(var(--vibeui-frame-017-radius) - 0.375rem);
}
[data-vibeui-block="frame-017"] [data-part="field"] > *{display:block;width:100%;height:100%}
[data-vibeui-block="frame-017"] img{display:block;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="frame-017"] [data-part="stub"]{
display:flex;flex-direction:column;justify-content:center;gap:0.5rem;
height:100%;padding:1.5rem 1.75rem;
}
[data-vibeui-block="frame-017"] [data-part="stub-title"]{margin:0;font-size:1.125rem;font-weight:700}
[data-vibeui-block="frame-017"] [data-part="stub-line"]{height:0.5rem;border-radius:9999px;background:var(--vibeui-frame-017-line)}
[data-vibeui-block="frame-017"] [data-part="stub-line"]:nth-of-type(2){width:78%}
[data-vibeui-block="frame-017"] [data-part="stub-line"]:nth-of-type(3){width:56%}
[data-vibeui-block="frame-017"] [data-part="bar"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.75rem 0.875rem 0.375rem;
}
[data-vibeui-block="frame-017"] [data-part="count"]{
font-size:0.75rem;font-variant-numeric:tabular-nums;color:var(--vibeui-frame-017-muted);
}
[data-vibeui-block="frame-017"] [data-part="dots"]{display:inline-flex;align-items:center;gap:0.3125rem}
[data-vibeui-block="frame-017"] [data-part="dot"]{
width:0.375rem;height:0.375rem;border-radius:9999px;
background:var(--vibeui-frame-017-dot);
}
[data-vibeui-block="frame-017"] [data-part="dot"][data-current="true"]{
width:0.875rem;background:var(--vibeui-frame-017-dot-active);
}
[data-vibeui-block="frame-017"] figcaption{
padding:0.375rem 0.875rem 0.875rem;
font-size:0.75rem;line-height:1.4;color:var(--vibeui-frame-017-muted);
}
@container (max-width: 22rem){
[data-vibeui-block="frame-017"] [data-part="stub"]{padding:1rem 1.125rem}
[data-vibeui-block="frame-017"] [data-part="stub-title"]{font-size:0.9375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="frame-017"] *{animation:none!important;transition:none!important}}
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
 * Кадр слайда презентации: поле 16 / 9, строка с номером и точками
 * позиции в колоде, подпись под слайдом. Один файл, ноль зависимостей.
 */
export function Frame017({
  index = 3,
  total = 12,
  caption = "Кадр слайда презентации: поле 16 / 9 и позиция в колоде",
  stubTitle = "Заголовок слайда",
  accent,
  background = "",
  children,
  className,
  style,
  ...props
}: Frame017Props) {
  const safeTotal = Math.max(1, Math.min(total, 8))
  const current = Math.max(1, Math.min(index, safeTotal))
  const palette = {
    ...(accent ? { "--vibeui-frame-017-dot-active": accent } : null),
    ...(background
      ? {
          "--vibeui-frame-017-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-frame-017" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="frame-017"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="stage">
            <div data-part="field">
              {children ?? (
                <div data-part="stub">
                  <p data-part="stub-title">{stubTitle}</p>
                  <span data-part="stub-line" />
                  <span data-part="stub-line" />
                </div>
              )}
            </div>
          </div>
          <div data-part="bar">
            <span data-part="count">
              {index} / {total}
            </span>
            <span data-part="dots" aria-hidden="true">
              {Array.from({ length: safeTotal }, (_, dotIndex) => (
                <span
                  key={dotIndex}
                  data-part="dot"
                  data-current={dotIndex + 1 === current ? "true" : undefined}
                />
              ))}
            </span>
          </div>
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </>
  )
}

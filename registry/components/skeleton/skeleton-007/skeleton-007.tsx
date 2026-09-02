import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Skeleton007Props = ComponentPropsWithoutRef<"div"> & {
  tiles?: number
  /** Минимальная ширина плитки: от неё сетка сама считает число колонок. */
  minTile?: string
  label?: string
  /** Пусто — подложки нет, галерея лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: заглушка галереи считает колонки сама — auto-fill с
// minmax от собственной ширины блока, а не от ширины окна. Поэтому в узкой
// колонке карточки каталога плиток будет две, а на широкой странице шесть,
// и настоящая галерея встанет в ту же сетку без прыжка.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки по
// умолчанию нет, галерея темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="skeleton-007"]){
--vibeui-skeleton-007-bg:transparent;
--vibeui-skeleton-007-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-skeleton-007-base:light-dark(oklch(0.93 0.005 265),oklch(0.3 0.012 265));
--vibeui-skeleton-007-shine:light-dark(oklch(0.97 0.003 265),oklch(0.39 0.016 265));
--vibeui-skeleton-007-min:6rem;
--vibeui-skeleton-007-delay:0s;
}
[data-vibeui-block="skeleton-007"]{
width:100%;max-width:30rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-skeleton-007-bg);
border:1px solid var(--vibeui-skeleton-007-border);border-radius:1rem;
}
/* Колонки считает сама сетка: число плиток в ряду зависит от ширины блока. */
[data-vibeui-block="skeleton-007"] [data-part="grid"]{
display:grid;gap:0.625rem;
grid-template-columns:repeat(auto-fill,minmax(var(--vibeui-skeleton-007-min),1fr));
}
[data-vibeui-block="skeleton-007"] [data-part="tile"]{
display:flex;flex-direction:column;gap:0.375rem;
animation-delay:var(--vibeui-skeleton-007-delay);
}
[data-vibeui-block="skeleton-007"] [data-part="thumb"],
[data-vibeui-block="skeleton-007"] [data-part="cap"]{
background:linear-gradient(90deg,
var(--vibeui-skeleton-007-base) 0%,
var(--vibeui-skeleton-007-shine) 50%,
var(--vibeui-skeleton-007-base) 100%) 0 0 / 200% 100%;
animation:vibeui-skeleton-007-sweep 1.5s ease-in-out infinite;
animation-delay:inherit;
}
/* Квадрат задан пропорцией, а не высотой: плитка тянется вместе с колонкой. */
[data-vibeui-block="skeleton-007"] [data-part="thumb"]{
aspect-ratio:1 / 1;border-radius:0.625rem;
}
[data-vibeui-block="skeleton-007"] [data-part="cap"]{
height:0.5625rem;width:74%;border-radius:0.1875rem;
}
[data-vibeui-block="skeleton-007"] [data-part="tile"]:nth-child(3n) [data-part="cap"]{width:52%}
[data-vibeui-block="skeleton-007"] [data-part="tile"]:nth-child(4n) [data-part="cap"]{width:88%}
@keyframes vibeui-skeleton-007-sweep{
0%{background-position:120% 0}
100%{background-position:-20% 0}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="skeleton-007"] *{animation:none!important;transition:none!important}
[data-vibeui-block="skeleton-007"] [data-part="thumb"],
[data-vibeui-block="skeleton-007"] [data-part="cap"]{background:var(--vibeui-skeleton-007-base)}
}
`

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы плиткам
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
 * Заглушка сетки плиток: число колонок считает auto-fill.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Skeleton007({
  tiles = 8,
  minTile = "6rem",
  label = "Галерея загружается",
  background = "",
  className,
  style,
  ...props
}: Skeleton007Props) {
  const count = Math.min(24, Math.max(1, tiles))
  const palette = {
    "--vibeui-skeleton-007-min": minTile,
    ...(background
      ? {
          "--vibeui-skeleton-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-skeleton-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="skeleton-007"
        role="status"
        aria-busy="true"
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="grid">
          {Array.from({ length: count }, (_, index) => (
            <div
              key={index}
              data-part="tile"
              style={
                {
                  "--vibeui-skeleton-007-delay": `${(index % 6) * 0.08}s`,
                } as CSSProperties
              }
            >
              <span data-part="thumb" />
              <span data-part="cap" />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

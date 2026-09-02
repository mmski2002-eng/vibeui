import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Skeleton004Props = ComponentPropsWithoutRef<"div"> & {
  rows?: number
  /** Раскладка колонок в терминах grid-template-columns. */
  columns?: string
  label?: string
  /** Пусто — подложки нет, таблица лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: заглушка таблицы обязана держать ширины колонок будущей
// таблицы, иначе при подстановке данных всё разъезжается. Ширины заданы одной
// переменной grid-template-columns, поэтому шапка и строки не могут разойтись:
// у них буквально одна и та же сетка.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки по
// умолчанию нет, таблица темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="skeleton-004"]){
--vibeui-skeleton-004-bg:transparent;
--vibeui-skeleton-004-head:light-dark(oklch(0.975 0.003 265),oklch(0.26 0.011 265));
--vibeui-skeleton-004-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-skeleton-004-base:light-dark(oklch(0.93 0.005 265),oklch(0.3 0.012 265));
--vibeui-skeleton-004-shine:light-dark(oklch(0.97 0.003 265),oklch(0.39 0.016 265));
--vibeui-skeleton-004-columns:1.5rem 2fr 1fr 1fr 4rem;
}
[data-vibeui-block="skeleton-004"]{
width:100%;max-width:32rem;box-sizing:border-box;overflow:hidden;
background:var(--vibeui-skeleton-004-bg);
border:1px solid var(--vibeui-skeleton-004-border);border-radius:0.875rem;
}
/* Одна сетка на шапку и на строки: колонки не могут разойтись. */
[data-vibeui-block="skeleton-004"] [data-part="row"]{
display:grid;grid-template-columns:var(--vibeui-skeleton-004-columns);
align-items:center;gap:0.75rem;padding:0.6875rem 0.875rem;
}
[data-vibeui-block="skeleton-004"] [data-part="row"][data-role="head"]{
background:var(--vibeui-skeleton-004-head);
border-bottom:1px solid var(--vibeui-skeleton-004-border);
}
[data-vibeui-block="skeleton-004"] [data-part="row"] + [data-part="row"]:not([data-role="head"]){
border-top:1px solid var(--vibeui-skeleton-004-border);
}
[data-vibeui-block="skeleton-004"] [data-part="cell"]{
height:0.6875rem;border-radius:0.25rem;
background:linear-gradient(90deg,
var(--vibeui-skeleton-004-base) 0%,
var(--vibeui-skeleton-004-shine) 50%,
var(--vibeui-skeleton-004-base) 100%) 0 0 / 200% 100%;
animation:vibeui-skeleton-004-sweep 1.5s ease-in-out infinite;
}
[data-vibeui-block="skeleton-004"] [data-role="head"] [data-part="cell"]{
height:0.5rem;opacity:.75;
}
/* Разная длина ячеек: одинаковые прямоугольники читаются как решётка. */
[data-vibeui-block="skeleton-004"] [data-part="cell"][data-fill="long"]{width:82%}
[data-vibeui-block="skeleton-004"] [data-part="cell"][data-fill="mid"]{width:64%}
[data-vibeui-block="skeleton-004"] [data-part="cell"][data-fill="short"]{width:46%}
[data-vibeui-block="skeleton-004"] [data-part="cell"][data-fill="box"]{
height:0.875rem;border-radius:0.1875rem;
}
[data-vibeui-block="skeleton-004"] [data-part="row"]:nth-child(even) [data-part="cell"][data-fill="long"]{width:66%}
[data-vibeui-block="skeleton-004"] [data-part="row"]:nth-child(3n) [data-part="cell"][data-fill="mid"]{width:48%}
@keyframes vibeui-skeleton-004-sweep{
0%{background-position:120% 0}
100%{background-position:-20% 0}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="skeleton-004"] *{animation:none!important;transition:none!important}
[data-vibeui-block="skeleton-004"] [data-part="cell"]{background:var(--vibeui-skeleton-004-base)}
}
`

const FILLS = ["box", "long", "mid", "short", "short"] as const

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы полосам
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
 * Заглушка таблицы: шапка и строки на одной сетке колонок.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Skeleton004({
  rows = 5,
  columns = "1.5rem 2fr 1fr 1fr 4rem",
  label = "Таблица загружается",
  background = "",
  className,
  style,
  ...props
}: Skeleton004Props) {
  const count = Math.min(20, Math.max(1, rows))
  const palette = {
    "--vibeui-skeleton-004-columns": columns,
    ...(background
      ? {
          "--vibeui-skeleton-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-skeleton-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="skeleton-004"
        role="status"
        aria-busy="true"
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="row" data-role="head">
          {FILLS.map((fill, index) => (
            <span key={index} data-part="cell" data-fill={fill} />
          ))}
        </div>
        {Array.from({ length: count }, (_, row) => (
          <div key={row} data-part="row">
            {FILLS.map((fill, index) => (
              <span key={index} data-part="cell" data-fill={fill} />
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

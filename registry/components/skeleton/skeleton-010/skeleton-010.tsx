import type { ComponentProps, CSSProperties } from "react"

export type Skeleton010Props = ComponentProps<"div"> & {
  rows?: number
  label?: string
  /** Пусто — подложки нет, таблица лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: заглушка таблицы на настоящей разметке table/thead/tbody,
// а не на сетке из div, как в skeleton-004. Семантика таблицы сохраняется, но
// сама она декоративна — данных в ней ещё нет, поэтому table помечена
// aria-hidden, а текст-заглушка для скринридера живёт в aria-label обёртки.
// По умолчанию пять строк: это тот размер первой страницы, для которого
// заглушку и просят чаще всего.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки по
// умолчанию нет, таблица темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="skeleton-010"]){
--vibeui-skeleton-010-bg:transparent;
--vibeui-skeleton-010-head:light-dark(oklch(0.975 0.003 265),oklch(0.26 0.011 265));
--vibeui-skeleton-010-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-skeleton-010-base:light-dark(oklch(0.93 0.005 265),oklch(0.3 0.012 265));
--vibeui-skeleton-010-shine:light-dark(oklch(0.97 0.003 265),oklch(0.39 0.016 265));
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="skeleton-010"]{color-scheme:dark}
[data-vibeui-block="skeleton-010"]{
width:100%;max-width:30rem;box-sizing:border-box;overflow:hidden;
background:var(--vibeui-skeleton-010-bg);
border:1px solid var(--vibeui-skeleton-010-border);border-radius:0.875rem;
}
[data-vibeui-block="skeleton-010"] table{width:100%;border-collapse:collapse}
[data-vibeui-block="skeleton-010"] th,
[data-vibeui-block="skeleton-010"] td{
padding:0.625rem 0.875rem;text-align:left;border-bottom:1px solid var(--vibeui-skeleton-010-border);
}
[data-vibeui-block="skeleton-010"] thead th{background:var(--vibeui-skeleton-010-head)}
[data-vibeui-block="skeleton-010"] tbody tr:last-child td{border-bottom:0}
[data-vibeui-block="skeleton-010"] [data-part="cell"]{
display:block;height:0.6875rem;border-radius:0.25rem;
background:linear-gradient(90deg,
var(--vibeui-skeleton-010-base) 0%,
var(--vibeui-skeleton-010-shine) 50%,
var(--vibeui-skeleton-010-base) 100%) 0 0 / 200% 100%;
animation:vibeui-skeleton-010-sweep 1.5s ease-in-out infinite;
}
[data-vibeui-block="skeleton-010"] thead [data-part="cell"]{height:0.5rem;opacity:.75}
/* Разная длина ячеек: одинаковые прямоугольники читаются как решётка. */
[data-vibeui-block="skeleton-010"] [data-part="cell"][data-fill="box"]{width:1.25rem}
[data-vibeui-block="skeleton-010"] [data-part="cell"][data-fill="long"]{width:88%}
[data-vibeui-block="skeleton-010"] [data-part="cell"][data-fill="mid"]{width:62%}
[data-vibeui-block="skeleton-010"] [data-part="cell"][data-fill="short"]{width:44%}
[data-vibeui-block="skeleton-010"] tbody tr:nth-child(even) [data-part="cell"][data-fill="long"]{width:70%}
[data-vibeui-block="skeleton-010"] tbody tr:nth-child(3n) [data-part="cell"][data-fill="mid"]{width:48%}
@keyframes vibeui-skeleton-010-sweep{
0%{background-position:120% 0}
100%{background-position:-20% 0}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="skeleton-010"] *{animation:none!important;transition:none!important}
[data-vibeui-block="skeleton-010"] [data-part="cell"]{background:var(--vibeui-skeleton-010-base)}
}
`

const COLUMNS = ["box", "long", "mid", "short"] as const

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
 * Заглушка таблицы на пять строк с шапкой: настоящая разметка table,
 * помеченная aria-hidden, текст-заглушка живёт в aria-label обёртки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Skeleton010({
  rows = 5,
  label = "Таблица загружается",
  background = "",
  className,
  style,
  ...props
}: Skeleton010Props) {
  const count = Math.min(8, Math.max(3, rows))
  const palette = {
    ...(background
      ? {
          "--vibeui-skeleton-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-skeleton-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="skeleton"
        data-vibeui-block="skeleton-010"
        role="status"
        aria-busy="true"
        aria-label={label}
        className={className}
        style={palette}
      >
        <table aria-hidden="true">
          <thead>
            <tr>
              {COLUMNS.map((fill, index) => (
                <th key={index}>
                  <span data-part="cell" data-fill={fill} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: count }, (_, row) => (
              <tr key={row}>
                {COLUMNS.map((fill, index) => (
                  <td key={index}>
                    <span data-part="cell" data-fill={fill} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

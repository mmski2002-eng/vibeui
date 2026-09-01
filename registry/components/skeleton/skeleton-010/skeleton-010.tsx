import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Skeleton010Props = ComponentPropsWithoutRef<"div"> & {
  rows?: number
  label?: string
}

// Идея компонента: заглушка таблицы на настоящей разметке table/thead/tbody,
// а не на сетке из div, как в skeleton-004. Семантика таблицы сохраняется, но
// сама она декоративна — данных в ней ещё нет, поэтому table помечена
// aria-hidden, а текст-заглушка для скринридера живёт в aria-label обёртки.
// По умолчанию пять строк: это тот размер первой страницы, для которого
// заглушку и просят чаще всего.
const STYLES = `
:where([data-vibeui-block="skeleton-010"]){
--vibeui-skeleton-010-bg:oklch(1 0 0);
--vibeui-skeleton-010-head:oklch(0.975 0.003 265);
--vibeui-skeleton-010-border:oklch(0.9 0.006 265);
--vibeui-skeleton-010-base:oklch(0.93 0.005 265);
--vibeui-skeleton-010-shine:oklch(0.97 0.003 265);
}
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
 * Заглушка таблицы на пять строк с шапкой: настоящая разметка table,
 * помеченная aria-hidden, текст-заглушка живёт в aria-label обёртки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Skeleton010({
  rows = 5,
  label = "Таблица загружается",
  className,
  style,
  ...props
}: Skeleton010Props) {
  const count = Math.min(8, Math.max(3, rows))

  return (
    <>
      <style href="vibeui-skeleton-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="skeleton-010"
        role="status"
        aria-busy="true"
        aria-label={label}
        className={className}
        style={style as CSSProperties}
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

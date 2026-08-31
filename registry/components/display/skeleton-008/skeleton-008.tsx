import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Skeleton008Props = ComponentPropsWithoutRef<"div"> & {
  /** Высоты столбиков в процентах от поля графика. */
  bars?: number[]
  height?: string
  label?: string
}

// Идея компонента: заглушка графика держит поле фиксированной высоты и рисует
// линии сетки — без них серые столбики читаются как список, а не как график.
// Высоты столбиков заданы явным массивом, а не случайными числами: случайные
// разъехались бы между сервером и клиентом при гидратации.
const STYLES = `
:where([data-vibeui-block="skeleton-008"]){
--vibeui-skeleton-008-bg:oklch(1 0 0);
--vibeui-skeleton-008-border:oklch(0.9 0.006 265);
--vibeui-skeleton-008-grid:oklch(0.94 0.004 265);
--vibeui-skeleton-008-base:oklch(0.93 0.005 265);
--vibeui-skeleton-008-shine:oklch(0.97 0.003 265);
--vibeui-skeleton-008-height:8.5rem;
--vibeui-skeleton-008-bar:0;
--vibeui-skeleton-008-delay:0s;
}
[data-vibeui-block="skeleton-008"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:28rem;box-sizing:border-box;padding:1rem 1.125rem 1.125rem;
background:var(--vibeui-skeleton-008-bg);
border:1px solid var(--vibeui-skeleton-008-border);border-radius:1rem;
}
[data-vibeui-block="skeleton-008"] [data-part="legend"]{
display:flex;align-items:center;gap:0.5rem;
}
[data-vibeui-block="skeleton-008"] [data-part="chip"]{
width:2.75rem;height:0.625rem;border-radius:9999px;
}
[data-vibeui-block="skeleton-008"] [data-part="title"]{
width:38%;height:0.75rem;border-radius:0.25rem;
}
/* Линии сетки: без них столбики читаются как список, а не как график. */
[data-vibeui-block="skeleton-008"] [data-part="plot"]{
display:flex;align-items:flex-end;gap:0.5rem;
height:var(--vibeui-skeleton-008-height);
padding-bottom:1px;
background-image:repeating-linear-gradient(
to top,
var(--vibeui-skeleton-008-grid) 0 1px,
transparent 1px 25%);
}
[data-vibeui-block="skeleton-008"] [data-part="bar"]{
flex:1 1 0;border-radius:0.25rem 0.25rem 0 0;
height:calc(var(--vibeui-skeleton-008-bar) * 1%);
animation-delay:var(--vibeui-skeleton-008-delay);
}
[data-vibeui-block="skeleton-008"] [data-part="tick"]{
flex:1 1 0;height:0.5rem;border-radius:0.1875rem;
}
[data-vibeui-block="skeleton-008"] [data-part="axis"]{
display:flex;gap:0.5rem;padding-top:0.5rem;
border-top:1px solid var(--vibeui-skeleton-008-border);
}
[data-vibeui-block="skeleton-008"] [data-part="chip"],
[data-vibeui-block="skeleton-008"] [data-part="title"],
[data-vibeui-block="skeleton-008"] [data-part="bar"],
[data-vibeui-block="skeleton-008"] [data-part="tick"]{
background:linear-gradient(90deg,
var(--vibeui-skeleton-008-base) 0%,
var(--vibeui-skeleton-008-shine) 50%,
var(--vibeui-skeleton-008-base) 100%) 0 0 / 200% 100%;
animation:vibeui-skeleton-008-sweep 1.5s ease-in-out infinite;
}
@keyframes vibeui-skeleton-008-sweep{
0%{background-position:120% 0}
100%{background-position:-20% 0}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="skeleton-008"] *{animation:none!important;transition:none!important}
[data-vibeui-block="skeleton-008"] [data-part="chip"],
[data-vibeui-block="skeleton-008"] [data-part="title"],
[data-vibeui-block="skeleton-008"] [data-part="bar"],
[data-vibeui-block="skeleton-008"] [data-part="tick"]{background:var(--vibeui-skeleton-008-base)}
}
`

const DEFAULT_BARS = [42, 68, 55, 88, 34, 72, 61]

/**
 * Заглушка столбчатого графика с полем, сеткой и подписями оси.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Skeleton008({
  bars = DEFAULT_BARS,
  height = "8.5rem",
  label = "График загружается",
  className,
  style,
  ...props
}: Skeleton008Props) {
  const palette = {
    "--vibeui-skeleton-008-height": height,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-skeleton-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="skeleton-008"
        role="status"
        aria-busy="true"
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="legend">
          <span data-part="chip" />
          <span data-part="title" />
        </div>
        <div data-part="plot">
          {bars.map((value, index) => (
            <span
              key={index}
              data-part="bar"
              style={
                {
                  "--vibeui-skeleton-008-bar": Math.min(
                    100,
                    Math.max(4, value),
                  ),
                  "--vibeui-skeleton-008-delay": `${index * 0.07}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <div data-part="axis">
          {bars.map((_, index) => (
            <span key={index} data-part="tick" />
          ))}
        </div>
      </div>
    </>
  )
}

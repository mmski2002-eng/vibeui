import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Skeleton003Props = ComponentPropsWithoutRef<"div"> & {
  rows?: number
  label?: string
}

// Идея компонента: заглушка списка, где строки оживают волной. Каждой строке
// задана своя animation-delay, поэтому блик идёт сверху вниз и список
// читается как один объект, а не как пачка одинаково мигающих полос.
// Ширины текстовых полос чередуются: одинаковые выглядят как таблица.
const STYLES = `
:where([data-vibeui-block="skeleton-003"]){
--vibeui-skeleton-003-bg:oklch(1 0 0);
--vibeui-skeleton-003-border:oklch(0.9 0.006 265);
--vibeui-skeleton-003-base:oklch(0.93 0.005 265);
--vibeui-skeleton-003-shine:oklch(0.97 0.003 265);
--vibeui-skeleton-003-delay:0s;
}
[data-vibeui-block="skeleton-003"]{
width:100%;max-width:24rem;box-sizing:border-box;padding:0.5rem;
background:var(--vibeui-skeleton-003-bg);
border:1px solid var(--vibeui-skeleton-003-border);border-radius:1rem;
}
[data-vibeui-block="skeleton-003"] ul{margin:0;padding:0;list-style:none}
[data-vibeui-block="skeleton-003"] li{
display:flex;align-items:center;gap:0.75rem;
padding:0.625rem 0.625rem;
}
[data-vibeui-block="skeleton-003"] li + li{border-top:1px solid var(--vibeui-skeleton-003-border)}
[data-vibeui-block="skeleton-003"] [data-part="avatar"],
[data-vibeui-block="skeleton-003"] [data-part="bar"]{
background:linear-gradient(90deg,
var(--vibeui-skeleton-003-base) 0%,
var(--vibeui-skeleton-003-shine) 50%,
var(--vibeui-skeleton-003-base) 100%) 0 0 / 200% 100%;
/* Волна: задержка своя у каждой строки, поэтому блик идёт сверху вниз. */
animation:vibeui-skeleton-003-sweep 1.5s ease-in-out infinite;
animation-delay:var(--vibeui-skeleton-003-delay);
}
[data-vibeui-block="skeleton-003"] [data-part="avatar"]{
flex:none;width:2.25rem;height:2.25rem;border-radius:9999px;
}
[data-vibeui-block="skeleton-003"] [data-part="text"]{
display:flex;flex-direction:column;gap:0.4375rem;flex:1 1 auto;min-width:0;
}
[data-vibeui-block="skeleton-003"] [data-part="bar"]{height:0.6875rem;border-radius:0.25rem}
[data-vibeui-block="skeleton-003"] [data-part="bar"][data-size="name"]{width:42%;height:0.8125rem}
[data-vibeui-block="skeleton-003"] li:nth-child(even) [data-part="bar"][data-size="name"]{width:58%}
[data-vibeui-block="skeleton-003"] [data-part="bar"][data-size="meta"]{width:78%}
[data-vibeui-block="skeleton-003"] li:nth-child(3n) [data-part="bar"][data-size="meta"]{width:62%}
[data-vibeui-block="skeleton-003"] [data-part="bar"][data-size="tail"]{
flex:none;width:2.75rem;height:0.75rem;
}
@keyframes vibeui-skeleton-003-sweep{
0%{background-position:120% 0}
100%{background-position:-20% 0}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="skeleton-003"] *{animation:none!important;transition:none!important}
[data-vibeui-block="skeleton-003"] [data-part="avatar"],
[data-vibeui-block="skeleton-003"] [data-part="bar"]{background:var(--vibeui-skeleton-003-base)}
}
`

/**
 * Заглушка списка строк: блик идёт волной сверху вниз.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Skeleton003({
  rows = 5,
  label = "Список загружается",
  className,
  style,
  ...props
}: Skeleton003Props) {
  const count = Math.min(20, Math.max(1, rows))

  return (
    <>
      <style href="vibeui-skeleton-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="skeleton-003"
        role="status"
        aria-busy="true"
        aria-label={label}
        className={className}
        style={style as CSSProperties}
      >
        <ul>
          {Array.from({ length: count }, (_, index) => (
            <li
              key={index}
              style={
                {
                  "--vibeui-skeleton-003-delay": `${index * 0.09}s`,
                } as CSSProperties
              }
            >
              <span data-part="avatar" />
              <span data-part="text">
                <span data-part="bar" data-size="name" />
                <span data-part="bar" data-size="meta" />
              </span>
              <span data-part="bar" data-size="tail" />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Avatar008Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  count?: number
  label?: string
  lines?: boolean
}

// Идея компонента: заглушка списка людей. Полосы имени разной длины — ровные
// одинаковые прямоугольники выглядят как таблица, а не как имена. Блик идёт
// по строкам с задержкой: одновременная вспышка читается как мигание экрана.
const STYLES = `
:where([data-vibeui-block="avatar-008"]){
--vibeui-avatar-008-size:2.75rem;
--vibeui-avatar-008-bg:oklch(1 0 0);
--vibeui-avatar-008-border:oklch(0.9 0.006 265);
--vibeui-avatar-008-base:oklch(0.93 0.005 265);
--vibeui-avatar-008-shine:oklch(0.97 0.003 265);
--vibeui-avatar-008-radius:0.75rem;
}
[data-vibeui-block="avatar-008"]{
display:flex;flex-direction:column;gap:0.75rem;
box-sizing:border-box;width:100%;max-width:22rem;padding:0.875rem;
background:var(--vibeui-avatar-008-bg);
border:1px solid var(--vibeui-avatar-008-border);
border-radius:var(--vibeui-avatar-008-radius);
}
[data-vibeui-block="avatar-008"] [data-part="row"]{display:flex;align-items:center;gap:0.75rem}
[data-vibeui-block="avatar-008"] [data-part="shape"],
[data-vibeui-block="avatar-008"] [data-part="line"]{
background:
linear-gradient(90deg,var(--vibeui-avatar-008-base) 0%,var(--vibeui-avatar-008-shine) 50%,var(--vibeui-avatar-008-base) 100%)
0 0 / 200% 100%;
animation:vibeui-avatar-008-sweep 1.4s ease-in-out infinite;
}
[data-vibeui-block="avatar-008"] [data-part="shape"]{
flex:none;width:var(--vibeui-avatar-008-size);height:var(--vibeui-avatar-008-size);
border-radius:9999px;
}
[data-vibeui-block="avatar-008"] [data-part="lines"]{display:flex;flex-direction:column;gap:0.375rem;flex:1;min-width:0}
[data-vibeui-block="avatar-008"] [data-part="line"]{height:0.625rem;border-radius:9999px}
/* Разная длина полос: одинаковые читаются как таблица, а не как имена. */
[data-vibeui-block="avatar-008"] [data-part="line"]:first-child{width:58%}
[data-vibeui-block="avatar-008"] [data-part="line"]:last-child{width:34%;height:0.5rem}
[data-vibeui-block="avatar-008"] [data-part="row"]:nth-child(2) [data-part="line"]:first-child{width:70%}
[data-vibeui-block="avatar-008"] [data-part="row"]:nth-child(3) [data-part="line"]:first-child{width:46%}
/* Задержка по строкам: одновременная вспышка выглядит как мигание экрана. */
[data-vibeui-block="avatar-008"] [data-part="row"]:nth-child(2) *{animation-delay:.14s}
[data-vibeui-block="avatar-008"] [data-part="row"]:nth-child(3) *{animation-delay:.28s}
[data-vibeui-block="avatar-008"] [data-part="row"]:nth-child(4) *{animation-delay:.42s}
@keyframes vibeui-avatar-008-sweep{
0%{background-position:120% 0}
100%{background-position:-20% 0}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="avatar-008"] *{animation:none!important;transition:none!important}
[data-vibeui-block="avatar-008"] [data-part="shape"],
[data-vibeui-block="avatar-008"] [data-part="line"]{background:var(--vibeui-avatar-008-base)}
}
`

/**
 * Заглушка списка людей: круг под аватар и полосы под имя.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar008({
  count = 3,
  label = "Загружаются участники",
  lines = true,
  className,
  style,
  ...props
}: Avatar008Props) {
  return (
    <>
      <style href="vibeui-avatar-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="avatar-008"
        className={className}
        style={style as CSSProperties}
        role="status"
        aria-busy="true"
        aria-label={label}
      >
        {Array.from({ length: Math.max(1, count) }, (_, index) => (
          <div key={index} data-part="row">
            <span data-part="shape" />
            {lines ? (
              <span data-part="lines">
                <span data-part="line" />
                <span data-part="line" />
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </>
  )
}

import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Avatar008Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  count?: number
  label?: string
  lines?: boolean
  /** Пусто — подложки нет, компонент лежит на фоне страницы. */
  background?: string
}

// Идея компонента: заглушка списка людей. Полосы имени разной длины — ровные
// одинаковые прямоугольники выглядят как таблица, а не как имена. Блик идёт
// по строкам с задержкой: одновременная вспышка читается как мигание экрана.
const STYLES = `
:where([data-vibeui-block="avatar-008"]){
--vibeui-avatar-008-size:2.75rem;
--vibeui-avatar-008-bg:transparent;
--vibeui-avatar-008-border:light-dark(oklch(0.9 0.006 265),oklch(0.31 0.01 265));
--vibeui-avatar-008-base:light-dark(oklch(0.93 0.005 265),oklch(0.27 0.008 265));
--vibeui-avatar-008-shine:light-dark(oklch(0.97 0.003 265),oklch(0.33 0.005 265));
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
 * Заглушка списка людей: круг под аватар и полосы под имя.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar008({
  background = "",
  count = 3,
  label = "Загружаются участники",
  lines = true,
  className,
  style,
  ...props
}: Avatar008Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-avatar-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="avatar-008"
        className={className}
        style={palette}
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

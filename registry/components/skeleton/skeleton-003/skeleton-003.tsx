import type { ComponentProps, CSSProperties } from "react"

export type Skeleton003Props = ComponentProps<"div"> & {
  rows?: number
  label?: string
  /** Пусто — подложки нет, список лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: заглушка списка, где строки оживают волной. Каждой строке
// задана своя animation-delay, поэтому блик идёт сверху вниз и список
// читается как один объект, а не как пачка одинаково мигающих полос.
// Ширины текстовых полос чередуются: одинаковые выглядят как таблица.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки по
// умолчанию нет, список темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="skeleton-003"]){
--vibeui-skeleton-003-bg:transparent;
--vibeui-skeleton-003-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-skeleton-003-base:light-dark(oklch(0.93 0 265),oklch(0.3 0 265));
--vibeui-skeleton-003-shine:light-dark(oklch(0.97 0 265),oklch(0.39 0 265));
--vibeui-skeleton-003-delay:0s;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="skeleton-003"]{color-scheme:dark}
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
 * Заглушка списка строк: блик идёт волной сверху вниз.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Skeleton003({
  rows = 5,
  label = "Список загружается",
  background = "",
  className,
  style,
  ...props
}: Skeleton003Props) {
  const count = Math.min(20, Math.max(1, rows))
  const palette = {
    ...(background
      ? {
          "--vibeui-skeleton-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-skeleton-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="skeleton"
        data-vibeui-block="skeleton-003"
        role="status"
        aria-busy="true"
        aria-label={label}
        className={className}
        style={palette}
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

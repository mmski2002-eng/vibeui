import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Skeleton005Props = ComponentPropsWithoutRef<"div"> & {
  /** Высота обложки: под неё же считается наезд аватара. */
  cover?: string
  label?: string
  /** Пусто — подложки нет, шапка лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: заглушка шапки профиля повторяет её самую хрупкую деталь —
// круглый аватар, наезжающий на обложку. Наезд задан отрицательным margin от
// той же переменной, что и высота обложки, поэтому при смене высоты каркас не
// разъезжается и настоящая шапка встаёт ровно на место заглушки.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки по
// умолчанию нет, шапка темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="skeleton-005"]){
--vibeui-skeleton-005-bg:transparent;
--vibeui-skeleton-005-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-skeleton-005-base:light-dark(oklch(0.93 0.005 265),oklch(0.3 0.012 265));
--vibeui-skeleton-005-shine:light-dark(oklch(0.97 0.003 265),oklch(0.39 0.016 265));
--vibeui-skeleton-005-cover:5.5rem;
--vibeui-skeleton-005-avatar:4.25rem;
}
[data-vibeui-block="skeleton-005"]{
width:100%;max-width:22rem;box-sizing:border-box;overflow:hidden;
background:var(--vibeui-skeleton-005-bg);
border:1px solid var(--vibeui-skeleton-005-border);border-radius:1rem;
}
[data-vibeui-block="skeleton-005"] [data-part="cover"],
[data-vibeui-block="skeleton-005"] [data-part="avatar"],
[data-vibeui-block="skeleton-005"] [data-part="bar"],
[data-vibeui-block="skeleton-005"] [data-part="stat"]{
background:linear-gradient(90deg,
var(--vibeui-skeleton-005-base) 0%,
var(--vibeui-skeleton-005-shine) 50%,
var(--vibeui-skeleton-005-base) 100%) 0 0 / 200% 100%;
animation:vibeui-skeleton-005-sweep 1.5s ease-in-out infinite;
}
[data-vibeui-block="skeleton-005"] [data-part="cover"]{
height:var(--vibeui-skeleton-005-cover);
}
[data-vibeui-block="skeleton-005"] [data-part="body"]{
display:flex;flex-direction:column;gap:0.625rem;padding:0 1.125rem 1.125rem;
}
/* Наезд аватара считается от той же переменной, что и высота обложки.
   Обводка отделяет аватар от обложки и без подложки: кольцо подложки при
   прозрачном фоне не видно, а слить два блика в одно пятно нельзя. */
[data-vibeui-block="skeleton-005"] [data-part="avatar"]{
width:var(--vibeui-skeleton-005-avatar);height:var(--vibeui-skeleton-005-avatar);
margin-top:calc(var(--vibeui-skeleton-005-avatar) / -2);
border-radius:9999px;
box-shadow:0 0 0 0.125rem var(--vibeui-skeleton-005-border),0 0 0 0.25rem var(--vibeui-skeleton-005-bg);
}
[data-vibeui-block="skeleton-005"] [data-part="bar"]{height:0.75rem;border-radius:0.25rem}
[data-vibeui-block="skeleton-005"] [data-part="bar"][data-size="name"]{width:52%;height:1.0625rem;margin-top:0.25rem}
[data-vibeui-block="skeleton-005"] [data-part="bar"][data-size="handle"]{width:34%;height:0.625rem}
[data-vibeui-block="skeleton-005"] [data-part="bar"][data-size="bio"]{width:100%}
[data-vibeui-block="skeleton-005"] [data-part="bar"][data-size="bio-last"]{width:68%}
/* Метрики — три равные колонки: столько же, сколько в настоящей шапке. */
[data-vibeui-block="skeleton-005"] [data-part="stats"]{
display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;
margin-top:0.375rem;padding-top:0.75rem;
border-top:1px solid var(--vibeui-skeleton-005-border);
}
[data-vibeui-block="skeleton-005"] [data-part="stat"]{height:1.75rem;border-radius:0.5rem}
@keyframes vibeui-skeleton-005-sweep{
0%{background-position:120% 0}
100%{background-position:-20% 0}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="skeleton-005"] *{animation:none!important;transition:none!important}
[data-vibeui-block="skeleton-005"] [data-part="cover"],
[data-vibeui-block="skeleton-005"] [data-part="avatar"],
[data-vibeui-block="skeleton-005"] [data-part="bar"],
[data-vibeui-block="skeleton-005"] [data-part="stat"]{background:var(--vibeui-skeleton-005-base)}
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
 * Заглушка шапки профиля с аватаром, наезжающим на обложку.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Skeleton005({
  cover = "5.5rem",
  label = "Профиль загружается",
  background = "",
  className,
  style,
  ...props
}: Skeleton005Props) {
  const palette = {
    "--vibeui-skeleton-005-cover": cover,
    ...(background
      ? {
          "--vibeui-skeleton-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-skeleton-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="skeleton-005"
        role="status"
        aria-busy="true"
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="cover" />
        <div data-part="body">
          <div data-part="avatar" />
          <div data-part="bar" data-size="name" />
          <div data-part="bar" data-size="handle" />
          <div data-part="bar" data-size="bio" />
          <div data-part="bar" data-size="bio-last" />
          <div data-part="stats">
            <span data-part="stat" />
            <span data-part="stat" />
            <span data-part="stat" />
          </div>
        </div>
      </div>
    </>
  )
}

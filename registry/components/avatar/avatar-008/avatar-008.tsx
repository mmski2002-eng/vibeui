import type { ComponentProps, CSSProperties } from "react"

export type Avatar008Props = Omit<ComponentProps<"div">, "children"> & {
  count?: number
  label?: string
  lines?: boolean
  /** Список загрузился: те же строки, но с людьми. */
  ready?: boolean
  people?: { name: string; role: string; src?: string }[]
  /** Пусто — подложки нет, компонент лежит на фоне страницы. */
  background?: string
}

// Идея компонента: заглушка списка людей. Полосы имени разной длины — ровные
// одинаковые прямоугольники выглядят как таблица, а не как имена. Блик идёт
// по строкам с задержкой: одновременная вспышка читается как мигание экрана.
// Готовый список живёт здесь же и повторяет геометрию заглушки до пикселя:
// пока это два разных компонента, строки при загрузке прыгают, а вместе они
// обязаны совпадать.
const STYLES = `
:where([data-vibeui-block="avatar-008"]){
--vibeui-avatar-008-size:2.5rem;
--vibeui-avatar-008-bg:transparent;
--vibeui-avatar-008-border:light-dark(oklch(0.9 0 265),oklch(0.31 0 265));
--vibeui-avatar-008-base:light-dark(oklch(0.93 0 265),oklch(0.27 0 265));
--vibeui-avatar-008-shine:light-dark(oklch(0.97 0 265),oklch(0.33 0 265));
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
/* Готовая строка: те же размеры, что у костей, иначе список дёрнется. */
[data-vibeui-block="avatar-008"] [data-part="face"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:var(--vibeui-avatar-008-size);height:var(--vibeui-avatar-008-size);
border-radius:9999px;
background:light-dark(oklch(0.9 0.06 var(--vibeui-avatar-008-hue,265)),oklch(0.34 0.065 var(--vibeui-avatar-008-hue,265)));
color:light-dark(oklch(0.36 0.12 var(--vibeui-avatar-008-hue,265)),oklch(0.88 0.063 var(--vibeui-avatar-008-hue,265)));
font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
font-size:calc(var(--vibeui-avatar-008-size) * 0.34);font-weight:650;line-height:1;
}
[data-vibeui-block="avatar-008"] [data-part="face"] img{width:100%;height:100%;border-radius:inherit;object-fit:cover;display:block}
[data-vibeui-block="avatar-008"] [data-part="text"]{
display:flex;flex-direction:column;gap:0.125rem;flex:1;min-width:0;
font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-008"] [data-part="name"]{
color:light-dark(oklch(0.22 0 265),oklch(0.96 0 265));
font-size:0.875rem;font-weight:600;line-height:1.25;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="avatar-008"] [data-part="role"]{
color:light-dark(oklch(0.52 0 265),oklch(0.72 0 265));
font-size:0.75rem;line-height:1.25;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
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
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-008"]{color-scheme:dark}
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

// Оттенок из имени: FNV-1a по двенадцати ступеням круга — тот же алгоритм,
// что у остальных аватаров, поэтому цвет человека везде одинаковый.
function hue(name: string) {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

const DEFAULT_PEOPLE = [
  { name: "Анна Реброва", role: "Продуктовый дизайнер" },
  { name: "Марк Ильин", role: "Фронтенд" },
  { name: "Мария Гурова", role: "Аналитик" },
]

/**
 * Список людей в двух состояниях: заглушка и готовые строки той же геометрии.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar008({
  background = "",
  count = 3,
  label = "Загружаются участники",
  lines = true,
  ready = false,
  people = DEFAULT_PEOPLE,
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
        data-slot="avatar"
        data-vibeui-block="avatar-008"
        className={className}
        style={palette}
        role={ready ? undefined : "status"}
        aria-busy={ready ? undefined : "true"}
        aria-label={ready ? undefined : label}
      >
        {ready
          ? people.slice(0, Math.max(1, count)).map((person) => (
              <div key={person.name} data-part="row">
                <span
                  data-part="face"
                  aria-hidden="true"
                  style={
                    {
                      "--vibeui-avatar-008-hue": hue(person.name),
                    } as CSSProperties
                  }
                >
                  {person.src ? (
                    <img src={person.src} alt="" />
                  ) : (
                    initials(person.name)
                  )}
                </span>
                {lines ? (
                  <span data-part="text">
                    <span data-part="name">{person.name}</span>
                    <span data-part="role">{person.role}</span>
                  </span>
                ) : null}
              </div>
            ))
          : Array.from({ length: Math.max(1, count) }, (_, index) => (
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

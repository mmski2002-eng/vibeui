import type { ComponentProps, CSSProperties } from "react"

export type Avatar016Props = Omit<ComponentProps<"div">, "children"> & {
  names?: string[]
  photos?: string[]
  title?: string
  size?: "sm" | "md" | "lg"
  /** Пусто — подложки нет, компонент лежит на фоне страницы. */
  background?: string
  /** Цвет основного текста. Пусто — берётся из темы окружения. */
  textColor?: string
  /** Цвет приглушённого текста. Пусто — выводится из основного. */
  mutedColor?: string
}

// Идея компонента: сетка лиц вместо стопки. Стопка экономит место, но прячет
// людей друг за другом; сетка нужна там, где важен состав, а не факт «их
// несколько». Ячейка задана auto-fill с minmax, поэтому число колонок считает
// браузер, а не пропс: при смене ширины ряды перестраиваются сами. Имена
// подписаны под лицами и обрезаются многоточием — обрезанное имя честнее
// подсказки, которая не появляется на телефоне.
const STYLES = `
:where([data-vibeui-block="avatar-016"]){
--vibeui-avatar-016-size:2.5rem;
--vibeui-avatar-016-bg:transparent;
--vibeui-avatar-016-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.006 265));
--vibeui-avatar-016-muted:color-mix(in oklab,var(--vibeui-avatar-016-fg) 68%,transparent);
--vibeui-avatar-016-border:light-dark(oklch(0.91 0.006 265),oklch(0.31 0.01 265));
--vibeui-avatar-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="avatar-016"]{
box-sizing:border-box;width:100%;max-width:26rem;padding:0.875rem;
background:var(--vibeui-avatar-016-bg);
border:1px solid var(--vibeui-avatar-016-border);border-radius:0.875rem;
font-family:var(--vibeui-avatar-016-font);color:var(--vibeui-avatar-016-fg);
}
[data-vibeui-block="avatar-016"] *{box-sizing:border-box}
[data-vibeui-block="avatar-016"] h3{
margin:0 0 0.75rem;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="avatar-016"] [data-part="count"]{color:var(--vibeui-avatar-016-muted);font-weight:500}
/* auto-fill: число колонок считает браузер, ряды перестраиваются сами. */
[data-vibeui-block="avatar-016"] ul{
list-style:none;margin:0;padding:0;
display:grid;grid-template-columns:repeat(auto-fill,minmax(4.5rem,1fr));gap:0.75rem 0.5rem;
}
[data-vibeui-block="avatar-016"] li{
display:flex;flex-direction:column;align-items:center;gap:0.375rem;min-width:0;
}
[data-vibeui-block="avatar-016"] [data-part="face"]{
display:grid;place-items:center;flex:none;
width:var(--vibeui-avatar-016-size);height:var(--vibeui-avatar-016-size);
border-radius:9999px;
background:light-dark(oklch(0.9 0.06 var(--vibeui-avatar-016-hue,265)),oklch(0.34 0.065 var(--vibeui-avatar-016-hue,265)));
color:light-dark(oklch(0.36 0.12 var(--vibeui-avatar-016-hue,265)),oklch(0.88 0.063 var(--vibeui-avatar-016-hue,265)));
font-size:calc(var(--vibeui-avatar-016-size) * 0.34);font-weight:700;
}
/* Имя обрезается многоточием: подсказка не появляется на телефоне. */
[data-vibeui-block="avatar-016"] [data-part="face"]{overflow:hidden}
[data-vibeui-block="avatar-016"] [data-part="face"] img{width:100%;height:100%;border-radius:inherit;object-fit:cover;display:block}
[data-vibeui-block="avatar-016"] [data-part="name"]{
max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.6875rem;color:var(--vibeui-avatar-016-muted);text-align:center;
}
[data-vibeui-block="avatar-016"][data-size="sm"]{--vibeui-avatar-016-size:2rem}
[data-vibeui-block="avatar-016"][data-size="lg"]{--vibeui-avatar-016-size:3.5rem}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-016"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_NAMES = [
  "Анна Реброва",
  "Марк Ильин",
  "Мария Гурова",
  "Олег Дроздов",
  "Ирина Ким",
  "Пётр Гай",
]

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
 * Сетка лиц: состав команды виден целиком, колонки считает браузер.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar016({
  background = "",
  names = DEFAULT_NAMES,
  photos = [],
  title = "В проекте",
  size = "md",
  textColor,
  mutedColor,
  className,
  style,
  ...props
}: Avatar016Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-avatar-016-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...(textColor ? { "--vibeui-avatar-016-fg": textColor } : null),
    ...(mutedColor ? { "--vibeui-avatar-016-muted": mutedColor } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-016" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="avatar"
        data-vibeui-block="avatar-016"
        data-size={size}
        className={className}
        style={palette}
      >
        <h3>
          {title} <span data-part="count">· {names.length}</span>
        </h3>
        <ul>
          {names.map((name, index) => (
            <li key={name}>
              <span
                data-part="face"
                aria-hidden="true"
                style={
                  { "--vibeui-avatar-016-hue": hue(name) } as CSSProperties
                }
              >
                {photos[index] ? (
                  <img src={photos[index]} alt="" />
                ) : (
                  initials(name)
                )}
              </span>
              <span data-part="name">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

import type { ComponentProps, CSSProperties } from "react"

export type Avatar030Props = Omit<ComponentProps<"div">, "children"> & {
  name?: string
  src?: string
  role?: string
  size?: "sm" | "md" | "lg"
  /** Пусто — подложки нет, компонент лежит на фоне страницы. */
  background?: string
  /** Цвет текста. Пусто — берётся из темы окружения, приглушённый выводится из него. */
  textColor?: string
}

// Идея компонента: карточка человека для сетки, где должность занимает ровно
// две строки. Должности в реальных списках разной длины — «Дизайнер» и
// «Руководитель направления клиентского опыта»; если дать тексту течь как
// придётся, карточки в ряду встанут разной высоты, а обрезка в одну строку
// съест половину смысла. Место под две строки зарезервировано min-height, а
// хвост режется line-clamp: высота фиксирована, содержимое остаётся читаемым.
const STYLES = `
:where([data-vibeui-block="avatar-030"]){
--vibeui-avatar-030-size:2.5rem;
--vibeui-avatar-030-line:1.0625rem;
--vibeui-avatar-030-bg:transparent;
--vibeui-avatar-030-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.006 265));
--vibeui-avatar-030-muted:color-mix(in oklab,var(--vibeui-avatar-030-fg) 68%,transparent);
--vibeui-avatar-030-border:light-dark(oklch(0.91 0.006 265),oklch(0.31 0.01 265));
--vibeui-avatar-030-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: тёмный текст обязан читаться на любом фоне. */
[data-vibeui-block="avatar-030"]{
container-type:inline-size;
display:flex;flex-direction:column;align-items:center;gap:0.5rem;
box-sizing:border-box;width:100%;max-width:11rem;
padding:1rem 0.875rem 1.125rem;text-align:center;
background:var(--vibeui-avatar-030-bg);
border:1px solid var(--vibeui-avatar-030-border);border-radius:1rem;
font-family:var(--vibeui-avatar-030-font);color:var(--vibeui-avatar-030-fg);
}
[data-vibeui-block="avatar-030"] *{box-sizing:border-box}
[data-vibeui-block="avatar-030"] [data-part="face"]{
display:grid;place-items:center;flex:none;
width:var(--vibeui-avatar-030-size);height:var(--vibeui-avatar-030-size);
border-radius:9999px;
background:light-dark(oklch(0.9 0.06 var(--vibeui-avatar-030-hue,265)),oklch(0.34 0.065 var(--vibeui-avatar-030-hue,265)));
color:light-dark(oklch(0.36 0.12 var(--vibeui-avatar-030-hue,265)),oklch(0.88 0.063 var(--vibeui-avatar-030-hue,265)));
font-size:calc(var(--vibeui-avatar-030-size) * 0.32);font-weight:700;line-height:1;
}
[data-vibeui-block="avatar-030"] [data-part="name"]{
width:100%;font-size:0.9375rem;font-weight:650;line-height:1.2;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
/* Ровно две строки: место зарезервировано, хвост срезан. */
[data-vibeui-block="avatar-030"] [data-part="role"]{
display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;
width:100%;overflow:hidden;
min-height:calc(var(--vibeui-avatar-030-line) * 2);
font-size:0.75rem;line-height:var(--vibeui-avatar-030-line);
color:var(--vibeui-avatar-030-muted);
}
[data-vibeui-block="avatar-030"][data-size="sm"]{--vibeui-avatar-030-size:2rem;max-width:9.5rem}
[data-vibeui-block="avatar-030"][data-size="lg"]{--vibeui-avatar-030-size:3.5rem;max-width:12.5rem}
[data-vibeui-block="avatar-030"] [data-part="face"]{overflow:hidden}
[data-vibeui-block="avatar-030"] [data-part="face"] img{width:100%;height:100%;border-radius:inherit;object-fit:cover;display:block}
@container (max-width: 14rem){
[data-vibeui-block="avatar-030"] [data-part="role"]{-webkit-line-clamp:1;line-clamp:1}
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-030"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-030"] *{animation:none!important;transition:none!important}}
`

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
 * Карточка человека с должностью ровно в две строки: сетка не пляшет по высоте.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar030({
  background = "",
  name = "Мария Гурова",
  src,
  role = "Руководитель направления клиентского опыта",
  size = "md",
  textColor,
  className,
  style,
  ...props
}: Avatar030Props) {
  const palette = {
    "--vibeui-avatar-030-hue": hue(name),
    ...(background
      ? {
          "--vibeui-avatar-030-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...(textColor ? { "--vibeui-avatar-030-fg": textColor } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-030" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="avatar"
        data-vibeui-block="avatar-030"
        data-size={size}
        className={className}
        style={palette}
      >
        <span data-part="face" aria-hidden="true">
          {src ? <img src={src} alt="" /> : initials(name)}
        </span>
        <span data-part="name">{name}</span>
        {/* Полная должность остаётся в title: обрезка не должна её терять. */}
        <span data-part="role" title={role}>
          {role}
        </span>
      </div>
    </>
  )
}

import type { ComponentProps, CSSProperties } from "react"

export type Avatar005Badge = "verified" | "admin" | "new"

export type Avatar005Props = Omit<ComponentProps<"span">, "children"> & {
  name?: string
  src?: string
  badge?: Avatar005Badge
  size?: "sm" | "md" | "lg"
}

// Идея компонента: значок в углу аватара. Он вырезает под собой кружок фона
// через обводку цветом страницы, поэтому не сливается с фотографией любой
// яркости. Значение значка продублировано текстом для скринридера: галочка
// сама по себе ничего не сообщает.
const STYLES = `
:where([data-vibeui-block="avatar-005"]){
--vibeui-avatar-005-size:2.5rem;
--vibeui-avatar-005-hue:250;
--vibeui-avatar-005-bg:light-dark(oklch(0.92 0.05 var(--vibeui-avatar-005-hue)),oklch(0.34 0.065 var(--vibeui-avatar-005-hue)));
--vibeui-avatar-005-fg:light-dark(oklch(0.38 0.09 var(--vibeui-avatar-005-hue)),oklch(0.88 0.063 var(--vibeui-avatar-005-hue)));
--vibeui-avatar-005-badge:light-dark(oklch(0.58 0.15 250),oklch(0.72 0.15 250));
--vibeui-avatar-005-badge-fg:oklch(0.99 0.01 250);
--vibeui-avatar-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-005"]{
position:relative;display:inline-flex;flex:none;vertical-align:middle;
width:var(--vibeui-avatar-005-size);height:var(--vibeui-avatar-005-size);
font-family:var(--vibeui-avatar-005-font);
}
[data-vibeui-block="avatar-005"][data-size="sm"]{--vibeui-avatar-005-size:2rem}
[data-vibeui-block="avatar-005"][data-size="lg"]{--vibeui-avatar-005-size:3.5rem}
[data-vibeui-block="avatar-005"][data-badge="admin"]{--vibeui-avatar-005-badge:light-dark(oklch(0.68 0.16 75),oklch(0.82 0.16 75));--vibeui-avatar-005-badge-fg:oklch(0.24 0.06 75)}
[data-vibeui-block="avatar-005"][data-badge="new"]{--vibeui-avatar-005-badge:light-dark(oklch(0.62 0.17 152),oklch(0.76 0.17 152));--vibeui-avatar-005-badge-fg:oklch(0.99 0.01 152)}
[data-vibeui-block="avatar-005"] [data-part="shape"]{
display:flex;align-items:center;justify-content:center;overflow:hidden;
width:100%;height:100%;border-radius:9999px;
background:var(--vibeui-avatar-005-bg);color:var(--vibeui-avatar-005-fg);
font-size:calc(var(--vibeui-avatar-005-size) * 0.34);font-weight:650;line-height:1;user-select:none;
}
[data-vibeui-block="avatar-005"] img{width:100%;height:100%;object-fit:cover;display:block}
/* Вырез под значком: центр совпадает с его центром, радиус — его радиус
   плюс зазор. Обводка цветом подложки на фотографии выдаёт себя. */
[data-vibeui-block="avatar-005"] [data-part="shape"]{
mask-image:radial-gradient(circle calc(var(--vibeui-avatar-005-size) * 0.19 + 2px) at calc(100% - var(--vibeui-avatar-005-size) * 0.17) calc(100% - var(--vibeui-avatar-005-size) * 0.17),transparent 99%,#000 100%);
}
/* Значок сидит в вырезе портрета: на светлой и на тёмной фотографии он
   одинаково отделён от неё, а обводка цветом подложки — нет. */
[data-vibeui-block="avatar-005"] [data-part="badge"]{
position:absolute;right:-2%;bottom:-2%;
display:flex;align-items:center;justify-content:center;
width:calc(var(--vibeui-avatar-005-size) * 0.38);
height:calc(var(--vibeui-avatar-005-size) * 0.38);
border-radius:9999px;
background:var(--vibeui-avatar-005-badge);color:var(--vibeui-avatar-005-badge-fg);
font-size:calc(var(--vibeui-avatar-005-size) * 0.2);font-weight:700;line-height:1;
}
/* Галочка нарисована двумя бордюрами: иконочный пакет ради неё избыточен. */
[data-vibeui-block="avatar-005"] [data-part="tick"]{
width:0.3125rem;height:0.5rem;margin-top:-0.125rem;
border-right:2px solid currentColor;border-bottom:2px solid currentColor;
transform:rotate(45deg);
}
[data-vibeui-block="avatar-005"] [data-part="text"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-005"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-005"] *{animation:none!important;transition:none!important}}
`

const BADGE_TEXT: Record<Avatar005Badge, string> = {
  verified: "подтверждённый аккаунт",
  admin: "администратор",
  new: "новый участник",
}

// Оттенок из имени: FNV-1a, разложенный по двенадцати ступеням круга.
// Сумма кодов символов не годится — кириллические имена ложатся в один
// розовый сектор; ступени в 30° дают заведомо различимые цвета.
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
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

/**
 * Аватар со значком в углу: подтверждение, роль или новичок.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar005({
  name = "Марк Ильин",
  src = "",
  badge = "verified",
  size = "md",
  className,
  style,
  ...props
}: Avatar005Props) {
  const palette = {
    "--vibeui-avatar-005-hue": hue(name),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-005" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="avatar"
        data-vibeui-block="avatar-005"
        data-size={size}
        data-badge={badge}
        className={className}
        style={palette}
        role="img"
        aria-label={`${name}, ${BADGE_TEXT[badge]}`}
      >
        <span data-part="shape" aria-hidden="true">
          {src ? (
            <img src={src} alt="" loading="lazy" decoding="async" />
          ) : (
            initials(name)
          )}
        </span>
        <span data-part="badge" aria-hidden="true">
          {badge === "verified" ? (
            <span data-part="tick" />
          ) : badge === "admin" ? (
            "A"
          ) : (
            "N"
          )}
        </span>
      </span>
    </>
  )
}

import type { ComponentProps, CSSProperties } from "react"

export type Avatar013Props = Omit<ComponentProps<"span">, "children"> & {
  name?: string
  src?: string
  status?: "online" | "away" | "busy" | "offline"
  /** Роль значком сверху слева. `none` — значка нет. */
  role?: "none" | "owner" | "editor" | "reader"
  roleText?: Record<string, string>
  /** Подписи состояний: компонент несёт русские, проект подставляет свои. */
  statusText?: Record<string, string>
  size?: "sm" | "md" | "lg"
}

// Идея компонента: аватар с состоянием присутствия. Точка сидит в вырезе, а не
// поверх портрета: вырез делает mask-image, поэтому между точкой и краем
// остаётся ровный зазор на любом фоне — обводка цветом фона выдаёт себя, как
// только фон меняется. Состояние различается формой: круг, кольцо, квадрат и
// пустой контур; цвет один не читается при дальтонизме. Само состояние
// названо словом в подписи для скринридера, иначе точка остаётся немой.
const STYLES = `
:where([data-vibeui-block="avatar-013"]){
--vibeui-avatar-013-size:2.5rem;
--vibeui-avatar-013-dot:0.75rem;
--vibeui-avatar-013-online:light-dark(oklch(0.62 0.15 152),oklch(0.76 0.15 152));
--vibeui-avatar-013-away:light-dark(oklch(0.75 0.14 75),oklch(0.88 0.14 75));
--vibeui-avatar-013-busy:oklch(0.6 0.19 25);
--vibeui-avatar-013-offline:light-dark(oklch(0.7 0 265),oklch(0.84 0 265));
--vibeui-avatar-013-owner:light-dark(oklch(0.55 0.2 39.8),oklch(0.69 0.2 39.8));
--vibeui-avatar-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-013"]{
position:relative;display:inline-flex;flex:none;
width:var(--vibeui-avatar-013-size);height:var(--vibeui-avatar-013-size);
font-family:var(--vibeui-avatar-013-font);
}
[data-vibeui-block="avatar-013"] [data-part="face"]{
display:flex;align-items:center;justify-content:center;
width:100%;height:100%;border-radius:9999px;
background:light-dark(oklch(0.9 0.06 var(--vibeui-avatar-013-hue,265)),oklch(0.34 0.065 var(--vibeui-avatar-013-hue,265)));
color:light-dark(oklch(0.36 0.12 var(--vibeui-avatar-013-hue,265)),oklch(0.88 0.063 var(--vibeui-avatar-013-hue,265)));
font-size:calc(var(--vibeui-avatar-013-size) * 0.36);font-weight:700;
/* Вырез маской: зазор вокруг точки остаётся ровным на любом фоне. Центр
   выреза совпадает с центром точки, радиус — её радиус плюс зазор: иначе
   на фотографии видно, что дырка съехала и съела кусок портрета. */
mask-image:radial-gradient(circle calc(var(--vibeui-avatar-013-dot) * 0.707 + 2px) at calc(100% - var(--vibeui-avatar-013-dot) / 2) calc(100% - var(--vibeui-avatar-013-dot) / 2),transparent 99%,#000 100%);
}
/* Со значком роли вырезов два: слои маски пересекаются, поэтому дырка
   появляется в обоих углах, а не только в последнем. */
[data-vibeui-block="avatar-013"]:not([data-role="none"]) [data-part="face"]{
mask-image:
radial-gradient(circle calc(var(--vibeui-avatar-013-dot) * 0.707 + 2px) at calc(100% - var(--vibeui-avatar-013-dot) / 2) calc(100% - var(--vibeui-avatar-013-dot) / 2),transparent 99%,#000 100%),
radial-gradient(circle calc(var(--vibeui-avatar-013-dot) * 0.575 + 2px) at calc(var(--vibeui-avatar-013-dot) * 0.575) calc(var(--vibeui-avatar-013-dot) * 0.575),transparent 99%,#000 100%);
-webkit-mask-composite:source-in;
mask-composite:intersect;
}
[data-vibeui-block="avatar-013"] [data-part="face"] img{
width:100%;height:100%;border-radius:inherit;object-fit:cover;display:block;
}
/* Роль в противоположном углу и с буквой внутри: угол и знак различают её
   с присутствием. Форма круглая — под квадрат круглый вырез в маске оставлял
   бы неровный зазор по углам, а на фотографии это особенно заметно. */
[data-vibeui-block="avatar-013"] [data-part="role"]{
position:absolute;left:0;top:0;
display:flex;align-items:center;justify-content:center;
width:calc(var(--vibeui-avatar-013-dot) * 1.15);height:calc(var(--vibeui-avatar-013-dot) * 1.15);
border-radius:9999px;
background:var(--vibeui-avatar-013-owner);color:oklch(1 0 0);
font-size:calc(var(--vibeui-avatar-013-dot) * 0.72);font-weight:700;line-height:1;
}
[data-vibeui-block="avatar-013"][data-role="editor"] [data-part="role"]{background:light-dark(oklch(0.6 0.13 195),oklch(0.72 0.13 195))}
[data-vibeui-block="avatar-013"][data-role="reader"] [data-part="role"]{background:light-dark(oklch(0.62 0 265),oklch(0.66 0 265))}
[data-vibeui-block="avatar-013"] [data-part="dot"]{
position:absolute;right:0;bottom:0;
width:var(--vibeui-avatar-013-dot);height:var(--vibeui-avatar-013-dot);
border-radius:9999px;background:var(--vibeui-avatar-013-offline);
}
/* Форма, а не только цвет: круг, кольцо, квадрат и пустой контур. */
[data-vibeui-block="avatar-013"][data-status="online"] [data-part="dot"]{background:var(--vibeui-avatar-013-online)}
[data-vibeui-block="avatar-013"][data-status="away"] [data-part="dot"]{
background:none;box-shadow:inset 0 0 0 3px var(--vibeui-avatar-013-away);
}
[data-vibeui-block="avatar-013"][data-status="busy"] [data-part="dot"]{
border-radius:0.1875rem;background:var(--vibeui-avatar-013-busy);
}
[data-vibeui-block="avatar-013"][data-status="offline"] [data-part="dot"]{
background:none;box-shadow:inset 0 0 0 2px var(--vibeui-avatar-013-offline);
}
[data-vibeui-block="avatar-013"][data-size="sm"]{--vibeui-avatar-013-size:2rem;--vibeui-avatar-013-dot:0.625rem}
[data-vibeui-block="avatar-013"][data-size="lg"]{--vibeui-avatar-013-size:3.5rem;--vibeui-avatar-013-dot:0.875rem}
[data-vibeui-block="avatar-013"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-013"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-013"] *{animation:none!important;transition:none!important}}
`

const STATUS_LABEL = {
  online: "в сети",
  away: "отошёл",
  busy: "не беспокоить",
  offline: "не в сети",
} as const

const ROLE_LABEL = {
  none: "",
  owner: "владелец",
  editor: "редактор",
  reader: "читатель",
} as const

const ROLE_MARK = {
  none: "",
  owner: "В",
  editor: "Р",
  reader: "Ч",
} as const

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
 * Аватар с присутствием: точка в вырезе маски, состояние формой и словом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar013({
  name = "Анна Реброва",
  src,
  status = "online",
  statusText = STATUS_LABEL,
  role = "none",
  roleText = ROLE_LABEL,
  size = "md",
  className,
  style,
  ...props
}: Avatar013Props) {
  const palette = {
    "--vibeui-avatar-013-hue": hue(name),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-013" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="avatar"
        data-vibeui-block="avatar-013"
        data-status={status}
        data-role={role}
        data-size={size}
        className={className}
        style={palette}
      >
        <span data-part="face" aria-hidden="true">
          {src ? <img src={src} alt="" /> : initials(name)}
        </span>
        <span data-part="dot" aria-hidden="true" />
        {role !== "none" ? (
          <span data-part="role" aria-hidden="true">
            {ROLE_MARK[role]}
          </span>
        ) : null}
        {/* Состояние словом: точка сама по себе немая. */}
        <span data-part="sr">
          {name}, {statusText[status] ?? STATUS_LABEL[status]}
          {role !== "none" ? `, ${roleText[role] ?? ROLE_LABEL[role]}` : null}
        </span>
      </span>
    </>
  )
}

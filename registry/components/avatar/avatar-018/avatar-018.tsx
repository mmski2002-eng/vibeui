import type { ComponentProps, CSSProperties } from "react"

export type Avatar018Props = Omit<ComponentProps<"span">, "children"> & {
  name?: string
  src?: string
  role?: "owner" | "editor" | "reader" | "bot"
  /** Подписи ролей: компонент несёт русские, проект подставляет свои. */
  roleText?: Record<string, string>
  /**
   * Команда: если задана, цвет дуги считается из её названия, а не из роли.
   * У всех коллег он тогда одинаковый и меняется при переходе в другую команду.
   */
  team?: string
  size?: "sm" | "md" | "lg"
}

// Идея компонента: аватар с ролью в кольце. Роль показана дугой вокруг лица,
// а не цветной точкой: точка занята присутствием, и вешать на неё второй смысл
// нельзя. Дуга нарисована conic-gradient с маской: кольцо ровное на любом
// размере и не требует SVG. Роли различаются длиной дуги, а не только цветом —
// владелец полное кольцо, редактор три четверти, читатель половина. Роль
// названа словом в подписи, потому что дуга без текста непонятна.
const STYLES = `:where([data-vibeui-block="avatar-018"]){
--vibeui-avatar-018-size:2.5rem;
--vibeui-avatar-018-ring:0.1875rem;
--vibeui-avatar-018-arc:100%;
--vibeui-avatar-018-color:light-dark(oklch(0.287 0 0),oklch(0.894 0 0));
--vibeui-avatar-018-track:light-dark(oklch(0.92 0 265),oklch(0.3 0 265));
--vibeui-avatar-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-018"]{
display:inline-flex;align-items:center;gap:0.625rem;
font-family:var(--vibeui-avatar-018-font);
}
/* Дуга роли: conic-gradient с маской, кольцо ровное без SVG. */
[data-vibeui-block="avatar-018"] [data-part="ring"]{
display:grid;place-items:center;flex:none;
/* Кольцо занимает всю ячейку, а не размер портрета: иначе оно прижимается
   к левому верхнему углу и съезжает с лица. */
width:100%;height:100%;
border-radius:9999px;
background:conic-gradient(var(--vibeui-avatar-018-color) var(--vibeui-avatar-018-arc),var(--vibeui-avatar-018-track) 0);
mask:radial-gradient(farthest-side,transparent calc(100% - var(--vibeui-avatar-018-ring) - 1px),#000 calc(100% - var(--vibeui-avatar-018-ring)));
}
/* Размер задаёт портрет, дуга растёт наружу: в строке с обычными аватарами
   лица тогда одинаковые, а не мельче на толщину кольца. */
[data-vibeui-block="avatar-018"] [data-part="slot"]{
position:relative;display:grid;place-items:center;flex:none;box-sizing:border-box;
width:calc(var(--vibeui-avatar-018-size) + var(--vibeui-avatar-018-ring) * 2 + 0.25rem);
height:calc(var(--vibeui-avatar-018-size) + var(--vibeui-avatar-018-ring) * 2 + 0.25rem);
}
[data-vibeui-block="avatar-018"] [data-part="ring"]{position:absolute;inset:0}
[data-vibeui-block="avatar-018"] [data-part="face"]{
display:grid;place-items:center;
width:var(--vibeui-avatar-018-size);height:var(--vibeui-avatar-018-size);
border-radius:9999px;
background:light-dark(oklch(0.9 0.06 var(--vibeui-avatar-018-hue,265)),oklch(0.34 0.065 var(--vibeui-avatar-018-hue,265)));
color:light-dark(oklch(0.36 0.12 var(--vibeui-avatar-018-hue,265)),oklch(0.88 0.063 var(--vibeui-avatar-018-hue,265)));
font-size:calc(var(--vibeui-avatar-018-size) * 0.3);font-weight:700;
overflow:hidden;
}
[data-vibeui-block="avatar-018"] [data-part="face"] img{
width:100%;height:100%;border-radius:inherit;object-fit:cover;display:block;
}
/* Длина дуги различает роли: одного цвета мало. */
[data-vibeui-block="avatar-018"][data-role="owner"]{--vibeui-avatar-018-arc:100%;--vibeui-avatar-018-color:light-dark(oklch(0.55 0.2 262),oklch(0.69 0.2 262))}
[data-vibeui-block="avatar-018"][data-role="editor"]{--vibeui-avatar-018-arc:75%;--vibeui-avatar-018-color:light-dark(oklch(0.58 0.14 152),oklch(0.72 0.14 152))}
[data-vibeui-block="avatar-018"][data-role="reader"]{--vibeui-avatar-018-arc:50%;--vibeui-avatar-018-color:light-dark(oklch(0.7 0 265),oklch(0.42 0 265))}
[data-vibeui-block="avatar-018"][data-role="bot"]{--vibeui-avatar-018-arc:25%;--vibeui-avatar-018-color:light-dark(oklch(0.72 0.15 75),oklch(0.82 0.14 75))}
[data-vibeui-block="avatar-018"][data-size="sm"]{--vibeui-avatar-018-size:2rem;--vibeui-avatar-018-ring:0.125rem}
[data-vibeui-block="avatar-018"][data-size="lg"]{--vibeui-avatar-018-size:3.5rem;--vibeui-avatar-018-ring:0.25rem}
[data-vibeui-block="avatar-018"] [data-part="text"]{display:flex;flex-direction:column;gap:0.0625rem;min-width:0}
[data-vibeui-block="avatar-018"] [data-part="name"]{font-size:0.875rem;font-weight:650;color:light-dark(oklch(0.22 0 265),oklch(0.95 0 265))}
[data-vibeui-block="avatar-018"] [data-part="role"]{
font-size:0.6875rem;font-weight:650;color:var(--vibeui-avatar-018-color);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-018"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-018"] *{animation:none!important;transition:none!important}}
`

const ROLE_LABEL = {
  owner: "владелец",
  editor: "редактор",
  reader: "читатель",
  bot: "робот",
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
 * Аватар с ролью в кольце: длина дуги различает права, роль названа словом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar018({
  name = "Пётр Гай",
  src,
  role = "editor",
  roleText = ROLE_LABEL,
  team,
  size = "md",
  className,
  style,
  ...props
}: Avatar018Props) {
  const palette = {
    "--vibeui-avatar-018-hue": hue(name),
    // Цвет команды перебивает цвет роли, но длину дуги не трогает: права
    // по-прежнему видно формой, а не оттенком.
    ...(team
      ? {
          "--vibeui-avatar-018-color": `light-dark(oklch(0.55 0.17 ${hue(team)}),oklch(0.72 0.16 ${hue(team)}))`,
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-018" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="avatar"
        data-vibeui-block="avatar-018"
        data-role={role}
        data-size={size}
        className={className}
        style={palette}
      >
        <span data-part="slot">
          <span data-part="ring" aria-hidden="true" />
          <span data-part="face" aria-hidden="true">
            {src ? <img src={src} alt="" /> : initials(name)}
          </span>
        </span>
        <span data-part="text">
          <span data-part="name">{name}</span>
          {/* Цвет кольца команды сам по себе немой: команда названа словом. */}
          <span data-part="role">
            {roleText[role] ?? ROLE_LABEL[role]}
            {team ? ` · ${team}` : null}
          </span>
        </span>
      </span>
    </>
  )
}

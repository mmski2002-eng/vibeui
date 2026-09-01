import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Avatar027Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> & {
  name?: string
  status?: "online" | "away" | "offline"
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  statusText?: Record<string, string>
  role?: "owner" | "editor" | "reader"
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  roleText?: Record<string, string>
  /** Буква роли в значке: одна на язык, а не иконка из библиотеки. */
  roleMark?: Record<string, string>
  size?: "sm" | "md" | "lg"
}

// Идея компонента: два значка на одном аватаре, которые не спорят за смысл.
// Присутствие — круглая точка снизу справа, роль — квадрат с буквой сверху
// слева: разный угол и разная форма, поэтому «зелёный кружок» и «роль» не
// сливаются в одну догадку. Оба зазора вырезаны масками, но не одной: маска
// роли висит на обёртке, маска точки — на самом портрете, и вложение даёт две
// дырки без mask-composite, который поддержан не везде.
const STYLES = `:where([data-vibeui-block="avatar-027"]){
--vibeui-avatar-027-size:2.75rem;
--vibeui-avatar-027-dot:0.75rem;
--vibeui-avatar-027-mark:1.0625rem;
--vibeui-avatar-027-online:light-dark(oklch(0.62 0.15 152),oklch(0.76 0.15 152));
--vibeui-avatar-027-away:light-dark(oklch(0.75 0.14 75),oklch(0.88 0.14 75));
--vibeui-avatar-027-offline:light-dark(oklch(0.7 0.014 265),oklch(0.84 0.014 265));
--vibeui-avatar-027-role:light-dark(oklch(0.55 0.2 262),oklch(0.69 0.2 262));
--vibeui-avatar-027-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-027"]{
position:relative;display:inline-flex;flex:none;
width:var(--vibeui-avatar-027-size);height:var(--vibeui-avatar-027-size);
font-family:var(--vibeui-avatar-027-font);
}
/* Вложенные маски: обёртка режет угол под роль, портрет — угол под точку. */
[data-vibeui-block="avatar-027"] [data-part="cut"]{
display:block;width:100%;height:100%;
mask-image:radial-gradient(circle calc(var(--vibeui-avatar-027-mark) * 0.78) at calc(var(--vibeui-avatar-027-mark) * 0.3) calc(var(--vibeui-avatar-027-mark) * 0.3),transparent 99%,#000 100%);
}
[data-vibeui-block="avatar-027"] [data-part="face"]{
display:flex;align-items:center;justify-content:center;
width:100%;height:100%;border-radius:9999px;
background:oklch(0.9 0.06 var(--vibeui-avatar-027-hue,265));
color:oklch(0.36 0.12 var(--vibeui-avatar-027-hue,265));
font-size:calc(var(--vibeui-avatar-027-size) * 0.34);font-weight:700;line-height:1;
mask-image:radial-gradient(circle calc(var(--vibeui-avatar-027-dot) * 0.72) at calc(100% - var(--vibeui-avatar-027-dot) * 0.42) calc(100% - var(--vibeui-avatar-027-dot) * 0.42),transparent 99%,#000 100%);
}
/* Присутствие: круг снизу справа. */
[data-vibeui-block="avatar-027"] [data-part="dot"]{
position:absolute;right:0;bottom:0;
width:var(--vibeui-avatar-027-dot);height:var(--vibeui-avatar-027-dot);
border-radius:9999px;background:var(--vibeui-avatar-027-offline);
}
[data-vibeui-block="avatar-027"][data-status="online"] [data-part="dot"]{background:var(--vibeui-avatar-027-online)}
[data-vibeui-block="avatar-027"][data-status="away"] [data-part="dot"]{
background:none;box-shadow:inset 0 0 0 3px var(--vibeui-avatar-027-away);
}
[data-vibeui-block="avatar-027"][data-status="offline"] [data-part="dot"]{
background:none;box-shadow:inset 0 0 0 2px var(--vibeui-avatar-027-offline);
}
/* Роль: квадрат с буквой сверху слева — другая форма и другой угол. */
[data-vibeui-block="avatar-027"] [data-part="mark"]{
position:absolute;left:0;top:0;
display:grid;place-items:center;
width:var(--vibeui-avatar-027-mark);height:var(--vibeui-avatar-027-mark);
border-radius:0.25rem;
background:var(--vibeui-avatar-027-role);color:oklch(1 0 0);
font-size:calc(var(--vibeui-avatar-027-mark) * 0.6);font-weight:700;line-height:1;
}
[data-vibeui-block="avatar-027"][data-role="editor"] [data-part="mark"]{background:oklch(0.6 0.13 195)}
[data-vibeui-block="avatar-027"][data-role="reader"] [data-part="mark"]{background:light-dark(oklch(0.62 0.02 265),oklch(0.66 0.02 265))}
[data-vibeui-block="avatar-027"][data-size="sm"]{--vibeui-avatar-027-size:2.25rem;--vibeui-avatar-027-dot:0.625rem;--vibeui-avatar-027-mark:0.9375rem}
[data-vibeui-block="avatar-027"][data-size="lg"]{--vibeui-avatar-027-size:3.75rem;--vibeui-avatar-027-dot:0.9375rem;--vibeui-avatar-027-mark:1.375rem}
[data-vibeui-block="avatar-027"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-027"] *{animation:none!important;transition:none!important}}
`

const STATUS_LABEL: Record<string, string> = {
  online: "в сети",
  away: "отошёл",
  offline: "не в сети",
}

const ROLE_LABEL: Record<string, string> = {
  owner: "владелец",
  editor: "редактор",
  reader: "читатель",
}

const ROLE_MARK: Record<string, string> = {
  owner: "В",
  editor: "Р",
  reader: "Ч",
}

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
 * Аватар с двумя значками: присутствие кругом снизу, роль квадратом сверху.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar027({
  name = "Мария Лоза",
  status = "online",
  statusText = STATUS_LABEL,
  role = "owner",
  roleText = ROLE_LABEL,
  roleMark = ROLE_MARK,
  size = "md",
  className,
  style,
  ...props
}: Avatar027Props) {
  const palette = {
    "--vibeui-avatar-027-hue": hue(name),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-027" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="avatar-027"
        data-status={status}
        data-role={role}
        data-size={size}
        className={className}
        style={palette}
      >
        <span data-part="cut" aria-hidden="true">
          <span data-part="face">{initials(name)}</span>
        </span>
        <span data-part="mark" aria-hidden="true">
          {roleMark[role] ?? ROLE_MARK[role]}
        </span>
        <span data-part="dot" aria-hidden="true" />
        {/* Оба значка названы словами: буква и точка сами по себе немые. */}
        <span data-part="sr">
          {name}, {roleText[role] ?? ROLE_LABEL[role]},{" "}
          {statusText[status] ?? STATUS_LABEL[status]}
        </span>
      </span>
    </>
  )
}

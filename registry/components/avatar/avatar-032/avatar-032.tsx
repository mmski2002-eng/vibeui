import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Avatar032Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  name?: string
  team?: string
  size?: "sm" | "md" | "lg"
}

// Идея компонента: аватар в рамке цвета команды. Цвет считается из названия
// команды, а не из имени человека: люди переходят между командами, и рамка
// обязана меняться вместе с ними, оставаясь одинаковой у всех коллег. Кольцо
// вырезано radial-маской, поэтому зазор держится и на светлой, и на тёмной
// подложке. Название команды подписано плашкой под портретом: цвет рамки без
// легенды не расшифровывается, а легенды в списках обычно нет.
const STYLES = `
:where([data-vibeui-block="avatar-032"]){
--vibeui-avatar-032-size:3rem;
--vibeui-avatar-032-ring:0.1875rem;
--vibeui-avatar-032-gap:0.1875rem;
--vibeui-avatar-032-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-032"]{
display:inline-flex;flex-direction:column;align-items:center;gap:0.375rem;
box-sizing:border-box;font-family:var(--vibeui-avatar-032-font);
}
[data-vibeui-block="avatar-032"] *{box-sizing:border-box}
[data-vibeui-block="avatar-032"] [data-part="slot"]{
position:relative;display:grid;place-items:center;
width:calc(var(--vibeui-avatar-032-size) + (var(--vibeui-avatar-032-ring) + var(--vibeui-avatar-032-gap)) * 2);
height:calc(var(--vibeui-avatar-032-size) + (var(--vibeui-avatar-032-ring) + var(--vibeui-avatar-032-gap)) * 2);
}
/* Кольцо вырезано маской: зазор не зависит от цвета подложки. */
[data-vibeui-block="avatar-032"] [data-part="ring"]{
position:absolute;inset:0;border-radius:9999px;
background:oklch(0.58 0.17 var(--vibeui-avatar-032-team,265));
mask-image:radial-gradient(circle closest-side,transparent calc(100% - var(--vibeui-avatar-032-ring)),#000 calc(100% - var(--vibeui-avatar-032-ring)));
}
[data-vibeui-block="avatar-032"] [data-part="face"]{
display:grid;place-items:center;
width:var(--vibeui-avatar-032-size);height:var(--vibeui-avatar-032-size);
border-radius:9999px;
background:oklch(0.9 0.06 var(--vibeui-avatar-032-hue,265));
color:oklch(0.36 0.12 var(--vibeui-avatar-032-hue,265));
font-size:calc(var(--vibeui-avatar-032-size) * 0.34);font-weight:700;line-height:1;
}
/* Плашка словом: цвет рамки без легенды не расшифровывается. */
[data-vibeui-block="avatar-032"] [data-part="team"]{
max-width:8rem;padding:0.125rem 0.4375rem;border-radius:9999px;
background:oklch(0.94 0.045 var(--vibeui-avatar-032-team,265));
color:oklch(0.38 0.11 var(--vibeui-avatar-032-team,265));
font-size:0.6875rem;font-weight:650;line-height:1.4;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="avatar-032"][data-size="sm"]{--vibeui-avatar-032-size:2.25rem}
[data-vibeui-block="avatar-032"][data-size="lg"]{--vibeui-avatar-032-size:4rem;--vibeui-avatar-032-ring:0.25rem;--vibeui-avatar-032-gap:0.25rem}
[data-vibeui-block="avatar-032"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-032"] *{animation:none!important;transition:none!important}}
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
 * Аватар в рамке цвета команды: цвет выводится из названия команды и подписан словом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar032({
  name = "Пётр Гай",
  team = "Платформа",
  size = "md",
  className,
  style,
  ...props
}: Avatar032Props) {
  const palette = {
    "--vibeui-avatar-032-hue": hue(name),
    "--vibeui-avatar-032-team": hue(team),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-032" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="avatar-032"
        data-size={size}
        className={className}
        style={palette}
      >
        <span data-part="slot">
          <span data-part="ring" aria-hidden="true" />
          <span data-part="face" aria-hidden="true">
            {initials(name)}
          </span>
          <span data-part="sr">
            {name}, команда «{team}»
          </span>
        </span>
        <span data-part="team" aria-hidden="true">
          {team}
        </span>
      </div>
    </>
  )
}

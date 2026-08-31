import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Avatar020Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> & {
  name?: string
  count?: number
  label?: string
  size?: "sm" | "md" | "lg"
}

// Идея компонента: аватар со счётчиком непрочитанного. Число сидит в вырезе
// маски, как и точка присутствия, поэтому зазор ровный на любом фоне. Больше
// девяноста девяти показывается как «99+»: точное число в кружке нечитаемо и
// не влияет на решение — важно, что накопилось много. Ноль не рисуется вовсе:
// пустой кружок читается как «есть что-то новое». Число продублировано словами
// в подписи для скринридера, иначе оно останется немым значком.
const STYLES = `
:where([data-vibeui-block="avatar-020"]){
--vibeui-avatar-020-size:2.75rem;
--vibeui-avatar-020-badge:1.125rem;
--vibeui-avatar-020-color:oklch(0.56 0.19 25);
--vibeui-avatar-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-020"]{
position:relative;display:inline-flex;flex:none;
width:var(--vibeui-avatar-020-size);height:var(--vibeui-avatar-020-size);
font-family:var(--vibeui-avatar-020-font);
}
[data-vibeui-block="avatar-020"] [data-part="face"]{
display:grid;place-items:center;width:100%;height:100%;border-radius:9999px;
background:oklch(0.9 0.06 var(--vibeui-avatar-020-hue,265));
color:oklch(0.36 0.12 var(--vibeui-avatar-020-hue,265));
font-size:calc(var(--vibeui-avatar-020-size) * 0.36);font-weight:700;
}
/* Вырез маской под значок: зазор остаётся ровным на любом фоне. */
[data-vibeui-block="avatar-020"][data-badged="true"] [data-part="face"]{
mask-image:radial-gradient(circle calc(var(--vibeui-avatar-020-badge) * 0.72) at calc(100% - var(--vibeui-avatar-020-badge) * 0.3) calc(var(--vibeui-avatar-020-badge) * 0.3),transparent 99%,#000 100%);
}
[data-vibeui-block="avatar-020"] [data-part="count"]{
position:absolute;top:0;right:0;
display:inline-flex;align-items:center;justify-content:center;
min-width:var(--vibeui-avatar-020-badge);height:var(--vibeui-avatar-020-badge);
padding:0 0.25rem;box-sizing:border-box;border-radius:9999px;
background:var(--vibeui-avatar-020-color);color:oklch(1 0 0);
font-size:calc(var(--vibeui-avatar-020-badge) * 0.58);font-weight:700;line-height:1;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="avatar-020"][data-size="sm"]{--vibeui-avatar-020-size:2rem;--vibeui-avatar-020-badge:1rem}
[data-vibeui-block="avatar-020"][data-size="lg"]{--vibeui-avatar-020-size:3.5rem;--vibeui-avatar-020-badge:1.375rem}
[data-vibeui-block="avatar-020"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-020"] *{animation:none!important;transition:none!important}}
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
 * Аватар со счётчиком: значок в вырезе, «99+» вместо точного большого числа.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar020({
  name = "Илья Мохов",
  count = 12,
  label = "непрочитанных сообщения",
  size = "md",
  className,
  style,
  ...props
}: Avatar020Props) {
  // Ноль не рисуется: пустой кружок читается как «что-то новое».
  const badged = count > 0

  const palette = {
    "--vibeui-avatar-020-hue": hue(name),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-020" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="avatar-020"
        data-badged={badged ? "true" : "false"}
        data-size={size}
        className={className}
        style={palette}
      >
        <span data-part="face" aria-hidden="true">
          {initials(name)}
        </span>
        {badged ? (
          <span data-part="count" aria-hidden="true">
            {count > 99 ? "99+" : count}
          </span>
        ) : null}
        <span data-part="sr">
          {name}
          {badged ? `, ${count} ${label}` : ""}
        </span>
      </span>
    </>
  )
}

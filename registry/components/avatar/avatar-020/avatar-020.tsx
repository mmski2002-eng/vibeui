import type { ComponentProps, CSSProperties } from "react"

export type Avatar020Props = Omit<ComponentProps<"span">, "children"> & {
  name?: string
  src?: string
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
--vibeui-avatar-020-size:2.5rem;
--vibeui-avatar-020-badge:1.125rem;
--vibeui-avatar-020-color:light-dark(oklch(0.56 0.19 39.8),oklch(0.70 0.19 39.8));
--vibeui-avatar-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-020"]{
position:relative;display:inline-flex;flex:none;
width:var(--vibeui-avatar-020-size);height:var(--vibeui-avatar-020-size);
font-family:var(--vibeui-avatar-020-font);
}
[data-vibeui-block="avatar-020"] [data-part="face"]{
display:grid;place-items:center;width:100%;height:100%;border-radius:9999px;
background:light-dark(oklch(0.9 0.06 var(--vibeui-avatar-020-hue,265)),oklch(0.34 0.065 var(--vibeui-avatar-020-hue,265)));
color:light-dark(oklch(0.36 0.12 var(--vibeui-avatar-020-hue,265)),oklch(0.88 0.063 var(--vibeui-avatar-020-hue,265)));
font-size:calc(var(--vibeui-avatar-020-size) * 0.36);font-weight:700;
}
/* Вырез маской под значок: зазор остаётся ровным на любом фоне. Центр выреза
   совпадает с центром значка, радиус — его радиус плюс зазор: смещённая или
   раздутая дырка на однотонном фоне незаметна, а на фотографии выедает
   кусок портрета рядом со значком. */
[data-vibeui-block="avatar-020"][data-badged="true"] [data-part="face"]{
mask-image:radial-gradient(circle calc(var(--vibeui-avatar-020-badge) / 2 + 2px) at calc(100% - var(--vibeui-avatar-020-badge) / 2) calc(var(--vibeui-avatar-020-badge) / 2),transparent 99%,#000 100%);
}
/* Значок круглый при любом числе: вырез в маске круглый, и капсула «99+»
   вылезала бы из него чёрным серпом слева. Трёхзначное число садится
   уменьшенным кеглем. */
[data-vibeui-block="avatar-020"] [data-part="count"]{
position:absolute;top:0;right:0;
display:inline-flex;align-items:center;justify-content:center;
width:var(--vibeui-avatar-020-badge);height:var(--vibeui-avatar-020-badge);
box-sizing:border-box;border-radius:9999px;
background:var(--vibeui-avatar-020-color);color:oklch(1 0 0);
font-size:calc(var(--vibeui-avatar-020-badge) * 0.58);font-weight:700;line-height:1;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="avatar-020"] [data-part="count"][data-len="3"]{
font-size:calc(var(--vibeui-avatar-020-badge) * 0.42);letter-spacing:-0.02em;
}
[data-vibeui-block="avatar-020"][data-size="sm"]{--vibeui-avatar-020-size:2rem;--vibeui-avatar-020-badge:1rem}
[data-vibeui-block="avatar-020"][data-size="lg"]{--vibeui-avatar-020-size:3.5rem;--vibeui-avatar-020-badge:1.375rem}
[data-vibeui-block="avatar-020"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="avatar-020"] [data-part="face"]{overflow:hidden}
[data-vibeui-block="avatar-020"] [data-part="face"] img{width:100%;height:100%;border-radius:inherit;object-fit:cover;display:block}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-020"]{color-scheme:dark}
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
  name = "Марк Ильин",
  src,
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
        data-slot="avatar"
        data-vibeui-block="avatar-020"
        data-badged={badged ? "true" : "false"}
        data-size={size}
        className={className}
        style={palette}
      >
        <span data-part="face" aria-hidden="true">
          {src ? <img src={src} alt="" /> : initials(name)}
        </span>
        {badged ? (
          <span
            data-part="count"
            data-len={String(count > 99 ? "99+" : count).length}
            aria-hidden="true"
          >
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

import type { ComponentProps, CSSProperties } from "react"

export type Avatar021Props = Omit<ComponentProps<"button">, "children"> & {
  name?: string
  src?: string
  state?: "unseen" | "seen" | "none"
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  stateText?: Record<string, string>
  size?: "sm" | "md" | "lg"
}

// Идея компонента: аватар в рамке истории. Кольцо нарисовано conic-gradient и
// вырезано radial-маской, поэтому зазор между рамкой и портретом держится на
// любом фоне — обводка цветом подложки врёт, как только фон меняется.
// Просмотренная история не гаснет до невидимости: она теряет цвет и худеет,
// но остаётся кольцом, иначе непонятно, есть ли у человека история вообще.
const STYLES = `
:where([data-vibeui-block="avatar-021"]){
--vibeui-avatar-021-size:2.5rem;
--vibeui-avatar-021-ring:0.1875rem;
--vibeui-avatar-021-gap:0.1875rem;
--vibeui-avatar-021-seen:light-dark(oklch(0.78 0 265),oklch(0.45 0 265));
--vibeui-avatar-021-focus:light-dark(oklch(0.55 0.2 39.8),oklch(0.69 0.2 39.8));
--vibeui-avatar-021-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-021"]{
position:relative;display:inline-grid;place-items:center;
appearance:none;border:0;background:none;cursor:pointer;padding:0;
box-sizing:border-box;
width:calc(var(--vibeui-avatar-021-size) + (var(--vibeui-avatar-021-ring) + var(--vibeui-avatar-021-gap)) * 2);
height:calc(var(--vibeui-avatar-021-size) + (var(--vibeui-avatar-021-ring) + var(--vibeui-avatar-021-gap)) * 2);
font-family:var(--vibeui-avatar-021-font);
}
[data-vibeui-block="avatar-021"] *{box-sizing:border-box}
[data-vibeui-block="avatar-021"]:focus-visible{outline:2px solid var(--vibeui-avatar-021-focus);outline-offset:2px;border-radius:9999px}
/* Кольцо вырезано маской: зазор не зависит от цвета подложки. */
[data-vibeui-block="avatar-021"] [data-part="ring"]{
position:absolute;inset:0;border-radius:9999px;
background:conic-gradient(from -20deg,oklch(0.7 0.19 25),oklch(0.75 0.17 60),oklch(0.68 0.17 310),oklch(0.62 0.18 265),oklch(0.7 0.19 25));
mask-image:radial-gradient(circle closest-side,transparent calc(100% - var(--vibeui-avatar-021-ring)),#000 calc(100% - var(--vibeui-avatar-021-ring)));
transition:transform .18s ease;
}
[data-vibeui-block="avatar-021"][data-state="seen"] [data-part="ring"]{
--vibeui-avatar-021-ring:0.09375rem;
background:var(--vibeui-avatar-021-seen);
}
[data-vibeui-block="avatar-021"][data-state="none"] [data-part="ring"]{display:none}
[data-vibeui-block="avatar-021"]:hover [data-part="ring"]{transform:scale(1.04)}
[data-vibeui-block="avatar-021"] [data-part="face"]{
display:grid;place-items:center;
width:var(--vibeui-avatar-021-size);height:var(--vibeui-avatar-021-size);
border-radius:9999px;
background:light-dark(oklch(0.9 0.06 var(--vibeui-avatar-021-hue,265)),oklch(0.34 0.065 var(--vibeui-avatar-021-hue,265)));
color:light-dark(oklch(0.36 0.12 var(--vibeui-avatar-021-hue,265)),oklch(0.88 0.063 var(--vibeui-avatar-021-hue,265)));
font-size:calc(var(--vibeui-avatar-021-size) * 0.34);font-weight:700;line-height:1;
}
[data-vibeui-block="avatar-021"][data-size="sm"]{--vibeui-avatar-021-size:2rem}
[data-vibeui-block="avatar-021"][data-size="lg"]{--vibeui-avatar-021-size:3.5rem;--vibeui-avatar-021-ring:0.25rem;--vibeui-avatar-021-gap:0.25rem}
[data-vibeui-block="avatar-021"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="avatar-021"] [data-part="face"]{overflow:hidden}
[data-vibeui-block="avatar-021"] [data-part="face"] img{width:100%;height:100%;border-radius:inherit;object-fit:cover;display:block}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-021"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-021"] *{animation:none!important;transition:none!important}}
`

const STATE_LABEL: Record<string, string> = {
  unseen: "есть новая история",
  seen: "история просмотрена",
  none: "историй нет",
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
 * Аватар в рамке истории: кольцо-градиент, просмотренное состояние тоньше и без цвета.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar021({
  name = "Анна Реброва",
  src,
  state = "unseen",
  stateText = STATE_LABEL,
  size = "md",
  type = "button",
  className,
  style,
  ...props
}: Avatar021Props) {
  const palette = {
    "--vibeui-avatar-021-hue": hue(name),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-021" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="avatar"
        data-vibeui-block="avatar-021"
        data-state={state}
        data-size={size}
        className={className}
        style={palette}
      >
        <span data-part="ring" aria-hidden="true" />
        <span data-part="face" aria-hidden="true">
          {src ? <img src={src} alt="" /> : initials(name)}
        </span>
        {/* Состояние словом: цвет кольца скринридер не читает. */}
        <span data-part="sr">
          {name}, {stateText[state] ?? STATE_LABEL[state]}
        </span>
      </button>
    </>
  )
}

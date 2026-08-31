import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Avatar014Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> & {
  name?: string
  role?: string
  shape?: "hex" | "squircle" | "circle"
  size?: "sm" | "md" | "lg"
}

// Идея компонента: аватар нестандартной формы. Шестиугольник и «сквиркл»
// сделаны свойством clip-path, а не картинкой-маской: форма остаётся резкой на
// любом масштабе и не тянет файл. Инициалы центрируются по прямоугольнику, а
// не по видимой фигуре, поэтому у шестиугольника задан небольшой оптический
// сдвиг — без него буквы кажутся смещёнными вверх. Обводка нарисована
// подложкой под clip-path: обычный border режется вместе с фигурой.
const STYLES = `
:where([data-vibeui-block="avatar-014"]){
--vibeui-avatar-014-size:3rem;
--vibeui-avatar-014-ring:oklch(0.9 0.006 265);
--vibeui-avatar-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-014"]{
display:inline-flex;align-items:center;gap:0.625rem;
font-family:var(--vibeui-avatar-014-font);
}
/* Обводка — подложка под clip-path: обычный border срезается вместе с фигурой. */
[data-vibeui-block="avatar-014"] [data-part="frame"]{
display:grid;place-items:center;flex:none;
width:var(--vibeui-avatar-014-size);height:var(--vibeui-avatar-014-size);
background:var(--vibeui-avatar-014-ring);
}
[data-vibeui-block="avatar-014"] [data-part="face"]{
display:grid;place-items:center;
width:calc(100% - 2px);height:calc(100% - 2px);
background:oklch(0.9 0.07 var(--vibeui-avatar-014-hue,265));
color:oklch(0.35 0.13 var(--vibeui-avatar-014-hue,265));
font-size:calc(var(--vibeui-avatar-014-size) * 0.34);font-weight:700;line-height:1;
}
[data-vibeui-block="avatar-014"] [data-part="frame"],
[data-vibeui-block="avatar-014"] [data-part="face"]{grid-area:1 / 1}
[data-vibeui-block="avatar-014"] [data-part="frame"]{display:grid}
/* Формы заданы clip-path: остаются резкими на любом масштабе. */
[data-vibeui-block="avatar-014"][data-shape="hex"] [data-part="frame"],
[data-vibeui-block="avatar-014"][data-shape="hex"] [data-part="face"]{
clip-path:polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%);
}
/* Оптический сдвиг: у шестиугольника буквы иначе кажутся выше центра. */
[data-vibeui-block="avatar-014"][data-shape="hex"] [data-part="face"]{padding-top:0.0625rem}
[data-vibeui-block="avatar-014"][data-shape="squircle"] [data-part="frame"],
[data-vibeui-block="avatar-014"][data-shape="squircle"] [data-part="face"]{
border-radius:34%;
}
[data-vibeui-block="avatar-014"][data-shape="circle"] [data-part="frame"],
[data-vibeui-block="avatar-014"][data-shape="circle"] [data-part="face"]{
border-radius:9999px;
}
[data-vibeui-block="avatar-014"][data-size="sm"]{--vibeui-avatar-014-size:2.25rem}
[data-vibeui-block="avatar-014"][data-size="lg"]{--vibeui-avatar-014-size:4rem}
[data-vibeui-block="avatar-014"] [data-part="text"]{display:flex;flex-direction:column;gap:0.0625rem;min-width:0}
[data-vibeui-block="avatar-014"] [data-part="name"]{font-size:0.875rem;font-weight:650}
[data-vibeui-block="avatar-014"] [data-part="role"]{font-size:0.75rem;color:oklch(0.55 0.014 265)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-014"] *{animation:none!important;transition:none!important}}
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
 * Аватар нестандартной формы: шестиугольник и «сквиркл» на clip-path.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar014({
  name = "Илья Мохов",
  role = "Фронтенд",
  shape = "hex",
  size = "md",
  className,
  style,
  ...props
}: Avatar014Props) {
  const palette = {
    "--vibeui-avatar-014-hue": hue(name),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-014" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="avatar-014"
        data-shape={shape}
        data-size={size}
        className={className}
        style={palette}
      >
        <span data-part="frame" aria-hidden="true">
          <span data-part="face">{initials(name)}</span>
        </span>
        <span data-part="text">
          <span data-part="name">{name}</span>
          {role ? <span data-part="role">{role}</span> : null}
        </span>
      </span>
    </>
  )
}

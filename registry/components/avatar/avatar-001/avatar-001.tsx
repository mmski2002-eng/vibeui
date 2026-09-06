import type { ComponentProps, CSSProperties } from "react"

export type Avatar001Status = "none" | "online" | "away" | "busy"

export type Avatar001Props = Omit<ComponentProps<"span">, "children"> & {
  name?: string
  /** Ссылка на фото. Без неё показываются инициалы. */
  src?: string
  size?: "sm" | "md" | "lg"
  status?: Avatar001Status
}

// Идея компонента: базовый аватар — фотография, точка присутствия и три
// размера. Фотография есть не у всех, поэтому запасной вариант не серый
// силуэт, а инициалы на фоне, выведенном из имени: в списке из сорока человек
// такие кружки остаются различимыми, и один человек всегда одного цвета — на
// любой странице и после перезагрузки.
const STYLES = `
:where([data-vibeui-block="avatar-001"]){
--vibeui-avatar-001-size:2.5rem;
--vibeui-avatar-001-hue:250;
--vibeui-avatar-001-bg:light-dark(oklch(0.92 0.05 var(--vibeui-avatar-001-hue)),oklch(0.34 0.065 var(--vibeui-avatar-001-hue)));
--vibeui-avatar-001-fg:light-dark(oklch(0.38 0.09 var(--vibeui-avatar-001-hue)),oklch(0.88 0.063 var(--vibeui-avatar-001-hue)));
--vibeui-avatar-001-ring:light-dark(oklch(1 0 0),oklch(0.19 0 265));
--vibeui-avatar-001-status:light-dark(oklch(0.63 0.17 152),oklch(0.77 0.17 152));
--vibeui-avatar-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-001"]{
position:relative;display:inline-flex;flex:none;
width:var(--vibeui-avatar-001-size);height:var(--vibeui-avatar-001-size);
vertical-align:middle;
}
[data-vibeui-block="avatar-001"][data-size="sm"]{--vibeui-avatar-001-size:2rem}
[data-vibeui-block="avatar-001"][data-size="lg"]{--vibeui-avatar-001-size:3.5rem}
[data-vibeui-block="avatar-001"] [data-part="shape"]{
display:flex;align-items:center;justify-content:center;
width:100%;height:100%;overflow:hidden;border-radius:9999px;
background:var(--vibeui-avatar-001-bg);color:var(--vibeui-avatar-001-fg);
font-family:var(--vibeui-avatar-001-font);
font-size:calc(var(--vibeui-avatar-001-size) * 0.36);
font-weight:600;letter-spacing:0.01em;line-height:1;
user-select:none;
}
[data-vibeui-block="avatar-001"] img{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="avatar-001"] [data-part="status"]{
position:absolute;right:0;bottom:0;
width:calc(var(--vibeui-avatar-001-size) * 0.28);
height:calc(var(--vibeui-avatar-001-size) * 0.28);
border-radius:9999px;
background:var(--vibeui-avatar-001-status);
box-shadow:0 0 0 2px var(--vibeui-avatar-001-ring);
}
[data-vibeui-block="avatar-001"][data-status="away"]{--vibeui-avatar-001-status:oklch(0.75 0.16 75)}
[data-vibeui-block="avatar-001"][data-status="busy"]{--vibeui-avatar-001-status:oklch(0.58 0.2 25)}
/* Имя для скринридера: инициалы он прочитал бы как набор букв. */
[data-vibeui-block="avatar-001"] [data-part="name"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-001"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-001"] *{animation:none!important;transition:none!important}}
`

/** Инициалы: первые буквы двух первых слов имени. */
function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
}

/**
 * Оттенок из имени: FNV-1a, разложенный по двенадцати ступеням круга. Одно и
 * то же имя всегда даёт один и тот же цвет. Ступени вместо непрерывного круга
 * нужны потому, что кириллические имена по сумме кодов ложатся в один сектор
 * и весь список получается розовым.
 */
function hueOf(name: string): number {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

/**
 * Базовый аватар: фотография, точка присутствия и три размера.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar001({
  name = "Анна Реброва",
  src,
  size = "md",
  status = "online",
  className,
  style,
  ...props
}: Avatar001Props) {
  const palette = {
    "--vibeui-avatar-001-hue": hueOf(name),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-001" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="avatar"
        data-vibeui-block="avatar-001"
        data-size={size}
        data-status={status}
        className={className}
        style={palette}
      >
        <span data-part="shape">
          {src ? (
            <img src={src} alt={name} />
          ) : (
            <span aria-hidden="true">{initialsOf(name)}</span>
          )}
        </span>
        {status !== "none" ? (
          <span data-part="status" aria-hidden="true" />
        ) : null}
        <span data-part="name">{name}</span>
      </span>
    </>
  )
}

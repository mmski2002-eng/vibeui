import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Avatar002Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> & {
  name?: string
  src?: string
  size?: "sm" | "md" | "lg"
}

// Идея компонента: фотография с запасным вариантом без JS. Инициалы лежат
// подложкой, фотография — слоем поверх, и у неё alt="" — иначе при битой
// ссылке браузер нарисует поверх инициалов значок сломанной картинки и
// прочитает имя дважды. Имя отдаётся скринридеру отдельной скрытой строкой.
const STYLES = `
:where([data-vibeui-block="avatar-002"]){
--vibeui-avatar-002-size:3rem;
--vibeui-avatar-002-hue:250;
--vibeui-avatar-002-bg:oklch(0.92 0.05 var(--vibeui-avatar-002-hue));
--vibeui-avatar-002-fg:oklch(0.38 0.09 var(--vibeui-avatar-002-hue));
--vibeui-avatar-002-ring:oklch(1 0 0 / 65%);
--vibeui-avatar-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-002"]{
position:relative;display:inline-flex;flex:none;vertical-align:middle;
width:var(--vibeui-avatar-002-size);height:var(--vibeui-avatar-002-size);
}
[data-vibeui-block="avatar-002"][data-size="sm"]{--vibeui-avatar-002-size:2.25rem}
[data-vibeui-block="avatar-002"][data-size="lg"]{--vibeui-avatar-002-size:4rem}
/* Инициалы — подложка: если фотография не загрузится, останутся они. */
[data-vibeui-block="avatar-002"] [data-part="fallback"]{
position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
border-radius:9999px;background:var(--vibeui-avatar-002-bg);color:var(--vibeui-avatar-002-fg);
font-family:var(--vibeui-avatar-002-font);
font-size:calc(var(--vibeui-avatar-002-size) * 0.34);font-weight:650;line-height:1;
user-select:none;
}
[data-vibeui-block="avatar-002"] img{
position:relative;width:100%;height:100%;display:block;object-fit:cover;
border-radius:9999px;box-shadow:inset 0 0 0 1px var(--vibeui-avatar-002-ring);
}
[data-vibeui-block="avatar-002"] [data-part="name"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-002"] *{animation:none!important;transition:none!important}}
`

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
 * Фотография с запасными инициалами: битая ссылка не оставляет пустоты.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar002({
  name = "Анна Петрова",
  src = "",
  size = "md",
  className,
  style,
  ...props
}: Avatar002Props) {
  const palette = {
    "--vibeui-avatar-002-hue": hue(name),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-002" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="avatar-002"
        data-size={size}
        className={className}
        style={palette}
      >
        <span data-part="fallback" aria-hidden="true">
          {initials(name)}
        </span>
        {src ? <img src={src} alt="" loading="lazy" decoding="async" /> : null}
        <span data-part="name">{name}</span>
      </span>
    </>
  )
}

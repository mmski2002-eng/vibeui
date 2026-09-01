import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Avatar011Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> & {
  name?: string
  src?: string
  size?: "sm" | "md" | "lg"
  accent?: string
}

// Идея компонента: аватар организации, а не человека. Форма — скруглённый
// квадрат: в списке из людей и компаний круг и квадрат различаются боковым
// зрением, а цвет и буква — нет. Монограмма берёт первую букву названия,
// артикли и кавычки при этом пропускаются.
const STYLES = `
:where([data-vibeui-block="avatar-011"]){
--vibeui-avatar-011-size:2.75rem;
--vibeui-avatar-011-accent:light-dark(oklch(0.55 0.13 255),oklch(0.69 0.13 255));
--vibeui-avatar-011-surface:light-dark(oklch(1 0 0),oklch(0.2 0.01 265));
--vibeui-avatar-011-bg:color-mix(in oklab,var(--vibeui-avatar-011-accent) 16%,var(--vibeui-avatar-011-surface));
--vibeui-avatar-011-fg:color-mix(in oklab,var(--vibeui-avatar-011-accent) 75%,light-dark(oklch(0.2 0.02 265),oklch(0.96 0.01 265)));
--vibeui-avatar-011-border:color-mix(in oklab,var(--vibeui-avatar-011-accent) 28%,var(--vibeui-avatar-011-surface));
--vibeui-avatar-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-011"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;vertical-align:middle;
box-sizing:border-box;
width:var(--vibeui-avatar-011-size);height:var(--vibeui-avatar-011-size);
/* Скруглённый квадрат: компания в списке людей должна быть видна формой. */
border-radius:calc(var(--vibeui-avatar-011-size) * 0.26);
border:1px solid var(--vibeui-avatar-011-border);
overflow:hidden;
background:var(--vibeui-avatar-011-bg);color:var(--vibeui-avatar-011-fg);
font-family:var(--vibeui-avatar-011-font);
font-size:calc(var(--vibeui-avatar-011-size) * 0.4);font-weight:700;line-height:1;
letter-spacing:-0.02em;user-select:none;
}
[data-vibeui-block="avatar-011"][data-size="sm"]{--vibeui-avatar-011-size:2.25rem}
[data-vibeui-block="avatar-011"][data-size="lg"]{--vibeui-avatar-011-size:3.5rem}
[data-vibeui-block="avatar-011"] img{width:100%;height:100%;object-fit:contain;display:block;padding:12%;box-sizing:border-box}
[data-vibeui-block="avatar-011"] [data-part="text"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-011"] *{animation:none!important;transition:none!important}}
`

// Кавычки и артикли не несут смысла в монограмме: «Полёт» должен дать «П».
function monogram(name: string) {
  const clean = name.replace(/[«»"'`]/g, "").trim()
  return clean ? clean[0].toUpperCase() : "?"
}

/**
 * Аватар организации: скруглённый квадрат и монограмма вместо инициалов.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar011({
  name = "Студия «Полёт»",
  src = "",
  size = "md",
  accent,
  className,
  style,
  ...props
}: Avatar011Props) {
  const palette = {
    ...(accent ? { "--vibeui-avatar-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-011" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="avatar-011"
        data-size={size}
        className={className}
        style={palette}
        role="img"
        aria-label={name}
      >
        {src ? (
          <img src={src} alt="" loading="lazy" decoding="async" />
        ) : (
          <span aria-hidden="true">{monogram(name)}</span>
        )}
      </span>
    </>
  )
}

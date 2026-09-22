import type { ComponentProps, CSSProperties } from "react"

export type Badge028Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  logo?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока testimonials-015, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="badge-028"]){
--vibeui-badge-028-muted:light-dark(oklch(0.48 0 0),oklch(0.71 0 0));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-028"]{color-scheme:dark}
[data-vibeui-block="badge-028"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="badge-028"] *{box-sizing:border-box}
[data-vibeui-block="badge-028"]{color:var(--vibeui-badge-028-muted);
font-size:1.0625rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
opacity:0.85;white-space:nowrap;}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-028"] *{animation:none!important;transition:none!important}}
`

/** Название компании как текстовый логотип для ряда клиентов. */
export function Badge028({
  logo = "Северный путь",
  accent,
  className,
  style,
  ...props
}: Badge028Props) {
  const palette = {
    ...(accent ? { "--vibeui-badge-028-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-028" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="badge"
        data-vibeui-block="badge-028"
        className={className}
        style={palette}
      >
        {logo}
      </li>
    </>
  )
}

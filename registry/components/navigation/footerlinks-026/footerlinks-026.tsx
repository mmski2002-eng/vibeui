import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks026Link = {
  label: string
  href: string
}

export type Footerlinks026Props = Omit<ComponentProps<"ul">, "title" | "children"> & {
  links?: readonly Footerlinks026Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-044, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-026"]){

}
[data-vibeui-block="footerlinks-026"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="footerlinks-026"] *{box-sizing:border-box}

@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-026"] *{animation:none!important;transition:none!important}}
`

/** Строка навигации подвала с засечками и орнаментом-разделителем. */
export function Footerlinks026({
  links = [ { label: "Тексты", href: "#texts" }, { label: "Книга", href: "#book" }, { label: "Встречи", href: "#events" }, { label: "Письма", href: "#letters" }, { label: "Издателям", href: "#publishers" }, ],
  accent,
  className,
  style,
  ...props
}: Footerlinks026Props) {
  const palette = {
    ...(accent ? { "--vibeui-footerlinks-026-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-026" precedence="medium">
        {STYLES}
      </style>
      <ul
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-026"
        className={className}
        style={palette}
      >
        {links.map((link) => (
          <li key={link.href + link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </>
  )
}

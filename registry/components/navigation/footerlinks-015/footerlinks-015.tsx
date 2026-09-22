import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks015Link = {
  label: string
  href: string
}

export type Footerlinks015Props = Omit<ComponentProps<"ul">, "title" | "children"> & {
  links?: readonly Footerlinks015Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

const DEFAULT_LINKS: Footerlinks015Link[] = [
  { label: "Политика конфиденциальности", href: "#" },
  { label: "Договор оферты", href: "#" },
]

// Часть блока footer-019, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-015"]){
--vibeui-footerlinks-015-accent:#f2f2f2;
--vibeui-footerlinks-015-fg:#f2f2f2;
}
[data-vibeui-block="footerlinks-015"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="footerlinks-015"] *{box-sizing:border-box}
[data-vibeui-block="footerlinks-015"]{display:flex;flex-wrap:wrap;gap:.5rem 1.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="footerlinks-015"] a{color:var(--vibeui-footerlinks-015-fg);opacity:.85}
[data-vibeui-block="footerlinks-015"] a:hover{opacity:1;color:var(--vibeui-footerlinks-015-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-015"] *{animation:none!important;transition:none!important}}
`

/** Горизонтальный ряд ссылок подвала: список без маркеров, ссылки приглушённые. */
export function Footerlinks015({
  links = DEFAULT_LINKS,
  accent,
  className,
  style,
  ...props
}: Footerlinks015Props) {
  const palette = {
    ...(accent ? { "--vibeui-footerlinks-015-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-015" precedence="medium">
        {STYLES}
      </style>
      <ul
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-015"
        className={className}
        style={palette}
      >
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </>
  )
}

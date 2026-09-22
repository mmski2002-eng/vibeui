import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks024Link = {
  label: string
  href: string
}

export type Footerlinks024Props = Omit<ComponentProps<"ul">, "title" | "children"> & {
  legal?: readonly Footerlinks024Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-031, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-024"]){
--vibeui-footerlinks-024-fg:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footerlinks-024"]{color-scheme:dark}
[data-vibeui-block="footerlinks-024"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="footerlinks-024"] *{box-sizing:border-box}
[data-vibeui-block="footerlinks-024"]{display:flex;gap:1rem;flex-wrap:wrap;margin:0;padding:0;list-style:none}
[data-vibeui-block="footerlinks-024"] a{color:inherit;text-decoration:none}
[data-vibeui-block="footerlinks-024"] a:hover{color:var(--vibeui-footerlinks-024-fg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-024"] *{animation:none!important;transition:none!important}}
`

/** Строка юридических ссылок подвала приложения мелким кеглем. */
export function Footerlinks024({
  legal = [ { label: "Конфиденциальность", href: "#" }, { label: "Условия", href: "#" }, { label: "Поддержка", href: "#" }, ],
  accent,
  className,
  style,
  ...props
}: Footerlinks024Props) {
  const palette = {
    ...(accent ? { "--vibeui-footerlinks-024-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-024" precedence="medium">
        {STYLES}
      </style>
      <ul
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-024"
        className={className}
        style={palette}
      >
        {legal.map((link) => (
          <li key={link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </>
  )
}

import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks017Link = {
  label: string
  href: string
}

export type Footerlinks017Props = Omit<ComponentProps<"nav">, "title" | "children"> & {
  links?: Footerlinks017Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

const DEFAULT_LINKS: Footerlinks017Link[] = [
  { label: "Возможности", href: "#features" },
  { label: "Тарифы", href: "#pricing" },
  { label: "Документация", href: "#docs" },
  { label: "Блог", href: "#blog" },
  { label: "Контакты", href: "#contacts" },
]

// Часть блока footer-013, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-017"]){
--vibeui-footerlinks-017-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-footerlinks-017-dur-2:180ms;
--vibeui-footerlinks-017-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footerlinks-017"]{color-scheme:dark}
[data-vibeui-block="footerlinks-017"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="footerlinks-017"] *{box-sizing:border-box}
[data-vibeui-block="footerlinks-017"] ul{margin:0;padding:0;list-style:none;
display:flex;flex-wrap:wrap;justify-content:center;gap:0.5rem 1.5rem;}
[data-vibeui-block="footerlinks-017"] a{color:var(--vibeui-footerlinks-017-muted);text-decoration:none;font-size:0.9375rem;
transition:color var(--vibeui-footerlinks-017-dur-2) ease;}
[data-vibeui-block="footerlinks-017"] a:hover{color:var(--vibeui-footerlinks-017-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-017"] *{animation:none!important;transition:none!important}}
`

/** Одна строка ссылок подвала с разделителями-точками. */
export function Footerlinks017({
  links = DEFAULT_LINKS,
  accent,
  className,
  style,
  ...props
}: Footerlinks017Props) {
  const palette = {
    ...(accent ? { "--vibeui-footerlinks-017-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-017" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-017" aria-label="Подвал"
        className={className}
        style={palette}
      >
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}

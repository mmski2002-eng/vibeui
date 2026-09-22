import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks008Link = {
  label: string
  href: string
}

export type Footerlinks008Props = Omit<ComponentProps<"nav">, "title" | "children"> & {
  title?: string
  links?: readonly Footerlinks008Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-033, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-008"]){
--vibeui-footerlinks-008-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footerlinks-008-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footerlinks-008-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footerlinks-008"]{color-scheme:dark}
[data-vibeui-block="footerlinks-008"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="footerlinks-008"] *{box-sizing:border-box}
[data-vibeui-block="footerlinks-008"] h3{margin:0 0 .9rem;font-family:var(--vibeui-footerlinks-008-mono);font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-footerlinks-008-accent)}
[data-vibeui-block="footerlinks-008"] ul{margin:0;padding:0;list-style:none;display:grid;gap:.5rem}
[data-vibeui-block="footerlinks-008"] a{color:var(--vibeui-footerlinks-008-fg);text-decoration:none;opacity:.8;transition:opacity .2s,color .2s}
[data-vibeui-block="footerlinks-008"] a:hover{opacity:1;color:var(--vibeui-footerlinks-008-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-008"] *{animation:none!important;transition:none!important}}
`

/** Колонка подвала: заголовок моноширинной капителью, ссылки с отступом. */
export function Footerlinks008({
  title = "Услуги",
  links = [{ label: "Керамика", href: "#services" }, { label: "Плёнка PPF", href: "#services" }, { label: "Полировка", href: "#services" }, { label: "Химчистка", href: "#services" }],
  accent,
  className,
  style,
  ...props
}: Footerlinks008Props) {
  const palette = {
    ...(accent ? { "--vibeui-footerlinks-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-008" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-008" aria-label={title}
        className={className}
        style={palette}
      >
        <h3>{title}</h3>
        <ul>
          {links.map((link) => (
            <li key={link.label}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}

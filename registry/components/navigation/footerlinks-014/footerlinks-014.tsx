import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks014Link = {
  label: string
  href: string
}

export type Footerlinks014Props = Omit<ComponentProps<"nav">, "title" | "children"> & {
  title?: string
  links?: readonly Footerlinks014Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-042, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-014"]){
--vibeui-footerlinks-014-accent:light-dark(#111111,#f2ede4);
--vibeui-footerlinks-014-fg:light-dark(#111111,#f2ede4);
--vibeui-footerlinks-014-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-footerlinks-014-muted:color-mix(in oklab,var(--vibeui-footerlinks-014-fg) 60%,var(--vibeui-footerlinks-014-bg));
--vibeui-footerlinks-014-bg:light-dark(#ffffff,#0a0a0a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footerlinks-014"]{color-scheme:dark}
[data-vibeui-block="footerlinks-014"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="footerlinks-014"] *{box-sizing:border-box}
[data-vibeui-block="footerlinks-014"] h3{margin:0 0 .8rem;font-family:var(--vibeui-footerlinks-014-mono);font-weight:500;font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-footerlinks-014-muted)}
[data-vibeui-block="footerlinks-014"] ul{margin:0;padding:0;list-style:none;display:grid;gap:.45rem}
[data-vibeui-block="footerlinks-014"] a{color:var(--vibeui-footerlinks-014-fg);text-decoration:none;transition:color .2s}
[data-vibeui-block="footerlinks-014"] a:hover{color:var(--vibeui-footerlinks-014-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-014"] *{animation:none!important;transition:none!important}}
`

/** Колонка подвала: мелкий моно-заголовок капителью и ссылки с плотным интерлиньяжем. */
export function Footerlinks014({
  title = "Продукт",
  links = [{ label: "Рассвет", href: "#dawn" }, { label: "Возможности", href: "#features" }, { label: "Устройство", href: "#inside" }, { label: "Характеристики", href: "#specs" }],
  accent,
  className,
  style,
  ...props
}: Footerlinks014Props) {
  const palette = {
    ...(accent ? { "--vibeui-footerlinks-014-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-014" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-014" aria-label={title}
        className={className}
        style={palette}
      >
        <h3>{title}</h3>
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

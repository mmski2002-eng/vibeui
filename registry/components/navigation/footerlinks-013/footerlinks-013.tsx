import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks013Link = {
  label: string
  href: string
}

export type Footerlinks013Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  title?: string
  links?: readonly Footerlinks013Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-041, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-013"]){
--vibeui-footerlinks-013-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footerlinks-013-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footerlinks-013-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-footerlinks-013-muted:color-mix(in oklab,var(--vibeui-footerlinks-013-fg) 60%,var(--vibeui-footerlinks-013-bg));
--vibeui-footerlinks-013-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footerlinks-013"]{color-scheme:dark}
[data-vibeui-block="footerlinks-013"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="footerlinks-013"] *{box-sizing:border-box}
[data-vibeui-block="footerlinks-013"] h3{margin:0 0 .7rem;font-family:var(--vibeui-footerlinks-013-mono);font-size:.72rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--vibeui-footerlinks-013-muted)}
[data-vibeui-block="footerlinks-013"] h3::before{content:"// ";color:var(--vibeui-footerlinks-013-accent)}
[data-vibeui-block="footerlinks-013"] ul{margin:0;padding:0;list-style:none;display:grid;gap:.45rem}
[data-vibeui-block="footerlinks-013"] a{color:var(--vibeui-footerlinks-013-fg);text-decoration:none;transition:color .2s}
[data-vibeui-block="footerlinks-013"] a:hover{color:var(--vibeui-footerlinks-013-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-013"] *{animation:none!important;transition:none!important}}
`

/** Колонка подвала разработчика: заголовок с префиксом «//», ссылки моноширинные. */
export function Footerlinks013({
  title = "Продукт",
  links = [{ label: "Эндпоинты", href: "#endpoints" }, { label: "Цены", href: "#pricing" }, { label: "Статус", href: "#status" }, { label: "Changelog", href: "#changelog" }],
  accent,
  className,
  style,
  ...props
}: Footerlinks013Props) {
  const palette = {
    ...(accent ? { "--vibeui-footerlinks-013-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-013"
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
      </div>
    </>
  )
}

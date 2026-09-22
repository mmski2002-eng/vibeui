import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks012Link = {
  label: string
  href: string
}

export type Footerlinks012Props = Omit<ComponentProps<"nav">, "title" | "children"> & {
  title?: string
  links?: readonly Footerlinks012Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-040, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-012"]){
--vibeui-footerlinks-012-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footerlinks-012-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footerlinks-012-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-footerlinks-012-muted:color-mix(in oklab,var(--vibeui-footerlinks-012-fg) 58%,var(--vibeui-footerlinks-012-bg));
--vibeui-footerlinks-012-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footerlinks-012"]{color-scheme:dark}
[data-vibeui-block="footerlinks-012"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="footerlinks-012"] *{box-sizing:border-box}
[data-vibeui-block="footerlinks-012"] h3{margin:0 0 .7rem;font-family:var(--vibeui-footerlinks-012-mono);font-weight:500;font-size:.66rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-footerlinks-012-muted)}
[data-vibeui-block="footerlinks-012"] ul{margin:0;padding:0;list-style:none;display:grid;gap:.35rem}
[data-vibeui-block="footerlinks-012"] a{position:relative;color:var(--vibeui-footerlinks-012-fg);text-decoration:none;font-weight:500}
[data-vibeui-block="footerlinks-012"] a::after{content:"";position:absolute;left:0;right:0;bottom:-.1rem;height:1px;background:var(--vibeui-footerlinks-012-accent);transform:scaleX(0);transform-origin:left;transition:transform .25s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="footerlinks-012"] a:hover::after{transform:scaleX(1)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-012"] *{animation:none!important;transition:none!important}}
`

/** Колонка подвала в духе терминала: моно-заголовок с префиксом и ссылки-команды. */
export function Footerlinks012({
  title = "Каталог",
  links = [{ label: "Шаблоны Figma", href: "#catalog" }, { label: "Шаблоны Notion", href: "#catalog" }, { label: "Иконки", href: "#catalog" }, { label: "Шрифты", href: "#catalog" }, { label: "Наборы", href: "#bundle" }],
  accent,
  className,
  style,
  ...props
}: Footerlinks012Props) {
  const palette = {
    ...(accent ? { "--vibeui-footerlinks-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-012" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-012" aria-label={title}
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

import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks007Link = {
  label: string
  href: string
}

export type Footerlinks007Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  title?: string
  links?: readonly Footerlinks007Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-032, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-007"]){
--vibeui-footerlinks-007-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footerlinks-007-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-footerlinks-007-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footerlinks-007-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-footerlinks-007-muted:color-mix(in oklab,var(--vibeui-footerlinks-007-fg) 60%,var(--vibeui-footerlinks-007-bg));
--vibeui-footerlinks-007-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footerlinks-007"]{color-scheme:dark}
[data-vibeui-block="footerlinks-007"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="footerlinks-007"] *{box-sizing:border-box}
[data-vibeui-block="footerlinks-007"] h3{margin:0 0 .8rem;font-family:var(--vibeui-footerlinks-007-mono);font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-footerlinks-007-muted)}
[data-vibeui-block="footerlinks-007"] ul{margin:0;padding:0;list-style:none;display:grid;gap:.5rem}
[data-vibeui-block="footerlinks-007"] a{position:relative;display:inline-block;color:var(--vibeui-footerlinks-007-fg);text-decoration:none;transition:color .3s,transform .4s var(--vibeui-footerlinks-007-ease)}
[data-vibeui-block="footerlinks-007"] a::after{content:"";position:absolute;left:0;right:0;bottom:-2px;height:1px;background:var(--vibeui-footerlinks-007-accent);transform:scaleX(0);transform-origin:left;transition:transform .4s var(--vibeui-footerlinks-007-ease)}
[data-vibeui-block="footerlinks-007"] a:hover{color:var(--vibeui-footerlinks-007-accent);transform:translateX(3px)}
[data-vibeui-block="footerlinks-007"] a:hover::after{transform:scaleX(1)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-007"] *{animation:none!important;transition:none!important}}
`

/** Колонка подвала на тёмной подложке: светлый заголовок, ссылки на полутоне. */
export function Footerlinks007({
  title = "Продукт",
  links = [{ label: "Как работает", href: "#how" }, { label: "Интеграции", href: "#integrations" }, { label: "Цены", href: "#pricing" }, { label: "Что нового", href: "#changelog" }],
  accent,
  className,
  style,
  ...props
}: Footerlinks007Props) {
  const palette = {
    ...(accent ? { "--vibeui-footerlinks-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-007"
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
      </div>
    </>
  )
}

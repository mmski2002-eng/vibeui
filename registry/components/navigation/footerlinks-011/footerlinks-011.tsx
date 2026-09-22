import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks011Link = {
  label: string
  href: string
}

export type Footerlinks011Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  title?: string
  links?: readonly Footerlinks011Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-038, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-011"]){
--vibeui-footerlinks-011-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footerlinks-011-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footerlinks-011-hand:"Marck Script",cursive;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footerlinks-011"]{color-scheme:dark}
[data-vibeui-block="footerlinks-011"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="footerlinks-011"] *{box-sizing:border-box}
[data-vibeui-block="footerlinks-011"] h3{margin:0 0 .8rem;font-family:var(--vibeui-footerlinks-011-hand);font-weight:400;font-size:1.25rem;color:var(--vibeui-footerlinks-011-accent)}
[data-vibeui-block="footerlinks-011"] ul{margin:0;padding:0;list-style:none;display:grid;gap:.5rem}
[data-vibeui-block="footerlinks-011"] a{position:relative;color:var(--vibeui-footerlinks-011-fg);text-decoration:none;transition:color .2s}
[data-vibeui-block="footerlinks-011"] a::after{content:"";position:absolute;left:0;right:0;bottom:-2px;height:1.5px;background:var(--vibeui-footerlinks-011-accent);transform:scaleX(0);transform-origin:left;transition:transform .3s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="footerlinks-011"] a:hover::after{transform:scaleX(1)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-011"] *{animation:none!important;transition:none!important}}
`

/** Колонка подвала с рукописным заголовком и ссылками, подчёркнутыми линией. */
export function Footerlinks011({
  title = "языки",
  links = [{ label: "Английский", href: "#schedule" }, { label: "Испанский", href: "#schedule" }, { label: "Итальянский", href: "#schedule" }, { label: "Тест уровня", href: "#test" }],
  accent,
  className,
  style,
  ...props
}: Footerlinks011Props) {
  const palette = {
    ...(accent ? { "--vibeui-footerlinks-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-011"
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

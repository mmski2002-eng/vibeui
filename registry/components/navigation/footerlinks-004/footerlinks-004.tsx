import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks004Link = {
  label: string
  href: string
}

export type Footerlinks004Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  title?: string
  links?: readonly Footerlinks004Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-023, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-004"]){
--vibeui-footerlinks-004-accent:#ff2bd6;
--vibeui-footerlinks-004-cyan:#22f3ff;
--vibeui-footerlinks-004-fg:#f3eefc;
--vibeui-footerlinks-004-mono:"JetBrains Mono",ui-monospace,monospace;
--vibeui-footerlinks-004-muted:#a39bb5;
}
[data-vibeui-block="footerlinks-004"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="footerlinks-004"] *{box-sizing:border-box}
[data-vibeui-block="footerlinks-004"] [data-part="col-title"]{margin:0 0 .75rem;font-family:var(--vibeui-footerlinks-004-mono);font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-footerlinks-004-cyan)}
[data-vibeui-block="footerlinks-004"] [data-part="links"]{margin:0;padding:0;list-style:none;display:grid;gap:.5rem;font-size:.92rem}
[data-vibeui-block="footerlinks-004"] [data-part="links"] a{color:var(--vibeui-footerlinks-004-muted);transition:color .2s,text-shadow .3s}
[data-vibeui-block="footerlinks-004"] [data-part="links"] a:hover{color:var(--vibeui-footerlinks-004-fg);text-shadow:0 0 10px color-mix(in oklab,var(--vibeui-footerlinks-004-accent) 70%,transparent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-004"] *{animation:none!important;transition:none!important}}
`

/** Колонка ссылок для подвала с картой: компактный заголовок и короткий список. */
export function Footerlinks004({
  title = "Студия",
  links = [{ label: "Работы", href: "#works" }, { label: "Мастера", href: "#artists" }, { label: "Цены", href: "#pricing" }, { label: "Вопросы", href: "#faq" }],
  accent,
  className,
  style,
  ...props
}: Footerlinks004Props) {
  const palette = {
    ...(accent ? { "--vibeui-footerlinks-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-004"
        className={className}
        style={palette}
      >
        <p data-part="col-title">{title}</p>
        <ul data-part="links">
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

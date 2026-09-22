import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks001Link = {
  label: string
  href: string
}

export type Footerlinks001Props = Omit<ComponentProps<"nav">, "title" | "children"> & {
  title?: string
  links?: Footerlinks001Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-002, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-001"]){
--vibeui-footerlinks-001-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-footerlinks-001-dur-2:180ms;
--vibeui-footerlinks-001-ink:light-dark(oklch(0.22 0 265),oklch(0.97 0 265));
--vibeui-footerlinks-001-muted:light-dark(oklch(0.5 0 265),oklch(0.72 0 265));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footerlinks-001"]{color-scheme:dark}
[data-vibeui-block="footerlinks-001"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="footerlinks-001"] *{box-sizing:border-box}
[data-vibeui-block="footerlinks-001"] [data-part="column-title"]{margin:0 0 0.75rem;color:var(--vibeui-footerlinks-001-ink);
font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;}
[data-vibeui-block="footerlinks-001"] ul{margin:0;padding:0;list-style:none;display:grid;gap:0.5rem}
[data-vibeui-block="footerlinks-001"] a{color:var(--vibeui-footerlinks-001-muted);text-decoration:none;font-size:0.875rem;
transition:color var(--vibeui-footerlinks-001-dur-2) ease;}
[data-vibeui-block="footerlinks-001"] a:hover{color:var(--vibeui-footerlinks-001-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-001"] *{animation:none!important;transition:none!important}}
`

/** Колонка подвала: заголовок раздела капителью и список ссылок; nav с aria-label по заголовку, ссылки приглушённые, акцент по наведению. */
export function Footerlinks001({
  title = "Продукт",
  links = [ { label: "Возможности", href: "#features" }, { label: "Тарифы", href: "#pricing" }, { label: "Интеграции", href: "#integrations" }, { label: "Что нового", href: "#changelog" }, ],
  accent,
  className,
  style,
  ...props
}: Footerlinks001Props) {
  const palette = {
    ...(accent ? { "--vibeui-footerlinks-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-001" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-001"
        aria-label={title}
        className={className}
        style={palette}
      >
        <p data-part="column-title">{title}</p>
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

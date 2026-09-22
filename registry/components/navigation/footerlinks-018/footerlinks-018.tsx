import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks018Link = {
  label: string
  href: string
}

export type Footerlinks018Props = Omit<ComponentProps<"ul">, "title" | "children"> & {
  links?: readonly Footerlinks018Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-020, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-018"]){
--vibeui-footerlinks-018-accent-ink:light-dark(var(--vibeui-footerlinks-018-accent),color-mix(in oklab,var(--vibeui-footerlinks-018-accent) 55%,var(--vibeui-footerlinks-018-fg)));
--vibeui-footerlinks-018-accent:#f2f2f2;
--vibeui-footerlinks-018-fg:#f2f2f2;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footerlinks-018"]{color-scheme:dark}
[data-vibeui-block="footerlinks-018"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="footerlinks-018"] *{box-sizing:border-box}
[data-vibeui-block="footerlinks-018"]{margin:0;padding:0;list-style:none;display:grid;gap:.5rem}
[data-vibeui-block="footerlinks-018"] a{font-size:.95rem;opacity:.85;transition:opacity .2s,color .2s}
[data-vibeui-block="footerlinks-018"] a:hover{opacity:1;color:var(--vibeui-footerlinks-018-accent-ink)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-018"] *{animation:none!important;transition:none!important}}
`

/** Строка ссылок подвала кафе: мягкая гарнитура, подчёркивание по наведению. */
export function Footerlinks018({
  links = [ { label: "Подарочные сертификаты", href: "#" }, { label: "Банкеты и дальний зал", href: "#" }, { label: "Вакансии", href: "#" }, { label: "Политика конфиденциальности", href: "#" }, ],
  accent,
  className,
  style,
  ...props
}: Footerlinks018Props) {
  const palette = {
    ...(accent ? { "--vibeui-footerlinks-018-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-018" precedence="medium">
        {STYLES}
      </style>
      <ul
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-018"
        className={className}
        style={palette}
      >
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </>
  )
}

import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks020Link = { label: string; href: string }



export type Footerlinks020Props = Omit<ComponentProps<"ul">, "title" | "children"> & {
  links?: readonly Footerlinks020Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-025, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-020"]){
--vibeui-footerlinks-020-display:"Oswald","Arial Narrow",Impact,sans-serif;
--vibeui-footerlinks-020-sun:#f2c14e;
}
[data-vibeui-block="footerlinks-020"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="footerlinks-020"] *{box-sizing:border-box}
[data-vibeui-block="footerlinks-020"]{display:flex;flex-wrap:wrap;justify-content:center;gap:.25rem 1.2rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="footerlinks-020"] a{position:relative;font-family:var(--vibeui-footerlinks-020-display);font-size:.82rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;opacity:.85;transition:opacity .25s,color .25s}
[data-vibeui-block="footerlinks-020"] a:hover{opacity:1;color:var(--vibeui-footerlinks-020-sun)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-020"] *{animation:none!important;transition:none!important}}
`

/** Строка ссылок подвала в духе посадочного талона: моно-капитель. */
export function Footerlinks020({
  links = [ { label: "Маршрут", href: "#route" }, { label: "Три дня", href: "#days" }, { label: "Дорога", href: "#travel" }, { label: "Check-in", href: "#checkin" }, { label: "Вопросы", href: "#faq" }, ],
  accent,
  className,
  style,
  ...props
}: Footerlinks020Props) {
  const palette = {
    ...(accent ? { "--vibeui-footerlinks-020-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-020" precedence="medium">
        {STYLES}
      </style>
      <ul
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-020"
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

import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks005Link = {
  label: string
  href: string
}

export type Footerlinks005Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  title?: string
  links?: readonly Footerlinks005Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-027, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-005"]){
--vibeui-footerlinks-005-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-footerlinks-005-warm:#f2c94c;
}
[data-vibeui-block="footerlinks-005"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="footerlinks-005"] *{box-sizing:border-box}
@keyframes vibeui-footerlinks-005-in{from{opacity:0;translate:0 1.5rem}to{opacity:1;translate:0 0}}
[data-vibeui-block="footerlinks-005"] h4{margin:0 0 .6rem;font-size:.7rem;letter-spacing:.18em;text-transform:uppercase;opacity:.55;font-weight:600}
[data-vibeui-block="footerlinks-005"] a{display:block;width:fit-content;color:inherit;text-decoration:none;font-size:.92rem;opacity:.85;padding:.15rem 0;transition:transform .3s var(--vibeui-footerlinks-005-ease),color .2s,opacity .2s}
[data-vibeui-block="footerlinks-005"] a:hover{opacity:1;color:var(--vibeui-footerlinks-005-warm);transform:translateX(.3rem)}
[data-vibeui-block="footerlinks-005"]{animation:vibeui-footerlinks-005-in linear both;animation-timeline:view();animation-range:entry 0% entry 90%}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-005"] *{animation:none!important;transition:none!important}}
`

/** Колонка подвала кафе: заголовок и ссылки строкой рядом с часами работы. */
export function Footerlinks005({
  title = "Разделы",
  links = [{ label: "Витрина", href: "#shelf" }, { label: "Кофе", href: "#coffee" }, { label: "Коробка к утру", href: "#box" }, { label: "36 часов до буханки", href: "#story" }],
  accent,
  className,
  style,
  ...props
}: Footerlinks005Props) {
  const palette = {
    ...(accent ? { "--vibeui-footerlinks-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-005"
        className={className}
        style={palette}
      >
        <h4>{title}</h4>
        {links.map((link) => (
          <a key={link.label} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
    </>
  )
}

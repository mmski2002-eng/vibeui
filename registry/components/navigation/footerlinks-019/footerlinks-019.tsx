import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks019Link = {
  label: string
  href: string
}

export type Footerlinks019Props = Omit<ComponentProps<"ul">, "title" | "children"> & {
  links?: readonly Footerlinks019Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-024, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-019"]){
--vibeui-footerlinks-019-accent:#f2f2f2;
--vibeui-footerlinks-019-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-footerlinks-019-fg:#f2f2f2;
}
[data-vibeui-block="footerlinks-019"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="footerlinks-019"] *{box-sizing:border-box}
[data-vibeui-block="footerlinks-019"]{display:flex;flex-wrap:wrap;justify-content:center;gap:.25rem 1.2rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="footerlinks-019"] a{position:relative;font-family:var(--vibeui-footerlinks-019-display);font-size:1.1rem;color:var(--vibeui-footerlinks-019-fg);opacity:.85;transition:opacity .25s}
[data-vibeui-block="footerlinks-019"] a::after{content:"";position:absolute;left:0;right:0;bottom:-.1rem;height:1px;background:var(--vibeui-footerlinks-019-accent);transform:scaleX(0);transition:transform .3s cubic-bezier(.2,.9,.3,1)}
[data-vibeui-block="footerlinks-019"] a:hover{opacity:1}
[data-vibeui-block="footerlinks-019"] a:hover::after{transform:scaleX(1)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-019"] *{animation:none!important;transition:none!important}}
`

/** Строка ссылок свадебного подвала: засечки, тонкие разделители. */
export function Footerlinks019({
  links = [ { label: "История", href: "#story" }, { label: "Программа", href: "#program" }, { label: "Место", href: "#place" }, { label: "Подтвердить", href: "#rsvp" }, { label: "Вопросы", href: "#faq" }, ],
  accent,
  className,
  style,
  ...props
}: Footerlinks019Props) {
  const palette = {
    ...(accent ? { "--vibeui-footerlinks-019-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-019" precedence="medium">
        {STYLES}
      </style>
      <ul
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-019"
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

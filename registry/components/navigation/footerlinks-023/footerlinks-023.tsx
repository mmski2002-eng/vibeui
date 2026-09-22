import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks023Link = {
  label: string
  href: string
}

export type Footerlinks023Props = Omit<ComponentProps<"ul">, "title" | "children"> & {
  links?: readonly Footerlinks023Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-031, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-023"]){
--vibeui-footerlinks-023-accent:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footerlinks-023"]{color-scheme:dark}
[data-vibeui-block="footerlinks-023"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="footerlinks-023"] *{box-sizing:border-box}
[data-vibeui-block="footerlinks-023"]{display:flex;flex-wrap:wrap;gap:.4rem 1.2rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="footerlinks-023"] a{position:relative;color:inherit;text-decoration:none;font-weight:600;opacity:.8;transition:opacity .2s}
[data-vibeui-block="footerlinks-023"] a::after{content:"";position:absolute;left:0;right:0;bottom:-.2rem;height:2px;border-radius:2px;background:var(--vibeui-footerlinks-023-accent);transform:scaleX(0);transform-origin:right;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="footerlinks-023"] a:hover{opacity:1}
[data-vibeui-block="footerlinks-023"] a:hover::after{transform:none;transform-origin:left}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-023"] *{animation:none!important;transition:none!important}}
`

/** Строка ссылок подвала приложения: компактные ссылки рядом с кнопками сторов. */
export function Footerlinks023({
  links = [ { label: "Что внутри", href: "#features" }, { label: "Результат", href: "#results" }, { label: "Отзывы", href: "#reviews" }, { label: "Тарифы", href: "#pricing" }, { label: "Вопросы", href: "#faq" }, ],
  accent,
  className,
  style,
  ...props
}: Footerlinks023Props) {
  const palette = {
    ...(accent ? { "--vibeui-footerlinks-023-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-023" precedence="medium">
        {STYLES}
      </style>
      <ul
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-023"
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

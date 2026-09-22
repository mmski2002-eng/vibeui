import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks022Link = {
  label: string
  href: string
}

export type Footerlinks022Props = Omit<ComponentProps<"ul">, "title" | "children"> & {
  links?: readonly Footerlinks022Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-030, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-022"]){
--vibeui-footerlinks-022-accent:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footerlinks-022"]{color-scheme:dark}
[data-vibeui-block="footerlinks-022"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="footerlinks-022"] *{box-sizing:border-box}
[data-vibeui-block="footerlinks-022"]{display:flex;flex-wrap:wrap;gap:.4rem 1.2rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="footerlinks-022"] a{position:relative;display:inline-block;padding:.2rem 0;color:inherit;text-decoration:none;font-weight:500;opacity:.8;transition:opacity .2s,color .2s,transform .3s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="footerlinks-022"] a::after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;background:var(--vibeui-footerlinks-022-accent);transform:scaleX(0);transform-origin:right;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="footerlinks-022"] a:hover{opacity:1;color:var(--vibeui-footerlinks-022-accent);transform:translateY(-2px)}
[data-vibeui-block="footerlinks-022"] a:hover::after{transform:none;transform-origin:left}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-022"] *{animation:none!important;transition:none!important}}
`

/** Строка ссылок подвала портфолио: крупные, с подчёркиванием по наведению. */
export function Footerlinks022({
  links = [ { label: "Проекты", href: "#work" }, { label: "Обо мне", href: "#about" }, { label: "Отзывы", href: "#words" }, { label: "Контакт", href: "#contact" }, ],
  accent,
  className,
  style,
  ...props
}: Footerlinks022Props) {
  const palette = {
    ...(accent ? { "--vibeui-footerlinks-022-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-022" precedence="medium">
        {STYLES}
      </style>
      <ul
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-022"
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

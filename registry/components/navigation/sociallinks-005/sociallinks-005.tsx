import type { ComponentProps, CSSProperties } from "react"

export type Sociallinks005Link = {
  label: string
  href: string
}

export type Sociallinks005Props = Omit<ComponentProps<"ul">, "title" | "children"> & {
  socialsLabel?: string
  socials?: readonly Sociallinks005Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-044, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="sociallinks-005"]){
--vibeui-sociallinks-005-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-sociallinks-005-muted:color-mix(in oklab,var(--vibeui-sociallinks-005-fg) 60%,var(--vibeui-sociallinks-005-bg));
--vibeui-sociallinks-005-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sociallinks-005"]{color-scheme:dark}
[data-vibeui-block="sociallinks-005"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="sociallinks-005"] *{box-sizing:border-box}
[data-vibeui-block="sociallinks-005"]{display:flex;flex-wrap:wrap;justify-content:center;gap:.4rem 1.8rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="sociallinks-005"] a{color:var(--vibeui-sociallinks-005-muted);font-size:.88rem}
[data-vibeui-block="sociallinks-005"] a:hover{color:var(--vibeui-sociallinks-005-fg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sociallinks-005"] *{animation:none!important;transition:none!important}}
`

/** Ряд соцсетей текстом с засечками. */
export function Sociallinks005({
  socialsLabel = "Соцсети",
  socials = [ { label: "Телеграм", href: "#" }, { label: "Подкаст", href: "#" }, { label: "Литрес", href: "#" }, { label: "Почта", href: "mailto:vera@kholodova.ru" }, ],
  accent,
  className,
  style,
  ...props
}: Sociallinks005Props) {
  const palette = {
    ...(accent ? { "--vibeui-sociallinks-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sociallinks-005" precedence="medium">
        {STYLES}
      </style>
      <ul
        {...props}
        data-slot="navigation"
        data-vibeui-block="sociallinks-005" aria-label={socialsLabel}
        className={className}
        style={palette}
      >
        {socials.map((link) => (
          <li key={link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </>
  )
}

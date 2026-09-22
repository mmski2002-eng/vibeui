import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks016Link = {
  label: string
  href: string
}

export type Footerlinks016Props = Omit<ComponentProps<"nav">, "title" | "children"> & {
  legalLinksLabel?: string
  legalLinks?: Footerlinks016Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

const DEFAULT_LINKS: Footerlinks016Link[] = [
  { label: "Пользовательское соглашение", href: "#terms" },
  { label: "Политика обработки персональных данных", href: "#privacy" },
  { label: "Согласие на рассылку", href: "#consent" },
  { label: "Публичная оферта", href: "#offer" },
]

// Часть блока footer-008, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-016"]){
--vibeui-footerlinks-016-accent:light-dark(oklch(0.287 0 0),oklch(0.901 0 0));
--vibeui-footerlinks-016-border:light-dark(oklch(0.88 0 260),oklch(0.33 0 260));
--vibeui-footerlinks-016-dur-2:180ms;
--vibeui-footerlinks-016-ink:light-dark(oklch(0.24 0 260),oklch(0.93 0 260));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footerlinks-016"]{color-scheme:dark}
[data-vibeui-block="footerlinks-016"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="footerlinks-016"] *{box-sizing:border-box}
[data-vibeui-block="footerlinks-016"]{display:grid;gap:0.5rem;align-content:start;}
[data-vibeui-block="footerlinks-016"] a{color:var(--vibeui-footerlinks-016-ink);text-decoration:none;font-size:0.875rem;
border-bottom:1px solid var(--vibeui-footerlinks-016-border);
padding-bottom:0.4375rem;
transition:color var(--vibeui-footerlinks-016-dur-2) ease,border-color var(--vibeui-footerlinks-016-dur-2) ease;}
[data-vibeui-block="footerlinks-016"] a:hover{color:var(--vibeui-footerlinks-016-accent);border-color:var(--vibeui-footerlinks-016-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-016"] *{animation:none!important;transition:none!important}}
`

/** Строка юридических ссылок мелким кеглем: политика, оферта, cookies. */
export function Footerlinks016({
  legalLinksLabel = "Юридические документы",
  legalLinks = DEFAULT_LINKS,
  accent,
  className,
  style,
  ...props
}: Footerlinks016Props) {
  const palette = {
    ...(accent ? { "--vibeui-footerlinks-016-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-016" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-016" aria-label={legalLinksLabel}
        className={className}
        style={palette}
      >
        {legalLinks.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
    </>
  )
}

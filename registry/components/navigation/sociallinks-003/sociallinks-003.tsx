import type { ComponentProps, CSSProperties } from "react"

export type Sociallinks003Link = {
  label: string
  href: string
}

export type Sociallinks003Props = Omit<ComponentProps<"nav">, "title" | "children"> & {
  socialsLabel?: string
  socials?: readonly Sociallinks003Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-035, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="sociallinks-003"]){

}
[data-vibeui-block="sociallinks-003"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="sociallinks-003"] *{box-sizing:border-box}
[data-vibeui-block="sociallinks-003"]{margin-left:auto}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sociallinks-003"] *{animation:none!important;transition:none!important}}
`

/** Ряд соцсетей крупной капителью с подчёркиванием-линией. */
export function Sociallinks003({
  socialsLabel = "Соцсети",
  socials = [ { label: "Telegram", href: "https://t.me/" }, { label: "Instagram", href: "https://instagram.com/" }, ],
  accent,
  className,
  style,
  ...props
}: Sociallinks003Props) {
  const palette = {
    ...(accent ? { "--vibeui-sociallinks-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sociallinks-003" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="navigation"
        data-vibeui-block="sociallinks-003" aria-label={socialsLabel}
        className={className}
        style={palette}
      >
        {socials.map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
            {link.label}
          </a>
        ))}
      </nav>
    </>
  )
}

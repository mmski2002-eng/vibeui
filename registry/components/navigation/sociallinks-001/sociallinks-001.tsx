import type { ComponentProps, CSSProperties } from "react"

export type Sociallinks001Social = {
  label: string
  short: string
  href: string
}

export type Sociallinks001Props = Omit<ComponentProps<"nav">, "title" | "children"> & {
  socialsLabel?: string
  socials?: Sociallinks001Social[]
  accent?: string
  className?: string
  style?: CSSProperties
}

const DEFAULT_SOCIALS: Sociallinks001Social[] = [
  { label: "Телеграм", short: "TG", href: "#telegram" },
  { label: "ВКонтакте", short: "VK", href: "#vk" },
  { label: "YouTube", short: "YT", href: "#youtube" },
  { label: "Дзен", short: "DZ", href: "#dzen" },
]

// Часть блока footer-006, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="sociallinks-001"]){
--vibeui-sociallinks-001-accent:light-dark(oklch(0.28 0 0),oklch(0.91 0 0));
--vibeui-sociallinks-001-border:light-dark(oklch(0.89 0.01 200),oklch(0.34 0.024 200));
--vibeui-sociallinks-001-dur-2:180ms;
--vibeui-sociallinks-001-muted:light-dark(oklch(0.5 0.02 200),oklch(0.73 0.018 200));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sociallinks-001"]{color-scheme:dark}
[data-vibeui-block="sociallinks-001"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="sociallinks-001"] *{box-sizing:border-box}
[data-vibeui-block="sociallinks-001"]{display:flex;flex-wrap:wrap;gap:0.5rem}
[data-vibeui-block="sociallinks-001"] [data-part="social"]{display:grid;place-items:center;width:2.5rem;height:2.5rem;border-radius:0.75rem;
border:1px solid var(--vibeui-sociallinks-001-border);
color:var(--vibeui-sociallinks-001-muted);text-decoration:none;
font-size:0.75rem;font-weight:750;letter-spacing:0.02em;
transition:background-color var(--vibeui-sociallinks-001-dur-2) ease,color var(--vibeui-sociallinks-001-dur-2) ease,border-color var(--vibeui-sociallinks-001-dur-2) ease;}
[data-vibeui-block="sociallinks-001"] [data-part="social"]:hover{background:var(--vibeui-sociallinks-001-accent);border-color:var(--vibeui-sociallinks-001-accent);
color:oklch(from var(--vibeui-sociallinks-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sociallinks-001"] *{animation:none!important;transition:none!important}}
`

/** Ряд ссылок на соцсети: круглые кнопки со значками и подписью для скринридера. */
export function Sociallinks001({
  socialsLabel = "Мы в социальных сетях",
  socials = DEFAULT_SOCIALS,
  accent,
  className,
  style,
  ...props
}: Sociallinks001Props) {
  const palette = {
    ...(accent ? { "--vibeui-sociallinks-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sociallinks-001" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="navigation"
        data-vibeui-block="sociallinks-001" aria-label={socialsLabel}
        className={className}
        style={palette}
      >
        {socials.map((social) => (
          <a
            key={social.href}
            data-part="social"
            href={social.href}
            aria-label={social.label}
          >
            <span aria-hidden="true">{social.short}</span>
          </a>
        ))}
      </nav>
    </>
  )
}

import type { ComponentProps, CSSProperties } from "react"

export type Sociallinks002Link = {
  label: string
  href: string
}

export type Sociallinks002Props = Omit<ComponentProps<"ul">, "title" | "children"> & {
  social?: Sociallinks002Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

const DEFAULT_SOCIAL: Sociallinks002Link[] = [
  { label: "Telegram", href: "#telegram" },
  { label: "YouTube", href: "#youtube" },
  { label: "GitHub", href: "#github" },
]

// Часть блока footer-013, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="sociallinks-002"]){
--vibeui-sociallinks-002-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-sociallinks-002-border:light-dark(oklch(0.91 0 0),oklch(0.32 0 0));
--vibeui-sociallinks-002-dur-2:180ms;
--vibeui-sociallinks-002-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sociallinks-002"]{color-scheme:dark}
[data-vibeui-block="sociallinks-002"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="sociallinks-002"] *{box-sizing:border-box}
[data-vibeui-block="sociallinks-002"]{margin:0;padding:0;list-style:none;
display:flex;flex-wrap:wrap;justify-content:center;gap:0.5rem;}
[data-vibeui-block="sociallinks-002"] a{display:inline-block;padding:0.3125rem 0.75rem;border-radius:999px;
border:1px solid var(--vibeui-sociallinks-002-border);
color:var(--vibeui-sociallinks-002-muted);text-decoration:none;
font-size:0.8125rem;font-weight:600;
transition:color var(--vibeui-sociallinks-002-dur-2) ease,border-color var(--vibeui-sociallinks-002-dur-2) ease;}
[data-vibeui-block="sociallinks-002"] a:hover{color:var(--vibeui-sociallinks-002-accent);
border-color:color-mix(in oklab,var(--vibeui-sociallinks-002-accent) 45%,var(--vibeui-sociallinks-002-border));}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sociallinks-002"] *{animation:none!important;transition:none!important}}
`

/** Ряд соцсетей текстовыми ссылками через точку. */
export function Sociallinks002({
  social = DEFAULT_SOCIAL,
  accent,
  className,
  style,
  ...props
}: Sociallinks002Props) {
  const palette = {
    ...(accent ? { "--vibeui-sociallinks-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sociallinks-002" precedence="medium">
        {STYLES}
      </style>
      <ul
        {...props}
        data-slot="navigation"
        data-vibeui-block="sociallinks-002"
        className={className}
        style={palette}
      >
        {social.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </>
  )
}

import type { ComponentProps, CSSProperties } from "react"

export type Sociallinks004Link = {
  label: string
  href: string
}

export type Sociallinks004Props = Omit<ComponentProps<"ul">, "title" | "children"> & {
  socialsLabel?: string
  socials?: readonly Sociallinks004Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-043, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="sociallinks-004"]){
--vibeui-sociallinks-004-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-sociallinks-004-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-sociallinks-004-line:color-mix(in oklab,var(--vibeui-sociallinks-004-fg) 16%,transparent);
--vibeui-sociallinks-004-soft:color-mix(in oklab,var(--vibeui-sociallinks-004-fg) 5%,var(--vibeui-sociallinks-004-bg));
--vibeui-sociallinks-004-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sociallinks-004"]{color-scheme:dark}
[data-vibeui-block="sociallinks-004"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="sociallinks-004"] *{box-sizing:border-box}
[data-vibeui-block="sociallinks-004"]{display:flex;flex-wrap:wrap;gap:.5rem;margin:1.2rem 0 0;padding:0;list-style:none}
[data-vibeui-block="sociallinks-004"] a{display:inline-flex;align-items:center;padding:.4rem .8rem;border-radius:999px;border:1px solid var(--vibeui-sociallinks-004-line);font-size:.85rem;font-weight:500;color:var(--vibeui-sociallinks-004-fg);text-decoration:none;transition:border-color .2s,background .2s}
[data-vibeui-block="sociallinks-004"] a:hover{border-color:var(--vibeui-sociallinks-004-accent);background:var(--vibeui-sociallinks-004-soft)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sociallinks-004"] *{animation:none!important;transition:none!important}}
`

/** Ряд соцсетей с круглыми значками и подписями. */
export function Sociallinks004({
  socialsLabel = "Соцсети",
  socials = [ { label: "Telegram", href: "#" }, { label: "ВКонтакте", href: "#" }, { label: "Дзен", href: "#" }, ],
  accent,
  className,
  style,
  ...props
}: Sociallinks004Props) {
  const palette = {
    ...(accent ? { "--vibeui-sociallinks-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sociallinks-004" precedence="medium">
        {STYLES}
      </style>
      <ul
        {...props}
        data-slot="navigation"
        data-vibeui-block="sociallinks-004" aria-label={socialsLabel}
        className={className}
        style={palette}
      >
        {socials.map((item) => (
          <li key={item.label}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
    </>
  )
}

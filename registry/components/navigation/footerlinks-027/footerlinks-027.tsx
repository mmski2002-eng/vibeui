import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks027Link = {
  label: string
  href: string
}

export type Footerlinks027Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  title?: string
  links?: readonly Footerlinks027Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-028, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-027"]){
--vibeui-footerlinks-027-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footerlinks-027-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-footerlinks-027-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-footerlinks-027-muted:color-mix(in oklab,var(--vibeui-footerlinks-027-fg) 60%,var(--vibeui-footerlinks-027-bg));
--vibeui-footerlinks-027-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footerlinks-027-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footerlinks-027"]{color-scheme:dark}
[data-vibeui-block="footerlinks-027"]{box-sizing:border-box}
[data-vibeui-block="footerlinks-027"] *{box-sizing:border-box}
@keyframes vibeui-footerlinks-027-up{from{opacity:0;translate:0 1.6rem}}
[data-vibeui-block="footerlinks-027"] h4{margin:0 0 .6rem;font-family:var(--vibeui-footerlinks-027-mono);font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-footerlinks-027-muted)}
[data-vibeui-block="footerlinks-027"] a{display:block;color:inherit;text-decoration:none;padding:.15rem 0;opacity:.85;transition:opacity .2s,color .2s,translate .3s var(--vibeui-footerlinks-027-ease)}
[data-vibeui-block="footerlinks-027"] a:hover{opacity:1;color:var(--vibeui-footerlinks-027-accent);translate:.3rem 0}
@supports (animation-timeline: view()){
[data-vibeui-block="footerlinks-027"]{animation:vibeui-footerlinks-027-up linear both;animation-timeline:view();animation-range:entry 0% entry 50%}
[data-vibeui-block="footerlinks-027"]:nth-child(2){animation-range:entry 10% entry 60%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-027"] *{animation:none!important;transition:none!important}}
`

/** Колонка футера: заголовок в моно и список ссылок с подчёркиванием при наведении. */
export function Footerlinks027({
  title = "Разделы",
  links = [ { label: "Эпизоды", href: "#episodes" }, { label: "Гости", href: "#guests" }, { label: "Поддержать", href: "#support" }, { label: "Письмо", href: "#letter" }, ],
  accent,
  className,
  style,
  ...props
}: Footerlinks027Props) {
  const palette = {
    ...(accent ? { "--vibeui-footerlinks-027-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-027" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-027"
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

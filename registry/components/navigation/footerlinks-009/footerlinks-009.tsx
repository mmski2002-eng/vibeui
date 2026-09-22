import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks009Link = {
  label: string
  href: string
}

export type Footerlinks009Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  title?: string
  links?: readonly Footerlinks009Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-034, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-009"]){
--vibeui-footerlinks-009-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footerlinks-009-display:"Nunito",ui-rounded,ui-sans-serif,system-ui,sans-serif;
--vibeui-footerlinks-009-muted:color-mix(in oklab,var(--vibeui-footerlinks-009-fg) 62%,var(--vibeui-footerlinks-009-bg));
--vibeui-footerlinks-009-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footerlinks-009-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footerlinks-009"]{color-scheme:dark}
[data-vibeui-block="footerlinks-009"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="footerlinks-009"] *{box-sizing:border-box}
[data-vibeui-block="footerlinks-009"] h3{margin:0 0 .7rem;font-family:var(--vibeui-footerlinks-009-display);font-weight:800;font-size:.95rem}
[data-vibeui-block="footerlinks-009"] ul{margin:0;padding:0;list-style:none;display:grid;gap:.4rem}
[data-vibeui-block="footerlinks-009"] a{color:var(--vibeui-footerlinks-009-muted);text-decoration:none;transition:color .2s}
[data-vibeui-block="footerlinks-009"] a:hover{color:var(--vibeui-footerlinks-009-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-009"] *{animation:none!important;transition:none!important}}
`

/** Колонка подвала зоомагазина: округлый заголовок, ссылки с мягким подчёркиванием. */
export function Footerlinks009({
  title = "Услуги",
  links = [{ label: "Терапия", href: "#services" }, { label: "Хирургия", href: "#services" }, { label: "Стоматология", href: "#services" }, { label: "Груминг", href: "#grooming" }, { label: "Экзоты", href: "#services" }],
  accent,
  className,
  style,
  ...props
}: Footerlinks009Props) {
  const palette = {
    ...(accent ? { "--vibeui-footerlinks-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-009"
        className={className}
        style={palette}
      >
        <h3>{title}</h3>
        <ul>
          {links.map((link) => (
            <li key={link.label}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

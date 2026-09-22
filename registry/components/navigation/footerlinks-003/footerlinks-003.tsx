import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks003Link = {
  label: string
  href: string
}

export type Footerlinks003Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  title?: string
  links?: readonly Footerlinks003Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-022, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-003"]){
--vibeui-footerlinks-003-display:"Inter Tight","Inter",ui-sans-serif,system-ui,sans-serif;
}
[data-vibeui-block="footerlinks-003"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="footerlinks-003"] *{box-sizing:border-box}
[data-vibeui-block="footerlinks-003"] [data-part="col-title"]{margin:0 0 .75rem;font-family:var(--vibeui-footerlinks-003-display);font-size:1.15rem;font-weight:600;letter-spacing:-.01em}
[data-vibeui-block="footerlinks-003"] [data-part="links"]{display:grid;gap:.5rem;margin:0;padding:0;list-style:none;font-size:1rem}
[data-vibeui-block="footerlinks-003"] [data-part="links"] a{transition:opacity .2s}
[data-vibeui-block="footerlinks-003"] [data-part="links"] a:hover{opacity:.6}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-003"] *{animation:none!important;transition:none!important}}
`

/** Колонка подвала над цветной полосой: заголовок капителью, ссылки с подчёркиванием по наведению. */
export function Footerlinks003({
  title = "Фестиваль",
  links = [{ label: "Программа", href: "#program" }, { label: "Расписание", href: "#schedule" }, { label: "Участники", href: "#lineup" }, { label: "Площадки", href: "#venues" }],
  accent,
  className,
  style,
  ...props
}: Footerlinks003Props) {
  const palette = {
    ...(accent ? { "--vibeui-footerlinks-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-003"
        className={className}
        style={palette}
      >
        <p data-part="col-title">{title}</p>
        <ul data-part="links">
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

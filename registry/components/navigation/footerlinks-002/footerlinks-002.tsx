import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks002Link = {
  label: string
  href: string
}

export type Footerlinks002Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  title?: string
  links?: readonly Footerlinks002Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-021, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-002"]){
--vibeui-footerlinks-002-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footerlinks-002-muted:light-dark(#6b7280,#a3a3a3);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footerlinks-002"]{color-scheme:dark}
[data-vibeui-block="footerlinks-002"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="footerlinks-002"] *{box-sizing:border-box}
[data-vibeui-block="footerlinks-002"] [data-part="col-title"]{margin:0 0 .75rem;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-footerlinks-002-muted);font-weight:700}
[data-vibeui-block="footerlinks-002"] [data-part="links"]{margin:0;padding:0;list-style:none;display:grid;gap:.5rem;font-size:.9rem}
[data-vibeui-block="footerlinks-002"] [data-part="links"] a{color:var(--vibeui-footerlinks-002-muted);transition:color .2s}
[data-vibeui-block="footerlinks-002"] [data-part="links"] a:hover{color:var(--vibeui-footerlinks-002-fg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-002"] *{animation:none!important;transition:none!important}}
`

/** Колонка подвала бутика: заголовок с засечками, ссылки тонкой строкой. */
export function Footerlinks002({
  title = "Курс",
  links = [{ label: "Программа", href: "#program" }, { label: "Результаты", href: "#results" }, { label: "Стоимость", href: "#pricing" }, { label: "Вопросы", href: "#faq" }],
  accent,
  className,
  style,
  ...props
}: Footerlinks002Props) {
  const palette = {
    ...(accent ? { "--vibeui-footerlinks-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-002"
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

import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks010Link = {
  label: string
  href: string
}

export type Footerlinks010Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  title?: string
  links?: readonly Footerlinks010Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-037, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-010"]){
--vibeui-footerlinks-010-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footerlinks-010-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footerlinks-010-muted:color-mix(in oklab,var(--vibeui-footerlinks-010-fg) 62%,var(--vibeui-footerlinks-010-bg));
--vibeui-footerlinks-010-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footerlinks-010"]{color-scheme:dark}
[data-vibeui-block="footerlinks-010"]{box-sizing:border-box;min-width:min(100%,12rem);list-style:none}
[data-vibeui-block="footerlinks-010"] *{box-sizing:border-box}
[data-vibeui-block="footerlinks-010"] h3{margin:0 0 .8rem;font-size:.76rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-footerlinks-010-muted)}
[data-vibeui-block="footerlinks-010"] ul{margin:0;padding:0;list-style:none;display:grid;gap:.5rem}
[data-vibeui-block="footerlinks-010"] a{color:var(--vibeui-footerlinks-010-fg);text-decoration:none;font-weight:500;transition:color .2s}
[data-vibeui-block="footerlinks-010"] a:hover{color:var(--vibeui-footerlinks-010-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-010"] *{animation:none!important;transition:none!important}}
`

/** Колонка подвала как элемент списка: заголовок и ссылки для горизонтального ряда. */
export function Footerlinks010({
  title = "Меню",
  links = [{ label: "Бургеры", href: "#menu" }, { label: "Азия", href: "#menu" }, { label: "Конструктор боула", href: "#builder" }, { label: "Десерты", href: "#menu" }],
  accent,
  className,
  style,
  ...props
}: Footerlinks010Props) {
  const palette = {
    ...(accent ? { "--vibeui-footerlinks-010-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-010" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-010"
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
      </li>
    </>
  )
}

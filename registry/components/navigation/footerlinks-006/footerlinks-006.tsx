import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks006Link = {
  label: string
  href: string
}

export type Footerlinks006Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  title?: string
  links?: readonly Footerlinks006Link[]
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-029, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-006"]){
--vibeui-footerlinks-006-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footerlinks-006-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-footerlinks-006-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-footerlinks-006-muted:color-mix(in oklab,var(--vibeui-footerlinks-006-fg) 60%,var(--vibeui-footerlinks-006-bg));
--vibeui-footerlinks-006-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footerlinks-006-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footerlinks-006"]{color-scheme:dark}
[data-vibeui-block="footerlinks-006"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="footerlinks-006"] *{box-sizing:border-box}
@keyframes vibeui-footerlinks-006-up{from{opacity:0;transform:translateY(18px)}}
[data-vibeui-block="footerlinks-006"] h4{margin:0 0 .6rem;font-family:var(--vibeui-footerlinks-006-mono);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-footerlinks-006-muted)}
[data-vibeui-block="footerlinks-006"] a{display:block;width:fit-content;color:inherit;text-decoration:none;padding:.15rem 0;opacity:.85;transition:color .2s,opacity .2s,transform .3s var(--vibeui-footerlinks-006-ease)}
[data-vibeui-block="footerlinks-006"] a:hover{opacity:1;color:var(--vibeui-footerlinks-006-accent);transform:translateX(4px)}
[data-vibeui-block="footerlinks-006"]{animation:vibeui-footerlinks-006-up linear both;animation-timeline:view();animation-range:entry calc(var(--vibeui-footerlinks-006-i) * 8%) entry calc(45% + var(--vibeui-footerlinks-006-i) * 8%)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-006"] *{animation:none!important;transition:none!important}}
`

/** Колонка подвала с моноширинным заголовком и ссылками-строками. */
export function Footerlinks006({
  title = "Проект",
  links = [{ label: "Документация", href: "#docs" }, { label: "Песочница", href: "#playground" }, { label: "История версий", href: "#changelog" }, { label: "Roadmap", href: "#" }],
  index = 0,
  accent,
  className,
  style,
  ...props
}: Footerlinks006Props) {
  const palette = {
    ["--vibeui-footerlinks-006-i" as string]: index,
    ...(accent ? { "--vibeui-footerlinks-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-006"
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

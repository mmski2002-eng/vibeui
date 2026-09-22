import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks025Link = {
  label: string
  href: string
}

export type Footerlinks025Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  nav?: readonly Footerlinks025Link[]
  navTitle?: string
  legal?: readonly Footerlinks025Link[]
  legalTitle?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-036, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-025"]){
--vibeui-footerlinks-025-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footerlinks-025-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-footerlinks-025-muted:color-mix(in oklab,var(--vibeui-footerlinks-025-fg) 62%,var(--vibeui-footerlinks-025-bg));
--vibeui-footerlinks-025-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footerlinks-025"]{color-scheme:dark}
[data-vibeui-block="footerlinks-025"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="footerlinks-025"] *{box-sizing:border-box}
[data-vibeui-block="footerlinks-025"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;padding:1rem 1.2rem;border-bottom:1px solid var(--vibeui-footerlinks-025-fg)}
[data-vibeui-block="footerlinks-025"] h3{margin:0 0 .5rem;font-family:var(--vibeui-footerlinks-025-mono);font-size:.58rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-footerlinks-025-muted);font-weight:500}
[data-vibeui-block="footerlinks-025"] ul{margin:0;padding:0;list-style:none;display:grid;gap:.35rem}
[data-vibeui-block="footerlinks-025"] a{color:var(--vibeui-footerlinks-025-fg);text-decoration:none;font-weight:500;transition:color .2s}
[data-vibeui-block="footerlinks-025"] a:hover{color:var(--vibeui-footerlinks-025-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-025"] *{animation:none!important;transition:none!important}}
`

/** Строка ссылок подвала-таблицы: ссылки в ячейках с рамкой. */
export function Footerlinks025({
  nav = [ { label: "Смета", href: "#calc" }, { label: "Этапы", href: "#stages" }, { label: "Объекты", href: "#works" }, { label: "Стройка онлайн", href: "#online" }, { label: "Бригада", href: "#team" }, { label: "Отзывы", href: "#reviews" }, ],
  navTitle = "Разделы",
  legal = [ { label: "Договор (образец)", href: "#contract" }, { label: "Политика данных", href: "#privacy" }, ],
  legalTitle = "Документы",
  accent,
  className,
  style,
  ...props
}: Footerlinks025Props) {
  const palette = {
    ...(accent ? { "--vibeui-footerlinks-025-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-025" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-025"
        className={className}
        style={palette}
      >
        {nav.length > 0 ? (
          <nav aria-label={navTitle}>
            <h3>{navTitle}</h3>
            <ul>
              {nav.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
        {legal.length > 0 ? (
          <nav aria-label={legalTitle}>
            <h3>{legalTitle}</h3>
            <ul>
              {legal.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </>
  )
}

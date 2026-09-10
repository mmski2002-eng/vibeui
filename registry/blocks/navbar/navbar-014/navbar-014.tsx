import type { CSSProperties, ReactNode } from "react"

type Navbar014Link = {
  label: string
  href: string
  current?: boolean
}

export type Navbar014Props = {
  /** Контент рядом с полосой. Без него — демонстрационные работы. */
  children?: ReactNode
  brand?: string
  markLabel?: string
  links?: Navbar014Link[]
  navLabel?: string
  contactLabel?: string
  contactHref?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Вертикальная навигация студии: узкая боковая полоса со знаком,
// короткими пунктами и контактом; большая часть ширины отдана работам.
// Полоса sticky и остаётся на месте, пока контент прокручивается
// документом. В узкой колонке полоса превращается в обычную верхнюю
// шапку с горизонтальным рядом пунктов. Это альтернатива верхней
// навигации, а не вторая. Без клиентского JS.
const STYLES = `
:where([data-vibeui-block="navbar-014"]){
--vibeui-navbar-014-bg:#ffffff;
--vibeui-navbar-014-ink:#000000;
--vibeui-navbar-014-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-navbar-014-line:color-mix(in oklab,#000000 12%,transparent);
--vibeui-navbar-014-accent:#ff5900;
--vibeui-navbar-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="navbar-014"]{
display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-014-bg);color:var(--vibeui-navbar-014-ink);
font-family:var(--vibeui-navbar-014-font);
}
[data-vibeui-block="navbar-014"] *{box-sizing:border-box}
[data-vibeui-block="navbar-014"] [data-part="frame"]{
display:flex;flex-direction:column;max-width:96rem;margin:0 auto;
}
[data-vibeui-block="navbar-014"] [data-part="rail"]{
display:flex;flex-direction:row;align-items:center;gap:0.75rem;
padding:0.875rem 1rem;border-bottom:1px solid var(--vibeui-navbar-014-line);
}
[data-vibeui-block="navbar-014"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5625rem;flex:none;
color:inherit;text-decoration:none;
font-size:1rem;font-weight:700;letter-spacing:-0.02em;
}
[data-vibeui-block="navbar-014"] [data-part="mark"]{
width:1.625rem;height:1.625rem;flex:none;display:grid;place-items:center;
background:var(--vibeui-navbar-014-accent);color:#000000;
font-size:0.75rem;font-weight:800;
}
[data-vibeui-block="navbar-014"] [data-part="nav"]{
display:flex;flex-direction:row;gap:0.125rem;overflow-x:auto;scrollbar-width:none;
margin-left:auto;
}
[data-vibeui-block="navbar-014"] [data-part="nav"]::-webkit-scrollbar{display:none}
[data-vibeui-block="navbar-014"] [data-part="nav"] a{
flex:none;padding:0.4375rem 0.625rem;
color:var(--vibeui-navbar-014-muted);text-decoration:none;
font-size:0.9375rem;font-weight:540;white-space:nowrap;
transition:color .16s ease;
}
[data-vibeui-block="navbar-014"] [data-part="nav"] a:hover{color:var(--vibeui-navbar-014-ink)}
[data-vibeui-block="navbar-014"] [data-part="nav"] a[aria-current="page"]{
color:var(--vibeui-navbar-014-ink);
box-shadow:inset 0 -2px 0 var(--vibeui-navbar-014-accent);
}
[data-vibeui-block="navbar-014"] [data-part="contact"]{
display:none;color:var(--vibeui-navbar-014-muted);text-decoration:none;
font-size:0.8125rem;
transition:color .16s ease;
}
[data-vibeui-block="navbar-014"] [data-part="contact"]:hover{color:var(--vibeui-navbar-014-accent)}
[data-vibeui-block="navbar-014"] [data-part="work"]{
flex:1 1 auto;min-width:0;padding:1rem;
display:grid;grid-template-columns:repeat(auto-fit,minmax(14rem,1fr));gap:1rem;align-content:start;
}
[data-vibeui-block="navbar-014"] [data-part="piece"]{
display:flex;flex-direction:column;gap:0.375rem;color:inherit;text-decoration:none;
}
[data-vibeui-block="navbar-014"] [data-part="piece"] span:first-child{
aspect-ratio:4/3;display:block;
background:linear-gradient(150deg,#1a1a1a 0%,#000000 88%);
}
[data-vibeui-block="navbar-014"] [data-part="piece"][data-look="paper"] span:first-child{
background:linear-gradient(150deg,#ececea 0%,#d3d0c8 100%);
}
[data-vibeui-block="navbar-014"] [data-part="piece"] span:last-child{
font-size:0.9375rem;font-weight:580;
}
[data-vibeui-block="navbar-014"] [data-part="piece"]:hover span:last-child{color:var(--vibeui-navbar-014-accent)}
[data-vibeui-block="navbar-014"] a:focus-visible{
outline:2px solid var(--vibeui-navbar-014-accent);outline-offset:2px;
}
@container (min-width: 56rem){
[data-vibeui-block="navbar-014"] [data-part="frame"]{flex-direction:row;align-items:stretch}
[data-vibeui-block="navbar-014"] [data-part="rail"]{
flex-direction:column;align-items:flex-start;gap:1.75rem;
width:13rem;flex:none;
padding:2rem 1.5rem;border-bottom:0;border-right:1px solid var(--vibeui-navbar-014-line);
position:sticky;top:0;align-self:flex-start;min-height:32rem;
}
[data-vibeui-block="navbar-014"] [data-part="nav"]{
flex-direction:column;gap:0.125rem;margin-left:0;overflow:visible;
}
[data-vibeui-block="navbar-014"] [data-part="nav"] a{padding:0.375rem 0}
[data-vibeui-block="navbar-014"] [data-part="nav"] a[aria-current="page"]{
box-shadow:inset 3px 0 0 var(--vibeui-navbar-014-accent);padding-left:0.75rem;
}
[data-vibeui-block="navbar-014"] [data-part="contact"]{display:block;margin-top:auto}
[data-vibeui-block="navbar-014"] [data-part="work"]{padding:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Navbar014Link[] = [
  { label: "Работы", href: "#works", current: true },
  { label: "Студия", href: "#studio" },
  { label: "Процесс", href: "#process" },
  { label: "Контакты", href: "#contacts" },
]

const DEMO_PIECES = [
  ["Дом «Сектор»", "dark"],
  ["Айдентика «Русла»", "paper"],
  ["Интерьер бюро", "dark"],
  ["Серия «Тихий свет»", "paper"],
] as const

/** Вертикальная навигация студии: боковая полоса со знаком и пунктами, работы рядом. */
export function Navbar014({
  children,
  brand = "Фотостудия Тень",
  markLabel = "Т",
  links = DEFAULT_LINKS,
  navLabel = "Разделы сайта",
  contactLabel = "hello@ten.photo",
  contactHref = "mailto:hello@ten.photo",
  accent,
  className,
  style,
}: Navbar014Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-014-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-014" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="navbar-014" className={className} style={palette}>
        <div data-part="frame">
          <header data-part="rail">
            <a data-part="brand" href="#top">
              <span data-part="mark" aria-hidden="true">
                {markLabel}
              </span>
              {brand}
            </a>
            <nav data-part="nav" aria-label={navLabel}>
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <a data-part="contact" href={contactHref}>
              {contactLabel}
            </a>
          </header>
          <main data-part="work">
            {children ??
              DEMO_PIECES.map(([title, look]) => (
                <a
                  data-part="piece"
                  data-look={look === "paper" ? "paper" : undefined}
                  href="#piece"
                  key={title}
                >
                  <span aria-hidden="true" />
                  <span>{title}</span>
                </a>
              ))}
          </main>
        </div>
      </div>
    </>
  )
}

import type { CSSProperties } from "react"

type Navbar016Link = {
  label: string
  href: string
  current?: boolean
}

export type Navbar016Props = {
  brand?: string
  markLabel?: string
  /** Подпись организации под названием. */
  tagline?: string
  /** Верхняя служебная строка: контакты и служебные ссылки. */
  phone?: string
  phoneHref?: string
  serviceLinks?: Navbar016Link[]
  /** Переключатель языка. */
  langLabel?: string
  langHref?: string
  /** Основные направления. */
  links?: Navbar016Link[]
  navLabel?: string
  menuLabel?: string
  actionLabel?: string
  actionHref?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Двухуровневая корпоративная шапка: верхняя строка для контактов,
// служебных ссылок и языка; основная — для бренда, направлений и
// действия. Для крупного бизнеса, университета, фонда. При закреплении
// проектом остаётся основная строка (верхняя не sticky — это обычный
// поток). В узкой колонке служебная строка сжимается до телефона, а
// направления уходят в раскрытие. Без клиентского JS.
const STYLES = `
:where([data-vibeui-block="navbar-016"]){
--vibeui-navbar-016-bg:#ffffff;
--vibeui-navbar-016-ink:#000000;
--vibeui-navbar-016-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-navbar-016-line:color-mix(in oklab,#000000 12%,transparent);
--vibeui-navbar-016-top:#f2f2f2;
--vibeui-navbar-016-accent:#ff5900;
--vibeui-navbar-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="navbar-016"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-016-bg);color:var(--vibeui-navbar-016-ink);
border-bottom:1px solid var(--vibeui-navbar-016-line);
font-family:var(--vibeui-navbar-016-font);
}
[data-vibeui-block="navbar-016"] *{box-sizing:border-box}
[data-vibeui-block="navbar-016"] [data-part="top"]{
background:var(--vibeui-navbar-016-top);
}
[data-vibeui-block="navbar-016"] [data-part="top-shell"]{
max-width:88rem;margin:0 auto;padding:0.375rem 1rem;
display:flex;align-items:center;gap:1rem;
font-size:0.8125rem;color:var(--vibeui-navbar-016-muted);
}
[data-vibeui-block="navbar-016"] [data-part="phone"]{
color:var(--vibeui-navbar-016-ink);text-decoration:none;font-weight:600;white-space:nowrap;
}
[data-vibeui-block="navbar-016"] [data-part="phone"]:hover{color:var(--vibeui-navbar-016-accent)}
[data-vibeui-block="navbar-016"] [data-part="service"]{
display:none;align-items:center;gap:1rem;margin-left:auto;
}
[data-vibeui-block="navbar-016"] [data-part="service"] a{
color:inherit;text-decoration:none;white-space:nowrap;
transition:color .16s ease;
}
[data-vibeui-block="navbar-016"] [data-part="service"] a:hover{color:var(--vibeui-navbar-016-ink)}
[data-vibeui-block="navbar-016"] [data-part="lang"]{
margin-left:auto;color:inherit;text-decoration:none;font-weight:600;
}
[data-vibeui-block="navbar-016"] [data-part="service"]+[data-part="lang"]{margin-left:0}
[data-vibeui-block="navbar-016"] [data-part="lang"]:hover{color:var(--vibeui-navbar-016-ink)}
[data-vibeui-block="navbar-016"] [data-part="main"]{
max-width:88rem;margin:0 auto;padding:0.875rem 1rem;
display:flex;align-items:center;gap:1rem;
}
[data-vibeui-block="navbar-016"] [data-part="brand"]{
display:flex;align-items:center;gap:0.75rem;flex:none;min-width:0;
color:inherit;text-decoration:none;
}
[data-vibeui-block="navbar-016"] [data-part="mark"]{
width:2.375rem;height:2.375rem;flex:none;display:grid;place-items:center;
background:var(--vibeui-navbar-016-accent);color:#000000;
font-size:1.0625rem;font-weight:800;
}
[data-vibeui-block="navbar-016"] [data-part="ident"]{display:flex;flex-direction:column;min-width:0}
[data-vibeui-block="navbar-016"] [data-part="name"]{
font-size:1.0625rem;font-weight:700;letter-spacing:-0.015em;white-space:nowrap;
}
[data-vibeui-block="navbar-016"] [data-part="tagline"]{
font-size:0.75rem;color:var(--vibeui-navbar-016-muted);white-space:nowrap;
overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="navbar-016"] [data-part="nav"]{
display:none;align-items:center;gap:0.25rem;margin:0 auto;
}
[data-vibeui-block="navbar-016"] [data-part="nav"] a{
padding:0.5rem 0.6875rem;
color:var(--vibeui-navbar-016-muted);text-decoration:none;
font-size:0.9375rem;font-weight:540;white-space:nowrap;
transition:color .16s ease;
}
[data-vibeui-block="navbar-016"] [data-part="nav"] a:hover{color:var(--vibeui-navbar-016-ink)}
[data-vibeui-block="navbar-016"] [data-part="nav"] a[aria-current="page"]{
color:var(--vibeui-navbar-016-ink);
box-shadow:inset 0 -2px 0 var(--vibeui-navbar-016-accent);
}
[data-vibeui-block="navbar-016"] [data-part="action"]{
margin-left:auto;flex:none;
display:inline-flex;align-items:center;min-height:2.5rem;padding:0.25rem 1.125rem;
background:var(--vibeui-navbar-016-accent);color:#000000;
text-decoration:none;font-size:0.9375rem;font-weight:640;white-space:nowrap;
transition:filter .16s ease;
}
[data-vibeui-block="navbar-016"] [data-part="action"]:hover{filter:brightness(1.06)}
[data-vibeui-block="navbar-016"] [data-part="menu"]{flex:none;position:relative}
[data-vibeui-block="navbar-016"] [data-part="menu"] summary{
list-style:none;cursor:pointer;user-select:none;
display:inline-flex;align-items:center;gap:0.4375rem;
min-height:2.5rem;padding:0.25rem 0.9375rem;
border:1px solid var(--vibeui-navbar-016-line);
font-size:0.9375rem;font-weight:560;
}
[data-vibeui-block="navbar-016"] [data-part="menu"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="navbar-016"] [data-part="panel"]{
position:absolute;right:0;top:calc(100% + 0.5rem);z-index:20;min-width:15rem;
background:var(--vibeui-navbar-016-bg);border:1px solid var(--vibeui-navbar-016-line);
box-shadow:0 0.75rem 2rem color-mix(in oklab,#000000 14%,transparent);
padding:0.375rem;display:flex;flex-direction:column;
}
[data-vibeui-block="navbar-016"] [data-part="panel"] a{
padding:0.625rem 0.75rem;color:var(--vibeui-navbar-016-ink);text-decoration:none;
font-size:0.9375rem;font-weight:540;
}
[data-vibeui-block="navbar-016"] [data-part="panel"] a:hover{background:var(--vibeui-navbar-016-top)}
[data-vibeui-block="navbar-016"] [data-part="panel"] [data-part="panel-service"]{
margin-top:0.375rem;padding-top:0.375rem;border-top:1px solid var(--vibeui-navbar-016-line);
display:flex;flex-direction:column;
}
[data-vibeui-block="navbar-016"] [data-part="panel-service"] a{
color:var(--vibeui-navbar-016-muted);font-size:0.875rem;
}
[data-vibeui-block="navbar-016"] a:focus-visible,
[data-vibeui-block="navbar-016"] summary:focus-visible{
outline:2px solid var(--vibeui-navbar-016-accent);outline-offset:2px;
}
@container (min-width: 58rem){
[data-vibeui-block="navbar-016"] [data-part="top-shell"]{padding:0.4375rem 2rem}
[data-vibeui-block="navbar-016"] [data-part="service"]{display:flex}
[data-vibeui-block="navbar-016"] [data-part="main"]{padding:1rem 2rem}
[data-vibeui-block="navbar-016"] [data-part="nav"]{display:flex}
[data-vibeui-block="navbar-016"] [data-part="menu"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SERVICE: Navbar016Link[] = [
  { label: "Пресс-центр", href: "#press" },
  { label: "Закупки", href: "#procurement" },
  { label: "Карьера", href: "#career" },
]

const DEFAULT_LINKS: Navbar016Link[] = [
  { label: "О компании", href: "#about", current: true },
  { label: "Направления", href: "#directions" },
  { label: "Проекты", href: "#projects" },
  { label: "Устойчивое развитие", href: "#esg" },
  { label: "Контакты", href: "#contacts" },
]

/** Двухуровневая корпоративная шапка: служебная строка и основная навигация. */
export function Navbar016({
  brand = "Группа «Атлас»",
  markLabel = "А",
  tagline = "Промышленность и инфраструктура",
  phone = "+7 495 120-33-70",
  phoneHref = "tel:+74951203370",
  serviceLinks = DEFAULT_SERVICE,
  langLabel = "EN",
  langHref = "#en",
  links = DEFAULT_LINKS,
  navLabel = "Разделы сайта",
  menuLabel = "Меню",
  actionLabel = "Связаться",
  actionHref = "#contact",
  accent,
  className,
  style,
}: Navbar016Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-016-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-016" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-016" className={className} style={palette}>
        <div data-part="top">
          <div data-part="top-shell">
            <a data-part="phone" href={phoneHref}>
              {phone}
            </a>
            <nav data-part="service" aria-label="Служебные разделы">
              {serviceLinks.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
            <a data-part="lang" href={langHref} aria-label="Версия на английском">
              {langLabel}
            </a>
          </div>
        </div>
        <div data-part="main">
          <a data-part="brand" href="#top">
            <span data-part="mark" aria-hidden="true">
              {markLabel}
            </span>
            <span data-part="ident">
              <span data-part="name">{brand}</span>
              <span data-part="tagline">{tagline}</span>
            </span>
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
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
          <details data-part="menu">
            <summary>{menuLabel}</summary>
            <div data-part="panel">
              <nav aria-label={navLabel}>
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
              <div data-part="panel-service">
                {serviceLinks.map((link) => (
                  <a key={link.href} href={link.href}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </details>
        </div>
      </header>
    </>
  )
}

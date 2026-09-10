import type { CSSProperties } from "react"

type Navbar010Link = {
  label: string
  href: string
  current?: boolean
}

export type Navbar010Props = {
  brand?: string
  markLabel?: string
  navLabel?: string
  menuLabel?: string
  links?: Navbar010Link[]
  actionLabel?: string
  actionHref?: string
  /** Отступ островков от краёв. */
  inset?: "tight" | "roomy"
  tone?: "light" | "dark"
  /** Показать демонстрационный фон под островками. */
  demo?: boolean
  accent?: string
  className?: string
  style?: CSSProperties
}

// Плавающая шапка из островков: отдельный блок логотипа, центральная
// капсула меню и компактное действие парят над фоном с зазорами. Блок
// не фиксирует сам себя: закрепление в пределах страницы задаёт
// принимающий проект (position:sticky/fixed снаружи). В узкой колонке
// три островка собираются в одну капсулу с раскрытием меню на
// непрозрачной поверхности. Без клиентского JS.
const STYLES = `
:where([data-vibeui-block="navbar-010"]){
--vibeui-navbar-010-island:#ffffff;
--vibeui-navbar-010-ink:#000000;
--vibeui-navbar-010-muted:color-mix(in oklab,#000000 58%,#ffffff);
--vibeui-navbar-010-line:color-mix(in oklab,#000000 12%,transparent);
--vibeui-navbar-010-accent:#ff5900;
--vibeui-navbar-010-shadow:0 0.5rem 1.75rem color-mix(in oklab,#000000 14%,transparent);
--vibeui-navbar-010-inset:1rem;
--vibeui-navbar-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where([data-vibeui-block="navbar-010"][data-tone="dark"]){
--vibeui-navbar-010-island:#1a1a1a;
--vibeui-navbar-010-ink:#ffffff;
--vibeui-navbar-010-muted:color-mix(in oklab,#ffffff 64%,#1a1a1a);
--vibeui-navbar-010-line:color-mix(in oklab,#ffffff 14%,transparent);
--vibeui-navbar-010-shadow:0 0.5rem 1.75rem color-mix(in oklab,#000000 40%,transparent);
}
:where([data-vibeui-block="navbar-010"][data-inset="roomy"]){--vibeui-navbar-010-inset:2rem}
[data-vibeui-block="navbar-010"]{
position:relative;display:block;min-width:min(100%,16rem);
color:var(--vibeui-navbar-010-ink);
font-family:var(--vibeui-navbar-010-font);
}
[data-vibeui-block="navbar-010"] *{box-sizing:border-box}
[data-vibeui-block="navbar-010"] [data-part="demo-scene"]{
position:absolute;inset:0;pointer-events:none;
background:linear-gradient(150deg,#f2f2f2 0%,#e4e2de 60%,#d8d4cc 100%);
}
[data-vibeui-block="navbar-010"][data-tone="dark"] [data-part="demo-scene"]{
background:linear-gradient(150deg,#000000 0%,#17130f 62%,#241a12 100%);
}
[data-vibeui-block="navbar-010"] [data-part="shell"]{
position:relative;display:flex;align-items:center;gap:0.625rem;
max-width:82rem;margin:0 auto;
padding:var(--vibeui-navbar-010-inset);
}
[data-vibeui-block="navbar-010"][data-demo="on"] [data-part="shell"]{padding-bottom:5.5rem}
[data-vibeui-block="navbar-010"] [data-part="brand"],
[data-vibeui-block="navbar-010"] [data-part="nav"],
[data-vibeui-block="navbar-010"] [data-part="action"]{
display:inline-flex;align-items:center;
background:var(--vibeui-navbar-010-island);
border:1px solid var(--vibeui-navbar-010-line);
border-radius:999px;box-shadow:var(--vibeui-navbar-010-shadow);
}
[data-vibeui-block="navbar-010"] [data-part="brand"]{
gap:0.5rem;padding:0.4375rem 1rem 0.4375rem 0.4375rem;flex:none;
color:inherit;text-decoration:none;font-size:0.9375rem;font-weight:660;letter-spacing:-0.015em;
}
[data-vibeui-block="navbar-010"] [data-part="mark"]{
width:1.625rem;height:1.625rem;flex:none;display:grid;place-items:center;border-radius:999px;
background:var(--vibeui-navbar-010-accent);color:#000000;
font-size:0.75rem;font-weight:800;
}
[data-vibeui-block="navbar-010"] [data-part="nav"]{
display:none;margin:0 auto;padding:0.25rem;gap:0.125rem;
}
[data-vibeui-block="navbar-010"] [data-part="nav"] a{
padding:0.375rem 0.8125rem;border-radius:999px;
color:var(--vibeui-navbar-010-muted);text-decoration:none;
font-size:0.875rem;font-weight:540;white-space:nowrap;
transition:color .16s ease,background-color .16s ease;
}
[data-vibeui-block="navbar-010"] [data-part="nav"] a:hover{color:var(--vibeui-navbar-010-ink)}
[data-vibeui-block="navbar-010"] [data-part="nav"] a[aria-current="page"]{
background:color-mix(in oklab,var(--vibeui-navbar-010-accent) 16%,transparent);
color:var(--vibeui-navbar-010-ink);
}
[data-vibeui-block="navbar-010"] [data-part="action"]{
margin-left:auto;padding:0.4375rem 1.0625rem;flex:none;
background:var(--vibeui-navbar-010-accent);color:#000000;border-color:transparent;
text-decoration:none;font-size:0.875rem;font-weight:640;white-space:nowrap;
transition:filter .16s ease;
}
[data-vibeui-block="navbar-010"] [data-part="action"]:hover{filter:brightness(1.06)}
[data-vibeui-block="navbar-010"] [data-part="menu"]{position:relative;flex:none;margin-left:0.125rem}
[data-vibeui-block="navbar-010"] [data-part="menu"] summary{
list-style:none;cursor:pointer;user-select:none;
display:inline-flex;align-items:center;gap:0.4375rem;
padding:0.4375rem 0.9375rem;border-radius:999px;
background:var(--vibeui-navbar-010-island);
border:1px solid var(--vibeui-navbar-010-line);
box-shadow:var(--vibeui-navbar-010-shadow);
font-size:0.875rem;font-weight:560;
}
[data-vibeui-block="navbar-010"] [data-part="menu"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="navbar-010"] [data-part="panel"]{
position:absolute;right:0;top:calc(100% + 0.5rem);z-index:20;min-width:13rem;
background:var(--vibeui-navbar-010-island);
border:1px solid var(--vibeui-navbar-010-line);
border-radius:1rem;box-shadow:var(--vibeui-navbar-010-shadow);
padding:0.5rem;display:flex;flex-direction:column;
}
[data-vibeui-block="navbar-010"] [data-part="panel"] a{
padding:0.625rem 0.75rem;border-radius:0.625rem;
color:var(--vibeui-navbar-010-ink);text-decoration:none;
font-size:0.9375rem;font-weight:540;
}
[data-vibeui-block="navbar-010"] [data-part="panel"] a:hover{
background:color-mix(in oklab,var(--vibeui-navbar-010-accent) 12%,transparent);
}
[data-vibeui-block="navbar-010"] [data-part="panel"] a[aria-current="page"]{color:var(--vibeui-navbar-010-accent)}
[data-vibeui-block="navbar-010"] a:focus-visible,
[data-vibeui-block="navbar-010"] summary:focus-visible{
outline:2px solid var(--vibeui-navbar-010-accent);outline-offset:2px;
}
@container (min-width: 54rem){
[data-vibeui-block="navbar-010"] [data-part="nav"]{display:inline-flex}
[data-vibeui-block="navbar-010"] [data-part="menu"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Navbar010Link[] = [
  { label: "Продукт", href: "#product", current: true },
  { label: "Технология", href: "#tech" },
  { label: "Цены", href: "#pricing" },
  { label: "Блог", href: "#blog" },
]

/** Плавающая шапка-островки: логотип, капсула меню и действие парят над фоном. */
export function Navbar010({
  brand = "Ново",
  markLabel = "Н",
  navLabel = "Разделы сайта",
  menuLabel = "Меню",
  links = DEFAULT_LINKS,
  actionLabel = "Попробовать",
  actionHref = "#try",
  inset = "tight",
  tone = "light",
  demo = true,
  accent,
  className,
  style,
}: Navbar010Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-010-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-010" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-010"
        data-tone={tone === "dark" ? "dark" : undefined}
        data-inset={inset === "roomy" ? "roomy" : undefined}
        data-demo={demo ? "on" : undefined}
        className={className}
        style={palette}
      >
        {demo ? <div data-part="demo-scene" aria-hidden="true" /> : null}
        <div data-part="shell">
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
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
          <details data-part="menu">
            <summary>{menuLabel}</summary>
            <nav data-part="panel" aria-label={navLabel}>
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
          </details>
        </div>
      </header>
    </>
  )
}

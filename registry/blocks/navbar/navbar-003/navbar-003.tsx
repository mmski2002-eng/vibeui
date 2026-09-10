import type { CSSProperties } from "react"

type Navbar003Link = {
  label: string
  href: string
  current?: boolean
}

export type Navbar003Props = {
  brand?: string
  /** Буква в знаке: компонент несёт русскую. */
  markLabel?: string
  /** Подпись навигации для скринридера. */
  navLabel?: string
  /** Подпись кнопки меню в узкой раскладке. */
  menuLabel?: string
  links?: Navbar003Link[]
  actionLabel?: string
  actionHref?: string
  /** Поверхность: белая или графитовая. */
  tone?: "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Чистая шапка с одним главным действием: логотип слева, короткий ряд
// разделов, оранжевая кнопка справа, тонкая нижняя линия. Универсальная
// основа для услуги, SaaS, школы. Текущий раздел отмечен линией и
// aria-current. В узкой колонке полная навигация уходит в доступную
// панель-раскрытие (<details>, disclosure-паттерн) — без клиентского JS.
const STYLES = `
:where([data-vibeui-block="navbar-003"]){
--vibeui-navbar-003-bg:#ffffff;
--vibeui-navbar-003-ink:#000000;
--vibeui-navbar-003-muted:color-mix(in oklab,#000000 58%,#ffffff);
--vibeui-navbar-003-line:color-mix(in oklab,#000000 12%,transparent);
--vibeui-navbar-003-panel:#ffffff;
--vibeui-navbar-003-accent:#ff5900;
--vibeui-navbar-003-on-accent:#000000;
--vibeui-navbar-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where([data-vibeui-block="navbar-003"][data-tone="dark"]){
--vibeui-navbar-003-bg:#1a1a1a;
--vibeui-navbar-003-ink:#ffffff;
--vibeui-navbar-003-muted:color-mix(in oklab,#ffffff 64%,#1a1a1a);
--vibeui-navbar-003-line:color-mix(in oklab,#ffffff 14%,transparent);
--vibeui-navbar-003-panel:#1a1a1a;
}
[data-vibeui-block="navbar-003"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-003-bg);color:var(--vibeui-navbar-003-ink);
border-bottom:1px solid var(--vibeui-navbar-003-line);
font-family:var(--vibeui-navbar-003-font);
}
[data-vibeui-block="navbar-003"] *{box-sizing:border-box}
[data-vibeui-block="navbar-003"] [data-part="shell"]{
display:flex;align-items:center;gap:1rem;
max-width:82rem;margin:0 auto;padding:0.75rem 1rem;min-height:3.5rem;
}
[data-vibeui-block="navbar-003"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5625rem;flex:none;
color:inherit;text-decoration:none;font-size:1.0625rem;font-weight:680;letter-spacing:-0.02em;
}
[data-vibeui-block="navbar-003"] [data-part="mark"]{
width:1.75rem;height:1.75rem;flex:none;display:grid;place-items:center;
background:var(--vibeui-navbar-003-accent);color:var(--vibeui-navbar-003-on-accent);
font-size:0.8125rem;font-weight:800;
}
[data-vibeui-block="navbar-003"] [data-part="nav"]{
display:none;align-items:center;gap:0.25rem;margin:0 auto;
}
[data-vibeui-block="navbar-003"] [data-part="nav"] a{
position:relative;padding:0.5rem 0.75rem;
color:var(--vibeui-navbar-003-muted);text-decoration:none;
font-size:0.9375rem;font-weight:520;white-space:nowrap;
transition:color .16s ease;
}
[data-vibeui-block="navbar-003"] [data-part="nav"] a:hover{color:var(--vibeui-navbar-003-ink)}
[data-vibeui-block="navbar-003"] [data-part="nav"] a[aria-current="page"]{color:var(--vibeui-navbar-003-ink)}
[data-vibeui-block="navbar-003"] [data-part="nav"] a[aria-current="page"]::after{
content:"";position:absolute;left:0.75rem;right:0.75rem;bottom:0.125rem;height:2px;
background:var(--vibeui-navbar-003-accent);
}
[data-vibeui-block="navbar-003"] [data-part="action"]{
display:inline-flex;align-items:center;min-height:2.375rem;padding:0.25rem 1.0625rem;
margin-left:auto;flex:none;
background:var(--vibeui-navbar-003-accent);color:var(--vibeui-navbar-003-on-accent);
text-decoration:none;font-size:0.9375rem;font-weight:640;white-space:nowrap;
transition:filter .16s ease;
}
[data-vibeui-block="navbar-003"] [data-part="action"]:hover{filter:brightness(1.06)}
[data-vibeui-block="navbar-003"] [data-part="menu"]{flex:none}
[data-vibeui-block="navbar-003"] [data-part="menu"] summary{
list-style:none;cursor:pointer;user-select:none;
display:inline-flex;align-items:center;gap:0.4375rem;
min-height:2.375rem;padding:0.25rem 0.875rem;
border:1px solid var(--vibeui-navbar-003-line);
color:var(--vibeui-navbar-003-ink);font-size:0.9375rem;font-weight:560;
}
[data-vibeui-block="navbar-003"] [data-part="menu"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="navbar-003"] [data-part="menu"] summary::after{
content:"";width:0.5rem;height:0.5rem;flex:none;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg) translateY(-0.125rem);
transition:transform .16s ease;
}
[data-vibeui-block="navbar-003"] [data-part="menu"][open] summary::after{
transform:rotate(225deg) translateY(-0.125rem);
}
[data-vibeui-block="navbar-003"] [data-part="panel"]{
position:absolute;left:0;right:0;top:100%;z-index:20;
background:var(--vibeui-navbar-003-panel);
border-bottom:1px solid var(--vibeui-navbar-003-line);
padding:0.5rem 1rem 1rem;
display:flex;flex-direction:column;
}
[data-vibeui-block="navbar-003"] [data-part="panel"] a{
padding:0.75rem 0.25rem;color:var(--vibeui-navbar-003-ink);text-decoration:none;
font-size:1rem;font-weight:540;
border-bottom:1px solid var(--vibeui-navbar-003-line);
}
[data-vibeui-block="navbar-003"] [data-part="panel"] a:last-child{border-bottom:0}
[data-vibeui-block="navbar-003"] [data-part="panel"] a[aria-current="page"]{
color:var(--vibeui-navbar-003-accent);
}
[data-vibeui-block="navbar-003"] a:focus-visible,
[data-vibeui-block="navbar-003"] summary:focus-visible{
outline:2px solid var(--vibeui-navbar-003-accent);outline-offset:2px;
}
@container (min-width: 52rem){
[data-vibeui-block="navbar-003"] [data-part="shell"]{padding:0.75rem 2rem;gap:1.5rem}
[data-vibeui-block="navbar-003"] [data-part="nav"]{display:flex}
[data-vibeui-block="navbar-003"] [data-part="menu"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Navbar003Link[] = [
  { label: "Возможности", href: "#features", current: true },
  { label: "Тарифы", href: "#pricing" },
  { label: "Клиенты", href: "#customers" },
  { label: "О нас", href: "#about" },
]

/** Чистая шапка: логотип, короткий ряд разделов и одно оранжевое действие. */
export function Navbar003({
  brand = "Вершина",
  markLabel = "В",
  navLabel = "Разделы сайта",
  menuLabel = "Меню",
  links = DEFAULT_LINKS,
  actionLabel = "Начать",
  actionHref = "#start",
  tone = "light",
  accent,
  className,
  style,
}: Navbar003Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-003" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-003"
        data-tone={tone === "dark" ? "dark" : undefined}
        className={className}
        style={palette}
      >
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

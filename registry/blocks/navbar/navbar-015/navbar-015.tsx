import type { CSSProperties } from "react"

type Navbar015Link = {
  label: string
  href: string
  current?: boolean
}

export type Navbar015Props = {
  brand?: string
  /** Ссылки слева от знака. */
  leftLinks?: Navbar015Link[]
  /** Ссылки справа от знака. */
  rightLinks?: Navbar015Link[]
  navLabel?: string
  menuLabel?: string
  /** Служебные действия справа. */
  bagLabel?: string
  bagHref?: string
  tone?: "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Симметричная шапка с центральным брендом: текстовый знак по центру,
// две группы ссылок по краям, строгая симметрия и щедрые интервалы.
// Светлая или чёрная версия для fashion, предметного дизайна и
// персонального бренда. Премиальность создают пропорции, не декор.
// В узкой колонке знак остаётся по центру, ссылки уходят в раскрытие
// на непрозрачной поверхности. Без клиентского JS.
const STYLES = `
:where([data-vibeui-block="navbar-015"]){
--vibeui-navbar-015-bg:#ffffff;
--vibeui-navbar-015-ink:#000000;
--vibeui-navbar-015-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-navbar-015-line:color-mix(in oklab,#000000 12%,transparent);
--vibeui-navbar-015-accent:#ff5900;
--vibeui-navbar-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where([data-vibeui-block="navbar-015"][data-tone="dark"]){
--vibeui-navbar-015-bg:#000000;
--vibeui-navbar-015-ink:#ffffff;
--vibeui-navbar-015-muted:color-mix(in oklab,#ffffff 62%,#000000);
--vibeui-navbar-015-line:color-mix(in oklab,#ffffff 16%,transparent);
}
[data-vibeui-block="navbar-015"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-015-bg);color:var(--vibeui-navbar-015-ink);
border-bottom:1px solid var(--vibeui-navbar-015-line);
font-family:var(--vibeui-navbar-015-font);
}
[data-vibeui-block="navbar-015"] *{box-sizing:border-box}
[data-vibeui-block="navbar-015"] [data-part="shell"]{
display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:1rem;
max-width:88rem;margin:0 auto;padding:1.125rem 1rem;
}
[data-vibeui-block="navbar-015"] [data-part="left"],
[data-vibeui-block="navbar-015"] [data-part="right"]{
display:none;align-items:center;gap:0.25rem;
}
[data-vibeui-block="navbar-015"] [data-part="left"]{justify-content:flex-start}
[data-vibeui-block="navbar-015"] [data-part="right"]{justify-content:flex-end}
[data-vibeui-block="navbar-015"] [data-part="left"] a,
[data-vibeui-block="navbar-015"] [data-part="right"] a{
padding:0.4375rem 0.6875rem;
color:var(--vibeui-navbar-015-muted);text-decoration:none;
font-size:0.8125rem;font-weight:560;letter-spacing:0.14em;text-transform:uppercase;
white-space:nowrap;transition:color .16s ease;
}
[data-vibeui-block="navbar-015"] [data-part="left"] a:hover,
[data-vibeui-block="navbar-015"] [data-part="right"] a:hover{color:var(--vibeui-navbar-015-ink)}
[data-vibeui-block="navbar-015"] [data-part="left"] a[aria-current="page"],
[data-vibeui-block="navbar-015"] [data-part="right"] a[aria-current="page"]{
color:var(--vibeui-navbar-015-ink);
box-shadow:inset 0 -2px 0 var(--vibeui-navbar-015-accent);
}
[data-vibeui-block="navbar-015"] [data-part="menu"]{grid-column:1;justify-self:start;position:relative}
[data-vibeui-block="navbar-015"] [data-part="menu"] summary{
list-style:none;cursor:pointer;user-select:none;
display:inline-flex;align-items:center;gap:0.4375rem;
padding:0.375rem 0;font-size:0.8125rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;
}
[data-vibeui-block="navbar-015"] [data-part="menu"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="navbar-015"] [data-part="panel"]{
position:absolute;left:0;top:calc(100% + 0.75rem);z-index:20;min-width:13rem;
background:var(--vibeui-navbar-015-bg);border:1px solid var(--vibeui-navbar-015-line);
padding:0.5rem;display:flex;flex-direction:column;
box-shadow:0 0.75rem 2rem color-mix(in oklab,#000000 16%,transparent);
}
[data-vibeui-block="navbar-015"] [data-part="panel"] a{
padding:0.625rem 0.75rem;color:var(--vibeui-navbar-015-ink);text-decoration:none;
font-size:0.875rem;font-weight:540;letter-spacing:0.1em;text-transform:uppercase;
}
[data-vibeui-block="navbar-015"] [data-part="panel"] a:hover{color:var(--vibeui-navbar-015-accent)}
[data-vibeui-block="navbar-015"] [data-part="brand"]{
grid-column:2;justify-self:center;
color:inherit;text-decoration:none;text-align:center;
font-size:clamp(1.25rem,3.4cqi,1.875rem);font-weight:740;
letter-spacing:0.34em;text-transform:uppercase;text-indent:0.34em;
white-space:nowrap;
}
[data-vibeui-block="navbar-015"] [data-part="bag"]{
grid-column:3;justify-self:end;
color:var(--vibeui-navbar-015-muted);text-decoration:none;
font-size:0.8125rem;font-weight:560;letter-spacing:0.14em;text-transform:uppercase;
transition:color .16s ease;
}
[data-vibeui-block="navbar-015"] [data-part="bag"]:hover{color:var(--vibeui-navbar-015-accent)}
[data-vibeui-block="navbar-015"] a:focus-visible,
[data-vibeui-block="navbar-015"] summary:focus-visible{
outline:2px solid var(--vibeui-navbar-015-accent);outline-offset:3px;
}
@container (min-width: 56rem){
[data-vibeui-block="navbar-015"] [data-part="shell"]{padding:1.375rem 2.5rem}
[data-vibeui-block="navbar-015"] [data-part="left"],
[data-vibeui-block="navbar-015"] [data-part="right"]{display:flex}
[data-vibeui-block="navbar-015"] [data-part="menu"]{display:none}
[data-vibeui-block="navbar-015"] [data-part="left"]{grid-column:1}
[data-vibeui-block="navbar-015"] [data-part="right"]{grid-column:3;margin-right:1rem}
[data-vibeui-block="navbar-015"] [data-part="bag"]{grid-column:3;grid-row:1}
[data-vibeui-block="navbar-015"] [data-part="right"]{padding-right:5.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LEFT: Navbar015Link[] = [
  { label: "Коллекции", href: "#collections", current: true },
  { label: "Предметы", href: "#objects" },
]

const DEFAULT_RIGHT: Navbar015Link[] = [
  { label: "Ателье", href: "#atelier" },
  { label: "Журнал", href: "#journal" },
]

/** Симметричная шапка: крупный центральный знак и две группы ссылок по краям. */
export function Navbar015({
  brand = "Мера",
  leftLinks = DEFAULT_LEFT,
  rightLinks = DEFAULT_RIGHT,
  navLabel = "Разделы сайта",
  menuLabel = "Меню",
  bagLabel = "Корзина",
  bagHref = "#bag",
  tone = "light",
  accent,
  className,
  style,
}: Navbar015Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-015-accent": accent } : null),
    ...style,
  } as CSSProperties
  const allLinks = [...leftLinks, ...rightLinks]

  return (
    <>
      <style href="vibeui-navbar-015" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-015"
        data-tone={tone === "dark" ? "dark" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <nav data-part="left" aria-label={navLabel}>
            {leftLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={link.current ? "page" : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <details data-part="menu">
            <summary>{menuLabel}</summary>
            <nav data-part="panel" aria-label={navLabel}>
              {allLinks.map((link) => (
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
          <a data-part="brand" href="#top">
            {brand}
          </a>
          <nav data-part="right" aria-label={navLabel}>
            {rightLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={link.current ? "page" : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a data-part="bag" href={bagHref}>
            {bagLabel}
          </a>
        </div>
      </header>
    </>
  )
}

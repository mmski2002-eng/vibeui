import type { CSSProperties } from "react"

type Navbar017Link = {
  label: string
  href: string
  current?: boolean
}

export type Navbar017Props = {
  /** Название события. */
  brand?: string
  /** Дата и город. */
  dateline?: string
  links?: Navbar017Link[]
  navLabel?: string
  menuLabel?: string
  ticketLabel?: string
  ticketHref?: string
  /** Состояние продаж: продажа, скоро, завершено. */
  sales?: "open" | "soon" | "closed"
  soonLabel?: string
  closedLabel?: string
  /** Плакатная чёрно-оранжевая версия. */
  poster?: boolean
  accent?: string
  className?: string
  style?: CSSProperties
}

// Шапка события: знак, дата и город, программа и оранжевая кнопка
// билета. Возможна плакатная чёрная версия. Состояние продаж
// функционально: «скоро» и «событие завершено» показываются вместо
// кнопки — без искусственного дефицита и таймеров. Билеты продаёт
// внешняя система по переданной ссылке. Без клиентского JS.
const STYLES = `
:where([data-vibeui-block="navbar-017"]){
--vibeui-navbar-017-bg:#ffffff;
--vibeui-navbar-017-ink:#000000;
--vibeui-navbar-017-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-navbar-017-line:color-mix(in oklab,#000000 12%,transparent);
--vibeui-navbar-017-accent:#ff5900;
--vibeui-navbar-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where([data-vibeui-block="navbar-017"][data-poster="on"]){
--vibeui-navbar-017-bg:#000000;
--vibeui-navbar-017-ink:#ffffff;
--vibeui-navbar-017-muted:color-mix(in oklab,#ffffff 64%,#000000);
--vibeui-navbar-017-line:color-mix(in oklab,#ffffff 16%,transparent);
}
[data-vibeui-block="navbar-017"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-017-bg);color:var(--vibeui-navbar-017-ink);
border-bottom:1px solid var(--vibeui-navbar-017-line);
font-family:var(--vibeui-navbar-017-font);
}
[data-vibeui-block="navbar-017"] *{box-sizing:border-box}
[data-vibeui-block="navbar-017"] [data-part="shell"]{
display:flex;align-items:center;flex-wrap:wrap;gap:0.5rem 1rem;
max-width:82rem;margin:0 auto;padding:0.875rem 1rem;
}
[data-vibeui-block="navbar-017"] [data-part="ident"]{
display:flex;flex-direction:column;flex:1 1 12rem;min-width:0;
}
[data-vibeui-block="navbar-017"] [data-part="brand"]{
color:inherit;text-decoration:none;
font-size:1.25rem;font-weight:760;letter-spacing:-0.02em;
text-transform:uppercase;white-space:nowrap;
}
[data-vibeui-block="navbar-017"] [data-part="brand"] i{
font-style:normal;color:var(--vibeui-navbar-017-accent);
}
[data-vibeui-block="navbar-017"] [data-part="dateline"]{
font-size:0.8125rem;font-weight:560;color:var(--vibeui-navbar-017-muted);
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="navbar-017"] [data-part="nav"]{
display:none;align-items:center;gap:0.25rem;margin:0 auto;
}
[data-vibeui-block="navbar-017"] [data-part="nav"] a{
padding:0.5rem 0.6875rem;
color:var(--vibeui-navbar-017-muted);text-decoration:none;
font-size:0.9375rem;font-weight:560;white-space:nowrap;
transition:color .16s ease;
}
[data-vibeui-block="navbar-017"] [data-part="nav"] a:hover{color:var(--vibeui-navbar-017-ink)}
[data-vibeui-block="navbar-017"] [data-part="nav"] a[aria-current="page"]{
color:var(--vibeui-navbar-017-ink);
box-shadow:inset 0 -2px 0 var(--vibeui-navbar-017-accent);
}
[data-vibeui-block="navbar-017"] [data-part="ticket"]{
margin-left:auto;flex:none;
display:inline-flex;align-items:center;min-height:2.625rem;padding:0.25rem 1.375rem;
background:var(--vibeui-navbar-017-accent);color:#000000;
text-decoration:none;font-size:0.9375rem;font-weight:700;letter-spacing:0.01em;
text-transform:uppercase;white-space:nowrap;
transition:filter .16s ease;
}
[data-vibeui-block="navbar-017"] [data-part="ticket"]:hover{filter:brightness(1.06)}
[data-vibeui-block="navbar-017"] [data-part="state"]{
margin-left:auto;flex:none;
display:inline-flex;align-items:center;min-height:2.625rem;padding:0.25rem 1.375rem;
border:1.5px dashed var(--vibeui-navbar-017-line);
color:var(--vibeui-navbar-017-muted);
font-size:0.9375rem;font-weight:600;white-space:nowrap;
}
[data-vibeui-block="navbar-017"] [data-part="menu"]{flex:none;position:relative}
[data-vibeui-block="navbar-017"] [data-part="menu"] summary{
list-style:none;cursor:pointer;user-select:none;
display:inline-flex;align-items:center;
min-height:2.625rem;padding:0.25rem 0.9375rem;
border:1px solid var(--vibeui-navbar-017-line);
font-size:0.9375rem;font-weight:560;
}
[data-vibeui-block="navbar-017"] [data-part="menu"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="navbar-017"] [data-part="panel"]{
position:absolute;right:0;top:calc(100% + 0.5rem);z-index:20;min-width:13rem;
background:var(--vibeui-navbar-017-bg);border:1px solid var(--vibeui-navbar-017-line);
box-shadow:0 0.75rem 2rem color-mix(in oklab,#000000 20%,transparent);
padding:0.375rem;display:flex;flex-direction:column;
}
[data-vibeui-block="navbar-017"] [data-part="panel"] a{
padding:0.625rem 0.75rem;color:var(--vibeui-navbar-017-ink);text-decoration:none;
font-size:0.9375rem;font-weight:540;
}
[data-vibeui-block="navbar-017"] [data-part="panel"] a:hover{color:var(--vibeui-navbar-017-accent)}
[data-vibeui-block="navbar-017"] a:focus-visible,
[data-vibeui-block="navbar-017"] summary:focus-visible{
outline:2px solid var(--vibeui-navbar-017-accent);outline-offset:2px;
}
@container (min-width: 56rem){
[data-vibeui-block="navbar-017"] [data-part="shell"]{padding:1rem 2rem;flex-wrap:nowrap}
[data-vibeui-block="navbar-017"] [data-part="nav"]{display:flex}
[data-vibeui-block="navbar-017"] [data-part="menu"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-017"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Navbar017Link[] = [
  { label: "Программа", href: "#program", current: true },
  { label: "Спикеры", href: "#speakers" },
  { label: "Площадка", href: "#venue" },
  { label: "Партнёры", href: "#partners" },
]

/** Шапка события: знак с датой, программа и оранжевый билет с честным состоянием продаж. */
export function Navbar017({
  brand = "Сетка·Фест",
  dateline = "12–14 октября · Екатеринбург",
  links = DEFAULT_LINKS,
  navLabel = "Разделы события",
  menuLabel = "Меню",
  ticketLabel = "Билеты",
  ticketHref = "#tickets",
  sales = "open",
  soonLabel = "Продажи скоро",
  closedLabel = "Событие завершено",
  poster = false,
  accent,
  className,
  style,
}: Navbar017Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-017-accent": accent } : null),
    ...style,
  } as CSSProperties
  const [head, ...tail] = brand.split("·")

  return (
    <>
      <style href="vibeui-navbar-017" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-017"
        data-poster={poster ? "on" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="ident">
            <a data-part="brand" href="#top">
              {head}
              {tail.length > 0 ? <i>·{tail.join("·")}</i> : null}
            </a>
            <span data-part="dateline">{dateline}</span>
          </div>
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
          {sales === "open" ? (
            <a data-part="ticket" href={ticketHref}>
              {ticketLabel}
            </a>
          ) : (
            <span data-part="state" role="status">
              {sales === "soon" ? soonLabel : closedLabel}
            </span>
          )}
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

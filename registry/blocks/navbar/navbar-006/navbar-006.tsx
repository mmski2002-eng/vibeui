import type { CSSProperties } from "react"

type Navbar006Link = {
  label: string
  href: string
  current?: boolean
}

export type Navbar006Props = {
  brand?: string
  markLabel?: string
  /** Название документации рядом с брендом. */
  section?: string
  /** Текущая версия. */
  version?: string
  /** Прошлые версии в раскрытии. */
  versions?: Navbar006Link[]
  links?: Navbar006Link[]
  searchPlaceholder?: string
  searchLabel?: string
  /** Адрес обработчика поиска: форму обслуживает принимающий проект. */
  searchAction?: string
  productLabel?: string
  productHref?: string
  navLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Шапка документации: компактный бренд с названием раздела, версия с
// раскрытием прошлых версий, заметный поиск настоящей формой и ссылка
// обратно к продукту. Нейтральная плоскость, оранжевые активные состояния.
// Поиск открыт всегда — сочетание клавиш лишь дополнительное удобство
// принимающего проекта, а не условие доступа. Без клиентского JS.
const STYLES = `
:where([data-vibeui-block="navbar-006"]){
--vibeui-navbar-006-bg:#ffffff;
--vibeui-navbar-006-ink:#000000;
--vibeui-navbar-006-muted:color-mix(in oklab,#000000 58%,#ffffff);
--vibeui-navbar-006-line:color-mix(in oklab,#000000 12%,transparent);
--vibeui-navbar-006-field:#f2f2f2;
--vibeui-navbar-006-accent:#ff5900;
--vibeui-navbar-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-navbar-006-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
[data-vibeui-block="navbar-006"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-006-bg);color:var(--vibeui-navbar-006-ink);
border-bottom:1px solid var(--vibeui-navbar-006-line);
font-family:var(--vibeui-navbar-006-font);
}
[data-vibeui-block="navbar-006"] *{box-sizing:border-box}
[data-vibeui-block="navbar-006"] [data-part="shell"]{
display:flex;align-items:center;flex-wrap:wrap;gap:0.625rem 1rem;
max-width:90rem;margin:0 auto;padding:0.625rem 1rem;
}
[data-vibeui-block="navbar-006"] [data-part="brand"]{
display:inline-flex;align-items:baseline;gap:0.5rem;flex:none;
color:inherit;text-decoration:none;font-size:1rem;font-weight:680;letter-spacing:-0.02em;
}
[data-vibeui-block="navbar-006"] [data-part="mark"]{
align-self:center;width:1.5rem;height:1.5rem;flex:none;display:grid;place-items:center;
background:var(--vibeui-navbar-006-accent);color:#000000;
font-size:0.75rem;font-weight:800;
}
[data-vibeui-block="navbar-006"] [data-part="section"]{
color:var(--vibeui-navbar-006-muted);font-weight:480;
}
[data-vibeui-block="navbar-006"] [data-part="version"]{position:relative;flex:none}
[data-vibeui-block="navbar-006"] [data-part="version"] summary{
list-style:none;cursor:pointer;user-select:none;
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.25rem 0.5625rem;border:1px solid var(--vibeui-navbar-006-line);
font-family:var(--vibeui-navbar-006-mono);font-size:0.75rem;
color:var(--vibeui-navbar-006-muted);
}
[data-vibeui-block="navbar-006"] [data-part="version"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="navbar-006"] [data-part="version"] summary::after{
content:"";width:0.3125rem;height:0.3125rem;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg) translateY(-0.0625rem);
}
[data-vibeui-block="navbar-006"] [data-part="versions"]{
position:absolute;left:0;top:calc(100% + 0.25rem);z-index:20;min-width:9rem;
background:var(--vibeui-navbar-006-bg);border:1px solid var(--vibeui-navbar-006-line);
box-shadow:0 0.5rem 1.5rem color-mix(in oklab,#000000 12%,transparent);
display:flex;flex-direction:column;padding:0.25rem;
}
[data-vibeui-block="navbar-006"] [data-part="versions"] a{
padding:0.4375rem 0.625rem;color:var(--vibeui-navbar-006-ink);text-decoration:none;
font-family:var(--vibeui-navbar-006-mono);font-size:0.75rem;
}
[data-vibeui-block="navbar-006"] [data-part="versions"] a:hover{
background:var(--vibeui-navbar-006-field);color:var(--vibeui-navbar-006-accent);
}
[data-vibeui-block="navbar-006"] [data-part="search"]{
order:3;flex:1 1 100%;display:flex;align-items:center;position:relative;min-width:0;
}
[data-vibeui-block="navbar-006"] [data-part="search"] svg{
position:absolute;left:0.75rem;width:1rem;height:1rem;pointer-events:none;
color:var(--vibeui-navbar-006-muted);
}
[data-vibeui-block="navbar-006"] [data-part="search"] input{
flex:1 1 auto;min-width:0;min-height:2.375rem;
padding:0.25rem 3rem 0.25rem 2.375rem;
background:var(--vibeui-navbar-006-field);color:var(--vibeui-navbar-006-ink);
border:1px solid transparent;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="navbar-006"] [data-part="search"] input::placeholder{color:var(--vibeui-navbar-006-muted)}
[data-vibeui-block="navbar-006"] [data-part="search"] input:focus-visible{
outline:none;border-color:var(--vibeui-navbar-006-accent);
}
[data-vibeui-block="navbar-006"] [data-part="search"] kbd{
position:absolute;right:0.625rem;pointer-events:none;
padding:0.0625rem 0.375rem;border:1px solid var(--vibeui-navbar-006-line);
background:var(--vibeui-navbar-006-bg);
font-family:var(--vibeui-navbar-006-mono);font-size:0.6875rem;
color:var(--vibeui-navbar-006-muted);
}
[data-vibeui-block="navbar-006"] [data-part="nav"]{
display:flex;align-items:center;gap:0.125rem;margin-left:auto;flex:none;
}
[data-vibeui-block="navbar-006"] [data-part="nav"] a{
padding:0.4375rem 0.625rem;color:var(--vibeui-navbar-006-muted);text-decoration:none;
font-size:0.875rem;font-weight:520;white-space:nowrap;
transition:color .16s ease;
}
[data-vibeui-block="navbar-006"] [data-part="nav"] a:hover{color:var(--vibeui-navbar-006-ink)}
[data-vibeui-block="navbar-006"] [data-part="nav"] a[aria-current="page"]{
color:var(--vibeui-navbar-006-accent);font-weight:600;
}
[data-vibeui-block="navbar-006"] [data-part="product"]{
flex:none;display:inline-flex;align-items:center;gap:0.375rem;
min-height:2.25rem;padding:0.25rem 0.8125rem;
border:1px solid var(--vibeui-navbar-006-ink);
color:var(--vibeui-navbar-006-ink);text-decoration:none;
font-size:0.875rem;font-weight:580;white-space:nowrap;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="navbar-006"] [data-part="product"]:hover{
background:var(--vibeui-navbar-006-ink);color:var(--vibeui-navbar-006-bg);
}
[data-vibeui-block="navbar-006"] a:focus-visible,
[data-vibeui-block="navbar-006"] summary:focus-visible{
outline:2px solid var(--vibeui-navbar-006-accent);outline-offset:2px;
}
@container (min-width: 58rem){
[data-vibeui-block="navbar-006"] [data-part="shell"]{padding:0.625rem 1.5rem;flex-wrap:nowrap}
[data-vibeui-block="navbar-006"] [data-part="search"]{order:0;flex:0 1 24rem;margin:0 1rem}
[data-vibeui-block="navbar-006"] [data-part="nav"]{margin-left:auto}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Navbar006Link[] = [
  { label: "Руководство", href: "#guide", current: true },
  { label: "API", href: "#api" },
  { label: "Примеры", href: "#examples" },
]

const DEFAULT_VERSIONS: Navbar006Link[] = [
  { label: "v3 (текущая)", href: "#v3" },
  { label: "v2", href: "#v2" },
  { label: "v1", href: "#v1" },
]

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/** Шапка документации: бренд, версия, заметный поиск и ссылка к продукту. */
export function Navbar006({
  brand = "Прибор",
  markLabel = "П",
  section = "Документация",
  version = "v3.2",
  versions = DEFAULT_VERSIONS,
  links = DEFAULT_LINKS,
  searchPlaceholder = "Искать в документации",
  searchLabel = "Поиск по документации",
  searchAction = "#search",
  productLabel = "К продукту",
  productHref = "#product",
  navLabel = "Разделы документации",
  accent,
  className,
  style,
}: Navbar006Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-006" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-006" className={className} style={palette}>
        <div data-part="shell">
          <a data-part="brand" href="#top">
            <span data-part="mark" aria-hidden="true">
              {markLabel}
            </span>
            {brand}
            <span data-part="section">{section}</span>
          </a>
          <details data-part="version">
            <summary aria-label={`Версия ${version}`}>{version}</summary>
            <nav data-part="versions" aria-label="Версии документации">
              {versions.map((entry) => (
                <a key={entry.href} href={entry.href}>
                  {entry.label}
                </a>
              ))}
            </nav>
          </details>
          <form data-part="search" action={searchAction} role="search">
            <SearchIcon />
            <input
              type="search"
              name="q"
              placeholder={searchPlaceholder}
              aria-label={searchLabel}
            />
            <kbd aria-hidden="true">/</kbd>
          </form>
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
          <a data-part="product" href={productHref}>
            {productLabel}
          </a>
        </div>
      </header>
    </>
  )
}

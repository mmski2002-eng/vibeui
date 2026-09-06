import type { CSSProperties } from "react"

type Navbar015Link = {
  label: string
  href: string
}

export type Navbar015Props = {
  brand?: string
  /** Строка под названием: раздел каталога, город, год основания. */
  tagline?: string
  linksLeft?: Navbar015Link[]
  linksRight?: Navbar015Link[]
  /** Число на значке корзины; ноль прячет значок. */
  cartCount?: number
  searchHref?: string
  cartHref?: string
  accountHref?: string
  /** Подписи для скринридера: компонент несёт русские. */
  navLeftLabel?: string
  navRightLabel?: string
  searchLabel?: string
  cartLabel?: string
  accountLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Шапка с логотипом по центру: разделы разведены влево и вправо, справа —
// поиск, корзина и аккаунт. Классическая раскладка магазина и издания.
//
// Центр держится сеткой minmax(0,1fr) auto minmax(0,1fr): боковые колонки
// одинаковой доли, поэтому логотип стоит ровно по середине шапки независимо
// от того, сколько ссылок слева и справа.
const STYLES = `
:where([data-vibeui-block="navbar-015"]){
--vibeui-navbar-015-bg:light-dark(oklch(0.995 0.001 85),oklch(0.18 0.008 85));
--vibeui-navbar-015-ink:light-dark(oklch(0.2 0.012 85),oklch(0.95 0.005 85));
--vibeui-navbar-015-muted:light-dark(oklch(0.5 0.012 85),oklch(0.73 0.01 85));
--vibeui-navbar-015-border:light-dark(oklch(0.9 0.006 85),oklch(0.31 0.008 85));
--vibeui-navbar-015-accent:light-dark(oklch(0.55 0.13 39.8),oklch(0.75 0.13 39.8));
--vibeui-navbar-015-accent-fg:oklch(from var(--vibeui-navbar-015-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-015"]{color-scheme:dark}
[data-vibeui-block="navbar-015"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,17rem);
display:block;background:var(--vibeui-navbar-015-bg);color:var(--vibeui-navbar-015-ink);
border-bottom:1px solid var(--vibeui-navbar-015-border);
font-family:var(--vibeui-navbar-015-font);
}
[data-vibeui-block="navbar-015"] [data-part="shell"]{
display:grid;grid-template-columns:minmax(0,1fr);justify-items:center;align-items:center;
gap:0.625rem;max-width:82rem;margin:0 auto;padding:0.875rem 1rem;
}
[data-vibeui-block="navbar-015"] [data-part="brand"]{
display:grid;justify-items:center;gap:0.125rem;min-inline-size:0;
color:var(--vibeui-navbar-015-ink);text-decoration:none;
}
[data-vibeui-block="navbar-015"] [data-part="brand-name"]{
font-size:1.375rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;line-height:1.1;
}
[data-vibeui-block="navbar-015"] [data-part="brand-tagline"]{
font-size:0.625rem;font-weight:520;letter-spacing:0.22em;text-transform:uppercase;
color:var(--vibeui-navbar-015-muted);
}
[data-vibeui-block="navbar-015"] [data-part="list"]{
display:flex;align-items:center;flex-wrap:wrap;justify-content:center;
gap:0.25rem 0.75rem;margin:0;padding:0;list-style:none;min-inline-size:0;
}
[data-vibeui-block="navbar-015"] [data-part="link"]{
display:inline-flex;align-items:center;min-height:1.75rem;
color:var(--vibeui-navbar-015-muted);text-decoration:none;
font-size:0.8125rem;font-weight:560;letter-spacing:0.06em;text-transform:uppercase;
transition:color .16s ease;
}
[data-vibeui-block="navbar-015"] [data-part="link"]:hover{color:var(--vibeui-navbar-015-ink)}
[data-vibeui-block="navbar-015"] [data-part="link"][aria-current="page"]{color:var(--vibeui-navbar-015-ink)}
[data-vibeui-block="navbar-015"] [data-part="end"]{
display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:0.5rem 1rem;min-inline-size:0;
}
[data-vibeui-block="navbar-015"] [data-part="icons"]{display:flex;align-items:center;gap:0.125rem}
[data-vibeui-block="navbar-015"] [data-part="icon"]{
position:relative;display:inline-flex;align-items:center;justify-content:center;
width:2.25rem;height:2.25rem;border-radius:0.625rem;
color:var(--vibeui-navbar-015-ink);text-decoration:none;
transition:background-color .16s ease;
}
[data-vibeui-block="navbar-015"] [data-part="icon"]:hover{background:color-mix(in oklab,var(--vibeui-navbar-015-border) 55%,transparent)}
[data-vibeui-block="navbar-015"] [data-part="icon"] svg{width:1.125rem;height:1.125rem;display:block}
[data-vibeui-block="navbar-015"] [data-part="badge"]{
position:absolute;inset-block-start:0.25rem;inset-inline-start:1.25rem;
min-width:1rem;padding:0 0.25rem;border-radius:999px;
background:var(--vibeui-navbar-015-accent);color:var(--vibeui-navbar-015-accent-fg);
font-size:0.625rem;font-weight:700;line-height:1rem;text-align:center;
}
[data-vibeui-block="navbar-015"] a:focus-visible{outline:2px solid var(--vibeui-navbar-015-accent);outline-offset:2px}
@container (min-width: 56rem){
[data-vibeui-block="navbar-015"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:1.5rem;padding:1rem 2rem}
[data-vibeui-block="navbar-015"] [data-part="nav-left"]{order:-1;justify-self:start}
[data-vibeui-block="navbar-015"] [data-part="nav-left"] [data-part="list"]{justify-content:flex-start}
[data-vibeui-block="navbar-015"] [data-part="end"]{justify-self:end;flex-wrap:nowrap;justify-content:flex-end}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS_LEFT: Navbar015Link[] = [
  { label: "Новинки", href: "#new" },
  { label: "Женщинам", href: "#women" },
  { label: "Мужчинам", href: "#men" },
]

const DEFAULT_LINKS_RIGHT: Navbar015Link[] = [
  { label: "Журнал", href: "#journal" },
  { label: "Магазины", href: "#stores" },
]

const ICON_SEARCH = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M16 16l4.5 4.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
)

const ICON_CART = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 6h2l1.6 9.2a2 2 0 0 0 2 1.8h6.9a2 2 0 0 0 2-1.6L20 9H7"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="10" cy="20" r="1.2" fill="currentColor" />
    <circle cx="17" cy="20" r="1.2" fill="currentColor" />
  </svg>
)

const ICON_ACCOUNT = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M5 20c1.2-3.4 3.7-5.1 7-5.1s5.8 1.7 7 5.1"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
)

/** Шапка с логотипом по центру: ссылки по бокам, иконки справа. */
export function Navbar015({
  brand = "Атлас",
  tagline = "Одежда и предметы",
  linksLeft = DEFAULT_LINKS_LEFT,
  linksRight = DEFAULT_LINKS_RIGHT,
  cartCount = 2,
  searchHref = "#search",
  cartHref = "#cart",
  accountHref = "#account",
  navLeftLabel = "Каталог",
  navRightLabel = "О магазине",
  searchLabel = "Поиск по каталогу",
  cartLabel = "Корзина",
  accountLabel = "Личный кабинет",
  accent,
  className,
  style,
}: Navbar015Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-015-accent": accent } : null),
    ...style,
  } as CSSProperties
  const cartText = cartCount > 0 ? `${cartLabel}: ${cartCount}` : cartLabel

  return (
    <>
      <style href="vibeui-navbar-015" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-015"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <a data-part="brand" href="#top">
            <span data-part="brand-name">{brand}</span>
            {tagline ? <span data-part="brand-tagline">{tagline}</span> : null}
          </a>
          <nav data-part="nav-left" aria-label={navLeftLabel}>
            <ul data-part="list">
              {linksLeft.map((link) => (
                <li key={link.href}>
                  <a data-part="link" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div data-part="end">
            <nav data-part="nav-right" aria-label={navRightLabel}>
              <ul data-part="list">
                {linksRight.map((link) => (
                  <li key={link.href}>
                    <a data-part="link" href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div data-part="icons">
              <a data-part="icon" href={searchHref} aria-label={searchLabel}>
                {ICON_SEARCH}
              </a>
              <a data-part="icon" href={cartHref} aria-label={cartText}>
                {ICON_CART}
                {cartCount > 0 ? (
                  <span data-part="badge" aria-hidden="true">
                    {cartCount}
                  </span>
                ) : null}
              </a>
              <a data-part="icon" href={accountHref} aria-label={accountLabel}>
                {ICON_ACCOUNT}
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

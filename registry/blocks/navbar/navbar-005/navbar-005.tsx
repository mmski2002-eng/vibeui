import type { CSSProperties } from "react"

type Navbar005Link = {
  label: string
  href: string
}

export type Navbar005Props = {
  brand?: string
  markLabel?: string
  /** Служебная строка о доставке. Пустая строка убирает полосу. */
  notice?: string
  searchPlaceholder?: string
  searchLabel?: string
  /** Адрес обработчика поиска: форму обслуживает принимающий проект. */
  searchAction?: string
  catalogLabel?: string
  catalogLinks?: Navbar005Link[]
  favoritesLabel?: string
  favoritesHref?: string
  cartLabel?: string
  cartHref?: string
  /** Количество товаров в корзине. Ноль скрывает счётчик. */
  cartCount?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Шапка магазина: поиск занимает центральное место, рядом каталог по
// группам (<details>, без JS), избранное и корзина со счётчиком. Служебная
// строка про доставку визуально тише основной навигации. Форму поиска и
// состояние корзины обслуживает принимающий проект — здесь только
// доступная разметка. В узкой колонке поиск переезжает на отдельную строку.
const STYLES = `
:where([data-vibeui-block="navbar-005"]){
--vibeui-navbar-005-bg:#ffffff;
--vibeui-navbar-005-ink:#000000;
--vibeui-navbar-005-muted:color-mix(in oklab,#000000 58%,#ffffff);
--vibeui-navbar-005-line:color-mix(in oklab,#000000 12%,transparent);
--vibeui-navbar-005-field:#f2f2f2;
--vibeui-navbar-005-notice:#1a1a1a;
--vibeui-navbar-005-notice-ink:#ffffff;
--vibeui-navbar-005-accent:#ff5900;
--vibeui-navbar-005-on-accent:#000000;
--vibeui-navbar-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="navbar-005"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-005-bg);color:var(--vibeui-navbar-005-ink);
border-bottom:1px solid var(--vibeui-navbar-005-line);
font-family:var(--vibeui-navbar-005-font);
}
[data-vibeui-block="navbar-005"] *{box-sizing:border-box}
[data-vibeui-block="navbar-005"] [data-part="notice"]{
background:var(--vibeui-navbar-005-notice);color:var(--vibeui-navbar-005-notice-ink);
font-size:0.8125rem;text-align:center;padding:0.375rem 1rem;
}
[data-vibeui-block="navbar-005"] [data-part="shell"]{
display:flex;align-items:center;flex-wrap:wrap;gap:0.625rem 1rem;
max-width:82rem;margin:0 auto;padding:0.75rem 1rem;
}
[data-vibeui-block="navbar-005"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5625rem;flex:none;
color:inherit;text-decoration:none;font-size:1.0625rem;font-weight:680;letter-spacing:-0.02em;
}
[data-vibeui-block="navbar-005"] [data-part="mark"]{
width:1.75rem;height:1.75rem;flex:none;display:grid;place-items:center;
background:var(--vibeui-navbar-005-accent);color:var(--vibeui-navbar-005-on-accent);
font-size:0.8125rem;font-weight:800;
}
[data-vibeui-block="navbar-005"] [data-part="catalog"]{position:relative;flex:none}
[data-vibeui-block="navbar-005"] [data-part="catalog"] summary{
list-style:none;cursor:pointer;user-select:none;
display:inline-flex;align-items:center;gap:0.4375rem;
min-height:2.5rem;padding:0.25rem 0.9375rem;
background:var(--vibeui-navbar-005-accent);color:var(--vibeui-navbar-005-on-accent);
font-size:0.9375rem;font-weight:620;
}
[data-vibeui-block="navbar-005"] [data-part="catalog"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="navbar-005"] [data-part="catalog"] summary::before{
content:"";width:0.875rem;height:0.75rem;flex:none;
background:linear-gradient(currentColor 2px,transparent 2px) 0 0/100% 0.3125rem repeat-y;
}
[data-vibeui-block="navbar-005"] [data-part="catalog-panel"]{
position:absolute;left:0;top:calc(100% + 0.375rem);z-index:20;min-width:14rem;
background:var(--vibeui-navbar-005-bg);border:1px solid var(--vibeui-navbar-005-line);
box-shadow:0 0.75rem 2rem color-mix(in oklab,#000000 14%,transparent);
padding:0.375rem;display:flex;flex-direction:column;
}
[data-vibeui-block="navbar-005"] [data-part="catalog-panel"] a{
padding:0.5625rem 0.75rem;color:var(--vibeui-navbar-005-ink);text-decoration:none;
font-size:0.9375rem;font-weight:520;
}
[data-vibeui-block="navbar-005"] [data-part="catalog-panel"] a:hover{
background:var(--vibeui-navbar-005-field);color:var(--vibeui-navbar-005-accent);
}
[data-vibeui-block="navbar-005"] [data-part="search"]{
order:3;flex:1 1 100%;display:flex;min-width:0;
}
[data-vibeui-block="navbar-005"] [data-part="search"] input{
flex:1 1 auto;min-width:0;min-height:2.5rem;padding:0.25rem 0.875rem;
background:var(--vibeui-navbar-005-field);color:var(--vibeui-navbar-005-ink);
border:1px solid transparent;border-right:0;font:inherit;font-size:0.9375rem;
}
[data-vibeui-block="navbar-005"] [data-part="search"] input::placeholder{color:var(--vibeui-navbar-005-muted)}
[data-vibeui-block="navbar-005"] [data-part="search"] input:focus-visible{
outline:none;border-color:var(--vibeui-navbar-005-accent);
}
[data-vibeui-block="navbar-005"] [data-part="search"] button{
appearance:none;border:0;cursor:pointer;flex:none;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.5rem;width:3rem;
background:var(--vibeui-navbar-005-notice);color:var(--vibeui-navbar-005-notice-ink);
transition:background-color .16s ease;
}
[data-vibeui-block="navbar-005"] [data-part="search"] button:hover{background:#000000}
[data-vibeui-block="navbar-005"] [data-part="actions"]{
display:flex;align-items:center;gap:0.25rem;margin-left:auto;flex:none;
}
[data-vibeui-block="navbar-005"] [data-part="iconlink"]{
position:relative;display:inline-flex;flex-direction:column;align-items:center;gap:0.125rem;
min-width:3rem;padding:0.375rem 0.5rem;
color:var(--vibeui-navbar-005-ink);text-decoration:none;
font-size:0.6875rem;font-weight:520;
}
[data-vibeui-block="navbar-005"] [data-part="iconlink"]:hover{color:var(--vibeui-navbar-005-accent)}
[data-vibeui-block="navbar-005"] [data-part="iconlink"] svg{width:1.375rem;height:1.375rem}
[data-vibeui-block="navbar-005"] [data-part="count"]{
position:absolute;top:0;right:0.375rem;
min-width:1.0625rem;height:1.0625rem;padding:0 0.25rem;
display:inline-flex;align-items:center;justify-content:center;
background:var(--vibeui-navbar-005-accent);color:var(--vibeui-navbar-005-on-accent);
border-radius:999px;font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="navbar-005"] a:focus-visible,
[data-vibeui-block="navbar-005"] summary:focus-visible,
[data-vibeui-block="navbar-005"] button:focus-visible{
outline:2px solid var(--vibeui-navbar-005-accent);outline-offset:2px;
}
@container (min-width: 56rem){
[data-vibeui-block="navbar-005"] [data-part="shell"]{padding:0.75rem 2rem;gap:0.625rem 1.25rem;flex-wrap:nowrap}
[data-vibeui-block="navbar-005"] [data-part="search"]{order:0;flex:1 1 auto;max-width:38rem;margin:0 auto}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CATALOG: Navbar005Link[] = [
  { label: "Новинки", href: "#new" },
  { label: "Одежда", href: "#clothes" },
  { label: "Обувь", href: "#shoes" },
  { label: "Аксессуары", href: "#accessories" },
  { label: "Распродажа", href: "#sale" },
]

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20.5S4 15.5 4 9.9C4 7.2 6.1 5 8.7 5c1.4 0 2.6.6 3.3 1.7C12.7 5.6 14 5 15.3 5 17.9 5 20 7.2 20 9.9c0 5.6-8 10.6-8 10.6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 8h14l-1 12H6L5 8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 10V6.5A3 3 0 0 1 12 3.5a3 3 0 0 1 3 3V10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Шапка магазина: каталог, центральный поиск, избранное и корзина со счётчиком. */
export function Navbar005({
  brand = "Лавка",
  markLabel = "Л",
  notice = "Доставка по России от 2 дней · бесплатно от 5 000 ₽",
  searchPlaceholder = "Искать товары",
  searchLabel = "Поиск по магазину",
  searchAction = "#search",
  catalogLabel = "Каталог",
  catalogLinks = DEFAULT_CATALOG,
  favoritesLabel = "Избранное",
  favoritesHref = "#favorites",
  cartLabel = "Корзина",
  cartHref = "#cart",
  cartCount = 2,
  accent,
  className,
  style,
}: Navbar005Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-005" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-005" className={className} style={palette}>
        {notice ? <p data-part="notice">{notice}</p> : null}
        <div data-part="shell">
          <a data-part="brand" href="#top">
            <span data-part="mark" aria-hidden="true">
              {markLabel}
            </span>
            {brand}
          </a>
          <details data-part="catalog">
            <summary>{catalogLabel}</summary>
            <nav data-part="catalog-panel" aria-label={catalogLabel}>
              {catalogLinks.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          </details>
          <form data-part="search" action={searchAction} role="search">
            <input
              type="search"
              name="q"
              placeholder={searchPlaceholder}
              aria-label={searchLabel}
            />
            <button type="submit" aria-label={searchLabel}>
              <SearchIcon />
            </button>
          </form>
          <div data-part="actions">
            <a data-part="iconlink" href={favoritesHref}>
              <HeartIcon />
              {favoritesLabel}
            </a>
            <a data-part="iconlink" href={cartHref}>
              <BagIcon />
              {cartLabel}
              {cartCount > 0 ? (
                <span data-part="count" aria-label={`${cartLabel}: ${cartCount}`}>
                  {cartCount}
                </span>
              ) : null}
            </a>
          </div>
        </div>
      </header>
    </>
  )
}

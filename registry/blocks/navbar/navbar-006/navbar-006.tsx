import type { CSSProperties } from "react"

type Navbar006Link = {
  label: string
  href: string
}

type Navbar006Locale = {
  code: string
  label: string
  region: string
  href: string
}

export type Navbar006Props = {
  brand?: string
  links?: Navbar006Link[]
  locales?: Navbar006Locale[]
  currentLocale?: string
  actionLabel?: string
  actionHref?: string
  id?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Шапка международного сайта: рядом с меню стоит переключатель языка,
// открывающий список ссылками на локализованные версии. Список — HTML
// popover, поэтому Esc и клик мимо работают без JS, а сами языки остаются
// ссылками: переключение языка — это переход, а не состояние интерфейса.
const STYLES = `
:where([data-vibeui-block="navbar-006"]){
--vibeui-navbar-006-bg:oklch(1 0 0);
--vibeui-navbar-006-ink:oklch(0.23 0.012 265);
--vibeui-navbar-006-muted:oklch(0.54 0.012 265);
--vibeui-navbar-006-border:oklch(0.9 0.005 265);
--vibeui-navbar-006-accent:oklch(0.52 0.16 20);
--vibeui-navbar-006-accent-fg:oklch(0.99 0 0);
--vibeui-navbar-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="navbar-006"]{
display:block;background:var(--vibeui-navbar-006-bg);color:var(--vibeui-navbar-006-ink);
border-bottom:1px solid var(--vibeui-navbar-006-border);
font-family:var(--vibeui-navbar-006-font);
}
[data-vibeui-block="navbar-006"] [data-part="shell"]{
display:flex;align-items:center;gap:0.625rem;flex-wrap:wrap;
max-width:78rem;margin:0 auto;padding:0.75rem 1rem;
}
[data-vibeui-block="navbar-006"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5rem;flex:none;margin-right:auto;
color:inherit;text-decoration:none;font-size:1rem;font-weight:680;letter-spacing:-0.02em;
}
[data-vibeui-block="navbar-006"] [data-part="mark"]{
width:1.5rem;height:1.5rem;border-radius:999px;
background:radial-gradient(circle at 32% 30%,color-mix(in oklab,var(--vibeui-navbar-006-accent) 45%,white),var(--vibeui-navbar-006-accent));
}
[data-vibeui-block="navbar-006"] [data-part="links"]{
order:4;flex:1 1 100%;display:flex;align-items:center;gap:1.125rem;
padding-top:0.625rem;border-top:1px solid var(--vibeui-navbar-006-border);
overflow-x:auto;scrollbar-width:none;
}
[data-vibeui-block="navbar-006"] [data-part="links"]::-webkit-scrollbar{display:none}
[data-vibeui-block="navbar-006"] [data-part="links"] a{
color:var(--vibeui-navbar-006-muted);text-decoration:none;white-space:nowrap;
font-size:0.875rem;font-weight:520;
transition:color .16s ease;
}
[data-vibeui-block="navbar-006"] [data-part="links"] a:hover{color:var(--vibeui-navbar-006-ink)}
[data-vibeui-block="navbar-006"] [data-part="globe"]{
appearance:none;cursor:pointer;flex:none;
display:inline-flex;align-items:center;gap:0.4375rem;height:2.25rem;padding:0 0.75rem;
border:1px solid var(--vibeui-navbar-006-border);border-radius:0.625rem;background:transparent;
font:inherit;font-size:0.875rem;font-weight:560;color:var(--vibeui-navbar-006-ink);
transition:background-color .16s ease;
}
[data-vibeui-block="navbar-006"] [data-part="globe"]:hover{background:color-mix(in oklab,var(--vibeui-navbar-006-border) 40%,transparent)}
[data-vibeui-block="navbar-006"] [data-part="globe"]::before{
content:"";width:0.9375rem;height:0.9375rem;border-radius:999px;
border:1.5px solid currentColor;
background:linear-gradient(currentColor,currentColor) center/100% 1.5px no-repeat;
opacity:.75;
}
[data-vibeui-block="navbar-006"] [data-part="action"]{
flex:none;display:inline-flex;align-items:center;height:2.25rem;padding:0 1rem;
border-radius:0.625rem;background:var(--vibeui-navbar-006-accent);color:var(--vibeui-navbar-006-accent-fg);
text-decoration:none;font-size:0.875rem;font-weight:620;white-space:nowrap;
}
[data-vibeui-block="navbar-006"] a:focus-visible,
[data-vibeui-block="navbar-006"] button:focus-visible{outline:2px solid var(--vibeui-navbar-006-accent);outline-offset:2px}
[data-vibeui-navbar-006-locales]{
position:fixed;inset:3.5rem 1rem auto auto;margin:0;padding:0.375rem;min-width:14rem;
border:1px solid var(--vibeui-navbar-006-border,oklch(0.9 0.005 265));border-radius:0.875rem;
background:oklch(1 0 0);
font-family:var(--vibeui-navbar-006-font,ui-sans-serif,system-ui,sans-serif);
box-shadow:0 24px 56px -30px oklch(0.2 0.03 265 / 55%);
opacity:0;transform:translateY(-0.375rem);
transition:opacity .18s ease,transform .18s ease,display .18s allow-discrete,overlay .18s allow-discrete;
}
[data-vibeui-navbar-006-locales]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-navbar-006-locales]:popover-open{opacity:0;transform:translateY(-0.375rem)}}
[data-vibeui-navbar-006-locales] a{
display:flex;align-items:baseline;gap:0.5rem;padding:0.5rem 0.625rem;border-radius:0.625rem;
color:oklch(0.23 0.012 265);text-decoration:none;font-size:0.875rem;font-weight:560;
}
[data-vibeui-navbar-006-locales] a:hover{background:oklch(0.55 0.02 265 / 8%)}
[data-vibeui-navbar-006-locales] a[aria-current="true"]{background:oklch(0.55 0.02 265 / 10%)}
[data-vibeui-navbar-006-locales] [data-part="region"]{margin-left:auto;color:oklch(0.54 0.012 265);font-size:0.75rem;font-weight:450}
/* Где есть якорное позиционирование — список встаёт прямо под кнопкой. */
@supports (anchor-name:--vibeui-navbar-006-globe){
[data-vibeui-block="navbar-006"] [data-part="globe"]{anchor-name:--vibeui-navbar-006-globe}
[data-vibeui-navbar-006-locales]{position-anchor:--vibeui-navbar-006-globe;position-area:bottom span-left;inset:auto;margin-top:0.5rem}
}
@container (min-width: 52rem){
[data-vibeui-block="navbar-006"] [data-part="shell"]{padding:0.875rem 2rem;gap:1.25rem;flex-wrap:nowrap}
[data-vibeui-block="navbar-006"] [data-part="brand"]{margin-right:0}
[data-vibeui-block="navbar-006"] [data-part="links"]{order:0;flex:1 1 auto;padding-top:0;border-top:0;overflow:visible}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="navbar-006"] *{animation:none!important;transition:none!important}
[data-vibeui-navbar-006-locales]{transition:none!important}
}
`

const DEFAULT_LINKS: Navbar006Link[] = [
  { label: "О компании", href: "#about" },
  { label: "Услуги", href: "#services" },
  { label: "Офисы", href: "#offices" },
  { label: "Контакты", href: "#contacts" },
]

const DEFAULT_LOCALES: Navbar006Locale[] = [
  { code: "RU", label: "Русский", region: "Россия", href: "/ru" },
  { code: "EN", label: "English", region: "Global", href: "/en" },
  { code: "DE", label: "Deutsch", region: "Deutschland", href: "/de" },
  { code: "KK", label: "Қазақша", region: "Қазақстан", href: "/kk" },
]

/** Шапка с переключателем языка: список локалей открывается HTML popover. */
export function Navbar006({
  brand = "Ориентир",
  links = DEFAULT_LINKS,
  locales = DEFAULT_LOCALES,
  currentLocale = "RU",
  actionLabel = "Связаться",
  actionHref = "#contact",
  id = "vibeui-navbar-006-locales",
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
      <header
        data-vibeui-block="navbar-006"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <a data-part="brand" href="#top">
            <span data-part="mark" aria-hidden="true" />
            {brand}
          </a>
          <nav data-part="links" aria-label="Основная навигация">
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <button
            data-part="globe"
            type="button"
            popoverTarget={id}
            aria-label={`Язык сайта: ${currentLocale}. Выбрать другой`}
          >
            {currentLocale}
          </button>
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
        </div>
        <div
          id={id}
          popover="auto"
          data-vibeui-navbar-006-locales=""
          style={palette}
        >
          {locales.map((locale) => (
            <a
              key={locale.code}
              href={locale.href}
              lang={locale.code.toLowerCase()}
              aria-current={locale.code === currentLocale ? "true" : undefined}
            >
              {locale.label}
              <span data-part="region">{locale.region}</span>
            </a>
          ))}
        </div>
      </header>
    </>
  )
}

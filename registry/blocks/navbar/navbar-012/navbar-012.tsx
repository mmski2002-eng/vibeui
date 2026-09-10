import type { CSSProperties } from "react"

type Navbar012Link = {
  label: string
  href: string
  current?: boolean
}

export type Navbar012Props = {
  /** Крупный текстовый знак издания. */
  brand?: string
  /** Служебная строка над знаком. */
  dateline?: string
  /** Рубрики под знаком. */
  sections?: Navbar012Link[]
  sectionsLabel?: string
  subscribeLabel?: string
  subscribeHref?: string
  searchLabel?: string
  searchAction?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Редакционная шапка с крупным названием: текстовый знак по центру,
// над ним тихая служебная строка с датой, под ним строка рубрик между
// тонкими чёрными линейками. Белая бумажная композиция; оранжевый — у
// подписки и активной рубрики. Знак масштабируется от ширины блока и
// не обрезается. Без клиентского JS.
const STYLES = `
:where([data-vibeui-block="navbar-012"]){
--vibeui-navbar-012-bg:#ffffff;
--vibeui-navbar-012-ink:#000000;
--vibeui-navbar-012-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-navbar-012-line:color-mix(in oklab,#000000 16%,transparent);
--vibeui-navbar-012-accent:#ff5900;
--vibeui-navbar-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="navbar-012"]{
display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-012-bg);color:var(--vibeui-navbar-012-ink);
border-bottom:2px solid var(--vibeui-navbar-012-ink);
font-family:var(--vibeui-navbar-012-font);
}
[data-vibeui-block="navbar-012"] *{box-sizing:border-box}
[data-vibeui-block="navbar-012"] [data-part="shell"]{
max-width:82rem;margin:0 auto;padding:0.75rem 1rem 0;
display:flex;flex-direction:column;
}
[data-vibeui-block="navbar-012"] [data-part="service"]{
display:flex;align-items:center;gap:1rem;
padding-bottom:0.625rem;border-bottom:1px solid var(--vibeui-navbar-012-line);
font-size:0.75rem;color:var(--vibeui-navbar-012-muted);
}
[data-vibeui-block="navbar-012"] [data-part="service"] a{
margin-left:auto;color:var(--vibeui-navbar-012-ink);text-decoration:none;
font-weight:640;
border-bottom:2px solid var(--vibeui-navbar-012-accent);padding-bottom:0.0625rem;
transition:color .16s ease;
}
[data-vibeui-block="navbar-012"] [data-part="service"] a:hover{color:var(--vibeui-navbar-012-accent)}
[data-vibeui-block="navbar-012"] [data-part="brand"]{
display:block;text-align:center;color:inherit;text-decoration:none;
padding:clamp(0.75rem,2.4cqi,1.5rem) 0;
font-size:clamp(2rem,7.5cqi,4.5rem);line-height:0.95;
letter-spacing:-0.035em;font-weight:780;
}
[data-vibeui-block="navbar-012"] [data-part="rubrics"]{
display:flex;align-items:center;gap:0.25rem;flex-wrap:nowrap;
justify-content:flex-start;overflow-x:auto;scrollbar-width:none;
border-top:1px solid var(--vibeui-navbar-012-line);
}
[data-vibeui-block="navbar-012"] [data-part="rubrics"]::-webkit-scrollbar{display:none}
[data-vibeui-block="navbar-012"] [data-part="rubrics"] a{
flex:none;padding:0.6875rem 0.8125rem;
color:var(--vibeui-navbar-012-muted);text-decoration:none;
font-size:0.875rem;font-weight:560;letter-spacing:0.02em;white-space:nowrap;
transition:color .16s ease;
}
[data-vibeui-block="navbar-012"] [data-part="rubrics"] a:hover{color:var(--vibeui-navbar-012-ink)}
[data-vibeui-block="navbar-012"] [data-part="rubrics"] a[aria-current="page"]{
color:var(--vibeui-navbar-012-ink);
box-shadow:inset 0 -3px 0 var(--vibeui-navbar-012-accent);
}
[data-vibeui-block="navbar-012"] [data-part="search"]{
flex:none;margin-left:auto;display:inline-flex;align-items:center;justify-content:center;
width:2.5rem;height:2.5rem;color:var(--vibeui-navbar-012-ink);
}
[data-vibeui-block="navbar-012"] [data-part="search"]:hover{color:var(--vibeui-navbar-012-accent)}
[data-vibeui-block="navbar-012"] [data-part="search"] svg{width:1.125rem;height:1.125rem}
[data-vibeui-block="navbar-012"] a:focus-visible{
outline:2px solid var(--vibeui-navbar-012-accent);outline-offset:2px;
}
@container (min-width: 52rem){
[data-vibeui-block="navbar-012"] [data-part="shell"]{padding:0.875rem 2rem 0}
[data-vibeui-block="navbar-012"] [data-part="rubrics"]{justify-content:center}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SECTIONS: Navbar012Link[] = [
  { label: "Главное", href: "#main", current: true },
  { label: "Практика", href: "#practice" },
  { label: "Люди", href: "#people" },
  { label: "Обзоры", href: "#reviews" },
  { label: "Мнения", href: "#opinions" },
  { label: "Архив", href: "#archive" },
]

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/** Редакционная шапка: крупный центральный знак, дата и строка рубрик. */
export function Navbar012({
  brand = "Сетка",
  dateline = "Среда, 10 сентября 2026",
  sections = DEFAULT_SECTIONS,
  sectionsLabel = "Рубрики",
  subscribeLabel = "Подписаться",
  subscribeHref = "#subscribe",
  searchLabel = "Поиск по изданию",
  searchAction = "#search",
  accent,
  className,
  style,
}: Navbar012Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-012" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-012" className={className} style={palette}>
        <div data-part="shell">
          <div data-part="service">
            <span>{dateline}</span>
            <a href={subscribeHref}>{subscribeLabel}</a>
          </div>
          <a data-part="brand" href="#top">
            {brand}
          </a>
          <nav data-part="rubrics" aria-label={sectionsLabel}>
            {sections.map((section) => (
              <a
                key={section.href}
                href={section.href}
                aria-current={section.current ? "page" : undefined}
              >
                {section.label}
              </a>
            ))}
            <a data-part="search" href={searchAction} aria-label={searchLabel}>
              <SearchIcon />
            </a>
          </nav>
        </div>
      </header>
    </>
  )
}

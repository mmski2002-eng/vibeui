import type { CSSProperties } from "react"

type Navbar009Link = {
  label: string
  href: string
}

export type Navbar009Props = {
  brand?: string
  announcement?: string
  announcementLabel?: string
  announcementHref?: string
  links?: Navbar009Link[]
  actionLabel?: string
  actionHref?: string
  id?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Шапка с полосой объявления над ней. Полоса закрывается без JS: скрытый
// чекбокс держит состояние, а :has() убирает объявление, когда он отмечен.
// Чекбокс остаётся в потоке фокуса, поэтому крестик доступен с клавиатуры —
// в отличие от привычного «повесим onClick на span».
const STYLES = `
:where([data-vibeui-block="navbar-009"]){
--vibeui-navbar-009-bg:oklch(1 0 0);
--vibeui-navbar-009-ink:oklch(0.23 0.014 265);
--vibeui-navbar-009-muted:oklch(0.54 0.014 265);
--vibeui-navbar-009-border:oklch(0.91 0.005 265);
--vibeui-navbar-009-accent:oklch(0.48 0.18 300);
--vibeui-navbar-009-accent-fg:oklch(0.99 0 0);
--vibeui-navbar-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="navbar-009"]{
display:block;background:var(--vibeui-navbar-009-bg);color:var(--vibeui-navbar-009-ink);
border-bottom:1px solid var(--vibeui-navbar-009-border);
font-family:var(--vibeui-navbar-009-font);
}
[data-vibeui-block="navbar-009"] [data-part="switch"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
[data-vibeui-block="navbar-009"] [data-part="promo"]{
display:flex;align-items:center;justify-content:center;gap:0.625rem;
padding:0.5rem 2.75rem 0.5rem 1rem;position:relative;
background:linear-gradient(90deg,var(--vibeui-navbar-009-accent),color-mix(in oklab,var(--vibeui-navbar-009-accent) 62%,oklch(0.55 0.19 240)));
color:var(--vibeui-navbar-009-accent-fg);
font-size:0.8125rem;line-height:1.35;text-align:center;
}
[data-vibeui-block="navbar-009"] [data-part="promo"] p{margin:0}
[data-vibeui-block="navbar-009"] [data-part="promo"] a{
color:inherit;font-weight:650;text-underline-offset:3px;white-space:nowrap;
}
[data-vibeui-block="navbar-009"] [data-part="close"]{
position:absolute;right:0.5rem;top:50%;transform:translateY(-50%);cursor:pointer;
display:grid;place-items:center;width:1.625rem;height:1.625rem;border-radius:0.5rem;
color:inherit;
transition:background-color .16s ease;
}
[data-vibeui-block="navbar-009"] [data-part="close"]:hover{background:oklch(1 0 0 / 18%)}
[data-vibeui-block="navbar-009"] [data-part="close"]::before,
[data-vibeui-block="navbar-009"] [data-part="close"]::after{
content:"";position:absolute;width:0.75rem;height:1.5px;border-radius:2px;background:currentColor;
}
[data-vibeui-block="navbar-009"] [data-part="close"]::before{transform:rotate(45deg)}
[data-vibeui-block="navbar-009"] [data-part="close"]::after{transform:rotate(-45deg)}
[data-vibeui-block="navbar-009"]:has([data-part="switch"]:focus-visible) [data-part="close"]{outline:2px solid var(--vibeui-navbar-009-accent-fg);outline-offset:2px}
[data-vibeui-block="navbar-009"]:has([data-part="switch"]:checked) [data-part="promo"]{display:none}
[data-vibeui-block="navbar-009"] [data-part="shell"]{
display:flex;align-items:center;gap:0.75rem;
max-width:80rem;margin:0 auto;padding:0.8125rem 1rem;
}
[data-vibeui-block="navbar-009"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5rem;flex:none;
color:inherit;text-decoration:none;font-size:1rem;font-weight:690;letter-spacing:-0.02em;
}
[data-vibeui-block="navbar-009"] [data-part="mark"]{
width:1.5rem;height:1.5rem;border-radius:0.4375rem;
background:linear-gradient(140deg,var(--vibeui-navbar-009-accent),color-mix(in oklab,var(--vibeui-navbar-009-accent) 50%,white));
}
[data-vibeui-block="navbar-009"] [data-part="links"]{display:none;align-items:center;gap:1.25rem;margin-inline:auto}
[data-vibeui-block="navbar-009"] [data-part="links"] a{
color:var(--vibeui-navbar-009-muted);text-decoration:none;font-size:0.875rem;font-weight:520;
transition:color .16s ease;
}
[data-vibeui-block="navbar-009"] [data-part="links"] a:hover{color:var(--vibeui-navbar-009-ink)}
[data-vibeui-block="navbar-009"] [data-part="action"]{
display:inline-flex;align-items:center;height:2.25rem;padding:0 1rem;margin-left:auto;flex:none;
border-radius:0.625rem;background:var(--vibeui-navbar-009-accent);color:var(--vibeui-navbar-009-accent-fg);
text-decoration:none;font-size:0.875rem;font-weight:620;white-space:nowrap;
}
[data-vibeui-block="navbar-009"] a:focus-visible{outline:2px solid var(--vibeui-navbar-009-accent);outline-offset:2px}
@container (min-width: 48rem){
[data-vibeui-block="navbar-009"] [data-part="promo"]{padding-inline:2.75rem;font-size:0.875rem}
[data-vibeui-block="navbar-009"] [data-part="shell"]{padding:0.875rem 2rem}
[data-vibeui-block="navbar-009"] [data-part="links"]{display:flex}
[data-vibeui-block="navbar-009"] [data-part="action"]{margin-left:0}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Navbar009Link[] = [
  { label: "Программа", href: "#program" },
  { label: "Спикеры", href: "#speakers" },
  { label: "Партнёры", href: "#partners" },
  { label: "Билеты", href: "#tickets" },
]

/** Шапка с полосой объявления сверху; полоса закрывается без JS через :has(). */
export function Navbar009({
  brand = "Импульс",
  announcement = "Ранние билеты на конференцию заканчиваются в пятницу.",
  announcementLabel = "Забрать место",
  announcementHref = "#tickets",
  links = DEFAULT_LINKS,
  actionLabel = "Купить билет",
  actionHref = "#buy",
  id = "vibeui-navbar-009-switch",
  accent,
  className,
  style,
}: Navbar009Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-009" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-009"
        className={className}
        style={palette}
      >
        <input
          data-part="switch"
          id={id}
          type="checkbox"
          aria-label="Скрыть объявление"
        />
        <aside data-part="promo" aria-label="Объявление">
          <p>
            {announcement} <a href={announcementHref}>{announcementLabel}</a>
          </p>
          <label
            data-part="close"
            htmlFor={id}
            title="Скрыть объявление"
            aria-hidden="true"
          />
        </aside>
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
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
        </div>
      </header>
    </>
  )
}

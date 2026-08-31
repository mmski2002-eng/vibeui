import type { CSSProperties } from "react"

type Navbar004Link = {
  label: string
  href: string
}

export type Navbar004Props = {
  brand?: string
  links?: Navbar004Link[]
  actionLabel?: string
  actionHref?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Прозрачная шапка над обложкой, которая уплотняется при прокрутке —
// без единой строки JS и без слушателя scroll. Всё делает анимация,
// привязанная к прогрессу прокрутки страницы (animation-timeline:scroll()).
// Пока браузер её не поддерживает, шапка просто остаётся развёрнутой:
// это честная деградация, а не сломанный макет.
const STYLES = `
:where([data-vibeui-block="navbar-004"]){
--vibeui-navbar-004-ink:oklch(0.98 0.003 265);
--vibeui-navbar-004-muted:oklch(0.86 0.012 265);
--vibeui-navbar-004-veil:oklch(0.18 0.03 265 / 72%);
--vibeui-navbar-004-border:oklch(1 0 0 / 16%);
--vibeui-navbar-004-accent:oklch(0.78 0.15 78);
--vibeui-navbar-004-accent-fg:oklch(0.24 0.05 78);
--vibeui-navbar-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="navbar-004"]{
display:block;position:relative;isolation:isolate;
color:var(--vibeui-navbar-004-ink);font-family:var(--vibeui-navbar-004-font);
background:radial-gradient(120% 180% at 12% -40%,oklch(0.42 0.14 268),oklch(0.19 0.05 268) 62%);
}
[data-vibeui-block="navbar-004"] [data-part="shell"]{
display:flex;align-items:center;gap:1rem;
padding:1.5rem 1.25rem;
border-bottom:1px solid transparent;
background:transparent;
backdrop-filter:blur(0px);
}
[data-vibeui-block="navbar-004"] [data-part="brand"]{
display:inline-flex;align-items:baseline;gap:0.4375rem;flex:none;
color:inherit;text-decoration:none;font-size:1.125rem;font-weight:700;letter-spacing:-0.03em;
}
[data-vibeui-block="navbar-004"] [data-part="dot"]{
width:0.4375rem;height:0.4375rem;border-radius:999px;background:var(--vibeui-navbar-004-accent);
}
[data-vibeui-block="navbar-004"] [data-part="links"]{
display:none;align-items:center;gap:1.5rem;margin-inline:auto;
}
[data-vibeui-block="navbar-004"] [data-part="links"] a{
color:var(--vibeui-navbar-004-muted);text-decoration:none;
font-size:0.875rem;font-weight:500;
transition:color .16s ease;
}
[data-vibeui-block="navbar-004"] [data-part="links"] a:hover{color:var(--vibeui-navbar-004-ink)}
[data-vibeui-block="navbar-004"] [data-part="action"]{
display:inline-flex;align-items:center;height:2.375rem;padding:0 1.125rem;margin-left:auto;flex:none;
border-radius:999px;background:var(--vibeui-navbar-004-accent);color:var(--vibeui-navbar-004-accent-fg);
text-decoration:none;font-size:0.875rem;font-weight:650;white-space:nowrap;
}
[data-vibeui-block="navbar-004"] [data-part="hint"]{
display:block;padding:0 1.25rem 2.25rem;margin:0;max-width:34ch;
color:var(--vibeui-navbar-004-muted);font-size:0.9375rem;line-height:1.5;
}
[data-vibeui-block="navbar-004"] a:focus-visible{outline:2px solid var(--vibeui-navbar-004-accent);outline-offset:3px}
@keyframes vibeui-navbar-004-condense{
to{
padding-top:0.625rem;padding-bottom:0.625rem;
background:var(--vibeui-navbar-004-veil);
border-bottom-color:var(--vibeui-navbar-004-border);
backdrop-filter:blur(14px) saturate(1.3);
}
}
@supports (animation-timeline:scroll()){
[data-vibeui-block="navbar-004"] [data-part="shell"]{animation:vibeui-navbar-004-condense linear both;animation-timeline:scroll(root block);animation-range:0 9rem}
}
@container (min-width: 48rem){
[data-vibeui-block="navbar-004"] [data-part="shell"]{padding-inline:2.5rem}
[data-vibeui-block="navbar-004"] [data-part="links"]{display:flex}
[data-vibeui-block="navbar-004"] [data-part="action"]{margin-left:0}
[data-vibeui-block="navbar-004"] [data-part="hint"]{padding-inline:2.5rem;font-size:1rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Navbar004Link[] = [
  { label: "Маршруты", href: "#routes" },
  { label: "Экипаж", href: "#crew" },
  { label: "Цены", href: "#prices" },
  { label: "Отзывы", href: "#reviews" },
]

/** Прозрачная шапка над обложкой: уплотняется при прокрутке, JS не нужен. */
export function Navbar004({
  brand = "Меридиан",
  links = DEFAULT_LINKS,
  actionLabel = "Забронировать",
  actionHref = "#booking",
  accent,
  className,
  style,
}: Navbar004Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-004" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-004"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <a data-part="brand" href="#top">
            {brand}
            <span data-part="dot" aria-hidden="true" />
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
        <p data-part="hint">
          Шапка лежит поверх обложки и сжимается сама, как только страница
          уезжает вверх.
        </p>
      </header>
    </>
  )
}

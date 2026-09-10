import type { CSSProperties } from "react"

type Navbar008Link = {
  label: string
  href: string
  current?: boolean
}

export type Navbar008Props = {
  brand?: string
  markLabel?: string
  navLabel?: string
  menuLabel?: string
  links?: Navbar008Link[]
  actionLabel?: string
  actionHref?: string
  /** Контрастная версия: для тёмного кадра или для светлого. */
  theme?: "on-dark" | "on-light"
  /** Показать демонстрационный кадр под шапкой. */
  demo?: boolean
  accent?: string
  className?: string
  style?: CSSProperties
}

// Шапка поверх фотографии или видео: логотип и ссылки накладываются на
// первый кадр, небольшое оранжевое действие сохраняет узнаваемость.
// Контрастная версия выбирается заранее пропом theme — читаемость не
// вычисляется случайным смешиванием с пикселями. Меню на узкой ширине
// открывается на непрозрачной графитовой поверхности. Состояние «после
// hero» (сплошная панель) включает принимающий проект своей логикой.
const STYLES = `
:where([data-vibeui-block="navbar-008"]){
--vibeui-navbar-008-ink:#ffffff;
--vibeui-navbar-008-muted:color-mix(in oklab,#ffffff 76%,transparent);
--vibeui-navbar-008-line:color-mix(in oklab,#ffffff 30%,transparent);
--vibeui-navbar-008-panel:#1a1a1a;
--vibeui-navbar-008-accent:#ff5900;
--vibeui-navbar-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where([data-vibeui-block="navbar-008"][data-theme="on-light"]){
--vibeui-navbar-008-ink:#000000;
--vibeui-navbar-008-muted:color-mix(in oklab,#000000 68%,transparent);
--vibeui-navbar-008-line:color-mix(in oklab,#000000 26%,transparent);
}
[data-vibeui-block="navbar-008"]{
position:relative;display:block;min-width:min(100%,16rem);
color:var(--vibeui-navbar-008-ink);
font-family:var(--vibeui-navbar-008-font);
}
[data-vibeui-block="navbar-008"] *{box-sizing:border-box}
[data-vibeui-block="navbar-008"] [data-part="demo-scene"]{
position:absolute;inset:0;overflow:hidden;pointer-events:none;
background:linear-gradient(160deg,#3a4650 0%,#67747d 38%,#8f8577 62%,#3b352e 100%);
}
[data-vibeui-block="navbar-008"] [data-part="demo-scene"]::after{
content:"";position:absolute;inset:0;
background:radial-gradient(28rem 14rem at 76% 30%,rgb(255 210 160 / 30%),transparent 62%),linear-gradient(rgb(0 0 0 / 34%),transparent 55%);
}
[data-vibeui-block="navbar-008"][data-theme="on-light"] [data-part="demo-scene"]{
background:linear-gradient(160deg,#f4f2ee 0%,#e6e2da 52%,#d5d0c6 100%);
}
[data-vibeui-block="navbar-008"][data-theme="on-light"] [data-part="demo-scene"]::after{
background:radial-gradient(28rem 14rem at 76% 30%,rgb(255 214 170 / 40%),transparent 62%);
}
[data-vibeui-block="navbar-008"] [data-part="shell"]{
position:relative;display:flex;align-items:center;gap:1rem;
max-width:82rem;margin:0 auto;padding:1rem;
}
[data-vibeui-block="navbar-008"][data-demo="on"] [data-part="shell"]{padding-bottom:7rem}
[data-vibeui-block="navbar-008"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5625rem;flex:none;
color:inherit;text-decoration:none;font-size:1.125rem;font-weight:700;letter-spacing:-0.02em;
text-shadow:0 1px 12px rgb(0 0 0 / 20%);
}
[data-vibeui-block="navbar-008"][data-theme="on-light"] [data-part="brand"]{text-shadow:none}
[data-vibeui-block="navbar-008"] [data-part="mark"]{
width:1.75rem;height:1.75rem;flex:none;display:grid;place-items:center;
background:var(--vibeui-navbar-008-accent);color:#000000;
font-size:0.8125rem;font-weight:800;text-shadow:none;
}
[data-vibeui-block="navbar-008"] [data-part="nav"]{
display:none;align-items:center;gap:0.25rem;margin:0 auto;
}
[data-vibeui-block="navbar-008"] [data-part="nav"] a{
padding:0.5rem 0.75rem;
color:var(--vibeui-navbar-008-muted);text-decoration:none;
font-size:0.9375rem;font-weight:540;white-space:nowrap;
transition:color .16s ease;
}
[data-vibeui-block="navbar-008"] [data-part="nav"] a:hover{color:var(--vibeui-navbar-008-ink)}
[data-vibeui-block="navbar-008"] [data-part="nav"] a[aria-current="page"]{
color:var(--vibeui-navbar-008-ink);
box-shadow:inset 0 -2px 0 var(--vibeui-navbar-008-accent);
}
[data-vibeui-block="navbar-008"] [data-part="action"]{
display:inline-flex;align-items:center;min-height:2.375rem;padding:0.25rem 1.0625rem;
margin-left:auto;flex:none;
background:var(--vibeui-navbar-008-accent);color:#000000;
text-decoration:none;font-size:0.9375rem;font-weight:640;white-space:nowrap;
transition:filter .16s ease;
}
[data-vibeui-block="navbar-008"] [data-part="action"]:hover{filter:brightness(1.06)}
[data-vibeui-block="navbar-008"] [data-part="menu"]{flex:none;position:relative}
[data-vibeui-block="navbar-008"] [data-part="menu"] summary{
list-style:none;cursor:pointer;user-select:none;
display:inline-flex;align-items:center;gap:0.4375rem;
min-height:2.375rem;padding:0.25rem 0.875rem;
border:1px solid var(--vibeui-navbar-008-line);
color:var(--vibeui-navbar-008-ink);font-size:0.9375rem;font-weight:560;
}
[data-vibeui-block="navbar-008"] [data-part="menu"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="navbar-008"] [data-part="panel"]{
position:absolute;right:0;top:calc(100% + 0.5rem);z-index:20;min-width:14rem;
background:var(--vibeui-navbar-008-panel);
box-shadow:0 0.75rem 2rem rgb(0 0 0 / 30%);
padding:0.5rem;display:flex;flex-direction:column;
}
[data-vibeui-block="navbar-008"] [data-part="panel"] a{
padding:0.6875rem 0.75rem;color:#ffffff;text-decoration:none;
font-size:0.9375rem;font-weight:540;
}
[data-vibeui-block="navbar-008"] [data-part="panel"] a:hover{color:var(--vibeui-navbar-008-accent)}
[data-vibeui-block="navbar-008"] [data-part="panel"] a[aria-current="page"]{
color:var(--vibeui-navbar-008-accent);
}
[data-vibeui-block="navbar-008"] a:focus-visible,
[data-vibeui-block="navbar-008"] summary:focus-visible{
outline:2px solid var(--vibeui-navbar-008-accent);outline-offset:2px;
}
@container (min-width: 52rem){
[data-vibeui-block="navbar-008"] [data-part="shell"]{padding:1.25rem 2rem;gap:1.5rem}
[data-vibeui-block="navbar-008"][data-demo="on"] [data-part="shell"]{padding-bottom:8rem}
[data-vibeui-block="navbar-008"] [data-part="nav"]{display:flex}
[data-vibeui-block="navbar-008"] [data-part="menu"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Navbar008Link[] = [
  { label: "Номера", href: "#rooms", current: true },
  { label: "Ресторан", href: "#restaurant" },
  { label: "Спа", href: "#spa" },
  { label: "Контакты", href: "#contacts" },
]

/** Прозрачная шапка поверх фото или видео с заранее выбранной контрастной версией. */
export function Navbar008({
  brand = "Перевал",
  markLabel = "П",
  navLabel = "Разделы сайта",
  menuLabel = "Меню",
  links = DEFAULT_LINKS,
  actionLabel = "Забронировать",
  actionHref = "#book",
  theme = "on-dark",
  demo = true,
  accent,
  className,
  style,
}: Navbar008Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-008" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-008"
        data-theme={theme === "on-light" ? "on-light" : undefined}
        data-demo={demo ? "on" : undefined}
        className={className}
        style={palette}
      >
        {demo ? <div data-part="demo-scene" aria-hidden="true" /> : null}
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

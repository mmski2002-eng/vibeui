import type { CSSProperties } from "react"

type Navbar009Branch = {
  label: string
  address: string
  href: string
}

export type Navbar009Props = {
  name?: string
  /** Короткое описание услуги под названием. */
  tagline?: string
  phone?: string
  phoneHref?: string
  callLabel?: string
  hours?: string
  branchLabel?: string
  branches?: Navbar009Branch[]
  actionLabel?: string
  actionHref?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Шапка локального бизнеса: название и короткое описание услуги, телефон
// настоящей ссылкой tel:, часы работы, выбор филиала раскрытием и
// оранжевая запись. Спокойная белая поверхность. Онлайн-запись не
// изображается подключённой: кнопка ведёт по переданной ссылке, реальную
// запись обслуживает принимающий проект. Без клиентского JS.
const STYLES = `
:where([data-vibeui-block="navbar-009"]){
--vibeui-navbar-009-bg:#ffffff;
--vibeui-navbar-009-ink:#000000;
--vibeui-navbar-009-muted:color-mix(in oklab,#000000 58%,#ffffff);
--vibeui-navbar-009-line:color-mix(in oklab,#000000 12%,transparent);
--vibeui-navbar-009-field:#f2f2f2;
--vibeui-navbar-009-accent:#ff5900;
--vibeui-navbar-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="navbar-009"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-009-bg);color:var(--vibeui-navbar-009-ink);
border-bottom:1px solid var(--vibeui-navbar-009-line);
font-family:var(--vibeui-navbar-009-font);
}
[data-vibeui-block="navbar-009"] *{box-sizing:border-box}
[data-vibeui-block="navbar-009"] [data-part="shell"]{
display:flex;align-items:center;flex-wrap:wrap;gap:0.75rem 1.25rem;
max-width:82rem;margin:0 auto;padding:0.875rem 1rem;
}
[data-vibeui-block="navbar-009"] [data-part="ident"]{
display:flex;flex-direction:column;gap:0.125rem;flex:1 1 12rem;min-width:0;
}
[data-vibeui-block="navbar-009"] [data-part="name"]{
color:inherit;text-decoration:none;
font-size:1.1875rem;font-weight:700;letter-spacing:-0.02em;
}
[data-vibeui-block="navbar-009"] [data-part="tagline"]{
margin:0;font-size:0.8125rem;color:var(--vibeui-navbar-009-muted);
}
[data-vibeui-block="navbar-009"] [data-part="branch"]{position:relative;flex:none}
[data-vibeui-block="navbar-009"] [data-part="branch"] summary{
list-style:none;cursor:pointer;user-select:none;
display:inline-flex;align-items:center;gap:0.4375rem;max-width:16rem;
padding:0.375rem 0.625rem;border:1px solid var(--vibeui-navbar-009-line);
font-size:0.8125rem;color:var(--vibeui-navbar-009-muted);
}
[data-vibeui-block="navbar-009"] [data-part="branch"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="navbar-009"] [data-part="branch"] summary::before{
content:"";width:0.5rem;height:0.5rem;flex:none;border-radius:999px;
border:2px solid var(--vibeui-navbar-009-accent);
}
[data-vibeui-block="navbar-009"] [data-part="branch"] summary span{
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="navbar-009"] [data-part="branch-panel"]{
position:absolute;left:0;top:calc(100% + 0.375rem);z-index:20;min-width:16rem;
background:var(--vibeui-navbar-009-bg);border:1px solid var(--vibeui-navbar-009-line);
box-shadow:0 0.75rem 2rem rgb(0 0 0 / 14%);
display:flex;flex-direction:column;padding:0.25rem;
}
[data-vibeui-block="navbar-009"] [data-part="branch-panel"] a{
display:flex;flex-direction:column;gap:0.125rem;
padding:0.5625rem 0.75rem;color:var(--vibeui-navbar-009-ink);text-decoration:none;
}
[data-vibeui-block="navbar-009"] [data-part="branch-panel"] a:hover{background:var(--vibeui-navbar-009-field)}
[data-vibeui-block="navbar-009"] [data-part="branch-panel"] strong{
font-size:0.875rem;font-weight:600;
}
[data-vibeui-block="navbar-009"] [data-part="branch-panel"] span{
font-size:0.8125rem;color:var(--vibeui-navbar-009-muted);
}
[data-vibeui-block="navbar-009"] [data-part="contact"]{
display:flex;flex-direction:column;align-items:flex-end;gap:0.125rem;
margin-left:auto;flex:none;
}
[data-vibeui-block="navbar-009"] [data-part="phone"]{
color:inherit;text-decoration:none;
font-size:1.0625rem;font-weight:680;letter-spacing:-0.01em;white-space:nowrap;
transition:color .16s ease;
}
[data-vibeui-block="navbar-009"] [data-part="phone"]:hover{color:var(--vibeui-navbar-009-accent)}
[data-vibeui-block="navbar-009"] [data-part="hours"]{
margin:0;font-size:0.75rem;color:var(--vibeui-navbar-009-muted);white-space:nowrap;
}
[data-vibeui-block="navbar-009"] [data-part="actions"]{
display:flex;gap:0.5rem;flex:1 1 100%;
}
[data-vibeui-block="navbar-009"] [data-part="call"]{
display:none;
}
[data-vibeui-block="navbar-009"] [data-part="book"]{
flex:1 1 auto;display:inline-flex;align-items:center;justify-content:center;
min-height:2.75rem;padding:0.25rem 1.25rem;
background:var(--vibeui-navbar-009-accent);color:#000000;
text-decoration:none;font-size:1rem;font-weight:650;white-space:nowrap;
transition:filter .16s ease;
}
[data-vibeui-block="navbar-009"] [data-part="book"]:hover{filter:brightness(1.06)}
[data-vibeui-block="navbar-009"] a:focus-visible,
[data-vibeui-block="navbar-009"] summary:focus-visible{
outline:2px solid var(--vibeui-navbar-009-accent);outline-offset:2px;
}
@container (max-width: 47.9375rem){
[data-vibeui-block="navbar-009"] [data-part="contact"]{display:none}
[data-vibeui-block="navbar-009"] [data-part="call"]{
flex:1 1 auto;display:inline-flex;align-items:center;justify-content:center;
min-height:2.75rem;padding:0.25rem 1.25rem;
border:1.5px solid var(--vibeui-navbar-009-ink);color:var(--vibeui-navbar-009-ink);
text-decoration:none;font-size:1rem;font-weight:600;white-space:nowrap;
}
}
@container (min-width: 48rem){
[data-vibeui-block="navbar-009"] [data-part="shell"]{padding:1rem 2rem;flex-wrap:nowrap}
[data-vibeui-block="navbar-009"] [data-part="actions"]{flex:none}
[data-vibeui-block="navbar-009"] [data-part="book"]{flex:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_BRANCHES: Navbar009Branch[] = [
  { label: "На Ленина", address: "пр. Ленина, 52", href: "#lenina" },
  { label: "На Малышева", address: "ул. Малышева, 18", href: "#malysheva" },
]

/** Шапка бизнеса: название, телефон, часы, филиал и оранжевая запись. */
export function Navbar009({
  name = "Клиника «Ясно»",
  tagline = "Стоматология для всей семьи",
  phone = "+7 343 222-14-08",
  phoneHref = "tel:+73432221408",
  callLabel = "Позвонить",
  hours = "Ежедневно 9:00–21:00",
  branchLabel = "Филиал",
  branches = DEFAULT_BRANCHES,
  actionLabel = "Записаться",
  actionHref = "#appointment",
  accent,
  className,
  style,
}: Navbar009Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-009-accent": accent } : null),
    ...style,
  } as CSSProperties
  const current = branches[0]

  return (
    <>
      <style href="vibeui-navbar-009" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-009" className={className} style={palette}>
        <div data-part="shell">
          <div data-part="ident">
            <a data-part="name" href="#top">
              {name}
            </a>
            <p data-part="tagline">{tagline}</p>
          </div>
          {branches.length > 0 ? (
            <details data-part="branch">
              <summary aria-label={`${branchLabel}: ${current.label}, ${current.address}`}>
                <span>
                  {current.label} · {current.address}
                </span>
              </summary>
              <nav data-part="branch-panel" aria-label={branchLabel}>
                {branches.map((branch) => (
                  <a key={branch.href} href={branch.href}>
                    <strong>{branch.label}</strong>
                    <span>{branch.address}</span>
                  </a>
                ))}
              </nav>
            </details>
          ) : null}
          <div data-part="contact">
            <a data-part="phone" href={phoneHref}>
              {phone}
            </a>
            <p data-part="hours">{hours}</p>
          </div>
          <div data-part="actions">
            <a data-part="call" href={phoneHref}>
              {callLabel}
            </a>
            <a data-part="book" href={actionHref}>
              {actionLabel}
            </a>
          </div>
        </div>
      </header>
    </>
  )
}

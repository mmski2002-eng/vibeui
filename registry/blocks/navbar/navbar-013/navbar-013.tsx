import type { CSSProperties } from "react"

type Navbar013Link = {
  label: string
  href: string
  /** Короткая подпись справа от пункта. */
  note?: string
}

export type Navbar013Props = {
  brand?: string
  menuLabel?: string
  closeLabel?: string
  links?: Navbar013Link[]
  navLabel?: string
  /** Контакт внизу меню. */
  contactLabel?: string
  contactHref?: string
  /** Плоскость меню: чёрная или оранжевая. */
  surface?: "black" | "orange"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Полноэкранное типографическое меню: в закрытом виде минимум — знак и
// кнопка. Открытие через Popover API (атрибуты popover/popovertarget):
// нативный top layer, Escape, light-dismiss и возврат фокуса без единой
// строки JS. Внутри — крупные названия разделов с номерами и контакт.
// Чёрная или оранжевая плоскость. Каскадного въезда строк нет — при
// reduced motion и так ничего не движется.
const STYLES = `
:where([data-vibeui-block="navbar-013"]){
--vibeui-navbar-013-ink:#000000;
--vibeui-navbar-013-accent:#ff5900;
--vibeui-navbar-013-menu-bg:#000000;
--vibeui-navbar-013-menu-ink:#ffffff;
--vibeui-navbar-013-menu-muted:color-mix(in oklab,#ffffff 52%,#000000);
--vibeui-navbar-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where([data-vibeui-block="navbar-013"][data-surface="orange"]){
--vibeui-navbar-013-menu-bg:#ff5900;
--vibeui-navbar-013-menu-ink:#000000;
--vibeui-navbar-013-menu-muted:color-mix(in oklab,#000000 56%,#ff5900);
}
[data-vibeui-block="navbar-013"]{
display:block;min-width:min(100%,16rem);
color:var(--vibeui-navbar-013-ink);
font-family:var(--vibeui-navbar-013-font);
}
[data-vibeui-block="navbar-013"] *{box-sizing:border-box}
[data-vibeui-block="navbar-013"] [data-part="shell"]{
display:flex;align-items:center;justify-content:space-between;gap:1rem;
max-width:82rem;margin:0 auto;padding:1rem;
}
[data-vibeui-block="navbar-013"] [data-part="brand"]{
color:inherit;text-decoration:none;
font-size:1.125rem;font-weight:740;letter-spacing:-0.02em;
}
[data-vibeui-block="navbar-013"] [data-part="open"]{
appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;gap:0.5625rem;
min-height:2.5rem;padding:0.25rem 1.125rem;border-radius:999px;
background:var(--vibeui-navbar-013-ink);color:#ffffff;
font:inherit;font-size:0.9375rem;font-weight:600;
transition:background-color .16s ease;
}
[data-vibeui-block="navbar-013"] [data-part="open"]:hover{background:var(--vibeui-navbar-013-accent);color:#000000}
[data-vibeui-block="navbar-013"] [data-part="open"]::before{
content:"";width:1rem;height:0.75rem;
background:linear-gradient(currentColor 2px,transparent 2px) 0 0/100% 0.3125rem repeat-y;
}
[data-vibeui-block="navbar-013"] [data-part="sheet"]{
border:0;padding:0;width:100%;height:100%;max-width:none;max-height:none;
inset:0;position:fixed;
background:var(--vibeui-navbar-013-menu-bg);color:var(--vibeui-navbar-013-menu-ink);
font-family:var(--vibeui-navbar-013-font);
overflow:auto;
}
[data-vibeui-block="navbar-013"] [data-part="sheet"]::backdrop{background:transparent}
[data-vibeui-block="navbar-013"] [data-part="sheet-shell"]{
max-width:82rem;margin:0 auto;min-height:100%;
padding:1rem;display:flex;flex-direction:column;
}
[data-vibeui-block="navbar-013"] [data-part="sheet-top"]{
display:flex;align-items:center;justify-content:space-between;gap:1rem;
}
[data-vibeui-block="navbar-013"] [data-part="sheet-brand"]{
font-size:1.125rem;font-weight:740;letter-spacing:-0.02em;
}
[data-vibeui-block="navbar-013"] [data-part="close"]{
appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;gap:0.5rem;
min-height:2.5rem;padding:0.25rem 1.125rem;border-radius:999px;
background:transparent;color:inherit;
border:1.5px solid color-mix(in oklab,currentColor 40%,transparent);
font:inherit;font-size:0.9375rem;font-weight:600;
transition:border-color .16s ease;
}
[data-vibeui-block="navbar-013"] [data-part="close"]:hover{border-color:currentColor}
[data-vibeui-block="navbar-013"] [data-part="list"]{
display:flex;flex-direction:column;justify-content:center;flex:1 1 auto;
padding:2.5rem 0;
}
[data-vibeui-block="navbar-013"] [data-part="list"] a{
display:flex;align-items:baseline;gap:1.25rem;
padding:0.5rem 0;color:inherit;text-decoration:none;
border-bottom:1px solid color-mix(in oklab,currentColor 16%,transparent);
transition:color .16s ease;
}
[data-vibeui-block="navbar-013"][data-surface="orange"] [data-part="list"] a:hover{color:#ffffff}
[data-vibeui-block="navbar-013"]:not([data-surface="orange"]) [data-part="list"] a:hover{color:var(--vibeui-navbar-013-accent)}
[data-vibeui-block="navbar-013"] [data-part="index"]{
flex:none;font-size:0.875rem;font-weight:600;
color:var(--vibeui-navbar-013-menu-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="navbar-013"] [data-part="word"]{
font-size:clamp(2rem,7cqi,4.5rem);line-height:1.06;
letter-spacing:-0.03em;font-weight:740;
}
[data-vibeui-block="navbar-013"] [data-part="note"]{
margin-left:auto;font-size:0.875rem;color:var(--vibeui-navbar-013-menu-muted);
white-space:nowrap;
}
[data-vibeui-block="navbar-013"] [data-part="contact"]{
align-self:flex-start;color:inherit;text-decoration:none;
font-size:1.0625rem;font-weight:600;
border-bottom:2px solid currentColor;padding-bottom:0.125rem;
margin-bottom:1rem;
}
[data-vibeui-block="navbar-013"] a:focus-visible,
[data-vibeui-block="navbar-013"] button:focus-visible{
outline:2px solid var(--vibeui-navbar-013-accent);outline-offset:3px;
}
[data-vibeui-block="navbar-013"][data-surface="orange"] a:focus-visible,
[data-vibeui-block="navbar-013"][data-surface="orange"] button:focus-visible{
outline-color:#000000;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Navbar013Link[] = [
  { label: "Работы", href: "#works", note: "24 проекта" },
  { label: "Студия", href: "#studio", note: "О нас" },
  { label: "Услуги", href: "#services" },
  { label: "Журнал", href: "#journal" },
  { label: "Контакт", href: "#contact" },
]

/** Минимальная шапка с полноэкранным типографическим меню на Popover API. */
export function Navbar013({
  brand = "Бюро Тон",
  menuLabel = "Меню",
  closeLabel = "Закрыть",
  links = DEFAULT_LINKS,
  navLabel = "Разделы сайта",
  contactLabel = "hello@ton.studio",
  contactHref = "mailto:hello@ton.studio",
  surface = "black",
  accent,
  className,
  style,
}: Navbar013Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-013-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-013" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-013"
        data-surface={surface === "orange" ? "orange" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <a data-part="brand" href="#top">
            {brand}
          </a>
          <button data-part="open" type="button" popoverTarget="vibeui-navbar-013-sheet">
            {menuLabel}
          </button>
        </div>
        <div data-part="sheet" id="vibeui-navbar-013-sheet" popover="auto">
          <div data-part="sheet-shell">
            <div data-part="sheet-top">
              <span data-part="sheet-brand">{brand}</span>
              <button
                data-part="close"
                type="button"
                popoverTarget="vibeui-navbar-013-sheet"
                popoverTargetAction="hide"
              >
                {closeLabel}
              </button>
            </div>
            <nav data-part="list" aria-label={navLabel}>
              {links.map((link, index) => (
                <a key={link.href} href={link.href}>
                  <span data-part="index">{String(index + 1).padStart(2, "0")}</span>
                  <span data-part="word">{link.label}</span>
                  {link.note ? <span data-part="note">{link.note}</span> : null}
                </a>
              ))}
            </nav>
            <a data-part="contact" href={contactHref}>
              {contactLabel}
            </a>
          </div>
        </div>
      </header>
    </>
  )
}

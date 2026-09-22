"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { CSSProperties, ComponentProps } from "react"

type Navbar017Link = {
  label: string
  href: string
  current?: boolean
}

export type Navbar017Props = {
  /** Название события. */
  brand?: string
  /** Дата и город. */
  dateline?: string
  links?: Navbar017Link[]
  navLabel?: string
  menuLabel?: string
  closeLabel?: string
  ticketLabel?: string
  ticketHref?: string
  /** Состояние продаж: продажа, скоро, завершено. */
  sales?: "open" | "soon" | "closed"
  soonLabel?: string
  closedLabel?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  /** Плакатная чёрно-оранжевая версия. */
  poster?: boolean
  accent?: string
  className?: string
  style?: CSSProperties
}

// Шапка события: знак, дата и город капсулой, программа и кнопка билета.
// Кнопка сделана билетом буквально — с вырезами по краям: на странице
// фестиваля она должна читаться как объект, а не как очередная оранжевая
// плашка. Возможна плакатная чёрная версия со свечением.
//
// Состояние продаж функционально: «скоро» и «событие завершено»
// показываются вместо кнопки — без искусственного дефицита и таймеров.
// Билеты продаёт внешняя система по переданной ссылке. Клиентский JS
// нужен для каретки разделов и мобильной панели.
const STYLES = `
:where([data-vibeui-block="navbar-017"]){
--vibeui-navbar-017-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-017-ink:light-dark(#000000,#ffffff);
--vibeui-navbar-017-muted:light-dark(color-mix(in oklab,#000000 60%,#ffffff),color-mix(in oklab,#ffffff 68%,#1a1a1a));
--vibeui-navbar-017-line:light-dark(color-mix(in oklab,#000000 11%,transparent),color-mix(in oklab,#ffffff 15%,transparent));
--vibeui-navbar-017-hover:light-dark(color-mix(in oklab,#000000 5%,transparent),color-mix(in oklab,#ffffff 9%,transparent));
--vibeui-navbar-017-field:light-dark(#f2f2f2,color-mix(in oklab,#ffffff 8%,transparent));
--vibeui-navbar-017-sheen:light-dark(color-mix(in oklab,#ffffff 92%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-navbar-017-shadow:light-dark(0 1rem 2.5rem color-mix(in oklab,#000000 15%,transparent),0 1rem 2.5rem color-mix(in oklab,#000000 62%,transparent));
--vibeui-navbar-017-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-017-on-accent:oklch(from var(--vibeui-navbar-017-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-navbar-017-ease:cubic-bezier(.32,.72,0,1);
--vibeui-navbar-017-dur-1:130ms;
--vibeui-navbar-017-dur-2:180ms;
--vibeui-navbar-017-dur-3:240ms;
--vibeui-navbar-017-dur-4:340ms;
--vibeui-navbar-017-chip:light-dark(#f2f2f2,color-mix(in oklab,#ffffff 10%,transparent));
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-017"]{color-scheme:dark}
:where([data-vibeui-block="navbar-017"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-017"][data-tone="dark"]){color-scheme:dark}
:where([data-vibeui-block="navbar-017"][data-poster="on"]){
color-scheme:dark;
--vibeui-navbar-017-bg:#000000;
--vibeui-navbar-017-chip:color-mix(in oklab,#ffffff 10%,transparent);
}
[data-vibeui-block="navbar-017"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-017-bg);color:var(--vibeui-navbar-017-ink);
border-bottom:1px solid var(--vibeui-navbar-017-line);
font-family:var(--vibeui-navbar-017-font);
font-feature-settings:"cv11","ss01";
}
[data-vibeui-block="navbar-017"][data-poster="on"]::before{
content:"";position:absolute;inset:0;pointer-events:none;
background:radial-gradient(26rem 12rem at 82% -40%,color-mix(in oklab,var(--vibeui-navbar-017-accent) 46%,transparent),transparent 70%);
}
[data-vibeui-block="navbar-017"] *{box-sizing:border-box}
[data-vibeui-block="navbar-017"] [data-part="ticket"]{margin-left:auto;flex:none}
[data-vibeui-block="navbar-017"] [data-part="shell"]{
position:relative;display:flex;align-items:center;flex-wrap:wrap;gap:0.5rem 1rem;
max-width:82rem;margin:0 auto;padding:0.875rem 1rem;
}

[data-vibeui-block="navbar-017"] [data-part="ident"]{
display:flex;flex-direction:column;gap:0.25rem;flex:1 1 12rem;min-width:0;align-items:flex-start;
}
[data-vibeui-block="navbar-017"] [data-part="brand"]{
color:inherit;text-decoration:none;
font-size:1.375rem;font-weight:780;letter-spacing:-0.03em;
text-transform:uppercase;white-space:nowrap;
}
[data-vibeui-block="navbar-017"] [data-part="brand"] i{
font-style:normal;color:var(--vibeui-navbar-017-accent);
}
[data-vibeui-block="navbar-017"] [data-part="dateline"]{
display:inline-flex;align-items:center;gap:0.4375rem;
padding:0.1875rem 0.625rem;border-radius:999px;
background:var(--vibeui-navbar-017-chip);
font-size:0.75rem;font-weight:580;color:var(--vibeui-navbar-017-muted);
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;
}
[data-vibeui-block="navbar-017"] [data-part="dateline"]::before{
content:"";width:0.375rem;height:0.375rem;flex:none;border-radius:999px;
background:var(--vibeui-navbar-017-accent);color:oklch(from var(--vibeui-navbar-017-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}

[data-vibeui-block="navbar-017"] [data-part="nav"]{
display:none;position:relative;align-items:center;gap:0.125rem;margin:0 auto;
}
[data-vibeui-block="navbar-017"] [data-part="nav"] a{
position:relative;z-index:1;padding:0.5rem 0.75rem;border-radius:0.5rem;
color:var(--vibeui-navbar-017-muted);text-decoration:none;
font-size:0.9375rem;font-weight:560;white-space:nowrap;
transition:color var(--vibeui-navbar-017-dur-1) ease,background-color var(--vibeui-navbar-017-dur-2) ease;
}
[data-vibeui-block="navbar-017"] [data-part="nav"] a:hover{
color:var(--vibeui-navbar-017-ink);background:var(--vibeui-navbar-017-hover);
}
[data-vibeui-block="navbar-017"] [data-part="nav"] a[aria-current="page"]{color:var(--vibeui-navbar-017-ink)}
[data-vibeui-block="navbar-017"] [data-part="nav"]:not([data-ready]) a[aria-current="page"]{
box-shadow:inset 0 -2px 0 var(--vibeui-navbar-017-accent);
}
[data-vibeui-block="navbar-017"] [data-part="glider"]{
position:absolute;left:0;bottom:-0.3125rem;z-index:0;height:2px;border-radius:2px;
width:var(--vibeui-navbar-017-glider-w,0);
transform:translate3d(var(--vibeui-navbar-017-glider-x,0),0,0);
background:var(--vibeui-navbar-017-accent);
opacity:0;pointer-events:none;color:oklch(from var(--vibeui-navbar-017-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="navbar-017"] [data-part="nav"][data-ready] [data-part="glider"]{
opacity:1;
transition:transform var(--vibeui-navbar-017-dur-4) var(--vibeui-navbar-017-ease),width var(--vibeui-navbar-017-dur-4) var(--vibeui-navbar-017-ease),opacity var(--vibeui-navbar-017-dur-2) ease;
}

[data-vibeui-block="navbar-017"] [data-part="state"]{
margin-left:auto;flex:none;
display:inline-flex;align-items:center;gap:0.5rem;
min-height:2.75rem;padding:0.25rem 1.375rem;border-radius:0.625rem;
border:1.5px dashed var(--vibeui-navbar-017-line);
color:var(--vibeui-navbar-017-muted);
font-size:0.9375rem;font-weight:620;white-space:nowrap;
}

[data-vibeui-block="navbar-017"] [data-part="menu"]{
flex:none;cursor:pointer;background:transparent;
display:inline-flex;align-items:center;gap:0.5rem;
min-height:2.75rem;padding:0.25rem 0.9375rem 0.25rem 0.8125rem;border-radius:0.625rem;
border:1px solid var(--vibeui-navbar-017-line);
color:var(--vibeui-navbar-017-ink);font:inherit;font-size:0.9375rem;font-weight:560;
transition:background-color var(--vibeui-navbar-017-dur-2) ease;
}
[data-vibeui-block="navbar-017"] [data-part="menu"]:hover{background:var(--vibeui-navbar-017-hover)}
[data-vibeui-block="navbar-017"] [data-part="bars"]{position:relative;width:0.9375rem;height:0.625rem;flex:none}
[data-vibeui-block="navbar-017"] [data-part="bars"]::before,
[data-vibeui-block="navbar-017"] [data-part="bars"]::after{
content:"";position:absolute;left:0;right:0;height:1.5px;border-radius:2px;background:currentColor;
transition:transform var(--vibeui-navbar-017-dur-4) var(--vibeui-navbar-017-ease);
}
[data-vibeui-block="navbar-017"] [data-part="bars"]::before{top:0}
[data-vibeui-block="navbar-017"] [data-part="bars"]::after{bottom:0}
[data-vibeui-block="navbar-017"] [data-part="menu"][aria-expanded="true"] [data-part="bars"]::before{transform:translateY(0.28125rem) rotate(45deg)}
[data-vibeui-block="navbar-017"] [data-part="menu"][aria-expanded="true"] [data-part="bars"]::after{transform:translateY(-0.28125rem) rotate(-45deg)}

[data-vibeui-block="navbar-017"] [data-part="panel"]{
position:absolute;right:1rem;top:calc(100% - 0.5rem);z-index:60;min-width:14rem;
background:var(--vibeui-navbar-017-bg);
border:1px solid var(--vibeui-navbar-017-line);border-radius:1rem;
box-shadow:var(--vibeui-navbar-017-shadow);
padding:0.375rem;display:flex;flex-direction:column;
transform-origin:top right;
transition:opacity var(--vibeui-navbar-017-dur-2) ease,transform var(--vibeui-navbar-017-dur-3) var(--vibeui-navbar-017-ease);
}
[data-vibeui-block="navbar-017"] [data-part="panel"][data-open="false"]{
opacity:0;transform:translateY(-0.5rem) scale(.98);pointer-events:none;
}
[data-vibeui-block="navbar-017"] [data-part="panel"] a{
padding:0.625rem 0.75rem;border-radius:0.625rem;
color:var(--vibeui-navbar-017-ink);text-decoration:none;
font-size:0.9375rem;font-weight:540;
transition:background-color var(--vibeui-navbar-017-dur-1) ease;
}
[data-vibeui-block="navbar-017"] [data-part="panel"] a:hover{background:var(--vibeui-navbar-017-hover)}
[data-vibeui-block="navbar-017"] [data-part="panel"] a[aria-current="page"]{color:var(--vibeui-navbar-017-accent)}

[data-vibeui-block="navbar-017"] a:focus-visible,
[data-vibeui-block="navbar-017"] button:focus-visible{
outline:2px solid var(--vibeui-navbar-017-accent);outline-offset:3px;
}
@container (min-width: 56rem){
[data-vibeui-block="navbar-017"] [data-part="shell"]{padding:1rem 2rem;flex-wrap:nowrap}
[data-vibeui-block="navbar-017"] [data-part="ident"]{flex-direction:row;align-items:center;gap:0.75rem}
[data-vibeui-block="navbar-017"] [data-part="nav"]{display:flex}
[data-vibeui-block="navbar-017"] [data-part="menu"],
[data-vibeui-block="navbar-017"] [data-part="panel"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-017"] *{animation:none!important;transition:none!important}}
[data-vibeui-block="navbar-017"] [data-part="ticket"]{margin-left:auto;flex:none;position:relative;
display:inline-flex;align-items:center;gap:0.5rem;
min-height:2.75rem;padding:0.25rem 1.5rem;border-radius:0.625rem;
background:var(--vibeui-navbar-017-accent);color:oklch(from var(--vibeui-navbar-017-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
text-decoration:none;font-size:0.9375rem;font-weight:740;letter-spacing:0.02em;
text-transform:uppercase;white-space:nowrap;
/* вырезы по краям: кнопка читается билетом, а не плашкой */
-webkit-mask:radial-gradient(0.4375rem 0.4375rem at 0 50%,transparent 98%,#000 100%),
radial-gradient(0.4375rem 0.4375rem at 100% 50%,transparent 98%,#000 100%);
-webkit-mask-composite:source-in;
mask:radial-gradient(0.4375rem 0.4375rem at 0 50%,transparent 98%,#000 100%),
radial-gradient(0.4375rem 0.4375rem at 100% 50%,transparent 98%,#000 100%);
mask-composite:intersect;
transition:transform var(--vibeui-navbar-017-dur-2) var(--vibeui-navbar-017-ease),filter var(--vibeui-navbar-017-dur-3) ease;}
[data-vibeui-block="navbar-017"] [data-part="ticket"]::before{content:"";position:absolute;left:0.9375rem;top:0.5rem;bottom:0.5rem;width:1.5px;
background:repeating-linear-gradient(currentColor 0 3px,transparent 3px 6px);
opacity:.4;}
[data-vibeui-block="navbar-017"] [data-part="ticket"]:hover{transform:translateY(-1px);filter:brightness(1.06);}
[data-vibeui-block="navbar-017"] [data-part="ticket"] span{padding-left:0.75rem}
`

const DEFAULT_LINKS: Navbar017Link[] = [
  { label: "Программа", href: "#program", current: true },
  { label: "Спикеры", href: "#speakers" },
  { label: "Площадка", href: "#venue" },
  { label: "Партнёры", href: "#partners" },
]

type TicketProps = Omit<ComponentProps<"a">, "title" | "children"> & {
  ticketHref?: string
  ticketLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function Ticket({
  ticketHref = "#tickets",
  ticketLabel = "Билеты",
  accent,
  className,
  style,
  ...props
}: TicketProps) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-017-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
      <a
        {...props} href={ticketHref}
        className={className}
        style={palette}
      >
        <span>{ticketLabel}</span>
      </a>
  )
}

/** Шапка события: знак с датой, программа и билет с честным состоянием продаж. */
export function Navbar017({
  brand = "Сетка·Фест",
  dateline = "12–14 октября · Екатеринбург",
  links = DEFAULT_LINKS,
  navLabel = "Разделы события",
  menuLabel = "Меню",
  closeLabel = "Закрыть",
  ticketLabel = "Билеты",
  ticketHref = "#tickets",
  sales = "open",
  soonLabel = "Продажи скоро",
  closedLabel = "Событие завершено",
  tone = "auto",
  poster = false,
  accent,
  className,
  style,
}: Navbar017Props) {
  const navRef = useRef<HTMLElement>(null)
  const rootRef = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const placeGlider = useCallback((target?: HTMLElement | null) => {
    const nav = navRef.current
    if (!nav) return

    const item =
      target ?? nav.querySelector<HTMLElement>('a[aria-current="page"]')

    if (!item) {
      nav.removeAttribute("data-ready")
      return
    }

    nav.style.setProperty(
      "--vibeui-navbar-017-glider-x",
      `${item.offsetLeft - nav.clientLeft}px`,
    )
    nav.style.setProperty(
      "--vibeui-navbar-017-glider-w",
      `${item.offsetWidth}px`,
    )
    nav.setAttribute("data-ready", "on")
  }, [])

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    placeGlider()

    const observer = new ResizeObserver(() => placeGlider())
    observer.observe(nav)

    return () => observer.disconnect()
  }, [placeGlider, links])

  useEffect(() => {
    if (!menuOpen) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }

    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointerDown)

    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [menuOpen])

  const palette = {
    ...(accent ? { "--vibeui-navbar-017-accent": accent } : null),
    ...style,
  } as CSSProperties
  const [head, ...tail] = brand.split("·")

  return (
    <>
      <style href="vibeui-navbar-017" precedence="medium">
        {STYLES}
      </style>
      <header
        ref={rootRef}
        data-vibeui-block="navbar-017"
        data-tone={tone === "auto" ? undefined : tone}
        data-poster={poster ? "on" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="ident">
            <a data-part="brand" href="#top">
              {head}
              {tail.length > 0 ? <i>·{tail.join("·")}</i> : null}
            </a>
            <span data-part="dateline">{dateline}</span>
          </div>

          <nav
            ref={navRef}
            data-part="nav"
            aria-label={navLabel}
            onPointerLeave={() => placeGlider()}
          >
            <span data-part="glider" aria-hidden="true" />
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={link.current ? "page" : undefined}
                onPointerEnter={(event) => placeGlider(event.currentTarget)}
                onFocus={(event) => placeGlider(event.currentTarget)}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {sales === "open" ? (
            <Ticket data-part="ticket" ticketHref={ticketHref} ticketLabel={ticketLabel} accent={accent} />
          ) : (
            <span data-part="state" role="status">
              {sales === "soon" ? soonLabel : closedLabel}
            </span>
          )}

          <button
            type="button"
            data-part="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span data-part="bars" aria-hidden="true" />
            {menuOpen ? closeLabel : menuLabel}
          </button>
        </div>

        <nav
          data-part="panel"
          data-open={menuOpen}
          aria-label={navLabel}
          aria-hidden={!menuOpen}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              tabIndex={menuOpen ? undefined : -1}
              aria-current={link.current ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>
    </>
  )
}

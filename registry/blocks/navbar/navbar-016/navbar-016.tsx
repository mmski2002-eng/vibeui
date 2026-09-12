"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"

type Navbar016Link = {
  label: string
  href: string
  current?: boolean
}

export type Navbar016Props = {
  brand?: string
  markLabel?: string
  /** Подпись организации под названием. */
  tagline?: string
  /** Верхняя служебная строка: контакты и служебные ссылки. */
  phone?: string
  phoneHref?: string
  serviceLinks?: Navbar016Link[]
  /** Текущий язык и ссылка на вторую версию. */
  langCurrent?: string
  langLabel?: string
  langHref?: string
  /** Основные направления. */
  links?: Navbar016Link[]
  navLabel?: string
  menuLabel?: string
  closeLabel?: string
  actionLabel?: string
  actionHref?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Двухуровневая корпоративная шапка: тёмная служебная строка для
// контактов, пресс-центра и языка; белая основная — для бренда,
// направлений и действия. Разделение по цвету, а не по одному лишь
// размеру шрифта: у крупной организации в шапке живут две разные аудитории
// — посетитель и подрядчик, и им нужны разные строки.
//
// Для крупного бизнеса, университета, фонда. При закреплении проектом
// остаётся основная строка: верхняя не sticky, это обычный поток.
// Клиентский JS нужен для каретки направлений и панели меню.
const STYLES = `
:where([data-vibeui-block="navbar-016"]){
--vibeui-navbar-016-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-016-ink:light-dark(#000000,#ffffff);
--vibeui-navbar-016-muted:light-dark(color-mix(in oklab,#000000 60%,#ffffff),color-mix(in oklab,#ffffff 68%,#1a1a1a));
--vibeui-navbar-016-line:light-dark(color-mix(in oklab,#000000 11%,transparent),color-mix(in oklab,#ffffff 15%,transparent));
--vibeui-navbar-016-hover:light-dark(color-mix(in oklab,#000000 5%,transparent),color-mix(in oklab,#ffffff 9%,transparent));
--vibeui-navbar-016-field:light-dark(#f2f2f2,color-mix(in oklab,#ffffff 8%,transparent));
--vibeui-navbar-016-sheen:light-dark(color-mix(in oklab,#ffffff 92%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-navbar-016-shadow:light-dark(0 1rem 2.5rem color-mix(in oklab,#000000 15%,transparent),0 1rem 2.5rem color-mix(in oklab,#000000 62%,transparent));
--vibeui-navbar-016-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-016-on-accent:oklch(from var(--vibeui-navbar-016-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-navbar-016-ease:cubic-bezier(.32,.72,0,1);
--vibeui-navbar-016-top:light-dark(#1a1a1a,#000000);
--vibeui-navbar-016-top-ink:color-mix(in oklab,#ffffff 74%,#1a1a1a);
--vibeui-navbar-016-top-line:color-mix(in oklab,#ffffff 18%,transparent);
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-016"]{color-scheme:dark}
:where([data-vibeui-block="navbar-016"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-016"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-016"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-016-bg);color:var(--vibeui-navbar-016-ink);
border-bottom:1px solid var(--vibeui-navbar-016-line);
font-family:var(--vibeui-navbar-016-font);
font-feature-settings:"cv11","ss01";
}
[data-vibeui-block="navbar-016"] *{box-sizing:border-box}

[data-vibeui-block="navbar-016"] [data-part="top"]{
background:var(--vibeui-navbar-016-top);color:var(--vibeui-navbar-016-top-ink);
}
[data-vibeui-block="navbar-016"] [data-part="top-shell"]{
max-width:88rem;margin:0 auto;padding:0.4375rem 1rem;
display:flex;align-items:center;gap:1.25rem;
font-size:0.75rem;
}
[data-vibeui-block="navbar-016"] [data-part="phone"]{
color:#ffffff;text-decoration:none;font-weight:620;white-space:nowrap;
font-variant-numeric:tabular-nums;
transition:color .13s ease;
}
[data-vibeui-block="navbar-016"] [data-part="phone"]:hover{color:var(--vibeui-navbar-016-accent)}
[data-vibeui-block="navbar-016"] [data-part="service"]{
display:none;align-items:center;gap:1.25rem;margin-left:auto;
}
[data-vibeui-block="navbar-016"] [data-part="service"] a{
color:inherit;text-decoration:none;white-space:nowrap;
transition:color .13s ease;
}
[data-vibeui-block="navbar-016"] [data-part="service"] a:hover{color:#ffffff}
[data-vibeui-block="navbar-016"] [data-part="lang"]{
margin:0 0 0 auto;flex:none;display:inline-flex;align-items:center;
border:1px solid var(--vibeui-navbar-016-top-line);border-radius:999px;
overflow:hidden;font-size:0.6875rem;font-weight:660;letter-spacing:0.06em;
}
[data-vibeui-block="navbar-016"] [data-part="service"]+[data-part="lang"]{margin-left:0}
[data-vibeui-block="navbar-016"] [data-part="lang"] span{
padding:0.1875rem 0.5rem;background:var(--vibeui-navbar-016-accent);color:oklch(from var(--vibeui-navbar-016-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
[data-vibeui-block="navbar-016"] [data-part="lang"] a{
padding:0.1875rem 0.5rem;color:inherit;text-decoration:none;
transition:color .13s ease,background-color .16s ease;
}
[data-vibeui-block="navbar-016"] [data-part="lang"] a:hover{
color:#ffffff;background:color-mix(in oklab,#ffffff 12%,transparent);
}

[data-vibeui-block="navbar-016"] [data-part="main"]{
max-width:88rem;margin:0 auto;padding:0.9375rem 1rem;
display:flex;align-items:center;gap:1rem;
}
[data-vibeui-block="navbar-016"] [data-part="brand"]{
display:flex;align-items:center;gap:0.75rem;flex:none;min-width:0;
color:inherit;text-decoration:none;
}
[data-vibeui-block="navbar-016"] [data-part="mark"]{
width:2.5rem;height:2.5rem;flex:none;display:grid;place-items:center;border-radius:0.75rem;
background:var(--vibeui-navbar-016-accent);color:oklch(from var(--vibeui-navbar-016-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-size:1.0625rem;font-weight:800;
box-shadow:0 0.375rem 1rem color-mix(in oklab,var(--vibeui-navbar-016-accent) 42%,transparent),
inset 0 1px 0 color-mix(in oklab,#ffffff 42%,transparent);
transition:transform .22s var(--vibeui-navbar-016-ease);
}
[data-vibeui-block="navbar-016"] [data-part="brand"]:hover [data-part="mark"]{transform:rotate(-6deg) scale(1.05)}
[data-vibeui-block="navbar-016"] [data-part="ident"]{display:flex;flex-direction:column;min-width:0}
[data-vibeui-block="navbar-016"] [data-part="name"]{
font-size:1.0625rem;font-weight:700;letter-spacing:-0.02em;white-space:nowrap;
}
[data-vibeui-block="navbar-016"] [data-part="tagline"]{
font-size:0.75rem;color:var(--vibeui-navbar-016-muted);white-space:nowrap;
overflow:hidden;text-overflow:ellipsis;
}

[data-vibeui-block="navbar-016"] [data-part="nav"]{
display:none;position:relative;align-items:center;gap:0.125rem;margin:0 auto;
}
[data-vibeui-block="navbar-016"] [data-part="nav"] a{
position:relative;z-index:1;padding:0.5rem 0.75rem;border-radius:0.5rem;
color:var(--vibeui-navbar-016-muted);text-decoration:none;
font-size:0.9375rem;font-weight:540;white-space:nowrap;
transition:color .13s ease,background-color .16s ease;
}
[data-vibeui-block="navbar-016"] [data-part="nav"] a:hover{
color:var(--vibeui-navbar-016-ink);background:var(--vibeui-navbar-016-hover);
}
[data-vibeui-block="navbar-016"] [data-part="nav"] a[aria-current="page"]{color:var(--vibeui-navbar-016-ink)}
[data-vibeui-block="navbar-016"] [data-part="nav"]:not([data-ready]) a[aria-current="page"]{
box-shadow:inset 0 -2px 0 var(--vibeui-navbar-016-accent);
}
[data-vibeui-block="navbar-016"] [data-part="glider"]{
position:absolute;left:0;bottom:-0.375rem;z-index:0;height:2px;border-radius:2px;
width:var(--vibeui-navbar-016-glider-w,0);
transform:translate3d(var(--vibeui-navbar-016-glider-x,0),0,0);
background:var(--vibeui-navbar-016-accent);
opacity:0;pointer-events:none;color:oklch(from var(--vibeui-navbar-016-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="navbar-016"] [data-part="nav"][data-ready] [data-part="glider"]{
opacity:1;
transition:transform .32s var(--vibeui-navbar-016-ease),width .32s var(--vibeui-navbar-016-ease),opacity .18s ease;
}

[data-vibeui-block="navbar-016"] [data-part="action"]{
margin-left:auto;flex:none;
display:inline-flex;align-items:center;min-height:2.625rem;padding:0.25rem 1.1875rem;
border-radius:0.75rem;
background:var(--vibeui-navbar-016-accent);color:oklch(from var(--vibeui-navbar-016-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
text-decoration:none;font-size:0.9375rem;font-weight:650;white-space:nowrap;letter-spacing:-0.01em;
box-shadow:0 0.3125rem 1rem color-mix(in oklab,var(--vibeui-navbar-016-accent) 38%,transparent),
inset 0 1px 0 color-mix(in oklab,#ffffff 42%,transparent);
transition:transform .18s var(--vibeui-navbar-016-ease),box-shadow .25s ease;
}
[data-vibeui-block="navbar-016"] [data-part="action"]:hover{
transform:translateY(-1px);
box-shadow:0 0.5rem 1.5rem color-mix(in oklab,var(--vibeui-navbar-016-accent) 48%,transparent),
inset 0 1px 0 color-mix(in oklab,#ffffff 52%,transparent);
}

[data-vibeui-block="navbar-016"] [data-part="menu"]{
flex:none;cursor:pointer;background:transparent;
display:inline-flex;align-items:center;gap:0.5rem;
min-height:2.625rem;padding:0.25rem 0.9375rem 0.25rem 0.8125rem;border-radius:0.75rem;
border:1px solid var(--vibeui-navbar-016-line);
color:var(--vibeui-navbar-016-ink);font:inherit;font-size:0.9375rem;font-weight:560;
transition:background-color .16s ease;
}
[data-vibeui-block="navbar-016"] [data-part="menu"]:hover{background:var(--vibeui-navbar-016-hover)}
[data-vibeui-block="navbar-016"] [data-part="bars"]{position:relative;width:0.9375rem;height:0.625rem;flex:none}
[data-vibeui-block="navbar-016"] [data-part="bars"]::before,
[data-vibeui-block="navbar-016"] [data-part="bars"]::after{
content:"";position:absolute;left:0;right:0;height:1.5px;border-radius:2px;background:currentColor;
transition:transform .3s var(--vibeui-navbar-016-ease);
}
[data-vibeui-block="navbar-016"] [data-part="bars"]::before{top:0}
[data-vibeui-block="navbar-016"] [data-part="bars"]::after{bottom:0}
[data-vibeui-block="navbar-016"] [data-part="menu"][aria-expanded="true"] [data-part="bars"]::before{transform:translateY(0.28125rem) rotate(45deg)}
[data-vibeui-block="navbar-016"] [data-part="menu"][aria-expanded="true"] [data-part="bars"]::after{transform:translateY(-0.28125rem) rotate(-45deg)}

[data-vibeui-block="navbar-016"] [data-part="panel"]{
position:absolute;right:1rem;top:calc(100% - 0.375rem);z-index:60;min-width:16rem;
background:var(--vibeui-navbar-016-bg);
border:1px solid var(--vibeui-navbar-016-line);border-radius:1rem;
box-shadow:var(--vibeui-navbar-016-shadow);
padding:0.375rem;display:flex;flex-direction:column;
transform-origin:top right;
transition:opacity .18s ease,transform .26s var(--vibeui-navbar-016-ease);
}
[data-vibeui-block="navbar-016"] [data-part="panel"][data-open="false"]{
opacity:0;transform:translateY(-0.5rem) scale(.98);pointer-events:none;
}
[data-vibeui-block="navbar-016"] [data-part="panel"] a{
padding:0.625rem 0.75rem;border-radius:0.625rem;
color:var(--vibeui-navbar-016-ink);text-decoration:none;
font-size:0.9375rem;font-weight:540;
transition:background-color .14s ease;
}
[data-vibeui-block="navbar-016"] [data-part="panel"] a:hover{background:var(--vibeui-navbar-016-hover)}
[data-vibeui-block="navbar-016"] [data-part="panel"] a[aria-current="page"]{color:var(--vibeui-navbar-016-accent)}
[data-vibeui-block="navbar-016"] [data-part="panel-service"]{
margin-top:0.375rem;padding-top:0.375rem;border-top:1px solid var(--vibeui-navbar-016-line);
display:flex;flex-direction:column;
}
[data-vibeui-block="navbar-016"] [data-part="panel-service"] a{
color:var(--vibeui-navbar-016-muted);font-size:0.875rem;
}

[data-vibeui-block="navbar-016"] a:focus-visible,
[data-vibeui-block="navbar-016"] button:focus-visible{
outline:2px solid var(--vibeui-navbar-016-accent);outline-offset:3px;
}
@container (min-width: 58rem){
[data-vibeui-block="navbar-016"] [data-part="top-shell"]{padding:0.5rem 2rem}
[data-vibeui-block="navbar-016"] [data-part="service"]{display:flex}
[data-vibeui-block="navbar-016"] [data-part="main"]{padding:1.125rem 2rem}
[data-vibeui-block="navbar-016"] [data-part="nav"]{display:flex}
[data-vibeui-block="navbar-016"] [data-part="menu"],
[data-vibeui-block="navbar-016"] [data-part="panel"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SERVICE: Navbar016Link[] = [
  { label: "Пресс-центр", href: "#press" },
  { label: "Закупки", href: "#procurement" },
  { label: "Карьера", href: "#career" },
]

const DEFAULT_LINKS: Navbar016Link[] = [
  { label: "О компании", href: "#about", current: true },
  { label: "Направления", href: "#directions" },
  { label: "Проекты", href: "#projects" },
  { label: "Устойчивое развитие", href: "#esg" },
  { label: "Контакты", href: "#contacts" },
]

/** Двухуровневая корпоративная шапка: служебная строка и основная навигация. */
export function Navbar016({
  brand = "Группа «Атлас»",
  markLabel = "А",
  tagline = "Промышленность и инфраструктура",
  phone = "+7 495 120-33-70",
  phoneHref = "tel:+74951203370",
  serviceLinks = DEFAULT_SERVICE,
  langCurrent = "RU",
  langLabel = "EN",
  langHref = "#en",
  links = DEFAULT_LINKS,
  navLabel = "Разделы сайта",
  menuLabel = "Меню",
  closeLabel = "Закрыть",
  actionLabel = "Связаться",
  actionHref = "#contact",
  tone = "auto",
  accent,
  className,
  style,
}: Navbar016Props) {
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
      "--vibeui-navbar-016-glider-x",
      `${item.offsetLeft - nav.clientLeft}px`,
    )
    nav.style.setProperty(
      "--vibeui-navbar-016-glider-w",
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
    ...(accent ? { "--vibeui-navbar-016-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-016" precedence="medium">
        {STYLES}
      </style>
      <header
        ref={rootRef}
        data-vibeui-block="navbar-016"
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        <div data-part="top">
          <div data-part="top-shell">
            <a data-part="phone" href={phoneHref}>
              {phone}
            </a>
            <nav data-part="service" aria-label="Служебные разделы">
              {serviceLinks.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
            <p data-part="lang">
              <span aria-current="true">{langCurrent}</span>
              <a href={langHref} aria-label="Версия на английском">
                {langLabel}
              </a>
            </p>
          </div>
        </div>

        <div data-part="main">
          <a data-part="brand" href="#top">
            <span data-part="mark" aria-hidden="true">
              {markLabel}
            </span>
            <span data-part="ident">
              <span data-part="name">{brand}</span>
              <span data-part="tagline">{tagline}</span>
            </span>
          </a>

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

          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>

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

        <div data-part="panel" data-open={menuOpen} aria-hidden={!menuOpen}>
          <nav aria-label={navLabel}>
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
          <div data-part="panel-service">
            {serviceLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                tabIndex={menuOpen ? undefined : -1}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </header>
    </>
  )
}

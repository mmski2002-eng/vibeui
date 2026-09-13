"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"

type Navbar003Link = {
  label: string
  href: string
  current?: boolean
}

export type Navbar003Props = {
  brand?: string
  /** Буква в знаке: компонент несёт русскую. */
  markLabel?: string
  /** Подпись навигации для скринридера. */
  navLabel?: string
  /** Подпись кнопки меню в узкой раскладке. */
  menuLabel?: string
  closeLabel?: string
  links?: Navbar003Link[]
  actionLabel?: string
  actionHref?: string
  /** Поверхность: белая или графитовая. */
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Чистая шапка с одним главным действием: логотип слева, короткий ряд
// разделов, кнопка справа, волосяная линия снизу. Универсальная основа для
// услуги, SaaS, школы. Сдержанность здесь — замысел, поэтому вся работа
// уходит в детали: под ссылками едет тонкая линия-каретка, знак чуть
// поворачивается на наведении, у кнопки стрелка уезжает вперёд.
//
// Клиентский JS нужен для каретки и мобильной панели. До гидратации
// активный раздел подчёркнут статической линией, панель раскрывается
// обычным списком — шапка приходит с сервера рабочей.
const STYLES = `
:where([data-vibeui-block="navbar-003"]){
--vibeui-navbar-003-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-003-ink:light-dark(#000000,#ffffff);
--vibeui-navbar-003-muted:light-dark(color-mix(in oklab,#000000 60%,#ffffff),color-mix(in oklab,#ffffff 68%,#1a1a1a));
--vibeui-navbar-003-line:light-dark(color-mix(in oklab,#000000 11%,transparent),color-mix(in oklab,#ffffff 15%,transparent));
--vibeui-navbar-003-hover:light-dark(color-mix(in oklab,#000000 5%,transparent),color-mix(in oklab,#ffffff 9%,transparent));
--vibeui-navbar-003-field:light-dark(#f2f2f2,color-mix(in oklab,#ffffff 8%,transparent));
--vibeui-navbar-003-sheen:light-dark(color-mix(in oklab,#ffffff 92%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-navbar-003-shadow:light-dark(0 1rem 2.5rem color-mix(in oklab,#000000 15%,transparent),0 1rem 2.5rem color-mix(in oklab,#000000 62%,transparent));
--vibeui-navbar-003-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-003-on-accent:oklch(from var(--vibeui-navbar-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-navbar-003-ease:cubic-bezier(.32,.72,0,1);
--vibeui-navbar-003-dur-1:130ms;
--vibeui-navbar-003-dur-2:180ms;
--vibeui-navbar-003-dur-3:240ms;
--vibeui-navbar-003-dur-4:340ms;
--vibeui-navbar-003-panel:light-dark(#ffffff,#1a1a1a);
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-003"]{color-scheme:dark}
:where([data-vibeui-block="navbar-003"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-003"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-003"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-003-bg);color:var(--vibeui-navbar-003-ink);
border-bottom:1px solid var(--vibeui-navbar-003-line);
font-family:var(--vibeui-navbar-003-font);
font-feature-settings:"cv11","ss01";
}
[data-vibeui-block="navbar-003"] *{box-sizing:border-box}
[data-vibeui-block="navbar-003"] [data-part="shell"]{
display:flex;align-items:center;gap:1rem;
max-width:82rem;margin:0 auto;padding:0.875rem 1rem;min-height:4rem;
}

[data-vibeui-block="navbar-003"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.625rem;flex:none;
color:inherit;text-decoration:none;font-size:1.0625rem;font-weight:680;letter-spacing:-0.025em;
}
[data-vibeui-block="navbar-003"] [data-part="mark"]{
width:1.875rem;height:1.875rem;flex:none;display:grid;place-items:center;border-radius:0.5rem;
background:var(--vibeui-navbar-003-accent);color:oklch(from var(--vibeui-navbar-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-size:0.8125rem;font-weight:800;
box-shadow:0 0.25rem 0.75rem color-mix(in oklab,var(--vibeui-navbar-003-accent) 44%,transparent),
inset 0 1px 0 color-mix(in oklab,#ffffff 42%,transparent);
transition:transform var(--vibeui-navbar-003-dur-3) var(--vibeui-navbar-003-ease);
}
[data-vibeui-block="navbar-003"] [data-part="brand"]:hover [data-part="mark"]{transform:rotate(-6deg) scale(1.06)}

[data-vibeui-block="navbar-003"] [data-part="nav"]{
display:none;position:relative;align-items:center;gap:0.125rem;margin:0 auto;
}
[data-vibeui-block="navbar-003"] [data-part="nav"] a{
position:relative;z-index:1;padding:0.5rem 0.875rem;border-radius:0.625rem;
color:var(--vibeui-navbar-003-muted);text-decoration:none;
font-size:0.9375rem;font-weight:530;white-space:nowrap;
transition:color var(--vibeui-navbar-003-dur-1) ease,background-color var(--vibeui-navbar-003-dur-2) ease;
}
[data-vibeui-block="navbar-003"] [data-part="nav"] a:hover{
color:var(--vibeui-navbar-003-ink);background:var(--vibeui-navbar-003-hover);
}
[data-vibeui-block="navbar-003"] [data-part="nav"] a[aria-current="page"]{color:var(--vibeui-navbar-003-ink)}
[data-vibeui-block="navbar-003"] [data-part="nav"]:not([data-ready]) a[aria-current="page"]::after{
content:"";position:absolute;left:0.875rem;right:0.875rem;bottom:-0.4375rem;height:2px;
background:var(--vibeui-navbar-003-accent);border-radius:2px;color:oklch(from var(--vibeui-navbar-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="navbar-003"] [data-part="glider"]{
position:absolute;left:0;bottom:-0.4375rem;z-index:0;height:2px;border-radius:2px;
width:var(--vibeui-navbar-003-glider-w,0);
transform:translate3d(var(--vibeui-navbar-003-glider-x,0),0,0);
background:var(--vibeui-navbar-003-accent);
opacity:0;pointer-events:none;color:oklch(from var(--vibeui-navbar-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="navbar-003"] [data-part="nav"][data-ready] [data-part="glider"]{
opacity:1;
transition:transform var(--vibeui-navbar-003-dur-4) var(--vibeui-navbar-003-ease),width var(--vibeui-navbar-003-dur-4) var(--vibeui-navbar-003-ease),opacity var(--vibeui-navbar-003-dur-2) ease;
}

[data-vibeui-block="navbar-003"] [data-part="action"]{
display:inline-flex;align-items:center;gap:0.4375rem;
min-height:2.5rem;padding:0.25rem 1.125rem;border-radius:0.6875rem;flex:none;margin-left:auto;
background:var(--vibeui-navbar-003-accent);color:oklch(from var(--vibeui-navbar-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
text-decoration:none;font-size:0.9375rem;font-weight:650;white-space:nowrap;letter-spacing:-0.01em;
box-shadow:0 0.3125rem 1rem color-mix(in oklab,var(--vibeui-navbar-003-accent) 38%,transparent),
inset 0 1px 0 color-mix(in oklab,#ffffff 42%,transparent);
transition:transform var(--vibeui-navbar-003-dur-2) var(--vibeui-navbar-003-ease),box-shadow var(--vibeui-navbar-003-dur-3) ease;
}
[data-vibeui-block="navbar-003"] [data-part="action"] svg{
width:0.875rem;height:0.875rem;flex:none;
transition:transform var(--vibeui-navbar-003-dur-3) var(--vibeui-navbar-003-ease);
}
[data-vibeui-block="navbar-003"] [data-part="action"]:hover{
transform:translateY(-1px);
box-shadow:0 0.5rem 1.5rem color-mix(in oklab,var(--vibeui-navbar-003-accent) 48%,transparent),
inset 0 1px 0 color-mix(in oklab,#ffffff 52%,transparent);
}
[data-vibeui-block="navbar-003"] [data-part="action"]:hover svg{transform:translateX(0.1875rem)}

[data-vibeui-block="navbar-003"] [data-part="menu"]{
flex:none;display:inline-flex;align-items:center;gap:0.5rem;cursor:pointer;
min-height:2.5rem;padding:0.25rem 0.9375rem 0.25rem 0.8125rem;border-radius:0.6875rem;
background:transparent;border:1px solid var(--vibeui-navbar-003-line);
color:var(--vibeui-navbar-003-ink);font:inherit;font-size:0.9375rem;font-weight:560;
transition:background-color var(--vibeui-navbar-003-dur-2) ease;
}
[data-vibeui-block="navbar-003"] [data-part="menu"]:hover{background:var(--vibeui-navbar-003-hover)}
[data-vibeui-block="navbar-003"] [data-part="bars"]{position:relative;width:0.9375rem;height:0.625rem;flex:none}
[data-vibeui-block="navbar-003"] [data-part="bars"]::before,
[data-vibeui-block="navbar-003"] [data-part="bars"]::after{
content:"";position:absolute;left:0;right:0;height:1.5px;border-radius:2px;background:currentColor;
transition:transform var(--vibeui-navbar-003-dur-4) var(--vibeui-navbar-003-ease);
}
[data-vibeui-block="navbar-003"] [data-part="bars"]::before{top:0}
[data-vibeui-block="navbar-003"] [data-part="bars"]::after{bottom:0}
[data-vibeui-block="navbar-003"] [data-part="menu"][aria-expanded="true"] [data-part="bars"]::before{transform:translateY(0.28125rem) rotate(45deg)}
[data-vibeui-block="navbar-003"] [data-part="menu"][aria-expanded="true"] [data-part="bars"]::after{transform:translateY(-0.28125rem) rotate(-45deg)}

[data-vibeui-block="navbar-003"] [data-part="panel"]{
position:absolute;left:0;right:0;top:100%;z-index:60;
background:var(--vibeui-navbar-003-panel);
border-bottom:1px solid var(--vibeui-navbar-003-line);
box-shadow:var(--vibeui-navbar-003-shadow);
padding:0.5rem 1rem 1rem;display:flex;flex-direction:column;
transform-origin:top center;
transition:opacity var(--vibeui-navbar-003-dur-2) ease,transform var(--vibeui-navbar-003-dur-3) var(--vibeui-navbar-003-ease);
}
[data-vibeui-block="navbar-003"] [data-part="panel"][data-open="false"]{
opacity:0;transform:translateY(-0.5rem);pointer-events:none;
}
[data-vibeui-block="navbar-003"] [data-part="panel"] a{
padding:0.8125rem 0.25rem;color:var(--vibeui-navbar-003-ink);text-decoration:none;
font-size:1rem;font-weight:540;
border-bottom:1px solid var(--vibeui-navbar-003-line);
}
[data-vibeui-block="navbar-003"] [data-part="panel"] a:last-child{border-bottom:0}
[data-vibeui-block="navbar-003"] [data-part="panel"] a[aria-current="page"]{color:var(--vibeui-navbar-003-accent)}

[data-vibeui-block="navbar-003"] a:focus-visible,
[data-vibeui-block="navbar-003"] button:focus-visible{
outline:2px solid var(--vibeui-navbar-003-accent);outline-offset:3px;
}
@container (min-width: 52rem){
[data-vibeui-block="navbar-003"] [data-part="shell"]{padding:0.875rem 2rem;gap:1.5rem}
[data-vibeui-block="navbar-003"] [data-part="nav"]{display:flex}
[data-vibeui-block="navbar-003"] [data-part="menu"],
[data-vibeui-block="navbar-003"] [data-part="panel"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Navbar003Link[] = [
  { label: "Возможности", href: "#features", current: true },
  { label: "Тарифы", href: "#pricing" },
  { label: "Клиенты", href: "#customers" },
  { label: "О нас", href: "#about" },
]

/** Чистая шапка: логотип, короткий ряд разделов и одно главное действие. */
export function Navbar003({
  brand = "Вершина",
  markLabel = "В",
  navLabel = "Разделы сайта",
  menuLabel = "Меню",
  closeLabel = "Закрыть",
  links = DEFAULT_LINKS,
  actionLabel = "Начать",
  actionHref = "#start",
  tone = "auto",
  accent,
  className,
  style,
}: Navbar003Props) {
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
      "--vibeui-navbar-003-glider-x",
      `${item.offsetLeft - nav.clientLeft}px`,
    )
    nav.style.setProperty(
      "--vibeui-navbar-003-glider-w",
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
    ...(accent ? { "--vibeui-navbar-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-003" precedence="medium">
        {STYLES}
      </style>
      <header
        ref={rootRef}
        data-vibeui-block="navbar-003"
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <a data-part="brand" href="#top">
            <span data-part="mark" aria-hidden="true">
              {markLabel}
            </span>
            {brand}
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
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M2.5 8h11M9 3.5 13.5 8 9 12.5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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

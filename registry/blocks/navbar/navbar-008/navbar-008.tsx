"use client"

import { useCallback, useEffect, useRef, useState } from "react"
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
  closeLabel?: string
  links?: Navbar008Link[]
  actionLabel?: string
  actionHref?: string
  /** Контрастная версия: для тёмного кадра или для светлого. */
  theme?: "on-dark" | "on-light"
  /** Закрепить шапку у верхнего края прокрутки. */
  sticky?: boolean
  /** Показать демонстрационный кадр с прокруткой под шапкой. */
  demo?: boolean
  accent?: string
  className?: string
  style?: CSSProperties
}

// Шапка поверх фотографии или видео. На первом кадре она ничем не
// подложена: только знак, ссылки и одно действие. Стоит странице
// тронуться — шапка садится на плотную панель с размытием, потому что над
// текстом контента прозрачная шапка нечитаема. Контрастная версия
// выбирается заранее пропом theme: читаемость не вычисляется случайным
// смешиванием с пикселями кадра.
//
// Клиентский JS нужен для состояния прокрутки, каретки и мобильной панели.
// Без гидратации шапка остаётся в прозрачном состоянии и работает.
const STYLES = `
:where([data-vibeui-block="navbar-008"]){
--vibeui-navbar-008-ink:#ffffff;
--vibeui-navbar-008-muted:color-mix(in oklab,#ffffff 78%,transparent);
--vibeui-navbar-008-line:color-mix(in oklab,#ffffff 30%,transparent);
--vibeui-navbar-008-panel:#1a1a1a;
--vibeui-navbar-008-solid:color-mix(in oklab,#000000 72%,transparent);
--vibeui-navbar-008-edge:color-mix(in oklab,#ffffff 14%,transparent);
--vibeui-navbar-008-sheen:color-mix(in oklab,#ffffff 16%,transparent);
--vibeui-navbar-008-accent:var(--vibeui-navbar-008-ink);
--vibeui-navbar-008-on-accent:oklch(from var(--vibeui-navbar-008-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-navbar-008-ease:cubic-bezier(.32,.72,0,1);
--vibeui-navbar-008-dur-1:130ms;
--vibeui-navbar-008-dur-2:180ms;
--vibeui-navbar-008-dur-3:240ms;
--vibeui-navbar-008-dur-4:340ms;
--vibeui-navbar-008-dur-5:460ms;
container-type:inline-size;
}
:where([data-vibeui-block="navbar-008"][data-theme="on-light"]){
--vibeui-navbar-008-ink:#000000;
--vibeui-navbar-008-muted:color-mix(in oklab,#000000 68%,transparent);
--vibeui-navbar-008-line:color-mix(in oklab,#000000 26%,transparent);
--vibeui-navbar-008-panel:#ffffff;
--vibeui-navbar-008-solid:color-mix(in oklab,#ffffff 78%,transparent);
--vibeui-navbar-008-edge:color-mix(in oklab,#000000 10%,transparent);
--vibeui-navbar-008-sheen:color-mix(in oklab,#ffffff 90%,transparent);
}
[data-vibeui-block="navbar-008"]{
position:relative;display:block;min-width:min(100%,16rem);
color:var(--vibeui-navbar-008-ink);
font-family:var(--vibeui-navbar-008-font);
font-feature-settings:"cv11","ss01";
}
[data-vibeui-block="navbar-008"] *{box-sizing:border-box}

[data-vibeui-block="navbar-008"] [data-part="stage"]{
position:relative;height:30rem;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:none;
background:#0f1418;
}
[data-vibeui-block="navbar-008"] [data-part="stage"]::-webkit-scrollbar{width:0;height:0}
[data-vibeui-block="navbar-008"] [data-part="frame"]{
position:relative;height:26rem;margin-top:-4.75rem;
background-image:
url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320' preserveAspectRatio='none'%3E%3Cpath fill='%2312171d' d='M0,300 L240,254 L520,296 L820,246 L1120,292 L1440,250 L1440,320 L0,320 Z'/%3E%3C/svg%3E"),
url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320' preserveAspectRatio='none'%3E%3Cpath fill='%23222c36' d='M0,268 L160,196 L340,262 L560,178 L760,258 L980,188 L1200,256 L1440,192 L1440,320 L0,320 Z'/%3E%3C/svg%3E"),
url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320' preserveAspectRatio='none'%3E%3Cpath fill='%233b4a58' d='M0,232 L190,130 L330,214 L520,96 L700,206 L880,118 L1070,198 L1250,126 L1440,206 L1440,320 L0,320 Z'/%3E%3C/svg%3E"),
radial-gradient(22rem 16rem at 74% 26%,rgb(255 196 128 / 62%),transparent 66%),
linear-gradient(178deg,#22303c 0%,#4a5866 34%,#8e8272 68%,#c09a72 100%);
background-repeat:no-repeat;
background-size:100% 34%,100% 48%,100% 62%,auto,auto;
background-position:bottom,bottom,bottom,center,center;
}
[data-vibeui-block="navbar-008"] [data-part="frame"]::after{
content:"";position:absolute;inset:0;
background:linear-gradient(rgb(0 0 0 / 38%),transparent 42%);
}
[data-vibeui-block="navbar-008"][data-theme="on-light"] [data-part="stage"]{background:#efece6}
[data-vibeui-block="navbar-008"][data-theme="on-light"] [data-part="frame"]{
background-image:
url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320' preserveAspectRatio='none'%3E%3Cpath fill='%23b8ab98' d='M0,300 L240,254 L520,296 L820,246 L1120,292 L1440,250 L1440,320 L0,320 Z'/%3E%3C/svg%3E"),
url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320' preserveAspectRatio='none'%3E%3Cpath fill='%23d2c8b8' d='M0,268 L160,196 L340,262 L560,178 L760,258 L980,188 L1200,256 L1440,192 L1440,320 L0,320 Z'/%3E%3C/svg%3E"),
url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320' preserveAspectRatio='none'%3E%3Cpath fill='%23e6ded1' d='M0,232 L190,130 L330,214 L520,96 L700,206 L880,118 L1070,198 L1250,126 L1440,206 L1440,320 L0,320 Z'/%3E%3C/svg%3E"),
radial-gradient(22rem 16rem at 74% 26%,rgb(255 214 164 / 72%),transparent 66%),
linear-gradient(178deg,#f6f3ec 0%,#eae4d8 46%,#ded4c4 100%);
}
[data-vibeui-block="navbar-008"][data-theme="on-light"] [data-part="frame"]::after{
background:linear-gradient(rgb(255 255 255 / 30%),transparent 40%);
}
[data-vibeui-block="navbar-008"] [data-part="filler"]{
max-width:82rem;margin:0 auto;padding:1.5rem 2rem 4rem;
display:grid;gap:1rem;grid-template-columns:repeat(2,minmax(0,1fr));
}
[data-vibeui-block="navbar-008"] [data-part="filler"] > *{
height:9rem;border-radius:1.25rem;
background:color-mix(in oklab,#ffffff 8%,transparent);
border:1px solid color-mix(in oklab,#ffffff 10%,transparent);
}
[data-vibeui-block="navbar-008"][data-theme="on-light"] [data-part="filler"] > *{
background:color-mix(in oklab,#ffffff 72%,transparent);
border-color:color-mix(in oklab,#000000 8%,transparent);
}

[data-vibeui-block="navbar-008"] [data-part="dock"]{
position:relative;z-index:50;
transition:background-color var(--vibeui-navbar-008-dur-4) ease,box-shadow var(--vibeui-navbar-008-dur-4) ease,border-color var(--vibeui-navbar-008-dur-4) ease;
border-bottom:1px solid transparent;
}
[data-vibeui-block="navbar-008"] [data-part="dock"][data-sticky]{position:sticky;top:0}
[data-vibeui-block="navbar-008"] [data-part="dock"][data-scrolled]{
background:var(--vibeui-navbar-008-solid);
border-bottom-color:var(--vibeui-navbar-008-edge);
box-shadow:0 0.5rem 1.5rem rgb(0 0 0 / 22%),inset 0 1px 0 var(--vibeui-navbar-008-sheen);
-webkit-backdrop-filter:blur(1.25rem) saturate(170%);
backdrop-filter:blur(1.25rem) saturate(170%);
}

[data-vibeui-block="navbar-008"] [data-part="shell"]{
position:relative;display:flex;align-items:center;gap:1rem;
max-width:82rem;margin:0 auto;padding:1.125rem 1rem;
transition:padding var(--vibeui-navbar-008-dur-5) var(--vibeui-navbar-008-ease);
}
[data-vibeui-block="navbar-008"] [data-part="dock"][data-scrolled] [data-part="shell"]{padding-block:0.75rem}

[data-vibeui-block="navbar-008"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.625rem;flex:none;
color:inherit;text-decoration:none;font-size:1.125rem;font-weight:700;letter-spacing:-0.025em;
text-shadow:0 1px 14px rgb(0 0 0 / 26%);
transition:text-shadow var(--vibeui-navbar-008-dur-4) ease;
}
[data-vibeui-block="navbar-008"][data-theme="on-light"] [data-part="brand"],
[data-vibeui-block="navbar-008"] [data-part="dock"][data-scrolled] [data-part="brand"]{text-shadow:none}
[data-vibeui-block="navbar-008"] [data-part="mark"]{
width:1.875rem;height:1.875rem;flex:none;display:grid;place-items:center;border-radius:0.5rem;
background:var(--vibeui-navbar-008-accent);color:oklch(from var(--vibeui-navbar-008-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-size:0.8125rem;font-weight:800;text-shadow:none;
box-shadow:0 0.25rem 0.75rem color-mix(in oklab,var(--vibeui-navbar-008-accent) 50%,transparent);
transition:transform var(--vibeui-navbar-008-dur-3) var(--vibeui-navbar-008-ease);
}
[data-vibeui-block="navbar-008"] [data-part="brand"]:hover [data-part="mark"]{transform:rotate(-6deg) scale(1.06)}

[data-vibeui-block="navbar-008"] [data-part="nav"]{
display:none;position:relative;align-items:center;gap:0.25rem;margin:0 auto;
}
[data-vibeui-block="navbar-008"] [data-part="nav"] a{
position:relative;z-index:1;padding:0.5rem 0.8125rem;
color:var(--vibeui-navbar-008-muted);text-decoration:none;
font-size:0.9375rem;font-weight:540;white-space:nowrap;
text-shadow:0 1px 12px rgb(0 0 0 / 22%);
transition:color var(--vibeui-navbar-008-dur-1) ease,text-shadow var(--vibeui-navbar-008-dur-4) ease;
}
[data-vibeui-block="navbar-008"][data-theme="on-light"] [data-part="nav"] a,
[data-vibeui-block="navbar-008"] [data-part="dock"][data-scrolled] [data-part="nav"] a{text-shadow:none}
[data-vibeui-block="navbar-008"] [data-part="nav"] a:hover,
[data-vibeui-block="navbar-008"] [data-part="nav"] a[aria-current="page"]{color:var(--vibeui-navbar-008-ink)}
[data-vibeui-block="navbar-008"] [data-part="nav"]:not([data-ready]) a[aria-current="page"]{
box-shadow:inset 0 -2px 0 var(--vibeui-navbar-008-accent);
}
[data-vibeui-block="navbar-008"] [data-part="glider"]{
position:absolute;left:0;bottom:0;z-index:0;height:2px;border-radius:2px;
width:var(--vibeui-navbar-008-glider-w,0);
transform:translate3d(var(--vibeui-navbar-008-glider-x,0),0,0);
background:var(--vibeui-navbar-008-accent);
opacity:0;pointer-events:none;color:oklch(from var(--vibeui-navbar-008-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="navbar-008"] [data-part="nav"][data-ready] [data-part="glider"]{
opacity:1;
transition:transform var(--vibeui-navbar-008-dur-4) var(--vibeui-navbar-008-ease),width var(--vibeui-navbar-008-dur-4) var(--vibeui-navbar-008-ease),opacity var(--vibeui-navbar-008-dur-2) ease;
}

[data-vibeui-block="navbar-008"] [data-part="action"]{
display:inline-flex;align-items:center;min-height:2.5rem;padding:0.25rem 1.125rem;border-radius:0.6875rem;
margin-left:auto;flex:none;
background:var(--vibeui-navbar-008-accent);color:oklch(from var(--vibeui-navbar-008-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
text-decoration:none;font-size:0.9375rem;font-weight:650;white-space:nowrap;letter-spacing:-0.01em;
box-shadow:0 0.375rem 1.25rem color-mix(in oklab,var(--vibeui-navbar-008-accent) 46%,transparent),
inset 0 1px 0 color-mix(in oklab,#ffffff 42%,transparent);
transition:transform var(--vibeui-navbar-008-dur-2) var(--vibeui-navbar-008-ease),box-shadow var(--vibeui-navbar-008-dur-3) ease;
}
[data-vibeui-block="navbar-008"] [data-part="action"]:hover{
transform:translateY(-1px);
box-shadow:0 0.625rem 1.75rem color-mix(in oklab,var(--vibeui-navbar-008-accent) 56%,transparent),
inset 0 1px 0 color-mix(in oklab,#ffffff 52%,transparent);
}

[data-vibeui-block="navbar-008"] [data-part="menu"]{
flex:none;display:inline-flex;align-items:center;gap:0.5rem;cursor:pointer;
min-height:2.5rem;padding:0.25rem 0.9375rem 0.25rem 0.8125rem;border-radius:0.6875rem;
background:transparent;border:1px solid var(--vibeui-navbar-008-line);
color:var(--vibeui-navbar-008-ink);font:inherit;font-size:0.9375rem;font-weight:560;
}
[data-vibeui-block="navbar-008"] [data-part="bars"]{position:relative;width:0.9375rem;height:0.625rem;flex:none}
[data-vibeui-block="navbar-008"] [data-part="bars"]::before,
[data-vibeui-block="navbar-008"] [data-part="bars"]::after{
content:"";position:absolute;left:0;right:0;height:1.5px;border-radius:2px;background:currentColor;
transition:transform var(--vibeui-navbar-008-dur-4) var(--vibeui-navbar-008-ease);
}
[data-vibeui-block="navbar-008"] [data-part="bars"]::before{top:0}
[data-vibeui-block="navbar-008"] [data-part="bars"]::after{bottom:0}
[data-vibeui-block="navbar-008"] [data-part="menu"][aria-expanded="true"] [data-part="bars"]::before{transform:translateY(0.28125rem) rotate(45deg)}
[data-vibeui-block="navbar-008"] [data-part="menu"][aria-expanded="true"] [data-part="bars"]::after{transform:translateY(-0.28125rem) rotate(-45deg)}

[data-vibeui-block="navbar-008"] [data-part="panel"]{
position:absolute;right:1rem;top:calc(100% - 0.25rem);z-index:60;min-width:14rem;
background:var(--vibeui-navbar-008-panel);
border:1px solid var(--vibeui-navbar-008-edge);border-radius:1.125rem;
box-shadow:0 0.75rem 2rem rgb(0 0 0 / 34%);
padding:0.5rem;display:flex;flex-direction:column;
transform-origin:top right;
transition:opacity var(--vibeui-navbar-008-dur-2) ease,transform var(--vibeui-navbar-008-dur-3) var(--vibeui-navbar-008-ease);
}
[data-vibeui-block="navbar-008"] [data-part="panel"][data-open="false"]{
opacity:0;transform:translateY(-0.5rem) scale(.98);pointer-events:none;
}
[data-vibeui-block="navbar-008"] [data-part="panel"] a{
padding:0.6875rem 0.75rem;border-radius:0.75rem;
color:var(--vibeui-navbar-008-ink);text-decoration:none;
font-size:0.9375rem;font-weight:540;text-shadow:none;
transition:background-color var(--vibeui-navbar-008-dur-1) ease;
}
[data-vibeui-block="navbar-008"] [data-part="panel"] a:hover{background:color-mix(in oklab,var(--vibeui-navbar-008-accent) 16%,transparent)}
[data-vibeui-block="navbar-008"] [data-part="panel"] a[aria-current="page"]{color:var(--vibeui-navbar-008-accent)}

[data-vibeui-block="navbar-008"] a:focus-visible,
[data-vibeui-block="navbar-008"] button:focus-visible{
outline:2px solid var(--vibeui-navbar-008-accent);outline-offset:3px;
}
@container (min-width: 52rem){
[data-vibeui-block="navbar-008"] [data-part="shell"]{padding:1.375rem 2rem;gap:1.5rem}
[data-vibeui-block="navbar-008"] [data-part="frame"]{margin-top:-5.25rem}
[data-vibeui-block="navbar-008"] [data-part="nav"]{display:flex}
[data-vibeui-block="navbar-008"] [data-part="menu"],
[data-vibeui-block="navbar-008"] [data-part="panel"]{display:none}
[data-vibeui-block="navbar-008"] [data-part="filler"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Navbar008Link[] = [
  { label: "Номера", href: "#rooms", current: true },
  { label: "Ресторан", href: "#restaurant" },
  { label: "Спа", href: "#spa" },
  { label: "Контакты", href: "#contacts" },
]

/** Прозрачная шапка поверх кадра, садящаяся на плотную панель при прокрутке. */
export function Navbar008({
  brand = "Перевал",
  markLabel = "П",
  navLabel = "Разделы сайта",
  menuLabel = "Меню",
  closeLabel = "Закрыть",
  links = DEFAULT_LINKS,
  actionLabel = "Забронировать",
  actionHref = "#book",
  theme = "on-dark",
  sticky = true,
  demo = true,
  accent,
  className,
  style,
}: Navbar008Props) {
  const dockRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
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
      "--vibeui-navbar-008-glider-x",
      `${item.offsetLeft - nav.clientLeft}px`,
    )
    nav.style.setProperty(
      "--vibeui-navbar-008-glider-w",
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
    const dock = dockRef.current
    if (!dock) return

    const scroller = stageRef.current
    const read = () => {
      const offset = scroller ? scroller.scrollTop : window.scrollY
      dock.toggleAttribute("data-scrolled", offset > 24)
    }

    read()

    const target: HTMLElement | Window = scroller ?? window
    target.addEventListener("scroll", read, { passive: true })

    return () => target.removeEventListener("scroll", read)
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!dockRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }

    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointerDown)

    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [menuOpen])

  const palette = {
    ...(accent ? { "--vibeui-navbar-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  const header = (
    <div ref={dockRef} data-part="dock" data-sticky={sticky ? "on" : undefined}>
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
    </div>
  )

  return (
    <>
      <style href="vibeui-navbar-008" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-008"
        data-theme={theme === "on-light" ? "on-light" : undefined}
        className={className}
        style={palette}
      >
        {demo ? (
          <div ref={stageRef} data-part="stage">
            {header}
            <div data-part="frame" aria-hidden="true" />
            <div data-part="filler" aria-hidden="true">
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
            </div>
          </div>
        ) : (
          header
        )}
      </header>
    </>
  )
}

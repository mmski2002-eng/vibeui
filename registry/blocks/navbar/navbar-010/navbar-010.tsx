"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { Button016 } from "@/registry/components/button/button-016/button-016"
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react"

type Navbar010Link = {
  label: string
  href: string
  current?: boolean
}

export type Navbar010Props = {
  brand?: string
  markLabel?: string
  navLabel?: string
  menuLabel?: string
  closeLabel?: string
  links?: Navbar010Link[]
  actionLabel?: string
  actionHref?: string
  /** Отступ островков от краёв в верхнем состоянии. */
  inset?: "tight" | "roomy"
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  /** Закрепить шапку у верхнего края прокрутки. */
  sticky?: boolean
  /** Показать демонстрационную сцену с прокруткой под шапкой. */
  demo?: boolean
  accent?: string
  className?: string
  style?: CSSProperties
}

// Плавающая шапка из островков: капсула бренда, капсула меню и действие
// парят над контентом на матовом стекле. У шапки два состояния: у начала
// прокрутки островки стоят раздельно и широко, после прокрутки зазоры
// схлопываются и три островка собираются в одну узкую пилюлю. Активный
// пункт помечает пилюля-каретка, переезжающая под курсором.
//
// Клиентский JS нужен ровно для трёх вещей: состояние прокрутки, позиция
// каретки и мобильное меню. Без JS шапка остаётся в верхнем состоянии,
// активный пункт подсвечен фоном, меню открывается как обычная панель.
const STYLES = `
:where([data-vibeui-block="navbar-010"]){
--vibeui-navbar-010-island:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-010-ink:light-dark(#000000,#ffffff);
--vibeui-navbar-010-muted:light-dark(color-mix(in oklab,#000000 68%,#ffffff),color-mix(in oklab,#ffffff 72%,#1a1a1a));
--vibeui-navbar-010-line:light-dark(color-mix(in oklab,#000000 10%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-navbar-010-glass:light-dark(color-mix(in oklab,#ffffff 64%,transparent),color-mix(in oklab,#1a1a1a 62%,transparent));
--vibeui-navbar-010-glass-dense:light-dark(color-mix(in oklab,#ffffff 74%,transparent),color-mix(in oklab,#1a1a1a 74%,transparent));
--vibeui-navbar-010-sheen:light-dark(color-mix(in oklab,#ffffff 90%,transparent),color-mix(in oklab,#ffffff 22%,transparent));
--vibeui-navbar-010-glide:light-dark(color-mix(in oklab,#000000 7%,transparent),color-mix(in oklab,#ffffff 12%,transparent));
--vibeui-navbar-010-lift:light-dark(0 0.375rem 1.25rem color-mix(in oklab,#000000 10%,transparent),0 0.375rem 1.25rem color-mix(in oklab,#000000 44%,transparent));
--vibeui-navbar-010-lift-strong:light-dark(0 0.75rem 2.25rem color-mix(in oklab,#000000 16%,transparent),0 0.75rem 2.25rem color-mix(in oklab,#000000 58%,transparent));
--vibeui-navbar-010-scene:light-dark(linear-gradient(158deg,#f2f1ef 0%,#e6e3de 54%,#d7d2c9 100%),linear-gradient(158deg,#000000 0%,#120f0e 54%,#1e1712 100%));
--vibeui-navbar-010-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-010-on-accent:oklch(from var(--vibeui-navbar-010-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-010-inset:1.25rem;
--vibeui-navbar-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-navbar-010-ease:cubic-bezier(.32,.72,0,1);
--vibeui-navbar-010-dur-1:130ms;
--vibeui-navbar-010-dur-2:180ms;
--vibeui-navbar-010-dur-3:240ms;
--vibeui-navbar-010-dur-4:340ms;
--vibeui-navbar-010-dur-5:460ms;
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-010"]{color-scheme:dark}
:where([data-vibeui-block="navbar-010"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-010"][data-tone="dark"]){color-scheme:dark}
:where([data-vibeui-block="navbar-010"][data-inset="roomy"]){--vibeui-navbar-010-inset:2.25rem}
[data-vibeui-block="navbar-010"]{
position:relative;display:block;min-width:min(100%,17rem);
color:var(--vibeui-navbar-010-ink);
font-family:var(--vibeui-navbar-010-font);
font-feature-settings:"cv11","ss01";
}
[data-vibeui-block="navbar-010"] *{box-sizing:border-box}
[data-vibeui-block="navbar-010"] [data-part="action"]{flex:none}

[data-vibeui-block="navbar-010"] [data-part="stage"]{
position:relative;height:30rem;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:none;
background:linear-gradient(158deg,#f2f1ef 0%,#e6e3de 54%,#d7d2c9 100%);
}
[data-vibeui-block="navbar-010"] [data-part="stage"]::-webkit-scrollbar{width:0;height:0}
[data-vibeui-block="navbar-010"][data-tone="dark"] [data-part="stage"]{
background:linear-gradient(158deg,#000000 0%,#120f0e 54%,#1e1712 100%);
}

[data-vibeui-block="navbar-010"] [data-part="dock"]{
position:relative;z-index:50;
padding:var(--vibeui-navbar-010-inset);
transition:padding var(--vibeui-navbar-010-dur-5) var(--vibeui-navbar-010-ease);
}
[data-vibeui-block="navbar-010"] [data-part="dock"][data-sticky]{position:sticky;top:0}
[data-vibeui-block="navbar-010"] [data-part="dock"][data-scrolled]{
padding-top:0.625rem;padding-bottom:0.625rem;
}

[data-vibeui-block="navbar-010"] [data-part="bar"]{
display:flex;align-items:center;gap:0.5rem;
max-width:78rem;margin:0 auto;padding:0;
border:1px solid transparent;border-radius:999px;
transition:max-width var(--vibeui-navbar-010-dur-5) var(--vibeui-navbar-010-ease),gap var(--vibeui-navbar-010-dur-5) var(--vibeui-navbar-010-ease),
padding var(--vibeui-navbar-010-dur-5) var(--vibeui-navbar-010-ease),background-color var(--vibeui-navbar-010-dur-4) ease,
border-color var(--vibeui-navbar-010-dur-4) ease,box-shadow var(--vibeui-navbar-010-dur-4) ease;
}
[data-vibeui-block="navbar-010"] [data-part="dock"][data-scrolled] [data-part="bar"]{
max-width:52rem;gap:0.25rem;padding:0.3125rem;
background:var(--vibeui-navbar-010-glass-dense);
border-color:var(--vibeui-navbar-010-line);
box-shadow:var(--vibeui-navbar-010-lift-strong),inset 0 1px 0 var(--vibeui-navbar-010-sheen);
-webkit-backdrop-filter:blur(1.5rem) saturate(180%);
backdrop-filter:blur(1.5rem) saturate(180%);
}

[data-vibeui-block="navbar-010"] [data-part="brand"],
[data-vibeui-block="navbar-010"] [data-part="nav"],
[data-vibeui-block="navbar-010"] [data-part="burger"]{
background:var(--vibeui-navbar-010-glass);
border:1px solid var(--vibeui-navbar-010-line);
border-radius:999px;
box-shadow:var(--vibeui-navbar-010-lift),inset 0 1px 0 var(--vibeui-navbar-010-sheen);
-webkit-backdrop-filter:blur(1.125rem) saturate(170%);
backdrop-filter:blur(1.125rem) saturate(170%);
transition:background-color var(--vibeui-navbar-010-dur-4) ease,border-color var(--vibeui-navbar-010-dur-4) ease,box-shadow var(--vibeui-navbar-010-dur-4) ease;
}
[data-vibeui-block="navbar-010"] [data-part="dock"][data-scrolled] [data-part="brand"],
[data-vibeui-block="navbar-010"] [data-part="dock"][data-scrolled] [data-part="nav"],
[data-vibeui-block="navbar-010"] [data-part="dock"][data-scrolled] [data-part="burger"]{
background:transparent;border-color:transparent;box-shadow:none;
-webkit-backdrop-filter:none;backdrop-filter:none;
}

[data-vibeui-block="navbar-010"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5625rem;flex:none;
padding:0.4375rem 1.125rem 0.4375rem 0.4375rem;
color:inherit;text-decoration:none;
font-size:0.9375rem;font-weight:660;letter-spacing:-0.02em;
}
[data-vibeui-block="navbar-010"] [data-part="mark"]{
width:1.75rem;height:1.75rem;flex:none;display:grid;place-items:center;border-radius:999px;
background:var(--vibeui-navbar-010-accent);color:oklch(from var(--vibeui-navbar-010-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-size:0.8125rem;font-weight:800;
box-shadow:0 0 0 1px color-mix(in oklab,var(--vibeui-navbar-010-accent) 40%,transparent),
0 0.25rem 0.75rem color-mix(in oklab,var(--vibeui-navbar-010-accent) 45%,transparent);
}

[data-vibeui-block="navbar-010"] [data-part="nav"]{
display:none;position:relative;margin:0 auto;padding:0.3125rem;gap:0.125rem;
}
[data-vibeui-block="navbar-010"] [data-part="nav"] a{
position:relative;z-index:1;
padding:0.4375rem 0.9375rem;border-radius:999px;
color:var(--vibeui-navbar-010-muted);text-decoration:none;
font-size:0.875rem;font-weight:540;white-space:nowrap;
transition:color var(--vibeui-navbar-010-dur-1) ease;
}
[data-vibeui-block="navbar-010"] [data-part="nav"] a:hover,
[data-vibeui-block="navbar-010"] [data-part="nav"] a[aria-current="page"]{
color:var(--vibeui-navbar-010-ink);
}
[data-vibeui-block="navbar-010"] [data-part="nav"]:not([data-ready]) a[aria-current="page"]{
background:var(--vibeui-navbar-010-glide);
}
[data-vibeui-block="navbar-010"] [data-part="glider"]{
position:absolute;top:0.3125rem;bottom:0.3125rem;left:0;z-index:0;
width:var(--vibeui-navbar-010-glider-w,0);
transform:translate3d(var(--vibeui-navbar-010-glider-x,0),0,0);
border-radius:999px;background:var(--vibeui-navbar-010-glide);
opacity:0;pointer-events:none;
}
[data-vibeui-block="navbar-010"] [data-part="nav"][data-ready] [data-part="glider"]{
opacity:1;
transition:transform var(--vibeui-navbar-010-dur-4) var(--vibeui-navbar-010-ease),width var(--vibeui-navbar-010-dur-4) var(--vibeui-navbar-010-ease),opacity var(--vibeui-navbar-010-dur-2) ease;
}

[data-vibeui-block="navbar-010"] [data-part="burger"]{
flex:none;margin-left:auto;display:inline-flex;align-items:center;gap:0.5rem;cursor:pointer;
padding:0.5rem 0.9375rem 0.5rem 0.8125rem;
color:var(--vibeui-navbar-010-ink);
font:inherit;font-size:0.875rem;font-weight:560;
}
[data-vibeui-block="navbar-010"] [data-part="bars"]{
position:relative;width:0.9375rem;height:0.625rem;flex:none;
}
[data-vibeui-block="navbar-010"] [data-part="bars"]::before,
[data-vibeui-block="navbar-010"] [data-part="bars"]::after{
content:"";position:absolute;left:0;right:0;height:1.5px;border-radius:2px;
background:currentColor;
transition:transform var(--vibeui-navbar-010-dur-4) var(--vibeui-navbar-010-ease);
}
[data-vibeui-block="navbar-010"] [data-part="bars"]::before{top:0}
[data-vibeui-block="navbar-010"] [data-part="bars"]::after{bottom:0}
[data-vibeui-block="navbar-010"] [data-part="burger"][aria-expanded="true"] [data-part="bars"]::before{
transform:translateY(0.28125rem) rotate(45deg);
}
[data-vibeui-block="navbar-010"] [data-part="burger"][aria-expanded="true"] [data-part="bars"]::after{
transform:translateY(-0.28125rem) rotate(-45deg);
}

[data-vibeui-block="navbar-010"] [data-part="panel"]{
position:absolute;left:var(--vibeui-navbar-010-inset);right:var(--vibeui-navbar-010-inset);
top:100%;z-index:60;
padding:0.5rem;border-radius:1.375rem;
background:var(--vibeui-navbar-010-glass-dense);
border:1px solid var(--vibeui-navbar-010-line);
box-shadow:var(--vibeui-navbar-010-lift-strong),inset 0 1px 0 var(--vibeui-navbar-010-sheen);
-webkit-backdrop-filter:blur(1.5rem) saturate(180%);
backdrop-filter:blur(1.5rem) saturate(180%);
display:flex;flex-direction:column;gap:0.125rem;
transform-origin:top center;
transition:opacity var(--vibeui-navbar-010-dur-2) ease,transform var(--vibeui-navbar-010-dur-3) var(--vibeui-navbar-010-ease);
}
[data-vibeui-block="navbar-010"] [data-part="panel"][data-open="false"]{
opacity:0;transform:translateY(-0.5rem) scale(.98);pointer-events:none;
}
[data-vibeui-block="navbar-010"] [data-part="panel"] a{
padding:0.6875rem 0.875rem;border-radius:0.875rem;
color:var(--vibeui-navbar-010-ink);text-decoration:none;
font-size:0.9375rem;font-weight:540;
transition:background-color var(--vibeui-navbar-010-dur-1) ease;
}
[data-vibeui-block="navbar-010"] [data-part="panel"] a:hover{background:var(--vibeui-navbar-010-glide)}
[data-vibeui-block="navbar-010"] [data-part="panel"] a[aria-current="page"]{
background:var(--vibeui-navbar-010-glide);color:var(--vibeui-navbar-010-accent);
}


[data-vibeui-block="navbar-010"] button:focus-visible{
outline:2px solid var(--vibeui-navbar-010-accent);outline-offset:3px;
}

[data-vibeui-block="navbar-010"] [data-part="filler"]{
max-width:78rem;
margin:calc(-2.75rem - 2 * var(--vibeui-navbar-010-inset)) auto 0;
padding:0 var(--vibeui-navbar-010-inset) 4rem;
display:grid;gap:0.875rem;grid-template-columns:repeat(2,minmax(0,1fr));
}
[data-vibeui-block="navbar-010"] [data-part="filler"] > *{
height:10rem;border-radius:1.5rem;
background:color-mix(in oklab,var(--vibeui-navbar-010-island) 72%,transparent);
border:1px solid var(--vibeui-navbar-010-line);
}
[data-vibeui-block="navbar-010"] [data-part="filler"] > :first-child{
grid-column:1/-1;height:20rem;border-color:transparent;
background:
radial-gradient(34rem 22rem at 74% 46%,color-mix(in oklab,var(--vibeui-navbar-010-accent) 92%,transparent),transparent 62%),
linear-gradient(122deg,#1a1a1a 0%,#33241a 58%,#6b3a16 100%);
}
[data-vibeui-block="navbar-010"] [data-part="filler"] > :nth-child(4){
background:linear-gradient(140deg,
color-mix(in oklab,var(--vibeui-navbar-010-accent) 34%,transparent),
color-mix(in oklab,var(--vibeui-navbar-010-island) 74%,transparent));
}
[data-vibeui-block="navbar-010"] [data-part="filler"] > :nth-child(6){
background:color-mix(in oklab,#1a1a1a 82%,transparent);border-color:transparent;
}

@container (max-width: 32rem){
[data-vibeui-block="navbar-010"] [data-part="burger"]{padding:0.5625rem;gap:0}
[data-vibeui-block="navbar-010"] [data-part="burger"] span:last-child{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="navbar-010"] [data-part="brand"]{padding-right:0.875rem}
}

@container (min-width: 54rem){
[data-vibeui-block="navbar-010"] [data-part="nav"]{display:inline-flex}
[data-vibeui-block="navbar-010"] [data-part="burger"],
[data-vibeui-block="navbar-010"] [data-part="panel"]{display:none}
[data-vibeui-block="navbar-010"] [data-part="filler"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}

@media (prefers-reduced-motion:reduce){
[data-vibeui-block="navbar-010"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_LINKS: Navbar010Link[] = [
  { label: "Продукт", href: "#product", current: true },
  { label: "Технология", href: "#tech" },
  { label: "Цены", href: "#pricing" },
  { label: "Блог", href: "#blog" },
]

/** Плавающая шапка-островки: у начала прокрутки — три капсулы, дальше — одна пилюля. */
export function Navbar010({
  brand = "Ново",
  markLabel = "Н",
  navLabel = "Разделы сайта",
  menuLabel = "Меню",
  closeLabel = "Закрыть",
  links = DEFAULT_LINKS,
  actionLabel = "Попробовать",
  actionHref = "#try",
  inset = "tight",
  tone = "auto",
  sticky = true,
  demo = true,
  accent,
  className,
  style,
}: Navbar010Props) {
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
      "--vibeui-navbar-010-glider-x",
      `${item.offsetLeft - nav.clientLeft}px`,
    )
    nav.style.setProperty(
      "--vibeui-navbar-010-glider-w",
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
      dock.toggleAttribute("data-scrolled", offset > 8)
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

  const trackPointer = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty(
      "--vibeui-navbar-010-mx",
      `${event.clientX - rect.left}px`,
    )
    event.currentTarget.style.setProperty(
      "--vibeui-navbar-010-my",
      `${event.clientY - rect.top}px`,
    )
  }

  const palette = {
    ...(accent ? { "--vibeui-navbar-010-accent": accent } : null),
    ...style,
  } as CSSProperties

  const header = (
    <div ref={dockRef} data-part="dock" data-sticky={sticky ? "on" : undefined}>
      <header data-part="bar">
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

        <button
          type="button"
          data-part="burger"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? closeLabel : menuLabel}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span data-part="bars" aria-hidden="true" />
          <span>{menuOpen ? closeLabel : menuLabel}</span>
        </button>

        <Button016
          data-part="action"
          onPointerMove={trackPointer}
          label={actionLabel}
          href={actionHref}
          external={false}
          size="sm"
          tone="accent"
          accent={accent}
        />
      </header>

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
      <style href="vibeui-navbar-010" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="navbar-010"
        data-tone={tone === "auto" ? undefined : tone}
        data-inset={inset === "roomy" ? "roomy" : undefined}
        className={className}
        style={palette}
      >
        {demo ? (
          <div ref={stageRef} data-part="stage">
            {header}
            <div data-part="filler" aria-hidden="true">
              <div />
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
      </div>
    </>
  )
}

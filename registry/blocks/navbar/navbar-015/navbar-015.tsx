"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"

type Navbar015Link = {
  label: string
  href: string
  current?: boolean
}

export type Navbar015Props = {
  brand?: string
  /** Ссылки слева от знака. */
  leftLinks?: Navbar015Link[]
  /** Ссылки справа от знака. */
  rightLinks?: Navbar015Link[]
  navLabel?: string
  menuLabel?: string
  closeLabel?: string
  /** Служебные действия справа. */
  bagLabel?: string
  bagHref?: string
  /** Количество в корзине; ноль убирает счётчик. */
  bagCount?: number
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Симметричная шапка с центральным брендом: текстовый знак в разрядку по
// центру, две группы ссылок по краям, щедрые интервалы. Светлая или
// чёрная версия для fashion, предметного дизайна и персонального бренда.
// Премиальность создают пропорции и сдержанность, а не декор: у ссылок
// нет ни фонов, ни рамок — только волосяная линия, растущая из центра на
// наведении, и разрядка, которая чуть раскрывается у знака.
//
// В узкой колонке знак остаётся по центру, ссылки уходят в лист на
// непрозрачной поверхности. Клиентский JS нужен только для этого листа.
const STYLES = `
:where([data-vibeui-block="navbar-015"]){
--vibeui-navbar-015-bg:light-dark(#ffffff,#000000);
--vibeui-navbar-015-ink:light-dark(#000000,#ffffff);
--vibeui-navbar-015-muted:light-dark(color-mix(in oklab,#000000 56%,#ffffff),color-mix(in oklab,#ffffff 62%,#000000));
--vibeui-navbar-015-line:light-dark(color-mix(in oklab,#000000 12%,transparent),color-mix(in oklab,#ffffff 16%,transparent));
--vibeui-navbar-015-shadow:light-dark(0 1.25rem 3rem color-mix(in oklab,#000000 16%,transparent),0 1.25rem 3rem color-mix(in oklab,#000000 70%,transparent));
--vibeui-navbar-015-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-015-on-accent:oklch(from var(--vibeui-navbar-015-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-navbar-015-ease:cubic-bezier(.32,.72,0,1);
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-015"]{color-scheme:dark}
:where([data-vibeui-block="navbar-015"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-015"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-015"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-015-bg);color:var(--vibeui-navbar-015-ink);
border-bottom:1px solid var(--vibeui-navbar-015-line);
font-family:var(--vibeui-navbar-015-font);
font-feature-settings:"cv11","ss01";
}
[data-vibeui-block="navbar-015"] *{box-sizing:border-box}
[data-vibeui-block="navbar-015"] [data-part="shell"]{
display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:1rem;
max-width:88rem;margin:0 auto;padding:1.125rem 1rem;
}

[data-vibeui-block="navbar-015"] [data-part="left"],
[data-vibeui-block="navbar-015"] [data-part="right"]{
display:none;align-items:center;gap:0.25rem;
}
[data-vibeui-block="navbar-015"] [data-part="left"]{grid-column:1;justify-content:flex-start}
[data-vibeui-block="navbar-015"] [data-part="right"]{grid-column:3;justify-content:flex-end}
[data-vibeui-block="navbar-015"] [data-part="link"]{
position:relative;padding:0.4375rem 0.6875rem;
color:var(--vibeui-navbar-015-muted);text-decoration:none;
font-size:0.75rem;font-weight:580;letter-spacing:0.16em;text-transform:uppercase;
white-space:nowrap;
transition:color .16s ease;
}
[data-vibeui-block="navbar-015"] [data-part="link"]::after{
content:"";position:absolute;left:0.6875rem;right:0.6875rem;bottom:0.125rem;height:1px;
background:currentColor;
transform:scaleX(0);transform-origin:center;
transition:transform .32s var(--vibeui-navbar-015-ease);
}
[data-vibeui-block="navbar-015"] [data-part="link"]:hover{color:var(--vibeui-navbar-015-ink)}
[data-vibeui-block="navbar-015"] [data-part="link"]:hover::after{transform:scaleX(1)}
[data-vibeui-block="navbar-015"] [data-part="link"][aria-current="page"]{color:var(--vibeui-navbar-015-ink)}
[data-vibeui-block="navbar-015"] [data-part="link"][aria-current="page"]::after{
background:var(--vibeui-navbar-015-accent);transform:scaleX(1);height:1.5px;color:oklch(from var(--vibeui-navbar-015-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}

[data-vibeui-block="navbar-015"] [data-part="menu"]{
grid-column:1;justify-self:start;
cursor:pointer;background:transparent;border:0;padding:0.375rem 0;
display:inline-flex;align-items:center;gap:0.5rem;
color:var(--vibeui-navbar-015-ink);font:inherit;
font-size:0.75rem;font-weight:620;letter-spacing:0.16em;text-transform:uppercase;
}
[data-vibeui-block="navbar-015"] [data-part="bars"]{position:relative;width:1rem;height:0.625rem;flex:none}
[data-vibeui-block="navbar-015"] [data-part="bars"]::before,
[data-vibeui-block="navbar-015"] [data-part="bars"]::after{
content:"";position:absolute;left:0;right:0;height:1px;background:currentColor;
transition:transform .32s var(--vibeui-navbar-015-ease);
}
[data-vibeui-block="navbar-015"] [data-part="bars"]::before{top:0}
[data-vibeui-block="navbar-015"] [data-part="bars"]::after{bottom:0}
[data-vibeui-block="navbar-015"] [data-part="menu"][aria-expanded="true"] [data-part="bars"]::before{transform:translateY(0.3125rem) rotate(45deg)}
[data-vibeui-block="navbar-015"] [data-part="menu"][aria-expanded="true"] [data-part="bars"]::after{transform:translateY(-0.3125rem) rotate(-45deg)}

[data-vibeui-block="navbar-015"] [data-part="brand"]{
grid-column:2;justify-self:center;
color:inherit;text-decoration:none;text-align:center;
font-size:clamp(1.125rem,3.2cqi,1.75rem);font-weight:740;
letter-spacing:0.34em;text-transform:uppercase;text-indent:0.34em;
white-space:nowrap;
transition:letter-spacing .45s var(--vibeui-navbar-015-ease),text-indent .45s var(--vibeui-navbar-015-ease);
}
[data-vibeui-block="navbar-015"] [data-part="brand"]:hover{letter-spacing:0.42em;text-indent:0.42em}

[data-vibeui-block="navbar-015"] [data-part="bag"],
[data-vibeui-block="navbar-015"] [data-part="bag-mobile"]{
position:relative;
display:inline-flex;align-items:center;gap:0.4375rem;padding:0.4375rem 0;
color:var(--vibeui-navbar-015-muted);text-decoration:none;
font-size:0.75rem;font-weight:580;letter-spacing:0.16em;text-transform:uppercase;
transition:color .16s ease;
}
[data-vibeui-block="navbar-015"] [data-part="bag"]:hover,
[data-vibeui-block="navbar-015"] [data-part="bag-mobile"]:hover{color:var(--vibeui-navbar-015-ink)}
[data-vibeui-block="navbar-015"] [data-part="bag-mobile"]{grid-column:3;justify-self:end}
[data-vibeui-block="navbar-015"] [data-part="count"]{
min-width:1.125rem;height:1.125rem;padding:0 0.3125rem;
display:inline-flex;align-items:center;justify-content:center;border-radius:999px;
background:var(--vibeui-navbar-015-accent);color:oklch(from var(--vibeui-navbar-015-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-size:0.6875rem;font-weight:700;letter-spacing:0;
}

[data-vibeui-block="navbar-015"] [data-part="sheet"]{
position:absolute;left:0;right:0;top:100%;z-index:60;
background:var(--vibeui-navbar-015-bg);
border-bottom:1px solid var(--vibeui-navbar-015-line);
box-shadow:var(--vibeui-navbar-015-shadow);
padding:0.5rem 1rem 1.25rem;display:flex;flex-direction:column;
transition:opacity .2s ease,transform .3s var(--vibeui-navbar-015-ease);
}
[data-vibeui-block="navbar-015"] [data-part="sheet"][data-open="false"]{
opacity:0;transform:translateY(-0.625rem);pointer-events:none;
}
[data-vibeui-block="navbar-015"] [data-part="sheet"] a{
padding:0.9375rem 0.25rem;color:var(--vibeui-navbar-015-ink);text-decoration:none;
font-size:0.9375rem;font-weight:560;letter-spacing:0.14em;text-transform:uppercase;
border-bottom:1px solid var(--vibeui-navbar-015-line);
}
[data-vibeui-block="navbar-015"] [data-part="sheet"] a:last-child{border-bottom:0}
[data-vibeui-block="navbar-015"] [data-part="sheet"] a[aria-current="page"]{color:var(--vibeui-navbar-015-accent)}

[data-vibeui-block="navbar-015"] a:focus-visible,
[data-vibeui-block="navbar-015"] button:focus-visible{
outline:2px solid var(--vibeui-navbar-015-accent);outline-offset:4px;
}
@container (min-width: 56rem){
[data-vibeui-block="navbar-015"] [data-part="shell"]{padding:1.5rem 2.5rem}
[data-vibeui-block="navbar-015"] [data-part="left"],
[data-vibeui-block="navbar-015"] [data-part="right"]{display:flex}
[data-vibeui-block="navbar-015"] [data-part="menu"],
[data-vibeui-block="navbar-015"] [data-part="sheet"],
[data-vibeui-block="navbar-015"] [data-part="bag-mobile"]{display:none}
[data-vibeui-block="navbar-015"] [data-part="bag"]{margin-left:1.25rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LEFT: Navbar015Link[] = [
  { label: "Коллекции", href: "#collections", current: true },
  { label: "Предметы", href: "#objects" },
]

const DEFAULT_RIGHT: Navbar015Link[] = [
  { label: "Ателье", href: "#atelier" },
  { label: "Журнал", href: "#journal" },
]

/** Симметричная шапка: центральный знак в разрядку и две группы ссылок по краям. */
export function Navbar015({
  brand = "Мера",
  leftLinks = DEFAULT_LEFT,
  rightLinks = DEFAULT_RIGHT,
  navLabel = "Разделы сайта",
  menuLabel = "Меню",
  closeLabel = "Закрыть",
  bagLabel = "Корзина",
  bagHref = "#bag",
  bagCount = 2,
  tone = "auto",
  accent,
  className,
  style,
}: Navbar015Props) {
  const rootRef = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const allLinks = [...leftLinks, ...rightLinks]

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
    ...(accent ? { "--vibeui-navbar-015-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-015" precedence="medium">
        {STYLES}
      </style>
      <header
        ref={rootRef}
        data-vibeui-block="navbar-015"
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <nav data-part="left" aria-label={navLabel}>
            {leftLinks.map((link) => (
              <a
                data-part="link"
                key={link.href}
                href={link.href}
                aria-current={link.current ? "page" : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            data-part="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span data-part="bars" aria-hidden="true" />
            {menuOpen ? closeLabel : menuLabel}
          </button>

          <a data-part="brand" href="#top">
            {brand}
          </a>

          <nav data-part="right" aria-label={navLabel}>
            {rightLinks.map((link) => (
              <a
                data-part="link"
                key={link.href}
                href={link.href}
                aria-current={link.current ? "page" : undefined}
              >
                {link.label}
              </a>
            ))}
            <a data-part="bag" href={bagHref}>
              {bagLabel}
              {bagCount > 0 ? (
                <span data-part="count" aria-hidden="true">
                  {bagCount}
                </span>
              ) : null}
            </a>
          </nav>

          <a data-part="bag-mobile" href={bagHref}>
            {bagLabel}
            {bagCount > 0 ? (
              <span data-part="count" aria-hidden="true">
                {bagCount}
              </span>
            ) : null}
          </a>
        </div>

        <nav
          data-part="sheet"
          data-open={menuOpen}
          aria-label={navLabel}
          aria-hidden={!menuOpen}
        >
          {allLinks.map((link) => (
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

"use client"

import { useEffect, useState, type CSSProperties } from "react"

export type Navbar045Link = {
  label: string
  href: string
}

export type Navbar045Props = {
  brand?: string
  /** Подпись под именем: «тексты и книга». */
  tagline?: string
  brandHref?: string
  links?: readonly Navbar045Link[]
  /** Стартовое состояние переключателя: «night» — графит, «day» — бумага. */
  defaultMode?: "day" | "night"
  sticky?: boolean
  /** aria навигации, меню и кнопки-бургера. */
  navLabel?: string
  menuLabel?: string
  menuOpenLabel?: string
  menuCloseLabel?: string
  /** aria переключателя темы. */
  nightLabel?: string
  paperLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Шапка сайта писателя: имя антиквой с крошечной подписью, три раздела,
// солнце/луна и бургер. Переключатель шлёт событие `vibeui-writer:theme`,
// и весь сайт (каждый блок слушает) меняет color-scheme с кроссфейдом.
// По низу шапки — чернильная линия прогресса чтения страницы: заполняется
// вместе с прокруткой, как закладка в книге.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=PT+Serif:ital,wght@0,400;0,700;1,400&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-045"]){
--vibeui-navbar-045-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-045-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-045-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-045-muted:color-mix(in oklab,var(--vibeui-navbar-045-fg) 62%,var(--vibeui-navbar-045-bg));
--vibeui-navbar-045-line:color-mix(in oklab,var(--vibeui-navbar-045-fg) 14%,transparent);
--vibeui-navbar-045-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-navbar-045-font:"PT Serif",Georgia,"Times New Roman",serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-045"]{color-scheme:dark}
:where([data-vibeui-block="navbar-045"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-045"][data-tone="dark"]){color-scheme:dark}
:where([data-vibeui-block="navbar-045"][data-mode="day"]){color-scheme:light}
:where([data-vibeui-block="navbar-045"][data-mode="night"]){color-scheme:dark}
[data-vibeui-block="navbar-045"]{box-sizing:border-box;position:relative;z-index:50;background:var(--vibeui-navbar-045-bg);color:var(--vibeui-navbar-045-fg);font-family:var(--vibeui-navbar-045-font);font-size:.95rem;line-height:1.4;transition:background-color .6s,color .6s}
[data-vibeui-block="navbar-045"][data-sticky="true"]{position:sticky;top:0}
[data-vibeui-block="navbar-045"][data-scrolled="true"]{background:color-mix(in oklab,var(--vibeui-navbar-045-bg) 86%,transparent);backdrop-filter:blur(14px)}
[data-vibeui-block="navbar-045"] *{box-sizing:border-box}
[data-vibeui-block="navbar-045"] [data-part="row"]{display:flex;align-items:center;gap:.8rem;height:4.25rem;max-width:74rem;margin:0 auto;padding:0 1.25rem;border-bottom:1px solid var(--vibeui-navbar-045-line);transition:border-color .6s}
[data-vibeui-block="navbar-045"] [data-part="brand"]{display:flex;flex-direction:column;gap:.05rem;text-decoration:none;color:inherit;min-width:0}
[data-vibeui-block="navbar-045"] [data-part="name"]{font-family:var(--vibeui-navbar-045-display);font-weight:500;font-size:1.45rem;line-height:1;letter-spacing:.01em;white-space:nowrap}
[data-vibeui-block="navbar-045"] [data-part="tagline"]{font-size:.66rem;font-style:italic;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-navbar-045-muted);white-space:nowrap}
[data-vibeui-block="navbar-045"] [data-part="nav"]{display:none;gap:1.6rem;margin-left:2rem}
[data-vibeui-block="navbar-045"] [data-part="nav"] a{position:relative;color:var(--vibeui-navbar-045-muted);text-decoration:none;font-style:italic;font-size:1.02rem;transition:color .25s}
[data-vibeui-block="navbar-045"] [data-part="nav"] a::after{content:"";position:absolute;left:0;right:0;bottom:-.2em;height:1px;background:var(--vibeui-navbar-045-accent);transform:scaleX(0);transform-origin:left;transition:transform .3s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="navbar-045"] [data-part="nav"] a:hover{color:var(--vibeui-navbar-045-fg)}
[data-vibeui-block="navbar-045"] [data-part="nav"] a:hover::after{transform:scaleX(1)}
[data-vibeui-block="navbar-045"] [data-part="right"]{margin-left:auto;display:flex;align-items:center;gap:.6rem}
[data-vibeui-block="navbar-045"] [data-part="mode"]{position:relative;display:inline-grid;place-items:center;width:2.5rem;height:2.5rem;padding:0;border:1px solid var(--vibeui-navbar-045-line);border-radius:999px;background:transparent;color:var(--vibeui-navbar-045-accent);cursor:pointer;transition:border-color .25s,transform .25s}
[data-vibeui-block="navbar-045"] [data-part="mode"]:hover{border-color:var(--vibeui-navbar-045-accent);transform:rotate(15deg)}
[data-vibeui-block="navbar-045"] [data-part="mode"] svg{position:absolute;width:1.15rem;height:1.15rem;transition:opacity .5s,transform .6s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="navbar-045"] [data-part="mode"] [data-icon="sun"]{opacity:0;transform:rotate(-90deg) scale(.5)}
[data-vibeui-block="navbar-045"] [data-part="mode"] [data-icon="moon"]{opacity:1;transform:rotate(0) scale(1)}
[data-vibeui-block="navbar-045"] [data-part="mode"][aria-checked="true"] [data-icon="sun"]{opacity:1;transform:rotate(0) scale(1)}
[data-vibeui-block="navbar-045"] [data-part="mode"][aria-checked="true"] [data-icon="moon"]{opacity:0;transform:rotate(90deg) scale(.5)}
[data-vibeui-block="navbar-045"] [data-part="burger"]{display:inline-flex;flex-direction:column;justify-content:center;gap:5px;flex-shrink:0;width:2.5rem;height:2.5rem;padding:0;border:1px solid var(--vibeui-navbar-045-line);border-radius:999px;background:transparent;color:inherit;cursor:pointer}
[data-vibeui-block="navbar-045"] [data-part="burger"] i{display:block;width:1rem;height:1px;margin:0 auto;background:currentColor;transition:transform .25s,opacity .2s}
[data-vibeui-block="navbar-045"] [data-part="burger"][aria-expanded="true"] i:nth-child(1){transform:translateY(6px) rotate(45deg)}
[data-vibeui-block="navbar-045"] [data-part="burger"][aria-expanded="true"] i:nth-child(2){opacity:0}
[data-vibeui-block="navbar-045"] [data-part="burger"][aria-expanded="true"] i:nth-child(3){transform:translateY(-6px) rotate(-45deg)}
[data-vibeui-block="navbar-045"] a:focus-visible,[data-vibeui-block="navbar-045"] button:focus-visible{outline:2px solid var(--vibeui-navbar-045-accent);outline-offset:2px}
[data-vibeui-block="navbar-045"] [data-part="menu"]{display:grid;gap:.1rem;max-width:74rem;margin:0 auto;padding:.6rem 1.25rem 1.2rem;background:var(--vibeui-navbar-045-bg);animation:vibeui-navbar-045-menu .25s ease-out}
[data-vibeui-block="navbar-045"] [data-part="menu"][hidden]{display:none}
[data-vibeui-block="navbar-045"] [data-part="menu"] a{padding:.8rem .2rem;border-bottom:1px solid var(--vibeui-navbar-045-line);color:var(--vibeui-navbar-045-fg);text-decoration:none;font-family:var(--vibeui-navbar-045-display);font-size:1.5rem;font-weight:500}
[data-vibeui-block="navbar-045"] [data-part="menu"] a:hover{color:var(--vibeui-navbar-045-accent)}
[data-vibeui-block="navbar-045"] [data-part="progress"]{position:absolute;left:0;right:0;bottom:0;height:2px;background:var(--vibeui-navbar-045-accent);transform:scaleX(var(--vibeui-navbar-045-read,0));transform-origin:left;pointer-events:none}
@keyframes vibeui-navbar-045-menu{from{opacity:0;transform:translateY(-6px)}}
@container (min-width: 52rem){[data-vibeui-block="navbar-045"] [data-part="nav"]{display:flex}[data-vibeui-block="navbar-045"] [data-part="burger"],[data-vibeui-block="navbar-045"] [data-part="menu"]{display:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-045"] *{animation:none!important;transition:none!important}}`

/** Шапка писателя: имя антиквой, солнце/луна на весь сайт, линия прочитанного. */
export function Navbar045({
  brand = "Вера Холодова",
  tagline = "тексты и книга",
  brandHref = "#top",
  links = [
    { label: "Тексты", href: "#texts" },
    { label: "Книга", href: "#book" },
    { label: "Письма", href: "#letters" },
  ],
  defaultMode = "night",
  sticky = true,
  navLabel = "Разделы",
  menuLabel = "Меню",
  menuOpenLabel = "Открыть меню",
  menuCloseLabel = "Закрыть меню",
  nightLabel = "Включить ночь",
  paperLabel = "Включить бумагу",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Navbar045Props) {
  const [scrolled, setScrolled] = useState(false)
  const [read, setRead] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mode, setMode] = useState<"day" | "night" | null>(null)
  const current = mode ?? defaultMode

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(window.scrollY > 12)
      setRead(total > 0 ? Math.min(1, window.scrollY / total) : 0)
    }
    const onTheme = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: string }>).detail
      if (detail?.mode === "day" || detail?.mode === "night") setMode(detail.mode)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("vibeui-writer:theme", onTheme)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("vibeui-writer:theme", onTheme)
    }
  }, [])

  const toggle = () => {
    const next = current === "day" ? "night" : "day"
    setMode(next)
    window.dispatchEvent(new CustomEvent("vibeui-writer:theme", { detail: { mode: next } }))
  }

  const palette = {
    ...(accent ? { "--vibeui-navbar-045-accent": accent } : null),
    ...(ink ? { "--vibeui-navbar-045-fg": ink } : null),
    ...(background ? { "--vibeui-navbar-045-bg": background } : null),
    "--vibeui-navbar-045-read": read,
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-045" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-045" data-tone={tone === "auto" ? undefined : tone} data-mode={mode ?? undefined} data-sticky={sticky} data-scrolled={scrolled} className={className} style={palette}>
        <div data-part="row">
          <a data-part="brand" href={brandHref}>
            <span data-part="name">{brand}</span>
            {tagline ? <span data-part="tagline">{tagline}</span> : null}
          </a>
          <nav data-part="nav" aria-label={navLabel}>
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div data-part="right">
            <button data-part="mode" type="button" role="switch" aria-checked={current === "day"} aria-label={current === "day" ? nightLabel : paperLabel} onClick={toggle}>
              <svg data-icon="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
              <svg data-icon="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
              </svg>
            </button>
            <button data-part="burger" type="button" aria-expanded={menuOpen} aria-controls="vibeui-navbar-045-menu" aria-label={menuOpen ? menuCloseLabel : menuOpenLabel} onClick={() => setMenuOpen((value) => !value)}>
              <i aria-hidden="true" />
              <i aria-hidden="true" />
              <i aria-hidden="true" />
            </button>
          </div>
        </div>
        <nav data-part="menu" id="vibeui-navbar-045-menu" hidden={!menuOpen} aria-label={menuLabel} onClick={() => setMenuOpen(false)}>
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <i data-part="progress" aria-hidden="true" />
      </header>
    </>
  )
}

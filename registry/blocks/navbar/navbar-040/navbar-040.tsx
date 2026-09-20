"use client"

import { useEffect, useState, type CSSProperties } from "react"

export type Navbar040Link = {
  label: string
  href: string
}

export type Navbar040Props = {
  brand?: string
  brandHref?: string
  links?: readonly Navbar040Link[]
  loginLabel?: string
  loginHref?: string
  actionLabel?: string
  actionHref?: string
  sticky?: boolean
  /** aria навигации, меню и кнопки-бургера. */
  navLabel?: string
  menuLabel?: string
  menuOpenLabel?: string
  menuCloseLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Шапка необанка: лого-«ось» — кольцо с диагональю, которая медленно
// качается, разделы, тихая ссылка «Войти» и кнопка «Открыть счёт» с
// мятным свечением. При прокрутке шапка становится стеклом, а по низу
// проявляется тонкая зелёная линия-сияние. На узком — бургер и меню.
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@600;700;800&family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-040"]){
--vibeui-navbar-040-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-040-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-040-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-040-on-accent:oklch(from var(--vibeui-navbar-040-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-040-mint:color-mix(in oklab,var(--vibeui-navbar-040-accent) 45%,#99f6e4);
--vibeui-navbar-040-muted:color-mix(in oklab,var(--vibeui-navbar-040-fg) 62%,var(--vibeui-navbar-040-bg));
--vibeui-navbar-040-line:color-mix(in oklab,var(--vibeui-navbar-040-fg) 11%,transparent);
--vibeui-navbar-040-aurora:linear-gradient(90deg,transparent,var(--vibeui-navbar-040-accent),var(--vibeui-navbar-040-mint),transparent);
--vibeui-navbar-040-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-040-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-040"]{color-scheme:dark}
:where([data-vibeui-block="navbar-040"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-040"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-040"]{box-sizing:border-box;position:relative;z-index:50;font-family:var(--vibeui-navbar-040-font);color:var(--vibeui-navbar-040-fg);font-size:.94rem;line-height:1.4;transition:background .3s}
[data-vibeui-block="navbar-040"][data-sticky="true"]{position:sticky;top:0}
[data-vibeui-block="navbar-040"]::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--vibeui-navbar-040-aurora);opacity:0;transition:opacity .4s}
[data-vibeui-block="navbar-040"][data-scrolled="true"]{background:color-mix(in oklab,var(--vibeui-navbar-040-bg) 72%,transparent);backdrop-filter:blur(18px)}
[data-vibeui-block="navbar-040"][data-scrolled="true"]::after{opacity:.8}
[data-vibeui-block="navbar-040"] *{box-sizing:border-box}
[data-vibeui-block="navbar-040"] [data-part="row"]{display:flex;align-items:center;gap:.8rem;height:4.2rem;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="navbar-040"] [data-part="brand"]{display:inline-flex;align-items:center;gap:.55rem;font-family:var(--vibeui-navbar-040-display);font-weight:800;font-size:1.25rem;letter-spacing:-.03em;text-decoration:none;color:inherit}
[data-vibeui-block="navbar-040"] [data-part="mark"]{width:1.5rem;height:1.5rem;color:var(--vibeui-navbar-040-accent);overflow:visible}
[data-vibeui-block="navbar-040"] [data-part="mark"] line{transform-origin:12px 12px;animation:vibeui-navbar-040-axis 6s ease-in-out infinite}
[data-vibeui-block="navbar-040"] [data-part="nav"]{display:none;gap:1.4rem;margin-left:1.4rem}
[data-vibeui-block="navbar-040"] [data-part="nav"] a{position:relative;color:var(--vibeui-navbar-040-muted);text-decoration:none;font-weight:500;transition:color .2s}
[data-vibeui-block="navbar-040"] [data-part="nav"] a::after{content:"";position:absolute;left:0;right:0;bottom:-.35rem;height:1px;background:var(--vibeui-navbar-040-accent);transform:scaleX(0);transform-origin:left;transition:transform .25s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="navbar-040"] [data-part="nav"] a:hover{color:var(--vibeui-navbar-040-fg)}
[data-vibeui-block="navbar-040"] [data-part="nav"] a:hover::after{transform:scaleX(1)}
[data-vibeui-block="navbar-040"] [data-part="right"]{margin-left:auto;display:flex;align-items:center;gap:1rem}
[data-vibeui-block="navbar-040"] [data-part="login"]{display:none;color:var(--vibeui-navbar-040-muted);text-decoration:none;font-weight:500;transition:color .2s}
[data-vibeui-block="navbar-040"] [data-part="login"]:hover{color:var(--vibeui-navbar-040-fg)}
[data-vibeui-block="navbar-040"] [data-part="action"]{position:relative;display:inline-flex;align-items:center;gap:.4rem;padding:.62rem 1.1rem;border-radius:999px;background:var(--vibeui-navbar-040-accent);color:var(--vibeui-navbar-040-on-accent);text-decoration:none;font-weight:600;font-size:.88rem;white-space:nowrap;transition:transform .18s,box-shadow .25s}
[data-vibeui-block="navbar-040"] [data-part="action"]:hover{transform:translateY(-1px);box-shadow:0 10px 28px -8px var(--vibeui-navbar-040-accent)}
[data-vibeui-block="navbar-040"] a:focus-visible{outline:2px solid var(--vibeui-navbar-040-accent);outline-offset:2px}
@keyframes vibeui-navbar-040-axis{0%,100%{transform:rotate(-12deg)}50%{transform:rotate(12deg)}}
@container (min-width: 40rem){[data-vibeui-block="navbar-040"] [data-part="login"]{display:inline}}
@container (min-width: 56rem){[data-vibeui-block="navbar-040"] [data-part="nav"]{display:flex}}
[data-vibeui-block="navbar-040"] [data-part="burger"]{display:inline-flex;flex-direction:column;justify-content:center;gap:5px;flex-shrink:0;width:2.5rem;height:2.5rem;padding:0;border:1px solid var(--vibeui-navbar-040-line);border-radius:999px;background:transparent;color:inherit;cursor:pointer}
[data-vibeui-block="navbar-040"] [data-part="burger"] i{display:block;width:1rem;height:2px;margin:0 auto;background:currentColor;border-radius:2px;transition:transform .25s,opacity .2s}
[data-vibeui-block="navbar-040"] [data-part="burger"][aria-expanded="true"] i:nth-child(1){transform:translateY(7px) rotate(45deg)}
[data-vibeui-block="navbar-040"] [data-part="burger"][aria-expanded="true"] i:nth-child(2){opacity:0}
[data-vibeui-block="navbar-040"] [data-part="burger"][aria-expanded="true"] i:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
[data-vibeui-block="navbar-040"] [data-part="burger"]:focus-visible{outline:2px solid var(--vibeui-navbar-040-accent);outline-offset:2px}
[data-vibeui-block="navbar-040"] [data-part="menu"]{display:grid;gap:.2rem;max-width:80rem;margin:0 auto;padding:.6rem 1.25rem 1.25rem;border-top:1px solid var(--vibeui-navbar-040-line);background:var(--vibeui-navbar-040-bg);animation:vibeui-navbar-040-menu .22s ease-out}
[data-vibeui-block="navbar-040"] [data-part="menu"][hidden]{display:none}
[data-vibeui-block="navbar-040"] [data-part="menu"] a{padding:.8rem .7rem;border-radius:.7rem;color:var(--vibeui-navbar-040-fg);text-decoration:none;font-weight:600;font-size:1.05rem}
[data-vibeui-block="navbar-040"] [data-part="menu"] a:hover{background:color-mix(in oklab,var(--vibeui-navbar-040-fg) 6%,transparent)}
[data-vibeui-block="navbar-040"] [data-part="menu"] a[data-cta]{margin-top:.4rem;text-align:center;background:var(--vibeui-navbar-040-accent);color:var(--vibeui-navbar-040-on-accent)}
@keyframes vibeui-navbar-040-menu{from{opacity:0;transform:translateY(-6px)}}
@container (min-width: 56rem){[data-vibeui-block="navbar-040"] [data-part="burger"],[data-vibeui-block="navbar-040"] [data-part="menu"]{display:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-040"] *{animation:none!important;transition:none!important}}`

/** Шапка необанка с лого-осью, «Войти» и «Открыть счёт». */
export function Navbar040({
  brand = "Ось",
  brandHref = "#top",
  links = [
    { label: "Возможности", href: "#features" },
    { label: "Экономия", href: "#calc" },
    { label: "Безопасность", href: "#security" },
    { label: "Тарифы", href: "#pricing" },
    { label: "Приложение", href: "#app" },
  ],
  loginLabel = "Войти",
  loginHref = "#login",
  actionLabel = "Открыть счёт",
  actionHref = "#open",
  sticky = true,
  navLabel = "Разделы",
  menuLabel = "Меню",
  menuOpenLabel = "Открыть меню",
  menuCloseLabel = "Закрыть меню",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Navbar040Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-navbar-040-accent": accent } : null),
    ...(ink ? { "--vibeui-navbar-040-fg": ink } : null),
    ...(background ? { "--vibeui-navbar-040-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-040" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-040" data-tone={tone === "auto" ? undefined : tone} data-sticky={sticky} data-scrolled={scrolled} className={className} style={palette}>
        <div data-part="row">
          <a data-part="brand" href={brandHref}>
            <svg data-part="mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <line x1="5.5" y1="18.5" x2="18.5" y2="5.5" />
            </svg>
            {brand}
          </a>
          <nav data-part="nav" aria-label={navLabel}>
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div data-part="right">
            {loginLabel ? (
              <a data-part="login" href={loginHref}>
                {loginLabel}
              </a>
            ) : null}
            {actionLabel ? (
              <a data-part="action" href={actionHref}>
                {actionLabel}
              </a>
            ) : null}
          </div>
          <button data-part="burger" type="button" aria-expanded={menuOpen} aria-controls="vibeui-navbar-040-menu" aria-label={menuOpen ? menuCloseLabel : menuOpenLabel} onClick={() => setMenuOpen((value) => !value)}>
            <i aria-hidden="true" />
            <i aria-hidden="true" />
            <i aria-hidden="true" />
          </button>
        </div>
        <nav data-part="menu" id="vibeui-navbar-040-menu" hidden={!menuOpen} aria-label={menuLabel} onClick={() => setMenuOpen(false)}>
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          {loginLabel ? <a href={loginHref}>{loginLabel}</a> : null}
          {actionLabel ? <a data-cta="" href={actionHref}>{actionLabel}</a> : null}
        </nav>
      </header>
    </>
  )
}

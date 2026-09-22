"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Navbar033Link = {
  label: string
  href: string
}

export type Navbar033Props = {
  brand?: string
  brandHref?: string
  links?: readonly Navbar033Link[]
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

// Шапка AI-сервиса: лого с искрой (четырёхлучевая звезда, медленно
// мерцает), разделы с подчёркиванием, которое вырастает от левого края,
// тихая ссылка «Войти» и магнитная кнопка «Начать бесплатно». По низу
// шапки аврора-линия — это прогресс прокрутки страницы: растёт слева
// направо по мере чтения, а стекло проявляется после первых пикселей.
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@600;700;800&family=Golos+Text:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-033"]){
--vibeui-navbar-033-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-033-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-033-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-033-on-accent:oklch(from var(--vibeui-navbar-033-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-033-muted:color-mix(in oklab,var(--vibeui-navbar-033-fg) 60%,var(--vibeui-navbar-033-bg));
--vibeui-navbar-033-line:color-mix(in oklab,var(--vibeui-navbar-033-fg) 12%,transparent);
--vibeui-navbar-033-aurora:linear-gradient(90deg,var(--vibeui-navbar-033-accent),color-mix(in oklab,var(--vibeui-navbar-033-accent) 40%,#a855f7),color-mix(in oklab,var(--vibeui-navbar-033-accent) 30%,#f472b6));
--vibeui-navbar-033-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-033-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-033"]{color-scheme:dark}
:where([data-vibeui-block="navbar-033"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-033"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-033"]{--vibeui-navbar-033-p:0;box-sizing:border-box;position:relative;z-index:50;font-family:var(--vibeui-navbar-033-font);color:var(--vibeui-navbar-033-fg);font-size:.92rem;line-height:1.4;transition:background .3s}
[data-vibeui-block="navbar-033"][data-sticky="true"]{position:sticky;top:0}
[data-vibeui-block="navbar-033"]::before{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--vibeui-navbar-033-line);opacity:0;transition:opacity .4s}
[data-vibeui-block="navbar-033"]::after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;background:var(--vibeui-navbar-033-aurora);opacity:0;transform:scaleX(var(--vibeui-navbar-033-p));transform-origin:left;transition:opacity .4s;box-shadow:0 0 12px var(--vibeui-navbar-033-accent)}
[data-vibeui-block="navbar-033"][data-scrolled="true"]{background:color-mix(in oklab,var(--vibeui-navbar-033-bg) 78%,transparent);backdrop-filter:blur(16px)}
[data-vibeui-block="navbar-033"][data-scrolled="true"]::before{opacity:1}
[data-vibeui-block="navbar-033"][data-scrolled="true"]::after{opacity:.9}
[data-vibeui-block="navbar-033"] *{box-sizing:border-box}
[data-vibeui-block="navbar-033"] [data-part="row"]{display:flex;align-items:center;gap:.8rem;height:4rem;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="navbar-033"] [data-part="brand"]{display:inline-flex;align-items:center;gap:.5rem;font-family:var(--vibeui-navbar-033-display);font-weight:800;font-size:1.15rem;letter-spacing:-.02em;text-decoration:none;color:inherit}
[data-vibeui-block="navbar-033"] [data-part="spark"]{width:1.1rem;height:1.1rem;color:var(--vibeui-navbar-033-accent);animation:vibeui-navbar-033-spark 3s ease-in-out infinite}
[data-vibeui-block="navbar-033"] [data-part="nav"]{display:none;gap:1.3rem;margin-left:1.2rem}
[data-vibeui-block="navbar-033"] [data-part="nav"] a{position:relative;color:var(--vibeui-navbar-033-muted);text-decoration:none;font-weight:500;transition:color .3s,transform .4s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="navbar-033"] [data-part="nav"] a::after{content:"";position:absolute;left:0;right:0;bottom:-4px;height:1.5px;border-radius:2px;background:var(--vibeui-navbar-033-aurora);transform:scaleX(0);transform-origin:left;transition:transform .4s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="navbar-033"] [data-part="nav"] a:hover{color:var(--vibeui-navbar-033-fg);transform:translateY(-1px)}
[data-vibeui-block="navbar-033"] [data-part="nav"] a:hover::after{transform:scaleX(1)}
[data-vibeui-block="navbar-033"] [data-part="right"]{margin-left:auto;display:flex;align-items:center;gap:.9rem}
[data-vibeui-block="navbar-033"] [data-part="login"]{display:none;color:var(--vibeui-navbar-033-muted);text-decoration:none;font-weight:500;transition:color .2s}
[data-vibeui-block="navbar-033"] [data-part="login"]:hover{color:var(--vibeui-navbar-033-fg)}
@keyframes vibeui-navbar-033-spark{0%,100%{transform:scale(.85) rotate(0);opacity:.75}50%{transform:scale(1.1) rotate(45deg);opacity:1}}
@container (min-width: 40rem){[data-vibeui-block="navbar-033"] [data-part="login"]{display:inline}}
@container (min-width: 56rem){[data-vibeui-block="navbar-033"] [data-part="nav"]{display:flex}}
[data-vibeui-block="navbar-033"] [data-part="burger"]{display:inline-flex;flex-direction:column;justify-content:center;gap:5px;flex-shrink:0;width:2.5rem;height:2.5rem;padding:0;border:1px solid var(--vibeui-navbar-033-line);border-radius:999px;background:transparent;color:inherit;cursor:pointer}
[data-vibeui-block="navbar-033"] [data-part="burger"] i{display:block;width:1rem;height:2px;margin:0 auto;background:currentColor;border-radius:2px;transition:transform .25s,opacity .2s}
[data-vibeui-block="navbar-033"] [data-part="burger"][aria-expanded="true"] i:nth-child(1){transform:translateY(7px) rotate(45deg)}
[data-vibeui-block="navbar-033"] [data-part="burger"][aria-expanded="true"] i:nth-child(2){opacity:0}
[data-vibeui-block="navbar-033"] [data-part="burger"][aria-expanded="true"] i:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
[data-vibeui-block="navbar-033"] [data-part="burger"]:focus-visible{outline:2px solid var(--vibeui-navbar-033-accent);outline-offset:2px}
[data-vibeui-block="navbar-033"] [data-part="menu"]{display:grid;gap:.2rem;max-width:80rem;margin:0 auto;padding:.6rem 1.25rem 1.25rem;border-top:1px solid var(--vibeui-navbar-033-line);background:var(--vibeui-navbar-033-bg);animation:vibeui-navbar-033-menu .22s ease-out}
[data-vibeui-block="navbar-033"] [data-part="menu"][hidden]{display:none}
[data-vibeui-block="navbar-033"] [data-part="menu"] a{padding:.8rem .7rem;border-radius:.7rem;color:var(--vibeui-navbar-033-fg);text-decoration:none;font-weight:600;font-size:1.05rem}
[data-vibeui-block="navbar-033"] [data-part="menu"] a:hover{background:color-mix(in oklab,var(--vibeui-navbar-033-fg) 6%,transparent)}
[data-vibeui-block="navbar-033"] [data-part="menu"] a[data-cta]{margin-top:.4rem;text-align:center;background:var(--vibeui-navbar-033-accent);color:var(--vibeui-navbar-033-on-accent)}
@keyframes vibeui-navbar-033-menu{from{opacity:0;transform:translateY(-6px)}}
@container (min-width: 56rem){[data-vibeui-block="navbar-033"] [data-part="burger"],[data-vibeui-block="navbar-033"] [data-part="menu"]{display:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-033"] *{animation:none!important;transition:none!important}}`

/** Шапка AI-сервиса с искрой в лого и аврора-линией. */
export function Navbar033({
  brand = "Сводка",
  brandHref = "#top",
  links = [
    { label: "Как работает", href: "#how" },
    { label: "Попробовать", href: "#sandbox" },
    { label: "Интеграции", href: "#integrations" },
    { label: "Цены", href: "#pricing" },
  ],
  loginLabel = "Войти",
  loginHref = "#login",
  actionLabel = "Начать бесплатно",
  actionHref = "#start",
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
}: Navbar033Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const rootRef = useRef<HTMLElement>(null)
  const actionRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12)
      const root = rootRef.current
      if (!root) return
      const total = document.documentElement.scrollHeight - window.innerHeight
      root.style.setProperty("--vibeui-navbar-033-p", total > 0 ? Math.min(1, window.scrollY / total).toFixed(4) : "0")
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const onActionMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse") return
    const button = actionRef.current
    if (!button) return
    const rect = button.getBoundingClientRect()
    const dx = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const dy = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    button.style.transform = `translate(${(dx * 5).toFixed(1)}px,${(dy * 4).toFixed(1)}px)`
  }
  const onActionLeave = () => {
    if (actionRef.current) actionRef.current.style.transform = ""
  }

  const palette = {
    ...(accent ? { "--vibeui-navbar-033-accent": accent } : null),
    ...(ink ? { "--vibeui-navbar-033-fg": ink } : null),
    ...(background ? { "--vibeui-navbar-033-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-033" precedence="medium">
        {STYLES}
      </style>
      <header ref={rootRef} data-vibeui-block="navbar-033" data-tone={tone === "auto" ? undefined : tone} data-sticky={sticky} data-scrolled={scrolled} className={className} style={palette}>
        <div data-part="row">
          <a data-part="brand" href={brandHref}>
            <svg data-part="spark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2c.6 5.4 4.6 9.4 10 10-5.4.6-9.4 4.6-10 10-.6-5.4-4.6-9.4-10-10 5.4-.6 9.4-4.6 10-10Z" />
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
              <Button016
                data-part="action"
                ref={actionRef}
                onPointerMove={onActionMove}
                onPointerLeave={onActionLeave}
                label={actionLabel}
                href={actionHref}
                external={false}
                size="sm"
                tone="accent"
                accent={accent}
              />
            ) : null}
          </div>
          <button data-part="burger" type="button" aria-expanded={menuOpen} aria-controls="vibeui-navbar-033-menu" aria-label={menuOpen ? menuCloseLabel : menuOpenLabel} onClick={() => setMenuOpen((value) => !value)}>
            <i aria-hidden="true" />
            <i aria-hidden="true" />
            <i aria-hidden="true" />
          </button>
        </div>
        <nav data-part="menu" id="vibeui-navbar-033-menu" hidden={!menuOpen} aria-label={menuLabel} onClick={() => setMenuOpen(false)}>
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

"use client"

import { useEffect, useState, type CSSProperties } from "react"

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
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Шапка AI-сервиса: лого с искрой (четырёхлучевая звезда, медленно
// мерцает), разделы, тихая ссылка «Войти» и кнопка «Начать бесплатно» с
// аврора-градиентом. По низу шапки тонкая линия-аврора, которая
// проявляется при прокрутке вместе со стеклом.
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
[data-vibeui-block="navbar-033"]{box-sizing:border-box;position:relative;z-index:50;font-family:var(--vibeui-navbar-033-font);color:var(--vibeui-navbar-033-fg);font-size:.92rem;line-height:1.4;transition:background .3s}
[data-vibeui-block="navbar-033"][data-sticky="true"]{position:sticky;top:0}
[data-vibeui-block="navbar-033"]::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--vibeui-navbar-033-aurora);opacity:0;transition:opacity .4s}
[data-vibeui-block="navbar-033"][data-scrolled="true"]{background:color-mix(in oklab,var(--vibeui-navbar-033-bg) 78%,transparent);backdrop-filter:blur(16px)}
[data-vibeui-block="navbar-033"][data-scrolled="true"]::after{opacity:.6}
[data-vibeui-block="navbar-033"] *{box-sizing:border-box}
[data-vibeui-block="navbar-033"] [data-part="row"]{display:flex;align-items:center;gap:.8rem;height:4rem;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="navbar-033"] [data-part="brand"]{display:inline-flex;align-items:center;gap:.5rem;font-family:var(--vibeui-navbar-033-display);font-weight:800;font-size:1.15rem;letter-spacing:-.02em;text-decoration:none;color:inherit}
[data-vibeui-block="navbar-033"] [data-part="spark"]{width:1.1rem;height:1.1rem;color:var(--vibeui-navbar-033-accent);animation:vibeui-navbar-033-spark 3s ease-in-out infinite}
[data-vibeui-block="navbar-033"] [data-part="nav"]{display:none;gap:1.3rem;margin-left:1.2rem}
[data-vibeui-block="navbar-033"] [data-part="nav"] a{color:var(--vibeui-navbar-033-muted);text-decoration:none;font-weight:500;transition:color .2s}
[data-vibeui-block="navbar-033"] [data-part="nav"] a:hover{color:var(--vibeui-navbar-033-fg)}
[data-vibeui-block="navbar-033"] [data-part="right"]{margin-left:auto;display:flex;align-items:center;gap:.9rem}
[data-vibeui-block="navbar-033"] [data-part="login"]{display:none;color:var(--vibeui-navbar-033-muted);text-decoration:none;font-weight:500;transition:color .2s}
[data-vibeui-block="navbar-033"] [data-part="login"]:hover{color:var(--vibeui-navbar-033-fg)}
[data-vibeui-block="navbar-033"] [data-part="action"]{position:relative;display:inline-flex;align-items:center;padding:.6rem 1.1rem;border-radius:999px;background:var(--vibeui-navbar-033-accent);color:var(--vibeui-navbar-033-on-accent);text-decoration:none;font-weight:600;font-size:.88rem;white-space:nowrap;transition:transform .18s,box-shadow .2s}
[data-vibeui-block="navbar-033"] [data-part="action"]:hover{transform:translateY(-1px);box-shadow:0 8px 24px -8px var(--vibeui-navbar-033-accent)}
[data-vibeui-block="navbar-033"] a:focus-visible{outline:2px solid var(--vibeui-navbar-033-accent);outline-offset:2px}
@keyframes vibeui-navbar-033-spark{0%,100%{transform:scale(.85) rotate(0);opacity:.75}50%{transform:scale(1.1) rotate(45deg);opacity:1}}
@container (min-width: 40rem){[data-vibeui-block="navbar-033"] [data-part="login"]{display:inline}}
@container (min-width: 56rem){[data-vibeui-block="navbar-033"] [data-part="nav"]{display:flex}}
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
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Navbar033Props) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

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
      <header data-vibeui-block="navbar-033" data-tone={tone === "auto" ? undefined : tone} data-sticky={sticky} data-scrolled={scrolled} className={className} style={palette}>
        <div data-part="row">
          <a data-part="brand" href={brandHref}>
            <svg data-part="spark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2c.6 5.4 4.6 9.4 10 10-5.4.6-9.4 4.6-10 10-.6-5.4-4.6-9.4-10-10 5.4-.6 9.4-4.6 10-10Z" />
            </svg>
            {brand}
          </a>
          <nav data-part="nav" aria-label="Разделы">
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
        </div>
      </header>
    </>
  )
}

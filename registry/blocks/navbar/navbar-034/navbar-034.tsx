"use client"

import { useEffect, useState, type CSSProperties } from "react"

export type Navbar034Link = {
  label: string
  href: string
}

export type Navbar034Props = {
  brand?: string
  brandHref?: string
  /** Живой статус бокса: «сейчас свободен подъёмник №2». */
  status?: string
  links?: readonly Navbar034Link[]
  phone?: string
  phoneHref?: string
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

// Шапка автосервиса: лого-шеврон с номером бокса, зелёная пульсирующая
// точка со статусом «сейчас свободен подъёмник №2», разделы, телефон и
// кислотная кнопка «Записаться». При прокрутке шапка становится стеклом с
// тонкой линией-«лампой» по низу. На узком статус уходит в бургер-меню.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-034"]){
--vibeui-navbar-034-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-034-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-034-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-034-on-accent:oklch(from var(--vibeui-navbar-034-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-034-muted:color-mix(in oklab,var(--vibeui-navbar-034-fg) 60%,var(--vibeui-navbar-034-bg));
--vibeui-navbar-034-line:color-mix(in oklab,var(--vibeui-navbar-034-fg) 12%,transparent);
--vibeui-navbar-034-live:#3ddc84;
--vibeui-navbar-034-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-034-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-034-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-034"]{color-scheme:dark}
:where([data-vibeui-block="navbar-034"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-034"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-034"]{box-sizing:border-box;position:relative;z-index:50;font-family:var(--vibeui-navbar-034-font);color:var(--vibeui-navbar-034-fg);font-size:.92rem;line-height:1.4;transition:background .3s}
[data-vibeui-block="navbar-034"][data-sticky="true"]{position:sticky;top:0}
[data-vibeui-block="navbar-034"]::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:linear-gradient(90deg,transparent,var(--vibeui-navbar-034-accent) 30%,var(--vibeui-navbar-034-accent) 70%,transparent);opacity:0;transition:opacity .4s}
[data-vibeui-block="navbar-034"][data-scrolled="true"]{background:color-mix(in oklab,var(--vibeui-navbar-034-bg) 80%,transparent);backdrop-filter:blur(18px)}
[data-vibeui-block="navbar-034"][data-scrolled="true"]::after{opacity:.7}
[data-vibeui-block="navbar-034"] *{box-sizing:border-box}
[data-vibeui-block="navbar-034"] [data-part="row"]{display:flex;align-items:center;gap:.8rem;height:4.25rem;max-width:84rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="navbar-034"] [data-part="brand"]{display:inline-flex;align-items:center;gap:.6rem;font-family:var(--vibeui-navbar-034-display);font-weight:900;font-size:1.05rem;letter-spacing:-.01em;text-transform:uppercase;text-decoration:none;color:inherit;white-space:nowrap}
[data-vibeui-block="navbar-034"] [data-part="mark"]{width:2rem;height:2rem;color:var(--vibeui-navbar-034-accent)}
[data-vibeui-block="navbar-034"] [data-part="status"]{display:none;align-items:center;gap:.5rem;margin-left:.4rem;padding:.35rem .8rem .35rem .6rem;border-radius:999px;border:1px solid var(--vibeui-navbar-034-line);font-family:var(--vibeui-navbar-034-mono);font-size:.7rem;letter-spacing:.02em;color:var(--vibeui-navbar-034-muted);white-space:nowrap}
[data-vibeui-block="navbar-034"] [data-part="dot"]{position:relative;width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-navbar-034-live);flex-shrink:0}
[data-vibeui-block="navbar-034"] [data-part="dot"]::after{content:"";position:absolute;inset:-.25rem;border-radius:50%;border:1px solid var(--vibeui-navbar-034-live);animation:vibeui-navbar-034-pulse 1.8s ease-out infinite}
[data-vibeui-block="navbar-034"] [data-part="nav"]{display:none;gap:1.4rem;margin-left:auto}
[data-vibeui-block="navbar-034"] [data-part="nav"] a{position:relative;color:var(--vibeui-navbar-034-muted);text-decoration:none;font-weight:500;transition:color .2s}
[data-vibeui-block="navbar-034"] [data-part="nav"] a::after{content:"";position:absolute;left:0;right:0;bottom:-.3rem;height:2px;background:var(--vibeui-navbar-034-accent);transform:scaleX(0);transform-origin:left;transition:transform .25s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="navbar-034"] [data-part="nav"] a:hover{color:var(--vibeui-navbar-034-fg)}
[data-vibeui-block="navbar-034"] [data-part="nav"] a:hover::after{transform:scaleX(1)}
[data-vibeui-block="navbar-034"] [data-part="right"]{margin-left:auto;display:flex;align-items:center;gap:.9rem}
[data-vibeui-block="navbar-034"] [data-part="phone"]{display:none;font-family:var(--vibeui-navbar-034-mono);font-size:.85rem;color:var(--vibeui-navbar-034-fg);text-decoration:none;white-space:nowrap;transition:color .2s}
[data-vibeui-block="navbar-034"] [data-part="phone"]:hover{color:var(--vibeui-navbar-034-accent)}
[data-vibeui-block="navbar-034"] [data-part="action"]{position:relative;display:inline-flex;align-items:center;padding:.65rem 1.15rem;border-radius:.6rem;background:var(--vibeui-navbar-034-accent);color:var(--vibeui-navbar-034-on-accent);text-decoration:none;font-weight:700;font-size:.85rem;letter-spacing:.01em;white-space:nowrap;transition:transform .18s,box-shadow .2s}
[data-vibeui-block="navbar-034"] [data-part="action"]:hover{transform:translateY(-1px);box-shadow:0 10px 28px -8px var(--vibeui-navbar-034-accent)}
[data-vibeui-block="navbar-034"] a:focus-visible{outline:2px solid var(--vibeui-navbar-034-accent);outline-offset:2px}
@keyframes vibeui-navbar-034-pulse{0%{transform:scale(.6);opacity:1}100%{transform:scale(1.9);opacity:0}}
@container (min-width: 40rem){[data-vibeui-block="navbar-034"] [data-part="status"]{display:inline-flex}}
@container (min-width: 52rem){[data-vibeui-block="navbar-034"] [data-part="phone"]{display:inline}}
@container (min-width: 64rem){[data-vibeui-block="navbar-034"] [data-part="nav"]{display:flex}[data-vibeui-block="navbar-034"] [data-part="right"]{margin-left:1.4rem}}
[data-vibeui-block="navbar-034"] [data-part="burger"]{display:inline-flex;flex-direction:column;justify-content:center;gap:5px;flex-shrink:0;width:2.6rem;height:2.6rem;padding:0;border:1px solid var(--vibeui-navbar-034-line);border-radius:.6rem;background:transparent;color:inherit;cursor:pointer}
[data-vibeui-block="navbar-034"] [data-part="burger"] i{display:block;width:1.05rem;height:2px;margin:0 auto;background:currentColor;border-radius:2px;transition:transform .25s,opacity .2s}
[data-vibeui-block="navbar-034"] [data-part="burger"][aria-expanded="true"] i:nth-child(1){transform:translateY(7px) rotate(45deg)}
[data-vibeui-block="navbar-034"] [data-part="burger"][aria-expanded="true"] i:nth-child(2){opacity:0}
[data-vibeui-block="navbar-034"] [data-part="burger"][aria-expanded="true"] i:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
[data-vibeui-block="navbar-034"] [data-part="burger"]:focus-visible{outline:2px solid var(--vibeui-navbar-034-accent);outline-offset:2px}
[data-vibeui-block="navbar-034"] [data-part="menu"]{display:grid;gap:.2rem;max-width:84rem;margin:0 auto;padding:.6rem 1.25rem 1.25rem;border-top:1px solid var(--vibeui-navbar-034-line);background:var(--vibeui-navbar-034-bg);animation:vibeui-navbar-034-menu .22s ease-out}
[data-vibeui-block="navbar-034"] [data-part="menu"][hidden]{display:none}
[data-vibeui-block="navbar-034"] [data-part="menu"] a{padding:.8rem .7rem;border-radius:.6rem;color:var(--vibeui-navbar-034-fg);text-decoration:none;font-weight:600;font-size:1.05rem}
[data-vibeui-block="navbar-034"] [data-part="menu"] a:hover{background:color-mix(in oklab,var(--vibeui-navbar-034-fg) 6%,transparent)}
[data-vibeui-block="navbar-034"] [data-part="menu"] a[data-cta]{margin-top:.4rem;text-align:center;background:var(--vibeui-navbar-034-accent);color:var(--vibeui-navbar-034-on-accent)}
[data-vibeui-block="navbar-034"] [data-part="menu-status"]{display:flex;align-items:center;gap:.5rem;padding:.5rem .7rem .9rem;font-family:var(--vibeui-navbar-034-mono);font-size:.72rem;color:var(--vibeui-navbar-034-muted)}
@keyframes vibeui-navbar-034-menu{from{opacity:0;transform:translateY(-6px)}}
@container (min-width: 64rem){[data-vibeui-block="navbar-034"] [data-part="burger"],[data-vibeui-block="navbar-034"] [data-part="menu"]{display:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-034"] *{animation:none!important;transition:none!important}}`

/** Шапка автосервиса с живым статусом бокса и кислотной кнопкой записи. */
export function Navbar034({
  brand = "Гараж 42",
  brandHref = "#top",
  status = "сейчас свободен подъёмник №2",
  links = [
    { label: "Услуги", href: "#services" },
    { label: "До / после", href: "#results" },
    { label: "Мастера", href: "#team" },
    { label: "Отзывы", href: "#reviews" },
    { label: "Контакты", href: "#contacts" },
  ],
  phone = "+7 (812) 420-42-42",
  phoneHref = "tel:+78124204242",
  actionLabel = "Записаться",
  actionHref = "#booking",
  sticky = true,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Navbar034Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-navbar-034-accent": accent } : null),
    ...(ink ? { "--vibeui-navbar-034-fg": ink } : null),
    ...(background ? { "--vibeui-navbar-034-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-034" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-034" data-tone={tone === "auto" ? undefined : tone} data-sticky={sticky} data-scrolled={scrolled} className={className} style={palette}>
        <div data-part="row">
          <a data-part="brand" href={brandHref}>
            <svg data-part="mark" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 22 16 6l12 16" />
              <path d="M9 26h14" />
            </svg>
            {brand}
          </a>
          {status ? (
            <span data-part="status" role="status">
              <i data-part="dot" aria-hidden="true" />
              {status}
            </span>
          ) : null}
          <nav data-part="nav" aria-label="Разделы">
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div data-part="right">
            {phone ? (
              <a data-part="phone" href={phoneHref}>
                {phone}
              </a>
            ) : null}
            {actionLabel ? (
              <a data-part="action" href={actionHref}>
                {actionLabel}
              </a>
            ) : null}
          </div>
          <button data-part="burger" type="button" aria-expanded={menuOpen} aria-controls="vibeui-navbar-034-menu" aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"} onClick={() => setMenuOpen((value) => !value)}>
            <i aria-hidden="true" />
            <i aria-hidden="true" />
            <i aria-hidden="true" />
          </button>
        </div>
        <nav data-part="menu" id="vibeui-navbar-034-menu" hidden={!menuOpen} aria-label="Меню" onClick={() => setMenuOpen(false)}>
          {status ? (
            <span data-part="menu-status">
              <i data-part="dot" aria-hidden="true" />
              {status}
            </span>
          ) : null}
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          {phone ? <a href={phoneHref}>{phone}</a> : null}
          {actionLabel ? <a data-cta="" href={actionHref}>{actionLabel}</a> : null}
        </nav>
      </header>
    </>
  )
}

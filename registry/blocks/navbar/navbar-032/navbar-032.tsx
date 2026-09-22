"use client"

import { useEffect, useState, type CSSProperties, type PointerEvent } from "react"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Navbar032Link = {
  label: string
  href: string
}

export type Navbar032Props = {
  brand?: string
  brandHref?: string
  links?: readonly Navbar032Link[]
  rating?: string
  ratingNote?: string
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

// Шапка сайта приложения: лого с мягкой точкой-«дыханием» — сама по себе
// медленно пульсирует, а если на странице есть hero-032, дышит в его ритме
// (слушает событие `vibeui-hero-032:phase`). Разделы с подчёркиванием-въездом,
// чип рейтинга «4,9 ★ · App Store» и магнитная кнопка «Скачать». Липкая,
// при прокрутке — стекло и тонкая линия.
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-032"]){
--vibeui-navbar-032-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-032-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-032-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-032-on-accent:oklch(from var(--vibeui-navbar-032-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-032-muted:color-mix(in oklab,var(--vibeui-navbar-032-fg) 60%,var(--vibeui-navbar-032-bg));
--vibeui-navbar-032-line:color-mix(in oklab,var(--vibeui-navbar-032-fg) 12%,transparent);
--vibeui-navbar-032-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-032"]{color-scheme:dark}
:where([data-vibeui-block="navbar-032"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-032"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-032"]{box-sizing:border-box;position:relative;z-index:50;font-family:var(--vibeui-navbar-032-font);color:var(--vibeui-navbar-032-fg);font-size:.92rem;line-height:1.4;border-bottom:1px solid transparent;transition:border-color .3s,background .3s}
[data-vibeui-block="navbar-032"][data-sticky="true"]{position:sticky;top:0}
[data-vibeui-block="navbar-032"][data-scrolled="true"]{border-color:var(--vibeui-navbar-032-line);background:color-mix(in oklab,var(--vibeui-navbar-032-bg) 82%,transparent);backdrop-filter:blur(14px)}
[data-vibeui-block="navbar-032"] *{box-sizing:border-box}
[data-vibeui-block="navbar-032"] [data-part="row"]{display:flex;align-items:center;gap:.8rem;height:4rem;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="navbar-032"] [data-part="brand"]{display:inline-flex;align-items:center;gap:.55rem;font-weight:800;font-size:1.15rem;letter-spacing:-.02em;text-decoration:none;color:inherit}
[data-vibeui-block="navbar-032"] [data-part="brand"] i{width:.9rem;height:.9rem;border-radius:50%;background:var(--vibeui-navbar-032-accent);box-shadow:0 0 12px color-mix(in oklab,var(--vibeui-navbar-032-accent) 60%,transparent);animation:vibeui-navbar-032-breath 4s ease-in-out infinite}
[data-vibeui-block="navbar-032"][data-breath] [data-part="brand"] i{animation:none;transition:transform var(--vibeui-navbar-032-d,1s) cubic-bezier(.4,0,.2,1)}
[data-vibeui-block="navbar-032"][data-breath="0"] [data-part="brand"] i,[data-vibeui-block="navbar-032"][data-breath="1"] [data-part="brand"] i{transform:scale(1.2)}
[data-vibeui-block="navbar-032"][data-breath="2"] [data-part="brand"] i{transform:scale(.75)}
[data-vibeui-block="navbar-032"] [data-part="nav"]{display:none;gap:1.2rem;margin-left:1rem}
[data-vibeui-block="navbar-032"] [data-part="nav"] a{position:relative;color:var(--vibeui-navbar-032-muted);text-decoration:none;font-weight:600;transition:color .2s}
[data-vibeui-block="navbar-032"] [data-part="nav"] a::after{content:"";position:absolute;left:0;right:0;bottom:-.3rem;height:2px;border-radius:2px;background:var(--vibeui-navbar-032-accent);transform:scaleX(0);transform-origin:right;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="navbar-032"] [data-part="nav"] a:hover{color:var(--vibeui-navbar-032-fg)}
[data-vibeui-block="navbar-032"] [data-part="nav"] a:hover::after{transform:none;transform-origin:left}
[data-vibeui-block="navbar-032"] [data-part="right"]{margin-left:auto;display:flex;align-items:center;gap:.6rem}
[data-vibeui-block="navbar-032"] [data-part="rating"]{display:none;align-items:center;gap:.35rem;font-size:.8rem;color:var(--vibeui-navbar-032-muted)}
[data-vibeui-block="navbar-032"] [data-part="rating"] b{color:var(--vibeui-navbar-032-fg)}
[data-vibeui-block="navbar-032"] [data-part="rating"] i{color:var(--vibeui-navbar-032-accent);font-style:normal}
@keyframes vibeui-navbar-032-breath{0%,100%{transform:scale(.8);opacity:.8}50%{transform:scale(1.15);opacity:1}}
@container (min-width: 40rem){[data-vibeui-block="navbar-032"] [data-part="rating"]{display:inline-flex}}
@container (min-width: 56rem){[data-vibeui-block="navbar-032"] [data-part="nav"]{display:flex}}
[data-vibeui-block="navbar-032"] [data-part="burger"]{display:inline-flex;flex-direction:column;justify-content:center;gap:5px;flex-shrink:0;width:2.5rem;height:2.5rem;padding:0;border:1px solid var(--vibeui-navbar-032-line);border-radius:999px;background:transparent;color:inherit;cursor:pointer}
[data-vibeui-block="navbar-032"] [data-part="burger"] i{display:block;width:1rem;height:2px;margin:0 auto;background:currentColor;border-radius:2px;transition:transform .25s,opacity .2s}
[data-vibeui-block="navbar-032"] [data-part="burger"][aria-expanded="true"] i:nth-child(1){transform:translateY(7px) rotate(45deg)}
[data-vibeui-block="navbar-032"] [data-part="burger"][aria-expanded="true"] i:nth-child(2){opacity:0}
[data-vibeui-block="navbar-032"] [data-part="burger"][aria-expanded="true"] i:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
[data-vibeui-block="navbar-032"] [data-part="burger"]:focus-visible{outline:2px solid var(--vibeui-navbar-032-accent);outline-offset:2px}
[data-vibeui-block="navbar-032"] [data-part="menu"]{display:grid;gap:.2rem;max-width:80rem;margin:0 auto;padding:.6rem 1.25rem 1.25rem;border-top:1px solid var(--vibeui-navbar-032-line);background:var(--vibeui-navbar-032-bg);animation:vibeui-navbar-032-menu .22s ease-out}
[data-vibeui-block="navbar-032"] [data-part="menu"][hidden]{display:none}
[data-vibeui-block="navbar-032"] [data-part="menu"] a{padding:.8rem .7rem;border-radius:.7rem;color:var(--vibeui-navbar-032-fg);text-decoration:none;font-weight:600;font-size:1.05rem}
[data-vibeui-block="navbar-032"] [data-part="menu"] a:hover{background:color-mix(in oklab,var(--vibeui-navbar-032-fg) 6%,transparent)}
[data-vibeui-block="navbar-032"] [data-part="menu"] a[data-cta]{margin-top:.4rem;text-align:center;background:var(--vibeui-navbar-032-accent);color:var(--vibeui-navbar-032-on-accent)}
@keyframes vibeui-navbar-032-menu{from{opacity:0;transform:translateY(-6px)}}
@container (min-width: 56rem){[data-vibeui-block="navbar-032"] [data-part="burger"],[data-vibeui-block="navbar-032"] [data-part="menu"]{display:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-032"] *{animation:none!important;transition:none!important}}`

/** Шапка сайта приложения с «дышащим» лого и чипом рейтинга. */
export function Navbar032({
  brand = "Тише",
  brandHref = "#top",
  links = [
    { label: "Что внутри", href: "#features" },
    { label: "Результат", href: "#results" },
    { label: "Отзывы", href: "#reviews" },
    { label: "Тарифы", href: "#pricing" },
  ],
  rating = "4,9",
  ratingNote = "App Store",
  actionLabel = "Скачать",
  actionHref = "#download",
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
}: Navbar032Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const [breath, setBreath] = useState<{ phase: number; duration: number } | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const onPhase = (event: Event) => {
      const detail = (event as CustomEvent<{ phase: number; duration: number }>).detail
      if (detail && typeof detail.phase === "number") setBreath({ phase: detail.phase, duration: Math.max(0.4, detail.duration) })
    }
    window.addEventListener("vibeui-hero-032:phase", onPhase)
    return () => window.removeEventListener("vibeui-hero-032:phase", onPhase)
  }, [])

  const magnet = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse") return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    event.currentTarget.style.setProperty("--vibeui-navbar-032-mx", `${(x * 8).toFixed(1)}px`)
    event.currentTarget.style.setProperty("--vibeui-navbar-032-my", `${(y * 6 - 1).toFixed(1)}px`)
  }
  const unmagnet = (event: PointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.removeProperty("--vibeui-navbar-032-mx")
    event.currentTarget.style.removeProperty("--vibeui-navbar-032-my")
  }

  const palette = {
    ...(breath ? { "--vibeui-navbar-032-d": `${breath.duration}s` } : null),
    ...(accent ? { "--vibeui-navbar-032-accent": accent } : null),
    ...(ink ? { "--vibeui-navbar-032-fg": ink } : null),
    ...(background ? { "--vibeui-navbar-032-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-032" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-032" data-tone={tone === "auto" ? undefined : tone} data-sticky={sticky} data-scrolled={scrolled} data-breath={breath ? breath.phase : undefined} className={className} style={palette}>
        <div data-part="row">
          <a data-part="brand" href={brandHref}>
            <i aria-hidden="true" />
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
            {rating ? (
              <span data-part="rating">
                <i aria-hidden="true">★</i>
                <b>{rating}</b>
                {ratingNote ? <span>· {ratingNote}</span> : null}
              </span>
            ) : null}
            {actionLabel ? (
              <Button016
                data-part="action"
                onPointerMove={magnet}
                onPointerLeave={unmagnet}
                label={actionLabel}
                href={actionHref}
                external={false}
                size="sm"
                tone="accent"
                accent={accent}
              />
            ) : null}
          </div>
          <button data-part="burger" type="button" aria-expanded={menuOpen} aria-controls="vibeui-navbar-032-menu" aria-label={menuOpen ? menuCloseLabel : menuOpenLabel} onClick={() => setMenuOpen((value) => !value)}>
            <i aria-hidden="true" />
            <i aria-hidden="true" />
            <i aria-hidden="true" />
          </button>
        </div>
        <nav data-part="menu" id="vibeui-navbar-032-menu" hidden={!menuOpen} aria-label={menuLabel} onClick={() => setMenuOpen(false)}>
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          {actionLabel ? <a data-cta="" href={actionHref}>{actionLabel}</a> : null}
        </nav>
      </header>
    </>
  )
}

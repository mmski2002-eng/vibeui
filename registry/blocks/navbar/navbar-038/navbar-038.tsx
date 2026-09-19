"use client"

import { useEffect, useState, type CSSProperties } from "react"

export type Navbar038Link = {
  label: string
  href: string
}

export type Navbar038Props = {
  brand?: string
  brandHref?: string
  /** Адрес доставки в чипе; меняется событием vibeui-cart:zone. */
  address?: string
  /** Минут до двери по умолчанию. */
  minutes?: number
  links?: readonly Navbar038Link[]
  cartLabel?: string
  cartHref?: string
  sticky?: boolean
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Шапка доставки еды: лого с язычком пламени, чип «адрес · N мин» (адрес
// и время подхватываются из события vibeui-cart:zone, которое шлёт карта
// зон), разделы и кнопка корзины с бейджем — счётчик приходит из
// vibeui-cart:state и подпрыгивает при каждом изменении. На узком —
// бургер, меню выезжает сверху. При прокрутке шапка уплотняется и
// подчёркивается томатной линией.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@700;900&family=Onest:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-038"]){
--vibeui-navbar-038-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-038-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-038-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-038-on-accent:oklch(from var(--vibeui-navbar-038-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-038-muted:color-mix(in oklab,var(--vibeui-navbar-038-fg) 62%,var(--vibeui-navbar-038-bg));
--vibeui-navbar-038-line:color-mix(in oklab,var(--vibeui-navbar-038-fg) 14%,transparent);
--vibeui-navbar-038-chip:color-mix(in oklab,var(--vibeui-navbar-038-fg) 8%,transparent);
--vibeui-navbar-038-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-038-font:"Onest",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-038"]{color-scheme:dark}
:where([data-vibeui-block="navbar-038"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-038"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-038"]{box-sizing:border-box;position:relative;z-index:50;background:var(--vibeui-navbar-038-bg);color:var(--vibeui-navbar-038-fg);font-family:var(--vibeui-navbar-038-font);font-size:.92rem;line-height:1.4}
[data-vibeui-block="navbar-038"][data-sticky="true"]{position:sticky;top:0}
[data-vibeui-block="navbar-038"]::after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;background:var(--vibeui-navbar-038-accent);transform:scaleX(0);transform-origin:left;transition:transform .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="navbar-038"][data-scrolled="true"]::after{transform:scaleX(1)}
[data-vibeui-block="navbar-038"] *{box-sizing:border-box}
[data-vibeui-block="navbar-038"] [data-part="row"]{display:flex;align-items:center;gap:.7rem;height:4.25rem;max-width:80rem;margin:0 auto;padding:0 1.25rem;transition:height .3s}
[data-vibeui-block="navbar-038"][data-scrolled="true"] [data-part="row"]{height:3.6rem}
[data-vibeui-block="navbar-038"] [data-part="brand"]{display:inline-flex;align-items:center;gap:.45rem;font-family:var(--vibeui-navbar-038-display);font-weight:900;font-size:1.15rem;letter-spacing:-.02em;text-transform:uppercase;text-decoration:none;color:inherit;white-space:nowrap}
[data-vibeui-block="navbar-038"] [data-part="flame"]{width:1.3rem;height:1.3rem;color:var(--vibeui-navbar-038-accent);transform-origin:50% 100%;animation:vibeui-navbar-038-flame 1.6s ease-in-out infinite}
[data-vibeui-block="navbar-038"] [data-part="where"]{display:none;align-items:center;gap:.45rem;padding:.4rem .8rem .4rem .6rem;border-radius:999px;background:var(--vibeui-navbar-038-chip);border:1px solid var(--vibeui-navbar-038-line);color:var(--vibeui-navbar-038-fg);font-size:.82rem;font-weight:500;text-decoration:none;white-space:nowrap;max-width:16rem}
[data-vibeui-block="navbar-038"] [data-part="where"] svg{width:.95rem;height:.95rem;color:var(--vibeui-navbar-038-accent);flex-shrink:0}
[data-vibeui-block="navbar-038"] [data-part="where"] span{overflow:hidden;text-overflow:ellipsis}
[data-vibeui-block="navbar-038"] [data-part="where"] b{font-weight:700;color:var(--vibeui-navbar-038-accent);flex-shrink:0}
[data-vibeui-block="navbar-038"] [data-part="nav"]{display:none;gap:1.2rem;margin-left:auto}
[data-vibeui-block="navbar-038"] [data-part="nav"] a{position:relative;color:var(--vibeui-navbar-038-muted);text-decoration:none;font-weight:600;transition:color .2s}
[data-vibeui-block="navbar-038"] [data-part="nav"] a::after{content:"";position:absolute;left:0;right:0;bottom:-.3rem;height:2px;background:var(--vibeui-navbar-038-accent);transform:scaleX(0);transform-origin:left;transition:transform .25s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="navbar-038"] [data-part="nav"] a:hover{color:var(--vibeui-navbar-038-fg)}
[data-vibeui-block="navbar-038"] [data-part="nav"] a:hover::after{transform:scaleX(1)}
[data-vibeui-block="navbar-038"] [data-part="right"]{margin-left:auto;display:flex;align-items:center;gap:.6rem}
[data-vibeui-block="navbar-038"] [data-part="nav"] + [data-part="right"]{margin-left:0}
[data-vibeui-block="navbar-038"] [data-part="cart"]{position:relative;display:inline-flex;align-items:center;gap:.5rem;height:2.6rem;padding:0 1rem;border-radius:999px;background:var(--vibeui-navbar-038-accent);color:var(--vibeui-navbar-038-on-accent);text-decoration:none;font-weight:700;font-size:.88rem;white-space:nowrap;transition:transform .18s,box-shadow .2s}
[data-vibeui-block="navbar-038"] [data-part="cart"]:hover{transform:translateY(-1px);box-shadow:0 10px 26px -10px var(--vibeui-navbar-038-accent)}
[data-vibeui-block="navbar-038"] [data-part="cart"] svg{width:1.1rem;height:1.1rem}
[data-vibeui-block="navbar-038"] [data-part="cart"] span{display:none}
[data-vibeui-block="navbar-038"] [data-part="count"]{display:grid;place-items:center;min-width:1.35rem;height:1.35rem;padding:0 .3rem;border-radius:999px;background:var(--vibeui-navbar-038-bg);color:var(--vibeui-navbar-038-fg);font-size:.72rem;font-weight:800;font-variant-numeric:tabular-nums}
[data-vibeui-block="navbar-038"] [data-part="count"][data-bump="true"]{animation:vibeui-navbar-038-bump .4s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="navbar-038"] a:focus-visible,[data-vibeui-block="navbar-038"] button:focus-visible{outline:2px solid var(--vibeui-navbar-038-accent);outline-offset:2px}
[data-vibeui-block="navbar-038"] [data-part="burger"]{display:inline-flex;flex-direction:column;justify-content:center;gap:5px;flex-shrink:0;width:2.6rem;height:2.6rem;padding:0;border:1px solid var(--vibeui-navbar-038-line);border-radius:999px;background:transparent;color:inherit;cursor:pointer}
[data-vibeui-block="navbar-038"] [data-part="burger"] i{display:block;width:1rem;height:2px;margin:0 auto;background:currentColor;border-radius:2px;transition:transform .25s,opacity .2s}
[data-vibeui-block="navbar-038"] [data-part="burger"][aria-expanded="true"] i:nth-child(1){transform:translateY(7px) rotate(45deg)}
[data-vibeui-block="navbar-038"] [data-part="burger"][aria-expanded="true"] i:nth-child(2){opacity:0}
[data-vibeui-block="navbar-038"] [data-part="burger"][aria-expanded="true"] i:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
[data-vibeui-block="navbar-038"] [data-part="menu"]{display:grid;gap:.2rem;max-width:80rem;margin:0 auto;padding:.6rem 1.25rem 1.25rem;border-top:1px solid var(--vibeui-navbar-038-line);animation:vibeui-navbar-038-menu .22s ease-out}
[data-vibeui-block="navbar-038"] [data-part="menu"][hidden]{display:none}
[data-vibeui-block="navbar-038"] [data-part="menu"] a{padding:.8rem .7rem;border-radius:.7rem;color:var(--vibeui-navbar-038-fg);text-decoration:none;font-weight:600;font-size:1.05rem}
[data-vibeui-block="navbar-038"] [data-part="menu"] a:hover{background:var(--vibeui-navbar-038-chip)}
[data-vibeui-block="navbar-038"] [data-part="menu"] [data-part="where"]{display:inline-flex;max-width:none;margin-bottom:.4rem;font-size:.9rem;justify-self:start}
@keyframes vibeui-navbar-038-flame{0%,100%{transform:scaleY(1) rotate(-3deg)}50%{transform:scaleY(1.12) rotate(3deg)}}
@keyframes vibeui-navbar-038-bump{0%{transform:scale(1)}40%{transform:scale(1.45)}100%{transform:scale(1)}}
@keyframes vibeui-navbar-038-menu{from{opacity:0;transform:translateY(-6px)}}
@container (min-width: 40rem){[data-vibeui-block="navbar-038"] [data-part="row"] [data-part="where"]{display:inline-flex}[data-vibeui-block="navbar-038"] [data-part="cart"] span{display:inline}}
@container (min-width: 60rem){[data-vibeui-block="navbar-038"] [data-part="nav"]{display:flex}[data-vibeui-block="navbar-038"] [data-part="burger"],[data-vibeui-block="navbar-038"] [data-part="menu"]{display:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-038"] *{animation:none!important;transition:none!important}}`

/** Шапка доставки: адрес и время, корзина со счётчиком из события. */
export function Navbar038({
  brand = "Горячо",
  brandHref = "#top",
  address = "Тверская, 12",
  minutes = 28,
  links = [
    { label: "Меню", href: "#menu" },
    { label: "Конструктор", href: "#builder" },
    { label: "Зона доставки", href: "#zones" },
    { label: "Трекер", href: "#tracker" },
    { label: "Отзывы", href: "#reviews" },
  ],
  cartLabel = "Корзина",
  cartHref = "#menu",
  sticky = true,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Navbar038Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [count, setCount] = useState(0)
  const [bump, setBump] = useState(false)
  const [where, setWhere] = useState<{ address: string; minutes: number } | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    const onState = (event: Event) => {
      const detail = (event as CustomEvent<{ count?: number }>).detail
      if (typeof detail?.count !== "number") return
      setCount(detail.count)
      setBump(true)
    }
    const onZone = (event: Event) => {
      const detail = (event as CustomEvent<{ label?: string; minutes?: number }>).detail
      if (!detail?.label || typeof detail.minutes !== "number") return
      setWhere({ address: detail.label, minutes: detail.minutes })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("vibeui-cart:state", onState)
    window.addEventListener("vibeui-cart:zone", onZone)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("vibeui-cart:state", onState)
      window.removeEventListener("vibeui-cart:zone", onZone)
    }
  }, [])

  useEffect(() => {
    if (!bump) return
    const timer = window.setTimeout(() => setBump(false), 450)
    return () => window.clearTimeout(timer)
  }, [bump])

  const palette = {
    ...(accent ? { "--vibeui-navbar-038-accent": accent } : null),
    ...(ink ? { "--vibeui-navbar-038-fg": ink } : null),
    ...(background ? { "--vibeui-navbar-038-bg": background } : null),
    ...style,
  } as CSSProperties

  const shownAddress = where?.address ?? address
  const shownMinutes = where?.minutes ?? minutes

  const whereChip = (
    <a data-part="where" href="#zones" aria-label={`Доставка: ${shownAddress}, ${shownMinutes} минут`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
      <span>{shownAddress}</span>
      <b>· {shownMinutes} мин</b>
    </a>
  )

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-038" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-038" data-tone={tone === "auto" ? undefined : tone} data-sticky={sticky} data-scrolled={scrolled} className={className} style={palette}>
        <div data-part="row">
          <a data-part="brand" href={brandHref}>
            <svg data-part="flame" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2c1 4 5 5.5 5 11a5 5 0 0 1-10 0c0-2 .8-3.3 1.6-4.3.3 1.6 1.2 2.3 2.1 2.3.2-3.4-.6-6.5 1.3-9Z" />
            </svg>
            {brand}
          </a>
          {whereChip}
          <nav data-part="nav" aria-label="Разделы">
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div data-part="right">
            <a data-part="cart" href={cartHref}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 8H7" />
                <circle cx="9.5" cy="20" r="1.2" />
                <circle cx="17.5" cy="20" r="1.2" />
              </svg>
              <span>{cartLabel}</span>
              <output data-part="count" data-bump={bump} aria-label={`В корзине ${count}`}>
                {count}
              </output>
            </a>
            <button data-part="burger" type="button" aria-expanded={menuOpen} aria-controls="vibeui-navbar-038-menu" aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"} onClick={() => setMenuOpen((value) => !value)}>
              <i aria-hidden="true" />
              <i aria-hidden="true" />
              <i aria-hidden="true" />
            </button>
          </div>
        </div>
        <nav data-part="menu" id="vibeui-navbar-038-menu" hidden={!menuOpen} aria-label="Меню" onClick={() => setMenuOpen(false)}>
          {whereChip}
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </header>
    </>
  )
}

"use client"

import { useEffect, useState, type CSSProperties } from "react"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Navbar041Link = {
  label: string
  href: string
}

export type Navbar041Props = {
  brand?: string
  brandHref?: string
  links?: readonly Navbar041Link[]
  /** Плейсхолдер поля поиска. Пусто — поле не показывать. */
  searchPlaceholder?: string
  /** Тихая ссылка «Продавать». */
  sellLabel?: string
  sellHref?: string
  cartLabel?: string
  cartHref?: string
  /** Имя CustomEvent, из которого шапка берёт число товаров в наборе (detail.count). */
  cartEvent?: string
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

// Шапка маркетплейса дизайн-ассетов: марка из двух «слоёв», поле поиска-
// заглушка с моно-подсказкой ⌘K, разделы, тихая ссылка «Продавать» и
// корзина с бейджем. Бейдж слушает CustomEvent от конструктора набора
// (по умолчанию `vibeui-market:bundle`) и подпрыгивает при каждом
// изменении — шапка знает, сколько товаров в наборе, без общего стейта.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-041"]){
--vibeui-navbar-041-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-041-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-041-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-041-on-accent:oklch(from var(--vibeui-navbar-041-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-041-muted:color-mix(in oklab,var(--vibeui-navbar-041-fg) 58%,var(--vibeui-navbar-041-bg));
--vibeui-navbar-041-line:color-mix(in oklab,var(--vibeui-navbar-041-fg) 12%,transparent);
--vibeui-navbar-041-soft:color-mix(in oklab,var(--vibeui-navbar-041-fg) 5%,transparent);
--vibeui-navbar-041-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-041-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-041-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-041"]{color-scheme:dark}
:where([data-vibeui-block="navbar-041"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-041"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-041"]{box-sizing:border-box;position:relative;z-index:50;background:var(--vibeui-navbar-041-bg);color:var(--vibeui-navbar-041-fg);font-family:var(--vibeui-navbar-041-font);font-size:.9rem;line-height:1.4}
[data-vibeui-block="navbar-041"][data-sticky="true"]{position:sticky;top:0}
[data-vibeui-block="navbar-041"]::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--vibeui-navbar-041-line);opacity:0;transition:opacity .3s}
[data-vibeui-block="navbar-041"][data-scrolled="true"]::after{opacity:1}
[data-vibeui-block="navbar-041"][data-scrolled="true"]{background:color-mix(in oklab,var(--vibeui-navbar-041-bg) 86%,transparent);backdrop-filter:blur(14px)}
[data-vibeui-block="navbar-041"] *{box-sizing:border-box}
[data-vibeui-block="navbar-041"] [data-part="sell"]{display:none}
[data-vibeui-block="navbar-041"] [data-part="row"]{display:flex;align-items:center;gap:.6rem;height:4rem;max-width:86rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="navbar-041"] [data-part="brand"]{display:inline-flex;align-items:center;gap:.55rem;font-family:var(--vibeui-navbar-041-display);font-weight:800;font-size:1.25rem;letter-spacing:-.04em;text-decoration:none;color:inherit;flex-shrink:0}
[data-vibeui-block="navbar-041"] [data-part="mark"]{width:1.25rem;height:1.25rem;color:var(--vibeui-navbar-041-accent)}
[data-vibeui-block="navbar-041"] [data-part="mark"] rect:last-child{transition:transform .35s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="navbar-041"] [data-part="brand"]:hover [data-part="mark"] rect:last-child{transform:translate(-3px,-3px)}
[data-vibeui-block="navbar-041"] [data-part="search"]{display:none;flex:1 1 auto;max-width:22rem;align-items:center;gap:.6rem;height:2.5rem;margin-left:.6rem;padding:0 .5rem 0 .9rem;border-radius:999px;border:1px solid var(--vibeui-navbar-041-line);background:var(--vibeui-navbar-041-soft);color:var(--vibeui-navbar-041-muted);cursor:text;transition:border-color .2s,background .2s}
[data-vibeui-block="navbar-041"] [data-part="search"]:focus-within{border-color:var(--vibeui-navbar-041-accent);background:var(--vibeui-navbar-041-bg);color:var(--vibeui-navbar-041-fg)}
[data-vibeui-block="navbar-041"] [data-part="search"] svg{width:1rem;height:1rem;flex-shrink:0}
[data-vibeui-block="navbar-041"] [data-part="search"] input{flex:1 1 auto;min-width:0;border:0;background:transparent;font:inherit;color:inherit;outline:none}
[data-vibeui-block="navbar-041"] [data-part="search"] input::placeholder{color:var(--vibeui-navbar-041-muted)}
[data-vibeui-block="navbar-041"] [data-part="kbd"]{font-family:var(--vibeui-navbar-041-mono);font-size:.66rem;padding:.2rem .4rem;border-radius:.4rem;border:1px solid var(--vibeui-navbar-041-line);color:var(--vibeui-navbar-041-muted);white-space:nowrap}
[data-vibeui-block="navbar-041"] [data-part="nav"]{display:none;gap:1.25rem;margin-left:auto}
[data-vibeui-block="navbar-041"] [data-part="nav"] a{position:relative;color:var(--vibeui-navbar-041-muted);text-decoration:none;font-weight:500;transition:color .2s}
[data-vibeui-block="navbar-041"] [data-part="nav"] a::after{content:"";position:absolute;left:0;right:0;bottom:-.3rem;height:2px;background:var(--vibeui-navbar-041-accent);transform:scaleX(0);transform-origin:left;transition:transform .25s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="navbar-041"] [data-part="nav"] a:hover{color:var(--vibeui-navbar-041-fg)}
[data-vibeui-block="navbar-041"] [data-part="nav"] a:hover::after{transform:scaleX(1)}
[data-vibeui-block="navbar-041"] [data-part="right"]{margin-left:auto;display:flex;align-items:center;gap:.5rem}
[data-vibeui-block="navbar-041"] [data-part="nav"] + [data-part="right"]{margin-left:1.25rem}
[data-vibeui-block="navbar-041"] [data-part="cart"]{position:relative;display:inline-flex;align-items:center;justify-content:center;width:2.5rem;height:2.5rem;border-radius:999px;background:var(--vibeui-navbar-041-accent);color:var(--vibeui-navbar-041-on-accent);text-decoration:none;flex-shrink:0;transition:transform .18s}
[data-vibeui-block="navbar-041"] [data-part="cart"]:hover{transform:translateY(-1px)}
[data-vibeui-block="navbar-041"] [data-part="cart"] svg{width:1.1rem;height:1.1rem}
[data-vibeui-block="navbar-041"] [data-part="badge"]{position:absolute;top:-.35rem;right:-.35rem;min-width:1.25rem;height:1.25rem;padding:0 .35rem;border-radius:999px;background:var(--vibeui-navbar-041-fg);color:var(--vibeui-navbar-041-bg);font-family:var(--vibeui-navbar-041-mono);font-size:.66rem;font-weight:500;line-height:1.25rem;text-align:center;border:2px solid var(--vibeui-navbar-041-bg);animation:vibeui-navbar-041-pop .45s cubic-bezier(.2,1.4,.4,1)}
@keyframes vibeui-navbar-041-pop{0%{transform:scale(.4)}60%{transform:scale(1.25)}100%{transform:scale(1)}}
[data-vibeui-block="navbar-041"] button:focus-visible{outline:2px solid var(--vibeui-navbar-041-accent);outline-offset:2px}
[data-vibeui-block="navbar-041"] [data-part="burger"]{display:inline-flex;flex-direction:column;justify-content:center;gap:5px;flex-shrink:0;width:2.5rem;height:2.5rem;padding:0;border:1px solid var(--vibeui-navbar-041-line);border-radius:999px;background:transparent;color:inherit;cursor:pointer}
[data-vibeui-block="navbar-041"] [data-part="burger"] i{display:block;width:1rem;height:2px;margin:0 auto;background:currentColor;border-radius:2px;transition:transform .25s,opacity .2s}
[data-vibeui-block="navbar-041"] [data-part="burger"][aria-expanded="true"] i:nth-child(1){transform:translateY(7px) rotate(45deg)}
[data-vibeui-block="navbar-041"] [data-part="burger"][aria-expanded="true"] i:nth-child(2){opacity:0}
[data-vibeui-block="navbar-041"] [data-part="burger"][aria-expanded="true"] i:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
[data-vibeui-block="navbar-041"] [data-part="menu"]{display:grid;gap:.2rem;max-width:86rem;margin:0 auto;padding:.6rem 1.25rem 1.25rem;border-top:1px solid var(--vibeui-navbar-041-line);background:var(--vibeui-navbar-041-bg);animation:vibeui-navbar-041-menu .22s ease-out}
[data-vibeui-block="navbar-041"] [data-part="menu"][hidden]{display:none}
[data-vibeui-block="navbar-041"] [data-part="menu"] a{padding:.8rem .7rem;border-radius:.7rem;color:var(--vibeui-navbar-041-fg);text-decoration:none;font-family:var(--vibeui-navbar-041-display);font-weight:700;font-size:1.3rem;letter-spacing:-.03em}
[data-vibeui-block="navbar-041"] [data-part="menu"] a:hover{background:var(--vibeui-navbar-041-soft)}
[data-vibeui-block="navbar-041"] [data-part="menu"] a[data-cta]{margin-top:.4rem;text-align:center;font-family:var(--vibeui-navbar-041-font);font-size:1rem;font-weight:600;border:1px solid var(--vibeui-navbar-041-line);border-radius:999px}
[data-vibeui-block="navbar-041"] [data-part="menu"] [data-part="search"]{display:flex;max-width:none;margin:0 0 .6rem}
@keyframes vibeui-navbar-041-menu{from{opacity:0;transform:translateY(-6px)}}
@container (min-width: 40rem){[data-vibeui-block="navbar-041"] [data-part="row"] [data-part="search"]{display:flex}}
@container (min-width: 60rem){[data-vibeui-block="navbar-041"] [data-part="nav"]{display:flex}[data-vibeui-block="navbar-041"] [data-part="burger"],[data-vibeui-block="navbar-041"] [data-part="menu"]{display:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-041"] *{animation:none!important;transition:none!important}}`

function SearchField({ placeholder }: { placeholder: string }) {
  return (
    <label data-part="search">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input type="search" placeholder={placeholder} aria-label={placeholder} />
      <span data-part="kbd" aria-hidden="true">
        ⌘K
      </span>
    </label>
  )
}

/** Шапка маркетплейса ассетов с поиском и корзиной, которая слушает событие набора. */
export function Navbar041({
  brand = "Слой",
  brandHref = "#top",
  links = [
    { label: "Каталог", href: "#catalog" },
    { label: "Наборы", href: "#bundle" },
    { label: "Лицензии", href: "#licenses" },
    { label: "Авторы", href: "#authors" },
  ],
  searchPlaceholder = "Шаблон, иконки, шрифт…",
  sellLabel = "Продавать",
  sellHref = "#for-authors",
  cartLabel = "Набор",
  cartHref = "#bundle",
  cartEvent = "vibeui-market:bundle",
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
}: Navbar041Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [count, setCount] = useState(0)
  const [pulse, setPulse] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!cartEvent) return
    const onBundle = (event: Event) => {
      const detail = (event as CustomEvent<{ count?: number }>).detail
      const next = Number(detail?.count ?? 0)
      setCount(next)
      setPulse((value) => value + 1)
    }
    window.addEventListener(cartEvent, onBundle)
    return () => window.removeEventListener(cartEvent, onBundle)
  }, [cartEvent])

  const palette = {
    ...(accent ? { "--vibeui-navbar-041-accent": accent } : null),
    ...(ink ? { "--vibeui-navbar-041-fg": ink } : null),
    ...(background ? { "--vibeui-navbar-041-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-041" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-041" data-tone={tone === "auto" ? undefined : tone} data-sticky={sticky} data-scrolled={scrolled} className={className} style={palette}>
        <div data-part="row">
          <a data-part="brand" href={brandHref}>
            <svg data-part="mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true">
              <rect x="7" y="7" width="14" height="14" rx="2" />
              <rect x="3" y="3" width="14" height="14" rx="2" fill="var(--vibeui-navbar-041-bg)" />
            </svg>
            {brand}
          </a>
          {searchPlaceholder ? <SearchField placeholder={searchPlaceholder} /> : null}
          <nav data-part="nav" aria-label={navLabel}>
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div data-part="right">
            {sellLabel ? (
              <Button016
                data-part="sell"
                label={sellLabel}
                href={sellHref}
                external={false}
                size="sm"
                tone="neutral"
                accent={accent}
              />
            ) : null}
            <a data-part="cart" href={cartHref} aria-label={count > 0 ? `${cartLabel}: ${count}` : cartLabel}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 7h16l-1.5 11a2 2 0 0 1-2 1.8h-9a2 2 0 0 1-2-1.8L4 7Z" />
                <path d="M9 10V6a3 3 0 0 1 6 0v4" />
              </svg>
              {count > 0 ? (
                <span key={pulse} data-part="badge" aria-hidden="true">
                  {count}
                </span>
              ) : null}
            </a>
            <button data-part="burger" type="button" aria-expanded={menuOpen} aria-controls="vibeui-navbar-041-menu" aria-label={menuOpen ? menuCloseLabel : menuOpenLabel} onClick={() => setMenuOpen((value) => !value)}>
              <i aria-hidden="true" />
              <i aria-hidden="true" />
              <i aria-hidden="true" />
            </button>
          </div>
        </div>
        <nav data-part="menu" id="vibeui-navbar-041-menu" hidden={!menuOpen} aria-label={menuLabel}>
          {searchPlaceholder ? <SearchField placeholder={searchPlaceholder} /> : null}
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
          {sellLabel ? (
            <a data-cta="" href={sellHref} onClick={() => setMenuOpen(false)}>
              {sellLabel}
            </a>
          ) : null}
        </nav>
      </header>
    </>
  )
}

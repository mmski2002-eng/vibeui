"use client"

import { useEffect, useState, type CSSProperties } from "react"

export type Navbar043Link = {
  label: string
  href: string
}

export type Navbar043Props = {
  brand?: string
  brandHref?: string
  /** Моно-подпись рядом со знаком: «v2 · 2026». Пусто — не показывать. */
  caption?: string
  links?: readonly Navbar043Link[]
  actionLabel?: string
  actionHref?: string
  /** Висит поверх страницы прозрачной полосой (для хиро на всю высоту). */
  fixed?: boolean
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Шапка продуктового лендинга гаджета: прозрачная полоса поверх хиро,
// которая при прокрутке становится стеклом с блюром и тонкой линией.
// Слева словесный знак с точкой-светом (медленно дышит), по центру разделы,
// справа кнопка «Предзаказ» и бургер на узком. Меню под шапкой — тем же
// стеклом.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-043"]){
--vibeui-navbar-043-bg:light-dark(#ffffff,#0a0a0a);
--vibeui-navbar-043-fg:light-dark(#111111,#f2ede4);
--vibeui-navbar-043-accent:light-dark(#111111,#f2ede4);
--vibeui-navbar-043-on-accent:oklch(from var(--vibeui-navbar-043-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-043-muted:color-mix(in oklab,var(--vibeui-navbar-043-fg) 62%,var(--vibeui-navbar-043-bg));
--vibeui-navbar-043-line:color-mix(in oklab,var(--vibeui-navbar-043-fg) 12%,transparent);
--vibeui-navbar-043-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-043-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-043-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-043"]{color-scheme:dark}
:where([data-vibeui-block="navbar-043"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-043"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-043"]{box-sizing:border-box;position:relative;z-index:50;font-family:var(--vibeui-navbar-043-font);color:var(--vibeui-navbar-043-fg);font-size:.92rem;line-height:1.4;background:transparent;transition:background .35s,backdrop-filter .35s}
[data-vibeui-block="navbar-043"][data-fixed="true"]{position:fixed;top:0;left:0;right:0}
[data-vibeui-block="navbar-043"]::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--vibeui-navbar-043-line);opacity:0;transition:opacity .35s}
[data-vibeui-block="navbar-043"][data-scrolled="true"],[data-vibeui-block="navbar-043"][data-open="true"]{background:color-mix(in oklab,var(--vibeui-navbar-043-bg) 72%,transparent);backdrop-filter:blur(18px) saturate(1.3)}
[data-vibeui-block="navbar-043"][data-scrolled="true"]::after{opacity:1}
[data-vibeui-block="navbar-043"] *{box-sizing:border-box}
[data-vibeui-block="navbar-043"] [data-part="row"]{display:flex;align-items:center;gap:1rem;height:4rem;max-width:84rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="navbar-043"] [data-part="brand"]{display:inline-flex;align-items:center;gap:.55rem;font-family:var(--vibeui-navbar-043-display);font-weight:900;font-size:1.05rem;letter-spacing:.04em;text-transform:uppercase;text-decoration:none;color:inherit}
[data-vibeui-block="navbar-043"] [data-part="dot"]{width:.6rem;height:.6rem;border-radius:50%;background:var(--vibeui-navbar-043-accent);box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-navbar-043-accent) 40%,transparent),0 0 14px var(--vibeui-navbar-043-accent);animation:vibeui-navbar-043-breathe 3.2s ease-in-out infinite}
[data-vibeui-block="navbar-043"] [data-part="caption"]{display:none;font-family:var(--vibeui-navbar-043-mono);font-size:.68rem;letter-spacing:.06em;color:var(--vibeui-navbar-043-muted);padding-left:.8rem;border-left:1px solid var(--vibeui-navbar-043-line)}
[data-vibeui-block="navbar-043"] [data-part="nav"]{display:none;gap:1.4rem;margin:0 auto}
[data-vibeui-block="navbar-043"] [data-part="nav"] a{color:var(--vibeui-navbar-043-muted);text-decoration:none;font-weight:500;transition:color .2s}
[data-vibeui-block="navbar-043"] [data-part="nav"] a:hover{color:var(--vibeui-navbar-043-fg)}
[data-vibeui-block="navbar-043"] [data-part="right"]{margin-left:auto;display:flex;align-items:center;gap:.7rem}
[data-vibeui-block="navbar-043"] [data-part="action"]{display:inline-flex;align-items:center;gap:.5rem;padding:.6rem 1.1rem;border-radius:999px;background:var(--vibeui-navbar-043-accent);color:var(--vibeui-navbar-043-on-accent);text-decoration:none;font-weight:600;font-size:.86rem;white-space:nowrap;transition:transform .18s,box-shadow .25s}
[data-vibeui-block="navbar-043"] [data-part="action"]:hover{transform:translateY(-1px);box-shadow:0 10px 28px -10px var(--vibeui-navbar-043-accent)}
[data-vibeui-block="navbar-043"] a:focus-visible{outline:2px solid var(--vibeui-navbar-043-accent);outline-offset:2px}
[data-vibeui-block="navbar-043"] [data-part="burger"]{display:inline-flex;flex-direction:column;justify-content:center;gap:5px;flex-shrink:0;width:2.5rem;height:2.5rem;padding:0;border:1px solid var(--vibeui-navbar-043-line);border-radius:999px;background:transparent;color:inherit;cursor:pointer}
[data-vibeui-block="navbar-043"] [data-part="burger"] i{display:block;width:1rem;height:2px;margin:0 auto;background:currentColor;border-radius:2px;transition:transform .25s,opacity .2s}
[data-vibeui-block="navbar-043"] [data-part="burger"][aria-expanded="true"] i:nth-child(1){transform:translateY(7px) rotate(45deg)}
[data-vibeui-block="navbar-043"] [data-part="burger"][aria-expanded="true"] i:nth-child(2){opacity:0}
[data-vibeui-block="navbar-043"] [data-part="burger"][aria-expanded="true"] i:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
[data-vibeui-block="navbar-043"] [data-part="burger"]:focus-visible{outline:2px solid var(--vibeui-navbar-043-accent);outline-offset:2px}
[data-vibeui-block="navbar-043"] [data-part="menu"]{display:grid;gap:.2rem;max-width:84rem;margin:0 auto;padding:.6rem 1.25rem 1.25rem;border-top:1px solid var(--vibeui-navbar-043-line);animation:vibeui-navbar-043-menu .22s ease-out}
[data-vibeui-block="navbar-043"] [data-part="menu"][hidden]{display:none}
[data-vibeui-block="navbar-043"] [data-part="menu"] a{padding:.8rem .7rem;border-radius:.7rem;color:var(--vibeui-navbar-043-fg);text-decoration:none;font-weight:600;font-size:1.05rem}
[data-vibeui-block="navbar-043"] [data-part="menu"] a:hover{background:color-mix(in oklab,var(--vibeui-navbar-043-fg) 6%,transparent)}
[data-vibeui-block="navbar-043"] [data-part="menu"] a[data-cta]{margin-top:.4rem;text-align:center;background:var(--vibeui-navbar-043-accent);color:var(--vibeui-navbar-043-on-accent)}
@keyframes vibeui-navbar-043-breathe{0%,100%{transform:scale(.9);opacity:.8}50%{transform:scale(1.15);opacity:1}}
@keyframes vibeui-navbar-043-menu{from{opacity:0;transform:translateY(-6px)}}
@container (min-width: 40rem){[data-vibeui-block="navbar-043"] [data-part="caption"]{display:inline}}
@container (min-width: 60rem){[data-vibeui-block="navbar-043"] [data-part="nav"]{display:flex}[data-vibeui-block="navbar-043"] [data-part="burger"],[data-vibeui-block="navbar-043"] [data-part="menu"]{display:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-043"] *{animation:none!important;transition:none!important}}`

/** Прозрачная шапка гаджета, стекло при прокрутке, кнопка предзаказа. */
export function Navbar043({
  brand = "Луч",
  brandHref = "#top",
  caption = "лампа-будильник · v2",
  links = [
    { label: "Рассвет", href: "#dawn" },
    { label: "Возможности", href: "#features" },
    { label: "Устройство", href: "#inside" },
    { label: "Характеристики", href: "#specs" },
    { label: "Вопросы", href: "#faq" },
  ],
  actionLabel = "Предзаказ",
  actionHref = "#preorder",
  fixed = true,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Navbar043Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-navbar-043-accent": accent } : null),
    ...(ink ? { "--vibeui-navbar-043-fg": ink } : null),
    ...(background ? { "--vibeui-navbar-043-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-043" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-043" data-tone={tone === "auto" ? undefined : tone} data-fixed={fixed} data-scrolled={scrolled} data-open={menuOpen} className={className} style={palette}>
        <div data-part="row">
          <a data-part="brand" href={brandHref}>
            <i data-part="dot" aria-hidden="true" />
            {brand}
          </a>
          {caption ? <span data-part="caption">{caption}</span> : null}
          <nav data-part="nav" aria-label="Разделы">
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div data-part="right">
            {actionLabel ? (
              <a data-part="action" href={actionHref}>
                {actionLabel}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            ) : null}
            <button data-part="burger" type="button" aria-expanded={menuOpen} aria-controls="vibeui-navbar-043-menu" aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"} onClick={() => setMenuOpen((value) => !value)}>
              <i aria-hidden="true" />
              <i aria-hidden="true" />
              <i aria-hidden="true" />
            </button>
          </div>
        </div>
        <nav data-part="menu" id="vibeui-navbar-043-menu" hidden={!menuOpen} aria-label="Меню" onClick={() => setMenuOpen(false)}>
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

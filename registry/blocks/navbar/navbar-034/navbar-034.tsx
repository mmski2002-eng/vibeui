"use client"

import { useEffect, useState, type CSSProperties } from "react"

export type Navbar034Link = {
  label: string
  href: string
}

export type Navbar034Props = {
  brand?: string
  /** Знак в круглой эмблеме; по умолчанию — число из названия («Гараж 42» → «42»). */
  emblem?: string
  brandHref?: string
  /** Живой статус бокса: «сейчас свободен подъёмник №2». */
  status?: string
  links?: readonly Navbar034Link[]
  phone?: string
  phoneHref?: string
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

// Шапка автосервиса в строгой премиальной подаче: круглая эмблема с номером
// бокса, как значок на капоте, и название в разрядку; разделы — заглавными
// с разрядкой через тонкие вертикальные разделители, черта под пунктом
// растёт из центра; статус бокса с живой точкой; кнопка записи — контурная
// капсула, по наведению заливается светлым. При прокрутке шапка становится
// стеклом с тонкой линией-«лампой» по низу. На узком разделы уходят в бургер.
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
[data-vibeui-block="navbar-034"] [data-part="brand"]{display:inline-flex;align-items:center;gap:.75rem;font-family:var(--vibeui-navbar-034-display);font-weight:500;font-size:.82rem;letter-spacing:.32em;text-transform:uppercase;text-decoration:none;color:inherit;white-space:nowrap}
[data-vibeui-block="navbar-034"] [data-part="mark"]{display:grid;place-items:center;flex:none;width:2.4rem;height:2.4rem;border-radius:50%;border:1px solid color-mix(in oklab,var(--vibeui-navbar-034-fg) 34%,transparent);box-shadow:inset 0 0 0 3px var(--vibeui-navbar-034-bg),inset 0 0 0 4px color-mix(in oklab,var(--vibeui-navbar-034-accent) 70%,transparent);font-weight:700;font-size:.8rem;letter-spacing:-.02em;color:var(--vibeui-navbar-034-fg);transition:box-shadow .3s}
[data-vibeui-block="navbar-034"] [data-part="brand"]:hover [data-part="mark"]{box-shadow:inset 0 0 0 3px var(--vibeui-navbar-034-bg),inset 0 0 0 4px var(--vibeui-navbar-034-accent),0 0 16px -4px var(--vibeui-navbar-034-accent)}
[data-vibeui-block="navbar-034"] [data-part="status"]{display:none;align-items:center;gap:.55rem;margin-left:.6rem;padding-left:1rem;border-left:1px solid var(--vibeui-navbar-034-line);font-family:var(--vibeui-navbar-034-mono);font-size:.64rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-navbar-034-muted);white-space:nowrap}
[data-vibeui-block="navbar-034"] [data-part="dot"]{position:relative;width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-navbar-034-live);flex-shrink:0}
[data-vibeui-block="navbar-034"] [data-part="dot"]::after{content:"";position:absolute;inset:-.25rem;border-radius:50%;border:1px solid var(--vibeui-navbar-034-live);animation:vibeui-navbar-034-pulse 1.8s ease-out infinite}
[data-vibeui-block="navbar-034"] [data-part="nav"]{display:none;align-items:center;margin-left:auto}
[data-vibeui-block="navbar-034"] [data-part="nav"] a{position:relative;padding:.4rem 1.05rem;font-family:var(--vibeui-navbar-034-display);font-weight:400;font-size:.62rem;letter-spacing:.26em;text-transform:uppercase;color:var(--vibeui-navbar-034-muted);text-decoration:none;transition:color .25s}
[data-vibeui-block="navbar-034"] [data-part="nav"] a + a::before{content:"";position:absolute;left:0;top:50%;width:1px;height:.8rem;margin-top:-.4rem;background:var(--vibeui-navbar-034-line)}
[data-vibeui-block="navbar-034"] [data-part="nav"] a::after{content:"";position:absolute;left:1.05rem;right:calc(1.05rem - .26em);bottom:0;height:1px;background:var(--vibeui-navbar-034-accent);transform:scaleX(0);transition:transform .35s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="navbar-034"] [data-part="nav"] a:hover{color:var(--vibeui-navbar-034-fg)}
[data-vibeui-block="navbar-034"] [data-part="nav"] a:hover::after{transform:scaleX(1)}
[data-vibeui-block="navbar-034"] [data-part="right"]{margin-left:auto;display:flex;align-items:center;gap:.9rem}
[data-vibeui-block="navbar-034"] [data-part="phone"]{display:none;font-family:var(--vibeui-navbar-034-display);font-weight:400;font-size:.72rem;letter-spacing:.08em;color:var(--vibeui-navbar-034-fg);text-decoration:none;white-space:nowrap;transition:color .2s}
[data-vibeui-block="navbar-034"] [data-part="action"]{display:inline-flex;align-items:center;height:2.4rem;padding:0 1.25rem;border-radius:999px;border:1px solid color-mix(in oklab,var(--vibeui-navbar-034-fg) 40%,transparent);font-family:var(--vibeui-navbar-034-display);font-weight:500;font-size:.62rem;letter-spacing:.24em;text-transform:uppercase;color:var(--vibeui-navbar-034-fg);text-decoration:none;white-space:nowrap;transition:background .3s,color .3s,border-color .3s}
[data-vibeui-block="navbar-034"] [data-part="action"]:hover{background:var(--vibeui-navbar-034-fg);border-color:var(--vibeui-navbar-034-fg);color:var(--vibeui-navbar-034-bg)}
[data-vibeui-block="navbar-034"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-navbar-034-accent);outline-offset:3px}
[data-vibeui-block="navbar-034"] [data-part="phone"]:hover{color:var(--vibeui-navbar-034-accent)}
@keyframes vibeui-navbar-034-pulse{0%{transform:scale(.6);opacity:1}100%{transform:scale(1.9);opacity:0}}
@container (min-width: 40rem){[data-vibeui-block="navbar-034"] [data-part="status"]{display:inline-flex}}
@container (min-width: 52rem){[data-vibeui-block="navbar-034"] [data-part="phone"]{display:inline}}
@container (min-width: 64rem){[data-vibeui-block="navbar-034"] [data-part="nav"]{display:flex}[data-vibeui-block="navbar-034"] [data-part="right"]{margin-left:1rem;gap:1.4rem}}
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
[data-vibeui-block="navbar-034"] [data-part="menu"] a[data-cta]{margin-top:.4rem;text-align:center;border:1px solid color-mix(in oklab,var(--vibeui-navbar-034-fg) 40%,transparent);font-family:var(--vibeui-navbar-034-display);font-size:.72rem;letter-spacing:.24em;text-transform:uppercase}
[data-vibeui-block="navbar-034"] [data-part="menu-status"]{display:flex;align-items:center;gap:.5rem;padding:.5rem .7rem .9rem;font-family:var(--vibeui-navbar-034-mono);font-size:.72rem;color:var(--vibeui-navbar-034-muted)}
@keyframes vibeui-navbar-034-menu{from{opacity:0;transform:translateY(-6px)}}
@container (min-width: 64rem){[data-vibeui-block="navbar-034"] [data-part="burger"],[data-vibeui-block="navbar-034"] [data-part="menu"]{display:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-034"] *{animation:none!important;transition:none!important}}`

/** Шапка автосервиса: эмблема с номером бокса, разделы в разрядку, живой статус и контурная кнопка записи. */
export function Navbar034({
  brand = "Гараж 42",
  emblem,
  brandHref = "#top",
  status = "Свободен бокс № 2",
  links = [
    { label: "Услуги", href: "#services" },
    { label: "Работы", href: "#results" },
    { label: "Мастера", href: "#team" },
    { label: "Отзывы", href: "#reviews" },
    { label: "Контакты", href: "#contacts" },
  ],
  phone = "+7 (812) 420-42-42",
  phoneHref = "tel:+78124204242",
  actionLabel = "Записаться",
  actionHref = "#booking",
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
}: Navbar034Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const mark = emblem ?? brand.match(/\d+/)?.[0] ?? brand.slice(0, 1)
  const name = emblem ? brand : brand.replace(/\s*\d+\s*/, " ").trim() || brand

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
            <span data-part="mark" aria-hidden="true">
              {mark}
            </span>
            <span aria-label={brand}>{name}</span>
          </a>
          {status ? (
            <span data-part="status" role="status">
              <i data-part="dot" aria-hidden="true" />
              {status}
            </span>
          ) : null}
          <nav data-part="nav" aria-label={navLabel}>
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
          <button data-part="burger" type="button" aria-expanded={menuOpen} aria-controls="vibeui-navbar-034-menu" aria-label={menuOpen ? menuCloseLabel : menuOpenLabel} onClick={() => setMenuOpen((value) => !value)}>
            <i aria-hidden="true" />
            <i aria-hidden="true" />
            <i aria-hidden="true" />
          </button>
        </div>
        <nav data-part="menu" id="vibeui-navbar-034-menu" hidden={!menuOpen} aria-label={menuLabel} onClick={() => setMenuOpen(false)}>
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

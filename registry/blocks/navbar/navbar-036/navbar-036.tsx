"use client"

import { useEffect, useState, type CSSProperties } from "react"

export type Navbar036Link = {
  label: string
  href: string
}

export type Navbar036Props = {
  brand?: string
  brandHref?: string
  links?: readonly Navbar036Link[]
  /** Рукописная пометка справа от разделов: «открыты до 22:00». */
  note?: string
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

// Шапка цветочной мастерской в духе ботанического журнала: антиква-логотип
// со стеблем, который прорисовывается при загрузке (stroke-dashoffset),
// разделы, рукописная пометка курсивом Caveat и кнопка «Заказать» с
// чернильной рамкой. При прокрутке шапка становится «бумагой» с тонкой
// линейкой снизу. На узком — бургер и выпадающее меню.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Golos+Text:wght@400;500;600&family=Caveat:wght@500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-036"]){
--vibeui-navbar-036-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-036-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-036-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-036-on-accent:oklch(from var(--vibeui-navbar-036-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-036-muted:color-mix(in oklab,var(--vibeui-navbar-036-fg) 62%,var(--vibeui-navbar-036-bg));
--vibeui-navbar-036-line:color-mix(in oklab,var(--vibeui-navbar-036-fg) 16%,transparent);
--vibeui-navbar-036-display:"Cormorant",Georgia,"Times New Roman",serif;
--vibeui-navbar-036-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-036-hand:"Caveat","Segoe Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-036"]{color-scheme:dark}
:where([data-vibeui-block="navbar-036"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-036"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-036"]{box-sizing:border-box;position:relative;z-index:50;font-family:var(--vibeui-navbar-036-font);color:var(--vibeui-navbar-036-fg);font-size:.92rem;line-height:1.4;transition:background .3s}
[data-vibeui-block="navbar-036"][data-sticky="true"]{position:sticky;top:0}
[data-vibeui-block="navbar-036"]::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--vibeui-navbar-036-line);opacity:0;transition:opacity .3s}
[data-vibeui-block="navbar-036"][data-scrolled="true"]{background:color-mix(in oklab,var(--vibeui-navbar-036-bg) 88%,transparent);backdrop-filter:blur(12px)}
[data-vibeui-block="navbar-036"][data-scrolled="true"]::after{opacity:1}
[data-vibeui-block="navbar-036"] *{box-sizing:border-box}
[data-vibeui-block="navbar-036"] [data-part="row"]{display:flex;align-items:center;gap:.8rem;height:4.25rem;max-width:84rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="navbar-036"] [data-part="brand"]{display:inline-flex;align-items:center;gap:.45rem;font-family:var(--vibeui-navbar-036-display);font-style:italic;font-weight:600;font-size:1.7rem;letter-spacing:-.01em;line-height:1;text-decoration:none;color:inherit}
[data-vibeui-block="navbar-036"] [data-part="stem"]{width:1.4rem;height:1.6rem;color:var(--vibeui-navbar-036-accent);overflow:visible}
[data-vibeui-block="navbar-036"] [data-part="stem"] path{stroke-dasharray:100;stroke-dashoffset:100;animation:vibeui-navbar-036-draw 1.4s cubic-bezier(.2,.7,.2,1) .2s forwards}
[data-vibeui-block="navbar-036"] [data-part="stem"] path:nth-child(2){animation-delay:.7s}
[data-vibeui-block="navbar-036"] [data-part="stem"] path:nth-child(3){animation-delay:.9s}
[data-vibeui-block="navbar-036"] [data-part="nav"]{display:none;gap:1.4rem;margin-left:1.6rem}
[data-vibeui-block="navbar-036"] [data-part="nav"] a{position:relative;color:var(--vibeui-navbar-036-muted);text-decoration:none;font-weight:500;transition:color .2s}
[data-vibeui-block="navbar-036"] [data-part="nav"] a::after{content:"";position:absolute;left:0;right:0;bottom:-.3rem;height:1px;background:var(--vibeui-navbar-036-accent);transform:scaleX(0);transform-origin:left;transition:transform .3s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="navbar-036"] [data-part="nav"] a:hover{color:var(--vibeui-navbar-036-fg)}
[data-vibeui-block="navbar-036"] [data-part="nav"] a:hover::after{transform:scaleX(1)}
[data-vibeui-block="navbar-036"] [data-part="right"]{margin-left:auto;display:flex;align-items:center;gap:1rem}
[data-vibeui-block="navbar-036"] [data-part="note"]{display:none;font-family:var(--vibeui-navbar-036-hand);font-size:1.25rem;line-height:1;color:var(--vibeui-navbar-036-accent);transform:rotate(-3deg);white-space:nowrap}
[data-vibeui-block="navbar-036"] [data-part="action"]{display:inline-flex;align-items:center;padding:.6rem 1.15rem;border-radius:999px;border:1px solid var(--vibeui-navbar-036-fg);color:var(--vibeui-navbar-036-fg);background:transparent;text-decoration:none;font-weight:500;font-size:.88rem;white-space:nowrap;transition:background .25s,color .25s,border-color .25s,transform .18s}
[data-vibeui-block="navbar-036"] [data-part="action"]:hover{background:var(--vibeui-navbar-036-accent);border-color:var(--vibeui-navbar-036-accent);color:var(--vibeui-navbar-036-on-accent);transform:translateY(-1px)}
[data-vibeui-block="navbar-036"] a:focus-visible{outline:2px solid var(--vibeui-navbar-036-accent);outline-offset:3px}
[data-vibeui-block="navbar-036"] [data-part="burger"]{display:inline-flex;flex-direction:column;justify-content:center;gap:5px;flex-shrink:0;width:2.5rem;height:2.5rem;padding:0;border:1px solid var(--vibeui-navbar-036-line);border-radius:999px;background:transparent;color:inherit;cursor:pointer}
[data-vibeui-block="navbar-036"] [data-part="burger"] i{display:block;width:1rem;height:1.5px;margin:0 auto;background:currentColor;transition:transform .25s,opacity .2s}
[data-vibeui-block="navbar-036"] [data-part="burger"][aria-expanded="true"] i:nth-child(1){transform:translateY(6.5px) rotate(45deg)}
[data-vibeui-block="navbar-036"] [data-part="burger"][aria-expanded="true"] i:nth-child(2){opacity:0}
[data-vibeui-block="navbar-036"] [data-part="burger"][aria-expanded="true"] i:nth-child(3){transform:translateY(-6.5px) rotate(-45deg)}
[data-vibeui-block="navbar-036"] [data-part="burger"]:focus-visible{outline:2px solid var(--vibeui-navbar-036-accent);outline-offset:2px}
[data-vibeui-block="navbar-036"] [data-part="menu"]{display:grid;gap:.1rem;max-width:84rem;margin:0 auto;padding:.6rem 1.25rem 1.4rem;border-top:1px solid var(--vibeui-navbar-036-line);background:var(--vibeui-navbar-036-bg);animation:vibeui-navbar-036-menu .25s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="navbar-036"] [data-part="menu"][hidden]{display:none}
[data-vibeui-block="navbar-036"] [data-part="menu"] a{padding:.8rem .2rem;border-bottom:1px solid var(--vibeui-navbar-036-line);color:var(--vibeui-navbar-036-fg);text-decoration:none;font-family:var(--vibeui-navbar-036-display);font-size:1.6rem;font-weight:500;line-height:1.1}
[data-vibeui-block="navbar-036"] [data-part="menu"] a:hover{color:var(--vibeui-navbar-036-accent)}
[data-vibeui-block="navbar-036"] [data-part="menu"] a[data-cta]{margin-top:1rem;border:1px solid var(--vibeui-navbar-036-fg);border-radius:999px;text-align:center;font-family:var(--vibeui-navbar-036-font);font-size:1rem;font-weight:500;padding:.8rem 1rem}
[data-vibeui-block="navbar-036"] [data-part="menu"] span{padding:.8rem .2rem 0;font-family:var(--vibeui-navbar-036-hand);font-size:1.3rem;color:var(--vibeui-navbar-036-accent)}
@keyframes vibeui-navbar-036-menu{from{opacity:0;transform:translateY(-6px)}}
@keyframes vibeui-navbar-036-draw{to{stroke-dashoffset:0}}
@container (min-width: 44rem){[data-vibeui-block="navbar-036"] [data-part="note"]{display:inline}}
@container (min-width: 60rem){[data-vibeui-block="navbar-036"] [data-part="nav"]{display:flex}[data-vibeui-block="navbar-036"] [data-part="burger"],[data-vibeui-block="navbar-036"] [data-part="menu"]{display:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-036"] *{animation:none!important;transition:none!important}[data-vibeui-block="navbar-036"] [data-part="stem"] path{stroke-dashoffset:0}}`

/** Шапка цветочной мастерской: антиква, стебель-логотип, рукописная пометка. */
export function Navbar036({
  brand = "Стебель",
  brandHref = "#top",
  links = [
    { label: "Букеты", href: "#catalog" },
    { label: "Собрать свой", href: "#builder" },
    { label: "Доставка", href: "#delivery" },
    { label: "Сезон", href: "#season" },
    { label: "Мастерская", href: "#about" },
  ],
  note = "открыты до 22:00",
  actionLabel = "Заказать букет",
  actionHref = "#builder",
  sticky = true,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Navbar036Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-navbar-036-accent": accent } : null),
    ...(ink ? { "--vibeui-navbar-036-fg": ink } : null),
    ...(background ? { "--vibeui-navbar-036-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-036" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-036" data-tone={tone === "auto" ? undefined : tone} data-sticky={sticky} data-scrolled={scrolled} className={className} style={palette}>
        <div data-part="row">
          <a data-part="brand" href={brandHref}>
            <svg data-part="stem" viewBox="0 0 24 28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path pathLength={100} d="M12 27C12 20 11 14 13 8" />
              <path pathLength={100} d="M12.5 17c-4 .5-6.5-1.5-7-5 4-.5 6.5 1.5 7 5Z" />
              <path pathLength={100} d="M13 9c-1.5-3 0-6.5 3-7.5 1.5 3 0 6.5-3 7.5Z" />
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
            {note ? <span data-part="note">{note}</span> : null}
            {actionLabel ? (
              <a data-part="action" href={actionHref}>
                {actionLabel}
              </a>
            ) : null}
          </div>
          <button data-part="burger" type="button" aria-expanded={menuOpen} aria-controls="vibeui-navbar-036-menu" aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"} onClick={() => setMenuOpen((value) => !value)}>
            <i aria-hidden="true" />
            <i aria-hidden="true" />
            <i aria-hidden="true" />
          </button>
        </div>
        <nav data-part="menu" id="vibeui-navbar-036-menu" hidden={!menuOpen} aria-label="Меню" onClick={() => setMenuOpen(false)}>
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          {note ? <span>{note}</span> : null}
          {actionLabel ? <a data-cta="" href={actionHref}>{actionLabel}</a> : null}
        </nav>
      </header>
    </>
  )
}

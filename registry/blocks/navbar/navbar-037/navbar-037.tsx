"use client"

import { useEffect, useState, type CSSProperties } from "react"

export type Navbar037Link = {
  label: string
  href: string
}

export type Navbar037Props = {
  brand?: string
  /** Подпись под брендом мелким моно: «ремонт квартир · с 2011». */
  caption?: string
  brandHref?: string
  links?: readonly Navbar037Link[]
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

// Шапка строительной бригады в духе чертёжного штампа: в лого — пузырёк
// уровня, который при загрузке съезжает в центр и «встаёт ровно», подпись
// моно под брендом, разделы, телефон моно и жёлтая кнопка «Рассчитать
// смету». По низу шапки — рулетка: полоска с делениями, заливка которой
// показывает, сколько страницы прочитано. При прокрутке фон становится
// плотным с миллиметровой сеткой. Бургер на узком.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-037"]){
--vibeui-navbar-037-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-037-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-037-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-037-on-accent:oklch(from var(--vibeui-navbar-037-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-037-muted:color-mix(in oklab,var(--vibeui-navbar-037-fg) 62%,var(--vibeui-navbar-037-bg));
--vibeui-navbar-037-line:color-mix(in oklab,var(--vibeui-navbar-037-fg) 14%,transparent);
--vibeui-navbar-037-grid:color-mix(in oklab,var(--vibeui-navbar-037-fg) 6%,transparent);
--vibeui-navbar-037-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-037-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-037-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-navbar-037-progress:0;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-037"]{color-scheme:dark}
:where([data-vibeui-block="navbar-037"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-037"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-037"]{box-sizing:border-box;position:relative;z-index:50;font-family:var(--vibeui-navbar-037-font);color:var(--vibeui-navbar-037-fg);background:var(--vibeui-navbar-037-bg);font-size:.92rem;line-height:1.4;transition:box-shadow .3s}
[data-vibeui-block="navbar-037"][data-sticky="true"]{position:sticky;top:0}
[data-vibeui-block="navbar-037"][data-scrolled="true"]{background:var(--vibeui-navbar-037-bg);background-image:linear-gradient(var(--vibeui-navbar-037-grid) 1px,transparent 1px),linear-gradient(90deg,var(--vibeui-navbar-037-grid) 1px,transparent 1px);background-size:1rem 1rem;box-shadow:0 1px 0 var(--vibeui-navbar-037-line)}
[data-vibeui-block="navbar-037"] *{box-sizing:border-box}
[data-vibeui-block="navbar-037"] [data-part="row"]{display:flex;align-items:center;gap:.8rem;height:4.25rem;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="navbar-037"] [data-part="brand"]{display:inline-flex;align-items:center;gap:.65rem;text-decoration:none;color:inherit}
[data-vibeui-block="navbar-037"] [data-part="level"]{position:relative;width:2.6rem;height:1.1rem;border:1.5px solid currentColor;border-radius:.2rem;flex-shrink:0;overflow:hidden}
[data-vibeui-block="navbar-037"] [data-part="level"]::before,[data-vibeui-block="navbar-037"] [data-part="level"]::after{content:"";position:absolute;top:0;bottom:0;width:1px;background:currentColor;opacity:.5;left:calc(50% - .32rem)}
[data-vibeui-block="navbar-037"] [data-part="level"]::after{left:auto;right:calc(50% - .32rem)}
[data-vibeui-block="navbar-037"] [data-part="bubble"]{position:absolute;top:.15rem;left:calc(50% - .3rem);width:.6rem;height:.6rem;border-radius:50%;background:var(--vibeui-navbar-037-accent);box-shadow:0 0 0 1px color-mix(in oklab,var(--vibeui-navbar-037-fg) 30%,transparent) inset;animation:vibeui-navbar-037-bubble 1.6s cubic-bezier(.2,.8,.2,1) both}
[data-vibeui-block="navbar-037"] [data-part="name"]{display:grid;line-height:1.05}
[data-vibeui-block="navbar-037"] [data-part="name"] b{font-family:var(--vibeui-navbar-037-display);font-weight:800;font-size:1.2rem;letter-spacing:-.03em;text-transform:uppercase}
[data-vibeui-block="navbar-037"] [data-part="name"] small{font-family:var(--vibeui-navbar-037-mono);font-size:.6rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-navbar-037-muted);margin-top:.15rem}
[data-vibeui-block="navbar-037"] [data-part="nav"]{display:none;gap:1.4rem;margin-left:1.6rem}
[data-vibeui-block="navbar-037"] [data-part="nav"] a{position:relative;color:var(--vibeui-navbar-037-muted);text-decoration:none;font-weight:500;transition:color .2s}
[data-vibeui-block="navbar-037"] [data-part="nav"] a::after{content:"";position:absolute;left:0;right:0;bottom:-.3rem;height:2px;background:var(--vibeui-navbar-037-accent);transform:scaleX(0);transform-origin:left;transition:transform .25s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="navbar-037"] [data-part="nav"] a:hover{color:var(--vibeui-navbar-037-fg)}
[data-vibeui-block="navbar-037"] [data-part="nav"] a:hover::after{transform:scaleX(1)}
[data-vibeui-block="navbar-037"] [data-part="right"]{margin-left:auto;display:flex;align-items:center;gap:1rem}
[data-vibeui-block="navbar-037"] [data-part="phone"]{display:none;font-family:var(--vibeui-navbar-037-mono);font-size:.85rem;font-weight:500;color:var(--vibeui-navbar-037-fg);text-decoration:none;letter-spacing:-.01em;transition:color .2s}
[data-vibeui-block="navbar-037"] [data-part="phone"]:hover{color:var(--vibeui-navbar-037-muted)}
[data-vibeui-block="navbar-037"] [data-part="action"]{display:inline-flex;align-items:center;gap:.5rem;padding:.65rem 1.1rem;border-radius:.35rem;background:var(--vibeui-navbar-037-accent);color:var(--vibeui-navbar-037-on-accent);text-decoration:none;font-weight:600;font-size:.88rem;white-space:nowrap;box-shadow:0 0 0 1px color-mix(in oklab,var(--vibeui-navbar-037-fg) 20%,transparent) inset;transition:transform .18s,box-shadow .2s}
[data-vibeui-block="navbar-037"] [data-part="action"]:hover{transform:translateY(-1px);box-shadow:0 0 0 1px color-mix(in oklab,var(--vibeui-navbar-037-fg) 20%,transparent) inset,0 10px 24px -10px var(--vibeui-navbar-037-accent)}
[data-vibeui-block="navbar-037"] [data-part="action"] svg{width:.9rem;height:.9rem}
[data-vibeui-block="navbar-037"] a:focus-visible{outline:2px solid var(--vibeui-navbar-037-accent);outline-offset:2px}
[data-vibeui-block="navbar-037"] [data-part="tape"]{position:relative;height:6px;border-top:1px solid var(--vibeui-navbar-037-line);background:repeating-linear-gradient(90deg,color-mix(in oklab,var(--vibeui-navbar-037-fg) 35%,transparent) 0 1px,transparent 1px 40px),repeating-linear-gradient(90deg,var(--vibeui-navbar-037-line) 0 1px,transparent 1px 8px)}
[data-vibeui-block="navbar-037"] [data-part="tape"]::after{content:"";position:absolute;left:0;top:0;bottom:0;width:100%;background:var(--vibeui-navbar-037-accent);transform:scaleX(var(--vibeui-navbar-037-progress));transform-origin:left;opacity:.9}
@keyframes vibeui-navbar-037-bubble{0%{transform:translateX(-.9rem)}55%{transform:translateX(.25rem)}100%{transform:translateX(0)}}
@container (min-width: 40rem){[data-vibeui-block="navbar-037"] [data-part="phone"]{display:inline}}
@container (min-width: 60rem){[data-vibeui-block="navbar-037"] [data-part="nav"]{display:flex}}
[data-vibeui-block="navbar-037"] [data-part="burger"]{display:inline-flex;flex-direction:column;justify-content:center;gap:5px;flex-shrink:0;width:2.6rem;height:2.6rem;padding:0;border:1px solid var(--vibeui-navbar-037-line);border-radius:.35rem;background:transparent;color:inherit;cursor:pointer}
[data-vibeui-block="navbar-037"] [data-part="burger"] i{display:block;width:1rem;height:2px;margin:0 auto;background:currentColor;transition:transform .25s,opacity .2s}
[data-vibeui-block="navbar-037"] [data-part="burger"][aria-expanded="true"] i:nth-child(1){transform:translateY(7px) rotate(45deg)}
[data-vibeui-block="navbar-037"] [data-part="burger"][aria-expanded="true"] i:nth-child(2){opacity:0}
[data-vibeui-block="navbar-037"] [data-part="burger"][aria-expanded="true"] i:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
[data-vibeui-block="navbar-037"] [data-part="burger"]:focus-visible{outline:2px solid var(--vibeui-navbar-037-accent);outline-offset:2px}
[data-vibeui-block="navbar-037"] [data-part="menu"]{display:grid;gap:.2rem;max-width:80rem;margin:0 auto;padding:.6rem 1.25rem 1.25rem;border-top:1px solid var(--vibeui-navbar-037-line);background:var(--vibeui-navbar-037-bg);animation:vibeui-navbar-037-menu .22s ease-out}
[data-vibeui-block="navbar-037"] [data-part="menu"][hidden]{display:none}
[data-vibeui-block="navbar-037"] [data-part="menu"] a{padding:.8rem .7rem;border-radius:.4rem;color:var(--vibeui-navbar-037-fg);text-decoration:none;font-weight:600;font-size:1.05rem}
[data-vibeui-block="navbar-037"] [data-part="menu"] a:hover{background:color-mix(in oklab,var(--vibeui-navbar-037-fg) 6%,transparent)}
[data-vibeui-block="navbar-037"] [data-part="menu"] a[data-mono]{font-family:var(--vibeui-navbar-037-mono);font-weight:500}
[data-vibeui-block="navbar-037"] [data-part="menu"] a[data-cta]{margin-top:.4rem;text-align:center;background:var(--vibeui-navbar-037-accent);color:var(--vibeui-navbar-037-on-accent)}
@keyframes vibeui-navbar-037-menu{from{opacity:0;transform:translateY(-6px)}}
@container (min-width: 60rem){[data-vibeui-block="navbar-037"] [data-part="burger"],[data-vibeui-block="navbar-037"] [data-part="menu"]{display:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-037"] *{animation:none!important;transition:none!important}}`

/** Шапка бригады с пузырьком уровня и рулеткой-прогрессом. */
export function Navbar037({
  brand = "Ровно",
  caption = "ремонт квартир · с 2011",
  brandHref = "#top",
  links = [
    { label: "Смета", href: "#calc" },
    { label: "Этапы", href: "#stages" },
    { label: "Объекты", href: "#works" },
    { label: "Стройка онлайн", href: "#online" },
    { label: "Бригада", href: "#team" },
  ],
  phone = "+7 495 120-40-40",
  phoneHref = "tel:+74951204040",
  actionLabel = "Рассчитать смету",
  actionHref = "#calc",
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
}: Navbar037Props) {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(window.scrollY > 12)
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-navbar-037-accent": accent } : null),
    ...(ink ? { "--vibeui-navbar-037-fg": ink } : null),
    ...(background ? { "--vibeui-navbar-037-bg": background } : null),
    "--vibeui-navbar-037-progress": progress.toFixed(4),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-037" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-037" data-tone={tone === "auto" ? undefined : tone} data-sticky={sticky} data-scrolled={scrolled} className={className} style={palette}>
        <div data-part="row">
          <a data-part="brand" href={brandHref}>
            <span data-part="level" aria-hidden="true">
              <i data-part="bubble" />
            </span>
            <span data-part="name">
              <b>{brand}</b>
              {caption ? <small>{caption}</small> : null}
            </span>
          </a>
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
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M2 4h12M2 12h12M2 4v3M14 4v3M2 9v3M14 9v3M5 4v2M8 4v3M11 4v2M5 12v-2M8 12v-3M11 12v-2" />
                </svg>
                {actionLabel}
              </a>
            ) : null}
          </div>
          <button data-part="burger" type="button" aria-expanded={menuOpen} aria-controls="vibeui-navbar-037-menu" aria-label={menuOpen ? menuCloseLabel : menuOpenLabel} onClick={() => setMenuOpen((value) => !value)}>
            <i aria-hidden="true" />
            <i aria-hidden="true" />
            <i aria-hidden="true" />
          </button>
        </div>
        <nav data-part="menu" id="vibeui-navbar-037-menu" hidden={!menuOpen} aria-label={menuLabel} onClick={() => setMenuOpen(false)}>
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          {phone ? (
            <a data-mono="" href={phoneHref}>
              {phone}
            </a>
          ) : null}
          {actionLabel ? (
            <a data-cta="" href={actionHref}>
              {actionLabel}
            </a>
          ) : null}
        </nav>
        <div data-part="tape" aria-hidden="true" />
      </header>
    </>
  )
}

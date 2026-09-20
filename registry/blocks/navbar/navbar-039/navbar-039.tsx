"use client"

import { useEffect, useState, type CSSProperties } from "react"

export type Navbar039Link = {
  label: string
  href: string
}

export type Navbar039Props = {
  brand?: string
  /** Рукописная подпись под лого: «языковая школа». */
  caption?: string
  brandHref?: string
  links?: readonly Navbar039Link[]
  /** Языки-чипы справа от лого: «EN», «ES», «IT». */
  languages?: readonly string[]
  actionLabel?: string
  actionHref?: string
  sticky?: boolean
  /** aria навигации, меню и кнопки-бургера. */
  navLabel?: string
  menuLabel?: string
  menuOpenLabel?: string
  menuCloseLabel?: string
  /** aria списка языков. */
  langsLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Шапка языковой школы в духе тетради: лого с рукописной подписью
// (Marck Script), под ним акцентная «черта ручкой», три чипа языков,
// разделы и кнопка «Пробный урок». При прокрутке шапка превращается в
// полупрозрачную бумагу с блюром, а снизу проявляется линовка — ряд
// бледных линий тетради. На узком — бургер, меню раскрывается вниз.
const FONTS = "https://fonts.googleapis.com/css2?family=Onest:wght@500;600;700;800&family=Golos+Text:wght@400;500;600&family=Marck+Script&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-039"]){
--vibeui-navbar-039-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-039-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-039-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-039-on-accent:oklch(from var(--vibeui-navbar-039-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-039-muted:color-mix(in oklab,var(--vibeui-navbar-039-fg) 62%,var(--vibeui-navbar-039-bg));
--vibeui-navbar-039-line:color-mix(in oklab,var(--vibeui-navbar-039-fg) 12%,transparent);
--vibeui-navbar-039-rule:color-mix(in oklab,var(--vibeui-navbar-039-fg) 9%,transparent);
--vibeui-navbar-039-display:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-039-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-039-hand:"Marck Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-039"]{color-scheme:dark}
:where([data-vibeui-block="navbar-039"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-039"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-039"]{box-sizing:border-box;position:relative;z-index:50;font-family:var(--vibeui-navbar-039-font);color:var(--vibeui-navbar-039-fg);font-size:.92rem;line-height:1.4;background:var(--vibeui-navbar-039-bg);transition:background .3s,box-shadow .3s}
[data-vibeui-block="navbar-039"][data-sticky="true"]{position:sticky;top:0}
[data-vibeui-block="navbar-039"]::after{content:"";position:absolute;left:0;right:0;bottom:-.75rem;height:.75rem;background:repeating-linear-gradient(180deg,var(--vibeui-navbar-039-rule) 0 1px,transparent 1px .375rem);opacity:0;transition:opacity .4s;pointer-events:none}
[data-vibeui-block="navbar-039"][data-scrolled="true"]{background:color-mix(in oklab,var(--vibeui-navbar-039-bg) 82%,transparent);backdrop-filter:blur(14px);box-shadow:0 1px 0 var(--vibeui-navbar-039-line)}
[data-vibeui-block="navbar-039"][data-scrolled="true"]::after{opacity:1}
[data-vibeui-block="navbar-039"] *{box-sizing:border-box}
[data-vibeui-block="navbar-039"] [data-part="row"]{display:flex;align-items:center;gap:.8rem;height:4.25rem;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="navbar-039"] [data-part="brand"]{position:relative;display:inline-grid;line-height:1;text-decoration:none;color:inherit;padding-bottom:.15rem}
[data-vibeui-block="navbar-039"] [data-part="brand"] b{font-family:var(--vibeui-navbar-039-display);font-weight:800;font-size:1.45rem;letter-spacing:-.03em}
[data-vibeui-block="navbar-039"] [data-part="brand"] span{font-family:var(--vibeui-navbar-039-hand);font-size:.95rem;color:var(--vibeui-navbar-039-accent);margin-top:-.15rem;transform:rotate(-2deg);transform-origin:left}
[data-vibeui-block="navbar-039"] [data-part="brand"] svg{position:absolute;left:0;bottom:.9rem;width:3.2rem;height:.5rem;color:var(--vibeui-navbar-039-accent);overflow:visible}
[data-vibeui-block="navbar-039"] [data-part="brand"] path{stroke-dasharray:60;stroke-dashoffset:60;animation:vibeui-navbar-039-ink 1.1s cubic-bezier(.2,.8,.2,1) .3s forwards}
[data-vibeui-block="navbar-039"] [data-part="langs"]{display:none;gap:.3rem;margin-left:.4rem}
[data-vibeui-block="navbar-039"] [data-part="langs"] span{display:inline-grid;place-items:center;width:1.9rem;height:1.9rem;border-radius:.6rem;border:1px solid var(--vibeui-navbar-039-line);font-family:var(--vibeui-navbar-039-display);font-size:.62rem;font-weight:700;letter-spacing:.04em;color:var(--vibeui-navbar-039-muted);transform:rotate(calc(var(--vibeui-navbar-039-r) * 1deg));transition:transform .25s,color .2s,border-color .2s}
[data-vibeui-block="navbar-039"] [data-part="langs"] span:hover{transform:rotate(0) translateY(-2px);color:var(--vibeui-navbar-039-accent);border-color:var(--vibeui-navbar-039-accent)}
[data-vibeui-block="navbar-039"] [data-part="nav"]{display:none;gap:1.4rem;margin-left:1.2rem}
[data-vibeui-block="navbar-039"] [data-part="nav"] a{position:relative;color:var(--vibeui-navbar-039-muted);text-decoration:none;font-weight:500;transition:color .2s}
[data-vibeui-block="navbar-039"] [data-part="nav"] a::after{content:"";position:absolute;left:0;right:0;bottom:-.35rem;height:2px;border-radius:2px;background:var(--vibeui-navbar-039-accent);transform:scaleX(0);transform-origin:left;transition:transform .3s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="navbar-039"] [data-part="nav"] a:hover{color:var(--vibeui-navbar-039-fg)}
[data-vibeui-block="navbar-039"] [data-part="nav"] a:hover::after{transform:scaleX(1)}
[data-vibeui-block="navbar-039"] [data-part="right"]{margin-left:auto;display:flex;align-items:center;gap:.8rem}
[data-vibeui-block="navbar-039"] [data-part="action"]{position:relative;display:inline-flex;align-items:center;gap:.4rem;padding:.65rem 1.15rem;border-radius:.9rem;background:var(--vibeui-navbar-039-accent);color:var(--vibeui-navbar-039-on-accent);text-decoration:none;font-weight:600;font-size:.88rem;white-space:nowrap;transition:transform .18s,box-shadow .2s}
[data-vibeui-block="navbar-039"] [data-part="action"]:hover{transform:translateY(-1px) rotate(-1deg);box-shadow:0 10px 24px -10px var(--vibeui-navbar-039-accent)}
[data-vibeui-block="navbar-039"] a:focus-visible{outline:2px solid var(--vibeui-navbar-039-accent);outline-offset:2px}
[data-vibeui-block="navbar-039"] [data-part="burger"]{display:inline-flex;flex-direction:column;justify-content:center;gap:5px;flex-shrink:0;width:2.5rem;height:2.5rem;padding:0;border:1px solid var(--vibeui-navbar-039-line);border-radius:.8rem;background:transparent;color:inherit;cursor:pointer}
[data-vibeui-block="navbar-039"] [data-part="burger"] i{display:block;width:1rem;height:2px;margin:0 auto;background:currentColor;border-radius:2px;transition:transform .25s,opacity .2s}
[data-vibeui-block="navbar-039"] [data-part="burger"][aria-expanded="true"] i:nth-child(1){transform:translateY(7px) rotate(45deg)}
[data-vibeui-block="navbar-039"] [data-part="burger"][aria-expanded="true"] i:nth-child(2){opacity:0}
[data-vibeui-block="navbar-039"] [data-part="burger"][aria-expanded="true"] i:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
[data-vibeui-block="navbar-039"] [data-part="burger"]:focus-visible{outline:2px solid var(--vibeui-navbar-039-accent);outline-offset:2px}
[data-vibeui-block="navbar-039"] [data-part="menu"]{display:grid;gap:.2rem;max-width:80rem;margin:0 auto;padding:.6rem 1.25rem 1.25rem;border-top:1px solid var(--vibeui-navbar-039-line);background:var(--vibeui-navbar-039-bg);background-image:repeating-linear-gradient(180deg,transparent 0 calc(2.9rem - 1px),var(--vibeui-navbar-039-rule) calc(2.9rem - 1px) 2.9rem);animation:vibeui-navbar-039-menu .22s ease-out}
[data-vibeui-block="navbar-039"] [data-part="menu"][hidden]{display:none}
[data-vibeui-block="navbar-039"] [data-part="menu"] a{padding:.8rem .7rem;border-radius:.7rem;color:var(--vibeui-navbar-039-fg);text-decoration:none;font-weight:600;font-size:1.05rem}
[data-vibeui-block="navbar-039"] [data-part="menu"] a:hover{background:color-mix(in oklab,var(--vibeui-navbar-039-fg) 6%,transparent)}
[data-vibeui-block="navbar-039"] [data-part="menu"] a[data-cta]{margin-top:.4rem;text-align:center;background:var(--vibeui-navbar-039-accent);color:var(--vibeui-navbar-039-on-accent)}
@keyframes vibeui-navbar-039-menu{from{opacity:0;transform:translateY(-6px)}}
@keyframes vibeui-navbar-039-ink{to{stroke-dashoffset:0}}
@container (min-width: 40rem){[data-vibeui-block="navbar-039"] [data-part="langs"]{display:flex}}
@container (min-width: 60rem){[data-vibeui-block="navbar-039"] [data-part="nav"]{display:flex}[data-vibeui-block="navbar-039"] [data-part="burger"],[data-vibeui-block="navbar-039"] [data-part="menu"]{display:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-039"] *{animation:none!important;transition:none!important}[data-vibeui-block="navbar-039"] [data-part="brand"] path{stroke-dashoffset:0}}`

/** Шапка языковой школы: лого с рукописной подписью, чипы языков, бургер. */
export function Navbar039({
  brand = "Слово",
  caption = "языковая школа",
  brandHref = "#top",
  links = [
    { label: "Тест уровня", href: "#test" },
    { label: "Как учим", href: "#how" },
    { label: "Расписание", href: "#schedule" },
    { label: "Преподаватели", href: "#teachers" },
    { label: "Цены", href: "#pricing" },
  ],
  languages = ["EN", "ES", "IT"],
  actionLabel = "Пробный урок",
  actionHref = "#trial",
  sticky = true,
  navLabel = "Разделы",
  menuLabel = "Меню",
  menuOpenLabel = "Открыть меню",
  menuCloseLabel = "Закрыть меню",
  langsLabel = "Языки",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Navbar039Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-navbar-039-accent": accent } : null),
    ...(ink ? { "--vibeui-navbar-039-fg": ink } : null),
    ...(background ? { "--vibeui-navbar-039-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-039" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-039" data-tone={tone === "auto" ? undefined : tone} data-sticky={sticky} data-scrolled={scrolled} className={className} style={palette}>
        <div data-part="row">
          <a data-part="brand" href={brandHref}>
            <b>{brand}</b>
            <svg viewBox="0 0 60 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M1 5c12-4 24-4 36-1s16 1 22-2" />
            </svg>
            {caption ? <span>{caption}</span> : null}
          </a>
          {languages.length > 0 ? (
            <div data-part="langs" aria-label={langsLabel}>
              {languages.map((language, index) => (
                <span key={language} style={{ ["--vibeui-navbar-039-r" as string]: index % 2 === 0 ? -4 : 4 }}>
                  {language}
                </span>
              ))}
            </div>
          ) : null}
          <nav data-part="nav" aria-label={navLabel}>
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
              </a>
            ) : null}
            <button data-part="burger" type="button" aria-expanded={menuOpen} aria-controls="vibeui-navbar-039-menu" aria-label={menuOpen ? menuCloseLabel : menuOpenLabel} onClick={() => setMenuOpen((value) => !value)}>
              <i aria-hidden="true" />
              <i aria-hidden="true" />
              <i aria-hidden="true" />
            </button>
          </div>
        </div>
        <nav data-part="menu" id="vibeui-navbar-039-menu" hidden={!menuOpen} aria-label={menuLabel} onClick={() => setMenuOpen(false)}>
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

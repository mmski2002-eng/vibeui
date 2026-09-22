"use client"

import { useEffect, useState, type CSSProperties } from "react"
import type { ComponentProps } from "react"

export type Navbar044Link = {
  label: string
  href: string
}

export type Navbar044Props = {
  brand?: string
  brandHref?: string
  /** Рукописная пометка рядом с брендом: «фонд помощи пожилым». */
  note?: string
  links?: readonly Navbar044Link[]
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

// Шапка благотворительного фонда: бренд антиквой с домиком-иконкой и
// рукописной пометкой Caveat рядом, разделы, кнопка «Помочь» акцентом с
// сердцем, которое чуть «бьётся» по наведению. При прокрутке шапка
// становится полупрозрачной бумагой с блюром и «швом» — пунктирной линией
// по низу. На узком — бургер с выпадающим меню.
const FONTS = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&family=Golos+Text:wght@400;500;600&family=Caveat:wght@500;700&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-044"]){
--vibeui-navbar-044-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-044-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-044-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-044-on-accent:oklch(from var(--vibeui-navbar-044-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-044-muted:color-mix(in oklab,var(--vibeui-navbar-044-fg) 62%,var(--vibeui-navbar-044-bg));
--vibeui-navbar-044-line:color-mix(in oklab,var(--vibeui-navbar-044-fg) 18%,transparent);
--vibeui-navbar-044-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-navbar-044-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-044-hand:"Caveat","Segoe Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-044"]{color-scheme:dark}
:where([data-vibeui-block="navbar-044"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-044"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-044"]{box-sizing:border-box;position:relative;z-index:50;font-family:var(--vibeui-navbar-044-font);color:var(--vibeui-navbar-044-fg);background:var(--vibeui-navbar-044-bg);font-size:.95rem;line-height:1.4;transition:background .3s}
[data-vibeui-block="navbar-044"][data-sticky="true"]{position:sticky;top:0}
[data-vibeui-block="navbar-044"]::after{content:"";position:absolute;left:1.25rem;right:1.25rem;bottom:0;border-bottom:1px dashed var(--vibeui-navbar-044-line);opacity:0;transition:opacity .4s}
[data-vibeui-block="navbar-044"][data-scrolled="true"]{background:color-mix(in oklab,var(--vibeui-navbar-044-bg) 82%,transparent);backdrop-filter:blur(14px)}
[data-vibeui-block="navbar-044"][data-scrolled="true"]::after{opacity:1}
[data-vibeui-block="navbar-044"] *{box-sizing:border-box}
[data-vibeui-block="navbar-044"] [data-part="row"]{display:flex;align-items:center;gap:.8rem;height:4.25rem;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="navbar-044"] [data-part="brand"]{display:inline-flex;align-items:center;gap:.55rem;font-family:var(--vibeui-navbar-044-display);font-style:italic;font-weight:700;font-size:1.35rem;letter-spacing:-.01em;text-decoration:none;color:inherit;white-space:nowrap}
[data-vibeui-block="navbar-044"] [data-part="house"]{width:1.6rem;height:1.6rem;color:var(--vibeui-navbar-044-accent);flex-shrink:0}
[data-vibeui-block="navbar-044"] [data-part="note"]{display:none;margin-left:.2rem;font-family:var(--vibeui-navbar-044-hand);font-size:1.15rem;line-height:1;color:var(--vibeui-navbar-044-accent);transform:rotate(-4deg);white-space:nowrap}
[data-vibeui-block="navbar-044"] [data-part="nav"]{display:none;gap:1.4rem;margin-left:auto}
[data-vibeui-block="navbar-044"] [data-part="nav"] a{position:relative;color:var(--vibeui-navbar-044-muted);text-decoration:none;font-weight:500;transition:color .2s}
[data-vibeui-block="navbar-044"] [data-part="nav"] a::after{content:"";position:absolute;left:0;right:0;bottom:-.3rem;height:2px;background:var(--vibeui-navbar-044-accent);transform:scaleX(0);transform-origin:left;transition:transform .25s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="navbar-044"] [data-part="nav"] a:hover{color:var(--vibeui-navbar-044-fg)}
[data-vibeui-block="navbar-044"] [data-part="nav"] a:hover::after{transform:scaleX(1)}
[data-vibeui-block="navbar-044"] [data-part="right"]{margin-left:auto;display:flex;align-items:center;gap:.7rem}
[data-vibeui-block="navbar-044"] [data-part="nav"] + [data-part="right"]{margin-left:1.4rem}
[data-vibeui-block="navbar-044"] a:focus-visible,[data-vibeui-block="navbar-044"] button:focus-visible{outline:2px solid var(--vibeui-navbar-044-accent);outline-offset:2px}
@keyframes vibeui-navbar-044-beat{0%,100%{transform:scale(1)}30%{transform:scale(1.25)}60%{transform:scale(1.05)}}
[data-vibeui-block="navbar-044"] [data-part="burger"]{display:inline-flex;flex-direction:column;justify-content:center;gap:5px;flex-shrink:0;width:2.6rem;height:2.6rem;padding:0;border:1px solid var(--vibeui-navbar-044-line);border-radius:999px;background:transparent;color:inherit;cursor:pointer}
[data-vibeui-block="navbar-044"] [data-part="burger"] i{display:block;width:1rem;height:2px;margin:0 auto;background:currentColor;border-radius:2px;transition:transform .25s,opacity .2s}
[data-vibeui-block="navbar-044"] [data-part="burger"][aria-expanded="true"] i:nth-child(1){transform:translateY(7px) rotate(45deg)}
[data-vibeui-block="navbar-044"] [data-part="burger"][aria-expanded="true"] i:nth-child(2){opacity:0}
[data-vibeui-block="navbar-044"] [data-part="burger"][aria-expanded="true"] i:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
[data-vibeui-block="navbar-044"] [data-part="menu"]{display:grid;gap:.2rem;max-width:80rem;margin:0 auto;padding:.6rem 1.25rem 1.25rem;border-top:1px dashed var(--vibeui-navbar-044-line);background:var(--vibeui-navbar-044-bg);animation:vibeui-navbar-044-menu .22s ease-out}
[data-vibeui-block="navbar-044"] [data-part="menu"][hidden]{display:none}
[data-vibeui-block="navbar-044"] [data-part="menu"] a{padding:.8rem .7rem;border-radius:.7rem;color:var(--vibeui-navbar-044-fg);text-decoration:none;font-family:var(--vibeui-navbar-044-display);font-size:1.25rem}
[data-vibeui-block="navbar-044"] [data-part="menu"] a:hover{background:color-mix(in oklab,var(--vibeui-navbar-044-fg) 6%,transparent)}
[data-vibeui-block="navbar-044"] [data-part="menu"] a[data-cta]{margin-top:.4rem;text-align:center;font-family:var(--vibeui-navbar-044-font);font-weight:600;background:var(--vibeui-navbar-044-accent);color:var(--vibeui-navbar-044-on-accent)}
@keyframes vibeui-navbar-044-menu{from{opacity:0;transform:translateY(-6px)}}
@container (min-width: 36rem){[data-vibeui-block="navbar-044"] [data-part="note"]{display:inline-block}}
@container (min-width: 60rem){[data-vibeui-block="navbar-044"] [data-part="nav"]{display:flex}[data-vibeui-block="navbar-044"] [data-part="right"]{margin-left:0}[data-vibeui-block="navbar-044"] [data-part="burger"],[data-vibeui-block="navbar-044"] [data-part="menu"]{display:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-044"] *{animation:none!important;transition:none!important}}
@keyframes vibeui-navbar-044-beat{0%,100%{transform:scale(1)}30%{transform:scale(1.25)}60%{transform:scale(1.05)}}
[data-vibeui-block="navbar-044"] [data-part="action"]{display:inline-flex;align-items:center;gap:.45rem;padding:.6rem 1.15rem;border-radius:999px;background:var(--vibeui-navbar-044-accent);color:var(--vibeui-navbar-044-on-accent);text-decoration:none;font-weight:600;font-size:.9rem;white-space:nowrap;transition:transform .18s,box-shadow .2s}
[data-vibeui-block="navbar-044"] [data-part="action"] svg{width:1rem;height:1rem;transition:transform .2s}
[data-vibeui-block="navbar-044"] [data-part="action"]:hover{transform:translateY(-1px);box-shadow:0 10px 24px -10px var(--vibeui-navbar-044-accent)}
[data-vibeui-block="navbar-044"] [data-part="action"]:hover svg{animation:vibeui-navbar-044-beat .9s ease-in-out infinite}
`

type ActionProps = Omit<ComponentProps<"a">, "title" | "children"> & {
  actionHref?: string
  actionLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function Action({
  actionHref = "#donate",
  actionLabel = "Помочь",
  accent,
  className,
  style,
  ...props
}: ActionProps) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-044-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
      <a
        {...props} href={actionHref}
        className={className}
        style={palette}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3.4 5 7 5c2 0 3.4 1.1 5 2.8C13.6 6.1 15 5 17 5c3.6 0 5.8 3.6 4.5 6.8C19.5 16.4 12 21 12 21Z" />
        </svg>
        {actionLabel}
      </a>
  )
}

/** Шапка фонда: антиква, рукописная пометка, «Помочь» с сердцем, бургер. */
export function Navbar044({
  brand = "Тёплый дом",
  brandHref = "#top",
  note = "фонд помощи пожилым",
  links = [
    { label: "Кому помогаем", href: "#stories" },
    { label: "Отчёты", href: "#report" },
    { label: "Волонтёрам", href: "#volunteer" },
    { label: "События", href: "#events" },
  ],
  actionLabel = "Помочь",
  actionHref = "#donate",
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
}: Navbar044Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-navbar-044-accent": accent } : null),
    ...(ink ? { "--vibeui-navbar-044-fg": ink } : null),
    ...(background ? { "--vibeui-navbar-044-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-044" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-044" data-tone={tone === "auto" ? undefined : tone} data-sticky={sticky} data-scrolled={scrolled} className={className} style={palette}>
        <div data-part="row">
          <a data-part="brand" href={brandHref}>
            <svg data-part="house" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 11.5 12 4l9 7.5" />
              <path d="M5.5 10v10h13V10" />
              <path d="M12 20v-5.5a2 2 0 0 1 4 0V20" />
              <path d="M8.5 13.2c0-.9 1.4-1.2 1.75-.3.35-.9 1.75-.6 1.75.3 0 1-1.75 2.2-1.75 2.2S8.5 14.2 8.5 13.2Z" fill="currentColor" stroke="none" />
            </svg>
            {brand}
          </a>
          {note ? (
            <span data-part="note" aria-hidden="true">
              {note}
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
            {actionLabel ? (
              <Action data-part="action" actionHref={actionHref} actionLabel={actionLabel} accent={accent} />
            ) : null}
            <button data-part="burger" type="button" aria-expanded={menuOpen} aria-controls="vibeui-navbar-044-menu" aria-label={menuOpen ? menuCloseLabel : menuOpenLabel} onClick={() => setMenuOpen((value) => !value)}>
              <i aria-hidden="true" />
              <i aria-hidden="true" />
              <i aria-hidden="true" />
            </button>
          </div>
        </div>
        <nav data-part="menu" id="vibeui-navbar-044-menu" hidden={!menuOpen} aria-label={menuLabel} onClick={() => setMenuOpen(false)}>
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

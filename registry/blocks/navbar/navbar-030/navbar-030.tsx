"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Navbar030Link = {
  label: string
  href: string
}

export type Navbar030Props = {
  brand?: string
  brandHref?: string
  version?: string
  links?: readonly Navbar030Link[]
  /** Число звёзд — считается вверх при загрузке. */
  stars?: number
  starsLabel?: string
  githubHref?: string
  actionLabel?: string
  actionHref?: string
  sticky?: boolean
  /** aria навигации, меню и кнопки-бургера. */
  navLabel?: string
  menuLabel?: string
  menuOpenLabel?: string
  menuCloseLabel?: string
  /** aria ссылки на звёзды. */
  starsAria?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Шапка open-source проекта: имя пакета моноширинным с префиксом «~/», чип
// версии, разделы, чип звёзд GitHub, который считает вверх при первом
// показе (rAF, ease-out), и кнопка «Начать». Липкая, при прокрутке — линия
// снизу, лёгкое стекло и тонкая полоса прогресса прокрутки на
// animation-timeline: scroll() (в браузерах без поддержки её просто нет).
// Ссылки подчёркиваются «выездом» слева, кнопка приподнимается с цветной тенью.
const FONTS = "https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-030"]){
--vibeui-navbar-030-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-030-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-030-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-030-on-accent:oklch(from var(--vibeui-navbar-030-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-030-muted:color-mix(in oklab,var(--vibeui-navbar-030-fg) 60%,var(--vibeui-navbar-030-bg));
--vibeui-navbar-030-line:color-mix(in oklab,var(--vibeui-navbar-030-fg) 14%,transparent);
--vibeui-navbar-030-panel:color-mix(in oklab,var(--vibeui-navbar-030-fg) 5%,var(--vibeui-navbar-030-bg));
--vibeui-navbar-030-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-030-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-030"]{color-scheme:dark}
:where([data-vibeui-block="navbar-030"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-030"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-030"]{box-sizing:border-box;position:relative;z-index:50;font-family:var(--vibeui-navbar-030-font);color:var(--vibeui-navbar-030-fg);font-size:.92rem;line-height:1.4;background:color-mix(in oklab,var(--vibeui-navbar-030-bg) 92%,transparent);backdrop-filter:blur(10px);border-bottom:1px solid transparent;transition:border-color .3s}
[data-vibeui-block="navbar-030"][data-sticky="true"]{position:sticky;top:0}
[data-vibeui-block="navbar-030"][data-scrolled="true"]{border-color:var(--vibeui-navbar-030-line)}
[data-vibeui-block="navbar-030"] *{box-sizing:border-box}
[data-vibeui-block="navbar-030"] [data-part="row"]{display:flex;align-items:center;gap:1rem;height:3.75rem;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="navbar-030"] [data-part="brand"]{display:inline-flex;align-items:center;gap:.5rem;text-decoration:none;color:inherit;font-family:var(--vibeui-navbar-030-mono);font-weight:600;font-size:1rem;white-space:nowrap}
[data-vibeui-block="navbar-030"] [data-part="brand"] i{color:var(--vibeui-navbar-030-accent);font-style:normal}
[data-vibeui-block="navbar-030"] [data-part="ver"]{font-family:var(--vibeui-navbar-030-mono);font-size:.68rem;padding:.2rem .45rem;border-radius:4px;border:1px solid var(--vibeui-navbar-030-line);color:var(--vibeui-navbar-030-muted)}
[data-vibeui-block="navbar-030"] [data-part="nav"]{display:none;gap:1.2rem;margin-left:1rem}
[data-vibeui-block="navbar-030"] [data-part="nav"] a{position:relative;color:var(--vibeui-navbar-030-muted);text-decoration:none;font-weight:500;padding:.2rem 0;transition:color .2s,transform .3s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="navbar-030"] [data-part="nav"] a::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1.5px;background:var(--vibeui-navbar-030-accent);transform:scaleX(0);transform-origin:right;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="navbar-030"] [data-part="nav"] a:hover{color:var(--vibeui-navbar-030-fg);transform:translateY(-1px)}
[data-vibeui-block="navbar-030"] [data-part="nav"] a:hover::after{transform:scaleX(1);transform-origin:left}
[data-vibeui-block="navbar-030"] [data-part="progress"]{position:absolute;left:0;bottom:-1px;width:100%;height:2px;background:linear-gradient(90deg,var(--vibeui-navbar-030-accent),oklch(from var(--vibeui-navbar-030-accent) l c calc(h + 60)));transform:scaleX(0);transform-origin:left;pointer-events:none;display:none}
@supports (animation-timeline: scroll()){[data-vibeui-block="navbar-030"] [data-part="progress"]{display:block;animation:vibeui-navbar-030-progress linear both;animation-timeline:scroll(root)}}
@keyframes vibeui-navbar-030-progress{to{transform:scaleX(1)}}
[data-vibeui-block="navbar-030"] [data-part="right"]{margin-left:auto;display:flex;align-items:center;gap:.5rem}
[data-vibeui-block="navbar-030"] [data-part="stars"]{display:inline-flex;align-items:center;gap:.4rem;padding:.4rem .7rem;border-radius:6px;border:1px solid var(--vibeui-navbar-030-line);background:var(--vibeui-navbar-030-panel);color:inherit;text-decoration:none;font-family:var(--vibeui-navbar-030-mono);font-size:.78rem;font-variant-numeric:tabular-nums;transition:border-color .2s,transform .3s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="navbar-030"] [data-part="stars"]:hover{border-color:var(--vibeui-navbar-030-accent);transform:translateY(-1px)}
[data-vibeui-block="navbar-030"] [data-part="stars"] svg{width:.9rem;height:.9rem;fill:var(--vibeui-navbar-030-accent)}
[data-vibeui-block="navbar-030"] [data-part="stars"] span{display:none;color:var(--vibeui-navbar-030-muted)}
[data-vibeui-block="navbar-030"] [data-part="action"]{display:inline-flex;align-items:center;padding:.5rem .9rem;border-radius:6px;background:var(--vibeui-navbar-030-accent);color:var(--vibeui-navbar-030-on-accent);text-decoration:none;font-weight:600;font-size:.85rem;white-space:nowrap;transition:transform .3s cubic-bezier(.2,.8,.2,1),box-shadow .3s}
[data-vibeui-block="navbar-030"] [data-part="action"]:hover{transform:translateY(-1px);box-shadow:0 8px 20px -8px color-mix(in oklab,var(--vibeui-navbar-030-accent) 70%,transparent)}
[data-vibeui-block="navbar-030"] a:focus-visible{outline:2px solid var(--vibeui-navbar-030-accent);outline-offset:2px}
@container (min-width: 40rem){[data-vibeui-block="navbar-030"] [data-part="stars"] span{display:inline}}
@container (min-width: 56rem){[data-vibeui-block="navbar-030"] [data-part="nav"]{display:flex}}
[data-vibeui-block="navbar-030"] [data-part="burger"]{display:inline-flex;flex-direction:column;justify-content:center;gap:5px;flex-shrink:0;width:2.5rem;height:2.5rem;padding:0;border:1px solid var(--vibeui-navbar-030-line);border-radius:999px;background:transparent;color:inherit;cursor:pointer}
[data-vibeui-block="navbar-030"] [data-part="burger"] i{display:block;width:1rem;height:2px;margin:0 auto;background:currentColor;border-radius:2px;transition:transform .25s,opacity .2s}
[data-vibeui-block="navbar-030"] [data-part="burger"][aria-expanded="true"] i:nth-child(1){transform:translateY(7px) rotate(45deg)}
[data-vibeui-block="navbar-030"] [data-part="burger"][aria-expanded="true"] i:nth-child(2){opacity:0}
[data-vibeui-block="navbar-030"] [data-part="burger"][aria-expanded="true"] i:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
[data-vibeui-block="navbar-030"] [data-part="burger"]:focus-visible{outline:2px solid var(--vibeui-navbar-030-accent);outline-offset:2px}
[data-vibeui-block="navbar-030"] [data-part="menu"]{display:grid;gap:.2rem;max-width:80rem;margin:0 auto;padding:.6rem 1.25rem 1.25rem;border-top:1px solid var(--vibeui-navbar-030-line);background:var(--vibeui-navbar-030-bg);animation:vibeui-navbar-030-menu .22s ease-out}
[data-vibeui-block="navbar-030"] [data-part="menu"][hidden]{display:none}
[data-vibeui-block="navbar-030"] [data-part="menu"] a{padding:.8rem .7rem;border-radius:.7rem;color:var(--vibeui-navbar-030-fg);text-decoration:none;font-weight:600;font-size:1.05rem}
[data-vibeui-block="navbar-030"] [data-part="menu"] a:hover{background:color-mix(in oklab,var(--vibeui-navbar-030-fg) 6%,transparent)}
[data-vibeui-block="navbar-030"] [data-part="menu"] a[data-cta]{margin-top:.4rem;text-align:center;background:var(--vibeui-navbar-030-accent);color:var(--vibeui-navbar-030-on-accent)}
@keyframes vibeui-navbar-030-menu{from{opacity:0;transform:translateY(-6px)}}
@container (min-width: 56rem){[data-vibeui-block="navbar-030"] [data-part="burger"],[data-vibeui-block="navbar-030"] [data-part="menu"]{display:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-030"] *{animation:none!important;transition:none!important}}`

/** Шапка open-source проекта с чипом звёзд GitHub. */
export function Navbar030({
  brand = "tabl",
  brandHref = "#top",
  version = "v2.4.1",
  links = [
    { label: "Документация", href: "#docs" },
    { label: "Песочница", href: "#playground" },
    { label: "Сравнение", href: "#compare" },
    { label: "История", href: "#changelog" },
  ],
  stars = 12480,
  starsLabel = "звёзд",
  githubHref = "#",
  actionLabel = "Начать",
  actionHref = "#install",
  sticky = true,
  navLabel = "Разделы",
  menuLabel = "Меню",
  menuOpenLabel = "Открыть меню",
  menuCloseLabel = "Закрыть меню",
  starsAria = "{stars} {label} на GitHub",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Navbar030Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [count, setCount] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (started.current) return
    started.current = true
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1200)
      setCount(Math.round(stars * (1 - Math.pow(1 - t, 3))))
      if (t < 1) raf = window.requestAnimationFrame(tick)
    }
    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [stars])

  const palette = {
    ...(accent ? { "--vibeui-navbar-030-accent": accent } : null),
    ...(ink ? { "--vibeui-navbar-030-fg": ink } : null),
    ...(background ? { "--vibeui-navbar-030-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-030" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-030" data-tone={tone === "auto" ? undefined : tone} data-sticky={sticky} data-scrolled={scrolled} className={className} style={palette}>
        <div data-part="row">
          <a data-part="brand" href={brandHref}>
            <i>~/</i>
            {brand}
          </a>
          {version ? <span data-part="ver">{version}</span> : null}
          <nav data-part="nav" aria-label={navLabel}>
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div data-part="right">
            <a data-part="stars" href={githubHref} aria-label={starsAria.replace("{stars}", String(stars)).replace("{label}", starsLabel)}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z" />
              </svg>
              {new Intl.NumberFormat("ru-RU").format(count)}
              <span>{starsLabel}</span>
            </a>
            {actionLabel ? (
              <a data-part="action" href={actionHref}>
                {actionLabel}
              </a>
            ) : null}
          </div>
          <button data-part="burger" type="button" aria-expanded={menuOpen} aria-controls="vibeui-navbar-030-menu" aria-label={menuOpen ? menuCloseLabel : menuOpenLabel} onClick={() => setMenuOpen((value) => !value)}>
            <i aria-hidden="true" />
            <i aria-hidden="true" />
            <i aria-hidden="true" />
          </button>
        </div>
        <nav data-part="menu" id="vibeui-navbar-030-menu" hidden={!menuOpen} aria-label={menuLabel} onClick={() => setMenuOpen(false)}>
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          {actionLabel ? <a data-cta="" href={actionHref}>{actionLabel}</a> : null}
        </nav>
        <i data-part="progress" aria-hidden="true" />
      </header>
    </>
  )
}

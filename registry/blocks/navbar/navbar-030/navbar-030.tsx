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
// снизу и лёгкое стекло. Острые углы, без теней — инженерная эстетика.
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
[data-vibeui-block="navbar-030"] [data-part="nav"] a{color:var(--vibeui-navbar-030-muted);text-decoration:none;font-weight:500;transition:color .2s}
[data-vibeui-block="navbar-030"] [data-part="nav"] a:hover{color:var(--vibeui-navbar-030-fg)}
[data-vibeui-block="navbar-030"] [data-part="right"]{margin-left:auto;display:flex;align-items:center;gap:.5rem}
[data-vibeui-block="navbar-030"] [data-part="stars"]{display:inline-flex;align-items:center;gap:.4rem;padding:.4rem .7rem;border-radius:6px;border:1px solid var(--vibeui-navbar-030-line);background:var(--vibeui-navbar-030-panel);color:inherit;text-decoration:none;font-family:var(--vibeui-navbar-030-mono);font-size:.78rem;font-variant-numeric:tabular-nums;transition:border-color .2s}
[data-vibeui-block="navbar-030"] [data-part="stars"]:hover{border-color:var(--vibeui-navbar-030-accent)}
[data-vibeui-block="navbar-030"] [data-part="stars"] svg{width:.9rem;height:.9rem;fill:var(--vibeui-navbar-030-accent)}
[data-vibeui-block="navbar-030"] [data-part="stars"] span{display:none;color:var(--vibeui-navbar-030-muted)}
[data-vibeui-block="navbar-030"] [data-part="action"]{display:inline-flex;align-items:center;padding:.5rem .9rem;border-radius:6px;background:var(--vibeui-navbar-030-accent);color:var(--vibeui-navbar-030-on-accent);text-decoration:none;font-weight:600;font-size:.85rem;white-space:nowrap;transition:filter .2s}
[data-vibeui-block="navbar-030"] [data-part="action"]:hover{filter:brightness(1.08)}
[data-vibeui-block="navbar-030"] a:focus-visible{outline:2px solid var(--vibeui-navbar-030-accent);outline-offset:2px}
@container (min-width: 40rem){[data-vibeui-block="navbar-030"] [data-part="stars"] span{display:inline}}
@container (min-width: 56rem){[data-vibeui-block="navbar-030"] [data-part="nav"]{display:flex}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-030"] *{transition:none!important}}`

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
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Navbar030Props) {
  const [scrolled, setScrolled] = useState(false)
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
          <nav data-part="nav" aria-label="Разделы">
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div data-part="right">
            <a data-part="stars" href={githubHref} aria-label={`${stars} ${starsLabel} на GitHub`}>
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
        </div>
      </header>
    </>
  )
}

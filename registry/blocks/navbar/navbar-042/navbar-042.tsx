"use client"

import { useEffect, useState, type CSSProperties } from "react"

export type Navbar042Link = {
  label: string
  href: string
}

export type Navbar042Props = {
  brand?: string
  brandHref?: string
  /** Чип версии рядом с лого: «v2.4». Пусто — не показывать. */
  version?: string
  /** Подпись лампочки статуса: «api · ok». Пусто — без лампочки. */
  status?: string
  statusHref?: string
  links?: readonly Navbar042Link[]
  docsLabel?: string
  docsHref?: string
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

// Шапка API-сервиса «терминал, но красивый»: моноширинное лого с чипом
// версии, лампочка статуса с пульсом («api · ok»), разделы, тихая ссылка
// «Docs» и кнопка «Получить ключ» с угловыми скобками, которые раздвигаются
// по наведению. При прокрутке шапка получает тонкую рамку снизу и стекло.
// На узком — бургер, меню выпадает списком.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-042"]){
--vibeui-navbar-042-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-042-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-042-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-042-on-accent:oklch(from var(--vibeui-navbar-042-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-042-muted:color-mix(in oklab,var(--vibeui-navbar-042-fg) 60%,var(--vibeui-navbar-042-bg));
--vibeui-navbar-042-line:color-mix(in oklab,var(--vibeui-navbar-042-fg) 12%,transparent);
--vibeui-navbar-042-panel:color-mix(in oklab,var(--vibeui-navbar-042-fg) 5%,transparent);
--vibeui-navbar-042-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-042-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-042"]{color-scheme:dark}
:where([data-vibeui-block="navbar-042"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-042"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-042"]{box-sizing:border-box;position:relative;z-index:50;font-family:var(--vibeui-navbar-042-display);color:var(--vibeui-navbar-042-fg);font-size:.9rem;line-height:1.4;border-bottom:1px solid transparent;transition:background .3s,border-color .3s}
[data-vibeui-block="navbar-042"][data-sticky="true"]{position:sticky;top:0}
[data-vibeui-block="navbar-042"][data-scrolled="true"]{background:color-mix(in oklab,var(--vibeui-navbar-042-bg) 82%,transparent);backdrop-filter:blur(14px);border-color:var(--vibeui-navbar-042-line)}
[data-vibeui-block="navbar-042"] *{box-sizing:border-box}
[data-vibeui-block="navbar-042"] [data-part="row"]{display:flex;align-items:center;gap:.8rem;height:3.8rem;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="navbar-042"] [data-part="brand"]{display:inline-flex;align-items:center;gap:.55rem;font-family:var(--vibeui-navbar-042-mono);font-weight:600;font-size:1rem;letter-spacing:-.02em;text-decoration:none;color:inherit;white-space:nowrap}
[data-vibeui-block="navbar-042"] [data-part="mark"]{display:grid;place-items:center;width:1.6rem;height:1.6rem;border-radius:.4rem;background:var(--vibeui-navbar-042-accent);color:var(--vibeui-navbar-042-on-accent)}
[data-vibeui-block="navbar-042"] [data-part="mark"] svg{width:1rem;height:1rem}
[data-vibeui-block="navbar-042"] [data-part="version"]{display:none;font-family:var(--vibeui-navbar-042-mono);font-size:.68rem;padding:.15rem .4rem;border-radius:.35rem;border:1px solid var(--vibeui-navbar-042-line);color:var(--vibeui-navbar-042-muted)}
[data-vibeui-block="navbar-042"] [data-part="status"]{display:none;align-items:center;gap:.45rem;margin-left:.6rem;padding:.3rem .6rem;border-radius:999px;border:1px solid var(--vibeui-navbar-042-line);font-family:var(--vibeui-navbar-042-mono);font-size:.7rem;color:var(--vibeui-navbar-042-muted);text-decoration:none;white-space:nowrap}
[data-vibeui-block="navbar-042"] [data-part="lamp"]{position:relative;width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-navbar-042-accent);box-shadow:0 0 8px var(--vibeui-navbar-042-accent)}
[data-vibeui-block="navbar-042"] [data-part="lamp"]::after{content:"";position:absolute;inset:-.25rem;border-radius:50%;border:1px solid var(--vibeui-navbar-042-accent);animation:vibeui-navbar-042-ping 2.2s ease-out infinite}
[data-vibeui-block="navbar-042"] [data-part="nav"]{display:none;gap:1.4rem;margin-left:1.4rem}
[data-vibeui-block="navbar-042"] [data-part="nav"] a{color:var(--vibeui-navbar-042-muted);text-decoration:none;font-weight:500;transition:color .2s}
[data-vibeui-block="navbar-042"] [data-part="nav"] a:hover{color:var(--vibeui-navbar-042-fg)}
[data-vibeui-block="navbar-042"] [data-part="right"]{margin-left:auto;display:flex;align-items:center;gap:.9rem}
[data-vibeui-block="navbar-042"] [data-part="docs"]{display:none;color:var(--vibeui-navbar-042-muted);text-decoration:none;font-family:var(--vibeui-navbar-042-mono);font-size:.82rem;transition:color .2s}
[data-vibeui-block="navbar-042"] [data-part="docs"]:hover{color:var(--vibeui-navbar-042-fg)}
[data-vibeui-block="navbar-042"] [data-part="action"]{display:inline-flex;align-items:center;gap:.35rem;height:2.3rem;padding:0 .9rem;border-radius:.55rem;background:var(--vibeui-navbar-042-accent);color:var(--vibeui-navbar-042-on-accent);text-decoration:none;font-family:var(--vibeui-navbar-042-mono);font-weight:600;font-size:.8rem;white-space:nowrap;transition:box-shadow .25s,transform .18s}
[data-vibeui-block="navbar-042"] [data-part="action"] i{display:none;font-style:normal;opacity:.7;transition:transform .25s}
[data-vibeui-block="navbar-042"] [data-part="action"]:hover{box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-navbar-042-accent) 22%,transparent)}
[data-vibeui-block="navbar-042"] [data-part="action"]:hover i:first-child{transform:translateX(-2px)}
[data-vibeui-block="navbar-042"] [data-part="action"]:hover i:last-child{transform:translateX(2px)}
[data-vibeui-block="navbar-042"] a:focus-visible,[data-vibeui-block="navbar-042"] button:focus-visible{outline:2px solid var(--vibeui-navbar-042-accent);outline-offset:2px}
[data-vibeui-block="navbar-042"] [data-part="burger"]{display:inline-flex;flex-direction:column;justify-content:center;gap:5px;flex-shrink:0;width:2.3rem;height:2.3rem;padding:0;border:1px solid var(--vibeui-navbar-042-line);border-radius:.55rem;background:transparent;color:inherit;cursor:pointer}
[data-vibeui-block="navbar-042"] [data-part="burger"] i{display:block;width:1rem;height:2px;margin:0 auto;background:currentColor;transition:transform .25s,opacity .2s}
[data-vibeui-block="navbar-042"] [data-part="burger"][aria-expanded="true"] i:nth-child(1){transform:translateY(7px) rotate(45deg)}
[data-vibeui-block="navbar-042"] [data-part="burger"][aria-expanded="true"] i:nth-child(2){opacity:0}
[data-vibeui-block="navbar-042"] [data-part="burger"][aria-expanded="true"] i:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
[data-vibeui-block="navbar-042"] [data-part="menu"]{display:grid;gap:.15rem;max-width:80rem;margin:0 auto;padding:.6rem 1.25rem 1.25rem;border-top:1px solid var(--vibeui-navbar-042-line);background:var(--vibeui-navbar-042-bg);animation:vibeui-navbar-042-menu .22s ease-out}
[data-vibeui-block="navbar-042"] [data-part="menu"][hidden]{display:none}
[data-vibeui-block="navbar-042"] [data-part="menu"] a{display:flex;align-items:center;gap:.6rem;padding:.75rem .7rem;border-radius:.5rem;color:var(--vibeui-navbar-042-fg);text-decoration:none;font-weight:600;font-size:1rem}
[data-vibeui-block="navbar-042"] [data-part="menu"] a::before{content:"//";font-family:var(--vibeui-navbar-042-mono);font-size:.75rem;color:var(--vibeui-navbar-042-accent)}
[data-vibeui-block="navbar-042"] [data-part="menu"] a:hover{background:var(--vibeui-navbar-042-panel)}
[data-vibeui-block="navbar-042"] [data-part="menu"] a[data-cta]{margin-top:.4rem;justify-content:center;background:var(--vibeui-navbar-042-accent);color:var(--vibeui-navbar-042-on-accent);font-family:var(--vibeui-navbar-042-mono)}
[data-vibeui-block="navbar-042"] [data-part="menu"] a[data-cta]::before{content:none}
@keyframes vibeui-navbar-042-ping{0%{transform:scale(.6);opacity:.9}100%{transform:scale(2.2);opacity:0}}
@keyframes vibeui-navbar-042-menu{from{opacity:0;transform:translateY(-6px)}}
@container (min-width: 40rem){[data-vibeui-block="navbar-042"] [data-part="docs"]{display:inline}[data-vibeui-block="navbar-042"] [data-part="status"]{display:inline-flex}[data-vibeui-block="navbar-042"] [data-part="version"]{display:inline}[data-vibeui-block="navbar-042"] [data-part="action"] i{display:inline}}
@container (min-width: 60rem){[data-vibeui-block="navbar-042"] [data-part="nav"]{display:flex}[data-vibeui-block="navbar-042"] [data-part="burger"],[data-vibeui-block="navbar-042"] [data-part="menu"]{display:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-042"] *{animation:none!important;transition:none!important}}`

/** Шапка API-сервиса с лампочкой статуса и кнопкой «Получить ключ». */
export function Navbar042({
  brand = "geokod",
  brandHref = "#top",
  version = "v2.4",
  status = "api · ok",
  statusHref = "#status",
  links = [
    { label: "Песочница", href: "#sandbox" },
    { label: "Эндпоинты", href: "#endpoints" },
    { label: "Цены", href: "#pricing" },
    { label: "Статус", href: "#status" },
    { label: "Changelog", href: "#changelog" },
  ],
  docsLabel = "docs",
  docsHref = "#docs",
  actionLabel = "Получить ключ",
  actionHref = "#key",
  sticky = true,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Navbar042Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-navbar-042-accent": accent } : null),
    ...(ink ? { "--vibeui-navbar-042-fg": ink } : null),
    ...(background ? { "--vibeui-navbar-042-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-042" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-042" data-tone={tone === "auto" ? undefined : tone} data-sticky={sticky} data-scrolled={scrolled} className={className} style={palette}>
        <div data-part="row">
          <a data-part="brand" href={brandHref}>
            <span data-part="mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s-6-5.2-6-11a6 6 0 0 1 12 0c0 5.8-6 11-6 11Z" />
                <circle cx="12" cy="10" r="2" />
              </svg>
            </span>
            {brand}
            {version ? <span data-part="version">{version}</span> : null}
          </a>
          {status ? (
            <a data-part="status" href={statusHref}>
              <i data-part="lamp" aria-hidden="true" />
              {status}
            </a>
          ) : null}
          <nav data-part="nav" aria-label="Разделы">
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div data-part="right">
            {docsLabel ? (
              <a data-part="docs" href={docsHref}>
                {docsLabel}
              </a>
            ) : null}
            {actionLabel ? (
              <a data-part="action" href={actionHref}>
                <i aria-hidden="true">{"<"}</i>
                {actionLabel}
                <i aria-hidden="true">{"/>"}</i>
              </a>
            ) : null}
            <button data-part="burger" type="button" aria-expanded={menuOpen} aria-controls="vibeui-navbar-042-menu" aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"} onClick={() => setMenuOpen((value) => !value)}>
              <i aria-hidden="true" />
              <i aria-hidden="true" />
              <i aria-hidden="true" />
            </button>
          </div>
        </div>
        <nav data-part="menu" id="vibeui-navbar-042-menu" hidden={!menuOpen} aria-label="Меню" onClick={() => setMenuOpen(false)}>
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          {docsLabel ? <a href={docsHref}>{docsLabel}</a> : null}
          {actionLabel ? <a data-cta="" href={actionHref}>{actionLabel}</a> : null}
        </nav>
      </header>
    </>
  )
}

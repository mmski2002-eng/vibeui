"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Navbar022Link = {
  label: string
  href: string
}

export type Navbar022Props = {
  brand?: string
  brandHref?: string
  /** Подпись рядом с логотипом: «курс · 6 недель». */
  caption?: string
  links?: readonly Navbar022Link[]
  /** Кнопка с ценой: «Записаться · 49 000 ₽». */
  actionLabel?: string
  actionPrice?: string
  actionHref?: string
  menuLabel?: string
  /** Полоска прогресса чтения под шапкой. */
  progress?: boolean
  sticky?: boolean
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Шапка лендинга курса: логотип-словомарка, ссылки, кнопка «Записаться» с
// ценой в капсуле. Под шапкой — полоска прогресса чтения страницы: ширина
// пишется в CSS-переменную из rAF на scroll, без ререндеров. На узком
// экране — кнопка «Меню» и список под шапкой.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-022"]){
--vibeui-navbar-022-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-022-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-022-muted:light-dark(#6b7280,#a3a3a3);
--vibeui-navbar-022-line:light-dark(#e5e7eb,#2e2e2e);
--vibeui-navbar-022-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-022-on-accent:oklch(from var(--vibeui-navbar-022-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-022-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-022-font:"Inter",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-022-progress:0;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-022"]{color-scheme:dark}
:where([data-vibeui-block="navbar-022"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-022"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-022"]{box-sizing:border-box;display:block;position:relative;z-index:40;background:color-mix(in oklab,var(--vibeui-navbar-022-bg) 88%,transparent);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:var(--vibeui-navbar-022-fg);font-family:var(--vibeui-navbar-022-font);font-size:.9375rem;line-height:1.5;border-bottom:1px solid var(--vibeui-navbar-022-line)}
[data-vibeui-block="navbar-022"] *{box-sizing:border-box}
[data-vibeui-block="navbar-022"][data-sticky="true"]{position:sticky;top:0}
[data-vibeui-block="navbar-022"] [data-part="bar"]{max-width:76rem;margin:0 auto;display:flex;align-items:center;gap:1.25rem;padding:.9rem 1.25rem}
[data-vibeui-block="navbar-022"] [data-part="brand"]{display:flex;align-items:baseline;gap:.6rem;flex:none;margin-right:auto;color:inherit;text-decoration:none}
[data-vibeui-block="navbar-022"] [data-part="name"]{font-family:var(--vibeui-navbar-022-display);font-size:1.1rem;font-weight:700;letter-spacing:-.01em}
[data-vibeui-block="navbar-022"] [data-part="name"]::before{content:"";display:inline-block;width:.6rem;height:.6rem;margin-right:.45rem;border-radius:.15rem;background:var(--vibeui-navbar-022-accent);transform:rotate(45deg) translateY(-.05rem)}
[data-vibeui-block="navbar-022"] [data-part="caption"]{font-size:.75rem;color:var(--vibeui-navbar-022-muted);white-space:nowrap}
[data-vibeui-block="navbar-022"] [data-part="nav"]{display:none;align-items:center;gap:1.4rem;margin:0;padding:0;list-style:none;white-space:nowrap}
[data-vibeui-block="navbar-022"] [data-part="link"]{color:var(--vibeui-navbar-022-muted);text-decoration:none;font-size:.875rem;font-weight:500;transition:color .2s}
[data-vibeui-block="navbar-022"] [data-part="link"]:hover{color:var(--vibeui-navbar-022-fg)}
[data-vibeui-block="navbar-022"] [data-part="action"]{display:none;align-items:center;gap:.6rem;height:2.6rem;padding:0 .4rem 0 1.1rem;border-radius:999px;background:var(--vibeui-navbar-022-accent);color:var(--vibeui-navbar-022-on-accent);font-weight:600;font-size:.85rem;text-decoration:none;white-space:nowrap;transition:transform .2s,box-shadow .3s}
[data-vibeui-block="navbar-022"] [data-part="action"]:hover{transform:translateY(-1px);box-shadow:0 12px 24px -12px var(--vibeui-navbar-022-accent)}
[data-vibeui-block="navbar-022"] [data-part="price"]{display:inline-flex;align-items:center;height:1.9rem;padding:0 .7rem;border-radius:999px;background:rgb(255 255 255 / .18);font-variant-numeric:tabular-nums}
[data-vibeui-block="navbar-022"] [data-part="toggle"]{display:inline-flex;align-items:center;padding:.5rem .9rem;border:1px solid var(--vibeui-navbar-022-line);border-radius:999px;background:transparent;color:inherit;font:inherit;font-size:.85rem;cursor:pointer}
[data-vibeui-block="navbar-022"] [data-part="sheet"]{display:grid;gap:.9rem;padding:1rem 1.25rem 1.4rem;border-top:1px solid var(--vibeui-navbar-022-line)}
[data-vibeui-block="navbar-022"] [data-part="sheet"] [data-part="link"],[data-vibeui-block="navbar-022"] [data-part="sheet"] [data-part="action"]{display:inline-flex;font-size:1rem;justify-self:start}
[data-vibeui-block="navbar-022"] [data-part="progress"]{position:absolute;left:0;bottom:-1px;height:2px;width:100%;background:var(--vibeui-navbar-022-accent);transform:scaleX(var(--vibeui-navbar-022-progress));transform-origin:left;transition:transform .1s linear}
[data-vibeui-block="navbar-022"] :focus-visible{outline:2px solid var(--vibeui-navbar-022-accent);outline-offset:3px}
@container (min-width: 60rem){
[data-vibeui-block="navbar-022"] [data-part="bar"]{padding:.9rem 2rem}
[data-vibeui-block="navbar-022"] [data-part="nav"],[data-vibeui-block="navbar-022"] [data-part="action"]{display:flex}
[data-vibeui-block="navbar-022"] [data-part="toggle"],[data-vibeui-block="navbar-022"] [data-part="sheet"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-022"] *{transition:none!important}}`

const DEFAULT_LINKS: Navbar022Link[] = [
  { label: "Для кого", href: "#who" },
  { label: "Программа", href: "#program" },
  { label: "Результаты", href: "#results" },
  { label: "Автор", href: "#author" },
  { label: "Стоимость", href: "#pricing" },
]

/** Шапка лендинга курса: словомарка, ссылки, кнопка с ценой и полоска прогресса чтения. */
export function Navbar022({
  brand = "Figma Pro",
  brandHref = "#",
  caption = "курс · 6 недель",
  links = DEFAULT_LINKS,
  actionLabel = "Записаться",
  actionPrice = "49 000 ₽",
  actionHref = "#pricing",
  menuLabel = "Меню",
  progress = true,
  sticky = true,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Navbar022Props) {
  const root = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const palette = {
    ...(accent ? { "--vibeui-navbar-022-accent": accent } : null),
    ...(ink ? { "--vibeui-navbar-022-fg": ink } : null),
    ...(background ? { "--vibeui-navbar-022-bg": background } : null),
    ...style,
  } as CSSProperties

  useEffect(() => {
    if (!progress) return
    const element = root.current
    if (!element) return
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      element.style.setProperty("--vibeui-navbar-022-progress", String(max > 0 ? Math.min(1, window.scrollY / max) : 0))
    }
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      window.cancelAnimationFrame(raf)
    }
  }, [progress])

  const action = actionLabel ? (
    <a data-part="action" href={actionHref}>
      {actionLabel}
      {actionPrice ? <span data-part="price">{actionPrice}</span> : null}
    </a>
  ) : null

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-022" precedence="medium">
        {STYLES}
      </style>
      <header ref={root} data-vibeui-block="navbar-022" data-tone={tone === "auto" ? undefined : tone} data-sticky={sticky} className={className} style={palette}>
        <div data-part="bar">
          <a data-part="brand" href={brandHref}>
            <span data-part="name">{brand}</span>
            {caption ? <span data-part="caption">{caption}</span> : null}
          </a>
          <nav aria-label="Разделы">
            <ul data-part="nav">
              {links.map((link) => (
                <li key={link.label + link.href}>
                  <a data-part="link" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {action}
          <button type="button" data-part="toggle" aria-expanded={open} aria-controls="vibeui-navbar-022-sheet" onClick={() => setOpen((value) => !value)}>
            {menuLabel}
          </button>
        </div>
        {open ? (
          <div data-part="sheet" id="vibeui-navbar-022-sheet">
            {links.map((link) => (
              <a key={link.label + link.href} data-part="link" href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            {action}
          </div>
        ) : null}
        {progress ? <span data-part="progress" aria-hidden="true" /> : null}
      </header>
    </>
  )
}

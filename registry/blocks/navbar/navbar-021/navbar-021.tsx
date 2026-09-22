"use client"

import { useEffect, useState, type CSSProperties } from "react"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Navbar021Link = {
  label: string
  href: string
}

export type Navbar021Props = {
  brand?: string
  brandHref?: string
  /** Подпись под именем: «северная кухня · Петроградская». */
  caption?: string
  links?: readonly Navbar021Link[]
  /** Строка часов: «сегодня до 23:00». */
  hours?: string
  phone?: string
  phoneHref?: string
  actionLabel?: string
  actionHref?: string
  menuLabel?: string
  /** Прозрачная поверх первого экрана, при скролле — тёмная и ниже. */
  overlay?: boolean
  sticky?: boolean
  /** aria навигации. */
  navLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Шапка ресторана: словомарка серифом, ссылки, часы «сегодня до 23:00»,
// телефон и кнопка «Забронировать». В режиме overlay лежит поверх первого
// экрана прозрачной, после 40px скролла темнеет, сжимается и получает
// линию снизу. На узком экране — кнопка «Меню» и список под шапкой.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-021"]){
--vibeui-navbar-021-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-021-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-021-muted:light-dark(color-mix(in oklab,var(--vibeui-navbar-021-fg) 60%,var(--vibeui-navbar-021-bg)),color-mix(in oklab,var(--vibeui-navbar-021-fg) 58%,var(--vibeui-navbar-021-bg)));
--vibeui-navbar-021-line:color-mix(in oklab,var(--vibeui-navbar-021-fg) 14%,var(--vibeui-navbar-021-bg));
--vibeui-navbar-021-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-021-glow:0 0 24px color-mix(in oklab,var(--vibeui-navbar-021-accent) 70%,transparent),0 0 70px color-mix(in oklab,var(--vibeui-navbar-021-accent) 35%,transparent);
--vibeui-navbar-021-accent-ink:light-dark(var(--vibeui-navbar-021-accent),color-mix(in oklab,var(--vibeui-navbar-021-accent) 55%,var(--vibeui-navbar-021-fg)));
--vibeui-navbar-021-on-accent:oklch(from var(--vibeui-navbar-021-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-021-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-navbar-021-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-021"]{color-scheme:dark}
:where([data-vibeui-block="navbar-021"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-021"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-021"]{box-sizing:border-box;display:block;position:relative;z-index:40;color:var(--vibeui-navbar-021-fg);font-family:var(--vibeui-navbar-021-font);font-size:.9375rem;line-height:1.5;background:color-mix(in oklab,var(--vibeui-navbar-021-bg) 92%,transparent);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--vibeui-navbar-021-line);transition:background .4s,border-color .4s}
[data-vibeui-block="navbar-021"] *{box-sizing:border-box}
[data-vibeui-block="navbar-021"] [data-part="sheet"] [data-part="action"]{justify-self:start}
[data-vibeui-block="navbar-021"] [data-part="action"]{display:none}
[data-vibeui-block="navbar-021"][data-sticky="true"]{position:sticky;top:0}
[data-vibeui-block="navbar-021"][data-overlay="true"]{position:fixed;top:0;left:0;right:0;color:#f2ebe0;color-scheme:dark}
[data-vibeui-block="navbar-021"][data-overlay="true"][data-scrolled="false"]{background:transparent;border-color:transparent;backdrop-filter:none;-webkit-backdrop-filter:none}
[data-vibeui-block="navbar-021"] [data-part="bar"]{max-width:80rem;margin:0 auto;display:flex;align-items:center;gap:1.25rem;padding:1.1rem 1.25rem;transition:padding .35s}
[data-vibeui-block="navbar-021"][data-overlay="true"][data-scrolled="false"] [data-part="bar"]{padding:1.6rem 1.25rem}
[data-vibeui-block="navbar-021"] [data-part="brand"]{display:flex;flex-direction:column;flex:none;margin-right:auto;color:inherit;text-decoration:none;min-width:0}
[data-vibeui-block="navbar-021"] [data-part="name"]{font-family:var(--vibeui-navbar-021-display);font-size:1.6rem;font-weight:500;line-height:1;letter-spacing:.04em;text-transform:uppercase}
[data-vibeui-block="navbar-021"] [data-part="caption"]{margin-top:.3rem;font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-navbar-021-muted);white-space:nowrap}
[data-vibeui-block="navbar-021"][data-overlay="true"] [data-part="caption"]{color:rgb(242 235 224 / .7)}
[data-vibeui-block="navbar-021"] [data-part="nav"]{display:none;align-items:center;gap:1.5rem;margin:0;padding:0;list-style:none;white-space:nowrap}
[data-vibeui-block="navbar-021"] [data-part="link"]{position:relative;color:inherit;text-decoration:none;font-size:.85rem;font-weight:500;letter-spacing:.04em;text-transform:uppercase;padding:.25rem 0}
[data-vibeui-block="navbar-021"] [data-part="link"]::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--vibeui-navbar-021-accent);transform:scaleX(0);transform-origin:left;transition:transform .3s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="navbar-021"] [data-part="link"]:hover::after{transform:scaleX(1)}
[data-vibeui-block="navbar-021"] [data-part="hours"]{display:none;align-items:center;gap:.5rem;font-size:.8rem;color:var(--vibeui-navbar-021-muted);white-space:nowrap}
[data-vibeui-block="navbar-021"][data-overlay="true"] [data-part="hours"]{color:rgb(242 235 224 / .75)}
[data-vibeui-block="navbar-021"] [data-part="hours"]::before{content:"";width:.45rem;height:.45rem;border-radius:50%;background:#7fb069;box-shadow:0 0 0 3px rgb(127 176 105 / .25),0 0 12px rgb(127 176 105 / .7)}
[data-vibeui-block="navbar-021"] [data-part="phone"]{display:none;color:inherit;text-decoration:none;font-family:var(--vibeui-navbar-021-display);font-size:1.15rem;white-space:nowrap}
[data-vibeui-block="navbar-021"] [data-part="toggle"]{display:inline-flex;align-items:center;gap:.5rem;padding:.55rem .9rem;border:1px solid currentColor;border-radius:999px;background:transparent;color:inherit;font:inherit;font-size:.8rem;letter-spacing:.06em;text-transform:uppercase;cursor:pointer}
[data-vibeui-block="navbar-021"] [data-part="sheet"]{display:grid;gap:1rem;padding:1rem 1.25rem 1.5rem;border-top:1px solid var(--vibeui-navbar-021-line);background:var(--vibeui-navbar-021-bg);color:var(--vibeui-navbar-021-fg)}
[data-vibeui-block="navbar-021"] [data-part="sheet"] [data-part="link"],[data-vibeui-block="navbar-021"] [data-part="sheet"] [data-part="phone"],[data-vibeui-block="navbar-021"] [data-part="sheet"] [data-part="hours"]{display:inline-flex;font-size:1rem;justify-self:start}
[data-vibeui-block="navbar-021"] :focus-visible{outline:2px solid var(--vibeui-navbar-021-accent);outline-offset:3px}
@container (min-width: 64rem){
[data-vibeui-block="navbar-021"] [data-part="bar"]{padding:1.1rem 2rem}
[data-vibeui-block="navbar-021"][data-overlay="true"][data-scrolled="false"] [data-part="bar"]{padding:1.75rem 2rem}
[data-vibeui-block="navbar-021"] [data-part="nav"]{display:flex}
[data-vibeui-block="navbar-021"] [data-part="toggle"],[data-vibeui-block="navbar-021"] [data-part="sheet"]{display:none}
}
@container (min-width: 76rem){[data-vibeui-block="navbar-021"] [data-part="hours"],[data-vibeui-block="navbar-021"] [data-part="phone"]{display:inline-flex}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-021"] *{transition:none!important}}`

const DEFAULT_LINKS: Navbar021Link[] = [
  { label: "Меню", href: "#menu" },
  { label: "Шеф", href: "#chef" },
  { label: "Зал", href: "#hall" },
  { label: "События", href: "#events" },
  { label: "Контакты", href: "#map" },
]

/** Шапка ресторана: словомарка, ссылки, часы, телефон и кнопка брони; прозрачная поверх первого экрана. */
export function Navbar021({
  brand = "Сойка",
  brandHref = "#",
  caption = "Северная кухня · Петроградская",
  links = DEFAULT_LINKS,
  hours = "Сегодня до 23:00",
  phone = "+7 812 305-00-40",
  phoneHref = "tel:+78123050040",
  actionLabel = "Забронировать",
  actionHref = "#book",
  menuLabel = "Меню",
  overlay = false,
  sticky = true,
  navLabel = "Разделы",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Navbar021Props) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const palette = {
    ...(accent ? { "--vibeui-navbar-021-accent": accent } : null),
    ...(ink ? { "--vibeui-navbar-021-fg": ink } : null),
    ...(background ? { "--vibeui-navbar-021-bg": background } : null),
    ...style,
  } as CSSProperties

  useEffect(() => {
    if (!overlay) return
    const update = () => setScrolled(window.scrollY > 40)
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [overlay])

  const items = (
    <>
      {links.map((link) => (
        <a key={link.label + link.href} data-part="link" href={link.href} onClick={() => setOpen(false)}>
          {link.label}
        </a>
      ))}
    </>
  )

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-021" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-021"
        data-tone={tone === "auto" ? undefined : tone}
        data-sticky={sticky && !overlay}
        data-overlay={overlay}
        data-scrolled={overlay ? scrolled || open : undefined}
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <a data-part="brand" href={brandHref}>
            <span data-part="name">{brand}</span>
            {caption ? <span data-part="caption">{caption}</span> : null}
          </a>
          <nav aria-label={navLabel}>
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
          {hours ? <span data-part="hours">{hours}</span> : null}
          {phone ? (
            <a data-part="phone" href={phoneHref}>
              {phone}
            </a>
          ) : null}
          {actionLabel ? (
            <Button016
              data-part="action"
              label={actionLabel}
              href={actionHref}
              external={false}
              size="sm"
              tone="accent"
              accent={accent}
            />
          ) : null}
          <button type="button" data-part="toggle" aria-expanded={open} aria-controls="vibeui-navbar-021-sheet" onClick={() => setOpen((value) => !value)}>
            {menuLabel}
          </button>
        </div>
        {open ? (
          <div data-part="sheet" id="vibeui-navbar-021-sheet">
            {items}
            {hours ? <span data-part="hours">{hours}</span> : null}
            {phone ? (
              <a data-part="phone" href={phoneHref}>
                {phone}
              </a>
            ) : null}
            {actionLabel ? (
              <Button016
                data-part="action"
                label={actionLabel}
                href={actionHref}
                external={false}
                size="sm"
                tone="accent"
                accent={accent}
              />
            ) : null}
          </div>
        ) : null}
      </header>
    </>
  )
}

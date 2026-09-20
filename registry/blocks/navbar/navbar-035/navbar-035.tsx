"use client"

import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react"

export type Navbar035Link = {
  label: string
  href: string
}

export type Navbar035Props = {
  brand?: string
  caption?: string
  brandHref?: string
  links?: readonly Navbar035Link[]
  /** Часы работы в часах: статус «открыто / закрыто» считается по времени посетителя. */
  opensAt?: number
  closesAt?: number
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
  /** Статус в чипе: открыто, скоро закроемся, закрыто. */
  openLine?: string
  closingLine?: string
  closedLine?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Шапка ветклиники: лапа в лого виляет по наведению, рядом чип с часами,
// который сам знает, открыто ли сейчас — «открыто до 21:00», «закроемся
// через 40 мин» или «откроемся в 9:00» по времени посетителя (на сервере
// рендерится нейтральное «9:00–21:00»). Телефон, кнопка записи, бургер на
// узком, стекло при прокрутке.
const FONTS = "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Golos+Text:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-035"]){
--vibeui-navbar-035-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-035-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-035-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-035-on-accent:oklch(from var(--vibeui-navbar-035-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-035-muted:color-mix(in oklab,var(--vibeui-navbar-035-fg) 60%,var(--vibeui-navbar-035-bg));
--vibeui-navbar-035-line:color-mix(in oklab,var(--vibeui-navbar-035-fg) 12%,transparent);
--vibeui-navbar-035-open:#4f8f45;
--vibeui-navbar-035-soon:#d99a1e;
--vibeui-navbar-035-display:"Nunito",ui-rounded,ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-035-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-035"]{color-scheme:dark}
:where([data-vibeui-block="navbar-035"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-035"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-035"]{box-sizing:border-box;position:relative;z-index:50;font-family:var(--vibeui-navbar-035-font);color:var(--vibeui-navbar-035-fg);background:var(--vibeui-navbar-035-bg);font-size:.92rem;line-height:1.4;transition:background .3s,box-shadow .3s}
[data-vibeui-block="navbar-035"][data-sticky="true"]{position:sticky;top:0}
[data-vibeui-block="navbar-035"][data-scrolled="true"]{background:color-mix(in oklab,var(--vibeui-navbar-035-bg) 82%,transparent);backdrop-filter:blur(14px);box-shadow:0 1px 0 var(--vibeui-navbar-035-line)}
[data-vibeui-block="navbar-035"] *{box-sizing:border-box}
[data-vibeui-block="navbar-035"] [data-part="row"]{display:flex;align-items:center;gap:.7rem;height:4.25rem;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="navbar-035"] [data-part="brand"]{display:inline-flex;align-items:center;gap:.55rem;text-decoration:none;color:inherit;min-width:0}
[data-vibeui-block="navbar-035"] [data-part="paw"]{flex-shrink:0;width:2.1rem;height:2.1rem;padding:.4rem;border-radius:.8rem;background:var(--vibeui-navbar-035-accent);color:var(--vibeui-navbar-035-on-accent);transform:rotate(-12deg);transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
[data-vibeui-block="navbar-035"] [data-part="brand"]:hover [data-part="paw"]{animation:vibeui-navbar-035-wag .7s ease-in-out}
[data-vibeui-block="navbar-035"] [data-part="name"]{display:grid;line-height:1.05}
[data-vibeui-block="navbar-035"] [data-part="name"] b{font-family:var(--vibeui-navbar-035-display);font-weight:900;font-size:1.3rem;letter-spacing:-.02em}
[data-vibeui-block="navbar-035"] [data-part="name"] small{font-size:.68rem;color:var(--vibeui-navbar-035-muted);white-space:nowrap}
[data-vibeui-block="navbar-035"] [data-part="nav"]{display:none;gap:1.2rem;margin-left:1rem}
[data-vibeui-block="navbar-035"] [data-part="nav"] a{position:relative;color:var(--vibeui-navbar-035-muted);text-decoration:none;font-weight:500;padding:.3rem 0;transition:color .2s}
[data-vibeui-block="navbar-035"] [data-part="nav"] a::after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;border-radius:2px;background:var(--vibeui-navbar-035-accent);transform:scaleX(0);transform-origin:left;transition:transform .25s ease-out}
[data-vibeui-block="navbar-035"] [data-part="nav"] a:hover{color:var(--vibeui-navbar-035-fg)}
[data-vibeui-block="navbar-035"] [data-part="nav"] a:hover::after{transform:scaleX(1)}
[data-vibeui-block="navbar-035"] [data-part="right"]{margin-left:auto;display:flex;align-items:center;gap:.6rem}
[data-vibeui-block="navbar-035"] [data-part="hours"]{display:none;align-items:center;gap:.45rem;padding:.4rem .75rem;border-radius:999px;border:1px solid var(--vibeui-navbar-035-line);font-size:.78rem;font-weight:500;color:var(--vibeui-navbar-035-muted);white-space:nowrap}
[data-vibeui-block="navbar-035"] [data-part="hours"] i{position:relative;width:.55rem;height:.55rem;border-radius:50%;background:var(--vibeui-navbar-035-muted);flex-shrink:0}
[data-vibeui-block="navbar-035"] [data-part="hours"][data-state="open"]{color:var(--vibeui-navbar-035-fg)}
[data-vibeui-block="navbar-035"] [data-part="hours"][data-state="open"] i{background:var(--vibeui-navbar-035-open)}
[data-vibeui-block="navbar-035"] [data-part="hours"][data-state="soon"] i{background:var(--vibeui-navbar-035-soon)}
[data-vibeui-block="navbar-035"] [data-part="hours"][data-state="open"] i::after,[data-vibeui-block="navbar-035"] [data-part="hours"][data-state="soon"] i::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:2px solid currentColor;color:inherit;opacity:0;animation:vibeui-navbar-035-pulse 2.2s ease-out infinite}
[data-vibeui-block="navbar-035"] [data-part="hours"][data-state="open"] i::after{color:var(--vibeui-navbar-035-open)}
[data-vibeui-block="navbar-035"] [data-part="hours"][data-state="soon"] i::after{color:var(--vibeui-navbar-035-soon)}
[data-vibeui-block="navbar-035"] [data-part="phone"]{display:none;align-items:center;gap:.4rem;color:var(--vibeui-navbar-035-fg);text-decoration:none;font-family:var(--vibeui-navbar-035-display);font-weight:800;font-size:.95rem;white-space:nowrap;transition:color .2s}
[data-vibeui-block="navbar-035"] [data-part="phone"] svg{width:1rem;height:1rem;color:var(--vibeui-navbar-035-accent)}
[data-vibeui-block="navbar-035"] [data-part="phone"]:hover{color:var(--vibeui-navbar-035-accent)}
[data-vibeui-block="navbar-035"] [data-part="action"]{display:inline-flex;align-items:center;padding:.65rem 1.1rem;border-radius:999px;background:var(--vibeui-navbar-035-accent);color:var(--vibeui-navbar-035-on-accent);text-decoration:none;font-family:var(--vibeui-navbar-035-display);font-weight:800;font-size:.9rem;white-space:nowrap;transition:transform .18s cubic-bezier(.34,1.56,.64,1),box-shadow .2s}
[data-vibeui-block="navbar-035"] [data-part="action"]:hover{transform:translateY(-2px) rotate(-1.5deg);box-shadow:0 10px 24px -10px var(--vibeui-navbar-035-accent)}
[data-vibeui-block="navbar-035"] a:focus-visible,[data-vibeui-block="navbar-035"] button:focus-visible{outline:2px solid var(--vibeui-navbar-035-accent);outline-offset:2px}
[data-vibeui-block="navbar-035"] [data-part="burger"]{display:inline-flex;flex-direction:column;justify-content:center;gap:5px;flex-shrink:0;width:2.6rem;height:2.6rem;padding:0;border:1px solid var(--vibeui-navbar-035-line);border-radius:999px;background:transparent;color:inherit;cursor:pointer}
[data-vibeui-block="navbar-035"] [data-part="burger"] i{display:block;width:1rem;height:2px;margin:0 auto;background:currentColor;border-radius:2px;transition:transform .25s,opacity .2s}
[data-vibeui-block="navbar-035"] [data-part="burger"][aria-expanded="true"] i:nth-child(1){transform:translateY(7px) rotate(45deg)}
[data-vibeui-block="navbar-035"] [data-part="burger"][aria-expanded="true"] i:nth-child(2){opacity:0}
[data-vibeui-block="navbar-035"] [data-part="burger"][aria-expanded="true"] i:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
[data-vibeui-block="navbar-035"] [data-part="menu"]{display:grid;gap:.2rem;max-width:80rem;margin:0 auto;padding:.6rem 1.25rem 1.25rem;border-top:1px solid var(--vibeui-navbar-035-line);animation:vibeui-navbar-035-menu .22s ease-out}
[data-vibeui-block="navbar-035"] [data-part="menu"][hidden]{display:none}
[data-vibeui-block="navbar-035"] [data-part="menu"] a{padding:.8rem .7rem;border-radius:.8rem;color:var(--vibeui-navbar-035-fg);text-decoration:none;font-weight:600;font-size:1.05rem}
[data-vibeui-block="navbar-035"] [data-part="menu"] a:hover{background:color-mix(in oklab,var(--vibeui-navbar-035-fg) 6%,transparent)}
[data-vibeui-block="navbar-035"] [data-part="menu"] [data-part="hours"]{display:inline-flex;justify-self:start;margin:.4rem .7rem 0}
[data-vibeui-block="navbar-035"] [data-part="menu"] a[data-cta]{margin-top:.4rem;text-align:center;background:var(--vibeui-navbar-035-accent);color:var(--vibeui-navbar-035-on-accent);font-family:var(--vibeui-navbar-035-display);font-weight:800}
@keyframes vibeui-navbar-035-wag{0%,100%{transform:rotate(-12deg)}25%{transform:rotate(14deg) scale(1.08)}50%{transform:rotate(-18deg)}75%{transform:rotate(8deg)}}
@keyframes vibeui-navbar-035-pulse{0%{transform:scale(.6);opacity:.8}100%{transform:scale(1.9);opacity:0}}
@keyframes vibeui-navbar-035-menu{from{opacity:0;transform:translateY(-6px)}}
@container (min-width: 36rem){[data-vibeui-block="navbar-035"] [data-part="row"] [data-part="phone"]{display:inline-flex}}
@container (min-width: 48rem){[data-vibeui-block="navbar-035"] [data-part="row"] [data-part="hours"]{display:inline-flex}}
@container (min-width: 60rem){[data-vibeui-block="navbar-035"] [data-part="nav"]{display:flex}[data-vibeui-block="navbar-035"] [data-part="burger"],[data-vibeui-block="navbar-035"] [data-part="menu"]{display:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-035"] *{animation:none!important;transition:none!important}}`

function subscribeMinute(callback: () => void) {
  const id = window.setInterval(callback, 60_000)
  return () => window.clearInterval(id)
}

function minutesNow() {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

function pad(hours: number) {
  return `${hours}:00`
}

function PawIcon() {
  return (
    <svg data-part="paw" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <ellipse cx="7" cy="8.2" rx="2.2" ry="2.9" />
      <ellipse cx="17" cy="8.2" rx="2.2" ry="2.9" />
      <ellipse cx="3.4" cy="13.2" rx="1.9" ry="2.4" />
      <ellipse cx="20.6" cy="13.2" rx="1.9" ry="2.4" />
      <path d="M12 11.3c3.4 0 6.2 2.7 6.2 5.8 0 2-1.6 3.4-3.6 3.4-1 0-1.7-.5-2.6-.5s-1.6.5-2.6.5c-2 0-3.6-1.4-3.6-3.4 0-3.1 2.8-5.8 6.2-5.8Z" />
    </svg>
  )
}

/** Шапка ветклиники с живым статусом «открыто / закрыто». */
export function Navbar035({
  brand = "Лапа",
  caption = "ветклиника · груминг",
  brandHref = "#top",
  links = [
    { label: "Услуги", href: "#services" },
    { label: "Симптомы", href: "#symptoms" },
    { label: "Врачи", href: "#doctors" },
    { label: "Груминг", href: "#grooming" },
    { label: "Контакты", href: "#contacts" },
  ],
  opensAt = 9,
  closesAt = 21,
  phone = "+7 495 120-24-24",
  phoneHref = "tel:+74951202424",
  actionLabel = "Записаться",
  actionHref = "#contacts",
  sticky = true,
  navLabel = "Разделы",
  menuLabel = "Меню",
  menuOpenLabel = "Открыть меню",
  menuCloseLabel = "Закрыть меню",
  openLine = "Открыто до {time}",
  closingLine = "Закроемся через {n} мин",
  closedLine = "Закрыто · откроемся в {time}",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Navbar035Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const minutes = useSyncExternalStore(subscribeMinute, minutesNow, () => null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  let state: "unknown" | "open" | "soon" | "closed" = "unknown"
  let status = `${pad(opensAt)}–${pad(closesAt)}`
  if (minutes !== null) {
    const left = closesAt * 60 - minutes
    if (minutes >= opensAt * 60 && left > 60) {
      state = "open"
      status = openLine.replace("{time}", pad(closesAt))
    } else if (minutes >= opensAt * 60 && left > 0) {
      state = "soon"
      status = closingLine.replace("{n}", String(left))
    } else {
      state = "closed"
      status = closedLine.replace("{time}", pad(opensAt))
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-navbar-035-accent": accent } : null),
    ...(ink ? { "--vibeui-navbar-035-fg": ink } : null),
    ...(background ? { "--vibeui-navbar-035-bg": background } : null),
    ...style,
  } as CSSProperties

  const hours = (
    <span data-part="hours" data-state={state}>
      <i aria-hidden="true" />
      {status}
    </span>
  )

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-035" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-035" data-tone={tone === "auto" ? undefined : tone} data-sticky={sticky} data-scrolled={scrolled} className={className} style={palette}>
        <div data-part="row">
          <a data-part="brand" href={brandHref}>
            <PawIcon />
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
            {hours}
            {phone ? (
              <a data-part="phone" href={phoneHref}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
                </svg>
                {phone}
              </a>
            ) : null}
            {actionLabel ? (
              <a data-part="action" href={actionHref}>
                {actionLabel}
              </a>
            ) : null}
            <button data-part="burger" type="button" aria-expanded={menuOpen} aria-controls="vibeui-navbar-035-menu" aria-label={menuOpen ? menuCloseLabel : menuOpenLabel} onClick={() => setMenuOpen((value) => !value)}>
              <i aria-hidden="true" />
              <i aria-hidden="true" />
              <i aria-hidden="true" />
            </button>
          </div>
        </div>
        <nav data-part="menu" id="vibeui-navbar-035-menu" hidden={!menuOpen} aria-label={menuLabel} onClick={() => setMenuOpen(false)}>
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          {phone ? <a href={phoneHref}>{phone}</a> : null}
          {hours}
          {actionLabel ? (
            <a data-cta="" href={actionHref}>
              {actionLabel}
            </a>
          ) : null}
        </nav>
      </header>
    </>
  )
}

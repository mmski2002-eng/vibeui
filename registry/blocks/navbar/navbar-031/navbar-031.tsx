"use client"

import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react"

export type Navbar031Link = {
  label: string
  href: string
}

export type Navbar031Props = {
  name?: string
  nameHref?: string
  /** Статус: «открыт к проектам с октября». Пусто — без чипа. */
  status?: string
  available?: boolean
  /** Город и часовой пояс IANA для живых часов. */
  city?: string
  timeZone?: string
  links?: readonly Navbar031Link[]
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

// Шапка личного сайта: имя, чип доступности с зелёной или серой точкой,
// живые часы города («Тбилиси · 14:02», tick раз в полминуты через
// useSyncExternalStore, на сервере — без времени), ссылки и кнопка
// «Написать». Липкая, при прокрутке — тонкая линия и стекло.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;800&family=Golos+Text:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-031"]){
--vibeui-navbar-031-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-031-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-031-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-031-on-accent:oklch(from var(--vibeui-navbar-031-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-031-muted:color-mix(in oklab,var(--vibeui-navbar-031-fg) 60%,var(--vibeui-navbar-031-bg));
--vibeui-navbar-031-line:color-mix(in oklab,var(--vibeui-navbar-031-fg) 12%,transparent);
--vibeui-navbar-031-ok:#2fb35a;
--vibeui-navbar-031-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-031-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-031-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-031"]{color-scheme:dark}
:where([data-vibeui-block="navbar-031"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-031"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-031"]{box-sizing:border-box;position:relative;z-index:50;font-family:var(--vibeui-navbar-031-font);color:var(--vibeui-navbar-031-fg);font-size:.92rem;line-height:1.4;border-bottom:1px solid transparent;transition:border-color .3s,background .3s}
[data-vibeui-block="navbar-031"][data-sticky="true"]{position:sticky;top:0}
[data-vibeui-block="navbar-031"][data-scrolled="true"]{border-color:var(--vibeui-navbar-031-line);background:color-mix(in oklab,var(--vibeui-navbar-031-bg) 85%,transparent);backdrop-filter:blur(12px)}
[data-vibeui-block="navbar-031"] *{box-sizing:border-box}
[data-vibeui-block="navbar-031"] [data-part="row"]{display:flex;align-items:center;gap:.6rem;height:4rem;max-width:80rem;margin:0 auto;padding:0 1rem;min-width:0}
[data-vibeui-block="navbar-031"] [data-part="name"]{font-family:var(--vibeui-navbar-031-display);font-weight:800;font-size:1.1rem;letter-spacing:-.03em;text-decoration:none;color:inherit;white-space:nowrap}
[data-vibeui-block="navbar-031"] [data-part="status"]{display:none;align-items:center;gap:.45rem;padding:.35rem .7rem;border-radius:999px;border:1px solid var(--vibeui-navbar-031-line);font-family:var(--vibeui-navbar-031-mono);font-size:.7rem;color:var(--vibeui-navbar-031-muted);white-space:nowrap}
[data-vibeui-block="navbar-031"] [data-part="status"] i{width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-navbar-031-ok);box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-navbar-031-ok) 25%,transparent);animation:vibeui-navbar-031-pulse 2.4s ease-in-out infinite}
[data-vibeui-block="navbar-031"] [data-part="status"][data-on="false"] i{background:var(--vibeui-navbar-031-muted);box-shadow:none}
[data-vibeui-block="navbar-031"] [data-part="clock"]{margin-left:auto;font-family:var(--vibeui-navbar-031-mono);font-size:.72rem;color:var(--vibeui-navbar-031-muted);font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="navbar-031"] [data-part="clock"] b{font-weight:500;color:var(--vibeui-navbar-031-fg)}
[data-vibeui-block="navbar-031"] [data-part="nav"]{display:none;gap:1.2rem}
[data-vibeui-block="navbar-031"] [data-part="nav"] a{position:relative;padding:.2rem 0;color:inherit;text-decoration:none;font-weight:500;opacity:.8;transition:opacity .2s}
[data-vibeui-block="navbar-031"] [data-part="nav"] a::after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;background:var(--vibeui-navbar-031-accent);transform:scaleX(0);transform-origin:right;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="navbar-031"] [data-part="nav"] a:hover{opacity:1}
[data-vibeui-block="navbar-031"] [data-part="nav"] a:hover::after{transform:none;transform-origin:left}
[data-vibeui-block="navbar-031"] [data-part="action"]{display:inline-flex;align-items:center;padding:.55rem 1rem;border-radius:999px;background:var(--vibeui-navbar-031-fg);color:var(--vibeui-navbar-031-bg);text-decoration:none;font-weight:600;font-size:.85rem;white-space:nowrap;transition:background .2s,color .2s,transform .3s cubic-bezier(.2,.8,.2,1),box-shadow .3s}
[data-vibeui-block="navbar-031"] [data-part="action"]:hover{background:var(--vibeui-navbar-031-accent);color:var(--vibeui-navbar-031-on-accent);transform:translateY(-1px) scale(1.04);box-shadow:0 10px 24px -10px color-mix(in oklab,var(--vibeui-navbar-031-accent) 70%,transparent)}
[data-vibeui-block="navbar-031"] a:focus-visible{outline:2px solid var(--vibeui-navbar-031-accent);outline-offset:2px}
@container (min-width: 40rem){[data-vibeui-block="navbar-031"] [data-part="status"]{display:inline-flex}}
@container (min-width: 60rem){[data-vibeui-block="navbar-031"] [data-part="nav"]{display:flex;margin-left:auto}[data-vibeui-block="navbar-031"] [data-part="clock"]{margin-left:0}}
[data-vibeui-block="navbar-031"] [data-part="burger"]{display:inline-flex;flex-direction:column;justify-content:center;gap:5px;flex-shrink:0;width:2.5rem;height:2.5rem;padding:0;border:1px solid var(--vibeui-navbar-031-line);border-radius:999px;background:transparent;color:inherit;cursor:pointer}
[data-vibeui-block="navbar-031"] [data-part="burger"] i{display:block;width:1rem;height:2px;margin:0 auto;background:currentColor;border-radius:2px;transition:transform .25s,opacity .2s}
[data-vibeui-block="navbar-031"] [data-part="burger"][aria-expanded="true"] i:nth-child(1){transform:translateY(7px) rotate(45deg)}
[data-vibeui-block="navbar-031"] [data-part="burger"][aria-expanded="true"] i:nth-child(2){opacity:0}
[data-vibeui-block="navbar-031"] [data-part="burger"][aria-expanded="true"] i:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
[data-vibeui-block="navbar-031"] [data-part="burger"]:focus-visible{outline:2px solid var(--vibeui-navbar-031-accent);outline-offset:2px}
[data-vibeui-block="navbar-031"] [data-part="menu"]{display:grid;gap:.2rem;max-width:80rem;margin:0 auto;padding:.6rem 1.25rem 1.25rem;border-top:1px solid var(--vibeui-navbar-031-line);background:var(--vibeui-navbar-031-bg);animation:vibeui-navbar-031-menu .22s ease-out}
[data-vibeui-block="navbar-031"] [data-part="menu"][hidden]{display:none}
[data-vibeui-block="navbar-031"] [data-part="menu"] a{padding:.8rem .7rem;border-radius:.7rem;color:var(--vibeui-navbar-031-fg);text-decoration:none;font-weight:600;font-size:1.05rem}
[data-vibeui-block="navbar-031"] [data-part="menu"] a:hover{background:color-mix(in oklab,var(--vibeui-navbar-031-fg) 6%,transparent)}
[data-vibeui-block="navbar-031"] [data-part="menu"] a[data-cta]{margin-top:.4rem;text-align:center;background:var(--vibeui-navbar-031-accent);color:var(--vibeui-navbar-031-on-accent)}
@keyframes vibeui-navbar-031-menu{from{opacity:0;transform:translateY(-6px)}}
@keyframes vibeui-navbar-031-pulse{50%{box-shadow:0 0 0 6px color-mix(in oklab,var(--vibeui-navbar-031-ok) 10%,transparent)}}
@container (min-width: 60rem){[data-vibeui-block="navbar-031"] [data-part="burger"],[data-vibeui-block="navbar-031"] [data-part="menu"]{display:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-031"] *{animation:none!important;transition:none!important}}`

const listeners = new Set<() => void>()
let timer: number | undefined

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (timer === undefined) timer = window.setInterval(() => listeners.forEach((fn) => fn()), 30000)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      window.clearInterval(timer)
      timer = undefined
    }
  }
}

function useTime(timeZone: string): string | null {
  const tick = useSyncExternalStore(subscribe, () => Math.floor(Date.now() / 30000), () => null)
  if (tick === null) return null
  try {
    return new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit", timeZone }).format(new Date())
  } catch {
    return new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" }).format(new Date())
  }
}

/** Шапка личного сайта с чипом доступности и живыми часами города. */
export function Navbar031({
  name = "Даня Лунёв",
  nameHref = "#top",
  status = "открыт к проектам с октября",
  available = true,
  city = "Тбилиси",
  timeZone = "Asia/Tbilisi",
  links = [
    { label: "Проекты", href: "#work" },
    { label: "Обо мне", href: "#about" },
    { label: "Отзывы", href: "#words" },
  ],
  actionLabel = "Написать",
  actionHref = "#contact",
  sticky = true,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Navbar031Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const time = useTime(timeZone)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-navbar-031-accent": accent } : null),
    ...(ink ? { "--vibeui-navbar-031-fg": ink } : null),
    ...(background ? { "--vibeui-navbar-031-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-031" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-031" data-tone={tone === "auto" ? undefined : tone} data-sticky={sticky} data-scrolled={scrolled} className={className} style={palette}>
        <div data-part="row">
          <a data-part="name" href={nameHref}>
            {name}
          </a>
          {status ? (
            <span data-part="status" data-on={available}>
              <i aria-hidden="true" />
              {status}
            </span>
          ) : null}
          <nav data-part="nav" aria-label="Разделы">
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          {city ? (
            <span data-part="clock" aria-live="off">
              {city} · <b>{time ?? "--:--"}</b>
            </span>
          ) : null}
          {actionLabel ? (
            <a data-part="action" href={actionHref}>
              {actionLabel}
            </a>
          ) : null}
          <button data-part="burger" type="button" aria-expanded={menuOpen} aria-controls="vibeui-navbar-031-menu" aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"} onClick={() => setMenuOpen((value) => !value)}>
            <i aria-hidden="true" />
            <i aria-hidden="true" />
            <i aria-hidden="true" />
          </button>
        </div>
        <nav data-part="menu" id="vibeui-navbar-031-menu" hidden={!menuOpen} aria-label="Меню" onClick={() => setMenuOpen(false)}>
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

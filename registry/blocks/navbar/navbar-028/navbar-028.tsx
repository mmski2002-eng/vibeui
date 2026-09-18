"use client"

import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react"

export type Navbar028Link = {
  label: string
  href: string
}

export type Navbar028Props = {
  brand?: string
  brandHref?: string
  links?: readonly Navbar028Link[]
  /** Часы работы: с какого по какой час (0–24). Чип статуса считается от часов посетителя. */
  openHour?: number
  closeHour?: number
  openLabel?: string
  closedLabel?: string
  actionLabel?: string
  /** Короткая подпись кнопки на узком экране. */
  actionShort?: string
  actionHref?: string
  sticky?: boolean
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Шапка кофейни: словомарка с точкой, разделы, живой чип «открыто · до 21:00»
// или «откроемся в 7:00 · через 5 часов» — считается от часов посетителя и
// обновляется раз в полминуты; при прокрутке шапка становится стеклом с
// «мучной» кромкой. Часы посетителя серверу неизвестны, поэтому до гидрации
// чип показывает «открыто» — разметка обязана совпасть.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700&family=Golos+Text:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-028"]){
--vibeui-navbar-028-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-028-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-028-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-028-on-accent:oklch(from var(--vibeui-navbar-028-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-028-muted:color-mix(in oklab,var(--vibeui-navbar-028-fg) 60%,var(--vibeui-navbar-028-bg));
--vibeui-navbar-028-line:color-mix(in oklab,var(--vibeui-navbar-028-fg) 12%,transparent);
--vibeui-navbar-028-chip:light-dark(#fff,color-mix(in oklab,var(--vibeui-navbar-028-bg) 85%,var(--vibeui-navbar-028-fg)));
--vibeui-navbar-028-open:#3fa35b;
--vibeui-navbar-028-wait:#f2c94c;
--vibeui-navbar-028-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-028-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-028"]{color-scheme:dark}
:where([data-vibeui-block="navbar-028"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-028"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-028"]{box-sizing:border-box;position:relative;z-index:50;font-family:var(--vibeui-navbar-028-font);color:var(--vibeui-navbar-028-fg);font-size:.95rem;line-height:1.4;transition:background .3s,box-shadow .3s}
[data-vibeui-block="navbar-028"][data-sticky="true"]{position:sticky;top:0}
[data-vibeui-block="navbar-028"] *{box-sizing:border-box}
[data-vibeui-block="navbar-028"][data-scrolled="true"]{background:color-mix(in oklab,var(--vibeui-navbar-028-bg) 82%,transparent);backdrop-filter:blur(14px) saturate(1.2);box-shadow:0 1px 0 var(--vibeui-navbar-028-line),0 12px 30px -24px rgb(0 0 0 / .4)}
[data-vibeui-block="navbar-028"][data-scrolled="true"]::after{content:"";position:absolute;left:0;right:0;bottom:-6px;height:6px;background:radial-gradient(4px 3px at 10% 0,rgb(255 255 255 / .9),transparent 70%),radial-gradient(3px 2px at 35% 30%,rgb(255 255 255 / .8),transparent 70%),radial-gradient(5px 3px at 62% 10%,rgb(255 255 255 / .9),transparent 70%),radial-gradient(3px 2px at 88% 40%,rgb(255 255 255 / .8),transparent 70%);opacity:.9;pointer-events:none}
[data-vibeui-block="navbar-028"] [data-part="row"]{display:flex;align-items:center;justify-content:space-between;gap:.5rem;height:4.25rem;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="navbar-028"] [data-part="brand"]{font-family:var(--vibeui-navbar-028-display);font-weight:700;font-size:1.3rem;letter-spacing:-.03em;text-decoration:none;color:inherit;display:inline-flex;align-items:center;gap:.5rem;white-space:nowrap}
[data-vibeui-block="navbar-028"] [data-part="dot"]{width:.6rem;height:.6rem;border-radius:50%;background:var(--vibeui-navbar-028-accent);box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-navbar-028-accent) 18%,transparent)}
[data-vibeui-block="navbar-028"] [data-part="nav"]{display:none;gap:1.6rem}
[data-vibeui-block="navbar-028"] [data-part="nav"] a{text-decoration:none;color:inherit;font-weight:500;font-size:.92rem;position:relative}
[data-vibeui-block="navbar-028"] [data-part="nav"] a::after{content:"";position:absolute;left:0;right:0;bottom:-.35rem;height:2px;border-radius:2px;background:var(--vibeui-navbar-028-accent);transform:scaleX(0);transform-origin:left;transition:transform .25s}
[data-vibeui-block="navbar-028"] [data-part="nav"] a:hover::after{transform:scaleX(1)}
[data-vibeui-block="navbar-028"] [data-part="right"]{display:flex;align-items:center;gap:.5rem}
[data-vibeui-block="navbar-028"] [data-part="status"]{display:inline-flex;align-items:center;gap:.5rem;padding:.5rem .85rem;border-radius:999px;background:var(--vibeui-navbar-028-chip);box-shadow:0 1px 2px rgb(0 0 0 / .08),0 0 0 1px var(--vibeui-navbar-028-line);font-size:.82rem;font-weight:500;white-space:nowrap;font-variant-numeric:tabular-nums}
[data-vibeui-block="navbar-028"] [data-part="status"] i{width:.55rem;height:.55rem;border-radius:50%;background:var(--vibeui-navbar-028-open);box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-navbar-028-open) 50%,transparent);animation:vibeui-navbar-028-pulse 2.4s ease-out infinite}
[data-vibeui-block="navbar-028"] [data-part="status"][data-open="false"] i{background:var(--vibeui-navbar-028-wait);animation:none}
[data-vibeui-block="navbar-028"] [data-part="status"] span{color:var(--vibeui-navbar-028-muted);display:none}
[data-vibeui-block="navbar-028"] [data-part="action"]{display:inline-flex;align-items:center;border-radius:999px;padding:.65rem .9rem;font-weight:600;font-size:.88rem;text-decoration:none;color:var(--vibeui-navbar-028-on-accent);background:var(--vibeui-navbar-028-accent);box-shadow:0 1px 0 rgb(255 255 255 / .35) inset,0 10px 24px -12px color-mix(in oklab,var(--vibeui-navbar-028-accent) 70%,transparent);white-space:nowrap;transition:transform .18s,filter .18s}
[data-vibeui-block="navbar-028"] [data-part="action"]:hover{transform:translateY(-1px);filter:brightness(1.05)}
[data-vibeui-block="navbar-028"] [data-part="action"]:active{transform:translateY(1px) scale(.985)}
[data-vibeui-block="navbar-028"] [data-part="action"] span{display:none}
[data-vibeui-block="navbar-028"] a:focus-visible{outline:2px solid var(--vibeui-navbar-028-accent);outline-offset:3px}
@keyframes vibeui-navbar-028-pulse{0%{box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-navbar-028-open) 50%,transparent)}100%{box-shadow:0 0 0 10px transparent}}
@container (min-width: 40rem){
[data-vibeui-block="navbar-028"] [data-part="status"] span{display:inline}
[data-vibeui-block="navbar-028"] [data-part="action"] span{display:inline}
[data-vibeui-block="navbar-028"] [data-part="action"]{padding:.7rem 1.1rem}
[data-vibeui-block="navbar-028"] [data-part="right"]{gap:.75rem}
}
@container (min-width: 52rem){[data-vibeui-block="navbar-028"] [data-part="nav"]{display:flex}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-028"] *{animation:none!important;transition:none!important}}`

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

/** Минуты от полуночи по часам посетителя; на сервере и при гидрации — null. */
function useMinutes(): number | null {
  const tick = useSyncExternalStore(subscribe, () => Math.floor(Date.now() / 30000), () => null)
  if (tick === null) return null
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

/** Шапка кофейни с живым чипом «открыто / откроемся через …». */
export function Navbar028({
  brand = "Корка",
  brandHref = "#top",
  links = [
    { label: "Витрина", href: "#shelf" },
    { label: "Кофе", href: "#coffee" },
    { label: "Хлеб", href: "#story" },
    { label: "Люди", href: "#people" },
    { label: "Где мы", href: "#where" },
  ],
  openHour = 7,
  closeHour = 21,
  openLabel = "открыто",
  closedLabel = "откроемся в",
  actionLabel = "Заказать к утру",
  actionShort = "Заказать",
  actionHref = "#box",
  sticky = true,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Navbar028Props) {
  const minutes = useMinutes()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const open = openHour * 60
  const close = closeHour * 60
  let isOpen = true
  let main = openLabel
  let extra = `до ${closeHour}:00`

  if (minutes !== null) {
    if (minutes >= open && minutes < close) {
      const left = close - minutes
      extra = left < 60 ? `закроемся через ${left} мин` : `до ${closeHour}:00`
    } else {
      const until = minutes < open ? open - minutes : 24 * 60 - minutes + open
      const hours = Math.floor(until / 60)
      isOpen = false
      main = `${closedLabel} ${openHour}:00`
      extra = hours > 0 ? `через ${hours} ${plural(hours, "час", "часа", "часов")}` : `через ${until % 60} мин`
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-navbar-028-accent": accent } : null),
    ...(ink ? { "--vibeui-navbar-028-fg": ink } : null),
    ...(background ? { "--vibeui-navbar-028-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-028" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-028"
        data-tone={tone === "auto" ? undefined : tone}
        data-sticky={sticky}
        data-scrolled={scrolled}
        className={className}
        style={palette}
      >
        <div data-part="row">
          <a data-part="brand" href={brandHref}>
            <i data-part="dot" aria-hidden="true" />
            {brand}
          </a>
          <nav data-part="nav" aria-label="Разделы">
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div data-part="right">
            <div data-part="status" data-open={isOpen} aria-live="polite">
              <i aria-hidden="true" />
              {main} <span>· {extra}</span>
            </div>
            {actionLabel ? (
              <a data-part="action" href={actionHref}>
                {actionShort}
                <span>{" "}{(actionLabel.startsWith(actionShort) ? actionLabel.slice(actionShort.length) : actionLabel).trim()}</span>
              </a>
            ) : null}
          </div>
        </div>
      </header>
    </>
  )
}

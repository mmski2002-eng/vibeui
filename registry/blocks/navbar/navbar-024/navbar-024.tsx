"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Navbar024Link = {
  label: string
  /** Якорь секции: «#works». По нему считается активный раздел. */
  href: string
  /** Иконка: works | artists | process | pricing | faq | about | reviews | contacts. */
  icon?: string
}

export type Navbar024Props = {
  /** Логотип — вертикальная неоновая вывеска. */
  brand?: string
  brandHref?: string
  links?: readonly Navbar024Link[]
  /** Статус внизу рейки: «есть окна». Пусто — без статуса. */
  status?: string
  actionLabel?: string
  actionHref?: string
  /** fixed — рейка слева и док снизу на телефоне; static — в потоке (превью и документация). */
  placement?: "fixed" | "static"
  /** Подсвечивать текущий раздел по скроллу. */
  spy?: boolean
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Навигация тату-студии не полосой, а неоновой рейкой у левого края:
// вертикальный логотип-вывеска сверху, разделы иконками столбиком, справа
// по рейке ползёт неоновая полоска прогресса скролла, внизу кнопка записи
// и статус «есть окна». По наведению рейка раздвигается и показывает
// подписи. Текущий раздел светится (IntersectionObserver по якорям).
// На телефоне рейка становится нижним доком с иконками и кнопкой записи.
// Странице нужен отступ слева 5.5rem от 60rem — см. usage.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-024"]){
--vibeui-navbar-024-bg:rgb(7 6 11 / .86);
--vibeui-navbar-024-fg:#f3eefc;
--vibeui-navbar-024-muted:#8f88a3;
--vibeui-navbar-024-line:rgb(255 255 255 / .1);
--vibeui-navbar-024-accent:#ff2bd6;
--vibeui-navbar-024-accent-2:#8b5cff;
--vibeui-navbar-024-cyan:#22f3ff;
--vibeui-navbar-024-ok:#c8ff3a;
--vibeui-navbar-024-on-accent:#15121c;
--vibeui-navbar-024-rail:5.5rem;
--vibeui-navbar-024-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-024-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-024-mono:"JetBrains Mono",ui-monospace,monospace;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-024"]{color-scheme:dark}
:where([data-vibeui-block="navbar-024"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-024"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-024"]{box-sizing:border-box;position:fixed;left:0;right:0;bottom:0;z-index:40;display:block;color:var(--vibeui-navbar-024-fg);font-family:var(--vibeui-navbar-024-font);font-size:1rem;line-height:1.3}
[data-vibeui-block="navbar-024"] *{box-sizing:border-box}
[data-vibeui-block="navbar-024"] [data-part="action"]{flex:none}
[data-vibeui-block="navbar-024"] a{color:inherit;text-decoration:none}
[data-vibeui-block="navbar-024"] [data-part="rail"]{position:relative;display:flex;align-items:center;gap:.25rem;padding:.5rem .75rem calc(.5rem + env(safe-area-inset-bottom));background:var(--vibeui-navbar-024-bg);-webkit-backdrop-filter:blur(16px) saturate(1.3);backdrop-filter:blur(16px) saturate(1.3);border-top:1px solid var(--vibeui-navbar-024-line)}
[data-vibeui-block="navbar-024"] [data-part="glow"]{position:absolute;left:0;right:0;top:-1px;height:1px;background:linear-gradient(90deg,var(--vibeui-navbar-024-accent-2),var(--vibeui-navbar-024-accent) var(--vibeui-navbar-024-p,0%),transparent var(--vibeui-navbar-024-p,0%));box-shadow:0 0 10px var(--vibeui-navbar-024-accent);pointer-events:none}
[data-vibeui-block="navbar-024"] [data-part="brand"]{display:none;font-family:var(--vibeui-navbar-024-display);font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-navbar-024-accent);text-shadow:0 0 6px var(--vibeui-navbar-024-accent),0 0 18px color-mix(in oklab,var(--vibeui-navbar-024-accent) 70%,transparent),0 0 40px color-mix(in oklab,var(--vibeui-navbar-024-accent) 40%,transparent);animation:vibeui-navbar-024-flicker 7s infinite}
@keyframes vibeui-navbar-024-flicker{0%,93%,100%{opacity:1}94%{opacity:.55}95%{opacity:1}97%{opacity:.7}98%{opacity:1}}
[data-vibeui-block="navbar-024"] [data-part="links"]{display:flex;flex:1;justify-content:space-around;gap:.15rem;margin:0;padding:0;list-style:none;min-width:0}
[data-vibeui-block="navbar-024"] [data-part="link"]{position:relative;display:flex;flex-direction:column;align-items:center;gap:.3rem;min-width:3.2rem;padding:.45rem .35rem;border-radius:.7rem;color:var(--vibeui-navbar-024-muted);font-size:.62rem;font-weight:600;letter-spacing:.02em;white-space:nowrap;transition:color .25s,background .25s}
[data-vibeui-block="navbar-024"] [data-part="link"] svg{width:1.35rem;height:1.35rem;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;transition:filter .3s,transform .3s cubic-bezier(.2,.9,.3,1.4)}
[data-vibeui-block="navbar-024"] [data-part="link"]:hover,[data-vibeui-block="navbar-024"] [data-part="link"][aria-current="true"]{color:var(--vibeui-navbar-024-fg)}
[data-vibeui-block="navbar-024"] [data-part="link"][aria-current="true"] svg{color:var(--vibeui-navbar-024-accent);filter:drop-shadow(0 0 6px var(--vibeui-navbar-024-accent)) drop-shadow(0 0 14px color-mix(in oklab,var(--vibeui-navbar-024-accent) 60%,transparent));transform:translateY(-2px)}
[data-vibeui-block="navbar-024"] [data-part="link"]::after{content:"";position:absolute;left:50%;bottom:.1rem;width:.3rem;height:.3rem;margin-left:-.15rem;border-radius:50%;background:var(--vibeui-navbar-024-accent);box-shadow:0 0 8px var(--vibeui-navbar-024-accent);opacity:0;transform:scale(.4);transition:opacity .3s,transform .3s cubic-bezier(.2,.9,.3,1.4)}
[data-vibeui-block="navbar-024"] [data-part="link"][aria-current="true"]::after{opacity:1;transform:none}
[data-vibeui-block="navbar-024"] [data-part="status"]{display:none;align-items:center;gap:.5rem;font-family:var(--vibeui-navbar-024-mono);font-size:.62rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-navbar-024-muted);white-space:nowrap}
[data-vibeui-block="navbar-024"] [data-part="status"]::before{content:"";flex:none;width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-navbar-024-ok);box-shadow:0 0 8px var(--vibeui-navbar-024-ok);animation:vibeui-navbar-024-pulse 2s ease-in-out infinite}
@keyframes vibeui-navbar-024-pulse{0%,100%{box-shadow:0 0 6px var(--vibeui-navbar-024-ok)}50%{box-shadow:0 0 14px var(--vibeui-navbar-024-ok),0 0 26px color-mix(in oklab,var(--vibeui-navbar-024-ok) 50%,transparent)}}
[data-vibeui-block="navbar-024"][data-placement="static"]{position:static}
@media (min-width: 60rem){
[data-vibeui-block="navbar-024"][data-placement="fixed"] [data-part="action"]{width:100%;margin-top:1rem}
[data-vibeui-block="navbar-024"][data-placement="fixed"]{left:0;top:0;right:auto;bottom:0;width:var(--vibeui-navbar-024-rail);transition:width .4s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="navbar-024"][data-placement="fixed"]:hover,[data-vibeui-block="navbar-024"][data-placement="fixed"]:focus-within{width:14rem}
[data-vibeui-block="navbar-024"][data-placement="fixed"] [data-part="rail"]{flex-direction:column;align-items:stretch;height:100%;padding:1.25rem .75rem 1.25rem;border-top:0;border-right:1px solid var(--vibeui-navbar-024-line);overflow:hidden}
[data-vibeui-block="navbar-024"][data-placement="fixed"] [data-part="glow"]{left:auto;right:-1px;top:0;bottom:0;width:2px;height:auto;background:linear-gradient(180deg,var(--vibeui-navbar-024-accent-2),var(--vibeui-navbar-024-accent) var(--vibeui-navbar-024-p,0%),transparent var(--vibeui-navbar-024-p,0%))}
[data-vibeui-block="navbar-024"][data-placement="fixed"] [data-part="brand"]{display:block;align-self:flex-start;writing-mode:vertical-rl;transform:rotate(180deg);margin:0 0 1.5rem .55rem;font-size:1.3rem;line-height:1}
[data-vibeui-block="navbar-024"][data-placement="fixed"] [data-part="links"]{flex-direction:column;justify-content:flex-start;gap:.35rem;margin-top:auto;margin-bottom:auto}
[data-vibeui-block="navbar-024"][data-placement="fixed"] [data-part="link"]{flex-direction:row;justify-content:flex-start;gap:.9rem;min-width:0;padding:.7rem .85rem;font-size:.9rem;font-weight:600}
[data-vibeui-block="navbar-024"][data-placement="fixed"] [data-part="link"] svg{flex:none;width:1.5rem;height:1.5rem}
[data-vibeui-block="navbar-024"][data-placement="fixed"] [data-part="link"] span{opacity:0;transform:translateX(-6px);transition:opacity .3s,transform .3s}
[data-vibeui-block="navbar-024"][data-placement="fixed"]:hover [data-part="link"] span,[data-vibeui-block="navbar-024"][data-placement="fixed"]:focus-within [data-part="link"] span{opacity:1;transform:none}
[data-vibeui-block="navbar-024"][data-placement="fixed"] [data-part="link"]:hover{background:rgb(255 255 255 / .05)}
[data-vibeui-block="navbar-024"][data-placement="fixed"] [data-part="link"]::after{left:auto;right:.6rem;bottom:auto;top:50%;margin:-.15rem 0 0}
[data-vibeui-block="navbar-024"][data-placement="fixed"] [data-part="status"]{display:flex;margin:.9rem 0 0 .35rem}
[data-vibeui-block="navbar-024"][data-placement="fixed"] [data-part="status"] span{opacity:0;transition:opacity .3s}
[data-vibeui-block="navbar-024"][data-placement="fixed"]:hover [data-part="status"] span,[data-vibeui-block="navbar-024"][data-placement="fixed"]:focus-within [data-part="status"] span{opacity:1}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-024"] *{animation:none!important;transition:none!important}}`

const ICONS: Record<string, string> = {
  works: "M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5zM4 15l4.5-4.5L14 16l2.5-2.5L20 17M15 8.5h.01",
  artists: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 20a6 6 0 0 1 12 0M16.5 10.5a3 3 0 1 0-2-5.2M21 19a5 5 0 0 0-4.5-5",
  process: "M4 12h16M4 12l3-3M4 12l3 3M9 6h.01M15 6h.01M9 18h.01M15 18h.01",
  pricing: "M20 12.5 12.5 20a1.5 1.5 0 0 1-2 0L4 13.5V4h9.5L20 10.5a1.5 1.5 0 0 1 0 2zM8 8h.01",
  faq: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5M12 17h.01",
  about: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v6M12 7h.01",
  reviews: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z",
  contacts: "M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2 3.6.8v3.2A1.5 1.5 0 0 1 17.5 21 16 16 0 0 1 3 6.5 1.5 1.5 0 0 1 4.8 5H8l.8 3.6z",
}

/** Навигация тату-студии неоновой рейкой слева: иконки разделов, прогресс скролла, запись; на телефоне — нижний док. */
export function Navbar024({
  brand = "Inkra",
  brandHref = "#",
  links = [
    { label: "Работы", href: "#works", icon: "works" },
    { label: "Мастера", href: "#artists", icon: "artists" },
    { label: "Как проходит", href: "#process", icon: "process" },
    { label: "Цены", href: "#pricing", icon: "pricing" },
    { label: "Вопросы", href: "#faq", icon: "faq" },
  ],
  status = "Есть окна",
  actionLabel = "Записаться",
  actionHref = "#booking",
  placement = "fixed",
  spy = true,
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Navbar024Props) {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState("")
  const palette = {
    ...(accent ? { "--vibeui-navbar-024-accent": accent } : null),
    ...(background ? { "--vibeui-navbar-024-bg": background } : null),
    ...style,
  } as CSSProperties

  // Прогресс скролла пишется в CSS-переменную из rAF, без ререндеров.
  useEffect(() => {
    if (placement === "static") return
    const node = root.current
    if (!node) return
    let frame = 0
    const read = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      node.style.setProperty("--vibeui-navbar-024-p", `${max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0}%`)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }
    read()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [placement])

  useEffect(() => {
    if (!spy || placement === "static" || typeof IntersectionObserver === "undefined") return
    const targets = links.map((link) => (link.href.startsWith("#") ? document.querySelector(link.href) : null)).filter((node): node is Element => node !== null)
    if (targets.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { rootMargin: "-40% 0px -55% 0px" },
    )
    targets.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [links, spy, placement])

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-024" precedence="medium">
        {STYLES}
      </style>
      <header ref={root} data-vibeui-block="navbar-024" data-tone={tone === "auto" ? undefined : tone} data-placement={placement} className={className} style={palette}>
        <div data-part="rail">
          <span data-part="glow" aria-hidden="true" />
          <a data-part="brand" href={brandHref}>
            {brand}
          </a>
          <ul data-part="links">
            {links.map((link) => (
              <li key={link.label}>
                <a data-part="link" href={link.href} aria-current={active === link.href ? "true" : undefined} title={link.label}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d={ICONS[link.icon ?? ""] ?? ICONS.about} />
                  </svg>
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
          {actionLabel ? (
            <Button016
              data-part="action"
              aria-label={actionLabel}
              label={actionLabel}
              href={actionHref}
              external={false}
              size="sm"
              tone="accent"
              accent={accent}
            />
          ) : null}
          {status ? (
            <p data-part="status">
              <span>{status}</span>
            </p>
          ) : null}
        </div>
      </header>
    </>
  )
}

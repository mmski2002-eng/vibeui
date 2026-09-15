"use client"

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"

export type Navbar023Link = {
  label: string
  /** Якорь секции: «#program». По нему считается активный раздел. */
  href: string
  /** Цвет точки у ссылки — цвет направления или секции. */
  color?: string
}

export type Navbar023Props = {
  /** Словомарка: точка в конце красится в акцент. */
  brand?: string
  brandHref?: string
  /** Буква в кружке слева от словомарки. */
  markLabel?: string
  links?: readonly Navbar023Link[]
  navLabel?: string
  /** Акцентная капсула справа. */
  actionLabel?: string
  actionHref?: string
  menuLabel?: string
  closeLabel?: string
  /** Подсвечивать текущий раздел по скроллу. */
  spy?: boolean
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Шапка из островков: у начала страницы три отдельные капсулы на матовом
// стекле — бренд с кружком-меткой, меню со ссылками и лаймовое действие —
// стоят широко; после прокрутки зазоры схлопываются и островки собираются
// в одну узкую пилюлю. Под ссылками ездит каретка: по наведению — за
// курсором, иначе — под текущим разделом (IntersectionObserver по якорям).
// У ссылок цветные точки направлений. На узком экране — бургер и панель
// под шапкой; Escape и клик снаружи закрывают.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-023"]){
--vibeui-navbar-023-bg:transparent;
--vibeui-navbar-023-fg:light-dark(#111111,#f4f4f5);
--vibeui-navbar-023-muted:light-dark(#6b6b70,#a1a1aa);
--vibeui-navbar-023-line:light-dark(rgb(17 17 17 / .1),rgb(255 255 255 / .14));
--vibeui-navbar-023-glass:light-dark(rgb(255 255 255 / .66),rgb(20 21 26 / .64));
--vibeui-navbar-023-glass-dense:light-dark(rgb(255 255 255 / .8),rgb(20 21 26 / .8));
--vibeui-navbar-023-sheen:light-dark(rgb(255 255 255 / .9),rgb(255 255 255 / .2));
--vibeui-navbar-023-glide:light-dark(rgb(17 17 17 / .07),rgb(255 255 255 / .12));
--vibeui-navbar-023-lift:0 .375rem 1.25rem rgb(0 0 0 / .1);
--vibeui-navbar-023-lift-strong:0 .75rem 2.25rem rgb(0 0 0 / .16);
--vibeui-navbar-023-accent:#d3f43a;
--vibeui-navbar-023-on-accent:#111111;
--vibeui-navbar-023-inset:1.25rem;
--vibeui-navbar-023-display:"Inter Tight","Inter",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-023-font:"Inter",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-023-ease:cubic-bezier(.32,.72,0,1);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-023"]{color-scheme:dark}
:where([data-vibeui-block="navbar-023"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-023"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-023"]{box-sizing:border-box;position:sticky;top:0;z-index:30;display:block;background:var(--vibeui-navbar-023-bg);color:var(--vibeui-navbar-023-fg);font-family:var(--vibeui-navbar-023-font);font-size:1rem;line-height:1.4;pointer-events:none}
[data-vibeui-block="navbar-023"] *{box-sizing:border-box}
[data-vibeui-block="navbar-023"] a{color:inherit;text-decoration:none}
[data-vibeui-block="navbar-023"] a:focus-visible,[data-vibeui-block="navbar-023"] button:focus-visible{outline:2px solid var(--vibeui-navbar-023-fg);outline-offset:3px;border-radius:999px}
[data-vibeui-block="navbar-023"] [data-part="dock"]{position:relative;padding:var(--vibeui-navbar-023-inset);transition:padding .46s var(--vibeui-navbar-023-ease)}
[data-vibeui-block="navbar-023"] [data-part="dock"][data-scrolled]{padding-top:.625rem;padding-bottom:.625rem}
[data-vibeui-block="navbar-023"] [data-part="bar"]{display:flex;align-items:center;gap:.5rem;max-width:80rem;margin:0 auto;padding:0;border:1px solid transparent;border-radius:999px;pointer-events:auto;transition:max-width .46s var(--vibeui-navbar-023-ease),gap .46s var(--vibeui-navbar-023-ease),padding .46s var(--vibeui-navbar-023-ease),background-color .34s,border-color .34s,box-shadow .34s}
[data-vibeui-block="navbar-023"] [data-part="dock"][data-scrolled] [data-part="bar"]{max-width:54rem;gap:.25rem;padding:.3125rem;background:var(--vibeui-navbar-023-glass-dense);border-color:var(--vibeui-navbar-023-line);box-shadow:var(--vibeui-navbar-023-lift-strong),inset 0 1px 0 var(--vibeui-navbar-023-sheen);-webkit-backdrop-filter:blur(1.5rem) saturate(180%);backdrop-filter:blur(1.5rem) saturate(180%)}
[data-vibeui-block="navbar-023"] [data-part="brand"],[data-vibeui-block="navbar-023"] [data-part="nav"],[data-vibeui-block="navbar-023"] [data-part="burger"]{background:var(--vibeui-navbar-023-glass);border:1px solid var(--vibeui-navbar-023-line);border-radius:999px;box-shadow:var(--vibeui-navbar-023-lift),inset 0 1px 0 var(--vibeui-navbar-023-sheen);-webkit-backdrop-filter:blur(1.125rem) saturate(170%);backdrop-filter:blur(1.125rem) saturate(170%);transition:background-color .34s,border-color .34s,box-shadow .34s}
[data-vibeui-block="navbar-023"] [data-part="dock"][data-scrolled] [data-part="brand"],[data-vibeui-block="navbar-023"] [data-part="dock"][data-scrolled] [data-part="nav"],[data-vibeui-block="navbar-023"] [data-part="dock"][data-scrolled] [data-part="burger"]{background:transparent;border-color:transparent;box-shadow:none;-webkit-backdrop-filter:none;backdrop-filter:none}
[data-vibeui-block="navbar-023"] [data-part="brand"]{display:inline-flex;align-items:center;gap:.6rem;flex:none;padding:.4375rem 1.1rem .4375rem .4375rem;font-family:var(--vibeui-navbar-023-display);font-size:1.15rem;font-weight:700;letter-spacing:-.035em;line-height:1;white-space:nowrap}
[data-vibeui-block="navbar-023"] [data-part="brand"] i{font-style:normal;color:var(--vibeui-navbar-023-accent);filter:brightness(.85)}
[data-vibeui-block="navbar-023"] [data-part="mark"]{width:1.9rem;height:1.9rem;flex:none;display:grid;place-items:center;border-radius:999px;background:var(--vibeui-navbar-023-accent);color:var(--vibeui-navbar-023-on-accent);font-size:.9rem;font-weight:800;box-shadow:0 0 0 1px color-mix(in oklab,var(--vibeui-navbar-023-accent) 50%,transparent),0 .25rem .75rem color-mix(in oklab,var(--vibeui-navbar-023-accent) 55%,transparent)}
[data-vibeui-block="navbar-023"] [data-part="nav"]{display:none;position:relative;margin:0 auto;padding:.3125rem;gap:.125rem}
[data-vibeui-block="navbar-023"] [data-part="nav"] a{position:relative;z-index:1;display:inline-flex;align-items:center;gap:.5rem;padding:.45rem .95rem;border-radius:999px;color:var(--vibeui-navbar-023-muted);font-size:.92rem;font-weight:500;white-space:nowrap;transition:color .13s}
[data-vibeui-block="navbar-023"] [data-part="nav"] a:hover,[data-vibeui-block="navbar-023"] [data-part="nav"] a[aria-current="true"]{color:var(--vibeui-navbar-023-fg)}
[data-vibeui-block="navbar-023"] [data-part="nav"]:not([data-ready]) a[aria-current="true"]{background:var(--vibeui-navbar-023-glide)}
[data-vibeui-block="navbar-023"] [data-part="dot"]{width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-navbar-023-dot,var(--vibeui-navbar-023-accent));transition:transform .3s cubic-bezier(.2,.9,.3,1.4)}
[data-vibeui-block="navbar-023"] [data-part="nav"] a[aria-current="true"] [data-part="dot"]{transform:scale(1.5)}
[data-vibeui-block="navbar-023"] [data-part="glider"]{position:absolute;top:.3125rem;bottom:.3125rem;left:0;z-index:0;width:var(--vibeui-navbar-023-glider-w,0);transform:translate3d(var(--vibeui-navbar-023-glider-x,0),0,0);border-radius:999px;background:var(--vibeui-navbar-023-glide);opacity:0;pointer-events:none}
[data-vibeui-block="navbar-023"] [data-part="nav"][data-ready] [data-part="glider"]{opacity:1;transition:transform .34s var(--vibeui-navbar-023-ease),width .34s var(--vibeui-navbar-023-ease),opacity .18s}
[data-vibeui-block="navbar-023"] [data-part="action"]{position:relative;overflow:hidden;flex:none;display:inline-flex;align-items:center;padding:.6rem 1.2rem;border-radius:999px;background:var(--vibeui-navbar-023-accent);color:var(--vibeui-navbar-023-on-accent);font-size:.92rem;font-weight:650;white-space:nowrap;letter-spacing:-.01em;box-shadow:0 .375rem 1.125rem color-mix(in oklab,var(--vibeui-navbar-023-accent) 45%,transparent),inset 0 1px 0 rgb(255 255 255 / .45);transition:transform .18s var(--vibeui-navbar-023-ease),box-shadow .24s}
[data-vibeui-block="navbar-023"] [data-part="action"]:hover{transform:translateY(-1px);box-shadow:0 .625rem 1.75rem color-mix(in oklab,var(--vibeui-navbar-023-accent) 55%,transparent),inset 0 1px 0 rgb(255 255 255 / .55)}
[data-vibeui-block="navbar-023"] [data-part="burger"]{flex:none;margin-left:auto;display:inline-flex;align-items:center;gap:.5rem;cursor:pointer;padding:.5rem .95rem .5rem .8rem;color:inherit;font:inherit;font-size:.9rem;font-weight:560}
[data-vibeui-block="navbar-023"] [data-part="bars"]{position:relative;width:.95rem;height:.625rem;flex:none}
[data-vibeui-block="navbar-023"] [data-part="bars"]::before,[data-vibeui-block="navbar-023"] [data-part="bars"]::after{content:"";position:absolute;left:0;right:0;height:1.5px;border-radius:2px;background:currentColor;transition:transform .34s var(--vibeui-navbar-023-ease)}
[data-vibeui-block="navbar-023"] [data-part="bars"]::before{top:0}
[data-vibeui-block="navbar-023"] [data-part="bars"]::after{bottom:0}
[data-vibeui-block="navbar-023"] [data-part="burger"][aria-expanded="true"] [data-part="bars"]::before{transform:translateY(.28rem) rotate(45deg)}
[data-vibeui-block="navbar-023"] [data-part="burger"][aria-expanded="true"] [data-part="bars"]::after{transform:translateY(-.28rem) rotate(-45deg)}
[data-vibeui-block="navbar-023"] [data-part="panel"]{position:absolute;left:var(--vibeui-navbar-023-inset);right:var(--vibeui-navbar-023-inset);top:100%;z-index:60;display:flex;flex-direction:column;gap:.125rem;padding:.5rem;border-radius:1.375rem;background:var(--vibeui-navbar-023-glass-dense);border:1px solid var(--vibeui-navbar-023-line);box-shadow:var(--vibeui-navbar-023-lift-strong),inset 0 1px 0 var(--vibeui-navbar-023-sheen);-webkit-backdrop-filter:blur(1.5rem) saturate(180%);backdrop-filter:blur(1.5rem) saturate(180%);pointer-events:auto;transform-origin:top center;transition:opacity .18s,transform .24s var(--vibeui-navbar-023-ease)}
[data-vibeui-block="navbar-023"] [data-part="dock"][data-scrolled] [data-part="panel"]{left:calc(var(--vibeui-navbar-023-inset) * .5);right:calc(var(--vibeui-navbar-023-inset) * .5)}
[data-vibeui-block="navbar-023"] [data-part="panel"][data-open="false"]{opacity:0;transform:translateY(-.5rem) scale(.98);pointer-events:none}
[data-vibeui-block="navbar-023"] [data-part="panel"] a{display:flex;align-items:center;gap:.7rem;padding:.7rem .9rem;border-radius:.875rem;font-size:1rem;font-weight:540;transition:background-color .13s}
[data-vibeui-block="navbar-023"] [data-part="panel"] a:hover,[data-vibeui-block="navbar-023"] [data-part="panel"] a[aria-current="true"]{background:var(--vibeui-navbar-023-glide)}
@container (max-width: 32rem){
[data-vibeui-block="navbar-023"] [data-part="burger"]{padding:.5625rem;gap:0}
[data-vibeui-block="navbar-023"] [data-part="burger"] span:last-child{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
[data-vibeui-block="navbar-023"] [data-part="action"]{padding:.5625rem .95rem}
[data-vibeui-block="navbar-023"] [data-part="brand"]{padding-right:.875rem}
}
@container (min-width: 60rem){
[data-vibeui-block="navbar-023"] [data-part="nav"]{display:inline-flex}
[data-vibeui-block="navbar-023"] [data-part="burger"],[data-vibeui-block="navbar-023"] [data-part="panel"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-023"] *{transition:none!important;animation:none!important}}`

const DEFAULT_LINKS: Navbar023Link[] = [
  { label: "Программа", href: "#program", color: "#ffe2d6" },
  { label: "Расписание", href: "#schedule", color: "#c2df37" },
  { label: "Участники", href: "#lineup", color: "#9854d1" },
  { label: "Площадки", href: "#venues", color: "#464dff" },
  { label: "Вопросы", href: "#faq", color: "#ffa5b1" },
]

/** Шапка-островки фестиваля: у начала — три капсулы, после прокрутки — одна пилюля с кареткой под разделом. */
export function Navbar023({
  brand = "тридня",
  brandHref = "#",
  markLabel = "т",
  links = DEFAULT_LINKS,
  navLabel = "Разделы сайта",
  actionLabel = "Билеты",
  actionHref = "#tickets",
  menuLabel = "Меню",
  closeLabel = "Закрыть",
  spy = true,
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Navbar023Props) {
  const dockRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState("")
  const palette = {
    ...(accent ? { "--vibeui-navbar-023-accent": accent } : null),
    ...(background ? { "--vibeui-navbar-023-bg": background } : null),
    ...style,
  } as CSSProperties

  const placeGlider = useCallback((target?: HTMLElement | null) => {
    const nav = navRef.current
    if (!nav) return
    const item = target ?? nav.querySelector<HTMLElement>('a[aria-current="true"]')
    if (!item) {
      nav.removeAttribute("data-ready")
      return
    }
    nav.style.setProperty("--vibeui-navbar-023-glider-x", `${item.offsetLeft - nav.clientLeft}px`)
    nav.style.setProperty("--vibeui-navbar-023-glider-w", `${item.offsetWidth}px`)
    nav.setAttribute("data-ready", "on")
  }, [])

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    placeGlider()
    const observer = new ResizeObserver(() => placeGlider())
    observer.observe(nav)
    return () => observer.disconnect()
  }, [placeGlider, links, active])

  useEffect(() => {
    const dock = dockRef.current
    if (!dock) return
    const read = () => dock.toggleAttribute("data-scrolled", window.scrollY > 8)
    read()
    window.addEventListener("scroll", read, { passive: true })
    return () => window.removeEventListener("scroll", read)
  }, [])

  // Активный раздел: секция, которая занимает середину экрана.
  useEffect(() => {
    if (!spy || typeof IntersectionObserver === "undefined") return
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
  }, [links, spy])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!dockRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [open])

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-023" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-023" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div ref={dockRef} data-part="dock">
          <div data-part="bar">
            <a data-part="brand" href={brandHref}>
              <span data-part="mark" aria-hidden="true">
                {markLabel}
              </span>
              <span>
                {brand}
                <i>.</i>
              </span>
            </a>
            <nav ref={navRef} data-part="nav" aria-label={navLabel} onMouseLeave={() => placeGlider()}>
              <span data-part="glider" aria-hidden="true" />
              {links.map((link) => (
                <a key={link.label} href={link.href} aria-current={active === link.href ? "true" : undefined} style={{ ["--vibeui-navbar-023-dot" as string]: link.color }} onMouseEnter={(event) => placeGlider(event.currentTarget)} onFocus={(event) => placeGlider(event.currentTarget)}>
                  <span data-part="dot" aria-hidden="true" />
                  {link.label}
                </a>
              ))}
            </nav>
            <button type="button" data-part="burger" aria-expanded={open} aria-controls="vibeui-navbar-023-panel" onClick={() => setOpen((value) => !value)}>
              <span data-part="bars" aria-hidden="true" />
              <span>{open ? closeLabel : menuLabel}</span>
            </button>
            {actionLabel ? (
              <a data-part="action" href={actionHref}>
                {actionLabel}
              </a>
            ) : null}
          </div>
          <div id="vibeui-navbar-023-panel" data-part="panel" data-open={open} aria-hidden={!open}>
            {links.map((link) => (
              <a key={link.label} href={link.href} aria-current={active === link.href ? "true" : undefined} style={{ ["--vibeui-navbar-023-dot" as string]: link.color }} tabIndex={open ? undefined : -1} onClick={() => setOpen(false)}>
                <span data-part="dot" aria-hidden="true" />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </header>
    </>
  )
}

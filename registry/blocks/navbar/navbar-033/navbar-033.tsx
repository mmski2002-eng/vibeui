"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"

export type Navbar033Link = {
  label: string
  href: string
}

export type Navbar033Props = {
  brand?: string
  brandHref?: string
  links?: readonly Navbar033Link[]
  loginLabel?: string
  loginHref?: string
  actionLabel?: string
  actionHref?: string
  /** Живой индикатор справа: «Идёт созвон» и счётчик от liveStart секунд. Пусто — без индикатора. */
  liveLabel?: string
  liveStart?: number
  sticky?: boolean
  /** Висит поверх первого экрана и не занимает места в потоке. */
  overlay?: boolean
  /** aria навигации, меню и кнопки-бургера. */
  navLabel?: string
  menuLabel?: string
  menuOpenLabel?: string
  menuCloseLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Шапка AI-сервиса — плавающая стеклянная капсула по центру, а не полоса
// во всю ширину. Лого — маленький эквалайзер, который «слушает»: четыре
// полоски пульсируют вразнобой. Под пунктом меню переезжает подсветка
// (одна на всё меню, едет за курсором). Справа живой индикатор
// «● Идёт созвон 12:04» — секунды тикают — и кнопка. При прокрутке капсула
// сужается и темнеет. На узком — лого и бургер, меню выпадает панелью.
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@600;700;800&family=Golos+Text:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-033"]){
--vibeui-navbar-033-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-033-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-033-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-033-on-accent:oklch(from var(--vibeui-navbar-033-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-033-muted:color-mix(in oklab,var(--vibeui-navbar-033-fg) 62%,var(--vibeui-navbar-033-bg));
--vibeui-navbar-033-line:color-mix(in oklab,var(--vibeui-navbar-033-fg) 12%,transparent);
--vibeui-navbar-033-live:#ff5c7a;
--vibeui-navbar-033-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-033-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-033-mono:"JetBrains Mono",ui-monospace,monospace;
--vibeui-navbar-033-ease:cubic-bezier(.22,1,.36,1);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-033"]{color-scheme:dark}
:where([data-vibeui-block="navbar-033"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-033"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-033"]{box-sizing:border-box;position:relative;z-index:50;padding:.9rem 1rem 0;font-family:var(--vibeui-navbar-033-font);color:var(--vibeui-navbar-033-fg);font-size:.9rem;line-height:1.4;pointer-events:none}
[data-vibeui-block="navbar-033"][data-sticky="true"]{position:sticky;top:0}
[data-vibeui-block="navbar-033"][data-overlay="true"]{margin-bottom:-4.4rem}
[data-vibeui-block="navbar-033"] *{box-sizing:border-box}
[data-vibeui-block="navbar-033"] [data-part="capsule"]{position:relative;display:flex;align-items:center;gap:.6rem;width:100%;max-width:66rem;height:3.5rem;margin:0 auto;padding:0 .45rem 0 1rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-navbar-033-bg) 55%,transparent);backdrop-filter:blur(18px) saturate(1.5);-webkit-backdrop-filter:blur(18px) saturate(1.5);box-shadow:inset 0 0 0 1px var(--vibeui-navbar-033-line),inset 0 1px 0 color-mix(in oklab,var(--vibeui-navbar-033-fg) 10%,transparent),0 18px 40px -24px rgb(0 0 0 / .8);pointer-events:auto;transition:max-width .6s var(--vibeui-navbar-033-ease),height .6s var(--vibeui-navbar-033-ease),background .4s}
[data-vibeui-block="navbar-033"][data-scrolled="true"] [data-part="capsule"]{max-width:58rem;height:3.1rem;background:color-mix(in oklab,var(--vibeui-navbar-033-bg) 82%,transparent)}
[data-vibeui-block="navbar-033"] [data-part="brand"]{display:inline-flex;align-items:center;gap:.55rem;flex:none;font-family:var(--vibeui-navbar-033-display);font-weight:800;font-size:1.05rem;letter-spacing:-.02em;text-decoration:none;color:inherit}
[data-vibeui-block="navbar-033"] [data-part="eq"]{display:inline-flex;align-items:center;justify-content:center;gap:2px;width:1.75rem;height:1.75rem;border-radius:.55rem;background:linear-gradient(135deg,var(--vibeui-navbar-033-accent),color-mix(in oklab,var(--vibeui-navbar-033-accent) 45%,#8b5cf6));box-shadow:0 6px 16px -8px var(--vibeui-navbar-033-accent)}
[data-vibeui-block="navbar-033"] [data-part="eq"] i{display:block;width:2px;height:.8rem;border-radius:2px;background:var(--vibeui-navbar-033-on-accent);transform-origin:center;animation:vibeui-navbar-033-eq 1.1s ease-in-out infinite}
[data-vibeui-block="navbar-033"] [data-part="eq"] i:nth-child(2){animation-delay:-.35s;animation-duration:.9s}
[data-vibeui-block="navbar-033"] [data-part="eq"] i:nth-child(3){animation-delay:-.7s;animation-duration:1.3s}
[data-vibeui-block="navbar-033"] [data-part="eq"] i:nth-child(4){animation-delay:-.2s;animation-duration:1s}
[data-vibeui-block="navbar-033"] [data-part="nav"]{position:relative;display:none;align-items:center;margin:0 auto;padding:.25rem;border-radius:999px}
[data-vibeui-block="navbar-033"] [data-part="glow"]{position:absolute;left:0;top:.25rem;height:calc(100% - .5rem);border-radius:999px;background:color-mix(in oklab,var(--vibeui-navbar-033-fg) 9%,transparent);box-shadow:inset 0 0 0 1px var(--vibeui-navbar-033-line);opacity:0;transition:transform .45s var(--vibeui-navbar-033-ease),width .45s var(--vibeui-navbar-033-ease),opacity .3s;pointer-events:none}
[data-vibeui-block="navbar-033"] [data-part="nav"]:hover [data-part="glow"]{opacity:1}
[data-vibeui-block="navbar-033"] [data-part="link"]{position:relative;padding:.45rem .9rem;border-radius:999px;color:var(--vibeui-navbar-033-muted);text-decoration:none;font-weight:500;white-space:nowrap;transition:color .25s}
[data-vibeui-block="navbar-033"] [data-part="link"]:hover{color:var(--vibeui-navbar-033-fg)}
[data-vibeui-block="navbar-033"] [data-part="right"]{display:flex;align-items:center;gap:.5rem;margin-left:auto}
[data-vibeui-block="navbar-033"] [data-part="live"]{display:none;align-items:center;gap:.45rem;padding:.35rem .7rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-navbar-033-live) 10%,transparent);color:color-mix(in oklab,var(--vibeui-navbar-033-live) 70%,var(--vibeui-navbar-033-fg));font-size:.76rem;font-weight:500;white-space:nowrap}
[data-vibeui-block="navbar-033"] [data-part="live"] i{position:relative;width:.45rem;height:.45rem;border-radius:50%;background:var(--vibeui-navbar-033-live)}
[data-vibeui-block="navbar-033"] [data-part="live"] i::after{content:"";position:absolute;inset:-3px;border-radius:50%;border:1px solid var(--vibeui-navbar-033-live);animation:vibeui-navbar-033-ping 1.8s ease-out infinite}
[data-vibeui-block="navbar-033"] [data-part="clock"]{font-family:var(--vibeui-navbar-033-mono);font-variant-numeric:tabular-nums;color:var(--vibeui-navbar-033-fg)}
[data-vibeui-block="navbar-033"] [data-part="login"]{display:none;padding:.45rem .8rem;border-radius:999px;color:var(--vibeui-navbar-033-muted);text-decoration:none;font-weight:500;transition:color .2s}
[data-vibeui-block="navbar-033"] [data-part="login"]:hover{color:var(--vibeui-navbar-033-fg)}
[data-vibeui-block="navbar-033"] [data-part="action"]{display:inline-flex;align-items:center;height:2.5rem;padding:0 1.1rem;border-radius:999px;background:var(--vibeui-navbar-033-fg);color:var(--vibeui-navbar-033-bg);text-decoration:none;font-weight:600;font-size:.86rem;white-space:nowrap;transition:background .3s,color .3s,box-shadow .3s}
[data-vibeui-block="navbar-033"] [data-part="action"]:hover{background:var(--vibeui-navbar-033-accent);color:var(--vibeui-navbar-033-on-accent);box-shadow:0 10px 26px -12px var(--vibeui-navbar-033-accent)}
[data-vibeui-block="navbar-033"] :is(a,button):focus-visible{outline:2px solid var(--vibeui-navbar-033-accent);outline-offset:2px}
[data-vibeui-block="navbar-033"] [data-part="burger"]{display:inline-flex;flex-direction:column;justify-content:center;gap:5px;flex:none;width:2.5rem;height:2.5rem;padding:0;border:0;border-radius:999px;background:color-mix(in oklab,var(--vibeui-navbar-033-fg) 8%,transparent);color:inherit;cursor:pointer}
[data-vibeui-block="navbar-033"] [data-part="burger"] i{display:block;width:.95rem;height:1.5px;margin:0 auto;background:currentColor;border-radius:2px;transition:transform .3s var(--vibeui-navbar-033-ease)}
[data-vibeui-block="navbar-033"] [data-part="burger"][aria-expanded="true"] i:nth-child(1){transform:translateY(3.25px) rotate(45deg)}
[data-vibeui-block="navbar-033"] [data-part="burger"][aria-expanded="true"] i:nth-child(2){transform:translateY(-3.25px) rotate(-45deg)}
[data-vibeui-block="navbar-033"] [data-part="menu"]{display:grid;gap:.15rem;max-width:66rem;margin:.5rem auto 0;padding:.6rem;border-radius:1.5rem;background:color-mix(in oklab,var(--vibeui-navbar-033-bg) 92%,transparent);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);box-shadow:inset 0 0 0 1px var(--vibeui-navbar-033-line),0 24px 50px -24px rgb(0 0 0 / .8);pointer-events:auto;animation:vibeui-navbar-033-menu .3s var(--vibeui-navbar-033-ease)}
[data-vibeui-block="navbar-033"] [data-part="menu"][hidden]{display:none}
[data-vibeui-block="navbar-033"] [data-part="menu"] a{padding:.8rem 1rem;border-radius:1rem;color:var(--vibeui-navbar-033-fg);text-decoration:none;font-weight:500;font-size:1.02rem}
[data-vibeui-block="navbar-033"] [data-part="menu"] a:hover{background:color-mix(in oklab,var(--vibeui-navbar-033-fg) 6%,transparent)}
[data-vibeui-block="navbar-033"] [data-part="menu"] a[data-cta]{margin-top:.3rem;text-align:center;background:var(--vibeui-navbar-033-accent);color:var(--vibeui-navbar-033-on-accent);font-weight:600}
@keyframes vibeui-navbar-033-eq{0%,100%{transform:scaleY(.35)}50%{transform:scaleY(1)}}
@keyframes vibeui-navbar-033-ping{from{transform:scale(.6);opacity:.9}to{transform:scale(2);opacity:0}}
@keyframes vibeui-navbar-033-menu{from{opacity:0;transform:translateY(-8px) scale(.98)}}
@container (min-width: 40rem){[data-vibeui-block="navbar-033"] [data-part="login"]{display:inline}}
@container (min-width: 60rem){[data-vibeui-block="navbar-033"] [data-part="nav"]{display:flex}[data-vibeui-block="navbar-033"] [data-part="burger"],[data-vibeui-block="navbar-033"] [data-part="menu"]{display:none}}
@container (min-width: 74rem){[data-vibeui-block="navbar-033"] [data-part="live"]{display:inline-flex}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-033"] *{animation:none!important;transition:none!important}}`

function clock(total: number) {
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${minutes}:${String(seconds).padStart(2, "0")}`
}

/** Шапка AI-сервиса: плавающая капсула с эквалайзером в лого и живым индикатором созвона. */
export function Navbar033({
  brand = "Сводка",
  brandHref = "#top",
  links = [
    { label: "Как работает", href: "#how" },
    { label: "Попробовать", href: "#sandbox" },
    { label: "Интеграции", href: "#integrations" },
    { label: "Цены", href: "#pricing" },
  ],
  loginLabel = "Войти",
  loginHref = "#login",
  actionLabel = "Начать бесплатно",
  actionHref = "#start",
  liveLabel = "Идёт созвон",
  liveStart = 724,
  sticky = true,
  overlay = false,
  navLabel = "Разделы",
  menuLabel = "Меню",
  menuOpenLabel = "Открыть меню",
  menuCloseLabel = "Закрыть меню",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Navbar033Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const glowRef = useRef<HTMLSpanElement>(null)
  const clockRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Счётчик созвона пишется прямо в DOM: шапка не перерисовывается каждую секунду.
  useEffect(() => {
    if (!liveLabel) return
    let seconds = liveStart
    const timer = window.setInterval(() => {
      seconds += 1
      if (clockRef.current) clockRef.current.textContent = clock(seconds)
    }, 1000)
    return () => window.clearInterval(timer)
  }, [liveLabel, liveStart])

  const follow = (event: PointerEvent<HTMLAnchorElement>) => {
    const glow = glowRef.current
    if (!glow) return
    const link = event.currentTarget
    glow.style.width = `${link.offsetWidth}px`
    glow.style.transform = `translateX(${link.offsetLeft}px)`
  }

  const palette = {
    ...(accent ? { "--vibeui-navbar-033-accent": accent } : null),
    ...(ink ? { "--vibeui-navbar-033-fg": ink } : null),
    ...(background ? { "--vibeui-navbar-033-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-033" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-033" data-tone={tone === "auto" ? undefined : tone} data-sticky={sticky} data-overlay={overlay} data-scrolled={scrolled} className={className} style={palette}>
        <div data-part="capsule">
          <a data-part="brand" href={brandHref}>
            <span data-part="eq" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            {brand}
          </a>
          <nav data-part="nav" aria-label={navLabel}>
            <span ref={glowRef} data-part="glow" aria-hidden="true" />
            {links.map((link) => (
              <a key={link.href} data-part="link" href={link.href} onPointerEnter={follow}>
                {link.label}
              </a>
            ))}
          </nav>
          <div data-part="right">
            {liveLabel ? (
              <span data-part="live">
                <i aria-hidden="true" />
                {liveLabel}
                <span ref={clockRef} data-part="clock">
                  {clock(liveStart)}
                </span>
              </span>
            ) : null}
            {loginLabel ? (
              <a data-part="login" href={loginHref}>
                {loginLabel}
              </a>
            ) : null}
            {actionLabel ? (
              <a data-part="action" href={actionHref}>
                {actionLabel}
              </a>
            ) : null}
            <button data-part="burger" type="button" aria-expanded={menuOpen} aria-controls="vibeui-navbar-033-menu" aria-label={menuOpen ? menuCloseLabel : menuOpenLabel} onClick={() => setMenuOpen((value) => !value)}>
              <i aria-hidden="true" />
              <i aria-hidden="true" />
            </button>
          </div>
        </div>
        <nav data-part="menu" id="vibeui-navbar-033-menu" hidden={!menuOpen} aria-label={menuLabel} onClick={() => setMenuOpen(false)}>
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          {loginLabel ? <a href={loginHref}>{loginLabel}</a> : null}
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

"use client"

import { useEffect, useState, type CSSProperties, type PointerEvent } from "react"

export type Navbar029Link = {
  label: string
  href: string
}

export type Navbar029Props = {
  brand?: string
  brandHref?: string
  /** Подпись рядом с именем: «подкаст о работе». */
  caption?: string
  links?: readonly Navbar029Link[]
  idleLabel?: string
  playingLabel?: string
  actionLabel?: string
  actionHref?: string
  sticky?: boolean
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

// Шапка подкаста: словомарка узким плакатным гротеском, разделы, чип «сейчас
// играет» с тремя прыгающими полосками — он подписан на событие
// `vibeui-player:state` от мини-плеера (podcast-007) и показывает название
// текущего эпизода; в тишине — «в эфире по четвергам». Справа магнитная
// кнопка «Слушать» — тянется к курсору на несколько пикселей. Разделы
// подчёркиваются «резиновой» линией слева направо. При прокрутке — тёмное
// стекло и тонкая линия, шапка при загрузке опускается сверху.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Sofia+Sans+Extra+Condensed:wght@700;800&family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-029"]){
--vibeui-navbar-029-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-029-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-029-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-029-on-accent:oklch(from var(--vibeui-navbar-029-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-029-muted:color-mix(in oklab,var(--vibeui-navbar-029-fg) 60%,var(--vibeui-navbar-029-bg));
--vibeui-navbar-029-line:color-mix(in oklab,var(--vibeui-navbar-029-fg) 12%,transparent);
--vibeui-navbar-029-display:"Sofia Sans Extra Condensed",Impact,"Arial Narrow",sans-serif;
--vibeui-navbar-029-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-navbar-029-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-029"]{color-scheme:dark}
:where([data-vibeui-block="navbar-029"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-029"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-029"]{box-sizing:border-box;position:relative;z-index:50;font-family:var(--vibeui-navbar-029-font);color:var(--vibeui-navbar-029-fg);font-size:.95rem;line-height:1.4;transition:background .3s,box-shadow .3s;animation:vibeui-navbar-029-drop .8s cubic-bezier(.2,.8,.2,1) both}
[data-vibeui-block="navbar-029"][data-sticky="true"]{position:sticky;top:0}
[data-vibeui-block="navbar-029"] *{box-sizing:border-box}
[data-vibeui-block="navbar-029"][data-scrolled="true"]{background:color-mix(in oklab,var(--vibeui-navbar-029-bg) 80%,transparent);backdrop-filter:blur(14px) saturate(1.2);box-shadow:0 1px 0 var(--vibeui-navbar-029-line)}
[data-vibeui-block="navbar-029"] [data-part="row"]{display:flex;align-items:center;justify-content:space-between;gap:.6rem;height:4.25rem;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="navbar-029"] [data-part="brand"]{display:inline-flex;align-items:baseline;gap:.6rem;text-decoration:none;color:inherit;white-space:nowrap}
[data-vibeui-block="navbar-029"] [data-part="brand"] b{font-family:var(--vibeui-navbar-029-display);font-weight:800;font-size:1.7rem;line-height:1;text-transform:uppercase;letter-spacing:.01em;transition:letter-spacing .4s cubic-bezier(.2,.8,.2,1),color .3s}
[data-vibeui-block="navbar-029"] [data-part="brand"]:hover b{letter-spacing:.06em;color:var(--vibeui-navbar-029-accent)}
[data-vibeui-block="navbar-029"] [data-part="brand"] small{font-family:var(--vibeui-navbar-029-mono);font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-navbar-029-muted);display:none}
[data-vibeui-block="navbar-029"] [data-part="nav"]{display:none;gap:1.4rem}
[data-vibeui-block="navbar-029"] [data-part="nav"] a{position:relative;text-decoration:none;color:inherit;font-weight:500;font-size:.9rem;opacity:.85;padding:.2rem 0;transition:opacity .2s,color .2s}
[data-vibeui-block="navbar-029"] [data-part="nav"] a::after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;border-radius:2px;background:var(--vibeui-navbar-029-accent);transform:scaleX(0);transform-origin:right;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="navbar-029"] [data-part="nav"] a:hover{opacity:1;color:var(--vibeui-navbar-029-accent)}
[data-vibeui-block="navbar-029"] [data-part="nav"] a:hover::after{transform:none;transform-origin:left}
[data-vibeui-block="navbar-029"] [data-part="right"]{display:flex;align-items:center;gap:.6rem;min-width:0}
[data-vibeui-block="navbar-029"] [data-part="now"]{display:inline-flex;align-items:center;gap:.55rem;max-width:16rem;padding:.45rem .8rem;border-radius:999px;border:1px solid var(--vibeui-navbar-029-line);font-family:var(--vibeui-navbar-029-mono);font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-navbar-029-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
[data-vibeui-block="navbar-029"] [data-part="now"][data-playing="true"]{color:var(--vibeui-navbar-029-fg);border-color:var(--vibeui-navbar-029-accent)}
[data-vibeui-block="navbar-029"] [data-part="eq"]{display:inline-flex;align-items:flex-end;gap:2px;height:.8rem;flex:none}
[data-vibeui-block="navbar-029"] [data-part="eq"] i{width:3px;height:30%;border-radius:1px;background:var(--vibeui-navbar-029-accent);transform-origin:bottom}
[data-vibeui-block="navbar-029"] [data-part="now"][data-playing="true"] [data-part="eq"] i{animation:vibeui-navbar-029-eq .8s ease-in-out infinite alternate}
[data-vibeui-block="navbar-029"] [data-part="eq"] i:nth-child(2){animation-delay:-.25s}
[data-vibeui-block="navbar-029"] [data-part="eq"] i:nth-child(3){animation-delay:-.5s}
[data-vibeui-block="navbar-029"] [data-part="now"] span{overflow:hidden;text-overflow:ellipsis}
[data-vibeui-block="navbar-029"] [data-part="action"]{display:inline-flex;align-items:center;border-radius:999px;padding:.6rem 1rem;font-weight:600;font-size:.88rem;text-decoration:none;color:var(--vibeui-navbar-029-on-accent);background:var(--vibeui-navbar-029-accent);white-space:nowrap;translate:var(--vibeui-navbar-029-mx,0) var(--vibeui-navbar-029-my,0);transition:translate .3s cubic-bezier(.2,.8,.2,1),scale .3s cubic-bezier(.2,.8,.2,1),box-shadow .3s}
[data-vibeui-block="navbar-029"] [data-part="action"]:hover{scale:1.04;box-shadow:0 10px 24px -10px var(--vibeui-navbar-029-accent)}
[data-vibeui-block="navbar-029"] [data-part="action"]:active{scale:.97}
[data-vibeui-block="navbar-029"] a:focus-visible{outline:2px solid var(--vibeui-navbar-029-accent);outline-offset:3px}
@keyframes vibeui-navbar-029-eq{from{height:30%}to{height:100%}}
@keyframes vibeui-navbar-029-drop{from{opacity:0;translate:0 -100%}}
@container (min-width: 40rem){[data-vibeui-block="navbar-029"] [data-part="brand"] small{display:inline}}
@container (min-width: 56rem){[data-vibeui-block="navbar-029"] [data-part="nav"]{display:flex}}
@container (max-width: 34rem){[data-vibeui-block="navbar-029"] [data-part="now"] span{display:none}[data-vibeui-block="navbar-029"] [data-part="now"]{padding:.45rem .6rem}}
[data-vibeui-block="navbar-029"] [data-part="burger"]{display:inline-flex;flex-direction:column;justify-content:center;gap:5px;flex-shrink:0;width:2.5rem;height:2.5rem;padding:0;border:1px solid var(--vibeui-navbar-029-line);border-radius:999px;background:transparent;color:inherit;cursor:pointer}
[data-vibeui-block="navbar-029"] [data-part="burger"] i{display:block;width:1rem;height:2px;margin:0 auto;background:currentColor;border-radius:2px;transition:transform .25s,opacity .2s}
[data-vibeui-block="navbar-029"] [data-part="burger"][aria-expanded="true"] i:nth-child(1){transform:translateY(7px) rotate(45deg)}
[data-vibeui-block="navbar-029"] [data-part="burger"][aria-expanded="true"] i:nth-child(2){opacity:0}
[data-vibeui-block="navbar-029"] [data-part="burger"][aria-expanded="true"] i:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
[data-vibeui-block="navbar-029"] [data-part="burger"]:focus-visible{outline:2px solid var(--vibeui-navbar-029-accent);outline-offset:2px}
[data-vibeui-block="navbar-029"] [data-part="menu"]{display:grid;gap:.2rem;max-width:80rem;margin:0 auto;padding:.6rem 1.25rem 1.25rem;border-top:1px solid var(--vibeui-navbar-029-line);background:var(--vibeui-navbar-029-bg);animation:vibeui-navbar-029-menu .22s ease-out}
[data-vibeui-block="navbar-029"] [data-part="menu"][hidden]{display:none}
[data-vibeui-block="navbar-029"] [data-part="menu"] a{padding:.8rem .7rem;border-radius:.7rem;color:var(--vibeui-navbar-029-fg);text-decoration:none;font-weight:600;font-size:1.05rem}
[data-vibeui-block="navbar-029"] [data-part="menu"] a:hover{background:color-mix(in oklab,var(--vibeui-navbar-029-fg) 6%,transparent)}
[data-vibeui-block="navbar-029"] [data-part="menu"] a[data-cta]{margin-top:.4rem;text-align:center;background:var(--vibeui-navbar-029-accent);color:var(--vibeui-navbar-029-on-accent)}
@keyframes vibeui-navbar-029-menu{from{opacity:0;transform:translateY(-6px)}}
@container (min-width: 56rem){[data-vibeui-block="navbar-029"] [data-part="burger"],[data-vibeui-block="navbar-029"] [data-part="menu"]{display:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-029"],[data-vibeui-block="navbar-029"] *,[data-vibeui-block="navbar-029"] *::after{animation:none!important;transition:none!important}}`

/** Шапка подкаста с чипом «сейчас играет», подписанным на плеер. */
export function Navbar029({
  brand = "Тихий час",
  brandHref = "#top",
  caption = "подкаст о работе",
  links = [
    { label: "Эпизоды", href: "#episodes" },
    { label: "Гости", href: "#guests" },
    { label: "Где слушать", href: "#listen" },
    { label: "Поддержать", href: "#support" },
  ],
  idleLabel = "в эфире по четвергам",
  playingLabel = "сейчас",
  actionLabel = "Слушать",
  actionHref = "#top",
  sticky = true,
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
}: Navbar029Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [now, setNow] = useState<{ playing: boolean; title: string | null }>({ playing: false, title: null })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    const onState = (event: Event) => {
      const detail = (event as CustomEvent<{ playing?: boolean; title?: string | null }>).detail
      setNow({ playing: Boolean(detail?.playing), title: detail?.title ?? null })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("vibeui-player:state", onState)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("vibeui-player:state", onState)
    }
  }, [])

  const magnet = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType === "touch") return
    const rect = event.currentTarget.getBoundingClientRect()
    const dx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1)) * 5
    const dy = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1)) * 4
    event.currentTarget.style.setProperty("--vibeui-navbar-029-mx", `${dx.toFixed(1)}px`)
    event.currentTarget.style.setProperty("--vibeui-navbar-029-my", `${dy.toFixed(1)}px`)
  }
  const unmagnet = (event: PointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.setProperty("--vibeui-navbar-029-mx", "0px")
    event.currentTarget.style.setProperty("--vibeui-navbar-029-my", "0px")
  }

  const palette = {
    ...(accent ? { "--vibeui-navbar-029-accent": accent } : null),
    ...(ink ? { "--vibeui-navbar-029-fg": ink } : null),
    ...(background ? { "--vibeui-navbar-029-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-029" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-029" data-tone={tone === "auto" ? undefined : tone} data-sticky={sticky} data-scrolled={scrolled} className={className} style={palette}>
        <div data-part="row">
          <a data-part="brand" href={brandHref}>
            <b>{brand}</b>
            {caption ? <small>{caption}</small> : null}
          </a>
          <nav data-part="nav" aria-label={navLabel}>
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div data-part="right">
            <div data-part="now" data-playing={now.playing} aria-live="polite">
              <span data-part="eq" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span>{now.playing && now.title ? `${playingLabel}: ${now.title}` : idleLabel}</span>
            </div>
            {actionLabel ? (
              <a data-part="action" href={actionHref} onPointerMove={magnet} onPointerLeave={unmagnet}>
                {actionLabel}
              </a>
            ) : null}
          </div>
          <button data-part="burger" type="button" aria-expanded={menuOpen} aria-controls="vibeui-navbar-029-menu" aria-label={menuOpen ? menuCloseLabel : menuOpenLabel} onClick={() => setMenuOpen((value) => !value)}>
            <i aria-hidden="true" />
            <i aria-hidden="true" />
            <i aria-hidden="true" />
          </button>
        </div>
        <nav data-part="menu" id="vibeui-navbar-029-menu" hidden={!menuOpen} aria-label={menuLabel} onClick={() => setMenuOpen(false)}>
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

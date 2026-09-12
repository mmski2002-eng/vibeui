"use client"

import { useCallback, useEffect, useRef } from "react"
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react"

type Navbar002Link = {
  label: string
  href: string
  current?: boolean
}

export type Navbar002Props = {
  brand?: string
  /** Буква в знаке: компонент несёт русскую. */
  markLabel?: string
  /** Подпись навигации для скринридера: компонент несёт русскую. */
  navLabel?: string
  links?: Navbar002Link[]
  loginLabel?: string
  loginHref?: string
  actionLabel?: string
  actionHref?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Плотная шапка: меню собрано в одну «пилюлю», поэтому навигация читается
// как единый объект, а не как россыпь ссылок. Пилюля — вдавленный жёлоб с
// внутренней тенью, активный раздел — выпуклая каретка поверх него; каретка
// переезжает под курсором и фокусом, поэтому ряд ощущается механизмом, а не
// набором состояний. В узкой раскладке пилюля не прячется в меню, а
// превращается в горизонтальную ленту с прокруткой — на контентных сайтах
// разделы должны оставаться на виду.
//
// Клиентский JS нужен только для позиции каретки. До гидратации активный
// раздел подсвечен обычным фоном, поэтому шапка приходит с сервера рабочей.
const STYLES = `
:where([data-vibeui-block="navbar-002"]){
--vibeui-navbar-002-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-002-rail:light-dark(#f2f2f2,#242424);
--vibeui-navbar-002-glide:light-dark(#ffffff,#343434);
--vibeui-navbar-002-ink:light-dark(#000000,#ffffff);
--vibeui-navbar-002-muted:light-dark(color-mix(in oklab,#000000 62%,#ffffff),color-mix(in oklab,#ffffff 70%,#1a1a1a));
--vibeui-navbar-002-border:light-dark(color-mix(in oklab,#000000 11%,transparent),color-mix(in oklab,#ffffff 15%,transparent));
--vibeui-navbar-002-well:light-dark(rgb(0 0 0 / 9%),rgb(0 0 0 / 46%));
--vibeui-navbar-002-sheen:light-dark(rgb(255 255 255 / 92%),rgb(255 255 255 / 10%));
--vibeui-navbar-002-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-002-accent-fg:oklch(from var(--vibeui-navbar-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-navbar-002-ease:cubic-bezier(.32,.72,0,1);
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-002"]{color-scheme:dark}
:where([data-vibeui-block="navbar-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-002"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-navbar-002-bg);color:var(--vibeui-navbar-002-ink);
border-bottom:1px solid var(--vibeui-navbar-002-border);
font-family:var(--vibeui-navbar-002-font);
font-feature-settings:"cv11","ss01";
}
[data-vibeui-block="navbar-002"] *{box-sizing:border-box}
[data-vibeui-block="navbar-002"] [data-part="shell"]{
display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;
max-width:82rem;margin:0 auto;padding:0.75rem 1rem;
}
[data-vibeui-block="navbar-002"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5625rem;flex:none;
color:inherit;text-decoration:none;font-size:1.0625rem;font-weight:680;letter-spacing:-0.025em;
}
[data-vibeui-block="navbar-002"] [data-part="mark"]{
width:1.875rem;height:1.875rem;border-radius:0.6875rem;flex:none;
display:grid;place-items:center;
background:var(--vibeui-navbar-002-accent);color:oklch(from var(--vibeui-navbar-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-size:0.8125rem;font-weight:800;
box-shadow:0 0.25rem 0.75rem color-mix(in oklab,var(--vibeui-navbar-002-accent) 46%,transparent),
inset 0 1px 0 rgb(255 255 255 / 40%);
transition:transform .22s var(--vibeui-navbar-002-ease);
}
[data-vibeui-block="navbar-002"] [data-part="brand"]:hover [data-part="mark"]{transform:rotate(-6deg) scale(1.06)}

[data-vibeui-block="navbar-002"] [data-part="rail"]{
order:3;flex:1 1 100%;position:relative;
display:flex;align-items:center;gap:0.125rem;
padding:0.3125rem;border:1px solid var(--vibeui-navbar-002-border);border-radius:999px;
background:var(--vibeui-navbar-002-rail);
box-shadow:inset 0 1px 2px var(--vibeui-navbar-002-well);
overflow-x:auto;scrollbar-width:none;
}
[data-vibeui-block="navbar-002"] [data-part="rail"]::-webkit-scrollbar{display:none}
[data-vibeui-block="navbar-002"] [data-part="rail"] a{
position:relative;z-index:1;flex:none;padding:0.4375rem 0.9375rem;border-radius:999px;
color:var(--vibeui-navbar-002-muted);text-decoration:none;
font-size:0.875rem;font-weight:530;white-space:nowrap;
transition:color .13s ease;
}
[data-vibeui-block="navbar-002"] [data-part="rail"] a:hover,
[data-vibeui-block="navbar-002"] [data-part="rail"] a[aria-current="page"]{
color:var(--vibeui-navbar-002-ink);
}
[data-vibeui-block="navbar-002"] [data-part="rail"]:not([data-ready]) a[aria-current="page"]{
background:var(--vibeui-navbar-002-glide);
}
[data-vibeui-block="navbar-002"] [data-part="glider"]{
position:absolute;top:0.3125rem;bottom:0.3125rem;left:0;z-index:0;
width:var(--vibeui-navbar-002-glider-w,0);
transform:translate3d(var(--vibeui-navbar-002-glider-x,0),0,0);
border-radius:999px;background:var(--vibeui-navbar-002-glide);
box-shadow:0 1px 2px var(--vibeui-navbar-002-well),inset 0 1px 0 var(--vibeui-navbar-002-sheen);
opacity:0;pointer-events:none;
}
[data-vibeui-block="navbar-002"] [data-part="rail"][data-ready] [data-part="glider"]{
opacity:1;
transition:transform .34s var(--vibeui-navbar-002-ease),width .34s var(--vibeui-navbar-002-ease),opacity .18s ease;
}

[data-vibeui-block="navbar-002"] [data-part="actions"]{
display:flex;align-items:center;gap:0.375rem;margin-left:auto;flex:none;
}
[data-vibeui-block="navbar-002"] [data-part="login"]{
position:relative;padding:0.4375rem 0.75rem;border-radius:0.6875rem;
color:var(--vibeui-navbar-002-muted);text-decoration:none;font-size:0.875rem;font-weight:530;
transition:color .13s ease;
}
[data-vibeui-block="navbar-002"] [data-part="login"]::after{
content:"";position:absolute;left:0.75rem;right:0.75rem;bottom:0.25rem;height:1.5px;
background:currentColor;border-radius:2px;
transform:scaleX(0);transform-origin:center;
transition:transform .24s var(--vibeui-navbar-002-ease);
}
[data-vibeui-block="navbar-002"] [data-part="login"]:hover{color:var(--vibeui-navbar-002-ink)}
[data-vibeui-block="navbar-002"] [data-part="login"]:hover::after{transform:scaleX(1)}

[data-vibeui-block="navbar-002"] [data-part="action"]{
position:relative;overflow:hidden;
display:inline-flex;align-items:center;min-height:2.375rem;padding:0.25rem 1.0625rem;border-radius:0.6875rem;
background:var(--vibeui-navbar-002-accent);color:oklch(from var(--vibeui-navbar-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
text-decoration:none;font-size:0.875rem;font-weight:650;white-space:nowrap;letter-spacing:-0.01em;
box-shadow:0 0.3125rem 1rem color-mix(in oklab,var(--vibeui-navbar-002-accent) 40%,transparent),
inset 0 1px 0 rgb(255 255 255 / 40%);
transition:transform .18s var(--vibeui-navbar-002-ease),box-shadow .25s ease;
}
[data-vibeui-block="navbar-002"] [data-part="action"]::before{
content:"";position:absolute;inset:0;pointer-events:none;
background:radial-gradient(5rem 5rem at var(--vibeui-navbar-002-mx,50%) var(--vibeui-navbar-002-my,50%),
rgb(255 255 255 / 50%),transparent 70%);
opacity:0;transition:opacity .2s ease;
}
[data-vibeui-block="navbar-002"] [data-part="action"]:hover{
transform:translateY(-1px);
box-shadow:0 0.5rem 1.5rem color-mix(in oklab,var(--vibeui-navbar-002-accent) 50%,transparent),
inset 0 1px 0 rgb(255 255 255 / 50%);
}
[data-vibeui-block="navbar-002"] [data-part="action"]:hover::before{opacity:1}
[data-vibeui-block="navbar-002"] [data-part="action"] span{position:relative}

[data-vibeui-block="navbar-002"] a:focus-visible{outline:2px solid var(--vibeui-navbar-002-accent);outline-offset:3px}
@container (min-width: 54rem){
[data-vibeui-block="navbar-002"] [data-part="shell"]{padding:0.875rem 2rem;gap:1.5rem;flex-wrap:nowrap}
[data-vibeui-block="navbar-002"] [data-part="rail"]{order:0;flex:0 1 auto;margin:0 auto;overflow:visible}
[data-vibeui-block="navbar-002"] [data-part="actions"]{margin-left:0}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Navbar002Link[] = [
  { label: "Продукт", href: "#product", current: true },
  { label: "Решения", href: "#solutions" },
  { label: "Тарифы", href: "#pricing" },
  { label: "Клиенты", href: "#customers" },
  { label: "Блог", href: "#blog" },
]

/** Шапка с меню-пилюлей: разделы всегда на виду, каретка едет за курсором. */
export function Navbar002({
  brand = "Контур",
  markLabel = "К",
  navLabel = "Разделы сайта",
  links = DEFAULT_LINKS,
  loginLabel = "Войти",
  loginHref = "#login",
  actionLabel = "Демо",
  actionHref = "#demo",
  tone = "auto",
  accent,
  className,
  style,
}: Navbar002Props) {
  const railRef = useRef<HTMLElement>(null)

  const placeGlider = useCallback((target?: HTMLElement | null) => {
    const rail = railRef.current
    if (!rail) return

    const item =
      target ?? rail.querySelector<HTMLElement>('a[aria-current="page"]')

    if (!item) {
      rail.removeAttribute("data-ready")
      return
    }

    rail.style.setProperty(
      "--vibeui-navbar-002-glider-x",
      `${item.offsetLeft - rail.clientLeft}px`,
    )
    rail.style.setProperty(
      "--vibeui-navbar-002-glider-w",
      `${item.offsetWidth}px`,
    )
    rail.setAttribute("data-ready", "on")
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    placeGlider()

    const observer = new ResizeObserver(() => placeGlider())
    observer.observe(rail)

    return () => observer.disconnect()
  }, [placeGlider, links])

  const trackPointer = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty(
      "--vibeui-navbar-002-mx",
      `${event.clientX - rect.left}px`,
    )
    event.currentTarget.style.setProperty(
      "--vibeui-navbar-002-my",
      `${event.clientY - rect.top}px`,
    )
  }

  const palette = {
    ...(accent ? { "--vibeui-navbar-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-002" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-002"
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <a data-part="brand" href="#top">
            <span data-part="mark" aria-hidden="true">
              {markLabel}
            </span>
            {brand}
          </a>
          <nav
            ref={railRef}
            data-part="rail"
            aria-label={navLabel}
            onPointerLeave={() => placeGlider()}
          >
            <span data-part="glider" aria-hidden="true" />
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={link.current ? "page" : undefined}
                onPointerEnter={(event) => placeGlider(event.currentTarget)}
                onFocus={(event) => placeGlider(event.currentTarget)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div data-part="actions">
            <a data-part="login" href={loginHref}>
              {loginLabel}
            </a>
            <a data-part="action" href={actionHref} onPointerMove={trackPointer}>
              <span>{actionLabel}</span>
            </a>
          </div>
        </div>
      </header>
    </>
  )
}

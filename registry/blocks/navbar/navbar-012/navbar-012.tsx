"use client"

import { useCallback, useEffect, useRef } from "react"
import type { CSSProperties } from "react"

type Navbar012Link = {
  label: string
  href: string
  current?: boolean
}

export type Navbar012Props = {
  /** Крупный текстовый знак издания. */
  brand?: string
  /** Служебная строка над знаком. */
  dateline?: string
  /** Правая половина служебной строки: выпуск, тираж, город. */
  issue?: string
  /** Рубрики под знаком. */
  sections?: Navbar012Link[]
  sectionsLabel?: string
  subscribeLabel?: string
  subscribeHref?: string
  searchLabel?: string
  searchAction?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Редакционная шапка с крупным названием: текстовый знак засечками по
// центру, над ним тихая служебная строка с датой и выпуском, под ним
// строка рубрик между линейками. Знак набран засечным шрифтом не для
// красоты: газетная шапка узнаётся именно этим контрастом с сухим
// интерфейсным гротеском рубрик.
//
// Белая бумажная композиция; оранжевый — только у подписки и активной
// рубрики. Знак масштабируется от ширины блока и не обрезается.
// Клиентский JS нужен для каретки рубрик; до гидратации активная рубрика
// подчёркнута статической линией.
const STYLES = `
:where([data-vibeui-block="navbar-012"]){
--vibeui-navbar-012-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-012-ink:light-dark(#000000,#ffffff);
--vibeui-navbar-012-muted:light-dark(color-mix(in oklab,#000000 56%,#ffffff),color-mix(in oklab,#ffffff 64%,#1a1a1a));
--vibeui-navbar-012-line:light-dark(color-mix(in oklab,#000000 16%,transparent),color-mix(in oklab,#ffffff 20%,transparent));
--vibeui-navbar-012-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-012-on-accent:oklch(from var(--vibeui-navbar-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-navbar-012-display:ui-serif,Georgia,"Times New Roman",Times,serif;
--vibeui-navbar-012-ease:cubic-bezier(.32,.72,0,1);
--vibeui-navbar-012-dur-1:130ms;
--vibeui-navbar-012-dur-2:180ms;
--vibeui-navbar-012-dur-3:240ms;
--vibeui-navbar-012-dur-4:340ms;
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-012"]{color-scheme:dark}
:where([data-vibeui-block="navbar-012"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-012"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-012"]{
display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-012-bg);color:var(--vibeui-navbar-012-ink);
border-bottom:2px solid var(--vibeui-navbar-012-ink);
font-family:var(--vibeui-navbar-012-font);
font-feature-settings:"cv11","ss01";
}
[data-vibeui-block="navbar-012"] *{box-sizing:border-box}
[data-vibeui-block="navbar-012"] [data-part="shell"]{
max-width:82rem;margin:0 auto;padding:0.75rem 1rem 0;
display:flex;flex-direction:column;
}

[data-vibeui-block="navbar-012"] [data-part="service"]{
display:flex;align-items:center;gap:0.75rem;
padding-bottom:0.6875rem;border-bottom:1px solid var(--vibeui-navbar-012-line);
font-size:0.6875rem;font-weight:560;letter-spacing:0.09em;text-transform:uppercase;
color:var(--vibeui-navbar-012-muted);
}
[data-vibeui-block="navbar-012"] [data-part="issue"]{
display:none;padding-left:0.75rem;border-left:1px solid var(--vibeui-navbar-012-line);
}
[data-vibeui-block="navbar-012"] [data-part="subscribe"]{
margin-left:auto;flex:none;
display:inline-flex;align-items:center;
padding:0.3125rem 0.75rem;border-radius:999px;
background:var(--vibeui-navbar-012-accent);color:oklch(from var(--vibeui-navbar-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
text-decoration:none;
font-size:0.6875rem;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;
box-shadow:0 0.1875rem 0.625rem color-mix(in oklab,var(--vibeui-navbar-012-accent) 40%,transparent),
inset 0 1px 0 color-mix(in oklab,#ffffff 42%,transparent);
transition:transform var(--vibeui-navbar-012-dur-2) var(--vibeui-navbar-012-ease),box-shadow var(--vibeui-navbar-012-dur-3) ease;
}
[data-vibeui-block="navbar-012"] [data-part="subscribe"]:hover{
transform:translateY(-1px);
box-shadow:0 0.375rem 1rem color-mix(in oklab,var(--vibeui-navbar-012-accent) 50%,transparent),
inset 0 1px 0 color-mix(in oklab,#ffffff 52%,transparent);
}

[data-vibeui-block="navbar-012"] [data-part="brand"]{
display:block;text-align:center;color:inherit;text-decoration:none;
padding:clamp(0.875rem,2.6cqi,1.75rem) 0 clamp(0.75rem,2.2cqi,1.375rem);
font-family:var(--vibeui-navbar-012-display);
font-size:clamp(2.25rem,8.4cqi,5rem);line-height:0.92;
letter-spacing:-0.03em;font-weight:700;
}

[data-vibeui-block="navbar-012"] [data-part="rubrics"]{
position:relative;display:flex;align-items:center;gap:0.25rem;flex-wrap:nowrap;
justify-content:flex-start;overflow-x:auto;scrollbar-width:none;
border-top:1px solid var(--vibeui-navbar-012-line);
}
[data-vibeui-block="navbar-012"] [data-part="rubrics"]::-webkit-scrollbar{display:none}
[data-vibeui-block="navbar-012"] [data-part="rubrics"] a{
position:relative;z-index:1;flex:none;padding:0.75rem 0.8125rem;
color:var(--vibeui-navbar-012-muted);text-decoration:none;
font-size:0.8125rem;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;
white-space:nowrap;
transition:color var(--vibeui-navbar-012-dur-1) ease;
}
[data-vibeui-block="navbar-012"] [data-part="rubrics"] a:hover,
[data-vibeui-block="navbar-012"] [data-part="rubrics"] a[aria-current="page"]{
color:var(--vibeui-navbar-012-ink);
}
[data-vibeui-block="navbar-012"] [data-part="rubrics"]:not([data-ready]) a[aria-current="page"]{
box-shadow:inset 0 -3px 0 var(--vibeui-navbar-012-accent);
}
[data-vibeui-block="navbar-012"] [data-part="glider"]{
position:absolute;left:0;bottom:0;z-index:0;height:3px;
width:var(--vibeui-navbar-012-glider-w,0);
transform:translate3d(var(--vibeui-navbar-012-glider-x,0),0,0);
background:var(--vibeui-navbar-012-accent);
opacity:0;pointer-events:none;color:oklch(from var(--vibeui-navbar-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="navbar-012"] [data-part="rubrics"][data-ready] [data-part="glider"]{
opacity:1;
transition:transform var(--vibeui-navbar-012-dur-4) var(--vibeui-navbar-012-ease),width var(--vibeui-navbar-012-dur-4) var(--vibeui-navbar-012-ease),opacity var(--vibeui-navbar-012-dur-2) ease;
}

[data-vibeui-block="navbar-012"] [data-part="rubrics"] a[data-part="search"]{
flex:none;margin-left:auto;position:relative;display:inline-flex;align-items:center;justify-content:center;
width:2.5rem;height:2.5rem;color:var(--vibeui-navbar-012-ink);
transition:color var(--vibeui-navbar-012-dur-1) ease,transform var(--vibeui-navbar-012-dur-2) var(--vibeui-navbar-012-ease);
}
[data-vibeui-block="navbar-012"] a[data-part="search"]:hover{
color:var(--vibeui-navbar-012-accent);transform:scale(1.08);
}
[data-vibeui-block="navbar-012"] a[data-part="search"] svg{width:1.125rem;height:1.125rem}
[data-vibeui-block="navbar-012"] a:focus-visible{
outline:2px solid var(--vibeui-navbar-012-accent);outline-offset:3px;
}
@container (min-width: 40rem){
[data-vibeui-block="navbar-012"] [data-part="issue"]{display:inline}
}
@container (min-width: 52rem){
[data-vibeui-block="navbar-012"] [data-part="shell"]{padding:0.875rem 2rem 0}
[data-vibeui-block="navbar-012"] [data-part="rubrics"]{justify-content:center}
[data-vibeui-block="navbar-012"] [data-part="rubrics"] a[data-part="search"]{
position:absolute;right:0;top:50%;margin-left:0;transform:translateY(-50%);
}
[data-vibeui-block="navbar-012"] [data-part="rubrics"] a[data-part="search"]:hover{
transform:translateY(-50%) scale(1.08);
}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SECTIONS: Navbar012Link[] = [
  { label: "Главное", href: "#main", current: true },
  { label: "Практика", href: "#practice" },
  { label: "Люди", href: "#people" },
  { label: "Обзоры", href: "#reviews" },
  { label: "Мнения", href: "#opinions" },
  { label: "Архив", href: "#archive" },
]

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="m16.5 16.5 4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Редакционная шапка: крупный засечный знак, дата и строка рубрик. */
export function Navbar012({
  brand = "Сетка",
  dateline = "Среда, 10 сентября 2026",
  issue = "Выпуск 184",
  sections = DEFAULT_SECTIONS,
  sectionsLabel = "Рубрики",
  subscribeLabel = "Подписаться",
  subscribeHref = "#subscribe",
  searchLabel = "Поиск по изданию",
  searchAction = "#search",
  tone = "auto",
  accent,
  className,
  style,
}: Navbar012Props) {
  const rubricsRef = useRef<HTMLElement>(null)

  const placeGlider = useCallback((target?: HTMLElement | null) => {
    const row = rubricsRef.current
    if (!row) return

    const item =
      target ?? row.querySelector<HTMLElement>('a[aria-current="page"]')

    if (!item) {
      row.removeAttribute("data-ready")
      return
    }

    row.style.setProperty(
      "--vibeui-navbar-012-glider-x",
      `${item.offsetLeft - row.clientLeft}px`,
    )
    row.style.setProperty(
      "--vibeui-navbar-012-glider-w",
      `${item.offsetWidth}px`,
    )
    row.setAttribute("data-ready", "on")
  }, [])

  useEffect(() => {
    const row = rubricsRef.current
    if (!row) return

    placeGlider()

    const observer = new ResizeObserver(() => placeGlider())
    observer.observe(row)

    return () => observer.disconnect()
  }, [placeGlider, sections])

  const palette = {
    ...(accent ? { "--vibeui-navbar-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-012" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-012"
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="service">
            <span>{dateline}</span>
            {issue ? <span data-part="issue">{issue}</span> : null}
            <a data-part="subscribe" href={subscribeHref}>
              {subscribeLabel}
            </a>
          </div>

          <a data-part="brand" href="#top">
            {brand}
          </a>

          <nav
            ref={rubricsRef}
            data-part="rubrics"
            aria-label={sectionsLabel}
            onPointerLeave={() => placeGlider()}
          >
            <span data-part="glider" aria-hidden="true" />
            {sections.map((section) => (
              <a
                key={section.href}
                href={section.href}
                aria-current={section.current ? "page" : undefined}
                onPointerEnter={(event) => placeGlider(event.currentTarget)}
                onFocus={(event) => placeGlider(event.currentTarget)}
              >
                {section.label}
              </a>
            ))}
            <a data-part="search" href={searchAction} aria-label={searchLabel}>
              <SearchIcon />
            </a>
          </nav>
        </div>
      </header>
    </>
  )
}

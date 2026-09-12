"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"

type Navbar011Tab = {
  label: string
  href: string
  current?: boolean
}

export type Navbar011Props = {
  brand?: string
  markLabel?: string
  /** Разделы каталога над поиском; пустой массив убирает ряд. */
  tabs?: Navbar011Tab[]
  tabsLabel?: string
  /** Подпись поля «что». */
  whatLabel?: string
  whatPlaceholder?: string
  /** Подпись поля «где». */
  whereLabel?: string
  wherePlaceholder?: string
  /** Подпись поля «когда»; пустая строка убирает поле. */
  whenLabel?: string
  whenPlaceholder?: string
  searchLabel?: string
  /** Адрес обработчика поиска принимающего проекта. */
  searchAction?: string
  loginLabel?: string
  loginHref?: string
  /** Пункты меню под кнопкой входа. Пустой массив делает её обычной ссылкой. */
  userMenu?: Navbar011Tab[]
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Шапка каталога с местом и параметрами: ряд разделов, под ним крупный
// объединённый поиск «что / где / когда» одной капсулой. Капсула — главный
// объект страницы, поэтому она приподнята тенью, а активное поле не просто
// красится, а подсвечивается: в момент ввода видно, какое из трёх полей
// принимает текст. Раздел помечает каретка, переезжающая под курсором.
//
// Настоящая форма: три поля с разделителями и кнопкой submit, Enter
// отправляет запрос. Состояние и выдачу обслуживает принимающий проект.
// Поле «когда» необязательно — каталогу специалистов даты не нужны.
// Клиентский JS нужен только для каретки разделов.
const STYLES = `
:where([data-vibeui-block="navbar-011"]){
--vibeui-navbar-011-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-011-ink:light-dark(#000000,#ffffff);
--vibeui-navbar-011-muted:light-dark(color-mix(in oklab,#000000 60%,#ffffff),color-mix(in oklab,#ffffff 68%,#1a1a1a));
--vibeui-navbar-011-line:light-dark(color-mix(in oklab,#000000 11%,transparent),color-mix(in oklab,#ffffff 15%,transparent));
--vibeui-navbar-011-hover:light-dark(color-mix(in oklab,#000000 5%,transparent),color-mix(in oklab,#ffffff 9%,transparent));
--vibeui-navbar-011-field:light-dark(#f2f2f2,color-mix(in oklab,#ffffff 8%,transparent));
--vibeui-navbar-011-sheen:light-dark(color-mix(in oklab,#ffffff 92%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-navbar-011-shadow:light-dark(0 1rem 2.5rem color-mix(in oklab,#000000 15%,transparent),0 1rem 2.5rem color-mix(in oklab,#000000 62%,transparent));
--vibeui-navbar-011-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-011-on-accent:oklch(from var(--vibeui-navbar-011-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-navbar-011-ease:cubic-bezier(.32,.72,0,1);
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-011"]{color-scheme:dark}
:where([data-vibeui-block="navbar-011"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-011"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-011"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-011-bg);color:var(--vibeui-navbar-011-ink);
border-bottom:1px solid var(--vibeui-navbar-011-line);
font-family:var(--vibeui-navbar-011-font);
font-feature-settings:"cv11","ss01";
}
[data-vibeui-block="navbar-011"] *{box-sizing:border-box}
[data-vibeui-block="navbar-011"] [data-part="shell"]{
display:flex;align-items:center;flex-wrap:wrap;gap:0.75rem 1rem;
max-width:82rem;margin:0 auto;padding:0.875rem 1rem 1.125rem;
}

[data-vibeui-block="navbar-011"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.625rem;flex:none;
color:inherit;text-decoration:none;font-size:1.0625rem;font-weight:680;letter-spacing:-0.025em;
}
[data-vibeui-block="navbar-011"] [data-part="mark"]{
width:1.875rem;height:1.875rem;flex:none;display:grid;place-items:center;border-radius:999px;
background:var(--vibeui-navbar-011-accent);color:oklch(from var(--vibeui-navbar-011-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-size:0.8125rem;font-weight:800;
box-shadow:0 0.25rem 0.75rem color-mix(in oklab,var(--vibeui-navbar-011-accent) 44%,transparent),
inset 0 1px 0 color-mix(in oklab,#ffffff 42%,transparent);
transition:transform .22s var(--vibeui-navbar-011-ease);
}
[data-vibeui-block="navbar-011"] [data-part="brand"]:hover [data-part="mark"]{transform:rotate(-8deg) scale(1.06)}

[data-vibeui-block="navbar-011"] [data-part="tabs"]{
order:1;position:relative;display:none;align-items:center;gap:0.125rem;margin:0 auto;
}
[data-vibeui-block="navbar-011"] [data-part="tabs"] a{
position:relative;z-index:1;padding:0.4375rem 0.875rem;border-radius:999px;
color:var(--vibeui-navbar-011-muted);text-decoration:none;
font-size:0.9375rem;font-weight:540;white-space:nowrap;
transition:color .13s ease;
}
[data-vibeui-block="navbar-011"] [data-part="tabs"] a:hover,
[data-vibeui-block="navbar-011"] [data-part="tabs"] a[aria-current="page"]{
color:var(--vibeui-navbar-011-ink);
}
[data-vibeui-block="navbar-011"] [data-part="tabs"]:not([data-ready]) a[aria-current="page"]{
background:var(--vibeui-navbar-011-hover);
}
[data-vibeui-block="navbar-011"] [data-part="glider"]{
position:absolute;top:0;bottom:0;left:0;z-index:0;
width:var(--vibeui-navbar-011-glider-w,0);
transform:translate3d(var(--vibeui-navbar-011-glider-x,0),0,0);
border-radius:999px;background:var(--vibeui-navbar-011-hover);
opacity:0;pointer-events:none;
}
[data-vibeui-block="navbar-011"] [data-part="tabs"][data-ready] [data-part="glider"]{
opacity:1;
transition:transform .32s var(--vibeui-navbar-011-ease),width .32s var(--vibeui-navbar-011-ease),opacity .18s ease;
}

[data-vibeui-block="navbar-011"] [data-part="account"]{
position:relative;margin-left:auto;flex:none;order:2;
}
[data-vibeui-block="navbar-011"] [data-part="login"]{
cursor:pointer;background:transparent;font:inherit;
display:inline-flex;align-items:center;gap:0.5rem;
min-height:2.5rem;padding:0.25rem 0.5rem 0.25rem 0.9375rem;
border:1px solid var(--vibeui-navbar-011-line);border-radius:999px;
color:var(--vibeui-navbar-011-ink);text-decoration:none;
font-size:0.875rem;font-weight:560;
box-shadow:0 0.125rem 0.5rem color-mix(in oklab,#000000 6%,transparent);
transition:box-shadow .25s ease,border-color .2s ease;
}
[data-vibeui-block="navbar-011"] [data-part="login"]:hover{
border-color:color-mix(in oklab,#000000 18%,transparent);
box-shadow:0 0.375rem 1rem color-mix(in oklab,#000000 12%,transparent);
}
[data-vibeui-block="navbar-011"] [data-part="face"]{
width:1.75rem;height:1.75rem;flex:none;display:grid;place-items:center;border-radius:999px;
background:#1a1a1a;color:#ffffff;
}
[data-vibeui-block="navbar-011"] [data-part="face"] svg{width:1rem;height:1rem}
[data-vibeui-block="navbar-011"] [data-part="account-menu"]{
position:absolute;right:0;top:calc(100% + 0.5rem);z-index:60;min-width:14rem;
background:var(--vibeui-navbar-011-bg);
border:1px solid var(--vibeui-navbar-011-line);border-radius:1rem;
box-shadow:var(--vibeui-navbar-011-shadow);
padding:0.375rem;display:flex;flex-direction:column;
transform-origin:top right;
transition:opacity .18s ease,transform .24s var(--vibeui-navbar-011-ease);
}
[data-vibeui-block="navbar-011"] [data-part="account-menu"][data-open="false"]{
opacity:0;transform:translateY(-0.375rem) scale(.98);pointer-events:none;
}
[data-vibeui-block="navbar-011"] [data-part="account-menu"] a{
padding:0.625rem 0.75rem;border-radius:0.625rem;
color:var(--vibeui-navbar-011-ink);text-decoration:none;
font-size:0.9375rem;font-weight:540;
transition:background-color .14s ease;
}
[data-vibeui-block="navbar-011"] [data-part="account-menu"] a:hover{background:var(--vibeui-navbar-011-hover)}
[data-vibeui-block="navbar-011"] [data-part="account-menu"] a:first-child{font-weight:620}

[data-vibeui-block="navbar-011"] [data-part="search"]{
order:3;flex:1 1 100%;
display:flex;flex-direction:column;
border:1px solid var(--vibeui-navbar-011-line);border-radius:1.5rem;
background:var(--vibeui-navbar-011-bg);
box-shadow:0 0.75rem 2rem color-mix(in oklab,#000000 11%,transparent),
inset 0 1px 0 var(--vibeui-navbar-011-sheen);
overflow:hidden;
transition:box-shadow .3s ease;
}
[data-vibeui-block="navbar-011"] [data-part="search"]:focus-within{
box-shadow:0 1rem 2.5rem color-mix(in oklab,#000000 16%,transparent),
inset 0 1px 0 var(--vibeui-navbar-011-sheen);
}
[data-vibeui-block="navbar-011"] [data-part="field"]{
position:relative;display:flex;flex-direction:column;gap:0.125rem;
padding:0.6875rem 1.125rem;min-width:0;
border-bottom:1px solid var(--vibeui-navbar-011-line);
transition:background-color .2s ease;
}
[data-vibeui-block="navbar-011"] [data-part="field"]:hover{background:var(--vibeui-navbar-011-hover)}
[data-vibeui-block="navbar-011"] [data-part="field"]:focus-within{
background:color-mix(in oklab,var(--vibeui-navbar-011-accent) 8%,transparent);
}
[data-vibeui-block="navbar-011"] [data-part="field"]::after{
content:"";position:absolute;left:1.125rem;right:1.125rem;bottom:0;height:2px;border-radius:2px;
background:var(--vibeui-navbar-011-accent);
transform:scaleX(0);transform-origin:left;
transition:transform .3s var(--vibeui-navbar-011-ease);color:oklch(from var(--vibeui-navbar-011-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="navbar-011"] [data-part="field"]:focus-within::after{transform:scaleX(1)}
[data-vibeui-block="navbar-011"] [data-part="field"] span{
font-size:0.6875rem;font-weight:680;letter-spacing:0.07em;text-transform:uppercase;
}
[data-vibeui-block="navbar-011"] [data-part="field"] input{
border:0;padding:0;background:transparent;min-width:0;min-height:1.5rem;
font:inherit;font-size:0.9375rem;color:var(--vibeui-navbar-011-ink);
}
[data-vibeui-block="navbar-011"] [data-part="field"] input::placeholder{color:var(--vibeui-navbar-011-muted)}
[data-vibeui-block="navbar-011"] [data-part="field"] input:focus-visible{outline:none}

[data-vibeui-block="navbar-011"] [data-part="submit"]{
appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
min-height:3rem;margin:0.4375rem;border-radius:1rem;
background:var(--vibeui-navbar-011-accent);color:oklch(from var(--vibeui-navbar-011-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font:inherit;font-size:0.9375rem;font-weight:670;letter-spacing:-0.01em;
box-shadow:0 0.375rem 1.25rem color-mix(in oklab,var(--vibeui-navbar-011-accent) 42%,transparent),
inset 0 1px 0 color-mix(in oklab,#ffffff 45%,transparent);
transition:transform .18s var(--vibeui-navbar-011-ease),box-shadow .25s ease;
}
[data-vibeui-block="navbar-011"] [data-part="submit"]:hover{
transform:translateY(-1px);
box-shadow:0 0.625rem 1.75rem color-mix(in oklab,var(--vibeui-navbar-011-accent) 52%,transparent),
inset 0 1px 0 color-mix(in oklab,#ffffff 55%,transparent);
}
[data-vibeui-block="navbar-011"] [data-part="submit"] svg{width:1.0625rem;height:1.0625rem}

[data-vibeui-block="navbar-011"] a:focus-visible,
[data-vibeui-block="navbar-011"] button:focus-visible{
outline:2px solid var(--vibeui-navbar-011-accent);outline-offset:3px;
}
@container (min-width: 52rem){
[data-vibeui-block="navbar-011"] [data-part="shell"]{padding:1rem 2rem 1.375rem}
[data-vibeui-block="navbar-011"] [data-part="tabs"]{display:flex}
[data-vibeui-block="navbar-011"] [data-part="search"]{
flex-direction:row;align-items:stretch;border-radius:999px;
max-width:52rem;margin:0 auto;
}
[data-vibeui-block="navbar-011"] [data-part="field"]{
flex:1 1 0;border-bottom:0;border-right:1px solid var(--vibeui-navbar-011-line);
padding:0.625rem 1.5rem;
}
[data-vibeui-block="navbar-011"] [data-part="field"]::after{left:1.5rem;right:1.5rem;bottom:0.375rem}
[data-vibeui-block="navbar-011"] [data-part="field"]:first-of-type{border-radius:999px 0 0 999px}
[data-vibeui-block="navbar-011"] [data-part="field"]:last-of-type{border-right:0}
[data-vibeui-block="navbar-011"] [data-part="submit"]{
min-width:3rem;border-radius:999px;margin:0.4375rem;padding:0 1.375rem;
}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_USER_MENU: Navbar011Tab[] = [
  { label: "Войти", href: "#login" },
  { label: "Регистрация", href: "#signup" },
  { label: "Разместить объявление", href: "#publish" },
  { label: "Помощь", href: "#help" },
]

const DEFAULT_TABS: Navbar011Tab[] = [
  { label: "Жильё", href: "#stays", current: true },
  { label: "Специалисты", href: "#pros" },
  { label: "События", href: "#events" },
]

function FaceIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4.5 16.5c1-2.6 3-4 5.5-4s4.5 1.4 5.5 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="m16.5 16.5 4 4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Шапка каталога: разделы и объединённый поиск «что / где / когда» одной капсулой. */
export function Navbar011({
  brand = "Простор",
  markLabel = "П",
  tabs = DEFAULT_TABS,
  tabsLabel = "Разделы каталога",
  whatLabel = "Что",
  whatPlaceholder = "Жильё или специалист",
  whereLabel = "Где",
  wherePlaceholder = "Город или район",
  whenLabel = "Когда",
  whenPlaceholder = "Любые даты",
  searchLabel = "Найти",
  searchAction = "#search",
  loginLabel = "Войти",
  loginHref = "#login",
  userMenu = DEFAULT_USER_MENU,
  tone = "auto",
  accent,
  className,
  style,
}: Navbar011Props) {
  const tabsRef = useRef<HTMLElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)
  const [accountOpen, setAccountOpen] = useState(false)

  const placeGlider = useCallback((target?: HTMLElement | null) => {
    const row = tabsRef.current
    if (!row) return

    const item =
      target ?? row.querySelector<HTMLElement>('a[aria-current="page"]')

    if (!item) {
      row.removeAttribute("data-ready")
      return
    }

    row.style.setProperty(
      "--vibeui-navbar-011-glider-x",
      `${item.offsetLeft - row.clientLeft}px`,
    )
    row.style.setProperty(
      "--vibeui-navbar-011-glider-w",
      `${item.offsetWidth}px`,
    )
    row.setAttribute("data-ready", "on")
  }, [])

  useEffect(() => {
    const row = tabsRef.current
    if (!row) return

    placeGlider()

    const observer = new ResizeObserver(() => placeGlider())
    observer.observe(row)

    return () => observer.disconnect()
  }, [placeGlider, tabs])

  useEffect(() => {
    if (!accountOpen) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAccountOpen(false)
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) {
        setAccountOpen(false)
      }
    }

    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointerDown)

    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [accountOpen])

  const palette = {
    ...(accent ? { "--vibeui-navbar-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-011" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-011"
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

          {tabs.length > 0 ? (
            <nav
              ref={tabsRef}
              data-part="tabs"
              aria-label={tabsLabel}
              onPointerLeave={() => placeGlider()}
            >
              <span data-part="glider" aria-hidden="true" />
              {tabs.map((tab) => (
                <a
                  key={tab.href}
                  href={tab.href}
                  aria-current={tab.current ? "page" : undefined}
                  onPointerEnter={(event) => placeGlider(event.currentTarget)}
                  onFocus={(event) => placeGlider(event.currentTarget)}
                >
                  {tab.label}
                </a>
              ))}
            </nav>
          ) : null}

          <div ref={accountRef} data-part="account">
            {userMenu.length > 0 ? (
              <button
                type="button"
                data-part="login"
                aria-expanded={accountOpen}
                aria-controls="vibeui-navbar-011-account"
                onClick={() => setAccountOpen((open) => !open)}
              >
                {loginLabel}
                <span data-part="face" aria-hidden="true">
                  <FaceIcon />
                </span>
              </button>
            ) : (
              <a data-part="login" href={loginHref}>
                {loginLabel}
                <span data-part="face" aria-hidden="true">
                  <FaceIcon />
                </span>
              </a>
            )}

            {userMenu.length > 0 ? (
              <nav
                id="vibeui-navbar-011-account"
                data-part="account-menu"
                data-open={accountOpen}
                aria-label={loginLabel}
                aria-hidden={!accountOpen}
              >
                {userMenu.map((entry) => (
                  <a
                    key={entry.href}
                    href={entry.href}
                    tabIndex={accountOpen ? undefined : -1}
                    onClick={() => setAccountOpen(false)}
                  >
                    {entry.label}
                  </a>
                ))}
              </nav>
            ) : null}
          </div>

          <form data-part="search" action={searchAction} role="search">
            <label data-part="field">
              <span>{whatLabel}</span>
              <input type="search" name="q" placeholder={whatPlaceholder} />
            </label>
            <label data-part="field">
              <span>{whereLabel}</span>
              <input type="text" name="place" placeholder={wherePlaceholder} />
            </label>
            {whenLabel ? (
              <label data-part="field">
                <span>{whenLabel}</span>
                <input type="text" name="dates" placeholder={whenPlaceholder} />
              </label>
            ) : null}
            <button data-part="submit" type="submit">
              <SearchIcon />
              {searchLabel}
            </button>
          </form>
        </div>
      </header>
    </>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"

type Navbar007Link = {
  label: string
  href: string
}

type Navbar007Crumb = {
  label: string
  href?: string
}

export type Navbar007Props = {
  /** Текущая организация или проект в переключателе. */
  workspace?: string
  /** Другие пространства в раскрытии. */
  workspaces?: Navbar007Link[]
  /** Хлебные крошки контекста; последняя — текущая страница. */
  crumbs?: Navbar007Crumb[]
  searchPlaceholder?: string
  searchLabel?: string
  searchAction?: string
  /** Есть непрочитанные уведомления. */
  unread?: boolean
  notificationsLabel?: string
  notificationsHref?: string
  /** Инициалы пользователя в аватаре. */
  userInitials?: string
  userName?: string
  userEmail?: string
  userMenu?: Navbar007Link[]
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Шапка рабочего пространства: переключатель организации, хлебные крошки
// контекста, глобальный поиск и действия пользователя. Плотность здесь
// важнее воздуха — это рабочий инструмент, в шапку помещается путь
// целиком. Текущее пространство помечено галочкой, а не только цветом.
//
// Состояния аккаунта и проекта передаются снаружи; авторизацию и
// настоящее переключение реализует принимающее приложение. Клиентский JS
// нужен для двух раскрытий и горячей клавиши поиска: оба меню закрываются
// по Escape и по нажатию снаружи. Длинные названия сокращаются многоточием.
const STYLES = `
:where([data-vibeui-block="navbar-007"]){
--vibeui-navbar-007-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-007-ink:light-dark(#000000,#ffffff);
--vibeui-navbar-007-muted:light-dark(color-mix(in oklab,#000000 60%,#ffffff),color-mix(in oklab,#ffffff 68%,#1a1a1a));
--vibeui-navbar-007-line:light-dark(color-mix(in oklab,#000000 11%,transparent),color-mix(in oklab,#ffffff 15%,transparent));
--vibeui-navbar-007-hover:light-dark(color-mix(in oklab,#000000 5%,transparent),color-mix(in oklab,#ffffff 9%,transparent));
--vibeui-navbar-007-field:light-dark(#f2f2f2,color-mix(in oklab,#ffffff 8%,transparent));
--vibeui-navbar-007-sheen:light-dark(color-mix(in oklab,#ffffff 92%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-navbar-007-shadow:light-dark(0 1rem 2.5rem color-mix(in oklab,#000000 15%,transparent),0 1rem 2.5rem color-mix(in oklab,#000000 62%,transparent));
--vibeui-navbar-007-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-007-on-accent:oklch(from var(--vibeui-navbar-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-navbar-007-ease:cubic-bezier(.32,.72,0,1);
--vibeui-navbar-007-avatar:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-007-avatar-ink:light-dark(#ffffff,#000000);
--vibeui-navbar-007-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-007"]{color-scheme:dark}
:where([data-vibeui-block="navbar-007"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-007"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-007"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-007-bg);color:var(--vibeui-navbar-007-ink);
border-bottom:1px solid var(--vibeui-navbar-007-line);
font-family:var(--vibeui-navbar-007-font);
font-feature-settings:"cv11","ss01";
}
[data-vibeui-block="navbar-007"] *{box-sizing:border-box}
[data-vibeui-block="navbar-007"] [data-part="shell"]{
display:flex;align-items:center;flex-wrap:wrap;gap:0.5rem 0.625rem;
max-width:96rem;margin:0 auto;padding:0.625rem 1rem;
}

[data-vibeui-block="navbar-007"] [data-part="switcher"]{position:relative;flex:none;min-width:0}
[data-vibeui-block="navbar-007"] [data-part="ws-button"]{
cursor:pointer;background:transparent;
display:inline-flex;align-items:center;gap:0.5rem;max-width:16rem;
min-height:2.375rem;padding:0.25rem 0.625rem;border-radius:0.625rem;
border:1px solid transparent;
font:inherit;font-size:0.9375rem;font-weight:620;letter-spacing:-0.015em;
color:var(--vibeui-navbar-007-ink);
transition:background-color .16s ease,border-color .2s ease;
}
[data-vibeui-block="navbar-007"] [data-part="ws-button"]:hover,
[data-vibeui-block="navbar-007"] [data-part="ws-button"][aria-expanded="true"]{
background:var(--vibeui-navbar-007-hover);border-color:var(--vibeui-navbar-007-line);
}
[data-vibeui-block="navbar-007"] [data-part="ws-mark"]{
width:1.625rem;height:1.625rem;flex:none;display:grid;place-items:center;border-radius:0.4375rem;
background:var(--vibeui-navbar-007-accent);color:oklch(from var(--vibeui-navbar-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-size:0.6875rem;font-weight:800;
box-shadow:inset 0 1px 0 color-mix(in oklab,#ffffff 42%,transparent);
}
[data-vibeui-block="navbar-007"] [data-part="ws-name"]{
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="navbar-007"] [data-part="sort"]{
width:0.6875rem;height:0.875rem;flex:none;color:var(--vibeui-navbar-007-muted);
}

[data-vibeui-block="navbar-007"] [data-part="menu"]{
position:absolute;left:0;top:calc(100% + 0.375rem);z-index:60;min-width:14rem;
background:var(--vibeui-navbar-007-bg);
border:1px solid var(--vibeui-navbar-007-line);border-radius:0.875rem;
box-shadow:var(--vibeui-navbar-007-shadow);
display:flex;flex-direction:column;padding:0.3125rem;
transform-origin:top left;
transition:opacity .18s ease,transform .24s var(--vibeui-navbar-007-ease);
}
[data-vibeui-block="navbar-007"] [data-part="menu"][data-open="false"]{
opacity:0;transform:translateY(-0.375rem) scale(.98);pointer-events:none;
}
[data-vibeui-block="navbar-007"] [data-part="menu"] a{
display:flex;align-items:center;gap:0.5rem;
padding:0.5rem 0.625rem;border-radius:0.5rem;
color:var(--vibeui-navbar-007-ink);text-decoration:none;
font-size:0.875rem;font-weight:530;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
transition:background-color .14s ease;
}
[data-vibeui-block="navbar-007"] [data-part="menu"] a:hover{background:var(--vibeui-navbar-007-hover)}
[data-vibeui-block="navbar-007"] [data-part="menu"] a svg{
width:0.875rem;height:0.875rem;flex:none;margin-left:auto;color:var(--vibeui-navbar-007-accent);
}
[data-vibeui-block="navbar-007"] [data-part="menu"] hr{
margin:0.3125rem 0.375rem;border:0;border-top:1px solid var(--vibeui-navbar-007-line);
}

[data-vibeui-block="navbar-007"] [data-part="crumbs"]{
display:none;align-items:center;min-width:0;
font-size:0.875rem;color:var(--vibeui-navbar-007-muted);
}
[data-vibeui-block="navbar-007"] [data-part="crumbs"] ol{
display:flex;align-items:center;gap:0.125rem;list-style:none;margin:0;padding:0;min-width:0;
}
[data-vibeui-block="navbar-007"] [data-part="crumbs"] li{
display:inline-flex;align-items:center;gap:0.125rem;min-width:0;
}
[data-vibeui-block="navbar-007"] [data-part="crumbs"] li+li::before{
content:"";width:0.3125rem;height:0.3125rem;flex:none;margin:0 0.3125rem;
border-right:1.5px solid var(--vibeui-navbar-007-muted);
border-top:1.5px solid var(--vibeui-navbar-007-muted);
transform:rotate(45deg);opacity:.6;
}
[data-vibeui-block="navbar-007"] [data-part="crumbs"] a{
padding:0.25rem 0.4375rem;border-radius:0.4375rem;
color:inherit;text-decoration:none;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:12rem;
transition:background-color .14s ease,color .13s ease;
}
[data-vibeui-block="navbar-007"] [data-part="crumbs"] a:hover{
color:var(--vibeui-navbar-007-ink);background:var(--vibeui-navbar-007-hover);
}
[data-vibeui-block="navbar-007"] [data-part="crumbs"] [aria-current="page"]{
padding:0.25rem 0.4375rem;
color:var(--vibeui-navbar-007-ink);font-weight:580;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:14rem;
}

[data-vibeui-block="navbar-007"] [data-part="search"]{
order:3;flex:1 1 100%;display:flex;align-items:center;gap:0.4375rem;min-width:0;
padding:0.1875rem 0.375rem 0.1875rem 0.6875rem;border-radius:0.625rem;
background:var(--vibeui-navbar-007-field);
border:1px solid transparent;
transition:border-color .2s ease,box-shadow .2s ease,background-color .2s ease;
}
[data-vibeui-block="navbar-007"] [data-part="search"]:focus-within{
background:var(--vibeui-navbar-007-bg);
border-color:var(--vibeui-navbar-007-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-navbar-007-accent) 20%,transparent);
}
[data-vibeui-block="navbar-007"] [data-part="search"] svg{
width:0.9375rem;height:0.9375rem;flex:none;color:var(--vibeui-navbar-007-muted);
}
[data-vibeui-block="navbar-007"] [data-part="search"] input{
flex:1 1 auto;min-width:0;min-height:1.875rem;padding:0;
background:transparent;color:var(--vibeui-navbar-007-ink);
border:0;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="navbar-007"] [data-part="search"] input:focus{outline:none}
[data-vibeui-block="navbar-007"] [data-part="search"] input::placeholder{color:var(--vibeui-navbar-007-muted)}
[data-vibeui-block="navbar-007"] [data-part="search"] kbd{
flex:none;pointer-events:none;
padding:0.0625rem 0.375rem;border-radius:0.3125rem;
border:1px solid var(--vibeui-navbar-007-line);
background:var(--vibeui-navbar-007-bg);
font-family:var(--vibeui-navbar-007-mono);font-size:0.6875rem;
color:var(--vibeui-navbar-007-muted);
}

[data-vibeui-block="navbar-007"] [data-part="actions"]{
display:flex;align-items:center;gap:0.25rem;margin-left:auto;flex:none;
}
[data-vibeui-block="navbar-007"] [data-part="bell"]{
position:relative;display:inline-flex;align-items:center;justify-content:center;
width:2.375rem;height:2.375rem;border-radius:0.625rem;
color:var(--vibeui-navbar-007-ink);
transition:background-color .16s ease,color .13s ease;
}
[data-vibeui-block="navbar-007"] [data-part="bell"] svg{width:1.25rem;height:1.25rem}
[data-vibeui-block="navbar-007"] [data-part="bell"]:hover{
background:var(--vibeui-navbar-007-hover);color:var(--vibeui-navbar-007-accent);
}
[data-vibeui-block="navbar-007"] [data-part="dot"]{
position:absolute;top:0.4375rem;right:0.5rem;width:0.5rem;height:0.5rem;
border-radius:999px;background:var(--vibeui-navbar-007-accent);
box-shadow:0 0 0 2px var(--vibeui-navbar-007-bg);color:oklch(from var(--vibeui-navbar-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}

[data-vibeui-block="navbar-007"] [data-part="user"]{position:relative;flex:none}
[data-vibeui-block="navbar-007"] [data-part="user-button"]{
cursor:pointer;background:transparent;border:0;padding:0.125rem;border-radius:999px;
display:inline-flex;
transition:box-shadow .2s ease;
}
[data-vibeui-block="navbar-007"] [data-part="user-button"]:hover,
[data-vibeui-block="navbar-007"] [data-part="user-button"][aria-expanded="true"]{
box-shadow:0 0 0 2px color-mix(in oklab,var(--vibeui-navbar-007-accent) 55%,transparent);
}
[data-vibeui-block="navbar-007"] [data-part="avatar"]{
width:2rem;height:2rem;display:grid;place-items:center;border-radius:999px;
background:var(--vibeui-navbar-007-avatar);color:var(--vibeui-navbar-007-avatar-ink);
font-size:0.75rem;font-weight:700;letter-spacing:0.02em;
}
[data-vibeui-block="navbar-007"] [data-part="user"] [data-part="menu"]{
left:auto;right:0;transform-origin:top right;min-width:15rem;
}
[data-vibeui-block="navbar-007"] [data-part="user-card"]{
display:flex;flex-direction:column;gap:0.0625rem;
padding:0.5rem 0.625rem 0.625rem;
}
[data-vibeui-block="navbar-007"] [data-part="user-card"] strong{
font-size:0.875rem;font-weight:620;letter-spacing:-0.01em;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="navbar-007"] [data-part="user-card"] span{
font-size:0.75rem;color:var(--vibeui-navbar-007-muted);
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}

[data-vibeui-block="navbar-007"] a:focus-visible,
[data-vibeui-block="navbar-007"] button:focus-visible{
outline:2px solid var(--vibeui-navbar-007-accent);outline-offset:3px;
}
@container (min-width: 62rem){
[data-vibeui-block="navbar-007"] [data-part="shell"]{padding:0.625rem 1.25rem;flex-wrap:nowrap}
[data-vibeui-block="navbar-007"] [data-part="crumbs"]{display:flex}
[data-vibeui-block="navbar-007"] [data-part="search"]{order:0;flex:0 1 22rem;margin-left:auto}
[data-vibeui-block="navbar-007"] [data-part="actions"]{margin-left:0}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_WORKSPACES: Navbar007Link[] = [
  { label: "Атлас Групп", href: "#atlas" },
  { label: "Личные проекты", href: "#personal" },
  { label: "Создать пространство…", href: "#new" },
]

const DEFAULT_CRUMBS: Navbar007Crumb[] = [
  { label: "Проекты", href: "#projects" },
  { label: "Витрина", href: "#storefront" },
  { label: "Аналитика" },
]

const DEFAULT_USER_MENU: Navbar007Link[] = [
  { label: "Профиль", href: "#profile" },
  { label: "Настройки", href: "#settings" },
  { label: "Выйти", href: "#logout" },
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

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 9.5A6 6 0 0 1 18 9.5c0 5 2 6 2 6H4s2-1 2-6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M10 19a2 2 0 0 0 4 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Шапка кабинета: переключатель пространства, крошки, поиск и меню пользователя. */
export function Navbar007({
  workspace = "Контур Лаб",
  workspaces = DEFAULT_WORKSPACES,
  crumbs = DEFAULT_CRUMBS,
  searchPlaceholder = "Поиск по пространству",
  searchLabel = "Глобальный поиск",
  searchAction = "#search",
  unread = true,
  notificationsLabel = "Уведомления",
  notificationsHref = "#notifications",
  userInitials = "АК",
  userName = "Анна Ковалёва",
  userEmail = "anna@konturlab.ru",
  userMenu = DEFAULT_USER_MENU,
  tone = "auto",
  accent,
  className,
  style,
}: Navbar007Props) {
  const switcherRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [wsOpen, setWsOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  useEffect(() => {
    if (!wsOpen && !userOpen) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setWsOpen(false)
      setUserOpen(false)
    }
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!switcherRef.current?.contains(target)) setWsOpen(false)
      if (!userRef.current?.contains(target)) setUserOpen(false)
    }

    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointerDown)

    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [wsOpen, userOpen])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "k" || !(event.metaKey || event.ctrlKey)) return
      event.preventDefault()
      inputRef.current?.focus()
    }

    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-navbar-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-007" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-007"
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div ref={switcherRef} data-part="switcher">
            <button
              type="button"
              data-part="ws-button"
              aria-expanded={wsOpen}
              aria-label={`Пространство: ${workspace}`}
              onClick={() => {
                setWsOpen((open) => !open)
                setUserOpen(false)
              }}
            >
              <span data-part="ws-mark" aria-hidden="true">
                {workspace.slice(0, 1)}
              </span>
              <span data-part="ws-name">{workspace}</span>
              <svg data-part="sort" viewBox="0 0 12 16" fill="none" aria-hidden="true">
                <path
                  d="M3.5 6.5 6 4l2.5 2.5M3.5 9.5 6 12l2.5-2.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <nav
              data-part="menu"
              data-open={wsOpen}
              aria-label="Пространства"
              aria-hidden={!wsOpen}
            >
              <a href="#current" tabIndex={wsOpen ? undefined : -1}>
                {workspace}
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="m3 8.5 3.5 3.5L13 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <hr />
              {workspaces.map((entry) => (
                <a
                  key={entry.href}
                  href={entry.href}
                  tabIndex={wsOpen ? undefined : -1}
                  onClick={() => setWsOpen(false)}
                >
                  {entry.label}
                </a>
              ))}
            </nav>
          </div>

          <nav data-part="crumbs" aria-label="Текущий контекст">
            <ol>
              {crumbs.map((crumb, index) => (
                <li key={crumb.label}>
                  {crumb.href && index < crumbs.length - 1 ? (
                    <a href={crumb.href}>{crumb.label}</a>
                  ) : (
                    <span aria-current="page">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <form data-part="search" action={searchAction} role="search">
            <SearchIcon />
            <input
              ref={inputRef}
              type="search"
              name="q"
              placeholder={searchPlaceholder}
              aria-label={searchLabel}
            />
            <kbd aria-hidden="true">K</kbd>
          </form>

          <div data-part="actions">
            <a
              data-part="bell"
              href={notificationsHref}
              aria-label={notificationsLabel}
            >
              <BellIcon />
              {unread ? <span data-part="dot" aria-hidden="true" /> : null}
            </a>

            <div ref={userRef} data-part="user">
              <button
                type="button"
                data-part="user-button"
                aria-expanded={userOpen}
                aria-label={`Меню пользователя: ${userName}`}
                onClick={() => {
                  setUserOpen((open) => !open)
                  setWsOpen(false)
                }}
              >
                <span data-part="avatar" aria-hidden="true">
                  {userInitials}
                </span>
              </button>
              <div data-part="menu" data-open={userOpen} aria-hidden={!userOpen}>
                <div data-part="user-card">
                  <strong>{userName}</strong>
                  <span>{userEmail}</span>
                </div>
                <hr />
                {userMenu.map((entry) => (
                  <a
                    key={entry.href}
                    href={entry.href}
                    tabIndex={userOpen ? undefined : -1}
                    onClick={() => setUserOpen(false)}
                  >
                    {entry.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

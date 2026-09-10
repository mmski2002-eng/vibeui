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
  userMenu?: Navbar007Link[]
  tone?: "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Шапка рабочего пространства: переключатель организации, хлебные крошки
// контекста, глобальный поиск и действия пользователя. Состояния аккаунта
// и проекта передаются снаружи; авторизацию и настоящее переключение
// реализует принимающее приложение. Раскрытия — доступные <details>,
// клиентского JS нет. Длинные названия сокращаются многоточием.
const STYLES = `
:where([data-vibeui-block="navbar-007"]){
--vibeui-navbar-007-bg:#ffffff;
--vibeui-navbar-007-ink:#000000;
--vibeui-navbar-007-muted:color-mix(in oklab,#000000 58%,#ffffff);
--vibeui-navbar-007-line:color-mix(in oklab,#000000 12%,transparent);
--vibeui-navbar-007-field:#f2f2f2;
--vibeui-navbar-007-accent:#ff5900;
--vibeui-navbar-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where([data-vibeui-block="navbar-007"][data-tone="dark"]){
--vibeui-navbar-007-bg:#1a1a1a;
--vibeui-navbar-007-ink:#ffffff;
--vibeui-navbar-007-muted:color-mix(in oklab,#ffffff 64%,#1a1a1a);
--vibeui-navbar-007-line:color-mix(in oklab,#ffffff 14%,transparent);
--vibeui-navbar-007-field:#000000;
}
[data-vibeui-block="navbar-007"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-007-bg);color:var(--vibeui-navbar-007-ink);
border-bottom:1px solid var(--vibeui-navbar-007-line);
font-family:var(--vibeui-navbar-007-font);
}
[data-vibeui-block="navbar-007"] *{box-sizing:border-box}
[data-vibeui-block="navbar-007"] [data-part="shell"]{
display:flex;align-items:center;flex-wrap:wrap;gap:0.5rem 0.75rem;
max-width:96rem;margin:0 auto;padding:0.5625rem 1rem;
}
[data-vibeui-block="navbar-007"] [data-part="switcher"]{position:relative;flex:none;min-width:0}
[data-vibeui-block="navbar-007"] [data-part="switcher"] summary{
list-style:none;cursor:pointer;user-select:none;
display:inline-flex;align-items:center;gap:0.5rem;max-width:16rem;
min-height:2.25rem;padding:0.25rem 0.625rem;
border:1px solid transparent;
font-size:0.9375rem;font-weight:620;letter-spacing:-0.01em;
transition:border-color .16s ease;
}
[data-vibeui-block="navbar-007"] [data-part="switcher"] summary:hover{border-color:var(--vibeui-navbar-007-line)}
[data-vibeui-block="navbar-007"] [data-part="switcher"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="navbar-007"] [data-part="switcher"] summary::after{
content:"";width:0.375rem;height:0.375rem;flex:none;
border-right:1.5px solid var(--vibeui-navbar-007-muted);border-bottom:1.5px solid var(--vibeui-navbar-007-muted);
transform:rotate(45deg) translateY(-0.0625rem);
}
[data-vibeui-block="navbar-007"] [data-part="ws-mark"]{
width:1.5rem;height:1.5rem;flex:none;display:grid;place-items:center;
background:var(--vibeui-navbar-007-accent);color:#000000;
font-size:0.6875rem;font-weight:800;
}
[data-vibeui-block="navbar-007"] [data-part="ws-name"]{
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="navbar-007"] [data-part="menu"]{
position:absolute;left:0;top:calc(100% + 0.25rem);z-index:20;min-width:13rem;
background:var(--vibeui-navbar-007-bg);border:1px solid var(--vibeui-navbar-007-line);
box-shadow:0 0.5rem 1.5rem color-mix(in oklab,#000000 14%,transparent);
display:flex;flex-direction:column;padding:0.25rem;
}
[data-vibeui-block="navbar-007"] [data-part="menu"] a{
padding:0.5rem 0.625rem;color:var(--vibeui-navbar-007-ink);text-decoration:none;
font-size:0.875rem;font-weight:520;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="navbar-007"] [data-part="menu"] a:hover{
background:var(--vibeui-navbar-007-field);color:var(--vibeui-navbar-007-accent);
}
[data-vibeui-block="navbar-007"] [data-part="crumbs"]{
display:none;align-items:center;gap:0.375rem;min-width:0;
font-size:0.875rem;color:var(--vibeui-navbar-007-muted);
}
[data-vibeui-block="navbar-007"] [data-part="crumbs"] ol{
display:flex;align-items:center;gap:0.375rem;list-style:none;margin:0;padding:0;min-width:0;
}
[data-vibeui-block="navbar-007"] [data-part="crumbs"] li{
display:inline-flex;align-items:center;gap:0.375rem;min-width:0;
}
[data-vibeui-block="navbar-007"] [data-part="crumbs"] li+li::before{
content:"/";color:var(--vibeui-navbar-007-line);
}
[data-vibeui-block="navbar-007"] [data-part="crumbs"] a{
color:inherit;text-decoration:none;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:12rem;
}
[data-vibeui-block="navbar-007"] [data-part="crumbs"] a:hover{color:var(--vibeui-navbar-007-ink)}
[data-vibeui-block="navbar-007"] [data-part="crumbs"] [aria-current="page"]{
color:var(--vibeui-navbar-007-ink);font-weight:560;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:14rem;
}
[data-vibeui-block="navbar-007"] [data-part="search"]{
order:3;flex:1 1 100%;display:flex;align-items:center;position:relative;min-width:0;
}
[data-vibeui-block="navbar-007"] [data-part="search"] svg{
position:absolute;left:0.625rem;width:0.9375rem;height:0.9375rem;pointer-events:none;
color:var(--vibeui-navbar-007-muted);
}
[data-vibeui-block="navbar-007"] [data-part="search"] input{
flex:1 1 auto;min-width:0;min-height:2.25rem;
padding:0.25rem 0.75rem 0.25rem 2.125rem;
background:var(--vibeui-navbar-007-field);color:var(--vibeui-navbar-007-ink);
border:1px solid transparent;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="navbar-007"] [data-part="search"] input::placeholder{color:var(--vibeui-navbar-007-muted)}
[data-vibeui-block="navbar-007"] [data-part="search"] input:focus-visible{
outline:none;border-color:var(--vibeui-navbar-007-accent);
}
[data-vibeui-block="navbar-007"] [data-part="actions"]{
display:flex;align-items:center;gap:0.375rem;margin-left:auto;flex:none;
}
[data-vibeui-block="navbar-007"] [data-part="bell"]{
position:relative;display:inline-flex;align-items:center;justify-content:center;
width:2.25rem;height:2.25rem;color:var(--vibeui-navbar-007-ink);
}
[data-vibeui-block="navbar-007"] [data-part="bell"] svg{width:1.25rem;height:1.25rem}
[data-vibeui-block="navbar-007"] [data-part="bell"]:hover{color:var(--vibeui-navbar-007-accent)}
[data-vibeui-block="navbar-007"] [data-part="dot"]{
position:absolute;top:0.375rem;right:0.4375rem;width:0.5rem;height:0.5rem;
border-radius:999px;background:var(--vibeui-navbar-007-accent);
}
[data-vibeui-block="navbar-007"] [data-part="user"]{position:relative;flex:none}
[data-vibeui-block="navbar-007"] [data-part="user"] summary{
list-style:none;cursor:pointer;user-select:none;
display:inline-flex;
}
[data-vibeui-block="navbar-007"] [data-part="user"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="navbar-007"] [data-part="avatar"]{
width:2rem;height:2rem;display:grid;place-items:center;border-radius:999px;
background:#1a1a1a;color:#ffffff;
font-size:0.75rem;font-weight:700;letter-spacing:0.02em;
}
[data-vibeui-block="navbar-007"][data-tone="dark"] [data-part="avatar"]{
background:#f2f2f2;color:#000000;
}
[data-vibeui-block="navbar-007"] [data-part="user"] [data-part="menu"]{left:auto;right:0}
[data-vibeui-block="navbar-007"] [data-part="user-name"]{
padding:0.5rem 0.625rem 0.25rem;font-size:0.75rem;color:var(--vibeui-navbar-007-muted);
border-bottom:1px solid var(--vibeui-navbar-007-line);margin-bottom:0.25rem;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="navbar-007"] a:focus-visible,
[data-vibeui-block="navbar-007"] summary:focus-visible{
outline:2px solid var(--vibeui-navbar-007-accent);outline-offset:2px;
}
@container (min-width: 62rem){
[data-vibeui-block="navbar-007"] [data-part="shell"]{padding:0.5625rem 1.25rem;flex-wrap:nowrap}
[data-vibeui-block="navbar-007"] [data-part="crumbs"]{display:flex}
[data-vibeui-block="navbar-007"] [data-part="search"]{order:0;flex:0 1 20rem;margin-left:auto}
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
      <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
      <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
  userMenu = DEFAULT_USER_MENU,
  tone = "light",
  accent,
  className,
  style,
}: Navbar007Props) {
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
        data-tone={tone === "dark" ? "dark" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <details data-part="switcher">
            <summary aria-label={`Пространство: ${workspace}`}>
              <span data-part="ws-mark" aria-hidden="true">
                {workspace.slice(0, 1)}
              </span>
              <span data-part="ws-name">{workspace}</span>
            </summary>
            <nav data-part="menu" aria-label="Пространства">
              {workspaces.map((entry) => (
                <a key={entry.href} href={entry.href}>
                  {entry.label}
                </a>
              ))}
            </nav>
          </details>
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
              type="search"
              name="q"
              placeholder={searchPlaceholder}
              aria-label={searchLabel}
            />
          </form>
          <div data-part="actions">
            <a data-part="bell" href={notificationsHref} aria-label={notificationsLabel}>
              <BellIcon />
              {unread ? <span data-part="dot" aria-hidden="true" /> : null}
            </a>
            <details data-part="user">
              <summary aria-label={`Меню пользователя: ${userName}`}>
                <span data-part="avatar" aria-hidden="true">
                  {userInitials}
                </span>
              </summary>
              <div data-part="menu">
                <p data-part="user-name">{userName}</p>
                {userMenu.map((entry) => (
                  <a key={entry.href} href={entry.href}>
                    {entry.label}
                  </a>
                ))}
              </div>
            </details>
          </div>
        </div>
      </header>
    </>
  )
}

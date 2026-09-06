import type { CSSProperties } from "react"

type Navbar008Tab = {
  label: string
  href: string
  current?: boolean
}

type Navbar008MenuItem = {
  label: string
  href: string
}

export type Navbar008Props = {
  workspace?: string
  plan?: string
  tabs?: Navbar008Tab[]
  /**
   * Показать панель развёрнутой в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  notifications?: number
  userName?: string
  userEmail?: string
  menu?: Navbar008MenuItem[]
  /** Буквы в знаке пространства: компонент несёт русские. */
  workspaceInitials?: string
  /** Буквы в аватаре: компонент несёт русские. */
  userInitials?: string
  /** Подпись навигации для скринридера: компонент несёт русскую. */
  navLabel?: string
  /** Подпись колокола; {count} подставляет число уведомлений. */
  notificationsLabel?: string
  /** Подпись кнопки аккаунта; {name} подставляет имя. */
  accountLabel?: string
  id?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Шапка внутреннего приложения, а не сайта: слева рабочее пространство с
// тарифом, посередине вкладки разделов с подчёркиванием текущего, справа
// колокол со счётчиком и аватар. Счётчик уведомлений продублирован текстом
// для скринридера — цифра в кружке сама по себе ничего не сообщает.
//
// Тема берётся из color-scheme окружения через light-dark(): шапка темнеет
// вместе с контекстом и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="navbar-008"]){
--vibeui-navbar-008-bg:transparent;
--vibeui-navbar-008-ink:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-navbar-008-muted:light-dark(oklch(0.55 0 265),oklch(0.7 0 265));
--vibeui-navbar-008-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-navbar-008-accent:light-dark(oklch(0.5 0.19 275),oklch(0.72 0.16 275));
--vibeui-navbar-008-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.17 0 275));
--vibeui-navbar-008-badge:light-dark(oklch(0.6 0.2 25),oklch(0.66 0.2 25));
--vibeui-navbar-008-tint:light-dark(oklch(1 0 0),oklch(0.27 0 275));
--vibeui-navbar-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-008"]{color-scheme:dark}
[data-vibeui-block="navbar-008"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-navbar-008-bg);color:var(--vibeui-navbar-008-ink);
border-bottom:1px solid var(--vibeui-navbar-008-border);
font-family:var(--vibeui-navbar-008-font);
}
[data-vibeui-block="navbar-008"] [data-part="shell"]{
display:flex;align-items:center;gap:0.75rem;
max-width:88rem;margin:0 auto;padding:0.625rem 1rem;
}
[data-vibeui-block="navbar-008"] [data-part="workspace"]{
display:inline-flex;align-items:center;gap:0.5rem;flex:none;
color:inherit;text-decoration:none;
}
[data-vibeui-block="navbar-008"] [data-part="avatar-square"]{
width:1.75rem;height:1.75rem;border-radius:0.5rem;flex:none;
display:grid;place-items:center;font-size:0.75rem;font-weight:750;
background:var(--vibeui-navbar-008-accent);color:var(--vibeui-navbar-008-accent-fg);
}
[data-vibeui-block="navbar-008"] [data-part="workspace-name"]{font-size:0.9375rem;font-weight:640;letter-spacing:-0.01em}
[data-vibeui-block="navbar-008"] [data-part="plan"]{
display:none;padding:0.125rem 0.4375rem;border-radius:0.375rem;
border:1px solid var(--vibeui-navbar-008-border);
color:var(--vibeui-navbar-008-muted);font-size:0.6875rem;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;
}
[data-vibeui-block="navbar-008"] [data-part="tabs"]{
display:none;align-items:center;gap:0.25rem;margin-inline:auto;
}
[data-vibeui-block="navbar-008"] [data-part="tabs"] a{
position:relative;padding:0.5rem 0.625rem;
color:var(--vibeui-navbar-008-muted);text-decoration:none;font-size:0.875rem;font-weight:540;
transition:color .16s ease;
}
[data-vibeui-block="navbar-008"] [data-part="tabs"] a:hover{color:var(--vibeui-navbar-008-ink)}
[data-vibeui-block="navbar-008"] [data-part="tabs"] a[aria-current="page"]{color:var(--vibeui-navbar-008-ink)}
[data-vibeui-block="navbar-008"] [data-part="tabs"] a[aria-current="page"]::after{
content:"";position:absolute;left:0.625rem;right:0.625rem;bottom:-0.6875rem;height:2px;
border-radius:2px;background:var(--vibeui-navbar-008-accent);
}
[data-vibeui-block="navbar-008"] [data-part="tools"]{display:flex;align-items:center;gap:0.375rem;margin-left:auto;flex:none}
[data-vibeui-block="navbar-008"] [data-part="bell"]{
appearance:none;cursor:pointer;position:relative;
display:grid;place-items:center;width:2.25rem;height:2.25rem;
border:1px solid var(--vibeui-navbar-008-border);border-radius:0.625rem;background:transparent;
color:var(--vibeui-navbar-008-ink);
transition:background-color .16s ease;
}
[data-vibeui-block="navbar-008"] [data-part="bell"]:hover{background:color-mix(in oklab,var(--vibeui-navbar-008-border) 45%,transparent)}
[data-vibeui-block="navbar-008"] [data-part="bell"]::before{
content:"";width:0.875rem;height:0.75rem;
border:1.5px solid currentColor;border-bottom:0;border-radius:0.5rem 0.5rem 0 0;
box-shadow:0 2px 0 -0.5px currentColor;
}
[data-vibeui-block="navbar-008"] [data-part="count"]{
position:absolute;top:-0.3125rem;right:-0.3125rem;
min-width:1.125rem;height:1.125rem;padding:0 0.25rem;border-radius:999px;
display:grid;place-items:center;
background:var(--vibeui-navbar-008-badge);color:oklch(0.99 0 0);
font-size:0.6875rem;font-weight:700;line-height:1;
}
[data-vibeui-block="navbar-008"] [data-part="user"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.5rem;height:2.25rem;padding:0 0.5rem 0 0.3125rem;
border:1px solid var(--vibeui-navbar-008-border);border-radius:999px;background:transparent;
font:inherit;color:inherit;
transition:background-color .16s ease;
}
[data-vibeui-block="navbar-008"] [data-part="user"]:hover{background:color-mix(in oklab,var(--vibeui-navbar-008-border) 45%,transparent)}
[data-vibeui-block="navbar-008"] [data-part="avatar"]{
width:1.625rem;height:1.625rem;border-radius:999px;flex:none;
display:grid;place-items:center;font-size:0.6875rem;font-weight:700;
background:color-mix(in oklab,var(--vibeui-navbar-008-accent) 16%,var(--vibeui-navbar-008-tint));
color:var(--vibeui-navbar-008-accent);
}
[data-vibeui-block="navbar-008"] [data-part="user-name"]{display:none;font-size:0.8125rem;font-weight:560}
[data-vibeui-block="navbar-008"] button:focus-visible,
[data-vibeui-block="navbar-008"] a:focus-visible{outline:2px solid var(--vibeui-navbar-008-accent);outline-offset:2px}
[data-vibeui-navbar-008-menu]{
position:fixed;inset:3.75rem 1rem auto auto;margin:0;padding:0.375rem;min-width:15rem;
border:1px solid var(--vibeui-navbar-008-border,light-dark(oklch(0.91 0 265),oklch(0.34 0 265)));
border-radius:0.875rem;
background:light-dark(oklch(0.99 0 265),oklch(0.26 0 265));
font-family:var(--vibeui-navbar-008-font,ui-sans-serif,system-ui,sans-serif);
box-shadow:0 26px 60px -32px light-dark(oklch(0.2 0 265 / 55%),oklch(0 0 0 / 65%));
}
[data-vibeui-navbar-008-menu] [data-part="who"]{
padding:0.5rem 0.625rem 0.625rem;margin-bottom:0.25rem;
border-bottom:1px solid light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
}
[data-vibeui-navbar-008-menu] [data-part="who"] strong{display:block;font-size:0.875rem;color:light-dark(oklch(0.24 0 265),oklch(0.94 0 265))}
[data-vibeui-navbar-008-menu] [data-part="who"] span{display:block;font-size:0.8125rem;color:light-dark(oklch(0.55 0 265),oklch(0.7 0 265))}
[data-vibeui-navbar-008-menu] a{
display:block;padding:0.5rem 0.625rem;border-radius:0.5rem;
color:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
text-decoration:none;font-size:0.875rem;font-weight:520;
}
[data-vibeui-navbar-008-menu] a:hover{background:light-dark(oklch(0.55 0 265 / 8%),oklch(0.85 0 265 / 12%))}
@container (min-width: 46rem){
[data-vibeui-block="navbar-008"] [data-part="shell"]{padding:0.625rem 1.75rem;gap:1.25rem}
[data-vibeui-block="navbar-008"] [data-part="plan"]{display:inline-block}
[data-vibeui-block="navbar-008"] [data-part="tabs"]{display:flex}
[data-vibeui-block="navbar-008"] [data-part="tools"]{margin-left:0}
[data-vibeui-block="navbar-008"] [data-part="user-name"]{display:inline}
}
/* Развёрнутый режим: панель встаёт в потоке под шапкой во всю её ширину. */
[data-vibeui-navbar-008-menu][data-open="true"]{
position:static;inset:auto;width:100%;margin:0.75rem 0 0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TABS: Navbar008Tab[] = [
  { label: "Обзор", href: "#overview", current: true },
  { label: "Проекты", href: "#projects" },
  { label: "Задачи", href: "#tasks" },
  { label: "Отчёты", href: "#reports" },
  { label: "Настройки", href: "#settings" },
]

const DEFAULT_MENU: Navbar008MenuItem[] = [
  { label: "Профиль", href: "#profile" },
  { label: "Уведомления", href: "#notifications" },
  { label: "Команда и доступы", href: "#team" },
  { label: "Выйти", href: "#logout" },
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/** Шапка приложения: вкладки разделов, счётчик уведомлений, меню аккаунта. */
export function Navbar008({
  workspace = "Ателье Восход",
  plan = "Команда",
  tabs = DEFAULT_TABS,
  open = false,
  notifications = 7,
  userName = "Марина К.",
  userEmail = "marina@voskhod.ru",
  menu = DEFAULT_MENU,
  workspaceInitials = "АВ",
  userInitials = "МК",
  navLabel = "Разделы приложения",
  notificationsLabel = "Уведомления: {count} новых",
  accountLabel = "Аккаунт: {name}",
  id = "vibeui-navbar-008-menu",
  background = "",
  accent,
  className,
  style,
}: Navbar008Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-navbar-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-008" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-008"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <a data-part="workspace" href="#workspace">
            <span data-part="avatar-square" aria-hidden="true">
              {workspaceInitials}
            </span>
            <span data-part="workspace-name">{workspace}</span>
          </a>
          <span data-part="plan">{plan}</span>
          <nav data-part="tabs" aria-label={navLabel}>
            {tabs.map((tab) => (
              <a
                key={tab.href}
                href={tab.href}
                aria-current={tab.current ? "page" : undefined}
              >
                {tab.label}
              </a>
            ))}
          </nav>
          <div data-part="tools">
            <button
              data-part="bell"
              type="button"
              aria-label={notificationsLabel.replace(
                "{count}",
                String(notifications),
              )}
            >
              <span data-part="count" aria-hidden="true">
                {notifications}
              </span>
            </button>
            <button
              data-part="user"
              type="button"
              popoverTarget={id}
              aria-label={accountLabel.replace("{name}", userName)}
            >
              <span data-part="avatar" aria-hidden="true">
                {userInitials}
              </span>
              <span data-part="user-name">{userName}</span>
            </button>
          </div>
        </div>
        <div
          id={id}
          popover={open ? undefined : "auto"}
          data-vibeui-navbar-008-menu=""
          data-open={open || undefined}
          style={palette}
        >
          <p data-part="who">
            <strong>{userName}</strong>
            <span>{userEmail}</span>
          </p>
          {menu.map((entry) => (
            <a key={entry.href} href={entry.href}>
              {entry.label}
            </a>
          ))}
        </div>
      </header>
    </>
  )
}

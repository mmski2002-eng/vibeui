import type { CSSProperties } from "react"

export type Dashboard035Tab = {
  label: string
  count?: number
}

export type Dashboard035Props = {
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  avatarImage?: string
  product?: string
  crumbs?: string[]
  searchHint?: string
  shortcut?: string
  tabs?: Dashboard035Tab[]
  activeTab?: string
  unread?: number
  userName?: string
  userMail?: string
  menu?: string[]
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Подпись всей шапки для скринридера. */
  headerLabel?: string
  /** Шаблон подписи колокольчика: {count}. */
  bellText?: string
  /** Подпись меню профиля. */
  menuLabel?: string
  /** Подпись строки вкладок. */
  tabsLabel?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: шапка приложения, где поиск — не иконка, а поле во всю
// свободную ширину: в рабочем инструменте им пользуются чаще, чем меню.
// Меню профиля собрано на <details>: браузер сам открывает и закрывает его,
// отдаёт клавиатуру и Escape, а собственная реализация потребовала бы
// состояния и ловушки фокуса. Счётчик непрочитанного объявлен aria-live,
// потому что меняется без перезагрузки. Вторая строка — вкладки раздела:
// они ссылки, чтобы у отфильтрованного экрана был свой адрес.
const STYLES = `
:where([data-vibeui-block="dashboard-035"]){
--vibeui-dashboard-035-bg:transparent;
/* Поповер и мелкие плашки: подложка шапки прозрачна, и рисовать их ею нечем. */
--vibeui-dashboard-035-card:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-dashboard-035-sub:light-dark(oklch(0.98 0 265),oklch(0.28 0 265));
--vibeui-dashboard-035-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-dashboard-035-muted:light-dark(oklch(0.55 0 265),oklch(0.71 0 265));
--vibeui-dashboard-035-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-dashboard-035-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.74 0.16 39.8));
--vibeui-dashboard-035-on-accent:oklch(0.15 0.02 39.8);
--vibeui-dashboard-035-face:light-dark(oklch(0.92 0.05 39.8),oklch(0.34 0.06 39.8));
--vibeui-dashboard-035-alarm:light-dark(oklch(0.58 0.19 25),oklch(0.72 0.16 25));
--vibeui-dashboard-035-on-alarm:light-dark(oklch(1 0 0),oklch(0.18 0.03 25));
--vibeui-dashboard-035-shadow:light-dark(oklch(0.2 0 265 / 12%),oklch(0 0 0 / 45%));
--vibeui-dashboard-035-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-035"]{color-scheme:dark}
[data-vibeui-block="dashboard-035"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-dashboard-035-bg);
color:var(--vibeui-dashboard-035-fg);
font-family:var(--vibeui-dashboard-035-sans);
border:1px solid var(--vibeui-dashboard-035-border);border-radius:1rem;overflow:hidden;
}
[data-vibeui-block="dashboard-035"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-035"] [data-part="shell"]{display:block}
[data-vibeui-block="dashboard-035"] [data-part="bar"]{
display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;
padding:0.75rem 1rem;border-bottom:1px solid var(--vibeui-dashboard-035-border);
}
[data-vibeui-block="dashboard-035"] [data-part="brand"]{
display:flex;align-items:center;gap:0.5rem;font-weight:750;font-size:0.9375rem;letter-spacing:-0.01em;
}
[data-vibeui-block="dashboard-035"] [data-part="mark"]{
width:1.5rem;height:1.5rem;border-radius:0.5rem;flex:none;
background:var(--vibeui-dashboard-035-accent);
color:var(--vibeui-dashboard-035-on-accent);font-size:0.75rem;font-weight:800;
display:grid;place-items:center;
}
[data-vibeui-block="dashboard-035"] [data-part="crumbs"]{
display:flex;align-items:center;gap:0.375rem;margin:0;padding:0;list-style:none;
font-size:0.75rem;color:var(--vibeui-dashboard-035-muted);min-width:0;
}
[data-vibeui-block="dashboard-035"] [data-part="crumbs"] li{display:flex;align-items:center;gap:0.375rem;white-space:nowrap}
[data-vibeui-block="dashboard-035"] [data-part="crumbs"] li + li::before{content:"/";color:var(--vibeui-dashboard-035-border)}
[data-vibeui-block="dashboard-035"] [data-part="crumbs"] a{color:inherit;text-decoration:none}
[data-vibeui-block="dashboard-035"] [data-part="crumbs"] a:hover{text-decoration:underline}
[data-vibeui-block="dashboard-035"] [data-part="crumbs"] [aria-current]{color:var(--vibeui-dashboard-035-fg);font-weight:650}
[data-vibeui-block="dashboard-035"] [data-part="search"]{
position:relative;flex:1 1 12rem;min-width:9rem;order:9;width:100%;
}
[data-vibeui-block="dashboard-035"] [data-part="search"] input{
width:100%;font:inherit;font-size:0.8125rem;color:inherit;
padding:0.5rem 3.25rem 0.5rem 2rem;border-radius:0.625rem;
border:1px solid var(--vibeui-dashboard-035-border);
background:var(--vibeui-dashboard-035-sub);
}
[data-vibeui-block="dashboard-035"] [data-part="glass"]{
position:absolute;left:0.6875rem;top:50%;transform:translateY(-50%);
width:0.75rem;height:0.75rem;border:1.5px solid var(--vibeui-dashboard-035-muted);border-radius:50%;
}
[data-vibeui-block="dashboard-035"] [data-part="glass"]::after{
content:"";position:absolute;right:-0.25rem;bottom:-0.25rem;width:0.375rem;height:1.5px;
background:var(--vibeui-dashboard-035-muted);transform:rotate(45deg);
}
[data-vibeui-block="dashboard-035"] kbd{
position:absolute;right:0.4375rem;top:50%;transform:translateY(-50%);
font:inherit;font-size:0.625rem;font-weight:650;color:var(--vibeui-dashboard-035-muted);
padding:0.125rem 0.3125rem;border-radius:0.3125rem;
border:1px solid var(--vibeui-dashboard-035-border);background:var(--vibeui-dashboard-035-card);
}
[data-vibeui-block="dashboard-035"] [data-part="tools"]{display:flex;align-items:center;gap:0.5rem;margin-left:auto}
[data-vibeui-block="dashboard-035"] [data-part="bell"]{
position:relative;appearance:none;cursor:pointer;font:inherit;
width:2rem;height:2rem;border-radius:0.625rem;display:grid;place-items:center;
border:1px solid var(--vibeui-dashboard-035-border);background:var(--vibeui-dashboard-035-card);color:inherit;
}
[data-vibeui-block="dashboard-035"] [data-part="bell"] span[aria-hidden]{
width:0.6875rem;height:0.6875rem;border:1.5px solid currentColor;
border-radius:0.4375rem 0.4375rem 0.125rem 0.125rem;
}
[data-vibeui-block="dashboard-035"] [data-part="count"]{
position:absolute;top:-0.3125rem;right:-0.3125rem;min-width:1.0625rem;
padding:0 0.25rem;border-radius:9999px;
font-size:0.5625rem;font-weight:800;line-height:1.0625rem;text-align:center;
background:var(--vibeui-dashboard-035-alarm);color:var(--vibeui-dashboard-035-on-alarm);
}
[data-vibeui-block="dashboard-035"] details{position:relative}
[data-vibeui-block="dashboard-035"] summary{
display:flex;align-items:center;gap:0.5rem;cursor:pointer;list-style:none;
padding:0.25rem 0.5rem 0.25rem 0.25rem;border-radius:9999px;
border:1px solid var(--vibeui-dashboard-035-border);
}
[data-vibeui-block="dashboard-035"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="dashboard-035"] [data-part="face"]{
position:relative;width:1.625rem;height:1.625rem;border-radius:50%;flex:none;display:grid;place-items:center;
font-size:0.625rem;font-weight:800;
color:var(--vibeui-dashboard-035-accent);overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="dashboard-035"] [data-part="face"][data-empty="true"]{background:var(--vibeui-dashboard-035-face);}
[data-vibeui-block="dashboard-035"] [data-part="face"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;
}
[data-vibeui-block="dashboard-035"] [data-part="who"]{font-size:0.75rem;font-weight:650;white-space:nowrap}
[data-vibeui-block="dashboard-035"] [data-part="menu"]{
position:absolute;right:0;top:calc(100% + 0.375rem);z-index:2;min-width:11rem;
padding:0.375rem;border-radius:0.75rem;
border:1px solid var(--vibeui-dashboard-035-border);
background:var(--vibeui-dashboard-035-card);
box-shadow:0 12px 28px var(--vibeui-dashboard-035-shadow);
}
[data-vibeui-block="dashboard-035"] [data-part="mail"]{
display:block;padding:0.375rem 0.5rem 0.5rem;font-size:0.6875rem;
color:var(--vibeui-dashboard-035-muted);
border-bottom:1px solid var(--vibeui-dashboard-035-border);margin-bottom:0.25rem;
}
[data-vibeui-block="dashboard-035"] [data-part="menu"] a{
display:block;padding:0.4375rem 0.5rem;border-radius:0.5rem;
font-size:0.8125rem;color:inherit;text-decoration:none;
}
[data-vibeui-block="dashboard-035"] [data-part="menu"] a:hover{background:var(--vibeui-dashboard-035-sub)}
[data-vibeui-block="dashboard-035"] [data-part="tabs"]{
display:flex;gap:0.25rem;overflow-x:auto;padding:0 0.5rem;
background:var(--vibeui-dashboard-035-sub);
}
[data-vibeui-block="dashboard-035"] [data-part="tab"]{
display:flex;align-items:center;gap:0.375rem;white-space:nowrap;
padding:0.625rem 0.625rem;font-size:0.8125rem;font-weight:600;
color:var(--vibeui-dashboard-035-muted);text-decoration:none;
border-bottom:2px solid transparent;
}
[data-vibeui-block="dashboard-035"] [data-part="tab"][aria-current]{
color:var(--vibeui-dashboard-035-fg);border-bottom-color:var(--vibeui-dashboard-035-accent);
}
[data-vibeui-block="dashboard-035"] [data-part="pill"]{
font-size:0.625rem;font-weight:700;padding:0.0625rem 0.3125rem;border-radius:9999px;
background:var(--vibeui-dashboard-035-card);border:1px solid var(--vibeui-dashboard-035-border);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-035"] :is(a,button,summary,input):focus-visible{
outline:2px solid var(--vibeui-dashboard-035-accent);outline-offset:2px;
}
@container (min-width: 46rem){
[data-vibeui-block="dashboard-035"] [data-part="search"]{order:0;flex:1 1 auto;max-width:26rem;width:auto}
[data-vibeui-block="dashboard-035"] [data-part="bar"]{flex-wrap:nowrap;padding:0.75rem 1.25rem}
[data-vibeui-block="dashboard-035"] [data-part="tabs"]{padding:0 0.75rem}
}
`

const DEFAULT_TABS: Dashboard035Tab[] = [
  { label: "Обзор" },
  { label: "Заявки", count: 12 },
  { label: "Клиенты" },
  { label: "Отчёты" },
  { label: "Настройки" },
]

const DEFAULT_MENU = ["Профиль", "Уведомления", "Горячие клавиши", "Выйти"]

/**
 * Ветка темы для заданного фона: светлая подложка не должна доставаться
 * тексту тёмной ветки light-dark().
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

/**
 * Шапка приложения: бренд, крошки, широкое поле поиска, колокольчик со
 * счётчиком, меню профиля на details и строка вкладок. Один файл, ноль
 * зависимостей, клиентского JS нет.
 */
export function Dashboard035({
  product = "Контур",
  avatarImage = "",
  crumbs = ["Рабочее место", "Заявки"],
  searchHint = "Поиск по заявкам, клиентам и документам",
  shortcut = "Ctrl K",
  tabs = DEFAULT_TABS,
  activeTab = "Заявки",
  unread = 7,
  userName = "Анна Реброва",
  userMail = "anna@kontur.ru",
  menu = DEFAULT_MENU,
  accent,
  background = "",
  headerLabel = "Шапка приложения",
  bellText = "Уведомления: {count} непрочитанных",
  menuLabel = "Меню профиля",
  tabsLabel = "Разделы",
  className,
  style,
}: Dashboard035Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-035-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-035-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")

  return (
    <>
      <style href="vibeui-dashboard-035" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="dashboard-035"
        className={className}
        style={palette}
        aria-label={headerLabel}
      >
        <div data-part="shell">
          <div data-part="bar">
            <span data-part="brand">
              <span data-part="mark" aria-hidden="true">
                {product.charAt(0)}
              </span>
              {product}
            </span>

            <ol data-part="crumbs">
              {crumbs.map((crumb, index) => (
                <li key={crumb}>
                  {index === crumbs.length - 1 ? (
                    <span aria-current="page">{crumb}</span>
                  ) : (
                    <a href="#dashboard-035">{crumb}</a>
                  )}
                </li>
              ))}
            </ol>

            <div data-part="search">
              <span data-part="glass" aria-hidden="true" />
              <label htmlFor="dashboard-035-search" hidden>
                {searchHint}
              </label>
              <input
                id="dashboard-035-search"
                type="search"
                placeholder={searchHint}
              />
              <kbd>{shortcut}</kbd>
            </div>

            <div data-part="tools">
              <button
                type="button"
                data-part="bell"
                aria-label={bellText.replace("{count}", String(unread))}
              >
                <span aria-hidden="true" />
                <span data-part="count" aria-live="polite">
                  {unread}
                </span>
              </button>

              <details>
                <summary>
                  <span
                    data-part="face"
                    data-empty={avatarImage ? undefined : "true"}
                    aria-hidden="true"
                  >
                    {avatarImage ? (
                      <img
                        src={avatarImage}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}
                    {initials}
                  </span>
                  <span data-part="who">{userName}</span>
                </summary>
                <nav data-part="menu" aria-label={menuLabel}>
                  <span data-part="mail">{userMail}</span>
                  {menu.map((entry) => (
                    <a key={entry} href="#dashboard-035">
                      {entry}
                    </a>
                  ))}
                </nav>
              </details>
            </div>
          </div>

          <nav data-part="tabs" aria-label={tabsLabel}>
            {tabs.map((tab) => (
              <a
                key={tab.label}
                href="#dashboard-035"
                data-part="tab"
                aria-current={tab.label === activeTab ? "page" : undefined}
              >
                {tab.label}
                {tab.count ? <span data-part="pill">{tab.count}</span> : null}
              </a>
            ))}
          </nav>
        </div>
      </header>
    </>
  )
}

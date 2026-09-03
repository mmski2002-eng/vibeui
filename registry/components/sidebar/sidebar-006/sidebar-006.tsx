import type { ComponentProps, CSSProperties } from "react"

export type Sidebar006Item = {
  label: string
  href?: string
}

export type Sidebar006Props = Omit<ComponentProps<"div">, "children"> & {
  items?: Sidebar006Item[]
  activeLabel?: string
  userName?: string
  userMeta?: string
  menu?: Sidebar006Item[]
  /** Подпись списка разделов для скринридера. */
  navLabel?: string
  /** Подпись кнопки профиля: {name} — имя пользователя. */
  menuLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: профиль стоит внизу колонки и раскрывается вверх. Это
// не украшение: выход из аккаунта и настройки живут рядом с именем, а не в
// общем списке разделов, поэтому их невозможно нажать по ошибке при выборе
// раздела. Меню профиля собрано на <details> — состояние держит браузер,
// клиентского JS в компоненте нет вообще.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// становится тёмным там, где тёмный контекст, и не носит собственного фона.
// Всплывающее меню — исключение: у него подложка непрозрачная, иначе сквозь
// него просвечивают разделы.
const STYLES = `
:where([data-vibeui-block="sidebar-006"]){
--vibeui-sidebar-006-bg:transparent;
--vibeui-sidebar-006-panel:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-sidebar-006-fg:light-dark(oklch(0.25 0.016 265),oklch(0.93 0.006 265));
--vibeui-sidebar-006-muted:color-mix(in oklab,var(--vibeui-sidebar-006-fg) 68%,transparent);
--vibeui-sidebar-006-border:light-dark(oklch(0.91 0.006 265),oklch(0.35 0.012 265));
--vibeui-sidebar-006-hover:light-dark(oklch(0.55 0.02 265 / 7%),oklch(0.85 0.02 265 / 10%));
--vibeui-sidebar-006-shadow:light-dark(oklch(0.2 0.02 265 / 14%),oklch(0 0 0 / 55%));
--vibeui-sidebar-006-accent:light-dark(oklch(0.55 0.16 200),oklch(0.74 0.14 200));
--vibeui-sidebar-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sidebar-006"]{color-scheme:dark}
[data-vibeui-block="sidebar-006"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:15rem;min-height:17rem;box-sizing:border-box;padding:0.625rem;
background:var(--vibeui-sidebar-006-bg);color:var(--vibeui-sidebar-006-fg);
border:1px solid var(--vibeui-sidebar-006-border);border-radius:0.875rem;
font-family:var(--vibeui-sidebar-006-font);
}
[data-vibeui-block="sidebar-006"] [data-part="nav"] ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="sidebar-006"] [data-part="nav"] a{
display:block;padding:0.4375rem 0.5rem;border-radius:0.5rem;
color:var(--vibeui-sidebar-006-muted);text-decoration:none;font-size:0.9375rem;line-height:1.3;
}
[data-vibeui-block="sidebar-006"] [data-part="nav"] a:hover{background:var(--vibeui-sidebar-006-hover);color:var(--vibeui-sidebar-006-fg)}
[data-vibeui-block="sidebar-006"] [data-part="nav"] a:focus-visible{outline:2px solid var(--vibeui-sidebar-006-accent);outline-offset:-2px}
[data-vibeui-block="sidebar-006"] [data-part="nav"] a[aria-current="page"]{
background:color-mix(in oklab,var(--vibeui-sidebar-006-accent) 14%,transparent);
color:var(--vibeui-sidebar-006-fg);font-weight:600;
}
/* Профиль прижат к низу распоркой, а не отступом: высота колонки бывает разной. */
[data-vibeui-block="sidebar-006"] [data-part="spacer"]{flex:1}
[data-vibeui-block="sidebar-006"] [data-part="profile"]{position:relative;border-top:1px solid var(--vibeui-sidebar-006-border);padding-top:0.5rem}
[data-vibeui-block="sidebar-006"] summary{
display:flex;align-items:center;gap:0.5rem;cursor:pointer;list-style:none;
padding:0.375rem 0.5rem;border-radius:0.5rem;
}
[data-vibeui-block="sidebar-006"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="sidebar-006"] summary:hover{background:var(--vibeui-sidebar-006-hover)}
[data-vibeui-block="sidebar-006"] summary:focus-visible{outline:2px solid var(--vibeui-sidebar-006-accent);outline-offset:-2px}
[data-vibeui-block="sidebar-006"] [data-part="avatar"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.75rem;height:1.75rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-sidebar-006-accent) 18%,transparent);
color:var(--vibeui-sidebar-006-fg);font-size:0.75rem;font-weight:700;
}
[data-vibeui-block="sidebar-006"] [data-part="who"]{display:flex;flex-direction:column;min-width:0}
[data-vibeui-block="sidebar-006"] [data-part="name"]{font-size:0.875rem;font-weight:650;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="sidebar-006"] [data-part="meta"]{font-size:0.8125rem;color:var(--vibeui-sidebar-006-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="sidebar-006"] [data-part="dots"]{
margin-left:auto;flex:none;color:var(--vibeui-sidebar-006-muted);font-size:0.875rem;line-height:1;
}
/* Меню раскрывается вверх: внизу колонки места нет, а обрезанное меню бесполезно. */
[data-vibeui-block="sidebar-006"] [data-part="menu"]{
position:absolute;left:0;right:0;bottom:calc(100% - 0.25rem);z-index:2;
margin:0;padding:0.25rem;list-style:none;
background:var(--vibeui-sidebar-006-panel);
border:1px solid var(--vibeui-sidebar-006-border);border-radius:0.625rem;
box-shadow:0 8px 24px var(--vibeui-sidebar-006-shadow);
}
[data-vibeui-block="sidebar-006"] [data-part="menu"] a{
display:block;padding:0.375rem 0.5rem;border-radius:0.375rem;
color:var(--vibeui-sidebar-006-fg);text-decoration:none;font-size:0.875rem;
}
[data-vibeui-block="sidebar-006"] [data-part="menu"] a:hover{background:var(--vibeui-sidebar-006-hover)}
[data-vibeui-block="sidebar-006"] [data-part="menu"] a:focus-visible{outline:2px solid var(--vibeui-sidebar-006-accent);outline-offset:-2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sidebar-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Sidebar006Item[] = [
  { label: "Лента", href: "#" },
  { label: "Проекты", href: "#" },
  { label: "Задачи", href: "#" },
  { label: "Файлы", href: "#" },
]

const DEFAULT_MENU: Sidebar006Item[] = [
  { label: "Настройки профиля", href: "#" },
  { label: "Сменить тему", href: "#" },
  { label: "Выйти", href: "#" },
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

/**
 * Меню с карточкой профиля внизу и меню аккаунта, раскрывающимся вверх.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sidebar006({
  items = DEFAULT_ITEMS,
  activeLabel = "Проекты",
  userName = "Ольга Дорн",
  userMeta = "olga@studio.ru",
  menu = DEFAULT_MENU,
  navLabel = "Разделы",
  menuLabel = "Меню профиля: {name}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Sidebar006Props) {
  const palette = {
    ...(accent ? { "--vibeui-sidebar-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-sidebar-006-bg": background,
          "--vibeui-sidebar-006-panel": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const short = userName
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")

  return (
    <>
      <style href="vibeui-sidebar-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="sidebar"
        data-vibeui-block="sidebar-006"
        className={className}
        style={palette}
      >
        <nav data-part="nav" aria-label={navLabel}>
          <ul>
            {items.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  aria-current={item.label === activeLabel ? "page" : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div data-part="spacer" />
        <div data-part="profile">
          <details>
            <summary aria-label={menuLabel.replace("{name}", userName)}>
              <span data-part="avatar" aria-hidden="true">
                {short}
              </span>
              <span data-part="who">
                <span data-part="name">{userName}</span>
                <span data-part="meta">{userMeta}</span>
              </span>
              <span data-part="dots" aria-hidden="true">
                •••
              </span>
            </summary>
            <ul data-part="menu">
              {menu.map((entry) => (
                <li key={entry.label}>
                  <a href={entry.href}>{entry.label}</a>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </>
  )
}

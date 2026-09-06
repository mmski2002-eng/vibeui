import type { CSSProperties } from "react"

export type Dashboard002Link = {
  label: string
  href?: string
  count?: number
}

export type Dashboard002Props = {
  product?: string
  section?: string
  user?: string
  nav?: { title?: string; links: Dashboard002Link[] }[]
  activeLabel?: string
  /** Подпись поля поиска: она же placeholder, она же aria-label. */
  searchText?: string
  /** Подпись свёрнутой навигации на узкой ширине. */
  menuText?: string
  /** Название навигации для скринридера. */
  navText?: string
  hint?: string
  /** Текст в пустой области контента. */
  slotText?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: каркас приложения — шапка, боковая навигация и область контента.
// Каркас держит грид, а не позиционирование: сайдбар и контент лежат в одной
// сетке, поэтому колонка не «плавает» и не требует отступа-компенсации.
// На узкой ширине сайдбар уезжает в раскрывающийся список на details: своё
// выдвижное меню потребовало бы состояния, а здесь его держит браузер.
//
// Тема берётся из color-scheme окружения через light-dark(): собственной
// подложки у каркаса нет, панели внутри держат свою поверхность.
const STYLES = `
:where([data-vibeui-block="dashboard-002"]){
--vibeui-dashboard-002-bg:transparent;
--vibeui-dashboard-002-panel:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-dashboard-002-field:light-dark(oklch(0.975 0 265),oklch(0.3 0 265));
--vibeui-dashboard-002-fg:light-dark(oklch(0.22 0 265),oklch(0.95 0 265));
--vibeui-dashboard-002-muted:light-dark(oklch(0.55 0 265),oklch(0.71 0 265));
--vibeui-dashboard-002-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-dashboard-002-hover:light-dark(oklch(0.55 0 265 / 8%),oklch(0.85 0 265 / 12%));
--vibeui-dashboard-002-active:light-dark(oklch(0.55 0.2 39.8 / 12%),oklch(0.74 0.16 39.8 / 22%));
--vibeui-dashboard-002-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.76 0.15 39.8));
--vibeui-dashboard-002-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-002"]{color-scheme:dark}
[data-vibeui-block="dashboard-002"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-dashboard-002-bg);
border:1px solid var(--vibeui-dashboard-002-border);border-radius:1rem;
font-family:var(--vibeui-dashboard-002-sans);color:var(--vibeui-dashboard-002-fg);
}
[data-vibeui-block="dashboard-002"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-002"] [data-part="topbar"]{
display:flex;align-items:center;gap:0.75rem;
min-height:3rem;padding:0 0.875rem;
background:var(--vibeui-dashboard-002-panel);
border-bottom:1px solid var(--vibeui-dashboard-002-border);
}
[data-vibeui-block="dashboard-002"] [data-part="brand"]{font-size:0.875rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="dashboard-002"] [data-part="search"]{
flex:1 1 auto;min-width:0;height:2rem;padding:0 0.625rem;
border:1px solid var(--vibeui-dashboard-002-border);border-radius:0.5rem;
background:var(--vibeui-dashboard-002-field);color:inherit;font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="dashboard-002"] [data-part="search"]:focus-visible{outline:2px solid var(--vibeui-dashboard-002-accent);outline-offset:1px}
[data-vibeui-block="dashboard-002"] [data-part="user"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:1.75rem;height:1.75rem;border-radius:9999px;
background:var(--vibeui-dashboard-002-active);color:var(--vibeui-dashboard-002-accent);
font-size:0.75rem;font-weight:700;
}
/* Каркас на гриде: колонка сайдбара не «плавает» и не требует компенсации. */
[data-vibeui-block="dashboard-002"] [data-part="shell"]{display:grid;grid-template-columns:1fr}
@container (min-width: 44rem){
[data-vibeui-block="dashboard-002"] [data-part="shell"]{grid-template-columns:13rem 1fr}
[data-vibeui-block="dashboard-002"] [data-part="side"] summary{display:none}
[data-vibeui-block="dashboard-002"] [data-part="side"] [data-part="nav"]{display:block}
}
[data-vibeui-block="dashboard-002"] [data-part="side"]{
padding:0.625rem;
background:var(--vibeui-dashboard-002-panel);
border-bottom:1px solid var(--vibeui-dashboard-002-border);
}
@container (min-width: 44rem){
[data-vibeui-block="dashboard-002"] [data-part="side"]{
border-bottom:0;border-right:1px solid var(--vibeui-dashboard-002-border);
}
}
/* Узкая ширина: навигация складывается в details, состояние держит браузер. */
[data-vibeui-block="dashboard-002"] [data-part="side"] summary{
list-style:none;cursor:pointer;
display:flex;align-items:center;gap:0.5rem;
min-height:2rem;padding:0 0.5rem;border-radius:0.5rem;
font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="dashboard-002"] [data-part="side"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="dashboard-002"] [data-part="side"] summary:focus-visible{outline:2px solid var(--vibeui-dashboard-002-accent);outline-offset:-2px}
[data-vibeui-block="dashboard-002"] [data-part="bars"]{
width:0.875rem;height:0.5625rem;
border-top:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
}
[data-vibeui-block="dashboard-002"] [data-part="nav"]{display:none;padding-top:0.375rem}
[data-vibeui-block="dashboard-002"] details[open] [data-part="nav"]{display:block}
[data-vibeui-block="dashboard-002"] [data-part="group"]{
margin:0.5rem 0 0.25rem 0.5rem;
font-size:0.6875rem;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-dashboard-002-muted);
}
[data-vibeui-block="dashboard-002"] [data-part="link"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
min-height:2rem;padding:0 0.5rem;border-radius:0.5rem;
color:inherit;text-decoration:none;font-size:0.8125rem;
}
[data-vibeui-block="dashboard-002"] [data-part="link"]:hover{background:var(--vibeui-dashboard-002-hover)}
[data-vibeui-block="dashboard-002"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-dashboard-002-accent);outline-offset:-2px}
/* Текущий раздел: заливка и жирность, а не один цвет текста. */
[data-vibeui-block="dashboard-002"] [data-part="link"][aria-current="page"]{
background:var(--vibeui-dashboard-002-active);color:var(--vibeui-dashboard-002-accent);font-weight:650;
}
[data-vibeui-block="dashboard-002"] [data-part="count"]{font-size:0.6875rem;color:var(--vibeui-dashboard-002-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="dashboard-002"] [data-part="main"]{padding:1rem}
[data-vibeui-block="dashboard-002"] h2{margin:0 0 0.25rem;font-size:1rem;font-weight:700}
[data-vibeui-block="dashboard-002"] [data-part="hint"]{margin:0 0 0.875rem;font-size:0.8125rem;color:var(--vibeui-dashboard-002-muted)}
[data-vibeui-block="dashboard-002"] [data-part="slot"]{
display:grid;place-items:center;min-height:8rem;padding:1rem;
border:1px dashed var(--vibeui-dashboard-002-border);border-radius:0.875rem;
font-size:0.8125rem;color:var(--vibeui-dashboard-002-muted);text-align:center;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_NAV: Dashboard002Props["nav"] = [
  {
    title: "Работа",
    links: [
      { label: "Обзор", href: "#" },
      { label: "Компоненты", href: "#", count: 248 },
      { label: "Блоки", href: "#", count: 12 },
    ],
  },
  {
    title: "Проект",
    links: [
      { label: "Участники", href: "#", count: 4 },
      { label: "Ключи доступа", href: "#" },
      { label: "Настройки", href: "#" },
    ],
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Каркас приложения: шапка, боковая навигация на гриде и область контента.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard002({
  product = "VibeUI",
  section = "Компоненты",
  user = "АР",
  nav = DEFAULT_NAV,
  activeLabel = "Компоненты",
  searchText = "Поиск по проекту",
  menuText = "Разделы",
  navText = "Разделы приложения",
  hint = "Каркас задаёт только раскладку: содержимое раздела вставляется сюда.",
  slotText = "Место под таблицу, карточки или форму",
  background = "",
  accent,
  className,
  style,
}: Dashboard002Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-002"
        className={className}
        style={palette}
        aria-label={`${product}: ${section}`}
      >
        <header data-part="topbar">
          <span data-part="brand">{product}</span>
          <input
            data-part="search"
            type="search"
            placeholder={searchText}
            aria-label={searchText}
          />
          <span data-part="user" aria-hidden="true">
            {user}
          </span>
        </header>

        <div data-part="shell">
          <div data-part="side">
            <details>
              <summary>
                <span data-part="bars" aria-hidden="true" />
                {menuText}
              </summary>
              <nav data-part="nav" aria-label={navText}>
                {nav?.map((group) => (
                  <div key={group.title ?? group.links[0].label}>
                    {group.title ? (
                      <p data-part="group">{group.title}</p>
                    ) : null}
                    {group.links.map((link) => (
                      <a
                        key={link.label}
                        data-part="link"
                        href={link.href ?? "#"}
                        aria-current={
                          link.label === activeLabel ? "page" : undefined
                        }
                      >
                        {link.label}
                        {link.count ? (
                          <span data-part="count">{link.count}</span>
                        ) : null}
                      </a>
                    ))}
                  </div>
                ))}
              </nav>
            </details>
          </div>

          <main data-part="main">
            <h2>{section}</h2>
            <p data-part="hint">{hint}</p>
            <div data-part="slot">{slotText}</div>
          </main>
        </div>
      </section>
    </>
  )
}

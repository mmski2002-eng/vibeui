import type { CSSProperties } from "react"

export type Navmenu001Link = {
  label: string
  hint?: string
  href?: string
}

export type Navmenu001Column = {
  title: string
  links: Navmenu001Link[]
}

export type Navmenu001Entry = {
  label: string
  href?: string
  columns?: Navmenu001Column[]
}

export type Navmenu001Props = {
  entries?: Navmenu001Entry[]
  /** Подпись навигации для скринридера. */
  label?: string
  /** Подложка полосы и панели. Пусто — своя палитра компонента. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: навигация сайта, где выпадающая панель — не список ссылок, а
// колонки с пояснениями: по подписи «Аналитика» непонятно, что внутри, по строке
// под ней — понятно. Панель открывает HTML popover, а якорем служит вся полоса
// навигации, поэтому панель встаёт под ней целиком, а не под отдельной кнопкой.
const STYLES = `
:where([data-vibeui-block="navmenu-001"]){
--vibeui-navmenu-001-bg:light-dark(oklch(1 0 0),oklch(0.23 0.013 265));
--vibeui-navmenu-001-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-navmenu-001-muted:light-dark(oklch(0.55 0.014 265),oklch(0.69 0.012 265));
--vibeui-navmenu-001-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-navmenu-001-hover:light-dark(oklch(0.55 0.02 265 / 8%),oklch(0.85 0.02 265 / 12%));
--vibeui-navmenu-001-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-navmenu-001-shadow:light-dark(oklch(0.2 0.03 265 / 40%),oklch(0 0 0 / 70%));
--vibeui-navmenu-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="navmenu-001"]{
box-sizing:border-box;width:100%;max-width:44rem;
font-family:var(--vibeui-navmenu-001-font);color:var(--vibeui-navmenu-001-fg);
}
[data-vibeui-block="navmenu-001"] [data-part="bar"]{
box-sizing:border-box;padding:0.375rem;
display:flex;align-items:center;gap:0.125rem;
background:var(--vibeui-navmenu-001-bg);
border:1px solid var(--vibeui-navmenu-001-border);border-radius:0.75rem;
anchor-name:--vibeui-navmenu-001-bar;
}
[data-vibeui-block="navmenu-001"] [data-part="trigger"],
[data-vibeui-block="navmenu-001"] [data-part="plain"]{
appearance:none;border:0;background:none;cursor:pointer;text-decoration:none;
display:inline-flex;align-items:center;gap:0.375rem;
height:2rem;padding:0 0.75rem;border-radius:0.5rem;
font:inherit;font-size:0.875rem;color:inherit;
transition:background-color .14s ease;
}
[data-vibeui-block="navmenu-001"] [data-part="trigger"]:hover,
[data-vibeui-block="navmenu-001"] [data-part="plain"]:hover{background:var(--vibeui-navmenu-001-hover)}
[data-vibeui-block="navmenu-001"] [data-part="trigger"]:focus-visible,
[data-vibeui-block="navmenu-001"] [data-part="plain"]:focus-visible{outline:2px solid var(--vibeui-navmenu-001-accent);outline-offset:-2px}
[data-vibeui-block="navmenu-001"] [data-part="caret"]{
width:0.375rem;height:0.375rem;margin-top:-0.1875rem;
border:1.5px solid var(--vibeui-navmenu-001-muted);border-left:0;border-top:0;
transform:rotate(45deg);transition:transform .16s ease;
}
[data-vibeui-block="navmenu-001"] [data-part="panel"]{
position:fixed;inset:auto;margin:0;
width:min(40rem,92vw);padding:1rem;box-sizing:border-box;
background:var(--vibeui-navmenu-001-bg);color:var(--vibeui-navmenu-001-fg);
border:1px solid var(--vibeui-navmenu-001-border);border-radius:0.875rem;
font-family:var(--vibeui-navmenu-001-font);
box-shadow:0 24px 48px -24px var(--vibeui-navmenu-001-shadow);
}
/* Якорь — вся полоса: панель широкая и не должна прыгать за отдельной кнопкой. */
@supports (anchor-name: --a){
[data-vibeui-block="navmenu-001"] [data-part="panel"]{
position-anchor:--vibeui-navmenu-001-bar;
position-area:bottom span-right;margin-top:0.5rem;
position-try-fallbacks:flip-block;
}
}
[data-vibeui-block="navmenu-001"] [data-part="columns"]{
display:grid;grid-template-columns:repeat(auto-fit,minmax(11rem,1fr));gap:1rem 1.5rem;
}
[data-vibeui-block="navmenu-001"] [data-part="title"]{
margin:0 0 0.5rem;font-size:0.6875rem;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-navmenu-001-muted);
}
[data-vibeui-block="navmenu-001"] [data-part="list"]{margin:0;padding:0;list-style:none;display:grid;gap:0.125rem}
[data-vibeui-block="navmenu-001"] [data-part="link"]{
display:block;padding:0.4375rem 0.5rem;border-radius:0.5rem;text-decoration:none;color:inherit;
}
[data-vibeui-block="navmenu-001"] [data-part="link"]:hover{background:var(--vibeui-navmenu-001-hover)}
[data-vibeui-block="navmenu-001"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-navmenu-001-accent);outline-offset:-2px}
[data-vibeui-block="navmenu-001"] [data-part="name"]{display:block;font-size:0.875rem;font-weight:550}
[data-vibeui-block="navmenu-001"] [data-part="hint"]{display:block;margin-top:0.125rem;font-size:0.75rem;line-height:1.45;color:var(--vibeui-navmenu-001-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navmenu-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ENTRIES: Navmenu001Entry[] = [
  {
    label: "Продукт",
    columns: [
      {
        title: "Инструменты",
        links: [
          { label: "Редактор", hint: "Собирайте страницы из готовых блоков" },
          { label: "Аналитика", hint: "Просмотры, источники и воронки" },
          { label: "Формы", hint: "Заявки падают в почту и в CRM" },
        ],
      },
      {
        title: "Платформа",
        links: [
          { label: "Домены", hint: "Свой адрес и сертификат за минуту" },
          { label: "Хранилище", hint: "Картинки и файлы рядом с сайтом" },
          { label: "Роли", hint: "Кто редактирует, а кто только смотрит" },
        ],
      },
    ],
  },
  {
    label: "Решения",
    columns: [
      {
        title: "Для кого",
        links: [
          { label: "Студиям", hint: "Десятки сайтов в одной панели" },
          { label: "Магазинам", hint: "Каталог, оплата и доставка" },
          { label: "Медиа", hint: "Поток материалов и авторы" },
        ],
      },
    ],
  },
  { label: "Цены", href: "#" },
  { label: "Документация", href: "#" },
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 * Считается один раз при рендере, клиентского кода не добавляет.
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
 * Навигация сайта с выпадающей панелью из колонок ссылок с описаниями.
 * Один файл, ноль зависимостей, собственная палитра, клиентского JS нет.
 */
export function Navmenu001({
  entries = DEFAULT_ENTRIES,
  label = "Основная навигация",
  background = "",
  accent,
  className,
  style,
}: Navmenu001Props) {
  const palette = {
    ...(accent ? { "--vibeui-navmenu-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-navmenu-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navmenu-001" precedence="medium">
        {STYLES}
      </style>
      <nav
        data-vibeui-block="navmenu-001"
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="bar">
          {entries.map((entry, index) => {
            if (!entry.columns) {
              return (
                <a key={entry.label} data-part="plain" href={entry.href ?? "#"}>
                  {entry.label}
                </a>
              )
            }

            const id = `vibeui-navmenu-001-${index}`

            return (
              <span key={entry.label}>
                <button
                  type="button"
                  data-part="trigger"
                  aria-haspopup="true"
                  popoverTarget={id}
                >
                  {entry.label}
                  <span data-part="caret" aria-hidden="true" />
                </button>
                <div
                  id={id}
                  data-part="panel"
                  popover="auto"
                  aria-label={entry.label}
                >
                  <div data-part="columns">
                    {entry.columns.map((column) => (
                      <div key={column.title}>
                        <p data-part="title">{column.title}</p>
                        <ul data-part="list">
                          {column.links.map((link) => (
                            <li key={link.label}>
                              <a data-part="link" href={link.href ?? "#"}>
                                <span data-part="name">{link.label}</span>
                                {link.hint ? (
                                  <span data-part="hint">{link.hint}</span>
                                ) : null}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </span>
            )
          })}
        </div>
      </nav>
    </>
  )
}

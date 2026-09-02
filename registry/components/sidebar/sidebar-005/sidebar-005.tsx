"use client"

import { useId, useMemo, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Sidebar005Item = {
  label: string
  href?: string
  group: string
}

export type Sidebar005Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  items?: Sidebar005Item[]
  activeLabel?: string
  placeholder?: string
  /** Подпись всей навигации для скринридера. */
  navLabel?: string
  /** Объявление для скринридера: {count} — сколько пунктов осталось. */
  statusText?: string
  /** Что показать, когда поиск ничего не нашёл. */
  emptyText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: меню с поиском по собственным пунктам. Когда разделов
// три десятка, глазами их не найти, а вкладывать их в дерево — прятать.
// Совпавшая часть подписи подсвечивается <mark>: без неё непонятно, почему
// пункт остался в списке. Число найденного объявляется через aria-live,
// потому что «список стал короче» — событие, невидимое для скринридера.
const STYLES = `
:where([data-vibeui-block="sidebar-005"]){
--vibeui-sidebar-005-bg:transparent;
--vibeui-sidebar-005-fg:light-dark(oklch(0.25 0.016 265),oklch(0.93 0.006 265));
--vibeui-sidebar-005-muted:light-dark(oklch(0.55 0.014 265),oklch(0.69 0.012 265));
--vibeui-sidebar-005-border:light-dark(oklch(0.91 0.006 265),oklch(0.35 0.012 265));
--vibeui-sidebar-005-field:light-dark(oklch(0.98 0.002 265),oklch(0.28 0.012 265));
--vibeui-sidebar-005-hover:light-dark(oklch(0.55 0.02 265 / 7%),oklch(0.85 0.02 265 / 10%));
--vibeui-sidebar-005-accent:light-dark(oklch(0.55 0.19 262),oklch(0.73 0.16 262));
--vibeui-sidebar-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="sidebar-005"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:15rem;box-sizing:border-box;padding:0.625rem;
background:var(--vibeui-sidebar-005-bg);color:var(--vibeui-sidebar-005-fg);
border:1px solid var(--vibeui-sidebar-005-border);border-radius:0.875rem;
font-family:var(--vibeui-sidebar-005-font);
}
[data-vibeui-block="sidebar-005"] [data-part="search"]{
width:100%;box-sizing:border-box;
padding:0.4375rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-sidebar-005-border);
background:var(--vibeui-sidebar-005-field);color:inherit;
font-family:inherit;font-size:0.8125rem;line-height:1.3;
}
[data-vibeui-block="sidebar-005"] [data-part="search"]::placeholder{color:var(--vibeui-sidebar-005-muted)}
[data-vibeui-block="sidebar-005"] [data-part="search"]:focus-visible{outline:2px solid var(--vibeui-sidebar-005-accent);outline-offset:1px}
[data-vibeui-block="sidebar-005"] [data-part="list"]{display:flex;flex-direction:column;gap:0.625rem;max-height:14rem;overflow-y:auto;overscroll-behavior:contain}
[data-vibeui-block="sidebar-005"] [data-part="group"]{display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="sidebar-005"] [data-part="title"]{
padding:0 0.5rem;font-size:0.625rem;font-weight:700;letter-spacing:0.07em;
text-transform:uppercase;color:var(--vibeui-sidebar-005-muted);
}
[data-vibeui-block="sidebar-005"] ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.0625rem}
[data-vibeui-block="sidebar-005"] a{
display:block;padding:0.375rem 0.5rem;border-radius:0.375rem;
color:var(--vibeui-sidebar-005-muted);text-decoration:none;font-size:0.8125rem;line-height:1.3;
}
[data-vibeui-block="sidebar-005"] a:hover{background:var(--vibeui-sidebar-005-hover);color:var(--vibeui-sidebar-005-fg)}
[data-vibeui-block="sidebar-005"] a:focus-visible{outline:2px solid var(--vibeui-sidebar-005-accent);outline-offset:-2px}
[data-vibeui-block="sidebar-005"] a[aria-current="page"]{
color:var(--vibeui-sidebar-005-fg);font-weight:600;
background:color-mix(in oklab,var(--vibeui-sidebar-005-accent) 12%,transparent);
}
/* Подсветка совпадения: без неё непонятно, за что пункт попал в выдачу. */
[data-vibeui-block="sidebar-005"] mark{
background:color-mix(in oklab,var(--vibeui-sidebar-005-accent) 24%,transparent);
color:var(--vibeui-sidebar-005-fg);border-radius:0.1875rem;padding:0 0.0625rem;
}
[data-vibeui-block="sidebar-005"] [data-part="empty"]{
margin:0;padding:0.5rem;font-size:0.8125rem;line-height:1.4;
color:var(--vibeui-sidebar-005-muted);
}
[data-vibeui-block="sidebar-005"] [data-part="status"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sidebar-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Sidebar005Item[] = [
  { label: "Профиль", href: "#", group: "Аккаунт" },
  { label: "Уведомления", href: "#", group: "Аккаунт" },
  { label: "Безопасность", href: "#", group: "Аккаунт" },
  { label: "Тарифы и оплата", href: "#", group: "Аккаунт" },
  { label: "Участники", href: "#", group: "Команда" },
  { label: "Роли и доступы", href: "#", group: "Команда" },
  { label: "Приглашения", href: "#", group: "Команда" },
  { label: "Ключи API", href: "#", group: "Разработка" },
  { label: "Вебхуки", href: "#", group: "Разработка" },
  { label: "Журнал событий", href: "#", group: "Разработка" },
]

function highlight(label: string, query: string) {
  const at = label.toLowerCase().indexOf(query)
  if (!query || at < 0) return label
  return (
    <>
      {label.slice(0, at)}
      <mark>{label.slice(at, at + query.length)}</mark>
      {label.slice(at + query.length)}
    </>
  )
}

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
 * Меню с поиском по пунктам: совпадение подсвечено, число найденного объявляется.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sidebar005({
  items = DEFAULT_ITEMS,
  activeLabel = "Ключи API",
  placeholder = "Поиск по меню",
  navLabel = "Настройки",
  statusText = "Найдено пунктов: {count}",
  emptyText = "Ничего не найдено. Проверьте написание.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Sidebar005Props) {
  const [query, setQuery] = useState("")
  const searchId = useId()

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const found = items.filter((item) =>
      item.label.toLowerCase().includes(needle),
    )
    const order: string[] = []
    const bucket = new Map<string, Sidebar005Item[]>()

    for (const item of found) {
      if (!bucket.has(item.group)) {
        bucket.set(item.group, [])
        order.push(item.group)
      }
      bucket.get(item.group)!.push(item)
    }

    return { order, bucket, count: found.length, needle }
  }, [items, query])

  const palette = {
    ...(accent ? { "--vibeui-sidebar-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-sidebar-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sidebar-005" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="sidebar-005"
        aria-label={navLabel}
        className={className}
        style={palette}
      >
        <input
          id={searchId}
          data-part="search"
          type="search"
          value={query}
          placeholder={placeholder}
          aria-label={placeholder}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setQuery("")
          }}
        />
        <p data-part="status" role="status">
          {statusText.replace("{count}", String(groups.count))}
        </p>
        <div data-part="list">
          {groups.order.map((group) => (
            <div data-part="group" key={group}>
              <span data-part="title">{group}</span>
              <ul>
                {groups.bucket.get(group)!.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      aria-current={
                        item.label === activeLabel ? "page" : undefined
                      }
                    >
                      {highlight(item.label, groups.needle)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {groups.count === 0 ? <p data-part="empty">{emptyText}</p> : null}
        </div>
      </nav>
    </>
  )
}

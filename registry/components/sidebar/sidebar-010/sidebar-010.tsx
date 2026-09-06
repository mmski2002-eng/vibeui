"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Sidebar010Item = {
  id: string
  label: string
  /** Закреплён ли пункт при первом показе. */
  pinned?: boolean
}

export type Sidebar010Props = Omit<ComponentProps<"nav">, "children"> & {
  items?: Sidebar010Item[]
  activeId?: string
  pinnedLabel?: string
  restLabel?: string
  /** Подпись кнопки закрепления. {label} — название пункта. */
  pinTemplate?: string
  /** Подпись кнопки открепления. {label} — название пункта. */
  unpinTemplate?: string
  /** Что показать, когда закреплённых нет. */
  emptyText?: string
  accent?: string
  /** Пусто — подложки нет, меню лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: у длинного меню есть три пункта, которыми пользуются
// каждый день, и двадцать, в которые заходят раз в квартал. Закреплённые
// поднимаются наверх отдельной группой, остальные лежат ниже в своём
// порядке. Кнопка закрепления видна всегда, а не по наведению: на телефоне
// наведения нет, и скрытая кнопка там просто не существует. Пустая группа
// не исчезает молча — она объясняет, что делать, иначе непонятно, откуда
// вообще берутся закреплённые.
const STYLES = `
:where([data-vibeui-block="sidebar-010"]){
--vibeui-sidebar-010-bg:transparent;
--vibeui-sidebar-010-fg:light-dark(oklch(0.27 0 265),oklch(0.94 0 265));
--vibeui-sidebar-010-muted:color-mix(in oklab,var(--vibeui-sidebar-010-fg) 62%,transparent);
--vibeui-sidebar-010-border:light-dark(oklch(0 0 0 / 11%),oklch(1 0 0 / 12%));
--vibeui-sidebar-010-hover:light-dark(oklch(0 0 0 / 5%),oklch(1 0 0 / 7%));
--vibeui-sidebar-010-accent:light-dark(oklch(0.5 0.16 39.8),oklch(0.8 0.12 39.8));
--vibeui-sidebar-010-active:color-mix(in oklab,var(--vibeui-sidebar-010-accent) 14%,transparent);
--vibeui-sidebar-010-pin:light-dark(oklch(0.6 0.14 39.8),oklch(0.82 0.12 39.8));
--vibeui-sidebar-010-radius:0.5rem;
--vibeui-sidebar-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sidebar-010"]{color-scheme:dark}
[data-vibeui-block="sidebar-010"]{
display:flex;flex-direction:column;gap:0.875rem;
width:100%;max-width:15rem;box-sizing:border-box;padding:0.625rem;
background:var(--vibeui-sidebar-010-bg);color:var(--vibeui-sidebar-010-fg);
font-family:var(--vibeui-sidebar-010-font);
}
[data-vibeui-block="sidebar-010"] *{box-sizing:border-box}
[data-vibeui-block="sidebar-010"] [data-part="caption"]{
display:block;padding:0 0.5rem 0.375rem;
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-sidebar-010-muted);
}
[data-vibeui-block="sidebar-010"] ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="sidebar-010"] [data-part="row"]{
display:flex;align-items:center;gap:0.25rem;border-radius:var(--vibeui-sidebar-010-radius);
}
[data-vibeui-block="sidebar-010"] [data-part="row"]:hover{background:var(--vibeui-sidebar-010-hover)}
[data-vibeui-block="sidebar-010"] [data-part="link"]{
flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
padding:0.4375rem 0.5rem;border-radius:var(--vibeui-sidebar-010-radius);
color:inherit;font-size:0.875rem;text-decoration:none;
}
[data-vibeui-block="sidebar-010"] [data-part="row"][data-active="true"]{
background:var(--vibeui-sidebar-010-active);
}
[data-vibeui-block="sidebar-010"] [data-part="row"][data-active="true"] [data-part="link"]{
font-weight:650;
}
/* Кнопка закрепления видна всегда: спрятанная за наведение, на телефоне она
   не существует вовсе. Приглушённый цвет держит её на втором плане. */
[data-vibeui-block="sidebar-010"] [data-part="pin"]{
appearance:none;border:0;cursor:pointer;flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;margin-inline-end:0.125rem;
border-radius:0.375rem;background:transparent;
color:var(--vibeui-sidebar-010-muted);
transition:color .16s ease,background-color .16s ease;
}
[data-vibeui-block="sidebar-010"] [data-part="pin"]:hover{
background:var(--vibeui-sidebar-010-hover);color:var(--vibeui-sidebar-010-fg);
}
[data-vibeui-block="sidebar-010"] [data-part="pin"][data-on="true"]{color:var(--vibeui-sidebar-010-pin)}
[data-vibeui-block="sidebar-010"] [data-part="pin"]:focus-visible,
[data-vibeui-block="sidebar-010"] [data-part="link"]:focus-visible{
outline:2px solid var(--vibeui-sidebar-010-accent);outline-offset:2px;
}
[data-vibeui-block="sidebar-010"] svg{width:0.9375rem;height:0.9375rem;flex:none}
[data-vibeui-block="sidebar-010"] [data-part="empty"]{
margin:0;padding:0.375rem 0.5rem;border-radius:var(--vibeui-sidebar-010-radius);
border:1px dashed var(--vibeui-sidebar-010-border);
font-size:0.75rem;line-height:1.4;color:var(--vibeui-sidebar-010-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sidebar-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Sidebar010Item[] = [
  { id: "inbox", label: "Входящие", pinned: true },
  { id: "today", label: "Сегодня", pinned: true },
  { id: "projects", label: "Проекты" },
  { id: "reports", label: "Отчёты" },
  { id: "invoices", label: "Счета" },
  { id: "team", label: "Команда" },
  { id: "settings", label: "Настройки" },
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
 * Меню с закреплёнными разделами наверху: частое отделено от редкого.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sidebar010({
  items = DEFAULT_ITEMS,
  activeId = "today",
  pinnedLabel = "Закреплённые",
  restLabel = "Все разделы",
  pinTemplate = "Закрепить: {label}",
  unpinTemplate = "Открепить: {label}",
  emptyText = "Закрепите раздел кнопкой справа — он поднимется сюда.",
  accent,
  background = "",
  className,
  style,
  ...props
}: Sidebar010Props) {
  const [pinned, setPinned] = useState<string[]>(
    items.filter((item) => item.pinned).map((item) => item.id),
  )

  const toggle = (id: string) =>
    setPinned((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    )

  const palette = {
    ...(accent ? { "--vibeui-sidebar-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-sidebar-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  // Порядок внутри групп — исходный: закрепление меняет группу, но не
  // перетасовывает список, иначе пункт «убегает» из-под курсора.
  const top = items.filter((item) => pinned.includes(item.id))
  const rest = items.filter((item) => !pinned.includes(item.id))

  const row = (item: Sidebar010Item, isPinned: boolean) => (
    <li
      key={item.id}
      data-part="row"
      data-active={item.id === activeId || undefined}
    >
      <a data-part="link" href="#" aria-current={item.id === activeId ? "page" : undefined}>
        {item.label}
      </a>
      <button
        type="button"
        data-part="pin"
        data-on={isPinned}
        aria-pressed={isPinned}
        aria-label={(isPinned ? unpinTemplate : pinTemplate).replace(
          "{label}",
          item.label,
        )}
        onClick={() => toggle(item.id)}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M6 1.5h4l-.6 3.2 2.1 2.1H4.5l2.1-2.1L6 1.5ZM8 6.8v7.7"
            fill={isPinned ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </li>
  )

  return (
    <>
      <style href="vibeui-sidebar-010" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="sidebar"
        data-vibeui-block="sidebar-010"
        aria-label={restLabel}
        className={className}
        style={palette}
      >
        <div>
          <span data-part="caption">{pinnedLabel}</span>
          {top.length > 0 ? (
            <ul>{top.map((item) => row(item, true))}</ul>
          ) : (
            // Пустая группа объясняет себя: иначе непонятно, откуда берутся
            // закреплённые и почему место пустует.
            <p data-part="empty">{emptyText}</p>
          )}
        </div>

        <div>
          <span data-part="caption">{restLabel}</span>
          <ul>{rest.map((item) => row(item, false))}</ul>
        </div>
      </nav>
    </>
  )
}

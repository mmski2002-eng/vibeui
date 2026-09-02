"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Ai015Thread = {
  id: string
  title: string
  preview: string
  group: string
  time: string
  pinned?: boolean
  messages?: number
}

export type Ai015Props = {
  title?: string
  newLabel?: string
  searchPlaceholder?: string
  threads?: Ai015Thread[]
  activeId?: string
  emptyLabel?: string
  /** Отметка закреплённого диалога. */
  pinLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: боковая колонка с историей диалогов, в которой можно найти
// вчерашний разговор. Поиск идёт и по заголовку, и по первой реплике:
// название диалога обычно сгенерировано моделью, и человек помнит не его,
// а то, что спрашивал.
//
// Группы «Закреплённые», «Сегодня», «На неделе» — обычные <section> с
// заголовком, а не разделители-строки: скринридер объявляет группу, и по
// ней можно прыгать заголовками. Активная запись помечена aria-current,
// а не только цветом полосы.
const STYLES = `
:where([data-vibeui-block="ai-015"]){
--vibeui-ai-015-bg:transparent;
--vibeui-ai-015-card:light-dark(oklch(0.965 0.004 265),oklch(0.28 0.012 265));
--vibeui-ai-015-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-ai-015-muted:light-dark(oklch(0.53 0.014 265),oklch(0.7 0.012 265));
--vibeui-ai-015-border:light-dark(oklch(0.91 0.006 265),oklch(0.37 0.012 265));
--vibeui-ai-015-accent:light-dark(oklch(0.52 0.17 258),oklch(0.74 0.14 258));
--vibeui-ai-015-on-accent:light-dark(oklch(1 0 0),oklch(0.2 0.03 258));
--vibeui-ai-015-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="ai-015"]{
background:var(--vibeui-ai-015-bg);color:var(--vibeui-ai-015-fg);
font-family:var(--vibeui-ai-015-sans);
border:1px solid var(--vibeui-ai-015-border);border-radius:1.125rem;
}
[data-vibeui-block="ai-015"] *{box-sizing:border-box}
[data-vibeui-block="ai-015"] [data-part="shell"]{
display:grid;gap:0.75rem;padding:1rem;max-width:24rem;
}
[data-vibeui-block="ai-015"] [data-part="head"]{display:flex;align-items:center;gap:0.5rem}
[data-vibeui-block="ai-015"] h2{margin:0;font-size:0.875rem;font-weight:680}
[data-vibeui-block="ai-015"] [data-part="new"]{
appearance:none;cursor:pointer;margin-left:auto;border:0;
height:1.875rem;padding:0 0.75rem;border-radius:0.625rem;
background:var(--vibeui-ai-015-accent);color:var(--vibeui-ai-015-on-accent);
font:inherit;font-size:0.75rem;font-weight:640;
}
[data-vibeui-block="ai-015"] [data-part="search"]{position:relative;display:block}
[data-vibeui-block="ai-015"] input[type="search"]{
width:100%;height:2.125rem;padding:0 0.75rem 0 2rem;
border:1px solid var(--vibeui-ai-015-border);border-radius:0.6875rem;
background:var(--vibeui-ai-015-card);color:inherit;
font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="ai-015"] [data-part="lens"]{
position:absolute;left:0.6875rem;top:50%;width:0.625rem;height:0.625rem;
margin-top:-0.4375rem;border:1.5px solid var(--vibeui-ai-015-muted);border-radius:9999px;
}
[data-vibeui-block="ai-015"] [data-part="lens"]::after{
content:"";position:absolute;right:-0.25rem;bottom:-0.1875rem;
width:0.3125rem;height:1.5px;background:var(--vibeui-ai-015-muted);transform:rotate(45deg);
}
[data-vibeui-block="ai-015"] [data-part="groups"]{display:grid;gap:0.75rem;max-height:24rem;overflow-y:auto;overscroll-behavior:contain}
[data-vibeui-block="ai-015"] h3{
margin:0 0 0.375rem;font-size:0.625rem;font-weight:680;
letter-spacing:0.09em;text-transform:uppercase;color:var(--vibeui-ai-015-muted);
}
[data-vibeui-block="ai-015"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.25rem}
[data-vibeui-block="ai-015"] [data-part="thread"]{
appearance:none;cursor:pointer;width:100%;text-align:left;display:grid;gap:0.125rem;
padding:0.5rem 0.625rem;border-radius:0.6875rem;
border:1px solid transparent;background:none;color:inherit;font:inherit;
transition:background-color .14s ease,border-color .14s ease;
}
[data-vibeui-block="ai-015"] [data-part="thread"]:hover{background:var(--vibeui-ai-015-card)}
/* Активная запись помечена aria-current, а не только цветом. */
[data-vibeui-block="ai-015"] [aria-current="true"]{
background:var(--vibeui-ai-015-card);
border-color:color-mix(in oklab,var(--vibeui-ai-015-accent) 45%,var(--vibeui-ai-015-border));
}
[data-vibeui-block="ai-015"] [data-part="row"]{display:flex;align-items:baseline;gap:0.5rem}
[data-vibeui-block="ai-015"] [data-part="name"]{
font-size:0.8125rem;font-weight:620;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="ai-015"] [data-part="pin"]{
flex:none;font-size:0.5625rem;color:var(--vibeui-ai-015-accent);font-weight:700;
letter-spacing:0.06em;text-transform:uppercase;
}
[data-vibeui-block="ai-015"] [data-part="time"]{
margin-left:auto;flex:none;font-size:0.625rem;color:var(--vibeui-ai-015-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="ai-015"] [data-part="preview"]{
font-size:0.6875rem;line-height:1.45;color:var(--vibeui-ai-015-muted);
display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
}
[data-vibeui-block="ai-015"] [data-part="empty"]{
margin:0;padding:1.25rem 0.75rem;text-align:center;
font-size:0.8125rem;color:var(--vibeui-ai-015-muted);
}
[data-vibeui-block="ai-015"] :focus-visible{outline:2px solid var(--vibeui-ai-015-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="ai-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_THREADS: Ai015Thread[] = [
  {
    id: "t1",
    title: "Лендинг студии интерьеров",
    preview: "Собери одностраничник: hero, услуги, отзывы и форма заявки.",
    group: "Закреплённые",
    time: "Пн",
    pinned: true,
    messages: 24,
  },
  {
    id: "t2",
    title: "Страница тарифов",
    preview: "Три плана, годовая скидка переключателем, FAQ снизу.",
    group: "Сегодня",
    time: "11:20",
    messages: 8,
  },
  {
    id: "t3",
    title: "Тексты для блока преимуществ",
    preview: "Перепиши три пункта без прилагательных вроде «инновационный».",
    group: "Сегодня",
    time: "09:04",
    messages: 12,
  },
  {
    id: "t4",
    title: "Разбор дифа по формам",
    preview: "Объясни, что изменилось в валидации и что проверить руками.",
    group: "На неделе",
    time: "Ср",
    messages: 31,
  },
  {
    id: "t5",
    title: "Сводка по трафику",
    preview:
      "Три цифры, которые изменились сильнее всего, и объяснение каждой.",
    group: "На неделе",
    time: "Вт",
    messages: 6,
  },
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
 * Боковая колонка истории диалогов с поиском по заголовку и первой реплике.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Ai015({
  title = "История",
  newLabel = "Новый",
  searchPlaceholder = "Найти диалог",
  threads = DEFAULT_THREADS,
  activeId = "t2",
  emptyLabel = "Ничего не нашлось. Попробуйте слово из самого запроса.",
  pinLabel = "закреп",
  accent,
  background = "",
  className,
  style,
}: Ai015Props) {
  const [query, setQuery] = useState("")

  const palette = {
    ...(accent ? { "--vibeui-ai-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-ai-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const needle = query.trim().toLowerCase()
  const found = threads.filter((thread) =>
    needle === ""
      ? true
      : `${thread.title} ${thread.preview}`.toLowerCase().includes(needle),
  )
  const groups = found.reduce<Record<string, Ai015Thread[]>>((map, thread) => {
    map[thread.group] = [...(map[thread.group] ?? []), thread]
    return map
  }, {})

  return (
    <>
      <style href="vibeui-ai-015" precedence="medium">
        {STYLES}
      </style>
      <nav
        data-vibeui-block="ai-015"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <button type="button" data-part="new">
              {newLabel}
            </button>
          </div>

          <label data-part="search">
            <span data-part="lens" aria-hidden="true" />
            <input
              type="search"
              value={query}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <div data-part="groups">
            {found.length === 0 ? (
              <p data-part="empty">{emptyLabel}</p>
            ) : (
              Object.entries(groups).map(([group, items]) => (
                <section key={group}>
                  <h3>{group}</h3>
                  <ul>
                    {items.map((thread) => (
                      <li key={thread.id}>
                        <button
                          type="button"
                          data-part="thread"
                          aria-current={thread.id === activeId}
                        >
                          <span data-part="row">
                            {thread.pinned ? (
                              <span data-part="pin">{pinLabel}</span>
                            ) : null}
                            <span data-part="name">{thread.title}</span>
                            <span data-part="time">{thread.time}</span>
                          </span>
                          <span data-part="preview">{thread.preview}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))
            )}
          </div>
        </div>
      </nav>
    </>
  )
}

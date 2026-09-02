"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties, DragEvent } from "react"

export type Kanban005Card = {
  id: string
  title: string
  assignee: string
  column: string
}

export type Kanban005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  columns?: string[]
  cards?: Kanban005Card[]
  everyone?: string
  onChange?: (cards: Kanban005Card[]) => void
  /** Подписи и объявления: шаблоны с {name}, {title}, {count}, {total}. */
  text?: Record<string, string>
  /** Пусто — подложки нет, доска лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: доска с фильтром по исполнителю. Фильтр обязан говорить о
// себе: счётчик колонки показывает «2 из 5», то есть сколько карточек видно и
// сколько их всего, — иначе после фильтрации цифры выглядят как пропажа задач.
// Пустая после фильтра колонка не схлопывается, а объясняет словами, что
// скрыто. Смена фильтра и перенос объявляются в одной живой области. Перенос
// мышью — нативный drag, с клавиатуры — стрелочные кнопки на карточке.
//
// Тема берётся из color-scheme окружения через light-dark(): доска темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="kanban-005"]){
--vibeui-kanban-005-bg:transparent;
--vibeui-kanban-005-card:light-dark(oklch(1 0 0),oklch(0.27 0.012 265));
--vibeui-kanban-005-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-kanban-005-muted:light-dark(oklch(0.56 0.014 265),oklch(0.71 0.012 265));
--vibeui-kanban-005-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-kanban-005-accent:light-dark(oklch(0.55 0.2 262),oklch(0.75 0.15 262));
--vibeui-kanban-005-shadow:light-dark(oklch(0.2 0.02 265 / 6%),oklch(0 0 0 / 32%));
--vibeui-kanban-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="kanban-005"]{
position:relative;display:grid;gap:0.625rem;
width:100%;box-sizing:border-box;padding:0.75rem;
background:var(--vibeui-kanban-005-bg);
border:1px solid var(--vibeui-kanban-005-border);border-radius:0.875rem;
font-family:var(--vibeui-kanban-005-font);color:var(--vibeui-kanban-005-fg);
}
[data-vibeui-block="kanban-005"] *{box-sizing:border-box}
[data-vibeui-block="kanban-005"] [data-part="filters"]{
display:flex;flex-wrap:wrap;gap:0.3125rem;
}
[data-vibeui-block="kanban-005"] [data-part="chip"]{
appearance:none;cursor:pointer;
padding:0.1875rem 0.625rem;border-radius:999px;
border:1px solid var(--vibeui-kanban-005-border);background:var(--vibeui-kanban-005-card);
color:var(--vibeui-kanban-005-muted);font:inherit;font-size:0.6875rem;font-weight:650;line-height:1.5;
transition:background-color .15s ease,color .15s ease,border-color .15s ease;
}
/* Выбранный фильтр отличается заливкой и рамкой, а не одним оттенком текста. */
[data-vibeui-block="kanban-005"] [data-part="chip"][aria-pressed="true"]{
background:color-mix(in oklab,var(--vibeui-kanban-005-accent) 12%,transparent);
border-color:color-mix(in oklab,var(--vibeui-kanban-005-accent) 50%,transparent);
color:color-mix(in oklab,var(--vibeui-kanban-005-accent) 80%,light-dark(black,white));
}
[data-vibeui-block="kanban-005"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-kanban-005-accent);outline-offset:2px}
[data-vibeui-block="kanban-005"] [data-part="board"]{
display:grid;grid-auto-flow:column;grid-auto-columns:minmax(11rem,1fr);gap:0.625rem;
overflow-x:auto;
}
[data-vibeui-block="kanban-005"] [data-part="column"]{
display:flex;flex-direction:column;gap:0.5rem;min-width:0;
padding:0.5rem;border-radius:0.75rem;border:1px dashed transparent;
}
[data-vibeui-block="kanban-005"] [data-part="column"][data-over="true"]{
border-color:var(--vibeui-kanban-005-accent);
background:color-mix(in oklab,var(--vibeui-kanban-005-accent) 6%,transparent);
}
[data-vibeui-block="kanban-005"] [data-part="head"]{
margin:0;display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
font-size:0.75rem;font-weight:650;
}
/* «2 из 5» вместо «2»: иначе отфильтрованные задачи выглядят потерянными. */
[data-vibeui-block="kanban-005"] [data-part="count"]{
color:var(--vibeui-kanban-005-muted);font-size:0.6875rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="kanban-005"] ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.375rem}
[data-vibeui-block="kanban-005"] [data-part="empty"]{
margin:0;padding:0.5rem;border-radius:0.5rem;
border:1px dashed var(--vibeui-kanban-005-border);
color:var(--vibeui-kanban-005-muted);font-size:0.6875rem;line-height:1.35;
}
[data-vibeui-block="kanban-005"] [data-part="card"]{
display:grid;gap:0.375rem;padding:0.5rem;border-radius:0.625rem;cursor:grab;
background:var(--vibeui-kanban-005-card);
border:1px solid var(--vibeui-kanban-005-border);
box-shadow:0 1px 2px var(--vibeui-kanban-005-shadow);
font-size:0.75rem;line-height:1.35;
}
[data-vibeui-block="kanban-005"] [data-part="card"][data-dragging="true"]{opacity:.45}
[data-vibeui-block="kanban-005"] [data-part="who"]{color:var(--vibeui-kanban-005-muted);font-size:0.625rem}
[data-vibeui-block="kanban-005"] [data-part="nav"]{display:flex;gap:0.25rem;justify-content:flex-end}
[data-vibeui-block="kanban-005"] [data-part="nav"] button{
appearance:none;cursor:pointer;width:1.5rem;height:1.5rem;border-radius:0.375rem;
border:1px solid var(--vibeui-kanban-005-border);background:var(--vibeui-kanban-005-card);
color:var(--vibeui-kanban-005-muted);font:inherit;font-size:0.6875rem;line-height:1;
}
[data-vibeui-block="kanban-005"] [data-part="nav"] button:hover:not(:disabled){color:var(--vibeui-kanban-005-fg)}
[data-vibeui-block="kanban-005"] [data-part="nav"] button:disabled{opacity:.35;cursor:default}
[data-vibeui-block="kanban-005"] [data-part="nav"] button:focus-visible{outline:2px solid var(--vibeui-kanban-005-accent);outline-offset:1px}
[data-vibeui-block="kanban-005"] [data-part="live"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="kanban-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS = ["Очередь", "В работе", "Готово"]

const DEFAULT_CARDS: Kanban005Card[] = [
  { id: "1", title: "Фасетный фильтр", assignee: "Ирина", column: "Очередь" },
  { id: "2", title: "Импорт остатков", assignee: "Пётр", column: "Очередь" },
  { id: "3", title: "Карточка товара", assignee: "Ирина", column: "В работе" },
  { id: "4", title: "Логи доставки", assignee: "Мария", column: "В работе" },
  { id: "5", title: "Письма о заказе", assignee: "Пётр", column: "Готово" },
]

const DEFAULT_TEXT: Record<string, string> = {
  filters: "Фильтр по исполнителю",
  cleared: "Фильтр снят, показаны все {total} задач.",
  filtered: "Фильтр «{name}»: показано {count} из {total} задач.",
  moved: "«{title}» перенесена в «{name}».",
  column: "{name}: показано {count} из {total}",
  count: "{count} из {total}",
  empty: "Пусто",
  hidden: "Скрыто фильтром: {total}",
  previous: "Перенести «{title}» в предыдущую колонку",
  next: "Перенести «{title}» в следующую колонку",
}

/** Подстановка значений в шаблон подписи. */
function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in values ? String(values[key]) : whole,
  )
}

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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
 * Доска с фильтром по исполнителю: счётчик колонки показывает видимое и всего.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Kanban005({
  columns = DEFAULT_COLUMNS,
  cards = DEFAULT_CARDS,
  everyone = "Все",
  onChange,
  text,
  background = "",
  accent,
  className,
  style,
  ...props
}: Kanban005Props) {
  const labels = { ...DEFAULT_TEXT, ...text }
  const [board, setBoard] = useState(cards)
  const [filter, setFilter] = useState(everyone)
  const [dragged, setDragged] = useState<string | null>(null)
  const [over, setOver] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState("")

  const people = [everyone, ...new Set(cards.map((card) => card.assignee))]
  const visible = (card: Kanban005Card) =>
    filter === everyone || card.assignee === filter

  const pick = (person: string) => {
    setFilter(person)
    const shown = board.filter(
      (card) => person === everyone || card.assignee === person,
    ).length
    setAnnouncement(
      fill(person === everyone ? labels.cleared : labels.filtered, {
        name: person,
        count: shown,
        total: board.length,
      }),
    )
  }

  const put = (id: string, column: string) => {
    const card = board.find((row) => row.id === id)
    if (!card || card.column === column) return

    const next = board.map((row) => (row.id === id ? { ...row, column } : row))
    setBoard(next)
    onChange?.(next)
    setAnnouncement(fill(labels.moved, { title: card.title, name: column }))
  }

  const shift = (id: string, step: -1 | 1) => {
    const card = board.find((row) => row.id === id)
    if (!card) return

    const target = columns[columns.indexOf(card.column) + step]
    if (target) put(id, target)
  }

  const drop = (event: DragEvent<HTMLElement>, column: string) => {
    event.preventDefault()
    setOver(null)
    if (dragged) put(dragged, column)
    setDragged(null)
  }

  const palette = {
    ...(accent ? { "--vibeui-kanban-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-kanban-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-kanban-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="kanban-005"
        className={className}
        style={palette}
      >
        <div data-part="filters" role="group" aria-label={labels.filters}>
          {people.map((person) => (
            <button
              key={person}
              type="button"
              data-part="chip"
              aria-pressed={person === filter}
              onClick={() => pick(person)}
            >
              {person}
            </button>
          ))}
        </div>
        <div data-part="board">
          {columns.map((column, columnIndex) => {
            const all = board.filter((card) => card.column === column)
            const rows = all.filter(visible)

            return (
              <section
                key={column}
                data-part="column"
                data-over={column === over}
                aria-label={fill(labels.column, {
                  name: column,
                  count: rows.length,
                  total: all.length,
                })}
                onDragOver={(event) => {
                  event.preventDefault()
                  setOver(column)
                }}
                onDragLeave={() => setOver(null)}
                onDrop={(event) => drop(event, column)}
              >
                <p data-part="head">
                  {column}
                  <span data-part="count">
                    {fill(labels.count, {
                      count: rows.length,
                      total: all.length,
                    })}
                  </span>
                </p>
                {rows.length === 0 ? (
                  <p data-part="empty">
                    {all.length === 0
                      ? labels.empty
                      : fill(labels.hidden, { total: all.length })}
                  </p>
                ) : (
                  <ul>
                    {rows.map((card) => (
                      <li key={card.id}>
                        <article
                          data-part="card"
                          data-dragging={card.id === dragged}
                          draggable
                          onDragStart={() => setDragged(card.id)}
                          onDragEnd={() => {
                            setDragged(null)
                            setOver(null)
                          }}
                        >
                          {card.title}
                          <span data-part="who">{card.assignee}</span>
                          <span data-part="nav">
                            <button
                              type="button"
                              disabled={columnIndex === 0}
                              aria-label={fill(labels.previous, {
                                title: card.title,
                              })}
                              onClick={() => shift(card.id, -1)}
                            >
                              ←
                            </button>
                            <button
                              type="button"
                              disabled={columnIndex === columns.length - 1}
                              aria-label={fill(labels.next, {
                                title: card.title,
                              })}
                              onClick={() => shift(card.id, 1)}
                            >
                              →
                            </button>
                          </span>
                        </article>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )
          })}
        </div>
        <span data-part="live" role="status" aria-live="polite">
          {announcement}
        </span>
      </div>
    </>
  )
}

"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties, DragEvent } from "react"

export type Kanban001Card = {
  id: string
  title: string
  tag?: string
  column: string
}

export type Kanban001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  columns?: string[]
  cards?: Kanban001Card[]
  onChange?: (cards: Kanban001Card[]) => void
  accent?: string
}

// Идея компонента: доска задач по колонкам. Перенос — нативный drag and drop,
// без библиотеки. Второй путь обязателен: у карточки есть список выбора
// колонки, потому что перетаскивание недоступно с клавиатуры и тяжело даётся
// на телефоне. Счётчик в шапке колонки считается из карточек, а не хранится
// отдельно, — иначе после переноса цифра начинает врать.
const STYLES = `
:where([data-vibeui-block="kanban-001"]){
--vibeui-kanban-001-bg:oklch(0.985 0.002 265);
--vibeui-kanban-001-card:oklch(1 0 0);
--vibeui-kanban-001-fg:oklch(0.24 0.014 265);
--vibeui-kanban-001-muted:oklch(0.56 0.014 265);
--vibeui-kanban-001-border:oklch(0.91 0.006 265);
--vibeui-kanban-001-accent:oklch(0.55 0.2 262);
--vibeui-kanban-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="kanban-001"]{
display:grid;grid-auto-flow:column;grid-auto-columns:minmax(11rem,1fr);gap:0.625rem;
width:100%;box-sizing:border-box;padding:0.75rem;overflow-x:auto;
background:var(--vibeui-kanban-001-bg);
border:1px solid var(--vibeui-kanban-001-border);border-radius:0.875rem;
font-family:var(--vibeui-kanban-001-font);color:var(--vibeui-kanban-001-fg);
}
[data-vibeui-block="kanban-001"] *{box-sizing:border-box}
[data-vibeui-block="kanban-001"] [data-part="column"]{
display:flex;flex-direction:column;gap:0.5rem;
padding:0.5rem;border-radius:0.75rem;
border:1px dashed transparent;
}
/* Цель переноса подсвечивается рамкой: заливка спорит с карточками внутри. */
[data-vibeui-block="kanban-001"] [data-part="column"][data-over="true"]{
border-color:var(--vibeui-kanban-001-accent);
background:oklch(0.55 0.2 262 / 5%);
}
[data-vibeui-block="kanban-001"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
font-size:0.75rem;font-weight:650;
}
/* Счётчик считается из карточек: отдельное число начинает врать после переноса. */
[data-vibeui-block="kanban-001"] [data-part="count"]{
color:var(--vibeui-kanban-001-muted);font-weight:600;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="kanban-001"] ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.375rem}
[data-vibeui-block="kanban-001"] [data-part="card"]{
display:flex;flex-direction:column;gap:0.375rem;
padding:0.5rem;border-radius:0.625rem;cursor:grab;
background:var(--vibeui-kanban-001-card);
border:1px solid var(--vibeui-kanban-001-border);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 6%);
font-size:0.75rem;line-height:1.35;
}
[data-vibeui-block="kanban-001"] [data-part="card"][data-dragging="true"]{opacity:.45}
[data-vibeui-block="kanban-001"] [data-part="tag"]{
align-self:flex-start;padding:0 0.375rem;border-radius:0.375rem;
background:oklch(0.55 0.2 262 / 10%);color:var(--vibeui-kanban-001-accent);
font-size:0.625rem;font-weight:650;
}
/* Второй путь переноса: drag недоступен с клавиатуры и труден на телефоне. */
[data-vibeui-block="kanban-001"] select{
width:100%;height:1.625rem;padding:0 0.25rem;
border:1px solid var(--vibeui-kanban-001-border);border-radius:0.375rem;
background:var(--vibeui-kanban-001-card);color:var(--vibeui-kanban-001-muted);
font:inherit;font-size:0.625rem;
}
[data-vibeui-block="kanban-001"] select:focus-visible{outline:2px solid var(--vibeui-kanban-001-accent);outline-offset:1px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="kanban-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS = ["Очередь", "В работе", "Готово"]

const DEFAULT_CARDS: Kanban001Card[] = [
  { id: "1", title: "Вторая волна таблиц", tag: "каталог", column: "Очередь" },
  { id: "2", title: "Блоки витрины товара", tag: "каталог", column: "Очередь" },
  { id: "3", title: "Панель фильтров", tag: "блоки", column: "В работе" },
  { id: "4", title: "Недельное расписание", tag: "блоки", column: "Готово" },
]

/**
 * Доска задач: нативный drag и выбор колонки списком для клавиатуры.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Kanban001({
  columns = DEFAULT_COLUMNS,
  cards = DEFAULT_CARDS,
  onChange,
  accent,
  className,
  style,
  ...props
}: Kanban001Props) {
  const [board, setBoard] = useState(cards)
  const [dragged, setDragged] = useState<string | null>(null)
  const [over, setOver] = useState<string | null>(null)

  const put = (id: string, column: string) => {
    const next = board.map((card) =>
      card.id === id ? { ...card, column } : card,
    )
    setBoard(next)
    onChange?.(next)
  }

  const drop = (event: DragEvent<HTMLElement>, column: string) => {
    event.preventDefault()
    setOver(null)
    if (dragged) put(dragged, column)
    setDragged(null)
  }

  const palette = {
    ...(accent ? { "--vibeui-kanban-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-kanban-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="kanban-001"
        className={className}
        style={palette}
      >
        {columns.map((column) => {
          const rows = board.filter((card) => card.column === column)
          return (
            <section
              key={column}
              data-part="column"
              data-over={column === over}
              aria-label={`${column}: ${rows.length}`}
              onDragOver={(event) => {
                event.preventDefault()
                setOver(column)
              }}
              onDragLeave={() => setOver(null)}
              onDrop={(event) => drop(event, column)}
            >
              <p data-part="head">
                {column}
                <span data-part="count">{rows.length}</span>
              </p>
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
                      {card.tag ? (
                        <span data-part="tag">{card.tag}</span>
                      ) : null}
                      {card.title}
                      <select
                        value={card.column}
                        aria-label={`Колонка задачи «${card.title}»`}
                        onChange={(event) => put(card.id, event.target.value)}
                      >
                        {columns.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </article>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </>
  )
}

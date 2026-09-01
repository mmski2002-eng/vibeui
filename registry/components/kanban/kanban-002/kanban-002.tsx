"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties, DragEvent } from "react"

export type Kanban002Column = {
  name: string
  limit: number
}

export type Kanban002Card = {
  id: string
  title: string
  column: string
}

export type Kanban002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  columns?: Kanban002Column[]
  cards?: Kanban002Card[]
  onChange?: (cards: Kanban002Card[]) => void
  accent?: string
}

// Идея компонента: доска с лимитом карточек в колонке. Лимит бесполезен, если о
// нём узнают только постфактум, поэтому колонка показывает «3 / 4» до переноса,
// переполненная подсвечивается предупреждением, а отказ произносится вслух в
// живой области: молча отменённый перенос выглядит как поломка. Перенос мышью
// сделан нативным drag and drop, а кнопки «влево» и «вправо» дают тот же
// результат с клавиатуры — drag с неё недоступен в принципе.
const STYLES = `
:where([data-vibeui-block="kanban-002"]){
--vibeui-kanban-002-bg:oklch(0.985 0.002 265);
--vibeui-kanban-002-card:oklch(1 0 0);
--vibeui-kanban-002-fg:oklch(0.24 0.014 265);
--vibeui-kanban-002-muted:oklch(0.56 0.014 265);
--vibeui-kanban-002-border:oklch(0.91 0.006 265);
--vibeui-kanban-002-accent:oklch(0.55 0.2 262);
--vibeui-kanban-002-warn:oklch(0.62 0.17 40);
--vibeui-kanban-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="kanban-002"]{
position:relative;display:grid;grid-auto-flow:column;grid-auto-columns:minmax(11rem,1fr);gap:0.625rem;
width:100%;box-sizing:border-box;padding:0.75rem;overflow-x:auto;
background:var(--vibeui-kanban-002-bg);
border:1px solid var(--vibeui-kanban-002-border);border-radius:0.875rem;
font-family:var(--vibeui-kanban-002-font);color:var(--vibeui-kanban-002-fg);
}
[data-vibeui-block="kanban-002"] *{box-sizing:border-box}
[data-vibeui-block="kanban-002"] [data-part="column"]{
display:flex;flex-direction:column;gap:0.5rem;min-width:0;
padding:0.5rem;border-radius:0.75rem;border:1px dashed transparent;
}
[data-vibeui-block="kanban-002"] [data-part="column"][data-over="true"]{
border-color:var(--vibeui-kanban-002-accent);
background:color-mix(in oklab,var(--vibeui-kanban-002-accent) 6%,transparent);
}
/* Переполнение видно до переноса, а не после него. */
[data-vibeui-block="kanban-002"] [data-part="column"][data-full="true"]{
border-color:var(--vibeui-kanban-002-warn);
background:color-mix(in oklab,var(--vibeui-kanban-002-warn) 7%,transparent);
}
[data-vibeui-block="kanban-002"] [data-part="head"]{
margin:0;display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="kanban-002"] [data-part="count"]{
color:var(--vibeui-kanban-002-muted);font-weight:650;font-variant-numeric:tabular-nums;font-size:0.6875rem;
}
[data-vibeui-block="kanban-002"] [data-part="column"][data-full="true"] [data-part="count"]{color:var(--vibeui-kanban-002-warn)}
/* Полоса заполнения — второй, нецветовой признак близости к лимиту. */
[data-vibeui-block="kanban-002"] [data-part="gauge"]{
height:3px;border-radius:999px;overflow:hidden;
background:color-mix(in oklab,var(--vibeui-kanban-002-muted) 22%,transparent);
}
[data-vibeui-block="kanban-002"] [data-part="gauge"] span{
display:block;height:100%;background:var(--vibeui-kanban-002-accent);
}
[data-vibeui-block="kanban-002"] [data-part="column"][data-full="true"] [data-part="gauge"] span{background:var(--vibeui-kanban-002-warn)}
[data-vibeui-block="kanban-002"] ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.375rem}
[data-vibeui-block="kanban-002"] [data-part="card"]{
display:grid;gap:0.375rem;padding:0.5rem;border-radius:0.625rem;cursor:grab;
background:var(--vibeui-kanban-002-card);
border:1px solid var(--vibeui-kanban-002-border);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 6%);
font-size:0.75rem;line-height:1.35;
}
[data-vibeui-block="kanban-002"] [data-part="card"][data-dragging="true"]{opacity:.45}
[data-vibeui-block="kanban-002"] [data-part="nav"]{display:flex;gap:0.25rem;justify-content:flex-end}
/* Кнопки — единственный путь переноса с клавиатуры, а не дубль ради красоты. */
[data-vibeui-block="kanban-002"] [data-part="nav"] button{
appearance:none;cursor:pointer;width:1.5rem;height:1.5rem;border-radius:0.375rem;
border:1px solid var(--vibeui-kanban-002-border);background:var(--vibeui-kanban-002-card);
color:var(--vibeui-kanban-002-muted);font:inherit;font-size:0.6875rem;line-height:1;
}
[data-vibeui-block="kanban-002"] [data-part="nav"] button:hover:not(:disabled){color:var(--vibeui-kanban-002-fg)}
[data-vibeui-block="kanban-002"] [data-part="nav"] button:disabled{opacity:.35;cursor:default}
[data-vibeui-block="kanban-002"] [data-part="nav"] button:focus-visible{outline:2px solid var(--vibeui-kanban-002-accent);outline-offset:1px}
[data-vibeui-block="kanban-002"] [data-part="live"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="kanban-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS: Kanban002Column[] = [
  { name: "Очередь", limit: 6 },
  { name: "В работе", limit: 2 },
  { name: "Проверка", limit: 3 },
]

const DEFAULT_CARDS: Kanban002Card[] = [
  { id: "1", title: "Перенести каталог на новый роутинг", column: "Очередь" },
  { id: "2", title: "Пагинация в поиске", column: "Очередь" },
  { id: "3", title: "Экспорт в CSV", column: "В работе" },
  { id: "4", title: "Разбор ошибок оплаты", column: "В работе" },
  { id: "5", title: "Тексты писем", column: "Проверка" },
]

/**
 * Доска с лимитом карточек в колонке: перенос сверх лимита отклоняется вслух.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Kanban002({
  columns = DEFAULT_COLUMNS,
  cards = DEFAULT_CARDS,
  onChange,
  accent,
  className,
  style,
  ...props
}: Kanban002Props) {
  const [board, setBoard] = useState(cards)
  const [dragged, setDragged] = useState<string | null>(null)
  const [over, setOver] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState("")

  const put = (id: string, name: string) => {
    const card = board.find((row) => row.id === id)
    const column = columns.find((entry) => entry.name === name)

    if (!card || !column || card.column === name) return

    const taken = board.filter((row) => row.column === name).length

    if (taken >= column.limit) {
      setAnnouncement(
        `«${card.title}» не перенесена: в колонке «${name}» уже ${taken} из ${column.limit}.`,
      )
      return
    }

    const next = board.map((row) =>
      row.id === id ? { ...row, column: name } : row,
    )

    setBoard(next)
    onChange?.(next)
    setAnnouncement(
      `«${card.title}» перенесена в «${name}», теперь ${taken + 1} из ${column.limit}.`,
    )
  }

  const shift = (id: string, step: -1 | 1) => {
    const card = board.find((row) => row.id === id)
    if (!card) return

    const index = columns.findIndex((entry) => entry.name === card.column)
    const target = columns[index + step]
    if (target) put(id, target.name)
  }

  const drop = (event: DragEvent<HTMLElement>, name: string) => {
    event.preventDefault()
    setOver(null)
    if (dragged) put(dragged, name)
    setDragged(null)
  }

  const palette = {
    ...(accent ? { "--vibeui-kanban-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-kanban-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="kanban-002"
        className={className}
        style={palette}
      >
        {columns.map((column, columnIndex) => {
          const rows = board.filter((card) => card.column === column.name)
          const full = rows.length >= column.limit
          const fill = Math.min(100, (rows.length / column.limit) * 100)

          return (
            <section
              key={column.name}
              data-part="column"
              data-over={column.name === over}
              data-full={full}
              aria-label={`${column.name}: ${rows.length} из ${column.limit}`}
              onDragOver={(event) => {
                event.preventDefault()
                setOver(column.name)
              }}
              onDragLeave={() => setOver(null)}
              onDrop={(event) => drop(event, column.name)}
            >
              <p data-part="head">
                {column.name}
                <span data-part="count">
                  {rows.length} / {column.limit}
                </span>
              </p>
              <div data-part="gauge" aria-hidden="true">
                <span style={{ width: `${fill}%` }} />
              </div>
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
                      <span data-part="nav">
                        <button
                          type="button"
                          disabled={columnIndex === 0}
                          aria-label={`Перенести «${card.title}» в предыдущую колонку`}
                          onClick={() => shift(card.id, -1)}
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          disabled={columnIndex === columns.length - 1}
                          aria-label={`Перенести «${card.title}» в следующую колонку`}
                          onClick={() => shift(card.id, 1)}
                        >
                          →
                        </button>
                      </span>
                    </article>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
        <span data-part="live" role="status" aria-live="polite">
          {announcement}
        </span>
      </div>
    </>
  )
}

"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties, DragEvent } from "react"

export type Kanban004Card = {
  id: string
  title: string
  column: string
}

export type Kanban004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  columns?: string[]
  cards?: Kanban004Card[]
  collapsed?: string[]
  onChange?: (cards: Kanban004Card[]) => void
  accent?: string
}

// Идея компонента: доска, где ненужную сейчас колонку сворачивают в узкую
// полосу. Свёрнутая колонка не исчезает: её имя стоит вертикально, счётчик
// остаётся на виду, а карточки внутри скрыты hidden — так они выпадают и из
// последовательности фокуса, иначе табом можно уехать в невидимое. Перенос в
// свёрнутую колонку не отклоняется, а разворачивает её: спрятанная цель, куда
// нельзя попасть, — это не свёртка, а ловушка. Стрелочные кнопки на карточке
// дают тот же перенос с клавиатуры, результат объявляется вслух.
const STYLES = `
:where([data-vibeui-block="kanban-004"]){
--vibeui-kanban-004-bg:oklch(0.985 0.002 265);
--vibeui-kanban-004-card:oklch(1 0 0);
--vibeui-kanban-004-fg:oklch(0.24 0.014 265);
--vibeui-kanban-004-muted:oklch(0.56 0.014 265);
--vibeui-kanban-004-border:oklch(0.91 0.006 265);
--vibeui-kanban-004-accent:oklch(0.55 0.2 262);
--vibeui-kanban-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="kanban-004"]{
position:relative;display:flex;align-items:flex-start;gap:0.625rem;
width:100%;box-sizing:border-box;padding:0.75rem;overflow-x:auto;
background:var(--vibeui-kanban-004-bg);
border:1px solid var(--vibeui-kanban-004-border);border-radius:0.875rem;
font-family:var(--vibeui-kanban-004-font);color:var(--vibeui-kanban-004-fg);
}
[data-vibeui-block="kanban-004"] *{box-sizing:border-box}
[data-vibeui-block="kanban-004"] [data-part="column"]{
flex:1 1 10rem;min-width:0;display:flex;flex-direction:column;gap:0.5rem;
padding:0.5rem;border-radius:0.75rem;border:1px dashed transparent;
transition:flex-basis .18s ease;
}
/* Свёрнутая колонка становится полосой, но остаётся целью переноса. */
[data-vibeui-block="kanban-004"] [data-part="column"][data-collapsed="true"]{
flex:0 0 2.25rem;align-items:center;
background:color-mix(in oklab,var(--vibeui-kanban-004-muted) 8%,transparent);
}
[data-vibeui-block="kanban-004"] [data-part="column"][data-over="true"]{
border-color:var(--vibeui-kanban-004-accent);
background:color-mix(in oklab,var(--vibeui-kanban-004-accent) 6%,transparent);
}
[data-vibeui-block="kanban-004"] [data-part="toggle"]{
appearance:none;cursor:pointer;border:0;background:none;padding:0;
display:flex;align-items:center;gap:0.375rem;
color:inherit;font:inherit;font-size:0.75rem;font-weight:650;text-align:left;
}
[data-vibeui-block="kanban-004"] [data-part="toggle"]:focus-visible{outline:2px solid var(--vibeui-kanban-004-accent);outline-offset:2px;border-radius:0.375rem}
[data-vibeui-block="kanban-004"] [data-part="column"][data-collapsed="true"] [data-part="toggle"]{
flex-direction:column-reverse;writing-mode:vertical-rl;padding:0.25rem 0;
}
[data-vibeui-block="kanban-004"] [data-part="count"]{
color:var(--vibeui-kanban-004-muted);font-weight:650;font-size:0.6875rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="kanban-004"] [data-part="caret"]{color:var(--vibeui-kanban-004-muted);font-size:0.625rem}
[data-vibeui-block="kanban-004"] ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.375rem}
[data-vibeui-block="kanban-004"] [data-part="card"]{
display:grid;gap:0.375rem;padding:0.5rem;border-radius:0.625rem;cursor:grab;
background:var(--vibeui-kanban-004-card);
border:1px solid var(--vibeui-kanban-004-border);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 6%);
font-size:0.75rem;line-height:1.35;
}
[data-vibeui-block="kanban-004"] [data-part="card"][data-dragging="true"]{opacity:.45}
[data-vibeui-block="kanban-004"] [data-part="nav"]{display:flex;gap:0.25rem;justify-content:flex-end}
[data-vibeui-block="kanban-004"] [data-part="nav"] button{
appearance:none;cursor:pointer;width:1.5rem;height:1.5rem;border-radius:0.375rem;
border:1px solid var(--vibeui-kanban-004-border);background:var(--vibeui-kanban-004-card);
color:var(--vibeui-kanban-004-muted);font:inherit;font-size:0.6875rem;line-height:1;
}
[data-vibeui-block="kanban-004"] [data-part="nav"] button:hover:not(:disabled){color:var(--vibeui-kanban-004-fg)}
[data-vibeui-block="kanban-004"] [data-part="nav"] button:disabled{opacity:.35;cursor:default}
[data-vibeui-block="kanban-004"] [data-part="nav"] button:focus-visible{outline:2px solid var(--vibeui-kanban-004-accent);outline-offset:1px}
[data-vibeui-block="kanban-004"] [data-part="live"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="kanban-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS = ["Очередь", "В работе", "Проверка", "Готово"]

const DEFAULT_CARDS: Kanban004Card[] = [
  { id: "1", title: "Каталог: фасетный фильтр", column: "Очередь" },
  { id: "2", title: "Импорт остатков по расписанию", column: "Очередь" },
  { id: "3", title: "Страница компонента: вкладки", column: "В работе" },
  { id: "4", title: "Правки по договору", column: "Проверка" },
  { id: "5", title: "Миграция логов", column: "Готово" },
  { id: "6", title: "Отчёт за февраль", column: "Готово" },
]

/**
 * Доска со сворачиваемыми колонками: свёрнутая остаётся целью переноса.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Kanban004({
  columns = DEFAULT_COLUMNS,
  cards = DEFAULT_CARDS,
  collapsed = ["Готово"],
  onChange,
  accent,
  className,
  style,
  ...props
}: Kanban004Props) {
  const [board, setBoard] = useState(cards)
  const [shut, setShut] = useState(collapsed)
  const [dragged, setDragged] = useState<string | null>(null)
  const [over, setOver] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState("")

  const toggle = (column: string) => {
    const next = shut.includes(column)
      ? shut.filter((name) => name !== column)
      : [...shut, column]

    setShut(next)
    setAnnouncement(
      next.includes(column)
        ? `Колонка «${column}» свёрнута.`
        : `Колонка «${column}» развёрнута.`,
    )
  }

  const put = (id: string, column: string) => {
    const card = board.find((row) => row.id === id)
    if (!card || card.column === column) return

    const next = board.map((row) => (row.id === id ? { ...row, column } : row))
    setBoard(next)
    onChange?.(next)

    // Свёрнутая цель разворачивается: иначе карточка уезжает «в никуда».
    const wasShut = shut.includes(column)
    if (wasShut) setShut(shut.filter((name) => name !== column))

    setAnnouncement(
      `«${card.title}» перенесена в «${column}»${wasShut ? ", колонка развёрнута" : ""}.`,
    )
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
    ...(accent ? { "--vibeui-kanban-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-kanban-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="kanban-004"
        className={className}
        style={palette}
      >
        {columns.map((column, columnIndex) => {
          const rows = board.filter((card) => card.column === column)
          const isShut = shut.includes(column)

          return (
            <section
              key={column}
              data-part="column"
              data-collapsed={isShut}
              data-over={column === over}
              aria-label={`${column}: ${rows.length}`}
              onDragOver={(event) => {
                event.preventDefault()
                setOver(column)
              }}
              onDragLeave={() => setOver(null)}
              onDrop={(event) => drop(event, column)}
            >
              <button
                type="button"
                data-part="toggle"
                aria-expanded={!isShut}
                onClick={() => toggle(column)}
              >
                <span data-part="caret" aria-hidden="true">
                  {isShut ? "▸" : "▾"}
                </span>
                {column}
                <span data-part="count">{rows.length}</span>
              </button>
              <ul hidden={isShut}>
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

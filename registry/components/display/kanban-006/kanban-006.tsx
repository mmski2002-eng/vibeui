"use client"

import { useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Kanban006Card = {
  id: string
  title: string
  column: string
}

export type Kanban006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  columns?: string[]
  cards?: Kanban006Card[]
  hint?: string
  onChange?: (cards: Kanban006Card[]) => void
  accent?: string
}

// Идея компонента: доска, где перенос сделан клавиатурой в первую очередь, а не
// как запасной путь. Модель та же, что у мыши: карточку берут (пробел), несут
// (стрелки: влево и вправо — колонка, вверх и вниз — место в колонке), кладут
// (пробел) или бросают (Escape, порядок возвращается к исходному). Пока
// карточка «в руке», у неё поднятый вид и aria-grabbed, а каждый шаг
// проговаривается в живой области: без озвучки перенос вслепую невозможен.
// Escape восстанавливает снимок доски, сделанный в момент захвата.
const STYLES = `
:where([data-vibeui-block="kanban-006"]){
--vibeui-kanban-006-bg:oklch(0.985 0.002 265);
--vibeui-kanban-006-card:oklch(1 0 0);
--vibeui-kanban-006-fg:oklch(0.24 0.014 265);
--vibeui-kanban-006-muted:oklch(0.56 0.014 265);
--vibeui-kanban-006-border:oklch(0.91 0.006 265);
--vibeui-kanban-006-accent:oklch(0.55 0.2 262);
--vibeui-kanban-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="kanban-006"]{
position:relative;display:grid;gap:0.625rem;
width:100%;box-sizing:border-box;padding:0.75rem;
background:var(--vibeui-kanban-006-bg);
border:1px solid var(--vibeui-kanban-006-border);border-radius:0.875rem;
font-family:var(--vibeui-kanban-006-font);color:var(--vibeui-kanban-006-fg);
}
[data-vibeui-block="kanban-006"] *{box-sizing:border-box}
[data-vibeui-block="kanban-006"] [data-part="hint"]{
margin:0;font-size:0.6875rem;line-height:1.4;color:var(--vibeui-kanban-006-muted);
}
[data-vibeui-block="kanban-006"] [data-part="board"]{
display:grid;grid-auto-flow:column;grid-auto-columns:minmax(10.5rem,1fr);gap:0.625rem;overflow-x:auto;
}
[data-vibeui-block="kanban-006"] [data-part="column"]{
display:flex;flex-direction:column;gap:0.5rem;min-width:0;
padding:0.5rem;border-radius:0.75rem;border:1px dashed transparent;
}
/* Колонка, в которой сейчас «рука», подсвечена: цель переноса должна быть видна. */
[data-vibeui-block="kanban-006"] [data-part="column"][data-active="true"]{
border-color:var(--vibeui-kanban-006-accent);
background:color-mix(in oklab,var(--vibeui-kanban-006-accent) 6%,transparent);
}
[data-vibeui-block="kanban-006"] [data-part="head"]{
margin:0;display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="kanban-006"] [data-part="count"]{
color:var(--vibeui-kanban-006-muted);font-size:0.6875rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="kanban-006"] ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.375rem}
[data-vibeui-block="kanban-006"] [data-part="card"]{
appearance:none;display:block;width:100%;text-align:left;cursor:pointer;
padding:0.5rem;border-radius:0.625rem;
background:var(--vibeui-kanban-006-card);
border:1px solid var(--vibeui-kanban-006-border);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 6%);
color:inherit;font:inherit;font-size:0.75rem;line-height:1.35;
transition:transform .15s ease,box-shadow .15s ease,border-color .15s ease;
}
[data-vibeui-block="kanban-006"] [data-part="card"]:focus-visible{outline:2px solid var(--vibeui-kanban-006-accent);outline-offset:2px}
/* Поднятая карточка отличается тенью и сдвигом, а не только цветом рамки. */
[data-vibeui-block="kanban-006"] [data-part="card"][aria-grabbed="true"]{
border-color:var(--vibeui-kanban-006-accent);
box-shadow:0 8px 18px oklch(0.2 0.02 265 / 16%);
transform:translateY(-2px);
}
[data-vibeui-block="kanban-006"] [data-part="place"]{
display:block;margin-top:0.25rem;
color:var(--vibeui-kanban-006-muted);font-size:0.625rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="kanban-006"] [data-part="live"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="kanban-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS = ["Бэклог", "В работе", "Готово"]

const DEFAULT_CARDS: Kanban006Card[] = [
  { id: "1", title: "Расписание рассылок", column: "Бэклог" },
  { id: "2", title: "Поиск по каталогу", column: "Бэклог" },
  { id: "3", title: "Карта складов", column: "Бэклог" },
  { id: "4", title: "Оплата частями", column: "В работе" },
  { id: "5", title: "Онбординг", column: "Готово" },
]

/**
 * Доска с переносом карточки клавиатурой: взять, нести стрелками, положить.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Kanban006({
  columns = DEFAULT_COLUMNS,
  cards = DEFAULT_CARDS,
  hint = "Пробел берёт карточку, стрелки несут, пробел кладёт, Escape отменяет.",
  onChange,
  accent,
  className,
  style,
  ...props
}: Kanban006Props) {
  const [board, setBoard] = useState(cards)
  const [grabbed, setGrabbed] = useState<string | null>(null)
  const [snapshot, setSnapshot] = useState<Kanban006Card[]>(cards)
  const [announcement, setAnnouncement] = useState("")

  const apply = (next: Kanban006Card[]) => {
    setBoard(next)
    onChange?.(next)
  }

  const place = (list: Kanban006Card[], id: string) => {
    const card = list.find((row) => row.id === id)!
    const column = list.filter((row) => row.column === card.column)
    return `«${card.title}»: колонка «${card.column}», позиция ${column.indexOf(card) + 1} из ${column.length}.`
  }

  const moveWithin = (id: string, step: -1 | 1) => {
    const card = board.find((row) => row.id === id)!
    const column = board.filter((row) => row.column === card.column)
    const from = column.indexOf(card)
    const to = from + step

    if (to < 0 || to >= column.length) {
      setAnnouncement(`Край колонки. ${place(board, id)}`)
      return
    }

    const next = [...board]
    const a = next.indexOf(column[from])
    const b = next.indexOf(column[to])
    ;[next[a], next[b]] = [next[b], next[a]]
    apply(next)
    setAnnouncement(place(next, id))
  }

  const moveAcross = (id: string, step: -1 | 1) => {
    const card = board.find((row) => row.id === id)!
    const target = columns[columns.indexOf(card.column) + step]

    if (!target) {
      setAnnouncement(`Край доски. ${place(board, id)}`)
      return
    }

    const rest = board.filter((row) => row.id !== id)
    const moved = { ...card, column: target }
    const last = rest.map((row) => row.column).lastIndexOf(target)
    const next = [...rest]
    next.splice(last + 1, 0, moved)
    apply(next)
    setAnnouncement(place(next, id))
  }

  const handleKey = (event: KeyboardEvent<HTMLButtonElement>, id: string) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault()

      if (grabbed === id) {
        setGrabbed(null)
        setAnnouncement(`Положено. ${place(board, id)}`)
      } else {
        setGrabbed(id)
        setSnapshot(board)
        setAnnouncement(`Взято. ${place(board, id)} Стрелки несут карточку.`)
      }

      return
    }

    if (event.key === "Escape" && grabbed === id) {
      event.preventDefault()
      apply(snapshot)
      setGrabbed(null)
      setAnnouncement(`Перенос отменён. ${place(snapshot, id)}`)
      return
    }

    if (grabbed !== id) return

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault()
      moveAcross(id, event.key === "ArrowLeft" ? -1 : 1)
    }

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault()
      moveWithin(id, event.key === "ArrowUp" ? -1 : 1)
    }
  }

  const held = board.find((row) => row.id === grabbed)

  const palette = {
    ...(accent ? { "--vibeui-kanban-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-kanban-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="kanban-006"
        className={className}
        style={palette}
      >
        <p data-part="hint">{hint}</p>
        <div data-part="board">
          {columns.map((column) => {
            const rows = board.filter((card) => card.column === column)

            return (
              <section
                key={column}
                data-part="column"
                data-active={held?.column === column}
                aria-label={`${column}: ${rows.length}`}
              >
                <p data-part="head">
                  {column}
                  <span data-part="count">{rows.length}</span>
                </p>
                <ul>
                  {rows.map((card, index) => (
                    <li key={card.id}>
                      <button
                        type="button"
                        data-part="card"
                        aria-grabbed={card.id === grabbed}
                        aria-label={`${card.title}, колонка «${column}», позиция ${index + 1} из ${rows.length}`}
                        onKeyDown={(event) => handleKey(event, card.id)}
                        onBlur={() => {
                          if (grabbed === card.id) setGrabbed(null)
                        }}
                      >
                        {card.title}
                        <span data-part="place" aria-hidden="true">
                          {index + 1} / {rows.length}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
        <span data-part="live" role="status" aria-live="assertive">
          {announcement}
        </span>
      </div>
    </>
  )
}

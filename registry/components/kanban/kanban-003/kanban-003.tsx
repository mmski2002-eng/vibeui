"use client"

import { useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  DragEvent,
  KeyboardEvent,
} from "react"

export type Kanban003Card = {
  id: string
  title: string
  assignee: string
  due: string
  column: string
}

export type Kanban003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  columns?: string[]
  cards?: Kanban003Card[]
  today?: string
  onChange?: (cards: Kanban003Card[]) => void
  /** Подписи и объявления: шаблоны с {title}, {assignee}, {due}, {name}. */
  text?: Record<string, string>
  /** Пусто — подложки нет, доска лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  late?: string
}

// Идея компонента: карточка, которая отвечает на два вопроса до открытия — кто
// делает и когда срок. Инициалы исполнителя окрашены оттенком, посчитанным из
// его имени, поэтому одинаковых кружков подряд не бывает и палитру не надо
// вести руками. Срок сравнивается со строкой даты из пропа, а не с текущим
// временем: Date.now() на сервере и на клиенте разный и ломает гидрацию.
// Просроченный срок помечен словом и знаком, а не только красным цветом.
// Перенос: мышью — drag, с клавиатуры — стрелки влево и вправо на самой
// карточке, результат объявляется в живой области.
//
// Тема берётся из color-scheme окружения через light-dark(): доска темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="kanban-003"]){
--vibeui-kanban-003-bg:transparent;
--vibeui-kanban-003-card:light-dark(oklch(1 0 0),oklch(0.27 0.012 265));
--vibeui-kanban-003-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-kanban-003-muted:light-dark(oklch(0.56 0.014 265),oklch(0.71 0.012 265));
--vibeui-kanban-003-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-kanban-003-accent:light-dark(oklch(0.55 0.2 262),oklch(0.75 0.15 262));
--vibeui-kanban-003-late:light-dark(oklch(0.58 0.19 27),oklch(0.74 0.16 27));
--vibeui-kanban-003-shadow:light-dark(oklch(0.2 0.02 265 / 6%),oklch(0 0 0 / 32%));
--vibeui-kanban-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="kanban-003"]{
position:relative;display:grid;grid-auto-flow:column;grid-auto-columns:minmax(11.5rem,1fr);gap:0.625rem;
width:100%;box-sizing:border-box;padding:0.75rem;overflow-x:auto;
background:var(--vibeui-kanban-003-bg);
border:1px solid var(--vibeui-kanban-003-border);border-radius:0.875rem;
font-family:var(--vibeui-kanban-003-font);color:var(--vibeui-kanban-003-fg);
}
[data-vibeui-block="kanban-003"] *{box-sizing:border-box}
[data-vibeui-block="kanban-003"] [data-part="column"]{
display:flex;flex-direction:column;gap:0.5rem;min-width:0;
padding:0.5rem;border-radius:0.75rem;border:1px dashed transparent;
}
[data-vibeui-block="kanban-003"] [data-part="column"][data-over="true"]{
border-color:var(--vibeui-kanban-003-accent);
background:color-mix(in oklab,var(--vibeui-kanban-003-accent) 6%,transparent);
}
[data-vibeui-block="kanban-003"] [data-part="head"]{
margin:0;display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="kanban-003"] [data-part="count"]{
color:var(--vibeui-kanban-003-muted);font-size:0.6875rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="kanban-003"] ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.375rem}
[data-vibeui-block="kanban-003"] [data-part="card"]{
display:grid;gap:0.5rem;padding:0.5rem;border-radius:0.625rem;cursor:grab;
background:var(--vibeui-kanban-003-card);
border:1px solid var(--vibeui-kanban-003-border);
box-shadow:0 1px 2px var(--vibeui-kanban-003-shadow);
font-size:0.75rem;line-height:1.35;
}
/* Карточка сама принимает фокус: перенос стрелками не требует лишних кнопок. */
[data-vibeui-block="kanban-003"] [data-part="card"]:focus-visible{
outline:2px solid var(--vibeui-kanban-003-accent);outline-offset:2px;
}
[data-vibeui-block="kanban-003"] [data-part="card"][data-dragging="true"]{opacity:.45}
[data-vibeui-block="kanban-003"] [data-part="foot"]{
display:flex;align-items:center;gap:0.375rem;
}
/* Оттенок инициалов считается из имени: палитру исполнителей не надо вести руками. */
[data-vibeui-block="kanban-003"] [data-part="who"]{
flex:none;display:grid;place-items:center;width:1.375rem;height:1.375rem;border-radius:999px;
background:color-mix(in oklab,var(--vibeui-kanban-003-hue) 18%,white);
color:color-mix(in oklab,var(--vibeui-kanban-003-hue) 78%,black);
font-size:0.5625rem;font-weight:700;line-height:1;
}
[data-vibeui-block="kanban-003"] [data-part="due"]{
margin-left:auto;display:inline-flex;align-items:center;gap:0.25rem;
color:var(--vibeui-kanban-003-muted);font-size:0.6875rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="kanban-003"] [data-part="card"][data-late="true"] [data-part="due"]{
color:var(--vibeui-kanban-003-late);font-weight:650;
}
[data-vibeui-block="kanban-003"] [data-part="live"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="kanban-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS = ["Очередь", "В работе", "Готово"]

const DEFAULT_CARDS: Kanban003Card[] = [
  {
    id: "1",
    title: "Согласовать смету по второму этапу",
    assignee: "Ирина Лаптева",
    due: "2026-03-16",
    column: "Очередь",
  },
  {
    id: "2",
    title: "Собрать отчёт по гарантиям",
    assignee: "Пётр Ким",
    due: "2026-03-24",
    column: "Очередь",
  },
  {
    id: "3",
    title: "Перенести оплату на новый шлюз",
    assignee: "Мария Ковалёва",
    due: "2026-03-19",
    column: "В работе",
  },
  {
    id: "4",
    title: "Обновить тексты писем",
    assignee: "Пётр Ким",
    due: "2026-03-12",
    column: "Готово",
  },
]

function hue(name: string) {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

function shortDate(value: string) {
  const [, month, day] = value.split("-")
  return `${day}.${month}`
}

const DEFAULT_TEXT: Record<string, string> = {
  moved: "«{title}» перенесена в «{name}».",
  edge: "«{title}» уже в крайней колонке «{name}».",
  card: "{title}. Исполнитель {assignee}. Срок {due}{overdue}. Колонка «{name}». Стрелки влево и вправо переносят карточку.",
  overdue: ", просрочен",
  due: "до",
  late: "просрочен",
}

/** Подстановка значений в шаблон подписи. */
function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in values ? values[key] : whole,
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
 * Доска, где карточка называет исполнителя и срок; просрочка помечена словом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Kanban003({
  columns = DEFAULT_COLUMNS,
  cards = DEFAULT_CARDS,
  today = "2026-03-18",
  onChange,
  text,
  background = "",
  accent,
  late,
  className,
  style,
  ...props
}: Kanban003Props) {
  const labels = { ...DEFAULT_TEXT, ...text }
  const [board, setBoard] = useState(cards)
  const [dragged, setDragged] = useState<string | null>(null)
  const [over, setOver] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState("")

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

    if (!target) {
      setAnnouncement(
        fill(labels.edge, { title: card.title, name: card.column }),
      )
      return
    }

    put(id, target)
  }

  const handleKey = (event: KeyboardEvent<HTMLElement>, id: string) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
    event.preventDefault()
    shift(id, event.key === "ArrowLeft" ? -1 : 1)
  }

  const drop = (event: DragEvent<HTMLElement>, column: string) => {
    event.preventDefault()
    setOver(null)
    if (dragged) put(dragged, column)
    setDragged(null)
  }

  const palette = {
    ...(accent ? { "--vibeui-kanban-003-accent": accent } : null),
    ...(late ? { "--vibeui-kanban-003-late": late } : null),
    ...(background
      ? {
          "--vibeui-kanban-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-kanban-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="kanban-003"
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
                {rows.map((card) => {
                  const overdue = card.due < today

                  return (
                    <li key={card.id}>
                      <article
                        data-part="card"
                        data-dragging={card.id === dragged}
                        data-late={overdue}
                        draggable
                        tabIndex={0}
                        aria-label={fill(labels.card, {
                          title: card.title,
                          assignee: card.assignee,
                          due: shortDate(card.due),
                          overdue: overdue ? labels.overdue : "",
                          name: column,
                        })}
                        style={
                          {
                            "--vibeui-kanban-003-hue": `oklch(0.62 0.16 ${hue(card.assignee)})`,
                          } as CSSProperties
                        }
                        onKeyDown={(event) => handleKey(event, card.id)}
                        onDragStart={() => setDragged(card.id)}
                        onDragEnd={() => {
                          setDragged(null)
                          setOver(null)
                        }}
                      >
                        <span>{card.title}</span>
                        <span data-part="foot">
                          <span data-part="who" aria-hidden="true">
                            {initials(card.assignee)}
                          </span>
                          <span data-part="due" aria-hidden="true">
                            {overdue ? labels.late : labels.due}{" "}
                            {shortDate(card.due)}
                          </span>
                        </span>
                      </article>
                    </li>
                  )
                })}
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

"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties, DragEvent } from "react"

export type Kanban007Card = {
  id: string
  title: string
  hours: number
  /** Оттенок полосы и плашки часов в градусах oklch: 0 — красный, 150 — зелёный. */
  hue?: number
  column: string
}

export type Kanban007Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  columns?: string[]
  cards?: Kanban007Card[]
  unit?: string
  onChange?: (cards: Kanban007Card[]) => void
  /** Подписи и объявления: шаблоны с {name}, {title}, {count}, {total}, {unit}. */
  text?: Record<string, string>
  /** Пусто — подложки нет, доска лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: доска, которая считает не карточки, а часы. Итог колонки и
// итог доски выводятся из карточек при каждом рендере — хранить их отдельным
// числом нельзя, после первого же переноса оно разойдётся с содержимым. Доля
// колонки показана и цифрой, и полосой: полоса даёт сравнение колонок с одного
// взгляда, цифра — точность. Итоговая строка сделана тегом footer со сводкой
// словами, поэтому её читают и глазами, и скринридером. Перенос: мышью — drag,
// с клавиатуры — ряд чипов-колонок на карточке, результат объявляется вслух.
//
// Тема берётся из color-scheme окружения через light-dark(): доска темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="kanban-007"]){
--vibeui-kanban-007-bg:transparent;
--vibeui-kanban-007-card:light-dark(oklch(1 0 0),oklch(0.27 0.012 265));
--vibeui-kanban-007-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-kanban-007-muted:color-mix(in oklab,var(--vibeui-kanban-007-fg) 68%,transparent);
--vibeui-kanban-007-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-kanban-007-accent:light-dark(oklch(0.55 0.2 262),oklch(0.75 0.15 262));
--vibeui-kanban-007-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.03 262));
--vibeui-kanban-007-shadow:light-dark(oklch(0.2 0.02 265 / 6%),oklch(0 0 0 / 32%));
--vibeui-kanban-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="kanban-007"]{color-scheme:dark}
[data-vibeui-block="kanban-007"]{
position:relative;display:grid;gap:0.625rem;
width:100%;box-sizing:border-box;padding:0.75rem;
background:var(--vibeui-kanban-007-bg);
border:1px solid var(--vibeui-kanban-007-border);border-radius:0.875rem;
font-family:var(--vibeui-kanban-007-font);color:var(--vibeui-kanban-007-fg);
}
[data-vibeui-block="kanban-007"] *{box-sizing:border-box}
[data-vibeui-block="kanban-007"] [data-part="board"]{
display:grid;grid-auto-flow:column;grid-auto-columns:minmax(11rem,1fr);gap:0.625rem;overflow-x:auto;
}
[data-vibeui-block="kanban-007"] [data-part="column"]{
display:flex;flex-direction:column;gap:0.5rem;min-width:0;
padding:0.5rem;border-radius:0.75rem;border:1px dashed transparent;
}
[data-vibeui-block="kanban-007"] [data-part="column"][data-over="true"]{
border-color:var(--vibeui-kanban-007-accent);
background:color-mix(in oklab,var(--vibeui-kanban-007-accent) 6%,transparent);
}
[data-vibeui-block="kanban-007"] [data-part="head"]{
margin:0;display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="kanban-007"] [data-part="count"]{
color:var(--vibeui-kanban-007-muted);font-size:0.6875rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="kanban-007"] ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.375rem;flex:1 1 auto}
[data-vibeui-block="kanban-007"] [data-part="card"]{
display:grid;gap:0.375rem;padding:0.5rem;border-radius:0.625rem;cursor:grab;
background:var(--vibeui-kanban-007-card);
border:1px solid var(--vibeui-kanban-007-border);
box-shadow:0 1px 2px var(--vibeui-kanban-007-shadow);
font-size:0.75rem;line-height:1.35;
}
[data-vibeui-block="kanban-007"] [data-part="card"][data-dragging="true"]{opacity:.45}
/* Оттенок приходит из данных: по цвету полосы видно вес задачи ещё до чтения
   часов, и оттенок задаётся одним числом, а не новой переменной темы. */
[data-vibeui-block="kanban-007"] [data-part="card"]{
--vibeui-kanban-007-mark:light-dark(oklch(0.5 0.16 var(--vibeui-kanban-007-hue,262)),oklch(0.78 0.14 var(--vibeui-kanban-007-hue,262)));
border-left:3px solid var(--vibeui-kanban-007-mark);
}
[data-vibeui-block="kanban-007"] [data-part="hours"]{
justify-self:start;padding:0 0.375rem;border-radius:0.375rem;
background:color-mix(in oklab,var(--vibeui-kanban-007-mark) 16%,transparent);
color:var(--vibeui-kanban-007-mark);
font-size:0.625rem;font-weight:650;font-variant-numeric:tabular-nums;
}
/* Второй путь переноса: чипы-кнопки с aria-pressed вместо списка выбора.
   Список внутри карточки выглядит формой и уводит внимание с задачи. */
[data-vibeui-block="kanban-007"] [data-part="move"]{
display:flex;flex-wrap:wrap;gap:0.25rem;
}
[data-vibeui-block="kanban-007"] [data-part="chip"]{
appearance:none;cursor:pointer;
padding:0.0625rem 0.4375rem;border-radius:9999px;
border:1px solid var(--vibeui-kanban-007-border);
background:none;color:var(--vibeui-kanban-007-muted);
font:inherit;font-size:0.625rem;font-weight:600;line-height:1.5;
transition:background-color .15s ease,color .15s ease,border-color .15s ease;
}
[data-vibeui-block="kanban-007"] [data-part="chip"]:hover{
border-color:var(--vibeui-kanban-007-accent);color:var(--vibeui-kanban-007-fg);
}
[data-vibeui-block="kanban-007"] [data-part="chip"][aria-pressed="true"]{
background:var(--vibeui-kanban-007-accent);
border-color:var(--vibeui-kanban-007-accent);
color:var(--vibeui-kanban-007-on-accent);cursor:default;
}
[data-vibeui-block="kanban-007"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-kanban-007-accent);outline-offset:1px}
/* Итог колонки считается из карточек: отдельное число разошлось бы после переноса. */
[data-vibeui-block="kanban-007"] [data-part="total"]{
display:grid;gap:0.25rem;padding-top:0.375rem;
border-top:1px solid var(--vibeui-kanban-007-border);
font-size:0.6875rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="kanban-007"] [data-part="share"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
color:var(--vibeui-kanban-007-muted);font-weight:600;
}
[data-vibeui-block="kanban-007"] [data-part="bar"]{
height:3px;border-radius:999px;overflow:hidden;
background:color-mix(in oklab,var(--vibeui-kanban-007-muted) 20%,transparent);
}
[data-vibeui-block="kanban-007"] [data-part="bar"] span{display:block;height:100%;background:var(--vibeui-kanban-007-accent)}
[data-vibeui-block="kanban-007"] footer{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
padding-top:0.5rem;border-top:1px solid var(--vibeui-kanban-007-border);
font-size:0.75rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="kanban-007"] footer span{color:var(--vibeui-kanban-007-muted);font-weight:600;font-size:0.6875rem}
[data-vibeui-block="kanban-007"] [data-part="live"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="kanban-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS = ["Оценено", "В работе", "Сдано"]

const DEFAULT_CARDS: Kanban007Card[] = [
  { id: "1", title: "Каталог: фильтры", hours: 12, hue: 262, column: "Оценено" },
  { id: "2", title: "Экспорт заказов", hours: 6, hue: 150, column: "Оценено" },
  { id: "3", title: "Личный кабинет", hours: 20, hue: 25, column: "В работе" },
  { id: "4", title: "Импорт остатков", hours: 8, hue: 60, column: "В работе" },
  { id: "5", title: "Страница тарифов", hours: 5, hue: 150, column: "Сдано" },
]

const DEFAULT_TEXT: Record<string, string> = {
  moved: "«{title}» перенесена в «{name}». Итог колонки {total} {unit}.",
  column: "{name}: {count} задач, {total} {unit}",
  picker: "Колонка задачи «{title}»",
  grand: "Итого: {total} {unit}",
  summary: "{count} задач в {columns} колонках",
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
 * Доска со счётчиками и итогом по колонкам: часы суммируются из карточек.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Kanban007({
  columns = DEFAULT_COLUMNS,
  cards = DEFAULT_CARDS,
  unit = "ч",
  onChange,
  text,
  background = "",
  accent,
  className,
  style,
  ...props
}: Kanban007Props) {
  const labels = { ...DEFAULT_TEXT, ...text }
  const [board, setBoard] = useState(cards)
  const [dragged, setDragged] = useState<string | null>(null)
  const [over, setOver] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState("")

  const grand = board.reduce((sum, card) => sum + card.hours, 0)

  const put = (id: string, column: string) => {
    const card = board.find((row) => row.id === id)
    if (!card || card.column === column) return

    const next = board.map((row) => (row.id === id ? { ...row, column } : row))
    const total = next
      .filter((row) => row.column === column)
      .reduce((sum, row) => sum + row.hours, 0)

    setBoard(next)
    onChange?.(next)
    setAnnouncement(
      fill(labels.moved, { title: card.title, name: column, total, unit }),
    )
  }

  const drop = (event: DragEvent<HTMLElement>, column: string) => {
    event.preventDefault()
    setOver(null)
    if (dragged) put(dragged, column)
    setDragged(null)
  }

  const palette = {
    ...(accent ? { "--vibeui-kanban-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-kanban-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-kanban-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="kanban"
        data-vibeui-block="kanban-007"
        className={className}
        style={palette}
      >
        <div data-part="board">
          {columns.map((column) => {
            const rows = board.filter((card) => card.column === column)
            const total = rows.reduce((sum, card) => sum + card.hours, 0)
            const share = grand === 0 ? 0 : Math.round((total / grand) * 100)

            return (
              <section
                key={column}
                data-part="column"
                data-over={column === over}
                aria-label={fill(labels.column, {
                  name: column,
                  count: rows.length,
                  total,
                  unit,
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
                  <span data-part="count">{rows.length}</span>
                </p>
                <ul>
                  {rows.map((card) => (
                    <li key={card.id}>
                      <article
                        data-part="card"
                        data-dragging={card.id === dragged}
                        draggable
                        style={
                          card.hue === undefined
                            ? undefined
                            : ({
                                "--vibeui-kanban-007-hue": card.hue,
                              } as CSSProperties)
                        }
                        onDragStart={() => setDragged(card.id)}
                        onDragEnd={() => {
                          setDragged(null)
                          setOver(null)
                        }}
                      >
                        {card.title}
                        <span data-part="hours">
                          {card.hours} {unit}
                        </span>
                        <div
                          data-part="move"
                          role="group"
                          aria-label={fill(labels.picker, {
                            title: card.title,
                          })}
                        >
                          {columns.map((option) => (
                            <button
                              key={option}
                              type="button"
                              data-part="chip"
                              aria-pressed={option === card.column}
                              onClick={() => put(card.id, option)}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </article>
                    </li>
                  ))}
                </ul>
                <p data-part="total">
                  <span data-part="share">
                    <span>
                      {total} {unit}
                    </span>
                    <span>{share}%</span>
                  </span>
                  <span data-part="bar" aria-hidden="true">
                    <span style={{ width: `${share}%` }} />
                  </span>
                </p>
              </section>
            )
          })}
        </div>
        <footer>
          {fill(labels.grand, { total: grand, unit })}
          <span>
            {fill(labels.summary, {
              count: board.length,
              columns: columns.length,
            })}
          </span>
        </footer>
        <span data-part="live" role="status" aria-live="polite">
          {announcement}
        </span>
      </div>
    </>
  )
}
